import React, {useEffect,useState} from 'react';
import {AbsoluteFill,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';

type Scene={id:number;startFrame:number;endFrame:number;heading:string;cues:Record<string,number>};
type Timeline={durationInFrames:number;scenes:Scene[]};
type P={x:number;y:number};
const C={bg:'#F0EFF4',white:'#FFFFFF',ink:'#111214',gray:'#D2D4D9',pale:'#E5E7ED',blue:'#0087FA',yellow:'#FFC400',muted:'#6E7480',ice:'#E5F2FF'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const p=clamp(v);return 1-Math.pow(1-p,3)};
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const show=(t:number,at:number,d=.3)=>ease((t-at)/d);
const T=({x,y,children,size=44,color=C.ink,latin=false,anchor='middle',opacity=1}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string;latin?:boolean;anchor?:'middle'|'start'|'end';opacity?:number})=>
 <text x={x} y={y} fill={color} fontSize={size} fontWeight={700} textAnchor={anchor} opacity={opacity} direction={latin?'ltr':'rtl'} fontFamily="Tajawal, Arial, sans-serif">{children}</text>;
const Check=({x,y,s=1,color=C.blue}:P&{s?:number;color?:string})=><path transform={`translate(${x} ${y}) scale(${s})`} d="M-15 0L-4 12L20-16" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>;
const Warn=({x,y,s=1}:P&{s?:number})=><g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0-26L29 24H-29Z" fill={C.yellow} stroke={C.ink} strokeWidth={3} strokeLinejoin="round"/><path d="M0-11V5" stroke={C.ink} strokeWidth={4} strokeLinecap="round"/><circle cy={14} r={2.5} fill={C.ink}/></g>;
const Cross=({x,y,s=1}:P&{s?:number})=><g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={4} strokeLinecap="round"><path d="M-10-10L10 10M10-10L-10 10"/></g>;
const Tag=({x,y,text,w=200,active=false,warn=false,size=38}:P&{text:string;w?:number;active?:boolean;warn?:boolean;size?:number})=><g><rect x={x-w/2} y={y-28} width={w} height={58} rx={15} fill={warn?C.yellow:active?C.blue:C.white} stroke={warn?C.ink:active?C.blue:C.gray} strokeWidth={2}/><T x={x} y={y+13} size={size} color={active&&!warn?C.white:C.ink} latin={!/[\u0600-\u06ff]/.test(text)}>{text}</T></g>;
const Arrow=({points,color=C.blue,dashed=false,progress=1,width=4}:{points:string;color?:string;dashed?:boolean;progress?:number;width?:number})=><path d={points} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={dashed?'.02 .025':1} strokeDashoffset={dashed?0:1-clamp(progress)} markerEnd={progress>.96?'url(#arrow)':undefined}/>;

const Ticket=({x,y,scale=1,sell=false,fault=false,done=false,opacity=1}:P&{scale?:number;sell?:boolean;fault?:boolean;done?:boolean;opacity?:number})=><g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M-102-58H102V-37Q88-29 102-20V20Q88 29 102 37V58H-102V37Q-88 29-102 20V-20Q-88-29-102-37Z" fill={C.white} stroke={fault?C.ink:C.blue} strokeWidth={3.5}/>
 <path d="M-57-47V47" stroke={C.gray} strokeWidth={2} strokeDasharray="4 5"/>
 <path d={sell?'M-81-17V18M-93 5L-81 18L-69 5':'M-81 18V-17M-93-4L-81-17L-69-4'} stroke={C.blue} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
 <T x={20} y={-5} size={34} latin>{sell?'SELL':'BUY'}</T><T x={20} y={29} size={23} color={C.muted}>{sell?'طلب بيع':'طلب شراء'}</T>
 {fault&&<Warn x={92} y={-48} s={.6}/>} {done&&<Check x={82} y={45} s={.7}/>}
</g>;

