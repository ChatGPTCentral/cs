# AI Central Voices (Interview Pipeline)

- query: none - no Gmail label. Built from Alex's own hand-kept lead
  sheet, imported 2026-08-23
- label-id: none
- kind: project - a live sales/editorial pipeline, not a single
  relationship
- people: about 150 leads, see ledger_people (`stories` includes
  `ai-central-voices`) for the full roster
- status: open - active pipeline, real statuses now imported (see below)
- start: 2026-06-01
- end: (ongoing)
- next-action: chase the "Accepted"/"Sent" leads gone cold longest -
  Tim Peters (Guideline AI) has had no touch since 2026-07-07, over
  seven weeks - see his own record
- commitments: none recorded on this story specifically
- threads: none - this pipeline lives in email plus a personal
  spreadsheet and Notion, not a single Gmail thread
- notes: Per Alex, month-by-month review, 2026-08-23. Alex and Elizabeth
  attended four events as press in May-June 2026 - SXSW London, London
  Tech Week, The AI Summit London, Cannes 2026 - meeting a large number of
  people. "AI Central Voices" is the resulting interview section, built to
  justify that press attendance and to give the sales team a reason to
  reach out: meet someone, offer an interview, publish it well, then sell.

  Alex's own framing of the three lead archetypes:
  - **Potential clients** - met at a smaller company, real negotiating
    leverage; the interview leads into an upgrade pitch
  - **Big clients** - met at a large, well-known company; the value is
    associating AI Central's name with theirs, relationship-building with
    important industry people, and thought leadership, not a direct sale
  - **Multipliers** - friends and well-placed introducers who owe or give
    favors, not sales targets. This is where Cozora, Richard Lowe, and the
    Substack circle sit

  The imported CSV records each lead's event, date, stage (FUTURE, READY,
  SENT, SCHEDULED, SHORTLIST, SKIP), Apollo-enriched company/title
  detail, a pitch angle, and Alex's own candid field note - kept verbatim
  in each person's `background`, not rewritten. A handful of names
  (`Zaria`/Anything, `Yoav`/Guidde, `Summer Delaney`/Collabwork, `Ricky
  Figueroa`/Pixel, `Andy`/Glide, `Hamed`/Otio, `Paul Rony`/Kosmik) came
  through with no email and were not imported as new records - they
  duplicate people already tracked under their own stories elsewhere in
  this ledger.

  **Known risk, flagged by Alex himself before this import ran:** several
  of these leads (Chris/Anythink, Douglas/Lightfern, Henry/Cogna,
  Tarang/Vsourz, and others already surfaced during earlier months of
  this same review) may already exist as `ledger_people` rows from
  earlier passes. `ledger_people.identity` has no unique constraint, so
  this import could not safely check-and-skip at scale - duplicates are
  likely and expected. **Resolved, 2026-08-27** - a full identity-based
  audit found 30 duplicate pairs across the whole ledger (not just this
  story), all merged.

  **Interview database sweep, 2026-08-27.** Found the real source of
  truth this story had been missing: a structured Notion database
  ("Interview database", under AI Central Voices Interviews) with an
  actual status per lead - To Email, Sent, Accepted, Received,
  Paginating, Ready, Notified, Published, Pass, Expired - plus sent/last-
  touched dates and doc/Beehiiv links. The FUTURE/SENT/SHORTLIST/SKIP
  labels this ledger had been carrying came from call-note guesses, not
  this tracker. Every matched person's `background` now carries the real
  status as of this sweep; 13 people with a real, progressed status (not
  bare "To Email" prospects) but no existing record were added. Pure
  "To Email" prospects (Recraft AI, Andy/Glide Apps, Dom/Luma AI,
  Relay.app, Arnauld Belinga/Breakcold, Hamed/Otio.ai, Taplio,
  Zaria/Anything, Canva, Summer Delaney/CollabWorks, Fiona Turko/Gamma,
  Replit) were left out - nothing has actually happened on them yet.

  The single most overdue item: **Tim Peters (Guideline AI)** - Alex
  originally pitched Vince Mifsud, who handed it to CMO Tim Peters;
  accepted 2 Jul, last touched 7 Jul, silent since. See his own person
  record.
