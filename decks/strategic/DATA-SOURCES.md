# Data provenance

Every number in the deck traces to a source below. Nothing is estimated except
the 2026 forecast, which is labelled as such on the slide and drawn as an
outlined bar so it can never be read as booked revenue.

---

## Chart 1 - Revenue by line (monthly, Jan 2025 to Jul 2026)

Source: **AI Central invoice book** (`Anagrafiche Fatture`), sheets
`Entrate QONTO 2024-5`, `Entrate QONTO 2026`, `Entrate WISE`. Amounts are
`Importo della fattura in EUR (Senza IVA)` - EUR net of the 22% Italian VAT,
i.e. recognised revenue, not gross cash collected.

The consolidated `Entrate (QONTO + WISE)` sheet was **not** used: it stops at
Nov 2025 and its total (EUR 150,484) is lower than the WISE sheet alone, so it
is stale. The three source sheets were re-consolidated from scratch by
`revenue.py`.

### Reconciliation

| | EUR | rows |
|---|---:|---:|
| All rows carrying an amount | 258,644.10 | 2,921 |
| less internal transfer (`Giroconto (da Qonto AI Central)`) | −16,000.00 | 2 |
| less TransferWise cashback | −79.35 | 35 |
| **= revenue since inception** | **242,564.74** | 2,884 |
| of which dated (plotted) | 213,555.63 | 1,899 |
| of which undated | 29,009.12 | 985 |

### By line, since inception

| Line | EUR | share | dated | undated |
|---|---:|---:|---:|---:|
| Sponsorship | 102,796 | 42% | 99,508 | 3,287 |
| Ad network and boosts | 74,772 | 31% | 74,772 | 0 |
| Library | 58,211 | 24% | 32,572 | 25,639 |
| Lead-gen | 3,180 | 1% | 3,180 | 0 |
| Affiliate (CollabWork, Dub.co) | 3,473 | 1% | 3,473 | 0 |
| Other | 133 | - | 50 | 83 |

**Trailing 12 months (Aug 2025 - Jul 2026): EUR 140,290** - sponsorship 44,309 ·
ad network 60,890 · Library 31,909 · lead-gen 3,181.

### Classification rules

Applied to the `Prodotto` field, in this order (see `classify()` in `revenue.py`):

- **excluded** - `Giroconto`, `Cashback`, `Rimborso`
- **Library** - `AI Library`, `Subscription Update`
- **Ad network** - `Network Ads`, `Boosts Payout`, `Refind Ads`
- **Lead-gen** - `Netline`, `TradePub`
- **Sponsorship** - `Predictable Source` / `Jobstream`, `Collaboration`,
  `Quarter Deal`, `Dedicated Issue`, `Sponsorship`, `Sponsored`, `LinkedIn`,
  `Thought-Leadership`, `Partnership`
- **Affiliate** - `CollabWork`, `Affiliate`, `Dub.co`

Both judgement calls confirmed by Alex on 27 Aug 2026: `PREDICTABLE SOURCE, LLC`
(EUR 4,306) is the **Jobstream** co-brand deal and counts as sponsorship, not
lead-gen; `CollabWork` payouts (EUR 3,473) stay held out as affiliate. The
Jobstream payment landed in May 2026, which is why that month shows sponsorship
of EUR 12,973 rather than EUR 8,667.

### Known gap

**No QONTO row in the workbook carries a payment date** - not in the source
sheet, not in the consolidated sheet. Joining `Numero Fattura` to
`(Archiviato) Fatture per bonifi` recovers only 51 dates (EUR 1,457), because
that sheet only holds 91 invoices spanning May-Aug 2024. So EUR 29,009 of
2024-2025 QONTO receipts - mostly Library, EUR 25,639 - cannot be placed on the
timeline and are excluded from the chart but included in the since-inception
total. The chart is labelled accordingly.

Refunds and disputes (EUR 302 net, 13 rows) are tracked on their own sheet and
are **not** netted off the figures above.

---

## Chart 2 - Email subscribers (monthly, Nov 2023 to Aug 2026)

`beehiiv.get_subscriber_history(pub_685dd277-3d37-4105-9320-d248c9e28f76,
all_time)`, pulled 2026-08-27. 34 monthly points, plotted unmodified. Current
active subscribers **97,070**. The Jan 2025 step down (70,238 → 53,316) is a
list clean and is annotated on the chart.

---

## Slide 04 - advertiser metrics

Source: **beehiiv ad performance export**
(`Beehiiv Newsletter - Analysis, Performance, Beehiiv Ads.csv`), 697 placements,
Jan 2024 to Jul 2026, USD gross by send date.

