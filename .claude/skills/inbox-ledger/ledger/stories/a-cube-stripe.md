# A-Cube Stripe Integration

- query: none - no Gmail label. Found by Cowork's second-mailbox mining
  (chatgptcentral@gmail.com), flagged as an untracked cluster, formalized
  here
- label-id: none
- kind: project (vendor support, one company, six contacts)
- people: Alessandro Toscani, Antonino Caccamo, Antonio La Mura, Lorenzo
  Pellizzardi, Massimo De Pra, Fabio Bedeschi - all `@a-cube.io`
- status: closed - Alex confirmed, 2026-08-23, month-by-month review: an
  e-invoicing exploration with A-Cube (an invoicing API provider) that
  ended without success, not an open thread
- start: 2024-04-25
- end: 2024-09-18
- next-action: none
- commitments: none recorded
- threads (chatgptcentral@gmail.com, `gmail_account_index = 1`):
  `18f123020a6ff264` ("Supporto Integrazione Stripe", ~30 messages, 25 Apr -
  18 Sep 2024), `19030e6943bd59f9` ("Aggiunta al team su Stripe", 11
  messages, 19 Jun - 8 Jul 2024)
- notes: **body-verified by Cowork, 2026-08-23 - real message content read,
  not subject lines.** Kris opened `18f123020a6ff264` in Italian on 25 Apr
  2024, asking A-Cube (an Italian e-invoicing API) whether four Stripe
  accounts under one legal entity could feed a single A-Cube account.
  Antonino Caccamo (CTO/co-founder) said probably feasible pending a call.
  What followed, real and unresolved:
  - a mismatched email on one Stripe account caused re-linking confusion in
    May
  - a discount-calculation bug showed invoices at the pre-discount amount,
    still broken as of 17 Jun ("l'importo calcolato è sbagliato")
  - errors submitting invoices to Italy's tax authority (SDI) persisted
    through late June/early July, A-Cube offered a sandbox to test safely
  - by 8 Aug, A-Cube traced one invoice error to a specific customer (Paul
    Hubrig) missing required billing-address fields
  - the account rep changed from Lorenzo Pellizzardi to Alessandro Toscani
    in late August, who tried to restart the stalled thread through
    mid-September - it ends 18 Sep on a scheduling message, no resolution
    confirmed in the messages read

  `19030e6943bd59f9` is a sub-thread inside the same window: Fabio Bedeschi
  (A-Cube developer) asked to join the Stripe team as a Developer on 19 Jun
  so his side could reproduce the bug directly, added same day. His app fix
  (v1.1.17, 26 Jun) targeted a B2C invoice-button issue; by 28 Jun the SDI
  errors were still happening, and Alex flagged a case where the invoiced
  amount (EUR 80) didn't match the real subscription price (EUR 29). Alex's
  last message, 5 Jul: "Settimana scorsa, abbiamo dovuto fare decine di
  fatture a mano" - dozens of invoices done by hand the week before.

  Independently confirmed by the alex@theaicentral.net calendar sweep,
  which found "ChatGPT Central <> A-Cube // Stripe APP" on 29 April 2024 -
  four days after the thread opened. A-Cube is also the vendor behind the
  Stripe integration support referenced in the 2026 ai-hackathon-bristol
  thread, so this relationship is still live in some form. One message in
  the thread is a delivery-failure bounce, not substantive correspondence -
  noted, not counted as a real exchange.
