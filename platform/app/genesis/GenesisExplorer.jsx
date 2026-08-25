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

// One continuous scroll, not a click-to-open pane - Alex asked directly to
// scroll through time with the trackpad. The left column is pure navigation
// (year, then month, jump links via #anchor), never a selection state. Each
// month's content is grouped by what it actually is - eventi, storie, sales,
// altre conversazioni (hand-written facts) - instead of one undifferentiated
// pile, so a busy month still reads at a glance before you read it in full.
export default function GenesisExplorer({ items, people, updateGenesisEvent }) {
  const peopleByName = new Map(people.map((p) => [p.name.toLowerCase(), p]));

  // Sub-events keyed by parent slug across the WHOLE dataset, not per month -
  // a sub-event dated in a different month than its parent still needs to
  // show up nested under it, not silently vanish.
  const subsByParent = new Map();
  for (const it of items) {
    if (it.type === "story" && it.isSub) {
      if (!subsByParent.has(it.parentSlug)) subsByParent.set(it.parentSlug, []);
      subsByParent.get(it.parentSlug).push(it);
    }
  }

  const byYearMonth = new Map();
  for (const it of items) {
    const gk = `${it.year}-${it.month}`;
    if (!byYearMonth.has(gk)) {
      byYearMonth.set(gk, { key: gk, year: it.year, month: it.month, items: [] });
    }
    byYearMonth.get(gk).items.push(it);
  }
  const months = [...byYearMonth.values()].sort((a, b) => b.year - a.year || b.month - a.month);

  const yearGroups = new Map();
  for (const m of months) {
    if (!yearGroups.has(m.year)) yearGroups.set(m.year, []);
    yearGroups.get(m.year).push(m);
  }

  if (items.length === 0) {
    return (
      <div className="content wide-content">
        <p style={{ color: "var(--ink-faint)" }}>Niente da mostrare per questo periodo.</p>
      </div>
    );
  }

  return (
    <div className="content wide-content genesis-explorer">
      <nav className="genesis-explorer-nav">
        {[...yearGroups.entries()].map(([year, ms]) => (
          <div key={year} className="genesis-nav-year-group">
            <div className="genesis-nav-year">{year}</div>
            {ms.map((m) => (
              <a key={m.key} href={`#m-${m.key}`} className="genesis-nav-month">
                <span>{m.month ? MONTHS_IT[m.month] : "Senza mese"}</span>
                <span className="genesis-nav-month-count">{m.items.length}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div className="genesis-explorer-scroll">
        {months.map((m) => (
          <MonthSection
            key={m.key}
            month={m}
            subsByParent={subsByParent}
            peopleByName={peopleByName}
            updateGenesisEvent={updateGenesisEvent}
          />
        ))}
      </div>
    </div>
  );
}

function MonthSection({ month, subsByParent, peopleByName, updateGenesisEvent }) {
  const events = month.items.filter((it) => it.type === "story" && !it.isSub && it.kind === "event");
  const stories = month.items.filter((it) => it.type === "story" && !it.isSub && it.kind === "story");
  const sales = month.items.filter((it) => it.type === "story" && !it.isSub && it.kind === "sale");
  const facts = month.items.filter((it) => it.type === "fact");

  return (
    <section id={`m-${month.key}`} className="genesis-month-section">
      <h2 className="genesis-month-title">
        {month.month ? MONTHS_IT[month.month] : "Senza mese"} {month.year}
      </h2>

      {events.length > 0 && <StoryGroup label="Eventi" items={events} subsByParent={subsByParent} />}
      {stories.length > 0 && <StoryGroup label="Storie" items={stories} subsByParent={subsByParent} />}
      {sales.length > 0 && <StoryGroup label="Sales" items={sales} subsByParent={subsByParent} />}

      {facts.length > 0 && (
        <div className="genesis-group">
          <h3 className="genesis-group-label">Altre conversazioni</h3>
          <div className="genesis-chronicle-facts">
            {facts.map((f) => (
              <FactCard key={f.key} item={f} peopleByName={peopleByName} updateGenesisEvent={updateGenesisEvent} />
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && stories.length === 0 && sales.length === 0 && facts.length === 0 && (
        <p style={{ color: "var(--ink-faint)" }}>Niente registrato per questo mese.</p>
      )}
    </section>
  );
}

function StoryGroup({ label, items, subsByParent }) {
  return (
    <div className="genesis-group">
      <h3 className="genesis-group-label">{label}</h3>
      <div className="genesis-chronicle-stories">
        {items.map((s) => (
          <StoryCard key={s.key} item={s} subs={subsByParent.get(s.slug) || []} />
        ))}
      </div>
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
