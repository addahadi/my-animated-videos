"""Synthesize the music bed for gta6-fake-download and the shared buzz SFX (numpy only, no downloads).

Original track, A minor, 100 BPM, arranged on the timeline's sections:
  hook pulse -> drop on the كذب stamp -> groove -> riser into the open loop ->
  dark "inside the malware" -> groove -> miner pulse -> thin bed under the checklist ->
  stop-hit on the strike -> resolve and fade.
The bed is mixed ~20 dB under the voice (RMS) and baked, so Remotion plays it at volume 1.
Run from the workspace root: .venv/Scripts/python.exe -I videos/GTA_6/make_audio.py
"""
import json, wave
from pathlib import Path
import numpy as np

SR = 48000
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = ROOT / "public" / "gta6-fake-download"
OUT.mkdir(parents=True, exist_ok=True)
SFX = ROOT / "public" / "sfx"
rng = np.random.default_rng(66)

TL = json.loads((ROOT / "plans/gta6-fake-download-timeline.json").read_text(encoding="utf-8"))
DUR = TL["audioDurationSec"]
N = int(round(DUR * SR))
BEAT = 60 / 100
# section boundaries (seconds) from the timeline
DROP, LOOP_IN, DARK_IN, DARK_OUT, MINER_IN, LIST_IN, PAY_IN, STRIKE, CTA_IN = 6.15, 18.17, 20.31, 29.08, 38.24, 43.95, 55.97, 59.13, 60.65


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(SR * d)) / SR


def lowpass(sig, fc):
    f = np.fft.rfftfreq(len(sig), 1 / SR)
    return np.fft.irfft(np.fft.rfft(sig) / np.sqrt(1 + (f / fc) ** 4), len(sig))


def highpass(sig, fc):
    f = np.fft.rfftfreq(len(sig), 1 / SR)
    return np.fft.irfft(np.fft.rfft(sig) * (1 - 1 / np.sqrt(1 + (f / fc) ** 4)), len(sig))


def add(buf, at, sig, gain=1.0):
    i = int(round(at * SR))
    if i >= len(buf) or i + len(sig) <= 0:
        return
    j = min(len(buf), i + len(sig))
    buf[max(i, 0):j] += gain * sig[max(0, -i):j - i]


def env(n, a=0.005, r=0.2):
    x = np.arange(n) / SR
    return np.clip(x / a, 0, 1) * np.exp(-x / r)


def kick():
    x = tt(0.35)
    f = 48 + 90 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.12)


def hat(open_=False):
    x = tt(0.18 if open_ else 0.05)
    return highpass(rng.standard_normal(len(x)), 7000) * env(len(x), 0.001, 0.06 if open_ else 0.015)


def bass(note, d):
    x = tt(d)
    f = midi(note)
    s = 0.7 * np.sin(2 * np.pi * f * x) + 0.3 * np.sign(np.sin(2 * np.pi * f * x)) * 0.5
    return lowpass(s, 300) * env(len(x), 0.004, d * 0.6)


def pad(notes, d, fc=1400):
    x = tt(d)
    s = sum(np.sin(2 * np.pi * midi(n) * x * (1 + k * 0.003)) for n in notes for k in (-1, 1))
    a = np.minimum(1, np.minimum(x / 0.4, (d - x) / 0.5).clip(0))
    return lowpass(s, fc) * a / (2 * len(notes))


def pluck(note, d=0.3):
    x = tt(d)
    f = midi(note)
    s = np.sign(np.sin(2 * np.pi * f * x)) * 0.5 + np.sin(2 * np.pi * 2 * f * x) * 0.3
    return lowpass(s, 2200) * env(len(x), 0.002, 0.09)


def riser(d):
    x = tt(d)
    n = rng.standard_normal(len(x))
    out = np.zeros_like(n)
    for k in range(8):  # sweep a band upward in chunks
        a, b = k * len(x) // 8, (k + 1) * len(x) // 8
        out[a:b] = highpass(lowpass(n[a:b], 800 * 2 ** (k * 0.5)), 300 * 2 ** (k * 0.5))
    return out * (x / d) ** 2


def impact():
    x = tt(1.2)
    return (np.sin(2 * np.pi * 45 * x) * env(len(x), 0.002, 0.35) + lowpass(rng.standard_normal(len(x)), 900) * env(len(x), 0.001, 0.08))


# chord loop: Am - F - Dm - E (2 beats each... 4 beats each = one bar)
PROG = [(57, [57, 60, 64]), (53, [53, 57, 60]), (50, [50, 53, 57]), (52, [52, 56, 59])]
DARK = [(45, [57, 60, 63]), (46, [58, 61, 65])]  # Am(b5)-ish / Bb: darker colour
ARP = [69, 72, 76, 72, 69, 76, 74, 72]

