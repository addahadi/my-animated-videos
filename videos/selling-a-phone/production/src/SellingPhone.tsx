import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';

type Cue={at:number;until:number;art:string;text:string;accent:string};
type Segment={start:number;end:number;step:number;name:string;cues:Cue[]};
type Timeline={durationInFrames:number;segments:Segment[]};
const C={bg:'#F0EFF4',white:'#FFFFFF',ink:'#111214',gray:'#D2D4D9',pale:'#E6E7EC',blue:'#0087FA',yellow:'#FFC400',muted:'#B5B5BB'};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const ease=(x:number)=>{const t=clamp(x);return t*t*(3-2*t);};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const Text:React.FC<{x:number;y:number;size?:number;color?:string;children:React.ReactNode;latin?:boolean}>=({x,y,size=22,color=C.ink,children,latin=false})=><text x={x} y={y} textAnchor="middle" fill={color} fontSize={size} fontFamily={latin?'Segoe UI, sans-serif':'Tajawal, sans-serif'} fontWeight={700} direction={latin?'ltr':'rtl'}>{children}</text>;
const Check:React.FC<{x?:number;y?:number;s?:number;color?:string}>=({x=0,y=0,s=1,color=C.white})=><path transform={`translate(${x} ${y}) scale(${s})`} d="M-14 0L-3 11L19-16" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none"/>;
const Cross:React.FC<{x?:number;y?:number;s?:number;color?:string}>=({x=0,y=0,s=1,color=C.ink})=><path transform={`translate(${x} ${y}) scale(${s})`} d="M-11-11L11 11M11-11L-11 11" stroke={color} strokeWidth={5} strokeLinecap="round"/>;

const Glyph:React.FC<{kind:string;x?:number;y?:number;s?:number;color?:string}>=({kind,x=0,y=0,s=1,color=C.white})=><g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
 {kind==='photo'&&<><rect x={-23} y={-20} width={46} height={40} rx={5}/><circle cx={9} cy={-7} r={4}/><path d="M-19 15L-4-3L10 15M7 12L16 2L21 11"/></>}
 {kind==='file'&&<><path d="M-16-23H6L19-10V23H-16Z M6-23V-10H19M-6 1H10M-6 11H8"/></>}
 {kind==='contact'&&<><circle cy={-10} r={10}/><path d="M-21 23V17Q-21 3 0 3T21 17V23Z"/></>}
 {kind==='chat'&&<><path d="M-24-19H24V15H-8L-21 25V15H-24Z"/><path d="M-13-6H13M-13 4H7"/></>}
 {kind==='lock'&&<><rect x={-20} y={-3} width={40} height={31} rx={5}/><path d="M-12-3V-15a12 12 0 0124 0V-3"/><path d="M0 10V17"/></>}
 {kind==='cloud'&&<path d="M-25 17C-43 17-43-8-25-9C-28-34 8-36 14-15C31-25 44-10 36 3C49 20 25 21 17 20H-25Z"/>}
 {kind==='bluetooth'&&<path d="M-13-14L14 12L0 26V-26L14-12L-13 14"/>}
 {kind==='bank'&&<><path d="M-25-10L0-26L25-10ZM-25 24H25M-22 18H22M-16-4V15M0-4V15M16-4V15"/></>}
 {kind==='mail'&&<><rect x={-25} y={-18} width={50} height={36} rx={4}/><path d="M-24-16L0 4L24-16"/></>}
 {kind==='reset'&&<><path d="M-20-9A23 23 0 111-23M-21-25V-7H-3"/></>}
 {kind==='save'&&<path d="M-18-24H18V26L0 12L-18 26Z"/>}
 {kind==='share'&&<><circle cx={-16} r={7}/><circle cx={17} cy={-21} r={7}/><circle cx={17} cy={21} r={7}/><path d="M-10-4L11-17M-10 4L11 17"/></>}
 {kind==='phone'&&<><rect x={-14} y={-25} width={28} height={50} rx={6}/><path d="M-4 17H4"/></>}
 {kind==='key'&&<><circle cx={-10} cy={-5} r={12}/><path d="M0 3L22 24M11 14L18 7M17 20L24 13"/></>}
 {kind==='check'&&<Check/>}
