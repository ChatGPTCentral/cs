"""AI Central - Pricing, 2026. Standalone rate-card presentation: cover,
master price table, then the same 5 measured client one-pagers as Case
Studies (Extended Edition) as proof behind the numbers.

New deck, 9-10 Sep 2026 per Alex: pricing was a slide inside the media kit
(added 9 Sep, see that repo's history), then pulled back out the same day
to live on its own, alongside the media kit and the strategic/investor deck
as the third preso in the set.

Pricing breakdown: numbers cross-checked against 02_products_pricing.md and
the Q1 2026 Sales Playbook Alex shared (the two agree on every figure) -
same sourcing note carried over from the media kit's now-removed rate card
slide. Only Newsletter Main Ad and Bespoke Ebook/LinkedIn Carousel have ever
had real package tiers on file; the rest are marked "Priced on request"
rather than inventing numbers - see that slide's own data-notes below.

Case studies: forked from case-studies-extended/build/casestudies_extended.py
- same renewals table and five client one-pagers, same underlying figures.
10 Sep 2026: that deck's cards were rebuilt from headline+chart+benchmark-box
to a standard four-part story (who's the company / what they wanted to
achieve / what we did / results, plus a placeholder for a client-supplied
image) - no chart, no time reference, per Alex. This fork picked up that
same rebuild the same day. Only that deck's own cover and closing slides are
dropped here (replaced with this deck's own cover, and a closer that doesn't
say "there is no rate card in this edition" - this deck IS the rate card).
See CASE-STUDIES-EXTENDED-SOURCES.md in that deck's folder for full data
provenance - not duplicated here.
"""
import json, pathlib, re, sys

B = pathlib.Path("/home/claude/build")
sys.path.insert(0, str(B))
from deck_shared import FOOT, label, make_renumber, stat, page_nav

head = (B / "_head.html").read_text().replace(
    "table{width:100%;border-collapse:collapse;margin-top:44px;table-layout:fixed}",
    "table{width:100%;border-collapse:collapse;margin-top:0;table-layout:fixed}"
).replace(
    "th{padding:13px 16px;background:var(--tint);font-size:21px;font-weight:700;",
    "th{padding:10px 14px;background:var(--tint);font-size:16px;font-weight:700;"
).replace(
    "td{padding:13px 16px;border-top:1px solid var(--hair);font-size:24px;font-weight:300;line-height:1.3}",
    "td{padding:9px 14px;border-top:1px solid var(--hair);font-size:19px;font-weight:300;line-height:1.3}"
)
tail = (B / "_tail.html").read_text()
A = json.load(open(B / "mk3-assets.json"))
assets = json.load(open(B / "assets.json"))

renumber = make_renumber("PRICING 2026")

def _label_of(sec):
    m = re.search(r'data-label="([^"]*)"', sec)
    return m.group(1) if m else ''

def _end_of_open_tag(sec):
    i, quote = sec.index('<section'), None
    while True:
        c = sec[i]
        if quote:
            if c == quote: quote = None
        elif c in '"\'': quote = c
        elif c == '>': return i + 1
        i += 1

# price_table() - copied from media-kit/build/mediakit.py (this deck's own
# rate card fork of it), 9 Sep 2026. Generic 3+ column renderer: index 0 =
# row name, index 1 = accent/bold (assumed Price) - keep Price at index 1
# in any row tuple passed in, whatever else the table carries.
def price_table(rows, cols, widths):
    th = "".join(f'<th style="width:{w}">{c}</th>' for c, w in zip(cols, widths))
    trs = []
    for i, r in enumerate(rows):
        last = "border-bottom:1px solid var(--hair);" if i == len(rows) - 1 else ""
        tds = "".join(
            f'<td class="{"name" if j == 0 else ""}" style="{last}{"font-weight:700;color:var(--accent);" if j == 1 else ""}">{c}</td>'
            for j, c in enumerate(r))
        trs.append(f"<tr>{tds}</tr>")
    return f'<table><thead><tr>{th}</tr></thead><tbody>{"".join(trs)}</tbody></table>'

