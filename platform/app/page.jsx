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

const WEEKDAY_IT = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const MONTH_IT = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

// brief_date is a plain "YYYY-MM-DD" - parse as UTC so the weekday name
// can't shift a day depending on the server's local offset.
function formatItalianDate(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${WEEKDAY_IT[dt.getUTCDay()]} ${d} ${MONTH_IT[m - 1]}`;
}

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
}

export default async function TodayPage() {
  const briefs = await supabaseSelect("ledger_briefs", "?kind=eq.morning&order=brief_date.desc&limit=1");
  const brief = briefs[0];
  const today = todayISO();
  // The brief only generates Mon-Fri, so on a weekend (or a missed run)
  // the most recent row is not today's - the page used to render it with
  // no indication of that, which reads as "today" even when it is not.
  const isStale = brief && brief.brief_date !== today;

  return (
    <>
      <div className="content" style={{ marginBottom: 28 }}>
        {brief ? (
          <>
            {isStale && (
              <p
                style={{
                  margin: "14px 0 0",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "var(--accent-ink)",
                  background: "var(--accent-wash)",
                  border: "1px solid var(--border-hair)",
                  borderRadius: 6,
                }}
              >
                Nessun brief per oggi, {formatItalianDate(today)} - qui sotto l'ultimo disponibile,{" "}
                {formatItalianDate(brief.brief_date)}. Arrivano nei giorni feriali, la mattina.
              </p>
            )}
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
