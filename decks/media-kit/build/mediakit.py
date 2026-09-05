"""AI Central - Partnership & Media Kit, Q3 2026. Advertiser-facing deck.

Sources: Official_Media_Kit_Q3_2026 (docx, 18 Aug 2026 metrics), Sales
Playbook v3 / 02_products_pricing.md (rate card), live beehiiv publication
stats (2 Sep 2026), quiz-DB audience sample (charts shared with the strategic
deck). Every number is logged in MEDIA-KIT-SOURCES.md.
"""
import json, pathlib, re, sys

B = pathlib.Path("/home/claude/build")
sys.path.insert(0, str(B))
from deck_shared import FOOT, label, bullets, usecase, make_renumber, GOOD, BAD

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

renumber = make_renumber("MEDIA KIT Q3 2026")

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
      <div style="margin-top:22px;font-size:25px;font-weight:400;color:var(--muted-dark);text-align:center;letter-spacing:.03em">Q3 2026 · AI Central Media</div>
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
    <div style="background:var(--tint);padding:18px 22px"><div class="stat" style="font-size:46px">7</div><div class="stat-l" style="font-size:19px;margin-top:6px">Channels we operate across, reaching readers in 151 countries and all 50 US states</div></div>
    <div style="background:var(--tint);padding:18px 22px"><div class="stat" style="font-size:46px">London</div><div class="stat-l" style="font-size:19px;margin-top:6px">Editorial team, led by the founder</div></div>
  </div>
  <div data-step="2" style="margin-top:22px">
    {label("We have partnered with", "var(--muted)", 17)}
    <img src="{A['partners']}" alt="ElevenLabs, Guidde, Gamma, Notion, Delve, Attio, HubSpot, Udacity, UX Pilot, Taplio, Fellow, Outskill, Synthflow, Typeless, Fyxer, Flow" style="max-height:220px;width:100%;object-fit:contain;display:block;margin-top:10px">
  </div>
  {FOOT}
