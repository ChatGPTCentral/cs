# Inbox Ledger - platform app

A real deployed replacement for the Claude Artifact snapshot. It renders the
same ledger markdown as static pages: the board at `/`, one page per story at
`/story/[slug]`, with the same Gmail deep-links.

## Update the deployed site after a ledger refresh

The ledger's source of truth stays at `.claude/skills/inbox-ledger/ledger/`,
at the repo root. This app keeps its own synced copy in `data/ledger/`. This
keeps the app self-contained. After you run `/ledger`, or after any manual
edit to the ledger markdown, run:

```
node scripts/sync-ledger.mjs
git add data/ledger
git commit -m "..."
git push
```

The Vercel project links to this repo. A push to the production branch
should redeploy the site automatically. **Verify this every time** - see
"Known issue" below. A push does not always produce a working deploy.

## Fixed: git-triggered deploys used to fail

Through 2026-08-20, pushes produced deployments that either 404d or failed
with `STATIC_BUILD_NO_OUT_DIR`, sometimes reporting success while serving
nothing. Two project settings were wrong:

1. **Root Directory** was not set to `platform`. A git-triggered build
   looked in the repo root, found no `package.json` there (the real one
   lives in `platform/`), and produced an empty or stale deployment
2. **Framework Preset** was set to `Other`. Once (1) was fixed, the build
   ran for real but then failed looking for a generic static `public/`
   folder instead of a Next.js server output

Both are now fixed (Root Directory: `platform`, Framework Preset: Next.js).
This commit's push is the verification - if you're reading this and the
site is current, it worked. Manual deploys via the Vercel MCP
`deploy_to_vercel` tool never hit either issue, since they always passed
`projectSettings: {framework: "nextjs"}` and scoped the file tree to
`platform/` explicitly - that stays a valid fallback if a push ever
regresses.

## Local development

```
npm install
node scripts/sync-ledger.mjs
npm run dev
```

## Access

Vercel Authentication gates the site, not a password. Alex's plan does not
include Password Protection. Only Alex's Vercel account can load the site.
See the project's Deployment Protection settings.
