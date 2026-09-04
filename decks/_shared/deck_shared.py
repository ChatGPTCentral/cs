"""Shared tokens and render helpers for the AI Central sales decks (media
kit, media kit enterprise, case studies, case studies extended).

Anything here should look and behave identically across every deck that
imports it - edit once, every deck picks it up on its next build. Slide
CONTENT that genuinely differs between variants (the enterprise rate-card
slide, the extended case-study narratives) stays in each deck's own build
script - it was never shared, so forcing it in here would just hide real
differences behind a shared file.

Added 4 Sep 2026 after a same-day palette fix required hand-editing the
accent color in four separate files plus three SVGs, and a copy-paste
mismatch between two of them (Europe/Asia legend colors) shipped briefly
as a result. See MEDIA-KIT-SOURCES.md, "Revision, 4 Sep 2026".
"""
import re

# ── AI Central brand palette (ai-central-brand skill, SKILL.md #4) ─────────
PALETTE = {
    "jet_black": "#333333",
    "cosmic_latte": "#FEF7E7",
    "baby_powder": "#FFFDFA",
    "azul": "#046BB1",
    "persian_red": "#BE3B3B",
    "jasper": "#BE593B",
    "fulvous": "#E48715",
    "xanthous": "#E7B02F",
    "asparagus": "#62A758",
    "viridian": "#2D8879",
    "verdigris": "#38A7AD",
    "marian_blue": "#3B4C99",
    "rose_pompadour": "#E26F8E",
    "battleship_grey": "#9C9C9C",
}

# Semantic roles (Alex, 4 Sep 2026): red reads as "bad" only, green as
# "good". Azul and xanthous are the default accents for contrast - never a
# reflexive red. Use GOOD/BAD only where a figure is genuinely a hit or a
# miss, not as a decorative choice.
ACCENT = PALETTE["azul"]
ACCENT_2 = PALETTE["xanthous"]
GOOD = PALETTE["asparagus"]
BAD = PALETTE["persian_red"]

# Deck-local neutrals (not brand-palette colors - tint/ink/muted shades
# matching the shared CSS's --tint/--ink/--muted/--hair, used directly in
# inline SVG where a CSS var() can't reach)
SURFACE, GRID, INK, MUTED = "#F3F1EC", "#E3DFD7", "#141414", "#6E6E6E"

FOOT = '<div class="foot">AI CENTRAL</div>'


def make_renumber(deck_label):
    """Binds a renumber(sec, n) to this deck's footer label, e.g.
    make_renumber("MEDIA KIT Q3 2026") or make_renumber("CASE STUDIES · EXTENDED")."""
    def renumber(sec, n):
        sec = re.sub(r'<!-- \d\d ─+', f'<!-- {n:02d} ' + '─' * 73, sec, count=1)
        sec = sec.replace('<div class="foot">AI CENTRAL</div>',
                          f'<div class="foot">AI CENTRAL &nbsp;·&nbsp; {deck_label} &nbsp;·&nbsp; {n:02d}</div>')
        return sec.rstrip()
    return renumber


# ── media kit helpers ────────────────────────────────────────────────────
def label(t, col="var(--accent)", size=20):
    return f'<div style="font-size:{size}px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:{col}">{t}</div>'


def bullets(items, size=21, gap=7):
    return "".join(
        f'<div style="display:flex;gap:12px;padding:{gap}px 0;border-top:1px solid rgba(0,0,0,.08)">'
        f'<div style="width:7px;height:7px;border-radius:50%;background:var(--accent);flex:none;margin-top:{size*0.55:.0f}px"></div>'
        f'<div style="font-size:{size}px;font-weight:300;line-height:1.35">{i}</div></div>' for i in items)


def usecase(n_, title, intro, items):
    return f'''<div data-step="{n_}" style="background:var(--tint);padding:26px 30px;min-height:600px;display:flex;flex-direction:column">
      <div style="font-size:17px;font-weight:700;letter-spacing:.16em;color:var(--muted)">0{n_}</div>
      <div style="margin-top:6px;font-size:27px;font-weight:700;letter-spacing:-.01em">{title}</div>
      <div style="margin-top:8px;font-size:20px;font-weight:300;line-height:1.35;color:#3A3A3A">{intro}</div>
      <div style="margin-top:12px;flex:1;display:flex;flex-direction:column;justify-content:space-evenly">{bullets(items, 20, 6)}</div>
    </div>'''


# ── case studies helpers ─────────────────────────────────────────────────
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
        {label("Objective", "var(--accent)", 18)}
        <div style="margin-top:6px;font-size:20px;font-weight:300;line-height:1.4">{objective}</div>
        <div style="margin-top:14px">{label("What we ran", "var(--accent)", 18)}</div>
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
