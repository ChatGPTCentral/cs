"use server";

import { supabaseInsert, supabaseUpdate } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function addDeal(formData) {
  const company = (formData.get("company") || "").toString().trim();
  if (!company) return;
  const amountRaw = (formData.get("amount") || "").toString().trim();

  await supabaseInsert("ledger_deals", {
    company,
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
