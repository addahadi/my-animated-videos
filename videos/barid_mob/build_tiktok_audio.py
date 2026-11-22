"""Joins the 5 TikTok recordings into public/baridimob-scams/voice-tiktok.wav (silence trimmed only).

Trims (seconds in each source file) come from silencedetect (-35 dB, 0.2 s); 0.10 s kept before the first
word, ~0.13 s after the last. 0.30 s between recordings, 0.60 s at the end. Originals are untouched.
Run: .venv/Scripts/python.exe -I videos/barid_mob/build_tiktok_audio.py
"""
import subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
FF = ROOT / "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"
SR = 48000
KEEP = [(1, 1.72, 12.70), (2, 0.95, 10.20), (3, 0.56, 6.65), (4, 1.47, 7.70), (5, 0.19, 10.00)]
GAP, TAIL = 0.30, 0.60


def load(i):
    tmp = Path(tempfile.gettempdir()) / f"bm_tiktok_{i}.wav"
    subprocess.run([str(FF), "-v", "error", "-y", "-i", str(ROOT / f"videos/barid_mob/tiktok/audio{i}.ogg"),
                    "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", str(tmp)], check=True)
    with wave.open(str(tmp)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), np.int16)


parts, t = [], 0.0
for n, (i, a, b) in enumerate(KEEP):
    x = load(i)[int(a * SR): int(b * SR)].astype(float)
    f = int(0.01 * SR)  # 10 ms fades against clicks
    x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    print(f"audio{i}: {a:.2f}-{b:.2f} -> master {t:.3f}-{t + len(x) / SR:.3f}")
    parts.append(x); t += len(x) / SR
    pad = GAP if n < len(KEEP) - 1 else TAIL
    parts.append(np.zeros(int(round(pad * SR)))); t += pad
y = np.concatenate(parts).astype(np.int16)
out = ROOT / "public/baridimob-scams/voice-tiktok.wav"
with wave.open(str(out), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("duration", len(y) / SR)
