import { supabaseSelect } from "../../lib/supabase";
import { parseStorySlugs } from "../../lib/people";

export const dynamic = "force-dynamic";

const STALE_DAYS = 30;
// Events are historical record (Cannes 2026, a hackathon) - they do not
// take a next action and should not update, so they are not "going cold."
const ACTIONABLE_KINDS = new Set(["story", "sale"]);

function daysAgo(iso) {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

// The "lint" operation from the second-brain roadmap (docs/second-brain-
// roadmap.md, Phase 2): a health check over the ledger, not a new store.
// Everything here is derived read-only from ledger_stories and
// ledger_people - fixing a flag means editing the story or person page.
export default async function LintPage() {
  const [stories, people] = await Promise.all([
    supabaseSelect(
      "ledger_stories",
      "?select=slug,title,kind,next_action,next_action_date,updated_at"
    ),
    supabaseSelect(
      "ledger_people",
      "?archived=eq.false&select=id,name,org,stories,company_id&order=name.asc"
    ),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  const overdue = stories
    .filter((s) => s.next_action_date && s.next_action_date < today)
    .sort((a, b) => a.next_action_date.localeCompare(b.next_action_date));

  const stale = stories
    .filter((s) => {
      if (!ACTIONABLE_KINDS.has(s.kind)) return false;
      if (s.next_action_date) return false;
      const age = daysAgo(s.updated_at);
      return age !== null && age > STALE_DAYS;
    })
    .sort((a, b) => daysAgo(b.updated_at) - daysAgo(a.updated_at));

  const orphanPeople = people.filter((p) => {
    if (p.company_id) return false;
    return parseStorySlugs(p.stories).length === 0;
  });

  return (
    <div className="content" style={{ marginBottom: 20 }}>
      <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>Lint</h2>
      <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 16px" }}>
        Un controllo di salute sul ledger, non un archivio nuovo - tre cose
        da tenere d&apos;occhio: azioni scadute, storie che si stanno
        raffreddando, persone senza nessun collegamento.
      </p>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 600, fontSize: 15, margin: "0 0 8px" }}>
          Azioni scadute ({overdue.length})
        </h3>
        {overdue.length === 0 && <p style={{ color: "var(--ink-faint)" }}>Nessuna.</p>}
        {overdue.map((s) => (
          <div key={s.slug} className="entry">
            <a href={`/story/${s.slug}`}>
              <strong>{s.title}</strong>
            </a>
            <div className="entry-meta">
              scaduta il {s.next_action_date} · {s.next_action || "(nessuna nota)"}
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 600, fontSize: 15, margin: "0 0 8px" }}>
          Storie che si raffreddano ({stale.length})
        </h3>
        <p style={{ fontSize: 12.5, color: "var(--ink-faint)", margin: "0 0 8px" }}>
          Nessun next action impostato, ferme da oltre {STALE_DAYS} giorni.
        </p>
        {stale.length === 0 && <p style={{ color: "var(--ink-faint)" }}>Nessuna.</p>}
        {stale.map((s) => (
          <div key={s.slug} className="entry">
            <a href={`/story/${s.slug}`}>
              <strong>{s.title}</strong>
            </a>
            <div className="entry-meta">ferma da {daysAgo(s.updated_at)} giorni</div>
          </div>
        ))}
      </section>

      <section>
        <h3 style={{ fontWeight: 600, fontSize: 15, margin: "0 0 8px" }}>
          Persone senza collegamenti ({orphanPeople.length})
        </h3>
        <p style={{ fontSize: 12.5, color: "var(--ink-faint)", margin: "0 0 8px" }}>
          Nessuna azienda e nessuna storia taggata - non compaiono nel
          grafo su /network.
        </p>
        {orphanPeople.length === 0 && <p style={{ color: "var(--ink-faint)" }}>Nessuna.</p>}
        {orphanPeople.map((p) => (
          <div key={p.id} className="entry">
            <a href={`/people/${p.id}`}>
              <strong>{p.name}</strong>
            </a>
            {p.org ? <span className="entry-meta"> {p.org}</span> : null}
          </div>
        ))}
      </section>
    </div>
  );
}
