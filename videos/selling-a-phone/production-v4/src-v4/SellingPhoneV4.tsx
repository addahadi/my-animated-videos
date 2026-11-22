import React,{useEffect,useState} from 'react';
import {AbsoluteFill,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';

type Phrase={at:number;until:number;text:string;accent:string};
type Segment={start:number;end:number;step:number;name:string;phrases:Phrase[]};
type Timeline={durationInFrames:number;segments:Segment[]};
const C={bg:'#F0EFF4',white:'#FFFFFF',ink:'#111214',gray:'#D2D4D9',pale:'#E6E7EC',blue:'#0087FA',yellow:'#FFC400',muted:'#858A97'};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const p=clamp(n);return p*p*(3-2*p);};
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const T:React.FC<{x:number;y:number;size?:number;color?:string;children:React.ReactNode;latin?:boolean;anchor?:'start'|'middle'|'end'}>=({x,y,size=24,color=C.ink,children,latin=false,anchor='middle'})=><text x={x} y={y} fontFamily={latin?'Segoe UI, sans-serif':'Tajawal, sans-serif'} fontWeight={700} fontSize={size} fill={color} textAnchor={anchor} direction={latin?'ltr':'rtl'}>{children}</text>;
const Check:React.FC<{x:number;y:number;s?:number;color?:string}>=({x,y,s=1,color=C.blue})=><path transform={`translate(${x} ${y}) scale(${s})`} d="M-12 0L-3 10L17-14" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none"/>;
const Icon:React.FC<{kind:string;x:number;y:number;s?:number;color?:string}>=({kind,x,y,s=1,color=C.blue})=><g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
 {kind==='photo'&&<><rect x={-24} y={-20} width={48} height={40} rx={4}/><circle cx={10} cy={-8} r={4}/><path d="M-21 15L-5-2L9 13L16 4L22 12"/></>}
 {kind==='video'&&<><rect x={-25} y={-19} width={50} height={38} rx={5}/><path d="M-6-10L11 0L-6 10Z" fill={color} stroke="none"/></>}
 {kind==='contact'&&<><circle cy={-11} r={9}/><path d="M-19 21V15Q-19 3 0 3T19 15V21Z"/></>}
 {kind==='chat'&&<><path d="M-23-19H23V15H-6L-20 25V15H-23Z"/><path d="M-12-5H12M-12 5H6"/></>}
 {kind==='file'&&<><path d="M-16-24H5L20-9V24H-16ZM5-24V-9H20M-6 1H9M-6 11H9"/></>}
 {kind==='key'&&<><circle cx={-9} cy={-6} r={11}/><path d="M0 2L21 23M11 13L17 7M17 19L23 13"/></>}
 {kind==='lock'&&<><rect x={-18} y={-1} width={36} height={29} rx={5}/><path d="M-11-1V-14a11 11 0 0122 0V-1M0 10V17"/></>}
 {kind==='phone'&&<><rect x={-13} y={-25} width={26} height={50} rx={5}/><path d="M-4 17H4"/></>}
 {kind==='bluetooth'&&<path d="M-14-14L13 12L0 26V-26L13-12L-14 14"/>}
 {kind==='save'&&<path d="M-18-24H18V25L0 12L-18 25Z"/>}
 {kind==='gear'&&<><circle r={20}/><circle r={8}/>{[0,45,90,135].map(n=><path key={n} d="M0-29V-20M0 20V29" transform={`rotate(${n})`}/>)}</>}
 {kind==='mail'&&<><rect x={-25} y={-18} width={50} height={36} rx={4}/><path d="M-24-15L0 4L24-15"/></>}
 {kind==='pc'&&<><rect x={-30} y={-22} width={60} height={41} rx={3}/><path d="M-35 24H35M0 19V24"/></>}
 {kind==='play'&&<path d="M-10-18L20 0L-10 18Z" fill={color} stroke="none"/>}
 {kind==='logout'&&<><path d="M0-23H-21V23H0M-1 0H27M17-10L27 0L17 10"/></>}
 {kind==='bank'&&<><path d="M-25-10L0-26L25-10ZM-25 24H25M-16-3V17M0-3V17M16-3V17"/></>}
 {kind==='cloud'&&<path d="M-25 17C-43 17-43-8-25-9C-28-34 8-36 14-15C31-25 44-10 36 3C49 20 25 21 17 20H-25Z"/>}
