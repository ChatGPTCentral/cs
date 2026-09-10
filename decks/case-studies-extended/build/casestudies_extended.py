"""AI Central - Case Studies 2026, Extended Edition. One measured one-pager
per client, pairs with the Enterprise media kit (mediakit_enterprise.py).

Forked from casestudies.py, 4 Sep 2026, per Alex: deeper per-client
narrative for enterprise/agency readers, metrics present but not the
headline. Every fact used in the added narrative is already established
elsewhere in this file (objective, cadence, real purchase dates) - nothing
new is asserted about a client's motives or internal reasoning that is not
directly inferable from real purchase history. No client quote exists on
file for any of these five and none is invented here.

Rebuilt 10 Sep 2026, per Alex: the original card (headline + objective/what
we ran + a monthly bar chart + a benchmark box) read as a data appendix, not
a case study. Replaced with a standard four-part story - who's the company,
what they wanted to achieve, what we did, results - plus a placeholder for
a client-supplied image. No chart, no month-by-month breakdown, no explicit
date range anywhere on the card; every fact still traces to the same
sourced figures as before (nothing new asserted, nothing dropped except the
time axis and the LinkedIn-Ads-benchmark comparison, per Alex's ask to keep
it to "just result"). Style reference: the "Client / Objective / Package /
Description" case-study format in the old (now obsolete) Q3 2026 docx media
kit Alex shared for context - modernized into four explicitly labeled
sections rather than one flowing paragraph, and built on this deck's own
already-verified numbers, not that document's.

Data rules (Alex, 2 Sep 2026): email placements come from the 'Newsletter
Stats' sheet filtered to Advertiser Source = Direct only - beehiiv-sourced
rows are network ads that were auto-detected, not business we won. Carousel
figures come from the client campaign reports (LinkedIn analytics). Client
investment figures are kept OUT of the slides - prospects see results, not
what another client paid. Sources: CASE-STUDIES-SOURCES.md.
"""
import json, pathlib, re, sys

B = pathlib.Path("/home/claude/build")
sys.path.insert(0, str(B))
from deck_shared import FOOT, label, make_renumber, stat

head = (B / "_head.html").read_text()
tail = (B / "_tail.html").read_text()
A = json.load(open(B / "mk3-assets.json"))
assets = json.load(open(B / "assets.json"))

renumber = make_renumber("CASE STUDIES · EXTENDED")

# Every client on file as of Sep 2026 rebooked at least once - see 09_advertiser_trust_research.md
RENEWALS = [
    ("Outskill", "25 email Primary Ad placements", "25 separate purchases", "Jul 2024 to Nov 2025 · 16 months"),
    ("Guidde", "21 email Primary Ad placements", "21 separate purchases", "Dec 2024 to Oct 2025 · 10 months"),
    ("ElevenLabs", "Bespoke LinkedIn carousels", "2 campaigns, 5 carousels each", "Jan and Mar 2026"),
    ("Luma AI", "Bespoke LinkedIn carousels", "2 campaigns, 5 carousels each", "Jan and May 2026"),
    ("Gamma", "Bespoke LinkedIn carousels", "2 campaigns, 5 then 6 carousels", "Jan and Feb 2026"),
]

# ── standard 4-part case-study card ─────────────────────────────────────────
# who's the company / what they wanted to achieve / what we did / results,
# plus a placeholder panel for a client-supplied image (Alex to add). No
# chart, no benchmark box, no explicit date range anywhere on the card.
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

S[3] = case_card(3, f'<img src="{A["logo_outskill"]}" alt="Outskill" style="height:44px;border-radius:5px">', "Outskill",
  "Outskill &mdash; AI upskilling academy and community for professionals",
  "Grow enrolments for Outskill's AI courses and fill recurring webinars, with pushes timed to their own launch calendar",
  "Primary Ad placements in the email newsletter, kept in standing rotation. Each placement carried one offer, one creative and one call to action",
  [stat("25","Email placements"), stat("7,318","Unique ad clicks", True), stat("2.1%","Average ad CTR"), stat("402K","Unique opens")],
  "Outskill campaign creative or a placement screenshot",
  "Rebuilt 10 Sep 2026 - dropped the monthly bar chart and benchmark box, per Alex ('just result', no chart, no time reference). Source: Newsletter Stats sheet, Advertiser Source = Direct, advertiser 'Growthschool / Outskill', 25 rows, Jul 2024 to Nov 2025. 1,395,554 delivered, 401,895 unique opens, 29.5% average open rate, 7,318 unique ad clicks (26,813 total), 2.08% average ad CTR, median 298 unique clicks per placement, best 754 on 30 Jan 2025 (DeepSeek cheatsheets issue), lowest 76. 18 of 25 placements cleared our 200-click Primary Ad benchmark; the 7 that fell short averaged 122 clicks. Nov 2025 placement recorded 0 clicks. Full monthly breakdown and the LinkedIn-Ads-benchmark comparison (removed from the visible slide) remain in git history and CASE-STUDIES-SOURCES.md.")

