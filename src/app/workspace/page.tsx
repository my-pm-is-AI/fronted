'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import TopNav from './components/TopNav';
import AgentChat from './components/AgentChat';
import ProjectStatus from './components/ProjectStatus';
import TeamProgressBar from './components/TeamProgressBar';

// Dynamic import: 3D Canvas 不能在 SSR 渲染
const BuildingScene = dynamic(() => import('./components/BuildingScene'), { ssr: false });

export default function WorkspacePage() {
  const router = useRouter();
  
  // Since we are at /workspace, there is no ID. Show the empty state.
  return (
    <div
      className='flex flex-col w-full h-full items-center justify-center font-mono'
      style={{ background: '#0A0A0A', color: '#FFFFFF', minHeight: 'calc(100vh - 48px)' }}
    >
      <div className="flex flex-col items-center max-w-md text-center gap-6 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 mb-2">
          <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold tracking-widest uppercase text-white">当前没有进行中的项目</h2>
        
        <p className="text-[13px] text-white/50 leading-relaxed tracking-wide">
          工作空间需要关联具体的项目才能显示。你可以发布一个新的需求，或者去需求广场加入一个正在进行的项目。
        </p>
        
        <div className="flex gap-4 mt-4 w-full">
          <button 
            onClick={() => router.push('/publish')}
            className="flex-1 py-3 px-4 rounded-none border border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold tracking-widest uppercase hover:bg-[var(--accent)]/20 transition-colors"
          >
            发布需求
          </button>
          <button 
            onClick={() => router.push('/square')}
            className="flex-1 py-3 px-4 rounded-none border border-white/20 bg-transparent text-white/70 text-xs font-bold tracking-widest uppercase hover:bg-white/10 hover:text-white transition-colors"
          >
            去需求广场
          </button>
        </div>
      </div>
    </div>
  );
}