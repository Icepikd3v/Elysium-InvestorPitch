// src/components/VirtualMallWalkthroughR3F.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Environment, RoundedBox, Text, useTexture } from "@react-three/drei";
import MallPreview3D from "./MallPreview3D";
import HoloStoreHUD from "./HoloStoreHUD";
import BrainCueWidget from "./BrainCueWidget";
/**
 * Virtual Mall Walkthrough (R3F)
 * - Controls:
 *    W/S or Arrow Up/Down = forward/back
 *    A/D or Arrow Left/Right = strafe
 *    Mouse drag / pointer-lock = LOOK (yaw + pitch)
 *    Shift = run
 *    E = enter (near storefront)
 *    V = toggle view (TPV/FPV)
 *    ESC = exit store overlay + unlock pointer
 *
 * ✅ Includes:
 *  - MiniMap (MallPreview3D)
 *  - AI Brain / Elly Preview overlay (stacked ABOVE store preview)
 *  - Store overlay (IN-SIM) with product images + add-to-cart
 */

/* ---------------------------------------------
   Asset URL helper
   - Ensures we always point at /public assets
   - Encodes spaces safely
   - Optionally prefixes PUBLIC_URL (CRA) when present
---------------------------------------------- */
function assetUrl(path, color = "black") {
  if (!path) return "";
  const base =
    (typeof import.meta !== "undefined" && import.meta?.env?.BASE_URL) ||
    (typeof globalThis !== "undefined" &&
      globalThis.process?.env?.PUBLIC_URL) ||
    "";
  const baseClean =
    base && base !== "/" ? base.replace(/\/+$/, "") : base === "/" ? "" : "";
  const p0 = path.startsWith("/") ? path : `/${path}`;
  const p = p0.replace(/\(color\)|\{color\}/gi, color);
  // encodeURI keeps slashes intact while encoding spaces and other characters
  return encodeURI(`${baseClean}${p}`);
}

function resolveProductImage(product, variant = "black") {
  const img = product?.image;
  // Support either:
  //  - string template: "/products/...-(color).png" or with {color}
  //  - map: { black: "/products/...png", red: "..." }
  if (img && typeof img === "object") {
    const keys = Object.keys(img);
    return assetUrl(img[variant] || img.black || img[keys[0]] || "");
  }
  return assetUrl(String(img || ""), variant);
}

function buildTiledMarbleTexture(sourceTexture, options = {}) {
  if (!sourceTexture?.image || typeof document === "undefined") {
    const fallback = sourceTexture?.clone?.();
    if (fallback) {
      fallback.wrapS = fallback.wrapT = THREE.RepeatWrapping;
      fallback.repeat.set(2.4, 1.6);
      fallback.colorSpace = THREE.SRGBColorSpace;
      fallback.needsUpdate = true;
    }
    return fallback || null;
  }

  const {
    columns = 7,
    rows = 2,
    grout = 8,
    width = 2048,
    height = 768,
    groutColor = "#c8a86a",
    panelTint = "rgba(255,248,236,0.08)",
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const tileWidth = Math.floor((width - grout * (columns + 1)) / columns);
  const tileHeight = Math.floor((height - grout * (rows + 1)) / rows);
  const sourceImage = sourceTexture.image;

  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, width, height);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const x = grout + col * (tileWidth + grout);
      const y = grout + row * (tileHeight + grout);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, tileWidth, tileHeight);
      ctx.clip();

      const flipX = (row + col) % 2 === 1;
      const flipY = row % 2 === 1;
      const drawWidth = tileWidth;
      const drawHeight = tileHeight;
      const offsetX = x;
      const offsetY = y;

      ctx.translate(
        flipX ? x + tileWidth * 0.5 : 0,
        flipY ? y + tileHeight * 0.5 : 0,
      );
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.translate(
        flipX ? -(x + tileWidth * 0.5) : 0,
        flipY ? -(y + tileHeight * 0.5) : 0,
      );
      ctx.drawImage(sourceImage, offsetX, offsetY, drawWidth, drawHeight);
      ctx.fillStyle = panelTint;
      ctx.fillRect(x, y, tileWidth, tileHeight);
      ctx.restore();
    }
  }

  const tiledTexture = new THREE.CanvasTexture(canvas);
  tiledTexture.wrapS = tiledTexture.wrapT = THREE.ClampToEdgeWrapping;
  tiledTexture.colorSpace = THREE.SRGBColorSpace;
  tiledTexture.anisotropy = 12;
  tiledTexture.needsUpdate = true;
  return tiledTexture;
}

/* UPDATED STOREFRONTS WITH LOGOS + STOREFRONT IMAGES */

const STOREFRONTS = [
  {
    key: "louboutin",
    label: "CHRISTIAN LOUBOUTIN",
    side: "left",
    z: -12,
    img: "/storefronts/ChristianStoreFront.jpg",
    logo: "/logos/lblogo.png",
    accent: "#7a1f1f",
    warmth: "#ffe6d9",
  },
  {
    key: "prada",
    label: "PRADA",
    side: "right",
    z: -26,
    img: "/storefronts/PradaStoreFront.jpg",
    logo: "/logos/pradalogo.png",
    accent: "#1f4b54",
    warmth: "#eaf6ff",
  },
  {
    key: "omega",
    label: "OMEGA",
    side: "left",
    z: -40,
    img: "/storefronts/OmegaStoreFront.jpg",
    logo: "/logos/omegalogo.png",
    accent: "#123e7a",
    warmth: "#e7f1ff",
  },
  {
    key: "jimmychoo",
    label: "JIMMY CHOO",
    side: "right",
    z: -54,
    img: "/storefronts/JimmyStoreFront.jpg",
    logo: "/logos/jimmychoologo.svg",
    accent: "#6b5a3c",
    warmth: "#fff0d6",
  },
];

const AMBIENT_SHOPPER_CONFIGS = [
  {
    anchor: [-6.8, 0, -10],
    heading: 0.4,
    scale: 0.98,
    variant: "male",
    label: "Live User",
    prompt: "Elly helped me choose the Classic Bootie.",
  },
  {
    anchor: [6.6, 0, -18],
    heading: -0.35,
    scale: 1.02,
    variant: "female",
    label: "Live User",
    prompt: "Elly matched this with Prada accessories for me.",
  },
  {
    anchor: [-7.2, 0, -31],
    heading: 0.2,
    scale: 0.94,
    variant: "female",
    label: "Live User",
    prompt: "Elly found similar heels after my retina reaction.",
  },
  {
    anchor: [7.0, 0, -45],
    heading: -0.28,
    scale: 1.0,
    variant: "male",
    label: "Live User",
    prompt: "AI recommended the watch wing after my dwell signal.",
  },
  {
    anchor: [-3.2, 0, -57],
    heading: 0.12,
    scale: 0.9,
    variant: "male",
    label: "Live User",
    prompt: "AI recommended the Seamaster after my dwell signal.",
  },
  {
    anchor: [3.4, 0, -58],
    heading: -0.18,
    scale: 0.92,
    variant: "female",
    label: "Live User",
    prompt: "Elly surfaced matching styles from my saved profile.",
  },
];

const STOREFRONT_LOOKS = {
  louboutin: {
    frame: "#34161b",
    trim: "#c39a62",
    glass: "#f4d8ce",
    glow: "#ffd8c4",
    sideGlow: "#a52a25",
    headerGlow: "#7b1612",
    imageW: 9.9,
    imageH: 5.95,
    frameDepth: 0.16,
    frameW: 10.12,
    frameH: 6.2,
    trimWidth: 0.08,
    glassOpacity: 0.1,
    showGeneratedBranding: false,
  },
  prada: {
    frame: "#d8d2cb",
    trim: "#a69888",
    glass: "#dff2ef",
    glow: "#f7f4ec",
    sideGlow: "#d7f6f0",
    headerGlow: "#efe9df",
    imageW: 9.95,
    imageH: 5.95,
    frameDepth: 0.16,
    frameW: 10.1,
    frameH: 6.18,
    trimWidth: 0.06,
    glassOpacity: 0.09,
    showGeneratedBranding: false,
  },
  omega: {
    frame: "#f0ece4",
    trim: "#b69156",
    glass: "#dce7f7",
    glow: "#fff5df",
    sideGlow: "#17325f",
    headerGlow: "#efe4cf",
    imageW: 9.9,
    imageH: 5.9,
    frameDepth: 0.16,
    frameW: 10.08,
    frameH: 6.16,
    trimWidth: 0.07,
    glassOpacity: 0.085,
    showGeneratedBranding: false,
  },
  jimmychoo: {
    frame: "#dfd9cf",
    trim: "#b29a79",
    glass: "#f3ead8",
    glow: "#fff4df",
    sideGlow: "#f4ead9",
    headerGlow: "#f2eadf",
    imageW: 9.92,
    imageH: 5.92,
    frameDepth: 0.16,
    frameW: 10.1,
    frameH: 6.18,
    trimWidth: 0.055,
    glassOpacity: 0.08,
    showGeneratedBranding: false,
  },
};

// IMPORTANT:
// Some parent apps previously navigated to a separate "store page" when they
// received a `STORE_INTERACT` event. To keep everything inside the simulation,
// we emit a different event name for the "enter store" action.
//
// If you still want analytics at the app level, listen for these *_IN_SIM
// events instead of `STORE_INTERACT`.
const IN_SIM_EVENT_ALIASES = {
  STORE_INTERACT: "STORE_INTERACT_IN_SIM",
};

function toInSimEventType(type) {
  return IN_SIM_EVENT_ALIASES[type] || type;
}

function toEllyEventType(type) {
  // Normalize back to the original types so Elly logic stays the same.
  if (type === "STORE_INTERACT_IN_SIM") return "STORE_INTERACT";
  return type;
}

/**
 * ✅ IMPORTANT (for image loading on Vercel / Linux)
 *
 * Your file path MUST match case + spelling exactly.
 * If your folders in /public are:
 *   /public/products/prada/...
 * then your code must use:
 *   "/products/prada/..."
 * NOT "/products/Prada/...".
 */

// Minimal product data (swap with real data later)
const STORE_PRODUCTS = {
  louboutin: [
    {
      id: "lb-heel-001",
      name: "Red Sole Stiletto",
      description:
        "Gloss patent stiletto with the iconic red sole. A sharp silhouette for evening and formal looks.",
      price: 1295,
      tag: "Best Seller",
      colors: ["black", "red", "beige"],
      image: "/products/christianlouboutin/lb-red-stilletto-(color).png",
    },
    {
      id: "lb-sling-002",
      name: "Patent Slingback",
      description:
        "Slingback in high-shine patent leather with a tapered heel\u2014polished, modern, and easy to style.",
      price: 1195,
      tag: "Trending",
      colors: ["black", "red", "beige"],
      image: "/products/christianlouboutin/lb-patent-slingback-(color).png",
    },
    {
      id: "lb-boot-003",
      name: "Classic Bootie",
      description:
        "Classic bootie with a clean profile and red-sole finish. Built for statement outfits and colder nights.",
      price: 1595,
      tag: "Limited",
      colors: ["black", "red", "beige"],
      image: "/products/christianlouboutin/lb-classic-bootie-(color).png",
    },
    {
      id: "lb-evening-004",
      name: "Evening Heel",
      description:
        "Elegant evening heel with a refined toe and subtle shine. Designed to elevate minimal looks.",
      price: 1395,
      tag: "New",
      colors: ["black", "red", "beige"],
      image: "/products/christianlouboutin/lb-evening-heel-(color).png",
    },
  ],

  // ✅ normalized to lowercase folder names (recommended)
  prada: [
    {
      id: "pr-tote-001",
      name: "Structured Tote",
      description:
        "Structured tote with signature detailing and roomy interior\u2014daily carry, elevated.",
      price: 2450,
      tag: "Icon",
      colors: ["black", "red", "beige"],
      image: "/products/Prada/pr-structured-tote-(color).png",
    },
    {
      id: "pr-loafer-002",
      name: "Leather Loafer",
      description:
        "Supple leather loafer with a sleek vamp. Comfortable, timeless, and office-ready.",
      price: 1150,
      tag: "Trending",
      colors: ["black", "red", "beige"],
      image: "/products/Prada/pr-leather-loafer-(color).png",
    },
    {
      id: "pr-pump-003",
      name: "Saffiano Pump",
      description:
        "Saffiano pump with a crisp finish and balanced heel height\u2014sharp, reliable, and classic.",
      price: 990,
      tag: "Signature",
      colors: ["black", "red", "beige"],
      image: "/products/Prada/pr-saffiano-pump-(color).png",
    },
    {
      id: "pr-sun-004",
      name: "Icon Sunglasses",
      description:
        "Icon sunglasses with premium lenses and clean lines\u2014instant polish in any season.",
      price: 620,
      tag: "New",
      colors: ["black", "red", "beige"],
      image: "/products/Prada/pr-icon-sunglasses-(color).png",
    },
  ],

  omega: [
    {
      id: "om-seam-001",
      name: "Seamaster Diver",
      description:
        "Diver-ready Seamaster with a sporty bezel and robust bracelet\u2014built for daily wear and depth.",
      price: 5900,
      tag: "Best Seller",
      colors: ["blackstainless", "bluebezel", "whitedial"],
      image: "/products/Omega/om-seamaster-diver-(color).png",
    },
    {
      id: "om-speed-002",
      name: "Speedmaster Chronograph",
      description:
        "Speedmaster chronograph with racing heritage and crisp sub-dials\u2014collector favorite.",
      price: 7100,
      tag: "Collector",
      // NOTE: filenames in /public include a spelling mismatch, so we map explicitly.
      colors: ["blackdial", "panda", "whitedial"],
      image: {
        blackdial: "/products/Omega/om-speedmaster-chronograph-blackdial.png",
        panda: "/products/Omega/om-speedmaster-chronograpger-panda.png",
        whitedial: "/products/Omega/om-speedmaster-chronographer-whitedial.png",
      },
    },
    {
      id: "om-const-003",
      name: "Constellation Quartz",
      description:
        "Constellation quartz with a refined case and clean dial\u2014classic luxury with low maintenance.",
      price: 4100,
      tag: "Classic",
      colors: ["black", "iceblue", "sunburst"],
      image: "/products/Omega/om-constellation-quartz-(color).png",
    },
    {
      id: "om-pres-004",
      name: "Prestige Dial",
      description:
        "Prestige dial with understated markers and a dressy profile\u2014versatile for work or events.",
      price: 3800,
      tag: "New",
      colors: ["blackdial", "bluedial", "silverdial"],
      image: {
        blackdial: "/products/Omega/om-prestige-blackdial.png",
        bluedial: "/products/Omega/om-prestige-bluedial.png",
        silverdial: "/products/Omega/om-prestige-silverdial.png",
      },
    },
  ],

  // ✅ uses the real folder name in /public/products/Jimmy Choo (URL-encoded)
  jimmychoo: [
    {
      id: "jc-aurelia-001",
      name: "Aurelia Heel",
      description:
        "Aurelia heel with a sleek profile and elegant lift\u2014night-out staple.",
      price: 895,
      tag: "Best Seller",
      colors: ["black", "red", "beige"],
      image: "/products/jimmychoo/jc-aurelia-heel-(color).png",
    },
    {
      id: "jc-crystal-002",
      name: "Crystal Strap",
      description:
        "Crystal strap detail for extra sparkle\u2014made for occasions and statement outfits.",
      price: 1025,
      tag: "Trending",
      colors: ["black", "red", "beige"],
      image: "/products/jimmychoo/jc-crystal-strap-(color).png",
    },
    {
      id: "jc-pump-003",
      name: "Signature Pump",
      description:
        "Signature pump with a clean toe and balanced heel height\u2014easy to dress up or down.",
      price: 990,
      tag: "Signature",
      colors: ["black", "red", "beige"],
      image: "/products/jimmychoo/jc-sig-pump-(color).png",
    },
    {
      id: "jc-nude-004",
      name: "Nude Pointed",
      description:
        "Nude pointed heel designed to lengthen the leg line\u2014minimal, chic, and versatile.",
      price: 910,
      tag: "Classic",
      colors: ["black", "red", "beige"],
      image: "/products/jimmychoo/jc-nude-pointed-(color).png",
    },
  ],
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

function buildCurvedRoute(start, end, sideBias = 0) {
  const sx = Number(start?.x || 0);
  const sz = Number(start?.z || 0);
  const ex = Number(end?.x || 0);
  const ez = Number(end?.z || 0);
  const dz = ez - sz;
  const dx = ex - sx;

  const c1 = {
    x: sx + dx * 0.12 + sideBias * 0.24,
    z: sz + dz * 0.32,
  };
  const c2 = {
    x: sx + dx * 0.64 + sideBias * 0.14,
    z: sz + dz * 0.76,
  };

  const points = [];
  const ts = [0.2, 0.4, 0.58, 0.74, 0.88, 1];
  for (const t of ts) {
    const mt = 1 - t;
    const x =
      mt * mt * mt * sx +
      3 * mt * mt * t * c1.x +
      3 * mt * t * t * c2.x +
      t * t * t * ex;
    const z =
      mt * mt * mt * sz +
      3 * mt * mt * t * c1.z +
      3 * mt * t * t * c2.z +
      t * t * t * ez;
    points.push({ x, z });
  }
  return points;
}

function addNoise(ctx, w, h, amount = 0.06) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * amount;
    d[i] = clamp(d[i] + n, 0, 255);
    d[i + 1] = clamp(d[i + 1] + n, 0, 255);
    d[i + 2] = clamp(d[i + 2] + n, 0, 255);
  }
  ctx.putImageData(img, 0, 0);
}

function hexToRgb(hex) {
  const s = hex.replace("#", "");
  const n = parseInt(
    s.length === 3
      ? s
          .split("")
          .map((c) => c + c)
          .join("")
      : s,
    16,
  );
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function mixHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = Math.round(lerp(A.r, B.r, t));
  const g = Math.round(lerp(A.g, B.g, t));
  const bb = Math.round(lerp(A.b, B.b, t));
  return `rgb(${r},${g},${bb})`;
}

function drawMarbleSurface(
  ctx,
  size,
  {
    base = "#f5f3ef",
    cloud = "#ebe7e1",
    vein = "rgba(82, 86, 92, 0.22)",
    warmVein = "rgba(177, 150, 105, 0.08)",
    slabCount = 3,
    veinCount = 36,
    veinWidthMin = 0.9,
    veinWidthMax = 2.3,
    cloudCount = 22,
  } = {},
) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < cloudCount; i += 1) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rx = 180 + Math.random() * 260;
    const ry = 120 + Math.random() * 220;
    const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, rx);
    gradient.addColorStop(0, "rgba(255,255,255,0.18)");
    gradient.addColorStop(0.45, cloud);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineCap = "round";
  for (let i = 0; i < veinCount; i += 1) {
    const startX = Math.random() * size;
    const startY = Math.random() * size;
    const segments = 3 + Math.floor(Math.random() * 3);

    ctx.strokeStyle = vein;
    ctx.lineWidth = veinWidthMin + Math.random() * (veinWidthMax - veinWidthMin);
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    let px = startX;
    let py = startY;
    for (let j = 0; j < segments; j += 1) {
      const c1x = px + (Math.random() * 220 - 110);
      const c1y = py + (Math.random() * 140 - 70);
      const c2x = c1x + (Math.random() * 240 - 120);
      const c2y = c1y + (Math.random() * 160 - 80);
      const nx = px + 180 + Math.random() * 220;
      const ny = py + (Math.random() * 180 - 90);
      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, nx, ny);
      px = nx;
      py = ny;
    }
    ctx.stroke();

    if (Math.random() < 0.8) {
      ctx.strokeStyle = "rgba(118, 122, 130, 0.12)";
      ctx.lineWidth = Math.max(0.5, ctx.lineWidth * 0.45);
      ctx.stroke();
    }

    if (Math.random() < 0.55) {
      ctx.strokeStyle = warmVein;
      ctx.lineWidth = 0.6 + Math.random() * 1.1;
      ctx.stroke();
    }
  }

  const slabW = size / slabCount;
  for (let i = 1; i < slabCount; i += 1) {
    const x = slabW * i + (Math.random() * 10 - 5);
    ctx.strokeStyle = "rgba(150, 154, 160, 0.10)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }

  for (let i = 0; i < 22000; i += 1) {
    const x = (Math.random() * size) | 0;
    const y = (Math.random() * size) | 0;
    const v = 220 + ((Math.random() * 26) | 0);
    ctx.fillStyle = `rgba(${v},${v},${v},0.18)`;
    ctx.fillRect(x, y, 1, 1);
  }
}

/* ---------------------------------------------
   White marble floor
---------------------------------------------- */
function makeCreamMallTileTexture({ size = 1024 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  drawMarbleSurface(ctx, size, {
    base: "#f7f4ef",
    cloud: "#ece6df",
    vein: "rgba(62, 65, 72, 0.46)",
    warmVein: "rgba(189, 156, 96, 0.16)",
    slabCount: 3,
    veinCount: 58,
    veinWidthMin: 1.4,
    veinWidthMax: 4.2,
    cloudCount: 28,
  });

  addNoise(ctx, size, size, 0.045);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.1, 6.8);
  tex.anisotropy = 12;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    target.isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  );
}

/* ---------------------------------------------
   Marble runner
---------------------------------------------- */
function makeBrickPaverTexture({ size = 1024 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  drawMarbleSurface(ctx, size, {
    base: "#e5e1da",
    cloud: "#d8d2ca",
    vein: "rgba(78, 80, 86, 0.32)",
    warmVein: "rgba(196, 166, 112, 0.16)",
    slabCount: 2,
    veinCount: 36,
    veinWidthMin: 1.3,
    veinWidthMax: 3.2,
    cloudCount: 18,
  });

  addNoise(ctx, size, size, 0.06);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.8, 5.4);
  tex.anisotropy = 12;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/* ---------------------------------------------
   WASD / Arrows + Shift + E
---------------------------------------------- */
function useWASD(active = false) {
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    e: false,
  });

  useEffect(() => {
    const resetKeys = () => {
      keys.current.w = false;
      keys.current.a = false;
      keys.current.s = false;
      keys.current.d = false;
      keys.current.shift = false;
      keys.current.e = false;
    };

    const isArrowKey = (key) =>
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowRight";

    const down = (ev) => {
      if (!active || isEditableTarget(ev.target)) return;
      if (isArrowKey(ev.key)) ev.preventDefault();

      if (ev.key === "w" || ev.key === "W" || ev.key === "ArrowUp") {
        keys.current.w = true;
      }
      if (ev.key === "a" || ev.key === "A" || ev.key === "ArrowLeft") {
        keys.current.a = true;
      }
      if (ev.key === "s" || ev.key === "S" || ev.key === "ArrowDown") {
        keys.current.s = true;
      }
      if (ev.key === "d" || ev.key === "D" || ev.key === "ArrowRight") {
        keys.current.d = true;
      }
      if (ev.key === "Shift") keys.current.shift = true;
      if (ev.key === "e" || ev.key === "E") keys.current.e = true;
    };

    const up = (ev) => {
      if (!active || isEditableTarget(ev.target)) return;
      if (isArrowKey(ev.key)) ev.preventDefault();

      if (ev.key === "w" || ev.key === "W" || ev.key === "ArrowUp") {
        keys.current.w = false;
      }
      if (ev.key === "a" || ev.key === "A" || ev.key === "ArrowLeft") {
        keys.current.a = false;
      }
      if (ev.key === "s" || ev.key === "S" || ev.key === "ArrowDown") {
        keys.current.s = false;
      }
      if (ev.key === "d" || ev.key === "D" || ev.key === "ArrowRight") {
        keys.current.d = false;
      }
      if (ev.key === "Shift") keys.current.shift = false;
      if (ev.key === "e" || ev.key === "E") keys.current.e = false;
    };

    const onVisibilityChange = () => {
      if (document.hidden) resetKeys();
    };

    const onWindowBlur = () => {
      resetKeys();
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [active]);

  return keys;
}

/* ---------------------------------------------
   Mouse LOOK (yaw + pitch) — pointer lock + drag
---------------------------------------------- */
function useMouseLook(domElement, enabled = true) {
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const lockedRef = useRef(false);

  useEffect(() => {
    if (!domElement) return;

    // When a store overlay is open, disable pointer-lock + drag look so UI interactions
    // don't bubble to the canvas and so the page never "steals" focus.
    if (!enabled) {
      if (document.pointerLockElement === domElement)
        document.exitPointerLock?.();
      domElement.style.cursor = "default";
      return;
    }

    const SENS = 0.0028;
    const PITCH_MIN = -0.85;
    const PITCH_MAX = 0.85;

    domElement.style.cursor = "grab";
    domElement.tabIndex = 0;

    const onClick = () => {
      if (document.pointerLockElement !== domElement)
        domElement.requestPointerLock?.();
    };

    const onLockChange = () => {
      lockedRef.current = document.pointerLockElement === domElement;
      domElement.style.cursor = lockedRef.current ? "none" : "grab";
    };

    const applyDelta = (dx, dy) => {
      yawRef.current -= dx * SENS;
      pitchRef.current -= dy * SENS;
      pitchRef.current = clamp(pitchRef.current, PITCH_MIN, PITCH_MAX);
    };

    const onMouseMovePL = (e) => {
      if (!lockedRef.current) return;
      applyDelta(e.movementX || 0, e.movementY || 0);
    };

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onMouseDown = (e) => {
      if (lockedRef.current) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      domElement.style.cursor = "grabbing";
    };

    const onMouseUp = () => {
      if (lockedRef.current) return;
      dragging = false;
      domElement.style.cursor = "grab";
    };

    const onMouseMoveDrag = (e) => {
      if (lockedRef.current || !dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      applyDelta(dx * 1.15, dy * 1.15);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape" && document.pointerLockElement === domElement) {
        document.exitPointerLock?.();
      }
    };

    domElement.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onLockChange);
    document.addEventListener("mousemove", onMouseMovePL);

    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMoveDrag);

    window.addEventListener("keydown", onKeyDown);

    return () => {
      domElement.removeEventListener("click", onClick);
      document.removeEventListener("pointerlockchange", onLockChange);
      document.removeEventListener("mousemove", onMouseMovePL);

      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMoveDrag);

      window.removeEventListener("keydown", onKeyDown);
    };
  }, [domElement, enabled]);

  return { yawRef, pitchRef, lockedRef };
}

