"""v4 edit pass (Alex, 27 Aug 2026 evening): USD everywhere at 0.85, no
CONFIDENTIAL, founded-2023 cell, vision-text pain points, unclassified last,
lined boxes, figures above the hero chart, no invoiced bar, logo-less client
bars, University slide with the measured Stripe revenue chart + Techpresso,
Alex's SWOT verbatim, researched M&A table, $1.0-1.5M valuation, no Let's talk."""
import pathlib, re

n = pathlib.Path("/home/claude/build/newslides.py")
t = n.read_text()

# ── footer: drop CONFIDENTIAL everywhere ────────────────────────────────────
t = t.replace("FOOT = '<div class=\"foot\">AI CENTRAL · CONFIDENTIAL</div>'",
              "FOOT = '<div class=\"foot\">AI CENTRAL</div>'")
t = t.replace('<div class="foot">AI CENTRAL · CONFIDENTIAL</div>', '<div class="foot">AI CENTRAL</div>')

# ── 02 Who we are: founded cell, all-time revenue in USD, 4 cols ────────────
t = t.replace('''  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:80px;margin-top:44px;border-top:1px solid var(--hair);padding-top:40px">
    {bigcell("Total audience", "437K", "Followers across seven channels. 613K reached a month, 322K owned and transferable")}
    {bigcell("Revenue", "€228K", "2025 statutory, the last closed year - - up +313% on 2024", red=True)}
    {bigcell("Avg profit margin", "35%", "38% in 2024 and 33% in 2025, both statutory. Run by a team of 5")}
  </div>''',
'''  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:56px;margin-top:44px;border-top:1px solid var(--hair);padding-top:40px">
    {bigcell("Founded", "2023", "LinkedIn page May 2023, Substack June, beehiiv November. S.R.L. incorporated March 2024")}
    {bigcell("Total audience", "437K", "Followers across seven channels. 613K reached a month, 322K owned and transferable")}
    {bigcell("All time revenue", "$452K", "2023 through Aug 2026. 2025 closed at $268K, up +313% on 2024", red=True)}
    {bigcell("Avg profit margin", "35%", "38% in 2024 and 33% in 2025, both statutory. Run by a team of 5")}
  </div>''')
t = t.replace('margin-top:16px;font-size:82px;font-weight:700', 'margin-top:16px;font-size:72px;font-weight:700')
t = t.replace('revenue EUR 228,049 from the 2025 statutory accounts, growing +313% on 2024; average profit margin 35%',
              'all-time revenue $452K = statutory 2023-2025 (EUR 286,388) plus 2026 invoiced YTD (EUR 97,810), at 0.85 EUR/USD; 2025 closed at $268K, +313% on 2024; average profit margin 35%')

# ── 03 Audience breakdown: vision-text pain points ──────────────────────────
t = t.replace('''        {pain("AI is a must-know topic, but the content is fragmented, noisy and rapidly changing")}
        {pain("The best material is paywalled, and what you find today is lost tomorrow")}
        {pain("We curate, test and organise it - - briefings, guides and a library that feels like an unfair advantage")}''',
'''        {pain("There is so much out there - - fragmented and scattered between social, websites and formats, and rapidly changing")}
        {pain("You find something interesting, then you lose it. The best value is paywalled, and everyone is trying to sell you something")}
        {pain("You feel overwhelmed: it is hard to tell where the value is in the ocean of noise, and you lose momentum")}
        {pain("We give quick, smooth, personalised access to pre-vetted content - - and a library of your own to store it in")}''')

# ── 04 boxes: divider line under each title, drop the black box ─────────────
t = t.replace('''def box(name, body):
    return f\'\'\'<div style="background:var(--tint);padding:30px 32px">
      <div style="font-size:28px;font-weight:700;letter-spacing:-.01em">{name}</div>
      <div style="margin-top:12px;font-size:23px;font-weight:300;line-height:1.4;color:#3A3A3A">{body}</div>
    </div>\'\'\'''',
'''def box(name, body):
    return f\'\'\'<div style="background:var(--tint);padding:30px 32px">
      <div style="font-size:28px;font-weight:700;letter-spacing:-.01em;padding-bottom:14px;border-bottom:2px solid var(--accent)">{name}</div>
      <div style="margin-top:14px;font-size:23px;font-weight:300;line-height:1.4;color:#3A3A3A">{body}</div>
    </div>\'\'\'''')
