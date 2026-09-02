"""Assemble the deck - Alex's revised 11-slide investor structure (27 Aug 2026 v2).

  01 Cover                logo + "Investor deck"
  02 Who we are           bg audience curve; 3 cells (audience / revenue / avg margin);
                          bootstrapped + vision line
  03 Audience breakdown   region map + professions pie + pain points + income band
  04 How revenue is built five boxes, no percentages
  05 Revenue by year      hero chart: 2026F = +50% on 2025, 2027F = +30%;
                          figures 33% / 60% / ~4,150 / $2.4
  06 Our clients          lifetime-billed bar chart with logos + media kit screenshots
  07 AI Central University launched May 2025; 60%; 1,823 members; $45 AOV; $113 LTV
  08 SWOT                 Alex's items
  09 Industry M&A         simplified comps: target / buyer / price band / multiple,
                          with the why-buyers-pay strip (absorbs old slide 9)
  10 Forecasts + valuation
  11 Let's talk
"""
import ast, json, pathlib, re

B = pathlib.Path("/home/claude/build")
old = ast.literal_eval((B / "_old_slides.py").read_text())
head = (B / "_head.html").read_text()
tail = (B / "_tail.html").read_text()
si_logos = json.load(open(B / "logos-si.json"))
mk = json.load(open(B / "logos-mk.json"))
lifetime = json.load(open(B / "client-lifetime.json"))

FOOT = '<div class="foot">AI CENTRAL</div>'

def renumber(sec, n):
    sec = re.sub(r'<!-- \d\d ─+', f'<!-- {n:02d} ' + '─' * 73, sec, count=1)
    # single small footer carrying both the brand and the page number;
    # the old round page badge is removed entirely
    sec = re.sub(r'<div class="badge">\d\d</div>', '', sec)
    sec = sec.replace('<div class="foot">AI CENTRAL</div>',
                      f'<div class="foot">AI CENTRAL &nbsp;·&nbsp; {n:02d}</div>')
    return sec.rstrip()

S = {}

# ── 01 Cover ────────────────────────────────────────────────────────────────
S[1] = f'''<!-- 01 {'─'*73} -->
<section class="slide dark" data-label="Cover"
  data-notes="Nothing to present here. The numbers start on the next slide.">
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:64px">
    <img src="__LOGO__" alt="AI Central" style="width:760px;max-width:70%;height:auto">
    <div>
      <div class="kicker" style="font-size:30px;letter-spacing:.34em;text-align:center">MEDIA KIT + FINANCIALS</div>
      <div style="margin-top:22px;font-size:25px;font-weight:400;color:var(--muted-dark);text-align:center;letter-spacing:.03em">AI Central Media · August 2026</div>
    </div>
  </div>
  <div class="foot">AI CENTRAL</div><div class="badge">01</div>
</section>'''

# ── 02 Agenda ───────────────────────────────────────────────────────────────
AGENDA = [
    ("01", "Perspective &amp; context"),
    ("02", "Who we are"),
    ("03", "The problem we solve - readers"),
    ("04", "The problem we solve - companies"),
    ("05", "Audience breakdown"),
    ("06", "Business model"),
    ("07", "Revenues and forecasts"),
    ("08", "Our clients"),
    ("09", "AI Central Library"),
    ("10", "SWOT"),
    ("11", "M&amp;A comparables"),
    ("12", "Forecast and valuation"),
    ("13", "What we need right now"),
]

def toc(n_, t):
    return (f'<div style="display:flex;gap:22px;align-items:baseline;padding:15px 0;border-top:1px solid var(--hair)">'
            f'<div style="font-size:24px;font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums">{n_}</div>'
            f'<div style="font-size:27px;font-weight:400">{t}</div></div>')

_ag_left = "".join(toc(n_, t) for n_, t in AGENDA[:7])
_ag_right = "".join(toc(n_, t) for n_, t in AGENDA[7:])

S[2] = f'''<!-- 02 {'─'*73} -->
<section class="slide light" data-label="Agenda"
  data-notes="Thirteen sections. The order tells the story: why this exists, what it is, the two problems it solves, who reads it, how it earns, what it is worth, and what would help next.">
  <div class="kicker">AGENDA</div>
  <h2>Agenda</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 80px;margin-top:44px;max-width:1500px">
    <div>{_ag_left}</div>
    <div>{_ag_right}</div>
  </div>
  {FOOT}<div class="badge">02</div>
</section>'''

# ── 03 Perspective & context ────────────────────────────────────────────────
def scen(num, title, items):
    body = "".join(
        f'<div style="padding:9px 0;border-top:1px solid #E0DCD4;font-size:20px;font-weight:300;line-height:1.35">{i}</div>'
        for i in items)
    return f'''<div data-step="{num}" style="background:var(--tint);padding:22px 26px">
      <div style="font-size:17px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)">SCENARIO {num}</div>
      <div style="margin-top:6px;font-size:25px;font-weight:700;letter-spacing:-.01em;padding-bottom:10px">{title}</div>
      <div>{body}</div>
    </div>'''

