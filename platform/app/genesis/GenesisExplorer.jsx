"use client";

import { useMemo, useState } from "react";
import TableCellInput from "../people/TableCellInput";
import Avatar from "../people/Avatar";

const MONTHS_IT = [
  "", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function formatShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

function rowDate(item) {
  if (item.type === "fact") return "";
  const range =
    item.axis === "moment" && item.endDate && item.endDate !== item.startDate
      ? `${formatShort(item.startDate)} – ${formatShort(item.endDate)}`
      : formatShort(item.startDate);
  return item.kind === "story" && item.axis === "thread" ? `${range} →` : range;
}

// Gmail-style master/detail: a compact, chronological left list the reader
// can actually take in at a glance, and a right pane that only shows one
// thing in full at a time - instead of every fact and story chip expanded
// inline down one long column, which is what made a busy month unreadable.
export default function GenesisExplorer({ items, people, updateGenesisEvent }) {
  const peopleByName = useMemo(
    () => new Map(people.map((p) => [p.name.toLowerCase(), p])),
    [people]
  );
  const itemsByKey = useMemo(() => new Map(items.map((it) => [it.key, it])), [items]);

  const groups = useMemo(() => {
    const byYearMonth = new Map();
    for (const it of items) {
      const gk = `${it.year}-${it.month}`;
      if (!byYearMonth.has(gk)) {
        byYearMonth.set(gk, { year: it.year, month: it.month, items: [] });
      }
      byYearMonth.get(gk).items.push(it);
    }
    return [...byYearMonth.values()];
  }, [items]);

  const [selectedKey, setSelectedKey] = useState(items[0]?.key || null);
  const selected = selectedKey ? itemsByKey.get(selectedKey) : null;

  if (items.length === 0) {
    return (
      <div className="content wide-content">
        <p style={{ color: "var(--ink-faint)" }}>Niente da mostrare per questo periodo.</p>
      </div>
    );
  }

  return (
    <div className="content wide-content genesis-explorer">
      <div className="genesis-explorer-list">
        {groups.map((g) => (
          <div key={`${g.year}-${g.month}`} className="genesis-explorer-group">
            <div className="genesis-explorer-month">
              {g.month ? MONTHS_IT[g.month] : "Senza mese"} <span>{g.year}</span>
            </div>
            {g.items.map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => setSelectedKey(it.key)}
                className={`genesis-explorer-row${selectedKey === it.key ? " genesis-explorer-row-active" : ""}${it.isSub ? " genesis-explorer-row-sub" : ""}`}
              >
                <span className={`genesis-explorer-dot genesis-explorer-dot-${it.dot}`} />
                <span className="genesis-explorer-row-title">{it.title}</span>
                <span className="genesis-explorer-row-date">{rowDate(it)}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="genesis-explorer-detail">
        {!selected ? (
          <p style={{ color: "var(--ink-faint)" }}>Seleziona una voce a sinistra.</p>
        ) : selected.type === "fact" ? (
          <FactDetail item={selected} peopleByName={peopleByName} updateGenesisEvent={updateGenesisEvent} />
        ) : (
          <StoryDetail item={selected} itemsByKey={itemsByKey} onPick={setSelectedKey} />
        )}
      </div>
    </div>
  );
}

function FactDetail({ item, peopleByName, updateGenesisEvent }) {
  return (
    <div className="genesis-entry">
      <TableCellInput
        action={updateGenesisEvent}
        id={item.id}
        name="title"
        defaultValue={item.title}
        placeholder="Titolo"
      />
      <TableCellInput
        action={updateGenesisEvent}
        id={item.id}
        name="description"
        defaultValue={item.description}
        placeholder="Descrizione"
        multiline
        rows={4}
      />
      <div className="genesis-people-row">
        {item.peopleNames.length > 0 && (
          <div className="genesis-people-links">
            {item.peopleNames.map((n) => {
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
            id={item.id}
            name="people_names"
            defaultValue={item.defaultPeopleNames}
            placeholder="Persone collegate (separate da virgola)"
            listId="genesis-people-names"
          />
        </div>
      </div>
      <div className="entry-meta">
        {item.sourceTag}
        {item.storySlug && (
          <>
            {" — "}
            <a href={`/story/${item.storySlug}`}>{item.storyRef}</a>
          </>
        )}
      </div>
    </div>
  );
}

function StoryDetail({ item, itemsByKey, onPick }) {
  const kindLabel = item.kind === "event" ? "Evento" : item.kind === "sale" ? "Vendita" : item.axis === "thread" ? "Filo" : "Momento";
  return (
    <div className="genesis-entry">
      {item.parentSlug && itemsByKey.get(`story:${item.parentSlug}`) && (
        <button
          type="button"
          className="genesis-explorer-parent-link"
          onClick={() => onPick(`story:${item.parentSlug}`)}
        >
          &larr; {item.parentTitle}
        </button>
      )}
      <p style={{ fontWeight: 600, fontSize: 16, margin: "4px 0 4px" }}>{item.title}</p>
      <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--ink-faint)" }}>
        {kindLabel}
        {item.location ? ` · ${item.location}` : ""}
        {" · "}
        {formatShort(item.startDate)}
        {item.endDate && item.endDate !== item.startDate ? ` – ${formatShort(item.endDate)}` : ""}
      </p>
      {item.childTitles.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <span className="entry-meta" style={{ margin: 0 }}>Sotto-eventi ({item.childTitles.length})</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {item.childTitles.map((c) => (
              <button key={c.slug} type="button" className="list-tab" onClick={() => onPick(`story:${c.slug}`)}>
                {c.title}
              </button>
            ))}
          </div>
        </div>
      )}
      <p style={{ margin: "10px 0 0" }}>
        <a href={`/story/${item.slug}`}>Apri la pagina completa &rarr;</a>
      </p>
    </div>
  );
}
