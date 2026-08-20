#!/usr/bin/env node
// Copies the inbox-ledger skill's markdown into platform/data/ledger, so the
// deployed app has its own self-contained copy instead of reaching outside
// the platform/ directory at build time. Run this after any /ledger refresh,
// before committing and redeploying.
import { cpSync, rmSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const platformRoot = path.join(here, "..");
const repoRoot = path.join(platformRoot, "..");
const source = path.join(repoRoot, ".claude/skills/inbox-ledger/ledger");
const dest = path.join(platformRoot, "data/ledger");

if (!existsSync(source)) {
  console.error(`source not found: ${source}`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(source, dest, { recursive: true });
rmSync(path.join(dest, "log"), { recursive: true, force: true });

console.log(`synced ${source} -> ${dest}`);
