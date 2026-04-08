import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../lib/constants';

export default function Bed({ position = [0, 0, 0] as [number, number, number] }) {
  const headLightRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (headLightRef.current) {
      const t = clock.getElapsedTime();
      headLightRef.current.emissiveIntensity = 0.5 + Math.sin(t * 0.5) * 0.2;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[2.0, 0.18, 3.2]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.35, 0.05]} castShadow>
        <boxGeometry args={[1.85, 0.2, 2.9]} />
        <meshStandardMaterial color={COLORS.bedSheet} roughness={0.95} />
      </mesh>
      <mesh position={[-0.45, 0.48, -1.22]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.45]} />
        <meshStandardMaterial color='#2a3a60' roughness={0.95} />
      </mesh>
      <mesh position={[0.45, 0.48, -1.22]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.45]} />
        <meshStandardMaterial color='#2a3a60' roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.75, -1.58]} castShadow>
        <boxGeometry args={[2.0, 1.1, 0.12]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.32, -1.52]}>
        <boxGeometry args={[1.9, 0.04, 0.04]} />
        <meshStandardMaterial ref={headLightRef} color={COLORS.neonCyan} emissive={COLORS.neonCyan} emissiveIntensity={0.5} />
      </mesh>
      <pointLight color={COLORS.neonCyan} intensity={0.8} distance={3.5} decay={2} position={[0, 0.5, -1.4]} />
      {([[-0.88, -1.48], [0.88, -1.48], [-0.88, 1.48], [0.88, 1.48]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.06, z]} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <meshStandardMaterial color={COLORS.bedFrame} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
