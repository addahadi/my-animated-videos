const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const {execFileSync}=require('node:child_process');
const root=__dirname;
const workspace=path.resolve(root,'../..');
const localRequire=createRequire(path.join(workspace,'motion/package.json'));
const {bundle}=localRequire('@remotion/bundler');
const {selectComposition,renderStill,renderMedia}=localRequire('@remotion/renderer');
const mode=process.argv[2]||'stills';
const out=path.join(root,'exports/v4');fs.mkdirSync(out,{recursive:true});
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const samples=[['hook-start',.2],['hook-approach',1.6],['hook-pause',2.9],['hook-warning',4.3],['hook-seven',6.0],['hook-return',8.1],['hook-prepared',9.5],['backup-copy',14.2],['backup-open',23.3],['auth-transfer',30.3],['login',35.6],['watch-after',49.3],['android',58.9],['find-my',65.5],['sessions-after',77.9],['whatsapp',83.8],['reset-menu',89.2],['resetting',91.7],['verify-activation',104.5],['end',110.8]];
fs.writeFileSync(path.join(out,'samples.json'),JSON.stringify(samples));
async function main(){
 if(mode==='review-stills'){
  execFileSync('python',[path.join(root,'review_v4.py'),'stills'],{stdio:'inherit'});return;
 }
 if(mode==='finish'){
  execFileSync('python',[path.join(root,'finish_v4.py')],{stdio:'inherit'});
  execFileSync('C:/Users/hecin/Videos/my-animated-video/.venv/Scripts/python.exe',[path.join(root,'verify_v4.py')],{stdio:'inherit'});
  execFileSync('python',[path.join(root,'review_v4.py'),'final'],{stdio:'inherit'});return;
 }
 const serveUrl=await bundle({entryPoint:path.join(root,'src-v4/index.tsx'),outDir:path.join(root,'.bundle-v4'),publicDir:path.join(root,'media'),webpackOverride:c=>({...c,resolve:{...c.resolve,modules:[path.join(workspace,'motion/node_modules'),'node_modules']}})});
 const composition=await selectComposition({serveUrl,id:'SellingPhoneV4',browserExecutable:chrome});
 const common={serveUrl,composition,browserExecutable:chrome,logLevel:'error'};
 if(mode==='stills'){
  for(const [name,time] of samples.filter(([name])=>process.argv.length<4||process.argv.slice(3).includes(name))){await renderStill({...common,output:path.join(out,`${process.argv.length>3?'review':'draft'}-${name}.png`),frame:Math.round(time*30)});console.log('STILL',name);}
 }else if(mode==='preview'){
  await renderMedia({...common,outputLocation:path.join(out,'preview-render.mp4'),codec:'h264',crf:20,pixelFormat:'yuv420p',concurrency:2,scale:.5,frameRange:[0,449],muted:true});
  execFileSync('python',[path.join(root,'finish_v4.py'),'preview'],{stdio:'inherit'});
 }else if(mode==='render'){
  let last=0;await renderMedia({...common,outputLocation:path.join(out,'render-hook.mp4'),frameRange:[0,289],codec:'h264',crf:17,pixelFormat:'yuv420p',concurrency:2,muted:true,onProgress:p=>{const n=Math.floor(p.progress*100);if(n>=last+5){last=n;console.log(`RENDER ${n}%`);}}});
 }else throw Error('Use stills, review-stills, preview, render or finish');
 console.log('COMPLETE',mode,composition.durationInFrames);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
