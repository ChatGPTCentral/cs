"""Rebuild slide 03 on the real channel numbers and move the deck onto the
statutory revenue basis (2024 and 2025 accounts)."""
import pathlib

n = pathlib.Path("/home/claude/build/newslides.py")
t = n.read_text()

SL3 = '''S[3] = f\'\'\'<!-- 03 {'─'*73} -->
<section class="slide light" data-label="Total audience"
  data-notes="Two different numbers, do not confuse them. 437,339 is people who follow or subscribe across seven channels - the LinkedIn newsletter 181,000 sits inside the page 290,000, so it is never added twice. 611,139 is monthly reach: unique email sends plus LinkedIn and Threads impressions over 30 days; Substack, Instagram, X, Facebook and Bluesky impressions are not in it, so the true figure is higher. Owned and transferable is 322,139 - email, LinkedIn newsletter, Substack. Composition is measured from 1,985 Apollo-enriched quiz respondents: founder plus C-suite 13.7%, adding VP/Director 29.6%, manager and above 50.5%.">
  <div class="kicker">TOTAL AUDIENCE - - THE ASSET BEING BOUGHT</div>
  <h2>437,000 followers across seven channels, 611,000 reached a month</h2>
  <div style="display:flex;gap:44px;margin-top:40px;align-items:flex-start">
    <div style="width:560px">
      <div style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)">AUDIENCE BY CHANNEL</div>
      {chan("LinkedIn page", "290,000")}
      {chan("Email · beehiiv", "97,139")}
      {chan("Substack", "44,000")}
      {chan("Threads", "3,200")}
      {chan("Instagram, X, Facebook", "3,000")}
      <div style="display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;border-top:2px solid var(--ink);margin-top:2px">
        <div style="font-size:25px;font-weight:700">Total following</div>
        <div style="font-size:32px;font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums">437,339</div></div>
      <div style="margin-top:10px;font-size:19px;font-weight:300;line-height:1.35;color:var(--muted)">181,000 of the LinkedIn page subscribe to the newsletter, counted once inside the page</div>
    </div>
    <div style="width:480px">
      <div style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent)">MONTHLY REACH</div>
      {chan("Email, unique sends", "97,139")}
      {chan("LinkedIn impressions", "283,000")}
      {chan("Threads impressions", "231,000")}
      <div style="display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;border-top:2px solid var(--ink);margin-top:2px">
        <div style="font-size:25px;font-weight:700">Reach a month</div>
        <div style="font-size:32px;font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums">611,139</div></div>
      <div style="margin-top:10px;font-size:19px;font-weight:300;line-height:1.35;color:var(--muted)">Excludes Substack, Instagram, X, Facebook and Bluesky, so the true figure is higher</div>
    </div>
    <div style="flex:1;background:var(--tint);padding:26px 28px;display:flex;flex-direction:column">
      <div style="font-size:22px;font-weight:700;letter-spacing:-.01em">Owned and transferable</div>
      <div style="margin-top:14px;font-size:50px;font-weight:700;line-height:.9;letter-spacing:-.03em;color:var(--accent)">322,139</div>
      <div style="margin-top:14px;font-size:21px;font-weight:300;line-height:1.4;color:var(--muted)">Email 97,139 · LinkedIn newsletter 181,000 · Substack 44,000. These move with the business. Page followers and social impressions do not</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:44px;margin-top:26px;border-top:1px solid var(--hair);padding-top:22px">
    <div>
      <div style="font-size:36px;font-weight:700;line-height:.9;letter-spacing:-.03em;color:var(--accent)">30%</div>
      <div style="margin-top:8px;font-size:20px;font-weight:400;line-height:1.3;color:var(--muted)">Founders, C-suite or VP/Director. 50% manager and above</div>
    </div>
    <div>
      <div style="font-size:36px;font-weight:700;line-height:.9;letter-spacing:-.03em">21%</div>
      <div style="margin-top:8px;font-size:20px;font-weight:400;line-height:1.3;color:var(--muted)">At companies with 10,000+ employees</div>
    </div>
    <div>
      <div style="font-size:36px;font-weight:700;line-height:.9;letter-spacing:-.03em">46%</div>
      <div style="margin-top:8px;font-size:20px;font-weight:400;line-height:1.3;color:var(--muted)">United States. India 8%, UK 6%, Canada 3%</div>
    </div>
    <div>
      <div style="font-size:36px;font-weight:700;line-height:.9;letter-spacing:-.03em">34.6%</div>
      <div style="margin-top:8px;font-size:20px;font-weight:400;line-height:1.3;color:var(--muted)">Email open rate, 2.7% click</div>
    </div>
  </div>
  <div style="margin-top:18px;font-size:19px;font-weight:300;line-height:1.35;color:var(--muted);max-width:1620px">Composition from 1,985 Apollo-enriched quiz respondents of 5,026 submissions since Nov 2023, taken as representative of the audience</div>
  {FOOT}<div class="badge">03</div>
</section>\'\'\'

'''

t = t[: t.index("S[3] = f'''<!-- 03 ")] + SL3 + t[t.index("# ── 04 How we make money") :]

