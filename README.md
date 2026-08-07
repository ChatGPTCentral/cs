# AI Central customer support agent

A support agent over the Gmail inbox. It reads three folders, works out what each
customer actually wants, and leaves a reply waiting in Gmail Drafts as **Kris
from AI Central**.

It never sends. Every draft waits for review.

## Setup

Three things, once.

**1. Make Kris the default sender.**

Gmail Settings, Accounts and Import, "Send mail as", set `kris@thecentral.ai` as
default. The Gmail API cannot set a From address per draft, so drafts inherit
whatever the default is. Without this, replies signed Kris go out from a
different address.

**2. Turn on Stripe for the session.**

The skill looks up a customer's payment record before drafting anything about
money - how long they have been subscribed, whether a renewal just hit, whether
they were already refunded. That changes the answer. The Stripe connector is
installed but toggled off in chat; enable it in the connector settings. Without
it the agent still drafts, but flags the account as unverified.

**3. Install the skill outside this repo.**

```bash
scripts/sync-skill.sh
```

The repo is the source of truth. This copies the skill to `~/.claude/skills/` so
it also works in Claude Desktop and other projects. Re-run after any change;
`--check` shows what differs.

## Using it

```
/support-sweep            all three folders, last 30 days
/support-sweep 7d         narrower window
/support-learn            calibrate the playbooks against what you actually sent
```

Or just paste a customer email into any session in this repo and ask for a reply.
The skill triggers on its own.

A sweep gives you back: escalations first, then broken links collected across all
three folders, then a table of drafts with anything still missing marked
`[NEEDS FROM ALEX: ...]`.

## The folders

| Folder | What is in it | Mostly |
| --- | --- | --- |
| `❌ ❌ ❌ Issues` | refunds, cancellations, double charges, locked-out customers | real tickets |
| `- - - - Feedback` | campaign replies, broken links, missing lead magnets | mixed |
| `- - - - AI 101` | course replies, mostly homework from lesson 3 | mostly not support |

## How it gets better

The topic list was seeded by reading every thread in those folders - 28 topics
across billing, newsletter ops and the course. It is not meant to stay that way.

- Every sweep classifies each thread. Anything that fits nothing gets logged as a
  candidate in the customer's own words, and still gets a draft
- A candidate seen three times gets proposed for promotion into a real playbook.
  You approve, then it becomes policy
- `/support-learn` reads the replies **you** actually sent and diffs them against
  the playbooks. Where they disagree, you win - that is what catches policy
  drifting away from what is written down

Everything is a git commit, so every change to how customers get answered is
reviewable in a diff and revertible.

## What it will not do

- Send anything
- Invent a login, a link, a coupon, or a refund amount. Those become
  `[NEEDS FROM ALEX: ...]` markers in the draft
- Promise a refund date, or a ship date for an upcoming feature
- Argue with someone who has clearly decided to leave
- Draft a reply to a legal threat, a chargeback, a press inquiry, or a
  partnership pitch. Those get flagged instead
