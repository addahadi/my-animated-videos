import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const C = {bg:'#101015', panel:'#191920', line:'#34323c', ink:'#f5ead3', muted:'#a9a5af', orange:'#da7758', mint:'#8fd7b6', blue:'#91b6fa', red:'#ed8c80'};
export const mono = 'Consolas, monospace';
export const arabic = 'Arabic, sans-serif';
export const ease = (value:number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, value)), 3);
export const progress = (time:number, start:number, duration=0.6) => ease((time-start)/duration);

export const Reveal:React.FC<{time:number;at?:number;children:React.ReactNode;style?:React.CSSProperties}> = ({time,at=0,children,style}) => {
  const p=progress(time,at);
  return <div style={{opacity:p,transform:`translateY(${(1-p)*24}px)`,...style}}>{children}</div>;
};
export const Arabic:React.FC<{children:React.ReactNode;size?:number;color?:string;style?:React.CSSProperties}> = ({children,size=38,color=C.ink,style}) => <div dir="rtl" style={{fontFamily:arabic,fontWeight:700,fontSize:size,lineHeight:1.6,color,...style}}>{children}</div>;
export const Label:React.FC<{children:React.ReactNode;color?:string;style?:React.CSSProperties}> = ({children,color=C.muted,style}) => <div style={{fontFamily:mono,fontSize:25,color,...style}}>{children}</div>;
export const Window:React.FC<{name:string;children:React.ReactNode;style?:React.CSSProperties;accent?:string}> = ({name,children,style,accent=C.orange}) => <div style={{background:C.panel,border:`2px solid ${C.line}`,boxShadow:'12px 14px 0 #09090d',...style}}>
  <div style={{height:58,borderBottom:`2px solid ${C.line}`,display:'flex',alignItems:'center',gap:13,padding:'0 24px'}}>
    {[accent,C.ink,C.mint].map((color,i)=><div key={i} style={{width:10,height:10,background:color,opacity:0.9}}/>)}
    <Label style={{fontSize:23,marginLeft:13}}>{name}</Label>
  </div><div style={{padding:32}}>{children}</div>
</div>;
export const Pill:React.FC<{children:React.ReactNode;color?:string}> = ({children,color=C.orange}) => <div style={{display:'inline-block',border:`1px solid ${color}66`,padding:'9px 16px',background:`${color}0c`,color,fontFamily:mono,fontSize:23}}>{children}</div>;

export const PixelMascot:React.FC<{time:number;color?:string;scale?:number;happy?:boolean;inspect?:boolean}> = ({time,color=C.orange,scale=1,happy=false,inspect=false}) => {
  const bounce = Math.sin(time*4)*5;
  const blink = time%4.7>4.5;
  const leg = Math.floor(time*4)%2;
  return <svg width={220*scale} height={150*scale} viewBox="0 0 220 150" style={{overflow:'visible',transform:`translateY(${bounce}px)`,shapeRendering:'crispEdges'}}>
    <ellipse cx="110" cy="143" rx="72" ry="6" fill="#000" opacity=".4"/>
    <g fill={color}>
      <path d="M50 35H160V45H175V90H165V105H50V95H38V50H50Z"/>
      <path d={leg?'M53 100H69V127H80V137H53ZM140 100H156V137H130V127H140Z':'M58 100H74V137H48V127H58ZM145 100H161V127H172V137H145Z'}/>
      <path d="M39 62H21V45H12V17H21V35H30V52H39ZM172 65H188V50H198V39H208V61H199V82H180Z"/>
      {happy&&<><rect x="5" y="1" width="7" height="7"/><rect x="209" y="22" width="7" height="7"/></>}
    </g>
    <g fill={C.bg}><rect x="70" y={blink?70:58} width="12" height={blink?4:21}/><rect x="133" y={blink?70:58} width="12" height={blink?4:21}/><rect x="103" y="88" width="9" height={happy?12:7}/></g>
    {inspect&&<g fill="none" stroke={C.ink} strokeWidth="6"><circle cx="175" cy="68" r="25"/><path d="M192 87L213 109"/></g>}
  </svg>;
};

