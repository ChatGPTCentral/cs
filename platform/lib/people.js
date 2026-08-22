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

// The whole-graph version of findConnections - one edge per connected
// pair (not two, A-B and B-A), and only the nodes that actually have at
// least one edge. People with no shared org or story are real, they just
// don't have a place on a relationship graph yet.
export function buildNetwork(people) {
  const parsed = people.map((p) => ({
    person: p,
    storySlugs: new Set(parseStorySlugs(p.stories)),
    org: p.org ? p.org.trim().toLowerCase() : null,
  }));

  const edges = [];
  for (let i = 0; i < parsed.length; i++) {
    for (let j = i + 1; j < parsed.length; j++) {
      const a = parsed[i];
      const b = parsed[j];
      const sharedStories = [...b.storySlugs].filter((s) => a.storySlugs.has(s));
      const sameOrg = a.org && b.org && a.org === b.org;
      if (sharedStories.length > 0 || sameOrg) {
        edges.push({ source: a.person.id, target: b.person.id, sharedStories, sameOrg });
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
