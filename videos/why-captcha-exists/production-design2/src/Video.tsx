import React,{CSSProperties,useEffect,useState} from 'react';
import {AbsoluteFill,Sequence,staticFile,useCurrentFrame,delayRender,continueRender,cancelRender} from 'remotion';
import timeline from './timeline.json';

const C={bg:'#F0EFF4',white:'#FFFFFF',ink:'#111214',gray:'#D2D4D9',pale:'#E6E7EC',blue:'#0087FA',yellow:'#FFC400',muted:'#646B78',wash:'#E2F0FF'};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const ease=(x:number)=>{const v=clamp(x);return v*v*(3-2*v)};
const p=(t:number,at:number,d=.55)=>ease((t-at)/d);
const mix=(a:number,b:number,v:number)=>a+(b-a)*v;
const T:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;color?:string;latin?:boolean;anchor?:'start'|'middle'|'end'}>=({x,y,children,size=48,color=C.ink,latin=false,anchor='middle'})=><text x={x} y={y} fontFamily="Tajawal, sans-serif" fontWeight={700} fontSize={size} fill={color} textAnchor={anchor} direction={latin?'ltr':'rtl'}>{children}</text>;
const Check:React.FC<{x:number;y:number;scale?:number;color?:string}>=({x,y,scale=1,color=C.blue})=><path transform={`translate(${x} ${y}) scale(${scale})`} d="M-15 0L-3 12L21-18" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>;
const Warning:React.FC<{x:number;y:number;s?:number}>=({x,y,s=1})=><g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0-26L28 24H-28Z" fill={C.yellow} stroke={C.ink} strokeWidth={3}/><path d="M0-10V6" stroke={C.ink} strokeWidth={5} strokeLinecap="round"/><circle cy={15} r={3} fill={C.ink}/></g>;
type GlyphName='user'|'bot'|'lock'|'doc'|'clock'|'mail'|'image'|'key'|'site';
const Glyph:React.FC<{name:GlyphName;x?:number;y?:number;s?:number;color?:string}>=({name,x=0,y=0,s=1,color=C.blue})=><g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
 {name==='user'?<><circle cy={-12} r={13}/><path d="M-25 29V21Q-25 2 0 2T25 21V29Z"/></>:name==='bot'?<><rect x={-32} y={-25} width={64} height={50} rx={12}/><path d="M0-37V-25M-41-10V10M41-10V10M-12 12H12"/><circle cx={-13} cy={-7} r={3} fill={color}/><circle cx={13} cy={-7} r={3} fill={color}/></>:name==='lock'?<><rect x={-24} y={-1} width={48} height={36} rx={7}/><path d="M-15-1V-19a15 15 0 0130 0V-1M0 12V23"/></>:name==='doc'?<><path d="M-22-34H7L28-12V35H-22ZM7-34V-12H28M-10 1H15M-10 12H15M-10 23H7"/></>:name==='clock'?<><circle r={30}/><path d="M0-17V2L15 11"/></>:name==='mail'?<><rect x={-32} y={-22} width={64} height={44} rx={5}/><path d="M-30-18L0 5L30-18"/></>:name==='image'?<><rect x={-32} y={-26} width={64} height={52} rx={5}/><circle cx={15} cy={-12} r={6}/><path d="M-30 18L-7-7L9 12L20 1L31 16"/></>:name==='key'?<><circle cx={-13} cy={-12} r={16}/><path d="M0 1L29 30M14 15L23 6M23 24L31 16"/></>:<><rect x={-37} y={-29} width={74} height={58} rx={6}/><path d="M-36-13H36M-21-22H-18M-9-22H-6"/></>}
