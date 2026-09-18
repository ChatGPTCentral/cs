"use server";

import { supabaseUpdate } from "../../lib/supabase";
import { revalidatePath } from "next/cache";
import { DEAL_STAGES } from "./stages";

export async function updateDealStage(formData) {
  const id = (formData.get("id") || "").toString();
  const stage = (formData.get("deal_stage") || "").toString();
  if (!id || !DEAL_STAGES.includes(stage)) return;

  await supabaseUpdate("ledger_stories", `?id=eq.${id}`, {
    deal_stage: stage,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/deals");
}
