'use client';
import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  phase: string;
  phaseColor: string;
  progress: number;
  status: string;
  preview: string;
  rotate: number;
  delay: number;
}

const TEAM: TeamMember[] = [
  {
    id: '1', name: 'ALEX CHEN', initials: 'AC', role: 'AI CODE REVIEW',
    phase: 'PHASE 3 · MODEL', phaseColor: '#5189fb', progress: 72,
    status: 'RUNNING', preview: '正在分析代码 AST 结构，识别潜在 bug，预计完成时间 14:30',
    rotate: -1.5, delay: 0,
  },
  {
    id: '2', name: 'SARAH LIU', initials: 'SL', role: 'SMART DASHBOARD',
    phase: 'PHASE 2 · DATA', phaseColor: '#22c55e', progress: 66,
    status: 'RUNNING', preview: '已完成 Chart 组件 8/12 个，实时数据流接入中...',
    rotate: 1, delay: 60,
  },
  {
    id: '3', name: 'MIKE WANG', initials: 'MW', role: 'DOC GENERATOR',
    phase: 'PHASE 1 · ENV', phaseColor: '#F05A28', progress: 31,
    status: 'RUNNING', preview: '初始化项目结构，安装依赖 three@0.174，配置 tsconfig',
    rotate: -0.8, delay: 120,
  },
  {
    id: '4', name: 'LILY ZHANG', initials: 'LZ', role: 'VOICE ASSISTANT',
    phase: 'PHASE 4 · UI', phaseColor: '#cc44aa', progress: 88,
    status: 'RUNNING', preview: '优化交互动画，Framer Motion 集成完成，准备进入测试阶段',
    rotate: 1.8, delay: 180,
  },
  {
    id: '5', name: 'NOVA AI', initials: 'NA', role: 'NEURAL ENGINE',
    phase: 'PHASE 5 · TEST', phaseColor: '#4cc9f0', progress: 95,
    status: 'DONE', preview: '所有单元测试通过，准备输出最终报告',
    rotate: -1.2, delay: 240,
  },
];

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${value}%`,
          background: color,
          boxShadow: `0 0 8px ${color}88`,
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // blogNow 风格硬偏移阴影
  const shadow = pressed ? 'none' : hovered ? `6px 6px 0 ${member.phaseColor}` : `3px 3px 0 rgba(255,255,255,0.1)`;
  const transform = pressed
    ? `translate(3px,3px) rotate(0deg)`
    : hovered
    ? `translate(-3px,-3px) rotate(0deg)`
    : `rotate(${member.rotate}deg)`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className='shrink-0 cursor-pointer card-pop-in'
      style={{
        '--card-rotate': `${member.rotate}deg`,
        width: 220,
        background: hovered ? '#111' : '#080808',
        border: `2px solid ${hovered ? member.phaseColor : 'rgba(255,255,255,0.1)'}`,
        boxShadow: shadow,
        transform,
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, border-color 0.15s, background 0.12s',
        animationDelay: `${member.delay}ms`,
        padding: 0,
        overflow: 'hidden',
      } as React.CSSProperties}
    >
      {/* 顶部色条 */}
      <div style={{ height: 3, background: member.phaseColor, boxShadow: `0 0 8px ${member.phaseColor}88` }} />

      <div style={{ padding: '10px 12px 12px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovered ? member.phaseColor : 'transparent',
            border: `2px solid ${hovered ? member.phaseColor : 'rgba(255,255,255,0.2)'}`,
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 11, color: hovered ? '#000' : 'rgba(255,255,255,0.7)',
            letterSpacing: '-0.02em',
            transition: 'all 0.15s',
          }}>
            {member.initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 12, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 2 }}>
              {member.name}
            </p>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {member.role}
            </p>
          </div>
          {/* Status dot */}
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 8,
            color: member.status === 'DONE' ? '#22c55e' : member.phaseColor,
            letterSpacing: '0.1em', flexShrink: 0,
          }}>
            <span className='pixel-blink'>●</span>
          </div>
        </div>

        {/* Phase badge */}
        <div style={{
          display: 'inline-block', marginBottom: 8,
          fontFamily: 'Space Mono, monospace', fontSize: 9,
          padding: '2px 6px',
          border: `1px solid ${member.phaseColor}55`,
          color: member.phaseColor,
          letterSpacing: '0.08em',
          background: `${member.phaseColor}15`,
        }}>
          {member.phase}
        </div>

        {/* Progress bar + percent */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              PROGRESS
            </span>
            <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 13, color: member.phaseColor, letterSpacing: '-0.02em' }}>
              {member.progress}%
            </span>
          </div>
          <ProgressBar value={member.progress} color={member.phaseColor} />
        </div>

        {/* Preview text */}
        <p style={{
          fontFamily: 'Space Mono, monospace', fontSize: 9,
          color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.02em', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {member.preview}
        </p>
      </div>
    </div>
  );
}

export default function TeamProgressBar() {
  const [team, setTeam] = useState<TeamMember[]>(TEAM);

  useEffect(() => {
    const fetchTeamProgress = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const projectIdStr = window.location.pathname.split('/').pop();
        const projectId = projectIdStr ? parseInt(projectIdStr, 10) : 1;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // Fetch tasks / members
        const res = await fetch(`${apiUrl}/api/v1/project/${projectId}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const members = data.data?.members || [];
          const todos = data.data?.todos || [];

          if (members.length > 0) {
            const mappedTeam: TeamMember[] = members.map((m: any, idx: number) => {
              const memberTodos = todos.filter((t: any) => t.role === m.role);
              const total = memberTodos.length;
              const done = memberTodos.filter((t: any) => t.status === 'done').length;
              const progress = total > 0 ? Math.round((done / total) * 100) : Math.floor(Math.random() * 60) + 10; // mock if no specific progress
              
              const colors = ['#5189fb', '#22c55e', '#F05A28', '#cc44aa', '#4cc9f0'];
              const color = colors[idx % colors.length];
              
              let currentTask = memberTodos.find((t: any) => t.status !== 'done')?.content || '正在处理分配的任务...';

              return {
                id: m.id.toString(),
                name: m.name,
                initials: m.name.substring(0, 2).toUpperCase(),
                role: m.role,
                phase: `PHASE ${idx + 1} · DEV`,
                phaseColor: color,
                progress: progress,
                status: progress === 100 ? 'DONE' : 'RUNNING',
                preview: currentTask,
                rotate: (Math.random() - 0.5) * 4,
                delay: idx * 60
              };
            });
            setTeam(mappedTeam);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchTeamProgress();
  }, []);

  return (
    <div
      className='shrink-0'
      style={{ background: '#000', borderTop: '2px solid rgba(255,255,255,0.12)' }}
    >
      {/* 跑马灯 */}
      <div
        className='overflow-hidden whitespace-nowrap'
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d', padding: '5px 0' }}
      >
        <div style={{ display: 'inline-flex', animation: 'marquee-reverse 10s linear infinite' }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              fontFamily: 'Archivo Black, sans-serif', textTransform: 'uppercase',
              fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.22em',
            }}>
              AGENTS ONLINE &nbsp;✦&nbsp; TEAM PROGRESS &nbsp;✦&nbsp; {team.length} MEMBERS ACTIVE &nbsp;✦&nbsp; HACKATHON 2026 &nbsp;✦&nbsp; BUILD · CODE · SHIP &nbsp;✦&nbsp; ALL SYSTEMS GO &nbsp;✦&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Cards row */}
      <div
        style={{
          display: 'flex', gap: 12, padding: '12px 16px 14px',
          overflowX: 'auto', height: 210,
          scrollbarWidth: 'none',
          alignItems: 'flex-start',
        }}
      >
        {team.map(member => <TeamCard key={member.id} member={member} />)}

        {/* 末尾占位 */}
        <div style={{ width: 1, flexShrink: 0 }} />
      </div>
    </div>
  );
}