"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface AgentCard {
  id: number;
  name: string;
  role: string;
  subRole: string;
  shortDescription: string;
  description: string;
  avatar: string;
  color: string;
}

const agents: AgentCard[] = [
  { id: 1, name: "Nova", role: "ORCHESTRATOR", subRole: "SWARM MANAGER", shortDescription: "管理整个群集", description: "管理日程、资源与任务优先级。\n\n确保项目按时推进，截止日期准时达成。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Nova&size=200", color: "#6366F1" },
  { id: 2, name: "Cipher", role: "ARCHITECT", subRole: "SYSTEM DESIGNER", shortDescription: "设计稳健系统", description: "设计稳健的系统架构与基础设施。\n\n构建支持长期增长的可扩展基础。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Cipher&size=200", color: "#10B981" },
  { id: 3, name: "Atlas", role: "CODER", subRole: "FULLSTACK ENGINEER", shortDescription: "编写生产代码", description: "编写整洁、可上线的全栈代码。\n\n将设计转化为功能完善、易维护的软件。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Atlas&size=200", color: "#F05A28" },
  { id: 4, name: "Echo", role: "PLANNER", subRole: "OPS AGENT", shortDescription: "优化工作流", description: "全流程接管需求拆解与任务分配。\n\n跨越语言、时区与信任边界，确保每次协作可靠达成。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Echo&size=200", color: "#EC4899" },
  { id: 5, name: "Spark", role: "COPYWRITER", subRole: "CONTENT CREATOR", shortDescription: "打磨品牌之声", description: "创作引人入胜的内容与技术文档。\n\n以清晰精准的方式传达复杂概念。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Spark&size=200", color: "#F59E0B" },
  { id: 6, name: "Nexus", role: "SENTRY", subRole: "SECURITY AGENT", shortDescription: "保护网络安全", description: "监控并保护网络免受入侵。\n\n维护安全协议与威胁检测系统。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Nexus&size=200", color: "#8B5CF6" },
  { id: 7, name: "Sage", role: "RESEARCHER", subRole: "DATA ANALYST", shortDescription: "发现深度洞察", description: "通过数据分析与探索发现深层洞察。\n\n提供可执行的情报以指导团队决策。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Sage&size=200", color: "#06B6D4" },
  { id: 8, name: "Blaze", role: "MARKETER", subRole: "GROWTH HACKER", shortDescription: "驱动用户增长", description: "通过战略营销活动驱动用户增长。\n\n优化触达渠道以最大化产品曝光。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Blaze&size=200", color: "#EF4444" },
  { id: 9, name: "Pixel", role: "DESIGNER", subRole: "UI/UX EXPERT", shortDescription: "创造视觉体验", description: "打造出色的用户界面与视觉体验。\n\n平衡美感与易用性以实现最优设计。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Pixel&size=200", color: "#14B8A6" },
  { id: 10, name: "Bolt", role: "DEPLOYER", subRole: "DEVOPS ENGINEER", shortDescription: "管理版本发布", description: "快速可靠地将功能发布到生产环境。\n\n管理发布周期与部署基础设施。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Bolt&size=200", color: "#F97316" },
  { id: 11, name: "Iris", role: "ANALYST", subRole: "METRICS EXPERT", shortDescription: "提取关键指标", description: "提取关键指标并将数据转化为洞察。\n\n构建仪表盘与报告以支持明智决策。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Iris&size=200", color: "#A855F7" },
  { id: 12, name: "Flux", role: "INTEGRATOR", subRole: "API SPECIALIST", shortDescription: "连接各项服务", description: "连接所有服务并确保数据顺畅流转。\n\n在不同系统与 API 之间搭建桥梁。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Flux&size=200", color: "#22D3EE" },
  { id: 13, name: "Vex", role: "DEBUGGER", subRole: "QA ENGINEER", shortDescription: "追踪程序漏洞", description: "追踪漏洞并解决复杂的运行时问题。\n\n进行根因分析以防止缺陷再次发生。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Vex&size=200", color: "#DC2626" },
  { id: 14, name: "Luna", role: "TESTER", subRole: "QUALITY ASSURANCE", shortDescription: "确保软件质量", description: "通过全面的测试套件确保软件质量。\n\n验证功能、性能与边界情况。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Luna&size=200", color: "#7C3AED" },
  { id: 15, name: "Orbit", role: "OPS", subRole: "INFRASTRUCTURE", shortDescription: "自动化 CI/CD", description: "自动化 CI/CD 流水线与基础设施管理。\n\n保持环境稳定、可复现且高效。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Orbit&size=200", color: "#0891B2" },
  { id: 16, name: "Zen", role: "REVIEWER", subRole: "CODE GUARDIAN", shortDescription: "守护代码质量", description: "通过严格的代码审查守护代码质量。\n\n执行最佳实践并维护编码规范。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Zen&size=200", color: "#059669" },
  { id: 17, name: "Rune", role: "DATA ENG", subRole: "PIPELINE BUILDER", shortDescription: "构建数据管道", description: "构建可靠的数据管道与 ETL 工作流。\n\n确保存储与处理层的数据完整性。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Rune&size=200", color: "#D97706" },
  { id: 18, name: "Nyx", role: "SECURITY", subRole: "COMPLIANCE", shortDescription: "执行安全合规", description: "锁定威胁并执行安全合规。\n\n进行漏洞评估与渗透测试。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Nyx&size=200", color: "#BE185D" },
  { id: 19, name: "Comet", role: "OPTIMIZER", subRole: "PERFORMANCE", shortDescription: "提升系统效率", description: "提升应用性能与资源效率。\n\n分析瓶颈并实施精准优化。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Comet&size=200", color: "#2563EB" },
  { id: 20, name: "Drift", role: "MONITOR", subRole: "OBSERVABILITY", shortDescription: "监控所有系统", description: "通过实时可观测工具监控所有系统。\n\n发现异常并确保服务持续在线。", avatar: "https://api.dicebear.com/9.x/pixel-art/png?seed=Drift&size=200", color: "#0D9488" },
];

