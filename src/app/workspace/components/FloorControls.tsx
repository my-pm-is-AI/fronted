'use client';
import { FLOOR_THEMES } from './BuildingScene/lib/constants';

interface FloorControlsProps {
  focusedFloor: number | null;
  autoRotate: boolean;
  bloomEnabled: boolean;
  onFocusFloor: (i: number | null) => void;
  onToggleAutoRotate: () => void;
  onToggleBloom: () => void;
}

export default function FloorControls({
  focusedFloor,
  autoRotate,
  bloomEnabled,
  onFocusFloor,
  onToggleAutoRotate,
  onToggleBloom,
}: FloorControlsProps) {
  return (
    <div className='absolute inset-0 pointer-events-none flex flex-col justify-between p-4 select-none'>
      {/* Top: floor buttons */}
      <div className='flex items-center justify-end gap-2 pointer-events-auto'>
        {FLOOR_THEMES.map((theme, i) => (
          <button
            key={i}
            onClick={() => onFocusFloor(focusedFloor === i ? null : i)}
            className='text-xs px-3 py-1.5 rounded border transition-all duration-200'
            style={{
              background: focusedFloor === i ? '#F05A2820' : 'transparent',
              borderColor: focusedFloor === i ? '#F05A28' : '#2A2A2A',
              color: focusedFloor === i ? '#FF7A4A' : '#A0A0A0',
              boxShadow: focusedFloor === i ? '0 0 10px #F05A2866' : 'none',
              letterSpacing: '0.08em',
            }}
          >
            {theme.label}
          </button>
        ))}
        {focusedFloor !== null && (
          <button
            onClick={() => onFocusFloor(null)}
            className='text-xs px-3 py-1.5 rounded border transition-all duration-200'
            style={{ borderColor: '#2A2A2A', color: '#A0A0A0', background: 'transparent' }}
          >
            ← Overview
          </button>
        )}
      </div>

      {/* Bottom: controls */}
      <div className='flex items-center gap-2 pointer-events-auto'>
        <button
          onClick={onToggleAutoRotate}
          className='text-xs px-3 py-1.5 rounded border transition-all duration-200'
          style={{
            background: autoRotate ? '#F05A2818' : 'transparent',
            borderColor: autoRotate ? '#F05A28' : '#2A2A2A',
            color: autoRotate ? '#FF7A4A' : '#555555',
          }}
        >
          {autoRotate ? '⏸ Auto-Rotate' : '▶ Auto-Rotate'}
        </button>
        <button
          onClick={onToggleBloom}
          className='text-xs px-3 py-1.5 rounded border transition-all duration-200'
          style={{
            background: bloomEnabled ? '#F05A2818' : 'transparent',
            borderColor: bloomEnabled ? '#F05A28' : '#2A2A2A',
            color: bloomEnabled ? '#FF7A4A' : '#555555',
          }}
        >
          {bloomEnabled ? '✦ Bloom ON' : '○ Bloom OFF'}
        </button>
        {/* Floor dots */}
        <div className='ml-auto flex flex-col gap-1 items-end'>
          {FLOOR_THEMES.map((theme, i) => (
            <div
              key={i}
              className='flex items-center gap-2 cursor-pointer pointer-events-auto'
              onClick={() => onFocusFloor(focusedFloor === i ? null : i)}
            >
              <span style={{ color: '#555555', fontSize: '10px', letterSpacing: '0.1em' }}>
                {theme.label}
              </span>
              <div
                className='w-2 h-2 rounded-full transition-all duration-300'
                style={{
                  background: focusedFloor === i ? '#F05A28' : '#2A2A2A',
                  boxShadow: focusedFloor === i ? '0 0 6px #F05A28' : 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
