import { supabaseSelect } from "../../lib/supabase";
import { updateGenesisEvent, addGenesisEvent } from "./actions";
import TableCellInput from "../people/TableCellInput";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";

export const dynamic = "force-dynamic";

const MONTHS_IT = [
  "", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

export default async function GenesisPage() {
  const events = await supabaseSelect(
    "ledger_genesis_events",
    "?order=year.asc.nullslast,month.asc.nullslast,sort_order.asc"
  );

  const dated = events.filter((e) => e.year);
  const undated = events.filter((e) => !e.year);

  // Group into year -> month -> [events], preserving arrival order within
  // a month (sort_order from the query above already did the real sort).
  const byYear = new Map();
  for (const e of dated) {
    if (!byYear.has(e.year)) byYear.set(e.year, new Map());
    const byMonth = byYear.get(e.year);
    const mk = e.month || 0;
    if (!byMonth.has(mk)) byMonth.set(mk, []);
    byMonth.get(mk).push(e);
  }
  const years = [...byYear.keys()].sort((a, b) => a - b);

  return (
    <>
      <div className="content wide-content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 6px" }}>
          La genesi di AI Central, mese per mese
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 8px" }}>
          {events.length} voci. Clicca su un titolo o una descrizione per modificarla - salva da
          solo quando clicchi fuori, niente bottone Salva, niente Feedback. Il file inglese
          canonico (organizzato per temi, non per data) resta in{" "}
          <code>.claude/skills/ai-central-genesis/SKILL.md</code> nel repo - questa pagina è la
          fonte di lavoro in italiano.
        </p>

        <form action={addGenesisEvent} className="crm-form" style={{ marginBottom: 4 }}>
          <label className="field-label" htmlFor="f-genesis-title">Nuova voce</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input id="f-genesis-title" name="title" placeholder="Titolo" style={{ flex: 1, minWidth: 180 }} required />
            <input name="year" type="number" placeholder="Anno" style={{ width: 90 }} />
            <select name="month" style={{ width: 130 }} defaultValue="">
              <option value="">(nessun mese)</option>
              {MONTHS_IT.slice(1).map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <button type="submit">Aggiungi</button>
          </div>
          <textarea name="description" placeholder="Descrizione" rows={2} style={{ marginTop: 8, width: "100%" }} required />
        </form>
      </div>

      <div className="content wide-content">
        {years.map((year) => {
          const byMonth = byYear.get(year);
          const monthKeys = [...byMonth.keys()].sort((a, b) => a - b);
          return (
            <div key={year} style={{ marginBottom: 8 }}>
              <h2 style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 26, margin: "24px 0 4px" }}>
                {year}
              </h2>
              {monthKeys.map((mk) => (
                <div key={mk} style={{ marginBottom: 22 }}>
                  <p style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 700, margin: "0 0 10px" }}>
                    {mk ? MONTHS_IT[mk] : "Senza mese"}
                  </p>
                  {byMonth.get(mk).map((e) => (
                    <div key={e.id} className="entry">
                      <TableCellInput
                        action={updateGenesisEvent}
                        id={e.id}
                        name="title"
                        defaultValue={e.title}
                        placeholder="Titolo"
                      />
                      <TableCellInput
                        action={updateGenesisEvent}
                        id={e.id}
                        name="description"
                        defaultValue={e.description}
                        placeholder="Descrizione"
                        multiline
                        rows={3}
                      />
                      <div className="entry-meta">
                        {e.source_tag}
                        {e.story_ref ? ` — ${e.story_ref}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })}

        {undated.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <h2 style={{ fontWeight: 700, fontSize: 26, margin: "24px 0 4px" }}>
              Senza data
            </h2>
            <p style={{ fontSize: 12, color: "var(--ink-faint)", margin: "0 0 10px" }}>
              Fatti veri, ma non databili - identità, pattern, contesto che non è legato a un mese
              preciso.
            </p>
            {undated.map((e) => (
              <div key={e.id} className="entry">
                <TableCellInput
                  action={updateGenesisEvent}
                  id={e.id}
                  name="title"
                  defaultValue={e.title}
                  placeholder="Titolo"
                />
                <TableCellInput
                  action={updateGenesisEvent}
                  id={e.id}
                  name="description"
                  defaultValue={e.description}
                  placeholder="Descrizione"
                  multiline
                  rows={3}
                />
                <div className="entry-meta">
                  {e.source_tag}
                  {e.story_ref ? ` — ${e.story_ref}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SavedToast />
    </>
  );
}
