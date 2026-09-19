import "./globals.css";
import { supabaseSelect } from "../lib/supabase";
import BrainRail from "./BrainRail";
import ShellTopBar from "./ShellTopBar";

export const metadata = {
  title: "Second brain",
  description: "Alex's correspondence stories - whose move it is, what's promised, what's gone cold.",
};

export default async function RootLayout({ children }) {
  const [pending, pendingLinks, stories, people, companies] = await Promise.all([
    supabaseSelect(
      "ledger_people",
      "?or=(pending_linkedin_url.not.is.null,pending_photo_url.not.is.null)&select=id"
    ),
    supabaseSelect("ledger_link_suggestions", "?status=eq.pending&select=id").catch(() => []),
    supabaseSelect("ledger_stories", "?select=slug").catch(() => []),
    supabaseSelect("ledger_people", "?archived=eq.false&select=id").catch(() => []),
    supabaseSelect("ledger_companies", "?select=id").catch(() => []),
  ]);

  const counts = {
    stories: stories.length,
    people: people.length,
    companies: companies.length,
    reviewPeople: pending.length,
    reviewLinks: pendingLinks.length,
  };

  return (
    <html lang="en">
      <head>
        {/* Sets the collapsed-sidebar class before hydration, from
            localStorage - otherwise a returning visitor who collapsed
            the rail sees it flash open on every load. See
            BrainRail.jsx's toggleRail for the other half. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('rail-collapsed')==='1')document.documentElement.classList.add('rail-collapsed')}catch(e){}",
          }}
        />
      </head>
      <body>
        <div className="shell">
          <BrainRail counts={counts} />
          <main className="shell-main">
            <ShellTopBar />
            <div className="page">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
