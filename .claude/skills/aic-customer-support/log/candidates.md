# Candidate topics

Topics seen in the wild that no playbook covers yet. Written by Loop 1 in
`references/learning.md`, promoted into a playbook at `seen >= 3` with Alex's
approval, then deleted from here.

Do not hand-edit the counts. If a candidate is wrong, delete the whole entry and
note why in the log below.

## Format

```md
### <proposed-id>
- domain: library-billing | newsletter-ops | ai101-course | unknown
- seen: 1
- first-seen: YYYY-MM-DD
- last-seen: YYYY-MM-DD
- summary: one line, what the customer actually wants
- threads: <thread-id>
- draft-approach: what you did this time, and why
```

## Open candidates

### course.certificate-legitimacy
- domain: ai101-course
- seen: 1
- first-seen: 2026-09-18
- last-seen: 2026-09-18
- summary: a graduate wants the completion certificate to look officially
  signed (not a template with a blank signature line) so it holds up as
  proof of CPD, and suggests we only issue it on request with real scores
- threads: 19fe12b2977f7020
- draft-approach: thanked him for the score jump, took the suggestion
  seriously, did not promise a signed-certificate process that was never
  confirmed. Marked `[NEEDS FROM ALEX: whether a properly signed
  certificate is possible]` rather than guess

## Removed

- **news.vague-interest** - promoted to `playbooks/newsletter-ops.md`,
  2026-09-18. A second real instance (`1a0590e5cbd1ea51`) landed the same day
  and Alex named the pattern directly, clearing both the `seen >= 3` bar's
  intent and the "or Alex says so" exception in `references/learning.md`.
