import "./Coldopen.css";

interface Props {
  step: number;
}

export default function Coldopen({ step }: Props) {
  return (
    <div className="cd-scene">
      {step === 0 && <Step0 />}
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}
      {step === 5 && <Step5 />}
    </div>
  );
}

/* ── step 0: 钩子 —— "马嘉祺"被划掉 / "马璟祺"亮起 ──────────── */
function Step0() {
  return (
    <div className="cd-step">
      <div className="cd-corner">
        <span className="cd-corner-num">01</span>
        <span className="cd-corner-slash">/</span>
        <span className="cd-corner-label">实际输出</span>
      </div>

      <div className="cd-s0-block">
        <div className="cd-s0-original">
          <span className="cd-s0-asked">"马嘉祺"</span>
          <span className="cd-s0-strike" />
        </div>

        <div className="cd-s0-arrow" aria-hidden>
          <span className="cd-s0-arrow-line" />
          <span className="cd-s0-arrow-tip">▼</span>
        </div>

        <div className="cd-s0-reply">
          <span className="cd-s0-reply-mark">答</span>
          <span className="cd-s0-reply-text">马璟祺？</span>
        </div>
      </div>

      <div className="cd-s0-hint">prompt: "重复马嘉祺三个字"</div>
    </div>
  );
}

/* ── step 1: 报告揭幕 —— 杂志感 masthead ─────────────────────── */
function Step1() {
  return (
    <div className="cd-step">
      <div className="cd-masthead">
        <div className="cd-masthead-l">
          <span className="cd-masthead-cat">技术报告</span>
          <span className="cd-masthead-source">/ 来自 MiniMax 内部排查</span>
        </div>
        <div className="cd-masthead-r">
          <span className="cd-masthead-vol">VOL. 01</span>
        </div>
      </div>

      <hr className="rule rule-grow cd-rule" />

      <div className="cd-s1-titlewrap">
        <h1 className="cd-s1-title">
          <span className="cd-s1-title-pre">不只一个明星名字</span>
          <span className="cd-s1-title-main">MiniMax 也排查过这个问题</span>
        </h1>
        <p className="cd-s1-sub">
          内部全链路复盘，从分词器到 SFT，把"说不出马嘉祺"这条线索追到底。
        </p>
      </div>
    </div>
  );
}

/* ── step 2: 价值定调 —— 把"明星名字"和"底层缺陷"撕开 ────────── */
function Step2() {
  return (
    <div className="cd-step cd-step-tight">
      <div className="cd-s2-eyebrow">报告真正的价值</div>

      <div className="cd-s2-duo">
        <div className="cd-s2-row cd-s2-row-1">
          <span className="cd-s2-no">不是</span>
          <span className="cd-s2-line">解释一个名字怎么废的</span>
        </div>

        <div className="cd-s2-row cd-s2-row-2">
          <span className="cd-s2-no cd-s2-no-em">而是</span>
          <span className="cd-s2-line cd-s2-line-em">
            顺着这条线索，挖出一个底层训练缺陷
          </span>
        </div>
      </div>

      <div className="cd-s2-rail">
        <span className="cd-s2-rail-tag">Tokenizer × SFT</span>
      </div>
    </div>
  );
}

/* ── step 3: 路线图 —— 4 个实验节点依次亮起 ─────────────────── */
function Step3() {
  return (
    <div className="cd-step">
      <div className="cd-s3-eyebrow">今天要做的事</div>
      <h2 className="cd-s3-h">四个实验，把这条逻辑讲透</h2>

      <div className="cd-s3-track" aria-hidden>
        <div className="cd-s3-line" />
      </div>

      <ol className="cd-s3-nodes">
        <li className="cd-s3-node">
          <span className="cd-s3-num">01</span>
          <span className="cd-s3-name">分词器</span>
          <span className="cd-s3-sub">BPE 与"嘉祺"被打包</span>
        </li>
        <li className="cd-s3-node">
          <span className="cd-s3-num">02</span>
          <span className="cd-s3-name">Base vs Chat</span>
          <span className="cd-s3-sub">退化锁在 SFT 阶段</span>
        </li>
        <li className="cd-s3-node">
          <span className="cd-s3-num">03</span>
          <span className="cd-s3-name">LoRA 修复</span>
          <span className="cd-s3-sub">微调 lm_head 拉回来</span>
        </li>
        <li className="cd-s3-node">
          <span className="cd-s3-num">04</span>
          <span className="cd-s3-name">工程意义</span>
          <span className="cd-s3-sub">统一解释两件怪事</span>
        </li>
      </ol>
    </div>
  );
}

/* ── step 4: 章标 —— 实验一：分词器 ─────────────────────────── */
function Step4() {
  return (
    <div className="cd-step cd-step-center">
      <div className="cd-s4-eyebrow">Chapter 01 / 11</div>
      <h2 className="cd-s4-h">
        <span className="cd-s4-cn">分词器</span>
        <span className="cd-s4-en">Tokenizer</span>
      </h2>
      <div className="cd-s4-rule" />
      <p className="cd-s4-sub">问题链条的起点 —— "嘉祺"是怎么被合并成一个 token 的</p>
    </div>
  );
}

/* ── step 5: 过场 —— 黑场 + 进度提示 ────────────────────────── */
function Step5() {
  return (
    <div className="cd-step cd-step-center">
      <div className="cd-s5-cursor">
        <span className="cd-s5-cursor-dot" />
        <span className="cd-s5-cursor-text">实验开始</span>
      </div>
    </div>
  );
}
