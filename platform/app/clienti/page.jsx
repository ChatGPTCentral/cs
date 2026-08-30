import { supabaseSelect } from "../../lib/supabase";
import {
  addDeal,
  updateDealField,
  confirmDeal,
  createCompany,
  updateCompanyField,
  updateCompanyDomain,
  updateCompanyLogoUrl,
} from "./actions";
import TableCellInput from "../people/TableCellInput";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";
import Avatar from "../people/Avatar";
import CompanyLogo from "./CompanyLogo";

export const dynamic = "force-dynamic";

const CHANNELS = ["Gmail", "Stripe", "Passionfroot (Alex)", "Alex", "Sunny", "LinkedIn", "Calendly", "Referral", "Altro"];
const RELATIONSHIPS = ["client", "prospect", "vendor", "partner", "multiplier"];
const ICP_FITS = ["good", "medium", "bad", "n/a"];

function fmt(amount, currency) {
  if (amount == null) return null;
  const sym = currency === "EUR" ? "€" : "$";
  return sym + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// Azienda-first CRM: one entity per company (ledger_companies), with its
// deals, its contacts, its logo, and where it sits (client / prospect /
// vendor / partner / multiplier, plus ICP fit for outbound). This is the
// "BDR mode" side of the CRM - the person-first side lives on /people,
// and a person can optionally point back at a company here.
export default async function ClientiPage() {
  const [companies, deals, people, storyRows, linkedinContacts] = await Promise.all([
    supabaseSelect("ledger_companies", "?order=name.asc"),
    supabaseSelect("ledger_deals", "?order=paid_date.desc.nullslast"),
    supabaseSelect("ledger_people", "?archived=eq.false&select=id,name,company_id,photo_url&order=name.asc"),
    supabaseSelect("ledger_stories", "?select=slug,title,company_id&company_id=not.is.null"),
    supabaseSelect("ledger_linkedin_connections", "?company_id=not.is.null&select=company_id,first_name,last_name,linkedin_url,position"),
  ]);

  const dealsByCompany = new Map();
  for (const d of deals) {
    const key = d.company_id || d.company;
    if (!dealsByCompany.has(key)) dealsByCompany.set(key, []);
    dealsByCompany.get(key).push(d);
  }
  const peopleByCompany = new Map();
  for (const p of people) {
    if (!p.company_id) continue;
    if (!peopleByCompany.has(p.company_id)) peopleByCompany.set(p.company_id, []);
    peopleByCompany.get(p.company_id).push(p);
  }
  const storyByCompany = new Map(storyRows.map((s) => [s.company_id, s]));
  const linkedinByCompany = new Map();
  for (const l of linkedinContacts) {
    if (!linkedinByCompany.has(l.company_id)) linkedinByCompany.set(l.company_id, []);
    linkedinByCompany.get(l.company_id).push(l);
  }

  const rows = companies
    .map((c) => {
      const list = dealsByCompany.get(c.id) || dealsByCompany.get(c.name) || [];
      const confirmedUsd = list
        .filter((d) => d.confirmed && d.amount != null && d.currency === "USD")
        .reduce((s, d) => s + Number(d.amount), 0);
      return {
        company: c,
        deals: list,
        contacts: peopleByCompany.get(c.id) || [],
        story: storyByCompany.get(c.id) || null,
        linkedinContacts: linkedinByCompany.get(c.id) || [],
        confirmedUsd,
      };
    })
    .sort((a, b) => b.confirmedUsd - a.confirmedUsd || a.company.name.localeCompare(b.company.name));

  const totalConfirmed = rows.reduce((s, r) => s + r.confirmedUsd, 0);
  const unknownCount = deals.filter((d) => d.amount == null).length;

  return (
    <>
      <div className="content" style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>
          Aziende
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 8px" }}>
          Ogni azienda con relazione, fit ICP, contatti e deal. Confermato =
          evidenza in archivio (fattura pagata, Stripe, payout) o parola tua.
          {unknownCount > 0 && ` ${unknownCount} deal hanno un importo ancora da ricostruire - riempili inline.`}
        </p>
        <p style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
          ${totalConfirmed.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          <span style={{ fontSize: 13, fontWeight: 400, color: "var(--ink-faint)" }}> confermati (USD)</span>
        </p>
      </div>

      <datalist id="channels-clienti">
        {CHANNELS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <datalist id="relationships-clienti">
        {RELATIONSHIPS.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>
      <datalist id="icp-fits-clienti">
        {ICP_FITS.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>
      <datalist id="company-names-clienti">
        {companies.map((c) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>

      {rows.map(({ company, deals, contacts, story, linkedinContacts, confirmedUsd }) => (
        <div key={company.id} id={`company-${company.id}`} className="content" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <CompanyLogo src={company.logo_url} name={company.name} size={24} />
            <h3 style={{ fontWeight: 600, fontSize: 16, margin: "4px 0" }}>
              {story ? <a href={`/story/${story.slug}`}>{company.name}</a> : company.name}
            </h3>
            {confirmedUsd > 0 && (
              <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--accent)" }}>
                ${confirmedUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", margin: "4px 0 8px" }}>
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>relazione</span>
            <TableCellInput
              action={updateCompanyField}
              id={company.id}
              name="relationship"
              defaultValue={company.relationship || ""}
              placeholder="client / prospect / vendor..."
              listId="relationships-clienti"
            />
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>fit ICP</span>
            <TableCellInput
              action={updateCompanyField}
              id={company.id}
              name="icp_fit"
              defaultValue={company.icp_fit || ""}
              placeholder="good / medium / bad"
              listId="icp-fits-clienti"
            />
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>dominio</span>
            <TableCellInput
              action={updateCompanyDomain}
              id={company.id}
              name="domain"
              defaultValue={company.domain || ""}
              placeholder="es. gamma.app"
            />
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>logo url</span>
            <TableCellInput
              action={updateCompanyLogoUrl}
              id={company.id}
              name="logo_url"
              defaultValue={company.logo_url || ""}
              placeholder="https://... (override)"
            />
          </div>

          {contacts.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "0 0 8px" }}>
              <span className="field-label">Contatti</span>
              <div className="genesis-people-links">
                {contacts.map((p) => (
                  <a key={p.id} href={`/people/${p.id}`} className="genesis-person-chip">
                    <Avatar name={p.name} photoUrl={p.photo_url} size={18} />
                    {p.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {linkedinContacts.length > 0 && (
            <p style={{ fontSize: 12.5, margin: "0 0 8px", color: "var(--ink-dim)" }}>
              <span className="field-label">Conoscenze LinkedIn</span>{" "}
              {linkedinContacts.map((l, i) => (
                <span key={l.linkedin_url}>
                  {i > 0 && ", "}
                  <a href={l.linkedin_url} target="_blank" rel="noopener">
                    {l.first_name} {l.last_name}
                  </a>
                  {l.position ? ` (${l.position})` : ""}
                </span>
              ))}
            </p>
          )}

          {deals.map((d) => (
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

      <div className="content" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 600, fontSize: 16, margin: "4px 0 8px" }}>Aggiungi un'azienda</h3>
        <p style={{ fontSize: 12.5, color: "var(--ink-faint)", margin: "0 0 8px" }}>
          Per registrare un prospect prima ancora di un deal - modalità BDR.
        </p>
        <form action={createCompany} className="crm-form">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input name="name" placeholder="azienda" required style={{ minWidth: 160 }} />
            <input name="domain" placeholder="dominio (opzionale)" style={{ minWidth: 140 }} />
            <input name="relationship" placeholder="relazione" list="relationships-clienti" defaultValue="prospect" style={{ width: 130 }} />
            <input name="icp_fit" placeholder="fit ICP" list="icp-fits-clienti" style={{ width: 110 }} />
            <button type="submit">Aggiungi</button>
          </div>
          <SaveWatcher />
        </form>
      </div>

      <div className="content">
        <h3 style={{ fontWeight: 600, fontSize: 16, margin: "4px 0 8px" }}>Aggiungi un deal</h3>
        <form action={addDeal} className="crm-form">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input name="company" placeholder="azienda" list="company-names-clienti" required style={{ minWidth: 160 }} />
            <input name="amount" type="number" step="0.01" placeholder="importo" style={{ width: 110 }} />
            <select name="currency" defaultValue="USD">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <input name="paid_date" type="date" />
            <input name="channel" placeholder="canale" list="channels-clienti" style={{ width: 130 }} />
            <input name="story_slug" placeholder="slug storia (opzionale)" style={{ minWidth: 160 }} />
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
