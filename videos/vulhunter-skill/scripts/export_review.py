"""Save a review still from the actual encoded final frame."""
import site
import sys
from pathlib import Path
import av
sys.path.append(site.getusersitepackages())
from PIL import Image

root=Path(__file__).resolve().parents[1]
with av.open(str(root/'output'/'vulnhunter-instagram.mp4')) as container:
    stream=container.streams.video[0]
    container.seek(int(69.9/stream.time_base),stream=stream,backward=True)
    last=None
    for frame in container.decode(video=0):
        last=frame
    if last is None:
        raise RuntimeError('Final frame unavailable')
    last.to_image().save(root/'output'/'final-frame.jpg',quality=95)
    print(f'Final reviewed frame at {last.time:.3f}s')
