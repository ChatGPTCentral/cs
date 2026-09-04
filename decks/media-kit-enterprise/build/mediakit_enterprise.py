"""AI Central - Partnership & Media Kit, Enterprise Edition, Q3 2026.

Forked from mediakit.py, 4 Sep 2026, per Alex: two audiences need two kits.
This one drops every price and collapses the four rate-card slides into one
formats overview - for external stakeholders and enterprise/agency sales,
where pricing is either not the point yet or gets scoped bespoke. The
standard, priced kit (mediakit.py) stays the one for CMOs, GTM and
influencer-marketing operators buying transactionally.

Same sources as mediakit.py - Official_Media_Kit_Q3_2026 (docx, 18 Aug 2026
metrics), Sales Playbook v3 / 02_products_pricing.md (rate card, referenced
only to keep format descriptions consistent - no price appears on any
slide), live beehiiv publication stats (2 Sep 2026), quiz-DB audience sample.
Every number is logged in MEDIA-KIT-SOURCES.md.
"""
import json, pathlib, re

B = pathlib.Path("/home/claude/build")
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

FOOT = '<div class="foot">AI CENTRAL</div>'

def renumber(sec, n):
    sec = re.sub(r'<!-- \d\d ─+', f'<!-- {n:02d} ' + '─' * 73, sec, count=1)
    sec = sec.replace('<div class="foot">AI CENTRAL</div>',
                      f'<div class="foot">AI CENTRAL &nbsp;·&nbsp; MEDIA KIT · ENTERPRISE &nbsp;·&nbsp; {n:02d}</div>')
    return sec.rstrip()

def label(t, col="var(--accent)", size=20):
    return f'<div style="font-size:{size}px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:{col}">{t}</div>'

def bullets(items, size=21, gap=7):
    return "".join(
        f'<div style="display:flex;gap:12px;padding:{gap}px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="width:7px;height:7px;border-radius:50%;background:var(--accent);flex:none;margin-top:{size*0.55:.0f}px"></div>'
        f'<div style="font-size:{size}px;font-weight:300;line-height:1.35">{i}</div></div>' for i in items)

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

S = {}

# ── 01 Cover ────────────────────────────────────────────────────────────────
S[1] = f'''<!-- 01 {'─'*73} -->
<section class="slide dark" data-label="Cover"
  data-notes="Advertiser-facing. No financials, no valuation, no investor framing anywhere in this deck.">
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:64px">
    <img src="{A['logo_aicentral']}" alt="AI Central" style="width:760px;max-width:70%;height:auto">
    <div>
      <div class="kicker" style="font-size:30px;letter-spacing:.34em;text-align:center">PARTNERSHIP &amp; MEDIA KIT</div>
      <div style="margin-top:22px;font-size:25px;font-weight:400;color:var(--muted-dark);text-align:center;letter-spacing:.03em">Q3 2026 · AI Central Media · Enterprise Edition</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 02 About ────────────────────────────────────────────────────────────────
S[2] = f'''<!-- 02 {'─'*73} -->
<section class="slide light" data-label="About AI Central Media"
  data-notes="Positioning statement is the brand skill's canonical line. '100+ companies' is backed by 104 distinct advertisers in the beehiiv ad export plus the direct clients in the invoice book; the Q3 docx said 75+, which undercounts. The brand started in 2023 (LinkedIn page May 2023, beehiiv Nov 2023); the docx said 2024, which is the company registration year - we say 2023 for the brand.">
  <div class="kicker">ABOUT AI CENTRAL MEDIA</div>
  <h2>We turn attention into pipeline for AI and SaaS brands</h2>
  <p class="subline">Imagine Bloomberg Businessweek, but for AI - that's the brand we're building. Our flagship publication, AI Central, covers practical AI for senior professionals, and we pair premium placements with editorial-grade creative that speaks to senior operators</p>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:24px">
    <div style="background:var(--tint);padding:18px 22px"><div class="stat" style="font-size:46px">100+</div><div class="stat-l" style="font-size:19px;margin-top:6px">AI companies, SaaS platforms, education brands and growth teams have advertised with us since 2023</div></div>
    <div style="background:var(--tint);padding:18px 22px"><div class="stat" style="font-size:46px">613K</div><div class="stat-l" style="font-size:19px;margin-top:6px">Accounts reached every month, across the 7 channels we operate</div></div>
    <div style="background:var(--tint);padding:18px 22px"><div class="stat" style="font-size:46px">London</div><div class="stat-l" style="font-size:19px;margin-top:6px">Editorial team, led by the founder. Readers in 151 countries and all 50 US states</div></div>
  </div>
  <div data-step="2" style="margin-top:18px">
    {label("We have partnered with", "var(--muted)", 17)}
    <img src="{A['partners']}" alt="ElevenLabs, Guidde, Gamma, Notion, Delve, Attio, HubSpot, Udacity, UX Pilot, Taplio, Fellow, Outskill, Synthflow, Typeless, Fyxer, Flow" style="max-height:158px;width:auto;max-width:100%;display:block;margin-top:6px">
  </div>
  <div data-step="3" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--hair)">
    {label("Brand safety and editorial standards", "var(--muted)", 15)}
    <div style="margin-top:5px;font-size:17px;font-weight:300;line-height:1.35;max-width:1400px">Sponsored content is written and designed in-house, reviewed before publication, and always labeled as a partnership. It runs in the same editorial voice as our own reporting, never mixed into it</div>
  </div>
  {FOOT}
