"""TikTok-cut timeline for baridimob-scams (voice: public/baridimob-scams/voice-tiktok.wav, 44.16 s).

Same scene contract as the main cut. Phrase windows come from pauses in the assembled audio (silencedetect)
plus a rough word-timestamp pass used ONLY to place phrases, never to change the wording. The recorded
wording differs slightly from the script (see plans/baridimob-scams-tiktok-plan.md); check by ear.
Run: .venv/Scripts/python.exe -I videos/barid_mob/build_timeline_tiktok.py
"""
import json, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
SLUG = "baridimob-scams"
OUT = ROOT / f"plans/{SLUG}-tiktok-timeline.json"
FPS = 30
END = 1325 / FPS  # audio 44.160 s -> 1325 frames
CUTS = [0.0, 425 / FPS, 620 / FPS, 812 / FPS, 1008 / FPS, 1086 / FPS, END]
TAG = "SECURITY · BARIDIMOB"

# (start, end, phrase): what the voice says, where (master seconds)
PHRASES = {
    1: [(0.10, 2.53, "الساعة 2 تاع الليل، تجيك رسالة من البريد."),
        (2.85, 4.84, "حسابك راح يتبلوكا، دخل لهاذ اللينك."),
        (5.31, 6.45, "تخاف وتدخل…"),
        (6.91, 9.08, "تلقى صفحة تشبه بريد الجزائر بالضبط."),
        (9.26, 10.84, "نفس الألوان ونفس الخانات."),
        (11.58, 13.86, "تكتب الكود، والمحتال يقراه في نفس الثانية.")],
    2: [(14.46, 16.88, "وفي الصباح، تحل بريدي موب: صفر دينار."),
        (17.36, 18.25, "ماكانش hacker."),
        (18.25, 20.39, "بصح انت بيدك عطيت الكود للمحتال.")],
    3: [(20.93, 23.95, "هاذي القاعدة: بريد الجزائر ما يطلبش منك الكود."),
        (23.95, 26.82, "لا في SMS، لا في التيليفون، ولا في الميساج.")],
    4: [(27.33, 30.75, "وإذا صرالك: روح لأقرب GAB باش تبدّل الرقم المربوط بالحساب،"),
        (31.01, 33.32, "عيّط لـ 1530، وأودع شكوى عند الشرطة.")],
    5: [(33.85, 36.15, "ابعث الفيديو لماماك وباباك.")],
    6: [(36.30, 37.62, "وكاين حيلة أخطر:"),
        (37.84, 40.29, "تطبيق مزيف يشوف كلش واش راك تكتب."),
        (40.52, 41.96, "نزيدو Part 2؟"),
        (42.20, 43.43, "اكتب \"إيه\" في الكومنتار.")],
}

