# AI Central - - Advertiser Trust Research (Sep 2026)

Distilled from three parallel research passes on 2 Sep 2026: how newsletter
operators sell to CMOs and paid-media buyers, what strong media kits do, and
what post-campaign reporting convinces a performance buyer. Full source
citations and comparison tables live in the published artifact "The
Advertiser Trust Gap." Ask Alex for the link if you need a source you cannot
find below

## The one finding that matters most

Performance buyers do not distrust newsletters as a channel. They distrust
the reporting

Two currencies collapsed industry-wide. Apple Mail Privacy Protection
pre-fetches images on ~49% of all opens, whether a human reads the email or
not. Independent researchers put bot-generated clicks at 20% to 63% with no
filtering. Almost no publisher discloses a filtering method

The fix is not more stats. It is proof of the stats we already have: which
clients rebooked, our own hit rate against our own guarantee, one line on how
we measure, and comparisons priced in the buyer's currency (CPC, CPL), not
ours (opens)

## What this changes about how we talk to advertisers

- **Demote opens, promote CTR.** State a click rate against a sourced
  benchmark, not a raw open count. Say why: Apple MPP inflates opens
  industry-wide, clicks are not affected
- **State how we measured it.** One line: what a "unique ad click" means,
  that it is beehiiv's own deduplication, not a third layer of bot
  filtering we do not actually run. Never claim a filtering method we do not
  use
- **Lead with renewals.** A client who bought twice is worth more on the page
  than a client who bought once at a bigger number. Every case study on file
  as of Sep 2026 is a repeat buyer - say so
- **Argue the channel, not just the placement.** A newsletter+LinkedIn cost
  per lead against LinkedIn Ads' own published CPC lands harder than an
  isolated CTR number
- **The offer matters more than the format.** Demo-gated CTAs underperform.
  Value-first offers (a free tool, a template, a lead-capture ebook - - what
  our carousels already are) convert 2.6x better on click and 4.2x better on
  landing-page signup (Adam Goyette, 90+ B2B newsletter campaigns analysed).
  Push back if a prospect insists on a demo gate - - it will hurt their own
  numbers, not just ours

## New objections to handle (add to `04_objections_playbook.md`)

**"We tried newsletter ads and they didn't work"** - - almost always a
sample-size problem, not a channel problem. One send to 50K subscribers
yields 1 to 4 conversions at typical rates - - not enough to judge anything.
Counter with the math, then offer the 3-unit bundle as the smallest valid
test, not a discount

**"Prove the audience is real"** - - answer with what we actually have:
beehiiv verified/unique subscriber counts, and offer a screenshot of the live
dashboard on request. Do not invent a bot-audit or verification process we
do not run

## Pricing note - - not yet actioned

Research found AI Central's rate-card spread (~1.9x cheapest to most
expensive) is flatter than the market standard (3 to 4x between primary and
classified), and that LinkedIn placements specifically are priced under
comparable B2B LinkedIn-newsletter benchmarks ($1,500 to $4,000 vs. our
$699 to $899)

This is a pricing decision, not a copy fix. Nothing in the rate card has
changed. Flag it to Alex before touching any published price in
`02_products_pricing.md`

## What already changed in the decks (Sep 2026)

`decks/media-kit/` and `decks/case-studies/` (branch `decks`) were rebuilt
against this research. See each deck's own SOURCES.md for exact figures.
Summary of what moved:

- Case studies lead with a cross-client renewal slide: every client on file
  rebooked
- Every case study states its guarantee hit rate from real per-placement
  data, not a median that could read as barely clearing the bar
- The LinkedIn Carousel benchmark box is standardised to one sourced figure
  (ZenABM's published LinkedIn carousel-ad CPM, and Stackmatix's published
  LinkedIn Document Ads CPL) across ElevenLabs, Luma and Gamma, replacing
  each client report's own self-stated "industry average" footnote
- Headline stat rows lead with clicks and CTR, not unique opens. Opens moved
  to a footnote with the MPP caveat stated
- A "how we measured this" line sits under every stat block
- Media kit gained a Brand Safety &amp; Editorial Standards line, a
  bundle-as-minimum-valid-test framing on the carousel packages slide, and a
  reach-composition view of the 322K owned/transferable audience across
  email, LinkedIn newsletter and Substack

**Not done, flagged as open:**

- No client quotes were added to any case study. None exist in any source on
  file. Do not write one - - a fabricated testimonial attributed to a real
  company is not a copy problem, it is a legal one. Ask Alex to source real
  quotes from Outskill, Guidde, ElevenLabs, Luma or Gamma before this section
  can exist
- Named-persona slide (Axios/TLDR style, e.g. "33 CEOs from the top 1,000 US
  companies read us") needs a verifiable claim we do not currently have. The
  media kit uses aggregate, sourced seniority and industry data instead - -
  do not add a headline-grabbing persona stat without a real number behind it
- Rate-card pricing changes (above)
- Publishing the deck as a live microsite instead of a PDF - - an
  infrastructure decision for the `platform/` app, not a content edit
- A BPA Worldwide or AAM third-party subscriber audit - - a paid, external
  process Alex would need to commission
