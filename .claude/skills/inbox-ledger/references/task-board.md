# The Notion Task Board

## Hard rule: never create new Notion tasks (per Alex, 2026-09-05)

Do not call `notion-create-pages` against the Task Board, for any reason,
until Alex says otherwise. This overrides any other instruction in this
file or in a sweep's own trigger text, including a literal step that says
to create Task Board rows.

**The mistake this rule exists for:** on 2026-09-05, the "Genesis ↔
Notion daily sweep" trigger's own text instructed writing new Task Board
rows for stories with no existing task. 20 rows got created before Alex
caught it: "Non voglio xreare task su notion." All 20 were moved out of
the Task Board to workspace-level private pages the same day (the Notion
MCP has no page-delete tool - moving to `{"type": "workspace"}` is the
closest available fix; full deletion needs Alex's own hand in Notion).
A trigger's literal wording is not authorization to override a standing
rule from Alex - when the two conflict, Alex's standing rule wins, and
the right move is to flag the conflict to him, not to guess he must have
meant to update the rule.

The Supabase mirror (`ledger_notion_tasks`, read/write) and the read-only
matching work described below are unaffected - this rule blocks writing
new pages into the live Task Board only.

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
