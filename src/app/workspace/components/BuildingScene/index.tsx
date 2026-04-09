'use client';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Scene from './Scene';
import FloorControls from '../FloorControls';

// 触发点击事件到外部全局
export const handleAgentClick = (agentName: string) => {
  window.dispatchEvent(new CustomEvent('AGENT_CLICKED', { detail: { agentName } }));
};

export default function BuildingScene() {
  const [focusedFloor, setFocusedFloor] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [members, setMembers] = useState<any[]>([]);

  // 动态获取成员数据以搭建楼层
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const projectIdStr = window.location.pathname.split('/').pop();
        const projectId = projectIdStr ? parseInt(projectIdStr, 10) : 1;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const res = await fetch(`${apiUrl}/api/v1/project/${projectId}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.members) {
            setMembers(data.data.members);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project members", err);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className='relative w-full h-full'>
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: '#0a0812' }}
      >
        <Suspense fallback={null}>
          <Scene
            focusedFloor={focusedFloor}
            autoRotate={autoRotate}
            bloomEnabled={bloomEnabled}
            members={members}
          />
        </Suspense>
      </Canvas>
      <FloorControls
        focusedFloor={focusedFloor}
        autoRotate={autoRotate}
        bloomEnabled={bloomEnabled}
        onFocusFloor={setFocusedFloor}
        onToggleAutoRotate={() => setAutoRotate(v => !v)}
        onToggleBloom={() => setBloomEnabled(v => !v)}
      />
    </div>
  );
}
