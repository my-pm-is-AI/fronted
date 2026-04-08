# AI Agent 协作平台 — 前端设计规格文档 (SDD v2)

> 版本：v2.0 · 2026-04-08
> 项目路径：`D:\Code\hackathon\now`
> 后端地址：`http://120.78.126.163`
> 设计风格参考：`blogNow`（动能橙技术粗野主义）× `myself2`（霓虹赛博 R3F）
> Homepage 由其他人负责，本文档不涵盖。

---

## 0. 设计系统

### 0.1 视觉风格定义

**"动能橙技术粗野主义 × 霓虹赛博朋克"**

- 左侧 Panel 沿用 blogNow 的 **米白纸质感** `#F7F6F3`，黑色 2px 边框、硬偏移阴影
- 右侧 3D Canvas 延续 myself2 的 **深紫黑宇宙感** `#0a0812`，霓虹发光材质
- 底部进度栏为 **纯黑暗色系** `#000`，多彩霓虹卡片散落

### 0.2 Design Token

```ts
// ── 全局底色
background:     '#0A0A0A'   // 页面整体底色
surface:        '#141414'   // 次级面板底色
surfaceLight:   '#F7F6F3'   // 左侧 Panel（纸质米白）
bg3d:           '#0a0812'   // R3F Canvas 底色

// ── 边框
border:         '#000000'   // 主边框（粗野主义黑边）
borderDim:      'rgba(255,255,255,0.1)'  // 暗区细边框

// ── 文字
textPrimary:    '#FFFFFF'
textDark:       '#111111'   // 浅色背景上的文字
textSecondary:  '#A0A0A0'
textMuted:      'rgba(255,255,255,0.3)'

// ── 强调色
accent:         '#F05A28'   // 品牌橙（CTA、激活态、用户消息）
accentLight:    '#FF7A4A'   // hover 亮橙
accentDark:     '#d44418'   // pressed 深橙

// ── 霓虹（3D 建筑专用）
neonBlue:       '#5189fb'
neonPurple:     '#7b2fe8'
neonCyan:       '#4cc9f0'
neonGreen:      '#22c55e'
neonPink:       '#cc44aa'
neonOrange:     '#F05A28'

// ── 职能颜色（对应5种样板房间）
devColor:       '#5189fb'   // 开发室
workshopColor:  '#22c55e'   // 工坊
libraryColor:   '#cc44aa'   // 图书馆
designColor:    '#F05A28'   // 设计室
meetingColor:   '#aaccff'   // 会议室
```

### 0.3 字体体系

| 字体 | CSS 变量 | 用途 |
|------|---------|------|
| `Archivo Black` | `font-display` / `font-family: Archivo Black` | 大标题、数字、按钮文字、全大写场景 |
| `Space Mono` | `font-mono-brand` | 终端文字、数据/时间、badge、代码区 |
| `Geist Sans` | 默认 | 正文（较少使用） |

### 0.4 圆角规范

| 场景 | 值 |
|------|----|
| 卡片、面板、输入框、按钮 | **0px（零圆角）** |
| 状态点（绿点、霓虹点） | `50%`（圆形） |
| 进度条 | 0px |

### 0.5 动效规范

#### blogNow 移植动效（核心）
```
硬偏移阴影：
  默认：  box-shadow: 3px 3px 0 color
  hover:  box-shadow: 6px 6px 0 color + translate(-3px,-3px)
  active: box-shadow: none         + translate(3px,3px)

白色/颜色填入（EssayCard 效果）：
  ::before 绝对定位层，scaleX: 0 → 1，origin: left
  transition: transform 0.25s ease-out

卡片散落倾斜：
  默认: rotate(±1~2deg)
  hover: rotate(0deg) + 位移

指示点：
  hover: scale(1.4)
  active: background → 职能颜色
```

