import { notFound } from "next/navigation";
import { getSkillHtml } from "../../lib/skills";

export const dynamic = "force-static";

export default function WritingStylePage() {
  const html = getSkillHtml("alex-writing-style");
  if (!html) notFound();
  return <article className="content" dangerouslySetInnerHTML={{ __html: html }} />;
}
