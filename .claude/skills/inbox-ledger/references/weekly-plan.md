# The weekly plan (PDF)

A standing Monday job, added 2026-09-14 per Alex: "ogni lunedi voglio il
pdf di cosa fare questa settimana" (every Monday I want the PDF of what
to do this week). Forward-looking - the mirror image of
`weekly-recap.md`, which looks back at the week just finished. Fires
before the Monday morning brief (see `daily-rhythm.md` section 1), so
the day-one brief can fold in anything the plan surfaced.

## What it is not

Not a rewrite of the recap. The recap (`weekly-recap.md`) proves what
already happened, day by day, from git and Gmail. This plan looks
forward: what is due this week, what is already overdue, what calls are
booked, what the standing open-task backlog looks like right now. Same
hard rule as everywhere else in this skill: never invent a fact, a
date, or a next action. A thin Friday is a real gap in the data, not
something to pad.

## Sources, same discipline as the morning brief

- `roadmap.md` - the fixed monthly targets (Revenue, AI Library Trials),
  numbers only, never the daily "Current" figure (that is Alex's own to
  type on `/brief`, not this job's)
- `ledger_upcoming_meetings` / a fresh Calendar check, the whole week
  ahead - one line per day with a real meeting, not just today
- `ledger_stories` (`next_action_date`) - split into overdue and due
  this week, same query as the Genesis-Notion daily sweep already runs
- `ledger_tasks` (`status = open`) - the same task list the morning
  brief draws its Priorities/Open tasks/Sales/Partnerships sections from
- Story files for anything a bare `next_action` line does not explain on
  its own

## Structure

**Corrected 2026-09-14, per Alex, after the first real run split open
tasks across Monday-Friday day-blocks that did not have real per-day
dates behind them.** His words: "non c'è bisogno di splittare in tre -
la regola è che ogni giorno cerchiamo di fare il possibile" (no need to
split across days - the rule is each day we try to get done what we
can). Do not invent a day assignment for a task just to spread the list
out. The backlog is one pool; which day something actually gets done is
worked out day-of, not predicted by this PDF.

1. **Day by day, Monday through Friday** - real calendar commitments
   and next-actions/tasks that carry an actual `due_date` or a real
   meeting time land on their real day. Everything else - the open
   backlog with no specific date - does NOT get force-distributed
   across the week. Put it in the sections below instead, once, not
   spread thin to make every day look populated. A day with nothing
   real dated to it gets an explicit "nothing dated yet" line, never
   silently skipped and never padded with undated items just to fill it
2. **Priorities / Editorial / Open tasks / Sales / Partnerships &
   Events / Others** - same sections and grouping as the morning brief
   (`daily-rhythm.md` section 1, points 3-8), since this is the same
   backlog viewed for the week instead of the day. **Every open item in
   the relevant `ledger_tasks` rows goes in - full enumeration, never a
   curated subset.** Per Alex, 2026-09-14: "ogni report deve avere
   tutti i task, non una selezione - sta a noi poi fare una selezione
   tra quelli più vicini ai soldi" (every report needs every task, not
   a selection - picking which ones are closest to the money is our
   job afterward, not this report's). Deciding what matters most is
   Alex's own read of the full list, not a filter this job applies for
   him
3. **Full overdue enumeration** - every story with a `next_action_date`
   before today, one row each (story, next_action text, days late).
   Same rule as `weekly-recap.md`: never collapse a batch (the
   Passionfroot pitches, when several share a date) into a count plus a
   handful of examples - list every one by name

## Format and delivery

Render as an actual PDF, not a plain-text email body - build an HTML
file styled with the AI Central design tokens (see
`design_handoff_second_brain/README.md`'s "Design tokens" section: baby
powder ground, jet-black borders, fulvous accent, radius 0, Inter), then
print it to PDF with a headless browser
(`chromium.launch({executablePath: '/opt/pw-browsers/chromium'})`,
`page.pdf({format: 'A4', printBackground: true})` - `NODE_PATH` must
point at wherever `playwright` is actually installed in this
environment, check before assuming a path).

Deliver with `SendUserFile` (status: "normal", a short Italian caption
naming the week), not email and not a Supabase `ledger_briefs` row -
this is a chat deliverable, not a draft Alex reviews and sends himself.
Still send a short chat summary alongside the file, same content
outline, since not everyone opens the PDF immediately.

## Hard rules

Same as `weekly-recap.md` and the morning brief: never invent a fact, a
date, or a dollar figure. Draft-only stays absolute even though this
job never drafts anything - it only reads. If a source is unavailable,
say so in the chat message rather than silently producing a thinner PDF.

## Schedule

Mondays, 07:00 UTC (30 minutes before the Monday morning brief). Update
this file, not the trigger prompt, when the format needs to change -
same pattern as the other sweeps.