/* ---------------------------------------------
   AI Brain / Elly logic (lightweight, deterministic)
---------------------------------------------- */
function buildEllyInsight({
  type,
  storeKey,
  storeLabel,
  dwellSeconds = 0,
  persona = "luxury",
  productName = "",
  retinaSignal = "",
  emotionTag = "",
}) {
  const products = (STORE_PRODUCTS[storeKey] || []).slice(0, 4);
  const top = products.slice(0, 2);

  const personaCopy =
    persona === "business"
      ? "Focused on value, timeless picks, and confidence for meetings."
      : persona === "tech"
        ? "Optimizing for comfort + premium materials (fast decision support)."
        : "Curating premium picks based on boutique intent signals.";

  const baseSignals = [
    dwellSeconds ? `Dwell time: ${dwellSeconds.toFixed(1)}s` : null,
    `Zone: ${storeLabel || storeKey}`,
    "Signal: storefront proximity",
  ].filter(Boolean);

  const recs =
    top.length > 0
      ? top.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          tag: p.tag,
        }))
      : [];

  if (type === "STORE_ZONE_ENTER") {
    return {
      title: "Elly • Context captured",
      subtitle: storeLabel,
      summary:
        "I’m tracking interest here. If you pause, I’ll surface best-fit items and a fast path to purchase.",
      signals: baseSignals,
      recs,
      confidence: 0.62,
    };
  }

  if (type === "AVATAR_STOPPED") {
    return {
      title: "Elly • Personalizing",
      subtitle: storeLabel,
      summary: personaCopy,
      signals: [...baseSignals, "Signal: stopped + attention confirmed"],
      recs,
      confidence: 0.78,
    };
  }

  if (type === "STORE_INTERACT") {
    return {
      title: "Elly • Ready when you are",
      subtitle: storeLabel,
      summary:
        "Entering store view. I’ll keep your top picks pinned and adapt suggestions as you browse.",
      signals: [...baseSignals, "Signal: intent to enter"],
      recs,
      confidence: 0.85,
    };
  }

  if (type === "STORE_ZONE_EXIT") {
    return {
      title: "Elly • Session updated",
      subtitle: storeLabel,
      summary:
        "Logged interest. I can re-surface this store later with smarter picks.",
      signals: ["Signal: exit", `Last zone: ${storeLabel || storeKey}`],
      recs: [],
      confidence: 0.55,
    };
  }

  if (type === "STORE_CART_ADD") {
    return {
      title: "Elly • Converting intent",
      subtitle: storeLabel,
      summary:
        "Cart activity, biometric reaction, and fit confidence are being fused into the next recommendation set.",
      signals: [
        ...baseSignals,
        `Cart signal: ${productName || "item"} added`,
        retinaSignal || "Retina signal: pupil dilation + elevated emotional response",
        emotionTag ? `Emotion read: ${emotionTag}` : null,
      ].filter(Boolean),
      recs,
      confidence: 0.91,
    };
  }

  return null;
}

function pickFeaturedProduct(storeKey, persona = "luxury") {
  const items = STORE_PRODUCTS[storeKey] || [];
  if (!items.length) return null;

  if (persona === "business") {
    return [...items].sort((a, b) => a.price - b.price)[0];
  }
  if (persona === "tech") {
    return (
      items.find((p) => /new|trending|collector/i.test(String(p.tag || ""))) ||
      items[1] ||
      items[0]
    );
  }
  return [...items].sort((a, b) => b.price - a.price)[0];
}

function buildBrainCues({
  type,
  storeKey,
  storeLabel,
  persona = "luxury",
  dwellSeconds = 0,
  productName = "",
  price = 0,
  retinaSignal = "",
  emotionTag = "",
}) {
  const zone = storeLabel || storeKey || "current storefront";
  const featured = pickFeaturedProduct(storeKey, persona);
  const featuredLine = featured
    ? `Hero pick: ${featured.name} • $${featured.price.toLocaleString()}`
    : "Hero pick: assembling from live catalog";

  const personaLine =
    persona === "business"
      ? "Persona lens: business buyer (value, versatility, ROI)"
      : persona === "tech"
        ? "Persona lens: tech buyer (signal speed, novelty, convenience)"
      : "Persona lens: luxury buyer (status, craftsmanship, premium fit)";

  const productCue = featured
    ? `${featured.name} ($${featured.price.toLocaleString()})`
    : "Top match pending";

  const storeAngle = {
    louboutin:
      "Store signal: strong eveningwear intent and high visual fixation.",
    prada: "Store signal: polished essentials + cross-category matching potential.",
    omega: "Store signal: precision/heritage interest and high-ticket tolerance.",
    jimmychoo:
      "Store signal: event-ready styling and accessory pair potential.",
  }[storeKey] || `Store signal: active scan profile for ${zone}.`;

  if (type === "STORE_ZONE_ENTER") {
    return {
      panel: [
        `Scan active at ${zone}: gaze + micro-expression baseline captured.`,
        storeAngle,
        personaLine,
      ],
      micro: [
        `Signal: scanning ${zone}`,
        "Decision: profile baseline locked",
        `Product: ${productCue}`,
      ],
      featured,
    };
  }

  if (type === "AVATAR_STOPPED") {
    const dwellCue =
      dwellSeconds > 0
        ? `Attention lock: ${dwellSeconds.toFixed(1)}s dwell at ${zone}.`
        : `Attention lock confirmed at ${zone}.`;
    return {
      panel: [
        dwellCue,
        featuredLine,
        "Mock action: rank top 3 items by emotion + budget fit.",
      ],
      micro: [
        `Signal: dwell ${dwellSeconds > 0 ? `${dwellSeconds.toFixed(1)}s` : "captured"}`,
        "Decision: budget fit recalculated",
        `Product: ${productCue}`,
      ],
      featured,
    };
  }

  if (type === "STORE_INTERACT") {
    return {
      panel: [
        `Entering ${zone}: launching in-store scan recommendations.`,
        featuredLine,
        "Mock action: suggest one anchor item + one matching add-on.",
      ],
      micro: [
        `Signal: entered ${zone}`,
        "Decision: recommendation set generated",
        `Product: ${productCue}`,
      ],
      featured,
    };
  }

  if (type === "STORE_ZONE_EXIT") {
    return {
      panel: [
        `Exit logged from ${zone}: preference score updated.`,
        "Mock action: retain this store in retarget queue for follow-up.",
        persona === "business"
          ? "Follow-up cue: show practical bundles on next touchpoint."
          : persona === "tech"
            ? "Follow-up cue: surface fast-compare options in next store."
            : "Follow-up cue: surface premium complements in next store.",
      ],
      micro: [
        `Signal: exit ${zone}`,
        "Decision: next-store strategy set",
        `Product: ${productCue}`,
      ],
      featured,
    };
  }

  if (type === "STORE_CART_ADD") {
    const cartLine = productName
      ? `Cart action: ${productName}${price ? ` • $${Number(price).toLocaleString()}` : ""}`
      : "Cart action: luxury item added";
    return {
      panel: [
        cartLine,
        retinaSignal ||
          "Retina signal: pupil dilation detected on product lock and emotional lift.",
        emotionTag
          ? `Emotion interpretation: ${emotionTag}`
          : "Emotion interpretation: positive resonance with premium styling cues.",
        "Fit model: preferred colorway and likely size profile inferred from historical purchases.",
        "Mock action: surface similar products and complementary items with matching fit confidence.",
      ],
      micro: [
        `Signal: cart add${productName ? ` ${productName}` : ""}`,
        "Decision: cross-store affinity recalculated",
        "Decision: biometric emotional fit saved to profile",
      ],
      featured,
    };
  }

  return {
    panel: [
      "Continuous scan mode active across store views and product focus points.",
      personaLine,
      featuredLine,
    ],
    micro: [
      "Signal: continuous scan active",
      "Decision: model refining",
      `Product: ${productCue}`,
    ],
    featured,
  };
}

function mapEllyMode(type) {
  if (type === "STORE_ZONE_ENTER") return "listening";
  if (type === "AVATAR_STOPPED") return "thinking";
  if (type === "STORE_INTERACT") return "recommending";
  if (type === "STORE_ZONE_EXIT") return "searching";
  if (type === "STORE_CART_ADD") return "recommending";
  return "idle";
}

function hexToRgba(hex, alpha = 1) {
  const h = String(hex || "").trim().replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => `${c}${c}`)
          .join("")
      : h.length >= 6
        ? h.slice(0, 6)
        : "7fe7ff";
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return `rgba(127,231,255,${alpha})`;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function glowColorForVariant(variant, fallback = "#4cf7ff") {
  const key = String(variant || "").toLowerCase();
  if (key.includes("red")) return "#ff4d8f";
  if (key.includes("blue")) return "#56a7ff";
  if (key.includes("beige") || key.includes("nude") || key.includes("silver")) return "#ffd7a3";
  if (key.includes("white") || key.includes("ice")) return "#d6f3ff";
  if (key.includes("black")) return "#8de7ff";
  return fallback;
}

function buildEllyReason({ storeLabel, productName, color, sizeProfile }) {
  const shade = color ? `${color} color preference` : "color preference";
  const fit = sizeProfile || "fit profile";
  return `${storeLabel}: ${productName} matched from prior purchases, retina reaction, ${shade}, and ${fit}.`;
}

const ELLY_MODE_IMAGE = {
  idle: "/elly/elly_idle.png",
  listening: "/elly/elly_thinking.png",
  searching: "/elly/elly_searching.png",
  thinking: "/elly/elly_thinking.png",
  recommending: "/elly/elly_recommending.png",
};

