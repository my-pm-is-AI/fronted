# 🏗️ Workspace 页面开发计划

> 路径：`src/app/workspace/`
> 设计风格：暗黑赛博 + 橙色强调 + Glitch 点缀（对齐 `DESIGN_STYLE.md`）
> 3D 风格：对齐 `myself2`，霓虹蓝紫 R3F 建筑

---

## 一、页面定位

Workspace 是 AI Hackathon 的**多人协作监控大屏**，核心功能：

1. **左侧**：我的 Agent 对话管理（项目进度）
2. **右侧**：我的 3D 霓虹建筑展示（`myself2` 迁移）
3. **底部/浮层**：看大家的 Agent 进度 + 需求情况

---

## 二、整体布局

```
┌─────────────────────────────────────────────────────────────┐
│  顶部导航栏  🏙 WORKSPACE        [状态]  [用户头像]           │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│   左侧面板 (35%)      │        右侧 3D 展示 (65%)             │
│                      │                                      │
│  ┌──────────────────┐│   ┌──────────────────────────────┐   │
│  │ 🤖 Agent 对话     ││   │   R3F Canvas                 │   │
│  │                  ││   │   3层霓虹大楼（myself2）       │   │
│  │  [消息气泡列表]   ││   │   - 1F Office                │   │
│  │                  ││   │   - 2F Living                │   │
│  │  [输入框]  [发送] ││   │   - 3F Bedroom               │   │
│  └──────────────────┘│   └──────────────────────────────┘   │
│                      │                                      │
│  ┌──────────────────┐│   [楼层切换] [自动旋转] [Bloom]       │
│  │ 📋 项目状态卡片   ││                                      │
│  │  Phase 1 ✅       ││                                      │
│  │  Phase 2 🔄       ││                                      │
│  └──────────────────┘│                                      │
├──────────────────────┴──────────────────────────────────────┤
│  底部滚动栏：其他人的 Agent 进度卡片（横向滚动）               │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、分区详解

### 3.1 顶部导航栏

- 背景：`#0A0A0A` + 底部细线 `border-b border-[#2A2A2A]`
- 左侧：Logo + `🏙 WORKSPACE` 标题（Glitch 动效文字，橙色强调）
- 右侧：当前在线人数徽章 + 当前用户头像（赛博插画风）
- 整体：`backdrop-filter: blur(8px)`

### 3.2 左侧面板 —— Agent 对话 & 项目管理

**上半：Agent 对话区**
- 类 ChatGPT 聊天气泡，风格：暗色气泡 `#141414` + 橙色 `#F05A28` 强调用户消息
- Agent 消息带打字机动效（typewriter effect）
- Agent 头像：赛博插画风 AI 图标 + 橙色光晕
- 滚动加载历史记录

**下半：项目状态卡片**
- 卡片背景：`rgba(255,255,255,0.05)` 半透明 + `border: 1px solid #2A2A2A`
- 显示当前 Hackathon 各阶段进度（Phase 1 ~ N）
- 状态：✅ 完成 / 🔄 进行中 / ⏳ 待开始
- Hover 时卡片轻微上移 + 橙色边框光晕

### 3.3 右侧 3D 展示 —— 霓虹建筑（myself2 移植）

直接集成 `myself2` 的 3D 场景：

**移植内容：**
- `Scene.tsx` → 灯光系统（蓝紫点光源 + 月光 + 星空）
- `Building.tsx` / `BuildingFloor.tsx` → 3层楼体结构
- `rooms/` → OfficeRoom / LivingRoom / BedroomRoom
- `furniture/` → 所有家具组件
- `PostProcessing.tsx` → Bloom + Noise 后处理
- `HUD` → 迁移为右侧面板顶部的楼层控制栏

**调整：**
- Canvas 区域：占据右侧 `65%` 宽度、全高
- 背景色延续 `#0a0812`（myself2 深色调）
- 楼层按钮样式对齐 `DESIGN_STYLE.md`：橙色 `#F05A28` 强调激活态
- 原 `neon-btn` active 态改为橙色系

### 3.4 底部横向滚动栏 —— 大家的 Agent 进度

**样式：**
- 固定高度 `160px`，`overflow-x: auto`，横向滚动
- 背景：`#0A0A0A` + 顶部细线 `border-t border-[#2A2A2A]`

**进度卡片（每个参赛者一张）：**
```
┌────────────────────┐
│  [头像]  姓名      │
│  Project: xxx      │
│  🟠 Phase 2 进行中 │
│  Agent 最新消息预览 │
│  需求：xxx         │
└────────────────────┘
```
- 卡片倾斜 `rotate: ±2°`，散落感（对齐 DESIGN_STYLE 浮动卡片系统）
- Hover：卡片回正 + 上移 4px + 橙色边框光晕
- 点击展开：弹出 Modal 查看详细 Agent 进度

