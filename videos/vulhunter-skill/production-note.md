# VulnHunter production note — October 19, 2026

Delivered `output/vulnhunter-instagram.mp4`: vertical 1080 × 1920, 30 fps, 2,105 frames, 70.166667 seconds, H.264 picture and AAC stereo sound. All files remain inside this video project; the first video's paths were not replaced.

## Content and visual treatment

The user approved the eight animation sections and authorized correcting the recording sequence to **1 → 2 → 4 → 3 → 5 → 6**. The full 70.144-second narration is retained, with no intentional trimming, gap insertion, replacement, or time stretching. Original OGG inputs remain unchanged.

The user then supplied `inputs/post2.mp4` as both a visual and soundtrack reference. Decoded reference frames informed the charcoal grid, terracotta `#DA7758`, warm cream Arabic headings, monospace labels, square browser/terminal windows, mint/blue section accents, pixel mascot, stepped transitions, and segmented footer progress.

Scenes were implemented as React/SVG animation with Remotion 4.0.530. Shared existing Arabic/Latin fonts were copied into this project's assets with their font licenses. The app, code, finding, patch, and verdict are explanatory illustrations, not screenshots or results of an actual security scan. The independent verifier is shown reviewing code and evidence rather than editing or running tests.

Representative portrait frames were rendered and reviewed before the final export. That review led to a more compact verification panel and a coherent illustrative ownership-check excerpt. An 18-second half-resolution preview was rendered and checked before the full-resolution render.

## Revised soundtrack

### Current revision: actual supplied soundtrack

After reviewing v2, the user explicitly asked to extract the soundtrack from `inputs/post2.mp4` and apply it to the output. That is now the current final. `public/audio/reference-soundtrack.m4a` is a stream copy of the supplied reference's AAC audio; decoded samples were checked to be exactly identical to the input audio.

The actual recording is repeated at its original tempo using complete 36-second cycles with 6 ms boundary fades, then mixed with the full approved narration and the existing subtle scene effects. Music has been brought forward to approximately 14 dB below active speech RMS, with light ducking and entrance/exit fades. The animation is reused without reencoding. The old final is preserved as `output/vulnhunter-instagram-v2.mp4`.

Current editable stems: `public/audio/music-reference.wav` and `public/audio/soundtrack-reference.wav`. Listening copy: `output/soundtrack-reference.m4a`. Preview: `output/preview-reference-music.mp4`. Final: `output/vulnhunter-instagram.mp4`, also provided as `output/vulnhunter-instagram-reference-music.mp4`. Rebuild using `scripts/apply_reference_soundtrack.py`. Reference extraction, mix, clipping, and narration checks are recorded in `analysis/audio-production-reference.json`; current output checks are in `output/validation.json`. Earlier v2 validation is retained in `output/validation-v2.json`.

### Previous v2 revision (superseded)

The user rejected the first 96 BPM pad-and-pluck track. Version 2 is an original 120 BPM bass-led electronic pulse with a restrained kick, quiet offbeat texture, and shorter transition/click sounds. The direction comes from the reference's strong 120 BPM onset periodicity and predominantly low-frequency energy. No reference audio samples or third-party music recordings were reused.

The supplied voice receives a uniform gain in the mix. Music ducks according to the actual voice envelope and fades in/out. Narration, music, SFX, and the combined mix remain available as editable WAV stems under `public/audio/`.

The renderer's intermediate AAC conversion introduced a 2,048-sample delay in the initial short-preview export. Directly muxing the checked first-generation AAC listening track with the rendered picture removed that delay. Both the checked preview and final export use this direct-mux method. The renderer's FFmpeg executable path was corrected; the already-rendered final picture was muxed separately without rerendering or recompressing it.

## Earlier v2 verification and review assets

- TypeScript source check passed using this project's `tsconfig.json`.
- Final media dimensions, frame rate, frame count, duration, and H.264/AAC codecs passed checks.
- Each full recording correlates with its expected position in the reordered voice-only WAV above 0.999999.
- Each full section of the final soundtrack correlates with the intended mixed WAV above 0.99996. Correlation with the original voice remains above 0.990 in all six sections, despite the added music.
- Decoded native-channel AAC peak is approximately 0.796, below clipping.
- Sampled encoded frames across all major sections and at the end pass nonblank-image checks. Representative frame artwork was also inspected visually.
- Reports: `output/validation.json`, `output/validation-preview.json`, and `analysis/audio-production-v2.json`.
- Review assets: `output/preview-v2-synced.mp4`, `output/storyboard-v2.jpg`, `output/stills/`, `output/final-frame.jpg`, and `output/soundtrack-preview-v2.m4a`.

The user approved the visual result and requested replacement of the v2 generated music with the actual supplied soundtrack. Nothing has been published or sent to external accounts.

Rebuild commands are documented in `README.md`; exact scene timings are in `storyboard.md` and `src/Video.tsx`.
