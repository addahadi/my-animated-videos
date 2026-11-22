# Build notes: phone-listening

- Composition: `PhoneListening` (folder `Runtime-tech`) in `src/Root.tsx`. Entry: `src/index.tsx`. Studio: `npm run studio`.
- 1080 x 1920, 30 fps, 2822 frames (94.07 s); the narration is 94.059 s.
- Outputs: `out/phone-listening.mp4` (final, H.264), `out/phone-listening-preview.mp4` (half scale), review stills in `out/stills/`.

## Audio
- Voice: `public/phone-listening/voice.wav`, a copy of `videos/phone-listening/narration-master.wav`. That master was assembled at the planning step from `inputs/audio1-12.ogg`. Only silence was trimmed or added; no words were cut. The originals are untouched, and the edit list is in the timeline's `narrationEdit`.
- **SFX were synthesised locally, not downloaded** (`videos/phone-listening/make_sfx.py`, numpy only). 21 shared files are in `public/sfx/`: pop, pop-soft, stamp, whoosh, whoosh-short, tick, tick-roll, scan, shutter, type, lock, unlock, hit, glow, hum, morph, draw, steps, zoom, strike, ding.
  - 91 cues, each anchored to a timeline event (`src/videos/phone-listening/sfx.ts`), at volumes 0.22 to 0.78 under the voice.
- **Music: none.** No music file was supplied, and the build skill does not download music. To add one, drop a royalty-free track in `public/` and play it at about 0.08 to 0.1 volume with a fade out over the last second.

## Captions (approximate word timing)
- Built from the script text, never from speech recognition (`videos/phone-listening/make_captions.py` → `src/videos/phone-listening/captions.json`).
  - Words are spread over the voiced parts of each scene, in proportion to word length, with punctuation anchored to the real pauses.
  - The hook words (صدفة؟ / لا / يسمعك؟ / لا) were timed by hand from the waveform.
  - **Check the timing by ear in the Studio.**
- Pages hold at most 4 words and 22 letters, and break at punctuation. Font size auto-fits the pill (minimum 48 px).
- A CapCut-ready `public/phone-listening/captions.srt` is written too. To turn the burned-in captions off, render with `--props='{"captions":false}'`.
- Deviation: paging is custom, not `createTikTokStyleCaptions`, so that no page ever exceeds 4 words.

## Deviations from the plan
- Scene 2: the small phone thumbnail was dropped. The mugshot-style suspect card carries the beat, plus an extra magnifier pass on "علاش ماشي منطقي".
- Scene 3: the DATA card shows a filling meter and rising arrows instead of a number, to avoid inventing a figure. The battery % is illustrative ("if" scenario).
- Scene 4: the privacy dot sits inside the island and is green. On iOS the mic dot is orange, so this matches Android.
- Scene 5: the result card reads "SECRET AUDIO SENT · 0 · APPS CAUGHT", and the nuance line sits on its own card.
- Scene 12: the closing line ("يعرفك... بلا ما يسمعك") types over the dimmed save card, as planned. The full card holds for 2.5 s (84.0 to 86.5).
- Scene 13: no exit fade, so the last frame (the phone with the shoe feed and the end card) loops cleanly into frame 0.
- Everything is Remotion. The plan named no Manim or Motion Canvas scenes.

## Still to check by a human
- **Facts marked [VERIFY] in the script** (the 2018 study's 17,000+ apps, its findings, the indicator dots) before publishing.
- The end of clip 12 ("الكومنتار") is near the file edge. Listen to check it isn't clipped.
- Caption word timing in fast passages (scene 9 and scene 10's list).
- Optional polish in CapCut: a music bed.
