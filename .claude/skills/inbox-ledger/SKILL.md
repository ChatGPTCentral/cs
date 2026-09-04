---
name: inbox-ledger
description: >-
  Alex's inbox wrapper. Tracks every ongoing conversation as a "story" - a person
  or project spanning many threads and months - and holds the state he cannot:
  whose move it is, what he promised, and what has gone cold. Use whenever Alex
  asks what he owes, what he is forgetting, what needs a reply, what is stale,
  who he has not heard from, "what's on my plate", "did I get back to X", "what
  did I promise", "refresh the ledger", or asks to catch up on a person, deal or
  project by name. Also use before drafting any non-support reply, so the draft
  carries the story's history rather than one thread's. Draft-only: it never
  sends.
---

# Inbox ledger

Alex runs one inbox holding many overlapping contexts - people, deals, projects,
stories - and the failure is not writing replies, it is **holding state between
them**. Threads go quiet, promises evaporate, and the ball sits in his court
invisibly.

This skill keeps that state in git so he does not have to keep it in his head.

## The unit is a story, not a thread

A thread is one exchange. A story is the relationship: every thread with Mark
Duke is one story, and the useful question is never "what did this email say" but
**"where are we with Mark, and whose move is it".**

**A story is a moment** - a stretch of AI Central's life defined by a shared theme
or an external event ("London Tech Week 2026", "The Newsletter Conference 2025"),
or a mission or pursuit ("GTA whitepaper", "AI Hackathon Bristol") - not always a
single person. The sum of stories is the company's history. Most stories so far
are the single-person case (one relationship, one thread of correspondence); an
event or mission story is the same unit at a wider angle - several people, several
threads, one shared occasion. `references/discovery.md`'s participant-clustering
signal is exactly how the wider-angle kind gets found in the mailbox: people who
keep appearing on the same threads around the same occasion are living the same
moment. Alex asked for this framing explicitly (2026-08-20) - see
`platform-plan.md` for the first moments built from it.

Alex's Gmail labels **seed** his stories but do not define them. He named four
stories in conversation and three had no label at all - two of those were live
that week, while most labelled stories were months cold. So stories come from two
places: the label registry in `references/stories.md`, and participant clustering
per `references/discovery.md`.

Underneath is a graph, not a hierarchy: identities cluster into people, people
into orgs, and stories relate to other stories. `references/model.md` has the
node types, the merge rules and the two places the tree shape breaks. Read
`references/stories.md` before touching Gmail regardless - the `label:` syntax is
treacherous and fails silently.

## The three detectors

These map one-to-one onto how things get forgotten.

**1. Your move.** The newest thread's last message is from someone outside the
team. Alex owes a reply and nothing in Gmail says so.

**2. Gone cold.** The last message is ours and nobody answered. Not a failure -
but past a threshold it needs a nudge or a decision to let it die. Default
thresholds: 7 days for a live deal, 30 for a warm relationship, 90 for dormant.

**0. Unlabelled stories.** Recurring participant clusters that no label covers.
This runs first because the other three cannot detect what they cannot see -
`gta-whitepaper` and `ai-hackathon-bristol` were both invisible until clustering
found them, and both were fresher than anything in the label registry. Procedure
in `references/discovery.md`.

**3. Broken promises.** The highest-value detector and the only one that needs
reading sent mail. Procedure, the exact search, and the trap that produces
false positives (a passed due date is not automatically a broken promise - see
`references/commitments.md`) are all documented there, not here. Scan outbound for commitment language - "I'll send", "I'll get
back to you", "let me check", "I'll let you know", "by Friday" - and open a loop
with a due date.

This is not hypothetical. On 2026-08-07 a draft told Sue Sutcliffe *"I'll let you
know what they say"* about a sponsor. Twelve days later nothing tracked it. The
agent built to fix Alex's follow-up problem created one of its own within a week.
Every commitment goes in the ledger the moment it is sent.

## Reading the inbox cheaply

