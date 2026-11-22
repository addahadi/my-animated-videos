import wave,json
from pathlib import Path
import numpy as np
root=Path('C:/Users/hecin/ai-video-editor/projects/phone-slowdown-on-purpose')
def load(p):
    with wave.open(str(p)) as f:
        print(p.name,f.getparams());return np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').astype(np.float64)
a=load(root/'media/narration.wav');b=load(root/'analysis/encoded-narration.wav')
print('direct',np.corrcoef(a[:min(len(a),len(b))],b[:min(len(a),len(b))])[0,1])
n=524288;x=a[:200000];y=b[:200000]
c=np.fft.irfft(np.fft.rfft(y,n)*np.conj(np.fft.rfft(x,n)),n)
lags=list(range(-4000,4001));lag=max(lags,key=lambda l:c[l%n]);print('lag samples',lag,'seconds',lag/48000)
aa=a[max(0,-lag):];bb=b[max(0,lag):];m=min(len(aa),len(bb));print('aligned',np.corrcoef(aa[:m],bb[:m])[0,1])
