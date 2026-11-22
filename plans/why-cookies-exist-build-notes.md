# Build notes: why-cookies-exist

- Composition: `WhyCookiesExist` (src/Root.tsx), 1080x1920, 30 fps, 2535 frames (84.5 s).
- Audio: `public/why-cookies-exist/voice.wav` = copy of `videos/why-cookies-exist/narration-master.wav`
  (built from inputs/audio1-9.ogg during planning: silence trimmed only, no words cut). Originals untouched.
- Outputs: `out/why-cookies-exist-preview.mp4` (0.5 scale), `out/why-cookies-exist.mp4` (final).
- Captions: `src/videos/why-cookies-exist/captions.json` + `public/why-cookies-exist/captions.srt` (for CapCut).
  Turn burned-in captions off with `--props='{"captions":false}'`.

## Approximations
- Caption word timing comes from the script text spread over the voiced audio, pinned to measured pauses
  (`videos/why-cookies-exist/make_timing.py`, PINS). Approximate; check by ear.
- Scene events are anchored to caption words (word start minus 0.3 s), so they inherit the same approximation.

## Deviations from the plan
- Timeline copy (`src/videos/why-cookies-exist/timeline.json`) adds `props` (canvas, header, chapter pill,
  word-anchored events) in the format the shared Video shell uses. Scene boundaries and frames are unchanged.
- Server sits on the left and your browser on the right (Arabic reading order) in scenes 2-4.
- Beat 1: the profile is shown inside an "ADS CO. · DATABASE" frame plus a "YOUR HISTORY" card where
  ads-co.site is struck out, instead of the camera pulling back to a NodeBox. A red tracking ticket (ID 77X9)
  pops on the Accept tap; it is the same ID used by the advertiser in scene 6 (yellow 48213 = the site's own cookie).
- Beat 7: the stars circle is a generic blue disc with 12 stars (no official emblem). World map is stylized dots.
- Beat 9 end card: button "تابع للجاية", comment sticker "Accept ولا Reject؟", tagline/stamp defaults from style.md.
- No music (none supplied). SFX reuse `public/sfx/`; no missing files.

## Needs a human eye
- Scene 4 (pressing) and scene 8 timings at the word level.
- Scene 6 density: 9 tiles + profile + lines; check it reads on a phone.
