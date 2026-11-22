"""Prepare, install, render and verify the isolated CAPTCHA production.

All external writes are confined to the user-selected production project,
except the explicitly named daily tool-check note. No existing video is edited.
"""
from pathlib import Path
import argparse
import hashlib
import json
import math
import shutil
import subprocess
import sys
import wave
import imageio_ffmpeg

sys.stdout.reconfigure(encoding='utf-8')
LOCAL = Path(__file__).resolve().parent
WORKSPACE = LOCAL.parents[1]
STAGE = LOCAL / 'production-stage'
PRODUCTION_ROOT = Path('C:/Users/hecin/ai-video-editor').resolve()
PROJECT = (PRODUCTION_ROOT / 'projects/why-captcha-exists').resolve()
assert PROJECT.parent == PRODUCTION_ROOT / 'projects'
FFMPEG = Path(imageio_ffmpeg.get_ffmpeg_exe())
FFPROBE = WORKSPACE / 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'
NODE = shutil.which('node')

def run(args, cwd=None, capture=False):
    result = subprocess.run([str(x) for x in args], cwd=cwd, check=True, capture_output=capture)
    return result.stdout if capture else result

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def prepare():
    for part in ['media/audio', 'media/fonts', 'inputs', 'plans', 'analysis']:
        (STAGE / part).mkdir(parents=True, exist_ok=True)
    shutil.copy2(LOCAL / 'plans/why-captcha-exists-timeline.json', STAGE / 'src/timeline.json')
    shutil.copy2(LOCAL / 'scripts/why-captcha-exists.md', STAGE / 'plans/script.md')
    shutil.copy2(WORKSPACE / 'plans/style.md', STAGE / 'plans/style.md')
    for file in (LOCAL / 'plans').glob('*'):
        if file.is_file():
            shutil.copy2(file, STAGE / 'plans' / file.name)
    chunks, clips, offset = [], [], 0
    for i in range(1, 9):
        source = LOCAL / 'inputs' / f'audio{i}.ogg'
        shutil.copy2(source, STAGE / 'inputs' / source.name)
        raw = run([FFMPEG, '-v', 'error', '-i', source, '-ar', '48000', '-ac', '1', '-f', 's16le', 'pipe:1'], capture=True)
        count = len(raw) // 2
        chunks.append(raw)
        clips.append({'file': source.name, 'sha256': digest(source), 'startSample': offset, 'samples': count, 'endSample': offset + count})
        offset += count
    assert offset == 4592640
    destination = STAGE / 'media/audio/narration.wav'
    with wave.open(str(destination), 'wb') as output:
        output.setparams((1, 2, 48000, 0, 'NONE', 'not compressed'))
        output.writeframes(b''.join(chunks))
    for name in ['Arabic.ttf', 'Latin.ttf', 'OFL-Arabic.txt', 'OFL-Latin.txt']:
        shutil.copy2(WORKSPACE / 'videos/vulhunter-skill/public/fonts' / name, STAGE / 'media/fonts' / name)
    audio_report = {'sampleRate': 48000, 'channels': 1, 'samples': offset, 'durationSec': offset / 48000, 'processing': 'Decode to PCM16 and concatenate in numeric order; no trimming, reordering, time-stretch, normalization or added music.', 'clips': clips, 'narrationSha256': digest(destination)}
    (STAGE / 'analysis/audio-assembly.json').write_text(json.dumps(audio_report, indent=2), encoding='utf-8')
    (STAGE / 'package.json').write_text(json.dumps({'name': 'why-captcha-exists', 'private': True, 'scripts': {'review': 'node render.cjs review', 'render': 'node render.cjs final'}, 'description': 'Uses the existing motion/node_modules through a local directory junction; no dependency installation.'}, indent=2), encoding='utf-8')
    print(json.dumps({'prepared': str(STAGE), 'audioSeconds': offset / 48000, 'sourceClips': len(clips)}), flush=True)

