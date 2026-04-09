'use client';

export default function TopNav() {
  return (
    <div className='shrink-0'>
      {/* ── Marquee 跑马灯 ── */}
      <div
        className='overflow-hidden whitespace-nowrap py-[5px]'
        style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.15)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ display: 'inline-flex', animation: 'marquee 10s linear infinite' }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className='font-display text-[10px]'
              style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.22em' }}
            >
              HACKATHON 2026 &nbsp;✦&nbsp; AI AGENT WORKSPACE &nbsp;✦&nbsp; BUILD · CODE · SHIP &nbsp;✦&nbsp; SYSTEM ONLINE &nbsp;✦&nbsp; PHASE 3 ACTIVE &nbsp;✦&nbsp; NEURAL NODE CONNECTED &nbsp;✦&nbsp; RENDER ENGINE v3.1 &nbsp;✦&nbsp; ALL AGENTS ONLINE &nbsp;✦&nbsp; TEAM PROGRESS &nbsp;✦&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}