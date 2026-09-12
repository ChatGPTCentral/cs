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

**Fixed content structure, per Alex, 2026-09-12** - write in English,
in this exact order, each a `## ` section:

1. Opening line: "Hey there, today is {weekday}, this is what we need
   to do:"
2. `## Mid-term priorities` - verbatim from `ledger/roadmap.md`, the
   current month plus the next one
3. `## Editorial tasks` - beehiiv, LinkedIn newsletter, Substack, idea
   generation, anything on the editorial calendar
4. `## Open tasks` - any other open task that is not sales and not
   partnership (from `ledger_tasks`, `status = open`)
5. `## Follow-up // Sales conversations` - sales, sponsorship,
   Passionfroot, brand deals
6. `## Follow-up // Partnerships & Events` - partnerships,
   collaborations, events, external stakeholders
7. `## Follow-up // Others` - anything left over. Say plainly when
   nothing is left, never leave the section out silently and never
   invent content to fill it

Write in the small plain-text convention `/brief` renders into HTML
(see `platform/lib/briefTemplate.js`): `## Title` for a section header,
`- item` for a bullet (consecutive bullet lines group into one list),
a blank line to end a bullet group, `**text**` for inline bold (use it
to mark "Overdue:" or similar).

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
  cross-cutting programs that land in Open tasks / Partnerships &
  Events above

## 2. Midday update (~12:00 UTC / 14:00 CEST, Mon-Fri)

Answers "what's moved since this morning." Short, a check-in, not a
second full brief:

- Replies received since the morning brief
- Sends/drafts confirmed since the morning brief
- What from this morning's list is now closed, and what's still open
- Anything genuinely new and worth flagging (a hot inbound, a call that
  happened)

## 3. Closing recap (~16:00 UTC / 18:00 CEST, Mon-Fri)

Answers "what actually got done today." Verified against real sources
(Gmail `in:sent` for today, today's commits, today's calls if any
transcript exists) - the same discipline as `weekly-recap.md`: every
distinct thing done gets its own line, no folding several into one
summarizing sentence. Ends with what carries into tomorrow's morning
brief, so the loop closes.

## Delivery

**Morning brief - changed 2026-09-12, per Alex.** Does not call
`mcp__Resend__send-email` directly any more. Alex wants to review and
edit the wording before it goes out, at least for the first several
runs - so the trigger instead inserts a new row into Supabase
`ledger_briefs` (project `hvzmgpdfznjdxnruiqmy`): `kind='morning'`,
`brief_date`, `subject`, `content` (the plain-text body above),
`to_emails='alex@thecentral.ai,liz@thecentral.ai'`, `status='draft'`.
Alex reviews and edits it at `/brief` on the platform
(`https://cs-taupe-omega.vercel.app/brief`) and presses "Send now"
when ready - that button calls `/api/send-brief`, a plain Vercel API
route that sends via Resend directly (needs `RESEND_API_KEY` set on
Vercel), independent of any agent session. Whatever is in the box at
send time is exactly what goes out, verbatim - Alex's edit is absolute,
nothing rewrites it afterward. Still send the same content as a chat
message too, with a note that the draft is waiting on `/brief`.

**Midday update and closing recap - parked, 2026-09-12, per Alex.**
Still send by direct Resend email as before (see git history before
this note) until Alex decides how he wants to handle those two -
he asked to do this "one piece at a time," starting with the morning
brief. Do not change their delivery mechanism or content structure
without his explicit say-so.

The weekly recap (`weekly-recap.md`, Saturdays) does not send by email
at all yet - not asked for explicitly.

## Hard rules

Same as everywhere else in this skill: never invent a fact, a date, or
a reply that did not happen. Draft-only stays absolute - none of these
three touchpoints drafts, sends, or creates a Notion task; they report.
Never present a rigid multi-day schedule in place of these - the whole
point Alex made 2026-09-12 is that a week-long plan goes stale by
Tuesday; each touchpoint plans only for its own window.
