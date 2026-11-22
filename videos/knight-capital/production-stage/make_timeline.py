"""Production cues grounded in the measured clips and inspected ASR phrase boundaries."""
import json
import math
import re
import wave
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent
audio = json.loads((ROOT / "media/audio-manifest.json").read_text(encoding="utf-8"))
script = (ROOT / "script.md").read_text(encoding="utf-8")
voice = [line.split("|")[3].strip() for line in script.splitlines() if re.match(r"^\| \d+ \|", line)]
# Values are local seconds; target phrases were located in analysis/alignment.json.
# Visual state changes begin about .2-.3s before the matching keyword after setup.
cues = [
    {"warning": 1.05, "loss": 1.2},
    {"company": 2.15, "program": 3.5, "orders": 3.98, "speed": 5.15},
    {"open": .7, "fault": 2.6, "minutes": 4.42, "executions": 6.2},
    {"fleet": 2.7, "updated": 5.95, "missed": 7.45, "review": 8.4},
    {"focus": 3.28, "legacy": 3.3, "name": 6.25, "switch": 7.8, "compare": 10.5},
    {"input": .3, "new": 1.3, "old": 3.25, "repeat": 7.25, "complete": 9.6},
    {"repair": .55, "rollback": 1.7, "old": 4.25, "spread": 4.95, "continue": 8.25},
    {"monitor": 0, "link": 1.95, "gap": 3.1, "grow": 5.12},
    {"settle": 0, "initial": 2.65, "later": 6.25, "laterNumber": 7.75, "recap": 10.04},
    {"server": 0, "lesson": 2.65, "checklist": 3.0, "stop": 6.5, "question": 8.2},
]
headings = ["server واحد", "Knight Capital", "45 دقيقة من الفوضى", "التحديث ما وصلش للجميع", "نفس الإشارة، خدمة مختلفة",
            "الطلب كمل… الأوامر تواصلت", "الإصلاح كبّر المشكل", "المراقبة وحدها ما تكفيش", "ثمن الغلطة", "لازم تعرف كيفاش توقفو"]
scenes = []
for i, row in enumerate(audio["sources"]):
    start = round(row["startSec"] * 30)
    end = round(row["endSec"] * 30) if i < 9 else audio["durationInFrames"]
    scenes.append({"id": i + 1, "startFrame": start, "endFrame": end, "startSec": start/30, "endSec": end/30,
                   "voiceover": voice[i], "heading": headings[i], "cues": cues[i], "audioFile": row["file"]})
timeline = {"width": 1080, "height": 1920, "fps": 30, "durationInFrames": audio["durationInFrames"],
            "narrationSeconds": audio["durationSeconds"], "timing": "MEASURED_CLIPS_ASR_GUIDED_CUES",
            "reviewLimit": "Clip order checked against recognized content; word onsets ASR-guided, not certified by continuous listening. No narration altered.",
            "style": "Design 2 — approved selling-a-phone v4", "scenes": scenes}
assert len(scenes) == 10 and scenes[0]["startFrame"] == 0
assert all(a["endFrame"] == b["startFrame"] for a, b in zip(scenes, scenes[1:]))
assert scenes[-1]["endFrame"] / 30 >= audio["durationSeconds"]
(ROOT / "media/timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=2), encoding="utf-8")
with wave.open(str(ROOT / "media/narration.wav"), "rb") as source:
    original = np.frombuffer(source.readframes(source.getnframes()), dtype="<i2").astype(np.float64)
effects = np.zeros(len(original), dtype=np.float64)
effect_times = [scenes[i]["startSec"] + cues[i][name] for i, name in
                [(0, "warning"), (3, "missed"), (5, "old"), (6, "spread"), (9, "stop")]]
for hit, stamp in enumerate(effect_times):
    start = round(stamp * 48000)
    n = min(2400, len(effects) - start)
    t = np.arange(n) / 48000
    # Original, quiet 50ms soft switch clicks; no third-party music or assets.
    envelope = (1-np.exp(-t/.001)) * np.exp(-t/.009)
    sound = 220 * envelope * (np.sin(2*np.pi*(760+hit*65)*t) + .18*np.sin(2*np.pi*1900*t))
    effects[start:start+n] += sound
mixed = np.clip(np.rint(original + effects), -32768, 32767).astype("<i2")
with wave.open(str(ROOT / "media/narration-mix.wav"), "wb") as output:
    output.setparams((1, 2, 48000, 0, "NONE", "not compressed")); output.writeframes(mixed.tobytes())
(ROOT / "analysis/audio-mix.json").write_text(json.dumps({"music": None, "narrationGain": 1,
    "effects": "Five original low-level soft switch clicks, 50ms each", "effectTimes": effect_times,
    "unmixedOriginal": "media/narration.wav", "mix": "media/narration-mix.wav",
    "voiceoverEdited": False}, indent=2), encoding="utf-8")
(ROOT / "analysis/alignment-review.md").write_text("""# Recording alignment review

The successful transcription used the cached small model on CPU with CT2_USE_MKL=0 and CT2_PACKED_GEMM=0. No CUDA device was reported; this is a documented CPU fallback. The earlier MKL allocation failure was resolved without changing or downloading models. CTranslate2 backend options: https://github.com/OpenNMT/CTranslate2/blob/master/docs/environment_variables.md.

All ten clips match their intended topic/beat in the inferred order. Original voice and written script are preserved separately. Darija ASR contains recognition errors and is not used as captions or rewritten narration. The spoken performance uses paraphrases of the written draft (for example, the program buys/sells shares rather than the draft's wording about sending orders). Clip 2 does not clearly include the written date introduction; use the historically verified date as context. Clip 9 recognizes 440 then 460 million; retain initial/later report attribution. No source words were cut to match the script.

Timing uses measured exact source samples and inspected ASR word/segment boundaries, with visual leads around .2–.3s after setup. Completion arrives near the end of clip 6, so show its completed-order result across the transition into the rollback explanation rather than claiming a long early hold. Clip 9's later number is late: retain the two dated loss cards until the end of that clip and move the recap into the closing lesson. No extra voiced CTA is added. Full continuous listening is not claimed.
""", encoding="utf-8")
print(f"Timeline ready: {len(scenes)} measured clips, {audio['durationInFrames']} frames")
