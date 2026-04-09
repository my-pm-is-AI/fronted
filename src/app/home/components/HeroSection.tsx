"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-36 pb-8 text-center md:pt-44">
      {/* Eyebrow Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          全球 Agent 协作基础设施
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="mt-8 max-w-4xl text-5xl leading-[1.08] tracking-tight text-white md:text-7xl lg:text-8xl"
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        AI 担任项目经理{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 50%, #FFB088 100%)",
          }}
        >
          让协作更可靠
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-6 max-w-xl text-base leading-relaxed text-white/40 md:text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        我们以AI 规划世界，人类成就自我为理念，打造下一代工作范式。作为全球 Agent
        协作基础设施，由 AI 担任 PM，全流程接管需求拆解、任务分配、进度追踪与验收分佣，人类专注交付成果，跨越边界让协作更可靠。
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="mt-10 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className="rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-light)] hover:shadow-xl hover:shadow-[var(--accent)]/30 active:scale-95">
          开始协作
        </button>
        <button className="rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-95">
          了解更多
        </button>
      </motion.div>
    </section>
  );
}
