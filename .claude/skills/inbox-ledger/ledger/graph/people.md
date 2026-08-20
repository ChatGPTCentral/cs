# People

Only non-obvious entries. A person with one address at one company needs no row -
the story file names them. This holds what cannot be read off a single message.

Seeded 2026-08-19 from thread metadata. Merges marked **proposed** are not
confirmed by Alex.

## Confirmed merges

### Marc Duke
- identities: `marcduke@dukeconnect.co.uk`, `marcduke@btconnect.com`,
  `marcduke@zmail.com`
- org: Duke Connect (`dukeconnect.co.uk`). The other two are ISP and free mail,
  **not employers**
- evidence: all three appear in a single cc list on thread `19f60e9ebd451424`.
  Same local-part, three domains, co-occurring - the strongest email-only signal
  there is
- stories: `mark-duke` (labelled, dormant 252d), `gta-whitepaper` (live)
- note: Alex's label reads "Mark Duke"; every address and signature reads
  **Marc**. The label is the odd one out

### Tsvetelin
- identities: `tsvetelin@thinkrevops.com`, `tsvetelin.anastasov@gmail.com`,
  `tsvetelin@scapebridge.com`
- org: ThinkRevOps (`thinkrevops.com`). The other two are personal Gmail and a
  third company - not employers in the same sense
- evidence: all three co-occur in one cc list on thread `19f233f8076d0f47`,
  the "GTA Quarterly AI Pulse" thread. Same evidence quality as the Marc Duke
  merge - three addresses, one cc list, conclusive
- stories: `gta-whitepaper`
- note: found by the commitment scanner run, 2026-08-19, while reading a June
  email that also names his planned interview and survey work for GTA

## Single-identity people worth naming

Recorded because they anchor stories, not because they are ambiguous.

| Person | Identity | Org | Stories |
| --- | --- | --- | --- |
| Russ Shaw | `russ.shaw@globaltechadvocates.com` | Global Tech Advocates | `gta-whitepaper` |
| Richard Lowe | `Richard@hewlettrand.com` | Hewlett Rand | `ai-hackathon-bristol`, `interviews` |
| Tsvetelin | `tsvetelin@thinkrevops.com` | ThinkRevOps | `gta-whitepaper` |
| Ganapathy | `ganapathy@vajraglobal.com` | Vajra Global | `gta-whitepaper` |
| Zoltan | `zoltan@futureofwork.uk` | Future of Work | `gta-whitepaper` |

Alex refers to Tsvetelin as "tsvelin" in conversation. Recorded here so a future
search for his spelling still resolves.

## Background (Alex-provided)

Context Alex gives directly about a person - offline history, connections,
what they actually do. Recorded only from what Alex states, never inferred
from the mailbox. Dated, and kept separate from mailbox-found evidence so the
two sources never blur together. Procedure in `references/background.md`.

### Richard Lowe
- background (Alex, 2026-08-20): met at London Tech Week. A friend of Russ
  Shaw. Part of West England Tech Advocates. Runs an education company. Also
  does work like the DBT does, but on his own account - Alex's own shorthand,
  not expanded here since he did not define the acronym
- this confirms two things already in the ledger, rather than adding a
  surprise: `graph/orgs.md` already lists TechWest England Advocates
  (`techwestenglandadvocates.co.uk`) as the org Richard emails from, and
  `graph/relations.md` already marks a `strong` edge between `gta-whitepaper`
  and `ai-hackathon-bristol` through the same Russ Shaw / advocacy network
- new facts, not previously in the ledger: the education company, and the
  DBT-like independent work

## Resolved this sweep

### Aneeka and Daniel (Netline)
- Alex states both belong to **Netline**, the company, and to the same story
- **Aneeka resolved 2026-08-19**: `apatel@netline.com`, Velummylum, Aneeka. Found
  by the commitment scanner, not by reading the label directly. Recurring
  correspondent since March 2026 - case study, TradePub listing, payment terms,
  an XML integration Alex promised to follow up on 29 June (see
  `log/commitment-runs.md`, unverified whether it happened)
- **Daniel resolved 2026-08-19, January sweep**: `daniel@netline.com`, Daniel
  Frignito, Director of Partner Development. Found in a Nov 2025 thread
  ("AI Central Books ++ Partnerships") - real dialogue about a call, Philly
  travel, and the NetLine Case Study, continuing until Aneeka picked up the
  same thread by 26 Nov. Story file: `netline.md`

## Ours, not counterparties

The team, for whose-move purposes. Full list in `references/stories.md`.

| Person | Identities |
| --- | --- |
| Alex | `alex@thecentral.ai`, `alex@theaicentral.net` |
| Elizabeth | `elizabeth@theaicentral.net`, `liz@thecentral.ai` |
| Mark | `mark@theaicentral.net`, `mark@thecentral.ai` |
| Sam | `sam@theaicentral.net`, `sam@thecentral.ai` |
| Kris (persona) | `kris@thecentral.ai` |

Elizabeth appears as both `elizabeth@theaicentral.net` and `liz@thecentral.ai` -
a same-person merge across **different local parts**, which the general rule
would not catch. Recorded by hand.
