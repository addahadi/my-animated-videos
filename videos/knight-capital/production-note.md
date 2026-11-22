# Knight Capital — Design 2 production

Production: `C:\Users\hecin\ai-video-editor\projects\knight-capital`. User explicitly selected ai-video-editor and the approved Design 2.

Final: `exports/knight-capital-design2.mp4`, 1080×1920, 30fps, H.264/AAC, 93.333333 seconds.
All ten original recordings are preserved in their mapped order, with no trimming, replacement, reordering or time stretching. Narration length: 93.312s. Only final picture rounding extends beyond the audio. Source PCM concatenation and encoded audio correlation checked for every clip; full decode passed. Narration gain is 1; five quiet original 50ms switch clicks punctuate real state changes. No music. Unmixed narration is preserved separately.

Light-gray canvas, white outlined objects, blue actions and yellow warnings, Tajawal Bold, quiet Runtime.tech branding. No bottom narration captions. Custom eight-server fleet, meaningful trading tickets, paired software activation, continuing orders after completion, rollback escalation, monitoring/blocking gap, attributed initial/later losses and final safeguard checklist. No imported reference-video frames or voice.

Source: `src/`; assets: `media/`; source recordings: `inputs/`; alignment evidence: `analysis/`; planning: `plans/` and `design-review.md`. Reference: selling-a-phone v4 Design 2. Existing videos remain untouched. Remotion rendered the full new video; FFmpeg packaged original narration and verified it. No Concat, Natron or generated footage was required.

Review: representative portrait stills, opening/mechanism previews and frames extracted from final encoded video. Dedicated video-vision tools were unavailable; no continuous real-time playback/listening claim is made. See alignment status and any script differences in `analysis/`.

Rebuild from the original script workspace using `python videos/knight-capital/production.py prepare`, `align`, `stills`, `preview`, `mechanism`, `render`, `package`, `verify`, `review`, `finalize`. Existing Remotion installation is reused; no dependency upgrade. Publishing remains manual.