S[3] = f'''<!-- 03 {'─'*73} -->
<section class="slide light" data-label="Perspective and context"
  data-notes="This slide is deliberate expectation-setting before any numbers: the reader should know what kind of founder they are talking to. The $1.5-2.5M in Scenario 1 is the aspiration for a sale in 1-2 years; the end-of-2026 estimate later in the deck is $1.25M - consistent, one year apart. All three scenarios are Alex's own words, lightly edited for plain English.">
  <div class="kicker">PERSPECTIVE &amp; CONTEXT</div>
  <h2>Why AI Central</h2>
  <p class="subline">I started AI Central to upgrade my life in my early 30s: freedom, tax advantage, and an asymmetric revenue opportunity</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;margin-top:30px">
    {scen("1", "Build to sell", [
      "Keep building AI Central as a vehicle built to be sold to a media buyer in the next 1 to 2 years, at a valuation around $1.5 to 2.5M",
      "Minimise and hedge founder risk. Standardise everything - brand, processes, audience - so the handover to a new owner is smooth",
    ])}
    {scen("2", "Skills as the hedge", [
      "The entrepreneur life may not turn out to be ideal",
      "But the growth, learning and experience from building it - content creation, the creator economy, monetisation, go-to-market - can land a well-paid US salary that funds a comfortable EU lifestyle",
      "This is an industry with a <b>HUGE</b> imbalance between demand and supply of skilled workers, and almost no training",
    ])}
    {scen("3", "Family holding", [
      "AI Central keeps running as a profitable, family-owned holding media company",
      "In time it becomes the family's own investment fund: we use it to optimise taxes, property and leases, and to build generational, shielded wealth",
    ])}
  </div>
  <div data-step="4" style="margin-top:24px;border-top:1px solid var(--hair);padding-top:18px;display:flex;gap:60px">
    <div style="flex:1;font-size:22px;font-weight:300;line-height:1.4">Scenarios 1 and 2 are not mutually exclusive. I am agnostic - and very opportunistic - about which one turns out best</div>
    <div style="flex:1;font-size:22px;font-weight:300;line-height:1.4">I am <u>not actively</u> talking to investors. I have no desire to manage a cap table, or to answer to investors with different horizons or growth expectations</div>
  </div>
  {FOOT}<div class="badge">03</div>
</section>'''

# ── 04 Who we are ───────────────────────────────────────────────────────────
def bigcell(label, value, body="", red=False, step=""):
    col = "color:var(--accent);" if red else ""
    stepattr = f' data-step="{step}"' if step else ""
    bodydiv = (f'<div style="margin-top:18px;font-size:25px;font-weight:300;line-height:1.4;color:var(--muted)">{body}</div>'
               if body else "")
    return f'''<div{stepattr}>
      <div style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)">{label}</div>
      <div style="margin-top:16px;font-size:72px;font-weight:700;line-height:.9;letter-spacing:-.04em;{col}">{value}</div>
      {bodydiv}
    </div>'''

S[4] = f'''<!-- 04 {'─'*73} -->
<section class="slide light" data-label="Who we are"
  data-notes="The background curve is total combined audience growing from zero in mid-2023 to 437K today - illustrative shape anchored to the real email series, no axes, purely visual. Three numbers, all sourced: total reach 612,766 accounts a month across the seven channels we operate; all-time revenue $452K = statutory 2023-2025 (EUR 286,388) plus 2026 invoiced YTD (EUR 97,810), at 0.85 EUR/USD. 2025 closed at $268K - shown rounded as $270K per Alex - which is 4x 2024 ($65K), not the 3x in his note; the deck says 4x so it matches the +313% on the revenue chart. Margin: 38% in 2024 and 33% in 2025, both statutory after-tax. If asked what bootstrapped means here: zero outside capital, profitable from the first full year, founder-owned.">
  <div style="position:absolute;left:0;right:0;bottom:0;height:560px;z-index:0;pointer-events:none">__AUD_BG__</div>
  <div style="position:relative;z-index:1">
  <div class="kicker">WHO WE ARE</div>
  <h2>A profitable and bootstrapped new media brand for the professionals adopting AI</h2>
  <p class="subline">Our vision: build a portfolio of media brands, by scaling our proven system to monetise senior audiences through content, brand deals and affiliate partnerships</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:56px;margin-top:44px;border-top:1px solid var(--hair);padding-top:40px">
    {bigcell("Total reach", "613K<span style='font-size:34px;font-weight:400;color:var(--muted)'> / month</span>", "Accounts reached every month, across the 7 distribution channels we operate", step=1)}
    {bigcell("All time revenue", "$452K+", "Of which $270K closed in 2025 - 4x 2024", red=True, step=2)}
    {bigcell("Avg profit margin (after tax)", "35%", "38% in 2024, 33% in 2025", step=3)}
  </div>
  </div>
  {FOOT}<div class="badge">04</div>
</section>'''

# ── 05/06 The problem we solve (B2C / B2B) ──────────────────────────────────
RED_BG, GREEN_BG, GREEN_TXT = "#F7E9EB", "#E9F2EA", "#2E6B3C"

def pbox(bg, headcol, title, inner, step=""):
    stepattr = f' data-step="{step}"' if step else ""
    return f'''<div{stepattr} style="background:{bg};padding:24px 30px">
      <div style="font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:{headcol}">{title}</div>
      <div style="margin-top:8px">{inner}</div>
    </div>'''

def pitem(cap, subs):
    lines = "".join(f'<div style="font-size:19px;font-weight:300;line-height:1.35;color:#3A3A3A;padding:2px 0">&ldquo;{s}&rdquo;</div>' for s in subs)
    return (f'<div style="padding:10px 0;border-top:1px solid rgba(0,0,0,.08)">'
            f'<div style="font-size:21px;font-weight:700">{cap}</div>'
            f'<div style="margin-top:4px">{lines}</div></div>')

