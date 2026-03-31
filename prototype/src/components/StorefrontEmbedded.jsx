// AAA Luxury Storefront Component
// Drop-in replacement for StorefrontEmbedded in VirtualMallWalkthroughR3F.jsx
// Keeps all original mall logic intact — only upgrades visuals.

import * as THREE from "three";
import { Text, useTexture } from "@react-three/drei";

export default function StorefrontEmbedded({
  label,
  side,
  z,
  active,
  accent,
  warmth,
  img,
  assetUrl,
}) {
  const tex = useTexture(assetUrl ? assetUrl(img) : img);

  if (tex) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
  }

  const wallX = 15.6;
  const xFace = side === "left" ? -wallX + 0.04 : wallX - 0.04;
  const rotY = side === "left" ? Math.PI / 2 : -Math.PI / 2;

  const glassMat = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    roughness: 0.05,
    thickness: 0.6,
    transparent: true,
    opacity: 0.65,
  });

  return (
    <group position={[xFace, 0, z]} rotation-y={rotY}>
      {/* storefront frame */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[10, 6.5, 0.35]} />
        <meshStandardMaterial color="#111" metalness={0.35} roughness={0.4} />
      </mesh>

      {/* interior backdrop */}
      <mesh position={[0, 2.6, -0.8]}>
        <planeGeometry args={[8.6, 4.8]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>

      {/* left window */}
      <mesh position={[-3.2, 2.2, 0.35]} material={glassMat}>
        <boxGeometry args={[2.4, 4.2, 0.05]} />
      </mesh>

      {/* right window */}
      <mesh position={[3.2, 2.2, 0.35]} material={glassMat}>
        <boxGeometry args={[2.4, 4.2, 0.05]} />
      </mesh>

      {/* display pedestal */}
      <mesh position={[0, 0.6, 0.2]}>
        <cylinderGeometry args={[0.5, 0.5, 1.1, 32]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* spotlight */}
      <spotLight
        position={[0, 5, 1]}
        intensity={3}
        angle={0.35}
        color={warmth}
      />

      {/* brand sign */}
      <Text position={[0, 5.9, 0.25]} fontSize={0.55} anchorX="center">
        {label}
        <meshStandardMaterial
          color="#ffffff"
          emissive={accent}
          emissiveIntensity={active ? 0.7 : 0.2}
        />
      </Text>
    </group>
  );
}
