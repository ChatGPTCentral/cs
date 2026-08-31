---
pack: AI Central Media - Sales Agent Training Knowledge Pack
exported: 2026-08-30
source_project: AI Central Sales HQ (Claude Project)
owner: Alex Fiore, CEO & Founder, AI Central Media
---

# AI Central - - Sales Agent Training Pack

This is a full export of the sales knowledge base built inside the "AI Central Sales HQ" project - - everything a new sales agent (human or AI) needs to sell for AI Central Media in Alex Fiore's voice

## What's inside

| File | Contents |
| --- | --- |
| `01_brand_positioning.md` | Who AI Central is, mission, audience, reach, content pillars, what we are NOT |
| `02_products_pricing.md` | Full product catalog, base packages, all pricing tiers, discount policy, upsell math |
| `03_icp_selling_angles.md` | Ideal Customer Profile (good/medium/bad fit) + selling angle by prospect scenario |
| `04_objections_playbook.md` | Every documented objection and Alex's exact reply framework |
| `05_voice_tone_style_guide.md` | Non-negotiable formatting rules, tone pillars, vocabulary, things Alex never does |
| `06_email_dm_templates.md` | Every email, LinkedIn DM, Passionfroot, and affiliate template on file, by scenario |
| `07_case_studies_and_pipeline.md` | Proven case studies + live pipeline deals showing the playbook applied in real negotiations |
| `08_vocabulary_and_links.md` | Phrase bank, subject line patterns, and every key link/contact |
| `sales_agent_training_data.json` | Everything above, structured as JSON for RAG/vector ingestion or fine-tuning |

## How to use this to train an agent

1. Feed `01` through `08` as the agent's system/knowledge context (or embed them for RAG retrieval) - - together they cover positioning, pricing, targeting, objection handling, and voice
2. Feed `sales_agent_training_data.json` if your pipeline prefers structured data (e.g. vector DB metadata, few-shot example banks)
3. Treat `05_voice_tone_style_guide.md` as a hard constraint layer - - every output the agent produces should pass its checklist before sending
4. Note: as of this export, no deals in the pipeline are marked "closed/won" yet - - `07_case_studies_and_pipeline.md` includes AI Central's proven historical case studies (Gamma, ElevenLabs, Guidde, Outskill) plus in-flight negotiations that show the playbook working (e.g. the UX Pilot CPM/CPC reframe). Update this pack once deals close to add real "winning pitch" transcripts

## Source docs

Pulled from the AI Central Sales HQ project: `AI Central - Sales Playbook v3.docx`, `03_ACTIVE_PIPELINE.md`, `02_WRITING_STYLE_GUIDE.md`, plus the `ai-central-brand` and `alex-writing-style` skills

Cheers, A
