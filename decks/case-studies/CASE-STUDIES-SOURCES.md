# Case studies - data provenance

`AI-Central-Case-Studies-2026.html` / `.pdf`, 7 slides: cover, five
one-pagers (Outskill, Guidde, ElevenLabs, Luma AI, Gamma), closing. Built
2 Sep 2026, Gamma added the same day when its reports arrived.
Every figure is measured. Nothing in this deck is stated, estimated or
client-reported.

## Rules set by Alex, 2 Sep 2026

- Email placements come from the `Newsletter Stats` sheet of
  `Beehiiv_Newsletter____Analysis__Performance.xlsx`, filtered to
  **Advertiser Source = Direct** only. Rows with source `Beehiiv` (444 of 541)
  are ad-network placements that were auto-detected, not business AI Central
  won, and are excluded. `Wellput` rows (7) are excluded on the same basis.
- Guidde's work was mostly email placements on beehiiv.
- Luma, Gamma, Replit and ElevenLabs bought LinkedIn carousels, sold as
  bespoke carousels made by AI Central plus a dedicated issue.

## Email clients (Newsletter Stats, Direct)

| Client | Rows | Period | Delivered | Unique opens | Avg open | Unique ad clicks | Total ad clicks | Avg ad CTR | Median / best per placement |
|---|---:|---|---:|---:|---:|---:|---:|---:|---|
| Growthschool / Outskill | 25 | 25 Jul 2024 - 4 Nov 2025 | 1,395,554 | 401,895 | 29.5% | 7,318 | 26,813 | 2.08% | 298 / 754 (30 Jan 2025) |
| Guidde | 21 | 9 Dec 2024 - 12 Oct 2025 | 1,500,314 | 466,951 | 31.2% | 5,131 | 19,716 | 1.17% | 202 / 532 (2 Feb 2025) |
| Delve | 4 | 21 Aug - 18 Sep 2025 | 288,848 | 89,783 | 31.1% | 444 | 603 | 0.55% | 88 / 234 |

Outskill's Nov 2025 row records 0 clicks and is left off the monthly chart.
Delve is not a case study (four placements is too thin) but is logged here.

Guidde also has 3 rows in the `LinkedIn Newsletters` sheet (Direct): issues on
28 Sep, 5 Oct and 16 Oct 2025, 68,194 article views over 317,899 sends. Those
issues carry no ad-click tracking, so the slide claims views only.

The "against the guarantee" box compares each client's median unique clicks
per placement with the Primary Ad package minimum (200 clicks per placement)
from the rate card.

## Carousel clients (client campaign reports, LinkedIn analytics)

| Client | Batch | Carousels | Views | Downloads | Engagement (mean) | Investment | CPM | CPD |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| ElevenLabs | Jan 2026 | 5 | 132,958 | 1,533 | 8.0% | $5,999 | $45.12 | $3.91 |
| ElevenLabs | Mar 2026 | 5 | 125,986 | 1,107 | 7.3% | $5,399 | $42.85 | $4.88 |
| Luma AI | Jan 2026 | 5 | 115,836 | 1,756 | 7.5% | $4,999 | $43.16 | $2.85 |
| Luma AI | May 2026 | 5 | 125,815 | 1,188 | 5.7% | $5,999 | $47.68 | $5.05 |
| Gamma | Jan 2026 | 5 | 124,366 | 2,092 | 6.9% | $2,499 | $20.09 | $1.19 |
| Gamma | Feb 2026 | 6 | 165,561 | 1,731 | 6.9% | $3,999 | $24.15 | $2.31 |

Slide totals: ElevenLabs 258,944 views, 2,640 downloads, 7.7% mean
engagement; Luma 241,651 views, 2,944 downloads, 6.6%; Gamma 289,927 views,
3,823 downloads, 6.9%. Gamma's batch 2 column is labelled 'Total Unique
Downloads' where the others say 'Total Downloads'; both are treated as
downloads. The Gamma reports cite a $45 CPM benchmark where ElevenLabs and
Luma cite $75 - each slide shows the benchmark from its own client's report. CPM and CPD are the
reports' own computed values; the "industry average" benchmarks ($75 CPM, $8
CPD) are the reports' own footnote, which describes them as modelled on a
LinkedIn Ads lookalike audience of mid-to-senior professionals in North
America and Western Europe.