# ── standard 4-part case-study card - copied from case-studies-extended's
# own case_card(), 10 Sep 2026 fork (same day that deck's cards were
# rebuilt away from headline+chart+benchmark-box to this format, per Alex:
# "not referencing the time or any chart, just result"). Who's the company,
# what they wanted to achieve, what we did, results, plus a placeholder
# panel for a client-supplied image.
def case_card(n_, logo_html, client, company_line, objective, what_we_did, stats, image_caption, notes):
    return f'''<!-- {n_:02d} {'─'*73} -->
<section class="slide light" data-label="{client}" data-notes="{notes}">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div class="kicker">CASE STUDY · {client.upper()}</div>
    <div style="height:44px;display:flex;align-items:center">{logo_html}</div>
  </div>
  <h2 style="font-size:46px">{company_line}</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:26px;align-items:start">
    <div data-step="1">
      {label("What they wanted to achieve", "var(--accent)", 18)}
      <div style="margin-top:6px;font-size:20px;font-weight:300;line-height:1.4">{objective}</div>
      <div style="margin-top:20px">{label("What we did", "var(--accent)", 18)}</div>
      <div style="margin-top:6px;font-size:20px;font-weight:300;line-height:1.4">{what_we_did}</div>
      <div style="margin-top:20px">{label("Results", "var(--accent)", 18)}</div>
      <div style="margin-top:10px;display:grid;grid-template-columns:repeat(2,1fr);gap:18px">{"".join(stats)}</div>
    </div>
    <div data-step="2" style="background:var(--tint);border:1px dashed var(--hair);border-radius:8px;min-height:520px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px">
      <div style="font-size:14px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)">Image</div>
      <div style="font-size:15px;font-weight:300;color:var(--muted);text-align:center;padding:0 40px;line-height:1.4">{image_caption}</div>
    </div>
  </div>
  {FOOT}
</section>'''

RENEWALS = [
    ("Outskill", "25 email Primary Ad placements", "25 separate purchases", "Jul 2024 to Nov 2025 · 16 months"),
    ("Guidde", "21 email Primary Ad placements", "21 separate purchases", "Dec 2024 to Oct 2025 · 10 months"),
    ("ElevenLabs", "Bespoke LinkedIn carousels", "2 campaigns, 5 carousels each", "Jan and Mar 2026"),
    ("Luma AI", "Bespoke LinkedIn carousels", "2 campaigns, 5 carousels each", "Jan and May 2026"),
    ("Gamma", "Bespoke LinkedIn carousels", "2 campaigns, 5 then 6 carousels", "Jan and Feb 2026"),
]

_ON_REQUEST = [
  ("Newsletter Secondary Ad", "Mid-issue placement, below the main editorial, on both surfaces"),
  ("Dedicated Issue", "The whole send is yours. Written by our editors in the AI Central voice"),
  ("Welcome Sequence", "A dedicated email to every new subscriber for 3 months"),
  ("Website Banner", "Always-on banner on thecentral.ai, 20,000 visits a month"),
  ("Social Media Post", "A dedicated post on our LinkedIn company page, in the AI Central voice, tagging your brand"),
]

S = {}

