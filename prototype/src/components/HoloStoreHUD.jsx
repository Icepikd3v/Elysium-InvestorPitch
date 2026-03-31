import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Html, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function assetUrl(path, color = "black") {
  if (!path) return "";
  const base =
    (typeof import.meta !== "undefined" && import.meta?.env?.BASE_URL) || "";
  const baseClean =
    base && base !== "/" ? base.replace(/\/+$/, "") : base === "/" ? "" : "";
  const p0 = path.startsWith("/") ? path : `/${path}`;
  const p = p0.replace(/\(color\)|\{color\}/gi, color);
  return encodeURI(`${baseClean}${p}`);
}

function resolveProductImage(product, variant = "black") {
  const img = product?.image;

  if (img && typeof img === "object") {
    const keys = Object.keys(img);
    return assetUrl(img[variant] || img.black || img[keys[0]] || "");
  }

  return assetUrl(String(img || ""), variant);
}

export default function HoloStoreHUD({
  enabled = true,
  store,
  products = [],
  highlightedPick = null,
  avatarPosRef,
  bayX,
  bayZ,
  y = 2.55,
  showRadius = 14,
  hardHideRadius = 20,
  hideNearRadius = 0,
}) {
  const wrapRef = useRef();
  const htmlRef = useRef(null);
  const { camera } = useThree();

  const seed = useMemo(() => Math.random() * 1000, []);
  const accent = store?.accent || "#4aa3ff";
  const holoColor = "#7fe7ff";

  const [uiTick, setUiTick] = useState(0);
  const nextTickRef = useRef(0);

  useFrame(({ clock }) => {
    if (!wrapRef.current) return;

    if (!enabled) {
      wrapRef.current.visible = false;
      return;
    }

    if (!avatarPosRef?.current) return;

    const t = clock.getElapsedTime();
    const p = avatarPosRef.current;

    const dx = p.x - bayX;
    const dz = p.z - bayZ;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const fadeInStart = Math.max(hideNearRadius + 0.6, 3.6);
    const fadeInEnd = showRadius;
    const farFade =
      fadeInEnd <= fadeInStart
        ? 1
        : clamp(1 - (dist - fadeInStart) / (fadeInEnd - fadeInStart), 0, 1);
    const nearFade =
      hideNearRadius <= 0
        ? 1
        : clamp((dist - hideNearRadius) / 1.75, 0, 1);
    const opacity = 0.18 + easeOutCubic(farFade) * 0.82 * nearFade;

    const visible = dist < hardHideRadius && dist > hideNearRadius;

    const obj = wrapRef.current;

    const bob = Math.sin(t * 1.2 + seed) * 0.04;
    const sway = Math.cos(t * 0.9 + seed) * 0.06;

    obj.position.y = y + bob;
    obj.position.x = bayX + sway;
    obj.position.z = bayZ;

    const cx = camera.position.x;
    const cz = camera.position.z;
    const yaw = Math.atan2(cx - obj.position.x, cz - obj.position.z);
    obj.rotation.y = yaw;

    obj.visible = visible && opacity > 0.08;

    const pulse = 0.6 + Math.sin(t * 1.5 + seed) * 0.1;

    if (htmlRef.current) {
      htmlRef.current.style.opacity = opacity;
      htmlRef.current.style.filter = `drop-shadow(0 0 ${16 * pulse}px ${accent}66)`;
    }

    if (dist < showRadius && dist > hideNearRadius && t > nextTickRef.current) {
      nextTickRef.current = t + 0.6;
      setUiTick((v) => v + 1);
    }
  });

  const safeProducts = products || [];

  const cycleSec = 2.2;
  const now = (uiTick + seed) * 0.6;

  const heroIdx = safeProducts.length
    ? Math.floor(now / cycleSec) % safeProducts.length
    : 0;

  const hero = safeProducts[heroIdx];
  const highlightedProduct =
    highlightedPick && safeProducts.length
      ? safeProducts.find((p) => p.id === highlightedPick.productId) || null
      : null;
  const displayHero = highlightedProduct || hero;

  const rail = [
    displayHero,
    safeProducts[(heroIdx + 1) % safeProducts.length],
    safeProducts[(heroIdx + 2) % safeProducts.length],
  ]
    .filter(Boolean)
    .filter((p, idx, arr) => arr.findIndex((q) => q?.id === p?.id) === idx);

  const logoSrc = assetUrl(store?.logo || "");

  if (!enabled) return null;

  return (
    <group ref={wrapRef}>
      <Text
        position={[0, 1.18, 0]}
        fontSize={0.16}
        anchorX="center"
        anchorY="middle"
      >
        {store?.label}
        <meshStandardMaterial
          color={holoColor}
          emissive={holoColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </Text>

      <mesh position={[0, 0.52, -0.04]}>
        <planeGeometry args={[1.9, 0.04]} />
        <meshBasicMaterial color={holoColor} transparent opacity={0.55} />
      </mesh>

      <Html
        transform
        distanceFactor={6.8}
        zIndexRange={[9999, 0]}
        occlude={false}
      >
        <div
          ref={htmlRef}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 244,
            padding: 10,
            borderRadius: 18,
            color: "rgba(227,248,255,0.98)",
            background:
              "linear-gradient(180deg, rgba(8,22,36,0.68), rgba(2,10,18,0.52))",
            border: "1px solid rgba(127,231,255,0.5)",
            boxShadow:
              "0 0 0 1px rgba(127,231,255,0.2) inset, 0 0 22px rgba(127,231,255,0.2), 0 0 44px rgba(127,231,255,0.08)",
            opacity: 0,
            pointerEvents: "none",
            backdropFilter: "blur(8px)",
            clipPath:
              "polygon(0 10px, 10px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 14px 100%, 0 calc(100% - 14px))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "rgba(127,231,255,0.86)",
              marginBottom: 6,
            }}
          >
            <span>Elly Scan Active</span>
            <span style={{ color: "rgba(255,255,255,0.62)" }}>Live</span>
          </div>

          {/* STORE LOGO */}
          {logoSrc && (
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <img
                src={logoSrc}
                alt={store?.label}
                style={{
                  maxWidth: 124,
                  maxHeight: 36,
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 10px rgba(127,231,255,0.20))",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <b style={{ fontSize: 13, letterSpacing: 0.5 }}>{store?.label}</b>
            <span
              style={{
                fontSize: 10,
                color: "rgba(127,231,255,0.8)",
                textTransform: "uppercase",
                letterSpacing: 0.9,
              }}
            >
              Predicted Picks
            </span>
          </div>

          <div
            style={{
              marginTop: 6,
              display: "grid",
              gap: 6,
              borderTop: "1px solid rgba(127,231,255,0.14)",
              paddingTop: 6,
            }}
          >
            {rail.map((p) => {
              const isHighlighted = highlightedProduct?.id === p.id;
              const color =
                (isHighlighted && highlightedPick?.color) ||
                (Array.isArray(p.colors) && p.colors.length && p.colors[0]) ||
                "black";

              const img = resolveProductImage(p, color);

              return (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "42px 1fr",
                    gap: 7,
                    alignItems: "center",
                    padding: "5px 6px",
                    borderRadius: 10,
                    background: isHighlighted
                      ? "linear-gradient(180deg, rgba(127,231,255,0.18), rgba(127,231,255,0.08))"
                      : "rgba(127,231,255,0.04)",
                    border: isHighlighted
                      ? "1px solid rgba(127,231,255,0.55)"
                      : "1px solid rgba(127,231,255,0.07)",
                    boxShadow: isHighlighted
                      ? "0 0 12px rgba(127,231,255,0.34)"
                      : "none",
                  }}
                >
                  <img
                    src={img}
                    alt={p.name}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 8,
                      objectFit: "cover",
                      background: "rgba(127,231,255,0.06)",
                      border: "1px solid rgba(127,231,255,0.12)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 11.5 }}>{p.name}</div>
                    {isHighlighted ? (
                      <div
                        style={{
                          fontSize: 10,
                          marginTop: 2,
                          color: "rgba(185,244,255,0.95)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Elly Suggestion • {color}
                      </div>
                    ) : null}
                    <div
                      style={{
                        fontSize: 10.5,
                        opacity: 0.82,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span>${p.price}</span>
                      <span style={{ color: "rgba(127,231,255,0.72)" }}>
                        AI match
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              opacity: 0.86,
              letterSpacing: 0.7,
              textTransform: "uppercase",
              color: "rgba(127,231,255,0.84)",
            }}
          >
            Retina profile ready. Press E to enter.
          </div>
        </div>
      </Html>
    </group>
  );
}
