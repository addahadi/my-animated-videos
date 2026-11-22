# Plan: Knight Capital — the missed server

- Promise: يفهم المشاهد كيفاش تحديث ناقص في server واحد، مع غياب الحماية الكافية، ولّى كارثة بمئات الملايين.
- Audience: general | Length: 93.312s audio / 93.333s picture | Timing: ESTIMATED scene alignment, MEASURED clip lengths
- Visual spine: One persistent customer-order route through the same eight numbered software-server cards. Viewers watch the same system change, so each consequence has a visible cause.
- Hardest idea: One activation signal means different things on different installed versions, and the old router cannot stop when the order is filled → spend scenes 5–6 (about 23.4s) on a paired software panel and broken completion-feedback path.
- Style: Reuse workspace `plans/style.md` through [local topic mapping](style.md); dark illustrated 2D, stable camera, blue orders, violet activation, orange faults. Runtime.tech branding. Short headings only, per the user's established preference.

## Understanding before design

1. Company sends trading orders automatically — invisible process / story.
2. Eight servers should run the same update, but one is missed — sequence / comparison.
3. The reused activation signal reaches a different old function — abstract concept / code, explained without code syntax.
4. The order finishes but the router keeps sending — invisible process / cause and effect.
5. Removing the update from the other servers makes the failure spread — story / sequence.
6. Inadequate automatic blocking allows the exposure to grow — structure / abstract concept.
7. Reported losses reveal the consequence and the need for safeguards — scale / number / advice.

Only three technical labels are introduced: server (computer running software), Power Peg (old unused function), SEC (attributed investigation/report label). NEW/OLD in descriptions are version states, displayed as جديد/قديم. Do not introduce flag, SMARS or RLP as extra audience jargon.

## Timing and recording evidence

- Ten original OGG files are present. Exact decoded-sample total: **93.312s**. Durations were measured with PyAV because ffprobe was unavailable on PATH; source hashes and sample counts are in [recordings.json](../analysis/recordings.json).
- Inferred order: timestamp-named clip as beat 1, then audio2…audio10; `audio6ogg.ogg` is clip 6. No recording was renamed, trimmed, normalized or rewritten.
- Local Whisper could not allocate model memory, including with one CPU thread. **Content, clip-to-beat assignment and word boundaries are unverified.** Every scene/event remains ESTIMATED until checked by ear. Measured clip durations are not evidence of phrase alignment.
- Scene frames use rounded cumulative clip boundaries; last frame rounds up to 2800, adding only about 0.021s picture hold. Exact audio offsets stay sample-based. End frames are exclusive. No gaps or overlaps.
- Keep original script text and its provisional 90s table intact apart from removing its visual column. This plan supersedes its time estimates only after audio-order review.
- Re-sync procedure: listen to each full clip, confirm its beat, mark phrase onsets and breaths, move corresponding visual cues 9 frames ahead of established phrases, land emphasis on the word, then review by ear again. If narration differs from the script, record the discrepancy for review; never replace it with ASR text.
- Suggested reveal pauses: before the missed eighth server, before the failed-repair spread, before each attributed loss figure. Use existing breath gaps; if none exists, use a quiet visual hold while preserving audio, rather than inserting silence.

## Cover frame

Text: **server واحد، 440 مليون دولار** (5 words). One large server card with an orange missing-update marker, $440M and a small الإعلان الأولي qualifier. Preserve contrast and safe-zone legibility in a grid thumbnail. No eight tiny servers or misleading final-loss claim.

## Storyboard

All intervals and sub-cues below are **ESTIMATED** assignments over measured audio durations. Voiceover is copied verbatim. Each visual cue is a planned onset; phrase-anchor matching governs the final placement.