/* ---------------------------------------------
   Corridor + storefront wall facades
---------------------------------------------- */
function Corridor({
  creamFloorMat,
  brickInlayMat,
  baseMat,
  soffitMat,
  sideWallMat,
  backWallMat,
}) {
  const adZones = useMemo(() => {
    const storefrontHalfSpan = 6.1;
    const zones = [];
    const bySide = {
      left: STOREFRONTS.filter((s) => s.side === "left").sort((a, b) => a.z - b.z),
      right: STOREFRONTS.filter((s) => s.side === "right").sort((a, b) => a.z - b.z),
    };

    for (const side of ["left", "right"]) {
      const stores = bySide[side];
      for (let i = 0; i < stores.length - 1; i += 1) {
        const a = stores[i];
        const b = stores[i + 1];
        const gapMin = a.z + storefrontHalfSpan;
        const gapMax = b.z - storefrontHalfSpan;
        const gapLength = gapMax - gapMin;
        if (gapLength < 4.8) continue;

        zones.push({
          key: `${side}-${a.key}-${b.key}`,
          side,
          z: (gapMin + gapMax) * 0.5,
          width: Math.max(5.8, gapLength - 0.5),
          title: "AD SPACE",
          subtitle: side === "left" ? "Investor Brand Here" : "Advertise On Elysium",
          format: side === "left" ? "4x4 DIGITAL BOARD" : "2x2 WALL BOARD",
        });
      }
    }

    return zones;
  }, []);
  return (
    <group>
      {/* base cream */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -30]} receiveShadow>
        <planeGeometry args={[34, 122]} />
        <primitive object={creamFloorMat} attach="material" />
      </mesh>

      {/* brick runner */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.003, -30]} receiveShadow>
        <planeGeometry args={[26.0, 122]} />
        <primitive object={brickInlayMat} attach="material" />
      </mesh>

      {/* ceiling soffit */}
      <mesh position={[0, 7.55, -30]} receiveShadow>
        <boxGeometry args={[34, 0.7, 122]} />
        <primitive object={soffitMat} attach="material" />
      </mesh>

      {/* continuous mall side walls behind storefront shells */}
      <mesh
        position={[-15.72, 3.85, -30]}
        rotation-y={Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[122, 7.7]} />
        <primitive object={sideWallMat} attach="material" />
      </mesh>
      <mesh
        position={[15.72, 3.85, -30]}
        rotation-y={-Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[122, 7.7]} />
        <primitive object={sideWallMat} attach="material" />
      </mesh>

      {/* lights */}
      {Array.from({ length: 11 }).map((_, i) => (
        <group key={i} position={[0, 7.15, -5 - i * 10.5]}>
          <mesh>
            <boxGeometry args={[20, 0.08, 3.8]} />
            <meshStandardMaterial
              color={"#fff6ee"}
              emissive={"#fff2e3"}
              emissiveIntensity={0.85}
              roughness={0.25}
              metalness={0.05}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, -0.45, 0]}
            intensity={0.42}
            distance={18}
            color={"#fff4e6"}
          />
        </group>
      ))}

      {/* wall-side promo displays + benches + planters */}
      {adZones.map((ad, idx) => {
        const isLeft = ad.side === "left";
        const decorX = isLeft ? -13.3 : 13.3;
        const benchFacing = isLeft ? 0.12 : -0.12;
        const screenInset = isLeft ? 0.09 : -0.09;
        const screenAccent = idx % 2 === 0 ? "#71c7ff" : "#f2c879";
        return (
          <group key={ad.key}>
            <group position={[decorX, 0, ad.z]} rotation-y={Math.PI / 2}>
              <mesh position={[0, 3.5, screenInset]} castShadow receiveShadow>
                <boxGeometry args={[4.35, 2.52, 0.12]} />
                <meshStandardMaterial
                  color={"#cfd4da"}
                  roughness={0.28}
                  metalness={0.36}
                />
              </mesh>
              <mesh position={[0, 3.5, screenInset * 1.4]} castShadow>
                <boxGeometry args={[3.96, 2.16, 0.04]} />
                <meshStandardMaterial
                  color={"#e7eaee"}
                  roughness={0.34}
                  metalness={0.06}
                  emissive={new THREE.Color("#f7f7f4")}
                  emissiveIntensity={0.1}
                />
              </mesh>
              <mesh position={[0, 4.17, screenInset * 1.8]}>
                <planeGeometry args={[3.3, 0.26]} />
                <meshBasicMaterial
                  color={screenAccent}
                  transparent
                  opacity={0.9}
                  toneMapped={false}
                />
              </mesh>
              <Text
                position={[0, 4.18, screenInset * 2.2]}
                rotation-y={0}
                fontSize={0.13}
                maxWidth={2.9}
                anchorX="center"
                anchorY="middle"
              >
                {idx % 2 === 0 ? "ELYSIUM LIVE PROMO" : "FEATURED BRAND STORY"}
                <meshBasicMaterial color={"#071017"} toneMapped={false} />
              </Text>
              <Text
                position={[0, 3.62, screenInset * 2.2]}
                rotation-y={0}
                fontSize={0.24}
                maxWidth={3.2}
                anchorX="center"
                anchorY="middle"
              >
                {ad.title}
                <meshBasicMaterial color={"#223245"} toneMapped={false} />
              </Text>
              <Text
                position={[0, 3.24, screenInset * 2.2]}
                rotation-y={0}
                fontSize={0.11}
                maxWidth={3.3}
                anchorX="center"
                anchorY="middle"
              >
                {ad.subtitle}
                <meshBasicMaterial color={"#536577"} toneMapped={false} />
              </Text>
              <Text
                position={[0, 2.98, screenInset * 2.2]}
                rotation-y={0}
                fontSize={0.09}
                maxWidth={3.1}
                anchorX="center"
                anchorY="middle"
              >
                {ad.format}
                <meshBasicMaterial color={screenAccent} toneMapped={false} />
              </Text>
              <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
                <boxGeometry args={[2.7, 0.18, 0.8]} />
                <meshStandardMaterial
                  color={"#bb8a3c"}
                  roughness={0.42}
                  metalness={0.52}
                />
              </mesh>
              <mesh position={[0, 0.62, benchFacing]} receiveShadow castShadow>
                <boxGeometry args={[2.7, 0.24, 0.18]} />
                <meshStandardMaterial
                  color={"#d4a45a"}
                  roughness={0.36}
                  metalness={0.58}
                />
              </mesh>
              {[-1.12, 1.12].map((legX) => (
                <mesh key={`${ad.key}-leg-${legX}`} position={[legX, 0.2, 0]}>
                  <boxGeometry args={[0.12, 0.4, 0.12]} />
                  <meshStandardMaterial
                    color={"#8e6327"}
                    roughness={0.42}
                    metalness={0.5}
                  />
                </mesh>
              ))}
              {[-1.78, 1.78].map((plantX, plantIdx) => (
                <group key={`${ad.key}-planter-${plantX}`} position={[plantX, 0, 0]}>
                  <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
                    <cylinderGeometry args={[0.5, 0.62, 1.2, 14]} />
                    <meshStandardMaterial
                      color={"#9aa0a8"}
                      roughness={0.82}
                      metalness={0.08}
                    />
                  </mesh>
                  <mesh position={[0, 1.42, 0]} castShadow>
                    <sphereGeometry args={[0.58, 16, 16]} />
                    <meshStandardMaterial
                      color={plantIdx % 2 ? "#628b59" : "#537b50"}
                      roughness={0.88}
                    />
                  </mesh>
                  <mesh position={[0.18, 1.9, 0.1]} castShadow>
                    <sphereGeometry args={[0.32, 14, 14]} />
                    <meshStandardMaterial color={"#6d9a61"} roughness={0.84} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        );
      })}

      {/* center aisle luxury fountain */}
      <group position={[0, 0, -33.5]}>
        <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[3.05, 3.3, 0.28, 36]} />
          <meshStandardMaterial
            color={"#d2d6db"}
            roughness={0.42}
            metalness={0.22}
          />
        </mesh>
        <mesh position={[0, 0.23, 0]} receiveShadow>
          <cylinderGeometry args={[2.72, 2.88, 0.1, 36]} />
          <meshStandardMaterial
            color={"#f4f8fb"}
            roughness={0.08}
            metalness={0.04}
          />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[2.52, 40]} />
          <meshStandardMaterial
            color={"#7ad6ff"}
            emissive={"#52c5ff"}
            emissiveIntensity={0.18}
            transparent
            opacity={0.72}
            roughness={0.06}
            metalness={0.02}
          />
        </mesh>
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.66, 0.78, 0.84, 24]} />
          <meshStandardMaterial
            color={"#b88a3f"}
            roughness={0.28}
            metalness={0.72}
          />
        </mesh>
        <mesh position={[0, 1.16, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.14, 1.28, 0.16, 28]} />
          <meshStandardMaterial
            color={"#d1a85b"}
            roughness={0.26}
            metalness={0.76}
          />
        </mesh>
        <mesh position={[0, 1.32, 0]} receiveShadow>
          <cylinderGeometry args={[0.92, 0.98, 0.08, 28]} />
          <meshStandardMaterial
            color={"#f5f9fb"}
            roughness={0.1}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0, 1.29, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.82, 32]} />
          <meshStandardMaterial
            color={"#8fe0ff"}
            emissive={"#65d3ff"}
            emissiveIntensity={0.26}
            transparent
            opacity={0.76}
            roughness={0.05}
          />
        </mesh>
        {Array.from({ length: 3 }).map((_, ringIdx) => {
          const y = 1.58 + ringIdx * 0.58;
          const radius = 0.52 - ringIdx * 0.1;
          return (
            <group key={`fountain-water-${ringIdx}`}>
              <mesh position={[0, y, 0]}>
                <cylinderGeometry args={[0.045, 0.06, 0.62, 10]} />
                <meshBasicMaterial
                  color={"#aef0ff"}
                  transparent
                  opacity={0.52}
                  toneMapped={false}
                />
              </mesh>
              <pointLight
                position={[0, y + 0.16, 0]}
                intensity={0.15}
                distance={4}
                color={"#b2f2ff"}
              />
              {Array.from({ length: 6 }).map((__, splashIdx) => {
                const angle = (Math.PI * 2 * splashIdx) / 6 + ringIdx * 0.22;
                return (
                  <mesh
                    key={`fountain-splash-${ringIdx}-${splashIdx}`}
                    position={[
                      Math.cos(angle) * radius,
                      y + 0.18,
                      Math.sin(angle) * radius,
                    ]}
                  >
                    <sphereGeometry args={[0.05, 10, 10]} />
                    <meshBasicMaterial
                      color={"#d8fbff"}
                      transparent
                      opacity={0.56}
                      toneMapped={false}
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}
        {[-2.18, 2.18].map((xPos) => (
          <group key={`fountain-planter-${xPos}`} position={[xPos, 0, 0]}>
            <mesh position={[0, 0.52, 0]} receiveShadow castShadow>
              <cylinderGeometry args={[0.42, 0.5, 1.04, 16]} />
              <meshStandardMaterial
                color={"#b7bcc3"}
                roughness={0.8}
                metalness={0.08}
              />
            </mesh>
            <mesh position={[0, 1.26, 0]} castShadow>
              <sphereGeometry args={[0.48, 16, 16]} />
              <meshStandardMaterial color={"#5e8a59"} roughness={0.86} />
            </mesh>
            <mesh position={[0.18, 1.6, 0.08]} castShadow>
              <sphereGeometry args={[0.22, 14, 14]} />
              <meshStandardMaterial color={"#6f9d66"} roughness={0.84} />
            </mesh>
          </group>
        ))}
      </group>

      {/* suspended center-court sculpture / chandelier */}
      <group position={[0, 6.15, -33.5]}>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[2.1, 0.08, 18, 48]} />
          <meshStandardMaterial
            color={"#d0a45b"}
            emissive={"#7b5522"}
            emissiveIntensity={0.08}
            roughness={0.22}
            metalness={0.88}
          />
        </mesh>
        <mesh position={[0, -0.38, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[1.28, 0.05, 16, 40]} />
          <meshStandardMaterial
            color={"#f0d4a2"}
            roughness={0.18}
            metalness={0.7}
          />
        </mesh>
        {[-1.3, 0, 1.3].map((xPos) => (
          <mesh key={`chandelier-drop-${xPos}`} position={[xPos, 0.25, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
            <meshStandardMaterial color={"#d2d7dd"} roughness={0.35} metalness={0.52} />
          </mesh>
        ))}
        <pointLight position={[0, -0.2, 0]} intensity={0.38} distance={10} color={"#fff4df"} />
      </group>

      {/* premium lounge clusters near center court */}
      {[
        { z: -24.5, rot: 0.18 },
        { z: -42.5, rot: -0.18 },
      ].map((cluster, idx) => (
        <group key={`lounge-${cluster.z}`} position={[0, 0, cluster.z]}>
          {[-6.7, 6.7].map((xPos) => (
            <group key={`lounge-side-${cluster.z}-${xPos}`} position={[xPos, 0, 0]} rotation-y={xPos < 0 ? -cluster.rot : cluster.rot}>
              <mesh position={[0, 0.34, 0]} receiveShadow castShadow>
                <cylinderGeometry args={[0.62, 0.7, 0.18, 22]} />
                <meshStandardMaterial color={"#b78943"} roughness={0.28} metalness={0.7} />
              </mesh>
              <mesh position={[0, 0.62, 0]} receiveShadow castShadow>
                <cylinderGeometry args={[0.42, 0.48, 0.38, 18]} />
                <meshStandardMaterial color={"#f3f6f8"} roughness={0.14} metalness={0.05} />
              </mesh>
              {[-1.22, 1.22].map((seatX, seatIdx) => (
                <group key={`chair-${cluster.z}-${xPos}-${seatX}`} position={[seatX, 0, seatIdx === 0 ? -0.42 : 0.42]} rotation-y={seatIdx === 0 ? Math.PI / 2 : -Math.PI / 2}>
                  <mesh position={[0, 0.34, 0]} receiveShadow castShadow>
                    <boxGeometry args={[0.76, 0.1, 0.76]} />
                    <meshStandardMaterial color={"#d9b06b"} roughness={0.32} metalness={0.62} />
                  </mesh>
                  <mesh position={[0, 0.7, -0.28]} receiveShadow castShadow>
                    <boxGeometry args={[0.76, 0.72, 0.08]} />
                    <meshStandardMaterial color={idx === 0 ? "#f1efe8" : "#ece6dc"} roughness={0.48} metalness={0.04} />
                  </mesh>
                  {[-0.28, 0.28].flatMap((legX) => ([-0.28, 0.28].map((legZ) => (
                    <mesh key={`leg-${legX}-${legZ}`} position={[legX, 0.16, legZ]}>
                      <boxGeometry args={[0.06, 0.32, 0.06]} />
                      <meshStandardMaterial color={"#8c652e"} roughness={0.38} metalness={0.54} />
                    </mesh>
                  ))))}
                </group>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* brass directory totems */}
      {[
        { x: -2.9, z: -12.5, title: "Luxury Wing", sub: "Brands • Dining • Events" },
        { x: 2.9, z: -54.5, title: "Digital Atrium", sub: "Launches • Promos • Concierge" },
      ].map((totem) => (
        <group key={`totem-${totem.z}`} position={[totem.x, 0, totem.z]}>
          <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.34, 2.72, 0.18]} />
            <meshStandardMaterial color={"#cdd2d8"} roughness={0.28} metalness={0.3} />
          </mesh>
          <mesh position={[0, 1.58, 0.1]}>
            <boxGeometry args={[1.08, 2.34, 0.04]} />
            <meshStandardMaterial
              color={"#f0f4f6"}
              emissive={"#f7fafb"}
              emissiveIntensity={0.08}
              roughness={0.2}
              metalness={0.04}
            />
          </mesh>
          <mesh position={[0, 2.38, 0.13]}>
            <planeGeometry args={[0.92, 0.12]} />
            <meshBasicMaterial color={"#76d6ff"} transparent opacity={0.92} toneMapped={false} />
          </mesh>
          <Text position={[0, 2.14, 0.13]} fontSize={0.12} maxWidth={0.92} anchorX="center" anchorY="middle">
            {totem.title}
            <meshBasicMaterial color={"#223245"} toneMapped={false} />
          </Text>
          <Text position={[0, 1.78, 0.13]} fontSize={0.07} maxWidth={0.86} anchorX="center" anchorY="middle">
            {totem.sub}
            <meshBasicMaterial color={"#5f6f80"} toneMapped={false} />
          </Text>
          <mesh position={[0, 0.24, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.56, 0.18, 0.56]} />
            <meshStandardMaterial color={"#b78943"} roughness={0.3} metalness={0.72} />
          </mesh>
        </group>
      ))}

      {/* front arrival / entry composition */}
      <group position={[0, 0, 5.2]}>
        <mesh position={[0, 3.8, 0]} receiveShadow>
          <boxGeometry args={[34, 7.4, 1.2]} />
          <primitive object={backWallMat} attach="material" />
        </mesh>
        <mesh position={[0, 3.15, -0.12]} castShadow receiveShadow>
          <boxGeometry args={[11.8, 5.5, 0.36]} />
          <meshStandardMaterial
            color={"#edf2f5"}
            roughness={0.24}
            metalness={0.08}
          />
        </mesh>
        <mesh position={[0, 5.18, 0.08]}>
          <planeGeometry args={[8.8, 0.12]} />
          <meshBasicMaterial
            color={"#c9a86a"}
            transparent
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>
        <Text position={[0, 4.52, 0.1]} fontSize={0.7} maxWidth={10} anchorX="center" anchorY="middle">
          ELYSIUM DIGITAL
          <meshBasicMaterial color={"#435769"} toneMapped={false} />
        </Text>
        <Text position={[0, 3.88, 0.1]} fontSize={0.18} maxWidth={8.8} anchorX="center" anchorY="middle">
          Premium virtual commerce • concierge arrivals • brand activations
          <meshBasicMaterial color={"#74cfff"} toneMapped={false} />
        </Text>

        {[-9.6, 9.6].map((xPos, idx) => (
          <group key={`arrival-poster-${xPos}`} position={[xPos, 3.4, 0.15]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[5.2, 3.4, 0.14]} />
              <meshStandardMaterial
                color={"#cfd5db"}
                roughness={0.24}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, 0, 0.08]}>
              <boxGeometry args={[4.76, 3.04, 0.04]} />
              <meshStandardMaterial
                color={idx === 0 ? "#eff4f7" : "#e7ecef"}
                emissive={"#f7fafb"}
                emissiveIntensity={0.06}
                roughness={0.18}
                metalness={0.02}
              />
            </mesh>
            <mesh position={[0, 1.03, 0.11]}>
              <planeGeometry args={[3.9, 0.12]} />
              <meshBasicMaterial
                color={idx === 0 ? "#71c7ff" : "#f0c77b"}
                transparent
                opacity={0.9}
                toneMapped={false}
              />
            </mesh>
            <Text position={[0, 0.58, 0.11]} fontSize={0.28} maxWidth={4.1} anchorX="center" anchorY="middle">
              {idx === 0 ? "PRIVATE CLIENT STYLING" : "UPCOMING BRAND EVENT"}
              <meshBasicMaterial color={"#243546"} toneMapped={false} />
            </Text>
            <Text position={[0, 0.1, 0.11]} fontSize={0.11} maxWidth={4} anchorX="center" anchorY="middle">
              {idx === 0
                ? "Book guided recommendations, fit memory, and concierge shopping sessions."
                : "Luxury launches, sponsor promos, and invite-only retail moments."}
              <meshBasicMaterial color={"#5d6d7d"} toneMapped={false} />
            </Text>
          </group>
        ))}

        <group position={[0, 0, -1.1]}>
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.6, 0.24, 1.6]} />
            <meshStandardMaterial color={"#b98a43"} roughness={0.28} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.2, 0.54, 1.18]} />
            <meshStandardMaterial color={"#eef3f6"} roughness={0.12} metalness={0.04} />
          </mesh>
          <mesh position={[0, 1.26, 0.5]}>
            <planeGeometry args={[3.2, 0.12]} />
            <meshBasicMaterial color={"#73d2ff"} transparent opacity={0.9} toneMapped={false} />
          </mesh>
          <Text position={[0, 1.12, 0.52]} fontSize={0.18} maxWidth={3.1} anchorX="center" anchorY="middle">
            CONCIERGE ARRIVALS
            <meshBasicMaterial color={"#24384a"} toneMapped={false} />
          </Text>
          <Text position={[0, 0.9, 0.52]} fontSize={0.09} maxWidth={3} anchorX="center" anchorY="middle">
            Guest services • invite check-in • premium guided sessions
            <meshBasicMaterial color={"#617180"} toneMapped={false} />
          </Text>
          {[-3.9, 3.9].map((xPos) => (
            <group key={`arrival-planter-${xPos}`} position={[xPos, 0, 0.1]}>
              <mesh position={[0, 0.54, 0]} receiveShadow castShadow>
                <cylinderGeometry args={[0.5, 0.58, 1.08, 16]} />
                <meshStandardMaterial color={"#b8bec5"} roughness={0.78} metalness={0.08} />
              </mesh>
              <mesh position={[0, 1.28, 0]} castShadow>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color={"#5c8857"} roughness={0.86} />
              </mesh>
              <mesh position={[0.16, 1.62, 0.08]} castShadow>
                <sphereGeometry args={[0.24, 14, 14]} />
                <meshStandardMaterial color={"#6d9a61"} roughness={0.84} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* back wall */}
      <mesh position={[0, 3.8, -66.5]} receiveShadow>
        <boxGeometry args={[34, 7.4, 1.2]} />
        <primitive object={backWallMat} attach="material" />
      </mesh>

      {[-9.2, 9.2].map((xPos, idx) => (
        <group key={`coming-soon-${xPos}`} position={[xPos, 3.65, -65.76]}>
          <mesh>
            <planeGeometry args={[7.9, 4.8]} />
            <meshBasicMaterial
              color={idx === 0 ? "#e5eaef" : "#dfe5eb"}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 1.52, 0.01]}>
            <planeGeometry args={[5.4, 0.08]} />
            <meshBasicMaterial
              color={"#c9a86a"}
              transparent
              opacity={0.88}
              toneMapped={false}
            />
          </mesh>
          <Text
            position={[0, 1.02, 0.02]}
            fontSize={0.48}
            maxWidth={6.4}
            anchorX="center"
            anchorY="middle"
          >
            COMING SOON
            <meshBasicMaterial color={"#56472f"} toneMapped={false} />
          </Text>
          <Text
            position={[0, 0.18, 0.02]}
            fontSize={0.22}
            maxWidth={6.2}
            anchorX="center"
            anchorY="middle"
          >
            More stores opening soon
            <meshBasicMaterial color={"#7a6850"} toneMapped={false} />
          </Text>
          <Text
            position={[0, -0.82, 0.02]}
            fontSize={0.13}
            maxWidth={5.8}
            anchorX="center"
            anchorY="middle"
          >
            Luxury brands and new activations are being added to the mall map.
            <meshBasicMaterial
              color={"#8e7a5c"}
              transparent
              opacity={0.92}
              toneMapped={false}
            />
          </Text>
        </group>
      ))}

      {[-12.2, -3.8, 3.8, 12.2].map((xPos) => (
        <group key={`back-plant-${xPos}`} position={[xPos, 0, -61.7]}>
          <mesh position={[0, 0.68, 0]} receiveShadow castShadow>
            <boxGeometry args={[2.6, 1.36, 1.8]} />
            <meshStandardMaterial
              color={"#90969f"}
              roughness={0.8}
              metalness={0.06}
            />
          </mesh>
          <mesh position={[0, 1.3, 0]} castShadow>
            <sphereGeometry args={[0.52, 14, 14]} />
            <meshStandardMaterial color={"#628b59"} roughness={0.86} />
          </mesh>
          <mesh position={[-0.36, 1.62, -0.18]} castShadow>
            <sphereGeometry args={[0.32, 12, 12]} />
            <meshStandardMaterial color={"#4f734b"} roughness={0.88} />
          </mesh>
          <mesh position={[0.38, 1.58, 0.2]} castShadow>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color={"#6b985f"} roughness={0.82} />
          </mesh>
        </group>
      ))}

      <Text
        position={[0, 5.9, -65.82]}
        fontSize={0.58}
        letterSpacing={0.1}
        anchorX="center"
        anchorY="middle"
      >
        ELYSIUM DIGITAL
        <meshStandardMaterial
          color={"#314154"}
          emissive={"#d6e6ff"}
          emissiveIntensity={0.08}
          toneMapped={false}
        />
      </Text>
      <mesh position={[0, 5.25, -65.78]}>
        <planeGeometry args={[7.2, 0.035]} />
        <meshBasicMaterial
          color={"#72d3ff"}
          transparent
          opacity={0.75}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, 4.9, -65.8]}
        fontSize={0.18}
        letterSpacing={0.08}
        anchorX="center"
        anchorY="middle"
      >
        PREMIUM VIRTUAL COMMERCE
        <meshBasicMaterial
          color={"#54708d"}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </Text>
    </group>
  );
}

function StorefrontEmbedded({
  storeKey,
  label,
  side,
  z,
  active,
  accent,
  warmth,
  img,
  logo,
}) {
  const transparentPixel =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  const displayProducts = useMemo(
    () => (STORE_PRODUCTS[storeKey] || []).slice(0, 4),
    [storeKey],
  );
  const displayImageUrls = useMemo(
    () =>
      displayProducts.map((product) =>
        resolveProductImage(
          product,
          (Array.isArray(product.colors) && product.colors[0]) || "black",
        ),
      ),
    [displayProducts],
  );
  const textureUrls = useMemo(() => {
    const safeLogoUrl =
      logo && logo.trim() ? assetUrl(logo) : transparentPixel;
    return [
      assetUrl(img),
      safeLogoUrl,
      ...(displayImageUrls.length ? displayImageUrls : [transparentPixel]),
    ];
  }, [img, logo, displayImageUrls]);
  const loadedTextures = useTexture(textureUrls);
  const facadeTex = loadedTextures[0];
  const logoTex = loadedTextures[1];
  const productTextures = loadedTextures.slice(2);

  const wallX = 15.15;
  const storefrontDepthOffset =
    storeKey === "omega" ? 0.92 : 0.58;
  const xFace = side === "left" ? -wallX + storefrontDepthOffset : wallX - storefrontDepthOffset;
  const rotY = side === "left" ? Math.PI / 2 : -Math.PI / 2;
  const look = STOREFRONT_LOOKS[storeKey] || STOREFRONT_LOOKS.prada;
  const portalDepth = 0.9;
  const liftFromPedestal = useCallback(
    (pedestalTopY, imageHeight, clearance = 0.06) =>
      pedestalTopY + imageHeight / 2 + clearance,
    [],
  );

  const backPanelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: active
          ? mixHex(look.frame, "#101216", 0.14)
          : mixHex(look.frame, "#101216", 0.26),
        roughness: 0.68,
        metalness: 0.08,
      }),
    [active, look.frame],
  );

  const trimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: look.trim,
        roughness: 0.22,
        metalness: 0.48,
      }),
    [look.trim],
  );

  const innerWallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: mixHex(look.frame, look.sideGlow || "#ffffff", 0.18),
        roughness: 0.74,
        metalness: 0.06,
      }),
    [look.frame, look.sideGlow],
  );

  const canopyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: mixHex(look.trim, "#1a1a1a", 0.18),
        roughness: 0.34,
        metalness: 0.24,
      }),
    [look.trim],
  );

  const thresholdMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: mixHex(look.trim, "#ffffff", 0.12),
        roughness: 0.3,
        metalness: 0.16,
      }),
    [look.trim],
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: look.glass,
        transmission: 0.08,
        roughness: 0.03,
        metalness: 0.02,
        thickness: 0.1,
        transparent: true,
        opacity: Math.min(look.glassOpacity ?? 0.1, 0.07),
        depthWrite: false,
      }),
    [look.glass, look.glassOpacity],
  );

  const louboutinWallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#6f1014",
        roughness: 0.54,
        metalness: 0.08,
      }),
    [],
  );

  const louboutinPanelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8e181d",
        roughness: 0.46,
        metalness: 0.06,
      }),
    [],
  );

  const louboutinShelfMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b18a56",
        roughness: 0.28,
        metalness: 0.34,
      }),
    [],
  );

  const louboutinDisplayGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#fff2ea",
        transmission: 0.12,
        roughness: 0.03,
        metalness: 0.02,
        thickness: 0.08,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    [],
  );

  const omegaStoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e7dfd1",
        roughness: 0.4,
        metalness: 0.08,
      }),
    [],
  );

  const omegaBlueMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#16325c",
        roughness: 0.38,
        metalness: 0.12,
      }),
    [],
  );

  const omegaBrassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b8945a",
        roughness: 0.2,
        metalness: 0.48,
      }),
    [],
  );

  const omegaGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f7fbff",
        transmission: 0.12,
        roughness: 0.02,
        metalness: 0.02,
        thickness: 0.08,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    [],
  );

  const omegaCaseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ece4d8",
        roughness: 0.3,
        metalness: 0.1,
      }),
    [],
  );

  const pradaStoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e7dfd5",
        roughness: 0.34,
        metalness: 0.08,
      }),
    [],
  );

  const pradaPanelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b9aea1",
        roughness: 0.28,
        metalness: 0.12,
      }),
    [],
  );

  const pradaMetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#a99786",
        roughness: 0.18,
        metalness: 0.4,
      }),
    [],
  );

  const pradaGlowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#dff4f0",
        transparent: true,
        opacity: 0.28,
        toneMapped: false,
      }),
    [],
  );

  const pradaGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f9faf8",
        transmission: 0.12,
        roughness: 0.02,
        metalness: 0.02,
        thickness: 0.08,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    [],
  );

  const pradaTableMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a2520",
        roughness: 0.35,
        metalness: 0.12,
      }),
    [],
  );

  const jimmyStoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ddd4c8",
        roughness: 0.3,
        metalness: 0.08,
      }),
    [],
  );

  const jimmyWarmPanelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c9bcae",
        roughness: 0.24,
        metalness: 0.08,
      }),
    [],
  );

  const jimmyChampagneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b89f7d",
        roughness: 0.18,
        metalness: 0.42,
      }),
    [],
  );

  const jimmyGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#fffaf2",
        transmission: 0.12,
        roughness: 0.02,
        metalness: 0.02,
        thickness: 0.08,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    [],
  );

  const jimmyTableMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d4c3ae",
        roughness: 0.28,
        metalness: 0.08,
      }),
    [],
  );

  if (storeKey === "louboutin") {
    const heroProducts = displayProducts.slice(0, 3);
    const heroPositions = [
      { x: -2.65, y: 1.48, z: 0.12, w: 1.15, h: 1.4 },
      { x: 0, y: 1.22, z: 0.16, w: 1.65, h: 1.75 },
      { x: 2.65, y: 1.48, z: 0.12, w: 1.15, h: 1.4 },
    ];
    const backRow = displayProducts.slice(0, 4);

    return (
      <group position={[xFace, 0, z]} rotation-y={rotY}>
        <mesh position={[0, 3.02, -1.02]} receiveShadow>
          <boxGeometry args={[9.7, 5.95, 0.14]} />
          <primitive object={louboutinWallMat} attach="material" />
        </mesh>

        <mesh position={[0, 6.1, -0.22]} receiveShadow>
          <boxGeometry args={[10.55, 0.44, 0.92]} />
          <primitive object={louboutinShelfMat} attach="material" />
        </mesh>
        <mesh position={[0, 5.55, 0.06]} receiveShadow>
          <boxGeometry args={[8.75, 0.72, 0.12]} />
          <meshStandardMaterial
            color={"#4b0c10"}
            roughness={0.34}
            metalness={0.08}
          />
        </mesh>
        <mesh position={[0, 5.58, 0.14]} receiveShadow>
          <boxGeometry args={[8.2, 0.08, 0.08]} />
          <meshStandardMaterial
            color={"#b99258"}
            roughness={0.2}
            metalness={0.45}
          />
        </mesh>
        <mesh position={[0, 5.18, 0.14]} receiveShadow>
          <boxGeometry args={[3.2, 0.82, 0.1]} />
          <meshStandardMaterial
            color={"#5b0f13"}
            roughness={0.28}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 5.18, 0.2]}>
          <planeGeometry args={[3.0, 0.68]} />
          <meshBasicMaterial
            map={logoTex || null}
            transparent
            alphaTest={0.05}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 5.72, 0.16]}>
          <planeGeometry args={[7.4, 0.035]} />
          <meshBasicMaterial
            color={"#e2c28a"}
            transparent
            opacity={active ? 0.75 : 0.48}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, 5.46, 0.17]}
          fontSize={0.24}
          letterSpacing={0.09}
          maxWidth={7.6}
          anchorX="center"
          anchorY="middle"
        >
          {label}
          <meshStandardMaterial
            color={"#f6e5c6"}
            emissive={"#6d1b21"}
            emissiveIntensity={active ? 0.16 : 0.08}
            toneMapped={false}
          />
        </Text>
        <mesh position={[0, 5.2, 0.16]}>
          <planeGeometry args={[5.9, 0.02]} />
          <meshBasicMaterial
            color={"#c8a56e"}
            transparent
            opacity={active ? 0.55 : 0.3}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[-5.04, 3.12, -0.26]} receiveShadow>
          <boxGeometry args={[0.24, 6.34, 0.92]} />
          <primitive object={louboutinShelfMat} attach="material" />
        </mesh>
        <mesh position={[5.04, 3.12, -0.26]} receiveShadow>
          <boxGeometry args={[0.24, 6.34, 0.92]} />
          <primitive object={louboutinShelfMat} attach="material" />
        </mesh>

        <mesh position={[-3.62, 2.95, -0.5]} receiveShadow>
          <boxGeometry args={[2.25, 5.2, 0.84]} />
          <primitive object={louboutinPanelMat} attach="material" />
        </mesh>
        <mesh position={[3.62, 2.95, -0.5]} receiveShadow>
          <boxGeometry args={[2.25, 5.2, 0.84]} />
          <primitive object={louboutinPanelMat} attach="material" />
        </mesh>

        <mesh position={[-3.62, 2.95, -0.04]} receiveShadow>
          <boxGeometry args={[1.66, 4.74, 0.08]} />
          <primitive object={louboutinDisplayGlassMat} attach="material" />
        </mesh>
        <mesh position={[3.62, 2.95, -0.04]} receiveShadow>
          <boxGeometry args={[1.66, 4.74, 0.08]} />
          <primitive object={louboutinDisplayGlassMat} attach="material" />
        </mesh>

        <mesh position={[0, 0.14, -0.28]} receiveShadow>
          <boxGeometry args={[6.2, 0.12, 0.76]} />
          <primitive object={louboutinShelfMat} attach="material" />
        </mesh>

        <mesh position={[0, 2.9, -0.92]} receiveShadow>
          <boxGeometry args={[3.4, 4.35, 0.18]} />
          <meshStandardMaterial
            color={"#7a1318"}
            roughness={0.5}
            metalness={0.06}
          />
        </mesh>

        {[-3.62, 3.62].map((x, i) => (
          <group key={`lb-side-shelves-${i}`} position={[x, 2.95, -0.34]}>
            {[-1.35, -0.45, 0.45, 1.35].map((y, idx) => (
              <group key={idx} position={[0, y, 0]}>
                <mesh receiveShadow>
                  <boxGeometry args={[1.28, 0.04, 0.22]} />
                  <primitive object={louboutinShelfMat} attach="material" />
                </mesh>
                <mesh position={[0, 0.36, 0.04]}>
                  <planeGeometry args={[0.95, 0.78]} />
                  <meshBasicMaterial
                    map={productTextures[(idx + i) % Math.max(productTextures.length, 1)] || null}
                    transparent
                    alphaTest={0.04}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        <mesh position={[0, 0.62, -0.42]} castShadow receiveShadow>
          <cylinderGeometry args={[0.86, 0.96, 0.84, 28]} />
          <primitive object={louboutinShelfMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.12, -0.42]} castShadow receiveShadow>
          <cylinderGeometry args={[1.08, 1.08, 0.14, 28]} />
          <primitive object={louboutinShelfMat} attach="material" />
        </mesh>

        {heroProducts.map((product, idx) => {
          const pose = heroPositions[idx];
          const pedestalTopY = 0.62;
          const imageY = liftFromPedestal(pedestalTopY, pose.h, 0.08);
          const nameY = 0.34;
          return (
            <group
              key={product.id}
              position={[pose.x, pose.y, pose.z]}
            >
              <mesh position={[0, -0.42, -0.08]} castShadow receiveShadow>
                <cylinderGeometry args={[0.48, 0.54, 0.14, 22]} />
                <primitive object={louboutinShelfMat} attach="material" />
              </mesh>
              <mesh position={[0, imageY, 0.04]}>
                <planeGeometry args={[pose.w, pose.h]} />
                <meshBasicMaterial
                  map={productTextures[idx] || null}
                  transparent
                  alphaTest={0.04}
                  toneMapped={false}
                />
              </mesh>
              <Text
                position={[0, nameY, 0.08]}
                fontSize={0.14}
                maxWidth={1.6}
                anchorX="center"
                anchorY="middle"
              >
                {product.name}
                <meshBasicMaterial color={"#f8eee4"} toneMapped={false} />
              </Text>
            </group>
          );
        })}

        {backRow.map((product, idx) => {
          const x = -2.1 + idx * 1.4;
          return (
            <group key={`lb-back-display-${product.id}`} position={[x, 3.46, -0.78]}>
              <mesh receiveShadow>
                <boxGeometry args={[0.96, 0.05, 0.2]} />
                <primitive object={louboutinShelfMat} attach="material" />
              </mesh>
              <mesh position={[0, 0.42, 0.04]}>
                <planeGeometry args={[0.72, 0.58]} />
                <meshBasicMaterial
                  map={productTextures[idx] || null}
                  transparent
                  alphaTest={0.04}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 3.0, 0.24]} material={louboutinDisplayGlassMat}>
          <planeGeometry args={[9.78, 5.98]} />
        </mesh>
        <mesh position={[-2.95, 3.0, 0.2]} material={louboutinDisplayGlassMat}>
          <planeGeometry args={[0.04, 5.85]} />
        </mesh>
        <mesh position={[2.95, 3.0, 0.2]} material={louboutinDisplayGlassMat}>
          <planeGeometry args={[0.04, 5.85]} />
        </mesh>

        <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -0.12]} receiveShadow>
          <planeGeometry args={[9.45, 1.5]} />
          <meshBasicMaterial
            color={"#000000"}
            transparent
            opacity={0.12}
            toneMapped={false}
          />
        </mesh>

        <spotLight
          position={[0, 5.7, 0.8]}
          intensity={3.8}
          angle={0.46}
          penumbra={0.72}
          color={"#ffd4bf"}
        />
        <pointLight
          position={[-3.45, 3.6, -0.05]}
          intensity={0.65}
          distance={4.8}
          color={"#ffd0b3"}
        />
        <pointLight
          position={[3.45, 3.6, -0.05]}
          intensity={0.65}
          distance={4.8}
          color={"#ffd0b3"}
        />
        <pointLight
          position={[0, 4.4, -0.25]}
          intensity={0.45}
          distance={5.5}
          color={accent || "#7a1f1f"}
        />
      </group>
    );
  }

  if (storeKey === "omega") {
    const heroProducts = displayProducts.slice(0, 3);
    const sideProducts = displayProducts.slice(0, 4);

    return (
      <group position={[xFace, 0, z]} rotation-y={rotY}>
        <mesh position={[0, 6.18, -0.18]} receiveShadow>
          <boxGeometry args={[10.8, 0.48, 0.96]} />
          <primitive object={omegaStoneMat} attach="material" />
        </mesh>
        <mesh position={[0, 5.96, 0.12]} receiveShadow>
          <boxGeometry args={[10.35, 0.08, 0.08]} />
          <primitive object={omegaBrassMat} attach="material" />
        </mesh>

        <mesh position={[-5.16, 3.05, -0.22]} receiveShadow>
          <boxGeometry args={[0.34, 6.24, 0.9]} />
          <primitive object={omegaStoneMat} attach="material" />
        </mesh>
        <mesh position={[5.16, 3.05, -0.22]} receiveShadow>
          <boxGeometry args={[0.34, 6.24, 0.9]} />
          <primitive object={omegaStoneMat} attach="material" />
        </mesh>

        <mesh position={[-3.6, 3.0, -0.56]} receiveShadow>
          <boxGeometry args={[2.2, 5.2, 0.84]} />
          <primitive object={omegaBlueMat} attach="material" />
        </mesh>
        <mesh position={[3.6, 3.0, -0.56]} receiveShadow>
          <boxGeometry args={[2.2, 5.2, 0.84]} />
          <primitive object={omegaBlueMat} attach="material" />
        </mesh>

        <mesh position={[0, 3.0, -0.96]} receiveShadow>
          <boxGeometry args={[3.7, 5.1, 0.16]} />
          <primitive object={omegaStoneMat} attach="material" />
        </mesh>

        <mesh position={[0, 5.38, 0.16]}>
          <planeGeometry args={[2.45, 0.58]} />
          <meshBasicMaterial
            map={logoTex || null}
            transparent
            alphaTest={0.05}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, 4.95, 0.16]}
          fontSize={0.24}
          letterSpacing={0.12}
          maxWidth={4.4}
          anchorX="center"
          anchorY="middle"
        >
          {label}
          <meshStandardMaterial
            color={"#f7f2e8"}
            emissive={"#2e4f8e"}
            emissiveIntensity={active ? 0.14 : 0.06}
            toneMapped={false}
          />
        </Text>
        <mesh position={[0, 4.72, 0.15]}>
          <planeGeometry args={[3.1, 0.02]} />
          <meshBasicMaterial
            color={"#b8945a"}
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>

        {[-3.6, 3.6].map((x, i) => (
          <group key={`omega-side-${i}`} position={[x, 2.9, -0.1]}>
            {[-1.4, -0.45, 0.45, 1.35].map((y, idx) => (
              <group key={idx} position={[0, y, 0]}>
                <mesh receiveShadow>
                  <boxGeometry args={[1.28, 0.04, 0.22]} />
                  <primitive object={omegaBrassMat} attach="material" />
                </mesh>
                <mesh position={[0, 0.36, 0.04]}>
                  <planeGeometry args={[0.86, 0.64]} />
                  <meshBasicMaterial
                    map={productTextures[(idx + i) % Math.max(productTextures.length, 1)] || null}
                    transparent
                    alphaTest={0.04}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {heroProducts.map((product, idx) => {
          const x = -1.75 + idx * 1.75;
          const imageHeight = 0.42;
          const imageY = liftFromPedestal(0.01, imageHeight, 0.06);
          return (
            <group key={`omega-hero-${product.id}`} position={[x, 1.0, -0.34]}>
              <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.15, 0.58, 0.7]} />
                <primitive object={omegaCaseMat} attach="material" />
              </mesh>
              <mesh position={[0, 0.18, 0.24]} material={omegaGlassMat}>
                <boxGeometry args={[1.05, 0.52, 0.42]} />
              </mesh>
              <mesh position={[0, imageY, 0.28]}>
                <planeGeometry args={[0.72, imageHeight]} />
                <meshBasicMaterial
                  map={productTextures[idx] || null}
                  transparent
                  alphaTest={0.04}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 0.52, -0.44]} castShadow receiveShadow>
          <boxGeometry args={[3.9, 0.76, 0.9]} />
          <primitive object={omegaCaseMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.02, -0.22]} material={omegaGlassMat}>
          <boxGeometry args={[3.7, 0.46, 0.46]} />
        </mesh>

        {sideProducts.map((product, idx) => {
          const x = -2.1 + idx * 1.4;
          return (
            <group key={`omega-back-${product.id}`} position={[x, 3.25, -0.82]}>
              <mesh receiveShadow>
                <boxGeometry args={[0.92, 0.05, 0.18]} />
                <primitive object={omegaBrassMat} attach="material" />
              </mesh>
              <mesh position={[0, 0.34, 0.04]}>
                <planeGeometry args={[0.62, 0.5]} />
                <meshBasicMaterial
                  map={productTextures[idx] || null}
                  transparent
                  alphaTest={0.04}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 3.0, 0.24]} material={omegaGlassMat}>
          <planeGeometry args={[10.05, 6.02]} />
        </mesh>
        <mesh position={[-2.95, 3.0, 0.2]} material={omegaGlassMat}>
          <planeGeometry args={[0.04, 5.9]} />
        </mesh>
        <mesh position={[2.95, 3.0, 0.2]} material={omegaGlassMat}>
          <planeGeometry args={[0.04, 5.9]} />
        </mesh>

        <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -0.1]} receiveShadow>
          <planeGeometry args={[9.9, 1.4]} />
          <meshBasicMaterial
            color={"#000000"}
            transparent
            opacity={0.08}
            toneMapped={false}
          />
        </mesh>

        <spotLight
          position={[0, 5.6, 0.9]}
          intensity={3.4}
          angle={0.42}
          penumbra={0.68}
          color={"#fff4df"}
        />
        <pointLight
          position={[-3.6, 3.45, -0.04]}
          intensity={0.55}
          distance={5.2}
          color={"#c7dcff"}
        />
        <pointLight
          position={[3.6, 3.45, -0.04]}
          intensity={0.55}
          distance={5.2}
          color={"#c7dcff"}
        />
        <pointLight
          position={[0, 3.8, -0.32]}
          intensity={0.36}
          distance={5.6}
          color={accent || "#123e7a"}
        />
      </group>
    );
  }

  if (storeKey === "prada") {
    const heroProducts = displayProducts.slice(0, 3);
    const sideProducts = displayProducts.slice(0, 4);

    return (
      <group position={[xFace, 0, z]} rotation-y={rotY}>
        <mesh position={[0, 6.1, -0.16]} receiveShadow>
          <boxGeometry args={[10.75, 0.44, 0.88]} />
          <primitive object={pradaStoneMat} attach="material" />
        </mesh>
        <mesh position={[-5.12, 3.0, -0.2]} receiveShadow>
          <boxGeometry args={[0.34, 6.18, 0.86]} />
          <primitive object={pradaStoneMat} attach="material" />
        </mesh>
        <mesh position={[5.12, 3.0, -0.2]} receiveShadow>
          <boxGeometry args={[0.34, 6.18, 0.86]} />
          <primitive object={pradaStoneMat} attach="material" />
        </mesh>

        <mesh position={[0, 3.0, -1.0]} receiveShadow>
          <boxGeometry args={[9.9, 5.95, 0.14]} />
          <primitive object={pradaStoneMat} attach="material" />
        </mesh>
        <mesh position={[0, 3.0, -0.92]} receiveShadow>
          <boxGeometry args={[3.8, 5.15, 0.18]} />
          <primitive object={pradaPanelMat} attach="material" />
        </mesh>

        <mesh position={[-4.42, 3.0, -0.38]} receiveShadow>
          <boxGeometry args={[1.1, 5.45, 0.12]} />
          <primitive object={pradaGlowMat} attach="material" />
        </mesh>
        <mesh position={[4.42, 3.0, -0.38]} receiveShadow>
          <boxGeometry args={[1.1, 5.45, 0.12]} />
          <primitive object={pradaGlowMat} attach="material" />
        </mesh>

        <mesh position={[0, 5.26, 0.18]}>
          <planeGeometry args={[2.2, 0.52]} />
          <meshBasicMaterial
            map={logoTex || null}
            transparent
            alphaTest={0.05}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, 4.86, 0.18]}
          fontSize={0.23}
          letterSpacing={0.11}
          maxWidth={4.2}
          anchorX="center"
          anchorY="middle"
        >
          {label}
          <meshStandardMaterial
            color={"#fffaf0"}
            emissive={"#546d68"}
            emissiveIntensity={active ? 0.12 : 0.05}
            toneMapped={false}
          />
        </Text>
        <mesh position={[0, 4.66, 0.16]}>
          <planeGeometry args={[2.8, 0.02]} />
          <meshBasicMaterial
            color={"#b7a491"}
            transparent
            opacity={0.45}
            toneMapped={false}
          />
        </mesh>

        {[-3.05, 3.05].map((x, sideIndex) => (
          <group key={`prada-side-${sideIndex}`} position={[x, 2.88, -0.18]}>
            {[-1.45, -0.48, 0.48, 1.42].map((y, idx) => (
              <group key={idx} position={[0, y, 0]}>
                <mesh receiveShadow>
                  <boxGeometry args={[1.42, 0.04, 0.22]} />
                  <primitive object={pradaMetalMat} attach="material" />
                </mesh>
                <mesh position={[0, 0.38, 0.04]}>
                  <planeGeometry args={[0.96, 0.74]} />
                  <meshBasicMaterial
                    map={productTextures[(idx + sideIndex) % Math.max(productTextures.length, 1)] || null}
                    transparent
                    alphaTest={0.04}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {heroProducts.map((product, idx) => {
          const x = -1.6 + idx * 1.6;
          const imageHeight = 0.44;
          const imageY = liftFromPedestal(0.05, imageHeight, 0.06);
          return (
            <group key={`prada-hero-${product.id}`} position={[x, 1.02, -0.34]}>
              <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.02, 0.66, 0.68]} />
                <primitive object={pradaStoneMat} attach="material" />
              </mesh>
              <mesh position={[0, 0.22, 0.24]} material={pradaGlassMat}>
                <boxGeometry args={[0.92, 0.56, 0.4]} />
              </mesh>
              <mesh position={[0, imageY, 0.28]}>
                <planeGeometry args={[0.68, imageHeight]} />
                <meshBasicMaterial
                  map={productTextures[idx] || null}
                  transparent
                  alphaTest={0.04}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 0.54, -0.46]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.14, 1.12]} />
          <primitive object={pradaTableMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.1, -0.46]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.74, 0.22]} />
          <primitive object={pradaTableMat} attach="material" />
        </mesh>

        {sideProducts.map((product, idx) => {
          const x = -2.1 + idx * 1.4;
          return (
            <group key={`prada-back-${product.id}`} position={[x, 3.2, -0.84]}>
              <mesh receiveShadow>
                <boxGeometry args={[0.94, 0.05, 0.18]} />
                <primitive object={pradaMetalMat} attach="material" />
              </mesh>
              <mesh position={[0, 0.36, 0.04]}>
                <planeGeometry args={[0.62, 0.48]} />
                <meshBasicMaterial
                  map={productTextures[idx] || null}
                  transparent
                  alphaTest={0.04}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 3.0, 0.24]} material={pradaGlassMat}>
          <planeGeometry args={[10.0, 6.0]} />
        </mesh>
        <mesh position={[-2.78, 3.0, 0.2]} material={pradaGlassMat}>
          <planeGeometry args={[0.04, 5.9]} />
        </mesh>
        <mesh position={[2.78, 3.0, 0.2]} material={pradaGlassMat}>
          <planeGeometry args={[0.04, 5.9]} />
        </mesh>

        <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -0.1]} receiveShadow>
          <planeGeometry args={[9.8, 1.35]} />
          <meshBasicMaterial
            color={"#000000"}
            transparent
            opacity={0.08}
            toneMapped={false}
          />
        </mesh>

        <spotLight
          position={[0, 5.55, 0.9]}
          intensity={3.3}
          angle={0.42}
          penumbra={0.68}
          color={"#fff6e8"}
        />
        <pointLight
          position={[-4.42, 3.3, -0.18]}
          intensity={0.5}
          distance={5.4}
          color={"#dcf7f1"}
        />
        <pointLight
          position={[4.42, 3.3, -0.18]}
          intensity={0.5}
          distance={5.4}
          color={"#dcf7f1"}
        />
        <pointLight
          position={[0, 4.05, -0.26]}
          intensity={0.34}
          distance={5.4}
          color={accent || "#1f4b54"}
        />
      </group>
    );
  }

  if (storeKey === "jimmychoo") {
    const heroProducts = displayProducts.slice(0, 3);
    const sideProducts = displayProducts.slice(0, 4);

    return (
      <group position={[xFace, 0, z]} rotation-y={rotY}>
        <mesh position={[0, 6.08, -0.16]} receiveShadow>
          <boxGeometry args={[10.8, 0.42, 0.88]} />
          <primitive object={jimmyStoneMat} attach="material" />
        </mesh>
        <mesh position={[-5.12, 3.0, -0.18]} receiveShadow>
          <boxGeometry args={[0.32, 6.18, 0.84]} />
          <primitive object={jimmyChampagneMat} attach="material" />
        </mesh>
        <mesh position={[5.12, 3.0, -0.18]} receiveShadow>
          <boxGeometry args={[0.32, 6.18, 0.84]} />
          <primitive object={jimmyChampagneMat} attach="material" />
        </mesh>

        <mesh position={[0, 3.0, -1.0]} receiveShadow>
          <boxGeometry args={[9.95, 5.95, 0.14]} />
          <primitive object={jimmyStoneMat} attach="material" />
        </mesh>
        <mesh position={[0, 3.0, -0.92]} receiveShadow>
          <boxGeometry args={[3.6, 5.15, 0.18]} />
          <primitive object={jimmyWarmPanelMat} attach="material" />
        </mesh>

        <mesh position={[-3.08, 2.92, -0.18]} receiveShadow>
          <boxGeometry args={[2.05, 5.3, 0.16]} />
          <primitive object={jimmyStoneMat} attach="material" />
        </mesh>
        <mesh position={[3.08, 2.92, -0.18]} receiveShadow>
          <boxGeometry args={[2.05, 5.3, 0.16]} />
          <primitive object={jimmyStoneMat} attach="material" />
        </mesh>

        <mesh position={[0, 5.26, 0.18]}>
          <planeGeometry args={[2.35, 0.56]} />
          <meshBasicMaterial
            map={logoTex || null}
            transparent
            alphaTest={0.05}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, 4.86, 0.18]}
          fontSize={0.22}
          letterSpacing={0.1}
          maxWidth={4.5}
          anchorX="center"
          anchorY="middle"
        >
          {label}
          <meshStandardMaterial
            color={"#fff8ef"}
            emissive={"#6c5a42"}
            emissiveIntensity={active ? 0.1 : 0.04}
            toneMapped={false}
          />
        </Text>
        <mesh position={[0, 4.66, 0.16]}>
          <planeGeometry args={[3.0, 0.02]} />
          <meshBasicMaterial
            color={"#b89f7d"}
            transparent
            opacity={0.42}
            toneMapped={false}
          />
        </mesh>

        {[-3.08, 3.08].map((x, sideIndex) => (
          <group key={`jimmy-side-${sideIndex}`} position={[x, 2.88, -0.12]}>
            {[-1.45, -0.48, 0.48, 1.42].map((y, idx) => (
              <group key={idx} position={[0, y, 0]}>
                <mesh receiveShadow>
                  <boxGeometry args={[1.46, 0.04, 0.22]} />
                  <primitive object={jimmyChampagneMat} attach="material" />
                </mesh>
                <mesh position={[0, 0.38, 0.04]}>
                  <planeGeometry args={[0.98, 0.76]} />
                  <meshBasicMaterial
                    map={productTextures[(idx + sideIndex) % Math.max(productTextures.length, 1)] || null}
                    transparent
                    alphaTest={0.04}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {heroProducts.map((product, idx) => {
          const x = -1.7 + idx * 1.7;
          const imageHeight = 0.58;
          const imageY = liftFromPedestal(-0.04, imageHeight, 0.06);
          return (
            <group key={`jimmy-hero-${product.id}`} position={[x, 0.98, -0.34]}>
              <mesh position={[0, -0.26, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.42, 0.48, 0.44, 20]} />
                <primitive object={jimmyTableMat} attach="material" />
              </mesh>
              <mesh position={[0, imageY, 0.06]}>
                <planeGeometry args={[0.76, imageHeight]} />
                <meshBasicMaterial
                  map={productTextures[idx] || null}
                  transparent
                  alphaTest={0.04}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 0.54, -0.44]} castShadow receiveShadow>
          <cylinderGeometry args={[0.92, 1.02, 0.66, 26]} />
          <primitive object={jimmyTableMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.0, -0.44]} castShadow receiveShadow>
          <cylinderGeometry args={[1.12, 1.12, 0.1, 26]} />
          <primitive object={jimmyChampagneMat} attach="material" />
        </mesh>

        {sideProducts.map((product, idx) => {
          const x = -2.1 + idx * 1.4;
          return (
            <group key={`jimmy-back-${product.id}`} position={[x, 3.18, -0.84]}>
              <mesh receiveShadow>
                <boxGeometry args={[0.94, 0.05, 0.18]} />
                <primitive object={jimmyChampagneMat} attach="material" />
              </mesh>
              <mesh position={[0, 0.34, 0.04]}>
                <planeGeometry args={[0.62, 0.48]} />
                <meshBasicMaterial
                  map={productTextures[idx] || null}
                  transparent
                  alphaTest={0.04}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 3.0, 0.24]} material={jimmyGlassMat}>
          <planeGeometry args={[10.0, 6.0]} />
        </mesh>
        <mesh position={[-2.82, 3.0, 0.2]} material={jimmyGlassMat}>
          <planeGeometry args={[0.04, 5.9]} />
        </mesh>
        <mesh position={[2.82, 3.0, 0.2]} material={jimmyGlassMat}>
          <planeGeometry args={[0.04, 5.9]} />
        </mesh>

        <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -0.1]} receiveShadow>
          <planeGeometry args={[9.85, 1.35]} />
          <meshBasicMaterial
            color={"#000000"}
            transparent
            opacity={0.08}
            toneMapped={false}
          />
        </mesh>

        <spotLight
          position={[0, 5.55, 0.9]}
          intensity={3.15}
          angle={0.42}
          penumbra={0.68}
          color={"#fff4e6"}
        />
        <pointLight
          position={[-3.08, 3.3, -0.18]}
          intensity={0.42}
          distance={5.2}
          color={"#fff0dd"}
        />
        <pointLight
          position={[3.08, 3.3, -0.18]}
          intensity={0.42}
          distance={5.2}
          color={"#fff0dd"}
        />
        <pointLight
          position={[0, 4.0, -0.26]}
          intensity={0.3}
          distance={5.2}
          color={accent || "#6b5a3c"}
        />
      </group>
    );
  }

  return (
    <group position={[xFace, 0, z]} rotation-y={rotY}>
      <mesh position={[0, 3.04, -portalDepth]} receiveShadow>
        <boxGeometry args={[look.frameW - 0.45, look.frameH - 0.24, 0.12]} />
        <primitive object={backPanelMat} attach="material" />
      </mesh>

      <mesh position={[-5.08, 3.03, -0.42]} receiveShadow>
        <boxGeometry args={[0.26, 6.18, portalDepth]} />
        <primitive object={innerWallMat} attach="material" />
      </mesh>
      <mesh position={[5.08, 3.03, -0.42]} receiveShadow>
        <boxGeometry args={[0.26, 6.18, portalDepth]} />
        <primitive object={innerWallMat} attach="material" />
      </mesh>
      <mesh position={[0, 6.02, -0.42]} receiveShadow>
        <boxGeometry args={[10.0, 0.22, portalDepth]} />
        <primitive object={canopyMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.06, -0.34]} receiveShadow>
        <boxGeometry args={[10.0, 0.12, 0.72]} />
        <primitive object={thresholdMat} attach="material" />
      </mesh>

      <mesh position={[0, 3.03, -0.5]} receiveShadow>
        <planeGeometry args={[look.imageW, look.imageH]} />
        <meshBasicMaterial
          map={facadeTex || null}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-5.16, 3.18, 0.1]} receiveShadow>
        <boxGeometry args={[0.18, 6.42, 0.14]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[5.16, 3.18, 0.1]} receiveShadow>
        <boxGeometry args={[0.18, 6.42, 0.14]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[0, 6.18, 0.1]} receiveShadow>
        <boxGeometry args={[10.5, 0.18, 0.14]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.02, 0.1]} receiveShadow>
        <boxGeometry args={[10.5, 0.14, 0.14]} />
        <primitive object={trimMat} attach="material" />
      </mesh>

      <mesh position={[0, 5.94, 0.18]}>
        <planeGeometry args={[9.9, 0.14]} />
        <meshBasicMaterial
          color={look.headerGlow || look.glow || "#fff3e1"}
          transparent
          opacity={active ? 0.32 : 0.14}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[-4.82, 3.03, 0.18]}>
        <planeGeometry args={[0.14, look.imageH * 0.98]} />
        <meshBasicMaterial
          color={look.sideGlow || look.glow || "#fff3e1"}
          transparent
          opacity={active ? 0.18 : 0.07}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[4.82, 3.03, 0.18]}>
        <planeGeometry args={[0.14, look.imageH * 0.98]} />
        <meshBasicMaterial
          color={look.sideGlow || look.glow || "#fff3e1"}
          transparent
          opacity={active ? 0.18 : 0.07}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 3.03, 0.26]} material={glassMat}>
        <planeGeometry args={[look.imageW * 0.998, look.imageH * 0.998]} />
      </mesh>
      <mesh position={[-2.62, 3.03, 0.2]} material={glassMat}>
        <planeGeometry args={[0.04, look.imageH * 0.98]} />
      </mesh>
      <mesh position={[2.62, 3.03, 0.2]} material={glassMat}>
        <planeGeometry args={[0.04, look.imageH * 0.98]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -0.16]} receiveShadow>
        <planeGeometry args={[9.2, 1.2]} />
        <meshBasicMaterial
          color={"#000000"}
          transparent
          opacity={0.08}
          toneMapped={false}
        />
      </mesh>

      <spotLight
        position={[0, 5.7, 0.9]}
        intensity={3.2}
        angle={0.42}
        penumbra={0.65}
        color={look.glow || warmth}
      />
      <rectAreaLight
        position={[0, 3.2, 0.58]}
        width={6.4}
        height={4.8}
        intensity={active ? 3.6 : 2.0}
        color={look.glow || "#fff3e1"}
      />
    </group>
  );
} /* ---------------------------------------------
   Avatar
---------------------------------------------- */
function SilhouetteAvatar({ positionRef, yawRef, movingRef, visible = true }) {
  const g = useRef();

  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#151a22"),
        roughness: 0.4,
        metalness: 0.14,
        emissive: new THREE.Color("#060a10"),
        emissiveIntensity: 0.18,
      }),
    [],
  );
  const torsoMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1f2630"),
        roughness: 0.46,
        metalness: 0.14,
        emissive: new THREE.Color("#081018"),
        emissiveIntensity: 0.14,
      }),
    [],
  );
  const limbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#12171f"),
        roughness: 0.5,
        metalness: 0.1,
      }),
    [],
  );

  useFrame((state) => {
    if (!g.current) return;
    g.current.visible = !!visible;

    const p = positionRef.current;
    g.current.position.set(p.x, p.y, p.z);
    g.current.rotation.y = yawRef.current;

    const t = state.clock.getElapsedTime();
    const walking = movingRef.current;

    const swing = walking ? Math.sin(t * 7.2) : 0;
    const swing2 = walking ? Math.sin(t * 7.2 + Math.PI) : 0;
    const bob = walking ? Math.sin(t * 14.4) * 0.03 : 0;

    const torso = g.current.getObjectByName("torso");
    const head = g.current.getObjectByName("head");
    const armL = g.current.getObjectByName("armL");
    const armR = g.current.getObjectByName("armR");
    const legL = g.current.getObjectByName("legL");
    const legR = g.current.getObjectByName("legR");

    if (!torso) return;

    torso.position.y = 1.48 + bob;
    head.position.y = 2.48 + bob;

    armL.rotation.x = swing * 0.55;
    armR.rotation.x = swing2 * 0.55;
    legL.rotation.x = swing2 * 0.65;
    legR.rotation.x = swing * 0.65;
  });

  return (
    <group ref={g}>
      <mesh name="torso" material={torsoMat} position={[0, 1.48, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.92, 10, 18]} />
      </mesh>
      <mesh name="head" material={headMat} position={[0, 2.48, 0]} castShadow>
        <sphereGeometry args={[0.25, 24, 24]} />
      </mesh>
      <mesh name="armL" material={limbMat} position={[-0.42, 1.65, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.68, 8, 16]} />
      </mesh>
      <mesh name="armR" material={limbMat} position={[0.42, 1.65, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.68, 8, 16]} />
      </mesh>
      <mesh name="legL" material={limbMat} position={[-0.17, 0.76, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.78, 8, 16]} />
      </mesh>
      <mesh name="legR" material={limbMat} position={[0.17, 0.76, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.78, 8, 16]} />
      </mesh>
      <mesh position={[0, 1.78, 0.19]} material={torsoMat} castShadow>
        <capsuleGeometry args={[0.1, 0.3, 8, 12]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[0.45, 24]} />
        <meshStandardMaterial color={"#000000"} opacity={0.12} transparent />
      </mesh>
    </group>
  );
}

