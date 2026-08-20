# From inbox ledger to sales mission control - status

Status: **partially live**. This started as a plan; parts of it are now a
real deployed app and a real integration. This doc tracks what's actually
built vs. what's still open, so it stops reading like a proposal for things
that already happened.

Original ask, for reference: (1) live feedback, (2) Breakcold + Appeared.in
for sponsor discovery, (3) a password-protected Vercel app doubling as a
sales mission control and task board, (4) Gmail thread links per story, plus
later asks for (5) a Notion task-board integration and (6) a CRM layer -
person background and offline colour on top of the correspondence stories.

## Done

**(4) Gmail thread links** - every story links straight to its Gmail thread
(exact thread ID where known, a search link where a story spans several
threads without one canonical ID).

**(3) Real deployed app, not an artifact** - live at
`https://cs-taupe-omega.vercel.app`, a Next.js app in `platform/`, deployed
via Vercel, reading a checked-in copy of the ledger markdown
(`platform/data/ledger`, synced from `.claude/skills/inbox-ledger/ledger` by
`scripts/sync-ledger.mjs`). Static generation, no live Gmail reads - refresh
via `/ledger`, sync, commit, push, redeploy. See `platform/README.md` for
the exact workflow.

- **Access control**: not password protection - Alex's Vercel plan doesn't
  include that tier ($150/mo Advanced Deployment Protection). Using the free
  **Vercel Authentication** gate instead (login via Alex's Vercel account,
  enabled in the project's Deployment Protection settings). Functionally the
  same outcome - only Alex can load the site - achieved without the paid tier
- **Daily-use split**: the homepage (`/`) shows only the three
  action-needed sections (drafted, your move, open commitments) after Alex
  flagged the original all-13-sections dump as hard to use day to day. The
  full board lives at `/board`, all stories at `/stories`

**(1) Live feedback, first pass** - superseded by moving off Artifacts (the
original answer was Artifact comments, which no longer apply). No on-page
feedback box exists yet. Current best answer: reuse the Notion connection
below rather than build separate infrastructure - not yet done, see Open
below.

**(5) Notion Task Board integration** - `⏩ Task Board`
(`collection://29e656dd-7b67-80ef-b981-000b928858a9`) now receives proposed
rows sourced from the ledger's "your move" items. Workflow as agreed:
propose first, Alex approves, then write. First batch of 8 rows created
covering AI Hackathon Bristol, Austin/Jobstream, Cannes 2026, Ben+Katy
MadRev, Pillsbury Law, Tim Bourquin, Claudia Faith, King Capital Advisors -
each with Task/Priority/Channel/Bucket=FOLLOW-UPS/Status=Not started/a URL
back to the matching `/story/<slug>` page. New Channel select options were
added to the data source schema to match (existing options and colors
preserved). This is meant to repeat on every `/ledger` refresh, not a
one-off - not yet automated.

## Open

**(2) Breakcold + Appeared.in sponsor discovery** - still blocked on
authorization. Both connectors need authorizing (claude.ai connector
settings, or `/mcp` in an interactive session) before either can be
inspected. `breakcold-plan.md` covers the Breakcold read/write design for
relationship enrichment once connected; sponsor *discovery* (finding new
prospects, not enriching known ones) still needs its own design pass once
the tool surface is actually visible. Nothing to build until authorized.

**(1) A real feedback mechanism** - the Notion connection is the likely
path (a "Feedback" or similar view Alex writes into, that gets read back on
the next `/ledger` or `/support-sweep` run) but this hasn't been scoped or
built. Open question: does it live in the same Task Board database as a
Bucket, or a separate small database.

**(6) CRM layer - person background and offline colour** - proposed
convention: a `## Background (Alex-provided)` section in each story's
markdown, populated only from what Alex actually states (never inferred -
same rule as everything else in this system: no invented facts). Not built.
Waiting on Alex to supply a first real example to build and test the
convention against.

**Data ownership** - the ledger markdown (git) is the source of truth for
correspondence stories; the Task Board (Notion) is the source of truth for
tasks/pipeline state. They're linked one-directionally today (ledger ->
proposed Task Board rows) with URLs back to the story page. No sync back
from Notion into the ledger, and none is planned - Notion owns done/not-done
and ordering, the ledger owns what happened in the correspondence.

## Recommended next steps, in order

1. Scope and build the feedback mechanism (1) - smallest remaining piece,
   unblocks daily use without waiting on anything external
2. Get Alex to authorize Breakcold and Appeared.in, then inspect
   `capabilities_list` / `crm_objects_list` before designing anything further
3. Build the `Background` convention (6) once Alex supplies a first example
4. Automate the Task Board proposal step so it runs as part of every
   `/ledger` refresh instead of being triggered by hand
