"use server";

import { supabaseInsert, supabaseUpdate } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

function refresh() {
  revalidatePath("/");
  revalidatePath("/nba");
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

// Pins/unpins a task into Today's agenda - "+ aggiungi a oggi" moves it
// out of Pending tasks and into the agenda column; the unpin button there
// sends it back. One field, one source of truth - a pinned task simply
// stops matching the Pending/Reminders query, same mechanism as ✓/✕.
// Added 2026-09-19, per Alex.
export async function setTaskPinnedToday(formData) {
  const id = (formData.get("id") || "").toString();
  const pinned = (formData.get("pinned") || "").toString() === "true";
  if (!id) return;

  await supabaseUpdate("ledger_tasks", `?id=eq.${id}`, { pinned_today: pinned });
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

// Same quick-add, kind="reminder" - lands in the Reminders column
// instead of Pending tasks. Added 2026-09-19, per Alex.
export async function addReminder(formData) {
  const title = (formData.get("title") || "").toString().trim();
  if (!title) return;

  await supabaseInsert("ledger_tasks", {
    title,
    kind: "reminder",
    status: "open",
    source: `per Alex, Today ${new Date().toISOString().slice(0, 10)}`,
  });
  refresh();
}

// A free-text instruction on a task, a story's next-action, or a bullet
// inside the morning brief itself, that isn't a simple done/drop - e.g.
// "Nicola at Prime Tech PR ghosted me, put a reminder on my calendar for
// mid next week" instead of a status change. Queued in
// ledger_task_instructions against whichever one target applies (task_id,
// story_slug, or brief_id + brief_line for a brief bullet with no
// ledger_tasks row of its own); a background worker (the "Task
// instruction worker" trigger) picks up pending rows, actually carries
// them out with whatever tool the instruction calls for, and writes back
// status + a one-line result. Added 2026-09-19, per Alex.
export async function sendInstruction(formData) {
  const taskId = (formData.get("task_id") || "").toString();
  const storySlug = (formData.get("story_slug") || "").toString();
  const briefId = (formData.get("brief_id") || "").toString();
  const briefLine = formData.get("brief_line");
  const instruction = (formData.get("instruction") || "").toString().trim();
  if ((!taskId && !storySlug && !briefId) || !instruction) return;

  await supabaseInsert("ledger_task_instructions", {
    task_id: taskId || null,
    story_slug: storySlug || null,
    brief_id: briefId || null,
    brief_line: briefLine != null && briefLine !== "" ? Number(briefLine) : null,
    instruction,
    status: "pending",
  });
  refresh();
}
