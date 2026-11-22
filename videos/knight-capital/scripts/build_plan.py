"""Write the separated script and reviewable planning artifacts, not a render."""
import json
import math
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
plans = root / "plans"
plans.mkdir(exist_ok=True)
script_path = root / "scripts" / "knight-capital.md"
script = script_path.read_text(encoding="utf-8")
original_voice = json.loads((root / "analysis/original-voiceover.json").read_text(encoding="utf-8"))
lines = []
in_script = False
for line in script.splitlines():
    if line == "## Script":
        in_script = True
    elif line.startswith("## "):
        in_script = False
    if in_script and line.startswith("|"):
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        line = "| " + " | ".join(cells[:4]) + " |"
    lines.append(line)
script = "\n".join(lines) + "\n"
script = script.replace("script and animation directions only; no recording supplied. Times are provisional until voiceover is recorded.",
    "Script separated from visual planning; recordings discovered in inputs/. Original script times remain estimates; see ../plans/knight-capital-plan.md for measured clip lengths and provisional alignment.")
script = script.replace("checked against primary sources linked above.", "checked against the primary sources below.")
script = script.replace("Timing remains an estimate pending the creator's recording.", "Timing remains an estimate pending review and alignment of the supplied recordings.")
source_lines = [
    "- [Knight announcement, August 2, 2012](https://www.sec.gov/Archives/edgar/data/1060749/000119312512332176/d391111dex991.htm): initial $440 million realized pre-tax loss.",
    "- [SEC order, October 16, 2013](https://www.sec.gov/Archives/edgar/data/1569391/000119312513401173/d613486dex101.htm): deployment, legacy code, rollback and controls findings.",
    "- [SEC incident summary](https://www.sec.gov/newsroom/press-releases/2013-222): approximately 45-minute incident and later loss above $460 million.",
]
if source_lines[0] not in script:
    script += "\n" + "\n".join(source_lines) + "\n"
voice_rows = [line.split("|")[3].strip() for line in script.splitlines()
              if re.match(r"^\| \d+ \|", line)]
assert voice_rows == original_voice, "Narration changed"
assert "Visual / animation" not in script
script_path.write_text(script, encoding="utf-8")

