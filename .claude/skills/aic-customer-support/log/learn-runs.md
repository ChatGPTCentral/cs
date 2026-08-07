# Calibration log

One entry per `/support-learn` run, newest first. Loop 3 in
`references/learning.md`.

Holds the date the next run reads its window from, plus observations that were
not yet strong enough to change a playbook. A single sent reply is an
observation; two independent instances make it a proposal.

## Format

```md
## YYYY-MM-DD
- window: since YYYY-MM-DD
- sent replies read: N
- topics with no playbook: <ids proposed>
- policy drift found: <topic -> what changed>
- voice notes: patterns in how Alex edited or wrote
- applied: what Alex approved
- observations: single instances, not yet acted on
```

## Runs

_No calibration run yet. On the first run, use a 30-day window. Worth running
once before the first sweep -- the Issues folder already holds Alex's replies on
cancellations, refunds, credentials and PayPal, which is the fastest available
correction to the seeded playbooks._
