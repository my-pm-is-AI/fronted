# AI Agent 协作平台 — 前端设计规格文档 (SDD)

> 版本：v1.0 · 2026-04-08  
> 作者：workspace 负责人  
> 风格基准：blogNow「动能橙技术粗野主义」× myself2「霓虹赛博 R3F 建筑」

---

## 0. 设计风格 Token（全局）

| Token | 值 | 用途 |
|---|---|---|
| `background` | `#0A0A0A` | 全局页面底色 |
| `surface` | `#141414` | 卡片/面板底色 |
| `border` | `#2A2A2A` | 分割线/边框 |
| `accent` | `#F05A28` | 主强调色（CTA、激活、标签） |
| `accent-light` | `#FF7A4A` | hover 态强调色 |
| `text-primary` | `#FFFFFF` | 主文字 |
| `text-secondary` | `#A0A0A0` | 次级文字 |
| `text-muted` | `#555555` | 辅助/时间戳 |
| `3d-bg` | `#0a0812` | R3F Canvas 背景（继承 myself2） |
| `neon-blue` | `#5189fb` | 霓虹蓝（3D 建筑主光） |
| `neon-purple` | `#7b2fe8` | 霓虹紫（3D 建筑辅光） |
| `neon-cyan` | `#4cc9f0` | 霓虹青（3D 建筑点缀） |

**字体体系（对齐 blogNow）：**
- Display / 标题：`Archivo Black`，全大写，tracking `-0.04em`
- Mono / 数据/时间：`Space Mono`
- Body：`Geist Sans`（Next.js 默认，已配置）

**动效规范：**
- Hover 位移：`translateY(-4px)`，`transition: 200ms`
- Glitch 文字：偶发触发，`@keyframes glitch`
- 卡片倾斜散落：`rotate: ±1.5deg`，hover 回正
- 打字机：字符逐个追加，光标 `pixel-blink`

---

## 1. 页面路由总览

| 路由 | 文件路径 | 状态 | 优先级 |
|---|---|---|---|
| `/` | `page.tsx` | 交给他人 | — |
| `/home` | `home/page.tsx` | 存根 | — |
| `/profile` | `profile/page.tsx` | **待开发** | P1 |
| `/publish` | `publish/page.tsx` | **待开发** | P1 |
| `/publish/[id]` | `publish/[id]/page.tsx` | **待开发** | P1 |
| `/workspace` | `workspace/page.tsx` | **主力页（已开发 60%）** | P0 |
| `/workspace/[id]` | `workspace/[id]/page.tsx` | **待对接 API** | P0 |
| `/settlement` | `settlement/page.tsx` | **待开发** | P2 |
| `/settlement/[id]` | `settlement/[id]/page.tsx` | **待开发** | P2 |

---

## 2. 各页面规格

---

### 📄 2.1 `/profile` — 个人信息配置页

#### 概述

用户首次进入或修改个人信息的页面。填写后，AI 匹配 Agent 时会参考职业/技能信息。  
本页也是**唯一的登录/注册入口**（输入用户名即自动注册）。

#### 功能列表

| 功能 | 描述 |
|---|---|
| 用户名登录 | 输入 username，调 `/auth/login`，写 token 到 localStorage |
| 填写全名 | `full_name` 字段，用于 workspace 显示 |
| 选择职业 | `profession` 下拉或自由输入，影响 Agent 匹配 |
| 技能标签 | `skills[]` 多选标签组，支持自定义添加 |
| 个人简介 | `introduction` 文本框 |
| 时薪设置 | `hourly_rate` 数字输入，选填 |
| 保存并进入 | 调 `PUT /profile`，成功后跳转 `/publish` |

#### 数据结构

```ts
interface ProfileForm {
  username: string;       // 登录用，不可改
  full_name: string;
  profession: string;
  skills: string[];
  introduction: string;
  hourly_rate?: number;
}
```

#### API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/auth/login` | 登录/注册，获取 token |
| GET | `/profile` | 获取已有信息（回填表单） |
| PUT | `/profile` | 保存表单 |

#### 验收标准

- [ ] 首次进入自动聚焦用户名输入框
- [ ] 登录成功后 token 写入 localStorage，页面不刷新
- [ ] 已登录用户进入直接回填已有数据
- [ ] 保存成功后跳转 `/publish`
- [ ] 所有输入框符合 `#0A0A0A` 底色 + `#2A2A2A` 边框 + 橙色 focus 边框风格

---

### 📄 2.2 `/publish` — 需求发布页（AI 对话式）

#### 概述

用户通过与 AI 助手的流式对话，逐步描述项目需求，最终生成 PRD 并提交创建项目。  
是整个用户旅程的**第一步核心页面**。

#### 功能列表

