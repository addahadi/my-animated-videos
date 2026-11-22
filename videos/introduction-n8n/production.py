"""Deploy this isolated project and run production in the requested repository."""
from pathlib import Path
import json, math, shutil, subprocess, sys, wave, re
import numpy as np
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')
STAGE=Path(__file__).resolve().parent
REPO=Path('C:/Users/hecin/ai-video-editor')
ROOT=REPO/'projects/introduction-n8n'
FF=imageio_ffmpeg.get_ffmpeg_exe()
mode=sys.argv[1] if len(sys.argv)>1 else 'setup'

def sync():
    for p in ['media','inputs','analysis','src','exports']:(ROOT/p).mkdir(parents=True,exist_ok=True)
    source_dir=STAGE if (STAGE/'IntroductionN8n.tsx').exists() else STAGE/'src'
    for name in ['IntroductionN8n.tsx','introduction-n8n-entry.tsx']:
        if (source_dir/name).resolve()!=(ROOT/'src'/name).resolve():shutil.copy2(source_dir/name,ROOT/'src'/name)
        shutil.copy2(source_dir/name,REPO/'motion/src'/name)
    for name in ['design-plan.md','render.cjs','production.py','analyze_audio.py']:
        if STAGE!=ROOT:shutil.copy2(STAGE/name,ROOT/name)
    if STAGE!=ROOT:
        for p in (STAGE/'inputs').glob('*.ogg'):shutil.copy2(p,ROOT/'inputs'/p.name)
        for p in (STAGE/'analysis').glob('*'):
            if p.is_file():shutil.copy2(p,ROOT/'analysis'/p.name)
    shutil.copy2(REPO/'motion/public/pixel-claude-top3/arabic.ttf',ROOT/'media/arabic-bold.ttf')
    shutil.copy2(REPO/'motion/public/claude-mini-app/arabic-regular.ttf',ROOT/'media/arabic-regular.ttf')

