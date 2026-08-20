---
description: Refresh the inbox ledger and report what Alex owes, promised, and has let go cold
argument-hint: "[optional: a story name to refresh just that one, or 'commitments']"
allowed-tools: Skill, Read, Edit, Write, Bash, mcp__Gmail__search_threads, mcp__Gmail__get_thread, mcp__Gmail__get_message, mcp__Gmail__list_labels, mcp__Gmail__list_drafts, mcp__Notion__notion-query-data-sources, mcp__Notion__notion-update-page
---

Refresh the inbox ledger.

Scope for this run: $ARGUMENTS

Empty means every story in the registry.

## Do this

1. Invoke the `inbox-ledger` skill. Read `references/stories.md` **before**
   touching Gmail - the `label:` syntax fails silently and the rule is not
   guessable
2. Read the current `ledger/_index.md` so you know what changed since last time,
   and `ledger/graph/` for identity merges already confirmed - re-proposing a
   merge Alex has already approved wastes his attention
3. For each story in scope, one `search_threads` with
   `THREAD_VIEW_METADATA_ONLY`, newest first. **Never fetch bodies during a
   refresh** - a single thread can return 321,000 characters
4. From the newest thread's last message compute: whose move, last inbound, last
   outbound, idle days
5. Rewrite the story file and re-rank `ledger/_index.md`
6. **Run discovery** per `references/discovery.md` - cluster participants across
   unlabelled threads and propose any story the registry is missing. Alex names
   them; never auto-name. Record new people, orgs and story edges in
   `ledger/graph/`, and propose identity merges rather than applying them
7. **Read the feedback loop** per `references/feedback.md` - query the
   Notion Feedback database for `Status = New` or leftover `Seen`, act on
   what's actionable this run, write back Status + Reply. Never guess at an
   ambiguous note

## Then, if the run includes commitments

Follow `references/commitments.md` - the exact search, and critically the
false-positive check: before reporting any promise as open, verify the
relationship didn't continue past its due date. A resumed relationship means
the tactical promise was probably handled elsewhere; downgrade it to the story
file's notes rather than the live table. Every commitment that does stay open
is **quoted verbatim**, never paraphrased into existence, and logged in
`ledger/log/commitment-runs.md`.

## Report back

Short, ranked, and only what needs him:

- **Your move** - oldest first, with who and how long
- **New since last refresh** - what changed
- **Overdue promises** - the quote, who, how many days
- **Gone cold** - past threshold, needing a nudge or a decision to close
- **Feedback** - what got actioned from the Notion box, and anything left
  `Seen` that needs Alex before it can move
- **Nothing needed** - one line, names only

Do not narrate stories that did not move.

## Then

Commit the ledger. Message names the counts, e.g.
`ledger: refresh, 3 owed, 2 overdue promises, 4 cold`.

Draft-only throughout. `send_message`, `reply` and `forward` exist on the
connector and are not to be used.
