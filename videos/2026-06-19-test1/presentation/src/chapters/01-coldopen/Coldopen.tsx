import type { ChapterStepProps } from "../../registry/types";
import "./Coldopen.css";

/**
 * 01 coldopen — 反差钩子 + 邀请 + 话题预览
 *
 * 主导动作：
 *   step 0 — 文字 + 箭头对比（静态入场 + 虚线流动）
 *   step 1 — 三个话题卡片 stagger 入场（带左侧 accent bar 生长）
 *
 * 视觉演示：
 *   step 0 — SVG 箭头虚线 dash 流动（CSS animation）
 *   step 1 — 三卡 stagger 入场 + accent bar 高度生长
 */
export default function Coldopen({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <div className="cd-scene">
        <div className="cd-hook">
          <div className="cd-kicker">
            <span className="dot-accent" />
            <span className="label-mono">Cold Open — H1 复盘</span>
          </div>

          <h1 className="cd-hook-question">
            这半年 AI 圈变化快到啥程度？
          </h1>

          <p className="cd-hook-sub">这么说吧 ——</p>

          <div className="cd-contrast">
            <div className="cd-contrast-cell is-past">
              <span className="cd-contrast-era">年初</span>
              <span className="cd-contrast-text">模型版本号</span>
            </div>

            <svg className="cd-arrow" viewBox="0 0 80 80" fill="none" aria-hidden>
              <line
                className="cd-arrow-line"
                x1="6"
                y1="40"
                x2="60"
                y2="40"
              />
              <polygon className="cd-arrow-head" points="60,30 76,40 60,50" />
            </svg>

            <div className="cd-contrast-cell is-now">
              <span className="cd-contrast-era">现在</span>
              <span className="cd-contrast-text">token 套餐</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // step 1 — 邀请 + 话题预览
  return (
    <div className="cd-scene">
      <div className="cd-invite">
        <div className="cd-kicker">
          <span className="dot-accent" />
          <span className="label-mono">本期三件事</span>
        </div>

        <h2 className="cd-invite-lead">
          你要是没跟上，我帮你捋一捋。
        </h2>

        <p className="cd-invite-sub">
          按月份串，把模型演变、benchmark、订阅机制都过一遍。
        </p>

        <div className="cd-topics">
          <article className="cd-topic">
            <span className="cd-topic-num">01</span>
            <h3 className="cd-topic-title">模型版本演变</h3>
            <span className="cd-topic-note">GLM · M2 · DS V4</span>
          </article>

          <article className="cd-topic">
            <span className="cd-topic-num">02</span>
            <h3 className="cd-topic-title">Benchmark 变化</h3>
            <span className="cd-topic-note">能力 · 跑分 · 实测</span>
          </article>

          <article className="cd-topic">
            <span className="cd-topic-num">03</span>
            <h3 className="cd-topic-title">订阅机制调整</h3>
            <span className="cd-topic-note">5h · 7d · Coding Plan</span>
          </article>
        </div>

        <div className="cd-cue">
          <span>Click anywhere to continue</span>
          <span style={{ fontFamily: "var(--font-display-en)", fontStyle: "italic", fontSize: 16 }}>→</span>
        </div>
      </div>
    </div>
  );
}