function AmbientShopper({
  anchor = [0, 0, 0],
  heading = 0,
  scale = 1,
  variant = "male",
  label = "Shopper Live",
  prompt = "Elly matched a boutique favorite.",
  promptOptions = null,
  playerPosRef = null,
  driftRadius = 0.48,
  driftSpeed = 0.72,
}) {
  const g = useRef();
  const bubbleRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const AVATAR_DIMENSIONS = {
    torsoY: 1.48,
    torsoRadius: 0.28,
    torsoLength: 0.92,
    headY: 2.48,
    headRadius: 0.25,
    armY: 1.65,
    armX: 0.42,
    armRadius: 0.11,
    armLength: 0.68,
    legY: 0.76,
    legX: 0.17,
    legRadius: 0.12,
    legLength: 0.78,
  };
  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1d24"),
        roughness: 0.42,
        metalness: 0.12,
        emissive: new THREE.Color("#05080d"),
        emissiveIntensity: 0.16,
      }),
    [],
  );
  const torsoMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#232833"),
        roughness: 0.48,
        metalness: 0.12,
        emissive: new THREE.Color("#06080d"),
        emissiveIntensity: 0.12,
      }),
    [],
  );
  const limbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#151922"),
        roughness: 0.52,
        metalness: 0.08,
      }),
    [],
  );
  const accent = variant === "female" ? "#e7b6d7" : "#8bd3ff";
  const bubbleOffsetX = anchor[0] < 0 ? 1.18 : -1.18;
  const bubbleTailX = bubbleOffsetX > 0 ? -0.62 : 0.62;
  const resolvedPromptOptions = useMemo(
    () => (promptOptions?.length ? promptOptions : [prompt]).filter(Boolean),
    [promptOptions, prompt],
  );
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const bubbleFaceShape = useMemo(() => {
    const width = 2.3;
    const height = 1.04;
    const radius = 0.18;
    const x = -width / 2;
    const y = -height / 2;
    const shape = new THREE.Shape();
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
  }, []);
  const bubbleEdgeShape = useMemo(() => {
    const width = 2.36;
    const height = 1.1;
    const radius = 0.2;
    const x = -width / 2;
    const y = -height / 2;
    const shape = new THREE.Shape();
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
  }, []);

  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.getElapsedTime();
    const walkPhase = t * (4.8 + driftSpeed * 6.8) + anchor[0] * 0.3;
    const offsetX = Math.sin(t * driftSpeed + anchor[2] * 0.09) * driftRadius;
    const offsetZ = Math.cos(t * (driftSpeed * 0.82) + anchor[0] * 0.08) * driftRadius * 0.9;
    g.current.position.x = anchor[0] + offsetX;
    g.current.position.y = anchor[1] + Math.sin(t * 1.4 + anchor[2]) * 0.03;
    g.current.position.z = anchor[2] + offsetZ;
    g.current.rotation.y = heading + Math.atan2(offsetX, Math.max(0.08, offsetZ + driftRadius)) * 0.35;

    const limbSwing = Math.sin(walkPhase) * 0.42;
    if (leftArmRef.current) leftArmRef.current.rotation.z = 0.12 + limbSwing * 0.22;
    if (rightArmRef.current) rightArmRef.current.rotation.z = -0.12 - limbSwing * 0.22;
    if (leftLegRef.current) leftLegRef.current.rotation.x = limbSwing * 0.28;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -limbSwing * 0.28;

    if (bubbleRef.current && playerPosRef?.current) {
      const px = playerPosRef.current.x;
      const pz = playerPosRef.current.z;
      const dx = px - g.current.position.x;
      const dz = pz - g.current.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      bubbleRef.current.visible = dist < 4.65;
      bubbleRef.current.position.y = Math.sin(t * 2.1 + anchor[0]) * 0.03;
    }
  });

  useEffect(() => {
    setActivePromptIndex(0);
  }, [resolvedPromptOptions]);

  useEffect(() => {
    if (resolvedPromptOptions.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % resolvedPromptOptions.length);
    }, 2100);
    return () => window.clearInterval(timer);
  }, [resolvedPromptOptions]);

  const activePrompt =
    resolvedPromptOptions[activePromptIndex % resolvedPromptOptions.length] || prompt;

  return (
    <group ref={g} position={anchor} scale={scale}>
      <mesh
        position={[0, AVATAR_DIMENSIONS.headY, 0]}
        castShadow
        material={headMat}
      >
        <sphereGeometry args={[AVATAR_DIMENSIONS.headRadius, 24, 24]} />
      </mesh>
      {variant === "female" ? (
        <>
          <mesh
            position={[0, AVATAR_DIMENSIONS.torsoY + 0.16, 0]}
            castShadow
            material={torsoMat}
          >
            <capsuleGeometry args={[0.2, 0.42, 8, 14]} />
          </mesh>
          <mesh
            position={[0, AVATAR_DIMENSIONS.torsoY - 0.44, 0]}
            castShadow
            material={torsoMat}
          >
            <coneGeometry args={[0.46, 1.0, 3]} />
          </mesh>
          <mesh
            ref={leftArmRef}
            position={[-AVATAR_DIMENSIONS.armX, AVATAR_DIMENSIONS.armY, 0]}
            rotation-z={0.12}
            castShadow
            material={limbMat}
          >
            <capsuleGeometry
              args={[AVATAR_DIMENSIONS.armRadius, AVATAR_DIMENSIONS.armLength, 8, 16]}
            />
          </mesh>
          <mesh
            ref={rightArmRef}
            position={[AVATAR_DIMENSIONS.armX, AVATAR_DIMENSIONS.armY, 0]}
            rotation-z={-0.12}
            castShadow
            material={limbMat}
          >
            <capsuleGeometry
              args={[AVATAR_DIMENSIONS.armRadius, AVATAR_DIMENSIONS.armLength, 8, 16]}
            />
          </mesh>
          <mesh
            ref={leftLegRef}
            position={[-AVATAR_DIMENSIONS.legX, AVATAR_DIMENSIONS.legY - 0.08, 0]}
            castShadow
            material={limbMat}
          >
            <capsuleGeometry args={[0.09, 0.6, 6, 12]} />
          </mesh>
          <mesh
            ref={rightLegRef}
            position={[AVATAR_DIMENSIONS.legX, AVATAR_DIMENSIONS.legY - 0.08, 0]}
            castShadow
            material={limbMat}
          >
            <capsuleGeometry args={[0.09, 0.6, 6, 12]} />
          </mesh>
        </>
      ) : (
        <>
          <mesh
            position={[0, AVATAR_DIMENSIONS.torsoY, 0]}
            castShadow
            material={torsoMat}
          >
            <capsuleGeometry
              args={[
                AVATAR_DIMENSIONS.torsoRadius,
                AVATAR_DIMENSIONS.torsoLength,
                10,
                18,
              ]}
            />
          </mesh>
          <mesh
            ref={leftArmRef}
            position={[-AVATAR_DIMENSIONS.armX, AVATAR_DIMENSIONS.armY, 0]}
            rotation-z={0.12}
            castShadow
            material={limbMat}
          >
            <capsuleGeometry
              args={[AVATAR_DIMENSIONS.armRadius, AVATAR_DIMENSIONS.armLength, 8, 16]}
            />
          </mesh>
          <mesh
            ref={rightArmRef}
            position={[AVATAR_DIMENSIONS.armX, AVATAR_DIMENSIONS.armY, 0]}
            rotation-z={-0.12}
            castShadow
            material={limbMat}
          >
            <capsuleGeometry
              args={[AVATAR_DIMENSIONS.armRadius, AVATAR_DIMENSIONS.armLength, 8, 16]}
            />
          </mesh>
          <mesh
            ref={leftLegRef}
            position={[-AVATAR_DIMENSIONS.legX, AVATAR_DIMENSIONS.legY, 0]}
            castShadow
            material={limbMat}
          >
            <capsuleGeometry
              args={[AVATAR_DIMENSIONS.legRadius, AVATAR_DIMENSIONS.legLength, 8, 16]}
            />
          </mesh>
          <mesh
            ref={rightLegRef}
            position={[AVATAR_DIMENSIONS.legX, AVATAR_DIMENSIONS.legY, 0]}
            castShadow
            material={limbMat}
          >
            <capsuleGeometry
              args={[AVATAR_DIMENSIONS.legRadius, AVATAR_DIMENSIONS.legLength, 8, 16]}
            />
          </mesh>
        </>
      )}
      <mesh position={[0, AVATAR_DIMENSIONS.headY + 0.46, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={new THREE.Color(accent)}
          emissiveIntensity={0.55}
          roughness={0.28}
          metalness={0.12}
        />
      </mesh>
      <group ref={bubbleRef}>
        <Billboard position={[bubbleOffsetX, AVATAR_DIMENSIONS.headY + 1.08, 0]} follow>
          <mesh position={[bubbleTailX * 0.54, -0.44, -0.01]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial
              color={"#7fe7ff"}
              transparent
              opacity={0.18}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[bubbleTailX, -0.28, -0.01]}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshBasicMaterial
              color={"#7fe7ff"}
              transparent
              opacity={0.26}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, -0.038]}>
            <shapeGeometry args={[bubbleEdgeShape]} />
            <meshBasicMaterial
              color={"#7fe7ff"}
              transparent
              opacity={0.12}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, -0.03]}>
            <shapeGeometry args={[bubbleFaceShape]} />
            <meshBasicMaterial
              color={"#0b1c2b"}
              transparent
              opacity={0.76}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <Text
            position={[0, 0.27, 0.02]}
            fontSize={0.128}
            maxWidth={1.96}
            anchorX="center"
            anchorY="middle"
          >
            {label}
            <meshBasicMaterial color={"#86ddff"} toneMapped={false} />
          </Text>
          <Text
            position={[0, -0.055, 0.02]}
            fontSize={0.112}
            maxWidth={2.02}
            lineHeight={1.1}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {activePrompt}
            <meshBasicMaterial color={"#e6fbff"} toneMapped={false} />
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

