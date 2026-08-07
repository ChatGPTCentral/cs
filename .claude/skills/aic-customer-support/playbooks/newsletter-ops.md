# Newsletter ops

Replies to the free newsletter and its campaigns. Highest volume, lowest stakes
per message, but this is where the list either stays warm or quietly rots.

Almost everything here arrives at `editor@thecentral.ai` as a reply to a campaign
sent by "Kris from AI Central" `<gptcentral@mail.beehiiv.com>`. The customer
thinks they are writing to Kris. That is why drafts sign as Kris.

## Standing rules for this domain

- **Never send a link you have not been given.** Half this domain is people
  chasing a resource. Sending a second broken link is worse than sending none.
  Mark `[NEEDS FROM ALEX: link to <resource>]`
- **A broken link is a bug report.** Every one of these means other subscribers
  hit the same wall silently. Collect them into a single **Broken links** section
  at the top of the sweep report, not scattered through the thread list
- These people are not customers. Do not pitch the Library in a reply to someone
  reporting a 404

---

### news.lead-magnet-not-received
- status: seeded
- seen: 4
- last-seen: 2026-08-06
- signals: names the resource back at us, sometimes as the entire message body
  ("The 6 nano banana prompts"). Or "please email me the X", or just "I want
  more". Some completed a form and got nothing back
- move: send the resource. That is the whole job. Do not explain the delivery
  system, do not ask them to re-subscribe, do not ask which email they used
  unless the address genuinely differs from the one that wrote in. If the form
  itself is dropping submissions, that is a bug - collect it
- draft-shape: one line of apology if there was a real failure, the link, one
  line offering to send anything else they missed. Three lines maximum
- needs-from-alex: nothing in most cases. You can find the link yourself - see
  below. Only escalate if no sibling article exists
- examples: `19fd82481b61481b`, `19fa69038fb56761`, `19fa4bfb90f9b4e2`,
  `19faf44c1f4d808e`

### Finding the resource yourself

Campaigns ship in pairs. The email and the article it promises are two separate
beehiiv posts **published at the same timestamp**, one untitled-by-author and one
authored by "Kris From AI Central" and tagged ⭐️ Featured Articles:

| The send | The resource |
| --- | --- |
| `Bookmark: 22 Google AI tools to increase productivity` | `The Best 22 Google AI Tools` |
| `Stop building presentations manually` | `The Ultimate Presentation Guide: Claude + Gamma` |
| `New Release: 10 Canva Courses Worth Taking` | `10 Free Canva Courses To Master Canva (2026)` |

So: `list_posts` filtered to published, find the campaign by title, then take the
sibling at the same `scheduled_at`. `get_post` on the sibling returns a public
`url` like `https://thecentral.ai/p/best-google-ai-tools`. Send that.

Check `recipients.web.tier_ids` before sending. If it includes `free`, anyone can
read it. If it is premium-only, do not hand it to a non-member.

### Not every link in a campaign is ours

**Check this before offering to fix anything.** beehiiv's ad network injects
sponsor placements at send time, so they do **not** appear in
`get_post_content`. Reading the campaign body and concluding a link is ours is
exactly the wrong inference, and it was made once already: Sue Sutcliffe
(`19faf44c1f4d808e`) filled in a **sponsor's** form, and the first draft to her
confidently sent an AI Central guide that had nothing to do with what she
clicked.

When a form or link turns out to be a sponsor's:

- say so plainly, and say it is outside AI Central. That is not deflection, it is
  the reason we cannot just hand them the file
- offer the one thing we actually can do - go back to the sponsor and ask
- never send our own resource as a consolation for a sponsor's broken funnel. It
  answers a question they did not ask

If you cannot tell whose link it is, ask Alex rather than assuming. He can tell
in a second which placements were sponsored.

**An earlier claim here was wrong.** This file previously stated that
`email_capture_type_override: "popup"` was the shared mechanism behind both Sue's
report and `rm@pasto.se` (`19fd98313123ac96`). Sue's was a sponsor form. The
popup setting is real and is on these articles, but it has not been shown to
break anything, and `rm@pasto.se` remains unexplained and still an escalation.

