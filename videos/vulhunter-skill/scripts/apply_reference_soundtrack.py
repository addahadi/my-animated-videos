"""Mix the actual user-supplied Reel soundtrack with the approved narration.

Reuses the encoded picture without rerendering. Keeps earlier versions for review.
"""
import hashlib
import json
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import av
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[1]
WORKSPACE=ROOT.parents[1]
FFMPEG=WORKSPACE/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
RATE=48000
PUBLIC=ROOT/'public/audio'
OUTPUT=ROOT/'output'
SOURCE=ROOT/'inputs/post2.mp4'

def run(*args):
    subprocess.run([str(FFMPEG),'-hide_banner','-loglevel','error','-y',*map(str,args)],check=True)

def decode(path, channels):
    chunks=[]
    resampler=av.AudioResampler(format='fltp',layout='mono' if channels==1 else 'stereo',rate=RATE)
    with av.open(str(path)) as container:
        for frame in container.decode(audio=0):
            chunks.extend(x.to_ndarray().T for x in resampler.resample(frame))
        chunks.extend(x.to_ndarray().T for x in resampler.resample(None))
    return np.concatenate(chunks).astype(np.float32)

def wav(path, data):
    with wave.open(str(path),'wb') as target:
        target.setnchannels(data.shape[1])
        target.setsampwidth(2)
        target.setframerate(RATE)
        target.writeframes(np.round(np.clip(data,-1,1)*32767).astype('<i2').tobytes())

# Preserve the exact encoded reference audio as a reusable extracted asset.
extracted=PUBLIC/'reference-soundtrack.m4a'
run('-i',SOURCE,'-map','0:a:0','-vn','-c:a','copy','-f','mp4',extracted)
reference=decode(extracted,2)
voice=decode(PUBLIC/'narration-reordered.wav',1)
previous=json.loads((ROOT/'analysis/audio-production-v2.json').read_text(encoding='utf-8'))
count=len(voice)
voice_gain=previous['voice_gain']
voice=voice*voice_gain

# The reference has a 120 BPM pulse. Repeat its first complete 18 bars (36 s)
# at the original tempo; tiny fades prevent a click at each repeat boundary.
loop_samples=min(36*RATE,len(reference))
cycle=reference[:loop_samples].copy()
edge=int(.006*RATE)
cycle[:edge]*=np.linspace(0,1,edge)[:,None]
cycle[-edge:]*=np.linspace(1,0,edge)[:,None]
music=np.tile(cycle,((count+loop_samples-1)//loop_samples,1))[:count].copy()

# Make the actual music audible while leaving the voice dominant.
hop=960
buffer=np.pad(voice[:,0],(0,(-count)%hop))
levels=np.sqrt(np.mean(buffer.reshape(-1,hop)**2,axis=1))
active=levels>max(.008,float(np.percentile(levels,65))*.2)
voice_rms=float(np.sqrt(np.mean(voice[:,0][np.repeat(active,hop)[:count]]**2)))
duck_points=np.where(active,.78,1.0)
for index in range(1,len(duck_points)):
    duck_points[index]=.88*duck_points[index-1]+.12*duck_points[index]
duck=np.interp(np.arange(count),np.arange(len(duck_points))*hop,duck_points)
music*=duck[:,None]
music_gain=voice_rms*10**(-14/20)/max(float(np.sqrt(np.mean(music**2))),1e-9)
music*=music_gain
clock=np.arange(count)/RATE
music*=(np.clip(clock/.25,0,1)*np.clip((count/RATE-clock)/1.3,0,1))[:,None]
sfx=decode(PUBLIC/'sfx-v2.wav',2)[:count]
mixed=voice+music+sfx
master_gain=min(1.0,.91/max(float(np.max(np.abs(mixed))),1e-9))
mixed*=master_gain
wav(PUBLIC/'music-reference.wav',music)
wav(PUBLIC/'soundtrack-reference.wav',mixed)

audio_output=OUTPUT/'soundtrack-reference.m4a'
with av.open(str(audio_output),'w') as container:
    stream=container.add_stream('aac',rate=RATE)
    stream.layout='stereo'
    stream.bit_rate=256000
    for first in range(0,count,1024):
        frame=av.AudioFrame.from_ndarray(np.ascontiguousarray(mixed[first:first+1024].T),format='fltp',layout='stereo')
        frame.sample_rate=RATE
        frame.pts=first
        for packet in stream.encode(frame):
            container.mux(packet)
    for packet in stream.encode(None):
        container.mux(packet)
final=OUTPUT/'vulnhunter-instagram.mp4'
backup=OUTPUT/'vulnhunter-instagram-v2.mp4'
if final.exists() and not backup.exists():
    shutil.copy2(final,backup)
run('-i',OUTPUT/'vulnhunter-picture.mp4','-i',audio_output,'-map','0:v:0','-map','1:a:0',
    '-c','copy','-t',2105/30,'-movflags','+faststart',OUTPUT/'vulnhunter-instagram-reference-music.mp4')
shutil.copy2(OUTPUT/'vulnhunter-instagram-reference-music.mp4',final)
run('-i',OUTPUT/'preview-v2-synced.mp4','-i',audio_output,'-map','0:v:0','-map','1:a:0',
    '-c','copy','-t',18,'-movflags','+faststart',OUTPUT/'preview-reference-music.mp4')

# Verify exact extraction and encoded mix, including all six complete sections.
source_audio=decode(SOURCE,2)
assert source_audio.shape==reference.shape
assert np.array_equal(source_audio,reference), 'Reference extraction changed decoded samples'
final_audio=decode(final,2)
assert len(final_audio)>=count
checks=[]
for clip in previous['clips']:
    first=clip['start_sample']
    end=first+clip['samples']
    mix_corr=float(np.corrcoef(mixed[first:end].mean(axis=1),final_audio[first:end].mean(axis=1))[0,1])
    voice_corr=float(np.corrcoef(voice[first:end,0],final_audio[first:end].mean(axis=1))[0,1])
    assert mix_corr>.99 and voice_corr>.94,(clip['file'],mix_corr,voice_corr)
    checks.append({'file':clip['file'],'mixed_correlation':mix_corr,'voice_correlation':voice_corr})
assert float(np.max(np.abs(final_audio)))<1
report={**previous,'status':'Actual post2.mp4 soundtrack applied at user request',
        'music':'Exact AAC soundtrack extracted from inputs/post2.mp4, looped at original tempo; replaces generated music.',
        'music_source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        'reference_extraction_sample_identical':True,'reference_duration':len(reference)/RATE,
        'music_loop_seconds':loop_samples/RATE,'music_gain':music_gain,'voice_gain':voice_gain,
        'master_gain':master_gain,'mixed_peak':float(np.max(np.abs(mixed))),
        'decoded_peak':float(np.max(np.abs(final_audio))),'voice_rms':voice_rms,
        'music_rms':float(np.sqrt(np.mean(music**2))),'checks':checks,
        'notes':'All narration and existing animation preserved. Actual supplied music at audible level with voice ducking. Prior final saved as vulnhunter-instagram-v2.mp4.'}
(ROOT/'analysis/audio-production-reference.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'output':str(final),'checks':checks,'music_gain':music_gain,'peak':report['decoded_peak']},indent=2))
