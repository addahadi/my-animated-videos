# How this animated video was made

This document records the work completed for your Arabic/Darija AI, machine learning, and deep learning explainer. It explains how I used the `ai-video-editor` repository, which tools I used, and how to edit or render the video again.

This is the production record for the first video. The folder now serves as a continuing Instagram video workspace; see [README.md](README.md) and [videos/README.md](videos/README.md) for future projects.

## 1. The result

I built a custom, code-based 2D animated explainer around your six recordings. You chose the illustrated explainer approach from the animation ideas, with short Arabic headings and keywords rather than a full transcription on screen.

The final Instagram version has these verified properties:

| Property | Result |
| --- | --- |
| File | [ai-ml-dl-explainer-instagram.mp4](output/ai-ml-dl-explainer-instagram.mp4) |
| Aspect ratio | 9:16, portrait |
| Resolution | 1080 × 1920 pixels |
| Frame rate | 30 frames per second |
| Video frames | 4,646 |
| MP4 duration | Approximately 2 minutes 35 seconds (154.923 seconds) |
| Encoding | H.264 video, AAC audio, MP4 container |
| Narration | Your six recordings, in their original numerical order |

I also kept the original [1920 × 1080 widescreen version](output/ai-ml-dl-explainer.mp4), an [18-second portrait preview](output/preview-instagram.mp4), and a [portrait storyboard contact sheet](output/storyboard-contact-sheet-instagram.jpg).

## 2. How I used the ai-video-editor repository

The original repository is located at:

```text
C:\Users\hecin\ai-video-editor
```

Your independent video project is located at:

```text
C:\Users\hecin\Videos\my-animated-video
```

I used the original repository as a reference for its Remotion animation approach. I inspected its project instructions, `motion/package.json`, and examples including `motion/src/MotionProofReel.tsx` and `motion/src/FloorplanReel.tsx`.

Those examples informed the use of React components for scenes, frame-based animation timing, easing, vector artwork, and local media assets. I used the same Remotion version family and created a separate project with its own dependencies, source files, audio, fonts, scripts, and outputs.

The actual explainer scenes and illustrations were written specifically for your recordings. Rendering runs from this new folder; the new project does not need to import or execute the original repository's source files.

The original repository was left unchanged. Its Concat/Rust editing pipeline and `concat-mcp` were not used to produce this video. This was a custom Remotion implementation, not a run of every tool or skill in that repository.

## 3. How I understood and prepared your audio

### Transcription for planning

I used **faster-whisper** with the locally cached Whisper **small** model, running on the CPU with `int8` computation. It generated timestamped draft transcripts from the OGG recordings.

The transcription script is [transcribe_audio.py](transcribe_audio.py), and the results are in `analysis/transcripts/`. The drafts helped identify the subjects, examples, and approximate moments when the visuals should change. A targeted translation pass also helped clarify technical terms in the deep learning recording.

Automatic transcription contains recognition errors, especially with mixed Arabic/Darija and English technical terms. These drafts were planning material; they were not displayed as subtitles.

### Preparing the narration track

I wrote [scripts/prepare.py](scripts/prepare.py) to:

1. Decode the six OGG files in an explicitly defined numerical order.
2. Convert their audio to 48 kHz mono samples.
3. Concatenate those samples into `public/audio/narration.wav`, saved as 16-bit PCM.
4. Calculate each section's start and duration from the decoded sample counts.
5. Write those timings into [src/timing.json](src/timing.json).

The source recordings remain in the project root. I did not intentionally trim the narration, replace your voice, add background music, or apply loudness normalization. The combined narration lasts approximately 154.091 seconds, followed by a 0.75-second picture hold; frame rounding and AAC/container padding account for the final export duration.

## 4. How I turned the narration into animation

I divided the video into six sections matching the six recordings:

| Recording | Topic | Main animation |
| --- | --- | --- |
| `audio1ogg.ogg` | Introducing AI, ML, and DL | Illustrated examples and the three concept labels |
| `audio2.ogg` | Artificial intelligence | Capability cards, a chessboard and minimax decision tree, then symbolic rules |
| `audio3.ogg` | Machine learning | Data flowing into a model, labeled email examples, training, and inference on a new email |
| `audio4.ogg` | Deep learning | Neural layers, a cat-to-features illustration, backpropagation, a loss curve, data/GPU requirements, and applications |
| `audio5.ogg` | How the fields relate | Nested diagrams showing DL inside ML inside AI |
| `audio6.ogg` | Closing question | More data versus accuracy, followed by a short comment prompt |

I built the visuals from **SVG shapes and React components**: cards, arrows, chess pieces, emails, a cat illustration, a brain icon, neural network nodes, and charts. These are custom vector illustrations, not AI-generated video clips or stock footage.

The shared artwork, palette, and animation helpers live in [src/design.tsx](src/design.tsx). The original scene implementations live in [src/scenes.tsx](src/scenes.tsx).

Animation is calculated from the current frame and section time. That controls when elements appear, move, fade, highlight, or send animated dots along connections. This makes repeated renders consistent and allows the scenes to follow your narration.

Examples of the visual logic include:

- A chess decision tree whose branch values produce a coherent minimax choice.
- Model parameters changing during email training and staying fixed during inference.
- A cat illustration progressing through edges, shapes, and a prediction.
- Forward and backward signals moving through a schematic neural network.
- A point moving along a falling loss curve.

These diagrams explain concepts. They do not show measurements or internal activations from an actual trained model.

### Text and fonts

I used short Arabic phrases for emphasis and English names where useful for technical concepts. I used **Noto Sans Arabic** for Arabic and **Manrope** for Latin text, with right-to-left handling for Arabic.

The font files are stored locally in `public/fonts/`, together with their SIL Open Font License files. The video renderer can therefore load the fonts without requesting them from a font CDN.

