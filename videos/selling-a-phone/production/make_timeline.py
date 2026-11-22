from pathlib import Path
import json, math
ROOT=Path(__file__).resolve().parent
timing=json.loads((ROOT/'analysis/audio-timing.json').read_text(encoding='utf-8'))
# Semantic boundaries checked against local recognition; supplied script controls labels.
groups=[
 (0,'قبل البيع',[(0,'hook','7 حوايج قبل ما تبيع','7'),(3.32,'risk','تحمي حساباتك والداتا تاعك','حساباتك'),(7.26,'hook','يلا نبدأو بأول خطوة','أول')]),
 (1,'النسخة الاحتياطية',[(0,'backup','دير نسخة احتياطية','احتياطية'),(2.78,'files','التصاور والملفات والمحادثات','المحادثات'),(5.96,'backup','Google Drive ولا iCloud','iCloud'),(8.1,'pc','ولا انقلهم للـ PC','PC'),(10.28,'backup-check','تأكد تقدر ترجع ملفاتك','ترجع')]),
 (2,'أكواد التحقق',[(0,'auth-focus','الثانية بزاف ناس ينساوها','الثانية'),(2.22,'auth-focus','تستعمل Google Authenticator؟','Authenticator؟'),(3.84,'auth-transfer','انقل الأكواد للتليفون الجديد','الأكواد'),(6.1,'auth-lock','حماية إضافية لحساباتك','حماية'),(10.56,'auth-risk','ما تخسرش الدخول لحساباتك','الدخول'),(14.28,'auth-next','موضوع 2FA في فيديو وحدو','2FA')]),
 (3,'الأجهزة المرتبطة',[(0,'watch','افصل الساعة من التليفون','الساعة'),(5.24,'bluetooth','ونحّي ربط أجهزة Bluetooth','Bluetooth')]),
 (4,'Google / Apple',[(0,'account','رابع حاجة مهمة بزاف','مهمة'),(1.99,'account-remove','Android: نحّي حساب Google','Google'),(5.85,'account-remove','iPhone: اخرج من Apple Account','Apple Account'),(9.53,'account-remove','وعطّل Find My بالطريقة الصحيحة','Find My')]),
 (5,'التطبيقات الحساسة',[(0,'sensitive','التطبيقات الحساسة','الحساسة'),(1.98,'sensitive','حساباتك وتطبيقات المراسلة','حساباتك'),(4.84,'sensitive','دير déconnexion وين لازم','déconnexion'),(6.48,'sessions','ادخل لإعدادات الأمان','الأمان'),(9.58,'sessions','نحّي التليفون القديم','القديم'),(12.72,'whatsapp','انقل WhatsApp قبل الفورماط','WhatsApp')]),
 (6,'الفورماط',[(0,'ready-reset','درك فقط نروحو للفورماط','درك فقط'),(2.32,'reset-menu','Settings ثم Factory Reset','Factory Reset'),(5.9,'resetting','خليه يكمل العملية','يكمل')]),
 (7,'التحقق الأخير',[(0,'welcome','تأكد من شاشة البداية','البداية'),(3.52,'welcome','شاشة اختيار اللغة','اللغة'),(5.02,'welcome-warning','هاذ الشاشة وحدها ما تكفيش','ما تكفيش'),(6.74,'verify-account','تأكد الحساب القديم مفصول','مفصول'),(10.16,'verify-account','وما يطلبوش وقت التفعيل','التفعيل')]),
 (8,'جاهز للبيع',[(0,'handover','هكذا تسلّمو للشاري','للشاري'),(2.22,'save','دير Save باش ما تنساش','Save')]),
]
segments=[]
for index,(clip,(step,name,cues)) in enumerate(zip(timing['clips'],groups)):
    end=clip['end']+(.8 if index==8 else 0)
    span=end-clip['start']
    rows=[{'at':at,'until':cues[i+1][0] if i+1<len(cues) else span,'art':art,'text':text,'accent':accent} for i,(at,art,text,accent) in enumerate(cues)]
    segments.append({**clip,'end':end,'step':step,'name':name,'cues':rows})
data={'durationInFrames':math.ceil((timing['duration']+.8)*30),'audioDuration':timing['duration'],'segments':segments}
(ROOT/'media/timeline.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print('Timeline:',data['durationInFrames'],'frames')
