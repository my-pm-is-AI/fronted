"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { AgentCard } from "./FanCards";

interface AgentModalProps {
  agent: AgentCard | null;
  onClose: () => void;
}

export default function AgentModal({ agent, onClose }: AgentModalProps) {
  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-2xl md:flex-row"
              style={{
                boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px ${agent.color}15`,
              }}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/50 transition-all hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L13 13M1 13L13 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Left: Avatar area */}
              <div className="flex flex-col items-center justify-center p-8 md:w-2/5">
                <div
                  className="relative h-28 w-28 overflow-hidden rounded-full border-2"
                  style={{
                    borderColor: agent.color,
                    boxShadow: `0 0 40px ${agent.color}30`,
                  }}
                >
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">
                  {agent.name}
                </h2>
                <span
                  className="mt-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    borderColor: `${agent.color}50`,
                    color: agent.color,
                    backgroundColor: `${agent.color}15`,
                  }}
                >
                  {agent.role}
                </span>
              </div>

              {/* Right: Details */}
              <div className="flex flex-1 flex-col justify-center border-t border-white/[0.06] p-8 md:border-l md:border-t-0">
                <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-white/30">
                  About this Agent
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {agent.description}
                </p>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-xs text-white/30">Accuracy</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      99.2%
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-xs text-white/30">Uptime</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      24/7
                    </p>
                  </div>
                </div>

                <button
                  className="mt-6 w-full rounded-full py-3 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    backgroundColor: agent.color,
                    boxShadow: `0 8px 25px ${agent.color}30`,
                  }}
                >
                  Deploy Agent
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
