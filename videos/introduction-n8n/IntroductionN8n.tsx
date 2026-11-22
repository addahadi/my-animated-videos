import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';

export type Beat={start:number;end:number;scene:string;heading:string;keyword:string};
export type Timeline={durationInFrames:number;durationSeconds:number;beats:Beat[]};
const C={bg:'#161719',panel:'#222427',control:'#2C2F33',text:'#F2F1ED',muted:'#B7B9BE',line:'#727780',coral:'#EE795B',green:'#72B894',ink:'#25231F'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>1-Math.pow(1-clamp(v),3);
const appear=(t:number,at=0)=>ease((t-at)/.45);
type P={x:number;y:number};
const Txt=({x,y,children,size=32,color=C.text,bold=false,anchor='start',rtl=false}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string;bold?:boolean;anchor?:'start'|'middle'|'end';rtl?:boolean})=><text x={x} y={y} fontSize={size} fill={color} fontFamily={rtl?'NotoArabic, Arial':'Arial, NotoArabic, sans-serif'} fontWeight={bold?700:400} textAnchor={anchor} direction={rtl?'rtl':'ltr'}>{children}</text>;
const Check=({x,y,s=1,color=C.green}:P&{s?:number;color?:string})=><path d={`M${x-12*s} ${y}l${9*s} ${10*s} ${20*s} ${-23*s}`} stroke={color} strokeWidth={5*s} strokeLinecap="round" strokeLinejoin="round" fill="none"/>;
const Mark=({x,y,s=1}:P&{s?:number})=><g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.coral} strokeWidth={8} fill={C.panel} strokeLinecap="round" strokeLinejoin="round"><path d="M0 0H30L53-24H83M30 0L53 24H83" fill="none"/>{[[0,0],[30,0],[83,-24],[83,24]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={9}/>)}</g>;
const Bot=({t}: {t:number})=><g transform="translate(867 584)">
  <path d="M-41 35v13m52-13v13M-43 1h-14v16M39 1h13v16" stroke={C.text} strokeWidth={5} fill="none"/>
  <rect x={-43} y={-25} width={83} height={65} rx={12} fill={C.coral} stroke={C.ink} strokeWidth={2.5}/>
  <path d="M-4-25v-16h21" stroke={C.text} strokeWidth={3} fill="none"/><circle cx={20} cy={-41} r={5} fill={C.coral} stroke={C.text} strokeWidth={2}/>
  <rect x={-23} y={-4} width={7} height={t%5>4.8?2:12} rx={2} fill={C.ink}/><rect x={12} y={-4} width={7} height={t%5>4.8?2:12} rx={2} fill={C.ink}/><path d="M-8 19q7 6 14 0" stroke={C.ink} strokeWidth={2.5} fill="none"/>
</g>;
const Icon=({kind,x,y,s=1}:P&{kind:string;s?:number})=><g transform={`translate(${x} ${y}) scale(${s})`}>
 {kind==='clock'&&<g stroke={C.text} strokeWidth={3.5} fill="none"><circle r={30}/><path d="M0-19V0L15 9M-13-38H13" strokeLinecap="round"/></g>}
 {kind==='weather'&&<g><circle cx={-8} cy={-10} r={17} fill={C.coral}/><g stroke={C.coral} strokeWidth={3}>{[0,1,2,3,4,5,6,7].map(i=><path key={i} d="M-8-35V-42" transform={`rotate(${i*45} -8 -10)`}/>)}</g><path d="M-26 22a15 15 0 0 1 0-30a23 23 0 0 1 43-1a16 16 0 0 1 8 31Z" fill={C.control} stroke={C.text} strokeWidth={3}/></g>}
 {kind==='calendar'&&<g strokeWidth={3}><rect x={-28} y={-26} width={56} height={54} rx={6} fill={C.control} stroke={C.text}/><path d="M-28-10H28M-14-34V-19M14-34V-19" stroke={C.text}/><text x={0} y={18} fill={C.coral} fontFamily="Arial" fontWeight={700} fontSize={25} textAnchor="middle">25</text></g>}
 {kind==='telegram'&&<g><circle r={33} fill="#375A6B"/><path d="M-22-2L25-20L15 23L-1 9L-10 17L-8 3L14-12L-15 3Z" fill={C.text}/></g>}
 {kind==='ai'&&<g stroke={C.text} fill="none" strokeWidth={3}><path d="M-6-27C-24-38-37-16-25-6C-42 7-24 32-8 24M7-27C25-38 38-16 26-6C43 7 25 32 9 24M0-29V29M-25-6L-12-2M26-6L12 0M-8 24L-13 10M9 24L14 11"/><circle r={7} fill={C.coral} stroke={C.coral}/></g>}
 {kind==='tools'&&<g stroke={C.text} fill="none" strokeWidth={5} strokeLinecap="round"><path d="M-22 22L14-14M9-28a16 16 0 0 0 18 20L13 6M-26-26L26 26M-26-26L-13-22L-22-13Z"/></g>}
 {kind==='memory'&&<g stroke={C.text} fill="none" strokeWidth={3}><ellipse cy={-20} rx={27} ry={10}/><path d="M-27-20V20C-27 34 27 34 27 20V-20M-27 0C-27 14 27 14 27 0"/></g>}
 {kind==='code'&&<g stroke={C.text} fill="none" strokeWidth={4} strokeLinecap="round"><path d="M-14-17L-30 0L-14 17M14-17L30 0L14 17M6-25L-6 25"/></g>}
 {kind==='umbrella'&&<g stroke={C.text} fill="none" strokeWidth={3.5}><path d="M-31 0a31 31 0 0 1 62 0Q15-10 0 0Q-16-10-31 0ZM0-35V24q0 14 14 8"/></g>}