function AmbientShoppers({ playerPosRef, interaction = null }) {
  const resolvedConfigs = AMBIENT_SHOPPER_CONFIGS.map((cfg, idx) => ({
    ...cfg,
    promptOptions:
      interaction && interaction.userIndex === idx && interaction.prompts?.length
        ? interaction.prompts
        : null,
  }));

  return (
    <group>
      {resolvedConfigs.map((cfg) => (
        <AmbientShopper key={`${cfg.anchor.join("-")}`} {...cfg} playerPosRef={playerPosRef} />
      ))}
    </group>
  );
}

function CompanionAvatar({
  positionRef,
  yawRef,
  movingRef,
  visible = true,
  variant = "female",
  label = "Remote Friend",
  prompt = "Dual Elly session active.",
  promptOptions = null,
}) {
  const g = useRef();
  const bubbleRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const AVATAR_DIMENSIONS = {
    torsoY: 1.48,
    torsoRadius: 0.28,
    torsoLength: 0.92,
    headY: 2.48,
    headRadius: 0.25,
    armY: 1.65,
    armX: 0.42,
    armRadius: 0.11,
    armLength: 0.68,
    legY: 0.76,
    legX: 0.17,
    legRadius: 0.12,
    legLength: 0.78,
  };
  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#181b22"),
        roughness: 0.42,
        metalness: 0.12,
        emissive: new THREE.Color("#05080d"),
        emissiveIntensity: 0.16,
      }),
    [],
  );
  const torsoMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#20242d"),
        roughness: 0.48,
        metalness: 0.12,
        emissive: new THREE.Color("#06080d"),
        emissiveIntensity: 0.12,
      }),
    [],
  );
  const limbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#161921"),
        roughness: 0.52,
        metalness: 0.08,
      }),
    [],
  );
  const accent = variant === "female" ? "#f3b7d7" : "#8bd3ff";
  const bubbleOffsetX = 1.18;
  const bubbleTailX = -0.62;
  const resolvedPromptOptions = useMemo(
    () =>
      (promptOptions && promptOptions.length
        ? promptOptions
        : [
            "Friend Elly is comparing picks with your session.",
            "Remote shopper is reviewing matches from the shared shortlist.",
            "Friend Elly is syncing overlap and gift-fit signals.",
          ]).filter(Boolean),
    [promptOptions],
  );
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const bubbleFaceShape = useMemo(() => {
    const width = 2.3;
    const height = 1.04;
    const radius = 0.18;
    const x = -width / 2;
    const y = -height / 2;
    const shape = new THREE.Shape();
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
  }, []);
  const bubbleEdgeShape = useMemo(() => {
    const width = 2.36;
    const height = 1.1;
    const radius = 0.2;
    const x = -width / 2;
    const y = -height / 2;
    const shape = new THREE.Shape();
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
  }, []);

  useFrame(({ clock }) => {
    if (!g.current) return;
    g.current.visible = !!visible;
    const base = positionRef.current;
    const yaw = yawRef.current;
    const offsetX = Math.cos(yaw) * 0.95 + Math.sin(yaw) * 1.05;
    const offsetZ = Math.sin(yaw) * 0.95 - Math.cos(yaw) * 1.05;
    g.current.position.set(base.x - offsetX, base.y, base.z - offsetZ);
    g.current.rotation.y = yaw * 0.94;
    const t = clock.getElapsedTime();
    g.current.position.y = base.y + Math.sin(t * 1.3) * 0.02;
    const swing = movingRef.current ? Math.sin(t * 7.4) * 0.42 : 0;
    if (leftArmRef.current) leftArmRef.current.rotation.z = 0.12 + swing * 0.22;
    if (rightArmRef.current) rightArmRef.current.rotation.z = -0.12 - swing * 0.22;
    if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * 0.28;
    if (rightLegRef.current) rightLegRef.current.rotation.x = swing * 0.28;
    if (bubbleRef.current) bubbleRef.current.position.y = Math.sin(t * 2.0) * 0.03;
  });

  useEffect(() => {
    if (resolvedPromptOptions.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % resolvedPromptOptions.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [resolvedPromptOptions]);

  const activePrompt =
    resolvedPromptOptions[activePromptIndex % resolvedPromptOptions.length] || prompt;

  return (
    <group ref={g} scale={0.98}>
      <mesh position={[0, AVATAR_DIMENSIONS.headY, 0]} castShadow material={headMat}>
        <sphereGeometry args={[AVATAR_DIMENSIONS.headRadius, 24, 24]} />
      </mesh>
      {variant === "female" ? (
        <>
          <mesh position={[0, AVATAR_DIMENSIONS.torsoY + 0.16, 0]} castShadow material={torsoMat}>
            <capsuleGeometry args={[0.2, 0.42, 8, 14]} />
          </mesh>
          <mesh position={[0, AVATAR_DIMENSIONS.torsoY - 0.44, 0]} castShadow material={torsoMat}>
            <coneGeometry args={[0.46, 1.0, 3]} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, AVATAR_DIMENSIONS.torsoY, 0]} castShadow material={torsoMat}>
          <capsuleGeometry args={[AVATAR_DIMENSIONS.torsoRadius, AVATAR_DIMENSIONS.torsoLength, 10, 18]} />
        </mesh>
      )}
      <mesh ref={leftArmRef} position={[-AVATAR_DIMENSIONS.armX, AVATAR_DIMENSIONS.armY, 0]} rotation-z={0.12} castShadow material={limbMat}>
        <capsuleGeometry args={[AVATAR_DIMENSIONS.armRadius, AVATAR_DIMENSIONS.armLength, 8, 16]} />
      </mesh>
      <mesh ref={rightArmRef} position={[AVATAR_DIMENSIONS.armX, AVATAR_DIMENSIONS.armY, 0]} rotation-z={-0.12} castShadow material={limbMat}>
        <capsuleGeometry args={[AVATAR_DIMENSIONS.armRadius, AVATAR_DIMENSIONS.armLength, 8, 16]} />
      </mesh>
      <mesh ref={leftLegRef} position={[-AVATAR_DIMENSIONS.legX, AVATAR_DIMENSIONS.legY, 0]} castShadow material={limbMat}>
        <capsuleGeometry args={[variant === "female" ? 0.09 : AVATAR_DIMENSIONS.legRadius, variant === "female" ? 0.6 : AVATAR_DIMENSIONS.legLength, 8, 16]} />
      </mesh>
      <mesh ref={rightLegRef} position={[AVATAR_DIMENSIONS.legX, AVATAR_DIMENSIONS.legY, 0]} castShadow material={limbMat}>
        <capsuleGeometry args={[variant === "female" ? 0.09 : AVATAR_DIMENSIONS.legRadius, variant === "female" ? 0.6 : AVATAR_DIMENSIONS.legLength, 8, 16]} />
      </mesh>
      <mesh position={[0, AVATAR_DIMENSIONS.headY + 0.46, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={new THREE.Color(accent)}
          emissiveIntensity={0.55}
          roughness={0.28}
          metalness={0.12}
        />
      </mesh>
      <group ref={bubbleRef}>
        <Billboard position={[bubbleOffsetX, AVATAR_DIMENSIONS.headY + 1.02, 0]} follow>
          <mesh position={[bubbleTailX * 0.54, -0.44, -0.01]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color={"#7fe7ff"} transparent opacity={0.18} toneMapped={false} />
          </mesh>
          <mesh position={[bubbleTailX, -0.27, -0.01]}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshBasicMaterial color={"#7fe7ff"} transparent opacity={0.26} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, -0.038]}>
            <shapeGeometry args={[bubbleEdgeShape]} />
            <meshBasicMaterial
              color={"#7fe7ff"}
              transparent
              opacity={0.12}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, -0.03]}>
            <shapeGeometry args={[bubbleFaceShape]} />
            <meshBasicMaterial
              color={"#0b1c2b"}
              transparent
              opacity={0.76}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <Text
            position={[0, 0.27, 0.02]}
            fontSize={0.128}
            maxWidth={1.96}
            anchorX="center"
            anchorY="middle"
          >
            {label}
            <meshBasicMaterial color={accent} toneMapped={false} />
          </Text>
          <Text
            position={[0, -0.055, 0.02]}
            fontSize={0.112}
            maxWidth={2.02}
            lineHeight={1.1}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {activePrompt}
            <meshBasicMaterial color={"#e6fbff"} toneMapped={false} />
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