</section>'''

# ── 03 Why companies choose us ──────────────────────────────────────────────
def usecase(n_, title, intro, items):
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:26px 30px">
      <div style="font-size:17px;font-weight:700;letter-spacing:.16em;color:var(--muted)">0{n_}</div>
      <div style="margin-top:6px;font-size:27px;font-weight:700;letter-spacing:-.01em">{title}</div>
      <div style="margin-top:8px;font-size:20px;font-weight:300;line-height:1.35;color:#3A3A3A">{intro}</div>
      <div style="margin-top:12px">{bullets(items, 20, 6)}</div>
    </div>'''

S[3] = f'''<!-- 03 {'─'*73} -->
<section class="slide light" data-label="Why companies choose us"
  data-notes="Three campaign types, straight from the Q3 kit. Map a prospect to one of these on the first call, then pick the format on slides 8-11.">
  <div class="kicker">WHY COMPANIES CHOOSE AI CENTRAL</div>
  <h2>Three kinds of campaign we run</h2>
  <p class="subline">Senior operators and decision makers, actively building with AI. Tell us the goal and we pick the mix</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:30px">
    {usecase(1, "Lead generation", "We convert attention into qualified opportunities", [
      "Increase free trial or product signups", "Drive webinar registrations",
      "Promote lead magnets: whitepapers, reports, books", "Generate demo bookings for SaaS platforms"])}
    {usecase(2, "Revenue acceleration", "We execute high-urgency growth pushes", [
      "Promote paid courses and certification programmes", "Drive ticket sales for conferences and events",
      "Launch lifetime deals", "Distribute limited-time discount codes"])}
    {usecase(3, "Brand authority", "We position your brand as the category leader", [
      "Announce funding rounds", "Share strategic partnerships",
      "Launch new products", "Introduce major features or platform upgrades"])}
  </div>
  {FOOT}
</section>'''

# ── 04 Peace of mind ────────────────────────────────────────────────────────
S[4] = f'''<!-- 04 {'─'*73} -->
<section class="slide light" data-label="Peace of mind, every campaign"
  data-notes="Restored from the Q2 2026 Figma pitch deck at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md. The direct comparison to a solo creator is the clearest 'why us' angle across every source in the pack.">
  <div class="kicker">WHY AI CENTRAL</div>
  <h2>Peace of mind, every campaign</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:30px">
    <div style="background:var(--tint);padding:28px 32px">
      <div style="font-size:26px;font-weight:700;color:var(--muted)">Working with a solo creator</div>
      <div style="margin-top:14px">{bullets([
        "You are constantly chasing to deliver on time",
        "Content is not on-brand: wrong logos, wrong fonts",
        "There is no ICP research",
        "There is low personalization",
        "Reporting standards are low",
        "There is little GTM or paid-ads understanding"], 19, 7)}</div>
    </div>
    <div style="background:var(--ink);color:var(--paper);padding:28px 32px">
      <div style="font-size:26px;font-weight:700;color:var(--accent)">Working with AI Central</div>
      <div style="margin-top:14px">{"".join(
        f'<div style="display:flex;gap:12px;padding:7px 0;border-top:1px solid var(--hair-dark)">'
        f'<div style="width:7px;height:7px;border-radius:50%;background:var(--accent);flex:none;margin-top:11px"></div>'
        f'<div style="font-size:19px;font-weight:300;line-height:1.35;color:#EDEAE3">{i}</div></div>' for i in [
        "You get on-time delivery, every time",
        "You get pixel-perfect, on-brand content from day one",
        "You get deep ICP research before a single piece is created",
        "You get content highly personalized to your audience and goals",
        "You get detailed performance reporting on every campaign",
        "You get GTM-native thinking and paid-ads understanding in every deliverable"])}</div>
    </div>
  </div>
  <div style="margin-top:22px;background:var(--tint);padding:20px 28px;font-size:19px;font-weight:300;line-height:1.4">Our clients renew because our team's white-glove service - - meticulous attention to detail, deep personalization, and exceptional care - - lets them run campaigns without the stress</div>
  {FOOT}
</section>'''

