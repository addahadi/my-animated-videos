# Plan: علاش لازم تثبت بلي راك إنسان؟

- Promise: Understand why websites use CAPTCHA to make automated abuse harder, without mistaking a passed check for proof of humanity.
- Audience: general | Length: 95.680 s audio / 95.700 s picture | Timing: MEASURED
- Visual spine: One visitor request approaches a website checkpoint. We open that same checkpoint to see the queue analogy, the test, and the background assessment. The recurring checkpoint makes each example part of one system.
- Hardest idea: A check estimates risk rather than guaranteeing identity -> open the checkpoint, show interaction context feeding a qualitative assessment, then show the website deciding what to do. Scenes 6–7 devote approximately 24.7 s to this distinction.
- Style: New reusable [plans/style.md](../../../plans/style.md); dark illustrated 2D, blue ordinary requests, violet automation, orange scrutiny. These are source markers, not a good/bad binary.

**Audio and script authority.** Eight supplied recordings exist in `inputs/`. Keep audio1 through audio8 in numeric order, with all words and silence preserved. ffprobe durations were confirmed by counting decoded 48 kHz samples: 4,592,640 samples = 95.680 s. Scene boundaries are quantized cumulatively to 30 fps; the final frame ends at 95.700 s, containing a 0.020 s silent picture tail. Concatenate audio at sample boundaries into one track; do not round individual audio starts to frames.

**Cue status.** Scene lengths are measured. Within-scene cue anchors are PROVISIONAL, located with a cached local Whisper model. Check them by ear before rendering; ASR is not a transcript approved for display. All voiceover cells below quote the original script verbatim as a reference, not as a replacement for the recorded narration. Candidate recording differences appear under Script feedback. The script itself is unchanged.

**Concept chain, in order**
1. A familiar extra step before entering a site — story.
2. One automated source can repeat operations and crowd out ordinary use — scale / number, represented by illustrative card IDs 01, 02, 03 rather than a claimed request rate.
3. Automated tools have many uses, including abusive account creation and other repeated operations — comparison.
4. CAPTCHA attempts to distinguish human interaction from automation using a challenge — abstract concept.
5. Tests and programs change, and a failed test does not establish that a user is a bot — sequence.
6. Some systems assess interactions in the background; the website responds to the risk estimate — invisible process.
7. The aim is to reduce automated abuse; passing is not a guarantee — comparison and recap.

## Cover frame
Use the same checkpoint at center, with a blue request waiting before a large traffic-light grid; a violet stack of request cards is visible behind it. Title: **علاش تثبت بلي إنسان؟** (five words). Place at x=120–880, y=340–540, 88 px Noto Sans Arabic. Keep the grid at y=620–1110. Optional small CAPTCHA term below it. No extra slogan or new visual metaphor. This is a separate cover artifact when the video is built.

## Storyboard
All In-Out values below are MEASURED scene spans on the quantized picture timeline. Local cue offsets are PROVISIONAL. The JSON gives exact frames.