</g>;
const Cursor=({x,y,click=false}:P&{click?:boolean})=><g transform={`translate(${x} ${y})`}><path d="M0 0V38L11 28L20 48L28 44L19 25L35 24Z" fill={C.text} stroke={C.ink} strokeWidth={2}/>{click&&<circle r={29} stroke={C.coral} strokeWidth={3} fill="none"/>}</g>;
const Pill=({x,y,w,children,active=false,done=false}:P&{w:number;children:React.ReactNode;active?:boolean;done?:boolean})=><g><rect x={x} y={y} width={w} height={43} rx={7} fill={active?C.coral:done?'#293D33':C.control} stroke={active?C.coral:done?C.green:C.line} strokeWidth={1.5}/><Txt x={x+w/2} y={y+29} size={23} anchor="middle" color={active?C.ink:done?C.green:C.text} bold>{children}</Txt></g>;
const Node=({x,y,kind,label,active=false,done=false,s=1}:P&{kind:string;label:string;active?:boolean;done?:boolean;s?:number})=><g transform={`translate(${x} ${y}) scale(${s})`}>
 <rect x={-61} y={-61} width={122} height={122} rx={19} fill={C.control} stroke={active?C.coral:done?C.green:C.line} strokeWidth={active?4:2.3}/>
 <circle cx={-69} r={5} fill={C.panel} stroke={C.line} strokeWidth={2}/><circle cx={69} r={5} fill={C.panel} stroke={C.line} strokeWidth={2}/><Icon kind={kind} x={0} y={0}/><Txt x={0} y={103} size={25} bold anchor="middle">{label}</Txt>
 {done&&<g><circle cx={52} cy={-52} r={16} fill={C.green}/><Check x={51} y={-52} s={.47} color={C.bg}/></g>}
</g>;
const Flow=({t,focus=-1,build=false,run=false,labels=true}:{t:number;focus?:number;build?:boolean;run?:boolean;labels?:boolean})=>{
 const xs=[218,426,634,842];const kinds=['clock','weather','calendar','telegram'];const names=['Schedule','Weather','Calendar','Telegram'];
 return <g>{xs.slice(0,3).map((x,i)=>{const p=build?appear(t,.5+i*.5):1;const q=clamp((t-.6-i*.6)/.6);return <g key={x}><path d={`M${x+69} 1020H${xs[i+1]-69}`} stroke={run&&q>=1?C.green:C.line} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/>{run&&t>.6+i*.6&&q<1&&<circle cx={x+69+70*q} cy={1020} r={7} fill={C.coral}/>}</g>})}{xs.map((x,i)=><g key={x} opacity={build?appear(t,.15+i*.5):1}><Node x={x} y={1020} kind={kinds[i]} label={labels?names[i]:''} active={focus===i} done={run&&t>1.2+i*.6}/></g>)}</g>;
};
const Phone=({t,mode='brief'}:{t:number;mode?:string})=><g>
 <rect x={337} y={727} width={386} height={594} rx={38} fill={C.bg} stroke={C.line} strokeWidth={3}/><rect x={471} y={744} width={118} height={12} rx={6} fill={C.control}/><Txt x={369} y={794} size={21} color={C.muted}>07:00</Txt><Icon x={665} y={784} kind="telegram" s={.35}/>
 <rect x={359} y={825} width={342} height={455} rx={17} fill={C.control}/><Txt x={530} y={873} size={29} rtl bold anchor="middle">صباح الخير</Txt>
 <g opacity={appear(t,.35)}><Icon kind="weather" x={409} y={940} s={.8}/><Txt x={665} y={935} rtl anchor="start" size={27}>الطقس اليوم</Txt><Txt x={665} y={976} anchor="end" size={34} bold>18°C</Txt></g>
 <path d="M382 1005H678" stroke={C.line} strokeWidth={1}/>
 <g opacity={appear(t,mode==='weather'?5.3:.8)}><Icon kind="calendar" x={408} y={1068} s={.65}/><Txt x={665} y={1056} rtl anchor="start" size={26}>مواعيدك</Txt><Txt x={665} y={1101} size={28} anchor="end">09:30 / 14:00</Txt></g>
 <g opacity={appear(t,mode==='weather'?7.3:1.3)}><rect x={379} y={1155} width={302} height={87} rx={10} fill="#3C3430"/><Icon kind="umbrella" x={418} y={1197} s={.62}/><Txt x={660} y={1208} rtl anchor="start" size={25} color={C.coral}>ما تنساش المظلة</Txt></g>
