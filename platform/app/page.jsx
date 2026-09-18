// Today - the landing page. Per Alex, 2026-09-18: "in today io voglio
// quello che devo fare della mia giornata (cioè il brief) e poi voglio
// avere altri task secondari che potrei comunque tacklare." So this page
// is now two things stacked, not the old NBA-as-home from 2026-08-29:
// the latest morning brief rendered inline (no click-through to /brief
// needed just to read it - /brief is still where you edit and send it),
// then the live backlog (what used to be the whole home page) as a
// secondary, clearly-labeled section underneath.
import { supabaseSelect } from "../lib/supabase";
import BriefBlocks from "./BriefBlocks";
import NbaPage from "./nba/page";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const briefs = await supabaseSelect("ledger_briefs", "?kind=eq.morning&order=brief_date.desc&limit=1");
  const brief = briefs[0];

  return (
    <>
      <div className="content" style={{ marginBottom: 28 }}>
        {brief ? (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 14 }}>
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                {brief.status === "draft" ? "bozza, non ancora inviata - " : "già inviato - "}
                modifica su <a href="/brief">/brief</a>
              </span>
            </div>
            <BriefBlocks briefId={brief.id} content={brief.content} />
          </>
        ) : (
          <p style={{ paddingTop: 16 }}>Nessun brief ancora per oggi - arriva nei giorni feriali, la mattina.</p>
        )}
      </div>

      <details className="today-secondary" open>
        <summary>Altro che potresti tacklare</summary>
        <p className="today-secondary-note">
          Il resto del backlog - non è nel brief di oggi, ma è lì se hai tempo o voglia.
        </p>
        <NbaPage />
      </details>
    </>
  );
}
