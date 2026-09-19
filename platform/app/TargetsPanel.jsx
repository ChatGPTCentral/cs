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
// per Alex, 2026-09-12" and "Expenses target" below) - only "Current" is
// live. Display is deliberately bare - "current / benchmark", no
// parenthetical notes - per Alex, 2026-09-19.
//
// Revenue and Expenses come from bank_transactions, which sits behind
// real row-level security (is_member() only), and are converted EUR ->
// USD (the source ledger is EUR, the targets are stated in $) - both
// the RLS bypass and the conversion happen inside a SECURITY DEFINER
// Postgres function, targets_revenue_mtd() / targets_expenses_mtd(),
// which hands back one converted number, never a row. Conversion
// direction was verified empirically against real bank_transactions
// rows (amount_eur = amount * fx_rate for a non-EUR row), not assumed.
// Trials comes from trial_ledger (same RLS shape) via trials_mtd_count().
// See migrations "targets_revenue_expenses_usd" / "trials_mtd_rpc".
//
// Expenses benchmark changed $10,000 -> $8,000, 2026-09-19, per Alex.
const TARGETS = { revenue: 15000, trials: 150, expenses: 8000 };

async function getRevenueMTD() {
  const value = await supabaseRpc("targets_revenue_mtd").catch(() => null);
  return value == null ? null : Number(value);
}

async function getExpensesMTD() {
  const value = await supabaseRpc("targets_expenses_mtd").catch(() => null);
  return value == null ? null : Number(value);
}

async function getTrialsMTD() {
  const value = await quizSupabaseRpc("trials_mtd_count").catch(() => null);
  return value == null ? null : Number(value);
}

// Per-category breakdown for the Revenue/Expenses hover, added
// 2026-09-19, per Alex. Same bank_transactions/categories/fx_rates
// SECURITY DEFINER shape as the totals above - see
// targets_revenue_breakdown_mtd() / targets_expenses_breakdown_mtd().
async function getRevenueBreakdown() {
  const rows = await supabaseRpc("targets_revenue_breakdown_mtd").catch(() => []);
  return Array.isArray(rows) ? rows : [];
}

async function getExpensesBreakdown() {
  const rows = await supabaseRpc("targets_expenses_breakdown_mtd").catch(() => []);
  return Array.isArray(rows) ? rows : [];
}

function usd(n) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

// Colors the "current" figure - red/green per Alex, 2026-09-19: revenue
// red under benchmark (missing the target is bad), expenses green under
// benchmark (spending less is good). `direction` names which side of
// the benchmark is good; a row with no direction (Trials) stays plain.
function currentClass(current, benchmark, direction) {
  if (current == null || !direction) return "";
  const good = direction === "higher-better" ? current >= benchmark : current <= benchmark;
  return good ? "targets-current-good" : "targets-current-bad";
}

// Pure-CSS hover popup (:hover reveals .targets-tooltip) - no client
// component needed just to show a breakdown on hover. `breakdown` is
// [{category, usd}], already sorted highest-first by the RPC.
function TargetRow({ label, current, benchmark, format, direction, breakdown }) {
  const valueNode = (
    <span className={currentClass(current, benchmark, direction)}>
      {current == null ? "—" : format(current)}
    </span>
  );
  return (
    <div className="targets-row">
      <span className="targets-label">{label}</span>
      <span className="targets-value">
        {breakdown && breakdown.length > 0 ? (
          <span className="targets-hover">
            {valueNode}
            <span className="targets-tooltip">
              {breakdown.map((b) => (
                <span className="targets-tooltip-row" key={b.category}>
                  <span>{b.category}</span>
                  <span>{usd(b.usd)}</span>
                </span>
              ))}
            </span>
          </span>
        ) : (
          valueNode
        )}{" "}
        / {format(benchmark)}
      </span>
    </div>
  );
}

export default async function TargetsPanel() {
  const [revenue, expenses, trials, revenueBreakdown, expensesBreakdown] = await Promise.all([
    getRevenueMTD(),
    getExpensesMTD(),
    getTrialsMTD(),
    getRevenueBreakdown(),
    getExpensesBreakdown(),
  ]);

  return (
    <div className="targets-panel">
      <div className="today-col-header">September&apos;s Targets</div>
      <TargetRow
        label="Revenue"
        current={revenue}
        benchmark={TARGETS.revenue}
        format={usd}
        direction="higher-better"
        breakdown={revenueBreakdown}
      />
      <TargetRow
        label="Expenses"
        current={expenses}
        benchmark={TARGETS.expenses}
        format={usd}
        direction="lower-better"
        breakdown={expensesBreakdown}
      />
      <TargetRow
        label="AI Library Trials"
        current={trials}
        benchmark={TARGETS.trials}
        format={(n) => n.toLocaleString("en-US")}
      />
    </div>
  );
}