`THREAD_VIEW_METADATA_ONLY` returns each message's sender, date and labels with
no bodies. A whole story's state comes from that. **Never fetch bodies for
triage** - one four-message thread came back at 321,000 characters because it
quoted a campaign. Bodies are for drafting, and only for the thread being
drafted.

## The ledger

`ledger/_index.md` is the board, ranked by what needs Alex first.
`ledger/stories/<id>.md` is one file per story, in the format below.

```md
# <Story name>
- query: label:<hyphen form>
- label-id: <Label_...>
- kind: person | project | domain
- people: who is on the other side
- status: open | closed | dormant | done
- last-touch: <name of whoever sent the last message> - team name means Alex
  owes the reply, counterpart name means it is waiting on them
- last-inbound: YYYY-MM-DD (from whom)
- last-outbound: YYYY-MM-DD (from whom)
- idle: N days
- next-action: the one thing that moves this forward
- commitments:
  - "<quoted promise>" - made YYYY-MM-DD by <who> - due <when> - open | kept
- threads: <ids of the live ones, not all of them>
- notes: what a stranger would need to not sound stupid
```

**`last-touch` replaced the old `yours`/`theirs` vocabulary, per Alex, 2026-09-01** -
he flagged it as confusing. Name the actual person who sent the last message
(`Alex`, `Elizabeth`, `Mark`, `Sam`, or the counterpart's name) instead of an
abstract label. See `references/stories.md`'s "Whose move" section for the
full rule, including which addresses count as the team.

`next-action` is the field that earns its keep. "Reply to Mark" is not an action.
"Send Mark the Q3 numbers he asked for on 12 July" is.

## Tasks - the non-email layer (added 2026-09-04, per Alex)

Alex asked for this skill to work as more than an email concierge - also
as a project manager: who he's dealing with now, who he dealt with in
past weeks, which stories are hot, what's left to do, and **tasks that
are not "write an email"** - cancel a subscription, delete a draft by
hand, make a decision, show up to a call.

`next-action` on a story is always shaped like a reply. A lot of real
open loops are not - `ledger_tasks` (Supabase) is the separate table for
those:

- `title` - the task in plain words
- `kind` - `action` (something to do), `decision` (only Alex can choose),
  `wait` (tracked but blocked on someone else), or `reminder` (a plain
  date nudge)
- `story_slug` - the story it belongs to, or null for something
  cross-cutting (e.g. "bulk-delete the blanked cold drafts")
- `due_date`, `status` (`open` | `done` | `dropped`)
- `source` - always cite where it came from ("per Alex, YYYY-MM-DD", or a
  mechanical source like "snoozed-email" or "calendar")

Same hard rule as everywhere else in this skill: **never invent a task.**
Only two ways a row gets created - Alex says so directly, or a mechanical
signal below produces one with a real source_ref backing it.

**Two new mechanical signals feed this, both checked in the daily
06:30 sweep:**

1. **Snoozed email as a reminder.** Alex snoozes threads in Gmail as his
   own reminder system - confirmed 2026-09-04, `is:snoozed` is a real,
   working search operator (verified: 11 real snoozed threads existed on
   first try). Each sweep, search `is:snoozed`. For a snoozed thread that
   matches an open story, treat it as that story's own reminder signal -
   update `next_action_date` if the story doesn't already have a better
   one. For a snoozed thread that matches no story, log a `reminder`-kind
   task instead of a new story (a snooze alone is not enough signal to
   justify a full story - see the "0. Unlabelled stories" detector for
   the bar a real story needs to clear)
2. **Calendar booking as ground truth, not email.** A booking-link reply
   ("I'll grab a time on your calendar") is not the actual commitment -
   the Calendar event is. Real miss, 2026-09-04: a pulse check read
   Nicolia's email reply and logged "waiting on her," missing that she
   had already booked a call, confirmed on Google Calendar, that never
   showed up in the Gmail thread at all. Whenever a story is waiting on
   someone who mentioned scheduling, check `search_events` on the
   Calendar too, not just Gmail

**Report views** ("who am I dealing with now", "which stories are hot",
"who did I deal with in past weeks") are computed from data the ledger
already holds - `last-touch`, `last-outbound`, `last-inbound` across all
stories - not a new data model. Build these as an on-demand read, the
same way `/ledger` already reads the board, rather than a new file that
goes stale between sweeps.

**Roadmap** ("where are we going") needs Alex's own input on real
priorities - never write this section from inference. Ask him for it
directly when he wants it built; until then, leave it out rather than
fill it with a guess.

## Hard rules

- **Draft only.** The Gmail connector now exposes `send_message`, `reply` and
  `forward`. Do not use them. Draft-only is Alex's standing choice, not a
  technical limit, and it is what makes the ledger safe to run broadly
- **Never invent a commitment.** A promise goes in the ledger only if it is
  quoted from a message actually sent. Paraphrase is how a fictional obligation
  becomes real
- **Never mark a story done because it went quiet.** Quiet is `dormant`. Done
  means someone said so
- **Do not resurface the archive.** `Z - Archived People/` is Alex's decision to
  stop
- Support mail belongs to `aic-customer-support`. This skill records the three
  support folders as one domain entry and routes drafting there
- **Never write a Task Board task whose wording assumes a deliverable
  arrived** ("publish", "send", "upload") without confirming, in the
  actual thread, that it did. An offer is not a delivery. See
  `references/task-board.md` - it exists because of a real mistake

## Operational facts

- **Shipping address for AI Central** (standing, per Alex 2026-08-30):
  Alex Fiore (c/o AI Central Media), 9 Hayes Grove, SE22 8DF, London,
  United Kingdom. Use this whenever a counterpart asks where to ship
  anything. Source: Alex's own message to Jazmin, thread
  `19e4b71f458018eb`, 21 May 2026

## Drafting from a story

When a reply is needed, read the story file first, then the thread. The story
supplies the history - what was promised, what they last asked, how long they
have waited - and the thread supplies the words. A reply that ignores the story
is how someone gets asked a question they already answered in June.

**The strategy field comes before everything.** `ledger_stories.strategy`
(Supabase) holds Alex's own play for a deal, in his words - he edits it on
/nba and /story. Before any draft or follow-up on a story, read the field.
When it is set, it overrides the default selling angle and every template
instinct. When it conflicts with what a template suggests, the strategy
wins without discussion. Never write or edit this field - it is Alex's
voice only, and no automated run (auto-genesis included) touches it.

Identity: Kris for support, Alex for partners, deals and press. `create_draft`
has no `from` parameter and inherits the account default, currently
`kris@thecentral.ai` - so **any draft that should come from Alex must say so in
the report** so he can switch the sender before sending.

## The feedback loop

The platform (`platform/`, deployed to Vercel) has a page, `/feedback`,
where Alex writes free-text notes directly - bugs, corrections, things to
add - backed by a real Supabase table, not a third-party tool. Read it
every `/ledger` run, same as commitments. Procedure, table name and the
write-back rule are in `references/feedback.md`.

## Background - the CRM layer

Alex can add context the mailbox does not carry: where he met someone, who
introduced them, what they actually do - directly on the platform's
`/people` page, no chat needed. Recorded only from what he states, never
inferred. Goes in the story file for a person tied to one story, or in
`graph/people.md` for a person who spans several. Full procedure, format,
and the eventual network-visualization goal are in `references/background.md`.

## References

- `references/model.md` - the graph: identities, people, orgs, stories, edges
- `references/discovery.md` - finding stories nobody labelled
- `references/commitments.md` - the promise scanner, its search, and its false-positive trap
- `references/stories.md` - the registry, verified queries, whose-move rules
- `references/feedback.md` - the in-platform feedback loop: Supabase table, procedure, write-back rule
- `references/background.md` - the CRM layer: Alex-provided context, format, the network-viz goal
- `references/task-board.md` - the Notion Task Board: verifying a task before writing it, the notion_url format
- `../aic-customer-support/references/inbox.md` - Gmail mechanics, signature,
  threading, the quoting trade-off
