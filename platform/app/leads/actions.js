"use server";

import { supabaseInsert, supabaseSelect } from "../../lib/supabase";
import { findOrCreateCompany } from "../../lib/companies";
import { revalidatePath } from "next/cache";

// Promotes one browsed LinkedIn connection into a real CRM person - the
// "found a new lead" action. Skips silently if a person with this exact
// name already exists (case-insensitive), rather than creating a
// duplicate; the exploration list re-marks it as already-in-CRM on
// reload either way.
export async function addLeadFromLinkedin(formData) {
  const fn = (formData.get("fn") || "").toString().trim();
  const ln = (formData.get("ln") || "").toString().trim();
  const name = `${fn} ${ln}`.trim();
  if (!name) return;

  const existing = await supabaseSelect("ledger_people", "?select=id,name");
  if (existing.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;

  const url = (formData.get("url") || "").toString().trim() || null;
  const company = (formData.get("company") || "").toString().trim();
  const position = (formData.get("position") || "").toString().trim();

  const companyId = company ? await findOrCreateCompany(company, { relationship: "prospect" }) : null;

  const backgroundParts = ["Trovato tra le connessioni LinkedIn di Alex"];
  if (position) backgroundParts.push(`- ${position}`);
  if (company) backgroundParts.push(`presso ${company}`);

  await supabaseInsert("ledger_people", {
    name,
    org: company || null,
    company_id: companyId,
    linkedin_url: url,
    linkedin_connected: true,
    linkedin_connected_via: "LinkedIn export, 2026-08-30",
    background: backgroundParts.join(" ") + ".",
  });

  revalidatePath("/leads");
  revalidatePath("/people");
  revalidatePath("/clienti");
}
