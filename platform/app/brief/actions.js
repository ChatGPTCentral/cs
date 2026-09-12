"use server";

import { supabaseUpdate } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function saveBrief(id, subject, content) {
  await supabaseUpdate("ledger_briefs", `?id=eq.${id}`, {
    subject,
    content,
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/brief");
}
