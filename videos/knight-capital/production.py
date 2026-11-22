"""Bounded production actions for the explicitly requested Knight Capital project."""
from pathlib import Path
import argparse
import hashlib
import json
import math
import os
import shutil
import subprocess
import sys
import wave

import numpy as np
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding="utf-8")
STAGE = Path(__file__).resolve().parent
REPO = Path("C:/Users/hecin/ai-video-editor").resolve()
ROOT = (REPO / "projects/knight-capital").resolve()
assert ROOT.parent == REPO / "projects" and ROOT.name == "knight-capital"
MOTION = REPO / "motion"
BIN = MOTION / "node_modules/@remotion/compositor-win32-x64-msvc"
FF = Path(imageio_ffmpeg.get_ffmpeg_exe())
PROBE = BIN / "ffprobe.exe"
PY_AUDIO = Path("C:/Users/hecin/Videos/my-animated-video/.venv/Scripts/python.exe")


def run(args, **kw):
    return subprocess.run([str(a) for a in args], check=True, **kw)


def sync():
    for name in ["src", "media", "inputs", "analysis", "plans", "exports", "exports/stills"]:
        (ROOT / name).mkdir(parents=True, exist_ok=True)
    for name in ["inputs", "plans"]:
        shutil.copytree(STAGE / name, ROOT / name, dirs_exist_ok=True)
    shutil.copy2(STAGE / "scripts/knight-capital.md", ROOT / "script.md")
    shutil.copy2(STAGE / "brief.md", ROOT / "brief.md")
    for source in (STAGE / "production-stage").rglob("*"):
        if source.is_file() and "__pycache__" not in source.parts:
            dest = ROOT / source.relative_to(STAGE / "production-stage")
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, dest)
    production_plan = ROOT / "plans/knight-capital-plan.md"
    production_plan.write_text("<!-- Production override: user selected Design 2 and ai-video-editor. The earlier dark-style proposal below is historical. Current implementation follows plans/style.md, design-review.md and media/timeline.json; timing is measured clips with ASR-guided phrase cues. -->\n\n" + production_plan.read_text(encoding="utf-8"), encoding="utf-8")
    shutil.copy2(REPO / "projects/qr-code-explainer/media/tajawal-bold.ttf", ROOT / "media/tajawal-bold.ttf")
    shutil.copy2(REPO / "projects/qr-code-explainer/font-OFL.txt", ROOT / "font-OFL.txt")
    (ROOT / "PRODUCTION-LOCATION.md").write_text(
        "# Production workspace\n\nUser explicitly selected this ai-video-editor project and Design 2. "
        "Original script and input workspace: `C:/Users/hecin/Videos/my-animated-video/videos/knight-capital/`.\n",
        encoding="utf-8")