mus = np.zeros(N)
bar = 4 * BEAT


def in_(t, a, b):
    return a <= t < b


# Hook: muted 8th-note bass pulse on A + tick, filtered; riser into the drop
t = 0.0
while t < DROP - 0.05:
    add(mus, t, lowpass(bass(45, BEAT / 2), 180), 0.55)
    add(mus, t + BEAT / 4, hat(), 0.12)
    t += BEAT / 2
add(mus, 0.0, pad([57, 60, 64], DROP, 700), 0.35)
add(mus, DROP - 2.0, riser(2.0), 0.25)
add(mus, DROP, impact(), 0.9)

# Main body, bar by bar
b0 = DROP
k = 0
while b0 < CTA_IN:
    t0 = b0
    dark = in_(t0, DARK_IN, DARK_OUT) or in_(t0, MINER_IN, LIST_IN)
    thin = in_(t0, LIST_IN, PAY_IN)
    root, chord = (DARK[k % 2] if dark else PROG[k % 4])
    add(mus, t0, pad(chord, bar, 900 if dark else 1500), 0.45 if not thin else 0.35)
    for s in range(8):  # 8th notes
        ts = t0 + s * BEAT / 2
        if ts >= CTA_IN or in_(ts, STRIKE - 0.05, STRIKE + 0.6) or in_(ts, LOOP_IN + 1.6, DARK_IN):
            continue
        if not thin:
            if s % 2 == 0:
                add(mus, ts, bass(root - 12, BEAT / 2), 0.5)
            if s in (0, 4) or (s == 7 and dark):
                add(mus, ts, kick(), 0.55)
        add(mus, ts + BEAT / 4 if s % 2 else ts, hat(s == 6), 0.10 if thin else 0.14)
        if dark or in_(ts, DARK_OUT, MINER_IN):
            add(mus, ts, pluck(ARP[s] - (12 if dark else 0)), 0.16)
        if thin and s % 2 == 0:
            add(mus, ts, pluck([69, 72, 76, 79][(s // 2)] ), 0.09)
    b0 += bar
    k += 1

# Riser into the open loop, impact on the unlock
add(mus, LOOP_IN, riser(DARK_IN - LOOP_IN), 0.28)
add(mus, DARK_IN - 0.2, impact(), 0.6)
add(mus, MINER_IN - 0.25, impact(), 0.45)
add(mus, PAY_IN - 0.2, impact(), 0.6)
add(mus, STRIKE - 0.3, impact(), 0.7)

# Outro: resolve on A minor, ring out and fade
add(mus, CTA_IN, pad([57, 60, 64, 69], DUR - CTA_IN, 1600), 0.5)
add(mus, CTA_IN, bass(33, 2.5), 0.5)
t = CTA_IN
for i, n in enumerate([69, 72, 76, 81, 76, 72, 69, 64]):
    add(mus, t + i * BEAT / 2, pluck(n), 0.12)

# Fades
fi = int(0.05 * SR)
mus[:fi] *= np.linspace(0.4, 1, fi)  # starts audibly on frame 0
fo = int(1.0 * SR)
mus[-fo:] *= np.linspace(1, 0, fo) ** 1.5


def rms(x):
    return np.sqrt((x ** 2).mean())


# Level: ~20 dB under the voice's speech RMS
with wave.open(str(HERE / "narration-master.wav")) as w:
    voice = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
v_rms = rms(voice[np.abs(voice) > 0.01])
mus *= (v_rms * 10 ** (-20 / 20)) / rms(mus[: int(CTA_IN * SR)])
peak = np.abs(mus).max()
if peak > 0.5:
    mus *= 0.5 / peak


def write(path, x):
    y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())


write(OUT / "music.wav", mus)

# Phone buzz SFX (two vibration pulses), peak -3 dBFS like the shared library
x = tt(0.62)
vib = np.sign(np.sin(2 * np.pi * 165 * x)) * 0.6 + np.sin(2 * np.pi * 330 * x) * 0.4
gate = ((x < 0.24) | ((x > 0.34) & (x < 0.58))).astype(float)
gate = np.convolve(gate, np.ones(240) / 240, mode="same")
buzz = lowpass(vib, 900) * gate
buzz *= 10 ** (-3 / 20) / np.abs(buzz).max()
write(SFX / "buzz.wav", buzz)

print(json.dumps({"music": str(OUT / "music.wav"), "durationSec": len(mus) / SR,
                  "musicRmsDb": float(round(20 * np.log10(rms(mus)), 1)), "voiceRmsDb": float(round(20 * np.log10(v_rms), 1)),
                  "buzz": str(SFX / "buzz.wav")}, indent=1))
