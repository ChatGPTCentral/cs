import { notFound } from "next/navigation";
import { getDataPageHtml } from "../../lib/skills";

export const dynamic = "force-static";

export default function GenesisPage() {
  const html = getDataPageHtml("genesis-timeline-it");
  if (!html) notFound();
  return <article className="content" dangerouslySetInnerHTML={{ __html: html }} />;
}