#### 独有动效
| 动效 | 规范 |
|------|------|
| 标题 Glitch | `@keyframes glitch`，偶发触发（约 8s/次） |
| 像素点闪烁 | `.pixel-blink { animation: blink 1s step-end infinite }` |
| 打字机 | 字符逐个追加 30ms/字，光标 `pixel-blink` |
| R3F Bloom | `@react-three/postprocessing UnrealBloomPass` |
| 楼层切换 | `gsap` / `Three.js` 相机插值平滑过渡 |
| 卡片入场 | `@keyframes card-pop-in`，`cubic-bezier(0.34,1.56,0.64,1)` |

### 0.6 按钮规范

| 类型 | 样式 | hover | active |
|------|------|-------|--------|
| **橙色 CTA**（SEND、发布） | `bg: #F05A28` `border: 2px solid #000` `shadow: 3px 3px 0 #000` | 白色从左填入 + `shadow: 6px 6px 0 #000` + `translate(-3,-3)` | `translate(3,3)` + shadow 消失 |
| **Ghost 按钮**（楼层切换非激活） | `bg: rgba(0,0,0,0.65)` `border: 1px solid rgba(255,255,255,0.18)` | 白色从左填入 + 文字变黑 + 白色硬阴影 | 归零 |
| **激活态按钮**（楼层激活/Bloom ON） | `bg: rgba(240,90,40,0.12)` `border: 1px solid #F05A28` | 橙色填入 + 橙色硬阴影 | 归零 |

---

## 1. 页面总览

| 路径 | 页面 | 状态 | 优先级 |
|------|------|------|--------|
| `/` | Homepage | ❌ 他人负责 | — |
| `/publish` | 需求发布 + AI 对话 | 🔴 待开发 | **P0** |
| `/workspace` | 工作台主页（当前 mock） | � 基础完成 | **P0** |
| `/workspace/[id]` | 项目工作台（API 对接） | 🟡 UI 完成，接口待对接 | **P0** |
| `/profile` | 个人信息页 | 🔴 待开发 | P1 |
| `/settlement/[id]` | 项目结算页 | 🔴 待开发 | P1 |

---

## 2. Workspace 工作台页（核心，已实现）

### 2.1 整体布局

```
┌─────────────────────────────────────────────────────────┐
│ TopNav                                                   │
│ [跑马灯 × 1，速度10s，亮度0.55]                           │
├─────────────────────────┬───────────────────────────────┤
│   左侧 Panel (35%)       │   右侧 3D Canvas (65%)         │
│   bg: #F7F6F3            │   bg: #0a0812                 │
│   border-right: 2px #000 │                               │
│                          │   R3F 霓虹建筑（5层样板间）     │
│   ┌──────────────────┐   │                               │
│   │  AgentChat       │   │   [楼层按钮] [← Overview]     │
│   │  - 消息气泡       │   │                               │
│   │  - SEND 按钮      │   │   [▶ Auto-Rotate] [✦ Bloom]  │
│   └──────────────────┘   │                               │
│   ┌──────────────────┐   │   右下角楼层指示点              │
│   │  ProjectStatus   │   │                               │
│   │  - 阶段卡片       │   │                               │
│   └──────────────────┘   │                               │
├─────────────────────────┴───────────────────────────────┤
│ TeamProgressBar                                          │
│ [跑马灯反向 × 1，速度10s]                                 │
│ [Agent 卡片横向滚动，散落倾斜，blogNow 硬阴影 hover]        │
└─────────────────────────────────────────────────────────┘
```

### 2.2 TopNav 组件

| 元素 | 规范 |
|------|------|
| Logo `WORKSPACE` | `Archivo Black` 18px，`-0.04em` tracking，白色 |
| 副标题 | `Space Mono` 9px `KINETIC ENGINE V1.0`，橙色 |
| `HACKATHON` badge | 橙色填充，黑色文字，零圆角 |
| 在线状态 | 绿点 `#22c55e` + `0YS ONLINE · N AGENTS` |
| 用户 Avatar | `ME` 2字母，橙色边框方框 |
| 跑马灯（上） | `Archivo Black` 10px · 速度 10s · 颜色 `rgba(255,255,255,0.55)` · `marquee` 正向 |
| 跑马灯（下） | `Archivo Black` 10px · 速度 10s · 颜色 `rgba(255,255,255,0.55)` · `marquee-reverse` 反向 |

