# Inbox Ledger - platform app

A real deployed replacement for the Claude Artifact snapshot. Renders the
same ledger markdown as static pages: the board at `/`, one page per story at
`/story/[slug]`, with the same Gmail deep-links.

## Updating the deployed site after a ledger refresh

The ledger's source of truth stays `.claude/skills/inbox-ledger/ledger/` at
the repo root - this app keeps its own synced copy in `data/ledger/` so it
deploys as a self-contained directory. After running `/ledger` (or any manual
edit to the ledger markdown):

```
node scripts/sync-ledger.mjs
git add data/ledger
git commit -m "..."
git push
```

If the Vercel project is linked to this repo with root directory `platform`,
pushing to the production branch redeploys automatically. Otherwise, deploy
directly with the Vercel MCP `deploy_to_vercel` tool.

## Local development

```
npm install
node scripts/sync-ledger.mjs
npm run dev
```

## Password

Access is gated by Vercel's project-level password protection, not
application code - see the project's Deployment Protection settings.
