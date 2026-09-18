import { parseBriefContent } from "../lib/briefTemplate";

// Renders a ledger_briefs row's plain-text content as native page markup
// (not the email-HTML table renderBriefBody builds) - same parser, a
// different target. Used by the Today page to show the morning brief
// inline instead of linking out to /brief.

function renderInline(text) {
  return text.split(/(\*\*.+?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
}

// Turns a flat, depth-tagged item list ("- " = depth 1, "- - " = depth 2,
// ...) into a real nested tree so it can render as nested <ul><li>.
function buildTree(items) {
  const root = [];
  const stack = [{ depth: 0, children: root }];
  for (const item of items) {
    const node = { text: item.text, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].depth >= item.depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push({ depth: item.depth, children: node.children });
  }
  return root;
}

function BriefList({ nodes }) {
  return (
    <ul>
      {nodes.map((n, i) => (
        <li key={i}>
          {renderInline(n.text)}
          {n.children.length > 0 && <BriefList nodes={n.children} />}
        </li>
      ))}
    </ul>
  );
}

export default function BriefBlocks({ content }) {
  const blocks = parseBriefContent(content);

  return (
    <div className="today-brief">
      {blocks.map((block, i) => {
        if (block.type === "h1") return <h2 key={i}>{block.text}</h2>;
        if (block.type === "h2") return <h3 key={i}>{block.text}</h3>;
        if (block.type === "h3") return <h4 key={i}>{block.text}</h4>;
        if (block.type === "list") return <BriefList key={i} nodes={buildTree(block.items)} />;
        return <p key={i}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
