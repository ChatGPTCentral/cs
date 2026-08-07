# Calibration log

One entry per `/support-learn` run, newest first. Loop 3 in
`references/learning.md`.

Holds the date the next run reads its window from, plus observations that were
not yet strong enough to change a playbook. A single sent reply is an
observation; two independent instances make it a proposal.

## Format

```md
## YYYY-MM-DD
- window: since YYYY-MM-DD
- sent replies read: N
- topics with no playbook: <ids proposed>
- policy drift found: <topic -> what changed>
- voice notes: patterns in how Alex edited or wrote
- applied: what Alex approved
- observations: single instances, not yet acted on
```

## Runs

## 2026-08-07 - operator correction, not a full run

Alex corrected a belief mid-draft. Logging it here because it is Loop 3 input
even though it did not come from reading sent replies.

- window: n/a, direct correction
- topics with no playbook: none
- **policy drift found:** `library.trial-terms`. The agent had inferred from two
  signals that the paid trial does **not** auto-convert - Cheryl's `$4.99`
  produced a one-time charge with no subscription object, and the
  `revenue-recovery-outreach` skill describes the lapsed cohort as having "no
  active sub, no failed payment - they just walked." Both were wrong as a basis
  for that conclusion. Alex confirmed the 4-week trial **does** auto-convert, to
  `$59.75/year` or `$4.99/month`
- applied: rewrote the `library.trial-terms` entry and promoted it to
  `established`. Added a pricing block to `playbooks/library-billing.md` and
  replaced the stale figures in `SKILL.md`. Added the audience figure, 2,500+
  members
**Second correction, same day.** The first fix introduced a new error: it recorded
`$4.99/month` as a plan a customer could choose. There is no monthly plan.
`$4.99/month` is `$59.75/year` expressed per month, usable as framing only. A
draft offering monthly billing would have promised a product that does not
exist, and the customer would have found out via a $59.75 charge.

Also captured: the $59.75/year covers premium newsletter access plus the
weekly-updated AI Library, and the cancel path is the customer asking to stop the
trial before it ends.

- applied: rewrote the pricing block in both `SKILL.md` and
  `playbooks/library-billing.md`, and added an explicit "quote $59.75/year and
  nothing else" rule to the `library.trial-terms` draft-shape

**Seventh input, same day - the sign-off, and a name that was sitting right there.**

1. **Sign-off is now `Love,` then `krissy 👱🏻‍♀️`** - lowercase, emoji after the
   name. Kris in the body, krissy in the sign-off. This also settles the "krissy"
   ambiguity flagged earlier: Alex did mean the name
2. **`asong@sbgtv.com` was Adam Song.** The draft went out saying "Hi there". The
   address is first-initial-plus-surname at Sinclair Broadcast Group, the most
   ordinary corporate convention there is, and it was decodable without asking
   anyone

- applied: new **Getting their name right** section in `SKILL.md`, with an
  escalation order - sign-off, display name, the email handle itself, beehiiv or
  Stripe, then the company
- **the actual error:** over-generalising a good rule. "Never infer gender from a
  name" is right. It was quietly widened into "do not infer anything about a
  person", which is not. Deriving a name from `firstinitial+lastname` is a
  reading, not a guess
- worse than the mistake: the hypothesis was never surfaced. "Likely Adam Song,
  confirm?" costs Alex one second. Silently defaulting to "Hi there" gave him
  nothing to correct until after it was sent
- second time today caution has cost more than it saved. The other was padding
  Stefan's draft around a question that could not be answered instead of asking
  it

**Sixth input, same day - the signature emoji.**

Alex: use the blonde 👱🏻‍♀️. Applied across `SKILL.md` and every example. The
earlier 👩🏻 was the agent's own inference from the campaign HTML, not something
Alex asked for - a third inference, and a third correction.

- **send-as confirmed.** The Kim reply went out from `kris@thecentral.ai`. That
  had been an open risk since the first sweep was designed: `create_draft` has no
  `from` parameter, so drafts inherit the account default, and there was no way
  to verify it without a real send. The default is right. The warning in
  `references/inbox.md` can stay as a check but is no longer an unknown
- open question for Alex: he wrote "signing from krissy". The signature still
  says `Kris`, which is what every campaign has used. Not changed on one
  ambiguous mention

**Fifth input, same day - two standing rules from Alex.**

1. **Single hyphen everywhere.** "matches how i actually write". The ` - - `
   convention is gone from every file, customer-facing and internal. This also
   settles the conflict logged below: `revenue-recovery-outreach` already
   mandated single `-`, so both skills now agree and a customer who gets mail
   from both hears one voice
