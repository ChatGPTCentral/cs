# Library billing and access

Money and access. The highest-stakes domain: everything here involves either a
charge the customer disputes or a product they paid for and cannot reach.

All entries are `seeded` - - reverse-engineered from the Issues folder in August
2026, never yet exercised. Read every draft from this file carefully.

## Facts established from the thread history

Verified from real replies in the account. Use these; do not extend them.

- The premium platform is hosted at `https://gpt-central.com`
- Accounts are Memberstack. Credentials are issued per customer and arrive in a
  "You're In! Here's Your Platform Credentials" email
- Billing runs through Stripe and PayPal only. Card statements show the charge as
  **`BEEHIIV.COM MILANO IT`**, which customers frequently do not recognize as us
- Refunds and cancellations are executed by Alex's team, not by this skill

### Pricing, confirmed by Alex 2026-08-07

- 4-week paid trial at **$4.99**
- Converts automatically to **$59.75/year** unless the customer asks to stop the
  trial before it ends
- The $59.75/year covers premium newsletter access plus the AI Library, updated
  weekly
- **There is no monthly plan.** `$4.99/month` is `$59.75/year` divided by twelve.
  Usable as framing, never as an option. Offering someone a monthly plan promises
  a product that does not exist, and the first they would learn of it is a
  $59.75 charge
- Legacy, seen in older threads only: `$39.75`/yr and `$3.99` trial before May
  2026, `$37.49`, `$49.95` lifetime

### The trial buy link

Confirmed by Alex 2026-08-07. This is the link to send anyone who wants to start
the paid trial:

```
https://buy.stripe.com/14A5kC67m22McnWfBxdQQ0e
```

- Apple Pay and PayPal are both available at that checkout, confirmed by Alex.
  That is the answer to `library.payment-method` -- send the link rather than
  describing steps or attaching a screenshot
- Send the **bare** link above. Campaign versions of it carry `utm_*` and
  `_bhlid` tracking parameters; pasting those into a support reply attributes the
  sale to whichever campaign you copied from and corrupts the reporting
- It charges `$4.99`. Do not send it to someone you have quoted a different
  price to without saying what they will actually be charged

**The trial auto-converts.** This is the single most consequential fact in this
file. A customer asking "what happens after the trial" is asking whether they
are about to be charged, and the answer is yes. Say so, and give them the cancel
path in the same breath. Answering vaguely is what turns this topic into
`charge-after-cancel` a month later, and that folder is full of exactly that.

**Never quote a price from an older thread or an older campaign.** Stripe carries
eight active yearly prices between $29.75 and $119.00, and campaigns have shipped
with stale figures. Confirm in Stripe, or say you will confirm.

## Standing rules for this domain

- **Never state a credential, password, or account status you have not been
  handed.** Alex has sent real credentials in this folder before. You do not have
  that data. Mark it `[NEEDS FROM ALEX: credentials for <email>]`
- **Never confirm a refund as done.** "I've asked my team to process this right
  away" is the ceiling. Alex closes the loop
- **Access complaints are not retention conversations.** Do not pitch, do not
  reframe value, do not ask what AI challenge they're working on. Fix, apologize
  once, stop
- Run Step 0 (Stripe) on every entry in this file. If Stripe is unavailable, say
  so in the report line for that thread

---

### library.charge-after-cancel
- status: seeded
- seen: 3
- last-seen: 2026-02-12
- signals: "still being charged", "unauthorized charge", "double charge", "I
  already cancelled". Often a forwarded card statement line, often
  `BEEKIIV.COM MILANO IT` misread as an unknown merchant
- move: refund, immediately, with no explanation of how it happened. This is the
  one topic where the customer is unambiguously owed something. Do not ask them
  to verify, do not ask for the statement again if they already sent it, do not
  explain billing cycles. Confirm the refund is being processed and that the
  subscription is dead. Then verify in Stripe that it actually is, and tell Alex
  if it is not
