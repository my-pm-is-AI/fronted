'use client';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

interface PostProcessingProps {
  bloomEnabled: boolean;
}

export default function PostProcessing({ bloomEnabled }: PostProcessingProps) {
  return (
    <EffectComposer>
      <Bloom
        intensity={bloomEnabled ? 0.8 : 0}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.6}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />
    </EffectComposer>
  );
}
