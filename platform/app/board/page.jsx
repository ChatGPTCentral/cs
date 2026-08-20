import { getIndexHtml } from "../../lib/ledger";

export const dynamic = "force-static";

export default function BoardPage() {
  const html = getIndexHtml();
  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        The full board &mdash; every register, including reference material
        that isn&apos;t a daily action item. For just what needs doing, see{" "}
        <a href="/">Today</a>.
      </p>
      <article className="content" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
