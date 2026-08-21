import { supabaseSelect } from "../../lib/supabase";
import { createStory, updateStoryStart, updateStoryEnd, updateQuarterSummary } from "./actions";
import TableCellInput from "../people/TableCellInput";
import SavedToast from "../people/SavedToast";

export const dynamic = "force-dynamic";

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function TimelinePage() {
  const [stories, quarters] = await Promise.all([
    supabaseSelect("ledger_stories", "?order=start_date.asc.nullslast,title.asc"),
    supabaseSelect("ledger_quarters", "?order=quarter.asc"),
  ]);

  const dated = stories.filter((s) => s.start_date);
  const undated = stories.filter((s) => !s.start_date);

  const today = new Date();
  const rangeStart = dated.length > 0 ? new Date(dated[0].start_date) : today;
  const latestEnd = dated.reduce((max, s) => {
    const end = s.end_date ? new Date(s.end_date) : today;
    return end > max ? end : max;
  }, today);
  const totalDays = Math.max(daysBetween(rangeStart, latestEnd), 1);

  const bars = dated.map((s) => {
    const start = new Date(s.start_date);
    const end = s.end_date ? new Date(s.end_date) : today;
    const leftPct = (daysBetween(rangeStart, start) / totalDays) * 100;
    const widthPct = Math.max((daysBetween(start, end) / totalDays) * 100, 1.2);
    return { ...s, leftPct, widthPct, ongoing: !s.end_date };
  });

  return (
    <>
      {quarters.length > 0 && (
        <div className="content wide-content" style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            History, by quarter
          </h2>
          <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 16px" }}>
            Reconstructed from the email log - real thread counts and story activity per quarter,
            not invented. Click into a summary to edit it.
          </p>
          {quarters.map((q) => (
            <div key={q.id} className="entry">
              <div className="field-label" style={{ marginBottom: 4 }}>{q.quarter}</div>
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
          ))}
        </div>
      )}

      <div className="content wide-content" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            {stories.length} {stories.length === 1 ? "story" : "stories"} - the history of AI Central
          </h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 16px" }}>
          Every story's start and (if it has one) end date, together. A story with no end date is
          still open - its bar runs to today with a dashed edge. Dates came from the earliest and
          latest real email tied to each story where that data exists; the rest are unset - add
          them below and a story moves onto the timeline on the next load.
        </p>

        <form action={createStory} className="crm-form" style={{ marginBottom: 20 }}>
          <label className="field-label" htmlFor="f-story-title">New story</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input id="f-story-title" name="title" placeholder="Story title" style={{ flex: 1, minWidth: 200 }} required />
            <input name="start_date" type="date" style={{ width: 160 }} />
            <button type="submit">Add story</button>
          </div>
        </form>

        {bars.length === 0 && <p style={{ color: "var(--ink-faint)" }}>No dated stories yet.</p>}

        {bars.length > 0 && (
          <div className="timeline-scale">
            <span>{rangeStart.toISOString().slice(0, 10)}</span>
            <span>{latestEnd.toISOString().slice(0, 10)}</span>
          </div>
        )}

        {bars.map((s) => (
          <div key={s.id} className="timeline-row">
            <div className="timeline-label">
              <a href={`/story/${s.slug}`}>{s.title}</a>
            </div>
            <div className="timeline-track">
              <div
                className={`timeline-bar${s.ongoing ? " timeline-bar-ongoing" : ""}`}
                style={{ left: `${s.leftPct}%`, width: `${s.widthPct}%` }}
                title={`${s.start_date} → ${s.end_date || "ongoing"}`}
              />
            </div>
            <div className="timeline-dates">
              <TableCellInput action={updateStoryStart} id={s.id} name="start_date" defaultValue={s.start_date || ""} type="date" />
              <TableCellInput action={updateStoryEnd} id={s.id} name="end_date" defaultValue={s.end_date || ""} type="date" placeholder="ongoing" />
            </div>
          </div>
        ))}
      </div>

      {undated.length > 0 && (
        <div className="content wide-content">
          <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>
            Undated ({undated.length})
          </h2>
          <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 12px" }}>
            No email data tied a start date to these. Set one to place them on the timeline above.
          </p>
          {undated.map((s) => (
            <div key={s.id} className="entry" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <a href={`/story/${s.slug}`}>
                  <strong>{s.title}</strong>
                </a>
              </div>
              <TableCellInput action={updateStoryStart} id={s.id} name="start_date" defaultValue="" type="date" placeholder="start date" />
            </div>
          ))}
        </div>
      )}

      <SavedToast />
    </>
  );
}
