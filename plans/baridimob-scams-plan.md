# Plan: كيفاش يسرقولك بريدي موب؟ (BaridiMob scams: the 3 tricks)

- Promise: The viewer recognizes the 3 tricks that empty a BaridiMob account (fake SMS link, fake "new version" app, fake screen over the real app), the one rule that blocks all of them (Algérie Poste never asks for your code), and the 3 steps if it happens.
- Audience: general | Length: 72.77 s (measured from the joined voice track)
- Visual spine: **the journey of your code.** Your code is one yellow chip (`TicketChip` "CODE"). In every trick it leaves the phone and lands in the scammer's `LootBag`. The ending reverses it: the chip goes back into the phone and the balance comes back. One object, one meaning, so the viewer sees that every trick ends the same way: you hand over the code.
- Colors (one meaning each): yellow = your code · red = scammer / fake · blue = the real app (generic wallet, labelled "BaridiMob" as text only) · green = official / safe.
- Images: 2 real photos (hacker cliché, gendarmerie car). Accessibility screen, GAB and SMS are drawn.
- Hardest idea: trick 3, a fake screen drawn over the real app → the real app (blue) opens, a red copy slides down over it, then the camera tilts to a 3D side view showing two stacked layers, the top one labelled "مزيفة". The typed code goes from the top layer to the scammer.
- Style: reuse `plans/style.md`, including the new section 14 (images in `ImageCard`, labelled, slow push-in only).

## Audio (built from the 8 recordings)

The recordings are `videos/barid_mob/instagram/audio1.ogg` … `audio8.ogg`, one per script line. They are joined into `public/baridimob-scams/voice.wav` (48 kHz mono, 72.77 s). The originals are untouched.

Edits made, all silence only, no words cut or reordered:

| Line | Kept from the file (s) | Removed |
|---|---|---|
| 1 | 1.58 – 5.20 | 1.58 s silence before the hook, 0.41 s tail |
| 2 | 0.00 – 8.30 | 0.57 s tail |
| 3 | 1.36 – 12.25 | 1.36 s lead, 0.21 s tail |
| 4 | 0.86 – 12.28 | 0.86 s lead, 0.41 s tail |
| 5 | 1.43 – 19.58 | 1.43 s lead (incl. a click at 0.31 s), 1.24 s tail |
| 6 | 1.70 – end | 1.70 s lead (the file ends right on the last word) |
| 7 | 1.43 – 8.55 | 1.43 s lead, 0.69 s tail |
| 8 | 1.68 – 6.80 | 1.68 s lead, 0.69 s tail |

A 0.30 s gap follows each line, plus 0.60 s of silence at the end for the loop shot. Scene cuts sit in the middle of each gap.

**Check by ear:** the word timings inside each line below come from pauses in the audio, not from transcription. They are close but approximate.

## Cover frame
A light grid canvas. The generic wallet phone fills the center with a huge red "0 DA", and a yellow CODE chip half out of the phone toward a red `LootBag`. Cover text: رسالة من البريد؟ **ما تحلّهاش** (the bold word in red).

## Storyboard

