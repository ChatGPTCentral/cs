import { updateStoryNextAction, updateStoryNextActionDate, clearStoryNextAction, setStoryPinnedToday } from "../story/actions";
import { parseAttendees } from "../../lib/people";
import TableCellInput from "../people/TableCellInput";
import TaskRow from "./TaskRow";
import InstructionBox from "./InstructionBox";

// Shared row components for the unified backlog - used by both /nba
// (the full standalone list) and Today's "Pending tasks"/"Reminders"
// columns, so the same task or story action reads identically wherever
// it's shown. Split out of nba/page.jsx 2026-09-19 when Today moved to
// its own 3-column layout.

// A task row - title, due date, ✓/✕/✎/pin instant actions, a tag naming
// the story it's linked to (if any), and a delegate-instruction box
// below.
export function TaskLine({ t, today, instructionsByTask, storyTitleBySlug, showPin = true }) {
  const overdue = t.due_date && t.due_date < today;
  const dueNote = t.due_date ? ` (${overdue ? "in ritardo dal " : "entro il "}${t.due_date})` : "";
  const storyTitle = t.story_slug ? storyTitleBySlug.get(t.story_slug) : null;
  return (
    <div className="nba-flat-row">
      <TaskRow
        id={t.id}
        title={t.title}
        kind={t.kind}
        dueNote={dueNote}
        urgent={overdue}
        pinned={!!t.pinned_today}
        showPin={showPin}
      />
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
// task: title, the action itself, a due date, one-click clear, pin to
// Today. The action text and date are still editable in place (autosave
// on blur, same as everywhere else) - clear (✕) blanks both fields at
// once.
export function StoryActionRow({ s, today, instructionsByStory, showPin = true }) {
  const overdue = s.next_action_date && s.next_action_date < today;
  const pinned = !!s.pinned_today;
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
          {showPin && (
            <form action={setStoryPinnedToday}>
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="pinned" value={String(!pinned)} />
              <button
                type="submit"
                className="task-row-btn task-row-btn-pin"
                title={pinned ? "Togli da oggi" : "Aggiungi a oggi"}
              >
                {pinned ? "− oggi" : "+ oggi"}
              </button>
            </form>
          )}
        </span>
      </div>
      <InstructionBox storySlug={s.slug} latest={instructionsByStory.get(s.slug)} />
    </div>
  );
}

// A calendar event - one line, no attendee cards. The people worth
// showing (with background context) are still one tap away on /people.
// `showDate` switches on a day chip for events beyond today (used in
// the Reminders column, where events aren't all "today").
export function MeetingLine({ m, peopleByEmail, showDate = false }) {
  const when = new Date(m.start_time);
  const attendees = parseAttendees(m.attendees);
  return (
    <div className="nba-flat-row">
      <div className="task-row">
        <span className="task-row-text">
          <strong>{m.title}</strong>
          {attendees.length > 0 && (
            <>
              {" - "}
              {attendees
                .map((a) => (a.email ? peopleByEmail.get(a.email)?.name : null) || a.name)
                .join(", ")}
            </>
          )}
        </span>
        <span className="task-row-due">
          {showDate
            ? when.toLocaleDateString("it-IT", { day: "numeric", month: "short" }) + " "
            : ""}
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