</g>;
const Pill:React.FC<{x:number;y:number;text:string;w?:number;blue?:boolean;yellow?:boolean;size?:number}>=({x,y,text,w=190,blue=false,yellow=false,size=21})=><g><rect x={x-w/2} y={y-21} width={w} height={42} rx={21} fill={yellow?C.yellow:blue?C.blue:C.white} stroke={yellow?C.ink:C.blue} strokeWidth={1.5}/><T x={x} y={y+8} size={size} color={blue?C.white:C.ink} latin={!/[\u0600-\u06ff]/.test(text)}>{text}</T></g>;
const Button:React.FC<{x:number;y:number;w?:number;text:string;selected?:boolean;gray?:boolean;size?:number}>=({x,y,w=186,text,selected=false,gray=false,size=21})=><g><rect x={x-w/2} y={y-24} width={w} height={48} rx={12} fill={gray?C.pale:selected?C.blue:C.white} stroke={selected?C.blue:C.gray} strokeWidth={2}/><T x={x} y={y+8} size={size} color={selected?C.white:C.ink} latin={!/[\u0600-\u06ff]/.test(text)}>{text}</T></g>;
const Tap:React.FC<{x:number;y:number;t:number;at:number}>=({x,y,t,at})=>{const p=clamp((t-at)/.65);if(t<at||p>=1)return null;return <g opacity={1-p}><circle cx={x} cy={y} r={8+p*26} fill="none" stroke={C.blue} strokeWidth={3}/><path d={`M${x+4} ${y+3}l9 33 7-11 12-5z`} fill={C.ink} stroke={C.white} strokeWidth={2}/></g>;};
const Arrow:React.FC<{x1:number;y1:number;x2:number;y2:number;broken?:boolean;progress?:number}>=({x1,y1,x2,y2,broken=false,progress=1})=>{const dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI;return <g transform={`translate(${x1} ${y1}) rotate(${angle})`}><path d={`M0 0H${length}`} stroke={broken?C.gray:C.blue} strokeWidth={3} strokeDasharray={broken?'7 8':length} strokeDashoffset={broken?0:length*(1-progress)} fill="none"/>{!broken&&progress>.95&&<path d={`M${length-11}-7L${length} 0L${length-11} 7`} stroke={C.blue} strokeWidth={3} fill="none"/>}{broken&&<g transform={`translate(${length/2} 0)`}><circle r={15} fill={C.bg}/><path d="M-7-7L7 7M7-7L-7 7" stroke={C.blue} strokeWidth={3}/></g>}</g>;};
const Photo:React.FC<{x:number;y:number;w?:number;h?:number}>=({x,y,w=138,h=94})=><g transform={`translate(${x} ${y})`}><rect width={w} height={h} rx={7} fill="#E4F1FF"/><circle cx={w*.77} cy={h*.25} r={h*.11} fill={C.yellow}/><path d={`M0 ${h*.82}L${w*.29} ${h*.29}L${w*.67} ${h}H0ZM${w*.35} ${h}L${w*.74} ${h*.5}L${w} ${h*.84}V${h}Z`} fill={C.blue}/><rect width={w} height={h} rx={7} fill="none" stroke={C.ink} strokeWidth={1.5}/></g>;
const Device:React.FC<{id:string;x:number;y:number;w?:number;label?:string;newPhone?:boolean;children:React.ReactNode;blue?:boolean}>=({id,x,y,w=240,label,newPhone=false,children,blue=false})=><g transform={`translate(${x} ${y}) scale(${w/240})`}>
 <defs><clipPath id={`screen-${id}`}><rect x={13} y={58} width={214} height={391} rx={7}/></clipPath></defs>
 {label&&<T x={120} y={-24} size={27} color={newPhone?C.blue:C.ink}>{label}</T>}
 <path d="M-2 105V143M-2 166V209M242 138V201" stroke={C.ink} strokeWidth={4} strokeLinecap="round"/>
 <rect width={240} height={490} rx={41} fill={C.ink}/><rect x={9} y={10} width={222} height={470} rx={33} fill={blue?C.blue:C.white}/>
 <g clipPath={`url(#screen-${id})`}>{children}</g>
 <rect x={84} y={23} width={72} height={19} rx={10} fill={C.ink}/><rect x={86} y={461} width={68} height={4} rx={2} fill={blue?'#CFE8FF':C.gray}/>
 {newPhone&&<path d="M13 68V434" stroke={C.blue} strokeWidth={3}/>} 
</g>;
const AppHead:React.FC<{title:string;subtitle?:string}>=({title,subtitle})=><g><T x={120} y={84} size={21} latin={!/[\u0600-\u06ff]/.test(title)}>{title}</T>{subtitle&&<T x={120} y={110} size={15} color={C.muted}>{subtitle}</T>}<path d="M24 121H216" stroke={C.pale} strokeWidth={2}/></g>;
const data=[{kind:'photo',name:'التصاور'},{kind:'video',name:'الفيديوهات'},{kind:'contact',name:'الأرقام'},{kind:'chat',name:'WhatsApp'}];
const DataRows:React.FC<{active?:number;faded?:boolean}>=({active=-1,faded=false})=><g opacity={faded?.2:1}><AppHead title="الداتا تاعك"/>{data.map((d,i)=><g key={d.kind}><rect x={23} y={137+i*66} width={194} height={55} rx={8} fill={active===i?'#DDECFF':i%2===0?'#F5F5F9':C.white}/><Icon kind={d.kind} x={49} y={165+i*66} s={.48}/><T x={145} y={172+i*66} size={21} latin={d.kind==='chat'}>{d.name}</T></g>)}</g>;
const Panel:React.FC<{x:number;y:number;w:number;h:number;title:string;children:React.ReactNode}>=({x,y,w,h,title,children})=><g transform={`translate(${x} ${y})`}><rect width={w} height={h} rx={18} fill={C.white} stroke={C.ink} strokeWidth={2.5}/><T x={w/2} y={40} size={26}>{title}</T><path d={`M18 58H${w-18}`} stroke={C.pale} strokeWidth={2}/>{children}</g>;
const Copy:React.FC<{kind:string;x1:number;y1:number;x2:number;y2:number;t:number;at:number;duration?:number;label?:string}>=({kind,x1,y1,x2,y2,t,at,duration=.75,label})=>{const p=ease((t-at)/duration);if(t<at||t>=at+duration)return null;return <g transform={`translate(${mix(x1,x2,p)} ${mix(y1,y2,p)-Math.sin(p*Math.PI)*30})`}><rect x={label?-57:-28} y={-28} width={label?114:56} height={56} rx={10} fill={C.white} stroke={C.blue} strokeWidth={2}/><Icon kind={kind} x={label?-35:0} y={0} s={label?.38:.65}/>{label&&<T x={16} y={6} size={16} color={C.blue} latin>{label}</T>}</g>;};
const Ready:React.FC<{language?:boolean;setup?:boolean}>=({language=false,setup=false})=><g><T x={120} y={195} size={40} color={C.white} latin>{setup?'Ready':'Hello'}</T><T x={120} y={235} size={27} color={C.white}>{setup?'جاهز للإعداد':'مرحبا'}</T>{language?<g><T x={120} y={294} size={22} color={C.white} latin>English</T><T x={120} y={326} size={24} color={C.white}>العربية</T><T x={120} y={358} size={22} color={C.white} latin>Français</T><path d="M105 407H139M129 399L139 407L129 415" stroke={C.white} strokeWidth={2.5} fill="none"/></g>:<g><Check x={120} y={333} s={1.3} color={C.white}/><T x={120} y={392} size={18} color={C.white}>{setup?'إعداد جهاز جديد':'شاشة البداية'}</T></g>}</g>;

