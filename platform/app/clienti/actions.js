"use server";

import { supabaseInsert, supabaseSelect, supabaseUpdate } from "../../lib/supabase";
import { findOrCreateCompany } from "../../lib/companies";
import { revalidatePath } from "next/cache";

export async function addDeal(formData) {
  const companyName = (formData.get("company") || "").toString().trim();
  if (!companyName) return;
  const amountRaw = (formData.get("amount") || "").toString().trim();

  const companyId = await findOrCreateCompany(companyName, { relationship: "client" });

  await supabaseInsert("ledger_deals", {
    company: companyName,
    company_id: companyId,
    story_slug: (formData.get("story_slug") || "").toString().trim() || null,
    amount: amountRaw ? Number(amountRaw) : null,
    currency: (formData.get("currency") || "USD").toString().trim() || "USD",
    paid_date: (formData.get("paid_date") || "").toString().trim() || null,
    channel: (formData.get("channel") || "").toString().trim() || null,
    note: (formData.get("note") || "").toString().trim() || null,
    source: "alex",
    confirmed: formData.get("confirmed") === "on",
  });

  revalidatePath("/clienti");
}

export async function updateDealField(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  const patch = {};
  if (formData.has("amount")) {
    const raw = (formData.get("amount") || "").toString().trim();
    patch.amount = raw ? Number(raw) : null;
  }
  for (const f of ["paid_date", "channel", "note"]) {
    if (formData.has(f)) patch[f] = (formData.get(f) || "").toString().trim() || null;
  }
  if (Object.keys(patch).length === 0) return;
  await supabaseUpdate("ledger_deals", `?id=eq.${id}`, patch);
  revalidatePath("/clienti");
}

// Flips a deal to confirmed - Alex's judgment that the payment was real,
// recorded as such (source stays what it was; his click is the evidence).
export async function confirmDeal(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  await supabaseUpdate("ledger_deals", `?id=eq.${id}`, { confirmed: true });
  revalidatePath("/clienti");
}

// Registers a company before any deal exists - the BDR/prospecting entry
// point. A story is optional and usually comes later, once there is a
// real narrative to tell.
export async function createCompany(formData) {
  const name = (formData.get("name") || "").toString().trim();
  if (!name) return;

  await supabaseInsert("ledger_companies", {
    name,
    domain: (formData.get("domain") || "").toString().trim().toLowerCase() || null,
    relationship: (formData.get("relationship") || "").toString().trim() || "prospect",
    icp_fit: (formData.get("icp_fit") || "").toString().trim() || null,
  });

  revalidatePath("/clienti");
}

export async function updateCompanyField(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  const patch = { updated_at: new Date().toISOString() };
  for (const f of ["relationship", "icp_fit", "notes"]) {
    if (formData.has(f)) patch[f] = (formData.get(f) || "").toString().trim() || null;
  }
  if (Object.keys(patch).length === 1) return;
  await supabaseUpdate("ledger_companies", `?id=eq.${id}`, patch);
  revalidatePath("/clienti");
}

// Domain drives the auto logo (Google's public favicon service - keyless,
// no account, been stable for years; it's a favicon, not a full
// transparent logo, so it's a starting point). logo_url is the manual
// override for a real press-kit logo or when the favicon guess is wrong.
// Setting domain alone auto-fills logo_url unless one is already set.
export async function updateCompanyDomain(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  const domain = (formData.get("domain") || "").toString().trim().toLowerCase() || null;

  const patch = { domain, updated_at: new Date().toISOString() };
  if (domain) {
    const [row] = await supabaseSelect("ledger_companies", `?id=eq.${id}&select=logo_url`);
    if (!row?.logo_url) patch.logo_url = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  }

  await supabaseUpdate("ledger_companies", `?id=eq.${id}`, patch);
  revalidatePath("/clienti");
  revalidatePath("/story");
}

export async function updateCompanyLogoUrl(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_companies", `?id=eq.${id}`, {
    logo_url: (formData.get("logo_url") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/clienti");
  revalidatePath("/story");
}