# ── 01 Cover ─────────────────────────────────────────────────────────────────
S[1] = f'''<!-- 01 {'─'*73} -->
<section class="slide dark" data-label="Cover" data-notes="New deck, 9-10 Sep 2026 per Alex: pricing as its own presentation, alongside the media kit and the strategic/investor deck. Cover follows the same pattern as those two (and case-studies-extended) - centered lockup, dark bookend background.">
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:64px">
    <img src="{A['logo_aicentral']}" alt="AI Central" style="width:760px;max-width:70%;height:auto">
    <div>
      <div class="kicker" style="font-size:30px;letter-spacing:.34em;text-align:center">PRICING</div>
      <div style="margin-top:22px;font-size:25px;font-weight:400;color:var(--muted-dark);text-align:center;letter-spacing:.03em">Rate card, and the results behind it · 2026</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 02 Rate card ─────────────────────────────────────────────────────────────
# Content forked from the media kit's own rate card slide (added there 9 Sep
# 2026, moved here the same day) - see that repo's own git history for the
# slide's original build/verification notes. Unchanged here except the
# kicker (no "ADVERTISING OPTIONS ·" prefix - this deck has no slide 7 to
# follow) and the intro line (no longer "quoted per campaign" as a contrast
# to a price-carrying slide 7 that doesn't exist in this deck).
S[2] = f'''<!-- 02 {'─'*73} -->
<section class="slide light" data-label="Rate card"
  data-notes="Numbers cross-checked against 02_products_pricing.md and the Q1 2026 Sales Playbook Alex shared (the two agree on every figure). Only two formats have ever had real, sourced package tiers anywhere in this deck family's records: Newsletter Main Ad and Bespoke Ebook/LinkedIn Carousel. The other five (Newsletter Secondary Ad, Dedicated Issue, Welcome Sequence, Website Banner, Social Media Post) have never been priced in any source material - marked 'Priced on request' rather than inventing figures; their one-line descriptions match the media kit's own advertising-options slide verbatim. Flag if real numbers exist for any of these.
  Newsletter Main Ad note: the media kit's advertising-options slide shows this as ONE format running 'on both surfaces' (beehiiv + LinkedIn together), but the source pricing has always been two SEPARATE per-channel rate ladders - there has never been a single sourced number for a combined cross-channel buy. Shown here as one table with a Channel column rather than inventing a merged price; flag if a real bundled rate exists instead. Every ladder (both Main Ad channels, plus the ebook bundle) condensed to 1/3/5 package tiers - the source docs give 5 discrete Main Ad tiers (1-5 ads) but no table in this deck family has ever shown more than three at once.">
  <div class="kicker">RATE CARD</div>
  <h2>Transparent pricing, guaranteed minimums</h2>
  <p class="subline">Every paid package below carries a guaranteed minimum result</p>
  <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:44px;margin-top:22px">
    <div data-step="1">
      {label("Newsletter Main Ad")}
      <div style="margin-top:8px">{price_table([
        ("1 ad", "$899", "LinkedIn", "20,000 impressions, 100 clicks"),
        ("3 ads", "$2,499", "LinkedIn", "60,000 impressions, 300 clicks"),
        ("5 ads", "$3,799", "LinkedIn", "100,000 impressions, 500 clicks"),
        ("1 ad", "$1,299", "thecentral.ai", "30,000 impressions, 200 clicks"),
        ("3 ads", "$3,699", "thecentral.ai", "90,000 impressions, 600 clicks"),
        ("5 ads", "$5,499", "thecentral.ai", "150,000 impressions, 1,000 clicks"),
      ], ["Package", "Price", "Channel", "Minimum results"], ["16%", "14%", "24%", "46%"])}</div>
      <div style="margin-top:20px">{label("Bespoke Ebook / LinkedIn Carousel + Main Ad")}</div>
      <div style="margin-top:8px">{price_table([
        ("1 ebook + 1 Main Ad", "$999", "20,000 impressions"),
        ("3 ebooks + 3 Main Ads", "$2,799", "60,000 impressions"),
        ("5 ebooks + 5 Main Ads", "$4,499", "100,000 impressions"),
      ], ["Package", "Price", "Minimum results"], ["44%", "16%", "40%"])}</div>
    </div>
    <div data-step="2">
      {label("Priced on request")}
      <div style="margin-top:8px">{"".join(
        f'<div style="padding:11px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="font-size:18px;font-weight:700;letter-spacing:-.005em">{n}</div>'
        f'<div style="margin-top:3px;font-size:15px;font-weight:300;line-height:1.35;color:var(--muted)">{d}</div></div>'
        for n, d in _ON_REQUEST)}</div>
      <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--hair)">
        {label("Discount policy", "var(--muted)", 15)}
        <div style="margin-top:8px;font-size:17px;font-weight:300;line-height:1.4;color:#3A3A3A">10% off for new clients. Up to 5% off, discretionary, to close</div>
      </div>
      <div style="margin-top:14px;font-size:15px;font-weight:300;line-height:1.4;color:var(--muted)">LinkedIn Ads benchmarks run $30 to 80 CPM and $5 to 12 CPC - every guaranteed minimum above beats that</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 03 Every client rebooked (section intro for the case-study proof) ──────
