# Media kit - data provenance

Advertiser-facing deck, `AI-Central-Media-Kit-Q3-2026.html` / `.pdf`, 13 slides.
Built 2 Sep 2026. Every figure on every slide traces to a source below. Where
the three inputs disagree, the rule is: live API data beats the Q3 docx, the
Q3 docx beats the Q2 playbook, and a measured sample beats a stated claim.

## Inputs

| Input | Date | Used for |
|---|---|---|
| `Official_Media_Kit_Q3_2026__AI_Central.docx` | 18 Aug 2026 | structure, campaign types, format descriptions, LinkedIn metrics (Favikon), case-study narratives, team bio, images |
| `AI_Central__Sales_Playbook_v3.md` (Q2 2026) + `cs/.claude/skills/alex-writing-style/references/02_products_pricing.md` | Q2 2026 | rate card, package minimum results, CPM/CPC caps, discount policy, guaranteed-results policy, upsell path. The two agree line for line |
| beehiiv API `get_publication_stats`, last 4 weeks | 2 Sep 2026 | email newsletter subscribers, open rate, click rate, new subscribers |
| Quiz (Prod) Supabase, `submissions` | 27-28 Aug 2026 | seniority, industry and geography charts (shared with the strategic deck, see `DATA-SOURCES.md`) |
| beehiiv ad performance export | Jan 2024 - Jul 2026 | "100+ advertisers" (104 distinct) |
| Buffer + beehiiv + LinkedIn impressions (strategic deck, v3) | Aug 2026 | 613K accounts reached a month |
| `cs` ledger story `gamma-sponsorship` | 27 Aug 2026 | Gamma paid history in the speaker notes |

## Reconciliations - where the sources disagreed

- **Reach.** Docx and playbook say "300K+ combined readers". The strategic deck
  measures 613K accounts reached a month. Both are true with different
  definitions: 300K+ is subscribers across the three publications (181K LinkedIn
  newsletter + 97.7K email + 44K Substack); 613K is monthly reached accounts.
  The kit shows both, labelled.
- **Seniority.** Docx, playbook and brand skill all say "40% Founders, C-level
  and Execs". The quiz sample (N=1,985) gives 13.9% founder + C-suite, 29.6%
  VP and above, 50.5% manager and above. The 40% claim is not supported and is
  NOT in the kit. The kit says "50% manager and above · 30% VP, director,
  founder or C-suite".
- **Age.** Docx says 36-55; the strategic deck and brand skill say 35-55. Kit
  uses 35-55.
- **Geography.** Docx says NA 60 / Europe 25 / RoW 15. Quiz sample (N=4,714)
  gives NA 50.0 / Europe 12.5 / UK 6.4 / Asia 14.1 / Rest 17.1. Kit uses the
  measured split and the same map as the strategic deck.
- **Top industries.** Docx says "Consulting, SaaS, Education". Quiz sample
  (N=2,278) gives Tech & software 18%, Education 11%, Finance 9%, Consulting &
  agencies 7%, Healthcare 3%. Kit uses the measured chart.
- **Email newsletter.** Docx says 86K+ active subscribers, 30.25% open, 2.48%
  verified unique CTR, 312 average unique ad clicks, average sends 86,000. Live
  API on 2 Sep 2026: 97,681 active subscribers, 29.72% open, 2.34% click,
  +4,906 new subscribers in 4 weeks. The docx's 86K was average sends, not
  active subscribers. Kit shows 97K+, 30%, 2.3%, +4,900/month; the 312 unique
  ad clicks figure is kept from the docx (no live equivalent pulled).
- **LinkedIn newsletter and page.** 181K+ subscribers (+5,500/month), 2.7%
  unique CTR, 300 average unique ad clicks; 289K followers (+8,300/month),
  4,500+ impressions per post. Source: Favikon via the docx, 18 Aug 2026. Not
  independently verifiable from this session; labelled with the source on the
  slide.
- **Advertiser count.** Docx says 75+. The beehiiv ad export has 104 distinct
  advertisers, plus direct clients billed in the invoice book. Kit says 100+.
- **Founded.** Docx says 2024 (the S.R.L. registration year). The brand started
  in 2023 (LinkedIn page May 2023, beehiiv Nov 2023). Kit says "since 2023".
