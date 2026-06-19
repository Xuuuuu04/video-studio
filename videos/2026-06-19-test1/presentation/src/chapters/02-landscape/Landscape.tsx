import type { ChapterStepProps } from "../../registry/types";
import "./Landscape.css";

import glmLogo from "../../assets/vendor-logos/glm.png";
import minimaxLogo from "../../assets/vendor-logos/minimax.png";
import deepseekLogo from "../../assets/vendor-logos/DeepSeek.png";
import qwenLogo from "../../assets/vendor-logos/Qwen.png";
import kimiLogo from "../../assets/vendor-logos/kimi.png";
import stepfunLogo from "../../assets/vendor-logos/stepfun.png";
import doubaoLogo from "../../assets/vendor-logos/doubao.png";

import anthropicLogo from "../../assets/vendor-logos/anthropic.png";
import openaiLogo from "../../assets/vendor-logos/OpenAI.png";
import googleLogo from "../../assets/vendor-logos/google.png";

/**
 * 02 landscape — 厂商全景
 *
 * 主导动作：
 *   step 0 — 国内 7 家：左侧 hero 标题 + 右侧 4+3 logo 网格 stagger 入场
 *                  （每卡左侧 accent bar 高度生长 + 自身 fade-up）
 *   step 1 — 国外三大头：hero 三栏大字 + 副标 + accent 顶边条宽度生长
 *                  （每栏左侧 slide-in + 顶边条 width 0→100%）
 *
 * 视觉演示：
 *   step 0 — 7 张 logo 卡 stagger 入场（CSS animation，transform + opacity）
 *   step 1 — 3 张大卡 stagger 入场 + 顶边 accent 条宽度生长
 */
export default function Landscape({ step }: ChapterStepProps) {
  // ── step 0：国内 7 家厂商 ────────────────────────────────
  if (step === 0) {
    return (
      <div className="ls-scene">
        <div className="ls-kicker">
          <span className="dot-accent" />
          <span className="label-mono">Part 01 — Domestic Vendors</span>
        </div>

        <div className="ls-corner-mark">
          <span>02 · Landscape</span>
        </div>

        <div className="ls-cn">
          {/* 左：标题区 */}
          <div className="ls-cn-lead">
            <h2 className="ls-cn-h">
              国内这几家 <span className="em">都盯着</span>
            </h2>

            <p className="ls-cn-sub">
              上半年最活跃的几家 —— 一线主力加新势力，全都跑了一遍。
            </p>

            <div className="ls-cn-stat">
              <span className="ls-cn-stat-num">7</span>
              <span className="ls-cn-stat-label">Domestic Vendors in Play</span>
            </div>
          </div>

          {/* 右：4 + 3 logo 网格 */}
          <div className="ls-cn-grid">
            <article className="ls-vendor">
              <img className="ls-vendor-logo" src={glmLogo} alt="GLM" />
              <span className="ls-vendor-name">GLM</span>
              <span className="ls-vendor-tag">智谱</span>
            </article>

            <article className="ls-vendor">
              <img className="ls-vendor-logo" src={minimaxLogo} alt="Minimax" />
              <span className="ls-vendor-name">Minimax</span>
              <span className="ls-vendor-tag">月之暗面</span>
            </article>

            <article className="ls-vendor">
              <img className="ls-vendor-logo" src={deepseekLogo} alt="DeepSeek" />
              <span className="ls-vendor-name">DeepSeek</span>
              <span className="ls-vendor-tag">深度求索</span>
            </article>

            <article className="ls-vendor">
              <img className="ls-vendor-logo" src={qwenLogo} alt="Qwen" />
              <span className="ls-vendor-name">Qwen</span>
              <span className="ls-vendor-tag">千问 · 阿里</span>
            </article>

            <article className="ls-vendor">
              <img className="ls-vendor-logo" src={kimiLogo} alt="Kimi" />
              <span className="ls-vendor-name">Kimi</span>
              <span className="ls-vendor-tag">月之暗面</span>
            </article>

            <article className="ls-vendor">
              <img className="ls-vendor-logo" src={stepfunLogo} alt="StepFun" />
              <span className="ls-vendor-name">StepFun</span>
              <span className="ls-vendor-tag">阶跃星辰</span>
            </article>

            <article className="ls-vendor">
              <img className="ls-vendor-logo" src={doubaoLogo} alt="Doubao" />
              <span className="ls-vendor-name">Doubao</span>
              <span className="ls-vendor-tag">豆包 · 字节</span>
            </article>
          </div>
        </div>

        <div className="ls-footnote">
          <span>Source · Article §3</span>
        </div>
      </div>
    );
  }

  // ── step 1：国外三大头 ────────────────────────────────
  return (
    <div className="ls-scene">
      <div className="ls-intl">
        <div className="ls-kicker">
          <span className="dot-accent" />
          <span className="label-mono">Part 02 — Overseas Big Three</span>
        </div>

        <div className="ls-corner-mark">
          <span>02 · Landscape</span>
        </div>

        <div className="ls-intl-head">
          <h2 className="ls-intl-h">
            国外 <span className="em">就三大头</span>
          </h2>

          <p className="ls-intl-sub">
            整条海外线其实就这三家 —— Anthropic、OpenAI、Google。
          </p>
        </div>

        <div className="ls-intl-trio">
          <article className="ls-major">
            <span className="ls-major-ord">i.</span>
            <img className="ls-major-logo" src={anthropicLogo} alt="Anthropic" />
            <h3 className="ls-major-name">Anthropic</h3>
            <span className="ls-major-tag">Claude Family</span>
            <p className="ls-major-note">
              长上下文、Opus 4.6 上半年更新一轮。
            </p>
          </article>

          <article className="ls-major">
            <span className="ls-major-ord">ii.</span>
            <img className="ls-major-logo" src={openaiLogo} alt="OpenAI" />
            <h3 className="ls-major-name">OpenAI</h3>
            <span className="ls-major-tag">GPT · Codex</span>
            <p className="ls-major-note">
              ChatGPT 5.3X、Codex 一轮集中更新。
            </p>
          </article>

          <article className="ls-major">
            <span className="ls-major-ord">iii.</span>
            <img className="ls-major-logo" src={googleLogo} alt="Google" />
            <h3 className="ls-major-name">Google</h3>
            <span className="ls-major-tag">Gemini</span>
            <p className="ls-major-note">
              Gemini 系列一直稳，跟得紧。
            </p>
          </article>
        </div>

        <div className="ls-footnote">
          <span>Source · Article §4</span>
        </div>
      </div>
    </div>
  );
}