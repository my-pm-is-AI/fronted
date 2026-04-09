'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { COLORS, ROOM_SIZE, ROOM_HEIGHT, FLOOR_THICKNESS, WALL_THICKNESS } from './lib/constants';
import { type FloorShaderMaterialType } from './lib/materials';
import './lib/materials';

interface BuildingFloorProps {
  floorIndex: number;
  title?: string;
  personName?: string;
  isFocused?: boolean;
  isDimmed?: boolean;
  children?: React.ReactNode;
}

export default function BuildingFloor({
  floorIndex,
  title = 'Floor',
  personName = 'Agent',
  isFocused = false,
  isDimmed = false,
  children
}: BuildingFloorProps) {
  const matRef = useRef<FloorShaderMaterialType>(null);
  const half = ROOM_SIZE / 2;
  const trimH = FLOOR_THICKNESS;

  // Add some dimming effect
  const opacity = isDimmed ? 0.3 : 1;

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <group position={[0, floorIndex * (ROOM_HEIGHT + FLOOR_THICKNESS), 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial color='#c8d0e8' roughness={0.25} metalness={0.05} transparent opacity={opacity} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, ROOM_HEIGHT / 2, -half + WALL_THICKNESS / 2]} castShadow receiveShadow>
        <boxGeometry args={[ROOM_SIZE, ROOM_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color={COLORS.wallBack} roughness={0.75} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, ROOM_HEIGHT / 2, -half + WALL_THICKNESS + 0.01]}>
        <planeGeometry args={[ROOM_SIZE, ROOM_HEIGHT]} />
        <meshStandardMaterial color={COLORS.wallBackLight} roughness={1} transparent opacity={opacity} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-half + WALL_THICKNESS / 2, ROOM_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_SIZE]} />
        <meshStandardMaterial color={COLORS.wallSide} roughness={0.75} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-half + WALL_THICKNESS + 0.01, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_SIZE, ROOM_HEIGHT]} />
        <meshStandardMaterial color={COLORS.wallBackLight} roughness={1} transparent opacity={opacity} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT + FLOOR_THICKNESS / 2, 0]}>
        <boxGeometry args={[ROOM_SIZE, FLOOR_THICKNESS, ROOM_SIZE]} />
        <meshStandardMaterial color={COLORS.ceilingBase} roughness={0.9} transparent opacity={opacity} />
      </mesh>
      {/* Vertical trim corners */}
      <mesh position={[half, ROOM_HEIGHT / 2 + trimH / 2, -half]}>
        <boxGeometry args={[0.08, ROOM_HEIGHT + trimH * 2, 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-half, ROOM_HEIGHT / 2 + trimH / 2, half]}>
        <boxGeometry args={[0.08, ROOM_HEIGHT + trimH * 2, 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-half, ROOM_HEIGHT / 2 + trimH / 2, -half]}>
        <boxGeometry args={[0.08, ROOM_HEIGHT + trimH * 2, 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.3} transparent opacity={opacity} />
      </mesh>
      {/* Horizontal bottom trim */}
      <mesh position={[0, 0, half]}>
        <boxGeometry args={[ROOM_SIZE + 0.08, trimH, 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.6} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, -half]}>
        <boxGeometry args={[ROOM_SIZE + 0.08, trimH, 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.4} transparent opacity={opacity} />
      </mesh>
      <mesh position={[half, 0, 0]}>
        <boxGeometry args={[0.08, trimH, ROOM_SIZE + 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.6} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-half, 0, 0]}>
        <boxGeometry args={[0.08, trimH, ROOM_SIZE + 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.4} transparent opacity={opacity} />
      </mesh>
      {/* Horizontal top trim */}
      <mesh position={[0, ROOM_HEIGHT + trimH, half]}>
        <boxGeometry args={[ROOM_SIZE + 0.08, 0.07, 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, ROOM_HEIGHT + trimH, -half]}>
        <boxGeometry args={[ROOM_SIZE + 0.08, 0.07, 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.4} transparent opacity={opacity} />
      </mesh>
      <mesh position={[half, ROOM_HEIGHT + trimH, 0]}>
        <boxGeometry args={[0.08, 0.07, ROOM_SIZE + 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-half, ROOM_HEIGHT + trimH, 0]}>
        <boxGeometry args={[0.08, 0.07, ROOM_SIZE + 0.08]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.4} transparent opacity={opacity} />
      </mesh>
      {/* Neon baseboard */}
      <mesh position={[0, 0.05, half - 0.1]}>
        <boxGeometry args={[ROOM_SIZE, 0.05, 0.04]} />
        <meshStandardMaterial color={COLORS.neonBlue} emissive={COLORS.neonBlue} emissiveIntensity={2} transparent opacity={opacity} />
      </mesh>
      <mesh position={[half - 0.1, 0.05, 0]}>
        <boxGeometry args={[0.04, 0.05, ROOM_SIZE]} />
        <meshStandardMaterial color={COLORS.neonBlue} emissive={COLORS.neonBlue} emissiveIntensity={2} transparent opacity={opacity} />
      </mesh>
      {children}
    </group>
  );
}
