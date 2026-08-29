export const dynamic = "force-static";

// Reference material that used to crowd the top nav - Alex's call,
// 2026-08-29: writing style and thinking/approach are settings-grade
// pages, not daily surfaces; the old board views live on as archive.
export default function SettingsPage() {
  return (
    <div className="content">
      <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 14px" }}>Impostazioni</h2>

      <p className="field-label" style={{ marginBottom: 6 }}>Come scrive e ragiona Alex</p>
      <div className="story-list" style={{ marginBottom: 20 }}>
        <a href="/writing-style">Writing style</a>
        <a href="/thinking-approach">Thinking &amp; approach</a>
      </div>

      <p className="field-label" style={{ marginBottom: 6 }}>Archivio</p>
      <div className="story-list" style={{ marginBottom: 8 }}>
        <a href="/board">Full board (vista storica del ledger)</a>
        <a href="/timeline">Timeline (vista precedente a Genesis)</a>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-faint)", margin: 0 }}>
        Viste sostituite da NBA e Genesis - restano leggibili qui, non si
        aggiornano piu di quanto faccia il ledger stesso.
      </p>
    </div>
  );
}
