"use server";

import { supabaseUpdate, supabaseInsert } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function saveClosing(formData) {
  const ids = formData.getAll("task_id");

  for (const id of ids) {
    const status = (formData.get(`status_${id}`) || "open").toString();
    if (status !== "open") {
      await supabaseUpdate("ledger_tasks", `?id=eq.${id}`, { status });
    }
  }

  const newTitle = (formData.get("new_title") || "").toString().trim();
  if (newTitle) {
    await supabaseInsert("ledger_tasks", {
      title: newTitle,
      kind: (formData.get("new_kind") || "action").toString(),
      story_slug: (formData.get("new_story_slug") || "").toString().trim() || null,
      due_date: (formData.get("new_due_date") || "").toString().trim() || null,
      status: "open",
      source: `per Alex, closing recap ${new Date().toISOString().slice(0, 10)}`,
    });
  }

  const note = (formData.get("note") || "").toString().trim();
  if (note) {
    await supabaseInsert("ledger_closing_notes", { note });
  }

  revalidatePath("/closing");
}