| # | In-Out (s) | Voiceover (Darija) | Representation (what and why) | Motion and build steps | On-screen text | SFX / music | Tool | Role |
|---|------------|--------------------|-------------------------------|------------------------|----------------|-------------|------|------|
| 1 | 0.000–9.967 MEASURED | علاش تثبت بلي راك إنسان؟ تدخل لموقع، حاب تفتح حساب برك، يخرجلك: اختار كامل الصور اللي فيهم feu rouge. تقول: واش دخلني أنا فالطريق؟ | A browser action is interrupted by the recurring checkpoint. The image grid makes the familiar annoyance understandable with the sound muted. | **M**. +0.00s: Browser form and blue request move immediately; closed checkpoint and question mark are visible. +2.47s: Checkpoint unfolds into a progressively revealed 3×3 vector traffic-light grid; do not show the grid before the request is interrupted. +5.50s: Cursor pauses; question mark above the extra checkpoint enlarges. Use the recording's question, without adding the missing spoken hook or joke. +8.90s: Grid compresses into the same checkpoint silhouette; hold the unanswered question into the queue scene. | علاش نثبت بلي إنسان؟ | soft-click; music optional and quiet. | Remotion | hook |
| 2 | 9.967–22.267 MEASURED | باش تفهم علاش، تخيّل واحد قدّامك فالطابور، كل مرة يرجع بلبسة جديدة ويشد بلاصة. فالإنترنت، برنامج واحد يقدر يعاود نفس العملية آلياً، ويزاحم الناس اللي راهم يستعملو الموقع عادي. | One repeated queue member becomes repeated request cards; one source producing many operations explains the unfair scale. | **M**. +0.00s: Checkpoint stays in place as the site doorway; queue grows one figure at a time, maximum three initially. +2.63s: One violet figure changes its hat and rejoins; repeat twice, leaving other people waiting. +5.73s: Queue transforms into browser request cards; a small label marks the move from analogy to website, with no added narration. +8.60s: One violet source duplicates numbered cards 01, 02, 03; these IDs are illustrative, not a measured rate. +11.40s: Blue request waits behind the violet batch; question mark moves to the checkpoint. | برنامج واحد، طلبات بزاف | paper-tap; music optional and quiet. | Remotion | open loop |
| 3 | 22.267–36.900 MEASURED | هذا يسمّوه bot: برنامج يخدم وحدو. وكاين اللي يستعملوه باش يفتح حسابات مزوّرة، يعمّر التعليقات بالإشهار، ولا يجرّب كلمات السر المسروقة. وهنا، الموقع يحتاج طريقة باش ينقص هاذ الاستغلال. | A neutral automation source produces cards; only the harmful examples receive a warning marker. Recorded examples provisionally follow account creation, stolen-password attempts, and bulk data collection. | **M**. +0.00s: Snap the label bot onto the existing violet source, with a three-word Arabic definition; no new mascot. +3.40s: Show neutral tasks briefly with no warning, so automation itself is not branded malicious. +4.67s: First example: source emits duplicate profile cards behind the checkpoint. +6.10s: Replace the cards with a lock and several invalid key attempts; no password-cracking code. +7.83s: Replace the lock with document cards being pulled from a website into one batch, marked excessive collection, not all collection. +10.83s: Collapse examples into the incoming batch and highlight the site's need for a checkpoint. +13.90s: Briefly dim the source, leaving the checkpoint ready to open in scene 4. | برنامج يخدم وحدو | None; music optional and quiet. | Remotion | explain |
| 4 | 36.900–50.033 MEASURED | من هنا جات فكرة CAPTCHA: اختبار يحاول يفرّق بين الإنسان والبرنامج. الفكرة الأصلية كانت تعطيك حاجة الإنسان يفهمها، بصح تصعاب على البرامج، كيما حروف معوّجة تقراها وتعاود تكتبها فالخانة اللي تحتها. | Open the same checkpoint and show one historical challenge example. Input and outcome are causally connected, without implying a perfect identity proof. | **M**. +0.00s: Bring checkpoint forward; prior request batch remains dim in the background. +1.07s: Reveal CAPTCHA label; add two simple source silhouettes in succession, then dim them. +4.07s: Small historical-example marker appears; show the challenge panel with empty content first. +8.43s: Reveal distorted Latin sample K7M2 with a readable input below; keep sample isolated LTR. +10.83s: Type K7M2 into the input one character at a time; local demonstration only. +12.70s: Checkpoint opens for the example request; retain the question mark outline rather than certifying a person. | اختبار يفرّق بيناتنا | soft-click, quiet-confirm; music optional and quiet. | Remotion | explain |
| 5 | 50.033–61.333 MEASURED | بصح علاش اليوم نشوفو صور وحوايج أخرى؟ خاطر البرامج تطوّرت، والاختبارات هاذي ماشي ضمان كامل. الحماية لازم تتبدّل هي ثاني. وحتى كي تغلط فصورة، هذا ما يعنيش بلي راك robot! | A changing checkpoint and a retry show that tests evolve and a person's error is not proof of automation. | **M**. +0.00s: Historical text panel morphs into the familiar image grid, one row at a time. +2.57s: Violet source gains a small capability arrow; checkpoint outline remains visibly incomplete. +5.97s: Checkpoint swaps its challenge module, keeping its position and request route unchanged. +8.20s: Cursor chooses one wrong tile; neutral retry icon, no malicious-bot label on the human. +10.90s: Retry panel settles, preparing to disappear in the next scene. | الحماية تتبدّل مع البرامج | gentle-retry; music optional and quiet. | Remotion | aha |
| 6 | 61.333–74.167 MEASURED | وزيد، ماشي كل تحقق يحتاج صور. كاين أنظمة كيما reCAPTCHA v3 تخدم فالخلفية: تحلّل التفاعل تاعك مع الموقع وتعطيه تقدير للخطر، باش يختار كيفاش يتعامل مع الطلب اللي راهو جايه. | X-ray the same checkpoint: interaction context feeds a qualitative risk estimate, and the website chooses a response. This distinguishes assessment from certainty. | **L**. +0.00s: Visible challenge drawer closes; browser remains usable and request route stays visible. +3.97s: Attach reCAPTCHA v3 label to the background module, isolated LTR; no CAPTCHA image challenge inside v3. +6.70s: Reveal one interaction card at a time flowing toward an assessment panel; do not invent exact telemetry or mouse rules. +8.80s: Qualitative risk indicator appears with uncertainty label; no invented score or threshold. +10.10s: Only now reveal a separate site decision: proceed or request an additional check; make clear the website selects the action. | تحقّق يخدم فالخلفية | soft-reveal; music optional and quiet. | Remotion | aha |
| 7 | 74.167–86.067 MEASURED | يعني الهدف هو يصعّب الاستغلال الآلي: يخلي فتح الحسابات ولا إرسال التعليقات بالجملة أصعب على اللي يستعمل برامج للإزعاج. يقدر يعطّلهم، بصح ما يضمنش بلي كل واحد يفوت راهو إنسان مية بالمية. | The batch slows at the checkpoint; one uncertain request slips through. Summarize reduced automated abuse rather than guaranteed humanity. | **M**. +0.00s: Show the complete route using already introduced objects; emphasize the checkpoint's purpose. +2.90s: Account cards and bulk document cards approach; match the recorded examples provisionally, not the script's comments example. +6.77s: Batch visibly queues while a blue request continues; do not show an invented success rate. +8.13s: One violet card passes; keep its source marker so passing does not recolor it as human. +9.30s: Settle into a clean save frame: batch → checkpoint → site, with a small uncertainty marker and the six-word takeaway. Hold through scene end. | يصعّب الاستغلال، ماشي ضمان كامل | None; music optional and quiet. | Remotion | recap / save frame |
| 8 | 86.067–95.700 MEASURED | هاذيك الثواني اللي تغيّضك كي تختار الصور، راها جزء من محاولة حماية الموقع. وهاك علاش، باش تدخل لعالم رقمي... يطلبو منك تثبت بلي راك إنسان. | Return from the system view to the familiar browser interruption: the inconvenience now has a purpose. End on the opening browser geometry for a loop. | **S**. +0.00s: Grid and checkpoint sit inside a partial shield; no impenetrable shield or identity-certified stamp. +4.83s: Zoom back to the exact browser layout from frame 1; question mark becomes a short purpose tag, then fades. +6.00s: Show the sole CTA: حروف ولا صور؟ in the lower-middle phrase area for 2 s. Do not add a spoken line. +7.57s: Emphasize the existing verification ring once, then return cursor and grid to their opening positions. +8.00s: Fade the question and return the phrase area to the opening question for the final composition. +9.10s: Finish matching the opening composition; retain all recorded trailing silence and the final partial-frame hold. | باش تدخل، تثبت بلي إنسان → حروف ولا صور؟ (sole visual CTA) → opening question | soft-click; music optional and quiet. | Remotion | aha / CTA / loop |

