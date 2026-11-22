# Plan: تليفونك ثقال… V2 (new hook, Runtime.tech style)

- Promise: Phones have been slowed on purpose (Apple, 2017, fined for not telling people), but a slow phone alone does not prove anyone wants you to buy a new one. Check the cause first.
- Audience: general | Length: 93.96 s (measured: 91.96 s of narration plus a 2.0 s end-card tail). V1 was 106.15 s.
- Visual spine: **your phone, with a hanging tag.** One generic phone, drawn the same way all the way through. In the hook its tag says `EUR 25M · FINE`, then flips to `YOUR PHONE · 2 YEARS`. Every cause of slowness is shown on or next to this same phone. A **diagnosis list** fills one row per cause (BATTERY, APPS, STORAGE, HEAT) and becomes the recap, then the save frame. One phone and one list, so the viewer builds one model: same lag, different causes.
- Hardest idea: "a charged battery can still fail to deliver enough power at once." Visual: on the dark blueprint, two separate meters side by side. CHARGE is a tank at 80% (it's full enough). POWER is a `ScaleBar` where the NEEDED marker sits above what the battery can push, with the yellow delta bracket showing the gap. The tap analogy follows: a full tank, the tap wide open, only a thin stream. The next scene closes the bracket by turning the CPU dial down.
- Style: reuse `plans/style.md` (light grid canvas for the story and the other causes, dark blueprint for the battery mechanism, scenes 6 and 7). The old V1 "Design 2" look is not used.

**Color meanings (one meaning each, for the whole video)**
- red: slowdown and its penalty (SLOWED sticker, the fine, stamps, overload, "HEAVY")
- green: the phone keeps working / a fix that helps (ON, FASTER, SAVE MONEY, the "yes, in some cases" check)
- yellow: ink-on-yellow highlight tags only
- blue: neutral icons inside mini UI cards
- dark: mint = power the battery can deliver; delta-yellow = gap between power needed and power delivered

**Naming Apple.** The narration says "Apple". It appears only in the captions, because captions follow the voice. On-screen labels use `CASE · 2017`, `FRANCE · 2020`, `USA · SETTLEMENTS`. No logos and no iPhone drawings: the phones are generic `DeviceMock`s. The EUR 25M figure is the 2020 French DGCCRF penalty (source already in the V1 script). It is shown on screen but not spoken.

## Narration edit
The narration master is `videos/phone-slowdown-on-purpose/v2/narration-master.wav`, built by `v2/make_master.py` from:
1. `inputs/audio_2026-11-15_20-01-11.ogg`, the new intro. It **replaces** V1's audio1 to audio3 (script beats 1 to 3).
2. `inputs/audio4.ogg` to `audio10.ogg`, unchanged, in numeric order.

The originals are not touched. Only the silence before and after each clip was trimmed (the longest was 0.85 s at the start of the intro). The clips are joined with 0.25 s gaps, and 2.0 s of silence is added for the end card. No words were cut or reordered, and the pauses inside each clip are kept, including the intended 0.53 s pause after «بلا ما تقولهم». Each clip's in and out points are in `narrationEdit` in the timeline.

Event times come from pause detection (RMS on 10 ms windows) plus a draft ASR for word positions. **Check them by ear** before animating.

## Cover frame
Light canvas. The generic phone, big and centered, with a hanging `ValueTag` reading `EUR 25M` and `FINE · SLOWED PHONES` under it. On the screen, a speed bar sits almost empty, in red. A red `Stamp` reads «بلا ما يقولو», tilted over the lower corner of the phone. Cover text above, in Tajawal 800: **غرامة… على التبطئة**.

## Storyboard
Times are on the master track. "→" marks progressive steps. Visuals land 0.2 to 0.4 s before their word.

| # | In-Out (s) | Voiceover (Darija) | Representation (what and why) | Motion and build steps | On-screen text | SFX / music | Tool | Role |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.00-3.95 | Apple خلّصت غرامة… على خاطر ثقّلت تليفونات الناس بلا ما تقولهم. | **A phone with a fine hanging on it.** Muted, it still reads: a phone, a big price tag "EUR 25M", a speed bar draining, "they didn't tell". No header (hook). | Frame 0: phone is already sliding up, tag string swinging. → 0.65 `ValueTag` "EUR 25M / FINE · FRANCE" drops and swings (on «غرامة» 0.93). → 1.9 on-screen speed bar drains, red `StickerPill` "SLOWED" pops (on «ثقّلت»). → 3.0 red `Stamp` «بلا ما يقولو» slams. → 3.69 hold during the pause. | غرامة… على التبطئة | whoosh at 0, pop at tag, stamp at 3.0. Music starts at 0, ducked -20 dB | Remotion | hook |
| 2 | 3.95-7.07 | وانت؟ تفتح الكاميرا، تستنى… واللقطة تفوت. | **Turn to the viewer.** Same phone, the tag flips to theirs. The camera moment is the shared frustration, in 3 seconds. | 3.95 the stamp falls off, tag flips to "YOUR PHONE · 2 YEARS" (on «وانت؟» 4.22). → 4.75 camera viewfinder opens, spinner turns. → 5.6 a ball is visible in the frame, still loading. → 6.3 the ball flies out, the preview loads empty, red sticker "MISSED". | اللقطة فاتت | whoosh, tick loop, bloop on «تفوت» | Remotion | hook |
| 3 | 7.07-11.36 | زعما حتى تليفونك ثقّلوه؟ نبداو بواش دارت Apple في 2017. | **The open loop.** A locked verdict chip next to the phone, answered in scene 11. | 6.95 `LockedChip` "VERDICT · LOCKED" + "؟" pops (before «زعما» 7.22). → 9.0 (pause) `HeaderStrip` `CASE · PHONE SLOWDOWN` and `ChapterPill` «القضية» arrive; ink sticker "2017" types in. → 10.3 phone slides left, the case card rises. | واش صرا في 2017؟ | pop, lock click, whoosh | Remotion | open loop |
| 4 | 11.36-21.98 | كانت تنقّص الأداء تاع بعض iPhone القدام كي تضعف البطارية تاعهم. والمشكل؟ ما وضّحتش هذا للناس مليح. ومن بعد، خلّصت غرامة في فرنسا، ودارت تسويات قضايا في أمريكا. | **The evidence stack.** Only some old phones (weak battery) are slowed, then three case cards fan in, one per claim. | 11.3 three generic old phones; only the two with a weak-battery icon get red "SLOWED". → 15.3 (pause) `NotifCard` 1: «ما وضّحتش» + red `Stamp` "NOT TOLD". → 18.6 (pause) card 2 "FRANCE · 2020", the EUR 25M tag from the hook swings back in (payoff). → 20.8 card 3 "USA · SETTLEMENTS". | بطّأتهم… بلا ما توضّح | pop per card, stamp at 15.9 | Remotion | explain / re-hook (~19 s) |
| 5 | 21.98-30.87 | الناس حسّو بلي تخدعو. بصح Apple قالت: درنا هكّا باش التليفون ما يطفاش فجأة. وهنا لازم نفهمو حاجة: البطارية كي تقدّم، ماشي غير تولّي تفرغ بالخف. | **Two sides, then the turn to the real question.** A red bubble (people) against an ink bubble (the explanation). | 21.95 red `SpeechBubble` «تخدعنا!». → 23.4 (pause) ink bubble «باش ما يطفاش فجأة». → 25.6 the phone screen blinks off and back on once. → 26.6 (pause) bubbles dim, `ChapterPill` «البطارية». → 28.2 a battery card ages "NEW" → "2 YEARS" and drains quickly (on «تفرغ بالخف»). | علاش ينقّص السرعة أصلاً؟ | pop, pop, click on blink, whoosh | Remotion | explain |
| 6 | 30.87-39.60 | تقدر تكون مشحونة، بصح ما تقدرش تمدّ الطاقة بالسرعة اللي يحتاجها التليفون. كيما روبيني: الماء كاين، بصح كي تحتاج دفعة كبيرة، ما يخرجش كفاية. | **Hardest idea, on the blueprint.** CHARGE and POWER as two separate meters, so "charged" and "can deliver" are visibly different things. Then the tap analogy. | 30.9 hard cut to dark, `ChapterPill` "CHARGE ≠ POWER" with glow. → 31.0 left: mint tank 80% labelled «مشحونة». → 32.6 right: `ScaleBar` POWER; the NEEDED marker jumps high, the supply stops short, yellow delta bracket. → 35.0 (pause) tap inset slides in. → 36.2 "الماء كاين" on the full tank. → 37.6 the tap opens wide, only a thin stream, same yellow bracket. | الشحن وحدو ما يكفيش | whoosh into dark, tick, pop, short water sound | Remotion | aha |
| 7 | 39.60-49.91 | كي البطارية تعجز تمدّ الطاقة المطلوبة، التليفون يقدر يطفى. الحل؟ النظام ينقّص سرعة المعالج، اللي ينفّذ الخدمة داخل التليفون. يستهلك أقل، ويخدم أبطأ، بصح يبقى شاعل. | **Cause and effect on the same meter.** The CPU dial is the fix: lowering speed lowers demand until it fits. | 39.7 the tap leaves; NEEDED turns red and blinks. → 41.8 phone screen goes black 0.4 s (on «يطفى»). → 43.0 (pause) "؟" then `TermLabel` "CPU = المعالج". → 44.3 speed dial turns 100% → 70%. → 45.6 NEEDED slides under the supply, the bracket closes. → 47.2 (pause) tags «يستهلك أقل» (mint) / «أبطأ» (red); the screen turns on, green "ON". | سرعة أقل، طاقة أقل | tick, bloop at shutdown, pop, ding on ON | Remotion | explain |
| 8 | 49.91-58.95 | بصح ماشي كل تليفون ثقيل عندو هاذ المشكل. كاين تطبيقات تزيد فيها ميزات مع التحديثات، وتولّي تحتاج خدمة أكثر من المعالج، ومساحة أكبر في الذاكرة. | **Cause 2: apps grow.** Back to light. The battery story shrinks into diagnosis row 1. A generic app gains features one by one. | 49.9 light canvas, `ChapterPill` «سبب 2 · التطبيقات»; the blueprint shrinks into row 1 "BATTERY". → 50.6 a small red `XStamp`: not every slow phone. → 52.0 app card "v1.0" → "v5.0", chips VIDEO, FILTERS, AI snap on ~0.6 s apart. → 54.6 CPU WORK bar grows. → 57.9 RAM tray fills with blocks; `TermLabel` "RAM = الذاكرة". | التطبيقات تطلب خدمة أكثر | whoosh, pop per chip | Remotion | re-hook (~50 s) / explain |
| 9 | 58.95-70.12 | والتليفون تاعك؟ بقى بنفس الإمكانيات. نفس الجهاز، بصح الخدمة زادت عليه. لهذا تطبيق كان يخدم عندك خفيف يقدر يولّي ثقيل. وماشي كل تحديث يدير هكّا؛ كاين تحديثات فعلاً تزيد الأداء. | **Same phone, more work.** A fixed box on your phone that overflows. Then an honest counterexample: some updates make it faster. | 58.9 your phone (as in the hook) with a capacity box, tag "SAME PHONE". → 60.4 task blocks drop in one by one and overflow (on «الخدمة زادت»). → 63.4 (pause) app weight tag "LIGHT" → red "HEAVY". → 66.4 (pause) green "UPDATE" card slides in, blocks shrink, green "FASTER". → 69.5 diagnosis row 2 "APPS". | نفس الجهاز، الخدمة زادت | pop per block, tick, ding | Remotion | explain |
| 10 | 70.12-79.43 | وزيد، كي التخزين يقرب يعمر، يقدر التليفون يثقال. وكي يسخن بزاف، يقدر ينقّص السرعة باش يحمي روحو. تشوف نفس التقطيع، بصح السبب ماشي ديما واحد. | **Causes 3 and 4, then the recap frame.** The four causes in one grid, each with the same lag spinner: same symptom, different cause. | 70.6 STORAGE bar fills 60% → 97%, last segment red (on «يعمر»); row 3. → 73.1 (pause) thermometer rises to red, speed dial dips; row 4 "HEAT". → 76.3 (pause) the 2×2 grid BATTERY · APPS · STORAGE · HEAT, the same spinner on each. | نفس التقطيع… أسباب مختلفة | pop, tick, pop per tile | Remotion | recap |
| 11 | 79.43-84.75 | يعني يقدرو يبطّؤوه بالعاني؟ إيه، في بعض الحالات. بصح البطء وحدو ما يثبتش بلي يحبوك تشري جديد. *(recorded wording, check by ear)* | **The verdict unlocks.** One solid, proven link and one dotted, unproven link. | 79.4 the scene 3 `LockedChip` returns and opens. → 80.8 green check «إيه · في حالات» on the BATTERY row. → 82.0 solid link "BATTERY → SLOWER", dotted red link "SLOWER → BUY NEW?". → 83.8 `Stamp` «ما يثبتش» over the dotted link. | البطء وحدو ما يثبتش النيّة | unlock, pop, stamp | Remotion | aha / share |
| 12 | 84.75-92.10 | يعني قبل ما تبدّل تليفون، شوف حالة البطارية والتخزين. وإذا البطارية السبب، تبديلها يقدر يحسّن الأداء ويوفّر الدراهم. *(recorded wording, check by ear)* | **Save frame.** A clean checklist card, built row by row, then held. | 84.75 `MiniUI` «قبل ما تبدّل» enters. → 86.9 row "BATTERY HEALTH" with a tag. → 87.6 row "STORAGE FREE". → 89.0 row 3 highlighted (gold outline, beige): «بطارية جديدة = أداء أحسن» + green sticker "SAVE MONEY". → hold 89.7 to 92.1 (2.4 s). | قبل ما تبدّل… شوف | whoosh, tick per row, ding | Remotion | save frame |
| 13 | 92.10-93.96 | (no voice) | **End card and loop.** The phone with its hanging tag again (echo of frame 0). | 92.1 phone shrinks into the end-card object area; `Stamp` "EXPLAINED"; wordmark `Runtime.tech` + `ScanLine`; tagline `TECH · EXPLAINED SIMPLY`; ink sticker «شحال عندو تليفونك؟»; dark button «تابع للجاية». | شحال عندو تليفونك؟ | whoosh, stamp | Remotion | CTA / loop |

## Engagement map
- **Hook (0-2 s):** a phone with a EUR 25M fine tag swinging from frame 0, and a speed bar draining. It reads without sound and backs up the spoken fact.
- **Open loops:** "did they slow *your* phone?" (`LockedChip`, scene 3), answered in scene 11. "Why slow it down at all?" (scene 5), answered in scenes 6 and 7.
- **Re-hooks:** about 19 s (the EUR 25M tag swings back in, "FRANCE"). About 31 s, the hard cut to the dark blueprint. About 50 s, «بصح ماشي كل تليفون…» opens the other causes.
- **Save frame:** scene 12, the «قبل ما تبدّل» checklist, held 2.4 s.
- **Comment prompt:** «شحال عندو تليفونك؟» on the end card, matching the pinned comment (واش تليفونك، وشحال عندو معاك…).
- **Share moment:** scene 6, "charged ≠ enough power" with the tap, and scene 11's "slowness alone doesn't prove the motive", a line people send to the friend who says "they do it on purpose".
- **Follow CTA:** the end-card button only, after the payoff. No spoken CTA.
- **Loop ending:** the final frame shows the same phone with its hanging tag, matching frame 0.

## Retention check
- Visual changes per 10 s: 4 to 6 everywhere (counted from the build steps). The first 11 s have 11 events.
- Longest static stretch: about 2.6 s (the scene 12 save-frame hold, on purpose). Nothing goes over 4 s.

## Components and assets
| Name | New / existing | Used in scenes | Effort |
|---|---|---|---|
| GridCanvas, HeaderStrip, ChapterPill, CaptionPill, ScanLine | existing | all | - |
| Card, StickerPill, Stamp, XStamp, ValueTag, SpeechBubble, LockedChip, ArText, Mono, TermLabel | existing | all | - |
| DeviceMock, StatusBar, ScaleBar, MiniUI/MiniRow, DrawPath, Counter | existing | 1-3, 6-7, 9, 11-13 | - |
| Icons: BatteryIcon, CameraIcon, ClockIcon | existing | 1-2, 4-5, 10 | - |
| `NotifCard` (headline-style evidence card, from style.md section 5, not built yet) | new, reusable | 4 | S |
| `CameraView` (viewfinder inside DeviceMock: spinner, subject that leaves, "loaded empty" state) | new, reusable | 2 | M |
| `SpeedBar` (on-screen phone speed meter, 0..1, red when low) | new, reusable | 1, 13 | S |
| `ChargeTank` + `TapInset` (blueprint charge level; tap with stream width prop) | new, reusable | 6 | M |
| `SpeedDial` (CPU % dial, also used for heat dip) | new, reusable | 7, 10 | S |
| `TaskBox` (capacity box with dropping task blocks, overflow state) + RAM tray mode | new, reusable | 8, 9 | M |
| `StorageBar`, `Thermometer` | new, reusable | 10 | S |
| `DiagnosisList` (rows BATTERY/APPS/STORAGE/HEAT, add one at a time; 2×2 grid mode) | new, reusable | 8-12 | M |
| `LinkProof` (solid vs dotted labelled link) | new, reusable | 11 | S |
| SFX: whoosh, pop, stamp, tick, ding, lock, unlock exist in `public/sfx/`. Missing: bloop, click, water (generate them, or fall back to pop-soft, shutter and morph) | partly new | all | S |

## Build order
1. Audio: copy `v2/narration-master.wav` to `public/phone-slowdown-v2/`, captions (word timing checked by ear, especially scenes 9, 11 and 12), music bed.
2. Scenes 1-3 (hook to open loop) and the cover still.
3. Scenes 11-13 (verdict, save frame, end card): the payoff.
4. Scenes 6-7 (blueprint mechanism, hardest idea).
5. Scenes 4-5, then 8-10.

## MVP fallback
- Scene 2: replace the moving subject with a static viewfinder + spinner + "MISSED" sticker.
- Scene 6: drop the tap inset animation; show a static tap card with a thin stream next to the meters.
- Scenes 8-9: skip the falling blocks; use the CPU and RAM bars growing plus the LIGHT → HEAVY tag.
- Scene 10: storage and heat as two cards popping in, then the existing `AppGrid`-style 2×2 grid without spinners.

## Script feedback
- None that needs re-recording. The new intro flows into audio4 with no repeat: the hook mentions the fine, and audio4 gives the details (France, USA). That works as tease then payoff.
- Audio10 is a shorter version of script beats 11-12, and V1's closing line (beat 13) was never recorded. Both are kept as recorded; the end card carries the closing visually.
- **Before building, confirm the exact wording** of audio8's last clause and of audio10 (the ASR is unreliable on Darija). Captions must match the voice word for word.

## Risks
- Event times inside each clip come from pauses and a draft ASR. Check them by ear in Remotion Studio.
- "Apple" appears in captions because it is spoken. No logos and no iPhone artwork: generic phones only (style.md section 11).
- The fine amount (EUR 25M) is shown but not spoken. Keep it exact or remove the number.
- Arabic plus Latin labels in the same card (for example "CPU = المعالج"): test the bidi order in the first still.
- The end card is only 1.86 s. If it feels rushed, add up to 1 s of silent tail in `make_master.py` (TAIL) and rerun both scripts.
