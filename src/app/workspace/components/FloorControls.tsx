'use client';
import { useState } from 'react';
import { FLOOR_THEMES } from './BuildingScene/lib/constants';

interface FloorControlsProps {
  focusedFloor: number | null;
  autoRotate: boolean;
  bloomEnabled: boolean;
  onFocusFloor: (i: number | null) => void;
  onToggleAutoRotate: () => void;
  onToggleBloom: () => void;
}

/**
 * BlogNow 风格按钮：
 * - 默认：暗色背景 + 细边框
 * - hover：上移 + 左移 + 硬偏移阴影放大
 * - active：归零（还原），shadow 消失
 * - active 激活态：橙色边框 + 橙色阴影
 */
function NeonButton({
  active, onClick, children,
}: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // blogNow 风格：硬偏移阴影
  const shadowColor = active ? '#F05A28' : 'rgba(255,255,255,0.25)';
  const shadow = pressed
    ? 'none'
    : hovered
    ? `6px 6px 0 ${shadowColor}`
    : active
    ? `3px 3px 0 ${shadowColor}`
    : 'none';

  const transform = pressed
    ? 'translate(0,0)'
    : hovered
    ? 'translate(-3px,-3px)'
    : 'translate(0,0)';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        fontSize: 11,
        padding: '5px 12px',
        border: `1px solid ${active ? '#F05A28' : hovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}`,
        background: active ? 'rgba(240,90,40,0.12)' : 'rgba(0,0,0,0.65)',
        color: active
          ? (hovered ? '#FFAA88' : '#FF7A4A')
          : (hovered ? '#000' : 'rgba(255,255,255,0.5)'),
        boxShadow: shadow,
        transform,
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, color 0.12s, border-color 0.12s',
        letterSpacing: '0.1em',
        borderRadius: 0,
        cursor: 'pointer',
        fontFamily: 'Space Mono, monospace',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {/* blogNow EssayCard 效果：白色从左往右填入 */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: active ? '#FF7A4A' : '#fff',
          transform: hovered && !pressed ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 0.25s ease-out',
          zIndex: 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}

export default function FloorControls({
  focusedFloor, autoRotate, bloomEnabled,
  onFocusFloor, onToggleAutoRotate, onToggleBloom,
}: FloorControlsProps) {
  return (
    <div className='absolute inset-0 pointer-events-none flex flex-col justify-between p-4 select-none'>

      {/* ── Top: floor buttons ── */}
      <div className='flex items-center justify-end gap-2 pointer-events-auto flex-wrap'>
        {FLOOR_THEMES.map((theme, i) => (
          <NeonButton
            key={i}
            active={focusedFloor === i}
            onClick={() => onFocusFloor(focusedFloor === i ? null : i)}
          >
            {theme.label}
          </NeonButton>
        ))}
        {focusedFloor !== null && (
          <NeonButton onClick={() => onFocusFloor(null)}>
            ← Overview
          </NeonButton>
        )}
      </div>

      {/* ── Bottom: controls ── */}
      <div className='flex items-center gap-2 pointer-events-auto'>
        <NeonButton active={autoRotate} onClick={onToggleAutoRotate}>
          {autoRotate ? '⏸ Auto-Rotate' : '▶ Auto-Rotate'}
        </NeonButton>
        <NeonButton active={bloomEnabled} onClick={onToggleBloom}>
          {bloomEnabled ? '✦ Bloom ON' : '○ Bloom OFF'}
        </NeonButton>

        {/* Floor indicator dots */}
        <div className='ml-auto flex flex-col gap-1 items-end'>
          {FLOOR_THEMES.map((theme, i) => {
            const isActive = focusedFloor === i;
            return (
              <FloorDot
                key={i}
                label={theme.label}
                active={isActive}
                onClick={() => onFocusFloor(isActive ? null : i)}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}

function FloorDot({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '3px 6px', cursor: 'pointer', pointerEvents: 'auto',
        transform: hovered ? 'translateX(-3px)' : 'translateX(0)',
        transition: 'transform 0.15s ease',
      }}
    >
      <span style={{
        color: active ? 'rgba(255,255,255,0.85)' : hovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.28)',
        fontSize: 10, letterSpacing: '0.12em',
        fontFamily: 'Space Mono, monospace',
        transition: 'color 0.15s',
      }}>
        {label}
      </span>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: active ? '#F05A28' : hovered ? '#888' : '#2a2a2a',
        boxShadow: active ? '0 0 8px #F05A28, 0 0 16px rgba(240,90,40,0.4)' : 'none',
        transform: hovered ? 'scale(1.4)' : 'scale(1)',
        transition: 'all 0.15s ease',
      }} />
    </div>
  );
}