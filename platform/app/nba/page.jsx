import SavedToast from "../people/SavedToast";
import AddTaskForm from "./AddTaskForm";
import { TaskLine, StoryActionRow, MeetingLine } from "./Rows";
import { getBacklogData } from "./data";

export const dynamic = "force-dynamic";

// The full standalone backlog - every open task and every story action
// together, unsplit. Today's own page now shows this same data split
// into "Pending tasks" / "Reminders" columns (see app/page.jsx +
// nba/data.js); this route is the complete reference view.
export default async function NbaPage() {
  const {
    today,
    allRows,
    meetingsToday,
    peopleByEmail,
    storyTitleBySlug,
    instructionsByTask,
    instructionsByStory,
  } = await getBacklogData();

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Una lista sola - ogni task aperto in <code>ledger_tasks</code> e ogni
        storia con una prossima azione, insieme, ordinati per scadenza. ✓
        segna fatto e sparisce, ✕ rimuove o pulisce, ✎ rinomina - tutto
        subito, senza Save. I campi si modificano qui e valgono ovunque.
      </p>

      {meetingsToday.length > 0 && (
        <div className="content" style={{ marginBottom: 12 }}>
          {meetingsToday.map((m) => (
            <MeetingLine key={m.event_id} m={m} peopleByEmail={peopleByEmail} />
          ))}
        </div>
      )}

      <div className="content" style={{ marginBottom: 12 }}>
        <AddTaskForm />
      </div>

      <div className="content">
        {allRows.length === 0 && <p>Niente di aperto in questo momento.</p>}
        {allRows.map((r) =>
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

      <SavedToast />
    </>
  );
}
