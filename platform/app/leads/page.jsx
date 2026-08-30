import { supabaseSelect } from "../../lib/supabase";
import { addLeadFromLinkedin } from "./actions";
import { icpRoleFit } from "../../lib/icp";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";
import connections from "../../data/linkedin-connections.json";

export const dynamic = "force-dynamic";

const QUICK_FILTERS = ["Founder", "CEO", "CMO", "Marketing", "Growth", "Partnership"];
const MAX_RESULTS = 150;
const ICP_LABEL = { good: "fit ICP buono", medium: "fit ICP medio" };

function matches(c, q) {
  const hay = `${c.fn} ${c.ln} ${c.company || ""} ${c.position || ""}`.toLowerCase();
  return hay.includes(q);
}

function normalizeUrl(u) {
  if (!u) return "";
  return u.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
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
  const icpOnly = searchParams?.icp === "1";

  const [people, companies, photos] = await Promise.all([
    supabaseSelect("ledger_people", "?select=id,name"),
    supabaseSelect("ledger_companies", "?select=id,name"),
    supabaseSelect("ledger_linkedin_connections", "?photo_url=not.is.null&select=linkedin_url,photo_url"),
  ]);
  const peopleByName = new Map(people.map((p) => [p.name.toLowerCase(), p]));
  const companyNames = new Set(companies.map((c) => c.name.toLowerCase()));
  const photoByUrl = new Map(photos.map((p) => [normalizeUrl(p.linkedin_url), p.photo_url]));

  const filtered = connections.filter((c) => {
    if (q && !matches(c, q)) return false;
    if (icpOnly && !icpRoleFit(c.position)) return false;
    return true;
  });
  const results = q || icpOnly ? filtered.slice(0, MAX_RESULTS) : [];
  const totalMatches = filtered.length;

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
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {QUICK_FILTERS.map((f) => (
            <a
              key={f}
              href={`/leads?q=${encodeURIComponent(f.toLowerCase())}${icpOnly ? "&icp=1" : ""}`}
              className="list-tab"
            >
              {f}
            </a>
          ))}
          <a
            href={`/leads?${q ? `q=${encodeURIComponent(q)}&` : ""}icp=${icpOnly ? "0" : "1"}`}
            className="list-tab"
            style={icpOnly ? { color: "var(--accent)", borderColor: "var(--accent)" } : undefined}
          >
            {icpOnly ? "✓ " : ""}Solo fit ICP (ruolo)
          </a>
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-faint)", margin: "8px 0 0" }}>
          Il fit ICP qui guarda solo il titolo (founder, CEO, CMO, growth, partnership...) - prezzo e
          free tier dell&apos;azienda non si leggono da LinkedIn, servirebbe un arricchimento in più.
        </p>
      </div>

      {!q && !icpOnly && (
        <p style={{ color: "var(--ink-faint)" }}>
          Scrivi qualcosa per iniziare - un ruolo, un&apos;azienda, un nome - o prova &ldquo;Solo fit ICP&rdquo;.
        </p>
      )}

      {(q || icpOnly) && results.length === 0 && (
        <p style={{ color: "var(--ink-faint)" }}>Niente per &ldquo;{q}&rdquo;.</p>
      )}

      {(q || icpOnly) && results.length > 0 && (
        <div className="content">
          <p className="field-label" style={{ margin: "0 0 10px" }}>
            {totalMatches.toLocaleString("it-IT")} risultati
            {totalMatches > MAX_RESULTS ? ` (primi ${MAX_RESULTS}, affina la ricerca)` : ""}
          </p>
          {results.map((c) => {
            const name = `${c.fn} ${c.ln}`.trim();
            const existingPerson = peopleByName.get(name.toLowerCase());
            const companyTracked = c.company && companyNames.has(c.company.toLowerCase());
            const icpFit = icpRoleFit(c.position);
            const photoUrl = photoByUrl.get(normalizeUrl(c.url));
            return (
              <div key={c.url || name} className="entry" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt=""
                    width={36}
                    height={36}
                    style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--line)",
                      flexShrink: 0,
                    }}
                  />
                )}
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
                  {icpFit && (
                    <span
                      className="nba-chip"
                      style={{ marginLeft: 8, color: icpFit === "good" ? "var(--accent)" : "var(--ink-dim)", borderColor: icpFit === "good" ? "var(--accent)" : "var(--line)" }}
                    >
                      {ICP_LABEL[icpFit]}
                    </span>
                  )}
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
