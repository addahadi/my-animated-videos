from pathlib import Path
from PIL import Image,ImageDraw
import subprocess,json
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'exports'
FF=imageio_ffmpeg.get_ffmpeg_exe()
times=[('hook',1.33),('backup',13.6),('backup-check',23.5),('auth',31.2),('auth-zoom',34.8),('devices',51.8),('accounts',63.5),('sessions',77.9),('whatsapp',81.7),('reset',89.2),('verify',102.1),('end',112.8)]
for name,time in times:
    subprocess.run([str(FF),'-hide_banner','-loglevel','error','-ss',str(time),'-i',str(OUT/'selling-a-phone-design2.mp4'),'-frames:v','1','-y',str(OUT/f'final-{name}.png')],check=True)
sheet=Image.new('RGB',(1080,4*668),'white')
draw=ImageDraw.Draw(sheet)
for i,(name,time) in enumerate(times):
    sheet.paste(Image.open(OUT/f'final-{name}.png').convert('RGB').resize((360,640)),((i%3)*360,(i//3)*668))
    draw.text(((i%3)*360+12,(i//3)*668+645),f'{name}  {time:.2f}s',fill='#111214')
sheet.save(OUT/'contact-sheet.jpg',quality=94)
motion=Image.new('RGB',(5*270,504),'white')
md=ImageDraw.Draw(motion)
for i,time in enumerate([31.77,32.12,32.47,32.82,33.17]):
    p=OUT/f'final-motion-{i}.png'
    subprocess.run([str(FF),'-hide_banner','-loglevel','error','-ss',str(time),'-i',str(OUT/'selling-a-phone-design2.mp4'),'-frames:v','1','-y',str(p)],check=True)
    motion.paste(Image.open(p).convert('RGB').resize((270,480)),(i*270,0))
    md.text((i*270+12,484),f'{time:.2f}s',fill='#111214')
motion.save(OUT/'motion-review.jpg',quality=94)
subprocess.run([str(FF),'-hide_banner','-loglevel','error','-i',str(OUT/'selling-a-phone-design2.mp4'),'-t','15','-vf','scale=540:960','-c:v','libx264','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-y',str(OUT/'preview.mp4')],check=True)
print('Final contact sheet and five-frame camera review saved.')
