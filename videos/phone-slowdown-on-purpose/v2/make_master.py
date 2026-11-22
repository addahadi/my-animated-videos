"""Build the V2 narration master for phone-slowdown-v2.

New intro (replaces audio1-3) + unchanged audio4..audio10. Only leading/trailing
silence is trimmed; 0.25 s gaps between clips; 2.0 s tail for the end card.
Originals in ../inputs are never modified. Run from the workspace root:
  .venv/Scripts/python.exe videos/phone-slowdown-on-purpose/v2/make_master.py
"""
import json, subprocess, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[3]
INP = ROOT / "videos/phone-slowdown-on-purpose/inputs"
OUT = Path(__file__).resolve().parent
FFMPEG = ROOT / "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"
SR, GAP, TAIL, FADE = 48000, 0.25, 2.0, 0.008

# (clip, srcIn, srcOut) measured: RMS > -38 dBFS on 10 ms windows, ~0.07 s padding
CLIPS = [
    ("audio_2026-11-15_20-01-11.ogg", 0.85, 12.08),
    ("audio4.ogg", 0.42, 10.80),
    ("audio5.ogg", 0.04, 17.41),
    ("audio6.ogg", 0.06, 10.12),
    ("audio7.ogg", 0.12, 8.91),
    ("audio8.ogg", 0.00, 10.92),
    ("audio9.ogg", 0.08, 9.14),
    ("audio10.ogg", 0.17, 12.57),
]

def decode(path):
    import tempfile, os
    fd, tmp = tempfile.mkstemp(suffix=".wav"); os.close(fd)
    try:
        subprocess.run([str(FFMPEG), "-v", "error", "-y", "-i", str(path), "-ac", "1", "-ar", str(SR), tmp], check=True)
        with wave.open(tmp) as w:
            return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
    finally:
        os.remove(tmp)

parts, edit, t = [], [], 0.0
for i, (name, a, b) in enumerate(CLIPS):
    x = decode(INP / name)[int(round(a * SR)):int(round(b * SR))].copy()
    f = int(FADE * SR); ramp = np.linspace(0, 1, f, dtype=np.float32)
    x[:f] *= ramp; x[-f:] *= ramp[::-1]
    if i: parts.append(np.zeros(int(round(GAP * SR)), np.float32)); t += GAP
    parts.append(x)
    edit.append({"clip": name, "srcInSec": a, "srcOutSec": b,
                 "masterStartSec": round(t, 3), "masterEndSec": round(t + len(x) / SR, 3)})
    t += len(x) / SR
speech_end = t
parts.append(np.zeros(int(round(TAIL * SR)), np.float32))
y = np.clip(np.concatenate(parts), -32768, 32767).astype(np.int16)
with wave.open(str(OUT / "narration-master.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
info = {"file": "narration-master.wav", "samples": len(y), "durationSec": len(y) / SR,
        "speechEndSec": round(speech_end, 3), "gapSec": GAP, "tailSec": TAIL, "narrationEdit": edit}
(OUT / "narration-master.json").write_text(json.dumps(info, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(info, indent=1))
