---
name: remotion-builder
description: Implement a faceless tech-education video in Remotion from a finished plan. Reads plans/<slug>-plan.md, plans/<slug>-timeline.json, the recorded audio and plans/style.md, then builds reusable components, data-driven scenes, Darija RTL captions and audio, checks it with still frames, and renders the Reel. Use after video-planner when the user asks to build, implement, animate or render the video.
---

# Remotion Builder

You turn an approved plan into a rendered vertical video. The plan decides what happens. The timeline decides when. The audio is fixed and never changes. Your job is clean, reusable code that matches the plan exactly, verified by looking at real frames before you claim it works.

Pipeline position: `reel-script-writer`, record audio, `video-planner`, **this skill**, optional polish in CapCut, then post.

## Account context (edit this block if anything changes)

- Brand: Runtime.tech (use this exact name; never "Claude DZ" or "Claude.dz"). Faceless. The voice is the creator's own recording, never AI-generated.
- Output: 1080x1920, 30 fps, H.264, no watermark.
- Language: Algerian Darija in Arabic script (right-to-left), technical terms in Latin letters.
- The creator posts 3 to 4 times a week, so **components are shared across videos**. Reuse before you create.

## Required inputs

1. `plans/<slug>-plan.md` (storyboard, engagement map, components list, build order, MVP fallback)
2. `plans/<slug>-timeline.json` (scenes with seconds and frames, component names, props, on-screen text, SFX, tool, role)
3. The recorded audio (the path is in the timeline's `audioFile`)
4. The style guide named in the plan's `Style:` line and the timeline's `style` field: `plans/style.md` (Report, the default when the field is missing) or `plans/style-world.md` (World). Read the matching references folder (`references/runtime-style/` or `references/world-style/`) and use that guide's look-alike checklist for the still review. A World video's mixed-in Report scenes follow `plans/style.md`.

Optional: a CapCut `.srt` of the same recording (preferred for captions), a music file, SFX files, an existing Remotion project.

**TikTok cut:** if `plans/<slug>-tiktok-timeline.json` exists, build it too, as a second composition of the same video. It has its own audio (copied to `public/<slug>/voice-tiktok.<ext>`), its own timeline copy (`src/videos/<slug>/timeline-tiktok.json`) and its own captions, but it shares the scenes and components of the main cut. Apply the same preflight, validation and checks to it. If only the main cut has a plan, build that and say the TikTok cut is waiting for its plan.

If anything required is missing, ask for it in one line and stop. Never build from the script alone, and never guess timing.

## Step 0: Preflight

1. **Find or create the project.** Look for a `package.json` with a `remotion` dependency in the working directory. If there is none, create one: `npx create-video@latest --yes --blank --no-tailwind <name>` (check `npx create-video@latest --help` if a flag is rejected), then work inside it.
2. **Load the official Remotion skills.** If `.agents/skills/remotion-best-practices` does not exist in the project, run `npx remotion skills add`. Then load `remotion-best-practices` and follow it. Use the `remotion-docs` skill (or the Remotion docs) to check any API you are not sure of. Remotion's APIs change between versions, so read the installed version in `package.json` and trust the docs over memory.
3. **Install matching packages** with `npx remotion add <package>` so versions match `remotion`: `@remotion/captions`, `@remotion/media`, `@remotion/google-fonts`.
4. **Measure the audio** with `ffprobe` (duration, audio stream present).
5. **Validate the timeline.** Scenes must be contiguous with no gaps or overlaps. Each `startFrame` and `endFrame` must equal `round(sec * fps)`. The last `endFrame` must equal the audio duration in frames within 2 frames. If the timeline and the audio disagree by more, stop and report it. Do not stretch or squash anything. The fix is to re-run `video-planner`.

## Step 1: Project layout

```
public/<slug>/voice.<ext>        copy of the recorded audio (never edit the original)
public/<slug>/captions.srt       if provided
public/<slug>/images/            images listed in the plan's Images table
public/sfx/                      shared sound effects
src/theme.ts                     tokens generated from plans/style.md (Report, shared tokens)
src/theme-world.ts               World tokens generated from plans/style-world.md (imports shared tokens from theme.ts)
src/components/world/            World components (CityMap, CarToken, LevelMeter, SlotTray, TopCaption, ...)
src/components/                  shared, reusable components + COMPONENTS.md catalog
src/lib/                         helpers (sec(), registry, captions, sfx)
src/videos/<slug>/Video.tsx      the composition
src/videos/<slug>/scenes/        bespoke scenes for this video only
src/videos/<slug>/timeline.json  copy of the timeline (single source of truth for timing)
src/Root.tsx                     registers the composition
manim/<slug>/                    only if the plan uses Manim
out/                             renders and stills
```

The composition is registered with width 1080, height 1920, fps from the timeline, and `durationInFrames` equal to the timeline's last `endFrame`.

The TikTok cut is registered as a second composition with the id `<slug>-tiktok`. It uses the same `Video.tsx` with the TikTok timeline, audio and captions passed as props, and is rendered to `out/<slug>-tiktok.mp4`.

## Step 2: Theme

Generate `src/theme.ts` from `plans/style.md`: colors, font families and sizes, motion durations, easing, safe-zone numbers. For a World video, also use `src/theme-world.ts` (generated from the token block of `plans/style-world.md`; create or update it if the guide changed) and the components in `src/components/world/`; World captions use `TopCaption` instead of `CaptionPill`. **No hardcoded colors, sizes or durations inside components.** If `plans/style.md` is missing, stop and ask the user to run `video-planner` first.

## Step 3: Data-driven architecture

- `src/lib/registry.ts` maps each timeline `component` string to a React component.
- `Video.tsx` reads `timeline.json` and renders each scene as a `<Sequence from={startFrame} durationInFrames={endFrame - startFrame}>` containing the registered component with the scene's `props`.
- Inside a `Sequence`, `useCurrentFrame()` is local to the scene. Use that.
- **All timing comes from the timeline** through one helper, `sec(seconds, fps)`. Never hardcode a frame number in a component.
- **Reuse first.** Read `src/components/COMPONENTS.md`. If a component exists (`Packet`, `BrowserWindow`, `Terminal`, `SplitCompare`, `TermLabel`, `CaptionTrack` and so on), use it. Create a new component only when none fits, and make it generic (`Packet`, not `GooglePacket`), typed, theme-driven, and driven by props. Add every new component to the catalog with its props and an example.
- Bespoke one-off animation goes in `src/videos/<slug>/scenes/SceneNN<Name>.tsx` and is registered like any other component.
- Build in the plan's **build order**. Use the plan's MVP fallback only if the user asked for a quick version, and say so.

## Step 4: Animation rules

- Everything animates from `useCurrentFrame()`. **No CSS transitions or CSS animations, no `setTimeout`, no `Date.now`, no `Math.random`** (use Remotion's seeded `random('seed')` when randomness is needed). Renders must be deterministic.
- Use `interpolate` with both extrapolations clamped, `spring` for pops, and the easing from the theme.
- **Visuals lead the voice.** Elements tied to a spoken word appear 0.2 to 0.4 s before it, using the lead from the plan. Emphasized words get the micro-event the plan lists.
- **Progressive build.** Elements appear one per spoken idea, the current one is highlighted, earlier ones are dimmed. Never show a full diagram at once.
- **Frame 0 shows meaningful content and motion starts within the first few frames.** No black frame, no logo intro.
- Keep heavy effects (large blurs, big shadows) modest so rendering stays fast.
- For scenes that flash or pop in late, check the `Sequence` `premountFor` option in the docs.
- Implement the plan's holds (freeze a frame, add emphasis). **Never change the audio's length or content.** If the plan lists dead-air cuts, build on the untrimmed audio and tell the user that trimming needs a trimmed audio file and a re-timed plan.

## Step 5: Arabic and mixed-direction text

- Containers use `dir="rtl"`. Wrap Latin terms (API, server, JWT) in `<bdi>` or `<span dir="ltr">` so they stay in the right place.
- Render words as inline spans inside one block, **not** as flex rows, so the bidirectional order stays correct.
- **Never add `letter-spacing` to Arabic text.** It breaks letter joining. Avoid `text-transform` as well.
- Load fonts with `@remotion/google-fonts` using the family from the style guide (for example Cairo or Tajawal), including the Arabic and Latin subsets. `loadFont()` holds the render until the font is ready. Confirm with a still.
- Every scene that contains Arabic gets a still check (Step 9).

## Step 6: Captions

Choose the source in this order:

1. **CapCut SRT** (best): parse it with `parseSrt` from `@remotion/captions`, then group with `createTikTokStyleCaptions`.
2. **Script lines from the timeline**: use each scene's voiceover text and its start/end time. Spread the words across the line's time window in proportion to word length. Mark these as **approximate word timing** in the final report.

Never auto-transcribe Darija and replace the script text. Speech recognition is unreliable on the dialect, and the script is the source of truth.

Build a `CaptionTrack` component: pages of 2 to 4 words (tune `combineTokensWithinMilliseconds`, roughly 800 to 1200 ms), the active word highlighted with the theme accent, a stroke for contrast, large text (at least 64 px), positioned inside the safe zone.

Captions are controlled by a `captions` prop (default `true`), so the creator can turn them off with `--props` and use CapCut captions instead.

## Step 7: Audio

- Play the recorded voice with `<Audio>` from `@remotion/media` and `staticFile('<slug>/voice.<ext>')`, full length, full volume.
- **Music:** every video gets a background music bed. Use the user's file if they supply one; otherwise synthesize an original track locally (numpy, like `make_sfx.py`) into `public/<slug>/music.wav`, following the video's sections. Keep it far under the voice (about 20 dB lower, which is a volume near 0.1), fade it out over the last second. **Never download music or sound effects from the internet.**
- **SFX:** map the plan's SFX names to files in `public/sfx/` through a small registry that lists only files that exist. If a file is missing, skip it, do not fail the render, and list it in the report.

## Step 8: Manim and Motion Canvas scenes

- **Manim** (only if the plan's tool is Manim): write `manim/<slug>/sceneNN.py`, render vertically (for example `manim render -r 1080,1920 --fps 30 manim/<slug>/sceneNN.py SceneNN`), copy the result into `public/<slug>/manim/`, and place it in the scene with `Video` from `@remotion/media`, muted. Use only Latin or numeric labels in Manim, because Arabic text is unreliable there. Overlay Arabic text in Remotion. If `manim --version` fails and installing is not simple (on Windows it often needs extra system libraries), rebuild the scene in Remotion with SVG and note the change.
- **Motion Canvas:** not built here. Implement that scene in Remotion with the same look and note it.

## Step 9: Verify with real frames before claiming success

1. Type check: `npx tsc --noEmit`, plus the project's lint script if it has one.
2. Render stills and **open them with the Read tool**: `npx remotion still <composition-id> out/stills/f<frame>.png --frame=<n>` (check `npx remotion still --help` for the exact argument order in this version). Take frames at: 0, 6, the middle of every scene, every scene that has Arabic or code, one caption page with a highlighted word, and the last frame.
3. Inspect each still for: text inside the safe zone (nothing critical in the top 250 px, bottom 450 px or the right-edge button column), nothing clipped, correct RTL order, Latin terms in the right place, contrast, one color per concept, no empty or placeholder frames. Fix what you find and re-render the affected stills.
4. Render a fast preview: `npx remotion render <composition-id> out/<slug>-preview.mp4 --scale=0.5`. Check with `ffprobe` that the duration matches the audio within 1 frame and that an audio stream exists.
5. Unless the user asked for preview only, render the final: `npx remotion render <composition-id> out/<slug>.mp4 --codec=h264`, and repeat the duration and audio check.

6. Repeat steps 2 to 5 for the `<slug>-tiktok` composition when it exists. Check frame 0 closely in both: the hook text must be readable at 0.0 s.

A render that finishes is not proof that the video is right. The stills are.

## Step 10: Report

Reply in a few lines, not a recap of the steps:
- The paths of the preview and final video, and the command to preview in the Studio (`npx remotion studio`).
- What is approximate (caption word timing if it came from the script lines).
- Missing assets (SFX, music) and anything skipped or changed from the plan. Write the same list to `plans/<slug>-build-notes.md`.
- Scenes you think need a human eye or manual polish.
- Any script change that would help, as a suggestion only.

## Updating a build

If the audio is re-recorded or the plan changes, re-run `video-planner` for a new `timeline.json`, then re-run this skill. Because scenes are data-driven, only the timeline copy, audio, captions and affected scene components should change. Do not rebuild the whole project.

## Never

- Never modify the script, the plan, the original audio or the style guide.
- Real brand logos: use the logo files the plan's Images table lists (the creator prefers real logos over drawn stand-ins for brands the video names). Never put a real logo on something the video presents as fake. Other companies' interface screenshots only when the user supplies them or the plan lists them.
- Images: use only the files listed in the plan's Images table (in `public/<slug>/images/`), shown with `<Img>` and `staticFile()` inside the shared `ImageCard` component as `plans/style.md` section 14 describes. If a listed file is missing, use a drawn placeholder card, keep rendering, and report it.
- Never download images (beyond the plan's list), music, fonts outside `@remotion/google-fonts`, or stock footage from the web without the user's say.
- Never put a face, a real person's photo, or personal information on screen.
- Never add a watermark or an AI-generated voice.

## Final checklist (fix before reporting)

- [ ] Timeline validated against the audio, and the last frame matches the audio duration.
- [ ] Every timing value comes from `timeline.json` through `sec()`, with no hardcoded frames.
- [ ] Existing components were reused, new ones are generic, typed, themed and added to `COMPONENTS.md`.
- [ ] No CSS animations, timers or unseeded randomness. The render is deterministic.
- [ ] Frame 0 has content and the hook text, there is no black intro, and progressive builds match the plan.
- [ ] If a TikTok plan exists, the `<slug>-tiktok` composition was built from its own audio and timeline, checked and rendered.
- [ ] Arabic is right-to-left with no letter-spacing, Latin terms are isolated, and fonts load.
- [ ] Captions come from the SRT or the script lines, and approximate timing is disclosed.
- [ ] Audio is untouched, music is quiet (user-supplied or locally synthesized), and missing SFX are reported.
- [ ] Stills were opened and inspected, including safe zones, and problems were fixed.
- [ ] Preview and final renders pass the duration and audio-stream check.
- [ ] The report lists approximations, missing assets, plan deviations and manual-polish scenes.
