from pathlib import Path
import json,subprocess,sys
from PIL import Image,ImageDraw,ImageChops,ImageStat
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'exports/v4'
final=len(sys.argv)>1 and sys.argv[1]=='final'
samples=json.loads((OUT/'samples.json').read_text())
prefix='final' if final else 'draft'
if final:
    for name,time in samples:
        subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-ss',str(time),'-i',str(OUT/'selling-a-phone-v4.mp4'),'-frames:v','1','-y',str(OUT/f'{prefix}-{name}.png')],check=True)
    comparisons=[]
    for name in ['backup-copy','backup-open','auth-transfer','whatsapp','verify-activation','end']:
        a=Image.open(ROOT/f'exports/v3/final-{name}.png').convert('RGB')
        b=Image.open(OUT/f'final-{name}.png').convert('RGB')
        mean=sum(ImageStat.Stat(ImageChops.difference(a,b)).mean)/3
        comparisons.append({'scene':name,'mean_rgb_difference_0_to_255':mean})
    comparison={'passed':all(r['mean_rgb_difference_0_to_255']<2 for r in comparisons),'comparisons':comparisons}
    (OUT/'body-frame-comparison.json').write_text(json.dumps(comparison,indent=2),encoding='utf-8')
    assert comparison['passed'],'Body frame comparison needs visual inspection'
    print('Encoded body comparison passed:',[round(r['mean_rgb_difference_0_to_255'],4) for r in comparisons])
def sheet(names,path,cols=4,width=300):
    h=round(width*1920/1080)
    canvas=Image.new('RGB',(cols*width,((len(names)+cols-1)//cols)*(h+27)),'white')
    d=ImageDraw.Draw(canvas)
    for i,name in enumerate(names):
        x=(i%cols)*width;y=(i//cols)*(h+27)
        frame=OUT/f'{prefix}-{name}.png'
        if not final and (OUT/f'review-{name}.png').exists():frame=OUT/f'review-{name}.png'
        canvas.paste(Image.open(frame).convert('RGB').resize((width,h)),(x,y))
        d.text((x+8,y+h+5),f'{name}  {dict(samples)[name]:.2f}s',fill='#111214')
    canvas.save(OUT/path,quality=94)
sheet(['hook-start','hook-approach','hook-pause','hook-warning','hook-seven','hook-return','hook-prepared','backup-copy'],f'{prefix}-hook-review.jpg')
sheet(['hook-approach','hook-warning','hook-seven','backup-copy','backup-open','auth-transfer','watch-after','android','find-my','sessions-after','whatsapp','reset-menu','resetting','verify-activation','end'],f'{prefix}-storyboard.jpg')
if final:
    (ROOT/'production-note-v4.md').write_text('''# Selling a phone v4

Replaced the locked-out opening with the seller-to-buyer handover explicitly requested by the user. Both people are shown and labeled. The seller moves a phone containing a personal photo, messages and accounts toward the buyer. The phone and hands pause before transfer; seven named preparation steps appear. Yellow warnings identify the personal-file and account-access risks without showing an actual data deletion or making a permanent-loss claim. At the recorded first-step transition the seller withdraws the phone, leading directly into backup.

Bottom narration captions remain off. The approved caption-free v3 body frames, all nine source recordings and their timing are preserved. The new opening is 290 frames; frame 290 onward comes from the prior silent body render. Final packaging uses a frame-accurate trim/concat and original PCM narration. Output is 113 seconds, 1080×1920, 30 fps, H.264/yuv420p and AAC, with 0.9 audio gain and about 0.829 seconds of picture hold.

Graphify skill applied: pinned project-local Graphify 0.9.89; existing workspace graph queried; missing current-project coverage recorded; scoped AST graph built; Intro dependencies/callers inspected before editing; updated source graph, wiki and HTML exported. No semantic API/LLM calls. See graphify-review-v4.md and src-v4/graphify-out/.

TypeScript/Python checks, representative stills, a 15-second opening preview, and final decode/audio comparison support review. Final media checks are in exports/v4/validation.json. Final hook/storyboard sheets are extracted from the encoded MP4. No continuous playback/listening or unavailable video-perception service is claimed. Earlier exports remain available. No publishing.
''',encoding='utf-8')
print('Saved',prefix,'seller-to-buyer handover and storyboard reviews.')
