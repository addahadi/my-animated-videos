# Runtime.tech — phone slowdown visual system

## Relationship to the shared guide
Reuse `../../../plans/style.md` for typography, portrait safe zones, vector construction, voice-first mixing and motion timing. Keep this video's existing brief's light neutral canvas and blue emphasis as a project-local palette adaptation. The shared guide's CAPTCHA request/automation color meanings do not apply to a phone. Do not change the shared guide or other projects. This is a planning direction, not a request to switch to Design 2.

## Canvas and safe zones
- 1080 × 1920, 30 fps. Essential content stays inside x=90–900, y=270–1420. Leave the top 250 px, bottom 450 px and rightmost 180 px free of essential content.
- Headline y=285–440; persistent phone/diagram y=490–1140; short supporting phrase y=1210–1400. Main anchor approximately x=495, y=820. Keep the phone fully inside the safe zone.
- At most three major objects active at once. Recap cards are introduced one by one before settling into a four-item 2×2 grid.

## Palette and meaning
| Token | Hex | Meaning |
|---|---|---|
| background | #F4F6FA | neutral canvas |
| surface | #FFFFFF | phone UI and explanatory panels |
| ink | #171A20 | outlines and Arabic text |
| muted | #596273 | secondary labels |
| line | #D4DAE4 | nonsemantic dividers and inactive objects |
| primary | #1976D2 | active processing, demand and real power flow |
| secondary | #7764B8 | app features and workload blocks only |
| warning | #E5A515 | uncertainty, constrained supply and thermal warnings |

Never use yellow as a verdict of deception. A solid labeled connector shows an established technical mechanism; a dotted connector ending in `?` shows an inference not established by this video. Color is always reinforced by shapes or labels.

## Typography and Arabic
- Reuse Noto Sans Arabic 700 and Manrope 600–700. Existing candidates: `../../vulhunter-skill/public/fonts/Arabic.ttf` and `Latin.ttf`, with adjacent OFL license files. Copy into this project's future render assets; do not change the source files. Confirm font metadata at build time.
- Headings 80–88 px; keywords 64–72 px; diagram labels 48–56 px. Arabic line-height 1.5. Two lines maximum; wrap rather than shrink.
- Use HTML/CSS `dir="rtl"`; Latin terms Apple, iPhone, CPU and RAM in isolated `<bdi dir="ltr">` nodes. Render Arabic labels in Remotion, not as SVG text.
- Use useful keywords and short phrases, not full narration subtitles. This follows the workspace preference over the skill's general caption default.

## Visual spine and components
- One recognizable older phone: white screen, near-black rounded outline, small blue case tab. Keep this silhouette and screen anchor throughout the story. Show the new phone only as the ad comparison and disputed purchase inference.
- Camera delay, history card, battery explanation and final diagnostics are drawers/modules of this same phone. Hardware cutaway is only used to explain the battery–processor relationship.
- Charge is a fill inside the battery silhouette. Battery aging is a separate wear badge. Available peak power is a horizontal capacity bar. Demand is a moving marker on that bar; task completion is a queue of blocks. Do not collapse these into one gauge.
- The water analogy lives in an inset attached to the same phone for the spoken comparison, then collapses back. It explains available delivery rate, not literal water inside a phone or a complete electrical model.
- Reusable building blocks: PhoneShell, CameraDelay, LaunchAd, HistoryDisclosure, PowerBudget, TapFlowInset, TaskQueue, DiagnosticDrawer, FactVsInference and SummaryGrid.

## Motion
- Ease-out cubic: `1-(1-t)^3`. Enter 9 frames with 18 px translation and opacity; meaningful move/morph 15 frames; exit 6 frames; emphasis pulse 6 frames at scale 1.04.
- Prepare an illustrative object 9 frames before its provisional spoken anchor, only after the voice has established the context. Emphasis lands on the anchor. Reveal conclusions and dates on the spoken anchor, without a preview that spoils the reveal.
- Cut on existing breaths; retain all narration and pauses. No new silence, time stretch or removed words. Stable camera; use panel transforms rather than decorative zooms.
- Progressively add every multi-part diagram. During the final save frame, preserve a readable composition while highlighting one row at a time.

## Audio and branding
- Use the assembled original narration end-to-end. No AI voice or text-to-speech substitutions.
- Music omitted by default. If later chosen, use a documented licensed track approximately 18–22 dB below the voice and duck further on the hook and Apple reveal.
- Sparse original/synthesized soft click, reveal tick and relay-down SFX; no sound on every word, no alarming crash noise. SFX are optional, and voice remains dominant.
- Quiet Runtime.tech mark after the hook, 34–40 px, at x=100–360/y=280; never a logo intro. The wordmark is nonessential decorative branding.
