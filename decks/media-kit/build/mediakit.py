"""AI Central - Partnership & Media Kit, Q3 2026. Advertiser-facing deck.

Sources: Official_Media_Kit_Q3_2026 (docx, 18 Aug 2026 metrics), Sales
Playbook v3 / 02_products_pricing.md (rate card), live beehiiv publication
stats (2 Sep 2026), quiz-DB audience sample (charts shared with the strategic
deck). Every number is logged in MEDIA-KIT-SOURCES.md.
"""
import json, pathlib, re, sys

B = pathlib.Path("/home/claude/build")
sys.path.insert(0, str(B))
from deck_shared import FOOT, label, bullets, usecase, make_renumber, GOOD, BAD, logo_grid, page_nav, PALETTE

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
<section class="slide dark" data-label="Cover" style="background:#333333"
  data-notes="Advertiser-facing. No financials, no valuation, no investor framing anywhere in this deck.
  8 Sep 2026, per Alex: background changed to #333333 (jet_black, the brand kit's own value - matches PALETTE['jet_black'] in deck_shared.py) instead of the deck's default dark-slide ink (#141414). Scoped to this slide's own inline style rather than the shared --ink token, which also drives the Closing slide (bookend, same treatment applied there directly), badges and the contact box on Meet the team - none of those were mentioned, so left on the original ink.
  8 Sep 2026, per Alex (follow-up): dropped the 'Q3 2026 · AI Central Media' subline under the PARTNERSHIP & MEDIA KIT kicker per his request.">
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:64px">
    <img src="{A['logo_aicentral']}" alt="AI Central" style="width:760px;max-width:70%;height:auto">
    <div class="kicker" style="font-size:30px;letter-spacing:.34em;text-align:center">PARTNERSHIP &amp; MEDIA KIT</div>
  </div>
  {FOOT}
</section>'''

# ── 02 About ────────────────────────────────────────────────────────────────
S[2] = f'''<!-- 02 {'─'*73} -->
<section class="slide light" data-label="About AI Central Media"
  data-notes="Positioning statement is the brand skill's canonical line. '100+ companies' is backed by 104 distinct advertisers in the beehiiv ad export plus the direct clients in the invoice book; the Q3 docx said 75+, which undercounts. The brand started in 2023 (LinkedIn page May 2023, beehiiv Nov 2023); the docx said 2024, which is the company registration year - we say 2023 for the brand.
  7 Sep 2026, per Alex: 2nd stat card text reordered to lead with reach ('Reaching readers in 151 countries and all 50 US states, across 7 channels') rather than lead with the channel count. Added a 3rd logo row (Guidde, a second Taplio mark, plus WISPR Flow/SynthFlow AI/Lindy AI placeholders) - those three placeholders now render as a real (generated) image rather than plain text, per Alex's follow-up ask to be able to click and replace them himself in edit mode; see logo_tile() in deck_shared.py.
  7 Sep 2026, later: added a Jobstream placeholder tile too (16th logo) - Alex asked slide 13 to use 'the same logo we used in the second page' for Jobstream among others, but Jobstream had never actually been on this slide, so there was no shared asset to point to. Added it here as a placeholder (same click-to-upload mechanism), and slide 13's Jobstream card links here now like the rest. Grid switched from 5 cols x 3 rows to 4 cols x 4 rows for 16 items - stays an even grid rather than a lone tile on its own row.
  8 Sep 2026, per Alex: Jobstream's placeholder replaced with the real logo file he sent (added to mk3-assets.json as logo_jobstream, used on this slide and slide 13 both). Separately, he flagged the WISPR Flow/SynthFlow AI/Lindy AI logos he'd uploaded himself as rendering wrong (SynthFlow oversized, WISPR Flow and Lindy showing a black background) - real bug in logo_tile()'s placeholder branch: it filled the tile edge-to-edge (width/height:100%, object-fit:cover) on a dark background, which looked fine for the placeholder SVG itself but meant any real logo swapped in via edit mode inherited that same oversized/cropped/dark-background treatment. Fixed to use the same contained, white-card styling as every other logo - see logo_tile() in deck_shared.py. This didn't touch the placeholder SVG generator itself, so it doesn't disturb the edit-ids of logos Alex has already uploaded.
  8 Sep 2026, follow-up, per Alex: SynthFlow AI and Jobstream flagged again as too small relative to the other tiles at the standard 80/56 contain box. Added a per-tile scale override (logo_grid()'s items can now take a 4th tuple element). First tried (94, 74) - barely changed anything, because both logos are wide/landscape wordmarks and this grid's tiles are short (h=58px): object-fit:contain is bottlenecked by max-height long before it reaches max-width on a wide image in a short box, so raising max-width alone did almost nothing. Raised max-height to 90 instead - (94, 90) - which is the dimension that actually mattered.">
  <div class="kicker">ABOUT AI CENTRAL MEDIA</div>
  <h2>We turn attention into pipeline for AI and SaaS brands</h2>
  <p class="subline">Imagine Bloomberg Businessweek, but for AI - that's the brand we're building. Our flagship publication, AI Central, covers practical AI for senior professionals, and we pair premium placements with editorial-grade creative that speaks to senior operators</p>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:24px">
    <div style="background:var(--tint);padding:18px 22px"><div class="stat" style="font-size:46px">100+</div><div class="stat-l" style="font-size:19px;margin-top:6px">AI companies, SaaS platforms, education brands and growth teams have advertised with us since 2023</div></div>
    <div style="background:var(--tint);padding:18px 22px"><div class="stat" style="font-size:46px">7</div><div class="stat-l" style="font-size:19px;margin-top:6px">Reaching readers in 151 countries and all 50 US states, across 7 channels</div></div>
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
      (A.get('logo_luma_ai'), "Luma AI"),
      (A.get('grid_hubspot'), "HubSpot"),
      (A.get('grid_uxpilot'), "UX Pilot"),
      (A.get('logo_outskill'), "Outskill"),
      (A.get('logo_guidde'), "Guidde"),
      (None, "WISPR Flow"),
      (None, "SynthFlow AI", False, (94, 90)),
      (A.get('grid_taplio'), "Taplio"),
      (None, "Lindy AI"),
      (A.get('logo_jobstream'), "Jobstream", False, (94, 90)),
    ], cols=4, h=58, gap=10)}</div>
  </div>
  {FOOT}
