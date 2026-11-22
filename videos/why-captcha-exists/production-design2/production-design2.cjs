const path=require('path');
const fs=require('fs');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill,renderMedia}=require('@remotion/renderer');
const project=__dirname;
const out=path.join(project,'exports/design2');
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const frames=[30,120,240,405,510,800,870,960,1395,1460,1605,1785,1980,2155,2210,2375,2450,2535,2690,2830];
(async()=>{
 fs.mkdirSync(path.join(out,'stills'),{recursive:true});
 const url=await bundle({entryPoint:path.join(project,'src-design2/index.tsx'),publicDir:path.join(project,'media'),onProgress:()=>{}});
 const browser=await openBrowser('chrome',{browserExecutable:chrome});
 try{
  const comp=await selectComposition({serveUrl:url,id:'CaptchaDesign2',puppeteerInstance:browser,browserExecutable:chrome});
  const options={serveUrl:url,composition:comp,puppeteerInstance:browser,browserExecutable:chrome,logLevel:'error'};
  if(process.argv[2].startsWith('review')){
   const selected=process.argv[2]==='review-fixes'?[960,1460,2210,2375,2450,2535]:frames;
   for(const frame of selected){await renderStill({...options,frame,imageFormat:'png',output:path.join(out,'stills',`frame-${String(frame).padStart(4,'0')}.png`)});console.log(`Design 2 still ${frame} ready`);}
   if(process.argv[2]==='review-fixes')return;
   for(const [name,start,end] of [['hook',0,299],['background-check',1840,2224]]){
    await renderMedia({...options,codec:'h264',muted:true,frameRange:[start,end],scale:.5,pixelFormat:'yuv420p',imageFormat:'png',crf:18,concurrency:2,outputLocation:path.join(out,`preview-${name}-picture.mp4`)});
    console.log(`Design 2 ${name} preview picture ready`);
   }
  }else{
   let last=-1;
   await renderMedia({...options,codec:'h264',muted:true,pixelFormat:'yuv420p',imageFormat:'png',crf:16,concurrency:1,outputLocation:path.join(out,'render-design2.mp4'),onProgress:({progress})=>{const q=Math.floor(progress*100);if(q!==last&&q%5===0){console.log(`Design 2 render ${q}%`);last=q;}}});
   console.log('Design 2 picture render ready');
  }
 }finally{await browser.close({silent:true})}
})().catch(e=>{console.error(e);process.exit(1)});