| # | In-Out (s) | Voiceover (Darija) | Representation (what and why) | Motion and build steps | On-screen text | SFX / music | Tool | Role |
|---|------------|--------------------|-------------------------------|------------------------|----------------|-------------|------|------|
| 1 | ESTIMATED 0.000–3.833 | server واحد، ومئات الملايين راحو. | Story / scale: one server with an unexplained loss; creates a question without inventing intermediate dollar values. | ESTIMATED +0.0s: Server card already entering on frame one; orange fault edge draws; ESTIMATED +1.8s: Loss label appears beside the card; keep exact dollar amount covered; ESTIMATED +3.2s: Freeze the loss label and move the same card toward the future grid anchor | server واحد، كارثة بالملايين | One quiet low impact on the loss label | Remotion / S | hook |
| 2 | ESTIMATED 3.833–11.400 | في أوت ألفين واثناش، شركة أمريكية اسمها Knight Capital كانت تستعمل برامج تبعث أوامر شراء وبيع الأسهم للبورصة، بسرعة كبيرة. | Invisible process: a customer order travels through the company to an exchange. Blue always means an order, never a good software version. | ESTIMATED +0.0s: Date chip appears above the persistent server; no logo intro; ESTIMATED +2.8s: Company label snaps onto the middle node; reveal exchange below; ESTIMATED +5.5s: Blue BUY/SELL cards move downward; accelerate only on بسرعة كبيرة | أوامر تتبعث في لحظات | One soft routing click; music optional/off | Remotion / M | explain |
| 3 | ESTIMATED 11.400–19.700 | نهار واحد أوت، فتح السوق… وبدا البرنامج يبعث أوامر غالطة. في حوالي خمسة وأربعين دقيقة، دار قرابة أربعة ملايين عملية تداول. | Story / number: distinguish incoming customer requests from executed trades. Compression illustrates activity, not real-time trading speed. | ESTIMATED +0.0s: 09:30 market-open chip; ordinary order path stays visible; ESTIMATED +2.7s: Repeated blue order cards gain orange fault outlines and multiply; ESTIMATED +5.6s: Span card 45 دقيقة, then approximately 4M executions on its spoken phrase; add small why-question marker | 45 دقيقة، ملايين العمليات | Quiet clock click; no constant ticking | Remotion / M | open loop |
| 4 | ESTIMATED 19.700–31.067 | واش صرا؟ قبلها، كانوا يركّبوا تحديث على ثمانية servers، يعني كمبيوترات تخدم البرنامج. سبعة تحدّثوا… والثامن فاتوه. وما كانش تحقق ثاني يكشف الغلطة. | Sequence / comparison: reveal the missed deployment. Eight numbered cards are one grouped fleet, not eight equally prominent diagrams. | ESTIMATED +0.0s: Rewind tab قبل فتح السوق; retain server identity from hook; ESTIMATED +2.8s: Build two columns of four cards in reading order, one card per short stagger; label as computers running software; ESTIMATED +5.5s: Version labels on cards 1–7 become جديد; 8 remains قديم in neutral gray; ESTIMATED +8.4s: Orange missing-update ring on 8; second-review checkbox remains blank | سبعة تحدّثوا، واحد بقى | One quiet click on server eight; no eight separate SFX | Remotion / M | aha |
| 5 | ESTIMATED 31.067–43.333 | بصح علاش تحديث ناقص يدير هاذ الكارثة؟ في الثامن، بقى كود قديم ما عادوش يستعملوه، اسمو Power Peg. تخيّل زر قديم عاودوا استعملوه لوظيفة جديدة. | Abstract concept / comparison: hardest idea part 1. Same violet activation signal, different installed versions, different functions. Software analogy only; no physical server interior. | ESTIMATED +0.0s: Dim seven cards and move 8 into focus; retain fleet breadcrumb; ESTIMATED +3.0s: Open an application panel labelled Power Peg / كود قديم, not a circuit board; ESTIMATED +6.2s: Show conceptual switch with small تشبيه label; attach old-version function; ESTIMATED +9.3s: Add NEW-version panel alongside OLD; same violet switch routes to a different function in each | نفس الزر، خدمة مختلفة | Quiet reveal click only after the question | Remotion / L | open loop |
| 6 | ESTIMATED 43.333–54.433 | بشكل مبسط، الإشارة اللي تشغّل الخدمة الجديدة في السبعة، شغّلت الكود القديم في الثامن. وهذا بقى يبعث أوامر، حتى كي الطلب الأصلي راهو تكمّل. | Invisible process / cause and effect: hardest idea part 2. A reused software flag activates legacy code; the router does not receive completion information. | ESTIMATED +0.0s: Violet activation marker reaches both versions; label same input with different destinations; ESTIMATED +3.0s: Old function activates on server 8; its outgoing cards stay blue with orange fault marks; ESTIMATED +6.0s: Repeated order sends continue from the legacy function; leave the customer card in view; ESTIMATED +8.8s: Customer-order card gains مكتمل; completion feedback stops at a broken connector while outgoing orders continue | الطلب كمل، الأوامر تواصلت | Soft completion click, followed by continued quiet packet motion; no alarm loop | Remotion / L | explain |
| 7 | ESTIMATED 54.433–64.800 | والأسوأ؟ كي حاولوا يصلّحوا المشكل، نحّاو التحديث من السبعة الآخرين. هكذا الكود القديم تفعّل حتى فيهم، والمشكل كبر. كانوا يصلّحوا، والأوامر ما زالت تخرج. | Story / sequence: the attempted rollback exposes legacy behavior on additional servers. Some eligible orders activate it; never imply every order is faulty. | ESTIMATED +0.0s: Hold current fault for a beat; reveal repair action above fleet; ESTIMATED +2.8s: Remove NEW badges from 1–7 in a short stagger; do not disconnect server 8; ESTIMATED +5.7s: Violet activation markers trigger further old paths; orange fault outlines spread; ESTIMATED +8.5s: Repair pointer pauses while the same order stream continues below | محاولة الإصلاح كبّرت المشكل | One restrained impact when fault spreads | Remotion / M | aha |
| 8 | ESTIMATED 64.800–74.200 | هنا تفهم علاش الغلطة كبرت: ما كانش نظام حماية كافي يوقف هاذ السيل تلقائيا. البرنامج يغلط بسرعة، والخسارة تكبر مع كل دقيقة تفوت. | Structure / cause and effect: monitoring exists, but its readings do not adequately block orders. No claim of zero safeguards. | ESTIMATED +0.0s: Group fleet into one node and reveal its outgoing path; ESTIMATED +3.0s: Monitoring meter reads rising exposure; show disconnected link to a blocking gate; ESTIMATED +6.3s: More fault-marked orders pass while exposure rises; no fabricated dollar ticks | وين راهي الحماية التلقائية؟ | No new SFX; let narration carry the explanation | Remotion / M | explain |
| 9 | ESTIMATED 74.200–84.633 | من بعد، كي صفّاو الصفقات الغالطة، أعلنوا خسارة حوالي ربعمية وأربعين مليون دولار. وحتى هاذ الرقم طلع: التحقيق الرسمي ذكر أكثر من ربعمية وستين مليون. | Number / recap: settlement losses are a consequence of the trading interval. Present the two documented figures as dated reports, then recap the chain before the closing lesson. | ESTIMATED +0.0s: Close-out cards settle; separate settlement from the 45-minute trading span; ESTIMATED +2.9s: Show $440M with الإعلان الأولي and 2012-08-02; small caption قبل الضرائب; ESTIMATED +5.9s: Add SEC 2013 and >$460M only when the later finding is introduced; ESTIMATED +8.0s: After the number lands, show recap: تحديث ناقص → كود قديم → أوامر متكررة. Hold about 2.4s if phrase timing permits | الإعلان الأولي: $440 مليون / لاحقًا: أكثر من $460 مليون | Two very soft report clicks; no cash-register joke | Remotion / M | recap |
| 10 | ESTIMATED 84.633–93.333 | server واحد فاتوه، بصح الغلطة دازت بلا ما تتشد. الدرس؟ ما يكفيش البرنامج يخدم… لازم تعرف كيفاش توقفو كي يغلط. | Advice / save frame: show conceptual prevention steps, clearly separated from the historical reconstruction. End echoes the first server card. | ESTIMATED +0.0s: Return to server 8 and the hook composition; label takeaway الدرس; ESTIMATED +2.7s: Build three short checklist lines: تحقق من التحديث / راقب الأوامر / وقف الخطر. Keep all three readable through +6.6s; ESTIMATED +5.3s: Close conceptual order gate on the emphasized stop word; checklist itself remains still; ESTIMATED +6.6s: After the spoken lesson completes, show the sole CTA واش أول حماية تزيدها؟; server returns toward opening pose; quiet Runtime.tech mark | لازم تعرف كيفاش توقفو | Quiet stop click; no additional sting | Remotion / M | save frame |

