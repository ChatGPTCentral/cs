"use client";

import { useState, useTransition } from "react";
import { sendInstruction } from "./actions";

const STATUS_LABEL = {
  pending: "in coda, verrà eseguita a breve",
  failed: "non riuscita - vedi sotto",
  done: "fatta",
};

// A free-text instruction box for a task (or a story's own next-action)
// that isn't a simple done/drop - e.g. "Nicola at Prime Tech PR ghosted
// me, put a reminder on my calendar for mid next week" instead of a
// checkbox. Pass either `taskId` (a ledger_tasks row) or `storySlug` (a
// story with only a next_action, no separate task row). `latest` is the
// most recent ledger_task_instructions row for this target, fetched by
// the parent page (one query for everything, not one per row). Added
// 2026-09-19, per Alex.
export default function InstructionBox({ taskId, storySlug, latest }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  const showStatus =
    latest &&
    (latest.status !== "done" ||
      Date.now() - new Date(latest.executed_at || latest.created_at).getTime() < 24 * 3600 * 1000);

  if (showStatus) {
    return (
      <div className="instruction-status">
        <p>&ldquo;{latest.instruction}&rdquo; - {STATUS_LABEL[latest.status] || latest.status}</p>
        {latest.result && <p className="instruction-result">{latest.result}</p>}
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="instruction-toggle" onClick={() => setOpen(true)}>
        + istruzione
      </button>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const fd = new FormData();
    if (taskId) fd.set("task_id", taskId);
    if (storySlug) fd.set("story_slug", storySlug);
    fd.set("instruction", trimmed);
    startTransition(async () => {
      await sendInstruction(fd);
      setText("");
      setOpen(false);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="instruction-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='es. "metti un reminder sul calendario per mid next week"'
        rows={2}
        disabled={isPending}
        autoFocus
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={isPending || !text.trim()}>
          Invia
        </button>
        <button type="button" onClick={() => setOpen(false)} disabled={isPending}>
          Annulla
        </button>
      </div>
    </form>
  );
}
