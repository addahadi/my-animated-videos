const path=require('path');
const {createRequire}=require('module');
const req=createRequire('C:/Users/hecin/ai-video-editor/motion/package.json');
const {bundle}=req('@remotion/bundler');
const {selectComposition,renderStill,renderMedia}=req('@remotion/renderer');
const fs=require('fs');
const root=__dirname;
async function main(){
 const mode=process.argv[2]||'stills';
 const serveUrl=await bundle({entryPoint:path.join(root,'src/PhoneSlowdown.tsx'),publicDir:path.join(root,'media'),webpackOverride:config=>({...config,resolve:{...config.resolve,modules:['C:/Users/hecin/ai-video-editor/motion/node_modules',...(config.resolve.modules||[])]}})});
 const browserExecutable='C:/Program Files/Google/Chrome/Application/chrome.exe';
 const composition=await selectComposition({serveUrl,id:'PhoneSlowdown',browserExecutable});
 const out=path.join(root,'exports');fs.mkdirSync(out,{recursive:true});
 if(mode==='stills'){
  const frames=[40,80,225,330,645,945,1240,1485,1650,1800,2070,2380,2650,2810,2930,3090];
  for(const frame of frames){await renderStill({serveUrl,composition,output:path.join(out,`frame-${frame}.png`),frame,browserExecutable,imageFormat:'png'});console.log('STILL',frame);}
 }else{
  const preview=mode==='preview';
  await renderMedia({serveUrl,composition,codec:'h264',outputLocation:path.join(out,preview?'preview.mp4':'phone-slowdown-design2.mp4'),browserExecutable,crf:18,pixelFormat:'yuv420p',concurrency:2,scale:preview?.5:1,frameRange:preview?[0,406]:undefined,onProgress:({progress})=>{const n=Math.floor(progress*100);if(n%10===0&&main.last!==n){main.last=n;console.log('RENDER',n+'%')}}});
  if(!preview){
   const {execFileSync}=require('child_process');
   const ffmpeg='C:/Users/hecin/ai-video-editor/motion/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe';
   const rendered=path.join(out,'phone-slowdown-design2.mp4'),synced=path.join(out,'phone-slowdown-design2-synced.mp4');
   execFileSync(ffmpeg,['-v','error','-y','-i',rendered,'-i',path.join(root,'media/narration.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',synced]);
   fs.copyFileSync(synced,rendered);console.log('Original narration remuxed at t=0.');
  }
 }
}
main().catch(e=>{console.error(e);process.exit(1)});
