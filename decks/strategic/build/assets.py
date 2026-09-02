import base64, json, os, re, urllib.parse
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options

DS = "/home/claude/repo/project/_ds/ai-central-media-official-design-system-019dc18e-f216-7d94-bd9f-f65518d6ec82"
LUC = "/tmp/claude-0/-home-claude/d6aea6eb-35c4-5830-952d-9c99a50ab850/scratchpad/node_modules/lucide-static/icons"

# Latin + punctuation + the specific glyphs this deck uses (· → € ≈ ↗ – — ’ “ ”)
UNI = "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+2192,U+2197,U+20AC,U+2122,U+2212,U+2248,U+00B7,U+2013-2014"

fonts = {}
for w, name in [(300,"Light"),(400,"Regular"),(500,"Medium"),(700,"Bold")]:
    src = f"{DS}/fonts/Inter-{name}.ttf"
    f = TTFont(src)
    opts = Options()
    opts.layout_features = ["kern","liga","calt","tnum"]
    opts.desubroutinize = True
    opts.notdef_outline = True
    sub = Subsetter(options=opts)
    sub.populate(unicodes=[c for r in UNI.split(",") for c in
                 (range(int(r.split("-")[0][2:],16), int(r.split("-")[1],16)+1)
                  if "-" in r else [int(r[2:],16)])])
    sub.subset(f)
    f.flavor = "woff2"
    out = f"/home/claude/build/Inter-{name}.woff2"
    f.save(out)
    b = open(out,"rb").read()
    fonts[w] = base64.b64encode(b).decode()
    print(f"  Inter {w} {name}: {os.path.getsize(src)//1024}KB TTF -> {len(b)//1024}KB woff2")

ICONS = ["newspaper","graduation-cap","mic","users","layers","file-text",
         "badge-check","mail","quote","book-open","camera"]
icons = {}
for n in ICONS:
    svg = open(f"{LUC}/{n}.svg").read()
    # Deterministic ink: currentColor does not inherit into a background-image.
    svg = svg.replace('stroke="currentColor"', 'stroke="#141414"')
    svg = re.sub(r'\s+', ' ', svg).strip()
    icons[n] = "data:image/svg+xml," + urllib.parse.quote(svg, safe="")
    print(f"  icon {n}: {len(icons[n])} bytes")

json.dump({"fonts":fonts,"icons":icons}, open("/home/claude/build/assets.json","w"))
print("total font payload:", sum(len(v) for v in fonts.values())//1024, "KB base64")
