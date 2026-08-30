import { supabaseSelect, supabaseUpdate } from "../../../lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const ACTOR_ID = "2SyF0bVxmgGr8IVCZ"; // dev_fusion/Linkedin-Profile-Scraper, $10/1000 profiles

// The 18 people already confirmed as real LinkedIn connections (see
// ledger_people.linkedin_connected) who have no real photo yet - either
// null, or LinkedIn's generic silhouette placeholder (the Apollo test
// on Daniel Frignito returned that placeholder, not a real photo, so
// he stays in this list to see if Apify does better).
const TEST_URLS = [
  "https://www.linkedin.com/in/annadubrovskaya",
  "https://www.linkedin.com/in/ciensolon",
  "https://www.linkedin.com/in/dbusta",
  "https://www.linkedin.com/in/danielfrignito",
  "https://www.linkedin.com/in/dylanredekop",
  "https://www.linkedin.com/in/elettrafiumi",
  "https://www.linkedin.com/in/frayaejbrinkman",
  "http://www.linkedin.com/in/ianbarto",
  "https://www.linkedin.com/in/javeriyaahsan-brandingstrategist",
  "https://www.linkedin.com/in/jorgemedinacastillo",
  "https://www.linkedin.com/in/katieclarkfortunato",
  "https://www.linkedin.com/in/mannyreyesm",
  "https://www.linkedin.com/in/marcduke",
  "https://www.linkedin.com/in/matt-mcgarry",
  "http://www.linkedin.com/in/brian-schneider-nyc",
  "http://www.linkedin.com/in/ceylan-ersoy",
  "http://www.linkedin.com/in/christienabraham",
  "http://www.linkedin.com/in/honeyh",
];

function normalizeUrl(u) {
  if (!u) return "";
  return u.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

// One-off pilot endpoint for the Apify LinkedIn enrichment test - visit
// this URL once in the browser (the site already sits behind Vercel
// Authentication, so this isn't public). Costs about $0.01 per profile
// on Apify's side for this run (18 profiles). Writes results into
// ledger_people.pending_photo_url - the existing Apollo review queue on
// /people/review - never the live photo_url field directly. Delete this
// route once the pilot is evaluated and a real batch flow is decided.
export async function GET() {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return Response.json({ error: "APIFY_TOKEN not set on Vercel" }, { status: 500 });
  }

  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileUrls: TEST_URLS }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    return Response.json({ error: `Apify call failed: ${res.status}`, detail }, { status: 502 });
  }

  const items = await res.json();
  const people = await supabaseSelect("ledger_people", "?select=id,name,linkedin_url");
  const peopleByUrl = new Map(people.map((p) => [normalizeUrl(p.linkedin_url), p]));

  const results = [];
  for (const [index, item] of items.entries()) {
    const sourceUrl = item.linkedinUrl || item.linkedinPublicUrl || item.inputUrl || null;
    const photo =
      item.profilePicture ||
      item.profilePictureUrl ||
      item.profileImage ||
      item.profileImageUrl ||
      item.profilePic ||
      item.profilePicHighQuality ||
      item.picture ||
      item.pictureUrl ||
      item.photo ||
      item.photoUrl ||
      item.avatarUrl ||
      item.avatar ||
      item.img ||
      item.imageUrl ||
      null;
    const isPlaceholder = !!(photo && photo.includes("static.licdn.com"));
    const person = sourceUrl ? peopleByUrl.get(normalizeUrl(sourceUrl)) : null;

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
      sourceUrl,
      matchedPersonId: person?.id || null,
      matchedPersonName: person?.name || null,
      succeeded: item.succeeded !== false,
      fullName: item.fullName || null,
      headline: item.headline || null,
      hasPhoto: !!photo,
      isPlaceholder,
      writtenToPendingReview,
      // Debug only, first item - none of the guessed field names above
      // matched on the first pilot run, so dump the real keys once to
      // find the actual photo field name instead of guessing again.
      ...(index === 0 ? { debugAllKeys: Object.keys(item) } : {}),
    });
  }

  return Response.json({ total: items.length, results });
}