| Metric | Value |
|---|---|
| Total ad earnings | $122,921 |
| Distinct advertisers | 104 |
| Advertisers with more than one placement | 71 = **68%** |
| Share of ad revenue from repeat advertisers | **98.2%** |
| Advertisers with 3+ placements | 57 = 55% |
| Placements per quarter, last 4 quarters | **92** |
| Average earnings per placement | $176 |
| Median advertiser spend | $253 |

Concentration: top advertiser 32% of ad revenue, top 5 = 53%, top 10 = 65%.

**HubSpot is the largest advertiser: $38,932 across 126 placements** - 3.6x the
next. Mindstream ($7,249), which HubSpot owns, also advertises here, as do
Morning Brew ($1,605) and The Hustle Daily ($1,987).

Be precise if challenged: this spend runs through the **beehiiv ad network**, not
a negotiated direct sponsorship. It shows HubSpot repeatedly paying to reach this
audience; it is not a direct commercial relationship.

All 12 partner tiles on slide 04 are backed by real spend - 10 appear in the ad
export (HubSpot, Notion $2,692, Gamma $5,242, Udacity $443, Attio $1,878,
Guidde $2,078, Wispr Flow $1,822, Typeless $940, Delve $253, Taplio $137) and
ElevenLabs (EUR 14,394) and Replit (EUR 4,027) appear in the invoice book as
direct collaborations.

Note the basis differs from the revenue chart: this export is USD gross by send
date, the chart is EUR net of VAT by cash-receipt date. The two are **not**
combined anywhere. Against the invoice book's EUR 74,772 of received ad revenue,
$122,921 gross implies roughly a third going to the platform, which is what you
would expect from beehiiv's ad network.

---

## Cross-checks

beehiiv's own earnings API for the trailing 12 months reports ad network
$61,359 and paid subscriptions $23,681. The invoice book gives EUR 60,890 and
EUR 31,909 for the same lines. The ad-network figures agree closely; the
Library gap is timing and FX - beehiiv reports USD on its own processing dates,
the book records EUR net of VAT on cash-receipt dates.

Deck claims verified against live beehiiv data:

| Slide | Claim | Live value | Status |
|---|---|---|---|
| 01, 03, 11 | 97K active email subscribers | 97,070 | confirmed |
| 03 | 35% open, 2.7% click | 34.62% / 2.74% | confirmed |
| 05 | ~4,150 gross new subs/month, trailing 12m | 49,886 / 12 = 4,157 | confirmed |

Not verifiable from the connected accounts or the invoice book: the 178K
LinkedIn newsletter figure, the 40% C-level share, the 53.5% Library
trial-to-annual conversion, and the count of 12 named sponsor partners (the invoice book
shows 8 distinct *direct* sponsors billed; the other 4 tiles are ad-network
advertisers).

---

## Rebuilding

```
python3 revenue.py     # re-reads the workbook, writes revenue-monthly.json
python3 charts.py      # regenerates both SVGs
python3 build.py       # inlines fonts, icons and charts into the deck
```

Stripe was not used in the end - the invoice book supersedes it. For the record,
Sigma SQL on that key needs the `reporting_write` permission, which it lacks.


---

## Slide 03 - audience composition

Source: **`AI Central // Quiz (Prod)`** Supabase project `jcciwvaqbkxwtufvtiog`,
table `submissions`, queried 2026-08-27. Repo: `ChatGPTCentral/ai-central-quiz`.

Filters applied to every figure: `is_test = false`, `suspected_fake = false`,
`archived_at is null`.

- **5,026** clean submissions, Nov 2023 to Aug 2026
- **1,985** carry an Apollo `seniority` value · **2,120** an industry ·
  **2,015** an age bracket · **1,678** a company size · **4,492** a country

### Seniority (N = 1,985)

| Cut | People | Share |
|---|---:|---:|
| Founder + C-suite | 272 | 13.7% |
| **+ VP/Director (the figure on the slide)** | **588** | **29.6%** |
| Manager and above | 1,002 | 50.5% |
| Unclassified ("Other") | 599 | 30.2% |

**The deck previously claimed "40% founders, C-level and executives". That figure
is not supported by this data at any cut** and has been replaced with the
measured 30%.

### Other measured composition

- Company size: **21.0%** at 10,000+ employees (N = 1,678)
- Geography: US **45.7%**, India **7.7%**, UK **6.0%**, Canada 3.4%,
  Australia 3.0% (N = 4,492). US + Canada = 49.1%
- Industry: IT & Services **15.0%**, Higher Education 5.3%, Agency/Consulting
  4.8%, Financial Services 4.6% (N = 2,120)
- Age: 26-35 **30.0%**, 36-45 22.9%, 46-55 19.1%, 56-65 10.5%, 18-25 10.1%
  (N = 2,015). 36-55 = 42.0%; 26-55 = 72.0%

### Method caveat

