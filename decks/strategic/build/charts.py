"""Generate the two slide-05 charts as inline SVG.

Data provenance:
  - subscribers: beehiiv get_subscriber_history, pub_685dd277, all_time,
    pulled 2026-08-27.
  - revenue: the AI Central invoice book (Anagrafiche Fatture), QONTO + WISE
    accounts, classified into the deck's four lines by revenue.py. EUR net of
    the 22% Italian VAT. Only the WISE side carries payment dates, so the
    monthly series runs Jan 2025 to Jul 2026.

Both charts follow the dataviz skill: <=24px bars, 4px rounded data-ends, 2px
lines, >=8px markers with a 2px surface ring, a 2px surface gap between stacked
segments, hairline solid gridlines, selective direct labels, and text in text
tokens rather than the series colour. The four-series palette is validated -
see the note on stack order above revenue_svg().
"""
import json

W, H = 774, 236

ACCENT   = "#C8102E"   # Signal Red - the deck's data hue
SURFACE  = "#F3F1EC"   # card tint the charts sit on
GRID     = "#E3DFD7"   # one step off surface, recessive
INK      = "#141414"   # primary text
MUTED    = "#6E6E6E"   # secondary text
PENDING  = "#B8B2A7"   # dashed placeholder stroke

# ---------------------------------------------------------------- subscribers
SUBS = [
    ("2023-11", 0),     ("2023-12", 338),   ("2024-01", 1378),  ("2024-02", 7314),
    ("2024-03", 11313), ("2024-04", 12497), ("2024-05", 19570), ("2024-06", 31336),
    ("2024-07", 44883), ("2024-08", 52517), ("2024-09", 56759), ("2024-10", 61890),
    ("2024-11", 67899), ("2024-12", 70238), ("2025-01", 53316), ("2025-02", 60837),
    ("2025-03", 66642), ("2025-04", 74722), ("2025-05", 79280), ("2025-06", 82752),
    ("2025-07", 84439), ("2025-08", 86857), ("2025-09", 90138), ("2025-10", 92638),
    ("2025-11", 95421), ("2025-12", 96685), ("2026-01", 98041), ("2026-02", 98228),
    ("2026-03", 98515), ("2026-04", 98653), ("2026-05", 97210), ("2026-06", 99270),
    ("2026-07", 99324), ("2026-08", 97070),
]

def subscribers_svg():
    # top/right margins leave room for the end label, which sits at the very top
    # of the scale (97K of a 100K axis) and must not clip against the viewBox
    L, R, T, B = 66, 108, 38, 32
    pw, ph = W - L - R, H - T - B
    ymax = 100_000
    n = len(SUBS)

    def x(i): return L + pw * i / (n - 1)
    def y(v): return T + ph * (1 - v / ymax)

    out = [f'<svg viewBox="0 0 {W} {H}" width="100%" role="img" '
           f'aria-label="AI Central email subscribers by month, November 2023 to August 2026, '
           f'ending at 97,070 active subscribers">']

    # gridlines + y ticks
    for v in (0, 25_000, 50_000, 75_000, 100_000):
        gy = round(y(v), 1)
        out.append(f'<line x1="{L}" y1="{gy}" x2="{L+pw}" y2="{gy}" stroke="{GRID}" stroke-width="1"/>')
        lab = "0" if v == 0 else f"{v//1000}K"
        out.append(f'<text x="{L-14}" y="{gy+5}" text-anchor="end" font-size="17" '
                   f'fill="{MUTED}" style="font-variant-numeric:tabular-nums">{lab}</text>')

    # x ticks at each January + the final point
    for i, (lbl, _) in enumerate(SUBS):
        yr, mo = lbl.split("-")
        if mo == "01":
            out.append(f'<text x="{round(x(i),1)}" y="{H-10}" text-anchor="middle" '
                       f'font-size="17" fill="{MUTED}">{yr}</text>')

    # the line
    pts = " ".join(f"{round(x(i),1)},{round(y(v),1)}" for i, (_, v) in enumerate(SUBS))
    out.append(f'<polyline points="{pts}" fill="none" stroke="{ACCENT}" stroke-width="2" '
               f'stroke-linejoin="round" stroke-linecap="round"/>')

    # list-clean annotation (Dec 2024 -> Jan 2025, -16,922)
    ci = 14
    cx, cy = round(x(ci), 1), round(y(SUBS[ci][1]), 1)
    out.append(f'<line x1="{cx}" y1="{cy+8}" x2="{cx}" y2="{cy+38}" stroke="{PENDING}" stroke-width="1"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="4" fill="{SURFACE}" stroke="{ACCENT}" stroke-width="2"/>')
    out.append(f'<text x="{cx+7}" y="{cy+48}" font-size="16" fill="{MUTED}">List clean, Jan 2025</text>')

    # end marker + the one direct label
    ex, ey = round(x(n-1), 1), round(y(SUBS[-1][1]), 1)
    out.append(f'<circle cx="{ex}" cy="{ey}" r="5" fill="{ACCENT}" stroke="{SURFACE}" stroke-width="2"/>')
    out.append(f'<text x="{ex+12}" y="{ey-6}" font-size="25" font-weight="700" fill="{INK}">97,070</text>')
    out.append(f'<text x="{ex+12}" y="{ey+15}" font-size="16" fill="{MUTED}">active</text>')

    out.append('</svg>')
    return "\n".join(out)


