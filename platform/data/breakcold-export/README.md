Breakcold export before cancellation
=====================================

Alex wants to cancel his Breakcold CRM subscription. This folder is a
last-chance export of everything in that account that the earlier person and
company export (already in Supabase, `ledger_people` and `ledger_companies`,
project `hvzmgpdfznjdxnruiqmy`) did not cover.

Exported on 2026-09-04, from workspace `px74ht6p6pjcc759aa7x4drap1873n45`
("AI Central") via the Breakcold MCP tools.

## What is in each file

- `deals.json` - every deal record. Count: **0**. The Deal CRM object
  type exists in the workspace, but no deal record has ever been created in
  it. This is confirmed, not a guess or a fetch error.
- `notes.json` - every note on every person, company, and deal record.
  Count: **0**. Checked `notes_count` on all 323 person records and all 400
  company records (0 deals, so nothing to check there) - every one reads 0.
  Confirmed directly with the notes tool on a sample too. Alex has not
  written a manual CRM note anywhere in this account.
- `meetings.json` - every recorded meeting in the workspace. Count: **3**.
  None have a transcript. All 3 are Google Meet calls where the recording
  bot's plan was "do not record", which is why no transcript exists.
- `tasks.json` - every task (open and done) linked to a person or company
  record. Count: **108** (91 open, 17 done). See "How tasks were pulled"
  below for method, and "Data quality issue found" for one thing worth
  knowing about.
- `conversations.json` - inbox conversations Breakcold has explicitly linked
  to a CRM person or company record, with full message lists. Count: **9**
  conversations, spanning 2026-08-19 to 2026-09-04. This is a **partial**
  export, not the full inbox. See "About the inbox / conversations" below -
  this is the one category where real judgment calls were made and Alex
  should read that section.

## How tasks were pulled

The `tasks_list` tool only lists tasks linked to one CRM record at a time -
there is no workspace-wide task list. To get every task, this export called
`tasks_list` with `includeCompleted: true` on **all 723 CRM records**: all
323 person records and all 400 company records, one call per record, no
sampling. 108 records had at least one task; the rest had zero.

### Data quality issue found (not caused by this export)

4 of the 108 task titles were corrupted in Breakcold itself: instead of a
short task name, the `title` field held one sentence or instruction
repeated thousands of times (one ran to about 55,000 characters). This
looks like a broken automation loop on Breakcold's side, from around
March-April 2026. These 4 titles are truncated in `tasks.json`, each
marked with an `_export_note` field that explains the truncation and gives
a clean one-line summary of what the task actually was. Nothing about the
task itself (record it is linked to, due date, status) was lost - only the
garbage text in the title field was shortened.

## About the inbox / conversations

This category needed a judgment call, per the brief's own instruction
("if it's clearly enormous, sample-check first, then decide and note your
reasoning"). Here is what was checked and why the full inbox was not
exported.

**What the inbox actually is.** Breakcold's inbox mirrors Alex's real Gmail
(`alex@thecentral.ai` and `alex@theaicentral.net`), not a Breakcold-native
message store. A first unfiltered pull of the 100 most recent conversations
showed they span only about 2 days (2026-09-02 to 2026-09-04), and are
almost all automated: beehiiv performance reports, Senja testimonial
notifications, Qonto and Revolut finance emails, newsletter subscriptions,
and so on.

**Why the full inbox was not exported.** At that density (100 conversations
per ~2 days), and with CRM records in this workspace going back to
February 2026, the full conversation history is almost certainly in the
high thousands to tens of thousands. That is squarely "clearly enormous"
per the brief. It is also, importantly, a live duplicate: every one of
these emails already exists in Alex's Gmail, which he keeps regardless of
whether Breakcold is cancelled. Pulling tens of thousands of messages that
already live somewhere else, inside one session, was judged not to be a
good use of the "last chance" export effort - the actual last-chance data
is the CRM-native stuff (deals, notes, tasks, meetings), all of which is
fully covered above.

**What was exported instead.** Breakcold lets you filter conversations to
`hasLinkedRecords: true` - ones it has explicitly tied to a CRM person or
company record, meaning an actual named business relationship rather than
an automated notification. That filtered set was paginated (not sampled)
starting from the most recent conversation, and this export stopped after
9 conversations, reaching back to 2026-08-19 (about 2.5 weeks). Full
message lists (`inbox_messages_list`) were pulled for all 9.

**The gap Alex should know about.** The `hasLinkedRecords: true` filter
kept yielding very few matches per page (1-3 out of every 50-100
conversations scanned), and CRM records go back to February 2026 - about 7
months, versus the 2.5 weeks actually covered. There are almost certainly
more linked conversations further back that this export did not reach.
If Alex wants full coverage of his Breakcold-linked email history, that
needs a follow-up run with more time budget, continuing the same
`hasLinkedRecords: true` pagination from where this export left off.

**One more caveat on message bodies.** `inbox_messages_list` does not
return full message text inline - each message has a short `bodyPreview`
(a truncated HTML snippet, which is what's captured in `conversations.json`)
plus `textHtmlUrl` / `textPlainUrl` links pointing at Breakcold's own file
storage (`api.us.breakcold.com/api/storage/...`). Those storage URLs were
not fetched in this run. If that storage becomes unreachable after
cancellation, only the `bodyPreview` snippets in this export would remain
- but again, every one of these messages also exists in the source Gmail
inbox, so this is very unlikely to be real data loss.

## A note on deals, since Alex flagged it as a judgment call

There is nothing to map here: the Deal object type in this Breakcold
workspace has zero records. A prior agent's caution about not mapping
Breakcold deals into Supabase `ledger_deals` doesn't come up in practice -
there is no Breakcold pipeline data to map, guess at, or lose.

## What could NOT be exported, in one list

- **Most of the inbox history** (see above) - a deliberate scope decision
  given the volume and the Gmail duplication, not a tool failure.
- **`hasLinkedRecords` conversations older than 2026-08-19** - reached the
  time budget for this run before exhausting that filtered list.
- **Full message body text** for the 9 conversations that were exported -
  only preview snippets were captured, not the full HTML/plain text behind
  Breakcold's storage URLs.
- Everything else in this document (deals, notes, meetings, tasks) is a
  complete, exhaustive export, not a sample.

## Files

```
platform/data/breakcold-export/
  README.md          this file
  deals.json         0 records
  notes.json         0 notes
  meetings.json      3 meetings, 0 transcripts
  tasks.json         108 tasks (91 open, 17 done)
  conversations.json 9 linked conversations with full message lists
```