The quiz cohort is **self-selected** and enrichment covers roughly 40% of
submissions, which may skew toward people with a findable LinkedIn or company
domain - plausibly more senior and more corporate than the list as a whole. On
Alex's instruction (27 Aug 2026) these shares are applied to the full audience as
a representative sample. The slide states the basis and N so a buyer can weigh it.

Note the deck keeps "35 to 55" as **positioning** on slides 02 and 03 while the
measured modal band is 26-35. That is a target-audience statement, not a data
claim, and no slide asserts 35-55 as a measured share.

Minor data-hygiene issue worth fixing at source: `seniority` holds both
capitalised and lowercase variants (`Founder`/`founder`, `Manager`/`manager`,
`director`, `partner`, `entry`, `senior`) - 21 rows. The cuts above fold them in.

---

## Slide 05 - revenue by year

| Year | EUR | Source |
|---|---:|---|
| 2023 | 3,091 | `Balance Sheet // Entrate` monthly table, Jun-Dec 2023 |
| 2024 | 55,315 | **Statutory accounts** (`bozza bilancio fiscale e civile 2024`) |
| 2025 | 115,745 | Dated invoice book (see above) |
| 2026 F | 97,810 booked / 157,691 annualised | Invoice book + last-6-month run rate |

2024 statutory detail: Totale Ricavi **EUR 55,315.28** (of which services abroad
52,569.31, EU 2,625.26, Italy 53.17), Totale Costi 34,084.00,
**Utile EUR 21,231.28 = a 38% net margin**.

Growth: 2023 to 2024 **x17.9** · 2024 to 2025 **+109%** · 2025 to 2026F **+36%**.

**Two open items.**

1. **Basis is mixed.** 2024 is statutory (accrual, full statutory scope); 2025 and
   2026 are the invoice book (cash receipts, net of VAT). They are close in spirit
   but not the same basis. Supply the 2025 statutory Totale Ricavi and the series
   becomes consistent.
2. **The 2025 statutory PDF could not be read.** `Bilancio Ai Central 2025 Xbrl.pdf`
   has no text layer, no embedded images and no XBRL attachment - 7 extractable
   characters across 7 pages. pypdf, pdfminer and image extraction all fail, and
   OCR is unavailable in this environment (poppler and tesseract cannot install).
   Send the figure directly, or export that bilancio as text or XLSX.

Per Alex's instruction only the **2023** portion of `Balance Sheet // Entrate` is
used; the file's 2024 and later months disagree with the statutory accounts
(the CSV implies about EUR 68.7K for 2024 against the statutory EUR 55.3K).

---

## Social channel counts - still missing

Connected Buffer channels (via WriteStack `list_buffer_channels`): Bluesky
(`ChatGPT Central`), X (`ChatGPT_Central`), Facebook, LinkedIn
(`chat-gpt-central`), Threads (`gptcentral`), Instagram (`gptcentral`).

That endpoint returns channel identity only - **no follower counts**. WriteStack's
`get_notes_statistics` returns per-note Substack engagement, not a subscriber
total. Neither can fill the "to supply" rows on slide 03. Those need either a
Buffer analytics connector, a Substack connector, or the numbers by hand.


---

# UPDATE 27 Aug 2026 - statutory accounts supersede the invoice book

The 2025 statutory accounts (`SITUAZIONE ECONOMICO PATRIMONIALE 31.12.25`) were
supplied and extracted. **They change the headline numbers materially.**

| | 2023 | 2024 | 2025 | 2026 F |
|---|---:|---:|---:|---:|
| Revenue (ricavi delle vendite e prestazioni) | 3,091 | **55,248** | **228,049** | 304,445 |
| Totale ricavi (incl. FX gains, other) | - | 55,315 | 232,922 | - |
| Totale costi | - | 34,084 | 156,111 | - |
| **Utile d'esercizio** | - | **21,231** | **76,811** | - |
| Net margin | - | 38% | **33%** | - |

2025 detail: services abroad 219,526.20 · CEE 8,418.65 · Italy 103.72 ·
altri ricavi 365.63 · utili su cambi 1,859.84 · other 2,647.99.

Growth 2024 to 2025: **+313%**. Since inception through 2025: **EUR 286,388**.

**The invoice book understates badly.** It gave 2025 = EUR 115,745 against a
statutory EUR 228,049 - roughly half. It records only dated cash receipts, and
no QONTO row carries a date, so a large share of 2025 never enters it. Every
headline revenue figure in the deck has been moved onto the statutory basis.

**Consequence for slide 04.** The revenue mix (sponsorship 42%, ad network 31%,
Library 24%, lead-gen and affiliate 3%) is still derived from the invoice book,
which sees about half of statutory revenue. If the missing half is not
distributed like the visible half - plausible, since the QONTO account is where
larger invoices land - **the mix percentages are skewed**. Treat them as
indicative until a line-level split can be reconciled to the statutory total.
The monthly chart on slide 05 is now labelled "shape and mix, not level".

