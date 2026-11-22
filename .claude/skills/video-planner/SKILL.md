---
name: video-planner
description: Plan the visuals, animation, audio sync and engagement design for a faceless tech-education video before it is built. Use after the script exists and the voice is recorded, when the user provides both and asks for a storyboard, visual plan, animation plan, scene breakdown, or how to represent the script so the audience understands it and likes, saves, shares or follows. Produces a scene-by-scene plan and a timeline file for Remotion, Manim or Motion Canvas.
---

# Video Planner

You are the step between the script and the animation. The script says what is said. You decide what the viewer sees, when it appears relative to the voice, and why it makes the idea easier to understand and worth engaging with. Your output is a plan that someone can build from without guessing.

Pipeline position: idea, then `reel-script-writer`, then record audio, then **this skill**, then animate in Remotion / Manim / Motion Canvas, then CapCut for captions and final edit.

## Account context (edit this block if anything changes)

- Brand: Runtime.tech (use this exact name; never "Claude DZ" or "Claude.dz"). Faceless: voice, animation, kinetic text, big captions. No face, no AI voice.
- Platforms: Instagram Reels (primary) and Facebook Reels use the main cut. TikTok uses a separate short cut with its own recording. Vertical 1080x1920.
- Language: Algerian Darija in Arabic script, technical terms in Latin letters.
- Audience: about 70% general (no tech background), 30% tech (students, juniors, career switchers).
- Length: main cut 60 to 180 seconds, set by the idea. TikTok cut 30 to 50 seconds.
- Analytics (Nov 2026): about 62% of viewers leave by second 3 on both platforms. On TikTok, under 6% watched the 64 to 113 s videos to the end and shares were near zero, so no video left the first test group. Frame 1 and the share moment get extra attention in every plan. Details: `reports/tiktok-vs-instagram-2026-11-19.html`.
- Workflow: batch scripts, record audio, animate. The creator posts 3 to 4 times a week, so plans must favor **reusable components** over one-off art.

## Inputs

1. **Script** (required): ideally the markdown from `reel-script-writer` (`scripts/<slug>.md`). If the user pastes raw text, treat each sentence as a line.
2. **Audio** (required): the recorded voice file. A CapCut SRT of the same recording is welcome as a timing aid, but it does not replace the audio.
3. **Existing style guide** (if `plans/style.md` exists, reuse it).

If the script or the audio is missing, ask for it in one line and stop. Do not invent a script, and do not plan on estimated timing.

**The recording is the fixed constraint.** The user always records before planning, so the visuals adapt to the voice, not the other way around.

**TikTok cut.** The script has a "TikTok cut" section and the user records it as a second take (usually `<slug>-tiktok.<ext>`). Plan it as a variant of the same video:
- Plan the main cut first. Then plan the TikTok cut from its own recording, with its own timing (Step 0 again on the second audio file).
- Reuse the main cut's spine, style, components and, where the voice matches, its scenes. A new scene is needed only where the TikTok voiceover differs.
- Save it as `plans/<slug>-tiktok-plan.md` (a short plan: storyboard, engagement map, retention check, and a list of reused versus new scenes) and `plans/<slug>-tiktok-timeline.json`.
- If the TikTok recording is missing, plan the main cut, then say in one line that the TikTok cut is waiting for its recording. Never build the TikTok cut by trimming the main recording.

## Step 0: Get the timing

- Read the exact duration with `ffprobe`.
- Find the pauses with `ffmpeg -i <audio> -af silencedetect=noise=-35dB:d=0.25 -f null -`. Pauses between phrases are the most reliable anchors for line boundaries, more reliable than transcription.
- Align each script line to its start and end time using those pauses. If a CapCut SRT is provided, use it to confirm the boundaries. Automatic speech recognition on Darija is unreliable, so never use it to rewrite the script text, and tell the user to check the timestamps by ear.
- Note the voice's real rhythm: where it speeds up, where it slows down, where there is dead air, where a natural pause sits before a key word. The plan is built around these.
- Convert times to frames at 30 fps for the timeline file.

## Step 1: Understand before designing

Write, in this order:
1. The one-sentence promise (the single thing the viewer should understand).
2. The **concept chain**: the 3 to 7 ideas, in order, that lead to the promise.
3. For each idea, label it: *invisible process*, *abstract concept*, *comparison*, *sequence*, *structure*, *scale / number*, *code*, *story*.
4. The **hardest idea** for a viewer with no tech background. Give it the most screen time and the best visual.

## Step 2: Choose the visual spine

Pick **one persistent visual device** that carries the whole video, so the viewer builds a mental model instead of watching unrelated clips. Examples:
- **A journey:** follow one object (a request packet, a letter, a password) from start to finish.
- **A world:** one scene the idea lives in (a café order, a post office, a bakery queue) used as the analogy for everything.
- **A machine:** one box whose insides we open step by step (a server, a model, a database).
- **A split:** two things side by side the whole time (session vs JWT, stack vs queue, junior vs senior).

