// Room geometry constants
export const ROOM_SIZE = 8;
export const ROOM_HEIGHT = 4;
export const FLOOR_THICKNESS = 0.3;
export const WALL_THICKNESS = 0.2;
export const FLOOR_SPACING = ROOM_HEIGHT + FLOOR_THICKNESS; // 4.3
export const FLOOR_COUNT = 3;

export const COLORS = {
  background: '#0a0812',
  wallBack:      '#383358',
  wallSide:      '#2e2a50',
  wallBackLight: '#4a4570',
  floorBase:     '#0d0b22',
  ceilingBase:   '#2a2650',
  trimWhite:     '#e8e4ff',
  trimGlow:      '#9e99c1',
  neonBlue:   '#5189fb',
  neonPurple: '#7b2fe8',
  neonCyan:   '#4cc9f0',
  screenBlue: '#2860c8',
  screenGlow: '#5189fb',
  sofaDark: '#0d0c1e',
  sofaMid:  '#1a1730',
  woodDark: '#1a0f0a',
  woodMid:  '#2a1a10',
  paintingRed:   '#cc2a2a',
  paintingGreen: '#1a5c38',
  bookColors: ['#5189fb', '#7b2fe8', '#4cc9f0', '#e53e3e', '#f6ad55', '#68d391'],
  bedFrame:  '#0f0e1a',
  bedSheet:  '#1e2a4a',
  lampWarm:  '#ffcc66',
  lampGlow:  '#ff9900',
  monitorScreen: '#0a1a40',
  monitorGlow:   '#2860c8',
  deskSurface:   '#1a1430',
  chairColor:    '#130f28',
  baseColor:     '#0d0b1e',
} as const;

export const CAMERA_PRESETS = {
  overview: {
    position: [14, 16, 14] as [number, number, number],
    target:   [0, 5.5, 0] as [number, number, number],
  },
  // 从房间外侧前右角斜看，视线水平对准房间中心，能看到整个楼层
  floor: (i: number) => ({
    position: [4.5, FLOOR_SPACING * i + 0.6, 4.5] as [number, number, number],
    target:   [-0.5, FLOOR_SPACING * i + 1.5, -0.5] as [number, number, number],
  }),
};

export const FLOOR_THEMES = [
  { label: '1F · Office',  color: '#5189fb' },
  { label: '2F · Living',  color: '#7b2fe8' },
  { label: '3F · Bedroom', color: '#4cc9f0' },
];
