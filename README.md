# video-studio

B 站 UP 主 **圣徒城的小诺** 的视频生产仓库。

把文章 / 口播稿做成可录屏的 16:9 网页演示（Vite + React + TypeScript），录屏后产出视频。不是传统幻灯片 —— 是为录屏设计的视频舞台。

---

## 仓库地图

```
video-studio/
├── CLAUDE.md                       ← 给 Claude Code 看的协作指令（agent 调度 / 调度流）
├── README.md                       ← 本文件（人类看）
├── .claude/
│   ├── agents/                     ← 6 个自定义 subagent 定义
│   └── skills/nuo-video/           ← 核心 Skill
│       ├── SKILL.md                ← Skill 主入口（4 阶段工作流）
│       ├── references/             ← 各阶段参考文档（SCRIPT-STYLE / OUTLINE-FORMAT / CHAPTER-CRAFT …）
│       ├── scripts/                ← 脚手架脚本（scaffold.sh）
│       ├── templates/              ← Vite + React + TS 模板
│       ├── themes/                 ← 10 套内置主题（paper-press / midnight-press / terminal-green …）
│       └── assets/                 ← 全局共享素材（up-brand / vendor-logos / mascots）
└── videos/                         ← 每个视频一个子目录
    └── <YYYY-MM>-<slug>/
        ├── article.md              ← 原始文章（如有）
        ├── script.md               ← 口播稿（draft-organizer 产出）
        ├── outline.md              ← 视觉设计稿（visual-designer 产出）
        └── presentation/           ← Vite 项目（page-developer 工作区）
```

---

## 怎么做一个视频

```bash
# 1. 新建目录
mkdir -p videos/2026-06-my-topic

# 2. 脚手架（默认主题午夜报刊，按需改 --theme=）
bash .claude/skills/nuo-video/scripts/scaffold.sh \
  ./videos/2026-06-my-topic/presentation --theme=midnight-press

# 3. 启动 dev server 预览（默认 5174 端口，被占会顺延）
cd videos/2026-06-my-topic/presentation && npm run dev
```

完整流程（article → 口播稿 → 视觉稿 → 章节实现 → 录屏）在
[`.claude/skills/nuo-video/SKILL.md`](.claude/skills/nuo-video/SKILL.md)。

---

## 当前工作流：**纯手动**

```bash
cd videos/<slug>/presentation
npm run dev          # 浏览器预览，点 / 方向键推进 step
npx tsc --noEmit     # 改完代码先 typecheck

# 改完保存
cd ../../..
git add .
git commit -m "..."
git push
```

**没有 CI，没有自动部署。** 所有验证靠 dev server 浏览器预览 + tsc。

---

## 录屏

dev server 跑起来后两种模式：

- **手动**：浏览器访问 `localhost:5174`，点击 / 方向键 / 空格推进
- **全自动**：访问 `localhost:5174/?auto=1`，按 SPACE 启动后自动推进（适合配合已合成音频做一镜到底）

详细录屏工具 / 后期合成见 Skill 里的 `references/RECORDING.md`。

---

## CI 尝试记录（已删除，2026-06）

试过用 `.github/workflows/video-pipeline.yml` 自动跑 Phase 1+2 → 部署 GitHub
Pages，5 次 tag push（`v0.1` ~ `v0.5-2026-06-19-test2`）全部失败：

| # | 失败现象 | 原因 |
|---|---|---|
| 1 | `npm ci` 拒跑 | `.github/scripts/` 缺 `package-lock.json` |
| 2 | 找不到 `videos/<slug>/article.md` | workflow `working-directory` 错位（设为 `.github/scripts` 但脚本用相对路径读 `videos/`） |
| 3 | `MINIMAX_API_KEY env var is required` | 用户 secret 配错 |
| 4 | 找不到 `==========SCRIPT_BEGIN==========` 分隔符 | MiniMax-M3 是 reasoning 模型，吐 `<think>` 块没出正文 → 正则匹配失败 |
| 5 | LLM API `Connection error` | 跑了 13 分钟超时，网络 / 服务端问题 |

### 根因（也是删除的根本理由）

**纯 LLM API 路线没有 Claude Code 这种 harness，无法做"读完再写 / 错了重试 / 自检"的闭环。**

具体能力差距：

| 能力 | 纯 LLM API | Claude Code + Skill |
|---|---|---|
| 调 LLM 写稿 | ✅ | ✅ |
| 解析 skill 规则文档 | ⚠️ 把规则文本塞进 prompt | ✅ Agent 自己读 |
| 写代码质量 | ⚠️ 凭空写 | ✅ 读完脚手架再写 |
| 跑 `tsc` / `npm run build` 看错误 | ❌ | ✅ |
| 自检 checklist | ❌ | ✅ |
| **"硬节点"等用户验收** | ❌ 单次执行不回头 | ✅ Agent 循环停下来等输入 |
| 错误自动 debug | ❌ fail 就 fail | ✅ 重试 + 反思 |

skill 的核心工作流 ——

```
Phase 1 内容编写 → Checkpoint Plan（5 件事对齐）→ Phase 2 逐章实现 → 用户验收 → 下一章
```

**依赖 Agent 的循环模型**，不是 pipeline 单次执行能替代的。"硬节点等用户验收"这种交互在 CI 里要么做不到、要么得拆 job + workflow_dispatch 手动续跑，体验远不如本地 Claude Code。

### 如果以后想自动化

应该走 **Claude Code + Skill** 的路径（本地或自托管 agent 服务），不是 CI 里的裸 LLM 调用。GitHub Actions 适合做"已经产出的产物"的部署 / 校验，不适合做"需要多轮反馈"的生产。

---

## 常用命令速查

```bash
# 脚手架
bash .claude/skills/nuo-video/scripts/scaffold.sh --list-themes

# 开发
cd videos/<slug>/presentation
npm run dev
npx tsc --noEmit

# 音频合成（可选）
npm run extract-narrations
npm run synthesize-audio
```

---

## 内置主题

`paper-press` · `warm-keynote` · `midnight-press` · `blueprint` · `chalk-garden` · `terminal-green` · `bauhaus-bold` · `sunset-zine` · `newsroom` · `monochrome-print`

换主题：把 `.claude/skills/nuo-video/themes/<id>/tokens.css` 覆盖到 `videos/<slug>/presentation/src/styles/tokens.css`。