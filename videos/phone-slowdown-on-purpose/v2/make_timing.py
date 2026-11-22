"""Captions + scene events for phone-slowdown-v2, built from the SCRIPT text (never from ASR).

Same method as why-cookies-exist/make_timing.py: each scene's words are spread over the voiced
parts of the narration master (RMS > -32 dBFS) in proportion to word length, punctuation is
anchored to the nearest real pause, and measured pauses (PINS) fix the word starts around them.
Scene events are anchored to words: event = word start - LEAD (visuals lead the voice).
Scene boundaries, frames and audio come unchanged from plans/phone-slowdown-v2-timeline.json.

Caption text: script beats for the kept recordings; for audio8's last clause and audio10 the
recorded wording (written from listening + draft ASR) -- CHECK BY EAR (see build notes).

Outputs:
  src/videos/phone-slowdown-v2/captions.json
  src/videos/phone-slowdown-v2/timeline.json   (plan timeline + props.events/canvas/header/chapterPill)
  public/phone-slowdown-v2/captions.srt        (for CapCut)
Run: .venv/Scripts/python.exe -I videos/phone-slowdown-on-purpose/v2/make_timing.py
"""
import json
import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[3]
FF = str(ROOT / "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe")
TL = json.loads((ROOT / "plans/phone-slowdown-v2-timeline.json").read_text(encoding="utf-8"))
AUDIO = ROOT / TL["audioFile"]
HOP = 0.02
LEAD = 0.3
SR = 16000

with tempfile.TemporaryDirectory() as td:
    tmp = Path(td) / "a.wav"
    subprocess.run([FF, "-v", "error", "-y", "-i", str(AUDIO), "-ac", "1", "-ar", str(SR), str(tmp)], check=True)
    with wave.open(str(tmp)) as wf:
        x = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(float) / 32768
w = int(SR * HOP)
n = len(x) // w
db = 20 * np.log10(np.sqrt((x[: n * w].reshape(n, w) ** 2).mean(1)) + 1e-9)
voiced = db > -32


def runs(a, b):
    i0, i1 = int(a / HOP), min(int(b / HOP), n)
    out, s = [], None
    for i in range(i0, i1):
        if voiced[i] and s is None:
            s = i
        if not voiced[i] and s is not None:
            out.append([s * HOP, i * HOP])
            s = None
    if s is not None:
        out.append([s * HOP, i1 * HOP])
    merged = []
    for r in out:
        if merged and r[0] - merged[-1][1] < 0.12:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    return [r for r in merged if r[1] - r[0] >= 0.08]


PUNCT = re.compile(r"[،,.؟?!:…؛]+$")

# caption text per scene (what is spoken)
CAPTION = {
    1: "Apple خلّصت غرامة… على خاطر ثقّلت تليفونات الناس بلا ما تقولهم.",
    2: "وانت؟ تفتح الكاميرا، تستنى… واللقطة تفوت.",
    3: "زعما حتى تليفونك ثقّلوه؟ نبداو بواش دارت Apple في 2017.",
    4: "كانت تنقّص الأداء تاع بعض iPhone القدام كي تضعف البطارية تاعهم. والمشكل؟ ما وضّحتش هذا للناس مليح. ومن بعد، خلّصت غرامة في فرنسا، ودارت تسويات قضايا في أمريكا.",
    5: "الناس حسّو بلي تخدعو. بصح Apple قالت: درنا هكّا باش التليفون ما يطفاش فجأة. وهنا لازم نفهمو حاجة: البطارية كي تقدّم، ماشي غير تولّي تفرغ بالخف.",
    6: "تقدر تكون مشحونة، بصح ما تقدرش تمدّ الطاقة بالسرعة اللي يحتاجها التليفون. كيما روبيني: الماء كاين، بصح كي تحتاج دفعة كبيرة، ما يخرجش كفاية.",
    7: "كي البطارية تعجز تمدّ الطاقة المطلوبة، التليفون يقدر يطفى. الحل؟ النظام ينقّص سرعة المعالج، اللي ينفّذ الخدمة داخل التليفون. يستهلك أقل، ويخدم أبطأ، بصح يبقى شاعل.",
    8: "بصح ماشي كل تليفون ثقيل عندو هاذ المشكل. كاين تطبيقات تزيد فيها ميزات مع التحديثات، وتولّي تحتاج خدمة أكثر من المعالج، ومساحة أكبر في الذاكرة.",
    9: "والتليفون تاعك؟ بقى بنفس الإمكانيات. نفس الجهاز، بصح الخدمة زادت عليه. لهذا التطبيق اللي كان يخدم عندك خفيف يقدر يولّي ثقيل. وماشي كل تحديث يدير هكّا، كاين تحديثات فعلاً تزيد الأداء.",
    10: "وزيد، كي التخزين يقرب يعمر، يقدر التليفون يثقال. وكي يسخن بزاف، يقدر ينقّص السرعة باش يحمي روحو. تشوف نفس التقطيع، بصح السبب ماشي ديما واحد.",
    11: "يعني يقدرو يبطّؤوه بالعاني؟ إيه، في بعض الحالات. بصح البطء وحدو ما يثبتش بلي يحبوك تشري جديد.",
    12: "يعني قبل ما تبدّل تليفون، شوف حالة البطارية والتخزين. وإذا البطارية السبب، تبديلها يقدر يحسّن الأداء ويوفّر الدراهم.",
}

