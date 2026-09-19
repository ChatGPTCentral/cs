// Today - the landing page. Per Alex, 2026-09-18: "in today io voglio
// quello che devo fare della mia giornata (cioè il brief) e poi voglio
// avere altri task secondari che potrei comunque tacklare." Per Alex,
// 2026-09-19: /brief and /closing are retired, everything unified into
// this one page - then, same day, rebuilt into three columns, full
// width: "full width, with the panel divided into 3 vertical sections:
// today's agenda, pending tasks, reminders." Then, same day again:
// Targets went live (was frozen text in the brief, went stale within
// hours - see TargetsPanel), and Pending tasks got grouped by category
// with a "+ oggi" pin that pulls an item into this column's own
// "Picked for today" list.
//
// - Today's agenda: TargetsPanel (live), today's calendar events, items
//   pinned "+ oggi" from the other two columns, then the brief itself
//   (Editorial tasks, editable per line, with a Send bar).
// - Pending tasks: the unified backlog (ledger_tasks minus
//   kind='reminder' minus pinned, plus every story's live next_action),
//   grouped by the story it belongs to, or "Generale" for cross-cutting
//   tasks.
// - Reminders (really "Next milestones" - per Alex, 2026-09-19, this
//   column was never actually about reminders): the big upcoming
//   initiatives (ledger_stories.is_milestone), then real
//   ledger_tasks with kind='reminder', then calendar events beyond
//   today (including the ones the "+ istruzione" delegate feature
//   creates). An "Add a reminder" quick-add sits at the top.
//
// All three, plus "Picked for today", read from the same query
// (nba/data.js's getBacklogData), which /nba (the full unsplit list)
// also uses, so nothing here can drift from what /nba shows.
import { supabaseSelect } from "../lib/supabase";
import BriefBlocks from "./BriefBlocks";
import BriefSendBar from "./BriefSendBar";
import TargetsPanel from "./TargetsPanel";
import TodayNote from "./TodayNote";
import AddTaskForm from "./nba/AddTaskForm";
import AddReminderForm from "./nba/AddReminderForm";
import { TaskLine, StoryActionRow, MeetingLine } from "./nba/Rows";
import { getBacklogData } from "./nba/data";

export const dynamic = "force-dynamic";

const WEEKDAY_IT = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const MONTH_IT = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