**2026 forecast method.** EUR 304,445 = statutory 2025 (228,049) x 1.335, where
1.335 is the invoice book's like-for-like Jan-Jul growth (97,810 in 2026 vs
73,267 in 2025). The bar is drawn outlined, never solid: no statutory 2026
figure exists. This assumes the book's coverage ratio is stable year on year.

**Revisit the valuation.** EUR 2M against 2025 revenue of EUR 228,049 is 8.8x
revenue (was 14x on the old trailing figure) and 26x 2025 earnings. The market
multiple route still does not reach EUR 2M on the slide-10 comps of 1.65-4x
revenue, which top out near EUR 912K - so dropping it was still right. But the
33% net margin and EUR 76,811 of profit are a materially stronger supporting
argument than anything available before.

---

# Slide 03 - channel figures (supplied by Alex, 27 Aug 2026)

| Channel | Followers |
|---|---:|
| LinkedIn page | 290,000 (181,000 of them subscribe to the newsletter) |
| Email · beehiiv | 97,139 (live) |
| Substack | 44,000 |
| Threads | 3,200 |
| Instagram + X + Facebook | 3,000 |
| **Total following** | **437,339** |

The LinkedIn newsletter's 181,000 is a **subset** of the page's 290,000 and is
counted once. Note this is 181,000, not the 178,000 the deck carried before.

**Owned and transferable: 322,139** = email 97,139 + LinkedIn newsletter 181,000
+ Substack 44,000.

**Monthly reach: 611,139** = email unique sends 97,139 + LinkedIn impressions
283,000 (30d) + Threads impressions 231,000 (30d). Substack, Instagram, X,
Facebook and Bluesky impressions are **not** included, so the true figure is
higher. Email unique sends is taken as active subscribers, since every active
subscriber receives the newsletter; beehiiv exposes no distinct 30-day send count.

**Other socials, from the Buffer MCP** (org `AI Central`,
`get_aggregated_post_metrics`, 30 days to 27 Aug 2026, per channel - the
all-channel aggregate returns only postCount/reactions/comments because
impressions are emitted only when every channel in the filter supports them):

| Channel | Posts | Impressions | Reach |
|---|---:|---:|---:|
| LinkedIn | 82 | 238,200 | **173,456 unique** |
| Threads | 33 | 220,622 (views) | - |
| X | 17 | 1,271 | - |
| Instagram | 16 | 325 (views) | 184 |
| Facebook | 27 | 31 | - |
| Bluesky | 18 | not reported by the API | - |

X + Instagram + Facebook = **1,627**, which is what the slide carries. The three
together are about 0.3% of monthly reach - immaterial, and the slide says so by
grouping them on one line rather than padding the total.

**Buffer sees only what Buffer published.** Its LinkedIn impressions (238,200)
run below the 283,000 from LinkedIn's own analytics, which covers natively
published posts too. The slide uses the higher native figure for LinkedIn and
Threads, and Buffer for the rest.

Impressions double-count viewers. The more rigorous figure is LinkedIn's
**173,456 unique people reached** in 30 days, which the slide shows beneath the
total and the speaker notes explain.

Caution on the two totals: 437,339 counts followers across channels and will
include people who follow on more than one. It is a gross-of-overlap figure, not
437,339 distinct individuals. The slide says "followers", not "people".

---

# UPDATE 27 Aug 2026 (evening) - 12-slide investor structure

## Slide 07 - AI Central University (measured funnel)

Source: `trial_ledger` + `submissions` in the Quiz (Prod) Supabase project -
Stripe charges joined to quiz submissions, queried live.

| Metric | Value |
|---|---:|
| Paid trials since May 2025 (net of refunds) | 879 |
| Trials due (past decision point) | 754 |
| Converted to annual | 449 = **59.5%** |
| Average conversion charge | $45.00 |
| Gross through the funnel tracker | $25,429 |
| Trials in 2026 YTD | 558 (conversions 339) |
| Paying members tracked (LTV > 0) | 1,823 |
| Average LTV per paying member | $47.17 |

The deck previously claimed 53.5% trial-to-annual; the ledger measures
**59.5%** on due trials, so the deck now uses the measured figure.

## Slide 05 - hero year chart

2023 3,091 (ledger) · 2024 55,248 (statutory) · 2025 228,049 (statutory) ·
2026F 304,445 (+33%, invoice-book like-for-like applied to statutory base;
solid inner bar = 97,810 invoiced YTD on the cash book, which understates
statutory progress by roughly half) · 2027F 456,668 (a deliberately
conservative +50%). ARPU = 228,049 / 96,685 year-end email subscribers =
**EUR 2.36 per subscriber per year** (~$0.21/month; Vision 2026 targets $0.60).

