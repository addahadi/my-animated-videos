const path = require('path');
const fs = require('fs');
const {bundle} = require('@remotion/bundler');
const {selectComposition, renderStill, renderMedia, openBrowser} = require('@remotion/renderer');
const project = __dirname;
const mode = process.argv[2] || 'review';
const out = path.join(project,'exports');
const chromium = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async()=>{
 fs.mkdirSync(path.join(out,'stills'),{recursive:true});
 const serveUrl=await bundle({entryPoint:path.join(project,'src/index.tsx'),publicDir:path.join(project,'media'),onProgress:()=>{}});
 const browser=await openBrowser('chrome',{browserExecutable:chromium});
 try{
  const comp=await selectComposition({serveUrl,id:'WhyCaptchaExists',puppeteerInstance:browser,browserExecutable:chromium});
  if(mode==='review'){
   const frames=[0,45,225,405,555,900,1010,1425,1460,1740,1800,2145,2205,2535,2785,2845];
   for(const frame of frames){
    await renderStill({serveUrl,composition:comp,frame,output:path.join(out,'stills',`frame-${String(frame).padStart(4,'0')}.png`),imageFormat:'png',puppeteerInstance:browser,browserExecutable:chromium,logLevel:'error'});
    console.log(`Still ${frame} ready`);
   }
   await renderMedia({serveUrl,composition:comp,codec:'h264',outputLocation:path.join(out,'preview-background-check.mp4'),frameRange:[1840,2224],scale:.5,crf:20,pixelFormat:'yuv420p',concurrency:2,puppeteerInstance:browser,browserExecutable:chromium,logLevel:'error',onProgress:({progress})=>{if(Math.round(progress*100)%20===0)process.stdout.write('.');}});
   console.log('\nPreview ready');
  }else if(mode==='final'){
   let last=-1;
   await renderMedia({serveUrl,composition:comp,codec:'h264',outputLocation:path.join(out,'why-captcha-exists.mp4'),crf:18,pixelFormat:'yuv420p',audioBitrate:'192k',concurrency:2,puppeteerInstance:browser,browserExecutable:chromium,logLevel:'error',onProgress:({progress})=>{const percent=Math.floor(progress*100);if(percent!==last&&percent%5===0){console.log(`Render ${percent}%`);last=percent;}}});
   console.log('Final video ready');
  }else throw new Error('Unknown mode '+mode);
 }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exit(1)});