### news.broken-link
- status: seeded
- seen: 2
- last-seen: 2026-07-26
- signals: "the link doesn't work", "404", "tried multiple browsers", often
  naming the specific asset. One reporter has now sent this twice about different
  campaigns
- move: thank them properly - they did unpaid QA. Get the specific URL if they
  did not name it. Send a working link if one exists, otherwise say it is being
  fixed without a date. Log it for the report
- draft-shape: thanks, acknowledge the break, working link or an honest "fixing
  it", ask if anything else 404'd for them
- needs-from-alex: working replacements
- examples: `19f9fdf4cf8ae639`, `19f8fafb18818de3`

### news.wrong-lead-magnet
- status: seeded
- seen: 1
- last-seen: 2026-08-03
- signals: got a resource that does not match what the campaign announced. The
  customer usually names both, precisely
- move: distinct from `broken-link` because the delivery worked and the mapping
  is wrong - which means every subscriber on that campaign got the wrong file,
  not just this one. Send the right resource, and flag the campaign to Alex as a
  fix-at-source item, not a one-off
- draft-shape: confirm they are right, send the correct resource, thank them for
  catching it
- needs-from-alex: the correct resource, and whether the campaign was repaired
- examples: `19fc6bf8636dfd96`

### news.duplicate-sends
- status: established (checked against beehiiv 2026-08-07)
- seen: 1
- last-seen: 2026-08-06
- signals: "I keep receiving duplicate emails from you"
- move: **check beehiiv before saying anything.** Two calls, both cheap:
  `list_subscriptions` filtered by their email, and `list_automation_journeys`
  on the live automation filtered the same way. Only then decide what to tell
  them. Left alone this becomes a spam complaint, which costs list-wide
  deliverability, so it is worth the two calls
- draft-shape: apologize, state what you actually found, then either confirm the
  fix or ask for the one thing you need to find it. Never say "I'm removing the
  duplicate" unless you have seen the duplicate
- needs-from-alex: only if a real duplicate is found
- examples: `19fd8476fb1b1950`

**The seeded guess was wrong.** This entry originally assumed duplicate sends
meant two subscriptions on near-identical addresses. The first live case,
`19fd8476fb1b1950`, had exactly one subscription and one automation journey. A
draft written to the old playbook would have promised to remove a duplicate that
does not exist.

Benign explanation to check first: a subscriber can be receiving the AI 101
course automation **and** the regular broadcast at once. Different emails, close
together, reads as duplication. Confirm which before treating it as a bug.

**But the double-subscription shape is real too.** Carol Boudreaux
(`19fb44cfe276c61c`) is on the list twice, `carol.boudreaux@catalent.com` since
June 2025 and `carol.boudreaux0@gmail.com` since March 2026, both active. She has
never complained about duplicates. So: one report was not a duplicate, and one
real duplicate has never been reported. Both shapes exist, neither is the
default, and the only way to know is to look.

### news.address-change
- status: seeded
- seen: 1
- last-seen: 2026-07-30
- signals: changing jobs, retiring, "please update my address to". A subscriber
  actively asking to keep receiving us. Rare and worth handling well
- move: **check beehiiv for both addresses first.** They may already be
  subscribed at the new one, in which case the answer is reassurance rather than
  action. Then move the subscription and remove the old one so they are not on
  twice
- draft-shape: confirm the switch, confirm which address it now goes to, one warm
  line. **Send to the new address, not the one that wrote in** - by the time
  anyone replies, the old mailbox is often already closed, and a reply into a
  dead mailbox looks identical to being ignored
- needs-from-alex: the beehiiv-side removal of the old address
- examples: `19fb44cfe276c61c`

### news.data-privacy-complaint
- status: seeded
- seen: 1
- last-seen: 2026-08-06
- signals: angry, and the anger is about the exchange rather than the product -
  a promised free resource, a form that collected their details, and then nothing
  delivered. May address us by the wrong company name, which means they have
  entirely lost track of who we are
- move: **do not draft this one to send.** Flag for Alex. It is one escalation
  away from a GDPR request or a public complaint, the customer is owed both the
  resource and an explanation, and neither can come from a template. If Alex
  wants a starting point, lead with the delivery failure and the fix, never with
  a defence of the form