## Narrative sources

- **Vision 2026 doc**: pain points, "Bending Spoons for newsletters", the
  affiliate-centric shift ($0.20 to $0.60 ARPU), 2026 target mix
  (30% ads / 30% affiliate / 20% subscriptions / 20% co-regs), platform launch
  Q4 2026, first newsletter M&A. Its "2024 Revenue EUR 60K / Profit EUR 30K"
  and "2025 Est. EUR 240K / EUR 50K" differ from the statutory accounts; the
  deck uses statutory everywhere.
- **Media kit Q2 2026**: geography (NA 44% / Europe 14% / Asia 20% / rest 22%,
  151 countries, all 50 US states, top states CA-NY-TX-FL), organic LinkedIn
  acquisition. Note the media kit's "40% founders/C-level/executives" is NOT
  used - the deck carries the measured 30% (incl. VP/Director) from the quiz.
- **Logo**: extracted from media kit page 1 (2099x500), quantised to a 22KB
  data URI, inlined on the cover.

---

# UPDATE 27 Aug 2026 (v3) - Alex's revision pass

- **Forecast basis changed on instruction**: 2026F = statutory 2025 x 1.5 =
  EUR 342,073; 2027F = 2026F x 1.3 = EUR 444,695. The prior run-rate method
  (+33%) is superseded. EUR 2M = 8.8x / 5.8x / 4.5x of 2025 / 2026F / 2027F.
- **Rounded on instruction**: conversion 59.5% -> 60%; ARPU EUR 2.36 -> $2.4.
- **University slide**: launched May 2025 (first ledger trial 2025-05-25);
  EUR 33K collected since launch = dated Library receipts in the invoice book;
  AOV $45 = average conversion charge; modelled LTV $113 = $45 / 40% churn
  (2.5 expected years). Realised LTV to date is $47 (most members in year one).
- **Client chart**: lifetime billed per client = invoice-book EUR (direct) +
  ads-CSV USD x 0.86 (network). Top 12 shown. Logos: HubSpot / Notion / Replit /
  ElevenLabs / Udacity from the simple-icons library; Guidde / Outskill / Gamma
  extracted from the media kit PDF; monogram chips where no official mark was
  available offline (logo CDNs are blocked by the session's egress policy).
- **Media kit screenshots** on the clients slide: a HubSpot co-branded issue
  (media kit p8) and a Guidde campaign creative (p7).
- **Region map**: world-atlas TopoJSON (npm), regions merged and shaded by the
  media kit split - NA 44% darkest, rest 22%, Asia 20%, Europe 14%.
- **Professions pie**: quiz seniority mix, N=1,985 (unclassified 30%, manager
  21%, contributor 18%, VP/Director 16%, founder+C-suite 14%, student 1%).
- **Who-we-are background curve**: illustrative total-audience growth 0 -> 437K,
  Jun 2023 -> Aug 2026, anchored to the real email series' shape; no axes or
  values, so it cannot be misread as data.
- **Average profit margin 35%** = simple average of 38% (2024) and 33% (2025).

---

# UPDATE 27 Aug 2026 (v5) - final edit pass, deck now 11 slides in USD

- **Currency**: everything now USD at Alex's rate of 0.85 EUR/USD. Key figures:
  2023 $3.6K · 2024 $65K · 2025 $268K (profit $90K) · 2026F $402K · 2027F $523K ·
  all-time revenue **$452K** (statutory 2023-2025 + 2026 invoiced YTD).
- **CONFIDENTIAL** dropped from every footer.
- **Library revenue chart** (University slide): monthly gross charges from the
  production Stripe sync, net of refunds - **$87,719 all-time**, Nov 2023 to
  Aug 2026, current funnel marked at May 2025. About EUR 75K - in line with the
  EUR 78K Alex quotes; the gap is FX and pending charges.
- **Techpresso** added to the education-layer peer list per Alex.
- **M&A table** re-verified by web research (They Got Acquired, beehiiv case
  studies, TechnologyAdvice PR, CB Insights): Morning Brew $75M/3.75x, Hustle
  ~$27M/~2.7x, Milk Road reported eight figures, Peak $5M/1.65x, Mindstream and
  Neuron undisclosed (Neuron confirmed earn-out, 30+ bidders). Both AI-newsletter
  prices remain estimates and the slide says so.
- **Valuation revised to $1.0-1.5M** (from EUR 2M) per Alex. Three converging
  methods: 97K email x $10-15 B2B band = $1.0-1.5M; 1.65-4x revenue on 2025/2026F
  = $0.8-1.6M; 12-15x on $90K 2025 earnings = $1.1-1.4M.
- **New closing slide "What we need"**: client introductions (ICP: AI/SaaS
  companies selling to professionals with live GTM spend - from the Vision GTM
  lead-flow list), networks and multipliers, speaking opportunities, M&A deal
  flow. Replaces "Let's talk".
- SWOT reduced to Alex's own items verbatim.

---

# UPDATE 27 Aug 2026 (v6) - copy pass, chart rework, deeper M&A research

Standing instruction from this point on: all deck copy is written in ASD-STE100
Simplified Technical English - short sentences, one idea each, plain words, for
a 60-year-old British entrepreneur reader. Applied to every slide touched below.

- **S.R.L. removed** from the cover (now "AI Central Media · August 2026") and
  from the "Founded" cell on slide 2, which now shows just "2023" with no body
  text under it, per Alex.
- **Slide 2 (Who we are)**: subtitle rewritten to Alex's exact vision line -
  "build the Bending Spoons of media - but for media brands... a repeatable
  model that monetises professional audiences through content, brand deals and
  affiliate partnerships." "All time revenue" cell drops the "2023 through Aug
  2026" clause; "Avg profit margin" cell drops "Run by a team of 5" (kept for
  context only, not disclosed on the slide: the team is Alex + Elizabeth + 2
  contractors).
