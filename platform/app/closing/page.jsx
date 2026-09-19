import { supabaseSelect } from "../../lib/supabase";
import { saveClosing } from "./actions";
import TaskRow from "../nba/TaskRow";
import InstructionBox from "../nba/InstructionBox";

export const dynamic = "force-dynamic";

const KIND_LABEL = {
  action: "action",
  decision: "decision",
  wait: "wait",
  reminder: "reminder",
};

export default async function ClosingPage() {
  const [tasks, notes, instructions] = await Promise.all([
    supabaseSelect("ledger_tasks", "?status=eq.open&order=story_slug.nullslast,due_date.nullslast"),
    supabaseSelect("ledger_closing_notes", "?order=created_at.desc&limit=10"),
    supabaseSelect("ledger_task_instructions", "?order=created_at.desc&select=task_id,instruction,status,result,created_at,executed_at"),
  ]);
  const instructionsByTask = new Map();
  for (const row of instructions) {
    if (!instructionsByTask.has(row.task_id)) instructionsByTask.set(row.task_id, row);
  }

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Every open task, one row each. ✓ / ✕ act immediately, same as
        everywhere else - no batch Save for those any more (changed
        2026-09-19, per Alex: the old Done/Dropped radios needed a Save
        at the bottom before a checked task actually disappeared). Add
        anything new that came up today, then Save that part.
      </p>

      <div className="content">
        <h2 style={{ marginTop: 0 }}>Open tasks ({tasks.length})</h2>

        {tasks.length === 0 && <p>Nothing open right now.</p>}

        {tasks.map((t) => (
          <div key={t.id} className="entry">
            <div className="entry-meta" style={{ marginBottom: 2 }}>
              {KIND_LABEL[t.kind] || t.kind}
              {t.story_slug ? ` - ${t.story_slug}` : ""}
              {t.due_date ? ` - due ${t.due_date}` : ""}
              {t.source ? ` - ${t.source}` : ""}
            </div>
            <TaskRow id={t.id} title={t.title} />
            <InstructionBox taskId={t.id} latest={instructionsByTask.get(t.id)} />
          </div>
        ))}
      </div>

      <form action={saveClosing} className="content">
        <h2 style={{ marginTop: 0 }}>What's new today</h2>
        <div className="crm-form" style={{ marginBottom: 24 }}>
          <input name="new_title" placeholder="A new task that came up today" />
          <div style={{ display: "flex", gap: 8 }}>
            <select name="new_kind" defaultValue="action" style={{ flex: 1 }}>
              <option value="action">action</option>
              <option value="decision">decision</option>
              <option value="wait">wait</option>
              <option value="reminder">reminder</option>
            </select>
            <input name="new_story_slug" placeholder="story slug (optional)" style={{ flex: 1 }} />
            <input name="new_due_date" type="date" style={{ flex: 1 }} />
          </div>
        </div>

        <h2>Anything else that happened today</h2>
        <div className="crm-form" style={{ marginBottom: 20 }}>
          <textarea
            name="note"
            placeholder="Free text - a call, a reply, a story detail. Read and folded into the ledger on the next sweep."
            rows={4}
          />
        </div>

        <button type="submit">Save</button>
      </form>

      {notes.length > 0 && (
        <div className="content" style={{ marginTop: 24 }}>
          <h2>Recent notes</h2>
          {notes.map((n) => (
            <div key={n.id} className="entry">
              <p>{n.note}</p>
              <div className="entry-meta">
                {n.log_date} {n.processed ? "- folded into the ledger" : "- waiting on next sweep"}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
