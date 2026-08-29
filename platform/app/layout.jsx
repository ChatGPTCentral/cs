import "./globals.css";
import { supabaseSelect } from "../lib/supabase";

export const metadata = {
  title: "Inbox Ledger",
  description: "Alex's correspondence stories - whose move it is, what's promised, what's gone cold.",
};

export default async function RootLayout({ children }) {
  const pending = await supabaseSelect(
    "ledger_people",
    "?or=(pending_linkedin_url.not.is.null,pending_photo_url.not.is.null)&select=id"
  );

  return (
    <html lang="en">
      <body>
        <div className="page">
          <header className="top">
            <a className="wordmark" href="/">
              Inbox <em>Ledger</em>
            </a>
            <nav className="topnav">
              <a href="/">NBA</a>
              <a href="/genesis">Genesis</a>
              <a href="/stories">All stories</a>
              <a href="/network">Network</a>
              <a href="/people">People</a>
              <a href="/people/review">
                Review{pending.length > 0 ? ` (${pending.length})` : ""}
              </a>
              <a href="/settings">Settings</a>
            </nav>
          </header>
          {children}
          <footer className="snapshot-note">
            Generated from the ledger&apos;s git-tracked markdown plus the live
            Supabase registers. Does not read Gmail live - refresh via{" "}
            <code>/ledger</code> in Claude Code, then redeploy.
          </footer>
        </div>
      </body>
    </html>
  );
}
