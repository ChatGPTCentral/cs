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
  const cardRef = useRef(null);
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
        nodes[i].type === "story" || nodes[i].type === "company"
          ? Math.min(16, 4.5 + Math.sqrt(nodes[i].count || 1) * 1.6)
          : nodes[i].photo
          ? 8
          : 3 + (nodes[i].starred ? 1.5 : 0);
    }

    let alpha = 1;
    const transform = { x: 0, y: 0, k: 1 };
    let hovered = -1;
    let selected = -1;
    let lastClick = { i: -1, t: 0 };
    let anim = null; // {x0,y0,k0,x1,y1,k1,t0,dur}
    let dragging = -1;
    let panning = false;
    let downAt = null;
    let moved = 0;
    let raf = 0;
    let width = 0;
    let height = 0;

    // Lazy avatar cache - person nodes with a photo render as clipped
    // face circles once the image is in.
    const images = new Map();
    for (const n of nodes) {
      if (n.type === "person" && n.photo && !images.has(n.photo)) {
        const img = new Image();
        img.src = n.photo;
        images.set(n.photo, img);
      }
    }

    // Obsidian graph-view palette, by Alex's request - the canvas is a
    // dark viewport regardless of the app theme, exactly like opening
    // the graph in Obsidian: violet accent nodes, gray satellites,
    // faint gray edges, glow on the active neighborhood.
    const C = {
      bg: "#1b1b1e",
      line: "#43434a",
      ink: "#dcddde",
      dim: "#9b9ba3",
      story: "#a88bfa",
      sale: "#e5b567",
      company: "#5ec8d8",
      person: "#8f8f96",
      glow: "#7f6df2",
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
      const focus = hovered >= 0 ? hovered : selected;
      if (focus >= 0) {
        const s = new Set(neighbors[focus]);
        s.add(focus);
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
      ctx.globalAlpha = 1;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, width, height);
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
        const r = radius[i] * (n.center ? 1.4 : 1);
        ctx.globalAlpha = on ? 1 : 0.1;
        const img = n.photo ? images.get(n.photo) : null;
        const hasFace = img && img.complete && img.naturalWidth > 0;
        if (act && on) {
          // Obsidian-style halo on the active neighborhood.
          ctx.shadowColor = C.glow;
          ctx.shadowBlur = 14;
        }
        if (hasFace) {
          // Face node: glow via a backing disc, then the clipped avatar.
          ctx.fillStyle = C.person;
          ctx.beginPath();
          ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.save();
          ctx.beginPath();
          ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, px[i] - r, py[i] - r, r * 2, r * 2);
          ctx.restore();
          ctx.strokeStyle = i === hovered || i === selected || n.center ? C.ink : C.line;
          ctx.lineWidth = (i === hovered || i === selected || n.center ? 1.5 : 1) / transform.k;
          ctx.beginPath();
          ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle =
            n.type === "story" ? (n.kind === "sale" ? C.sale : C.story) : n.type === "company" ? C.company : C.person;
          ctx.beginPath();
          ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          if (i === hovered || i === selected || n.center) {
            ctx.strokeStyle = C.ink;
            ctx.lineWidth = 1.5 / transform.k;
            ctx.stroke();
          }
        }
      }

      // Labels: hovered neighborhood and search hits always; otherwise by
      // zoom level (stories first, people only when close), like Obsidian.
      ctx.textAlign = "center";
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const inAct = act && act.has(i);
        const isHubLike = n.type === "story" || n.type === "company";
        const zoomed = !act && (isHubLike ? transform.k > 0.85 || radius[i] > 9 : transform.k > 2.1);
        if (!inAct && !zoomed) continue;
        const size = Math.max(9 / transform.k, isHubLike ? 11 / transform.k : 9.5 / transform.k);
        ctx.font = `${isHubLike ? "600 " : ""}${size}px system-ui, sans-serif`;
        ctx.globalAlpha = inAct ? 1 : 0.75;
        ctx.fillStyle = isHubLike ? C.ink : C.dim;
        ctx.fillText(n.label, px[i], py[i] + radius[i] + 11 / transform.k);
      }
      ctx.restore();
    }

    // Smooth camera flight toward a node - Obsidian's click-to-focus.
    function zoomTo(i, targetK) {
      const k = targetK || Math.max(transform.k, compact ? transform.k : 2.4);
      anim = {
        x0: transform.x,
        y0: transform.y,
        k0: transform.k,
        node: i,
        k1: k,
        t0: performance.now(),
        dur: 450,
      };
    }

    function stepAnim() {
      if (!anim) return;
      const t = Math.min(1, (performance.now() - anim.t0) / anim.dur);
      const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const k = anim.k0 + (anim.k1 - anim.k0) * e;
      // Target keeps tracking the (possibly still moving) node.
      const tx = width / 2 - px[anim.node] * anim.k1;
      const ty = height / 2 - py[anim.node] * anim.k1;
      transform.k = k;
      transform.x = anim.x0 + (tx - anim.x0) * e;
      transform.y = anim.y0 + (ty - anim.y0) * e;
      if (t >= 1) anim = null;
    }

    function updateCard() {
      const card = cardRef.current;
      if (!card) return;
      if (selected < 0) {
        card.style.display = "none";
        return;
      }
      const sx = px[selected] * transform.k + transform.x;
      const sy = py[selected] * transform.k + transform.y;
      if (sx < -40 || sy < -40 || sx > width + 40 || sy > height + 40) {
        card.style.display = "none";
        return;
      }
      card.style.display = "block";
      card.style.left = `${sx + radius[selected] * transform.k + 10}px`;
      card.style.top = `${sy - 14}px`;
    }

    function setSelected(i) {
      selected = i;
      const card = cardRef.current;
      if (!card) return;
      if (i >= 0) {
        const n = nodes[i];
        const typeLabel =
          n.type === "story" ? (n.kind === "sale" ? "cliente" : "storia") : n.type === "company" ? "azienda" : "persona";
        card.innerHTML =
          `<div class="graph-card-name">${n.label}</div>` +
          `<div class="graph-card-meta">${typeLabel}${n.count ? ` · ${n.count} collegament${n.count === 1 ? "o" : "i"}` : ""}</div>` +
          `<a class="graph-card-open" href="${n.url}">Apri &rarr;</a>`;
      }
      updateCard();
    }

    function loop() {
      tick();
      stepAnim();
      draw();
      updateCard();
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
      anim = null;
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
      if (downAt && moved < 5) {
        const now = performance.now();
        if (wasNode >= 0) {
          if (lastClick.i === wasNode && now - lastClick.t < 350) {
            // Double click on a node: open its page.
            window.location.href = nodes[wasNode].url;
          } else {
            // Single click: fly to the node and light its neighborhood.
            setSelected(wasNode);
            zoomTo(wasNode);
          }
          lastClick = { i: wasNode, t: now };
        } else {
          // Click on empty space: release the selection.
          setSelected(-1);
          lastClick = { i: -1, t: now };
        }
      }
      downAt = null;
    }
    function onWheel(e) {
      e.preventDefault();
      anim = null;
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
      <div style={{ position: "relative", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
        <div ref={cardRef} className="graph-card" style={{ display: "none" }} />
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
          <span style={{ color: "#a88bfa" }}>●</span> storie{" "}
          <span style={{ color: "#e5b567" }}>●</span> clienti{" "}
          <span style={{ color: "#5ec8d8" }}>●</span> aziende{" "}
          <span style={{ color: "#8f8f96" }}>●</span> persone · rotella
          = zoom, trascina = sposta, click = apri
          {orphanCount > 0 ? ` · ${orphanCount} persone senza storia o azienda non mostrate` : ""}
        </span>
      </div>
      <div style={{ position: "relative", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
        <div ref={cardRef} className="graph-card" style={{ display: "none" }} />
      </div>
    </div>
  );
}