### 2.3 AgentChat 组件（左侧上半）

| 元素 | 规范 |
|------|------|
| 背景 | `#F7F6F3` 米白 |
| 消息区背景 | `#F7F6F3` |
| AI 气泡 | `bg: #fff` `border: 2px solid #000` `shadow: 4px 4px 0 #000` |
| 用户气泡 | `bg: #111` `border: 2px solid #000` `shadow: 4px 4px 0 #F05A28` |
| 输入框 | `bg: #f5f5f5` `border: 2px solid #000` `border-right: none` |
| SEND 按钮 | 橙色 CTA 规范，白色从左填入 + 硬黑偏移阴影 |
| 打字机 | PROCESSING... 状态，`pixel-blink` 橙色光标 |
| Agent 头像 | 像素机器人（6×7 格栅），橙色眼睛，紫色耳朵 |

### 2.4 ProjectStatus 组件（左侧下半）

| 元素 | 规范 |
|------|------|
| 背景 | `#F7F6F3` 或 `#fff` |
| 激活阶段 | `bg: #000` `border: 2px solid #F05A28` 橙色右侧短横线，左侧 3px 橙色竖条 |
| 完成阶段 | 绿色 `#22c55e` 数字 + 文字 |
| 待完成阶段 | `opacity: 0.4`，灰色 |
| 进度线 | 右侧两段短横线，激活态橙色，完成态绿色 |

### 2.5 3D BuildingScene（右侧）

#### 五种样板房间

| 房间 | 职能匹配 | 主色 | 特色道具 |
|------|---------|------|---------|
| 🖥️ `DevRoom` | 前端/后端/全栈/开发 | `#5189fb` 蓝 | 书架 + 显示器 + 霓虹白板 + 2 像素人 |
| 🔧 `WorkshopRoom` | 运维/DevOps/架构/测试 | `#22c55e` 绿 | 绿色监控大屏 + 工具台 + 沙发 |
| 📚 `LibraryRoom` | 算法/数据/AI/研究 | `#cc44aa` 粉紫 | 双书架 + 台灯 + 青色霓虹窗 |
| 🎨 `DesignRoom` | 设计/UI/UX | `#F05A28` 橙 | 画架 + 调色盘台 + 多彩 vase |
| 📋 `MeetingRoom` | 产品/PM/项目 | `#aaccff` 冷白 | 投影大屏 + 会议桌 + 椅子 x6 + 白板流程图 |

#### 楼层构建逻辑

```ts
// 入口：templates/index.ts
import { getRoomByProfession, getRoomTypeByProfession } from './rooms/templates';

// 动态楼层生成（待对接 API 后替换 mock）
const floors = matchedAgents
  .reduce((groups, agent) => {
    const type = getRoomTypeByProfession(agent.profession);
    groups[type] = [...(groups[type] || []), agent];
    return groups;
  }, {});
// floors 的 key 数 = 楼层数，value.length = 该层像素人数
```

#### 楼层控制按钮规范

- 楼层按钮：Ghost 按钮样式，激活态橙色（见 0.6 按钮规范）
- hover：**白色/橙色从左向右填入** + 硬偏移阴影 + `translate(-3,-3)`
- active：归零，`translate(3,3)`
- 右下角指示点：hover `scale(1.4)`，激活 `bg: #F05A28` + 橙色 glow

### 2.6 TeamProgressBar 组件（底部）

