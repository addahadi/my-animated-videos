"""Captions + build copies for the baridimob-scams TikTok cut.

Caption text = each scene's phrases in plans/baridimob-scams-tiktok-timeline.json (the recorded wording).
Word timing is APPROXIMATE: words are spread across each measured phrase window in proportion to length.
Outputs: public/baridimob-scams/captions-tiktok.srt, src/videos/baridimob-scams/captions-tiktok.json,
         src/videos/baridimob-scams/timeline-tiktok.json
Run: .venv/Scripts/python.exe -I videos/barid_mob/make_captions_tiktok.py
"""
import json, re, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
SLUG = "baridimob-scams"
TL = json.loads((ROOT / f"plans/{SLUG}-tiktok-timeline.json").read_text(encoding="utf-8"))
PUNCT = re.compile(r"[،,.؟?!:…]+[\"”]?$")
GLUE = [("Part 2", "⁦Part 2⁩")]


def glue(text):
    for x, y in GLUE:
        text = text.replace(x, y)
    return text


pages = []


def flush(page, sid):
    if page:
        pages.append(dict(scene=sid, startMs=page[0]["startMs"], endMs=page[-1]["endMs"], words=list(page)))
        page.clear()


for sc in TL["scenes"]:
    page = []
    for ph in sc["phrases"]:
        a, b = ph["start"], ph["end"]
        ws = glue(ph["text"]).split(" ")
        wt = [len(re.sub(r"[^\w]", "", w)) + 2.0 for w in ws]
        tot, acc = sum(wt), 0.0
        for w, k in zip(ws, wt):
            s, acc = a + acc / tot * (b - a), acc + k
            e = a + acc / tot * (b - a)
            tw = dict(text=w, startMs=round(s * 1000), endMs=round(e * 1000))
            letters = sum(len(p["text"]) for p in page) + len(w)
            if page and (len(page) >= 4 or letters > 22 or tw["startMs"] - page[-1]["endMs"] > 260):
                flush(page, sc["id"])
            page.append(tw)
            if PUNCT.search(w):
                flush(page, sc["id"])
        flush(page, sc["id"])

out_dir = ROOT / "src/videos" / SLUG
(out_dir / "captions-tiktok.json").write_text(json.dumps(dict(approximate=True, pages=pages), ensure_ascii=False, indent=1), encoding="utf-8")
(out_dir / "timeline-tiktok.json").write_text(json.dumps(TL, ensure_ascii=False, indent=1), encoding="utf-8")


def ts(ms):
    h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


srt = "\n".join(f"{i+1}\n{ts(p['startMs'])} --> {ts(p['endMs'])}\n{' '.join(w['text'] for w in p['words'])}\n" for i, p in enumerate(pages))
(ROOT / f"public/{SLUG}/captions-tiktok.srt").write_text(srt, encoding="utf-8")
print(len(pages), "pages")
for p in pages:
    print(p["scene"], p["startMs"], p["endMs"], " ".join(w["text"] for w in p["words"]))