**Voice sync and pacing**
- The event times already include the planned approximately 0.3 s visual lead when the phrase allows it; do not subtract the lead a second time. The first browser action is present from frame 1.
- Record a separate emphasis pulse on the audible anchor itself: bot, CAPTCHA, حروف معوّجة, البرامج تطوّرت, فالخلفية, تقدير للخطر, ما يضمنش, and تثبت. Pulses are 6 frames and do not change an object's meaning.
- Introduce the reCAPTCHA v3 background module before the risk indicator; reveal the site's response only after the recording explains the estimate. No image challenge inside the v3 module.
- Place transitions inside existing between-clip breaths. The reference ASR suggests a roughly 0.7 s gap at the end of clip 1 and roughly 0.5 s at the end of clip 4: use the last 0.3–0.5 s as a visual anticipation before the next reveal. Confirm by ear and do not insert, extend, or cut silence.
- The caption track consists of short phrases only, as requested in the workspace preferences. A 2–4 word line may highlight its active keyword with the voice; it is not a full narration transcript.
- Every change is a cause/effect event or useful focus shift. For a muted viewer: repeated cards imply automation, the obstacle implies extra checking, the uncertain marker prevents “passed = human,” and the closing diagram gives the purpose.

**Portrait composition**
- Essential content inside x=90–900, y=270–1420. Header y=285–460, diagram y=500–1140, phrase y=1190–1400.
- No essential content in the top 250 px, bottom 450 px, or rightmost 180 px.
- Headings 76–88 px, phrases 64–72 px, labels at least 48 px. Arabic uses RTL layout and an Arabic-capable font; Latin terms use isolated LTR spans. Test “أنظمة كيما reCAPTCHA v3” and K7M2 before scene production.
- Stack source, checkpoint, and website vertically in system views. Introduce three or more objects progressively, highlight the current object, and dim inactive ones.