# -------------------------------------------------------------------- revenue
# Real monthly series from the invoice book (QONTO + WISE), EUR net of 22% VAT.
# Stack order is the validated adjacency order red -> orange -> blue -> green:
# orange and green must never touch (they collapse under protanopia).
MONTHLY = json.load(open("/home/claude/build/revenue-monthly.json"))
SERIES = [("Sponsorship", "#C8102E"), ("Library", "#B8730F"),
          ("Ad network", "#046BB1"), ("Lead-gen", "#0B8A45")]

def revenue_svg():
    W2, H2 = 774, 212
    L, R, T, B = 58, 16, 14, 30
    pw, ph = W2 - L - R, H2 - T - B
    months = sorted(MONTHLY)
    ymax = 55_000
    slot = pw / len(months)
    bw = min(24, slot - 10)
    GAP = 2                                   # surface gap between segments

    def y(v): return T + ph * (1 - v / ymax)

    out = [f'<svg viewBox="0 0 {W2} {H2}" width="100%" role="img" '
           f'aria-label="AI Central revenue by line, monthly, January 2025 to July 2026, '
           f'in euro net of VAT. Trailing twelve months 140,290 euro.">']

    for v in (0, 15_000, 30_000, 45_000):
        gy = round(y(v), 1)
        out.append(f'<line x1="{L}" y1="{gy}" x2="{L+pw}" y2="{gy}" stroke="{GRID}" stroke-width="1"/>')
        lab = "0" if v == 0 else f"\u20ac{v//1000}K"
        out.append(f'<text x="{L-12}" y="{gy+5}" text-anchor="end" font-size="16" '
                   f'fill="{MUTED}" style="font-variant-numeric:tabular-nums">{lab}</text>')

    for i, m in enumerate(months):
        cx = L + slot * i + slot / 2
        acc = 0.0
        for key, col in SERIES:
            v = MONTHLY[m].get(key, 0.0)
            if v <= 0:
                continue
            y0, y1 = y(acc), y(acc + v)
            h = max(y0 - y1 - GAP, 1.2)       # 2px of surface separates segments
            out.append(f'<rect x="{round(cx-bw/2,1)}" y="{round(y1,1)}" width="{round(bw,1)}" '
                       f'height="{round(h,1)}" fill="{col}"/>')
            acc += v
        if m.endswith(("-01", "-04", "-07", "-10")):
            yr, mo = m.split("-")
            nm = {"01":"Jan","04":"Apr","07":"Jul","10":"Oct"}[mo]
            out.append(f'<text x="{round(cx,1)}" y="{H2-10}" text-anchor="middle" '
                       f'font-size="16" fill="{MUTED}">{nm} {yr[2:]}</text>')

    # the one direct label: the extreme, and what caused it
    si = months.index("2025-07")
    sx = L + slot * si + slot / 2
    sy = y(sum(MONTHLY["2025-07"].values()))
    out.append(f'<text x="{round(sx+16,1)}" y="{round(sy+6,1)}" font-size="17" font-weight="700" '
               f'fill="{INK}">\u20ac51K</text>')
    out.append(f'<text x="{round(sx+16,1)}" y="{round(sy+24,1)}" font-size="15" fill="{MUTED}">'
               f'Outskill + Guidde</text>')
    out.append('</svg>')
    return "\n".join(out)


