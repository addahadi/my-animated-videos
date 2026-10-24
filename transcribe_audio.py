"""Transcribe project recordings with the locally cached Whisper model."""
import json
import os
import sys
from pathlib import Path

import av
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding="utf-8")
root = Path(__file__).resolve().parent
output = root / "analysis" / "transcripts"
output.mkdir(parents=True, exist_ok=True)
model = WhisperModel(
    "small", device="cpu", compute_type="int8",
    cpu_threads=min(8, os.cpu_count() or 4), local_files_only=True,
)
summary = []
for source in sorted(root.glob("*.ogg")):
    with av.open(str(source)) as container:
        duration = container.duration / av.time_base if container.duration else None
    segments, info = model.transcribe(
        str(source), beam_size=5, vad_filter=True, word_timestamps=True,
    )
    rows = []
    print(f"FILE {source.name}: {duration}s, {info.language} ({info.language_probability:.2f})", flush=True)
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
        "file": source.name, "duration": duration,
        "language": info.language, "language_probability": info.language_probability,
        "segments": rows,
    }
    (output / f"{source.stem}.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8",
    )
    (output / f"{source.stem}.txt").write_text(
        "\n".join(f"[{r['start']:.2f}-{r['end']:.2f}] {r['text']}" for r in rows),
        encoding="utf-8",
    )
    summary.append(result)
(output / "all.json").write_text(
    json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8",
)
