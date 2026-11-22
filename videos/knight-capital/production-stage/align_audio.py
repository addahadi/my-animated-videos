"""Locate recorded phrases using a cached model; preserve written script verbatim."""
import json
import sys
from pathlib import Path
import ctranslate2
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding="utf-8")
root = Path(sys.argv[1]).resolve()
manifest = json.loads((root / "media/audio-manifest.json").read_text())
device = "cuda" if ctranslate2.get_cuda_device_count() else "cpu"
model = None
try:
    model = WhisperModel("small", device=device, compute_type="float32" if device == "cuda" else "int8",
                         cpu_threads=2, num_workers=1, local_files_only=True)
except Exception as error:
    print(f"Model initialization on {device} failed: {error}", flush=True)
    if device == "cuda":
        device = "cpu"
        model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2, local_files_only=True)
if model is None:
    raise RuntimeError("No local model loaded; content alignment remains unverified")
rows = []
for source in manifest["sources"]:
    print(f"CLIP {source['id']} / {source['file']} / offset {source['startSec']:.6f}s", flush=True)
    segments, info = model.transcribe(str(root / "analysis" / f"clip-{source['id']:02d}.wav"),
                                      language="ar", beam_size=3, vad_filter=True, word_timestamps=True)
    result = []
    for segment in segments:
        result.append({"start": segment.start, "end": segment.end, "text": segment.text,
                       "words": [{"start": w.start, "end": w.end, "word": w.word, "probability": w.probability}
                                 for w in segment.words or []]})
        print(f"  [{segment.start:.2f}–{segment.end:.2f}] {segment.text}", flush=True)
    rows.append({"id": source["id"], "file": source["file"], "offset": source["startSec"], "segments": result})
    (root / "analysis/alignment.json").write_text(json.dumps({
        "device": device, "model": "cached small", "method": "ASR-guided, not human listening verified",
        "warning": "Darija recognition errors likely; use only for locating phrases, never rewrite script or audio",
        "clips": rows}, ensure_ascii=False, indent=2), encoding="utf-8")
print("Alignment complete; inference device:", device, flush=True)
