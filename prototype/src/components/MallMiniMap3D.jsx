import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, Text, Billboard } from "@react-three/drei";

/**
 * 3D MiniMap (Top-down Orthographic)
 * - Renders corridor floor + store blocks
 * - Labels each storefront
 * - Shows avatar marker + facing direction
 * - Highlights active store
 *
 * Props:
 *  - storefronts: [{ key, label, side: "left"|"right", z, accent }]
 *  - avatarX, avatarZ, avatarYaw (radians)
 *  - activeStoreKey
 *  - height (px)
 *  - worldBounds: { xMin, xMax, zMin, zMax }
 */
export default function MallMiniMap3D({
  storefronts = [],
  avatarX = 0,
  avatarZ = 0,
  avatarYaw = 0,
  activeStoreKey = null,
  height = 220,
  worldBounds = { xMin: -10.2, xMax: 10.2, zMin: -66, zMax: 5 },
}) {
  const bounds = useMemo(() => {
    const w = worldBounds.xMax - worldBounds.xMin;
    const d = worldBounds.zMax - worldBounds.zMin;
    return {
      ...worldBounds,
      width: w,
      depth: d,
      centerX: (worldBounds.xMin + worldBounds.xMax) * 0.5,
      centerZ: (worldBounds.zMin + worldBounds.zMax) * 0.5,
    };
  }, [worldBounds]);

  // Mini-map "building" dimensions
  const corridorWidth = bounds.width;
  const corridorDepth = bounds.depth;
  const corridorThickness = 0.2;

  const storeWingWidth = 5.9; // visible outside corridor
  const storeBlockHeight = 1.18;
  const storeBlockDepth = 10.9;

  const leftWingX = bounds.xMin - storeWingWidth * 0.5 - 0.9;
  const rightWingX = bounds.xMax + storeWingWidth * 0.5 + 0.9;

  // Camera size (orthographic zoom)
  const orthoZoom =
    Math.max(bounds.width + storeWingWidth * 2.4, bounds.depth) * 0.55;

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(8,12,20,0.55)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <OrthographicCamera
          makeDefault
          position={[bounds.centerX, 80, bounds.centerZ]}
          zoom={orthoZoom}
          near={0.1}
          far={200}
        />
        <ambientLight intensity={0.95} />
        <directionalLight position={[20, 40, 20]} intensity={0.85} />

        {/* Corridor Floor */}
        <mesh position={[bounds.centerX, 0, bounds.centerZ]}>
          <boxGeometry
            args={[corridorWidth, corridorThickness, corridorDepth]}
          />
          <meshStandardMaterial color={"#0e1630"} transparent opacity={0.85} />
        </mesh>

        {/* Corridor side rails */}
        <mesh position={[bounds.xMin, 0.55, bounds.centerZ]}>
          <boxGeometry args={[0.22, 1.1, corridorDepth]} />
          <meshStandardMaterial color={"#243156"} transparent opacity={0.55} />
        </mesh>
        <mesh position={[bounds.xMax, 0.55, bounds.centerZ]}>
          <boxGeometry args={[0.22, 1.1, corridorDepth]} />
          <meshStandardMaterial color={"#243156"} transparent opacity={0.55} />
        </mesh>

        {/* Store Blocks + Labels */}
        {storefronts.map((s) => {
          const isLeft = s.side === "left";
          const x = isLeft ? leftWingX : rightWingX;
          const z = s.z ?? 0;
          const active = activeStoreKey && s.key === activeStoreKey;

          return (
            <group key={s.key} position={[x, 0, z]}>
              <mesh position={[0, storeBlockHeight * 0.5, 0]}>
                <boxGeometry
                  args={[storeWingWidth, storeBlockHeight, storeBlockDepth]}
                />
                <meshStandardMaterial
                  color={active ? "#7ab6ff" : s.accent || "#4b6ea8"}
                  transparent
                  opacity={active ? 0.88 : 0.55}
                  emissive={active ? "#2d6cff" : "#000000"}
                  emissiveIntensity={active ? 0.35 : 0}
                />
              </mesh>

              <Billboard follow position={[0, 1.5, 0]}>
                <Text
                  fontSize={0.72}
                  color={
                    active ? "rgba(235,246,255,0.98)" : "rgba(235,246,255,0.78)"
                  }
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.03}
                  outlineColor="rgba(0,0,0,0.45)"
                >
                  {s.label || s.key}
                </Text>
              </Billboard>
            </group>
          );
        })}

        {/* Avatar marker */}
        <group position={[avatarX, 0.7, avatarZ]} rotation={[0, avatarYaw, 0]}>
          {/* body dot */}
          <mesh>
            <sphereGeometry args={[0.55, 18, 18]} />
            <meshStandardMaterial
              color={"#eaf6ff"}
              emissive={"#7ab6ff"}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* facing arrow */}
          <mesh position={[0, 0, -1.05]} rotation={[Math.PI * 0.5, 0, 0]}>
            <coneGeometry args={[0.35, 0.75, 10]} />
            <meshStandardMaterial
              color={"#eaf6ff"}
              emissive={"#7ab6ff"}
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
}
