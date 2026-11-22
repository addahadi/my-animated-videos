# Shared components (Runtime.tech)

Reuse these before creating anything new. All styling comes from `src/theme.ts` (generated from `plans/style.md`).
Components are presentational: they take progress values (`p`, 0..1, usually a `pop()` spring from `src/lib/time.ts`)
and never read the clock themselves, so scenes control all timing from `timeline.json`.

Timing helpers (`src/lib/time.ts`): `useClock()` gives absolute narration time `t` inside a scene, `evAt(events, i)`
reads a timeline event, `pop(t, at, fps, SPRING.x)` springs from an absolute time, `ramp(t, a, b, easing)` is a clamped
eased 0..1, `mix(a, b, p)` interpolates. `sec(seconds, fps)` is the only seconds-to-frames conversion.

| Component | File | Props (main) | Example |
|---|---|---|---|
| `GridCanvas` | Canvas.tsx | `mode: 'light' \| 'dark'`, `drift`, `spacing` | `<GridCanvas mode="dark" drift={t*12} />` |
| `HeaderStrip` | Canvas.tsx | `tag`, `mode`, `p` | `<HeaderStrip tag="HOW IT WORKS · ADS" />` |
| `ChapterPill` | Canvas.tsx | `text` (Arabic ok), `mode`, `p`, `icon` | `<ChapterPill text="دليل 1 · GPS" p={pillP} />` |
| `ScanLine` | Canvas.tsx | `y`, `left`, `width` | sweep: `y={top + p*height}` |
| `CaptionPill` | CaptionPill.tsx | `pages: CaptionPage[]`, `hidden` | mount once at composition level |
| `Card` | Labels.tsx | `style`, `lift` | `<Card style={{left, top, width, height}} />` |
| `Mono` | Labels.tsx | Latin-only uppercase label | `<Mono size={22}>APPS TESTED</Mono>` |
| `StickerPill` | Labels.tsx | `text`, `tone: red/green/yellow/ink/blue`, `p`, `rotate`, `size` | `<StickerPill text="MIC ON" tone="green" p={p} />` |
| `Stamp` | Labels.tsx | `text`, `p`, `rotate`, `size` | `<Stamp text="ماشي منطقي" p={p} />` |
| `XStamp` | Labels.tsx | `p`, `size` | big red X for "no" |
| `ValueTag` | Labels.tsx | `value`, `caption`, `p`, `string`, `mode` | hanging tag with damped swing |
| `PacketChip` | Labels.tsx | `label`, `icon`, `mode` | data/packet chips on a path |
| `SpeechBubble` | Labels.tsx | `text` or children, `tail`, `p` | conversation bubble |
| `LockedChip` | Labels.tsx | `open` 0..1, `mode`, `shake`, `label` (default TRUTH) | open-loop "VERDICT · LOCKED" |
| `ArText` | Labels.tsx | RTL Tajawal block, never letter-spaced | `<ArText size={70}>...</ArText>` |
| `DeviceMock` | Device.tsx | `width`, `height`, `children`, `flash`, `island` | generic phone, no logos |
| `StatusBar` | Device.tsx | `width`, `scale` | generic 9:41 status bar |
| `AdCard` | Device.tsx | `width`, `kind: shoe/headphones/watch/bag`, `faded`, `highlight` | feed ad |
| `PhoneFeed` | Device.tsx | `width`, `items`, `appear(i)`, `faded(i)`, `highlight(i)`, `scroll` | scrolling ad feed |
| `NodeBox` | Diagram.tsx | `icon`, `label`, `glow`, `glowColor`, `mode` | server / third party box |
| `DrawPath` | Diagram.tsx | `d`, `p`, `dashed`, `arrow`, `color`, `glow` | progressive SVG line/arrow |
| `quadPoint` | Diagram.tsx | point on a quadratic curve | move objects along a flow |
| `AppGrid` | Diagram.tsx | `cols`, `rows`, `tile`, `fill(i)`, `dim`, `red`, `hidden` | grid of generic apps |
| `Counter` | Diagram.tsx | `value`, `prefix`, `suffix` | rolling number |
| `ScaleBar` | Diagram.tsx | `width`, `p`, `value`, `markerP`, `title`, `markerLabel` | blueprint ruler + marker |
| `MiniUI` / `MiniRow` | MiniUI.tsx | card + rows with `highlighted`, `struck`, `tag` | the save frame |
| `TicketChip` | Web.tsx | `id`, `kicker`, `width`, `tone: yellow/red/paper`, `glow`, `mode` | the ID ticket (cookie, session id, pressing ticket) |
| `BrowserCard` | Web.tsx | `width`, `height`, `url`, `children`, `barRight` | minimal browser window with dot bar + URL pill |
| `ConsentBanner` | Web.tsx | `width`, `buttons: {label, tone, hl, hlColor, press}[]`, `scale` | generic cookie banner, invented copy |
| `ProfileCard` | Web.tsx | `width`, `title`, `rows: {icon, text, p, hl}[]`, `mode`, `rowH`, `textSize` | "file about you" that fills row by row |
| `TermLabel` | Web.tsx | `term`, `gloss`, `p`, `mode`, `size` | Latin term pill + Arabic gloss |
| `WorldDots` | Web.tsx | `width`, `height`, `p`, `color` | stylized dotted world (not a real map) |
| Web icons | Web.tsx | `CookieIcon, NewsIcon, PhoneGlyph, ShirtIcon, StarShape, UserGlyph` | 48x48 ink stroke |
| `Spinner` | Hardware.tsx | `size`, `angle` (deg, from the clock), `color`, `track` | loading ring |
| `SpeedBar` | Hardware.tsx | `width`, `value` 0..1, `label` | on-screen speed meter, red below 45% |
| `CameraView` | Hardware.tsx | `spin`, `loaded` 0..1, `subjectX` (0..1 or null) | viewfinder inside `DeviceMock`: slow camera, missed shot |
| `ChargeTank` | Hardware.tsx | `width`, `height`, `level`, `p`, `label` | blueprint: stored charge |
| `PowerMeter` | Hardware.tsx | `supply`, `needed`, `neededP`, `gapP`, `warn` | blueprint: power delivered vs NEEDED + yellow GAP bracket |
| `TapInset` | Hardware.tsx | `open`, `stream`, `need`, `p` | blueprint tap analogy (full tank, thin stream, needed flow) |
| `SpeedDial` | Hardware.tsx | `size`, `value` 0..1, `label`, `mode`, `color` | half-circle CPU/speed gauge |
| `TaskBox` | Hardware.tsx | `blocks` (fractional = dropping), `capacity`, `cols`, `label` | fixed capacity; extra blocks pile up red above |
| `StorageBar` | Hardware.tsx | `width`, `value`, `label` (Latin only) | segmented storage, red past 90% |
| `Thermometer` | Hardware.tsx | `height`, `value` | heat, red above 0.6 |
| `CauseChips` | Hardware.tsx | `items: {label, p, hl, tone}[]`, `title` | diagnosis strip filling one chip at a time |
| `NotifCard` | Hardware.tsx | `width`, `category`, `headline` (Arabic), `p`, `rotate`, `icon` | evidence / headline card (style.md NotifCard), invented copy |
| `LinkCard` | Scam.tsx | `width`, `title`, `meta`, `domain`, `cta`, `pulse`, `press` | chat link preview with invented city thumbnail + DOWNLOAD chip |
| `PlatformBox` | Scam.tsx | `kind: console/pc/phone`, `label`, `verdict: yes/no`, `verdictP`, `p`, `size` | generic device + check / cross ("available on X") |
| `FileChip` | Scam.tsx | `name`, `ext`, `p`, `wobble`, `tone: ink/red`, `size` | file icon with extension badge (downloads, malware) |
| `ThiefGlyph` | Scam.tsx | `size`, `fill`, `color` | masked bandit face (attacker / thief), 48x48 |
| `LoginGate` | Scam.tsx | `width`, `strike`, `open`, `p`, `account` | sign-in card: password struck out, LOCKED -> WELCOME BACK |
| `FanTower` | Scam.tsx | `height`, `angle` (deg from the clock), `heat`, `p` | blueprint PC tower with spinning fan |
| `LootBag` | Scam.tsx | `size`, `fill` 0..1, `bump` 0..1, `p`, children (label) | the thief's sack where stolen data lands |
| `SeriesPill` | Scam.tsx | `ep`, `p`, `size`, `mode` | "صح ولا كذب؟" verdict-series badge (+ episode) |
| `ImageCard` | Banking.tsx | `src`, `width`, `height`, `natural {w,h}`, `p`, `push` 0..1, `tilt`, `focus`, `blur [{x,y,w,h}]` (image px), `credit`, children | photo in the Card frame (style.md section 14): `<ImageCard src="slug/images/x.jpg" natural={{w:1280,h:854}} width={680} height={453} credit="PHOTO: NAME · CC BY 4.0" />` |
| `CodeChip` | Banking.tsx | `p`, `size`, `glow`, `dots` | yellow "CODE ••••" chip (a secret code / PIN that travels) |
| `WalletScreen` | Banking.tsx | `width`, `height`, `balance`, `name`, `zero` 0..1, `rows [{label, amount, p, tone}]`, `fake` 0..1, `code {p, dots}` | generic banking app screen for `DeviceMock` (name as text, no logo) |
| `SmsNotif` | Banking.tsx | `width`, `sender`, `text`, `link`, `p`, `linkGlow` | lock-screen SMS notification with a link chip |
| `Magnifier` | Banking.tsx | `size`, `p`, `ring`, children (zoomed content) | lens with handle |
| `AccessibilityScreen` | Banking.tsx | `width`, `height`, `rows [{label, on, highlight, fake}]` | Android-style settings list with toggles (drawn) |
| `AllowDialog` | Banking.tsx | `width`, `app`, `p`, `press` | "Allow X full control?" dialog, DENY / ALLOW |
| `AtmMock` | Banking.tsx | `width`, `label`, `screenText`, `p` | generic ATM front (label strip, screen, keypad, card slot) |
| `ChoiceButton` | Banking.tsx | `text`, `tone: green/red`, `p` | big answer button for the comment question |
| Banking glyphs | Banking.tsx | `KeyGlyph, SendGlyph, SmsGlyph, LayersGlyph, AtmGlyph, ShieldGlyph, CallGlyph` | 48x48, ink 3 px stroke |
| Icons | Icons.tsx | `MicIcon, EarIcon, EyeIcon, PinIcon, WifiIcon, HouseIcon, BatteryIcon, LockIcon, BrainIcon, CommentIcon, ServerIcon, SearchIcon, CursorIcon, PlayIcon, CartIcon, ClockIcon, CameraIcon, ShopIcon, Sneaker, ProductGlyph` | 48x48, ink 3 px stroke |

Audio: `src/lib/sfx.tsx` (`SfxTrack`, `SFX_FILES`) plays files from `public/sfx/` (generated by
`videos/phone-listening/make_sfx.py`). Unknown SFX names are skipped, never fatal.
