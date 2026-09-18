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

## 2026-09-18 - full backlog clear, Feedback + AI 101, Alex watching live

Alex asked for the entire unread backlog cleared in one pass (not the usual
30-day window), skipped Issues by design, and lifted the ~20-draft cap for
this run only. Thread IDs were supplied directly rather than re-derived from
`search_threads`.

- window: full unread backlog, Feedback + AI 101 only (Issues out of scope
  this run)
- scanned: 63 unique threads (feedback 36 / ai101 28, minus 1 dual-labeled
  thread counted once - Adam Song, `19fb909f4c26a6aa`)
- skipped: 7
  - Antonio Abad `1a063c5de8e97c0c` - thanks someone named "Juanita", not us
    - misdirected reply
  - `1a019426670ce474` - internal self-forward (chatgptcentral@gmail.com to
    alex@thecentral.ai) of a customer complaint (Freddie Martin Gillogly) that
    lives in a different thread not in this batch. Last message is from our
    own address, and there is no customer thread here to reply into
  - `1a00154804eefb9e` - two copies of our own campaign send plus an
    out-of-office autoreply, no real customer content
  - `19ff76fb74588d37` - an automated vendor autoresponder (Sipsavvy support),
    not a person replying
  - Carol Boudreaux `19fdd6f320fdd07f` - her "am I in the first 50" question
    is superseded by her own later message in `19fddd27f405048a` showing
    she's already enrolled and excited. Drafted once, on the later thread
  - `19ffcc73ad863425`, `19fb4ada8cd8196b` - copies of the AI 101 campaign
    itself landing in the labeled folder, not customer replies
- drafted: 55
- escalated: 1 - `rm@pasto.se`, `19fd98313123ac96`, `news.data-privacy-complaint`
  (unchanged from the prior flag, still not drafted)
- new candidates: `course.certificate-legitimacy` (Matthew Stokes,
  `19fe12b2977f7020`)
- promotions proposed: none this run (no candidate hit `seen >= 3`)
- notes for the next run:
  - Stripe was not authenticated this session. Cheryl Wilson's billing
    thread (`19fafa97cefbdd63`, buzzword reply + "I paid but never got
    login") and Victor Villagomez's pricing question (`19ffc6bcade40716`)
    both went out unverified against Stripe
  - two different people (Ro Voelkl `19fc6bf8636dfd96`, JR Bolanos
    `19fde83804069367`) independently hit the same missing "MCPs &
    Connectors Guide" link for Class 5 - worth Alex fixing at the source
    rather than per-customer
  - Justin's `99 Claude Power Codes` link (`19f8fafb18818de3`) and
    Elizabeth Barber's Class 6 Skills & Memory Guide link
    (`1a000f2606ca39b1`) are both expired signed URLs with no confirmed
    permanent article link found this run - flagged `[NEEDS FROM ALEX]`
    rather than guessed
  - Adam Song (`19fb909f4c26a6aa`) has a real open question - whether
    Class 3 shipped after Class 2 - that needs a factual answer, not just
    reassurance
  - Stefan Weigl's enrolment saga (`19f9ebd89f8fe7de`) got a reassurance
    reply; his separate broken-carousel-link thread
    (`19f9fdf4cf8ae639`) was answered on its own, since it's a different
    complaint
  - names guessed from an email handle rather than read from a signature:
    Roger (buenroger), Bamidele (bamidelebadiru5), Theresa (theresa2sf).
    Where no name was derivable with any confidence, drafts open "Hi
    sweetie" per SKILL.md's no-name rule (goh.khengheng, rkalpanalove19,
    llsouders, vg.in2011's Gemini-superpowers thread)

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
