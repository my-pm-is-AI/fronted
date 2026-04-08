import { COLORS } from '../lib/constants';
import Bed from '../furniture/Bed';
import Lamp from '../furniture/Lamp';
import PixelPerson from '../furniture/PixelPerson';

export default function BedroomRoom() {
  return (
    <group>
      <Bed position={[-0.8, 0, -1.0]} />
      <mesh position={[1.3, 0.38, -2.1]} castShadow>
        <boxGeometry args={[0.52, 0.38, 0.52]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.85} />
      </mesh>
      <Lamp position={[1.3, 0.38, -2.1]} />
      <mesh position={[-2.6, 0.38, -2.1]} castShadow>
        <boxGeometry args={[0.52, 0.38, 0.52]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.85} />
      </mesh>
      <mesh position={[-2.6, 0.6, -2.1]}>
        <boxGeometry args={[0.2, 0.18, 0.1]} />
        <meshStandardMaterial color={COLORS.monitorScreen} emissive={COLORS.neonCyan} emissiveIntensity={0.6} />
      </mesh>
      {/* Wardrobe */}
      <group position={[-3.55, 1.38, 2.0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 2.75, 0.65]} />
          <meshStandardMaterial color={COLORS.bedFrame} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0, 0.33]}>
          <boxGeometry args={[2.18, 2.72, 0.04]} />
          <meshStandardMaterial color='#1a1628' roughness={0.9} />
        </mesh>
        <mesh position={[0.4, 0, 0.36]}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
          <meshStandardMaterial color={COLORS.neonCyan} emissive={COLORS.neonCyan} emissiveIntensity={0.9} metalness={0.7} />
        </mesh>
      </group>
      {/* Window */}
      <mesh position={[-3.70, 2.3, -0.8]}>
        <boxGeometry args={[0.08, 1.5, 1.8]} />
        <meshStandardMaterial color={COLORS.neonCyan} emissive={COLORS.neonCyan} emissiveIntensity={1.0} transparent opacity={0.65} />
      </mesh>
      <mesh position={[-3.62, 2.3, -0.8]}>
        <boxGeometry args={[0.06, 1.6, 1.9]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.4} />
      </mesh>
      <pointLight color={COLORS.neonCyan} intensity={3.5} distance={8} decay={2} position={[-3.2, 2.3, -0.8]} />
      {/* Posters */}
      <mesh position={[0.8, 2.3, -3.74]}>
        <boxGeometry args={[1.47, 1.87, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[0.8, 2.3, -3.64]}>
        <boxGeometry args={[1.4, 1.8, 0.06]} />
        <meshStandardMaterial color='#2233aa' roughness={0.85} />
      </mesh>
      <mesh position={[2.6, 2.5, -3.74]}>
        <boxGeometry args={[0.97, 0.72, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[2.6, 2.5, -3.64]}>
        <boxGeometry args={[0.9, 0.65, 0.06]} />
        <meshStandardMaterial color='#e8a020' roughness={0.85} />
      </mesh>
      {/* Shelf */}
      <mesh position={[2.5, 1.65, -3.83]}>
        <boxGeometry args={[1.8, 0.07, 0.3]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.3} />
      </mesh>
      {[0, 0.3, 0.6, 0.9].map((ox, i) => (
        <mesh key={i} position={[1.65 + ox, 1.8, -3.77]} castShadow>
          <boxGeometry args={[0.22, 0.3, 0.2]} />
          <meshStandardMaterial color={COLORS.bookColors[i]} emissive={COLORS.bookColors[i]} emissiveIntensity={0.22} />
        </mesh>
      ))}
      {/* Corner plant */}
      <mesh position={[3.2, 0.22, 2.8]} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.38, 8]} />
        <meshStandardMaterial color='#3d1a10' roughness={0.9} />
      </mesh>
      <mesh position={[3.2, 0.62, 2.8]} castShadow>
        <sphereGeometry args={[0.28, 7, 6]} />
        <meshStandardMaterial color='#1a5c28' roughness={0.95} />
      </mesh>
      {/* Rug */}
      <mesh position={[0.3, 0.009, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 3.8]} />
        <meshStandardMaterial color='#100d20' roughness={1} />
      </mesh>
      {/* Ceiling lamp */}
      <mesh position={[0, 3.88, -0.3]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.55} />
      </mesh>
      {/* 居民 D — 站在床边（粉色衬衫，黑发，朝向窗户） */}
      <PixelPerson
        position={[1.0, 0, -0.5]}
        rotation={[0, -Math.PI * 0.4, 0]}
        hairColor='#111111'
        shirtColor='#cc44aa'
        pantsColor='#1a0f1a'
        skinColor='#f5cba7'
        phaseOffset={2.4}
      />

      <pointLight color='#aaccff' intensity={5} distance={10} decay={2} position={[0, 3.6, -0.3]} />
      <pointLight color={COLORS.neonPurple} intensity={1.5} distance={6} decay={2} position={[-1, 2.5, 1.5]} />
      <pointLight color={COLORS.neonBlue} intensity={1.2} distance={4} decay={2} position={[0, 0.15, 3.5]} />
    </group>
  );
}
