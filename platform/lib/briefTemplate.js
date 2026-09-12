// Renders a ledger_briefs row's plain-text `content` into the safe-for-Gmail
// HTML skeleton (inline CSS, table layout, system fonts, no images) used by
// the daily-rhythm emails. Content is written in a small plain-text
// convention so Alex can edit it as plain text on /brief, not raw HTML:
//
//   ## Section title      -> a top-level section header
//   ### Subsection        -> a smaller subsection header, e.g. "Website"
//   #### LABEL            -> a small state-label header, e.g. "STUCK"
//   - item text           -> a bullet line (consecutive "- " lines group)
//   - - item text         -> a nested bullet (one level per repeated "- ")
//   blank line            -> ends the current bullet group
//   anything else         -> a plain paragraph line
//   **text**              -> inline bold, inside any of the above
//
// See .claude/skills/inbox-ledger/references/daily-rhythm.md for the
// delivery mechanism this feeds (the /brief review-and-send page), and
// Alex's own 2026-09-12 rewrite for the real template this grew from.

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

const BULLET_RE = /^(?:- )+/;

export function renderBriefBody(content) {
  const lines = String(content || "").split("\n");
  const blocks = [];
  let currentList = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const bulletMatch = line.match(BULLET_RE);

    if (line.startsWith("#### ")) {
      currentList = null;
      blocks.push({ type: "h3", text: line.slice(5).trim() });
    } else if (line.startsWith("### ")) {
      currentList = null;
      blocks.push({ type: "h2", text: line.slice(4).trim() });
    } else if (line.startsWith("## ")) {
      currentList = null;
      blocks.push({ type: "h1", text: line.slice(3).trim() });
    } else if (bulletMatch) {
      const depth = bulletMatch[0].length / 2;
      const text = line.slice(bulletMatch[0].length).trim();
      if (!currentList) {
        currentList = { type: "list", items: [] };
        blocks.push(currentList);
      }
      currentList.items.push({ depth, text });
    } else if (line.trim() === "") {
      currentList = null;
    } else {
      currentList = null;
      blocks.push({ type: "text", text: line.trim() });
    }
  }

  return blocks
    .map((block) => {
      if (block.type === "h1") {
        return `<tr><td style="padding:16px 24px 4px 24px;"><span style="color:#1a1a2e; font-size:15px; font-weight:bold;">${inlineFormat(block.text)}</span></td></tr>`;
      }
      if (block.type === "h2") {
        return `<tr><td style="padding:10px 24px 2px 24px;"><span style="color:#1a1a2e; font-size:13.5px; font-weight:bold;">${inlineFormat(block.text)}</span></td></tr>`;
      }
      if (block.type === "h3") {
        return `<tr><td style="padding:8px 24px 2px 24px;"><span style="color:#6b6b7a; font-size:11.5px; font-weight:bold; letter-spacing:0.04em; text-transform:uppercase;">${inlineFormat(block.text)}</span></td></tr>`;
      }
      if (block.type === "list") {
        const items = block.items
          .map((item, i) => {
            const indent = 24 + (item.depth - 1) * 16;
            const marginBottom = i === block.items.length - 1 ? 0 : 4;
            return `<p style="margin:0 0 ${marginBottom}px 0; padding-left:${indent}px; text-indent:-12px;">- ${inlineFormat(item.text)}</p>`;
          })
          .join("");
        return `<tr><td style="padding:0 24px 14px 0; font-size:14px; color:#333333; line-height:1.6;">${items}</td></tr>`;
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