TAG = "CASE · PHONE SLOWDOWN"
# scene props + word-anchored events: (word fragment, what). Event 0 is always the scene start.
# "@S+x" = scene start + x seconds (for the voiceless end card).
SPEC = {
    1: dict(canvas="light", header=False, pill=None, ev=[
        ("غرامة", "EUR 25M tag lands"), ("ثقّلت", "speed bar drains, SLOWED"), ("بلا", "stamp: they didn't tell")]),
    2: dict(canvas="light", header=False, pill=None, ev=[
        ("وانت؟", "tag flips to YOUR PHONE"), ("تفتح", "camera opens, spinner"), ("تستنى", "ball in frame, still loading"),
        ("تفوت", "ball leaves, MISSED")]),
    3: dict(canvas="light", header=False, pill=None, ev=[
        ("زعما", "verdict locked chip"), ("ثقّلوه؟", "chip shakes, ? grows"), ("نبداو", "phone slides left"),
        ("2017", "2017 sticker")]),
    4: dict(canvas="light", header=True, pill="القضية · 2017", ev=[
        ("تنقّص", "three old phones"), ("البطارية", "weak batteries -> SLOWED"), ("وضّحتش", "card 1 + NOT TOLD stamp"),
        ("غرامة", "card 2 FRANCE + EUR 25M tag"), ("تسويات", "card 3 USA")]),
    5: dict(canvas="light", header=True, pill="علاش؟", ev=[
        ("حسّو", "red bubble from people"), ("قالت", "maker reply bubble"), ("يطفاش", "phone blinks off/on"),
        ("وهنا", "part 1 dims, battery card"), ("تقدّم", "battery ages NEW -> 2 YEARS"), ("بالخف", "drains fast")]),
    6: dict(canvas="dark", header=True, pill="CHARGE ≠ POWER", ev=[
        ("مشحونة", "charge tank 80%"), ("تمدّ", "power meter rises"), ("يحتاجها", "NEEDED marker high + gap bracket"),
        ("روبيني", "tap inset"), ("الماء", "water is there"), ("دفعة", "tap opens wide"), ("كفاية", "thin stream + bracket")]),
    7: dict(canvas="dark", header=True, pill="الحل", ev=[
        ("تعجز", "NEEDED above supply, blink"), ("يطفى", "phone blacks out"), ("الحل؟", "?"), ("ينقّص", "dial turns down"),
        ("المعالج", "CPU term"), ("داخل", "NEEDED slides under supply"), ("يستهلك", "uses less"), ("أبطأ", "slower"),
        ("شاعل", "screen ON")]),
    8: dict(canvas="light", header=True, pill="سبب 2 · التطبيقات", ev=[
        ("ماشي", "cause chip BATTERY + not always"), ("تطبيقات", "app card"), ("ميزات", "feature chips"),
        ("التحديثات", "version v5.0"), ("المعالج", "CPU work bar"), ("الذاكرة", "RAM tray fills")]),
    9: dict(canvas="light", header=True, pill="نفس الجهاز", ev=[
        ("تاعك؟", "your phone + box"), ("الإمكانيات", "capacity line"), ("الخدمة", "blocks drop"), ("عليه", "overflow"),
        ("خفيف", "LIGHT tag"), ("ثقيل", "HEAVY"), ("تحديث", "update card"), ("تزيد", "FASTER + APPS chip")]),
    10: dict(canvas="light", header=True, pill="سبب 3 و 4", ev=[
        ("التخزين", "storage bar"), ("يعمر", "storage 97% red"), ("يسخن", "thermometer"), ("ينقّص", "dial dips"),
        ("تشوف", "2x2 cause grid"), ("السبب", "four causes, one symptom"), ("واحد", "hold")]),
    11: dict(canvas="light", header=True, pill="الحكم", ev=[
        ("يبطّؤوه", "verdict chip unlocks"), ("إيه", "BATTERY -> SLOWER proven"), ("البطء", "dotted SLOWER -> BUY NEW?"),
        ("يثبتش", "stamp: not proven")]),
    12: dict(canvas="light", header=True, pill="قبل ما تبدّل", ev=[
        ("قبل", "save card"), ("البطارية", "row 1 battery health"), ("والتخزين", "row 2 storage"), ("وإذا", "row 3 battery swap"),
        ("تبديلها", "row 3 highlight"), ("الدراهم", "save money sticker")]),
    13: dict(canvas="light", header=False, pill=None, ev=[
        ("@S+0.0", "end card objects"), ("@S+0.35", "wordmark + stamp"), ("@S+0.7", "button + comment prompt")]),
}
# measured pauses (RMS on the source clips, mapped to the master): (word fragment, previous word ends, this word starts)
PINS = {
    2: [("تفتح", 4.76, 4.94)],
    3: [("نبداو", 8.81, 9.20)],
    4: [("والمشكل؟", 15.08, 15.59), ("ومن", 17.89, 18.25)],
    5: [("بصح", 23.38, 23.62), ("وهنا", 26.59, 26.77)],
    6: [("كيما", 34.92, 35.54), ("الماء", 36.13, 36.51)],
    7: [("الحل؟", 42.78, 43.32), ("يستهلك", 46.93, 47.41)],
    9: [("بقى", 59.92, 60.11), ("لهذا", 63.06, 63.36), ("وماشي", 66.36, 66.57)],
    10: [("كي", 70.70, 70.88), ("وكي", 73.08, 73.31), ("تشوف", 76.06, 76.55)],
    12: [("وإذا", 88.24, 88.55)],
}

