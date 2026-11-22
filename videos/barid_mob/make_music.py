"""Synthesize the music bed for baridimob-scams (numpy only, no downloads).

Original track, D minor, 96 BPM, arranged on the timeline's sections:
  tense pulse under the hook -> impact on "صفر" -> groove through tricks 1 and 2 ->
  riser into the dark trick-3 scene -> darker bed with arp, impact on the 3D tilt ->
  thin bed under the rule and the checklist -> lighter resolve under the share + loop, fade.
Mixed ~20 dB under the voice (speech RMS) and baked, so Remotion plays it at volume 1.
Run from the workspace root: .venv/Scripts/python.exe -I videos/barid_mob/make_music.py
"""
import json, wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parents[2]
SLUG = "baridimob-scams"
OUT = ROOT / "public" / SLUG
rng = np.random.default_rng(1530)

TL = json.loads((ROOT / f"plans/{SLUG}-timeline.json").read_text(encoding="utf-8"))
SC = {s["id"]: s for s in TL["scenes"]}
DUR = SC[8]["endSec"]
N = int(round(DUR * SR))
BEAT = 60 / 96
ZERO = SC[1]["props"]["events"][1]["sec"]
DARK_IN, DARK_OUT = SC[5]["startSec"], SC[5]["endSec"]
TILT = SC[5]["props"]["events"][9]["sec"]
THIN_IN = SC[6]["startSec"]
CTA_IN = SC[8]["startSec"]


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
    f = 46 + 85 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.12)


def hat(open_=False):
    x = tt(0.18 if open_ else 0.05)
    return highpass(rng.standard_normal(len(x)), 7000) * env(len(x), 0.001, 0.06 if open_ else 0.015)


def bass(note, d):
    x = tt(d)
    f = midi(note)
    s = 0.7 * np.sin(2 * np.pi * f * x) + 0.15 * np.sign(np.sin(2 * np.pi * f * x))
    return lowpass(s, 280) * env(len(x), 0.004, d * 0.6)


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
    for k in range(8):
        a, b = k * len(x) // 8, (k + 1) * len(x) // 8
        out[a:b] = highpass(lowpass(n[a:b], 800 * 2 ** (k * 0.5)), 300 * 2 ** (k * 0.5))
    return out * (x / d) ** 2


def impact():
    x = tt(1.2)
    return np.sin(2 * np.pi * 43 * x) * env(len(x), 0.002, 0.35) + lowpass(rng.standard_normal(len(x)), 900) * env(len(x), 0.001, 0.08)


PROG = [(50, [62, 65, 69]), (46, [58, 62, 65]), (48, [60, 64, 67]), (45, [57, 61, 64])]  # Dm Bb C A
DARK = [(50, [62, 65, 68]), (51, [63, 66, 70])]  # Dm(b5) / Eb: darker colour
ARP = [74, 77, 81, 77, 74, 81, 79, 77]
LIGHT = [(46, [58, 62, 65, 69]), (48, [60, 64, 67, 72]), (50, [62, 65, 69, 74]), (50, [62, 65, 69, 74])]

mus = np.zeros(N)
bar = 4 * BEAT

# Hook: muted 8th bass pulse on D + ticks, impact on "صفر"
t = 0.0
while t < SC[2]["startSec"]:
    add(mus, t, lowpass(bass(38, BEAT / 2), 170), 0.55)
    add(mus, t + BEAT / 4, hat(), 0.12)
    t += BEAT / 2
add(mus, 0.0, pad([62, 65, 69], SC[2]["startSec"], 650), 0.35)
add(mus, ZERO - 0.03, impact(), 0.8)

# Body bar by bar, from scene 2 to the CTA
b0, k = SC[2]["startSec"], 0
while b0 < CTA_IN:
    dark = DARK_IN <= b0 < DARK_OUT
    thin = THIN_IN <= b0 < CTA_IN
    root, chord = DARK[k % 2] if dark else PROG[k % 4]
    add(mus, b0, pad(chord, bar, 850 if dark else 1500), 0.32 if thin else 0.45)
    for s in range(8):
        ts = b0 + s * BEAT / 2
        if ts >= CTA_IN or (DARK_IN - 1.8 <= ts < DARK_IN):
            continue
        if not thin:
            if s % 2 == 0:
                add(mus, ts, bass(root - 12, BEAT / 2), 0.5)
            if s in (0, 4) or (s == 7 and dark):
                add(mus, ts, kick(), 0.5)
        add(mus, ts + BEAT / 4 if s % 2 else ts, hat(s == 6), 0.09 if thin else 0.13)
        if dark:
            add(mus, ts, pluck(ARP[s] - 12), 0.15)
        if thin and s % 2 == 0:
            add(mus, ts, pluck([74, 77, 81, 84][s // 2]), 0.08)
    b0 += bar
    k += 1

add(mus, DARK_IN - 1.8, riser(1.8), 0.28)
add(mus, DARK_IN - 0.05, impact(), 0.6)
add(mus, TILT - 0.05, impact(), 0.45)
add(mus, THIN_IN - 0.05, impact(), 0.4)

# Share + loop: lighter (relative major colour), ring out
for i, (root, chord) in enumerate(LIGHT):
    t0 = CTA_IN + i * bar * 0.5
    if t0 >= DUR:
        break
    add(mus, t0, pad(chord, min(bar * 0.5 + 0.4, DUR - t0), 1700), 0.45)
    add(mus, t0, bass(root - 12, bar * 0.5), 0.4)
for i, n in enumerate([74, 77, 81, 86, 81, 77, 74, 69]):
    add(mus, CTA_IN + 0.2 + i * BEAT / 2, pluck(n), 0.1)

fi = int(0.05 * SR)
mus[:fi] *= np.linspace(0.4, 1, fi)
fo = int(1.0 * SR)
mus[-fo:] *= np.linspace(1, 0, fo) ** 1.5


def rms(x):
    return np.sqrt((x ** 2).mean())


with wave.open(str(OUT / "voice.wav")) as w:
    voice = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
v_rms = rms(voice[np.abs(voice) > 0.01])
mus *= (v_rms * 10 ** (-20 / 20)) / rms(mus[: int(CTA_IN * SR)])
peak = np.abs(mus).max()
if peak > 0.5:
    mus *= 0.5 / peak

y = (np.clip(mus, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "music.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print(json.dumps({"music": str(OUT / "music.wav"), "durationSec": len(mus) / SR,
                  "musicRmsDb": float(round(20 * np.log10(rms(mus)), 1)), "voiceRmsDb": float(round(20 * np.log10(v_rms), 1))}, indent=1))
