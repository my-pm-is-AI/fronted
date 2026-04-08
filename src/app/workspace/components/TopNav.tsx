'use client';

export default function TopNav() {
  return (
    <div className='shrink-0'>
      {/* ── 主导航栏 ── */}
      <header
        className='flex items-center justify-between px-6 h-14'
        style={{ background: '#000', borderBottom: '1px solid rgba(255,255,255,0.12)' }}
      >
        {/* Left: Logo + title */}
        <div className='flex items-center gap-4'>
          {/* 唯一橙色：竖线小块 */}
          <div style={{ width: 3, height: 28, background: '#F05A28' }} />
          <div>
            <p className='font-display text-white leading-none' style={{ fontSize: 20, letterSpacing: '-0.04em' }}>
              WORKSPACE
            </p>
            <p className='font-mono-brand text-[9px] mt-0.5' style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>
              KINETIC ENGINE v1.0
            </p>
          </div>
          <div
            className='font-mono-brand text-[9px] px-2 py-0.5 tracking-widest'
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em' }}
          >
            HACKATHON
          </div>
        </div>

        {/* Right */}
        <div className='flex items-center gap-4'>
          <div className='font-mono-brand text-[10px] flex items-center gap-2' style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
            <span className='pixel-blink' style={{ color: '#22c55e' }}>█</span>
            <span>SYS ONLINE</span>
          </div>
          <div className='font-mono-brand text-[10px] px-2 py-1' style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.3)' }}>
            4 AGENTS
          </div>
          <div
            className='w-9 h-9 flex items-center justify-center font-display'
            style={{ background: '#fff', color: '#000', fontSize: 11 }}
          >
            ME
          </div>
        </div>
      </header>

      {/* ── Marquee 跑马灯（深色低调版）── */}
      <div
        className='overflow-hidden whitespace-nowrap py-1'
        style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className='animate-marquee inline-flex'>
          <span className='font-display text-[10px]' style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.18em' }}>
            HACKATHON 2026 ✦ AI AGENT WORKSPACE ✦ BUILD · CODE · SHIP ✦ SYSTEM ONLINE ✦ PHASE 3 ACTIVE ✦ NEURAL NODE CONNECTED ✦ RENDER ENGINE v3.1 ✦ &nbsp;
          </span>
          <span className='font-display text-[10px]' style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.18em' }}>
            HACKATHON 2026 ✦ AI AGENT WORKSPACE ✦ BUILD · CODE · SHIP ✦ SYSTEM ONLINE ✦ PHASE 3 ACTIVE ✦ NEURAL NODE CONNECTED ✦ RENDER ENGINE v3.1 ✦ &nbsp;
          </span>
        </div>
      </div>
    </div>
  );
}