"use server";

import { supabaseInsert } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function addFeedback(formData) {
  const note = (formData.get("note") || "").toString().trim();
  if (!note) return;

  await supabaseInsert("ledger_feedback", {
    note,
    context: (formData.get("context") || "").toString().trim() || null,
  });

  revalidatePath("/feedback");
}