</section>'''

# ── 03 Why companies choose us ──────────────────────────────────────────────
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
    <div style="background:#F8ECEC;padding:28px 32px;min-height:640px;display:flex;flex-direction:column">
      <div style="font-size:26px;font-weight:700;color:var(--ink)">Working with a solo creator</div>
      <div style="margin-top:14px;flex:1;display:flex;flex-direction:column;justify-content:center">{"".join(
        f'<div style="display:flex;gap:12px;padding:18px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="font-size:18px;font-weight:700;color:{BAD};flex:none">✕</div>'
        f'<div style="font-size:19px;font-weight:300;line-height:1.35">{i}</div></div>' for i in [
        "You are constantly chasing to deliver on time",
        "Content is not on-brand: wrong logos, wrong fonts",
        "There is no ICP research",
        "There is low personalization",
        "Reporting standards are low",
        "There is little GTM or paid-ads understanding"])}</div>
    </div>
    <div style="background:#EBF4E8;padding:28px 32px;min-height:640px;display:flex;flex-direction:column">
      <div style="font-size:26px;font-weight:700;color:var(--ink)">Working with AI Central</div>
      <div style="margin-top:14px;flex:1;display:flex;flex-direction:column;justify-content:center">{"".join(
        f'<div style="display:flex;gap:12px;padding:18px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="font-size:18px;font-weight:700;color:{GOOD};flex:none">✓</div>'
        f'<div style="font-size:19px;font-weight:300;line-height:1.35">{i}</div></div>' for i in [
        "You get on-time delivery, every time",
        "You get pixel-perfect, on-brand content from day one",
        "You get deep ICP research before a single piece is created",
        "You get content highly personalized to your audience and goals",
        "You get detailed performance reporting on every campaign",
        "You get GTM-native thinking and paid-ads understanding in every deliverable"])}</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 05 The audience ─────────────────────────────────────────────────────────
S[5] = f'''<!-- 05 {'─'*73} -->
<section class="slide light" data-label="The audience"
  data-notes="Reach: 300K+ is subscribers across the three publications (181K LinkedIn newsletter + 97.7K beehiiv + 44K Substack); 613K is accounts reached a month (Buffer + beehiiv + LinkedIn impressions, Aug 2026). Both true, different definitions - say which one you mean. Seniority, industries and geography are measured on the quiz database sample (1,985 / 2,278 / 4,714 respondents) and applied to the full audience, per Alex. The old '40% Founders, C-level and Execs' line is NOT supported by the data (13.9% founder + C-suite; 29.6% VP and above; 50.5% manager and above) - do not use it. 'LinkedIn is the main source of decision-makers' is the kit's claim; in the last 4 weeks beehiiv's top acquisition sources were Netline and Refind, so we say organic on LinkedIn, not 'majority organic' overall.">
  <div class="kicker">THE AUDIENCE</div>
  <h2 style="font-size:62px">Senior professionals with budget, in 151 countries</h2>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:34px;border-bottom:1px solid var(--hair);padding-bottom:14px">
    <div><div class="stat red" style="font-size:40px">300K+</div><div class="stat-l" style="font-size:18px;margin-top:5px">Subscribers across our three publications</div></div>
    <div><div class="stat" style="font-size:40px">35-55</div><div class="stat-l" style="font-size:18px;margin-top:5px">Key age cohort, in the peak earning years</div></div>
    <div><div class="stat" style="font-size:40px">50%</div><div class="stat-l" style="font-size:18px;margin-top:5px">Manager and above · 30% VP, director, founder or C-suite</div></div>
  </div>
  <div style="display:grid;grid-template-columns:560px 1fr;gap:56px;margin-top:22px;align-items:start">
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
        <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#046BB1;vertical-align:-1px"></i> North America 50%</span>
        <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#3B4C99;vertical-align:-1px"></i> Europe 13% + UK 6%</span>
        <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#38A7AD;vertical-align:-1px"></i> Asia 14%</span>
        <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#E3DFD7;vertical-align:-1px"></i> Rest 17%</span>
      </div>
      <div style="margin-top:8px;font-size:18px;font-weight:300;line-height:1.4;color:var(--muted)">LinkedIn is our main source of decision makers, and most of that audience found us organically</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 05 The publications ─────────────────────────────────────────────────────
