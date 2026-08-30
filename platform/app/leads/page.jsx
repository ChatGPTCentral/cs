import { supabaseSelect } from "../../lib/supabase";
import { addLeadFromLinkedin } from "./actions";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";
import connections from "../../data/linkedin-connections.json";

export const dynamic = "force-dynamic";

const QUICK_FILTERS = ["Founder", "CEO", "CMO", "Marketing", "Growth", "Partnership"];
const MAX_RESULTS = 150;

function matches(c, q) {
  const hay = `${c.fn} ${c.ln} ${c.company || ""} ${c.position || ""}`.toLowerCase();
  return hay.includes(q);
}

// Exploration layer over Alex's full LinkedIn export (10k+ connections,
// git-tracked as a static file - see platform/data/linkedin-connections.json
// - re-generate it from a fresh LinkedIn data export when it goes stale).
// This is deliberately separate from ledger_linkedin_connections, which
// only holds the small, already-cross-referenced subset used on /people
// and /clienti. Here Alex browses everyone and promotes a hit to a real
// CRM person with one click - the "find new leads" half of the CRM.
export default async function LeadsPage({ searchParams }) {
  const q = (searchParams?.q || "").trim().toLowerCase();

  const [people, companies] = await Promise.all([
    supabaseSelect("ledger_people", "?select=id,name"),
    supabaseSelect("ledger_companies", "?select=id,name"),
  ]);
  const peopleByName = new Map(people.map((p) => [p.name.toLowerCase(), p]));
  const companyNames = new Set(companies.map((c) => c.name.toLowerCase()));

  const results = q
    ? connections.filter((c) => matches(c, q)).slice(0, MAX_RESULTS)
    : [];
  const totalMatches = q ? connections.filter((c) => matches(c, q)).length : 0;

  return (
    <>
      <div className="content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>Lead da LinkedIn</h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 12px" }}>
          {connections.length.toLocaleString("it-IT")} connessioni del tuo export LinkedIn. Cerca per
          nome, azienda o ruolo - chi non è ancora nel CRM si aggiunge con un click.
        </p>
        <form method="GET" action="/leads" style={{ marginBottom: 10 }}>
          <input
            type="text"
            name="q"
            defaultValue={q}
            autoFocus
            placeholder="es. founder, growth, Gamma, Replit..."
            style={{ fontSize: 14, padding: "8px 12px", border: "1px solid var(--line)", borderRadius: "var(--radius)", width: "100%", maxWidth: 420 }}
          />
        </form>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {QUICK_FILTERS.map((f) => (
            <a key={f} href={`/leads?q=${encodeURIComponent(f.toLowerCase())}`} className="list-tab">
              {f}
            </a>
          ))}
        </div>
      </div>

      {!q && (
        <p style={{ color: "var(--ink-faint)" }}>
          Scrivi qualcosa per iniziare - un ruolo, un&apos;azienda, un nome.
        </p>
      )}

      {q && results.length === 0 && (
        <p style={{ color: "var(--ink-faint)" }}>Niente per &ldquo;{q}&rdquo;.</p>
      )}

      {q && results.length > 0 && (
        <div className="content">
          <p className="field-label" style={{ margin: "0 0 10px" }}>
            {totalMatches.toLocaleString("it-IT")} risultati
            {totalMatches > MAX_RESULTS ? ` (primi ${MAX_RESULTS}, affina la ricerca)` : ""}
          </p>
          {results.map((c) => {
            const name = `${c.fn} ${c.ln}`.trim();
            const existingPerson = peopleByName.get(name.toLowerCase());
            const companyTracked = c.company && companyNames.has(c.company.toLowerCase());
            return (
              <div key={c.url || name} className="entry" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <strong>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener">
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </strong>
                  <div className="entry-meta">
                    {c.position}
                    {c.position && c.company ? " · " : ""}
                    {c.company}
                    {companyTracked && <span style={{ color: "var(--accent)" }}> · azienda già tracciata</span>}
                  </div>
                </div>
                {existingPerson ? (
                  <a href={`/people/${existingPerson.id}`} className="nba-chip" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                    già nel CRM
                  </a>
                ) : (
                  <form action={addLeadFromLinkedin}>
                    <input type="hidden" name="fn" value={c.fn || ""} />
                    <input type="hidden" name="ln" value={c.ln || ""} />
                    <input type="hidden" name="url" value={c.url || ""} />
                    <input type="hidden" name="company" value={c.company || ""} />
                    <input type="hidden" name="position" value={c.position || ""} />
                    <button type="submit" className="mention-accept">
                      + aggiungi come lead
                    </button>
                    <SaveWatcher />
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}

      <SavedToast />
    </>
  );
}
