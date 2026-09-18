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

## 2026-09-18 - scoped sweep, Feedback + AI 101 only, goodwill template for plain fans

Alex asked specifically for this run to skip Issues, and to use the exact
"reach out to people who like us" template (verbatim, sent to three people on
2026-09-13) for anyone simply being warm/positive with no real complaint,
rather than the heavier playbook treatment.

- window: newer_than:30d, Feedback and AI 101 only (Issues skipped this run
  per Alex's request)
- scanned: 23 threads (feedback 15 / ai101 8 / issues 0)
- skipped: 2 already answered (Christian Dressel `1a052751a7c9b516` and Amy
  Hickman `1a03fb7c47392ad6`, both sent the goodwill template on 2026-09-13,
  most recent message in each thread is ours)
- drafted: 19
- escalated: 2
  - Antonio Abad `1a063c5de8e97c0c` - thanks someone named "Juanita" by name,
    not us - looks like a misdirected reply meant for a colleague. Not
    drafted
  - Christian Dressel (older thread) `1a04cf2d0b058367` - happy update on
    2/9, superseded by his later 3/9 reply which already got the full
    goodwill template plus review ask on 2026-09-13. Sending a second one
    would be redundant. Not drafted
- new candidates: `news.vague-interest` (t.kuijlen, "I am interested" with no
  named referent)
- promotions proposed: none this run
- notes for the next run:
  - Stripe was not authenticated this session - every billing-adjacent
    thread in Group D went out unverified against Stripe. Re-check before
    sending: Edmond Fung's CVC concern, and confirm no active Library
    purchase already exists for any of the "paid" mentions
  - Pat Serrano, Bill (gallewilliam), Aliya, Jeff Kushner, Christian
    (Day 3/4), and Brian Kerr all carry `[NEEDS FROM ALEX: ...]` markers -
    real links, badge fixes or resends this skill cannot supply
  - Russell Cavanagh's draft was sent `to` his new gmail address per
    `news.address-change` doctrine, not the old legalaid.nsw.gov.au address
    he wrote from
  - the goodwill-template drafts (5 in Group A, plus Jay's short personal
    follow-up) kept the real "xoxo" sign-off from the verified 2026-09-13
    sends rather than "Love, krissy" - but still carry the standard
    signature block, since SKILL.md requires it on every draft and the
    verified sends did not settle that question either way
  - names guessed from an email handle rather than read from a signature:
    "Steven" (stevengilreath10), "Ed" (edfung, thread `1a03382c14c9d681`
    only - flagged to Alex as "likely Ed Fung", not certain). Where no name
    was derivable with any confidence (cnewell, t.kuijlen, martens_tundras,
    sdehaast) the draft opens "Hi sweetie" per SKILL.md's no-name rule

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
