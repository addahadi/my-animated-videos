"""Inspect this project's recordings using the locally cached Whisper model."""
import json
import os
import sys
from pathlib import Path

import av
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding="utf-8")
project = Path(__file__).resolve().parents[1]
output = project / "analysis" / "transcripts"
output.mkdir(parents=True, exist_ok=True)
model = WhisperModel(
    "small", device="cpu", compute_type="int8",
    cpu_threads=min(8, os.cpu_count() or 4), local_files_only=True,
)
summary = []
offset = 0.0
for source in sorted((project / "inputs").glob("audio*.ogg"), key=lambda p: int(p.stem[5:])):
    with av.open(str(source)) as container:
        stream = container.streams.audio[0]
        frames = list(container.decode(stream))
        duration = sum(frame.samples / frame.sample_rate for frame in frames)
    segments, info = model.transcribe(
        str(source), language="ar", beam_size=5, vad_filter=True, word_timestamps=True,
    )
    rows = []
    print(f"FILE {source.name}: {duration:.3f}s, cumulative start {offset:.3f}s", flush=True)
    for segment in segments:
        row = {
            "start": segment.start, "end": segment.end, "text": segment.text.strip(),
            "words": [
                {"start": word.start, "end": word.end, "word": word.word,
                 "probability": word.probability}
                for word in (segment.words or [])
            ],
        }
        rows.append(row)
        print(f"  [{segment.start:.1f}-{segment.end:.1f}] {segment.text}", flush=True)
    result = {
        "file": source.name, "duration": duration, "cumulative_start": offset,
        "language": info.language, "language_probability": info.language_probability,
        "segments": rows, "note": "Automatic draft; recognition errors possible, especially Darija and English terms.",
    }
    (output / f"{source.stem}.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    (output / f"{source.stem}.txt").write_text(
        "\n".join(f"[{r['start']:.2f}-{r['end']:.2f}] {r['text']}" for r in rows), encoding="utf-8",
    )
    summary.append(result)
    offset += duration
(output / "all.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"TOTAL {offset:.3f}s", flush=True)
