# Plan: Why every website asks you to accept cookies

- Promise: A cookie is a small ID ticket that lets a website remember you. Advertisers use the same ticket to follow you across sites, and that is why the law makes every site ask first.
- Audience: general | Length: 84.5 s (measured: 82.9 s of narration plus a 1.6 s end-card tail)
- Visual spine: **the ticket.** One small ticket card, `ID: 48213`, drawn the same way all the way through. Beat 1 shows what someone builds from it. Beat 4 shows where it comes from (the pressing). Beat 5 shows the good use and beat 6 the bad use. Beats 8 and 9 show the viewer's choice. One object, so the viewer builds one mental model.
- Hardest idea: "HTTP has no memory", so the server forgets you between pages. Visual: the same browser and server with two requests. The first is answered "مرحبا" with a green login check. The second is answered "شكون نتا؟" and the check fades to "؟". Beat 4 then fixes it on screen by attaching the ticket to the next request.
- Style: reuse `plans/style.md` (light grid canvas for the everyday story, dark blueprint for the tracking mechanism in beat 6).

**Color meanings (one meaning each, for the whole video)**
- yellow: the ticket / cookie itself
- green: the site remembers you (good use, "Necessary only")
- red: tracking / third-party (the ad company, "Accept all")
- blue: neutral UI icons inside cards
- dark: mint = ticket path, delta-yellow = the ID match

## Narration edit
The narration master is `videos/why-cookies-exist/narration-master.wav`, made from `inputs/audio1-9.ogg`. The originals are not touched. I trimmed only the silence before and after each clip and put a 0.2 s gap between beats, which removed about 4.5 s of dead air (the longest was 1.2 s at the start of clip 4). No words were cut or reordered. Each clip's in and out points are in `narrationEdit` in the timeline. Internal anchors come from silence detection, so check them by ear.

## Cover frame
Light canvas. The yellow `ID: 48213` ticket sits big in the center, tilted -4°. Over its lower edge is a generic cookie banner card with a big ink **Accept** button and a cursor on it. A red `Stamp` reads "TRACKED". Cover text above it, in Tajawal 800: **علاش Accept cookies؟**

## Storyboard
Times are on the master track. "→" marks progressive steps. Every visual lands 0.3 s before its word.

