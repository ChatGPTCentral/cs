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

- **>= 3 external participants.** Two people across two threads is ordinary
  correspondence, already covered by tracking the person
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
