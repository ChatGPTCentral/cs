import { supabaseSelect } from "../../lib/supabase";
import { buildNetwork, buildStoryGraph } from "../../lib/people";
import NetworkGraph from "./NetworkGraph";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const [people, emailRows, stories] = await Promise.all([
    supabaseSelect("ledger_people", "?archived=eq.false&order=name.asc"),
    supabaseSelect("ledger_people_emails", "?select=person_id,thread_id"),
    supabaseSelect("ledger_stories", "?select=slug,title,kind,axis"),
  ]);
  const { nodes: personNodes, edges: personEdges, isolatedCount } = buildNetwork(people, emailRows);
  const storyGraph = buildStoryGraph(stories, people);
  const peopleById = Object.fromEntries(
    people.map((p) => [p.id, { name: p.name, org: p.org || null, photoUrl: p.photo_url || null }])
  );

  return (
    <>
      <div className="content wide-content">
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
          Network - {storyGraph.nodes.length} storie con persone
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 16px" }}>
          Le storie sono i nodi, non le persone - chi c&apos;è dentro una
          storia si vede aprendola, non affollando un grafo unico. Un
          collegamento tra due storie vuol dire che condividono davvero una
          persona. Cerca un nome per vedere invece la rete di quella persona
          - solo lei e i suoi collegamenti diretti, non tutta AI Central
          insieme. {isolatedCount} persone non condividono ancora una storia,
          un thread o un&apos;org con nessuno, quindi non compaiono da nessuna
          parte qui.
        </p>
        <NetworkGraph
          storyNodes={storyGraph.nodes}
          storyEdges={storyGraph.edges}
          personNodes={personNodes}
          personEdges={personEdges}
          peopleById={peopleById}
        />
      </div>
    </>
  );
}
