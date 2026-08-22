"use client";

import { useEffect, useMemo, useState } from "react";

// A small, dependency-free Fruchterman-Reingold layout - no charting
// library, same "plain fetch, no SDK" spirit as the rest of this app.
// Runs once on mount (not a continuous simulation loop): for the graph
// sizes this CRM produces (well under a few hundred connected people)
// a few hundred iterations settle in well under the time it takes the
// page to paint, so there's nothing to gain from animating it live.
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

export default function NetworkGraph({ nodes, edges }) {
  const width = 1300;
  const height = 720;
  const [positions, setPositions] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    setPositions(layout(nodes, edges, width, height));
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

  if (!positions) {
    return <p style={{ color: "var(--ink-faint)" }}>Laying out the graph...</p>;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {edges.map((e, i) => {
        const a = positions.get(e.source);
        const b = positions.get(e.target);
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
        const r = 5 + (node.degree / maxDegree) * 13;
        const dimmed = neighborIds && !neighborIds.has(node.id);
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
              <text
                x={p.x} y={p.y - r - 4}
                textAnchor="middle"
                fontSize={11}
                fill="var(--ink-dim)"
              >
                {node.name}
              </text>
            </g>
          </a>
        );
      })}
    </svg>
  );
}
