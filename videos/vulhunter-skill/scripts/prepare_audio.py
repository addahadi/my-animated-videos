"""Prepare the approved recording order and the reference-informed v2 soundtrack.

Uses only local inputs. The separate stems keep the soundtrack editable after
the user's visual reference is available. Does not trim source recordings.
"""
import hashlib
import json
import sys
import wave
from pathlib import Path

import av
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
RATE = 48000
ORDER = [1, 2, 4, 3, 5, 6]
PUBLIC = ROOT / "public" / "audio"
OUTPUT = ROOT / "output"
ANALYSIS = ROOT / "analysis"
for directory in (PUBLIC, OUTPUT, ANALYSIS):
    directory.mkdir(parents=True, exist_ok=True)


def decode(path):
    blocks = []
    resampler = av.AudioResampler(format="fltp", layout="mono", rate=RATE)
    with av.open(str(path)) as container:
        for frame in container.decode(audio=0):
            blocks.extend(out.to_ndarray()[0] for out in resampler.resample(frame))
        blocks.extend(out.to_ndarray()[0] for out in resampler.resample(None))
    return np.concatenate(blocks).astype(np.float32)


def wav(path, samples):
    channels = 1 if samples.ndim == 1 else samples.shape[1]
    pcm = np.round(np.clip(samples, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as target:
        target.setnchannels(channels)
        target.setsampwidth(2)
        target.setframerate(RATE)
        target.writeframes(pcm.tobytes())


clips = []
timeline = []
position = 0
for number in ORDER:
    source = ROOT / "inputs" / f"audio{number}.ogg"
    samples = decode(source)
    timeline.append({
        "file": source.name, "start_sample": position,
        "samples": len(samples), "start": position / RATE,
        "duration": len(samples) / RATE,
        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    })
    clips.append(samples)
    position += len(samples)
narration = np.concatenate(clips)
count = len(narration)
duration = count / RATE
clock = np.arange(count, dtype=np.float64) / RATE
rng = np.random.default_rng(7429)

# Preserve all words, pauses, and recording boundaries. Only a uniform gain is
# applied to the voice in the mixed version; the raw reordered WAV is separate.
voice_gain = min(1.5, 0.78 / max(float(np.max(np.abs(narration))), 1e-9))
voice = narration * voice_gain
music = np.zeros((count, 2), dtype=np.float32)


def bass_pulse(start, midi, volume=0.48, length=0.42):
    first = int(start * RATE)
    size = min(int(length * RATE), count - first)
    if size <= 0:
        return
    t = np.arange(size) / RATE
    frequency = 440 * 2 ** ((midi - 69) / 12)
    envelope = (1 - np.exp(-t / 0.008)) * np.exp(-t * 6.0)
    envelope *= np.clip((length - t) / 0.07, 0, 1)
    signal = (np.sin(2 * np.pi * frequency * t)
              + 0.28 * np.sin(np.pi * frequency * t)
              + 0.08 * np.sin(4 * np.pi * frequency * t)) * envelope
    music[first:first + size] += (signal[:, None] * volume).astype(np.float32)


# Reference onset autocorrelation peaks at 120 BPM; its energy is concentrated
# below 180 Hz. Use an original minimal bass groove, without the rejected v1's
# pads, bell melody, reverb wash, or prominent UI chirps.
beat = 60 / 120
bar = beat * 4
for index, start in enumerate(np.arange(0, duration, beat)):
    # Keep the pulse stable; a restrained two-note variation every four bars.
    note = 45 if (index // 16) % 4 != 3 else 43
    bass_pulse(start, note, volume=0.44 if index % 4 == 0 else 0.36)
    first = int(start * RATE)
    size = min(int(0.18 * RATE), count - first)
    t = np.arange(size) / RATE
    kick = np.sin(2 * np.pi * (48 * t + 65 * 0.012 * (1 - np.exp(-t / 0.012))))
    music[first:first + size] += (kick * np.exp(-t * 28) * 0.20)[:, None]
    if index % 2:
        noise = rng.normal(0, 1, size)
        body = np.convolve(noise, np.ones(9) / 9, mode="same")
        music[first:first + size] += (body * np.exp(-t * 55) * 0.025)[:, None]
    # Fine offbeat texture, tucked well behind the bass and narration.
    first = int((start + beat / 2) * RATE)
    size = min(int(0.065 * RATE), count - first)
    if size > 0:
        t = np.arange(size) / RATE
        noise = rng.normal(0, 1, size)
        hat = np.diff(noise, prepend=0) * np.exp(-t * 95) * 0.004
        music[first:first + size] += hat[:, None]

# Smooth ducking based on the actual voice. Keep the music roughly 20 dB below
# active speech; allow it to rise gently in pauses, with entrance/exit fades.
hop = 960
padded = np.pad(voice, (0, (-count) % hop))
speech_rms = np.sqrt(np.mean(padded.reshape(-1, hop) ** 2, axis=1))
active = speech_rms > max(0.008, float(np.percentile(speech_rms, 65)) * 0.2)
voice_rms = float(np.sqrt(np.mean(voice[np.repeat(active, hop)[:count]] ** 2)))
duck_points = np.where(active, 0.38, 0.70)
for index in range(1, len(duck_points)):
    duck_points[index] = 0.83 * duck_points[index - 1] + 0.17 * duck_points[index]
duck = np.interp(np.arange(count), np.arange(len(duck_points)) * hop, duck_points)
music *= duck[:, None]
music *= (voice_rms * 10 ** (-20 / 20)) / max(float(np.sqrt(np.mean(music ** 2))), 1e-9)
fades = np.minimum(clock / 1.2, 1) * np.minimum((duration - clock) / 2.2, 1)
music *= fades[:, None]

effects = np.zeros((count, 2), dtype=np.float32)
events = []


def effect(at, kind, length=0.4):
    first = int(at * RATE)
    size = min(int(length * RATE), count - first)
    if size <= 0:
        return
    t = np.arange(size) / RATE
    if kind == "sweep":
        noise = rng.normal(0, 1, size)
        noise = np.convolve(noise, np.ones(24) / 24, mode="same")
        signal = noise * np.sin(np.pi * t / length) ** 2
    elif kind == "scan":
        phase = 2 * np.pi * (520 * t + 420 * t ** 2 / (2 * length))
        signal = np.sin(phase) * np.sin(np.pi * t / length) ** 2 * 0.25
    elif kind == "confirm":
        signal = np.sin(2 * np.pi * 220 * t) * np.exp(-t * 24) * 0.3
    else:
        signal = rng.normal(0, 1, size) * np.exp(-t * 140)
    signal *= voice_rms * 0.38
    effects[first:first + size] += signal[:, None]
    events.append({"time": at, "kind": kind, "duration": size / RATE})


for at, kind, length in [
    (2.5, "click", 0.045), (6.5, "sweep", 0.24),
    (13.0, "confirm", 0.18), (17.344, "sweep", 0.24),
    (28.053, "sweep", 0.24), (35.5, "click", 0.045),
    (38.053, "sweep", 0.24), (46.0, "confirm", 0.18),
    (48.896, "sweep", 0.24), (56.8, "confirm", 0.18),
    (58.539, "sweep", 0.24), (64.7, "click", 0.045),
    (66.197, "sweep", 0.24),
]:
    effect(at, kind, length)

mixed = voice[:, None] + music + effects
peak = float(np.max(np.abs(mixed)))
master_gain = min(1.0, 0.95 / max(peak, 1e-9))
mixed *= master_gain
wav(PUBLIC / "narration-reordered.wav", narration)
wav(PUBLIC / "music-v2.wav", music)
wav(PUBLIC / "sfx-v2.wav", effects)
wav(PUBLIC / "soundtrack-v2.wav", mixed)

# Compact listening copy; WAV stems remain the source for subsequent rendering.
with av.open(str(OUTPUT / "soundtrack-preview-v2.m4a"), "w") as container:
    stream = container.add_stream("aac", rate=RATE)
    stream.layout = "stereo"
    stream.bit_rate = 192000
    for first in range(0, count, 1024):
        frame = av.AudioFrame.from_ndarray(
            np.ascontiguousarray(mixed[first:first + 1024].T), format="fltp", layout="stereo")
        frame.sample_rate = RATE
        frame.pts = first
        for packet in stream.encode(frame):
            container.mux(packet)
    for packet in stream.encode(None):
        container.mux(packet)

checks = []
rendered = decode(OUTPUT / "soundtrack-preview-v2.m4a")
raw = decode(PUBLIC / "narration-reordered.wav")
for info, clip in zip(timeline, clips):
    first = info["start_sample"]
    size = len(clip)
    raw_correlation = float(np.corrcoef(clip, raw[first:first + size])[0, 1])
    mixed_correlation = float(np.corrcoef(clip, rendered[first:first + size])[0, 1])
    checks.append({"file": info["file"], "unmixed_correlation": raw_correlation,
                   "aac_mix_correlation": mixed_correlation})
    assert raw_correlation > 0.9999, checks[-1]
    assert mixed_correlation > 0.94, checks[-1]
assert len(raw) == count
assert float(np.max(np.abs(mixed))) <= 0.951

report = {
    "status": "v2 draft based on measured reference pulse and bass balance; user listening review pending",
    "order": ORDER, "sample_rate": RATE, "samples": count,
    "duration": duration, "clips": timeline, "voice_gain": voice_gain,
    "master_gain": master_gain, "mixed_peak": float(np.max(np.abs(mixed))),
    "voice_rms": voice_rms, "music_rms": float(np.sqrt(np.mean(music ** 2))),
    "sound_events": events, "checks": checks,
    "music": "Original 120 BPM minimal bass-led electronic pulse; reference-informed, no samples copied. Replaces rejected 96 BPM pad/pluck v1.",
    "notes": "No narration trimmed. SFX timings are provisional until animation is built. Objective checks do not replace listening review.",
}
(ANALYSIS / "audio-production-v2.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps({"duration": duration, "order": ORDER, "checks": checks,
                  "preview": str(OUTPUT / "soundtrack-preview-v2.m4a")}, indent=2))
