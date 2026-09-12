import { supabaseUpdate } from "../../../lib/supabase";
import { renderBriefHtml } from "../../../lib/briefTemplate";

// Fires when Alex presses "Send now" on /brief. Independent of any Claude
// Code session - a plain server-side call to Resend using RESEND_API_KEY,
// so the button works even if no agent is running. Sends exactly the
// subject/content in the request body (what was in the textarea at that
// moment), not whatever is currently stored in Supabase - the edit box is
// the source of truth, per Alex, 2026-09-12.
export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "RESEND_API_KEY is not set on Vercel. Add it in Project Settings -> Environment Variables, then redeploy.",
      },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { id, subject, content, to_emails, date_label } = body || {};

  if (!id || !subject || !content) {
    return Response.json({ error: "Missing id, subject or content" }, { status: 400 });
  }

  const toList = String(to_emails || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (toList.length === 0) {
    return Response.json({ error: "No recipients on this brief" }, { status: 400 });
  }

  const html = renderBriefHtml({ subject, dateLabel: date_label, content });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Brief AI Central <noreply@app.thecentral.ai>",
      to: toList,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return Response.json({ error: `Resend call failed: ${res.status}`, detail }, { status: 502 });
  }

  const sentEmail = await res.json();

  await supabaseUpdate("ledger_briefs", `?id=eq.${id}`, {
    subject,
    content,
    status: "sent",
    sent_at: new Date().toISOString(),
  });

  return Response.json({ success: true, resendId: sentEmail.id });
}
