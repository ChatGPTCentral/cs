"""AI Central - Case Studies 2026, Extended Edition. One measured one-pager
per client, pairs with the Enterprise media kit (mediakit_enterprise.py).

Forked from casestudies.py, 4 Sep 2026, per Alex: deeper per-client
narrative for enterprise/agency readers, metrics present but not the
headline. Every fact used in the added narrative is already established
elsewhere in this file (objective, cadence, real purchase dates) - nothing
new is asserted about a client's motives or internal reasoning that is not
directly inferable from real purchase history. No client quote exists on
file for any of these five and none is invented here.

Data rules (Alex, 2 Sep 2026): email placements come from the 'Newsletter
Stats' sheet filtered to Advertiser Source = Direct only - beehiiv-sourced
rows are network ads that were auto-detected, not business we won. Carousel
figures come from the client campaign reports (LinkedIn analytics). Client
investment figures are kept OUT of the slides - prospects see CPM and cost
per download, not what another client paid. Sources: CASE-STUDIES-SOURCES.md.
"""
import json, pathlib, re

B = pathlib.Path("/home/claude/build")
head = (B / "_head.html").read_text()
tail = (B / "_tail.html").read_text()
A = json.load(open(B / "mk3-assets.json"))
assets = json.load(open(B / "assets.json"))

ACCENT, SURFACE, GRID, INK, MUTED = "#046BB1", "#F3F1EC", "#E3DFD7", "#141414", "#6E6E6E"
FOOT = '<div class="foot">AI CENTRAL</div>'

def renumber(sec, n):
    sec = re.sub(r'<!-- \d\d ─+', f'<!-- {n:02d} ' + '─' * 73, sec, count=1)
    return sec.replace('<div class="foot">AI CENTRAL</div>',
                       f'<div class="foot">AI CENTRAL &nbsp;·&nbsp; CASE STUDIES · EXTENDED &nbsp;·&nbsp; {n:02d}</div>').rstrip()

def label(t, col="var(--accent)", size=18):
    return f'<div style="font-size:{size}px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:{col}">{t}</div>'

# ── generic vertical bar chart (inline SVG) ─────────────────────────────────
def bars_svg(items, ymax, fmt=lambda v: f"{v:,}", W=1040, H=250, color=ACCENT, ticks=4, aria=""):
    L, R, T, Bm = 64, 16, 22, 44
    pw, ph = W - L - R, H - T - Bm
    n = len(items); slot = pw / n; bw = min(48, slot - 14)
    y = lambda v: T + ph * (1 - v / ymax)
    out = [f'<svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="{aria}">']
    for k in range(ticks + 1):
        v = ymax * k / ticks; gy = round(y(v), 1)
        out.append(f'<line x1="{L}" y1="{gy}" x2="{L+pw}" y2="{gy}" stroke="{GRID}" stroke-width="1"/>')
        out.append(f'<text x="{L-10}" y="{gy+6}" text-anchor="end" font-size="16" fill="{MUTED}" style="font-variant-numeric:tabular-nums">{fmt(round(v))}</text>')
    base = round(y(0), 1)
    for i, (lab, v) in enumerate(items):
        cx = L + slot * i + slot / 2; yv = round(y(v), 1)
        out.append(f'<rect x="{round(cx-bw/2,1)}" y="{yv}" width="{round(bw,1)}" height="{round(base-yv,1)}" rx="3" fill="{color}"/>')
        out.append(f'<text x="{round(cx,1)}" y="{yv-7}" text-anchor="middle" font-size="15" font-weight="700" fill="{INK}" style="font-variant-numeric:tabular-nums">{fmt(v)}</text>')
        out.append(f'<text x="{round(cx,1)}" y="{H-14}" text-anchor="middle" font-size="15" fill="{MUTED}">{lab}</text>')
    out.append('</svg>'); return "\n".join(out)

