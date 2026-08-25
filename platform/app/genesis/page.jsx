import { supabaseSelect } from "../../lib/supabase";
import { updateGenesisEvent, addGenesisEvent } from "./actions";
import SavedToast from "../people/SavedToast";
import GenesisExplorer from "./GenesisExplorer";

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

export default async function GenesisPage({ searchParams }) {
  const yearParam = searchParams?.year;
  const showAllYears = yearParam === "all";

  const [events, people, stories] = await Promise.all([
    supabaseSelect(
      "ledger_genesis_events",
      "?order=year.asc.nullslast,month.asc.nullslast,sort_order.asc"
    ),
    supabaseSelect("ledger_people", "?select=id,name,photo_url&order=name.asc"),
    supabaseSelect(
      "ledger_stories",
      "?start_date=not.is.null&select=slug,title,start_date,end_date,axis,kind,location,parent_slug&order=start_date.asc"
    ),
  ]);

  const dated = events.filter((e) => e.year);
  const undated = events.filter((e) => !e.year);

  const storiesBySlug = new Map(stories.map((s) => [s.slug, s]));

  // One flat, chronological list - facts and stories (events, sales, and
  // now sub-events again) merged into single items an explorer can select
  // between, instead of two parallel piles the reader has to cross-reference
  // by eye. Facts (no day, only year/month) sort first within their month;
  // dated stories follow in real date order - the closest thing to a true
  // day-by-day reading this data supports.
  const items = [];

  for (const e of dated) {
    const names = parseNames(e.people_names);
    items.push({
      key: `fact:${e.id}`,
      type: "fact",
      year: e.year,
      month: e.month || 0,
      day: -1,
      dot: "fact",
      title: e.title,
      description: e.description,
      peopleNames: names,
      sourceTag: e.source_tag,
      storySlug: slugFromRef(e.story_ref),
      storyRef: e.story_ref,
      id: e.id,
      defaultPeopleNames: e.people_names || "",
    });
  }

  for (const s of stories) {
    const d = new Date(s.start_date);
    const parent = s.parent_slug ? storiesBySlug.get(s.parent_slug) : null;
    const children = stories.filter((c) => c.parent_slug === s.slug);
    items.push({
      key: `story:${s.slug}`,
      type: "story",
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      dot: s.kind === "event" ? "event" : s.kind === "sale" ? "sale" : s.axis,
      title: s.title,
      slug: s.slug,
      kind: s.kind,
      axis: s.axis,
      location: s.location || null,
      startDate: s.start_date,
      endDate: s.end_date,
      isSub: !!s.parent_slug,
      parentTitle: parent?.title || null,
      parentSlug: s.parent_slug || null,
      childTitles: children.map((c) => ({ slug: c.slug, title: c.title })),
    });
  }

  items.sort((a, b) => a.year - b.year || a.month - b.month || a.day - b.day);

  const allYears = [...new Set(items.map((it) => it.year))].sort((a, b) => b - a);
  const activeYear = showAllYears ? null : yearParam ? Number(yearParam) : allYears[0] ?? null;
  const visibleItems = showAllYears ? items : items.filter((it) => it.year === activeYear);

  return (
    <>
      <div className="content wide-content" style={{ marginBottom: 20 }}>
        <div className="genesis-header-row">
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 2px" }}>
            La genesi di AI Central, mese per mese
          </h2>
          <span className="genesis-header-count">
            {events.length} fatti, {stories.length} storie datate
          </span>
        </div>

        {allYears.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "6px 0 4px" }}>
            <a href="/genesis?year=all" className={`list-tab${showAllYears ? " list-tab-active" : ""}`}>
              Tutti
            </a>
            {allYears.map((y) => (
              <a
                key={y}
                href={`/genesis?year=${y}`}
                className={`list-tab${!showAllYears && activeYear === y ? " list-tab-active" : ""}`}
              >
                {y}
              </a>
            ))}
          </div>
        )}

        <details className="genesis-disclosure">
          <summary>Come funziona</summary>
          <p>
            A sinistra la cronologia del mese, compatta - click su una voce per aprirla a destra.
            Il colore del pallino dice il tipo:{" "}
            <span style={{ color: "var(--event-ink)" }}>teal</span> evento reale (un luogo dove sei
            stato, con posizione e date), <span style={{ color: "var(--sale-ink)" }}>viola</span>{" "}
            vendita o sponsorship, <span style={{ color: "var(--moment-ink)" }}>ambra</span> momento
            (inizio e fine), <span style={{ color: "var(--accent-ink)" }}>blu</span> filo (un
            rapporto che continua), grigio un fatto scritto a mano. Un sotto-evento (una sessione
            dentro un evento più grande) è rientrato.
          </p>
          <p>
            Nel pannello di un fatto, il campo &quot;persone collegate&quot; è vuoto per default -
            nessun nome indovinato dal testo. Scrivi il nome esatto come appare in{" "}
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

      <GenesisExplorer
        items={visibleItems}
        people={people}
        monthsIt={MONTHS_IT}
        updateGenesisEvent={updateGenesisEvent}
      />

      {showAllYears && undated.length > 0 && (
        <div className="content wide-content" style={{ marginTop: 20 }}>
          <h2 className="genesis-year">Senza data</h2>
          <p style={{ fontSize: 12, color: "var(--ink-faint)", margin: "0 0 14px" }}>
            Fatti veri, ma non databili - identità, pattern, contesto che non è legato a un mese
            preciso.
          </p>
          {undated.map((e) => (
            <div key={e.id} className="genesis-entry" style={{ marginBottom: 10 }}>
              <p style={{ fontWeight: 600, margin: "0 0 4px" }}>{e.title}</p>
              <p style={{ margin: 0, color: "var(--ink-dim)", fontSize: 13.5 }}>{e.description}</p>
            </div>
          ))}
        </div>
      )}

      <SavedToast />
    </>
  );
}