def install():
    if PROJECT.exists() and not (PROJECT / 'production-manifest.json').exists():
        raise RuntimeError('Refusing to overwrite an existing project without this production manifest')
    PROJECT.mkdir(parents=True, exist_ok=True)
    for source in STAGE.rglob('*'):
        if source.is_file():
            target = PROJECT / source.relative_to(STAGE)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
    dependencies = PROJECT / 'node_modules'
    if not dependencies.exists():
        dependency_source = PRODUCTION_ROOT / 'motion/node_modules'
        command = "New-Item -ItemType Junction -Path '" + str(dependencies).replace("'", "''") + "' -Value '" + str(dependency_source).replace("'", "''") + "'"
        run(['powershell.exe', '-NoProfile', '-Command', command])
    (PROJECT / 'exports').mkdir(exist_ok=True)
    (PROJECT / 'production-manifest.json').write_text(json.dumps({'project': str(PROJECT), 'sourceStage': str(STAGE), 'entryPoint': 'src/index.tsx', 'composition': 'WhyCaptchaExists', 'productionTool': 'Remotion 4.0.530', 'sourceAudio': 'inputs/audio1.ogg through audio8.ogg', 'outputs': 'exports/', 'noExistingCompositionsModified': True}, indent=2), encoding='utf-8')
    # This project has its own tsconfig. Never run the root placeholder tests.
    run([NODE, WORKSPACE / 'node_modules/typescript/bin/tsc', '--project', PROJECT / 'tsconfig.json', '--noEmit', '--typeRoots', WORKSPACE / 'node_modules/@types'], cwd=PROJECT)
    print('Installed and type checked: ' + str(PROJECT), flush=True)

