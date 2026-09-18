"use client";

import { useState, useTransition } from "react";
import { addTask } from "./actions";

// Minimal quick-add for a task that just came up - title only. Clears
// itself and stays focused after each add so a few in a row is fast.
export default function AddTaskForm() {
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const fd = new FormData();
    fd.set("title", trimmed);
    startTransition(async () => {
      await addTask(fd);
      setTitle("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task..."
        disabled={isPending}
        className="add-task-input"
      />
      <button type="submit" disabled={isPending || !title.trim()} className="add-task-btn">
        + Add task
      </button>
    </form>
  );
}