pages_out, new_scenes = [], []
for sc in TL["scenes"]:
    sid = sc["id"]
    spec = SPEC[sid]
    timed = []
    if sid in CAPTION:
        words = CAPTION[sid].split()
        iv = runs(sc["speechStartSec"] - 0.05, sc["speechEndSec"] + 0.05)
        vt = sum(b - a for a, b in iv)
        weights = np.array([len(re.sub(r"[^\w]", "", wd)) + 2.0 for wd in words])
        cw = np.concatenate([[0], np.cumsum(weights)]) / weights.sum()
        acc, pauses = 0.0, []
        for k in range(len(iv) - 1):
            acc += iv[k][1] - iv[k][0]
            if iv[k + 1][0] - iv[k][1] >= 0.16:
                pauses.append(acc / vt)
        punct_idx = [i + 1 for i, wd in enumerate(words) if PUNCT.search(wd) and i < len(words) - 1]
        anchors, last = [(0.0, 0.0)], 0
        for pf in pauses:
            best = None
            for pi in punct_idx:
                if pi <= last:
                    continue
                d = abs(cw[pi] - pf)
                if d < 0.14 and (best is None or d < best[0]):
                    best = (d, pi)
            if best:
                anchors.append((cw[best[1]], pf))
                last = best[1]
        anchors.append((1.0, 1.0))
        wfr, vfr = zip(*anchors)

        def v2t(v):
            target = v * vt
            for a, b in iv:
                if target <= b - a + 1e-9:
                    return a + target
                target -= b - a
            return iv[-1][1]

        for i, wd in enumerate(words):
            s = v2t(float(np.interp(cw[i], wfr, vfr)))
            e = v2t(float(np.interp(cw[i + 1], wfr, vfr)))
            # a final "." lands on the wrong side in RTL captions: drop it, but still end the page there
            dot = wd.endswith(".") and not wd.endswith("…")
            timed.append(dict(text=wd[:-1] if dot else wd, startMs=round(s * 1000), endMs=round(max(e, s + 0.08) * 1000), _end=dot))
        pins = sorted([(next(i for i, t_ in enumerate(timed) if frag in t_["text"]), g, s) for frag, g, s in PINS.get(sid, [])])
        if pins:
            bounds = [(0, None, sc["speechStartSec"])] + pins + [(len(timed), sc["speechEndSec"], None)]
            for (i0, _, s0), (i1, g1, _) in zip(bounds, bounds[1:]):
                seg = timed[i0:i1]
                a0, a1 = seg[0]["startMs"] / 1000, seg[-1]["endMs"] / 1000
                for t_ in seg:
                    for k in ("startMs", "endMs"):
                        t_[k] = round((s0 + (t_[k] / 1000 - a0) / (a1 - a0) * (g1 - s0)) * 1000)

        page = []

        def flush():
            if page:
                pages_out.append(dict(scene=sid, startMs=page[0]["startMs"], endMs=page[-1]["endMs"], words=list(page)))
                page.clear()

        for tw in timed:
            letters = sum(len(p["text"]) for p in page) + len(tw["text"])
            if page and (len(page) >= 4 or letters > 22 or tw["startMs"] - page[-1]["endMs"] > 260):
                flush()
            page.append(tw)
            if PUNCT.search(tw["text"]) or tw.pop("_end", False):
                flush()
        flush()
        for tw in timed:
            tw.pop("_end", None)

    evs = [dict(sec=sc["startSec"], what="scene start")]
    cursor = 0
    for frag, what in spec["ev"]:
        if frag.startswith("@S"):
            t = sc["startSec"] + float(frag[2:] or 0)
        else:
            k = next((i for i in range(cursor, len(timed)) if frag in timed[i]["text"]), None)
            if k is None:
                raise SystemExit(f"scene {sid}: word '{frag}' not found after index {cursor}")
            cursor = k + 1
            t = timed[k]["startMs"] / 1000 - LEAD
        t = max(sc["startSec"], min(t, sc["endSec"] - 0.2))
        evs.append(dict(sec=round(t, 3), what=what))
    for e in evs:
        e["frame"] = round(e["sec"] * TL["fps"])
    ns = {k: v for k, v in sc.items() if k not in ("events",)}
    ns["voiceover"] = CAPTION.get(sid, "")
    ns["props"] = dict(canvas=spec["canvas"], header=spec["header"], headerTag=TAG if spec["header"] else None,
                       chapterPill=spec["pill"], events=evs)
    new_scenes.append(ns)

out_dir = ROOT / "src/videos/phone-slowdown-v2"
out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / "captions.json").write_text(json.dumps(dict(approximate=True, pages=pages_out), ensure_ascii=False, indent=1), encoding="utf-8")
tl = {k: v for k, v in TL.items() if k != "scenes"}
tl["audioFile"] = "public/phone-slowdown-v2/voice.wav"
tl["scenes"] = new_scenes
(out_dir / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1), encoding="utf-8")


def ts(ms):
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


srt = "\n".join(f"{i+1}\n{ts(p['startMs'])} --> {ts(p['endMs'])}\n{' '.join(w['text'] for w in p['words'])}\n" for i, p in enumerate(pages_out))
(ROOT / "public/phone-slowdown-v2").mkdir(parents=True, exist_ok=True)
(ROOT / "public/phone-slowdown-v2/captions.srt").write_text(srt, encoding="utf-8")
print(len(pages_out), "pages")
for s in new_scenes:
    print(s["id"], s["startSec"], s["endSec"], [e["sec"] for e in s["props"]["events"]])
