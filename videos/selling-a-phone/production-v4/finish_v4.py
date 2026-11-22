from pathlib import Path
import subprocess,sys
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'exports/v4'
preview=len(sys.argv)>1 and sys.argv[1]=='preview'
ff=imageio_ffmpeg.get_ffmpeg_exe()
if preview:
    command=[ff,'-hide_banner','-loglevel','error','-i',str(OUT/'preview-render.mp4'),'-i',str(ROOT/'media/narration.wav'),'-map','0:v:0','-map','1:a:0','-vf','scale=in_range=pc:out_range=tv','-t','15']
else:
    command=[ff,'-hide_banner','-loglevel','error','-i',str(OUT/'render-hook.mp4'),'-i',str(ROOT/'exports/v3/render-source.mp4'),'-i',str(ROOT/'media/narration.wav'),'-filter_complex','[0:v]trim=start_frame=0:end_frame=290,setpts=PTS-STARTPTS[h];[1:v]trim=start_frame=290:end_frame=3390,setpts=PTS-STARTPTS[b];[h][b]concat=n=2:v=1:a=0,scale=in_range=pc:out_range=tv[v]','-map','[v]','-map','2:a:0','-t','113']
command+=['-af','volume=0.9,apad','-r','30','-c:v','libx264','-preset','fast','-crf','20' if preview else '17','-pix_fmt','yuv420p','-color_range','tv','-threads','2','-c:a','aac','-b:a','192k','-movflags','+faststart','-y',str(OUT/('preview.mp4' if preview else 'selling-a-phone-v4.mp4'))]
subprocess.run(command,check=True)
print('Packaged v4 with the original narration and approved v3 body frames.')
