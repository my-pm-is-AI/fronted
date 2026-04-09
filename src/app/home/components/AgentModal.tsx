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
          {/* Backdrop — deep blur + vignette */}
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Center layout */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="relative flex items-stretch"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Left card (角色名片) ── */}
              <motion.div
                style={{
                  width: 220,
                  minHeight: 310,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(24,24,30,0.97)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px 20px 28px",
                  boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${agent.color}10`,
                  position: "relative",
                  zIndex: 1,
                  flexShrink: 0,
                }}
                initial={{ x: -60, opacity: 0, rotate: -6 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: -40, opacity: 0, rotate: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {/* Avatar — 大尺寸圆形头像 */}
                <div
                  style={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `3px solid ${agent.color}`,
                    boxShadow: `0 0 30px ${agent.color}40, 0 8px 24px rgba(0,0,0,0.4)`,
                    marginBottom: 20,
                  }}
                >
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>

                {/* Role badge — 胶囊形状 */}
                <span style={{
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "5px 16px",
                  fontSize: 9,
                  fontFamily: "'Archivo Black', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(255,255,255,0.04)",
                }}>
                  {agent.role}
                </span>

                {/* Sub-label */}
                <p style={{
                  marginTop: 10,
                  fontSize: 11,
                  fontFamily: "'Archivo Black', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.28)",
                }}>
                  {agent.subRole}
                </p>
              </motion.div>

              {/* ── Right card (详情面板) ── 深藏青/海军蓝 */}
              <motion.div
                style={{
                  width: 300,
                  minHeight: 310,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "linear-gradient(155deg, #1a2040 0%, #141830 50%, #10142a 100%)",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                  position: "relative",
                  zIndex: 2,
                  marginLeft: -24,
                  padding: "32px 28px 28px",
                  display: "flex",
                  flexDirection: "column",
                }}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.06 }}
              >
                {/* Close — 白色 X */}
                <button
                  onClick={onClose}
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    fontSize: 17,
                    lineHeight: 1,
                    borderRadius: "50%",
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                    e.currentTarget.style.background = "transparent";
                  }}
                  aria-label="关闭"
                >
                  ✕
                </button>

                {/* Title — 角色名（白色，优雅衬线感） */}
                <h2 style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 30,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {agent.role}
                </h2>

                {/* Sub-label */}
                <span style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: agent.color,
                  marginBottom: 22,
                  fontWeight: 700,
                }}>
                  {agent.subRole}
                </span>

                {/* Description — 白色无衬线 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  {agent.description.split("\n\n").map((p, i) => (
                    <p key={i} style={{
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.55)",
                      margin: 0,
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Deploy button — 白色胶囊型 */}
                <button style={{
                  marginTop: 24,
                  width: "100%",
                  borderRadius: 999,
                  border: "none",
                  background: "#ffffff",
                  padding: "12px 0",
                  fontSize: 14,
                  color: "#111",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: "0 4px 16px rgba(255,255,255,0.1)",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(255,255,255,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(255,255,255,0.1)";
                  }}
                >
                  部署 Agent
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
