"""ASR reference for cue placement only. Never used to rewrite the script."""
import json, sys
from pathlib import Path
from faster_whisper import WhisperModel
sys.stdout.reconfigure(encoding="utf-8")
p = Path(__file__).resolve().parents[1]
m = WhisperModel("small", device="cpu", compute_type="int8", local_files_only=True)
out = []
for i in range(1, 10):
    segs, _ = m.transcribe(str(p / "inputs" / f"audio{i}.ogg"), language="ar", beam_size=3, word_timestamps=True)
    words = [{"s": round(w.start, 2), "e": round(w.end, 2), "w": w.word.strip()} for s in segs for w in (s.words or [])]
    out.append({"clip": i, "words": words})
    print(i, " ".join(f"{w['w']}@{w['s']}" for w in words), flush=True)
(p / "analysis" / "asr-reference.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