def plain_item(t):
    return (f'<div style="display:flex;gap:12px;padding:10px 0;border-top:1px solid rgba(0,0,0,.08)">'
            f'<div style="width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.5;flex:none;margin-top:10px"></div>'
            f'<div style="font-size:21px;font-weight:400;line-height:1.35">{t}</div></div>')

S[5] = f'''<!-- 05 {'─'*73} -->
<section class="slide light" data-label="The problem we solve - readers"
  data-notes="The reader problem in their own words. The three questions in the red box mirror the three answers in the green box, one to one. The grey reader profile synthesises the quiz sample: 35-55, senior role, big organisation - time-poor and under pressure, which is exactly why they pay rather than browse.">
  <div class="kicker">THE PROBLEM WE SOLVE (1/2)</div>
  <h2>Time is money - professionals know that</h2>
  <p class="subline">Senior professionals will pay for easy access that fast-tracks their AI education</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:28px">
    {pbox(RED_BG, "var(--accent)", "Their questions around AI", step=1, inner=(
      pitem("Too much noise", [
        "What is that? And how is it different from what I know?",
        "How do you use it? And what is the value add?",
        "Should I pay for it? Is it good for my company?",
      ]) +
      pitem("Info is found, then lost", [
        "I find something I like. Then I scroll, and it is gone forever",
      ]) +
      pitem("What should I learn?", [
        "What skills are in demand?",
        "What can help me impress my boss, or land a new job?",
      ])
    ))}
    {pbox(GREEN_BG, GREEN_TXT, "The AI Central solution", step=2, inner=(
      f'<div style="padding:10px 0;border-top:1px solid rgba(0,0,0,.08)"><div style="font-size:21px;font-weight:700">One-stop shop</div><div style="margin-top:4px;font-size:19px;font-weight:300;line-height:1.35;color:#3A3A3A">Readers find organised, curated and original educational content in one place</div></div>'
      f'<div style="padding:10px 0;border-top:1px solid rgba(0,0,0,.08)"><div style="font-size:21px;font-weight:700">A personal workspace</div><div style="margin-top:4px;font-size:19px;font-weight:300;line-height:1.35;color:#3A3A3A">Take notes, build your own library, and share it with others - nothing gets lost again</div></div>'
      f'<div style="padding:10px 0;border-top:1px solid rgba(0,0,0,.08)"><div style="font-size:21px;font-weight:700">Step-by-step tutorials</div><div style="margin-top:4px;font-size:19px;font-weight:300;line-height:1.35;color:#3A3A3A">How-to content you can use directly to upskill</div></div>'
    ))}
  </div>
  <div data-step="3" style="margin-top:22px;background:var(--tint);padding:20px 30px;display:flex;align-items:center;gap:26px">
    <div style="font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);flex:none">OUR READER</div>
    <div style="font-size:21px;font-weight:300;line-height:1.4">35 to 55 years old. A manager or senior knowledge worker, in the peak earning years. Time-constrained and FOMO-ing. Under pressure to deliver, or to impress clients. No time for proper sit-down learning and experimenting</div>
  </div>
  {FOOT}<div class="badge">05</div>
</section>'''

S[6] = f'''<!-- 06 {'─'*73} -->
<section class="slide light" data-label="The problem we solve - companies"
  data-notes="The advertiser side of the same coin. The 50-60% cheaper-than-paid-ads figure in the grey box is Alex's operating claim from campaign experience, consistent with the Vision doc's $188-237 per-lead benchmark for traditional channels - it is not from a third-party study, so if pressed, frame it as what our campaigns have delivered, not an industry statistic.">
  <div class="kicker">THE PROBLEM WE SOLVE (2/2)</div>
  <h2>Money is time - especially VC money</h2>
  <p class="subline">Distribution is one of the biggest bottlenecks for new companies today</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:28px">
    {pbox(RED_BG, "var(--accent)", "Where B2B companies struggle", step=1, inner=(
      plain_item("Getting their content in front of the right people") +
      plain_item("Standing out from similar products") +
      plain_item("Educating the market on their product") +
      plain_item("Generating qualified leads")
    ))}
    {pbox(GREEN_BG, GREEN_TXT, "The AI Central solution", step=2, inner=(
      plain_item("A quality, vetted, senior audience - on demand") +
      plain_item("An in-house content team") +
      plain_item("Go-to-market and lead-generation expertise") +
      plain_item("A trusted brand")
    ))}
  </div>
  <div data-step="3" style="margin-top:22px;background:var(--tint);padding:20px 30px;display:flex;align-items:center;gap:26px">
    <div style="font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);flex:none">WHY IT WORKS</div>
    <div style="font-size:21px;font-weight:300;line-height:1.4">New media advertising - newsletters, social media, hybrid content - can deliver leads 50 to 60% cheaper than traditional paid ads such as Google Ads, LinkedIn Ads or linear TV</div>
  </div>
  {FOOT}<div class="badge">06</div>
</section>'''