- **Acquisition claim.** Docx: "majority of readers acquired organically via
  LinkedIn" and "organic subscribers click ads 3x more than paid". In the last
  4 weeks beehiiv's top acquisition sources were Netline (1,741) and Refind
  paid (1,260), so "majority organic" is not true of the email list right now.
  Kit says LinkedIn is the main source of decision makers and that most of
  THAT audience is organic. The 3x claim is not on the slide.

## Rate card (as shown)

From `02_products_pricing.md`, identical to the Q2 playbook. Alex noted on
2 Sep 2026 that "some stuff has changed since then" - prices are shown as
the reference has them and need his confirmation before the kit goes out.

- LinkedIn Carousel: $699 / 3 for $1,999 / 5 for $2,999; bundles with Main
  Ads $999 / $2,799 / $4,499 with minimum results (20K/60K/100K impressions,
  200/600/1,000 PDF downloads)
- LinkedIn Main Ad: $899 / $1,750 / $2,499 / $3,200 / $3,799 for 1-5, with
  minimum results 20K-100K impressions and 100-500 unique clicks
- Email Primary Ad: $1,299 / $2,499 / $3,699 / $4,599 / $5,499 for 1-5, with
  minimum results 30K-150K impressions and 200-1,000 clicks
- Secondary Ad, Tools Ad, Dedicated Issue, Welcome Sequence, Website Banner:
  no list price in any source - shown as "on request". Clicks-per-issue
  ranges for Primary / Secondary / Tools (200-500 / 30-80 / 20-50) are from
  the docx's own tier graphic.
- Discounts: 10% new clients; 10% off new main ad orders for carousel
  clients. The 5% discretionary discount is deliberately not on the slide.

## Case studies

