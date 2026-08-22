"use server";

import { supabaseSelect, supabaseUpdate } from "../../../lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Merges comma-or-slash-separated lists (identity, stories) into one
// deduped list, preserving the survivor's order first.
function mergeList(a, b, sep) {
  const parts = [
    ...(a || "").split(sep).map((s) => s.trim()).filter(Boolean),
    ...(b || "").split(sep).map((s) => s.trim()).filter(Boolean),
  ];
  return [...new Set(parts)].join(sep === "/" ? " / " : ", ");
}

// None of these redirect - a Server Action already refreshes the page's
// data in place (via revalidatePath) without navigating, so scroll
// position stays put. Alex flagged the earlier redirect-based version for
// resetting scroll on every save; the SaveWatcher/SavedToast pair (see
// SaveWatcher.jsx) gets the "saved" confirmation without needing one.

export async function updatePerson(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    name: (formData.get("name") || "").toString().trim() || null,
    identity: (formData.get("identity") || "").toString().trim() || null,
    org: (formData.get("org") || "").toString().trim() || null,
    stories: (formData.get("stories") || "").toString().trim() || null,
    lists: (formData.get("lists") || "").toString().trim() || null,
    background: (formData.get("background") || "").toString().trim() || null,
    linkedin_url: (formData.get("linkedin_url") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
  revalidatePath("/people/review");
}

// A LinkedIn URL entered here is a standing fact Alex supplied himself
// (from Breakcold, Cleanlist, Wiza, or just finding the profile) - not an
// Apollo guess. It writes straight to the live field, no review step,
// and is available whether or not an Apollo match ever ran.
export async function setLinkedIn(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    linkedin_url: (formData.get("linkedin_url") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
  revalidatePath("/people/review");
}

// Copies the pending Apollo match onto the live record and clears the
// pending fields - the review queue only ever holds one candidate per
// person, so approving replaces whatever was there before.
export async function approveEnrichment(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  const [person] = await supabaseSelect("ledger_people", `?id=eq.${id}`);
  if (!person) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    photo_url: person.pending_photo_url || null,
    linkedin_url: person.pending_linkedin_url || null,
    pending_photo_url: null,
    pending_linkedin_url: null,
    pending_match_name: null,
    pending_match_title: null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/people/review");
  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
}

// Clears the pending match without touching the live record - the
// person stays exactly as they were, the candidate is just gone.
export async function discardEnrichment(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    pending_photo_url: null,
    pending_linkedin_url: null,
    pending_match_name: null,
    pending_match_title: null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/people/review");
  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
}

export async function updateLists(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    lists: (formData.get("lists") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
}

export async function updateStories(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_people", `?id=eq.${id}`, {
    stories: (formData.get("stories") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/people/${id}`);
  revalidatePath("/people");
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

  // Only the person page passes this - archiving there means "I'm done
  // with this record," so it sends you back to the list. The /people
  // table's own row-level Archive button never sets it, since staying on
  // the table (no navigation, no scroll jump) is what that one is for.
  const redirectOnArchive = formData.get("redirectOnArchive");
  if (willArchive && redirectOnArchive) {
    redirect(redirectOnArchive.toString());
  }
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
    lists: mergeList(survivor.lists, duplicate.lists, ",") || null,
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