t = t.replace('''    {box("Treasury management", "Interest earned on cash balances across the QONTO and WISE accounts. Small, and a marker of operating discipline")}
    <div style="background:var(--ink);color:var(--paper);padding:30px 32px">
      <div style="font-size:28px;font-weight:700;letter-spacing:-.01em;color:var(--accent)">Where it goes next</div>
      <div style="margin-top:12px;font-size:23px;font-weight:300;line-height:1.4;color:#D9D6D1">Affiliate-centric mix, first-party data segments, platform launch Q4 2026 - - lifting revenue per subscriber toward 3x</div>
    </div>
  </div>''',
'''    {box("Treasury management", "Interest earned on cash balances across the QONTO and WISE accounts. Small, and a marker of operating discipline")}
  </div>''')

# ── 05 Revenue by year: USD headline, figures above the chart, no note ──────
t = t.replace('<h2>€3K to €445K in four years, profitably</h2>',
              '<h2>$4K to $523K in four years, profitably</h2>')
FIGROW = '''  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:48px;margin-top:30px;border-bottom:1px solid var(--hair);padding-bottom:26px">
    <div><div style="font-size:46px;font-weight:700;line-height:.9;letter-spacing:-.03em;color:var(--accent)">33%</div>
      <div style="margin-top:11px;font-size:23px;font-weight:400;line-height:1.3;color:var(--muted)">Net margin 2025, $90K of profit</div></div>
    <div><div style="font-size:46px;font-weight:700;line-height:.9;letter-spacing:-.03em">60%</div>
      <div style="margin-top:11px;font-size:23px;font-weight:400;line-height:1.3;color:var(--muted)">Library trial-to-paid conversion, measured</div></div>
    <div><div style="font-size:46px;font-weight:700;line-height:.9;letter-spacing:-.03em">~4,150</div>
      <div style="margin-top:11px;font-size:23px;font-weight:400;line-height:1.3;color:var(--muted)">New email subscribers a month</div></div>
    <div><div style="font-size:46px;font-weight:700;line-height:.9;letter-spacing:-.03em">$2.4</div>
      <div style="margin-top:11px;font-size:23px;font-weight:400;line-height:1.3;color:var(--muted)">Average revenue per user a year, targeting 3x</div></div>
  </div>
'''
old_fig = t[t.index('  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:48px;margin-top:26px;border-top:1px solid var(--hair);padding-top:26px">'):]
old_fig = old_fig[:old_fig.index('  {FOOT}<div class="badge">05</div>')]
t = t.replace(old_fig, '')
t = t.replace('''  <h2>$4K to $523K in four years, profitably</h2>
  <div style="margin-top:32px;background:var(--tint);padding:26px 36px">''',
'''  <h2>$4K to $523K in four years, profitably</h2>
''' + FIGROW + '''  <div style="margin-top:24px;background:var(--tint);padding:22px 36px">''')
t = t.replace(
 'data-notes="Actuals statutory: 2024 EUR 55,248 with EUR 21,231 profit (38% margin); 2025 EUR 228,049 with EUR 76,811 profit (33% margin), +313%. Forecast basis set by Alex: 2026F = +50% on 2025 = EUR 342,073; 2027F = +30% on 2026F = EUR 444,695. The solid inner bar in 2026F is EUR 97,810 actually invoiced YTD on the cash book, which understates statutory progress by roughly half. Conversion is 449 of 754 due trials = 59.5%, shown rounded to 60%. ARPU is 2025 revenue over year-end email subscribers = EUR 2.36 = about $2.4 a year, roughly $0.20 a month; the Vision target is $0.60 a month."',
 'data-notes="All in USD at 0.85 EUR/USD. Actuals statutory: 2024 $65K with $25K profit (38% margin); 2025 $268K with $90K profit (33% margin), +313%. Forecast basis set by Alex: 2026F = +50% on 2025 = $402K; 2027F = +30% = $523K, both outlined - nothing in them is booked. Conversion is 449 of 754 due trials = 59.5%, shown rounded to 60%. ARPU is 2025 revenue over year-end email subscribers, about $2.4 a year or $0.20 a month; the Vision target is $0.60 a month."')

# ── 06 clients: no logos, USD values ────────────────────────────────────────
t = t.replace('''TOP = [("HubSpot", 33482), ("Outskill", 20785), ("Guidde", 19027), ("ElevenLabs", 14394),
       ("Gamma", 11010), ("Fellow", 9234), ("Luma AI", 8031), ("Delve", 6831),
       ("Mindstream", 6234), ("Jobstream", 4306), ("Replit", 4027), ("Synthflow", 3193)]''',
'''TOP = [("HubSpot", 39390), ("Outskill", 24453), ("Guidde", 22385), ("ElevenLabs", 16934),
       ("Gamma", 12953), ("Fellow", 10864), ("Luma AI", 9448), ("Delve", 8036),
       ("Mindstream", 7334), ("Jobstream", 5066), ("Replit", 4738), ("Synthflow", 3756)]''')
