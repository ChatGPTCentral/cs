// Turns the free-text "stories" column (comma-separated slugs, sometimes
// with a trailing note like "(related)") into a clean set of slugs, for
// computing connections between people who share a story or an org.
export function parseStorySlugs(stories) {
  if (!stories) return [];
  return stories
    .split(",")
    .map((s) => s.trim().replace(/\s*\(.*\)\s*$/, ""))
    .filter(Boolean);
}

// Turns the free-text "attendees" column on a meeting row
// ("Name (email), Name (email)") into [{name, email}]. Written by the
// auto-genesis sweep from real Calendar attendee data - see
// ledger_upcoming_meetings and references/autogenesis.md.
export function parseAttendees(attendees) {
  if (!attendees) return [];
  return attendees
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = s.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      return m ? { name: m[1].trim(), email: m[2].trim().toLowerCase() } : { name: s, email: null };
    });
}

// Turns the free-text "lists" column (comma-separated tags, e.g.
// "Service Providers, Sales") into a clean set of tags.
export function parseLists(lists) {
  if (!lists) return [];
  return lists
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Relationship decay (second-brain roadmap Phase 3): how many days a
// cadence tolerates before a relationship counts as overdue. "as-needed"
// and no cadence at all are deliberately absent - nothing to flag.
const CADENCE_DAYS = { monthly: 30, quarterly: 90, biannual: 182 };

// Last touch is derived, never stored: the most recent updated_at among
// the person's tagged stories. storiesByUpdatedAt: Map<slug, isoString>.
export function lastTouchedAt(person, storiesByUpdatedAt) {
  let latest = null;
  for (const slug of parseStorySlugs(person.stories)) {
    const u = storiesByUpdatedAt.get(slug);
    if (u && (!latest || u > latest)) latest = u;
  }
  return latest;
}

// null when there is nothing to flag (no cadence, or "as-needed").
// Otherwise { overdue, daysSince } - daysSince is null when the person
// has never been touched at all (no linked story has a date to derive
// from), which counts as overdue by definition.
export function cadenceStatus(cadence, lastTouched) {
  const limit = CADENCE_DAYS[cadence];
  if (!limit) return null;
  if (!lastTouched) return { overdue: true, daysSince: null };
  const daysSince = Math.floor((Date.now() - new Date(lastTouched).getTime()) / 86400000);
  return { overdue: daysSince > limit, daysSince };
}

// Two people are connected if they share a story or the same org. Cheap,
// derived from data already on each row - not a separate relations table.
// See docs/platform-plan.md, "Network visualization" for the bigger,
// not-yet-scoped version of this.
export function findConnections(person, allPeople) {
  const personSlugs = new Set(parseStorySlugs(person.stories));
  const personOrg = person.org ? person.org.trim().toLowerCase() : null;

  return allPeople
    .filter((other) => other.id !== person.id)
    .map((other) => {
      const otherSlugs = parseStorySlugs(other.stories);
      const sharedStories = otherSlugs.filter((s) => personSlugs.has(s));
      const sameOrg =
        personOrg && other.org && other.org.trim().toLowerCase() === personOrg;
      return { person: other, sharedStories, sameOrg };
    })
    .filter((c) => c.sharedStories.length > 0 || c.sameOrg);
}

// Stories that exist to funnel many people through one pipeline, not to
// describe a real shared moment between them - see genesis's own
// NO_PEOPLE_STORIES for the sibling fix. Every person in this kind of
// story is *also* tagged to their real event/story, so treating a shared
// tag on the hub itself as a connection would just recreate the
// person-level hairball one level up, with the hub as the new super-node.
export const HUB_STORY_SLUGS = new Set(["ai-central-voices"]);

// The graph this app should lead with: nodes are stories (not people),
// sized by how many people are tagged to them, edges are two stories that
// share a real person - a much sparser, truer signal than person-level
// org/story edges, since most people belong to exactly one story. Hub
// stories (see above) are still shown as their own node - sized by their
// real headcount - but never generate a cross-story edge, since "everyone
// in the pipeline shares the pipeline tag" isn't a real overlap.
export function buildStoryGraph(stories, people) {
  const peopleBySlug = new Map();
  for (const p of people) {
    for (const slug of parseStorySlugs(p.stories)) {
      if (!peopleBySlug.has(slug)) peopleBySlug.set(slug, new Set());
      peopleBySlug.get(slug).add(p.id);
    }
  }

  const nodes = stories
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      kind: s.kind,
      axis: s.axis,
      isHub: HUB_STORY_SLUGS.has(s.slug),
      peopleIds: [...(peopleBySlug.get(s.slug) || [])],
    }))
    .filter((n) => n.peopleIds.length > 0);

  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      if (a.isHub || b.isHub) continue;
      const bIds = new Set(b.peopleIds);
      const shared = a.peopleIds.filter((id) => bIds.has(id));
      if (shared.length > 0) {
        edges.push({ source: a.slug, target: b.slug, sharedIds: shared });
      }
    }
  }

  return { nodes, edges };
}