const Server=({x,y,w=300,h=245,id=8,version='old',fault=false,active=false,opacity=1,receipt=0}:P&{w?:number;h?:number;id?:number;version?:'old'|'new'|'none';fault?:boolean;active?:boolean;opacity?:number;receipt?:number})=><g opacity={opacity} transform={`translate(${x} ${y})`}>
 <rect x={9} y={10} width={w} height={h} rx={24} fill={C.gray}/>
 <rect width={w} height={h} rx={24} fill={C.white} stroke={C.ink} strokeWidth={5}/>
 <path d={`M0 58H${w}`} stroke={C.ink} strokeWidth={3}/><circle cx={27} cy={29} r={6} fill={active?C.blue:C.gray}/><circle cx={48} cy={29} r={6} fill={fault?C.yellow:C.gray}/>
 <T x={w-34} y={40} size={31} latin>{String(id).padStart(2,'0')}</T>
 {[0,1].map(n=><g key={n}><rect x={22} y={79+n*49} width={w-44} height={34} rx={7} fill={C.pale}/><path d={`M38 ${96+n*49}h${w*.28}M${w*.58} ${96+n*49}h${w*.2}`} stroke={C.ink} strokeWidth={3} strokeLinecap="round"/><circle cx={w-38} cy={96+n*49} r={4} fill={active?C.blue:C.muted}/></g>)}
 {version!=='none'&&<g><rect x={22} y={h-58} width={w-44} height={39} rx={8} fill={version==='new'?C.ice:C.pale}/><T x={w/2} y={h-30} size={30} color={version==='new'?C.blue:C.ink}>{version==='new'?'نسخة جديدة':'نسخة قديمة'}</T></g>}
 {fault&&<><rect x={-7} y={-7} width={w+14} height={h+14} rx={29} stroke={C.yellow} strokeWidth={7} fill="none"/><Warn x={w-2} y={-7} s={.82}/></>}
 {receipt>0&&<g transform={`translate(0 ${-receipt*60})`} opacity={receipt}><rect x={w/2-63} y={-42} width={126} height={58} rx={12} fill={C.blue}/><Check x={w/2} y={-10} color={C.white}/></g>}
</g>;

const CompactServer=({x,y,id,updated,fault=false,active=false}:P&{id:number;updated:boolean;fault?:boolean;active?:boolean})=><g transform={`translate(${x} ${y})`}>
 <rect x={4} y={7} width={330} height={135} rx={18} fill={C.gray}/><rect width={330} height={135} rx={18} fill={C.white} stroke={C.ink} strokeWidth={4}/>
 <path d="M20 26H97M20 44H97M20 62H97" stroke={C.ink} strokeWidth={4} strokeLinecap="round"/><circle cx={27} cy={96} r={7} fill={active?C.blue:C.gray}/><circle cx={51} cy={96} r={7} fill={fault?C.yellow:C.gray}/>
 <T x={282} y={45} size={43} latin>{String(id).padStart(2,'0')}</T>
 <rect x={126} y={69} width={181} height={45} rx={9} fill={updated?C.ice:C.pale}/><T x={216} y={102} size={34} color={updated?C.blue:C.ink}>{updated?'جديد':'قديم'}</T>
 {updated&&<Check x={141} y={34} s={.63}/>}{fault&&<><rect x={-5} y={-5} width={340} height={145} rx={23} stroke={C.yellow} strokeWidth={6} fill="none"/><Warn x={327} y={-4} s={.6}/></>}
</g>;

const Fleet=({t,buildAt=-10,updateAt=-10,missAt=1e6,rollbackAt=1e6,spreadAt=1e6,small=false}:{t:number;buildAt?:number;updateAt?:number;missAt?:number;rollbackAt?:number;spreadAt?:number;small?:boolean})=><g transform={small?'translate(185 370) scale(.65)':'translate(0 0)'}>
 {[0,1,2,3,4,5,6,7].map(i=>{
  const p=show(t,buildAt+i*.075,.25),updated=i<7&&t>updateAt+i*.085&&t<rollbackAt+i*.1;
  const fault=i===7?t>missAt:t>spreadAt+i*.09;
  return <g key={i} opacity={p} transform={`translate(0 ${12*(1-p)})`}><CompactServer x={i%2===0?125:545} y={555+Math.floor(i/2)*180} id={i+1} updated={updated} fault={fault} active={updated||fault}/></g>
 })}
