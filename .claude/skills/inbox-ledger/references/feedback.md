# The feedback loop

Alex asked where the free-text box was - somewhere on the platform he could
write "this is wrong" or "add X" and have it actually reach the agent.

First version (2026-08-20, superseded same day) used a Notion database,
since the platform was static with no backend. Alex pointed out he never
asked for Notion and wanted everything to run in the platform itself. Fixed
by wiring a real database into the app - the box is now an actual page on
the site, `/feedback`, backed by Supabase.

## Where it lives

Supabase project **AI Central // Admin** (`hvzmgpdfznjdxnruiqmy`), table
`public.ledger_feedback`. Columns: `note`, `status` (`new` / `seen` /
`actioned`), `reply`, `context`, `created_at`, `updated_at`.

RLS: the anon key (embedded in `platform/lib/supabase.js` - safe to embed,
it is a publishable key, not a secret) can `select` and `insert` only. No
`update` or `delete` - status changes and replies go through Claude's own
Supabase session (`mcp__Supabase__execute_sql`), not the public key. The
whole site sits behind Vercel Authentication, so "anon" here means "Alex,
through the site," not the public internet.

The platform's `/feedback` page and footer link to it directly - Alex
writes a note, it appears in the list on the same page immediately (no
redeploy needed to see it - only the ledger's *response* to it needs a
`/ledger` run and a redeploy).

## Procedure, every `/ledger` run

1. Query `ledger_feedback` for `status = 'new'` (or `'seen'` left over from
   a run that read but didn't finish acting - don't let these go silently
   stale): `select * from ledger_feedback where status in ('new','seen')
   order by created_at;`
2. Read each note. Do not guess what it means if it's ambiguous - ask Alex
   in the run's report rather than acting on a misread
3. Act on it if it's actionable within this run (a correction to a story, a
   bug that's actually in the ledger data, a request that maps to something
   this skill already does). If it needs a real code change to the platform
   or the skill, that's a normal task - do it the same as any other request,
   just sourced from the feedback table instead of from Alex directly in a
   session
4. Write back with `update ledger_feedback set status = ..., reply = ...,
   updated_at = now() where id = ...`:
   - **status -> 'actioned'**, `reply` filled in, if handled this run
   - **status -> 'seen'**, `reply` explains what's blocking it, if it needs
     something only Alex can supply (a decision, a credential, more detail)
   - Leave as **'new'** only if the run genuinely didn't get to it - and say
     so in the report, don't let it silently roll over indefinitely
5. Mention what got actioned in the run's report the same way commitments
   and cold stories get mentioned - Alex should see "handled: X" without
   opening the site, and "needs you: Y" for anything left `seen`

## Hard rule

Same as commitments: never invent what a piece of feedback meant. If a note
is one word or unclear, say so and leave it `seen` with that stated in
`reply`, rather than acting on a guess.
