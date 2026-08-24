"use server";

import { supabaseInsert, supabaseUpdate } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateGenesisEvent(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  const patch = { updated_at: new Date().toISOString() };
  if (formData.has("title")) patch.title = (formData.get("title") || "").toString().trim();
  if (formData.has("description")) patch.description = (formData.get("description") || "").toString().trim();
  if (formData.has("people_names")) patch.people_names = (formData.get("people_names") || "").toString().trim() || null;

  await supabaseUpdate("ledger_genesis_events", `?id=eq.${id}`, patch);
  revalidatePath("/genesis");
}

export async function addGenesisEvent(formData) {
  const title = (formData.get("title") || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim();
  if (!title || !description) return;

  const yearRaw = (formData.get("year") || "").toString().trim();
  const monthRaw = (formData.get("month") || "").toString().trim();

  await supabaseInsert("ledger_genesis_events", {
    year: yearRaw ? parseInt(yearRaw, 10) : null,
    month: monthRaw ? parseInt(monthRaw, 10) : null,
    title,
    description,
    source_tag: "per Alex",
    sort_order: 99,
  });

  revalidatePath("/genesis");
}