</g>;

const Exchange=({x,y,s=1}:P&{s?:number})=><g transform={`translate(${x} ${y}) scale(${s})`}>
 <path d="M-170-79L0-150L170-79Z" fill={C.white} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>
 <path d="M-168 96H168M-181 112H181" stroke={C.ink} strokeWidth={7} strokeLinecap="round"/>
 {[-120,-40,40,120].map(px=><g key={px}><path d={`M${px-15}-63V80H${px+15}V-63Z`} fill={C.white} stroke={C.ink} strokeWidth={4}/><path d={`M${px-22}-65H${px+22}M${px-22} 82H${px+22}`} stroke={C.blue} strokeWidth={6}/></g>)}
 <T x={0} y={173} size={48}>البورصة</T>
</g>;
const Person=({x,y,s=1,engineer=false}:P&{s?:number;engineer?:boolean})=><g transform={`translate(${x} ${y}) scale(${s})`}>
 <circle cy={-94} r={37} fill={C.white} stroke={C.ink} strokeWidth={4}/><path d="M-35-105Q-25-140 8-131Q34-127 36-105Z" fill={C.ink}/><circle cx={12} cy={-93} r={3.5} fill={C.ink}/>
 <path d="M-54 128V-12Q-53-55 0-55Q53-55 54-12V128Z" fill={engineer?C.gray:C.blue} stroke={C.ink} strokeWidth={4}/>
 <path d="M-43 127H43" stroke={C.ink} strokeWidth={4}/><path d="M18-17Q55 26 94 30" stroke={C.ink} strokeWidth={24} strokeLinecap="round" fill="none"/><path d="M18-17Q55 26 94 30" stroke={engineer?C.gray:C.blue} strokeWidth={17} strokeLinecap="round" fill="none"/>
 <path d="M86 21L110 18Q121 22 116 31L98 39L84 35Z" fill={C.white} stroke={C.ink} strokeWidth={3}/>
</g>;
const PacketFlow=({t,x1,y1,x2,y2,active=true,fault=false,dense=false,scale=.52,stopAt=1e6}:{t:number;x1:number;y1:number;x2:number;y2:number;active?:boolean;fault?:boolean;dense?:boolean;scale?:number;stopAt?:number})=>{
 if(!active)return null;const count=dense?5:2;
 return <g>{Array.from({length:count},(_,i)=>{const p=((t*(dense?.63:.36)+i/count)%1+1)%1;const stopped=t>=stopAt;
  const q=stopped?Math.min(p,.43):p;
  return <Ticket key={i} x={mix(x1,x2,q)} y={mix(y1,y2,q)} scale={scale} sell={i%2===1} fault={fault} opacity={Math.min(1,p*7,(1-p)*7)}/>;
 })}</g>
};

const AppPanel=({x,y,w=350,h=300,title,old=false,active=false,children}:P&{w?:number;h?:number;title:string;old?:boolean;active?:boolean;children?:React.ReactNode})=><g transform={`translate(${x} ${y})`}>
 <rect x={6} y={9} width={w} height={h} rx={21} fill={C.gray}/><rect width={w} height={h} rx={21} fill={C.white} stroke={C.ink} strokeWidth={4}/>
 <path d={`M0 58H${w}`} stroke={C.ink} strokeWidth={2}/><circle cx={24} cy={29} r={5} fill={active?C.blue:C.gray}/><circle cx={44} cy={29} r={5} fill={old&&active?C.yellow:C.gray}/><T x={w/2} y={40} size={31} latin={!/[\u0600-\u06ff]/.test(title)}>{title}</T>
 {children}
