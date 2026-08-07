# Learning protocol

The playbooks are not a fixed list. They started as whatever was sitting in the
three folders in August 2026, and they are wrong in ways nobody can predict yet.
This file is how they get less wrong.

Three loops, in increasing order of confidence:

1. **Capture** - - every sweep, unmatched messages become candidate topics
2. **Promote** - - a candidate that keeps recurring becomes a real playbook
3. **Calibrate** - - Alex's actual sent replies correct the playbooks that exist

All three write to git-tracked files. Every change is reviewable in a diff and
revertible with `git revert`. Nothing here mutates silently.

---

## Loop 1 - Capture (runs inside every sweep)

Every thread you triage gets a topic id. No exceptions, no "miscellaneous."

**If it matches a playbook**, bump that topic's `seen` and `last-seen` in the
domain file. This is cheap bookkeeping and it is what makes the counts in
`_index.md` mean something.

**If nothing fits**, do not force the nearest match. Forcing is how a taxonomy
rots: the bad match gets a draft in its style, Alex sends it, and the wrong
pattern looks confirmed. Instead append to `log/candidates.md`:

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

If the candidate id already exists, increment `seen`, update `last-seen`, and
append the thread id. Do not create a duplicate entry.

You still draft a reply. Fall back to the domain's general doctrine and the tone
rules in SKILL.md, and mark the thread in your report as **new topic** so Alex
reads that draft more carefully than the routine ones.

**A weak match is a candidate too.** If you matched a playbook but had to stretch
it, log a candidate noting the stretch. That is the signal that one topic is
really two.

## Loop 2 - Promote (proposed in the report, written on approval)

A candidate is ready to promote when **`seen` >= 3**, or when Alex says so.

Three is the bar because two can be coincidence and the first draft of a topic is
usually the worst one. Waiting for the third gives three real customer phrasings
to write the `signals` line from, and by then Alex has sent or edited at least
one reply you can copy the register from.

At the end of a sweep, list every candidate at or over the bar under
**Ready to promote**, with its `seen` count and a one-line proposed `move`.

On approval:

1. Write a full entry into the right domain playbook, using the format in
   `playbooks/_index.md`
2. Delete the candidate from `log/candidates.md`
3. Add a line to that playbook's changelog with the date and the promoting sweep
4. Commit with `playbook: promote <id> (seen N)`

Never promote silently. A new playbook changes how every future customer on that
topic gets answered - - that is Alex's call, not yours.

**Retiring topics.** A playbook with `last-seen` more than 6 months old and
`seen` under 3 is probably a one-off that got promoted too eagerly. Flag it as
**stale, consider retiring** in the sweep report. Do not delete it yourself.

## Loop 3 - Calibrate (`/support-learn`, run occasionally)

The highest-value signal in the account is not what customers write, it is what
Alex actually sent. That is ground truth for both voice and policy.

Procedure:

1. Read `log/learn-runs.md` for the last run date. Default window is since then,
   or 30 days on a first run
2. Search each folder for our own replies: the query is the folder query plus
   `in:sent`, or filter thread messages for the `SENT` label
3. For each sent reply, find the inbound message it answered and classify that
   inbound against the playbooks, exactly as in a sweep
4. Compare Alex's reply against what the playbook would have produced:

| What you find | What it means | What to propose |
| --- | --- | --- |
| Alex answered a topic with no playbook | a real gap | new playbook entry, pre-filled from his reply |
| Alex offered something the playbook doesn't (a discount, an extension, a workaround) | policy has moved | amend the `move` line |
| Alex was consistently shorter or blunter than the `draft-shape` | the shape is padded | tighten the shape |
| Alex edited a draft you wrote, and the edit repeats across topics | a voice rule is missing | propose a line for the Tone section of SKILL.md |
| Alex left a thread unanswered for weeks, then closed it briefly | the topic may not be worth a full reply | propose downgrading it to flag-only |

5. Write the findings to `log/learn-runs.md` with the date, the window, how many
   sent replies were read, and each proposed change
6. Present the proposals to Alex. Apply only what he approves. Commit as
   `playbook: calibrate from N sent replies (<window>)`

**Do not** treat a single sent reply as policy. Two independent instances, or
Alex confirming it, before amending a `move` line. One-offs go to
`log/learn-runs.md` as observations.

**Alex's replies are the voice reference, not the style ceiling.** He writes in a
hurry from his phone. Copy his register, his policy, and his brevity - - not his
typos, and not his sign-off (he signs "A" or "Alex"; drafts sign "Kris").

---

## What the counts are and are not

`seen` counts threads triaged by this skill. It is not inbox volume - - anything
answered before the first sweep, or answered by Alex directly, never passes
through here. Treat the numbers as relative weight between topics, not as
support metrics. Loop 3 is what pulls in the history the sweep never saw.
