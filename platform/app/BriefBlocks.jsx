import { parseBriefContent } from "../lib/briefTemplate";
import { supabaseSelect } from "../lib/supabase";
import BriefTaskItem from "./BriefTaskItem";
import BriefAddTask from "./BriefAddTask";

// Renders a ledger_briefs row's plain-text content as native page markup
// (not the email-HTML table renderBriefBody builds) - same parser, a
// different target. Used by the Today page to show the morning brief
// inline, with each bullet actionable (done/remove/edit) in place.

// Bold only - a done item's ~~wrapper~~ is stripped before this runs (see
// BriefList below) and struck through via CSS instead, so it stays a
// clean per-word class rather than fighting <s> for nested bold text.
function renderInline(text) {
  return text.split(/(\*\*.+?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

function isDone(text) {
  return text.startsWith("~~") && text.endsWith("~~") && text.length > 4;
}

function isRemoved(text) {
  return text.startsWith("%%") && text.endsWith("%%") && text.length > 4;
}

// Turns a flat, depth-tagged item list ("- " = depth 1, "- - " = depth 2,
// ...) into a real nested tree so it can render as nested <ul><li>. Each
// node keeps its own source line index for the action buttons.
function buildTree(items) {
  const root = [];
  const stack = [{ depth: 0, children: root }];
  for (const item of items) {
    const node = { text: item.text, line: item.line, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].depth >= item.depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push({ depth: item.depth, children: node.children });
  }
  return root;
}

function BriefList({ nodes, briefId, instructionsByLine }) {
  return (
    <ul>
      {nodes.map((n) => {
        const removed = isRemoved(n.text);
        const innerText = removed ? n.text.slice(2, -2) : n.text;
        const done = isDone(innerText);
        const displayText = done ? innerText.slice(2, -2) : innerText;
        return (
          <li key={n.line}>
            <div className="brief-line">
              <span className="brief-marker">-</span>
              <BriefTaskItem
                briefId={briefId}
                line={n.line}
                done={done}
                removed={removed}
                plainText={displayText}
                latest={instructionsByLine.get(n.line)}
              >
                {renderInline(displayText)}
              </BriefTaskItem>
            </div>
            {n.children.length > 0 && (
              <BriefList nodes={n.children} briefId={briefId} instructionsByLine={instructionsByLine} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Every bullet the brief renders can carry a delegated instruction too,
// same as a ledger_tasks row or a story next-action - added 2026-09-19,
// per Alex, after he pointed out the brief's own bullets (Priorities,
// Open tasks, Follow-up...) had no "+ istruzione" box, only the backlog
// section below did.
export default async function BriefBlocks({ briefId, content }) {
  const blocks = parseBriefContent(content);
  const instructions = await supabaseSelect(
    "ledger_task_instructions",
    `?brief_id=eq.${briefId}&order=created_at.desc&select=brief_line,instruction,status,result,created_at,executed_at`
  );
  const instructionsByLine = new Map();
  for (const row of instructions) {
    if (!instructionsByLine.has(row.brief_line)) instructionsByLine.set(row.brief_line, row);
  }

  return (
    <div className="today-brief">
      <BriefAddTask briefId={briefId} />
      {blocks.map((block, i) => {
        if (block.type === "h1") return <h2 key={i}>{block.text}</h2>;
        if (block.type === "h2") return <h3 key={i}>{block.text}</h3>;
        if (block.type === "h3") return <h4 key={i}>{block.text}</h4>;
        if (block.type === "list")
          return (
            <BriefList
              key={i}
              nodes={buildTree(block.items)}
              briefId={briefId}
              instructionsByLine={instructionsByLine}
            />
          );
        return <p key={i}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
