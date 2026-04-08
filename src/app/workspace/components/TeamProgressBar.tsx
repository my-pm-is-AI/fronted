'use client';
import { useState } from 'react';

interface TeamMember {
  id: string; name: string; initials: string; project: string;
  currentPhase: string; agentPreview: string; requirement: string;
  rotate: number; delay: number;
}

const TEAM: TeamMember[] = [
  { id: '1', name: 'ALEX CHEN',  initials: 'AC', project: 'AI CODE REVIEW',   currentPhase: 'PHASE 3 · MODEL', agentPreview: '正在分析代码 AST 结构，识别潜在 bug...', requirement: '自动代码审查 + Bug 检测', rotate: -2, delay: 0 },
  { id: '2', name: 'SARAH LIU',  initials: 'SL', project: 'SMART DASHBOARD',  currentPhase: 'PHASE 2 · DATA',  agentPreview: '已完成 Chart 组件 8/12 个，进度 66%...', requirement: '实时数据大屏 + AI 预警', rotate: 1,  delay: 80 },
  { id: '3', name: 'MIKE WANG',  initials: 'MW', project: 'DOC GENERATOR',    currentPhase: 'PHASE 1 · ENV',   agentPreview: '初始化项目结构，安装依赖 three@0.174...', requirement: '自动生成技术文档', rotate: -1, delay: 160 },
  { id: '4', name: 'LILY ZHANG', initials: 'LZ', project: 'VOICE ASSISTANT',  currentPhase: 'PHASE 4 · UI',    agentPreview: '优化交互动画，Framer Motion 集成完成...', requirement: '语音交互 AI 助手', rotate: 2,  delay: 240 },
];

function TeamCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className='shrink-0 w-52 p-3 cursor-pointer card-pop-in'
      style={{
        '--card-rotate': `${member.rotate}deg`,
        background: hovered ? '#111' : '#050505',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: hovered ? '4px 4px 0 rgba(255,255,255,0.15)' : 'none',
        transform: hovered ? `translate(-2px,-2px) rotate(0deg)` : `rotate(${member.rotate}deg)`,
        transition: 'transform 0.12s, box-shadow 0.12s, border-color 0.12s, background 0.12s',
        animationDelay: `${member.delay}ms`,
      } as React.CSSProperties}
    >
      {/* Top row */}
      <div className='flex items-center gap-2 mb-2'>
        <div
          className='w-8 h-8 flex items-center justify-center font-display text-[11px] shrink-0'
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.25)' }}
        >
          {member.initials}
        </div>
        <div className='min-w-0'>
          <p className='font-display truncate' style={{ fontSize: 11, color: '#fff', letterSpacing: '-0.03em' }}>{member.name}</p>
          <p className='font-mono-brand text-[9px] truncate' style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{member.project}</p>
        </div>
      </div>

      {/* Phase badge */}
      <div
        className='inline-block font-mono-brand text-[9px] px-2 py-0.5 mb-2'
        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}
      >
        <span className='pixel-blink' style={{ color: '#22c55e' }}>●</span> {member.currentPhase}
      </div>

      {/* Agent preview */}
      <p className='font-mono-brand text-[10px] leading-relaxed mb-1.5 line-clamp-2'
        style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}>
        {member.agentPreview}
      </p>

      {/* Bottom divider + requirement */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 6, marginTop: 4 }}>
        <p className='font-mono-brand text-[9px] truncate' style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>
          REQ: {member.requirement}
        </p>
      </div>
    </div>
  );
}

export default function TeamProgressBar() {
  return (
    <div
      className='shrink-0'
      style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.12)' }}
    >
      {/* Header label */}
      <div
        className='flex items-center gap-3 px-4 py-1.5 overflow-hidden whitespace-nowrap'
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className='animate-marquee-reverse inline-flex shrink-0'>
          <span className='font-display text-[9px]' style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.2em' }}>
            TEAM PROGRESS ✦ 4 MEMBERS ACTIVE ✦ HACKATHON 2026 ✦ ALL AGENTS ONLINE ✦ BUILD · CODE · SHIP ✦ &nbsp;
          </span>
          <span className='font-display text-[9px]' style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.2em' }}>
            TEAM PROGRESS ✦ 4 MEMBERS ACTIVE ✦ HACKATHON 2026 ✦ ALL AGENTS ONLINE ✦ BUILD · CODE · SHIP ✦ &nbsp;
          </span>
        </div>
      </div>

      {/* Cards row */}
      <div
        className='flex gap-4 px-4 py-3 overflow-x-auto'
        style={{ height: 185, scrollbarWidth: 'none' }}
      >
        {TEAM.map(member => <TeamCard key={member.id} member={member} />)}
      </div>
    </div>
  );
}