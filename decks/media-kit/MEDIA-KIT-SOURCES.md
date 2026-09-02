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

Narratives and headline results are from the docx and are stated by AI
Central, not audited: Gamma 1,000+ downloads; ElevenLabs "100s of signups";
Guidde 500K+ views; Outskill has no headline number in any source, so the card
describes the work. Replit "200+ signups" and the docs.thecentral.ai link are
from the playbook's outreach email. Ledger context, notes only: Gamma ran 22
paid slots over five months, $11,292 confirmed.

## Not in the kit, on purpose

Financials, valuation, revenue figures, margins, the investor scenarios, the
team size, and anything from the strategic deck's SWOT.
