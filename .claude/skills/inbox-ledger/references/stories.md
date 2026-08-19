# The story registry

A **story** is a durable thread of work with a person or a project. It spans many
Gmail threads, months, and often several people.

Alex's labels are a **seed**, not the taxonomy. They record the stories he got
round to filing, which is a smaller set than the stories he is running - three of
the four he named in conversation had no label, and two of those were live that
week. This file covers the labelled ones; `discovery.md` finds the rest.

## The label query rule

Verified 2026-08-19 against the live account, after four failed attempts.

**Replace every space in the label name with a hyphen. Keep everything else
literal. Do not quote.**

```
- 👤 Mark (Marwan)   ->  label:--👤-Mark-(Marwan)
Sunny >> Deals       ->  label:Sunny->>-Deals
- - - interviews - - -  ->  label:------interviews------
```

Three traps, each of which returned a silent empty result:

- **Quoting fails on punctuation.** `label:"Sunny >> Deals"` and
  `label:"👤 Mark Duke (Intros)"` both return `{}`. The unquoted hyphen form of
  the same labels works. Quoting only survives for plain names and emoji
- **Count the dashes.** `- 👤 Jorge` has a leading dash *and* a space, so it
  becomes **two** hyphens: `--👤-Jorge`. One hyphen returns nothing.
  `- - - interviews - - -` becomes six each side, not three
- **Label IDs never work in `label:`.** They are needed for `label_thread` and
  `unlabel_thread`, and useless in search

An empty result and a malformed query are indistinguishable. When a story
suddenly reports zero threads, suspect the query before believing the silence -
cross-check `threadsTotal` from `list_labels`.

## Whose move

`search_threads` returns threads newest first, and `THREAD_VIEW_METADATA_ONLY`
gives every message's `sender`, `date` and `labelIds` without fetching bodies.
That is enough to compute the whole ledger cheaply. Never pull bodies for
triage - only for drafting.

Take the newest thread, then its last message:

- sender is **one of ours** -> `theirs`. They owe the reply
- sender is **anyone else** -> `yours`. You owe the reply

Ours: `alex@thecentral.ai`, `alex@theaicentral.net`, `kris@thecentral.ai`,
`editor@thecentral.ai`, `admin@thecentral.ai`, `admin@theaicentral.net`,
`bookings@theaicentral.net`, `hello@chatgptcentral.net`, `chatgptcentral@gmail.com`,
`voices@thecentral.ai`.

**The team counts as ours.** `elizabeth@theaicentral.net`, `mark@theaicentral.net`,
`mark@thecentral.ai`, `sam@theaicentral.net` are colleagues, not counterparties.
A thread whose last message is Elizabeth chasing someone is `theirs`, not
`yours` - and it is still Alex's problem when it goes quiet, which is why the
ledger tracks idle days regardless of who sent last.

## The live stories

Ledger scope. 26 labels, excluding bulk feeds and the archive.

