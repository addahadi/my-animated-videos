from pathlib import Path
import subprocess,sys
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'exports/v3'
preview=len(sys.argv)>1 and sys.argv[1]=='preview'
video=OUT/('preview-render.mp4' if preview else 'render-source.mp4')
output=OUT/('preview.mp4' if preview else 'selling-a-phone-v3.mp4')
command=[imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-i',str(video)]

command+=['-i',str(ROOT/'media/narration.wav'),'-map','0:v:0','-map','1:a:0','-vf','scale=in_range=pc:out_range=tv','-af','volume=0.9,apad','-t','15' if preview else '113','-c:v','libx264','-preset','fast','-crf','20' if preview else '17','-pix_fmt','yuv420p','-color_range','tv','-threads','2','-c:a','aac','-b:a','192k','-movflags','+faststart','-y',str(output)]
subprocess.run(command,check=True)
print('Packaged',output.name,'with original narration at the correct timing.')