# ── 07 Audience breakdown ───────────────────────────────────────────────────
S[7] = f'''<!-- 07 {'─'*73} -->
<section class="slide light" data-label="Audience breakdown"
  data-notes="All three charts are sample estimates from the quiz database, applied to the full audience as representative, per Alex's standing instruction. Professions: 1,985 Apollo-enriched respondents. Geography: 4,714 respondents with a country (enriched country first, IP country as fallback) - North America 50%, Rest 17%, Asia 14%, Europe 13%, UK 6%; note this replaces the media kit's 4-region split (NA 44/Rest 22/Asia 20/Europe 14) because Alex asked for the UK broken out, which the media kit does not have. Industries: 2,278 respondents with an employer industry; the top five shown are shares of those classified - a further 47% sit in a long tail of other industries. '151 countries and all 50 US states' is from the media kit.">
  <div class="kicker">AUDIENCE BREAKDOWN</div>
  <h2 style="font-size:62px">Read in 151 countries and all 50 US states</h2>
  <div style="display:grid;grid-template-columns:600px 1fr;gap:60px;margin-top:34px;align-items:start">
    <div>
      <div data-step="1" style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent)">WHO THEY ARE</div>
      <div data-step="1" style="margin-top:14px">__CHART_PROF__</div>
      <div data-step="2" style="margin-top:26px;font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent)">WHERE THEY WORK</div>
      <div data-step="2" style="margin-top:14px">__CHART_IND__</div>
      <div data-step="2" style="margin-top:6px;font-size:17px;font-weight:300;color:var(--muted)">Top 5 industries, share of classified respondents</div>
    </div>
    <div data-step="3">
      <div style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent)">WHERE THEY ARE</div>
      <div style="margin-top:14px">__CHART_MAP__</div>
      <div style="display:flex;gap:22px;margin-top:12px;font-size:19px;color:var(--muted);flex-wrap:wrap">
        <span><i style="display:inline-block;width:13px;height:13px;border-radius:2px;background:#A50D26;vertical-align:-1px"></i> North America 50%</span>
        <span><i style="display:inline-block;width:13px;height:13px;border-radius:2px;background:#CE4B59;vertical-align:-1px"></i> Asia 14%</span>
        <span><i style="display:inline-block;width:13px;height:13px;border-radius:2px;background:#D9636F;vertical-align:-1px"></i> Europe 13%</span>
        <span><i style="display:inline-block;width:13px;height:13px;border-radius:2px;background:#F0BFC6;vertical-align:-1px"></i> UK 6%</span>
        <span><i style="display:inline-block;width:13px;height:13px;border-radius:2px;background:#E3DFD7;vertical-align:-1px"></i> Rest 17%</span>
      </div>
    </div>
  </div>
  {FOOT}<div class="badge">07</div>
</section>'''

# ── 04 How revenue is built ─────────────────────────────────────────────────
def box(name, body):
    return f'''<div style="background:var(--tint);padding:20px 24px">
      <div style="font-size:22px;font-weight:700;letter-spacing:-.01em;padding-bottom:9px;border-bottom:2px solid var(--accent)">{name}</div>
      <div style="margin-top:10px;font-size:19px;font-weight:300;line-height:1.35;color:#3A3A3A">{body}</div>
    </div>'''

S[8] = f'''<!-- 08 {'─'*73} -->
<section class="slide light" data-label="Business model"
  data-notes="No percentages on the slide by design. If asked for mix: the invoice book (which sees roughly half of statutory revenue) suggests direct ads ~42%, passive ~31%, subscriptions ~24%, affiliate and treasury small - indicative only. The two in-development lines are not yet live and carry no revenue figures - roadmap, not numbers. The bootcamp economics as designed: a $25-49 ticket for a cohort of 10-15, with a $1,999 high-ticket mentoring offer pitched at the end.">
  <div class="kicker">BUSINESS MODEL (1/2)</div>
  <h2>Imagine investing in &lsquo;attention&rsquo;</h2>
  <p class="subline" style="font-size:28px;margin-top:18px">We are in the business of digital real estate: we earn money by renting our ad inventory, and from content that sells third-party software we earn commissions on. We then invest the proceeds in fixed-income products</p>
  <div data-step="1" style="margin-top:20px;font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)">CURRENT REVENUE LINES</div>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:10px">
    {box("Direct ad sales", "We sell companies bespoke content packages, across newsletters, the website and social media")}
    {box("Ad networks", "We run pre-negotiated CPC ads - pay-per-click")}
    {box("Affiliate deals", "We earn recurring commissions on sales of software")}
    {box("Paid subscriptions", "Readers pay an annual fee for access to premium content")}
    {box("Treasury management", "We earn interest on held cash, and re-invest in the stock market")}
  </div>
  <div data-step="2" style="margin-top:16px;font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)">IN DEVELOPMENT</div>
  <div data-step="2" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:10px">
    {box("Ticket selling + high-ticket offer", "We sell tickets ($25 to 49) to online bootcamps, where we teach a cohort of 10 to 15 people one concrete use case. At the end, the cohort is offered a high-ticket mentoring package ($1,999)")}
    {box("Merchandising & store", "AI Central original merchandise - t-shirts, desk accessories, hats - plus recommended third-party products such as tech gadgets and equipment")}
  </div>
  {FOOT}<div class="badge">08</div>
</section>'''

