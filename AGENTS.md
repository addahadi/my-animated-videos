# Instagram video workspace

This folder is the user's ongoing environment for making multiple Instagram videos. It is not limited to the first AI/ML/DL explainer.

## Context to read

- Read `README.md` for the workspace structure and current project commands.
- Read the relevant video's brief, storyboard, and project instructions before editing it.
- `VIDEO-MAKING-PROCESS.md` documents the first completed video. It is a historical reference, not a specification for every future video.

## Established user preferences

- Default to vertical 9:16, 1080 × 1920, 30 fps unless the user requests otherwise.
- Use short Arabic headings, keywords, or phrases. Do not display the entire narration as captions unless requested.
- Preserve supplied narration, its intended order, and its meaning. Do not silently trim, replace, or reorder it.
- Time animation to the actual narration; do not assume every video has the first video's six sections or duration.
- Use the first video's illustrated 2D style as a starting point when suitable. Adapt the visual concept to the new topic and the user's instructions.
- Arrange scenes for portrait viewing, with legible Arabic text and room around the edges for interface controls.
- Keep project files and exports in this workspace, separate from `C:/Users/hecin/ai-video-editor`.

## Project isolation

- The first completed video currently uses the root `src/`, `public/`, `analysis/`, audio files, and `output/`. Preserve those paths and deliverables unless the user asks to migrate or revise that video.
- Create future videos under `videos/<descriptive-slug>/`, with their own brief, inputs, assets, source, analysis, and output.
- Do not overwrite the first video's source or outputs to make a new video.
- Existing root audio-preparation, scene, rendering, and verification scripts contain first-video assumptions. Adapt copies inside the new project rather than using them unchanged on unrelated narration.
- Shared dependencies and reusable artwork may be reused where compatible. Keep each video's content, timings, entry point, and output paths explicit.
- The original `ai-video-editor` repository is a reference toolkit. The first video was rendered with the independent Remotion project here; Concat/Rust and concat-mcp were not used. Do not claim otherwise.

## Working process

1. Establish the topic, supplied script/audio, intended language, and any new creative requirements.
2. Create the video's folder and brief. Refer to `templates/video-brief.md`.
3. Inspect the supplied material, propose an appropriate concept when needed, and record the chosen direction.
4. Build and review representative portrait frames and a short preview before the full export.
5. Run checks appropriate to that video: source/type checks, dimensions, frame rate, duration, narration placement, and visual review.
6. Save the final MP4, review assets, and a short project-specific production note inside that video's folder.

Proceed with authorized work without repeatedly asking for established preferences. Ask only for information that affects the result and cannot be inferred from the material or current instructions. Do not publish or send videos to external accounts without authorization.
