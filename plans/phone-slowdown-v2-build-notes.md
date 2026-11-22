# Build notes: phone-slowdown-v2

- Composition: `PhoneSlowdownV2` (registered in `src/Root.tsx` beside the earlier videos, which are unchanged).
- Final: `out/phone-slowdown-v2.mp4` (1080 × 1920, 30 fps, H.264 + AAC). Preview: `out/phone-slowdown-v2-preview.mp4` (half scale).
- Length: 2,819 frames = 93.97 s. ffprobe on the preview: 94.02 s (AAC padding, under 2 frames), audio stream present.
- Studio: `npx remotion studio src/index.tsx`, then open `PhoneSlowdownV2`.

## Audio
- Voice: `public/phone-slowdown-v2/voice.wav`, a copy of `videos/phone-slowdown-on-purpose/v2/narration-master.wav` (new intro + unchanged audio4-10; only edge silence trimmed, 0.25 s gaps, 2.0 s end-card tail). Original recordings untouched.
- No music (none supplied). Captions can be switched off with `--props='{"captions":false}'` if you caption in CapCut; `public/phone-slowdown-v2/captions.srt` is there for that.

## Approximate / to check by ear
- **Caption word timing is approximate**: built from the script text, spread over the voiced audio, with measured pauses pinned (`v2/make_timing.py`). Events are tied to words with a 0.3 s lead.
- **Caption wording to confirm** (written from listening + draft ASR, not from your script):
  - scene 9 (audio8): «لهذا التطبيق اللي كان يخدم عندك خفيف يقدر يولّي ثقيل. وماشي كل تحديث يدير هكّا، كاين تحديثات فعلاً تزيد الأداء.»
  - scene 11 (audio10, first half): «يعني يقدرو يبطّؤوه بالعاني؟ إيه، في بعض الحالات. بصح البطء وحدو ما يثبتش بلي يحبوك تشري جديد.»
  - scene 12 (audio10, second half): «يعني قبل ما تبدّل تليفون، شوف حالة البطارية والتخزين. وإذا البطارية السبب، تبديلها يقدر يحسّن الأداء ويوفّر الدراهم.»
  - To correct: edit `CAPTION` in `videos/phone-slowdown-on-purpose/v2/make_timing.py`, rerun it, then re-render.
- Final periods are dropped from captions (in right-to-left lines they showed on the wrong side, e.g. «في .2017»).

## Deviations from the plan
- The header and chapter pill start at scene 4 (11.36 s), not mid-scene 3; scene 3 shows the "2017 / CASE FILE →" sticker instead. Scenes 1 to 3 stay clean, like a hook.
- Scene 5's pill is «علاش؟» for the whole scene (no second pill «البطارية» mid-scene); the battery card carries that beat.
- Scene 7's pill is «الحل».
- Scene 8: the plan's small red XStamp became an ink sticker «ماشي ديما البطارية» (red is kept for slowdown/penalty).
- Scene 9: blocks reduce from overflow to 7 after the update, instead of shrinking in size.
- Scene 12 rows were shortened to fit the card: «حالة البطارية» / «التخزين الفارغ» / «بدّل البطارية» (highlighted), with a green sticker «توفّر دراهمك».
- "Apple" appears only in captions (spoken). No logos and no iPhone drawings.

## Missing SFX (mapped to existing files)
- bloop → `morph`, click → `tick`, water → `glow`. All others come from `public/sfx/`.

## Shared code added
- `src/components/Hardware.tsx` (Spinner, SpeedBar, CameraView, ChargeTank, PowerMeter, TapInset, SpeedDial, TaskBox, StorageBar, Thermometer, CauseChips, NotifCard), listed in `COMPONENTS.md`.
- `LockedChip` gained an optional `label` (default `TRUTH`, so earlier videos are unchanged).

## Worth a human look
- Scene 2 (4 to 7 s): the camera-miss timing on «تفوت».
- Scene 6 (31 to 40 s): the tap analogy reads well in stills; check that the motion is clear at full speed.
- Scene 13: the end card lasts 1.86 s. If it feels rushed, raise `TAIL` in `v2/make_master.py` and rerun the master, plan timeline and timing scripts.