S[3] = f'''<!-- 03 {'─'*73} -->
<section class="slide light" data-label="Every client rebooked" data-notes="Forked verbatim from case-studies-extended's S[2] (casestudies_extended.py), 9-10 Sep 2026 - byte-identical content, this deck's own renumbering only. The headline claim of that deck, reused here as the pricing deck's own transition into proof: no client on file as of Sep 2026 bought once and stopped. Source: CASE-STUDIES-SOURCES.md, cross-referenced against the invoice book.">
  <div class="kicker">EVERY CLIENT ON FILE, SEP 2026</div>
  <h2 style="font-size:58px">5 of 5 clients came back and bought again</h2>
  <p class="subline">A result is a number. A rebooking is a decision, made by someone who already saw the first report</p>
  <table style="margin-top:36px">
    <thead><tr>
      <th style="width:16%">Client</th><th style="width:30%">Format</th>
      <th style="width:24%">Purchase history</th><th style="width:30%">Span</th>
    </tr></thead>
    <tbody>
      {"".join(f'<tr><td class="name">{c}</td><td>{f}</td><td style="font-weight:700;color:var(--accent)">{p}</td><td>{s}</td></tr>' for c, f, p, s in RENEWALS)}
    </tbody>
  </table>
  <div style="margin-top:28px;font-size:18px;font-weight:300;color:var(--muted)">Investment figures are logged in CASE-STUDIES-SOURCES.md and are not shown here - a prospect sees results and repeat-buy behaviour, not what another client paid</div>
  {FOOT}
</section>'''

S[4] = case_card(4, f'<img src="{A["logo_outskill"]}" alt="Outskill" style="height:44px;border-radius:5px">', "Outskill",
  "Outskill &mdash; AI upskilling academy and community for professionals",
  "Grow enrolments for Outskill's AI courses and fill recurring webinars, with pushes timed to their own launch calendar",
  "Primary Ad placements in the email newsletter, kept in standing rotation. Each placement carried one offer, one creative and one call to action",
  [stat("25","Email placements"), stat("7,318","Unique ad clicks", True), stat("2.1%","Average ad CTR"), stat("402K","Unique opens")],
  "Outskill campaign creative or a placement screenshot",
  "Source: Newsletter Stats sheet, Advertiser Source = Direct, advertiser 'Growthschool / Outskill', 25 rows, Jul 2024 to Nov 2025. 1,395,554 delivered, 401,895 unique opens, 29.5% average open rate, 7,318 unique ad clicks (26,813 total), 2.08% average ad CTR, median 298 unique clicks per placement, best 754 on 30 Jan 2025, lowest 76. 18 of 25 placements cleared our 200-click Primary Ad benchmark; the 7 that fell short averaged 122 clicks. Full data in case-studies-extended/CASE-STUDIES-SOURCES.md.")

S[5] = case_card(5, f'<img src="{A["logo_guidde"]}" alt="Guidde" style="height:44px;border-radius:5px">', "Guidde",
  "Guidde &mdash; AI-powered video documentation platform, turning recordings into instant how-to guides",
  "Full-funnel growth: awareness of Guidde's AI video documentation, then signups, in waves aligned to product moments",
  "Primary Ad placements in the email newsletter, plus three LinkedIn newsletter issues, spaced around Guidde's own launch windows rather than a fixed cadence",
  [stat("21","Email placements"), stat("5,131","Unique ad clicks", True), stat("1.17%","Average ad CTR"), stat("467K","Unique opens")],
  "Guidde campaign creative or a placement screenshot",
  "Source: Newsletter Stats sheet, Advertiser Source = Direct, advertiser 'Guidde', 21 rows, Dec 2024 to Oct 2025: 1,500,314 delivered, 466,951 unique opens, 31.2% average open rate, 5,131 unique ad clicks (19,716 total), 1.17% average ad CTR, median 202, best 532 on 2 Feb 2025, lowest 117. 11 of 21 placements cleared our 200-click Primary Ad benchmark. Full data in case-studies-extended/CASE-STUDIES-SOURCES.md.")

