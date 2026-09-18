import { supabaseSelect } from "../../lib/supabase";
import { DEAL_STAGES } from "./stages";
import StageSelect from "./StageSelect";
import SavedToast from "../people/SavedToast";

export const dynamic = "force-dynamic";

const COLUMN = {
  waiting: { title: "Waiting on their reply", note: "Ball's on them - nothing to do until they answer." },
  decision: { title: "Needs your call", note: "Ball's on you - a reply or a decision moves it." },
  blocked: { title: "Blocked - missing info", note: "Can't re-approach until this is found." },
  dormant: { title: "Dormant - needs a new angle", note: "Real leads, gone quiet - revive with something new." },
  affiliate: { title: "Affiliate programs", note: "Joining/running a program, not selling a placement." },
};

function DealCard({ item, today }) {
  const overdue = item.next_action_date && item.next_action_date < today;
  return (
    <div className="deals-card">
      <a href={`/story/${item.slug}`} className="deals-card-title">
        {item.title}
      </a>
      {item.next_action && <p className="deals-card-action">{item.next_action}</p>}
      <div className="deals-card-foot">
        <div className="deals-card-tags">
          {item.deal_value && <span className="deals-pill deals-pill-money">{item.deal_value}</span>}
          {overdue && <span className="deals-pill deals-pill-overdue">overdue since {item.next_action_date}</span>}
        </div>
        <StageSelect id={item.id} stage={item.deal_stage} />
      </div>
    </div>
  );
}

export default async function DealsPage() {
  const rows = await supabaseSelect(
    "ledger_stories",
    "?deal_stage=not.is.null&select=id,slug,title,next_action,next_action_date,deal_stage,deal_value&order=title"
  );
  const today = new Date().toISOString().slice(0, 10);

  const byStage = new Map(DEAL_STAGES.map((s) => [s, []]));
  for (const r of rows) {
    if (byStage.has(r.deal_stage)) byStage.get(r.deal_stage).push(r);
  }

  const knownValue = rows.reduce((sum, r) => {
    const m = (r.deal_value || "").match(/\$([\d,]+)/);
    return m ? sum + parseInt(m[1].replace(/,/g, ""), 10) : sum;
  }, 0);

  return (
    <div className="wide-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: 0, maxWidth: "60ch" }}>
          Every open sales conversation on file. Move a card between columns with its dropdown -
          that's the only thing this page writes back to <code>ledger_stories</code>.
        </p>
        <div style={{ display: "flex", gap: 18, fontFamily: "'IBM Plex Mono', monospace", textAlign: "right" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{rows.length}</div>
            <div style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".04em" }}>open deals</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>${knownValue.toLocaleString("en-US")}+</div>
            <div style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".04em" }}>known value</div>
          </div>
        </div>
      </div>

      <div className="deals-board">
        {DEAL_STAGES.map((stage) => {
          const items = byStage.get(stage);
          const col = COLUMN[stage];
          return (
            <div key={stage} className="deals-col">
              <div className="deals-col-head">
                <div>
                  <h2>{col.title}</h2>
                  <p>{col.note}</p>
                </div>
                <span className="deals-col-count">{items.length}</span>
              </div>
              <div className="deals-cards">
                {items.length === 0 && <p className="deals-empty">Niente qui per ora.</p>}
                {items.map((item) => (
                  <DealCard key={item.id} item={item} today={today} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <SavedToast />
    </div>
  );
}
