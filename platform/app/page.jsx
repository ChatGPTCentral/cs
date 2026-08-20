import { getIndexHtml } from "../lib/ledger";

export const dynamic = "force-static";

export default function BoardPage() {
  const html = getIndexHtml();
  return <article className="content" dangerouslySetInnerHTML={{ __html: html }} />;
}
