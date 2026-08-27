"use client";

// A plain <select> instead of tab-pills like /people's list filter uses -
// there are ~10-20 lists (pills fit) but close to 100 stories (they
// wouldn't). Navigates on change, same URL-carries-state pattern as every
// other filter on this page.
//
// hrefsBySlug is a plain slug->href map built server-side (page.jsx), not a
// buildHref function: a Server Component can't pass a function prop to a
// Client Component (not serializable across the RSC boundary unless it's a
// "use server" action), which is exactly what broke /people in production
// on 2026-08-27 - buildHref used to be passed directly.
export default function StoryFilter({ stories, value, hrefsBySlug }) {
  return (
    <select
      value={value}
      onChange={(e) => {
        window.location.href = hrefsBySlug[e.target.value];
      }}
      style={{
        fontSize: 13,
        padding: "6px 10px",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        background: "var(--surface)",
        color: value ? "var(--ink)" : "var(--ink-faint)",
      }}
    >
      <option value="">Tutte le storie</option>
      {stories.map((s) => (
        <option key={s.slug} value={s.slug}>
          {s.title}
        </option>
      ))}
    </select>
  );
}
