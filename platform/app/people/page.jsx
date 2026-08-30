import { supabaseSelect } from "../../lib/supabase";
import { addPerson, createList } from "./actions";
import { toggleStar, toggleArchive, updateBackground, updateLists, updateStories, updateCadence } from "./[id]/actions";
import { parseLists, parseStorySlugs, lastTouchedAt, cadenceStatus } from "../../lib/people";
import SavedToast from "./SavedToast";
import TableCellInput from "./TableCellInput";
import NewPersonModal from "./NewPersonModal";
import StoryFilter from "./StoryFilter";
import Avatar from "./Avatar";

export const dynamic = "force-dynamic";

export default async function PeoplePage({ searchParams }) {
  const showArchived = searchParams?.archived === "1";
  const activeList = searchParams?.list || "";
  const activeStory = searchParams?.story || "";
  const sort = searchParams?.sort === "org" ? "org" : "name";
  const q = (searchParams?.q || "").trim();
  const overdueOnly = searchParams?.overdue === "1";

  // Builds a /people URL carrying whichever of these state pieces are
  // active, so every filter/sort link stays in sync.
  function buildHref({ list = activeList, story = activeStory, sortBy = sort, overdue = overdueOnly } = {}) {
    const params = new URLSearchParams();
    if (showArchived) params.set("archived", "1");
    if (list) params.set("list", list);
    if (story) params.set("story", story);
    if (sortBy === "org") params.set("sort", "org");
    if (q) params.set("q", q);
    if (overdue) params.set("overdue", "1");
    const qs = params.toString();
    return qs ? `/people?${qs}` : "/people";
  }

  const archivedCount = (
    await supabaseSelect("ledger_people", "?archived=eq.true&select=id")
  ).length;

  const searchFilter = q
    ? `&or=(name.ilike.*${encodeURIComponent(q)}*,org.ilike.*${encodeURIComponent(q)}*,identity.ilike.*${encodeURIComponent(q)}*)`
    : "";

  const [allActive, definedLists, storyRows] = await Promise.all([
    supabaseSelect(
      "ledger_people",
      `?archived=eq.${showArchived}&order=starred.desc,${sort}.asc${searchFilter}`
    ),
    supabaseSelect("ledger_lists", "?order=name.asc"),
    supabaseSelect("ledger_stories", "?order=title.asc&select=slug,title,updated_at"),
  ]);

  const storyTitleBySlug = new Map(storyRows.map((s) => [s.slug, s.title]));
  const storiesByUpdatedAt = new Map(storyRows.map((s) => [s.slug, s.updated_at]));

  // Lists are free-text tags, not a fixed enum. Tabs are the union of
  // lists someone deliberately created (ledger_lists, so a brand-new list
  // shows up even with nobody in it yet) and tags actually found on
  // people (in case one was typed directly into a row).
  const listCounts = new Map(definedLists.map((l) => [l.name, 0]));
  let uncategorizedCount = 0;
  for (const p of allActive) {
    const tags = parseLists(p.lists);
    if (tags.length === 0) uncategorizedCount++;
    for (const tag of tags) listCounts.set(tag, (listCounts.get(tag) || 0) + 1);
  }
  const listTabs = [...listCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const byList = activeList
    ? allActive.filter((p) =>
        activeList === "__uncategorized__"
          ? parseLists(p.lists).length === 0
          : parseLists(p.lists).includes(activeList)
      )
    : allActive;

  const byStory = activeStory
    ? byList.filter((p) => parseStorySlugs(p.stories).includes(activeStory))
    : byList;

  const overdueCount = allActive.filter(
    (p) => cadenceStatus(p.cadence, lastTouchedAt(p, storiesByUpdatedAt))?.overdue
  ).length;

  const people = overdueOnly
    ? byStory.filter((p) => cadenceStatus(p.cadence, lastTouchedAt(p, storiesByUpdatedAt))?.overdue)
    : byStory;

  return (
    <>
      <datalist id="list-tags">
        {listTabs.map(([tag]) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
      <datalist id="story-slugs">
        {storyRows.map((s) => (
          <option key={s.slug} value={s.slug} />
        ))}
      </datalist>
      <datalist id="cadence-options">
        <option value="monthly" />
        <option value="quarterly" />
        <option value="biannual" />
        <option value="as-needed" />
      </datalist>

      <div className="content wide-content">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            {showArchived
              ? `${people.length} archived`
              : activeStory
              ? <>{people.length} in <a href={`/story/${activeStory}`}>{storyTitleBySlug.get(activeStory) || activeStory}</a></>
              : `${people.length} ${people.length === 1 ? "person" : "people"}`}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StoryFilter
              stories={storyRows}
              value={activeStory}
              hrefsBySlug={Object.fromEntries(
                [["", buildHref({ story: "" })], ...storyRows.map((s) => [s.slug, buildHref({ story: s.slug })])]
              )}
            />
            {!showArchived && overdueCount > 0 && (
              <a
                href={buildHref({ overdue: !overdueOnly })}
                className={`list-tab${overdueOnly ? " list-tab-active" : ""}`}
                title="Cadenza impostata e superata - da ricontattare"
              >
                {overdueOnly ? "✓ " : ""}Da riattivare ({overdueCount})
              </a>
            )}
            <form method="GET" style={{ display: "flex" }}>
              {showArchived && <input type="hidden" name="archived" value="1" />}
              {activeList && <input type="hidden" name="list" value={activeList} />}
              {activeStory && <input type="hidden" name="story" value={activeStory} />}
              {sort === "org" && <input type="hidden" name="sort" value="org" />}
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Cerca nome, org, email..."
                style={{ fontSize: 13, padding: "6px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius)", minWidth: 200 }}
              />
            </form>
            {showArchived ? (
              <a href={q ? `/people?q=${encodeURIComponent(q)}` : "/people"}>&larr; Back to active</a>
            ) : (
              archivedCount > 0 && (
                <a href={`/people?archived=1${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
                  Show archived ({archivedCount})
                </a>
              )
            )}
            {!showArchived && <NewPersonModal action={addPerson} />}
          </div>
        </div>

        {!showArchived && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, margin: "0 0 14px" }}>
            <a href={buildHref({ list: "" })} className={`list-tab${!activeList ? " list-tab-active" : ""}`}>
              All ({allActive.length})
            </a>
            {listTabs.map(([tag, count]) => (
              <a
                key={tag}
                href={buildHref({ list: tag })}
                className={`list-tab${activeList === tag ? " list-tab-active" : ""}`}
              >
                {tag} ({count})
              </a>
            ))}
            {uncategorizedCount > 0 && (
              <a
                href={buildHref({ list: "__uncategorized__" })}
                className={`list-tab${activeList === "__uncategorized__" ? " list-tab-active" : ""}`}
              >
                Uncategorized ({uncategorizedCount})
              </a>
            )}
            <form action={createList} style={{ display: "inline-flex", gap: 4, marginLeft: 4 }}>
              <input
                name="name"
                placeholder="New list name..."
                className="table-cell-input"
                style={{ width: 130, border: "1px dashed var(--line)" }}
              />
              <button type="submit" className="list-tab" style={{ border: "1px dashed var(--line)", background: "none", cursor: "pointer" }}>
                + New list
              </button>
            </form>
          </div>
        )}

        {people.length === 0 && <p>{showArchived ? "Nobody archived." : "Nobody in this list yet."}</p>}

        {people.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="people-table">
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <a href={buildHref({ sortBy: "name" })}>Name{sort === "name" ? " ▾" : ""}</a>
                  </th>
                  <th>
                    <a href={buildHref({ sortBy: "org" })}>Org{sort === "org" ? " ▾" : ""}</a>
                  </th>
                  <th>Identity</th>
                  <th>Stories</th>
                  <th>Lists</th>
                  <th>Cadenza</th>
                  <th>Ultimo contatto</th>
                  <th>Background</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {people.map((p) => {
                  const touched = lastTouchedAt(p, storiesByUpdatedAt);
                  const status = cadenceStatus(p.cadence, touched);
                  return (
                  <tr key={p.id}>
                    <td>
                      <form action={toggleStar}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="starred" value={String(!!p.starred)} />
                        <button
                          type="submit"
                          title={p.starred ? "Unstar" : "Star"}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 15,
                            padding: 0,
                            color: p.starred ? "var(--accent)" : "var(--ink-faint)",
                          }}
                        >
                          {p.starred ? "★" : "☆"}
                        </button>
                      </form>
                    </td>
                    <td>
                      <a href={`/people/${p.id}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar name={p.name} photoUrl={p.photo_url} size={22} />
                        <strong>{p.name}</strong>
                      </a>
                    </td>
                    <td>{p.org || ""}</td>
                    <td className="people-table-meta">{p.identity || ""}</td>
                    <td>
                      {parseStorySlugs(p.stories).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                          {parseStorySlugs(p.stories).map((slug) => (
                            <a key={slug} href={`/story/${slug}`} className="list-tab" style={{ fontSize: 11 }}>
                              {storyTitleBySlug.get(slug) || slug}
                            </a>
                          ))}
                        </div>
                      )}
                      <TableCellInput
                        action={updateStories}
                        id={p.id}
                        name="stories"
                        defaultValue={p.stories || ""}
                        placeholder="Add a story slug..."
                        listId="story-slugs"
                      />
                    </td>
                    <td>
                      <TableCellInput
                        action={updateLists}
                        id={p.id}
                        name="lists"
                        defaultValue={p.lists || ""}
                        placeholder="Add a list..."
                        listId="list-tags"
                      />
                    </td>
                    <td>
                      <TableCellInput
                        action={updateCadence}
                        id={p.id}
                        name="cadence"
                        defaultValue={p.cadence || ""}
                        placeholder="monthly / quarterly..."
                        listId="cadence-options"
                      />
                    </td>
                    <td className="people-table-meta" style={status?.overdue ? { color: "var(--accent)" } : undefined}>
                      {touched
                        ? `${status?.daysSince ?? "?"}g fa`
                        : p.cadence
                        ? "mai"
                        : ""}
                    </td>
                    <td>
                      <TableCellInput
                        action={updateBackground}
                        id={p.id}
                        name="background"
                        defaultValue={p.background || ""}
                        placeholder="Add background..."
                      />
                    </td>
                    <td>
                      <form action={toggleArchive}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="archived" value={String(!!p.archived)} />
                        <button type="submit" style={{ fontSize: 12 }}>
                          {p.archived ? "Unarchive" : "Archive"}
                        </button>
                      </form>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SavedToast />
    </>
  );
}