- **Slide 3 (Audience breakdown)**: the "N=1,985" figure is removed from the
  chart; the speaker notes now say explicitly that this is a sample estimate
  (1,985 of 5,026 quiz submissions) applied to the full population as
  representative, per Alex's standing instruction. The professions donut is
  replaced with a horizontal bar chart (same underlying sample cuts);
  "Unclassified" is relabelled "Other" for the reader. Section order flipped to
  Pain points -> Who they are -> Where they are. All three pain points rewritten
  to Alex's exact framing (Too much noise / Info is found, then lost /
  No-brainer price). The bottom stat band is replaced with a single line: "Our
  reader: 35 to 55 years old, in the peak earning years. Senior role. Works at
  a big organisation."
- **Slide 4 (Business model)**: retitled "5 + 3 revenue streams". The five
  live lines are rewritten with Alex's exact copy (Direct ad sales, Ad
  networks, Paid subscriptions, Affiliate deals, Treasury management). Three
  new "in development" boxes added (Merchandising & store, 1:Many bootcamps,
  Books & digital products) - these are roadmap items with no revenue behind
  them yet, and the notes say so.
- **Slide 5 (Revenue by year)**: retitled "Half a million by 2027,
  bootstrapped". Stat row simplified to exactly four cells: 35% average profit
  margin, 60% trial-to-paid conversion, 4,100+ new subscribers a month, $2.4
  ARPU with a stated $5 target (previously framed as "targeting 3x").
- **Slide 6 (Our clients)**: retitled "Companies we've run ads for" - no other
  change.
- **Slide 7 (AI Central University)**: chart rebuilt wider (viewBox width
  1760, was 1600) with the Y-axis moved to the right side. Months before Jul
  2025 are drawn at 32% opacity to de-emphasise the pre-launch period. A
  6-month forecast (Sep 2026-Feb 2027) is appended at +15% month-over-month
  from the Aug 2026 actual ($4,108), drawn as dashed unfilled bars per the
  deck's forecast convention. Two vertical markers added: "Launch, Jul 2025"
  (AI Central University as a branded programme; distinct from the underlying
  $4.99-to-$59.75 trial funnel, which started May 2025 - both true, different
  events) and "New funnel, Jun 2026", which is Alex's own note - the Stripe
  pull shows no visible step-change in the numbers around that date, so it is
  flagged in the speaker notes as pending a reconciled figure from him. A new
  second chart, "Trials started per month," is added below it, sourced from
  `trial_ledger` (Quiz Prod Supabase project, jcciwvaqbkxwtufvtiog), grouped on
  `trial_at`, pulled 27 Aug 2026 - 16 months, 4 to 106 trials/month. The "what
  other AI newsletters are doing" peer box moved from the right side to a
  horizontal strip at the bottom of the slide.
- **Slide 8 (SWOT)**: replaced with Alex's exact new item set. Flag: "#1
  Author in Tradepub's AI Section" (new Strength) is Alex's own claim, not yet
  independently verified - the speaker notes ask for a link or screenshot
  before this goes to anyone outside the room. New Threat added: "A social
  media ban, or a change to a social media algorithm."
- **Slide 9 (Industry M&A)**: deepened with fresh web research (They Got
  Acquired, beehiiv case studies, Axios, TechRadar, CX Today, Failory, KM Co's
  Q4 2025 private-company M&A survey). Every disclosed multiple in the table is
  now explicitly labelled a REVENUE multiple, estimated against reported or
  trade-press revenue (Morning Brew ~3.75x, Hustle ~2-2.7x, Peak ~1.65x) - none
  of these deals disclosed EBITDA. Milk Road, Mindstream and The Neuron remain
  "Not disclosed." New "A reasonable multiple" callout: at this deal size,
  buyers price on revenue, not EBITDA (too small, too new for earnings-based
  pricing); ad-led newsletters trade at 1-3x trailing revenue, subscription-
  heavy ones like ours at 3-5x. Noted in the speaker notes only: larger, scaled
  digital-media roll-ups trade at 8-12x EBITDA, but that is not a comparable
  set for a newsletter this size.
