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

**(1) Live feedback** - not on the page itself; the platform is static with
no backend, and there's no way to hold a Vercel env secret with the access
this session has, so a custom write-capable box was never viable. Built as
a Notion database instead - **💬 Ledger Feedback**
(`collection://edbb1fdd-22f8-4e65-a067-d719ee53e0a7`,
`https://www.notion.so/3fb46159954c470aaa774c3820e64f64`), linked from the
platform footer ("Drop a note in Ledger Feedback"). Properties: Note
(title), Status (New / Seen / Actioned), Reply (Claude writes back what it
did), Context (optional link to a `/story` page). Read every `/ledger` run
per `references/feedback.md` in the skill - acted on where possible, written
back with Status + Reply either way, surfaced in the Today view (a
"Feedback" section now counts toward the homepage same as drafted / your
move / open commitments). Decided against folding it into the Task Board -
feedback about the platform isn't a sales task, and mixing the two would
make both harder to scan.

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

**(6) CRM layer - person background and offline colour** - convention set
and tested against a first real entry. A `## Background (Alex-provided)`
section holds what Alex states directly - never inferred, same rule as
everything else in this system. It goes in the story file for a person tied
to one story, or in `graph/people.md` for a person who spans several
(most people who recur - Richard Lowe is the first case: `ai-hackathon-
bristol`, `interviews`, related to `gta-whitepaper`). Full procedure and
format in `references/background.md`.

First entry: Richard Lowe (`graph/people.md`, 2026-08-20) - met at London
Tech Week, a friend of Russ Shaw, part of West England Tech Advocates, runs
an education company, does DBT-like work independently. The org and Russ
Shaw connection **confirmed** what the mailbox had already found
(`TechWest England Advocates` in `graph/orgs.md`, the `strong` edge in
`graph/relations.md`); the education company and independent work are new.
Alex's stated reason for this layer: it surfaces connections between
stories the ledger cannot see on its own, and feeds an eventual **network
visualization** of his relationships - not built, the graph files
(`graph/people.md`, `graph/orgs.md`, `graph/relations.md`) are the data
source once that's scoped.

The graph now renders on the platform - `/people`, linked from the nav.

**Real self-service contribution, added 2026-08-20.** The first version of
this (chat-only, Claude writes the entry) was dictation, not contribution -
Alex has to be in a session for anything to get added. Fixed the same way
as the feedback loop: a Notion database, **👤 People**
(`collection://ed9cc14c-ac01-481d-b735-43e3d0ba44c1`,
`https://app.notion.com/p/f0bdabab729344efa13fc0d50098925f`), linked from
`/people`. Alex adds or edits a row himself, any time, no chat needed.
Columns: Name, Identity, Org, Stories, Background, Synced (New/Synced).
Pulled into the ledger markdown every `/ledger` run per
`references/background.md` - queries `Synced = "Not synced"`, writes each
into the right story file or `graph/people.md`, marks it synced. Chat
dictation still works as a fallback, but Notion is the primary path now.

## Open

**(2) Breakcold + Appeared.in sponsor discovery** - still blocked on
authorization. Both connectors need authorizing (claude.ai connector
settings, or `/mcp` in an interactive session) before either can be
inspected. `breakcold-plan.md` covers the Breakcold read/write design for
relationship enrichment once connected; sponsor *discovery* (finding new
prospects, not enriching known ones) still needs its own design pass once
the tool surface is actually visible. Nothing to build until authorized.

**Network visualization** - Alex's stated eventual goal for the CRM layer
above. Not scoped: no decision yet on where it lives (the platform app vs.
a separate tool) or what it should look like. The data it would draw on
already exists (`graph/*.md`); do not start building until Alex scopes it.

**Data ownership** - the ledger markdown (git) is the source of truth for
correspondence stories; the Task Board (Notion) is the source of truth for
tasks/pipeline state. They're linked one-directionally today (ledger ->
proposed Task Board rows) with URLs back to the story page. No sync back
from Notion into the ledger, and none is planned - Notion owns done/not-done
and ordering, the ledger owns what happened in the correspondence.

## Recommended next steps, in order

1. Get Alex to authorize Breakcold and Appeared.in, then inspect
   `capabilities_list` / `crm_objects_list` before designing anything further
2. Collect more Background entries (6) as Alex supplies them - the
   convention is proven, this is now a running task, not a one-off build
3. Decide whether the platform should render `graph/people.md` (a `/people`
   or `/person/<slug>` page), so Background is visible somewhere other than
   the raw markdown
4. Automate the Task Board proposal step so it runs as part of every
   `/ledger` refresh instead of being triggered by hand
5. Scope the network visualization once enough Background entries exist to
   make one worth building
