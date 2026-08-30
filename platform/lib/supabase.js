// Talks to Supabase's REST API (PostgREST) directly over fetch - no SDK
// dependency, so a broken lockfile can never break this again (see
// platform/README.md's "Fixed" section for that history).
//
// The key below is Supabase's publishable key, meant to be embedded in
// client code - it is not a secret. Access control is Row Level Security:
// ledger_people allows select/insert/update (Alex edits his own CRM
// directly); ledger_feedback allows select/insert only (status and reply
// are Claude's job, via its own Supabase session, not a public edit). No
// delete anywhere from this key. The whole site also sits behind Vercel
// Authentication already. See the "AI Central // Admin" Supabase project.
const SUPABASE_URL = "https://hvzmgpdfznjdxnruiqmy.supabase.co";
const SUPABASE_KEY = "sb_publishable_2F9MJfYcRGJ8PWNBS2yslQ_ojzCcDvB";

const REST_URL = `${SUPABASE_URL}/rest/v1`;

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

export async function supabaseSelect(table, query = "") {
  const res = await fetch(`${REST_URL}/${table}${query}`, {
    headers: HEADERS,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Supabase select failed on ${table}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function supabaseInsert(table, row) {
  const res = await fetch(`${REST_URL}/${table}`, {
    method: "POST",
    headers: { ...HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Supabase insert failed on ${table}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// Insert-or-update on a unique column (e.g. a URL) in one round trip,
// via PostgREST's upsert support. `conflictColumn` must have a unique
// index - see ledger_linkedin_connections_url_uq for the one existing
// use of this.
export async function supabaseUpsert(table, rows, conflictColumn) {
  const res = await fetch(`${REST_URL}/${table}?on_conflict=${conflictColumn}`, {
    method: "POST",
    headers: { ...HEADERS, Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(rows),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Supabase upsert failed on ${table}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function supabaseUpdate(table, query, patch) {
  const res = await fetch(`${REST_URL}/${table}${query}`, {
    method: "PATCH",
    headers: { ...HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(patch),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Supabase update failed on ${table}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