## Engagement map

- Hook (ESTIMATED first 0–2s): server and loss visually collide; no greeting, black frame or logo intro. First clip continues uncut to its measured 3.84s boundary.
- Open loops: unexplained loss in scene 1; why-question marker at scene 3; old function behind an activation switch in scene 5. Each closes through the depicted cause, not through an unrelated reveal.
- Re-hooks: why-marker around ESTIMATED 17s; «واش صرا؟» at scene 4; «بصح علاش» at scene 5; «والأسوأ؟» at scene 7. Snap each to its actual spoken question.
- Save frame: scene 10 checklist, ESTIMATED +2.7 to +6.6s (3.9s), has three readable items: تحقق من التحديث / راقب الأوامر / وقف الخطر. Hold the text still while the gate demonstrates stopping. This is a conceptual lesson, not a claim about fixes Knight actually installed.
- Comment prompt: sole explicit CTA, on screen only after the final value: «واش أول حماية تزيدها؟». It must wait until the recorded lesson finishes; if insufficient end time remains, omit it from the video and retain the existing pinned comment. Do not append audio or extend the voiceover.
- Share moment: removing a new version makes the problem worse, scene 7. Let the cause-and-effect diagram carry the counterintuitive point; add no spoken share request.
- Follow CTA: none; quiet Runtime.tech branding supplies continuity without a second request.
- Recap before payoff: scene 9 final ESTIMATED 2.4s shows missing update → old code → repeated orders. Move it later within the recorded beat if needed so the loss figure is heard first.
- Loop ending: same server pose and fault edge as frame one; settle at the same anchor. Do not replay the loss figure as a new historical event.

