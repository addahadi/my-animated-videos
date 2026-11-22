"""Write plans/gta6-fake-download-timeline.json from measured master times.
Event times = master time of the word (RMS segment starts + draft ASR, check by ear)
minus a 0.25 s lead. Run: .venv/Scripts/python.exe videos/GTA_6/build_timeline.py"""
import json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FPS = 30
M = json.loads((Path(__file__).parent / "narration-master.json").read_text(encoding="utf-8"))
END = round(M["durationSec"], 3)
L = 0.25


def fr(s):
    return int(math.floor(s * FPS + 0.5))


def ev(items):
    return [{"sec": round(max(0, s), 2), "frame": fr(max(0, s)), "what": w} for s, w in items]


S = [
    (0.0, 6.35, "صاحبك بعثلك lien فيه: حمّل GTA 6 للـPC مجانا. زعما صح ولا كذب؟", "HookLink",
     "light", False, None, None, "GTA 6 PC مجانا؟", ["buzz", "pop", "pop-soft"], "hook",
     [(0.0, "phone already rising, chat bubble sliding in, phone buzz (motion on frame 0)"),
      (0.53 - L, "link card unfolds: neon-city thumbnail, 'GTA 6 PC · FREE · 2.1 GB'"),
      (1.93 - L, "green DOWNLOAD chip pulses; cursor glides toward it"),
      (3.65 - L, "sticker 'مجانا' slaps on the card (yellow)"),
      (4.63 - L, "two buttons pop under the card: صح (green) / كذب (red), cursor hovers between them"),
      (5.9, "hold 0.45 s: cursor freezes, buttons wobble (open loop)")]),
    (6.35, 9.70, "ماكاش منها. GTA 6 خرجت غير على PS5 و Xbox", "VerdictPlatforms",
     "light", True, "صح ولا كذب؟", None, "كذب", ["stamp", "pop", "ding"], "aha",
     [(6.35 - 0.2, "red Stamp 'كذب' slams on the link card (hit)"),
      (7.26 - L, "card slides up and shrinks; platform row builds below"),
      (8.78 - L, "console box 'PS5' + green check"),
      (9.10 - L, "console box 'XBOX SERIES' + green check")]),
    (9.70, 12.70, "ما كاين حتى نسخة PC، وما كاين حتى نسخة Android", "VerdictPlatforms",
     "light", True, "صح ولا كذب؟", None, "PC ❌ Android ❌", ["hit", "hit"], "explain",
     [(10.80 - L, "PC monitor slides in, XStamp (hit)"),
      (12.06 - L, "phone slides in, XStamp 'ANDROID' (hit)")]),
    (12.70, 18.47, "إذن أي fichier مكتوب عليه GTA 6 PC ولا GTA 6 APK... ماهيش اللعبة الأصلية. بصح السؤال", "FakeDownloadPage",
     "light", True, "صح ولا كذب؟", None, "ماشي اللعبة", ["whoosh", "pop", "pop", "strike"], "explain",
     [(12.77 - L, "BrowserCard 'gta6-free-pc.download' drops in: 3 flashing DOWNLOAD buttons, countdown 00:09"),
      (13.98 - L, "file chip 'GTA6_Setup.exe' falls out"),
      (15.78 - L, "file chip 'GTA6.apk' falls out"),
      (16.48 - L, "sticker 'ماشي اللعبة' (red) over both files")]),
    (18.47, 20.31, "واش كاين داخل هذا الـfichier؟", "FakeDownloadPage",
     "light", True, "صح ولا كذب؟", None, "واش داخلو؟", ["zoom", "lock"], "open loop",
     [(18.47 - 0.3, "camera pushes into GTA6_Setup.exe; LockedChip 'INSIDE · ?' shakes"),
      (19.6, "icon wobbles, '?' pulses")]),
    (20.31, 26.78, "في بزاف الحالات، كاين برنامج اسمو infostealer، يعني سارق. كي تفتحو، يقرا الـpasswords المسجلين في الـbrowser", "Infostealer",
     "dark", True, "INSIDE THE FILE", None, "infostealer = سارق", ["unlock", "pop", "scan", "tick"], "explain",
     [(20.31 - 0.2, "chip unlocks; dark blueprint; thief glyph (hooked hand) crawls out"),
      (22.33 - L, "TermLabel 'INFOSTEALER' pops"),
      (23.47 - L, "gloss 'سارق' snaps under it"),
      (23.95 - L, "BrowserCard 'SAVED PASSWORDS' opens: 3 rows ●●●●●●"),
      (25.19 - L, "rows pulled one by one along DrawPath into bag 'SERVER' (scan + tick)")]),
    (26.78, 29.08, "ويسرق الـcookies اللي يخليوك connecté", "Infostealer",
     "dark", True, "INSIDE THE FILE", None, "+ cookies", ["pop", "whoosh-short"], "explain",
     [(26.98 - L, "TicketChip cookie (yellow, from the cookies video) pulled out after the passwords"),
      (28.31 - L, "green pill 'CONNECTÉ' on the ticket as it flies into the bag")]),
    (29.08, 33.83, "وبالـcookie هادي، ما يحتاجش حتى الـpassword. يدخل للـFacebook ولا Instagram نتاعك كأنو نتا", "CookieEntry",
     "light", True, "صح ولا كذب؟", None, "يدخل كأنو نتا", ["pop", "strike", "unlock", "morph"], "aha",
     [(29.08 - 0.2, "thief holds the yellow ticket in front of a login gate (NodeBox 'ACCOUNT')"),
      (30.67 - L, "password field ●●●● gets struck through (small XStamp)"),
      (31.56 - L, "ticket slides in, gate turns green 'WELCOME BACK' (unlock)"),
      (32.47 - L, "generic ProfileCard (invented name, no platform logo)"),
      (33.27 - L, "card flips: same avatar, thief glyph behind it (morph); footnote '* ماشي ديما'")]),
    (33.83, 38.24, "ويبعث نفس الـlien لصحابك. وهكا وصلك من عند صاحبك", "SpreadToFriends",
     "light", True, "صح ولا كذب؟", None, "وهكا وصلك", ["whoosh", "pop", "zoom"], "aha",
     [(34.35 - L, "link bubble from scene 1 clones out to 5 friend chats along DrawPaths"),
      (36.0 - L, "camera zooms into the last chat"),
      (37.53 - L, "it is exactly the frame-1 chat: 'صاحبي' + same link card (loop closed, hit)")]),
    (38.24, 43.95, "وكاين نوع آخر: يخلي الـPC نتاعك يخدم للـcrypto في الخفية. يسخن، يبطا، والـventilateur ما يحبسش", "HiddenMiner",
     "dark", True, "TYPE 2 · MINER", None, "PC يخدم لغيرك", ["hum", "tick-roll", "glow"], "explain",
     [(38.31 - L, "PC tower on blueprint, fan idle"),
      (39.51 - L, "SpeedDial 'CPU' sweeps to 100%"),
      (40.33 - L, "small coins float out the back toward a far NodeBox 'NOT YOU'"),
      (41.52 - L, "Thermometer rises to red ('يسخن')"),
      (42.03 - L, "SpeedBar drops red ('يبطا')"),
      (42.43 - L, "fan spins faster and faster, hum rises; sticker 'PC يخدم لغيرك'")]),
    (43.95, 55.97, "إذن كيفاش تعرف الـarnaque؟ واحد: اللعبة ماهيش في الـstore الرسمي؟ ماشي هي. جوج: يقولك طفّي الـantivirus ولا سمّح بـunknown apps؟ هرب. ثلاثة: يطلب رقمك ولا دراهم باش يفتحلك التحميل؟ arnaque.", "ScamChecklist",
     "light", True, "صح ولا كذب؟", None, "3 علامات الـarnaque", ["pop", "pop", "stamp", "pop", "stamp", "pop", "ding"], "save frame",
     [(44.02 - L, "MiniUI card title '3 علامات الـarnaque' + counter 0/3"),
      (46.10 - L, "row 1: store icon + cross 'ماشي في الـstore الرسمي'"),
      (48.39 - L, "red flag on row 1 ('ماشي هي')"),
      (48.95 - L, "row 2: shield switching off 'طفّي الـantivirus / unknown apps'"),
      (51.78 - L, "red flag + mini stamp 'هرب' on row 2"),
      (52.48 - L, "row 3: number field + coin 'رقمك ولا دراهم'"),
      (54.4 - L, "red flag row 3; stamp 'ARNAQUE' on the card"),
      (54.97, "full card held 1.0 s, all rows at full opacity, pin chip 'سيفيها' (silent save cue)")]),
    (55.97, 60.65, "GTA 6 PC؟ ماكاش منها. الـcrack هذا ما يسرقش اللعبة... يسرقك نتا", "PayoffStrike",
     "light", False, None, None, "يسرقك نتا.", ["stamp", "type", "strike", "hit"], "aha",
     [(55.97 - 0.2, "frame-1 link card returns with red 'كذب' stamp"),
      (58.12 - L, "headline types 'ما يسرقش اللعبة'"),
      (59.43 - 0.3, "'اللعبة' struck through, replaced by 'يسرقك نتا' in red (hit)")]),
    (60.65, END, "ابعث الفيديو لصاحبك اللي راهو يستنى فيه.", "EndCardShare",
     "light", False, None, None, "ابعثها لصاحبك", ["whoosh", "pop", "ding"], "CTA",
     [(60.65 - L, "send arrow flies the link card into a chat labelled 'صاحبك' (share cue)"),
      (62.46, "end card: Runtime.tech wordmark + ScanLine, series pill 'صح ولا كذب؟ · 01', teaser chip 'الجاي: كيفاش ترجع الـaccount', FOLLOW button"),
      (END - 0.4, "chat bubble pops in at the same spot as frame 1 (loop)")]),
]