# ── 05 The audience ─────────────────────────────────────────────────────────
S[5] = f'''<!-- 05 {'─'*73} -->
<section class="slide light" data-label="The audience"
  data-notes="Reach: 300K+ is subscribers across the three publications (181K LinkedIn newsletter + 97.7K beehiiv + 44K Substack); 613K is accounts reached a month (Buffer + beehiiv + LinkedIn impressions, Aug 2026). Both true, different definitions - say which one you mean. Seniority, industries and geography are measured on the quiz database sample (1,985 / 2,278 / 4,714 respondents) and applied to the full audience, per Alex. The old '40% Founders, C-level and Execs' line is NOT supported by the data (13.9% founder + C-suite; 29.6% VP and above; 50.5% manager and above) - do not use it. 'LinkedIn is the main source of decision-makers' is the kit's claim; in the last 4 weeks beehiiv's top acquisition sources were Netline and Refind, so we say organic on LinkedIn, not 'majority organic' overall.">
  <div class="kicker">THE AUDIENCE</div>
  <h2 style="font-size:62px">Senior professionals with budget, in 151 countries</h2>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:32px;margin-top:18px;border-bottom:1px solid var(--hair);padding-bottom:14px">
    <div><div class="stat red" style="font-size:40px">300K+</div><div class="stat-l" style="font-size:18px;margin-top:5px">Subscribers across our three publications</div></div>
    <div><div class="stat" style="font-size:40px">613K</div><div class="stat-l" style="font-size:18px;margin-top:5px">Accounts reached every month</div></div>
    <div><div class="stat" style="font-size:40px">35-55</div><div class="stat-l" style="font-size:18px;margin-top:5px">Key age cohort, in the peak earning years</div></div>
    <div><div class="stat" style="font-size:40px">50%</div><div class="stat-l" style="font-size:18px;margin-top:5px">Manager and above · 30% VP, director, founder or C-suite</div></div>
  </div>
  <div data-step="1" style="margin-top:8px">
    <div style="display:flex;height:10px;border-radius:3px;overflow:hidden">
      <div style="width:56%;background:#046BB1"></div>
      <div style="width:30%;background:#38A7AD"></div>
      <div style="width:14%;background:#6E6E6E"></div>
    </div>
    <div style="display:flex;gap:22px;margin-top:5px;font-size:15px;color:var(--muted)">
      <span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#046BB1;vertical-align:-1px"></i> LinkedIn newsletter 181K</span>
      <span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#38A7AD;vertical-align:-1px"></i> Email 97K</span>
      <span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#6E6E6E;vertical-align:-1px"></i> Substack 44K</span>
      <span>322K combined, three owned channels, each independently reachable</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:560px 1fr;gap:56px;margin-top:14px;align-items:start">
    <div data-step="2">
      {label("Who they are")}
      <div style="margin-top:10px">__CHART_PROF__</div>
      <div style="margin-top:16px">{label("Where they work")}</div>
      <div style="margin-top:10px">__CHART_IND__</div>
    </div>
    <div data-step="3">
      {label("Where they are")}
      <div style="margin-top:10px;max-width:800px">__CHART_MAP__</div>
      <div style="display:flex;gap:18px;margin-top:8px;font-size:17px;color:var(--muted);flex-wrap:wrap">
        <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#3B4C99;vertical-align:-1px"></i> North America 50%</span>
        <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#046BB1;vertical-align:-1px"></i> Europe 13% + UK 6%</span>
        <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#38A7AD;vertical-align:-1px"></i> Asia 14%</span>
        <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#E3DFD7;vertical-align:-1px"></i> Rest 17%</span>
      </div>
      <div style="margin-top:8px;font-size:18px;font-weight:300;line-height:1.4;color:var(--muted)">LinkedIn is our main source of decision makers, and most of that audience found us organically</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 05 The publications ─────────────────────────────────────────────────────
def pub(n_, logo, name, sub, stats, foot):
    rows = "".join(
        f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="font-size:19px;font-weight:300;color:#3A3A3A">{k}</div>'
        f'<div style="font-size:23px;font-weight:700;font-variant-numeric:tabular-nums">{v}</div></div>' for k, v in stats)
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:24px 28px;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:14px">
        <img src="{logo}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover">
        <div><div style="font-size:26px;font-weight:700;letter-spacing:-.01em">{name}</div><div style="font-size:17px;color:var(--muted)">{sub}</div></div>
      </div>
      <div style="margin-top:12px">{rows}</div>
      <div style="margin-top:auto;padding-top:10px;font-size:16px;font-weight:300;color:var(--muted)">{foot}</div>
    </div>'''

