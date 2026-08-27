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

  // Same free-text convention as a fact's people_names, but on the person's
  // own record - who was actually at this event/story, by its slug, so a
  // card doesn't have to wait for a same-month fact to show a face.
  const peopleByStorySlug = new Map();
  for (const p of people) {
    if (!p.stories) continue;
    const slugs = new Set(p.stories.split(",").map((s) => s.trim()).filter(Boolean));
    for (const slug of slugs) {
      if (!peopleByStorySlug.has(slug)) peopleByStorySlug.set(slug, []);
      peopleByStorySlug.get(slug).push(p);
    }
  }

  const monthKeyOf = (it) => `${it.year}-${it.month}`;

  // A parent story's own month - used below to decide whether a sub-event or
  // an attached fact folds silently into the parent's card (same month, same
  // happening) or stands on its own, in its own month, with a backlink. A
  // long-running relationship - Netline, met at four different conferences
  // over a year and a half - needs to unfold across the timeline, not get
  // buried entirely inside the month its story began.
  const storyMonthKey = new Map(
    items.filter((it) => it.type === "story" && !it.isSub).map((it) => [it.slug, monthKeyOf(it)])
  );

  // Sub-events/sub-stories keyed by parent slug, only for the ones sharing
  // their parent's month - a sub dated elsewhere renders standalone instead.
  const subsByParent = new Map();
  for (const it of items) {
    if (it.type === "story" && it.isSub && monthKeyOf(it) === storyMonthKey.get(it.parentSlug)) {
      if (!subsByParent.has(it.parentSlug)) subsByParent.set(it.parentSlug, []);
      subsByParent.get(it.parentSlug).push(it);
    }
  }

  // A hand-written fact that already points at a story on this page (via
  // story_ref) and shares its month is the same happening, told twice - fold
  // it into that story's own card instead of also giving it a separate box
  // under "Altre conversazioni". A fact about the same story but a different
  // month is a distinct beat in a longer relationship, not a duplicate - it
  // stays in its own month, still linked back to the story by name.
  const storySlugSet = new Set(storyMonthKey.keys());
  const factsByStorySlug = new Map();
  const attachedFactKeys = new Set();
  for (const it of items) {
    if (
      it.type === "fact" &&
      it.storySlug &&
      storySlugSet.has(it.storySlug) &&
      monthKeyOf(it) === storyMonthKey.get(it.storySlug)
    ) {
      if (!factsByStorySlug.has(it.storySlug)) factsByStorySlug.set(it.storySlug, []);
      factsByStorySlug.get(it.storySlug).push(it);
      attachedFactKeys.add(it.key);
    }
  }
  const nestedSubKeys = new Set([...subsByParent.values()].flat().map((it) => it.key));

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
            factsByStorySlug={factsByStorySlug}
            peopleByStorySlug={peopleByStorySlug}
            nestedSubKeys={nestedSubKeys}
            attachedFactKeys={attachedFactKeys}
            peopleByName={peopleByName}
            updateGenesisEvent={updateGenesisEvent}
          />
        ))}
      </div>
    </div>
  );
}

