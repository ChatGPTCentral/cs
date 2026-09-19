// A second Supabase project - "AI Central // Quiz (Prod)" - read here only
// for the live AI Library Trials count on Today's Targets panel. Same
// no-SDK, plain-fetch pattern as lib/supabase.js, and the same kind of key
// (publishable, meant to be embedded client/server-side - not a secret).
const QUIZ_SUPABASE_URL = "https://jcciwvaqbkxwtufvtiog.supabase.co";
const QUIZ_SUPABASE_KEY = "sb_publishable_cwMolgoNSOIHjmuNgFe_pw_bWrC0Rhl";

const REST_URL = `${QUIZ_SUPABASE_URL}/rest/v1`;

const HEADERS = {
  apikey: QUIZ_SUPABASE_KEY,
  Authorization: `Bearer ${QUIZ_SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

export async function quizSupabaseSelect(table, query = "") {
  const res = await fetch(`${REST_URL}/${table}${query}`, {
    headers: HEADERS,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Quiz Supabase select failed on ${table}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// trial_ledger carries real customer/charge detail and has no anon grant
// at all - trials_mtd_count() is a SECURITY DEFINER function that reads
// it server-side and hands back one count, never a row. Same pattern as
// lib/supabase.js's supabaseRpc, kept separate since it's a different
// Supabase project.
export async function quizSupabaseRpc(fn, args = {}) {
  const res = await fetch(`${REST_URL}/rpc/${fn}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Quiz Supabase rpc failed on ${fn}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
