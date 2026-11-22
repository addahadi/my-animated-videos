const path=require('path');
const fs=require('fs');
const {createRequire}=require('module');
const root=path.resolve(__dirname);
const motion=path.resolve(root,'../../motion');
const req=createRequire(path.join(motion,'package.json'));
const {bundle}=req('@remotion/bundler');
const {openBrowser,selectComposition,renderStill,renderMedia}=req('@remotion/renderer');
const mode=process.argv[2]||'stills';
(async()=>{
 const url=await bundle({entryPoint:path.join(motion,'src/introduction-n8n-entry.tsx'),publicDir:path.join(root,'media')});
 const browser=await openBrowser('chrome',{browserExecutable:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const composition=await selectComposition({serveUrl:url,id:'IntroductionN8n',puppeteerInstance:browser});
  if(mode==='stills'){
   const times=[2.8,14.8,24.8,36.9,43.8,57.4,63.4,67.3,71.6,74.8,84.5,96.8];
   for(let i=0;i<times.length;i++){
    await renderStill({composition,serveUrl:url,output:path.join(root,`exports/still-${String(i+1).padStart(2,'0')}.png`),frame:Math.round(times[i]*30),scale:.65,puppeteerInstance:browser});
    console.log('Still',i+1,'at',times[i]);
   }
  }else{
   const preview=mode==='preview';let last=-1;
   await renderMedia({composition,serveUrl:url,codec:'h264',audioCodec:'aac',crf:18,pixelFormat:'yuv420p',outputLocation:path.join(root,'exports',preview?'preview.mp4':'introduction-n8n-instagram-v2.mp4'),frameRange:preview?[0,359]:undefined,scale:preview?.5:1,concurrency:2,puppeteerInstance:browser,onProgress:p=>{const pct=Math.floor(p.progress*10)*10;if(pct!==last){last=pct;console.log(`${mode}: ${pct}%`);}}});
  }
 }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exit(1)});
