"use client";

import { useRef, useState, useTransition } from "react";
import { toggleBriefLineDone, toggleBriefLineRemoved, editBriefLine } from "./brief/lineActions";
import InstructionBox from "./nba/InstructionBox";

// One bullet in the rendered brief. Check marks it done (struck through
// in place, click again to undo). X marks it removed (faded, only a
// restore button shows, click to bring it back) - nothing is ever
// actually deleted from the brief's content, both are toggles. Pencil
// edits the text in place. Every click writes straight to
// ledger_briefs.content - this and BriefSendBar are the whole editing
// surface now that /brief itself is retired (2026-09-19, per Alex).
// Below the row, an InstructionBox for delegating this bullet instead of
// just checking it off - added 2026-09-19, per Alex, so every task-shaped
// line on Today carries the same delegate option, not just the ones in
// the live backlog section.
export default function BriefTaskItem({ briefId, line, done, removed, plainText, latest, children }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(plainText);
  const [isPending, startTransition] = useTransition();
  const editFormRef = useRef(null);

  function saveEdit() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === plainText) {
      setValue(plainText);
      setEditing(false);
      return;
    }
    startTransition(async () => {
      await editBriefLine(new FormData(editFormRef.current));
      setEditing(false);
    });
  }

  if (removed) {
    return (
      <span className="brief-item">
        <span className="brief-item-text brief-item-removed">{children}</span>
        <span className="brief-item-actions">
          <form action={toggleBriefLineRemoved}>
            <input type="hidden" name="briefId" value={briefId} />
            <input type="hidden" name="line" value={line} />
            <button type="submit" className="task-row-btn task-row-btn-restore" title="Restore">
              ↺
            </button>
          </form>
        </span>
      </span>
    );
  }

  return (
    <div className="brief-item-wrap">
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
                setValue(plainText);
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
        <form action={toggleBriefLineRemoved}>
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
    <InstructionBox briefId={briefId} briefLine={line} latest={latest} />
    </div>
  );
}
