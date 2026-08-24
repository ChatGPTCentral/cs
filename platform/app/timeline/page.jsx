import { supabaseSelect } from "../../lib/supabase";
import { createStory, updateStoryStart, updateStoryEnd, updateStoryAxis, updateQuarterSummary } from "./actions";
import TableCellInput from "../people/TableCellInput";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";

export const dynamic = "force-dynamic";

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function quarterKey(date) {
  return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
}

// Every quarter a moment's date range touches, inclusive - a moment that
// spans two quarters (like ai-hackathon-bristol, first contact to event)
// shows up in both, since it was genuinely happening in both.
function quartersBetween(start, end) {
  const out = [];
  let y = start.getFullYear();
  let q = Math.floor(start.getMonth() / 3) + 1;
  const endY = end.getFullYear();
  const endQ = Math.floor(end.getMonth() / 3) + 1;
  while (y < endY || (y === endY && q <= endQ)) {
    out.push(`${y}-Q${q}`);
    q += 1;
    if (q > 4) {
      q = 1;
      y += 1;
    }
  }
  return out;
}

function formatShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

// Two small buttons instead of a dropdown - the current axis reads at a
// glance (bold, full opacity), no click needed just to see it.
function AxisToggle({ id, axis }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      <form action={updateStoryAxis}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="axis" value="moment" />
        <button
          type="submit"
          className="axis-select"
          style={{ fontWeight: axis === "moment" ? 700 : 400, opacity: axis === "moment" ? 1 : 0.55 }}
        >
          momento
        </button>
        <SaveWatcher />
      </form>
      <form action={updateStoryAxis}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="axis" value="thread" />
        <button
          type="submit"
          className="axis-select"
          style={{ fontWeight: axis === "thread" ? 700 : 400, opacity: axis === "thread" ? 1 : 0.55 }}
        >
          filo
        </button>
        <SaveWatcher />
      </form>
    </div>
  );
}

