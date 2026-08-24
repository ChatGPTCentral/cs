import { notFound } from "next/navigation";
import { getSkillHtml } from "../../lib/skills";

export const dynamic = "force-static";

export default function ThinkingApproachPage() {
  const html = getSkillHtml("alex-thinking-approach");
  if (!html) notFound();
  return <article className="content" dangerouslySetInnerHTML={{ __html: html }} />;
}