## Engagement map
- Hook (0–2s): A blue request moves toward a closed checkpoint; a large verification question and grid preview explain the nuisance without sound. The recording appears to start with entering the website, so the question is a deliberate visual teaser, not added speech.
- Open loops: Why the extra step? Keep a small question mark attached to the checkpoint until the reason is revealed; later ask visually whether passing proves humanity.
- Re-hooks: At approximately 15.7 s, the queue transforms into digital requests; at 36.9 s the checkpoint opens; at 61.3 s the visible puzzle vanishes but the background module remains.
- Save frame: Frames 2504–2582, approximately 83.467–86.067 s, show the complete route with “يصعّب الاستغلال، ماشي ضمان كامل.” Hold approximately 2.6 s; no particles or CTA over this diagram.
- Comment prompt: The single explicit CTA is visual only: **حروف ولا صور؟**, frames 2762–2822, approximately 92.067–94.067 s, after the explanatory payoff. Keep the spoken closing line unchanged. Reuse the fuller question in the pinned comment.
- Share moment: The background-check reveal shows that “no image puzzle” does not mean “no assessment”; the visual is the useful surprise. Do not add a new spoken share request.
- Follow CTA: None in this video. Keep the existing follow-up about historical book digitization for the publishing kit; do not add a second CTA.
- Loop ending: Restore the opening browser geometry and cursor position during the final second. The closing line about proving humanity lands on the original checkpoint. Do not introduce a logo end card.

## Retention check
- Planned meaningful visual changes per 10 s: 0–10 s: 5; 10–20 s: 3; 20–30 s: 5; 30–40 s: 5; 40–50 s: 4; 50–60 s: 4; 60–70 s: 4; 70–80 s: 4; 80–90 s: 4; 90–95.7 s: 5.
- Longest interval between planned visual events, including the ending: **4.833 s**. No interval exceeds 6 s.
- Counts describe planned state changes; final renders must still be checked for legibility and actual visible changes. Do not count background drift as a retention event.

## Components and assets
| Name | New / existing | Used in scenes | Effort |
|------|----------------|----------------|--------|
| Original audio1.ogg–audio8.ogg | Existing; retain as supplied | All | S: assemble continuous PCM, no edits |
| Original script | Existing; immutable reference for this plan | All | S |
| Noto Arabic / Manrope candidates + OFL files | Existing in videos/vulhunter-skill/public/fonts; copy with licenses when building | All | S |
| Window, Arabic, Icon patterns | Existing in videos/vulhunter-skill/src/design.tsx; adapt copies with new dimensions/tokens, not direct global edits | All | M |
| BrowserWindow, RequestCard, SiteCheckpoint | New reusable composition components based on those patterns | 1–8 | M |
| PhraseCaption, TermLabel | New reusable styles with RTL and Latin isolation | All | S |
| TrafficGrid / TextChallenge | New vector UI examples; traffic tiles, cursor, K7M2 | 1, 4, 5, 8 | M |
| QueueToRequests / BotUseCases | New reusable duplication and progressive-card sequences | 2, 3 | M |
| BackgroundRiskCheck | New interaction → estimate → separate website decision diagram | 6 | L |
| SummaryFrame / CheckpointLoop | New reusable recap and matched opening/ending composition | 7, 8 | M |
| Click / reveal / retry | New synthesized sounds or documented licensed alternatives | Selected transitions | S |
| Music | Optional, not supplied; no download or selection required now | Optional bed | S if used |

