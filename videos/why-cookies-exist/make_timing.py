"""Captions + scene events for why-cookies-exist, built from the SCRIPT text (never from ASR).

Word timing is approximate: each scene's words are spread over the voiced parts of the
narration master (RMS > -32 dBFS) in proportion to word length, with punctuation anchored
to the nearest real pause (same method as phone-listening).

Scene events are anchored to words: each event = start of a given word minus a lead
(visuals lead the voice by 0.2-0.4 s). Scene boundaries, frames and audio come unchanged
from plans/why-cookies-exist-timeline.json.

Outputs:
  src/videos/why-cookies-exist/captions.json
  src/videos/why-cookies-exist/timeline.json   (plan timeline + props.events/canvas/header/chapterPill)
  public/why-cookies-exist/captions.srt        (for CapCut)
Run: .venv/Scripts/python.exe -I videos/why-cookies-exist/make_timing.py
"""
import json, re, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FF = r"C:/Users/hecin/AppData/Roaming/Python/Python313/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe"
TL = json.loads((ROOT / "plans/why-cookies-exist-timeline.json").read_text(encoding="utf-8"))
AUDIO = ROOT / TL["audioFile"]
HOP = 0.02
LEAD = 0.3

raw = subprocess.run([FF, "-v", "error", "-i", str(AUDIO), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(float) / 32768
w = int(16000 * HOP)
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
            out.append([s * HOP, i * HOP]); s = None
    if s is not None:
        out.append([s * HOP, i1 * HOP])
    merged = []
    for r in out:
        if merged and r[0] - merged[-1][1] < 0.12:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    return [r for r in merged if r[1] - r[0] >= 0.08]


PUNCT = re.compile(r"[،,.؟?!:…]+$")

# ---- scene props + word-anchored events: (word fragment, what) ; event 0 is always the scene start
TAG = "HOW IT WORKS · COOKIES"
SPEC = {
    1: dict(canvas="light", header=False, pill=None, ev=[
        ("قريت", "profile row 1: read news"), ("شفت", "row 2: looked at shoes"), ("حبيت", "row 3: wanted to buy a phone"),
        ("وعمرك", "pull back: the card lives inside ADS CO."), ("دخلت", "0 VISITS sticker"),
        ("والمفتاح", "phone + cookie banner rise"), ("Accept", "cursor taps Accept")]),
    2: dict(canvas="light", header=True, pill="المشكل", ev=[
        ("الموقع", "browser + server pop"), ("يعقلش", "? bubble over the server")]),
    3: dict(canvas="light", header=True, pill="بلا ذاكرة", ev=[
        ("HTTP،", "HTTP packet travels"), ("ذاكرة", "memory slashed + term label"), ("صفحة", "page strip, new request"),
        ("يشوفك", "server: شكون نتا؟"), ("login", "login -> green check"), ("الموالية", "next page request"), ("ونساك", "check fades to ?")]),
    4: dict(canvas="light", header=True, pill="الحل · 1994", ev=[
        ("1994", "1994 sticker"), ("Netscape", "NETSCAPE label"), ("الـcookie", "ticket is born"),
        ("يحطو", "ticket slides into the browser"), ("رقم", "ID number glows"), ("الـpressing", "pressing counter"),
        ("القشّ", "shirt hung with tag"), ("يعطيك", "ticket handed over"), ("ترجع", "customer comes back"),
        ("تمدلو", "ticket handed back"), ("ديراكت", "matching shirt slides out + check")]),
    5: dict(canvas="light", header=True, pill="الموقع يتفكرك", ev=[
        ("login", "login check"), ("connecté", "pages flip, still logged in"), ("سبّاط", "shoe drops in cart"),
        ("وتخرج", "tab closes"), ("غدوة", "tomorrow sticker"), ("تلقاه", "site reopens, cart still 1")]),
    6: dict(canvas="dark", header=True, pill="بصح...", ev=[
        ("مشكل", "warning beat"), ("الإشهار", "ADS CO. box"), ("آلاف", "site grid"), ("الرقم", "same ID on tiles"),
        ("يتبعك", "lines run to ADS CO."), ("قريت", "profile row 1"), ("شفت", "profile row 2"), ("حوست", "profile row 3"),
        ("third-party", "3RD PARTY label")]),
    7: dict(canvas="light", header=True, pill="القانون", ev=[
        ("أوروبا", "stars circle"), ("ePrivacy", "ePrivacy label"), ("GDPR", "GDPR 2018 stamp"), ("تحطش", "rule card"),
        ("تسقسيهم", "consent lock"), ("زوار", "world map"), ("الـbanner", "banners pop worldwide"), ("كامل", "all lit")]),
    8: dict(canvas="light", header=True, pill="واش تختار؟", ev=[
        ("الـbanner", "save card enters"), ("مجبور", "مجبور sticker"), ("Accept", "Accept all row red"),
        ("يتبعوك", "tracking lines"), ("Reject", "Reject row green"), ("Necessary", "Necessary only row green"),
        ("يخدم", "cursor taps Necessary only, site works")]),
    9: dict(canvas="light", header=False, pill=None, ev=[
        ("الـcookie", "ticket centered"), ("السؤال", "question beat"), ("شكون", "ADS outlines appear"),
        ("معاه؟", "hold"), ("@END", "end card: wordmark"), ("@END+0.9", "follow button + comment prompt")]),
}

PINS = {  # scene: [(word fragment, previous word ends, this word starts)] in master seconds
    1: [("وعمرك", 3.37, 3.66), ("والمفتاح", 5.29, 5.79), ("Accept", 7.64, 7.90)],
    3: [("وHTTP", 14.445, 14.69), ("كل", 16.11, 16.53), ("تدير", 18.95, 19.43)],
    4: [("الـcookie", 24.11, 24.50)],
    6: [("نفس", 45.195, 45.445)],
    8: [("الـbanner", 65.825, 66.525), ("كي", 69.525, 69.995)],
}

pages_out, words_out, new_scenes = [], [], []
for sc in TL["scenes"]:
    words = sc["voiceover"].replace("...", "… ").split()
    words = [wd for wd in words if wd.strip("… ")] or words
    iv = runs(sc["startSec"], sc["endSec"])
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
            anchors.append((cw[best[1]], pf)); last = best[1]
    anchors.append((1.0, 1.0))
    wf, vf = zip(*anchors)

    def v2t(v):
        target = v * vt
        for a, b in iv:
            if target <= b - a + 1e-9:
                return a + target
            target -= b - a
        return iv[-1][1]

    timed = []
    for i, wd in enumerate(words):
        s = v2t(float(np.interp(cw[i], wf, vf)))
        e = v2t(float(np.interp(cw[i + 1], wf, vf)))
        timed.append(dict(text=wd, startMs=round(s * 1000), endMs=round(max(e, s + 0.08) * 1000)))

    # measured pauses (silencedetect on the source clips, mapped to the master): the word `frag`
    # starts at `start`, the word before it ends at `gap`. Words between pins are re-spread
    # proportionally to their estimated durations.
    pins = sorted(
        [(next(i for i, t_ in enumerate(timed) if frag in t_["text"]), g, s) for frag, g, s in PINS.get(sc["id"], [])]
    )
    if pins:
        bounds = [(0, None, min(timed[0]["startMs"] / 1000, sc["speechStartSec"] + 0.05))] + pins + [(len(timed), timed[-1]["endMs"] / 1000, None)]
        for (i0, _, s0), (i1, g1, _) in zip(bounds, bounds[1:]):
            seg = timed[i0:i1]
            a0, a1 = seg[0]["startMs"] / 1000, seg[-1]["endMs"] / 1000
            for t_ in seg:
                for k in ("startMs", "endMs"):
                    t_[k] = round((s0 + (t_[k] / 1000 - a0) / (a1 - a0) * (g1 - s0)) * 1000)

    page = []
    def flush():
        if page:
            pages_out.append(dict(scene=sc["id"], startMs=page[0]["startMs"], endMs=page[-1]["endMs"], words=list(page)))
            page.clear()
    for tw in timed:
        letters = sum(len(p["text"]) for p in page) + len(tw["text"])
        if page and (len(page) >= 4 or letters > 22 or tw["startMs"] - page[-1]["endMs"] > 260):
            flush()
        page.append(tw)
        if PUNCT.search(tw["text"]):
            flush()
    flush()
    words_out += timed

    # events
    spec = SPEC[sc["id"]]
    evs = [dict(sec=sc["startSec"], what="scene start")]
    cursor = 0
    for frag, what in spec["ev"]:
        if frag.startswith("@END"):
            off = float(frag[4:] or 0)
            t = timed[-1]["endMs"] / 1000 + 0.15 + off
        else:
            k = next((i for i in range(cursor, len(timed)) if frag in timed[i]["text"]), None)
            if k is None:
                raise SystemExit(f"scene {sc['id']}: word '{frag}' not found after index {cursor}")
            cursor = k + 1
            t = timed[k]["startMs"] / 1000 - LEAD
        t = max(sc["startSec"], min(t, sc["endSec"] - 0.2))
        evs.append(dict(sec=round(t, 3), what=what))
    for e in evs:
        e["frame"] = round(e["sec"] * TL["fps"])
    ns = {k: v for k, v in sc.items() if k != "events"}
    ns["props"] = dict(canvas=spec["canvas"], header=spec["header"], headerTag=TAG if spec["header"] else None,
                       chapterPill=spec["pill"], events=evs)
    new_scenes.append(ns)

out_dir = ROOT / "src/videos/why-cookies-exist"
out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / "captions.json").write_text(json.dumps(dict(approximate=True, pages=pages_out), ensure_ascii=False, indent=1), encoding="utf-8")
tl = {k: v for k, v in TL.items() if k != "scenes"}
tl["audioFile"] = "public/why-cookies-exist/voice.wav"
tl["scenes"] = new_scenes
(out_dir / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1), encoding="utf-8")


def ts(ms):
    h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"
srt = "\n".join(f"{i+1}\n{ts(p['startMs'])} --> {ts(p['endMs'])}\n{' '.join(w['text'] for w in p['words'])}\n" for i, p in enumerate(pages_out))
(ROOT / "public/why-cookies-exist").mkdir(parents=True, exist_ok=True)
(ROOT / "public/why-cookies-exist/captions.srt").write_text(srt, encoding="utf-8")
print(len(words_out), "words,", len(pages_out), "pages")
for s in new_scenes:
    print(s["id"], s["startSec"], s["endSec"], [e["sec"] for e in s["props"]["events"]])
