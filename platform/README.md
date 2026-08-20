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

**Until this failure mode is understood, treat git-triggered deploys as
unreliable.** After every push, check the live site. If it 404s, redeploy
manually with `deploy_to_vercel`. A second push already showed the same
false-success pattern once.

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
