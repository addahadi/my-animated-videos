const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const root=__dirname;
const workspace=path.resolve(root,'../..');
const localRequire=createRequire(path.join(workspace,'motion/package.json'));
const {bundle}=localRequire('@remotion/bundler');
const {selectComposition,renderStill,renderMedia}=localRequire('@remotion/renderer');
const mode=process.argv[2]||'stills';
const out=path.join(root,'exports');fs.mkdirSync(out,{recursive:true});
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
async function main(){
 if(mode==='review'){
  const {execFileSync}=require('node:child_process');
  execFileSync('python',[path.join(root,'finish_encode.py')],{stdio:'inherit'});
  execFileSync('C:/Users/hecin/Videos/my-animated-video/.venv/Scripts/python.exe',[path.join(root,'verify.py')],{stdio:'inherit'});
  execFileSync('python',[path.join(root,'review_images.py')],{stdio:'inherit'});
  return;
 }
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index.tsx'),outDir:path.join(root,'.bundle'),publicDir:path.join(root,'media'),webpackOverride:config=>({...config,resolve:{...config.resolve,modules:[path.join(workspace,'motion/node_modules'),'node_modules']}})});
 const composition=await selectComposition({serveUrl,id:'SellingPhone',browserExecutable:chrome});
 const common={serveUrl,composition,browserExecutable:chrome,logLevel:'error',chromiumOptions:{disableWebSecurity:false}};
 if(mode==='stills'){
  const frames=[['hook',40],['backup',Math.round(13.6*30)],['backup-check',Math.round(23.5*30)],['auth',Math.round(31.2*30)],['auth-zoom',Math.round(34.8*30)],['devices',Math.round(51.8*30)],['accounts',Math.round(63.5*30)],['sessions',Math.round(77.9*30)],['whatsapp',Math.round(81.7*30)],['reset',Math.round(89.2*30)],['verify',Math.round(102.1*30)],['end',composition.durationInFrames-5]];
  for(const [name,frame] of frames){await renderStill({...common,output:path.join(out,`frame-${name}.png`),frame});console.log('STILL',name,frame);}
 }else if(mode==='preview'){
  await renderMedia({...common,outputLocation:path.join(out,'preview.mp4'),codec:'h264',crf:21,pixelFormat:'yuv420p',concurrency:2,scale:.5,frameRange:[0,449]});
 }else if(mode==='render'){
  let last=0;await renderMedia({...common,outputLocation:path.join(out,'render-source.mp4'),codec:'h264',crf:18,pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'192k',concurrency:2,onProgress:p=>{const n=Math.floor(p.progress*100);if(n>=last+5){last=n;console.log(`RENDER ${n}%`);}}});
 }else if(mode==='motion'){
  const timing=JSON.parse(fs.readFileSync(path.join(root,'media/timeline.json'),'utf8'));
  const start=timing.segments[2].start+6.1;
  for(let i=0;i<5;i++){const frame=Math.round((start+i*.35)*30);await renderStill({...common,output:path.join(out,`motion-${i}.png`),frame});}
 }else throw Error('Use stills, preview, render or motion');
 console.log('COMPLETE',mode,composition.durationInFrames);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
