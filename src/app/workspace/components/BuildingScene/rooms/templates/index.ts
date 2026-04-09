/**
 * 房间样板库 — 统一索引
 *
 * 使用方式：
 *   import { ROOM_TEMPLATES, getRoomByProfession } from './rooms/templates';
 *   const RoomComponent = getRoomByProfession('前端开发');
 *
 * 职能 → 样板映射规则：
 *   DevRoom     : 前端/后端/全栈 开发工程师
 *   WorkshopRoom: 运维/DevOps/架构/测试/SRE
 *   LibraryRoom : 算法/数据/AI研究/NLP
 *   DesignRoom  : UI/UX/视觉/交互设计师
 *   MeetingRoom : 产品经理/项目经理/策划/运营
 */

import React from 'react';
import DevRoom      from './DevRoom';
import WorkshopRoom from './WorkshopRoom';
import LibraryRoom  from './LibraryRoom';
import DesignRoom   from './DesignRoom';
import MeetingRoom  from './MeetingRoom';

export { DevRoom, WorkshopRoom, LibraryRoom, DesignRoom, MeetingRoom };

export type RoomType = 'dev' | 'workshop' | 'library' | 'design' | 'meeting';

export const ROOM_TEMPLATES: Record<RoomType, {
  component: React.ComponentType<{ agents?: { hairColor?: string; shirtColor?: string; pantsColor?: string; skinColor?: string; name?: string }[]; agentName?: string }>;
  label: string;
  icon: string;
  color: string;
  keywords: string[];
}> = {
  dev: {
    component: DevRoom,
    label: '开发室',
    icon: '🖥️',
    color: '#5189fb',
    keywords: ['前端', '后端', '全栈', 'frontend', 'backend', 'fullstack', '开发', 'developer', 'engineer', 'python', 'react', 'node', 'java', 'go'],
  },
  workshop: {
    component: WorkshopRoom,
    label: '工坊',
    icon: '🔧',
    color: '#22c55e',
    keywords: ['运维', 'devops', '架构', '测试', 'sre', 'infra', 'ops', 'qa', 'ci/cd', 'docker', 'k8s'],
  },
  library: {
    component: LibraryRoom,
    label: '图书馆',
    icon: '📚',
    color: '#cc44aa',
    keywords: ['算法', '数据', 'ai', '研究', '机器学习', 'ml', 'nlp', 'data', 'algorithm', 'research', '科学家'],
  },
  design: {
    component: DesignRoom,
    label: '设计室',
    icon: '🎨',
    color: '#F05A28',
    keywords: ['设计', 'ui', 'ux', '视觉', '交互', 'designer', 'creative', 'figma', 'sketch'],
  },
  meeting: {
    component: MeetingRoom,
    label: '会议室',
    icon: '📋',
    color: '#aaccff',
    keywords: ['产品', '项目', '经理', '策划', '运营', 'pm', 'po', 'manager', 'product', 'operation'],
  },
};

export function getRoomTypeByProfession(profession: string): RoomType {
  const lower = profession.toLowerCase();
  for (const [type, meta] of Object.entries(ROOM_TEMPLATES) as [RoomType, typeof ROOM_TEMPLATES[RoomType]][]) {
    if (meta.keywords.some(k => lower.includes(k))) {
      return type;
    }
  }
  return 'dev';
}

export function getRoomByProfession(profession: string) {
  return ROOM_TEMPLATES[getRoomTypeByProfession(profession)].component;
}