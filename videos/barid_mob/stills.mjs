// Render review stills for BaridimobScams in one bundle pass.
// Usage: node videos/barid_mob/stills.mjs 0 6 120 ...   (frame numbers)  |  --sec 4.5 12.3 ...
// TikTok cut: COMP=BaridimobScams-tiktok node videos/barid_mob/stills.mjs ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(import.meta.dirname, '..', '..');
const args = process.argv.slice(2);
const useSec = args[0] === '--sec';
const list = (useSec ? args.slice(1) : args).map(Number);
const fps = 30;
const frames = list.map((v) => (useSec ? Math.round(v * fps) : v));
const id = process.env.COMP ?? 'BaridimobScams';
const outDir = path.join(root, 'out', 'stills', id.endsWith('-tiktok') ? 'baridimob-scams-tiktok' : 'baridimob-scams');
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.tsx') });
const composition = await selectComposition({ serveUrl, id, inputProps: {} });
for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(4, '0')}.png`);
  await renderStill({ composition, serveUrl, frame, output, inputProps: {} });
  console.log(output);
}