S[6] = f'''<!-- 06 {'─'*73} -->
<section class="slide light" data-label="The publications"
  data-notes="LinkedIn newsletter and company page figures are from the Q3 kit, sourced from Favikon on 18 Aug 2026 - not independently verifiable here. beehiiv figures are LIVE from the beehiiv API on 2 Sep 2026: 97,681 active subscribers, 29.7% open rate and 2.34% click rate over the last 4 weeks, +4,906 new subscribers in the same window. The docx said 86K subscribers / 30.25% / 2.48% - the 86K was average sends, not active subscribers. 'Average unique ad clicks' (300 LinkedIn, 312 beehiiv) are the kit's figures.">
  <div class="kicker">THE PUBLICATIONS</div>
  <h2>Three publications, one senior audience</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:34px">
    {pub(1, A['logo_linkedin'], "LinkedIn Newsletter", "AI Central, on LinkedIn", [
      ("Active subscribers", "181K+"), ("New subscribers a month", "+5,500"),
      ("Average unique CTR", "2.7%"), ("Average unique ad clicks", "300")],
      "Source: Favikon, 18 Aug 2026")}
    {pub(2, A['logo_linkedin'], "LinkedIn Company Page", "linkedin.com/company/chat-gpt-central", [
      ("Active followers", "289K"), ("New followers a month", "+8,300"),
      ("Average impressions per post", "4,500+"), ("Posts a week", "Daily")],
      "Source: Favikon, 18 Aug 2026")}
    {pub(3, A['logo_beehiiv'], "Email Newsletter", "thecentral.ai, on beehiiv", [
      ("Active subscribers", "97K+"), ("New subscribers a month", "+4,900"),
      ("Average open rate", "30%"), ("Average unique CTR", "2.3%"), ("Average unique ad clicks", "312")],
      "Source: beehiiv, last 4 weeks to 2 Sep 2026")}
  </div>
  <div data-step="4" style="margin-top:22px;font-size:20px;font-weight:300;color:var(--muted)">Plus 44K on Substack, and a growing presence on Threads, Instagram and X. Every campaign can run across all of them</div>
  <div data-step="4" style="margin-top:10px;font-size:16px;font-weight:300;color:var(--muted)">How we measure: figures above come directly from each platform's own analytics (beehiiv, LinkedIn). Email open rate is shown for reference only - Apple Mail Privacy Protection pre-fetches images on a large share of all opens industry-wide, so click rate is the more reliable signal</div>
  {FOOT}
</section>'''

# ── 06 Advertising options (consolidated, no rate card) ─────────────────────
def fmt_np(n_, name, what, ideal):
    return f'''<div style="background:var(--tint);padding:18px 22px">
      <div style="font-size:15px;font-weight:700;letter-spacing:.16em;color:var(--muted)">0{n_}</div>
      <div style="margin-top:4px;font-size:22px;font-weight:700;letter-spacing:-.01em">{name}</div>
      <div style="margin-top:6px;font-size:17px;font-weight:300;line-height:1.35;color:#3A3A3A">{what}</div>
      <div style="margin-top:8px;font-size:16px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
    </div>'''

