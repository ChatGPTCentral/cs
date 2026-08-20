"use server";

import { supabaseUpdate } from "../../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function updatePerson(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    name: (formData.get("name") || "").toString().trim() || null,
    identity: (formData.get("identity") || "").toString().trim() || null,
    org: (formData.get("org") || "").toString().trim() || null,
    stories: (formData.get("stories") || "").toString().trim() || null,
    background: (formData.get("background") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
}

export async function toggleStar(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  const starred = formData.get("starred") === "true";

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    starred: !starred,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
}

export async function toggleArchive(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  const archived = formData.get("archived") === "true";

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    archived: !archived,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
}
