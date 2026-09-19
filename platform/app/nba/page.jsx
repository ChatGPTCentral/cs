import { supabaseSelect } from "../../lib/supabase";
import { updateStoryNextAction, updateStoryNextActionDate, clearStoryNextAction } from "../story/actions";
import { parseAttendees } from "../../lib/people";
import TableCellInput from "../people/TableCellInput";
import SavedToast from "../people/SavedToast";
import TaskRow from "./TaskRow";
import AddTaskForm from "./AddTaskForm";
import InstructionBox from "./InstructionBox";

export const dynamic = "force-dynamic";

// Rebuilt 2026-09-19, per Alex, after the previous version (7 separate
// sections - meetings, overdue, due-soon, undated, task-only, later,
// cross-cutting - plus a per-story "strategia" accordion) read as
// fragmented rather than "una visione d'insieme su cosa fare." One flat
// list now: every open ledger_tasks row and every story with a live
// next_action, sorted together by date (overdue and dated first,
// undated last), each row the same shape. Strategy moved out entirely -
// it already has a home on /story/[slug] ("la tua strategia su questo
// deal"), a deal-level field, not a daily-overview one.

// A task row - unchanged shape, now just one row among peers instead of
// nested under its story or split into a "cross-cutting" section. A
// small tag names the story it's linked to, if any.
function TaskLine({ t, today, instructionsByTask, storyTitleBySlug }) {
  const overdue = t.due_date && t.due_date < today;
  const dueNote = t.due_date ? ` (${overdue ? "in ritardo dal " : "entro il "}${t.due_date})` : "";
  const storyTitle = t.story_slug ? storyTitleBySlug.get(t.story_slug) : null;
  return (
    <div className="nba-flat-row">
      <TaskRow id={t.id} title={t.title} kind={t.kind} dueNote={dueNote} urgent={overdue} />
      {storyTitle && (
        <a href={`/story/${t.story_slug}`} className="nba-flat-tag">
          {storyTitle}
        </a>
      )}
      <InstructionBox taskId={t.id} latest={instructionsByTask.get(t.id)} />
    </div>
  );
}

// A story's next-action, styled to read as the same kind of row as a
// task: title, the action itself, a due date, one-click clear. The
// action text and date are still editable in place (autosave on blur,
// same as everywhere else) - clear (✕) blanks both fields at once.
function StoryActionRow({ s, today, instructionsByStory }) {
  const overdue = s.next_action_date && s.next_action_date < today;
  return (
    <div className="nba-flat-row">
      <div className={`task-row${overdue ? " task-row-urgent" : ""}`}>
        <span className="task-row-text">
          <a href={`/story/${s.slug}`} className="nba-story-link">
            {s.title}
          </a>
          {s.kind === "sale" && <span className="nba-chip nba-chip-sale">cliente</span>}
          <TableCellInput
            action={updateStoryNextAction}
            id={s.id}
            name="next_action"
            defaultValue={s.next_action || ""}
            placeholder="prossima azione..."
          />
        </span>
        <span className="task-row-story-date">
          <TableCellInput
            action={updateStoryNextActionDate}
            id={s.id}
            name="next_action_date"
            defaultValue={s.next_action_date || ""}
            type="date"
            placeholder="data"
          />
        </span>
        <span className="task-row-actions">
          <form action={clearStoryNextAction}>
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className="task-row-btn task-row-btn-remove" title="Pulisci la prossima azione">
              ✕
            </button>
          </form>
        </span>
      </div>
      <InstructionBox storySlug={s.slug} latest={instructionsByStory.get(s.slug)} />
    </div>
  );
}

