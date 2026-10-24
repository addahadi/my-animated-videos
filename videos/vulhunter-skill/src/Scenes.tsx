import React from 'react';
import {interpolate} from 'remotion';
import {Arabic, C, CodeLines, Developer, Icon, Label, mono, Pill, progress, Reveal, Window} from './design';

const area:React.CSSProperties={position:'absolute',left:80,width:880};
const Heading:React.FC<{time:number;tag:string;title:string;sub?:string;accent:string}> = ({time,tag,title,sub,accent}) => <div style={{...area,top:245}}>
  <Reveal time={time}><Label color={accent} style={{fontSize:29,marginBottom:25}}>{tag}</Label></Reveal>
  <Reveal time={time} at={.12}><Arabic size={65} style={{lineHeight:1.5}}>{title}</Arabic></Reveal>
  {sub&&<Reveal time={time} at={.35}><Arabic size={29} color={C.muted} style={{marginTop:18}}>{sub}</Arabic></Reveal>}
</div>;
const Note:React.FC<{time:number;at?:number;children:React.ReactNode;accent?:string;label?:string}> = ({time,at=0,children,accent=C.orange,label}) => <Reveal time={time} at={at} style={{...area,top:1260}}>
  {label&&<Arabic size={26} color={accent} style={{marginBottom:18}}>{label}</Arabic>}
  <div style={{borderRight:`5px solid ${accent}`,background:`${accent}09`,padding:'23px 28px'}}><Arabic size={35}>{children}</Arabic></div>
</Reveal>;

