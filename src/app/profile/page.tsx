"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const FaultyTerminalBackground = dynamic(
  () => import("@/components/FaultyTerminalBackground"),
  { ssr: false },
);

// ─── Split Login Screen ───────────────────────────────────
function BootLoginScreen({
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  onLogin,
  loading,
  error,
}: {
  loginUsername: string;
  setLoginUsername: (v: string) => void;
  loginPassword?: string;
  setLoginPassword?: (v: string) => void;
  onLogin: () => void;
  loading: boolean;
  error?: string;
}) {
  // granted 是登录成功后由父级触发的，但这里我们用一个内部 prop 来驱动
  // 实际上父级 handleLogin 成功后才 setIsLoggedIn(true)，我们需要在这里展示过渡动画
  // 所以在 onLogin wrap 一层：点击→显示 ACCESS GRANTED→再切换
  const [granted, setGranted] = useState(false);

  const handleClick = async () => {
    if (!loginUsername.trim() || loading) return;
    setGranted(true); // 先弹出大字
    await new Promise((r) => setTimeout(r, 1400)); // 等动画
    onLogin(); // 再触发真正登录
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* ── Left: Login Form ── */}
      <div
        style={{
          width: "38%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#000",
          position: "relative",
          zIndex: 2,
          borderRight: "1px solid rgba(255,100,0,0.45)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 340,
            margin: "0 auto",
            padding: "0 40px",
          }}
        >
          {/* Logo区 */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div style={{ width: 4, height: 32, background: "#F05A28" }} />
              <span
                style={{
                  fontFamily: "Archivo Black, sans-serif",
                  fontSize: 32,
                  letterSpacing: "-0.05em",
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                <span style={{ color: "#F05A28" }}>CO </span>AGENT
              </span>
            </div>
            <p
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.2em",
                marginLeft: 14,
              }}
            >
              KINETIC ENGINE v1.0
            </p>
          </div>

          {/* 表单 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {error && (
              <div style={{ padding: "12px", border: "1px solid #ef4444", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", fontSize: 15, fontFamily: "Space Mono, monospace" }}>
                ERROR: {error}
              </div>
            )}
            <div>
              <div
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.22em",
                  marginBottom: 8,
                }}
              >
                USERNAME
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#0d0d0d",
                  border: "2px solid rgba(255,90,40,0.35)",
                  transition: "border-color 0.2s",
                }}
              >
                <span
                  style={{
                    padding: "13px 14px",
                    fontFamily: "Space Mono, monospace",
                    fontSize: 17,
                    color: "#F05A28",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  &gt;
                </span>
                <input
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleClick()}
                  placeholder="your_username"
                  autoFocus
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "Space Mono, monospace",
                    fontSize: 17,
                    color: "#fff",
                    padding: "13px 12px 13px 0",
                    caretColor: "#F05A28",
                  }}
                />
              </div>
            </div>

            {setLoginPassword && (
              <div>
                <div
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.22em",
                    marginBottom: 8,
                  }}
                >
                  PASSWORD
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#0d0d0d",
                    border: "2px solid rgba(255,90,40,0.35)",
                    transition: "border-color 0.2s",
                  }}
                >
                  <span
                    style={{
                      padding: "13px 14px",
                      fontFamily: "Space Mono, monospace",
                      fontSize: 17,
                      color: "#F05A28",
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    *
                  </span>
                  <input
                    type="password"
                    value={loginPassword || ""}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleClick()}
                    placeholder="your_password"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "Space Mono, monospace",
                      fontSize: 17,
                      color: "#fff",
                      padding: "13px 12px 13px 0",
                      caretColor: "#F05A28",
                    }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleClick}
              disabled={!loginUsername.trim() || loading || granted}
              style={{
                padding: "14px",
                background:
                  loginUsername.trim() && !loading && !granted
                    ? "#F05A28"
                    : "#111",
                border: `2px solid ${loginUsername.trim() && !loading && !granted ? "#F05A28" : "rgba(255,90,40,0.2)"}`,
                color:
                  loginUsername.trim() && !loading && !granted
                    ? "#000"
                    : "rgba(255,90,40,0.35)",
                fontFamily: "Archivo Black, sans-serif",
                fontSize: 16,
                letterSpacing: "0.15em",
                cursor:
                  loginUsername.trim() && !loading && !granted
                    ? "pointer"
                    : "not-allowed",
                transition: "all 0.15s",
                borderRadius: 0,
                boxShadow:
                  loginUsername.trim() && !loading && !granted
                    ? "4px 4px 0 rgba(240,90,40,0.4)"
                    : "none",
              }}
            >
              {loading
                ? "CONNECTING..."
                : granted
                  ? "ACCESS GRANTED ✓"
                  : "▶ LOGIN"}
            </button>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 48,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.15)",
                letterSpacing: "0.18em",
              }}
            >
              COAGENT · ALL RIGHTS RESERVED
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: WebGL 点阵 + ACCESS GRANTED ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background: "#000",
          overflow: "hidden",
        }}
      >
        {/* 点阵背景 */}
        <FaultyTerminalBackground
          scale={2.5}
          scanlineIntensity={0.8}
          glitchAmount={1.2}
          tint="#FF6600"
          mouseReact={false}
          brightness={0.8}
          style={{ position: "absolute", inset: 0, opacity: 0.85 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            zIndex: -1,
          }}
        />

        {/* ACCESS GRANTED — 登录成功后弹出 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 10%",
            zIndex: 2,
            opacity: 1,
            transform: granted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 48,
              height: 2,
              background: "#F05A28",
              marginBottom: 24,
            }}
          />
          <div
            style={{
              fontFamily: "Archivo Black, sans-serif",
              fontSize: "clamp(3.5rem, 9vw, 9rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.88,
              color: "#F05A28",
              textShadow: granted ? "0 0 40px rgba(255,100,0,0.7), 0 0 100px rgba(255,100,0,0.35)" : "none",
            }}
          >
            {granted ? "ACCESS" : "SYSTEM"}
          </div>
          <div
            style={{
              fontFamily: "Archivo Black, sans-serif",
              fontSize: "clamp(3.5rem, 9vw, 9rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.88,
              color: "#fff",
            }}
          >
            {granted ? "GRANTED" : "LOCKED"}
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: "Space Mono, monospace",
              fontSize: 13,
              color: "#F05A28",
              letterSpacing: "0.3em",
            }}
          >
            {granted ? "WELCOME TO THE AGENT ENVIRONMENT" : "AWAITING AUTHORIZATION PROTOCOL"}
          </div>
          <div
            style={{
              marginTop: 14,
              borderLeft: "2px solid #F05A28",
              paddingLeft: 14,
            }}
          >
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.18em",
              }}
            >
              {granted ? "SYSTEM NOMINAL · ALL MODULES ACTIVE" : "RESTRICTED AREA · IDENTIFY YOURSELF"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pixel Robot ─────────────────────────────────────────
function PixelRobot({
  size = 64,
  color = "#F05A28",
}: {
  size?: number;
  color?: string;
}) {
  const grid = [
    [0, 1, 1, 1, 1, 0],
    [1, 2, 1, 1, 2, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 1, 3, 3, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1],
  ];
  const colors: Record<number, string> = {
    0: "transparent",
    1: color,
    2: "#fff",
    3: "#7b2fe8",
  };
  const cellSize = size / 6;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(6, ${cellSize}px)`,
        gridTemplateRows: `repeat(7, ${cellSize}px)`,
      }}
    >
      {grid.flat().map((v, i) => (
        <div
          key={i}
          style={{ width: cellSize, height: cellSize, background: colors[v] }}
        />
      ))}
    </div>
  );
}

// ─── OrangeButton ─────────────────────────────────────────
function OrangeButton({
  children,
  onClick,
  disabled,
  fullWidth,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        width: fullWidth ? "100%" : undefined,
        padding: "14px 32px",
        background: disabled ? "#333" : "#F05A28",
        color: hovered && !pressed && !disabled ? "#000" : "#fff",
        border: `2px solid ${disabled ? "#444" : "#000"}`,
        fontFamily: "Archivo Black, sans-serif",
        fontSize: 17,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow:
          pressed || disabled
            ? "none"
            : hovered
              ? "6px 6px 0 #000"
              : "3px 3px 0 #000",
        transform: pressed
          ? "translate(3px,3px)"
          : hovered && !disabled
            ? "translate(-3px,-3px)"
            : "none",
        transition: "transform 0.12s ease, box-shadow 0.12s ease, color 0.12s",
        borderRadius: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          transform:
            hovered && !pressed && !disabled ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left center",
          transition: "transform 0.25s ease-out",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}

// ─── Field Label ──────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontFamily: "Space Mono, monospace",
        fontSize: 12,
        color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.18em",
        display: "block",
        marginBottom: 8,
      }}
    >
      {children}
    </label>
  );
}

// ─── Input style ─────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  background: "#141414",
  color: "#fff",
  border: "2px solid rgba(255,255,255,0.12)",
  fontFamily: "Space Mono, monospace",
  fontSize: 17,
  outline: "none",
  borderRadius: 0,
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

// ─── Main ─────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    profession: "",
    introduction: "",
    hourly_rate: "",
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  const PROFESSIONS = [
    "前端开发",
    "后端开发",
    "全栈开发",
    "算法/AI",
    "运维/DevOps",
    "UI/UX 设计",
    "产品经理",
    "数据分析",
    "架构师",
    "测试工程师",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setForm((f) => ({ ...f, username: user.username }));
        } catch {
          /* ignore */
        }
      }
      fetchProfile(token);
    }
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const r = await fetch(`${apiUrl}/api/v1/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) {
        const res = await r.json();
        const data = res.data;
        if (data) {
          setForm((f) => ({
            ...f,
            full_name: data.full_name ?? "",
            profession: data.profession ?? "",
            introduction: data.introduction ?? "",
            hourly_rate: data.hourly_rate ? String(data.hourly_rate) : "",
            skills: data.skills ?? [],
          }));
        }
      }
    } catch {
      /* ignore */
    }
  };

  const handleLogin = async () => {
    if (!loginUsername.trim()) return;
    setError("");
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const r = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: loginUsername.trim(), 
          password: loginPassword 
        }),
      });
      const data = await r.json();
      
      if (!r.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.token ?? data.access_token ?? data.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: loginUsername.trim(),
          }),
        );
        setIsLoggedIn(true);
        setForm((f) => ({ ...f, username: loginUsername.trim() }));
        await fetchProfile(token);
        showToast("✓ 登录成功");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      
      // 取消原本的强制降级离线模式，以确保错误的密码能抛出阻断
      // 如果后端没有配置用户，或者网络不通等情况，依然保留一个简单的 mock？
      // 为了保持和登录页一致的体验，这里不再强行 mock，只在确实连不上服务器时抛出
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const payload = {
        full_name: form.full_name,
        profession: form.profession,
        introduction: form.introduction,
        hourly_rate: Number(form.hourly_rate) || 0,
        skills: form.skills,
      };

      const r = await fetch(`${apiUrl}/api/v1/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (r.ok) {
        showToast("✓ 信息已更新");
      } else {
        showToast("× 更新失败");
      }
    } catch {
      showToast("× 网络错误");
    }
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const mockSkillsPrompt = `---
name: agentos-openclaw-connector
description: &gt;
  连接本地 OpenClaw 实例到 CoAgent 平台，实现任务监听、进度同步和真人介入请求。
  支持任务自动接单、阶段性进度上报、以及置信度不足时的告警升级机制。
namespace: community
category: developer-tools
tags: [agentos, openclaw, automation, workflow, api-integration]
metadata:
  openclaw:
    emoji: "🦀"
    primaryEnv: AGENTOS_API_TOKEN
    os: [darwin, linux, windows]
    requires:
      bins: [curl, jq]
      env: [AGENTOS_API_TOKEN, OPENCLAW_INSTANCE_ID]
    install:
      - id: setup
        kind: manual
        label: '配置环境变量'
        steps:
          - 'export AGENTOS_API_TOKEN=your_api_token'
          - 'export OPENCLAW_INSTANCE_ID=local_claw_001'
---

# CoAgent OpenClaw 连接器

本技能用于将本地 OpenClaw 实例接入 CoAgent 工作流平台，实现自动化任务处理与人工协作的无缝衔接。

## 核心能力

1. **任务监听与接单** - 轮询 CoAgent 任务队列，自动认领分配给当前 OpenClaw 实例的任务
2. **进度实时同步** - 任务执行过程中阶段性上报进度百分比和完成内容描述
3. **智能告警升级** - 置信度低于阈值或遇到构建错误时，自动触发真人介入流程
4. **双向状态管理** - 维护本地任务状态与远程平台状态的同步

## 前置条件

使用本技能前，请确保：

- 已获取 CoAgent API 访问令牌（"COAGENT_API_TOKEN"）
- 本地 OpenClaw 实例已启动并可访问（默认 "http://localhost:11434"）
- 网络可连通 "api.coagent.dev"

## 工作流程

### 1. 任务监听循环 (Task Polling)

当用户要求"开始监听任务"或"接入 CoAgent"时，启动以下流程：

\`\`\`bash
#!/bin/bash
# scripts/poll-tasks.sh

INSTANCE_ID_INSTANCE_ID:-"_INSTANCE_ID:-"local_claw_001"}"
API_BASE="https://api.agentos.dev/v1"
TOKEN=$AGENTOS_API_TOKEN

while true; do
  # 拉取待处理任务
  response=$(curl -s -X GET \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    "$API_BASE/tasks/queue?instance_id=$INSTANCE_ID&status=pending&limit=1")
  
  task=$(echo $response | jq -r '.data[0] // empty')
  
  if [ ! -z "$task" ] && [ "$task" != "null" ]; then
    task_id=$(echo $task | jq -r '.id')
    task_type=$(echo $task | jq -r '.type')
    
    echo "🎯 接收到任务: $task_id (类型: $task_type)"
    
    # 执行接单确认
    curl -s -X POST \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"task_id\": \"$task_id\", \"instance_id\": \"$INSTANCE_ID\", \"status\": \"claimed\"}" \
      "$API_BASE/tasks/claim"
    
    # 将任务交给主处理流程
    ./scripts/process-task.sh "$task_id" "$task_type" "$(echo $task | jq -c '.payload')"
  fi
  
  sleep 5
done`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(mockSkillsPrompt);
    showToast("✓ PROMPT 已复制");
  };

  const addSkill = (val: string) => {
    const s = val.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput("");
  };

  const removeSkill = (s: string) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));

  const professionColor: Record<string, string> = {
    前端开发: "#5189fb",
    后端开发: "#5189fb",
    全栈开发: "#5189fb",
    开发: "#5189fb",
    "算法/AI": "#cc44aa",
    数据分析: "#cc44aa",
    "运维/DevOps": "#22c55e",
    架构师: "#22c55e",
    测试工程师: "#22c55e",
    "UI/UX 设计": "#F05A28",
    产品经理: "#aaccff",
  };
  const avatarColor = professionColor[form.profession] ?? "#F05A28";

  return (
    <div
      style={{
        height: "calc(100vh - 48px)",
        background: "#0A0A0A",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 48,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "#F05A28",
            color: "#000",
            padding: "14px 28px",
            fontFamily: "Archivo Black, sans-serif",
            fontSize: 17,
            letterSpacing: "0.1em",
            borderBottom: "2px solid #000",
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}

      {!isLoggedIn ? (
        /* ── Boot-style Split Login ── */
        <BootLoginScreen
          loginUsername={loginUsername}
          setLoginUsername={setLoginUsername}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          onLogin={handleLogin}
          loading={loading}
          error={error}
        />
      ) : (
        /* ── Profile Form ── */
        <div
          style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
        >
          {/* Left: Avatar Panel */}
          <div
            style={{
              width: 280,
              flexShrink: 0,
              background: "#F7F6F3",
              borderRight: "2px solid #000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 24px",
              gap: 16,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                background: "#000",
                border: `3px solid ${avatarColor}`,
                boxShadow: `6px 6px 0 ${avatarColor}`,
                padding: 16,
              }}
            >
              <PixelRobot size={72} color={avatarColor} />
            </div>
            {/* Username */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "Archivo Black, sans-serif",
                  fontSize: 24,
                  color: "#111",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {form.full_name || form.username || "AGENT"}
              </div>
              <div
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: 12,
                  color: "#888",
                  letterSpacing: "0.12em",
                  marginTop: 6,
                }}
              >
                @{form.username}
              </div>
            </div>
            {/* Profession badge */}
            {form.profession && (
              <div
                style={{
                  padding: "6px 14px",
                  border: `2px solid ${avatarColor}`,
                  background: `${avatarColor}18`,
                  fontFamily: "Space Mono, monospace",
                  fontSize: 13,
                  color: avatarColor,
                  letterSpacing: "0.06em",
                  borderRadius: 0,
                }}
              >
                {form.profession}
              </div>
            )}
            {/* Skills */}
            {form.skills.length > 0 && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  justifyContent: "center",
                }}
              >
                {form.skills.map((s) => (
                  <div
                    key={s}
                    style={{
                      padding: "3px 10px",
                      background: "#F05A28",
                      color: "#000",
                      fontFamily: "Space Mono, monospace",
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      border: "1px solid #000",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
            {/* Hourly rate display */}
            {form.hourly_rate && (
              <div
                style={{
                  marginTop: "auto",
                  textAlign: "center",
                  borderTop: "2px solid #000",
                  paddingTop: 16,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: 12,
                    color: "#888",
                    letterSpacing: "0.12em",
                  }}
                >
                  HOURLY RATE
                </div>
                <div
                  style={{
                    fontFamily: "Archivo Black, sans-serif",
                    fontSize: 32,
                    color: "#111",
                    letterSpacing: "-0.04em",
                  }}
                >
                  ¥{form.hourly_rate}
                </div>
              </div>
            )}
            {/* Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                setLoginUsername("");
                setForm({
                  username: "",
                  full_name: "",
                  profession: "",
                  introduction: "",
                  hourly_rate: "",
                  skills: [],
                });
              }}
              style={{
                marginTop: "auto",
                padding: "8px 20px",
                background: "transparent",
                border: "2px solid #000",
                fontFamily: "Space Mono, monospace",
                fontSize: 13,
                color: "#555",
                cursor: "pointer",
                letterSpacing: "0.1em",
                borderRadius: 0,
              }}
            >
              LOGOUT
            </button>
          </div>

          {/* Right: Form */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px 40px",
              background: "#0A0A0A",
              minHeight: 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Section: Identity */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ width: 3, height: 20, background: "#F05A28" }}
                  />
                  <span
                    style={{
                      fontFamily: "Archivo Black, sans-serif",
                      fontSize: 19,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    基本信息
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <FieldLabel>USERNAME（只读）</FieldLabel>
                    <input
                      value={form.username}
                      readOnly
                      style={{
                        ...inputStyle,
                        opacity: 0.45,
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                  <div>
                    <FieldLabel>FULL_NAME</FieldLabel>
                    <input
                      value={form.full_name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, full_name: e.target.value }))
                      }
                      placeholder="你的显示名称"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Profession */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ width: 3, height: 20, background: "#F05A28" }}
                  />
                  <span
                    style={{
                      fontFamily: "Archivo Black, sans-serif",
                      fontSize: 19,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    职能 & 技能
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Profession selector */}
                  <div>
                    <FieldLabel>PROFESSION</FieldLabel>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {PROFESSIONS.map((p) => {
                        const pColor = professionColor[p] ?? "#F05A28";
                        const isActive = form.profession === p;
                        return (
                          <button
                            key={p}
                            onClick={() =>
                              setForm((f) => ({ ...f, profession: p }))
                            }
                            style={{
                              padding: "8px 16px",
                              background: isActive
                                ? `${pColor}20`
                                : "transparent",
                              border: `2px solid ${isActive ? pColor : "rgba(255,255,255,0.15)"}`,
                              color: isActive
                                ? pColor
                                : "rgba(255,255,255,0.5)",
                              fontFamily: "Space Mono, monospace",
                              fontSize: 13,
                              letterSpacing: "0.06em",
                              cursor: "pointer",
                              borderRadius: 0,
                              boxShadow: isActive
                                ? `3px 3px 0 ${pColor}55`
                                : "none",
                              transition: "all 0.15s",
                            }}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <FieldLabel>SKILLS（Enter 添加）</FieldLabel>
                    <div style={{ display: "flex", gap: 0 }}>
                      <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) =>
                          (e.key === "Enter" || e.key === " ") &&
                          (e.preventDefault(), addSkill(skillInput))
                        }
                        placeholder="如：React、Python、Docker..."
                        style={{ ...inputStyle, flex: 1, borderRight: "none" }}
                      />
                      <button
                        onClick={() => addSkill(skillInput)}
                        style={{
                          padding: "0 20px",
                          background: "#F05A28",
                          color: "#fff",
                          border: "2px solid #000",
                          fontFamily: "Archivo Black, sans-serif",
                          fontSize: 15,
                          letterSpacing: "0.1em",
                          cursor: "pointer",
                          borderRadius: 0,
                          boxShadow: "3px 3px 0 #000",
                        }}
                      >
                        ADD
                      </button>
                    </div>
                    {form.skills.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 12,
                        }}
                      >
                        {form.skills.map((s) => (
                          <div
                            key={s}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "5px 12px",
                              background: "#F05A28",
                              color: "#000",
                              border: "2px solid #000",
                              boxShadow: "2px 2px 0 #000",
                              fontFamily: "Space Mono, monospace",
                              fontSize: 13,
                              letterSpacing: "0.06em",
                            }}
                          >
                            {s}
                            <button
                              onClick={() => removeSkill(s)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#000",
                                cursor: "pointer",
                                padding: 0,
                                fontSize: 15,
                                lineHeight: 1,
                                fontWeight: 700,
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Bio */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ width: 3, height: 20, background: "#F05A28" }}
                  />
                  <span
                    style={{
                      fontFamily: "Archivo Black, sans-serif",
                      fontSize: 19,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    简介 & 费率
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div>
                    <FieldLabel>INTRODUCTION</FieldLabel>
                    <textarea
                      value={form.introduction}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, introduction: e.target.value }))
                      }
                      placeholder="简单介绍一下你自己..."
                      rows={4}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        lineHeight: 1.8,
                        fontFamily: "Space Mono, monospace",
                        fontSize: 16,
                      }}
                    />
                  </div>
                  <div style={{ maxWidth: 240 }}>
                    <FieldLabel>HOURLY_RATE（¥/hr）</FieldLabel>
                    <input
                      type="number"
                      value={form.hourly_rate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, hourly_rate: e.target.value }))
                      }
                      placeholder="0"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Agent Integration */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ width: 3, height: 20, background: "#F05A28" }}
                  />
                  <span
                    style={{
                      fontFamily: "Archivo Black, sans-serif",
                      fontSize: 19,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    专属 CoAgent 托管
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div
                    style={{
                      background: "#111",
                      padding: "16px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 16,
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.6,
                        marginBottom: 16,
                      }}
                    >
                      接入你的 Agent 替你干活。如果你的 Agent
                      可以解决，它会自动完成任务并提交成果；如果遇到无法解决的复杂问题，它会立即通知你进行真人介入。
                    </p>
                    <FieldLabel>
                      接入方式：将以下 Prompt 复制并配置到你的 Agent Skills 中
                    </FieldLabel>
                    <div style={{ position: "relative" }}>
                      <textarea
                        readOnly
                        value={mockSkillsPrompt}
                        style={{
                          ...inputStyle,
                          height: 380,
                          resize: "none",
                          fontFamily: "Space Mono, monospace",
                          fontSize: 15,
                          lineHeight: 1.6,
                          color: "#F05A28",
                          background: "#0a0a0a",
                          border: "1px solid rgba(240,90,40,0.3)",
                        }}
                      />
                      <button
                        onClick={handleCopyPrompt}
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          padding: "6px 12px",
                          background: "#F05A28",
                          color: "#000",
                          border: "1px solid #000",
                          fontFamily: "Archivo Black, sans-serif",
                          fontSize: 12,
                          cursor: "pointer",
                          boxShadow: "2px 2px 0 #000",
                          transition: "transform 0.1s, box-shadow 0.1s",
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform =
                            "translate(2px, 2px)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "2px 2px 0 #000";
                        }}
                      >
                        COPY
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save */}
              <div style={{ paddingBottom: 32 }}>
                <OrangeButton onClick={handleSave} disabled={loading} fullWidth>
                  {loading ? "SAVING..." : "✦ 保存信息"}
                </OrangeButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