Superseded 2 Sep 2026 - see the revision section below and
`CASE-STUDIES-SOURCES.md` for the full per-client data. The docx's original
figures (Gamma 1,000+ downloads, ElevenLabs "100s of signups", Guidde 500K+
views, Outskill no headline number, Replit "200+ signups" from the
playbook's outreach email, not a campaign report) undersold every one of
them and are no longer used anywhere in this deck.

## Not in the kit, on purpose

Financials, valuation, revenue figures, margins, the investor scenarios, the
team size, and anything from the strategic deck's SWOT.

## Revision, 2 Sep 2026 (later same day) - restored from the Q2 2026 Figma pitch deck

Alex shared an older Google Doc media kit and an 11-page Q2 2026 Figma
pitch deck (`9de27a99-Pitch.pdf`), asking to confirm the rebuild above did
not lose anything. Full audit in
`.claude/skills/alex-writing-style/references/10_legacy_materials_audit.md`
in the `cs` repo. The Google Doc was the same source already behind this
kit - nothing lost. The Figma PDF surfaced three items with no equivalent
in any current deck; Alex confirmed all three as correct and valid on 2 Sep
2026, so they are now slide content, not just a flagged note:

- **New slide 4, "Peace of mind, every campaign".** A solo-creator-vs-AI-
  Central comparison, restored close to verbatim from the Figma deck's
  page 3. Now 14 slides, was 13.
- **Slide 12 ("How it works") expanded from 4 steps to 6.** Added "Check
  in" (a mid-campaign call to review performance) and "Plan the next one"
  (follow-up campaign ideas), both from the Figma deck's page 5 timeline.
  Renamed from "Four steps, and a guarantee" to "Six steps, and a
  guarantee".
- **Slide 14 (team bio) gained the ARR stat, the teaching affiliation, and
  a LinkedIn link.** Alex's pre-AI Central fintech work is now stated as
  taking the company "from $0 to $16M ARR", restored from the Figma deck's
  page 11 bio. "Taught applied AI in finance at university level" is
  replaced with "teaches AI and monetization at Cozora Academy" -
  confirmed by Alex, and matching the canonical bio already in
  `01_brand_positioning.md` and `sales_agent_training_data.json` in the
  sales knowledge pack, not just the Figma deck. The "Let's talk" box
  gained a fifth line, "Connect with Alex", linking
  `linkedin.com/in/alex-ai` from the Google Doc's team section.

All four items Alex confirmed on 2 Sep 2026. Nothing from either legacy
source remains unaddressed.

## Revision, 2 Sep 2026 - rebuilt against the advertiser trust research

Same research pass documented in `CASE-STUDIES-SOURCES.md`: three research
passes on newsletter ad sales, media kit examples, and creator reporting
(audience: CMOs and paid-media buyers), synthesized into
`.claude/skills/alex-writing-style/references/09_advertiser_trust_research.md`
in the `cs` repo. Still 13 slides; content changed, not slide count.

- **Slide 2 (About) gained a Brand Safety and Editorial Standards line.**
  States what is already true of the existing production process (sponsored
  content written and designed in-house, reviewed before publication,
  labelled as a partnership) - no new process invented, no audit or
  verification claim added.
- **Slide 4 (Audience) gained a reach-composition bar.** 181K LinkedIn
  newsletter + 97K email + 44K Substack = 322K, using the same three
  numbers already stated elsewhere in this file (see "Reach" above) as a
  proportional bar instead of only as separate stat tiles.
- **Slide 5 (Publications) gained a one-line methodology note**, stating
  that figures come directly from beehiiv and LinkedIn's own analytics and
  that email open rate is shown for reference only, since Apple Mail
  Privacy Protection pre-fetches images on a large share of opens
  industry-wide. No figure changed.
- **Slide 7 (LinkedIn Carousel) gained a "minimum valid sample" line**
  recommending the 3-carousel package as the smallest test that lets a
  buyer compare angles and formats, alongside the existing discount-framed
  package table. The prices and discount percentages are unchanged - this
  is copy, not a pricing decision, and none of the pricing findings from
  the research (rate-card spread, LinkedIn placement pricing) were
  actioned; see `09_advertiser_trust_research.md`.
- **Slide 12 (Case studies) rebuilt with the measured figures** from
  `CASE-STUDIES-SOURCES.md`: Gamma 3,823 downloads, ElevenLabs 2,640
  downloads, Guidde 5,131 unique ad clicks, Outskill 7,318 unique ad
  clicks, plus a footer line on Luma AI (2,944 downloads) and the fact
  that every client listed rebooked at least once. Replaces the docx's
  original unaudited figures entirely; the Replit reference was dropped
  since no campaign report exists for it.
- **Not changed:** no client quotes were added (none exist for any client
  on file). No persona-style claim (e.g. "33 CEOs from the top 1,000 US
  companies") was added - the audience slide still uses only the measured
  quiz-sample aggregates already in this file. The rate card is untouched
  pending Alex's decision on the pricing findings above.

## Revision, 4 Sep 2026 - palette correction, positioning line

Alex flagged that the deck's red accent did not reflect AI Central's actual
brand palette (`AI_Central___Palette__Sheet1.csv`, shared 4 Sep 2026) and
that he does not want red used as a default/decorative color: red should
read as "bad" only, green as "good", and blue/yellow as the accent colors
for contrast. This revision addresses the accent color; it does not add new
green/red "good/bad" indicators to any stat or benchmark box - none exist
in this deck to begin with, so there was nothing to recolor on that front.

- **`--accent` changed from `#C8102E` ("Signal Red") to `#046BB1`** (azul,
  the documented brand blue from the palette sheet). This recolors every
  kicker, the big stat numbers, table highlight cells, and the footer
  border across all 14 slides - all of it driven by one CSS variable.
- **The reach-composition bar and geography legend (slide 5)** used a
  red-shade gradient (`#C8102E`/`#B8730F`/`#A50D26`/`#D9636F`/`#CE4B59`) for
  what was pure categorical charting, not a good/bad signal. Replaced with a
  blue-family gradient (azul `#046BB1`, verdigris `#38A7AD`, marian blue
  `#3B4C99`), keeping the neutral grey/tint tiers unchanged.
- **The shared audience charts** (`chart-prof.svg`, `chart-ind.svg`,
  `chart-map.svg` in `../strategic/build/`, used by this deck and the
  Enterprise edition) got the same red-to-blue swap - the world map's four
  intensity tiers now run light-to-dark blue instead of light-to-dark red.
- **The About slide subline** now opens with "Imagine Bloomberg
  Businessweek, but for AI - that's the brand we're building," per Alex's
  positioning direction on 4 Sep 2026. Framed as an aspiration ("imagine"),
  not a claim of affiliation or equivalence. See `01_brand_positioning.md`
  for the documented version of this comp.

## Revision, 4 Sep 2026 - review-panel comment batch (30 comments actioned/triaged)

Alex left 30 open comments via the `/review/media-kit` panel. Actioned the
unambiguous ones below; the rest are flagged as blocked or contradictory
rather than guessed - see "Not done" at the end. No dollar figure or metric
was invented anywhere in this pass.

- **Slide 2 (About).** Partners logo image enlarged (`max-height:220px`,
  `width:100%`, `object-fit:contain`) - this is one flattened composite
  image, not sixteen individually addressable logos, so it can be made
  bigger but not re-laid-out into a grid without the individual source
  files. "Brand safety and editorial standards" section removed. Stat
  tile 2 changed from "613K accounts reached" to "7" (channels), with
  "readers in 151 countries and all 50 US states" moved into that tile
  from tile 3; tile 3 is now just "London / Editorial team, led by the
  founder."
- **Slide 3 (Why) and slide 11 (Premium formats) box height.** The shared
  `usecase()` helper in `decks/_shared/deck_shared.py` now sets
  `min-height:600px` with bullets spaced `justify-content:space-evenly` -
  fixes both slides in one place since they use the same helper.
- **Slide 4 (Peace of mind).** Recolored per the red/bad, green/good rule
  from the 4 Sep palette fix: the "solo creator" box is a light red tint
  with X icons in persian red, "AI Central" is a light green tint with
  check icons in asparagus. Both boxes made full-height. The closing
  sentence box ("Our clients renew because...") removed.
- **Slide 5 (Audience).** Removed the 613K stat tile (grid dropped from 4
  to 3 columns - no replacement number invented). Removed the reach-
  composition bar entirely. More space added between the h2 and the stat
  row. World map recolored so North America (the largest segment) is azul,
  the primary/most-saturated blue, with Europe and Asia in supporting
  blues (marian blue, verdigris) - legend updated to match. The "Who they
  are" chart's "Other" bar (`chart-prof.svg`, shared with the Enterprise
  kit) recolored from azul to grey: it was rendering at full bar width
  because it happens to be the largest single bucket (30.2%), which made
  it visually read as a dominant, "everything is maxed out" category
  rather than a catch-all - it's still the longest bar (that's true), but
  now reads as the non-category it is.
