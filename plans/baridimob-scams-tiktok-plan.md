# Plan: baridimob-scams, TikTok cut

- Promise: the post office never asks for your code; a fake SMS link is how the code gets stolen.
- Length: 44.16 s (measured from the assembled recording), Part 2 ending.
- Spine, style, colors and components: same as the main cut (`plans/baridimob-scams-plan.md`): yellow CODE chip leaving your phone into the scammer's bag.
- Timeline: `plans/baridimob-scams-tiktok-timeline.json` (built by `videos/barid_mob/build_timeline_tiktok.py`).

## Audio (built from the 5 recordings)

`videos/barid_mob/tiktok/audio1..5.ogg` are joined into `public/baridimob-scams/voice-tiktok.wav` by `videos/barid_mob/build_tiktok_audio.py`. Originals untouched. Only silence removed, no words cut or reordered:

| File | Kept (s) | Master (s) | Removed |
|---|---|---|---|
| audio1 | 1.72 – 12.70 | 0.00 – 10.98 | 1.72 s lead, 0.93 s tail |
| audio2 | 0.95 – 10.20 | 11.28 – 20.53 | 0.95 s lead, 1.13 s tail |
| audio3 | 0.56 – 6.65 | 20.83 – 26.92 | 0.56 s lead, 0.48 s tail (incl. a short noise at 6.95 s) |
| audio4 | 1.47 – 7.70 | 27.22 – 33.45 | 1.47 s lead, 0.77 s tail |
| audio5 | 0.19 – 10.00 | 33.75 – 43.56 | 0.19 s lead, 0.62 s tail |

0.30 s between recordings, 0.60 s at the end.

### Recorded wording vs the script (check by ear)
The voice differs slightly from `scripts/baridimob-scams.md`. Captions follow what I heard, using a rough speech-recognition pass for timing only. Darija recognition is unreliable, so please check these:
- audio1: "تخاف وتدخل…" and "نفس الألوان **و**نفس الخانات".
- audio2: "ماكانش hacker. **بصح** انت بيدك عطيت الكود للمحتال."
- audio3: "**هاذي** القاعدة: …، **ولا** في **ال**ميساج."
- audio5: "ابعث **الفيديو** لماماك وباباك." / "يشوف كلش واش **راك** تكتب." / "اكتب "إيه" **في الكومنتار**."

## Storyboard

| # | In–Out (s) | Voice | What we see | Reuses | Role |
|---|---|---|---|---|---|
| 1 | 0.00–14.17 | الساعة 2 تاع الليل… تكتب الكود، والمحتال يقراه في نفس الثانية. | Frame 0: hook text "SMS من البريد في الليل؟ ⚠️" and a 02:00 night lock screen. 0.6 SMS from ALGERIE-POSTE. 5.75 tap. 6.55 fake page builds (drawn, no real logo). 9.35 magnifier on `poste-dz-verif.xyz` + "لينك مزيف". 11.2 code typed. 12.4 the CODE chip flies to the scammer, "0.0 s". | main 3 (`TrickSms`, new props) | hook |
| 2 | 14.17–20.67 | وفي الصباح، تحل بريدي موب: صفر دينار. ماكانش hacker. بصح انت بيدك عطيت الكود للمحتال. | "الصباح ☀️", the wallet phone, the **real BaridiMob logo** beside it. 15.95 balance slams to 0 DA. 17.3 hacker photo, 17.85 ✕. 18.45 the chip leaves the phone and lands at 19.9: "انت عطيتهولو 🔑". | parts of main 1+2 (new `TtMorningZero`) | payoff |
| 3 | 20.67–27.07 | هاذي القاعدة: بريد الجزائر ما يطلبش منك الكود. لا في SMS، لا في التيليفون، ولا في الميساج. | **Real Algérie Poste logo**, the rule in big type, SMS / تيليفون / ميساج each crossed out on its word. | main 6 (`RuleStamp`, `logo` prop) | rule |
| 4 | 27.07–33.60 | وإذا صرالك: روح لأقرب GAB… عيّط لـ 1530، وأودع شكوى عند الشرطة. | Same checklist as the main cut: GAB drawn big then into row 1, 1530, gendarmerie photo into row 3. | main 7 (`RecoveryChecklist`) | save frame |
| 5 | 33.60–36.20 | ابعث الفيديو لماماك وباباك. | Share beat: send icon + "ابعثو لماماك وباباك". | main 8 share part (new `TtShare`) | share |
| 6 | 36.20–44.17 | وكاين حيلة أخطر: تطبيق مزيف يشوف كلش واش راك تكتب. نزيدو Part 2؟ اكتب "إيه" في الكومنتار. | Dark reveal, "حيلة أخطر". The fake app (drawn) opens, an eye spreads over it, a ghost cursor, code dots. 40.45 big "Part 2?" pill. 42.1 "اكتب "إيه" 👇" + a pulsing green إيه button. | parts of main 5 (new `TtTease`) | CTA / Part 2 |

## Engagement map
- Hook (0–2 s): hook text plus the 02:00 lock screen at frame 0, and the SMS from 0.6 s.
- Open loop: "حيلة أخطر" at the end, answered in Part 2.
- Share: scene 5, own beat, 2.6 s.
- Comment: "اكتب إيه", on screen with a button.
- Ending: Part 2 tease (no loop).

## Retention check
- Visual change every 1 to 3.5 s. The longest stretch is 2.6 → 5.75 s: the SMS stays while the voice reads it, and the link glows.

## Images
| Id | Scene | What | File | Source | Licence |
|---|---|---|---|---|---|
| baridimob-logo | 2 | Real BaridiMob logo (app named in the voice) | `public/baridimob-scams/images/baridimob-logo.png` | Google Play store icon of BaridiMob (`ru.bpc.mobilebank.bpc`) | Trademark of Algérie Poste, shown to identify the app (style.md §14) |
| algerie-poste-logo | 3 | Real Algérie Poste logo (the rule is about them) | `public/baridimob-scams/images/algerie-poste-logo.svg` | https://commons.wikimedia.org/wiki/File:AlgeriePoste.svg | Public domain on Commons (trademark) |
| hacker-hoodie, gendarmerie | 2, 4 | reused from the main cut | as main cut | as main cut | CC BY 2.0 / CC BY 4.0 |

Fakes (SMS, fake page, fake app) stay drawn, never with a real logo.

## Components
Reused: `TrickSms` (+ `lockTime`, `lockDay`, `hookText`, `notIt` props), `RuleStamp` (+ `logo`), `RecoveryChecklist`, `WalletPhone`, `Scammer`, `FlyingCode`, `ImageCard`, Banking components. New: `TtMorningZero`, `TtShare`, `TtTease`, `BrandTile` (in `src/videos/baridimob-scams/scenes/tiktok.tsx`).

## Script feedback
- None needed. The recorded wording changes listed above are fine.
