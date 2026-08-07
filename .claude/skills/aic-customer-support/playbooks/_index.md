# Topic index

The routing table. Classify every message to one of these ids, then open the
domain file for the full playbook.

## Status values

- **seeded** - - reverse-engineered from the mail already sitting in the three
  folders in August 2026. Never exercised. Treat the `move` as a hypothesis and
  read the draft carefully before sending
- **established** - - promoted through `references/learning.md`, or confirmed by
  Alex. The `move` is policy
- **stale** - - `last-seen` over 6 months and `seen` under 3. Flag for retirement

Seed counts came from a one-time backfill of the folders, not from live sweeps,
so they measure what was in the inbox, not what this skill has handled. See the
closing note in `references/learning.md`.

## Entry format

Every playbook entry uses these fields, in this order. Loop 2 in
`references/learning.md` writes new entries in exactly this shape.

```md
### <domain>.<topic-id>
- status: seeded | established | stale
- seen: <int>
- last-seen: YYYY-MM-DD
- signals: what the customer says or what is true of their account
- move: the decision. What we do, and what we do not do
- draft-shape: the skeleton of the reply, not the words
- needs-from-alex: anything the draft cannot state without a real fact
- examples: <gmail thread ids>
```

`needs-from-alex` is the important one. Most of these topics resolve to a real
credential, a real URL, or a real refund action that this skill has no access to.
When a playbook has an open `needs-from-alex`, the draft carries a
`[NEEDS FROM ALEX: ...]` marker at that spot and the report says so. Never fill
one of these in from inference.

## Library billing and access

`playbooks/library-billing.md`

| id | seen | status | one-line |
| --- | --- | --- | --- |
| `library.charge-after-cancel` | 3 | seeded | charged again after cancelling, or charged twice |
| `library.paid-no-access` | 3 | seeded | paid, never received credentials |
| `library.login-broken` | 1 | seeded | has credentials, they don't work |
| `library.cancel-subscription` | 2 | seeded | wants the subscription stopped |
| `library.refund-request` | 1 | seeded | explicitly asks for money back |
| `library.cancel-keep-access` | 1 | seeded | cancelled, wants access until the term ends |
| `library.trial-terms` | 2 | seeded | took the $3.99 offer, unclear what happens next |
| `library.payment-method` | 2 | seeded | can't or won't pay by card, asks for PayPal |
| `library.links-open-in-linkedin` | 1 | seeded | Library links bounce them to LinkedIn |
| `library.just-linkedin-content` | 0 | seeded | "this is all free on LinkedIn" |

## Newsletter ops

`playbooks/newsletter-ops.md`

| id | seen | status | one-line |
| --- | --- | --- | --- |
| `news.lead-magnet-not-received` | 4 | seeded | asks for the resource the campaign promised |
| `news.broken-link` | 2 | seeded | a link 404s or errors |
| `news.wrong-lead-magnet` | 1 | seeded | got a different resource than the one announced |
| `news.duplicate-sends` | 1 | seeded | receiving the same email more than once |
| `news.address-change` | 1 | seeded | move the subscription to a different address |
| `news.data-privacy-complaint` | 1 | seeded | angry about the gated form or data collection |
| `news.product-question` | 4 | seeded | "can this tool do X for my use case" |
| `news.topic-request` | 2 | seeded | asks us to cover a topic |
| `news.praise` | 4 | seeded | positive feedback, no ask |
| `news.conversational-reply` | 5 | seeded | replies to a campaign with no ask at all |
| `news.off-topic-ask` | 1 | seeded | wants free help with their own business |
| `news.unsubscribe` | 0 | seeded | wants off the list |

## AI 101 course

`playbooks/ai101-course.md`

| id | seen | status | one-line |
| --- | --- | --- | --- |
| `course.assignment-reply` | 7 | seeded | answering the lesson's "hit reply" prompt |
| `course.quiz-no-content` | 3 | seeded | finished the quiz, got nothing |
| `course.how-to-start` | 2 | seeded | how and when does the course begin |
| `course.logistics` | 2 | seeded | free? certificate? deadline? |
| `course.lesson-not-received` | 1 | seeded | a lesson email never arrived |
| `course.link-broken` | 1 | seeded | the join link doesn't work |

## Disambiguation

Cases that look like two topics:

- **A broken link that is the AI 101 join link** goes to `course.link-broken`.
  Any other broken link goes to `news.broken-link`
- **Paid, no access** vs **login broken**: never received credentials at all is
  `library.paid-no-access`. Has credentials that are rejected is
  `library.login-broken`. If unclear, treat as `paid-no-access` and ask
- **A course reply that also mentions a payment problem** is two topics. The
  billing one leads the draft. Log both
- **Praise that ends in a pitch** (submission guidelines, partnership, ad sales)
  is not `news.praise`. Do not draft it. Flag for Alex