## Retention check

- ESTIMATED 0–10.000s: 6 changes
- ESTIMATED 10–20.000s: 4 changes
- ESTIMATED 20–30.000s: 3 changes
- ESTIMATED 30–40.000s: 3 changes
- ESTIMATED 40–50.000s: 4 changes
- ESTIMATED 50–60.000s: 3 changes
- ESTIMATED 60–70.000s: 4 changes
- ESTIMATED 70–80.000s: 3 changes
- ESTIMATED 80–90.000s: 5 changes
- ESTIMATED 90–93.333s: 1 changes

- Longest planned stretch between meaningful visual changes: **3.300s**. Scene entrances count because they introduce a new explanatory state; continuous decorative motion alone does not count.
- The eight-card fleet, two-version comparison, monitoring/gate route and recap each build progressively. At most two paths carry emphasis simultaneously; inactive context dims.
- Muted test: a missing version badge, completed order with continuing packets, rollback spreading fault marks, and disconnected monitoring gate each explain the corresponding mechanism without audio. Intro includes date/company/BUY/SELL labels; figure scene includes report attribution.
- Re-run this check after alignment; a stretch above 6s needs an explanatory state change, not a random zoom. The final summary text itself stays fixed long enough to capture.

## Components and assets

| Name | New / existing | Used in scenes | Effort |
|------|----------------|----------------|--------|
| Creator OGG clips | Existing, ten originals in inputs/; order/content review pending | 1–10 | S to map; do not edit originals |
| Remotion/React toolchain | Existing package.json; current root src entry is absent, so create a project-local entry later | All | M |
| Noto Sans Arabic / Manrope + OFL | Existing font candidates under videos/vulhunter-skill/public/fonts; metadata check/copy at build | All | S |
| Runtime.tech visual tokens | Existing workspace plans/style.md; local semantic mapping in style.md | All | S |
| ServerCard / VersionBadge / FleetGrid | New reusable components with persistent IDs 1–8 | 1, 4–8, 10 | M |
| OrderCard / OrderPath / CompletionFeedback | New reusable route and completed-request view | 2–3, 6–8, 10 | L |
| ActivationSwitch / VersionCompare | New paired software panels; explicit conceptual analogy label | 5–6 | L |
| MarketSpan / ReportedLossCard | New exact-number/date UI; no fabricated financial samples | 3, 9, cover | M |
| RepairAction / RiskMonitor / BlockingGate | New reusable state-change/gap demonstration | 7–8, 10 | M |
| TermLabel / PhraseHeading / RecapChain / SummaryChecklist | New topic implementations using existing design specifications; no verified shared component module to import | All | M |
| Quiet click / soft impact | New synthesized assets, or documented licensed source before use | Selected reveals | S |
| Music bed | Optional, not selected; no download required for this plan | Optional | S if licensed |

