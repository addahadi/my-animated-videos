# CAPTCHA production design

The user's explicit CAPTCHA plan sets the style for this production. It takes precedence over the production repository's default n8n treatment. This is a 1080 × 1920 illustrated explainer, with short Darija phrases and the recorded voice.

## Plan before build
- Color: #101015 canvas; #191920 browser; #F5F3ED text; #91B6FA visitor request; #B8A1EE automation; #F2A65A scrutiny and uncertainty.
- Type: Noto Sans Arabic for spoken-language phrases, Manrope for Latin terms; short headings at 82 px, phrases at 64 px, diagram labels generally 48–58 px.
- Layout: centered, vertically stacked source → checkpoint → website; browser challenge examples use a compact 3×3 grid, with the same gate retained.

```
          short Arabic heading
        ───────────────────────
            visitor / bot
                  ↓
           SITE CHECKPOINT
                  ↓
                website

          short spoken phrase
```

## Review against the brief
The main risk was a generic sequence of security icons. The gate is therefore a recurring structural object: it interrupts the browser, becomes a queue doorway, contains the challenge, and opens into background analysis. UI borders represent actual windows or request cards. Remove decorative particles, arbitrary statistics, and unrelated cutaways.

Recorded audio remains authoritative. The source script is preserved. The local ASR suggests account/password/data-collection examples; the animation uses those examples without adding narration. All eight clips are joined sample-for-sample in numeric order.

## Critique at review
Inspect portrait frames for Arabic overflow, bidi order, safe margins, legible cards, consistent object colors, cause/effect, and uncertainty at the end. Render a short risk-assessment preview before the complete export. Record any corrections here after viewing.

First contact sheet reviewed directly: text and the browser/grid layout are readable, the checkpoint remains recognizable, automated cards retain their violet source color, and the summary shows the uncertainty caveat. Refined the CAPTCHA label, user/bot comparison, and background-analysis inputs so they reveal sequentially with the recording. Adjusted the caption container to remain inside the portrait safe area. The risk-reveal preview was rendered at 540 × 960 before the full export. No full narration captions, decorative particles, or music were added.

Second review: inspected the typed-character example at full resolution. Removed the decorative divider beneath the title because it crossed the second line's descenders. The browser, explanatory content and captions remain clear of one another.
