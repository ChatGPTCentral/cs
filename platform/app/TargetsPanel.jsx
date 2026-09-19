import { supabaseRpc } from "../lib/supabase";
import { quizSupabaseRpc } from "../lib/quizSupabase";

// Live monthly targets - added 2026-09-19, per Alex, after the "Current"
// figures baked as static text into the brief went stale within the same
// day (worse: the revenue number was briefly wrong by exactly €10,000,
// a self-transfer between AI Central's own accounts that got correctly
// reclassified as `is_transfer` after the brief text was already
// written). Queried fresh on every load instead of once at brief
// generation time - same "one live source, not a snapshot" rule as
// everything else Today.
//
// Targets themselves are fixed for the month (see roadmap.md, "Targets,
// per Alex, 2026-09-12") - only the "Current" side is live.
//
// Both figures come from tables with real row-level security
// (bank_transactions, trial_ledger - neither grants anon/publishable
// direct read access, on purpose). Rather than weaken that, each side
// got a SECURITY DEFINER Postgres function that hands back exactly one
// aggregate number - targets_revenue_mtd() / trials_mtd_count() - so the
// publishable key this app already uses everywhere else still works
// here, with no new row-level data exposed. See the migrations
// "targets_revenue_mtd_rpc" / "trials_mtd_rpc", 2026-09-19.
const TARGETS = { revenue: 15000, trials: 150 };

async function getRevenueMTD() {
  const value = await supabaseRpc("targets_revenue_mtd").catch(() => null);
  return value == null ? null : Number(value);
}

async function getTrialsMTD() {
  const value = await quizSupabaseRpc("trials_mtd_count").catch(() => null);
  return value == null ? null : Number(value);
}

export default async function TargetsPanel() {
  const [revenue, trials] = await Promise.all([getRevenueMTD(), getTrialsMTD()]);

  return (
    <div className="targets-panel">
      <div className="today-col-header">September&apos;s Targets</div>
      <div className="targets-row">
        <span className="targets-label">Revenue</span>
        <span className="targets-value">
          ${TARGETS.revenue.toLocaleString("en-US")}{" "}
          <span className="targets-current">
            (Current:{" "}
            {revenue == null
              ? "dato non disponibile ora"
              : `€${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR, non convertito - target in $`}
            )
          </span>
        </span>
      </div>
      <div className="targets-row">
        <span className="targets-label">AI Library Trials</span>
        <span className="targets-value">
          {TARGETS.trials}{" "}
          <span className="targets-current">
            (Current: {trials == null ? "dato non disponibile ora" : `${trials}, gross, month-to-date`})
          </span>
        </span>
      </div>
    </div>
  );
}