Scene effort tags: 1=M, 2=M, 3=M, 4=M, 5=M, 6=L, 7=M, 8=S. S ≈ under 30 min; M ≈ 1–2 h; L ≈ half a day or more. Component and scene tags overlap; do not add them as independent estimates.

## Build order
1. Prepare the continuous narration from exact sample counts; verify clip order and listen to the marked ASR differences. Place short phrase cues and check Arabic/Latin rendering.
2. Build the hook and cover from BrowserWindow, RequestCard, and SiteCheckpoint. Review a representative portrait frame with phone UI margins.
3. Build the scene 6 risk-assessment reveal, scene 7 save frame, and scene 8 loop. This proves the hardest explanation and ending first.
4. Build the queue transformation and bot-use examples, then the two challenge-module scenes using the same checkpoint.
5. Export representative frames for scenes 1, 2, 4, 6, and 7, plus a short preview spanning the background-check reveal. Review readability and cause/effect before the full export.
6. At production time, verify source/type checks using this video's own entry point, then export H.264/AAC 1080 × 1920 at 30 fps. Check the 95.700 s picture, all 95.680 s of narration in order, quiet mix, and the final loop. Save review assets, MP4, and a short production note inside this project. This planning task has not built or rendered a video.

## MVP fallback
- Replace the outfit-changing queue animation with three simple silhouette cards that become requests; preserve the one-source → repeated-actions relationship.
- Draw the three bot-use cards once and highlight them successively; keep the recording's order after review.
- Use a still distorted K7M2 image with typed input; no advanced letter morph needed.
- Replace the risk diagram's fluid transitions with three sequential panels, then show the same diagram assembled. Keep the separation between estimate and site decision.
- Omit music and most SFX. Keep the hook, semantic colors, readable phrases, uncertainty marker, save frame, and loop.

## Script feedback
- Do not rewrite or re-record automatically. The original 230-word script is preserved, while supplied recordings remain authoritative for narration.
- Clip 1 ASR suggests the recording omits the original opening “علاش تثبت بلي راك إنسان؟” and the road joke, and asks why the website adds this step. Suggested implementation: use the question visually in frame 1, animate the recorded website interruption, and add no spoken line. Confirm the exact wording by ear.
- Clips 3 and 7 ASR suggest bulk information/data collection replaces the written spam-comment examples; clip 3 may also say bots have several uses. Suggested implementation: use generic excessive document collection and a neutral bot introduction, retaining account/password examples in the recorded order. Confirm by ear; if the ASR is wrong, switch the relevant card to comments. The plan does not claim all bots or all collection are malicious.
- Scene 7 is denser in the written script than its approximately 11.9 s recording. Suggested implementation: introduce no new term or side example there; reuse the established objects and settle into the recap during the caveat.
- The original table's 90 s timing is superseded by the 95.680 s recordings. No time compression is needed.
- No changes to the narration text are requested by this plan. Any proposed wording change belongs in a separately reviewed script revision.

## Risks
- **Speech cues:** Local ASR makes visible Darija errors; measured clip timing is reliable but word-level anchors and candidate content differences need listening. Do not generate display captions from the ASR.
- **Frame rounding:** Audio clip boundaries are fractional frames. Use one sample-accurate narration track; rounding eight separate audio sequences would move cues. The final 0.020 s picture tail preserves the entire recording.
- **Technical truth:** CAPTCHA is an attempted distinction, not a guarantee. Background assessment is qualitative in this video; show no invented metric, private telemetry rule, success rate, or detection threshold. The website, not the v3 module itself, chooses additional actions.
- **Analogy limit:** The queue is about repeated automated operations, not a literal identification system. Its transformation back to request cards is the on-screen boundary between analogy and mechanism.
- **Layout:** Mixed bidi text, long Arabic phrases, and portrait paths require still-frame inspection. Use Remotion for Arabic; no Manim scenes are needed.
- **Scope and licensing:** Use newly drawn vector example tiles and documented font licenses. Avoid copied CAPTCHA screenshots and unlicensed music. Rendering and publishing have not been performed.

