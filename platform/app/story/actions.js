"use server";

import { supabaseInsert, supabaseSelect, supabaseUpdate } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Registers a new story before any narrative markdown exists for it, so
// it can be tagged onto people (the /people Stories column) and shows up
// on /genesis right away. This is metadata only - title, start date - not
// a replacement for the full story write-up that eventually lives in the
// git-tracked ledger markdown.
export async function createStory(formData) {
  const title = (formData.get("title") || "").toString().trim();
  if (!title) return;
  const slug = slugify(title);
  if (!slug) return;

  const existing = await supabaseSelect("ledger_stories", `?slug=eq.${slug}`);
  if (existing.length > 0) return;

  await supabaseInsert("ledger_stories", {
    slug,
    title,
    start_date: (formData.get("start_date") || "").toString().trim() || null,
  });

  revalidatePath("/stories");
  revalidatePath("/genesis");
  revalidatePath("/people");
}

export async function updateStoryStart(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_stories", `?id=eq.${id}`, {
    start_date: (formData.get("start_date") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/genesis");
  revalidatePath("/story");
}

export async function updateStoryEnd(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_stories", `?id=eq.${id}`, {
    end_date: (formData.get("end_date") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/genesis");
  revalidatePath("/story");
}

export async function updateStoryNextAction(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_stories", `?id=eq.${id}`, {
    next_action: (formData.get("next_action") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/genesis");
  revalidatePath("/story");
}

export async function updateStoryNextActionDate(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;

  await supabaseUpdate("ledger_stories", `?id=eq.${id}`, {
    next_action_date: (formData.get("next_action_date") || "").toString().trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/genesis");
  revalidatePath("/story");
}

// Which axis a story reads on: "moment" (a bounded event, can run
// alongside others in the same window) or "thread" (an ongoing
// relationship or pursuit with no real end). Not inferred from dates -
// set here, by hand, story by story.
export async function updateStoryAxis(formData) {
  const id = (formData.get("id") || "").toString();
  const axis = (formData.get("axis") || "").toString().trim();
  if (!id || (axis !== "moment" && axis !== "thread")) return;

  await supabaseUpdate("ledger_stories", `?id=eq.${id}`, {
    axis,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/genesis");
  revalidatePath("/story");
}

// Accepts an unlinked mention: tags a person into a story by appending
// the slug to the person's comma-separated stories column. Conservative
// append - existing free text and "(notes)" suffixes stay untouched,
// duplicates are checked against the parsed slug set. This is the only
// side of link-acceptance the app can own: markdown stays Claude's to
// write, ledger_people is editable by design (see lib/supabase.js RLS
// notes).
export async function tagPersonToStory(formData) {
  const personId = (formData.get("personId") || "").toString();
  const slug = (formData.get("slug") || "").toString().trim();
  if (!personId || !/^[a-z0-9-]+$/.test(slug)) return;

  const [person] = await supabaseSelect(
    "ledger_people",
    `?id=eq.${personId}&select=id,stories`
  );
  if (!person) return;

  const existing = (person.stories || "").trim();
  const tagged = existing
    .split(",")
    .map((s) => s.trim().replace(/\s*\(.*\)\s*$/, ""))
    .filter(Boolean);
  if (tagged.includes(slug)) return;

  await supabaseUpdate("ledger_people", `?id=eq.${personId}`, {
    stories: existing ? `${existing}, ${slug}` : slug,
  });

  revalidatePath("/story");
  revalidatePath("/people");
  revalidatePath("/genesis");
  revalidatePath("/network");
}

// Proposes a story-to-story link for the Claude ledger session to apply
// to the markdown. The app never edits md - it queues the suggestion;
// /links/review lists the queue; the /ledger session writes the actual
// [[slug]] into the file and marks the row applied.
export async function proposeLink(formData) {
  const storySlug = (formData.get("storySlug") || "").toString().trim();
  const targetRef = (formData.get("targetRef") || "").toString().trim();
  const targetLabel = (formData.get("targetLabel") || "").toString().trim();
  if (!/^[a-z0-9-]+$/.test(storySlug) || !/^[a-z0-9-]+$/.test(targetRef)) return;

  const existing = await supabaseSelect(
    "ledger_link_suggestions",
    `?story_slug=eq.${storySlug}&target_kind=eq.story&target_ref=eq.${targetRef}`
  );
  if (existing.length > 0) return;

  await supabaseInsert("ledger_link_suggestions", {
    story_slug: storySlug,
    target_kind: "story",
    target_ref: targetRef,
    target_label: targetLabel || null,
  });

  revalidatePath("/story");
  revalidatePath("/links/review");
}

export async function dismissLinkSuggestion(formData) {
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  await supabaseUpdate("ledger_link_suggestions", `?id=eq.${id}`, {
    status: "dismissed",
  });
  revalidatePath("/links/review");
  revalidatePath("/story");
}
