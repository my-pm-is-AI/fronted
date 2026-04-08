'use client';
import dynamic from 'next/dynamic';
import TopNav from './components/TopNav';
import AgentChat from './components/AgentChat';
import ProjectStatus from './components/ProjectStatus';
import TeamProgressBar from './components/TeamProgressBar';

// Dynamic import: 3D Canvas 不能在 SSR 渲染
const BuildingScene = dynamic(() => import('./components/BuildingScene'), { ssr: false });

export default function WorkspacePage() {
  return (
    <div
      className='flex flex-col w-full h-screen overflow-hidden'
      style={{ background: '#0A0A0A', color: '#FFFFFF' }}
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
          {/* Agent Chat — 上半 */}
          <div className='flex-1 overflow-hidden min-h-0'>
            <AgentChat />
          </div>

          {/* Project Status — 下半 */}
          <div className='shrink-0 overflow-y-auto' style={{ maxHeight: '270px' }}>
            <ProjectStatus />
          </div>
        </aside>

        {/* ── Right Panel (65%) — 3D Building ── */}
        <main className='flex-1 overflow-hidden relative' style={{ background: '#0a0812' }}>
          <BuildingScene />
        </main>
      </div>

      {/* ── Bottom Team Progress Bar ── */}
      <TeamProgressBar />
    </div>
  );
}