// The whole-graph version of findConnections - one edge per connected
// pair (not two, A-B and B-A), and only the nodes that actually have at
// least one edge. People with no shared org or story are real, they just
// don't have a place on a relationship graph yet.
// emailRows: [{person_id, thread_id}] from ledger_people_emails - two
// people actually appearing together on the same real Gmail thread is a
// stronger, truer signal than a shared org string, and unlike shared
// stories (hand-tagged) it's derived straight from the mailbox.
export function buildNetwork(people, emailRows = []) {
  const parsed = people.map((p) => ({
    person: p,
    storySlugs: new Set(parseStorySlugs(p.stories)),
    org: p.org ? p.org.trim().toLowerCase() : null,
  }));

  const threadsByPerson = new Map();
  for (const row of emailRows) {
    if (!threadsByPerson.has(row.person_id)) threadsByPerson.set(row.person_id, new Set());
    threadsByPerson.get(row.person_id).add(row.thread_id);
  }

  const edges = [];
  for (let i = 0; i < parsed.length; i++) {
    for (let j = i + 1; j < parsed.length; j++) {
      const a = parsed[i];
      const b = parsed[j];
      const sharedStories = [...b.storySlugs].filter((s) => a.storySlugs.has(s));
      const sameOrg = a.org && b.org && a.org === b.org;
      const aThreads = threadsByPerson.get(a.person.id);
      const bThreads = threadsByPerson.get(b.person.id);
      const sharedThreads = aThreads && bThreads ? [...aThreads].filter((t) => bThreads.has(t)) : [];
      if (sharedStories.length > 0 || sameOrg || sharedThreads.length > 0) {
        edges.push({ source: a.person.id, target: b.person.id, sharedStories, sameOrg, sharedThreads });
      }
    }
  }

  const degree = new Map();
  for (const e of edges) {
    degree.set(e.source, (degree.get(e.source) || 0) + 1);
    degree.set(e.target, (degree.get(e.target) || 0) + 1);
  }

  const nodes = people
    .filter((p) => degree.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      org: p.org || null,
      starred: !!p.starred,
      photoUrl: p.photo_url || null,
      degree: degree.get(p.id),
    }));

  return { nodes, edges, isolatedCount: people.length - nodes.length };
}

