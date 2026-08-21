"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import SaveWatcher from "./SaveWatcher";

// Closes the modal the moment the add-person action finishes - same
// useFormStatus pending-edge trick as SaveWatcher, but local to this
// component instead of firing a global event.
function CloseOnDone({ onDone }) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) onDone();
    wasPending.current = pending;
  }, [pending, onDone]);

  return null;
}

export default function NewPersonModal({ action }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button type="button" className="new-person-trigger" onClick={() => setOpen(true)}>
        + New person
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal-panel content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 600, fontSize: 19, margin: "16px 0 10px" }}>New person</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="modal-close">
                ✕
              </button>
            </div>
            <form action={action} className="crm-form">
              <input name="name" placeholder="Name" required autoFocus />
              <input name="identity" placeholder="Email or identity" />
              <input name="org" placeholder="Org" />
              <input name="stories" placeholder="Story slugs this relates to, comma separated" />
              <input name="lists" placeholder="Lists, comma separated (e.g. Service Providers)" />
              <textarea
                name="background"
                placeholder="Background - where you met them, who introduced them, what they actually do"
                rows={4}
              />
              <button type="submit">Add</button>
              <CloseOnDone onDone={() => setOpen(false)} />
              <SaveWatcher />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
