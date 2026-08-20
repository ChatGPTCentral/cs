import { notFound } from "next/navigation";
import { supabaseSelect } from "../../../lib/supabase";
import { findConnections } from "../../../lib/people";
import { updatePerson } from "./actions";

export const dynamic = "force-dynamic";

export default async function PersonPage({ params }) {
  const [person] = await supabaseSelect("ledger_people", `?id=eq.${params.id}`);
  if (!person) notFound();

  const allPeople = await supabaseSelect("ledger_people", "?order=name.asc");
  const connections = findConnections(person, allPeople);

  return (
    <>
      <p style={{ marginBottom: 16 }}>
        <a href="/people">&larr; All people</a>
      </p>

      <article className="content" style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 500, fontSize: 26, margin: "24px 0 4px" }}>
          {person.name}
        </h1>
        {person.org && <p style={{ color: "var(--ink-dim)", margin: "0 0 12px" }}>{person.org}</p>}
        {person.identity && <p className="entry-meta">{person.identity}</p>}
        {person.stories && <p className="entry-meta">Stories: {person.stories}</p>}
        {person.background ? (
          <p>{person.background}</p>
        ) : (
          <p style={{ color: "var(--ink-faint)" }}>No background yet.</p>
        )}
      </article>

      <form action={updatePerson} className="crm-form content" style={{ marginBottom: 20 }}>
        <input type="hidden" name="id" value={person.id} />
        <textarea
          name="background"
          placeholder="Add or update background - only what you actually know"
          defaultValue={person.background || ""}
          rows={4}
        />
        <button type="submit">Save</button>
      </form>

      <div className="content">
        <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 500, fontSize: 19, margin: "16px 0 10px" }}>
          Connections ({connections.length})
        </h2>
        {connections.length === 0 && (
          <p style={{ color: "var(--ink-faint)" }}>
            No shared org or story with anyone else in the CRM yet.
          </p>
        )}
        {connections.map((c) => (
          <div key={c.person.id} className="entry">
            <a href={`/people/${c.person.id}`}>
              <strong>{c.person.name}</strong>
            </a>
            {c.person.org ? ` — ${c.person.org}` : ""}
            <div className="entry-meta">
              {c.sameOrg ? "same org" : ""}
              {c.sameOrg && c.sharedStories.length > 0 ? " · " : ""}
              {c.sharedStories.length > 0 ? `shared: ${c.sharedStories.join(", ")}` : ""}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
