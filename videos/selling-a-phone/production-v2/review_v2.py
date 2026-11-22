from pathlib import Path
import json,subprocess,sys
from PIL import Image,ImageDraw
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'exports/v2'
final=len(sys.argv)>1 and sys.argv[1]=='final'
samples=json.loads((OUT/'samples.json').read_text())
prefix='final' if final else 'draft'
if final:
    for name,time in samples:
        subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-ss',str(time),'-i',str(OUT/'selling-a-phone-v2.mp4'),'-frames:v','1','-y',str(OUT/f'{prefix}-{name}.png')],check=True)
def sheet(names,path,cols=4,width=300):
    h=round(width*1920/1080)
    canvas=Image.new('RGB',(cols*width,((len(names)+cols-1)//cols)*(h+27)),'white')
    d=ImageDraw.Draw(canvas)
    for i,name in enumerate(names):
        x=(i%cols)*width;y=(i//cols)*(h+27)
        canvas.paste(Image.open(OUT/f'{prefix}-{name}.png').convert('RGB').resize((width,h)),(x,y))
        time=dict(samples)[name]
        d.text((x+8,y+h+5),f'{name}  {time:.2f}s',fill='#111214')
    canvas.save(OUT/path,quality=94)
sheet(['intro','backup-copy','backup-open','auth-transfer','login','auth-risk','watch-after','android','find-my','sessions-after','whatsapp','reset-menu','resetting','verify-warning','verify-activation','end'],f'{prefix}-storyboard.jpg')
sheet(['backup-copy','backup-options','backup-open','backup-contacts','auth-before','auth-transfer','auth-after','login'],f'{prefix}-backup-auth-review.jpg')
sheet(['watch-before','watch-after','sessions-before','sessions-after','welcome','verify-warning','verify-account','verify-activation'],f'{prefix}-action-review.jpg')
if final:
    (ROOT/'production-note-v2.md').write_text('''# Selling a phone v2

Implemented the approved action-based storyboard after the first version was rejected for irrelevant hardware imagery. The camera is fixed; scenes show backup copies, opened recovery files, Authenticator account migration and password-plus-code login, watch/Bluetooth unpairing, Google removal, Apple sign-out and Find My off, sign-out and old-session removal, WhatsApp transfer, reset, three final checks and safe handover.

Final: exports/v2/selling-a-phone-v2.mp4. Duration 113 seconds, 1080×1920, 30 fps, H.264/yuv420p and AAC. All nine supplied recordings are retained in order, with constant 0.9 gain and a short final picture hold. No replacement narration.

Reviewed representative frames, a 23-second backup/2FA preview and before/after action sequences before full export. Final review images are extracted from the encoded video. Full decode and complete narration comparison are in exports/v2/validation.json. UI screens are schematic; exact platform menus vary. No continuous playback/listening review or unavailable video-perception service is claimed. Graphify CLI remains unavailable. Existing v1 source and exports are preserved.
''',encoding='utf-8')
print('Saved',prefix,'storyboard and semantic action review sheets.')
