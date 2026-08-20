import { supabaseSelect } from "../../lib/supabase";
import { addPerson } from "./actions";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const people = await supabaseSelect("ledger_people", "?order=name.asc");

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Your CRM. Add a person and whatever you know about them - offline
        context the mailbox never carries. Only what you actually know,
        never guessed on your behalf.
      </p>

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

      <div className="content">
        <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 500, fontSize: 19, margin: "16px 0 10px" }}>
          {people.length} {people.length === 1 ? "person" : "people"}
        </h2>
        {people.length === 0 && <p>Nobody added yet.</p>}
        {people.map((p) => (
          <div key={p.id} className="entry">
            <a href={`/people/${p.id}`}>
              <strong>{p.name}</strong>
            </a>
            {p.org ? ` — ${p.org}` : ""}
            {p.identity && <div className="entry-meta">{p.identity}</div>}
            {p.stories && <div className="entry-meta">{p.stories}</div>}
            {p.background && <p>{p.background}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
