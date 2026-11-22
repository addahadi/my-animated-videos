# Design 2: light blue explanatory animation

Approved reusable style, updated 2026-11-01 after the user approved the caption-free selling-a-phone v4 video. Use this identity for future Instagram videos with different topics. The visual reference is now that approved video, rather than the earlier QR-code experiment.

## Selection and authority

Use this guide when the user requests **Design 2**, **the light blue technical style**, **the QR-code video style**, or **the approved selling-a-phone design**. `style.md` in this folder is a shortcut to this guide. A new explicit brief takes precedence. This update defines Design 2; it does not change Design 1's separate standing default.

Keep Design 2 light unless a dark adaptation is requested. Preserve the intended channel's language and identity: RunTime tech uses North African context and Algerian Darija; enjoy.with.ai uses English. Topics, characters, devices, app names, step counts and narration are project content, not permanent brand elements.

## Approved references

Inspect these before building a new Design 2 video (paths relative to this folder):

- [Approved full video](../selling-a-phone/exports/v4/selling-a-phone-v4.mp4).
- [Opening preview](../selling-a-phone/exports/v4/preview.mp4).
- [Opening review](../selling-a-phone/exports/v4/final-hook-review.jpg) and [full storyboard](../selling-a-phone/exports/v4/final-storyboard.jpg).
- [Editable reference](../selling-a-phone/src-v4/SellingPhoneV4.tsx), [project commands](../selling-a-phone/README.md), and [production note](../selling-a-phone/production-note-v4.md).

The selling-a-phone v4 video is the approved visual and explanatory benchmark. Its seller/buyer handover and seven steps belong to that topic. Do not repeat them for unrelated subjects. Earlier QR-code exports, caption systems and camera studies remain historical references; they no longer define the defaults. The previous guide is preserved in `style-guide-qr-reference-2026-10-28.md`.

## Palette and artwork

| Role | Value | Use |
| --- | --- | --- |
| Canvas | `#F0EFF4` | Flat cool light gray throughout the reel |
| Surface | `#FFFFFF` | Screens, relevant UI, objects and panels |
| Ink | `#111214` | Text, object outlines and essential detail |
| Neutral | `#D2D4D9` | Secondary shapes and inactive UI |
| Accent | `#0087FA` | Active action, transfer, selected state and confirmation |
| Warning | `#FFC400` | A specific risk tied to the narration |

Use crisp flat vector artwork, strong near-black object outlines, rounded physical silhouettes, thinner interface/diagram strokes and restrained shading. Keep the focal object legible at phone viewing size. Simple outlined people with blue/gray clothing can clarify roles and physical actions when the topic benefits from them. Keep their drawing language consistent with the props.

Represent the actual subject: an app screen for an app action, a person for an interaction, files for file movement, a diagram for a relationship. Use meaningful thumbnails, message rows, account symbols, named items and visible state changes. A generic rectangle is insufficient when viewers need to distinguish a photo, account, message or file. UI can be simplified for clarity; do not imply that every platform has identical menus or behavior.

No decorative textures, glossy 3D, gradient washes, ornamental rings, or unexplained technical modules. Hardware interiors, circuitry, RAM and CPUs appear only when the narration actually explains them. A phone is useful when the topic involves a phone; it is not a mandatory Design 2 mascot.

## Typography and visible text

Use locally bundled **Tajawal Bold** for Arabic and compatible Latin UI labels; retain its OFL license. Preserve joined Arabic letters, RTL ordering and deliberate Arabic/Latin isolation. Right-align Arabic lists and labels where appropriate; center compact headings in their container. Use a consistent hierarchy of quiet branding, short scene heading, object/role labels and essential UI text.

**Bottom narration captions are off by default.** Do not restore phrase-by-phrase subtitles, karaoke text or a transcript band. The voice carries the explanation. Short Arabic headings, actual step names, role labels, UI controls, warnings and state labels remain welcome when they help viewers understand the action. Do not turn these into a disguised transcript.

Use the released lower space for larger demonstrations, comparison, meaningful steps or breathing room. Do not fill it automatically. Scale text for mobile readability and verify it at reduced playback size; avoid shrinking every label to fit an overloaded scene.

## Portrait composition

Default to **9:16, 1080 × 1920, 30 fps**. Use a quiet original channel wordmark near the top and a small topic/scene pill where useful. Keep essential information away from the extreme edges and leave room for Instagram controls. Check the target app's overlay in review rather than treating one coordinate map as universally safe.

