'use client';

interface Phase {
  id: number;
  label: string;
  status: 'done' | 'active' | 'pending';
  detail?: string;
}

const PHASES: Phase[] = [
  { id: 1, label: '布局骨架', status: 'done',    detail: 'COMPLETE' },
  { id: 2, label: '3D 建筑迁移', status: 'done',    detail: 'COMPLETE' },
  { id: 3, label: 'Agent 对话', status: 'active',  detail: 'RUNNING · 60%' },
  { id: 4, label: '团队进度面板', status: 'pending', detail: 'QUEUED' },
  { id: 5, label: '动效打磨',   status: 'pending', detail: 'QUEUED' },
];

const STATUS: Record<string, { bar: string; text: string }> = {
  done:    { bar: '#22c55e', text: '#22c55e' },
  active:  { bar: '#F05A28', text: '#F05A28' },
  pending: { bar: 'rgba(255,255,255,0.12)', text: 'rgba(255,255,255,0.25)' },
};

export default function ProjectStatus() {
  return (
    <div style={{ borderTop: '2px solid #000', background: '#F7F6F3' }}>
      {/* Header */}
      <div
        className='flex items-center gap-3 px-4 py-2'
        style={{ borderBottom: '2px solid #000' }}
      >
        <div style={{ width: 3, height: 14, background: '#000' }} />
        <p className='font-display text-black' style={{ fontSize: 11, letterSpacing: '-0.02em' }}>
          PROJECT_STATUS
        </p>
      </div>

      {/* Phase list */}
      <div className='px-3 py-2 space-y-1'>
        {PHASES.map(phase => {
          const cfg = STATUS[phase.status];
          const isActive = phase.status === 'active';
          const isDone = phase.status === 'done';
          return (
            <div
              key={phase.id}
              className='flex items-center gap-3 px-3 py-2 cursor-default transition-all duration-150 group'
              style={{
                background: isActive ? '#000' : '#fff',
                border: `2px solid ${isActive ? '#000' : '#e5e5e5'}`,
                boxShadow: isActive ? '3px 3px 0 #F05A28' : 'none',
              }}
            >
              {/* Outline number */}
              <span
                className='font-display shrink-0'
                style={{
                  fontSize: 20,
                  lineHeight: 1,
                  color: isActive ? '#fff' : 'transparent',
                  WebkitTextStroke: isActive ? 'none' : `1px ${isDone ? '#22c55e' : 'rgba(0,0,0,0.2)'}`,
                  letterSpacing: '-0.04em',
                  minWidth: 20,
                }}
              >
                {String(phase.id).padStart(2, '0')}
              </span>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <p
                  className='font-display truncate'
                  style={{
                    fontSize: 11,
                    color: isActive ? '#fff' : phase.status === 'pending' ? 'rgba(0,0,0,0.25)' : '#000',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {phase.label}
                </p>
                <p
                  className='font-mono-brand text-[9px] mt-0.5'
                  style={{ color: isActive ? '#F05A28' : cfg.text, letterSpacing: '0.12em' }}
                >
                  {phase.detail}
                </p>
              </div>

              {/* Right: progress bar */}
              <div className='shrink-0 flex flex-col items-end gap-1'>
                <div style={{ width: 28, height: 2, background: isActive ? 'rgba(255,255,255,0.15)' : '#e5e5e5' }}>
                  <div style={{
                    height: '100%',
                    background: isActive ? '#F05A28' : cfg.bar,
                    width: phase.status === 'done' ? '100%' : phase.status === 'active' ? '60%' : '0%',
                  }} />
                </div>
                {isActive && <span className='pixel-blink' style={{ color: '#F05A28', fontSize: 7 }}>●</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}