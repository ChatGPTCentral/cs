# Background - context Alex supplies directly

Alex asked for a CRM layer on top of the ledger: for each person, he can add
context the mailbox does not carry - where he met them, who introduced them,
what they actually do. His stated reason: this surfaces connections between
stories that do not exist yet in the ledger, and feeds an eventual network
visualization of his whole set of relationships (not built - see "Eventual
goal" below).

## Where entries come from

Two paths, same destination. Alex can tell Claude directly in a chat
session (Claude writes the entry that session), or - the primary path,
added 2026-08-20 after Alex pointed out that chat-only is dictation, not
contribution - **write directly into the Notion database 💬 👤 People**
(`collection://ed9cc14c-ac01-481d-b735-43e3d0ba44c1`,
`https://app.notion.com/p/f0bdabab729344efa13fc0d50098925f`). Alex adds or
edits a row himself, any time, from his phone if he wants, with no need to
be talking to Claude at all. Linked from the platform's `/people` page.

Columns: Name (title), Identity (email/handle), Org, Stories (comma-separated
slugs), Background (free text - this is the actual content), Synced
(New / Synced - tracks what still needs pulling into the ledger).

## Sync procedure, every `/ledger` run

1. Query the People data source for `Synced = "Not synced"`
2. For each row, read `Stories` to find where it goes - see "Where an entry
   goes" below. If `Stories` is empty or names a story that does not exist,
   say so in the run's report rather than guessing where it belongs
3. Write the entry using the format below, into the right file
4. Set `Synced` to `"Synced"` once written
5. Mention what got pulled in in the run's report, same as commitments and
   feedback - Alex should see "added background: X" without opening Notion

## Where an entry goes

- **A person tied to one story** (most cases - `kind: person` in the story
  file): add a `## Background (Alex-provided)` section directly in that
  story's markdown file, `ledger/stories/<slug>.md`
- **A person who spans more than one story** (Richard Lowe: `ai-hackathon-
  bristol` and `interviews`, related to `gta-whitepaper` through the advocacy
  network): add the entry to `ledger/graph/people.md` instead, under its own
  `## Background (Alex-provided)` section - one entry per person, not
  duplicated across every story file they touch

If unsure which a person is, check `graph/relations.md` and the story files'
`people:` fields first. A name that recurs across stories belongs in
`graph/people.md`.

## Format

```md
### <Person name>
- background (Alex, YYYY-MM-DD): <what Alex said, close to his own words>
- confirms / new: does this match something already in the ledger, or is it
  new? State which explicitly - a match is a cross-check, a new fact is new
  ground
```

## Hard rules

- **Record only what Alex actually states.** Never infer, guess, or fill in
  a plausible detail he did not say - the same discipline as commitments and
  feedback. An unexpanded acronym or an unclear reference stays unexpanded;
  say so rather than guessing what it means
- **Keep it separate from mailbox evidence.** A Background entry is Alex's
  memory, not a finding. Do not present it back to him later as though the
  agent discovered it, and do not merge it silently into `notes:` fields that
  otherwise hold mailbox-sourced facts
- **Cross-check against the graph.** When a Background entry touches an org,
  a relation, or an identity already recorded in `graph/orgs.md`,
  `graph/relations.md`, or elsewhere in `graph/people.md`, say whether it
  confirms or contradicts what is already there. A confirmation is worth
  recording too - it raises confidence in a mailbox-only finding

## Eventual goal: a network visualization

Alex's stated long-term aim for this layer is a visual map of his network -
people, orgs, and the edges between them, the same data already structured in
`graph/people.md`, `graph/orgs.md`, and `graph/relations.md`. Background
entries are the raw material: they are what will let a map surface a real
connection between two stories that currently read as unrelated.

Not built. The graph files are the data source once a visualization is
scoped - collect Background entries now, build the view later. Do not
build a visualization without Alex confirming scope and where it should
live (the platform app, a separate tool).
