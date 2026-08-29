# The auto-genesis sweep

A daily run that reads Gmail, Google Calendar and the Notion call
transcripts, and folds what happened into the genesis ledger. The goal
is a ledger that stays current as life happens, without a manual sweep.

The run is dangerous if it is careless. An auto-updating ledger and a
slowly corrupting one differ by one thing only: the write gate below.
Follow it exactly.

## State

Supabase table `ledger_ingest_state` holds one row per cursor:

- `autogenesis_last_run` - ISO timestamp of the last completed run.
  Read it at the start. Write it at the end, only after a run
  completes. Default lookback when absent: 48 hours

Write cursors with the service session (Supabase MCP), not the app key.

## Sources and queries

1. **Gmail** - `search_threads` with `newer_than` sized to the cursor,
   metadata first, bodies only for threads that pass the filters.
   Exclude the bulk feeds and non-stories listed in
   `references/stories.md` under *Out of scope*: beehiiv, GrowthLetter,
   Newsletter da Leggere, receipts, Sparkloop reports, Senja, TRAVEL
   bookings. Exclude the three support folders - they belong to
   `aic-customer-support`
2. **Google Calendar** - `list_events` from the cursor to 3 days ahead.
   Past events with tracked attendees become candidate facts. Future
   events with tracked attendees go in the digest as reminders, never
   into a story
3. **Notion transcripts** - search for call/meeting pages created since
   the cursor. A transcript is a strong source for facts, with one
   standing rule: Alex's word about his own life outranks a transcript
   (see the retracted "Luca" fact)

## Entity resolution

- Resolve a sender or attendee through, in order: exact email match on
  `ledger_people.identity` and `ledger_people_emails`, then exact
  full-name or alias match (`ledger_people.aliases`)
- A bare first name never resolves. A partial match never resolves
- An unresolved counterpart with real correspondence becomes a
  CANDIDATE line in the digest. Never auto-create a person record
- Before any new person record: search the full name across the ledger
  first. This rule exists because of Manuel, Sunny and Alistair

## The write gate

For each candidate fact, load the target story file and judge:

- **ADD** - new, consistent with the story, source attached. Write it
- **UPDATE** - corrects or completes an existing line (a date, a
  status, whose move it is). Update the line, note the source
- **NOOP** - already known, or trivial (a reminder, a receipt, a
  scheduling ping). Skip it
- **CONFLICT** - contradicts the story, or the entity resolution is
  uncertain. Do NOT write the story. Insert a row in
  `ledger_pending_facts` with source, source_ref, the fact, and the
  reason. List it in the digest

Hard rules:

- Every write carries a source reference: Gmail thread id, Calendar
  event id, or Notion page URL. A fact with no source is not written
- Never invent a commitment, a date or an amount. Quote or omit
- Never mark a story done, and never change `next_action` to something
  the source does not literally support
- Update `last-inbound`, `last-outbound` and `status` (whose move)
  freely - they are mechanical facts, not judgment

## What to write where

- Story markdown (`ledger/stories/*.md`) - facts, corrections, the
  mechanical fields. The markdown stays the narrative source of truth
- `ledger_stories` (Supabase) - `next_action` / `next_action_date` only
  when the source states one explicitly
- `ledger_genesis_events` - one dated fact row for a genuinely
  significant event (a deal confirmed, a first meeting, a launch), not
  for every email
- After markdown edits: run `scripts/sync-skill.sh` and
  `platform/scripts/sync-ledger.mjs`, commit, push. The platform
  deploys from git

## The digest

End every run with a short message to Alex, in Italian, " - " for
dashes, ranked:

1. Storie aggiornate (quali, e con che fatto)
2. Conflitti in coda (`ledger_pending_facts`) che aspettano una sua
   parola
3. Candidati persona non risolti
4. Meeting imminenti con persone tracciate
5. Una riga sola se non è cambiato niente

## Boundaries

- Draft-only stays absolute: this run never sends mail
- This run never creates Notion tasks - that is the separate
  genesis-Notion sweep's job (07:00 UTC)
- If a source connector is unavailable at fire time, say so in the
  digest and process the sources that work. Never fake a result
