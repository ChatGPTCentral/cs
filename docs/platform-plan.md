# From inbox ledger to sales mission control - a plan, not a build

Status: **proposal**. Nothing here is implemented. Written in response to
Alex's ask to (1) add live feedback, (2) integrate Breakcold + Appeared.in for
sponsor discovery, (3) turn this into a password-protected Vercel app that
doubles as a sales mission control and task board, and (4) link every story
back to its Gmail thread.

(4) is done - every story on the board now links straight to its Gmail thread
(exact thread ID where known, a Gmail search link where a story spans several
threads without one canonical ID). (1) has a working answer that needed no
build - see below. (2) and (3) are what this doc is for: they are a real
architecture change, not an incremental feature, so per the pattern already
set with `breakcold-plan.md` - plan first, build second.

## 1. Live feedback - already solved, no build needed

Claude Artifacts carry a native comment system. Select text or use the
comment control on the published page, leave a note, activate Claude on that
thread - it lands in this conversation the next time it's checked. This is
live on the ledger page today (see "Reporting a bug or a change" at the
bottom of the artifact).

Two things worth knowing:
- **It is not push-notified to this session.** Comments are read when asked,
  or on a schedule if Alex wants a recurring check (a Routine that fires
  every few hours and reads `action: comments`, reacts, and re-arms). Say the
  word and that gets set up
- A free-text box built into the page itself (not the comment system) would
  need a persistence capability - possible, but redundant with what already
  exists. Not recommended unless the comment system proves too slow or too
  buried

## 2. Breakcold + Appeared.in for sponsor discovery

`breakcold-plan.md` already covers the Breakcold side in detail - read/write
boundaries, matching rules, safety rules. That plan was written for
relationship enrichment (deal stage, value, owner) layered onto the existing
correspondence stories. Sponsor *discovery* is a different verb - finding new
prospects, not just enriching known ones - and needs its own answer:

- **Breakcold's role, if it has prospecting tools**: unknown until connected.
  The account is not authorized yet (`Breakcold` sits in the
  authentication-required list this session). Once authorized, the first
  step is the same as `breakcold-plan.md` phase 1: inspect
  `capabilities_list`, `crm_objects_list`, before assuming what's possible
- **Appeared.in's role**: also unauthorized, and its actual tool surface is
  unknown to me beyond the name. It reads as a meeting/call tool from its
  name, which would make it a *qualification* step (a call once a sponsor
  prospect is identified), not a discovery step - but that's a guess, not a
  finding. Needs the same inspect-first treatment once connected
- **What "finding sponsors" likely means concretely**: AI Central already has
  clear sponsor-shaped activity in the ledger - `sunny-deals.md` (49 threads,
  Sam pitching many counterparties), `ad-astra-media.md` and `wellput-adops.md`
  (ad networks), the M&A-adjacent partnership threads. A sponsor-discovery
  tool most plausibly means: surface prospects from Breakcold that match a
  profile, track outreach status, and feed results back as tasks - which
  loops back into the task-board question in section 3 rather than being
  separate from it

**Authorization is the actual blocker, not planning.** Alex needs to
authorize both connectors (claude.ai connector settings, or `/mcp` in an
interactive session) before either can be inspected, let alone built against.

## 3. Sales mission control + task board on Vercel, password-protected

This is the big one. It changes what this project *is* - from a draft-review
skill plus a read-only snapshot artifact, to a live application Alex works in
directly. Worth being explicit about what that actually changes underneath:

**Today**: git-tracked markdown is the source of truth. A skill (Claude Code,
run by Alex or on a schedule) reads Gmail, writes markdown, and republishes a
static HTML snapshot as a Claude Artifact. Nothing persists outside git +
that snapshot. There is no login, because there is nothing to log into - the
artifact is already private by default.

**What "task board wired to Vercel, password-protected" implies**:
- a real backend with a database, not just markdown files - a task board
  needs to record done/not-done, ordering, edits, in something queryable,
  not regenerated from scratch each refresh
- a deployed Next.js (or similar) app, not a static snapshot - Vercel serves
  applications, and "wired to Breakcold/Appeared.in" means live API calls
  from that app, which a static artifact cannot do
- authentication - Vercel's built-in password protection (available on
  paid plans, gates the whole deployment before any page loads) is the
  simplest option and matches "only I can access." A custom login adds
  complexity for no benefit here given it's a single user
- a decision on **what stays where**: does the git-tracked ledger remain the
  source of truth for correspondence *stories* (whose move, what's promised -
  the thing this skill is genuinely good at deriving from Gmail), while the
  new app owns *tasks and sales pipeline* and reads the ledger data via a
  sync step? Or does everything move into the new app's database, and the
  markdown/artifact become a legacy view? The first keeps the two things this
  system does well (correspondence intelligence vs. task tracking)
  separated with a clear boundary, similar to the Breakcold division of
  labour already designed. The second is a bigger rewrite for a cleaner end
  state. **This is Alex's call, not mine** - it changes how much gets rebuilt
  vs. reused

## Recommended sequence, if this goes ahead

1. **Authorize Breakcold and Appeared.in** (Alex, outside this session) -
   nothing in section 2 can move without this regardless of what else happens
2. **Decide the data-ownership question above** - source-of-truth split vs.
   full migration
3. **Stand up the Vercel app read-only first**: same information the
   artifact shows today, served from a real deployment with password
   protection, reading the existing git-tracked markdown (via a build-time
   sync, not a live git dependency at runtime). Proves the deployment and
   auth work before anything writes
4. **Add the task board** as a genuinely new surface (todos, ordering,
   done-state) - this is the part with no Gmail equivalent, so it is where a
   real database earns its keep
5. **Wire Breakcold in**, following `breakcold-plan.md`'s read-first
   phasing, once inspected
6. **Wire Appeared.in in**, once inspected and its actual role is known

## Open questions for Alex

- Confirm the sequence above, or reorder it - is the task board or the
  Breakcold/Appeared.in wiring more urgent to have working first?
- Source of truth: split (ledger owns correspondence, new app owns
  tasks/pipeline) or full migration into the new app's database?
- Vercel account/project: use an existing project, or should I create a new
  one? (The Vercel MCP tools are already connected in this session, so this
  part isn't blocked the way Breakcold/Appeared.in are)
- Password protection: Vercel's built-in gate, or a specific login flow?