| # | In-Out (s) | Voiceover (Darija) | Representation (what and why) | Motion and build steps | On-screen text | SFX / music | Tool | Role |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.00–3.80 | تخيل: تحل بريدي موب… تلقى صفر دينار. | The shock result first: a generic wallet app (`DeviceMock` + new `WalletScreen`) whose balance falls to 0. Everyone has seen their own balance screen, so it lands without sound. | 0.0: phone already on screen, hook text already up, balance already rolling down from 48 750 DA (motion from frame 0). Slow push-in 1.00→1.03. ~2.3 (on "صفر", check by ear): it hits "0 DA", turns red, red `StickerPill` "0 DA" pops (hit). 2.7: last-transaction row slides in "تحويل −48 750 DA" (invented amount). | بريدي موب: 0 DA ⚠️ (frame 0) | tick-roll → hit | Remotion | hook |
| 2 | 3.80–12.37 | واش صرا؟ ماكانش hacker. انت بيدك عطيت الكود للمحتال… وما حسيتش. وهاذي تصرا بـ 3 حيل، خلينا نشوفوهم. | **Image:** the stereotype "hacker" (`hacker-hoodie.jpg` in an `ImageCard`) gets crossed out, then the real cause: the yellow CODE chip leaving *your* phone. The photo is the cliché everyone pictures, so crossing it out is the twist. | 3.9: phone shrinks to the left, big "؟" pops on "واش صرا" (4.1). 5.2: hacker photo card enters, tilt 2°. 5.8: `XStamp` over it on "ماكانش" (stamp). 6.4: photo exits; yellow CODE chip slides out of the phone toward a red `ThiefGlyph` + `LootBag` and stops halfway at ~8.0 on "عطيت الكود". 9.2: the phone shows a calm green "✓" and a small sticker "ما حسيتش" (irony). 10.1: three numbered pills ١ ٢ ٣ pop one by one (10.3 / 10.8 / 11.3), the last one pulses as an open loop. | واش صرا؟ → ماشي hacker ❌ → انت عطيتهولو 🔑 → 3 حيل | pop, stamp, whoosh, pop×3 | Remotion | open loop |
| 3 | 12.37–23.53 | الحيلة الأولى: SMS يقولك "حسابك راح يتبلوكا، دخل لهاذ اللينك". تدخل… تلقى صفحة تشبه بريد الجزائر بالضبط. بصح هي ماشي. تكتب الكود، والمحتال يقراه في نفس الثانية. | Sequence on the phone: SMS → fake page → code leaves. A magnifier on the URL is the "how to spot it" moment. The SMS is drawn (creator's choice), not a screenshot. | 12.4: header + `ChapterPill` "حيلة 1 · SMS". 13.3: new `SmsNotif` slides down: sender "ALGERIE-POSTE", text "حسابك راح يتبلوكا…", blue link chip. 16.9 ("تدخل"): finger tap, ripple. 17.2: `BrowserCard` builds a fake login in post-office colors, fields appear one by one. 19.7 (pause → "بصح هي ماشي"): new `Magnifier` slides over the URL, showing `poste-dz-verif.xyz`; red sticker "ماشي هي" (hit). 21.2: digits ●●●● type in. 22.2: the yellow CODE chip flies along a `DrawPath` to the `LootBag`; small tag "0.0 s" on "في نفس الثانية". | ① SMS + لينك مزيف | whoosh-short, tap, type, scan, whoosh | Remotion | explain |
| 4 | 23.53–35.27 | الحيلة الثانية: يجيك ميساج في فيسبوك ولا تيليغرام: "نسخة جديدة من بريدي موب، حمّلها من هنا". تحمّل… بصح هاذاك ماشي بريدي موب، هاذاك تطبيق تاع المحتال. بريدي موب الصح تحمّلو غير من Play Store ولا App Store. | A chat message with a download (`LinkCard` + `FileChip`), an icon on the home screen that flips to show the scammer, then a split compare: chat download ❌ vs. official store ✅. The flip makes "it looks the same but isn't" visible. | 23.8: `ChapterPill` "حيلة 2 · تطبيق مزيف". 24.6: generic chat window; two text pills "Facebook" / "Telegram" (text only, no logos). 26.4: `LinkCard` "نسخة جديدة 🔥 حمّلها من هنا" with a DOWNLOAD chip (pulse). 29.1 ("تحمّل"): progress bar fills, a blue wallet icon lands on an `AppGrid` home screen. 29.8 ("ماشي بريدي موب"): the icon flips like a card → red `ThiefGlyph` on its back, sticker "تطبيق المحتال" (hit). 32.1: split screen: left the chat download with `XStamp`, right a generic store box with green ✓ and text "Play Store · App Store". 33.2: green side scales up slightly. | ② تطبيق مزيف في الميساج | pop, tick-roll, morph, stamp, ding | Remotion | explain |
| 5 | 35.27–53.70 | والحيلة الثالثة هي الأخطر، في Android. كي تحل داك التطبيق المزيف، يطلب منك إذن يسموه Accessibility. تقبل… ودروك راهو يشوف واش كاين في الشاشة ويتحكم فيها بلاصتك. تحل بريدي موب، يحطلك فوقو شاشة مزيفة تشبهلو بالضبط. تكتب الكود… بصح راك تكتبو للمحتال. وحتى SMS الكود يقراها. | **Dark blueprint scene** (the mechanism, the hardest idea). A drawn Android Accessibility screen (no free screenshot exists) built on the real layout, so viewers can recognize it on their own phone (Redmi, OPPO, Samsung…): title "Accessibility", a "Downloaded apps" section, and the fake app's toggle switching ON. Then the overlay as two stacked layers in 3D. | 35.3: switch to the dark canvas; `ChapterPill` "حيلة 3 · الأخطر" + yellow sticker "ANDROID". 37.5: the fake app from trick 2 opens. 38.6: the new `AccessibilityScreen` slides up inside the phone; the row "BaridiMob Update" (the fake app, red dot) is highlighted; `TermLabel` "Accessibility = إذن" snaps on. 41.4 ("تقبل"): finger taps the toggle, it flips to ON (red), then an "Allow" dialog is tapped (stamp). 42.0: an eye icon spreads over the whole screen; a ghost cursor moves by itself (42.6–45.0) for "يشوف… ويتحكم". 45.6: the real app (blue) opens. 46.3: an identical red-edged layer slides down over it. 47.2: camera tilts to a 3D side view (new `OverlayStack`): two layers, top labelled "مزيفة", bottom "الصح". 49.2: code ●●●● typed on the top layer. 50.1: the yellow CODE chip goes from the top layer to the `LootBag` ("راك تكتبو للمحتال"). 52.0: an SMS chip "code: 4821" arrives; a dotted arrow copies it to the `LootBag`. | ③ إذن Accessibility = شاشة مزيفة | glow, stamp, scan, morph, whoosh, ding | Remotion | aha |
| 6 | 53.70–59.50 | القاعدة بسيطة: بريد الجزائر ما يطلبش منك الكود. لا في SMS، لا في التيليفون، لا في ميساج. | Back to the light canvas. The rule as one bold sentence, then three channels crossed out one by one, so the viewer has a single rule for all 3 tricks. | 53.8: the three trick icons (SMS, download, layers) sit in a row. 54.4: big `ArText` "بريد الجزائر ما يطلبش منك الكود" types in. 56.4 / 57.3 / 58.2: three pills "SMS" / "تيليفون" / "ميساج", each with a red ✕ landing on its word (lead 0.3 s). 58.9: one `XStamp` over the three trick icons. | ما يطلبوش الكود ❌ | stamp ×3, hit | Remotion | recap |
| 7 | 59.50–66.90 | وإذا صرالك؟ روح لأقرب GAB وبدّل الرقم المربوط بالحساب. عيّط لـ 1530. وأودع شكوى عند الشرطة ولا الدرك. | **Save frame** (`MiniUI` checklist). The GAB is a drawn `AtmMock` (no free photo of an Algérie Poste GAB exists); the gendarmerie step uses the **image** `gendarmerie.jpg`, a real place recognized faster as a photo. Each visual enters big, then shrinks into its checklist row. | 59.6: `MiniUI` "إذا صرالك" appears empty. 60.5: the drawn `AtmMock` enters big (screen shows "تبديل رقم الهاتف", sticker "GAB"), then shrinks into row 1 "بدّل الرقم في GAB" at 62.6. 63.4: row 2 "📞 1530" pops, number in heavy type (hit). 64.3: gendarmerie photo card enters big (plate blurred), shrinks into row 3 "شكوى · شرطة / درك" at 64.9. 64.9–66.9: the full list holds still (2.0 s, screenshot-worthy). | GAB · 1530 · شكوى | pop, ding, pop | Remotion | save frame |
| 8 | 66.90–72.77 | ابعث هاذ الفيديو لماماك ولا باباك، باش ما يطيحوش فيها. وانت؟ وصلتك رسالة كيما هاذي؟ إيه ولا لا؟ | Share beat on its own screen, then the comment question as two buttons, then the loop shot that reverses frame 1. | 67.0: big send icon + "ابعثو لماماك وباباك 📤" (held 67.0–69.8). 70.0 ("وانت؟"): two buttons "إيه" / "لا" pop. 71.9: the yellow CODE chip slides back into the phone, the balance counts up from 0 DA to 48 750 DA, the phone locks (lock). Small `Runtime.tech` wordmark under the phone. | ابعثو لماماك 📤 · وصلتك؟ إيه / لا | whoosh, pop×2, tick-roll, lock | Remotion | CTA |

Captions: the `CaptionPill` (2 to 4 words, active word highlighted) is on for the whole video. No SRT was given, so word timing is spread over each line's window and is approximate.

Music: a quiet locally synthesized bed (`public/baridimob-scams/music.wav`), tense and low under scenes 1–5, lighter from scene 6, fading out in the last second.

## Engagement map
- Hook (0–2s): the balance already falling at frame 0 with "بريدي موب: 0 DA ⚠️" on screen. The result comes first, the explanation later.
- Open loops: "واش صرا؟" (3.9 s) is answered at 6.4 s. The three numbered pills (10.3 s) promise 3 tricks, with "الأخطر" saved for last.
- Re-hooks: 12.4 s (trick 1 starts), 23.8 s (trick 2), 35.3 s (switch to the dark canvas, "الأخطر").
- Save frame: scene 7 checklist, held complete 64.9–66.9 s.
- Comment prompt: "وصلتك رسالة كيما هاذي؟" with "إيه / لا" buttons (70.0 s).
- Share moment: scene 8, "ابعثو لماماك وباباك" with a send icon, held 2.8 s.
- Follow CTA: none spoken. The `Runtime.tech` wordmark appears on the last shot only (one CTA rule: the share line is the CTA).
- Loop ending: the last shot reverses frame 1 (the balance comes back, the code returns into the phone), so the cut back to frame 1 (balance falling) feels continuous.

## Retention check
- Visual changes per 10 s: 0–10: 9 · 10–20: 7 · 20–30: 6 · 30–40: 6 · 40–50: 8 · 50–60: 7 · 60–70: 7 · 70–72.8: 3.
- Longest static stretch: 2.8 s (share text, 67.0–69.8 s). It is a deliberate hold, and the caption keeps moving.

## Images
| Id | Scene | What it shows (and why an image) | File | Source URL | Licence / status |
|----|-------|----------------------------------|------|------------|------------------|
| hacker | 2 | The cliché hooded "hacker" photo (no face visible), so "ماكانش hacker" can cross out what everyone pictures | `public/baridimob-scams/images/hacker-hoodie.jpg` (1024×499) | https://www.flickr.com/photos/136770128@N07/40492735830 | CC BY 2.0, "Infosec Images". Credit needed: put "Photo: Infosec Images, CC BY 2.0" in the caption or as a tiny on-image credit. |
| gendarmerie | 7 | An Algerian Gendarmerie car ("الدرك الوطني" written on it) for "أودع شكوى" | `public/baridimob-scams/images/gendarmerie.jpg` (1280×854) | https://commons.wikimedia.org/wiki/File:V%C3%A9hicule_Gendarmerie_nationale_(Alg%C3%A9rie)_01.jpg | CC BY 4.0, Bernard Gagnon. Credit needed. Builder must blur the plate: `blur: [{x: 870, y: 550, w: 90, h: 60}]` (image pixels). |

Searched and replaced by animation:
- Android Accessibility screen: no free-licence screenshot on Wikimedia Commons or Openverse (only a Spanish-language Xiaomi main settings page, CC0, not the right screen). Drawn as `AccessibilityScreen`.
- Algérie Poste GAB: no free photo found (only post-office façades). Drawn as `AtmMock`. The generic CC0 ATM keypad was dropped (German labels, low resolution).
- Real scam SMS: drawn (`SmsNotif`), by the creator's choice.

Rejected: "Police Algérienne" (Commons, CC BY 2.0) shows identifiable faces.

## Components and assets
| Name | New / existing | Used in scenes | Effort |
|------|----------------|----------------|--------|
| `GridCanvas`, `HeaderStrip`, `ChapterPill`, `CaptionPill` | existing | all | — |
| `DeviceMock`, `Counter` | existing | 1, 2, 3, 4, 5, 8 | — |
| `StickerPill`, `XStamp`, `Stamp`, `ArText`, `TermLabel` | existing | all | — |
| `ThiefGlyph`, `LootBag`, `LinkCard`, `FileChip` | existing | 2, 3, 4, 5 | — |
| `TicketChip` (yellow "CODE") | existing | 2, 3, 5, 8 (spine) | — |
| `BrowserCard`, `AppGrid`, `DrawPath`, `MiniUI` | existing | 3, 4, 5, 7 | — |
| `ImageCard` (Card frame + `<Img>`, `tilt`, `pushIn`, `blur` regions, enter/shrink-to-slot) | **new, shared** | 2, 5, 7 | M |
| `WalletScreen` (generic wallet app: title text, balance `Counter`, transaction rows; no real logo) | **new, shared** | 1, 5, 8 | M |
| `SmsNotif` (lock-screen notification: sender, text, link chip) | **new, shared** | 3 | S |
| `Magnifier` (lens over a target, shows zoomed text) | **new, shared** | 3 | S |
| `AccessibilityScreen` (Android-style settings list: title, "Downloaded apps" section, rows with toggles, one highlighted) + an "Allow" dialog | **new, shared** | 5 | M |
| `AtmMock` (generic ATM front: screen with Arabic text, keypad, card slot; label "GAB"; no bank logo) | **new, shared** | 7 | S |
| `OverlayStack` (two screens, flat → tilted 3D side view, labelled layers) | **new, shared** | 5 | L |
| `ChoiceButtons` ("إيه / لا") | **new, shared** | 8 | S |
| `voice.wav`, 2 images, SFX from `public/sfx/` | ready | — | — |
| `music.wav` (synthesized) | to make | all | S |

## Build order
1. Audio + captions (`voice.wav` is ready), the composition `baridimob-scams` in `Root.tsx`.
2. Scene 1 (hook, `WalletScreen`) and scene 8 (loop + share). They mirror each other.
3. Scene 5 (`OverlayStack`, the hardest idea).
4. Scenes 2, 3, 4 (the spine chip and `ImageCard`).
5. Scenes 6 and 7 (rule + save frame).
6. Music, then the stills check.

## MVP fallback
- Scene 5: skip the 3D tilt. Show the red layer sliding over the blue app in 2D with a "مزيفة" label and a peel-back corner.
- Scene 4: replace the icon flip with a cross-fade to the `ThiefGlyph`.
- Scene 3: drop the magnifier and show the wrong URL in red directly.

## Script feedback
- Line 8: the closing "الكود نتاعك… ما يخرجش من عندك" was left out on purpose (creator confirmed), so the video ends on the comment question. The loop shot plays under the last second without words. Script updated to match.
- Line 6 ends exactly at the end of `audio6.ogg` with no tail. Check that the last word ("ميساج") isn't clipped.

## Risks
- Inside-line word timings are approximate (pause-based). Check scene 1's "صفر" hit and scene 7's rows by ear in the Studio.
- CC BY images need a visible credit (caption or tiny on-image text).
- `OverlayStack` 3D (CSS perspective) is the heaviest scene. Use the MVP fallback if it slows the render.
- The generic wallet app must not copy BaridiMob's real colors or layout. Use the name as text only.
- TikTok cut: waiting for its recording.