const CARD_W = 120;
const CARD_H = 170;
const RADIUS = 260; // Size of the globe
const SPEED = 0.003; // Radians per frame

// Use Fibonacci sphere algorithm to distribute points evenly
function getSpherePoints(count: number) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push({ x, y, z });
  }
  return points;
}

interface FanCardsProps {
  onCardClick: (card: AgentCard) => void;
  paused?: boolean;
}

export default function FanCards({ onCardClick, paused = false }: FanCardsProps) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [rotation, setRotation] = useState(0);
  const pausedRef = useRef(false);
  const speedRef = useRef(SPEED);
  const rotationRef = useRef(0);

  const basePoints = useMemo(() => getSpherePoints(agents.length), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    let raf: number;
    const tick = () => {
      if (pausedRef.current) {
        speedRef.current *= 0.95;
      } else {
        speedRef.current += (SPEED - speedRef.current) * 0.05;
      }
      rotationRef.current += speedRef.current;
      setRotation(rotationRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  const tiltX = 15 * (Math.PI / 180); // Tilt earth axis by 15 degrees
  const cosTilt = Math.cos(tiltX);
  const sinTilt = Math.sin(tiltX);

  const cardsData = agents.map((agent, i) => {
    const p = basePoints[i];
    
    // Rotate around Y axis
    const cosY = Math.cos(rotation);
    const sinY = Math.sin(rotation);
    let x1 = p.x * cosY - p.z * sinY;
    let z1 = p.z * cosY + p.x * sinY;
    let y1 = p.y;

    // Tilt around X axis
    let y2 = y1 * cosTilt - z1 * sinTilt;
    let z2 = z1 * cosTilt + y1 * sinTilt;
    let x2 = x1;

    const scale = 0.6 + ((z2 + 1) / 2) * 0.4; // Scale 0.6 at back, 1.0 at front
    const opacity = z2 > -0.4 ? 1 : Math.max(0.1, 0.1 + ((z2 + 1) / 0.6) * 0.9); // Fade back elements
    const zIndex = Math.round((z2 + 1) * 100); // Higher zIndex for closer elements

    return {
      agent,
      x: Math.round(x2 * RADIUS * 10) / 10,
      y: Math.round(y2 * RADIUS * 10) / 10,
      z: z2,
      scale,
      opacity,
      zIndex,
    };
  });

  if (!mounted) return <div className="relative w-full h-full min-h-[500px]" />;

  return (
    <section className="relative w-full h-full min-h-[500px] flex items-center justify-center" style={{ overflow: "visible", perspective: "1200px" }}>
      {/* Globe Background Wireframe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          style={{ 
            position: "relative", 
            width: RADIUS * 2, 
            height: RADIUS * 2, 
            transformStyle: "preserve-3d",
            transform: `rotateX(15deg) rotateY(${(-rotation * 180) / Math.PI}deg)`
          }}
        >
          {/* Longitudes (Meridians) */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`long-${i}`}
              className="absolute inset-0 rounded-full"
              style={{ 
                border: "1px solid rgba(255,255,255,0.15)",
                transform: `rotateY(${(i * 180) / 12}deg)` 
              }}
            />
          ))}
          
          {/* Latitudes (Parallels) */}
          {Array.from({ length: 7 }).map((_, i) => {
            const latIdx = i - 3; // -3 to 3
            if (latIdx === 0) return null; // Skip equator
            const latAngle = (latIdx * Math.PI) / 8; // -67.5 to 67.5 degrees
            const r = Math.cos(latAngle) * RADIUS;
            const yOffset = Math.sin(latAngle) * RADIUS;
            return (
              <div
                key={`lat-${i}`}
                className="absolute rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  width: r * 2,
                  height: r * 2,
                  left: RADIUS - r,
                  top: RADIUS - r,
                  transform: `translateY(${yOffset}px) rotateX(90deg)`,
                }}
              />
            );
          })}
          {/* Equator */}
          <div
            className="absolute rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            style={{
              border: "1.5px solid rgba(255,255,255,0.25)",
              width: RADIUS * 2,
              height: RADIUS * 2,
              left: 0,
              top: 0,
              transform: `rotateX(90deg)`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: 0,
          height: 0,
        }}
      >
        <motion.div
          style={{ position: "relative", width: 0, height: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          {cardsData.map((data) => (
            <GlobeCard
              key={data.agent.id}
              data={data}
              onClick={() => onCardClick(data.agent)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function GlobeCard({ data, onClick }: { data: any, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const { agent, x, y, scale, opacity, zIndex, z } = data;
  
  // Only allow interactions for cards that are somewhat in the front half
  const isFront = z > -0.2;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: hovered ? 1000 : zIndex,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: opacity,
        pointerEvents: isFront ? "auto" : "none",
      }}
      onMouseEnter={() => isFront && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isFront && onClick()}
    >
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: 16,
          border: hovered ? `1px solid ${agent.color}60` : "1px solid rgba(255,255,255,0.06)",
          background: "rgba(28,28,34,0.92)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 12px",
          boxShadow: hovered
            ? `0 16px 40px ${agent.color}25, 0 0 0 1px ${agent.color}30`
            : "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.3s ease",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          filter: hovered ? "brightness(1.15)" : (z < -0.2 ? "brightness(0.5) blur(2px)" : "brightness(1)"),
          cursor: isFront ? "pointer" : "default",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 56,
            height: 56,
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${hovered ? agent.color : agent.color + "40"}`,
            boxShadow: hovered ? `0 0 18px ${agent.color}35` : "none",
            marginBottom: 10,
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <Image src={agent.avatar} alt={agent.name} fill className="object-cover" sizes="56px" />
        </div>
        <span style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", padding: "3px 8px", fontSize: 7.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}>
          {agent.role}
        </span>
        <p style={{ marginTop: 6, textAlign: "center", fontSize: 9.5, lineHeight: 1.4, color: "rgba(255,255,255,0.4)" }}>
          {agent.shortDescription}
        </p>
      </div>
    </div>
  );
}