- **Slide 6 (Publications).** Reordered and renamed per Alex: beehiiv
  leads as "AI Central Newsletter," the two LinkedIn surfaces renamed
  "AI Central's LinkedIn Company Page" and "AI Central's LinkedIn
  Newsletter." Trailing Substack/measurement paragraph removed. Boxes
  made taller (`min-height:480px`) with a new "Ideal for" line per tile -
  editorial guidance copy, not a data claim, in the same voice as the
  existing format cards.
- **Slide 8 (was "LinkedIn Carousel," now "Bespoke Ebook").** Renamed
  throughout. Standalone ebook-only package rows (1/3/5, with their
  discount-tier framing) removed - only the ebook+Main-Ad bundle rows
  remain. "PDF downloads" dropped from the minimum-results column,
  impressions kept.
- **Slides 9-10 (LinkedIn Main Ad, Email newsletter ads).** Reordered to
  match slide 8's structure (what you receive / placements first, packages
  second, example image last). "Minimum results" renamed "Expected
  results." Click figures dropped from package rows, impressions kept.
  Max CPM/CPC sentences removed. Slide 10's Tools Ad placement eliminated
  (two placements now, not three); slide subline and section heading
  updated to match.
- **Slide 11 (Premium formats).** Wireframe renders removed entirely.
  "Ideal for" moved up under each format's title. Boxes made full-height
  with bullets spaced out.
- **Slide 12 (How it works).** Redrawn as a single left-to-right line of
  six numbered stations connected by one line, echoing the brand's
  "central station" identity concept, per Alex. Title simplified to "How
  it works." Guaranteed results policy box removed. The two discount
  lines (10% new clients, 10% new main-ad orders) removed; the
  "Custom bundles" line isn't a discount, so it stayed, now in its own
  card.
- **Slide 13 (Case studies).** Date ranges removed from each client's
  blurb (kept what ran, how many times, and that they rebooked). Luma AI
  promoted from a footer mention to a full fifth tile, using the same
  sourced figures already in `CASE-STUDIES-SOURCES.md` (2,944 downloads,
  242K views, 2 campaigns) - no Luma logo asset exists, so it uses a type
  wordmark, same as the full case-studies deck does. Grid widened from 4
  to 5 columns.

