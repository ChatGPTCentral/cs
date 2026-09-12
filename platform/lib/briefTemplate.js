// Renders a ledger_briefs row's plain-text `content` into the safe-for-Gmail
// HTML skeleton (inline CSS, table layout, system fonts, no images) used by
// the daily-rhythm emails. Content is written in a small plain-text
// convention so Alex can edit it as plain text on /brief, not raw HTML:
//
//   ## Section title     -> a bold section header
//   - item text          -> a bullet line (consecutive "- " lines group)
//   blank line            -> ends the current bullet group
//   anything else         -> a plain paragraph line
//   **text**              -> inline bold, inside any of the above
//
// See .claude/skills/inbox-ledger/references/daily-rhythm.md for the
// delivery mechanism this feeds (the /brief review-and-send page).

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

export function renderBriefBody(content) {
  const lines = String(content || "").split("\n");
  const blocks = [];
  let currentBullets = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.startsWith("## ")) {
      currentBullets = null;
      blocks.push({ type: "header", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      if (!currentBullets) {
        currentBullets = { type: "bullets", items: [] };
        blocks.push(currentBullets);
      }
      currentBullets.items.push(line.slice(2).trim());
    } else if (line.trim() === "") {
      currentBullets = null;
    } else {
      currentBullets = null;
      blocks.push({ type: "text", text: line.trim() });
    }
  }

  return blocks
    .map((block) => {
      if (block.type === "header") {
        return `<tr><td style="padding:16px 24px 4px 24px;"><span style="color:#1a1a2e; font-size:15px; font-weight:bold;">${inlineFormat(block.text)}</span></td></tr>`;
      }
      if (block.type === "bullets") {
        const items = block.items
          .map(
            (item, i) =>
              `<p style="margin:0 0 ${i === block.items.length - 1 ? 0 : 4}px 0;">- ${inlineFormat(item)}</p>`
          )
          .join("");
        return `<tr><td style="padding:0 24px 16px 24px; font-size:14px; color:#333333; line-height:1.6;">${items}</td></tr>`;
      }
      return `<tr><td style="padding:0 24px 12px 24px; font-size:14px; color:#333333; line-height:1.5;">${inlineFormat(block.text)}</td></tr>`;
    })
    .join("\n");
}

export function renderBriefHtml({ subject, dateLabel, content }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #e0e0e0; max-width:600px;">
<tr><td style="background-color:#1a1a2e; padding:20px 24px;">
<span style="color:#ffffff; font-size:18px; font-weight:bold;">${escapeHtml(subject)}</span>${
    dateLabel
      ? `<br><span style="color:#b8b8c8; font-size:13px;">${escapeHtml(dateLabel)}</span>`
      : ""
  }
</td></tr>
${renderBriefBody(content)}
<tr><td style="background-color:#f4f4f4; padding:14px 24px; font-size:12px; color:#888888;">
Draft-only. Nothing above was sent until you pressed Send.
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
