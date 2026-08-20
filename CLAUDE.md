# Alex's inbox agent

A draft-and-review wrapper over Alex's Gmail. Two skills:

- **`inbox-ledger`** - the wrapper. Tracks every ongoing conversation as a
  *story* and holds the state Alex cannot: whose move it is, what he promised,
  what has gone cold. This is the newer and broader of the two
- **`aic-customer-support`** - one domain inside it. Customer replies as Kris,
  over the three support folders

Neither ever sends. The Gmail connector gained `send_message`, `reply` and
`forward`, so draft-only is now Alex's standing choice rather than a limit.

## Where things are

```
.claude/skills/inbox-ledger/
  SKILL.md              the three detectors, the story model, hard rules
  references/
    stories.md          the story registry + the label query rule
  ledger/
    _index.md           the board, ranked by what needs Alex first
    stories/*.md        one file per story
.claude/skills/aic-customer-support/
  SKILL.md              doctrine: persona, hard rules, decision tree
  references/
    inbox.md            Gmail mechanics, verified against the live account
    learning.md         how the topic taxonomy grows itself
    examples.md         four worked replies, including one that is not drafted
  playbooks/
    _index.md           routing table + the entry format
    library-billing.md  refunds, cancellations, charges, logins
    newsletter-ops.md   broken links, lead magnets, list hygiene
    ai101-course.md     course access, logistics, assignment replies
  log/
    candidates.md       unmatched topics awaiting promotion
    sweeps.md           one entry per sweep run
    learn-runs.md       one entry per calibration run
.claude/commands/
  ledger.md             /ledger
  support-sweep.md      /support-sweep
  support-learn.md      /support-learn
scripts/sync-skill.sh   repo <-> ~/.claude/skills
```

## Non-obvious things that will bite you

- **The `label:` query rule is not guessable.** Replace every space in the label
  name with a hyphen, keep everything else literal, and **do not quote**.
  `label:"Sunny >> Deals"` returns nothing; `label:Sunny->>-Deals` works. Quoting
  breaks on `(`, `>>` and `//`. Count the dashes - `- 👤 Jorge` is `--👤-Jorge`,
  two hyphens, not one. Full verified table in
  `inbox-ledger/references/stories.md`
- **`label:` rejects label IDs.** Despite what the Gmail MCP tool description
  says, `label:Label_9093486262747676900` returns zero results. It matches
  display names only, with spaces converted to hyphens. A malformed query and an
  empty folder look identical. The working queries are in `references/inbox.md`
- **`create_draft` has no `from` parameter.** Drafts inherit the account's
  default send-as identity. The agent writes as Kris, so `kris@thecentral.ai`
  must be Gmail's default send-as or the alias has to be picked per draft
- **There IS a send tool now, and we do not use it.** The connector gained
  `send_message`, `reply` and `forward` around 2026-08-19. Draft-only used to be
  enforced by the absence of a tool; it is now a standing instruction from Alex
  and nothing but this line stops an agent reaching for it
- **The persona is Kris, the operator is Alex.** Customers receive campaigns from
  "Kris from AI Central" and reply to those. Alex is the human who reviews and
  sends. Skill text saying "Alex says..." means the operator, not the byline
- **The account-level skill copy is separate.** `~/.claude/skills/` is what makes
  the skill available outside this repo, and it does not update itself. Run
  `scripts/sync-skill.sh` after changing the skill

## Editing the skill

The playbooks are meant to be rewritten by the agent, not just by hand. Follow
`references/learning.md`: capture unmatched topics as candidates, promote at
`seen >= 3` with Alex's approval, calibrate against replies actually sent.

Two rules when editing by hand:

- Keep the entry format in `playbooks/_index.md` exact. Loop 2 writes new entries
  by pattern-matching it
- Never fill in a `needs-from-alex` field by inference. Those mark the places
  where a draft needs a real credential, link or amount that nobody has supplied
  yet. Guessing there is how a customer gets sent a password that does not exist

## Style

The skill mandates its own output style: no em dashes (a single hyphen with a
space each side instead), no trailing periods on bullets, brevity over
completeness. The docs follow the same rules so that examples and doctrine do not
contradict each other.

One trap when bulk-editing dashes: the Gmail label display names are literally
`- - - - Feedback` and `- - - - AI 101`. A find-and-replace over " - - " eats
them, and the damage is silent - a wrong label name and an empty folder look
identical. Check `references/inbox.md` after any such edit.

## Writing English text: ASD-STE100

Alex requested this on 2026-08-20, sourced from
https://gist.github.com/toppa/bf7ff49d6fc44fd4fc3337248f8f2a7e. It applies to
English text this project produces: documentation, skill content, code
comments, email drafts. It does not apply to chat replies to Alex - see
"Talking to Alex" below.

A more specific instruction always wins without comment. This includes the
skill's own "## Style" section above and any rule inside a specific skill or
reference file. Do not cite ASD-STE100 to override a more specific
instruction, and do not ask permission to follow one.

Rules:

- Noun clusters: max 3 words stacked as a modifier. Break a longer stack
  apart and name the relationship
- Sentences: max 20 words for an instruction or a procedure, max 25 words
  for descriptive text
- One instruction per sentence. Never join two instructions with "and" or
  "then"
- Active voice. Use the passive voice in descriptive text only, and only
  when the actor is unknown or irrelevant
- Simple tenses only: infinitive, imperative, simple present, simple past,
  simple future. No present perfect, no past perfect, no compound auxiliary.
  A past participle is an adjective only, never a verb form
- No `-ing` verb forms. An `-ing` word is a technical noun, or part of one,
  only
- No hedge stacking, as in "may have been caused by". State the
  uncertainty as its own plain sentence: "The cause is not confirmed"
- One term per concept, used consistently. Never rotate synonyms for the
  same idea
- Prefer the plainest available word over the formal or rare one
- Define a term that is not common English at its first use. Never carry
  undefined shorthand forward
- No ellipsis. Keep the subject, the verb and the article explicit, even
  when the sentence reads longer for it
- Paragraphs: one topic, max 6 sentences
- Use a numbered or bulleted list for 3 or more steps or conditions

Never apply these rules to: code (identifiers, syntax, string literals),
quoted material (error output, command output, file contents, another
person's exact words - rewriting a quotation is falsification, not
simplification), or text where the exact wording carries the meaning (a
command to run, an API name, a config key, an exact error string).

The caps are per sentence, not per response. Clarity is the goal, not
concision - a long answer in short sentences is correct. Never drop a fact,
a condition, a caveat or a scope qualifier to meet a limit; split the
sentence instead.

This project has no `CONTEXT.md` vocabulary file. Do not invent one, and do
not present any term as already established - define it at first use per
the rules above.

## Talking to Alex

Chat replies to Alex are in Italian, per his instruction on 2026-08-20. This
does not change the language of committed project text - code, docs, skill
content and drafts stay English, governed by ASD-STE100 above.