S[4] = case_card(4, f'<img src="{A["logo_guidde"]}" alt="Guidde" style="height:44px;border-radius:5px">', "Guidde",
  "Guidde &mdash; AI-powered video documentation platform, turning recordings into instant how-to guides",
  "Full-funnel growth: awareness of Guidde's AI video documentation, then signups, in waves aligned to product moments",
  "Primary Ad placements in the email newsletter, plus three LinkedIn newsletter issues, spaced around Guidde's own launch windows rather than a fixed cadence",
  [stat("21","Email placements"), stat("5,131","Unique ad clicks", True), stat("1.17%","Average ad CTR"), stat("467K","Unique opens")],
  "Guidde campaign creative or a placement screenshot",
  "Rebuilt 10 Sep 2026 - dropped the monthly bar chart and benchmark box, per Alex. Source: Newsletter Stats sheet, Advertiser Source = Direct, advertiser 'Guidde', 21 rows, Dec 2024 to Oct 2025: 1,500,314 delivered, 466,951 unique opens, 31.2% average open rate, 5,131 unique ad clicks (19,716 total), 1.17% average ad CTR, median 202, best 532 on 2 Feb 2025, lowest 117. 11 of 21 placements cleared our 200-click Primary Ad benchmark; the other 10 averaged 169 clicks. LinkedIn Newsletters sheet, Direct, Guidde: 3 issues 28 Sep to 16 Oct 2025, 68,194 article views, 317,899 sends - no ad click tracking on those, so no click figure is claimed for LinkedIn. Full monthly breakdown remains in git history and CASE-STUDIES-SOURCES.md.")

S[5] = case_card(5, f'<img src="{A["logo_elevenlabs"]}" alt="ElevenLabs" style="height:44px;border-radius:5px">', "ElevenLabs",
  "ElevenLabs &mdash; market-leading AI audio and voice generation platform",
  "Launch Creative Studio and drive product signups among creators, marketing and enterprise teams, working from the highest-intent ICP segments identified with the ElevenLabs team",
  "Two campaigns of five bespoke LinkedIn carousels each. Each carousel was a free ebook on one use case, with a lead-capture download",
  [stat("10","Carousels"), stat("259K","Views"), stat("2,640","Downloads", True), stat("7.7%","Average engagement")],
  "ElevenLabs carousel creative or a campaign screenshot",
  "Rebuilt 10 Sep 2026 - dropped the per-carousel bar chart and LinkedIn-Ads-benchmark box, per Alex. Source: AI Central x ElevenLabs campaign reports, batch 1 (January 2026) and batch 2 (March 2026). Batch 1: 132,958 views, 1,533 downloads, investment $5,999, CPM $45.12, CPD $3.91. Batch 2: 125,986 views, 1,107 downloads, investment $5,399, CPM $42.85, CPD $4.88. Engagement 4.9% to 10.2%, mean 7.7%. Investment figures deliberately not on the slide. Full per-carousel breakdown and benchmark comparison remain in git history and CASE-STUDIES-SOURCES.md.")

S[6] = case_card(6, '<div style="font-size:30px;font-weight:700;letter-spacing:-.02em">Luma AI</div>', "Luma AI",
  "Luma AI &mdash; AI image and video generation tools for creative teams",
  "Drive trial signups for Luma's AI image and video tools among marketing, brand and creative teams",
  "Two campaigns of five bespoke LinkedIn carousels each. Each carousel was a free ebook on one creative workflow, with a lead-capture download",
  [stat("10","Carousels"), stat("242K","Views"), stat("2,944","Downloads", True), stat("6.6%","Average engagement")],
  "Luma AI carousel creative or a campaign screenshot",
  "Rebuilt 10 Sep 2026 - dropped the per-carousel bar chart and LinkedIn-Ads-benchmark box, per Alex. Source: AI Central x Luma AI campaign reports, January 2026 and May 2026. Jan: 115,836 views, 1,756 downloads, investment $4,999, CPM $43.16, CPD $2.85. May: 125,815 views, 1,188 downloads, investment $5,999, CPM $47.68, CPD $5.05. Engagement 4.8% to 8.2%, mean 6.6%. No Luma logo asset in any source - wordmark set in type. Investment figures deliberately not on the slide. Full per-carousel breakdown and benchmark comparison remain in git history and CASE-STUDIES-SOURCES.md.")

S[7] = case_card(7, f'<img src="{A["logo_gamma"]}" alt="Gamma" style="height:44px;border-radius:5px">', "Gamma",
  "Gamma &mdash; AI-powered presentation platform",
  "Launch Gamma's AI agent for presentations and drive signups among professionals who build decks",
  "Two campaigns of bespoke LinkedIn carousels, eleven in total. Each carousel was a free ebook on one presentation workflow, with a lead-capture download",
  [stat("11","Carousels"), stat("290K","Views"), stat("3,823","Downloads", True), stat("6.9%","Average engagement")],
  "Gamma carousel creative or a campaign screenshot",
  "Rebuilt 10 Sep 2026 - dropped the per-carousel bar chart and LinkedIn-Ads-benchmark box, per Alex. Source: AI Central x Gamma campaign reports, batch 1 (January 2026, 5 carousels) and batch 2 (February 2026, 6 carousels). Batch 1: 124,366 views, 2,092 downloads, investment $2,499, CPM $20.09, CPD $1.19. Batch 2: 165,561 views, 1,731 unique downloads, investment $3,999, CPM $24.15, CPD $2.31. Engagement 5.8% to 8.2%, mean 6.9%. Investment figures deliberately not on the slide. Ledger context: 22 paid slots over five months, $11,292 confirmed via Passionfroot; the Q3 kit's '1,000+ downloads' undersold this by nearly 4x. Full per-carousel breakdown and benchmark comparison remain in git history and CASE-STUDIES-SOURCES.md.")

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
