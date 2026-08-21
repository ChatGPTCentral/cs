import { Suspense } from "react";
import { supabaseSelect } from "../../lib/supabase";
import { addPerson } from "./actions";
import { toggleStar, toggleArchive, updateBackground } from "./[id]/actions";
import SavedToast from "./SavedToast";

export const dynamic = "force-dynamic";

export default async function PeoplePage({ searchParams }) {
  const showArchived = searchParams?.archived === "1";
  const redirectTo = showArchived ? "/people?archived=1" : "/people";
  const archivedCount = (
    await supabaseSelect("ledger_people", "?archived=eq.true&select=id")
  ).length;

  const people = await supabaseSelect(
    "ledger_people",
    `?archived=eq.${showArchived}&order=starred.desc,name.asc`
  );

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Your CRM. Add a person and whatever you know about them - offline
        context the mailbox never carries. Only what you actually know,
        never guessed on your behalf.
      </p>

      {!showArchived && (
        <form action={addPerson} className="crm-form content" style={{ marginBottom: 20 }}>
          <input name="name" placeholder="Name" required />
          <input name="identity" placeholder="Email or identity" />
          <input name="org" placeholder="Org" />
          <input name="stories" placeholder="Story slugs this relates to, comma separated" />
          <textarea
            name="background"
            placeholder="Background - where you met them, who introduced them, what they actually do"
            rows={4}
          />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="content">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
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
        {people.length === 0 && <p>{showArchived ? "Nobody archived." : "Nobody added yet."}</p>}
        {people.map((p) => (
          <div key={p.id} className="entry" style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <form action={toggleStar} style={{ marginTop: 2 }}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="starred" value={String(!!p.starred)} />
              <button
                type="submit"
                title={p.starred ? "Unstar" : "Star"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  padding: 0,
                  color: p.starred ? "var(--accent)" : "var(--ink-faint)",
                }}
              >
                {p.starred ? "★" : "☆"}
              </button>
            </form>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <a href={`/people/${p.id}`}>
                    <strong>{p.name}</strong>
                  </a>
                  {p.org ? ` — ${p.org}` : ""}
                </div>
                <form action={toggleArchive}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="archived" value={String(!!p.archived)} />
                  <button type="submit" style={{ fontSize: 12 }}>
                    {p.archived ? "Unarchive" : "Archive"}
                  </button>
                </form>
              </div>
              {p.identity && <div className="entry-meta">{p.identity}</div>}
              {p.stories && <div className="entry-meta">{p.stories}</div>}
              <form action={updateBackground} className="crm-form" style={{ marginTop: 6 }}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <span className="field-label">Background</span>
                <textarea
                  name="background"
                  placeholder="Background - where you met them, who introduced them, what they actually do"
                  defaultValue={p.background || ""}
                  rows={2}
                  style={{ fontSize: 13.5 }}
                />
                <button type="submit" style={{ fontSize: 12 }}>
                  Save background
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <Suspense fallback={null}>
        <SavedToast />
      </Suspense>
    </>
  );
}
