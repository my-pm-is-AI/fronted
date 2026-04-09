"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AgentModal from "./components/AgentModal";
import type { AgentCard } from "./components/FanCards";

const CarScene = dynamic(() => import("../car/page"), { ssr: false });

const INTRO_MS = 4500;

const SCROLL_LINES = [
  { text: "CO AGENT",     big: true  },
  { text: "人类再就业局",  big: false },
  { text: "DEPLOY NOW",   big: true  },
  { text: "COLLABORATE",  big: false },
  { text: "BUILD FAST",   big: true  },
  { text: "SHIP IT",      big: false },
  { text: "CO AGENT",     big: true  },
  { text: "人类再就业局",  big: false },
];

export default function HomePage() {
  const [loading,  setLoading]  = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<AgentCard | null>(null);
  const exitingRef = useRef(false);

  const triggerExit = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setProgress(100);
    // 让 AnimatePresence 退场动画跑完再隐藏
    setTimeout(() => setLoading(false), 900);
  };

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(((Date.now() - start) / INTRO_MS) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(id);
        triggerExit();
      }
    }, 40);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: "#000" }}>

      {/* ── Car Intro Overlay ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="car-intro"
            className="fixed inset-0 z-50 cursor-pointer overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(18px)" }}
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
            onClick={triggerExit}
          >
            {/* Three.js scene */}
            <div style={{ width: "100%", height: "100vh" }}>
              <CarScene />
            </div>

            {/* 3D Scrolling Text — sun center (infinite loop) */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                perspective: "480px",
                width: "580px",
                height: "340px",
                overflow: "hidden",
              }}
            >
              {/* duplicate lines so loop feels seamless */}
              <div
                className="animate-scroll-text"
                style={{
                  transformOrigin: "50% 100%",
                  textAlign: "center",
                  paddingTop: "20px",
                }}
              >
                {[...SCROLL_LINES, ...SCROLL_LINES].map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 900,
                      fontSize: line.big ? "52px" : "24px",
                      letterSpacing: line.big ? "0.28em" : "0.5em",
                      color: line.big ? "#f72585" : "#4cc9f0",
                      textShadow: line.big
                        ? "0 0 16px #f72585, 0 0 40px #b5179e"
                        : "0 0 10px #4cc9f0, 0 0 24px #7209b7",
                      marginBottom: line.big ? "26px" : "16px",
                      userSelect: "none",
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── HUD Loading Bar ── */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(6px)",
                borderTop: "1px solid rgba(240,90,40,0.25)",
                padding: "14px 24px 18px",
              }}
            >
              {/* top row: label + pct */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "13px", color: "#F05A28", letterSpacing: "0.3em" }}>
                  ▶ SYSTEM_BOOT
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "13px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.25em" }}>
                  CLICK TO SKIP ↵
                </span>
              </div>

              {/* segmented progress bar */}
              <div style={{ position: "relative", height: "10px", background: "rgba(240,90,40,0.08)", border: "1px solid rgba(240,90,40,0.35)" }}>
                {/* fill */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${progress}%`,
                    background: "#F05A28",
                    boxShadow: "0 0 10px #F05A28, 0 0 22px rgba(240,90,40,0.6)",
                    transition: "width 0.04s linear",
                  }}
                />
                {/* segment dividers (20 ticks) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: "repeating-linear-gradient(90deg, transparent 0%, transparent calc(5% - 1px), rgba(0,0,0,0.65) calc(5% - 1px), rgba(0,0,0,0.65) 5%)",
                  }}
                />
              </div>

              {/* bottom row: status messages + pct */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px" }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "13px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em" }}>
                  {progress < 30 ? "LOADING ASSETS..." : progress < 70 ? "COMPILING AGENTS..." : progress < 95 ? "ESTABLISHING CONN..." : "READY"}
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "14px", color: "#F05A28", letterSpacing: "0.15em", fontWeight: 700 }}>
                  {String(Math.round(progress)).padStart(3, "0")}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
      >
        <Navbar />
        <main className="relative flex flex-col items-center overflow-x-clip">
          <HeroSection onCardClick={setSelectedAgent} paused={selectedAgent !== null} />
        </main>
      </motion.div>

      {/* Modal */}
      <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}
