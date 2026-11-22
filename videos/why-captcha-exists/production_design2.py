"""Versioned Design 2 rebuild; original CAPTCHA exports remain untouched."""
from pathlib import Path
import hashlib
import json
import math
import shutil
import subprocess
import wave
import imageio_ffmpeg

LOCAL=Path(__file__).resolve().parent
WORKSPACE=LOCAL.parents[1]
STAGE=LOCAL/'production-design2'
ROOT=Path('C:/Users/hecin/ai-video-editor').resolve()
PROJECT=(ROOT/'projects/why-captcha-exists').resolve()
OUT=PROJECT/'exports/design2'
FFMPEG=Path(imageio_ffmpeg.get_ffmpeg_exe())
PROBE=WORKSPACE/'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'
NODE=shutil.which('node')
FRAMES=[30,120,240,405,510,800,870,960,1395,1460,1605,1785,1980,2155,2210,2375,2450,2535,2690,2830]
assert PROJECT.parent==ROOT/'projects'

def run(args,capture=False):
    result=subprocess.run([str(x) for x in args],cwd=PROJECT,check=True,capture_output=capture)
    return result.stdout if capture else result

def probe(path):
    return json.loads(run([PROBE,'-v','error','-show_format','-show_streams','-of','json',path],True))

def install():
    assert (PROJECT/'production-manifest.json').is_file()
    (PROJECT/'src-design2').mkdir(exist_ok=True)
    for file in (STAGE/'src').glob('*.tsx'):
        shutil.copy2(file,PROJECT/'src-design2'/file.name)
    shutil.copy2(LOCAL/'plans/why-captcha-exists-timeline.json',STAGE/'src/timeline.json')
    shutil.copy2(STAGE/'src/timeline.json',PROJECT/'src-design2/timeline.json')
    for name in ['production-design2.cjs','tsconfig-design2.json']:
        shutil.copy2(STAGE/name,PROJECT/name)
    media=PROJECT/'media/design2'
    media.mkdir(exist_ok=True)
    shutil.copy2(ROOT/'projects/selling-a-phone/media/tajawal-bold.ttf',media/'tajawal-bold.ttf')
    shutil.copy2(ROOT/'projects/selling-a-phone/font-OFL.txt',media/'OFL-Tajawal.txt')
    shutil.copy2(STAGE/'design-plan.md',PROJECT/'design-plan-design2.md')
    OUT.mkdir(parents=True,exist_ok=True)
    (PROJECT/'analysis/design2').mkdir(parents=True,exist_ok=True)
    run([NODE,WORKSPACE/'node_modules/typescript/bin/tsc','--project',PROJECT/'tsconfig-design2.json','--noEmit','--typeRoots',WORKSPACE/'node_modules/@types'])
    print('Design 2 sources installed and type checked.',flush=True)

def sheet():
    from PIL import Image,ImageDraw,ImageFont
    sources=[OUT/'stills'/f'frame-{f:04d}.png' for f in FRAMES if (OUT/'stills'/f'frame-{f:04d}.png').exists()]
    w,h,g=270,480,18
    img=Image.new('RGB',(5*(w+g)+g,math.ceil(len(sources)/5)*(h+43+g)+g),'#F0EFF4')
    draw=ImageDraw.Draw(img)
    font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',19)
    for i,source in enumerate(sources):
        x=g+i%5*(w+g);y=g+i//5*(h+43+g)
        img.paste(Image.open(source).convert('RGB').resize((w,h)),(x,y))
        frame=int(source.stem.split('-')[1])
        draw.text((x+8,y+h+10),f'{frame/30:.2f}s / {frame}',font=font,fill='#111214')
    img.save(OUT/'contact-sheet-design2.jpg',quality=95)
    shutil.copy2(OUT/'stills/frame-0240.png',OUT/'cover-design2.png')
    print('Design 2 contact sheet ready.',flush=True)

def mux_preview(name,start,duration):
    run([FFMPEG,'-v','error','-y','-i',OUT/f'preview-{name}-picture.mp4','-ss',str(start),'-i',PROJECT/'media/audio/narration.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','128k','-t',str(duration),'-movflags','+faststart',OUT/f'preview-{name}.mp4'])

def review():
    run([NODE,PROJECT/'production-design2.cjs','review'])
    mux_preview('hook',0,10)
    mux_preview('background-check',1840/30,385/30)
    sheet()

def render():
    run([NODE,PROJECT/'production-design2.cjs','final'])

def fixes():
    run([NODE,PROJECT/'production-design2.cjs','review-fixes'])
    sheet()

