# Sweep log

One entry per `/support-sweep` run, newest first. Appended at step 9 of the
procedure in `references/inbox.md`.

This is what makes the next sweep cheap: the window to search from, and what was
deliberately left alone last time so it does not get re-triaged.

## Format

```md
## YYYY-MM-DD
- window: newer_than:30d
- scanned: N threads (feedback N / ai101 N / issues N)
- skipped: N already answered, N drafts already present, N automated
- drafted: N
- escalated: N (list them)
- new candidates: <ids, or none>
- promotions proposed: <ids, or none>
- notes: anything the next run needs to know
```

## Runs

_No sweeps run yet. The first run should use `newer_than:30d`; the folders held
15 to 25 threads each at seed time, so a full pass is cheap._