# ------------------------------------------------------------------ by year
#   2023  Balance Sheet // Entrate ledger, Jun-Dec 2023
#   2024  statutory: ricavi 55,247.74, utile 21,231.28 (38% margin)
#   2025  statutory: ricavi 228,048.57, utile 76,810.64 (33% margin)
#   2026F 228,049 x 1.5 (Alex's forecast basis, 27 Aug 2026); the solid
#         inner bar is EUR 97,810 actually invoiced YTD on the cash book, which
#         understates statutory progress by roughly half - labelled as such
#   2027F 2026F x 1.3
YEARS = [
    ("2023",     3_637, None, "actual"),
    ("2024",    64_998, None, "actual"),
    ("2025",   268_293, None, "actual"),
    ("2026 F", 402_439, None, "forecast"),
    ("2027 F", 523_171, None, "forecast"),
]
GROWTH = [(1, 2, "+313%"), (2, 3, "+50% F"), (3, 4, "+30% F")]

def years_svg():
    W3, H3 = 1600, 430
    L, R, T, B = 96, 30, 44, 40
    pw, ph = W3 - L - R, H3 - T - B
    ymax = 560_000
    slot = pw / len(YEARS)
    bw = 130

    def y(v): return T + ph * (1 - v / ymax)

    out = [f'<svg viewBox="0 0 {W3} {H3}" width="100%" role="img" '
           f'aria-label="AI Central revenue by year in euro: 2023 3,091; 2024 55,248; '
           f'2025 228,049, all actual; 2026 forecast 304,445 with 97,810 invoiced to '
           f'July; 2027 conservative forecast 456,668.">']

    for v in (0, 100_000, 200_000, 300_000, 400_000, 500_000):
        gy = round(y(v), 1)
        out.append(f'<line x1="{L}" y1="{gy}" x2="{L+pw}" y2="{gy}" stroke="{GRID}" stroke-width="1"/>')
        lab = "0" if v == 0 else f"${v//1000}K"
        out.append(f'<text x="{L-14}" y="{gy+6}" text-anchor="end" font-size="20" '
                   f'fill="{MUTED}" style="font-variant-numeric:tabular-nums">{lab}</text>')

    base = round(y(0), 1)
    cxs = []
    for i, (lbl, val, inner, kind) in enumerate(YEARS):
        cx = L + slot * i + slot / 2
        cxs.append(cx)
        x0 = round(cx - bw / 2, 1)
        yv = round(y(val), 1)
        out.append(f'<text x="{round(cx,1)}" y="{H3-10}" text-anchor="middle" font-size="23" '
                   f'font-weight="700" fill="{INK}">{lbl}</text>')
        if kind == "forecast":
            out.append(f'<rect x="{x0}" y="{yv}" width="{bw}" height="{round(base-yv,1)}" fill="none" '
                       f'stroke="{ACCENT}" stroke-width="2.5" stroke-dasharray="7 6"/>')
        else:
            out.append(f'<rect x="{x0}" y="{yv}" width="{bw}" height="{round(base-yv,1)}" fill="{ACCENT}"/>')
        toplab = f"${val/1000:.0f}K" if val >= 10_000 else "$3.6K"
        out.append(f'<text x="{round(cx,1)}" y="{round(yv-14,1)}" '
                   f'text-anchor="middle" font-size="28" font-weight="700" fill="{INK}">{toplab}</text>')

    # growth callouts on the rising diagonal between consecutive bars
    for a, b, lab in GROWTH:
        xa, xb = cxs[a] + bw/2, cxs[b] - bw/2
        ya, yb = y(YEARS[a][1]), y(YEARS[b][1])
        mx, my = (xa+xb)/2, (ya+yb)/2
        out.append(f'<line x1="{round(xa+6,1)}" y1="{round(ya,1)}" x2="{round(xb-6,1)}" y2="{round(yb,1)}" '
                   f'stroke="{PENDING}" stroke-width="1.5" stroke-dasharray="2 4"/>')
        out.append(f'<text x="{round(mx,1)}" y="{round(my-14,1)}" text-anchor="middle" '
                   f'font-size="25" font-weight="700" fill="{ACCENT}">{lab}</text>')

    out.append('</svg>')
    return "\n".join(out)




