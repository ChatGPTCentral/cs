import { supabaseSelect, supabaseUpsert } from "../../../lib/supabase";
import connections from "../../../data/linkedin-connections.json";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const ACTOR_ID = "2SyF0bVxmgGr8IVCZ"; // dev_fusion/Linkedin-Profile-Scraper, $10/1000 profiles
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200; // keeps one run's cost and runtime bounded

function normalizeUrl(u) {
  if (!u) return "";
  return u.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

// Enriches the most recent N connections from the full LinkedIn export
// (platform/data/linkedin-connections.json, 10k+ rows) with a real photo,
// via Apify. This is the /leads exploration list, not ledger_people - see
// /api/enrich-linkedin for the (separate, smaller) CRM-people version.
//
// Visit /api/enrich-leads?limit=50 in the browser once per batch (the
// site sits behind Vercel Authentication already). Costs about $0.01 per
// profile on Apify's side. Results are upserted into
// ledger_linkedin_connections (photo_url column) keyed by LinkedIn URL -
// /leads reads that table to show a photo next to a match. Running this
// against the full 10k+ file would cost ~$100+; that needs Alex's
// explicit go-ahead first, this endpoint only ever processes one bounded
// batch per call.
export async function GET(request) {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return Response.json({ error: "APIFY_TOKEN not set on Vercel" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || DEFAULT_LIMIT, MAX_LIMIT);

  const alreadyEnriched = await supabaseSelect(
    "ledger_linkedin_connections",
    "?photo_url=not.is.null&select=linkedin_url"
  );
  const enrichedUrls = new Set(alreadyEnriched.map((r) => normalizeUrl(r.linkedin_url)));

  const sorted = [...connections]
    .filter((c) => c.url && !enrichedUrls.has(normalizeUrl(c.url)))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const targets = sorted.slice(0, limit);

  if (targets.length === 0) {
    return Response.json({ message: "No unenriched connections left in the requested range." });
  }

  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileUrls: targets.map((c) => c.url) }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    return Response.json({ error: `Apify call failed: ${res.status}`, detail }, { status: 502 });
  }

  const items = await res.json();
  const targetsByUrl = new Map(targets.map((c) => [normalizeUrl(c.url), c]));

  const upsertRows = [];
  const results = [];
  for (const item of items) {
    const sourceUrl = item.linkedinUrl || item.linkedinPublicUrl || item.inputUrl || null;
    const photo = item.profilePicHighQuality || item.profilePic || null;
    const isPlaceholder = !!(photo && photo.includes("static.licdn.com"));
    const target = sourceUrl ? targetsByUrl.get(normalizeUrl(sourceUrl)) : null;

    if (target && photo && !isPlaceholder) {
      upsertRows.push({
        first_name: target.fn,
        last_name: target.ln,
        linkedin_url: target.url,
        company: target.company,
        position: target.position,
        connected_on: target.date,
        photo_url: photo,
      });
    }

    results.push({
      name: target ? `${target.fn} ${target.ln}` : null,
      succeeded: item.succeeded !== false,
      hasPhoto: !!photo && !isPlaceholder,
    });
  }

  if (upsertRows.length > 0) {
    await supabaseUpsert("ledger_linkedin_connections", upsertRows, "linkedin_url");
  }

  return Response.json({
    processed: items.length,
    photosFound: upsertRows.length,
    remainingUnenriched: sorted.length - targets.length,
    results,
  });
}