def pub(n_, logo, name, sub, ideal, stats, foot):
    rows = "".join(
        f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="font-size:19px;font-weight:300;color:#3A3A3A">{k}</div>'
        f'<div style="font-size:23px;font-weight:700;font-variant-numeric:tabular-nums">{v}</div></div>' for k, v in stats)
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:24px 28px;min-height:480px;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:14px">
        <img src="{logo}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover">
        <div><div style="font-size:26px;font-weight:700;letter-spacing:-.01em">{name}</div><div style="font-size:17px;color:var(--muted)">{sub}</div></div>
      </div>
      <div style="margin-top:14px;font-size:16px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
      <div style="margin-top:14px">{rows}</div>
      <div style="margin-top:auto;padding-top:10px;font-size:16px;font-weight:300;color:var(--muted)">{foot}</div>
    </div>'''

S[6] = f'''<!-- 06 {'─'*73} -->
<section class="slide light" data-label="The publications"
  data-notes="Reordered and renamed per Alex, 4 Sep 2026: beehiiv leads, the two LinkedIn surfaces named as distinct AI Central properties rather than 'LinkedIn Newsletter'/'LinkedIn Company Page'. Figures unchanged from the Q3 kit / beehiiv API - LinkedIn newsletter and company page figures are from the Q3 kit, sourced from Favikon on 18 Aug 2026 - not independently verifiable here. beehiiv figures are LIVE from the beehiiv API on 2 Sep 2026: 97,681 active subscribers, 29.7% open rate and 2.34% click rate over the last 4 weeks, +4,906 new subscribers in the same window. The docx said 86K subscribers / 30.25% / 2.48% - the 86K was average sends, not active subscribers. 'Average unique ad clicks' (300 LinkedIn, 312 beehiiv) are the kit's figures. Alex asked to connect LinkedIn for a live data pull instead of the Favikon snapshot - flagged back to him, no LinkedIn integration available in this session.">
  <div class="kicker">THE PUBLICATIONS</div>
  <h2>Three publications, one senior audience</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:34px">
    {pub(1, A['logo_beehiiv'], "AI Central Newsletter", "on thecentral.ai, via beehiiv", "mobile-first offers: downloads, webinar signups", [
      ("Active subscribers", "97K+"), ("New subscribers a month", "+4,900"),
      ("Average open rate", "30%"), ("Average unique CTR", "2.3%"), ("Average unique ad clicks", "312")],
      "Source: beehiiv, last 4 weeks to 2 Sep 2026")}
    {pub(2, A['logo_linkedin'], "AI Central's LinkedIn Company Page", "linkedin.com/company/chat-gpt-central", "sustained brand visibility and thought leadership, not single placements", [
      ("Active followers", "289K"), ("New followers a month", "+8,300"),
      ("Average impressions per post", "4,500+"), ("Posts a week", "Daily")],
      "Source: Favikon, 18 Aug 2026")}
    {pub(3, A['logo_linkedin'], "AI Central's LinkedIn Newsletter", "AI Central, on LinkedIn", "desktop-first offers: demos, extensions, announcements", [
      ("Active subscribers", "181K+"), ("New subscribers a month", "+5,500"),
      ("Average unique CTR", "2.7%"), ("Average unique ad clicks", "300")],
      "Source: Favikon, 18 Aug 2026")}
  </div>
  {FOOT}
</section>'''

# ── 06 Advertising options ──────────────────────────────────────────────────
def fmt(n_, name, what, ideal, price):
    return f'''<div style="background:var(--tint);padding:18px 22px;display:flex;flex-direction:column">
      <div style="font-size:15px;font-weight:700;letter-spacing:.16em;color:var(--muted)">0{n_}</div>
      <div style="margin-top:4px;font-size:23px;font-weight:700;letter-spacing:-.01em">{name}</div>
      <div style="margin-top:6px;font-size:18px;font-weight:300;line-height:1.35;color:#3A3A3A">{what}</div>
      <div style="margin-top:8px;font-size:17px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
      <div style="margin-top:auto;padding-top:10px;font-size:19px;font-weight:700;color:var(--accent)">{price}</div>
    </div>'''

S[7] = f'''<!-- 07 {'─'*73} -->
<section class="slide light" data-label="Advertising options"
  data-notes="Eight formats. The first three carry a public rate card (slides 8-10). The other five are quoted per campaign - the kit lists them without prices and the pricing reference has none, so 'on request' is the honest label until Alex sets list prices.">
  <div class="kicker">ADVERTISING OPTIONS</div>
  <h2>Eight ways to reach them</h2>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:30px">
    {fmt(1, "LinkedIn Carousel", "A co-branded PDF of up to 15 slides, made by our team, published in the feed", "education-led demand and building credibility", "From $699")}
    {fmt(2, "LinkedIn Main Ad", "Top placement in the LinkedIn newsletter. One partner per issue", "desktop offers: demos, extensions", "From $899")}
    {fmt(3, "Email Primary Ad", "Top placement in the email newsletter. One partner per issue", "mobile offers: downloads, webinars", "From $1,299")}
    {fmt(4, "Email Secondary Ad", "Mid-issue placement, below the main editorial", "always-on awareness at a lower entry point", "On request")}
  </div>
  <div data-step="2" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:16px">
    {fmt(5, "Tools Ad", "Your logo and one line in our curated Favourite Tools section. Max four per issue", "self-serve signups and free trials", "On request")}
    {fmt(6, "Dedicated Issue", "The whole send is yours. Written by our editors in the AI Central voice", "major launches and high-ticket offers", "On request")}
    {fmt(7, "Welcome Sequence", "A dedicated email to every new subscriber for 3 months", "predictable, compounding lead flow", "On request")}
    {fmt(8, "Website Banner", "Always-on banner on thecentral.ai, 20,000 visits a month", "continuous visibility between campaigns", "On request")}
  </div>
  {FOOT}