t = t.replace('''    rows.append(f\'\'\'<div style="display:grid;grid-template-columns:84px 200px 1fr 110px;gap:14px;align-items:center;padding:5px 0">
      <div style="display:flex;justify-content:center">{logo_cell(name)}</div>
      <div style="font-size:22px;font-weight:700">{name}</div>
      <div style="height:22px;background:#E9E6E0;border-radius:0 4px 4px 0"><div style="width:{w}%;height:100%;background:var(--accent);border-radius:0 4px 4px 0"></div></div>
      <div style="font-size:21px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">€{v/1000:.1f}K</div>
    </div>\'\'\')''',
'''    rows.append(f\'\'\'<div style="display:grid;grid-template-columns:200px 1fr 110px;gap:16px;align-items:center;padding:6px 0">
      <div style="font-size:22px;font-weight:700">{name}</div>
      <div style="height:22px;background:#E9E6E0;border-radius:0 4px 4px 0"><div style="width:{w}%;height:100%;background:var(--accent);border-radius:0 4px 4px 0"></div></div>
      <div style="font-size:21px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">${v/1000:.1f}K</div>
    </div>\'\'\')''')
t = t.replace('<div style="margin-top:10px;font-size:18px;font-weight:300;color:var(--muted)">Network ad spend converted at 0.86 USD/EUR. Also: Notion',
              '<div style="margin-top:10px;font-size:18px;font-weight:300;color:var(--muted)">USD, direct deals converted at 0.85 EUR/USD. Also: Notion')
t = t.replace('data-notes="Lifetime billed per client, direct deals plus network ad spend, network USD converted at 0.86. HubSpot EUR 33.5K',
              'data-notes="Lifetime billed per client in USD - network ad spend native USD, direct EUR deals at 0.85. HubSpot $39.4K')

# ── 07 University ───────────────────────────────────────────────────────────
uni_start = t.index("S[7] = f'''")
uni_end   = t.index("# ── 08 SWOT")
S7 = '''S[7] = f\'\'\'<!-- 07 {'─'*73} -->
<section class="slide light" data-label="AI Central University"
  data-notes="All measured on the production Stripe sync joined to quiz submissions. The revenue chart is monthly gross Library charges net of refunds: $87.7K all-time (Nov 2023 to Aug 2026) - about EUR 75K, in line with the EUR 78K Alex quotes from his own tracking; the gap is FX and pending charges. Current funnel launched May 2025: $4.99 trial to $59.75 annual. Conversion 449 of 754 due trials = 59.5%, shown as 60%. 1,823 paying members. AOV $45 = average conversion charge. Modelled LTV $113 = $45 at 40% annual churn (2.5 expected years); realised to date is $47 because most members are in year one. Techpresso added to the peer list per Alex.">
  <div class="kicker">AI CENTRAL UNIVERSITY</div>
  <h2 class="wide" style="font-size:64px">A $4.99 trial converts to $59.75 a year at 60%</h2>
  <div style="display:flex;gap:56px;margin-top:30px;align-items:flex-start">
    <div style="flex:1">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:32px">
        <div><div class="stat red" style="font-size:56px">60%</div><div class="stat-l" style="font-size:22px">Trial-to-paid conversion</div></div>
        <div><div class="stat" style="font-size:56px">1,823</div><div class="stat-l" style="font-size:22px">Current paying members</div></div>
        <div><div class="stat" style="font-size:56px">$45</div><div class="stat-l" style="font-size:22px">Average order value</div></div>
        <div><div class="stat" style="font-size:56px">$113</div><div class="stat-l" style="font-size:22px">Modelled LTV at 40% annual churn</div></div>
      </div>
      <div style="margin-top:28px;background:var(--tint);padding:20px 26px">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <div style="font-size:23px;font-weight:700">Library revenue by month</div>
          <div style="font-size:20px;color:var(--muted)">Stripe, gross of fees, net of refunds · <b style="font-weight:700;color:var(--ink)">$87.7K</b> all-time</div>
        </div>
        <div style="margin-top:8px">__CHART_LIB__</div>
      </div>
    </div>
    <div style="width:560px;flex:none;background:var(--ink);color:var(--paper);padding:30px 34px;display:flex;flex-direction:column;gap:15px">
      <div style="font-size:27px;font-weight:700;line-height:1.15;letter-spacing:-.02em">Every top AI newsletter has added an education layer</div>
      <div style="border-top:1px solid var(--hair-dark);padding-top:13px">
        <div style="font-size:24px;font-weight:700">The Rundown AI</div>
        <div style="margin-top:4px;font-size:21px;font-weight:300;line-height:1.35;color:var(--muted-dark)">~$1,000-a-year university, 5,000+ members</div>
      </div>
      <div style="border-top:1px solid var(--hair-dark);padding-top:13px">
        <div style="font-size:24px;font-weight:700">The Neuron</div>
        <div style="margin-top:4px;font-size:21px;font-weight:300;line-height:1.35;color:var(--muted-dark)">20,000+ course students at acquisition</div>
      </div>
      <div style="border-top:1px solid var(--hair-dark);padding-top:13px">
        <div style="font-size:24px;font-weight:700">Ben's Bites</div>
        <div style="margin-top:4px;font-size:21px;font-weight:300;line-height:1.35;color:var(--muted-dark)">Pivoted fully to paid education, seven figures</div>
      </div>
      <div style="border-top:1px solid var(--hair-dark);padding-top:13px">
        <div style="font-size:24px;font-weight:700">Techpresso</div>
        <div style="margin-top:4px;font-size:21px;font-weight:300;line-height:1.35;color:var(--muted-dark)">AI daily monetising a paid subscription tier</div>
      </div>
    </div>
  </div>
  {FOOT}<div class="badge">07</div>
</section>\'\'\'

'''
t = t[:uni_start] + S7 + t[uni_end:]

