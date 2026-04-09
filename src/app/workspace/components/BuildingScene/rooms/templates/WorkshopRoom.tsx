/**
 * 🔧 WorkshopRoom — 工坊样板
 * 适用职能：运维 / DevOps / 架构师 / 测试
 * 原始来源：LivingRoom（改为工坊氛围：监控大屏 + 工具台）
 *
 * Props:
 *   agents: { hairColor, shirtColor, pantsColor, skinColor? }[]
 *   最多支持 4 人，默认显示 1 人
 */

'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../../lib/constants';
import Sofa from '../../furniture/Sofa';
import CoffeeTable from '../../furniture/CoffeeTable';
import PixelPerson from '../../furniture/PixelPerson';

interface AgentAppearance {
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
  name?: string;
}

interface WorkshopRoomProps {
  agents?: AgentAppearance[];
  agentName?: string;
}

const AGENT_SLOTS = [
  { position: [1.0, 0, 0.8] as [number, number, number],  rotation: [0, Math.PI * 0.85, 0] as [number, number, number], phaseOffset: 0.6 },
  { position: [-0.8, 0, 1.5] as [number, number, number], rotation: [0, Math.PI * 0.5, 0] as [number, number, number],  phaseOffset: 1.4 },
  { position: [3.0, 0, -2.0] as [number, number, number], rotation: [0, -Math.PI * 0.7, 0] as [number, number, number], phaseOffset: 2.1 },
  { position: [-1.5, 0, -1.0] as [number, number, number],rotation: [0, Math.PI * 1.2, 0] as [number, number, number],  phaseOffset: 0.2 },
];

const DEFAULT_AGENTS: AgentAppearance[] = [
  { hairColor: '#c8a020', shirtColor: '#4cc9f0', pantsColor: '#0f1a2e' },
];

export default function WorkshopRoom({ agents = DEFAULT_AGENTS, agentName }: WorkshopRoomProps) {
  const tvScreenRef = useRef<THREE.MeshStandardMaterial>(null);
  const visibleAgents = agents.slice(0, 4);

  useFrame(({ clock }) => {
    if (tvScreenRef.current) {
      const t = clock.getElapsedTime();
      tvScreenRef.current.emissiveIntensity = 1.6 + Math.sin(t * 1.1) * 0.12;
    }
  });

  return (
    <group>
      {/* ── 监控大屏 (TV) ── */}
      <group position={[-3.72, 1.65, -0.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.0, 1.75, 0.1]} />
          <meshStandardMaterial color={COLORS.monitorScreen} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.056]}>
          <planeGeometry args={[2.82, 1.58]} />
          {/* 工坊用绿色监控屏 */}
          <meshStandardMaterial ref={tvScreenRef} color='#0a2a18' emissive='#22c55e' emissiveIntensity={1.6} />
        </mesh>
        <pointLight color='#22c55e' intensity={4} distance={8} decay={2} position={[0.5, 0, 0]} />
      </group>
      {/* TV stands */}
      <mesh position={[-3.72, 1.65, -2.45]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.22, 1.2, 0.18]} />
        <meshStandardMaterial color={COLORS.monitorScreen} roughness={0.8} />
      </mesh>
      <mesh position={[-3.72, 1.65, 0.85]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.22, 1.2, 0.18]} />
        <meshStandardMaterial color={COLORS.monitorScreen} roughness={0.8} />
      </mesh>

      {/* ── Shelf above screen ── */}
      <group position={[-3.76, 2.98, -0.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 0.07, 0.3]} />
          <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.35} />
        </mesh>
        {/* 工具/零件 box */}
        {[[-0.7, '#e07830'], [-0.2, '#5189fb'], [0.35, '#e83030']] .map(([ox, col], i) => (
          <mesh key={i} position={[Number(ox), 0.17, 0]} castShadow>
            <boxGeometry args={[0.3, 0.26, 0.2]} />
            <meshStandardMaterial color={col as string} emissive={col as string} emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── Back wall: tech diagrams ── */}
      <mesh position={[1.8, 2.2, -3.74]}>
        <boxGeometry args={[1.06, 1.35, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[1.8, 2.2, -3.64]}>
        <boxGeometry args={[0.95, 1.25, 0.06]} />
        <meshStandardMaterial color='#0a2a18' roughness={0.85} />
      </mesh>
      <mesh position={[3.05, 2.2, -3.74]}>
        <boxGeometry args={[1.06, 1.35, 0.06]} />
        <meshStandardMaterial color={COLORS.trimWhite} roughness={0.75} />
      </mesh>
      <mesh position={[3.05, 2.2, -3.64]}>
        <boxGeometry args={[0.95, 1.25, 0.06]} />
        <meshStandardMaterial color='#0d2244' roughness={0.85} />
      </mesh>

      {/* ── Workbench (工具台) ── */}
      <group position={[2.42, 0, -3.0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 0.85, 0.6]} />
          <meshStandardMaterial color='#1e1628' roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[2.4, 0.07, 0.6]} />
          <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.2} />
        </mesh>
        {/* 工具摆放 */}
        {([['#5189fb',0.3], ['#e07830',-0.3], ['#22c55e',0.0]] as [string,number][]).map(([col,ox],i) => (
          <mesh key={i} position={[ox, 0.55, 0]} castShadow>
            <boxGeometry args={[0.18, 0.22, 0.14]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.35} />
          </mesh>
        ))}
      </group>

      {/* ── Sofa + Coffee table (休息区) ── */}
      <group position={[2.2, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <Sofa />
      </group>
      <CoffeeTable position={[0.6, 0, -0.5]} />

      {/* ── Corner plant ── */}
      <mesh position={[3.3, 0.2, -3.2]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.35, 8]} />
        <meshStandardMaterial color='#3d1a10' roughness={0.9} />
      </mesh>
      <mesh position={[3.3, 0.62, -3.2]} castShadow>
        <sphereGeometry args={[0.32, 7, 6]} />
        <meshStandardMaterial color='#1a5c28' roughness={0.95} />
      </mesh>

      {/* ── Floor rug ── */}
      <mesh position={[1.2, 0.009, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 2.4]} />
        <meshStandardMaterial color='#0a1208' roughness={1} />
      </mesh>

      {/* ── Ceiling lamp ── */}
      <mesh position={[0, 3.88, -0.5]}>
        <boxGeometry args={[0.55, 0.06, 0.55]} />
        <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={0.6} />
      </mesh>

      {/* ── Agents ── */}
      {visibleAgents.map((agent, i) => (
        <PixelPerson
          key={i}
          position={AGENT_SLOTS[i].position}
          rotation={AGENT_SLOTS[i].rotation}
          hairColor={agent.hairColor ?? '#c8a020'}
          shirtColor={agent.shirtColor ?? '#4cc9f0'}
          pantsColor={agent.pantsColor ?? '#0f1a2e'}
          skinColor={agent.skinColor}
          name={i === 0 && agentName ? agentName : agent.name}
          phaseOffset={AGENT_SLOTS[i].phaseOffset}
        />
      ))}

      {/* ── Lights ── */}
      <pointLight color='#99ffbb' intensity={6} distance={10} decay={2} position={[0, 3.6, -0.3]} />
      <pointLight color='#22c55e'  intensity={2.5} distance={7} decay={2} position={[-2.5, 1.5, -2]} />
      <pointLight color={COLORS.neonBlue} intensity={1} distance={5} decay={2} position={[2, 2.5, 1]} />
      <pointLight color={COLORS.neonBlue} intensity={1.2} distance={4} decay={2} position={[0, 0.15, 3.5]} />
    </group>
  );
}
