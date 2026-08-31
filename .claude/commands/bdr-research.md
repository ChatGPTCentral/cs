---
description: Research one or a few cold-outreach prospects, then draft a personalized email for each - never from a template
argument-hint: "[a company name or contact email, or a short list of them]"
allowed-tools: Skill, Read, Edit, Write, Grep, WebSearch, WebFetch, mcp__Gmail__search_threads, mcp__Gmail__get_thread, mcp__Gmail__list_drafts, mcp__Gmail__create_draft
---

Run the BDR research agent on: $ARGUMENTS

If that's empty, ask Alex which prospect(s) to research - never guess a
target list.

## Do this

1. Invoke the `bdr-research` skill and follow it exactly - qualify first,
   research, pick the angle, draft, log
2. Cap this run at 5 prospects even if more were named. Do the first 5,
   report back, and ask before continuing to the rest
3. For each prospect, invoke `alex-writing-style` for the actual draft -
   `bdr-research` covers the research and angle-selection, not the prose

## Report back

Per prospect: the research brief with sources, the angle chosen and why,
then the full email. If a prospect turned out not to be cold (Step 1),
say so and skip the draft.

## Then

Append the run to `.claude/skills/bdr-research/log/research-runs.md` and
commit it.
