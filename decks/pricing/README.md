# AI Central - Pricing, 2026

The third preso in the set, alongside the strategic/investor deck
(`../strategic/`) and the media kit (`../media-kit/`). Built 9-10 Sep 2026
per Alex: pricing started as a slide inside the media kit, then moved out
to live on its own the same day.

9 slides: cover, rate card, then the same 5 measured client one-pagers as
Case Studies (Extended Edition) as proof behind the numbers (renewals table
+ Outskill, Guidde, ElevenLabs, Luma AI, Gamma).

**Rate card** - only two formats have ever had real, sourced package tiers
anywhere in this deck family: Newsletter Main Ad and Bespoke Ebook/LinkedIn
Carousel. The other five formats (Newsletter Secondary Ad, Dedicated Issue,
Welcome Sequence, Website Banner, Social Media Post) are marked "Priced on
request" - no source document has ever put a number on them. See
`PRICING-SOURCES.md`.

**Case studies section** - forked verbatim from
`../case-studies-extended/build/casestudies_extended.py` (itself a 4 Sep
2026 fork of `../case-studies/`): same renewals table and five client
one-pagers, byte-identical stats, charts and benchmark boxes. Only that
deck's own cover and closing slides are dropped - this deck has its own
cover, and a closer that doesn't say "there is no rate card in this
edition" (this deck opens with one). Data provenance for every case-study
figure is unchanged and lives in `../case-studies/CASE-STUDIES-SOURCES.md`
- not duplicated here.

Single-step build:

```
python3 pricing.py     # assemble + inline -> the final HTML
DECK=/abs/path/AI-Central-Pricing-2026.html PDF=/abs/out.pdf node qa.js
```
