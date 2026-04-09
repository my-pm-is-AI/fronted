'use client';
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_PRESETS, COLORS } from './lib/constants';
import { orbitState } from './lib/orbitState';
import Building from './Building';
import PostProcessing from './PostProcessing';

interface SceneProps {
  focusedFloor: number | null;
  autoRotate: boolean;
  bloomEnabled: boolean;
  members: any[];
}

export default function Scene({ focusedFloor, autoRotate, bloomEnabled, members }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useEffect(() => {
    orbitState.controls = controlsRef.current;
    return () => { orbitState.controls = null; };
  }, []);

  useEffect(() => {
    const preset =
      focusedFloor !== null
        ? CAMERA_PRESETS.floor(focusedFloor)
        : CAMERA_PRESETS.overview;

    camera.position.set(...preset.position);
    if (controlsRef.current) {
      controlsRef.current.target.set(...preset.target);
      controlsRef.current.update();
    }
  }, [focusedFloor, camera]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={45} near={0.1} far={200} position={CAMERA_PRESETS.overview.position} />
      <OrbitControls
        makeDefault
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate && focusedFloor === null}
        autoRotateSpeed={0.5}
        enablePan={false}
        minDistance={6}
        maxDistance={55}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.05}
        target={new THREE.Vector3(...CAMERA_PRESETS.overview.target)}
      />
      <ambientLight color='#2a2555' intensity={1.2} />
      <directionalLight
        color='#c8d8ff'
        intensity={1.4}
        position={[-12, 22, -8]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={26}
        shadow-camera-bottom={-6}
      />
      <hemisphereLight args={['#334477', '#080610', 0.8]} />
      <pointLight color='#3355aa' intensity={2.5} distance={50} position={[0, 20, 0]} />
      <pointLight color='#2244aa' intensity={1.5} distance={40} position={[15, 8, 15]} />
      <pointLight color='#1a3388' intensity={1.2} distance={35} position={[-15, 8, -15]} />
      <pointLight color='#5577ee' intensity={2.5} distance={20} position={[0, 10, 0]} />
      <pointLight color='#4466cc' intensity={2} distance={12} position={[0, 2, 0]} />
      <pointLight color='#4466cc' intensity={2} distance={12} position={[0, 6.3, 0]} />
      <pointLight color='#4466cc' intensity={2} distance={12} position={[0, 10.6, 0]} />
      <pointLight color={COLORS.neonPurple} intensity={0.8} distance={20} position={[-8, 8, -8]} />
      <Stars radius={80} depth={60} count={2000} factor={3} fade speed={0.5} />
      <Building members={members} />
      <PostProcessing bloomEnabled={bloomEnabled} />
    </>
  );
}
