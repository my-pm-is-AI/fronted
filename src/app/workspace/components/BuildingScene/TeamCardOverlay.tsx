'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TeamCardOverlayProps {
  agentName: string | null;
  onClose: () => void;
}

interface TeamMemberInfo {
  name: string;
  role: string;
  phase: string;
  phaseColor: string;
  progress: number;
  status: string;
  preview: string;
  initials: string;
}

export default function TeamCardOverlay({ agentName, onClose }: TeamCardOverlayProps) {
  const [memberInfo, setMemberInfo] = useState<TeamMemberInfo | null>(null);

  useEffect(() => {
    if (!agentName) {
      setMemberInfo(null);
      return;
    }

    const fetchAgentInfo = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const projectIdStr = window.location.pathname.split('/').pop();
        const projectId = projectIdStr ? parseInt(projectIdStr, 10) : 1;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const res = await fetch(`${apiUrl}/api/v1/project/${projectId}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const members = data.data?.members || [];
          const todos = data.data?.todos || [];

          // 尝试匹配点击的 agentName (可能大小写/前后缀不同，做简单的忽略大小写包含匹配)
          const matchedMember = members.find((m: any) => 
            m.name.toLowerCase().includes(agentName.toLowerCase()) || 
            agentName.toLowerCase().includes(m.name.toLowerCase())
          ) || members[0]; // 如果没找到，就用第一个 mock

          if (matchedMember) {
            const memberTodos = todos.filter((t: any) => t.role === matchedMember.role);
            const total = memberTodos.length;
            const done = memberTodos.filter((t: any) => t.status === 'done').length;
            const progress = total > 0 ? Math.round((done / total) * 100) : Math.floor(Math.random() * 60) + 10;
            
            const colors = ['#5189fb', '#22c55e', '#F05A28', '#cc44aa', '#4cc9f0'];
            // 简单哈希一下名字来取颜色
            const colorIdx = matchedMember.name.charCodeAt(0) % colors.length;
            const color = colors[colorIdx];
            
            let currentTask = memberTodos.find((t: any) => t.status !== 'done')?.content || '正在处理分配的任务...';

            setMemberInfo({
              name: matchedMember.name,
              initials: matchedMember.name.substring(0, 2).toUpperCase(),
              role: matchedMember.role,
              phase: 'PHASE · DEV',
              phaseColor: color,
              progress: progress,
              status: progress === 100 ? 'DONE' : 'RUNNING',
              preview: currentTask,
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAgentInfo();
  }, [agentName]);

  return (
    <AnimatePresence>
      {agentName && memberInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-8 right-8 z-30"
          style={{ width: 280 }}
        >
          <div
            className='card-pop-in'
            style={{
              background: '#080808',
              border: `2px solid ${memberInfo.phaseColor}`,
              boxShadow: `6px 6px 0 ${memberInfo.phaseColor}`,
              padding: 0,
              overflow: 'hidden',
            }}
          >
            {/* 关闭按钮 */}
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              ×
            </button>

            {/* 顶部色条 */}
            <div style={{ height: 4, background: memberInfo.phaseColor, boxShadow: `0 0 12px ${memberInfo.phaseColor}aa` }} />

            <div style={{ padding: '16px 16px 20px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                {/* Avatar */}
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${memberInfo.phaseColor}22`,
                  border: `2px solid ${memberInfo.phaseColor}`,
                  fontFamily: 'Archivo Black, sans-serif',
                  fontSize: 14, color: memberInfo.phaseColor,
                  letterSpacing: '-0.02em',
                }}>
                  {memberInfo.initials}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 16, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 4 }}>
                    {memberInfo.name}
                  </p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {memberInfo.role}
                  </p>
                </div>
                {/* Status dot */}
                <div style={{
                  fontFamily: 'Space Mono, monospace', fontSize: 10,
                  color: memberInfo.status === 'DONE' ? '#22c55e' : memberInfo.phaseColor,
                  letterSpacing: '0.1em', flexShrink: 0,
                }}>
                  <span className='pixel-blink'>●</span>
                </div>
              </div>

              {/* Progress bar + percent */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                    PROGRESS
                  </span>
                  <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 16, color: memberInfo.phaseColor, letterSpacing: '-0.02em' }}>
                    {memberInfo.progress}%
                  </span>
                </div>
                <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${memberInfo.progress}%`,
                      background: memberInfo.phaseColor,
                      boxShadow: `0 0 10px ${memberInfo.phaseColor}88`,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>

              {/* Preview text */}
              <p style={{
                fontFamily: 'Space Mono, monospace', fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.02em', lineHeight: 1.6,
              }}>
                {memberInfo.preview}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}