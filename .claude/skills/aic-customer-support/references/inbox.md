# Inbox mechanics

Everything in this file is verified against the live account. Where a Gmail
behaviour contradicts the MCP tool description, this file is right - it was
tested.

## The three folders

| Folder | Label ID | Search query to use |
| --- | --- | --- |
| Feedback | `Label_9093486262747676900` | `label:--------Feedback` |
| AI 101 | `Label_6250355887467778172` | `label:--------AI-101` |
| Issues | `Label_7219727272941807636` | `label:"❌ ❌ ❌ Issues"` |

### The label-name gotcha

Two things bite here, both counter to what the tool docs say:

1. **`label:` does not accept label IDs.** `label:Label_9093486262747676900`
   silently returns zero results. It matches on the display name only. The IDs
   above are still needed for `label_thread` / `unlabel_thread`, which do want IDs
2. **Spaces in a label name become hyphens.** The display names are
   `- - - - Feedback` and `- - - - AI 101`, so each of the four leading dashes
   plus each space becomes a hyphen: eight dashes, then the word. Quoting the
   name with spaces (`label:"- - - - Feedback"`) also returns zero, because the
   leading dash parses as negation

The Issues label starts with an emoji, so plain quoting works there.

If a query returns `{}`, do not conclude the folder is empty. Compare against
`list_labels`, which reports `threadsTotal` per label. A real empty result and a
malformed query look identical.

## Our own addresses

A message from any of these is us, not a customer:

- `kris@thecentral.ai` (the support alias - what drafts go out as)
- `alex@thecentral.ai`
- `editor@thecentral.ai`
- `admin@theaicentral.net`
- `hello@chatgptcentral.net`
- `chatgptcentral@gmail.com`
- `gptcentral@mail.beehiiv.com` (the campaign sender, "Kris from AI Central")

Most inbound support lands on `editor@thecentral.ai` (campaign replies) or
`alex@thecentral.ai` / `admin@theaicentral.net` (direct tickets).

## The sending alias - read this before the first sweep

`create_draft` has **no `from` parameter**. The draft inherits whatever Gmail has
set as the default send-as identity for the account. So:

- Confirm `kris@thecentral.ai` is set as the **default** send-as address in
  Gmail Settings, Accounts and Import, "Send mail as." Then every draft is
  correct with no per-draft action
- If it is not the default, Alex has to pick Kris in the From dropdown on each
  draft before sending

Open every sweep report with which of these is in force. Getting this wrong
means replies go out as Alex from an address the customer has never seen, in a
voice signed Kris.

## Sweep procedure

1. **Pre-flight.** Note whether the Stripe connector is enabled this session
   (Step 0 depends on it) and restate the send-as caveat above
2. **Pull threads.** Query each of the three folders. Default window is
   `newer_than:30d`; widen only if Alex asks. Paginate to the end - page size
   caps at 50 and the folders run 15 to 25 threads
3. **Skip what's handled.** Drop a thread if any of these hold:
   - the most recent message is from one of our addresses (it has `SENT`, or the
     sender matches the list above) - it is already answered
   - a draft already exists on the thread (check `list_drafts`)
   - it is an automated bounce, an unsubscribe confirmation, or a campaign copy
     addressed to ourselves
   - it is a legal threat, chargeback notice, press inquiry, or partnership pitch
     - flag for Alex instead
   - **it predates 2026-03-01 in the Issues folder.** Alex ruled on 2026-08-07
     that the Nov 2025 to Feb 2026 Issues backlog is reference material, not a
     work queue. Around ten threads sit there unanswered - unauthorized charges,
     a broken login, a 30-day-guarantee refund request. Read them to understand
     what goes wrong and to seed playbooks. Do not draft replies and do not
     re-raise them in a report
4. **Read the real body.** The snippet in search results is truncated and often
   cuts off before the actual ask. Call `get_thread` with `FULL_CONTENT` on every
   thread you intend to draft for. Several tickets in this inbox hide the request
   in the last line

   Two traps here, both hit on the first real batch:

   - **`FULL_CONTENT` blows the context window.** These threads quote the full
     campaign HTML, so one four-message thread came back at 321,000 characters.
     It gets written to a file instead. Do not try to read that file straight
     through - `jq` the message bodies out of it
   - **`plaintextBody` is often `null`.** Plenty of subscribers send HTML-only
     mail, and every one of Stefan Weigl's messages in `19f9ebd89f8fe7de` had a
     null `plaintextBody`. Falling back to `.snippet` silently truncates them at
     roughly 200 characters, mid-sentence. Fall back to `htmlBody` and strip the
     tags. The snippet made Stefan look like he was asking one question when he
     was asking three and telling us something personal
5. **Classify.** Assign a topic from `playbooks/_index.md`. Check for a second,
   hidden topic. If nothing fits, follow `references/learning.md`
6. **Step 0.** For anything billing-related, pull the Stripe record
7. **Draft.** One draft per thread, per the playbook and the doctrine in SKILL.md
8. **Report.** Table for Alex, grouped by domain, most urgent first
9. **Log.** Append the run to `log/sweeps.md` and any new topics to
   `log/candidates.md`

## Creating a threaded draft

Pass `replyToMessageId` set to the **id of the most recent inbound message** in
the thread, not the thread id and not the first message. Without it the draft
starts a detached conversation and loses the customer's context.

- `to` takes bare addresses only. `Name <addr@example.com>` is rejected
- Keep `subject` as the thread's existing subject so Gmail keeps it threaded
- Plain `body` is right for these replies. Skip `htmlBody` unless a link needs
  to render as an anchor
- The tool appends the original message under your body automatically - do not
  paste the customer's message back in yourself

## Priority order for the report

1. Money already taken wrongly (double charge, charge after cancellation)
2. Paid and locked out (no credentials, login broken)
3. Refund and cancellation requests
4. Trial and renewal confusion
5. Broken links and missing lead magnets
6. Course access
7. Everything conversational

## Rate and scale notes

- `search_threads` caps at 50 per page. Paginate with `nextPageToken`
- `get_thread` with `FULL_CONTENT` is the expensive call. Only make it for
  threads that survive step 3
- If a sweep would produce more than ~20 drafts, draft the top 20 by the
  priority order above and tell Alex what was left, with counts. Never silently
  truncate
