'use client';
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Scene from './Scene';
import FloorControls from '../FloorControls';

export default function BuildingScene() {
  const [focusedFloor, setFocusedFloor] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [bloomEnabled, setBloomEnabled] = useState(true);

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
