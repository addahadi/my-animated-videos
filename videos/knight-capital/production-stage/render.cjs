const path = require('path');
const fs = require('fs');
const repo = 'C:/Users/hecin/ai-video-editor';
const modules = path.join(repo, 'motion/node_modules');
const {bundle} = require(path.join(modules, '@remotion/bundler'));
const {selectComposition, renderMedia, renderStill} = require(path.join(modules, '@remotion/renderer'));
const root = __dirname;
const mode = process.argv[2] || 'stills';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
async function main() {
 const serveUrl = await bundle({entryPoint:path.join(root,'src/index.tsx'),publicDir:path.join(root,'media'),
   outDir:path.join(root,'analysis/bundle'),
   webpackOverride:config=>({...config,resolve:{...config.resolve,modules:[modules,'node_modules']}})});
 const composition = await selectComposition({serveUrl,id:'KnightCapitalDesign2',browserExecutable:chrome});
 const common = {serveUrl,composition,browserExecutable:chrome,overwrite:true,logLevel:'error'};
 const out = path.join(root,'exports');
 if(mode==='stills') {
  const samples = [0,22,68,235,380,525,570,680,840,1010,1190,1280,1355,1450,1605,1740,1870,2040,2185,2370,2495,2590,2700,2770];
  for(let i=0;i<samples.length;i++) {
   await renderStill({...common,frame:samples[i],output:path.join(out,'stills',`still-${String(i).padStart(2,'0')}-${(samples[i]/30).toFixed(1)}s.png`)});
   process.stdout.write(`Still ${i+1}/${samples.length}\n`);
  }
 } else {
  const options = mode==='preview'?{frameRange:[0,359],scale:.5,output:'preview-silent.mp4'}:
    mode==='mechanism'?{frameRange:[1300,1632],scale:.5,output:'mechanism-silent.mp4'}:
    {frameRange:[0,composition.durationInFrames-1],scale:1,output:'render-silent.mp4'};
  const {output,...extra}=options;
  let last=-1;
  await renderMedia({...common,...extra,outputLocation:path.join(out,output),codec:'h264',crf:17,pixelFormat:'yuv420p',
   concurrency:1,muted:true,onProgress:({progress})=>{const p=Math.floor(progress*10);if(p!==last){last=p;process.stdout.write(`${mode}: ${p*10}%\n`);}}});
 }
}
main().catch(e=>{console.error(e);process.exit(1)});
