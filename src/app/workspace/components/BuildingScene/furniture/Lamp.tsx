import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../lib/constants';

export default function Lamp({ position = [0, 0, 0] as [number, number, number] }) {
  const bulbRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (bulbRef.current) {
      const t = clock.getElapsedTime();
      bulbRef.current.emissiveIntensity = 1.8 + Math.sin(t * 0.3) * 0.25;
    }
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.06, 0.22]} />
        <meshStandardMaterial color={COLORS.monitorScreen} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.72, 8]} />
        <meshStandardMaterial color={COLORS.monitorScreen} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.18, 0.22, 8, 1, true]} />
        <meshStandardMaterial color='#1a1020' side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial ref={bulbRef} color={COLORS.lampWarm} emissive={COLORS.lampGlow} emissiveIntensity={1.8} />
      </mesh>
      <pointLight color={COLORS.lampWarm} intensity={2} distance={5} decay={2} castShadow position={[0, 0.7, 0]} />
    </group>
  );
}
