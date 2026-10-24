"""Extract reference frames and measurable soundtrack characteristics."""
import json
import site
import sys
import wave
from pathlib import Path

import av
import numpy as np
try:
    from PIL import Image, ImageDraw
except ModuleNotFoundError:
    # Reuse Pillow already installed for this interpreter's user account.
    sys.path.append(site.getusersitepackages())
    from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding="utf-8")
root = Path(__file__).resolve().parents[1]
source = root / "inputs" / "post2.mp4"
out = root / "analysis" / "reference"
out.mkdir(parents=True, exist_ok=True)
with av.open(str(source)) as container:
    stream = container.streams.video[0]
    duration = float(container.duration / av.time_base)
    metadata = {"duration": duration, "width": stream.width, "height": stream.height,
                "fps": float(stream.average_rate), "audio": []}
    targets = np.linspace(0.3, duration - 0.3, 24)
    frames = []
    index = 0
    for frame in container.decode(video=0):
        if index < len(targets) and float(frame.time) >= targets[index]:
            still = frame.to_image()
            still.save(out / f"frame-{index:02d}.jpg", quality=92)
            frames.append((float(frame.time), still))
            index += 1
        if index >= len(targets):
            break
sheet = Image.new("RGB", (4 * 300, 6 * 555), "#202020")
draw = ImageDraw.Draw(sheet)
for index, (at, still) in enumerate(frames):
    still.thumbnail((290, 520))
    x = (index % 4) * 300 + (300 - still.width) // 2
    y = (index // 4) * 555
    sheet.paste(still, (x, y))
    draw.text(((index % 4) * 300 + 8, y + 526), f"{at:.2f}s", fill="white")
sheet.save(out / "contact-sheet.jpg", quality=92)

chunks = []
with av.open(str(source)) as container:
    for stream in container.streams.audio:
        metadata["audio"].append({"rate": stream.rate, "channels": stream.channels,
                                   "codec": stream.codec_context.name})
    resampler = av.AudioResampler(format="fltp", layout="stereo", rate=24000)
    for frame in container.decode(audio=0):
        chunks.extend(part.to_ndarray() for part in resampler.resample(frame))
    chunks.extend(part.to_ndarray() for part in resampler.resample(None))
audio = np.concatenate(chunks, axis=1)
np.save(out / "audio-stereo-24k.npy", audio)
with wave.open(str(out / "reference-audio.wav"), "wb") as target:
    target.setnchannels(2)
    target.setsampwidth(2)
    target.setframerate(24000)
    target.writeframes((np.clip(audio.T, -1, 1) * 32767).astype("<i2").tobytes())
mid = audio.mean(axis=0)
side = (audio[0] - audio[1]) / 2
metadata["audio_rms"] = float(np.sqrt(np.mean(audio ** 2)))
metadata["side_rms"] = float(np.sqrt(np.mean(side ** 2)))
metadata["mid_rms"] = float(np.sqrt(np.mean(mid ** 2)))
metadata["lr_correlation"] = float(np.corrcoef(audio)[0, 1])

# Frequency bands and onset autocorrelation help distinguish a quiet ambient
# bed from a rhythmic/bass-heavy cue, even when the narrator occupies the mid.
size, hop = 2048, 240
matrix = np.lib.stride_tricks.sliding_window_view(mid, size)[::hop]
spectra = np.abs(np.fft.rfft(matrix * np.hanning(size), axis=1))
frequencies = np.fft.rfftfreq(size, 1 / 24000)
bands = {}
for low, high in [(30, 80), (80, 180), (180, 400), (400, 2000), (2000, 6000), (6000, 12000)]:
    power = spectra[:, (frequencies >= low) & (frequencies < high)] ** 2
    bands[f"{low}-{high}Hz"] = float(power.mean())
metadata["band_power"] = bands
low = spectra[:, (frequencies >= 35) & (frequencies < 180)]
flux = np.maximum(np.diff(np.log1p(low), axis=0), 0).mean(axis=1)
flux -= flux.mean()
correlations = np.correlate(flux, flux, "full")[len(flux) - 1:]
candidates = []
for lag in range(30, 151):
    if correlations[lag] > correlations[lag - 1] and correlations[lag] >= correlations[lag + 1]:
        candidates.append({"bpm": 6000 / lag,
                           "strength": float(correlations[lag] / correlations[0])})
metadata["tempo_candidates_not_confirmed"] = sorted(candidates, key=lambda x: -x["strength"])[:8]
metadata["low_bass_peaks_hz"] = frequencies[np.argsort((low ** 2).mean(axis=0))[-10:] + np.flatnonzero((frequencies >= 35) & (frequencies < 180))[0]].tolist()
(out / "inspection.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
print(json.dumps(metadata, indent=2))
print(f"CONTACT SHEET {out / 'contact-sheet.jpg'}")
