"""Verify this video's format, final image, and every full narration section."""
import json
import hashlib
import sys
from pathlib import Path

import av
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
root=Path(__file__).resolve().parents[1]
preview='--preview' in sys.argv
path=root/'output'/('preview-reference-music.mp4' if preview else 'vulnhunter-instagram.mp4')
expected_frames=540 if preview else 2105
timing=json.loads((root/'analysis'/'audio-production-reference.json').read_text(encoding='utf-8'))

def mono(path):
    chunks=[]
    resampler=av.AudioResampler(format='fltp',layout='mono',rate=48000)
    with av.open(str(path)) as container:
        for frame in container.decode(audio=0):
            chunks.extend(x.to_ndarray()[0] for x in resampler.resample(frame))
        chunks.extend(x.to_ndarray()[0] for x in resampler.resample(None))
    return np.concatenate(chunks)

with av.open(str(path)) as container:
    video=container.streams.video[0]
    sound=container.streams.audio[0]
    result={'file':str(path),'width':video.width,'height':video.height,'fps':float(video.average_rate),
            'frames':video.frames,'video_codec':video.codec_context.name,
            'audio_codec':sound.codec_context.name,'pixel_format':video.format.name,
            'duration':float(container.duration/av.time_base)}
assert result['width']==(540 if preview else 1080) and result['height']==(960 if preview else 1920), result
assert result['fps']==30 and result['frames']==expected_frames, result
assert result['video_codec']=='h264' and result['audio_codec']=='aac', result
assert abs(result['duration']-expected_frames/30)<0.08, result

audio=mono(path)
reference=mono(root/'public'/'audio'/'soundtrack-reference.wav')
raw=mono(root/'public'/'audio'/'narration-reordered.wav')
assert len(audio)>=min(len(reference),expected_frames*1600)-1024
result['narration_order']=[x['file'] for x in timing['clips']]
result['audio_checks']=[]
for clip in timing['clips']:
    first=clip['start_sample']
    end=min(first+clip['samples'],len(audio),len(reference))
    if first>=end:
        continue
    mixed_corr=float(np.corrcoef(reference[first:end],audio[first:end])[0,1])
    voice_corr=float(np.corrcoef(raw[first:end],audio[first:end])[0,1])
    result['audio_checks'].append({'file':clip['file'],'mixed_correlation':mixed_corr,'voice_correlation':voice_corr})
    assert mixed_corr>0.98 and voice_corr>0.94, result['audio_checks'][-1]
with av.open(str(path)) as container:
    # Inspect native AAC channels; an equal-power stereo-to-mono conversion
    # raises correlated channels by sqrt(2) and is unsuitable for peak checks.
    result['decoded_audio_peak']=max(float(np.max(np.abs(frame.to_ndarray()))) for frame in container.decode(audio=0))
assert result['decoded_audio_peak']<1

result['visual_sample_checks']=[]
for at in ([3,5,7,14,17.9] if preview else [3,14,26,36,47,57,65,70.10]):
    with av.open(str(path)) as container:
        stream=container.streams.video[0]
        container.seek(int(at/stream.time_base),stream=stream,backward=True)
        for frame in container.decode(video=0):
            if float(frame.time)>=at:
                gray=frame.to_ndarray(format='gray')
                deviation=float(gray.std())
                assert deviation>10, (at,deviation)
                result['visual_sample_checks'].append({'time':float(frame.time),'luma_std':deviation})
                break
        else:
            raise AssertionError(f'No frame at {at}')
result['passed']=True
if not preview:
    def picture_hash(video_path):
        digest=hashlib.sha256()
        with av.open(str(video_path)) as container:
            for packet in container.demux(video=0):
                if packet.size:
                    digest.update(bytes(packet))
        return digest.hexdigest()
    result['picture_unchanged']=picture_hash(path)==picture_hash(root/'output'/'vulnhunter-picture.mp4')
    assert result['picture_unchanged']
result['music_source']='inputs/post2.mp4 — actual extracted soundtrack, looped under the narration'
result['limits']='Format, full-section audio correlation, and image statistics. Human listening review remains necessary; frames were also inspected separately.'
(root/'output'/('validation-preview.json' if preview else 'validation.json')).write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
