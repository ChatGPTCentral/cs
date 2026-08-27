"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// A small, dependency-free Fruchterman-Reingold layout - no charting
// library, same "plain fetch, no SDK" spirit as the rest of this app.
// Runs once per filtered node/edge set (not a continuous simulation loop):
// for the graph sizes this CRM produces, a few hundred iterations settle
// in well under the time it takes the page to paint. Nodes need only an
// `id` field - callers normalize story slugs and person ids to that.
function layout(nodes, edges, width, height, iterations = 400) {
  const pos = new Map();
  const n = nodes.length;
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / Math.max(n, 1);
    const radius = Math.min(width, height) * 0.32;
    pos.set(node.id, {
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
    });
  });

  const k = Math.sqrt((width * height) / Math.max(n, 1));

  for (let iter = 0; iter < iterations; iter++) {
    const disp = new Map(nodes.map((node) => [node.id, { x: 0, y: 0 }]));

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const pa = pos.get(nodes[i].id);
        const pb = pos.get(nodes[j].id);
        let dx = pa.x - pb.x;
        let dy = pa.y - pb.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const force = (k * k) / dist;
        dx = (dx / dist) * force;
        dy = (dy / dist) * force;
        const da = disp.get(nodes[i].id);
        const db = disp.get(nodes[j].id);
        da.x += dx; da.y += dy;
        db.x -= dx; db.y -= dy;
      }
    }

    for (const e of edges) {
      const pa = pos.get(e.source);
      const pb = pos.get(e.target);
      if (!pa || !pb) continue;
      let dx = pa.x - pb.x;
      let dy = pa.y - pb.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const force = (dist * dist) / k;
      dx = (dx / dist) * force;
      dy = (dy / dist) * force;
      const da = disp.get(e.source);
      const db = disp.get(e.target);
      da.x -= dx; da.y -= dy;
      db.x += dx; db.y += dy;
    }

    const temp = width * 0.04 * (1 - iter / iterations);
    for (const node of nodes) {
      const d = disp.get(node.id);
      const dist = Math.sqrt(d.x * d.x + d.y * d.y) || 0.01;
      const p = pos.get(node.id);
      p.x += (d.x / dist) * Math.min(dist, temp);
      p.y += (d.y / dist) * Math.min(dist, temp);
      p.x = Math.max(24, Math.min(width - 24, p.x));
      p.y = Math.max(24, Math.min(height - 24, p.y));
    }
  }

  return pos;
}

function storyColor(node) {
  if (node.isHub) return "var(--ink-faint)";
  if (node.kind === "event") return "var(--event)";
  if (node.kind === "sale") return "var(--sale)";
  if (node.axis === "moment") return "var(--moment)";
  return "var(--accent)";
}