/* ---------------------------------------------
   Scene
---------------------------------------------- */
function Scene({
  onEvent,
  setPrompt,
  viewMode,
  inStore,
  onPose,
  coShopSession = null,
  coShopPacket = null,
  ellySelectionsByStore = {},
  liveUserInteraction = null,
  simulatorActive = false,
  autoPilotTarget = null,
}) {
  const keys = useWASD(simulatorActive && !inStore);

  const marbleFloorSource = useTexture(assetUrl("/marblefloor.png"));
  const marbleWallSource = useTexture(assetUrl("/marble2.png"));
  const creamTex = useMemo(() => {
    const tex = marbleFloorSource.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.1, 6.8);
    tex.center.set(0.5, 0.5);
    tex.rotation = -0.08;
    tex.anisotropy = 12;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [marbleFloorSource]);
  const paverTex = useMemo(() => {
    const tex = marbleFloorSource.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.6, 5.4);
    tex.center.set(0.5, 0.5);
    tex.rotation = -0.08;
    tex.offset.set(0.08, 0.02);
    tex.anisotropy = 12;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [marbleFloorSource]);
  const wallTex = useMemo(() => {
    return buildTiledMarbleTexture(marbleWallSource, {
      columns: 4,
      rows: 4,
      grout: 3,
      width: 2048,
      height: 1024,
      groutColor: "#d9be82",
      panelTint: "rgba(255,248,235,0.06)",
    });
  }, [marbleWallSource]);

  const creamFloorMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        roughness: 0.14,
        metalness: 0.03,
        clearcoat: 0.82,
        clearcoatRoughness: 0.18,
        map: creamTex,
      }),
    [creamTex],
  );

  const brickInlayMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f0ece5"),
        roughness: 0.18,
        metalness: 0.03,
        clearcoat: 0.78,
        clearcoatRoughness: 0.18,
        map: paverTex,
      }),
    [paverTex],
  );

  const baseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c5c8cd"),
        roughness: 0.6,
        metalness: 0.05,
      }),
    [],
  );

  const soffitMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#cfd3db"),
        roughness: 0.96,
        metalness: 0.02,
      }),
    [],
  );
  const sideWallMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        roughness: 0.32,
        metalness: 0.03,
        clearcoat: 0.48,
        clearcoatRoughness: 0.18,
        map: wallTex,
        side: THREE.DoubleSide,
      }),
    [wallTex],
  );
  const backWallMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#fbfaf8"),
        roughness: 0.34,
        metalness: 0.03,
        clearcoat: 0.42,
        clearcoatRoughness: 0.2,
        map: wallTex,
      }),
    [wallTex],
  );

  const posRef = useRef(new THREE.Vector3(0, 0, 3));
  const avatarYawRef = useRef(0);
  const movingRef = useRef(false);

  const nearStoreRef = useRef(null);
  const lastInteractRef = useRef(0);

  const zoneActiveRef = useRef(null);
  const zoneEnteredRef = useRef(new Set());

  const dwellStartRef = useRef(null);
  const stoppedFiredRef = useRef(false);

  const { gl } = useThree();
  const dom = gl?.domElement;
  useEffect(() => {
    if (!dom) return;
    if (inStore && document.pointerLockElement === dom) {
      document.exitPointerLock?.();
    }
  }, [inStore, dom]);

  const { yawRef, pitchRef } = useMouseLook(dom, simulatorActive && !inStore);

  const CAM_BOUNDS = useMemo(
    () => ({
      xMin: -12.9,
      xMax: 12.9,
      yMin: 1.15,
      yMax: 6.55,
      zMin: -64.8,
      zMax: 4.4,
    }),
    [],
  );

  const poseTickRef = useRef(0);
  const autoRouteRef = useRef([]);
  const autoRouteIndexRef = useRef(0);
  const autoRouteSignatureRef = useRef("");

  useFrame(({ camera, clock }, dt) => {
    const now = clock.getElapsedTime();
    const p = posRef.current;

    const inputLocked = !!inStore;

    const run = keys.current.shift;
    const moveSpeed = run ? 4.2 : 2.7;

    const forwardAmt = (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0);
    const strafeAmt = (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0);

    const autoPilotStore =
      autoPilotTarget?.kind === "store" && autoPilotTarget?.storeKey
        ? STOREFRONTS.find((s) => s.key === autoPilotTarget.storeKey) || null
        : null;
    const autoPilotLiveUser =
      autoPilotTarget?.kind === "live_user"
        ? AMBIENT_SHOPPER_CONFIGS[
            Math.abs(Number(autoPilotTarget.userIndex || 0)) %
              AMBIENT_SHOPPER_CONFIGS.length
          ] || null
        : null;
    const autoPilotActive = !inputLocked && Boolean(autoPilotStore || autoPilotLiveUser);

    const keyboardMoving =
      !autoPilotActive &&
      !inputLocked &&
      (Math.abs(forwardAmt) > 0.001 || Math.abs(strafeAmt) > 0.001);

    let moving = keyboardMoving;
    let yaw = yawRef.current;
    const pitch = pitchRef.current;
    avatarYawRef.current = yaw;

    const forwardDirGround = new THREE.Vector3(
      -Math.sin(yaw),
      0,
      -Math.cos(yaw),
    );
    const rightDir = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

    const forwardLook = new THREE.Vector3(
      -Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch),
    ).normalize();

    if (keyboardMoving) {
      p.addScaledVector(forwardDirGround, forwardAmt * moveSpeed * dt);
      p.addScaledVector(rightDir, strafeAmt * moveSpeed * dt);
    }

    if (autoPilotActive) {
      const signature = JSON.stringify(autoPilotTarget || {});
      if (autoRouteSignatureRef.current !== signature) {
        autoRouteSignatureRef.current = signature;
        autoRouteIndexRef.current = 0;

        if (autoPilotStore) {
          const mode = autoPilotTarget?.mode === "hud" ? "hud" : "entry";
          const finalX =
            mode === "hud"
              ? autoPilotStore.side === "left"
                ? -7.35
                : 7.35
              : autoPilotStore.side === "left"
                ? -10.05
                : 10.05;
          const finalZ = autoPilotStore.z + (mode === "hud" ? 0.58 : 0.08);
          autoRouteRef.current = buildCurvedRoute(
            { x: p.x, z: p.z },
            { x: finalX, z: finalZ },
            autoPilotStore.side === "left" ? -0.8 : 0.8,
          );
        } else if (autoPilotLiveUser) {
          const ux = autoPilotLiveUser.anchor?.[0] || 0;
          const uz = autoPilotLiveUser.anchor?.[2] || -10;
          autoRouteRef.current = buildCurvedRoute(
            { x: p.x, z: p.z },
            { x: clamp(ux * 0.92, -8.2, 8.2), z: uz + 0.9 },
            ux < 0 ? -0.5 : 0.5,
          );
        } else {
          autoRouteRef.current = [];
        }
      }

      const route = autoRouteRef.current;
      const waypoint = route[autoRouteIndexRef.current];
      if (waypoint) {
        const delta = new THREE.Vector3(waypoint.x - p.x, 0, waypoint.z - p.z);
        const dist = delta.length();
        if (dist > 0.08) {
          const dir = delta.normalize();
          const step = Math.min(2.75 * dt, dist);
          p.addScaledVector(dir, step);
          const desiredYaw = Math.atan2(-dir.x, -dir.z);
          yaw = THREE.MathUtils.lerp(yaw, desiredYaw, 1 - Math.exp(-8 * dt));
          yawRef.current = yaw;
          moving = true;
        } else {
          autoRouteIndexRef.current += 1;
          moving = false;
        }
      } else {
        moving = false;
      }
      avatarYawRef.current = yaw;
    }

    movingRef.current = moving;

    p.x = THREE.MathUtils.clamp(p.x, -10.2, 10.2);
    p.z = THREE.MathUtils.clamp(p.z, -66.0, 5.0);

    if (viewMode === "fpv") {
      const head = new THREE.Vector3(p.x, 1.85, p.z);
      const lookTarget = head
        .clone()
        .add(forwardLook.clone().multiplyScalar(3.2));
      camera.position.lerp(head, 1 - Math.exp(-16.0 * dt));
      camera.lookAt(lookTarget);
    } else {
      const camOffset = new THREE.Vector3(0, 2.8, 7.0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        yaw,
      );
      const desiredCam = new THREE.Vector3(p.x, p.y, p.z).add(camOffset);

      desiredCam.x = clamp(desiredCam.x, CAM_BOUNDS.xMin, CAM_BOUNDS.xMax);
      desiredCam.y = clamp(desiredCam.y, CAM_BOUNDS.yMin, CAM_BOUNDS.yMax);
      desiredCam.z = clamp(desiredCam.z, CAM_BOUNDS.zMin, CAM_BOUNDS.zMax);

      camera.position.lerp(desiredCam, 1 - Math.exp(-8.5 * dt));

      const lookTarget = new THREE.Vector3(p.x, 1.7, p.z).add(
        forwardLook.clone().multiplyScalar(3.0),
      );
      camera.lookAt(lookTarget);
    }

    let nearest = null;
    let nearestDist = 999;
    let inZone = null;

    for (const s of STOREFRONTS) {
      const bayX = s.side === "left" ? -9.0 : 9.0;
      const bayZ = s.z;

      const dx = p.x - bayX;
      const dz = p.z - bayZ;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = s;
      }
      if (dist < 5.2) inZone = s;
    }

    // Pose for minimap
    poseTickRef.current += dt;
    if (poseTickRef.current >= 0.25) {
      poseTickRef.current = 0;
      onPose?.({
        x: p.x,
        z: p.z,
        yaw,
        viewMode,
        activeStoreKey: zoneActiveRef.current || null,
        nearbyStoreKey: nearestDist < 9.5 ? nearest?.key || null : null,
      });
    }

    if (inputLocked) {
      setPrompt?.(null);
      nearStoreRef.current = null;
      return;
    }

    if (inZone && !zoneEnteredRef.current.has(inZone.key)) {
      zoneEnteredRef.current.add(inZone.key);
      onEvent?.({
        type: "STORE_ZONE_ENTER",
        storeKey: inZone.key,
        storeLabel: inZone.label,
      });
    }

    if (
      zoneActiveRef.current &&
      (!inZone || inZone.key !== zoneActiveRef.current)
    ) {
      const prevKey = zoneActiveRef.current;
      const prevStore = STOREFRONTS.find((s) => s.key === prevKey);
      onEvent?.({
        type: "STORE_ZONE_EXIT",
        storeKey: prevKey,
        storeLabel: prevStore?.label || prevKey,
      });
      dwellStartRef.current = null;
      stoppedFiredRef.current = false;
    }

    zoneActiveRef.current = inZone ? inZone.key : null;

    if (nearest && nearestDist < 1.6) {
      nearStoreRef.current = nearest;
      setPrompt?.({
        storeKey: nearest.key,
        storeLabel: nearest.label,
        text: autoPilotActive
          ? `Auto navigating: ${nearest.label}`
          : `Near ${nearest.label} — Press E to enter`,
        distance: Number(nearestDist.toFixed(2)),
      });
    } else {
      nearStoreRef.current = null;
      setPrompt?.(null);
    }

    // ✅ Fires for ANY storefront when the avatar stops (already universal)
    if (inZone) {
      if (!moving) {
        if (dwellStartRef.current == null) dwellStartRef.current = now;

        const dwellTime = now - dwellStartRef.current;
        if (dwellTime >= 0.9 && !stoppedFiredRef.current) {
          stoppedFiredRef.current = true;
          onEvent?.({
            type: "AVATAR_STOPPED",
            storeKey: inZone.key,
            storeLabel: inZone.label,
            dwellSeconds: Number(dwellTime.toFixed(2)),
          });
        }
      } else {
        dwellStartRef.current = null;
        stoppedFiredRef.current = false;
      }
    }

    if (
      keys.current.e &&
      nearStoreRef.current &&
      now - lastInteractRef.current > 0.35
    ) {
      lastInteractRef.current = now;
      const s = nearStoreRef.current;
      onEvent?.({
        type: "STORE_INTERACT_IN_SIM",
        storeKey: s.key,
        storeLabel: s.label,
      });
    }
  });

  return (
    <>
      <fog attach="fog" args={["#0b1220", 22, 85]} />

      <ambientLight intensity={0.65} />
      <directionalLight position={[10, 14, 8]} intensity={1.05} castShadow />
      <directionalLight
        position={[-10, 9, -12]}
        intensity={0.55}
        color={"#d6ebff"}
      />
      <pointLight
        position={[0, 5, -30]}
        intensity={0.5}
        distance={70}
        color={"#ffffff"}
      />

      <Environment preset="city" />

      <Corridor
        creamFloorMat={creamFloorMat}
        brickInlayMat={brickInlayMat}
        baseMat={baseMat}
        soffitMat={soffitMat}
        sideWallMat={sideWallMat}
        backWallMat={backWallMat}
      />

      {STOREFRONTS.map((s) => {
        const hudX = s.side === "left" ? -8.85 : 8.85;
        const hudZ = s.z + 0.65;

        return (
          <React.Fragment key={s.key}>
            <StorefrontEmbedded
              storeKey={s.key}
              label={s.label}
              side={s.side}
              z={s.z}
              active={zoneActiveRef.current === s.key}
              accent={s.accent}
              warmth={s.warmth}
              img={s.img}
              logo={s.logo}
            />

            {/* Hide the hologram HUD while the full-screen store overlay is open */}
            <HoloStoreHUD
              enabled={!inStore}
              store={s}
              products={STORE_PRODUCTS[s.key] || []}
              highlightedPick={ellySelectionsByStore?.[s.key] || null}
              avatarPosRef={posRef}
              bayX={hudX}
              bayZ={hudZ}
              y={3.15}
              showRadius={7.2}
              hardHideRadius={8.6}
              hideNearRadius={1.15}
            />
          </React.Fragment>
        );
      })}

      <SilhouetteAvatar
        positionRef={posRef}
        yawRef={avatarYawRef}
        movingRef={movingRef}
        visible={viewMode !== "fpv"}
      />
      {coShopSession ? (
        <CompanionAvatar
          positionRef={posRef}
          yawRef={avatarYawRef}
          movingRef={movingRef}
          visible={viewMode !== "fpv"}
          variant={coShopSession.friendVariant || "female"}
          label={coShopSession.friendLabel || "Remote Friend"}
          promptOptions={coShopPacket?.friendThoughts}
        />
      ) : null}
      <AmbientShoppers playerPosRef={posRef} interaction={liveUserInteraction} />
    </>
  );
}

/* ---------------------------------------------
   UI: Store preview + Store overlay + Elly AI preview
---------------------------------------------- */
function StorePreviewCard({ storeKey }) {
  const store = STOREFRONTS.find((s) => s.key === storeKey);
  const products = STORE_PRODUCTS[storeKey] || [];
  const preview = products.slice(0, 2);

  if (!store) return null;

  return (
    <div style={styles.previewCard}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 99,
            background: store.accent,
            boxShadow: "0 0 0 2px rgba(255,255,255,0.08)",
          }}
        />
        <div style={{ fontWeight: 700, letterSpacing: 0.6 }}>{store.label}</div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {preview.map((p) => (
          <div key={p.id} style={styles.previewRow}>
            <div style={{ flex: 1, opacity: 0.95 }}>{p.name}</div>
            <div style={{ opacity: 0.78, fontSize: 12 }}>
              ${p.price.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
        Press <b>E</b> to enter this storefront
      </div>
    </div>
  );
}

function EllyPreviewCard({
  insight,
  accent,
  onClose,
  mode = "idle",
  cueLines = [],
  metrics = null,
}) {
  if (!insight) return null;

  const avatarSrc = ELLY_MODE_IMAGE[mode] || ELLY_MODE_IMAGE.idle;
  const compact =
    typeof window !== "undefined" &&
    (window.innerWidth < 1280 || window.innerHeight < 980);
  const cueLimit = 2;
  const metricAccent = accent || "#7fe7ff";
  const metricItems = [
    { label: "Scans", value: metrics?.scans },
    { label: "Products", value: metrics?.productScans },
    { label: "Emotion", value: `${metrics?.emotionConfidence}%` },
    { label: "Budget Fit", value: `${metrics?.budgetFit}%` },
    { label: "Top Match", value: `${metrics?.topMatchScore}%` },
  ];

  return (
    <div style={{ ...styles.ellyCard, borderColor: "rgba(255,255,255,0.10)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.ellyAvatarWrap}>
            <img src={avatarSrc} alt="Elly mode" style={styles.ellyAvatarImg} />
          </div>
          <div style={{ ...styles.ellyDot, background: accent }} />
          <div>
            <div style={{ fontWeight: 800, letterSpacing: 0.6 }}>
              Elly Command Panel
            </div>
            <div style={{ fontSize: 12, opacity: 0.78 }}>
              {insight.subtitle} • {mode}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={styles.ellyCloseBtn}
          title="Hide Elly preview"
        >
          ✕
        </button>
      </div>

      <div style={{ marginTop: 10, lineHeight: 1.35, opacity: 0.92 }}>
        {insight.summary}
      </div>

      {metrics ? (
        <div
          style={{
            ...styles.ellyMetricStrip,
            gridTemplateColumns: compact
              ? "repeat(3, minmax(0, 1fr))"
              : "repeat(5, minmax(0, 1fr))",
          }}
        >
          {metricItems.map((item) => (
            <div
              key={item.label}
              style={{
                ...styles.ellyMetricChip,
                borderColor: hexToRgba(metricAccent, 0.38),
                background: `linear-gradient(180deg, ${hexToRgba(metricAccent, 0.16)}, ${hexToRgba(metricAccent, 0.07)})`,
                boxShadow: `0 0 10px ${hexToRgba(metricAccent, 0.14)}`,
              }}
            >
              <div style={styles.ellyMetricLabel}>{item.label}</div>
              <div style={styles.ellyMetricValue}>{item.value}</div>
            </div>
          ))}
        </div>
      ) : null}

      {cueLines?.length ? (
        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 12, opacity: 0.84, marginBottom: 2 }}>
            Live scan narration
          </div>
          {cueLines.slice(0, cueLimit).map((line, i) => (
            <div key={`${line}-${i}`} style={styles.ellySignalRow}>
              <span style={{ opacity: 0.72 }}>•</span>
              <span style={{ opacity: 0.9 }}>{line}</span>
            </div>
          ))}
        </div>
      ) : null}

      {!cueLines?.length && insight.signals?.length ? (
        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
          {insight.signals.slice(0, 3).map((s, i) => (
            <div key={`${s}-${i}`} style={styles.ellySignalRow}>
              <span style={{ opacity: 0.7 }}>•</span>
              <span style={{ opacity: 0.85 }}>{s}</span>
            </div>
          ))}
        </div>
      ) : null}

      {insight.recs?.length && !compact ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 6 }}>
            Pinned picks
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {insight.recs.slice(0, 2).map((r) => (
              <div key={r.id} style={styles.ellyRecRow}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, opacity: 0.92 }}>{r.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.72 }}>{r.tag}</div>
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  ${r.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.72 }}>
        Confidence: {(insight.confidence * 100).toFixed(0)}%
      </div>
    </div>
  );
}