- draft-shape: apology up front, one line. Confirm refund is in motion. Confirm
  no further charges. One short line inviting them to tell you if anything else
  looks wrong. Sign off
- needs-from-alex: confirmation the refund was actually issued, and that the
  subscription is cancelled at source
- examples: `19be0c72e5d1fbb1`, `19bc195e2eda7986`, `19a65e5955c1f32d`

Note: `19bc195e2eda7986` ran four inbound messages over a month before it was
resolved. Repeat contact on this topic is a brand problem, not a support queue
problem. Escalate any thread here that already has two unanswered inbound
messages, at the top of the report.

### library.paid-no-access
- status: seeded
- seen: 3
- last-seen: 2026-07-29
- signals: "I have paid", "how do I login", "haven't received the login
  information", a screenshot of a receipt. Sometimes buried at the end of a
  message about something else entirely
- move: get them in. Verify the payment in Stripe, then hand off to Alex for the
  actual credentials. Apologize for the gap, especially if the receipt is more
  than a day old. No pitching
- draft-shape: confirm you can see the purchase (only if Stripe verified it).
  Apologize for the delay. State credentials are coming. Give the platform URL.
  Ask them to reply if the login still fails
- needs-from-alex: the credentials themselves, always
- examples: `19c32a1d6a10e110`, `19b027570fdeabfb`, `19fafa97cefbdd63`

### library.login-broken
- status: seeded
- seen: 1
- last-seen: 2025-11-27
- signals: has credentials, they are rejected. "Yesterday I made access but now
  not work". Often a screenshot of an error
- move: distinct from `paid-no-access` - - the handoff already happened and
  failed, so a second set of the same credentials will not help. Get the exact
  error and what they typed, then escalate to Alex with that detail attached.
  Do not guess at a cause
- draft-shape: apologize. Ask for one specific thing (the error message or a
  screenshot of what they see after submitting). Say you're getting it fixed.
  Keep it to three lines
- needs-from-alex: a real fix, or a reset. This topic cannot be closed by a draft
- examples: `19aad692a9d2efe4`

### library.cancel-subscription
- status: seeded
- seen: 2
- last-seen: 2026-07-27
- signals: "cancel my subscription", "stop the auto renewal", "cancellation
  effective immediately", frequently with a request for written confirmation
- move: this is where the retention doctrine in SKILL.md applies, but only on a
  first, calm contact. Read the tone. If they are neutral and it is a first
  touch, one light retention move is fair -- long-timers get the lifetime
  conversion, recent purchases get the guarantee framing. If they used the word
  "immediately", sent a formal-sounding notice, or have written twice, skip
  retention entirely and confirm the cancellation
- draft-shape: confirm the cancellation in the first line, always, before
  anything else. Confirm no future charges. Optionally one line asking what
  drove it, framed as wanting to improve, never as a save attempt. Sign off
- needs-from-alex: the cancellation actually being executed
- examples: `19fa55f8d954214a`, `19f5d7822f581b63`

### library.refund-request
- status: seeded
- seen: 1
- last-seen: 2025-12-08
- signals: explicitly asks for money back, often citing the 30-day guarantee, and
  often already following up on an earlier reply that did not confirm it
- move: process it. If they are invoking the guarantee and the purchase is inside
  30 days, there is nothing to discuss. If they are following up because a
  previous reply was vague, lead with the confirmation they did not get and skip
  every other topic
- draft-shape: confirm the refund is being processed. Confirm the cancellation.
  Thank them for trying it. Three lines, no pitch
- needs-from-alex: the refund
- examples: `19afe599fe12ca53`

### library.cancel-keep-access
- status: seeded
- seen: 1
- last-seen: 2025-11-27
- signals: already cancelled, now asking to use what they paid for until the term
  ends. Warm tone, no complaint
- move: easy yes if they cancelled a yearly term without a refund - - they paid
  for the term. Careful: if they took a refund, access ends. Check Stripe for
  which happened before answering, because getting this backwards either takes
  access from someone who paid or gives it to someone who was refunded
