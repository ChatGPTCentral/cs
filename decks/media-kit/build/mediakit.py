"""AI Central - Partnership & Media Kit, Q3 2026. Advertiser-facing deck.

Sources: Official_Media_Kit_Q3_2026 (docx, 18 Aug 2026 metrics), Sales
Playbook v3 / 02_products_pricing.md (rate card), live beehiiv publication
stats (2 Sep 2026), quiz-DB audience sample (charts shared with the strategic
deck). Every number is logged in MEDIA-KIT-SOURCES.md.
"""
import json, pathlib, re, sys

B = pathlib.Path("/home/claude/build")
sys.path.insert(0, str(B))
from deck_shared import FOOT, label, bullets, usecase, make_renumber, GOOD, BAD, logo_grid

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

renumber = make_renumber("MEDIA KIT 2026")

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
    <div style="margin-top:10px">{logo_grid([
      (A.get('logo_gamma'), "Gamma"),
      (A.get('grid_notion'), "Notion"),
      (A.get('logo_elevenlabs'), "ElevenLabs"),
      (A.get('grid_replit'), "Replit"),
      (A.get('grid_taplio_plain'), "Taplio"),
      (A.get('grid_typeless'), "Typeless"),
      (A.get('grid_luma'), "Luma AI"),
      (A.get('grid_hubspot'), "HubSpot"),
      (A.get('grid_uxpilot'), "UX Pilot"),
      (A.get('logo_outskill'), "Outskill"),
    ], cols=5, h=90)}</div>
  </div>
  {FOOT}
</section>'''

# ── 03 Why companies choose us ──────────────────────────────────────────────
S[3] = f'''<!-- 03 {'─'*73} -->
<section class="slide light" data-label="Why companies choose us"
  data-notes="Three campaign types, straight from the Q3 kit. Map a prospect to one of these on the first call, then pick the format on slides 8-14. 6 Sep 2026, per Alex: box titles enlarged, and a fourth box (Bespoke training) added - AI Central runs hands-on training sessions alongside its media placements; bullets describe the offering qualitatively since no pricing/volume figures for this line exist in any sourced material yet.">
  <div class="kicker">WHY COMPANIES CHOOSE AI CENTRAL</div>
  <h2>Three kinds of campaign we run</h2>
  <p class="subline">Senior operators and decision makers, actively building with AI. Tell us the goal and we pick the mix</p>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:30px">
    {usecase(1, "Lead generation", "We convert attention into qualified opportunities", [
      "Increase free trial or product signups", "Drive webinar registrations",
      "Promote lead magnets: whitepapers, reports, books", "Generate demo bookings for SaaS platforms"], title_size=32)}
    {usecase(2, "Revenue acceleration", "We execute high-urgency growth pushes", [
      "Promote paid courses and certification programmes", "Drive ticket sales for conferences and events",
      "Launch lifetime deals", "Distribute limited-time discount codes"], title_size=32)}
    {usecase(3, "Brand authority", "We position your brand as the category leader", [
      "Announce funding rounds", "Share strategic partnerships",
      "Launch new products", "Introduce major features or platform upgrades"], title_size=32)}
    {usecase(4, "Bespoke training", "We teach your team to actually use AI, not just talk about it", [
      "Live workshops built around your own tools and workflows",
      "Delivered by AI Central's own editorial and research team",
      "From a single half-day session to an ongoing programme",
      "Practical and tool-specific, not a generic AI 101"], title_size=32)}
  </div>
  {FOOT}
