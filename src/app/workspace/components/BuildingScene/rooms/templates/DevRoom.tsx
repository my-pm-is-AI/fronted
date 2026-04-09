/**
 * 🖥️ DevRoom — 开发室样板
 * 适用职能：前端开发 / 后端开发 / 全栈工程师
 * 原始来源：OfficeRoom
 *
 * Props:
 *   agents: { hairColor, shirtColor, pantsColor, skinColor? }[]
 *   最多支持 4 人，默认显示 2 人
 */

import { COLORS } from '../../lib/constants';
import { Desk, Monitor, Chair } from '../../furniture/Desk';
import Bookshelf from '../../furniture/Bookshelf';
import PixelPerson from '../../furniture/PixelPerson';

interface AgentAppearance {
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
  name?: string;
}

interface DevRoomProps {
  agents?: AgentAppearance[];
  agentName?: string;
}

// 预设站位 & 朝向（最多4人）
const AGENT_SLOTS = [
  { position: [0.8, 0, -1.0] as [number, number, number],  rotation: [0, Math.PI * 1.1, 0] as [number, number, number],  phaseOffset: 0   },
  { position: [2.0, 0, -2.2] as [number, number, number],  rotation: [0, -Math.PI * 0.6, 0] as [number, number, number], phaseOffset: 1.8 },
  { position: [-1.2, 0, 0.8] as [number, number, number],  rotation: [0, Math.PI * 0.3, 0] as [number, number, number],  phaseOffset: 1.1 },
  { position: [3.0, 0, 1.2] as [number, number, number],   rotation: [0, -Math.PI * 0.9, 0] as [number, number, number], phaseOffset: 2.5 },
];

// 默认外观（当 agents prop 未提供时）
const DEFAULT_AGENTS: AgentAppearance[] = [
  { hairColor: '#1a0f00', shirtColor: '#5189fb', pantsColor: '#1a1a2e' },
  { hairColor: '#5c3317', shirtColor: '#7b2fe8', pantsColor: '#0f0e1a' },
];

export default function DevRoom({ agents = DEFAULT_AGENTS, agentName }: DevRoomProps) {
  const visibleAgents = agents.slice(0, 4);

  return (
    <group>
      {/* ── Furniture ── */}
      <Desk />
      <Monitor />
      <Chair />
      <Bookshelf position={[2.6, 0, -3.4]} height={3.0} />

      {/* ── Agents ── */}
      {visibleAgents.map((agent, i) => (
        <PixelPerson
          key={i}
          position={AGENT_SLOTS[i].position}
          rotation={AGENT_SLOTS[i].rotation}
          hairColor={agent.hairColor ?? '#1a0f00'}
          shirtColor={agent.shirtColor ?? '#5189fb'}
          pantsColor={agent.pantsColor ?? '#1a1a2e'}
          skinColor={agent.skinColor}
          name={i === 0 && agentName ? agentName : agent.name}
          phaseOffset={AGENT_SLOTS[i].phaseOffset}
        />
      ))}

      {/* ── Wall shelf with books ── */}
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

      {/* ── Whiteboard (back wall) ── */}
      <mesh position={[-3.74, 2.85, -1.5]}>
        <boxGeometry args={[0.06, 0.97, 1.28]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[-3.64, 2.85, -1.5]}>
        <boxGeometry args={[0.06, 0.9, 1.2]} />
        <meshStandardMaterial color='#1155cc' roughness={0.85} />
      </mesh>

      {/* ── Posters ── */}
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

      {/* ── Neon accent strip ── */}
      <mesh position={[1.8, 2.92, -3.88]}>
        <boxGeometry args={[2.2, 0.04, 0.04]} />
        <meshStandardMaterial color={COLORS.neonCyan} emissive={COLORS.neonCyan} emissiveIntensity={3} />
      </mesh>

      {/* ── Corner plant ── */}
      <mesh position={[3.2, 0.22, 2.8]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.38, 8]} />
        <meshStandardMaterial color='#3d1a10' roughness={0.9} />
      </mesh>
      <mesh position={[3.2, 0.65, 2.8]} castShadow>
        <sphereGeometry args={[0.3, 7, 6]} />
        <meshStandardMaterial color='#1a5c28' roughness={0.95} />
      </mesh>

      {/* ── Floor rug ── */}
      <mesh position={[-1.5, 0.009, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.0, 2.0]} />
        <meshStandardMaterial color='#0f0c24' roughness={1} />
      </mesh>

      {/* ── Ceiling lamp ── */}
      <mesh position={[-0.5, 3.88, -1.5]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.55} />
      </mesh>

      {/* ── Lights ── */}
      <pointLight color='#99bbff' intensity={6} distance={10} decay={2} position={[-0.5, 3.6, -1.5]} />
      <pointLight color={COLORS.neonPurple} intensity={1.8} distance={6} decay={2} position={[1, 2, 1.5]} />
      <pointLight color={COLORS.neonBlue} intensity={1.5} distance={5} decay={2} position={[-2, 1.5, -1.5]} />
      <pointLight color={COLORS.neonBlue} intensity={1.2} distance={4} decay={2} position={[0, 0.15, 3.5]} />
    </group>
  );
}
