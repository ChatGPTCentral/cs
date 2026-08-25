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

// Two columns, but the click target is the MONTH, not each item - Alex's
// own words: "una cronostoria del mese", read in full once you pick it.
// Splitting selection down to individual facts/stories was the mistake in
// the previous pass: it turned reading into click-read-click-read instead
// of one normal scroll. The left column is purely a compact index of
// months; the right column is that month's whole story, still fully
// expanded and readable top to bottom - just one month's worth, not a
// whole year's worth, at a time.
export default function GenesisExplorer({ items, people, updateGenesisEvent }) {
  const peopleByName = useMemo(
    () => new Map(people.map((p) => [p.name.toLowerCase(), p])),
    [people]
  );

  const months = useMemo(() => {
    const byYearMonth = new Map();
    for (const it of items) {
      const gk = `${it.year}-${it.month}`;
      if (!byYearMonth.has(gk)) {
        byYearMonth.set(gk, { key: gk, year: it.year, month: it.month, items: [] });
      }
      byYearMonth.get(gk).items.push(it);
    }
    return [...byYearMonth.values()];
  }, [items]);

  const [selectedMonthKey, setSelectedMonthKey] = useState(months[months.length - 1]?.key || null);
  const selectedMonth = months.find((m) => m.key === selectedMonthKey) || months[months.length - 1];

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
        {months.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setSelectedMonthKey(m.key)}
            className={`genesis-explorer-month-row${selectedMonth?.key === m.key ? " genesis-explorer-month-row-active" : ""}`}
          >
            <span>{m.month ? MONTHS_IT[m.month] : "Senza mese"}</span>
            <span className="genesis-explorer-month-row-year">{m.year}</span>
            <span className="genesis-explorer-month-row-count">{m.items.length}</span>
          </button>
        ))}
      </div>

      <div className="genesis-explorer-detail">
        {!selectedMonth ? (
          <p style={{ color: "var(--ink-faint)" }}>Seleziona un mese a sinistra.</p>
        ) : (
          <MonthChronicle
            month={selectedMonth}
            peopleByName={peopleByName}
            updateGenesisEvent={updateGenesisEvent}
          />
        )}
      </div>
    </div>
  );
}

function MonthChronicle({ month, peopleByName, updateGenesisEvent }) {
  const stories = month.items.filter((it) => it.type === "story" && !it.isSub);
  const facts = month.items.filter((it) => it.type === "fact");
  const subsByParent = useMemo(() => {
    const map = new Map();
    for (const it of month.items) {
      if (it.type === "story" && it.isSub) {
        if (!map.has(it.parentSlug)) map.set(it.parentSlug, []);
        map.get(it.parentSlug).push(it);
      }
    }
    return map;
  }, [month]);

  return (
    <div>
      <h2 className="genesis-month-title">
        {month.month ? MONTHS_IT[month.month] : "Senza mese"} {month.year}
      </h2>

      {stories.length > 0 && (
        <div className="genesis-chronicle-stories">
          {stories.map((s) => (
            <StoryCard key={s.key} item={s} subs={subsByParent.get(s.slug) || []} />
          ))}
        </div>
      )}

      {facts.length > 0 && (
        <div className="genesis-chronicle-facts">
          {facts.map((f) => (
            <FactCard key={f.key} item={f} peopleByName={peopleByName} updateGenesisEvent={updateGenesisEvent} />
          ))}
        </div>
      )}

      {stories.length === 0 && facts.length === 0 && (
        <p style={{ color: "var(--ink-faint)" }}>Niente registrato per questo mese.</p>
      )}
    </div>
  );
}

function StoryCard({ item, subs }) {
  const colorClass =
    item.kind === "event" ? "genesis-story-card-event" :
    item.kind === "sale" ? "genesis-story-card-sale" :
    `genesis-story-card-${item.axis}`;
  const range =
    item.axis === "moment" && item.endDate && item.endDate !== item.startDate
      ? `${formatShort(item.startDate)} – ${formatShort(item.endDate)}`
      : formatShort(item.startDate);
  return (
    <div className={`genesis-story-card ${colorClass}`}>
      <a href={`/story/${item.slug}`} className="genesis-story-card-title">
        {item.title}
      </a>
      <span className="genesis-story-card-meta">
        {item.location ? `${item.location} · ` : ""}
        {range}
        {item.kind === "story" && item.axis === "thread" ? " →" : ""}
      </span>
      {subs.length > 0 && (
        <div className="genesis-story-card-subs">
          {subs.map((s) => (
            <a key={s.slug} href={`/story/${s.slug}`}>
              {s.title.replace(item.title, "").replace(/^ - /, "") || s.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FactCard({ item, peopleByName, updateGenesisEvent }) {
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
        rows={3}
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
