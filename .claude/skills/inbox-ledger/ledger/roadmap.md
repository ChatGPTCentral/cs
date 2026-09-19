# Roadmap

Alex's own priorities, month by month. Recorded verbatim from what he
gave directly - never inferred or expanded. Update only when he gives new
or changed items; note the date of each update.

**Per Alex, 2026-09-04.**

## September 2026

- Launch of AI Bootcamp - AI 101
- Re-develop all sales collateral (Media Kit + Products + Pricing)
- Re-adjust sales targets and pipeline
- **Targets, per Alex, 2026-09-12 (fixed for the month, revised by
  Alex himself the same day when he edited the brief on `/brief`):**
  Revenue $15,000, AI Library Trials 150. **Expenses $10,000, added
  2026-09-19, per Alex** - same live-panel treatment as the other two,
  no history before this date.
- **Current figures, changed 2026-09-19, per Alex - now pulled
  automatically, not typed by hand.** Supersedes the 2026-09-12 note
  above that the "Current" line was Alex's own to fill in. Displayed
  as bare "current / benchmark", no parenthetical notes - per Alex,
  same day.
  - **Revenue and Expenses** - `bank_transactions`, current month,
    `side = 'in'` / `'out'` respectively, excluding `is_transfer` rows,
    Supabase project `hvzmgpdfznjdxnruiqmy`. **Currency, resolved
    2026-09-19 (was flagged unresolved earlier the same day):** the
    targets are stated in $, `bank_transactions` is EUR - both figures
    are now converted EUR -> USD using that day's `fx_rates.USD` row
    (`effective_rate`, ECB-sourced). Conversion direction was verified
    empirically against real `bank_transactions` rows
    (`amount_eur = amount * fx_rate` for a non-EUR row) rather than
    assumed, so EUR -> USD is `eur / fx_rate`
  - **AI Library Trials** - gross count of `trial_ledger` rows with
    `trial_at` in the current month, Supabase project
    `jcciwvaqbkxwtufvtiog` ("AI Central // Quiz (Prod)", the
    `ai-central-quiz` repo, `claude/great-volta-PaEPx` branch). Gross
    per that project's own standing rule ("trials are counted GROSS,
    everywhere") - not filtered by `trial_refunded`. No currency
    conversion - it is already a plain count
  - **How it's actually wired, 2026-09-19:** `bank_transactions`,
    `fx_rates` and `trial_ledger` all sit behind real row-level
    security - none grant the app's publishable key direct read
    access, on purpose. Rather than weaken that, each figure got one
    SECURITY DEFINER Postgres function that hands back only the one
    aggregate number, already converted where relevant:
    `targets_revenue_mtd()` and `targets_expenses_mtd()` on the ledger
    project, `trials_mtd_count()` on the quiz project (migrations
    `targets_revenue_expenses_usd` / `trials_mtd_rpc`).
    `platform/app/TargetsPanel.jsx` calls all three on every load of
    `/` - this is the one live render, the brief's own text no longer
    repeats these numbers (see the "Morning brief (daily)" trigger
    prompt, updated 2026-09-19)
  - **The €10,000 bug, found and fixed 2026-09-19:** the brief's
    static Revenue text briefly read €11,364.28, exactly €10,000 too
    high. Cause: a €10,000 transfer between AI Central's own accounts
    (`bank_transactions.id = cb442498-6f26-4052-b3e9-c8549e702d98`)
    got correctly reclassified `is_transfer = true` - excluding it
    from revenue - after the figure had already been typed into the
    brief as static text. The live panel above can't go stale the
    same way, since it queries fresh on every load instead of once at
    generation time

## October 2026

- AI Bootcamp - AI 202
- Beta test of the New AI Library with friends and family - testers so
  far, per Alex 2026-09-12: Marwan, Sunny, Luca, Lorenzo, Peppe,
  Rachel, George, and someone from Cozora (name not yet given)
- (TBD) Event with Vasily in London - 26 October

## November 2026

- Launch of the New AI Library Beta
- AI Bootcamp - AI 303
- Black Friday offer
- Cyber Monday offer

## December 2026

- 2026 Wrapped
- (TBD) Participate in The AI Summit (New York), likely **Dec 3-10** -
  **per Alex, 2026-09-12: start planning the US trip now**, not closer
  to the date. Not linked to the Netline/Awais media-partner deal - a
  separate track, per Alex. NY contacts to work: All Tech Is Human, AI
  Collective (see `genai-collective.md`), and Tech New York Advocates
  / "GTA New York" (Alejandro Martinez, Jose Carlos Sanchez - see
  `gta-whitepaper.md`) - plus `prophet-tonileepr.md`/
  `all-tech-is-human.md` already on file. See `ledger_tasks` for the
  planning task itself
- Xmas campaign
- New Year's Eve campaign (aka Start 2027)

## Website / platform (added per Alex, 2026-09-12, no month assigned yet)

- Giddy Up section
- AI Bootcamp section
- Quiz section
- Restyle of `/library` and `/upgrade`

## Accounting (added per Alex, 2026-09-12, no month assigned yet)

- Invoices to Valentina (studio-galdieri)
- Ongoing expense tracking

## January 2027

- Start 2027 campaign

## February 2027

- (TBD) World AI Cannes 2027
- (CONFIRMED) New Media Summit, Austin, TX

## How this connects to open stories

- **New Media Summit, Austin (confirmed, Feb 2027)** - directly relevant
  to [Mindbreeze / Prime Tech PR](stories/mindbreeze-prime-techpr.md) -
  Nicolia Wiles is Austin-based, confirmed in her own words ("I'm in
  Austin, Texas")
- **AI Summit New York (TBD, Dec 2026)** - see
  [Netline](stories/netline.md) (Awais Shahid/Informa, media-partner
  slot, the existing AI Summit press-pass thread) and
  [Prophet](stories/prophet-tonileepr.md) - Mat Zucker (Prophet's CMO) is
  New York-based
- **Media kit re-development (Sep 2026)** - the media kit currently being
  sent to Prophet, Antidote and PartnerStack (7 Sep reminder) is the
  *current* one - flag if the re-developed version lands before then, so
  the right version goes out