# ── 05 Revenue by year ──────────────────────────────────────────────────────
S[9] = f'''<!-- 09 {'─'*73} -->
<section class="slide light" data-label="Revenues and forecasts"
  data-notes="All in USD at 0.85 EUR/USD. Actuals statutory: 2024 $65K with $25K profit (38% margin); 2025 $268K with $90K profit (33% margin), +313%. Forecast basis set by Alex: 2026F = +50% on 2025 = $402K; 2027F = +30% = $523K, both outlined - nothing in them is booked, and this is the slowest-growth conservative scenario. Conversion is 449 of 754 due trials = 59.5%, shown rounded to 60%. ARPU is 2025 revenue over year-end email subscribers, about $2.4 a year.">
  <div class="kicker">BUSINESS MODEL (2/2) · REVENUES AND FORECASTS</div>
  <h2>Half a million by 2027, bootstrapped</h2>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:48px;margin-top:30px;border-bottom:1px solid var(--hair);padding-bottom:26px">
    <div><div style="font-size:46px;font-weight:700;line-height:.9;letter-spacing:-.03em;color:var(--accent)">35%</div>
      <div style="margin-top:11px;font-size:23px;font-weight:400;line-height:1.3;color:var(--muted)">Average profit margin</div></div>
    <div><div style="font-size:46px;font-weight:700;line-height:.9;letter-spacing:-.03em">60%</div>
      <div style="margin-top:11px;font-size:23px;font-weight:400;line-height:1.3;color:var(--muted)">Trial-to-paid conversion</div></div>
    <div><div style="font-size:46px;font-weight:700;line-height:.9;letter-spacing:-.03em">4,000+</div>
      <div style="margin-top:11px;font-size:23px;font-weight:400;line-height:1.3;color:var(--muted)">New subscribers each month</div></div>
    <div><div style="font-size:46px;font-weight:700;line-height:.9;letter-spacing:-.03em">$2.4<span style="font-size:26px;font-weight:400;color:var(--muted)">/year</span></div>
      <div style="margin-top:11px;font-size:23px;font-weight:400;line-height:1.3;color:var(--muted)">Average revenue per user</div></div>
  </div>
  <div data-step="2" style="margin-top:24px;background:var(--tint);padding:18px 36px 14px">
    <div style="font-size:21px;font-weight:700">Total net revenue ($)</div>
    <div style="margin-top:4px">__CHART_YEARS__</div>
    <div style="margin-top:6px;font-size:17px;font-weight:300;color:var(--muted)">2023, 2024 and 2025 are statutory balance-sheet revenue, converted to dollars. 2026 and 2027 are the slowest-growth, conservative scenario</div>
  </div>
  {FOOT}<div class="badge">09</div>
</section>'''

# ── 06 Our clients ──────────────────────────────────────────────────────────
TOP = [("HubSpot", 39390), ("Outskill", 24453), ("Guidde", 22385), ("ElevenLabs", 16934),
       ("Gamma", 12953), ("Fellow", 10864), ("Luma AI", 9448), ("Delve", 8036),
       ("Mindstream", 7334), ("Jobstream", 5066), ("Replit", 4738), ("Synthflow", 3756)]
MAXV = TOP[0][1]

def logo_cell(name):
    if name in si_logos:
        return f'<img src="{si_logos[name]}" style="width:34px;height:34px;object-fit:contain" alt="">'
    if name in mk:
        return f'<img src="{mk[name]}" style="max-width:74px;max-height:34px;object-fit:contain;border-radius:3px" alt="">'
    return (f'<div style="width:34px;height:34px;border-radius:6px;background:var(--ink);color:var(--paper);'
            f'font-size:19px;font-weight:700;display:flex;align-items:center;justify-content:center">{name[0]}</div>')

rows = []
for name, v in TOP:
    w = round(100 * v / MAXV, 1)
    rows.append(f'''<div style="display:grid;grid-template-columns:200px 1fr 110px;gap:16px;align-items:center;padding:6px 0">
      <div style="font-size:22px;font-weight:700">{name}</div>
      <div style="height:22px;background:#E9E6E0;border-radius:0 4px 4px 0"><div style="width:{w}%;height:100%;background:var(--accent);border-radius:0 4px 4px 0"></div></div>
      <div style="font-size:21px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">${v/1000:.1f}K</div>
    </div>''')
BARS = "\n".join(rows)

S[10] = f'''<!-- 10 {'─'*73} -->
<section class="slide light" data-label="Our clients"
  data-notes="Lifetime billed per client in USD - network ad spend native USD, direct EUR deals at 0.85. HubSpot $39.4K is beehiiv ad-network spend across 126 placements, not a negotiated deal - be precise if pressed. Outskill, Guidde, ElevenLabs, Luma, Delve, Jobstream, Replit are direct. The screenshots are from the media kit: a HubSpot co-branded issue and a Guidde campaign creative. 104 advertisers in total; repeat buyers are 98% of ad revenue.">
  <div class="kicker">OUR CLIENTS</div>
  <h2 style="font-size:64px">Companies we've run ads for</h2>
  <div style="display:flex;gap:48px;margin-top:30px;align-items:flex-start">
    <div data-step="1" style="flex:1">
      <div style="font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:var(--muted)">LIFETIME BILLED · DIRECT + NETWORK</div>
      <div style="margin-top:12px">{BARS}</div>
      <div style="margin-top:10px;font-size:18px;font-weight:300;color:var(--muted)">USD, direct deals converted at 0.85 EUR/USD. Also: Notion, Attio, Wispr Flow, Morning Brew, Monday.com, Superhuman AI, Writer, The Rundown and 80+ more</div>
    </div>
    <div data-step="2" style="width:470px;flex:none">
      <div style="font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:var(--muted)">FROM THE MEDIA KIT</div>
      <div style="margin-top:12px;display:flex;gap:16px;align-items:flex-start">
        <img src="{mk['shot_hubspot']}" style="width:200px;border:1px solid var(--hair)" alt="HubSpot co-branded issue">
        <div style="flex:1">
          <img src="{mk['shot_guidde']}" style="width:100%;border:1px solid var(--hair)" alt="Guidde campaign creative">
          <div style="margin-top:10px;font-size:19px;font-weight:300;line-height:1.4;color:var(--muted)">A HubSpot co-branded issue and a Guidde campaign creative - - ICP research, scroll-stopping creative, in-document conversion</div>
        </div>
      </div>
    </div>
  </div>
  {FOOT}<div class="badge">06</div>
</section>'''