</g>;

const Activation=({t,c,phase=5}:{t:number;c:Record<string,number>;phase?:number})=>{
 const compare=phase===6?1:show(t,c.compare,.45),switchOn=phase===6?show(t,c.input,.35):show(t,c.switch,.4),oldOn=phase===6?show(t,c.old,.3):0;
 return <g>
  <g opacity={switchOn}>
   <Tag x={510} y={570} text="نفس الإشارة" w={250}/><T x={510} y={635} size={31} color={C.muted}>تشبيه للتفعيل في البرنامج</T>
   <rect x={445} y={667} width={130} height={64} rx={32} fill={phase===6?C.blue:C.gray} stroke={C.ink} strokeWidth={3}/>
   <circle cx={phase===6?542:477} cy={699} r={25} fill={C.white} stroke={C.ink} strokeWidth={2}/>
   <path d="M510 733V752H290V764M510 752H735V764" fill="none" stroke={C.ink} strokeWidth={3}/>
   {phase===6&&<><circle cx={mix(510,290,ease(t-c.input))} cy={mix(745,818,ease(t-c.input))} r={8} fill={C.blue}/><circle cx={mix(510,735,ease(t-c.old))} cy={mix(745,818,ease(t-c.old))} r={8} fill={C.blue}/></>}
  </g>
  <g opacity={compare}><T x={290} y={802} size={38}>السبعة المحدّثين</T><AppPanel x={115} y={835} title="الخدمة الجديدة" active={phase===6&&t>c.new}>
   <rect x={22} y={93} width={306} height={68} rx={10} fill={C.ice}/><T x={175} y={137} size={39}>طلب واحد</T>
   <path d="M175 171V205" stroke={C.blue} strokeWidth={4}/><Check x={175} y={243} s={1.3}/>
  </AppPanel></g>
  <g opacity={phase===6?1:show(t,c.legacy)}><T x={735} y={802} size={38}>الثامن: نسخة قديمة</T><AppPanel x={560} y={835} title={phase===6||t>c.name?'Power Peg':'كود قديم'} old active={oldOn>.5}>
   <rect x={22} y={93} width={306} height={68} rx={10} fill={oldOn>.5?C.yellow:C.pale}/><T x={175} y={137} size={39}>{oldOn>.5?'تفعّل بالغلطة':'باقي في البرنامج'}</T>
   {oldOn>.5?<><path d="M126 200C96 172 70 209 100 231C130 255 186 245 208 221M208 221L209 245M208 221L185 230" stroke={C.ink} strokeWidth={5} fill="none"/><T x={270} y={254} size={32}>تكرار</T></>:<><path d="M95 215H255M95 240H205" stroke={C.gray} strokeWidth={8} strokeLinecap="round"/><Warn x={292} y={237} s={.65}/></>}
  </AppPanel></g>
  {phase===5&&<g opacity={show(t,c.name)}><Tag x={735} y={1212} text="ما عادوش يستعملوه" w={345} size={33}/></g>}
 </g>
};

const Gate=({x,y,closed=false}:P&{closed?:boolean})=><g transform={`translate(${x} ${y})`}>
 <path d="M-36 79V-55Q-36-75-15-75H15Q36-75 36-55V79" stroke={C.ink} strokeWidth={6} fill={C.white}/>
 <path d={closed?'M-30-20H30M-30 0H30M-30 20H30':'M-25-35L-83-86M25-35L83-86'} stroke={closed?C.blue:C.gray} strokeWidth={7} strokeLinecap="round"/>
 {closed&&<Check x={0} y={-113} s={1.2}/>}
</g>;

