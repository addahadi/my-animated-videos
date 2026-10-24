import {bundle} from '@remotion/bundler';
import {renderMedia,renderStill,selectComposition,openBrowser} from '@remotion/renderer';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(project,'output');
fs.mkdirSync(out,{recursive:true});
const mode=process.argv[2]??'preview';
const browserExecutable=process.env.REMOTION_BROWSER??'C:/Program Files/Google/Chrome/Application/chrome.exe';
const bundleDir=path.join(project,'analysis/render-bundle');
const serveUrl=process.argv.includes('--reuse-bundle')?bundleDir:await bundle({entryPoint:path.join(project,'src/index.tsx'),publicDir:path.join(project,'public'),outDir:bundleDir,onProgress:()=>{}});
const browser=await openBrowser('chrome',{browserExecutable,chromiumOptions:{gl:'angle',enableMultiProcessOnLinux:true}});
try {
 const composition=await selectComposition({serveUrl,id:'VulnHunterInstagram',browserExecutable,puppeteerInstance:browser});
 if(mode==='stills') {
   const folder=path.join(out,'stills');
   fs.mkdirSync(folder,{recursive:true});
   for(const time of [3,5,10,14,22,26,32,36,42,47,53,57,61,65,68.8]) {
    const file=path.join(folder,`frame-${String(Math.round(time*10)).padStart(4,'0')}.png`);
    await renderStill({serveUrl,composition,frame:Math.round(time*30),output:file,imageFormat:'png',puppeteerInstance:browser,scale:.5});
    console.log(`STILL ${time}s ${file}`);
   }
 } else {
   const preview=mode!=='full';
   const outputLocation=path.join(out,preview?'preview-v2-picture.mp4':'vulnhunter-picture.mp4');
   let last=-1;
   await renderMedia({serveUrl,composition,outputLocation,codec:'h264',muted:true,pixelFormat:'yuv420p',crf:preview?23:18,scale:preview?.5:1,frameRange:preview?[0,539]:undefined,concurrency:preview?3:4,puppeteerInstance:browser,x264Preset:'fast',onProgress:({progress})=>{
     const step=Math.floor(progress*10);
     if(step!==last){last=step;console.log(`RENDER ${mode}: ${Math.round(progress*100)}%`);}
   }});
   // Mux the already checked AAC track directly. This avoids the extra priming
   // delay introduced by the renderer's intermediate audio transcodes.
   const finalOutput=path.join(out,preview?'preview-reference-music.mp4':'vulnhunter-instagram.mp4');
   const ffmpeg=fileURLToPath(new URL('../../../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe',import.meta.url));
   const mux=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',outputLocation,'-i',path.join(out,'soundtrack-reference.m4a'),'-map','0:v:0','-map','1:a:0','-c','copy','-t',String((preview?540:composition.durationInFrames)/composition.fps),'-movflags','+faststart',finalOutput],{encoding:'utf8',windowsHide:true});
   if(mux.error||mux.status!==0)throw new Error(mux.error?.message??mux.stderr);
   console.log(`OUTPUT ${finalOutput}`);
 }
} finally {await browser.close({silent:true});}
