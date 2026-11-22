"""Write plans/phone-slowdown-v2-timeline.json from the scene list below.

Times are on the narration master (v2/narration-master.wav). Run from the workspace root:
  .venv/Scripts/python.exe videos/phone-slowdown-on-purpose/v2/build_timeline.py
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
master = json.loads((Path(__file__).parent / "narration-master.json").read_text(encoding="utf-8"))
FPS, END = 30, master["durationSec"]


def f(s):
    return round(s * FPS)


def ev(at, note):
    return {"atSec": at, "note": note}


S = [
    dict(end=3.95, speech=(0.08, 3.69), comp="HookFine", role="hook",
         vo="Apple خلّصت غرامة… على خاطر ثقّلت تليفونات الناس بلا ما تقولهم.",
         text="غرامة… على التبطئة", sfx=["whoosh", "pop", "stamp"],
         events=[ev(0.0, "phone already sliding up, tag string swinging (motion on frame 0)"),
                 ev(0.65, "EUR 25M ValueTag lands just before 'غرامة' (~0.93)"),
                 ev(1.9, "phone screen: speed bar drains to slow, red sticker SLOWED (before 'ثقّلت' ~2.0)"),
                 ev(3.0, "red Stamp 'بلا ما يقولو' slams before 'بلا ما تقولهم' (~3.11)"),
                 ev(3.69, "pause 3.69-4.22: hold, everything still")]),
    dict(end=7.07, speech=(4.22, 6.92), comp="YourCamera", role="hook",
         vo="وانت؟ تفتح الكاميرا، تستنى… واللقطة تفوت.",
         text="اللقطة فاتت", sfx=["whoosh", "tick", "bloop"],
         events=[ev(3.95, "tag flips: EUR 25M -> 'YOUR PHONE · 2 YEARS' (on 'وانت؟' 4.22)"),
                 ev(4.75, "camera app opens on the phone, spinner starts (before 'تفتح الكاميرا' 4.94)"),
                 ev(5.6, "subject (ball) visible in the viewfinder, still loading"),
                 ev(6.3, "subject flies out of frame, viewfinder loads empty, red sticker MISSED (on 'تفوت')")]),
    dict(end=11.36, speech=(7.22, 11.16), comp="VerdictLocked", role="open loop",
         vo="زعما حتى تليفونك ثقّلوه؟ نبداو بواش دارت Apple في 2017.",
         text="واش صرا في 2017؟", sfx=["pop", "lock", "whoosh"],
         events=[ev(6.95, "LockedChip 'VERDICT · LOCKED' + '؟' pops beside the phone (before 'زعما' 7.22)"),
                 ev(8.81, "pause 8.81-9.20"),
                 ev(9.0, "ink StickerPill '2017' types in; HeaderStrip + ChapterPill 'القضية' arrive"),
                 ev(10.3, "phone slides left, case card starts to rise (before '2017' ~10.55)")]),
    dict(end=21.98, speech=(11.55, 21.79), comp="CaseFile", role="explain",
         vo="كانت تنقّص الأداء تاع بعض iPhone القدام كي تضعف البطارية تاعهم. والمشكل؟ ما وضّحتش هذا للناس مليح. ومن بعد، خلّصت غرامة في فرنسا، ودارت تسويات قضايا في أمريكا.",
         text="بطّأتهم… بلا ما توضّح", sfx=["pop", "pop", "stamp", "pop", "pop"],
         events=[ev(11.3, "three generic older phones; only those with a weak battery icon get a red SLOWED sticker"),
                 ev(15.08, "pause 15.08-15.59"),
                 ev(15.3, "evidence card 1: 'ما وضّحتش' + red Stamp 'NOT TOLD' (on 'ما وضّحتش' ~15.9)"),
                 ev(17.89, "pause 17.89-18.25"),
                 ev(18.6, "evidence card 2 fans in: 'FRANCE · 2020' + EUR 25M ValueTag returns (hook payoff, before 'فرنسا' ~19.7)"),
                 ev(20.8, "evidence card 3: 'USA · SETTLEMENTS' (before 'أمريكا' ~21.5)")]),
    dict(end=30.87, speech=(22.18, 30.73), comp="ClaimVsReply", role="explain / re-hook",
         vo="الناس حسّو بلي تخدعو. بصح Apple قالت: درنا هكّا باش التليفون ما يطفاش فجأة. وهنا لازم نفهمو حاجة: البطارية كي تقدّم، ماشي غير تولّي تفرغ بالخف.",
         text="علاش ينقّص السرعة أصلاً؟", sfx=["pop", "pop", "click", "whoosh"],
         events=[ev(21.95, "red SpeechBubble from the crowd: 'تخدعنا!'"),
                 ev(23.4, "pause 23.38-23.62; ink reply bubble 'باش ما يطفاش فجأة' (before 'بصح' 23.62)"),
                 ev(25.6, "phone screen flashes off/on once (on 'ما يطفاش فجأة' ~25.8)"),
                 ev(26.59, "pause 26.59-26.77; bubbles dim, ChapterPill 'البطارية'"),
                 ev(28.2, "battery ages: 'NEW' -> '2 YEARS'; drains faster (on 'تفرغ بالخف' ~29.8)")]),
    dict(end=39.60, speech=(31.02, 39.41), comp="BlueprintPower", role="aha (hardest idea)",
         vo="تقدر تكون مشحونة، بصح ما تقدرش تمدّ الطاقة بالسرعة اللي يحتاجها التليفون. كيما روبيني: الماء كاين، بصح كي تحتاج دفعة كبيرة، ما يخرجش كفاية.",
         text="الشحن وحدو ما يكفيش", sfx=["whoosh", "tick", "pop", "water"],
         events=[ev(30.9, "hard cut to dark blueprint; ChapterPill 'CHARGE ≠ POWER' with glow"),
                 ev(31.0, "left: CHARGE tank 80% (mint) labelled 'مشحونة' (before 'مشحونة' ~31.6)"),
                 ev(32.6, "right: POWER ScaleBar; marker 'NEEDED' jumps high; supply bar stops short; yellow delta bracket = gap (on 'ما تقدرش تمدّ')"),
                 ev(34.92, "pause 34.92-35.54; tap inset slides in (analogy)"),
                 ev(36.2, "tank behind the tap is full: 'الماء كاين' label"),
                 ev(37.6, "tap opened wide: only a thin stream; same yellow bracket (on 'دفعة كبيرة')")]),
    dict(end=49.91, speech=(39.80, 49.72), comp="BlueprintThrottle", role="explain",
         vo="كي البطارية تعجز تمدّ الطاقة المطلوبة، التليفون يقدر يطفى. الحل؟ النظام ينقّص سرعة المعالج، اللي ينفّذ الخدمة داخل التليفون. يستهلك أقل، ويخدم أبطأ، بصح يبقى شاعل.",
         text="سرعة أقل، طاقة أقل", sfx=["tick", "bloop", "pop", "ding"],
         events=[ev(39.7, "tap inset leaves; demand marker above supply turns red, warning blink"),
                 ev(41.8, "phone screen goes black for 0.4 s (on 'يطفى' ~42.5)"),
                 ev(42.78, "pause 42.78-43.32; '؟' then TermLabel 'CPU = المعالج' (on 'الحل؟' 43.32)"),
                 ev(44.3, "CPU speed dial turns down 100% -> 70% (on 'ينقّص سرعة المعالج')"),
                 ev(45.6, "demand marker slides down under the supply bar; bracket closes"),
                 ev(46.93, "pause 46.93-47.41"),
                 ev(47.2, "tags 'يستهلك أقل' (mint) / 'أبطأ' (red); phone screen ON + green sticker 'ON' (on 'يبقى شاعل' ~49.0)")]),
    dict(end=58.95, speech=(50.11, 58.76), comp="AppGrowth", role="re-hook / explain",
         vo="بصح ماشي كل تليفون ثقيل عندو هاذ المشكل. كاين تطبيقات تزيد فيها ميزات مع التحديثات، وتولّي تحتاج خدمة أكثر من المعالج، ومساحة أكبر في الذاكرة.",
         text="التطبيقات تطلب خدمة أكثر", sfx=["whoosh", "pop", "pop", "pop"],
         events=[ev(49.9, "back to light canvas; ChapterPill 'سبب 2 · التطبيقات'; battery case shrinks into diagnosis row 1 'BATTERY'"),
                 ev(50.6, "small red XStamp: not every slow phone has this problem"),
                 ev(52.0, "generic app card 'v1.0' -> 'v5.0': feature chips (VIDEO, FILTERS, AI) snap on one per ~0.6 s"),
                 ev(54.6, "CPU WORK bar grows (before 'المعالج' ~56.9)"),
                 ev(57.9, "RAM tray fills with blocks (before 'الذاكرة' ~58.3); TermLabel 'RAM = الذاكرة'")]),
    dict(end=70.12, speech=(59.13, 69.93), comp="SamePhoneMoreWork", role="explain",
         vo="(recorded, last clause check by ear) والتليفون تاعك؟ بقى بنفس الإمكانيات. نفس الجهاز، بصح الخدمة زادت عليه. لهذا تطبيق كان يخدم عندك خفيف يقدر يولّي ثقيل. وماشي كل تحديث يدير هكّا؛ كاين تحديثات فعلاً تزيد الأداء.",
         text="نفس الجهاز، الخدمة زادت", sfx=["pop", "tick", "pop", "ding"],
         events=[ev(58.9, "your phone (same as hook) with a fixed capacity box, tag 'SAME PHONE'"),
                 ev(60.4, "task blocks drop in one by one and overflow the box (on 'الخدمة زادت' ~62.3)"),
                 ev(63.36, "app weight tag 'LIGHT' -> 'HEAVY' red (on 'يولّي ثقيل' ~65.6)"),
                 ev(66.4, "green card 'UPDATE' slides in, blocks shrink, green sticker 'FASTER' (on 'تحديثات' ~68.5)"),
                 ev(69.5, "diagnosis row 2 'APPS' added")]),
    dict(end=79.43, speech=(70.32, 79.24), comp="StorageHeatRecap", role="recap",
         vo="وزيد، كي التخزين يقرب يعمر، يقدر التليفون يثقال. وكي يسخن بزاف، يقدر ينقّص السرعة باش يحمي روحو. تشوف نفس التقطيع، بصح السبب ماشي ديما واحد.",
         text="نفس التقطيع… أسباب مختلفة", sfx=["pop", "tick", "pop", "pop"],
         events=[ev(70.6, "STORAGE bar fills 60% -> 97%, last segment red (on 'يعمر' ~72.0); row 3 'STORAGE'"),
                 ev(73.1, "thermometer rises to red; speed dial dips (on 'يسخن بزاف'); row 4 'HEAT'"),
                 ev(76.06, "pause 76.06-76.55: recap frame builds"),
                 ev(76.3, "2x2 cause grid: BATTERY · APPS · STORAGE · HEAT, each with the same lag spinner")]),
    dict(end=84.75, speech=(79.63, 84.65), comp="VerdictOpen", role="aha / share moment",
         vo="(recorded, check by ear) يعني يقدرو يبطّؤوه بالعاني؟ إيه، في بعض الحالات. بصح البطء وحدو ما يثبتش بلي يحبوك تشري جديد.",
         text="البطء وحدو ما يثبتش النيّة", sfx=["unlock", "pop", "stamp"],
         events=[ev(79.4, "LockedChip from scene 3 returns and unlocks"),
                 ev(80.8, "green check 'إيه · في حالات' attached to the BATTERY row (before 'إيه' ~81.0)"),
                 ev(82.0, "solid link 'BATTERY -> SLOWER' (proven) vs dotted red link 'SLOWER -> BUY NEW?'"),
                 ev(83.8, "Stamp 'ما يثبتش' over the dotted link")]),
    dict(end=92.10, speech=(84.86, 91.89), comp="CheckBeforeBuying", role="save frame",
         vo="(recorded, check by ear) يعني قبل ما تبدّل تليفون، شوف حالة البطارية والتخزين. وإذا البطارية السبب، تبديلها يقدر يحسّن الأداء ويوفّر الدراهم.",
         text="قبل ما تبدّل… شوف", sfx=["whoosh", "tick", "tick", "ding"],
         events=[ev(84.75, "MiniUI card 'قبل ما تبدّل' enters, centered"),
                 ev(86.9, "row 1 'BATTERY HEALTH' with a value tag (before 'البطارية' ~87.3)"),
                 ev(87.6, "row 2 'STORAGE FREE' (before 'التخزين' ~87.9)"),
                 ev(89.0, "row 3 highlighted gold/beige: 'بطارية جديدة = أداء أحسن' + green sticker 'SAVE MONEY'"),
                 ev(89.7, "hold the clean card >= 2 s (89.7-92.1)")]),
    dict(end=END, speech=None, comp="EndCard", role="CTA / loop",
         vo="(no voice: end-card tail)", text="شحال عندو تليفونك؟", sfx=["whoosh", "stamp"],
         events=[ev(92.1, "end card: your phone with the hanging tag (frame-0 echo), Stamp 'EXPLAINED', wordmark Runtime.tech + ScanLine, tagline 'TECH · EXPLAINED SIMPLY', ink sticker 'شحال عندو تليفونك؟', button 'تابع للجاية'")]),
]

scenes, start = [], 0.0
for i, s in enumerate(S, 1):
    end = s["end"]
    last = i == len(S)
    sc = {"id": i, "startSec": round(start, 3), "endSec": round(end, 3),
          "startFrame": f(start), "endFrame": math.ceil(round(end * FPS, 6)) if last else f(end)}
    if s["speech"]:
        sc["speechStartSec"], sc["speechEndSec"] = s["speech"]
    sc.update({"voiceover": s["vo"], "component": s["comp"], "props": {}, "onScreenText": s["text"],
               "events": s["events"], "sfx": s["sfx"], "tool": "remotion", "role": s["role"]})
    scenes.append(sc)
    start = end

dur_frames = scenes[-1]["endFrame"]
out = {
    "fps": FPS, "width": 1080, "height": 1920, "durationInFrames": dur_frames,
    "audioDurationSec": END,
    "audioFile": "videos/phone-slowdown-on-purpose/v2/narration-master.wav",
    "audioSourceNote": "New intro audio_2026-11-15_20-01-11.ogg (replaces audio1-3) + unchanged audio4-10. "
                       "Only leading/trailing silence trimmed, 0.25 s gaps, 2.0 s end-card tail. No words cut or "
                       "reordered. Internal event times come from RMS pause detection and draft ASR: check by ear.",
    "colorMeanings": {
        "red": "slowdown and its penalty (throttle, fine, stamp, overload)",
        "green": "the phone keeps working / a fix that helps",
        "yellow": "ink-on-yellow highlight tags only",
        "blue": "neutral icons inside mini UI",
        "dark.marker (mint)": "power the battery can deliver",
        "dark.delta (yellow)": "gap between power needed and power delivered",
    },
    "narrationEdit": master["narrationEdit"],
    "scenes": scenes,
}

for a, b in zip(scenes, scenes[1:]):
    assert a["endFrame"] == b["startFrame"] and a["endSec"] == b["startSec"], (a["id"], b["id"])
assert scenes[0]["startFrame"] == 0 and dur_frames >= END * FPS and dur_frames - END * FPS < 1
for s in scenes:
    for e in s["events"]:
        assert s["startSec"] - 0.4 <= e["atSec"] <= s["endSec"], (s["id"], e)

p = ROOT / "plans/phone-slowdown-v2-timeline.json"
p.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
for s in scenes:
    print(s["id"], s["startSec"], s["endSec"], s["startFrame"], s["endFrame"],
          round(s["endSec"] - s["startSec"], 2), s["component"])
print("frames", dur_frames)
