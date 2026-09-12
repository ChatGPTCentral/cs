# The daily rhythm - brief, update, close

Three standing touchpoints, added 2026-09-12 per Alex: he wants
certainty about what is happening without having to ask, and a rhythm
he can rely on - not a rigid week-long plan, since things change every
day. These replace nothing already running (pulse check, auto-genesis,
Notion sweep, revenue recap); they are the Alex-facing narrative layer
on top of that mechanical data, on weekdays only for now.

**Times below are defaults, not confirmed by Alex - flag them as
adjustable whenever this doc is referenced, and update this file the
moment he gives a real preference.**

## 1. Morning brief (~07:30 UTC / 09:30 CEST, Mon-Fri)

Answers "what's on my plate today." Not a single ordered plan - a menu,
sized to a real day (Alex can do more than 3 things, said explicitly
2026-09-12). Pull from data the mechanical sweeps already maintain, do
not re-derive from scratch.

**Fixed content structure, per Alex's own rewrite, 2026-09-12** - write
in English, in this exact order and nesting:

1. Opening line: "Hey there, today is {weekday}, this is what we need
   to do:"
2. `## September's Targets:` (rename per current month) - the fixed
   monthly targets from `roadmap.md` (e.g. Revenue, AI Library Trials),
   each as `- Metric: $X (Current: $Y)`. **The target is fixed and
   comes from `roadmap.md`; the "Current" figure is Alex's own to type
   each day - never compute or guess it**
3. `## Priorities` - real near-term priorities, not the whole roadmap -
   pull from `ledger_tasks` (`status = open`, cross-cutting, no
   story_slug) rather than reproducing `roadmap.md` verbatim