</section>'''

# ── 07 LinkedIn Carousel ────────────────────────────────────────────────────
S[8] = f'''<!-- 08 {'─'*73} -->
<section class="slide light" data-label="Bespoke Ebook"
  data-notes="Renamed from 'LinkedIn Carousel' to 'Bespoke Ebook' per Alex, 4 Sep 2026. Standalone ebook-only rows (1/3/5, with their discount-tier framing) removed per Alex - only the ebook+Main-Ad bundle rows remain; 'PDF downloads' minimum dropped from those rows, impressions kept. Alex's comment referred to the bundle partner as 'LinkedIn Dedicated Issue' - the bundle table has always paired the ebook with LinkedIn Main Ad, a different, separately-priced format from the on-request Dedicated Issue (slide 11). Kept as Main Ad pending confirmation - flagged back to Alex. Rate card from 02_products_pricing.md (matches the Q2 playbook).
  KNOWN ISSUE, not yet fixed: Morgane flagged the carousel-examples image background as 'weird' - needs either a replacement image or specifics on what's wrong; nothing changed here pending that.">
  <div class="kicker">ADVERTISING OPTIONS · 1/3</div>
  <h2>Bespoke Ebook</h2>
  <p class="subline">Scroll-stopping, educational storytelling in the feed. Our team writes and designs it, you approve it, we publish it</p>
  <div style="display:grid;grid-template-columns:1fr 1.25fr;gap:44px;margin-top:24px;align-items:start">
    <div data-step="1">
      {label("What you receive")}
      <div style="margin-top:8px">{bullets([
        "Up to 15 slides, co-branded, designed by our in-house team",
        "Your link on every slide: 15 to 20 calls to action",
        "A lifetime spot in the AI Library, 2,000+ views a month",
        "Full republishing rights, plus 10% off any new main ad order",
        "A performance report after publication"], 19, 6)}</div>
      <img src="{A['carousels']}" alt="Ebook examples for Gamma, ElevenLabs, Canva, Guidde and Comet" style="width:100%;margin-top:16px;border-radius:6px">
    </div>
    <div data-step="2">
      {label("Packages")}
      <div style="margin-top:8px">{price_table([
        ("1 ebook + 1 LinkedIn Main Ad", "$999", "20,000 impressions"),
        ("3 ebooks + 3 LinkedIn Main Ads", "$2,799", "60,000 impressions"),
        ("5 ebooks + 5 LinkedIn Main Ads", "$4,499", "100,000 impressions"),
      ], ["Package", "Price", "Minimum results"], ["44%", "16%", "40%"])}</div>
      <div style="margin-top:12px;font-size:17px;font-weight:300;color:var(--muted)">Bundles are guaranteed: max CPM $49.50, max CPC $4.90 on the smallest, falling to $44.99 and $4.40 on the largest. LinkedIn Ads benchmarks run $30 to 80 CPM and $5 to 12 CPC</div>
      <div style="margin-top:10px;font-size:16px;font-weight:300;color:var(--muted)">We recommend the 3-ebook bundle as a minimum test: one ebook is a single data point, three let you compare angles and formats with enough volume to judge what is actually working</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 08 LinkedIn Main Ad ─────────────────────────────────────────────────────
