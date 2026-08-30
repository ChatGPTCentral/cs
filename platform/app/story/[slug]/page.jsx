import { notFound } from "next/navigation";
import { getStory, getStoryRaw } from "../../../lib/ledger";
import { supabaseSelect } from "../../../lib/supabase";
import { parseStorySlugs, buildLocalGraph, HUB_STORY_SLUGS } from "../../../lib/people";
import {
  buildBacklinkIndex,
  resolvePersonTarget,
  findUnlinkedPeopleMentions,
  findUnlinkedStoryMentions,
} from "../../../lib/links";
import { updateStoryStart, updateStoryEnd, updateStoryAxis, updateStoryNextAction, updateStoryNextActionDate, updateStoryStrategy, updateStoryLocation, tagPersonToStory, proposeLink } from "../actions";
import TableCellInput from "../../people/TableCellInput";
import SaveWatcher from "../../people/SaveWatcher";
import SavedToast from "../../people/SavedToast";
import Avatar from "../../people/Avatar";
import ObsidianGraph from "../../network/ObsidianGraph";
import CompanyLogo from "../../clienti/CompanyLogo";

export const dynamic = "force-dynamic";

function AxisToggle({ id, axis }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      <form action={updateStoryAxis}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="axis" value="moment" />
        <button
          type="submit"
          className="axis-select"
          style={{ fontWeight: axis === "moment" ? 700 : 400, opacity: axis === "moment" ? 1 : 0.55 }}
        >
          momento
        </button>
        <SaveWatcher />
      </form>
      <form action={updateStoryAxis}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="axis" value="thread" />
        <button
          type="submit"
          className="axis-select"
          style={{ fontWeight: axis === "thread" ? 700 : 400, opacity: axis === "thread" ? 1 : 0.55 }}
        >
          filo
        </button>
        <SaveWatcher />
      </form>
    </div>
  );
}

