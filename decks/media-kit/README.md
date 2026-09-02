# AI Central - Partnership & Media Kit, Q3 2026

Advertiser-facing deck, 13 slides. Standalone HTML with click-to-reveal steps,
plus a PDF export. Every figure traces to `MEDIA-KIT-SOURCES.md`.

Shares its CSS, navigation, fonts, charts and world map with the strategic
deck in `../strategic/build/` - build that first, then:

```
python3 mediakit.py     # assemble slides -> mk.template.html
python3 build_mk.py     # inline fonts, charts, images -> the HTML
DECK=/abs/path/AI-Central-Media-Kit-Q3-2026.html PDF=/abs/out.pdf node qa.js
```

`qa.js` is the generic checker: overflow and footer collisions per slide in
print layout, optional screenshots (`SHOTS=dir`) and PDF export (`PDF=file`).
It waits for all font weights before printing.

Rate card is the Q2 2026 reference (`02_products_pricing.md`) and needs
confirmation before the kit goes out. Secondary Ad, Tools Ad, Dedicated Issue,
Welcome Sequence and Website Banner have no list price and show "on request".
