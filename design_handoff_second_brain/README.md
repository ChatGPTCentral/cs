# Handoff: Inbox Ledger → second brain mission control

## Overview
Restyle and re-structure of the **Inbox Ledger** platform (`platform/` in repo `ChatGPTCentral/cs`, Next.js App Router, plain CSS in `app/globals.css`, Supabase over PostgREST, ledger markdown in `data/ledger`). The 13-link top bar becomes a left rail with three groups; the home page answers three questions (today's meetings, overdue, open tasks); the story page gets a property block or a dossier rail; a command palette and a one-line quick capture are added. Visual language: the AI Central design system (Inter, baby-powder paper, jet-black hairlines, radius 0, fulvous accent).

## About the design files
The `.dc.html` files are **design references built in HTML** - - interactive prototypes showing the intended look and behavior. They are NOT production code to copy. Recreate them inside the existing Next.js app, reusing its patterns: server components in `app/*/page.jsx`, Server Actions (`actions.js`), `TableCellInput` for inline edits, `Avatar`, `SavedToast`, `supabaseSelect`, the markdown pipeline in `lib/ledger.js`. Replace the Notion palette in `globals.css` with the tokens below; keep every existing route working.

Open `Second Brain Mission Control.dc.html` in a browser (keep `support.js`, `BrainRail.dc.html`, `_ds/`, `assets/`, `public/` beside it). It is a pan-zoom canvas with five screens: **1a Today**, **1b Story · document**, **1c Story · dossier**, **1d Command palette**, **1e Quick capture**. `Current Inbox Ledger (Recreation).dc.html` is today's platform, for before/after.

**Pick one story layout**: 1b (document) or 1c (dossier). Both are complete; the owner has not chosen yet. Everything else is one design.

## Fidelity
**High-fidelity.** Colors, type sizes, weights, spacing, borders and copy are final. Recreate pixel-perfectly. Sample data is real ledger content as of 8-13 Sep 2026 but hard-coded in the mocks; wire every value to the queries listed under "Data mapping". UI copy is **English** (today's Italian labels are translated in the mocks - - use the mock copy).

## Design tokens
Add to `globals.css` (`:root`), replacing the Notion set:

- Page `--ground: #FFFDFA` (baby powder, never pure white) · white plates `#FFFFFF` · rail `#FBF7EE` · hover/sunk `#F4EFE5` · table row hover `#FBF6E9` · latte `#FEF7E7` (active nav, table header bands, strategy plate, selected palette row)
- Ink `#1A1A1A` (titles, values) · body `#333333` · secondary `#4A4A4A` · muted `#6B6B6B` · faint `#9C9C9C`
- Borders: structural `1px #333333`; hairline `#E8E2D4`; row separator `#F1ECE2`; chip border `#C9C2B4`; avatar fallback `#EDE8DF`
- Accent: fulvous `#E48715` (active nav bar, capture, unlinked-mention `+`, parsed-chip underline), on-latte text `#B26A00`; xanthous `#E7B02F` (only on black plates: "Waiting on them" label, `↵` in the primary button)
- Links `#046BB1` (azul), no underline, underline on hover
- Overdue / late `#BE3B3B` (persian red) · done `#62A758` (asparagus)
- Story kinds (dots, 7-8px squares): moment `#E7B02F`, thread `#046BB1`, event `#2D8879`, sale `#3B4C99`, internal/other `#9C9C9C`
- **Radius 0 everywhere.** Kill `--radius`, pills (`.list-tab` 999px), rounded avatars (squares now)
- Shadows: none in the app, except the command palette `0 8px 24px rgba(0,0,0,0.18)`
- Motion: 120-220ms `cubic-bezier(0.2,0,0,1)`; hover = background shift to latte/sunk or underline, never scale
- Type: Inter only (self-host from `_ds/.../fonts` or keep the Google import). Page title 30px/800/-0.03em/line-height 1, sentence case, no terminal period. Eyebrow 10px/700/uppercase/+0.12em `#9C9C9C`. Section label 11px/800/uppercase/+0.1em `#1A1A1A` with the count after it in `#9C9C9C` (or `#BE3B3B` for overdue). Body 13-14px/1.5; table cells 13px; meta 12-12.5px; kbd/dents 10-11px/700. `font-variant-numeric: tabular-nums` on every number, time and date
- Icons: Lucide-style inline SVG, 14px, stroke 1.75, round caps - - paths are in `BrainRail.dc.html` `<symbol>`s (calendar, sunrise, check-square, book-open, users, building, history, share, inbox, link, user-plus, settings, zap, search)

## Shell (replaces `header.top` + `.topnav` in `app/layout.jsx`)
Reference: `BrainRail.dc.html`. Body becomes `display:flex`: 232px rail (sticky, full height) + `<main>` (flex 1). Content column inside main: `max-width: 880px; margin: 0 auto; padding: 36px 48px 72px` (the `.page` 860px column moves here; `.wide-content` pages can go full width).

Rail (`#FBF7EE`, `border-right: 1px solid #E8E2D4`):
- Brand row, padding 16px 14px 12px: `public/logo-dark.svg` 24px + "Second brain" 13.5px/800 `#1A1A1A` -0.02em + eyebrow "AI CENTRAL · MISSION CONTROL" 9px/700/+0.14em `#9C9C9C`
- Search plate: 30px tall, `#FFFDFA`, `1px solid #333333`, margin 0 14px 6px, padding 0 9px; search icon 13px `#6B6B6B`; "Search or jump to" 12px `#6B6B6B`; right kbd `⌘K` 9.5px/700 `#4A4A4A` in a `1px #C9C2B4` box. Opens the command palette (1d)
- Capture plate: 30px, `1px dashed #C9C2B4`, zap icon in fulvous, "Capture" 12px/600, kbd `C`. Hover: border fulvous, bg latte. Opens quick capture (1e)
- Groups: (no label) **Today** `/`, **Brief** `/brief`, **Closing** `/closing` · eyebrow **BRAIN**: Stories `/stories` (count 166), People `/people` (629), Companies `/clienti` (41), Genesis `/genesis`, Network `/network` · eyebrow **QUEUES**: Review people `/people/review` (pending count), Link proposals `/links/review` (pending count), Leads `/leads`. Group eyebrows 9.5px/700/+0.14em `#9C9C9C`, margin 14px 0 3px, padding-left 17px
- Items 30px tall, 13px, padding 0 14px, gap 9px, `border-left: 3px solid transparent`. Inactive: `#4A4A4A` 500, icon `#9C9C9C`, hover bg `#F4EFE5`. **Active**: bg `#FEF7E7`, border-left `#E48715`, text `#1A1A1A` 700, icon `#1A1A1A`. Counts right-aligned 11px/600 `#6B6B6B` tabular
- Footer above a `1px #E8E2D4` rule: Settings item (same style) + identity row: 24px black square "AF" 9.5px/800 `#FEF7E7` on `#333333`, "Alex Fiore" 12px/600, email 10.5px `#9C9C9C`
- Main top bar (every page): 40px, padding 0 28px, 12px `#6B6B6B`; left breadcrumb ("Stories / GTA whitepaper", current segment `#1A1A1A` 600, separator `/` in `#C9C2B4`); right contextual dents (`1px #333333` boxes, 11px/700, padding 3px 8px) e.g. "Morning brief sent ✓", "Open in Gmail ↗", "On Genesis →"
- Remove the `footer.snapshot-note`; the "Ledger read 07:30 · refresh with /ledger" line in the top bar replaces it

## Screens

### 1a · Today (`app/nba/page.jsx`, served at `/`)
Column header: eyebrow "SATURDAY · 13 SEPTEMBER 2026 · WEEK 37" (live date); title "Today" 30px/800; right, on the same baseline, a **dent strip** - - one `1px #333333` frame, cells separated by `1px #333333`, 12px/700 tabular, padding 6px 12px: "3 meetings" · "9 overdue" (`#BE3B3B`) · "8 open tasks" · "your move on 6" (`#6B6B6B` 500). Under the title a one-paragraph summary 14px `#4A4A4A` max 62ch (from the brief/ledger intro, or drop if none).

Section pattern: label row `display:flex; justify-content:space-between; margin: 36px 0 8px` - - left 11px/800 uppercase label + count, right 12px `#9C9C9C` note or link.

1. **Meetings** (`ledger_upcoming_meetings`, today only) - - a `1px #333333` plate on white, rows separated by `1px #E8E2D4`, padding 14px 18px, grid `76px 1fr auto`, gap 16px. Time 14px/700 tabular + "45 min · Meet" 10.5px `#9C9C9C`. Title 14px/600. Attendees stacked (gap 6px): 22px **square** avatar (photo `filter: grayscale(1)` with `1px #333333` border, or initials 9.5px/700 on `#EDE8DF`) + name link 600 `#1A1A1A` + "· org - - background" 12.5px `#4A4A4A` (the person's `background` field; fall back to org only). Right column, aligned end: story dent "GTA whitepaper →" (`1px #333333`, 12px/600) + one status line 11px (`#9C9C9C`, or `#BE3B3B` when the story has an owed reply / overdue task)
2. **Overdue** (`ledger_tasks` open with `due_date < today`, plus stories with `next_action_date < today`), oldest first - - plain list, rows `grid: 18px 1fr 170px 64px`, gap 12px, padding 9px 0, `border-bottom: 1px solid #F1ECE2`, 13.5px `#1A1A1A`. Checkbox = 13px square `1px #333333` (ticking marks Done via the same action `/closing` uses). Story link 12px azul (or "no story" `#9C9C9C`). Right: "8d late" 11px/700 `#BE3B3B` tabular. Kind tag for non-actions: 10px/700 uppercase `#6B6B6B` in `1px #C9C2B4`. Dependency hint (optional, if a task blocks others): latte tag "blocks 3 sends" 11px/700 `#B26A00`, `1px #E48715`; blocked rows indent 22px with `#C9C2B4` checkbox and `#4A4A4A` text
3. **Open tasks** (`ledger_tasks` open, not overdue) - - table in a `1px #333333` frame: header band `#FEF7E7`, `border-bottom: 1px solid #333333`, 10px/700 uppercase +0.06em `#6B6B6B`, columns `1fr 90px 190px 110px` (Task · Kind · Story · Due right-aligned), padding 7px 14px. Rows padding 9px 14px, `1px #F1ECE2` separators, 13px; kind 12px `#6B6B6B`; due 12px/700 tabular "Sun 14 Sep" or `#9C9C9C` "no date"; hover `#FBF6E9`. Below: capture affordance - - 34px row, `1px dashed #C9C2B4`, "+ Capture a task, a note or a decision - - press C anywhere" 13px `#9C9C9C`, `+` fulvous 700; hover border fulvous + latte
4. **Rest of the board** - - after a `1px #E8E2D4` rule, 12.5px/1.7 `#6B6B6B` one paragraph of links: "your move on N stories (names) · N conflicts awaiting your word · N drafts blocked · waiting on them, N · N open commitments" - - from `getIndexSections()` counts

### 1b · Story · document (`app/story/[slug]/page.jsx`) - - option A
Eyebrow "PROJECT · THREAD · STARTED 24 JUL 2025 · ONGOING"; title 30px; one-line summary 14px `#4A4A4A` (first paragraph of notes, or the DB `summary` if you add one).

**Property block** (replaces the metadata `.content` card): `grid-template-columns: 150px 1fr; row-gap: 2px`, label 12.5px `#6B6B6B`, value cell padding 4px 6px, 13.5px `#1A1A1A`, hover bg `#F4EFE5` (Notion-style: plain text until hovered; each value is a `TableCellInput`). Rows: **Whose move** (black/latte two-cell dent: black cell with xanthous uppercase 10px/800 "WAITING ON THEM" or "YOUR MOVE", second cell "idle 2d"; then who owes what) · **Kind** (text + joined `moment | thread` toggle, active cell black) · **Company** (18px black square initials + name link + relationship note) · **Location** · **Dates** (start → end/ongoing, tabular) · **Next action** (text + due dent `1px #333333` 12px/700) · **Strategy** (`border-left: 2px solid #E48715`, bg `#FEF7E7`, padding 6px 8px, plus the note "yours - - every draft starts here" 11px/700 `#B26A00`) · **People** (chips `1px #C9C2B4`, 12.5px/500, 18px avatar, padding 3px 8px 3px 3px, + a dashed "+ tag") · **Threads** (mono 11px/600 dents "1a0861…18f1 ↗", first one `1px #333333`, older ones `#C9C2B4`; link to Gmail thread) · **Tasks** (checkbox rows)

**Notes**: h2 16px/800; the rendered markdown notes as 14px/1.65 paragraphs, gap 14px; dated bold lead-ins `#1A1A1A`; wiki links azul with `border-bottom: 1px solid rgba(4,107,177,0.35)`; unresolved `[[x]]` = `border-bottom: 1px dashed #9C9C9C`, `#6B6B6B`. Drop the `- query / label-id / …` bullet list from the page body (those fields live in the property block now).

**Linked**: same 150px label grid: "Points here" chips · "Mentioned, not linked" = dashed two-cell chips (name | fulvous `+`), note "applied on the next /ledger" · "Neighbourhood" = "14 nodes within two hops · open in Network →" (drop the inline graph on this variant)

### 1c · Story · dossier - - option B
Main splits into centre (flex 1, padding 32px 44px 64px) + **right rail** 320px, `#FBF7EE`, `border-left: 1px solid #E8E2D4`, padding 24px 22px, gap 22px, `position: sticky; top: 40px`.

Centre: kind eyebrow row (kind · colored 7px square + axis · dates · location), title, summary, then **Log** - - the notes split into dated entries, newest first: grid `92px 1fr`, gap 16px, padding 12px 0, `1px #F1ECE2` separators. Date 12px/700 tabular; source tag under it 10px/700 uppercase +0.06em (`#9C9C9C`; "PER ALEX" in `#B26A00`): "Gmail · sent", "Notion · call", "Gmail · 3 msgs", "Gmail · origin". Body 13.5px/1.55 `#333333`, thread ids as mono links. Filter dent above the log: `all | mail | calls | yours` (active black). Below the log: dashed "+ Add to the log" row (writes a `ledger_closing_notes` row tagged with the slug). Parsing: split the existing `notes:` field on its bold dated lead-ins (`**…, 2026-09-09.**`) - - the corpus already follows that convention; entries without a date go last.

Rail blocks, each with a 10px/800 uppercase +0.1em `#9C9C9C` heading, margin-bottom 6px: **Whose move** plate (`1px #333333` on white; header 8px 12px black with xanthous label + "idle 2d" right; body 12.5px `#4A4A4A`) · **Next action** (white box `1px #E8E2D4`, hover border black; "due" + dent; "then: …" hint) · **Your strategy** (latte, `1px #E48715`, 13px/1.5; note in `#B26A00`) · **People · N** (20px avatar, name 600, right "org · last touch" `#9C9C9C`) · **Threads · N** (mono id left, "live · Open in Gmail ↗" right, +N historical) · **Tasks** (open = `1px #333333` box; done = filled black box + strike-through `#9C9C9C`) · **Linked** (points here, unlinked mentions with fulvous `+`, "N nodes in Network →")

### 1d · Command palette (new client component, mounted in `layout.jsx`)
Trigger: `⌘K` / `Ctrl+K`, the rail search plate, or `/`. Backdrop `rgba(51,51,51,0.45)`, palette 640px wide, top 96px, `#FFFDFA`, `1px solid #333333`, shadow `0 8px 24px rgba(0,0,0,0.18)`, radius 0.
- Input row 48px, padding 0 16px, `border-bottom: 1px #333333`, search icon 15px, 15px text, fulvous 1.5px caret; `esc` kbd right
- Groups with eyebrows (10px/800 uppercase `#9C9C9C`, padding 8px 16px 4px): **Jump to** (stories, people, companies, genesis facts - - reuse the `/search` scoring), **Act on <selected>** (contextual: open Gmail threads `⌘↵`, capture a task about them, add to today's log), **Commands** (New story, Go to Closing, Run morning brief…)
- Rows padding 7px 16px, `border-left: 3px solid transparent`, gap 10px: 20px avatar or kind square; name 600; meta `#6B6B6B`; right hint 11px (`#BE3B3B` 700 when overdue). Selected row: bg `#FEF7E7`, border-left `#E48715`, `↵` kbd. Hover `#F4EFE5`
- Footer 8px 16px, `#FBF7EE`, `border-top: 1px #E8E2D4`, 11px `#6B6B6B`: `↑↓ move · ↵ open · tab actions · ⌘↵ Gmail`
- Keyboard: arrows, Enter opens, Tab switches to the action group for the highlighted entity, Esc closes

### 1e · Quick capture (new client component, docked composer)
Trigger: `C` anywhere (not in an input), the rail Capture plate, the dashed rows on Today / story log. Docked at the bottom of `<main>`: `border-top: 1px solid #333333`, white, inner column 880px, padding 16px 48px 22px.
- Row 1: joined type toggle `note | task | decision | wait | reminder` (11.5px/700, active black), right note "type detected from the sentence - - override by clicking" 11px `#9C9C9C`
- Row 2: single input 17px/1.4, `border-bottom: 1px #E8E2D4`, fulvous caret. Recognised spans (a person name, a relative date) get bg `#FEF7E7` + `border-bottom: 2px solid #E48715`
- Row 3: parsed chips `1px #333333`, 12.5px, padding 3px 8px, each removable with `×` `#9C9C9C`: story (kind square + "story" label + name + "via Aneeka" 11px), person (18px avatar + name + org), due (tabular "Fri 18 Sep"); dashed "+ field". Right: one-line insight 11.5px/600 `#B26A00` when the capture closes a known gap (optional)
- Row 4: left 11.5px `#6B6B6B` "Writes to `ledger_tasks` now, appears on Today and on the <story> page. Nothing is sent." Right: secondary "Save and add another" (`1px #333333`, 12px/700, 7px 12px, hover latte) + primary two-cell button (black "Save to ledger" + black cell with xanthous `↵`, divider `1px rgba(255,253,250,0.25)`)
- Page body above the composer shows **Captured today · N**: rows `52px 74px 1fr 200px` - - time 12px/700 `#6B6B6B`, kind tag (task = `1px #333333` black text; others `#C9C2B4`/`#6B6B6B`), text 13px, story link right (or "no story · goes to genesis" `#9C9C9C`)
- Parsing (server action or client heuristic, both fine): type from verbs ("ask/send/sign" → task, "decided/not attending" → decision, "wait for" → wait); person = exact/first-name match on `ledger_people`; story = the matched person's `stories` (first) or a title match; due from "before Friday / tomorrow / <date>". Chips are suggestions the user can remove; save writes `ledger_tasks` (kind task/wait/reminder) or `ledger_closing_notes` (note/decision)

## Interactions & behavior
- Inline editing everywhere stays on `TableCellInput` (blur/Enter saves, `SavedToast`), restyled: transparent until hover (`#F4EFE5` bg, no border), focus `1px #333333`
- Hover = background to latte/sunk or underline; 120-220ms; no scale, no glow
- Checkbox tick on Today marks the task Done (same mutation as `/closing`)
- The story-kind toggle, next action, due, strategy, location, dates all save on blur (existing actions in `app/story/actions.js`)
- No emoji anywhere (brand rule); the ledger's section emoji become plain eyebrows. Dashes are `- -`, never `—`

## State management
- Palette: `open`, `query`, `highlightIndex`, `mode: 'jump' | 'act'`; results fetched via an API route wrapping the `/search` scoring (debounced 120ms) or preloaded once (corpus is ~900 rows)
- Capture: `open`, `type`, `text`, `chips: {story?, person?, due?}`, `saving`; on save append to a local "captured today" list, revalidate `/`
- Today: server-rendered; overdue and open-task ticks are Server Actions with `revalidatePath('/')`

## Data mapping
- Meetings: `ledger_upcoming_meetings` (today), attendees via `parseAttendees` → `ledger_people` (`photo_url`, `background`, `org`), story via `story_slug`
- Overdue / open tasks: `ledger_tasks` (`status=open`, `due_date`, `kind`, `story_slug`) + `ledger_stories` (`next_action`, `next_action_date`, `kind`, `strategy`)
- Dent strip counts: meetings, overdue, open, "your move" = rows in the `Your move` section of `getIndexSections()`
- Story page: `ledger_stories` row + `getStory()` html + `buildBacklinkIndex()` + `findUnlinkedPeopleMentions/StoryMentions` + `ledger_notion_tasks` + `ledger_companies`; thread ids are the 16-hex ids already linkified by `linkifyThreadIds`
- Palette: `/search` logic (`ledger_stories`, `ledger_people`, `ledger_genesis_events`, `rawBySlug`)
- Rail counts: `ledger_stories` count, `ledger_people` non-archived count, `ledger_companies` count, pending people/link reviews (already computed in `layout.jsx`)

## Assets
- `public/logo-dark.svg` (rail mark on paper), `public/logo-light.svg`, `public/logo-square.svg`
- `assets/photo-person-*.jpg` - - mock portraits only; production uses each person's `photo_url` with `filter: grayscale(1)` in a `1px #333333` square
- Fonts: Inter TTFs in `_ds/.../fonts` (Light-Black) or keep the existing Google Fonts import (weights 400-800 needed)
- Icons: Lucide-style paths embedded as `<symbol>`s in `BrainRail.dc.html`

## Files in this bundle
- `Second Brain Mission Control.dc.html` - - the canvas: 1a Today, 1b / 1c story options, 1d palette, 1e capture
- `BrainRail.dc.html` - - the rail component (exact styles, icon paths, group structure)
- `Current Inbox Ledger (Recreation).dc.html` - - today's platform for comparison
- `support.js`, `_ds/`, `assets/`, `public/` - - needed to open the html files locally (double-click the `.dc.html` files)

## Suggested Claude Code prompt
> Read design_handoff_second_brain/README.md and open the .dc.html files in a browser for reference. In platform/, implement the shell (BrainRail + main top bar) first, then 1a Today at `/`, then the story page (use option 1c dossier unless told otherwise), then the command palette and quick capture. One screen per PR. Preserve every existing route, Server Action and inline edit; translate UI copy to English; replace the Notion palette in globals.css with the tokens in the README; radius 0 everywhere.