S[9] = f'''<!-- 09 {'─'*73} -->
<section class="slide light" data-label="LinkedIn Main Ad"
  data-notes="Reordered to what-you-receive / packages / example, matching slide 8's structure, per Alex 4 Sep 2026. 'Minimum results' renamed 'Expected results' and click figures dropped, impressions kept. Max CPM/CPC sentence removed. Rate card from 02_products_pricing.md. Every Main Ad price is built to upsell into the ebook bundle for a small step: 1 ad $899 -> 1 ebook + 1 ad $999; 3 ads $2,499 -> $2,799; 5 ads $3,799 -> $4,499. The example creative is the UX Pilot DALL-E 3 Playbook placement from the kit.">
  <div class="kicker">ADVERTISING OPTIONS · 2/3</div>
  <h2>LinkedIn Main Ad</h2>
  <p class="subline">Premium placement at the top of our LinkedIn newsletter. Limited to one partner per issue. Sent as an email and posted in the feed</p>
  <div style="display:grid;grid-template-columns:1fr 1.1fr 360px;gap:36px;margin-top:24px;align-items:start">
    <div data-step="1">
      {label("What you receive")}
      <div style="margin-top:8px">{bullets([
        "Your logo at the top of the newsletter",
        "Custom headline up to 10 words, copy up to 60 words",
        "Large HD creative, 1920 x 1080",
        "A dedicated call to action with a tracked link and pixel ID for retargeting",
        "Your team can comment and engage, which helps the post travel",
        "Lifetime SEO value: LinkedIn newsletters rank on linkedin.com's domain"], 18, 5)}</div>
      <div style="margin-top:12px">{label("Ideal for", "var(--muted)", 16)}</div>
      <div style="margin-top:4px;font-size:18px;font-weight:300;line-height:1.4">Desktop-first offers: demo bookings, browser extensions. Brands running LinkedIn Ads. Product announcements and short-deadline offers</div>
    </div>
    <div data-step="2">
      {label("Packages")}
      <div style="margin-top:8px">{price_table([
        ("1 Main Ad", "$899", "20,000 impressions"),
        ("2 Main Ads", "$1,750", "40,000 impressions"),
        ("3 Main Ads", "$2,499", "60,000 impressions"),
        ("4 Main Ads", "$3,200", "80,000 impressions"),
        ("5 Main Ads", "$3,799", "100,000 impressions"),
      ], ["Package", "Price", "Expected results"], ["30%", "20%", "50%"])}</div>
      <div style="margin-top:12px;font-size:17px;font-weight:300;color:var(--muted)">Add an ebook to any package for $100 to $700 more</div>
    </div>
    <div data-step="2" style="text-align:center">
      <img src="{A['shot_li_ad']}" alt="Example: UX Pilot main ad in the LinkedIn newsletter" style="max-height:540px;width:auto;max-width:100%;border:1px solid var(--hair)">
      <div style="margin-top:6px;font-size:15px;color:var(--muted)">Example: UX Pilot</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 09 Email ads (beehiiv) ──────────────────────────────────────────────────
S[10] = f'''<!-- 10 {'─'*73} -->
<section class="slide light" data-label="Email newsletter ads"
  data-notes="Reordered to placements / packages / example, matching slide 8, per Alex 4 Sep 2026. 'Minimum results' renamed 'Expected results', click figures dropped (impressions kept), Max CPM/CPC sentence removed. Tools Ad eliminated per Alex (also flagged on slide 7) - two placements remain, not three. Primary Ad rate card from 02_products_pricing.md. Secondary ad has no list price in any source - the clicks-per-issue range (30-80) comes from the kit's own tier graphic; ask Alex before quoting it. Example creative is the HubSpot co-branded issue.">
  <div class="kicker">ADVERTISING OPTIONS · 3/3</div>
  <h2>Email newsletter ads</h2>
  <p class="subline">Two placements in every issue. Sent to 97K+ subscribers and published on thecentral.ai</p>
  <div style="display:grid;grid-template-columns:1fr 1.1fr 300px;gap:36px;margin-top:24px;align-items:start">
    <div data-step="1">
      {label("The two placements")}
      <div style="margin-top:8px">
        <div style="padding:10px 0;border-top:1px solid rgba(0,0,0,.08)"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:21px">Primary Ad</b><span style="font-size:19px;font-weight:700;color:var(--accent)">200 to 500 clicks an issue</span></div><div style="font-size:17px;font-weight:300;line-height:1.35;color:#3A3A3A;margin-top:3px">Top of the issue, above all editorial. Logo, 10-word headline, 60 words of copy, HD creative, one call to action. One partner only</div></div>
        <div style="padding:10px 0;border-top:1px solid rgba(0,0,0,.08)"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:21px">Secondary Ad</b><span style="font-size:19px;font-weight:700;color:var(--accent)">30 to 80 clicks an issue</span></div><div style="font-size:17px;font-weight:300;line-height:1.35;color:#3A3A3A;margin-top:3px">Mid-issue, between editorial blocks. 8-word headline, 40 words of copy, 1200 x 628 creative. Max two per issue</div></div>
      </div>
    </div>
    <div data-step="2">
      {label("Primary Ad packages")}
      <div style="margin-top:8px">{price_table([
        ("1 Primary Ad", "$1,299", "30,000 impressions"),
        ("2 Primary Ads", "$2,499", "60,000 impressions"),
        ("3 Primary Ads", "$3,699", "90,000 impressions"),
        ("4 Primary Ads", "$4,599", "120,000 impressions"),
        ("5 Primary Ads", "$5,499", "150,000 impressions"),
      ], ["Package", "Price", "Expected results"], ["30%", "20%", "50%"])}</div>
      <div style="margin-top:12px;font-size:17px;font-weight:300;color:var(--muted)">Full look-through analytics of openers and clickers, for retargeting</div>
    </div>
    <div data-step="2" style="text-align:center">
      <img src="{A['shot_hubspot']}" alt="Example: HubSpot co-branded issue" style="max-height:560px;width:auto;max-width:100%;border:1px solid var(--hair)">
      <div style="margin-top:6px;font-size:15px;color:var(--muted)">Example: HubSpot</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 10 Premium formats ──────────────────────────────────────────────────────