- **Slide 10 (Forecasts and valuation)**: simplified from three valuation
  methods to two (dropped the earnings multiple). Per-subscriber unchanged
  ($1.0-1.5M). Revenue multiple recomputed at 2.5-3.7x on 2026F ($402K) = $1.0-
  1.5M, a blended ad-plus-subscription multiple anchored at the top by Morning
  Brew's actual 3.75x from slide 9. Headline unchanged at $1.0-1.5M,
  framed as "conservative valuation... by end of 2026" per Alex's wording.

---

# UPDATE 28 Aug 2026 (v7) - restructure to 15 slides, "Media kit + financials"

The deck is no longer titled "Investor deck": the cover now reads MEDIA KIT +
FINANCIALS, consistent with the new Perspective & context slide, which states
that Alex is not actively talking to investors.

Structure is now 15 slides: Cover / Agenda / Perspective & context / Who we
are / Problem-readers / Problem-companies / Audience breakdown / Business
model / Revenues and forecasts / Our clients / AI Central Library / SWOT /
M&A comparables / Forecast and valuation / What we need right now.

New and changed data, with sources:

- **Slide 4 (Who we are)**: cells reduced to three - Total reach 613K/month
  (Buffer + beehiiv + LinkedIn impressions, unchanged basis), All-time revenue
  $452K+ "of which $270K closed in 2025 - 4x 2024", Avg profit margin (after
  tax) 35% (38% in 2024, 33% in 2025, statutory). NOTE: Alex's edit note said
  "3x from 2024", but 2025 ($268K) over 2024 ($65K) is 4.1x - the slide says 4x
  so it does not contradict the +313% growth label on the revenue chart. $270K
  is his rounding of the statutory $268K.
- **Slide 5 (Problem - readers)** and **Slide 6 (Problem - companies)**: new
  red-box/green-box slides, copy from Alex's edit list, lightly STE-adjusted.
  The "leads 50 to 60% cheaper than traditional paid ads" line is Alex's
  operating claim - flagged in the speaker notes as campaign experience, not a
  third-party study.
- **Slide 7 (Audience breakdown)**: geography switched from the media kit's
  4-region split (NA 44/Rest 22/Asia 20/Europe 14) to the quiz-sample split so
  the UK could be broken out per Alex: N=4,714 submissions with a country
  (enriched country first, IP fallback) - North America 50.0%, Rest 17.1%,
  Asia 14.1%, Europe 12.5%, UK 6.4%. Map rebuilt with 5 buckets, higher
  contrast, "Rest" deliberately uncolored; Russia left uncolored (visually
  Rest) rather than shaded as Europe or Asia. New "Where they work" bar chart:
  N=2,278 submissions with an employer industry, folded into families - Tech &
  software 17.7%, Education 10.9%, Finance 9.0%, Consulting & agencies 7.1%,
  Healthcare 3.3% - shown as top-5 shares of classified respondents (a further
  47% sit in a long tail, stated on the slide).
- **Slide 9 (Revenues and forecasts)**: stat "4,100+" relabelled "4,000+" per
  Alex; ARPU cell now "$2.4/year" with no target; chart titled "Total net
  revenue ($)" with the statutory-basis note under it.
- **Slide 11 (AI Central Library)**: renamed from University per Alex. Prices
  shown rounded ($5 trial, $60/yr; actuals $4.99/$59.75 in the notes). Stats
  now: 1,823 paying clients / 100+ new trials per month (recent months run
  94-106, trial_ledger) / 60% conversion / **$120 LTV at 40% churn - Alex's
  figure**: the strict model gives $113 at the $45 measured AOV or $150 at the
  full $60 price; his $120 sits between, flagged in the speaker notes. The two
  charts now share the same x-axis timeline (Nov 2023 through Feb 2027) so
  months align vertically between revenue and trials.
