// Talks to Supabase's REST API (PostgREST) directly over fetch - no SDK
// dependency, so a broken lockfile can never break this again (see
// platform/README.md's "Fixed" section for that history).
//
// The key below is Supabase's publishable key, meant to be embedded in
// client code - it is not a secret. Access control is Row Level Security on
// the ledger_people / ledger_feedback tables (select + insert only, no
// update or delete), plus the fact that the whole site sits behind Vercel
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
