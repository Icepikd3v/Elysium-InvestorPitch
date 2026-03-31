import React, { useEffect, useMemo, useRef } from "react";

/**
 * MallPreview3D (now a lightweight 2D minimap / preview canvas)
 *
 * Supports TWO modes:
 * 1) Walkthrough minimap mode (when `storefronts` is provided)
 *    - Draws corridor + storefront blocks + avatar position + facing direction
 *
 * 2) Category preview mode (when `storefronts` is NOT provided)
 *    - Draws a simple clickable category map for App.jsx store page
 */

const DEFAULT_CATEGORIES = [
  { key: "Fashion", label: "FASHION" },
  { key: "Electronics", label: "ELECTRONICS" },
  { key: "Beauty", label: "BEAUTY" },
  { key: "Home", label: "HOME" },
  { key: "Sports", label: "SPORTS" },
];

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function hexToRgba(hex, alpha) {
  const normalized = String(hex || "")
    .replace("#", "")
    .trim();
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => `${c}${c}`)
          .join("")
      : normalized.slice(0, 6);
  const value = Number.parseInt(full || "7fe7ff", 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStoreGlyph(ctx, key, cx, cy, accent, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = hexToRgba(accent, 0.92);
  ctx.fillStyle = hexToRgba(accent, 0.2);
  ctx.lineWidth = 1.6;

  if (key === "louboutin" || key === "jimmychoo" || key === "prada") {
    ctx.beginPath();
    ctx.moveTo(-8 * scale, 6 * scale);
    ctx.quadraticCurveTo(-1 * scale, 5 * scale, 5 * scale, 0);
    ctx.quadraticCurveTo(8 * scale, -2 * scale, 8 * scale, -6 * scale);
    ctx.lineTo(4 * scale, -6 * scale);
    ctx.quadraticCurveTo(4 * scale, -2 * scale, 0, 1 * scale);
    ctx.lineTo(-8 * scale, 6 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (key === "omega") {
    ctx.beginPath();
    ctx.arc(0, 0, 8 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -5 * scale);
    ctx.moveTo(0, 0);
    ctx.lineTo(4 * scale, 2 * scale);
    ctx.stroke();
  } else {
    roundedRect(ctx, -8 * scale, -6 * scale, 16 * scale, 12 * scale, 4 * scale);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawStorefrontBay(ctx, x, y, w, h, { key, label, accent, isActive, isNearby, side }) {
  const glow = isActive ? 0.95 : isNearby ? 0.72 : 0.48;
  const frameInset = 8;
  const shellX = x + frameInset;
  const shellY = y + frameInset;
  const shellW = w - frameInset * 2;
  const shellH = h - frameInset * 2;
  const topCapH = Math.max(10, shellH * 0.2);
  const windowY = shellY + topCapH + 2;
  const windowH = shellH - topCapH - 10;
  const leftWindowW = shellW * 0.34;
  const centerDoorW = shellW * 0.16;
  const rightWindowW = shellW * 0.34;
  const leftWindowX = shellX + 7;
  const centerDoorX = shellX + shellW * 0.5 - centerDoorW * 0.5;
  const rightWindowX = shellX + shellW - rightWindowW - 7;
  const glowY = y + h - 6;
  const labelY = shellY + topCapH * 0.58;

  // Outer kiosk glow rail / footprint
  roundedRect(ctx, x + 3, glowY - 4, w - 6, 8, 6);
  ctx.fillStyle = hexToRgba(accent, 0.18 + glow * 0.12);
  ctx.fill();
  ctx.save();
  ctx.shadowColor = hexToRgba(accent, 0.65);
  ctx.shadowBlur = isActive ? 18 : 12;
  ctx.strokeStyle = hexToRgba(accent, 0.8);
  ctx.lineWidth = 2;
  roundedRect(ctx, x + 6, glowY - 1, w - 12, 3, 2);
  ctx.stroke();
  ctx.restore();

  // Main shell
  roundedRect(ctx, shellX, shellY, shellW, shellH, 12);
  const shellGrad = ctx.createLinearGradient(shellX, shellY, shellX, shellY + shellH);
  shellGrad.addColorStop(0, "rgba(40,47,58,0.98)");
  shellGrad.addColorStop(1, "rgba(18,23,31,0.98)");
  ctx.fillStyle = shellGrad;
  ctx.fill();

  roundedRect(ctx, shellX, shellY, shellW, shellH, 12);
  ctx.strokeStyle = isActive
    ? hexToRgba(accent, 0.72)
    : isNearby
      ? hexToRgba(accent, 0.54)
      : "rgba(255,255,255,0.08)";
  ctx.lineWidth = isActive ? 1.8 : 1.1;
  ctx.stroke();

  // Rounded top cap / fascia
  roundedRect(ctx, shellX + 2, shellY + 1, shellW - 4, topCapH + 4, 10);
  const capGrad = ctx.createLinearGradient(shellX, shellY, shellX, shellY + topCapH + 4);
  capGrad.addColorStop(0, "rgba(34,40,50,0.98)");
  capGrad.addColorStop(1, "rgba(19,24,32,0.96)");
  ctx.fillStyle = capGrad;
  ctx.fill();

  // Base interior floor glow
  roundedRect(ctx, shellX + 8, shellY + shellH - 14, shellW - 16, 8, 4);
  ctx.fillStyle = "rgba(255,245,220,0.1)";
  ctx.fill();

  // Windows / display glazing
  const glassFill = ctx.createLinearGradient(shellX, windowY, shellX, windowY + windowH);
  glassFill.addColorStop(0, "rgba(255,255,255,0.2)");
  glassFill.addColorStop(1, "rgba(255,255,255,0.06)");
  roundedRect(ctx, leftWindowX, windowY, leftWindowW, windowH, 6);
  ctx.fillStyle = glassFill;
  ctx.fill();
  roundedRect(ctx, rightWindowX, windowY, rightWindowW, windowH, 6);
  ctx.fill();

  // Door / center bay
  roundedRect(ctx, centerDoorX, windowY + 2, centerDoorW, windowH - 2, 4);
  ctx.fillStyle = "rgba(10,14,20,0.86)";
  ctx.fill();
  roundedRect(ctx, centerDoorX, windowY + 2, centerDoorW, windowH - 2, 4);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Window frames
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 0.9;
  roundedRect(ctx, leftWindowX, windowY, leftWindowW, windowH, 6);
  ctx.stroke();
  roundedRect(ctx, rightWindowX, windowY, rightWindowW, windowH, 6);
  ctx.stroke();

  // Interior displays
  const displayBase = windowY + windowH - 8;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  roundedRect(ctx, leftWindowX + 6, displayBase, leftWindowW - 12, 4, 2);
  ctx.fill();
  roundedRect(ctx, rightWindowX + 6, displayBase, rightWindowW - 12, 4, 2);
  ctx.fill();

  drawStoreGlyph(ctx, key, leftWindowX + leftWindowW * 0.26, windowY + windowH * 0.55, accent, 0.92);
  drawStoreGlyph(ctx, key, rightWindowX + rightWindowW * 0.74, windowY + windowH * 0.55, accent, 0.92);

  // Side neon rails
  ctx.save();
  ctx.strokeStyle = hexToRgba(accent, 0.9);
  ctx.lineWidth = 2;
  ctx.shadowColor = hexToRgba(accent, 0.6);
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(shellX + 3, shellY + shellH - 10);
  ctx.lineTo(shellX + 3, shellY + 10);
  ctx.moveTo(shellX + shellW - 3, shellY + shellH - 10);
  ctx.lineTo(shellX + shellW - 3, shellY + 10);
  ctx.stroke();
  ctx.restore();

  // Brand strip under the name
  ctx.strokeStyle = hexToRgba(accent, 0.5);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(shellX + shellW * 0.24, shellY + topCapH + 1);
  ctx.lineTo(shellX + shellW * 0.76, shellY + topCapH + 1);
  ctx.stroke();

  if (isActive || isNearby) {
    ctx.save();
    ctx.shadowColor = hexToRgba(accent, 0.9);
    ctx.shadowBlur = isActive ? 20 : 12;
    roundedRect(ctx, shellX, shellY, shellW, shellH, 12);
    ctx.strokeStyle = hexToRgba(accent, 0.72);
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = isActive ? "rgba(255,255,255,0.98)" : "rgba(244,247,252,0.9)";
  ctx.font = "700 8px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, shellX + shellW * 0.5, labelY, shellW - 20);
}

export default function MallPreview3D({
  // Walkthrough minimap props
  storefronts,
  avatarX = 0,
  avatarZ = 0,
  avatarYaw = 0,
  activeStoreKey = null,
  nearbyStoreKey = null,

  // App.jsx preview props
  onStoreClick,
  priorityStores = [],

  // optional
  className,
  style,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  const isMinimapMode = Array.isArray(storefronts) && storefronts.length > 0;

  const storesForClick = useMemo(() => {
    // If in minimap mode, clicks should map to storefront keys
    if (isMinimapMode) return storefronts;

    // Otherwise, show categories (fallback)
    return DEFAULT_CATEGORIES;
  }, [isMinimapMode, storefronts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(10, Math.floor(rect.width));
      const h = Math.max(10, Math.floor(rect.height));
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      // Resize for DPR
      if (
        canvas.width !== Math.floor(w * dpr) ||
        canvas.height !== Math.floor(h * dpr)
      ) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Background
      const shellGrad = ctx.createLinearGradient(0, 0, 0, h);
      shellGrad.addColorStop(0, "rgba(26,34,46,0.98)");
      shellGrad.addColorStop(1, "rgba(19,27,39,0.96)");
      ctx.fillStyle = shellGrad;
      ctx.fillRect(0, 0, w, h);

      // Frame
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

      const pad = 10;

      if (isMinimapMode) {
        // ---- WALKTHROUGH MINIMAP ----
        // World-ish bounds derived from your Scene clamps
        const xMin = -10.2;
        const xMax = 10.2;
        const zMin = -66.0;
        const zMax = 5.0;

        const mapX = (x) => {
          const t = (x - xMin) / (xMax - xMin);
          return pad + t * (w - pad * 2);
        };
        const mapY = (z) => {
          // zMax (near start) is bottom; zMin is top
          const t = (z - zMax) / (zMin - zMax);
          return pad + t * (h - pad * 2);
        };

        const cx1 = mapX(-10.0);
        const cx2 = mapX(10.0);
        const cy1 = mapY(zMin);
        const cy2 = mapY(zMax);
        const mallW = cx2 - cx1;
        const mallH = cy2 - cy1;

        // Background glow
        const bgGrad = ctx.createLinearGradient(0, cy1, 0, cy2);
        bgGrad.addColorStop(0, "rgba(34,43,57,0.96)");
        bgGrad.addColorStop(1, "rgba(28,36,49,0.94)");
        roundedRect(ctx, cx1, cy1, mallW, mallH, 18);
        ctx.fillStyle = bgGrad;
        ctx.fill();

        // Outer shell
        roundedRect(ctx, cx1, cy1, mallW, mallH, 18);
        ctx.strokeStyle = "rgba(201,168,106,0.28)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Side retail galleries / promenade guides
        const galleryW = mallW * 0.24;
        const centerPromenadeW = mallW * 0.36;
        const leftGalleryX = cx1 + 12;
        const promenadeX = cx1 + (mallW - centerPromenadeW) * 0.5;
        const rightGalleryX = cx2 - galleryW - 12;
        const galleryY = cy1 + 16;
        const galleryH = mallH - 32;

        // Keep the map field clean: no oversized gallery/background guide shapes.
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(promenadeX, cy1 + 12);
        ctx.lineTo(promenadeX, cy2 - 12);
        ctx.moveTo(promenadeX + centerPromenadeW, cy1 + 12);
        ctx.lineTo(promenadeX + centerPromenadeW, cy2 - 12);
        ctx.stroke();

        // Center court features
        [-45, -33.5, -15].forEach((zVal, idx) => {
          const cy = mapY(zVal);
          if (idx === 1) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(81, 193, 235, 0.22)";
            ctx.arc(cx1 + mallW * 0.5, cy, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.strokeStyle = "rgba(209,168,91,0.42)";
            ctx.lineWidth = 2;
            ctx.arc(cx1 + mallW * 0.5, cy, 20, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            roundedRect(
              ctx,
              promenadeX + centerPromenadeW * 0.08,
              cy - 10,
              centerPromenadeW * 0.84,
              20,
              10,
            );
            ctx.fillStyle =
              idx === 0 ? "rgba(162,185,162,0.34)" : "rgba(162,185,162,0.24)";
            ctx.fill();
          }
        });

        // Gold lane markers
        ctx.fillStyle = "rgba(201,168,106,0.18)";
        ctx.fillRect(promenadeX + centerPromenadeW * 0.08, cy1 + 18, 2, mallH - 36);
        ctx.fillRect(promenadeX + centerPromenadeW * 0.92, cy1 + 18, 2, mallH - 36);

        // Major anchor labels
        ctx.fillStyle = "rgba(255,255,255,0.54)";
        ctx.font = "700 10px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("CENTER COURT", cx1 + mallW * 0.5, mapY(-33.5) - 28);
        ctx.fillText("ENTRY", cx1 + mallW * 0.5, mapY(1.5));
        ctx.fillText("DIGITAL ATRIUM", cx1 + mallW * 0.5, mapY(-61.5));

        // Storefront blocks
        const blockW = Math.max(56, mallW * 0.36);
        const blockH = Math.max(68, mallH * 0.24);

        storefronts.forEach((s) => {
          const y = mapY(s.z);
          const bx =
            s.side === "left"
              ? leftGalleryX + (galleryW - blockW) * 0.5
              : rightGalleryX + (galleryW - blockW) * 0.5;
          const by = y - blockH * 0.5;

          const isActive = activeStoreKey && s.key === activeStoreKey;
          const isNearby = nearbyStoreKey && s.key === nearbyStoreKey;
          const accent = s.accent || "#7fe7ff";

          drawStorefrontBay(ctx, bx, by, blockW, blockH, {
            key: s.key,
            label: s.label,
            accent,
            isActive,
            isNearby,
            side: s.side,
          });
        });

        // corridor arrows
        const drawArrow = (x, y, dir = 1) => {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 6 * dir, y - 4);
          ctx.lineTo(x - 6 * dir, y + 4);
          ctx.closePath();
          ctx.fillStyle = "rgba(201,168,106,0.34)";
          ctx.fill();
        };
        drawArrow(cx1 + mallW * 0.5, mapY(-8), 1);
        drawArrow(cx1 + mallW * 0.5, mapY(-52), -1);

        // Avatar
        const ax = mapX(avatarX);
        const ay = mapY(avatarZ);

        const ang = Math.PI - avatarYaw;
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(9, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(-9, 10);
        ctx.closePath();
        ctx.fillStyle = "rgba(127,231,255,0.96)";
        ctx.shadowColor = "rgba(127,231,255,0.55)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();

        // avatar label
        roundedRect(ctx, ax - 28, ay + 18, 56, 16, 8);
        ctx.fillStyle = "rgba(10,18,28,0.88)";
        ctx.fill();
        ctx.fillStyle = "rgba(223,250,255,0.85)";
        ctx.font = "700 9px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("YOU", ax, ay + 26);

        // Soft vignette
        // Intentionally no oval/radial background pattern here; keep the map field clean.
      } else {
        // ---- CATEGORY PREVIEW (App.jsx store page) ----
        const cols = 2;
        const rows = Math.ceil(storesForClick.length / cols);

        const gap = 10;
        const innerW = w - pad * 2;
        const innerH = h - pad * 2;

        const cellW = (innerW - gap * (cols - 1)) / cols;
        const cellH = (innerH - gap * (rows - 1)) / rows;

        storesForClick.forEach((s, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);

          const x = pad + c * (cellW + gap);
          const y = pad + r * (cellH + gap);

          const isPriority =
            Array.isArray(priorityStores) && priorityStores.includes(s.key);

          ctx.fillStyle = isPriority
            ? "rgba(255,255,255,0.16)"
            : "rgba(255,255,255,0.10)";
          ctx.fillRect(x, y, cellW, cellH);

          ctx.strokeStyle = isPriority
            ? "rgba(255,255,255,0.32)"
            : "rgba(255,255,255,0.18)";
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);

          ctx.fillStyle = "rgba(255,255,255,0.82)";
          ctx.font = "600 11px ui-sans-serif, system-ui";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            s.label || String(s.key).toUpperCase(),
            x + cellW / 2,
            y + cellH / 2,
          );
        });

        // Helper hint
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = "500 10px ui-sans-serif, system-ui";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("Click a tile to switch store", pad, h - 8);
      }
    };

    const scheduleDraw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    scheduleDraw();

    const ro = new ResizeObserver(scheduleDraw);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [
    isMinimapMode,
    storefronts,
    avatarX,
    avatarZ,
    avatarYaw,
    activeStoreKey,
    storesForClick,
    priorityStores,
  ]);

  const handleClick = (e) => {
    if (!onStoreClick) return;

    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Click mapping differs by mode
    if (isMinimapMode) {
      // Hit-testing storefront bays (same geometry as drawing)
      const w = rect.width;
      const h = rect.height;
      const pad = 10;

      const xMin = -10.2;
      const xMax = 10.2;
      const zMin = -66.0;
      const zMax = 5.0;

      const mapX = (xx) => pad + ((xx - xMin) / (xMax - xMin)) * (w - pad * 2);
      const mapY = (zz) => pad + ((zz - zMax) / (zMin - zMax)) * (h - pad * 2);

      const cx1 = mapX(-10.0);
      const cx2 = mapX(10.0);
      const cy1 = mapY(zMin);
      const cy2 = mapY(zMax);
      const mallW = cx2 - cx1;
      const mallH = cy2 - cy1;
      const galleryW = mallW * 0.24;
      const leftGalleryX = cx1 + 12;
      const rightGalleryX = cx2 - galleryW - 12;
      const blockW = Math.max(56, mallW * 0.36);
      const blockH = Math.max(68, mallH * 0.24);

      for (const s of storefronts) {
        const py = mapY(s.z);
        const bx =
          s.side === "left"
            ? leftGalleryX + (galleryW - blockW) * 0.5
            : rightGalleryX + (galleryW - blockW) * 0.5;
        const by = py - blockH * 0.5;

        if (x >= bx && x <= bx + blockW && y >= by && y <= by + blockH) {
          onStoreClick(s.key);
          return;
        }
      }
      return;
    }

    // Category mode hit-testing
    const w = rect.width;
    const h = rect.height;
    const pad = 10;
    const cols = 2;
    const rows = Math.ceil(storesForClick.length / cols);
    const gap = 10;
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;
    const cellW = (innerW - gap * (cols - 1)) / cols;
    const cellH = (innerH - gap * (rows - 1)) / rows;

    for (let i = 0; i < storesForClick.length; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const bx = pad + c * (cellW + gap);
      const by = pad + r * (cellH + gap);

      if (x >= bx && x <= bx + cellW && y >= by && y <= by + cellH) {
        onStoreClick(storesForClick[i].key);
        return;
      }
    }
  };

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ width: "100%", height: "100%", position: "relative", ...style }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: onStoreClick ? "pointer" : "default",
        }}
      />
    </div>
  );
}
