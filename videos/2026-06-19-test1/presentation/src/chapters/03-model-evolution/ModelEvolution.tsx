import type { ChapterStepProps } from "../../registry/types";
import "./ModelEvolution.css";

import glmLogo from "../../assets/vendor-logos/glm.png";
import minimaxLogo from "../../assets/vendor-logos/minimax.png";
import deepseekLogo from "../../assets/vendor-logos/DeepSeek.png";
import chatgptLogo from "../../assets/vendor-logos/chatGPT.png";
import claudeLogo from "../../assets/vendor-logos/Claude.png";
import openaiLogo from "../../assets/vendor-logos/OpenAI.png";

/**
 * 03 model-evolution — 模型版本演变（5 步 · 水平时间线）
 *
 * 主导动作（不同 step 的"主演示"各不一样）：
 *   step 0 — 双 hero 卡片入场（GLM 5 / MiniMax M2.5）
 *   step 1 — 版本号翻牌（5 → 5.1，2.5 → 2.7）+ 时间线推进到"春节前后"
 *   step 2 — 海外三连横向 stagger 入场 + 时间线亮 pulse
 *   step 3 — DeepSeek V4 占位卡 "?" + 时间线画"虚线等待"段
 *   step 4 — 占位卡翻牌揭晓 → DeepSeek V4，时间线 4-5 月节点亮起
 *
 * 视觉演示：底部水平时间线 SVG 自绘，三时间点（Jan / Spring / Apr-May），
 * 当前 step 节点高亮（accent + glow），前序节点灰化保留作上下文。
 */

type MilestoneId = "jan" | "spring" | "aprmay";

interface Milestone {
  id: MilestoneId;
  label: string;
  zh: string;
}

/** 时间线上三个时间点（x 坐标归一化到 0..100 区间，渲染时再乘画布宽度）。 */
const MILESTONES: Milestone[] = [
  { id: "jan", label: "JAN", zh: "一月初" },
  { id: "spring", label: "SPRING FESTIVAL", zh: "春节前后" },
  { id: "aprmay", label: "APR — MAY", zh: "今年 4–5 月" },
];

/** 不同 step 下，哪些节点视为"已发生 / 当前 / 未发生"。 */
const STEP_FOCUS: Record<number, { past: MilestoneId[]; current: MilestoneId; future: MilestoneId[] }> = {
  0: { past: [], current: "jan", future: ["spring", "aprmay"] },
  1: { past: ["jan"], current: "spring", future: ["aprmay"] },
  2: { past: ["jan", "spring"], current: "spring", future: ["aprmay"] },
  3: { past: ["jan", "spring"], current: "spring", future: ["aprmay"] },
  4: { past: ["jan", "spring"], current: "aprmay", future: [] },
};