const HookPerson:React.FC<{x:number;buyer?:boolean;opacity?:number}>=({x,buyer=false,opacity=1})=><g opacity={opacity}>
 <T x={x} y={375} size={25}>{buyer?'الشاري':'البائع'}</T>
 <circle cx={x} cy={432} r={31} fill={C.white} stroke={C.ink} strokeWidth={3}/>
 <path d={`M${x-30} 424Q${x-21} 394 ${x+3} 401Q${x+29} 402 ${x+30} 425`} fill={C.ink}/>
 <circle cx={x+(buyer?-8:8)} cy={434} r={2.7} fill={C.ink}/>
 <path d={`M${x-49} 735V534Q${x-48} 488 ${x} 488Q${x+48} 488 ${x+49} 534V735Z`} fill={buyer?C.gray:C.blue} stroke={C.ink} strokeWidth={3}/>
 <path d={`M${x-38} 730H${x+37}`} stroke={buyer?'#B4BAC5':'#0067C4'} strokeWidth={10}/>
</g>;

const HookPersonalScreen:React.FC<{warning:number}>=({warning})=><g>
 <AppHead title="تليفونك الشخصي"/>
 <Photo x={27} y={136} w={186} h={100}/>
 <g><rect x={27} y={251} width={186} height={67} rx={10} fill="#E9F2FF"/><Icon kind="chat" x={52} y={279} s={.47}/><T x={144} y={278} size={20}>رسائلك</T><path d="M89 297H194" stroke={C.blue} strokeWidth={2} opacity={.35}/></g>
 <g><rect x={27} y={335} width={186} height={78} rx={10} fill="#F2F3F7"/><Icon kind="contact" x={54} y={367} s={.53}/><T x={145} y={367} size={20}>حساباتك</T><Icon kind="key" x={147} y={394} s={.35}/><path d="M86 394H122" stroke={C.gray} strokeWidth={3}/></g>
 <g opacity={warning}>
  <rect x={24} y={133} width={192} height={106} rx={10} fill="none" stroke={C.yellow} strokeWidth={4}/>
  <rect x={24} y={332} width={192} height={84} rx={11} fill="none" stroke={C.yellow} strokeWidth={4}/>
  {[{x:200,y:146},{x:200,y:330}].map(({x,y},i)=><g key={i}><path d={`M${x} ${y-17}L${x+17} ${y+13}H${x-17}Z`} fill={C.yellow} stroke={C.ink} strokeWidth={1.8}/><path d={`M${x} ${y-7}V${y+2}`} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round"/><circle cx={x} cy={y+8} r={1.8} fill={C.ink}/></g>)}
 </g>
</g>;

const HookSevenSteps:React.FC<{t:number;pullback:number}>=({t,pullback})=>{
 const steps=[['file','نسخة احتياطية'],['key','أكواد التحقق'],['bluetooth','فصل الأجهزة'],['contact','Google / Apple'],['lock','التطبيقات الحساسة'],['gear','الفورماط'],['phone','التحقق الأخير']];
 return <g opacity={1-ease((t-7.75)/.72)}>
  {steps.map(([kind,name],i)=>{const p=ease((t-2.85-i*.22)/.38),col=i%2===0?1:0,row=Math.floor(i/2),x=col?389:51,y=859+row*63,active=t>=7.26&&i===0;return <g key={name} opacity={p} transform={`translate(0 ${10*(1-p)})`}>
   <rect x={x} y={y-25} width={280} height={53} rx={12} fill={active?'#DDEEFF':C.white} stroke={active?C.blue:C.gray} strokeWidth={active?2.5:1.5}/>
   <circle cx={x+24} cy={y+1} r={13} fill={C.blue}/><T x={x+24} y={y+7} size={17} color={C.white} latin>{i+1}</T>
   <Icon kind={kind} x={x+61} y={y+1} s={.38}/><T x={x+183} y={y+9} size={i===4?19:22} latin={i===3}>{name}</T>
  </g>;})}
 </g>;
};

const Intro:React.FC<{t:number}>=({t})=>{
 const forward=ease((Math.min(t,2.65)-.18)/2.35),pullback=ease((t-7.26)/2.15);
 const phoneX=mix(mix(216,296,forward),55,pullback),phoneY=mix(313,390,pullback);
 const people=1-ease((t-7.35)/.65),warning=ease((t-3.32)/.5)*(1-pullback);
 const screenChange=ease((t-8.0)/.42);
 const buyerHandX=mix(616,phoneX+255,forward);
 return <g>
  <HookPerson x={86} opacity={people}/><HookPerson x={638} buyer opacity={people}/>
  <g opacity={people}>
   <path d={`M105 548Q141 594 ${phoneX+6} ${phoneY+306}`} stroke={C.ink} strokeWidth={32} strokeLinecap="round" fill="none"/>
   <path d={`M105 548Q141 594 ${phoneX+6} ${phoneY+306}`} stroke={C.blue} strokeWidth={25} strokeLinecap="round" fill="none"/>
   <path d={`M619 547Q620 604 ${buyerHandX+37} ${phoneY+308}`} stroke={C.ink} strokeWidth={32} strokeLinecap="round" fill="none"/>
   <path d={`M619 547Q620 604 ${buyerHandX+37} ${phoneY+308}`} stroke={C.gray} strokeWidth={25} strokeLinecap="round" fill="none"/>
  </g>
  <Device id="handover-hook-phone" x={phoneX} y={phoneY}>
   <HookPersonalScreen warning={warning}/>
   {screenChange>0&&<g><defs><clipPath id="hook-backup-view"><rect x={13} y={58} width={214*screenChange} height={391}/></clipPath></defs><g clipPath="url(#hook-backup-view)"><rect x={13} y={58} width={214} height={391} fill={C.white}/><DataRows/></g></g>}
  </Device>
  <g opacity={people}>
   <g transform={`translate(${phoneX-2} ${phoneY+304})`}><path d="M-16-11L5-27Q16-33 20-22Q23-14 13-9L3-3L15 6Q24 14 15 21Q10 25 3 19L-14 12Z" fill={C.white} stroke={C.ink} strokeWidth={2.8}/></g>
   <g transform={`translate(${buyerHandX} ${phoneY+304})`}><path d="M28-14H14L-3-31Q-10-37-16-30Q-20-24-14-18L-2-3L-13 8Q-19 16-11 21Q-6 24 1 17L13 8H29Z" fill={C.white} stroke={C.ink} strokeWidth={2.8}/></g>
  </g>
  {t>=2.65&&t<7.5&&<g opacity={ease((t-2.65)/.2)*(1-pullback)}>
   <circle cx={phoneX+120} cy={272} r={25} fill={C.blue}/><path d={`M${phoneX+112} 261V283M${phoneX+128} 261V283`} stroke={C.white} strokeWidth={6} strokeLinecap="round"/>
  </g>}
  <HookSevenSteps t={t} pullback={pullback}/>
  {pullback>.7&&<g opacity={ease((pullback-.7)/.3)}><Panel x={397} y={433} w={270} h={358} title="نسخة احتياطية">{data.map((d,i)=><g key={d.kind} opacity={.18}><Icon kind={d.kind} x={39} y={102+i*66} s={.55}/><T x={157} y={111+i*66} size={23} latin={i===3}>{d.name}</T></g>)}</Panel></g>}
 </g>;
};

const Backup:React.FC<{t:number}>=({t})=>{
 const starts=[2.78,3.38,4.1,4.98],active=starts.reduce((a,n,i)=>t>=n?i:a,-1);
 if(t>=12.14){const opened=t>=12.9,contact=t>=14.5;return <g>
  <Device id="backup-original" x={45} y={350} w={186} label="القديم"><DataRows/></Device>
  <g transform="translate(273 381)"><rect width={391} height={283} rx={13} fill={C.ink}/><rect x={10} y={10} width={371} height={263} rx={6} fill={C.white}/><T x={195} y={44} size={24}>النسخة على الـ PC</T>{opened?contact?<g><T x={195} y={87} size={21} color={C.blue} latin>contacts.vcf</T>{[0,1].map(i=><g key={i}><Icon kind="contact" x={92} y={127+i*61} s={.55}/><T x={227} y={137+i*61} size={25}>{`جهة اتصال ${i+1}`}</T></g>)}<T x={195} y={250} size={21} color={C.blue}>ملف الأرقام يتفتح عادي</T></g>:<><Photo x={72} y={68} w={247} h={150}/><T x={195} y={250} size={21} color={C.blue}>الصورة تفتحت عادي</T></>:<g>{data.map((d,i)=><g key={i}><Icon kind={d.kind} x={62+i*89} y={123} s={.7}/><T x={62+i*89} y={167} size={14} latin={i===3}>{d.name}</T></g>)}</g>}<path d="M-13 288H404L425 307H-32Z" fill={C.gray} stroke={C.ink} strokeWidth={3}/></g>
  <Tap x={335} y={504} t={t} at={12.45}/>
 </g>;}
 return <g>
  <Device id="backup" x={55} y={325} label="القديم"><DataRows active={active}/></Device>
  {t<5.96?<g><Panel x={397} y={368} w={270} h={358} title="نسخة احتياطية">{data.map((d,i)=><g key={i} opacity={t>=starts[i]+.55?1:.18}><Icon kind={d.kind} x={39} y={102+i*66} s={.55}/><T x={157} y={111+i*66} size={23} latin={i===3}>{d.name}</T>{t>=starts[i]+.75&&<Check x={241} y={104+i*66} s={.5}/>}</g>)}</Panel><Arrow x1={309} y1={530} x2={382} y2={530} progress={ease((t-1.72)/.6)}/>{data.map((d,i)=><Copy key={i} kind={d.kind} x1={130} y1={490+i*22} x2={440} y2={470+i*66} t={t} at={starts[i]}/>)}</g>:<g>
   <T x={529} y={321} size={27}>اختار وين تحفظهم</T>
   {['Google Drive','iCloud','PC'].map((name,i)=>{const at=[7.68,8.46,9.66][i],on=t>=at;return <g key={name} opacity={on?1:.22}><rect x={401} y={367+i*121} width={258} height={88} rx={15} fill={on?'#E4F1FF':C.white} stroke={on?C.blue:C.gray} strokeWidth={2}/><Icon kind={i===2?'pc':'cloud'} x={438} y={409+i*121} s={.65}/><T x={545} y={418+i*121} size={25} color={on?C.blue:C.ink} latin>{name}</T>{i<2&&<T x={529} y={481+i*121} size={22}>ولا</T>}</g>;})}
   <Arrow x1={309} y1={540} x2={386} y2={540}/>
  </g>}
 </g>;
};

const AuthRows:React.FC<{count?:number;empty?:boolean}>=({count=2,empty=false})=><g><AppHead title="Authenticator" subtitle="حسابات التحقق"/>{empty?<><Icon kind="key" x={120} y={227} color={C.gray}/><T x={120} y={292} size={20}>مازال ما نقلتهمش</T></>:['Gmail','Facebook'].map((name,i)=><g key={name} opacity={count>i?1:.12}><rect x={23} y={145+i*115} width={194} height={93} rx={10} fill="#F2F6FC"/><T x={82} y={175+i*115} size={20} latin>{name}</T><Icon kind="key" x={187} y={171+i*115} s={.42}/><T x={120} y={215+i*115} size={27} color={C.blue} latin>{i===0?'123 456':'802 119'}</T></g>)}<T x={120} y={422} size={14} color={C.muted}>مثال توضيحي</T></g>;
const Login:React.FC<{t:number;risk?:boolean}>=({t,risk=false})=>{const password=t>=6.8||risk,code=t>=8.9&&!risk,success=t>=9.65&&!risk;return <Panel x={45} y={353} w={327} h={403} title={risk?'الدخول من الجديد':'تسجيل الدخول'}>
 <T x={271} y={111} size={23} anchor="start">كلمة السر</T><rect x={25} y={128} width={276} height={57} rx={9} fill={C.pale}/><T x={136} y={166} size={26} latin>••••••••</T>{password&&<Check x={275} y={156} s={.65}/>}
 <T x={271} y={229} size={23} anchor="start">كود التحقق</T><rect x={25} y={247} width={276} height={57} rx={9} fill={C.white} stroke={risk?C.yellow:C.blue} strokeWidth={2}/><T x={135} y={285} size={26} color={C.blue} latin>{code?'123 456':'— — — — — —'}</T>{code&&<Check x={275} y={276} s={.65}/>}
 <Button x={164} y={357} w={266} text={risk?'تحتاج كود باش تدخل':success?'تم الدخول':'خطوتين للحماية'} selected={success} gray={risk} size={22}/>
 </Panel>;};
const Auth:React.FC<{t:number}>=({t})=>{
 if(t<6.1){const moving=t>=4.18,count=t>=5.4?2:t>=4.95?1:0;return <g>
  <Device id="auth-old" x={55} y={325} label="القديم"><AuthRows/><Button x={120} y={381} text="نقل الحسابات" selected={moving}/></Device>
  <Device id="auth-new" x={422} y={325} label="الجديد" newPhone><AuthRows count={count} empty={count===0}/></Device>
  {moving&&<><Arrow x1={309} y1={530} x2={407} y2={530}/><Copy kind="key" label="Gmail" x1={208} y1={504} x2={560} y2={504} t={t} at={4.18} duration={.85}/><Copy kind="key" label="Facebook" x1={208} y1={619} x2={560} y2={619} t={t} at={4.65} duration={.85}/></>}
  <Tap x={175} y={706} t={t} at={4.18}/>
 </g>;}
 const risk=t>=10.56&&t<14.28,next=t>=14.28;
 return <g>
  <Login t={next?10:t} risk={risk}/>
  <Device id="auth-source" x={428} y={325} w={226} label={risk?'القديم':'الجديد'} newPhone={!risk}><AuthRows/></Device>
  {!risk&&!next&&<Copy kind="key" x1={540} y1={519} x2={180} y2={629} t={t} at={7.92} duration={.9}/>}
  {risk&&<><Arrow x1={411} y1={581} x2={382} y2={620} broken/><Pill x={360} y={274} text="إذا ما نقلتش الأكواد" w={310} yellow/></>}
 </g>;
};

const Reset:React.FC<{t:number}>=({t})=>{
 if(t<2.32)return <g>
  <T x={235} y={304} size={29}>التحضيرات كملت</T>
  {['نسخة احتياطية','أكواد التحقق','الأجهزة مفصولة','الحساب تنحّى','التطبيقات والحسابات'].map((n,i)=><g key={n}><Check x={72} y={389+i*76}/><T x={268} y={398+i*76} size={27}>{n}</T></g>)}
  <Device id="ready-reset" x={459} y={350} w={191} label="القديم"><DataRows/></Device>
 </g>;
 if(t<5.9)return <g>
  <Device id="reset-android" x={55} y={325} label="Android"><AppHead title="Settings"/><T x={120} y={185} size={23}>إعادة الضبط</T><path d="M28 218H212" stroke={C.pale} strokeWidth={2}/><Button x={120} y={284} w={194} text="Factory Reset" selected={t>=3.78} size={22}/><T x={120} y={359} size={20}>مسح البيانات</T></Device>
  <Device id="reset-iphone" x={422} y={325} label="iPhone"><AppHead title="Settings"/><T x={120} y={185} size={23}>نقل أو إعادة تعيين</T><path d="M28 218H212" stroke={C.pale} strokeWidth={2}/><rect x={23} y={249} width={194} height={94} rx={12} fill={t>=5.24?C.blue:C.white} stroke={t>=5.24?C.blue:C.gray} strokeWidth={2}/><T x={120} y={284} size={21} color={t>=5.24?C.white:C.ink} latin>Erase All Content</T><T x={120} y={316} size={21} color={t>=5.24?C.white:C.ink} latin>and Settings</T></Device>
  <Tap x={175} y={609} t={t} at={3.78}/><Tap x={542} y={621} t={t} at={5.25}/><T x={360} y={860} size={20} color={C.muted}>المسار يختلف حسب الجهاز</T>
 </g>;
 const p=ease((t-5.9)/1.8),done=t>=7.75;
 return <g>
  <Device id="erasing" x={220} y={300} w={280} label="القديم" blue={done}>
   {done?<Ready/>:<g><DataRows faded/><rect x={13} y={58} width={214*p} height={391} fill={C.white}/><T x={120} y={173} size={26}>جاري المسح</T><rect x={37} y={243} width={166} height={13} rx={7} fill={C.pale}/><rect x={37} y={243} width={166*p} height={13} rx={7} fill={C.blue}/><T x={120} y={316} size={24} color={C.blue} latin>{Math.round(p*100)}%</T></g>}
  </Device>
 </g>;
};

const Verify:React.FC<{t:number}>=({t})=>{
 const account=t>=8.54,activated=t>=11.35,inspect=t>=6.74,activate=t>=10.16;
 const labels=['شاشة البداية','الحساب مفصول','بلا الحساب القديم'];
 return <g>
  <Device id="verify-phone" x={55} y={325} label="القديم" blue><Ready language={!activated} setup={activated}/></Device>
  <T x={523} y={315} size={29}>قبل ما تسلّمو</T>
  {labels.map((n,i)=>{const ok=i===0?t>=3.52:i===1?account:activated;return <g key={n}><rect x={385} y={354+i*70} width={39} height={39} rx={8} fill={ok?C.blue:C.white} stroke={ok?C.blue:C.gray} strokeWidth={2}/>{ok&&<Check x={404} y={373+i*70} s={.7} color={C.white}/>}<T x={551} y={381+i*70} size={24}>{n}</T></g>;})}
  {inspect&&<g>
   <Panel x={365} y={602} w={307} h={190} title={activate?'فحص التفعيل':'أجهزة حسابك'}>
    {activate?<><T x={153} y={103} size={23}>بدون طلب الحساب القديم</T>{activated?<><Check x={153} y={142}/><T x={153} y={177} size={20} color={C.blue}>تقدر تبدأ إعداد جديد</T></>:<T x={153} y={156} size={22} color={C.blue}>كمّل البداية وتأكد</T>}</>:<><Icon kind="phone" x={40} y={98} s={.5}/><T x={184} y={106} size={22}>الجديد: مرتبط</T><Icon kind="phone" x={40} y={153} s={.5} color={C.gray}/><T x={184} y={161} size={22} color={account?C.blue:C.muted}>{account?'القديم: غير مرتبط':'تأكد من التليفون القديم'}</T></>}
   </Panel>
  </g>}
  {t>=5.02&&t<6.74&&<path d="M360 568H678" stroke={C.yellow} strokeWidth={7} strokeLinecap="round"/>}
  {activate&&<Tap x={175} y={732} t={t} at={10.25}/>}
 </g>;
};

const Outro:React.FC<{t:number}>=({t})=>{
 if(t<2.22){const p=ease((t-.35)/1.25),x=mix(226,359,p);return <g>
  <g transform={`translate(${mix(0,-48,p)} 599)`}><path d="M0-38H174L214-10L258 22Q276 36 260 49Q251 57 239 49L208 32L228 75Q235 94 216 95H0Z" fill={C.ink}/><path d="M67-38V95" stroke="#3D4149" strokeWidth={15}/></g>
  <Device id="handover" x={x} y={321} w={218} blue><Ready setup/></Device>
  <g transform={`translate(${mix(768,720,p)} 591)`}><path d="M0-40H-128L-173-12L-205 10Q-224 22-210 38Q-200 47-185 39L-154 24L-173 71Q-181 91-161 93H0Z" fill={C.ink}/><path d="M-56-40V93" stroke="#3D4149" strokeWidth={15}/></g>
 </g>;}
 return <g>
  <T x={360} y={296} size={35}>قبل ما تبيع تليفونك</T>
  {['النسخة الاحتياطية','نقل أكواد التحقق','فصل الأجهزة','نحّي حساب Google / Apple','التطبيقات والأجهزة المرتبطة','الفورماط','التحقق الأخير'].map((n,i)=><g key={n}><circle cx={130} cy={363+i*66} r={18} fill={C.blue}/><Check x={130} y={363+i*66} s={.6} color={C.white}/><T x={387} y={372+i*66} size={28}>{n}</T></g>)}
  <g transform={`translate(610 290)`}><rect x={-39} y={-39} width={78} height={78} rx={18} fill={C.blue}/><Icon kind="save" x={0} y={0} s={1.1} color={C.white}/></g>
 </g>;
};

export const SellingPhoneV4:React.FC<{timeline?:Timeline}>=({timeline})=>{
 const time=useCurrentFrame()/30;
 const [handle]=useState(()=>delayRender('Tajawal Bold'));
 useEffect(()=>{document.fonts.load('700 63px Tajawal').then(()=>continueRender(handle)).catch(()=>continueRender(handle));},[handle]);
 if(!timeline)return <AbsoluteFill style={{background:C.bg}}/>;
 const s=timeline.segments.find(s=>time>=s.start&&time<s.end)??timeline.segments[timeline.segments.length-1],t=time-s.start;
 return <AbsoluteFill style={{background:C.bg,color:C.ink}}>
  <style>{`@font-face{font-family:Tajawal;src:url('${staticFile('tajawal-bold.ttf')}') format('truetype');font-weight:700;font-display:block}*{box-sizing:border-box}`}</style>
  <svg width={1080} height={1920} viewBox="0 0 720 1280" style={{position:'absolute',inset:0}}>
   {s.step===0?<Intro t={t}/>:<g transform="translate(0 65)">{s.step===1?<Backup t={t}/>:s.step===2?<Auth t={t}/>:s.step===3?<Accessories t={t}/>:s.step===4?<Accounts t={t}/>:s.step===5?<Sensitive t={t}/>:s.step===6?<Reset t={t}/>:s.step===7?<Verify t={t}/>:<Outro t={t}/>}</g>}
   <Pill x={360} y={188} text={s.step>0&&s.step<8?`${s.step}/7   ${s.name}`:s.name} w={360} size={23}/>
  </svg>
  <div style={{position:'absolute',top:123,left:65,fontFamily:'Segoe UI, sans-serif',fontSize:40,fontWeight:750,letterSpacing:-1}}>RunTime<span style={{color:C.blue}}>.tech</span></div>
  <div dir="rtl" style={{position:'absolute',top:123,right:65,border:'2px solid #B8B7BE',borderRadius:35,padding:'5px 24px 2px',fontFamily:'Tajawal',fontSize:31}}>تقنية</div>
 </AbsoluteFill>;
};

const Watch:React.FC<{x:number;y:number;paired:boolean;scale?:number}>=({x,y,paired,scale=1})=><g transform={`translate(${x} ${y}) scale(${scale})`}><rect x={-29} y={-126} width={58} height={252} rx={20} fill={C.gray} stroke={C.ink} strokeWidth={3}/><rect x={-56} y={-73} width={112} height={146} rx={30} fill={C.ink}/><rect x={-46} y={-63} width={92} height={126} rx={22} fill={paired?C.blue:C.white}/>{paired?<><T x={0} y={-9} size={25} color={C.white} latin>23:47</T><Icon kind="bluetooth" x={0} y={28} s={.45} color={C.white}/></>:<Icon kind="bluetooth" x={0} y={0} s={.8} color={C.gray}/>}<path d="M59-20V5" stroke={C.ink} strokeWidth={7} strokeLinecap="round"/></g>;
const Earbuds:React.FC<{x:number;y:number}>=({x,y})=><g transform={`translate(${x} ${y})`} fill={C.white} stroke={C.ink} strokeWidth={3}><rect x={-58} y={5} width={116} height={88} rx={28}/><path d="M-57 29H57" fill="none"/><path d="M-28-16V-67Q-61-68-47-94Q-18-113-13-80V-16ZM28-16V-67Q61-68 47-94Q18-113 13-80V-16Z"/><circle cy={69} r={4} fill={C.blue} stroke="none"/></g>;
const Accessories:React.FC<{t:number}>=({t})=>{
 const bt=t>=5.24,watchOff=t>=3.85,btOff=t>=6.9,off=bt?btOff:watchOff;
 return <g>
  <Device id="accessories" x={65} y={325} label="القديم"><AppHead title={bt?'Bluetooth':'Apple Watch'}/>
   <Icon kind={bt?'bluetooth':'phone'} x={120} y={181} s={.8}/><T x={120} y={237} size={21} latin>{bt?'Bluetooth audio':'Apple Watch'}</T><T x={120} y={278} size={23} color={off?C.muted:C.blue}>{off?'الربط تنحّى':'مربوط بالتليفون'}</T>
   <Button x={120} y={356} w={192} text={off?'غير مقترن':'إلغاء الاقتران'} selected={!off&&(bt?t>=5.8:t>=2.92)} gray={off}/>
  </Device>
  {bt?<><Earbuds x={536} y={495}/><Watch x={548} y={740} paired={false} scale={.48}/></>:<Watch x={535} y={523} paired={!watchOff}/>}
  <Arrow x1={319} y1={529} x2={465} y2={529} broken={off}/>
  <Tap x={185} y={681} t={t} at={bt?6.05:3.05}/>
 </g>;
};

const AccountProfile:React.FC<{x:number;y:number;platform:string}>=({x,y,platform})=><g><circle cx={x} cy={y} r={63} fill={C.white} stroke={C.blue} strokeWidth={2.5}/><Icon kind="contact" x={x} y={y} s={1.6}/><T x={x} y={y+108} size={26} color={C.blue} latin>{platform}</T><T x={x} y={y+151} size={24}>الحساب يبقى تاعك</T></g>;
const Accounts:React.FC<{t:number}>=({t})=>{
 const apple=t>=5.85,find=t>=9.53,removed=apple?t>=8.85:t>=4.65,switchedOff=t>=11.13;
 return <g>
  <Device id="account" x={65} y={325} label={apple?'iPhone القديم':'Android القديم'}>
   <AppHead title={find?'Find My':apple?'Apple Account':'Google'}/>
   {find?<g><T x={120} y={181} size={22} latin>Find My iPhone</T><rect x={72} y={224} width={96} height={45} rx={23} fill={switchedOff?C.gray:C.blue}/><circle cx={mix(146,94,ease((t-10.5)/.63))} cy={246} r={18} fill={C.white}/><T x={120} y={321} size={25} color={switchedOff?C.muted:C.blue}>{switchedOff?'متوقف':'مفعّل'}</T>{switchedOff&&<Check x={120} y={381}/>}</g>:<g>
    <g opacity={removed?.16:1}><circle cx={120} cy={185} r={34} fill={C.pale}/><Icon kind="contact" x={120} y={185} s={.9}/><T x={120} y={253} size={24}>حسابك</T></g>
    <Button x={120} y={327} w={192} text={removed?'الحساب تنحّى':apple?'تسجيل الخروج':'إزالة من الجهاز'} selected={!removed&&(apple?t>=7.97:t>=3.61)} gray={removed} size={20}/>
    {removed&&<T x={120} y={397} size={21} color={C.blue}>ما بقاش مربوط هنا</T>}
   </g>}
  </Device>
  <AccountProfile x={535} y={471} platform={apple?'Apple Account':'Google Account'}/>
  <Arrow x1={461} y1={471} x2={320} y2={471} broken={removed||find}/>
  <Tap x={find?185:185} y={find?571:652} t={t} at={find?10.45:apple?8.0:3.9}/>
 </g>;
};

const AppMark:React.FC<{name:string;x:number;y:number;size?:number}>=({name,x,y,size=54})=><g transform={`translate(${x} ${y})`}><rect x={-size/2} y={-size/2} width={size} height={size} rx={12} fill={C.blue}/>{name==='Facebook'?<T x={0} y={size*.29} size={size*.9} color={C.white} latin>f</T>:name==='Telegram'?<path d={`M${-size*.28} ${-size*.02}L${size*.32} ${-size*.27}L${size*.15} ${size*.27}L${-size*.02} ${size*.12}L${size*.18} ${-size*.15}L${-size*.11} ${size*.06}Z`} fill={C.white}/>:<Icon kind={name==='Gmail'?'mail':'chat'} x={0} y={0} s={size/80} color={C.white}/>}</g>;
const ChatContents:React.FC<{received?:boolean;opened?:boolean;inactive?:boolean}>=({received=true,opened=false,inactive=false})=><g opacity={inactive?.35:1}><AppHead title="WhatsApp" subtitle={received?'نفس الحساب':'التليفون الجديد'}/>{received?<g>{opened?<><T x={120} y={163} size={22}>محادثاتك رجعت</T><rect x={27} y={205} width={157} height={49} rx={12} fill="#E3EFFD"/><T x={104} y={237} size={22}>سلام! واش راك؟</T><rect x={66} y={278} width={147} height={49} rx={12} fill={C.pale}/><T x={139} y={310} size={22}>الحمد لله</T></>:['محادثة 1','محادثة 2','محادثة 3'].map((n,i)=><g key={n}><circle cx={47} cy={166+i*79} r={17} fill={C.pale}/><T x={145} y={174+i*79} size={22}>{n}</T><path d={`M79 ${195+i*79}H207`} stroke={C.pale} strokeWidth={2}/></g>)}</g>:<><Icon kind="chat" x={120} y={227} color={C.gray}/><T x={120} y={292} size={20}>انقل الحساب والمحادثات</T></>}</g>;
const Sensitive:React.FC<{t:number}>=({t})=>{
 if(t>=12.72){const received=t>=16.2,opened=t>=17.0;return <g>
  <Device id="wa-old" x={55} y={325} label="القديم"><ChatContents inactive={received}/></Device>
  <Device id="wa-new" x={422} y={325} label="الجديد" newPhone><ChatContents received={received} opened={opened}/></Device>
  {t>=14.52&&<Arrow x1={309} y1={539} x2={407} y2={539}/>}
  {[0,1,2].map(i=><Copy key={i} kind={i===0?'contact':'chat'} x1={183} y1={491+i*48} x2={542} y2={491+i*48} t={t} at={14.52+i*.37} duration={.85}/>)}
 </g>;}
 if(t>=6.48){const list=t>=8.4,removing=t>=10.06,removed=t>=11.15,collapse=ease((t-10.55)/.6);return <g>
  <Device id="security-device" x={45} y={360} w={201} label="جهاز آخر" newPhone><AppHead title="Gmail"/><Icon kind="gear" x={120} y={190}/><Button x={120} y={274} text="الأمان" selected={t>=7.28}/><Button x={120} y={347} text="الأجهزة المرتبطة" selected={list} size={18}/></Device>
  <Arrow x1={263} y1={537} x2={299} y2={537}/>
  <Panel x={318} y={353} w={353} h={431} title={list?'الأجهزة المرتبطة':'إعدادات الأمان'}>
   {list?<g><g opacity={1-collapse}><rect x={18} y={83} width={317} height={77} rx={9} fill={removing?'#DDEEFF':C.pale}/><Icon kind="phone" x={49} y={121} s={.55}/><T x={202} y={116} size={22}>التليفون القديم</T><T x={202} y={145} size={17} color={C.blue}>{removing?'إزالة هذا الجهاز':'مرتبط بالحساب'}</T></g>
   {['الجهاز الحالي','الـ PC'].map((n,i)=><g key={n} transform={`translate(0 ${-collapse*80})`}><rect x={18} y={177+i*94} width={317} height={77} rx={9} fill="#F5F5F9"/><Icon kind={i?'pc':'phone'} x={49} y={215+i*94} s={.55}/><T x={193} y={225+i*94} size={23}>{n}</T><Check x={311} y={215+i*94} s={.55}/></g>)}
   <Button x={176} y={378} w={299} text={removed?'القديم ما بقاش في القائمة':'إزالة التليفون القديم'} selected={removing&&!removed} gray={removed} size={21}/>
   </g>:<g><Icon kind="lock" x={176} y={156} s={1.3}/><Button x={176} y={261} w={293} text="إدارة الأجهزة" selected/><T x={176} y={351} size={22}>من جهاز آخر</T></g>}
  </Panel>
  <Tap x={503} y={475} t={t} at={10.06}/><Tap x={494} y={731} t={t} at={10.55}/>
 </g>;}
 const apps=['Facebook','Telegram','WhatsApp','Gmail'],starts=[2.76,3.42,3.82,4.26],selected=starts.reduce((a,n,i)=>t>=n?i:a,0),signedOut=t>=6.0;
 return <g>
  <Device id="apps" x={65} y={325} label="القديم"><AppHead title={apps[selected]}/><Icon kind="contact" x={120} y={190} s={1.25}/><T x={120} y={260} size={24}>حسابك</T><Button x={120} y={335} w={192} text={signedOut?'تم تسجيل الخروج':'تسجيل الخروج'} selected={t>=4.84&&!signedOut} gray={signedOut} size={19}/></Device>
  {apps.map((name,i)=><g key={name} opacity={t>=starts[i]?1:.18}><AppMark name={name} x={437} y={383+i*106}/><T x={558} y={392+i*106} size={27} color={selected===i?C.blue:C.ink} latin>{name}</T></g>)}
  <Tap x={185} y={660} t={t} at={5.46}/>
 </g>;
};
