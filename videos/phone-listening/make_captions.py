"""Build word-timed caption pages for phone-listening from the SCRIPT text (never from ASR).

Word timing is approximate: each scene's words are spread over the voiced parts of the
narration (RMS > -32 dBFS) in proportion to word length, with punctuation anchored to the
nearest real pause. Output: src/videos/phone-listening/captions.json
Run: .venv/Scripts/python.exe -I videos/phone-listening/make_captions.py
"""
import json, re, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FF = r"C:/Users/hecin/AppData/Roaming/Python/Python313/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe"
TL = json.loads((ROOT / "plans/phone-listening-timeline.json").read_text(encoding="utf-8"))
AUDIO = ROOT / TL["audioFile"]
HOP = 0.02

raw = subprocess.run([FF, "-v", "error", "-i", str(AUDIO), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(float) / 32768
w = int(16000 * HOP)
n = len(x) // w
db = 20 * np.log10(np.sqrt((x[: n * w].reshape(n, w) ** 2).mean(1)) + 1e-9)
voiced = db > -32


def runs(a, b):
    """voiced intervals inside [a,b], small gaps merged, tiny blips dropped."""
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
pages_out, words_out = [], []
for sc in TL["scenes"]:
    words = sc["voiceover"].replace("...", "… ").split()
    words = [wd for wd in words if wd.strip("… ")] or words
    iv = runs(sc["startSec"], sc["endSec"])
    vt = sum(b - a for a, b in iv)
    weights = np.array([len(re.sub(r"[^\w]", "", wd)) + 2.0 for wd in words])
    cw = np.concatenate([[0], np.cumsum(weights)]) / weights.sum()  # word boundaries in [0,1]
    # pauses (gaps between voiced runs) as fractions of voiced time
    acc, pauses = 0.0, []
    for k in range(len(iv) - 1):
        acc += iv[k][1] - iv[k][0]
        if iv[k + 1][0] - iv[k][1] >= 0.16:
            pauses.append((acc / vt, k))
    # anchor pauses to punctuation boundaries (monotonic, nearest within tolerance)
    punct_idx = [i + 1 for i, wd in enumerate(words) if PUNCT.search(wd) and i < len(words) - 1]
    anchors = [(0.0, 0.0)]  # (word-fraction, voiced-fraction)
    last = 0
    for pf, _ in pauses:
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

    def v2t(v):  # voiced-fraction -> absolute seconds
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
    # hook words measured by hand from the waveform (voiced runs), they drive the X stamps
    if sc["id"] == 1:
        fixed = {12: (3.95, 4.52), 13: (5.02, 5.40), 14: (5.76, 6.06), 15: (6.40, 6.95), 16: (6.95, 7.25), 17: (7.25, 7.50), 18: (7.80, 8.42)}
        for k, (a, b) in fixed.items():
            timed[k].update(startMs=round(a * 1000), endMs=round(b * 1000))
    # paging: <=4 words, <=22 letters, break after punctuation or a real gap
    page = []
    def flush():
        if page:
            pages_out.append(dict(scene=sc["id"], startMs=page[0]["startMs"], endMs=page[-1]["endMs"], words=list(page)))
            page.clear()
    for i, tw in enumerate(timed):
        letters = sum(len(p["text"]) for p in page) + len(tw["text"])
        if page and (len(page) >= 4 or letters > 22 or tw["startMs"] - page[-1]["endMs"] > 260):
            flush()
        page.append(tw)
        if PUNCT.search(tw["text"]):
            flush()
    flush()
    words_out += timed

out = ROOT / "src/videos/phone-listening/captions.json"
out.write_text(json.dumps(dict(approximate=True, pages=pages_out), ensure_ascii=False, indent=1), encoding="utf-8")
# also an SRT for CapCut, one cue per page
def ts(ms):
    h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"
srt = "\n".join(f"{i+1}\n{ts(p['startMs'])} --> {ts(p['endMs'])}\n{' '.join(w['text'] for w in p['words'])}\n" for i, p in enumerate(pages_out))
(ROOT / "public/phone-listening/captions.srt").write_text(srt, encoding="utf-8")
print(len(words_out), "words,", len(pages_out), "pages")
for p in pages_out[:8]:
    print(p["startMs"], p["endMs"], " ".join(w["text"] for w in p["words"]))
