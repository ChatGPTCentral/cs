import { supabaseSelect } from "../../lib/supabase";
import { addPlace, updatePlaceField } from "./actions";
import TableCellInput from "../people/TableCellInput";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";

export const dynamic = "force-dynamic";

// The geographic axis of the genesis: where Alex was (presence periods,
// entered by hand - never inferred) and where things happened (derived
// from the location field on event stories).
export default async function PlacesPage() {
  const [periods, stories] = await Promise.all([
    supabaseSelect("ledger_places", "?order=start_date.desc.nullslast"),
    supabaseSelect(
      "ledger_stories",
      "?location=not.is.null&select=slug,title,kind,location,start_date,end_date&order=start_date.asc"
    ),
  ]);

  const byPlace = new Map();
  for (const s of stories) {
    if (!byPlace.has(s.location)) byPlace.set(s.location, []);
    byPlace.get(s.location).push(s);
  }
  const places = [...byPlace.entries()]
    .map(([place, list]) => {
      const dates = list.map((s) => s.start_date).filter(Boolean).sort();
      return { place, list, first: dates[0] || null, last: dates[dates.length - 1] || null };
    })
    .sort((a, b) => ((a.last || "") < (b.last || "") ? 1 : -1));

  return (
    <>
      <div className="content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>
          Dove sei stato
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 12px" }}>
          I periodi della tua vita per luogo (Messico, Italia, Londra...).
          Li scrivi tu - nessuno sweep li inventa. Le date possono restare
          vuote finché non le ricordi.
        </p>

        {periods.length === 0 && (
          <p style={{ color: "var(--ink-faint)" }}>
            Ancora vuoto - aggiungi il primo periodo qui sotto.
          </p>
        )}
        {periods.map((p) => (
          <div key={p.id} className="entry" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <TableCellInput action={updatePlaceField} id={p.id} name="place" defaultValue={p.place} placeholder="luogo" />
            <span className="entry-meta" style={{ margin: 0 }}>dal</span>
            <TableCellInput action={updatePlaceField} id={p.id} name="start_date" defaultValue={p.start_date || ""} type="date" placeholder="inizio" />
            <span className="entry-meta" style={{ margin: 0 }}>al</span>
            <TableCellInput action={updatePlaceField} id={p.id} name="end_date" defaultValue={p.end_date || ""} type="date" placeholder="(in corso)" />
            <TableCellInput action={updatePlaceField} id={p.id} name="note" defaultValue={p.note || ""} placeholder="nota..." />
          </div>
        ))}

        <form action={addPlace} className="crm-form" style={{ marginTop: 14 }}>
          <label className="field-label" htmlFor="f-place">Nuovo periodo</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input id="f-place" name="place" placeholder="es. Città del Messico" required style={{ minWidth: 180 }} />
            <input name="start_date" type="date" />
            <input name="end_date" type="date" />
            <input name="note" placeholder="nota (opzionale)" style={{ flex: 1, minWidth: 160 }} />
            <button type="submit">Aggiungi</button>
          </div>
          <SaveWatcher />
        </form>
      </div>

      <div className="content">
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>
          Dove sono successe le cose
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 12px" }}>
          Derivato dal campo luogo delle storie ({stories.length} storie con
          un luogo). Il campo si corregge sulla pagina della storia.
        </p>
        {places.map(({ place, list, first, last }) => (
          <div key={place} style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, margin: "0 0 4px" }}>
              {place}{" "}
              <span className="entry-meta">
                · {list.length} {list.length === 1 ? "storia" : "storie"}
                {first ? ` · ${first.slice(0, 7)}${last && last !== first ? ` → ${last.slice(0, 7)}` : ""}` : ""}
              </span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {list.map((s) => (
                <a key={s.slug} href={`/story/${s.slug}`} className="list-tab">
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SavedToast />
    </>
  );
}
