# Bringing Breakcold in - a plan, not a build

Status: **proposal**. Nothing here is implemented. Breakcold is currently
disconnected, so this is written against its documented tool surface rather than
Alex's actual workspace - the object mapping cannot be finalised until the schema
is visible.

## The question this answers

The inbox agent derives relationship state from correspondence. Breakcold is a
CRM Alex already runs. Two systems that both claim to know "where are we with
this person" is worse than either alone, so the division of labour has to be
decided before a single record is written.

## Division of labour

The rule: **the inbox is the source of truth for what happened. Breakcold is the
source of truth for what it is worth.**

| | Inbox agent | Breakcold |
| --- | --- | --- |
| what was said, when, by whom | **owns** | never writes back to Gmail |
| whose move, idle days | **owns** | consumes |
| promises made | **owns** (derived from sent mail) | consumes as tasks |
| voice and drafting | **owns** | not involved |
| deal stage, value, owner | consumes | **owns** |
| who is actually a commercial contact | consumes | **owns** |
| pipeline reporting | not involved | **owns** |

Neither derives what the other owns. That is the whole design.

## The overlap that has to be closed first

Breakcold ships its own inbox: `inbox_conversations_*`, `inbox_messages_send`,
`inbox_conversation_draft_set`, `inbox_send_accounts_list`. It can hold drafts
and send mail.

**We do not use any of it.** Two draft surfaces means Alex checks two places and
eventually sends from the wrong one. Gmail is where he reads, reviews and sends -
that is proven over dozens of real sends. Breakcold is a record, not a mailbox.

This is a rule, not a preference, and the first thing to break if someone later
wires up `inbox_messages_send` "just for convenience".

## Direction: read first, write second

**Phase 1 is read-only, and it is the phase with most of the value for us.**

The ledger currently knows that a Sunny >> Deals thread with
`mike.mcconnon@perplexity.ai` has been idle 139 days. It does not know whether
that is a $50k proposal or a cold email that was never going to land. Breakcold
knows. Reading gives the ledger:

- which correspondents are commercial contacts at all, versus people who merely
  emailed once - this alone kills most of the ledger's noise
- stage, value, owner
- existing notes and tasks, so we do not duplicate what a human already logged

Ranking "your move" by deal value rather than by age is a materially better board
than the one that exists now.

**Phase 2 writes, narrowly.** In increasing order of blast radius:

1. **Notes** (`notes_create`) - a dated summary of where a conversation stands.
   Additive, ignorable, near-zero risk
2. **Tasks** (`tasks_create`) - one per open commitment, with the promise quoted
   verbatim and a due date. This is the highest-value write: it puts "I said I'd
   send the deck by Friday" in front of whoever owns the account
3. **Custom activities** (`custom_activities_create`) - correspondence events on
   the timeline. Only if Alex wants the CRM to reflect email volume

**Never written by the agent:** records themselves (`records_create`,
`crm_objects_*`, `crm_fields_*`). Creating contacts and schema from email traffic
is exactly how a CRM fills with 400 junk records nobody trusts. A human creates
the record; we attach to it or we report that it is missing.

## Scoping - what never goes to Breakcold

Most of the inbox is not CRM material.

- **Support customers.** Refunds, logins, course questions. Their system of
  record is Stripe and beehiiv. A reader who asked about a broken link is not a
  sales contact and putting them in the CRM is how the pipeline stops meaning
  anything
- **Bulk feeds.** beehiiv, GrowthLetter, receipts, notifications
- **Internal team threads.** Elizabeth, Mark, Sam
- **The archive.** `Z - Archived People/` is a decision to stop

What is in scope: deals, sponsors, partners, press, intros. On the current
ledger that is roughly Cannes 2026, Mark Duke, Ben + Katy, Hugo, Hamed, Amanda,
Aneeka, Dominik, Mitch, Richard Evans, Sunny >> Deals - eleven of twenty-six.

## Matching, and why it is the hard part

Email address is the join key, and it is unreliable. Alex corresponds with people
across `@thecentral.ai`, `@theaicentral.net` and personal Gmail - Carol Boudreaux
turned out to be two active subscriptions under two addresses, and Cheryl Wilson
was two Stripe customers 23 minutes apart.

Rules:

- match on email, exact, case-insensitive. Stripe's lookup is case-sensitive and
  silently returned nothing for `Cheryl@...` when the record was `cheryl@...`
- **never fuzzy-match on name.** "Mark" is Marwan, Mark Duke, and
  `mark@theaicentral.net`, who are three different people in this account
- one Gmail story may map to several Breakcold records, and several stories may
  map to one. Do not force one-to-one
- no match found is a reportable outcome, not a reason to create a record

## Safety rules

Writing into a CRM a team acts on is not like leaving a Gmail draft. A wrong
draft is deleted in one click; a wrong task sends a colleague to chase a customer
who already paid.

- **propose before the first write of any kind, per story.** After Alex approves
  the pattern, subsequent writes of that same shape can proceed
- **never write a promise that is not quoted from a sent message.** Paraphrase is
  how a fictional obligation becomes someone's Monday
- **idempotency.** Re-running a sync must not create a second note or a duplicate
  task. Check before writing, every time
- **one workspace.** `workspaces_list` first, confirm which, never assume

## Phases

1. **Inspect.** Reconnect Breakcold, read `capabilities_list`, `crm_objects_list`,
   `crm_fields_list`, `workspaces_list`. Produce the real object mapping. Until
   this happens everything above is provisional
2. **Read-only enrichment.** Ledger stories gain stage, value, owner. Re-rank the
   board by value, not just age. No writes
3. **Notes.** One per commercial story, on approval
4. **Tasks from commitments.** Needs the commitment scanner built first
5. **Decide on activities.** Probably not worth it

## Open questions for Alex

- **Which is the system of record for "who is a contact"?** This plan says
  Breakcold. If it is actually a spreadsheet or Notion, the whole mapping changes
- **Does the team work in Breakcold day to day?** If yes, writes need to be
  conservative and well-labelled as agent-generated. If it is only Alex, we can
  be freer
- **Is Sunny >> Deals already in Breakcold?** It is 49 threads of outbound and the
  obvious test case. If that pipeline lives in the CRM, phase 2 has an immediate
  home. If it does not, the CRM may be less central than this plan assumes