- **Slide 13 (M&A comparables)**: removed Milk Road, Mindstream and The Neuron
  (no disclosed prices) per Alex; added three disclosed-price benchmarks -
  Politico / Axel Springer 2021, $1B+, ~5x revenue (CNBC/WSJ); Axios / Cox
  2022, $525M, ~5x revenue (CNBC, Axios' own reporting); Industry Dive /
  Informa 2022, $389M cash up to $525M with earn-out, ~$110M revenue and ~$34M
  EBITDA = ~3.5x revenue and ~11.4x EBITDA (Informa market update, Press
  Gazette). Industry Dive is the only row with a disclosed EBITDA multiple and
  is labelled as such. Black "reasonable multiple" box removed; a caption line
  states all multiples are revenue multiples unless marked EBITDA, and that
  the three large deals anchor the ceiling while Peak/Hustle/Morning Brew are
  the relevant size band.
- **Slide 14 (Forecast and valuation)**: rebuilt as a four-step walk to Alex's
  headline "about $1.25M by end of 2026": 2026F $402K -> multiple 2.5-3.5x ->
  $1.0-1.4M -> per-subscriber cross-check $1.0-1.5M -> midpoint ~$1.25M. Black
  box removed.
- **Slide 15 (What we need right now)**: light-green background per Alex;
  items now 01 Introductions to potential clients, 02 Networks and
  multipliers, 03 Events/conferences/speaking, 04 Mentoring by industry
  operators (replacing M&A deal flow). Contact line removed.

---

# UPDATE 28 Aug 2026 (v8) - layout polish pass

No data changes. Visual and copy changes only:

- **Footer**: the "AI CENTRAL" text and the round page-number badge are
  replaced by one small footer per slide, "AI CENTRAL · NN".
- **Slide 7 (Audience breakdown)**: "Who they are" and "Where they work"
  now stack vertically on the left; the map fills the right half at roughly
  double the size, re-projected to zoom on the US-Europe corridor (viewBox
  1100x620, fit window lon -128..42, lat 14..66). Europe's shade darkened
  to #D9636F (Asia #CE4B59) for contrast; "Rest" stays uncolored.
- **Slides 5/6 and 8/9**: kickers now read "(1/2)"/"(2/2)".
- **Slide 11 (Library)**: more breathing room between title, stats and
  charts; the first chart marker moved from Jul 2025 to **May 2025** per
  Alex, labelled "Launch, May 2025" - which now coincides exactly with the
  start of the current $4.99 trial funnel, so the faded pre-launch bars and
  the marker agree.
- **Slide 14 (Valuation)**: step labels removed - each row is now just the
  number, the sentence, and the result.
- **Slide 15**: "- -" dashes removed (title now "Not capital. Acceleration").

---

# UPDATE 28 Aug 2026 (v9) - PDF font fix + title edits

- **PDF bug fixed**: the v8 PDF lost most body text. Cause: on screen only the
  cover slide is visible, so the Light/Regular font faces used by body copy
  never load; switching to print media and printing immediately caught those
  faces mid-load, and Chromium printed the text during the font-block period
  (invisible). pdf.js now waits for all four Inter weights to report loaded
  after print emulation before calling page.pdf(). Verified by per-page text
  extraction: total text layer went from ~5.6K to ~11.4K characters.
- Titles: slide 2 "Agenda"; slide 3 "Why AI Central"; slide 5 "Time is money -
  professionals know that" (Alex typed "now that", read as a typo for "know");
  slide 6 "Money is time - especially VC money"; slide 15 red kicker removed,
  title now "What we need right now".

---

# UPDATE 28 Aug 2026 (v10) - click-to-reveal build steps

No data changes. Slides now build in stages: blocks tagged data-step (max 4
groups per slide) fade in one group per click / right-arrow / space; once all
groups on a slide are shown, the next advance moves to the next slide.
Left-click / left-arrow hides the last group, or goes back a slide when
nothing is revealed. Cover and Agenda have no steps. Print and PDF force all
steps visible, so the export is unchanged.
Steps per slide: 03 scenarios 1-3 + closing row · 04 the three stat cells ·
05/06 problem box, solution box, grey bar · 07 who/work/map · 08 current +
in-development · 09 stats + chart · 10 bars + media kit · 11 stats, chart 1,
chart 2, black box · 12 the four SWOT quadrants · 13 table + caption · 14 the
four rows (midpoint joins row 4) · 15 the four asks.

---

# UPDATE 28 Aug 2026 (v11) - Italian version

Added `AI-Central-Strategic-Deck-IT.html` / `-IT.pdf`, generated from the built
English deck by `translate_it.py` (a ~195-rule exact-string translation pass),
so the two languages can never diverge on data. Simple Italian throughout, per
Alex. All numerals, currency figures and brand names are identical to the
English deck. Chart labels inside the SVGs are translated too (Lancio Mag
2025, Nuovo funnel Giu 2026, Prove iniziate per mese, settori, professioni).
Speaker notes stay in English - they are private presenter notes. Two IT-only
layout tweaks keep long titles on one line (slide 9 h2 at 58px, slide 11 h2 at
46px); both files pass the same overflow/overlap QA and the PDF carries the
full text layer (12.3K chars over 15 pages). To regenerate: build the English
deck first, then `python3 translate_it.py`.
