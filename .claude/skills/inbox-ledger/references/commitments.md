# The commitment scanner

Detector 3 from `SKILL.md`, and the reason this whole project exists. On
2026-08-07 a draft told Sue Sutcliffe *"I'll let you know what they say."*
Twelve days later nothing tracked it. This file is how that stops happening.

## The search

`in:sent`, windowed, OR'd exact-phrase groups. Verified working:

```
in:sent newer_than:90d {"I'll send" "I'll get back to you" "let me check"
"I'll let you know" "I'll ask" "I've asked my team" "I'll have my team"
"I'll follow up" "I'll confirm" "will send you" "I'll look into"}
```

`{ }` with quoted phrases inside is OR-of-exact-phrases in Gmail's syntax - the
same brace syntax used for sender alternation. Confirmed against 90 days of real
mail: 11 threads back, no noise from `-in:sent` traffic leaking in.

Extend the phrase list as false negatives turn up. It will never be complete -
this is a recall tool, not a parser. Read every hit; do not trust the phrase
match alone to mean a promise was made.

## The trap: a passed due date is not the same as a broken promise

Found on the first real run. Alex's 19 June email to Tsvetelin
(`19edf97730365cd0`) contains **five** dated commitments - a Google Doc "mid
next week," an interview "second week of July," a survey turnaround, a
reconnect "after Cannes." Every date is two months stale.

Reported as five broken promises, this would have been noise. It is not: the
GTA whitepaper story shows Alex and Tsvetelin still corresponding in August,
Tsvetelin cc'd on live threads, the relationship visibly continuing. The small
tactical items were almost certainly resolved in conversations this exact
phrase search does not catch - a call, a different thread, Slack, whatever.

**Rule: before reporting a promise as open and overdue, check whether the
relationship continued past the due date.** If the same story has later
inbound or outbound activity, downgrade the old commitment to historical
context in the story file's notes, not a live entry in the commitments table.
If the story has gone quiet since the promise, that silence is itself the
signal - the promise and the general cold-story flag reinforce each other, and
now it belongs in the table.

This is the same discipline as everywhere else in this skill: a plausible
finding from partial data is not a confirmed one. Verify before escalating.

## What counts as open

A commitment is **open** when:

- it is quoted verbatim from a message actually sent (never paraphrased into
  existence)
- no later message in the same story shows it fulfilled or superseded
- either it is recent (within the current sweep window with no follow-up yet),
  or the story has gone quiet since it was made

A commitment is **historical** when the relationship continued past the due
date without an obvious break, and belongs in the story file's notes as
context, not in the live table.

## Where results go

- **The story file's `commitments:` field** - every commitment found for that
  story, open or historical, so the full picture lives with the relationship
- **`ledger/_index.md`, Open commitments table** - only the open ones,
  cross-story, so Alex sees them without opening every file
- **`ledger/log/commitment-runs.md`** - one entry per run: window, hits, how
  many opened, how many downgraded to historical and why

## Procedure

1. Read `ledger/log/commitment-runs.md` for the last window swept. Default to
   90 days on a first run, since-last-run after that
2. Run the search above
3. For each hit, read the sending message in full - `THREAD_VIEW_MINIMAL`
   snippets truncate mid-sentence often enough that a real read is required
   before quoting anything
4. Classify: open or historical, per the rule above
5. Update the relevant story file, the central table, and the log