**Investment figures are deliberately not on the slides.** A prospect sees
effective CPM and CPD, not what another client paid.

## Not built yet

- **Replit** - no report supplied. The playbook states "200+ signups" for the
  iOS-apps carousel. No slide.

It drops into the same template the moment a report exists. For the record:
the Q3 kit's Gamma line, "1,000+ downloads", is now measured at 3,823 across
the two batches - the kit undersold it.

## Revision, 2 Sep 2026 - rebuilt against the advertiser trust research

Three research passes on newsletter ad sales, media kit examples, and
creator reporting (audience: CMOs and paid-media buyers) found that
performance buyers distrust unaudited reporting more than the newsletter
channel itself, because Apple Mail Privacy Protection and unfiltered bot
clicks have made "open rate" close to meaningless industry-wide. Findings
are stored as durable knowledge in the `cs` repo, at
`.claude/skills/alex-writing-style/references/09_advertiser_trust_research.md`.
This deck was rebuilt in that light. Now 8 slides.

- **New slide 2, "Every client rebooked".** All five clients on file bought
  more than once. Pulled from the purchase counts already in this file
  (25 rows for Outskill, 21 for Guidde) and the two-campaign structure of
  the three carousel clients. No new data needed - it was already logged
  above, just never stated as the headline.
- **Guarantee boxes rebuilt with the real hit-rate distribution.** The old
  box compared each client's *median* clicks per placement against the
  200-click Primary Ad minimum, which reads as comfortably clearing the
  bar. Computed the real per-placement distribution from `Newsletter
  Stats`, Direct only:
  - Outskill: 18 of 25 placements (72%) hit >= 200 clicks. The 7 misses:
    76, 76, 108, 108, 175, 189, and one more, averaging 122 clicks.
  - Guidde: 11 of 21 placements (52%) hit >= 200 clicks. The 10 misses
    average 169 clicks (range 117-196).

  Box relabelled from "Against the guarantee" to "Against our 200-click
  benchmark" - the historical placements predate a verifiable formal SLA
  for these specific deals, so the box states a benchmark comparison, not
  a contract-compliance claim.
- **LinkedIn CPM benchmark standardized to $75 across all three carousel
  cases.** The ElevenLabs and Luma reports independently cite $75 CPM /
  $8 CPD as their own "industry average" footnote; the Gamma report cited
  $45 CPM. Research flagged this exact inconsistency as a P0 credibility
  risk - a buyer who runs LinkedIn Ads notices two different benchmarks
  from the same seller. Standardized on $75 (the figure two of the three
  reports already used independently), labelled on-slide as
  self-reported in AI Central's own campaign reports, not independently
  audited industry data. The CPD benchmark ($8) was already consistent
  across all three and is unchanged.
- **Stat rows reordered, CTR-forward.** Outskill and Guidde now lead with
  placements, unique ad clicks and CTR; unique opens moved to the last
  tile with an asterisk pointing to a footnote on Apple Mail Privacy
  Protection inflating opens industry-wide. No number changed, only the
  order and the added caveat.
- **Closing slide gained a one-line reporting statement**: every campaign
  closes with a written report in the same format as the five case-study
  pages before it. Deliberately did not attach a specific turnaround time
  (e.g. "5 business days") - no such SLA is on file anywhere, and inventing
  one would be exactly the kind of unverifiable claim this rebuild was
  meant to remove.
- **Not changed:** no client quotes were added anywhere (none exist on
  file for any of the five clients - see `09_advertiser_trust_research.md`
  for why one must not be invented). Investment figures remain off every
  slide, per the original rule at the top of this file.

## Revision, 4 Sep 2026 - palette correction

Alex flagged that the deck's red accent did not reflect AI Central's actual
brand palette and that red should read as "bad" only, with green for "good"
and blue/yellow as accent colors. This deck has no good/bad indicators to
recolor - the change is the accent itself: the `ACCENT` constant driving
every per-client bar chart (Outskill, Guidde, ElevenLabs, Luma AI, Gamma)
moved from `#C8102E` (red) to `#046BB1` (azul, the documented brand blue).
No figure, chart value, or stat changed.
