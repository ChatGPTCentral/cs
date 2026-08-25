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
          A solid, colored edge means two people share a story/moment; a dashed
          gray edge means they share an org - hidden by default, since a
          generic org string was making the graph unreadable, turn it on
          below if you want it. Circle size is how many connections a person
          has; a filled circle is starred. Scroll to zoom, drag to pan, search
          a name to isolate one person's neighborhood. Click a person to open
          their page. {isolatedCount} people have no shared org or story with
          anyone else yet, so they&apos;re not on the graph - tag them into a
          story or set their org to place them.
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
