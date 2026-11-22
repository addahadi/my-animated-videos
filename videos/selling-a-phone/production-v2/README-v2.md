# Selling a phone v2

This revision implements the user's explicitly approved scene plan in `approved-plan.md`. The rejected v1 remains in its original source/export locations. V2 source is `src-v2/`, its semantic captions/timing are `media/timeline-v2.json`, and its deliverables are in `exports/v2/`.

From C:/Users/hecin/ai-video-editor:

```powershell
python projects/selling-a-phone/make_timeline_v2.py
node projects/selling-a-phone/production-v2.cjs stills
node projects/selling-a-phone/production-v2.cjs review-stills
node projects/selling-a-phone/production-v2.cjs preview
node projects/selling-a-phone/production-v2.cjs render
node projects/selling-a-phone/production-v2.cjs finish
```

The source uses the existing Remotion installation in `motion/node_modules`, bundled Tajawal Bold and headless Chrome. Preview covers original narration 12–35 seconds at half resolution. Full output is 113 seconds, 1080×1920 and 30 fps. The silent image render is packaged with the unchanged nine-clip PCM narration at 0.9 gain through the existing full imageio-ffmpeg binary, preserving timing and exporting limited-range yuv420p H.264/AAC. No voice generation, footage generation or publishing.

All objects are front-facing user devices or relevant UI panels. Each action is placed against the recording's semantic/word timestamps. Backup originals remain; copies reach the destination and are opened. Authenticator accounts migrate before a password-plus-code example; a labeled conditional shows the missing-code risk. Watch/Bluetooth pairing is removed. Google removal, Apple sign-out and Find My follow the narration separately. Security sessions disappear only after the removal instruction. WhatsApp account/chats reach and open on the new phone. Reset follows five completed preparations. The welcome screen is only the first of three final checks.

Screens are explanatory schematics, not exact OS tutorials. The original script has unrecorded passages; no replacement speech is invented. There are no internals, chips, radio rings, huge device backdrops or camera zooms. The optional video-perception MCP and Graphify CLI remain unavailable; reviews use local rendered frames, semantic before/after sequences and full decode/audio correlation.