export const Icon:React.FC<{kind:'shield'|'lock'|'code'|'check'|'search'|'bug'|'arrow';color?:string;size?:number}> = ({kind,color=C.orange,size=90}) => <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter">
  {kind==='shield'?<><path d="M50 8L82 20V47Q82 75 50 92Q18 75 18 47V20Z"/><path d="M34 48L46 61L68 36"/></>:
   kind==='lock'?<><rect x="22" y="43" width="56" height="44"/><path d="M33 43V27A17 17 0 0 1 67 27V43"/><path d="M50 58V72"/></>:
   kind==='code'?<><path d="M32 26L10 50L32 74M68 26L90 50L68 74M58 16L42 84"/></>:
   kind==='check'?<path d="M18 50L40 73L84 25"/>:
   kind==='search'?<><circle cx="43" cy="42" r="28"/><path d="M63 63L91 91"/></>:
   kind==='arrow'?<path d="M12 50H87M65 27L88 50L65 73"/>:
   <><rect x="30" y="30" width="40" height="46"/><path d="M40 30V18H60V30M17 40H30M70 40H83M17 60H30M70 60H83M40 76V89M60 76V89M50 37V67"/></>}
</svg>;

export const Developer:React.FC<{time:number}> = ({time}) => <svg width="245" height="235" viewBox="0 0 245 235" shapeRendering="crispEdges">
  <path d="M37 227V158H52V145H123V158H139V227" fill={C.orange}/>
  <path d="M60 48H119V62H134V112H120V138H71V125H55V67H60Z" fill={C.ink}/>
  <path d="M52 53V93H67V63H113V77H134V43H122V29H68V40H52Z" fill={C.line}/>
  <rect x="85" y="88" width="8" height="10" fill={C.bg}/><rect x="114" y="88" width="8" height="10" fill={C.bg}/>
  <path d="M96 117H113" stroke={C.orange} strokeWidth="5"/>
  <path d="M102 214H218V134H119Z" fill={C.panel} stroke={C.muted} strokeWidth="3"/>
  <path d="M88 224H233" stroke={C.muted} strokeWidth="6"/>
  <rect x={Math.sin(time*6)>0?159:161} y="164" width="18" height="18" fill={C.orange}/>
</svg>;

export const Backdrop:React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  return <><div style={{position:'absolute',inset:0,background:C.bg}}/>
    <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${C.line}35 1px,transparent 1px),linear-gradient(90deg,${C.line}35 1px,transparent 1px)`,backgroundSize:'120px 120px',opacity:0.52}}/>
    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 55% 50%,${accent}09,transparent 68%)`}}/>
    {Array.from({length:16},(_,i)=><div key={i} style={{position:'absolute',left:75+(i*137)%910,top:230+(i*173-frame*(.14+i%3*.08)+1920)%1450,width:i%3===0?5:3,height:i%3===0?5:3,background:accent,opacity:0.12+0.12*Math.sin(frame/35+i),transform:`rotate(${i*37}deg)`}}/>)}
  </>;
};

export const CodeLines:React.FC<{fixed?:boolean;highlight?:number;time:number}> = ({fixed=false,highlight=3,time}) => {
 const rows=[['01','const user = req.user;'],['02','const account = await db.find(req.params.id);'],['03',fixed?'if (account.ownerId !== user.id) {':'// Missing ownership check'],['04',fixed?'  return res.sendStatus(403);':'// Any account ID is accepted'],['05',fixed?'}':''],['06','return res.json(account);']];
 return <div style={{fontFamily:mono,fontSize:23,lineHeight:1.85}}>{rows.map(([n,text],i)=><div key={n} style={{display:'flex',gap:20,whiteSpace:'pre',background:i===highlight?`${fixed?C.mint:C.orange}17`:'transparent',borderLeft:`3px solid ${i===highlight?(fixed?C.mint:C.orange):'transparent'}`,paddingLeft:12,opacity:progress(time,i*.1)}}><span style={{color:C.muted,opacity:.55}}>{n}</span><span style={{color:i===highlight?(fixed?C.mint:C.orange):C.ink}}>{text||' '}</span></div>)}</div>;
};
