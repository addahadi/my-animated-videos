import sys
from pathlib import Path
from PIL import Image, ImageDraw
d = Path("out/stills/gta6-fake-download")
files = sorted(d.glob("f*.png")) if len(sys.argv) < 3 else [d / f"f{int(x):04d}.png" for x in sys.argv[2:]]
W, H, cols = 432, 768, 4
for k in range(0, len(files), 8):
    chunk = files[k:k+8]
    rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new("RGB", (W*cols, H*rows), "white")
    for i, f in enumerate(chunk):
        im = Image.open(f).convert("RGB").resize((W, H))
        dr = ImageDraw.Draw(im); dr.rectangle([0,0,110,26], fill="black"); dr.text((6,6), f.stem, fill="white")
        sheet.paste(im, ((i % cols)*W, (i//cols)*H))
    out = d / f"{sys.argv[1] if len(sys.argv)>1 else 'sheet'}-{k//8}.jpg"
    sheet.save(out, quality=82); print(out)
