import { supabaseSelect } from "../../lib/supabase";
import { buildBacklinkIndex, escapeRegex } from "../../lib/links";
import Avatar from "../people/Avatar";

export const dynamic = "force-dynamic";

// Unified index across stories, people and genesis events. Plain
// substring scoring - at this corpus size (160 stories, 300 people, 110
// events) exact-and-substring beats any fuzzy layer, and every result
// carries provenance instead of a similarity score.
function score(q, exact, strong, weak) {
  if (exact) return 3;
  if (strong) return 2;
  if (weak) return 1;
  return 0;
}

function snippet(text, q) {
  if (!text) return null;
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return null;
  const start = Math.max(0, i - 60);
  const end = Math.min(text.length, i + q.length + 80);
  const cut = (start > 0 ? "..." : "") + text.slice(start, end).replace(/\n/g, " ") + (end < text.length ? "..." : "");
  const parts = cut.split(new RegExp(`(${escapeRegex(q)})`, "i"));
  return parts;
}

function Snippet({ parts, q }) {
  if (!parts) return null;
  return (
    <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--ink-dim)", flexBasis: "100%" }}>
      {parts.map((p, i) =>
        p.toLowerCase() === q ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>
      )}
    </p>
  );
}

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q || "").trim().toLowerCase();

  if (!q || q.length < 2) {
    return (
      <div className="content">
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>Cerca</h2>
        <form method="GET" action="/search">
          <input
            type="text"
            name="q"
            autoFocus
            placeholder="Una storia, una persona, un fatto della genesi..."
            style={{ fontSize: 14, padding: "8px 12px", border: "1px solid var(--line)", borderRadius: "var(--radius)", width: "100%", maxWidth: 420 }}
          />
        </form>
      </div>
    );
  }

  const [storyRows, people, events] = await Promise.all([
    supabaseSelect("ledger_stories", "?select=slug,title,kind,start_date"),
    supabaseSelect("ledger_people", "?archived=eq.false&select=id,name,org,identity,background,lists,photo_url"),
    supabaseSelect("ledger_genesis_events", "?select=id,title,description,story_ref,year,month"),
  ]);
  const { rawBySlug } = buildBacklinkIndex();

  const stories = storyRows
    .map((s) => {
      const raw = rawBySlug.get(s.slug) || "";
      const t = s.title.toLowerCase();
      const sc = score(q, t === q, t.includes(q) || s.slug.includes(q), raw.toLowerCase().includes(q));
      return sc > 0 ? { ...s, sc, parts: sc === 1 ? snippet(raw, q) : null } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.sc - a.sc || a.title.localeCompare(b.title));

  const persons = people
    .map((p) => {
      const n = (p.name || "").toLowerCase();
      const meta = `${p.org || ""} ${p.identity || ""} ${p.lists || ""}`.toLowerCase();
      const sc = score(q, n === q, n.includes(q) || meta.includes(q), (p.background || "").toLowerCase().includes(q));
      return sc > 0 ? { ...p, sc, parts: sc === 1 ? snippet(p.background, q) : null } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.sc - a.sc || a.name.localeCompare(b.name));

  const facts = events
    .map((e) => {
      const t = (e.title || "").toLowerCase();
      const sc = score(q, t === q, t.includes(q), (e.description || "").toLowerCase().includes(q));
      return sc > 0 ? { ...e, sc, parts: sc === 1 ? snippet(e.description, q) : null } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.sc - a.sc);

  const total = stories.length + persons.length + facts.length;

  return (
    <div className="content">
      <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>
        Risultati per &ldquo;{q}&rdquo; ({total})
      </h2>
      <form method="GET" action="/search" style={{ margin: "0 0 16px" }}>
        <input
          type="text"
          name="q"
          defaultValue={q}
          style={{ fontSize: 14, padding: "8px 12px", border: "1px solid var(--line)", borderRadius: "var(--radius)", width: "100%", maxWidth: 420 }}
        />
      </form>

      {total === 0 && <p style={{ color: "var(--ink-faint)" }}>Niente - prova con meno lettere o un altro nome.</p>}

      {stories.length > 0 && (
        <>
          <p className="field-label" style={{ margin: "12px 0 6px" }}>Storie ({stories.length})</p>
          {stories.map((s) => (
            <div key={s.slug} className="entry">
              <a href={`/story/${s.slug}`}><strong>{s.title}</strong></a>
              {s.kind === "sale" && <span className="entry-meta"> · cliente</span>}
              {s.start_date && <span className="entry-meta"> · {s.start_date.slice(0, 7)}</span>}
              <Snippet parts={s.parts} q={q} />
            </div>
          ))}
        </>
      )}

      {persons.length > 0 && (
        <>
          <p className="field-label" style={{ margin: "16px 0 6px" }}>Persone ({persons.length})</p>
          {persons.map((p) => (
            <div key={p.id} className="entry" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Avatar name={p.name} photoUrl={p.photo_url} size={22} />
              <a href={`/people/${p.id}`}><strong>{p.name}</strong></a>
              {p.org && <span className="entry-meta"> · {p.org}</span>}
              <Snippet parts={p.parts} q={q} />
            </div>
          ))}
        </>
      )}

      {facts.length > 0 && (
        <>
          <p className="field-label" style={{ margin: "16px 0 6px" }}>Genesi ({facts.length})</p>
          {facts.map((e) => (
            <div key={e.id} className="entry">
              <a href={e.story_ref ? `/story/${e.story_ref.replace(/\.md$/, "")}` : "/genesis"}>
                <strong>
                  {e.year ? `${e.month ? e.month + "/" : ""}${e.year} - ` : ""}
                  {e.title}
                </strong>
              </a>
              <Snippet parts={e.parts} q={q} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
