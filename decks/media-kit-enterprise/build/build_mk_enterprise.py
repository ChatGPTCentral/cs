import json, re, pathlib

B = pathlib.Path("/home/claude/build")
assets = json.load(open(B / "assets.json"))
html = (B / "mk-enterprise.template.html").read_text()
html = html.replace("<title>AI Central - Strategic Overview</title>", "<title>AI Central - Partnership &amp; Media Kit, Enterprise Edition</title>")

for w in (300, 400, 500, 700):
    html = html.replace(f"__FONT_{w}__", assets["fonts"][str(w)])
for name, uri in assets["icons"].items():
    html = html.replace("__ICON_" + name.upper().replace("-", "_") + "__", uri)

html = html.replace("__CHART_PROF__", (B / "chart-prof.svg").read_text())
html = html.replace("__CHART_IND__",  (B / "chart-ind.svg").read_text())
html = html.replace("__CHART_MAP__",  (B / "chart-map.svg").read_text())

left = re.findall(r"__[A-Z0-9_]+__", html)
if left:
    raise SystemExit("unsubstituted placeholders: " + ", ".join(sorted(set(left))))

out = pathlib.Path("/home/claude/repo/AI-Central-Media-Kit-Enterprise-Q3-2026.html")
out.write_text(html)
print(f"wrote {out}  ({out.stat().st_size/1024:.0f} KB)")
