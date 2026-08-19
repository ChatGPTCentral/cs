# The data model

Four node types, typed edges between them. **A graph, not a hierarchy** - the
tree shape (`email -> person -> company -> story`) breaks in three places, all of
them observed in Alex's actual mail.

```
identity  --alias-of-->  person  --works-at-->  org
   |                       |                     |
   +-------- appears-in ---+------ counterparty--+
                           |
                        story  <--relates-to-->  story
```

## identity

An email address. **The only node type directly observable in Gmail** -
everything else is inferred, and must be proposed rather than assumed.

## person

A cluster of identities. One human, many addresses.

**The merge rule, narrow on purpose:**

- **same local-part, different domains, co-occurring on a thread -> propose the
  merge.** `marcduke@dukeconnect.co.uk`, `marcduke@btconnect.com` and
  `marcduke@zmail.com` all appear in a single cc list on thread
  `19f60e9ebd451424`. That is about as conclusive as email evidence gets
- **same display name + co-occurrence** -> propose, lower confidence
- **someone states it** - "update my address from X to Y" is how Carol Boudreaux
  resolved. Strongest evidence there is
- **everything else** -> do not merge

**Never auto-merge.** Two people at one company often share a naming convention,
and merging them silently corrupts every downstream count. Different local-parts
co-occurring is the **org** signal, not the person signal.

## org

A cluster of people, usually inferable from the email domain - but only
sometimes.

**Free and ISP domains never imply an org.** Marc Duke's three addresses are
`dukeconnect.co.uk` (his company), `btconnect.com` (BT's consumer mail) and
`zmail.com` (free mail). Two of three are not employers. Treating domain as
employer unconditionally produces "Gmail, 400 employees".

Blocklist: `gmail.com`, `yahoo.*`, `hotmail.*`, `outlook.*`, `live.*`, `msn.com`,
`aol.com`, `icloud.com`, `me.com`, `proton.me`, `protonmail.com`, `gmx.*`,
`web.de`, `online.de`, `mail.com`, `yandex.*`, `qq.com`, `163.com`,
`btconnect.com`, `zmail.com`.

**Employment is time-bounded.** Carol Boudreaux was `@catalent.com` until she
retired on 31 July. A person-org edge without an end date eventually lies.

## story

A unit of work. Spans threads, months and people.

**Labels are a seed, not the taxonomy.** Alex named four stories in conversation
and **three of them have no Gmail label at all** - GTA whitepaper (4 threads, zero
user labels), AI Hackathon Bristol (12 threads, mostly unlabelled), TLA New York.
Meanwhile most labelled stories are months cold. A ledger built only from labels
is blind to exactly the work that is live.

Hence `references/discovery.md` - stories are also found from the mail itself.

## Edges

| Edge | Cardinality | Source |
| --- | --- | --- |
| identity -> person | many-to-one | merge rule above, proposed |
| person -> org | many-to-one, time-bounded | domain, unless blocklisted |
| person -> story | **many-to-many** | thread participation, derived |
| org -> story | many-to-many | via its people |
| story -> story | **many-to-many, weighted** | shared people + shared org network, proposed |

The two bold rows are where the tree model fails.

**person -> story is many-to-many.** Marc Duke is in `👤 Mark Duke (Intros)` -
labelled, dormant 252 days - *and* in the GTA whitepaper, active this week.
Richard Lowe is in the Bristol hackathon *and* carries the `interviews` label.
Treating a person as belonging to one story loses the live half.

**story -> story is real and derivable.** GTA whitepaper and AI Hackathon Bristol
share Marc Duke, and Richard Lowe writes to
`contact@techwestenglandadvocates.co.uk` while Russ Shaw is
`globaltechadvocates.com` - a regional chapter of the same advocacy network. The
edge has a cause, not just a vibe.

Strengths: `strong` (shared people **and** shared org network) · `related`
(one or the other) · `asserted` (Alex said so, no evidence found yet).

## Where it lives

```
ledger/graph/people.md      identities -> person, and their org
ledger/graph/orgs.md        orgs and their domains
ledger/graph/relations.md   story <-> story edges
ledger/stories/<id>.md      one per story, unchanged
```

Only non-obvious entries are recorded. A person with one address at one company
needs no row - the story file already names them. The graph exists to hold what
cannot be read off a single message.