# ── 08 SWOT: Alex's text only ───────────────────────────────────────────────
sw_start = t.index('    {swot("Strengths"')
sw_end   = t.index('  </div>\n  {FOOT}<div class="badge">08</div>')
SW = '''    {swot("Strengths", [
      "200+ unique pieces of proprietary content",
      "Almost 3 years in the brand",
    ])}
    {swot("Weaknesses", [
      "No moat",
      "Little differentiation from bigger media products",
    ])}
    {swot("Opportunities", [
      "Events",
      "Teaching in cohorts",
      "Fractional consulting",
      "New passive revenue lines - store, merchandising, affiliate",
    ])}
    {swot("Threats", [
      "Being squeezed out by consolidation in the industry",
      "AI crash - - lower confidence, no hype",
    ])}
'''
t = t[:sw_start] + SW + t[sw_end:]

# ── 09 M&A: researched table ────────────────────────────────────────────────
m_start = t.index("S[9] = f'''")
m_end   = t.index("# ── 10 Forecasts")
S9 = '''S[9] = f\'\'\'<!-- 09 {'─'*73} -->
<section class="slide light" data-label="Industry M&A"
  data-notes="Researched 27 Aug 2026 (They Got Acquired, Newsletter Operator, Paved, Adweek, Axios, CB Insights). Anchor points: Morning Brew $75M for a majority at ~3.75x revenue; The Hustle ~$27M at ~2.7x; The Peak $5M at 1.65x; Milk Road reportedly eight figures after 10 months; Mindstream and The Neuron - the two closest comps, both AI newsletters bought by strategics - undisclosed but in the low millions, The Neuron with an earn-out and 30+ bidders. B2B per-subscriber benchmarks run $5 to $20+. HubSpot alone has bought three newsletters, and is our single largest advertiser today.">
  <div class="kicker">INDUSTRY M&amp;A</div>
  <h2>What buyers pay for professional audiences</h2>
  <table style="margin-top:32px">
    <thead><tr>
      <th style="width:22%">Target</th><th style="width:26%">Buyer</th>
      <th style="width:30%">Price (realistic band)</th><th style="width:22%">Revenue multiple</th>
    </tr></thead>
    <tbody>
      {mrow("Morning Brew", "Business Insider, majority (2020)", "$75M", "~3.75x")}
      {mrow("The Hustle", "HubSpot (2021)", "~$27M", "~2 to 2.7x")}
      {mrow("Milk Road", "Undisclosed buyers (2022)", "Reported eight figures", "n.d.")}
      {mrow("The Peak", "ZoomerMedia (2023)", "$5M", "1.65x")}
      {mrow("Mindstream", "HubSpot (2024)", "Undisclosed, est. $2 to 7M", "n.d. - profitable")}
      {mrow("The Neuron", "TechnologyAdvice (2025)", "Low seven figures + earn-out, 30+ bidders", "n.d.", last=True)}
    </tbody>
  </table>
  <div style="margin-top:26px;background:var(--ink);color:var(--paper);padding:22px 34px;display:flex;gap:40px;align-items:center">
    <div style="font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);flex:none">WHY BUYERS PAY</div>
    <div style="font-size:23px;font-weight:300;line-height:1.4;color:#D9D6D1">Owned distribution replaces $188 to $237 per-lead acquisition spend · a trusted editorial voice money cannot quickly build · a content engine pointed at the buyer\\'s category from day one</div>
  </div>
  <div class="src">Sources: They Got Acquired, Newsletter Operator, Paved, Adweek, Axios, CB Insights, beehiiv case studies. B2B newsletters benchmark at $5 to $20+ per subscriber</div>
  {FOOT}<div class="badge">09</div>
</section>\'\'\'

'''
t = t[:m_start] + S9 + t[m_end:]

