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
not re-derive from scratch:

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
- The open cross-cutting programs from `ledger_tasks` and
  `roadmap.md` that don't have a natural daily trigger of their own
  (website sections, accounting, the AI Summit NY trip planning,
  Bristol follow-through, sequencing notes like Awais-then-Rory) -
  rotate through these rather than listing all of them every day, so
  they surface regularly without becoming background noise

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

**Added 2026-09-12, per Alex.** All three touchpoints also send by real
email via Resend (not the Gmail connector - a separate account, not
covered by the draft-only rule) - `mcp__Resend__send-email`, from
`Brief AI Central <noreply@app.thecentral.ai>` (domain verified on
Resend, region eu-west-1), to `alex@thecentral.ai` and
`liz@thecentral.ai`. This is in addition to the in-session chat message,
not a replacement - send both every time. Subject line: "Morning brief -
{date}" / "Midday update - {date}" / "Closing recap - {date}".

The weekly recap (`weekly-recap.md`, Saturdays) does not yet send by
email - not asked for explicitly. Add the same Resend block there if
Alex wants it too.

## Hard rules

Same as everywhere else in this skill: never invent a fact, a date, or
a reply that did not happen. Draft-only stays absolute - none of these
three touchpoints drafts, sends, or creates a Notion task; they report.
Never present a rigid multi-day schedule in place of these - the whole
point Alex made 2026-09-12 is that a week-long plan goes stale by
Tuesday; each touchpoint plans only for its own window.
