/**
 * 🎨 DesignRoom — 设计室样板
 * 适用职能：UI/UX 设计师 / 视觉设计 / 交互设计
 * 特征：画板 + 彩色调色盘 + 橙粉霓虹暖光
 *
 * Props:
 *   agents: { hairColor, shirtColor, pantsColor, skinColor? }[]
 *   最多支持 4 人，默认显示 2 人
 */

import { COLORS } from '../../lib/constants';
import { Desk, Chair } from '../../furniture/Desk';
import PixelPerson from '../../furniture/PixelPerson';

interface AgentAppearance {
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
}

interface DesignRoomProps {
  agents?: AgentAppearance[];
}

const AGENT_SLOTS = [
  { position: [0.5, 0, -0.8] as [number, number, number],  rotation: [0, Math.PI * 1.2, 0] as [number, number, number],  phaseOffset: 0   },
  { position: [-1.5, 0, 0.5] as [number, number, number],  rotation: [0, Math.PI * 0.4, 0] as [number, number, number],  phaseOffset: 1.3 },
  { position: [2.5, 0, 0.8] as [number, number, number],   rotation: [0, -Math.PI * 0.8, 0] as [number, number, number], phaseOffset: 2.0 },
  { position: [3.0, 0, -2.2] as [number, number, number],  rotation: [0, Math.PI * 0.6, 0] as [number, number, number],  phaseOffset: 0.7 },
];

const DEFAULT_AGENTS: AgentAppearance[] = [
  { hairColor: '#cc2266', shirtColor: '#F05A28', pantsColor: '#1a0a10' },
  { hairColor: '#3344cc', shirtColor: '#ff9966', pantsColor: '#0f0f1a' },
];

export default function DesignRoom({ agents = DEFAULT_AGENTS }: DesignRoomProps) {
  const visibleAgents = agents.slice(0, 4);

  return (
    <group>
      {/* ── Drawing desk ── */}
      <Desk />
      <Chair />

      {/* ── 大画板 (easel) ── */}
      <group position={[-1.5, 0, -3.0]}>
        {/* 画板架腿 */}
        <mesh position={[-0.3, 1.0, 0]} rotation={[0.15, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
          <meshStandardMaterial color='#3a2a1a' roughness={0.9} />
        </mesh>
        <mesh position={[0.3, 1.0, 0]} rotation={[0.15, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
          <meshStandardMaterial color='#3a2a1a' roughness={0.9} />
        </mesh>
        {/* 画布 */}
        <mesh position={[0, 1.4, 0.05]} castShadow>
          <boxGeometry args={[1.1, 1.4, 0.05]} />
          <meshStandardMaterial color='#f5f0e8' roughness={0.95} />
        </mesh>
        {/* 画布上的彩色色块（设计稿） */}
        {([['#F05A28', -0.2, 0.2], ['#5189fb', 0.2, 0.1], ['#cc44aa', -0.1, -0.2], ['#22c55e', 0.25, -0.15]] as [string, number, number][]).map(([col, x, y], i) => (
          <mesh key={i} position={[x, 1.4 + y, 0.09]}>
            <planeGeometry args={[0.22, 0.22]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.2} />
          </mesh>
        ))}
        <pointLight color='#ffaa66' intensity={2} distance={4} decay={2} position={[0, 1.5, 0.5]} />
      </group>

      {/* ── 调色盘台 ── */}
      <group position={[2.5, 0, -3.2]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.78, 0.55]} />
          <meshStandardMaterial color='#1a1020' roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.43, 0]}>
          <boxGeometry args={[1.6, 0.06, 0.55]} />
          <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.2} />
        </mesh>
        {/* 颜料管 */}
        {(['#F05A28','#5189fb','#22c55e','#cc44aa','#ffcc00'] as string[]).map((col, i) => (
          <mesh key={i} position={[-0.5 + i * 0.25, 0.55, 0]} castShadow rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 6]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* ── Back wall: art prints ── */}
      {([
        [-2.5, 2.2, '#F05A28', 0.85, 1.1],
        [-0.8, 2.4, '#cc44aa', 0.6, 0.8],
        [0.8, 2.2, '#5189fb', 0.95, 1.2],
        [2.4, 2.0, '#ffcc00', 0.7, 0.9],
      ] as [number, number, string, number, number][]).map(([x, y, col, w, h], i) => (
        <group key={i}>
          <mesh position={[x, y, -3.74]}>
            <boxGeometry args={[w + 0.07, h + 0.07, 0.06]} />
            <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
          </mesh>
          <mesh position={[x, y, -3.67]}>
            <boxGeometry args={[w, h, 0.06]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.15} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* ── Neon strip (橙粉色) ── */}
      <mesh position={[0, 3.85, -3.88]}>
        <boxGeometry args={[7.5, 0.04, 0.04]} />
        <meshStandardMaterial color='#F05A28' emissive='#F05A28' emissiveIntensity={3} />
      </mesh>

      {/* ── Corner plant ── */}
      <mesh position={[3.2, 0.22, 2.8]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.38, 8]} />
        <meshStandardMaterial color='#3d1a10' roughness={0.9} />
      </mesh>
      <mesh position={[3.2, 0.65, 2.8]} castShadow>
        <sphereGeometry args={[0.3, 7, 6]} />
        <meshStandardMaterial color='#2a7c38' roughness={0.95} />
      </mesh>

      {/* ── Floor rug (暖橙) ── */}
      <mesh position={[0, 0.009, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.0, 3.5]} />
        <meshStandardMaterial color='#1a0c08' roughness={1} />
      </mesh>

      {/* ── Ceiling lamp ── */}
      <mesh position={[0, 3.88, -0.5]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.6} />
      </mesh>

      {/* ── Agents ── */}
      {visibleAgents.map((agent, i) => (
        <PixelPerson
          key={i}
          position={AGENT_SLOTS[i].position}
          rotation={AGENT_SLOTS[i].rotation}
          hairColor={agent.hairColor ?? '#cc2266'}
          shirtColor={agent.shirtColor ?? '#F05A28'}
          pantsColor={agent.pantsColor ?? '#1a0a10'}
          skinColor={agent.skinColor}
          phaseOffset={AGENT_SLOTS[i].phaseOffset}
        />
      ))}

      {/* ── Lights ── */}
      <pointLight color='#ffccaa' intensity={6}   distance={10} decay={2} position={[0, 3.6, -0.5]} />
      <pointLight color='#F05A28' intensity={2.5} distance={7}  decay={2} position={[-2, 2, -2]} />
      <pointLight color='#cc44aa' intensity={1.5} distance={5}  decay={2} position={[2, 2, 1]} />
      <pointLight color={COLORS.neonBlue} intensity={1.0} distance={4} decay={2} position={[0, 0.15, 3.5]} />
    </group>
  );
}