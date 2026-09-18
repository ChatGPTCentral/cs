"use client";

import { useRef, useState, useTransition } from "react";
import { toggleBriefLineDone, removeBriefLine, editBriefLine } from "./brief/lineActions";

// One bullet in the rendered brief - check marks it done (struck through
// in place, click again to undo), x removes the line entirely, pencil
// edits its text. Every click writes straight to ledger_briefs.content,
// the same field /brief's own textarea edits - no separate data model.
export default function BriefTaskItem({ briefId, line, text, done, children }) {
  const [editing, setEditing] = useState(false);
  const rawText = done ? text.slice(2, -2) : text;
  const [value, setValue] = useState(rawText);
  const [isPending, startTransition] = useTransition();
  const editFormRef = useRef(null);

  function saveEdit() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === rawText) {
      setValue(rawText);
      setEditing(false);
      return;
    }
    startTransition(async () => {
      await editBriefLine(new FormData(editFormRef.current));
      setEditing(false);
    });
  }

  return (
    <span className="brief-item">
      {editing ? (
        <form ref={editFormRef} className="brief-item-edit-form">
          <input type="hidden" name="briefId" value={briefId} />
          <input type="hidden" name="line" value={line} />
          <input
            name="text"
            className="brief-item-edit-input"
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
                setValue(rawText);
                setEditing(false);
              }
            }}
          />
        </form>
      ) : (
        <span className={`brief-item-text${done ? " brief-item-done" : ""}`}>{children}</span>
      )}

      <span className="brief-item-actions">
        <form action={toggleBriefLineDone}>
          <input type="hidden" name="briefId" value={briefId} />
          <input type="hidden" name="line" value={line} />
          <button type="submit" className="task-row-btn task-row-btn-done" title={done ? "Mark as not done" : "Mark as done"}>
            ✓
          </button>
        </form>
        <form action={removeBriefLine}>
          <input type="hidden" name="briefId" value={briefId} />
          <input type="hidden" name="line" value={line} />
          <button type="submit" className="task-row-btn task-row-btn-remove" title="Remove">
            ✕
          </button>
        </form>
        <button type="button" className="task-row-btn task-row-btn-edit" title="Edit" onClick={() => setEditing(true)}>
          ✎
        </button>
      </span>
    </span>
  );
}
