// generate-content.mjs
// Reads videos/<slug>/article.md and calls an OpenAI-compatible LLM (default
// MiniMax M3) to produce script.md + outline.md per the nuo-video skill's
// draft-organizer + visual-designer rules.
//
// API key is read from MINIMAX_API_KEY env var only — never hardcoded.
// All output paths are validated; no untrusted input is executed.

import fs from 'node:fs';
import OpenAI from 'openai';

const slug = process.env.VIDEO_SLUG;
if (!slug) {
  console.error('ERROR: VIDEO_SLUG env var is required');
  process.exit(1);
}

// Reject anything that isn't a safe slug (letters, digits, hyphen, underscore)
if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error(`ERROR: invalid slug: ${slug}`);
  process.exit(1);
}

const articlePath = `videos/${slug}/article.md`;
if (!fs.existsSync(articlePath)) {
  console.error(`ERROR: ${articlePath} not found`);
  process.exit(1);
}

const article = fs.readFileSync(articlePath, 'utf-8');
const skillDir = '.claude/skills/nuo-video';
const scriptStylePath = `${skillDir}/references/SCRIPT-STYLE.md`;
const outlineFormatPath = `${skillDir}/references/OUTLINE-FORMAT.md`;

if (!fs.existsSync(scriptStylePath) || !fs.existsSync(outlineFormatPath)) {
  console.error('ERROR: skill reference docs not found at expected paths');
  process.exit(1);
}

const scriptStyle = fs.readFileSync(scriptStylePath, 'utf-8');
const outlineFormat = fs.readFileSync(outlineFormatPath, 'utf-8');

const apiKey = process.env.MINIMAX_API_KEY;
if (!apiKey) {
  console.error('ERROR: MINIMAX_API_KEY env var is required');
  process.exit(1);
}

const baseURL = process.env.MINIMAX_BASE_URL || 'https://api.MiniMax.chat/v1';
const model = process.env.MINIMAX_MODEL || 'MiniMax-M3';

console.log(`[generate-content] slug=${slug}`);
console.log(`[generate-content] model=${model}, baseURL=${baseURL}`);
console.log(
  `[generate-content] article=${article.length}ch, SCRIPT-STYLE=${scriptStyle.length}ch, OUTLINE-FORMAT=${outlineFormat.length}ch`
);

const client = new OpenAI({ apiKey, baseURL });

const systemPrompt = `你是一个视频生产流水线的 AI 助手，结合了 nuo-video skill 中的两个角色：

【角色 1: draft-organizer】把用户给的文章转成 B 站风格口播稿。严格按 SCRIPT-STYLE 规则。
【角色 2: visual-designer】把口播稿拆成可录屏的演示章节（章节切分 + step 数 + 信息池）。严格按 OUTLINE-FORMAT 规则。

【输出格式】严格遵守。用以下分隔符包裹两部分（=== 等号 ≥ 8 个，避免与正文冲突）：
==========SCRIPT_BEGIN==========
<script.md 完整内容，纯 markdown>
==========SCRIPT_END==========
==========OUTLINE_BEGIN==========
<outline.md 完整内容，纯 markdown>
==========OUTLINE_END==========

不要在分隔符外输出任何解释、前言、后记、代码块标记。`;

const userPrompt = `# 输入文章（videos/${slug}/article.md）

${article}

---

# SCRIPT-STYLE 规则（draft-organizer 必读）

${scriptStyle}

---

# OUTLINE-FORMAT 规则（visual-designer 必读）

${outlineFormat}

---

请按以上规则处理文章，输出 script.md 和 outline.md。`;

let response;
try {
  response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 16000,
    temperature: 0.7,
  });
} catch (err) {
  console.error('ERROR: LLM API call failed:', err.message);
  if (err.response) {
    console.error('Response status:', err.response.status);
    console.error('Response data:', JSON.stringify(err.response.data, null, 2));
  }
  process.exit(1);
}

const content = response.choices[0]?.message?.content;
if (!content) {
  console.error('ERROR: empty response from API');
  console.error('Full response:', JSON.stringify(response, null, 2));
  process.exit(1);
}

const scriptMatch = content.match(
  /==========SCRIPT_BEGIN==========\s*([\s\S]*?)\s*==========SCRIPT_END==========/
);
const outlineMatch = content.match(
  /==========OUTLINE_BEGIN==========\s*([\s\S]*?)\s*==========OUTLINE_END==========/
);

if (!scriptMatch) {
  console.error('ERROR: could not find SCRIPT delimiters in response');
  console.error('--- raw content ---');
  console.error(content);
  console.error('--- end raw content ---');
  process.exit(1);
}
if (!outlineMatch) {
  console.error('ERROR: could not find OUTLINE delimiters in response');
  console.error('--- raw content ---');
  console.error(content);
  console.error('--- end raw content ---');
  process.exit(1);
}

const scriptContent = scriptMatch[1].trim();
const outlineContent = outlineMatch[1].trim();

if (!scriptContent || !outlineContent) {
  console.error('ERROR: empty content extracted from delimiters');
  process.exit(1);
}

const videoDir = `videos/${slug}`;
fs.writeFileSync(`${videoDir}/script.md`, scriptContent + '\n');
fs.writeFileSync(`${videoDir}/outline.md`, outlineContent + '\n');

console.log(
  `[generate-content] wrote ${videoDir}/script.md (${scriptContent.length}ch)`
);
console.log(
  `[generate-content] wrote ${videoDir}/outline.md (${outlineContent.length}ch)`
);
console.log('[generate-content] done');
