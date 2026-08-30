import { supabaseSelect, supabaseUpdate } from "../../../lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const ACTOR_ID = "2SyF0bVxmgGr8IVCZ"; // dev_fusion/Linkedin-Profile-Scraper, $10/1000 profiles
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100; // keeps one run's cost and runtime bounded

function normalizeUrl(u) {
  if (!u) return "";
  return u.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

// Enriches real CRM people (ledger_people) who have a LinkedIn URl but no
// real photo yet - null, or LinkedIn's generic silhouette placeholder.
// Visit /api/enrich-linkedin-test?limit=25 in the browser once per batch
// (the site sits behind Vercel Authentication already, so this isn't
// public). Costs about $0.01 per profile on Apify's side. Writes real
// photo hits into ledger_people.pending_photo_url - the existing Apollo
// review queue on /people/review - never the live photo_url field.
//
// This is scoped to ledger_people only (a few hundred rows at most), not
// the 10k+ row exploration file at platform/data/linkedin-connections.json
// - enriching that whole file is a separate, much larger spend (~$100+
// for all of it) that needs Alex's explicit go-ahead on cost before
// running, not something this endpoint does on its own.
export async function GET(request) {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return Response.json({ error: "APIFY_TOKEN not set on Vercel" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || DEFAULT_LIMIT, MAX_LIMIT);

  const candidates = await supabaseSelect(
    "ledger_people",
    "?select=id,name,linkedin_url,photo_url&linkedin_url=not.is.null&pending_photo_url=is.null&archived=eq.false"
  );
  const targets = candidates
    .filter((p) => !p.photo_url || p.photo_url.includes("static.licdn.com"))
    .slice(0, limit);

  if (targets.length === 0) {
    return Response.json({ message: "No candidates left - everyone with a LinkedIn URL already has a real photo or a pending one." });
  }

  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileUrls: targets.map((p) => p.linkedin_url) }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    return Response.json({ error: `Apify call failed: ${res.status}`, detail }, { status: 502 });
  }

  const items = await res.json();
  const targetsByUrl = new Map(targets.map((p) => [normalizeUrl(p.linkedin_url), p]));

  const results = [];
  for (const item of items) {
    const sourceUrl = item.linkedinUrl || item.linkedinPublicUrl || item.inputUrl || null;
    const photo = item.profilePicHighQuality || item.profilePic || null;
    const isPlaceholder = !!(photo && photo.includes("static.licdn.com"));
    const person = sourceUrl ? targetsByUrl.get(normalizeUrl(sourceUrl)) : null;

    let writtenToPendingReview = false;
    if (person && photo && !isPlaceholder) {
      await supabaseUpdate("ledger_people", `?id=eq.${person.id}`, {
        pending_photo_url: photo,
        pending_match_name: item.fullName || null,
        pending_match_title: item.headline || null,
      });
      writtenToPendingReview = true;
    }

    results.push({
      matchedPersonName: person?.name || null,
      succeeded: item.succeeded !== false,
      hasPhoto: !!photo,
      writtenToPendingReview,
    });
  }

  const remaining = candidates.length - targets.length;
  return Response.json({
    processed: items.length,
    photosFound: results.filter((r) => r.writtenToPendingReview).length,
    remainingCandidates: remaining,
    results,
  });
}
