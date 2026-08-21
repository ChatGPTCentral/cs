# Background - context Alex supplies directly

Alex asked for a CRM layer on top of the ledger: for each person, he can add
context the mailbox does not carry - where he met them, who introduced them,
what they actually do. His stated reason: this surfaces connections between
stories that do not exist yet in the ledger, and feeds an eventual network
visualization of his whole set of relationships (not built - see "Eventual
goal" below).

## Where entries come from

Two paths, same destination. Alex can tell Claude directly in a chat
session (Claude writes the entry that session), or - the primary path -
**write directly into the platform**, at `/people`, right on the site.

This ran through Notion first (2026-08-20), then moved the same day to the
platform itself after Alex pointed out he never asked for Notion and wanted
everything to run in the platform. Now: a form on `/people` writes straight
into Supabase, no chat, no third-party tool, no redeploy needed to see the
entry appear.

**Where it lives**: Supabase project **AI Central // Admin**
(`hvzmgpdfznjdxnruiqmy`), table `public.ledger_people`. Columns: `name`,
`identity` (email/handle), `org`, `stories` (comma-separated slugs),
`background` (free text - the actual content), `created_at`. RLS: the anon
key (embedded in `platform/lib/supabase.js`, safe - it is publishable, not
secret) can `select`, `insert` and `update` - Alex edits a person's own
`background` directly on their `/people/<id>` page.

Each person also has a detail page (`app/people/[id]/page.jsx`) showing
their full record, a **Story log** - the actual rendered content of every
story their `stories` field names, pulled live from `lib/ledger.js`'s
`getStory()`, so the interaction history is on the page itself, not just a
name to look up elsewhere - and **Connections** - other people who share an
`org` or a `stories` slug, computed live from the table (`lib/people.js`),
not a separate relations table. Connections are the first slice of the
network-visualization goal below, not the whole thing. Story log only shows
for a person tied to a tracked story; most of the 73 people added in the
2026-08-20 mining pass have no `stories` value, since they were never
story-worthy in the first place - that's expected, not a bug.

## Two different things: the CRM view, and the ledger copy

**`/people` on the platform always renders `ledger_people` straight from
Supabase.** That table is the CRM. It is not a staging area or an inbox to
empty out - a person stays listed there permanently, synced into the git
ledger or not. Do not build a "pending" or "not yet synced" view back into
`/people` - that reads as ledger-engineering internals, not a CRM, and
confused Alex the first time it shipped (2026-08-20).

**Pulling an entry into the git-tracked ledger markdown is a separate,
internal step** - it exists so a story file or `graph/people.md` carries
the context inline for whoever reads *that* file cold (per `SKILL.md`:
"what a stranger would need to not sound stupid"). It is not rendered back
on `/people`, and Alex never needs to see it happen. Do this every
`/ledger` run:

1. `select * from ledger_people order by created_at;` - compare against
   what is already written into `graph/people.md` and the story files
   (there is no `synced` flag; the ledger markdown itself is the record of
   what has already been pulled in, so check before re-adding a duplicate)
2. For each row not yet reflected in the markdown, read `stories` to find
   where it goes - see "Where an entry goes" below. If `stories` is empty
   or names a story that does not exist, say so in the run's report rather
   than guessing where it belongs
3. Write the entry using the format below, into the right file
4. Mention what got pulled in in the run's report, same as commitments and
   feedback - Alex should see "added background: X" without opening the
   site

## Where an entry goes

- **A person tied to one story** (most cases - `kind: person` in the story
  file): add a `## Background (Alex-provided)` section directly in that
  story's markdown file, `ledger/stories/<slug>.md`
- **A person who spans more than one story** (Richard Lowe: `ai-hackathon-
  bristol` and `interviews`, related to `gta-whitepaper` through the advocacy
  network): add the entry to `ledger/graph/people.md` instead, under its own
  `## Background (Alex-provided)` section - one entry per person, not
  duplicated across every story file they touch

If unsure which a person is, check `graph/relations.md` and the story files'
`people:` fields first. A name that recurs across stories belongs in
`graph/people.md`.

## Format

```md
### <Person name>
- background (Alex, YYYY-MM-DD): <what Alex said, close to his own words>
- confirms / new: does this match something already in the ledger, or is it
  new? State which explicitly - a match is a cross-check, a new fact is new
  ground
```

## Hard rules

- **Record only what Alex actually states.** Never infer, guess, or fill in
  a plausible detail he did not say - the same discipline as commitments and
  feedback. An unexpanded acronym or an unclear reference stays unexpanded;
  say so rather than guessing what it means
- **Keep it separate from mailbox evidence.** A Background entry is Alex's
  memory, not a finding. Do not present it back to him later as though the
  agent discovered it, and do not merge it silently into `notes:` fields that
  otherwise hold mailbox-sourced facts
- **Cross-check against the graph.** When a Background entry touches an org,
  a relation, or an identity already recorded in `graph/orgs.md`,
  `graph/relations.md`, or elsewhere in `graph/people.md`, say whether it
  confirms or contradicts what is already there. A confirmation is worth
  recording too - it raises confidence in a mailbox-only finding

## Roster completeness

The roster started (2026-08-20) as everyone with a `kind: person` entry
clearly named in a tracked story, plus the `_index.md` "below threshold"
list - 52 people. Alex flagged this as incomplete: he has corresponded with
far more people since ~April 2025 than the 34 tracked stories capture, since
a story only gets created for an *ongoing* relationship, not a single
real exchange.

Closing that gap needs a broader mailbox pass - every distinct external
human correspondent, not just story-worthy ones - which is a different,
wider bar than `references/discovery.md`'s story-clustering threshold. Same
hard rule applies at the wider bar: a name goes in only when it is stated
somewhere (a header display name, prose in a thread) or unambiguously
readable from a `firstname.lastname@` address - never guessed from a bare
handle. Report coverage honestly (what date range and thread volume was
actually checked) rather than implying a complete sweep that didn't happen.

**First mining pass, 2026-08-20**: a background agent read `in:sent` and
`in:inbox` in quarterly windows from Jan 2025 to today, metadata-only (no
message bodies), one page (up to 50 threads) per window - 16 search calls.
It found 73 new distinct correspondents not already in the roster: 55 with a
confirmed name (a header display name, or unambiguous from a
`firstname.lastname@` address), 18 with no safe name, where the `name` field
holds the email address itself rather than a guess. Two apparent finds
(`Richard@hewlettrand.com`, `valentina.studiogaldieri@gmail.com`) turned out
to already be in the roster under those exact identities - checked and
skipped, not duplicated. Roster is now 125 people.

**Coverage was not exhaustive on the first pass.** Q4 2025, Q1 2026 and Q2
2026 sent mail each showed roughly 201 threads total against the ~50 a
single page reads - three quarters with a real, sizeable gap. Early 2025
quarters had low volume and were likely read close to completely.

The pass also found a direct correction candidate: `hamed@otio.ai` has a
real two-way exchange (16 Mar 2026), which the `_index.md` "⚠️ Anomalies"
table did not expect - see that file for the flagged note, not yet resolved
against the specific labeled threads.

## One person, more than one email address

A person can write from more than one address - a work email and a
personal Gmail, or two work domains. `ledger_people` has one `identity`
field, not a list, so the convention is: put every confirmed address in
that one field, separated by ` / ` (e.g. `akumiega@iit.edu /
andrew@kumiega.ch`). `ledger_people_emails` needs no change for this - it
keys by `person_id`, so threads found under either address just get
inserted under the same person and the Email log shows them together.

**Only merge two addresses when there is real evidence they are the same
person** - a name that matches across both (a header, a subject line
addressing them by name), Alex stating it directly, or both. A shared
domain alone is a hint, not proof. Andrew Kumiega (`akumiega@iit.edu` /
`andrew@kumiega.ch`) is the first case: Alex named him directly, and a
second Gmail search on the other address turned up a real thread
addressing him as "Andrew" too - two independent signals, not one guess
stacked on itself.

If a possible second address turns up with no such evidence, note it in
`background` as unconfirmed (see the `hamed@otio.ai`-style flags above)
rather than merging on a hunch - a wrong merge silently loses the
distinction between two different people.

**Merge is now a real feature on the platform, not a one-off SQL fix.**
Every person page has a "Merge a duplicate" form - pick another CRM entry
and it folds into the one you're viewing: identity and stories union and
dedupe, org/background/starred fill in from whichever side has them, and
every email log row moves over (skipping any `thread_id` the survivor
already has). The duplicate is archived and marked `merged_into`, never
deleted - Unarchive on its own page clears the marker and undoes the
merge, since the anon key has no delete grant on this table by design.
Andrew Kumiega above was done by hand before this shipped; anything after
2026-08-20 should use the form instead.

## Lists and the spreadsheet view, added 2026-08-20

Alex wanted `/people` to feel like a spreadsheet, and a way to group
people into lists - his own examples were Service Providers (Netline,
beehiiv, Sparkloop), Multipliers (relationships worth growing - Richard
Lowe), and Sales-related people. `lists` is a free-text tag column, same
convention as `stories` (comma-separated, `parseLists()` in
`lib/people.js`), not a fixed enum - Alex said he "might" manage more
lists later, so tags stay open-ended rather than a closed set.

`/people` is now a real HTML table (star, name, org, identity, lists,
background, archive as columns), sortable by name or org via the column
headers. Filter tabs above the table are computed from whatever tags
actually exist right now, plus an "Uncategorized" bucket - not
hand-maintained. List and background cells save on blur or Enter
(`TableCellInput.jsx`), no visible Save button, closer to how a real
spreadsheet behaves.

**Seeded only what Alex named directly** - people at Netline, beehiiv, and
Sparkloop got `Service Providers`; Richard Lowe got `Multipliers`.
Everyone else is untagged. Same discipline as everywhere else in this
CRM: naming three examples is not the same as saying "categorize
everyone" - the rest is Alex's call, made through the table itself.

**Fixed a scroll bug the same session.** The original Save-background
flow used `redirect()` to add `?saved=1` for the toast, which reset
scroll to the top on every save - painful in a long table. Replaced with
`SaveWatcher.jsx` (reads `useFormStatus` inside the form, fires a
`window` event when the action finishes) and `SavedToast.jsx` (listens
for that event). No redirect, no URL change, no scroll jump.

## Email log, star, and archive, added 2026-08-20

Alex asked why a person's page did not show the actual emails tied to
them - the CRM only ever held a one-line mailbox-mining summary, never
the real thread history. Added `public.ledger_people_emails` (`person_id`,
`thread_id`, `message_date`, `subject`) and populated it: 5 background
agents ran one Gmail search per identity (`{from:X OR to:X}`,
metadata-only) across all 196 people with a known email, 510 threads
found. Each person page now has an **Email log** section - every thread,
dated, linking straight to Gmail. RLS: `select` only for anon, same as
`ledger_people_emails` being Claude-populated data, not something Alex
edits by hand.

Also added `starred` and `archived` boolean columns to `ledger_people`.
`/people` sorts starred people first and hides archived people behind a
"Show archived (N)" link, default view only shows active people. The
person detail page got Star/Unstar and Archive/Unarchive buttons, and its
edit form now covers the whole record (name, identity, org, stories,
background) instead of only background.

**First archive pass, same session.** Alex asked to archive people who
"may not be interesting." Rather than guess, used a checkable rule: a
person whose background note says "sent only" / "no reply" AND whose real
email log (once pulled) confirms exactly one thread with no `Re:` subject
- a genuine one-way cold send nobody answered. 21 people archived on that
basis. The same check caught 10 people where the "no reply" label turned
out to be wrong - their email log had a `Re:` thread the original mining
pass missed - so those were corrected in place, not archived. Anyone can
be unarchived from their own page; nothing is deleted.

**Second mining pass, same day - closing the gap.** Alex asked directly
"are we sure this is everyone." It was not, so a second pass read every
remaining page of `in:sent` for the three gappy quarters, plus `in:inbox`
for the same three quarters (never checked before - two of the three had a
real, previously unflagged gap there too). All six windows are now fully
paged to exhaustion; none hit the 8-page safety cap. `resultCountEstimate`
turned out to be a coarse first-page guess, not the true count - actual
totals were lower than 201 once fully paged.

Found 72 more new people (44 with a confirmed name, 28 with no safe name).
Five results were not new people at all - they resolved names for four
records already in the roster from pass one (`luis@uxpilot.ai` -> Luis,
`ximin.zhou@yingliangads.com` -> Ximin Zhou, `Ericapew@rezolve.com` -> Erica
Pew, `ryan.walkerz46@gmail.com` -> confirmed as the same Ryan Walker as
`sendtoryanwalker@gmail.com`, merged into one row) and a second address for
an existing person (`valeria@psai.consulting`, added as a note on the
existing Valeria / precisionlabs.ai row, not a new row). Updated in place,
not duplicated. Roster is now **197 people**.

Both quarterly windows are now confirmed fully read for 2025-08 through
2026-08.

**Checked: is there mail before Jan 2025?** Alex asked directly to go back
to the start of the mailbox. Checked with three separate `before:` queries -
the real, dated results start 23 Jan 2025 (SparkLoop onboarding mail to
`admin@theaicentral.net`). Nothing earlier resolved to an actual message in
any of the three checks; Gmail's `resultCountEstimate` returned a stray "1"
with no thread behind it, most likely an estimate-API rounding artifact, not
a real email. **The account's real history starts 23 Jan 2025** - both
mining passes above already cover its entire span, start to now. There is
no earlier mailbox history left to mine.

## Eventual goal: a network visualization

Alex's stated long-term aim for this layer is a visual map of his network -
people, orgs, and the edges between them, the same data already structured in
`graph/people.md`, `graph/orgs.md`, and `graph/relations.md`. Background
entries are the raw material: they are what will let a map surface a real
connection between two stories that currently read as unrelated.

Not built. The graph files are the data source once a visualization is
scoped - collect Background entries now, build the view later. Do not
build a visualization without Alex confirming scope and where it should
live (the platform app, a separate tool).
