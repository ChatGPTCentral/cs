import { supabaseSelect } from "../../lib/supabase";

// Shared fetch + shape for the unified backlog - one place both /nba
// and Today's 3-column layout read from, so "pending tasks" and
// "reminders" never drift into two different queries of the same data.
// Split out of nba/page.jsx 2026-09-19 when Today grew its own layout.
export async function getBacklogData() {
  const nowIso = new Date().toISOString();
  const [storiesWithAction, allStories, tasks, meetingPeople, instructions] = await Promise.all([
    supabaseSelect(
      "ledger_stories",
      "?select=id,slug,title,kind,next_action,next_action_date&or=(next_action.not.is.null,next_action_date.not.is.null)"
    ),
    // Title lookup only, for tagging a task with the story it belongs to.
    supabaseSelect("ledger_stories", "?select=slug,title"),
    // The same backlog the brief used to duplicate in prose - now the
    // one live source for every open task.
    supabaseSelect("ledger_tasks", "?status=eq.open&select=id,title,kind,story_slug,due_date"),
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

  // Every task and every story action, as one shape, sorted by due date
  // (undated last). Split into "reminder"-kind tasks vs everything else
  // downstream - kept together here so both /nba (the full list) and
  // Today (split into columns) build off one sort.
  const reminderTasks = tasks.filter((t) => t.kind === "reminder");
  const otherTasks = tasks.filter((t) => t.kind !== "reminder");

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

  return {
    today,
    allRows: toRows(tasks, storiesWithAction),
    pendingRows: toRows(otherTasks, storiesWithAction),
    reminderRows: toRows(reminderTasks, []),
    meetingsToday,
    meetingsUpcoming,
    peopleByEmail,
    storyTitleBySlug,
    instructionsByTask,
    instructionsByStory,
  };
}
