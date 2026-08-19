---
description: Refresh the inbox ledger and report what Alex owes, promised, and has let go cold
argument-hint: "[optional: a story name to refresh just that one, or 'commitments']"
allowed-tools: Skill, Read, Edit, Write, Bash, mcp__Gmail__search_threads, mcp__Gmail__get_thread, mcp__Gmail__get_message, mcp__Gmail__list_labels, mcp__Gmail__list_drafts
---

Refresh the inbox ledger.

Scope for this run: $ARGUMENTS

Empty means every story in the registry.

## Do this

1. Invoke the `inbox-ledger` skill. Read `references/stories.md` **before**
   touching Gmail - the `label:` syntax fails silently and the rule is not
   guessable
2. Read the current `ledger/_index.md` so you know what changed since last time
3. For each story in scope, one `search_threads` with
   `THREAD_VIEW_METADATA_ONLY`, newest first. **Never fetch bodies during a
   refresh** - a single thread can return 321,000 characters
4. From the newest thread's last message compute: whose move, last inbound, last
   outbound, idle days
5. Rewrite the story file and re-rank `ledger/_index.md`

## Then, if the run includes commitments

Sweep `in:sent` over the window for promise language - "I'll send", "I'll get
back", "let me check", "I'll let you know", "by <day>". Every hit becomes a row
in the commitments table, **quoted verbatim**, with who it was made to and when.
Never paraphrase a promise into existence.

## Report back

Short, ranked, and only what needs him:

- **Your move** - oldest first, with who and how long
- **New since last refresh** - what changed
- **Overdue promises** - the quote, who, how many days
- **Gone cold** - past threshold, needing a nudge or a decision to close
- **Nothing needed** - one line, names only

Do not narrate stories that did not move.

## Then

Commit the ledger. Message names the counts, e.g.
`ledger: refresh, 3 owed, 2 overdue promises, 4 cold`.

Draft-only throughout. `send_message`, `reply` and `forward` exist on the
connector and are not to be used.