</section>'''

# ── 03 Why companies choose us ──────────────────────────────────────────────
S[3] = f'''<!-- 03 {'─'*73} -->
<section class="slide light" data-label="Why companies choose us"
  data-notes="Three campaign types, straight from the Q3 kit. Map a prospect to one of these on the first call, then pick the format on slides 8-14. 6 Sep 2026, per Alex: box titles enlarged, and a fourth box (Bespoke training) added - AI Central runs hands-on training sessions alongside its media placements; bullets describe the offering qualitatively since no pricing/volume figures for this line exist in any sourced material yet.">
  <div class="kicker">WHY COMPANIES CHOOSE AI CENTRAL</div>
  <h2>Three kinds of campaign we run</h2>
  <p class="subline">Senior operators and decision makers, actively building with AI. Tell us the goal and we pick the mix.</p>
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
  data-notes="Restored from the Q2 2026 Figma pitch deck at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md. The direct comparison to a solo creator is the clearest 'why us' angle across every source in the pack. Column headers enlarged and colored per the deck's own GOOD/BAD semantic roles (red = bad, green = good), 6 Sep 2026 per Alex.
  7 Sep 2026, per Alex: titles enlarged again (34px -> 40px). He flagged the green (GOOD = asparagus #62A758) as 'not the green from my palette'.
  8 Sep 2026, per Alex (follow-up): background stays #EBF4E8 (unchanged, not the part he meant) - the header text and checkmarks move to PALETTE['viridian'] (#2D8879), a different green already in the documented brand palette.">
  <div class="kicker">WHY AI CENTRAL</div>
  <h2>Peace of mind, every campaign</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:30px">
    <div style="background:#F8ECEC;padding:28px 32px;min-height:640px;display:flex;flex-direction:column">
      <div style="font-size:40px;font-weight:700;color:{BAD}">Working with a solo creator</div>
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
      <div style="font-size:40px;font-weight:700;color:{PALETTE['viridian']}">Working with AI Central</div>
      <div style="margin-top:14px;flex:1;display:flex;flex-direction:column;justify-content:center">{"".join(
        f'<div style="display:flex;gap:12px;padding:18px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="font-size:18px;font-weight:700;color:{PALETTE["viridian"]};flex:none">✓</div>'
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
  data-notes="Reach: 300K+ is subscribers across the three publications (181K LinkedIn newsletter + 97.7K beehiiv + 44K Substack); 613K is accounts reached a month (Buffer + beehiiv + LinkedIn impressions, Aug 2026). Both true, different definitions - say which one you mean. Seniority, industries and geography are measured on the quiz database sample (1,985 / 2,278 / 4,714 respondents) and applied to the full audience, per Alex. The old '40% Founders, C-level and Execs' line is NOT supported by the data (13.9% founder + C-suite; 29.6% VP and above; 50.5% manager and above) - do not use it. 'LinkedIn is the main source of decision-makers' is the kit's claim; in the last 4 weeks beehiiv's top acquisition sources were Netline and Refind, so we say organic on LinkedIn, not 'majority organic' overall.
  8 Sep 2026, per Alex: the map sat at max-width:860px inside a much wider (1092px) grid column, left-aligned by default - leaving a ~230px gap of whitespace on the right that Alex flagged. Wrapped the whole 'Where they are' block (label, map, legend, caption) in a flex container with justify-content:flex-end so it right-aligns as one unit, closing the gap on the left instead.
  8 Sep 2026, per Alex (follow-up): the right column (map + legend + caption) sat noticeably lower than the left column's industry breakdown, since the row's align-items:start top-anchored both columns regardless of their own heights. Switched to align-items:end so both columns bottom-align instead - the map block shifted up to meet the breakdown percentages.
  8 Sep 2026, per Alex (second follow-up): that bottom-alignment fix pushed the "Where they are" label out of line with "Who they are" at the top instead - the two column titles are the more important alignment, so switched back to align-items:start. Top labels now match; the map's own bottom no longer lines up with the breakdown's, which is the accepted trade-off of the two columns being different heights.">
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
    <div data-step="3" style="display:flex;justify-content:flex-end">
      <div style="max-width:860px;width:100%">
        {label("Where they are")}
        <div style="margin-top:10px">__CHART_MAP__</div>
        <div style="display:flex;gap:18px;margin-top:8px;font-size:17px;color:var(--muted);flex-wrap:wrap">
          <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#046BB1;vertical-align:-1px"></i> North America 50%</span>
          <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#3B4C99;vertical-align:-1px"></i> Europe 13% + UK 6%</span>
          <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#38A7AD;vertical-align:-1px"></i> Asia 14%</span>
          <span><i style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#E3DFD7;vertical-align:-1px"></i> Rest 17%</span>
        </div>
        <div style="margin-top:8px;font-size:18px;font-weight:300;line-height:1.4;color:var(--muted)">LinkedIn is our main source of decision makers, and most of that audience found us organically</div>
      </div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 05 The publications ─────────────────────────────────────────────────────
def pub(n_, logo, name, sub, ideal, stats, logo_fit="cover"):
    rows = "".join(
        f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="font-size:19px;font-weight:300;color:#3A3A3A">{k}</div>'
        f'<div style="font-size:23px;font-weight:700;font-variant-numeric:tabular-nums">{v}</div></div>' for k, v in stats)
    logo_box = (
        f'<div style="width:40px;height:40px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center">'
        f'<img src="{logo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:8px"></div>'
        if logo_fit == "contain" else
        f'<img src="{logo}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover">')
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:24px 26px;min-height:480px;display:flex;flex-direction:column">
      <div style="display:flex;align-items:flex-start;gap:14px">
        {logo_box}
        <div style="min-height:80px"><div style="font-size:23px;font-weight:700;letter-spacing:-.01em;line-height:1.25">{name}</div><div style="margin-top:3px;font-size:16px;color:var(--muted)">{sub}</div></div>
      </div>
      <div style="margin-top:14px">{rows}</div>
      <div style="margin-top:auto;padding-top:14px;font-size:19px;font-weight:400;line-height:1.3;color:var(--ink)">Clients buy this for <b>{ideal}</b></div>
    </div>'''

S[6] = f'''<!-- 06 {'─'*73} -->
<section class="slide light" data-label="The publications"
  data-notes="Reordered and renamed per Alex, 4 Sep 2026: beehiiv leads, the two LinkedIn surfaces named as distinct AI Central properties rather than 'LinkedIn Newsletter'/'LinkedIn Company Page'. Figures unchanged from the Q3 kit / beehiiv API - LinkedIn newsletter and company page figures are from the Q3 kit, sourced from Favikon on 18 Aug 2026 - not independently verifiable here. beehiiv figures are LIVE from the beehiiv API on 2 Sep 2026: 97,681 active subscribers, 29.7% open rate and 2.34% click rate over the last 4 weeks, +4,906 new subscribers in the same window. The docx said 86K subscribers / 30.25% / 2.48% - the 86K was average sends, not active subscribers. Alex asked to connect LinkedIn for a live data pull instead of the Favikon snapshot - flagged back to him, no LinkedIn integration available in this session.
  6 Sep 2026, per Alex: reordered again (beehiiv, LinkedIn Newsletter, LinkedIn Company Page); 'Average unique ad clicks' dropped from beehiiv (the other two never carried it, so it wasn't a fair three-way comparison); 'Ideal for' renamed 'Clients buy this for' and moved to the bottom of the card, larger; 'Posts a week' added for beehiiv and the LinkedIn Newsletter (4x, per Alex - both are the weekly-cadence AI Central sends) alongside the Company Page's existing Daily; a fourth box added below for thecentral.ai itself, reusing the already-sourced 20,000-visits/month figure quoted on slides 7 and 11. 7 Sep 2026: that fourth box moved from a dark/ink background to the same tint grey as the other three, per Alex.
  7 Sep 2026, per Alex: restructured into exactly 4 equal-height boxes in one row - AI Central Newsletter (thecentral.ai), AI Central Newsletter (LinkedIn), Social Media (LinkedIn), Website - the naming he wants carried everywhere else in the deck. The per-card 'Source: ...' caption was dropped (per Alex, 'remove source') - sourcing for these figures stays logged in MEDIA-KIT-SOURCES.md instead of on the slide itself.
  8 Sep 2026, per Alex: the Website card's icon was the full wide wordmark (logo_aicentral, 1200x286) squeezed into a square slot, letterboxed and off-balance next to the other publications' actual square/circular logos. The mark's own left-hand icon block is a perfect 286x286 square within that same file, so cropped it out as a new asset (logo_aicentral_square) instead of distorting or re-deriving one - used here and on slide 7's matching Website channel tag.
  8 Sep 2026, per Alex (follow-up): two fixes. (1) Boxes 3 and 4 (Social Media, Website) had single-line titles while boxes 1 and 2 wrap to two lines, so the header row's align-items:center vertically centered each logo against ITS OWN title height, pushing box 3/4's logos and second lines up out of line with 1/2's. Switched to align-items:flex-start and gave every title a min-height (58px, enough for two lines) so all four logos and stat-row starting points now share one baseline regardless of title length. (2) The Website icon's logo_fit='contain' branch inset the square logo_aicentral_square asset at 78%/60% inside its white tile, leaving a visible white margin the other three logos don't have - since the asset is already a clean square with no need to protect an aspect ratio, switched it to fill the tile edge to edge like the other three (width/height:100%, object-fit:cover) instead.
  8 Sep 2026, per Alex (second follow-up): the min-height fix above put the reserved space in the wrong place - it sat on the title itself, so on the two single-line cards (3/4) their sub-line (URL) floated in the empty space below the title instead of sitting right under it, leaving a much bigger gap than on the two-line cards. Moved the min-height (80px) onto the wrapper around BOTH the title and sub-line together, so the sub-line always sits directly under its own title with no forced gap - any leftover reserved space now falls after the sub-line, invisibly, instead of between the two.">
  <div class="kicker">THE PUBLICATIONS</div>
  <h2>Four channels, one senior audience</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:34px">
    {pub(1, A['logo_beehiiv'], "AI Central Newsletter (thecentral.ai)", "via beehiiv", "mobile-first offers: downloads, webinar signups", [
      ("Active subscribers", "97K+"), ("New subscribers a month", "+4,900"),
      ("Average open rate", "30%"), ("Average unique CTR", "2.3%"), ("Posts a week", "4x")])}
    {pub(2, A['logo_linkedin'], "AI Central Newsletter (LinkedIn)", "AI Central, on LinkedIn", "desktop-first offers: demos, extensions, announcements", [
      ("Active subscribers", "181K+"), ("New subscribers a month", "+5,500"),
      ("Average unique CTR", "2.7%"), ("Posts a week", "4x")])}
    {pub(3, A['logo_linkedin'], "Social Media (LinkedIn)", "linkedin.com/company/chat-gpt-central", "sustained brand visibility and thought leadership, not single placements", [
      ("Active followers", "289K"), ("New followers a month", "+8,300"),
      ("Average impressions per post", "4,500+"), ("Posts a week", "Daily")])}
    {pub(4, A['logo_aicentral_square'], "Website", "thecentral.ai", "continuous presence between and beyond campaigns", [
      ("Visitors a month", "20,000")], logo_fit="contain")}
  </div>
  {FOOT}
</section>'''

# ── 06 Advertising options ──────────────────────────────────────────────────
CH_BEEHIIV = [(A['logo_beehiiv'], "AI Central Newsletter (thecentral.ai)")]
CH_LI_NEWS = [(A['logo_linkedin'], "AI Central Newsletter (LinkedIn)")]
CH_LI_PAGE = [(A['logo_linkedin'], "Social Media (LinkedIn)")]
CH_WEBSITE = [(A['logo_aicentral_square'], "Website")]
CH_BOTH_NEWS = CH_BEEHIIV + CH_LI_NEWS

def fmt(n_, name, what, ideal, channels):
    # 8 Sep 2026, per Alex: the Website tag's icon (logo_aicentral_square)
    # left a visible white margin at the standard 85%-contain inset - it's
    # already a clean square asset with no aspect ratio to protect, so it
    # fills its tile edge to edge instead, same fix as the pub() cards on
    # slide 6 just above.
    avail = "".join(
        f'<div style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--muted)">'
        f'<div style="width:16px;height:16px;border-radius:3px;background:#fff;flex:none;display:flex;align-items:center;justify-content:center">'
        f'<img src="{src}" alt="" style="{"width:100%;height:100%;object-fit:cover;border-radius:3px" if src == A["logo_aicentral_square"] else "max-width:85%;max-height:85%;object-fit:contain"}"></div>{ch}</div>'
        for src, ch in channels)
    return f'''<div style="background:var(--tint);padding:18px 22px;display:flex;flex-direction:column">
      <div style="font-size:15px;font-weight:700;letter-spacing:.16em;color:var(--muted)">0{n_}</div>
      <div style="margin-top:4px;font-size:23px;font-weight:700;letter-spacing:-.01em">{name}</div>
      <div style="margin-top:6px;font-size:18px;font-weight:300;line-height:1.35;color:#3A3A3A">{what}</div>
      <div style="margin-top:8px;font-size:17px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
      <div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--hair)">
        <span style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Available on</span>
        <div style="margin-top:6px;display:flex;flex-direction:column;gap:5px">{avail}</div>
      </div>
    </div>'''

S[7] = f'''<!-- 07 {'─'*73} -->
<section class="slide light" data-label="Advertising options"
  data-notes="Rebuilt per Alex, 7 Sep 2026, into the seven boxes he specified directly (numbered list in his comment): Newsletter Main Ad and Newsletter Secondary Ad each now cover BOTH the beehiiv and LinkedIn newsletters as one box, rather than being split into separate LinkedIn/Email formats as before; the ebook and carousel are merged into one box; Dedicated Issue, Welcome Sequence and Website Banner carry over; Social Media Post is new. Alex's own list gave explicit 'Price: On request' for boxes 01-03 and left 04-07 without a price line - since every box on this slide has always shown a price/label at the bottom as part of the card design, the same 'On request' was kept for 04-07 too rather than leaving those four cards visually unfinished; flag if that reads wrong and any of them should carry a real number instead. Availability rows match his channel lists exactly. Box 07's description is a first draft - Alex left [Description] blank for it, so this is Claude's best guess at the offer (a dedicated LinkedIn company-page post) pending his actual copy.
  7 Sep 2026, per Alex: 'Available on' tags now stack vertically instead of running inline, and the channel names are renamed to match slide 6 - 'Beehiiv Newsletter' -> 'AI Central Newsletter (thecentral.ai)', 'LinkedIn Newsletter' -> 'AI Central Newsletter (LinkedIn)'. Also renamed 'LinkedIn Company Page' -> 'Social Media (LinkedIn)' and 'thecentral.ai website' -> 'Website' for the same consistency, even though only the first two were named explicitly in his comment.
  7 Sep 2026, later, per Alex: removed the 'On request' price line from every box - these are pure format/availability cards now, no price signal at all.">
  <div class="kicker">ADVERTISING OPTIONS</div>
  <h2>Seven ways to reach them</h2>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:30px">
    {fmt(1, "Newsletter Main Ad", "Top placement in the newsletter, on both surfaces. One partner per issue", "mobile and desktop offers: downloads, webinars, demos, extensions", CH_BOTH_NEWS)}
    {fmt(2, "Newsletter Secondary Ad", "Mid-issue placement, below the main editorial, on both surfaces", "always-on awareness at a lower entry point", CH_BOTH_NEWS)}
    {fmt(3, "Bespoke Ebook or LinkedIn Carousel", "A co-branded PDF or interactive flipbook, made by our team, published in the feed and the newsletter", "education-led demand and building credibility", CH_BOTH_NEWS)}
    {fmt(4, "Dedicated Issue", "The whole send is yours. Written by our editors in the AI Central voice", "major launches and high-ticket offers", CH_BOTH_NEWS)}
  </div>
  <div data-step="2" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px">
    {fmt(5, "Welcome Sequence", "A dedicated email to every new subscriber for 3 months", "predictable, compounding lead flow", CH_BEEHIIV)}
    {fmt(6, "Website Banner", "Always-on banner on thecentral.ai, 20,000 visits a month", "continuous visibility between campaigns", CH_WEBSITE)}
    {fmt(7, "Social Media Post", "A dedicated post on our LinkedIn company page, in the AI Central voice, tagging your brand", "sustained brand visibility and thought leadership", CH_LI_PAGE)}
  </div>
  {FOOT}
</section>'''

def no_price_slide(data_label, kicker, title, subline, sections, image_src, image_alt, data_notes,
                    image_style="max-width:100%;max-height:620px;border-radius:6px"):
    """sections: list of (heading, items) tuples, stacked top to bottom on the
    left. Right side is the example image alone - per Alex, 7 Sep 2026:
    left column text, right column image, not image-under-text."""
    left = "".join(
        f'<div style="margin-top:{0 if idx == 0 else 22}px">{label(heading)}'
        f'<div style="margin-top:8px">{bullets(items, 18, 6)}</div></div>'
        for idx, (heading, items) in enumerate(sections))
    return f'''<!-- 00 {'─'*73} -->
<section class="slide light" data-label="{data_label}" data-notes="{data_notes}">
  <div class="kicker">{kicker}</div>
  <h2>{title}</h2>
  <p class="subline" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{subline}</p>
  <div style="display:grid;grid-template-columns:1.15fr 1fr;gap:44px;margin-top:20px;align-items:center">
    <div data-step="1">{left}</div>
    <div data-step="2" style="text-align:center">
      <img src="{image_src}" alt="{image_alt}" style="{image_style}">
    </div>
  </div>
  {FOOT}
</section>'''

# ── 07 LinkedIn Carousel ────────────────────────────────────────────────────
# HIDDEN per Alex, 7 Sep 2026 ("let's hide this one for now while we close
# the non-price one") - kept here, out of the S[] sequence, so it isn't lost
# and can go straight back in once the no-price version is settled.
_HIDDEN_SLIDE_BESPOKE_EBOOK_PRICED = f'''<!-- 08 {'─'*73} -->
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
S[8] = no_price_slide(
  "Bespoke Ebook", "ADVERTISING OPTIONS · FORMAT DETAIL", "Bespoke Ebook",
  "Scroll-stopping storytelling, designed by our team and published in the feed",
  [("What you receive", [
      "Up to 15 pages, delivered as both a PDF and an interactive flipbook",
      "Your link on every page",
      "A dedicated send to our full list",
      "Distribution across our social media channels"]),
   ("Benefits", [
      "A lifetime asset: stays live and discoverable long after the campaign ends",
      "Full republishing rights - reuse it on your own channels",
      "5% off any new order",
      "Positions you as the go-to resource for the topic, not just another ad"]),
   ("Examples", [
      '<a href="https://docs.thecentral.ai/10-design-prompts-you-must-try" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">10 Design Prompts You Can Try Today</a> - Gamma',
      '<a href="https://docs.thecentral.ai/elevenlabs-best-way-to-dub-video" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">The Best Way To Dub Videos, Full Guide</a> - ElevenLabs',
      '<a href="https://docs.thecentral.ai/how-to-build-ios-apps-with-replit" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">How to Build iOS Apps with Replit</a> - Replit',
      '<a href="https://docs.thecentral.ai/jobstream-creator-income-playbook" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">The Creator Income Playbook</a> - Jobstream'])],
  A['carousels'], "Ebook examples for Gamma, ElevenLabs, Canva, Guidde and Comet",
  "No-price version of the ebook slide (the priced version is hidden for now, per Alex). 7 Sep 2026, per Alex: subtitle shortened to one line; what-you-receive and benefits were saying the same things (lifetime asset, republishing rights showed up in both) so they're split for real now - deliverables in one, outcomes in the other, plus a new third 'Examples' section. '5% off any new order' and 'a dedicated send' are new claims from Alex's comment, not yet cross-checked against 02_products_pricing.md - flag if that discount rate or deliverable isn't accurate.\n  7 Sep 2026, per Alex: the four Examples are now real, linked documents pulled from the Notion 'AI Central Document Database' - rows where Main is set and Flipbook URL starts with docs.thecentral.ai (31 qualify in total; these 4 were picked to show a spread of different clients rather than listing all 31). The earlier four titles here were invented placeholders, not real documents - replaced.\n  8 Sep 2026, per Alex: data-label (drives the top-nav breadcrumb on this and the neighboring slides) shortened from 'Bespoke Ebook - no price' to just 'Bespoke Ebook' - the on-slide title never carried that suffix, only the internal nav label did, and Alex doesn't want 'no price' visible anywhere on the page.")

# ── 08 LinkedIn Main Ad ─────────────────────────────────────────────────────
# HIDDEN per Alex, 7 Sep 2026 - see the same note on the ebook slide above.
_HIDDEN_SLIDE_LINKEDIN_MAIN_AD_PRICED = f'''<!-- 09 {'─'*73} -->
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
S[9] = f'''<!-- 09 {'─'*73} -->
<section class="slide light" data-label="Main Ad"
  data-notes="7 Sep 2026, per Alex: slides 9 and 10 (LinkedIn Main Ad, Email newsletter ads) merged into one - both are the same top-of-issue 'main ad' format, just on two different surfaces, so having them as two separate format-detail slides was redundant (slide 7's own 'Newsletter Main Ad' box already treats them as one format available on both). What-you-receive/Benefits are unified into one list covering both channels, with each channel's own distinguishing point kept rather than erased. Both example images now sit side by side, beehiiv (HubSpot) first then LinkedIn (UX Pilot), per Alex's explicit order. This merge drops the deck from 15 to 14 slides - see the compaction step at the bottom of this file.">
  <div class="kicker">ADVERTISING OPTIONS · FORMAT DETAIL</div>
  <h2>Main Ad</h2>
  <p class="subline">Top-of-issue placement, on beehiiv, LinkedIn, or both</p>
  <div style="display:grid;grid-template-columns:1fr 0.82fr 0.82fr;gap:28px;margin-top:22px;align-items:start">
    <div data-step="1">
      {label("What you receive")}
      <div style="margin-top:8px">{bullets([
        "Your logo at the top of the newsletter",
        "Custom headline up to 10 words, copy up to 60 words",
        "Large HD creative",
        "A dedicated call to action with a tracked link, plus pixel ID for retargeting on LinkedIn"], 17, 6)}</div>
      <div style="margin-top:14px">{label("Benefits")}</div>
      <div style="margin-top:8px">{bullets([
        "Placed inside a publication readers already trust and open",
        "Full look-through analytics of openers and clickers, for retargeting",
        "On beehiiv: reaches 97K+ subscribers and compounds with every issue",
        "On LinkedIn: team engagement helps the post travel further, plus lifetime SEO value on linkedin.com's own domain"], 17, 6)}</div>
    </div>
    <div data-step="2" style="text-align:center">
      <img src="{A['shot_hubspot']}" alt="Example: HubSpot co-branded issue" style="max-width:100%;max-height:520px;border-radius:6px;border:1px solid var(--hair)">
      <div style="margin-top:6px;font-size:15px;color:var(--muted)">Example: HubSpot (beehiiv)</div>
    </div>
    <div data-step="2" style="text-align:center">
      <img src="{A['shot_li_ad']}" alt="Example: UX Pilot main ad in the LinkedIn newsletter" style="max-width:100%;max-height:520px;border-radius:6px;border:1px solid var(--hair)">
      <div style="margin-top:6px;font-size:15px;color:var(--muted)">Example: UX Pilot (LinkedIn)</div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 09 Email ads (beehiiv) ──────────────────────────────────────────────────
# HIDDEN per Alex, 7 Sep 2026 - see the same note on the ebook slide above.
_HIDDEN_SLIDE_EMAIL_ADS_PRICED = f'''<!-- 10 {'─'*73} -->
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

# Email newsletter ads' own no-price slide (was S[10]) removed 7 Sep 2026,
# per Alex - merged into S[9] "Main Ad" above, since it was the same
# top-of-issue format as the LinkedIn Main Ad slide, just on a different
# surface. See S[9]'s data-notes.

# ── 10 Premium formats ──────────────────────────────────────────────────────
def premium(n_, name, what, ideal):
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:26px 28px;min-height:600px;display:flex;flex-direction:column">
      <div style="font-size:25px;font-weight:700;letter-spacing:-.01em">{name}</div>
      <div style="margin-top:8px;min-height:48px;font-size:16px;font-weight:300;line-height:1.35;color:var(--muted)">Ideal for {ideal}</div>
      <div style="margin-top:16px;flex:1;display:flex;flex-direction:column;justify-content:flex-start">{bullets(what, 18, 18)}</div>
    </div>'''

S[11] = f'''<!-- 11 {'─'*73} -->
<section class="slide light" data-label="Premium formats"
  data-notes="Wireframe renders removed, 'ideal for' moved up under the title, boxes made full-height with bullets spaced out, per Alex 4 Sep 2026. The three formats without a list price. Quote per campaign; the pricing reference frames dedicated issues and multi-touch bundles at $5K to $10K+.
  7 Sep 2026: the 'website banner description is wrong' half of Alex's comment turned out to be a data bug, not a content one - two stray Supabase overrides from an unrelated migration were clobbering this slide's live text at load time; fixed by deleting the bad override rows, no source change needed. The title itself Alex clarified separately: these are 'further premium editorial products we can develop', not framed as a fallback for when one placement isn't enough - retitled accordingly, then retitled again per Alex's own preferred wording: 'On-demand premium formats'.
  7 Sep 2026, later: the three cards' 'Ideal for ...' line wraps to a different number of lines per card, and the bullets below were vertically centered in the remaining space rather than pinned to a fixed offset - the same divider-misalignment bug fixed on slide 3's usecase cards. Fixed the same way: fixed-height 'Ideal for' slot, bullets top-aligned instead of centered.">
  <div class="kicker">PREMIUM FORMATS · QUOTED PER CAMPAIGN</div>
  <h2>On-demand premium formats</h2>
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
# Light-to-solid azul ramp, 7 Sep 2026 per Alex ("circles in scale of colors
# from light blue to solid blue") - 6 steps interpolated from a pale tint of
# the brand accent up to the accent itself (var(--accent) = #046BB1), so step
# 6 still reads as the same blue used everywhere else in the deck. The first
# three get dark text (the tints are too light for white to sit on).
STEP_BG = ["#CFE6F5", "#A6CDE7", "#7EB5DA", "#559CCC", "#2D84BF", "#046BB1"]
STEP_FG = ["var(--ink)", "var(--ink)", "var(--ink)", "#fff", "#fff", "#fff"]

def step(idx, n_, title, body):
    return f'''<div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px">
      <div style="width:72px;height:72px;border-radius:50%;background:{STEP_BG[idx]};color:{STEP_FG[idx]};display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;flex:none">{n_}</div>
      <div style="margin-top:20px;font-size:26px;font-weight:700">{title}</div>
      <div style="margin-top:8px;font-size:19px;font-weight:300;line-height:1.4;color:var(--muted)">{body}</div>
    </div>'''

S[12] = f'''<!-- 12 {'─'*73} -->
<section class="slide light" data-label="How it works"
  data-notes="Redrawn as a single left-to-right transit line (station stops connected by one line), per Alex 4 Sep 2026 - matches the brand's 'central station' identity concept. Title simplified to 'How it works'. Guaranteed results policy box and the discount lines (10% new clients, 10% new main ad orders) removed per Alex; the custom-bundles line survives on its own since it isn't a discount. Six steps restored from the Q2 2026 Figma pitch deck at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md.
  6 Sep 2026, per Alex: the grey 'custom bundles' box removed; the diagram enlarged (circles, titles and body copy all bigger) and centered vertically in the space between the title and the footer, rather than pinned to a fixed margin under the title.
  7 Sep 2026, per Alex: circles now run light blue to solid blue left to right, instead of one flat accent color on all six.
  7 Sep 2026, later, per Alex: kicker renamed 'Our process' (h2 stays 'How it works').">
  <div class="kicker">OUR PROCESS</div>
  <h2>How it works</h2>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
    <div style="position:relative">
      <div style="position:absolute;top:36px;left:36px;right:36px;height:2px;background:var(--hair)"></div>
      <div style="position:relative;display:flex;justify-content:space-between">
        {step(0, "1", "Brief", "We agree the goal, the content angle, the target reader, and the date")}
        {step(1, "2", "Create", "Our team writes and designs the placement. You approve it before it goes out")}
        {step(2, "3", "Publish", "We publish across the agreed channels: email, LinkedIn newsletter, feed, website")}
        {step(3, "4", "Check in", "A mid-campaign call to review performance so far and adjust if needed")}
        {step(4, "5", "Report", "You get a performance report: impressions, clicks, downloads, signups")}
        {step(5, "6", "Plan the next one", "We bring follow-up campaign ideas based on what worked")}
      </div>
    </div>
  </div>
  {FOOT}
</section>'''

# ── 13 Some of our past campaigns ────────────────────────────────────────────
def campaign_card(src, name, objective, package, result, body, placeholder=False, link_to=None):
    logo = (f'<img src="{src}" alt="{name}" style="max-height:32px;max-width:160px;object-fit:contain">'
            if src else f'<div style="font-size:17px;font-weight:700;letter-spacing:-.01em">{name}</div>')
    if link_to:
        logo = f'<a href="#{link_to}" style="display:inline-flex;line-height:0;color:inherit;text-decoration:none">{logo}</a>'
    border = "border:2px dashed #C9C4BA" if placeholder else "border:1px solid var(--hair)"
    ink = "var(--muted)" if placeholder else "#3A3A3A"
    result_color = "var(--muted)" if placeholder else "var(--accent)"
    style = "font-style:italic" if placeholder else ""
    return f'''<div style="flex:0 0 calc(25% - 15px);background:var(--tint);{border};padding:16px 18px;display:flex;flex-direction:column">
      <div style="height:32px;display:flex;align-items:center">{logo}</div>
      <div style="margin-top:9px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Objective</div>
      <div style="font-size:14px;line-height:1.3;color:{ink};{style}">{objective}</div>
      <div style="margin-top:6px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Package</div>
      <div style="font-size:14px;line-height:1.3;color:{ink};{style}">{package}</div>
      <div style="margin-top:8px;font-size:23px;font-weight:700;line-height:1;color:{result_color};{style}">{result}</div>
      <div style="margin-top:6px;font-size:13px;line-height:1.3;color:{ink};{style}">{body}</div>
    </div>'''

S[13] = f'''<!-- 13 {'─'*73} -->
<section class="slide light" data-label="Some of our past campaigns"
  data-notes="Retitled from 'Case studies', 6 Sep 2026 per Alex. Rebuilt again 7 Sep 2026 per Alex: (a) logos now use the EXACT same asset keys as slide 2's grid - this fixes a real bug, Luma AI was rendering as a text placeholder here even though a real Luma icon already exists and is used on slide 2 (see the 8 Sep follow-up note below - that icon was later upgraded from a bare glyph to the real wordmark, logo_luma_ai); (b) the per-client text (objective/package/result/body) is back, for pagination. Gamma, ElevenLabs, Guidde, Outskill and Luma AI keep their real, sourced figures (CASE-STUDIES-SOURCES.md, unchanged from the original 5-tile version of this slide). HubSpot, Notion, Jobstream, Replit, UX Pilot and SciSpace have no sourced campaign figures anywhere in this deck's records, so per Alex's own instruction ('typeset some lorem ipsum and i'll fill it up myself') those cards carry placeholder lorem ipsum text, marked with a dashed border and muted italic type so they read as unfinished rather than as real numbers.
  7 Sep 2026, follow-up: Replit and UX Pilot added as two more placeholder cards per Alex ('go with the other comments' - confirming the two follow-up questions left on this slide's old flagged comments). Both reuse the same logo assets already used on slide 2 (grid_replit, grid_uxpilot). SciSpace added the same way but has no logo asset anywhere in the deck's bundle, so it's a text placeholder like Jobstream.
  7 Sep 2026, later: HubSpot and Jobstream filled in with real copy Alex supplied directly (his own words, lightly fitted to the card's objective/package/result/body shape, not rewritten) - no longer lorem ipsum. Jobstream's name and existence as a real client is now confirmed by this (it was flagged earlier as possibly misremembered); it still has no logo file, so it stays a text-name card.
  7 Sep 2026, later still, per Alex: Notion, Replit, UX Pilot and SciSpace placeholder cards removed - back to the 7 clients with real figures or real copy (Gamma, ElevenLabs, Guidde, Outskill, Luma AI, HubSpot, Jobstream). Cards resized up now that there's more room (padding, logo size and all type sizes increased). Also per Alex ('link the logos ... to the cover one'): all 7 logos now link to slide 2 ('#2'), where each partner's logo lives in the main showcase grid - Jobstream got a placeholder tile added there (see slide 2's data-notes) specifically so this link would land on something real.
  7 Sep 2026, even later, per Alex: HubSpot moved to the first card. Grid switched from a 4-column CSS grid to a centered flex-wrap layout, so the uneven last row (3 of 7 cards) centers itself instead of leaving empty space on the right - 'paginate better ... fit the whole page'.
  8 Sep 2026, per Alex: Jobstream's card finally has a real logo (his file, added as logo_jobstream) instead of a text-name card - matches every other card now.
  8 Sep 2026, per Alex (follow-up): 'use the same logo from page 2' for Luma AI - this card already pointed at the same asset KEY as slide 2 (grid_luma), but that key is a bare abstract diamond glyph with no wordmark, since that's all Alex had originally provided; he separately uploaded a real 'Luma AI' wordmark onto slide 2's tile via edit mode, which only patches that one element at runtime and was never reflected here. Pulled his uploaded image back out of Supabase, verified it byte-for-byte (md5 + length match against the stored row), and baked it into mk3-assets.json as a new logo_luma_ai asset - now the actual default for both slide 2's grid and this card, rather than depending on a live-only override slide 12 never had.">
  <div class="kicker">PAST CAMPAIGNS</div>
  <h2>Some of our past campaigns</h2>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;margin-top:26px">
    {campaign_card(A.get('grid_hubspot'), "HubSpot",
      "Sustained demand generation for HubSpot's free AI offers", "129 email placements across 88 sends",
      "14,683 clicks", "Seven months of unbroken presence in the daily send, averaging 167 clicks per issue. Renewed every week since January.", link_to=2)}
    {campaign_card(A.get('logo_gamma'), "Gamma",
      "Launch of Gamma AI Agent and increase signups", "11 bespoke LinkedIn Carousels, 2 campaigns",
      "3,823 downloads", "Eleven bespoke carousels across two campaigns, targeting Gamma's ideal customer, with a lead-capture download. Bought twice", link_to=2)}
    {campaign_card(A.get('logo_elevenlabs'), "ElevenLabs",
      "Launch of Creative Studio and increase product signups", "10 bespoke LinkedIn Carousels, 2 campaigns",
      "2,640 downloads", "Explainer carousels for the highest-intent segments, distributed through our placements and the AI Library. Bought twice", link_to=2)}
    {campaign_card(A.get('logo_guidde'), "Guidde",
      "Brand awareness and full-funnel growth", "21 Email Primary Ad placements",
      "5,131 unique clicks", "Recurring monthly placements aligned to Guidde's product moments. Bought 21 times", link_to=2)}
    {campaign_card(A.get('logo_outskill'), "Outskill",
      "Brand awareness, webinar and course promotion", "25 Email Primary Ad placements",
      "7,318 unique clicks", "Webinar pushes, course promotions and launch windows aligned to Outskill's calendar. Bought 25 times", link_to=2)}
    {campaign_card(A.get('logo_luma_ai'), "Luma AI",
      "Drive trial signups for Luma's AI image and video tools", "10 bespoke LinkedIn Carousels, 2 campaigns",
      "2,944 downloads", "Explainer carousels for teams evaluating Luma's image and video tools, across two campaigns. Bought twice", link_to=2)}
    {campaign_card(A.get('logo_jobstream'), "Jobstream",
      "Brand awareness for Jobstream's job board launch, driving downloads on two proprietary whitepapers",
      "2 bespoke whitepapers, a conference one-pager, a dedicated website section with branded job board, across 2 dedicated newsletter issues",
      "65,453 views", "Two whitepapers built around Katie Fortunato's own POV and Jobstream's proprietary data, driving 330 whitepaper downloads and 4,579 views on a dedicated website section that outperformed initial projections - 3m 30s average dwell time, 3.5x the site average.", link_to=2)}
  </div>
  {FOOT}
</section>'''

# ── 13 Team + contact ───────────────────────────────────────────────────────
S[14] = f'''<!-- 14 {'─'*73} -->
<section class="slide light" data-label="Meet the team"
  data-notes="Bio is the kit's, in shorter sentences. The $0 to $16M ARR fintech stat and the LinkedIn profile link were restored from legacy materials at Alex's confirmation, 2 Sep 2026 - see 10_legacy_materials_audit.md. 'Teaches AI and monetization at Cozora Academy' replaces the vaguer 'university level' phrasing, matching the canonical bio already in 01_brand_positioning.md and sales_agent_training_data.json. Contact links from the brand skill's key-links table. Media kit URL cntral.ai/media-kit; storefront cntral.ai/storefront.
  6 Sep 2026, per Alex: 'Advertise now' and 'This kit' rows removed from the contact block.
  7 Sep 2026: press-delegate and affiliations logos enlarged (h 60 -> 90, then 90 -> 112) per Alex, asked twice. Separately: Alex reported his own uploaded logo replacements for this row had been lost - true, and specific to how edit mode used to compute an edit's id (by slide position, which a rebuild that adds/removes slides shifts). That's fixed now (see decks/_shared/_tail.html - ids are content-hashed, not positional) and his 7 real uploaded images (4 press-delegate, 3 affiliations logos) were recovered from Supabase under their old ids and re-saved against the new ones this same rebuild generates, so they should reappear once this deploys rather than needing to be re-uploaded.
  7 Sep 2026, per Alex: the three Let's talk rows are now real anchor tags (tel/mailto/https), not styled text - Book a call links to cntral.ai/meet, Email opens a mailto: to collabs@thecentral.ai, Connect with Alex opens the LinkedIn profile, all in a new tab except the mailto.">
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
        <div><span style="color:var(--muted-dark)">Book a call</span><br><a href="https://cntral.ai/meet" target="_blank" rel="noopener" style="color:var(--paper);font-weight:700;text-decoration:none">cntral.ai/meet</a></div>
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">Email</span><br><a href="mailto:collabs@thecentral.ai" style="color:var(--paper);font-weight:700;text-decoration:none">collabs@thecentral.ai</a></div>
        <div style="margin-top:12px"><span style="color:var(--muted-dark)">Connect with Alex</span><br><a href="https://linkedin.com/in/alex-ai" target="_blank" rel="noopener" style="color:var(--paper);font-weight:700;text-decoration:none">linkedin.com/in/alex-ai</a></div>
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
    ], cols=5, h=112, gap=14)}</div>
  </div>
  <div data-step="3" style="margin-top:12px">
    {label("Affiliations", "var(--muted)", 15)}
    <div style="margin-top:8px">{logo_grid([
      (A.get('aff_collective'), "The AI Collective"),
      (A.get('aff_gta'), "Global Tech Advocates"),
      (A.get('aff_tla'), "London Tech Advocates"),
      (A.get('aff_cozora'), "Cozora", True),
    ], cols=4, h=112, gap=14)}</div>
  </div>
  {FOOT}
</section>'''

# ── 15 Closing ──────────────────────────────────────────────────────────────
S[15] = f'''<!-- 15 {'─'*73} -->
<section class="slide dark" data-label="Closing" style="background:#333333"
  data-notes="Bookends the cover: same mark, no title, so the deck opens and closes on the wordmark alone.
  8 Sep 2026: background changed to #333333 to match the Cover's own change, per Alex - see slide 1's data-notes.">
  <div style="flex:1;display:flex;align-items:center;justify-content:center">
    <img src="{A['logo_aicentral']}" alt="AI Central" style="width:760px;max-width:70%;height:auto">
  </div>
  {FOOT}
</section>'''

# ── top page nav ─────────────────────────────────────────────────────────
# Injected after renumbering, since it needs every slide's own data-label
# up front rather than one slide at a time (unlike FOOT/renumber). See
# page_nav() in deck_shared.py.
def _label_of(sec):
    m = re.search(r'data-label="([^"]*)"', sec)
    return m.group(1) if m else ''

def _end_of_open_tag(sec):
    """Index just after the '>' that closes the leading <section ...> tag.
    Scans quote-aware: data-notes frequently contains a literal '>' as an
    arrow (e.g. "Beehiiv Newsletter > AI Central Newsletter"), and a plain
    `sec.index('>')` or `<section[^>]*>` regex stops at that arrow instead
    of the tag's real end, splicing whatever gets inserted into the middle
    of the attribute string."""
    i = sec.index('<section')
    quote = None
    while i < len(sec):
        c = sec[i]
        if quote:
            if c == quote:
                quote = None
        elif c in '"\'':
            quote = c
        elif c == '>':
            return i + 1
        i += 1
    raise ValueError("unterminated <section> tag")

# Compact any gaps left by a merged/removed slide (e.g. S[10] folded into
# S[9], 7 Sep 2026) so page numbers stay sequential - a bare `sorted(S)`
# would otherwise jump straight from 9 to 11.
S = {new_n: S[old_n] for new_n, old_n in enumerate(sorted(S), start=1)}

ns = sorted(S)
numbered = {i: renumber(S[i], i) for i in ns}
# 8 Sep 2026, per Alex: the cover's footer briefly had its page number
# stripped ("01" read as redundant on a title slide), then restored the
# same day at his follow-up request - footer now matches every other
# slide (label left, page number right), no special-casing needed here.
labels = {i: _label_of(numbered[i]) for i in ns}
navved = {}
for idx, i in enumerate(ns):
    prev_i = ns[idx - 1] if idx > 0 else None
    next_i = ns[idx + 1] if idx < len(ns) - 1 else None
    nav = page_nav(prev_i, labels.get(prev_i, ''), labels[i], next_i, labels.get(next_i, ''))
    if i == 1:
        # 8 Sep 2026, per Alex: drop the "COVER" current-page pill from
        # the title slide's own top nav - it read as clutter on a slide
        # with no real "previous" to navigate from anyway. The "About AI
        # Central Media >" link on the right stays.
        nav = re.sub(r'<div class="pn-current">.*?</div>', '', nav, count=1)
    pos = _end_of_open_tag(numbered[i])
    navved[i] = numbered[i][:pos] + nav + numbered[i][pos:]

out = head + "\n\n".join(navved[i] for i in ns) + "\n\n" + tail
(B / "mk.template.html").write_text(out)
print("media kit template:", len(S), "slides")
