import fs from "fs";
import path from "path";
import { marked } from "marked";

const REPO_ROOT = path.join(process.cwd(), "..");
const LEDGER_ROOT = path.join(
  REPO_ROOT,
  ".claude/skills/inbox-ledger/ledger"
);
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

function renderMarkdown(raw) {
  const html = marked.parse(raw, { gfm: true });
  return linkifyStoryRefs(linkifyThreadIds(html));
}

export function slugify(filename) {
  return filename.replace(/\.md$/, "");
}

export function getIndexHtml() {
  const raw = fs.readFileSync(path.join(LEDGER_ROOT, "_index.md"), "utf-8");
  return renderMarkdown(raw);
}

export function listStorySlugs() {
  return fs
    .readdirSync(STORIES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(slugify)
    .sort();
}

export function getStory(slug) {
  const file = path.join(STORIES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  return {
    slug,
    title: titleMatch ? titleMatch[1].trim() : slug,
    html: renderMarkdown(raw),
  };
}

export function listStories() {
  return listStorySlugs().map((slug) => getStory(slug));
}
