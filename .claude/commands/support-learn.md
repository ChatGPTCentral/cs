---
description: Read the support replies actually sent and propose corrections to the playbooks
argument-hint: "[optional: a window like 60d, defaults to since the last run]"
allowed-tools: Skill, Read, Edit, Write, mcp__Gmail__search_threads, mcp__Gmail__get_thread, mcp__Gmail__get_message, mcp__Gmail__list_labels
---

Run a calibration pass on the customer support playbooks.

Window for this run: $ARGUMENTS

If that is empty, use the last date in `log/learn-runs.md`, or 30 days on a first
run.

## Why this exists

The playbooks were seeded by reading inbound customer mail, which only shows what
people asked. What Alex actually sent shows what we do about it. Where those two
disagree, the sent reply wins.

## Do this

1. Invoke the `aic-customer-support` skill and follow Loop 3 in
   `references/learning.md`
2. Find our own replies in the three folders -- the folder queries from
   `references/inbox.md` plus `in:sent`, or filter thread messages for the `SENT`
   label. Our addresses are listed in `references/inbox.md`
3. For each sent reply, find the inbound message it answered and classify that
   inbound against `playbooks/_index.md`
4. Diff what Alex sent against what the playbook would have produced, using the
   comparison table in `references/learning.md`

## Report back

Group proposals by confidence:

- **Gaps** -- topics Alex answered that have no playbook. Include a pre-filled
  entry ready to paste, in the format from `playbooks/_index.md`
- **Policy drift** -- where a `move` line no longer matches what we actually do.
  Quote the sent reply that shows it. Two independent instances required, or say
  it is a single instance
- **Shape corrections** -- where his replies are consistently shorter, blunter or
  differently ordered than the `draft-shape`
- **Voice rules** -- patterns worth adding to the Tone section of `SKILL.md`
- **Observations** -- single instances, logged but not proposed

For each proposal state the exact file and field you would change.

## Then

Apply only what Alex approves. Write every finding, applied or not, to
`log/learn-runs.md`. Commit as
`playbook: calibrate from N sent replies (<window>)`.

Do not change a `move` line off a single sent reply. One-offs are observations.
