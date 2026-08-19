# Finding stories nobody labelled

Alex named four stories in conversation. **Three had no Gmail label** - and two of
those were active that same week, while most labelled stories were months cold.
Labels record the stories he got round to filing, which is not the same set as
the stories he is actually running.

So stories are also discovered from the mail: **people who keep appearing on each
other's threads are working on something together.**

## The signal

For each thread, the participant set is `from + to + cc`, minus our own
addresses. A cluster of the same external people recurring across threads is a
story, whether or not it has a label.

GTA whitepaper is the clean example: Russ Shaw, Marc Duke, Zoltan, Tsvetelin and
Ganapathy appear together across four threads, none labelled. No content analysis
needed - the recipient lists alone give it away.

## Thresholds

Chosen, not derived. Tune them once there is enough evidence to.

- **>= 3 external participants** for a project cluster. Two people across two
  threads is ordinarily just correspondence, already covered by tracking the
  person - **except when it isn't.** The first real sweep (2026-08-19) found
  Studio Galdieri: two people, `casucci.studiogaldieri@sirev.it` and
  `valentina.studiogaldieri@gmail.com`, nine messages in three weeks, no label.
  The participant count says "ordinary correspondence." The **local-part text**
  says otherwise - both addresses carry the same firm fragment, on two different
  domains, one of them personal Gmail. That is a second signal, independent of
  participant count: **shared distinctive text in the local-part, across
  different domains, co-occurring in time** proposes a story even at two
  participants. Do not apply the 3-participant floor mechanically where this
  signal fires
- **>= 2 threads.** One thread is a thread
- **>= 60% overlap** between participant sets to count as the same cluster.
  People join and leave a project; requiring an exact match splits one story into
  five
- **within 12 months.** Older clusters are history

## Procedure

1. Sweep threads with `THREAD_VIEW_METADATA_ONLY`. **Never fetch bodies** - one
   thread returned 321,000 characters
2. Drop automated senders before clustering. `-from:beehiiv.com`,
   `-from:sparkloop.app`, `-from:no-reply`, `-from:notification`, `-from:noreply`,
   and anything under the bulk labels in `stories.md`. A newsletter blast has 200
   recipients and would swamp every cluster
3. Build the participant set per thread, dropping our own addresses
4. Group threads by participant overlap
5. Drop clusters already covered by an existing story
6. Rank survivors by recency, then thread count

## Naming, and who does it

The agent proposes a name from recurring subject-line terms and reports the
cluster: who, how many threads, date range, whose move.

**Alex names it.** "GTA whitepaper" is not derivable from
`russ.shaw@globaltechadvocates.com` - it needs someone who knows the work.
Machine-generated names like `russ-shaw-marcduke-cluster` are how a taxonomy
becomes unusable.

On approval: write `ledger/stories/<id>.md`, add any new people and orgs to the
graph, and propose story-to-story edges from shared participants.

Optionally create a matching Gmail label so the story exists in Alex's inbox too.
That is a structural change to his mail - **ask every time**, and follow the
hyphen rule in `stories.md` when querying it afterwards.

## Recurring single correspondents

A different shape from a project cluster: one person, no cc, writing more than
once, with no label. The 3-participant rule does not apply - and does not need
to, since there is no clustering ambiguity with one person. The question is
simpler: **has Alex actually answered them.**

Found in the first sweep: `daniel@dbusta.com` wrote three times (22 July, 12,
13 and 18 August) with no reply from Alex visible in any thread. That is not
necessarily a story worth a file - it may be a solicitation Alex is right to
ignore - but a stranger reading the ledger should be able to see the pattern:
same address, repeated, unanswered. Log it as a candidate line in the sweep
report rather than manufacturing a story file. Alex decides whether it is
signal or noise; the ledger's job is to stop it being invisible.

## What not to do

- **Do not cluster on the support folders.** Feedback and AI 101 are hundreds of
  unrelated readers writing to `editor@thecentral.ai`. They share one recipient,
  not a project. `aic-customer-support` owns them
- **Do not treat a cc-all announcement as a story.** Richard Lowe's Bristol mails
  carry 20+ recipients. That is a real story, but the cluster test would also
  fire on any mailing list. Sustained two-way traffic is the difference -
  check that more than one participant has actually sent something
- **Do not create a story from a single introduction.** An intro email joins
  three people once. It becomes a story when they keep writing