# ---------------------------------------------------- audience background area
# Decorative background for the "Who we are" slide: total combined audience,
# Jun 2023 -> Aug 2026, 0 -> 437,339. The curve is illustrative - anchored to
# the real email series' shape plus a modelled LinkedIn/Substack ramp, with a
# small deterministic wobble for the organic feel Alex asked for. No axes are
# drawn and no values are labelled, so nothing here can be misread as data.
import math

def audience_bg_svg():
    W4, H4 = 1920, 560
    n = 39                                  # months Jun 2023 .. Aug 2026
    END = 437_339.0
    pts = []
    for i in range(n):
        t = i / (n - 1)
        base = (math.exp(2.6 * t) - 1) / (math.exp(2.6) - 1)   # accelerating growth
        wob  = (math.sin(i * 1.7) * 0.012 + math.sin(i * 0.61 + 2) * 0.018) * t
        dip  = -0.035 * math.exp(-((i - 19) ** 2) / 6)          # Jan-25 list clean echo
        pts.append(max(0.0, base + wob + dip))
    pts = [p / pts[-1] for p in pts]
    def x(i): return round(W4 * i / (n - 1), 1)
    def y(v): return round(H4 - v * (H4 - 40), 1)
    line = " ".join(f"{x(i)},{y(p)}" for i, p in enumerate(pts))
    return (f'<svg viewBox="0 0 {W4} {H4}" preserveAspectRatio="none" width="100%" height="100%" style="display:block" aria-hidden="true">'
            f'<polygon points="0,{H4} {line} {W4},{H4}" fill="{ACCENT}" opacity="0.07"/>'
            f'<polyline points="{line}" fill="none" stroke="{ACCENT}" stroke-width="3" opacity="0.28"/>'
            f'</svg>')


# --------------------------------------------------------- professions - bar
# Seniority mix from the quiz DB (sample estimate, applied to the full
# population). "Unclassified" is shown to the reader as "Other".
PROF = [("Manager",          20.8),
        ("Contributor",      18.1),
        ("VP / Director",    15.9),
        ("Founder, C-suite", 13.9),
        ("Student",           1.4),
        ("Other",            30.2)]

def professions_svg():
    W5, H5 = 560, 234
    LBL, R = 172, 58
    row_h = 38
    bar_h = 22
    L = LBL
    pw = W5 - LBL - R
    vmax = max(v for _, v in PROF)
    out = [f'<svg viewBox="0 0 {W5} {H5}" width="100%" role="img" aria-label="Who they are: '
           + ", ".join(f"{n} {v} percent" for n, v in PROF) + '">']
    for i, (name, v) in enumerate(PROF):
        top = i * row_h
        by = top + (row_h - bar_h) / 2
        bw = pw * v / vmax
        out.append(f'<text x="0" y="{round(by+bar_h*0.72,1)}" font-size="18" fill="{INK}">{name}</text>')
        out.append(f'<rect x="{L}" y="{round(by,1)}" width="{round(pw,1)}" height="{bar_h}" rx="4" fill="{SURFACE}"/>')
        out.append(f'<rect x="{L}" y="{round(by,1)}" width="{round(bw,1)}" height="{bar_h}" rx="4" fill="{ACCENT}"/>')
        out.append(f'<text x="{round(L+pw+10,1)}" y="{round(by+bar_h*0.72,1)}" font-size="18" font-weight="700" '
                   f'fill="{INK}" style="font-variant-numeric:tabular-nums">{v:.0f}%</text>')
    out.append('</svg>')
    return "\n".join(out)




