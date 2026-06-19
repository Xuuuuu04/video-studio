# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

B 站 UP 主 **圣徒城的小诺**（UID 150452545）的视频快速生产仓库。流程：用户录入讲解内容和节奏 → agent 调研补全 → 按讲解逻辑设计每页内容（注意信息密度、图表呈现） → 基于内置 Skill 模板开发视觉动效。

核心 Skill 在 `.claude/skills/web-video-presentation/`——把文章/口播稿变成点击驱动的 16:9 网页演示（Vite + React + TypeScript），通过录屏产出视频。不是传统幻灯片——更像为录屏设计的视频舞台。

## 仓库结构

```
video-studio/
├── CLAUDE.md                 # 本文件
├── .claude/skills/           # Agent Skill（模板 + 方法论，不随视频变）
│   └── web-video-presentation/
├── resources/                # 全局共享素材（LOGO、视觉锚点等）
│   ├── 大模型相关LOGO/
│   └── 视觉锚点/
└── videos/                   # 每个视频一个子目录
    ├── 2026-03-coding-god/   # 命名：YYYY-MM-<slug>
    │   ├── article.md        # 原始文章（如有）
    │   ├── script.md         # 口播稿
    │   ├── outline.md        # 开发计划
    │   └── presentation/     # scaffold 产出的 Vite 项目
    └── 2026-04-speed-test/
        └── ...
```

### 新建视频

```bash
# 1. 在 videos/ 下按日期命名建目录
mkdir -p videos/2026-06-my-topic

# 2. 在该目录下 scaffold（presentation/ 子目录会自动创建）
cd videos/2026-06-my-topic
bash ../../.claude/skills/web-video-presentation/scripts/scaffold.sh \
  ./presentation --theme=midnight-press

# 3. 开发
cd presentation && npm run dev
```

### 目录命名约定

`videos/<YYYY-MM>-<slug>/`——月份对齐发布排期，slug 用英文短横线。已发布的视频目录不要改名（outline/script 里可能有相对路径引用）。

### 共享素材引用

`resources/` 里的素材在视频项目中通过相对路径或手动复制使用。scaffold 产出的 Vite 项目只认 `public/` 和 `src/` 内的资源，需要的图从 `resources/` 拷到 `presentation/public/` 或 `presentation/src/assets/`。

## UP 主风格校准

**定位**：北大 SE，AI 编程 / Vibe Coding 深度横评赛道。标签体系固定为「新范式|深横评|实机测」。

**内容特征**：
- 口播 + 屏幕录制混合，信息密度极高，数据驱动
- 多模型/多平台系统横评（同一任务跑 5~45 个模型对比）
- 时长偏长（25~45 分钟），节奏紧凑不拖沓
- 标题吸睛但内容扎实（"买前必看！""别再被骗了！"开头，内容有实测数据支撑）
- 每期附带文档、笔记、代码等配套资源

**对视觉演示的影响**：
- 画面要能承载高密度信息——数据表格、模型对比矩阵、性能指标图表是常见元素
- 屏幕录制片段多，演示页需要和实录画面交替出现，视觉上不能跳戏
- 适合偏技术/偏数据的主题（blueprint、terminal-green、midnight-press），慎选花哨主题
- 每步信息量可以比普通科普视频更大，观众有技术背景能跟上

## 架构要点

### Skill 工作流

`.claude/skills/web-video-presentation/SKILL.md` 是 Agent Skill 的主入口，定义了完整的 4 阶段工作流和硬 checkpoint：

```
Phase 1  内容编写（article → script.md + outline.md）
  ↓ Checkpoint Plan（5 件事一次对齐）
Phase 2  网页开发（scaffold → 逐章实现）
  ↓ Checkpoint Audio
Phase 3  音频合成（可选，mmx-cli TTS）
Phase 4  录屏 + 后期
```

**每个 checkpoint 是硬节点**——agent 不能跳过，必须停下来等用户确认。

### 模板运行时架构

`.claude/skills/web-video-presentation/templates/` 是脚手架模板，被 `scaffold.sh` 复制到目标项目。核心机制：

- **全局 step 游标**：`useStepper` hook 维护 `(chapter, step)` 游标，localStorage 持久化。点击/键盘/Auto 模式共享一个推进函数
- **章节注册**：`src/registry/chapters.ts` 是章节注册中心，每个 `ChapterDef` 包含 `id`、`title`、`narrations[]`、`Component`
- **narrations.ts 是唯一真相源**：每章目录下的 `narrations.ts` 数组长度 = step 数，同时驱动运行时游标和音频合成管线。5 处（script/outline/章节代码/chapters.ts/音频文件）同步靠它
- **主题 token**：视觉属性走 CSS 变量（`src/styles/tokens.css`），换主题 = 覆盖这个文件
- **Stage 组件**：固定 1920×1080 坐标系 + `transform: scale()` 适配视口，无响应式

### 章节文件结构

```
src/chapters/<NN>-<id>/
  ├── <Chapter>.tsx      # 视觉实现，if (step === N) 分支
  ├── <Chapter>.css      # 章节独立 CSS（前缀隔离 .cd- / .mg- 等）
  └── narrations.ts      # step 口播文本数组
```

### references/ 按阶段分文件

不同阶段读不同的 reference 文件，不需要一次全读：

| 阶段 | 必读 |
|---|---|
| 写稿 | `SCRIPT-STYLE.md` + `OUTLINE-FORMAT.md` |
| 选主题 | `themes/*/theme.json` |
| 写章节 | **`CHAPTER-CRAFT.md`**（单一入口，含原则/决策树/反 AI 味/自检） |
| 音频 | `AUDIO.md` |
| 录屏 | `RECORDING.md` |

## 常用命令

### 脚手架（从仓库根目录）

```bash
# 创建新视频项目
mkdir -p videos/2026-06-my-topic && cd videos/2026-06-my-topic
bash ../../.claude/skills/web-video-presentation/scripts/scaffold.sh \
  ./presentation --theme=paper-press

# 列出可用主题
bash .claude/skills/web-video-presentation/scripts/scaffold.sh --list-themes
```

### 开发（在脚手架产出的项目目录内）

```bash
npm run dev                    # 启动 dev server（默认 5174 端口）
npx tsc --noEmit               # typecheck
```

### 音频合成（可选）

```bash
npm run extract-narrations     # 扫所有 narrations.ts → audio-segments.json
npm run synthesize-audio       # mmx-cli 合成 mp3 到 public/audio/
```

### 录屏模式

- 手动：`localhost:5174`（点击/方向键推进）
- 全自动：`localhost:5174/?auto=1`（SPACE 启动，自动播+推进）
- 按 M 键切换模式

## 关键约束

- **改了 chapters.ts 或 narrations.ts 长度** → 必须 bump `useStepper.ts` 的 `STORAGE_KEY` 版本号
- **章节 CSS 必须前缀隔离**（`.cd-` / `.mg-` 等），不能用裸类名
- **章节间颜色/字体走 token**，不能硬编码 hex/font-family
- **outline 不写具体动画**——留给章节实现时按 CHAPTER-CRAFT.md 决策树即时设计
- **每章必须有视觉演示**（CSS/SVG/Canvas/JS 动画），禁纯文字章节
- **逐步揭示**：列表/清单 1 项 = 1 step，禁一次全展示

## 内置主题

paper-press / warm-keynote / midnight-press / blueprint / chalk-garden / terminal-green / bauhaus-bold / sunset-zine / newsroom / monochrome-print

换主题：`cp themes/<id>/tokens.css <project>/src/styles/tokens.css`
