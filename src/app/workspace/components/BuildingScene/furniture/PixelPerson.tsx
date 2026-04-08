'use client';
import { useRef, useState } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface PixelPersonProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
  phaseOffset?: number;
  scale?: number;
}

export default function PixelPerson({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  hairColor  = '#1a0f00',
  shirtColor = '#5189fb',
  pantsColor = '#1a1a2e',
  skinColor  = '#f5cba7',
  phaseOffset = 0,
  scale = 1.85,
}: PixelPersonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [facingCamera, setFacingCamera] = useState(false);
  const targetRotY = useRef(rotation[1]);

  // 点击：朝向相机
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const dx = camera.position.x - position[0];
    const dz = camera.position.z - position[2];
    targetRotY.current = Math.atan2(dx, dz);
    setFacingCamera(true);
  };

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Y 轴旋转：已朝向相机时平滑插值，否则轻微摇摆
    if (facingCamera) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY.current,
        0.08
      );
    } else {
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.7 + phaseOffset) * 0.08;
    }

    // 漂浮
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + phaseOffset) * 0.04;
  });

  const W = 0.28 * scale;
  const D = 0.20 * scale;

  const pantsH = 0.26 * scale;
  const shirtH = 0.30 * scale;
  const headH  = 0.26 * scale;
  const hairH  = 0.09 * scale;

  const pantsY = pantsH / 2;
  const shirtY = pantsH + shirtH / 2;
  const headY  = pantsH + shirtH + headH / 2;
  const hairY  = pantsH + shirtH + headH + hairH / 2;

  const eyeY   = headY + headH * 0.08;
  const eyeZ   = D / 2 + 0.01 * scale;
  const eyeSize = 0.055 * scale;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      // 鼠标悬停时改变光标
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={()  => { document.body.style.cursor = 'auto'; }}
    >
      {/* 裤子 */}
      <mesh position={[0, pantsY, 0]} castShadow>
        <boxGeometry args={[W * 0.85, pantsH, D * 0.85]} />
        <meshStandardMaterial color={pantsColor} roughness={0.9} />
      </mesh>

      {/* 衬衫/身体 */}
      <mesh position={[0, shirtY, 0]} castShadow>
        <boxGeometry args={[W * 1.05, shirtH, D]} />
        <meshStandardMaterial color={shirtColor} emissive={shirtColor} emissiveIntensity={0.25} roughness={0.8} />
      </mesh>

      {/* 头 */}
      <mesh position={[0, headY, 0]} castShadow>
        <boxGeometry args={[W, headH, D]} />
        <meshStandardMaterial color={skinColor} roughness={0.95} />
      </mesh>

      {/* 眼睛左 */}
      <mesh position={[-W * 0.22, eyeY, eyeZ]}>
        <boxGeometry args={[eyeSize, eyeSize, 0.01 * scale]} />
        <meshStandardMaterial color='#111111' roughness={1} />
      </mesh>

      {/* 眼睛右 */}
      <mesh position={[W * 0.22, eyeY, eyeZ]}>
        <boxGeometry args={[eyeSize, eyeSize, 0.01 * scale]} />
        <meshStandardMaterial color='#111111' roughness={1} />
      </mesh>

      {/* 头发 */}
      <mesh position={[0, hairY, 0]} castShadow>
        <boxGeometry args={[W * 1.08, hairH, D * 1.08]} />
        <meshStandardMaterial color={hairColor} roughness={1} />
      </mesh>

      {/* 点击高亮圈（朝向相机时显示） */}
      {facingCamera && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[W * 0.9, W * 1.2, 16]} />
          <meshStandardMaterial color={shirtColor} emissive={shirtColor} emissiveIntensity={1.5} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}