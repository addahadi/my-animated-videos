# Plan: Is your phone listening to you?

- Promise: Your phone almost certainly isn't recording you for ads. It doesn't need to, because your location, your Wi-Fi, your activity and an AI model already predict what you want, and your brain does the rest.
- Audience: general | Length: 94.06 s (measured from the assembled narration; 2822 frames at 30 fps)
- Visual spine: **one case file around one phone.** The same generic phone with its shoe-ad feed opens the video, comes back in every clue, and closes it. The investigation is framed as "suspect, then clues, then case closed": the mic is suspect #1, ruled out, then four real clues (GPS, WiFi, AI, your brain) fill a case-file card that becomes the save frame. This matches the style's "report" look and gives the viewer one mental model: the evidence is all around the phone, not in the microphone.
- Hardest idea: an AI model predicting what you'll want → **scene 10, the only dark blueprint scene and the longest one (12 s)**. Behaviour chips (CLICK, VIDEO · 2s, BUY) fly into a glowing ModelBox, a "MILLIONS" stream of dots shows it learned from other people, and a ScaleBar output slides to "صبّاط 87%" (labelled EXAMPLE).
- Style: reuse `plans/style.md` as-is (light grid canvas, ink cards, stickers, blueprint for the mechanism). Header tag: `HOW IT WORKS · ADS`.

## Inputs and audio edit

- Script: `scripts/phone-listening.md`. Audio: `videos/phone-listening/inputs/audio1.ogg` to `audio12.ogg` (48 kHz mono, 102.0 s in total). Clips 1 to 10 are beats 1 to 10, **clip 11 holds beats 11 and 12** (the recap starts after the pause at 7.9 s), and clip 12 is beat 13. Every script line is present, in order.
- **Assembled narration master:** `videos/phone-listening/narration-master.wav`, 94.059 s. The originals are untouched. **No words were cut.** The only edits are to silence:
  - Leading and trailing dead air trimmed on every clip. Speech edges were found from RMS loudness (noise floor about −45 dB, speech above −30 dB), keeping 0.08 s before and 0.12 s after speech, with 20 ms fades on each cut. This removed 0.2 to 0.9 s per clip, including 0.9 s of silence before the hook.
  - Standard gap between beats: 0.15 s of silence (about 0.35 s from voice to voice).
  - Deliberate holds of extra silence: +0.45 s before beat 6 (the twist), +0.25 s before beat 7 (the mid-video question), +0.45 s before beat 12 (the recap, by splitting clip 11 at 8.0 s), +0.40 s before beat 13 (the closing line).
  - A 1.6 s silent tail for the end card (music only).
  - The exact edit list is in `narrationEdit` in the timeline JSON.
- Word anchors (the "~" times in the storyboard) come from pauses in the audio plus a rough local Whisper pass. Darija transcription is unreliable, so **check the anchors by ear** in Remotion Studio. They are accurate to about ±0.3 s; the scene boundaries sit on measured pauses and are exact.

## Cover frame
The generic phone at centre, its screen full of shoe AdCards. A large EarIcon beside it with a red "?" sticker. Cover text in heavy Tajawal across the upper content zone: **واش التيليفون يسمعك؟**. Light grid canvas, no header. It reads at grid size because there is one object, one icon and one line.

## Storyboard
Times are seconds on the assembled master. Visuals lead the voice by 0.2 to 0.4 s. The caption pill runs throughout once speech starts (2 to 4 words, word-by-word).