recordings = json.loads((root / "analysis/recordings.json").read_text(encoding="utf-8"))
clips = recordings["clips"]
# Each cue is an ESTIMATED visual onset tied to a phrase, not a forced alignment.
# The same order path and numbered server identities persist across scenes.
design = [
    ("IncidentHook", "hook", "S", "server واحد، كارثة بالملايين",
     "Story / scale: one server with an unexplained loss; creates a question without inventing intermediate dollar values.",
     [(0, "server واحد", "Server card already entering on frame one; orange fault edge draws"),
      (1.8, "ومئات الملايين", "Loss label appears beside the card; keep exact dollar amount covered"),
      (3.2, "راحو", "Freeze the loss label and move the same card toward the future grid anchor")], "One quiet low impact on the loss label"),
    ("OrderJourney", "explain", "M", "أوامر تتبعث في لحظات",
     "Invisible process: a customer order travels through the company to an exchange. Blue always means an order, never a good software version.",
     [(0, "في أوت ألفين واثناش", "Date chip appears above the persistent server; no logo intro"),
      (2.8, "Knight Capital", "Company label snaps onto the middle node; reveal exchange below"),
      (5.5, "أوامر شراء وبيع", "Blue BUY/SELL cards move downward; accelerate only on بسرعة كبيرة")], "One soft routing click; music optional/off"),
    ("IncidentScale", "open loop", "M", "45 دقيقة، ملايين العمليات",
     "Story / number: distinguish incoming customer requests from executed trades. Compression illustrates activity, not real-time trading speed.",
     [(0, "فتح السوق", "09:30 market-open chip; ordinary order path stays visible"),
      (2.7, "أوامر غالطة", "Repeated blue order cards gain orange fault outlines and multiply"),
      (5.6, "خمسة وأربعين دقيقة", "Span card 45 دقيقة, then approximately 4M executions on its spoken phrase; add small why-question marker")], "Quiet clock click; no constant ticking"),
    ("DeploymentGrid", "aha", "M", "سبعة تحدّثوا، واحد بقى",
     "Sequence / comparison: reveal the missed deployment. Eight numbered cards are one grouped fleet, not eight equally prominent diagrams.",
     [(0, "واش صرا؟", "Rewind tab قبل فتح السوق; retain server identity from hook"),
      (2.8, "ثمانية servers", "Build two columns of four cards in reading order, one card per short stagger; label as computers running software"),
      (5.5, "سبعة تحدّثوا", "Version labels on cards 1–7 become جديد; 8 remains قديم in neutral gray"),
      (8.4, "والثامن فاتوه", "Orange missing-update ring on 8; second-review checkbox remains blank")], "One quiet click on server eight; no eight separate SFX"),
    ("FlagComparison", "open loop", "L", "نفس الزر، خدمة مختلفة",
     "Abstract concept / comparison: hardest idea part 1. Same violet activation signal, different installed versions, different functions. Software analogy only; no physical server interior.",
     [(0, "بصح علاش", "Dim seven cards and move 8 into focus; retain fleet breadcrumb"),
      (3, "Power Peg", "Open an application panel labelled Power Peg / كود قديم, not a circuit board"),
      (6.2, "زر قديم", "Show conceptual switch with small تشبيه label; attach old-version function"),
      (9.3, "لوظيفة جديدة", "Add NEW-version panel alongside OLD; same violet switch routes to a different function in each")], "Quiet reveal click only after the question"),
    ("CompletionFailure", "explain", "L", "الطلب كمل، الأوامر تواصلت",
     "Invisible process / cause and effect: hardest idea part 2. A reused software flag activates legacy code; the router does not receive completion information.",
     [(0, "الإشارة", "Violet activation marker reaches both versions; label same input with different destinations"),
      (3, "الكود القديم في الثامن", "Old function activates on server 8; its outgoing cards stay blue with orange fault marks"),
      (6, "بقى يبعث أوامر", "Repeated order sends continue from the legacy function; leave the customer card in view"),
      (8.8, "الطلب الأصلي راهو تكمّل", "Customer-order card gains مكتمل; completion feedback stops at a broken connector while outgoing orders continue")], "Soft completion click, followed by continued quiet packet motion; no alarm loop"),
    ("RollbackSpread", "aha", "M", "محاولة الإصلاح كبّرت المشكل",
     "Story / sequence: the attempted rollback exposes legacy behavior on additional servers. Some eligible orders activate it; never imply every order is faulty.",
     [(0, "والأسوأ؟", "Hold current fault for a beat; reveal repair action above fleet"),
      (2.8, "نحّاو التحديث", "Remove NEW badges from 1–7 in a short stagger; do not disconnect server 8"),
      (5.7, "حتى فيهم", "Violet activation markers trigger further old paths; orange fault outlines spread"),
      (8.5, "الأوامر ما زالت تخرج", "Repair pointer pauses while the same order stream continues below")], "One restrained impact when fault spreads"),
    ("ControlGap", "explain", "M", "وين راهي الحماية التلقائية؟",
     "Structure / cause and effect: monitoring exists, but its readings do not adequately block orders. No claim of zero safeguards.",
     [(0, "علاش الغلطة كبرت", "Group fleet into one node and reveal its outgoing path"),
      (3, "نظام حماية كافي", "Monitoring meter reads rising exposure; show disconnected link to a blocking gate"),
      (6.3, "مع كل دقيقة", "More fault-marked orders pass while exposure rises; no fabricated dollar ticks")], "No new SFX; let narration carry the explanation"),
    ("LossAndRecap", "recap", "M", "الإعلان الأولي: $440 مليون / لاحقًا: أكثر من $460 مليون",
     "Number / recap: settlement losses are a consequence of the trading interval. Present the two documented figures as dated reports, then recap the chain before the closing lesson.",
     [(0, "كي صفّاو الصفقات", "Close-out cards settle; separate settlement from the 45-minute trading span"),
      (2.9, "ربعمية وأربعين", "Show $440M with الإعلان الأولي and 2012-08-02; small caption قبل الضرائب"),
      (5.9, "التحقيق الرسمي", "Add SEC 2013 and >$460M only when the later finding is introduced"),
      (8, "أكثر من ربعمية وستين", "After the number lands, show recap: تحديث ناقص → كود قديم → أوامر متكررة. Hold about 2.4s if phrase timing permits")], "Two very soft report clicks; no cash-register joke"),
    ("SafeguardSummary", "save frame", "M", "لازم تعرف كيفاش توقفو",
     "Advice / save frame: show conceptual prevention steps, clearly separated from the historical reconstruction. End echoes the first server card.",
     [(0, "server واحد فاتوه", "Return to server 8 and the hook composition; label takeaway الدرس"),
      (2.7, "الدرس؟", "Build three short checklist lines: تحقق من التحديث / راقب الأوامر / وقف الخطر. Keep all three readable through +6.6s"),
      (5.3, "كيفاش توقفو", "Close conceptual order gate on the emphasized stop word; checklist itself remains still"),
      (6.6, "كي يغلط", "After the spoken lesson completes, show the sole CTA واش أول حماية تزيدها؟; server returns toward opening pose; quiet Runtime.tech mark")], "Quiet stop click; no additional sting"),
]