---

## 四、设计 Token（对齐 DESIGN_STYLE.md）

| Token | 值 |
|-------|----|
| `background` | `#0A0A0A` |
| `surface` | `#141414` |
| `border` | `#2A2A2A` |
| `accent` | `#F05A28` |
| `accent-light` | `#FF7A4A` |
| `text-primary` | `#FFFFFF` |
| `text-secondary` | `#A0A0A0` |
| `text-muted` | `#555555` |
| `3d-bg` | `#0a0812`（继承 myself2） |
| `neon-blue` | `#5189fb`（继承 myself2） |
| `neon-purple` | `#7b2fe8`（继承 myself2） |

---

## 五、组件拆分

```
src/app/workspace/
├── page.tsx                    # 主页面，布局骨架
├── plan.md                     # 本计划文档
└── components/
    ├── TopNav.tsx              # 顶部导航栏
    ├── AgentChat.tsx           # 左侧 Agent 对话
    ├── ProjectStatus.tsx       # 左侧项目状态卡片
    ├── BuildingScene/          # 右侧 3D（从 myself2 迁移）
    │   ├── index.tsx           # Canvas + Scene 封装
    │   ├── Scene.tsx
    │   ├── Building.tsx
    │   ├── BuildingFloor.tsx
    │   ├── PostProcessing.tsx
    │   ├── rooms/
    │   │   ├── OfficeRoom.tsx
    │   │   ├── LivingRoom.tsx
    │   │   └── BedroomRoom.tsx
    │   ├── furniture/
    │   │   └── ...（全部家具组件）
    │   └── lib/
    │       ├── constants.ts
    │       ├── materials.ts
    │       └── orbitState.ts
    ├── FloorControls.tsx       # 楼层切换 HUD（橙色强调样式）
    ├── TeamProgressBar.tsx     # 底部横向进度栏
    └── TeamCard.tsx            # 单个参赛者进度卡片
```

---

## 六、数据结构（Mock / 接口预留）

```ts
// Agent 消息
interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

// 项目状态
interface ProjectPhase {
  id: number;
  label: string;        // e.g. "Phase 1 · 环境搭建"
  status: 'done' | 'active' | 'pending';
  progress?: number;    // 0-100
}

// 团队成员进度卡片
interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  project: string;
  currentPhase: string;
  agentPreview: string;  // Agent 最新一条消息预览
  requirement: string;   // 需求描述
}
```

---

## 七、动效规范

| 动效 | 实现 |
|------|------|
| Agent 打字机 | `useEffect` + 字符逐个追加 |
| 卡片浮动 | `@keyframes float` + `animation: float 3s ease-in-out infinite` |
| Hover 上移 | `transition: transform 0.2s` + `translateY(-4px)` |
| 标题 Glitch | CSS `@keyframes glitch`，偶发触发 |
| 3D Bloom | `@react-three/postprocessing` Bloom 组件 |
| 3D 自动旋转 | `OrbitControls.autoRotate` |
| 楼层聚焦 | 相机位置直接 set（myself2 已实现） |

---

## 八、开发顺序

1. **Step 1**：搭建 `page.tsx` 三栏布局骨架（顶部 + 左右 + 底部）
2. **Step 2**：把 `myself2` 的 3D 代码完整迁移到 `BuildingScene/`
3. **Step 3**：实现 `AgentChat.tsx`，Mock 数据 + 打字机动效
4. **Step 4**：实现 `ProjectStatus.tsx`，卡片列表
5. **Step 5**：实现 `TeamProgressBar.tsx` + `TeamCard.tsx`
6. **Step 6**：实现 `TopNav.tsx`，Glitch 标题动效
7. **Step 7**：整体样式对齐，橙色强调色统一收拢
8. **Step 8**：动效打磨（卡片浮动、Hover 效果）

---

## 九、关键对齐点（检查项）

- [ ] 背景底色使用 `#0A0A0A`，非白/浅色
- [ ] 所有高亮、激活、CTA 使用橙色 `#F05A28`
- [ ] 3D 建筑背景保持 `#0a0812`（深紫黑，myself2 原色）
- [ ] 楼层激活按钮由 `neon-blue` 改为橙色
- [ ] 卡片统一使用 `rgba(255,255,255,0.05)` 半透明底 + `#2A2A2A` 边框
- [ ] 主标题带 Glitch 动效（至少 TopNav 处）
- [ ] 底部卡片有轻微倾斜散落感

---

*计划版本：v1.0 · 2026-04-08*
