// Render every slide of a carousel, both sizes, in one bundle pass, plus a contact sheet per size (needs Python + Pillow).
// Usage: node videos/carousels/stills.mjs <CompositionPrefix> <slug>
//   e.g. node videos/carousels/stills.mjs RiemannCarousel riemann-claude  ->  out/riemann-claude/{ig,tt}/slide-01.png ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const [prefix = 'CarouselDemo', slug = 'carousel-demo'] = process.argv.slice(2);
const root = path.resolve(import.meta.dirname, '..', '..');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.tsx') });
for (const v of ['ig', 'tt']) {
  const composition = await selectComposition({ serveUrl, id: `${prefix}-${v}`, inputProps: {} });
  const outDir = path.join(root, 'out', slug, v);
  fs.mkdirSync(outDir, { recursive: true });
  const files = [];
  for (let frame = 0; frame < composition.durationInFrames; frame++) {
    const output = path.join(outDir, `slide-${String(frame + 1).padStart(2, '0')}.png`);
    await renderStill({ composition, serveUrl, frame, output, inputProps: {}, imageFormat: 'png', timeoutInMilliseconds: 120000 });
    files.push(output);
    console.log(output);
  }
  const sheet = path.join(root, 'out', slug, `${v}-sheet.jpg`);
  const py = `import sys\nfrom PIL import Image\nims=[Image.open(f) for f in sys.argv[2:]]\nw,h=ims[0].size\ncols=min(6,len(ims))\nrows=(len(ims)+cols-1)//cols\ns=Image.new('RGB',(cols*(w+12),rows*(h+12)),(40,40,40))\nfor i,im in enumerate(ims): s.paste(im,((i%cols)*(w+12),(i//cols)*(h+12)))\ns.thumbnail((3000,3000)); s.save(sys.argv[1],quality=88)`;
  try {
    execFileSync('python', ['-c', py, sheet, ...files]);
    console.log(sheet);
  } catch (e) {
    console.log('contact sheet skipped:', e.message);
  }
}