S[6] = case_card(6, f'<img src="{A["logo_elevenlabs"]}" alt="ElevenLabs" style="height:44px;border-radius:5px">', "ElevenLabs",
  "ElevenLabs &mdash; market-leading AI audio and voice generation platform",
  "Launch Creative Studio and drive product signups among creators, marketing and enterprise teams, working from the highest-intent ICP segments identified with the ElevenLabs team",
  "Two campaigns of five bespoke LinkedIn carousels each. Each carousel was a free ebook on one use case, with a lead-capture download",
  [stat("10","Carousels"), stat("259K","Views"), stat("2,640","Downloads", True), stat("7.7%","Average engagement")],
  "ElevenLabs carousel creative or a campaign screenshot",
  "Source: AI Central x ElevenLabs campaign reports, batch 1 (January 2026) and batch 2 (March 2026). Batch 1: 132,958 views, 1,533 downloads, investment $5,999, CPM $45.12, CPD $3.91. Batch 2: 125,986 views, 1,107 downloads, investment $5,399, CPM $42.85, CPD $4.88. Investment figures deliberately not on the slide. Full data in case-studies-extended/CASE-STUDIES-SOURCES.md.")

S[7] = case_card(7, '<div style="font-size:30px;font-weight:700;letter-spacing:-.02em">Luma AI</div>', "Luma AI",
  "Luma AI &mdash; AI image and video generation tools for creative teams",
  "Drive trial signups for Luma's AI image and video tools among marketing, brand and creative teams",
  "Two campaigns of five bespoke LinkedIn carousels each. Each carousel was a free ebook on one creative workflow, with a lead-capture download",
  [stat("10","Carousels"), stat("242K","Views"), stat("2,944","Downloads", True), stat("6.6%","Average engagement")],
  "Luma AI carousel creative or a campaign screenshot",
  "Source: AI Central x Luma AI campaign reports, January 2026 and May 2026. Jan: 115,836 views, 1,756 downloads, investment $4,999, CPM $43.16, CPD $2.85. May: 125,815 views, 1,188 downloads, investment $5,999, CPM $47.68, CPD $5.05. No Luma logo asset in any source - wordmark set in type. Full data in case-studies-extended/CASE-STUDIES-SOURCES.md.")

S[8] = case_card(8, f'<img src="{A["logo_gamma"]}" alt="Gamma" style="height:44px;border-radius:5px">', "Gamma",
  "Gamma &mdash; AI-powered presentation platform",
  "Launch Gamma's AI agent for presentations and drive signups among professionals who build decks",
  "Two campaigns of bespoke LinkedIn carousels, eleven in total. Each carousel was a free ebook on one presentation workflow, with a lead-capture download",
  [stat("11","Carousels"), stat("290K","Views"), stat("3,823","Downloads", True), stat("6.9%","Average engagement")],
  "Gamma carousel creative or a campaign screenshot",
  "Source: AI Central x Gamma campaign reports, batch 1 (January 2026, 5 carousels) and batch 2 (February 2026, 6 carousels). Batch 1: 124,366 views, 2,092 downloads, investment $2,499, CPM $20.09, CPD $1.19. Batch 2: 165,561 views, 1,731 unique downloads, investment $3,999, CPM $24.15, CPD $2.31. Investment figures deliberately not on the slide. Full data in case-studies-extended/CASE-STUDIES-SOURCES.md.")

