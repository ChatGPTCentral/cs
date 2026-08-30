# Second brain roadmap

Status: **research only, nothing built yet**. This doc records R&D done on
2026-08-30, comparing this project's data model against personal knowledge
management (PKM) tools, "second brain" methods, and LLM agent memory
architecture. It proposes phases. It does not commit to building any of
them - Alex picks the order.

## Why this research happened

Alex asked for a study of how a "second brain" gets built - Andrej
Karpathy's ideas, Obsidian-style tools, and what other builders are doing -
to see if this project's data model already resembles one, and what to
borrow next.

## The core finding

This project already has the two hardest parts of a second brain, without
having named them that way:

1. **A durable synthesis layer over raw sources.** Each `ledger_stories`
   markdown file is a compounding summary of many raw Gmail threads, not a
   re-read of them from scratch each time. Karpathy's most concrete public
   proposal for LLM memory (an April 2026 gist, "LLM Wiki") describes
   exactly this pattern: immutable raw sources, an LLM-owned wiki layer that
   accumulates over time, and an append-only log of every change. This
   project's `_index.md` plus per-story files plus `log/sweeps.md` is that
   pattern, built independently.
2. **A structured graph underneath free text.** `ledger_people`,
   `ledger_companies`, and `ledger_deals`, linked by `company_id`, are a
   real relational graph - closer to Tana's "supertags" (typed structure on
   top of freeform notes) than to Obsidian's plain-file model.

The gap: no product researched combines a relationship-decay CRM (Dex,
Clay, Affinity) with an AI-native notes graph (Mem, Tana) under one data
model. That combination is close to what this project already is. It is a
real gap, not a proven demand - worth building toward, not assuming.

## Phase 1 - generic backlinks (low risk, additive)

Add one table: `ledger_links` (`from_type`, `from_id`, `to_type`, `to_id`,
`context`). Any story, person, company, or deal can reference any other.
Every entity page gains a "mentioned in" panel, the way Obsidian computes
backlinks from its file cache and Roam shows "linked references."

This needs no change to existing tables. It is the safest place to start.

## Phase 2 - formalize the "lint" operation

Karpathy's wiki pattern names three operations: Ingest, Query, Lint.
Ingest and Query already exist here (`/ledger` refresh, the board views).
Lint does not: a periodic pass that flags stale stories, people with no
company or story link, and past-due `next_action` dates. This turns an
implicit health check into a named, repeatable sweep.

## Phase 3 - explicit relationship decay

Dex and Clay track a cadence per contact (monthly, quarterly) and flag
overdue reach-outs, separate from active deal stages. The board already
ranks by what needs Alex first, for active stories. Phase 3 would extend
that ranking to every person in `ledger_people`, not only people with an
open story - closing the gap between "warm and quiet" and "gone cold and
forgotten."

## Phase 4 - warm-intro paths

Affinity's signature feature: for a target company, show who on the team
already knows someone there, from real interaction data. This project
already has the raw material - `ledger_linkedin_connections`,
`ledger_people`, `ledger_companies` - but only surfaces it as a flat "warm
contact" tag on `/clienti`. Phase 4 would make it a real path: person A
knows person B, person B works at target company C.

## Phase 5 - semantic search over stories

Once Phase 1-2 are in place, story content becomes a natural fit for
embeddings (Supabase pgvector). This would let Alex ask a question across
every story instead of searching by name - the "chat with your notes"
feature every AI-native PKM tool now ships (Mem, Reflect, Capacities).
Lowest priority - only worth it once story volume and staleness make
manual search slow.

## Sources

Full findings from the three research agents (Karpathy's own writing, the
Obsidian/Roam/Logseq/Tana data models, and the personal-CRM/agent-memory
survey) are not reproduced here in full - ask for them again if a citation
is needed before building a phase.
