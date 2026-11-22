from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parent
V3=ROOT/'production-v3'
V4=ROOT/'production-v4'
(V4/'src-v4').mkdir(parents=True,exist_ok=True)
before=V3/'src-v3/SellingPhoneV3.tsx'
live=Path('C:/Users/hecin/ai-video-editor/projects/selling-a-phone/src-v3/SellingPhoneV3.tsx')
assert hashlib.sha256(before.read_bytes()).digest()==hashlib.sha256(live.read_bytes()).digest()
source=before.read_text(encoding='utf-8').replace('SellingPhoneV3','SellingPhoneV4')
start=source.index('const Intro:React.FC')
end=source.index('const Backup:React.FC',start)
source=source[:start]+(V4/'hook-source.tsx.txt').read_text(encoding='utf-8')+source[end:]
source=source.replace("s.step===0&&t>=7.26?'قبل الفورماط':s.name","s.name")
(V4/'src-v4/SellingPhoneV4.tsx').write_text(source,encoding='utf-8')
for old,new in [('src-v3/index.tsx','src-v4/index.tsx'),('production-v3.cjs','production-v4.cjs'),('verify_v3.py','verify_v4.py')]:
    text=(V3/old).read_text(encoding='utf-8').replace('SellingPhoneV3','SellingPhoneV4').replace('v3','v4')
    if new=='production-v4.cjs':
        a=text.index('const samples=');b=text.index(';',a)
        rows="[['hook-start',.2],['hook-approach',1.6],['hook-pause',2.9],['hook-warning',4.3],['hook-seven',6.0],['hook-return',8.1],['hook-prepared',9.5],['backup-copy',14.2],['backup-open',23.3],['auth-transfer',30.3],['login',35.6],['watch-after',49.3],['android',58.9],['find-my',65.5],['sessions-after',77.9],['whatsapp',83.8],['reset-menu',89.2],['resetting',91.7],['verify-activation',104.5],['end',110.8]]"
        text=text[:a]+'const samples='+rows+text[b:]
        text=text.replace("outputLocation:path.join(out,'render-source.mp4')","outputLocation:path.join(out,'render-hook.mp4'),frameRange:[0,289]")
        text=text.replace('for(const [name,time] of samples){','for(const [name,time] of samples.filter(([name])=>process.argv.length<4||process.argv.slice(3).includes(name))){')
        text=text.replace('`draft-${name}.png`','`${process.argv.length>3?\'review\':\'draft\'}-${name}.png`')
    (V4/new).write_text(text,encoding='utf-8')
print('V4 prepared: interrupted seller-to-buyer handover; body functions preserved.')