S[7] = f'''<!-- 07 {'─'*73} -->
<section class="slide light" data-label="Advertising options"
  data-notes="Enterprise kit: the four rate-card slides (overview + Carousel/Main Ad/Email deep-dives, priced kit slides 7-10) collapse into this one no-numbers overview, per Alex 4 Sep 2026. Same eight formats, same descriptions, no dollar figures anywhere - bespoke scoping instead of a public rate card.">
  <div class="kicker">ADVERTISING OPTIONS</div>
  <h2>Eight ways to reach them</h2>
  <p class="subline">Every package is scoped to your goals and budget. There is no rate card here by design - let's talk about the right mix</p>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:26px">
    {fmt_np(1, "LinkedIn Carousel", "A co-branded PDF of up to 15 slides, made by our team, published in the feed, with a lifetime spot in the AI Library", "education-led demand and building credibility")}
    {fmt_np(2, "LinkedIn Main Ad", "Top placement in the LinkedIn newsletter, sent as email and posted to the feed. One partner per issue", "desktop-first offers: demos, extensions, announcements")}
    {fmt_np(3, "Email Primary Ad", "Top placement in the email newsletter, with full look-through analytics for retargeting. One partner per issue", "mobile offers: downloads, webinars")}
    {fmt_np(4, "Email Secondary Ad", "Mid-issue placement, between editorial blocks. Max two per issue", "always-on awareness at a lower entry point")}
  </div>
  <div data-step="2" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:16px">
    {fmt_np(5, "Tools Ad", "Your logo in our curated Favourite Tools section, next to tools readers already trust. Max four per issue", "self-serve signups and free trials")}
    {fmt_np(6, "Dedicated Issue", "100% share of voice. The whole send is yours, written in the AI Central voice readers trust", "major launches and high-ticket offers")}
    {fmt_np(7, "Welcome Sequence", "A dedicated email inside our welcome sequence, delivered to every new subscriber for 3 months", "predictable, compounding lead flow")}
    {fmt_np(8, "Website Banner", "Always-on banner on thecentral.ai, 20,000 visitors a month, every page", "continuous visibility between campaigns")}
  </div>
  {FOOT}
</section>'''

# ── 10 Premium formats ──────────────────────────────────────────────────────
def premium(n_, img, name, what, ideal):
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:22px 24px;display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:start">
      <img src="{img}" alt="" style="width:200px;border:1px solid var(--hair);background:#fff">
      <div>
        <div style="font-size:25px;font-weight:700;letter-spacing:-.01em">{name}</div>
        <div style="margin-top:8px">{bullets(what, 17, 4)}</div>
        <div style="margin-top:8px;font-size:16px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
      </div>
    </div>'''

S[8] = f'''<!-- 08 {'─'*73} -->
<section class="slide light" data-label="Premium formats"
  data-notes="The three formats without a list price. Diagrams are the kit's own. Quote per campaign; the pricing reference frames dedicated issues and multi-touch bundles at $5K to $10K+.">
  <div class="kicker">PREMIUM FORMATS · QUOTED PER CAMPAIGN</div>
  <h2>When one placement is not enough</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:30px">
    {premium(1, A['fmt_dedicated'], "Dedicated Issue", [
      "100% share of voice. The whole send is yours",
      "Subject line and preview text for your offer",
      "Copy by our editors, in the AI Central voice readers trust",
      "Several calls to action through the email",
      "Sent to the full list. Full report after the send"],
      "major launches, high-ticket offers, course and cohort launches, and brands that tested a primary ad and want to scale")}
    {premium(2, A['fmt_welcome'], "Welcome Sequence", [
      "A dedicated email inside our welcome sequence",
      "Delivered to every new subscriber for 3 months",
      "Reaches readers in their first days, their most engaged moment",
      "Custom UTM link for full attribution",
      "A daily stream of fresh, high-intent leads"],
      "brands that want predictable, compounding lead flow instead of a one-day spike")}
    {premium(3, A['fmt_banner'], "Website Banner", [
      "Always-on banner on thecentral.ai",
      "20,000 visitors a month, every page",
      "1200 x 200 creative with a call to action",
      "Optional second slot on archive and article pages",
      "Visibility between and beyond email campaigns"],
      "continuous presence next to the tutorials our readers come back for")}
  </div>
  {FOOT}
