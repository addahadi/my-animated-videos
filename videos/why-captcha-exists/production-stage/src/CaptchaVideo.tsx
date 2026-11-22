import React, {CSSProperties, useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, delayRender, continueRender, cancelRender} from 'remotion';
import timing from './timeline.json';

const C = {bg:'#101015',panel:'#191920',line:'#55515F',ink:'#F5F3ED',muted:'#C1BDC8',blue:'#91B6FA',violet:'#B8A1EE',orange:'#F2A65A'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>1-Math.pow(1-clamp(v),3);
const p=(t:number,at:number,d=.45)=>ease((t-at)/d);
const mix=(a:number,b:number,v:number)=>a+(b-a)*v;
const latin:CSSProperties={fontFamily:'Manrope, sans-serif',direction:'ltr',unicodeBidi:'isolate'};
const A:React.FC<{children:React.ReactNode;size?:number;color?:string;style?:CSSProperties}>=({children,size=64,color=C.ink,style})=><div dir="rtl" style={{fontFamily:'NotoArabic, sans-serif',fontWeight:700,fontSize:size,lineHeight:1.5,color,textAlign:'center',whiteSpace:'pre-line',...style}}>{typeof children==='string'?children.split(/([A-Za-z][A-Za-z0-9 .]*[A-Za-z0-9]|[A-Za-z])/g).map((part,i)=>/^[A-Za-z]/.test(part)?<bdi key={i} dir="ltr" style={latin}>{part}</bdi>:part):children}</div>;
const L:React.FC<{children:React.ReactNode;size?:number;color?:string;style?:CSSProperties}>=({children,size=48,color=C.ink,style})=><div style={{...latin,fontSize:size,fontWeight:700,color,textAlign:'center',...style}}>{children}</div>;
const Appear:React.FC<{t:number;at:number;children:React.ReactNode;style?:CSSProperties}>=({t,at,children,style})=>{const v=p(t,at,.3);return <div style={{opacity:v,transform:`translateY(${18*(1-v)}px)`,...style}}>{children}</div>};
type IconName='user'|'bot'|'lock'|'doc'|'shield'|'check'|'arrow'|'clock'|'signal'|'refresh';
const Icon:React.FC<{name:IconName;size?:number;color?:string;style?:CSSProperties}>=({name,size=80,color=C.ink,style})=><svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" style={style}>
 {name==='user'?<><circle cx="50" cy="28" r="17"/><path d="M17 88V77a33 33 0 0 1 66 0v11"/></>:
 name==='bot'?<><rect x="16" y="25" width="68" height="55" rx="14"/><path d="M50 12V25M5 45v17m90-17v17M35 67h30"/><circle cx="35" cy="46" r="4" fill={color}/><circle cx="65" cy="46" r="4" fill={color}/></>:
 name==='lock'?<><rect x="21" y="44" width="58" height="43" rx="9"/><path d="M33 44V29a17 17 0 0 1 34 0v15M50 61v10"/></>:
 name==='doc'?<><path d="M24 10h34l20 20v60H24ZM58 10v23h20M36 49h29M36 62h29M36 75h18"/></>:
 name==='shield'?<><path d="M50 8l32 13v26c0 24-18 37-32 46-14-9-32-22-32-46V21Z"/><path d="M35 51l11 11 22-25"/></>:
 name==='check'?<path d="M18 52l23 23 43-50"/>:
 name==='arrow'?<path d="M50 13v73M28 65l22 22 22-22"/>:
 name==='clock'?<><circle cx="50" cy="50" r="36"/><path d="M50 27v25l17 10"/></>:
 name==='refresh'?<><path d="M78 34a32 32 0 1 0 3 28M79 14v23H56"/></>:
 <><rect x="28" y="10" width="44" height="80" rx="12"/><circle cx="50" cy="29" r="7"/><circle cx="50" cy="50" r="7"/><circle cx="50" cy="71" r="7"/></>}
</svg>;

const Request:React.FC<{color?:string;id?:string;small?:boolean;style?:CSSProperties}>=({color=C.blue,id='01',small=false,style})=><div style={{width:small?210:320,height:small?76:100,border:`3px solid ${color}`,borderRadius:18,background:C.panel,display:'flex',alignItems:'center',padding:'0 20px',gap:18,boxSizing:'border-box',...style}}><Icon name={color===C.blue?'user':'bot'} size={small?42:54} color={color}/><div style={{height:5,background:color,flex:1,opacity:.65,borderRadius:5}}/><L size={small?30:38} color={color}>{id}</L></div>;

const Gate:React.FC<{open?:number;size?:number;uncertain?:boolean}>=({open=0,size=95,uncertain=false})=><svg width={size*1.6} height={size} viewBox="0 0 160 100" fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round">
 <path d="M16 91V20a10 10 0 0 1 10-10h108a10 10 0 0 1 10 10v71M6 92h30m88 0h30"/>
 <path d="M36 91V31h88v60" stroke={C.line}/><g transform={`rotate(${-76*open} 39 60)`}><path d="M39 60h81" strokeWidth="9"/><path d="M53 55l9 10m11-10 9 10m11-10 9 10" stroke={C.panel} strokeWidth="4"/></g>
 <circle cx="80" cy="20" r="5" fill={C.orange} stroke="none"/>{uncertain&&<text x="80" y="47" textAnchor="middle" stroke="none" fill={C.orange} fontFamily="Manrope" fontSize="28">?</text>}
</svg>;

const Browser:React.FC<{children:React.ReactNode;height?:number;label?:string}>=({children,height=640,label='site.example'})=><div style={{position:'relative',width:790,height,background:C.panel,border:`3px solid ${C.line}`,borderRadius:28,overflow:'hidden',boxShadow:'0 18px 0 #09090d'}}>
 <div style={{height:72,borderBottom:`2px solid ${C.line}`,display:'flex',alignItems:'center',gap:12,padding:'0 25px'}}><div style={{height:12,width:12,borderRadius:20,background:C.muted}}/><div style={{height:12,width:12,borderRadius:20,background:C.line}}/><L size={28} color={C.muted} style={{margin:'0 auto'}}>{label}</L><Icon name="lock" size={28} color={C.muted}/></div>{children}
</div>;

const TrafficTile:React.FC<{index:number;selected?:boolean;wrong?:boolean}>=({index,selected=false,wrong=false})=>{const traffic=[1,4,8].includes(index);return <div style={{width:142,height:128,borderRadius:13,background:selected?'#28364b':'#282830',border:`3px solid ${selected?(wrong?C.orange:C.blue):'#393842'}`,boxSizing:'border-box',position:'relative',overflow:'hidden'}}>
 <svg width="100%" height="100%" viewBox="0 0 142 128"><path d="M0 88L142 50V128H0Z" fill="#3b3d47"/><path d="M0 110l142-40" stroke="#85858b" strokeDasharray="15 12" strokeWidth="4"/>
 {traffic?<g transform={`translate(${index===4?82:32},10)`}><path d="M0 8v92" stroke={C.muted} strokeWidth="6"/><rect x="-14" y="0" width="30" height="67" rx="7" fill="#111116" stroke="#d9d8dc" strokeWidth="2"/><circle cx="1" cy="14" r="7" fill="#e86b69"/><circle cx="1" cy="34" r="6" fill="#766249"/><circle cx="1" cy="53" r="6" fill="#4c685d"/></g>:
 index%3===0?<g><path d="M15 66V17h45v37m20-6V6h42v30" fill="#50505d" stroke="#747480" strokeWidth="2"/><path d="M24 26h8m15 0h5M91 17h8m9 0h5" stroke="#a5a4b0" strokeWidth="6"/></g>:
 <g transform={`translate(${15+index*3},47)`}><path d="M0 24l12-20h43l16 20v22H0Z" fill="#899aad" stroke="#d3d8e0" strokeWidth="2"/><path d="M18 8h32l9 17H8Z" fill="#323740"/><circle cx="15" cy="45" r="9" fill="#14141a"/><circle cx="56" cy="45" r="9" fill="#14141a"/></g>}
 </svg>{selected&&<div style={{position:'absolute',right:4,top:4,background:wrong?C.orange:C.blue,borderRadius:20,width:30,height:30,display:'grid',placeItems:'center'}}><Icon name={wrong?'refresh':'check'} size={21} color={C.bg}/></div>}
 </div>};
const Grid:React.FC<{t:number;at?:number;retry?:boolean}>=({t,at=0,retry=false})=><div style={{position:'relative',width:454,height:414,display:'grid',gridTemplateColumns:'repeat(3,142px)',gap:14}}>{Array.from({length:9},(_,i)=><div key={i} style={{opacity:p(t,at+Math.floor(i/3)*.13,.25)}}><TrafficTile index={i} selected={retry?(i===2&&t>at+1):([1,4,8].includes(i)&&t>at+1.4+[1,4,8].indexOf(i)*.65)} wrong={retry}/></div>)}</div>;
const Cursor:React.FC<{x:number;y:number;click?:boolean}>=({x,y,click=false})=><svg style={{position:'absolute',left:x,top:y,overflow:'visible',filter:'drop-shadow(0 3px 3px #0008)'}} width="52" height="65" viewBox="0 0 52 65"><path d="M5 3l34 30-17 2-8 17Z" fill={C.ink} stroke={C.bg} strokeWidth="3"/>{click&&<circle cx="9" cy="9" r="24" fill="none" stroke={C.blue} strokeWidth="3"/>}</svg>;
const FlowArrow:React.FC<{color?:string;opacity?:number}>=({color=C.line,opacity=1})=><Icon name="arrow" size={60} color={color} style={{opacity}}/>;

const Hook:React.FC<{t:number;loop?:boolean}>=({t,loop=false})=>{const show=loop?1:p(t,2.46,.4);const gridT=loop?2.8:t-2.46;const v=loop?1:p(t,5.5);return <Browser>
 <div style={{position:'absolute',left:35,top:100,width:720,display:'flex',alignItems:'center',justifyContent:'space-between'}}><A size={48}>{show>.5?'اختار صور الإشارات':'إنشاء حساب'}</A><Gate size={66}/></div>
 <div style={{opacity:1-show,position:'absolute',left:90,top:235,width:610}}><div style={{height:60,border:`2px solid ${C.line}`,borderRadius:12,marginBottom:24}}/><div style={{height:60,border:`2px solid ${C.line}`,borderRadius:12,marginBottom:28}}/><div style={{background:C.blue,height:70,borderRadius:12,display:'grid',placeItems:'center'}}><A size={42} color={C.bg}>فتح حساب</A></div><div style={{transform:`translateX(${mix(-70,140,p(t,.1,1.2))}px)`,marginTop:35}}><Request small/></div></div>
 <div style={{position:'absolute',left:163,top:190,opacity:show,transform:`scale(${mix(.95,1,show)})`}}><Grid t={gridT}/></div>
 {show>.5&&<Cursor x={mix(610,360,v)} y={mix(540,385,v)} click={t>4&&t<4.4}/>}
 </Browser>};

const Person:React.FC<{color:string;hat?:number}>=({color,hat=0})=><svg width="110" height="200" viewBox="0 0 110 200" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"><circle cx="55" cy="43" r="24"/><path d="M16 132V104a39 39 0 0 1 78 0v28M35 137v50m40-50v50"/>{hat>0&&<path d={hat===1?'M21 28h68M36 26V8h38v18':'M25 26L54 3l31 23Z'} fill={color}/>}</svg>;

const Queue:React.FC<{t:number}>=({t})=>{const digital=p(t,5.74,.65);return <div style={{position:'relative',width:790,height:650}}>
 <div style={{position:'absolute',top:10,left:300}}><Gate size={120}/></div>
 <div style={{position:'absolute',left:10,top:190,width:770,opacity:1-digital,transform:`scale(${1-.1*digital})`}}><div style={{display:'flex',justifyContent:'center',gap:70}}><Person color={C.blue}/><Person color={C.violet} hat={t>4?2:t>2.62?1:0}/><div style={{opacity:p(t,2.62)}}><Person color={C.violet} hat={1}/></div></div><A size={52} style={{marginTop:25}}>نفس الشخص، كل مرة</A></div>
 <div style={{position:'absolute',inset:0,opacity:digital}}>
 <div style={{position:'absolute',left:20,top:210}}><Icon name="bot" size={110} color={C.violet}/><L size={38} color={C.violet}>bot</L></div>
 {[0,1,2].map((i)=><div key={i} style={{position:'absolute',top:220+i*100,left:220+mix(-25,0,p(t,6+i*.75)),opacity:p(t,6+i*.75)}}><Request color={C.violet} id={`0${i+1}`}/></div>)}
 <div style={{position:'absolute',left:475,top:535,transform:`translateY(${-15*p(t,8.6)}px)`}}><Request small/><A size={42} color={C.blue} style={{marginTop:12}}>يستنى دورو</A></div>
 <svg width="790" height="650" style={{position:'absolute',inset:0,pointerEvents:'none'}}><path d="M133 265h65M385 210v-37" stroke={C.violet} strokeWidth="4" strokeDasharray="9 9"/></svg>
 </div>
 </div>};

const CaseCard:React.FC<{kind:'account'|'password'|'data';t:number}>=({kind,t})=><div style={{width:600,height:300,border:`3px solid ${C.line}`,borderRadius:24,background:C.panel,position:'relative',overflow:'hidden'}}>
 <div style={{position:'absolute',left:32,top:42}}><Icon name={kind==='account'?'user':kind==='password'?'lock':'doc'} size={112} color={C.ink}/></div>
 {Array.from({length:3},(_,i)=><div key={i} style={{position:'absolute',left:210+i*104,top:mix(35,60+i*8,p(t,i*.18,.5)),opacity:p(t,i*.18),transform:`rotate(${i*5-5}deg)`,width:95,height:130,border:`3px solid ${C.violet}`,borderRadius:12,background:C.panel,display:'grid',placeItems:'center'}}><Icon name={kind==='account'?'user':kind==='password'?'lock':'doc'} size={55} color={C.violet}/></div>)}
 <A size={48} style={{position:'absolute',bottom:22,left:0,right:0}}>{kind==='account'?'حسابات مزوّرة':kind==='password'?'كلمات سر مسروقة':'جمع البيانات بكثرة'}</A>
 </div>;
const Bots:React.FC<{t:number}>=({t})=>{const kind=t<6.1?'account':t<7.82?'password':'data';const at=kind==='account'?4.66:kind==='password'?6.1:7.82;return <div style={{width:790,height:650,position:'relative'}}>
 <div style={{position:'absolute',left:315,top:0}}><Icon name="bot" size={145} color={C.violet}/></div><L color={C.violet} style={{position:'absolute',top:145,left:0,right:0}}>bot</L>
 <div style={{position:'absolute',left:95,top:240}}>{t<4.66?<><A size={68}>برنامج يخدم وحدو</A><div style={{display:'flex',justifyContent:'center',gap:45,marginTop:38,opacity:p(t,3.4)}}><Icon name="doc" size={72} color={C.muted}/><Icon name="clock" size={72} color={C.muted}/><Icon name="refresh" size={72} color={C.muted}/></div></>:<CaseCard key={kind} kind={kind} t={t-at}/>}</div>
 <div style={{position:'absolute',left:310,top:555,opacity:p(t,10.82)}}><Gate size={95}/></div>
 </div>};

const TextChallenge:React.FC<{t:number}>=({t})=><Browser>
 <div style={{position:'absolute',top:100,left:0,right:0}}><L size={62} style={{opacity:p(t,1.08)}}>CAPTCHA</L><div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:50,marginTop:12}}><Icon name="user" size={67} color={C.blue} style={{opacity:p(t,2.7)}}/><Gate size={80} open={p(t,12.7)}/><Icon name="bot" size={67} color={C.violet} style={{opacity:p(t,3.6)}}/></div></div>
 <div style={{position:'absolute',top:300,left:75,width:640,opacity:p(t,4.08)}}><A size={48} color={C.muted}>الفكرة الأصلية</A>
 <div style={{height:110,marginTop:20,background:'#23232d',borderRadius:12,display:'flex',justifyContent:'center',alignItems:'center',gap:20,position:'relative',opacity:p(t,8.42)}}>{'K7M2'.split('').map((s,i)=><span key={i} style={{...latin,fontSize:78,fontWeight:800,color:C.ink,display:'inline-block',transform:`rotate(${[-14,12,-9,16][i]}deg) skewX(-8deg)`}}>{s}</span>)}<svg width="640" height="110" style={{position:'absolute',inset:0}}><path d="M36 50Q190 110 320 43T604 45M35 77Q250 10 600 75" fill="none" stroke={C.violet} strokeWidth="3" opacity=".6"/></svg></div>
 <div style={{height:80,border:`3px solid ${C.blue}`,borderRadius:12,marginTop:20,display:'grid',placeItems:'center',opacity:p(t,10.82)}}><L size={55} color={C.blue}>{'K7M2'.slice(0,Math.floor(clamp((t-10.82)/1.35)*4))}<span style={{opacity:t%1<.5?1:0}}>│</span></L></div></div>
 </Browser>;

