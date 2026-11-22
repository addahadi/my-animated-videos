# Selling a phone — current version v3

The user approved the contextual animation in v2, then requested removal of bottom narration captions and selected a stronger "new phone, locked out" opening. See [approved-plan-v3.md](approved-plan-v3.md) and [production-note-v3.md](production-note-v3.md).

Current deliverables:

- [Full v3 MP4](exports/v3/selling-a-phone-v3.mp4)
- [15-second opening preview](exports/v3/preview.mp4)
- [Opening review](exports/v3/final-hook-review.jpg)
- [Caption-free storyboard](exports/v3/final-storyboard.jpg)
- [Validation](exports/v3/validation.json)

V3 source is in src-v3/. It uses the unchanged nine-clip timing in media/timeline-v2.json and the original narration.wav, not the old phrase-caption renderer. There are no lower narration captions, repeated lower summaries or bottom progress bars. Relevant UI labels and the final checklist remain. Earlier source/export versions are preserved.

From C:/Users/hecin/ai-video-editor:

```powershell
node projects/selling-a-phone/production-v3.cjs stills
node projects/selling-a-phone/production-v3.cjs review-stills
node projects/selling-a-phone/production-v3.cjs preview
node projects/selling-a-phone/production-v3.cjs render
node projects/selling-a-phone/production-v3.cjs finish
```

Uses existing motion/node_modules, headless Chrome and local Tajawal Bold. Final packaging uses the existing full imageio-ffmpeg binary and original PCM narration with 0.9 gain, followed by complete decode/audio verification. Format is 1080×1920, 30 fps, 113 seconds. The optional video-perception MCP tools and Graphify CLI remain unavailable. Do not reintroduce the rejected v1 hardware imagery or decorative camera zooms.
