# Instagram video workspace (Runtime.tech)

This folder is the user's ongoing environment for making multiple Instagram videos. It is not limited to the first AI/ML/DL explainer.

## Production skills (source of truth)

Three user-level skills (installed in `~/.agents/skills/`) define the production line: its steps, folders, formats and defaults. Follow them as written. This file only adds facts about this workspace that the skills do not know. If this file seems to contradict a skill, follow the skill.

| Step | Skill | Needs | Produces |
|---|---|---|---|
| 1. Script | `$reel-script-writer` | a topic | Darija script in two cuts (main Reels cut 60 to 180 s, TikTok cut 30 to 50 s), hook options, on-screen text, publishing kit |
| 2. Record | the user | the script | two recordings, main cut and TikTok cut (the user's own voice, never AI-generated) |
| 3. Plan | `$video-planner` | script and both recordings | storyboard, engagement plan, `timeline.json` for each cut |
| 4. Build | `$remotion-builder` | plans, timelines, audio, style guide | Remotion source, review stills, preview, final MP4 for each cut |

Why two cuts: the Nov 2026 analytics (`reports/tiktok-vs-instagram-2026-11-19.html`) showed TikTok videos of 64 to 113 s were almost never watched to the end, so none got past TikTok's first test group, while Instagram still spread the same videos widely. The TikTok cut is a separate script and recording, never the main recording trimmed.

Carousels (photo posts, added 2026-11-22): `carousel-script-writer` (in this project's `.claude/skills/`) writes the slide text to `scripts/<slug>.md` (header `Format: carousel`). One script serves both platforms; slides are built in the Report style as Remotion stills, exported at 1080x1440 (Instagram) and 1080x1920 (TikTok). Design demo: compositions `CarouselDemo-ig` / `CarouselDemo-tt` (`src/videos/carousel-demo/`).

- Run a step when the user asks for it. Do not skip ahead. If the script or the recorded audio is missing, ask for it before planning or building.
- The user can put the recorded narration anywhere in the workspace and give its path. `$remotion-builder` copies it into `public/<slug>/` and never edits the original.
- Remotion's own agent skills may be installed in this project's `.agents/skills/` (via `npx remotion skills add`). Keep them. `$remotion-builder` loads them.

## Folders used by the skills

```
scripts/<slug>.md                  script from $reel-script-writer
plans/<slug>-plan.md               storyboard and engagement plan
plans/<slug>-timeline.json         scene timing in seconds and frames
plans/<slug>-tiktok-plan.md        TikTok cut plan (reuses the main cut's scenes)
plans/<slug>-tiktok-timeline.json  TikTok cut timing, from its own recording
plans/<slug>-build-notes.md        deviations, approximations, missing assets
plans/style.md                     the Runtime.tech "Report" visual system (see below)
plans/style-world.md               the Runtime.tech "World" visual system (see below)
references/runtime-style/          reference images for the Report style
references/world-style/            reference images for the World style
public/<slug>/                     audio copy, captions.srt, artwork
public/sfx/                        shared sound effects
src/videos/<slug>/                 Video.tsx, scenes/, timeline.json copy
src/components/ + COMPONENTS.md    shared components, reused across videos
src/lib/, src/theme.ts, src/Root.tsx
manim/<slug>/                      only when a plan uses Manim
out/                               stills, previews, final MP4 (<slug>.mp4 and <slug>-tiktok.mp4)
reports/                           platform analytics reports (HTML)
```

If the root `scripts/` folder already holds code scripts from the first video, leave them untouched. Video scripts there are Markdown files named `<slug>.md`.

## Context to read

- Read `README.md` for the workspace structure and current project commands.
- Before editing a video, read its `scripts/<slug>.md`, `plans/<slug>-plan.md`, `plans/<slug>-timeline.json` and its style guide (`plans/style.md` or `plans/style-world.md`). A video brief (`templates/video-brief.md`) is optional extra context if the user made one.
- `VIDEO-MAKING-PROCESS.md` documents the first completed video. It is a historical reference, not a specification for every future video.

## Established user preferences

- Tech channel branding is `Runtime.tech`. Use this exact name; do not use `Claude DZ` or `Claude.dz`.
- Default to vertical 9:16, 1080 × 1920, 30 fps unless the user requests otherwise.
- Preserve supplied narration, its intended order, and its meaning. Do not silently trim, replace, or reorder it. Any trim or cut must be listed in the plan and reported to the user.
- Time animation to the actual narration (measured from the audio file); do not assume every video has the first video's six sections or duration.
- Arrange scenes for portrait viewing, with legible Arabic text and room around the edges for interface controls.
- Keep project files and exports in this workspace, separate from `C:/Users/hecin/ai-video-editor`.

## Visual style

- The channel has **two styles** (decided 2026-11-22), one chosen per video by `$video-planner`:
  - **Report**: `plans/style.md`, the original Runtime.tech system (light paper, cards, tags). For evidence, prices, comparisons, decisions. `$remotion-builder` generates `src/theme.ts` from it.
  - **World**: `plans/style-world.md`, the Report palette and card language applied to a top-down "paper city" map with moving tokens, a persistent HUD and top karaoke captions; only the storytelling devices come from `references/new_style/`, never its night look. For processes, tracking, flows, systems that react. Tokens in `src/theme-world.ts`, components in `src/components/world/`. Example composition: `WorldStyleDemo`.
  - A World video may cut to a Report card for its save frame; both styles share the same end card. Section 0 of `plans/style-world.md` says which style fits which topic.
- Do not create a third style guide, and do not edit either guide unless the user asks to change that style.
- Before planning or building a scene, look at the images for the chosen style: `references/runtime-style/` (Report: key frames, contact sheets and the annotated `layout-spec.png`) or `references/world-style/` (World: key frames and contact sheets). The written guide gives the numbers; the images show the look. If an optional `reference.mp4` is there, it is for reference only and never used as footage.
- When reviewing stills, compare each one to the "Look-alike checklist" of the chosen style (`plans/style.md` section 10 or `plans/style-world.md` section 10) and fix mismatches before reporting.
- Copy the style system, not the reference's brand: no reference channel name, tagline, header wording, stamp word, products, prices or headlines from the reference. Use `Runtime.tech`, and invented example brands where the topic doesn't name a real one.
- Brands the video is about are shown with their real logos (images), not drawn stand-ins. Rules in `plans/style.md` section 14.
- Open items in section 12 of `plans/style.md` (tagline, stamp word, follow-button text) use the defaults written there until the user decides.
- The earlier "Design 2" reference (`C:/Users/hecin/ai-video-editor/projects/qr-code-explainer/style-guide.md`, approved example `C:/Users/hecin/ai-video-editor/projects/selling-a-phone/exports/v4/`) may be consulted for extra component ideas. If it conflicts with `plans/style.md`, `plans/style.md` wins.

## Project isolation

- The first completed video currently uses the root `src/`, `public/`, `analysis/`, audio files, and `output/`. Preserve those paths and deliverables unless the user asks to migrate or revise that video.
- New videos use the skills' folders above, keyed by `<slug>`. Register each new video as an additional composition in `src/Root.tsx` without changing the first video's composition.
- Do not overwrite the first video's source or outputs to make a new video. New renders go in `out/`, not in `output/`.
- Existing root audio-preparation, scene, rendering, and verification scripts contain first-video assumptions. Adapt copies for the new video rather than using them unchanged on unrelated narration.
- Shared dependencies and reusable artwork may be reused where compatible. Keep each video's content, timings, entry point, and output paths explicit.
- The original `ai-video-editor` repository is a reference toolkit. The first video was rendered with the independent Remotion project here; Concat/Rust and concat-mcp were not used. Do not claim otherwise.

## Working process

1. Establish the topic, intended language, and any new creative requirements. Run `$reel-script-writer` to produce `scripts/<slug>.md`.
2. The user records the narration and gives its path.
3. Run `$video-planner` with the script and the audio. It picks the Report or World style guide and records the choice in `plans/<slug>-plan.md`.
4. Run `$remotion-builder`. It builds, checks representative portrait frames against the look-alike checklist, renders a preview, then the final export.
5. Checks for each video: source/type checks, dimensions, frame rate, duration, narration placement, and visual review of the stills.
6. The deliverables are the final MP4 in `out/` and `plans/<slug>-build-notes.md`.

Proceed with authorized work without repeatedly asking for established preferences. Ask only for information that affects the result and cannot be inferred from the material or current instructions. Do not publish or send videos to external accounts without authorization.