| 功能 | 描述 |
|---|---|
| 需求对话 | 与 AI 进行流式对话（SSE），AI 引导用户完善需求 |
| 打字机效果 | AI 回复逐字输出，光标 pixel-blink |
| PRD 预览区 | 右侧（或对话下方）实时展示 AI 整理后的 PRD 草稿 |
| 确认提交 | 用户满意后点「确认提交」，调 `/requirement/create` |
| 创建项目 | 提交成功后自动获得 `project_id`，跳转至 `/publish/[id]` 匹配页 |

#### 数据结构

```ts
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface RequirementDraft {
  title: string;
  prd: string;       // AI 整理的 PRD 正文
}

interface CreateRequirementResponse {
  requirement_id: number;
  project_id: number;
}
```

#### API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/requirement/chat` | 流式对话（SSE），message + conversation_id |
| POST | `/requirement/create` | 提交 PRD，返回 project_id |

#### 验收标准

- [ ] SSE 流式输出正常，AI 回复逐字追加
- [ ] 用户消息气泡右对齐橙色，AI 消息左对齐暗色
- [ ] PRD 区域实时更新（AI 整理后展示）
- [ ] 提交后 loading 状态，成功跳转 `/publish/[id]`

---

### 📄 2.3 `/publish/[id]` — Agent 匹配 & 任务分配页

#### 概述

项目创建后，本页展示 AI 自动匹配的 Agent 成员列表，并可触发任务分配。  
完成分配后进入 workspace 开始协作。

#### 功能列表

| 功能 | 描述 |
|---|---|
| 查看匹配 Agent | 展示 `matched_agents` 列表，每个 Agent 显示名字、职能、技能标签 |
| 触发任务分配 | 点击「开始分配任务」按钮，调 `/project/assign-tasks` |
| 任务预览 | 分配结果展示 todo_lists 和 project_nodes |
| 进入 Workspace | 确认后跳转 `/workspace/[id]` |

#### 数据结构

```ts
interface MatchedAgent {
  agent_id: number;
  name: string;
  profession: string;
  skills: string[];
}

interface TodoItem {
  agent_id: number;
  content: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'done';
}

interface ProjectNode {
  name: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'done';
}
```

#### API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/project/match-agents` | 传 project_id，获取匹配 Agent |
| POST | `/project/assign-tasks` | 传 project_id，生成 todo + nodes |

#### 验收标准

- [ ] Agent 卡片展示职能 + 技能标签（橙色小标签）
- [ ] 「开始分配」按钮点击后 loading，完成后展示 todo 列表
- [ ] project_nodes 时间线展示
- [ ] 「进入 Workspace」按钮跳转正确路由

---

### 📄 2.4 `/workspace/[id]` — 主协作工作台（核心页）

#### 概述

项目的核心监控大屏。左侧是与项目 AI 管家的实时对话 + 项目状态卡片，右侧是动态 3D 霓虹建筑（楼层按职能分组，每层人数对应 Agent 数）。

#### 功能列表

**2.4.1 顶部导航栏**

| 元素 | 说明 |
|---|---|
| Logo + 标题 | `🏙 WORKSPACE` Glitch 动效文字 |
| 项目名称 | 当前 project 名称，`Space Mono` 字体 |
| 在线状态 | Agent 活跃数量徽章（橙色圆点） |
| 用户头像 | 当前用户名首字母，橙色圆形 |

**2.4.2 左侧面板 — 项目管家对话**

| 元素 | 说明 |
|---|---|
| 消息气泡列表 | 用户消息：右对齐橙色气泡；AI 消息：左对齐暗色气泡 |
| 打字机动效 | AI 回复逐字追加，`pixel-blink` 光标 |
| 输入框 | 固定底部，Enter 发送，`#141414` 底色 |
| 项目状态卡片 | Phase 卡片列表，`done/active/pending` 三态 |

**2.4.3 右侧 3D 建筑展示**

| 元素 | 说明 |
|---|---|
| 楼层结构 | 楼层数 = 职能组数，每层人数 = 该组 Agent 数 |
| 房间类型 | 自动按 profession 关键词匹配样板间（见 templates/index.ts） |
| 像素小人 | 颜色随机分配，在房间内漫步动画 |
| 楼层控制 | 右上角楼层标签按钮，激活态橙色 |
| 自动旋转 | `Auto-Rotate` 开关 |
| Bloom 开关 | `Bloom ON/OFF` 后处理 |

**2.4.4 底部进度横条**

| 元素 | 说明 |
|---|---|
| Agent 进度卡片 | 每个 Agent 一张，显示名称/职能/进度百分比/最新进展 |
| 进度条 | 橙色填充条 |
| 横向滚动 | `overflow-x: auto`，固定高度 140px |

#### 数据结构

