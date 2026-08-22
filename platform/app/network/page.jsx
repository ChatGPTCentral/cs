import { supabaseSelect } from "../../lib/supabase";
import { buildNetwork } from "../../lib/people";
import NetworkGraph from "./NetworkGraph";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const people = await supabaseSelect("ledger_people", "?archived=eq.false&order=name.asc");
  const { nodes, edges, isolatedCount } = buildNetwork(people);

  return (
    <>
      <div className="content wide-content">
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
          Network - {nodes.length} connected, {isolatedCount} not yet
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 16px" }}>
          An edge means two people share an org (dashed, gray) or a story/moment
          (solid, colored) - computed live from the CRM, nothing hand-drawn. Circle
          size is how many connections a person has; a filled circle is starred.
          Hover a person to see just their connections. Click one to open their
          page. {isolatedCount} people have no shared org or story with anyone
          else yet, so they're not on the graph - tag them into a story or set
          their org to place them.
        </p>
        {nodes.length === 0 ? (
          <p style={{ color: "var(--ink-faint)" }}>
            Nobody shares an org or a story yet - nothing to draw.
          </p>
        ) : (
          <NetworkGraph nodes={nodes} edges={edges} />
        )}
      </div>
    </>
  );
}
