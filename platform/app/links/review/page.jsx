import { supabaseSelect } from "../../../lib/supabase";
import { dismissLinkSuggestion } from "../../story/actions";
import SaveWatcher from "../../people/SaveWatcher";
import SavedToast from "../../people/SavedToast";

export const dynamic = "force-dynamic";

// The link suggestion queue: proposals made from story pages wait here
// for the Claude ledger session, which writes the actual [[slug]] into
// the markdown and marks the row applied. The app can only dismiss.
export default async function LinksReviewPage() {
  const rows = await supabaseSelect(
    "ledger_link_suggestions",
    "?order=created_at.desc&limit=200"
  );
  const pending = rows.filter((r) => r.status === "pending");
  const done = rows.filter((r) => r.status !== "pending");

  return (
    <div className="content">
      <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>
        Link proposti ({pending.length} in coda)
      </h2>
      <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 14px" }}>
        Le proposte fatte dalle pagine storia finiscono qui. Il prossimo giro
        di <code>/ledger</code> scrive il <span className="wiki-link">[[link]]</span> nel
        markdown e le marca applicate - l&apos;app non tocca mai i file.
      </p>

      {pending.length === 0 && <p style={{ color: "var(--ink-faint)" }}>Coda vuota.</p>}
      {pending.map((r) => (
        <div key={r.id} className="entry" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span>
            <a href={`/story/${r.story_slug}`}><strong>{r.story_slug}</strong></a>
            {" → "}
            <a href={`/story/${r.target_ref}`}>{r.target_label || r.target_ref}</a>
          </span>
          <span className="entry-meta">{(r.created_at || "").slice(0, 10)}</span>
          <form action={dismissLinkSuggestion}>
            <input type="hidden" name="id" value={r.id} />
            <button type="submit" className="review-discard" style={{ fontSize: 12 }}>Scarta</button>
            <SaveWatcher />
          </form>
        </div>
      ))}

      {done.length > 0 && (
        <>
          <p className="field-label" style={{ margin: "18px 0 6px" }}>Storico ({done.length})</p>
          {done.map((r) => (
            <div key={r.id} className="entry entry-meta">
              {r.story_slug} {"→"} {r.target_label || r.target_ref} · {r.status}
            </div>
          ))}
        </>
      )}

      <SavedToast />
    </div>
  );
}
