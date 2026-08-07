# AI 101 course

Replies to the free 9-email AI 101 course. Mostly not support at all - lesson 3
explicitly asks people to hit reply, so a majority of this folder is homework,
not tickets. The job here is separating the homework from the real problems
buried in it.

## Facts established from the thread history

- The course is 9 emails, subject line `your AI 101 course 🎓 (n/9)`
- It is gated behind an AI readiness quiz. Completing the quiz is what starts the
  sequence
- It is **free**, confirmed by Alex in `19f9ebd89f8fe7de`: free course, resources
  arrive across the following days
- Lesson 3 contains the assignment: *"hit reply and tell me - which AI buzzword
  do you hear most at work?"*, which is why that lesson dominates the folder
- The quiz-to-content handoff is the weak point. Several people completed the
  quiz and reached a landing page that did nothing

## Standing rules for this domain

- **Read to the last line.** The single most valuable ticket found in this folder
  was the tail of a buzzword answer: *"Also, I hope you can help me. I paid for
  the tutorials, but haven't received the login information."* A classifier that
  stops at the first sentence files that as homework and loses a paying customer.
  Every message in this folder gets read in full
- Course problems are free-product problems. Fix them warmly, never pitch off
  them
- The assignment answers are real editorial input. Collect them, do not just
  reply to them

---

### course.assignment-reply
- status: seeded
- seen: 7
- last-seen: 2026-08-03
- signals: a one-line answer to the lesson 3 prompt. "Agent", "harness", "MCP",
  "students are cheating". Frequently the entire message. Sometimes quotes the
  assignment text back
- move: reply short and specific to *their* answer, never a generic thanks - the
  campaign promised "I read every answer", so a form reply breaks a stated
  promise. Then check the rest of the message for a second topic before closing
- draft-shape: one line engaging with their specific word, one line on what the
  course covers next about it. Two lines. No links unless they asked
- needs-from-alex: nothing
- examples: `19fada7db9adaea0`, `19fae0ba590c69b0`, `19faf862d5176e44`,
  `19fb0d705a7a343e`, `19fb390a2023f581`, `19faaa3ca737fe02`, `19f8b4809d9b6ff6`

Aggregate these across a sweep. The most-mentioned buzzwords are supposed to
shape what gets taught next, so the report should carry a tally, not just a list
of drafts.

### course.quiz-no-content
- status: seeded
- seen: 3
- last-seen: 2026-07-30
- signals: completed the quiz and got nothing usable. "I got a pass but no link
  to class", "all the information disappeared after submit", "I get the landing
  page but can't click any section". Sometimes with a screenshot
- move: **check `list_automation_journeys` for their email before writing a
  word.** Whether they are enrolled changes the entire reply, and you cannot tell
  from the email. Then get them in manually if they really are not enrolled, and
  do not tell anyone to retake the quiz unless Alex confirms that works

**Most reports on this topic are not this topic.** Four threads looked like the
same broken handoff. Checked one by one against beehiiv, only one was:

| Who | Looked like | Actually was |
| --- | --- | --- |
| Stefan `19f9ebd89f8fe7de` | quiz-no-content | real. Never enrolled, still not, 12 days on |
| gogo `19fb5562ae54f800` | quiz-no-content | enrolled 73 seconds **after** she emailed. Early, not broken |
| bashar `19fb1aefe5e52f14` | quiz-no-content | enrolled, receiving, replying to class 1 itself. `course.how-to-start` |
| sue `19faf44c1f4d808e` | quiz-no-content | a lead-magnet form. `news.lead-magnet-not-received` |

The lesson is not "check before drafting", it is **check before claiming a
pattern**. Reporting a broken funnel to Alex off four snippets would have sent
him hunting a bug that mostly is not there, while the one customer who really was
stuck sat in the same undifferentiated pile

### The real pattern: enrolment succeeds silently

A fifth case, `19fb43ef99e0f1d7`, settled it. J.R. Bolaños wrote "link does not
work" **nine minutes after** his enrolment completed. gogo wrote 73 seconds
before hers completed. Bashar wrote 12 hours after his, while replying to class 1
itself.

Three people in one week, all enrolled, all convinced it had failed. The
enrolment is not broken - it just gives no visible confirmation, so people finish
the quiz, see nothing, and email support.

For drafting: assume "the link is broken" on this course means "I got no
confirmation" until beehiiv says otherwise. Lead with "you're in" rather than an
apology for a bug, and ask whether the classes are arriving.

