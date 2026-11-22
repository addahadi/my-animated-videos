# Plan: GTA 6 for PC, free? Every download is a trap

- Promise: there is no GTA 6 for PC or Android, so any "free GTA 6 PC/APK" file is a trap that can steal your accounts, and here are 3 signs to spot it.
- Audience: general | Length: 64.46 s (1,934 frames), measured from `videos/GTA_6/narration-master.wav` (62.46 s of speech plus a 2.0 s end-card tail)
- Visual spine: **one link card** from the first frame, "GTA 6 PC · FREE · 2.1 GB" sent by "صاحبي". We follow it the whole way: it gets stamped كذب, drops the fake files, the thief comes out of it, it gets resent to five friends, and it comes back for the payoff. Everyone has received a link like this, and because the same object stays on screen the beat 5 reveal ("this is how it reached you") lands as a closed loop.
- Hardest idea: how a stolen cookie gets someone into your account without your password. The visual: the yellow cookie **TicketChip**, reused from the cookies video so returning viewers recognise it, is held up to a login gate. The password field is struck out, the gate opens for the ticket alone, and the profile card flips to show the thief behind your avatar. A small footnote "* ماشي ديما" keeps the simplification honest.
- Style: reuses `plans/style.md`.
  - Light report canvas for the story.
  - Dark blueprint canvas for what happens inside the malware (scenes 6, 7 and 10).
  - Red always means fake, trap or stolen. Green only means official platform or access granted.

## Lessons applied from the Instagram analysis (reports/instagram-analysis-2026-11-17.html)

| Finding | How this plan applies it |
|---|---|
| The Reels that got pushed opened on a lived moment; cookies stalled on an abstract claim | Frame 1 is a phone receiving a link from a friend, with something suspicious on screen in the first second. No definitions before 20 s. |
| Stalled Reels averaged a 6.1 s watch | The big payoff, the red **كذب** stamp, lands at 6.15 s, right where viewers dropped off. The hook ends on a 0.45 s cliffhanger first. |
| Make it a named verdict series | A "صح ولا كذب؟" header chip runs through the middle scenes. The end card says "صح ولا كذب؟ · 01" and teases the next episode, so there is a reason to follow. |
| The only Reel with real saves had a reference checklist | Scene 11 is a 3-row checklist card, complete for about 4.5 s, with a silent "سيفيها" pin. |
| Shares are near zero | The spread scene (9) shows the viewer how the link travels between friends, and the closing line sends the video to a specific friend. |

## Cover frame
- The link card with the red **كذب** stamp across it, with a neon-city thumbnail and no logos.
- Cover text in Tajawal 800: **GTA 6 PC مجانا؟ كذب**.
- Light canvas, readable as a 3-column grid thumbnail.
- It is the same frame as 0:06, so the cover promises exactly what the video delivers.

## Recorded wording (draft ASR, check by ear before captions)
The recording differs slightly from `scripts/gta6-fake-download.md`. The meaning is the same, so the visuals and captions follow **the recording**:
- Line 1: "صاحبك بعثلك lien فيه: حمّل GTA 6 للـPC **مجانا**. زعما صح ولا كذب؟" (in place of "بلاش، téléchargement direct").
- Line 2: opens with "**ماكاش منها**" in place of "كذب". The on-screen stamp still says كذب, as the series verdict.
- Line 3: "...**ماهيش اللعبة الأصلية. بصح** السؤال: واش كاين داخل هذا الـfichier؟"
- Line 8: "GTA 6 PC؟ **ماكاش منها**" in place of "بلاش؟ كذب".
- `audio4.ogg` and `audio5.ogg` are two takes of the same line (infostealer).
  - Used: **audio5**, the later take with clearer articulation.
  - Not used: audio4.
  - To switch takes, edit `CLIPS` in `videos/GTA_6/make_master.py`.

