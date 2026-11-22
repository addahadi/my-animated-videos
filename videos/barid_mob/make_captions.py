"""Captions + build copies for baridimob-scams (adapted from videos/GTA_6/make_captions.py).

Caption text = each scene's `voiceover` in plans/gta6-fake-download-timeline.json (the recorded
wording). Word timing is APPROXIMATE: words are spread over the voiced parts of each scene
(RMS > -32 dBFS) in proportion to word length, punctuation anchored to the nearest real pause.

Outputs:
  (voice.wav is already in public/baridimob-scams/, built from the 8 recordings)
  public/baridimob-scams/captions.srt        for CapCut
  src/videos/baridimob-scams/captions.json
  src/videos/baridimob-scams/timeline.json   plan timeline copy (audioFile -> public copy)
Run: .venv/Scripts/python.exe -I videos/barid_mob/make_captions.py
"""
import json, re, shutil, sys, wave
from pathlib import Path
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
SLUG = "baridimob-scams"
TL = json.loads((ROOT / f"plans/{SLUG}-timeline.json").read_text(encoding="utf-8"))
SRC_AUDIO = ROOT / TL["audioFile"]
PUB = ROOT / "public" / SLUG
PUB.mkdir(parents=True, exist_ok=True)
if SRC_AUDIO.resolve() != (PUB / "voice.wav").resolve():
    shutil.copyfile(SRC_AUDIO, PUB / "voice.wav")

with wave.open(str(SRC_AUDIO)) as w:
    SR = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
HOP = 0.02
win = int(SR * HOP)
n = len(x) // win
db = 20 * np.log10(np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1)) + 1e-9)
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
# Latin phrases kept as ONE caption token (no-break spaces) so RTL lines keep their LTR order
GLUE = [("Play Store", "⁦Play Store⁩"), ("App Store", "⁦App Store⁩")]


def glue(text):
    for x, y in GLUE:
        text = text.replace(x, y)
    return text


# measured phrase windows (RMS pause segments of the source clip, mapped to master seconds)
# for scenes where proportional spreading drifts: (start, end, phrase)
SEGMENTS = {
    2: [(4.11, 5.22, "واش صرا؟"),
        (5.52, 6.22, "ماكانش hacker."),
        (6.46, 9.08, "انت بيدك عطيت الكود للمحتال…"),
        (9.21, 9.78, "وما حسيتش."),
        (10.12, 12.03, "وهاذي تصرا بـ 3 حيل، خلينا نشوفوهم.")],
    8: [(67.15, 68.93, "ابعث هاذ الفيديو لماماك ولا باباك،"),
        (69.08, 69.82, "باش ما يطيحوش فيها."),
        (70.19, 70.57, "وانت؟"),
        (70.72, 71.92, "وصلتك رسالة كيما هاذي؟ إيه ولا لا؟")],
}
pages_out = []


def flush_page(page, sid):
    if page:
        pages_out.append(dict(scene=sid, startMs=page[0]["startMs"], endMs=page[-1]["endMs"], words=list(page)))
        page.clear()


def paginate(timed, sid):
    page = []
    for tw in timed:
        letters = sum(len(p["text"]) for p in page) + len(tw["text"])
        if page and (len(page) >= 4 or letters > 22 or tw["startMs"] - page[-1]["endMs"] > 260):
            flush_page(page, sid)
        page.append(tw)
        if PUNCT.search(tw["text"]):
            flush_page(page, sid)
    flush_page(page, sid)


for sc in TL["scenes"]:
    if sc["id"] in SEGMENTS:
        joined = glue(" ".join(p for _, _, p in SEGMENTS[sc["id"]]))
        assert joined.split(" ") == [w for w in glue(sc["voiceover"]).replace("...", "… ").replace("  ", " ").split(" ") if w.strip("… ")], f"scene {sc['id']} segments != voiceover"
        timed = []
        for a, b, phrase in SEGMENTS[sc["id"]]:
            ws = glue(phrase).split(" ")
            wt = np.array([len(re.sub(r"[^\w]", "", w)) + 2.0 for w in ws])
            c = np.concatenate([[0], np.cumsum(wt)]) / wt.sum()
            for i, w in enumerate(ws):
                timed.append(dict(text=w, startMs=round((a + c[i] * (b - a)) * 1000), endMs=round((a + c[i + 1] * (b - a)) * 1000)))
        paginate(timed, sc["id"])
        continue
    words = [wd for wd in glue(sc["voiceover"]).replace("...", "… ").replace("  ", " ").split(" ") if wd.strip("… ")]
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
            if d < 0.16 and (best is None or d < best[0]):
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
    paginate(timed, sc["id"])

out_dir = ROOT / "src/videos" / SLUG
out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / "captions.json").write_text(json.dumps(dict(approximate=True, pages=pages_out), ensure_ascii=False, indent=1), encoding="utf-8")
tl = dict(TL)
tl["audioFile"] = f"public/{SLUG}/voice.wav"
(out_dir / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1), encoding="utf-8")


def ts(ms):
    h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


srt = "\n".join(f"{i+1}\n{ts(p['startMs'])} --> {ts(p['endMs'])}\n{' '.join(w['text'] for w in p['words'])}\n" for i, p in enumerate(pages_out))
(PUB / "captions.srt").write_text(srt, encoding="utf-8")
print(len(pages_out), "pages")
for p in pages_out:
    print(p["scene"], p["startMs"], p["endMs"], " ".join(w["text"] for w in p["words"]))
