import { notFound } from "next/navigation";
import { getStory, listStorySlugs } from "../../../lib/ledger";

export const dynamic = "force-static";

export function generateStaticParams() {
  return listStorySlugs().map((slug) => ({ slug }));
}

export default function StoryPage({ params }) {
  const story = getStory(params.slug);
  if (!story) notFound();
  return (
    <>
      <p style={{ marginBottom: 16 }}>
        <a href="/stories">&larr; All stories</a>
      </p>
      <article className="content" dangerouslySetInnerHTML={{ __html: story.html }} />
    </>
  );
}