function CoShopPreviewCard({ packet, active = false }) {
  if (!active || !packet) return null;

  const users = [
    {
      label: packet.friendLabel || "Remote Friend",
      status: packet.friendStatus,
      accent: "#f3b7d7",
      recs: packet.friendRecs || [],
      female: packet.friendVariant === "female",
    },
    {
      label: packet.primaryLabel || "Primary Shopper",
      status: packet.primaryStatus,
      accent: "#8bd3ff",
      recs: packet.primaryRecs || [],
      female: false,
    },
  ];

  return (
    <div style={styles.coShopCard}>
      <div style={styles.coShopHeader}>
        <div style={styles.coShopTitle}>
          {packet.scenarioLabel || "Invite-A-Friend Session"} • Dual Elly
        </div>
        <div style={styles.coShopStoreChip}>{packet.storeLabel}</div>
      </div>
      <div style={styles.coShopSubtitle}>
        {packet.scenarioDescription ||
          "Two live shoppers are active. Each shopper has an individual Elly stream while the system also compares overlap, fit, and shared purchase intent."}
      </div>
      <div style={styles.coShopGrid}>
        {users.map((user) => (
          <div key={user.label} style={styles.coShopUserCard}>
            <div style={styles.coShopUserHeader}>
              <div style={styles.coShopAvatarWrap}>
                <div style={styles.coShopAvatarHead} />
                <div
                  style={{
                    ...styles.coShopAvatarBody,
                    ...(user.female ? styles.coShopAvatarBodyFemale : null),
                  }}
                />
              </div>
              <div>
                <div style={styles.coShopUserLabel}>{user.label}</div>
                <div style={{ ...styles.coShopUserStatus, color: user.accent }}>
                  {user.status}
                </div>
              </div>
            </div>
            <div style={styles.coShopRecoLabel}>Recommendations</div>
            <div style={styles.coShopRecoList}>
              {user.recs.map((rec) => (
                <div key={`${user.label}-${rec.id}`} style={styles.coShopRecoRow}>
                  <span>{rec.name}</span>
                  <span>${Number(rec.price || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImgWithFallback({ src, alt, style, fallbackLabel }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div style={{ ...styles.imgFallback, ...style }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>
          {fallbackLabel || "Image"}
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
          Missing / mismatch path
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

function CartDrawer({
  open,
  onClose,
  cartItems,
  onInc,
  onDec,
  onRemove,
  accent,
  ellyConclusionLines = [],
}) {
  if (!open) return null;

  const total = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    // IMPORTANT: do NOT stopPropagation in the *capture* phase.
    // That prevents child button clicks (Add to cart, +/- qty, etc.) from firing.
    <div
      style={styles.cartOverlay}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div style={styles.cartBackdrop} onClick={onClose} />

      <div style={styles.cartPanel}>
        <div style={styles.cartHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 99,
                background: accent,
              }}
            />
            <div style={{ fontWeight: 900, letterSpacing: 0.6 }}>Cart</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={styles.cartCloseBtn}
            title="Close cart"
          >
            ✕
          </button>
        </div>

        <div style={styles.cartBody}>
          {cartItems.length === 0 ? (
            <div style={{ opacity: 0.8, lineHeight: 1.35 }}>
              Your cart is empty.
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>
                Add items from the store grid.
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {cartItems.map((it) => (
                <div key={it.key || it.id} style={styles.cartRow}>
                  <ImgWithFallback
                    src={it.image}
                    alt={it.name}
                    fallbackLabel={it.brandLabel || "Product"}
                    style={styles.cartThumb}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, opacity: 0.95 }}>
                      {it.name}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>
                      ${it.price.toLocaleString()}
                    </div>
                    {it.description ? (
                      <div style={{ fontSize: 11, opacity: 0.72, marginTop: 4, lineHeight: 1.25 }}>
                        {it.description}
                      </div>
                    ) : null}
                    <div style={{ fontSize: 10.5, opacity: 0.66, marginTop: 4 }}>
                      {it.brandLabel || "Store"} • {it.color || "black"}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onDec(it.key)}
                        style={styles.qtyBtn}
                        title="Decrease"
                      >
                        −
                      </button>
                      <div
                        style={{
                          minWidth: 26,
                          textAlign: "center",
                          fontWeight: 800,
                        }}
                      >
                        {it.qty}
                      </div>
                      <button
                        type="button"
                        onClick={() => onInc(it.key)}
                        style={styles.qtyBtn}
                        title="Increase"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(it.key)}
                        style={styles.removeBtn}
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ fontWeight: 900 }}>
                    ${(it.price * it.qty).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.cartFooter}>
          {ellyConclusionLines.length ? (
            <div style={styles.ellyConclusionCard}>
              <div style={styles.ellyConclusionTitle}>Elly Conclusion</div>
              <div style={styles.ellyConclusionList}>
                {ellyConclusionLines.map((line) => (
                  <div key={line} style={styles.ellyConclusionRow}>
                    • {line}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ opacity: 0.8 }}>Total</div>
            <div style={{ fontWeight: 950, fontSize: 18 }}>
              ${total.toLocaleString()}
            </div>
          </div>
          <button
            style={{
              ...styles.checkoutBtn,
              opacity: cartItems.length ? 1 : 0.55,
              cursor: cartItems.length ? "pointer" : "not-allowed",
            }}
            disabled={!cartItems.length}
          >
            Checkout (demo)
          </button>
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.6 }}>
            This is the in-sim cart UI. Hook this into your real checkout later.
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreOverlay({
  storeKey,
  onAddToCart,
  onOpenCart,
  cartCount,
  highlightedSelection = null,
}) {
  const store = STOREFRONTS.find((s) => s.key === storeKey);
  const products = STORE_PRODUCTS[storeKey] || [];
  const [colorById, setColorById] = useState({});

  // Preload color variants for smoother switching
  useEffect(() => {
    const imgs = [];
    for (const p of products) {
      const colors =
        Array.isArray(p.colors) && p.colors.length ? p.colors : ["black"];
      for (const c of colors) {
        const im = new Image();
        im.src = resolveProductImage(p, c);
        imgs.push(im);
      }
    }
    return () => {
      imgs.length = 0;
    };
  }, [storeKey]);

  if (!store) return null;

  return (
    // Stop bubbling so the 3D canvas doesn't react, but keep child buttons clickable.
    <div
      style={styles.storeOverlay}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div style={styles.storeTopBar}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 99,
              background: store.accent,
            }}
          />
          <div style={{ fontWeight: 800, letterSpacing: 0.8 }}>
            {store.label}
          </div>
          <span style={styles.exitHint}>ESC to exit</span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            onClick={onOpenCart}
            style={styles.backBtn}
            title="Open cart"
          >
            🛒 Cart{typeof cartCount === "number" ? ` (${cartCount})` : ""}
          </button>
        </div>
      </div>

      <div style={styles.storeBody}>
        <div style={styles.storeGrid}>
          {products.map((p) => {
            const isHighlighted = highlightedSelection?.productId === p.id;
            const highlightedColor = highlightedSelection?.color || "";
            const highlightGlow = glowColorForVariant(highlightedColor, store.accent);
            const colors =
              Array.isArray(p.colors) && p.colors.length ? p.colors : ["black"];
            const selectedColor =
              (isHighlighted && highlightedColor) || colorById[p.id] || colors[0];
            return (
              <div
                key={p.id}
                style={{
                  ...styles.productCard,
                  ...(isHighlighted
                    ? {
                        ...styles.productCardHighlighted,
                        border: `3px solid ${highlightGlow}`,
                        boxShadow: `0 0 0 3px ${hexToRgba(highlightGlow, 0.48)}, 0 0 34px ${hexToRgba(highlightGlow, 0.62)}, 0 0 60px ${hexToRgba(highlightGlow, 0.38)}`,
                        background: `linear-gradient(180deg, ${hexToRgba(highlightGlow, 0.24)}, ${hexToRgba(highlightGlow, 0.08)})`,
                      }
                    : null),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div style={styles.tagPill}>{p.tag}</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{store.label}</div>
                </div>
                {isHighlighted ? (
                  <div
                    style={{
                      ...styles.ellyPickPill,
                      border: `1px solid ${hexToRgba(highlightGlow, 0.95)}`,
                      background: hexToRgba(highlightGlow, 0.24),
                    }}
                  >
                    Elly Pick • {selectedColor}
                  </div>
                ) : null}

                <div style={{ marginTop: 10 }}>
                  <ImgWithFallback
                    src={resolveProductImage(
                      p,
                      selectedColor,
                    )}
                    alt={p.name}
                    fallbackLabel={store.label}
                    style={styles.productImg}
                  />
                </div>

                {(() => {
                  const sel = selectedColor;
                  return colors.length > 1 ? (
                    <div style={styles.colorRow}>
                      {colors.map((c) => {
                        const isSel = sel === c;
                        const thumb = resolveProductImage(p, c);
                        return (
                          <button
                            key={`${p.id}-${c}`}
                            onClick={() =>
                              setColorById((prev) => ({ ...prev, [p.id]: c }))
                            }
                            style={{
                              ...styles.colorPill,
                              borderColor: isSel
                                ? (isHighlighted ? hexToRgba(highlightGlow, 0.92) : "rgba(255,255,255,0.40)")
                                : "rgba(255,255,255,0.12)",
                              background: isSel && isHighlighted
                                ? hexToRgba(highlightGlow, 0.2)
                                : "rgba(255,255,255,0.06)",
                              opacity: isSel ? 1 : 0.82,
                            }}
                            title={`Color: ${c}`}
                          >
                            <img
                              src={thumb}
                              alt={`${p.name} - ${c}`}
                              style={styles.colorThumb}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <span style={styles.colorLabel}>{c}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                      Color: {sel}
                    </div>
                  );
                })()}

                <div style={{ fontWeight: 850, marginTop: 12, marginBottom: 6 }}>
                  {p.name}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.74,
                    lineHeight: 1.35,
                    marginBottom: 10,
                  }}
                >
                  {p.description ||
                    "Premium materials • Boutique selection • Limited colorways"}
                </div>
                <div style={{ opacity: 0.9, marginBottom: 12, fontWeight: 750 }}>
                  ${p.price.toLocaleString()}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    style={{ ...styles.primaryBtn, flex: 1 }}
                    onClick={() => {
                      const colors =
                        Array.isArray(p.colors) && p.colors.length
                          ? p.colors
                          : ["black"];
                      const sel = selectedColor || colors[0];
                      onAddToCart?.(storeKey, store.label, store.accent, p, sel);
                    }}
                  >
                    Add to cart
                  </button>
                  <button
                    style={styles.secondaryBtn}
                    onClick={onOpenCart}
                    title="View cart"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, fontSize: 12, opacity: 0.65 }}>
          Tip: If an image shows “Missing / mismatch path”, confirm the exact
          folder/file name in
          <b> public/products/**</b> matches the <b>image</b> string (including
          uppercase/lowercase).
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Main Component
---------------------------------------------- */
export default function VirtualMallWalkthroughR3F({
  onEvent,
  onBrainStateChange,
  height = "auto",
  persona = "luxury", // "luxury" | "business" | "tech"
  requestedStoreKey = null,
  onRequestedStoreHandled,
  coShopActive = false,
  coShopSession = null,
  coShopInviteEmail = "",
  onCoShopInviteEmailChange,
  onCoShopInviteSend,
  demoCommand = null,
  onDemoCommandHandled,
}) {
  const clampPct = useCallback((n) => Math.max(0, Math.min(99, Math.round(n))), []);
  const wrapRef = useRef(null);
  const [autoHeight, setAutoHeight] = useState(520);

  // Responsive sizing: compute height from width
  useEffect(() => {
    if (height !== "auto") return;

    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries?.[0]?.contentRect?.width || 0;
      if (!w) return;
      const computed = clamp(Math.round(w * 0.58), 360, 640);
      setAutoHeight(computed);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  const resolvedHeight = height === "auto" ? autoHeight : height;

  const [prompt, setPrompt] = useState(null);
  const [viewMode, setViewMode] = useState("tpv"); // "tpv" | "fpv"
  const [activeStoreKey, setActiveStoreKey] = useState(null);
  const [simulatorActive, setSimulatorActive] = useState(false);
  const [inviteOverlayOpen, setInviteOverlayOpen] = useState(false);

  // ✅ When entering a store overlay, release pointer-lock so the HTML UI is clickable.
  useEffect(() => {
    if (!activeStoreKey) return;
    if (typeof document === "undefined") return;
    if (document.pointerLockElement) document.exitPointerLock?.();
  }, [activeStoreKey]);

  useEffect(() => {
    if (simulatorActive) return;
    setPrompt(null);
    setMapExpanded(false);
    setInviteOverlayOpen(false);
    setAutoPilotTarget(null);
    if (typeof document === "undefined") return;
    if (document.pointerLockElement) document.exitPointerLock?.();
  }, [simulatorActive]);

  useEffect(() => {
    if (!simulatorActive) return;

    const onPointerDownOutside = (e) => {
      const root = wrapRef.current;
      if (!root) return;
      if (root.contains(e.target)) return;
      setSimulatorActive(false);
    };

    document.addEventListener("pointerdown", onPointerDownOutside, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDownOutside, true);
    };
  }, [simulatorActive]);

  const [coShopPacket, setCoShopPacket] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [autoPilotTarget, setAutoPilotTarget] = useState(null);
  const [demoHighlightSelection, setDemoHighlightSelection] = useState(null);
  const [ellySelectionsByStore, setEllySelectionsByStore] = useState({});
  const [liveUserInteraction, setLiveUserInteraction] = useState(null);
  const livePromptTimerRef = useRef(null);
  const handledDemoCommandRef = useRef(null);

  useEffect(() => {
    if (!activeStoreKey) return;
    setMapExpanded(false);
  }, [activeStoreKey]);

  useEffect(() => {
    if (!inviteOverlayOpen) return;
    setMapExpanded(false);
    setPrompt(null);
  }, [inviteOverlayOpen]);

  useEffect(() => {
    if (!coShopActive) setCoShopPacket(null);
  }, [coShopActive]);

  useEffect(
    () => () => {
      if (livePromptTimerRef.current) {
        window.clearTimeout(livePromptTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!coShopActive || !coShopSession) return;
    setCoShopPacket({
      storeLabel: activeStoreKey
        ? STOREFRONTS.find((s) => s.key === activeStoreKey)?.label || "Shared Mall Session"
        : "Shared Mall Session",
      primaryLabel: coShopSession.primaryLabel || "Primary Shopper",
      friendLabel: coShopSession.friendLabel || "Remote Friend",
      scenarioLabel: coShopSession.scenarioLabel || "Invite-A-Friend Session",
      scenarioDescription:
        coShopSession.description ||
        "Two live shoppers are now in the same mall session with two active Elly streams running in parallel.",
      primaryStatus: "Primary Elly: live in-session analysis active",
      friendStatus: "Friend Elly: joined and analyzing remotely",
      friendVariant: coShopSession.friendVariant || "female",
      primaryRecs: [],
      friendRecs: [],
      friendThoughts: [
        "My Elly is syncing with your session.",
        "I am checking overlap before we enter the next store.",
        "Friend Elly is comparing gift-fit and shared preferences.",
      ],
    });
  }, [coShopActive, coShopSession, activeStoreKey]);

  useEffect(() => {
    if (!requestedStoreKey) return;
    setPrompt(null);
    setActiveStoreKey(requestedStoreKey);
    onRequestedStoreHandled?.();
  }, [requestedStoreKey, onRequestedStoreHandled]);

  useEffect(() => {
    if (!demoCommand?.id) return;
    if (handledDemoCommandRef.current === demoCommand.id) return;
    handledDemoCommandRef.current = demoCommand.id;

    if (demoCommand.type === "NAVIGATE_TO_STORE") {
      if (demoCommand.storeKey) {
        setSimulatorActive(true);
        setMapExpanded(false);
        setInviteOverlayOpen(false);
        setCartOpen(false);
        setActiveStoreKey(null);
        setAutoPilotTarget({
          kind: "store",
          storeKey: demoCommand.storeKey,
          mode: demoCommand.mode || "entry",
        });
      }
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    if (demoCommand.type === "NAVIGATE_TO_LIVE_USER") {
      setSimulatorActive(true);
      setMapExpanded(false);
      setInviteOverlayOpen(false);
      setCartOpen(false);
      setActiveStoreKey(null);
      setAutoPilotTarget({
        kind: "live_user",
        userIndex: Number(demoCommand.userIndex) || 0,
      });
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    if (demoCommand.type === "OPEN_INVITE") {
      if (!coShopActive) {
        setSimulatorActive(true);
        setMapExpanded(false);
        setInviteOverlayOpen(true);
      }
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    if (demoCommand.type === "CLOSE_INVITE") {
      setInviteOverlayOpen(false);
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    if (demoCommand.type === "OPEN_STORE") {
      if (demoCommand.storeKey) {
        setSimulatorActive(true);
        setMapExpanded(false);
        setInviteOverlayOpen(false);
        setCartOpen(false);
        setAutoPilotTarget(null);
        setActiveStoreKey(demoCommand.storeKey);
        if (coShopActive) {
          const store = STOREFRONTS.find((s) => s.key === demoCommand.storeKey);
          const sourceProducts = STORE_PRODUCTS[demoCommand.storeKey] || [];
          setCoShopPacket((prev) => ({
            ...(prev || {}),
            storeLabel: store?.label || "Shared Mall Session",
            primaryLabel: coShopSession?.primaryLabel || "Primary Shopper",
            friendLabel: coShopSession?.friendLabel || "Remote Friend",
            scenarioLabel: coShopSession?.scenarioLabel || "Invite-A-Friend Session",
            scenarioDescription:
              coShopSession?.description ||
              "Two live shoppers are active in one shared virtual mall trip.",
            primaryStatus: "Primary Elly: tracking boutique interest",
            friendStatus: "Friend Elly: matching shared purchase intent",
            friendVariant: coShopSession?.friendVariant || "female",
            primaryRecs: sourceProducts.slice(0, 2).map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
            })),
            friendRecs: sourceProducts.slice(2, 4).map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
            })),
            friendThoughts: [
              `I just joined ${store?.label || "this storefront"} with my own Elly stream.`,
              "Friend Elly is surfacing my strongest matches in this storefront.",
              "I am reviewing whether this store works for both of us.",
            ],
          }));
        }
      }
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    if (demoCommand.type === "SET_STORE_SUGGESTION") {
      const targetKey = demoCommand.storeKey;
      if (targetKey) {
        setEllySelectionsByStore((prev) => ({
          ...prev,
          [targetKey]: {
            productId: demoCommand.productId || null,
            productName: demoCommand.productName || null,
            color: demoCommand.color || "black",
            sizeProfile: demoCommand.sizeProfile || null,
            reason: demoCommand.reason || null,
          },
        }));
      }
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    if (demoCommand.type === "ADD_PRODUCT") {
      const targetKey = demoCommand.storeKey;
      if (!targetKey) {
        onDemoCommandHandled?.(demoCommand.id);
        return;
      }

      setMapExpanded(false);
      setInviteOverlayOpen(false);
      setAutoPilotTarget(null);
      setActiveStoreKey(targetKey);
      const store = STOREFRONTS.find((s) => s.key === targetKey);
      const products = STORE_PRODUCTS[targetKey] || [];
      const requestedName = String(demoCommand.productName || "").trim().toLowerCase();
      const requestedSku = String(demoCommand.productSku || "").trim().toLowerCase();
      const targetProduct =
        products.find((p) => p.id === demoCommand.productId) ||
        products.find((p) => String(p.name || "").trim().toLowerCase() === requestedName) ||
        products.find((p) => String(p.sku || "").trim().toLowerCase() === requestedSku) ||
        products[0];

      if (store && targetProduct) {
        const productColors =
          Array.isArray(targetProduct.colors) && targetProduct.colors.length
            ? targetProduct.colors
            : ["black"];
        const requestedColor = String(demoCommand.color || "").toLowerCase();
        const color =
          productColors.find((variant) => variant.toLowerCase() === requestedColor) ||
          productColors[0];
        setDemoHighlightSelection({
          productId: targetProduct.id,
          color,
        });
        setEllySelectionsByStore((prev) => ({
          ...prev,
          [targetKey]: {
            productId: targetProduct.id,
            productName: targetProduct.name,
            color,
            sizeProfile: demoCommand.sizeProfile || null,
            reason:
              demoCommand.reason ||
              buildEllyReason({
                storeLabel: store.label,
                productName: targetProduct.name,
                color,
                sizeProfile: demoCommand.sizeProfile || null,
              }),
          },
        }));
        addToCart(targetKey, store.label, store.accent, targetProduct, color, {
          incrementIfExists: false,
        });
      }
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    if (demoCommand.type === "LIVE_INTERACTION") {
      const prompts = Array.isArray(demoCommand.prompts)
        ? demoCommand.prompts.filter(Boolean).slice(0, 4)
        : [];
      if (prompts.length) {
        setLiveUserInteraction({
          userIndex: Math.abs(Number(demoCommand.userIndex || 0)) % AMBIENT_SHOPPER_CONFIGS.length,
          prompts,
        });
        if (livePromptTimerRef.current) window.clearTimeout(livePromptTimerRef.current);
        const durationMs = Math.max(2400, Number(demoCommand.durationMs) || 5200);
        livePromptTimerRef.current = window.setTimeout(() => {
          setLiveUserInteraction(null);
        }, durationMs);
      }
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    if (demoCommand.type === "COMPLETE_DEMO") {
      setAutoPilotTarget(null);
      setInviteOverlayOpen(false);
      setMapExpanded(false);
      setActiveStoreKey(null);
      setCartOpen(true);
      setLiveUserInteraction(null);
      onDemoCommandHandled?.(demoCommand.id);
      return;
    }

    onDemoCommandHandled?.(demoCommand.id);
  }, [demoCommand, coShopActive, onDemoCommandHandled, coShopSession]);

  useEffect(() => {
    if (!demoHighlightSelection) return undefined;
    const timer = window.setTimeout(() => setDemoHighlightSelection(null), 4200);
    return () => window.clearTimeout(timer);
  }, [demoHighlightSelection]);

  // minimap pose
  const [pose, setPose] = useState({
    x: 0,
    z: 3,
    yaw: 0,
    viewMode: "tpv",
    activeStoreKey: null,
    nearbyStoreKey: null,
  });

  // ✅ AI Brain / Elly state
  const [ellyHidden, setEllyHidden] = useState(false);
  const [ellyInsight, setEllyInsight] = useState(null);
  const [brainCuePacket, setBrainCuePacket] = useState(null);
  const [friendBrainCuePacket, setFriendBrainCuePacket] = useState(null);
  const [investorMetrics, setInvestorMetrics] = useState({
    scans: 0,
    productScans: 0,
    emotionConfidence: 74,
    budgetFit: 70,
    topMatchScore: 66,
  });
  const metricsRef = useRef({
    scans: 0,
    productScans: 0,
    emotionConfidence: 74,
    budgetFit: 70,
    topMatchScore: 66,
  });

  useEffect(() => {
    metricsRef.current = investorMetrics;
  }, [investorMetrics]);

  // ✅ Cart state (in-sim)
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => ({
    items: [], // { id, name, price, image, qty, storeKey, brandLabel, accent }
  }));

  const storeByKey = useMemo(() => {
    const m = new Map();
    STOREFRONTS.forEach((s) => m.set(s.key, s));
    return m;
  }, []);

  const cartCount = cart.items.reduce((n, it) => n + it.qty, 0);

  const incQty = useCallback((key) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.key === key ? { ...it, qty: it.qty + 1 } : it,
      ),
    }));
  }, []);

  const decQty = useCallback((key) => {
    setCart((prev) => {
      const items = prev.items
        .map((it) => (it.key === key ? { ...it, qty: it.qty - 1 } : it))
        .filter((it) => it.qty > 0);
      return { ...prev, items };
    });
  }, []);

  const removeItem = useCallback((key) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.key !== key),
    }));
  }, []);

  const fire = useCallback(
    (evt) => {
      // Always forward to parent first (analytics, timeline, etc.)
      // NOTE: For "enter store", we emit STORE_INTERACT_IN_SIM to prevent
      // parent routing logic (if any) from navigating away from this sim.
      const outType = toInSimEventType(evt.type);
      const outEvt =
        outType !== evt.type
          ? { ...evt, type: outType, originalType: evt.type, inSim: true }
          : { ...evt, inSim: true };
      onEvent?.(outEvt);

      // ✅ Local AI logic – updates Elly preview for every storefront
      const s = storeByKey.get(evt.storeKey);
      if (!s) return;

      const cueType = toEllyEventType(evt.type);
      const brainScript = buildBrainCues({
        type: cueType,
        storeKey: evt.storeKey,
        storeLabel: evt.storeLabel || s.label,
        persona,
        dwellSeconds: evt.dwellSeconds || 0,
        productName: evt.productName || "",
        price: evt.price || 0,
        retinaSignal: evt.retinaSignal || "",
        emotionTag: evt.emotionTag || "",
      });

      let syncedInsight = null;

      // keep Elly visible unless user explicitly hid it
      if (!ellyHidden) {
        const insight = buildEllyInsight({
          type: cueType,
          storeKey: evt.storeKey,
          storeLabel: evt.storeLabel || s.label,
          dwellSeconds: evt.dwellSeconds || 0,
          persona,
          productName: evt.productName || "",
          retinaSignal: evt.retinaSignal || "",
          emotionTag: evt.emotionTag || "",
        });

        if (insight) {
          syncedInsight = insight;
          setEllyInsight(insight);
        }
      }

      if (coShopActive) {
        const sourceProducts = STORE_PRODUCTS[evt.storeKey] || [];
        const primaryRecs = sourceProducts.slice(0, 2).map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
        }));
        const friendSource =
          sourceProducts.slice(2, 4).length > 0
            ? sourceProducts.slice(2, 4)
            : sourceProducts.slice(0, 2);
        const friendRecs = friendSource.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
        }));
        setCoShopPacket({
          storeLabel: evt.storeLabel || s.label,
          primaryLabel: coShopSession?.primaryLabel || "Primary Shopper",
          friendLabel: coShopSession?.friendLabel || "Remote Friend",
          scenarioLabel: coShopSession?.scenarioLabel || "Invite-A-Friend Session",
          scenarioDescription:
            coShopSession?.description ||
            "Two live shoppers are active in one shared virtual mall trip.",
          primaryStatus:
            cueType === "AVATAR_STOPPED"
              ? "Primary Elly: analyzing dwell + intent"
              : cueType === "STORE_CART_ADD"
                ? "Primary Elly: cart and biometric reaction fused"
                : "Primary Elly: tracking boutique interest",
          friendStatus:
            cueType === "STORE_INTERACT"
              ? "Friend Elly: matching shared purchase intent"
              : cueType === "STORE_CART_ADD"
                ? "Friend Elly: syncing remote overlap and companion picks"
                : "Friend Elly: comparing remote overlap",
          friendVariant: coShopSession?.friendVariant || "female",
          primaryRecs,
          friendRecs,
          friendThoughts:
            cueType === "STORE_CART_ADD"
              ? [
                  `My Elly also likes ${evt.productName || "this item"} for the shared shortlist.`,
                  "I am comparing this pick against my own saved preferences.",
                  "Friend Elly is checking whether this fits both of our goals.",
                ]
              : cueType === "STORE_INTERACT"
                ? [
                    `I just joined ${evt.storeLabel || s.label} with my own Elly stream.`,
                    "Friend Elly is surfacing my strongest matches in this storefront.",
                    "I am reviewing whether this store works for both of us.",
                  ]
                : cueType === "AVATAR_STOPPED"
                  ? [
                      `I am pausing on ${evt.storeLabel || s.label} while my Elly compares options.`,
                      "Friend Elly is reading dwell and emotional signals from my side too.",
                      "I am checking if we both respond to the same styles here.",
                    ]
                  : cueType === "STORE_ZONE_EXIT"
                    ? [
                        `I logged ${evt.storeLabel || s.label} and my Elly will re-surface it later if needed.`,
                        "Friend Elly is saving this visit for retargeting and follow-up.",
                        "I am ready to compare the next storefront with your session.",
                      ]
                    : [
                        `I am scanning ${evt.storeLabel || s.label} from the shared session.`,
                        "Friend Elly is comparing my profile against yours in real time.",
                        "I am browsing remotely while my Elly updates shared overlap.",
                      ],
        });
      }

      setBrainCuePacket({
        id: `${Date.now()}-${evt.storeKey}-${cueType}`,
        cues: brainScript.micro,
        panelCues: brainScript.panel,
        mode: mapEllyMode(cueType),
      });

      if (coShopActive) {
        const friendCues =
          cueType === "STORE_CART_ADD"
            ? [
                `Friend Elly: comparing ${evt.productName || "cart item"} against remote taste profile.`,
                "Friend Elly: syncing overlap, gifting cues, and companion-fit signals.",
                "Friend Elly: updating shared shortlist for both shoppers.",
              ]
            : cueType === "STORE_INTERACT"
              ? [
                  `Friend Elly: joining ${evt.storeLabel || s.label} browse session.`,
                  "Friend Elly: searching remote preferences for parallel matches.",
                  "Friend Elly: highlighting overlap between both shoppers.",
                ]
              : cueType === "AVATAR_STOPPED"
                ? [
                    `Friend Elly: reading dwell and emotional intent near ${evt.storeLabel || s.label}.`,
                    "Friend Elly: ranking companion picks for the shared trip.",
                    "Friend Elly: preparing coordinated suggestions.",
                  ]
                : [
                    `Friend Elly: tracking ${evt.storeLabel || s.label} from the shared session.`,
                    "Friend Elly: keeping remote shopper profile in sync.",
                    "Friend Elly: recalculating overlap and gift-fit signals.",
                  ];

        setFriendBrainCuePacket({
          id: `${Date.now()}-${evt.storeKey}-${cueType}-friend`,
          cues: friendCues,
          mode: mapEllyMode(cueType),
        });
      } else {
        setFriendBrainCuePacket(null);
      }

      const featuredPrice = Number(brainScript?.featured?.price || 0);
      const scanStep =
        cueType === "STORE_ZONE_ENTER"
          ? 1
          : cueType === "AVATAR_STOPPED"
            ? 2
            : cueType === "STORE_CART_ADD"
              ? 3
            : 1;
      const productStep =
        cueType === "STORE_ZONE_ENTER"
          ? 2
          : cueType === "AVATAR_STOPPED"
            ? 4
            : cueType === "STORE_INTERACT"
              ? 3
              : cueType === "STORE_CART_ADD"
                ? 5
              : 1;
      const emotionDelta =
        cueType === "AVATAR_STOPPED"
          ? 3
          : cueType === "STORE_CART_ADD"
            ? 5
          : cueType === "STORE_ZONE_EXIT"
            ? -1
            : 1;
      const budgetDelta =
        cueType === "STORE_INTERACT"
          ? 2
          : cueType === "STORE_CART_ADD"
            ? 4
          : cueType === "STORE_ZONE_EXIT"
            ? 1
            : 0;
      const topMatchDelta =
        cueType === "STORE_CART_ADD"
          ? 5
          :
        featuredPrice > 5000 ? 3 : featuredPrice > 2000 ? 2 : 1;
      const prevMetrics = metricsRef.current;
      const nextMetrics = {
        scans: prevMetrics.scans + scanStep,
        productScans: prevMetrics.productScans + productStep,
        emotionConfidence: clampPct(prevMetrics.emotionConfidence + emotionDelta),
        budgetFit: clampPct(prevMetrics.budgetFit + budgetDelta),
        topMatchScore: clampPct(prevMetrics.topMatchScore + topMatchDelta),
      };
      metricsRef.current = nextMetrics;
      setInvestorMetrics(nextMetrics);

      onBrainStateChange?.({
        ts: Date.now(),
        mode: mapEllyMode(cueType),
        insight:
          syncedInsight ||
          {
            title: "Elly • Live processing",
            subtitle: evt.storeLabel || s.label,
            summary:
              "The simulator AI is still analyzing behavior signals and updating recommendations.",
          },
        cueLines: brainScript.panel,
        microCues: brainScript.micro,
        metrics: nextMetrics,
      });

      // On exit, softly clear (but don’t yank instantly if we’re mid-read)
      if (evt.type === "STORE_ZONE_EXIT") {
        setTimeout(() => {
          setEllyInsight((prev) => {
            if (!prev) return null;
            if (prev.subtitle === (evt.storeLabel || s.label)) return null;
            return prev;
          });
        }, 900);
      }
    },
    [onEvent, onBrainStateChange, storeByKey, ellyHidden, persona, clampPct, coShopActive, coShopSession],
  );

  // Keep AI Brain state in sync even if a movement-zone event is missed during scripted demos.
  // This guarantees event transitions when the in-sim store overlay changes.
  const prevActiveStoreKeyRef = useRef(null);
  useEffect(() => {
    const prevKey = prevActiveStoreKeyRef.current;
    if (prevKey && prevKey !== activeStoreKey) {
      const prevStore = storeByKey.get(prevKey);
      fire({
        type: "STORE_ZONE_EXIT",
        storeKey: prevKey,
        storeLabel: prevStore?.label || prevKey,
      });
    }

    if (activeStoreKey && prevKey !== activeStoreKey) {
      const activeStore = storeByKey.get(activeStoreKey);
      fire({
        type: "STORE_INTERACT_IN_SIM",
        storeKey: activeStoreKey,
        storeLabel: activeStore?.label || activeStoreKey,
      });
    }

    prevActiveStoreKeyRef.current = activeStoreKey || null;
  }, [activeStoreKey, fire, storeByKey]);

  // V toggles view only when not in store
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!simulatorActive || isEditableTarget(e.target)) return;
      if (activeStoreKey) return;
      if (e.code === "KeyV") {
        e.preventDefault();
        setViewMode((m) => (m === "tpv" ? "fpv" : "tpv"));
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [activeStoreKey, simulatorActive]);

  // M toggles the expanded mall map globally while in the simulator
  useEffect(() => {
    const onMapKeyDown = (e) => {
      if (!simulatorActive || isEditableTarget(e.target)) return;
      if (inviteOverlayOpen) return;
      const isMapKey =
        e.code === "KeyM" || e.key === "m" || e.key === "M";
      if (!isMapKey) return;
      if (e.repeat) return;
      e.preventDefault();
      e.stopPropagation();
      setMapExpanded((prev) => !prev);
    };

    window.addEventListener("keydown", onMapKeyDown, true);
    document.addEventListener("keydown", onMapKeyDown, true);

    return () => {
      window.removeEventListener("keydown", onMapKeyDown, true);
      document.removeEventListener("keydown", onMapKeyDown, true);
    };
  }, [simulatorActive, inviteOverlayOpen]);

  useEffect(() => {
    const onInviteKeyDown = (e) => {
      if (!simulatorActive || isEditableTarget(e.target)) return;
      const isInviteKey = e.code === "KeyI" || e.key === "i" || e.key === "I";
      if (!isInviteKey || e.repeat) return;
      if (activeStoreKey || coShopActive) return;
      e.preventDefault();
      e.stopPropagation();
      setMapExpanded(false);
      setInviteOverlayOpen((prev) => !prev);
    };

    window.addEventListener("keydown", onInviteKeyDown, true);
    document.addEventListener("keydown", onInviteKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onInviteKeyDown, true);
      document.removeEventListener("keydown", onInviteKeyDown, true);
    };
  }, [simulatorActive, activeStoreKey, coShopActive]);

  // E enters store overlay when prompt is active
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!simulatorActive || isEditableTarget(e.target)) return;
      if (e.key !== "e" && e.key !== "E") return;
      e.preventDefault();
      if (inviteOverlayOpen) return;
      if (!prompt?.storeKey) return;
      if (activeStoreKey) return;

      // let parent know (also triggers Elly enter state)
      fire({
        type: "STORE_INTERACT_IN_SIM",
        storeKey: prompt.storeKey,
        storeLabel: prompt.storeLabel,
      });
      setActiveStoreKey(prompt.storeKey);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prompt, activeStoreKey, fire, simulatorActive, inviteOverlayOpen]);

  // ESC closes store overlay; if cart is open, close cart first
  useEffect(() => {
    const onKeyDown = (e) => {
      const hasOverlayOpen = Boolean(activeStoreKey || cartOpen || inviteOverlayOpen);
      if ((!simulatorActive && !hasOverlayOpen) || isEditableTarget(e.target)) return;
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (cartOpen) {
        setCartOpen(false);
        return;
      }
      if (inviteOverlayOpen) {
        setInviteOverlayOpen(false);
        return;
      }
      if (activeStoreKey) {
        setActiveStoreKey(null);
        return;
      }
      if (typeof document !== "undefined" && document.pointerLockElement) {
        document.exitPointerLock?.();
        return;
      }
      setMapExpanded(false);
      setSimulatorActive(false);
      wrapRef.current?.blur?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeStoreKey, cartOpen, simulatorActive, inviteOverlayOpen]);

  const addToCart = useCallback(
    (
      storeKey,
      brandLabel,
      accent,
      product,
      color = "black",
      options = {},
    ) => {
      const { incrementIfExists = true } = options || {};
      const retinaSignal =
        product.price >= 5000
          ? "Retina scan: pupils dilated on premium timepiece focus."
          : product.price >= 2000
            ? "Retina scan: elevated emotional response during product lock."
            : "Retina scan: positive engagement spike during product review.";
      const emotionTag =
        product.price >= 5000
          ? "high-arousal luxury interest"
          : product.tag === "Best Seller" || product.tag === "Icon"
            ? "confidence and familiarity"
            : "curiosity with positive purchase intent";

      let didUpdateCart = false;
      setCart((prev) => {
        const next = { ...prev, items: [...prev.items] };
        const key = `${product.id}:${color}`;
        const idx = next.items.findIndex((x) => x.key === key);
        if (idx >= 0) {
          if (!incrementIfExists) {
            return prev;
          }
          next.items[idx] = {
            ...next.items[idx],
            qty: next.items[idx].qty + 1,
          };
          didUpdateCart = true;
        } else {
          next.items.push({
            key,
            id: product.id,
            name: product.name,
            price: product.price,
            color,
            image: resolveProductImage(product, color),
            description: product.description || "",
            qty: 1,
            storeKey,
            brandLabel,
            accent,
          });
          didUpdateCart = true;
        }
        return next;
      });

      if (!didUpdateCart) return;

      setEllySelectionsByStore((prev) => ({
        ...prev,
        [storeKey]: {
          productId: product.id,
          productName: product.name,
          color,
          sizeProfile: options?.sizeProfile || null,
          reason:
            options?.reason ||
            buildEllyReason({
              storeLabel: brandLabel,
              productName: product.name,
              color,
              sizeProfile: options?.sizeProfile || null,
            }),
        },
      }));

      fire({
        type: "STORE_CART_ADD",
        storeKey,
        storeLabel: brandLabel,
        productName: product.name,
        price: product.price,
        color,
        retinaSignal,
        emotionTag,
      });
    },
    [fire],
  );

  const activeAccent = useMemo(() => {
    const key = prompt?.storeKey || pose.activeStoreKey;
    const s = key ? storeByKey.get(key) : null;
    return s?.accent || "#4aa3ff";
  }, [prompt, pose.activeStoreKey, storeByKey]);

  const cartAccent = useMemo(() => {
    // if cart has any items, use the first item's store accent
    if (cart.items?.length) return cart.items[0].accent || activeAccent;
    return activeAccent;
  }, [cart.items, activeAccent]);

  const ellyConclusionLines = useMemo(() => {
    if (!cart.items?.length) return [];
    const byStore = new Map();
    cart.items.forEach((item) => {
      if (!item?.storeKey || byStore.has(item.storeKey)) return;
      byStore.set(item.storeKey, item);
    });
    return Array.from(byStore.values()).map((item) => {
      const suggestion = ellySelectionsByStore[item.storeKey];
      return (
        suggestion?.reason ||
        buildEllyReason({
          storeLabel: item.brandLabel || item.storeKey,
          productName: item.name,
          color: item.color,
          sizeProfile: suggestion?.sizeProfile || null,
        })
      );
    });
  }, [cart.items, ellySelectionsByStore]);

  const showRightPreviewStack =
    !activeStoreKey &&
    (Boolean(prompt) ||
      (!ellyHidden && Boolean(ellyInsight)) ||
      (coShopActive && Boolean(coShopPacket)));

  return (
    <div ref={wrapRef} style={{ width: "100%" }} tabIndex={-1}>
      <div
        className="walkCanvasShell"
        onPointerDown={(e) => {
          if (isEditableTarget(e.target)) return;
          const target = e.target;
          if (
            target instanceof HTMLElement &&
            target.closest("button, input, textarea, select, a")
          ) {
            return;
          }
          setSimulatorActive(true);
          wrapRef.current?.focus?.();
        }}
        style={{
          position: "relative",
          width: "100%",
          height: resolvedHeight,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Canvas
          shadows
          dpr={[1, 1.35]}
          camera={{ position: [0, 2.8, 8], fov: 52, near: 0.08, far: 220 }}
          // ✅ Critical: while the store overlay is open, let clicks go to the overlay UI.
          style={{ pointerEvents: activeStoreKey || inviteOverlayOpen ? "none" : "auto" }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#0b1220"), 1);
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
          }}
        >
          <Scene
            onEvent={fire}
            setPrompt={setPrompt}
            viewMode={viewMode}
            inStore={!!activeStoreKey}
            simulatorActive={simulatorActive}
            autoPilotTarget={autoPilotTarget}
            ellySelectionsByStore={ellySelectionsByStore}
            liveUserInteraction={liveUserInteraction}
            onPose={(p) => setPose((prev) => ({ ...prev, ...p }))}
            coShopSession={coShopSession}
            coShopPacket={coShopPacket}
          />
        </Canvas>

        <BrainCueWidget
          cuePacket={brainCuePacket}
          avoidPanel={showRightPreviewStack}
        />
        {coShopActive ? (
          <BrainCueWidget cuePacket={friendBrainCuePacket} side="left" />
        ) : null}

        {/* ✅ Cart pill (always in-sim; no page navigation) */}
        <button
          style={{ ...styles.cartPill, borderColor: `rgba(255,255,255,0.16)` }}
          onClick={() => setCartOpen(true)}
          title="Open cart"
        >
          🛒 Cart
          <span style={styles.cartCount}>{cartCount}</span>
        </button>

        {!coShopActive ? (
          <button
            type="button"
            style={styles.inviteTogglePill}
            onClick={() => {
              setMapExpanded(false);
              setInviteOverlayOpen((prev) => !prev);
            }}
            title="Open invite overlay"
          >
            Invite (I)
          </button>
        ) : null}

        {mapExpanded ? (
          <div style={styles.mapOverlay}>
            <div style={styles.mapOverlayCard}>
              <div style={styles.mapOverlayHeader}>
                <div>
                  <div style={styles.mapOverlayTitle}>Mall Map Recommendations</div>
                  <div style={styles.mapOverlaySubtitle}>
                    Expanded mall layout. Storefronts light up as you approach them.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMapExpanded(false)}
                  style={styles.mapOverlayClose}
                >
                  Close Map
                </button>
              </div>
              <div style={styles.mapOverlayCanvas}>
                <MallPreview3D
                  storefronts={STOREFRONTS.map(({ key, label, side, z, accent }) => ({
                    key,
                    label,
                    side,
                    z,
                    accent,
                  }))}
                  avatarX={pose.x}
                  avatarZ={pose.z}
                  avatarYaw={pose.yaw}
                  activeStoreKey={pose.activeStoreKey}
                  nearbyStoreKey={pose.nearbyStoreKey}
                />
              </div>
              <div style={styles.mapOverlayLegend}>
                {STOREFRONTS.map((s) => (
                  <div key={s.key} style={styles.minimapLegendRow}>
                    <span style={{ ...styles.minimapDot, background: s.accent }} />
                    <span style={styles.minimapLegendText}>{s.label}</span>
                  </div>
                ))}
                <div style={styles.minimapLegendNote}>
                  Press <b>M</b> again to close. Nearby storefronts glow first; entered storefronts glow brightest.
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {inviteOverlayOpen && !coShopActive ? (
          <div style={styles.inviteOverlay}>
            <div style={styles.inviteOverlayCard}>
              <div style={styles.inviteOverlayHeader}>
                <div>
                  <div style={styles.inviteOverlayTitle}>Invite a Friend</div>
                  <div style={styles.inviteOverlaySubtitle}>
                    Enter a mock email to reload the simulator into a shared two-shopper session with dual Elly analysis.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInviteOverlayOpen(false)}
                  style={styles.mapOverlayClose}
                >
                  Close
                </button>
              </div>
              <div style={styles.inviteOverlayBody}>
                <input
                  type="email"
                  value={coShopInviteEmail}
                  onChange={(e) => onCoShopInviteEmailChange?.(e.target.value)}
                  placeholder="friend@email.com"
                  style={styles.inviteOverlayInput}
                  autoFocus
                />
                <div style={styles.inviteOverlayActions}>
                  <button
                    type="button"
                    style={styles.secondaryBtn}
                    onClick={() => setInviteOverlayOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    style={styles.primaryBtn}
                    onClick={() => {
                      onCoShopInviteSend?.(coShopInviteEmail);
                      setInviteOverlayOpen(false);
                    }}
                  >
                    Send Invite
                  </button>
                </div>
                <div style={styles.inviteOverlayFootnote}>
                  Mock flow: once sent, the simulator reloads from the normal mall start with the invited friend avatar and a second Elly stream.
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ✅ Right-side Elly command panel + store preview */}
        {!activeStoreKey &&
          (prompt ? (
            <>
              <div style={styles.previewStackWrap}>
                {!ellyHidden ? (
                  <EllyPreviewCard
                    insight={ellyInsight}
                    accent={activeAccent}
                    onClose={() => setEllyHidden(true)}
                    mode={brainCuePacket?.mode || "idle"}
                    cueLines={brainCuePacket?.panelCues || []}
                    metrics={investorMetrics}
                  />
                ) : null}

                <CoShopPreviewCard packet={coShopPacket} active={coShopActive} />

                <StorePreviewCard storeKey={prompt.storeKey} />
              </div>
            </>
          ) : (
            ((!ellyHidden && ellyInsight) || (coShopActive && coShopPacket)) && (
              <div style={styles.previewStackWrap}>
                {!ellyHidden && ellyInsight ? (
                  <EllyPreviewCard
                    insight={ellyInsight}
                    accent={activeAccent}
                    onClose={() => setEllyHidden(true)}
                    mode={brainCuePacket?.mode || "idle"}
                    cueLines={brainCuePacket?.panelCues || []}
                    metrics={investorMetrics}
                  />
                ) : null}
                <CoShopPreviewCard packet={coShopPacket} active={coShopActive} />
              </div>
            )
          ))}

        {/* ✅ Store overlay (IN-SIM) */}
        {activeStoreKey ? (
          <>
          <StoreOverlay
            storeKey={activeStoreKey}
            onAddToCart={addToCart}
            onOpenCart={() => setCartOpen(true)}
            cartCount={cartCount}
            highlightedSelection={demoHighlightSelection}
          />
            <div className="exitStorePill" style={styles.exitStorePill}>
              Press <b>ESC</b> to exit store
            </div>
          </>
        ) : null}

        {/* ✅ Cart Drawer */}
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cart.items}
          onInc={incQty}
          onDec={decQty}
          onRemove={removeItem}
          accent={cartAccent}
          ellyConclusionLines={ellyConclusionLines}
        />
      </div>

      <p
        className="muted walkCaption"
        style={{ margin: "10px 0 0", opacity: 0.8 }}
      >
        Virtual Mall Walkthrough •{" "}
        {viewMode === "tpv" ? "3rd-person follow" : "FPV"} • Mouse steering •
        Elly AI preview reacts on stop/enter/exit • In-sim cart
      </p>
    </div>
  );
}

/* ---------------------------------------------
   Inline styles (kept minimal; can move to App.css)
---------------------------------------------- */
const styles = {
  // Top-left pills
  walkTopLeft: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 6,
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  walkPillBtn: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10,14,22,0.45)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    fontWeight: 700,
  },

  // Cart pill
  cartPill: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 25,
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10,14,22,0.55)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },
  cartCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    padding: "0 8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 12,
    fontWeight: 900,
  },

  mapTogglePill: {
    position: "absolute",
    right: 12,
    top: 86,
    zIndex: 20,
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(127,231,255,0.26)",
    background: "rgba(10,14,22,0.58)",
    color: "rgba(233,247,255,0.94)",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    fontWeight: 800,
    boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
  },
  inviteTogglePill: {
    position: "absolute",
    right: 12,
    top: 86,
    zIndex: 20,
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(10,14,22,0.58)",
    color: "rgba(233,247,255,0.94)",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    fontWeight: 800,
    boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
  },
  inviteOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 29,
    background: "rgba(4,10,18,0.34)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  inviteOverlayCard: {
    width: "min(460px, 94%)",
    background:
      "linear-gradient(180deg, rgba(10,18,28,0.88), rgba(8,14,24,0.72))",
    border: "1px solid rgba(127,231,255,0.26)",
    borderRadius: 18,
    boxShadow:
      "0 0 0 1px rgba(127,231,255,0.08) inset, 0 20px 50px rgba(0,0,0,0.38)",
    overflow: "hidden",
  },
  inviteOverlayHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    padding: "16px 18px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  inviteOverlayTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: "rgba(236,247,255,0.96)",
  },
  inviteOverlaySubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 1.45,
    color: "rgba(194,222,238,0.8)",
  },
  inviteOverlayBody: {
    display: "grid",
    gap: 12,
    padding: 18,
  },
  inviteOverlayInput: {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.95)",
    padding: "12px 14px",
    fontSize: 15,
    outline: "none",
  },
  inviteOverlayActions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },
  inviteOverlayFootnote: {
    fontSize: 11,
    lineHeight: 1.45,
    color: "rgba(194,222,238,0.68)",
  },

  mapOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 30,
    background: "rgba(18,24,33,0.96)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  mapOverlayCard: {
    width: "min(920px, 96%)",
    height: "min(640px, 92%)",
    background: "linear-gradient(180deg, #2a3442, #202935)",
    border: "1px solid rgba(127,231,255,0.26)",
    borderRadius: 18,
    boxShadow:
      "0 0 0 1px rgba(127,231,255,0.08) inset, 0 20px 50px rgba(0,0,0,0.38)",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    overflow: "hidden",
  },
  mapOverlayHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    padding: "16px 18px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  mapOverlayTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: "rgba(236,247,255,0.96)",
  },
  mapOverlaySubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 1.4,
    color: "rgba(194,222,238,0.8)",
  },
  mapOverlayClose: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontWeight: 700,
  },
  mapOverlayCanvas: {
    minHeight: 0,
    padding: "12px 18px 0",
    background: "#34404f",
  },
  mapOverlayLegend: {
    padding: "12px 18px 16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    background: "#2a3441",
  },

  // Minimap
  minimapWrap: {
    position: "absolute",
    right: 12,
    top: 68, // pushed down below centered pill
    zIndex: 6,
    width: 320,
    maxWidth: "min(340px, 46vw)",
    background:
      "linear-gradient(180deg, rgba(14,22,34,0.82), rgba(8,14,24,0.64))",
    border: "1px solid rgba(127,231,255,0.22)",
    borderRadius: 14,
    overflow: "hidden",
    backdropFilter: "blur(14px)",
    boxShadow:
      "0 0 0 1px rgba(127,231,255,0.08) inset, 0 14px 34px rgba(0,0,0,0.4)",
  },
  minimapHeader: {
    padding: "10px 12px 8px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(127,231,255,0.12), rgba(127,231,255,0.02))",
  },
  minimapTitle: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.3,
    color: "rgba(233,247,255,0.96)",
  },
  minimapSubtitle: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 1.35,
    color: "rgba(194,222,238,0.78)",
  },
  minimapLegend: {
    padding: 10,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "grid",
    gap: 6,
  },
  minimapLegendRow: { display: "flex", alignItems: "center", gap: 10 },
  minimapDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    boxShadow: "0 0 0 2px rgba(255,255,255,0.08)",
  },
  minimapLegendText: { fontSize: 11, opacity: 0.9 },
  minimapLegendNote: {
    fontSize: 11,
    opacity: 0.65,
    marginTop: 6,
    lineHeight: 1.25,
  },

  // Right-side stacked cards (Elly command panel + store preview)
  previewStackWrap: {
    position: "absolute",
    right: 18,
    top: 132,
    zIndex: 8,
    width: 312,
    maxWidth: "min(312px, 42vw)",
    maxHeight: "calc(100% - 156px)",
    display: "grid",
    gap: 8,
    overflowY: "auto",
    paddingRight: 2,
  },
  coShopCard: {
    background:
      "linear-gradient(180deg, rgba(18,24,38,0.74), rgba(10,15,26,0.52))",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: 12,
    color: "rgba(239,245,250,0.95)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.32)",
  },
  coShopHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  coShopTitle: {
    fontWeight: 800,
    letterSpacing: 0.4,
  },
  coShopStoreChip: {
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  coShopSubtitle: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 1.4,
    opacity: 0.82,
  },
  coShopGrid: {
    marginTop: 10,
    display: "grid",
    gap: 10,
  },
  coShopUserCard: {
    padding: 10,
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  coShopUserHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  coShopAvatarWrap: {
    width: 34,
    display: "grid",
    justifyItems: "center",
    gap: 2,
  },
  coShopAvatarHead: {
    width: 14,
    height: 14,
    borderRadius: 99,
    background: "#10151d",
  },
  coShopAvatarBody: {
    width: 16,
    height: 24,
    borderRadius: 10,
    background: "#10151d",
  },
  coShopAvatarBodyFemale: {
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "22px solid #10151d",
    borderRadius: 0,
    background: "transparent",
  },
  coShopUserLabel: {
    fontWeight: 700,
    fontSize: 13,
  },
  coShopUserStatus: {
    fontSize: 11,
    marginTop: 2,
  },
  coShopRecoLabel: {
    marginTop: 10,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    opacity: 0.72,
  },
  coShopRecoList: {
    marginTop: 6,
    display: "grid",
    gap: 6,
  },
  coShopRecoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    fontSize: 12,
    padding: "6px 8px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
  },

  // Store preview card
  previewCard: {
    background: "rgba(6,12,20,0.8)",
    border: "1px solid rgba(127,231,255,0.28)",
    borderRadius: 14,
    padding: 10,
    color: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(14px)",
    boxShadow:
      "0 0 0 1px rgba(127,231,255,0.14) inset, 0 16px 38px rgba(0,0,0,0.44)",
  },
  previewRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 8px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  // Elly card
  ellyCard: {
    background:
      "linear-gradient(180deg, rgba(8,24,38,0.82), rgba(6,16,28,0.68))",
    border: "1px solid rgba(127,231,255,0.5)",
    borderRadius: 14,
    padding: 12,
    color: "rgba(226,247,255,0.98)",
    backdropFilter: "blur(14px)",
    boxShadow:
      "0 0 0 1px rgba(127,231,255,0.2) inset, 0 16px 34px rgba(0,0,0,0.44)",
  },
  ellyAvatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 999,
    border: "1px solid rgba(127,231,255,0.55)",
    background:
      "radial-gradient(circle at 50% 40%, rgba(194,246,255,0.18), rgba(3,10,18,0.24))",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.12) inset, 0 0 16px rgba(127,231,255,0.22)",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    padding: 0,
  },
  ellyAvatarImg: {
    width: "110%",
    height: "110%",
    objectFit: "cover",
    objectPosition: "center 41%",
    mixBlendMode: "screen",
    transform: "translateY(-2px)",
    filter:
      "saturate(1.12) brightness(1.08) drop-shadow(0 0 7px rgba(127,231,255,0.6))",
  },
  ellyMetricStrip: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 7,
  },
  ellyMetricChip: {
    borderRadius: 10,
    border: "1px solid rgba(127,231,255,0.28)",
    background: "rgba(127,231,255,0.08)",
    padding: "6px 7px",
    minWidth: 0,
  },
  ellyMetricLabel: {
    fontSize: 10,
    opacity: 0.76,
    lineHeight: 1.1,
    textTransform: "uppercase",
    letterSpacing: 0.35,
  },
  ellyMetricValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 800,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  ellyDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    boxShadow: "0 0 0 2px rgba(127,231,255,0.22)",
  },
  ellyCloseBtn: {
    borderRadius: 10,
    border: "1px solid rgba(127,231,255,0.32)",
    background: "rgba(127,231,255,0.10)",
    color: "rgba(214,246,255,0.94)",
    cursor: "pointer",
    padding: "6px 9px",
    lineHeight: 1,
    fontWeight: 800,
  },
  ellySignalRow: { display: "flex", gap: 8, alignItems: "center" },
  ellyRecRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 10px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  // Store overlay
  storeOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    background: "rgba(6,10,16,0.78)",
    backdropFilter: "blur(18px)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
  },
  storeTopBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.92)",
  },
  exitHint: {
    marginLeft: 10,
    fontSize: 12,
    opacity: 0.82,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    padding: "4px 8px",
    borderRadius: 999,
  },
  backBtn: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontWeight: 800,
  },
  storeBody: { padding: 16, overflow: "auto" },
  storeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },
  productCard: {
    borderRadius: 16,
    padding: 14,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.92)",
  },
  productCardHighlighted: {
    border: "3px solid rgba(76, 247, 255, 1)",
    boxShadow: "0 0 0 3px rgba(76, 247, 255, 0.55), 0 0 34px rgba(76, 247, 255, 0.62), 0 0 60px rgba(138, 255, 246, 0.42)",
    background: "linear-gradient(180deg, rgba(76, 247, 255, 0.20), rgba(76, 247, 255, 0.08))",
    transform: "translateY(-2px)",
    transition: "all 180ms ease",
  },
  ellyPickPill: {
    marginTop: 8,
    marginBottom: 4,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    borderRadius: 999,
    padding: "4px 8px",
    border: "1px solid rgba(76, 247, 255, 0.95)",
    color: "rgba(216, 255, 252, 0.98)",
    background: "rgba(76, 247, 255, 0.2)",
  },
  tagPill: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
    opacity: 0.92,
    fontWeight: 800,
  },
  productImg: {
    width: "100%",
    height: 150,
    objectFit: "contain",
    borderRadius: 12,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  imgFallback: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    background: "rgba(0,0,0,0.18)",
    border: "1px dashed rgba(255,255,255,0.18)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 12,
  },

  colorRow: {
    marginTop: 10,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  colorPill: {
    padding: "6px 10px",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
    textTransform: "lowercase",
  },
  colorThumb: {
    width: 26,
    height: 26,
    borderRadius: 8,
    objectFit: "cover",
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0,
  },
  colorLabel: {
    fontWeight: 900,
    fontSize: 12,
    opacity: 0.92,
  },
  primaryBtn: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.94)",
    cursor: "pointer",
    fontWeight: 850,
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10,14,22,0.35)",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontWeight: 850,
  },

  // Exit pill
  exitStorePill: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: 18,
    zIndex: 22,
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(10,14,22,0.55)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },

  // Cart drawer
  cartOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 40,
  },
  cartBackdrop: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
  },
  cartPanel: {
    position: "absolute",
    right: 12,
    top: 12,
    bottom: 12,
    width: "min(460px, 92vw)",
    borderRadius: 16,
    background: "rgba(6,10,16,0.86)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  cartHeader: {
    padding: "14px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "rgba(255,255,255,0.92)",
  },
  cartCloseBtn: {
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    padding: "6px 9px",
    lineHeight: 1,
    fontWeight: 900,
  },
  cartBody: {
    padding: 14,
    overflow: "auto",
    color: "rgba(255,255,255,0.92)",
  },
  cartFooter: {
    padding: 14,
    borderTop: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.92)",
  },
  ellyConclusionCard: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
    background: "linear-gradient(180deg, rgba(127,231,255,0.16), rgba(127,231,255,0.06))",
    border: "1px solid rgba(127,231,255,0.35)",
  },
  ellyConclusionTitle: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "rgba(190, 246, 255, 0.95)",
    marginBottom: 6,
    fontWeight: 800,
  },
  ellyConclusionList: {
    display: "grid",
    gap: 4,
  },
  ellyConclusionRow: {
    fontSize: 11,
    lineHeight: 1.35,
    opacity: 0.9,
  },
  cartRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  cartThumb: {
    width: 72,
    height: 72,
    objectFit: "contain",
    borderRadius: 12,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontWeight: 950,
    lineHeight: 1,
  },
  removeBtn: {
    marginLeft: 10,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(10,14,22,0.35)",
    color: "rgba(255,255,255,0.86)",
    cursor: "pointer",
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 800,
  },
  checkoutBtn: {
    width: "100%",
    marginTop: 12,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.94)",
    fontWeight: 950,
  },
};
