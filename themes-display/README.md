# Themes Display

`nuo-video` 内置 10 套主题的**视觉样板房**。每一套都用同一份"内容"
（hero 数字 / 头条 / 副标题 / 三个章节卡 / mono 数据面板）实现出来，
方便快速比较气质差异、挑选最适合某个视频的主题。

## 怎么用

```bash
# 直接在浏览器打开（任选其一）
start themes-display/index.html           # Windows
open   themes-display/index.html          # macOS
xdg-open themes-display/index.html        # Linux
```

不需要 `npm install`、不需要 dev server —— 全部是独立 HTML，直接看。

## 文件结构

```
themes-display/
├── index.html               # 入口：10 主题卡片网格
├── README.md                # 本文件
│
├── midnight-press.html      # 暗色印刷  · 暖色暗底 + 热橙
├── paper-press.html         # 亮色印刷  · 暖奶油底 + 热橙
├── blueprint.html           # 蓝图      · 深藏青 + 青色
├── terminal-green.html      # 终端绿    · 纯黑 + 磷光绿
├── chalk-garden.html        # 粉笔花园  · 深石板 + 粉笔黄
├── bauhaus-bold.html        # 包豪斯    · 净色 + 主色蓝
├── newsroom.html            # 报社      · 报纸奶油 + 报头红
├── monochrome-print.html    # 黑白印刷  · 微暖白 + 墙墨蓝
├── sunset-zine.html         # 日落 Zine · 暖蜗色 + 玫红
└── warm-keynote.html        # 暖色 Keynote · 奶油纸 + 青色
```

## 页面结构（每个主题页都一致）

每个 HTML 独立分三块：

1. **theme-bar**：顶部导航条，包含 ← Gallery 链接、主题名（EN + 中文）、
   4 色色板（shell / surface / text / accent）。**所有主题共用同一份**，
   方便横向比较。

2. **stage**：1920×1080 固定舞台，通过 `aspect-ratio` + `min-width` 自适
   应到当前视口宽度。内部用同一份布局（hero 数字 / 头条 / 副标题 + 三个
   章节卡 + mono 数据面板）展示——这就是 `nuo-video` 录屏里"标准一页"
   的样子。

3. **theme-caption**：舞台下方的说明区，4 列：
   - **Description**：一句话讲气质（zh 字体 + 中文）
   - **Best for**：适用场景 tag
   - **Mood**：气质标签
   - **Design knobs**：5 行硬规则（hero / rule / card / surface / motion）

## 主题速查

| 主题 | 一句话 | 适合什么 |
|---|---|---|
| **midnight-press** 暗色印刷 | 暖色暗底 + 热橙 + 电影感 | 开发者教程 / AI 评测 / 极客向 |
| **paper-press** 亮色印刷 | 暖奶油底 + 热橙 + 杂志感 | 生活方式 / 温和教程 / 杂志型内容 |
| **blueprint** 蓝图 | 深藏青 + 青色 + IBM Plex Mono | 技术架构 / 系统拆解 / API SDK |
| **terminal-green** 终端绿 | 纯黑 + 磷光绿 + 全等宽 | CLI 教程 / 命令行实操 / 黑客安全 |
| **chalk-garden** 粉笔花园 | 深石板 + 粉笔黄 + 手写体 | 科普讲解 / 教学课堂 / 面向初学者 |
| **bauhaus-bold** 包豪斯 | 净色 + 主色蓝 + Archivo Black | 产品发布 / 观点宣言 / 设计演讲 |
| **newsroom** 报社 | 报纸奶油 + 报头红 + Playfair | 纪录片 / 深度评测 / 时事评论 |
| **monochrome-print** 黑白印刷 | 微暖白 + 墙墨蓝 + Source Serif | 深度阅读 / 学术 / 品牌故事 |
| **sunset-zine** 日落 Zine | 暖蜗色 + 玫红 + Fraunces | 生活 vlog / 小红书 / 创意分享 |
| **warm-keynote** 暖色 Keynote | 奶油纸 + 青色 + Inter | SaaS keynote / B 端产品 / 团队汇报 |

## 与源码主题的关系

`themes-display/` 是**展示层**，与 `nuo-video` 的实际 token 系统一一对应：

```
.claude/skills/nuo-video/themes/<id>/
├── theme.json       ← nameZh / descriptionZh / mood / bestFor / preview
└── tokens.css       ← --shell / --surface / --text / --accent / --r-card / ...
```

每个 HTML 都**真实使用**了对应主题的色值和字体 token（直接抄过来，不引
用），所以"看到的就是实际项目里会渲染出来的样子"。

## 改这里会发生什么

| 改什么 | 后果 |
|---|---|
| 改某个 `*.html` 里的 token 值 | 只影响该主题的样板展示，不影响实际项目 |
| 改 `.claude/skills/nuo-video/themes/<id>/tokens.css` | **实际项目**（所有 video 目录里 scaffold 出来的 presentation）会跟着变 |
| 改 `.claude/skills/nuo-video/themes/<id>/theme.json` | 影响 Checkpoint Plan 阶段 agent 给用户的主题推荐 |

> 这两套系统是**双向校准**的：展示页和实际 token 必须保持一致。如
> 果改了展示页的视觉但没改 tokens.css，下次 scaffold 出来的项目会和
> 展示页对不上。

## 已知约束

- **不响应式**：所有舞台固定 16:9，移动端会被缩放。录屏目标是桌面
  浏览器，移动端没有意义。
- **不完整覆盖章节动效**：展示页只展示"标准一页"，不含 step 切换动
  画、列表逐项揭示、点击交互。完整动效见 `videos/<slug>/presentation/`。
- **不引素材**：所有展示内容是字面量，不依赖 `article.md` 或外部资源。
- **不演示声音**：本目录纯视觉，跟 Phase 3 音频合成无关。

## 加新主题

在 `.claude/skills/nuo-video/themes/<my-theme>/` 下新建 `theme.json` +
`tokens.css` 后，在这里**加一份** `<my-theme>.html` 即可（结构照着
任一份已有 HTML 抄）。别忘了同时更新 `index.html` 加一张卡片。
