"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// An Obsidian-style knowledge graph: everything on screen, live force
// simulation, wheel zoom, drag to pan or move a node, hover lights up a
// node's neighborhood and fades the rest, click opens the story/person.
// Hand-rolled physics (velocity integration, pairwise repulsion, spring
// links) - ~400 nodes keeps O(n^2) repulsion comfortably under budget,
// and no dependency can break the build.
export default function ObsidianGraph({ nodes, links, orphanCount = 0, height: fixedHeight, compact = false }) {
  const canvasRef = useRef(null);
  const [query, setQuery] = useState("");
  const queryRef = useRef("");
  queryRef.current = query.trim().toLowerCase();

  // Adjacency for hover highlighting.
  const neighbors = useMemo(() => {
    const n = nodes.map(() => new Set());
    for (const l of links) {
      n[l.s].add(l.t);
      n[l.t].add(l.s);
    }
    return n;
  }, [nodes, links]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const N = nodes.length;

    // --- layout state ---
    const px = new Float64Array(N);
    const py = new Float64Array(N);
    const vx = new Float64Array(N);
    const vy = new Float64Array(N);
    const radius = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      // Deterministic-ish spiral start so the sim settles the same way.
      const a = i * 2.399963; // golden angle
      const r = 14 * Math.sqrt(i + 1);
      px[i] = Math.cos(a) * r;
      py[i] = Math.sin(a) * r;
      radius[i] =
        nodes[i].type === "story"
          ? Math.min(16, 4.5 + Math.sqrt(nodes[i].count || 1) * 1.6)
          : 3 + (nodes[i].starred ? 1.5 : 0);
    }

    let alpha = 1;
    const transform = { x: 0, y: 0, k: 1 };
    let hovered = -1;
    let dragging = -1;
    let panning = false;
    let downAt = null;
    let moved = 0;
    let raf = 0;
    let width = 0;
    let height = 0;

    const css = getComputedStyle(document.documentElement);
    const color = (name, fallback) => (css.getPropertyValue(name) || fallback).trim() || fallback;
    const C = {
      bg: color("--surface", "#ffffff"),
      line: color("--line", "#e3e3de"),
      ink: color("--ink", "#1c1c1a"),
      dim: color("--ink-faint", "#8a8a82"),
      story: color("--accent", "#3d6b4f"),
      sale: color("--danger", "#C4402A"),
      person: color("--ink-dim", "#55554e"),
    };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = fixedHeight || Math.max(480, Math.round(window.innerHeight * 0.68));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (transform.x === 0 && transform.y === 0) {
        transform.x = width / 2;
        transform.y = height / 2;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    function tick() {
      if (alpha < 0.005) return;
      alpha *= 0.985;
      // Repulsion.
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          let dx = px[j] - px[i];
          let dy = py[j] - py[i];
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) d2 = 1;
          if (d2 > 40000) continue; // cutoff at 200px
          const f = (-620 * alpha) / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          vx[i] += fx;
          vy[i] += fy;
          vx[j] -= fx;
          vy[j] -= fy;
        }
      }
      // Springs.
      for (const l of links) {
        const rest = l.parent ? 70 : 46;
        let dx = px[l.t] - px[l.s];
        let dy = py[l.t] - py[l.s];
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - rest) * 0.04 * alpha;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        vx[l.s] += fx;
        vy[l.s] += fy;
        vx[l.t] -= fx;
        vy[l.t] -= fy;
      }
      // Gentle centering + integrate.
      for (let i = 0; i < N; i++) {
        vx[i] -= px[i] * 0.004 * alpha;
        vy[i] -= py[i] * 0.004 * alpha;
        if (i === dragging) {
          vx[i] = 0;
          vy[i] = 0;
          continue;
        }
        vx[i] *= 0.85;
        vy[i] *= 0.85;
        px[i] += vx[i];
        py[i] += vy[i];
      }
    }

    function activeSet() {
      const q = queryRef.current;
      if (hovered >= 0) {
        const s = new Set(neighbors[hovered]);
        s.add(hovered);
        return s;
      }
      if (q) {
        const s = new Set();
        for (let i = 0; i < N; i++) {
          if (nodes[i].label.toLowerCase().includes(q)) {
            s.add(i);
            for (const n of neighbors[i]) s.add(n);
          }
        }
        return s;
      }
      return null;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);
      const act = activeSet();

      ctx.lineWidth = 1 / transform.k;
      // Two passes so md-derived story-story links render dashed in the
      // accent color, distinct from tag-derived membership links.
      for (const mdPass of [false, true]) {
        ctx.setLineDash(mdPass ? [4 / transform.k, 3 / transform.k] : []);
        for (const l of links) {
          if (!!l.md !== mdPass) continue;
          const on = !act || (act.has(l.s) && act.has(l.t));
          ctx.strokeStyle = mdPass ? C.story : C.line;
          ctx.globalAlpha = on ? (act ? 0.9 : mdPass ? 0.4 : 0.5) : 0.06;
          ctx.beginPath();
          ctx.moveTo(px[l.s], py[l.s]);
          ctx.lineTo(px[l.t], py[l.t]);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const on = !act || act.has(i);
        ctx.globalAlpha = on ? 1 : 0.12;
        ctx.fillStyle = n.type === "story" ? (n.kind === "sale" ? C.sale : C.story) : C.person;
        ctx.beginPath();
        ctx.arc(px[i], py[i], radius[i], 0, Math.PI * 2);
        ctx.fill();
        if (i === hovered) {
          ctx.strokeStyle = C.ink;
          ctx.lineWidth = 1.5 / transform.k;
          ctx.stroke();
        }
      }

      // Labels: hovered neighborhood and search hits always; otherwise by
      // zoom level (stories first, people only when close), like Obsidian.
      ctx.textAlign = "center";
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const inAct = act && act.has(i);
        const zoomed =
          !act && (n.type === "story" ? transform.k > 0.85 || radius[i] > 9 : transform.k > 2.1);
        if (!inAct && !zoomed) continue;
        const size = Math.max(9 / transform.k, n.type === "story" ? 11 / transform.k : 9.5 / transform.k);
        ctx.font = `${n.type === "story" ? "600 " : ""}${size}px system-ui, sans-serif`;
        ctx.globalAlpha = inAct ? 1 : 0.75;
        ctx.fillStyle = n.type === "story" ? C.ink : C.dim;
        ctx.fillText(n.label, px[i], py[i] + radius[i] + 11 / transform.k);
      }
      ctx.restore();
    }

    function loop() {
      tick();
      draw();
      raf = requestAnimationFrame(loop);
    }
    loop();

    // --- interaction ---
    const toWorld = (cx, cy) => [
      (cx - transform.x) / transform.k,
      (cy - transform.y) / transform.k,
    ];
    function hit(cx, cy) {
      const [wx, wy] = toWorld(cx, cy);
      let best = -1;
      let bestD = 12 / transform.k + 4;
      for (let i = 0; i < N; i++) {
        const d = Math.hypot(px[i] - wx, py[i] - wy) - radius[i];
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    }
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    function onDown(e) {
      const [cx, cy] = pos(e);
      downAt = [cx, cy];
      moved = 0;
      const h = hit(cx, cy);
      if (h >= 0) {
        dragging = h;
      } else {
        panning = true;
      }
      canvas.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      const [cx, cy] = pos(e);
      if (downAt) moved += Math.abs(e.movementX) + Math.abs(e.movementY);
      if (dragging >= 0) {
        const [wx, wy] = toWorld(cx, cy);
        px[dragging] = wx;
        py[dragging] = wy;
        alpha = Math.max(alpha, 0.3);
      } else if (panning) {
        transform.x += e.movementX;
        transform.y += e.movementY;
      } else {
        const h = hit(cx, cy);
        if (h !== hovered) {
          hovered = h;
          canvas.style.cursor = h >= 0 ? "pointer" : "grab";
        }
      }
    }
    function onUp(e) {
      const wasNode = dragging;
      dragging = -1;
      panning = false;
      if (downAt && moved < 5 && wasNode >= 0) {
        window.location.href = nodes[wasNode].url;
      }
      downAt = null;
    }
    function onWheel(e) {
      e.preventDefault();
      const [cx, cy] = pos(e);
      const factor = Math.exp(-e.deltaY * 0.0015);
      const k = Math.min(6, Math.max(0.25, transform.k * factor));
      transform.x = cx - ((cx - transform.x) / transform.k) * k;
      transform.y = cy - ((cy - transform.y) / transform.k) * k;
      transform.k = k;
    }
    function onLeave() {
      hovered = -1;
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";

    // Reheat when the search query changes (queryRef mutates, sim needs a nudge to redraw highlight - draw runs every frame anyway, nothing to do).

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [nodes, links, neighbors]);

  if (compact) {
    return (
      <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca una storia o una persona..."
          style={{
            fontSize: 13,
            padding: "6px 10px",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            minWidth: 230,
          }}
        />
        <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
          <span style={{ color: "var(--accent)" }}>●</span> storie{" "}
          <span style={{ color: "var(--danger)" }}>●</span> clienti{" "}
          <span style={{ color: "var(--ink-dim)" }}>●</span> persone · rotella
          = zoom, trascina = sposta, click = apri
          {orphanCount > 0 ? ` · ${orphanCount} persone senza storia non mostrate` : ""}
        </span>
      </div>
      <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>
    </div>
  );
}
