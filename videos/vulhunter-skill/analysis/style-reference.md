# Reference review: post2.mp4

Local reference supplied by the user after Instagram fetch attempts failed. Inspected from decoded frames, a 24-frame contact sheet, audio stream data, and frequency/onset analysis. The original file remains unchanged.

## Observed visual direction

- 1080 × 1920 portrait reference, approximately 36.05 seconds, 60 fps.
- Near-black charcoal background with a fine, low-contrast grid and sparse floating square particles.
- Terracotta orange accent; the reference explicitly displays `#DA7758` in one scene.
- Warm cream Arabic headlines, muted gray secondary text, monospace technical labels.
- Mint green and pale blue distinguish later sections.
- Straight-edged terminal/browser panels with thin borders and offset dark shadows.
- Small pixel mascot near the bottom; blocky stepped wipes between sections.
- Small top labels and a segmented progress indicator near the bottom.

Applied these traits to the user's approved VulnHunter sections. This does not copy the reference's frontend-design/testing/skill-creator narration or scene content. Delivery remains the workspace's 30 fps default.

## Soundtrack direction

The reference audio is dual-mono AAC. Low-frequency energy dominates. Onset autocorrelation has a very strong 120 BPM candidate (normalized correlation approximately 0.95), with expected half-time alternatives at 60 BPM and 40 BPM. This supports a steady bass-pulse direction; it does not identify a commercial song or artist.

The user rejected the first 96 BPM pad-and-pluck draft. Version 2 replaces that arrangement with an original 120 BPM minimal electronic bass pulse, a restrained low kick, and quiet offbeat texture. It omits the prior bell-like melody, pad progression, and delay wash. Sound effects are shorter and less prominent. No reference audio samples are copied.

Subsequent user correction: the generated v2 music was also rejected, and the user explicitly requested applying the actual supplied soundtrack. The current final now uses the audio extracted from `post2.mp4`, looped to the narration length. The paragraph above documents the superseded v2 draft. See `analysis/audio-production-reference.json` for current source and mix checks.

Music remains lower than the supplied narration and ducks against the voice envelope. This is a new draft for the user's listening review; frequency and correlation checks do not establish their subjective approval.

## Review artifacts

- `analysis/reference/contact-sheet.jpg`: decoded reference scene overview.
- `analysis/reference/inspection.json`: source media properties and audio measurements.
- `output/stills/`: representative VulnHunter frames.
- `output/storyboard-v2.jpg`: scene overview in the reference's visual direction.
- `output/soundtrack-preview-v2.m4a`: revised audio mix.

During frame review, the independent-verification panel was shortened to separate its finding verdict from the Arabic note below. The illustrative code excerpt was also revised to show a coherent ownership check.
