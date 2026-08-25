import { notFound } from "next/navigation";
import { getStory } from "../../../lib/ledger";
import { supabaseSelect } from "../../../lib/supabase";
import { updateStoryStart, updateStoryEnd, updateStoryAxis } from "../actions";
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
  if (!story) notFound();

  const [genesisEvents, storyRows] = await Promise.all([
    supabaseSelect(
      "ledger_genesis_events",
      `?story_ref=eq.${params.slug}.md&order=year.asc.nullslast,month.asc.nullslast`
    ),
    supabaseSelect("ledger_stories", `?slug=eq.${params.slug}`),
  ]);
  const storyRow = storyRows[0] || null;

  return (
    <>
      <p style={{ marginBottom: 16 }}>
        <a href="/stories">&larr; All stories</a>
      </p>

      {storyRow && (
        <div className="content" style={{ marginBottom: 16 }}>
          <p className="field-label" style={{ marginBottom: 8 }}>
            Momento o filo, sulla timeline
          </p>
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

      <article className="content" dangerouslySetInnerHTML={{ __html: story.html }} />

      <SavedToast />
    </>
  );
}
