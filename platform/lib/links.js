import fs from "fs";
import path from "path";
import { parseStorySlugs } from "./people";

// The second-brain link layer: outbound refs parsed from story markdown,
// the inverted backlink index, and the unlinked-mention scanners. All
// pure request-time computation - 132 small files and ~300 people make a
// full scan cheaper than maintaining an index table would be. The md is
// deploy-immutable on Vercel, so the index memoizes in production only.
const STORIES_DIR = path.join(process.cwd(), "data/ledger/stories");

export function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Outbound story references in one raw md file. Recognized forms:
// [[slug]], [[slug|label]], `slug` (backticked, the corpus's de-facto
// convention), [text](stories/slug.md), and bare hyphenated slugs in
// prose ("see austin-jobstream") - the hyphen requirement keeps ordinary
// words like "box" or "durable" from matching their single-word slugs.
export function extractStoryRefs(raw, slugSet) {
  const found = new Set();
  for (const m of raw.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]/g)) {
    if (slugSet.has(m[1])) found.add(m[1]);
  }
  for (const m of raw.matchAll(/`([a-z0-9-]+)`/g)) {
    if (slugSet.has(m[1])) found.add(m[1]);
  }
  for (const m of raw.matchAll(/\]\(stories\/([a-z0-9-]+)\.md\)/g)) {
    if (slugSet.has(m[1])) found.add(m[1]);
  }
  for (const slug of slugSet) {
    if (found.has(slug) || !slug.includes("-")) continue;
    if (new RegExp(`(^|[^a-z0-9-])${escapeRegex(slug)}([^a-z0-9-]|$)`).test(raw)) {
      found.add(slug);
    }
  }
  return found;
}

let indexCache = null;

// Reads every story file once and inverts the references:
// inbound.get(slug) -> [{slug, title}] of stories that mention it.
export function buildBacklinkIndex() {
  if (indexCache && process.env.NODE_ENV === "production") return indexCache;

  const files = fs.existsSync(STORIES_DIR)
    ? fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".md"))
    : [];
  const rawBySlug = new Map();
  const titleBySlug = new Map();
  for (const f of files) {
    const slug = f.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(STORIES_DIR, f), "utf-8");
    rawBySlug.set(slug, raw);
    const t = raw.match(/^#\s+(.+)$/m);
    titleBySlug.set(slug, t ? t[1].trim() : slug);
  }

  const slugSet = new Set(rawBySlug.keys());
  const outbound = new Map();
  const inbound = new Map();
  for (const [slug, raw] of rawBySlug) {
    const refs = extractStoryRefs(raw, slugSet);
    refs.delete(slug);
    outbound.set(slug, [...refs]);
    for (const target of refs) {
      if (!inbound.has(target)) inbound.set(target, []);
      inbound.get(target).push({ slug, title: titleBySlug.get(slug) });
    }
  }

  indexCache = { inbound, outbound, rawBySlug, titleBySlug, slugSet };
  return indexCache;
}

// A name is only safe to auto-match when it can't collide with ordinary
// prose or a different person: full name (contains a space), reasonably
// long. "Andy" or "Liz" must never match automatically at 300 people.
export function isMatchableName(name) {
  return !!name && name.includes(" ") && name.length >= 6;
}

function nameRegex(name) {
  return new RegExp(`(^|[^\\p{L}])${escapeRegex(name)}([^\\p{L}]|$)`, "iu");
}

// Case-insensitive exact full-name resolution against live people.
// More than one live match is ambiguous - never guess.
export function resolvePersonTarget(name, people) {
  const q = name.trim().toLowerCase();
  const hits = people.filter((p) => !p.archived && p.name && p.name.trim().toLowerCase() === q);
  if (hits.length === 1) return { id: hits[0].id, name: hits[0].name };
  if (hits.length > 1) return { ambiguous: true };
  return null;
}

// People named in this story's raw text but not tagged into the story -
// the Obsidian "unlinked mentions" suggestion list, person side.
export function findUnlinkedPeopleMentions(raw, people, storySlug) {
  const out = [];
  for (const p of people) {
    if (p.archived || p.merged_into) continue;
    if (!isMatchableName(p.name)) continue;
    if (parseStorySlugs(p.stories).includes(storySlug)) continue;
    if (nameRegex(p.name).test(raw)) out.push(p);
  }
  return out;
}

// Stories whose title or slug appears in this story's raw text without a
// recognized reference - the story-side suggestion list.
export function findUnlinkedStoryMentions(raw, storyRows, ownSlug, outboundSet, hubSlugs) {
  const out = [];
  for (const s of storyRows) {
    if (s.slug === ownSlug || outboundSet.has(s.slug)) continue;
    if (hubSlugs && hubSlugs.has(s.slug)) continue;
    const bySlug =
      s.slug.includes("-") &&
      new RegExp(`(^|[^a-z0-9-])${escapeRegex(s.slug)}([^a-z0-9-]|$)`).test(raw);
    const byTitle = s.title && s.title.length >= 8 && nameRegex(s.title).test(raw);
    if (bySlug || byTitle) out.push(s);
  }
  return out;
}

// The inverse of findUnlinkedPeopleMentions, for the person page: which
// stories mention this person's name in their raw text, beyond the ones
// already tagged in the person's stories column.
export function findStoriesMentioningPerson(person, taggedSlugs) {
  if (!isMatchableName(person.name)) return { skipped: true, stories: [] };
  const { rawBySlug, titleBySlug } = buildBacklinkIndex();
  const tagged = new Set(taggedSlugs);
  const re = nameRegex(person.name);
  const stories = [];
  for (const [slug, raw] of rawBySlug) {
    if (tagged.has(slug)) continue;
    if (re.test(raw)) stories.push({ slug, title: titleBySlug.get(slug) });
  }
  return { skipped: false, stories };
}
