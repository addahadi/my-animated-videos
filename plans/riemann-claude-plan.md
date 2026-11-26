# riemann-claude: carousel plan

- Script: `scripts/riemann-claude.md` (12 slides) · Style: Report (`plans/style.md`)
- Compositions: `RiemannCarousel-ig` (1080x1440), `RiemannCarousel-tt` (1080x1920) · Source: `src/videos/riemann-claude/Carousel.tsx`
- Export: `node videos/carousels/stills.mjs RiemannCarousel riemann-claude` → `out/riemann-claude/{ig,tt}/slide-NN.png`

## Slides

| # | Shows |
|---|---|
| 1 | Headline + "$1M" hanging tag; Riemann portrait (ImageCard, "RIEMANN · 1859" sticker); Claude symbol tile with a red "?" between them; swipe cue. A paper stack starts on the right edge (seam into slide 2). |
| 2 | The paper stack lands; "250,000 PAGES" hanging tag; ink sticker "ما كاش بنادم يقراهم". |
| 3 | Number grid 1 to 50, the 15 primes in yellow, "PATTERN?" sticker. |
| 4 | Riemann's Nov 1859 Berlin Academy report (ImageCard), yellow box on "über die Anzahl der Primzahlen unter einer gegebenen Grösse", English title under it. |
| 5 | Dark blueprint: Hardy Z(t) (zeta on the critical line) for t = 0 to 52, computed with mpmath, first 10 zeros as mint dots; "10,000,000,000,000 ✓ / ∞ STILL LEFT" panel. |
| 6 | Anthropic + Claude logos, Alpöge quote card with red "CLAIM" sticker, "مازال ما تأكدش" sticker. |
| 7 | Paper stack → arrow (right to left) → "Lean · PROOF CHECKER" card with checked steps. |
| 8 | Mathlib's `RiemannHypothesis` definition (dark code card, yellow outline, "هذا لازم يكون صحيح"), rows ✓ LEAN CHECKS / ✗ HUMANS CHECK. |
| 9 | Two quote cards: Conrey (green, WOW) and Buzzard (red, WAIT). |
| 10 | Two proof documents: #1 Claude symbol / Anthropic researcher, #2 Stanford postdoc, "نفس النهار" sticker, "NEITHER PROOF IS VERIFIED YET". |
| 11 | Save frame: MiniUI with 3 checks (COMPILES? / REVIEW / $1M PRIZE highlighted), red "UNVERIFIED" stamp, share line. |
| 12 | Comment question card, إيه / لا buttons, wordmark, tagline, follow button. |

## Images

| File (`public/riemann-claude/images/`) | Source | Licence |
|---|---|---|
| `riemann-portrait.jpg` | Wikimedia Commons, "Portrait of Bernhard Riemann (1826-1866), Mathematician (2551069295).jpg" (Smithsonian Institution Libraries via Flickr), 1863 | No known copyright restrictions / public domain |
| `riemann-1859-page1.jpg`, `riemann-1859-crop.jpg` | Wikimedia Commons, "RiemannPrim1859.djvu" page 1 (Monatsberichte der Berliner Akademie, Nov 1859) | Public domain |
| `claude-logo.svg` | Wikimedia Commons, "Claude AI logo.svg" | Public domain (logo, trademark of Anthropic) |
| `claude-symbol.svg` | Wikimedia Commons, "Claude AI symbol.svg" | CC0 (trademark of Anthropic) |
| `anthropic-logo.svg` | Wikimedia Commons, "Anthropic logo.svg" | Public domain (trademark of Anthropic) |
| zeta graph (drawn) | computed: `mpmath.siegelz`, `mpmath.zetazero(1..10)` → `src/videos/riemann-claude/zeta-data.json` | own drawing |
