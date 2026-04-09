"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function GlitchText3D() {
  const groupRef = useRef<THREE.Group>(null);
  const words = ["DONT ASK ME", "ASK AGENT"];

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const textRows = useMemo(() => {
    const radius = 3.2;
    return words.map((word, rowIndex) => {
      const y = (rowIndex - (words.length - 1) / 2) * 0.55;
      const chars = word.split("");
      const totalAngle = (chars.length / 30) * Math.PI * 2;
      const startAngle = -totalAngle / 2;

      return chars.map((char, charIndex) => {
        const angle = startAngle + (charIndex / 30) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const rotY = -angle + Math.PI / 2;

        return (
          <Text
            key={`${rowIndex}-${charIndex}`}
            position={[x, y, z]}
            rotation={[0, rotY, 0]}
            fontSize={0.42}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
            fontWeight={700}
          >
            {char}
          </Text>
        );
      });
    });
  }, []);

  return <group ref={groupRef}>{textRows}</group>;
}

interface GlitchLoaderProps {
  onComplete: () => void;
}

export default function GlitchLoader({ onComplete }: GlitchLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = 3000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 600);
        }, 400);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Scanline overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
            <div
              className="absolute inset-x-0 h-[2px] bg-white"
              style={{ animation: "scanline 2s linear infinite" }}
            />
          </div>

          {/* 3D Canvas */}
          <div className="relative h-[300px] w-full max-w-[600px]">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1} />
              <Suspense fallback={null}>
                <GlitchText3D />
              </Suspense>
            </Canvas>
          </div>

          {/* Glitch title overlay */}
          <div className="relative mt-4 select-none">
            <h1
              className="text-center text-5xl font-black tracking-[-0.02em] text-white md:text-7xl"
              style={{ transform: "rotate(-3deg) skewX(-5deg)" }}
            >
              别问我，问Agent
            </h1>
            {/* Glitch clones */}
            <h1
              className="absolute inset-0 text-center text-5xl font-black tracking-[-0.02em] text-white opacity-70 md:text-7xl"
              style={{
                transform: "rotate(-3deg) skewX(-5deg)",
                animation: "glitch-1 0.3s infinite",
                color: "#F05A28",
                mixBlendMode: "multiply",
              }}
              aria-hidden
            >
              别问我，问CoAgent
            </h1>
            <h1
              className="absolute inset-0 text-center text-5xl font-black tracking-[-0.02em] text-white opacity-70 md:text-7xl"
              style={{
                transform: "rotate(-3deg) skewX(-5deg)",
                animation: "glitch-2 0.3s infinite",
                color: "#00FFFF",
                mixBlendMode: "multiply",
              }}
              aria-hidden
            >
              别问我，问Agent
            </h1>
          </div>

          {/* Progress */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="h-[1px] w-48 bg-white/10">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
            </div>
            <span className="font-mono text-sm tracking-[0.3em] text-white/50">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
