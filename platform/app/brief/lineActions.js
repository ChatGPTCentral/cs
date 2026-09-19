"use server";

import { supabaseSelect, supabaseUpdate } from "../../lib/supabase";
import { BULLET_RE } from "../../lib/briefTemplate";
import { revalidatePath } from "next/cache";

async function getContent(briefId) {
  const rows = await supabaseSelect("ledger_briefs", `?id=eq.${briefId}&select=content`);
  return rows[0]?.content || "";
}

async function writeContent(briefId, content) {
  await supabaseUpdate("ledger_briefs", `?id=eq.${briefId}`, { content });
  revalidatePath("/");
}

function splitPrefix(line) {
  const m = line.match(BULLET_RE);
  const prefix = m ? m[0] : "";
  return [prefix, line.slice(prefix.length)];
}

// ~~text~~ marks a bullet done, same markdown-ish convention "**text**"
// already uses for bold - toggling just wraps/unwraps it, so a done item
// stays in place (struck through) instead of vanishing, and is easy to
// un-done by clicking the same check again.
function toggleDone(line) {
  const [prefix, text] = splitPrefix(line);
  if (text.startsWith("~~") && text.endsWith("~~") && text.length > 4) {
    return prefix + text.slice(2, -2);
  }
  return prefix + `~~${text}~~`;
}

// %%text%% marks a bullet removed - same wrap/unwrap idea as done, but a
// separate marker so a removed item can be told apart from a done one
// and restored on its own. Nothing is ever deleted from the content by
// this - "remove" is non-destructive, same as "done".
function toggleRemoved(line) {
  const [prefix, text] = splitPrefix(line);
  if (text.startsWith("%%") && text.endsWith("%%") && text.length > 4) {
    return prefix + text.slice(2, -2);
  }
  return prefix + `%%${text}%%`;
}

function setText(line, newText) {
  const [prefix] = splitPrefix(line);
  return prefix + newText;
}

// Always re-fetches the current content right before writing (instead of
// trusting a value the client rendered from) - this is a single-user tool
// but a form fired seconds after the last one would otherwise clobber it.
async function mutateLine(briefId, lineIndex, mutate) {
  const content = await getContent(briefId);
  const lines = content.split("\n");
  if (lineIndex < 0 || lineIndex >= lines.length) return;
  lines[lineIndex] = mutate(lines[lineIndex]);
  await writeContent(briefId, lines.join("\n"));
}

export async function toggleBriefLineDone(formData) {
  const briefId = (formData.get("briefId") || "").toString();
  const line = parseInt((formData.get("line") || "").toString(), 10);
  if (!briefId || Number.isNaN(line)) return;
  await mutateLine(briefId, line, toggleDone);
}

export async function toggleBriefLineRemoved(formData) {
  const briefId = (formData.get("briefId") || "").toString();
  const line = parseInt((formData.get("line") || "").toString(), 10);
  if (!briefId || Number.isNaN(line)) return;
  await mutateLine(briefId, line, toggleRemoved);
}

export async function editBriefLine(formData) {
  const briefId = (formData.get("briefId") || "").toString();
  const line = parseInt((formData.get("line") || "").toString(), 10);
  const text = (formData.get("text") || "").toString().trim();
  if (!briefId || Number.isNaN(line) || !text) return;
  await mutateLine(briefId, line, (raw) => setText(raw, text));
}

// addBriefTask removed 2026-09-19, per Alex's unification - it wrote a
// new task as brief text only, never into ledger_tasks, so it was
// invisible to "Altro che potresti tacklare." Use NbaPage's AddTaskForm
// (-> ledger_tasks) instead, the one add-task entry point now.
