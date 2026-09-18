"use client";

import { useState, useTransition } from "react";
import { addBriefTask } from "./brief/lineActions";

// Adds a bullet straight into the brief itself, under a "## Added today"
// section it creates the first time this is used - not the same thing
// as NBA's AddTaskForm, which inserts into ledger_tasks instead.
export default function BriefAddTask({ briefId }) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const fd = new FormData();
    fd.set("briefId", briefId);
    fd.set("text", trimmed);
    startTransition(async () => {
      await addBriefTask(fd);
      setText("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        disabled={isPending}
        className="add-task-input"
      />
      <button type="submit" disabled={isPending || !text.trim()} className="add-task-btn">
        + Add task
      </button>
    </form>
  );
}
