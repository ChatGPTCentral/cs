import { Fragment } from "react";
import { supabaseSelect } from "../../lib/supabase";
import { updateGenesisEvent, addGenesisEvent } from "./actions";
import TableCellInput from "../people/TableCellInput";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";
import Avatar from "../people/Avatar";

export const dynamic = "force-dynamic";

const MONTHS_IT = [
  "", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function slugFromRef(ref) {
  return ref ? ref.replace(/\.md$/, "") : null;
}

// Comma-separated names, same free-text convention as ledger_people.stories
// - trimmed, empties dropped. Resolved against real people at render time,
// not stored as ids, so a typo is visible instead of silently pointing
// nowhere.
function parseNames(names) {
  if (!names) return [];
  return names.split(",").map((n) => n.trim()).filter(Boolean);
}

function formatShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

// A story (momento or filo) placed under its start month - the same
// board /timeline used to show separately, now inline with the facts
// from the same month instead of on a second page.
function StoryChip({ s }) {
  return (
    <a href={`/story/${s.slug}`} className={`genesis-story-chip genesis-story-chip-${s.axis}`}>
      <span className="genesis-story-chip-dot" />
      {s.title}
      <span className="genesis-story-chip-dates">
        {formatShort(s.start_date)}
        {s.axis === "moment" && s.end_date ? ` – ${formatShort(s.end_date)}` : ""}
        {s.axis === "thread" ? " →" : ""}
      </span>
    </a>
  );
}

function GenesisEntry({ e, peopleByName }) {
  const slug = slugFromRef(e.story_ref);
  const names = parseNames(e.people_names);
  return (
    <div className="genesis-entry">
      <TableCellInput
        action={updateGenesisEvent}
        id={e.id}
        name="title"
        defaultValue={e.title}
        placeholder="Titolo"
      />
      <TableCellInput
        action={updateGenesisEvent}
        id={e.id}
        name="description"
        defaultValue={e.description}
        placeholder="Descrizione"
        multiline
        rows={3}
      />
      <div className="genesis-people-row">
        {names.length > 0 && (
          <div className="genesis-people-links">
            {names.map((n) => {
              const p = peopleByName.get(n.toLowerCase());
              return p ? (
                <a key={n} href={`/people/${p.id}`} className="genesis-person-chip">
                  <Avatar name={p.name} photoUrl={p.photo_url} size={20} />
                  {p.name}
                </a>
              ) : (
                <span key={n} className="genesis-person-chip genesis-person-unmatched" title="Nessuna persona con questo nome in /people">
                  {n} ?
                </span>
              );
            })}
          </div>
        )}
        <div className="genesis-people-edit">
          <TableCellInput
            action={updateGenesisEvent}
            id={e.id}
            name="people_names"
            defaultValue={e.people_names || ""}
            placeholder="Persone collegate (separate da virgola)"
            listId="genesis-people-names"
          />
        </div>
      </div>
      <div className="entry-meta">
        {e.source_tag}
        {slug && (
          <>
            {" — "}
            <a href={`/story/${slug}`}>{e.story_ref}</a>
          </>
        )}
      </div>
    </div>
  );
}

export default async function GenesisPage() {
  const [events, people, stories] = await Promise.all([
    supabaseSelect(
      "ledger_genesis_events",
      "?order=year.asc.nullslast,month.asc.nullslast,sort_order.asc"
    ),
    supabaseSelect("ledger_people", "?select=id,name,photo_url&order=name.asc"),
    supabaseSelect(
      "ledger_stories",
      "?start_date=not.is.null&select=slug,title,start_date,end_date,axis&order=start_date.asc"
    ),
  ]);

  const peopleByName = new Map(people.map((p) => [p.name.toLowerCase(), p]));

  const dated = events.filter((e) => e.year);
  const undated = events.filter((e) => !e.year);

  const byYear = new Map();
  for (const e of dated) {
    if (!byYear.has(e.year)) byYear.set(e.year, new Map());
    const byMonth = byYear.get(e.year);
    const mk = e.month || 0;
    if (!byMonth.has(mk)) byMonth.set(mk, { facts: [], stories: [] });
    byMonth.get(mk).facts.push(e);
  }

  // Stories join the same year/month grid, keyed off their real
  // start_date - the "momenti e storie" view that used to live on its own
  // page, now inline with the atomic facts from the same month.
  for (const s of stories) {
    const d = new Date(s.start_date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    if (!byYear.has(year)) byYear.set(year, new Map());
    const byMonth = byYear.get(year);
    if (!byMonth.has(month)) byMonth.set(month, { facts: [], stories: [] });
    byMonth.get(month).stories.push(s);
  }

  const years = [...byYear.keys()].sort((a, b) => a - b);

  return (
    <>
      <datalist id="genesis-people-names">
        {people.map((p) => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>

      <div className="content wide-content" style={{ marginBottom: 20 }}>
        <div className="genesis-header-row">
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 2px" }}>
            La genesi di AI Central, mese per mese
          </h2>
          <span className="genesis-header-count">
            {events.length} fatti, {stories.length} storie datate
          </span>
        </div>

        <details className="genesis-disclosure">
          <summary>Come funziona</summary>
          <p>
            I fatti (in italiano) si editano sul posto: clicca titolo o descrizione, salva da solo
            quando clicchi fuori, niente pulsante Salva. Le storie (i chip colorati) sono momenti
            (un evento con inizio e fine, <span style={{ color: "var(--moment-ink)" }}>ambra</span>)
            o fili (un rapporto che continua,{" "}
            <span style={{ color: "var(--accent-ink)" }}>blu</span>) - click per aprire la loro
            pagina, dove si editano data e asse.
          </p>
          <p>
            Il campo &quot;persone collegate&quot; sotto ogni fatto è vuoto per default - nessun
            nome indovinato dal testo. Scrivi il nome esatto come appare in{" "}
            <a href="/people">/people</a> (autocompletamento incluso); un nome che non trova
            corrispondenza resta segnato con un punto interrogativo invece di un link.
          </p>
        </details>

        <details className="genesis-disclosure">
          <summary>+ Nuovo fatto</summary>
          <form action={addGenesisEvent} className="crm-form" style={{ marginTop: 10 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input id="f-genesis-title" name="title" placeholder="Titolo" style={{ flex: 1, minWidth: 180 }} required />
              <input name="year" type="number" placeholder="Anno" style={{ width: 90 }} />
              <select name="month" style={{ width: 130 }} defaultValue="">
                <option value="">(nessun mese)</option>
                {MONTHS_IT.slice(1).map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <button type="submit">Aggiungi</button>
            </div>
            <textarea name="description" placeholder="Descrizione" rows={2} style={{ marginTop: 8, width: "100%" }} required />
          </form>
        </details>
      </div>

      <div className="content wide-content">
        {years.map((year) => {
          const byMonth = byYear.get(year);
          const monthKeys = [...byMonth.keys()].sort((a, b) => a - b);
          return (
            <div key={year}>
              <h2 className="genesis-year">{year}</h2>
              <div className="genesis-grid">
                <div className="genesis-rail-line" />
                {monthKeys.map((mk) => {
                  const bucket = byMonth.get(mk);
                  return (
                    <Fragment key={`${year}-${mk}`}>
                      <div className="genesis-month-label">
                        {mk ? MONTHS_IT[mk] : "—"}
                      </div>
                      <div className="genesis-dot-col">
                        <span className="genesis-dot" />
                      </div>
                      <div className="genesis-month-entries">
                        {bucket.stories.length > 0 && (
                          <div className="genesis-story-chips">
                            {bucket.stories.map((s) => (
                              <StoryChip key={s.slug} s={s} />
                            ))}
                          </div>
                        )}
                        {bucket.facts.map((e) => (
                          <GenesisEntry key={e.id} e={e} peopleByName={peopleByName} />
                        ))}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}

        {undated.length > 0 && (
          <div>
            <h2 className="genesis-year">Senza data</h2>
            <p style={{ fontSize: 12, color: "var(--ink-faint)", margin: "0 0 14px" }}>
              Fatti veri, ma non databili - identità, pattern, contesto che non è legato a un mese
              preciso.
            </p>
            {undated.map((e) => (
              <GenesisEntry key={e.id} e={e} peopleByName={peopleByName} />
            ))}
          </div>
        )}
      </div>

      <SavedToast />
    </>
  );
}