// The Obsidian-style knowledge graph: every story and every person is a
// node, an edge means "this person is tagged into this story" (plus
// story->parent edges). Bipartite, so it stays sparse and readable even
// with everything on screen at once - the readability comes from live
// physics, zoom and hover-highlight in the client component, not from
// pre-filtering. People tagged to no story are left out (they'd float
// unconnected); their count is reported instead.
//
// Companies (optional third argument) join as a third node type, linked
// to their people and stories via company_id - the same FK /clienti
// already uses. A company with no linked person or story is left out for
// the same reason orphan people are: a floating node with no edge adds
// noise, not signal.
export function buildKnowledgeGraph(stories, people, companies = []) {
  const storyBySlug = new Map(stories.map((s) => [s.slug, s]));
  const nodes = [];
  const links = [];
  const idx = new Map();

  for (const s of stories) {
    idx.set("s:" + s.slug, nodes.length);
    nodes.push({
      id: "s:" + s.slug,
      label: s.title,
      type: "story",
      kind: s.kind,
      url: `/story/${s.slug}`,
      count: 0,
    });
  }

  const companyIdx = new Map();
  for (const c of companies) {
    companyIdx.set(c.id, {
      id: "c:" + c.id,
      label: c.name,
      type: "company",
      url: `/clienti#company-${c.id}`,
      count: 0,
    });
  }

  function linkCompany(companyId, otherKey) {
    if (!companyId || !companyIdx.has(companyId)) return;
    const key = "c:" + companyId;
    if (!idx.has(key)) {
      idx.set(key, nodes.length);
      nodes.push(companyIdx.get(companyId));
    }
    const ci = idx.get(key);
    links.push({ s: idx.get(otherKey), t: ci });
    nodes[ci].count++;
  }

  let orphanCount = 0;
  for (const p of people) {
    const slugs = parseStorySlugs(p.stories).filter((sl) => storyBySlug.has(sl));
    if (slugs.length === 0 && !p.company_id) {
      orphanCount++;
      continue;
    }
    const key = "p:" + p.id;
    idx.set(key, nodes.length);
    nodes.push({
      id: key,
      label: p.name,
      type: "person",
      starred: !!p.starred,
      photo: p.photo_url || null,
      url: `/people/${p.id}`,
      count: slugs.length,
    });
    for (const sl of slugs) {
      const si = idx.get("s:" + sl);
      links.push({ s: idx.get(key), t: si });
      nodes[si].count++;
    }
    linkCompany(p.company_id, key);
  }

  for (const s of stories) {
    if (s.parent_slug && storyBySlug.has(s.parent_slug)) {
      links.push({ s: idx.get("s:" + s.slug), t: idx.get("s:" + s.parent_slug), parent: true });
    }
    if (s.company_id) linkCompany(s.company_id, "s:" + s.slug);
  }

  return { nodes, links, orphanCount };
}

// The per-entity neighborhood: BFS from a center node over the same
// knowledge graph /network uses, plus story-to-story edges from the
// markdown backlink index (mdPairs: [[slugA, slugB], ...]). Depth 2
// normally; depth 1 when the center is a hub story, and hub stories
// never pull their whole membership into someone else's neighborhood.
// Links are re-indexed positionally - ObsidianGraph requires it.
export function buildLocalGraph(centerId, stories, people, mdPairs = [], companies = []) {
  const { nodes, links } = buildKnowledgeGraph(stories, people, companies);
  const idxById = new Map(nodes.map((n, i) => [n.id, i]));
  const center = idxById.get(centerId);
  if (center === undefined) return null;

  const slugIdx = new Map();
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].type === "story") slugIdx.set(nodes[i].id.slice(2), i);
  }
  const allLinks = links.slice();
  for (const [a, b] of mdPairs) {
    const ia = slugIdx.get(a);
    const ib = slugIdx.get(b);
    if (ia !== undefined && ib !== undefined) allLinks.push({ s: ia, t: ib, md: true });
  }

  const adj = nodes.map(() => []);
  for (const l of allLinks) {
    adj[l.s].push(l.t);
    adj[l.t].push(l.s);
  }

  const isHub = (i) => nodes[i].type === "story" && HUB_STORY_SLUGS.has(nodes[i].id.slice(2));
  const maxDepth = isHub(center) ? 1 : 2;
  const keep = new Map([[center, 0]]);
  let frontier = [center];
  for (let d = 1; d <= maxDepth && keep.size < 120; d++) {
    const next = [];
    for (const i of frontier) {
      // A hub neighbor stays in the picture but doesn't expand - its
      // ~150 members aren't this entity's neighborhood.
      if (i !== center && isHub(i)) continue;
      for (const j of adj[i]) {
        if (!keep.has(j) && keep.size < 120) {
          keep.set(j, d);
          next.push(j);
        }
      }
    }
    frontier = next;
  }

  const order = [...keep.keys()];
  const newIdx = new Map(order.map((oldI, i) => [oldI, i]));
  const outNodes = order.map((oldI) => ({ ...nodes[oldI], center: oldI === center }));
  const outLinks = [];
  const seen = new Set();
  for (const l of allLinks) {
    if (!newIdx.has(l.s) || !newIdx.has(l.t)) continue;
    const key = Math.min(l.s, l.t) + ":" + Math.max(l.s, l.t) + (l.md ? ":md" : "");
    if (seen.has(key)) continue;
    seen.add(key);
    outLinks.push({ s: newIdx.get(l.s), t: newIdx.get(l.t), md: l.md, parent: l.parent });
  }
  return { nodes: outNodes, links: outLinks };
}