2. **Always show the customer's original email above a proposed reply.** Added as
   its own section in `SKILL.md` and enforced in the `/support-sweep` report
   format. Alex is approving a reply to a person he has not read - without the
   inbound message he cannot judge tone, completeness, or whether something was
   missed at the bottom. If a batch is too big to quote every inbound, the batch
   is too big

- **near miss worth recording:** the bulk dash replacement silently corrupted the
  Gmail label names. They are literally `- - - - Feedback` and `- - - - AI 101`,
  so a find-and-replace over " - - " turned them into three dashes. A wrong label
  name returns `{}`, which is indistinguishable from an empty folder - the sweep
  would have reported both folders clean and drafted nothing. Caught on
  verification, restored, and a warning added to `CLAUDE.md`. Verify
  `references/inbox.md` after any bulk edit

**Fourth input, same day - the first real Loop 3 signal.** Alex sent the Lenny
reply and shared the version that actually went out. This is the highest-value
correction so far, because it is the first time a draft could be diffed against
a sent message rather than against Alex's description of what he wants.

- **voice notes, all applied:**
  - Kris is a woman. Warm, affectionate, personal. The agent had written her as a
    competent support desk, which is not who the readers have been hearing from
  - Sign-off is `Love,` then `👩🏻 Kris`. A bare "Kris" is wrong
  - Hearts are in register. ❤️ where the warmth is real
  - Greeting and apology belong on one line. Two paragraphs reads like a form
  - Alex **added** a line the draft did not have at all:
    `i'd love to have you in our community ❤️`. The draft answered the question
    and left the person out
  - Lightly playful with men, purely warm with women. Recorded with the guard
    that gender must never be inferred from a name - the list is international
    and the agent has already been wrong twice today on safer inferences
- applied: new **Who Kris is** section in `SKILL.md`, Tone section rewritten, all
  example sign-offs corrected, and the sent reply added to
  `references/examples.md` as Example 0, ground truth
- **observations:**
  - The substance of the draft survived Alex's edit untouched: price, interval,
    cancel path, link. Every change was warmth. Facts right, person wrong - treat
    that as this agent's characteristic failure
  - Alex wrote `Kris here - sorry` with a single hyphen while keeping the draft's
    ` - ` elsewhere in the same email. The two skills disagree on this
    (`revenue-recovery-outreach` mandates single `-`) and Alex uses both. Still
    unresolved, still worth one decision from him
  - He wrote `i'd` lowercase. Logged as an observation only. One instance is not
    enough to tell a stylistic tic from a phone typo, and `learning.md` says copy
    his register, not his typos

**Third input, same day.** Alex supplied the trial buy link and confirmed Apple
Pay and PayPal are available at that checkout.

- applied: recorded the bare link in `playbooks/library-billing.md` with a rule
  to strip campaign `utm_*` / `_bhlid` parameters before sending, since pasting a
  campaign version misattributes the sale
- **gap closed:** `library.payment-method` had been blocked on
  `needs-from-alex: a working PayPal checkout link` since seeding. Resolved, and
  the entry now points at the link. That topic could not be answered at all
  before this
- side effect: quoting `$4.99` in customer-facing copy is now unavoidable, since
  the link charges it. The `$3.99` figure in the 2026-07-16 campaign is
  superseded in practice

- **observations:**
  - Three of the four `needs-from-alex` markers that blocked batch 1 were closed
    by two short messages. The markers did their job: they named the missing fact
    precisely enough to be answerable in a sentence
  - Two corrections on one fact in one sitting. Pricing is the highest-churn,
    highest-consequence knowledge in this skill and the least safe to infer.
    Confirm it with Alex or Stripe every time rather than carrying it forward
  - Restating a correction back to Alex before drafting is cheap. Both errors
    would have been caught by one sentence of confirmation
  - The inference was reasonable and still wrong. Two corroborating signals were
    not enough on a fact this consequential. Where being wrong would mean telling
    a customer they will not be charged, ask rather than infer
  - Absence of a Stripe subscription object does not prove absence of a renewal.
    Do not use it as evidence again
  - Campaign copy drifts from live pricing. Thread `19f6d2d33809cc6a` advertised
    `$3.99` on 2026-07-16 against a live `$4.99`. Worth a standing check
  - Open question for Alex: is lifetime access still sold? The retention doctrine
    in `SKILL.md` still offers a `~$39.95` lifetime conversion to long-time
    yearly subscribers, and that price predates the May 2026 change

_Before this, no calibration run had been made. On the first run, use a 30-day window. Worth running
once before the first sweep - the Issues folder already holds Alex's replies on
cancellations, refunds, credentials and PayPal, which is the fastest available
correction to the seeded playbooks._
