# Instagram animation workspace

This folder is the ongoing workspace for your Instagram videos. Keep using
`C:/Users/hecin/Videos/my-animated-video` as the environment when talking to Codex.
For each new video, provide its topic and script or recordings; its project will
go under `videos/<descriptive-slug>/`.

Your saved defaults are vertical **9:16, 1080 × 1920, 30 fps**, with animation
following your narration and short Arabic headings or keywords. The illustrated
2D approach from the first video is a starting point; future topics can use
different creative directions.

Workspace references:

- [AGENTS.md](AGENTS.md): persistent context and instructions for future Codex sessions.
- [videos/README.md](videos/README.md): organization of future video projects.
- [templates/video-brief.md](templates/video-brief.md): reusable project brief.
- [VIDEO-MAKING-PROCESS.md](VIDEO-MAKING-PROCESS.md): detailed production record of the first video.

The first completed video remains at its current paths below. Root-level render
commands still operate on that video. New videos get their own scenes, timing,
and output destinations; they do not replace the first project.

## First completed video: AI / ML / DL explainer

A standalone 1080 x 1920 (9:16), 30 fps Remotion video for Instagram Reels, using the six supplied recordings
in numerical order. The narration lasts approximately 2:34; the last picture
holds for an extra 0.75 seconds. Arabic appears as short headings and keywords,
not a transcript. English labels identify the technical concepts.

All project files and outputs stay in this directory. The original
`C:/Users/hecin/ai-video-editor` repository is unchanged. Its Remotion examples
informed the frame-based scene timing, easing, vector graphics, and static-media
approach; the explainer artwork and scenes here are custom.

## Outputs

- `output/ai-ml-dl-explainer-instagram.mp4`: complete vertical 1080 x 1920 H.264/AAC video.
- `output/preview-instagram.mp4`: first 18 seconds at 540 x 960 for quick review.
- `output/storyboard-contact-sheet-instagram.jpg`: vertical scene overview.
- `output/stills-instagram/`: representative vertical frames throughout the video.
- `output/ai-ml-dl-explainer.mp4`: retained original 1920 x 1080 widescreen version.

The portrait version rearranges diagrams into stacked mobile layouts; it does not
crop or stretch the widescreen export. Important text stays within the central
part of the frame, with extra room around the top, bottom, and right edge.

## Work on the video

Run these commands from this folder:

```powershell
npm.cmd install
npm.cmd run studio
npm.cmd run check
npm.cmd run preview
npm.cmd run render
```

`npm.cmd run stills` refreshes the sample frames. Then run
`powershell -ExecutionPolicy Bypass -File scripts/contact-sheet.ps1` to rebuild
the contact sheet.

The default composition and render commands now use the Instagram version.
Add `-- --landscape` to an npm render command to render the widescreen version;
for example, `npm.cmd run render -- --landscape`. Pass `-Landscape` to the contact
sheet script to rebuild the original widescreen overview.

The renderer finds Chrome or Edge on Windows. To use another compatible browser,
set `REMOTION_BROWSER` to its executable path. A browser opened for rendering is
headless. Font files are bundled locally, so rendering does not depend on a font CDN.

## Editing map

- `src/Explainer.tsx`: master layout, headings, narration, and chapter navigation.
- `src/PortraitExplainer.tsx`: vertical layout and mobile text placement.
- `src/PortraitScenes.tsx`: stacked diagrams using the same illustrations and timings.
- `src/scenes.tsx`: introductory concepts, chess, email sorting, neural layers,
  backpropagation, applications, nested sets, and closing question.
- `src/design.tsx`: colors, easing, vector illustrations, and reusable elements.
- `src/timing.json`: exact section boundaries derived from decoded audio samples.
- `scripts/render.mjs`: render settings and representative frame locations.
- `scripts/prepare.py`: rebuild narration WAV and timings; fetch local fonts if missing.

The six original OGG recordings are preserved. `public/audio/narration.wav` is a
48 kHz mono PCM concatenation, with no intentional trimming or added music.
Draft automatic transcripts are under `analysis/transcripts/`; these contain
recognition errors and are not used as subtitles.

## Rebuild narration

The existing project Python environment contains faster-whisper and PyAV. Use:

```powershell
& .\.venv\Scripts\python.exe scripts/prepare.py
```

To recreate that environment, run `python -m venv .venv`, followed by
`& .\.venv\Scripts\python.exe -m pip install -r requirements-audio.txt`.
After rendering, `& .\.venv\Scripts\python.exe scripts/verify.py` checks the
Instagram export's format and confirms that narration from all six recordings is present
in order. It writes `output/validation-instagram.json`. Pass `--landscape` to
verify the original widescreen export instead.

The illustrations are explanatory schematics. Cat-feature layers illustrate
the principle of hierarchical features, not a specific trained model's internals.
The chess-tree leaf values intentionally produce a minimax choice
of the middle branch: minima 3, 8, 2 followed by maximum 8.

Fonts: Manrope and Noto Sans Arabic from the Google Fonts repository, licensed
under the SIL Open Font License; see `public/fonts/OFL-*.txt`.