Effort tags: S under 30 minutes; M about 1–2 hours; L half a day or more. These are planning estimates, not completed work. Existing n8n/CAPTCHA TSX files are visual references, not assumed compatible reusable modules. No rendered footage or new art is needed for planning.

## Build order

1. Review the ten originals by ear and confirm clip order and exact script differences. Preserve source hashes. Create a sample-accurate narration sequence with no added silence, then align short keyword headings; full captions remain off.
2. Build a project-local Remotion entry under this video's src/ and assets under this video's public/. Keep every other video's entry and output untouched. Check Arabic/Latin bidi and phone readability first.
3. Build the hook and scene-10 payoff/summary as representative portrait frames; review the intended visual language before full animation.
4. Build the shared fleet and the difficult paired version/completion scenes 5–6. Review a short preview of the activation-to-continuing-order transition before expanding.
5. Build rollback and control-gap scenes 7–8, then company context, scale and dated losses. Match all identities, labels and timing to the same route.
6. Run frame-count/continuity checks, audio-placement verification, visual safe-zone review and a muted explanatory pass; export a short preview. Full export follows only after those representative checks.

## MVP fallback

- Use numbered static server cards with version changes and a single moving order card; pool repeated packets rather than creating millions of objects.
- Keep scenes 5–6 as two clean software panels plus one activation marker and one broken feedback line. Preserve the mechanism even if other animation is minimal.
- Scene 7 may show three sequential fleet states (updated, rollback, activated legacy paths); scene 8 may use a fixed monitor diagram with a disconnected gate.
- Show exact figures as dated cards rather than an animated market chart. No stock footage, photorealistic trading floor, hardware cutaway, unlicensed music or historical UI reconstruction required.

## Script feedback

- No voiceover changes made. The 210-word script remains verbatim; only its visual column was removed and its source links retained below the table.
- Original table estimates 90s; discovered recordings measure 93.312s. Keep them intact. Clip-to-line mapping still needs listening; a measured duration does not certify exact script adherence.
- «تخيّل زر قديم» must remain clearly a software activation analogy. Show تشبيه on that panel; do not claim someone pressed a physical switch.
- «حتى كي الطلب الأصلي راهو تكمّل» needs a completed customer order beside continuing outgoing orders, not a claim the exchange itself failed to fill trades.
- The later loss figure must remain distinct from the initial $440M announcement and from the 45-minute trading period. No factual rewrite is needed.

## Risks

- Alignment: automatic transcription failed from model memory allocation. Scene and word matching are provisional. Listening is the outstanding requirement before timing can be marked MEASURED end-to-end.
- Reused-style scope: root guide's CAPTCHA color meanings are adapted locally to trading orders and activation signals; do not carry over CAPTCHA-specific source identities or modify that guide.
- Arabic: mixed Latin terms and dollar amounts require RTL/bidi review. All text stays in Remotion; no Manim Arabic dependency. Font names and licenses must be verified at build.
- Historical fidelity: no fake error logs, command lines, P&L trajectories or exact intermediate losses. The 4M value refers to executions. Rollback activates legacy behavior on additional relevant orders, not every request.
- Safety-lesson visuals: label the final checklist الدرس so hypothetical safeguards are not confused with installed historical controls.
- Performance: few pooled packet sprites and 8 persistent server cards suffice; avoid particle swarms or a camera flying through hardware.
- Assets/audio: no music or third-party image license has been assumed. Narration remains untrimmed and primary; watch peak levels if SFX are later added.

## Source notes

- [Knight's August 2, 2012 announcement](https://www.sec.gov/Archives/edgar/data/1060749/000119312512332176/d391111dex991.htm): initial realized pre-tax loss of approximately $440 million.
- [SEC order](https://www.sec.gov/Archives/edgar/data/1569391/000119312513401173/d613486dex101.htm): eight servers, reused flag, defective completion tracking, deployment and rollback failures.
- [SEC press release](https://www.sec.gov/newsroom/press-releases/2013-222): later loss above $460 million, approximately 45-minute incident and inadequate safeguards.