## Storyboard
| # | In-Out (s) | Voiceover (Darija, as recorded) | Representation (what and why) | Motion and build steps | On-screen text | SFX / music | Tool | Role |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.00-6.35 | صاحبك بعثلك lien فيه: حمّل GTA 6 للـPC مجانا. زعما صح ولا كذب؟ | `DeviceMock` with a chat from "صاحبي" and a link card. This is the lived moment, and the spine object is born here. | Frame 0: the phone is already rising and buzzing, and the bubble slides in. At 0.28 the card unfolds. At 1.68 the DOWNLOAD chip pulses and the cursor glides toward it. At 3.40 a yellow مجانا sticker appears. At 4.38 two buttons pop up, صح in green and كذب in red, with the cursor between them. From 5.90 there is a 0.45 s freeze. | GTA 6 PC مجانا؟ | buzz, pop, pop-soft; music starts low | Remotion | hook |
| 2 | 6.35-9.70 | ماكاش منها. GTA 6 خرجت غير على PS5 و Xbox | A red **Stamp كذب** slams onto the card: the verdict arrives early, at the drop-off point. Then a platform row with generic console boxes (text labels only) and green checks. | At 6.15 the stamp hits. At 7.01 the card shrinks to the top. At 8.53 the PS5 check appears, and at 8.85 the XBOX SERIES check. | كذب | stamp, pop, ding | Remotion | aha |
| 3 | 9.70-12.70 | ما كاين حتى نسخة PC، وما كاين حتى نسخة Android | A PC monitor and a phone slide into the same row and get red crosses. The comparison is visible with the sound off. | At 10.55 the PC gets an `XStamp`. At 11.81 the phone gets an ANDROID `XStamp`. | PC ❌ Android ❌ | hit ×2 | Remotion | explain |per
| 4 | 12.70-18.47 | إذن أي fichier مكتوب عليه GTA 6 PC ولا GTA 6 APK... ماهيش اللعبة الأصلية. بصح السؤال | An invented fake download page in a `BrowserCard` at "gta6-free-pc.download", with three flashing DOWNLOAD buttons and a countdown. Two file chips drop out of it. | At 12.52 the page drops in. At 13.73 the GTA6_Setup.exe chip falls. At 15.53 the GTA6.apk chip falls. At 16.23 a red "ماشي اللعبة" sticker covers both. | ماشي اللعبة | whoosh, pop ×2, strike | Remotion | explain |
| 5 | 18.47-20.31 | واش كاين داخل هذا الـfichier؟ | The camera pushes into the .exe and an X-ray scanner frame slides over it. Behind the scan line a blurred figure is barely visible, with a red "?". This is the open loop. | At 18.17 the zoom starts and the scanner frame appears. At 19.60 the "?" pulses while the scan line keeps sweeping. | واش داخلو؟ | zoom, lock | Remotion | open loop / re-hook |
| 6 | 20.31-26.78 | في بزاف الحالات، كاين برنامج اسمو infostealer، يعني سارق. كي تفتحو، يقرا الـpasswords المسجلين في الـbrowser | (Revised after review.) An X-ray view of the file on the dark blueprint. The game controller you expected is crossed out, and a thief is inside the file, with `TermLabel` INFOSTEALER = يعني سارق. On "كي تفتحو" a cursor double-clicks the file, the X-ray shrinks to the corner, and **your browser's** saved-passwords panel opens ("الـpasswords اللي سجلتهم"). The thief goes over each row with a magnifier and the ●●●● **turns into the real password**, which shows that it reads them. A copy of each one flies into the thief's bag (`LootBag`, "عند السارق"). | At 20.11 the X-ray and the crossed controller. At about 21.05 the thief appears. At 22.08 the term label. At 23.22 the gloss gets a hit. At 23.70 the double-click and the browser. At 24.94, 25.49 and 26.04 each row is read in turn and its copy flies into the bag. | infostealer = سارق | unlock, pop, scan, tick | Remotion | explain |
| 7 | 26.78-29.08 | ويسرق الـcookies اللي يخليوك connecté | The logged-in row "social.site · CONNECTÉ ✓" drops its yellow cookie `TicketChip`, labelled "تذكرة الدخول", and it goes into the bag. | At 26.73 the row is highlighted and the ticket comes out. At 28.06 the CONNECTÉ pill pulses. At 28.41 the ticket flies into the bag (STOLEN · 4). | تذكرة الدخول | pop, whoosh-short | Remotion | explain |
| 8 | 29.08-33.83 | وبالـcookie هادي، ما يحتاجش حتى الـpassword. يدخل للـFacebook ولا Instagram نتاعك كأنو نتا | The thief holds the ticket up to an ACCOUNT gate. The password field is struck out and the gate opens for the ticket alone. A generic profile card (invented name, no platform logos) flips to show the thief behind your avatar. | At 28.88 the ticket is at the gate. At 30.42 the password field is struck. At 31.31 the gate turns green with WELCOME BACK. At 32.22 the profile card appears. At 33.02 it flips, with the footnote "* ماشي ديما". | يدخل كأنو نتا | pop, strike, unlock, morph | Remotion | aha (hardest idea) |
| 9 | 33.83-38.24 | ويبعث نفس الـlien لصحابك. وهكا وصلك من عند صاحبك | The scene 1 link bubble clones into 5 friend chats. The camera zooms into the last one, and it is exactly the frame-1 chat. | At 34.10 the bubble fans out along `DrawPath`s. At 35.75 the zoom. At 37.28 the match with frame 1 (hit). | وهكا وصلك | whoosh, pop, zoom | Remotion | aha / share moment |
| 10 | 38.24-43.95 | وكاين نوع آخر: يخلي الـPC نتاعك يخدم للـcrypto في الخفية. يسخن، يبطا، والـventilateur ما يحبسش | A PC tower on the blueprint, with a `SpeedDial` CPU gauge, coins flying to a far NOT YOU box, a `Thermometer` turning red, a `SpeedBar` dropping, and a fan spinning faster. | At 38.06 the tower appears. At 39.26 the CPU gauge reaches 100%. At 40.08 the coins start. At 41.27 the heat rises. At 41.78 the speed bar drops. At 42.18 the fan speeds up and the sticker appears. | PC يخدم لغيرك | hum, tick-roll, glow | Remotion | explain |
| 11 | 43.95-55.97 | إذن كيفاش تعرف الـarnaque؟ واحد ... ماشي هي. جوج ... هرب. ثلاثة ... arnaque. | A `MiniUI` checklist card titled "3 علامات الـarnaque" builds one row per spoken point, each with an icon and a red flag. It is the screenshot-worthy save frame. | At 43.77 the title and a 0/3 counter. At 45.85 row 1 (store icon with a cross). At 48.14 its red flag. At 48.70 row 2 (shield switching off). At 51.53 the mini stamp هرب. At 52.23 row 3 (number field and coin). At 54.15 the ARNAQUE stamp. From 54.97 to 55.97 the full card holds with a silent "سيفيها" pin. | 3 علامات الـarnaque | pop ×3, stamp ×2, ding | Remotion | save frame |
| 12 | 55.97-60.65 | GTA 6 PC؟ ماكاش منها. الـcrack هذا ما يسرقش اللعبة... يسرقك نتا | The frame-1 link card returns with its red كذب stamp. A headline types "ما يسرقش اللعبة", then اللعبة is struck out and replaced by "يسرقك نتا" in red. | At 55.77 the card and stamp return. At 57.87 the headline starts typing. At 59.13 the strike and replacement (hit). | يسرقك نتا. | stamp, type, strike, hit | Remotion | aha / payoff |
| 13 | 60.65-64.46 | ابعث الفيديو لصاحبك اللي راهو يستنى فيه. | A send arrow flies the link card into a chat labelled صاحبك. Then the end card: the Runtime.tech wordmark with a `ScanLine`, the pill "صح ولا كذب؟ · 01", the teaser "الجاي: كيفاش ترجع الـaccount" and a FOLLOW button. | At 60.40 the send arrow. At 62.46 the end card. At 64.06 a chat bubble pops in at the frame-1 position, so the video loops. | ابعثها لصاحبك | whoosh, pop, ding | Remotion | CTA (share) + follow |

