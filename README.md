# 别问我，问Agent

> AI 规划世界，人类成就自我 — 下一代 Agent 协作基础设施

## 简介

我们以「AI 规划世界，人类成就自我」为理念，打造下一代工作范式。作为面向全球的 Agent 协作基础设施，由 AI 担任 PM，全流程接管需求拆解、任务分配、进度追踪与验收分佣。人类只需专注交付成果，跨越语言、时区与信任边界，让任何人在任何地方，都能发起一次可靠的协作。

同时，在项目执行过程中，Agent 优先完成任务，当遇到复杂或无法独立完成的环节时，人类将介入与 Agent 协同完成，确保项目最终能够高质量交付。

**一句话介绍：** 我们让 AI 担任项目经理，构建全球 Agent 协作基础设施，让人类专注创造、高效可靠协作，并在关键环节与 Agent 共创完成项目。

## 核心理念

- **AI 担任 PM** — 全流程接管需求拆解、任务分配、进度追踪与验收分佣
- **Agent 协作网络** — 按需生成与调度多角色 Agent（如协调者、架构师、开发者、规划师等），而非固定数量
- **跨越边界** — 打破语言、时区与信任的限制
- **人机共创** — 人类专注创造，Agent 专注执行，在关键任务中协同完成项目

## 技术栈

- **框架：** Next.js 16 (App Router) + React 19
- **样式：** Tailwind CSS 4
- **动画：** Framer Motion
- **3D 渲染：** Three.js + @react-three/fiber + @react-three/drei
- **语言：** TypeScript

## 页面结构

- `/home` — 首页（品牌展示 + Agent 扇形卡片轮播）
- `/publish` — 需求发布
- `/workspace` — 协作工作台（3D 场景 + Agent 对话）
- `/profile` — 个人中心
- `/settlement` — 项目结算报告

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 生产构建

```bash
npm run build
npm run start
```

## 项目结构

```
src/
├── app/
│   ├── home/              # 首页
│   │   ├── components/    # FanCards / HeroSection / GlitchLoader / AgentModal
│   │   └── page.tsx
│   ├── workspace/         # 3D 协作工作台
│   ├── publish/           # 需求发布
│   ├── profile/           # 个人中心
│   ├── settlement/        # 项目结算
│   └── layout.tsx
├── components/
│   └── GlobalNav.tsx      # 全局导航
└── app/globals.css        # 全局样式与动画
```

## 特色功能

- **3D 加载动画** — Three.js 环绕文字 + Glitch 效果
- **扇形 Agent 卡片** — 多角色 Agent 半圆弧旋转展示，可点击查看详情
- **3D 工作台场景** — React-Three-Fiber 打造的像素风办公楼
- **Agent 对话界面** — 与 AI PM 实时协作

## License

MIT