function MonthSection({ month, subsByParent, factsByStorySlug, peopleByStorySlug, nestedSubKeys, attachedFactKeys, peopleByName, updateGenesisEvent }) {
  const isTopLevel = (it) => it.type === "story" && !nestedSubKeys.has(it.key);
  const events = month.items.filter((it) => isTopLevel(it) && it.kind === "event");
  const stories = month.items.filter((it) => isTopLevel(it) && it.kind === "story");
  const sales = month.items.filter((it) => isTopLevel(it) && it.kind === "sale");
  const facts = month.items.filter((it) => it.type === "fact" && !attachedFactKeys.has(it.key));

  const groupProps = { subsByParent, factsByStorySlug, peopleByStorySlug, peopleByName, updateGenesisEvent };

  return (
    <section id={`m-${month.key}`} className="genesis-month-section">
      <h2 className="genesis-month-title">
        {month.month ? MONTHS_IT[month.month] : "Senza mese"} {month.year}
      </h2>

      {events.length > 0 && <StoryGroup label="Eventi" items={events} {...groupProps} />}
      {stories.length > 0 && <StoryGroup label="Storie" items={stories} {...groupProps} />}
      {sales.length > 0 && <StoryGroup label="Sales" items={sales} {...groupProps} />}

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

function StoryGroup({ label, items, subsByParent, factsByStorySlug, peopleByStorySlug, peopleByName, updateGenesisEvent }) {
  return (
    <div className="genesis-group">
      <h3 className="genesis-group-label">{label}</h3>
      <div className="genesis-chronicle-stories">
        {items.map((s) => (
          <StoryCard
            key={s.key}
            item={s}
            subs={subsByParent.get(s.slug) || []}
            attachedFacts={factsByStorySlug.get(s.slug) || []}
            relatedPeople={peopleByStorySlug.get(s.slug) || []}
            peopleByName={peopleByName}
            updateGenesisEvent={updateGenesisEvent}
          />
        ))}
      </div>
    </div>
  );
}

// Stories that are a pipeline/hub rather than a real event or relationship -
// every one of the dozens of leads funneled through them was actually met
// somewhere else (a conference, a call), so their own person badges are
// noise: the same faces already show up on their real event's card.
const NO_PEOPLE_STORIES = new Set(["ai-central-voices"]);

function StoryCard({ item, subs, attachedFacts, relatedPeople, peopleByName, updateGenesisEvent }) {
  const colorClass =
    item.kind === "event" ? "genesis-story-card-event" :
    item.kind === "sale" ? "genesis-story-card-sale" :
    `genesis-story-card-${item.axis}`;
  const range =
    item.axis === "moment" && item.endDate && item.endDate !== item.startDate
      ? `${formatShort(item.startDate)} – ${formatShort(item.endDate)}`
      : formatShort(item.startDate);
  const hidePeople = NO_PEOPLE_STORIES.has(item.slug);
  const shownPersonIds = new Set(hidePeople ? [] : relatedPeople.map((p) => p.id));
  return (
    <div className={`genesis-story-card ${colorClass}`}>
      <div className="genesis-story-card-head">
        <span className="genesis-story-card-date">{range}</span>
        <a href={`/story/${item.slug}`} className="genesis-story-card-title">
          {item.title}
        </a>
        {item.kind === "story" && item.axis === "thread" ? <span> →</span> : ""}
        {item.factCount > 1 && (
          <a href={`/story/${item.slug}`} className="genesis-story-card-evolution">
            vedi evoluzione ({item.factCount}) &rarr;
          </a>
        )}
      </div>
      {item.location && <span className="genesis-story-card-meta">{item.location}</span>}
      {item.isSub && item.parentSlug && (
        <a href={`/story/${item.parentSlug}`} className="genesis-story-card-parent">
          parte di {item.parentTitle || item.parentSlug}
        </a>
      )}
      {!hidePeople && relatedPeople.length > 0 && (
        <div className="genesis-people-links">
          {relatedPeople.map((p) => (
            <a key={p.id} href={`/people/${p.id}`} className="genesis-person-chip">
              <Avatar name={p.name} photoUrl={p.photo_url} size={18} />
              {p.name}
            </a>
          ))}
        </div>
      )}
      {subs.length > 0 && (
        <div className="genesis-story-card-subs">
          {subs.map((s) => (
            <a key={s.slug} href={`/story/${s.slug}`}>
              {s.title.replace(item.title, "").replace(/^ - /, "") || s.title}
            </a>
          ))}
        </div>
      )}
      {attachedFacts.length > 0 && (
        <div className="genesis-story-card-facts">
          {attachedFacts.map((f) => (
            <AttachedFact
              key={f.key}
              item={f}
              peopleByName={peopleByName}
              updateGenesisEvent={updateGenesisEvent}
              shownPersonIds={shownPersonIds}
              hidePeople={hidePeople}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AttachedFact({ item, peopleByName, updateGenesisEvent, shownPersonIds, hidePeople }) {
  const names = hidePeople
    ? []
    : item.peopleNames.filter((n) => {
        const p = peopleByName.get(n.toLowerCase());
        if (p && shownPersonIds.has(p.id)) return false;
        if (p) shownPersonIds.add(p.id);
        return true;
      });
  return (
    <div className="genesis-story-card-fact">
      <TableCellInput
        action={updateGenesisEvent}
        id={item.id}
        name="description"
        defaultValue={item.description}
        placeholder="Descrizione"
        multiline
        rows={2}
      />
      {names.length > 0 && (
        <div className="genesis-people-links">
          {names.map((n) => {
            const p = peopleByName.get(n.toLowerCase());
            return p ? (
              <a key={n} href={`/people/${p.id}`} className="genesis-person-chip">
                <Avatar name={p.name} photoUrl={p.photo_url} size={18} />
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
      {item.storySlug && (
        <div className="entry-meta">
          <a href={`/story/${item.storySlug}`}>{item.storyRef}</a>
        </div>
      )}
    </div>
  );
}
