# The Notion Task Board

Proposed rows from the ledger's "your move" items go into Notion's Task
Board (`collection://29e656dd-7b67-80ef-b981-000b928858a9`). Two rules,
both learned from a real mistake on 2026-08-31.

## Verify the conversation before writing the task

A task's wording must match what actually happened in the thread, not
what was planned or offered. Before writing or updating a task:

1. Read the actual thread (not just the story's summary line) for the
   fact the task claims.
2. If the task implies a deliverable exists ("publish", "send",
   "upload", "post"), confirm the deliverable was actually received -
   an offer or a request is not a delivery.
3. If the counterpart never replied, the task is a follow-up ("sollecitare
   X"), never an action that assumes their side is done.

**The mistake this rule exists for:** the Cannes 2026 story recorded
that Alex offered Alistair Gosling (Wavelength) a free interview
package. The Task Board wrote "Pubblicare l'intervista di Alistair
Gosling" - publish the interview - months later, as if Alistair had
sent one back. He never replied to the offer at all. Alex caught it
reading `/nba`. Corrected to "Sollecitare Alistair Gosling..." - see
`ledger/stories/cannes-2026.md`.

## The notion_url format

A Task Board page's URL must include `/p/`:
`https://app.notion.com/p/{32-char-id}`. A URL built as
`https://app.notion.com/{32-char-id}` (no `/p/`) looks plausible but
404s in Notion - confirmed 2026-08-31 across all 83 existing rows in
`ledger_notion_tasks`, all missing it. Always build the URL this way,
and after writing a batch, spot-check one with the Notion `fetch` tool
before telling Alex the links work.
