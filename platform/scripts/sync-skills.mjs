#!/usr/bin/env node
// Copies the "second brain" skills (genesis, writing style - not the
// customer-support persona skill, which stays internal) into
// platform/data/skills, so the deployed app can render them for Alex to
// read and correct without opening the repo. Run after any edit to one of
// these skills, before committing and redeploying - same pattern as
// sync-ledger.mjs.
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const platformRoot = path.join(here, "..");
const repoRoot = path.join(platformRoot, "..");
const dest = path.join(platformRoot, "data/skills");

const SKILLS = [
  { name: "ai-central-genesis", src: ".claude/skills/ai-central-genesis/SKILL.md" },
  { name: "alex-writing-style", src: ".claude/skills/alex-writing-style/SKILL.md" },
];

mkdirSync(dest, { recursive: true });

for (const skill of SKILLS) {
  const source = path.join(repoRoot, skill.src);
  if (!existsSync(source)) {
    console.error(`source not found: ${source}`);
    process.exit(1);
  }
  copyFileSync(source, path.join(dest, `${skill.name}.md`));
  console.log(`synced ${source} -> data/skills/${skill.name}.md`);
}
