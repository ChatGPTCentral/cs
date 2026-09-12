"use client";

import { useState, useTransition } from "react";
import { saveBrief } from "./actions";

export default function BriefEditor({ brief }) {
  const [subject, setSubject] = useState(brief.subject);
  const [content, setContent] = useState(brief.content);
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleSave() {
    setStatus("saving...");
    startTransition(async () => {
      await saveBrief(brief.id, subject, content);
      setStatus("saved");
    });
  }

  async function handleSend() {
    if (!confirm("Send this by email now, exactly as written below?")) return;
    setStatus("sending...");
    try {
      const res = await fetch("/api/send-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: brief.id,
          subject,
          content,
          to_emails: brief.to_emails,
          date_label: brief.brief_date,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`error: ${data.error || res.status}`);
        return;
      }
      setStatus("sent");
      setSent(true);
    } catch (e) {
      setStatus(`error: ${e.message}`);
    }
  }

  return (
    <div className="crm-form">
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        disabled={sent}
        style={{ fontWeight: 600 }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={24}
        disabled={sent}
        style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, lineHeight: 1.5 }}
      />
      <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>
        To: {brief.to_emails} - use <code>## Title</code> for a section header,{" "}
        <code>- item</code> for a bullet, <code>**text**</code> for bold.
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button type="button" onClick={handleSave} disabled={sent || isPending}>
          Save
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={sent}
          style={{ background: "#1a1a2e" }}
        >
          {sent ? "Sent" : "Send now"}
        </button>
        {status && <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{status}</span>}
      </div>
    </div>
  );
}