const App:React.FC<{time:number;publish?:boolean;warning?:boolean}> = ({time,publish=false,warning=false}) => <Window name="my-app / preview" style={{position:'relative',overflow:'hidden'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><Label color={C.ink}>MY APP</Label><div style={{display:'flex',gap:11}}>{[1,2,3].map(n=><div key={n} style={{width:55,height:6,background:C.line}}/>)}</div></div>
  <div style={{display:'flex',gap:30,marginTop:38,alignItems:'center'}}><div style={{width:300}}><Arabic size={42}>فكرتك… تطبيق.</Arabic><div style={{marginTop:25,height:10,width:230,background:C.line}}/><div style={{marginTop:14,height:10,width:160,background:C.line}}/></div>
    <div style={{flex:1,display:'flex',gap:18}}>{[80,125,97,165,145].map((height,i)=><div key={i} style={{height:height*progress(time,i*.2),width:45,background:i===3?C.orange:C.line,alignSelf:'flex-end'}}/>)}</div>
  </div>
  <div style={{marginTop:48,display:'flex',gap:18}}>{['API','DATABASE','AUTH'].map((name,i)=><div key={name} style={{flex:1,padding:20,border:`1px solid ${warning&&i===1?C.orange:C.line}`,color:warning&&i===1?C.orange:C.muted,fontFamily:mono,fontSize:23,textAlign:'center'}}>{name}{warning&&i===1?' !':''}</div>)}</div>
  <div style={{display:'flex',justifyContent:'space-between',marginTop:35,alignItems:'center'}}><Label style={{fontSize:22}}>localhost:3000</Label><div style={{background:publish?C.orange:C.line,color:publish?C.bg:C.muted,padding:'14px 32px',fontFamily:mono,fontSize:26,fontWeight:700}}>Publish ↗</div></div>
</Window>;

export const Hook:React.FC<{time:number}> = ({time}) => {
 const question=time>3.7;
 const cursor=progress(time,.8,1.7);
 return <><Heading time={time} tag="VIBE CODING / BEFORE LAUNCH" title={question?'بصح… تطبيقك آمن؟':'جاهز تنشر تطبيقك؟'} sub="الكود خدم. واش من بعد؟" accent={C.orange}/>
  <Reveal time={time} at={.3} style={{...area,top:550}}><App time={time} publish warning={question}/>
    <svg width="50" height="65" viewBox="0 0 50 65" style={{position:'absolute',right:interpolate(cursor,[0,1],[320,75]),bottom:interpolate(cursor,[0,1],[180,22]),filter:'drop-shadow(2px 4px 2px #000)'}}><path d="M5 3V48L18 36L30 58L40 52L28 32H45Z" fill={C.ink} stroke={C.bg} strokeWidth="3"/></svg>
    {question&&<div style={{position:'absolute',inset:0,border:`3px solid ${C.orange}`,pointerEvents:'none',opacity:.5+.3*Math.sin(time*3)}}/>}
  </Reveal>
  <div style={{position:'absolute',left:95,top:1110}}><Developer time={time}/></div>
  <Reveal time={time} at={3.8} style={{position:'absolute',left:395,top:1185,width:565}}><div style={{display:'flex',gap:26,alignItems:'center',border:`1px solid ${C.orange}66`,background:C.panel,padding:28}}><Icon kind="lock" size={65}/><Arabic size={36}>الثغرة تقدر تكون مخبّية</Arabic></div></Reveal>
 </>;
};

export const Intro:React.FC<{time:number}> = ({time}) => {
 const named=time>=6.48;
 const scan=(time*.23)%1;
 return <><Heading time={time} tag="SECURITY / BEFORE DEPLOY" title={named?'VulnHunter':'افحص قبل ما تنشر'} sub={named?'أداة من Capital One':'اكتشف الثغرات… وصلّحها'} accent={C.orange}/>
  <Reveal time={time} at={.2} style={{...area,top:550}}><Window name="source-code / security scan" style={{position:'relative',overflow:'hidden'}}>
    <CodeLines time={time} highlight={3}/>
    <div style={{position:'absolute',left:0,right:0,top:70+scan*355,height:3,background:C.orange,boxShadow:`0 0 25px ${C.orange}`,opacity:time<7?1:0}}/>
    <div style={{marginTop:28,border:`1px solid ${C.orange}77`,padding:24,display:'flex',alignItems:'center',gap:24}}><Icon kind={named?'shield':'search'} size={75}/><div><Label color={C.orange} style={{fontSize:32}}>{named?'VulnHunter':'ANALYZING SOURCE'}</Label><Arabic size={29} color={C.muted}>{named?'من الكود إلى دليل واضح':'الفحص يبدأ من الكود'}</Arabic></div></div>
  </Window></Reveal>
  <Note time={time} at={.6}>الفحص ← الإصلاح ← التحقق</Note>
 </>;
};

export const Setup:React.FC<{time:number}> = ({time}) => <>
 <Heading time={time} tag="OPEN SOURCE / SETUP" title="مفتوح المصدر" sub="VulnHunter على GitHub" accent={C.orange}/>
 <Reveal time={time} at={.25} style={{...area,top:550}}><Window name="github.com / capitalone / VulnHunter">
  <div style={{display:'flex',alignItems:'center',gap:25}}><Icon kind="code" size={75}/><div><Label color={C.ink} style={{fontSize:36}}>VulnHunter</Label><Label style={{marginTop:10,fontSize:24}}>capitalone / public repository</Label></div></div>
  <div style={{marginTop:32,borderTop:`1px solid ${C.line}`}}>{['vulnhunt/','vulnhunter-fix/','vulnhunt-fix-verify/'].map((name,i)=><Reveal key={name} time={time} at={1+i*.32}><div style={{padding:'17px 10px',borderBottom:`1px solid ${C.line}`,display:'flex',gap:18}}><span style={{color:C.orange}}>▣</span><Label color={C.ink} style={{fontSize:28}}>{name}</Label></div></Reveal>)}</div>
  <Reveal time={time} at={5.8}><div style={{marginTop:34,display:'flex',alignItems:'center',gap:20}}><Pill>Claude Code</Pill><Label>+</Label><Pill color={C.blue}>Claude Opus</Pill></div></Reveal>
 </Window></Reveal>
 <Note time={time} at={5.9} label="باش تستعملها" accent={C.orange}>Claude Code مع الوصول لـ Opus</Note>
</>;

export const Hunt:React.FC<{time:number}> = ({time}) => {
 const report=time>6.2;
 const scanning=progress(time,1.9,3.6);
 return <><Heading time={time} tag="01 / HUNT" title="افحص الكود" sub="من نقطة الدخول… حتى مكان الخلل" accent={C.orange}/>
  <Reveal time={time} at={.25} style={{...area,top:530}}><Window name="claude-code / scan">
    <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:30}}><Label color={C.orange}>❯</Label><Label color={C.ink} style={{fontSize:36}}>{'/vulnhunt'.slice(0,Math.floor(progress(time,.35,1.1)*9))}<span style={{opacity:Math.floor(time*2)%2}}>▌</span></Label></div>
    <div style={{height:148,display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative'}}>
      <div style={{position:'absolute',left:70,right:70,height:2,background:C.line}}/>
      <div style={{position:'absolute',left:70,width:660*scanning,height:3,background:C.orange}}/>
      {['ENTRY','CODE','DATA'].map((n,i)=><div key={n} style={{position:'relative',background:C.panel,border:`2px solid ${scanning>i*.35?C.orange:C.line}`,padding:'25px 30px',textAlign:'center'}}><Label color={scanning>i*.35?C.orange:C.muted} style={{fontSize:25}}>{n}</Label></div>)}
    </div>
    <div style={{marginTop:28,height:14,background:C.line}}><div style={{height:'100%',width:`${scanning*100}%`,background:C.orange}}/></div>
    <Label style={{marginTop:15,fontSize:22}}>{Math.round(scanning*100)}% / SOURCE ANALYSIS</Label>
    <Reveal time={time} at={6.2}><div style={{marginTop:30,border:`1px solid ${C.orange}66`,background:`${C.orange}0b`,padding:24}}><div style={{display:'flex',justifyContent:'space-between'}}><Label color={C.orange}>VULN-001</Label><Pill color={C.orange}>FINDING</Pill></div><Arabic size={35} style={{marginTop:8}}>صلاحيات الوصول ناقصة</Arabic><Label style={{marginTop:12,fontSize:23}}>route → account → protected data</Label></div></Reveal>
  </Window></Reveal>
  <Note time={time} at={1.5} accent={C.orange} label={report?'نتيجة الفحص':'الخطوة الأولى'}>{report?'المشكل + مكانه + إصلاح مقترح':'يقلب على الثغرات الأمنية'}</Note>
 </>;
};

export const Fix:React.FC<{time:number}> = ({time}) => {
 const fixed=time>4.5;
 const tested=time>7.1;
 return <><Heading time={time} tag="02 / FIX" title="صلّح الثغرة" sub="تعديل موجّه في الكود" accent={C.mint}/>
  <Reveal time={time} at={.25} style={{...area,top:530}}><Window name="claude-code / remediation" accent={C.mint}>
    <Label color={C.mint} style={{fontSize:34,marginBottom:28}}>❯ /vulnhunter-fix</Label>
    <div style={{border:`1px solid ${fixed?C.mint:C.orange}55`,padding:'18px 6px',position:'relative'}}><CodeLines fixed={fixed} time={time} highlight={3}/><div style={{position:'absolute',right:10,top:5}}><Label color={fixed?C.mint:C.orange} style={{fontSize:20}}>{fixed?'PATCH':'BEFORE'}</Label></div></div>
    <div style={{marginTop:28,padding:24,border:`1px solid ${tested?C.mint:C.line}`,display:'flex',alignItems:'center',gap:24}}><Icon kind={tested?'check':'bug'} color={tested?C.mint:C.orange} size={62}/><div><Label color={tested?C.mint:C.orange} style={{fontSize:29}}>{tested?'SECURITY TEST / PASS':'SECURITY TEST / FAIL'}</Label><Arabic size={27} color={C.muted}>{tested?'التعديل منع مسار الخلل':'الثغرة تتعاود في الاختبار'}</Arabic></div></div>
  </Window></Reveal>
  <Note time={time} at={1.5} accent={C.mint}>{tested?'نختبروا التصليح في الكود':'نحدّدوا الخلل… ونعدّلوا الكود'}</Note>
 </>;
};

export const Verify:React.FC<{time:number}> = ({time}) => {
 const done=time>6.6;
 return <><Heading time={time} tag="03 / VERIFY" title="تحقّق من التصليح" sub="مراجعة مستقلة من Agent آخر" accent={C.blue}/>
  <Reveal time={time} at={.25} style={{...area,top:530}}><Window name="independent-agent / review" accent={C.blue}>
    <Label color={C.blue} style={{fontSize:30,marginBottom:28}}>❯ /vulnhunt-fix-verify</Label>
    <div style={{display:'flex',gap:25}}>{[{title:'PATCH',kind:'code'},{title:'EVIDENCE',kind:'search'}].map(({title,kind})=><div key={title} style={{flex:1,border:`1px solid ${C.line}`,padding:18,textAlign:'center'}}><Icon kind={kind as 'code'|'search'} color={C.blue} size={70}/><Label color={C.ink} style={{marginTop:12}}>{title}</Label><div style={{margin:'18px auto 0',width:'75%',height:5,background:C.line}}/></div>)}</div>
    <div style={{marginTop:28}}>{['مراجعة التعديل','فحص الأدلة','حكم على النتيجة'].map((label,i)=><Reveal time={time} at={1.5+i*1.7} key={label}><div style={{display:'flex',justifyContent:'space-between',padding:'8px 5px',borderBottom:`1px solid ${C.line}`,alignItems:'center'}}><Label color={C.blue}>{time>3+i*1.7?'✓':'· · ·'}</Label><Arabic size={26}>{label}</Arabic></div></Reveal>)}</div>
    <Reveal time={time} at={6.6}><div style={{marginTop:20,display:'flex',justifyContent:'space-between',alignItems:'center',border:`1px solid ${C.mint}88`,padding:'14px 23px'}}><Label color={C.mint}>VULN-001 / REMEDIATED</Label><Icon kind="check" color={C.mint} size={34}/></div></Reveal>
  </Window></Reveal>
  <Note time={time} at={.8} accent={C.blue}>{done?'هذا الخلل تصَلّح… بالدليل':'هل التصليح خدم فعلاً؟'}</Note>
 </>;
};

export const Exploit:React.FC<{time:number}> = ({time}) => {
 const blocked=time>4.0;
 const path=progress(time,.65,2.5);
 return <><Heading time={time} tag="EVIDENCE / EXPLOITABILITY" title="يقدر يستغلّها مهاجم؟" sub="نفهموا مسار الثغرة" accent={C.orange}/>
 <Reveal time={time} at={.2} style={{...area,top:550}}><Window name="exploit-path / illustration">
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><Pill color={blocked?C.mint:C.orange}>{blocked?'AFTER PATCH':'BEFORE PATCH'}</Pill><Label style={{fontSize:21}}>EXAMPLE / VULN-001</Label></div>
  <svg width="810" height="385" viewBox="0 0 810 385" style={{marginTop:30}}>
   <path d="M100 100H400V285H705" stroke={C.line} strokeWidth="3" fill="none"/>
   <path d="M100 100H400V285H705" stroke={blocked?C.mint:C.orange} strokeWidth="5" fill="none" strokeDasharray="800" strokeDashoffset={800*(1-path)}/>
   {[{x:35,y:50,t:'ENTRY'},{x:325,y:50,t:'AUTH'},{x:625,y:235,t:'DATA'}].map(({x,y,t})=><g key={t}><rect x={x} y={y} width="150" height="100" fill={C.panel} stroke={C.line} strokeWidth="2"/><text x={x+75} y={y+58} fontFamily={mono} fontSize="26" textAnchor="middle" fill={C.ink}>{t}</text></g>)}
   {blocked?<><path d="M373 171H427V229H373Z" fill={C.bg} stroke={C.mint} strokeWidth="4"/><path d="M385 171V160A15 15 0 0 1 415 160V171" stroke={C.mint} strokeWidth="4" fill="none"/><path d="M400 191V209" stroke={C.mint} strokeWidth="4"/></>:<circle cx={100+Math.min(path*2,1)*300} cy={100+Math.max(0,Math.min((path-.5)*2,1))*185} r="10" fill={C.orange}/>}
   <text x="400" y="365" textAnchor="middle" fill={blocked?C.mint:C.orange} fontSize="29" fontFamily={mono}>{blocked?'ACCESS BLOCKED':'MISSING ACCESS CONTROL'}</text>
  </svg>
  <Arabic size={34} color={blocked?C.mint:C.orange} style={{textAlign:'center'}}>{blocked?'التعديل يوقف المسار':'نقطة دخول ← خلل ← بيانات'}</Arabic>
 </Window></Reveal>
 <Note time={time} at={.5} accent={C.orange}>تبحث على دليل أن الخلل قابل للاستغلال</Note>
 </>;
};

export const Closing:React.FC<{time:number}> = ({time}) => <>
 <Heading time={time} tag="VULNHUNTER / BEFORE YOU SHIP" title="قبل ما تنشر تطبيقك" sub="افحص. صلّح. تحقّق." accent={C.orange}/>
 <Reveal time={time} at={.15} style={{...area,top:580}}><Window name="security / workflow">
  {['الفحص','الإصلاح','التحقق'].map((label,i)=><Reveal key={label} time={time} at={.25+i*.18}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'25px 5px',borderBottom:`1px solid ${C.line}`}}><div style={{display:'flex',gap:20,alignItems:'center'}}><Label color={[C.orange,C.mint,C.blue][i]}>0{i+1}</Label><Label color={C.ink} style={{fontSize:28}}>{['HUNT','FIX','VERIFY'][i]}</Label></div><Arabic size={38}>{label}</Arabic></div></Reveal>)}
 </Window></Reveal>
 <Reveal time={time} at={.7} style={{...area,top:1120}}><div style={{border:`2px solid ${C.orange}`,padding:'26px 30px',textAlign:'center',background:`${C.orange}10`}}><Arabic size={45} color={C.orange}>تابع للمزيد من أدوات AI</Arabic></div></Reveal>
</>;
