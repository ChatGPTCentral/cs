import { listStories } from "../../lib/ledger";

export const dynamic = "force-static";

export default function StoriesIndex() {
  const stories = listStories();
  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 22, margin: "0 0 16px" }}>
        All stories ({stories.length})
      </h1>
      <div className="story-list">
        {stories.map((s) => (
          <a key={s.slug} href={`/story/${s.slug}`}>
            {s.title}
          </a>
        ))}
      </div>
    </>
  );
}
