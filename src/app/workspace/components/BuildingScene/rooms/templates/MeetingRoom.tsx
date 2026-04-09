/**
 * 📋 MeetingRoom — 会议室样板 v2
 * 适用职能：产品经理 / 项目经理 / 策划
 * 修复：桌椅对齐、投影大屏、白板、绿植装饰
 */

'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../../lib/constants';
import PixelPerson from '../../furniture/PixelPerson';

interface AgentAppearance {
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
  name?: string;
}

interface MeetingRoomProps {
  agents?: AgentAppearance[];
  agentName?: string;
}

// 像素人站在地板上（y=0），位置在桌旁两侧
const AGENT_SLOTS = [
  { position: [-0.5, 0,  2.0] as [number,number,number], rotation: [0, -Math.PI * 0.05, 0] as [number,number,number], phaseOffset: 0.0 },
  { position: [1.5,  0,  2.0] as [number,number,number], rotation: [0,  Math.PI * 1.05, 0] as [number,number,number], phaseOffset: 1.2 },
  { position: [-0.5, 0, -1.8] as [number,number,number], rotation: [0,  Math.PI * 0.95, 0] as [number,number,number], phaseOffset: 2.0 },
  { position: [1.5,  0, -1.8] as [number,number,number], rotation: [0, -Math.PI * 1.05, 0] as [number,number,number], phaseOffset: 0.8 },
];

const DEFAULT_AGENTS: AgentAppearance[] = [
  { hairColor: '#2a1a0a', shirtColor: '#4cc9f0', pantsColor: '#0a0a1e' },
  { hairColor: '#6a2010', shirtColor: '#a0c8ff', pantsColor: '#0f0e2a' },
];

