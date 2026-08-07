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

## 2026-08-07 - first live run, worked one thread at a time with Alex

Not a `/support-sweep` run. Alex reviewed each reply in chat before any draft was
created, which is the right shape for a first pass and caught several things a
batch report would have buried.

- window: 30d on Feedback and AI 101, 60d on Issues
- scanned: 43 threads in scope (feedback 25 / ai101 18 / issues 3 recent)
- **Issues is clean.** Zero unanswered in 60 days. All the pressure is in
  Feedback and AI 101
- skipped: the Nov 2025 - Feb 2026 Issues backlog, ~10 threads, per Alex's ruling
  that it is reference material and not a work queue
- sent: Lenny (`library.trial-terms`), Kim Ridder (`news.duplicate-sends`),
  Stefan Weigl (`course.quiz-no-content`), Bashar Jabban (`course.how-to-start`)
- drafts waiting: gogo, asong, and Carol Boudreaux once approved
- parked as later: Cheryl Wilson, at Alex's request. Her duplicate `$4.99` is
  still unrefunded
- escalated, not drafted: `rm@pasto.se`, `news.data-privacy-complaint`
- blocked: Ro Voelkl, needs the MCPs & Connectors Guide link
- new candidates: none. Every thread matched an existing playbook
- **send-as confirmed.** Replies go out from `kris@thecentral.ai` with no
  per-draft action

### What this run cost, and what it bought

Every single thread that got a beehiiv or Stripe lookup came back different from
what its snippet implied. Four threads that read as the same broken quiz handoff
turned out to be one real failure, one customer who was early by 73 seconds, one
who was enrolled and confused about the format, and one who was on a different
topic entirely. Carol looked like an address change and was already subscribed at
the new address.

Nothing here was findable from the email text. Budget the lookups.

### For the next run

- Marsha McDonald was double-charged on 6-7 August and has not written in. Not a
  support thread, but real money and an unprompted refund
- The AI 101 automation fires on `signup`, `poll_submission` and `api`. Two
  distinct `trigger_id`s are live in the journeys observed. Worth confirming they
  cannot both fire for one person
- The gap between finishing the quiz and the first email landing generates
  tickets from people who are fine. gogo wrote 73 seconds before her enrolment
  completed

_Before this, no sweeps had been run. The first run should use `newer_than:30d`; the folders held
15 to 25 threads each at seed time, so a full pass is cheap._
