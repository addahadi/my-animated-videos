from pathlib import Path
import json,wave
import av
import numpy as np
ROOT=Path(__file__).resolve().parent
path=ROOT/'exports/v4/selling-a-phone-v4.mp4'
container=av.open(str(path))
video=container.streams.video[0]
audio=container.streams.audio[0]
info={'path':str(path),'bytes':path.stat().st_size,'video_codec':video.codec_context.name,'audio_codec':audio.codec_context.name,'width':video.width,'height':video.height,'fps':float(video.average_rate),'pixel_format':video.codec_context.format.name,'duration':float(container.duration/av.time_base)}
frames=0
pcm=[]
resampler=av.AudioResampler(format='fltp',layout='mono',rate=48000)
for frame in container.decode(video=0,audio=0):
    if isinstance(frame,av.VideoFrame):frames+=1
    else:pcm.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(frame))
pcm.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(None))
decoded=np.concatenate(pcm)
with wave.open(str(ROOT/'media/narration.wav'),'rb') as w:
    source=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
timeline=json.loads((ROOT/'media/timeline-v2.json').read_text(encoding='utf-8'))
checks=[]
for clip in timeline['segments']:
    start=int((clip['start']+.6)*48000)
    count=min(96000,int((clip['end']-clip['start']-1.2)*48000))
    expected=source[start:start+count]
    actual=decoded[start:start+count]
    checks.append({'file':clip['file'],'start':clip['start'],'correlation':float(np.corrcoef(expected,actual)[0,1])})
info.update({'frames':frames,'audio_samples':len(decoded),'source_samples':len(source),'peak_dbfs':float(20*np.log10(np.max(np.abs(decoded)))),'narration_clips':checks,'decode_errors':0,'audio_gain':.9,'picture_hold_seconds':113-len(source)/48000,'overall_source_correlation':float(np.corrcoef(source,decoded[:len(source)])[0,1])})
info['passed']=all([info['width']==1080,info['height']==1920,info['fps']==30,frames==timeline['durationInFrames'],info['video_codec']=='h264',info['audio_codec']=='aac',info['pixel_format']=='yuv420p',all(c['correlation']>.97 for c in checks),info['overall_source_correlation']>.97,abs(info['duration']-113)<.1,np.max(np.abs(decoded))<1])
(ROOT/'exports/v4/validation.json').write_text(json.dumps(info,indent=2),encoding='utf-8')
print(json.dumps(info,indent=2))
assert info['passed'],'Final video/audio validation failed'
