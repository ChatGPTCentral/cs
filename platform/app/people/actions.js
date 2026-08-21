"use server";

import { supabaseInsert } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function addPerson(formData) {
  const name = (formData.get("name") || "").toString().trim();
  if (!name) return;

  await supabaseInsert("ledger_people", {
    name,
    identity: (formData.get("identity") || "").toString().trim() || null,
    org: (formData.get("org") || "").toString().trim() || null,
    stories: (formData.get("stories") || "").toString().trim() || null,
    lists: (formData.get("lists") || "").toString().trim() || null,
    background: (formData.get("background") || "").toString().trim() || null,
  });

  revalidatePath("/people");
}