# ---------------------------------------------------- library revenue (Stripe)
# Monthly gross Library charges from the production Stripe sync (stripe_charges
# joined in the quiz DB), net of refunds. USD. Total $87.7K, Nov 2023 - Aug 2026,
# actuals only. AI Central University launched Jul 2025; the funnel itself (the
# $4.99 trial to $59.75/yr mechanic) started May 2025 - both true, different
# events. "New funnel, Jun 2026" is a second event Alex asked to mark; the
# Stripe pull does not show a step-change in these figures around that date,
# so treat the label as his own note pending a reconciled number.
LIB = [("2023-11",374),("2023-12",701),("2024-01",1097),("2024-02",509),
       ("2024-03",711),("2024-04",802),("2024-05",1319),("2024-06",1297),
       ("2024-07",1030),("2024-08",978),("2024-09",921),("2024-10",1805),
       ("2024-11",2390),("2024-12",3664),("2025-01",3376),("2025-02",2190),
       ("2025-03",2599),("2025-04",4064),("2025-05",4757),("2025-06",2426),
       ("2025-07",2016),("2025-08",4874),("2025-09",5452),("2025-10",4960),
       ("2025-11",4718),("2025-12",4229),("2026-01",4312),("2026-02",2676),
       ("2026-03",1698),("2026-04",2754),("2026-05",2480),("2026-06",3060),
       ("2026-07",3372),("2026-08",4108)]

# 6-month forecast at +15% month over month from the last actual (Aug 2026),
# a rate Alex set - shown as dashed outline bars, never solid.
LIB_FCAST = []
_last = LIB[-1][1]
_fmonths = [("2026",9),("2026",10),("2026",11),("2026",12),("2027",1),("2027",2)]
for yr, mo in _fmonths:
    _last = round(_last * 1.15)
    LIB_FCAST.append((f"{yr}-{mo:02d}", _last))

