import { listStories } from "../../lib/ledger";
import { createStory } from "../story/actions";
import { supabaseSelect } from "../../lib/supabase";
import SaveWatcher from "../people/SaveWatcher";
import SavedToast from "../people/SavedToast";

export const dynamic = "force-dynamic";

export default async function StoriesIndex() {
  const [stories, storyRows] = await Promise.all([
    Promise.resolve(listStories()),
    supabaseSelect("ledger_stories", "?select=slug,start_date"),
  ]);

  const startDateBySlug = new Map(storyRows.map((s) => [s.slug, s.start_date]));
  const dated = [];
  const undated = [];
  for (const s of stories) {
    const startDate = startDateBySlug.get(s.slug) || null;
    (startDate ? dated : undated).push({ ...s, startDate });
  }
  dated.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));

  const yearGroups = new Map();
  for (const s of dated) {
    const year = s.startDate.slice(0, 4);
    if (!yearGroups.has(year)) yearGroups.set(year, []);
    yearGroups.get(year).push(s);
  }

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

      {[...yearGroups.entries()].map(([year, items]) => (
        <div key={year} style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 15, color: "var(--ink-faint)", margin: "0 0 8px" }}>
            {year}
          </h2>
          <div className="story-list">
            {items.map((s) => (
              <a key={s.slug} href={`/story/${s.slug}`}>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      ))}

      {undated.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: 15, color: "var(--ink-faint)", margin: "0 0 8px" }}>
            Senza data ({undated.length})
          </h2>
          <div className="story-list">
            {undated.map((s) => (
              <a key={s.slug} href={`/story/${s.slug}`}>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}

      <SavedToast />
    </>
  );
}
