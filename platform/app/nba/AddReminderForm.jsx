"use client";

import { useState, useTransition } from "react";
import { addReminder } from "./actions";

// Same quick-add as AddTaskForm, kind="reminder" - added 2026-09-19,
// per Alex, at the top of the Reminders/Next milestones column.
export default function AddReminderForm() {
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const fd = new FormData();
    fd.set("title", trimmed);
    startTransition(async () => {
      await addReminder(fd);
      setTitle("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a reminder..."
        disabled={isPending}
        className="add-task-input"
      />
      <button type="submit" disabled={isPending || !title.trim()} className="add-task-btn">
        + Add reminder
      </button>
    </form>
  );
}
