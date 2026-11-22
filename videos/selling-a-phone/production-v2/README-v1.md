# Selling a phone — Design 2

RunTime tech explainer in Algerian Darija. Source recordings and script came from `C:/Users/hecin/Videos/my-animated-video/videos/selling-a-phone/`. Production lives in this isolated project in the requested `ai-video-editor` workspace.

## Deliverables

- `exports/selling-a-phone-design2.mp4`: final 1080×1920, 30 fps H.264/AAC video.
- `exports/preview.mp4`: 15-second, 540×960 review preview.
- `exports/contact-sheet.jpg`: 12 representative frames from the final MP4.
- `exports/motion-review.jpg`: five samples of the same-object camera transition.
- `exports/validation.json`: full decode, stream metadata and narration correlation checks.

## Rebuild

From `C:/Users/hecin/ai-video-editor`:

```powershell
python projects/selling-a-phone/make_timeline.py
node projects/selling-a-phone/production.cjs stills
node projects/selling-a-phone/production.cjs preview
node projects/selling-a-phone/production.cjs motion
node projects/selling-a-phone/production.cjs render
node projects/selling-a-phone/production.cjs review
```

The renderer uses the existing `motion/node_modules`, its installed Remotion APIs and headless Chrome. The bundle resolves those dependencies explicitly; shared motion sources/configuration and other projects are preserved. No root build/test command applies.

`review` uses the existing Instagram workspace's Python environment for PyAV/NumPy and system Python for Pillow. It decodes the complete final video, checks nine narration positions against the original concatenation, and makes review images. `inputs/` retains the supplied recordings; `analysis/` contains decoded sample timings and draft local recognition. Recognition has Darija errors and is used only to locate semantic cues. The supplied script controls displayed wording.

Final packaging uses system Python's existing imageio-ffmpeg binary. The initial Remotion export had a 2,048-sample AAC delay and full-range video; `finish_encode.py` takes its picture, converts the range to limited yuv420p, and encodes the original PCM narration directly with correct AAC timestamps. `exports/render-source.mp4` retains that initial render. Delivery uses `selling-a-phone-design2.mp4` after this packaging and full verification.

## Narration and timing

All nine OGG files are decoded in numerical order into one 48 kHz mono PCM track, with no speech cuts, time stretching, replacement voice, reordering or inserted pauses. The exact narration length is 112.1706667 seconds. The composition is 3,390 frames / 113 seconds, leaving about 0.829 seconds of picture after the recording. A constant 0.9 playback gain provides encoding headroom. No music or added effects cover the voice.

The actual recordings are shorter than the written script in places. The export follows the supplied voice: notably the account-removal section is not extended with newly generated FRP/Activation Lock narration, and the outro uses the recorded handover/save request. The script's longer share/follow outro is not synthesized.

## Design and review

Follows `projects/qr-code-explainer/style-guide.md` and the Design 2 v2 structural reference: cool light-gray canvas, electric blue, black device bezels, schematic gray internals, short right-anchored Arabic phrases and camera moves into the same physical phone. Uses original RunTime.tech branding. The reference creator's mark, footage and voice are not reused. Tajawal Bold is bundled with its OFL license.

Seven steps are represented in the actual sequence: backup and recovery check; 2FA migration; watch/Bluetooth unlinking; Google/Apple account removal and Find My; sensitive-app sessions and WhatsApp migration; reset; welcome-screen AND old-account checks.

The OS screens, device internals and authentication numbers are explanatory artwork, not actual UI captures or valid codes. The menu path can differ by device; the reset close-up states that limitation.

Before the full render, reviewed a 12-frame contact sheet, a 15-second preview sample and a five-frame camera sequence. Corrected camera restarts across adjacent captions, suppressing background text, component alignment, and backdrop fading before expansion. The final review images are extracted again from the encoded final MP4.

The optional `claude-video-vision` MCP tools are unavailable, so no review through that service or continuous listening/playback is claimed. Verification uses local sampled visual review and decoded audio correlation. The Graphify CLI is unavailable; no graph update/wiki export could be run. Today's free tool check was already recorded; dependencies were not upgraded. No AI footage generation, paid generation or publishing was used.

## Type check

The source was checked with the installed TypeScript compiler in the Instagram workspace:

```powershell
node node_modules/typescript/bin/tsc --noEmit --jsx react-jsx --esModuleInterop --skipLibCheck --strict --target ES2022 --moduleResolution node --module ESNext videos/selling-a-phone/production/src/index.tsx
```

The project source is retained here in `src/`. The Instagram input folder also retains the preparation/sync scripts and a source staging copy; render commands and final exports use this production project.
