import { supabaseSelect } from "../../lib/supabase";
import { saveClosing } from "./actions";

export const dynamic = "force-dynamic";

const KIND_LABEL = {
  action: "action",
  decision: "decision",
  wait: "wait",
  reminder: "reminder",
};

export default async function ClosingPage() {
  const [tasks, notes] = await Promise.all([
    supabaseSelect("ledger_tasks", "?status=eq.open&order=story_slug.nullslast,due_date.nullslast"),
    supabaseSelect("ledger_closing_notes", "?order=created_at.desc&limit=10"),
  ]);

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Every open task, one row each. Mark what actually got done or what
        you're dropping, add anything new that came up today, then Save -
        this writes straight to the ledger, no email round-trip needed.
      </p>

      <form action={saveClosing} className="content">
        <h2 style={{ marginTop: 0 }}>Open tasks ({tasks.length})</h2>

        {tasks.length === 0 && <p>Nothing open right now.</p>}

        {tasks.map((t) => (
          <div key={t.id} className="entry">
            <input type="hidden" name="task_id" value={t.id} />
            <p style={{ margin: "0 0 4px" }}>
              <strong>{t.title}</strong>
            </p>
            <div className="entry-meta">
              {KIND_LABEL[t.kind] || t.kind}
              {t.story_slug ? ` - ${t.story_slug}` : ""}
              {t.due_date ? ` - due ${t.due_date}` : ""}
              {t.source ? ` - ${t.source}` : ""}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 13.5 }}>
              <label>
                <input type="radio" name={`status_${t.id}`} value="open" defaultChecked />
                {" "}Still open
              </label>
              <label>
                <input type="radio" name={`status_${t.id}`} value="done" />
                {" "}Done
              </label>
              <label>
                <input type="radio" name={`status_${t.id}`} value="dropped" />
                {" "}Dropped
              </label>
            </div>
          </div>
        ))}

        <h2>What's new today</h2>
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
