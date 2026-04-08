import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../lib/constants';

export function Desk() {
  return (
    <group position={[-1.5, 0.85, -2.5]}>
      <mesh castShadow>
        <boxGeometry args={[2.8, 0.08, 1.2]} />
        <meshStandardMaterial color={COLORS.deskSurface} roughness={0.7} />
      </mesh>
      <mesh position={[-1.25, -0.45, 0]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color={COLORS.deskSurface} roughness={0.7} />
      </mesh>
      <mesh position={[1.25, -0.45, 0]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color={COLORS.deskSurface} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function Monitor() {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (screenRef.current) {
      const t = clock.getElapsedTime();
      screenRef.current.emissiveIntensity = 1.2 + Math.sin(t * 0.7) * 0.15;
    }
  });
  return (
    <group position={[-1.5, 1.55, -2.8]}>
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.85, 0.06]} />
        <meshStandardMaterial color={COLORS.monitorScreen} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[1.28, 0.74]} />
        <meshStandardMaterial ref={screenRef} color={COLORS.screenBlue} emissive={COLORS.screenGlow} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, -0.55, 0.1]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color={COLORS.monitorScreen} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.67, 0.12]}>
        <boxGeometry args={[0.35, 0.04, 0.22]} />
        <meshStandardMaterial color={COLORS.monitorScreen} metalness={0.6} roughness={0.4} />
      </mesh>
      <pointLight color={COLORS.neonBlue} intensity={1.2} distance={3} decay={2} />
    </group>
  );
}

export function Chair() {
  return (
    <group position={[-1.5, 0, -1.5]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.75, 0.1, 0.7]} />
        <meshStandardMaterial color={COLORS.chairColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, -0.3]} castShadow>
        <boxGeometry args={[0.75, 0.85, 0.08]} />
        <meshStandardMaterial color={COLORS.chairColor} roughness={0.9} />
      </mesh>
      {([[-0.32, 0.32], [-0.32, -0.28], [0.32, 0.32], [0.32, -0.28]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} castShadow>
          <boxGeometry args={[0.06, 0.6, 0.06]} />
          <meshStandardMaterial color={COLORS.chairColor} roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}
