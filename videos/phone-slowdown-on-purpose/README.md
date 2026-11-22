# Does your phone get slower on purpose?

Current stage: script cleanup and audio-based planning. No finished video or rendered preview yet.

- [Clean script](scripts/phone-slowdown-on-purpose.md): all 13 approved spoken beats retained; visual directions removed. Its time column is the original writing estimate.
- [Storyboard and production plan](plans/phone-slowdown-on-purpose-plan.md): 12 scenes covering the supplied recorded delivery.
- [Animation timeline](plans/phone-slowdown-on-purpose-timeline.json): 1080 × 1920, 30 fps, 3,185 frames, half-open scene intervals. Paths in this JSON are relative to the JSON file.
- [Project visual system](plans/style.md): shared typography/motion/safe zones with this brief's light canvas and blue emphasis.
- [Audio measurements](analysis/audio-timing.json), [script/audio alignment](analysis/script-audio-alignment.json) and [validation](analysis/plan-validation.json).
- `analysis/narration.wav`: ten recordings assembled in numeric order at 48 kHz mono; 5,095,424 samples / 106.154667 seconds. All supplied words and pauses are retained. Use this as one track at frame 0, without independently frame-rounding clips.

Word cues and the two internal scene splits are provisional ASR-assisted anchors, not ear-verified forced alignment. Check timestamps by ear before animation. The last recording condenses the written conclusion/advice; script beat 13 is not detected in the recordings and is not given a fabricated audio slot. The supplied recording is authoritative.

The requested removal of visual directions changed only the script's visual column and standalone visual paragraph. The prior script is retained for provenance at `analysis/script-before-planning.md`; all 13 narration strings are unchanged.

To reproduce audio inspection from the workspace root:

```powershell
.\.venv\Scripts\python.exe videos/phone-slowdown-on-purpose/scripts/prepare_plan_audio.py
.\.venv\Scripts\python.exe videos/phone-slowdown-on-purpose/scripts/build_plan.py
```

The first command uses the already-cached local Whisper small model and the bundled ffprobe. Transcript drafts are for locating boundaries only, never for replacing the Darija script. Both commands write only into this video project. The build-plan command regenerates plan/timeline from `plans/scene-specs.json`; edit that authored specification to adjust scenes after listening.
