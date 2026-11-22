# Design 2: light blue technical explainer

The user requested this second animation style on 2026-10-28, based on the supplied Arabic iPhone/Bluetooth reference in `Video/`. The first QR-code draft was judged too different from the source. The current candidate is the revised Remotion composition and `exports/v2/qr-code-explainer-v2.mp4`. Its user review is pending; do not describe it as already approved.

## Selection

Use this guide when the user asks for **Design 2**, **the QR-code video style**, **the light blue technical style**, or to imitate the supplied Arabic iPhone/Bluetooth animation. It is an additional saved design, not a replacement for Design 1's standing dark-mode default. Keep this style light unless the user explicitly requests a dark adaptation. An explicit new brief always wins.

## Inspect before reuse

- `reference/contact-sheet.jpg`: sampled source reference, including its original branding solely for visual analysis.
- `reference/native/phone.png` and `reference/native/zoom.png`: native-resolution details used for proportion and alignment checks.
- `exports/v2/contact-sheet.jpg`, `exports/v2/reference-comparison.jpg` and `exports/v2/qr-code-explainer-v2.mp4`: the revised adaptation and comparison.
- `../../motion/src/QrReferenceV2.tsx` and `../../motion/src/qr-v2-entry.tsx`: current reusable illustration, typography, timing and composition structure. V1's `QrCodeExplainer.tsx` and original export remain available for history, not as the target style.
- `revision-plan.md` and `review-v2.md`: current decisions and validation limits. The earlier `design-plan.md` and `review.md` describe v1.

## Visual anchors

- Flat, cool light-gray canvas `#F0EFF4`; white objects `#FFFFFF`; near-black outlines and text `#111214`; layered component gray `#D2D4D9`; electric blue `#0087FA`; occasional explanatory yellow `#FFC400`.
- A detailed physical object is the visual anchor: a phone or other relevant prop. Reuse its geometry across shots, then zoom into a component of the same object. Use layered bezels, an inset screen, gray internal shapes, restrained highlights, and small blue technical callouts rather than a sequence of generic cards.
- Flat vector shapes, rounded device silhouettes, thick physical-object outlines and thinner diagram strokes, with minimal shading. Avoid texture, glossy 3D, decorative app cards and gradients. Interiors are schematic illustrations, not literal hardware specifications or actual product UI.
- Short bold captions **below** the main object, anchored to a stable right edge for Arabic as in the native reference. Reveal phrases progressively in black/blue/gray while preserving joined letters and RTL ordering. V2 uses open-source Tajawal Bold, a closer geometric approximation; the source font has not been identified. See `font-OFL.txt`. Follow appropriate alignment for other languages.
- Quiet original channel branding near the top and a small outlined topic pill. Use the intended channel's identity. Do not copy the reference creator's `icase.iq` mark, source narration, footage or logo.

## Layout and motion

Start vertical videos at 1080×1920, 30 fps. The reference-scale phone occupies roughly x=320–760, y=365–1235. Component close-ups center around (540, 765), backed by a faded, enlarged view of the same phone. Captions start around y=1393 with a stable right margin around 80 px and remain above y=1620. Use approximately 60–63 px captions and keep the corner wordmark and topic pill quiet. Adapt for other aspect ratios.

Use an eased camera zoom from the hero into its highlighted component. Keep the enlarged phone as an axis-aligned backdrop extending beyond the frame; avoid an unrelated rotated outline. Use diagram connections, scan sweeps, precise concentric rings, circular clipped close-ups, small data badges and faint white/gray app grids where appropriate. A circular close-up need not have a magnifying-glass handle. Preserve object geometry across related scenes, with no routine fade-to-empty at each narration boundary. Hold illustrations long enough for the narration; avoid arbitrary spinning or continuous bouncing.

Use the topic's real mechanisms and limitations. Clearly mark simplified diagrams. A signal ring, placeholder data block or colored module must not imply a verified implementation detail. For QR topics, damage tolerance is limited; error-correction percentages refer to codewords, not arbitrary image area.

## Production

Use `frontend-design` to plan and critique. Use the existing Remotion setup for these code-driven vector explainers. Use Google Flow only when AI-generated footage is actually needed. Create new work in `projects/<name>/` and preserve this render and Design 1's completed exports.

The design is language-independent. Follow the intended channel's language and audience rules: RunTime tech favors North African context and Algerian Darija; enjoy.with.ai uses English. Do not permanently bake QR codes, iPhones, or a particular narration voice into the style. Instagram publishing remains manual.