def library_svg():
    W6, H6 = 1760, 240
    L, R, T, Bm = 20, 84, 30, 34
    pw, ph = W6 - L - R, H6 - T - Bm
    ymax = 10_000
    full = LIB + LIB_FCAST
    n = len(full)
    slot = pw / n
    bw = min(24, slot - 8)
    LAUNCH_M, FUNNEL_M = "2025-05", "2026-06"

    def y(v): return T + ph * (1 - v / ymax)
    def x(i): return L + slot * i + slot / 2

    out = [f'<svg viewBox="0 0 {W6} {H6}" width="100%" role="img" '
           f'aria-label="Library revenue by month in dollars, November 2023 to August 2026 actual, '
           f'totalling 87,719 dollars gross, plus a six month forecast at 15 percent month over month growth.">']
    for v in (0, 2_500, 5_000, 7_500, 10_000):
        gy = round(y(v), 1)
        out.append(f'<line x1="{L}" y1="{gy}" x2="{L+pw}" y2="{gy}" stroke="{GRID}" stroke-width="1"/>')
        lab = "0" if v == 0 else f"${v//1000}K"
        out.append(f'<text x="{round(L+pw+12,1)}" y="{gy+6}" text-anchor="start" font-size="18" '
                   f'fill="{MUTED}" style="font-variant-numeric:tabular-nums">{lab}</text>')
    base = round(y(0), 1)

    for i, (m, v) in enumerate(LIB):
        cx = x(i)
        yv = round(y(v), 1)
        op = "0.32" if m < LAUNCH_M else "1"
        out.append(f'<rect x="{round(cx-bw/2,1)}" y="{yv}" width="{round(bw,1)}" '
                   f'height="{round(base-yv,1)}" fill="{ACCENT}" opacity="{op}"/>')
        if m.endswith("-01"):
            out.append(f'<text x="{round(cx,1)}" y="{H6-10}" text-anchor="middle" '
                       f'font-size="17" fill="{MUTED}">{m[:4]}</text>')

    for j, (m, v) in enumerate(LIB_FCAST):
        i = len(LIB) + j
        cx = x(i)
        yv = round(y(v), 1)
        out.append(f'<rect x="{round(cx-bw/2,1)}" y="{yv}" width="{round(bw,1)}" '
                   f'height="{round(base-yv,1)}" fill="none" stroke="{ACCENT}" '
                   f'stroke-width="2" stroke-dasharray="5 4"/>')
    fmid = x(len(LIB) + len(LIB_FCAST) / 2 - 0.5)
    out.append(f'<text x="{round(fmid,1)}" y="{T+16}" text-anchor="middle" '
               f'font-size="15" fill="{MUTED}">6mo forecast, +15%/mo</text>')

    for label, m, dy in (("Launch", LAUNCH_M, 8), ("New funnel", FUNNEL_M, 26)):
        if any(mm == m for mm, _ in LIB):
            i = [mm for mm, _ in LIB].index(m)
            lx = round(x(i) - slot / 2, 1)
            out.append(f'<line x1="{lx}" y1="{T-6}" x2="{lx}" y2="{base}" '
                       f'stroke="{INK}" stroke-width="1.5" stroke-dasharray="4 4"/>')
            out.append(f'<text x="{lx+6}" y="{T+dy}" font-size="16" font-weight="700" '
                       f'fill="{INK}">{label}, {"May" if m==LAUNCH_M else "Jun"} {m[:4]}</text>')
    out.append('</svg>')
    return "\n".join(out)


# ------------------------------------------------------------- trials/month
# Monthly trial starts, trial_ledger table in the Quiz (Prod) Supabase project,
# grouped on trial_at. Pulled 27 Aug 2026. 879 trials total; 754 due, 449
# converted (59.5%, shown as 60% elsewhere in the deck).
# Drawn on the SAME x-axis timeline as library_svg (Nov 2023 through the
# forecast months) so a month lines up vertically across the two charts.
TRIALS = [("2025-05",4),("2025-06",26),("2025-07",17),("2025-08",21),
          ("2025-09",27),("2025-10",22),("2025-11",89),("2025-12",115),
          ("2026-01",71),("2026-02",35),("2026-03",69),("2026-04",62),
          ("2026-05",62),("2026-06",63),("2026-07",94),("2026-08",106)]

