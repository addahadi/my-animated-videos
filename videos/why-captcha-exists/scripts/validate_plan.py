"""Check the saved storyboard timeline against the measured source recordings."""
import json
from pathlib import Path

project = Path(__file__).resolve().parents[1]
timeline = json.loads((project / 'plans/why-captcha-exists-timeline.json').read_text(encoding='utf-8'))
measurements = json.loads((project / 'analysis/audio-measurements.json').read_text(encoding='utf-8'))
script = (project / 'scripts/why-captcha-exists.md').read_text(encoding='utf-8')
script_rows = [line.split('|')[3].strip() for line in script.splitlines() if line.startswith(tuple(f'| {i} |' for i in range(1, 9)))]
fps = timeline['fps']
scenes = timeline['scenes']
assert len(scenes) == len(script_rows) == 8
assert scenes[0]['startFrame'] == 0
assert scenes[-1]['endFrame'] == timeline['durationFrames']
assert timeline['timing'] == 'MEASURED'
assert abs(timeline['audioDurationSec'] - measurements['totalDurationSec']) < 1e-9
assert 0 <= timeline['tailHoldSec'] < 1 / fps
assert sum(c['decodedSamples'] for c in measurements['clips']) == timeline['audio']['totalSamples']
events = set()
previous = 0
for scene, source_text, clip in zip(scenes, script_rows, measurements['clips']):
    assert scene['startFrame'] == previous, 'gap or overlap'
    assert scene['endFrame'] > scene['startFrame']
    assert abs(scene['startSec'] * fps - scene['startFrame']) < 1e-8
    assert abs(scene['endSec'] * fps - scene['endFrame']) < 1e-8
    assert scene['voiceover'] == source_text, 'script changed'
    assert scene['audioSource'] == clip['file']
    assert (project / clip['file']).is_file()
    for event in scene['props']['events']:
        assert scene['startFrame'] <= event['frame'] < scene['endFrame']
        assert event['frame'] == scene['startFrame'] + event['localFrame']
        events.add(event['frame'])
    previous = scene['endFrame']
ordered = sorted(events | {0, timeline['durationFrames']})
longest_gap = max(b-a for a,b in zip(ordered, ordered[1:])) / fps
assert longest_gap <= 6
overlays = [o for s in scenes for o in s['props'].get('overlays', []) if o['role'] == 'CTA']
assert len(overlays) == 1
assert overlays[0]['endFrame'] - overlays[0]['startFrame'] >= 60
save_start = scenes[6]['startFrame'] + 279
assert scenes[6]['endFrame'] - save_start >= 60
report = {'status': 'PASS', 'scenes': len(scenes), 'fps': fps, 'width': timeline['width'], 'height': timeline['height'], 'audioDurationSec': timeline['audioDurationSec'], 'pictureDurationSec': timeline['durationSec'], 'durationFrames': timeline['durationFrames'], 'tailHoldSec': round(timeline['tailHoldSec'], 6), 'longestPlannedVisualGapSec': round(longest_gap, 6), 'scriptPreserved': True, 'audioOrder': [c['file'] for c in timeline['audio']['clips']], 'explicitCTAs': len(overlays), 'saveFrameHoldSec': (scenes[6]['endFrame']-save_start)/fps, 'limitations': ['No animation has been rendered.', 'Visual event anchors and candidate narration differences require review by ear.', 'Planned safe zones and typography require inspection of rendered frames.']}
(project / 'analysis/plan-validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