| # | In-Out (s) | Voiceover (Darija) | Representation (what and why) | Motion and build steps | On-screen text | SFX / music | Tool | Role |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.00-8.70 | هدرت مع صاحبك على صبّاط... وخمس دقايق من بعد، التيليفون عمّرلك الشاشة بالصبابط. صدفة؟ لا. يسمعك؟ حتى هي لا. | The relatable moment as one hero object: the phone flooded with shoe ads. The two ✕ stamps rule out both answers the viewer already has in mind. Readable muted. | 0.00 phone already on screen, 3 shoe AdCards sliding up (motion on frame 1) · 0.20 SpeechBubble "صبّاط" · 1.35 "+5 MIN" ValueTag · 2.90 4 more AdCards cascade · 4.70 ink sticker "صدفة؟" · 5.60 red ✕ stamp "لا" · 6.15 MicIcon + "يسمعك؟" · 7.95 second red ✕ over the mic | صدفة؟ لا. يسمعك؟ لا. | music starts low at 0; pop, pop, stamp, pop, stamp | Remotion | hook |
| 2 | 8.70-14.50 | كامل الناس يقولو الميكرو. تعالى نشوفو علاش الميكرو ماشي منطقي... والحقيقة أغرب من هكا. | The mic becomes "SUSPECT #1" in the case file. A locked "TRUTH" chip plants the open loop, visible until the recap. | 8.70 header + chapter pill "المشتبه فيه: الميكرو", phone shrinks left · 9.40 SUSPECT card with MicIcon · 11.20 "?" sticker · 12.30 LockedChip "TRUTH · LOCKED" drops in (stays through scene 11) · 13.60 lock wiggles on "أغرب" | الحقيقة أغرب | whoosh, pop, lock click | Remotion | open loop |
| 3 | 14.50-21.37 | أولا، لو كان التيليفون يسجّل كلامك نهار كامل ويبعثو لـ server، الباتري تفرغ بالزربة، والـ data نتاعك تطير. | Cause and effect: a constant audio upload would visibly drain the battery and data. Makes "it would be noticed" concrete. | 14.60 phone ↔ NodeBox SERVER with a FlowArrow · 16.00 sound-wave chips stream · 17.70 server glows · 19.00 battery tag drains 100% → 9%, turns red · 20.00 DATA counter spins up · 20.80 red stamp "ماشي منطقي" | MIC 24/7 = باتري فارغة | whoosh, soft tick loop, stamp | Remotion | explain |
| 4 | 21.37-26.33 | وزيد، Android و iPhone دروك يحطولك نقطة صغيرة ملونة فوق الشاشة، كل ما يكون الميكرو خدام. | Zoom into a generic status bar to show the real indicator. Proof the viewer can check on their own phone. | 21.40 enlarged status-bar card ("9:41", signal, battery; no OS logos) · 23.60 green dot pulses · 24.30 ring + arrow · 25.20 green sticker "MIC ON" | النقطة = الميكرو خدام | zoom, pop | Remotion | explain |
| 5 | 26.33-36.00 | وفي 2018، باحثين في جامعة أمريكية جربو أكثر من 17 ألف application. ما لقاوش ولا وحدة تبعث صوتك في الخفية. ماشي مستحيل، بصح ما كاين حتى دليل. | Scale and number: a grid of apps that fills up so "17,000" is felt, then one big "0". The honest nuance ("not impossible, but no evidence") is shown as a value being replaced, not hidden. | 26.40 "2018" tag + "UNIVERSITY STUDY" · 28.00 AppGrid fills row by row · 29.45 counter → "17,000+" · 30.50 ScanLine sweeps · 31.50 result card "AUDIO LEAKS: 0" (green) · 33.10 "مستحيل؟" fades · 34.50 "ما كاين حتى دليل" pops in full ink · hold 0.4 s | +17,000 APP → 0 | pop, counter ticks, scan, pop, pop | Remotion | explain |
| 6 | 36.00-41.47 | بصح لقاو حاجة أخرى: تطبيقات كانت تصوّر واش يصرا في الشاشة نتاعك وتبعثو لشركة أخرى. | The twist and the share moment: the real leak was the screen, not the mic. Screenshots physically fly to a third party. | 36.00 hard cut on the pause, grid returns dimmed · 36.90 one icon turns red and lifts out, red sticker "حاجة أخرى" · 38.35 screenshots peel off with a shutter flash · 39.70 they fly to NodeBox "THIRD PARTY" · 40.60 red tag "SCREEN → 3RD PARTY" | تصوّر الشاشة | low hit, shutter ×2, whoosh | Remotion | aha |
| 7 | 41.47-46.07 | إذن كيفاش عرف بلي راك حاب تشري صبّاط؟ ما يحتاجش يسمعك. يكفي يشوفك. | Re-hook at the halfway point. The hook's shoe ad returns; the ear morphs into an eye, the visual thesis of the second half. | 41.50 shoe AdCard returns with a big "?" · 43.40 EarIcon · 44.50 red strike on the ear · 45.40 ear morphs into EyeIcon, yellow ring | ما يسمعكش... يشوفك | whoosh, stamp, morph | Remotion | open loop |
| 8 | 46.07-50.53 | الـ GPS نتاع التيليفون يعرف بلي فت قدام حانوت صبابط، ولا قعدت ربع ساعة في المول. | Clue 1, location: a pin walking on a flat map makes GPS tracking visible. | 46.10 MapCard, pin drops · 46.60 pin walks · 48.30 stops at "SHOE SHOP" (yellow) · 49.40 "15 MIN" ring fills · 50.00 "MALL" outline + yellow "LOCATION" tag | الموقع | pop, soft steps, pop | Remotion | explain |
| 9 | 50.53-59.20 | وصاحبك اللي هدرت معاه، حوّس على صبابط في الـ internet... وأنتوما مربوطين في نفس الـ WiFi. بشكل مبسط، بالنسبة للإعلانات، نفس الـ WiFi معناه نفس الدار، ونفس الاهتمامات. | Clue 2, the shared network: two phones under one WiFi icon, a house outline drawn around them, and the friend's interest copied to you. The "بشكل مبسط" sticker keeps it honest. | 50.60 YOU and FRIEND phones · 51.40 friend's search bar types "shoes" · 53.20 WifiIcon + arcs · 54.50 sticker "بشكل مبسط" · 56.40 dashed HouseOutline draws (done by ~57.9) · 58.20 yellow "SHOES" tag copies to your phone | نفس الـ WiFi = نفس الدار | pop, typing, pop, draw, pop | Remotion | explain |
| 10 | 59.20-71.33 | وزيد كل click، كل vidéo وقفت عليها جوج ثواني، كل حاجة شريتها... كلش يدخل في model نتاع AI، يعني برنامج تعلّم من ملايين الناس. وخدمتو وحدة: يتوقع واش راح تحب، قبل ما تعرف أنت. | Clue 3, the hardest idea, on the dark blueprint: behaviour becomes input chips, the model is a box that learned from millions, and the prediction is a measured bar. "Model" gets its plain-word label as it is spoken. | 59.20 scan into blueprint, glowing ModelBox · 59.60 chip CLICK · 60.40 chip VIDEO · 2s · 62.60 chip BUY · 63.60 box glows mint · 64.80 TermLabel "MODEL = برنامج تعلّم" · 66.80 "MILLIONS" dots stream in · 68.20 ScaleBar "PREDICTION" · 68.90 marker to "صبّاط 87%" + "EXAMPLE" · 70.10 yellow bracket "قبل ما تعرف" | AI يتوقع قبل ما تعرف | scan, pop ×3, low hum, whoosh, hit | Remotion | aha |
| 11 | 71.33-79.70 | والحاجة الأخيرة... راهي في مخك. الإعلانات نتاع الصبابط كانو قدامك من قبل، بصح ما كنتش تلاحظهم. كي هدرت عليهم، مخك ولّى يشوفهم في كل بلاصة. | Clue 4, the like/aha moment: the same feed, where shoe ads were always there but faded, all light up at once when the brain "switches on". | 71.35 feed scrolls, shoe ads faded · 72.40 BrainIcon · 73.60 mono tag "ALREADY THERE" · 75.70 sticker "ما لاحظتهمش" · 76.90 brain lights · 77.40 all shoe ads turn full colour with yellow outlines · 78.50 pulses · 0.4 s hold | كانو قدامك من قبل | whoosh, pop, pop, glow swell | Remotion | aha |
| 12 | 79.70-88.20 | إذن الخلاصة: التيليفون ما يسمعكش. يعرف وين رحت، مع من كنت، وواش شفت. ما يحتاجش يتجسس عليك... خاطر يعرفك مليح بلا ما يسمعك. | Case closed: the TRUTH chip unlocks and the case-file MiniUI builds one row per spoken clue. It is the save frame, then the closing line lands over it. | 79.70 chip unlocks, MiniUI "CASE FILE" opens · 80.80 row: mic struck in red "ما يسمعكش" · 81.70 row: pin "وين رحت · GPS" · 82.70 row: WiFi "مع من كنت · WIFI" · 83.70 row: eye "واش شفت · AI" (gold row) · **84.00 to 86.60 full card held (2.6 s save frame)** · 86.50 card dims, "يعرفك... بلا ما يسمعك" types large · 87.40 ear fades out | يعرفك... بلا ما يسمعك | unlock, pop ×4, music lifts slightly | Remotion | recap / save frame |
| 13 | 88.20-94.07 | وإذا حبيت تعرف كيفاش تنقص هاد الـ tracking، كتبلي part 2 في الكومنتار. | End card: the hook's phone and feed return (loop), wordmark, and one call to action, a comment for Part 2. | 88.20 clean canvas, phone + shoe feed · 88.80 red stamp "EXPLAINED" · 89.40 wordmark "Runtime.tech" + ScanLine + "TECH · EXPLAINED SIMPLY" · 90.30 comment bubble "PART 2?" · 91.00 dark button "كتبلي PART 2 ←" · 92.46 voice ends, 1.6 s hold | كتبلي PART 2 | whoosh, stamp, scan, pop; music fades out over the last 1.6 s | Remotion | CTA |

