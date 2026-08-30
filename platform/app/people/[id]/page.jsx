import { notFound } from "next/navigation";
import { supabaseSelect } from "../../../lib/supabase";
import { findConnections, parseStorySlugs, buildLocalGraph } from "../../../lib/people";
import { findStoriesMentioningPerson, buildBacklinkIndex } from "../../../lib/links";
import { getStory } from "../../../lib/ledger";
import ObsidianGraph from "../../network/ObsidianGraph";
import { updatePerson, toggleStar, toggleArchive, mergePerson, approveEnrichment, discardEnrichment } from "./actions";
import { tagPersonToStory } from "../../story/actions";
import SavedToast from "../SavedToast";
import SaveWatcher from "../SaveWatcher";
import Avatar from "../Avatar";

export const dynamic = "force-dynamic";

export default async function PersonPage({ params }) {
  const [person] = await supabaseSelect("ledger_people", `?id=eq.${params.id}`);
  if (!person) notFound();

  const [allPeople, companies, [company]] = await Promise.all([
    supabaseSelect("ledger_people", "?order=name.asc"),
    supabaseSelect("ledger_companies", "?select=id,name&order=name.asc"),
    person.company_id
      ? supabaseSelect("ledger_companies", `?id=eq.${person.company_id}&select=id,name,relationship,icp_fit`)
      : Promise.resolve([]),
  ]);
  const connections = findConnections(person, allPeople);
  const mergedIntoPerson = person.merged_into
    ? allPeople.find((p) => p.id === person.merged_into)
    : null;
  const mergeCandidates = allPeople.filter((p) => p.id !== person.id && !p.archived);
  const taggedSlugs = parseStorySlugs(person.stories);
  const stories = taggedSlugs.map((slug) => getStory(slug)).filter(Boolean);
  const mentions = findStoriesMentioningPerson(person, taggedSlugs);

  const storyRows = await supabaseSelect(
    "ledger_stories",
    "?select=slug,title,kind,parent_slug"
  );
  const backIndex = buildBacklinkIndex();
  const mdPairs = [];
  for (const [src, targets] of backIndex.outbound) {
    for (const t of targets) mdPairs.push([src, t]);
  }
  const localGraph = person.archived
    ? null
    : buildLocalGraph(
        "p:" + person.id,
        storyRows,
        allPeople.filter((p) => !p.archived),
        mdPairs
      );
  const emails = await supabaseSelect(
    "ledger_people_emails",
    `?person_id=eq.${person.id}&order=message_date.desc.nullslast`
  );
  const genesisEvents = (
    await supabaseSelect(
      "ledger_genesis_events",
      `?people_names=ilike.*${encodeURIComponent(person.name)}*&order=year.asc.nullslast,month.asc.nullslast`
    )
  ).filter((e) =>
    (e.people_names || "")
      .split(",")
      .map((n) => n.trim().toLowerCase())
      .includes(person.name.toLowerCase())
  );

  return (
    <>
      <p style={{ marginBottom: 16 }}>
        <a href="/people">&larr; All people</a>
      </p>

      {mergedIntoPerson && (
        <p
          className="content"
          style={{ marginBottom: 20, color: "var(--accent-ink)", background: "var(--accent-wash)" }}
        >
          Merged into{" "}
          <a href={`/people/${mergedIntoPerson.id}`}>
            <strong>{mergedIntoPerson.name}</strong>
          </a>
          . This record is kept for reference - nothing was deleted. Unarchive to undo the merge.
        </p>
      )}

      {(person.pending_linkedin_url || person.pending_photo_url) && (
        <div className="content" style={{ marginBottom: 20 }}>
          <p className="field-label" style={{ marginTop: 12 }}>Apollo match waiting on review</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
            <Avatar name={person.pending_match_name || person.name} photoUrl={person.pending_photo_url} size={40} />
            <div>
              <strong>{person.pending_match_name || "(name not returned)"}</strong>
              {person.pending_match_title && <div className="entry-meta">{person.pending_match_title}</div>}
              {person.pending_linkedin_url && (
                <div className="entry-meta">
                  <a href={person.pending_linkedin_url} target="_blank" rel="noopener">
                    {person.pending_linkedin_url}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <form action={approveEnrichment}>
              <input type="hidden" name="id" value={person.id} />
              <button type="submit">Approve</button>
              <SaveWatcher />
            </form>
            <form action={discardEnrichment}>
              <input type="hidden" name="id" value={person.id} />
              <button type="submit" className="review-discard">Discard</button>
              <SaveWatcher />
            </form>
          </div>
        </div>
      )}

      <article className="content" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar name={person.name} photoUrl={person.photo_url} size={52} />
            <h1 style={{ fontWeight: 700, fontSize: 26, margin: "24px 0 4px" }}>
              {person.starred ? "★ " : ""}
              {person.name}
              {person.archived ? " (archived)" : ""}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <form action={toggleStar}>
              <input type="hidden" name="id" value={person.id} />
              <input type="hidden" name="starred" value={String(!!person.starred)} />
              <button type="submit">{person.starred ? "Unstar" : "★ Star"}</button>
            </form>
            <form action={toggleArchive}>
              <input type="hidden" name="id" value={person.id} />
              <input type="hidden" name="archived" value={String(!!person.archived)} />
              <input type="hidden" name="redirectOnArchive" value="/people" />
              <button type="submit">{person.archived ? "Unarchive" : "Archive"}</button>
            </form>
          </div>
        </div>
        {person.org && (
          <p style={{ color: "var(--ink-dim)", margin: "0 0 12px" }}>
            <span className="field-label">Org</span> {person.org}
          </p>
        )}
        {company && (
          <p style={{ color: "var(--ink-dim)", margin: "0 0 12px" }}>
            <span className="field-label">Azienda</span>{" "}
            <a href={`/clienti#company-${company.id}`}>{company.name}</a>
            {company.relationship ? ` · ${company.relationship}` : ""}
            {company.icp_fit ? ` · fit ${company.icp_fit}` : ""}
          </p>
        )}
        {person.identity && (
          <p className="entry-meta">
            <span className="field-label">Identity</span> {person.identity}
          </p>
        )}
        {person.linkedin_url && (
          <p className="entry-meta">
            <span className="field-label">LinkedIn</span>{" "}
            <a href={person.linkedin_url} target="_blank" rel="noopener">
              {person.linkedin_url}
            </a>
          </p>
        )}
        {person.stories && (
          <p className="entry-meta">
            <span className="field-label">Stories</span> {person.stories}
          </p>
        )}
        {person.lists && (
          <p className="entry-meta">
            <span className="field-label">Lists</span> {person.lists}
          </p>
        )}
        <p className="field-label" style={{ marginTop: 12 }}>Background</p>
        {person.background ? (
          <p>{person.background}</p>
        ) : (
          <p style={{ color: "var(--ink-faint)" }}>No background yet.</p>
        )}
      </article>

      <form action={updatePerson} className="crm-form content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>Edit record</h2>
        <input type="hidden" name="id" value={person.id} />
        <label className="field-label" htmlFor="f-name">Name</label>
        <input id="f-name" name="name" placeholder="Name" defaultValue={person.name || ""} required />
        <label className="field-label" htmlFor="f-identity">Email or identity</label>
        <input id="f-identity" name="identity" placeholder="Email or identity" defaultValue={person.identity || ""} />
        <label className="field-label" htmlFor="f-org">Org</label>
        <input id="f-org" name="org" placeholder="Org" defaultValue={person.org || ""} />
        <label className="field-label" htmlFor="f-company">Azienda (CRM)</label>
        <input
          id="f-company"
          name="company"
          list="company-names-people"
          placeholder="Collega a un'azienda del CRM (opzionale, diverso da Org)"
          defaultValue={company?.name || ""}
        />
        <datalist id="company-names-people">
          {companies.map((c) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>
        <label className="field-label" htmlFor="f-stories">Story slugs</label>
        <input
          id="f-stories"
          name="stories"
          placeholder="Story slugs this relates to, comma separated"
          defaultValue={person.stories || ""}
        />
        <label className="field-label" htmlFor="f-lists">Lists</label>
        <input
          id="f-lists"
          name="lists"
          placeholder="Lists, comma separated (e.g. Service Providers)"
          defaultValue={person.lists || ""}
        />
        <label className="field-label" htmlFor="f-aliases">Aliases</label>
        <input
          id="f-aliases"
          name="aliases"
          placeholder="Altri modi in cui compare nei testi, separati da virgola (es. Marc Duke, M. Duke)"
          defaultValue={person.aliases || ""}
        />
        <label className="field-label" htmlFor="f-linkedin">LinkedIn URL</label>
        <input
          id="f-linkedin"
          name="linkedin_url"
          placeholder="https://www.linkedin.com/in/..."
          defaultValue={person.linkedin_url || ""}
        />
        <label className="field-label" htmlFor="f-background">Background</label>
        <textarea
          id="f-background"
          name="background"
          placeholder="Add or update background - only what you actually know"
          defaultValue={person.background || ""}
          rows={4}
        />
        <button type="submit">Save</button>
        <SaveWatcher />
      </form>

      {mergeCandidates.length > 0 && (
        <form action={mergePerson} className="crm-form content" style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>Merge a duplicate</h2>
          <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 4px" }}>
            Pick another person who is really the same as {person.name}. Their identity, org,
            stories, background, and email log all fold into this record. The duplicate is
            archived, not deleted - Unarchive on its page undoes the merge.
          </p>
          <input type="hidden" name="id" value={person.id} />
          <label className="field-label" htmlFor="f-duplicate">Duplicate to merge in</label>
          <select id="f-duplicate" name="duplicateId" defaultValue="">
            <option value="" disabled>
              Choose a person...
            </option>
            {mergeCandidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.org ? ` — ${c.org}` : ""}
                {c.identity ? ` (${c.identity})` : ""}
              </option>
            ))}
          </select>
          <button type="submit">Merge into {person.name}</button>
          <SaveWatcher />
        </form>
      )}

      {stories.length > 0 && (
        <div className="content" style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            Story log ({stories.length})
          </h2>
          {stories.map((s) => (
            <article key={s.slug} style={{ marginBottom: 16 }}>
              <p style={{ margin: "0 0 6px" }}>
                <a href={`/story/${s.slug}`}>
                  <strong>{s.title}</strong>
                </a>
              </p>
              <div dangerouslySetInnerHTML={{ __html: s.html }} />
            </article>
          ))}
        </div>
      )}

      {genesisEvents.length > 0 && (
        <div className="content" style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            Sulla genesi ({genesisEvents.length})
          </h2>
          {genesisEvents.map((e) => (
            <div key={e.id} className="entry">
              <p style={{ fontWeight: 600, margin: "0 0 2px" }}>
                {e.year ? `${e.month ? e.month + "/" : ""}${e.year} — ` : ""}
                {e.title}
              </p>
              <p style={{ margin: 0, color: "var(--ink-dim)", fontSize: 13.5 }}>{e.description}</p>
            </div>
          ))}
          <p style={{ margin: "8px 0 0" }}>
            <a href="/genesis">Vedi e correggi sulla timeline &rarr;</a>
          </p>
        </div>
      )}

      <div className="content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
          Email log ({emails.length})
        </h2>
        {emails.length === 0 && (
          <p style={{ color: "var(--ink-faint)" }}>
            No emails found for this identity yet - not pulled from Gmail yet, or
            this person has no known email address.
          </p>
        )}
        {emails.map((e) => (
          <div key={e.id} className="entry">
            <a
              href={`https://mail.google.com/mail/u/${e.gmail_account_index || 0}/#all/${e.thread_id}`}
              target="_blank"
              rel="noopener"
            >
              <strong>{e.subject || "(no subject)"}</strong>
            </a>
            <div className="entry-meta">
              {e.message_date ? new Date(e.message_date).toISOString().slice(0, 10) : "date unknown"}
            </div>
          </div>
        ))}
      </div>

      {(mentions.stories.length > 0 || mentions.skipped) && (
        <div className="content" style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            Menzionato in ({mentions.skipped ? "-" : mentions.stories.length})
          </h2>
          {mentions.skipped ? (
            <p style={{ color: "var(--ink-faint)", fontSize: 13 }}>
              Nome troppo corto per la ricerca automatica delle menzioni - un
              nome e cognome completi la sbloccano.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 8px" }}>
                Storie che citano {person.name} nel testo senza averla tra le
                storie taggate - candidate a un collegamento vero.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                {mentions.stories.map((s) => (
                  <span key={s.slug} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                    <a href={`/story/${s.slug}`} className="list-tab">
                      {s.title}
                    </a>
                    <form action={tagPersonToStory} style={{ display: "inline" }}>
                      <input type="hidden" name="personId" value={person.id} />
                      <input type="hidden" name="slug" value={s.slug} />
                      <button type="submit" className="mention-accept" title={`Tagga ${person.name} in ${s.title}`}>
                        +
                      </button>
                      <SaveWatcher />
                    </form>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {localGraph && localGraph.nodes.length > 1 && (
        <div className="content" style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            Vicinato ({localGraph.nodes.length} nodi)
          </h2>
          <ObsidianGraph nodes={localGraph.nodes} links={localGraph.links} height={300} compact />
        </div>
      )}

      <div className="content">
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
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

      <SavedToast />
    </>
  );
}