</section>'''

# ── 11 Guaranteed results + how it works ────────────────────────────────────
def step(n_, title, body):
    return f'''<div data-step="1" style="background:var(--tint);padding:20px 24px">
      <div style="font-size:36px;font-weight:700;line-height:1;color:var(--accent)">{n_}</div>
      <div style="margin-top:10px;font-size:22px;font-weight:700">{title}</div>
      <div style="margin-top:6px;font-size:18px;font-weight:300;line-height:1.35;color:#3A3A3A">{body}</div>
    </div>'''

S[9] = f'''<!-- 09 {'─'*73} -->
<section class="slide light" data-label="How it works"
  data-notes="Six steps restored from the Q2 2026 Figma pitch deck at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md. Guaranteed results policy wording is from the playbook, lightly simplified - it names impressions/clicks/downloads targets, not a price, so it stays here unchanged. The two '10% off' new-client and carousel-upsell lines from the priced kit are dropped: they are rate-card discounts, and this kit has no rate card to discount from.">
  <div class="kicker">HOW IT WORKS</div>
  <h2>Six steps, and a guarantee</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:26px">
    {step("1", "Brief", "We agree the goal, the content angle, the target reader, and the date")}
    {step("2", "Create", "Our team writes and designs the placement. You approve it before it goes out")}
    {step("3", "Publish", "We publish across the agreed channels: email, LinkedIn newsletter, feed, website")}
    {step("4", "Check in", "A mid-campaign call to review performance so far and adjust if needed")}
    {step("5", "Report", "You get a performance report: impressions, clicks, downloads, signups")}
    {step("6", "Plan the next one", "We bring follow-up campaign ideas based on what worked")}
  </div>
  <div data-step="2" style="margin-top:26px;background:var(--ink);color:var(--paper);padding:28px 36px;display:flex;gap:40px;align-items:center">
    <div style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);flex:none;width:300px;line-height:1.3">Guaranteed results policy</div>
    <div style="font-size:22px;font-weight:300;line-height:1.45;color:#D9D6D1">Every engagement has agreed targets for impressions, clicks or downloads. If the first run does not reach them, we keep publishing supporting placements at no extra cost until it does</div>
  </div>
  <div data-step="3" style="margin-top:22px;font-size:21px;font-weight:300;color:var(--muted)">
    <b style="color:var(--ink)">Custom bundles</b> combine carousels, main ads, dedicated issues and interviews, scoped to your goals and quoted as one engagement
  </div>
  {FOOT}
</section>'''

# ── 12 Case studies ─────────────────────────────────────────────────────────
def case(n_, logo, client, objective, package, result, body):
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:20px 24px;display:flex;flex-direction:column">
      <div style="height:52px;display:flex;align-items:center"><img src="{logo}" alt="{client}" style="max-height:52px;max-width:200px;border-radius:5px"></div>
      <div style="margin-top:12px;font-size:16px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)">Objective</div>
      <div style="font-size:18px;font-weight:300;line-height:1.35">{objective}</div>
      <div style="margin-top:8px;font-size:16px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)">Package</div>
      <div style="font-size:18px;font-weight:300;line-height:1.35">{package}</div>
      <div style="margin-top:12px;font-size:34px;font-weight:700;line-height:1;letter-spacing:-.02em;color:var(--accent)">{result}</div>
      <div style="margin-top:8px;font-size:17px;font-weight:300;line-height:1.35;color:#3A3A3A">{body}</div>
    </div>'''

