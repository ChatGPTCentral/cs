"use server";

import { supabaseUpdate } from "../../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function updatePerson(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    background: (formData.get("background") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
}
