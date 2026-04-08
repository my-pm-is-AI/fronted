import { COLORS } from '../lib/constants';

export default function Bookshelf({
  position = [0, 0, 0] as [number, number, number],
  height = 2.2,
}) {
  const shelfW = 1.4;
  const shelfD = 0.35;
  const shelfCount = 3;
  const shelfSpacing = height / (shelfCount + 1);

  return (
    <group position={position}>
      <mesh position={[-shelfW / 2 - 0.03, height / 2, 0]} castShadow>
        <boxGeometry args={[0.06, height, shelfD]} />
        <meshStandardMaterial color={COLORS.deskSurface} roughness={0.9} />
      </mesh>
      <mesh position={[shelfW / 2 + 0.03, height / 2, 0]} castShadow>
        <boxGeometry args={[0.06, height, shelfD]} />
        <meshStandardMaterial color={COLORS.deskSurface} roughness={0.9} />
      </mesh>
      <mesh position={[0, height / 2, -shelfD / 2]} castShadow>
        <boxGeometry args={[shelfW + 0.12, height, 0.04]} />
        <meshStandardMaterial color={COLORS.wallBack} roughness={1} />
      </mesh>
      {Array.from({ length: shelfCount + 1 }, (_, si) => {
        const sy = si === 0 ? 0.04 : si * shelfSpacing;
        return (
          <group key={si}>
            <mesh position={[0, sy, 0]} castShadow>
              <boxGeometry args={[shelfW, 0.06, shelfD]} />
              <meshStandardMaterial color={COLORS.deskSurface} roughness={0.9} />
            </mesh>
            {si < shelfCount &&
              COLORS.bookColors.slice(0, 4 + si).map((col, bi) => {
                const bw = 0.09 + (bi % 3) * 0.015;
                const bh = 0.28 + (bi % 4) * 0.03;
                const bx = -shelfW / 2 + 0.1 + bi * (bw + 0.03);
                return (
                  <mesh key={bi} position={[bx, sy + bh / 2 + 0.04, 0]} castShadow>
                    <boxGeometry args={[bw, bh, shelfD * 0.85]} />
                    <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.15} roughness={0.9} />
                  </mesh>
                );
              })}
          </group>
        );
      })}
    </group>
  );
}