S[10] = f'''<!-- 10 {'─'*73} -->
<section class="slide light" data-label="Case studies"
  data-notes="All figures rebuilt Sep 2026 from real beehiiv post analytics (Advertiser Source = Direct only) and LinkedIn campaign reports - see CASE-STUDIES-SOURCES.md and the full case-studies deck. Every client here rebooked at least once; that is now the headline claim, not any single number.">
  <div class="kicker">CASE STUDIES</div>
  <h2>Measured results, not estimates</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:30px">
    {case(1, A['logo_gamma'], "Gamma", "Launch of Gamma AI Agent and increase signups", "11 bespoke LinkedIn Carousels, 2 campaigns",
      "3,823 downloads", "Eleven bespoke carousels across two campaigns, each targeting one presentation use case for Gamma's ideal customer, with a lead-capture download. Bought twice")}
    {case(2, A['logo_elevenlabs'], "ElevenLabs", "Launch of Creative Studio and increase product signups", "10 bespoke LinkedIn Carousels, 2 campaigns",
      "2,640 downloads", "Explainer carousels for the highest-intent segments, distributed through our placements and the AI Library, across two campaigns. Bought twice")}
    {case(3, A['logo_guidde'], "Guidde", "Brand awareness and full-funnel growth", "21 Email Primary Ad placements",
      "5,131 unique ad clicks", "Recurring monthly placements aligned to Guidde's product moments, December 2024 to October 2025. Bought 21 times")}
    {case(4, A['logo_outskill'], "Outskill", "Brand awareness, webinar and course promotion", "25 Email Primary Ad placements",
      "7,318 unique ad clicks", "Webinar pushes, course promotions and launch windows aligned to Outskill's calendar, July 2024 to November 2025. Bought 25 times")}
  </div>
  <div data-step="4" style="margin-top:20px;font-size:19px;font-weight:300;color:var(--muted)">Also: 2 campaigns of bespoke LinkedIn carousels for Luma AI, 2,944 downloads across 242K views. Every client above rebooked at least once - full numbers and methodology in the case-studies deck, on request</div>
  {FOOT}
</section>'''

# ── 11 Team + contact ───────────────────────────────────────────────────────
S[11] = f'''<!-- 11 {'─'*73} -->
<section class="slide light" data-label="Meet the team"
  data-notes="Bio is the kit's, in shorter sentences. The $0 to $16M ARR fintech stat and the LinkedIn profile link were restored from legacy materials at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md. 'Teaches AI and monetization at Cozora Academy' replaces the vaguer 'university level' phrasing, matching the canonical bio already in 01_brand_positioning.md and sales_agent_training_data.json. Contact links from the brand skill's key-links table. 'This kit' points at the enterprise kit's own URL, not yet a live short link - Alex needs to set up cntral.ai/media-kit-enterprise (or confirm a different slug) before this is accurate.">
  <div class="kicker">MEET THE TEAM</div>
  <h2>Based in London, led by the founder</h2>
  <div style="display:grid;grid-template-columns:300px 1fr 420px;gap:48px;margin-top:34px;align-items:start">
    <img data-step="1" src="{A['alex']}" alt="Alex Fiore" style="width:300px;height:300px;object-fit:cover;border-radius:8px">
    <div data-step="1">
      <div style="font-size:32px;font-weight:700;letter-spacing:-.01em">Alex Fiore</div>
      <div style="font-size:20px;color:var(--muted)">Founder and Chief Editor, AI Central Media</div>
      <div style="margin-top:16px;font-size:20px;font-weight:300;line-height:1.45">Alex leads the editorial team. He is a founding member of the San Francisco AI Collective, and part of the Data and AI Group at Global Tech Advocates in London. He teaches AI and monetization at Cozora Academy, writes for several industry magazines, and holds an MSc in quantitative finance. Before AI Central, he was on the founding team of a UK AI fintech, where he built the go-to-market strategy and led the platform launch, taking the company from $0 to $16M ARR</div>
    </div>
    <div data-step="2" style="background:var(--ink);color:var(--paper);padding:30px 34px">
      <div style="font-size:19px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent)">Let's talk</div>
      <div style="margin-top:18px;font-size:22px;line-height:1.5">
        <div><span style="color:var(--muted-dark)">Book a call</span><br><b>cntral.ai/meet</b></div>
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">Email</span><br><b>collabs@thecentral.ai</b></div>
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">Advertise now</span><br><b>cntral.ai/storefront</b></div>
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">This kit</span><br><b>cntral.ai/media-kit-enterprise</b></div>
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">Connect with Alex</span><br><b>linkedin.com/in/alex-ai</b></div>
      </div>
    </div>
  </div>
  {FOOT}
</section>'''

out = head + "\n\n".join(renumber(S[i], i) for i in sorted(S)) + "\n\n" + tail
(B / "mk-enterprise.template.html").write_text(out)
print("media kit (enterprise) template:", len(S), "slides")
