# Manuel Bleve (beehiiv)

- query: none - no Gmail label
- label-id: none
- kind: person (real relationship, beehiiv contact, interview done)
- people: Manuel Bleve, manuel.bleve@beehiiv.com
- status: open - warm relationship, gone quiet
- start: 2026-07-08 (booking) - real interview held 2026-07-13
- last-inbound: 2026-07-23 08:59 (manuel.bleve@beehiiv.com, "Assolutamente!!
  Più che volentieri!" - agreeing to cover the "community" topic in a
  future episode)
- last-outbound: 2026-09-10 (alex@thecentral.ai, draft prepared, thread
  `19f6be8057294eb1`, message `1a08ab242ba39928`) - not sent yet, Alex's
  own final wording (asks about interview clip status + a new episode)
- next-action: none - draft resurfacing the relationship prepared, per
  Alex ("riportare a galla Manuel Bleve")
- commitments: "ne dobbiamo parlare in un prossimo episodio" - Alex to
  Manuel, 2026-07-16, re: the community topic - still open, not yet
  scheduled
- threads: `19f5bfbccfc4122a` (interview booking), `19f419ec5c30a0b4`
  (booking confirmation), `19f6be8057294eb1` (live, post-interview chat)
- notes: A real 30-min interview was recorded with Manuel on 2026-07-13
  via Riverside.fm (booked through his Calendly-style scheduler). After
  the interview, a warm informal exchange in Italian on 16-23 Jul about
  a "community" feature/topic - Manuel confirmed Alex was right about
  something ("quindi avevi ragione eh eh"), Alex proposed covering it in
  a future episode since it overlaps with AI Central's own roadmap and
  a plan already shared in the "aucap" (likely a mishearing/shorthand
  for a call or document, not expanded further here). Manuel agreed
  enthusiastically. No contact since 23 Jul - about 7 weeks quiet before
  today's resurface draft

  **Draft rewritten, 2026-09-10, per Alex's own wording.** Asks where
  the interview clips stand, offers the calendar link, and floats a
  second episode given "tante cose nuove e interessanti da luglio."
  First attempt via `update_draft` detached the draft onto a new,
  unthreaded thread (same known bug documented elsewhere in this
  ledger) - fixed by blanking that draft (subject "[DELETE ME]") and
  recreating fresh with `create_draft` against Manuel's last message.
  Verified via `get_draft`: now correctly on thread `19f6be8057294eb1`
