"""Measure and inspect this video's recordings; never rewrite narration from ASR."""
import hashlib
import json
import os
import re
import subprocess
import sys
import wave
from pathlib import Path

import av
import numpy as np
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding="utf-8")
PROJECT = Path(__file__).resolve().parents[1]
WORKSPACE = PROJECT.parents[1]
ANALYSIS = PROJECT / "analysis"
TRANSCRIPTS = ANALYSIS / "transcripts"
PROBE = WORKSPACE / "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe"
TRANSCRIPTS.mkdir(parents=True, exist_ok=True)

# Remove only the requested visual directions; keep every spoken line unchanged.
script_path = PROJECT / "scripts/phone-slowdown-on-purpose.md"
original = script_path.read_text(encoding="utf-8")
original_voice = [line.split("|")[3].strip() for line in original.splitlines() if re.match(r"^\| \d+ \|", line)]
cleaned_lines = []
for line in original.splitlines():
    if line.startswith("Visual language:"):
        continue
    if line.startswith("| # | Time | Voiceover"):
        line = "| # | Time (original estimate) | Voiceover (Darija) | On-screen text |"
    elif line.startswith("|---|------|"):
        line = "|---|------|--------------------|----------------|"
    elif re.match(r"^\| \d+ \|", line):
        line = "|" + "|".join(line.split("|")[1:5]) + "|"
    cleaned_lines.append(line)
cleaned = "\n".join(cleaned_lines) + "\n"
cleaned_voice = [line.split("|")[3].strip() for line in cleaned.splitlines() if re.match(r"^\| \d+ \|", line)]
assert original_voice == cleaned_voice
if cleaned != original:
    (ANALYSIS / "script-before-planning.md").write_text(original, encoding="utf-8")
    script_path.write_text(cleaned, encoding="utf-8")
(ANALYSIS / "script-voiceover.json").write_text(json.dumps(cleaned_voice, ensure_ascii=False, indent=2), encoding="utf-8")

files = sorted((PROJECT / "inputs").glob("audio*.ogg"), key=lambda p: int(p.stem[5:]))
model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=min(8, os.cpu_count() or 4), local_files_only=True)
summary = []
offset_samples = 0
with wave.open(str(ANALYSIS / "narration.wav"), "wb") as narration:
    narration.setnchannels(1)
    narration.setsampwidth(2)
    narration.setframerate(48000)
    for source in files:
        probe = json.loads(subprocess.check_output([str(PROBE), "-v", "error", "-show_format", "-show_streams", "-of", "json", str(source)], encoding="utf-8"))
        samples = 0
        envelope = []
        resampler = av.AudioResampler(format="s16", layout="mono", rate=48000)
        with av.open(str(source)) as container:
            for frame in container.decode(audio=0):
                for output in resampler.resample(frame):
                    data = output.to_ndarray().reshape(-1)
                    narration.writeframesraw(data.astype("<i2").tobytes())
                    samples += len(data)
                    envelope.append({"endSample": samples, "rms": float(np.sqrt(np.mean(data.astype(float) ** 2)))})
            for output in resampler.resample(None):
                data = output.to_ndarray().reshape(-1)
                narration.writeframesraw(data.astype("<i2").tobytes())
                samples += len(data)
        duration = samples / 48000
        print(f"FILE {source.name}: decoded {duration:.6f}s; starts {offset_samples / 48000:.6f}s", flush=True)
        cache = TRANSCRIPTS / f"{source.stem}.json"
        sha = hashlib.sha256(source.read_bytes()).hexdigest()
        existing = json.loads(cache.read_text(encoding="utf-8")) if cache.exists() else None
        if existing and existing.get("sha256") == sha:
            segments = existing["segments"]
        else:
            draft, info = model.transcribe(str(source), language="ar", beam_size=5, vad_filter=True, word_timestamps=True)
            segments = []
            for segment in draft:
                row = {"start": segment.start, "end": segment.end, "text": segment.text.strip(), "words": [{"start": w.start, "end": w.end, "word": w.word, "probability": w.probability} for w in (segment.words or [])]}
                segments.append(row)
                print(f"  [{segment.start:.2f}–{segment.end:.2f}] {segment.text}", flush=True)
        result = {"file": source.name, "sha256": sha, "duration": duration, "samples": samples, "sampleRate": 48000, "cumulativeStart": offset_samples / 48000, "cumulativeEnd": (offset_samples + samples) / 48000, "ffprobe": probe, "segments": segments, "envelope": envelope, "note": "ASR draft is boundary evidence only. Keep approved script wording; check internal boundaries by ear."}
        cache.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
        (TRANSCRIPTS / f"{source.stem}.txt").write_text("\n".join(f"[{r['start']:.2f}–{r['end']:.2f}] {r['text']}" for r in segments), encoding="utf-8")
        summary.append({k: v for k, v in result.items() if k not in ("envelope", "ffprobe")})
        offset_samples += samples
(TRANSCRIPTS / "all.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
metadata = {"sampleRate": 48000, "totalSamples": offset_samples, "duration": offset_samples / 48000, "order": [p.name for p in files], "sources": [{k: r[k] for k in ("file", "sha256", "duration", "samples", "sampleRate", "cumulativeStart", "cumulativeEnd")} for r in summary], "scriptWordsPreserved": original_voice == cleaned_voice, "audioPolicy": "All clips in numeric order, decoded end-to-end; no trimming, time stretch, inserted silence, or normalization."}
(ANALYSIS / "audio-timing.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"TOTAL {metadata['duration']:.6f}s / {offset_samples} samples", flush=True)