For Alex: this is three support tickets from customers who needed no help. It is
a confirmation screen, not an engineering problem.

**Never say the lessons are on their way without checking.** Stefan Weigl
(`19f9ebd89f8fe7de`) took the quiz on 26 July and has **zero** automation
journeys - he was never enrolled, and twelve days later still is not. A draft
reassuring him that lessons arrive over the next two weeks would have been
false, and he would have waited another fortnight for nothing before writing
again, or more likely giving up.

Reaching the dead landing page and being enrolled are independent. Someone can
complete the quiz and simply never enter the automation.
- draft-shape: apologize for the wall, confirm they passed and are enrolled, give
  the direct link to lesson 1 rather than sending them back to the quiz, ask them
  to reply if it still fails
- needs-from-alex: a direct enrolment or lesson link that bypasses the quiz page
- examples: `19fb5562ae54f800`, `19fb1aefe5e52f14`, `19faf44c1f4d808e`

### course.how-to-start
- status: seeded
- seen: 2
- last-seen: 2026-07-27
- signals: "how do the courses start, a separate email?", "where are the spots
  for the course?". Pre-enrolment confusion, sometimes reading "course" as a live
  class with limited seats
- move: correct the mental model plainly. It is an email sequence, not a live
  cohort, nothing fills up, nothing is missed by being late. That misconception
  drives the urgency in several of these messages
- draft-shape: state the format in one line, state what arrives when, give the
  quiz link if they have not started. Warm, three lines
- needs-from-alex: the quiz signup link
- examples: `19fa4f7606da57b5`, `19fa4e3e3444d283`

### course.logistics
- status: seeded
- seen: 2
- last-seen: 2026-07-26
- signals: "is it totally free of charge?", "will there be a certificate?", "is
  there a time limit, I can't work on it every day"
- move: answer all their questions at once, plainly. Free is confirmed - say it
  without hedging, because the person asking is worried about a hidden charge and
  a hedge reads as one. Certificates and deadlines are not confirmed: do not
  invent either. "No deadline, work at your pace" is safe only if Alex confirms it
- draft-shape: one line per question they asked, in their order. No padding
- needs-from-alex: whether there is any expiry or deadline. **The certificate is
  confirmed** - Alex wrote "By the end, you'll receive a certificate" in
  `19f9ed3568836f3c`, 2026-07-26
- examples: `19f9ebd89f8fe7de`, `19f9b31d74b6c4fc`

On the deadline question, there is a true answer that needs no policy: the
lessons arrive by email over roughly two weeks and stay in the customer's inbox,
so they can work at their own pace. Say that. Do not claim "no time limit" as a
policy until Alex confirms one exists.

**Asked twice means the first answer did not land.** Stefan asked whether the
course was free, got a clear answer from Alex, and asked again in his very next
message. When someone repeats a question, lead with that answer, make it
unambiguous, and do not bury it under the other things you are fixing.

### course.lesson-not-received
- status: seeded
- seen: 1
- last-seen: 2026-07-31
- signals: "never received the email for lesson n", usually noting they already
  checked spam and junk
- move: they already did the troubleshooting, so do not send them back to their
  spam folder - it is dismissive and they said it first. Resend the lesson
  content directly
- draft-shape: apologize, send the missing lesson, confirm the rest will keep
  coming
- needs-from-alex: the lesson content or a direct link
- examples: `19fb909f4c26a6aa`

### course.link-broken
- status: seeded
- seen: 1
- last-seen: 2026-07-30
- signals: "want to join free AI 101 but link does not work". The join or quiz
  link specifically, as opposed to a resource link
- move: this blocks acquisition rather than an existing subscriber, so it is
  worth more than its volume. Send a working signup link, and flag the campaign
  it came from - a dead join link in a broadcast costs every reader who tried it
  and did not write in
- draft-shape: apologize, working link, one line inviting them to say if it fails
  again
- needs-from-alex: a verified working quiz signup link
- examples: `19fb43ef99e0f1d7`

---

## Cross-domain watch

This folder hides billing tickets inside course replies. Known instance:
`19fafa97cefbdd63` - a buzzword answer whose last line is a paid customer who
never received Library credentials. That thread is `course.assignment-reply` plus
`library.paid-no-access`, and the billing half leads the draft.

Scan for: "I paid", "purchase", "receipt", "charged", "subscription", "login",
"credentials", anywhere in the body, not just the opening.

## Changelog

- 2026-08-07 - seeded from the AI 101 folder backfill, 18 threads
