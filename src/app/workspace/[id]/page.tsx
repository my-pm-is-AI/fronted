'use client';
import { use } from 'react';
import dynamic from 'next/dynamic';
import TopNav from '../components/TopNav';
import AgentChat from '../components/AgentChat';
import ProjectStatus from '../components/ProjectStatus';
import TeamProgressBar from '../components/TeamProgressBar';

// Dynamic import: 3D Canvas 不能在 SSR 渲染
const BuildingScene = dynamic(() => import('../components/BuildingScene'), { ssr: false });

export default function WorkspaceRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
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
          
          {/* 悬浮在右上角的 Project Status */}
          <div 
            className="absolute top-4 right-4 z-10 w-80 shadow-2xl" 
            style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
          >
            <ProjectStatus />
          </div>
        </main>
      </div>

      {/* ── Bottom Team Progress Bar ── */}
      <TeamProgressBar />
    </div>
  );
}
