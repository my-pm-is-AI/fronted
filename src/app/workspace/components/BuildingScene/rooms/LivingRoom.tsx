'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../lib/constants';
import Sofa from '../furniture/Sofa';
import CoffeeTable from '../furniture/CoffeeTable';
import PixelPerson from '../furniture/PixelPerson';

export default function LivingRoom() {
  const tvScreenRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (tvScreenRef.current) {
      const t = clock.getElapsedTime();
      tvScreenRef.current.emissiveIntensity = 1.6 + Math.sin(t * 1.1) * 0.12;
    }
  });

  return (
    <group>
      {/* TV frame */}
      <group position={[-3.72, 1.65, -0.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.0, 1.75, 0.1]} />
          <meshStandardMaterial color={COLORS.monitorScreen} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.056]}>
          <planeGeometry args={[2.82, 1.58]} />
          <meshStandardMaterial ref={tvScreenRef} color='#1a3a6e' emissive={COLORS.neonBlue} emissiveIntensity={1.6} />
        </mesh>
        <pointLight color={COLORS.neonBlue} intensity={5} distance={8} decay={2} position={[0.5, 0, 0]} />
      </group>
      <mesh position={[-3.72, 1.65, -2.45]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.22, 1.2, 0.18]} />
        <meshStandardMaterial color={COLORS.monitorScreen} roughness={0.8} />
      </mesh>
      <mesh position={[-3.72, 1.65, 0.85]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.22, 1.2, 0.18]} />
        <meshStandardMaterial color={COLORS.monitorScreen} roughness={0.8} />
      </mesh>
      {/* Shelf above TV */}
      <group position={[-3.76, 2.98, -0.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 0.07, 0.3]} />
          <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.35} />
        </mesh>
        {[[-0.7, 0], [-0.2, 0], [0.35, 0]].map(([ox], i) => (
          <mesh key={i} position={[ox, 0.17, 0]} castShadow>
            <boxGeometry args={[0.3, 0.26, 0.2]} />
            <meshStandardMaterial color={COLORS.bookColors[i]} emissive={COLORS.bookColors[i]} emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
      {/* Paintings on back wall */}
      <mesh position={[1.8, 2.2, -3.74]}>
        <boxGeometry args={[1.06, 1.35, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[1.8, 2.2, -3.64]}>
        <boxGeometry args={[0.95, 1.25, 0.06]} />
        <meshStandardMaterial color='#e83030' roughness={0.85} />
      </mesh>
      <mesh position={[3.05, 2.2, -3.74]}>
        <boxGeometry args={[1.06, 1.35, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[3.05, 2.2, -3.64]}>
        <boxGeometry args={[0.95, 1.25, 0.06]} />
        <meshStandardMaterial color='#2a9a44' roughness={0.85} />
      </mesh>
      <mesh position={[-1.2, 2.7, -3.74]}>
        <boxGeometry args={[0.92, 0.67, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[-1.2, 2.7, -3.64]}>
        <boxGeometry args={[0.82, 0.57, 0.06]} />
        <meshStandardMaterial color='#e87820' roughness={0.85} />
      </mesh>
      {/* Books shelf */}
      <mesh position={[2.42, 1.42, -3.75]}>
        <boxGeometry args={[2.4, 0.07, 0.38]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.85} />
      </mesh>
      {(['#5189fb','#e07830','#4cc9f0','#cc3333','#a0c030','#9955dd'] as string[]).map((col, i) => (
        <mesh key={i} position={[1.35 + i * 0.22, 1.58, -3.68]} castShadow>
          <boxGeometry args={[0.12, 0.3, 0.26]} />
          <meshStandardMaterial color={col} roughness={0.8} />
        </mesh>
      ))}
      {/* Sofa */}
      <group position={[2.2, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <Sofa />
      </group>
      <CoffeeTable position={[0.6, 0, -0.5]} />
      {/* Side table */}
      <mesh position={[2.3, 0.44, 1.2]} castShadow>
        <boxGeometry args={[0.45, 0.44, 0.45]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.85} />
      </mesh>
      <mesh position={[2.3, 0.49, 1.2]}>
        <boxGeometry args={[0.18, 0.04, 0.14]} />
        <meshStandardMaterial color={COLORS.screenBlue} emissive={COLORS.neonBlue} emissiveIntensity={0.5} />
      </mesh>
      {/* Corner plant */}
      <mesh position={[3.3, 0.2, -3.2]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.35, 8]} />
        <meshStandardMaterial color='#3d1a10' roughness={0.9} />
      </mesh>
      <mesh position={[3.3, 0.62, -3.2]} castShadow>
        <sphereGeometry args={[0.32, 7, 6]} />
        <meshStandardMaterial color='#1a5c28' roughness={0.95} />
      </mesh>
      {/* Rug */}
      <mesh position={[1.2, 0.009, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 2.4]} />
        <meshStandardMaterial color='#130f28' roughness={1} />
      </mesh>
      {/* Ceiling lamp */}
      <mesh position={[0, 3.88, -0.5]}>
        <boxGeometry args={[0.55, 0.06, 0.55]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.6} />
      </mesh>
      {/* 居民 C — 站在沙发旁看电视（青色衬衫，金发） */}
      <PixelPerson
        position={[1.0, 0, 0.8]}
        rotation={[0, Math.PI * 0.85, 0]}
        hairColor='#c8a020'
        shirtColor='#4cc9f0'
        pantsColor='#0f1a2e'
        phaseOffset={0.6}
      />

      <pointLight color='#99bbff' intensity={6} distance={10} decay={2} position={[0, 3.6, -0.3]} />
      <pointLight color={COLORS.neonBlue} intensity={2.5} distance={7} decay={2} position={[-2.5, 1.5, -2]} />
      <pointLight color={COLORS.neonPurple} intensity={1} distance={5} decay={2} position={[2, 2.5, 1]} />
      <pointLight color={COLORS.neonBlue} intensity={1.2} distance={4} decay={2} position={[0, 0.15, 3.5]} />
    </group>
  );
}