R = [
 # slide 02 - nutshell
 ('{cell("Audience", "300K+", "Total reach across owned and social channels. 97,070 email and 178K LinkedIn newsletter are the owned core")}',
  '{cell("Audience", "437K", "Followers across seven channels, 611K reached a month. 322,139 owned and transferable")}'),
 ('{cell("Revenue", "€140K", "Trailing 12 months, net of VAT. €242,565 since inception in 2023", red=True)}',
  '{cell("Revenue", "€228K", "2025 statutory, the last closed year. €286,388 since inception in 2023", red=True)}'),
 ('{cell("Growth", "+40%", "2025 €115,745 to 2026 €158K annualised on the last 6 months")}',
  '{cell("Growth", "+313%", "2024 €55,248 to 2025 €228,049, both from the statutory accounts")}'),
 ('{cell("Team", "5 people", "AI-native stack. Multiple issues a week without a newsroom\'s headcount")}',
  '{cell("Margin", "33%", "Net margin in 2025, €76,811 of profit. 38% in 2024. Run by 5 people")}'),
 # slide 05 - trajectory
 ('<div class="chart-s">EUR net of VAT · 2026 annualised on the last 6 months</div>',
  '<div class="chart-s">Statutory accounts · 2026 forecast outlined, not booked</div>'),
 ('<div class="chart-n">2023 <b>€3,091</b> · 2024 <b>€55,315</b> statutory, <b>€21,231</b> profit · 2025 <b>€115,745</b> · 2026 <b>€97,810</b> booked to July, <b>€158K</b> annualised.</div>',
  '<div class="chart-n">2024 <b>€55,248</b> and 2025 <b>€228,049</b>, both statutory. The 2026 forecast applies the invoice book like-for-like Jan to Jul growth of +33% to the 2025 base.</div>'),
 ('<div class="chart-s">Monthly, Jan 2025 to Jul 2026 · EUR net of VAT</div>',
  '<div class="chart-s">Monthly mix, Jan 2025 to Jul 2026 · invoice book</div>'),
 ('<div class="chart-n">Since inception <b>€242,565</b>. A further €29,009 of 2024 to 2025 QONTO receipts carry no payment date and are not plotted.</div>',
  '<div class="chart-n">Shape and mix, not level: the invoice book records dated cash receipts and captures roughly half of statutory 2025 revenue.</div>'),
 ('>+109%</div>\n      <div style="margin-top:12px;font-size:24px;font-weight:400;line-height:1.3;color:var(--muted)">Revenue growth 2024 to 2025, then +36% to 2026</div>',
  '>+313%</div>\n      <div style="margin-top:12px;font-size:24px;font-weight:400;line-height:1.3;color:var(--muted)">Revenue growth 2024 to 2025, statutory</div>'),
 ('>38%</div>\n      <div style="margin-top:12px;font-size:24px;font-weight:400;line-height:1.3;color:var(--muted)">Net margin in 2024, the last closed year</div>',
  '>33%</div>\n      <div style="margin-top:12px;font-size:24px;font-weight:400;line-height:1.3;color:var(--muted)">Net margin in 2025, €76,811 of profit</div>'),
 ('data-notes="2023 EUR 3,091 from the revenue ledger; 2024 EUR 55,315 with EUR 21,231 of profit from the statutory accounts - a 38% net margin, which is the number to lead with if they push on quality of earnings. 2025 is a complete year from the invoice book.',
  'data-notes="All statutory: 2024 ricavi EUR 55,248 and utile EUR 21,231 (38% margin); 2025 ricavi EUR 228,049 and utile EUR 76,811 (33% margin). Growth 2024 to 2025 is +313%. The 2026 bar is outlined because no statutory 2026 figure exists yet - it applies the invoice book like-for-like Jan to Jul growth of +33% to the 2025 base. If they push on quality of earnings, lead with the margin: this is a profitable business, not a growth story burning cash.'),
 # slide 01 - cover strip
 ('>97,070</div>\n      <div style="margin-top:6px;font-size:22px;font-weight:300;color:var(--muted-dark)">Email subscribers</div>',
  '>97,139</div>\n      <div style="margin-top:6px;font-size:22px;font-weight:300;color:var(--muted-dark)">Email subscribers</div>'),
 ('>178K</div>\n      <div style="margin-top:6px;font-size:22px;font-weight:300;color:var(--muted-dark)">LinkedIn newsletter</div>',
  '>181,000</div>\n      <div style="margin-top:6px;font-size:22px;font-weight:300;color:var(--muted-dark)">LinkedIn newsletter</div>'),
 ('>€140K</div>\n      <div style="margin-top:6px;font-size:22px;font-weight:300;color:var(--muted-dark)">Revenue, trailing 12 months</div>',
  '>€228K</div>\n      <div style="margin-top:6px;font-size:22px;font-weight:300;color:var(--muted-dark)">Revenue 2025, +313%</div>'),
 ('>5</div>\n      <div style="margin-top:6px;font-size:22px;font-weight:300;color:var(--muted-dark)">People</div>',
  '>33%</div>\n      <div style="margin-top:6px;font-size:22px;font-weight:300;color:var(--muted-dark)">Net margin 2025</div>'),
 ('EUR 140,290 trailing revenue from the invoice book.',
  'EUR 228,049 of 2025 revenue and EUR 76,811 of profit, both from the statutory accounts.'),
]

missed = []
for old, new in R:
    if old not in t:
        missed.append(old[:70])
    t = t.replace(old, new)

n.write_text(t)
print("applied", len(R) - len(missed), "of", len(R), "replacements")
for m in missed:
    print("  MISSED:", m)