# ── 09 Closing ───────────────────────────────────────────────────────────────
# Adapted, not copied verbatim, from case-studies-extended's own S[8]: that
# slide's "there is no rate card in this edition" line doesn't apply here -
# this deck opens WITH the rate card - so the closer instead points back up
# to it and to the media kit for full format detail, rather than restating
# "every engagement is scoped and quoted" as if no numbers exist yet.
S[9] = f'''<!-- 09 {'─'*73} -->
<section class="slide light" data-label="Run yours" data-notes="Adapted from case-studies-extended's S[8], 9-10 Sep 2026 - dropped the 'no rate card in this edition' framing since this deck's whole second slide is the rate card; points back to it and to the media kit for full format detail instead.">
  <div class="kicker">RUN YOURS</div>
  <h2>Same format. Your product, your numbers</h2>
  <p class="subline">Every campaign ends with a report like the ones behind these five pages: clicks, downloads, and cost against a stated benchmark</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;margin-top:34px">
    <div data-step="1" style="background:var(--tint);padding:24px 28px"><div style="font-size:24px;font-weight:700">Email placements</div><div style="margin-top:8px;font-size:19px;font-weight:300;line-height:1.4">Primary Ad in the email newsletter. 97K+ subscribers, 30% open rate, guaranteed 200 clicks a placement</div></div>
    <div data-step="1" style="background:var(--tint);padding:24px 28px"><div style="font-size:24px;font-weight:700">Bespoke carousels</div><div style="margin-top:8px;font-size:19px;font-weight:300;line-height:1.4">Five carousels on five use cases, each a lead-capture ebook. 240K to 290K views and 2,600 to 3,800 downloads per campaign pair, measured</div></div>
    <div data-step="1" style="background:var(--tint);padding:24px 28px"><div style="font-size:24px;font-weight:700">Recurring waves</div><div style="margin-top:8px;font-size:19px;font-weight:300;line-height:1.4">Placements timed to your launches, webinars and product moments, across email and LinkedIn</div></div>
  </div>
  <div data-step="2" style="margin-top:22px;font-size:18px;font-weight:300;color:var(--muted)">Every campaign closes with a written report in the same format as the five pages before this one: clicks, downloads, and cost against a stated benchmark. Full format detail, benefits and how-it-works for every line on the rate card lives in the media kit</div>
  <div data-step="3" style="margin-top:22px;background:#333333;color:var(--paper);padding:28px 36px;display:flex;gap:60px;align-items:center">
    <div style="font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent);flex:none">Let's talk</div>
    <div style="font-size:23px;line-height:1.5"><b>cntral.ai/meet</b> &nbsp;·&nbsp; <b>collabs@thecentral.ai</b> &nbsp;·&nbsp; media kit at <b>cntral.ai/media-kit</b></div>
  </div>
  {FOOT}
</section>'''

# ── assemble ─────────────────────────────────────────────────────────────────
ns = sorted(S)
numbered = {i: renumber(S[i], i) for i in ns}
labels = {i: _label_of(numbered[i]) for i in ns}
navved = {}
for idx, i in enumerate(ns):
    prev_i = ns[idx - 1] if idx > 0 else None
    next_i = ns[idx + 1] if idx < len(ns) - 1 else None
    nav = page_nav(prev_i, labels.get(prev_i, ''), labels[i], next_i, labels.get(next_i, ''))
    if i == 1:
        nav = re.sub(r'<div class="pn-current">.*?</div>', '', nav, count=1)
    pos = _end_of_open_tag(numbered[i])
    navved[i] = numbered[i][:pos] + nav + numbered[i][pos:]

html = head + "\n\n".join(navved[i] for i in ns) + "\n\n" + tail
html = html.replace("<title>AI Central - Strategic Overview</title>", "<title>AI Central - Pricing 2026</title>")
for w in (300, 400, 500, 700):
    html = html.replace(f"__FONT_{w}__", assets["fonts"][str(w)])
for name, uri in assets["icons"].items():
    html = html.replace("__ICON_" + name.upper().replace("-", "_") + "__", uri)
left = re.findall(r"__[A-Z0-9_]+__", html)
if left: raise SystemExit("unsubstituted: " + ", ".join(sorted(set(left))))
out = pathlib.Path("/home/claude/repo/AI-Central-Pricing-2026.html")
out.write_text(html)
print(f"pricing: {len(S)} slides -> {out.name} ({out.stat().st_size/1024:.0f} KB)")
