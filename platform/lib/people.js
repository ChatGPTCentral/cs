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