## Engagement map
- **Hook (0-2s):** frame 1 is already the phone full of shoe ads, with motion and no intro. The "صبّاط" bubble lands at 0.2 s. Readable muted.
- **Open loops:** (1) the two ✕ stamps at 5.6 and 7.95 s ("then how?"); (2) the "TRUTH · LOCKED" chip from 12.3 s, visible until it unlocks at 79.7 s; (3) the "?" on the shoe ad at 41.5 s.
- **Re-hooks:** 8.7 s (suspect), 36.0 s (twist after a hard cut on a pause), 41.5 s (mid-video question), and each "دليل 1 to 4" chapter pill at 46, 50.5, 59 and 71 s.
- **Save frame:** the case-file MiniUI in scene 12: four rows (mic ✕, GPS, WiFi, AI), held complete for 2.6 s (84.0 to 86.6).
- **Comment prompt:** "كتبلي part 2" on the end card, plus the pinned comment from the script kit (what did you talk about that showed up in ads?).
- **Share moment:** scene 6 (apps recorded the screen, not the mic) and scene 9 ("your friend's search follows you"), the line people send to the friend they were talking to.
- **Follow CTA:** no separate follow ask (one CTA per video). The end card's "PART 2" series tease gives the reason to follow. The button reads "كتبلي PART 2".
- **Loop ending:** the last frame is the hook's phone with the same shoe-ad feed, so the replay from frame 1 is seamless.