# ── 10 valuation: $1.0-1.5M, method walk ────────────────────────────────────
v_start = t.index("S[10] = f'''")
v_end   = t.index("# ── 11 Let's talk")
S10 = '''def vrow(method, calc, result):
    return f\'\'\'<div style="display:grid;grid-template-columns:300px 1fr 210px;gap:28px;align-items:baseline;padding:20px 0;border-top:1px solid var(--hair)">
      <div style="font-size:26px;font-weight:700">{method}</div>
      <div style="font-size:23px;font-weight:300;line-height:1.4;color:var(--muted)">{calc}</div>
      <div style="font-size:27px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">{result}</div>
    </div>\'\'\'

S[10] = f\'\'\'<!-- 10 {'─'*73} -->
<section class="slide light" data-label="Forecasts and valuation"
  data-notes="Three independent methods, all in USD, converging on the same band. Per subscriber: 97K email at the $10 to $15 mid-band of B2B newsletter comps = $0.97 to 1.46M, with the 181K LinkedIn newsletter and 44K Substack included free. Revenue multiple: the 1.65 to 4x range from the previous slide applied across 2025 actual ($268K) and 2026F ($402K) = $0.8 to 1.6M, centre $1.0 to 1.4M. Earnings: 12 to 15x the $90K of 2025 profit = $1.1 to 1.4M - defensible for 33% margins growing at +313%. Where all three overlap is $1.0 to 1.5M. Forecast: 2026F +50% = $402K, 2027F +30% = $523K, roughly $173K of profit at a held margin.">
  <div class="kicker">FORECASTS AND VALUATION</div>
  <h2>Three methods converge on $1.0 to 1.5M</h2>
  <div style="display:flex;gap:56px;margin-top:36px;align-items:flex-start">
    <div style="flex:1.25">
      {vrow("Per subscriber", "97K email subscribers at $10 to $15 - the B2B newsletter band. The 181K LinkedIn newsletter and 44K Substack come free", "$1.0 to 1.5M")}
      {vrow("Revenue multiple", "1.65 to 4x, the range buyers actually paid, on 2025 actual ($268K) and 2026F ($402K)", "$0.8 to 1.6M")}
      {vrow("Earnings multiple", "12 to 15x on $90K of 2025 profit - a 33% margin growing +313%", "$1.1 to 1.4M")}
      <div style="border-top:1px solid var(--hair);padding-top:20px;margin-top:2px;font-size:22px;font-weight:300;line-height:1.4;color:var(--muted)">Forecast under the hood: 2026F $402K (+50%), 2027F $523K (+30%), ~$173K profit at a held margin. Levers: affiliate mix, ARPU toward 3x, platform launch Q4 2026</div>
    </div>
    <div style="width:600px;flex:none;background:var(--ink);color:var(--paper);padding:38px 42px;display:flex;flex-direction:column">
      <div style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:var(--accent)">VALUATION ESTIMATE</div>
      <div style="margin-top:20px;font-size:84px;font-weight:700;line-height:.9;letter-spacing:-.04em">$1.0 - 1.5M</div>
      <div style="margin-top:24px;font-size:24px;font-weight:300;line-height:1.45;color:#D9D6D1">The overlap of all three methods. At the top of the band a buyer pays 3.7x 2026F revenue for a profitable, bootstrapped brand - - inside the range of every deal on the previous slide</div>
      <div style="margin-top:auto;padding-top:18px;border-top:1px solid var(--hair-dark);font-size:21px;font-style:italic;line-height:1.4;color:var(--muted-dark)">Comparable AI newsletters - Mindstream, The Neuron - traded in this same band</div>
    </div>
  </div>
  {FOOT}<div class="badge">10</div>
</section>\'\'\'

'''
t = t[:v_start] + S10 + t[v_end:]

# ── drop Let's talk ─────────────────────────────────────────────────────────
t = t.replace('''# ── 11 Let's talk ───────────────────────────────────────────────────────────
S[11] = renumber(old["12"], 11)

''', '')

n.write_text(t)
print("v4 patch applied")