# ── 07 AI Central University ────────────────────────────────────────────────
def peer(name, body):
    return f'''<div style="flex:1;border-left:1px solid var(--hair-dark);padding-left:18px">
      <div style="font-size:19px;font-weight:700">{name}</div>
      <div style="margin-top:3px;font-size:16px;font-weight:300;line-height:1.3;color:var(--muted-dark)">{body}</div>
    </div>'''

S[11] = f'''<!-- 11 {'─'*73} -->
<section class="slide light" data-label="AI Central Library"
  data-notes="All measured on the production Stripe sync joined to quiz submissions. Prices on the slide are rounded per Alex: the trial is $4.99 (shown $5), the annual is $59.75 (shown $60). The revenue chart is monthly gross Library charges net of refunds: $87.7K all-time (Nov 2023 to Aug 2026). Launch marker May 2025 - when the current $4.99-to-$59.75 trial funnel started, per Alex's v8 edit; 'New funnel, Jun 2026' is Alex's own marker - the Stripe pull shows no step-change around that date, pending a reconciled figure from him. Forecast bars are +15%/mo from the Aug 2026 actual, a rate Alex set. Both charts share the same x-axis, so a month lines up vertically across them. Trials: trial_ledger grouped on trial_at - 879 total, 754 due, 449 converted (59.5%, shown 60%); recent months run 94-106 trials, shown as 100+. 1,823 paying members. LTV $120 is Alex's figure at 40% annual churn; the strict model at the $45 measured AOV gives $113, at the full $60 price $150 - his $120 sits between, flag if pressed. Realised to date is $47 because most members are in year one.">
  <div class="kicker">AI CENTRAL LIBRARY</div>
  <h2 class="wide" style="font-size:56px">A $5 paid trial converts into $60 a year at 60%</h2>
  <div data-step="1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:36px">
    <div><div class="stat" style="font-size:44px;line-height:.9">1,823</div><div class="stat-l" style="font-size:18px;margin-top:6px">Current paying clients</div></div>
    <div><div class="stat" style="font-size:44px;line-height:.9">100+</div><div class="stat-l" style="font-size:18px;margin-top:6px">New trials per month</div></div>
    <div><div class="stat red" style="font-size:44px;line-height:.9">60%</div><div class="stat-l" style="font-size:18px;margin-top:6px">Trial-to-paid conversion</div></div>
    <div><div class="stat" style="font-size:44px;line-height:.9">$120</div><div class="stat-l" style="font-size:18px;margin-top:6px">Lifetime value, assuming 40% churn</div></div>
  </div>
  <div data-step="2" style="margin-top:26px;background:var(--tint);padding:8px 22px">
    <div style="display:flex;justify-content:space-between;align-items:baseline">
      <div style="font-size:18px;font-weight:700">AI Library revenue by month, plus a 6-month forecast</div>
      <div style="font-size:16px;color:var(--muted)">Stripe, gross of fees, net of refunds · <b style="font-weight:700;color:var(--ink)">$87.7K</b> all-time actual</div>
    </div>
    <div style="margin-top:2px">__CHART_LIB__</div>
  </div>
  <div data-step="3" style="margin-top:6px;background:var(--tint);padding:6px 22px">
    <div style="font-size:18px;font-weight:700">Trials started per month</div>
    <div style="margin-top:0">__CHART_TRIALS__</div>
  </div>
  <div data-step="4" style="margin-top:8px;background:var(--ink);color:var(--paper);padding:12px 26px">
    <div style="font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);margin-bottom:6px">A HUGE OPPORTUNITY TO RAISE PRICES</div>
    <div style="display:flex;gap:0">
      {peer("The Rundown AI", "About $1,000 a year. Over 5,000 members")}
      {peer("The Neuron", "20,000+ course students at the time it was acquired")}
      {peer("Ben's Bites", "Moved fully to paid education. Seven figures a year")}
      {peer("Techpresso", "An AI daily. It now sells a paid subscription tier")}
    </div>
  </div>
  {FOOT}<div class="badge">11</div>
</section>'''

# ── 08 SWOT ─────────────────────────────────────────────────────────────────
def swot(title, items, step=""):
    body = "".join(
        f'<div style="padding:9px 0;border-top:1px solid #E0DCD4;font-size:23px;font-weight:300;line-height:1.35">{i}</div>'
        for i in items)
    stepattr = f' data-step="{step}"' if step else ""
    return f'''<div{stepattr} style="background:var(--tint);padding:24px 30px">
      <div style="font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent)">{title}</div>
      <div style="margin-top:12px">{body}</div>
    </div>'''