</section>'''

# ── 04 Peace of mind ────────────────────────────────────────────────────────
S[4] = f'''<!-- 04 {'─'*73} -->
<section class="slide light" data-label="Peace of mind, every campaign"
  data-notes="Restored from the Q2 2026 Figma pitch deck at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md. The direct comparison to a solo creator is the clearest 'why us' angle across every source in the pack. Column headers enlarged and colored per the deck's own GOOD/BAD semantic roles (red = bad, green = good), 6 Sep 2026 per Alex.">
  <div class="kicker">WHY AI CENTRAL</div>
  <h2>Peace of mind, every campaign</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:30px">
    <div style="background:#F8ECEC;padding:28px 32px;min-height:640px;display:flex;flex-direction:column">
      <div style="font-size:34px;font-weight:700;color:{BAD}">Working with a solo creator</div>
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
      <div style="font-size:34px;font-weight:700;color:{GOOD}">Working with AI Central</div>
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
      <div style="margin-top:10px;max-width:860px">__CHART_MAP__</div>
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
      <div style="margin-top:14px">{rows}</div>
      <div style="margin-top:auto;padding-top:14px;font-size:20px;font-weight:400;line-height:1.3;color:var(--ink)">Clients buy this for <b>{ideal}</b></div>
      <div style="margin-top:8px;font-size:16px;font-weight:300;color:var(--muted)">{foot}</div>
    </div>'''

S[6] = f'''<!-- 06 {'─'*73} -->
<section class="slide light" data-label="The publications"
  data-notes="Reordered and renamed per Alex, 4 Sep 2026: beehiiv leads, the two LinkedIn surfaces named as distinct AI Central properties rather than 'LinkedIn Newsletter'/'LinkedIn Company Page'. Figures unchanged from the Q3 kit / beehiiv API - LinkedIn newsletter and company page figures are from the Q3 kit, sourced from Favikon on 18 Aug 2026 - not independently verifiable here. beehiiv figures are LIVE from the beehiiv API on 2 Sep 2026: 97,681 active subscribers, 29.7% open rate and 2.34% click rate over the last 4 weeks, +4,906 new subscribers in the same window. The docx said 86K subscribers / 30.25% / 2.48% - the 86K was average sends, not active subscribers. Alex asked to connect LinkedIn for a live data pull instead of the Favikon snapshot - flagged back to him, no LinkedIn integration available in this session.
  6 Sep 2026, per Alex: reordered again (beehiiv, LinkedIn Newsletter, LinkedIn Company Page); 'Average unique ad clicks' dropped from beehiiv (the other two never carried it, so it wasn't a fair three-way comparison); 'Ideal for' renamed 'Clients buy this for' and moved to the bottom of the card, larger; 'Posts a week' added for beehiiv and the LinkedIn Newsletter (4x, per Alex - both are the weekly-cadence AI Central sends) alongside the Company Page's existing Daily; a fourth box added below for thecentral.ai itself, reusing the already-sourced 20,000-visits/month figure quoted on slides 7 and 11.">
  <div class="kicker">THE PUBLICATIONS</div>
  <h2>Three publications, one senior audience</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:34px">
    {pub(1, A['logo_beehiiv'], "AI Central Newsletter", "on thecentral.ai, via beehiiv", "mobile-first offers: downloads, webinar signups", [
      ("Active subscribers", "97K+"), ("New subscribers a month", "+4,900"),
      ("Average open rate", "30%"), ("Average unique CTR", "2.3%"), ("Posts a week", "4x")],
      "Source: beehiiv, last 4 weeks to 2 Sep 2026")}
    {pub(2, A['logo_linkedin'], "AI Central's LinkedIn Newsletter", "AI Central, on LinkedIn", "desktop-first offers: demos, extensions, announcements", [
      ("Active subscribers", "181K+"), ("New subscribers a month", "+5,500"),
      ("Average unique CTR", "2.7%"), ("Posts a week", "4x")],
      "Source: Favikon, 18 Aug 2026")}
    {pub(3, A['logo_linkedin'], "AI Central's LinkedIn Company Page", "linkedin.com/company/chat-gpt-central", "sustained brand visibility and thought leadership, not single placements", [
      ("Active followers", "289K"), ("New followers a month", "+8,300"),
      ("Average impressions per post", "4,500+"), ("Posts a week", "Daily")],
      "Source: Favikon, 18 Aug 2026")}
  </div>
  <div data-step="4" style="margin-top:22px;background:var(--ink);padding:22px 28px;display:flex;align-items:center;justify-content:space-between">
    <div style="font-size:24px;font-weight:700;color:var(--paper)">AI Central Website <span style="font-weight:300;color:var(--muted-dark)">· thecentral.ai</span></div>
    <div style="font-size:22px;font-weight:700;color:var(--accent)">20,000 visitors a month</div>
  </div>
  {FOOT}
</section>'''

# ── 06 Advertising options ──────────────────────────────────────────────────
CH_LINKEDIN = [(A['logo_linkedin'], "LinkedIn")]
CH_NEWSLETTER = [(A['logo_beehiiv'], "Newsletter")]
CH_WEBSITE = [(A['logo_aicentral'], "Website")]

def fmt(n_, name, what, ideal, price, channels):
    avail = "".join(
        f'<span style="display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:500;color:var(--muted)">'
        f'<img src="{src}" alt="" style="width:16px;height:16px;border-radius:3px;object-fit:cover">{ch}</span>'
        for src, ch in channels)
    return f'''<div style="background:var(--tint);padding:18px 22px;display:flex;flex-direction:column">
      <div style="font-size:15px;font-weight:700;letter-spacing:.16em;color:var(--muted)">0{n_}</div>
      <div style="margin-top:4px;font-size:23px;font-weight:700;letter-spacing:-.01em">{name}</div>
      <div style="margin-top:6px;font-size:18px;font-weight:300;line-height:1.35;color:#3A3A3A">{what}</div>
      <div style="margin-top:8px;font-size:17px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
      <div style="margin-top:auto;padding-top:12px;display:flex;gap:14px;flex-wrap:wrap;border-top:1px solid var(--hair);padding-top:10px">
        <span style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Available on</span>{avail}
      </div>
      <div style="margin-top:10px;font-size:19px;font-weight:700;color:var(--accent)">{price}</div>
    </div>'''

S[7] = f'''<!-- 07 {'─'*73} -->
<section class="slide light" data-label="Advertising options"
  data-notes="Seven formats (Tools Ad removed per Alex, 6 Sep 2026 - the kit's own docx never gave it a list price either). The first three carry a public rate card (slides 8-13, now interleaved with no-price versions of each - see those slides). The other four are quoted per campaign. Each box carries an 'Available on' row per Alex, 6 Sep 2026: welcome sequence and both ads are newsletter-only (not possible on either LinkedIn surface); the carousel/ebook and main ad are LinkedIn-only; the website banner is website-only - these are hard platform constraints, not marketing copy.">
  <div class="kicker">ADVERTISING OPTIONS</div>
  <h2>Seven ways to reach them</h2>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:30px">
    {fmt(1, "LinkedIn Carousel", "A co-branded PDF of up to 15 slides, made by our team, published in the feed", "education-led demand and building credibility", "From $699", CH_LINKEDIN)}
    {fmt(2, "LinkedIn Main Ad", "Top placement in the LinkedIn newsletter. One partner per issue", "desktop offers: demos, extensions", "From $899", CH_LINKEDIN)}
    {fmt(3, "Email Primary Ad", "Top placement in the email newsletter. One partner per issue", "mobile offers: downloads, webinars", "From $1,299", CH_NEWSLETTER)}
    {fmt(4, "Email Secondary Ad", "Mid-issue placement, below the main editorial", "always-on awareness at a lower entry point", "On request", CH_NEWSLETTER)}
  </div>
  <div data-step="2" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px">
    {fmt(5, "Dedicated Issue", "The whole send is yours. Written by our editors in the AI Central voice", "major launches and high-ticket offers", "On request", CH_NEWSLETTER)}
    {fmt(6, "Welcome Sequence", "A dedicated email to every new subscriber for 3 months", "predictable, compounding lead flow", "On request", CH_NEWSLETTER)}
    {fmt(7, "Website Banner", "Always-on banner on thecentral.ai, 20,000 visits a month", "continuous visibility between campaigns", "On request", CH_WEBSITE)}
  </div>
  {FOOT}
</section>'''

def no_price_slide(data_label, kicker, title, subline, receive_items, image_src, image_alt, benefits_items, data_notes,
                    image_style="width:100%;border-radius:6px"):
    return f'''<!-- 00 {'─'*73} -->
<section class="slide light" data-label="{data_label}" data-notes="{data_notes}">
  <div class="kicker">{kicker}</div>
  <h2>{title}</h2>
  <p class="subline">{subline}</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:44px;margin-top:24px;align-items:start">
    <div data-step="1">
      {label("What you receive")}
      <div style="margin-top:8px">{bullets(receive_items, 19, 6)}</div>
      <div style="margin-top:16px;text-align:center"><img src="{image_src}" alt="{image_alt}" style="{image_style}"></div>
    </div>
    <div data-step="2">
      {label("Benefits")}
      <div style="margin-top:8px">{bullets(benefits_items, 19, 8)}</div>
    </div>
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

# ── 08b Bespoke Ebook, no-price version ─────────────────────────────────────
S[9] = no_price_slide(
  "Bespoke Ebook — no price", "ADVERTISING OPTIONS · 1/3 · FORMAT DETAIL", "Bespoke Ebook",
  "Scroll-stopping, educational storytelling in the feed. Our team writes and designs it, you approve it, we publish it",
  ["Up to 15 slides, co-branded, designed by our in-house team",
   "Your link on every slide: 15 to 20 calls to action",
   "A lifetime spot in the AI Library, 2,000+ views a month",
   "Full republishing rights, plus 10% off any new main ad order",
   "A performance report after publication"],
  A['carousels'], "Ebook examples for Gamma, ElevenLabs, Canva, Guidde and Comet",
  ["Scroll-stopping storytelling that builds credibility, not just clicks",
   "A lifetime asset: stays live in the AI Library long after the campaign ends",
   "Positions you as the go-to resource for the topic, not just another ad",
   "Full republishing rights - reuse it on your own channels"],
  "No-price version of slide 8, added per Alex 6 Sep 2026: same what-you-receive list and example image, plus a new benefits block, no rate card. For sharing the format itself without quoting a number.")

# ── 08 LinkedIn Main Ad ─────────────────────────────────────────────────────
S[10] = f'''<!-- 09 {'─'*73} -->
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

# ── 09b LinkedIn Main Ad, no-price version ──────────────────────────────────
S[11] = no_price_slide(
  "LinkedIn Main Ad — no price", "ADVERTISING OPTIONS · 2/3 · FORMAT DETAIL", "LinkedIn Main Ad",
  "Premium placement at the top of our LinkedIn newsletter. Limited to one partner per issue. Sent as an email and posted in the feed",
  ["Your logo at the top of the newsletter",
   "Custom headline up to 10 words, copy up to 60 words",
   "Large HD creative, 1920 x 1080",
   "A dedicated call to action with a tracked link and pixel ID for retargeting",
   "Your team can comment and engage, which helps the post travel",
   "Lifetime SEO value: LinkedIn newsletters rank on linkedin.com's domain"],
  A['shot_li_ad'], "Example: UX Pilot main ad in the LinkedIn newsletter",
  ["Team engagement helps the post travel further in the feed",
   "Lifetime SEO value - LinkedIn newsletters rank on linkedin.com's own domain",
   "Pixel-based retargeting turns viewers into a warm audience for later campaigns",
   "One placement, two surfaces: sent as an email and posted in the feed"],
  "No-price version of slide 10, added per Alex 6 Sep 2026: same what-you-receive list and example image, plus a new benefits block, no rate card.",
  image_style="max-height:270px;width:auto;max-width:100%;border-radius:6px;border:1px solid var(--hair)")

# ── 09 Email ads (beehiiv) ──────────────────────────────────────────────────
S[12] = f'''<!-- 10 {'─'*73} -->
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

# ── 10b Email newsletter ads, no-price version ──────────────────────────────
S[13] = no_price_slide(
  "Email newsletter ads — no price", "ADVERTISING OPTIONS · 3/3 · FORMAT DETAIL", "Email newsletter ads",
  "Two placements in every issue. Sent to 97K+ subscribers and published on thecentral.ai",
  ["Top-of-issue placement above all editorial, or a mid-issue placement between editorial blocks",
   "Logo, custom headline and copy, HD creative, one call to action",
   "Sent to 97K+ subscribers and published on thecentral.ai",
   "Full look-through analytics of openers and clickers"],
  A['shot_hubspot'], "Example: HubSpot co-branded issue",
  ["Placed inside a publication readers already trust and open",
   "Full look-through analytics of openers and clickers, for retargeting",
   "Reaches a senior, high-intent inbox, not a cold list",
   "Compounds with every issue as recurring placements build recognition"],
  "No-price version of slide 12, added per Alex 6 Sep 2026: what-you-receive summarizes both placements, plus a new benefits block, no rate card.",
  image_style="max-height:390px;width:auto;max-width:100%;border-radius:6px;border:1px solid var(--hair)")

# ── 10 Premium formats ──────────────────────────────────────────────────────
def premium(n_, name, what, ideal):
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:26px 28px;min-height:600px;display:flex;flex-direction:column">
      <div style="font-size:25px;font-weight:700;letter-spacing:-.01em">{name}</div>
      <div style="margin-top:8px;font-size:16px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
      <div style="margin-top:16px;flex:1;display:flex;flex-direction:column;justify-content:center">{bullets(what, 18, 18)}</div>
    </div>'''

S[14] = f'''<!-- 11 {'─'*73} -->
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
      <div style="width:72px;height:72px;border-radius:50%;background:var(--accent);color:var(--paper);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;flex:none">{n_}</div>
      <div style="margin-top:20px;font-size:26px;font-weight:700">{title}</div>
      <div style="margin-top:8px;font-size:19px;font-weight:300;line-height:1.4;color:var(--muted)">{body}</div>
    </div>'''

S[15] = f'''<!-- 12 {'─'*73} -->
<section class="slide light" data-label="How it works"
  data-notes="Redrawn as a single left-to-right transit line (station stops connected by one line), per Alex 4 Sep 2026 - matches the brand's 'central station' identity concept. Title simplified to 'How it works'. Guaranteed results policy box and the discount lines (10% new clients, 10% new main ad orders) removed per Alex; the custom-bundles line survives on its own since it isn't a discount. Six steps restored from the Q2 2026 Figma pitch deck at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md.
  6 Sep 2026, per Alex: the grey 'custom bundles' box removed; the diagram enlarged (circles, titles and body copy all bigger) and centered vertically in the space between the title and the footer, rather than pinned to a fixed margin under the title.">
  <div class="kicker">HOW IT WORKS</div>
  <h2>How it works</h2>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
    <div style="position:relative">
      <div style="position:absolute;top:36px;left:36px;right:36px;height:2px;background:var(--hair)"></div>
      <div style="position:relative;display:flex;justify-content:space-between">
        {step("1", "Brief", "We agree the goal, the content angle, the target reader, and the date")}
        {step("2", "Create", "Our team writes and designs the placement. You approve it before it goes out")}
        {step("3", "Publish", "We publish across the agreed channels: email, LinkedIn newsletter, feed, website")}
        {step("4", "Check in", "A mid-campaign call to review performance so far and adjust if needed")}
        {step("5", "Report", "You get a performance report: impressions, clicks, downloads, signups")}
        {step("6", "Plan the next one", "We bring follow-up campaign ideas based on what worked")}
      </div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 13 Some of our past campaigns ────────────────────────────────────────────
def campaign_tile(src, name):
    if src:
        inner = f'<img src="{src}" alt="{name}" style="max-width:72%;max-height:56%;object-fit:contain">'
        bg = "#fff"
    else:
        inner = f'<div style="color:#fff;font-size:16px;font-weight:700;letter-spacing:.02em;text-align:center;padding:0 14px">{name}</div>'
        bg = "#141414"
    return (f'<div style="background:{bg};height:170px;border-radius:8px;border:1px solid var(--hair);'
            f'display:flex;align-items:center;justify-content:center">{inner}</div>')

S[16] = f'''<!-- 13 {'─'*73} -->
<section class="slide light" data-label="Some of our past campaigns"
  data-notes="Retitled from 'Case studies' and rebuilt as a 4x2 logo grid per Alex, 6 Sep 2026, who asked to include most of the companies shown at the start of the kit (slide 2), specifically naming HubSpot, Notion and Jobstream. HubSpot and Notion reuse the same logo assets already used on slide 2. 'Jobstream' has no logo asset anywhere in this deck's bundle and doesn't match any client name in CASE-STUDIES-SOURCES.md or the beehiiv/LinkedIn campaign records checked for the case-studies deck - it renders here as a placeholder pending the logo file and a spelling check (could be a misremembered name). The detailed measured figures this slide used to show (downloads, ad clicks, objective/package per client) are dropped in this uniform-grid format, per Alex's explicit '4 col x 2 rows squares' request - those numbers are still real and sourced (CASE-STUDIES-SOURCES.md), just not displayed here since three of the eight logos have no comparable figures on file and a mixed detailed/logo-only grid would misrepresent the ones that do.">
  <div class="kicker">PAST CAMPAIGNS</div>
  <h2>Some of our past campaigns</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:34px">
    {campaign_tile(A.get('logo_gamma'), "Gamma")}
    {campaign_tile(A.get('logo_elevenlabs'), "ElevenLabs")}
    {campaign_tile(A.get('logo_guidde'), "Guidde")}
    {campaign_tile(A.get('logo_outskill'), "Outskill")}
    {campaign_tile(None, "Luma AI")}
    {campaign_tile(A.get('grid_hubspot'), "HubSpot")}
    {campaign_tile(A.get('grid_notion'), "Notion")}
    {campaign_tile(None, "Jobstream")}
  </div>
  <div data-step="2" style="margin-top:22px;font-size:19px;font-weight:300;color:var(--muted)">All logos are real advertising and campaign clients. Full case metrics and methodology are in the case-studies deck, on request</div>
  {FOOT}
</section>'''

# ── 13 Team + contact ───────────────────────────────────────────────────────
S[17] = f'''<!-- 14 {'─'*73} -->
<section class="slide light" data-label="Meet the team"
  data-notes="Bio is the kit's, in shorter sentences. The $0 to $16M ARR fintech stat and the LinkedIn profile link were restored from legacy materials at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md. 'Teaches AI and monetization at Cozora Academy' replaces the vaguer 'university level' phrasing, matching the canonical bio already in 01_brand_positioning.md and sales_agent_training_data.json. Contact links from the brand skill's key-links table. Media kit URL cntral.ai/media-kit; storefront cntral.ai/storefront.
  6 Sep 2026, per Alex: 'Advertise now' and 'This kit' rows removed from the contact block.">
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
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">Connect with Alex</span><br><b>linkedin.com/in/alex-ai</b></div>
      </div>
    </div>
  </div>
  <div data-step="3" style="margin-top:14px">
    {label("Official press delegate at", "var(--muted)", 15)}
    <div style="margin-top:8px">{logo_grid([
      (A.get('evt_ltw'), "London Tech Week"),
      (A.get('evt_cannes'), "Cannes Lions"),
      (A.get('evt_aisummitlondon'), "The AI Summit London"),
      (A.get('evt_aisummitny'), "The AI Summit New York"),
      (A.get('evt_sxsw'), "SXSW London"),
    ], cols=5, h=60, gap=12)}</div>
  </div>
  <div data-step="3" style="margin-top:12px">
    {label("Affiliations", "var(--muted)", 15)}
    <div style="margin-top:8px">{logo_grid([
      (A.get('aff_collective'), "The AI Collective"),
      (A.get('aff_gta'), "Global Tech Advocates"),
      (A.get('aff_tla'), "London Tech Advocates"),
      (A.get('aff_cozora'), "Cozora", True),
    ], cols=4, h=60, gap=12)}</div>
  </div>
  {FOOT}
</section>'''

# ── 18 Closing ──────────────────────────────────────────────────────────────
S[18] = f'''<!-- 15 {'─'*73} -->
<section class="slide dark" data-label="Closing"
  data-notes="Bookends the cover: same mark, no title, so the deck opens and closes on the wordmark alone.">
  <div style="flex:1;display:flex;align-items:center;justify-content:center">
    <img src="{A['logo_aicentral']}" alt="AI Central" style="width:760px;max-width:70%;height:auto">
  </div>
  {FOOT}
</section>'''

out = head + "\n\n".join(renumber(S[i], i) for i in sorted(S)) + "\n\n" + tail
(B / "mk.template.html").write_text(out)
print("media kit template:", len(S), "slides")
