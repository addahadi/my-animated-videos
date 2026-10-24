import site
import sys
from pathlib import Path
sys.path.append(site.getusersitepackages())
from PIL import Image, ImageDraw

root=Path(__file__).resolve().parents[1]
files=sorted((root/'output'/'stills').glob('*.png'))
width,height=300,560
sheet=Image.new('RGB',(width*5,height*((len(files)+4)//5)),'#26252c')
draw=ImageDraw.Draw(sheet)
for index,path in enumerate(files):
    frame=Image.open(path).convert('RGB')
    frame.thumbnail((290,520))
    x=(index%5)*width+(width-frame.width)//2
    y=(index//5)*height
    sheet.paste(frame,(x,y))
    draw.text(((index%5)*width+10,y+526),f'{int(path.stem.split("-")[1])/10:.1f}s',fill='white')
sheet.save(root/'output'/'storyboard-v2.jpg',quality=94)