| 元素 | 规范 |
|------|------|
| 整体背景 | `#000` |
| 顶部边框 | `2px solid rgba(255,255,255,0.12)` |
| 跑马灯 | `marquee-reverse 10s`，`rgba(255,255,255,0.55)` |
| 卡片区高度 | `210px` |
| 卡片宽度 | `220px`，`overflow-x: auto` 横向滚动 |
| 卡片默认 | `bg: #080808` `border: 2px solid rgba(255,255,255,0.1)` `rotate: ±1~2deg` |
| 卡片 hover | **boardNow 硬阴影**：`6px 6px 0 职能颜色` + `translate(-3,-3) rotate(0)` |
| 卡片 active | `translate(3,3)` + shadow 消失 |
| 顶部色条 | `height: 3px` 职能颜色 + 霓虹 glow |
| Avatar hover | 填充职能颜色，文字变黑 |
| Phase badge | `bg: 职能色15%透明` `border: 1px solid 职能色55%` |
| 进度条 | `height: 4px`，职能颜色填充 + `box-shadow: 0 0 8px 职能色88` |
| 进度数字 | `Archivo Black` 13px，职能颜色 |

---

## 3. 发布需求页 `/publish`（待开发 P0）

### 3.1 概述

用户通过与 AI 流式对话描述需求 → 生成 PRD → 一键发布 → 自动匹配 Agent → 跳转 workspace。

### 3.2 布局

```
┌──────────────────────────────────────────────────────┐
│ 顶部 Nav（简化版，只有 LOGO + 步骤指示器）              │
├────────────────────┬─────────────────────────────────┤
│  AI 对话区 (55%)    │  PRD 预览区 (45%)                │
│  bg: #F7F6F3       │  bg: #0A0A0A                    │
│                    │                                  │
│  消息气泡列表       │  [ 项目标题输入框 ]               │
│  （同 AgentChat）  │  ─────────────────               │
│                    │  [ PRD 正文 textarea ]            │
│  [ 输入框 + SEND ] │  （Space Mono，可编辑）            │
│                    │  ─────────────────               │
│                    │  [ 发布项目 ] CTA                 │
│                    │  发布后：3步状态动画               │
└────────────────────┴─────────────────────────────────┘
```

### 3.3 发布流程 3 步动画

```
① 创建需求  [■■■■■□□□□□]  POST /requirement/create
② 匹配 Agent [□□□□□□□□□□]  POST /project/match-agents
③ 分配任务  [□□□□□□□□□□]  POST /project/assign-tasks
```

每步：`loading → ✓ done`，橙色进度条 + 打字机文字

### 3.4 数据结构

```ts
interface RequirementDraft {
  title: string
  prd: string
}

interface PublishStep {
  key: 'create' | 'match' | 'assign'
  label: string
  status: 'pending' | 'loading' | 'done' | 'error'
}
```

### 3.5 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `POST /requirement/chat` | SSE | 需求对话，`{ message, conversation_id }` |
| `POST /requirement/create` | JSON | 提交 PRD，返回 `{ project_id }` |
| `POST /project/match-agents` | JSON | 匹配 Agent，返回 `matched_agents[]` |
| `POST /project/assign-tasks` | JSON | 分配任务，返回 `todo_lists[]` + `project_nodes[]` |

---

## 4. 个人信息页 `/profile`（待开发 P1）

### 4.1 布局

```
┌─────────────────────────────────────┐
│  头像区：像素机器人 + 用户名 + 职能标签  │
│  bg: #F7F6F3，黑色边框，硬阴影         │
├─────────────────────────────────────┤
│  表单区（黑底）                        │
│  full_name  / profession             │
│  skills（标签输入）                   │
│  introduction                        │
│  hourly_rate                         │
│  [ 保存信息 ] 橙色 CTA               │
└─────────────────────────────────────┘
```

### 4.2 特殊交互

- **技能标签**：`Enter/空格` 添加，点击 `×` 删除，橙色填充小标签，零圆角
- **保存反馈**：页面顶部橙色横幅 Toast，`"✓ 信息已更新"`，3s 自动消失
- **登录流程**：`POST /auth/login` 输入 username 即登录，token 写 localStorage

### 4.3 数据结构