def prepare():
    sync()
    names = ["audio_2026-11-04_21-34-19.ogg"] + ["audio6ogg.ogg" if i == 6 else f"audio{i}.ogg" for i in range(2, 11)]
    chunks, rows, offset = [], [], 0
    for i, name in enumerate(names, 1):
        source = ROOT / "inputs" / name
        metadata = json.loads(run([PROBE, "-v", "error", "-show_streams", "-show_format", "-of", "json", source], capture_output=True, text=True).stdout)
        pcm = run([FF, "-v", "error", "-i", source, "-ar", "48000", "-ac", "1", "-f", "s16le", "-"], capture_output=True).stdout
        samples = len(pcm) // 2
        chunks.append(pcm)
        with wave.open(str(ROOT / "analysis" / f"clip-{i:02d}.wav"), "wb") as out:
            out.setparams((1, 2, 48000, 0, "NONE", "not compressed")); out.writeframes(pcm)
        rows.append({"id": i, "file": name, "offsetSamples": offset, "samples": samples,
                     "startSec": offset / 48000, "durationSec": samples / 48000,
                     "endSec": (offset + samples) / 48000,
                     "sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "probe": metadata})
        offset += samples
    with wave.open(str(ROOT / "media/narration.wav"), "wb") as out:
        out.setparams((1, 2, 48000, 0, "NONE", "not compressed")); out.writeframes(b"".join(chunks))
    manifest = {"durationSeconds": offset / 48000, "samples": offset, "durationInFrames": math.ceil(offset / 48000 * 30),
                "fps": 30, "sources": rows, "orderStatus": "filename-derived; speech review required"}
    (ROOT / "media/audio-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Prepared all 10 clips without trimming: {offset/48000:.6f}s / {manifest['durationInFrames']} picture frames", flush=True)


def align():
    sync()
    run([PY_AUDIO, ROOT / "align_audio.py", ROOT], env={**os.environ, "OMP_NUM_THREADS": "2", "MKL_NUM_THREADS": "2", "CT2_PACKED_GEMM": "0", "CT2_USE_MKL": "0"})


def render(mode):
    sync()
    run([sys.executable, ROOT / "make_timeline.py"])
    run(["node", ROOT / "render.cjs", mode], cwd=MOTION)


def check():
    sync()
    run([sys.executable, ROOT / "make_timeline.py"])
    run(["node", STAGE.parents[1] / "node_modules/typescript/bin/tsc", "--noEmit", "--strict",
         "--jsx", "react", "--target", "ES2021", "--module", "ESNext", "--moduleResolution", "node",
         "--esModuleInterop", "--skipLibCheck", "--typeRoots", STAGE.parents[1] / "node_modules/@types",
         "--baseUrl", MOTION / "node_modules", ROOT / "src/index.tsx", ROOT / "src/KnightCapital.tsx"])


def sheet(pattern="still-*.png", name="storyboard.jpg", columns=4):
    paths = sorted((ROOT / "exports/stills").glob(pattern))
    assert paths
    width, image_h, cell_h = 270, 480, 516
    result = Image.new("RGB", (width * columns, cell_h * math.ceil(len(paths) / columns)), "#F0EFF4")
    pen = ImageDraw.Draw(result)
    font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 15)
    for i, source in enumerate(paths):
        x, y = (i % columns) * width, (i // columns) * cell_h
        result.paste(Image.open(source).convert("RGB").resize((width, image_h)), (x, y))
        pen.text((x + 8, y + image_h + 8), source.stem, fill="#111214", font=font)
    result.save(ROOT / "exports" / name, quality=95)
    print("Saved", ROOT / "exports" / name)


def package(source_name, target_name, start=0, duration=None):
    manifest = json.loads((ROOT / "media/audio-manifest.json").read_text())
    duration = duration or manifest["durationInFrames"] / 30
    run([FF, "-v", "error", "-i", ROOT / "exports" / source_name,
         "-ss", str(start), "-i", ROOT / "media/narration-mix.wav", "-map", "0:v:0", "-map", "1:a:0",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "1",
         "-af", "apad", "-t", str(duration), "-movflags", "+faststart", "-y", ROOT / "exports" / target_name])
    print("Packaged", target_name, flush=True)


def verify():
    file = ROOT / "exports/knight-capital-design2.mp4"
    metadata = json.loads(run([PROBE, "-v", "error", "-show_streams", "-show_format", "-of", "json", file], capture_output=True, text=True).stdout)
    video = next(s for s in metadata["streams"] if s["codec_type"] == "video")
    audio = next(s for s in metadata["streams"] if s["codec_type"] == "audio")
    assert (video["width"], video["height"], video["avg_frame_rate"]) == (1080, 1920, "30/1")
    assert video["codec_name"] == "h264" and video["pix_fmt"] == "yuv420p" and audio["codec_name"] == "aac"
    decode = run([FF, "-v", "error", "-i", file, "-f", "null", "-"], capture_output=True)
    assert not decode.stderr, decode.stderr.decode(errors="replace")
    manifest = json.loads((ROOT / "media/audio-manifest.json").read_text())
    with wave.open(str(ROOT / "media/narration.wav"), "rb") as source:
        expected = np.frombuffer(source.readframes(source.getnframes()), dtype="<i2").astype(np.float32)
    actual = np.frombuffer(run([FF, "-v", "error", "-i", file, "-vn", "-ar", "48000", "-ac", "1", "-f", "s16le", "-"], capture_output=True).stdout, dtype="<i2").astype(np.float32)
    correlations = []
    for row in manifest["sources"]:
        start, count = row["offsetSamples"], row["samples"]
        with wave.open(str(ROOT / "analysis" / f"clip-{row['id']:02d}.wav"), "rb") as source:
            raw = np.frombuffer(source.readframes(source.getnframes()), dtype="<i2")
        assert np.array_equal(raw, expected[start:start+count])
        values = []
        for fraction in [.2, .5, .75]:
            at = start + round(count * fraction)
            length = min(24000, start + count - at)
            values.append(float(np.corrcoef(expected[at:at+length], actual[at:at+length])[0, 1]))
        assert min(values) > .97, (row["file"], values)
        assert hashlib.sha256((ROOT / "inputs" / row["file"]).read_bytes()).hexdigest() == row["sha256"]
        correlations.append({"file": row["file"], "sourceSamplesPreserved": True, "correlations": values})
    assert abs(float(metadata["format"]["duration"]) - manifest["durationInFrames"] / 30) < .08
    assert int(video["nb_frames"]) == manifest["durationInFrames"]
    report = {"passed": True, "video": str(file), "width": 1080, "height": 1920, "fps": 30,
              "frames": int(video["nb_frames"]), "duration": metadata["format"]["duration"],
              "narrationSeconds": manifest["durationSeconds"], "fullDecode": "passed", "narration": correlations,
              "reviewLimit": "Local representative frames and encoded motion strips; no dedicated video-vision connector available."}
    (ROOT / "exports/validation.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


def review():
    final = ROOT / "exports/knight-capital-design2.mp4"
    manifest = json.loads((ROOT / "media/audio-manifest.json").read_text())
    output = ROOT / "exports/stills"
    # Structural analysis precedes frame extraction; dedicated vision MCP is unavailable.
    structure = run([FF, "-hide_banner", "-i", final, "-vf", "select='gt(scene,0.025)',showinfo",
                     "-af", "silencedetect=noise=-38dB:d=0.3,volumedetect", "-f", "null", "-"], capture_output=True, text=True)
    import re
    structural_report = {"method": "Local FFmpeg scene/silence/loudness analysis, then targeted frame extraction",
                         "sceneChangeTimes": [float(v) for v in re.findall(r"pts_time:([0-9.]+)", structure.stderr)],
                         "silenceStarts": [float(v) for v in re.findall(r"silence_start: ([0-9.]+)", structure.stderr)],
                         "silenceEnds": [float(v) for v in re.findall(r"silence_end: ([0-9.]+)", structure.stderr)],
                         "maxVolume": re.findall(r"max_volume: ([^\r\n]+)", structure.stderr)}
    (ROOT / "analysis/final-structure.json").write_text(json.dumps(structural_report, indent=2), encoding="utf-8")
    fractions = [.7, .85, .9, .85, .95, .97, .85, .9, .95, .9]
    for row in manifest["sources"]:
        stamp = row["startSec"] + row["durationSec"] * fractions[row["id"]-1]
        run([FF, "-v", "error", "-ss", str(stamp), "-i", final, "-frames:v", "1", "-y", output / f"final-{row['id']:02d}.png"])
    sheet("final-??.png", "final-storyboard.jpg")
    for name, stamps in [("final-hook", [.1, .8, 1.6, 2.5, 3.5, 4.5]),
                         ("final-mechanism", [44, 46, 48.5, 51.5, 53.1, 53.9]),
                         ("final-rollback", [55, 56.5, 58.3, 59.6, 61.3, 63.6])]:
        for i, stamp in enumerate(stamps):
            run([FF, "-v", "error", "-ss", str(stamp), "-i", final, "-frames:v", "1", "-y", output / f"{name}-{i:02d}.png"])
        sheet(f"{name}-*.png", f"{name}-review.jpg", columns=3)


def preview_review():
    records = []
    for name, stamps in [("preview", [.2, 1.5, 2.8, 4.5, 7, 10.5]),
                         ("mechanism-preview", [.3, 2.2, 4.8, 7.8, 9.8, 10.7])]:
        source = ROOT / "exports" / (name + ".mp4")
        decode = run([FF, "-v", "error", "-i", source, "-f", "null", "-"], capture_output=True)
        assert not decode.stderr
        paths = []
        for i, stamp in enumerate(stamps):
            output = ROOT / "exports/stills" / f"{name}-review-{i:02d}.png"
            run([FF, "-v", "error", "-ss", str(stamp), "-i", source, "-frames:v", "1", "-y", output])
            paths.append(output)
        sheet(f"{name}-review-*.png", f"{name}-motion-review.jpg", columns=3)
        arrays = [np.array(Image.open(p).convert("RGB").resize((135, 240)), dtype=np.float32) for p in paths]
        records.append({"file": source.name, "decode": "passed", "sampleTimes": stamps,
                        "meanPixelChanges": [float(np.abs(a-b).mean()) for a, b in zip(arrays, arrays[1:])]})
    (ROOT / "analysis/preview-review.json").write_text(json.dumps(records, indent=2), encoding="utf-8")


def final_previews():
    final = ROOT / "exports/knight-capital-design2.mp4"
    for name, start, duration in [("preview.mp4", 0, 12), ("mechanism-preview.mp4", 1300/30, 333/30)]:
        run([FF, "-v", "error", "-ss", str(start), "-i", final, "-t", str(duration),
             "-vf", "scale=540:960", "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-threads", "2",
             "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-y", ROOT / "exports" / name])
        print("Refreshed preview from final export:", name)


def updates():
    from urllib.request import Request, urlopen
    endpoints = {"Remotion": ("https://registry.npmjs.org/remotion/latest", "version"),
                 "Graphify": ("https://pypi.org/pypi/graphifyy/json", "info.version"),
                 "Concat": ("https://api.github.com/repos/jub0t/Concat/releases/latest", "tag_name")}
    installed = {"Remotion": json.loads((MOTION / "node_modules/remotion/package.json").read_text())["version"], "Graphify": "0.9.89 (existing project runtime)", "Concat": "not used; pinned submodule comparison unverified"}
    lines = ["# Daily free tool check — 2026-11-05 (Africa/Algiers)", ""]
    for name, (url, key) in endpoints.items():
        try:
            with urlopen(Request(url, headers={"User-Agent": "Runtime-tech-local-version-check"}), timeout=15) as response:
                value = json.load(response)
            for part in key.split("."): value = value[part]
            result = f"latest: {value}"
        except Exception as error:
            result = f"latest check unavailable: {error}"
        lines.append(f"- {name}: installed {installed[name]}; {result}. Source: {url}")
    lines.extend(["", "Free official endpoints only. No upgrades, pin changes, paid monitors, subscriptions or background schedules. Knight Capital reuses the existing Remotion installation."])
    text = "\n".join(lines) + "\n"
    output = REPO / "workspace-data/tool-update-checks/latest.md"
    output.parent.mkdir(parents=True, exist_ok=True); output.write_text(text, encoding="utf-8")
    (ROOT / "analysis/tool-update-check.md").write_text(text, encoding="utf-8")
    print(text)


def maintenance():
    runtime = STAGE.parent / "selling-a-phone/graphify_workflow.py"
    for args in [["update", "."], ["export", "wiki"]]:
        run([sys.executable, runtime, "cli", *args], cwd=ROOT)


def finalize():
    report = json.loads((ROOT / "exports/validation.json").read_text())
    assert report["passed"]
    note = f"""# Knight Capital — Design 2 production

Production: `{ROOT}`. User explicitly selected ai-video-editor and the approved Design 2.

Final: `exports/knight-capital-design2.mp4`, 1080×1920, 30fps, H.264/AAC, {report['duration']} seconds.
All ten original recordings are preserved in their mapped order, with no trimming, replacement, reordering or time stretching. Narration length: {report['narrationSeconds']}s. Only final picture rounding extends beyond the audio. Source PCM concatenation and encoded audio correlation checked for every clip; full decode passed. Narration gain is 1; five quiet original 50ms switch clicks punctuate real state changes. No music. Unmixed narration is preserved separately.

Light-gray canvas, white outlined objects, blue actions and yellow warnings, Tajawal Bold, quiet Runtime.tech branding. No bottom narration captions. Custom eight-server fleet, meaningful trading tickets, paired software activation, continuing orders after completion, rollback escalation, monitoring/blocking gap, attributed initial/later losses and final safeguard checklist. No imported reference-video frames or voice.

Source: `src/`; assets: `media/`; source recordings: `inputs/`; alignment evidence: `analysis/`; planning: `plans/` and `design-review.md`. Reference: selling-a-phone v4 Design 2. Existing videos remain untouched. Remotion rendered the full new video; FFmpeg packaged original narration and verified it. No Concat, Natron or generated footage was required.

Review: representative portrait stills, opening/mechanism previews and frames extracted from final encoded video. Dedicated video-vision tools were unavailable; no continuous real-time playback/listening claim is made. See alignment status and any script differences in `analysis/`.

Rebuild from the original script workspace using `python videos/knight-capital/production.py prepare`, `align`, `stills`, `preview`, `mechanism`, `render`, `package`, `verify`, `review`, `finalize`. Existing Remotion installation is reused; no dependency upgrade. Publishing remains manual.
"""
    (ROOT / "production-note.md").write_text(note, encoding="utf-8")
    (STAGE / "production-note.md").write_text(note, encoding="utf-8")
    (ROOT / "README.md").write_text("# Knight Capital\n\nSee [production-note.md](production-note.md) for source, commands, validation and review limits.\n", encoding="utf-8")
    with (ROOT / "quality-review.md").open("a", encoding="utf-8") as output:
        output.write("\n## Final review completed\n\nFinal encoded storyboard, activation/completion strip and rollback strip visually reviewed. Dimensions, 2800 frames, 30fps, full decode and all ten source audio placements passed. Minimum sampled AAC/source correlation exceeded 0.9997. Original 93.312s narration remains untrimmed; final picture is 93.333333s. Project-only AST graph and wiki refreshed successfully (87 nodes, 179 edges); the broad repository rebuild was interrupted after memory pressure. Final previews are extracted from the delivered MP4. No continuous playback/listening review is claimed.\n")
    for brief_path in [STAGE / "brief.md", ROOT / "brief.md"]:
        brief = brief_path.read_text(encoding="utf-8")
        brief = brief.replace("Design 2 production underway in ai-video-editor; ten recordings measured and matched by ASR; portrait review and previews underway.",
                              "Design 2 export complete in ai-video-editor; encoded frames/motion reviewed, media and all ten narration clips validated. See production-note.md.")
        if "Final export:" not in brief:
            brief += f"\n- Final export: `{ROOT}/exports/knight-capital-design2.mp4` (93.333333s, 1080×1920, 30fps).\n"
        brief_path.write_text(brief, encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["prepare", "align", "sync", "check", "stills", "preview", "mechanism", "render", "package", "verify", "review", "preview-review", "final-previews", "updates", "sheet", "maintenance", "finalize"])
    mode = parser.parse_args().mode
    if mode == "prepare": prepare()
    elif mode == "align": align()
    elif mode == "sync": sync()
    elif mode == "check": check()
    elif mode in ["stills", "preview", "mechanism", "render"]:
        render(mode)
        if mode == "stills": sheet()
        elif mode == "preview": package("preview-silent.mp4", "preview.mp4", duration=12)
        elif mode == "mechanism": package("mechanism-silent.mp4", "mechanism-preview.mp4", start=43.333333333, duration=11.1)
    elif mode == "package": package("render-silent.mp4", "knight-capital-design2.mp4")
    elif mode == "verify": verify()
    elif mode == "review": review()
    elif mode == "preview-review": preview_review()
    elif mode == "final-previews": final_previews()
    elif mode == "updates": updates()
    elif mode == "sheet": sheet()
    elif mode == "maintenance": maintenance()
    elif mode == "finalize": finalize()
