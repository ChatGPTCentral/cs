"use server";

import { supabaseInsert, supabaseSelect } from "../../lib/supabase";
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

// Defines a list before anyone is tagged into it, so it shows up as a
// filter tab right away instead of only appearing once someone's Lists
// cell gets typed into. Case-insensitive dedupe against existing lists -
// "sales" and "Sales" are the same list.
export async function createList(formData) {
  const name = (formData.get("name") || "").toString().trim();
  if (!name) return;

  const existing = await supabaseSelect(
    "ledger_lists",
    `?name=ilike.${encodeURIComponent(name)}`
  );
  if (existing.length === 0) {
    await supabaseInsert("ledger_lists", { name });
  }

  revalidatePath("/people");
}