| # | In-Out (s) | Voiceover (Darija) | Representation (what and why) | Motion and build steps | On-screen text | SFX / music | Tool | Role |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.00-8.95 | كاين شركات تعرف واش قريت، واش شفت، وواش حبيت تشري... وعمرك ما دخلت للموقع نتاعهم. والمفتاح هو زر تضغط عليه كل يوم: Accept cookies. | **A profile built about you by a stranger.** Muted, it still reads: a file about "you" fills up, then a stamp says you never visited. No header (hook). | Frame 0: a blank `Card` titled "YOU" is already sliding up (motion on frame 1). → 0.3 s row "قرا: أخبار" with a news icon. → 1.6 s row "شاف: سبّاط" with `Sneaker`. → 2.8 s row "حب يشري: تيليفون". → 3.5 (pause) the camera pulls back: the card sits inside a red `NodeBox` "ADS CO." (invented). → 4.2 red `StickerPill` "0 VISITS" pops (on "عمرك ما دخلت"). → 5.5 (pause) everything slides up and dims; a `DeviceMock` rises with a generic cookie banner. → 7.8 (pause) `CursorIcon` taps **Accept** with a press flash on "Accept cookies". | يعرفوك... وما دخلتلهمش (pops at 4.2) | whoosh at 0, soft pop per row, stamp at 4.2, click at 7.9. Music starts at 0, ducked -20 dB | Remotion | hook / open loop ("how do they know?") |
| 2 | 8.95-12.94 | الحكاية بدات بمشكل صغير: الموقع ما يعقلش عليك. | **Start of the story.** Header appears (`HOW IT WORKS · COOKIES`), `ChapterPill` "المشكل". | 9.0 the phone slides away, the light grid drifts in. → 9.3 a browser `Card` (left) and a server `NodeBox` (right) pop. → 11.0 a gray "؟" `SpeechBubble` pops over the server on "ما يعقلش عليك". | الموقع ما يعقلش عليك | whoosh, pop | Remotion | open loop |
| 3 | 12.94-21.71 | الويب مبني على HTTP، وHTTP ما عندوش ذاكرة. كل صفحة جديدة، الـserver يشوفك كأنك واحد جديد. تدير login، تروح للصفحة الموالية... ونساك. | **Hardest idea: a server with no memory.** Two requests, same server, different answer. | 13.0 a `PacketChip` "HTTP" travels browser → server along a `DrawPath`. → 14.6 (pause) a `TermLabel` "HTTP = بلا ذاكرة" pins under the path; a brain icon on the server gets a red slash. → 16.3 (pause) a "page 1 / page 2 / page 3" strip; each new page sends a new packet, the server answers "شكون نتا؟" each time. → 19.2 (pause) a login card gets a green check ("مرحبا"). → about 20.4 the next page's packet arrives and the check fades to a gray "؟" on "ونساك". | HTTP = بلا ذاكرة | pop, tick per request, a deflating "bloop" on ونساك | Remotion | explain (hardest) |
| 4 | 21.71-34.66 | في 1994، مهندس في Netscape لقى الحل: الـcookie. ملف صغير، الموقع يحطو في الـbrowser نتاعك، فيه رقم يعرفك بيه. كيما الـpressing: تخلي القشّ، يعطيك تيكي فيه رقم. كي ترجع، تمدلو التيكي، يعرف ديراكت واش نتاعك. | **The fix, then the analogy.** The spine object is born: the yellow ticket. Then the pressing shows why a number is enough. | 21.8 "1994" types in as a mono `StickerPill` (ink); "NETSCAPE" mono label under it (the company name in text only, no logo). → 24.3 (pause) the server hands the browser a yellow ticket `ID: 48213`, which slides into the browser card; the word "cookie" snaps on as a `TermLabel`. → about 27.5 split to the pressing scene (right to left): a counter with a shirt on a hanger, tag "N° 48213". → about 30 the customer card leaves holding the ticket ("تيكي فيه رقم"). → about 32 the ticket is handed back, the matching shirt slides out with a green check on "يعرف ديراكت". → 33.8 both panels merge: the browser ticket and the pressing ticket overlap, the same number glows. | cookie = تيكي فيه رقم | whoosh, pop, paper slide, ding at the match | Remotion | aha |
| 5 | 34.66-41.11 | هكا تدير login مرة وحدة وتبقى connecté، وكي تزيد سبّاط للسلة وتخرج، ترجع غدوة تلقاه مازال تما. | **The good use, as one shopping story** on an invented shop "SNEAKO". Every request now carries the ticket. | 34.8 the login check turns green and stays green across 3 page flips (each packet carries the mini ticket). → about 37 `Sneaker` drops into a `CartIcon` badge "1". → about 38.5 the tab closes (card collapses). → a "غدوة" `StickerPill` (ink) slides in. → about 40.2 the site reopens, the cart still shows "1" with a green pulse. | الموقع يتفكرك | click, pop, ding | Remotion | explain |
| 6 | 41.11-52.47 | بصح كاين مشكل. شركات الإشهار حطو cookies نتاعهم في آلاف المواقع. نفس الرقم يتبعك من موقع لموقع: واش قريت، واش شفت، واش حوست باش تشري. هادو سماوهم third-party cookies. | **Switch to the dark blueprint: the mechanism behind the hook.** One ad box above many sites, the same ID lighting up on each. Closes the loop opened in beat 1. | 41.2 a hard cut to the dark canvas, `ChapterPill` "بصح..." with glow. → 42.0 a red `NodeBox` "ADS CO." at the top. → 43.0 a grid of about 12 small site tiles fades in below (`AppGrid`), each with a tiny red ticket. → 45.3 (pause) three tiles light up in turn (news, shoes, phone shop), mint lines run up to ADS CO., and the yellow delta bracket marks the same "ID 77x9" on each. → about 49 the profile card from beat 1 rebuilds next to ADS CO. (the same rows: the payoff of the hook). → about 51 `TermLabel` "third-party cookies" (Latin mono) plus a red sticker "3RD PARTY". | يتبعك من موقع لموقع | whoosh into the dark, tick per tile, stamp on the label | Remotion | explain / re-hook (about 41 s) |
| 7 | 52.47-64.97 | هنا دخلت أوروبا. قانون ePrivacy، ومن بعد GDPR في 2018، قالو بشكل مبسط: ما تحطش cookie يتبع الناس بلا ما تسقسيهم. والمواقع، خاطر عندها زوار من كل بلاد، حطو الـbanner للعالم كامل. | **The rule, then the world.** A law card, then banners spreading across a map. | 52.6 back to the light canvas, `ChapterPill` "القانون"; a generic circle of 12 small stars (no official logo). → about 54.5 a mono label "ePrivacy". → about 56 a `Stamp` "GDPR · 2018" slams on it. → about 58 a rule `Card`: "إذن قبل التتبع" with a red tracking ticket and a lock. → about 61.5 the camera pulls back to a simple world outline (dots); small banner cards pop onto about 10 locations one after another, ending on "العالم كامل". | القانون: لازم تسقسي | stamp, pop per banner (rapid, quiet) | Remotion | explain |
| 8 | 64.97-77.41 | إذن الـbanner ماشي كرم من الموقع، راهو مجبور يسقسيك. كي تضغط Accept all، راك تعطيهم الإذن يتبعوك. في بزاف المواقع تقدر تختار Reject ولا Necessary only، والموقع يخدم عادي. | **The save frame:** a clean banner card with two choices, built like the `MiniUI`. | 65.1 the banner card enlarges to the center (`MiniUI`). → 66.2 (pause) a yellow sticker "مجبور" pops. → 69.8 (pause) the row "Accept all" highlights red, a red tag "= TRACKING", and mini tracking lines shoot out. → about 72.5 rows "Reject" and "Necessary only" highlight green, a tag "SITE WORKS". → about 75 the cursor taps "Necessary only", the site loads behind it with a green check. Hold the clean card from about 75 to 77.4 (more than 2 s). | Accept all = إذن بالتتبع | pop, click, ding | Remotion | save frame |
| 9 | 77.41-84.49 | الـcookie تخلي الموقع يتفكرك... السؤال هو: شكون آخر راهو يتفكرك معاه؟ | **Loop ending.** The ticket alone, then faint ad boxes behind it, then the end card. | 77.5 the yellow ticket comes to the center on a clean canvas (no header). → about 79.5 faint red ADS CO. outlines fade in behind it, one by one. → 82.9 the end card: the ticket shrinks into the end-card object area, wordmark `Runtime.tech` with `ScanLine`, tagline `TECH · EXPLAINED SIMPLY`, stamp `EXPLAINED`, dark follow button "تابع للجاية". The comment prompt "Accept ولا Reject؟" shows as a small ink sticker above the button. The last frame matches the beat 1 profile-card outline for the loop. | شكون آخر يتفكرك؟ | whoosh, stamp | Remotion | CTA / loop |

