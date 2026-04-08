import BuildingFloor from './BuildingFloor';
import OfficeRoom from './rooms/OfficeRoom';
import LivingRoom from './rooms/LivingRoom';
import BedroomRoom from './rooms/BedroomRoom';
import { COLORS, FLOOR_COUNT, FLOOR_SPACING, ROOM_SIZE } from './lib/constants';

const ROOMS = [OfficeRoom, LivingRoom, BedroomRoom];

export default function Building() {
  const half = ROOM_SIZE / 2;

  return (
    <group>
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
