import { supabaseSelect } from "../../../lib/supabase";
import { approveEnrichment, discardEnrichment } from "../[id]/actions";
import SavedToast from "../SavedToast";
import SaveWatcher from "../SaveWatcher";
import Avatar from "../Avatar";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const pending = await supabaseSelect(
    "ledger_people",
    "?or=(pending_linkedin_url.not.is.null,pending_photo_url.not.is.null)&order=name.asc"
  );

  return (
    <>
      <div className="content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 6px" }}>
          Enrichment review ({pending.length})
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 4px" }}>
          Apollo matches, not yet applied. Approve copies the photo and LinkedIn URL onto the
          record. Discard drops the candidate and leaves the record untouched. Neither is
          reversible from here - re-run the sweep, or edit the record directly, if a discard
          was wrong.
        </p>
      </div>

      {pending.length === 0 && (
        <p className="content">Nothing waiting on review.</p>
      )}

      {pending.map((p) => (
        <div key={p.id} className="content review-row" style={{ marginBottom: 14 }}>
          <div className="review-side">
            <p className="field-label">Current</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={p.name} photoUrl={p.photo_url} size={44} />
              <div>
                <a href={`/people/${p.id}`}>
                  <strong>{p.name}</strong>
                </a>
                {p.org && <div className="entry-meta">{p.org}</div>}
                {p.linkedin_url ? (
                  <div className="entry-meta">
                    <a href={p.linkedin_url} target="_blank" rel="noopener">
                      {p.linkedin_url}
                    </a>
                  </div>
                ) : (
                  <div className="entry-meta">No LinkedIn on file</div>
                )}
              </div>
            </div>
          </div>

          <div className="review-side">
            <p className="field-label">Apollo match</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={p.pending_match_name || p.name} photoUrl={p.pending_photo_url} size={44} />
              <div>
                <strong>{p.pending_match_name || "(name not returned)"}</strong>
                {p.pending_match_title && <div className="entry-meta">{p.pending_match_title}</div>}
                {p.pending_linkedin_url && (
                  <div className="entry-meta">
                    <a href={p.pending_linkedin_url} target="_blank" rel="noopener">
                      {p.pending_linkedin_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="review-actions">
            <form action={approveEnrichment}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit">Approve</button>
              <SaveWatcher />
            </form>
            <form action={discardEnrichment}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="review-discard">Discard</button>
              <SaveWatcher />
            </form>
          </div>
        </div>
      ))}

      <SavedToast />
    </>
  );
}
