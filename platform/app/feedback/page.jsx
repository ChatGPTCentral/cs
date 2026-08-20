import { supabaseSelect } from "../../lib/supabase";
import { addFeedback } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  new: "waiting",
  seen: "seen, not yet done",
  actioned: "done",
};

export default async function FeedbackPage() {
  const items = await supabaseSelect("ledger_feedback", "?order=created_at.desc");

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Bugs, corrections, things to add - write here directly. Read and
        actioned on the next <code>/ledger</code> run.
      </p>

      <form action={addFeedback} className="crm-form content">
        <textarea
          name="note"
          placeholder="What's wrong, or what should change"
          rows={3}
          required
        />
        <input name="context" placeholder="Optional: which story this is about" />
        <button type="submit">Send</button>
      </form>

      <div className="content">
        {items.length === 0 && <p>Nothing yet.</p>}
        {items.map((f) => (
          <div key={f.id} className="entry">
            <p>{f.note}</p>
            <div className="entry-meta">
              {STATUS_LABEL[f.status] || f.status}
              {f.context ? ` — ${f.context}` : ""}
            </div>
            {f.reply && <p style={{ fontStyle: "italic" }}>{f.reply}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
