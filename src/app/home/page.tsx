"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AgentModal from "./components/AgentModal";
import type { AgentCard } from "./components/FanCards";

const GlitchLoader = dynamic(() => import("./components/GlitchLoader"), {
  ssr: false,
});

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AgentCard | null>(null);

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: "#000" }}>
      {/* 3D Glitch Loading Screen */}
      {loading && <GlitchLoader onComplete={handleLoadComplete} />}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Navbar />

        <main className="relative flex flex-col items-center overflow-x-clip">
          {/* Ambient glow — removed for pure black */}

          <HeroSection onCardClick={setSelectedAgent} paused={selectedAgent !== null} />
        </main>
      </motion.div>

      {/* Modal */}
      <AgentModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  );
}
