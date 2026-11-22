from pathlib import Path
import sys, shutil, subprocess, json, os, wave, math, hashlib, urllib.request, datetime
ROOT=Path(__file__).resolve().parent
DEST=Path('C:/Users/hecin/ai-video-editor/projects/phone-slowdown-on-purpose')
sys.stdout.reconfigure(encoding='utf-8')
def install():
    for d in ['src','media','plans','inputs','analysis','exports']:(DEST/d).mkdir(parents=True,exist_ok=True)
    shutil.copy2(ROOT/'production-stage/PhoneSlowdown.tsx',DEST/'src/PhoneSlowdown.tsx')
    shutil.copy2(ROOT/'production-stage/render.cjs',DEST/'render.cjs')
    shutil.copy2(ROOT/'production-stage/design-review.md',DEST/'design-review.md')
    for folder in ['plans','inputs']:
        for source in (ROOT/folder).iterdir():
            if source.is_file():shutil.copy2(source,DEST/folder/source.name)
    for name in ['audio-timing.json','script-audio-alignment.json','plan-validation.json']:
        shutil.copy2(ROOT/'analysis'/name,DEST/'analysis'/name)
    shutil.copy2(ROOT/'analysis/narration.wav',DEST/'media/narration.wav')
    shutil.copy2(ROOT/'scripts/phone-slowdown-on-purpose.md',DEST/'script.md')
    shutil.copy2(ROOT/'brief.md',DEST/'brief.md')
    shutil.copy2(Path('C:/Users/hecin/ai-video-editor/projects/selling-a-phone/media/tajawal-bold.ttf'),DEST/'media/tajawal-bold.ttf')
    print('Installed',DEST,flush=True)
