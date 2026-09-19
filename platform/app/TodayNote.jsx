"use client";

import { useState, useTransition } from "react";
import { saveTodayNote } from "./todayActions";

// Free-text capture for anything that doesn't reduce to a task - a call,
// a reply, a story detail. Saved to ledger_closing_notes, same as /closing
// used to, read and folded into the ledger on the next sweep.
export default function TodayNote() {
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) return;
    const fd = new FormData();
    fd.set("note", trimmed);
    startTransition(async () => {
      await saveTodayNote(fd);
      setNote("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="today-note-form">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Qualcosa che è successo oggi e non è un task - una chiamata, una risposta, un dettaglio. Letto e integrato nel ledger al prossimo giro."
        rows={2}
        disabled={isPending}
      />
      <button type="submit" disabled={isPending || !note.trim()}>
        {saved ? "Salvato" : "Salva nota"}
      </button>
    </form>
  );
}
