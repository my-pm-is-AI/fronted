"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface AgentCard {
  id: number;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
}

const agents: AgentCard[] = [
  { id: 1, name: "Nova", role: "ORCHESTRATOR", description: "Manages the swarm.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Nova&size=200", color: "#6366F1" },
  { id: 2, name: "Cipher", role: "ARCHITECT", description: "Designs robust systems.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Cipher&size=200", color: "#10B981" },
  { id: 3, name: "Atlas", role: "CODER", description: "Writes production code.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Atlas&size=200", color: "#F05A28" },
  { id: 4, name: "Echo", role: "PLANNER", description: "Optimizes workflow.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Echo&size=200", color: "#EC4899" },
  { id: 5, name: "Spark", role: "WRITER", description: "Crafts content.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Spark&size=200", color: "#F59E0B" },
  { id: 6, name: "Nexus", role: "SENTRY", description: "Protects the network.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Nexus&size=200", color: "#8B5CF6" },
  { id: 7, name: "Sage", role: "RESEARCHER", description: "Finds deep insights.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Sage&size=200", color: "#06B6D4" },
  { id: 8, name: "Blaze", role: "MARKETER", description: "Drives engagement.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Blaze&size=200", color: "#EF4444" },
  { id: 9, name: "Pixel", role: "DESIGNER", description: "Creates stunning UI.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Pixel&size=200", color: "#14B8A6" },
  { id: 10, name: "Bolt", role: "DEPLOYER", description: "Ships to production.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Bolt&size=200", color: "#F97316" },
  { id: 11, name: "Iris", role: "ANALYST", description: "Extracts key metrics.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Iris&size=200", color: "#A855F7" },
  { id: 12, name: "Flux", role: "INTEGRATOR", description: "Connects all services.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Flux&size=200", color: "#22D3EE" },
  { id: 13, name: "Vex", role: "DEBUGGER", description: "Hunts down bugs.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Vex&size=200", color: "#DC2626" },
  { id: 14, name: "Luna", role: "TESTER", description: "Ensures quality.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Luna&size=200", color: "#7C3AED" },
  { id: 15, name: "Orbit", role: "DEVOPS", description: "Automates pipelines.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Orbit&size=200", color: "#0891B2" },
  { id: 16, name: "Zen", role: "REVIEWER", description: "Guards code quality.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Zen&size=200", color: "#059669" },
  { id: 17, name: "Rune", role: "DATA ENG", description: "Builds data pipelines.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Rune&size=200", color: "#D97706" },
  { id: 18, name: "Nyx", role: "SECURITY", description: "Locks down threats.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Nyx&size=200", color: "#BE185D" },
  { id: 19, name: "Comet", role: "OPTIMIZER", description: "Boosts performance.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Comet&size=200", color: "#2563EB" },
  { id: 20, name: "Drift", role: "MONITOR", description: "Watches all systems.", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Drift&size=200", color: "#0D9488" },
];

/*
 * True fan/playing-card layout:
 * - All cards sit at the SAME position (center of container)
 * - Each card only has a different CSS `rotate` angle
 * - transformOrigin is set far below the card ("center 900px")
 *   so rotation naturally fans cards out like a hand of cards
 * - Carousel: continuously shift which card angle is 0° (center)
 * - Only front-facing cards (within ±MAX_ANGLE) are visible
 */

const CARD_W = 190;
const CARD_H = 260;
const PANEL_W = 700;
const PANEL_H = 400;

const PIVOT_DISTANCE = 900;  // how far below the card the rotation pivot is
const MAX_ANGLE = 160;       // half-arc of visible fan in degrees
const SPEED = 0.04;          // degrees per animation frame

interface FanCardsProps {
  onCardClick: (card: AgentCard) => void;
}

export default function FanCards({ onCardClick }: FanCardsProps) {
  const [ready, setReady] = useState(false);
  const angRef = useRef(0);
  const pausedRef = useRef(false);
  const speedRef = useRef(SPEED);
  const [ang, setAng] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (pausedRef.current) {
        speedRef.current *= 0.92;
      } else {
        speedRef.current += (SPEED - speedRef.current) * 0.05;
      }
      angRef.current += speedRef.current;
      setAng(angRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const count = agents.length;
  const step = 360 / count;

  // Compute each card's rotation angle
  const cardData = agents.map((agent, i) => {
    let circAngle = (step * i + ang) % 360;
    if (circAngle > 180) circAngle -= 360;
    // circAngle: -180..180, 0 = front/center

    const absAngle = Math.abs(circAngle);
    const visible = absAngle <= MAX_ANGLE;

    // Opacity: fade only at the very edges
    let opacity = 0;
    if (visible) {
      const norm = absAngle / MAX_ANGLE; // 0=center, 1=edge
      opacity = norm > 0.9 ? 1 - (norm - 0.9) / 0.1 : 1;
    }

    return { agent, angle: circAngle, absAngle, visible, opacity };
  });

  // Only show visible cards, sort back-to-front (edges first, center last)
  const visibleCards = cardData.filter((d) => d.visible && d.opacity > 0);
  const sorted = visibleCards.sort((a, b) => b.absAngle - a.absAngle);

  const containerH = PANEL_H + 200;

  return (
    <section className="relative" style={{ overflow: "visible" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1200,
          height: containerH,
          margin: "0 auto",
          overflow: "visible",
        }}
      >
        <motion.div
          style={{ position: "relative", width: "100%", height: "100%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          {/* Glass panel */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 0,
              width: PANEL_W,
              height: PANEL_H,
              zIndex: 1,
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(22,22,24,0.75)",
              backdropFilter: "blur(24px)",
              pointerEvents: "none",
            }}
          />

          {/* Trusted by */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: PANEL_H - 70,
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              pointerEvents: "none",
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)" }}>
              Trusted by
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              {["Walmart", "Swiggy", "Netlify", "BBVA", "Atlassian"].map((b) => (
                <span key={b} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "rgba(255,255,255,0.25)" }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* All cards at the SAME position, only rotate differs */}
          {sorted.map(({ agent, angle, absAngle, opacity }) => {
            const zIndex = Math.round(20 - (absAngle / MAX_ANGLE) * 18);

            return (
              <FanCard
                key={agent.id}
                agent={agent}
                angle={angle}
                opacity={opacity}
                zIndex={zIndex}
                onHover={(h) => { pausedRef.current = h; }}
                onClick={() => onCardClick(agent)}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---- Single fan card ---- */
function FanCard({
  agent, angle, opacity, zIndex, onHover, onClick,
}: {
  agent: AgentCard;
  angle: number;
  opacity: number;
  zIndex: number;
  onHover: (h: boolean) => void;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        /* All cards placed at exact same position: horizontally centered, vertically in panel */
        left: "50%",
        top: PANEL_H / 2 - CARD_H / 2 - 20,
        marginLeft: -CARD_W / 2,
        width: CARD_W,
        height: CARD_H,
        zIndex: hovered ? 50 : zIndex,
        opacity: hovered ? 1 : opacity,
        /* THE KEY: only rotate differs per card. 
           transformOrigin far below creates the natural fan spread. */
        transform: `rotate(${angle}deg)${hovered ? " scale(1.06)" : ""}`,
        transformOrigin: `center ${CARD_H + PIVOT_DISTANCE}px`,
        pointerEvents: opacity < 0.2 ? "none" : "auto",
        transition: "opacity 0.3s ease, filter 0.3s ease",
        willChange: "transform, opacity",
        cursor: "pointer",
        filter: hovered ? "brightness(1.15)" : "brightness(1)",
      }}
      onMouseEnter={() => { setHovered(true); onHover(true); }}
      onMouseLeave={() => { setHovered(false); onHover(false); }}
      onClick={onClick}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          border: hovered ? `1px solid ${agent.color}40` : "1px solid rgba(255,255,255,0.06)",
          background: "rgba(28,28,34,0.92)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 16px",
          boxShadow: hovered
            ? `0 16px 40px ${agent.color}25, 0 0 0 1px ${agent.color}20`
            : "0 4px 20px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.3s, border-color 0.3s",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 76,
            height: 76,
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${hovered ? agent.color : agent.color + "40"}`,
            boxShadow: hovered ? `0 0 18px ${agent.color}35` : "none",
            marginBottom: 12,
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <Image src={agent.avatar} alt={agent.name} fill className="object-cover" sizes="76px" />
        </div>
        <span style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", padding: "3px 10px", fontSize: 7.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)" }}>
          {agent.role}
        </span>
        <p style={{ marginTop: 8, textAlign: "center", fontSize: 10, lineHeight: 1.5, color: "rgba(255,255,255,0.3)" }}>
          {agent.description}
        </p>
      </div>
    </div>
  );
}
