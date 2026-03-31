import { Text } from "@react-three/drei";

const STORES = [
  {
    name: "CHRISTIAN LOUBOUTIN",
    accent: "#b30000",
    x: 0,
  },
  {
    name: "PRADA",
    accent: "#e5d9c8",
    x: 12,
  },
  {
    name: "OMEGA",
    accent: "#0d2a66",
    x: 24,
  },
  {
    name: "JIMMY CHOO",
    accent: "#c4a16b",
    x: 36,
  },
];

function Store({ name, accent, x }) {
  return (
    <group position={[x, 0, -8]}>
      {/* Store Frame */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[6, 4.5, 0.25]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Left Window */}
      <mesh position={[-2, 1.6, 0.25]}>
        <boxGeometry args={[1.8, 3, 0.05]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0}
          thickness={0.5}
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Right Window */}
      <mesh position={[2, 1.6, 0.25]}>
        <boxGeometry args={[1.8, 3, 0.05]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0}
          thickness={0.5}
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.6, 0.3]}>
        <boxGeometry args={[1.2, 3, 0.1]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Brand Sign */}
      <Text
        position={[0, 3.8, 0.35]}
        fontSize={0.35}
        color={accent}
        anchorX="center"
      >
        {name}
      </Text>

      {/* Display Pedestal */}
      <mesh position={[-2, 0.4, 0.5]}>
        <boxGeometry args={[0.6, 0.2, 0.6]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      <mesh position={[2, 0.4, 0.5]}>
        <boxGeometry args={[0.6, 0.2, 0.6]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* Store Lighting */}
      <spotLight position={[0, 4, 2]} intensity={3} angle={0.4} />
    </group>
  );
}

export default function LuxuryStorefronts() {
  return (
    <>
      {STORES.map((s, i) => (
        <Store key={i} {...s} />
      ))}
    </>
  );
}
