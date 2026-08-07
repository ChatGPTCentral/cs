# Worked examples

Four shapes, chosen because they cover the range: a long retention reply, a
same-day fix, a two-line acknowledgement, and a message that should not be
drafted at all. Match their length. The most common failure mode is padding a
two-line reply into eight.

---

## Example 1 - "It's all free on LinkedIn" objection (retention reply)

`library.just-linkedin-content`. This is the canonical Attempt-1 retention reply:
explain what the Library actually is and reframe the value, without being
defensive. It is the **longest** reply in this file, and it earns the length
because the customer made a substantive argument. Nothing else here should run
this long.

**Customer message:**

> Hi GPT Central Team,
>
> I recently purchased lifetime access to "Unlock 1200+ ChatGPT Tutorials" for
> $50. However, after accessing the content, I discovered that all tutorials are
> publicly available on LinkedIn at no cost, which means I did not receive any
> exclusive or additional content for my payment.

**Reply:**

> Hi [Name], Kris here from AI Central
>
> Thanks for your patience and honest feedback - - let me add some context. With
> your purchase you got **lifetime (aka FOREVER) access** to our curated AI
> Library AND Premium Newsletter access.
>
> The Library is a web-based platform where you can browse, search and access a
> curated selection of ChatGPT & AI tutorials hand-picked by our editors. A few
> things it gives you that LinkedIn doesn't:
>
> - Permanent access to all content (vs LinkedIn's ~6-month limit)
> - Advanced search and filtering by topic, author, and use case
> - Organized categories instead of endless scrolling
> - Weekly updates with fresh content
> - Ability to save searches and compare tutorials side-by-side
>
> As a lifetime member you'll also be first to get our upcoming features:
>
> - Author-specific pages to follow your favorite AI experts
> - Step-by-step guided walkthroughs
> - AI Central exclusive guides
> - Audio versions of popular tutorials
>
> Is there a specific AI challenge or project you're working on right now? I'd be
> happy to personally point you to the most relevant resources in the Library
>
> Cheers,
> Kris

Why it works: it opens by thanking them rather than arguing, reframes "free
posts" into "you're paying to keep and find them," and closes with a question
that reopens the conversation instead of a hard sell.

If they write back still wanting out, do not run this again. Refund.

---

## Example 2 - Charged after cancelling (fast fix, no explanation)

`library.charge-after-cancel`. The opposite discipline to Example 1. The customer
is owed money and owed speed. Every sentence explaining how it happened makes it
worse.

**Customer message:**

> Dear Alex, My card is still getting charged for my cancelled subscription,
> Please help. I got charged on 22 Dec 2025 BEEHIIV.COM MILANO IT USD 37.49

**Reply:**

> Hi [Name], Kris here
>
> That's on us - - sorry. I've asked my team to refund the $37.49 right away and
> I've made sure the subscription is closed, so nothing else will come off your
> card.
>
> If you spot any other charge from us that shouldn't be there, send it straight
> to me and I'll deal with it
>
> Cheers,
> Kris

Why it works: apology in the first line, action in the second, no billing-cycle
lecture, no request for a screenshot they already sent, and it closes a door
rather than opening a conversation. Note it names the exact amount the customer
quoted, which is safe -- it came from them. It does **not** name a refund date.

---

## Example 3 - Course assignment reply (two lines, and that is correct)

`course.assignment-reply`. Highest volume topic in the inbox. The campaign
promised "I read every answer," so the reply has to prove a human read *this*
answer -- but it does not need to be long to do that.

**Customer message:**

> Agent is the buzzword I hear most (everyone exposed to AI wants to build them)
>
> Best Regards, Gillian

**Reply:**

> Hi Gillian, Kris here
>
> "Agent" is winning by a mile in these replies - - and you've put your finger on
> exactly why it's confusing, since half the people saying it mean a chatbot and
> half mean something that actually goes and does the work. Lesson 6 pulls those
> apart.
>
> What are you hoping to get one to do?
>
> Kris

Why it works: it engages with her specific word and her specific parenthetical,
adds one thing she did not know, and asks a question. A generic "thanks for
sharing, great point!" would have been faster to write and would have quietly
broken the promise the campaign made.

---

## Example 4 - The one you do not draft

`news.data-privacy-complaint`. Knowing when to stop is part of the job.

**Customer message:**

> Hello HubSpot, This is considerably worse than simply sending me a broken
> promotional link. Your campaign invited me to access a supposedly free
> resource. In the process, I was asked to provide [...]

**Correct output:** no draft. A report line for Alex:

> **Escalation - - `news.data-privacy-complaint`** - - rm@pasto.se, thread
> `19fd98313123ac96`, 6 Aug. Broken resource link plus a data-collection
> objection, addressed to the wrong company entirely. One step from a formal
> data request. Needs your words, not a template - - want me to draft from a
> position you give me?

Why: the customer is owed both the resource and an explanation of what happened
to their data. Neither is something this skill can state truthfully. Drafting a
warm apology over an unanswered data question would read as evasion and make the
next message worse.
