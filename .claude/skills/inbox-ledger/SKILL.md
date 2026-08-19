---
name: inbox-ledger
description: >-
  Alex's inbox wrapper. Tracks every ongoing conversation as a "story" - a person
  or project spanning many threads and months - and holds the state he cannot:
  whose move it is, what he promised, and what has gone cold. Use whenever Alex
  asks what he owes, what he is forgetting, what needs a reply, what is stale,
  who he has not heard from, "what's on my plate", "did I get back to X", "what
  did I promise", "refresh the ledger", or asks to catch up on a person, deal or
  project by name. Also use before drafting any non-support reply, so the draft
  carries the story's history rather than one thread's. Draft-only: it never
  sends.
---

# Inbox ledger

Alex runs one inbox holding many overlapping contexts - people, deals, projects,
stories - and the failure is not writing replies, it is **holding state between
them**. Threads go quiet, promises evaporate, and the ball sits in his court
invisibly.

This skill keeps that state in git so he does not have to keep it in his head.

## The unit is a story, not a thread

A thread is one exchange. A story is the relationship: every thread with Mark
Duke is one story, and the useful question is never "what did this email say" but
**"where are we with Mark, and whose move is it".**

Alex's Gmail labels already encode his stories. The registry, the verified query
for each, and the whose-move rules are in `references/stories.md`. Read it before
touching Gmail - the `label:` syntax is treacherous and fails silently.

## The three detectors

These map one-to-one onto how things get forgotten.

**1. Your move.** The newest thread's last message is from someone outside the
team. Alex owes a reply and nothing in Gmail says so.

**2. Gone cold.** The last message is ours and nobody answered. Not a failure -
but past a threshold it needs a nudge or a decision to let it die. Default
thresholds: 7 days for a live deal, 30 for a warm relationship, 90 for dormant.

**3. Broken promises.** The highest-value detector and the only one that needs
reading sent mail. Scan outbound for commitment language - "I'll send", "I'll get
back to you", "let me check", "I'll let you know", "by Friday" - and open a loop
with a due date.

This is not hypothetical. On 2026-08-07 a draft told Sue Sutcliffe *"I'll let you
know what they say"* about a sponsor. Twelve days later nothing tracked it. The
agent built to fix Alex's follow-up problem created one of its own within a week.
Every commitment goes in the ledger the moment it is sent.

## Reading the inbox cheaply

`THREAD_VIEW_METADATA_ONLY` returns each message's sender, date and labels with
no bodies. A whole story's state comes from that. **Never fetch bodies for
triage** - one four-message thread came back at 321,000 characters because it
quoted a campaign. Bodies are for drafting, and only for the thread being
drafted.

## The ledger

`ledger/_index.md` is the board, ranked by what needs Alex first.
`ledger/stories/<id>.md` is one file per story, in the format below.

```md
# <Story name>
- query: label:<hyphen form>
- label-id: <Label_...>
- kind: person | project | domain
- people: who is on the other side
- status: yours | theirs | dormant | done
- last-inbound: YYYY-MM-DD (from whom)
- last-outbound: YYYY-MM-DD (from whom)
- idle: N days
- next-action: the one thing that moves this forward
- commitments:
  - "<quoted promise>" - made YYYY-MM-DD by <who> - due <when> - open | kept
- threads: <ids of the live ones, not all of them>
- notes: what a stranger would need to not sound stupid
```

`next-action` is the field that earns its keep. "Reply to Mark" is not an action.
"Send Mark the Q3 numbers he asked for on 12 July" is.

## Hard rules

- **Draft only.** The Gmail connector now exposes `send_message`, `reply` and
  `forward`. Do not use them. Draft-only is Alex's standing choice, not a
  technical limit, and it is what makes the ledger safe to run broadly
- **Never invent a commitment.** A promise goes in the ledger only if it is
  quoted from a message actually sent. Paraphrase is how a fictional obligation
  becomes real
- **Never mark a story done because it went quiet.** Quiet is `dormant`. Done
  means someone said so
- **Do not resurface the archive.** `Z - Archived People/` is Alex's decision to
  stop
- Support mail belongs to `aic-customer-support`. This skill records the three
  support folders as one domain entry and routes drafting there

## Drafting from a story

When a reply is needed, read the story file first, then the thread. The story
supplies the history - what was promised, what they last asked, how long they
have waited - and the thread supplies the words. A reply that ignores the story
is how someone gets asked a question they already answered in June.

Identity: Kris for support, Alex for partners, deals and press. `create_draft`
has no `from` parameter and inherits the account default, currently
`kris@thecentral.ai` - so **any draft that should come from Alex must say so in
the report** so he can switch the sender before sending.

## References

- `references/stories.md` - the registry, verified queries, whose-move rules
- `../aic-customer-support/references/inbox.md` - Gmail mechanics, signature,
  threading, the quoting trade-off
