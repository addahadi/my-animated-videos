# Claude DZ: visual system

Status: proposed reusable baseline for the CAPTCHA video and future plans; existing videos are unchanged.

## Canvas and layout
- 1080 × 1920, 30 fps, portrait. All critical material inside x=90–900 and y=270–1420.
- Headline: y=285–460. Main diagram: y=500–1140. Short phrase: y=1190–1400.
- Rightmost 180 px, top 250 px and bottom 450 px stay free of essential information.
- Use stacked paths in portrait, maximum three major objects visible at once; add further objects progressively and dim inactive ones.

## Palette and meanings
| Token | Hex | Meaning |
|---|---|---|
| background | #101015 | canvas |
| panel | #191920 | browser and diagram surfaces |
| line | #55515F | nonsemantic connectors and borders |
| text | #F5F3ED | labels and ordinary content |
| muted | #C1BDC8 | supporting labels |
| primary | #91B6FA | ordinary visitor request |
| secondary | #B8A1EE | automated source and its requests, not inherently malicious |
| warning | #F2A65A | scrutiny, uncertainty, or abusive use markers |

Do not change a request's source color when it passes a check. Passing is not proof of humanity. Checkpoint structure is neutral white. Traffic signals can use literal real-world colors inside the illustrations only; those colors do not define UI states. Reinforce color with shapes and labels.

## Typography
- Arabic: Noto Sans Arabic, 700, locally available candidate `videos/vulhunter-skill/public/fonts/Arabic.ttf`; Latin: Manrope, 600–700, candidate `videos/vulhunter-skill/public/fonts/Latin.ttf`.
- Copy fonts and their adjacent OFL license files into each built project's assets; source videos remain unchanged. Font family metadata must be checked when loading.
- Headings 76–88 px; phrase captions 64–72 px; diagram labels 48–56 px; Arabic line height 1.45–1.6.
- Headlines and supporting phrases use 3–6 words. Two lines maximum; do not shrink below minimum sizes to fit.
- Arabic containers use `dir="rtl"`; Latin terms and K7M2 input use `<bdi dir="ltr">`. Test “أنظمة كيما reCAPTCHA v3” before building scenes.
- Short keywords and phrases only. Highlight the active keyword with the narration; full word-for-word subtitles are outside the current scope.

## Motion and illustration
- Vector 2D illustrations: simple filled shapes, rounded corners 20–28 px, consistent 4 px strokes, no photorealistic cutaways.
- Enter: 15–24 px rise plus opacity, 9 frames. Move/morph: 15 frames. Exit: 6 frames. Ease out cubic `1-(1-t)^3`.
- Emphasis: 6-frame pulse at 1.04 scale; no repeated bouncing or decorative motion used to hide a static explanation.
- Make meaningful changes every 3–6 s: new object, changed state, zoom to cause/effect, or an active label. More than two diagram objects must build one at a time.
- Prepare illustrative objects about 9 frames before their spoken word after the sentence sets them up. Pulse on the word itself.
- Cut on pauses and retain narration. No inserted silence or omitted words.

## Reusable elements
- `BrowserWindow`, `SiteCheckpoint`, `RequestCard`, `TermLabel`, `PhraseCaption`, `SummaryFrame`.
- The neutral checkpoint stays at the same visual anchor and changes modules (image, text, background assessment).
- Labels describe operations rather than certifying “human.” Automated sources use a violet stacked-card icon; ordinary requests use blue single cards.
- A discreet Claude DZ wordmark may sit in the header after the hook; no logo intro and no extra CTA end card.

## Audio
- Creator's supplied voice remains the loudest element. Music is optional and omitted by default until a licensed track is chosen.
- If used, soft instrumental bed sits approximately 18–22 dB below the narration, ducked further during quiet phrases; assess by listening rather than gain numbers alone.
- Quiet clicks/reveals at selected transitions only; do not add a sound for every word. Prefer locally synthesized clicks or documented licensed assets.

