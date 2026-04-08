/**
 * 📚 LibraryRoom — 图书馆样板
 * 适用职能：算法 / 数据分析 / AI 研究
 * 原始来源：BedroomRoom（改为图书馆氛围）
 *
 * Props:
 *   agents: { hairColor, shirtColor, pantsColor, skinColor? }[]
 *   最多支持 4 人，默认显示 1 人
 */

import { COLORS } from '../../lib/constants';
import Lamp from '../../furniture/Lamp';
import Bookshelf from '../../furniture/Bookshelf';
import PixelPerson from '../../furniture/PixelPerson';

interface AgentAppearance {
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
}

interface LibraryRoomProps {
  agents?: AgentAppearance[];
}

const AGENT_SLOTS = [
  { position: [1.0, 0, -0.5]  as [number,number,number], rotation: [0, -Math.PI * 0.4, 0] as [number,number,number], phaseOffset: 2.4 },
  { position: [-1.5, 0, 1.2]  as [number,number,number], rotation: [0, Math.PI * 0.6, 0]  as [number,number,number], phaseOffset: 0.8 },
  { position: [2.8, 0, -2.5]  as [number,number,number], rotation: [0, -Math.PI * 0.9, 0] as [number,number,number], phaseOffset: 1.5 },
  { position: [-0.5, 0, -2.2] as [number,number,number], rotation: [0, Math.PI * 1.3, 0]  as [number,number,number], phaseOffset: 3.0 },
];

const DEFAULT_AGENTS: AgentAppearance[] = [
  { hairColor: '#111111', shirtColor: '#cc44aa', pantsColor: '#1a0f1a', skinColor: '#f5cba7' },
];

export default function LibraryRoom({ agents = DEFAULT_AGENTS }: LibraryRoomProps) {
  const visibleAgents = agents.slice(0, 4);

  return (
    <group>
      {/* ── 大书架 x2 ── */}
      <Bookshelf position={[2.6, 0, -3.4]} height={3.0} />
      <Bookshelf position={[-0.4, 0, -3.6]} height={3.5} />

      {/* ── 阅读桌 ── */}
      <mesh position={[-0.8, 0, -1.0]} castShadow>
        <boxGeometry args={[2.2, 0.08, 1.1]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.85} />
      </mesh>
      <mesh position={[-0.8, -0.4, -1.0]} castShadow>
        <boxGeometry args={[1.9, 0.8, 0.08]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.9} />
      </mesh>

      {/* ── 台灯 x2 ── */}
      <mesh position={[1.3, 0.38, -2.1]} castShadow>
        <boxGeometry args={[0.52, 0.38, 0.52]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.85} />
      </mesh>
      <Lamp position={[1.3, 0.38, -2.1]} />
      <mesh position={[-2.6, 0.38, -2.1]} castShadow>
        <boxGeometry args={[0.52, 0.38, 0.52]} />
        <meshStandardMaterial color={COLORS.bedFrame} roughness={0.85} />
      </mesh>
      <Lamp position={[-2.6, 0.38, -2.1]} />

      {/* ── 窗户 (霓虹青) ── */}
      <mesh position={[-3.70, 2.3, -0.8]}>
        <boxGeometry args={[0.08, 1.5, 1.8]} />
        <meshStandardMaterial color={COLORS.neonCyan} emissive={COLORS.neonCyan} emissiveIntensity={1.0} transparent opacity={0.65} />
      </mesh>
      <mesh position={[-3.62, 2.3, -0.8]}>
        <boxGeometry args={[0.06, 1.6, 1.9]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.4} />
      </mesh>
      <pointLight color={COLORS.neonCyan} intensity={3.5} distance={8} decay={2} position={[-3.2, 2.3, -0.8]} />

      {/* ── 海报/地图 ── */}
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

      {/* ── 地毯 ── */}
      <mesh position={[0.3, 0.009, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 3.8]} />
        <meshStandardMaterial color='#100d20' roughness={1} />
      </mesh>

      {/* ── 天花板灯 ── */}
      <mesh position={[0, 3.88, -0.3]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.55} />
      </mesh>

      {/* ── Agents ── */}
      {visibleAgents.map((agent, i) => (
        <PixelPerson
          key={i}
          position={AGENT_SLOTS[i].position}
          rotation={AGENT_SLOTS[i].rotation}
          hairColor={agent.hairColor ?? '#111111'}
          shirtColor={agent.shirtColor ?? '#cc44aa'}
          pantsColor={agent.pantsColor ?? '#1a0f1a'}
          skinColor={agent.skinColor}
          phaseOffset={AGENT_SLOTS[i].phaseOffset}
        />
      ))}

      {/* ── Lights ── */}
      <pointLight color='#aaccff' intensity={5} distance={10} decay={2} position={[0, 3.6, -0.3]} />
      <pointLight color={COLORS.neonPurple} intensity={1.5} distance={6} decay={2} position={[-1, 2.5, 1.5]} />
      <pointLight color={COLORS.neonBlue} intensity={1.2} distance={4} decay={2} position={[0, 0.15, 3.5]} />
    </group>
  );
}