import { listStories } from "../../lib/ledger";
import { createStory } from "../story/actions";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";

export const dynamic = "force-dynamic";

export default function StoriesIndex() {
  const stories = listStories();
  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 22, margin: "0 0 16px" }}>
        All stories ({stories.length})
      </h1>

      <form action={createStory} className="crm-form" style={{ marginBottom: 20 }}>
        <label className="field-label" htmlFor="f-story-title">New story</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input id="f-story-title" name="title" placeholder="Story title" style={{ flex: 1, minWidth: 200 }} required />
          <input name="start_date" type="date" style={{ width: 160 }} />
          <button type="submit">Add story</button>
        </div>
        <SaveWatcher />
      </form>

      <div className="story-list">
        {stories.map((s) => (
          <a key={s.slug} href={`/story/${s.slug}`}>
            {s.title}
          </a>
        ))}
      </div>

      <SavedToast />
    </>
  );
}