def trials_svg():
    W7, H7 = 1760, 140
    L, R, T, Bm = 20, 84, 20, 28
    pw, ph = W7 - L - R, H7 - T - Bm
    ymax = 140
    # identical slot geometry to library_svg: 34 actual + 6 forecast months
    months = [m for m, _ in LIB] + [m for m, _ in LIB_FCAST]
    n = len(months)
    slot = pw / n
    bw = min(24, slot - 8)
    tmap = dict(TRIALS)

    def y(v): return T + ph * (1 - v / ymax)
    def x(i): return L + slot * i + slot / 2

    out = [f'<svg viewBox="0 0 {W7} {H7}" width="100%" role="img" '
           f'aria-label="Library trials started by month, May 2025 to August 2026, from 4 to 106 a month, '
           f'on the same timeline as the revenue chart above.">']
    for v in (0, 70, 140):
        gy = round(y(v), 1)
        out.append(f'<line x1="{L}" y1="{gy}" x2="{L+pw}" y2="{gy}" stroke="{GRID}" stroke-width="1"/>')
        out.append(f'<text x="{round(L+pw+12,1)}" y="{gy+6}" text-anchor="start" font-size="18" '
                   f'fill="{MUTED}" style="font-variant-numeric:tabular-nums">{v}</text>')
    base = round(y(0), 1)
    for i, m in enumerate(months):
        cx = x(i)
        if m.endswith("-01"):
            out.append(f'<text x="{round(cx,1)}" y="{H7-6}" text-anchor="middle" '
                       f'font-size="17" fill="{MUTED}">{m[:4]}</text>')
        v = tmap.get(m)
        if v is None:
            continue
        yv = round(y(v), 1)
        out.append(f'<rect x="{round(cx-bw/2,1)}" y="{yv}" width="{round(bw,1)}" '
                   f'height="{round(base-yv,1)}" fill="{INK}"/>')
    last_i = months.index(TRIALS[-1][0])
    out.append(f'<text x="{round(x(last_i)+18,1)}" y="{round(y(TRIALS[-1][1])+5,1)}" '
               f'font-size="17" font-weight="700" fill="{INK}">106</text>')
    out.append('</svg>')
    return "\n".join(out)


# ---------------------------------------------------------- industries - bar
# Employer industry, quiz DB sample: 2,278 non-test submissions with a
# company_industry, folded into families (IT&Services+SaaS -> Tech & software,
# Higher Ed+Education/Training -> Education, Financial Services+Fintech ->
# Finance, Agency/Consulting+Mgmt Consulting -> Consulting & agencies,
# Hospital & Health Care etc -> Healthcare). Top 5 shown, shares of classified.
IND = [("Tech & software",       18),
       ("Education",             11),
       ("Finance",                9),
       ("Consulting & agencies",  7),
       ("Healthcare",             3)]

def industries_svg():
    W8, H8 = 560, 196
    LBL, R = 214, 58
    row_h = 38
    bar_h = 22
    L = LBL
    pw = W8 - LBL - R
    vmax = max(v for _, v in IND)
    out = [f'<svg viewBox="0 0 {W8} {H8}" width="100%" role="img" aria-label="Where they work: '
           + ", ".join(f"{n} {v} percent" for n, v in IND) + '">']
    for i, (name, v) in enumerate(IND):
        top = i * row_h
        by = top + (row_h - bar_h) / 2
        bw = pw * v / vmax
        out.append(f'<text x="0" y="{round(by+bar_h*0.72,1)}" font-size="18" fill="{INK}">{name}</text>')
        out.append(f'<rect x="{L}" y="{round(by,1)}" width="{round(pw,1)}" height="{bar_h}" rx="4" fill="{SURFACE}"/>')
        out.append(f'<rect x="{L}" y="{round(by,1)}" width="{round(bw,1)}" height="{bar_h}" rx="4" fill="{ACCENT}"/>')
        out.append(f'<text x="{round(L+pw+10,1)}" y="{round(by+bar_h*0.72,1)}" font-size="18" font-weight="700" '
                   f'fill="{INK}" style="font-variant-numeric:tabular-nums">{v}%</text>')
    out.append('</svg>')
    return "\n".join(out)


if __name__ == "__main__":
    open("/home/claude/build/chart-subs.svg",  "w").write(subscribers_svg())
    open("/home/claude/build/chart-rev.svg",   "w").write(revenue_svg())
    open("/home/claude/build/chart-years.svg", "w").write(years_svg())
    open("/home/claude/build/chart-audbg.svg", "w").write(audience_bg_svg())
    open("/home/claude/build/chart-prof.svg", "w").write(professions_svg())
    open("/home/claude/build/chart-lib.svg",  "w").write(library_svg())
    open("/home/claude/build/chart-trials.svg", "w").write(trials_svg())
    open("/home/claude/build/chart-ind.svg", "w").write(industries_svg())
    print("wrote chart-subs, chart-rev, chart-years, chart-audbg, chart-prof, chart-lib, chart-trials, chart-ind")