### Not done - flagged back to Alex rather than guessed

- **Slide 7 (Advertising options).** Comment asks to eliminate "Secondary
  Ad" and then lists "Secondary Ad" as a surviving product two lines
  later - self-contradictory. Left slide 7 untouched pending clarification
  on what the actual format lineup should be, since guessing wrong here
  would misstate priced products.
- **Slide 8 image.** Morgane flagged the ebook-examples image background
  as "weird" - it's a single flattened screenshot (dark rounded-card
  mockup frame), not something layout CSS can fix. Needs either a
  replacement image or more specifics on what to change.
- **Slide 8 bundle naming.** Alex's comment called the bundle partner
  "LinkedIn Dedicated Issue," but the bundle table has always paired the
  ebook with LinkedIn Main Ad - a separately-priced format, distinct from
  the on-request Dedicated Issue on slide 11. Left as Main Ad pending
  confirmation of which product he actually meant.
- **Slide 13 title ("Client testimonials").** Not renamed - this slide
  shows measured results (downloads, ad clicks), not quotes, and no
  testimonial exists on file for any client (a standing rule in
  `CASE-STUDIES-SOURCES.md`). Renaming it "testimonials" would mislabel
  the content.
- **Slide 13 additions (HubSpot, UX Pilot, SciSpace, Replit).** No sourced
  campaign figures exist for any of the four. Replit specifically was
  already evaluated and dropped from the case-studies deck for this exact
  reason - see `CASE-STUDIES-SOURCES.md`. Adding tiles for any of the four
  would mean inventing numbers, which this project does not do.
- **Slide 6 LinkedIn data.** Alex asked to connect LinkedIn to pull live
  figures instead of the Favikon snapshot - noted in the slide's
  data-notes; no LinkedIn integration is available in this session to act
  on it.
- **Slide 5 "Student" category.** Morgane asked whether to rename or
  replace it with the largest sub-segment of "Other" - the quiz-database
  breakdown behind "Other" (30.2%) isn't available at that granularity
  here, so nothing changed pending that data.
- **Slide 14 (Team).** Alex asked to add logos for London Tech Advocates,
  Global Tech Advocates, Cozora, the AI Collective, and four "Official
  Press Delegate at" event logos (SXSW, AI Summit NY, AI Summit London,
  Cannes Lions). No logo assets for any of these exist in the deck's asset
  bundle - needs the actual files from Alex before this can be built.

## Revision, 5 Sep 2026 - partner/press/affiliation logo grids

Alex sent the real logo files as a zip attachment (`Clients : Partners -
Logo.zip`, 15 files) - a plain paste of each image into chat doesn't
survive as a file in this environment, and files in the ~10-40KB range
were too large to retype from a Drive download reliably byte-for-byte, so
zipping them was the fix that actually worked. Added a shared `logo_tile`
/ `logo_grid` helper to `decks/_shared/deck_shared.py` (a `src=None` entry
renders a labelled placeholder tile rather than failing, so a grid's
spacing can be reviewed before every logo is in hand; a `full_bleed`
flag lets a logo that ships on its own solid-colour background, like
Cozora's, fill the tile instead of getting shrunk onto a white card).

- **Slide 2 partners row.** Replaced the single flattened composite image
  with an individual 5x2 logo grid for Alex's specific list (Gamma,
  Notion, ElevenLabs, Replit, Taplio, Typeless, Luma AI, HubSpot, UX
  Pilot, Outskill) - a different, shorter roster than the old composite's
  15 logos. 9 of 10 are real assets (Gamma/ElevenLabs/Outskill reused
  from the existing case-studies badges; Notion/Replit sourced earlier
  from a GitHub icon-mirror repo; Taplio/HubSpot/UX Pilot from Alex's
  zip). Luma AI is a small icon-only mark (design-icon repo), not a full
  wordmark - flagged as the one open item on this slide.
- **Slide 14 additions.** Added the two rows requested above: "Official
  press delegate at" (London Tech Week, Cannes Lions, The AI Summit
  London, SXSW London - all real, from Alex's zip) and "Affiliations"
  (The AI Collective, Global Tech Advocates, London Tech Advocates,
  Cozora - all real, from the same zip). The AI Summit New York has no
  sourced logo anywhere and stays a placeholder tile pending that file.

