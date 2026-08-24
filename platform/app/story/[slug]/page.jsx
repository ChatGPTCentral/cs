import { notFound } from "next/navigation";
import { getStory } from "../../../lib/ledger";
import { supabaseSelect } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function StoryPage({ params }) {
  const story = getStory(params.slug);
  if (!story) notFound();

  const genesisEvents = await supabaseSelect(
    "ledger_genesis_events",
    `?story_ref=eq.${params.slug}.md&order=year.asc.nullslast,month.asc.nullslast`
  );

  return (
    <>
      <p style={{ marginBottom: 16 }}>
        <a href="/stories">&larr; All stories</a>
      </p>

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
          <p style={{ margin: "8px 0 0" }}>
            <a href="/genesis">Vedi e correggi sulla timeline &rarr;</a>
          </p>
        </div>
      )}

      <article className="content" dangerouslySetInnerHTML={{ __html: story.html }} />
    </>
  );
}