</g>;
const Tile:React.FC<{x:number;y:number;kind:string;size?:number;blue?:boolean;checked?:boolean}>=({x,y,kind,size=63,blue=true,checked=false})=><g transform={`translate(${x} ${y})`}>
 <rect x={-size/2-3} y={-size/2+4} width={size+6} height={size+2} rx={size*.23} fill="#B9BDC7"/>
 <rect x={-size/2} y={-size/2} width={size} height={size} rx={size*.20} fill={blue?C.blue:C.gray} stroke={C.ink} strokeWidth={size>100?4:2}/>
 <Glyph kind={kind} s={size/78} color={blue?C.white:'#858A97'}/>
 {checked&&<g transform={`translate(${size*.43} ${-size*.43})`}><circle r={15} fill={C.blue} stroke={C.white} strokeWidth={3}/><Check s={.5}/></g>}
</g>;
const Pill:React.FC<{x:number;y:number;text:string;w?:number;blue?:boolean}>=({x,y,text,w=160,blue=false})=><g><rect x={x-w/2} y={y-19} width={w} height={38} rx={19} fill={blue?C.blue:C.white} stroke={C.blue} strokeWidth={1.5}/><Text x={x} y={y+7} size={19} color={blue?C.white:C.ink} latin={!/[\u0600-\u06ff]/.test(text)}>{text}</Text></g>;