## Engagement map
- **Hook (0-2 s):** a profile card fills up about "you" from frame 0. It reads without sound.
- **Open loops:** "how does a company I never visited know me?" (beat 1), answered in beat 6. "The site doesn't remember you" (beat 2), answered in beat 4.
- **Re-hooks:** about 21.8 s ("1994" plus the fix). About 41.2 s, the hard cut to dark on "بصح كاين مشكل".
- **Save frame:** beat 8, the clean banner card with Accept all = TRACKING and Necessary only = SITE WORKS, held more than 2 s.
- **Comment prompt:** "Accept ولا Reject؟" on the end card, matching the pinned comment.
- **Share moment:** beat 6. The same ID lights up across sites: the "so that's why the shoes follow me" moment.
- **Follow CTA:** the end-card button only, after the payoff. No spoken CTA (the script has none, and that's fine).
- **Loop ending:** the final frame shows the ADS CO. outlines and the profile-card shape from frame 1.

## Retention check
- Visual changes per 10 s: about 4 to 5 everywhere (counted from the build steps above). Beats 4, 6, 7 and 8 are long (11 to 13 s) and have 5 to 6 steps each.
- Longest static stretch: about 3 s (the beat 8 save-frame hold, on purpose). Nothing goes over 5 s.

## Components and assets
| Name | New / existing | Used in scenes | Effort |
|---|---|---|---|
| GridCanvas, HeaderStrip, ChapterPill, CaptionPill | existing | all | - |
| Card, StickerPill, Stamp, SpeechBubble, PacketChip, ArText, Mono | existing | all | - |
| NodeBox, DrawPath, AppGrid, MiniUI/MiniRow, DeviceMock, ScanLine | existing | 1-3, 6, 8, 9 | - |
| Icons: Sneaker, CartIcon, CursorIcon, ServerIcon, BrainIcon, LockIcon, ShopIcon | existing | 1, 3, 5, 7 | - |
| `TicketChip` (yellow ID ticket, size and tilt props) | new, reusable (sessions, tokens, JWT later) | 1, 4, 5, 6, 8, 9 | S |
| `ConsentBanner` (generic cookie banner card, buttons with highlight states) | new, reusable | 1, 7, 8, 9 | S |
| `TermLabel` (term pin: Latin term + Arabic gloss) | new if not in Labels.tsx, reusable | 3, 4, 6 | S |
| `BrowserCard` (minimal browser window card with page title) | new, reusable | 2-5 | S |
| `ProfileCard` (rows that fill one by one) | new, reusable | 1, 6 | S |
| `WorldDots` (dotted world outline with pin slots) | new, reusable | 7 | M |
| `PressingCounter` (hanger, shirt, tag) | new, one-off | 4 | M |
| SFX: whoosh, pop, click, ding, stamp, tick | existing in `public/sfx/` (add "bloop" if missing) | all | S |

## Build order
1. Audio track (the master WAV is done) and the caption track. Captions are built from the script text and aligned to the narrationEdit spans; check them by ear.
2. Beat 1 hook (ProfileCard, ConsentBanner, TicketChip).
3. Beats 8 and 9 (save frame and end card).
4. Beats 3 and 4 (the hardest idea and the ticket).
5. Beat 6 (blueprint), then beats 2, 5 and 7.

## MVP fallback
- Beat 7: replace `WorldDots` with a 3×3 grid of banner cards that pop in.
- Beat 4: replace the pressing scene with two static cards ("shirt + N° 48213" and "ticket N° 48213") and a green match line.
- Beat 6: use a static `AppGrid` with three tiles highlighted in turn instead of animated paths.

## Script feedback
- None. The recording follows the script. If any line was ad-libbed differently, the captions must follow the audio, not the script. Check this during the build.

## Risks
- Internal timings in beats 4, 5, 7 and 8 are estimated from speech rate (marked "about"). Silence detection found few pauses there, so `$remotion-builder` should place those steps by ear or with a forced alignment check.
- No Darija ASR: captions come from the script text and are spread proportionally inside each span. Check them in the preview.
- EU stars: a generic circle of stars only, no official emblem. "Netscape" appears in text only, no logo.
- Music: royalty-free only, ducked about 20 dB.
