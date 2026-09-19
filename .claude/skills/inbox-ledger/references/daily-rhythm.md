# The daily rhythm - brief, update, close

Three standing touchpoints, added 2026-09-12 per Alex: he wants
certainty about what is happening without having to ask, and a rhythm
he can rely on - not a rigid week-long plan, since things change every
day. These replace nothing already running (pulse check, auto-genesis,
Notion sweep, revenue recap); they are the Alex-facing narrative layer
on top of that mechanical data. Midday update stays weekdays only for
now. **The morning brief runs every day, including Saturday and
Sunday - changed 2026-09-19, per Alex, after he found the `/` page
still showing Friday's brief on a Saturday.**

**`/brief` and `/closing` are retired as separate pages - changed
2026-09-19, per Alex: "non abbiamo bisogno né del brief né del
closing, stiamo portando tutte le funzionalità nel today."** Both
sections below describe what still happens; only the surface changed -
everything now lives on `/` (Today). See the rewritten Delivery
section at the bottom for exactly what moved where.

**`/` is a full-width, 3-column layout - changed again 2026-09-19,
same day, per Alex** ("full width, with the panel divided into 3
vertical sections: today's agenda, pending tasks, reminders"):

- **Today's agenda** (left) - the live Targets panel (see below), then
  today's calendar events, then anything pinned "+ oggi" from the
  other two columns ("Picked for today"), then the brief itself
  (Editorial tasks, editable per line, with the Send bar)
- **Pending tasks** (middle) - every open `ledger_tasks` row except
  `kind='reminder'` and anything pinned, plus every story's live
  `next_action`, grouped by the story it belongs to (or "Generale" for
  cross-cutting tasks) - added 2026-09-19, per Alex ("group them by
  category"). Each row has a "+ oggi" button that pulls it into
  "Picked for today" in the left column instead
- **Reminders** (right) - `ledger_tasks` rows with `kind='reminder'`
  and not pinned, plus calendar events beyond today (including the
  ones the "+ istruzione" delegate feature creates - see below).
  Things to come back to, not to do right now. Same "+ oggi" pin
  available here too

All three columns, plus `/nba` (the full unsplit reference list), read
from one shared query (`platform/app/nba/data.js`'s `getBacklogData`)
so they can never show different things for the same data. Pin state
lives on `pinned_today` (a boolean on both `ledger_tasks` and
`ledger_stories`) via `setTaskPinnedToday` / `setStoryPinnedToday` -
one flag, not a separate "today list" table, so nothing can drift
between what's pinned and what the item itself still says.

**Targets panel, added 2026-09-19, per Alex** (`platform/app/
TargetsPanel.jsx`, rendered at the top of Today's agenda): the fixed
monthly targets from `roadmap.md`, each with a live "Current" figure
queried fresh on every page load - never typed into the brief as
static text again, after that text going stale caused a real
€10,000 revenue discrepancy the same day (see `roadmap.md`'s "Current
figures" note for the full root cause and the SECURITY DEFINER
functions each figure is read through).

**Times below are defaults, not confirmed by Alex - flag them as
adjustable whenever this doc is referenced, and update this file the
moment he gives a real preference.**

## 1. Morning brief (~07:30 UTC / 09:30 CEST, every day)

**Every day, including weekends - changed 2026-09-19, per Alex.** The
trigger (`trig_013xpb3ArbHfHKvSqatx5wrT`, "Morning brief (daily)") now
fires `30 7 * * *` instead of `30 7 * * 1-5`. Opening line item 1 below
still reads "today is {weekday}" - Saturday and Sunday are real weekday
values there too, nothing else in the structure changes on a weekend.

Answers "what's on my plate today." Not a single ordered plan - a menu,
sized to a real day (Alex can do more than 3 things, said explicitly
2026-09-12). Pull from data the mechanical sweeps already maintain, do
not re-derive from scratch.

**Fixed content structure - changed 2026-09-19, per Alex** ("sì
unifica... concettualmente quando dico unificare intendo dire
unificare la lista Altro che potresti tacklare" - superseded the same
day by the 3-column layout above, but the brief-content decision
stands). Sections 3 and 5-8 below (Priorities, Open tasks, the three
Follow-up sections) are **retired from the brief's own text** - they
were a hand-written prose mirror of the exact same `ledger_tasks` rows
and story next-actions that the Pending tasks / Reminders columns
already show live on `/`, and having both meant one could drift stale
while the other stayed current (exactly what happened - see the
2026-09-19 note above about `/` showing Friday's brief). Now there is
one list, not two. **Targets dropped from the brief's own text too,
same day** - it moved into the live `TargetsPanel` above the brief
(see the "Today's agenda" bullet above) after the exact same
staleness bug hit it: the static "Current" figure baked into the
brief text was briefly wrong by €10,000 (see `roadmap.md`'s "Current
figures" note). Write in English, in this exact order and nesting:

1. Opening line: "Hey there, today is {weekday}, this is what we need
   to do:"
2. `## Editorial tasks` - beehiiv, LinkedIn newsletter, Substack, idea
   generation, the editorial calendar, and the AI Central Voices
   pipeline (new interviews to send/source - use `### `-free bullets,
   `[New Interview] :: ...` style is Alex's own convention, keep it).
   **This one stays as real narrative content, not a `ledger_tasks`
   mirror** - it is where Alex leaves job-to-be-done context via the
   "+ istruzione" box (see `## Delegated instructions` above), like his
   2026-09-19 note on the `[New Interview]` bullet naming 4 people
   already decided and asking for 20 sourced candidates to pick 6 from
   - not itself a request to action immediately
3. One closing line pointing at the other two columns: something like
   "The rest of what's open is in the Pending tasks and Reminders
   columns alongside this one - no separate list any more." Never
   re-enumerate tasks here even in short form - that is exactly the
   duplication that got removed

**Full enumeration, never a curated subset - per Alex, 2026-09-14**
still governs the unified list itself (and the weekly plan,
`weekly-plan.md`) - it no longer applies to the brief's own text,
which does not enumerate tasks any more.

**Do not force-split tasks across days that have no real date behind
them - per Alex, 2026-09-14**, same feedback, aimed first at
`weekly-plan.md`'s day-by-day section but the same logic applies here:
only give a task its own day when a real `due_date` or calendar time
backs it. "La regola è che ogni giorno cerchiamo di fare il possibile"
(the rule is each day we try to get done what we can) - the backlog
sections above are one pool, not a forecast of which day each item gets
done.

Write in the plain-text convention `/` (Today) renders into HTML (see
`platform/lib/briefTemplate.js`): `## Section`, `### Subsection`,
`#### LABEL` for headers at three levels, `- item` for a bullet
(consecutive bullet lines group into one list, a blank line ends the
group), `- - item` for a nested bullet (one level per repeated `- `),
`**text**` for inline bold (e.g. to mark "Overdue:").

Sources for the Editorial tasks section, same discipline as before -
never invent a fact or a date:

- `ledger_tasks` (`status = open`) filtered to real editorial/content
  items
- Anything editorial that moved overnight the auto-genesis sweep
  already found - don't repeat its digest verbatim, just fold in what
  Alex needs to think about today specifically

Overdue next-actions, "your move" stories, and the general task
backlog no longer feed brief *content* - they are exactly what the
Pending tasks and Reminders columns on `/` already show live, so the
brief does not re-derive them. Today's calendar events do still show
on `/`, just in the Today's agenda column, not inside the brief text
itself.

**On the first real run (2026-09-12), Alex's own rewrite of the draft
surfaced several ledger corrections this doc's earlier version had
missed** - see the "Resolve morning-brief diff" commit the same day.
Take that as a model: when Alex edits a brief instead of just
approving it, diff his version against what was sent and treat every
difference as either a structural preference (adopt silently) or a
possible fact correction (ask, don't assume) - never silently drop
something that disappeared from his rewrite without checking whether
it means "done" or just "not today."

## 1b. Weekly plan PDF (Mondays, 07:00 UTC, before the morning brief)

Answers "what's on my plate this week" - the forward-looking mirror of
`weekly-recap.md`'s backward-looking Saturday recap. Added 2026-09-14
per Alex: "ogni lunedi voglio il pdf di cosa fare questa settimana."
Full structure, sources and the PDF-rendering mechanics live in
`weekly-plan.md` - read that before running it, don't reconstruct the
format from memory. Delivered as an actual PDF file via `SendUserFile`,
not a `ledger_briefs` draft - this one is a direct chat deliverable, not
something Alex reviews and sends himself.

## 2. Midday update (~12:00 UTC / 14:00 CEST, Mon-Fri)

Answers "what's moved since this morning." Short, a check-in, not a
second full brief:

- Replies received since the morning brief
- Sends/drafts confirmed since the morning brief
- What from this morning's list is now closed, and what's still open
- Anything genuinely new and worth flagging (a hot inbound, a call that
  happened)

## 3. Closing (no fixed time any more - a standing capability on `/`)

Answers "what's still open, what's done, what's new today" - not a
prose recap. **Changed 2026-09-12, per Alex**, after the morning
brief's first run showed the real problem with free-text editing: he
has to rewrite prose to correct it, and I have to diff his rewrite
against mine and guess what each change meant. A checklist has no
ambiguity - so closing became a real page (`/closing`), not an email
to edit. **Changed again 2026-09-19, per Alex: `/closing` itself is
retired, folded into `/` (Today) - see Delivery below.** The
underlying behaviour is unchanged, only the page.

`/` (Today, `https://cs-taupe-omega.vercel.app`) lets Alex mark any
open `ledger_tasks` row done or dropped instantly (✓ / ✕, no batch
Save), add a task that came up today, and drop a free-text note for
anything that doesn't reduce to a task (a story detail, a call, a
reply) - that note is saved into Supabase `ledger_closing_notes` for
the next real sweep to read and fold into the right story file
properly (with Gmail verification, real thread ids), not applied
blind from the note text alone.

Nothing about the follow-through changed: the agent's part is the
**next** morning or pulse-check sweep - read any unprocessed
`ledger_closing_notes` rows, apply them to the right story files with
the same discipline as any other sweep (verify against Gmail/Calendar
where the note implies something checkable), then mark them
`processed = true`. The weekday-afternoon trigger that used to point
Alex to `/closing` now points to `/` instead - see Delivery below.

**Delegated instructions - added 2026-09-19, per Alex.** Not every
open item is a plain done/drop. A "+ istruzione" box under every task,
every story next-action, and every brief bullet on `/` lets Alex
delegate a real action in free text instead ("put a reminder on my
calendar for mid next week"), or leave context that redefines the real
job (e.g. "I already decided these 4, source candidates for the rest")
- queued in Supabase `ledger_task_instructions` (`task_id`,
`story_slug`, or `brief_id`+`brief_line`, `status`
pending/done/failed, `result`), picked up by the hourly "Task
instruction worker" trigger, which actually carries it out (a real
Calendar event, a Gmail draft - never sent, a ledger edit, real
research grounded in real sources) within the skill's standing hard
rules, and never closes the linked task/story/bullet itself - that
stays Alex's own ✓.

**Notification, added 2026-09-19, per Alex** ("fai in modo che la
piattaforma mi dice quando è eseguita perché altrimenti devo
controllare"): whenever the worker actually executes at least one
instruction (done or failed, not an empty queue), it sends both a
short chat message and a `PushNotification` call under 200 characters
naming what it did - not just a status change he'd have to notice on
his own.

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
too, with a note that the draft is waiting on `/` (Today) - **not
`/brief`, retired 2026-09-19**, the review/edit/send surface moved to
Today itself (per-line edit via the existing checklist rendering, plus
a compact send bar for subject + "Invia ora").

**Reply-to the sent email - asked about 2026-09-12, not built.** Alex
asked whether someone (e.g. Liz) could reply to the email itself and
have that reshape the brief. Technically possible via Resend's inbound-
email parsing (a receiving route + webhook that reads the reply and
updates the `ledger_briefs` row or logs a `ledger_pending_facts` entry),
but real added complexity - parsing free text back into structured
ledger edits, threading, and validating a reply is really from Alex/Liz
and not spoofed. Not built - `/` already covers pre-send editing;
revisit only if Alex explicitly asks for post-send editing by reply.

**Closing - moved off email entirely, 2026-09-12, per Alex; moved off
its own page, 2026-09-19, per Alex.** No `ledger_briefs` row, no
Resend send - see section 3 above. It is a capability Alex uses
himself on `/` (Today), not a document sent to him and not a separate
page any more.

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