S[12] = f'''<!-- 12 {'─'*73} -->
<section class="slide light" data-label="SWOT"
  data-notes="Honest by design - own the weaknesses before they raise them. No moat: true of every newsletter; the answer is the measured funnel, the first-party data and the repeat-advertiser base, which take time to rebuild. Undermonetized is also the pitch: $2.4 ARPU against peers charging $1,000 a year is the upside a buyer purchases. '#1 Author in Tradepub's AI Section' is a claim Alex gave verbally - not yet independently verified or sourced; ask him for a link or screenshot before this goes to anyone outside the room. Consolidation threat cuts both ways - it is also why acquirers are paying now.">
  <div class="kicker">SWOT</div>
  <h2 style="font-size:62px">Where we are strong and what we are fixing</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:30px">
    {swot("Strengths", step=1, items=[
      "3 years of brand life",
      "200+ unique pieces of proprietary content",
      "#1 author in Tradepub's AI section",
    ])}
    {swot("Weaknesses", step=2, items=[
      "No moat",
      "Little difference from what bigger AI media products offer",
      "Undermonetized",
    ])}
    {swot("Opportunities", step=3, items=[
      "New revenue lines - store, merchandising, books",
      "Cohort teaching, i.e. 1:many online sessions",
      "Fractional consulting",
    ])}
    {swot("Threats", step=4, items=[
      "Being squeezed out as the market consolidates",
      "A social media ban, or a change to a social media algorithm",
      "An AI crash, and the end of AI hype",
    ])}
  </div>
  {FOOT}<div class="badge">12</div>
</section>'''

# ── 09 Industry M&A ─────────────────────────────────────────────────────────
def mrow(target, buyer, price, mult, last=False):
    bb = "border-bottom:1px solid var(--hair);" if last else ""
    return f'''<tr>
      <td class="name" style="{bb}">{target}</td><td style="{bb}">{buyer}</td>
      <td style="{bb}">{price}</td><td style="{bb};font-weight:700;color:var(--accent)">{mult}</td></tr>'''

S[13] = f'''<!-- 13 {'─'*73} -->
<section class="slide light" data-label="M&A comparables"
  data-notes="Every row now has a verified, reported price - the undisclosed AI-newsletter deals (Milk Road, Mindstream, The Neuron) were removed per Alex and replaced with disclosed digital-media deals. Multiples: Politico ~5x revenue ($1B+ on ~$200M sales, CNBC/WSJ); Axios ~5x revenue ($525M on ~$100M projected, CNBC/Axios' own reporting); Industry Dive - the one deal with a disclosed EBITDA multiple - $389M cash, up to $525M with earn-out, on ~$110M revenue and ~$34M EBITDA = ~3.5x revenue and ~11.4x EBITDA per Informa's market update; Morning Brew ~3.75x revenue est. ($75M majority on ~$20M revenue); The Hustle ~2-2.7x revenue est. ($27M per Axios); The Peak 1.65x revenue, stated by the buyer. The big three (Politico, Axios, Industry Dive) are scale deals - they anchor the ceiling, not our price. The Peak, Hustle and Morning Brew are the relevant size band.">
  <div class="kicker">M&amp;A COMPARABLES</div>
  <h2>What buyers pay for professional audiences</h2>
  <table data-step="1" style="margin-top:30px">
    <thead><tr>
      <th style="width:20%">Target</th><th style="width:26%">Buyer</th>
      <th style="width:26%">Price (reported)</th><th style="width:28%">Multiple</th>
    </tr></thead>
    <tbody>
      {mrow("Politico", "Axel Springer (2021)", "$1B+", "~5x revenue")}
      {mrow("Axios", "Cox Enterprises (2022)", "$525M", "~5x revenue")}
      {mrow("Industry Dive", "Informa (2022)", "$389M, up to $525M with earn-out", "~3.5x revenue · ~11.4x EBITDA")}
      {mrow("Morning Brew", "Business Insider, majority (2020)", "$75M", "~3.75x revenue, est.")}
      {mrow("The Hustle", "HubSpot (2021)", "~$27M", "~2 to 2.7x revenue, est.")}
      {mrow("The Peak", "ZoomerMedia (2023)", "$5M", "1.65x revenue", last=True)}
    </tbody>
  </table>
  <div data-step="2" style="margin-top:22px;font-size:21px;font-weight:300;line-height:1.4;color:var(--muted);max-width:1500px">All multiples are revenue multiples unless marked EBITDA. Only Industry Dive disclosed earnings. Small newsletter deals price on revenue: earnings histories are too short. The three large deals anchor the ceiling of the market; The Peak, The Hustle and Morning Brew are the relevant size band</div>
  <div class="src">Sources: CNBC, Axios, Informa market update (Jul 2022), Press Gazette, A Media Operator, They Got Acquired</div>
  {FOOT}<div class="badge">13</div>
</section>'''

# ── 10 Forecasts + valuation ────────────────────────────────────────────────
def frow(y, rev, growth, note, actual=False):
    w = "700" if actual else "300"
    return f'''<div style="display:grid;grid-template-columns:140px 190px 120px 1fr;gap:26px;align-items:baseline;padding:18px 0;border-top:1px solid var(--hair)">
      <div style="font-size:27px;font-weight:700">{y}</div>
      <div style="font-size:31px;font-weight:{w};font-variant-numeric:tabular-nums">{rev}</div>
      <div style="font-size:24px;font-weight:700;color:var(--accent)">{growth}</div>
      <div style="font-size:22px;font-weight:300;line-height:1.35;color:var(--muted)">{note}</div>
    </div>'''