</g>;

const Demo=({scene,t}:{scene:string;t:number})=>{
 if(['morning','appointments','automatic','ready'].includes(scene))return <g><Phone t={t+(scene==='appointments'?5.24:scene==='automatic'?9.1:0)} mode={scene==='ready'?'brief':'weather'}/>{['automatic','ready'].includes(scene)&&<g opacity={appear(t,.3)}><circle cx={790} cy={1110} r={47} fill="#293D33" stroke={C.green} strokeWidth={2}/><Check x={789} y={1110} s={1.4}/><Txt x={790} y={1192} size={25} anchor="middle" color={C.green}>Auto</Txt></g>}</g>;
 if(scene==='brand')return <g><Mark x={380} y={852} s={1.2}/><Txt x={515} y={885} size={96} bold>n8n</Txt><Flow t={t} build/><Txt x={530} y={1239} size={34} rtl anchor="middle" color={C.muted}>تطبيقاتك تخدم مع بعض</Txt></g>;
 if(['apps','once','repeat','workflow','visual'].includes(scene))return <g>
  <Pill x={132} y={744} w={206} active={scene==='once'} done={scene==='repeat'}>{scene==='once'?'Build once':scene==='repeat'?'Auto execution':'Morning workflow'}</Pill>
  {scene==='once'&&<g opacity={appear(t,1.6)}><Check x={865} y={765}/></g>}
  <Flow t={t} build={['apps','once','visual'].includes(scene)} run={scene==='repeat'||scene==='workflow'} focus={scene==='visual'?2:-1}/>
  {scene==='visual'&&<Cursor x={480+160*ease((t-.4)/1.5)} y={1004} click={t>1.8&&t<2.1}/>}
  <g opacity={appear(t,1.2)}><Txt x={530} y={1260} size={35} rtl anchor="middle" color={C.muted}>{scene==='once'?'ابنيها مرة وحدة':scene==='repeat'?'نفس الخطوات، تلقائياً':scene==='visual'?'اربط الخطوات بصرياً':'خطوات مربوطة ببعض'}</Txt></g>
 </g>;
 if(['node','trigger','action'].includes(scene)){const kind=scene==='trigger'?'clock':'weather';return <g>
   <Flow t={t} focus={scene==='trigger'?0:1}/><g opacity={.95}><rect x={349} y={749} width={362} height={100} rx={11} fill={C.control} stroke={C.coral} strokeWidth={2}/><Txt x={530} y={812} size={40} bold anchor="middle">{scene==='node'?'Node':scene==='trigger'?'Trigger':'Action'}</Txt><path d={`M530 849L${scene==='trigger'?218:426} 940`} stroke={C.coral} strokeWidth={2} strokeDasharray="8 8"/></g>
   <Txt x={530} y={1265} size={37} rtl anchor="middle" color={C.muted}>{scene==='trigger'?'الشرط اللي يبدا الخدمة':scene==='node'?'كل خطوة عندها دور':'كل نود تنفّذ مهمة'}</Txt>
 </g>}
 if(['clock','schedule'].includes(scene)){const p=appear(t,.7);return <g>
  <Icon kind="clock" x={530} y={847} s={1.55}/><Txt x={530} y={1032} size={117} bold anchor="middle">07:00</Txt>
  <Txt x={530} y={1110} size={36} rtl anchor="middle" color={C.muted}>كل صباح</Txt>
  <g opacity={p}><Pill x={367} y={1190} w={326} done>Schedule active</Pill><Check x={758} y={1212}/></g>
  {scene==='schedule'&&<Cursor x={690-105*ease((t-.1)/.65)} y={1221} click={t>.7&&t<1}/>}
 </g>}
 if(scene==='weather')return <g>
  <Node x={233} y={870} kind="weather" label="Weather API" active s={1.03}/><Pill x={382} y={816} w={90} active>GET</Pill><rect x={491} y={816} width={400} height={44} rx={7} fill={C.control} stroke={C.line}/><Txt x={511} y={847} size={25}>weather / today</Txt>
  <g opacity={appear(t,.8)}><rect x={375} y={917} width={516} height={305} rx={13} fill={C.control} stroke={C.line} strokeWidth={1.5}/><Txt x={849} y={979} rtl anchor="start" size={30}>طقس الولاية</Txt><Txt x={420} y={1066} size={70} bold>18°C</Txt><Icon kind="weather" x={800} y={1055} s={1.1}/><path d="M407 1100H859" stroke={C.line}/><Txt x={850} y={1161} rtl anchor="start" size={29} color={C.coral}>أمطار متوقعة</Txt><Icon kind="umbrella" x={439} y={1155} s={.6}/></g>
  <g opacity={appear(t,1.8)}><Check x={403} y={1295}/><Txt x={437} y={1306} size={28} color={C.green}>Forecast received</Txt></g>
 </g>;
 if(scene==='calendar')return <g>
  <Icon kind="calendar" x={166} y={774} s={.7}/><Txt x={213} y={785} size={32} bold>Google Calendar</Txt>
  {['09:30','14:00'].map((v,i)=><g key={v} opacity={appear(t,.4+i*.7)} transform={`translate(${30*(1-appear(t,.4+i*.7))} 0)`}><rect x={140} y={859+i*160} width={770} height={127} rx={12} fill={C.control} stroke={C.line} strokeWidth={1.5}/><rect x={142} y={861+i*160} width={7} height={123} rx={3} fill={i?C.green:C.coral}/><Txt x={181} y={936+i*160} size={39} bold>{v}</Txt><Txt x={870} y={936+i*160} rtl anchor="start" size={32}>{i?'موعد':'اجتماع'}</Txt></g>)}
  <g opacity={appear(t,1.8)}><Check x={173} y={1270}/><Txt x={213} y={1281} size={29} color={C.green}>Today's events</Txt></g>
 </g>;
 if(scene==='telegram')return <g>
  <g opacity={1-appear(t,1.8)}><Node x={287} y={951} kind="weather" label="Weather" done/><Node x={768} y={951} kind="calendar" label="Calendar" done/><path d="M356 951H460L530 1050L600 951H699M530 1050V1170" stroke={C.coral} strokeWidth={3} fill="none"/><Icon kind="telegram" x={530} y={1200} s={1.2}/><circle cx={356+150*clamp(t/.7)} cy={951} r={7} fill={C.coral}/></g>
  <g opacity={appear(t,1.7)}><Phone t={t-1.7}/></g>
 </g>;
 if(['beyond','agent'].includes(scene))return <g>
   <g opacity={appear(t)}><Node x={530} y={998} kind="ai" label="AI Agent" active s={1.25}/></g>
   {[{x:263,y:802,kind:'ai',label:'AI model'},{x:792,y:802,kind:'tools',label:'Tools'},{x:530,y:1220,kind:'memory',label:'Memory'}].map((v,i)=>{const p=appear(t,.65+i*.5);return <g key={v.kind} opacity={p}><path d={`M530 998L${v.x} ${v.y}`} stroke={C.line} strokeWidth={2.5} strokeDasharray="7 7"/><circle cx={530+(v.x-530)*ease((t-.65-i*.5)/.8)} cy={998+(v.y-998)*ease((t-.65-i*.5)/.8)} r={6} fill={C.coral}/><Node {...v} s={.82} done={t>2.4+i*.4}/></g>})}
 </g>;
 if(['series','advanced','follow'].includes(scene))return <g>
   <Mark x={405} y={800} s={.86}/><Txt x={510} y={826} size={67} bold>n8n</Txt>
   <path d="M255 1025H800" stroke={C.line} strokeWidth={3}/>
   <Node x={255} y={1025} kind="clock" label="Start" done/><Node x={530} y={1025} kind="weather" label="Workflow" active={scene==='series'} done={scene!=='series'}/><Node x={800} y={1025} kind="ai" label="AI Agent" active={scene!=='series'}/>
   {scene==='follow'?<g opacity={appear(t,.2)}><rect x={320} y={1218} width={420} height={87} rx={10} fill={C.coral}/><Txt x={530} y={1276} rtl anchor="middle" size={39} color={C.ink} bold>تابع السلسلة</Txt></g>:<Txt x={530} y={1281} rtl anchor="middle" size={37} color={C.muted}>{scene==='series'?'نتعلّم من الصفر':'حتى نبنيو AI Agents'}</Txt>}
 </g>;
 return null;
};

