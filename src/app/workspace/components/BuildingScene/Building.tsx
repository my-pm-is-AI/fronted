import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BuildingFloor from './BuildingFloor';
import { DevRoom, WorkshopRoom, LibraryRoom, DesignRoom, MeetingRoom } from './rooms/templates';
import { COLORS, FLOOR_COUNT, FLOOR_SPACING, ROOM_SIZE } from './lib/constants';

const ROOMS = [DevRoom, WorkshopRoom, LibraryRoom, DesignRoom, MeetingRoom];

// 弹性缓动：从下方升起，带轻微弹跳感
function easeOutBack(t: number): number {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default function Building() {
  const half = ROOM_SIZE / 2;
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);   // 0 → 1
  const START_Y = -22;          // 初始 Y（从地下升起）

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (progress.current >= 1) return;
    // 约 1.6s 完成动画
    progress.current = Math.min(1, progress.current + delta * 0.65);
    const easedY = THREE.MathUtils.lerp(START_Y, 0, easeOutBack(progress.current));
    groupRef.current.position.y = easedY;
  });

  return (
    <group ref={groupRef} position={[0, START_Y, 0]}>
      {Array.from({ length: FLOOR_COUNT }, (_, i) => {
        const Room = ROOMS[i];
        return (
          <BuildingFloor key={i} floorIndex={i}>
            <Room />
          </BuildingFloor>
        );
      })}
      {/* Base plinth */}
      <mesh position={[0, -0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[ROOM_SIZE + 0.8, 0.7, ROOM_SIZE + 0.8]} />
        <meshStandardMaterial color={COLORS.baseColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.01, half + 0.4]}>
        <boxGeometry args={[ROOM_SIZE + 0.8, 0.08, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[half + 0.4, -0.01, 0]}>
        <boxGeometry args={[0.06, 0.08, ROOM_SIZE + 0.8]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.6} />
      </mesh>
      {/* Roof parapet */}
      {(() => {
        const topY = FLOOR_COUNT * FLOOR_SPACING + 0.08;
        return (
          <group position={[0, topY, 0]}>
            <mesh position={[0, 0.18, half]}>
              <boxGeometry args={[ROOM_SIZE + 0.04, 0.36, 0.14]} />
              <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[half, 0.18, 0]}>
              <boxGeometry args={[0.14, 0.36, ROOM_SIZE + 0.04]} />
              <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0.18, -half]}>
              <boxGeometry args={[ROOM_SIZE + 0.04, 0.36, 0.14]} />
              <meshStandardMaterial color={COLORS.wallBack} roughness={0.9} />
            </mesh>
            <mesh position={[-half, 0.18, 0]}>
              <boxGeometry args={[0.14, 0.36, ROOM_SIZE + 0.04]} />
              <meshStandardMaterial color={COLORS.wallBack} roughness={0.9} />
            </mesh>
          </group>
        );
      })()}
    </group>
  );
}