// patch-vite-base.mjs
// Patches the Vite config in the current directory to set `base` to the
// GitHub Pages subpath for this video. Idempotent: replaces existing
// `base:` or inserts one.

import fs from 'node:fs';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node patch-vite-base.mjs <slug>');
  process.exit(1);
}
if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error(`ERROR: invalid slug: ${slug}`);
  process.exit(1);
}

const configPath = 'vite.config.ts';
if (!fs.existsSync(configPath)) {
  console.error(`ERROR: ${configPath} not found (cwd: ${process.cwd()})`);
  process.exit(1);
}

const baseValue = `/video-studio/videos/${slug}/`;

let config = fs.readFileSync(configPath, 'utf-8');

if (/base:\s*['"`]/.test(config)) {
  config = config.replace(/base:\s*['"`][^'"`]+['"`]/, `base: '${baseValue}'`);
  console.log(`[patch-vite-base] replaced base with: ${baseValue}`);
} else {
  config = config.replace(
    /export default defineConfig\(\s*\{/,
    `export default defineConfig({\n  base: '${baseValue}',`
  );
  console.log(`[patch-vite-base] inserted base: ${baseValue}`);
}

fs.writeFileSync(configPath, config);
console.log('[patch-vite-base] done');
