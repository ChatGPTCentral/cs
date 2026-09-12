import { supabaseSelect } from "../../lib/supabase";
import BriefEditor from "./BriefEditor";

export const dynamic = "force-dynamic";

const KIND_LABEL = {
  morning: "Morning brief",
  midday: "Midday update",
  closing: "Closing recap",
};

export default async function BriefPage() {
  const rows = await supabaseSelect("ledger_briefs", "?order=created_at.desc&limit=30");
  const drafts = rows.filter((r) => r.status === "draft");
  const sent = rows.filter((r) => r.status === "sent");

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Auto-generated, edited here before it goes out. Nothing sends until you
        press Send - the text in the box at that moment is exactly what goes
        in the email, word for word.
      </p>

      {drafts.length === 0 && (
        <div className="content">
          <p>No draft waiting right now.</p>
        </div>
      )}

      {drafts.map((b) => (
        <div key={b.id} className="content" style={{ marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>
            {KIND_LABEL[b.kind] || b.kind} - {b.brief_date}
          </h2>
          <BriefEditor brief={b} />
        </div>
      ))}

      {sent.length > 0 && (
        <div className="content">
          <h2>Sent</h2>
          {sent.map((b) => (
            <div key={b.id} className="entry">
              <p>
                <strong>{b.subject}</strong>
              </p>
              <div className="entry-meta">
                {KIND_LABEL[b.kind] || b.kind} - sent{" "}
                {b.sent_at ? new Date(b.sent_at).toLocaleString() : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