def vrow(method, calc, result):
    return f'''<div style="display:grid;grid-template-columns:300px 1fr 210px;gap:28px;align-items:baseline;padding:20px 0;border-top:1px solid var(--hair)">
      <div style="font-size:26px;font-weight:700">{method}</div>
      <div style="font-size:23px;font-weight:300;line-height:1.4;color:var(--muted)">{calc}</div>
      <div style="font-size:27px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">{result}</div>
    </div>'''

def vstep(n_, body, result=""):
    res = (f'<div style="font-size:28px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums;flex:none;width:250px">{result}</div>'
           if result else '<div style="flex:none;width:250px"></div>')
    return f'''<div data-step="{n_}" style="display:flex;gap:34px;align-items:baseline;padding:21px 0;border-top:1px solid var(--hair)">
      <div style="font-size:34px;font-weight:700;color:var(--accent);flex:none;width:64px;font-variant-numeric:tabular-nums">{n_}</div>
      <div style="font-size:24px;font-weight:300;line-height:1.45;color:#2A2A2A;flex:1">{body}</div>
      {res}</div>'''

S[14] = f'''<!-- 14 {'─'*73} -->
<section class="slide light" data-label="Forecast and valuation"
  data-notes="One method, walked step by step, with a per-subscriber alternative method as validation. Steps: 2026F revenue $402K (2025 statutory $268K +50%, the conservative scenario); multiple 2.5 to 3.5x revenue - between The Peak's 1.65x and Morning Brew's 3.75x, above the ad-led floor because subscriptions are a large and growing share of mix; $402K x 2.5-3.5 = $1.0 to 1.4M; alternative method 97K email subscribers at $10-15 = $1.0 to 1.5M with LinkedIn 181K and Substack 44K free; midpoint about $1.25M. Every input traces to an earlier slide.">
  <div class="kicker">FORECAST AND VALUATION</div>
  <h2>Estimated valuation: about $1.25M by end of 2026</h2>
  <div style="margin-top:36px;max-width:1700px">
    {vstep("1", "The conservative forecast for 2026: $268K closed in 2025, plus 50% growth", "$402K")}
    {vstep("2", "Deals our size paid 1.65x to 3.75x revenue. Our mix has a large, growing subscription line, so we use the middle: 2.5 to 3.5x", "2.5 - 3.5x")}
    {vstep("3", "$402K of revenue at 2.5 to 3.5x", "$1.0 - 1.4M")}
    {vstep("4", "Alternative method: 97K email subscribers at the $10 to 15 B2B band = $1.0 to 1.5M. The 181K LinkedIn newsletter and 44K Substack come free", "$1.0 - 1.5M")}
    <div data-step="4" style="display:flex;gap:34px;align-items:baseline;padding:24px 0;border-top:2px solid var(--ink)">
      <div style="font-size:34px;font-weight:700;color:var(--accent);flex:none;width:64px">=</div>
      <div style="font-size:24px;font-weight:300;line-height:1.45;color:#2A2A2A;flex:1">Both routes land in the same band. For a profitable, bootstrapped brand, by the end of 2026</div>
      <div style="font-size:40px;font-weight:700;text-align:right;flex:none;width:250px;color:var(--accent)">~$1.25M</div>
    </div>
  </div>
  {FOOT}<div class="badge">14</div>
</section>'''


# ── 15 What we need right now ───────────────────────────────────────────────
def need(n_, title, body):
    return f'''<div data-step="{int(n_)}" style="display:grid;grid-template-columns:96px 480px 1fr;gap:34px;align-items:baseline;padding:26px 0;border-top:1px solid rgba(0,0,0,.14)">
      <div style="font-size:44px;font-weight:700;line-height:1;color:var(--accent)">{n_}</div>
      <div style="font-size:29px;font-weight:700">{title}</div>
      <div style="font-size:25px;font-weight:300;line-height:1.4">{body}</div>
    </div>'''

S[15] = f'''<!-- 15 {'─'*73} -->
<section class="slide light" data-label="What we need right now" style="background:#E9F2EA"
  data-notes="The ask is acceleration, not capital - the business is bootstrapped and profitable, and slide 3 already said we are not actively talking to investors. ICP for introductions, from the Vision GTM work: AI and SaaS companies selling to professionals with active go-to-market spend - recently funded, already advertising in newsletters, or on the beehiiv advertiser list. Mentoring replaces the M&A deal-flow ask per Alex.">
  <h2>What we need right now</h2>
  <p class="subline">The business is profitable and bootstrapped. What compounds it now is access</p>
  <div style="margin-top:30px">
    {need("01", "Introductions to potential clients", "Our ICP: AI and SaaS companies selling to professionals, with live go-to-market spend. Recently funded, already advertising in newsletters, or on the beehiiv advertiser list")}
    {need("02", "Networks and multipliers", "Operator communities, media-buyer networks, agencies and platforms that aggregate sponsor demand")}
    {need("03", "Events / conferences / speaking", "Stages and panels on AI adoption and the newsletter economy. We bring press accreditation from Cannes Lions, London Tech Week and SXSW London")}
    {need("04", "Mentoring by industry operators", "Experienced media operators who have built or sold, to pressure-test our decisions on pricing, packaging and the road to a sale")}
  </div>
  {FOOT}<div class="badge">15</div>
</section>'''

out = head + "\n\n".join(renumber(S[i], i) for i in sorted(S)) + "\n\n" + tail
pathlib.Path("/home/claude/build/deck.template.html").write_text(out)
print("rebuilt template with", len(S), "slides")
