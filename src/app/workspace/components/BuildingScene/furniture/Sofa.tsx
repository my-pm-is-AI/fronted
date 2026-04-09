import { COLORS } from '../lib/constants';

export default function Sofa({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[2.6, 0.35, 1.0]} />
        <meshStandardMaterial color={COLORS.sofaDark} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.56, 0.12]} castShadow>
        <boxGeometry args={[2.4, 0.12, 0.75]} />
        <meshStandardMaterial color={COLORS.sofaMid} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.88, -0.42]} castShadow>
        <boxGeometry args={[2.6, 0.65, 0.22]} />
        <meshStandardMaterial color={COLORS.sofaDark} roughness={0.95} />
      </mesh>
      <mesh position={[-1.22, 0.62, 0]} castShadow>
        <boxGeometry args={[0.22, 0.55, 1.0]} />
        <meshStandardMaterial color={COLORS.sofaDark} roughness={0.95} />
      </mesh>
      <mesh position={[1.22, 0.62, 0]} castShadow>
        <boxGeometry args={[0.22, 0.55, 1.0]} />
        <meshStandardMaterial color={COLORS.sofaDark} roughness={0.95} />
      </mesh>
      {([[-1.1, -0.38], [-1.1, 0.38], [1.1, -0.38], [1.1, 0.38]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]} castShadow>
          <boxGeometry args={[0.08, 0.16, 0.08]} />
          <meshStandardMaterial color={COLORS.monitorScreen} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
