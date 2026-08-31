---
name: bdr-research
description: Researches one cold-outreach prospect before drafting anything - qualifies whether they're actually cold, pulls real facts about the company, picks the selling angle, then drafts a personalized email in Alex's voice. Use whenever Alex asks to research a prospect, qualify a lead, "build a BDR profile", or run the research agent on a company or a batch of companies. Never draft cold outreach from a name-and-email list without running this first.
---

# BDR research agent

Born 2026-08-31. Alex rejected a batch of 27 cold-outreach drafts - one
template, a name and a one-line product description swapped in, no research,
no signature, a broken redirect-link bug (see `alex-writing-style`'s
CRITICAL FORMATTING RULES, item 8). His instruction: never draft cold
outreach again without real, per-company research behind it - hyper
personalized, hyper focused, hyper specific to the target, and matched to
the right selling angle.

This skill is that research pass. It always runs before
`alex-writing-style` writes a word of a cold email.

## Hard rules

- **Research before drafting, every time.** No exceptions for volume or time
  pressure - see "Small batches" below instead
- **Never invent a fact about a company.** Everything in the research brief
  traces to a search result, a fetched page, or Gmail history. If you can't
  find something, say "not found," don't guess
- **One prospect at a time, small batches.** Landing a wall of drafts in
  Alex's inbox in one pass was itself part of his complaint, independent of
  quality. Default to researching and drafting 3-5 prospects per run, report
  back, then continue only if asked
- **Qualify before researching.** A name on a list may already be a warm
  contact or inbound lead, not a cold target - check first (Step 1). Don't
  burn a research pass on someone who isn't cold
- **Every draft that comes out of this still owes `alex-writing-style` its
  formatting rules** - real signature, clean link text, "- -" not em dash,
  short paragraphs, "Cheers, A"

## Step 1 - Qualify: is this actually cold?

Before spending any research effort:

1. `grep -ril` the contact's name/email/domain across
   `.claude/skills/inbox-ledger/ledger/stories/`
2. `mcp__Gmail__search_threads` on the contact's email and domain
   (`from:X OR to:X`)
3. If either turns up prior contact, this isn't a cold prospect - stop, flag
   it to Alex with what was found, and route to the existing story instead
   of drafting fresh outreach. This is exactly the failure Alex flagged in
   the rejected batch ("they feel like maybe the company's own team was
   reaching out to us")
4. If genuinely no prior contact, continue to Step 2

## Step 2 - Research

For the company:

- `WebSearch` the company name: what they do, recent launches or feature
  announcements, funding or news in the last few months
- `WebFetch` their homepage or blog for positioning language *in their own
  words* - don't paraphrase from memory, quote or closely paraphrase what
  they actually say about themselves
- Check ICP fit against `alex-writing-style`'s IDEAL CUSTOMER PROFILE
  (good/medium/bad fit, and why)
- **Newsletter sponsorship history - currently blocked.** This is meant to
  run through the Appeared.in MCP (tracks where a company has sponsored
  newsletters/creators before), which is not connected yet - Alex needs to
  authorize it via claude.ai connector settings (this session cannot do
  OAuth). Until then, skip this check explicitly and say so in the
  research brief - do not guess at sponsorship history or silently drop
  the question

## Step 3 - Pick the angle

- Classify the prospect against `alex-writing-style`'s COHORT PLAYBOOK
  archetype: **potential client** (smaller/startup, real leverage - lead
  with a free interview offer), **big client** (name-recognition play, no
  hard sell), or **multiplier** (not a sales target at all - stop here if
  so)
- Match the angle to what they're doing, per SELLING ANGLES in the same
  skill (launching something → multi-touch wave; running sponsorships
  already → better rate/bigger bundle; early-stage → borrowed credibility;
  etc.)
- If pitching a content package, cite one real, relevant case study from
  `alex-writing-style/references/07_case_studies_and_pipeline.md` - not a
  generic "we've worked with ElevenLabs, Gamma..." line unless it's
  actually the closest comparable

## Step 4 - Draft

Invoke `alex-writing-style` and follow it fully. The first two lines must
contain one specific, researched detail about the company - not a
one-sentence swapped-in product description. Leave the result as a Gmail
draft (`create_draft`, `replyToMessageId` if it's continuing a real
thread from Step 1's check - never `update_draft` with a plain-text body
only, that has broken threading before). Never send.

## Step 5 - Log

Append one line per prospect to `log/research-runs.md`: date, company,
angle chosen, ICP fit, draft id, and what research was skipped (the
Appeared.in gap, mainly, until it's connected).

## Output format

For a single prospect, report back in this order: the research brief
(bulleted facts, each traceable to a source), the angle chosen and why,
then the full drafted email. For a batch, the same per prospect, grouped,
plus a one-line summary at the end.

## Open item

Appeared.in MCP connection - see Step 2. Ask Alex to authorize it in
claude.ai connector settings; nothing to do on this side until then.