/** 底部时间线（每步都画；当前节点高亮，前序 ghost）。 */
function Timeline({ step }: { step: number }) {
  const focus = STEP_FOCUS[step];
  const W = 1640; // 画布可用宽（对应 1920 - 2 × stage-pad-x 140）
  const H = 120;
  const PAD_X = 60;
  const trackY = 60;
  const innerW = W - PAD_X * 2;

  return (
    <div className="me-timeline-wrap">
      <svg
        className="me-timeline"
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        aria-hidden
      >
        {/* base rule */}
        <line
          className="me-track"
          x1={PAD_X}
          x2={W - PAD_X}
          y1={trackY}
          y2={trackY}
        />

        {/* 已发生段（实线 accent） */}
        {focus.past.includes("jan") && focus.past.includes("spring") && (
          <line
            className="me-track is-past"
            x1={PAD_X + (innerW * 0) / 2}
            x2={PAD_X + (innerW * 1) / 2}
            y1={trackY}
            y2={trackY}
            style={{ animationDelay: "0ms" }}
          />
        )}
        {focus.past.includes("jan") && !focus.past.includes("spring") && (
          <line
            className="me-track is-past"
            x1={PAD_X + (innerW * 0) / 2}
            x2={PAD_X + (innerW * 1) / 2}
            y1={trackY}
            y2={trackY}
          />
        )}
        {/* 当前段（虚线等待 — step 3 专用） */}
        {step === 3 && (
          <line
            className="me-track is-waiting"
            x1={PAD_X + (innerW * 1) / 2}
            x2={PAD_X + (innerW * 2) / 2}
            y1={trackY}
            y2={trackY}
          />
        )}
        {/* 当前到未来段：step 1/2 时也画半截，step 4 时全部 past */}
        {step >= 1 && step < 4 && focus.current === "spring" && (
          <line
            className="me-track is-past-half"
            x1={PAD_X + (innerW * 1) / 2}
            x2={PAD_X + (innerW * 1) / 2 + 60}
            y1={trackY}
            y2={trackY}
          />
        )}
        {step === 4 && (
          <line
            className="me-track is-past"
            x1={PAD_X + (innerW * 1) / 2}
            x2={PAD_X + (innerW * 2) / 2}
            y1={trackY}
            y2={trackY}
          />
        )}

        {/* 节点 */}
        {MILESTONES.map((m, i) => {
          const cx = PAD_X + (innerW * i) / 2;
          const isCurrent = focus.current === m.id;
          const isPast = focus.past.includes(m.id);
          const isFuture = focus.future.includes(m.id);
          const cls = isCurrent
            ? "me-node is-current"
            : isPast
              ? "me-node is-past"
              : "me-node is-future";
          return (
            <g key={m.id} className={cls}>
              {/* halo */}
              {isCurrent && <circle className="me-node-halo" cx={cx} cy={trackY} r={22} />}
              <circle className="me-node-dot" cx={cx} cy={trackY} r={9} />
              <text
                className="me-node-label"
                x={cx}
                y={trackY - 28}
                textAnchor="middle"
              >
                {m.label}
              </text>
              <text
                className="me-node-zh"
                x={cx}
                y={trackY + 38}
                textAnchor="middle"
              >
                {m.zh}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ModelEvolution({ step }: ChapterStepProps) {
  // ── 章节统一的 kicker + 时间线 footer ──
  const header = (
    <>
      <div className="me-kicker">
        <span className="dot-accent" />
        <span className="label-mono">Chapter 03 · Model Evolution</span>
        <span className="me-kicker-rule" />
        <span className="label-mono me-kicker-step">Step {step + 1} / 5</span>
      </div>
    </>
  );

  // ── step 0 — 一月初：双 hero 卡片入场 ──
  if (step === 0) {
    return (
      <div className="me-scene">
        <div className="me-body">
          {header}
          <h1 className="me-title">
            <span className="me-title-cn">一月初，</span>
            <span className="me-title-it">还是它们当家。</span>
          </h1>
          <p className="me-sub">主力模型双雄 ——</p>

          <div className="me-cards-row">
            <article className="me-card me-card-hero">
              <div className="me-card-logo">
                <img src={glmLogo} alt="GLM" />
              </div>
              <div className="me-card-meta">
                <span className="me-card-tag">GLM</span>
                <span className="me-card-vendor">智谱 AI</span>
              </div>
              <div className="me-card-version">
                <span className="me-card-version-num hero-num">5</span>
              </div>
            </article>

            <div className="me-plus" aria-hidden>
              <span className="me-plus-mark">+</span>
            </div>

            <article className="me-card me-card-hero">
              <div className="me-card-logo">
                <img src={minimaxLogo} alt="MiniMax" />
              </div>
              <div className="me-card-meta">
                <span className="me-card-tag">M-SERIES</span>
                <span className="me-card-vendor">MiniMax</span>
              </div>
              <div className="me-card-version">
                <span className="me-card-version-prefix hero-num">M</span>
                <span className="me-card-version-num hero-num">2.5</span>
              </div>
            </article>
          </div>
        </div>

        <Timeline step={step} />
      </div>
    );
  }

  // ── step 1 — 春节前后：版本号翻牌 ──
  if (step === 1) {
    return (
      <div className="me-scene">
        <div className="me-body">
          {header}
          <h1 className="me-title">
            <span className="me-title-cn">春节前后，</span>
            <span className="me-title-it">双版本同时升级。</span>
          </h1>
          <p className="me-sub">年前那一波 ——</p>

          <div className="me-cards-row">
            <article className="me-card me-card-hero">
              <div className="me-card-logo">
                <img src={glmLogo} alt="GLM" />
              </div>
              <div className="me-card-meta">
                <span className="me-card-tag">GLM</span>
                <span className="me-card-vendor">智谱 AI</span>
              </div>
              <div className="me-card-version me-card-flip">
                <span className="me-card-version-old hero-num">5</span>
                <span className="me-card-version-arrow" aria-hidden>→</span>
                <span className="me-card-version-new hero-num">5.1</span>
              </div>
            </article>

            <div className="me-plus" aria-hidden>
              <span className="me-plus-mark">+</span>
            </div>

            <article className="me-card me-card-hero">
              <div className="me-card-logo">
                <img src={minimaxLogo} alt="MiniMax" />
              </div>
              <div className="me-card-meta">
                <span className="me-card-tag">M-SERIES</span>
                <span className="me-card-vendor">MiniMax</span>
              </div>
              <div className="me-card-version me-card-flip">
                <span className="me-card-version-prefix hero-num">M</span>
                <span className="me-card-version-old hero-num">2.5</span>
                <span className="me-card-version-arrow" aria-hidden>→</span>
                <span className="me-card-version-new hero-num">2.7</span>
              </div>
            </article>
          </div>
        </div>

        <Timeline step={step} />
      </div>
    );
  }

  // ── step 2 — 海外集中更新三连 ──
  if (step === 2) {
    return (
      <div className="me-scene">
        <div className="me-body">
          {header}
          <h1 className="me-title">
            <span className="me-title-cn">海外也没闲着 ——</span>
            <span className="me-title-it">同一时间，三连更新。</span>
          </h1>
          <p className="me-sub">竞争非常激烈。</p>

          <div className="me-cards-row me-cards-row-three">
            <article className="me-card me-card-overseas me-card-overseas-1">
              <div className="me-card-logo me-card-logo-light">
                <img src={chatgptLogo} alt="ChatGPT" />
              </div>
              <div className="me-card-meta">
                <span className="me-card-tag">OPENAI</span>
                <span className="me-card-vendor">ChatGPT</span>
              </div>
              <div className="me-card-version">
                <span className="me-card-version-num hero-num">5.3X</span>
              </div>
            </article>

            <article className="me-card me-card-overseas me-card-overseas-2">
              <div className="me-card-logo me-card-logo-light">
                <img src={openaiLogo} alt="OpenAI" />
              </div>
              <div className="me-card-meta">
                <span className="me-card-tag">OPENAI</span>
                <span className="me-card-vendor">Codex</span>
              </div>
              <div className="me-card-version me-card-version-rotate">
                <span className="me-card-version-num hero-num">↻</span>
                <span className="me-card-version-suffix">update</span>
              </div>
            </article>

            <article className="me-card me-card-overseas me-card-overseas-3">
              <div className="me-card-logo me-card-logo-light">
                <img src={claudeLogo} alt="Claude" />
              </div>
              <div className="me-card-meta">
                <span className="me-card-tag">ANTHROPIC</span>
                <span className="me-card-vendor">Claude</span>
              </div>
              <div className="me-card-version">
                <span className="me-card-version-prefix hero-num">Opus</span>
                <span className="me-card-version-num hero-num">4.6</span>
              </div>
            </article>
          </div>
        </div>

        <Timeline step={step} />
      </div>
    );
  }

  // ── step 3 — DeepSeek V4 跳票悬念：占位卡 + 时间线虚线等待 ──
  if (step === 3) {
    return (
      <div className="me-scene">
        <div className="me-body">
          {header}
          <h1 className="me-title">
            <span className="me-title-cn">那阵子天天在问 ——</span>
            <span className="me-title-it">DeepSeek V4 到底什么时候？</span>
          </h1>
          <p className="me-sub">春节期待 → 始终没出。</p>

          <div className="me-cards-row me-cards-row-solo">
            <article className="me-card me-card-tba">
              <div className="me-card-logo me-card-logo-faded">
                <img src={deepseekLogo} alt="DeepSeek" />
              </div>
              <div className="me-card-meta">
                <span className="me-card-tag">DEEPSEEK</span>
                <span className="me-card-vendor me-card-vendor-mute">V 系列</span>
              </div>
              <div className="me-card-version me-card-version-tba">
                <span className="me-card-tba-mark hero-num">?</span>
                <span className="me-card-tba-label">TBA</span>
              </div>
              <div className="me-card-tba-pulse" aria-hidden />
            </article>
          </div>

          <div className="me-quote">
            <span className="me-quote-it">“The community keeps asking — when?”</span>
          </div>
        </div>

        <Timeline step={step} />
      </div>
    );
  }

  // ── step 4 — V4 揭晓：占位卡翻成 DeepSeek V4，时间线 4-5 月节点亮起 ──
  return (
    <div className="me-scene">
      <div className="me-body">
        {header}
        <h1 className="me-title">
          <span className="me-title-cn">等到四五月份 ——</span>
          <span className="me-title-it">它终于跑出来了。</span>
        </h1>
        <p className="me-sub">DeepSeek V4 · 压轴登场</p>

        <div className="me-cards-row me-cards-row-solo">
          <article className="me-card me-card-tba me-card-reveal">
            <div className="me-card-logo">
              <img src={deepseekLogo} alt="DeepSeek" />
            </div>
            <div className="me-card-meta">
              <span className="me-card-tag me-card-tag-accent">DEEPSEEK</span>
              <span className="me-card-vendor">V 系列 · 终于</span>
            </div>
            <div className="me-card-version">
              <span className="me-card-version-prefix hero-num">V</span>
              <span className="me-card-version-num hero-num me-card-version-reveal">4</span>
            </div>
            <div className="me-card-reveal-glow" aria-hidden />
          </article>
        </div>

        <div className="me-quote">
          <span className="me-quote-it">迟到了，但没缺席。</span>
        </div>
      </div>

      <Timeline step={step} />
    </div>
  );
}