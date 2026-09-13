"use client";

import { usePathname } from "next/navigation";

// The 40px bar above every page's content column, replacing the old
// footer.snapshot-note. Reference: BrainRail.dc.html's "Main top bar" spec
// in design_handoff_second_brain/README.md.
//
// The breadcrumb here is a generic path-segment breakdown (capitalize
// each `/segment`), not yet the per-page "Stories / GTA whitepaper" title
// lookup the design calls for - that needs each page to hand back its own
// title, which is a follow-up pass once the shell itself is confirmed.
function label(segment) {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ShellTopBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="shell-topbar">
      <div className="shell-breadcrumb">
        {segments.length === 0 ? (
          <span className="current">Today</span>
        ) : (
          segments.map((seg, i) => {
            const isLast = i === segments.length - 1;
            return (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span className="sep">/</span>}
                <span className={isLast ? "current" : ""}>{label(seg)}</span>
              </span>
            );
          })
        )}
      </div>
      <div className="shell-dents">
        <span className="shell-dent" title="Refresh with /ledger in Claude Code">
          Ledger snapshot · refresh with /ledger
        </span>
      </div>
    </div>
  );
}
