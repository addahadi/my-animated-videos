from pathlib import Path
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json, wave
import av
import numpy as np

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'analysis'
OUT.mkdir(exist_ok=True)
parts=[]
cursor=0
timeline=[]
for p in sorted((ROOT/'inputs').glob('audio*.ogg')):
    source=av.open(str(p))
    resampler=av.AudioResampler(format='s16',layout='mono',rate=48000)
    arrays=[]
    for frame in source.decode(audio=0):
        arrays.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(frame))
    arrays.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(None))
    pcm=np.concatenate(arrays)
    with wave.open(str(OUT/(p.stem+'.wav')),'wb') as w:
        w.setparams((1,2,48000,0,'NONE','not compressed'))
        w.writeframes(pcm.tobytes())
    timeline.append({'file':p.name,'start':cursor/48000,'end':(cursor+len(pcm))/48000,'samples':len(pcm)})
    parts.append(pcm)
    cursor+=len(pcm)
with wave.open(str(OUT/'narration.wav'),'wb') as w:
    w.setparams((1,2,48000,0,'NONE','not compressed'))
    w.writeframes(np.concatenate(parts).tobytes())
(OUT/'audio-timing.json').write_text(json.dumps({'samples':cursor,'duration':cursor/48000,'clips':timeline},indent=2),encoding='utf-8')
print(json.dumps(timeline,indent=2),flush=True)
if __name__=='__main__':
    from faster_whisper import WhisperModel
    model=WhisperModel('small',device='cpu',compute_type='int8',local_files_only=True,cpu_threads=6)
    result=[]
    for clip in timeline:
        cache=OUT/(Path(clip['file']).stem+'-transcript.json')
        if cache.exists():
            result.append(json.loads(cache.read_text(encoding='utf-8')))
            continue
        segments,info=model.transcribe(str(OUT/(Path(clip['file']).stem+'.wav')),language='ar',beam_size=3,word_timestamps=True,vad_filter=True)
        rows=[]
        for s in segments:
            row={'start':s.start,'end':s.end,'text':s.text,'words':[{'start':w.start,'end':w.end,'text':w.word} for w in (s.words or [])]}
            rows.append(row)
            print(clip['file'],round(s.start,2),round(s.end,2),s.text,flush=True)
        data={'file':clip['file'],'segments':rows}
        cache.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
        result.append(data)
    (OUT/'transcripts.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
