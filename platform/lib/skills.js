import fs from "fs";
import path from "path";
import { marked } from "marked";

// A checked-in copy of select skill markdown, kept in sync with
// .claude/skills/*/SKILL.md by scripts/sync-skills.mjs. Same self-contained
// pattern as lib/ledger.js.
const SKILLS_DIR = path.join(process.cwd(), "data/skills");

function stripFrontmatter(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, "");
}

export function getSkillHtml(name) {
  const file = path.join(SKILLS_DIR, `${name}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = stripFrontmatter(fs.readFileSync(file, "utf-8"));
  return marked.parse(raw, { gfm: true });
}
