# 设计风格总结

> 基于两张参考图的视觉风格分析，用于指导本项目 UI 开发方向。

---

## 图一：Glitch Loading Screen（故障艺术加载页）

### 整体风格
**暗黑故障艺术（Dark Glitch Art）** —— 极简、实验性、反传统的视觉语言。

### 色彩系统
| 元素 | 颜色 |
|------|------|
| 背景 | 纯黑 `#000000` |
| 文字/元素 | 纯白 `#FFFFFF` |
| 整体配色 | 极端高对比，仅黑白双色 |

### 排版特征
- 超大字重 Display 字体，字形被**故意拉伸、错位、撕裂**
- 字母间距极度不规则，呈现**解构主义排版**
- 文字倾斜约 **-10° ~ -15°**，破坏水平秩序感
- 字形残缺、断裂，模拟 **CRT 屏幕扫描线故障**

### 动效特征（推断）
- 文字竖向错位扭曲（Vertical Displacement）
- 扫描线噪声叠加（Scanline Noise Overlay）
- 随机闪烁与像素抖动（Random Flicker）
- 加载进度条配合故障动画出现（底部 `12%`）

### 设计关键词
`Brutalism` · `Glitch Art` · `Deconstructivism` · `Cyberpunk` · `Raw` · `Experimental`

---

## 图二：Trestle AI SaaS 官网（深色现代 SaaS）

### 整体风格
**Premium Dark SaaS（高端暗色科技感）** —— 专业、克制、现代，带有温暖橙色点缀的 AI 科技品牌风格。

### 色彩系统
| 元素 | 颜色 |
|------|------|
| 背景 | 深炭黑 `#0D0D0D` ~ `#1A1410` |
| 主标题 | 纯白 `#FFFFFF` |
| 强调色 / 高亮 | 橙色 `#F05A28` ~ `#FF6B35` |
| CTA 按钮 | 橙色填充 + 白色文字 |
| 卡片背景 | 深灰半透明 `rgba(255,255,255,0.05)` |
| 标签/徽章 | 细边框圆角胶囊，低饱和度灰 |

### 排版特征
- **主标题**：衬线 + 无衬线混合，超大字号（Hero 区域 60–80px+）
- **"AI Workforce"** 使用橙色渐变作为视觉焦点
- **导航**：小字号无衬线，间距宽松，层次清晰
- **标签/角色名**：全大写（ALL CAPS），字间距加宽，使用胶囊形边框包裹

### 版式布局
- 顶部固定导航栏，Logo 居左，导航居中，行动按钮居右
- Hero 区域文案居中，副标题使用较小的 Badge 标签作为超级标题（Eyebrow）
- 核心视觉：**浮动卡片组**，卡片倾斜不同角度（`rotate: ±15°`），呈散落感
- Agent 卡片包含：插画头像 + 全大写角色标签 + 简短描述文字

### 插画/视觉元素
- AI 角色采用**日系赛博插画风格**（Anime × Cyberpunk），色彩鲜艳
- 圆形头像裁切，带有细边框光晕
- 品牌 Logo 墙（Trusted By）：灰白色，低调展示权威背书

### 动效特征（推断）
- 卡片浮动悬浮动画（float keyframe）
- Hover 时卡片轻微上移 + 光晕增强
- 滚动触发淡入（Scroll-triggered fade-in）

### 设计关键词
`Dark SaaS` · `AI Tech` · `Orange Accent` · `Floating Cards` · `Anime Illustration` · `Premium` · `Modern`

---

## 融合设计方向建议

本项目可融合两种风格，形成独特视觉调性：

```
暗黑底色（图二）+ 故障艺术动效点缀（图一）= 高端赛博 AI 品牌风格
```

### 核心设计原则

| 原则 | 说明 |
|------|------|
| 🖤 **底色基调** | 纯黑/深炭黑为主，拒绝浅色 |
| 🟠 **橙色强调** | 唯一高饱和强调色，用于 CTA、关键词高亮 |
| ⚡ **故障点缀** | 在 Loading、Hero 标题等节点使用 Glitch 效果 |
| 🃏 **卡片系统** | 浮动倾斜卡片，增强空间层次感 |
| 🔤 **混合字体** | 衬线大标题 + 无衬线正文，层次分明 |
| 🎨 **插画元素** | AI 角色使用赛博插画风头像 |

### 推荐 Tailwind 颜色配置

```js
// tailwind.config.ts
colors: {
  background: '#0A0A0A',
  surface:    '#141414',
  border:     '#2A2A2A',
  accent:     '#F05A28',
  'accent-light': '#FF7A4A',
  text: {
    primary:   '#FFFFFF',
    secondary: '#A0A0A0',
    muted:     '#555555',
  }
}
```

---

## 📖 来源三：BlogNow —— 动能橙技术粗野主义（Kinetic Orange Tech-Brutalism）