def premium(n_, name, what, ideal):
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:26px 28px;min-height:600px;display:flex;flex-direction:column">
      <div style="font-size:25px;font-weight:700;letter-spacing:-.01em">{name}</div>
      <div style="margin-top:8px;font-size:16px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
      <div style="margin-top:16px;flex:1;display:flex;flex-direction:column;justify-content:center">{bullets(what, 18, 18)}</div>
    </div>'''

S[11] = f'''<!-- 11 {'─'*73} -->
<section class="slide light" data-label="Premium formats"
  data-notes="Wireframe renders removed, 'ideal for' moved up under the title, boxes made full-height with bullets spaced out, per Alex 4 Sep 2026. The three formats without a list price. Quote per campaign; the pricing reference frames dedicated issues and multi-touch bundles at $5K to $10K+.">
  <div class="kicker">PREMIUM FORMATS · QUOTED PER CAMPAIGN</div>
  <h2>When one placement is not enough</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:30px">
    {premium(1, "Dedicated Issue", [
      "100% share of voice. The whole send is yours",
      "Subject line and preview text for your offer",
      "Copy by our editors, in the AI Central voice readers trust",
      "Several calls to action through the email",
      "Sent to the full list. Full report after the send"],
      "major launches, high-ticket offers, course and cohort launches, and brands that tested a primary ad and want to scale")}
    {premium(2, "Welcome Sequence", [
      "A dedicated email inside our welcome sequence",
      "Delivered to every new subscriber for 3 months",
      "Reaches readers in their first days, their most engaged moment",
      "Custom UTM link for full attribution",
      "A daily stream of fresh, high-intent leads"],
      "brands that want predictable, compounding lead flow instead of a one-day spike")}
    {premium(3, "Website Banner", [
      "Always-on banner on thecentral.ai",
      "20,000 visitors a month, every page",
      "1200 x 200 creative with a call to action",
      "Optional second slot on archive and article pages",
      "Visibility between and beyond email campaigns"],
      "continuous presence next to the tutorials our readers come back for")}
  </div>
  {FOOT}