const Hook=({t,c}:{t:number;c:Record<string,number>})=><g>
 <Server x={175} y={635} w={300} h={290} version="none" active fault={t>c.warning}/>
 <path d="M475 797L735 1080" stroke={C.ink} strokeWidth={4} fill="none"/>
 <PacketFlow t={t} x1={475} y1={797} x2={735} y2={1080} fault={t>c.warning} dense scale={.7}/>
 <Exchange x={650} y={1235} s={.8}/>
 <g opacity={show(t,c.loss)}><path d="M150 1015H405" stroke={C.yellow} strokeWidth={22}/><T x={280} y={1002} size={53}>مئات الملايين</T><T x={280} y={1070} size={38} color={C.muted}>خسارة تتراكم</T></g>
</g>;

const Context=({t,c}:{t:number;c:Record<string,number>})=><g>
 <Tag x={500} y={475} text="أوت 2012" w={220}/>
 <Person x={220} y={773} s={.88}/><T x={220} y={970} size={42}>الزبون</T>
 <g opacity={show(t,c.company)}><Server x={585} y={635} w={285} h={270} version="none" active/><T x={728} y={970} size={39} latin>Knight Capital</T></g>
 <path d="M335 795H570M728 990L510 1120" fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray="8 9"/>
 <Ticket x={440} y={795} scale={.58} opacity={show(t,c.orders)}/>
 <PacketFlow t={t} x1={728} y1={990} x2={510} y2={1120} active={t>c.orders} scale={.5} dense={t>c.speed}/>
 <Exchange x={370} y={1220} s={.75}/>
</g>;

const Scale=({t,c}:{t:number;c:Record<string,number>})=><g>
 <Tag x={500} y={480} text="1 أوت 2012" w={270}/>
 <Server x={155} y={650} w={275} h={275} version="none" fault={t>c.fault} active/>
 <Exchange x={720} y={850} s={.65}/><path d="M435 790H570" stroke={C.blue} strokeWidth={5}/>
 <PacketFlow t={t} x1={440} y1={790} x2={590} y2={790} active={t>c.open} dense={t>c.fault} fault={t>c.fault} scale={.52}/>
 <g opacity={show(t,c.minutes)}><T x={500} y={1095} size={124} latin>45</T><T x={500} y={1160} size={53}>دقيقة</T></g>
 <g opacity={show(t,c.executions)}><path d="M195 1220H805" stroke={C.gray} strokeWidth={2}/><T x={500} y={1310} size={91} latin>≈ 4,000,000</T><T x={500} y={1372} size={46}>عملية تداول</T></g>
</g>;

const Deployment=({t,c}:{t:number;c:Record<string,number>})=><g>
 <Tag x={500} y={478} text="قبل فتح السوق" w={310}/>
 <Fleet t={t} buildAt={c.fleet} updateAt={c.updated} missAt={c.missed}/>
 <g opacity={1-show(t,c.fleet)}><Server x={350} y={675} w={300} h={290} version="old"/><T x={500} y={1100} size={46}>نفس البرنامج على 8 كمبيوترات</T></g>
 <g opacity={show(t,c.review)}><path d="M210 1370H790" stroke={C.gray} strokeWidth={2}/><rect x={740} y={1391} width={36} height={36} rx={7} fill={C.white} stroke={C.ink} strokeWidth={2}/><T x={475} y={1420} size={35}>ما كانش تحقق ثاني يكشف الغلطة</T></g>
</g>;

const Software=({t,c}:{t:number;c:Record<string,number>})=><g>
 <g opacity={1-show(t,c.focus)}><Server x={350} y={660} w={300} h={290} version="old" fault/><T x={500} y={1060} size={48}>واش بقى في الثامن؟</T></g>
 <g opacity={show(t,c.focus)}><Activation t={t} c={c}/></g>
</g>;

