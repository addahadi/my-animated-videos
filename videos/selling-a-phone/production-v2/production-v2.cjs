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
const out=path.join(root,'exports/v2');fs.mkdirSync(out,{recursive:true});
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const samples=[['intro',2],['warning',5],['backup-copy',14.2],['backup-options',19.4],['backup-open',23.3],['backup-contacts',24.8],['auth-before',28.9],['auth-transfer',30.3],['auth-after',31.3],['login',35.6],['auth-risk',38.3],['auth-next',43],['watch-before',46.5],['watch-after',49.3],['bluetooth',52.6],['android',58.9],['apple',62.9],['find-my',65.5],['apps',70.8],['signout',72.4],['sessions-before',75.3],['sessions-after',77.9],['whatsapp',83.8],['prepared',86],['reset-menu',89.2],['resetting',91.7],['welcome',94.7],['verify-warning',98.6],['verify-account',102],['verify-activation',104.5],['handover',106.8],['end',110.8]];
fs.writeFileSync(path.join(out,'samples.json'),JSON.stringify(samples));
async function main(){
 if(mode==='review-stills'){
  execFileSync('python',[path.join(root,'review_v2.py'),'stills'],{stdio:'inherit'});return;
 }
 if(mode==='finish'){
  execFileSync('python',[path.join(root,'finish_v2.py')],{stdio:'inherit'});
  execFileSync('C:/Users/hecin/Videos/my-animated-video/.venv/Scripts/python.exe',[path.join(root,'verify_v2.py')],{stdio:'inherit'});
  execFileSync('python',[path.join(root,'review_v2.py'),'final'],{stdio:'inherit'});return;
 }
 const serveUrl=await bundle({entryPoint:path.join(root,'src-v2/index.tsx'),outDir:path.join(root,'.bundle-v2'),publicDir:path.join(root,'media'),webpackOverride:c=>({...c,resolve:{...c.resolve,modules:[path.join(workspace,'motion/node_modules'),'node_modules']}})});
 const composition=await selectComposition({serveUrl,id:'SellingPhoneV2',browserExecutable:chrome});
 const common={serveUrl,composition,browserExecutable:chrome,logLevel:'error'};
 if(mode==='stills'){
  for(const [name,time] of samples){await renderStill({...common,output:path.join(out,`draft-${name}.png`),frame:Math.round(time*30)});console.log('STILL',name);}
 }else if(mode==='preview'){
  await renderMedia({...common,outputLocation:path.join(out,'preview-render.mp4'),codec:'h264',crf:20,pixelFormat:'yuv420p',concurrency:2,scale:.5,frameRange:[360,1049],muted:true});
  execFileSync('python',[path.join(root,'finish_v2.py'),'preview'],{stdio:'inherit'});
 }else if(mode==='render'){
  let last=0;await renderMedia({...common,outputLocation:path.join(out,'render-source.mp4'),codec:'h264',crf:17,pixelFormat:'yuv420p',concurrency:2,muted:true,onProgress:p=>{const n=Math.floor(p.progress*100);if(n>=last+5){last=n;console.log(`RENDER ${n}%`);}}});
 }else throw Error('Use stills, review-stills, preview, render or finish');
 console.log('COMPLETE',mode,composition.durationInFrames);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
