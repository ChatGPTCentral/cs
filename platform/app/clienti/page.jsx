import { supabaseSelect } from "../../lib/supabase";
import { addDeal, updateDealField, confirmDeal } from "./actions";
import { updateStoryDomain, updateStoryLogoUrl } from "../story/actions";
import TableCellInput from "../people/TableCellInput";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";
import CompanyLogo from "./CompanyLogo";

export const dynamic = "force-dynamic";

const CHANNELS = ["Gmail", "Stripe", "Passionfroot", "LinkedIn", "Calendly", "Referral", "Altro"];

function fmt(amount, currency) {
  if (amount == null) return null;
  const sym = currency === "EUR" ? "€" : "$";
  return sym + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// The revenue ledger: every client and deal, what each one actually
// paid, with provenance, plus the channel each deal is currently being
// worked on (Gmail, Passionfroot, LinkedIn...) and the company's logo -
// no separate "logos" page, it lives here with the deal it belongs to.
// Confirmed = payment evidence on file (invoice paid, Stripe receipt,
// payout notification) or Alex's explicit word.
export default async function ClientiPage() {
  const [deals, storyRows] = await Promise.all([
    supabaseSelect("ledger_deals", "?order=paid_date.desc.nullslast"),
    supabaseSelect("ledger_stories", "?select=id,slug,domain,logo_url"),
  ]);
  const storyBySlug = new Map(storyRows.map((s) => [s.slug, s]));

  const byCompany = new Map();
  for (const d of deals) {
    if (!byCompany.has(d.company)) byCompany.set(d.company, []);
    byCompany.get(d.company).push(d);
  }
  const companies = [...byCompany.entries()]
    .map(([company, list]) => {
      const confirmedUsd = list
        .filter((d) => d.confirmed && d.amount != null && d.currency === "USD")
        .reduce((s, d) => s + Number(d.amount), 0);
      const hasUnknown = list.some((d) => d.amount == null);
      const slug = list.find((d) => d.story_slug)?.story_slug || null;
      const story = slug ? storyBySlug.get(slug) : null;
      return { company, list, confirmedUsd, hasUnknown, slug, story };
    })
    .sort((a, b) => b.confirmedUsd - a.confirmedUsd || a.company.localeCompare(b.company));

  const totalConfirmed = companies.reduce((s, c) => s + c.confirmedUsd, 0);
  const unknownCount = deals.filter((d) => d.amount == null).length;

  return (
    <>
      <div className="content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>
          Clienti e ricavi
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 8px" }}>
          Ogni pagamento con la sua fonte. Confermato = evidenza in archivio
          (fattura pagata, Stripe, payout) o parola tua. {unknownCount > 0 &&
          `${unknownCount} deal hanno un importo ancora da ricostruire - riempili inline.`}
        </p>
        <p style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
          ${totalConfirmed.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          <span style={{ fontSize: 13, fontWeight: 400, color: "var(--ink-faint)" }}> confermati (USD)</span>
        </p>
        <p style={{ fontSize: 12.5, margin: 0, color: "var(--ink-faint)" }}>
          Logo e canale si modificano qui sotto, per azienda e per deal.
        </p>
      </div>

      <datalist id="channels-clienti">
        {CHANNELS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      {companies.map(({ company, list, confirmedUsd, slug, story }) => (
        <div key={company} className="content" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <CompanyLogo src={story?.logo_url} name={company} size={24} />
            <h3 style={{ fontWeight: 600, fontSize: 16, margin: "4px 0" }}>
              {slug ? <a href={`/story/${slug}`}>{company}</a> : company}
            </h3>
            {confirmedUsd > 0 && (
              <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--accent)" }}>
                ${confirmedUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          {story && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", margin: "4px 0 8px" }}>
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>dominio</span>
              <TableCellInput
                action={updateStoryDomain}
                id={story.id}
                name="domain"
                defaultValue={story.domain || ""}
                placeholder="es. gamma.app"
              />
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>logo url</span>
              <TableCellInput
                action={updateStoryLogoUrl}
                id={story.id}
                name="logo_url"
                defaultValue={story.logo_url || ""}
                placeholder="https://... (override)"
              />
            </div>
          )}
          {list.map((d) => (
            <div key={d.id} className="entry" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", minWidth: 90 }}>
                {d.amount != null ? (
                  fmt(d.amount, d.currency)
                ) : (
                  <TableCellInput action={updateDealField} id={d.id} name="amount" defaultValue="" placeholder="importo?" />
                )}
              </span>
              <span className="entry-meta" style={{ margin: 0 }}>{d.paid_date || "data?"}</span>
              <TableCellInput
                action={updateDealField}
                id={d.id}
                name="channel"
                defaultValue={d.channel || ""}
                placeholder="canale?"
                listId="channels-clienti"
              />
              {d.confirmed ? (
                <span className="nba-chip" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>confermato</span>
              ) : (
                <form action={confirmDeal} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" className="mention-accept" title="Segna come confermato - la tua parola vale come evidenza">
                    conferma
                  </button>
                  <SaveWatcher />
                </form>
              )}
              <span style={{ fontSize: 12.5, color: "var(--ink-dim)", flex: 1, minWidth: 200 }}>
                {d.note} {d.source ? <em style={{ color: "var(--ink-faint)" }}>· {d.source}</em> : null}
              </span>
            </div>
          ))}
        </div>
      ))}

      <div className="content">
        <h3 style={{ fontWeight: 600, fontSize: 16, margin: "4px 0 8px" }}>Aggiungi un deal</h3>
        <form action={addDeal} className="crm-form">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input name="company" placeholder="azienda" required style={{ minWidth: 160 }} />
            <input name="amount" type="number" step="0.01" placeholder="importo" style={{ width: 110 }} />
            <select name="currency" defaultValue="USD">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <input name="paid_date" type="date" />
            <input name="channel" placeholder="canale" list="channels-clienti" style={{ width: 130 }} />
            <input name="story_slug" placeholder="slug storia (opzionale)" list="story-slugs-clienti" style={{ minWidth: 160 }} />
            <input name="note" placeholder="nota / cosa era" style={{ flex: 1, minWidth: 160 }} />
            <label style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <input type="checkbox" name="confirmed" /> confermato
            </label>
            <button type="submit">Aggiungi</button>
          </div>
          <SaveWatcher />
        </form>
      </div>

      <SavedToast />
    </>
  );
}
