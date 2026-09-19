// Today - the landing page. Per Alex, 2026-09-18: "in today io voglio
// quello che devo fare della mia giornata (cioè il brief) e poi voglio
// avere altri task secondari che potrei comunque tacklare." Per Alex,
// 2026-09-19: /brief and /closing are retired, everything unified into
// this one page - then, same day, rebuilt again into three columns,
// full width: "full width, with the panel divided into 3 vertical
// sections: today's agenda, pending tasks, reminders."
//
// - Today's agenda: today's calendar events, then the brief itself
//   (Targets, Editorial tasks, editable per line, with a Send bar) -
//   what's actually scheduled or planned for today specifically.
// - Pending tasks: the unified backlog (ledger_tasks minus
//   kind='reminder', plus every story's live next_action) - the main
//   work list, sorted by due date.
// - Reminders: ledger_tasks with kind='reminder', plus calendar events
//   beyond today (including the ones the "+ istruzione" delegate
//   feature creates) - things to come back to, not to do right now.
//
// All three read from the same query (nba/data.js's getBacklogData),
// which /nba (the full unsplit list) also uses, so nothing here can
// drift from what /nba shows.
import { supabaseSelect } from "../lib/supabase";
import BriefBlocks from "./BriefBlocks";
import BriefSendBar from "./BriefSendBar";
import TodayNote from "./TodayNote";
import AddTaskForm from "./nba/AddTaskForm";
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

export default async function TodayPage() {
  const [briefs, recentNotes, backlog] = await Promise.all([
    supabaseSelect("ledger_briefs", "?kind=eq.morning&order=brief_date.desc&limit=1"),
    supabaseSelect("ledger_closing_notes", "?order=created_at.desc&limit=5"),
    getBacklogData(),
  ]);
  const brief = briefs[0];
  const todayDate = todayISO();
  // The brief generates every day now (was Mon-Fri until 2026-09-19).
  // On a missed run the most recent row is not today's - the page used
  // to render it with no indication of that, which reads as "today"
  // even when it is not.
  const isStale = brief && brief.brief_date !== todayDate;

  const {
    today,
    pendingRows,
    reminderRows,
    meetingsToday,
    meetingsUpcoming,
    peopleByEmail,
    storyTitleBySlug,
    instructionsByTask,
    instructionsByStory,
  } = backlog;

  return (
    <div className="wide-content">
      <div className="today-columns">
        <section className="today-col">
          <ColumnHeader title="Today's agenda" />
          <div className="content">
            {meetingsToday.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {meetingsToday.map((m) => (
                  <MeetingLine key={m.event_id} m={m} peopleByEmail={peopleByEmail} />
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
          <ColumnHeader title="Pending tasks" count={pendingRows.length} />
          <div className="content">
            <div style={{ marginBottom: 10 }}>
              <AddTaskForm />
            </div>
            {pendingRows.length === 0 && <p>Niente di aperto in questo momento.</p>}
            {pendingRows.map((r) =>
              r.type === "task" ? (
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
              )
            )}
          </div>
        </section>

        <section className="today-col">
          <ColumnHeader title="Reminders" count={reminderRows.length + meetingsUpcoming.length} />
          <div className="content">
            {reminderRows.length === 0 && meetingsUpcoming.length === 0 && (
              <p>Niente in programma oltre oggi.</p>
            )}
            {reminderRows.map((r) => (
              <TaskLine
                key={`t-${r.data.id}`}
                t={r.data}
                today={today}
                instructionsByTask={instructionsByTask}
                storyTitleBySlug={storyTitleBySlug}
              />
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