</section>'''

# ── 11 How it works ──────────────────────────────────────────────────────────
def step(n_, title, body):
    return f'''<div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--accent);color:var(--paper);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;flex:none">{n_}</div>
      <div style="margin-top:16px;font-size:21px;font-weight:700">{title}</div>
      <div style="margin-top:6px;font-size:16px;font-weight:300;line-height:1.35;color:var(--muted)">{body}</div>
    </div>'''

S[12] = f'''<!-- 12 {'─'*73} -->
<section class="slide light" data-label="How it works"
  data-notes="Redrawn as a single left-to-right transit line (station stops connected by one line), per Alex 4 Sep 2026 - matches the brand's 'central station' identity concept. Title simplified to 'How it works'. Guaranteed results policy box and the discount lines (10% new clients, 10% new main ad orders) removed per Alex; the custom-bundles line survives on its own since it isn't a discount. Six steps restored from the Q2 2026 Figma pitch deck at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md.">
  <div class="kicker">HOW IT WORKS</div>
  <h2>How it works</h2>
  <div style="position:relative;margin-top:120px">
    <div style="position:absolute;top:28px;left:28px;right:28px;height:2px;background:var(--hair)"></div>
    <div style="position:relative;display:flex;justify-content:space-between">
      {step("1", "Brief", "We agree the goal, the content angle, the target reader, and the date")}
      {step("2", "Create", "Our team writes and designs the placement. You approve it before it goes out")}
      {step("3", "Publish", "We publish across the agreed channels: email, LinkedIn newsletter, feed, website")}
      {step("4", "Check in", "A mid-campaign call to review performance so far and adjust if needed")}
      {step("5", "Report", "You get a performance report: impressions, clicks, downloads, signups")}
      {step("6", "Plan the next one", "We bring follow-up campaign ideas based on what worked")}
    </div>
  </div>
  <div data-step="2" style="margin-top:100px;background:var(--tint);padding:30px 40px;text-align:center;font-size:24px;font-weight:300;color:var(--muted)">
    <b style="color:var(--ink)">Custom bundles</b> combine ebooks, main ads, dedicated issues and interviews
  </div>
  {FOOT}
</section>'''

# ── 12 Case studies ─────────────────────────────────────────────────────────
def case(n_, logo, client, objective, package, result, body):
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:20px 24px;display:flex;flex-direction:column">
      <div style="height:52px;display:flex;align-items:center">{logo}</div>
      <div style="margin-top:12px;font-size:16px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)">Objective</div>
      <div style="font-size:18px;font-weight:300;line-height:1.35">{objective}</div>
      <div style="margin-top:8px;font-size:16px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)">Package</div>
      <div style="font-size:18px;font-weight:300;line-height:1.35">{package}</div>
      <div style="margin-top:12px;font-size:34px;font-weight:700;line-height:1;letter-spacing:-.02em;color:var(--accent)">{result}</div>
      <div style="margin-top:8px;font-size:17px;font-weight:300;line-height:1.35;color:#3A3A3A">{body}</div>
    </div>'''

