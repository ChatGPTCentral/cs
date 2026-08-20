# The feedback loop

Alex asked where the free-text box was - somewhere on the platform he could
write "this is wrong" or "add X" and have it actually reach the agent. The
platform is static (no backend, no database, no way to store a Vercel env
secret through the tools this session has), so the box is not on the page
itself. It is a Notion database, linked from the platform footer, read back
on every `/ledger` run. Notion already does the two things a custom box
would need to be built to do: persist writes, and work from Alex's phone.

## Where it lives

Database **💬 Ledger Feedback**, data source
`collection://edbb1fdd-22f8-4e65-a067-d719ee53e0a7`
(`https://www.notion.so/3fb46159954c470aaa774c3820e64f64`).

A private workspace-level page, not nested under an existing to-do
structure - feedback about the platform is a different kind of thing than a
sales task, and dropping it into the Task Board would make both harder to
scan. Alex can move it in Notion's sidebar without breaking anything; the
data source ID is what matters, not its parent.

Properties:

- **Note** (title) - Alex's text, verbatim
- **Status** - `New` (unread) / `Seen` (read, not yet done) / `Actioned`
  (done, see Reply)
- **Reply** (text) - what Claude did or found, written back so this is
  round-trip and not a one-way inbox
- **Context** (url) - optional, a `/story/<slug>` link if the note is about
  a specific story

The platform footer links straight to it: "Drop a note in Ledger Feedback".

## Procedure, every `/ledger` run

1. Query the data source for `Status = "New"` (or `"Seen"` left over from a
   run that read but didn't finish acting - don't let these go silently
   stale)
2. Read each note. Do not guess what it means if it's ambiguous - ask Alex
   in the run's report rather than acting on a misread
3. Act on it if it's actionable within this run (a correction to a story, a
   bug that's actually in the ledger data, a request that maps to something
   this skill already does). If it needs a real code change to the platform
   or the skill, that's a normal task - do it the same as any other request,
   just sourced from Notion instead of from Alex directly in a session
4. Write back:
   - **Status -> Actioned**, **Reply** filled in, if handled this run
   - **Status -> Seen**, **Reply** explains what's blocking it, if it needs
     something only Alex can supply (a decision, a credential, more detail)
   - Leave as **New** only if the run genuinely didn't get to it - and say
     so in the report, don't let it silently roll over indefinitely
5. Mention what got actioned in the run's report the same way commitments
   and cold stories get mentioned - Alex should see "handled: X" without
   opening Notion, and "needs you: Y" for anything left in `Seen`

## Hard rule

Same as commitments: never invent what a piece of feedback meant. If a note
is one word or unclear, say so and leave it `Seen` with that stated in
`Reply`, rather than acting on a guess.