export default function NetworkGraph({ storyNodes, storyEdges, personNodes, personEdges, peopleById }) {
  const width = 1300;
  const height = 720;

  const [search, setSearch] = useState("");
  const [showOrgEdges, setShowOrgEdges] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const dragRef = useRef(null);
  const svgRef = useRef(null);

  const searching = search.trim().length > 0;

  // ---------------------------------------------------------------------
  // Person ego mode - only computed once you search a name. Never render
  // the full 300-person graph unscoped; a search always narrows to one
  // person's direct neighborhood, same pattern Obsidian/Kumu use for
  // "focus" instead of dumping the whole graph on load.
  // ---------------------------------------------------------------------
  const basePersonEdges = useMemo(
    () => personEdges.filter((e) => showOrgEdges || e.sharedStories.length > 0 || (e.sharedThreads || []).length > 0),
    [personEdges, showOrgEdges]
  );

  const matchedId = useMemo(() => {
    if (!searching) return null;
    const q = search.trim().toLowerCase();
    const hit = personNodes.find((n) => n.name.toLowerCase().includes(q));
    return hit ? hit.id : "__none__";
  }, [search, searching, personNodes]);

  const ego = useMemo(() => {
    if (!searching || matchedId === "__none__") return null;
    const allowedIds = new Set([matchedId]);
    for (const e of basePersonEdges) {
      if (e.source === matchedId) allowedIds.add(e.target);
      if (e.target === matchedId) allowedIds.add(e.source);
    }
    const edgeSet = basePersonEdges.filter((e) => allowedIds.has(e.source) && allowedIds.has(e.target));
    const degree = new Map();
    for (const e of edgeSet) {
      degree.set(e.source, (degree.get(e.source) || 0) + 1);
      degree.set(e.target, (degree.get(e.target) || 0) + 1);
    }
    const nodes = personNodes
      .filter((n) => allowedIds.has(n.id))
      .map((n) => ({ ...n, id: n.id, weight: degree.get(n.id) || 1 }));
    return { nodes, edges: edgeSet };
  }, [searching, matchedId, basePersonEdges, personNodes]);

  // ---------------------------------------------------------------------
  // Story mode (default) - nodes are stories, sized by headcount.
  // ---------------------------------------------------------------------
  const storyGraphNodes = useMemo(
    () => storyNodes.map((s) => ({ ...s, id: s.slug, weight: s.peopleIds.length })),
    [storyNodes]
  );

  const activeNodes = searching ? (ego ? ego.nodes : []) : storyGraphNodes;
  const activeEdges = searching ? (ego ? ego.edges : []) : storyEdges;
  const maxWeight = useMemo(() => Math.max(1, ...activeNodes.map((n) => n.weight || 1)), [activeNodes]);

  const [positions, setPositions] = useState(null);

  useEffect(() => {
    setPositions(layout(activeNodes, activeEdges, width, height));
    setZoom({ scale: 1, x: 0, y: 0 });
    setSelectedStory(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNodes, activeEdges]);

  const neighborIds = useMemo(() => {
    if (!hovered) return null;
    const set = new Set([hovered]);
    for (const e of activeEdges) {
      if (e.source === hovered) set.add(e.target);
      if (e.target === hovered) set.add(e.source);
    }
    return set;
  }, [hovered, activeEdges]);

  const alwaysShowLabels = activeNodes.length <= 60;

  function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => ({ ...z, scale: Math.max(0.3, Math.min(4, z.scale * delta)) }));
  }
  function handlePointerDown(e) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: zoom.x, origY: zoom.y };
  }
  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setZoom((z) => ({ ...z, x: dragRef.current.origX + dx, y: dragRef.current.origY + dy }));
  }
  function handlePointerUp() {
    dragRef.current = null;
  }
  function resetView() {
    setZoom({ scale: 1, x: 0, y: 0 });
  }

  const selectedStoryNode = selectedStory ? storyGraphNodes.find((n) => n.slug === selectedStory) : null;

  return (
    <div>
      <div className="network-controls">
        <input
          type="text"
          placeholder="Cerca una persona..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="network-search"
        />
        {searching && (
          <button type="button" onClick={() => setSearch("")} className="network-reset">
            &larr; Torna alle storie
          </button>
        )}
        {searching && (
          <label className="network-toggle">
            <input type="checkbox" checked={showOrgEdges} onChange={(e) => setShowOrgEdges(e.target.checked)} />
            Mostra anche stessa org
          </label>
        )}
        <button type="button" onClick={resetView} className="network-reset">
          Reset vista
        </button>
        <span className="network-count">
          {searching
            ? `${activeNodes.length} persone, ${activeEdges.length} collegamenti`
            : `${activeNodes.length} storie, ${activeEdges.length} sovrapposizioni`}
        </span>
      </div>

      {matchedId === "__none__" && (
        <p style={{ color: "var(--ink-faint)", fontSize: 13 }}>
          Nessuna persona trovata per &quot;{search}&quot;.
        </p>
      )}

      {!positions ? (
        <p style={{ color: "var(--ink-faint)" }}>Sto disegnando il grafo...</p>
      ) : (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", display: "block", cursor: dragRef.current ? "grabbing" : "grab" }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <g transform={`translate(${zoom.x} ${zoom.y}) scale(${zoom.scale})`} style={{ transformOrigin: "center" }}>
            {activeEdges.map((e, i) => {
              const a = positions.get(e.source);
              const b = positions.get(e.target);
              if (!a || !b) return null;
              const dimmed = neighborIds && !(neighborIds.has(e.source) && neighborIds.has(e.target));
              const hasThread = !searching ? false : (e.sharedThreads || []).length > 0;
              const hasStory = !searching ? true : e.sharedStories?.length > 0;
              const stroke = hasThread ? "var(--thread-strong)" : hasStory ? "var(--accent)" : "var(--ink-faint)";
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={stroke}
                  strokeOpacity={dimmed ? 0.08 : hasThread ? 0.65 : hasStory ? 0.5 : 0.35}
                  strokeDasharray={hasThread || hasStory ? undefined : "3,3"}
                  strokeWidth={hasThread ? 1.6 : 1.2}
                />
              );
            })}
            {activeNodes.map((node) => {
              const p = positions.get(node.id);
              if (!p) return null;
              const r = 5 + (node.weight / maxWeight) * 13;
              const dimmed = neighborIds && !neighborIds.has(node.id);
              const showLabel = alwaysShowLabels || hovered === node.id || (neighborIds && neighborIds.has(node.id));
              const isPerson = searching;
              const fill = isPerson
                ? node.starred ? "var(--accent)" : "var(--surface-2)"
                : storyColor(node);
              const stroke = isPerson
                ? node.starred ? "var(--accent-ink)" : "var(--ink-faint)"
                : node.isHub ? "var(--ink-faint)" : "var(--surface)";
              const label = isPerson ? node.name : node.title;
              const content = (
                <g
                  opacity={dimmed ? 0.25 : 1}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={!isPerson ? () => setSelectedStory(node.slug) : undefined}
                  style={{ cursor: "pointer" }}
                >
                  {isPerson && node.photoUrl && (
                    <clipPath id={`clip-${node.id}`}>
                      <circle cx={p.x} cy={p.y} r={r} />
                    </clipPath>
                  )}
                  <circle
                    cx={p.x} cy={p.y} r={r}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1.2}
                    strokeDasharray={!isPerson && node.isHub ? "3,3" : undefined}
                  />
                  {isPerson && node.photoUrl && (
                    <image
                      href={node.photoUrl}
                      x={p.x - r} y={p.y - r}
                      width={r * 2} height={r * 2}
                      clipPath={`url(#clip-${node.id})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  )}
                  {showLabel && (
                    <text x={p.x} y={p.y - r - 4} textAnchor="middle" fontSize={11} fill="var(--ink-dim)">
                      {label}
                    </text>
                  )}
                </g>
              );
              return isPerson ? (
                <a key={node.id} href={`/people/${node.id}`}>{content}</a>
              ) : (
                <g key={node.id}>{content}</g>
              );
            })}
          </g>
        </svg>
      )}

      {selectedStoryNode && (
        <div className="network-story-panel">
          <div className="network-story-panel-head">
            <strong>{selectedStoryNode.title}</strong>
            <span>{selectedStoryNode.peopleIds.length} persone</span>
            <a href={`/story/${selectedStoryNode.slug}`}>Vedi la storia &rarr;</a>
            <button type="button" onClick={() => setSelectedStory(null)}>&times;</button>
          </div>
          <div className="network-story-panel-people">
            {selectedStoryNode.peopleIds.map((id) => {
              const p = peopleById[id];
              if (!p) return null;
              return (
                <a key={id} href={`/people/${id}`} className="genesis-person-chip">
                  {p.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
