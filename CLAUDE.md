# AI Central customer support agent

This repo holds one thing: the `aic-customer-support` skill and the commands that
drive it. It is a draft-and-review support agent over Alex's Gmail.

## Where things are

```
.claude/skills/aic-customer-support/
  SKILL.md              doctrine: persona, hard rules, decision tree
  references/
    inbox.md            Gmail mechanics, verified against the live account
    learning.md         how the topic taxonomy grows itself
    examples.md         four worked replies, including one that is not drafted
  playbooks/
    _index.md           routing table + the entry format
    library-billing.md  refunds, cancellations, charges, logins
    newsletter-ops.md   broken links, lead magnets, list hygiene
    ai101-course.md     course access, logistics, assignment replies
  log/
    candidates.md       unmatched topics awaiting promotion
    sweeps.md           one entry per sweep run
    learn-runs.md       one entry per calibration run
.claude/commands/
  support-sweep.md      /support-sweep
  support-learn.md      /support-learn
scripts/sync-skill.sh   repo <-> ~/.claude/skills
```

## Non-obvious things that will bite you

- **`label:` rejects label IDs.** Despite what the Gmail MCP tool description
  says, `label:Label_9093486262747676900` returns zero results. It matches
  display names only, with spaces converted to hyphens. A malformed query and an
  empty folder look identical. The working queries are in `references/inbox.md`
- **`create_draft` has no `from` parameter.** Drafts inherit the account's
  default send-as identity. The agent writes as Kris, so `kris@thecentral.ai`
  must be Gmail's default send-as or the alias has to be picked per draft
- **There is no send tool.** Only `create_draft`. The agent physically cannot
  send, which is the intended safety property, not a limitation to work around
- **The persona is Kris, the operator is Alex.** Customers receive campaigns from
  "Kris from AI Central" and reply to those. Alex is the human who reviews and
  sends. Skill text saying "Alex says..." means the operator, not the byline
- **The account-level skill copy is separate.** `~/.claude/skills/` is what makes
  the skill available outside this repo, and it does not update itself. Run
  `scripts/sync-skill.sh` after changing the skill

## Editing the skill

The playbooks are meant to be rewritten by the agent, not just by hand. Follow
`references/learning.md`: capture unmatched topics as candidates, promote at
`seen >= 3` with Alex's approval, calibrate against replies actually sent.

Two rules when editing by hand:

- Keep the entry format in `playbooks/_index.md` exact. Loop 2 writes new entries
  by pattern-matching it
- Never fill in a `needs-from-alex` field by inference. Those mark the places
  where a draft needs a real credential, link or amount that nobody has supplied
  yet. Guessing there is how a customer gets sent a password that does not exist

## Style

The skill mandates its own output style: no em dashes (two hyphens with spaces
instead), no trailing periods on bullets, brevity over completeness. The docs
follow the same rules so that examples and doctrine do not contradict each other.