export default function MeetingRoom({ agents = DEFAULT_AGENTS, agentName }: MeetingRoomProps) {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null);
  const visibleAgents = agents.slice(0, 4);

  useFrame(({ clock }) => {
    if (screenRef.current) {
      const t = clock.getElapsedTime();
      screenRef.current.emissiveIntensity = 1.0 + Math.sin(t * 0.9) * 0.15;
    }
  });

  return (
    <group>
      {/* ════ 投影大屏（左侧墙）════ */}
      <group position={[-3.68, 2.2, -0.2]} rotation={[0, Math.PI / 2, 0]}>
        {/* 屏幕边框 */}
        <mesh castShadow>
          <boxGeometry args={[3.8, 2.2, 0.07]} />
          <meshStandardMaterial color='#0a0a14' metalness={0.4} roughness={0.5} />
        </mesh>
        {/* 屏幕内容 */}
        <mesh position={[0, 0, 0.042]}>
          <planeGeometry args={[3.62, 2.04]} />
          <meshStandardMaterial
            ref={screenRef}
            color='#040c22'
            emissive='#3a6ae8'
            emissiveIntensity={1.0}
          />
        </mesh>
        {/* PPT 模拟：标题栏 */}
        <mesh position={[0, 0.72, 0.05]}>
          <planeGeometry args={[3.4, 0.32]} />
          <meshStandardMaterial color='#1a3a8a' emissive='#5189fb' emissiveIntensity={0.5} />
        </mesh>
        {/* PPT 模拟：内容列表 */}
        {[-0.1, -0.45, -0.78].map((y, i) => (
          <mesh key={i} position={[-0.5, y, 0.05]}>
            <planeGeometry args={[2.5, 0.12]} />
            <meshStandardMaterial color='#e8f0ff' emissive='#aaccff' emissiveIntensity={0.15} />
          </mesh>
        ))}
        {/* 屏幕光晕 */}
        <pointLight color='#3a6ae8' intensity={6} distance={9} decay={2} position={[0.5, 0, 0.2]} />
      </group>
      {/* 屏幕支架 */}
      <mesh position={[-3.68, 0.6, -0.2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.08]} />
        <meshStandardMaterial color='#222' metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ════ 会议桌（椭圆感：长桌）════ */}
      <group position={[0.5, 0, 0.1]}>
        {/* 桌面 */}
        <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.07, 1.5]} />
          <meshStandardMaterial color='#1a1838' roughness={0.45} metalness={0.25} />
        </mesh>
        {/* 桌面反光条 */}
        <mesh position={[0, 0.815, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 1.5]} />
          <meshStandardMaterial color='#3a3870' emissive='#5189fb' emissiveIntensity={0.06} roughness={0.2} />
        </mesh>
        {/* 桌腿（T型底座）*/}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.12, 0.76, 0.12]} />
          <meshStandardMaterial color='#111' metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[1.8, 0.08, 0.32]} />
          <meshStandardMaterial color='#111' metalness={0.7} roughness={0.2} />
        </mesh>

        {/* 桌上：笔记本电脑 x4 */}
        {([
          [-1.0,  0.5], [-0.1,  0.5],
          [-1.0, -0.5], [-0.1, -0.5],
        ] as [number,number][]).map(([x, z], i) => (
          <group key={i} position={[x, 0.82, z]}>
            {/* 底座 */}
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.022, 0.22]} />
              <meshStandardMaterial color='#1c1c2c' roughness={0.5} metalness={0.5} />
            </mesh>
            {/* 屏幕（倾斜打开）*/}
            <mesh position={[0, 0.1, -0.09]} rotation={[-Math.PI * 0.32, 0, 0]} castShadow>
              <boxGeometry args={[0.30, 0.21, 0.02]} />
              <meshStandardMaterial color='#1c1c2c' roughness={0.5} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0.1, -0.088]} rotation={[-Math.PI * 0.32, 0, 0]}>
              <planeGeometry args={[0.27, 0.19]} />
              <meshStandardMaterial color='#040c22' emissive='#5189fb' emissiveIntensity={0.55} />
            </mesh>
          </group>
        ))}

        {/* 桌上：咖啡杯 */}
        <mesh position={[1.1, 0.84, 0.4]} castShadow>
          <cylinderGeometry args={[0.055, 0.045, 0.1, 10]} />
          <meshStandardMaterial color='#f5f0e8' roughness={0.6} />
        </mesh>
        <mesh position={[1.1, 0.91, 0.4]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 10]} />
          <meshStandardMaterial color='#3a1a08' roughness={0.9} />
        </mesh>

        {/* 桌上：文件夹 */}
        <mesh position={[0.9, 0.815, -0.45]} rotation={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.28, 0.028, 0.20]} />
          <meshStandardMaterial color='#F05A28' roughness={0.85} />
        </mesh>
      </group>

      {/* ════ 椅子（桌子两侧）════ */}
      {([
        // 前排（z=1.45）— 面朝屏幕
        [-1.0, 1.42, 0],
        [ 0.0, 1.42, 0],
        [ 1.0, 1.42, 0],
        // 后排（z=-1.22）— 面朝屏幕
        [-1.0, -1.22, Math.PI],
        [ 0.0, -1.22, Math.PI],
        [ 1.0, -1.22, Math.PI],
      ] as [number,number,number][]).map(([x, z, ry], i) => (
        <group key={i} position={[x + 0.5, 0, z]} rotation={[0, ry, 0]}>
          {/* 座面 */}
          <mesh position={[0, 0.46, 0]} castShadow>
            <boxGeometry args={[0.44, 0.05, 0.44]} />
            <meshStandardMaterial color='#1a1838' roughness={0.7} />
          </mesh>
          {/* 靠背 */}
          <mesh position={[0, 0.75, -0.2]} castShadow>
            <boxGeometry args={[0.42, 0.52, 0.05]} />
            <meshStandardMaterial color='#1a1838' roughness={0.7} />
          </mesh>
          {/* 椅腿 */}
          {([[-0.17,-0.17],[0.17,-0.17],[-0.17,0.17],[0.17,0.17]] as [number,number][]).map(([lx,lz],j) => (
            <mesh key={j} position={[lx, 0.22, lz]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.44, 6]} />
              <meshStandardMaterial color='#333' metalness={0.5} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ════ 白板（后墙）════ */}
      <group position={[1.5, 2.4, -3.73]}>
        {/* 边框 */}
        <mesh castShadow>
          <boxGeometry args={[3.4, 1.7, 0.07]} />
          <meshStandardMaterial color='#e8e8f0' roughness={0.7} />
        </mesh>
        {/* 面板 */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[3.24, 1.54]} />
          <meshStandardMaterial color='#f8f8ff' roughness={0.9} />
        </mesh>
        {/* 白板上：流程图 */}
        {/* 方块 */}
        {([[-1.0, 0.3, '#4cc9f0'], [0.0, 0.3, '#5189fb'], [1.1, 0.3, '#7b2fe8']] as [number,number,string][]).map(([x,y,col],i) => (
          <mesh key={i} position={[x, y, 0.05]}>
            <planeGeometry args={[0.55, 0.32]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.25} />
          </mesh>
        ))}
        {/* 箭头线 */}
        {([[-0.47, 0.3], [0.56, 0.3]] as [number,number][]).map(([x,y],i) => (
          <mesh key={i} position={[x, y, 0.055]}>
            <planeGeometry args={[0.28, 0.03]} />
            <meshStandardMaterial color='#aaccff' emissive='#aaccff' emissiveIntensity={0.5} />
          </mesh>
        ))}
        {/* 底部文字横线 */}
        {[-0.4, 0.0, 0.35].map((x, i) => (
          <mesh key={i} position={[x, -0.35, 0.055]}>
            <planeGeometry args={[0.7, 0.04]} />
            <meshStandardMaterial color='#334' emissive='#334' emissiveIntensity={0.1} />
          </mesh>
        ))}
        {/* 白板金属边框发光条 */}
        <mesh position={[0, -0.86, 0.04]}>
          <planeGeometry args={[3.4, 0.05]} />
          <meshStandardMaterial color={COLORS.neonCyan} emissive={COLORS.neonCyan} emissiveIntensity={2} />
        </mesh>
      </group>

      {/* ════ 绿植（左角）════ */}
      <group position={[-3.1, 0, 2.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.17, 0.48, 8]} />
          <meshStandardMaterial color='#2a1508' roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.65, 0]} castShadow>
          <sphereGeometry args={[0.38, 8, 7]} />
          <meshStandardMaterial color='#1a5c28' roughness={0.95} />
        </mesh>
        <mesh position={[0.2, 0.85, 0.15]} castShadow>
          <sphereGeometry args={[0.22, 7, 6]} />
          <meshStandardMaterial color='#22703a' roughness={0.95} />
        </mesh>
      </group>

      {/* ════ 右角：小边桌 + 咖啡机 ════ */}
      <group position={[3.0, 0, 2.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.88, 0.72]} />
          <meshStandardMaterial color='#14122a' roughness={0.8} />
        </mesh>
        {/* 咖啡机 */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.28, 0.22, 0.22]} />
          <meshStandardMaterial color='#222' metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.63, 0.13]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
          <meshStandardMaterial color='#111' metalness={0.7} roughness={0.2} />
        </mesh>
        {/* 杯子 */}
        <mesh position={[-0.24, 0.5, 0.1]} castShadow>
          <cylinderGeometry args={[0.045, 0.038, 0.09, 8]} />
          <meshStandardMaterial color='#f0ece0' roughness={0.6} />
        </mesh>
      </group>

      {/* ════ 吊灯（会议桌正上方）════ */}
      {([-0.8, 0.5, 1.8] as number[]).map((x, i) => (
        <group key={i} position={[x, 3.82, 0.1]}>
          {/* 垂线 */}
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
            <meshStandardMaterial color='#333' metalness={0.6} roughness={0.3} />
          </mesh>
          {/* 灯罩 */}
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.08, 0.18, 10, 1, true]} />
            <meshStandardMaterial color='#1a1838' side={2} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 10]} />
            <meshStandardMaterial color={COLORS.trimWhite} emissive={COLORS.trimGlow} emissiveIntensity={1.2} />
          </mesh>
          <pointLight color='#cce4ff' intensity={5} distance={6} decay={2} position={[0, -0.32, 0]} />
        </group>
      ))}

      {/* ════ Agents ════ */}
      {visibleAgents.map((agent, i) => (
        <PixelPerson
          key={i}
          position={AGENT_SLOTS[i].position}
          rotation={AGENT_SLOTS[i].rotation}
          hairColor={agent.hairColor ?? '#2a1a0a'}
          shirtColor={agent.shirtColor ?? '#4cc9f0'}
          pantsColor={agent.pantsColor ?? '#0a0a1e'}
          skinColor={agent.skinColor}
          name={i === 0 && agentName ? agentName : agent.name}
          phaseOffset={AGENT_SLOTS[i].phaseOffset}
        />
      ))}

      {/* ════ 地毯 ════ */}
      <mesh position={[0.5, 0.009, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color='#080820' roughness={1} />
      </mesh>

      {/* ════ 霓虹iplinary ════ */}
      <mesh position={[0, 3.92, -3.88]}>
        <boxGeometry args={[7.6, 0.04, 0.04]} />
        <meshStandardMaterial color={COLORS.neonCyan} emissive={COLORS.neonCyan} emissiveIntensity={2.5} />
      </mesh>

      {/* ════ 灯光 ════ */}
      <pointLight color={COLORS.neonBlue}   intensity={2.5} distance={9}  decay={2} position={[-2.5, 2.0, -0.5]} />
      <pointLight color={COLORS.neonCyan}   intensity={1.2} distance={6}  decay={2} position={[2,    2.5, -2.5]} />
      <pointLight color={COLORS.neonPurple} intensity={0.8} distance={5}  decay={2} position={[3,    2,    2  ]} />
      <pointLight color={COLORS.neonBlue}   intensity={1.0} distance={4}  decay={2} position={[0,    0.15,  3.5]} />
    </group>
  );
}