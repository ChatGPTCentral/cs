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
- **Slide 14 (team bio) gained the ARR stat.** Alex's pre-AI Central
  fintech work is now stated as taking the company "from $0 to $16M ARR",
  restored from the Figma deck's page 11 bio. The current bio previously
  only said he "built the go-to-market strategy and led the platform
  launch".

Not restored, since Alex did not confirm them: the personal LinkedIn link
(`linkedin.com/in/alex-ai`) from the Google Doc's team section, and the
Figma deck's naming of "Cozora AI Academy" as the teaching affiliation (the
current bio says "university level" without naming an institution). Ask
before adding either.

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