```ts
interface UserProfile {
  username: string       // 只读，登录用
  full_name: string
  profession: string
  skills: string[]
  introduction: string
  hourly_rate: number
}
```

### 4.4 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `POST /auth/login` | JSON | `{ username }` → `{ token }` |
| `GET /profile` | — | 获取当前用户信息 |
| `PUT /profile` | JSON | 更新信息 |

---

## 5. 结算页 `/settlement/[id]`（待开发 P1）

### 5.1 布局

```
┌──────────────────────────────────────┐
│ 项目总览 Hero                         │
│ 项目名 + 完成时间 + 总进度 100% ✓      │
├──────────────────────────────────────┤
│ Agent 贡献明细表格（黑底白字）          │
│ 名称 / 职能 / 工时 / 时薪 / 小计       │
│ hover 行：橙色左侧竖条 + 浅橙背景       │
├──────────────────────────────────────┤
│ 汇总区                                │
│ TOTAL  ¥ XXXXXX  ← Archivo Black 大字  │
│ [ 导出报告 ] 橙色 CTA                  │
└──────────────────────────────────────┘
```

### 5.2 数据结构

```ts
interface AgentSettlement {
  agent_id: number
  name: string
  profession: string
  hours_worked: number       // (deadline - created_at) / 3600
  hourly_rate: number        // 来自 user profile
  subtotal: number           // hours × rate
  progress_percent: number   // 应为 100
  last_update: string
}

interface ProjectSettlement {
  project_id: number
  title: string
  completed_at: string
  agents: AgentSettlement[]
  total_cost: number
}
```

### 5.3 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `GET /project/{id}/progress` | — | 复用进度接口，前端聚合计算结算数据 |

---

## 6. 用户旅程 & 跳转流程

```
① /profile（可选，随时访问）
     username 登录 → token 写 localStorage

② /publish
     AI 对话 → PRD 确认 → 发布（3步动画）
          ↓ 自动
③ /workspace/[project_id]
     左：项目管家对话（SSE）
     右：3D 霓虹建筑（楼层 = 职能组数）
     底：全员进度卡片

          ↓ 项目完成后
④ /settlement/[project_id]
     费用明细 → 导出报告
```

---

## 7. 组件复用清单

| 组件 | 当前位置 | 可复用至 |
|------|---------|---------|
| `AgentChat` | `workspace/components/` | publish（复用气泡样式） |
| `SendButton`（inline 组件） | `AgentChat.tsx` | 可提取为 `components/SendButton.tsx` |
| `NeonButton`（inline 组件） | `FloorControls.tsx` | 可提取为 `components/NeonButton.tsx` |
| `ProgressBar`（inline 组件） | `TeamProgressBar.tsx` | profile、settlement |
| `BuildingScene` + `Room Templates` | `workspace/components/BuildingScene/` | workspace 专用 |
| `TopNav` | `workspace/components/` | workspace 专用 |

---

## 8. 待完成任务清单

### P0（核心流，本次 Hackathon）

- [ ] `/publish` 页面开发（AI 对话 + PRD 预览 + 3步发布流程）
- [ ] workspace 动态楼层（根据 `matched_agents.profession` 生成，替换写死5层）
- [ ] workspace `GET /project/{id}/progress` 接口对接（替换 mock 数据）
- [ ] workspace `POST /project/chat` SSE 对接（替换 setTimeout mock）
- [ ] 底部 `TeamProgressBar` 对接真实 Agent 进度数据

### P1（完整体验）

- [ ] `/profile` 页面（登录 + 信息编辑）
- [ ] `/settlement/[id]` 结算页
- [ ] token 鉴权拦截（未登录跳转 profile）

### P2（优化）

- [ ] `SendButton`、`NeonButton`、`ProgressBar` 提取为独立公共组件
- [ ] SSE 封装为 `useSSE` hook
- [ ] 3D 楼层切换补充过渡动画

---

*SDD v2.0 · 更新于 2026-04-08*