- draft-shape: n/a - escalate
- needs-from-alex: the decision on how to answer
- examples: `19fd98313123ac96`

### news.product-question
- status: seeded
- seen: 4
- last-seen: 2026-08-02
- signals: "can this do X for my use case" - animate a circuit diagram, build a
  timeline presentation, find the best AI bot. They are treating us as the expert
  on a tool we covered
- move: answer if you actually know, briefly, and point at the specific issue or
  Library resource that covers it. If you do not know, say so and ask one
  clarifying question rather than bluffing. This is the warmest lead type in the
  folder and the only place a Library mention is natural, but only after the
  question is genuinely answered
- draft-shape: direct answer or honest "not sure, but", one pointer, one question
  back
- needs-from-alex: nothing usually
- examples: `19fc3e1043c0f7cf`, `19f872501fb1fe79`, `19fb7413331fc6d5`,
  `19f64c8c1f14fd41`

### news.topic-request
- status: seeded
- seen: 2
- last-seen: 2026-07-28
- signals: "can you cover X next", "topics on MCP"
- move: thank them and say it is noted, honestly - collect these into the sweep
  report so they actually reach editorial. Never promise it will run
- draft-shape: two lines. Thanks, noted, and a question about what they would
  want from that piece
- needs-from-alex: nothing
- examples: `19fa6a7db2640f46`, `19f66ef4f919d075`

### news.praise
- status: seeded
- seen: 4
- last-seen: 2026-08-03
- signals: "good content", "thank you", "this is helping me learn". No ask
- move: reply short and human. These are the people who become customers and
  testimonials. Do not upsell. If the praise is specific and quotable, flag it
  for Alex as a possible testimonial rather than acting on it yourself
- draft-shape: two lines. Thanks, and one question about what they want more of
- needs-from-alex: nothing
- examples: `19fc111766de011e`, `19fc8f8f248ba32d`, `19f9df2fe84bb6e2`,
  `19fbc1279a720e84`

### news.conversational-reply
- status: seeded
- seen: 5
- last-seen: 2026-08-03
- signals: a reply with no discernible ask. "Hi", "Hello!", "I read every
  message", "I ran out of company tokens so I'm waiting". Often a phone reply
- move: lowest priority in any sweep. Still worth two warm lines - these are
  replies to a campaign that asked for replies, and ignoring them trains people
  that nobody is home. Never manufacture an ask that is not there
- draft-shape: one line acknowledging what they said, one question. Do not exceed
  it
- needs-from-alex: nothing
- examples: `19fabdbf4b832088`, `19f951f302bd29c2`, `19fc6d9617b47634`,
  `19fb8a4c96eb8a19`, `19fc73e949b6cbb3`

### news.off-topic-ask
- status: seeded
- seen: 1
- last-seen: 2026-07-22
- signals: wants free consulting on their own business - "my cold emails get no
  responses, can you help"
- move: be kind and bounded. One genuinely useful pointer to a relevant resource,
  no offer of ongoing help, no pitch. Do not ignore it and do not write an essay
- draft-shape: one line of empathy, one concrete pointer, warm close. Three lines
- needs-from-alex: nothing
- examples: `19f8afc77d8eab88`

### news.unsubscribe
- status: seeded
- seen: 0
- last-seen: n/a
- signals: asks to be removed, or replies "unsubscribe"
- move: remove them, confirm it in one line, do not ask why, do not attempt a
  save. A reply-based unsubscribe that gets ignored becomes a spam report, which
  costs the whole list deliverability
- draft-shape: one line confirming removal. Nothing else
- needs-from-alex: the beehiiv-side removal
- examples: none yet. Anticipated, included so the first one is not a candidate

---

## Not this domain

Flag for Alex, do not draft:

- Submission guidelines, partnership pitches, ad sales, or "feature my product"
  requests, even when wrapped in praise (`19fc8f8f248ba32d` is praise plus a
  submission pitch - draft the praise half only if Alex asks)
- Anyone sharing their own content for promotion

## Changelog

- 2026-08-07 - seeded from the Feedback folder backfill, 25 threads