def prepare():
    rows=json.loads((STAGE/'analysis/transcript.json').read_text(encoding='utf-8'))
    chunks=[]
    for row in rows:
        with wave.open(str(STAGE/'analysis'/(Path(row['file']).stem+'.wav')),'rb') as w:chunks.append(w.readframes(w.getnframes()))
    with wave.open(str(ROOT/'media/narration.wav'),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(48000);w.writeframes(b''.join(chunks))
    cues=[
     (0,'morning','صباحك واجد','07:00'),(5.24,'appointments','الطقس والمواعيد','Morning briefing'),(9.10,'automatic','وحده!','Automatic'),
     (12.651,'brand','أتمتة خدمتك','n8n'),(17.80,'apps','اربط تطبيقاتك','Automation'),(23.15,'once','مرة وحدة','Workflow'),(27.27,'repeat','يتنفّذ تلقائياً','Trigger → Action'),
     (30.229,'workflow','خطوات مربوطة','Workflow'),(36.13,'node','كل خطوة','Node'),(37.97,'trigger','البداية','Trigger'),(42.35,'clock','كل صباح','07:00'),(45.05,'action','تنفيذ المهمة','Action'),(48.33,'visual','بلا كود من الصفر','Visual workflow'),
     (54.613,'schedule','نبداو بالوقت','Schedule Trigger'),(60.11,'weather','حالة الطقس','Weather API'),(65.33,'calendar','مواعيد اليوم','Google Calendar'),(68.81,'telegram','كامل في ميساج','Telegram'),(72.79,'ready','برنامج نهارك واجد','Morning briefing'),
     (77.056,'beyond','أكثر من أتمتة','n8n + AI'),(80.12,'agent','مهام أكثر تعقيداً','AI Agents'),(87.424,'series','من الصفر','n8n series'),(93.09,'advanced','خطوة بخطوة','AI Agents'),(95.65,'follow','هذي غير البداية','n8n series')]
    duration=sum(r['duration'] for r in rows);frames=math.ceil((duration+.75)*30)
    beats=[{'start':v[0],'end':cues[i+1][0] if i+1<len(cues) else frames/30,'scene':v[1],'heading':v[2],'keyword':v[3]} for i,v in enumerate(cues)]
    timeline={'durationSeconds':duration,'durationInFrames':frames,'beats':beats,'sources':[{k:r[k] for k in ['file','duration','offset','samples','sha256']} for r in rows]}
    (ROOT/'media/timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2),encoding='utf-8')
    (ROOT/'brief.md').write_text((STAGE/'design-plan.md').read_text(encoding='utf-8'),encoding='utf-8')
    print(f'Prepared {duration:.6f}s narration; {frames} frames / {frames/30:.3f}s export',flush=True)

def sheet():
    paths=sorted((ROOT/'exports').glob('still-*.png'))
    im=Image.new('RGB',(1080,1524),'#161719');draw=ImageDraw.Draw(im);font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18)
    for i,p in enumerate(paths):
        x=(i%4)*270;y=(i//4)*508
        im.paste(Image.open(p).convert('RGB').resize((270,480)),(x,y));draw.text((x+9,y+484),p.stem,fill='#B7B9BE',font=font)
    im.save(ROOT/'exports/contact-sheet.jpg',quality=94)

def mux_original(preview=False,source=None):
    video=ROOT/('exports/preview.mp4' if preview else 'exports/introduction-n8n-instagram-v2.mp4')
    temp=video.with_name(video.stem+'-finalizing.mp4')
    timeline=json.loads((ROOT/'media/timeline.json').read_text(encoding='utf-8'))
    duration=12 if preview else timeline['durationInFrames']/30
    subprocess.run([FF,'-hide_banner','-loglevel','error','-i',str(source or video),'-i',str(ROOT/'media/narration.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','1','-af','apad','-t',str(duration),'-movflags','+faststart','-y',str(temp)],check=True)
    temp.replace(video)
    print(f'Muxed original narration at sample zero into {video.name}',flush=True)

def verify():
    video=ROOT/'exports/introduction-n8n-instagram-v2.mp4'
    run=subprocess.run([FF,'-hide_banner','-i',str(video),'-f','null','-'],capture_output=True,text=True)
    assert run.returncode==0,run.stderr
    assert '1080x1920' in run.stderr and '30 fps' in run.stderr and 'Audio: aac' in run.stderr
    assert not any(v in run.stderr.lower() for v in ['error while','invalid data','corrupt'])
    timeline=json.loads((ROOT/'media/timeline.json').read_text(encoding='utf-8'))
    pcm=subprocess.run([FF,'-v','error','-i',str(video),'-vn','-ar','48000','-ac','1','-f','s16le','-'],capture_output=True,check=True).stdout
    actual=np.frombuffer(pcm,dtype='<i2').astype(np.float32)
    with wave.open(str(ROOT/'media/narration.wav'),'rb') as w:expected=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)
    correlations=[]
    for row in timeline['sources']:
        start=round(row['offset']*48000);n=row['samples']
        with wave.open(str(STAGE/'analysis'/(Path(row['file']).stem+'.wav')),'rb') as w:raw=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2')
        assert np.array_equal(expected[start:start+n],raw),row['file']
        vals=[]
        for fraction in [.15,.5,.8]:
            at=start+int(n*fraction);size=min(24000,n-int(n*fraction))
            a=expected[at:at+size];b=actual[at:at+size]
            vals.append(float(np.corrcoef(a,b)[0,1]))
        assert min(vals)>.97,(row['file'],vals)
        correlations.append({'file':row['file'],'source_samples_preserved':True,'encoded_audio_correlations':vals})
    match=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',run.stderr)
    duration=int(match[1])*3600+int(match[2])*60+float(match[3])
    assert abs(duration-timeline['durationInFrames']/30)<.08
    report={'video':str(video),'resolution':'1080x1920','fps':30,'duration':duration,'narration_duration':len(expected)/48000,'full_decode':'passed','audio':'AAC, original six clips in order','source_checks':correlations,'visual_review':'Representative stills and transition samples reviewed; no continuous listening/playback review claimed.'}
    (ROOT/'exports/verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    # Sample transitions, including beginning and ending, from the completed export.
    for name,stamp in [('opening',.4),('transition-before',60.01),('transition-after',60.36),('ending',timeline['durationInFrames']/30-.2)]:
        subprocess.run([FF,'-v','error','-ss',str(stamp),'-i',str(video),'-frames:v','1','-y',str(ROOT/f'exports/{name}.jpg')],check=True)
    print(json.dumps(report,indent=2),flush=True)

def preview_check():
    p=ROOT/'exports/preview.mp4'
    run=subprocess.run([FF,'-hide_banner','-i',str(p),'-f','null','-'],capture_output=True,text=True)
    assert run.returncode==0 and '540x960' in run.stderr and '30 fps' in run.stderr
    for i,stamp in enumerate([.4,3.8,5.5,8.5,9.4,11.7]):
        subprocess.run([FF,'-v','error','-ss',str(stamp),'-i',str(p),'-frames:v','1','-y',str(ROOT/f'exports/preview-review-{i}.jpg')],check=True)
    print('Preview full decode passed: 540x960, 30 fps, 12 seconds')

def finalize():
    report=json.loads((ROOT/'exports/verification.json').read_text())
    (ROOT/'PRODUCTION-NOTE.md').write_text('''# Introduction to n8n — completed production

Produced with the ai-video-editor Remotion setup, following the saved n8n dark-mode design and frontend-design planning/review workflow. The light reference was preserved. The input recordings are copied under inputs/; source lives under src/ with the two active rendering files also installed in motion/src/. No Concat/Rust, Natron, or generated footage was needed.

Deliverable: exports/introduction-n8n-instagram-v2.mp4 — 1080 × 1920, 30 fps, H.264/AAC, 98.8 seconds. The full original six recordings play in numerical order (98.026667 seconds); picture holds for about 0.77 seconds afterward. No narration is cut or time stretched. No music was added. The final mux copies the Remotion video stream and encodes the preserved mono WAV directly with FFmpeg at sample zero, eliminating the renderer's measured 2048-sample AAC delay and preserving source level.

Visuals: short Arabic headings and technical keywords; morning Telegram briefing, connected workflow, individual nodes and trigger, 07:00 schedule, Weather API, Google Calendar, Telegram merge, AI agent with model/tools/memory, and series follow invitation. Weather numbers and appointment times are illustrative. Bundled Noto Sans Arabic fonts provide RTL shaping; the coral bot retains the reference silhouette.

Opening-title revision: “سلسلة تعلم n8n” appears from the first frame for the first 9.1 seconds, above the existing hook, with a 0.35-second fade at the end. The approved first version is preserved as exports/introduction-n8n-instagram-v1.mp4. Narration, timing, and the remaining animation are unchanged. Windows locked the original export during final rename; the completed render was muxed into the new v2 path without re-rendering or re-encoding its video stream. The original export remains at its earlier path.

The illustrative agent connections were checked against the official [AI Agent documentation](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent) and [Simple Memory documentation](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorybufferwindow). The scene is a schematic explanation, not a captured runnable workflow.

Review: twelve portrait frames, a 12-second preview, and opening/ending/transition frames. Arabic placement, dark contrast and diagram spacing checked visually. Project source passed strict TypeScript checking using the existing shared @types directory. Full MP4 decode, dimensions, frame rate and duration passed. Each source recording's decoded samples are exactly preserved in the narration WAV; AAC audio correlation was checked at three positions in every recording. Details are in exports/verification.json.

Limits: the video-perception MCP dependency is unavailable in this client. No continuous listening or real-time audiovisual playback review is claimed. Automatic draft transcription was used only for timing and internal planning, never as subtitles. Local Whisper inference used CPU because the configured GPU environment is missing. Graphify is unavailable on PATH, so query/update/wiki export could not run; no tools were upgraded.

Rebuild from this project directory:

```powershell
python production.py stills
python production.py preview
python production.py render
python production.py verify
```

`node render.cjs render` also renders directly using the prepared media and motion/src entry. Type check from motion/ with the workspace TypeScript compiler and --typeRoots C:/Users/hecin/Videos/my-animated-video/node_modules/@types. Publishing remains manual.
''',encoding='utf-8')
    (ROOT/'README.md').write_text('# Introduction to n8n\n\nSee [PRODUCTION-NOTE.md](PRODUCTION-NOTE.md) for commands and verification, [design-plan.md](design-plan.md) for the storyboard, and [exports/introduction-n8n-instagram-v2.mp4](exports/introduction-n8n-instagram-v2.mp4) for the revised Reel with the opening series title.\n',encoding='utf-8')
    checks=REPO/'workspace-data/tool-update-checks';checks.mkdir(parents=True,exist_ok=True)
    (checks/'latest.md').write_text('''# Daily free tool check — 2026-10-25 (Africa/Algiers)

- Remotion in motion/: installed 4.0.530. Official npm page returned 403 and registry web lookup failed; latest comparison incomplete. Sources: https://www.npmjs.com/package/remotion and https://registry.npmjs.org/remotion/latest.
- Graphify CLI unavailable on PATH. Official registry reachable, but latest version not extracted by the web viewer; comparison incomplete. Source: https://pypi.org/pypi/graphifyy/json.
- Concat: submodule uninitialized at pinned 1ab750a339c5db249d353b21b9f3cc9ddb1a1a22. Official latest release v0.2.8, published October 20, includes project-folder locking fixes and an expanded audio page. Source: https://github.com/jub0t/Concat/releases/tag/v0.2.8. No installed binary/version comparison available.

No upgrades installed, dependency pins changed, paid monitors or subscriptions created. The n8n video uses the existing Remotion installation.
''',encoding='utf-8')
    print('Saved production note, rebuild instructions, and daily free check record.')

if mode=='setup':sync();prepare()
elif mode=='archive-before-title':
    for name in ['introduction-n8n-instagram.mp4','verification.json']:
        source=ROOT/'exports'/name
        target=source.with_name(source.stem+'-v1'+source.suffix)
        if source.exists() and not target.exists():shutil.copy2(source,target)
    print('Preserved approved first export and verification report.')
elif mode in ['stills','preview','render']:
    sync();prepare()
    subprocess.run(['node',str(ROOT/'render.cjs'),mode],cwd=REPO/'motion',check=True)
    if mode=='stills':sheet()
    else:mux_original(mode=='preview')
elif mode=='verify':verify()
elif mode=='recover-title-render':
    candidates=sorted((ROOT/'exports').glob('introduction-n8n-instagram.mp4.*.remotion-in-progress'),key=lambda p:p.stat().st_mtime)
    assert candidates,'No completed render found'
    mux_original(source=candidates[-1])
elif mode=='mux-original':mux_original();mux_original(True)
elif mode=='preview-check':preview_check()
elif mode=='finalize':sync();finalize()
elif mode=='maintenance':
    for command in [['graphify','update','.'],['graphify','export','wiki']]:
        try:subprocess.run(command,cwd=REPO,check=True)
        except (FileNotFoundError,subprocess.CalledProcessError) as e:print('Graph maintenance unavailable:',e)
else:raise SystemExit('Unknown production mode')