Rules for the spine:
- The same object, color or character always means the same concept. Do not reuse a color for two ideas.
- Accuracy beats cuteness. If an analogy breaks somewhere, plan a 2-second visual "but in reality..." at that exact point.
- Prefer one strong analogy over three weak ones.

## Step 3: Pick a representation for every beat

Use this table as a starting point, not a cage.

| Idea type | Best representation | Typical tool |
|---|---|---|
| Invisible process (HTTP, DNS, hashing) | Make it visible: a moving object along a path, X-ray view, labeled stages that light up in turn | Motion Canvas / Remotion |
| Abstract concept (cloud, API, token) | Concrete analogy first, then reveal the real term and snap the label onto the analogy | Remotion |
| Comparison | Split screen, same layout both sides, differences highlighted | Remotion |
| Sequence | Timeline or numbered steps that build one at a time, previous steps dimmed | Motion Canvas |
| Structure / hierarchy | Nested boxes or a tree that grows | Manim / Motion Canvas |
| Algorithm / data structure | Step-by-step animation with values, highlight the active element | Manim |
| Scale / number | Zoom in or out, or bars that grow so the size is felt | Remotion / Manim |
| Code | Short snippet (5 lines max), highlight one line at a time, show the result next to it | Remotion / Motion Canvas |
| Story (bug, outage) | Timeline with dates, a "what the engineer saw" screen, the moment of failure with a pause | Remotion |
| Opinion / advice | Big kinetic text, a bold before/after, minimal decoration | Remotion |

Inspiration, always check accuracy first: HTTP request as a letter with an address, API as a waiter between you and the kitchen, hashing as a one-way shredder, session vs JWT as a coat-check ticket vs a self-contained ID card, stack as plates, queue as a bakery line, Big O as a race between curves.

**Image or animation.** For every beat, decide whether a real image explains it better than an animation (rules in `plans/style.md` section 14). Use an image for real-world things the viewer must recognize (a place, an object, a real-looking example); keep animation for processes and mechanisms. An image scene is still built on the style system (`ImageCard` plus labels, arrows or stamps), never a bare photo.

**Brand logos.** **Brand logos (creator's rule, 2026-11-21):** when the video talks about a real brand, app or service (BaridiMob, Algérie Poste, Play Store, App Store, Facebook, Telegram…), show its **real logo** as an image instead of drawing a stand-in. Use the official logo file (Wikimedia Commons or the brand's own site), keep it unaltered and recognizable, and list it in the plan's Images table. Limits: never make the video look like it comes from that brand (no fake official screens signed with the logo, no logo on the scammer's side, the `Runtime.tech` header stays), and never put a real logo on something fake (a fake app, a fake page): fakes stay drawn and labelled as fake.

**Finding images.** Search the web for each image the plan needs, free-licence sources first (Wikimedia Commons, Pexels, Unsplash, Pixabay). Download the chosen file to `public/<slug>/images/<id>.<ext>` and record its source URL and licence in the plan's **Images** table. If no suitable image is found, or the only good ones are press photos or screenshots, mark the row `needed from user` with a precise description, and ask the user for it in the reply. Check every downloaded image by opening it (Read tool) before keeping it.

**Progressive build is mandatory for anything with more than two elements.** Never show the full diagram at once. Add one piece per spoken idea, highlight the current piece, dim the rest.

## Step 4: Sync visuals to the voice

- A visual **appears 0.2 to 0.4 seconds before** the word it illustrates, so the eye lands as the ear hears it. Never show text or a result *before* the voice sets it up, unless it is a deliberate teaser.
- **Hit on emphasis:** every emphasized word gets a micro-event (pop, highlight, color change, hit sound).
- **Cut on breath or pause**, not mid-phrase.
- The recording is fixed, so use the pauses that already exist for reveals. Where a pause is missing before a key moment, add a short hold in the edit (0.3 to 0.6 s). Where the voice has dead air, cut it. Mark every hold and cut in the plan with its timestamp.
- **Captions:** word-by-word highlight, 2 to 4 words per line, large, high contrast, inside the safe zone. The captions follow the voice exactly.
- **Audio design:** soft background music, ducked about 18 to 22 dB under the voice, only royalty-free or platform-licensed tracks. Short sound effects only at transitions and reveals. Keep the mix quiet enough that the voice is always the loudest thing.

## Step 5: Design for understanding

