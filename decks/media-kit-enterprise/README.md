# AI Central - Partnership & Media Kit, Enterprise Edition

Forked from `../media-kit/` on 4 Sep 2026, at Alex's request, to split the
kit by audience: this edition has **no prices anywhere** and is for external
stakeholders and enterprise sales, where pricing is bespoke or not the
relevant question yet. The priced edition in `../media-kit/` stays for
transactional sales (CMOs, GTM/influencer-marketing operators) and is
unchanged by this fork.

11 slides (down from 14): the four rate-card slides (Advertising options
overview + Carousel/Main Ad/Email deep-dives) collapse into one consolidated
"Eight ways to reach them" overview slide with no numbers, per Alex's
decision on 4 Sep 2026. Same eight formats, same descriptions, everywhere
else word-for-word identical to `../media-kit/` unless noted in
`MEDIA-KIT-ENTERPRISE-SOURCES.md`.

Shares CSS, navigation, fonts, charts and world map with the strategic deck,
same as `../media-kit/`:

```
python3 mediakit_enterprise.py     # assemble slides -> mk-enterprise.template.html
python3 build_mk_enterprise.py     # inline fonts, charts, images -> the HTML
DECK=/abs/path/AI-Central-Media-Kit-Enterprise-Q3-2026.html PDF=/abs/out.pdf node qa.js
```

Does not auto-sync to `ChatGPTCentral/media-kit` (that workflow is scoped to
`decks/media-kit/**` only) - add this path to
`.github/workflows/sync-media-kit.yml` if this edition also needs to mirror
there.
