import { supabaseSelect } from "../../lib/supabase";
import { addPerson } from "./actions";
import { toggleStar, toggleArchive, updateBackground, updateLists } from "./[id]/actions";
import { parseLists } from "../../lib/people";
import SavedToast from "./SavedToast";
import TableCellInput from "./TableCellInput";

export const dynamic = "force-dynamic";

export default async function PeoplePage({ searchParams }) {
  const showArchived = searchParams?.archived === "1";
  const activeList = searchParams?.list || "";
  const sort = searchParams?.sort === "org" ? "org" : "name";

  // Builds a /people URL carrying whichever of these state pieces are
  // active, so every filter/sort link stays in sync.
  function buildHref({ list = activeList, sortBy = sort } = {}) {
    const params = new URLSearchParams();
    if (showArchived) params.set("archived", "1");
    if (list) params.set("list", list);
    if (sortBy === "org") params.set("sort", "org");
    const qs = params.toString();
    return qs ? `/people?${qs}` : "/people";
  }

  const archivedCount = (
    await supabaseSelect("ledger_people", "?archived=eq.true&select=id")
  ).length;

  const allActive = await supabaseSelect(
    "ledger_people",
    `?archived=eq.${showArchived}&order=starred.desc,${sort}.asc`
  );

  // Lists are free-text tags, not a fixed enum, so the filter tabs are
  // computed from whatever tags people actually carry right now.
  const listCounts = new Map();
  let uncategorizedCount = 0;
  for (const p of allActive) {
    const tags = parseLists(p.lists);
    if (tags.length === 0) uncategorizedCount++;
    for (const tag of tags) listCounts.set(tag, (listCounts.get(tag) || 0) + 1);
  }
  const listTabs = [...listCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const people = activeList
    ? allActive.filter((p) =>
        activeList === "__uncategorized__"
          ? parseLists(p.lists).length === 0
          : parseLists(p.lists).includes(activeList)
      )
    : allActive;

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Your CRM. Add a person and whatever you know about them - offline
        context the mailbox never carries. Only what you actually know,
        never guessed on your behalf. Tag people into lists (Service
        Providers, Multipliers, Sales...) to group them - a list is just a
        tag, add as many as you want.
      </p>

      {!showArchived && (
        <form action={addPerson} className="crm-form content" style={{ marginBottom: 20 }}>
          <input name="name" placeholder="Name" required />
          <input name="identity" placeholder="Email or identity" />
          <input name="org" placeholder="Org" />
          <input name="stories" placeholder="Story slugs this relates to, comma separated" />
          <input name="lists" placeholder="Lists, comma separated (e.g. Service Providers)" />
          <textarea
            name="background"
            placeholder="Background - where you met them, who introduced them, what they actually do"
            rows={4}
          />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="content">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            {showArchived
              ? `${people.length} archived`
              : `${people.length} ${people.length === 1 ? "person" : "people"}`}
          </h2>
          {showArchived ? (
            <a href="/people">&larr; Back to active</a>
          ) : (
            archivedCount > 0 && <a href="/people?archived=1">Show archived ({archivedCount})</a>
          )}
        </div>

        {!showArchived && (listTabs.length > 0 || uncategorizedCount > 0) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "0 0 14px" }}>
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
                  <th>Lists</th>
                  <th>Background</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {people.map((p) => (
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
                      <a href={`/people/${p.id}`}>
                        <strong>{p.name}</strong>
                      </a>
                    </td>
                    <td>{p.org || ""}</td>
                    <td className="people-table-meta">{p.identity || ""}</td>
                    <td>
                      <TableCellInput
                        action={updateLists}
                        id={p.id}
                        name="lists"
                        defaultValue={p.lists || ""}
                        placeholder="Add a list..."
                      />
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SavedToast />
    </>
  );
}
