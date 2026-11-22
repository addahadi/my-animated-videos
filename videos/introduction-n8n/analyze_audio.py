import json, os, sys, wave, hashlib
from pathlib import Path
import av
import numpy as np
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding='utf-8')
root = Path(__file__).resolve().parent
out = root / 'analysis'
out.mkdir(exist_ok=True)
model = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=8, local_files_only=True)
all_rows=[]
offset=0
for source in sorted((root/'inputs').glob('*.ogg')):
    chunks=[]
    with av.open(str(source)) as c:
        rs=av.AudioResampler(format='s16', layout='mono', rate=48000)
        for frame in c.decode(audio=0):
            for f in rs.resample(frame): chunks.append(f.to_ndarray().reshape(-1))
        for f in rs.resample(None): chunks.append(f.to_ndarray().reshape(-1))
    data=np.concatenate(chunks)
    duration=len(data)/48000
    with wave.open(str(out/(source.stem+'.wav')),'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000); w.writeframes(data.tobytes())
    segments,info=model.transcribe(str(source),language='ar',beam_size=5,vad_filter=True,word_timestamps=True)
    rows=[]
    print(f'{source.name}: {duration:.3f}s, offset {offset:.3f}s',flush=True)
    for s in segments:
        row={'start':s.start,'end':s.end,'text':s.text,'words':[{'start':w.start,'end':w.end,'word':w.word} for w in s.words or []]}
        rows.append(row)
        print(f'[{offset+s.start:.2f} - {offset+s.end:.2f}] {s.text}',flush=True)
    all_rows.append({'file':source.name,'duration':duration,'samples':len(data),'offset':offset,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'segments':rows})
    offset+=duration
    (out/'transcript.json').write_text(json.dumps(all_rows,ensure_ascii=False,indent=2),encoding='utf-8')
print('Total duration:',offset,flush=True)
