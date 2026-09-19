"use server";

import { supabaseInsert } from "../lib/supabase";
import { revalidatePath } from "next/cache";

// The one piece /closing had that Today didn't: a place to drop a free-text
// note that doesn't reduce to a task (a call, a reply, a story detail) -
// same ledger_closing_notes table, read and folded into the ledger on the
// next sweep. The other half of /closing, the new-task quick-add, was
// already on Today via NbaPage's AddTaskForm - no gap there. Added
// 2026-09-19, per Alex: "stiamo portando tutte le funzionalità nel today."
export async function saveTodayNote(formData) {
  const note = (formData.get("note") || "").toString().trim();
  if (!note) return;

  await supabaseInsert("ledger_closing_notes", { note });
  revalidatePath("/");
}
