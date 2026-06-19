import type { Narration } from "../../registry/types";

/**
 * 02 landscape — 厂商全景
 *
 * 数组长度 === step 数 === 2（必须与 Landscape.tsx 里 step 分支数严格相等）。
 */
export const narrations: Narration[] = [
  // step 0 — 国内 7 家厂商
  "国内这几家我都盯着：GLM、Minimax、DeepSeek、千问、Kimi，还有阶跃星辰、豆包。",
  // step 1 — 国外三大头
  "国外就三大头：Anthropic、OpenAI、Google。",
];