const Completion=({t,c}:{t:number;c:Record<string,number>})=>{
 const complete=t>c.complete;
 return <g>
  <g transform="translate(0 -80)"><Activation t={t} c={c} phase={6}/></g>
  <g opacity={show(t,c.repeat)}>
   <rect x={115} y={1160} width={350} height={169} rx={18} fill={C.white} stroke={C.ink} strokeWidth={3}/>
   <T x={290} y={1210} size={38}>طلب الزبون</T><T x={290} y={1270} size={45} color={complete?C.blue:C.muted}>{complete?'مكتمل':'قيد التنفيذ'}</T>{complete&&<Check x={410} y={1260} s={.7}/>}
   <path d="M735 1070V1410" stroke={C.ink} strokeWidth={4} fill="none"/>
   <PacketFlow t={t-c.repeat} x1={735} y1={1110} x2={735} y2={1390} fault dense scale={.47}/>
   {complete&&<><path d="M465 1230H550M615 1230H678" stroke={C.gray} strokeWidth={3} strokeDasharray="7 8"/><Cross x={585} y={1230}/><Warn x={585} y={1320} s={.8}/><T x={382} y={1400} size={35}>الأوامر ما حبستش</T></>}
  </g>
 </g>
};

const Repair=({t,c}:{t:number;c:Record<string,number>})=><g>
 <g transform="translate(0 30)"><Fleet t={t} updateAt={-10} missAt={-10} rollbackAt={c.rollback} spreadAt={c.spread}/></g>
 <g opacity={show(t,c.repair)}><Tag x={500} y={490} text={t>c.old?'الكود القديم تفعّل':'نحّاو التحديث'} w={390} warn={t>c.old}/></g>
 {Array.from({length:7},(_,i)=>{const p=show(t,c.rollback+i*.1,.65);return p>0&&p<1?<g key={i} opacity={1-p}><Tag x={i%2===0?360:730} y={645+Math.floor(i/2)*180-p*130} text="تحديث" w={145} active size={28}/></g>:null})}
 <g opacity={show(t,c.continue)}><path d="M160 1370H850" stroke={C.ink} strokeWidth={3}/><PacketFlow t={t} x1={200} y1={1370} x2={850} y2={1370} fault dense scale={.4}/><T x={500} y={1460} size={40}>الأوامر ما زالت تخرج</T></g>
</g>;

const Controls=({t,c}:{t:number;c:Record<string,number>})=>{
 const risk=show(t,c.grow,2.5);
 return <g>
  <Server x={135} y={610} w={275} h={265} version="old" fault active/>
  <AppPanel x={545} y={610} w={350} h={265} title="مراقبة الخطر"><path d="M40 196H305M40 90V196" stroke={C.gray} strokeWidth={3}/><path d={`M45 182L98 170L145 147L202 ${140-60*risk}L290 ${125-85*risk}`} stroke={C.blue} strokeWidth={5} strokeLinejoin="round" fill="none"/><Warn x={300} y={112} s={.65}/></AppPanel>
  <path d="M410 740H535" stroke={C.ink} strokeWidth={3} strokeDasharray="7 8"/>
  <g opacity={show(t,c.link)}><path d="M720 890V990H535V1075" stroke={C.gray} strokeWidth={4} strokeDasharray="8 9" fill="none"/><circle cx={625} cy={990} r={28} fill={C.bg}/><Cross x={625} y={990}/></g>
  <path d="M270 895V1160H850" stroke={C.ink} strokeWidth={4} fill="none"/>
  <PacketFlow t={t} x1={290} y1={1160} x2={865} y2={1160} fault dense scale={.52}/>
  <Gate x={535} y={1160}/>
  <g opacity={show(t,c.gap)}><Tag x={500} y={1345} text="المراقبة ما حبستش الأوامر" w={620} warn size={43}/></g>
 </g>
};

