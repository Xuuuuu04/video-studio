import type { Narration } from "../../registry/types";

/**
 * Cold open — 反差钩子 + 邀请 + 话题预览
 *
 * 数组长度 === step 数 === 2（必须与 Coldopen.tsx 里 step 分支数严格相等）。
 */
export const narrations: Narration[] = [
  // step 0 — 反差钩子
  "这半年 AI 圈变化快到啥程度？这么说吧，年初大家还在抢模型版本号，现在抢的是 token 套餐。",
  // step 1 — 邀请 + 话题预览
  "你要是没跟上，我帮你捋一捋。这期跟上次一样，盘一下 2026 H1 的 AI 模型格局。我按月份捋，把模型演变、benchmark、订阅机制都串起来。",
];