| Story | Query | Label ID | Threads |
| --- | --- | --- | --- |
| Mark (Marwan) | `label:--👤-Mark-(Marwan)` | `Label_3886606246761848295` | 22 |
| Jorge | `label:--👤-Jorge` | `Label_7247179519478710266` | 21 |
| Sunny >> Deals | `label:Sunny->>-Deals` | `Label_5058825882633906580` | 49 |
| Sam (Sunny) | `label:--👤-Sam-(Sunny)` | `Label_8409180357205609677` | 7 |
| interviews | `label:------interviews------` | `Label_5304794021306184656` | 51 |
| testimonials | `label:------testimonials------` | `Label_7493144602891387055` | 34 |
| Cannes 2026 Follow-up | `label:///-Cannes-2026-Follow-up` | `Label_3561665707077814621` | 10 |
| Mark Duke (Intros) | `label:👤-Mark-Duke-(Intros)` | `Label_4787366530861469637` | 9 |
| Digital Boost | `label:Digital-Boost` | `Label_1373649917815035617` | 9 |
| Affiliate Payout | `label:💰-Affiliate-Payout` | `Label_1020611267481331149` | 7 |
| Austin Conference | `label:--🌮🌮-Austin-Conference` | `Label_7346437085472136537` | 6 |
| TRAVEL | `label:✈️-TRAVEL` | `Label_8032071082365789311` | 46 |
| Sparkloop | `label:Sparkloop` | `Label_7528059213241055229` | 104 |
| Cozora | `label:Cozora` | `Label_2001243660363889001` | 3 |
| Reader's feedback | `label:👂Reader's-feedback` | `Label_5410248929680543119` | 3 |
| Support | `label:Support` | `Label_566604447858519012` | 2 |
| Ben + Katy (MadRev) | `label:👤-Ben-+-Katy-(MadRev)` | `Label_5586594889512562982` | 2 |
| Gamma AI | `label:👤-Gamma-AI` | `Label_2307886140877262550` | 2 |
| Hamed // Otio.ai | `label:👤-Hamed-//-Otio.ai` | `Label_1431286393283428905` | 1 |
| Amanda // Jobstream | `label:👤-Amanda-//-Jobstream` | `Label_1704262537422697338` | 1 |
| beehiiv // Richard Evans | `label:👤-beehiiv-//-Richard-Evans` | `Label_2976738811253175690` | 1 |
| Hugo // Passionfroot | `label:👤-Hugo-//-Passionfroot` | `Label_322524788560555789` | 1 |
| Dominik (Refind) | `label:👤-Dominik-(Refind)` | `Label_3674846994892860821` | 1 |
| Mitch // Sparkloop | `label:👤-Mitch-//-Sparkloop` | `Label_4563251958284752503` | 1 |
| Mitali // Outskill | `label:👤-Mitali-//-Outskill` | `Label_7705408054980940104` | 1 |
| Aneeka (Netline) | `label:👤-Aneeka-(Netline)` | `Label_8862489757389168107` | 1 |

## Read and reclassified, 2026-08-19 full sweep

Five labels from the original registry turned out not to be stories at all.
Read in full; none needs tracking here.

| Label | What it actually is |
| --- | --- |
| `testimonials` (34 threads) | 100% automated `noreply@senja.io` notifications. A collection tool's feed, not correspondence |
| `Sparkloop` (104 threads) | 100% automated `support@sparkloop.app` reports to `admin@theaicentral.net`. Distinct from `Mitch // Sparkloop`, a real named contact - see `stories/mitch-sparkloop.md` |
| `TRAVEL` (46 threads) | Booking confirmations - easyJet, Virgin, SNCF, booking.com. Operational logistics, same category as `💸 Admin / Receipts` |
| `Gamma AI` | **Anomaly.** Both threads are `comments-noreply@docs.google.com` Google Docs comment notifications. Zero messages from or to anyone at Gamma |
| `Hamed // Otio.ai` | **Same anomaly.** Both threads are the identical Google Docs comment notifications. Zero messages from or to Hamed |

The last two are worth flagging distinctly: a label named after a person,
containing zero correspondence with that person, is a real gap - either the
actual Hamed/Gamma conversation lives somewhere unlabelled and undiscovered,
or these labels were applied to the wrong thread at some point. Not resolved;
recorded so it isn't silently forgotten.

## Out of scope

Not stories. Do not ledger them.

- **Bulk feeds** - `🐝 beehiiv` (1762 threads), `GrowthLetter` (409),
  `📬 Newsletter da Leggere` (182), `💸 Admin / Receipts` (198). Machine mail and
  receipts. No one is waiting on a reply
- **The archive** - everything under `Z - Archived People/`. Alex filed these as
  finished. Resurfacing them is noise
- **The support folders** - `❌ ❌ ❌ Issues`, `- - - - Feedback`,
  `- - - - AI 101`. Already owned by `aic-customer-support`. The ledger records
  them as one domain-level entry, not per customer, or it drowns in 100 threads