const Loss=({t,c}:{t:number;c:Record<string,number>})=>{
 const later=show(t,c.later,.5),initial=show(t,c.initial,.4),second=show(t,c.laterNumber,.35);
 return <g>
  <g opacity={1-initial}><Ticket x={380} y={700} scale={1.2} fault/><Ticket x={660} y={790} scale={1.2} sell fault/><T x={500} y={1050} size={47}>تصفية الصفقات الغالطة</T></g>
  <g opacity={initial} transform={`translate(0 ${-50*later})`}>
   <T x={500} y={610} size={42}>الإعلان الأولي</T><T x={500} y={677} size={35} color={C.muted} latin>02 AUG 2012</T>
   <T x={500} y={850} size={151} latin>$440M</T><T x={500} y={929} size={43}>خسارة قبل الضرائب</T>
   <path d="M200 976H800" stroke={C.ink} strokeWidth={3}/>
  </g>
  <g opacity={later}><T x={500} y={1060} size={43}>التحقيق الرسمي لاحقًا</T><T x={500} y={1120} size={33} color={C.muted} latin>SEC · 2013</T>
   <T x={500} y={1277} size={123} latin opacity={second}>{'> $460M'}</T>
  </g>
 </g>
};

const Ending=({t,c}:{t:number;c:Record<string,number>})=>{
 const summary=show(t,c.checklist,.5),closed=t>c.stop;
 const items=['تحقق من التحديث','راقب الأوامر','وقف الخطر'];
 return <g>
  <g opacity={1-summary}><Server x={350} y={570} w={300} h={270} version="old" fault/><T x={500} y={1000} size={43}>تحديث ناقص ← كود قديم ← أوامر متكررة</T></g>
  <g opacity={summary}>
   {items.map((text,i)=><g key={text} opacity={show(t,c.checklist+i*.23,.3)}>
    <rect x={180} y={535+i*135} width={640} height={103} rx={16} fill={C.white} stroke={C.gray} strokeWidth={2}/>
    <circle cx={245} cy={586+i*135} r={24} fill={C.blue}/><Check x={245} y={586+i*135} s={.7} color={C.white}/><T x={555} y={603+i*135} size={47}>{text}</T>
   </g>)}
   <path d="M160 1110H850" stroke={C.ink} strokeWidth={4}/>
   <PacketFlow t={t} x1={180} y1={1110} x2={860} y2={1110} fault scale={.5} stopAt={c.stop}/><Gate x={535} y={1110} closed={closed}/>
   <T x={500} y={1290} size={48} color={closed?C.blue:C.ink}>{closed?'الغلطة تتشد قبل ما تكبر':'الحماية جزء من البرنامج'}</T>
  </g>
 </g>
};

export const KnightCapital:React.FC<{timeline?:Timeline}>=({timeline})=>{
 const frame=useCurrentFrame();const [fontHandle]=useState(()=>delayRender('Tajawal font'));
 useEffect(()=>{const font=new FontFace('Tajawal',`url(${staticFile('tajawal-bold.ttf')})`,{weight:'700'});font.load().then(f=>{document.fonts.add(f);continueRender(fontHandle)}).catch(()=>continueRender(fontHandle));},[fontHandle]);
 if(!timeline)return <AbsoluteFill style={{background:C.bg}}/>;
 const scene=timeline.scenes.find(s=>frame>=s.startFrame&&frame<s.endFrame)||timeline.scenes[timeline.scenes.length-1];
 const t=(frame-scene.startFrame)/30,c=scene.cues;
 const stages=[Hook,Context,Scale,Deployment,Software,Completion,Repair,Controls,Loss,Ending];
 const Stage=stages[scene.id-1];
 return <AbsoluteFill style={{background:C.bg}}><svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{overflow:'hidden'}}>
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill={C.blue}/></marker></defs>
  <T x={92} y={181} size={35} anchor="start" latin>Runtime<tspan fill={C.blue}>.tech</tspan></T>
  <T x={903} y={181} size={27} anchor="end" latin color={C.muted}>Knight Capital</T>
  <T x={505} y={350} size={scene.id===6?59:scene.id===4||scene.id===8?61:scene.id===5?64:70} latin={scene.id===2}>{scene.heading}</T>
  <path d="M460 395H550" stroke={C.blue} strokeWidth={5} strokeLinecap="round"/>
  <Stage t={t} c={c}/>
 </svg></AbsoluteFill>
};
