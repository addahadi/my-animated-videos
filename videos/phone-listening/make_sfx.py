"""Synthesize the shared Runtime.tech SFX library into public/sfx/ (numpy only, no downloads).

Run: .venv/Scripts/python.exe -I videos/phone-listening/make_sfx.py
Every sound is short, soft-edged and peak-normalised to -3 dBFS; loudness is set per use in Remotion.
"""
import wave
from pathlib import Path
import numpy as np

SR = 48000
OUT = Path(__file__).resolve().parents[2] / "public" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env_ad(n, a, d, curve=4.0):
    """attack (s) then exponential-ish decay over the rest."""
    x = np.arange(n) / SR
    at = np.clip(x / max(a, 1e-4), 0, 1)
    dec = np.exp(-curve * np.clip(x - a, 0, None) / max(d, 1e-4))
    return at * dec


def bandpass(sig, lo, hi, soft=0.15):
    """FFT band-pass with soft (log-spaced) edges."""
    n = len(sig)
    f = np.fft.rfftfreq(n, 1 / SR)
    S = np.fft.rfft(sig)
    lf = np.log2(np.maximum(f, 1))
    g = 1 / (1 + np.exp(-(lf - np.log2(max(lo, 1))) / soft)) * 1 / (1 + np.exp((lf - np.log2(hi)) / soft))
    return np.fft.irfft(S * g, n)


def sweep_filter(sig, f0, f1, width=0.6, chunks=48):
    """time-varying band-pass (center moves f0 -> f1 on a log scale), overlap-add."""
    n = len(sig)
    hop = n // chunks
    win = np.hanning(hop * 2)
    out = np.zeros(n + hop * 2)
    for k in range(chunks + 1):
        s = k * hop
        seg = sig[s:s + hop * 2]
        if len(seg) < hop * 2:
            seg = np.pad(seg, (0, hop * 2 - len(seg)))
        c = f0 * (f1 / f0) ** (k / chunks)
        out[s:s + hop * 2] += bandpass(seg * win, c * 2 ** -width, c * 2 ** width)
    return out[:n]


def reverb(sig, decay=0.35, mix=0.18):
    """tiny synthetic room: exponentially decaying filtered noise impulse."""
    ir_len = int(SR * decay)
    ir = rng.standard_normal(ir_len) * np.exp(-6 * np.arange(ir_len) / ir_len)
    ir = bandpass(ir, 300, 7000)
    ir /= np.abs(ir).sum() / 6
    wet = np.fft.irfft(np.fft.rfft(sig, len(sig) + ir_len) * np.fft.rfft(ir, len(sig) + ir_len))[: len(sig) + ir_len]
    dry = np.pad(sig, (0, ir_len))
    return dry * (1 - mix) + wet * mix


def fade(sig, fi=0.002, fo=0.02):
    a, b = int(SR * fi), int(SR * fo)
    sig = sig.copy()
    if a:
        sig[:a] *= np.linspace(0, 1, a)
    if b:
        sig[-b:] *= np.linspace(1, 0, b)
    return sig


def save(name, sig, peak_db=-3.0):
    sig = fade(np.asarray(sig, dtype=float))
    sig = sig / (np.abs(sig).max() + 1e-9) * 10 ** (peak_db / 20)
    st = np.stack([sig, sig], axis=1)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())
    print(f"{name}.wav  {len(sig) / SR:.2f}s")


def sine_glide(f0, f1, d, phase_curve=1.0):
    x = t(d)
    f = f0 * (f1 / f0) ** ((x / d) ** phase_curve)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# ---- pop: soft bubbly UI pop (sticker / card appear)
x = sine_glide(1150, 520, 0.11, 0.6) * env_ad(int(SR * 0.11), 0.002, 0.07, 5)
click = bandpass(rng.standard_normal(int(SR * 0.11)), 2500, 9000) * env_ad(int(SR * 0.11), 0.0005, 0.006, 6) * 0.35
save("pop", reverb(x + click, 0.25, 0.12))

# ---- pop-soft: lighter, higher pop for rows / chips
x = sine_glide(1600, 900, 0.07, 0.5) * env_ad(int(SR * 0.07), 0.001, 0.045, 5)
save("pop-soft", reverb(x, 0.2, 0.1))

# ---- stamp: rubber stamp thud (paper slap + low body)
n = int(SR * 0.42)
body = sine_glide(120, 52, 0.42, 0.4) * env_ad(n, 0.002, 0.18, 5)
slap = bandpass(rng.standard_normal(n), 400, 5000) * env_ad(n, 0.0008, 0.035, 6) * 0.9
grit = bandpass(rng.standard_normal(n), 2000, 8000) * env_ad(n, 0.001, 0.012, 6) * 0.25
save("stamp", reverb(body * 1.1 + slap + grit, 0.3, 0.12))

