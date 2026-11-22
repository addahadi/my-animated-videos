from pathlib import Path
import numpy as np
import imageio_ffmpeg,subprocess,wave
root=Path('C:/Users/hecin/ai-video-editor/projects/introduction-n8n')
with wave.open(str(root/'media/narration.wav'),'rb') as w:a=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float64)
p=subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-i',str(root/'exports/introduction-n8n-instagram.mp4'),'-vn','-ar','48000','-ac','1','-f','s16le','-'],capture_output=True,check=True)
b=np.frombuffer(p.stdout,dtype='<i2').astype(np.float64)
print('lengths',len(a),len(b),'rms',np.sqrt(np.mean(a*a)),np.sqrt(np.mean(b*b)))
for sec in [1,8,15,27,36,50,65,82,92]:
    start=sec*48000;n=24000;pad=12000
    x=a[start:start+n];y=b[start-pad:start+n+pad]
    nf=1<<((len(y)+len(x)-1).bit_length())
    z=np.fft.irfft(np.fft.rfft(y,nf)*np.fft.rfft(x[::-1],nf),nf)
    corr=z[n-1:len(y)]
    lag=int(np.argmax(corr))-pad
    match=b[start+lag:start+lag+n]
    print(sec,'lag samples',lag,'lag ms',lag/48,'correlation',np.corrcoef(x,match)[0,1])