const Evolution:React.FC<{t:number}>=({t})=><Browser>
 <div style={{position:'absolute',top:100,left:42,right:42,display:'flex',justifyContent:'space-between',alignItems:'center'}}><Gate size={75}/><div style={{opacity:p(t,2.55),display:'flex',alignItems:'center',gap:18}}><Icon name="bot" size={65} color={C.violet}/><svg width="65" height="55"><path d="M5 48L25 31l10 6L60 8m-16 0h16v17" stroke={C.violet} strokeWidth="5" fill="none"/></svg></div></div>
 <div style={{position:'absolute',left:163,top:190,transform:`translateX(${t>8.3&&t<8.65?Math.sin(t*70)*8:0}px)`}}><Grid t={t>8.19?t-8.19+1.1:t} retry={t>8.19}/></div>
 <div style={{position:'absolute',right:25,top:330,opacity:p(t,5.95)}}><Icon name={t>8.19?'refresh':'shield'} size={65} color={C.orange}/></div>
 </Browser>;

const Risk:React.FC<{t:number}>=({t})=><div style={{position:'relative',width:790,height:650}}>
 <div style={{position:'absolute',top:0,left:12,width:766,height:125,border:`3px solid ${C.line}`,borderRadius:20,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',boxSizing:'border-box',background:C.panel}}><Request small/><A size={48}>الموقع</A><Icon name="lock" size={55}/></div>
 <div style={{position:'absolute',top:145,left:355}}><FlowArrow color={t>6.69?C.blue:C.line}/></div>
 <div style={{position:'absolute',left:74,top:225,width:640,height:260,border:`3px solid ${C.line}`,borderRadius:26,background:C.panel,opacity:p(t,3.97)}}>
 <L size={48} style={{marginTop:18}}>reCAPTCHA v3</L>
 <div style={{position:'absolute',top:94,left:45,display:'flex',alignItems:'center',gap:30}}><Icon name="doc" size={64} color={C.blue} style={{opacity:p(t,6.69)}}/><div style={{width:mix(25,170,p(t,6.69,1)),height:4,background:C.blue,opacity:p(t,6.69)}}/><div style={{opacity:p(t,5.65)}}><Gate size={83}/></div></div>
 <div style={{position:'absolute',bottom:20,left:0,right:0,opacity:p(t,8.81)}}><A size={48} color={C.orange}>تقدير للخطر</A></div>
 </div>
 <div style={{position:'absolute',top:500,left:354,opacity:p(t,10.11)}}><FlowArrow/></div>
 <div style={{position:'absolute',top:568,left:75,width:640,display:'flex',justifyContent:'space-between',opacity:p(t,10.11)}}><div style={{borderBottom:`4px solid ${C.blue}`,paddingBottom:8}}><A size={48}>يكمل الطلب</A></div><div style={{borderBottom:`4px solid ${C.orange}`,paddingBottom:8}}><A size={48}>تحقّق إضافي</A></div></div>
 </div>;

const Recap:React.FC<{t:number}>=({t})=>{const summary=t>=9.3;return <div style={{position:'relative',width:790,height:650}}>
 <div style={{position:'absolute',left:215,top:15,width:360,height:130}}>{[0,1,2].map(i=><div key={i} style={{position:'absolute',top:i*18,left:i*16,opacity:p(t,i*.16)}}><Request color={C.violet} id={`0${i+1}`}/></div>)}</div>
 <div style={{position:'absolute',top:170,left:354}}><FlowArrow color={C.violet}/></div>
 <div style={{position:'absolute',left:285,top:245}}><Gate size={135} uncertain={t>8.13} open={t>8.13?.35:0}/></div>
 <div style={{position:'absolute',top:385,left:355}}><FlowArrow color={C.muted}/></div>
 <div style={{position:'absolute',left:220,top:470,width:350,height:108,border:`3px solid ${C.line}`,borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',gap:25,background:C.panel}}><Icon name="doc" size={63}/><A size={58}>الموقع</A></div>
 {!summary&&<><div style={{position:'absolute',left:10,top:290,opacity:p(t,2.91)}}><Icon name={t<6.75?'doc':'clock'} size={92} color={C.orange}/></div>{t>8.13&&<div style={{position:'absolute',left:590,top:mix(310,480,p(t,8.13,.9))}}><Request small color={C.violet}/></div>}</>}
 {summary&&<div style={{position:'absolute',left:25,top:300}}><L color={C.orange} size={80}>?</L></div>}
 </div>};

const Closing:React.FC<{t:number}>=({t})=>{const returning=p(t,4.84,.65);return <div style={{position:'relative',width:790,height:650}}>
 <div style={{opacity:1-returning,position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:30}}><svg width="270" height="295" viewBox="0 0 100 110"><path d="M50 6l35 14v33c0 23-18 39-35 51-17-12-35-28-35-51V20Z" fill={C.panel} stroke={C.line} strokeWidth="2" strokeDasharray="72 6"/><path d="M32 51l13 14 26-31" fill="none" stroke={C.blue} strokeWidth="4" strokeLinecap="round"/></svg><A size={60}>محاولة لحماية الموقع</A></div>
 <div style={{opacity:returning,transform:`scale(${mix(.94,1,returning)})`}}><Hook t={t} loop/></div>
 </div>};

const headings=[['علاش نثبت','بلي إنسان؟'],['واحد يقدر','يزاحم الجميع'],['برنامج واحد','استعمالات بزاف'],['هنا جات','فكرة CAPTCHA'],['البرامج تتطوّر','والحماية ثاني'],['ماشي لازم','تخرجلك صور'],['يصعّب الاستغلال','ماشي ضمان كامل'],['علاش نثبت','بلي إنسان؟']];
function phrase(i:number,t:number):string{
 if(i===0)return t<2.46?'حبيت تفتح حساب برك':t<5.5?'اختار صور الإشارات':'علاش هاذ المرحلة الزايدة؟';
 if(i===1)return t<5.74?'نفس الشخص، كل مرة':'برنامج واحد، طلبات بزاف';
 if(i===2)return t<4.66?'برنامج يخدم وحدو':t<6.1?'حسابات مزوّرة':t<7.82?'كلمات سر مسروقة':'جمع البيانات بكثرة';
 if(i===3)return t<4.08?'اختبار يفرّق بيناتنا':t<10.82?'الإنسان يقرا الحروف':'يعاود يكتبها فالخانة';
 if(i===4)return t<5.95?'الاختبارات ماشي ضمان كامل':t<8.19?'الحماية تتبدّل مع البرامج':'غلطت؟ ما يعنيش راك robot';
 if(i===5)return t<3.97?'ماشي كل تحقّق يحتاج صور':t<8.81?'تحقّق يخدم فالخلفية':t<10.11?'تقدير للخطر، ماشي يقين':'الموقع يختار واش يدير';
 if(i===6)return t<6.75?'يصعّب العمليات بالجملة':t<9.3?'يفوت؟ ماشي دليل قاطع':'يصعّب الاستغلال، ماشي ضمان كامل';
 return t>=6&&t<8?'حروف ولا صور؟':t<4.84?'هاذ الثواني عندها سبب':'باش تدخل، تثبت بلي إنسان';
}
const scenes=[Hook,Queue,Bots,TextChallenge,Evolution,Risk,Recap,Closing];
const Scene:React.FC<{index:number}>=({index})=>{const frame=useCurrentFrame();const t=frame/30;const Art=scenes[index];const text=phrase(index,t);const title=headings[index];return <AbsoluteFill>
 <div style={{position:'absolute',left:98,top:268,width:795,display:'flex',alignItems:'center',justifyContent:'space-between'}}><L size={27} color={C.muted} style={{letterSpacing:.2}}>Claude DZ</L><div style={{display:'flex',alignItems:'center',gap:12}}>{Array.from({length:8},(_,i)=><div key={i} style={{width:i===index?34:9,height:5,borderRadius:5,background:i===index?C.ink:C.line}}/>)}</div></div>
 <div style={{position:'absolute',left:92,top:325,width:810}}><A size={82} style={{lineHeight:1.42}}>{title.join('\n')}</A></div>
 <div style={{position:'absolute',left:100,top:575,width:795,height:650}}><Art t={t}/></div>
 <div style={{position:'absolute',left:95,top:1260,width:805,height:160,display:'flex',alignItems:'center',justifyContent:'center'}}><A size={64} color={index===6&&t>=9.3?C.orange:C.ink} style={{lineHeight:1.45,maxWidth:805}}>{text}</A></div>
 </AbsoluteFill>};

export const CaptchaVideo:React.FC=()=> {const [handle]=useState(()=>delayRender('Load local Arabic and Latin fonts'));useEffect(()=>{Promise.all([document.fonts.load('700 82px NotoArabic'),document.fonts.load('700 48px Manrope')]).then(()=>continueRender(handle)).catch(cancelRender);},[handle]);return <AbsoluteFill style={{backgroundColor:C.bg,color:C.ink}}>
 <style>{`@font-face{font-family:NotoArabic;src:url('${staticFile('fonts/Arabic.ttf')}') format('truetype');font-weight:100 900;font-display:block} @font-face{font-family:Manrope;src:url('${staticFile('fonts/Latin.ttf')}') format('truetype');font-weight:100 900;font-display:block} *{box-sizing:border-box}`}</style>
 {timing.scenes.map((s,i)=><Sequence key={s.id} from={s.startFrame} durationInFrames={s.endFrame-s.startFrame}><Scene index={i}/></Sequence>)}
 <Audio src={staticFile('audio/narration.wav')}/>
 </AbsoluteFill>};