</g>;
const Line:React.FC<{x1:number;y1:number;x2:number;y2:number;progress?:number;color?:string;dashed?:boolean}>=({x1,y1,x2,y2,progress=1,color=C.blue,dashed=false})=>{const length=Math.hypot(x2-x1,y2-y1);return <g transform={`translate(${x1} ${y1}) rotate(${Math.atan2(y2-y1,x2-x1)*180/Math.PI})`}><path d={`M0 0H${length}`} stroke={color} strokeWidth={4} strokeDasharray={dashed?'8 10':length} strokeDashoffset={dashed?0:length*(1-progress)} fill="none"/>{progress>.97&&<path d={`M${length-14}-9L${length} 0L${length-14} 9`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"/>}</g>};
const Button:React.FC<{x:number;y:number;w:number;text:string;active?:boolean;yellow?:boolean;size?:number}>=({x,y,w,text,active=false,yellow=false,size=43})=><g><rect x={x} y={y} width={w} height={65} rx={12} fill={yellow?C.yellow:active?C.blue:C.white} stroke={yellow?C.ink:active?C.blue:C.gray} strokeWidth={3}/><T x={x+w/2} y={y+44} size={size} color={active?C.white:C.ink}>{text}</T></g>;
const Pointer:React.FC<{x:number;y:number;click?:number}>=({x,y,click=0})=><g transform={`translate(${x} ${y})`}>{click>0&&click<1&&<circle r={12+35*click} fill="none" stroke={C.blue} strokeWidth={5} opacity={1-click}/>}<path d="M0 0L12 52L23 36L43 30Z" fill={C.ink} stroke={C.white} strokeWidth={3}/></g>;
const Browser:React.FC<{x:number;y:number;w:number;h:number;children:React.ReactNode;title?:string}>=({x,y,w,h,children,title='الموقع'})=><g transform={`translate(${x} ${y})`}><rect y={8} width={w} height={h} rx={24} fill={C.gray}/><rect width={w} height={h} rx={24} fill={C.white} stroke={C.ink} strokeWidth={5}/><path d={`M0 65H${w}`} stroke={C.ink} strokeWidth={3}/><circle cx={25} cy={31} r={5} fill={C.ink}/><circle cx={44} cy={31} r={5} fill={C.gray}/><T x={w/2} y={44} size={title==='reCAPTCHA v3'?32:37} latin={title==='reCAPTCHA v3'}>{title}</T>{title!=='reCAPTCHA v3'&&<Glyph name="lock" x={w-31} y={30} s={.35} color={C.ink}/>} {children}</g>;

const Person:React.FC<{x:number;y:number;s?:number;color?:string;hat?:number;reach?:number;doubt?:boolean;walk?:number}>=({x,y,s=1,color=C.blue,hat=0,reach=0,doubt=false,walk=0})=><g transform={`translate(${x} ${y}) scale(${s})`}>
 <path d={`M-18 245L${-24+walk*14} 336M20 245L${26-walk*14} 336`} stroke={C.ink} strokeWidth={25} strokeLinecap="round"/><path d={`M${-26+walk*14} 338h-22m${75-walk*28} 0h22`} stroke={C.ink} strokeWidth={13} strokeLinecap="round"/>
 <path d="M-47 245V121Q-47 77 0 77T47 121V245Z" fill={color} stroke={C.ink} strokeWidth={4}/><path d="M-34 240H34" stroke={color===C.blue?'#0069C5':'#A9ADB7'} strokeWidth={7}/>
 <path d="M-31 122L-40 208" stroke={C.ink} strokeWidth={25} strokeLinecap="round"/><path d="M-31 122L-40 208" stroke={color} strokeWidth={18} strokeLinecap="round"/>
 <path d={`M29 124Q47 167 ${mix(40,145,reach)} ${mix(206,158,reach)}`} stroke={C.ink} strokeWidth={25} strokeLinecap="round" fill="none"/><path d={`M29 124Q47 167 ${mix(40,145,reach)} ${mix(206,158,reach)}`} stroke={color} strokeWidth={18} strokeLinecap="round" fill="none"/>
 <circle cx={mix(40,145,reach)} cy={mix(208,158,reach)} r={12} fill={C.white} stroke={C.ink} strokeWidth={3}/>
 <circle r={38} fill={C.white} stroke={C.ink} strokeWidth={4}/><path d="M-37-7Q-30-39 3-37Q32-36 37-7Z" fill={C.ink}/><circle cx={12} cy={5} r={3} fill={C.ink}/><path d={doubt?'M6 22H22':'M8 22q7 6 15-1'} stroke={C.ink} strokeWidth={2.5} fill="none"/>
 {hat===1&&<g><path d="M-42-17H46M-25-18V-49H25V-18" fill={C.yellow} stroke={C.ink} strokeWidth={4}/></g>}{hat===2&&<path d="M-40-16L0-58L40-16Z" fill={C.white} stroke={C.ink} strokeWidth={4}/>}
 </g>;
const BotProgram:React.FC<{x:number;y:number;w?:number;t:number;active?:boolean}>=({x,y,w=230,t,active=true})=><g transform={`translate(${x} ${y}) scale(${w/230})`}><rect width={230} height={205} rx={18} fill={C.white} stroke={C.ink} strokeWidth={5}/><path d="M0 43H230" stroke={C.ink} strokeWidth={3}/><T x={115} y={32} size={32} latin>bot</T><Glyph name="bot" x={115} y={107} s={1.2} color={C.ink}/><path d="M65 168H164" stroke={C.gray} strokeWidth={9} strokeLinecap="round"/>{active&&<path d={`M65 168H${65+99*((t*.8)%1)}`} stroke={C.blue} strokeWidth={9} strokeLinecap="round"/>}<path d="M-18 218H248L235 235H-5Z" fill={C.gray} stroke={C.ink} strokeWidth={4}/></g>;
const Account:React.FC<{x:number;y:number;label?:string;bot?:boolean;blue?:boolean;w?:number}>=({x,y,label='yacine',bot=false,blue=false,w=235})=><g transform={`translate(${x} ${y})`}><rect width={w} height={88} rx={14} fill={blue?C.wash:C.white} stroke={blue?C.blue:C.ink} strokeWidth={3}/><Glyph name={bot?'bot':'user'} x={39} y={42} s={.58} color={blue?C.blue:C.ink}/><T x={w*.65} y={54} size={34} latin>{label}</T></g>;
const SignalTile:React.FC<{index:number;chosen?:boolean;wrong?:boolean}>=({index,chosen=false,wrong=false})=>{const has=[1,4,8].includes(index);return <g><rect width={123} height={111} rx={9} fill={chosen?wrong?'#FFF0B3':C.wash:'#F4F5F8'} stroke={chosen?wrong?C.yellow:C.blue:C.gray} strokeWidth={chosen?5:2}/>
 <path d="M1 83L121 60V109H1Z" fill="#D8DEE6"/><path d="M4 99L119 76" stroke={C.white} strokeWidth={4} strokeDasharray="14 10"/>
 {has?<g transform={`translate(${index===4?74:37} 10)`}><path d="M0 3V88" stroke={C.ink} strokeWidth={4}/><rect x={-13} width={27} height={62} rx={6} fill={C.ink}/><circle cy={13} r={6} fill="#F05B58"/><circle cy={32} r={6} fill="#D8A000"/><circle cy={49} r={6} fill="#7DA993"/></g>:index%3===0?<g><path d="M9 71V20H49V64M65 53V8H105V44" fill={C.gray} stroke={C.ink} strokeWidth={2}/><path d="M19 31h8m11 0h4M75 19h8m11 0h4" stroke={C.white} strokeWidth={7}/></g>:<g transform={`translate(${12+index*2} 48)`}><path d="M0 18L11 0H48L61 18V36H0Z" fill={C.blue} stroke={C.ink} strokeWidth={2}/><path d="M15 3H44L53 18H6Z" fill={C.white}/><circle cx={12} cy={34} r={8} fill={C.ink}/><circle cx={49} cy={34} r={8} fill={C.ink}/></g>}
 {chosen&&<g><circle cx={106} cy={15} r={13} fill={wrong?C.yellow:C.blue}/>{wrong?<path d="M101 10l10 10m0-10-10 10" stroke={C.ink} strokeWidth={2.5}/>:<Check x={106} y={15} scale={.38} color={C.white}/>}</g>}</g>};
const ChallengeGrid:React.FC<{x:number;y:number;t:number;selectAt?:number;wrong?:boolean}>=({x,y,t,selectAt=100,wrong=false})=><g transform={`translate(${x} ${y})`}>{Array.from({length:9},(_,i)=><g key={i} transform={`translate(${(i%3)*134} ${Math.floor(i/3)*122})`} opacity={p(t,Math.floor(i/3)*.12,.2)}><SignalTile index={i} chosen={wrong?i===2&&t>selectAt:[1,4,8].includes(i)&&t>selectAt+[1,4,8].indexOf(i)*.7} wrong={wrong}/></g>)}</g>;
const Distorted:React.FC<{x:number;y:number;w?:number}>=({x,y,w=340})=><g transform={`translate(${x} ${y})`}><rect width={w} height={110} rx={12} fill={C.pale}/>{'K7M2'.split('').map((v,i)=><g key={i} transform={`translate(${w/2-112+i*74} 78) rotate(${[-12,11,-8,14][i]}) skewX(-7)`}><T x={0} y={0} size={66} latin>{v}</T></g>)}<path d={`M12 47Q${w*.28} 100 ${w*.52} 48T${w-12} 40M13 82Q${w*.6} 12 ${w-15} 72`} fill="none" stroke={C.muted} strokeWidth={2.5}/></g>;

const SignupScene:React.FC<{t:number;closing?:boolean}>=({t,closing=false})=>{const popup=closing?1:p(t,2.55,.35);const gridTime=closing?t:t-2.55;const done=closing&&t>5.8;const type=closing?'yacine':'yacine'.slice(0,Math.floor(p(t,.45,1.3)*6));return <g>
 <Person x={116} y={310} s={.92} reach={closing?.7:p(t,1.25,.9)} doubt={popup>.5&&!done}/><T x={115} y={735} size={45}>زائر الموقع</T>
 <Browser x={290} y={85} w={550} h={620} title="الموقع">
 <g opacity={1-popup*.88}><T x={275} y={137} size={52}>إنشاء حساب</T><T x={452} y={207} size={35} anchor="middle">الاسم</T><rect x={55} y={225} width={440} height={73} rx={12} fill={C.white} stroke={C.gray} strokeWidth={3}/><T x={275} y={275} size={44} latin>{type}</T><T x={433} y={352} size={35}>كلمة السر</T><rect x={55} y={367} width={440} height={73} rx={12} fill={C.white} stroke={C.gray} strokeWidth={3}/><T x={275} y={418} size={44} latin>••••••••</T><Button x={55} y={480} w={440} text="فتح حساب" active/></g>
 <g opacity={popup}><rect x={28} y={83} width={494} height={532} rx={17} fill={C.white} stroke={C.ink} strokeWidth={3}/><T x={275} y={140} size={43}>اختار صور الإشارات</T><ChallengeGrid x={77} y={165} t={gridTime} selectAt={closing?1.15:100}/><Button x={77} y={540} w={391} text={done?'يكمل الطلب':'تحقّق'} active={done} size={38}/></g>
 {done&&<g opacity={p(t,5.8)}><rect x={28} y={83} width={494} height={510} rx={17} fill={C.white} stroke={C.ink} strokeWidth={3}/><circle cx={275} cy={260} r={75} fill={C.blue}/><Check x={275} y={265} scale={2.3} color={C.white}/><T x={275} y={412} size={58}>يكمل الطلب</T></g>}
 </Browser>
 <Pointer x={mix(250,660,p(t,.6,1.4))} y={closing?430:mix(640,590,p(t,.6,1.4))} click={closing?0:clamp((t-2.35)/.6)}/>
 {!closing&&t>5.5&&<g opacity={p(t,5.5)}><path d="M78 188Q78 155 114 155H165Q203 155 203 190V221Q203 248 171 248H142L115 272V248Q78 248 78 220Z" fill={C.white} stroke={C.ink} strokeWidth={3}/><T x={141} y={224} size={64}>؟</T></g>}
 </g>};

const QueueScene:React.FC<{t:number}>=({t})=>{const digital=p(t,5.74,.65);const cycle=clamp((t-2.62)/3);const loops=(cycle*2)%1;return <g>
 <g opacity={1-digital}>
 <path d="M38 698H859" stroke={C.gray} strokeWidth={5}/><Browser x={602} y={95} w={245} h={440} title="الشباك"><rect x={28} y={112} width={188} height={170} rx={8} fill={C.pale} stroke={C.ink} strokeWidth={3}/><Glyph name="user" x={122} y={182} s={1.1} color={C.ink}/><path d="M15 300H230" stroke={C.ink} strokeWidth={12}/><T x={122} y={385} size={41}>الدور تاعك</T></Browser>
 <Person x={115} y={365} s={.86} color={C.blue}/><T x={115} y={742} size={42}>يستنى</T>
 <Person x={t<2.62?350:350+170*Math.pow(Math.sin(cycle*Math.PI*2),2)} y={365} s={.86} color={C.gray} hat={t>4.15?2:t>2.62?1:0} walk={t>2.62?Math.sin(t*9):0}/>
 {t>2.62&&<g opacity={p(t,2.62)} transform={`translate(${mix(390,545,loops)} ${Math.sin(loops*Math.PI)*-18})`}><rect y={565} width={87} height={65} rx={8} fill={C.white} stroke={C.ink} strokeWidth={3}/><T x={43} y={611} size={39} latin>{t>4.15?'02':'01'}</T></g>}
 <g opacity={p(t,3.7)}><path d="M529 600Q539 790 335 778Q230 772 247 601" stroke={C.blue} strokeWidth={4} fill="none" strokeDasharray="10 12"/><path d="M237 615l12-21 15 19" fill="none" stroke={C.blue} strokeWidth={4}/></g>
 </g>
 <g opacity={digital}>
 <BotProgram x={32} y={220} t={t}/><T x={143} y={540} size={45}>برنامج واحد</T>
 <Browser x={566} y={90} w={290} h={515}><T x={145} y={130} size={42}>طلبات التسجيل</T>{[0,1,2].map(i=><g key={i} opacity={p(t,6.05+i*.75)}><Account x={23} y={165+i*102} label={`user_0${i+1}`} bot w={244}/></g>)}</Browser>
 <Line x1={277} y1={345} x2={550} y2={345} progress={p(t,6,.6)}/>
 {t>=6&&t<10.8&&[0,1,2].map(i=>{const u=clamp((t-6.05-i*.75)/1.1);return u>0&&u<1?<g key={i} transform={`translate(${mix(267,562,u)} 303)`}><Account x={0} y={0} bot label={`0${i+1}`} w={145}/></g>:null})}
 <g transform={`translate(100 ${mix(720,650,p(t,8.6))})`}><Account x={0} y={0} blue label="yacine" w={250}/><Glyph name="clock" x={310} y={44} s={.7} color={C.ink}/><T x={510} y={60} size={45}>في الانتظار</T></g>
 </g>
 </g>};

const DocumentCard:React.FC<{x:number;y:number;label?:string;blue?:boolean}>=({x,y,label='DATA',blue=false})=><g transform={`translate(${x} ${y})`}><path d="M0 0H105L150 45V188H0ZM105 0V45H150" fill={C.white} stroke={blue?C.blue:C.ink} strokeWidth={3}/><path d="M24 75H124M24 96H124M24 117H124" stroke={blue?C.blue:C.gray} strokeWidth={6}/><T x={75} y={163} size={32} latin>{label}</T></g>;
const VerificationGate:React.FC<{x:number;y:number;w?:number;open?:number;uncertain?:boolean}>=({x,y,w=230,open=0,uncertain=false})=><g transform={`translate(${x} ${y}) scale(${w/230})`}><path d="M10 170V14Q10 0 26 0H204Q220 0 220 14V170M0 171H42M188 171H230" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round"/><path d="M40 170V37H190V170" stroke={C.gray} strokeWidth={4} fill="none"/><g transform={`rotate(${-78*open} 43 111)`}><path d="M43 111H185" stroke={C.ink} strokeWidth={15} strokeLinecap="round"/><path d="M63 104l12 14m20-14 12 14m20-14 12 14m20-14 12 14" stroke={C.white} strokeWidth={7}/></g><circle cx={115} cy={18} r={7} fill={uncertain?C.yellow:C.blue}/>{uncertain&&<T x={115} y={91} size={65} color={C.ink}>؟</T>}</g>;

const BotUses:React.FC<{t:number}>=({t})=>{const accounts=t>=4.66&&t<6.1;const passwords=t>=6.1&&t<7.82;const docs=t>=7.82;const attempt=Math.floor((t-6.1)*2.8);return <g>
 <BotProgram x={35} y={240} t={t}/><T x={148} y={562} size={48}>برنامج آلي</T>
 <Line x1={280} y1={362} x2={370} y2={362} progress={p(t,3.4)}/>
 <Browser x={395} y={85} w={450} h={555}>
 {t<4.66&&<g><T x={225} y={145} size={49}>عملية تتعاود</T><rect x={70} y={193} width={310} height={95} rx={14} fill={C.wash}/><Glyph name="doc" x={131} y={240} s={.75}/><T x={270} y={254} size={40}>مهمة</T><path d="M93 338Q225 418 357 338M329 338H357V366" fill="none" stroke={C.blue} strokeWidth={6}/><T x={225} y={482} size={42}>يخدم وحدو</T></g>}
 {accounts&&<g><T x={225} y={143} size={48}>حسابات مزوّرة</T>{[0,1,2].map(i=><g key={i} opacity={p(t,4.66+i*.28,.2)}><Account x={47} y={177+i*100} bot label={`user_0${i+1}`} w={356}/></g>)}<Warning x={404} y={120} s={.6}/></g>}
 {passwords&&<g><T x={225} y={143} size={44}>كلمات سر مسروقة</T><Glyph name="lock" x={225} y={237} s={1.3} color={C.ink}/><rect x={55} y={315} width={340} height={78} rx={12} fill={C.white} stroke={C.ink} strokeWidth={3}/><T x={225} y={370} size={51} latin>{attempt%2?'••••••••':'••••••'}</T><Button x={90} y={426} w={270} text="محاولة أخرى" yellow size={38}/><g opacity={p(t,6.55)}><path d="M324 221l28 28m0-28-28 28" stroke={C.ink} strokeWidth={6}/><T x={225} y={534} size={35}>المحاولة مرفوضة</T></g></g>}
 {docs&&<g><T x={225} y={143} size={46}>معلومات الموقع</T>{[0,1,2].map(i=><g key={i} transform={`translate(38 ${185+i*102})`}><rect width={374} height={83} rx={10} fill={i%2?C.white:'#F4F5F8'} stroke={C.gray} strokeWidth={2}/><Glyph name={i===0?'image':'doc'} x={42} y={41} s={.65}/><path d="M94 28H337M94 48H281" stroke={C.gray} strokeWidth={7}/></g>)}</g>}
 </Browser>
 {docs&&<g opacity={p(t,8.2)}><g transform="translate(53 609)"><DocumentCard x={0} y={0} label="DATA" blue/><DocumentCard x={30} y={-13} label="DATA" blue/></g><Line x1={595} y1={685} x2={236} y2={685} progress={p(t,8.2,.7)}/>{t<10.82&&[0,1].map(i=>{const u=clamp((t-8.2-i*.85)/1.1);return u>0&&u<1?<g key={i} transform={`translate(${mix(570,150,u)} ${mix(525,650,u)}) scale(.45)`}><DocumentCard x={0} y={0} label="COPY" blue/></g>:null})}<T x={565} y={785} size={41}>الأصل يبقى، النسخ تتجمع</T></g>}
 {t>10.82&&<g opacity={p(t,10.82)}><rect x={389} y={578} width={462} height={130} rx={18} fill={C.white} stroke={C.ink} strokeWidth={4}/><Warning x={443} y={640} s={.72}/><T x={642} y={631} size={43}>لازم تحقّق</T><T x={642} y={681} size={45}>كيفاش نفرّق؟</T></g>}
 </g>};

const HistoricalTest:React.FC<{t:number}>=({t})=>{const typed='K7M2'.slice(0,Math.floor(clamp((t-10.82)/1.35)*4));return <g>
 <Person x={100} y={390} s={.79} reach={p(t,5.88,.8)}/><T x={105} y={751} size={45}>إنسان</T>
 <g transform="translate(698 415)"><BotProgram x={0} y={0} w={170} t={t} active={t>8.42}/></g><T x={778} y={704} size={44}>برنامج قديم</T>
 <Browser x={245} y={85} w={410} h={615} title="CAPTCHA">
 <g opacity={p(t,4.08)}><T x={205} y={127} size={35} color={C.muted}>مثال قديم للتوضيح</T></g>
 <g opacity={1-p(t,8.42)}><T x={205} y={314} size={128}>؟</T></g>
 <g opacity={p(t,8.42)}><Distorted x={35} y={182}/><T x={205} y={351} size={40}>اكتب الحروف</T><rect x={35} y={379} width={340} height={86} rx={11} fill={C.white} stroke={t>12.3?C.blue:C.ink} strokeWidth={3}/><T x={205} y={440} size={63} color={C.blue} latin>{typed}</T></g>
 <g opacity={p(t,12.3)}><Check x={205} y={523} scale={1.2}/><T x={205} y={583} size={40}>التطابق صحيح</T></g>
 </Browser>
 <Line x1={165} y1={468} x2={232} y2={468} progress={p(t,3.14)} color={C.blue}/>
 <Line x1={694} y1={465} x2={668} y2={465} progress={p(t,3.5)} color={C.ink}/>
 <g opacity={p(t,9.2)}><rect x={709} y={290} width={139} height={73} rx={12} fill={C.yellow} stroke={C.ink} strokeWidth={3}/><T x={779} y={342} size={39} latin>K?M?</T></g>
 {t>10.82&&t<12.4&&<Pointer x={510} y={510} click={clamp((t-10.82)/.6)}/>}
 <g opacity={p(t,12.7)}><Line x1={283} y1={782} x2={617} y2={782} progress={p(t,12.7,.3)}/><T x={450} y={848} size={43} color={C.blue}>هذا الطلب يقدر يكمل</T></g>
 </g>};

const EvolvingTest:React.FC<{t:number}>=({t})=>{const images=p(t,5.95,.4);const fail=t>8.19;return <g>
 <BotProgram x={24} y={199} w={180} t={t}/><T x={118} y={477} size={43}>البرامج تتطوّر</T>
 <Browser x={285} y={75} w={550} h={655} title="CAPTCHA">
 <g opacity={1-images}><T x={275} y={145} size={47}>اختبار الحروف</T><Distorted x={105} y={203}/><rect x={104} y={365} width={341} height={78} rx={12} fill={C.white} stroke={C.blue} strokeWidth={3}/><T x={275} y={418} size={60} latin>{t<2.55?'K?M?':'K7M2'}</T><g opacity={p(t,2.55)}><Check x={275} y={498} scale={1.3}/><Warning x={411} y={497} s={.8}/><T x={275} y={594} size={44}>ماشي ضمان كامل</T></g></g>
 <g opacity={images}><T x={275} y={143} size={43}>اختبار الصور</T><ChallengeGrid x={77} y={180} t={t-5.95} selectAt={fail?0:100} wrong={fail}/><g opacity={p(t,8.19)}><Button x={77} y={568} w={391} text="عاود جرّب" yellow size={42}/></g></g>
 </Browser>
 <g opacity={images}><Person x={103} y={570} s={.57} color={C.blue} doubt={fail} reach={1}/><T x={115} y={826} size={43}>إنسان غلط</T></g>
 {fail&&<Pointer x={mix(757,751,p(t,8.19))} y={374} click={clamp((t-8.19)/.65)}/>}
 </g>};

const BackgroundCheck:React.FC<{t:number}>=({t})=>{const assessment=p(t,3.97);return <g>
 <Browser x={27} y={92} w={410} h={509}>
 <T x={205} y={142} size={46}>إنشاء حساب</T><Glyph name="user" x={205} y={228} s={1.15}/><rect x={43} y={287} width={324} height={71} rx={11} fill={C.white} stroke={C.gray} strokeWidth={3}/><T x={205} y={336} size={43} latin>yacine</T><Button x={43} y={392} w={324} text="فتح حساب" active size={41}/>
 </Browser>
 <Pointer x={321} y={526} click={clamp((t-1.3)/.7)}/>
 <g opacity={1-assessment}><rect x={514} y={200} width={315} height={225} rx={16} fill={C.white} stroke={C.gray} strokeWidth={3}/><Glyph name="image" x={670} y={270} s={1.1} color={C.gray}/><path d="M583 368L757 207" stroke={C.ink} strokeWidth={5}/><T x={671} y={482} size={43}>بلا اختبار صور</T></g>
 <g opacity={assessment}><Browser x={513} y={142} w={330} h={405} title="reCAPTCHA v3">
 <g opacity={p(t,6.69)}><T x={165} y={139} size={45}>سياق التفاعل</T><Glyph name="doc" x={165} y={205} s={.72}/></g>
 <g opacity={p(t,8.81)}><T x={165} y={297} size={47}>تقدير الخطر</T><rect x={43} y={323} width={240} height={13} rx={6} fill={C.gray}/><path d="M43 329H141" stroke={C.blue} strokeWidth={13} strokeLinecap="round"/><circle cx={154} cy={329} r={12} fill={C.yellow} stroke={C.ink} strokeWidth={2}/><T x={165} y={384} size={34}>تقدير، ماشي يقين</T></g>
 </Browser></g>
 <Line x1={444} y1={363} x2={502} y2={363} progress={p(t,6.69)} color={t>6.69?C.blue:C.gray}/>
 {t>6.69&&t<8.81&&<g transform={`translate(${mix(437,510,p(t,6.69,1.1))} 344)`}><Glyph name="doc" s={.55}/></g>}
 <g opacity={p(t,10.11)}><Line x1={678} y1={564} x2={678} y2={617} progress={p(t,10.11,.3)}/><T x={452} y={649} size={47}>قرار الموقع</T><path d="M452 674V706M230 706H678M230 706V734M678 706V734" stroke={C.ink} strokeWidth={3} fill="none"/><Button x={62} y={748} w={335} text="يكمل الطلب" active size={45}/><Button x={509} y={748} w={335} text="تحقّق إضافي" yellow size={44}/><T x={452} y={800} size={38}>أو</T></g>
 </g>};

const CompareColumn:React.FC<{x:number;checked:boolean;t:number}>=({x,checked,t})=>{const allowed=checked&&t>8.13;return <g transform={`translate(${x} 0)`}>
 <T x={205} y={65} size={49}>{checked?'مع تحقّق':'بلا تحقّق'}</T>
 <BotProgram x={105} y={104} w={200} t={t} active={!checked||t<6.75}/>
 {[0,1,2].map(i=><g key={i} opacity={p(t,.2+i*.2)} transform={`translate(${50+i*10} ${355+i*29})`}><Account x={0} y={0} bot label={`user_0${i+1}`} w={290}/></g>)}
 {checked&&<g><VerificationGate x={100} y={535} w={210} open={allowed?.3:p(t,6.75,.3)*(1-p(t,7.65,.3))} uncertain={allowed}/><g opacity={p(t,6.75)}><Glyph name="clock" x={51} y={574} s={.6} color={C.ink}/></g></g>}
 {!checked&&<Line x1={205} y1={570} x2={205} y2={653} progress={1}/>}
 <g transform="translate(47 724)"><rect width={316} height={92} rx={14} fill={C.white} stroke={C.ink} strokeWidth={3}/><Glyph name="site" x={50} y={46} s={.65} color={C.ink}/><T x={205} y={61} size={47}>الموقع</T></g>
 {checked?<g opacity={p(t,6.75)} transform={`translate(${mix(mix(325,205,p(t,6.75,.65)),325,p(t,7.4,.65))} ${mix(mix(510,640,p(t,6.75,.65)),770,p(t,7.4,.65))})`}><circle r={33} fill={C.wash} stroke={C.blue} strokeWidth={3}/><Glyph name="user" s={.55}/></g>:<g opacity={p(t,2.91)}><Glyph name="clock" x={48} y={663} s={.68} color={C.ink}/><T x={240} y={695} size={37}>الزائر يستنى</T></g>}
 {allowed&&<g transform={`translate(${mix(205,253,p(t,8.13,.7))} ${mix(603,699,p(t,8.13,.7))})`}><rect x={-32} y={-30} width={64} height={60} rx={10} fill={C.white} stroke={C.ink} strokeWidth={3}/><Glyph name="bot" s={.55} color={C.ink}/></g>}
 </g>};
const AbuseComparison:React.FC<{t:number}>=({t})=><g><path d="M451 94V829" stroke={C.gray} strokeWidth={2} strokeDasharray="8 12"/><CompareColumn x={4} checked={false} t={t}/><CompareColumn x={470} checked t={t}/>{t>9.3&&<g opacity={p(t,9.3)}><Warning x={451} y={350} s={.75}/><T x={451} y={410} size={38} latin>100%?</T></g>}</g>;

const ClosingScene:React.FC<{t:number}>=({t})=><g><SignupScene t={t} closing/>{t>6.5&&<g opacity={p(t,6.5)}><Line x1={350} y1={785} x2={799} y2={785} progress={p(t,6.5,.5)}/><T x={575} y={842} size={44} color={C.blue}>يصعّب الاستغلال الآلي</T></g>}</g>;

const headings=[['علاش نثبت','بلي إنسان؟'],['واحد يقدر','يزاحم الجميع'],['برنامج واحد','استعمالات بزاف'],['هنا جات','فكرة CAPTCHA'],['البرامج تتطوّر','والحماية ثاني'],['ماشي لازم','تخرجلك صور'],['يصعّب الاستغلال','ماشي ضمان كامل'],['علاش نثبت','بلي إنسان؟']];
const SceneArt=[SignupScene,QueueScene,BotUses,HistoricalTest,EvolvingTest,BackgroundCheck,AbuseComparison,ClosingScene];
const Scene:React.FC<{index:number}>=({index})=>{const t=useCurrentFrame()/30;const Art=SceneArt[index];return <AbsoluteFill>
 <div style={{position:'absolute',left:97,top:268,fontFamily:'Tajawal, sans-serif',fontWeight:700,fontSize:35,color:C.ink}}>Runtime<span style={{color:C.blue}}>.tech</span></div>
 <div style={{position:'absolute',left:95,top:350,width:810,fontFamily:'Tajawal, sans-serif',fontWeight:700,fontSize:70,lineHeight:1.28,textAlign:'center',direction:'rtl',color:C.ink}}>{headings[index].map((line,i)=><div key={i}>{line.split(/(CAPTCHA)/g).map((part,k)=>part==='CAPTCHA'?<bdi key={k} dir="ltr">{part}</bdi>:part)}</div>)}</div>
 <svg width={846} height={846} viewBox="0 0 900 900" style={{position:'absolute',left:80,top:650,overflow:'visible'}}><Art t={t}/></svg>
 </AbsoluteFill>};

export const Video:React.FC=()=>{const [handle]=useState(()=>delayRender('Load Design 2 Tajawal Bold'));useEffect(()=>{document.fonts.load('700 70px Tajawal').then(()=>continueRender(handle)).catch(cancelRender)},[handle]);return <AbsoluteFill style={{backgroundColor:C.bg}}><style>{`@font-face{font-family:Tajawal;src:url('${staticFile('design2/tajawal-bold.ttf')}') format('truetype');font-weight:700;font-display:block}*{box-sizing:border-box}`}</style>{timeline.scenes.map((s,i)=><Sequence key={s.id} from={s.startFrame} durationInFrames={s.endFrame-s.startFrame}><Scene index={i}/></Sequence>)}</AbsoluteFill>};
