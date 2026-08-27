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

// Turns the free-text "lists" column (comma-separated tags, e.g.
// "Service Providers, Sales") into a clean set of tags.
export function parseLists(lists) {
  if (!lists) return [];
  return lists
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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
