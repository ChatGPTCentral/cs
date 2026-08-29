import fs from "fs";
import path from "path";
import { marked } from "marked";

// A checked-in copy of the ledger's markdown, kept in sync with
// .claude/skills/inbox-ledger/ledger by scripts/sync-ledger.mjs. Copied
// rather than read from the repo root so this app is self-contained -
// it deploys the same way whether Vercel checks out the whole monorepo
// or just this directory.
const LEDGER_ROOT = path.join(process.cwd(), "data/ledger");
const STORIES_DIR = path.join(LEDGER_ROOT, "stories");

function linkifyThreadIds(html) {
  // Bare 16-hex-char Gmail thread IDs, wrapped in backticks by convention
  // (see references/stories.md), become clickable Gmail deep links.
  return html.replace(
    /<code>([0-9a-f]{16})<\/code>/g,
    (_m, id) =>
      `<a class="gmail-open" href="https://mail.google.com/mail/u/0/#all/${id}" target="_blank" rel="noopener">Open in Gmail &rarr;</a>`
  );
}

function linkifyStoryRefs(html) {
  // [Name](stories/slug.md) -> /story/slug, so board links stay clickable
  // on the platform instead of pointing at a raw repo path.
  return html.replace(
    /href="stories\/([a-z0-9-]+)\.md"/g,
    (_m, slug) => `href="/story/${slug}"`
  );
}

// [[target]] / [[target|label]] -> a real link. A known story slug wins;
// otherwise an exact full-name match on a live person; otherwise a
// visibly-unresolved span, never a broken href. Runs on rendered HTML
// like the other two passes - a literal [[x]] inside a code span would
// also linkify, a caveat accepted because the corpus has none.
function linkifyWikiLinks(html, ctx) {
  return html.replace(
    /\[\[([^\[\]|]+?)(?:\|([^\[\]]*))?\]\]/g,
    (_m, target, label) => {
      const t = target.trim();
      if (ctx.slugSet && ctx.slugSet.has(t)) {
        const text = label || (ctx.titleBySlug && ctx.titleBySlug.get(t)) || t;
        return `<a class="wiki-link" href="/story/${t}">${text}</a>`;
      }
      if (ctx.resolvePerson) {
        const hit = ctx.resolvePerson(t);
        if (hit && hit.id) return `<a class="wiki-link" href="/people/${hit.id}">${label || hit.name}</a>`;
      }
      return `<span class="wiki-missing">${label || t}</span>`;
    }
  );
}

// `known-slug` in backticks -> a story link, mirroring linkifyThreadIds.
// This is the corpus's existing cross-reference convention, so old files
// light up without a single edit.
function linkifySlugRefs(html, ctx) {
  return html.replace(/<code>([a-z0-9-]+)<\/code>/g, (m, slug) => {
    if (!ctx.slugSet || !ctx.slugSet.has(slug)) return m;
    const title = (ctx.titleBySlug && ctx.titleBySlug.get(slug)) || slug;
    return `<a class="wiki-link" href="/story/${slug}" title="${title}"><code>${slug}</code></a>`;
  });
}

function renderMarkdown(raw, ctx) {
  const html = marked.parse(raw, { gfm: true });
  let out = linkifyStoryRefs(linkifyThreadIds(html));
  if (ctx) out = linkifySlugRefs(linkifyWikiLinks(out, ctx), ctx);
  return out;
}

export function slugify(filename) {
  return filename.replace(/\.md$/, "");
}

export function getIndexHtml() {
  const raw = fs.readFileSync(path.join(LEDGER_ROOT, "_index.md"), "utf-8");
  return renderMarkdown(raw);
}

function getIndexRaw() {
  return fs.readFileSync(path.join(LEDGER_ROOT, "_index.md"), "utf-8");
}

// Splits _index.md on top-level "## " headings. Returns the intro (the h1 +
// everything before the first "## ") separately from a list of
// {title, slug, html} sections, so a page can pick a subset instead of
// rendering the whole board as one undifferentiated wall of text.
export function getIndexSections() {
  const raw = getIndexRaw();
  const parts = raw.split(/\n(?=## )/);
  const intro = renderMarkdown(parts[0]);
  const sections = parts.slice(1).map((block) => {
    const titleLine = block.split("\n")[0].replace(/^##\s+/, "").trim();
    return {
      title: titleLine,
      slug: slugify_title(titleLine),
      html: renderMarkdown(block),
    };
  });
  return { intro, sections };
}

function slugify_title(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// The sections that answer "what do I need to do today" - everything else
// (waiting-on-them, proposed, below-threshold, anomalies, graph, coverage...)
// is reference material, not a daily action list. Matched by substring so
// small wording tweaks in the ledger don't silently drop a section.
const TODAY_SECTION_MATCHERS = [
  "drafted",
  "your move",
  "open commitments",
  "feedback",
];

export function getTodaySections() {
  const { sections } = getIndexSections();
  return sections.filter((s) =>
    TODAY_SECTION_MATCHERS.some((m) => s.title.toLowerCase().includes(m))
  );
}

export function listStorySlugs() {
  return fs
    .readdirSync(STORIES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(slugify)
    .sort();
}

export function getStory(slug, ctx) {
  const file = path.join(STORIES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  return {
    slug,
    title: titleMatch ? titleMatch[1].trim() : slug,
    html: renderMarkdown(raw, ctx),
  };
}

export function getStoryRaw(slug) {
  const file = path.join(STORIES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf-8");
}

export function listStories() {
  return listStorySlugs().map((slug) => getStory(slug));
}