export const IntroductionN8n:React.FC<{timeline?:Timeline}>=({timeline})=>{
 const f=useCurrentFrame();const time=f/30;const [handle]=useState(()=>delayRender('Load bundled Arabic fonts'));
 useEffect(()=>{Promise.all([document.fonts.load('700 48px NotoArabic'),document.fonts.load('400 32px NotoArabic')]).then(()=>continueRender(handle));},[handle]);
 if(!timeline)return <AbsoluteFill style={{background:C.bg}}/>;
 const beat=timeline.beats.find(b=>time>=b.start&&time<b.end)??timeline.beats[timeline.beats.length-1];const t=time-beat.start;
 const p=appear(t+.12);const title=['morning','appointments','automatic','ready','telegram'].includes(beat.scene)?'Telegram / Morning briefing':['weather','calendar','schedule','clock'].includes(beat.scene)?beat.keyword:['agent','beyond'].includes(beat.scene)?'n8n / AI workflow':'n8n / Morning workflow';
 return <AbsoluteFill style={{background:C.bg}}>
  <style>{`@font-face{font-family:NotoArabic;src:url('${staticFile('arabic-bold.ttf')}');font-weight:700;}@font-face{font-family:NotoArabic;src:url('${staticFile('arabic-regular.ttf')}');font-weight:400;}`}</style>
  <Audio src={staticFile('narration.wav')}/>
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
   {time<9.1&&<foreignObject x={230} y={195} width={600} height={100} opacity={clamp((9.1-time)/.35)}>
    <div dir="rtl" style={{height:86,display:'flex',alignItems:'center',justifyContent:'center',gap:16,boxSizing:'border-box',border:`2px solid ${C.coral}`,borderRadius:10,background:C.control,color:C.text,fontFamily:'NotoArabic, Arial, sans-serif',fontSize:44,fontWeight:700}}>
     <span>سلسلة تعلم</span><span dir="ltr" style={{fontFamily:'Arial, sans-serif',color:C.coral}}>n8n</span>
    </div>
   </foreignObject>}
   <g opacity={p} transform={`translate(0 ${12*(1-p)})`}>
    <Txt x={530} y={383} size={64} bold rtl anchor="middle">{beat.heading}</Txt>
    <Txt x={530} y={474} size={42} color={C.muted} bold anchor="middle">{beat.keyword}</Txt>
   </g>
   <rect x={100} y={631} width={870} height={790} rx={19} fill="#0B0C0E"/>
   <rect x={90} y={620} width={870} height={790} rx={18} fill={C.panel} stroke={C.line} strokeWidth={2.5}/>
   <path d="M109 621H942Q959 621 959 640V691H91V640Q91 621 109 621" fill={C.control}/><path d="M92 691H959" stroke={C.line} strokeWidth={1.5}/>
   <Mark x={122} y={655} s={.29}/><Txt x={165} y={665} size={27} bold>{title}</Txt>
   <circle cx={912} cy={655} r={6} fill={C.green}/>
   <g opacity={p}><Demo scene={beat.scene} t={t}/></g><Bot t={time}/>
   <g opacity={p}><Pill x={365} y={1485} w={330} active>{['agent','beyond','advanced'].includes(beat.scene)?'AI workflow':['follow','series'].includes(beat.scene)?'n8n series':'Morning workflow'}</Pill></g>
   <rect x={359} y={1620} width={342} height={4} rx={2} fill={C.control}/><rect x={359} y={1620} width={342*clamp(f/(timeline.durationInFrames-1))} height={4} rx={2} fill={C.coral}/>
  </svg>
 </AbsoluteFill>;
};