export default async function StoryPage({ params }) {
  const [genesisEvents, storyRows, childRows, parentRows, notionTasks, people, existingSuggestions] = await Promise.all([
    supabaseSelect(
      "ledger_genesis_events",
      `?story_ref=eq.${params.slug}.md&order=year.asc.nullslast,month.asc.nullslast`
    ),
    supabaseSelect("ledger_stories", `?slug=eq.${params.slug}`),
    supabaseSelect(
      "ledger_stories",
      `?parent_slug=eq.${params.slug}&select=slug,title,start_date,end_date&order=start_date.asc`
    ),
    supabaseSelect("ledger_stories", `?select=slug,title,kind,parent_slug`),
    supabaseSelect(
      "ledger_notion_tasks",
      `?story_slug=eq.${params.slug}&status=neq.Done&select=notion_url,task,status,priority`
    ),
    supabaseSelect(
      "ledger_people",
      "?archived=eq.false&select=id,name,org,stories,starred,photo_url,merged_into,aliases&order=name.asc"
    ),
    supabaseSelect(
      "ledger_link_suggestions",
      `?story_slug=eq.${params.slug}&select=target_kind,target_ref,status`
    ),
  ]);
  const storyRow = storyRows[0] || null;
  const [company] = storyRow?.company_id
    ? await supabaseSelect("ledger_companies", `?id=eq.${storyRow.company_id}&select=id,name,logo_url,relationship,icp_fit`)
    : [];

  // Wiki-link context: slugs and titles from the DB rows (covers row-only
  // stories) plus the md index; person resolution against live people.
  const backIndex = buildBacklinkIndex();
  const titleBySlug = new Map(backIndex.titleBySlug);
  for (const r of parentRows) if (!titleBySlug.has(r.slug)) titleBySlug.set(r.slug, r.title);
  const slugSet = new Set([...backIndex.slugSet, ...parentRows.map((r) => r.slug)]);
  const story = getStory(params.slug, {
    slugSet,
    titleBySlug,
    resolvePerson: (name) => resolvePersonTarget(name, people),
  });

  const isHub = HUB_STORY_SLUGS.has(params.slug);
  const peopleInStory = people.filter((p) => parseStorySlugs(p.stories).includes(params.slug));
  const shownPeople = isHub ? peopleInStory.slice(0, 30) : peopleInStory;
  const linkedFrom = (backIndex.inbound.get(params.slug) || []).filter(
    (b) => b.slug !== params.slug
  );

  const raw = getStoryRaw(params.slug);
  const outboundSet = new Set(backIndex.outbound.get(params.slug) || []);
  const unlinkedPeople = raw ? findUnlinkedPeopleMentions(raw, people, params.slug) : [];
  const unlinkedStories = raw
    ? findUnlinkedStoryMentions(raw, parentRows, params.slug, outboundSet, HUB_STORY_SLUGS)
    : [];

  const mdPairs = [];
  for (const [src, targets] of backIndex.outbound) {
    for (const t of targets) mdPairs.push([src, t]);
  }
  const localGraph = buildLocalGraph("s:" + params.slug, parentRows, people, mdPairs);

  // Some stories are pure structured data - an event or sub-event mined
  // from real records, never written up as narrative markdown. Only 404
  // when there's neither a story file nor a database row to show.
  if (!story && !storyRow) notFound();

  const parentStory = storyRow?.parent_slug
    ? parentRows.find((p) => p.slug === storyRow.parent_slug)
    : null;

  return (
    <>
      <p style={{ marginBottom: 16 }}>
        <a href="/stories">&larr; All stories</a>
      </p>

      {storyRow && (
        <div className="content" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <CompanyLogo src={company?.logo_url} name={storyRow.title} size={22} />
            <p className="field-label" style={{ margin: 0 }}>
              {storyRow.kind === "event" ? "Evento" : storyRow.kind === "sale" ? "Vendita" : "Momento o filo"}, sulla timeline
            </p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--ink-faint)" }}>
              ·
              <TableCellInput
                action={updateStoryLocation}
                id={storyRow.id}
                name="location"
                defaultValue={storyRow.location || ""}
                placeholder="luogo..."
              />
            </span>
          </div>
          {parentStory && (
            <p style={{ margin: "0 0 8px", fontSize: 13 }}>
              Parte di <a href={`/story/${parentStory.slug}`}>{parentStory.title}</a>
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="entry-meta" style={{ margin: 0 }}>Inizio</span>
              <TableCellInput action={updateStoryStart} id={storyRow.id} name="start_date" defaultValue={storyRow.start_date || ""} type="date" placeholder="start date" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="entry-meta" style={{ margin: 0 }}>Fine</span>
              <TableCellInput action={updateStoryEnd} id={storyRow.id} name="end_date" defaultValue={storyRow.end_date || ""} type="date" placeholder="ongoing" />
            </div>
            <AxisToggle id={storyRow.id} axis={storyRow.axis} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <span className="entry-meta" style={{ margin: 0 }}>Prossima azione</span>
            <TableCellInput action={updateStoryNextAction} id={storyRow.id} name="next_action" defaultValue={storyRow.next_action || ""} placeholder="cosa manca fare..." />
            <span className="entry-meta" style={{ margin: 0 }}>entro</span>
            <TableCellInput action={updateStoryNextActionDate} id={storyRow.id} name="next_action_date" defaultValue={storyRow.next_action_date || ""} type="date" placeholder="data" />
          </div>
          <div style={{ marginTop: 10 }}>
            <span className="entry-meta" style={{ margin: 0 }}>
              La tua strategia su questo deal
            </span>
            <p style={{ fontSize: 12, color: "var(--ink-faint)", margin: "2px 0 4px" }}>
              Parole tue: come vuoi giocarla. Ogni bozza e follow-up che
              preparo parte da qui - nessun automatismo la tocca mai.
            </p>
            <TableCellInput
              action={updateStoryStrategy}
              id={storyRow.id}
              name="strategy"
              defaultValue={storyRow.strategy || ""}
              placeholder="es. non rilanciare sul prezzo, accetta il suo numero e poi upsell dopo il primo risultato..."
              multiline
              rows={3}
            />
          </div>
          {notionTasks.length > 0 && (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
              {notionTasks.map((t) => (
                <a key={t.notion_url} href={t.notion_url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: "var(--ink-dim)" }}>
                  Notion ({t.status}): {t.task}
                </a>
              ))}
            </div>
          )}
          {childRows.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <span className="entry-meta" style={{ margin: 0 }}>Sotto-eventi ({childRows.length})</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {childRows.map((c) => (
                  <a key={c.slug} href={`/story/${c.slug}`} className="list-tab">
                    {c.title}
                  </a>
                ))}
              </div>
            </div>
          )}
          <p style={{ margin: "8px 0 0" }}>
            <a href="/genesis">Vedi sulla timeline unificata &rarr;</a>
          </p>
        </div>
      )}

      {genesisEvents.length > 0 && (
        <div className="content" style={{ marginBottom: 16 }}>
          <p className="field-label" style={{ marginBottom: 8 }}>
            Sulla genesi ({genesisEvents.length})
          </p>
          {genesisEvents.map((e) => (
            <div key={e.id} className="entry">
              <p style={{ fontWeight: 600, margin: "0 0 2px" }}>
                {e.year ? `${e.month ? e.month + "/" : ""}${e.year} — ` : ""}
                {e.title}
              </p>
              <p style={{ margin: 0, color: "var(--ink-dim)", fontSize: 13.5 }}>{e.description}</p>
            </div>
          ))}
        </div>
      )}

      {story && <article className="content" dangerouslySetInnerHTML={{ __html: story.html }} />}

      {(peopleInStory.length > 0 || linkedFrom.length > 0 || unlinkedPeople.length > 0 || unlinkedStories.length > 0) && (
        <div className="content" style={{ marginTop: 16 }}>
          <p className="field-label" style={{ marginBottom: 8 }}>Collegamenti</p>

          {peopleInStory.length > 0 && (
            <>
              <p className="entry-meta" style={{ margin: "0 0 6px" }}>
                Persone in questa storia ({peopleInStory.length})
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {shownPeople.map((p) => (
                  <a key={p.id} href={`/people/${p.id}`} className="list-tab" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Avatar name={p.name} photoUrl={p.photo_url} size={16} />
                    {p.name}
                  </a>
                ))}
                {isHub && peopleInStory.length > shownPeople.length && (
                  <span className="entry-meta">e altre {peopleInStory.length - shownPeople.length} persone</span>
                )}
              </div>
            </>
          )}

          {linkedFrom.length > 0 && (
            <>
              <p className="entry-meta" style={{ margin: "0 0 6px" }}>
                Storie che puntano qui ({linkedFrom.length})
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {linkedFrom.map((b) => (
                  <a key={b.slug} href={`/story/${b.slug}`} className="list-tab">
                    {b.title}
                  </a>
                ))}
              </div>
            </>
          )}

          {(unlinkedPeople.length > 0 || unlinkedStories.length > 0) && (
            <div className="backlink-suggest">
              <p className="entry-meta" style={{ margin: "0 0 6px" }}>
                Menzionati nel testo ma non collegati - suggerimenti
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                {unlinkedPeople.map((p) => (
                  <span key={p.id} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                    <a href={`/people/${p.id}`} className="list-tab">
                      👤 {p.name}
                    </a>
                    <form action={tagPersonToStory} style={{ display: "inline" }}>
                      <input type="hidden" name="personId" value={p.id} />
                      <input type="hidden" name="slug" value={params.slug} />
                      <button type="submit" className="mention-accept" title={`Tagga ${p.name} in questa storia`}>
                        +
                      </button>
                      <SaveWatcher />
                    </form>
                  </span>
                ))}
                {unlinkedStories.map((s) => {
                  const proposed = existingSuggestions.some(
                    (e) => e.target_kind === "story" && e.target_ref === s.slug
                  );
                  return (
                    <span key={s.slug} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                      <a href={`/story/${s.slug}`} className="list-tab">
                        {s.title}
                      </a>
                      {proposed ? (
                        <span className="entry-meta" title="Proposta in coda per il prossimo /ledger">in coda</span>
                      ) : (
                        <form action={proposeLink} style={{ display: "inline" }}>
                          <input type="hidden" name="storySlug" value={params.slug} />
                          <input type="hidden" name="targetRef" value={s.slug} />
                          <input type="hidden" name="targetLabel" value={s.title} />
                          <button type="submit" className="mention-accept" title={`Proponi il link [[${s.slug}]] - lo applico al prossimo giro di ledger`}>
                            +
                          </button>
                          <SaveWatcher />
                        </form>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {localGraph && localGraph.nodes.length > 1 && (
        <div className="content" style={{ marginTop: 16 }}>
          <p className="field-label" style={{ marginBottom: 8 }}>
            Vicinato ({localGraph.nodes.length} nodi) -{" "}
            <a href="/network">grafo completo &rarr;</a>
          </p>
          <ObsidianGraph nodes={localGraph.nodes} links={localGraph.links} height={300} compact />
        </div>
      )}

      <SavedToast />
    </>
  );
}
