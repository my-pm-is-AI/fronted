import { COLORS } from '../lib/constants';
import { Desk, Monitor, Chair } from '../furniture/Desk';
import Bookshelf from '../furniture/Bookshelf';
import PixelPerson from '../furniture/PixelPerson';

export default function OfficeRoom() {
  return (
    <group>
      <Desk />
      <Monitor />
      <Chair />
      <Bookshelf position={[2.6, 0, -3.4]} height={3.0} />

      {/* 员工 A — 站在桌旁（蓝色衬衫，黑发） */}
      <PixelPerson
        position={[0.8, 0, -1.0]}
        rotation={[0, Math.PI * 1.1, 0]}
        hairColor='#1a0f00'
        shirtColor='#5189fb'
        pantsColor='#1a1a2e'
        phaseOffset={0}
      />

      {/* 员工 B — 站在书架旁（紫色衬衫，棕发） */}
      <PixelPerson
        position={[2.0, 0, -2.2]}
        rotation={[0, -Math.PI * 0.6, 0]}
        hairColor='#5c3317'
        shirtColor='#7b2fe8'
        pantsColor='#0f0e1a'
        phaseOffset={1.8}
      />
      <group position={[-3.76, 2.1, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.8, 0.07, 0.28]} />
          <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.3} />
        </mesh>
        {[[-0.8], [-0.35], [0.1], [0.55]].map(([ox], i) => (
          <mesh key={i} position={[ox, 0.18, 0]} castShadow>
            <boxGeometry args={[0.28, 0.3 + i * 0.04, 0.18]} />
            <meshStandardMaterial color={COLORS.bookColors[i + 2]} emissive={COLORS.bookColors[i + 2]} emissiveIntensity={0.25} />
          </mesh>
        ))}
      </group>
      <mesh position={[-3.74, 2.85, -1.5]}>
        <boxGeometry args={[0.06, 0.97, 1.28]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[-3.64, 2.85, -1.5]}>
        <boxGeometry args={[0.06, 0.9, 1.2]} />
        <meshStandardMaterial color='#1155cc' roughness={0.85} />
      </mesh>
      <mesh position={[-1.0, 2.3, -3.74]}>
        <boxGeometry args={[1.17, 1.47, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[-1.0, 2.3, -3.64]}>
        <boxGeometry args={[1.1, 1.4, 0.06]} />
        <meshStandardMaterial color='#cc3311' roughness={0.85} />
      </mesh>
      <mesh position={[0.5, 2.3, -3.74]}>
        <boxGeometry args={[0.92, 1.17, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[0.5, 2.3, -3.64]}>
        <boxGeometry args={[0.85, 1.1, 0.06]} />
        <meshStandardMaterial color='#0a9090' roughness={0.85} />
      </mesh>
      <mesh position={[1.8, 2.92, -3.88]}>
        <boxGeometry args={[2.2, 0.04, 0.04]} />
        <meshStandardMaterial color={COLORS.neonCyan} emissive={COLORS.neonCyan} emissiveIntensity={3} />
      </mesh>
      <mesh position={[3.2, 0.22, 2.8]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.38, 8]} />
        <meshStandardMaterial color='#3d1a10' roughness={0.9} />
      </mesh>
      <mesh position={[3.2, 0.65, 2.8]} castShadow>
        <sphereGeometry args={[0.3, 7, 6]} />
        <meshStandardMaterial color='#1a5c28' roughness={0.95} />
      </mesh>
      <mesh position={[-1.5, 0.009, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.0, 2.0]} />
        <meshStandardMaterial color='#0f0c24' roughness={1} />
      </mesh>
      <mesh position={[-0.5, 3.88, -1.5]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.55} />
      </mesh>
      <pointLight color='#99bbff' intensity={6} distance={10} decay={2} position={[-0.5, 3.6, -1.5]} />
      <pointLight color={COLORS.neonPurple} intensity={1.8} distance={6} decay={2} position={[1, 2, 1.5]} />
      <pointLight color={COLORS.neonBlue} intensity={1.5} distance={5} decay={2} position={[-2, 1.5, -1.5]} />
      <pointLight color={COLORS.neonBlue} intensity={1.2} distance={4} decay={2} position={[0, 0.15, 3.5]} />
    </group>
  );
}
