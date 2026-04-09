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
  { id: 1, name: "Nova", role: "协调者", description: "管理日程、资源与任务优先级。\n\n确保项目按时推进，截止日期准时达成。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Nova&size=200", color: "#6366F1" },
  { id: 2, name: "Cipher", role: "架构师", description: "设计稳健的系统架构与基础设施。\n\n构建支持长期增长的可扩展基础。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Cipher&size=200", color: "#10B981" },
  { id: 3, name: "Atlas", role: "开发者", description: "编写整洁、可上线的全栈代码。\n\n将设计转化为功能完善、易维护的软件。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Atlas&size=200", color: "#F05A28" },
  { id: 4, name: "Echo", role: "规划师", description: "管理日程、资源与任务优先级。\n\n确保项目按时推进，截止日期准时达成。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Echo&size=200", color: "#EC4899" },
  { id: 5, name: "Spark", role: "写作者", description: "创作引人入胜的内容与技术文档。\n\n以清晰精准的方式传达复杂概念。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Spark&size=200", color: "#F59E0B" },
  { id: 6, name: "Nexus", role: "哨兵", description: "监控并保护网络免受入侵。\n\n维护安全协议与威胁检测系统。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Nexus&size=200", color: "#8B5CF6" },
  { id: 7, name: "Sage", role: "研究员", description: "通过数据分析与探索发现深层洞察。\n\n提供可执行的情报以指导团队决策。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Sage&size=200", color: "#06B6D4" },
  { id: 8, name: "Blaze", role: "营销师", description: "通过战略营销活动驱动用户增长。\n\n优化触达渠道以最大化产品曝光。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Blaze&size=200", color: "#EF4444" },
  { id: 9, name: "Pixel", role: "设计师", description: "打造出色的用户界面与视觉体验。\n\n平衡美感与易用性以实现最优设计。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Pixel&size=200", color: "#14B8A6" },
  { id: 10, name: "Bolt", role: "部署者", description: "快速可靠地将功能发布到生产环境。\n\n管理发布周期与部署基础设施。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Bolt&size=200", color: "#F97316" },
  { id: 11, name: "Iris", role: "分析师", description: "提取关键指标并将数据转化为洞察。\n\n构建仪表盘与报告以支持明智决策。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Iris&size=200", color: "#A855F7" },
  { id: 12, name: "Flux", role: "集成者", description: "连接所有服务并确保数据顺畅流转。\n\n在不同系统与 API 之间搭建桥梁。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Flux&size=200", color: "#22D3EE" },
  { id: 13, name: "Vex", role: "调试者", description: "追踪漏洞并解决复杂的运行时问题。\n\n进行根因分析以防止缺陷再次发生。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Vex&size=200", color: "#DC2626" },
  { id: 14, name: "Luna", role: "测试员", description: "通过全面的测试套件确保软件质量。\n\n验证功能、性能与边界情况。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Luna&size=200", color: "#7C3AED" },
  { id: 15, name: "Orbit", role: "运维", description: "自动化 CI/CD 流水线与基础设施管理。\n\n保持环境稳定、可复现且高效。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Orbit&size=200", color: "#0891B2" },
  { id: 16, name: "Zen", role: "审查者", description: "通过严格的代码审查守护代码质量。\n\n执行最佳实践并维护编码规范。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Zen&size=200", color: "#059669" },
  { id: 17, name: "Rune", role: "数据工程", description: "构建可靠的数据管道与 ETL 工作流。\n\n确保存储与处理层的数据完整性。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Rune&size=200", color: "#D97706" },
  { id: 18, name: "Nyx", role: "安全", description: "锁定威胁并执行安全合规。\n\n进行漏洞评估与渗透测试。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Nyx&size=200", color: "#BE185D" },
  { id: 19, name: "Comet", role: "优化者", description: "提升应用性能与资源效率。\n\n分析瓶颈并实施精准优化。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Comet&size=200", color: "#2563EB" },
  { id: 20, name: "Drift", role: "监控者", description: "通过实时可观测工具监控所有系统。\n\n发现异常并确保服务持续在线。", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=Drift&size=200", color: "#0D9488" },
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
const MAX_ANGLE = 90;        // ±90° = semicircle
const SPEED = 0.04;          // degrees per animation frame

interface FanCardsProps {
  onCardClick: (card: AgentCard) => void;
  paused?: boolean;
}

export default function FanCards({ onCardClick, paused = false }: FanCardsProps) {
  const [ready, setReady] = useState(false);
  const angRef = useRef(0);
  const pausedRef = useRef(false);
  const speedRef = useRef(SPEED);
  const [ang, setAng] = useState(0);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

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
  agent, angle, opacity, zIndex, onClick,
}: {
  agent: AgentCard;
  angle: number;
  opacity: number;
  zIndex: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: PANEL_H / 2 - CARD_H / 2 - 20,
        marginLeft: -CARD_W / 2,
        width: CARD_W,
        height: CARD_H,
        zIndex: hovered ? 50 : zIndex,
        opacity: hovered ? 1 : opacity,
        transform: `rotate(${angle}deg)${hovered ? " scale(1.06)" : ""}`,
        transformOrigin: `center ${CARD_H + PIVOT_DISTANCE}px`,
        pointerEvents: opacity < 0.2 ? "none" : "auto",
        transition: "opacity 0.3s ease, filter 0.3s ease",
        willChange: "transform, opacity",
        cursor: "pointer",
        filter: hovered ? "brightness(1.15)" : "brightness(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
