"""Timeline for baridimob-scams in the project's scene contract (canvas/header/chapterPill/events).

Scene cuts sit in the middle of the gaps between the 8 recordings (see plans/baridimob-scams-plan.md,
"Audio"). Event times are absolute seconds in public/baridimob-scams/voice.wav; inside-line anchors come
from pauses (silencedetect), so they are approximate.
Run: .venv/Scripts/python.exe -I videos/barid_mob/build_timeline.py
"""
import json, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
SLUG = "baridimob-scams"
PLAN_TL = ROOT / f"plans/{SLUG}-timeline.json"
old = {s["id"]: s for s in json.loads(PLAN_TL.read_text(encoding="utf-8"))["scenes"]}

FPS = 30
CUTS = [0.0, 3.8, 12.3667, 23.5333, 35.2667, 53.7, 59.5, 66.9, 72.7667]
TAG = "SECURITY · BARIDIMOB"

SCENES = [
    ("WalletHook", "hook", "light", False, None, [
        (0.0, "phone with generic wallet app, balance already falling from 48 750 DA; hook text on screen"),
        (2.3, "balance hits 0 DA, turns red, red sticker '0 DA' (hit)"),
        (2.7, "last-transaction row slides in: تحويل −48 750 DA"),
    ]),
    ("WhatHappened", "open loop", "light", True, None, [
        (4.0, "phone shrinks left, big '؟' pops (واش صرا)"),
        (5.2, "hacker-hoodie photo in ImageCard enters"),
        (5.8, "XStamp over the photo (ماكانش hacker)"),
        (6.4, "photo exits; yellow CODE chip slides out of the phone toward ThiefGlyph + LootBag"),
        (8.0, "chip stops halfway (عطيت الكود)"),
        (9.2, "phone shows calm green ✓ + sticker 'ما حسيتش'"),
        (10.3, "pill ١"),
        (10.8, "pill ٢"),
        (11.3, "pill ٣ (pulses: open loop)"),
    ]),
    ("TrickSms", "explain", "light", True, "حيلة 1 · SMS", [
        (12.45, "chapter pill + phone lock screen"),
        (13.3, "SmsNotif slides down: ALGERIE-POSTE, حسابك راح يتبلوكا…, link chip"),
        (16.9, "finger tap on the link (تدخل)"),
        (17.2, "fake login page builds in the phone browser"),
        (19.7, "magnifier over the URL poste-dz-verif.xyz + sticker 'ماشي هي'"),
        (21.2, "code digits type into the form"),
        (22.2, "CODE chip flies along a path to the LootBag; tag 0.0 s"),
    ]),
    ("TrickFakeApp", "explain", "light", True, "حيلة 2 · تطبيق مزيف", [
        (23.6, "chapter pill + phone with generic chat"),
        (24.6, "platform pills Facebook / Telegram (text only)"),
        (26.4, "LinkCard 'نسخة جديدة 🔥 حمّلها من هنا' with DOWNLOAD chip"),
        (29.1, "progress bar fills, blue wallet icon lands on the home screen"),
        (29.8, "icon flips: ThiefGlyph on its back + sticker 'تطبيق المحتال'"),
        (32.1, "split: chat download ❌ vs store ✅ 'Play Store · App Store'"),
        (33.2, "store side scales up"),
    ]),
    ("TrickOverlay", "aha", "dark", True, "حيلة 3 · الأخطر", [
        (35.35, "dark blueprint reveal + chapter pill + ANDROID sticker"),
        (37.5, "the fake app opens in the phone"),
        (38.6, "AccessibilityScreen slides up, fake row highlighted"),
        (40.0, "TermLabel Accessibility = إذن"),
        (41.4, "toggle flips ON + Allow tapped (تقبل)"),
        (42.0, "eye spreads over the screen"),
        (42.6, "ghost cursor moves by itself (until 45.0)"),
        (45.6, "the real wallet app (blue) opens"),
        (46.3, "red-edged fake layer slides down over it"),
        (47.2, "tilt to 3D side view: two labelled layers"),
        (49.2, "code typed on the top layer"),
        (50.1, "CODE chip flies from the top layer to the LootBag"),
        (52.0, "SMS code chip arrives, dotted copy to the LootBag"),
    ]),
    ("RuleStamp", "recap", "light", True, "القاعدة", [
        (53.8, "three trick icons in a row"),
        (54.4, "rule text types in"),
        (56.4, "pill SMS ✕"),
        (57.3, "pill تيليفون ✕"),
        (58.2, "pill ميساج ✕"),
        (58.9, "XStamp over the three trick icons"),
    ]),
    ("RecoveryChecklist", "save frame", "light", True, None, [
        (59.6, "MiniUI 'إذا صرالك' appears"),
        (60.5, "AtmMock enters big (GAB)"),
        (62.6, "AtmMock shrinks into row 1"),
        (63.4, "row 2: 1530"),
        (64.3, "gendarmerie photo enters big"),
        (64.9, "photo shrinks into row 3; full list holds"),
    ]),
    ("ShareLoop", "CTA", "light", False, None, [
        (67.0, "send icon + 'ابعثو لماماك وباباك'"),
        (70.0, "وانت؟ then the question; buttons إيه / لا from 70.75"),
        (72.1, "loop: CODE chip back into the phone, balance counts back up, phone locks"),
    ]),
]

out = []
for i, (comp, role, canvas, header, pill, evs) in enumerate(SCENES):
    sid = i + 1
    s, e = CUTS[i], CUTS[i + 1]
    for t, _ in evs:
        assert s - 0.01 <= t < e, (sid, t)
    prev = old[sid]
    out.append({
        "id": sid, "startSec": s, "endSec": e,
        "startFrame": round(s * FPS), "endFrame": round(e * FPS),
        "voiceover": prev["voiceover"],
        "component": comp,
        "props": {
            "canvas": canvas, "header": header, "headerTag": TAG if header else None, "chapterPill": pill,
            "events": [{"sec": t, "frame": round(t * FPS), "what": w} for t, w in evs],
        },
        "onScreenText": prev["onScreenText"], "sfx": prev["sfx"], "tool": "remotion", "role": role,
    })
for a, b in zip(out, out[1:]):
    assert a["endFrame"] == b["startFrame"]
tl = {"fps": FPS, "width": 1080, "height": 1920, "audioFile": f"public/{SLUG}/voice.wav",
      "note": "Event times are absolute seconds; inside-line anchors are approximate (pause-based).", "scenes": out}
PLAN_TL.write_text(json.dumps(tl, ensure_ascii=False, indent=1), encoding="utf-8")
print("scenes", len(out), "last frame", out[-1]["endFrame"])