// A calendar event today - simplified to one line, no attendee cards.
// The people worth showing (with background context) are still one tap
// away on /people.
function MeetingLine({ m, peopleByEmail }) {
  const when = new Date(m.start_time);
  const attendees = parseAttendees(m.attendees);
  return (
    <div className="nba-flat-row">
      <div className="task-row">
        <span className="task-row-text">
          <strong>{m.title}</strong>
          {" - "}
          {attendees
            .map((a) => (a.email ? peopleByEmail.get(a.email)?.name : null) || a.name)
            .join(", ")}
        </span>
        <span className="task-row-due">
          {when.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
        </span>
        {m.story_slug && (
          <a href={`/story/${m.story_slug}`} className="nba-flat-tag">
            storia
          </a>
        )}
      </div>
      {m.notes && <p className="nba-action" style={{ margin: "2px 0 0" }}>{m.notes}</p>}
    </div>
  );
}

export default async function NbaPage() {
  const nowIso = new Date().toISOString();
  const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
  const [storiesWithAction, allStories, tasks, meetings, meetingPeople, instructions] = await Promise.all([
    supabaseSelect(
      "ledger_stories",
      "?select=id,slug,title,kind,next_action,next_action_date&or=(next_action.not.is.null,next_action_date.not.is.null)"
    ),
    // Title lookup only, for tagging a task with the story it belongs to.
    supabaseSelect("ledger_stories", "?select=slug,title"),
    // The same backlog /brief used to duplicate in prose - now the one
    // live source for every open task.
    supabaseSelect("ledger_tasks", "?status=eq.open&select=id,title,kind,story_slug,due_date"),
    supabaseSelect(
      "ledger_upcoming_meetings",
      `?start_time=gte.${nowIso}&start_time=lte.${todayEnd}&order=start_time.asc&select=event_id,title,start_time,attendees,story_slug,notes`
    ).catch(() => []),
    supabaseSelect("ledger_people", "?archived=eq.false&select=id,name,identity"),
    // Latest free-text instruction per task or story, if any - see InstructionBox.
    supabaseSelect(
      "ledger_task_instructions",
      "?order=created_at.desc&select=task_id,story_slug,instruction,status,result,created_at,executed_at"
    ),
  ]);
  const peopleByEmail = new Map(
    meetingPeople.filter((p) => p.identity).map((p) => [p.identity.toLowerCase(), p])
  );
  const storyTitleBySlug = new Map(allStories.map((s) => [s.slug, s.title]));

  const instructionsByTask = new Map();
  const instructionsByStory = new Map();
  for (const row of instructions) {
    if (row.task_id) {
      if (!instructionsByTask.has(row.task_id)) instructionsByTask.set(row.task_id, row);
    } else if (row.story_slug) {
      if (!instructionsByStory.has(row.story_slug)) instructionsByStory.set(row.story_slug, row);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  // One flat, sorted list: every task and every story action, peers.
  // Sort key is the due date (undated sorts last), so overdue and
  // soon-due items surface at the top without a separate section for
  // each bucket.
  const rows = [
    ...tasks.map((t) => ({ type: "task", key: t.due_date || "9999-99-99", title: t.title, data: t })),
    ...storiesWithAction.map((s) => ({
      type: "story",
      key: s.next_action_date || "9999-99-99",
      title: s.title,
      data: s,
    })),
  ].sort((a, b) => a.key.localeCompare(b.key) || a.title.localeCompare(b.title));

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Una lista sola - ogni task aperto in <code>ledger_tasks</code> e ogni
        storia con una prossima azione, insieme, ordinati per scadenza. ✓
        segna fatto e sparisce, ✕ rimuove o pulisce, ✎ rinomina - tutto
        subito, senza Save. I campi si modificano qui e valgono ovunque.
      </p>

      {meetings.length > 0 && (
        <div className="content" style={{ marginBottom: 12 }}>
          {meetings.map((m) => (
            <MeetingLine key={m.event_id} m={m} peopleByEmail={peopleByEmail} />
          ))}
        </div>
      )}

      <div className="content" style={{ marginBottom: 12 }}>
        <AddTaskForm />
      </div>

      <div className="content">
        {rows.length === 0 && <p>Niente di aperto in questo momento.</p>}
        {rows.map((r) =>
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
