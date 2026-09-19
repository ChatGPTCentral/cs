// Today - the landing page. Per Alex, 2026-09-18: "in today io voglio
// quello che devo fare della mia giornata (cioè il brief) e poi voglio
// avere altri task secondari che potrei comunque tacklare." Per Alex,
// 2026-09-19: /brief and /closing are retired - "non abbiamo bisogno
// né del brief né del closing, stiamo portando tutte le funzionalità
// nel today." So this page is now everything: the morning brief
// rendered inline and editable per-line (BriefBlocks), a Send bar
// (BriefSendBar - the one thing /brief had that this page didn't), the
// live backlog with instant task actions (NbaPage, which already had
// its own quick-add - /closing's "what's new today"), and a free-text
// note capture (TodayNote - /closing's other half, "anything else that
// happened today").
import { supabaseSelect } from "../lib/supabase";
import BriefBlocks from "./BriefBlocks";
import BriefSendBar from "./BriefSendBar";
import NbaPage from "./nba/page";
import TodayNote from "./TodayNote";

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
  const [briefs, recentNotes] = await Promise.all([
    supabaseSelect("ledger_briefs", "?kind=eq.morning&order=brief_date.desc&limit=1"),
    supabaseSelect("ledger_closing_notes", "?order=created_at.desc&limit=5"),
  ]);
  const brief = briefs[0];
  const today = todayISO();
  // The brief generates every day now (was Mon-Fri until 2026-09-19).
  // On a missed run the most recent row is not today's - the page used
  // to render it with no indication of that, which reads as "today"
  // even when it is not.
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
                {formatItalianDate(brief.brief_date)}. Dovrebbe arrivare ogni mattina, anche nel weekend.
              </p>
            )}
            <BriefSendBar brief={brief} />
            <BriefBlocks briefId={brief.id} content={brief.content} />
          </>
        ) : (
          <p style={{ paddingTop: 16 }}>Nessun brief ancora per oggi - dovrebbe arrivare ogni mattina, anche nel weekend.</p>
        )}
      </div>

      <details className="today-secondary" open>
        <summary>Altro che potresti tacklare</summary>
        <p className="today-secondary-note">
          Il resto del backlog - non è nel brief di oggi, ma è lì se hai tempo o voglia.
        </p>
        <NbaPage />
      </details>

      <div className="content" style={{ marginTop: 20 }}>
        <h2 style={{ marginTop: 0, fontSize: 15 }}>Nota di giornata</h2>
        <TodayNote />
        {recentNotes.length > 0 && (
          <div style={{ marginTop: 14 }}>
            {recentNotes.map((n) => (
              <div key={n.id} className="entry">
                <p style={{ margin: 0 }}>{n.note}</p>
                <div className="entry-meta">
                  {n.log_date} {n.processed ? "- integrata nel ledger" : "- in attesa del prossimo giro"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