fps = 30
scenes = []
for i, (clip, details, voice) in enumerate(zip(clips, design, voice_rows), 1):
    component, role, effort, heading, representation, cues, sound = details
    start_frame = round(clip["startSec"] * fps)
    end_frame = math.ceil(clip["endSec"] * fps) if i == len(clips) else round(clip["endSec"] * fps)
    events = []
    for offset, phrase, action in cues:
        frame = min(end_frame - 1, start_frame + round(offset * fps))
        events.append({"timing": "ESTIMATED", "atFrame": frame,
                       "atSec": frame / fps, "phraseAnchor": phrase,
                       "action": action, "visualLeadFrames": 9,
                       "estimatedEmphasisFrame": min(end_frame - 1, frame + 9)})
    scenes.append({"id": i, "startSec": start_frame / fps, "endSec": end_frame / fps,
                   "startFrame": start_frame, "endFrame": end_frame,
                   "timing": "ESTIMATED", "voiceover": voice,
                   "component": component, "props": {"effort": effort,
                       "representation": representation, "events": events,
                       "audioClip": "../inputs/" + clip["file"]},
                   "onScreenText": heading, "sfx": [sound], "tool": "remotion", "role": role})

timeline = {"fps": fps, "width": 1080, "height": 1920, "timing": "ESTIMATED",
    "audioTiming": "MEASURED", "alignmentStatus": recordings["alignment"],
    "alignmentNote": "One clip per script beat is inferred from filenames, not verified by listening. ASR model allocation failed. Preserve script and all source audio; re-anchor events by ear before animation.",
    "audioDurationSec": recordings["totalDurationSec"], "durationInFrames": scenes[-1]["endFrame"],
    "durationSec": scenes[-1]["endSec"], "frameIntervals": "[startFrame, endFrame), end exclusive",
    "audioPlacement": "Use the exact cumulative sample offsets below, not independently rounded scene starts. Keep all audio and original clip silence. Final frame padding is visual-only.",
    "audioClips": [{"scriptBeat": c["scriptBeat"], "source": "../inputs/" + c["file"],
                    "startSec": c["startSec"], "endSec": c["endSec"],
                    "durationSec": c["durationSec"], "sampleRate": c["sampleRate"],
                    "samples": c["samples"], "sha256": c["sha256"]} for c in clips],
    "captions": {"mode": "short_headings_only", "fullNarrationCaptions": False},
    "styleFile": "style.md", "scenes": scenes}
