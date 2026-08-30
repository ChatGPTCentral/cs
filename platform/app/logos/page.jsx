import { supabaseSelect } from "../../lib/supabase";
import { updateStoryDomain, updateStoryLogoUrl } from "../story/actions";
import TableCellInput from "../people/TableCellInput";
import CompanyLogo from "../clienti/CompanyLogo";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";

export const dynamic = "force-dynamic";

// The logo table: one row per company-story. Fill "dominio" and the app
// derives a logo automatically via Clearbit's public keyless CDN
// (https://logo.clearbit.com/{domain}) - no API key, no account. If a
// company isn't on it, or the guess is wrong, override "logo url"
// directly. Both fields save on blur, live preview updates immediately.
export default async function LogosPage() {
  const [dealCompanies, stories] = await Promise.all([
    supabaseSelect("ledger_deals", "?select=story_slug&story_slug=not.is.null"),
    supabaseSelect(
      "ledger_stories",
      "?select=id,slug,title,kind,domain,logo_url&order=title.asc"
    ),
  ]);

  const dealSlugs = new Set(dealCompanies.map((d) => d.story_slug));
  const relevant = stories.filter(
    (s) => s.kind === "sale" || dealSlugs.has(s.slug) || s.domain || s.logo_url
  );
  const missing = relevant.filter((s) => !s.logo_url).length;

  return (
    <>
      <div className="content" style={{ marginBottom: 16 }}>
        <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 4px" }}>
          Loghi aziende
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: 0 }}>
          Scrivi il dominio e il logo si popola da solo (CDN pubblico,
          nessuna chiave). Se manca o è sbagliato, sovrascrivi &quot;logo
          url&quot; a mano - vince sempre quello. {missing > 0 && `${missing} senza logo ancora.`}
        </p>
      </div>

      <div className="content" style={{ overflowX: "auto" }}>
        <table className="people-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Azienda</th>
              <th>Dominio</th>
              <th>Logo URL (override)</th>
            </tr>
          </thead>
          <tbody>
            {relevant.map((s) => (
              <tr key={s.id}>
                <td>
                  <CompanyLogo src={s.logo_url} name={s.title} size={28} />
                </td>
                <td>
                  <a href={`/story/${s.slug}`}>{s.title}</a>
                </td>
                <td>
                  <TableCellInput
                    action={updateStoryDomain}
                    id={s.id}
                    name="domain"
                    defaultValue={s.domain || ""}
                    placeholder="es. gamma.app"
                  />
                </td>
                <td>
                  <TableCellInput
                    action={updateStoryLogoUrl}
                    id={s.id}
                    name="logo_url"
                    defaultValue={s.logo_url || ""}
                    placeholder="https://..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SavedToast />
    </>
  );
}