## Revision, 6 Sep 2026 - comment queue + closing slide + footer format

Worked Alex's open `/review/media-kit` comment queue via `SELECT * FROM
deck_comments WHERE deck_id = 'media-kit' AND status = 'open'`. Deck grew
14 -> 18 slides. Full change list is in the commit message on the `decks`
branch (a829a4c); the two items worth a source note:

- **Slide 13, "Some of our past campaigns."** Alex asked to rebuild this
  as a 4x2 logo grid including HubSpot, Notion and Jobstream. HubSpot and
  Notion reuse the same logo assets already used on slide 2. "Jobstream"
  has no logo asset in the deck's bundle and doesn't match any client
  name in this file or in CASE-STUDIES-SOURCES.md - it renders as a
  placeholder tile pending the logo file and a spelling check (could be a
  misremembered name). This also means the slide no longer shows the
  detailed measured figures (downloads, ad clicks) it used to carry for
  the five sourced clients - those numbers are still real and still
  logged in CASE-STUDIES-SOURCES.md, just not displayed here, since a
  uniform 4x2 logo-square grid was Alex's explicit format request and a
  mixed detailed/logo-only grid would have misrepresented the three
  clients with no comparable figures on file.
- **Footer format.** Page number moved out of the footer label string and
  into its own bottom-right element - a shared-layer change in
  `decks/_shared/deck_shared.py` / `_head.html`, so it applies to every
  deck built from this runtime, not just the media kit. The footer LABEL
  text itself ("MEDIA KIT 2026", quarter dropped) is media-kit-specific
  and was changed only in `mediakit.py`.

## Revision, 7 Sep 2026 - edit-mode ID bug, case-study copy, comment queue round 3

- **Edit-mode data loss, root cause and fix.** Alex reported his uploaded
  logo replacements on slide 14 had vanished. True: edit mode was keying
  each saved edit by the element's position in the slide (`s14i3` etc),
  so any rebuild that added or removed a slide shifted every position
  after it and orphaned every edit saved against the old positions - a
  routine rebuild, not a rare edge case. Fixed at the runtime layer
  (`decks/_shared/_tail.html`): an edit's id is now
  `<slide-label>:<kind>:<hash-of-its-own-built-content>`, which doesn't
  move when slides are added/removed/reordered. Alex's 7 real uploaded
  images were recovered from Supabase under their old positional ids and
  re-saved against the new content-hashed ones.
- **HubSpot and Jobstream case studies, slide 13.** Replaced the
  lorem-ipsum placeholder text with Alex's real, final copy (verbatim,
  fitted to the card's four-field shape): HubSpot - 129 email placements
  across 88 sends, 14,683 clicks, seven months of unbroken weekly
  presence; Jobstream - two bespoke whitepapers plus a dedicated website
  section, 65,453 views, 330 whitepaper downloads, 3.5x the site's
  average dwell time. Notion, Replit, UX Pilot and SciSpace stay
  lorem-ipsum placeholders pending Alex's numbers for those.
- **Browser cache bug.** The deck's iframe `src` on `/review/media-kit`
  was a fixed path that never changes name between rebuilds, so a
  browser that had already loaded the deck once could keep serving its
  own stale cached copy indefinitely, even after a new version was
  correctly deployed and aliased. Fixed in
  `ai-central-forecaster/app/review/[deck]/page.tsx`: the iframe src now
  carries `?v=<deploy-commit-sha>`, so every new deploy is a new URL to
  the browser.
- **Stray Supabase overrides, slide 11.** Two rows in `doc_edits` -
  `premium-formats:t:q9cyp1` and `premium-formats:t:mz7qwp` - were left
  over from the edit-mode ID migration above and were silently
  overriding this slide's real h2 and Website Banner copy with unrelated
  text ("Based in London, operating globally" / "member of") on every
  page load. Not a content bug - `mediakit.py`'s own source text was
  correct throughout. Fixed by deleting the two rows directly in
  Supabase; no rebuild needed for that half. The slide's title was
  separately reworded per Alex's actual clarification ("further premium
  editorial products we can develop") - now "Further premium formats we
  can build for you".
- **Comment-queue round 3.** Slide 3: usecase-card bullet dividers were
  misaligned because `justify-content:center` re-centered each card's
  bullet block against a differently-sized intro (2-line vs 1-line wrap)
  - fixed with a fixed-height intro slot and top-aligned bullets
  (`decks/_shared/deck_shared.py`, `usecase()`). Slide 2: added a 3rd
  partner-logo row (Guidde real, Taplio repeated with its second mark,
  WISPR Flow/SynthFlow AI/Lindy AI as placeholders pending Alex's
  uploads). Slide 6: restructured to exactly 4 equal-height boxes (AI
  Central Newsletter thecentral.ai/LinkedIn, Social Media, Website),
  dropped the per-card "Source:" caption. Slide 7: "Available on" tags
  now stack vertically; channel names renamed to match slide 6. Slide 8:
  the "Examples" list was 4 invented titles - replaced with 4 real,
  linked documents pulled live from the Notion "AI Central Document
  Database" (`Main` set, `Flipbook URL` starting `docs.thecentral.ai` -
  31 rows qualify; picked 4 spanning different clients). Slide 14: press
  logos enlarged again (90 -> 112px), and the "Let's talk" contact block
  now renders real `<a>` anchors (tel/mailto/https) instead of styled
  text.

## Revision, 7 Sep 2026 (later) - dark footer bar, page nav, slide 2/13 follow-ups

- **Footer redesign.** Now a full-bleed dark bar on every slide, light and
  dark alike: deck label bottom-left, a standing "Have a question? Book a
  call" link to cntral.ai/meet centered, page number bottom-right. Shared
  layer (`deck_shared.py`'s `FOOT`/`make_renumber`, `_head.html`'s
  `.foot` rules) - applies to any deck built from this runtime.
- **Page nav.** A prev/current/next breadcrumb across the top of every
  slide - previous slide muted and clickable, current slide as a pill,
  next slide clickable - jumping via `#N` hrefs. New `page_nav()` in
  `deck_shared.py`, opt-in per deck (only `mediakit.py` calls it so far,
  since it needs every slide's label up front, unlike the per-slide
  FOOT/renumber substitution); `_tail.html` gained a `hashchange`
  listener so those links actually call `show()`. Surfaced two bugs
  during wiring: the tag-end scan (`<section[^>]*>`) stopped at the
  first `>`, and several slides' `data-notes` contain a literal `>` as
  an arrow (e.g. "Beehiiv Newsletter > AI Central Newsletter") - fixed
  with a quote-aware scanner. Also, `qa.js`'s overlap check started
  flagging the world map chart on slide 5 as colliding with the new
  full-width footer - a false positive: the map's raw path data extends
  past its own viewBox (e.g. Antarctica, off the US-Europe corridor this
  deck crops to), invisibly clipped by the SVG's own default
  `overflow:hidden` but still measurable via `getBoundingClientRect()`.
  `qa.js` now excludes `svg` descendants from that check.
