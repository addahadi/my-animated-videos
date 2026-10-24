import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Backdrop, C, Label, PixelMascot} from './design';
import {Closing, Exploit, Fix, Hook, Hunt, Intro, Setup, Verify} from './Scenes';

loadFont({family:'Arabic',url:staticFile('fonts/Arabic.ttf'),weight:'100 900'});
loadFont({family:'Latin',url:staticFile('fonts/Latin.ttf'),weight:'100 900'});

export const scenes = [
 {start:0,end:6.5,label:'BEFORE LAUNCH',color:C.orange,component:Hook},
 {start:6.5,end:17.344,label:'VULNHUNTER',color:C.orange,component:Intro},
 {start:17.344,end:28.0533333333,label:'OPEN SOURCE',color:C.orange,component:Setup},
 {start:28.0533333333,end:38.0733333333,label:'01 / HUNT',color:C.orange,component:Hunt},
 {start:38.0733333333,end:48.896,label:'02 / FIX',color:C.mint,component:Fix},
 {start:48.896,end:58.5386666667,label:'03 / VERIFY',color:C.blue,component:Verify},
 {start:58.5386666667,end:66.1973333333,label:'EXPLOITABILITY',color:C.orange,component:Exploit},
 {start:66.1973333333,end:70.167,label:'FOLLOW FOR MORE',color:C.orange,component:Closing},
];

export const Video:React.FC = () => {
 const frame=useCurrentFrame();
 const time=frame/30;
 const index=Math.max(0,scenes.findIndex(s=>time>=s.start&&time<s.end));
 const scene=scenes[index];
 const local=time-scene.start;
 const Scene=scene.component;
 const wipe=local<.36&&index>0;
 return <AbsoluteFill style={{background:C.bg,color:C.ink,overflow:'hidden'}}>
  <Backdrop accent={scene.color}/>
  <div style={{position:'absolute',left:80,right:120,top:118,height:74,borderBottom:`2px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><Label color={C.orange} style={{fontSize:25}}>CLAUDE CODE</Label><Label style={{fontSize:23}}>{scene.label}</Label></div>
  <Scene time={local}/>
  <div style={{position:'absolute',left:390+Math.sin(time*.7)*100,top:1490}}><PixelMascot time={time} color={scene.color} happy={index===7||index===4&&local>7.1} inspect={index===5}/></div>
  <div style={{position:'absolute',left:80,right:120,top:1720}}>
   <div style={{display:'flex',gap:10}}>{scenes.map((s,i)=><div key={i} style={{height:6,flex:s.end-s.start,background:C.line,overflow:'hidden'}}><div style={{height:'100%',background:s.color,width:`${Math.min(1,Math.max(0,(time-s.start)/(s.end-s.start)))*100}%`}}/></div>)}</div>
   <div style={{marginTop:15,display:'flex',justifyContent:'space-between'}}><Label style={{fontSize:20}}>CAPITAL ONE / VULNHUNTER</Label><Label color={scene.color} style={{fontSize:20}}>{String(index+1).padStart(2,'0')} / 08</Label></div>
  </div>
  {wipe&&<svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,pointerEvents:'none'}}>{Array.from({length:12},(_,i)=>{
    const p=Math.max(0,Math.min(1,(local-i*.009)/.19));
    return <rect key={i} x={i*90} y={-1920*p} width="91" height="1920" fill={scene.color}/>;
  })}</svg>}
  <Audio src={staticFile('audio/soundtrack-reference.wav')}/>
 </AbsoluteFill>;
};
