from pathlib import Path
p=Path(__file__).resolve().parent/'production-stage/PhoneSlowdown.tsx'
s=p.read_text(encoding='utf-8')
s=s.replace('<T x={712} y={838} w={220} size={42}>القدرة على\\nتوصيل الطاقة</T>', '<T x={712} y={838} w={225} size={37}>توصيل الطاقة</T>')
s=s.replace('<T x={260} y={730} w={220} size={40}>بطارية ضعيفة</T>','<T x={260} y={720} w={285} size={38}>بطارية ضعيفة</T>')
s=s.replace('<T x={250} y={1210} w={200} size={39}>تليفون ثقيل</T>','<T x={250} y={1200} w={270} size={38}>تليفون ثقيل</T>')
s=s.replace('<T x={715} y={1210} w={245} size={39}>باش تشري جديد</T>','<T x={715} y={1200} w={280} size={38}>باش تشري جديد</T>')
s=s.replace('<Box x={225} y={1250} w={550} h={140} fill={C.ice} stroke={C.blue}/><Icon kind="check" x={300} y={1320}/><T x={550} y={1294} w={400} size={47}>أبطأ، بصح يبقى شاعل</T>', '<Phone x={150} y={1150} w={145}><rect x={22} y={85} width={356} height={600} rx={18} fill={C.blue}/><Icon kind="camera" x={200} y={330} s={3} color={C.white}/><Icon kind="check" x={200} y={520} s={2} color={C.white}/></Phone><T x={610} y={1260} w={480} size={52}>أبطأ، بصح يبقى شاعل</T>')
p.write_text(s,encoding='utf-8')
