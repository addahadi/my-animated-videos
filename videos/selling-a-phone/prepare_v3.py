from pathlib import Path
ROOT=Path(__file__).resolve().parent
V2=ROOT/'production-v2'
V3=ROOT/'production-v3'
(V3/'src-v3').mkdir(parents=True,exist_ok=True)
source=(V2/'src-v2/SellingPhoneV2.tsx').read_text(encoding='utf-8').replace('SellingPhoneV2','SellingPhoneV3')
start=source.index('const Intro:React.FC')
end=source.index('const Backup:React.FC',start)
source=source[:start]+(V3/'hook-source.tsx.txt').read_text(encoding='utf-8')+source[end:]
start=source.index('export const SellingPhoneV3:')
end=source.index('const Watch:',start)
source=source[:start]+(V3/'main-source.tsx.txt').read_text(encoding='utf-8')+source[end:]
removals=[
 '  {contact&&<g><Pill x={470} y={774} text="الأرقام تقدر ترجعهم" w={265} blue/><Check x={628} y={774}/></g>}\n',
 '  <T x={138} y={796} size={23}>الأصل يبقى هنا</T>\n',
 '   {t>=10.28&&<Pill x={530} y={819} text="لازم نتحقق" w={205} yellow/>}\n',
 '<Pill x={360} y={862} text="انقل حسابات التحقق" w={290} blue/>',
 '  {activated&&<Pill x={360} y={864} text="التحققات الثلاثة كملو" w={310} blue/>}\n',
 '  <Pill x={360} y={861} text="جاهز للبيع" w={202} blue/>\n',
 '  <Pill x={360} y={862} text="Save" w={146} blue/>\n',
 '  <Pill x={536} y={bt?654:714} text={off?\'تقدر تربطها بالجديد\':\'مقترن بالقديم\'} w={bt?269:243} blue={off}/>\n',
 '  {find&&<Pill x={535} y={744} text={switchedOff?\'Find My متوقف\':\'تأكد من Find My\'} w={263} blue={switchedOff}/>}\n',
 '  <T x={535} y={853} size={20} color={C.muted}>تنحّي الربط، الحساب ما يتحذفش</T>\n',
 '  <Pill x={360} y={863} text={received?\'الحساب والمحادثات وصلو\':\'نقل الحساب + المحادثات\'} w={350} blue={received}/>\n',
 '<Pill x={360} y={859} text="déconnexion وين لازم" w={309}/>',
]
for text in removals:
    if text not in source:raise ValueError('Missing exact caption removal: '+text)
    source=source.replace(text,'')
source=source.replace("{risk?<><Arrow x1={411} y1={581} x2={382} y2={620} broken/><Pill x={360} y={274} text=\"إذا ما نقلتش الأكواد\" w={310} yellow/></>:next?<Pill x={360} y={852} text=\"2FA: نفهموه في فيديو خاص\" w={366} blue/>:<Pill x={360} y={852} text=\"كلمة السر + كود من التطبيق\" w={375} blue/>}","{risk&&<><Arrow x1={411} y1={581} x2={382} y2={620} broken/><Pill x={360} y={274} text=\"إذا ما نقلتش الأكواد\" w={310} yellow/></>}")
source=source.replace("{!inspect?<Pill x={517} y={662} text={t>=5.02?'باقي زوج حوايج':'شاشة البداية: أول تحقق'} w={303} yellow={t>=5.02}/>:<g>","{inspect&&<g>")
source=source.replace('<Device id="erasing" x={240} y={325} label="القديم" blue={done}>','<Device id="erasing" x={220} y={300} w={280} label="القديم" blue={done}>')
(V3/'src-v3/SellingPhoneV3.tsx').write_text(source,encoding='utf-8')
for old,new in [('src-v2/index.tsx','src-v3/index.tsx'),('production-v2.cjs','production-v3.cjs'),('finish_v2.py','finish_v3.py'),('verify_v2.py','verify_v3.py')]:
    text=(V2/old).read_text(encoding='utf-8').replace('SellingPhoneV2','SellingPhoneV3').replace('v2','v3')
    if new=='src-v3/index.tsx':text=text.replace('timeline-v3.json','timeline-v2.json')
    if new=='verify_v3.py':text=text.replace('timeline-v3.json','timeline-v2.json')
    if new=='production-v3.cjs':
        a=text.index('const samples=')
        b=text.index(';',a)
        rows="[['hook-first',.15],['hook-password',.6],['hook-blocked',1.4],['hook-old',2.8],['hook-stakes',5],['hook-rewind',7.8],['hook-prepared',9.4],['backup-copy',14.2],['backup-open',23.3],['backup-contacts',24.8],['auth-transfer',30.3],['login',35.6],['auth-risk',38.3],['watch-after',49.3],['android',58.9],['find-my',65.5],['sessions-after',77.9],['whatsapp',83.8],['reset-menu',89.2],['resetting',91.7],['verify-warning',98.6],['verify-activation',104.5],['end',110.8]]"
        text=text[:a]+'const samples='+rows+text[b:]
        text=text.replace('frameRange:[360,1049]','frameRange:[0,449]')
    if new=='finish_v3.py':
        text=text.replace("if preview:command+=['-ss','12']",'')
        text=text.replace("'23' if preview else '113'","'15' if preview else '113'")
    (V3/new).write_text(text,encoding='utf-8')
print('V3 source prepared: new locked-out hook, rewind, caption-free layout.')
