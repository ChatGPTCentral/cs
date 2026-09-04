# AI Central - Case Studies, Extended Edition

Forked from `../case-studies/` on 4 Sep 2026, at Alex's request, to pair
with the Enterprise media kit: same audience split, this edition drops
every dollar figure and expands each client one-pager with a deeper
narrative headline and objective. The ROI-focused edition in
`../case-studies/` keeps its price-anchored framing for transactional sales
and is unchanged by this fork.

Same 8 slides as `../case-studies/` (cover, renewals table, five client
one-pagers, closing) - stats, charts and benchmark boxes are byte-identical
to the original; only the narrative headline/objective text per client
changed, plus pricing removed from the closing slide. See
`CASE-STUDIES-EXTENDED-SOURCES.md` for exactly what changed and why.

Single-step build, same as `../case-studies/`:

```
python3 casestudies_extended.py     # assemble + inline -> the final HTML
DECK=/abs/path/AI-Central-Case-Studies-Extended-2026.html PDF=/abs/out.pdf node qa.js
```

Data provenance (email/carousel figures, the Direct-only filtering rule,
the $75 CPM benchmark, etc.) is identical to the original and lives in
`../case-studies/CASE-STUDIES-SOURCES.md` - not duplicated here.