> 分析来源：`D:\Code\hackathon\blogNow` 实际源码
> 风格定名：**动能橙技术粗野主义（Kinetic Orange Tech-Brutalism）** + 30% ACG/Anime 表达

---

### 3.1 核心视觉语言

**与图一、图二最大的不同**：blogNow 是主动的"反叛者" —— 它刻意对抗当代 UI 的圆润、毛玻璃、阴影层级，用暴力美学重建视觉秩序。

| 特征 | 描述 | 实现方式 |
|------|------|---------|
| **零圆角** | 卡片/图片/区块全直角（0px border-radius） | `rounded-none`，`border-2 border-black` |
| **粗边框** | 普遍使用 `4px` 黑色实线边框 | `border-[4px] border-black` |
| **无阴影层级** | 拒绝 `box-shadow` 产生的深度感 | 改用偏移投影 `shadow-[8px_8px_0_#000]`（实心硬投影）|
| **纯黑底色** | `#000000`，非"深灰"而是绝对黑 | `bg-black` |
| **高对比品牌橙** | `#FF4D00` / `#FF6600`，高饱和单一强调色 | CSS Token `--color-brand: #FF4D00` |

---

### 3.2 色彩系统

```
背景色：  #000000（绝对黑）
强调色：  #FF4D00（品牌橙，所有 CTA、高亮、装饰）
辅助橙：  #FF6600（Boot Screen 橙色，略深）
文字白：  #FFFFFF
文字灰：  rgba(255,255,255,0.8) / rgba(255,255,255,0.2)
选中高亮：黑底 + 品牌橙文字（::selection）
```

**颜色哲学**：三色极简主义 —— 黑 + 白 + 橙。没有蓝、绿、紫等中间色，所有视觉焦点靠品牌橙单挑。

---

### 3.3 字体排版体系

blogNow 使用严格的**三字体分层**策略：

| 层级 | 字体 | 用途 | 特征 |
|------|------|------|------|
| **Display** | `Archivo Black` | 大标题、Marquee | 全大写 `uppercase`、字间距 `-0.04em`、行高 `0.9` —— 海报感 |
| **Mono** | `Space Mono` | 日期、标签、代码、技术数据 | 字间距 `-0.02em`，强化代码文化 |
| **Body** | `Inter` | 正文、摘要、读者向文本 | 克制，保证易读性 |

```css
/* CSS 实现 */
@utility text-display {
  font-family: 'Archivo Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.9;
}
@utility text-mono {
  font-family: 'Space Mono', monospace;
  letter-spacing: -0.02em;
}
```

---

### 3.4 动效系统（核心特色）

blogNow 的动效不是"装饰"，而是核心**品牌表达**：

#### A. 文字跑马灯（Marquee）
```css
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
/* 20s 匀速，品牌橙背景的倾斜滚动字幕带 */
animation: marquee 20s linear infinite;
```
- 内容：`WELCOME TO MY WORLD ✦ CREATIVE CODER ✦ ...`
- 使用 `skewY(-6deg)` 将整段 Marquee 区域倾斜，增加动势
- 颜色：品牌橙字 + 黑色背景

#### B. 几何自转（Spin）
```css
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
animation: spin-slow 12s linear infinite;
```
- 用于底部"SCROLL DOWN"环形文字 SVG，缓慢旋转
- 也用于徽标、小几何装饰元素

#### C. 卡片弹出（Card Pop-in）
```css
@keyframes card-pop-in {
  0%   { transform: scale(0); opacity: 0; }
  70%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
```
- Boot 完成后依次触发，配合 `animationDelay` 交错出现
- 弹性入场，配合 `cubic-bezier(0.34, 1.56, 0.64, 1)` 超弹曲线

#### D. GSAP 英雄字符分拆动画
```ts
// 将标题拆成单个字符，从 y:280 滑入
gsap.to(chars, {
  y: 0, opacity: 1,
  duration: 0.44,
  stagger: 0.032,
  ease: 'expo.out',
})
```
- 每个字符独立动画，stagger `0.032s`，形成波浪式入场
- 与 BootScreen 联动：Boot 结束后才触发

#### E. FaultyTerminal 故障终端背景（WebGL Shader）
```
组件：FaultyTerminalBackground（OGL WebGL 渲染）
特性：
  - GLSL Fragment Shader 实时绘制数字点阵波纹
  - scanlineIntensity: 扫描线强度
  - glitchAmount: 横向故障位移量
  - flickerAmount: 闪烁频率
  - chromaticAberration: 色差偏移
  - curvature: CRT 桶形畸变
  - mouseReact: 鼠标悬停涟漪效果（平滑插值）
  - pageLoadAnimation: 入场时从左到右随机格子显现
  - tint: 颜色染色（Boot Screen 中使用 #FF6600 橙色）
```
这是 blogNow 最重量级的动效资产，页面冲击力的核心来源。

