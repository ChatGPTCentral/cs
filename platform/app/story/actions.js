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
