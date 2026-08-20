import { getPeopleHtml } from "../../lib/ledger";

export const dynamic = "force-static";

export default function PeoplePage() {
  const html = getPeopleHtml();
  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        The graph &mdash; identity merges, the advocacy network, and Background
        (Alex-provided context on a person, kept separate from anything found
        in the mailbox).
        <br />
        Add or edit a person yourself, any time, no need to be in a chat:{" "}
        <a
          href="https://www.notion.so/f0bdabab729344efa13fc0d50098925f"
          target="_blank"
          rel="noopener"
        >
          Open the People database &rarr;
        </a>{" "}
        pulled in on the next <code>/ledger</code> refresh.
      </p>
      {html ? (
        <article className="content" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="content">
          <p>No graph/people.md found.</p>
        </div>
      )}
    </>
  );
}