## Retention check
- 83 planned visual events in 94 s: one every 1.1 s on average, 6 to 10 per 10 s window. The style target is at least one every 3 s.
- Longest static stretch: 2.5 s (84.0 to 86.5, the intentional save-frame hold). Next longest: 2.2 s (60.4 to 62.6 and 21.4 to 23.6). All are under 6 s, and under the style's 5 s limit.

## Components and assets
`src/` does not exist yet in this workspace, so every shared component is new. All are designed to be reused (phones, ads, nodes and icons will come back in most "how it works" videos).

| Name | New / existing | Used in scenes | Effort |
|------|----------------|----------------|--------|
| `GridCanvas` (light/dark), `HeaderStrip`, `ChapterPill`, `CaptionPill` | new (style.md core) | all | M |
| `Card`, `StickerPill`, `ValueTag`, `Stamp`, `ScanLine` | new (style.md core) | all | M |
| `DeviceMock` (generic phone) + `AdCard` + `PhoneFeed` (scrolling stack of AdCards, faded/full states) | new | 1, 2, 3, 7, 9, 11, 13 | M |
| `NodeBox`, `FlowArrow`, `PacketChip` (style.md CS extension) | new | 3, 6, 10 | M |
| `IconSet` (mic, ear, eye, pin, wifi, house, battery, lock, brain, comment, shutter): flat, 3 px ink stroke | new | all | M |
| `SpeechBubble` | new | 1 | S |
| `LockedChip` (locked/unlocked states) | new | 2 to 12 | S |
| `StatusBar` + `IndicatorDot` | new | 4 | S |
| `AppGrid` + `CounterTag` | new | 5, 6 | M |
| `MapCard` + walking `LocationPin` + `RingTimer` | new | 8 | M |
| `SearchBar` (typing), `WifiArcs`, `HouseOutline` (dashed path draw) | new | 9 | M |
| `ModelBox` (blueprint glow) + `ScaleBar` + `TermLabel` + particle stream | new | 10 | L |
| `MiniUI` (case-file rows, highlighted row) | new | 12 | M |
| `EndCard` | new | 13 | S |
| Music bed (royalty-free, calm, about 90 to 100 BPM) | **missing**: none in the workspace | all | asset |
| SFX: pop, stamp, whoosh, tick, scan, shutter, typing, unlock, hit, glow | **missing**: `public/sfx/` does not exist yet | all | asset |