The main stage contains the action and its result, often one large object or two clearly labeled source/destination objects. Maintain generous negative space and a stable visual hierarchy. Place step lists or comparison details near the demonstration they explain. Avoid repeatedly framing every subject inside an identical card. Cards are appropriate for real UI, file collections or an actual checklist.

Reusable composition sketch (adapt to the subject):

```text
quiet branding                     topic
             short scene heading

       actor / object → action → result
          large, readable demonstration

       relevant UI or step overview
              breathing room
```

Do not reserve the old QR video's bottom caption strip or copy its fixed phone coordinates into every project. Rearrange each scene for its explanation.

## Narrative and animation

Read the full script and listen to the supplied recordings before choosing scenes. For every meaningful narration beat, identify the subject, action, consequence and what viewers should understand. Translate those into visible changes. Showing the named object alone does not explain what is happening to it.

Build the hook around the topic's concrete situation and stakes. Make the relevant content or relationship visible, then show the interruption, problem or question at the correct spoken cue. In the approved example, a seller approaches a buyer with personal content still on the phone; the handover pauses, the affected photo/account regions receive warning emphasis, and the preparation steps appear. Future hooks should express their own subject with equal clarity, rather than reuse this scenario.

Use action-driven motion: a hand reaches, a copy travels, a control is tapped, a connection breaks, a row disappears after removal, a verification result opens. Show a readable starting state, the action, and its result. Keep old/new, sender/receiver, original/copy and account/device identities clear whenever the topic depends on those distinctions.

- Keep a stable camera by default. Move or transform the object that performs the action.
- Use a zoom or close-up only when a relevant detail needs magnification to be understood; retain spatial context. No routine zooming merely because a phone is present.
- Use arrows and paths for actual transfer or relationships, checks for demonstrated completion, and yellow warnings for the specific risk being discussed. Color alone should not carry the meaning.
- Sequence reveals to the actual voice cues. Hold important states long enough to read; avoid racing through meaningful actions while the voice is still explaining them.
- Preserve object identity across related scenes. Use continuity or a motivated transition instead of fading to an empty canvas at every recording boundary.
- Use easing and restraint. No arbitrary spinning, bouncing, constant camera movement, scan sweeps or technical rings as filler.

Visual claims must match the narration. Copying should leave the original present; unlinking a device should not imply destroying its owner's account; a warning should not show an irreversible loss that has not occurred. Show verification evidence when verification is part of the explanation. Do not introduce misleading product mechanisms to make the frame look more technical.

## Reuse and production workflow

1. Read the new brief, full script and actual recordings. Establish the topic and intended audience. Preserve supplied narration, order and meaning; do not silently trim, replace or reorder it.
2. Use `frontend-design` for a compact design plan and critique. Keep the palette, vector language, typography and caption-free hierarchy above; invent the subject-specific staging and actions. Plan against the actual audio duration, not this reference's scene count or timings.
3. Record a scene plan mapping each narration beat to visible content, action, resulting state and timing. Present new creative choices for review when requested; do not repeatedly ask for already established style preferences.
4. Use the existing Remotion setup for code-driven vector animation. Create isolated source, inputs and exports for the new project in the requested production workspace. Reuse appropriate components without importing phone-specific assumptions or altering completed projects.
5. Follow the production workspace's Graphify skill and query-first rules for code exploration and dependency changes. Update the relevant source graph after code changes. Local AST extraction is sufficient for routine maintenance; do not invent graph coverage or introduce semantic API costs without need.
6. Review representative portrait frames and a short animated preview before the full export. Check whether the animation actually explains the spoken idea, whether text is readable and whether motion has a purpose.
7. Verify the final video's dimensions, frame rate, duration, decoding and original narration placement. Review the hook, important actions and transitions from the encoded output. Save the final MP4, review assets and a project-specific production note.

A new project must render its own full animation. The reference video's packaging reuses an approved earlier body after frame 290; that is a project-specific optimization, not a reusable template assumption. Do not reuse its frames, voice, seven steps, timing file or 113-second duration for a new topic.

## Final design review

Before delivery, check that:

- The animation represents the sentence's action and context, rather than merely showing its main noun.
- The hook's stakes are visually clear and match the actual warning or promise.
- Device internals, camera moves and decorative technical graphics appear only when they explain the topic.
- Bottom narration captions are absent unless explicitly requested.
- Essential labels and UI remain legible, with clear identities and enough space around them.
- The light palette, vector outlines, blue emphasis and quiet branding match the approved reference.
- The story is adapted to the new idea and all supplied narration is preserved in its intended order.

Keep publishing manual unless the user explicitly authorizes it.
