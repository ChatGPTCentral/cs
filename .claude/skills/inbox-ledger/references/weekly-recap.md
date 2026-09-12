# The weekly recap

A standing Saturday job, added 2026-09-12 after Alex asked for a
Monday-Friday recap twice in the same session before it landed right.
His own words on the first miss: "quando io chiedo un recap io intendo
dire tutto" (when I ask for a recap I mean everything). The second
attempt is now the template - never regress to the first.

## The failure mode this exists to prevent

The first attempt was a themed narrative: one paragraph per deal, one
sentence grouping "22 storie Passionfroot ferme dal 31/8" with a
comma-separated list of names standing in for the real entries. Alex
read it and could not find Katie, could not find Passionfroot, even
though both were technically present - because they were folded into
prose instead of standing as their own lines.

**The rule going forward: never collapse multiple items into one
summarizing sentence.** Every email Alex sent, every draft created,
every story touched, every Passionfroot-style pitch in a stalled batch -
each gets its own line or block. A comma list of names is not an
itemization. When in doubt, split a paragraph into more lines, not
fewer. This is deliberately more verbose than every other output this
skill produces - completeness beats brevity here, the opposite trade-off
from the hourly pulse check.

## Sources, in order

1. **Git log is the backbone.** `git log --since="<Mon> 00:00"
   --until="<Sat> 00:00" --pretty=format:"%H %ad %s%n%b"
   --date=format:"%Y-%m-%d %H:%M"` on this branch, for the whole week.
   Every commit is a real, dated fact - use it, don't reconstruct the
   week from memory.
2. **Gmail `in:sent`, day by day.** For each day Monday-Friday, search
   `in:sent after:<day> before:<day+1>` and read enough of each thread to
   state the real recipient, the real subject/purpose, and what (if
   anything) came back - not just "sent an email to X."
3. **The story files** for full narrative detail behind any commit or
   email too terse to stand on its own.
4. **`ledger_stories` (Supabase)** for the current `next_action_date`
   set, to build the stalled-batch enumeration and the overdue list for
   the "next week" half.

## Structure

**Part 1 - day by day, Monday through Friday.** For each day: every
email Alex personally sent (recipient, real subject, thread id, what
came back), every draft prepared, every story file touched (with what
specifically changed - even a mechanical pulse-check flip gets a line),
every call/meeting with its real substance from a transcript if one
exists, every new story or relationship discovered that day.

**Part 2 - the full sent-mail checklist.** One consolidated list, every
outbound email of the week, one line each: date, recipient, subject,
thread id. This is the section Alex checks first to confirm nothing is
missing - build it from real Gmail search results, not from what Part 1
already listed (cross-check, don't just copy, in case something was
missed the first pass).

**Part 3 - full enumeration of any stalled batch.** If a group of
similar stories shares a next-action-date (the Passionfroot/sponsorship
block has done this twice now), list every single one by name with its
real next-action text and days overdue - never a count plus a comma
list of examples.

**Part 4 - positioning for next week.** Every overdue story named
individually (cross-referenced against Part 3 so nothing is double
counted, but nothing dropped either), every live draft still sitting
unsent, every real calendar commitment already on the books, every open
conflict that only Alex can resolve (contradictory figures, a draft that
vanished, an unconfirmed reply).

## Hard rules

Same as everywhere else in this skill: never invent a fact, a date, a
dollar figure, or a reply that did not happen. State uncertainty
plainly rather than smoothing it into a confident sentence. Never mark
a story done because a week passed quietly. Draft-only stays absolute -
this is a read-only report, it never sends or drafts anything itself.

## Schedule

Trigger `trig_...` (see `list_triggers`), Saturdays, fires into this
session. The prompt points here. Update this file, not the trigger
prompt, when the format needs to change - keep the trigger's own prompt
short and pointed at this reference, the same pattern as the other
sweeps.