# ── data ────────────────────────────────────────────────────────────────────
# Email clients: Newsletter Stats, Advertiser Source = Direct, unique ad clicks by month
OUTSKILL_M = [("Jul 24",273),("Aug 24",1222),("Sep 24",184),("Oct 24",189),("Jan 25",1002),("Mar 25",566),
              ("Apr 25",538),("Jun 25",884),("Jul 25",747),("Aug 25",340),("Sep 25",635),("Oct 25",738)]
GUIDDE_M   = [("Dec 24",137),("Feb 25",1246),("Mar 25",408),("Apr 25",206),("May 25",769),("Jun 25",1051),
              ("Jul 25",167),("Aug 25",265),("Sep 25",582),("Oct 25",300)]
# Carousel clients: campaign reports, downloads per carousel (two batches each)
ELEVEN = [("Jan 1",189),("Jan 2",285),("Jan 3",285),("Jan 4",319),("Jan 5",455),("Mar 1",266),("Mar 2",261),("Mar 3",225),("Mar 4",203),("Mar 5",152)]
GAMMA  = [("Jan 1",491),("Jan 2",703),("Jan 3",401),("Jan 4",311),("Jan 5",186),("Feb 1",354),("Feb 2",340),("Feb 3",224),("Feb 4",240),("Feb 5",307),("Feb 6",266)]
LUMA   = [("Jan 1",449),("Jan 2",389),("Jan 3",403),("Jan 4",281),("Jan 5",234),("May 1",345),("May 2",260),("May 3",214),("May 4",228),("May 5",141)]

# Every client on file as of Sep 2026 rebooked at least once - see 09_advertiser_trust_research.md
RENEWALS = [
    ("Outskill", "25 email Primary Ad placements", "25 separate purchases", "Jul 2024 to Nov 2025 · 16 months"),
    ("Guidde", "21 email Primary Ad placements", "21 separate purchases", "Dec 2024 to Oct 2025 · 10 months"),
    ("ElevenLabs", "Bespoke LinkedIn carousels", "2 campaigns, 5 carousels each", "Jan and Mar 2026"),
    ("Luma AI", "Bespoke LinkedIn carousels", "2 campaigns, 5 carousels each", "Jan and May 2026"),
    ("Gamma", "Bespoke LinkedIn carousels", "2 campaigns, 5 then 6 carousels", "Jan and Feb 2026"),
]

def stat(v, l, red=False):
    return f'<div><div class="stat{" red" if red else ""}" style="font-size:46px">{v}</div><div class="stat-l" style="font-size:18px;margin-top:6px">{l}</div></div>'

def case(n_, logo_html, client, headline, objective, ran, stats, chart_title, chart, bench_title, bench_rows, source, notes):
    brows = "".join(
        f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding:8px 0;border-top:1px solid var(--hair-dark)">'
        f'<div style="font-size:18px;font-weight:300;color:#D9D6D1">{k}</div><div style="font-size:22px;font-weight:700;font-variant-numeric:tabular-nums">{v}</div></div>'
        for k, v in bench_rows)
    return f'''<!-- {n_:02d} {'─'*73} -->
<section class="slide light" data-label="{client}" data-notes="{notes}">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div class="kicker">CASE STUDY · {client.upper()}</div>
    <div style="height:44px;display:flex;align-items:center">{logo_html}</div>
  </div>
  <h2 style="font-size:58px">{headline}</h2>
  <div style="display:grid;grid-template-columns:440px 1fr;gap:44px;margin-top:22px;align-items:start">
    <div>
      <div data-step="1">
        {label("Objective")}
        <div style="margin-top:6px;font-size:20px;font-weight:300;line-height:1.4">{objective}</div>
        <div style="margin-top:14px">{label("What we ran")}</div>
        <div style="margin-top:6px;font-size:20px;font-weight:300;line-height:1.4">{ran}</div>
      </div>
      <div data-step="3" style="margin-top:18px;background:var(--ink);color:var(--paper);padding:18px 22px">
        {label(bench_title, "var(--accent)", 15)}
        <div style="margin-top:6px">{brows}</div>
      </div>
    </div>
    <div>
      <div data-step="2" style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;border-bottom:1px solid var(--hair);padding-bottom:16px">{"".join(stats)}</div>
      <div data-step="2" style="margin-top:14px;background:var(--tint);padding:12px 20px 6px">
        <div style="font-size:18px;font-weight:700">{chart_title}</div>
        <div style="margin-top:4px">{chart}</div>
      </div>
      <div style="margin-top:8px;font-size:15px;font-weight:300;color:var(--muted)">{source}</div>
    </div>
  </div>
  {FOOT}
</section>'''