# (component, role, canvas, header, chapterPill, extra props, events, onScreenText, sfx, reused-from-main)
SCENES = [
    ("TrickSms", "hook", "light", False, None,
     {"lockTime": "02:00", "lockDay": "NIGHT", "hookText": True, "notIt": "لينك مزيف"},
     [(0.0, "phone lock screen 02:00 + hook text on screen at frame 0"),
      (0.6, "SmsNotif slides down: ALGERIE-POSTE, حسابك راح يتبلوكا…, link chip"),
      (5.75, "finger tap on the link (تدخل)"),
      (6.55, "fake login page builds in the phone browser"),
      (9.35, "magnifier over the URL poste-dz-verif.xyz + sticker 'لينك مزيف'"),
      (11.2, "code digits type into the form (تكتب الكود)"),
      (12.4, "CODE chip flies to the LootBag; tag 0.0 s")],
     "SMS من البريد في الليل؟ ⚠️ → لينك مزيف 🔗", ["buzz", "tick", "scan", "type", "whoosh"], 3),
    ("TtMorningZero", "payoff", "light", True, None, {},
     [(14.25, "morning: wallet phone slides in, sun pill 'الصباح', real BaridiMob logo tile"),
      (15.95, "balance hits 0 DA, red sticker (صفر)"),
      (16.35, "transfer row −48 750 DA"),
      (17.3, "phone shrinks left, hacker photo enters (ماكانش hacker)"),
      (17.85, "XStamp over the photo"),
      (18.45, "photo exits; CODE chip leaves the phone"),
      (19.9, "chip lands in the LootBag + sticker 'انت عطيتهولو 🔑'")],
     "0 DA → انت عطيتهولو 🔑", ["hit", "stamp", "whoosh", "pop"], 1),
    ("RuleStamp", "rule", "light", True, "القاعدة", {"logo": "baridimob-scams/images/algerie-poste-logo.svg"},
     [(20.75, "real Algérie Poste logo pops (هاذي القاعدة)"),
      (21.45, "rule text types in"),
      (24.3, "pill SMS ✕"),
      (25.15, "pill تيليفون ✕"),
      (26.0, "pill ميساج ✕")],
     "ما يطلبوش الكود ❌", ["pop-soft", "type", "strike"], 6),
    ("RecoveryChecklist", "save frame", "light", True, None, {},
     [(27.15, "MiniUI 'إذا صرالك' appears"),
      (28.3, "AtmMock enters big (GAB)"),
      (30.55, "AtmMock shrinks into row 1"),
      (30.95, "row 2: 1530"),
      (31.95, "gendarmerie photo enters big (شكوى)"),
      (32.95, "photo shrinks into row 3; full list holds")],
     "GAB · 1530 · شكوى", ["whoosh-short", "pop", "ding"], 7),
    ("TtShare", "share", "light", False, None, {},
     [(33.7, "send icon + 'ابعثو لماماك وباباك'")],
     "ابعثو لماماك وباباك", ["whoosh", "pop"], 8),
    ("TtTease", "CTA / part 2", "dark", False, None, {},
     [(36.3, "dark reveal, phone rises, red sticker 'حيلة أخطر'"),
      (37.85, "fake app opens, eye spreads over the screen + label 'تطبيق مزيف'"),
      (38.9, "ghost cursor + code dots typed, 'يشوف كلش'"),
      (40.45, "big 'Part 2؟' pill"),
      (42.1, "'اكتب إيه 👇' + green إيه button pulses")],
     "Part 2؟ اكتب \"إيه\" 👇", ["glow", "pop", "type", "stamp"], 5),
]

out = []
for i, (comp, role, canvas, header, pill, extra, evs, ost, sfx, reuse) in enumerate(SCENES):
    sid = i + 1
    s, e = CUTS[i], CUTS[i + 1]
    for t, _ in evs:
        assert s - 0.01 <= t < e, (sid, t)
    for a, b, _ in PHRASES[sid]:
        assert s - 0.01 <= a < b <= e + 0.01, (sid, a, b)
    out.append({
        "id": sid, "startSec": round(s, 4), "endSec": round(e, 4),
        "startFrame": round(s * FPS), "endFrame": round(e * FPS),
        "voiceover": " ".join(p for _, _, p in PHRASES[sid]),
        "phrases": [{"start": a, "end": b, "text": p} for a, b, p in PHRASES[sid]],
        "component": comp,
        "props": {"canvas": canvas, "header": header, "headerTag": TAG if header else None, "chapterPill": pill, **extra,
                  "events": [{"sec": t, "frame": round(t * FPS), "what": w} for t, w in evs]},
        "onScreenText": ost, "sfx": sfx, "tool": "remotion", "role": role, "reusesMainScene": reuse,
    })
for a, b in zip(out, out[1:]):
    assert a["endFrame"] == b["startFrame"]
tl = {"fps": FPS, "width": 1080, "height": 1920, "audioFile": f"public/{SLUG}/voice-tiktok.wav",
      "note": "Event and phrase times are absolute seconds in voice-tiktok.wav; approximate (pause-based), check by ear.",
      "scenes": out}
OUT.write_text(json.dumps(tl, ensure_ascii=False, indent=1), encoding="utf-8")
print("scenes", len(out), "last frame", out[-1]["endFrame"])
