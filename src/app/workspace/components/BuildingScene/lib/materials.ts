import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { COLORS } from './constants';

const floorVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const floorFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3  uBaseColor;
  varying vec2  vUv;

  void main() {
    vec3 color = uBaseColor;
    float scan = sin(vUv.x * 18.0 - uTime * 1.8) * 0.5 + 0.5;
    scan = smoothstep(0.88, 1.0, scan) * 0.30;
    color += vec3(0.22, 0.42, 1.0) * scan;
    float edge = 1.0 - min(
      min(vUv.x, 1.0 - vUv.x),
      min(vUv.y, 1.0 - vUv.y)
    ) * 5.0;
    edge = clamp(edge, 0.0, 1.0);
    color += vec3(0.18, 0.38, 1.0) * edge * 0.55;
    float grid = step(0.97, fract(vUv.x * 8.0)) + step(0.97, fract(vUv.y * 8.0));
    color += vec3(0.12, 0.22, 0.6) * clamp(grid, 0.0, 1.0) * 0.25;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const FloorShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uBaseColor: new THREE.Color(COLORS.floorBase),
  },
  floorVertex,
  floorFragment
);

extend({ FloorShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    floorShaderMaterial: {
      uTime?: number;
      uBaseColor?: THREE.Color;
      ref?: React.Ref<InstanceType<typeof FloorShaderMaterial>>;
    };
  }
}

export type FloorShaderMaterialType = InstanceType<typeof FloorShaderMaterial>;