S = {}

S[1] = f'''<!-- 01 {'─'*73} -->
<section class="slide dark" data-label="Cover" data-notes="Every number in this deck is measured: beehiiv post analytics for direct email placements, LinkedIn campaign reports for carousels (ElevenLabs, Luma, Gamma). Nothing is stated or estimated.">
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:64px">
    <img src="{A['logo_aicentral']}" alt="AI Central" style="width:760px;max-width:70%;height:auto">
    <div>
      <div class="kicker" style="font-size:30px;letter-spacing:.34em;text-align:center">CASE STUDIES</div>
      <div style="margin-top:22px;font-size:25px;font-weight:400;color:var(--muted-dark);text-align:center;letter-spacing:.03em">Five partners, 2024 to 2026 · Extended Edition</div>
    </div>
  </div>
  {FOOT}
</section>'''

S[2] = f'''<!-- 02 {'─'*73} -->
<section class="slide light" data-label="Every client rebooked" data-notes="The headline claim of the deck. No client on file as of Sep 2026 bought once and stopped. Source: CASE-STUDIES-SOURCES.md, cross-referenced against the invoice book.">
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

S[3] = case(3, f'<img src="{A["logo_outskill"]}" alt="Outskill" style="height:44px;border-radius:5px">', "Outskill",
  "A Primary Ad slot Outskill kept in rotation for 16 straight months",
  "Grow enrolments for Outskill's AI courses and fill recurring webinars, with pushes timed to their launch calendar. What started as a single placement in July 2024 became a standing slot: 25 separate purchases, one after another, through November 2025",
  "25 Primary Ad placements in the email newsletter, July 2024 to November 2025. Each placement carried one offer, one creative and one call to action",
  [stat("25","Email placements"), stat("7,318","Unique ad clicks", True), stat("2.1%","Average ad CTR"), stat("402K","Unique opens*")],
  "Unique ad clicks by month", bars_svg(OUTSKILL_M, 1400, aria="Outskill unique ad clicks by month, July 2024 to October 2025"),
  "Against our 200-click benchmark", [("Placements at or above it","18 of 25 · 72%"),("Average per placement","305 clicks"),("Best placement","754 clicks"),("Emails delivered","1.40M")],
  "Measured in beehiiv post analytics. Direct placements only; ad-network placements excluded",
  "Source: Newsletter Stats sheet, Advertiser Source = Direct, advertiser 'Growthschool / Outskill', 25 rows. 1,395,554 delivered, 401,895 unique opens, 29.5% average open rate, 7,318 unique ad clicks (26,813 total), 2.08% average ad CTR, median 298 unique clicks per placement, best 754 on 30 Jan 2025 (DeepSeek cheatsheets issue), lowest 76. 18 of 25 placements cleared our 200-click Primary Ad benchmark; the 7 that fell short averaged 122 clicks. Nov 2025 placement recorded 0 clicks and is not charted. *Open rate is shown for reference only: Apple Mail Privacy Protection pre-fetches images on roughly half of all opens industry-wide, so clicks are the reliable signal here, not opens.")

S[4] = case(4, f'<img src="{A["logo_guidde"]}" alt="Guidde" style="height:44px;border-radius:5px">', "Guidde",
  "Ten months of waves, timed to Guidde's own product calendar, not ours",
  "Full-funnel growth: awareness of Guidde's AI video documentation, then signups, in waves aligned to product moments. 21 placements between December 2024 and October 2025, spaced around Guidde's own launch windows rather than a fixed cadence",
  "21 Primary Ad placements in the email newsletter, December 2024 to October 2025, plus three LinkedIn newsletter issues in autumn 2025",
  [stat("21","Email placements"), stat("5,131","Unique ad clicks", True), stat("1.17%","Average ad CTR"), stat("467K","Unique opens*")],
  "Unique ad clicks by month", bars_svg(GUIDDE_M, 1400, aria="Guidde unique ad clicks by month, December 2024 to October 2025"),
  "Against our 200-click benchmark", [("Placements at or above it","11 of 21 · 52%"),("Average per placement","244 clicks"),("Best placement","532 clicks"),("Emails delivered","1.50M")],
  "Measured in beehiiv post analytics and LinkedIn newsletter analytics. Direct placements only",
  "Source: Newsletter Stats sheet, Advertiser Source = Direct, advertiser 'Guidde', 21 rows: 1,500,314 delivered, 466,951 unique opens, 31.2% average open rate, 5,131 unique ad clicks (19,716 total), 1.17% average ad CTR, median 202, best 532 on 2 Feb 2025, lowest 117. 11 of 21 placements cleared our 200-click Primary Ad benchmark; the other 10 averaged 169 clicks, a normal range for a recurring monthly placement. LinkedIn Newsletters sheet, Direct, Guidde: 3 issues 28 Sep to 16 Oct 2025, 68,194 article views, 317,899 sends - no ad click tracking on those, so no click figure is claimed for LinkedIn. Per Alex, Guidde's work was mostly email. *Open rate is shown for reference only: Apple Mail Privacy Protection pre-fetches images on roughly half of all opens industry-wide, so clicks are the reliable signal here, not opens.")

S[5] = case(5, f'<img src="{A["logo_elevenlabs"]}" alt="ElevenLabs" style="height:44px;border-radius:5px">', "ElevenLabs",
  "A second campaign followed two months after the first had a full report",
  "Launch Creative Studio and drive product signups among creators, marketing and enterprise teams, working from the highest-intent ICP segments identified with the ElevenLabs team. The first batch of five carousels ran in January 2026, a second in March",
  "Two campaigns of five bespoke LinkedIn carousels each, January and March 2026. Each carousel was a free ebook on one use case, with a lead-capture download",
  [stat("10","Carousels"), stat("259K","Views"), stat("2,640","Downloads", True), stat("7.7%","Average engagement")],
  "Downloads per carousel: five in January, five in March 2026", bars_svg(ELEVEN, 500, aria="ElevenLabs downloads per carousel, ten carousels across January and March 2026"),
  "Against our LinkedIn Ads benchmark", [("Cost per 1,000 views","$43 to $45"),("Benchmark CPM","$75"),("Cost per download","$3.91 to $4.88"),("Benchmark CPD","$8")],
  "Measured in native LinkedIn post analytics, reported to the client as delivered",
  "Source: AI Central x ElevenLabs campaign reports, batch 1 (January 2026) and batch 2 (March 2026). Batch 1: 132,958 views, 1,533 downloads, investment $5,999, CPM $45.12, CPD $3.91. Batch 2: 125,986 views, 1,107 downloads, investment $5,399, CPM $42.85, CPD $4.88. Engagement 4.9% to 10.2%, mean 7.7%. Carousels, in chart order: Voice as a product feature 189; Stories with AI voice 285; 10 enterprise uses 285; Creative teams stay consistent 319; Ads that convert 455; Creators expand reach 266; AI voice into cash 261; Global content 225; Best way to dub 203; AI video dubbing 152. Investment figures are deliberately not on the slide. Benchmark ($75 CPM, $8 CPD) is self-reported in our own campaign reports, standardized across all three carousel case studies; it is not independently audited industry data.")

S[6] = case(6, '<div style="font-size:30px;font-weight:700;letter-spacing:-.02em">Luma AI</div>', "Luma AI",
  "A second campaign, four months later, once the first had proved out",
  "Drive trial signups for Luma's AI image and video tools among marketing, brand and creative teams. January's five carousels had a full report behind them before the second batch of five went into production in May",
  "Two campaigns of five bespoke LinkedIn carousels each, January and May 2026. Each carousel was a free ebook on one creative workflow, with a lead-capture download",
  [stat("10","Carousels"), stat("242K","Views"), stat("2,944","Downloads", True), stat("6.6%","Average engagement")],
  "Downloads per carousel: five in January, five in May 2026", bars_svg(LUMA, 500, aria="Luma AI downloads per carousel, ten carousels across January and May 2026"),
  "Against our LinkedIn Ads benchmark", [("Cost per 1,000 views","$43 to $48"),("Benchmark CPM","$75"),("Cost per download","$2.85 to $5.05"),("Benchmark CPD","$8")],
  "Measured in native LinkedIn post analytics, reported to the client as delivered",
  "Source: AI Central x Luma AI campaign reports, January 2026 and May 2026. Jan: 115,836 views, 1,756 downloads, investment $4,999, CPM $43.16, CPD $2.85. May: 125,815 views, 1,188 downloads, investment $5,999, CPM $47.68, CPD $5.05. Engagement 4.8% to 8.2%, mean 6.6%. Carousels, in chart order: Realistic images 449; Ideas into images 389; Create AI images 403; Campaign visuals 281; Visual workspace 234; Own AI creative tool 345; Weekly content pipeline 260; Visual campaign 214; Brand identity system 228; Scale visual content 141. No Luma logo asset in any source - wordmark set in type. Investment figures are deliberately not on the slide. Benchmark ($75 CPM, $8 CPD) is self-reported in our own campaign reports, standardized across all three carousel case studies; it is not independently audited industry data.")

S[7] = case(7, f'<img src="{A["logo_gamma"]}" alt="Gamma" style="height:44px;border-radius:5px">', "Gamma",
  "A second, larger batch, one month after the first",
  "Launch Gamma's AI agent for presentations and drive signups among professionals who build decks. Five carousels in January 2026 were followed by six in February - the second batch larger than the first",
  "Two campaigns of bespoke LinkedIn carousels, five in January and six in February 2026. Each carousel was a free ebook on one presentation workflow, with a lead-capture download",
  [stat("11","Carousels"), stat("290K","Views"), stat("3,823","Downloads", True), stat("6.9%","Average engagement")],
  "Downloads per carousel: five in January, six in February 2026", bars_svg(GAMMA, 800, aria="Gamma downloads per carousel, eleven carousels across January and February 2026"),
  "Against our LinkedIn Ads benchmark", [("Cost per 1,000 views","$20 to $24"),("Benchmark CPM","$75"),("Cost per download","$1.19 to $2.31"),("Benchmark CPD","$8")],
  "Measured in native LinkedIn post analytics, reported to the client as delivered",
  "Source: AI Central x Gamma campaign reports, batch 1 (January 2026, 5 carousels) and batch 2 (February 2026, 6 carousels). Batch 1: 124,366 views, 2,092 downloads, investment $2,499, CPM $20.09, CPD $1.19. Batch 2: 165,561 views, 1,731 unique downloads, investment $3,999, CPM $24.15, CPD $2.31. Engagement 5.8% to 8.2%, mean 6.9%. Carousels in chart order: 10 Design Prompts 491; Idea to Visual in 3 Steps 703; Tips for Non-Designers 401; Personal Design Workflow 311; Top 5 Gamma Hacks 186; AI Slides in 2026 354; Board-ready Presentations 340; Emails into Slide Decks 224; CheatSheet into a Deck 240; Presentation from Claude 307; Ultimate Presentation Guide 266. This report's own footnote cited a $45 CPM benchmark; standardized here to $75 to match the other two carousel case studies, so the comparison across cards is consistent rather than each report's own figure. Both figures are self-reported in AI Central's own campaign reports, not independently audited industry data. Investment figures are deliberately not on the slide. Ledger context: 22 paid slots over five months, $11,292 confirmed via Passionfroot; the Q3 kit's '1,000+ downloads' undersold this by nearly 4x.")

S[8] = f'''<!-- 08 {'─'*73} -->
<section class="slide light" data-label="Run yours" data-notes="Extended edition, no pricing: pairs with the Enterprise media kit, per Alex 4 Sep 2026 - same reasoning as that kit's own closer, scoped bespoke rather than priced here. Replit is the one remaining candidate without a campaign report; the playbook states 200+ signups for the iOS-apps carousel. Same template, drop-in once a report exists.">
  <div class="kicker">RUN YOURS</div>
  <h2>Same format. Your product, your numbers</h2>
  <p class="subline">Every campaign ends with a report like the ones behind these five pages: clicks, downloads, and cost against a stated benchmark</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;margin-top:34px">
    <div data-step="1" style="background:var(--tint);padding:24px 28px"><div style="font-size:24px;font-weight:700">Email placements</div><div style="margin-top:8px;font-size:19px;font-weight:300;line-height:1.4">Primary Ad in the email newsletter. 97K+ subscribers, 30% open rate, guaranteed 200 clicks a placement</div></div>
    <div data-step="1" style="background:var(--tint);padding:24px 28px"><div style="font-size:24px;font-weight:700">Bespoke carousels</div><div style="margin-top:8px;font-size:19px;font-weight:300;line-height:1.4">Five carousels on five use cases, each a lead-capture ebook. 240K to 290K views and 2,600 to 3,800 downloads per campaign pair, measured</div></div>
    <div data-step="1" style="background:var(--tint);padding:24px 28px"><div style="font-size:24px;font-weight:700">Recurring waves</div><div style="margin-top:8px;font-size:19px;font-weight:300;line-height:1.4">Placements timed to your launches, webinars and product moments, across email and LinkedIn</div></div>
  </div>
  <div data-step="2" style="margin-top:22px;font-size:18px;font-weight:300;color:var(--muted)">Every campaign closes with a written report in the same format as the five pages before this one: clicks, downloads, and cost against a stated benchmark. Every engagement is scoped to your goals and quoted as one package - there is no rate card in this edition</div>
  <div data-step="3" style="margin-top:22px;background:var(--ink);color:var(--paper);padding:28px 36px;display:flex;gap:60px;align-items:center">
    <div style="font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent);flex:none">Let's talk</div>
    <div style="font-size:23px;line-height:1.5"><b>cntral.ai/meet</b> &nbsp;·&nbsp; <b>collabs@thecentral.ai</b> &nbsp;·&nbsp; media kit at <b>cntral.ai/media-kit-enterprise</b></div>
  </div>
  {FOOT}
</section>'''

html = head + "\n\n".join(renumber(S[i], i) for i in sorted(S)) + "\n\n" + tail
html = html.replace("<title>AI Central - Strategic Overview</title>", "<title>AI Central - Case Studies, Extended Edition</title>")
for w in (300, 400, 500, 700):
    html = html.replace(f"__FONT_{w}__", assets["fonts"][str(w)])
for name, uri in assets["icons"].items():
    html = html.replace("__ICON_" + name.upper().replace("-", "_") + "__", uri)
left = re.findall(r"__[A-Z0-9_]+__", html)
if left: raise SystemExit("unsubstituted: " + ", ".join(sorted(set(left))))
out = pathlib.Path("/home/claude/repo/AI-Central-Case-Studies-Extended-2026.html")
out.write_text(html)
print(f"case studies (extended): {len(S)} slides -> {out.name} ({out.stat().st_size/1024:.0f} KB)")