# ---- whoosh: airy band sweep up then down
n = int(SR * 0.55)
noise = rng.standard_normal(n)
w = sweep_filter(noise, 350, 2600, 0.7)
e = np.sin(np.pi * np.clip(np.arange(n) / n, 0, 1)) ** 2.2
save("whoosh", reverb(w * e, 0.3, 0.15))

# ---- whoosh-short: quick transition swish
n = int(SR * 0.3)
w = sweep_filter(rng.standard_normal(n), 700, 4500, 0.6, 32)
e = np.sin(np.pi * np.arange(n) / n) ** 3
save("whoosh-short", w * e)

# ---- tick: crisp counter tick
n = int(SR * 0.035)
tk = (np.sin(2 * np.pi * 3200 * t(0.035)) * 0.6 + bandpass(rng.standard_normal(n), 3000, 10000)) * env_ad(n, 0.0003, 0.008, 6)
save("tick", tk, -6)

# ---- tick-roll: counter rolling (accelerating ticks, 1.4 s)
d = 1.4
out = np.zeros(int(SR * d))
times = np.cumsum(np.linspace(0.11, 0.035, 26))
times = times[times < d - 0.05]
for i, tt in enumerate(times):
    s = int(tt * SR)
    g = 0.5 + 0.5 * i / len(times)
    out[s:s + len(tk)] += tk * g
save("tick-roll", out, -6)

# ---- scan: soft electronic scan sweep with shimmer
n = int(SR * 0.7)
base = sine_glide(300, 1400, 0.7, 1.0) * 0.5 + sine_glide(600, 2800, 0.7, 1.0) * 0.18
shimmer = sweep_filter(rng.standard_normal(n), 2000, 7000, 0.4, 32) * 0.25
e = np.sin(np.pi * np.arange(n) / n) ** 1.5
save("scan", reverb((base + shimmer) * e, 0.35, 0.2))

# ---- shutter: modern camera shutter (two mechanical clicks)
n = int(SR * 0.22)
sh = np.zeros(n)
for at_s, g, lo in [(0.0, 1.0, 1500), (0.075, 0.7, 2500)]:
    s = int(at_s * SR)
    m = int(SR * 0.05)
    c = bandpass(rng.standard_normal(m), lo, 9000) * env_ad(m, 0.0004, 0.012, 6) * g
    c += np.sin(2 * np.pi * 180 * t(0.05)) * env_ad(m, 0.0005, 0.02, 6) * 0.4 * g
    sh[s:s + m] += c
save("shutter", reverb(sh, 0.2, 0.1))

# ---- type: soft keyboard typing (6 keys, 0.75 s)
d = 0.75
ty = np.zeros(int(SR * d))
for i, tt in enumerate([0.0, 0.11, 0.24, 0.33, 0.47, 0.6]):
    s = int(tt * SR)
    m = int(SR * 0.04)
    k = bandpass(rng.standard_normal(m), 1200 + 300 * (i % 3), 6000) * env_ad(m, 0.0004, 0.01, 6)
    k += np.sin(2 * np.pi * (260 + 30 * (i % 2)) * t(0.04)) * env_ad(m, 0.0005, 0.012, 6) * 0.5
    ty[s:s + m] += k * (0.8 + 0.2 * ((i * 7) % 3) / 2)
save("type", ty, -5)

# ---- lock: small metallic latch click
n = int(SR * 0.18)
lk = bandpass(rng.standard_normal(n), 2500, 9000) * env_ad(n, 0.0003, 0.01, 6)
lk += (np.sin(2 * np.pi * 2350 * t(0.18)) + 0.5 * np.sin(2 * np.pi * 3710 * t(0.18))) * env_ad(n, 0.0005, 0.06, 6) * 0.35
save("lock", reverb(lk, 0.2, 0.15))

# ---- unlock: two clicks then a bright two-note chime
d = 0.9
ul = np.zeros(int(SR * d))
ul[: len(lk)] += lk * 0.7
ul[int(0.09 * SR): int(0.09 * SR) + len(lk)] += lk
for at_s, f in [(0.16, 880.0), (0.26, 1318.5)]:
    s = int(at_s * SR)
    m = int(SR * 0.6)
    tone = (np.sin(2 * np.pi * f * t(0.6)) + 0.3 * np.sin(2 * np.pi * 2 * f * t(0.6)) + 0.12 * np.sin(2 * np.pi * 3.01 * f * t(0.6)))
    seg = tone * env_ad(m, 0.003, 0.35, 5) * 0.45
    ul[s:s + m] += seg[: len(ul) - s]
