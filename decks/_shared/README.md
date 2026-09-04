# Shared deck helpers

`deck_shared.py` holds the brand palette, semantic color roles, and the
render helpers that are byte-identical across the media kit and case
studies decks (`label`, `bullets`, `usecase`, `bars_svg`, `stat`, `case`,
plus the `renumber`/footer pattern via `make_renumber(deck_label)`).

Added 4 Sep 2026. Before this, the four build scripts each hardcoded their
own copy of these colors and helpers. A same-day palette fix (red to azul)
meant hand-editing the accent color in four Python files plus three SVGs,
and one of those edits introduced a mismatch between two files (the map's
Europe/Asia legend colors) that shipped briefly before being caught. See
`../media-kit/MEDIA-KIT-SOURCES.md`, "Revision, 4 Sep 2026."

**What's shared here vs. what stays in each deck's own build script:**
anything that's supposed to look and behave identically across variants -
brand colors, chart/card helpers, the footer format - lives here. Slide
*content* that genuinely differs between variants - the Enterprise kit's
consolidated no-price formats slide, the Extended case studies' rewritten
per-client narratives - stays in each script. Those aren't a shared
component with a toggle; they're separately authored content, and forcing
them into one conditional-laden file would make already-simple, reviewable
scripts harder to read for no shared benefit.

**Runtime note:** the build scripts (`mediakit.py`, `mediakit_enterprise.py`,
`casestudies.py`, `casestudies_extended.py`) all run with
`/home/claude/build/` as the working root and `sys.path.insert(0, ...)` that
directory before `import deck_shared` - same pattern already used for
`_head.html`, `_tail.html`, `mk3-assets.json` and the chart SVGs. This copy
in `decks/_shared/` is the version-controlled source of truth; keep the
`/home/claude/build/deck_shared.py` working copy in sync with it (copy this
file there) before rebuilding any deck.

**Editing a shared value:** change it once in `deck_shared.py`, copy it to
`/home/claude/build/deck_shared.py`, then rebuild all four decks
(`mediakit.py` + `build_mk.py`, `mediakit_enterprise.py` +
`build_mk_enterprise.py`, `casestudies.py`, `casestudies_extended.py`) and
re-run `qa.js` on each before committing - a shared-file change touches
every deck at once, so it's worth confirming all four still render clean.
