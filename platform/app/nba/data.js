import { supabaseSelect } from "../../lib/supabase";

// Shared fetch + shape for the unified backlog - one place both /nba
// and Today's 3-column layout read from, so "pending tasks" and
// "reminders" never drift into two different queries of the same data.
// Split out of nba/page.jsx 2026-09-19 when Today grew its own layout;
// grouping + pinning added the same day.
export async function getBacklogData() {
  const nowIso = new Date().toISOString();
  const [storiesWithAction, allStories, tasks, meetingPeople, instructions] = await Promise.all([
    supabaseSelect(
      "ledger_stories",
      "?select=id,slug,title,kind,next_action,next_action_date,pinned_today&or=(next_action.not.is.null,next_action_date.not.is.null)"
    ),
    // Title lookup only, for tagging a task with the story it belongs to.
    supabaseSelect("ledger_stories", "?select=slug,title"),
    // The same backlog the brief used to duplicate in prose - now the
    // one live source for every open task.
    supabaseSelect("ledger_tasks", "?status=eq.open&select=id,title,kind,story_slug,due_date,pinned_today"),
    supabaseSelect("ledger_people", "?archived=eq.false&select=id,name,identity"),
    // Latest free-text instruction per task or story, if any - see InstructionBox.
    supabaseSelect(
      "ledger_task_instructions",
      "?order=created_at.desc&select=task_id,story_slug,instruction,status,result,created_at,executed_at"
    ),
  ]);

  // Meetings today and meetings coming up later, fetched separately so
  // Today's agenda column and Reminders column each get the right slice
  // without re-filtering the same list twice.
  const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
  const [meetingsToday, meetingsUpcoming] = await Promise.all([
    supabaseSelect(
      "ledger_upcoming_meetings",
      `?start_time=gte.${nowIso}&start_time=lte.${todayEnd}&order=start_time.asc&select=event_id,title,start_time,attendees,story_slug,notes`
    ).catch(() => []),
    supabaseSelect(
      "ledger_upcoming_meetings",
      `?start_time=gt.${todayEnd}&order=start_time.asc&limit=15&select=event_id,title,start_time,attendees,story_slug,notes`
    ).catch(() => []),
  ]);

  const peopleByEmail = new Map(
    meetingPeople.filter((p) => p.identity).map((p) => [p.identity.toLowerCase(), p])
  );
  const storyTitleBySlug = new Map(allStories.map((s) => [s.slug, s.title]));

  const instructionsByTask = new Map();
  const instructionsByStory = new Map();
  for (const row of instructions) {
    if (row.task_id) {
      if (!instructionsByTask.has(row.task_id)) instructionsByTask.set(row.task_id, row);
    } else if (row.story_slug) {
      if (!instructionsByStory.has(row.story_slug)) instructionsByStory.set(row.story_slug, row);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const dueRank = (key) => key || "9999-99-99";

  function toRows(taskList, storyList) {
    return [
      ...taskList.map((t) => ({ type: "task", key: dueRank(t.due_date), title: t.title, data: t })),
      ...storyList.map((s) => ({
        type: "story",
        key: dueRank(s.next_action_date),
        title: s.title,
        data: s,
      })),
    ].sort((a, b) => a.key.localeCompare(b.key) || a.title.localeCompare(b.title));
  }

  // /nba's full reference list - everything, pinned or not, every kind.
  const allRows = toRows(tasks, storiesWithAction);

  // Today's agenda picks up anything pinned, task or story, regardless
  // of kind - "+ oggi" pulls it out of Pending/Reminders below.
  const pickedToday = toRows(
    tasks.filter((t) => t.pinned_today),
    storiesWithAction.filter((s) => s.pinned_today)
  );

  const reminderRows = toRows(
    tasks.filter((t) => t.kind === "reminder" && !t.pinned_today),
    []
  );

  // Pending tasks - everything else, grouped by category: per Alex,
  // 2026-09-19 ("group them by category"). Category is the story a task
  // is linked to (its own row leads the group), or "Generale" for
  // cross-cutting tasks with no story. Groups sort by their earliest due
  // date; "Generale" always last since it has no one deadline.
  const pendingTasks = tasks.filter((t) => t.kind !== "reminder" && !t.pinned_today);
  const pendingStories = storiesWithAction.filter((s) => !s.pinned_today);

  const groupsBySlug = new Map();
  for (const s of pendingStories) {
    groupsBySlug.set(s.slug, {
      key: `story:${s.slug}`,
      label: s.title,
      storySlug: s.slug,
      rows: toRows([], [s]),
    });
  }
  const generalTasks = [];
  for (const t of pendingTasks) {
    if (t.story_slug && groupsBySlug.has(t.story_slug)) {
      groupsBySlug.get(t.story_slug).rows.push(...toRows([t], []));
    } else if (t.story_slug && storyTitleBySlug.has(t.story_slug)) {
      // Story exists but has no live next_action of its own - still its
      // own group, led by its tasks alone.
      if (!groupsBySlug.has(t.story_slug)) {
        groupsBySlug.set(t.story_slug, {
          key: `story:${t.story_slug}`,
          label: storyTitleBySlug.get(t.story_slug),
          storySlug: t.story_slug,
          rows: [],
        });
      }
      groupsBySlug.get(t.story_slug).rows.push(...toRows([t], []));
    } else {
      generalTasks.push(t);
    }
  }
  // Within a group, tasks and decisions first, a story's own
  // next_action last - per Alex, 2026-09-19 ("prima le decision e i
  // task e poi le cose dove devo lavorare di piu, tipo stale deals").
  // A task is a crisp, checkable item; a story's next_action is more
  // often the slower chase (reviving a cold thread) - surfacing it
  // after the quick items keeps the group's top from being buried.
  const typeRank = (r) => (r.type === "task" ? 0 : 1);
  for (const g of groupsBySlug.values()) {
    g.rows.sort(
      (a, b) => typeRank(a) - typeRank(b) || a.key.localeCompare(b.key) || a.title.localeCompare(b.title)
    );
  }
  const pendingGroups = [...groupsBySlug.values()].sort(
    (a, b) => a.rows[0].key.localeCompare(b.rows[0].key) || a.label.localeCompare(b.label)
  );
  if (generalTasks.length > 0) {
    pendingGroups.push({ key: "general", label: "Generale", storySlug: null, rows: toRows(generalTasks, []) });
  }

  return {
    today,
    allRows,
    pickedToday,
    pendingGroups,
    pendingCount: pendingTasks.length + pendingStories.length,
    reminderRows,
    meetingsToday,
    meetingsUpcoming,
    peopleByEmail,
    storyTitleBySlug,
    instructionsByTask,
    instructionsByStory,
  };
}