#### F. Framer Motion 页面过渡
```ts
// BootScreen 退场
exit: {
  y: '-100%', opacity: 0, filter: 'blur(10px)',
  transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
}
// Log 行入场
initial: { opacity: 0, x: -12 }
animate: { opacity: 1, x: 0 }
transition: { duration: 0.2 }
```

---

### 3.5 交互规范

| 交互类型 | 处理方式 |
|---------|---------|
| **Hover** | 硬翻转（白底变黑，橙字变白）或偏移位移，绝对不做渐变阴影 |
| **卡片 Hover** | `translateY(-2px) translateX(-2px)` + 硬投影变为 `16px 16px` |
| **Active/Press** | 消除偏移，`translate(0, 0)` + `shadow none`，有按压感 |
| **文字选中** | `::selection { background: #000; color: #FF4D00; }` |
| **链接 Hover** | 背景白色填充，文字变黑（极端对比反转） |
| **导航激活态** | `bg-white text-black`（白底黑字胶囊），非橙色 |

---

### 3.6 UI 组件规范

#### BrutalistCard（粗野卡片）
```tsx
const variants = {
  default: 'border-2 border-white/20 bg-transparent',  // 暗底透明
  dark:    'border-2 border-black bg-black',           // 全黑
  brand:   'border-2 border-brand bg-brand text-black', // 橙色高亮
}
```

#### EssayCard（文章列表项）
- **进入动效**：整行背景从左向右填满白色（`scale-x-0 → scale-x-100`）
- 悬浮时：序号数字从镂空 → 品牌橙填充；标题 / 日期从白色 → 黑色
- 序号使用 `[-webkit-text-stroke]` 实现镂空文字效果

#### Navbar（导航栏）
- 中部：悬浮胶囊形导航条，`bg-black border-white/20 rounded-full`
- 激活项：`bg-white text-black`（反转，不用橙色）
- 社交链接：hover 时 `bg-white text-black`
- 移动端：全屏黑底遮罩，Archivo Black 超大文字导航

#### BootScreen（开机动画）
```
布局：左 1/3 log 文字 | 竖线（橙色）| 右 2/3 点阵背景 + ACCESS GRANTED
配色：橙色 #FF6600 log 文字，白色已完成行，金色 [OK]
文字：Space Mono，全大写，tracking-[0.3em]
退场：整屏向上滑走 + blur(10px)，0.8s
```

#### 散落卡片布局（Bento）
- 卡片带轻微旋转 `rotate-1` / `-rotate-2` / `-rotate-3`（1°–3°）
- 每列不同高度，视觉上的"散落感"
- 硬投影统一：`shadow-[8px_8px_0_#000]`

---

### 3.7 滚动条规范

```css
::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: #000000; }
::-webkit-scrollbar-thumb { background: #FF4D00; border-radius: 0; }  /* 零圆角！*/
::-webkit-scrollbar-thumb:hover { background: #ff6a2a; }
```
注意：滑块**零圆角**，与整体零圆角哲学一致。

---

### 3.8 与本项目（now）的融合建议

blogNow 的粗野美学可以为 `now` 项目带来以下增强点：

| blogNow 元素 | 如何融合进 now |
|-------------|--------------|
| FaultyTerminal WebGL 背景 | 可作为 Workspace 右侧 3D 建筑的底层叠加效果（低透明度 `mix-blend-screen`） |
| BootScreen | 整体迁移，作为 `/workspace` 页面首次进入的开机动效 |
| Marquee 跑马灯 | 在底部 Team Progress 栏下方或 TopNav 下方增加一条橙色 Marquee 带 |
| Card Pop-in 弹出动画 | TeamCard 入场动效替换为 Pop-in + stagger |
| GSAP 字符分拆 | TopNav "WORKSPACE" 标题首次渲染时逐字符弹入 |
| 硬偏移投影 | AgentChat 用户消息气泡改为 `shadow-[4px_4px_0_#F05A28]`，强化橙色系 |
| 散落卡片旋转 | TeamCard 的 `rotate(±2deg)` 已对齐，继续保持 |
| `::selection` | 全局文字选中改为 `background:#000; color:#F05A28` |

---

### 3.9 技术栈参考

| 功能 | 技术 |
|------|------|
| 动效编排 | **GSAP** （字符动画、时间线） |
| 页面过渡 | **Framer Motion**（AnimatePresence、exit 动画）|
| WebGL 背景 | **OGL**（轻量 WebGL，FaultyTerminal Shader） |
| 样式系统 | **Tailwind CSS v4** + `@utility` 自定义工具类 |
| 状态管理 | **Zustand**（全局 boot 状态） |

---

*最后更新：2026-04-08（新增 blogNow 分析）*
