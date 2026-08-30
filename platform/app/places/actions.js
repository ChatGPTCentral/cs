"use server";

import { supabaseInsert, supabaseUpdate } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

// Presence periods are Alex's own record of where he was - entered by
// hand here, never inferred by any sweep.
export async function addPlace(formData) {
  const place = (formData.get("place") || "").toString().trim();
  if (!place) return;

  await supabaseInsert("ledger_places", {
    place,
    start_date: (formData.get("start_date") || "").toString().trim() || null,
    end_date: (formData.get("end_date") || "").toString().trim() || null,
    note: (formData.get("note") || "").toString().trim() || null,
  });

  revalidatePath("/places");
}

export async function updatePlaceField(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  const patch = {};
  for (const f of ["place", "start_date", "end_date", "note"]) {
    if (formData.has(f)) patch[f] = (formData.get(f) || "").toString().trim() || null;
  }
  if (Object.keys(patch).length === 0) return;
  await supabaseUpdate("ledger_places", `?id=eq.${id}`, patch);
  revalidatePath("/places");
}