def sheet():
    from PIL import Image,ImageOps,ImageDraw
    files=sorted((DEST/'exports').glob('frame-*.png'),key=lambda p:int(p.stem.split('-')[1]))
    canvas=Image.new('RGB',(4*270,((len(files)+3)//4)*510),'white');draw=ImageDraw.Draw(canvas)
    for i,f in enumerate(files):
        img=Image.open(f).convert('RGB');img.thumbnail((270,480));x=i%4*270;y=i//4*510;canvas.paste(img,(x,y));draw.text((x+8,y+485),f'{int(f.stem.split("-")[1])/30:.2f}s',fill='black')
    canvas.save(DEST/'exports/storyboard.jpg',quality=94)
    shutil.copy2(DEST/'exports/storyboard.jpg',ROOT/'analysis/design2-storyboard.jpg')
    print(DEST/'exports/storyboard.jpg')
def inspect(preview=False):
    ff=ROOT.parents[1]/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
    video=DEST/'exports'/('preview.mp4' if preview else 'phone-slowdown-design2.mp4')
    times=[.4,2.1,7.5,11] if preview else [.4,2.1,8.2,22.2,41.3,48.5,60.3,70.5,91,97.2,104.8,106.1]
    from PIL import Image,ImageDraw
    canvas=Image.new('RGB',(1080,510*math.ceil(len(times)/4)),'white');draw=ImageDraw.Draw(canvas)
    for i,t in enumerate(times):
        out=DEST/'exports'/f'encoded-{t}.png'
        subprocess.run([str(ff),'-v','error','-y','-ss',str(t),'-i',str(video),'-frames:v','1',str(out)],check=True)
        img=Image.open(out).convert('RGB');img.thumbnail((270,480));x=i%4*270;y=i//4*510;canvas.paste(img,(x,y));draw.text((x+8,y+485),str(t)+'s',fill='black')
    out=DEST/'exports'/('preview-review.jpg' if preview else 'final-review.jpg');canvas.save(out,quality=95);print(out)
def verify():
    bindir=ROOT.parents[1]/'node_modules/@remotion/compositor-win32-x64-msvc';video=DEST/'exports/phone-slowdown-design2.mp4'
    data=json.loads(subprocess.check_output([str(bindir/'ffprobe.exe'),'-v','error','-show_format','-show_streams','-of','json',str(video)]))
    subprocess.run([str(bindir/'ffmpeg.exe'),'-v','error','-i',str(video),'-c:v','rawvideo','-c:a','pcm_s16le','-f','null','-'],check=True)
    decoded=DEST/'analysis/encoded-narration.wav'
    subprocess.run([str(bindir/'ffmpeg.exe'),'-v','error','-y','-i',str(video),'-vn','-ar','48000','-ac','1','-c:a','pcm_s16le',str(decoded)],check=True)
    import array
    def read(p):
        with wave.open(str(p)) as f:a=array.array('h',f.readframes(f.getnframes()))
        return a
    original=read(DEST/'media/narration.wav');encoded=read(decoded);n=min(len(original),len(encoded));a=original[:n:100];b=encoded[:n:100];ma=sum(a)/len(a);mb=sum(b)/len(b)
    corr=sum((x-ma)*(y-mb) for x,y in zip(a,b))/math.sqrt(sum((x-ma)**2 for x in a)*sum((y-mb)**2 for y in b))
    v=next(s for s in data['streams'] if s['codec_type']=='video')
    report={'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'frames':v.get('nb_frames'),'duration':data['format']['duration'],'fullDecodePassed':True,'audioSampleCorrelation':corr,'originalNarrationSamples':len(original),'encodedNarrationSamples':len(encoded),'allInputFilesUnchanged':all(hashlib.sha256(p.read_bytes()).digest()==hashlib.sha256((DEST/'inputs'/p.name).read_bytes()).digest() for p in (ROOT/'inputs').glob('*.ogg')),'reviewLimitation':'Phrase cues derived from ASR; no human ear verification claimed.'}
    assert v['width']==1080 and v['height']==1920 and v['r_frame_rate']=='30/1' and int(v['nb_frames'])==3185
    assert corr>.99 and report['allInputFilesUnchanged']
    (DEST/'analysis/render-validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report,indent=2))
def sync_audio():
    ff=ROOT.parents[1]/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
    video=DEST/'exports/phone-slowdown-design2.mp4';corrected=DEST/'exports/phone-slowdown-design2-synced.mp4'
    subprocess.run([str(ff),'-v','error','-y','-i',str(video),'-i',str(DEST/'media/narration.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',str(corrected)],check=True)
    shutil.copy2(video,DEST/'analysis/render-before-audio-sync.mp4')
    shutil.copy2(corrected,video)
    print('Remuxed original narration at t=0; video stream copied without re-encoding.')
def graph():
    (DEST/'.graphifyignore').write_text('media/\ninputs/\nexports/\nanalysis/\nnode_modules/\ngraphify-out/\n',encoding='utf-8')
    wrapper=ROOT.parents[0]/'selling-a-phone/graphify_workflow.py'
    for args in [('update','.'),('export','wiki')]:
        result=subprocess.run([sys.executable,str(wrapper),'cli',*args],cwd=DEST,capture_output=True,text=True,encoding='utf-8',errors='replace')
        (DEST/'analysis'/('graphify-'+args[0]+'.txt')).write_text(result.stdout+'\n'+result.stderr,encoding='utf-8');print(result.stdout[-2500:]);print(result.stderr[-500:]);print('exit',result.returncode)
def updates():
    results=[]
    for name,url in [('Graphify','https://pypi.org/pypi/graphifyy/json'),('Remotion','https://registry.npmjs.org/remotion/latest'),('Concat','https://api.github.com/repos/jub0t/Concat/releases/latest')]:
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Runtime-tech-local-check'}),timeout=15) as response:d=json.load(response)
            latest=d['info']['version'] if name=='Graphify' else d['version'] if name=='Remotion' else d['tag_name']
            results.append(f'- {name}: latest {latest}; source {url}. No upgrade performed.')
        except Exception as exc:results.append(f'- {name}: free update check unavailable: {exc}; source {url}.')
    results+=['- Installed Graphify runtime: 0.9.89. Installed Remotion: '+json.loads(Path('C:/Users/hecin/ai-video-editor/motion/node_modules/remotion/package.json').read_text())['version']+'. Concat not used; pinned version unchanged.']
    note='# Free tool check — '+datetime.datetime.now().strftime('%Y-%m-%d')+'\n\n'+'\n'.join(results)+'\n'
    Path('C:/Users/hecin/ai-video-editor/workspace-data/tool-update-checks/latest.md').write_text(note,encoding='utf-8');print(note)
def package():
    shutil.copy2(ROOT/'production-stage/render.cjs',DEST/'render.cjs')
    ff=ROOT.parents[1]/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
    video=DEST/'exports/phone-slowdown-design2.mp4'
    subprocess.run([str(ff),'-v','error','-y','-i',str(video),'-t','13.566667','-vf','scale=540:960','-c:v','libx264','-crf','18','-c:a','aac',str(DEST/'exports/preview.mp4')],check=True)
    shutil.copy2(DEST/'exports/encoded-2.1.png',DEST/'exports/cover.png')
    shutil.copy2(DEST/'plans/style.md',DEST/'plans/style-before-design2.md')
    guide=Path('C:/Users/hecin/ai-video-editor/projects/qr-code-explainer/style-guide.md').read_text(encoding='utf-8')
    (DEST/'plans/style.md').write_text('# Production override: Design 2\n\nThe user explicitly selected Design 2 for production. This supersedes the earlier proposed font and palette. Actual brand: Runtime.tech. Local font: media/tajawal-bold.ttf. Canonical source: ../../qr-code-explainer/style-guide.md.\n\n'+guide,encoding='utf-8')
    try:
        with urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/tajawal/OFL.txt',timeout=20) as response:license_text=response.read().decode()
        (DEST/'media/OFL-Tajawal.txt').write_text(license_text,encoding='utf-8')
    except Exception as exc:print('Font license fetch:',exc)
    report=json.loads((DEST/'analysis/render-validation.json').read_text())
    note='''# Production note — phone slowdown / Design 2

Full custom Remotion animation, 1080 × 1920, 30 fps, 3,185 frames (106.166667s picture). Ten supplied recordings retained in numeric order; original narration is 106.154667s. No music, synthetic narration or full bottom captions. Final export: exports/phone-slowdown-design2.mp4.

The earlier storyboard was adapted to the explicitly requested Design 2: exact approved palette, Tajawal Bold, crisp outlined vector props, blue active states, yellow warnings and quiet Runtime.tech branding. Opening: camera delay loses a bird photo, then a same-phone flashback. Later scenes demonstrate power shortfall, the water-flow analogy, reduced processor demand and a visibly lit phone, feature growth, an optimized update, storage/heat, and the mechanism-versus-motive distinction. No reference video frames or narration were reused.

Review: inspected the approved hook/storyboard, rendered sixteen representative stills and an opening preview, checked encoded preview frames, fixed pill/label wrapping, clarified the charge/power label, and added the visible phone-on result to the processor scene. Inspected final encoded frames across the video. Review assets: exports/final-review.jpg, exports/preview.mp4 and exports/cover.png.

Validation: full FFmpeg video/audio decode, correct dimensions/fps/frame count, copied original input hashes, and waveform correlation against the original narration. See analysis/render-validation.json for measured results. Cue timing comes from measured clips and ASR-assisted phrase locations; human ear verification has not been claimed. The shortened recorded ending is preserved; the unrecorded scripted closing was not synthesized.

Graphify: queried the existing repository graph before reading approved component source, then generated a local AST graph and wiki for this project. Logs: analysis/graphify-update.txt and graphify-export.txt. Local extraction incurred no semantic API cost. No shared rendering source, completed video or dependency version was changed.

Tools: Remotion renders the complete video. Concat, Natron and generated footage were not needed. The video-perception MCP was unavailable; review used local FFmpeg and visual frame inspection. The daily free tool checks were recorded in workspace-data/tool-update-checks/latest.md; no upgrades installed.
'''
    (DEST/'production-note.md').write_text(note+'\nAudio correction: the initial Remotion AAC track had a measured 2,048-sample delay. The original WAV was remuxed at t=0 with the video stream copied unchanged; the delivered file has matching decoded sample count and zero-offset correlation of '+str(report['audioSampleCorrelation'])+'. The renderer now applies this correction on full rerenders.\n',encoding='utf-8')
    (DEST/'README.md').write_text('''# Phone slowdown — Runtime.tech

- Final: [phone-slowdown-design2.mp4](exports/phone-slowdown-design2.mp4)
- Opening preview: [preview.mp4](exports/preview.mp4)
- Encoded storyboard review: [final-review.jpg](exports/final-review.jpg)
- Cover: [cover.png](exports/cover.png)
- Source: [src/PhoneSlowdown.tsx](src/PhoneSlowdown.tsx)
- Production notes and validation: [production-note.md](production-note.md), [render-validation.json](analysis/render-validation.json)
- Original plan: [plans/phone-slowdown-on-purpose-plan.md](plans/phone-slowdown-on-purpose-plan.md). Production style is explicitly Design 2; see [plans/style.md](plans/style.md).
- Source knowledge graph: [graphify-out/wiki/index.md](graphify-out/wiki/index.md).

Run from this project directory with the existing sibling motion dependencies:

```powershell
node render.cjs stills
node render.cjs preview
node render.cjs final
```

The renderer resolves the existing ai-video-editor/motion/node_modules packages and uses installed Chrome in headless mode. All outputs stay in this project. The full original narration is media/narration.wav; the ten original source files are in inputs/.
''',encoding='utf-8')
    print('Packaged',DEST)
if sys.argv[1]=='install':install()
elif sys.argv[1] in ['stills','preview','final']:
    subprocess.run(['node',str(DEST/'render.cjs'),sys.argv[1]],cwd=DEST,check=True)
    if sys.argv[1]=='stills':sheet()
elif sys.argv[1]=='sheet':sheet()
elif sys.argv[1]=='inspect-preview':inspect(True)
elif sys.argv[1]=='inspect-final':inspect()
elif sys.argv[1]=='verify':verify()
elif sys.argv[1]=='graph':graph()
elif sys.argv[1]=='updates':updates()
elif sys.argv[1]=='package':package()
elif sys.argv[1]=='sync-audio':sync_audio()
