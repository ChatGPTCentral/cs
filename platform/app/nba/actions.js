"use server";

import { supabaseInsert, supabaseUpdate } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

function refresh() {
  revalidatePath("/");
  revalidatePath("/nba");
  revalidatePath("/closing");
}

// Check / x on a task row - same two statuses /closing's radios write,
// just one click instead of a form + Save. "Remove" is a soft-delete:
// the Supabase key here has no delete policy (see lib/supabase.js), so
// it sets status=dropped, which is exactly what /closing already means
// by "Dropped" - the row just stops matching status=open and disappears
// from every list that reads it.
export async function setTaskStatus(formData) {
  const id = (formData.get("id") || "").toString();
  const status = (formData.get("status") || "").toString();
  if (!id || (status !== "done" && status !== "dropped")) return;

  await supabaseUpdate("ledger_tasks", `?id=eq.${id}`, { status });
  refresh();
}

export async function updateTaskTitle(formData) {
  const id = (formData.get("id") || "").toString();
  const title = (formData.get("title") || "").toString().trim();
  if (!id || !title) return;

  await supabaseUpdate("ledger_tasks", `?id=eq.${id}`, { title });
  refresh();
}

// The quick-add on Today/NBA - deliberately minimal (title only, no
// kind/story_slug/due_date picker) since it's meant for "something just
// came up," not a full task edit. /closing's own new-task form still
// has the full field set for when that's actually needed.
export async function addTask(formData) {
  const title = (formData.get("title") || "").toString().trim();
  if (!title) return;

  await supabaseInsert("ledger_tasks", {
    title,
    kind: "action",
    status: "open",
    source: `per Alex, Today ${new Date().toISOString().slice(0, 10)}`,
  });
  refresh();
}