save("unlock", reverb(ul, 0.45, 0.25))

# ---- hit: cinematic low impact for the twist
n = int(SR * 1.0)
sub = sine_glide(95, 38, 1.0, 0.35) * env_ad(n, 0.003, 0.55, 4)
crack = bandpass(rng.standard_normal(n), 150, 3500) * env_ad(n, 0.001, 0.05, 6) * 0.6
tail = bandpass(rng.standard_normal(n), 80, 600) * env_ad(n, 0.01, 0.5, 4) * 0.25
save("hit", reverb(sub + crack + tail, 0.6, 0.2))

# ---- glow: soft reverse swell into a sparkle (ads light up)
d = 1.1
x = t(d)
chord = sum(np.sin(2 * np.pi * f * x) * g for f, g in [(523.25, 0.5), (659.25, 0.35), (783.99, 0.3), (1046.5, 0.2)])
sw = (x / d) ** 2.5
sw[x > d * 0.82] *= np.exp(-14 * (x[x > d * 0.82] - d * 0.82))
spark = bandpass(rng.standard_normal(len(x)), 4000, 11000) * sw * 0.15
save("glow", reverb(chord * sw + spark, 0.6, 0.3))

# ---- hum: blueprint "model thinking" pad with slow pulse (1.6 s)
d = 1.6
x = t(d)
pad = sum(np.sin(2 * np.pi * f * x + 0.3 * np.sin(2 * np.pi * 0.7 * x)) * g for f, g in [(110, 0.5), (164.8, 0.3), (220, 0.25), (329.6, 0.12)])
pulse = 0.75 + 0.25 * np.sin(2 * np.pi * 4 * x)
e = np.minimum(x / 0.35, 1) * np.minimum((d - x) / 0.5, 1)
save("hum", pad * pulse * e, -6)

# ---- morph: playful upward glide (ear -> eye)
n = int(SR * 0.4)
mo = sine_glide(320, 1100, 0.4, 1.4) * env_ad(n, 0.02, 0.28, 3) + 0.4 * sine_glide(640, 2200, 0.4, 1.4) * env_ad(n, 0.02, 0.2, 4)
save("morph", reverb(mo, 0.35, 0.2))

# ---- draw: pencil / marker line (0.8 s)
n = int(SR * 0.8)
dr = bandpass(rng.standard_normal(n), 1800, 6500)
grain = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 9 * t(0.8)))
e = np.minimum(np.arange(n) / (0.05 * SR), 1) * np.minimum((n - np.arange(n)) / (0.12 * SR), 1)
save("draw", dr * grain * e, -8)

# ---- steps: soft map-pin hops (4 taps, 1.3 s)
d = 1.3
stp = np.zeros(int(SR * d))
for i, tt in enumerate([0.0, 0.32, 0.64, 0.96]):
    s = int(tt * SR)
    m = int(SR * 0.12)
    tap = sine_glide(420 + 40 * i, 260, 0.12, 0.5) * env_ad(m, 0.001, 0.05, 5)
    stp[s:s + m] += tap
save("steps", reverb(stp, 0.25, 0.12), -5)

# ---- zoom: rising whoosh for camera push
n = int(SR * 0.45)
z = sweep_filter(rng.standard_normal(n), 300, 5000, 0.5, 36)
e = (np.arange(n) / n) ** 2 * np.minimum((n - np.arange(n)) / (0.04 * SR), 1)
save("zoom", z * e + 0.3 * sine_glide(200, 900, 0.45, 2) * e)

# ---- strike: quick swipe for a strike-through line
n = int(SR * 0.25)
s_ = sweep_filter(rng.standard_normal(n), 1500, 6000, 0.5, 24) * np.sin(np.pi * np.arange(n) / n) ** 2
save("strike", s_, -6)

# ---- ding: gentle confirmation bell (result reveal)
d = 1.0
x = t(d)
bell = sum(np.sin(2 * np.pi * f * x) * g * np.exp(-x * k) for f, g, k in [(1568, 0.6, 4.5), (3136, 0.25, 7), (4704, 0.12, 9), (2093, 0.2, 5)])
save("ding", reverb(bell * np.minimum(x / 0.002, 1), 0.5, 0.2))

print("done ->", OUT)
