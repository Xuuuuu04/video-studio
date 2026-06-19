import type { Narration } from "../../registry/types";

/**
 * model-evolution — 模型版本演变，5 步时间线
 *
 * 数组长度 === step 数 === 5（必须与 ModelEvolution.tsx 里 step 分支数严格相等）。
 * 内容直接对齐 script.md 段 6–10，关键短语 / 数字 / 引用全部保留。
 */
export const narrations: Narration[] = [
  // step 0 — 一月初主力
  "一月初那会儿，主力还是 GLM 5 和 MiniMax M2.5。",
  // step 1 — 春节前后升级
  "春节前后两个版本同时升级 —— GLM 5.1、MiniMax M2.7。",
  // step 2 — 海外集中更新三连
  "海外也没闲着。同一时间 ChatGPT 5.3X、Codex、Claude Opus 4.6 都更新了一轮。竞争非常激烈。",
  // step 3 — DeepSeek V4 跳票悬念
  "那阵子大家天天在问：DeepSeek V4 啥时候出？",
  // step 4 — V4 终于跑出来
  "从春节一直等到今年四五月份，它才终于跑出来。",
];