4. `## Editorial tasks` - beehiiv, LinkedIn newsletter, Substack, idea
   generation, the editorial calendar, and the AI Central Voices
   pipeline (new interviews to send/source - use `### `-free bullets,
   `[New Interview] :: ...` style is Alex's own convention, keep it)
5. `## Open tasks` - any other open task that is not sales and not
   partnership, grouped into `### ` subsections by area (Website,
   a person/project name, Admin, etc. - whatever `ledger_tasks` groups
   naturally into that day)
6. `## Follow-up // Sales conversations` - grouped into `### `
   subsections (e.g. Affiliate, Brand Deals), and Brand Deals further
   grouped into `#### ` state labels: OPEN, TO CREATE, STUCK, REVIVE.
   An empty label under a header is fine - never invent an item to
   fill it
7. `## Follow-up // Partnerships & Events` - partnerships,
   collaborations, events, external stakeholders. Nested nested bullets
   (`- - `, `- - -`) are fine for grouping sub-items like a list of
   contacts under one initiative
8. `## Follow-up // Others` - anything left over. Say plainly when
   nothing is left, never leave the section out silently and never
   invent content to fill it

Write in the plain-text convention `/brief` renders into HTML (see
`platform/lib/briefTemplate.js`): `## Section`, `### Subsection`,
`#### LABEL` for headers at three levels, `- item` for a bullet
(consecutive bullet lines group into one list, a blank line ends the
group), `- - item` for a nested bullet (one level per repeated `- `),
`**text**` for inline bold (e.g. to mark "Overdue:").

Sources for the sections above, same discipline as before - never
invent a fact or a date:

- Real calendar events today (`ledger_upcoming_meetings` / a fresh
  Calendar check) - with a one-line prep note for each if the story it
  connects to has one
- Stories with `next_action_date` = today or already overdue
- "Your move" stories with a real, live ask (not the whole stale
  backlog every day - surface the backlog on a slower cadence, see
  `weekly-recap.md`, not every morning)
- Anything that moved overnight the auto-genesis sweep already found -
  don't repeat its digest verbatim, just fold in anything Alex needs to
  act on today specifically
- `ledger_tasks` (`status = open`) and `roadmap.md` for the
  cross-cutting programs and monthly targets above

**On the first real run (2026-09-12), Alex's own rewrite of the draft
surfaced several ledger corrections this doc's earlier version had
missed** - see the "Resolve morning-brief diff" commit the same day.
Take that as a model: when Alex edits a brief instead of just
approving it, diff his version against what was sent and treat every
difference as either a structural preference (adopt silently) or a
possible fact correction (ask, don't assume) - never silently drop
something that disappeared from his rewrite without checking whether
it means "done" or just "not today."

## 2. Midday update (~12:00 UTC / 14:00 CEST, Mon-Fri)

Answers "what's moved since this morning." Short, a check-in, not a
second full brief:

- Replies received since the morning brief
- Sends/drafts confirmed since the morning brief
- What from this morning's list is now closed, and what's still open
- Anything genuinely new and worth flagging (a hot inbound, a call that
  happened)

## 3. Closing recap (~16:00 UTC / 18:00 CEST, Mon-Fri)

Answers "what's still open, what's done, what's new today" - not a
prose recap. **Changed 2026-09-12, per Alex**, after the morning
brief's first run showed the real problem with free-text editing: he
has to rewrite prose to correct it, and I have to diff his rewrite
against mine and guess what each change meant. A checklist has no
ambiguity - so closing is a real page, not an email to edit.

`/closing` on the platform (`https://cs-taupe-omega.vercel.app/closing`)
lists every open `ledger_tasks` row with a three-way control (Still
open / Done / Dropped, defaulting to Still open), a small form to add
a task that came up today, and a free-text box for anything that
doesn't reduce to a task (a story detail, a call, a reply) - that note
is saved into Supabase `ledger_closing_notes` for the next real sweep
to read and fold into the right story file properly (with Gmail
verification, real thread ids), not applied blind from the note text
alone.

The trigger's job at closing time is narrower than before: open
`/closing` is Alex's job, not something to email him. The agent's part
is the **next** morning or pulse-check sweep - read any unprocessed
`ledger_closing_notes` rows, apply them to the right story files with
the same discipline as any other sweep (verify against Gmail/Calendar
where the note implies something checkable), then mark them
`processed = true`.

## Delivery

**Morning brief - changed 2026-09-12, per Alex.** Does not call
`mcp__Resend__send-email` directly any more. Alex wants to review and
edit the wording before it goes out, at least for the first several
runs - so the trigger instead inserts a new row into Supabase
`ledger_briefs` (project `hvzmgpdfznjdxnruiqmy`): `kind='morning'`,
`brief_date`, `subject='[Morning Brief] - Your Todo's'`, `content`
(the plain-text body above),
`to_emails='alex@thecentral.ai,liz@thecentral.ai'`, `status='draft'`.
Alex reviews and edits it at `/brief` on the platform
(`https://cs-taupe-omega.vercel.app/brief`) and presses "Send now"
when ready - that button calls `/api/send-brief`, a plain Vercel API
route that sends via Resend directly as **"AI Secretary"**
(`noreply@app.thecentral.ai`, needs `RESEND_API_KEY` set on Vercel),
independent of any agent session. Whatever is in the box at send time
is exactly what goes out, verbatim - Alex's edit is absolute, nothing
rewrites it afterward. Still send the same content as a chat message
too, with a note that the draft is waiting on `/brief`.

**Reply-to the sent email - asked about 2026-09-12, not built.** Alex
asked whether someone (e.g. Liz) could reply to the email itself and
have that reshape the brief. Technically possible via Resend's inbound-
email parsing (a receiving route + webhook that reads the reply and
updates the `ledger_briefs` row or logs a `ledger_pending_facts` entry),
but real added complexity - parsing free text back into structured
ledger edits, threading, and validating a reply is really from Alex/Liz
and not spoofed. Not built - `/brief` already covers pre-send editing;
revisit only if Alex explicitly asks for post-send editing by reply.

**Closing recap - moved off email entirely, 2026-09-12, per Alex.**
No `ledger_briefs` row, no Resend send - see section 3 above. It is a
page Alex fills himself at `/closing`, not a document sent to him.

**Midday update - still parked, 2026-09-12, per Alex.** Untouched -
he asked to do this "one piece at a time," morning first, then closing.
Do not change its delivery mechanism or content structure without his
explicit say-so.

The weekly recap (`weekly-recap.md`, Saturdays) does not send by email
at all yet - not asked for explicitly.

## Hard rules

Same as everywhere else in this skill: never invent a fact, a date, or
a reply that did not happen. Draft-only stays absolute - none of these
three touchpoints drafts, sends, or creates a Notion task; they report.
Never present a rigid multi-day schedule in place of these - the whole
point Alex made 2026-09-12 is that a week-long plan goes stale by
Tuesday; each touchpoint plans only for its own window.
