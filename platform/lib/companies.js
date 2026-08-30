import { supabaseInsert, supabaseSelect } from "./supabase";

// Finds a company by exact, case-insensitive name, or creates one. This is
// the one place company_id gets resolved from free-typed text - every
// action that lets Alex type a company name (a deal, a person's company
// field, a new company form) goes through here so "Gamma" and "gamma"
// never end up as two rows.
export async function findOrCreateCompany(name, defaults = {}) {
  const trimmed = (name || "").trim();
  if (!trimmed) return null;

  // Exact case-insensitive match, done in JS rather than a PostgREST ilike
  // filter - ilike treats the value as a LIKE pattern, and a company name
  // with a literal "%" or "_" (rare, but "50% Off" showed up once) would
  // silently match the wrong rows.
  const all = await supabaseSelect("ledger_companies", "?select=id,name");
  const match = all.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (match) return match.id;

  const [created] = await supabaseInsert("ledger_companies", {
    name: trimmed,
    ...defaults,
  });
  return created?.id || null;
}
