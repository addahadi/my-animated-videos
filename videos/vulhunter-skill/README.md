# VulnHunter video

The animation sections are approved. The user authorized correcting narration order to **1, 2, 4, 3, 5, 6**, and requested background music and supporting audio.

The user supplied the [Instagram reference](https://www.instagram.com/reel/DefGYOjI0NO/) locally as `inputs/post2.mp4`. Its charcoal grid, terracotta orange, cream Arabic text, monospace labels, mint/blue accents, square panels, pixel mascot, and stepped wipes guide this video's look. See [the reference review](analysis/style-reference.md).

The user requested the actual soundtrack from `inputs/post2.mp4`. The current final uses that extracted audio, looped at its original tempo and mixed audibly beneath the narration with light ducking. Generated music has been replaced. The prior video is preserved as `output/vulnhunter-instagram-v2.mp4`.

## Current review assets

- [Full Instagram video](output/vulnhunter-instagram.mp4): 1080 × 1920, 30 fps, approximately 70.17 seconds.
- [Full video with reference soundtrack](output/vulnhunter-instagram-reference-music.mp4): a separately named copy of the current final for review.
- [Short video preview](output/preview-reference-music.mp4): first 18 seconds at 540 × 960, with the actual supplied soundtrack.
- [Current soundtrack mix](output/soundtrack-reference.m4a): approximately 70.14 seconds, full narration with the extracted music and existing scene effects.
- [Extracted reference soundtrack](public/audio/reference-soundtrack.m4a): original AAC audio copied from `post2.mp4` without reencoding.
- [Scene overview](output/storyboard-v2.jpg) and [sample frames](output/stills/).
- [Reordered voice only](public/audio/narration-reordered.wav): all recordings in the corrected order, with no intentional trimming or added gaps.
- [Animation sections and timing](animation-ideas.md).
- [Project brief](brief.md).
- [Current audio validation and cue data](analysis/audio-production-reference.json).
- [Preview validation](output/validation-preview.json).
- [Final validation](output/validation.json) and [production note](production-note.md).
- The earlier `soundtrack-preview.m4a` and `soundtrack-preview-v2.m4a` are superseded generated music drafts, retained for history.

## Render and verify

Run these commands from the main workspace root. They use this video's entry point and outputs, and do not change the first video's root project.

```powershell
& .\node_modules\.bin\tsc.cmd -p videos/vulhunter-skill/tsconfig.json
node videos/vulhunter-skill/scripts/render.mjs stills
& .\.venv\Scripts\python.exe videos/vulhunter-skill/scripts/contact_sheet.py
node videos/vulhunter-skill/scripts/render.mjs preview --reuse-bundle
& .\.venv\Scripts\python.exe videos/vulhunter-skill/scripts/verify.py --preview
node videos/vulhunter-skill/scripts/render.mjs full --reuse-bundle
& .\.venv\Scripts\python.exe videos/vulhunter-skill/scripts/verify.py
```

Omit `--reuse-bundle` after changing source files or public assets. Rendering uses installed headless Chrome; `REMOTION_BROWSER` can specify another executable. The final picture is stream-muxed with the already checked AAC soundtrack to avoid added encoder delay.

Full export destination: `output/vulnhunter-instagram.mp4`. Validation: `output/validation.json`. The source is in `src/`, with scene timings and review notes in [storyboard.md](storyboard.md).

## Rebuild audio

From the workspace root:

```powershell
& .\.venv\Scripts\python.exe videos/vulhunter-skill/scripts/apply_reference_soundtrack.py
```

This extracts the actual reference soundtrack, repeats it to cover the narration, prepares editable music/mix WAVs and an AAC listening copy, and remuxes the existing full picture and short preview. It does not rerender or recompress the animation. It uses the existing reordered narration, SFX, and voice-gain data from the initial preparation. If rebuilding those base assets, run `scripts/prepare_audio.py` first, then `scripts/apply_reference_soundtrack.py`. Regenerate the video bundle before rendering source changes; remuxing existing picture does not need a bundle rebuild.

To regenerate the automatic draft transcripts:

```powershell
& .\.venv\Scripts\python.exe videos/vulhunter-skill/scripts/transcribe_audio.py
```

## Audio production notes — October 19, 2026

- Input files remain unchanged. SHA-256 hashes, full decoded sample counts, and recording boundaries are recorded in `analysis/audio-production-reference.json`.
- Assembled narration: 3,366,912 samples at 48 kHz; duration 70.144 seconds.
- Current music: actual AAC soundtrack copied from `post2.mp4`. Exact extraction was verified sample-for-sample. Complete 36-second cycles preserve the original tempo, with tiny boundary fades and voice ducking.
- SFX v2: restrained, short locally generated sweeps, clicks, and low confirmation tones at animation cues.
- Voice receives a uniform gain in the mix. Separate voice-only output retains the original decoded levels, subject only to PCM quantization.
- Checks passed: exact source soundtrack extraction, full narration retained, all six narration sections present, final mix matches the intended waveform above 0.99998 correlation, master stays below clipping, and encoded picture packets are identical to the approved animation.
- Reference frames and representative project frames were inspected. Verification-panel spacing was corrected before exporting the short preview. Subjective listening approval remains the user's choice.