## Build order
1. Copy `narration-master.wav` to `public/phone-listening/`. Write `captions.srt` from the script text, using the scene timings and the pauses for word timing. Wire up `CaptionPill` and the audio, then check sync by ear.
2. Theme and core components from `plans/style.md` (`GridCanvas`, `Card`, `StickerPill`, `Stamp`, `HeaderStrip`, `ChapterPill`). Check one Arabic caption and one Arabic card in the first still.
3. Scene 1 (hook) with `DeviceMock`, `PhoneFeed` and `AdCard`.
4. Scenes 12 and 13 (save frame and end card); they reuse the hook's phone.
5. Scene 10 (blueprint, the hardest idea).
6. Middle scenes 2 to 9 and 11, reusing the components.
7. SFX and music mix (voice always loudest; music ducked 18 to 22 dB), then stills against the look-alike checklist, then the preview and the final render to `out/`.

## MVP fallback
- Scene 8: a static map with the pin already at the shop; only the "15 MIN" ring and the tags animate.
- Scene 9: drop the typing animation (the search bar appears with "shoes"); keep the WiFi arcs and the house outline, because they carry the idea.
- Scene 10: replace the particle stream with a static "MILLIONS" tag; keep the chips → box → ScaleBar order.
- Scene 5: the AppGrid as a static block that a ScanLine sweeps, instead of filling row by row.
- Never simplify: the hook (scene 1), the save frame (scene 12), or the progressive build in scene 10.

## Script feedback
- None. Every line works with visual fixes, so nothing needs re-recording. (Clip 11 holding two beats was handled by splitting it at the 8.0 s pause.)

## Risks
- **Facts still marked [VERIFY] in the script are now recorded:** the 2018 study's "more than 17,000 apps" (I recall 17,260), its finding of no secret audio and of screen recordings sent to a third party, and the mic indicator on recent iOS/Android. Confirm them before publishing. If the number turns out different, the voice line would need a re-record; the on-screen counter can follow the verified figure.
- **The indicator colour:** iOS shows an orange dot for the mic and Android shows green. The plan uses one green dot (accurate for Android, and green already means "proof" in this video). Optionally add a small orange twin dot.
- **Clip 12's last word** ("الكومنتار") runs to the very end of the file (the loudness is still about −26 dB in the last 50 ms). Listen to check that the word isn't clipped; if it is, re-record only that final sentence.
- **Colour meanings, fixed for the whole video:** red = the mic theory / privacy warning (✕ stamps, screen leak), green = proof or safe (the indicator dot, "0 leaks"), yellow = a real clue (location, shared interest, prediction bracket, highlighted ads), blue = icons inside mini-UI cards, and mint = the AI output on the dark canvas.
- **Arabic/bidi:** mixed lines such as "دليل 3 · AI", "MODEL = برنامج تعلّم" and "كتبلي PART 2" must be tested early. Every scene is Remotion, with no Manim, so there is no Arabic-shaping risk.
- **Missing assets:** the music bed and the SFX library don't exist in the workspace yet. Supply royalty-free files, or the builder generates simple synthesised SFX and renders without music, and flags that in the build notes.
- **No real brands:** use generic phones, apps, a generic "SHOE SHOP" and a generic "THIRD PARTY" box. The study's university is not named on screen.