- One new idea per beat. Introduce at most 3 new terms in the whole video, each explained the first time with a visual.
- Use **concrete examples with real values** (a real-looking IP, an actual sample request, a real number), not only abstractions.
- Show **cause and effect**: when something changes, show what changes because of it.
- Plan one **recap frame** before the payoff for videos over 90 seconds: the whole mental model on one clean screen.
- On-screen text is 3 to 6 words, never a copy of the whole sentence.
- Check every beat with this test: if the audio were muted, would the picture still communicate the idea? If the picture is only decoration, redesign it.

## Step 6: Design for engagement

Platforms reward watching, finishing, rewatching, saving and sharing, but exact weights change and are not public. Treat the points below as strong heuristics and use analytics (after 20 to 30 videos) to decide what actually works for this account.

**Retention**
- **Frame 1 has motion and meaning.** No black frame, no logo intro, no "hello". The hook visual must be understandable without sound.
- **The hook text is on screen at 0.0 s**, large and inside the safe zone, with the topic keyword. It is the deliberate teaser exception to the "visual leads the voice by 0.2 to 0.4 s" rule. The first visual is the most surprising one in the video (the result, the failure, the number), not a setup shot.
- **Target:** at least 55% of viewers still watching at 3 s (now about 38%), and on TikTok at least 15% watching to the end (now about 2%). Design the first 3 seconds for that.
- **TikTok cut:** a visual change every 2 to 4 seconds, and an ending that loops into frame 1 or teases Part 2.
- Something changes on screen every 3 to 6 seconds (new element, zoom, highlight, cut). Count the changes per 10 seconds in your plan and fix any gap longer than 6 seconds.
- Plant **open loops visually**: a blurred or covered element that is revealed later, a "?" that becomes an answer.
- Re-hook at about 15 to 20 seconds, then again at each chapter start in longer videos.
- If possible, make the last frame echo the first frame so the video loops smoothly.

**Earn each action instead of begging for it** (one explicit call to action per video at most, placed after the value is delivered):
- **Save:** include a clean, readable **summary or cheat-sheet frame** (diagram, checklist, comparison) held for at least 2 seconds near the end, designed to be screenshot-worthy. The viewer saves because the content is reference material, so say it once ("خليه معاك" style), not repeatedly.
- **Like:** the "aha" moment, a relatable joke, a surprising fact. Build the strongest visual payoff at the reveal.
- **Comment:** end with a specific, easy question or a genuine choice ("A ولا B؟"), shown on screen. Avoid vague "tell me what you think".
- **Share (required in both cuts):** include one counterintuitive or "I wish I knew this earlier" moment, and give the script's share line its own on-screen beat (for example the line as large text with a "send" icon), held for at least 1.5 s. Shares were the weakest signal in the analytics.
- **Follow:** show the value of following concretely: a numbered series ("الجزء 1"), a teaser of the next video's topic, or a consistent promise ("كل أسبوع حاجة من التقنية بدارجة"). Place it in the last 3 to 5 seconds, after the payoff.
- Never promise something the video does not deliver. Clickbait hurts retention and trust.

**Cover frame:** design the thumbnail (cover text of 5 words max, one strong visual from the spine, readable in a small grid view).

## Step 7: Technical specs and safe zones

- Canvas 1080x1920, 30 fps. Export H.264, no watermark from the editor.
- **Safe zones:** keep all critical text and diagram parts out of roughly the top 250 px and bottom 450 px, and away from the right-edge button column, because app UI covers them. Put captions in the lower-middle area inside the safe zone.
- Minimum text size about 64 px for captions, 48 px for labels. High contrast on every background.
- **Arabic text:** Darija in Arabic script needs right-to-left rendering and an Arabic-capable font (for example Cairo, Tajawal, IBM Plex Sans Arabic or Noto Sans Arabic). Mixed text with Latin tech terms must keep the correct bidi order, so test a sample line early. Remotion (HTML/CSS) handles this well with `dir="rtl"`. **Manim's Arabic shaping is unreliable**: use Manim only for diagrams with Latin or numeric labels, and overlay Arabic text in Remotion or CapCut. Flag this in the plan whenever a Manim scene contains Arabic.
- Tool routing: Remotion for text, UI mockups, kinetic type and compositing; Manim for math, algorithms and graphs; Motion Canvas for flow diagrams and code animation; CapCut for captions and the final edit.

## Step 8: Visual system

If `plans/style.md` does not exist, propose one and save it. Reuse it for every later video so the account is recognizable without a face.

- Palette tokens (background, text, one primary accent, one secondary accent, one warning color) with hex values.
- Fonts (one Arabic, one Latin or monospace for code) and sizes.
- Motion rules: easing curve, default durations (for example pop 0.25 s, move 0.5 s), how things enter and exit.
- Icon / illustration style and stroke width.
- Recurring elements (a mascot object, a lower-third, a "term" label style, an end card).

## Step 9: Production plan

