from pathlib import Path
import json,subprocess,sys
from PIL import Image,ImageDraw
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'exports/v3'
final=len(sys.argv)>1 and sys.argv[1]=='final'
samples=json.loads((OUT/'samples.json').read_text())
prefix='final' if final else 'draft'
if final:
    for name,time in samples:
        subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-ss',str(time),'-i',str(OUT/'selling-a-phone-v3.mp4'),'-frames:v','1','-y',str(OUT/f'{prefix}-{name}.png')],check=True)
def sheet(names,path,cols=4,width=300):
    h=round(width*1920/1080)
    canvas=Image.new('RGB',(cols*width,((len(names)+cols-1)//cols)*(h+27)),'white')
    d=ImageDraw.Draw(canvas)
    for i,name in enumerate(names):
        x=(i%cols)*width;y=(i//cols)*(h+27)
        canvas.paste(Image.open(OUT/f'{prefix}-{name}.png').convert('RGB').resize((width,h)),(x,y))
        d.text((x+8,y+h+5),f'{name}  {dict(samples)[name]:.2f}s',fill='#111214')
    canvas.save(OUT/path,quality=94)
sheet(['hook-first','hook-password','hook-blocked','hook-old','hook-stakes','hook-rewind','hook-prepared','backup-copy'],f'{prefix}-hook-review.jpg')
sheet(['hook-blocked','hook-old','hook-rewind','backup-copy','backup-open','auth-transfer','login','watch-after','android','find-my','sessions-after','whatsapp','reset-menu','resetting','verify-activation','end'],f'{prefix}-storyboard.jpg')
if final:
    (ROOT/'production-note-v3.md').write_text('''# Selling a phone v3

The user approved v2's contextual action animation, then requested removal of bottom narration captions and selected the "new phone, locked out" visual hook.

The opening shows a confirmed password, a required but missing verification code, and the old phone already at its reset welcome screen. A failed confirmation and an unavailable-key illustration connect the two states. At the original spoken transition, a rewind returns the old phone to its data screen and joins the first backup scene. The fixed camera, light Design 2 palette and original narration are preserved.

Removed the lower narration-caption layer, bottom progress bars and redundant lower scene summaries. Functional app labels, account/device identities, controls and the final checklist remain. The approved body action scenes use a lower portrait placement, with a larger reset-phone view.

Final: exports/v3/selling-a-phone-v3.mp4. Preview: exports/v3/preview.mp4. Review: exports/v3/final-hook-review.jpg and final-storyboard.jpg. Format: 113 seconds, 1080×1920, 30 fps, H.264/yuv420p and AAC. All nine recordings stay in order at 0.9 gain with about 0.829 seconds of final picture hold.

TypeScript and Python checks passed. Representative frames and the short opening preview were reviewed before full rendering; final review images are extracted again from the encoded MP4. Full decoding and complete narration correlation are saved in exports/v3/validation.json. Screens are schematic. No continuous listening/playback or unavailable video-perception service is claimed. Earlier versions remain available. No publishing.
''',encoding='utf-8')
print('Saved',prefix,'hook and caption-free storyboard reviews.')
