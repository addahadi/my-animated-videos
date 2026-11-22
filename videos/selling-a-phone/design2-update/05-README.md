# Why a damaged QR code can still scan

> Reusable Design 2 was updated on 2026-11-01 to the user-approved, caption-free selling-a-phone v4 design. Follow [style-guide.md](style-guide.md), also linked by [style.md](style.md), for new videos. This QR project's captions, hardware illustrations and camera studies below describe its historical implementation; they are not current Design 2 defaults.

Original 79-second Algerian Darija explainer implementing **Design 2: light blue technical explainer**. The user found the first version too different from the supplied video. The current candidate is the revised Remotion version in `exports/v2/`, with larger layered devices, actual camera transforms, geometric Arabic captions, small technical callouts and continuous object framing. New artwork, topic and narration are original.

Current deliverables: `exports/v2/qr-code-explainer-v2.mp4`, `exports/v2/contact-sheet.jpg`, `exports/v2/reference-comparison.jpg`, and the unchanged narration subtitles `captions.srt`. The earlier `exports/qr-code-explainer.mp4` is preserved. The reusable preference is in `style-guide.md` and root `AGENTS.md`. `script.json` contains narration; `prepare_revision.py` adds shorter display phrases in `media/timeline-v2.json`. See `revision-plan.md` and `review-v2.md` for the revision, and `design-plan.md` for factual sources.

## Rebuild the current revision

From the repository root, with the existing voice/QR media available:

```powershell
python projects/qr-code-explainer/fetch_caption_font.py
python projects/qr-code-explainer/prepare_revision.py
python projects/qr-code-explainer/render_v2.py preview
python projects/qr-code-explainer/render_v2.py render
python projects/qr-code-explainer/finish_render.py --revision v2
python projects/qr-code-explainer/make_comparison.py
```

The font fetch downloads Tajawal Bold and its OFL license from Google Fonts. The render helper uses the same installed Remotion CLI and Chrome; it does not install or upgrade tools. It renders four preview stills for critique before full rendering. V2 uses `motion/src/QrReferenceV2.tsx` and `motion/src/qr-v2-entry.tsx`. Phrase-level display timing is manually estimated within the existing narration segments; it is not word-alignment output. The narration track and full duration are unchanged.

## Rebuild the first version

Uses the existing `motion/node_modules` installation (Remotion 4.0.530), Python's existing Pillow, NumPy and imageio-ffmpeg, project-local qrcode 8.2, and the previously installed edge-tts dependencies in `../n8n-reference-animation/.python-deps/`.

From the repository root:

```powershell
python projects/qr-code-explainer/inspect_reference.py
python projects/qr-code-explainer/prepare_media.py
```

Preparation uses the free online speech service with `ar-DZ-IsmaelNeural`, not a cloned voice. It caches per-scene MP3s, builds audio-derived timings, generates a QR encoding the literal text `RUNTIME TECH` at level H, and copies installed Tahoma Bold into ignored render media. The local GPU voice environment was absent; no local GPU or CPU model inference was claimed. Regenerating an edited scene requires clearing only that scene's cached MP3.

From `motion/`:

```powershell
node node_modules/@remotion/cli/remotion-cli.js render src/qr-code-entry.tsx QrCodeExplainer ../projects/qr-code-explainer/exports/qr-code-explainer.mp4 --public-dir=../projects/qr-code-explainer/media --browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe" --codec=h264 --crf=18 --pixel-format=yuv420p --concurrency=2 --log=error
```

Then from the root:

```powershell
python projects/qr-code-explainer/finish_render.py
```

This normalizes the mix to a -16 LUFS target while copying video, fully decodes the result, checks resolution/frame rate/audio, and produces contact-sheet and transition stills. Chrome and online speech require execution outside this client's sandbox. Keep publishing manual.

Graphify's CLI was unavailable. The existing graph did not cover these new source files. Required `graphify update .` and `graphify export wiki` were attempted but could not run; existing graph files were preserved. No dependency upgrades were installed.
