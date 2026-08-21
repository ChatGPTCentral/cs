"use server";

import { supabaseSelect, supabaseUpdate } from "../../../lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function withSaved(path) {
  return `${path}${path.includes("?") ? "&" : "?"}saved=1`;
}

// Merges comma-or-slash-separated lists (identity, stories) into one
// deduped list, preserving the survivor's order first.
function mergeList(a, b, sep) {
  const parts = [
    ...(a || "").split(sep).map((s) => s.trim()).filter(Boolean),
    ...(b || "").split(sep).map((s) => s.trim()).filter(Boolean),
  ];
  return [...new Set(parts)].join(sep === "/" ? " / " : ", ");
}

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
  redirect(withSaved(`/people/${id}`));
}

export async function updateBackground(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    background: (formData.get("background") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");

  const redirectTo = (formData.get("redirectTo") || "/people").toString();
  redirect(withSaved(redirectTo));
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
  const willArchive = !archived;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    archived: willArchive,
    // Unarchiving a merged record undoes the merge marker too - nothing
    // about a merge is destructive, so this is a real undo.
    ...(willArchive ? {} : { merged_into: null }),
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
}

// Folds `duplicateId` into `id` (the record you're viewing): unions
// identity and stories, fills in org/background/starred from whichever
// side has them, moves every email log row over to the survivor (skipping
// any thread_id the survivor already has, since (person_id, thread_id) is
// unique), then archives the duplicate and marks where it went. Nothing
// is deleted - the anon key this app uses has no delete grant, by design
// (see platform/lib/supabase.js) - so a bad merge is always undoable via
// Unarchive on the duplicate's own page.
export async function mergePerson(formData) {
  const id = (formData.get("id") || "").toString();
  const duplicateId = (formData.get("duplicateId") || "").toString();
  if (!id || !duplicateId || id === duplicateId) return;

  const [survivor] = await supabaseSelect("ledger_people", `?id=eq.${id}`);
  const [duplicate] = await supabaseSelect("ledger_people", `?id=eq.${duplicateId}`);
  if (!survivor || !duplicate) return;

  const background = [survivor.background, duplicate.background ? `(merged from ${duplicate.name}, ${new Date().toISOString().slice(0, 10)}) ${duplicate.background}` : null]
    .filter(Boolean)
    .join("\n\n");

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    identity: mergeList(survivor.identity, duplicate.identity, "/") || null,
    org: survivor.org || duplicate.org || null,
    stories: mergeList(survivor.stories, duplicate.stories, ",") || null,
    background: background || null,
    starred: survivor.starred || duplicate.starred,
    updated_at: new Date().toISOString(),
  });

  const [survivorEmails, duplicateEmails] = await Promise.all([
    supabaseSelect("ledger_people_emails", `?person_id=eq.${id}&select=thread_id`),
    supabaseSelect("ledger_people_emails", `?person_id=eq.${duplicateId}`),
  ]);
  const existingThreadIds = new Set(survivorEmails.map((e) => e.thread_id));
  for (const email of duplicateEmails) {
    if (existingThreadIds.has(email.thread_id)) continue;
    await supabaseUpdate("ledger_people_emails", `?id=eq.${email.id}`, { person_id: id });
  }

  await supabaseUpdate("ledger_people", `?id=eq.${duplicateId}`, {
    archived: true,
    merged_into: id,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath(`/people/${duplicateId}`);
  revalidatePath("/people");
}
