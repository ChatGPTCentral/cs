import { supabaseSelect } from "../../lib/supabase";
import { getPeopleHtml } from "../../lib/ledger";
import { addPerson } from "./actions";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const people = await supabaseSelect("ledger_people", "?order=created_at.desc");
  const graphHtml = getPeopleHtml();

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Add context on a person yourself, right here - no chat needed. Pulled
        into the git-tracked ledger (a story file, or the graph below) on the
        next <code>/ledger</code> run.
      </p>

      <form action={addPerson} className="crm-form content">
        <input name="name" placeholder="Name" required />
        <input name="identity" placeholder="Email or identity" />
        <input name="org" placeholder="Org" />
        <input name="stories" placeholder="Story slugs this relates to, comma separated" />
        <textarea
          name="background"
          placeholder="Background - what you know, offline context. Only what you actually know, never guessed."
          rows={4}
        />
        <button type="submit">Add</button>
      </form>

      <div className="content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 500, fontSize: 19, margin: "16px 0 10px" }}>
          Not yet pulled into the ledger ({people.length})
        </h2>
        {people.length === 0 && <p>Nothing here yet.</p>}
        {people.map((p) => (
          <div key={p.id} className="entry">
            <strong>{p.name}</strong>
            {p.org ? ` — ${p.org}` : ""}
            {p.identity && (
              <div className="entry-meta">{p.identity}</div>
            )}
            {p.stories && <div className="entry-meta">{p.stories}</div>}
            {p.background && <p>{p.background}</p>}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 12px" }}>
        Below: the graph as last pulled in - identity merges, the advocacy
        network, and Background already written into the ledger.
      </p>
      {graphHtml ? (
        <article className="content" dangerouslySetInnerHTML={{ __html: graphHtml }} />
      ) : (
        <div className="content">
          <p>No graph/people.md found.</p>
        </div>
      )}
    </>
  );
}
