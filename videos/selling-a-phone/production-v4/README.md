# Selling a phone — current version v4

The current opening follows the user's explicitly requested seller-to-buyer handover: personal photos, messages and accounts on the phone; handover pauses; seven preparation steps appear; warning identifies data/account-access risks. The locked-out opening is superseded. See approved-plan-v4.md and production-note-v4.md.

- [Full video](exports/v4/selling-a-phone-v4.mp4)
- [15-second opening preview](exports/v4/preview.mp4)
- [Final opening review](exports/v4/final-hook-review.jpg)
- [Final storyboard](exports/v4/final-storyboard.jpg)
- [Validation](exports/v4/validation.json)
- [Graphify source graph](src-v4/graphify-out/graph.html)
- [Graphify review](graphify-review-v4.md)

V4 source is src-v4/. Bottom narration captions stay off. The approved body frames from frame 290 onward and all original narration are preserved. The new opening is rendered separately; finish_v4.py trims/concatenates it with exports/v3/render-source.mp4 at frame 290, then packages the complete original PCM narration. This avoids another body-animation render while keeping the source editable as a full 113-second composition.

From C:/Users/hecin/ai-video-editor:

```powershell
node projects/selling-a-phone/production-v4.cjs stills
node projects/selling-a-phone/production-v4.cjs review-stills
node projects/selling-a-phone/production-v4.cjs preview
node projects/selling-a-phone/production-v4.cjs render
node projects/selling-a-phone/production-v4.cjs finish
```

The render mode creates the 290-frame opening. If the body is edited later, the packaging workflow must also use freshly rendered body frames. Inputs, earlier source versions and exports are retained. Graphify is installed locally in the Instagram input project's .graphify-deps; graphify_workflow.py runs its entry point. The broad workspace graph remains preserved. The video-perception MCP is unavailable; reviews use local frames and decoded audio comparison. No publishing.
