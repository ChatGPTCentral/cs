"use client";

import { useEffect, useState } from "react";

// Shows a green confirmation whenever a "crm:saved" event fires (see
// SaveWatcher.jsx). Pure client state - no URL/query param involved, so
// showing it never triggers a navigation or resets scroll.
export default function SavedToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer;
    function onSaved() {
      setVisible(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), 2000);
    }
    window.addEventListener("crm:saved", onSaved);
    return () => {
      window.removeEventListener("crm:saved", onSaved);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className={`saved-toast${visible ? " saved-toast-visible" : ""}`} role="status">
      ✓ Saved
    </div>
  );
}
