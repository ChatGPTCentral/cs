import { notFound } from "next/navigation";
import { getStory } from "../../../lib/ledger";
import { supabaseSelect } from "../../../lib/supabase";
import { updateStoryStart, updateStoryEnd, updateStoryAxis, updateStoryNextAction, updateStoryNextActionDate } from "../actions";
import TableCellInput from "../../people/TableCellInput";
import SaveWatcher from "../../people/SaveWatcher";
import SavedToast from "../../people/SavedToast";

export const dynamic = "force-dynamic";

function AxisToggle({ id, axis }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      <form action={updateStoryAxis}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="axis" value="moment" />
        <button
          type="submit"
          className="axis-select"
          style={{ fontWeight: axis === "moment" ? 700 : 400, opacity: axis === "moment" ? 1 : 0.55 }}
        >
          momento
        </button>
        <SaveWatcher />
      </form>
      <form action={updateStoryAxis}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="axis" value="thread" />
        <button
          type="submit"
          className="axis-select"
          style={{ fontWeight: axis === "thread" ? 700 : 400, opacity: axis === "thread" ? 1 : 0.55 }}
        >
          filo
        </button>
        <SaveWatcher />
      </form>
    </div>
  );
}

export default async function StoryPage({ params }) {
  const story = getStory(params.slug);

  const [genesisEvents, storyRows, childRows, parentRows] = await Promise.all([
    supabaseSelect(
      "ledger_genesis_events",
      `?story_ref=eq.${params.slug}.md&order=year.asc.nullslast,month.asc.nullslast`
    ),
    supabaseSelect("ledger_stories", `?slug=eq.${params.slug}`),
    supabaseSelect(
      "ledger_stories",
      `?parent_slug=eq.${params.slug}&select=slug,title,start_date,end_date&order=start_date.asc`
    ),
    supabaseSelect("ledger_stories", `?select=slug,title`),
  ]);
  const storyRow = storyRows[0] || null;

  // Some stories are pure structured data - an event or sub-event mined
  // from real records, never written up as narrative markdown. Only 404
  // when there's neither a story file nor a database row to show.
  if (!story && !storyRow) notFound();

  const parentStory = storyRow?.parent_slug
    ? parentRows.find((p) => p.slug === storyRow.parent_slug)
    : null;

  return (
    <>
      <p style={{ marginBottom: 16 }}>
        <a href="/stories">&larr; All stories</a>
      </p>

      {storyRow && (
        <div className="content" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <p className="field-label" style={{ margin: 0 }}>
              {storyRow.kind === "event" ? "Evento" : storyRow.kind === "sale" ? "Vendita" : "Momento o filo"}, sulla timeline
            </p>
            {storyRow.location && (
              <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>· {storyRow.location}</span>
            )}
          </div>
          {parentStory && (
            <p style={{ margin: "0 0 8px", fontSize: 13 }}>
              Parte di <a href={`/story/${parentStory.slug}`}>{parentStory.title}</a>
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="entry-meta" style={{ margin: 0 }}>Inizio</span>
              <TableCellInput action={updateStoryStart} id={storyRow.id} name="start_date" defaultValue={storyRow.start_date || ""} type="date" placeholder="start date" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="entry-meta" style={{ margin: 0 }}>Fine</span>
              <TableCellInput action={updateStoryEnd} id={storyRow.id} name="end_date" defaultValue={storyRow.end_date || ""} type="date" placeholder="ongoing" />
            </div>
            <AxisToggle id={storyRow.id} axis={storyRow.axis} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <span className="entry-meta" style={{ margin: 0 }}>Prossima azione</span>
            <TableCellInput action={updateStoryNextAction} id={storyRow.id} name="next_action" defaultValue={storyRow.next_action || ""} placeholder="cosa manca fare..." />
            <span className="entry-meta" style={{ margin: 0 }}>entro</span>
            <TableCellInput action={updateStoryNextActionDate} id={storyRow.id} name="next_action_date" defaultValue={storyRow.next_action_date || ""} type="date" placeholder="data" />
          </div>
          {childRows.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <span className="entry-meta" style={{ margin: 0 }}>Sotto-eventi ({childRows.length})</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {childRows.map((c) => (
                  <a key={c.slug} href={`/story/${c.slug}`} className="list-tab">
                    {c.title}
                  </a>
                ))}
              </div>
            </div>
          )}
          <p style={{ margin: "8px 0 0" }}>
            <a href="/genesis">Vedi sulla timeline unificata &rarr;</a>
          </p>
        </div>
      )}

      {genesisEvents.length > 0 && (
        <div className="content" style={{ marginBottom: 16 }}>
          <p className="field-label" style={{ marginBottom: 8 }}>
            Sulla genesi ({genesisEvents.length})
          </p>
          {genesisEvents.map((e) => (
            <div key={e.id} className="entry">
              <p style={{ fontWeight: 600, margin: "0 0 2px" }}>
                {e.year ? `${e.month ? e.month + "/" : ""}${e.year} — ` : ""}
                {e.title}
              </p>
              <p style={{ margin: 0, color: "var(--ink-dim)", fontSize: 13.5 }}>{e.description}</p>
            </div>
          ))}
        </div>
      )}

      {story && <article className="content" dangerouslySetInnerHTML={{ __html: story.html }} />}

      <SavedToast />
    </>
  );
}
