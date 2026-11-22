"""Measure original clips and locate speech; never use ASR to rewrite narration."""
import hashlib
import json
import os
import sys
from pathlib import Path

os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
import av
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding="utf-8")
root = Path(__file__).resolve().parents[1]
out = root / "analysis"
out.mkdir(exist_ok=True)
script = root / "scripts" / "knight-capital.md"
text = script.read_text(encoding="utf-8")
rows = [line.split("|")[3].strip() for line in text.splitlines()
        if line.startswith("| ") and line.split("|")[1].strip().isdigit()]
voice_snapshot = out / "original-voiceover.json"
if not voice_snapshot.exists():
    voice_snapshot.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")

sources = [root / "inputs" / "audio_2026-11-04_21-34-19.ogg"] + [
    root / "inputs" / ("audio6ogg.ogg" if i == 6 else f"audio{i}.ogg")
    for i in range(2, 11)]
try:
    model = WhisperModel("small", device="cpu", compute_type="int8",
                         cpu_threads=1, num_workers=1, local_files_only=True)
    alignment_status = "ASR_GUIDED_REVIEW_BY_EAR_REQUIRED"
    asr_error = None
except RuntimeError as error:
    model = None
    alignment_status = "ASSUMED_ONE_CLIP_PER_BEAT_REVIEW_BY_EAR_REQUIRED"
    asr_error = str(error)
results = []
offset = 0
for i, source in enumerate(sources, 1):
    with av.open(str(source)) as container:
        stream = container.streams.audio[0]
        rate = stream.codec_context.sample_rate
        samples = sum(frame.samples for frame in container.decode(audio=0))
    duration = samples / rate
    segments = []
    if model is not None:
        segments, _ = model.transcribe(str(source), language="ar", beam_size=5,
                                      vad_filter=True, word_timestamps=True)
    transcript = []
    print(f"CLIP {i}: {source.name}, {duration:.6f}s, offset {offset:.6f}s", flush=True)
    for segment in segments:
        item = {"start": segment.start, "end": segment.end, "text": segment.text,
                "words": [{"start": w.start, "end": w.end, "word": w.word}
                          for w in segment.words or []]}
        transcript.append(item)
        print(f"  [{segment.start:.2f}-{segment.end:.2f}] {segment.text}", flush=True)
    results.append({"scriptBeat": i, "file": source.name, "sampleRate": rate,
                    "samples": samples, "durationSec": duration,
                    "startSec": offset, "endSec": offset + duration,
                    "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                    "segments": transcript})
    offset += duration
    (out / "recordings.json").write_text(json.dumps({
        "durationMeasurement": "PyAV decoded samples; ffprobe unavailable on PATH",
        "timing": "MEASURED", "alignment": alignment_status, "asrError": asr_error,
        "order": "Timestamp-named opening clip, then clips 2 through 10; verify by speech",
        "totalDurationSec": offset, "clips": results}, ensure_ascii=False, indent=2),
        encoding="utf-8")
print(f"TOTAL: {offset:.6f}s", flush=True)