## 5. What changed for Instagram

The first completed export was 1920 × 1080. After your request, I created a separate **1080 × 1920 portrait composition**.

I rearranged the scenes for the taller frame: cards stack vertically, the chessboard sits above its decision tree, email examples and model steps use a vertical layout, and the cat-feature sequence becomes stacked cards. I also adapted the nested relationship diagram and closing question.

The portrait layout leaves extra room around the top, bottom, and right edge for viewing with Instagram controls. This is a layout choice, not a guarantee that every Instagram interface will cover the same areas.

The portrait implementation is in:

- [src/PortraitExplainer.tsx](src/PortraitExplainer.tsx): overall vertical layout, titles, narration, and chapter display.
- [src/PortraitScenes.tsx](src/PortraitScenes.tsx): vertical arrangements of the illustrated scenes.
- [src/index.tsx](src/index.tsx): registration of both portrait and landscape compositions.

This version uses the same narration and chapter timings. It is a re-layout of the animation, rather than a stretch or crop of the widescreen MP4.

## 6. Tools I used

| Tool | What it did in this project |
| --- | --- |
| Codex | Inspected the reference repository, planned the storyboard, wrote the animation and scripts, and coordinated rendering and checks |
| PowerShell | Ran local commands, inspected files, and generated the contact sheet through Windows System.Drawing |
| Node.js and npm | Installed and ran the JavaScript animation project |
| React and TypeScript | Defined the scenes, reusable illustrations, layouts, and animation logic |
| SVG | Drew the vector artwork and diagrams |
| Remotion `4.0.530` | Turned frame-based React scenes and narration into a rendered video |
| `@remotion/bundler` | Bundled the standalone project for rendering |
| `@remotion/renderer` | Rendered sample images, previews, and final H.264/AAC exports |
| `@remotion/fonts` | Loaded the local Arabic and Latin fonts before rendering |
| Headless Chrome | Rendered the browser-based scenes without opening an interactive browser window |
| Python | Ran transcription, audio preparation, timing generation, and output verification |
| faster-whisper `1.2.1` | Produced local draft transcripts using Whisper small and provided audio decoding helpers |
| PyAV `16.1.0` | Read audio/video streams and inspected the rendered media through FFmpeg libraries |
| NumPy | Combined audio samples and compared reference audio with the rendered soundtrack |
| Google Fonts files | Supplied Noto Sans Arabic and Manrope, bundled locally with their licenses |
| Image inspection | Let me review rendered sample frames, Arabic text placement, and diagram layouts |

The encoding was handled through Remotion's rendering pipeline. I did not use a separate manually operated FFmpeg command-line editing workflow. I also did not use an image-generation or text-to-video service for the artwork.

Dependency declarations are in [package.json](package.json) and [requirements-audio.txt](requirements-audio.txt). PyAV was pinned to version 16.1.0 because a newer version removed an argument expected by the installed faster-whisper release.

## 7. How I rendered and checked the video

I wrote [scripts/render.mjs](scripts/render.mjs) to bundle the project, select the composition, open a headless browser, and render either representative frames, a short preview, or the full video.

The full export uses H.264, AAC, `yuv420p`, and CRF 18. The preview uses half resolution and a lighter quality setting for quick review. The default render now selects the Instagram composition.

For visual review, I rendered 18 representative frames across the timeline and inspected scene layouts and text. I also created a contact sheet with [scripts/contact-sheet.ps1](scripts/contact-sheet.ps1). During portrait review, I corrected stray diagram fragments by adding explicit clipping to the reusable SVG panels, then refreshed the samples before the final render.

I ran the TypeScript check and used [scripts/verify.py](scripts/verify.py) to inspect the final export. The saved [Instagram validation report](output/validation-instagram.json) records passing checks for:

- Expected resolution and frame rate.
- Expected frame count and duration.
- A visible final frame, using a simple pixel-statistics check.
- Narration samples from all six sections at their expected positions.

For the audio check, the script compares an excerpt from each section of the prepared narration against the rendered soundtrack, allowing a small timing offset for encoding. Correlations ranged from **0.9873 to 0.99739**, above the script's 0.85 threshold. This supports that all six sections are present in order; it is an excerpt-based check, not a comparison of every audio sample or a complete perceptual review of the finished video.

## 8. How to work on it again

Run commands from this folder:

```powershell
Set-Location C:\Users\hecin\Videos\my-animated-video
```

| Task | Command |
| --- | --- |
| Install JavaScript dependencies if needed | `npm.cmd install` |
| Open the interactive editing preview | `npm.cmd run studio` |
| Check TypeScript | `npm.cmd run check` |
| Render the first 18 seconds in portrait | `npm.cmd run preview` |
| Refresh portrait sample frames | `npm.cmd run stills` |
| Render the full Instagram video | `npm.cmd run render` |
| Render the full widescreen video | `npm.cmd run render -- --landscape` |
| Verify the Instagram export | `& .\.venv\Scripts\python.exe scripts/verify.py` |
| Verify the widescreen export | `& .\.venv\Scripts\python.exe scripts/verify.py --landscape` |
| Rebuild narration and section timings | `& .\.venv\Scripts\python.exe scripts/prepare.py` |
| Rebuild the portrait contact sheet | `powershell -ExecutionPolicy Bypass -File scripts/contact-sheet.ps1` |

If you replace recordings, rebuilding the narration updates the section boundaries, but internal visual cues and labels may also need editing to match the new speech. Rendering a different script requires adapting the storyboard and scenes as well as preparing the audio.

All future edits and exports can stay in this independent project folder. See [README.md](README.md) for the shorter operating guide and [animation-ideas.md](animation-ideas.md) for the original creative options.
