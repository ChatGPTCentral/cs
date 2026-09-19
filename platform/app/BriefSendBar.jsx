"use client";

import { useState } from "react";

// The one piece /brief had that the inline brief view on Today didn't:
// a Send button. Subject/content editing already happens in place via
// BriefBlocks -> BriefTaskItem (writes straight to ledger_briefs.content),
// so this bar only needs the subject line and Send/status - everything
// else about /brief's job now lives here. Added 2026-09-19, per Alex:
// "non abbiamo bisogno né del brief né del closing... stiamo portando
// tutte le funzionalità nel today."
export default function BriefSendBar({ brief }) {
  const [subject, setSubject] = useState(brief.subject);
  const [status, setStatus] = useState(null);
  const [sent, setSent] = useState(brief.status === "sent");

  async function handleSend() {
    if (!confirm("Invia questa email ora, esattamente come appare qui sopra?")) return;
    setStatus("invio...");
    try {
      const res = await fetch("/api/send-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: brief.id,
          subject,
          content: brief.content,
          to_emails: brief.to_emails,
          date_label: brief.brief_date,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`errore: ${data.error || res.status}`);
        return;
      }
      setStatus("inviato");
      setSent(true);
    } catch (e) {
      setStatus(`errore: ${e.message}`);
    }
  }

  return (
    <div className="brief-send-bar">
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        disabled={sent}
        className="brief-send-subject"
      />
      <span className="brief-send-to">a {brief.to_emails}</span>
      <button type="button" onClick={handleSend} disabled={sent} className="brief-send-btn">
        {sent ? "Inviato" : "Invia ora"}
      </button>
      {status && <span className="brief-send-status">{status}</span>}
    </div>
  );
}
