import sys
import json
from pathlib import Path
import av
import numpy as np
root=Path(__file__).resolve().parents[1]
def read(path):
    out=[]
    res=av.AudioResampler(format='fltp',layout='mono',rate=48000)
    with av.open(str(path)) as container:
        print(path.name,[(s.type,s.start_time,str(s.time_base),s.duration) for s in container.streams])
        for f in container.decode(audio=0):
            out.extend(x.to_ndarray()[0] for x in res.resample(f))
        out.extend(x.to_ndarray()[0] for x in res.resample(None))
    return np.concatenate(out)
a=read(root/'public/audio/soundtrack-v2.wav')
b=read(root/'output/preview-v2.mp4')
start=2*48000
size=2*48000
parta=a[start:start+size]
partb=b[start:start+size]
cross=np.correlate(partb[::16],parta[::16],'full')
lag=(int(np.argmax(cross))-(len(parta[::16])-1))*16
best=[]
for delta in range(lag-24,lag+25):
    corr=float(np.corrcoef(parta,b[start+delta:start+delta+size])[0,1])
    best.append((corr,delta))
print('LENGTHS',len(a),len(b),'RMS',np.sqrt(np.mean(a*a)),np.sqrt(np.mean(b*b)))
print('BEST',sorted(best,reverse=True)[:6])
