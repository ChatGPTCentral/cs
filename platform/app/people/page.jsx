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
