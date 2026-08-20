import "./globals.css";

export const metadata = {
  title: "Inbox Ledger",
  description: "Alex's correspondence stories - whose move it is, what's promised, what's gone cold.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <header className="top">
            <a className="wordmark" href="/">
              Inbox <em>Ledger</em>
            </a>
            <nav className="topnav">
              <a href="/">Today</a>
              <a href="/board">Full board</a>
              <a href="/stories">All stories</a>
            </nav>
          </header>
          {children}
          <footer className="snapshot-note">
            Generated from the ledger&apos;s git-tracked markdown. Does not read Gmail live -
            refresh via <code>/ledger</code> in Claude Code, then redeploy.
            <br />
            Bug, correction, or something to add?{" "}
            <a
              href="https://www.notion.so/3fb46159954c470aaa774c3820e64f64"
              target="_blank"
              rel="noopener"
            >
              Drop a note in Ledger Feedback &rarr;
            </a>{" "}
            it&apos;s read and actioned on the next refresh.
          </footer>
        </div>
      </body>
    </html>
  );
}
