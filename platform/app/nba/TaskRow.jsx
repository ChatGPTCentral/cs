"use client";

import { useRef, useState, useTransition } from "react";
import { setTaskStatus, updateTaskTitle, setTaskPinnedToday } from "./actions";

// One task line, everywhere a task appears (the cross-cutting list and
// the tasks nested under a story) - a check to mark it done, an x to
// drop it, a pencil to rename it in place. No Save button: each click
// submits its own tiny form immediately, same "no visible save needed"
// spirit as TableCellInput. `pinned` + `showPin` add a 4th button -
// "+ oggi" to pull a task into Today's agenda, or "− oggi" to send it
// back - added 2026-09-19, per Alex.
export default function TaskRow({ id, title, kind, dueNote, urgent, pinned = false, showPin = true }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [isPending, startTransition] = useTransition();
  const editFormRef = useRef(null);

  function saveEdit() {
    const trimmed = value.trim();
    if (!trimmed) {
      setValue(title);
      setEditing(false);
      return;
    }
    if (trimmed === title) {
      setEditing(false);
      return;
    }
    startTransition(async () => {
      await updateTaskTitle(new FormData(editFormRef.current));
      setEditing(false);
    });
  }

  return (
    <div className={`task-row${urgent ? " task-row-urgent" : ""}`}>
      {editing ? (
        <form ref={editFormRef} className="task-row-edit-form">
          <input type="hidden" name="id" value={id} />
          <input
            name="title"
            className="task-row-edit-input"
            value={value}
            autoFocus
            disabled={isPending}
            onChange={(e) => setValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveEdit();
              } else if (e.key === "Escape") {
                setValue(title);
                setEditing(false);
              }
            }}
          />
        </form>
      ) : (
        <span className="task-row-text">
          {kind ? <span className="task-row-kind">{kind}</span> : null}
          {title}
          {dueNote ? <span className="task-row-due">{dueNote}</span> : null}
        </span>
      )}

      <span className="task-row-actions">
        <form action={setTaskStatus}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="done" />
          <button type="submit" className="task-row-btn task-row-btn-done" title="Mark as done">
            ✓
          </button>
        </form>
        <form action={setTaskStatus}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="dropped" />
          <button type="submit" className="task-row-btn task-row-btn-remove" title="Remove">
            ✕
          </button>
        </form>
        <button
          type="button"
          className="task-row-btn task-row-btn-edit"
          title="Edit"
          onClick={() => setEditing(true)}
        >
          ✎
        </button>
        {showPin && (
          <form action={setTaskPinnedToday}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="pinned" value={String(!pinned)} />
            <button
              type="submit"
              className="task-row-btn task-row-btn-pin"
              title={pinned ? "Togli da oggi" : "Aggiungi a oggi"}
            >
              {pinned ? "− oggi" : "+ oggi"}
            </button>
          </form>
        )}
      </span>
    </div>
  );
}