def conform():
    raw=OUT/'render-design2.mp4'
    final=OUT/'why-captcha-exists-design2.mp4'
    video=next(s for s in probe(raw)['streams'] if s['codec_type']=='video')
    vopts=['-c:v','copy'] if video['pix_fmt']=='yuv420p' else ['-vf','scale=in_range=pc:out_range=tv,format=yuv420p','-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709','-c:v','libx264','-preset','fast','-crf','16','-pix_fmt','yuv420p','-threads','4']
    run([FFMPEG,'-v','error','-y','-i',raw,'-i',PROJECT/'media/audio/narration.wav','-map','0:v:0','-map','1:a:0',*vopts,'-c:a','aac','-b:a','192k','-t','95.7','-movflags','+faststart',final])
    print('Design 2 final MP4 assembled from original continuous narration.',flush=True)

def verify():
    import numpy as np
    final=OUT/'why-captcha-exists-design2.mp4'
    metadata=probe(final)
    video=next(s for s in metadata['streams'] if s['codec_type']=='video')
    audio=next(s for s in metadata['streams'] if s['codec_type']=='audio')
    assert (video['width'],video['height'],video['nb_frames'])==(1080,1920,'2871')
    assert video['r_frame_rate']=='30/1' and video['pix_fmt']=='yuv420p' and video['codec_name']=='h264'
    assert abs(float(metadata['format']['duration'])-95.7)<.01 and audio['codec_name']=='aac'
    with wave.open(str(PROJECT/'media/audio/narration.wav'),'rb') as wav:
        expected=np.frombuffer(wav.readframes(wav.getnframes()),dtype='<i2').astype(float)
    actual=np.frombuffer(run([FFMPEG,'-v','error','-i',final,'-vn','-ac','1','-ar','48000','-f','s16le','pipe:1'],True),dtype='<i2').astype(float)
    assembly=json.loads((PROJECT/'analysis/audio-assembly.json').read_text(encoding='utf-8'))
    checks=[]
    for clip in assembly['clips']:
        i,j=clip['startSample'],clip['endSample']
        r=float(np.corrcoef(expected[i:j],actual[i:j])[0,1])
        assert r>.999
        assert hashlib.sha256((PROJECT/'inputs'/clip['file']).read_bytes()).hexdigest()==clip['sha256']
        checks.append({'file':clip['file'],'waveformCorrelation':round(r,7),'sourceHashMatches':True})
    source=(PROJECT/'src-design2/Video.tsx').read_text(encoding='utf-8')
    assert 'Claude' not in source and 'Runtime' in source
    assert 'fontSize:70' in source and 'top:650' in source
    run([FFMPEG,'-v','error','-i',final,'-f','null','-'])
    report={'status':'PASS','version':'Design 2 rebuild','branding':'Runtime.tech','canvas':[1080,1920],'fps':30,'frames':2871,'durationSec':95.7,'narrationSec':95.68,'titleSizePx':70,'titleToStageGapPx':120,'bottomNarrationCaptions':False,'audioChecks':checks,'fullDecode':'PASS','originalExportPreserved':(PROJECT/'exports/why-captcha-exists.mp4').is_file()}
    (PROJECT/'analysis/design2/validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2),flush=True)

def finish():
    final=OUT/'why-captcha-exists-design2.mp4'
    assert json.loads((PROJECT/'analysis/design2/validation.json').read_text())['status']=='PASS'
    extracted=OUT/'encoded-review';extracted.mkdir(exist_ok=True)
    expr='+'.join(f'eq(n,{f})' for f in FRAMES)
    run([FFMPEG,'-v','error','-y','-i',final,'-vf',f"select='{expr}'",'-vsync','0','-start_number','0',extracted/'review-%02d.png'])
    for n,f in enumerate(FRAMES):
        shutil.copy2(extracted/f'review-{n:02d}.png',OUT/'stills'/f'frame-{f:04d}.png')
    sheet()
    for name,start,duration in [('hook',0,10),('background-check',1840/30,385/30)]:
        run([FFMPEG,'-v','error','-y','-ss',str(start),'-i',final,'-t',str(duration),'-vf','scale=540:960','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',OUT/f'preview-{name}.mp4'])
    note='''# CAPTCHA — Design 2 revision

Production folder: C:/Users/hecin/ai-video-editor/projects/why-captcha-exists/.
Final: exports/design2/why-captcha-exists-design2.mp4.

This revision rebuilds the subject demonstrations using the current approved Design 2: light-gray canvas, white surfaces, strong black vector outlines, electric-blue action emphasis, yellow warnings, Tajawal Bold, and quiet Runtime.tech branding. Titles shrink from 82 px to 70 px, with approximately 120 px of clear space above the main demonstration. There are no bottom narration captions.

The scenes show signup interrupted by an actual puzzle, a person returning to a queue, repeated registration requests, growing fake-account rows, credential attempts with a rejection, retained source documents and traveling copies, a human reading and typing a historical challenge, a changed test and human retry, interaction context feeding a risk assessment, the site's separate response, and a before/after check comparison. These are newly drawn scenes, not a recolor of the first version.

All eight supplied recordings remain in their original order and entirety. The 95.680 s PCM track is muxed directly to AAC at time zero, under 2871 frames / 95.700 s of picture. No trimming, speech replacement, time stretching or music is used. The original export and original source folder remain intact.

Source: src-design2/Video.tsx, src-design2/index.tsx, src-design2/timeline.json. Renderer: production-design2.cjs. Design plan: design-plan-design2.md. Existing dependencies are reused through the project's node_modules junction. Local fonts and OFL are in media/design2/.

Review frames and hook/background-check previews were rendered before the full export. The final validation checks dimensions, frame rate, duration, codec, full decoding, source hashes and per-clip audio correlation. Encoded review frames are extracted from the delivered file. Direct image review is used; no video-perception MCP or listening-by-ear analysis is claimed. Word cues use the existing local ASR anchors.

To reproduce with the existing helper, run python videos/why-captcha-exists/production.py design2-install, design2-review, design2-final, design2-conform, design2-verify and design2-finish from C:/Users/hecin/Videos/my-animated-video. The renderer can also be run directly from this project with node production-design2.cjs review or node production-design2.cjs final; final assembly uses the original continuous PCM.
'''
    (PROJECT/'production-note-design2.md').write_text(note,encoding='utf-8')
    (PROJECT/'README-design2.md').write_text('# CAPTCHA Design 2\n\n- [Final video](exports/design2/why-captcha-exists-design2.mp4)\n- [Contact sheet](exports/design2/contact-sheet-design2.jpg)\n- [Opening preview](exports/design2/preview-hook.mp4)\n- [Background check preview](exports/design2/preview-background-check.mp4)\n- [Production note](production-note-design2.md)\n- [Design and scene plan](design-plan-design2.md)\n\nThe original version remains in exports/why-captcha-exists.mp4.\n',encoding='utf-8')
    print(json.dumps({'final':str(final),'bytes':final.stat().st_size,'validation':'PASS'}),flush=True)

def maintenance():
    """Run local-only graph maintenance after rendering, with one CPU worker."""
    import os
    import sys
    import importlib.metadata
    dependencies=WORKSPACE/'videos/selling-a-phone/.graphify-deps'
    sys.path.insert(0,str(dependencies))
    os.environ['PYTHONPATH']=str(dependencies)
    os.environ['GRAPHIFY_MAX_WORKERS']='1'
    os.cpu_count=lambda:1
    if hasattr(os,'process_cpu_count'):
        os.process_cpu_count=lambda:1
    os.chdir(ROOT)
    entry=next(e for e in importlib.metadata.distribution('graphifyy').entry_points if e.name=='graphify').load()
    results=[]
    for args in [['update','.'],['export','wiki']]:
        sys.argv=['graphify',*args]
        try:
            entry()
            results.append({'command':' '.join(sys.argv),'exitCode':0})
        except SystemExit as exc:
            results.append({'command':' '.join(sys.argv),'exitCode':exc.code or 0})
    (PROJECT/'analysis/design2/graph-maintenance.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
    print(json.dumps(results),flush=True)

def handoff():
    readme=PROJECT/'README.md'
    original=readme.read_text(encoding='utf-8')
    if 'Current revision: Design 2' not in original:
        latest='''# Why CAPTCHA exists — Runtime.tech

Current revision: Design 2. The scene implementation has been rebuilt, titles reduced to 70 px with more separation, and branding corrected to Runtime.tech. The supplied narration is preserved.

- [Design 2 final video](exports/design2/why-captcha-exists-design2.mp4)
- [Encoded storyboard](exports/design2/contact-sheet-design2.jpg)
- [Design 2 project overview](README-design2.md)
- [Design 2 production note](production-note-design2.md)
- [Validation](analysis/design2/validation.json)

The original version remains intact below and in its original export path.

## Earlier production

'''
        readme.write_text(latest+'\n'.join(original.splitlines()[1:]),encoding='utf-8')
    note=PROJECT/'production-note-design2.md'
    text=note.read_text(encoding='utf-8')
    if 'Final encoded image review:' not in text:
        text+='\nFinal encoded image review: inspected the delivered contact sheet and full-resolution historical-test frame. The corrected copy label and comparison spacing are retained; the caller paths, typing and gate crossing are visible. Final source and media checks passed. The successful render used one browser worker after the concurrent indexing attempt exhausted memory.\n'
        note.write_text(text,encoding='utf-8')
    print('Project overview points to the validated Design 2 revision.',flush=True)

def main(mode):
    {'install':install,'review':review,'fixes':fixes,'final':render,'conform':conform,'verify':verify,'finish':finish,'sheet':sheet,'maintenance':maintenance,'handoff':handoff}[mode]()