const Phone:React.FC<{mode?:string;checked?:boolean;progress?:number;fade?:number;detail?:boolean}>=({mode='apps',checked=false,progress=0,fade=1,detail=true})=><g>
 <path d="M213 360V399M213 419V479M507 402V486" stroke={C.ink} strokeWidth={5} strokeLinecap="round"/>
 <rect x={214} y={244} width={292} height={580} rx={59} fill={C.ink}/>
 <rect x={226} y={256} width={268} height={556} rx={48} fill={mode==='hello'||mode==='hook'?C.blue:'#FBFBFD'}/>
 <rect x={237} y={274} width={246} height={522} rx={30} fill={mode==='hello'||mode==='hook'?C.blue:C.pale} stroke={mode==='inside'?C.ink:'none'} strokeWidth={2.4}/>
 {mode==='inside'?<g opacity={fade}>
  <rect x={249} y={313} width={112} height={105} rx={17} fill={C.gray}/>{[267,294,321].map(x=><rect key={x} x={x} y={334} width={14} height={62} rx={5} fill="#E9EAF0"/>)}
  <rect x={378} y={306} width={94} height={112} rx={25} fill="#C8CAD2"/>{[[402,334,20],[447,371,21],[403,390,11]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#E8E9EF" stroke="#B7BAC4" strokeWidth={3}/>)}
  <rect x={249} y={438} width={111} height={51} rx={13} fill={C.gray}/>{detail?<Tile x={427} y={454} kind="lock" size={77}/>:<rect x={388} y={415} width={78} height={78} rx={15} fill={C.gray}/>}
  <rect x={247} y={515} width={227} height={265} rx={25} fill={C.gray} stroke="#BABDC5" strokeWidth={2}/><path d="M277 744H443" stroke={C.pale} strokeWidth={20} strokeLinecap="round"/>
 </g>:mode==='hello'?<g><Text x={360} y={510} size={46} color={C.white} latin>Hello</Text><Text x={360} y={553} size={25} color={C.white}>مرحبا</Text><path d="M341 667H380M367 654L381 667L367 680" stroke={C.white} strokeWidth={3} fill="none"/></g>:mode==='hook'?<g><Text x={360} y={429} size={124} color={C.white} latin>7</Text><Text x={360} y={482} size={27} color={C.white}>قبل ما تبيع</Text><Text x={360} y={517} size={27} color={C.white}>تليفونك</Text><Tile x={360} y={650} size={99} kind="lock" blue={false}/></g>:mode==='auth'?<g>
  <Text x={360} y={347} size={21} latin>Authenticator</Text>{[0,1,2].map((i)=><g key={i}><rect x={252} y={380+i*103} width={216} height={85} rx={12} fill={C.white}/><circle cx={276} cy={422+i*103} r={9} fill={C.blue}/><Text x={371} y={432+i*103} size={28} color={C.blue} latin>{['123 456','802 119','290 771'][i]}</Text></g>)}<Text x={360} y={744} size={16} color="#858A97">أكواد توضيحية</Text>
 </g>:mode==='account'?<g><circle cx={360} cy={394} r={48} fill={C.gray}/><Glyph kind="contact" x={360} y={394} s={1.1} color={C.white}/><Text x={360} y={493} size={24}>الحساب القديم</Text><rect x={263} y={550} width={194} height={58} rx={16} fill={C.blue}/><Text x={360} y={588} size={23} color={C.white}>تسجيل الخروج</Text><Glyph kind="lock" x={360} y={690} color="#ABB0BC"/>
 </g>:mode==='reset'?<g><Tile x={360} y={421} kind="reset" size={103}/><Text x={360} y={540} size={25} latin>Factory Reset</Text><rect x={267} y={589} width={186} height={12} rx={6} fill={C.gray}/><rect x={267} y={589} width={186*progress} height={12} rx={6} fill={C.blue}/><Text x={360} y={660} size={19}>مسح البيانات</Text></g>:<g opacity={fade}>
  <Text x={360} y={345} size={21}>بياناتك وحساباتك</Text>{['photo','contact','chat','file','bank','mail','key','bluetooth','lock'].map((kind,i)=><Tile key={kind} x={279+(i%3)*81} y={412+Math.floor(i/3)*106} kind={kind} size={58} blue={i<6||mode==='apps'}/>)}<rect x={271} y={726} width={178} height={27} rx={13} fill={C.white}/>
 </g>}
 <rect x={316} y={270} width={88} height={25} rx={13} fill={C.ink}/><rect x={321} y={787} width={78} height={5} rx={3} fill={mode==='hello'||mode==='hook'?'#D3ECFF':'#B9BDC7'}/><path d="M231 310V732" stroke={C.white} strokeWidth={1.3} opacity={.6}/>
 {checked&&<g><circle cx={478} cy={319} r={29} fill={C.blue} stroke={C.white} strokeWidth={4}/><Check x={478} y={319}/></g>}
</g>;

const PhoneAt:React.FC<{x:number;y?:number;scale?:number;mode?:string;checked?:boolean;progress?:number;fade?:number}>=({x,y=534,scale=.76,...props})=><g transform={`translate(${x} ${y}) scale(${scale}) translate(-360 -534)`}><Phone {...props}/></g>;
const Backdrop:React.FC<{t:number;mode?:string;targetX?:number;targetY?:number}>=({t,mode='inside',targetX=427,targetY=454})=>{const k=ease(t/1.05),scale=lerp(1,2.4,k);return <g className="backdrop" opacity={lerp(1,.10,ease(t/.5))} transform={`translate(360 510) scale(${scale}) translate(${-lerp(360,targetX,k)} ${-lerp(510,targetY,k)})`}><Phone mode={mode} detail={false}/></g>;};
const Rings:React.FC<{x?:number;y?:number}>=({x=360,y=510})=><g>{[100,164,229,292].map((r,i)=><circle key={r} cx={x} cy={y} r={r} fill="none" stroke={C.blue} strokeWidth={1.6} opacity={.39-i*.085}/>)}</g>;
const Zoom:React.FC<{t:number;kind:string;children?:React.ReactNode}>=({t,kind,children})=>{const k=ease(t/1.05),scale=lerp(1,2.4,k),x=360+scale*(427-lerp(360,427,k)),y=510+scale*(454-lerp(510,454,k));return <><Backdrop t={t}/><Tile x={x} y={y} size={lerp(77,146,k)} kind={kind}/><g opacity={ease((t-.2)/.6)}><Rings/>{children}</g></>;};
const Watch:React.FC<{x:number;y:number;unlinked:boolean}>=({x,y,unlinked})=><g transform={`translate(${x} ${y})`}><rect x={-27} y={-112} width={54} height={224} rx={21} fill={C.gray} stroke={C.ink} strokeWidth={3}/><rect x={-48} y={-63} width={96} height={126} rx={27} fill={C.ink}/><rect x={-39} y={-54} width={78} height={108} rx={20} fill={unlinked?C.pale:C.blue}/><Glyph kind={unlinked?'check':'bluetooth'} color={unlinked?C.blue:C.white} s={.8}/><path d="M49-20V4" stroke={C.ink} strokeWidth={7} strokeLinecap="round"/></g>;
const Earbuds:React.FC<{x:number;y:number}>=({x,y})=><g transform={`translate(${x} ${y})`} fill={C.white} stroke={C.ink} strokeWidth={3}><rect x={-52} y={-10} width={104} height={82} rx={27}/><path d="M-51 12H51" fill="none"/><path d="M-24-24V-65Q-58-63-45-88Q-18-106-11-77V-24ZM24-24V-65Q58-63 45-88Q18-106 11-77V-24Z"/><circle cy={51} r={4} fill={C.blue} stroke="none"/></g>;
const Connection:React.FC<{x1:number;y1:number;x2:number;y2:number;t:number;off?:boolean}>=({x1,y1,x2,y2,t,off=false})=><g><path d={`M${x1} ${y1}Q${(x1+x2)/2} ${Math.min(y1,y2)-30} ${x2} ${y2}`} fill="none" stroke={off?C.gray:C.blue} strokeWidth={3} strokeDasharray={off?'7 9':undefined}/>{!off&&[0,.33,.66].map((v,i)=>{const p=(t*.4+v)%1;return <circle key={i} cx={lerp(x1,x2,p)} cy={lerp(y1,y2,p)-Math.sin(Math.PI*p)*15} r={5} fill={C.blue}/>;})}{off&&<g transform={`translate(${(x1+x2)/2} ${(y1+y2)/2-12})`}><circle r={18} fill={C.bg}/><Cross s={.65} color={C.blue}/></g>}</g>;

const Illustration:React.FC<{art:string;t:number;sectionT:number}>=({art,t,sectionT})=>{
 const k=ease(t/1.1);
 if(art==='hook'||art==='risk')return <><Phone mode={art==='hook'?'hook':'inside'}/>{art==='hook'?<g>{[0,1,2,3,4,5,6].map((i)=><g key={i} opacity={ease((t-i*.11)/.25)}><circle cx={146} cy={316+i*67} r={19} fill={i===1?C.yellow:C.white} stroke={i===1?C.ink:C.blue} strokeWidth={2}/><Text x={146} y={323+i*67} size={20} latin>{i+1}</Text></g>)}</g>:<><circle cx={427} cy={454} r={56} fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray="9 7"/><Text x={549} y={442} size={93} color={C.yellow} latin>!</Text></>}</>;
 if(art==='backup')return <><Phone mode="apps"/><g transform={`translate(560 315)`}><Glyph kind="cloud" s={1.2} color={C.ink}/><Glyph kind="cloud" s={1.05} color={C.blue}/></g><Connection x1={450} y1={410} x2={550} y2={340} t={t}/><Pill x={555} y={390} w={158} text="Google Drive"/><Pill x={555} y={439} w={123} text="iCloud"/></>;
 if(art==='files')return <><Backdrop t={t}/><g opacity={ease((t-.2)/.6)}><Rings/>{['photo','file','contact','chat'].map((kind,i)=><Tile key={kind} x={280+(i%2)*160} y={405+Math.floor(i/2)*160} kind={kind} size={101}/>)}<Pill x={360} y={750} w={209} text="نسخة احتياطية" blue/></g></>;
 if(art==='pc')return <><PhoneAt x={204} scale={.71}/><g transform="translate(500 519)"><rect x={-108} y={-81} width={216} height={144} rx={12} fill={C.ink}/><rect x={-99} y={-71} width={198} height={125} rx={4} fill={C.white}/><path d="M-121 68H121L140 85H-140Z" fill={C.gray} stroke={C.ink} strokeWidth={3}/><Glyph kind="file" color={C.blue} s={1}/></g><Connection x1={308} y1={500} x2={399} y2={500} t={t}/><Pill x={500} y={659} text="PC" w={82}/></>;
 if(art==='backup-check')return <><Zoom t={t} kind="cloud"><g opacity={ease((t-1.2)/.5)}><circle cx={427} cy={447} r={27} fill={C.blue} stroke={C.white} strokeWidth={3}/><Check x={427} y={447}/><Pill x={360} y={738} text="افتح الملفات وتأكد" w={235} blue/></g></Zoom></>;
 if(art==='auth-focus')return <><Zoom t={t} kind="key"><g opacity={k}><Text x={360} y={323} size={31} color={C.blue} latin>2FA</Text><Pill x={360} y={717} text="قبل الفورماط" w={180}/><Text x={535} y={425} size={94} color={C.yellow} latin>!</Text></g></Zoom></>;
 if(art==='auth-transfer'||art==='auth-safe')return <><PhoneAt x={209} mode="auth" scale={.72}/><PhoneAt x={520} mode="auth" scale={.72} checked={art==='auth-safe'||t>1.3}/><Connection x1={321} y1={510} x2={408} y2={510} t={t}/><Pill x={209} y={803} text="القديم" w={110}/><Pill x={520} y={803} text="الجديد" w={110} blue/><Pill x={360} y={282} text={art==='auth-safe'?'جرّب الدخول أولاً':'نقل أكواد التحقق'} w={245}/></>;
 if(art==='auth-lock')return <><Zoom t={t} kind="lock"><g opacity={k}><Text x={360} y={327} size={31} color={C.blue} latin>2FA</Text><Pill x={360} y={720} text="طبقة حماية إضافية" w={243}/><Glyph kind="key" x={561} y={510} color={C.blue}/></g></Zoom></>;
 if(art==='auth-risk')return <><Phone mode="auth"/><g opacity={k}><circle cx={360} cy={533} r={100} fill={C.yellow} stroke={C.ink} strokeWidth={4}/><Glyph kind="lock" x={360} y={533} s={1.8} color={C.ink}/><Pill x={360} y={741} text="تحافظ على الدخول" w={223}/></g></>;
 if(art==='auth-next')return <><Zoom t={t} kind="lock"><g opacity={k}><Text x={360} y={328} size={35} color={C.blue} latin>2FA</Text><Pill x={360} y={725} text="فيديو خاص قريباً" w={225}/></g></Zoom></>;
 if(art==='watch'||art==='bluetooth')return <><PhoneAt x={254} mode="inside" scale={.85}/><Watch x={545} y={art==='watch'?510:392} unlinked={t>1.2||art==='bluetooth'}/>{art==='bluetooth'&&<Earbuds x={545} y={669}/>}<Connection x1={385} y1={510} x2={490} y2={art==='watch'?510:392} t={t} off={t>1.2}/>{art==='bluetooth'&&<Connection x1={385} y1={615} x2={488} y2={669} t={t} off={t>1.2}/>}<Pill x={360} y={827} text="إلغاء الربط" w={165} blue/></>;
 if(art==='account')return <><Phone mode="account"/><Pill x={360} y={871} text="Google / Apple Account" w={287}/></>;
 if(art==='account-remove')return <><PhoneAt x={209} mode="account" scale={.72}/><PhoneAt x={520} mode="account" scale={.72}/><Pill x={209} y={282} text="Android" w={137}/><Pill x={520} y={282} text="iPhone" w={123}/>{t>1&&[209,520].map(x=><g key={x}><circle cx={x} cy={565} r={33} fill={C.blue} stroke={C.white} strokeWidth={3}/><Check x={x} y={565}/></g>)}<Pill x={360} y={819} text="الحساب + Find My" w={260}/></>;
 if(art==='activation')return <><Zoom t={t} kind="lock"><g opacity={k}><Pill x={245} y={715} text="FRP" w={99}/><Pill x={471} y={715} text="Activation Lock" w={226}/><Text x={360} y={328} size={27}>حماية ضد السرقة</Text></g></Zoom></>;
 if(art==='old-account')return <><Phone mode="account"/><g opacity={k}><rect x={247} y={514} width={227} height={219} rx={21} fill={C.white} stroke={C.ink} strokeWidth={2}/><Glyph kind="lock" x={360} y={562} color={C.blue}/><Text x={360} y={624} size={23}>يطلب الحساب القديم</Text><Text x={360} y={675} size={46} color={C.yellow} latin>!</Text></g></>;
 if(art==='sensitive')return <><Phone mode="apps"/><g opacity={k}><circle cx={360} cy={518} r={63} fill="none" stroke={C.blue} strokeWidth={3} strokeDasharray="9 7"/><Pill x={360} y={863} text="البنك والمراسلات والحسابات" w={319}/></g></>;
 if(art==='sessions')return <><Backdrop t={t} mode="apps" targetX={360} targetY={510}/><g opacity={k}><circle cx={360} cy={510} r={252} fill={C.white} stroke={C.ink} strokeWidth={4}/><Text x={360} y={345} size={27}>الأجهزة المرتبطة</Text>{[0,1,2].map((i)=><g key={i} opacity={i===0?1-ease((t-1.2)/.7):1}><rect x={177} y={386+i*96} width={366} height={75} rx={14} fill={i===0?C.pale:'#F4F4F8'}/><Glyph kind="phone" x={214} y={424+i*96} color={i===0?'#9196A3':C.blue} s={.65}/><Text x={354} y={432+i*96} size={21}>{['التليفون القديم','التليفون الجديد','جهاز آخر'][i]}</Text>{i===0?<Cross x={512} y={424} s={.55}/>:<Check x={512} y={424+i*96} s={.5} color={C.blue}/>}</g>)}<Pill x={360} y={715} text="إزالة الجهاز القديم" w={238} blue/></g></>;
 if(art==='whatsapp')return <><PhoneAt x={209} scale={.72}/><PhoneAt x={520} scale={.72} checked={t>1.2}/><Connection x1={321} y1={510} x2={408} y2={510} t={t}/><Tile x={360} y={342} kind="chat" size={87}/><Pill x={360} y={804} text="WhatsApp" w={170}/><Text x={360} y={868} size={23}>المحادثات والحساب للجديد</Text></>;
 if(art==='ready-reset')return <><Phone mode="apps"/><g>{[0,1,2,3,4].map((i)=><g key={i} opacity={ease((t-i*.1)/.3)}><circle cx={552} cy={370+i*76} r={23} fill={C.blue}/><Check x={552} y={370+i*76} s={.7}/></g>)}</g><Pill x={360} y={870} text="درك فقط: الفورماط" w={248} blue/></>;
 if(art==='reset-menu')return <><Backdrop t={t} mode="reset" targetX={360} targetY={510}/><g opacity={k}><circle cx={360} cy={510} r={251} fill={C.white} stroke={C.ink} strokeWidth={4}/><Text x={360} y={352} size={28} color={C.blue} latin>Settings</Text><path d="M190 390H530" stroke={C.gray} strokeWidth={2}/><Text x={360} y={455} size={27} latin>Android</Text><Text x={360} y={494} size={23} color={C.blue} latin>Factory Reset</Text><Text x={360} y={571} size={27} latin>iPhone</Text><Text x={360} y={610} size={20} color={C.blue} latin>Erase All Content</Text><Text x={360} y={641} size={20} color={C.blue} latin>and Settings</Text><Text x={360} y={812} size={17} color="#9296A0">المسار يختلف حسب الجهاز</Text></g></>;
 if(art==='resetting')return <Phone mode={t>1.7?'hello':'reset'} progress={ease(t/1.7)}/>;
 if(art==='welcome')return <><Phone mode="hello"/><Pill x={360} y={868} text="شاشة البداية واللغة" w={252}/></>;
 if(art==='welcome-warning')return <><Phone mode="hello"/><circle cx={492} cy={680} r={47} fill={C.yellow} stroke={C.ink} strokeWidth={3}/><Text x={492} y={700} size={62} latin>!</Text><Pill x={360} y={866} text="شاشة البداية وحدها ما تكفيش" w={341}/></>;
 if(art==='verify-account')return <><PhoneAt x={233} mode="hello" scale={.83} checked={t>1}/><g opacity={k}><circle cx={526} cy={441} r={66} fill={C.white} stroke={C.ink} strokeWidth={3}/><Glyph kind="contact" x={526} y={441} color={C.gray} s={1.3}/><path d="M478 488L575 393" stroke={C.blue} strokeWidth={6} strokeLinecap="round"/><Pill x={522} y={554} text="الحساب مفصول" w={184}/><Pill x={522} y={610} text="تفعيل بلا حساب قديم" w={226} blue/></g></>;
 if(art==='handover')return <><Phone mode="hello" checked/><g opacity={k}><path d="M720 579H594L534 618L477 658Q458 671 471 686Q480 695 496 689L542 670L516 727Q511 747 530 749H720Z" fill={C.ink}/><path d="M639 579V749" stroke="#30323A" strokeWidth={17}/></g><Pill x={360} y={869} text="جاهز للشاري" w={193} blue/></>;
 if(art==='save'||art==='share'||art==='follow')return <><Phone mode="hello" checked/><g transform={`translate(${art==='share'?lerp(613,552,k):552} 440)`}><circle r={53} fill={C.blue} stroke={C.white} strokeWidth={4}/><Glyph kind={art==='share'?'share':'save'} s={1.2}/></g><Pill x={360} y={872} text={art==='follow'?'حساباتك والداتا تاعك بأمان':'7 خطوات قبل البيع'} w={art==='follow'?335:235} blue/></>;
 return <Phone/>;
};

export const SellingPhone:React.FC<{timeline?:Timeline}>=({timeline})=>{
 const f=useCurrentFrame(),time=f/30;
 const [handle]=useState(()=>delayRender('Load bundled Tajawal Bold'));
 useEffect(()=>{document.fonts.load('700 63px Tajawal').then(()=>continueRender(handle)).catch(()=>continueRender(handle));},[handle]);
 if(!timeline)return <AbsoluteFill style={{background:C.bg}}/>;
 const s=timeline.segments.find(s=>time>=s.start&&time<s.end)??timeline.segments[timeline.segments.length-1];
 const local=time-s.start,cue=s.cues.find(c=>local>=c.at&&local<c.until)??s.cues[s.cues.length-1],t=local-cue.at;
 let artAt=cue.at;
 for(let i=s.cues.indexOf(cue)-1;i>=0&&s.cues[i].art===cue.art;i--)artAt=s.cues[i].at;
 const words=cue.text.split(' '),active=Math.max(1,Math.ceil(clamp(t/.9)*words.length));
 return <AbsoluteFill style={{background:C.bg,color:C.ink}}>
  <style>{`@font-face{font-family:Tajawal;src:url('${staticFile('tajawal-bold.ttf')}') format('truetype');font-weight:700;font-display:block}*{box-sizing:border-box}.backdrop text{display:none}`}</style>
  <Audio src={staticFile('narration.wav')} volume={0.9}/>
  <svg width={1080} height={1920} viewBox="0 0 720 1280" style={{position:'absolute',inset:0}}>
   <defs><clipPath id="illustration"><rect x={0} y={205} width={720} height={700}/></clipPath></defs>
   <Illustration art={cue.art} t={Math.max(0,local-artAt)} sectionT={local}/>
   {s.step>0&&s.step<8&&<Pill x={360} y={188} text={`${s.name}   ${s.step}/7`} w={310}/>}
   {Array.from({length:7},(_,i)=><g key={i}><rect x={196+i*48} y={1126} width={35} height={5} rx={2.5} fill={s.step>i?C.blue:C.gray}/>{s.step===i+1&&<circle cx={213.5+i*48} cy={1144} r={3} fill={C.blue}/>}</g>)}
  </svg>
  <div style={{position:'absolute',top:123,left:65,fontFamily:'Segoe UI, sans-serif',fontSize:40,fontWeight:750,letterSpacing:-1}}>RunTime<span style={{color:C.blue}}>.tech</span></div>
  <div dir="rtl" style={{position:'absolute',top:123,right:65,border:'2px solid #B8B7BE',borderRadius:35,padding:'5px 24px 2px',fontFamily:'Tajawal',fontSize:31}}>تقنية</div>
  <div dir="rtl" style={{position:'absolute',top:1393,left:95,right:80,fontFamily:'Tajawal',fontSize:63,fontWeight:700,lineHeight:1.55,textAlign:'right'}}>
   {words.map((w,i)=><React.Fragment key={`${cue.at}-${i}`}><span style={{color:i>=active?C.muted:cue.accent.split(' ').includes(w)?C.blue:C.ink}}>{w}</span>{i<words.length-1?' ':''}</React.Fragment>)}
  </div>
 </AbsoluteFill>;
};
