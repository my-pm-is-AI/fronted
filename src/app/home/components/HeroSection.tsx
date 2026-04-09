"use client";

import { motion } from "framer-motion";
import FanCards, { AgentCard } from "./FanCards";
import { navigate } from "next/dist/client/components/segment-cache/navigation";

interface HeroSectionProps {
  onCardClick: (card: AgentCard) => void;
  paused?: boolean;
}

export default function HeroSection({
  onCardClick,
  paused = false,
}: HeroSectionProps) {
  return (
    <section className="relative mx-auto flex w-full flex-col items-center justify-between gap-8 px-6 pt-4 pb-4 md:px-16 md:pt-8 lg:flex-row lg:px-24 min-h-[calc(100vh-80px)]">
      {/* Left Content */}
      <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            面向全球的 Agent&Human 协作基础设施
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="mt-6 max-w-5xl text-5xl leading-[1.15] tracking-tight text-white md:text-7xl lg:text-[5.5rem]"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          别问我，
          <br className="hidden md:block" />
          <span
            className="bg-clip-text"
            style={{
              color: "#ff5702ff",
            }}
          >
            问Agent！
          </span>
        </motion.h1>

        {/* Subtitle Container */}
        <motion.div
          className="mt-6 flex max-w-2xl flex-col gap-6 text-base leading-relaxed text-white/60 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-medium text-white/80 md:text-xl">
            以 AI 规划世界，人类成就自我为理念，打造下一代工作范式，让 Agent
            与人完美参与协作。
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
              <div className="flex items-center gap-2 text-white/90">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs text-[var(--accent)]">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="font-semibold text-[15px]">AI 驱动管理</span>
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed mt-1">
                不创造岗位，而是让每个人重新找到位置。全流程接管需求拆解与验收分佣，人类只需专注交付成果。
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
              <div className="flex items-center gap-2 text-white/90">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs text-[var(--accent)]">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </span>
                <span className="font-semibold text-[15px]">无界可靠协作</span>
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed mt-1">
                跨越语言、时区与信任边界，作为面向全球的基础设施，让任何人在任何地方都能发起可靠协作。
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => window.location.href = "/profile"}
            className="relative rounded-full bg-gradient-to-r from-[#ff5702] to-[#ff8c00] px-8 py-3.5 text-base font-bold text-white shadow-[0_0_20px_rgba(255,87,2,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,87,2,0.6)] active:scale-95"
          >
            开始协作
          </button>
          <button className="rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-95">
            了解更多
          </button>
        </motion.div>
      </div>

      {/* Right Graphic: Fan Animation */}
      <div className="relative flex w-full flex-1 items-center justify-center lg:h-[600px] lg:justify-end">
        <FanCards onCardClick={onCardClick} paused={paused} />
      </div>
    </section>
  );
}
