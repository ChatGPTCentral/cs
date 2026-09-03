# AI Central - - Legacy Materials Audit (Sep 2026)

Alex asked to integrate two older materials into the sales knowledge pack
and confirm the Sep 2026 media kit rebuild did not lose anything from them:
a Google Doc media kit source and a Q2 2026 Figma pitch deck PDF. Audited
2 Sep 2026.

**Update, same day:** Alex confirmed all five content items below - the
"Peace of mind" comparison, the six-step timeline, the $0-to-$16M ARR bio
stat, the Cozora Academy teaching affiliation, and the personal LinkedIn
link - as correct and valid. They are all now built into `mediakit.py` on
the `decks` branch - see the sections below for exactly what was added,
and `MEDIA-KIT-SOURCES.md` in `decks/media-kit/` for the slide-by-slide
log. Only the design notes at the bottom of this file remain unactioned -
they were flagged as inspiration, not a specific claim needing
confirmation, so there is nothing to action

## Google Doc, "Media Kit" (docs.google.com/document/d/194ixUTliijpSDwNishPRhpNqiyoM7-qQKPnp2OCnMGo)

Same content as `Official_Media_Kit_Q3_2026__AI_Central.docx`, already the
primary source for `mediakit.py` - - see `MEDIA-KIT-SOURCES.md`. Every claim
in the doc (75+ companies, founded 2024, 40% Founders/C-level, 86K beehiiv
subscribers, the old case-study numbers) is already logged there and
already reconciled against better sources. Nothing lost

One real gap: the doc's "Meet the Team" section links Alex's personal
LinkedIn profile, `linkedin.com/in/alex-ai`. Confirmed and added - the
media kit's "Let's talk" box now has a "Connect with Alex" line linking it

## Figma PDF, "AI Central - Media Kit Q226" (11 pages, Q2 2026)

An older pitch deck, one quarter before the Q3 2026 docx. Alex flagged its
value as design aesthetics and the "why AI Central" differentiator, not its
numbers - - the audience and case-study figures in it are older and already
superseded by better-sourced data (see `MEDIA-KIT-SOURCES.md`). Full page
images and text sit in this session's scratchpad; ask Alex to re-share the
PDF (`9de27a99-Pitch.pdf`) if a future session needs the source file again,
since it is not committed into this repo

### Content found here that is not in the current decks

- **"Peace of Mind, Every Campaign" (page 3).** A two-column comparison:
  working with a solo content creator (chasing deadlines, off-brand content,
  no ICP study, low personalization, low reporting, no GTM or paid-ads
  understanding) versus working with AI Central (on-time delivery,
  pixel-perfect on-brand content, high personalization, detailed reporting,
  deep ICP research, GTM-native thinking, paid-ads understanding). Closes
  with: "Our clients renew because our team's white-glove service - -
  meticulous attention to detail, deep personalization, and exceptional
  care - - allows them to run operations seamlessly without the stress."
  This is a real differentiator angle with no equivalent slide in the
  current media kit. Worth a slide if Alex confirms every claim in it still
  holds
- **Timeline & Campaign Touchpoints (page 5).** A six-step roadmap:
  Collaboration starts -> Design completed & approved -> Scheduling &
  Publishing -> Mid-campaign Call & Performance Evaluation -> Ideas for
  Follow-up campaigns -> Final Performance Report. The current "How it
  works" slide (media kit slide 11) only has four steps (Brief, Create,
  Publish, Report) and does not mention a mid-campaign check-in call or
  follow-up campaign ideation. Confirm both of those are still real parts
  of the process before adding them - a promised touchpoint that does not
  happen is worse than not promising it
- **Founder bio ARR stat (page 11).** The old bio states Alex's pre-AI
  Central fintech work "took the company from $0 to $16M ARR." The current
  media kit bio only says he "built the go-to-market strategy and led the
  platform launch" - - the specific ARR figure was dropped somewhere along
  the way. It is a strong, specific credibility marker. Confirm the number
  is still accurate and attributable before restoring it - do not restore
  it on this session's say-so alone
- **Teaching affiliation named.** The old bio names "Cozora AI Academy" as
  where Alex teaches; the current bio said "taught applied AI in finance at
  university level" without naming the institution. Confirmed - the media
  kit now says "teaches AI and monetization at Cozora Academy," matching
  the canonical bio already in `01_brand_positioning.md` and
  `sales_agent_training_data.json`
- **LinkedIn Carousel activation window.** "3-5 weeks" of momentum stated
  for the bespoke carousel format - not currently stated as a duration
  anywhere in the media kit

### What is already superseded, correctly (not a loss)

Old audience split (NA 44%, Europe 14%, Asia 20%, Rest 22%; Top US States
California, New York, Texas, Florida) and the old case-study numbers (Gamma
1,000+ downloads, ElevenLabs "100s of signups," Guidde 500K+ views) are all
replaced by measured, better-sourced figures already in
`MEDIA-KIT-SOURCES.md` and `CASE-STUDIES-SOURCES.md`. The "Top US States"
detail has no current equivalent and no source in this deck either - do not
add it without a real source

### Design aesthetic, for reference only

This deck's visual system is a different, earlier exploration, not the
ratified brand system in `ai-central-brand/SKILL.md` section 15 (Jorge's
Apr-Jun 2025 guidelines: jet black / cosmic latte / baby powder, Boxicons,
stamp frames, transit signage). Treat the notes below as inspiration to
raise, not as instructions to follow over the ratified guidelines:

- Cover: near-black charcoal ground, faint grid, thin schematic lines with
  small teal and red dot accents - a technical, systems feel
- A left-edge vertical dark sidebar on every content slide, carrying the
  rotated deck title and page number - a persistent chrome element,
  different from the current decks' bottom footer bar
- A hand-drawn wavy/scribble red border on the "pain point" comparison box,
  set directly against a solid-fill teal box for the "AI Central" side - a
  deliberate organic-versus-geometric contrast device used exactly once, for
  emphasis
- A wider palette than the current decks use: cream, charcoal, teal, muted
  gold, red - versus the current decks' red-and-cream-only accent system
- A navy-on-pale-blue choropleth map with a circular inset zoom (used here
  for "Top US States") - a way to show a global stat and a regional detail
  in one visual
- A horizontal dashed-line, dot-marker roadmap for the process timeline
- The closing slide sets a cascade of real carousel-cover thumbnails behind
  the founder bio - proof of work as background texture, not a stock image