scenes = []
for i, (a, b, vo, comp, canvas, header, tag, pill, txt, sfx, role, events) in enumerate(S, 1):
    scenes.append({"id": i, "startSec": a, "endSec": b, "startFrame": fr(a), "endFrame": fr(b),
                   "voiceover": vo, "component": comp,
                   "props": {"canvas": canvas, "header": header, "headerTag": tag, "chapterPill": pill, "events": ev(events)},
                   "onScreenText": txt, "sfx": sfx, "tool": "remotion", "role": role})
for x, y in zip(scenes, scenes[1:]):
    assert x["endFrame"] == y["startFrame"] and x["endSec"] == y["startSec"]
dur = fr(END)
assert scenes[0]["startFrame"] == 0 and scenes[-1]["endFrame"] == dur
out = {"fps": FPS, "width": 1080, "height": 1920, "durationInFrames": dur, "audioDurationSec": END,
       "audioFile": M["file"],
       "audioSourceNote": "audio1-3 + audio5-9 in order; audio4 (earlier take of the audio5 line) unused. Only edge silence trimmed; 0.45 s gap before the verdict, 1.0 s save-frame hold after the checklist, 0.25 s elsewhere, 2.0 s end-card tail. No words cut or reordered. Voiceover text is the recorded wording from draft ASR: check by ear before captions.",
       "colorMeanings": {"red": "fake / trap / stolen (stamp, crosses, flags, thief)",
                         "green": "real and official (platform checks); the gate opening is shown green only as access granted",
                         "yellow": "the cookie ticket and highlight stickers",
                         "blue": "neutral UI icons",
                         "dark canvas": "inside the malware (what you cannot see)"},
       "narrationEdit": M["narrationEdit"], "scenes": scenes}
(ROOT / "plans/gta6-fake-download-timeline.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print("ok", dur, "frames", len(scenes), "scenes")
