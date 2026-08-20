import { getTodaySections } from "../lib/ledger";

export const dynamic = "force-static";

export default function TodayPage() {
  const sections = getTodaySections();

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Today &mdash; the three sections that need action from Alex. Everything
        else (waiting on them, proposed, below-threshold, anomalies, graph,
        coverage) lives on the{" "}
        <a href="/board">full board</a>.
      </p>
      {sections.length === 0 && (
        <div className="content">
          <p>Nothing here yet &mdash; check the full board.</p>
        </div>
      )}
      {sections.map((s) => (
        <section key={s.slug} className="content" style={{ marginBottom: 20 }}>
          <div
            dangerouslySetInnerHTML={{ __html: s.html }}
          />
        </section>
      ))}
    </>
  );
}
