"""Package the rendered picture with the original PCM narration using full FFmpeg."""
from pathlib import Path
import shutil, subprocess
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'exports'
RAW=OUT/'render-source.mp4'
FINAL=OUT/'selling-a-phone-design2.mp4'
if not RAW.exists():
    shutil.copy2(FINAL,RAW)
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-i',str(RAW),'-i',str(ROOT/'media/narration.wav'),'-map','0:v:0','-map','1:a:0','-vf','scale=in_range=pc:out_range=tv','-af','volume=0.9,apad','-t','113','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-color_range','tv','-threads','2','-c:a','aac','-b:a','192k','-movflags','+faststart','-y',str(FINAL)],check=True)
print('Final package: limited-range yuv420p and correctly timestamped original narration.')
