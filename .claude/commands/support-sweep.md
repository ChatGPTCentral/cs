---
description: Sweep the Feedback, AI 101 and Issues folders and leave a Gmail draft on every unanswered thread
argument-hint: "[optional: a time window like 7d, or a single folder name]"
allowed-tools: Skill, Read, Edit, Write, mcp__Gmail__search_threads, mcp__Gmail__get_thread, mcp__Gmail__get_message, mcp__Gmail__list_labels, mcp__Gmail__list_drafts, mcp__Gmail__create_draft, mcp__Gmail__update_draft
---

Run an inbox sweep as the AI Central customer support agent.

Scope for this run: $ARGUMENTS

If that is empty, sweep all three folders with a `newer_than:30d` window.

## Do this

1. Invoke the `aic-customer-support` skill and follow it. Read
   `references/inbox.md` in full before touching Gmail -- the folder queries have
   two failure modes that return an empty result identical to an empty folder
2. Read `log/sweeps.md` for what the last run covered and deliberately skipped
3. Work through the sweep procedure in `references/inbox.md`, steps 1 to 9
4. Classify every thread against `playbooks/_index.md`. Log anything unmatched
   per `references/learning.md`
5. Create one Gmail draft per thread that warrants a reply. Never send

## Report back

Open with the two pre-flight facts: whether Stripe was available for Step 0, and
the send-as caveat.

Then, in this order:

- **Escalations** -- threads you deliberately did not draft, and why
- **Broken links and delivery bugs** -- collected across all three folders, since
  each one is affecting readers who did not write in
- **Drafts created** -- a table: customer, topic id, one-line summary of what the
  draft does, and any `[NEEDS FROM ALEX: ...]` marker still open in it
- **Buzzword tally** -- if the sweep caught `course.assignment-reply` threads
- **Learning** -- new candidate topics, and any candidate now at `seen >= 3` that
  you propose promoting
- **Left undone** -- anything skipped for volume, with counts. Never truncate
  silently

Sort drafts by the priority order in `references/inbox.md`: money wrongly taken,
then locked-out paying customers, then refunds and cancellations, then everything
else.

## Then

Append the run to `log/sweeps.md`, write any new candidates to
`log/candidates.md`, and commit both with a message naming the counts. Do not
commit anything else in the same commit.
