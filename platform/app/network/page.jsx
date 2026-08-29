import { supabaseSelect } from "../../lib/supabase";
import { buildKnowledgeGraph } from "../../lib/people";
import ObsidianGraph from "./ObsidianGraph";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const [people, stories] = await Promise.all([
    supabaseSelect("ledger_people", "?archived=eq.false&select=id,name,org,stories,starred,photo_url&order=name.asc"),
    supabaseSelect("ledger_stories", "?select=slug,title,kind,parent_slug"),
  ]);

  const { nodes, links, orphanCount } = buildKnowledgeGraph(stories, people);

  return (
    <div className="content wide-content">
      <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 6px" }}>
        Network - {nodes.length} nodi, {links.length} collegamenti
      </h2>
      <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 14px" }}>
        Tutta la genesi come grafo vivo: le storie sono i nodi grandi, le
        persone i puntini collegati alle storie in cui compaiono. Passa sopra
        un nodo per illuminare il suo vicinato, cerca un nome per trovarlo,
        clicca per aprire la pagina.
      </p>
      <ObsidianGraph nodes={nodes} links={links} orphanCount={orphanCount} />
    </div>
  );
}