- draft-shape: confirm access runs to their end date, give the platform URL,
  point at credentials. Warm, short
- needs-from-alex: their actual expiry date, and credentials if they need them
  re-sent
- examples: `19ac75ab2c71ac2a`

### library.trial-terms
- status: established (Alex, 2026-08-07)
- seen: 2
- last-seen: 2026-07-16
- signals: took the paid trial and is asking what happens next. "After 30 days,
  how much must I pay?", or the reverse -- believed it ran four weeks and lost
  access early. Often asked **before** buying, so check Stripe before assuming
  they are a customer
- move: say plainly that it auto-converts, name the price, and give the cancel
  path in the same sentence. Do not soften it and do not bury it below a pitch.
  A prospect who is told clearly and buys anyway does not dispute the charge
  later; one who is left to discover it becomes a `charge-after-cancel` thread.
  If their access ended sooner than the offer implied, that is our error:
  restore it, do not explain it
- draft-shape: answer the question in the first line. State the conversion price
  and the interval. State the cancel path. Ask if they want the link. Four lines.
  Quote `$59.75/year` and nothing else -- never present a monthly figure as a
  choice they could make
- needs-from-alex: nothing for the standard answer. Confirm the exact renewal
  date in Stripe if the customer has already bought
- examples: `19f6d2d33809cc6a`, `19bc195e2eda7986`

Do **not** restate the trial price a customer was quoted in a campaign without
checking it. Campaigns have shipped with the pre-May-2026 `$3.99` while the live
trial was `$4.99` -- thread `19f6d2d33809cc6a` is one, sent 2026-07-16.

### library.payment-method
- status: seeded
- seen: 2
- last-seen: 2026-01-01
- signals: cannot or will not pay by card, asks for PayPal, or cannot complete a
  checkout. Often non-US, often an older customer, usually persistent and
  polite. Frequently frustrated by an earlier reply that sent a screenshot
  instead of a working link
- move: PayPal and Apple Pay both work, at the trial buy link above. Send the
  actual link, not an image of one -- the one thread on this topic stalled for
  days because a screenshot was sent where a link was needed. Do not describe the
  steps, do not talk them through a card form
- draft-shape: confirm PayPal works, give the link, one line offering to sort it
  for them if it still fails. Three lines
- needs-from-alex: nothing. Resolved 2026-08-07, the link is in the pricing
  section above
- examples: `19b7babb5f91f6b4`, `19b6f9d83eb6230a`

### library.links-open-in-linkedin
- status: seeded
- seen: 1
- last-seen: 2025-11-26
- signals: paid, is inside the Library, but the resource links push them to
  LinkedIn, sometimes behind a login wall. Usually framed warmly - - "I love the
  platform, it's just that..."
- move: this is the sharpest version of the "it's just LinkedIn content"
  objection, because it is a factual complaint rather than a value objection, and
  the value reframe does not answer it. Do not run the reframe. Acknowledge it as
  a real limitation, get specifics on which links, pass them to Alex
- draft-shape: thank them, agree it is annoying, ask which sections so it can be
  fixed, say the sourcing is being worked on without promising when
- needs-from-alex: whether this is being fixed, and what to tell customers
- examples: `19a92a4f8ec55d6f`

### library.just-linkedin-content
- status: seeded
- seen: 0
- last-seen: n/a
- signals: "all of this is free on LinkedIn", "I did not receive any exclusive
  content", usually within days of purchase and usually attached to a refund ask
- move: the canonical retention reply. Reframe from content to access -- search,
  permanence, organization, comparison. Never defensive. Close with a question
  about what they are working on. If they come back a second time, refund
- draft-shape: see `references/examples.md`, example 1. Match its length
- needs-from-alex: nothing
- examples: none in-folder. Sourced from `references/examples.md`

---

## Changelog

- 2026-08-07 - - seeded from the Issues folder backfill, 15 threads
