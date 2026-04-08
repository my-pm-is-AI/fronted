import { COLORS } from '../lib/constants';

export default function CoffeeTable({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.1, 0.07, 0.65]} />
        <meshStandardMaterial color={COLORS.deskSurface} roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh position={[0.1, 0.43, 0]} castShadow>
        <boxGeometry args={[0.35, 0.025, 0.25]} />
        <meshStandardMaterial color={COLORS.screenBlue} emissive={COLORS.neonBlue} emissiveIntensity={0.4} />
      </mesh>
      {([[-0.46, -0.28], [-0.46, 0.28], [0.46, -0.28], [0.46, 0.28]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.19, z]} castShadow>
          <boxGeometry args={[0.05, 0.38, 0.05]} />
          <meshStandardMaterial color={COLORS.monitorScreen} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
