import { supabaseSelect } from "../../lib/supabase";
import { buildNetwork } from "../../lib/people";
import NetworkGraph from "./NetworkGraph";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const [people, emailRows] = await Promise.all([
    supabaseSelect("ledger_people", "?archived=eq.false&order=name.asc"),
    supabaseSelect("ledger_people_emails", "?select=person_id,thread_id"),
  ]);
  const { nodes, edges, isolatedCount } = buildNetwork(people, emailRows);

  return (
    <>
      <div className="content wide-content">
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
          Network - {nodes.length} connected, {isolatedCount} not yet
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 16px" }}>
          Three kinds of edge, each a different strength of evidence: green
          means two people were actually on the same real Gmail thread
          together - the strongest signal, derived straight from the
          mailbox, not hand-tagged. Blue/accent means they share a
          story/moment - real, but only as good as the tagging. Dashed gray
          means they share an org string - the weakest, hidden by default
          since a generic org was making the graph unreadable; turn it on
          below if you want it. Circle size is how many connections a person
          has; a filled circle is starred. Scroll to zoom, drag to pan, search
          a name to isolate one person's neighborhood. Click a person to open
          their page. {isolatedCount} people share none of these with anyone
          else yet, so they&apos;re not on the graph.
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