// brief_date is a plain "YYYY-MM-DD" - parse as UTC so the weekday name
// can't shift a day depending on the server's local offset.
function formatItalianDate(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${WEEKDAY_IT[dt.getUTCDay()]} ${d} ${MONTH_IT[m - 1]}`;
}

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
}

function ColumnHeader({ title, count }) {
  return (
    <div className="today-col-header">
      <span>{title}</span>
      {count != null && <span className="today-col-count">{count}</span>}
    </div>
  );
}

function BacklogRow({ r, today, instructionsByTask, instructionsByStory, storyTitleBySlug }) {
  return r.type === "task" ? (
    <TaskLine
      key={`t-${r.data.id}`}
      t={r.data}
      today={today}
      instructionsByTask={instructionsByTask}
      storyTitleBySlug={storyTitleBySlug}
    />
  ) : (
    <StoryActionRow
      key={`s-${r.data.id}`}
      s={r.data}
      today={today}
      instructionsByStory={instructionsByStory}
    />
  );
}

export default async function TodayPage() {
  const [briefs, recentNotes, backlog] = await Promise.all([
    supabaseSelect("ledger_briefs", "?kind=eq.morning&order=brief_date.desc&limit=1"),
    supabaseSelect("ledger_closing_notes", "?order=created_at.desc&limit=5"),
    getBacklogData(),
  ]);
  const brief = briefs[0];
  const todayDate = todayISO();
  // The brief generates every day now (was Mon-Fri until 2026-09-19).
  // On a missed run the most recent row is not today's - flag it rather
  // than silently rendering yesterday's brief as if it were today's.
  const isStale = brief && brief.brief_date !== todayDate;

  const {
    today,
    pickedToday,
    pendingGroups,
    pendingCount,
    reminderRows,
    milestones,
    meetingsToday,
    meetingsUpcoming,
    peopleByEmail,
    storyTitleBySlug,
    instructionsByTask,
    instructionsByStory,
  } = backlog;

  const rowProps = { today, instructionsByTask, instructionsByStory, storyTitleBySlug };

  return (
    <div className="wide-content">
      <div className="today-columns">
        <section className="today-col">
          <ColumnHeader title="Today's agenda" />
          <div className="content">
            <TargetsPanel />

            {meetingsToday.length > 0 && (
              <div style={{ margin: "14px 0" }}>
                {meetingsToday.map((m) => (
                  <MeetingLine key={m.event_id} m={m} peopleByEmail={peopleByEmail} />
                ))}
              </div>
            )}

            {pickedToday.length > 0 && (
              <div style={{ margin: "14px 0" }}>
                <p className="targets-subhead">Picked for today</p>
                {pickedToday.map((r) => (
                  <BacklogRow key={`${r.type}-${r.data.id}`} r={r} {...rowProps} />
                ))}
              </div>
            )}

            {brief ? (
              <>
                {isStale && (
                  <p className="today-stale-note">
                    Nessun brief per oggi, {formatItalianDate(todayDate)} - qui sotto l'ultimo
                    disponibile, {formatItalianDate(brief.brief_date)}. Dovrebbe arrivare ogni
                    mattina, anche nel weekend.
                  </p>
                )}
                <BriefSendBar brief={brief} />
                <BriefBlocks briefId={brief.id} content={brief.content} />
              </>
            ) : (
              <p>Nessun brief ancora per oggi - dovrebbe arrivare ogni mattina, anche nel weekend.</p>
            )}
          </div>
        </section>

        <section className="today-col">
          <ColumnHeader title="Pending tasks" count={pendingCount} />
          <div className="content">
            <div style={{ marginBottom: 10 }}>
              <AddTaskForm />
            </div>
            {pendingGroups.length === 0 && <p>Niente di aperto in questo momento.</p>}
            {pendingGroups.map((g) => (
              <div key={g.key} className="pending-group">
                <p className="pending-group-label">
                  {g.storySlug ? <a href={`/story/${g.storySlug}`}>{g.label}</a> : g.label}
                </p>
                {g.rows.map((r) => (
                  <BacklogRow key={`${r.type}-${r.data.id}`} r={r} {...rowProps} />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="today-col">
          <ColumnHeader title="Next milestones" count={reminderRows.length + meetingsUpcoming.length} />
          <div className="content">
            <div style={{ marginBottom: 10 }}>
              <AddReminderForm />
            </div>

            {milestones.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {milestones.map((m) => (
                  <a key={m.slug} href={`/story/${m.slug}`} className="milestone-row">
                    <span className="milestone-title">{m.title}</span>
                    {m.dateLabel && <span className="milestone-date">{m.dateLabel}</span>}
                  </a>
                ))}
              </div>
            )}

            {reminderRows.length === 0 && meetingsUpcoming.length === 0 && milestones.length === 0 && (
              <p>Niente in programma oltre oggi.</p>
            )}
            {reminderRows.map((r) => (
              <BacklogRow key={`${r.type}-${r.data.id}`} r={r} {...rowProps} />
            ))}
            {meetingsUpcoming.length > 0 && (
              <div style={{ marginTop: reminderRows.length > 0 ? 10 : 0 }}>
                {meetingsUpcoming.map((m) => (
                  <MeetingLine key={m.event_id} m={m} peopleByEmail={peopleByEmail} showDate />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="content" style={{ marginTop: 20 }}>
        <h2 style={{ marginTop: 0, fontSize: 15 }}>Nota di giornata</h2>
        <TodayNote />
        {recentNotes.length > 0 && (
          <div style={{ marginTop: 14 }}>
            {recentNotes.map((n) => (
              <div key={n.id} className="entry">
                <p style={{ margin: 0 }}>{n.note}</p>
                <div className="entry-meta">
                  {n.log_date} {n.processed ? "- integrata nel ledger" : "- in attesa del prossimo giro"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
