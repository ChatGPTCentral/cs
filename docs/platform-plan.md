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

**(1) Live feedback** - on the page itself now, at `/feedback`. First built
against a Notion database (2026-08-20), since the platform was static with
no backend and no way to hold a Vercel env secret with this session's
access. Superseded the same day: Alex pointed out he never asked for
Notion and wanted everything to run in the platform. Rebuilt on Supabase -
see "Runs in the platform now" below for the shared architecture with (6).
Surfaced in the Today view too (a "Feedback" section counts toward the
homepage same as drafted / your move / open commitments). Decided against
folding it into the Task Board - feedback about the platform isn't a sales
task, and mixing the two would make both harder to scan.

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

The graph renders on the platform at `/people`, linked from the nav.

**Runs in the platform now, added 2026-08-20.** The first version of
Background collection (chat-only, Claude writes the entry) was dictation,
not contribution - Alex has to be in a session for anything to get added.
A same-day Notion version fixed that but Alex flagged it directly: he never
asked for Notion, he wants everything running in the platform. Rebuilt for
real this time:

- **Supabase project**: `AI Central // Admin` (`hvzmgpdfznjdxnruiqmy`) -
  reused an existing project rather than paying for a new one, after
  checking its RLS policies first (see "Security note" below)
- **Tables**: `public.ledger_people` (name, identity, org, stories,
  background) and `public.ledger_feedback` (note, status, reply, context).
  RLS: `ledger_people` allows `select`/`insert`/`update` for the
  anon/publishable key - Alex edits his own CRM entries directly.
  `ledger_feedback` allows `select`/`insert` only - status changes and
  replies stay something only Claude's own Supabase session can do. No
  `delete` anywhere from this key
- **`platform/lib/supabase.js`**: talks to Supabase's REST API (PostgREST)
  over plain `fetch`, no SDK dependency - keeps the lockfile out of it
  entirely, given the deploy-pipeline history above
- **`/people` and `/feedback`**: real forms, Next.js Server Actions
  (`app/people/actions.js`, `app/feedback/actions.js`) insert directly.
  Both pages are `force-dynamic` - Alex adds something, it appears on the
  same page immediately, no redeploy needed to see it
- Existing Notion entries (the Richard Lowe row, the empty Feedback db)
  were migrated into Supabase, not left behind
- Pulled into the git-tracked ledger markdown every `/ledger` run per
  `references/background.md` and `references/feedback.md` - the Supabase
  tables are Alex's live inbox for this; the markdown is still what
  `/board` and story pages render, refreshed on the normal cadence

**Security note, found while scoping this.** A first pass over the Admin
project's RLS policies looked alarming - `revenue`, `expenses`,
`bank_transactions` etc. appeared to allow unrestricted `insert`. A second,
more careful read (the first query missed the `with_check` column, which is
where an `INSERT` policy's restriction actually lives) showed those are
fine - all gated by `is_owner()`. Two real, minor issues were found and
fixed: `country_aliases` had RLS disabled entirely, and `manual_ledger` had
an unrestricted public `select`. Both now require `is_member()`, matching
their sibling tables.

**Person detail pages and a first connections view, added 2026-08-20.**
Alex: "why doesn't each person have their own page" and "let's build a
relational tree between these people." Each person now has
`/people/<id>` - full record, plus **Connections**: other people sharing
the same `org` or a `stories` slug, computed live from the table
(`platform/lib/people.js`), no separate relations table yet. This is a
cheap first slice of the network-visualization goal below, not the full
thing - no graph layout, no visual edges, just a list. Alex can also edit a
person's `background` right on their page now (RLS extended to allow
`update`, not just `insert`).

**Roster completeness, same day.** The initial 52-person roster came from
tracked stories plus the `_index.md` below-threshold list - Alex flagged it
as far short of everyone he's actually corresponded with since ~April 2025.
A broader mailbox mining pass (wider bar than story-worthiness - any real
distinct correspondent, not just ongoing relationships) found 73 new people:
55 with a confirmed name, 18 with no safe name found (the `name` field holds
the email address itself, not a guess). Two apparent finds were already in
the roster under those exact identities and were skipped, not duplicated.
Roster reached **125 people**, but coverage was a sample, not exhaustive -
three 2025-2026 quarters had roughly 4x more mail than the one page per
quarter that got read. The pass also surfaced a real exchange with
`hamed@otio.ai` that the ledger's "⚠️ Anomalies" table didn't expect -
flagged there, not yet resolved.

Alex then asked directly: "are we sure this is everyone." It was not, so a
second pass read every remaining page of those three quarters (`in:sent`
and `in:inbox` both - inbox had never been checked and had a real gap too).
Found 72 more people, resolved names for 4 records already in the roster
instead of duplicating them, and merged one person's second email address
into their existing row. **Roster is now 197 people.** Both quarterly
windows are confirmed fully read for Aug 2025 - Aug 2026; going earlier
than Jan 2025 is the next real gap, not yet run since nothing has flagged
it as needed.

**Story log on the person page, same day.** Alex opened Andy's page and
asked why the story or interaction log with him wasn't on it - the page
only had a "Stories: glide-andy" text line, not the actual content. Fixed:
`/people/<id>` now renders the full text of every story the person is tied
to, straight from the same `getStory()` the `/story/<slug>` pages use, not
just a name to go look up separately.

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

**Data ownership** - three stores now, each with one job:
- **Git-tracked ledger markdown**: source of truth for correspondence
  stories - what happened, whose move it is. Rendered by `/`, `/board`,
  `/story/<slug>`
- **Supabase (`ledger_people`, `ledger_feedback`)**: Alex's live inbox for
  CRM context and platform feedback - written on the platform itself,
  pulled into the ledger markdown on the next `/ledger` run, then it is the
  markdown that stays canonical for that entry, not the Supabase row
- **Notion Task Board**: source of truth for tasks/pipeline state - this
  one stays Notion, deliberately, because it is Alex's own pre-existing
  tool, not something built for this project. Linked one-directionally
  (ledger -> proposed Task Board rows) with URLs back to the story page. No
  sync back from Notion into the ledger, and none is planned

## Recommended next steps, in order

1. Get Alex to authorize Breakcold and Appeared.in, then inspect
   `capabilities_list` / `crm_objects_list` before designing anything further
2. Collect more Background and Feedback entries as Alex supplies them
   through the platform - both loops are proven, this is now a running
   task, not a one-off build
3. Automate the Task Board proposal step so it runs as part of every
   `/ledger` refresh instead of being triggered by hand
4. Scope the network visualization once enough Background entries exist to
   make one worth building
