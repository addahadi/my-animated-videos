"""Build the narration master for gta6-fake-download.

audio1-3 and audio5-9 in order. audio4 is an earlier take of the same line as
audio5 and is not used (audio5 chosen; swap CLIPS entry to use audio4).
Only leading/trailing silence is trimmed (RMS > -38 dBFS, ~0.07 s padding).
Gaps: 0.45 s before the verdict (audio2), 1.0 s after the checklist (audio8,
save-frame hold), 0.25 s elsewhere; 2.0 s tail for the end card.
Originals in inputs/ are never modified. Run from the workspace root:
  .venv/Scripts/python.exe videos/GTA_6/make_master.py
"""
import json, subprocess, wave, tempfile, os
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
INP = Path(__file__).resolve().parent / "inputs"
OUT = Path(__file__).resolve().parent
FFMPEG = ROOT / "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"
SR, TAIL, FADE = 48000, 2.0, 0.008
# (clip, srcIn, srcOut, gapAfter)
CLIPS = [
    ("audio1.ogg", 1.93, 7.83, 0.45),
    ("audio2.ogg", 1.53, 7.63, 0.25),
    ("audio3.ogg", 1.84, 9.20, 0.25),
    ("audio5.ogg", 1.50, 10.02, 0.25),
    ("audio6.ogg", 1.19, 10.10, 0.25),
    ("audio7.ogg", 1.37, 6.83, 0.25),
    ("audio8.ogg", 1.51, 12.53, 1.00),
    ("audio9.ogg", 1.24, 7.73, 0.0),
]

def decode(path):
    fd, tmp = tempfile.mkstemp(suffix=".wav"); os.close(fd)
    try:
        subprocess.run([str(FFMPEG), "-v", "error", "-y", "-i", str(path), "-ac", "1", "-ar", str(SR), tmp], check=True)
        with wave.open(tmp) as w:
            return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
    finally:
        os.remove(tmp)

parts, edit, t = [], [], 0.0
for name, a, b, gap in CLIPS:
    x = decode(INP / name)[int(round(a * SR)):int(round(b * SR))].copy()
    f = int(FADE * SR); ramp = np.linspace(0, 1, f, dtype=np.float32)
    x[:f] *= ramp; x[-f:] *= ramp[::-1]
    parts.append(x)
    edit.append({"clip": name, "srcInSec": a, "srcOutSec": b,
                 "masterStartSec": round(t, 3), "masterEndSec": round(t + len(x) / SR, 3)})
    t += len(x) / SR
    if gap: parts.append(np.zeros(int(round(gap * SR)), np.float32)); t += gap
speech_end = t
parts.append(np.zeros(int(round(TAIL * SR)), np.float32))
y = np.clip(np.concatenate(parts), -32768, 32767).astype(np.int16)
with wave.open(str(OUT / "narration-master.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
info = {"file": "videos/GTA_6/narration-master.wav", "samples": len(y), "durationSec": len(y) / SR,
        "speechEndSec": round(speech_end, 3), "tailSec": TAIL, "unusedTakes": ["audio4.ogg (earlier take of audio5)"],
        "narrationEdit": edit}
(OUT / "narration-master.json").write_text(json.dumps(info, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(info, indent=1))