Times are master-track seconds. Events lead the word by about 0.25 s, and hits lead by 0.2 to 0.3 s. Exact frames are in `plans/gta6-fake-download-timeline.json`.

## Engagement map
- **Hook (0-2 s):** on frame 0 a phone buzzes and a link from صاحبي arrives. "GTA 6 PC مجانا؟" is readable with the sound off.
- **Open loops:**
  - The صح / كذب buttons at 4.4 s are answered at 6.15 s.
  - "واش داخلو؟" with the locked chip at 18.2 s is answered at 20.1 s.
  - "Why did a friend send it?" (frame 1) is answered at 37.3 s.
- **Re-hooks:**
  - The verdict stamp at 6.15 s.
  - The jump to the dark "inside the file" canvas at 20.1 s.
  - "Type 2" at 38.1 s.
  - The checklist at 43.8 s.
- **Save frame:** the 3-row checklist. It is complete from 52.5 s, the ARNAQUE stamp lands at 54.2 s, and it holds for 1 s with no voice. It carries a silent pin chip, not a spoken "save" request.
- **Comment prompt:** the pinned comment from the script ("شكون فيكم وصلو lien نتاع GTA 6 بلاش؟ ومن عند شكون؟"). It is not voiced, so the video keeps one spoken call to action.
- **Share moment:** scene 9, where the link spreads to friends, plus the closing line "ابعث الفيديو لصاحبك اللي راهو يستنى فيه". This is the only spoken call to action, and it comes after the payoff.
- **Follow:** in the end card, "صح ولا كذب؟ · 01" and the teaser for the next episode (account recovery, the script's part 2).
- **Loop ending:** the last 0.4 s brings the chat bubble back at its frame-1 position, so the restart looks continuous.

## Retention check
- **Visual changes per 10 s:**

  | Window | Changes |
  |---|---|
  | 0-10 s | 9 |
  | 10-20 s | 8 |
  | 20-30 s | 9 |
  | 30-40 s | 8 |
  | 40-50 s | 8 |
  | 50-60 s | 7 |
  | 60-64 s | 3 |

- **Longest static stretch:** 2.8 s, from row 2 at 48.7 to the هرب stamp at 51.5. During it the card stays alive with the row's red pulse, so no stretch exceeds 6 s.

## Components and assets
| Name | New / existing | Used in scenes | Effort |
|---|---|---|---|
| `GridCanvas`, `HeaderStrip`, `CaptionPill`, `Card`, `Mono`, `ArText` | existing | all | - |
| `DeviceMock`, `StatusBar` | existing | 1, 9, 13 | - |
| `SpeechBubble` | existing | 1, 9, 13 | - |
| `Stamp`, `XStamp`, `StickerPill`, `LockedChip` | existing | 2-5, 11, 12 | - |
| `BrowserCard`, `TicketChip`, `TermLabel`, `ProfileCard` | existing (from cookies) | 4, 6-8 | - |
| `NodeBox`, `DrawPath`, `quadPoint` | existing | 6-10 | - |
| `SpeedDial`, `Thermometer`, `SpeedBar` | existing (from slowdown) | 10 | - |
| `MiniUI` / `MiniRow` | existing | 11 | - |
| **`LinkCard`** (chat link preview: generic thumbnail, title, size, DOWNLOAD chip) | new, reusable for any scam or phishing video | 1, 2, 9, 12, 13 | M |
| **`ConsoleBox` / `PlatformRow`** (generic device boxes with text label + check or cross) | new, reusable for "available on X" claims | 2, 3 | S |
| **`FileChip`** (file icon + Latin filename, wobble) | new, reusable | 4, 5 | S |
| **`ThiefGlyph`** (hooked hand, 3 px ink stroke) | new icon | 6-8 | S |
| **`LoginGate`** (password field + gate that opens) | new, reusable for auth topics | 8 | M |
| **`FanTower`** (PC tower with a spinning fan, speed from the clock) | new | 10 | S |
| **`SeriesPill`** ("صح ولا كذب؟ · NN") | new; the series' recurring element, so build it once | header, 13, cover | S |
| SFX `buzz.wav` | new (missing in `public/sfx/`, add to `make_sfx.py`) | 1 | S |
| Music | royalty-free low tension loop, ducked about 20 dB under voice | all | - |

## Build order
1. Copy `videos/GTA_6/narration-master.wav` to `public/gta6-fake-download/voice.wav`. Build the captions from the **recorded wording** above, after checking it by ear. Register the composition (1,934 frames).
2. Build `LinkCard` and `SeriesPill`, then scene 1 (hook) and scene 2 (verdict stamp).
3. Scenes 11 and 12: the save frame and the payoff.
4. Scenes 8 and 9: the hardest idea and the loop reveal.
5. Scenes 3-7 and 10, then scene 13 (end card).
6. Make the cover still from scene 2's stamped card.

## MVP fallback
- Scene 10 (miner): a static PC tower with only `SpeedDial` and `Thermometer`, no coins or fan.
- Scene 8: drop the profile flip and keep the ticket opening the gate with the password struck out.
- Scene 9: three friend chats instead of five, with a straight cut to the frame-1 chat in place of the zoom.
- Scene 4: one file chip (.exe) with the APK as a text tag.
- Never cut: the scene 2 stamp, the scene 11 checklist, or the scene 12 strike.

## Script feedback
- None needs a re-record. The recorded wording changes (مجانا, ماكاش منها) keep the meaning, and the visuals handle them.
- Optional: in scene 2 the voice says "ماكاش منها" while the stamp says كذب. The series works better if future episodes say the verdict word out loud. For this episode the stamp and the "صح ولا كذب؟" chip carry it.

## Risks
- The **caption text** comes from draft ASR on Darija. Check the four changed lines above by ear before rendering captions.
- **The facts depend on the date.** The video says GTA 6 "خرجت" on PS5 and Xbox only. Confirm on posting day (launch is 19 Nov 2026) that it is out and that no PC version has been announced.
- **No Rockstar, PlayStation or Xbox logos**, art or footage. Platform names appear as plain text only, the neon-city thumbnail is invented, and the profile card uses an invented name with no Facebook or Instagram logos.
- The cookie hijacking is simplified. The "* ماشي ديما" footnote in scene 8 covers it.
- The audio4/audio5 take choice is mine. Tell me if you prefer audio4.