def contact_sheet():
    from PIL import Image, ImageDraw, ImageFont
    sources = sorted((PROJECT / 'exports/stills').glob('frame-*.png'))
    width, height, gap = 270, 480, 18
    sheet = Image.new('RGB', (5 * (width + gap) + gap, math.ceil(len(sources)/5) * (height + 52 + gap) + gap), '#101015')
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 20)
    except OSError:
        font = ImageFont.load_default()
    for i, source in enumerate(sources):
        frame = int(source.stem.split('-')[1])
        img = Image.open(source).convert('RGB').resize((width, height))
        x = gap + (i % 5) * (width + gap)
        y = gap + (i // 5) * (height + 52 + gap)
        sheet.paste(img, (x, y))
        draw.text((x + 8, y + height + 12), f'{frame/30:.2f}s / frame {frame}', fill='#F5F3ED', font=font)
    sheet.save(PROJECT / 'exports/contact-sheet.jpg', quality=94)
    cover = PROJECT / 'exports/stills/frame-0225.png'
    if cover.exists():
        shutil.copy2(cover, PROJECT / 'exports/cover.png')
    print('Contact sheet ready', flush=True)

def review():
    run([NODE, PROJECT / 'render.cjs', 'review'], cwd=PROJECT)
    contact_sheet()

def render_final():
    run([NODE, PROJECT / 'render.cjs', 'final'], cwd=PROJECT)

def conform():
    final = (PROJECT / 'exports/why-captcha-exists.mp4').resolve()
    source = (PROJECT / 'exports/why-captcha-exists-remotion.mp4').resolve()
    assert final.parent == source.parent == PROJECT / 'exports'
    if not source.exists():
        shutil.copy2(final, source)
    # Normalize picture once. Mux the original continuous PCM directly so the
    # browser renderer's audio padding/resampling cannot shift the narration.
    picture = PROJECT / 'exports/why-captcha-exists-picture.mp4'
    metadata = json.loads(run([FFPROBE, '-v', 'error', '-show_streams', '-of', 'json', final], capture=True))
    stream = next(s for s in metadata['streams'] if s['codec_type'] == 'video')
    if stream['pix_fmt'] == 'yuv420p':
        run([FFMPEG, '-v', 'error', '-y', '-i', final, '-an', '-c:v', 'copy', picture])
    else:
        run([FFMPEG, '-v', 'error', '-y', '-i', source, '-an', '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_trc', 'bt709', '-color_primaries', 'bt709', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '4', picture])
    run([FFMPEG, '-v', 'error', '-y', '-i', picture, '-i', PROJECT / 'media/audio/narration.wav', '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', '95.7', '-movflags', '+faststart', final])
    print('MP4 conformance complete: limited-range yuv420p, 95.700 s picture, full narration preserved.', flush=True)

def verify():
    import numpy as np
    final = PROJECT / 'exports/why-captcha-exists.mp4'
    data = json.loads(run([FFPROBE, '-v', 'error', '-show_format', '-show_streams', '-of', 'json', final], capture=True))
    video = next(s for s in data['streams'] if s['codec_type'] == 'video')
    audio = next(s for s in data['streams'] if s['codec_type'] == 'audio')
    assert (video['width'], video['height']) == (1080, 1920)
    assert video['codec_name'] == 'h264' and video['pix_fmt'] == 'yuv420p'
    assert video['r_frame_rate'] == '30/1' and int(video['nb_frames']) == 2871
    assert abs(float(video['duration']) - 95.7) < .034
    assert audio['codec_name'] == 'aac'
    assert float(audio['duration']) >= 95.68 - .025
    decoded = run([FFMPEG, '-v', 'error', '-i', final, '-vn', '-ac', '1', '-ar', '48000', '-f', 's16le', 'pipe:1'], capture=True)
    actual = np.frombuffer(decoded, dtype='<i2').astype(np.float64)
    assembly = json.loads((PROJECT / 'analysis/audio-assembly.json').read_text(encoding='utf-8'))
    with wave.open(str(PROJECT / 'media/audio/narration.wav'), 'rb') as inp:
        expected = np.frombuffer(inp.readframes(inp.getnframes()), dtype='<i2').astype(np.float64)
    results = []
    for clip in assembly['clips']:
        i, j = clip['startSample'], clip['endSample']
        # AAC is lossy; waveform correlation tests content, ordering and placement.
        count = min(j-i, len(actual)-i)
        correlation = float(np.corrcoef(expected[i:i+count], actual[i:i+count])[0, 1])
        assert correlation > .97, (clip['file'], correlation)
        assert digest(PROJECT / 'inputs' / clip['file']) == clip['sha256']
        results.append({'file': clip['file'], 'correlation': round(correlation, 6), 'sourceHashMatches': True})
    run([FFMPEG, '-v', 'error', '-i', final, '-f', 'null', '-'])
    report = {'status': 'PASS', 'width': 1080, 'height': 1920, 'fps': 30, 'frames': 2871, 'videoDurationSec': 95.7, 'narrationDurationSec': 95.68, 'videoCodec': video['codec_name'], 'pixelFormat': video['pix_fmt'], 'audioCodec': audio['codec_name'], 'audioChecks': results, 'fullDecode': 'PASS', 'notes': ['All eight source recordings preserved in numeric order.', 'No music, external footage, publishing, Concat or Natron used.', 'Direct still-frame review performed; video-perception MCP was unavailable.']}
    (PROJECT / 'analysis/final-validation.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report, indent=2), flush=True)

def tool_check():
    from urllib.request import Request, urlopen
    from datetime import datetime, timezone, timedelta
    from concurrent.futures import ThreadPoolExecutor
    urls = {'Remotion': 'https://registry.npmjs.org/remotion/latest', 'Graphify': 'https://pypi.org/pypi/graphifyy/json', 'Concat': 'https://api.github.com/repos/jub0t/Concat/releases/latest'}
    def fetch(item):
        name, url = item
        try:
            request = Request(url, headers={'User-Agent': 'Local-video-workspace-free-version-check', 'Accept': 'application/json'})
            with urlopen(request, timeout=12) as response:
                payload = json.load(response)
            version = payload['version'] if name == 'Remotion' else payload['info']['version'] if name == 'Graphify' else payload['tag_name']
            return name, {'version': version, 'source': url}
        except Exception as exc:
            return name, {'version': 'unavailable', 'source': url, 'error': str(exc)}
    results = dict(ThreadPoolExecutor(max_workers=3).map(fetch, urls.items()))
    installed = json.loads((PRODUCTION_ROOT / 'motion/node_modules/remotion/package.json').read_text(encoding='utf-8'))['version']
    date = datetime.now(timezone(timedelta(hours=1))).date().isoformat()
    note = f'# Daily free tool check — {date} (Africa/Algiers)\n\n'
    note += f'- Remotion installed in motion/: {installed}. Official registry latest: {results["Remotion"]["version"]}. Source: {urls["Remotion"]}.\n'
    note += f'- Graphify: CLI reused via the existing project-local graphify_workflow.py runtime, not on PATH. Official registry latest: {results["Graphify"]["version"]}. Source: {urls["Graphify"]}.\n'
    note += f'- Concat: not used for CAPTCHA production. Latest official release: {results["Concat"]["version"]}. Installed/submodule comparison remains unverified. Source: {urls["Concat"]}.\n'
    for name, result in results.items():
        if 'error' in result:
            note += f'- Failed {name} check: {result["error"]}.\n'
    note += '\nFree official endpoints only. No upgrades, subscriptions, monitors, dependency installs or pin changes performed. CAPTCHA uses the existing Remotion installation. The initial web viewer could not fetch npm (403) or the GitHub API; direct official JSON results above are the final attempt.\n'
    destination = PRODUCTION_ROOT / 'workspace-data/tool-update-checks/latest.md'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(note, encoding='utf-8')
    (PROJECT / 'analysis/tool-update-check.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    print(json.dumps(results, indent=2), flush=True)

def finish():
    report = json.loads((PROJECT / 'analysis/final-validation.json').read_text(encoding='utf-8'))
    assert report['status'] == 'PASS'
    final = PROJECT / 'exports/why-captcha-exists.mp4'
    frame_numbers = [0,45,225,405,555,900,1010,1425,1460,1740,1800,2145,2205,2535,2785,2845]
    directory = PROJECT / 'exports/final-stills'
    directory.mkdir(exist_ok=True)
    expression = '+'.join(f'eq(n,{frame})' for frame in frame_numbers)
    run([FFMPEG, '-v', 'error', '-y', '-i', final, '-vf', f"select='{expression}'", '-vsync', '0', '-start_number', '0', directory / 'review-%02d.png'])
    for index, frame in enumerate(frame_numbers):
        shutil.copy2(directory / f'review-{index:02d}.png', PROJECT / 'exports/stills' / f'frame-{frame:04d}.png')
    contact_sheet()
    # The delivered preview is extracted from the final encode, including its final layout.
    run([FFMPEG, '-v', 'error', '-y', '-ss', str(1840/30), '-i', final, '-t', str(385/30), '-vf', 'scale=540:960', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', PROJECT / 'exports/preview-background-check.mp4'])
    readme = '''# Why CAPTCHA exists — Claude DZ

Completed animated Algerian Darija explainer, produced in this isolated project with the existing Remotion installation.

- Final: `exports/why-captcha-exists.mp4` — 1080 × 1920, 30 fps, 95.700 s, H.264/AAC.
- Voice: all eight original OGG clips, in numeric order; 95.680 s, no trimming, reordering, speed changes, music or added speech.
- Review: `exports/contact-sheet.jpg`, `exports/stills/`, `exports/preview-background-check.mp4`, and `exports/cover.png`.
- Validation: `analysis/final-validation.json`; source hashes and sample boundaries in `analysis/audio-assembly.json`.
- Source: `src/CaptchaVideo.tsx`, `src/index.tsx`, and `src/timeline.json`.
- Plan: `plans/why-captcha-exists-plan.md`; visual system: `plans/style.md`.

## Re-render
From this folder run `node render.cjs review` or `node render.cjs final`.
The `node_modules` directory is a junction to the existing `../../motion/node_modules`; dependencies were not installed or upgraded. Chrome is explicitly selected at `C:/Program Files/Google/Chrome/Application/chrome.exe`.

For the delivered standard-range MP4, run the production helper's `final`, `conform`, `verify`, and `finish` modes in that order. `conform` preserves a `why-captcha-exists-remotion.mp4` backup, converts full-range H.264 to conventional limited-range yuv420p, and removes only trailing encoder padding after the complete narration. If intentionally rebuilding a newer revision, preserve the old exports in a new version folder before reusing the same output names.

The production helper used for preparation, installation, type checks, review, render and validation is `C:/Users/hecin/Videos/my-animated-video/videos/why-captcha-exists/production.py`. Its `prepare`/`install` modes deploy the staging copy, so preserve any future edits in this production folder before using those modes again.

Font files and their SIL OFL licenses are in `media/fonts`. All topic illustrations are custom vector artwork. No external footage or licensed music is needed.
'''
    (PROJECT / 'README.md').write_text(readme, encoding='utf-8')
    note = '''# Production note

The user's selected production workspace is `C:/Users/hecin/ai-video-editor/projects/why-captcha-exists/`. The supplied CAPTCHA plan overrides the repository's default animation palette. No pre-existing composition or completed video was edited.

Built eight scenes around the same website checkpoint: browser puzzle, queue-to-requests analogy, bot uses, original distorted text, changing challenges, background assessment, uncertainty recap, and a matched opening/ending. Text is short Algerian Darija phrases, with Arabic shaping and isolated Latin terms. One visual comment question appears after the payoff.

All eight original OGG files are copied unchanged. Decoded 48 kHz mono PCM is concatenated at sample boundaries; the complete narration is 4,592,640 samples / 95.680 s. The picture has 2,871 frames / 95.700 s, preserving the final 0.020 s partial-frame tail. No silence was cut and no speech was replaced. Recorded account/password/data examples guide the illustrations; the original written script is preserved separately.

Validation: isolated source type check passed; final MP4 metadata passed; all frames and audio decoded without errors; each original recording's hash matched; per-clip waveform correlation against the AAC export exceeded the required 0.97 threshold. Representative frames and a background-check preview were rendered before the full export. Final review images and preview are extracted again from the finished encode.

MP4 compatibility pass: the original full-range Remotion H.264 is retained as a separate backup. FFmpeg converts the delivery picture to conventional limited-range yuv420p with BT.709 metadata and muxes the original continuous PCM directly into AAC at time zero. This bypasses the renderer's audio resampling/padding; the 95.680 s narration remains complete under a 95.700 s picture. Final waveform validation checks the delivered track itself.

Direct image inspection covered the portrait contact sheet and full-resolution text example. The removed title divider was the only layout correction after that review; progressive reveals were refined before final rendering. The workspace's video-perception MCP was unavailable, so no analysis from that tool or listening-by-ear is claimed. Intra-speech timing uses provisional local ASR anchors; the supplied audio itself remains intact and its placement is verified.

The complete video was rendered with Remotion 4.0.530. FFmpeg handled PCM assembly, review extraction and verification. Concat, Natron, AI-generated footage, paid APIs, and publishing were not used.
'''
    (PROJECT / 'production-note.md').write_text(note, encoding='utf-8')
    plan_path = PROJECT / 'plans/why-captcha-exists-plan.md'
    plan_path.write_text(plan_path.read_text(encoding='utf-8').replace('../../../plans/style.md', 'style.md'), encoding='utf-8')
    plan_timeline = PROJECT / 'plans/why-captcha-exists-timeline.json'
    planned = json.loads(plan_timeline.read_text(encoding='utf-8'))
    planned['visualSystem'] = 'style.md'
    plan_timeline.write_text(json.dumps(planned, ensure_ascii=False, indent=2), encoding='utf-8')
    checks = PRODUCTION_ROOT / 'workspace-data/tool-update-checks/latest.md'
    if checks.exists():
        text = checks.read_text(encoding='utf-8').replace('Graphify: CLI reused via the existing project-local graphify_workflow.py runtime, not on PATH.', 'Graphify installed: 0.9.89, reused via the existing project-local graphify_workflow.py runtime; not on PATH.')
        checks.write_text(text, encoding='utf-8')
    print(json.dumps({'final': str(final), 'bytes': final.stat().st_size, 'reviewFrames': len(frame_numbers), 'documentation': str(PROJECT / 'production-note.md')}), flush=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['prepare', 'install', 'review', 'final', 'conform', 'verify', 'sheet', 'tools', 'finish', 'design2-install', 'design2-review', 'design2-fixes', 'design2-final', 'design2-conform', 'design2-verify', 'design2-finish', 'design2-sheet', 'design2-maintenance', 'design2-handoff'])
    args = parser.parse_args()
    if args.mode.startswith('design2-'):
        from production_design2 import main
        main(args.mode.removeprefix('design2-'))
    else:
        {'prepare': prepare, 'install': install, 'review': review, 'final': render_final, 'conform': conform, 'verify': verify, 'sheet': contact_sheet, 'tools': tool_check, 'finish': finish}[args.mode]()
