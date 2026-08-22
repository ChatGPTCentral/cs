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
              <a href="/timeline">Timeline</a>
              <a href="/network">Network</a>
              <a href="/people">People</a>
              <a href="/feedback">Feedback</a>
            </nav>
          </header>
          {children}
          <footer className="snapshot-note">
            Generated from the ledger&apos;s git-tracked markdown. Does not read Gmail live -
            refresh via <code>/ledger</code> in Claude Code, then redeploy.
            <br />
            Bug, correction, or something to add?{" "}
            <a href="/feedback">Drop a note &rarr;</a>{" "}
            it&apos;s read and actioned on the next refresh.
          </footer>
        </div>
      </body>
    </html>
  );
}
