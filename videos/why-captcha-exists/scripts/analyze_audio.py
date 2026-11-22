"""Measure CAPTCHA recordings and locate speech with a cached local model.

ASR is reference material for cue placement only; it is not an approved script.
"""
import json
import os
from pathlib import Path
import subprocess
import sys
import av

sys.stdout.reconfigure(encoding="utf-8")
project = Path(__file__).resolve().parents[1]
workspace = project.parents[1]
output = project / "analysis"
output.mkdir(exist_ok=True)
probe = workspace / "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe"
rows = []
offset = 0.0
for number in range(1, 9):
    source = project / "inputs" / f"audio{number}.ogg"
    result = subprocess.run([str(probe), "-v", "error", "-show_format", "-show_streams", "-of", "json", str(source)], capture_output=True, text=True, check=True)
    metadata = json.loads(result.stdout)
    with av.open(str(source)) as container:
        sample_rate = container.streams.audio[0].sample_rate
        samples = sum(frame.samples for frame in container.decode(audio=0))
    duration = samples / sample_rate
    row = {"id": number, "file": source.relative_to(project).as_posix(), "containerDurationSec": float(metadata["format"]["duration"]), "decodedSamples": samples, "durationSec": duration, "startSec": offset, "endSec": offset + duration, "sampleRate": sample_rate, "channels": metadata["streams"][0]["channels"]}
    rows.append(row)
    offset += duration
measured = {"timing": "MEASURED", "method": "ffprobe metadata plus PyAV decoded sample counts; numeric order without trimming; decoded durations are authoritative", "totalDurationSec": offset, "clips": rows}
(output / "audio-measurements.json").write_text(json.dumps(measured, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(measured, ensure_ascii=False), flush=True)
if "--measure-only" in sys.argv:
    sys.exit(0)

from faster_whisper import WhisperModel
try:
    model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=min(8, os.cpu_count() or 4), local_files_only=True)
except Exception as exc:
    print(f"Local ASR unavailable; durations remain measured: {exc}", flush=True)
    sys.exit(0)
references = []
for row in rows:
    segments, info = model.transcribe(str(project / row["file"]), language="ar", beam_size=3, vad_filter=True, word_timestamps=True)
    items = []
    for segment in segments:
        items.append({"start": segment.start, "end": segment.end, "text": segment.text.strip(), "words": [{"start": word.start, "end": word.end, "word": word.word, "probability": word.probability} for word in segment.words or []]})
    reference = {"file": row["file"], "status": "UNREVIEWED_ASR_FOR_CUES_ONLY", "segments": items}
    references.append(reference)
    (output / f"audio{row['id']}-asr.json").write_text(json.dumps(reference, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(reference, ensure_ascii=False), flush=True)
(output / "asr-reference.json").write_text(json.dumps(references, ensure_ascii=False, indent=2), encoding="utf-8")
