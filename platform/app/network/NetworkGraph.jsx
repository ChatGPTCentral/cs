"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// A small, dependency-free Fruchterman-Reingold layout - no charting
// library, same "plain fetch, no SDK" spirit as the rest of this app.
// Runs once per filtered node/edge set (not a continuous simulation loop):
// for the graph sizes this CRM produces, a few hundred iterations settle
// in well under the time it takes the page to paint.
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

export default function NetworkGraph({ nodes: allNodes, edges: allEdges }) {
  const width = 1300;
  const height = 720;

  // Story edges only by default - shared-org edges are the main source of
  // noise (dozens of leads sharing a generic org string) and were what
  // made the graph unreadable. Turn them on deliberately, not by default.
  const [showOrgEdges, setShowOrgEdges] = useState(false);
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const dragRef = useRef(null);
  const svgRef = useRef(null);

  const baseEdges = useMemo(
    () => allEdges.filter((e) => showOrgEdges || e.sharedStories.length > 0),
    [allEdges, showOrgEdges]
  );

  const matchedId = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.trim().toLowerCase();
    const hit = allNodes.find((n) => n.name.toLowerCase().includes(q));
    return hit ? hit.id : "__none__";
  }, [search, allNodes]);

  // Search narrows to one person's direct neighborhood; starred narrows to
  // starred people plus anyone directly connected to one. Both stack with
  // the edge-type filter above.
  const { nodes, edges } = useMemo(() => {
    let edgeSet = baseEdges;
    let allowedIds = null;

    if (matchedId) {
      if (matchedId === "__none__") return { nodes: [], edges: [] };
      allowedIds = new Set([matchedId]);
      for (const e of baseEdges) {
        if (e.source === matchedId) allowedIds.add(e.target);
        if (e.target === matchedId) allowedIds.add(e.source);
      }
      edgeSet = baseEdges.filter((e) => allowedIds.has(e.source) && allowedIds.has(e.target));
    } else if (onlyStarred) {
      const starredIds = new Set(allNodes.filter((n) => n.starred).map((n) => n.id));
      allowedIds = new Set(starredIds);
      for (const e of baseEdges) {
        if (starredIds.has(e.source)) allowedIds.add(e.target);
        if (starredIds.has(e.target)) allowedIds.add(e.source);
      }
      edgeSet = baseEdges.filter((e) => allowedIds.has(e.source) && allowedIds.has(e.target));
    }

    const degree = new Map();
    for (const e of edgeSet) {
      degree.set(e.source, (degree.get(e.source) || 0) + 1);
      degree.set(e.target, (degree.get(e.target) || 0) + 1);
    }
    const nodeSet = allowedIds
      ? allNodes.filter((n) => allowedIds.has(n.id))
      : allNodes.filter((n) => degree.has(n.id));

    return {
      nodes: nodeSet.map((n) => ({ ...n, degree: degree.get(n.id) || 0 })),
      edges: edgeSet,
    };
  }, [baseEdges, matchedId, onlyStarred, allNodes]);

  const [positions, setPositions] = useState(null);

  useEffect(() => {
    setPositions(layout(nodes, edges, width, height));
    setZoom({ scale: 1, x: 0, y: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  const maxDegree = useMemo(() => Math.max(1, ...nodes.map((n) => n.degree)), [nodes]);
  const neighborIds = useMemo(() => {
    if (!hovered) return null;
    const set = new Set([hovered]);
    for (const e of edges) {
      if (e.source === hovered) set.add(e.target);
      if (e.target === hovered) set.add(e.source);
    }
    return set;
  }, [hovered, edges]);

  // Above ~60 nodes, permanent labels overlap into noise - show a name
  // only on hover/neighbor-highlight instead of on every node at once.
  const alwaysShowLabels = nodes.length <= 60;

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
        <label className="network-toggle">
          <input type="checkbox" checked={showOrgEdges} onChange={(e) => setShowOrgEdges(e.target.checked)} />
          Mostra anche stessa org
        </label>
        <label className="network-toggle">
          <input
            type="checkbox"
            checked={onlyStarred}
            onChange={(e) => setOnlyStarred(e.target.checked)}
            disabled={!!search.trim()}
          />
          Solo starred + collegati
        </label>
        <button type="button" onClick={resetView} className="network-reset">
          Reset vista
        </button>
        <span className="network-count">
          {nodes.length} persone, {edges.length} collegamenti
        </span>
      </div>

      {matchedId === "__none__" && (
        <p style={{ color: "var(--ink-faint)", fontSize: 13 }}>
          Nessuna persona trovata per &quot;{search}&quot;.
        </p>
      )}

      {!positions ? (
        <p style={{ color: "var(--ink-faint)" }}>Laying out the graph...</p>
      ) : nodes.length === 0 ? (
        matchedId !== "__none__" && (
          <p style={{ color: "var(--ink-faint)" }}>Nessuno da mostrare con questi filtri.</p>
        )
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
            {edges.map((e, i) => {
              const a = positions.get(e.source);
              const b = positions.get(e.target);
              if (!a || !b) return null;
              const dimmed = neighborIds && !(neighborIds.has(e.source) && neighborIds.has(e.target));
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={e.sharedStories.length > 0 ? "var(--accent)" : "var(--ink-faint)"}
                  strokeOpacity={dimmed ? 0.08 : e.sharedStories.length > 0 ? 0.5 : 0.35}
                  strokeDasharray={e.sharedStories.length > 0 ? undefined : "3,3"}
                  strokeWidth={1.2}
                />
              );
            })}
            {nodes.map((node) => {
              const p = positions.get(node.id);
              if (!p) return null;
              const r = 5 + (node.degree / maxDegree) * 13;
              const dimmed = neighborIds && !neighborIds.has(node.id);
              const showLabel = alwaysShowLabels || hovered === node.id || (neighborIds && neighborIds.has(node.id));
              return (
                <a key={node.id} href={`/people/${node.id}`}>
                  <g
                    opacity={dimmed ? 0.25 : 1}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {node.photoUrl && (
                      <clipPath id={`clip-${node.id}`}>
                        <circle cx={p.x} cy={p.y} r={r} />
                      </clipPath>
                    )}
                    <circle
                      cx={p.x} cy={p.y} r={r}
                      fill={node.starred ? "var(--accent)" : "var(--surface-2)"}
                      stroke={node.starred ? "var(--accent-ink)" : "var(--ink-faint)"}
                      strokeWidth={1.2}
                    />
                    {node.photoUrl && (
                      <image
                        href={node.photoUrl}
                        x={p.x - r} y={p.y - r}
                        width={r * 2} height={r * 2}
                        clipPath={`url(#clip-${node.id})`}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    )}
                    {showLabel && (
                      <text
                        x={p.x} y={p.y - r - 4}
                        textAnchor="middle"
                        fontSize={11}
                        fill="var(--ink-dim)"
                      >
                        {node.name}
                      </text>
                    )}
                  </g>
                </a>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
