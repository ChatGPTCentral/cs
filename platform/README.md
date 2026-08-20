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

## Known issue: git-triggered deploys can fail silently

On 2026-08-20, a push produced a build that reported success but served a
404 at the live URL. The build logs showed no real `npm install` or `next
build` step - just a near-instant "Build Completed" line. The cause is not
confirmed.

**The fix that worked**: a direct deploy via the Vercel MCP tool
`deploy_to_vercel`, with the full file tree and `projectSettings: {framework:
"nextjs"}` set explicitly. This forces a real build.

**Two root causes, found and fixed 2026-08-20**:

1. The project's Root Directory was not set to `platform`. A git-triggered
   build looked in the repo root, found no `package.json` there (the real
   one lives in `platform/`), and produced an empty or stale deployment
   instead of an error. Fixed - Root Directory is now `platform`
2. Framework Preset was not set to Next.js. Once (1) was fixed, the build
   ran for real but then failed with `STATIC_BUILD_NO_OUT_DIR` - Vercel
   looked for a generic static `public/` folder instead of a Next.js
   server output. Fixed - Framework Preset is now Next.js

Manual deploys never hit either issue, since they pass `projectSettings:
{framework: "nextjs"}` and scope the file tree to `platform/` explicitly on
every call. This test push is what checks whether both fixes together make
a plain `git push` reliable again. Update this section once confirmed.

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