S[13] = f'''<!-- 13 {'─'*73} -->
<section class="slide light" data-label="Case studies"
  data-notes="Date ranges dropped from each blurb per Alex 4 Sep 2026 (kept the substance: what ran, how many times, bought again). Luma AI promoted from the footer line to a full tile, same sourced figures (2,944 downloads, 242K views, 2 campaigns) already in CASE-STUDIES-SOURCES.md - no Luma logo asset exists, so it uses a type wordmark like the full case-studies deck does. Alex also asked to (a) retitle this slide 'Client testimonials' - not done: this slide shows measured results, not quotes, and no testimonial exists on file for any client (see CASE-STUDIES-SOURCES.md); (b) add HubSpot/UX Pilot/SciSpace/Replit - not done, no sourced campaign figures exist for any of the four here (Replit specifically was already evaluated and dropped for this exact reason - see CASE-STUDIES-SOURCES.md). Flagged back to Alex rather than guessing or inventing numbers. All figures rebuilt Sep 2026 from real beehiiv post analytics (Advertiser Source = Direct only) and LinkedIn campaign reports - see CASE-STUDIES-SOURCES.md and the full case-studies deck. Every client here rebooked at least once; that is now the headline claim, not any single number.">
  <div class="kicker">CASE STUDIES</div>
  <h2>Measured results, not estimates</h2>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-top:30px">
    {case(1, f'<img src="{A["logo_gamma"]}" alt="Gamma" style="max-height:52px;max-width:180px;border-radius:5px">', "Gamma", "Launch of Gamma AI Agent and increase signups", "11 bespoke LinkedIn Carousels, 2 campaigns",
      "3,823 downloads", "Eleven bespoke carousels across two campaigns, each targeting one presentation use case for Gamma's ideal customer, with a lead-capture download. Bought twice")}
    {case(2, f'<img src="{A["logo_elevenlabs"]}" alt="ElevenLabs" style="max-height:52px;max-width:180px;border-radius:5px">', "ElevenLabs", "Launch of Creative Studio and increase product signups", "10 bespoke LinkedIn Carousels, 2 campaigns",
      "2,640 downloads", "Explainer carousels for the highest-intent segments, distributed through our placements and the AI Library, across two campaigns. Bought twice")}
    {case(3, f'<img src="{A["logo_guidde"]}" alt="Guidde" style="max-height:52px;max-width:180px;border-radius:5px">', "Guidde", "Brand awareness and full-funnel growth", "21 Email Primary Ad placements",
      "5,131 unique ad clicks", "Recurring monthly placements aligned to Guidde's product moments. Bought 21 times")}
    {case(4, f'<img src="{A["logo_outskill"]}" alt="Outskill" style="max-height:52px;max-width:180px;border-radius:5px">', "Outskill", "Brand awareness, webinar and course promotion", "25 Email Primary Ad placements",
      "7,318 unique ad clicks", "Webinar pushes, course promotions and launch windows aligned to Outskill's calendar. Bought 25 times")}
    {case(5, '<div style="font-size:24px;font-weight:700;letter-spacing:-.02em">Luma AI</div>', "Luma AI", "Drive trial signups for Luma's AI image and video tools", "10 bespoke LinkedIn Carousels, 2 campaigns",
      "2,944 downloads", "Explainer carousels for marketing, brand and creative teams evaluating Luma's image and video tools, across two campaigns. Bought twice")}
  </div>
  <div data-step="4" style="margin-top:20px;font-size:19px;font-weight:300;color:var(--muted)">Every client above rebooked at least once - full numbers and methodology in the case-studies deck, on request</div>
  {FOOT}
</section>'''

# ── 13 Team + contact ───────────────────────────────────────────────────────
S[14] = f'''<!-- 14 {'─'*73} -->
<section class="slide light" data-label="Meet the team"
  data-notes="Bio is the kit's, in shorter sentences. The $0 to $16M ARR fintech stat and the LinkedIn profile link were restored from legacy materials at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md. 'Teaches AI and monetization at Cozora Academy' replaces the vaguer 'university level' phrasing, matching the canonical bio already in 01_brand_positioning.md and sales_agent_training_data.json. Contact links from the brand skill's key-links table. Media kit URL cntral.ai/media-kit; storefront cntral.ai/storefront.">
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
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">This kit</span><br><b>cntral.ai/media-kit</b></div>
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">Connect with Alex</span><br><b>linkedin.com/in/alex-ai</b></div>
      </div>
    </div>
  </div>
  {FOOT}
</section>'''

out = head + "\n\n".join(renumber(S[i], i) for i in sorted(S)) + "\n\n" + tail
(B / "mk.template.html").write_text(out)
print("media kit template:", len(S), "slides")