export default async function TimelinePage() {
  const [stories, quarters] = await Promise.all([
    supabaseSelect("ledger_stories", "?order=start_date.asc.nullslast,title.asc"),
    supabaseSelect("ledger_quarters", "?order=quarter.asc"),
  ]);

  const dated = stories.filter((s) => s.start_date);
  const undated = stories.filter((s) => !s.start_date);
  const today = new Date();

  // Bucket every dated story into the quarter(s) it belongs to: a moment
  // lands in every quarter its date range touches (it can overlap other
  // moments - that's the point); a thread lands once, in the quarter it
  // started, and is understood to run on from there.
  const byQuarter = new Map();
  for (const q of quarters) byQuarter.set(q.quarter, { moments: [], threads: [] });

  for (const s of dated) {
    const start = new Date(s.start_date);
    if (s.axis === "moment") {
      const end = s.end_date ? new Date(s.end_date) : start;
      for (const qk of quartersBetween(start, end)) {
        if (!byQuarter.has(qk)) byQuarter.set(qk, { moments: [], threads: [] });
        byQuarter.get(qk).moments.push(s);
      }
    } else {
      const qk = quarterKey(start);
      if (!byQuarter.has(qk)) byQuarter.set(qk, { moments: [], threads: [] });
      byQuarter.get(qk).threads.push(s);
    }
  }

  const quarterOrder = [...byQuarter.keys()].sort();

  // The master board below - both lanes share one time scale so bars and
  // rays line up against each other.
  const rangeStart = dated.length > 0 ? new Date(dated[0].start_date) : today;
  const latestEnd = dated.reduce((max, s) => {
    const end = s.end_date ? new Date(s.end_date) : today;
    return end > max ? end : max;
  }, today);
  const totalDays = Math.max(daysBetween(rangeStart, latestEnd), 1);

  function leftPct(date) {
    return (daysBetween(rangeStart, date) / totalDays) * 100;
  }

  const momentBars = dated
    .filter((s) => s.axis === "moment")
    .map((s) => {
      const start = new Date(s.start_date);
      const end = s.end_date ? new Date(s.end_date) : today;
      return {
        ...s,
        leftPct: leftPct(start),
        widthPct: Math.max((daysBetween(start, end) / totalDays) * 100, 1.2),
        ongoing: !s.end_date,
      };
    });

  const threadRays = dated
    .filter((s) => s.axis === "thread")
    .map((s) => ({ ...s, leftPct: leftPct(new Date(s.start_date)) }));

  return (
    <>
      {quarterOrder.length > 0 && (
        <div className="content wide-content" style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 6px" }}>
            History, by quarter
          </h2>
          <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 16px" }}>
            Reconstructed from the email log and calendar - real activity per quarter, not
            invented. Each quarter splits into moments (bounded events, can overlap with each
            other) and threads (relationships that start here and keep running). Click a story
            to open it, or flip momento/filo if a story reads better on the other axis. See also{" "}
            <a href="/genesis">Genesis</a> for the same span of time in Italian, month by month,
            one entry per fact instead of grouped into stories.
          </p>

          {quarterOrder.map((qk) => {
            const q = quarters.find((row) => row.quarter === qk);
            const bucket = byQuarter.get(qk) || { moments: [], threads: [] };
            return (
              <div key={qk} className="quarter-card">
                <div className="quarter-head">
                  <span className="quarter-label">{qk}</span>
                  <span className="quarter-counts">
                    <span><strong>{bucket.moments.length}</strong> moment{bucket.moments.length === 1 ? "o" : "i"}</span>
                    <span><strong>{bucket.threads.length}</strong> fil{bucket.threads.length === 1 ? "o" : "i"}</span>
                  </span>
                </div>

                {q && (
                  <div className="quarter-prose">
                    <TableCellInput
                      action={updateQuarterSummary}
                      id={q.id}
                      name="summary"
                      defaultValue={q.summary || ""}
                      placeholder="What happened this quarter..."
                      multiline
                      rows={2}
                    />
                  </div>
                )}

                <div className="quarter-groups">
                  <div className="quarter-group">
                    <p className="quarter-group-title moments"><span className="dot" />Momenti</p>
                    {bucket.moments.length === 0 && <p className="axis-empty">Nessuno.</p>}
                    {bucket.moments.length > 0 && (
                      <div className="axis-chip-list">
                        {bucket.moments.map((s) => (
                          <div key={s.id} className="axis-chip moment">
                            <a href={`/story/${s.slug}`}>{s.title}</a>
                            <span className="dates">
                              {formatShort(s.start_date)}
                              {s.end_date ? ` – ${formatShort(s.end_date)}` : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="quarter-group">
                    <p className="quarter-group-title threads"><span className="dot" />Fili attivi</p>
                    {bucket.threads.length === 0 && <p className="axis-empty">Nessuno.</p>}
                    {bucket.threads.length > 0 && (
                      <div className="axis-chip-list">
                        {bucket.threads.map((s) => (
                          <div key={s.id} className="axis-chip thread">
                            <a href={`/story/${s.slug}`}>{s.title}</a>
                            <span className="dates">{formatShort(s.start_date)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="content wide-content" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            {stories.length} {stories.length === 1 ? "story" : "stories"} - the history of AI Central
          </h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 16px" }}>
          Two lanes instead of one. Momenti are bars - they can and do overlap, several things
          happening at once is normal. Fili are a start plus a dashed ray toward today, since
          most don&apos;t have a real end yet. Dates came from the earliest and latest real
          activity tied to each story where that data exists.
        </p>

        <form action={createStory} className="crm-form" style={{ marginBottom: 20 }}>
          <label className="field-label" htmlFor="f-story-title">New story</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input id="f-story-title" name="title" placeholder="Story title" style={{ flex: 1, minWidth: 200 }} required />
            <input name="start_date" type="date" style={{ width: 160 }} />
            <button type="submit">Add story</button>
          </div>
        </form>

        {momentBars.length === 0 && threadRays.length === 0 && (
          <p style={{ color: "var(--ink-faint)" }}>No dated stories yet.</p>
        )}

        {(momentBars.length > 0 || threadRays.length > 0) && (
          <div className="timeline-scale">
            <span>{rangeStart.toISOString().slice(0, 10)}</span>
            <span>{latestEnd.toISOString().slice(0, 10)}</span>
          </div>
        )}

        {momentBars.length > 0 && (
          <>
            <p className="board-lane-title">Momenti</p>
            {momentBars.map((s) => (
              <div key={s.id} className="timeline-row">
                <div className="timeline-label">
                  <a href={`/story/${s.slug}`}>{s.title}</a>
                </div>
                <div className="timeline-track">
                  <div
                    className={`timeline-bar${s.ongoing ? " timeline-bar-ongoing" : ""}`}
                    style={{ left: `${s.leftPct}%`, width: `${s.widthPct}%`, background: "var(--moment)" }}
                    title={`${s.start_date} → ${s.end_date || "ongoing"}`}
                  />
                </div>
                <div className="timeline-dates">
                  <TableCellInput action={updateStoryStart} id={s.id} name="start_date" defaultValue={s.start_date || ""} type="date" />
                  <TableCellInput action={updateStoryEnd} id={s.id} name="end_date" defaultValue={s.end_date || ""} type="date" placeholder="ongoing" />
                  <AxisToggle id={s.id} axis={s.axis} />
                </div>
              </div>
            ))}
          </>
        )}

        {threadRays.length > 0 && (
          <>
            <p className="board-lane-title">Fili</p>
            {threadRays.map((s) => (
              <div key={s.id} className="timeline-row">
                <div className="timeline-label">
                  <a href={`/story/${s.slug}`}>{s.title}</a>
                </div>
                <div className="timeline-track">
                  <div className="ray-dot" style={{ left: `${s.leftPct}%` }} title={`${s.start_date} → in corso`} />
                  <div className="ray-line" style={{ left: `${s.leftPct}%` }} />
                </div>
                <div className="timeline-dates">
                  <TableCellInput action={updateStoryStart} id={s.id} name="start_date" defaultValue={s.start_date || ""} type="date" />
                  <TableCellInput action={updateStoryEnd} id={s.id} name="end_date" defaultValue={s.end_date || ""} type="date" placeholder="ongoing" />
                  <AxisToggle id={s.id} axis={s.axis} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {undated.length > 0 && (
        <div className="content wide-content">
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            Undated ({undated.length})
          </h2>
          <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 12px" }}>
            No email data tied a start date to these. Set one to place them on the quarters and
            board above.
          </p>
          {undated.map((s) => (
            <div key={s.id} className="entry" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <a href={`/story/${s.slug}`}>
                  <strong>{s.title}</strong>
                </a>
              </div>
              <AxisToggle id={s.id} axis={s.axis} />
              <TableCellInput action={updateStoryStart} id={s.id} name="start_date" defaultValue="" type="date" placeholder="start date" />
            </div>
          ))}
        </div>
      )}

      <SavedToast />
    </>
  );
}
