import { notFound } from "next/navigation";
import { getSkillHtml } from "../../lib/skills";

export const dynamic = "force-static";

export default function GenesisPage() {
  const html = getSkillHtml("ai-central-genesis");
  if (!html) notFound();
  return <article className="content" dangerouslySetInnerHTML={{ __html: html }} />;
}
