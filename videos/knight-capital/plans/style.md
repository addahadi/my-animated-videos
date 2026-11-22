# Runtime.tech — Knight Capital style

Inherit the existing workspace [visual system](../../../plans/style.md). This file defines the topic-specific meanings; it does not change other videos. Reuse its dark canvas, fonts, motion, safe zones and short-keyword policy. The earlier light-canvas idea in the script was provisional; no Design 2 selection was requested.

| Token | Hex | Meaning in this video |
|---|---|---|
| background | #101015 | canvas |
| panel | #191920 | software and server-card surfaces |
| line | #55515F | neutral connections and version outlines |
| text | #F5F3ED | ordinary labels |
| muted | #C1BDC8 | inactive/context labels |
| primary | #91B6FA | trading orders, including orders that become erroneous |
| secondary | #B8A1EE | software activation signal only |
| warning | #F2A65A | missing update, fault outline, rising risk |

Old and new versions use written badges and shapes, not primary/secondary colors. An erroneous order keeps its blue fill and gains an orange fault outline. BUY and SELL use text labels, never a red/green trading-color shorthand. Highlight completion with a neutral white check. Counter text remains neutral; warning color always marks the failure/risk, not a second unrelated concept.

## Typography and safe zones

- Arabic: existing Noto Sans Arabic 700 candidate `../../vulhunter-skill/public/fonts/Arabic.ttf`; Latin: existing Manrope candidate `../../vulhunter-skill/public/fonts/Latin.ttf`. Confirm font metadata when loading; copy fonts with adjacent OFL files only at build time.
- Headlines 80px, short phrases 68px, diagram labels 50–54px, numerals 100–120px. Arabic line height 1.5. No essential label below 48px. Two headline lines maximum.
- Use RTL HTML containers and isolate Latin terms/numbers with LTR `bdi`; test `الـ server الثامن` and `الخسارة الأولية: $440 مليون` before rendering.
- Critical content x=90–900, y=270–1420. Headline y=285–460, diagram y=510–1120, phrase y=1190–1400. Reserve top 250px, bottom 450px and right 180px for app UI. No full narration captions.
- Fleet layout: two columns of four cards, x=90/515, y=590/720/850/980; card 345×104px. Never introduce all eight at once. Inactive cards dim to 45%; focus on one or two active paths. Full comparison uses two 345px panels, not eight tiny code windows.

## Motion and illustration

- Reusable vector 2D, 4px strokes, 24px corner radius. Servers are logical computer/software cards; no hardware cutaways or pseudo-realistic interiors.
- Opacity plus 18px entry in 9 frames; moves/morphs 15 frames; exit 6 frames. Ease out cubic. Emphasis 6 frames at scale 1.04, then settle; avoid repeated bouncing.
- Stable camera; recompose cards between layouts over 15 frames. Preserve server numbers and order path identity across all scenes. Build complex diagrams one object per spoken idea.
- Illustrative object onsets lead matched words by 9 frames (0.3s) once the sentence has established the concept. Hits land on the word. Dates, figures and answers wait for their spoken setup. Planned cue times are provisional.
- Frame one already contains meaningful motion. Preserve original silence; use its pauses for reveals, without adding or removing audio. No logo intro. Quiet Runtime.tech mark from the explanation onward.

## Audio

Creator narration stays primary. Music is optional and off until a licensed track is selected. If used, keep it about 18–22dB below the voice and listen to the mix. SFX are sparse, locally synthesized or documented licensed clicks/soft impacts; no alarms under the explanation.
