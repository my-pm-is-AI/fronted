'use client';
import { use, useState } from 'react';
import dynamic from 'next/dynamic';
import TopNav from '../components/TopNav';
import AgentChat from '../components/AgentChat';
import ProjectStatus from '../components/ProjectStatus';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import: 3D Canvas 不能在 SSR 渲染
const BuildingScene = dynamic(() => import('../components/BuildingScene'), { ssr: false });

export default function WorkspaceRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [showStatus, setShowStatus] = useState(false);
  
  return (
    <div
      className='flex flex-col w-full overflow-hidden'
      style={{ background: '#0A0A0A', color: '#FFFFFF', height: 'calc(100vh - 48px)' }}
    >
      {/* ── Top Nav ── */}
      <TopNav />

      {/* ── Main content ── */}
      <div className='flex flex-1 overflow-hidden'>

        {/* ── Left Panel (35%) ── */}
        <aside
          className='flex flex-col overflow-hidden'
          style={{ width: '35%', minWidth: '300px', maxWidth: '480px', background: '#F7F6F3', borderRight: '2px solid #000' }}
        >
          {/* Agent Chat — 全高 */}
          <div className='flex-1 overflow-hidden min-h-0'>
            <AgentChat />
          </div>
        </aside>

        {/* ── Right Panel (65%) — 3D Building ── */}
        <main className='flex-1 overflow-hidden relative' style={{ background: '#0a0812' }}>
          <BuildingScene />
          
          {/* 悬浮在右上角的 Project Status 切换按钮 */}
          <button
            onClick={() => setShowStatus(!showStatus)}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm font-bold tracking-widest text-[var(--accent)] uppercase backdrop-blur-md transition-all hover:bg-[var(--accent)]/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            PROJECT STATUS
          </button>

          {/* 悬浮在右上角的 Project Status 内容 */}
          <AnimatePresence>
            {showStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 right-4 z-10 w-80 shadow-2xl" 
                style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
              >
                <ProjectStatus />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        </div>
    </div>
  );
}