```ts
interface ProjectChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface MemberProgress {
  agent_id: number;
  name: string;
  profession: string;
  latest_progress: string;
  progress_percent: number;   // 0-100
  update_time: string;
}

interface ProjectOverallProgress {
  project_status: 'pending' | 'assigned' | 'in_progress' | 'done';
  members_progress: MemberProgress[];
  overall_progress: number;
}

// 楼层配置（由 matched_agents 生成）
interface FloorConfig {
  roomType: 'dev' | 'workshop' | 'library' | 'design' | 'meeting';
  profession: string;       // 职能组名称
  agents: AgentAppearance[];
}
```

#### API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/project/chat` | 流式对话（project_id + member_id + message） |
| GET | `/project/{id}/progress` | 获取整体进度 + 各成员进度 |
| PUT | `/project/progress` | 更新某成员进度 |

#### 验收标准

- [ ] 进入页面自动调 `GET /project/{id}/progress`，渲染 Agent 进度
- [ ] 楼层根据 `matched_agents` 职能动态生成（不再写死3层）
- [ ] 项目管家对话 SSE 流式正常
- [ ] 底部进度卡片横向滚动正常
- [ ] 3D 建筑楼层数与 Agent 职能组数一致

---

### 📄 2.5 `/settlement/[id]` — 项目结算页

#### 概述

项目完成后的结算展示页，展示各 Agent 的贡献、工时、费用汇总。  
整体风格为「结案陈词」感：数据驱动 + 霓虹表格。

#### 功能列表

| 功能 | 描述 |
|---|---|
| 项目总览 | 项目名称、完成时间、总体进度 100% |
| Agent 贡献列表 | 每个 Agent 的工时、完成 todo 数、进度% |
| 费用结算 | 基于 hourly_rate 估算费用（前端计算） |
| 导出/分享 | 可选：生成结算截图（P3） |

#### 数据结构

```ts
interface AgentSettlement {
  agent_id: number;
  name: string;
  profession: string;
  tasks_done: number;
  tasks_total: number;
  progress_percent: number;
  hours_estimated: number;
  cost_estimated: number;
}

interface ProjectSettlement {
  project_id: number;
  project_name: string;
  finished_at: string;
  agents: AgentSettlement[];
  total_cost: number;
}
```

#### API 接口

> 结算数据从 `GET /project/{id}/progress` 聚合计算，暂无专用结算接口。

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/project/{id}/progress` | 复用进度接口，前端计算结算 |

#### 验收标准

- [ ] 所有 Agent 进度均为 100% 才能进入结算页
- [ ] 费用按 `progress_percent × hourly_rate × 预估工时` 计算
- [ ] 样式：深色表格 + 橙色高亮总金额行

---

## 3. 当前缺失 & 待开发清单

### 高优先（P0 - 本次 Hackathon 核心流）

| 任务 | 对应页面 | 说明 |
|---|---|---|
| 登录/注册流程 | `/profile` | 写死 token 后还需真实对接 `/auth/login` |
| workspace 动态楼层 | `/workspace/[id]` | 根据 matched_agents 职能动态生成楼层，替换现在写死的5层 |
| workspace 接口对接 | `/workspace/[id]` | 项目管家对话 SSE + GET 进度接口 |
| 底部进度条真实数据 | `/workspace/[id]` | `TeamProgressBar` 对接 `GET /project/{id}/progress` |

### 中优先（P1 - 完整用户旅程）

| 任务 | 对应页面 | 说明 |
|---|---|---|
| 需求对话页 | `/publish` | SSE 对话 + PRD 预览 |
| Agent 匹配展示页 | `/publish/[id]` | match-agents + assign-tasks 流程 |
| 个人信息页 | `/profile` | 登录 + 资料填写 |

### 低优先（P2 - 锦上添花）

| 任务 | 对应页面 | 说明 |
|---|---|---|
| 结算页 | `/settlement/[id]` | 项目完成后汇总 |
| 结算列表 | `/settlement` | 历史结算记录 |

---

## 4. 用户旅程（完整流）

```
[登录] /profile
   ↓ 输入用户名 → token 写入 localStorage
[发布需求] /publish
   ↓ 与 AI 对话 → 生成 PRD → 提交 → project_id
[匹配 Agent] /publish/[id]
   ↓ match-agents → assign-tasks → 确认
[协作监控] /workspace/[id]
   ↓ 实时看 Agent 工作 + 项目管家对话
[项目结算] /settlement/[id]
   ↓ 查看贡献 + 费用汇总
```

---

## 5. 组件复用规范

| 组件 | 位置 | 复用场景 |
|---|---|---|
| SSE 流式 Hook | `lib/useSSE.ts`（待建） | publish + workspace 对话 |
| ChatBubble | `components/ChatBubble.tsx`（待建） | publish + workspace 共用 |
| AgentCard | `components/AgentCard.tsx`（待建） | publish/[id] + workspace 底部栏 |
| 3D BuildingScene | `workspace/components/BuildingScene/` | 已完成，workspace 专用 |
| Room Templates | `rooms/templates/` | 已完成，按职能自动匹配 |

---

*文档版本：v1.0 · 2026-04-08*