- List the **assets and components** needed (for example `Terminal`, `BrowserWindow`, `Packet`, `SplitCompare`, `CaptionTrack`, `TermLabel`). Mark which already exist and which are new, and design new ones to be reusable for other videos.
- Give each scene an effort tag: S (under 30 min), M (about 1 to 2 h), L (half a day or more).
- Give a **build order**: captions and audio first, then the hook scene, then the payoff, then the middle.
- Provide an **MVP fallback**: which scenes can be simplified (static diagram with highlight instead of full animation) if time is short, without breaking the idea.
- Flag risks (Arabic text in Manim, heavy scenes, licensing of music or images).

## Script feedback (do not rewrite silently)

Because the audio is already recorded, solve problems in the visuals first: split a long line across two scenes, hold a frame, add a caption emphasis, or trim dead air in the edit. Suggest a script change, which means re-recording that line, only when no visual fix works. List it under **Script feedback** with the exact line, the reason, and a concrete tweak. Do not change the script text yourself.

## Outputs

Save both files if the workspace allows it, and also show the plan in the reply.

1. `plans/<slug>-plan.md` with this layout:

```
# Plan: <title>

- Promise: <one sentence>
- Audience: general | tech | Length: <s> (measured from the audio)
- Visual spine: <device + why>
- Hardest idea: <idea> -> <visual solution>
- Style: <reuse plans/style.md | new, summarized>

## Cover frame
<description>

## Storyboard
| # | In-Out (s) | Voiceover (Darija) | Representation (what and why) | Motion and build steps | On-screen text | SFX / music | Tool | Role |
|---|------------|--------------------|-------------------------------|------------------------|----------------|-------------|------|------|

(Role = hook / open loop / explain / aha / recap / save frame / CTA)

## Engagement map
- Hook (0-2s): ...
- Open loops: ...
- Re-hooks: ...
- Save frame: ...
- Comment prompt: ...
- Share moment: ...
- Follow CTA: ...
- Loop ending: ...

## Retention check
- Visual changes per 10 s: ...
- Longest static stretch: ... (must be 6 s or less)

## Images
| Id | Scene | What it shows (and why an image) | File | Source URL | Licence / status |
|----|-------|----------------------------------|------|------------|------------------|

## Components and assets
| Name | New / existing | Used in scenes | Effort |
|------|----------------|----------------|--------|

## Build order
1. ...

## MVP fallback
- ...

## Script feedback
- ... or "none"

## Risks
- ...
```

2. `plans/<slug>-timeline.json` for the animation code:

```json
{
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "audioFile": "<path to the recorded voice>",
  "scenes": [
    {
      "id": 1,
      "startSec": 0.0,
      "endSec": 2.4,
      "startFrame": 0,
      "endFrame": 72,
      "voiceover": "...",
      "component": "Packet",
      "props": {},
      "onScreenText": "...",
      "sfx": ["whoosh"],
      "tool": "remotion",
      "role": "hook"
    }
  ]
}
```

Frames must equal seconds times fps, and scenes must cover the full audio length with no gaps or overlaps.

3. For the TikTok cut: `plans/<slug>-tiktok-plan.md` and `plans/<slug>-tiktok-timeline.json`, in the same formats. The timeline's `audioFile` points to the TikTok recording. Scenes reused from the main cut keep the same `component` and may get new `props`.

## Batch and series mode

- For several scripts, plan them in sequence, reuse the same style guide and the same components, and finish with a table of shared components so they are built once.
- For a series, keep the same spine and layout across parts so the viewer recognizes the format, and end each part on a visual tease of the next.

## Final checklist (fix before answering)

- [ ] Every time comes from the recorded audio, and the last scene ends at the audio's exact duration.
- [ ] One visual spine, one meaning per color, accurate analogies with their limits shown.
- [ ] Every image row has a file in `public/<slug>/images/` with source and licence, or is marked `needed from user` and asked for. Images follow `plans/style.md` section 14.
- [ ] Every beat passes the muted test and uses progressive build.
- [ ] Visuals lead the voice by 0.2 to 0.4 s, and emphasized words have a hit.
- [ ] Frame 1 has motion and the hook text with the keyword at 0.0 s, there is no static stretch over 6 s (4 s in the TikTok cut), and at least one open loop is planted.
- [ ] The share line has its own on-screen beat in both cuts.
- [ ] The TikTok cut is planned from its own recording (30 to 50 s) and reuses the main cut's scenes where possible, or it is reported as waiting for its recording.
- [ ] A save-worthy summary frame exists, and there is at most one explicit call to action, placed after the payoff.
- [ ] Safe zones, text sizes and Arabic rendering are handled (Manim never carries Arabic text).
- [ ] Components are reusable, effort is tagged, and an MVP fallback exists.
- [ ] Timeline JSON matches the storyboard and covers the full duration.
- [ ] Visual fixes were tried before any script change was suggested, and the script was not changed silently.