- **Slide 2 follow-ups.** `logo_tile()`'s placeholder branch (`src=None`)
  now renders a real generated `<img>` (an SVG data URI with the name
  baked in as its own text) instead of plain text, so edit mode's
  click-to-swap-image works on a pending logo tile - Alex wants to
  click WISPR Flow / SynthFlow AI / Lindy AI directly and upload without
  a rebuild. Also reordered the 2nd stat card's text to lead with reach
  ("Reaching readers in 151 countries and all 50 US states, across 7
  channels") rather than the channel count.
- **Slide 13 follow-ups.** Removed the Notion, Replit, UX Pilot and
  SciSpace placeholder cards per Alex - back to the 7 clients with real
  figures or real copy (Gamma, ElevenLabs, Guidde, Outskill, Luma AI,
  HubSpot, Jobstream); resized the remaining cards up now that there's
  more room. Alex asked to "link the logos ... to the cover one" - the
  asset files for Gamma/ElevenLabs/Guidde/Outskill/Luma AI already
  matched slide 2's (fixed in an earlier pass), so read this as also
  wanting them clickable: those 5 logos, plus Jobstream's text-name
  card, now link to slide 2 via the page-nav's hash navigation.
  Flagged back to Alex that Jobstream has no tile on slide 2 at all, so
  its link doesn't land on anything Jobstream-specific there - unsure
  this is what "link" meant, pending his confirmation.