(plans / "knight-capital-timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=2), encoding="utf-8")

style = """# Runtime.tech — Knight Capital style

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
"""
(plans / "style.md").write_text(style, encoding="utf-8")

header = f"""# Plan: Knight Capital — the missed server

- Promise: يفهم المشاهد كيفاش تحديث ناقص في server واحد، مع غياب الحماية الكافية، ولّى كارثة بمئات الملايين.
- Audience: general | Length: {timeline['audioDurationSec']:.3f}s audio / {timeline['durationSec']:.3f}s picture | Timing: ESTIMATED scene alignment, MEASURED clip lengths
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
"""
table = []
for scene in scenes:
    motions = "; ".join(f"ESTIMATED +{e['atSec']-scene['startSec']:.1f}s: {e['action']}" for e in scene["props"]["events"])
    table.append(f"| {scene['id']} | ESTIMATED {scene['startSec']:.3f}–{scene['endSec']:.3f} | {scene['voiceover']} | {scene['props']['representation']} | {motions} | {scene['onScreenText']} | {scene['sfx'][0]} | Remotion / {scene['props']['effort']} | {scene['role']} |")

event_times = sorted({e["atSec"] for s in scenes for e in s["props"]["events"]})
boundaries = event_times + [timeline["durationSec"]]
longest = max(b - a for a, b in zip(boundaries, boundaries[1:]))
counts = []
for start in range(0, math.ceil(timeline["durationSec"]), 10):
    end = min(start + 10, timeline["durationSec"])
    counts.append(f"ESTIMATED {start}–{end:.3f}s: {sum(start <= t < end for t in event_times)} changes")

footer = """

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

RETENTION_COUNTS

- Longest planned stretch between meaningful visual changes: **LONGEST_STATICs**. Scene entrances count because they introduce a new explanatory state; continuous decorative motion alone does not count.
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
""".replace("RETENTION_COUNTS", "\n".join("- " + item for item in counts)).replace("LONGEST_STATIC", f"{longest:.3f}")
(plans / "knight-capital-plan.md").write_text(header + "\n".join(table) + footer, encoding="utf-8")

brief_path = root / "brief.md"
brief = brief_path.read_text(encoding="utf-8")
brief = brief.replace("Script drafted; animation and recording not started.", "Script and visual plan drafted; ten recordings found; audio content/order review pending; animation not started.")
brief = brief.replace("Recording files: None supplied.", "Recording files: Ten OGG files in inputs/. Measured total 93.312s. Timestamp-named clip followed by clips 2–10 is the provisional mapping; verify by ear.")
brief = brief.replace("Illustrated 2D; pale neutral canvas, blue normal flow, orange failures, dark outlines, Tajawal Bold. Provisional script direction; no full storyboard or artwork produced.", "Reuse the existing Runtime.tech dark illustrated 2D visual system; blue order cards, violet activation signals, orange faults, Noto Sans Arabic/Manrope. See plans/style.md and plans/knight-capital-plan.md. No artwork rendered yet.")
brief = brief.replace("Script, beat-level animation directions and publishing kit only.", "Separated script, publishing kit, scene-by-scene visual plan, local style mapping and timeline JSON. No animation/export requested in this step.")
brief = brief.replace("Approximately 90 seconds; confirm from recording.", "93.312s measured audio; 2800 frames (93.333s) planned picture at 30fps. Scene assignments and word cues remain ESTIMATED until listening review.")
artifact_line = "- Planning artifacts: `plans/knight-capital-plan.md`, `plans/knight-capital-timeline.json`, `plans/style.md`. Audio evidence: `analysis/recordings.json`."
if artifact_line not in brief:
    brief += "\n" + artifact_line + "\n"
brief_path.write_text(brief, encoding="utf-8")

# Artifact checks: these validate saved deliverables, not animation behavior.
assert len(scenes) == len(original_voice) == len(clips) == 10
assert scenes[0]["startFrame"] == 0
for i, scene in enumerate(scenes):
    assert round(scene["startSec"] * fps) == scene["startFrame"]
    assert round(scene["endSec"] * fps) == scene["endFrame"]
    assert scene["endFrame"] > scene["startFrame"]
    assert scene["voiceover"] == original_voice[i]
    if i:
        assert scene["startFrame"] == scenes[i-1]["endFrame"]
    assert all(scene["startFrame"] <= e["atFrame"] < scene["endFrame"] for e in scene["props"]["events"])
assert timeline["durationSec"] >= recordings["totalDurationSec"]
assert timeline["durationSec"] - recordings["totalDurationSec"] < 1 / fps
assert longest <= 6
assert all(len(line.strip().strip("|").split("|")) == 4 for line in script.splitlines() if re.match(r"^\| \d+ \|", line))
assert "Claude DZ" not in header + footer + style
print(json.dumps({"voiceoverUnchanged": True, "voiceoverWords": sum(len(v.split()) for v in voice_rows),
    "scriptColumns": 4, "scenes": len(scenes), "audioDurationSec": recordings["totalDurationSec"],
    "pictureFrames": timeline["durationInFrames"], "maxVisualChangeGapSec": longest,
    "timing": timeline["timing"], "output": str(plans)}, ensure_ascii=False, indent=2))
