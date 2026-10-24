# Video brief

## Identity

- Working title: VulnHunter — check your app before launch
- Project folder: `videos/vulhunter-skill/`
- Topic and main takeaway: Introduce VulnHunter and illustrate finding security vulnerabilities, fixing them, and independently reviewing fixes before deploying an app.
- Audience: Arabic-speaking developers and people building apps with AI coding tools.
- Status: full video exported and checked; reference treatment and revised soundtrack ready for user review.

## Inputs

- Supplied narration: `inputs/audio1.ogg` through `inputs/audio6.ogg`.
- Total decoded duration: 70.144 seconds, approximately 1:10.
- Language: colloquial Arabic with English technical terms.
- Automatic draft transcripts and segment timings: `analysis/transcripts/`.
- Draft transcripts contain recognition errors; do not use them as verbatim captions.
- Supplied visual and soundtrack reference: `inputs/post2.mp4` (Instagram Reel).

## Creative direction

- Approved animation sections: pre-launch hook, tool introduction, open source/requirements, scan, fix, independent verification, exploitability, follow prompt.
- Visual look: follow the user's Instagram reference rather than assuming the initial proposed navy interface theme. Reference: https://www.instagram.com/reel/DefGYOjI0NO/
- Reference access: user supplied `inputs/post2.mp4`; inspected decoded frames and measured audio pulse/frequency balance. Review: `analysis/style-reference.md`.
- Visual treatment: near-black fine grid, terracotta `#DA7758`, cream Arabic headlines, monospace technical labels, thin square panels, mint/blue step accents, pixel mascot, stepped wipes, segmented progress bar.
- Short Arabic text only, with English product and command names where helpful.
- Closing call to action: follow for more AI tools, matching the supplied recording.
- Proposal details: `animation-ideas.md`.
- User approved the animation sections and explicitly distinguished them from the visual theme.
- Sound: user explicitly requested the actual soundtrack from `inputs/post2.mp4` after rejecting the generated music. The reference AAC is extracted without reencoding, looped at its original tempo, mixed at a clearly audible background level with voice ducking, and applied to the existing video. Generated music is replaced; narration and animation are preserved.

## Default delivery

- Platform: Instagram.
- Format: 9:16, 1080 × 1920, 30 fps.
- Export: MP4, H.264 video and AAC audio.
- Preserve supplied narration and meaning; derive animation timings from the recordings.

## Sequencing and review notes

- Numerical input order is 1, 2, 3, 4, 5, 6.
- `audio3` describes the third step (independent fix verification); `audio4` describes the first and second steps (scan and fix).
- User authorized correcting the sequence. Approved playback order: 1, 2, 4, 3, 5, 6. Original input files stay unchanged; assembled narration follows the corrected order.
- Current audio: `output/soundtrack-reference.m4a`; extracted original: `public/audio/reference-soundtrack.m4a`; editable music/mix: `public/audio/music-reference.wav` and `soundtrack-reference.wav`; validation: `analysis/audio-production-reference.json`.
- Rejected v1 listening copy remains at `output/soundtrack-preview.m4a` as a historical draft.
- Short video preview: `output/preview-reference-music.mp4`; sample frames: `output/stills/`; scene overview: `output/storyboard-v2.jpg`.
- Corrected order and full narration retained. Direct AAC mux avoids intermediate encoder delay; preview audio/video checks pass.
- Final MP4: `output/vulnhunter-instagram.mp4`; 1080 × 1920, 30 fps, 70.166667 seconds, 2,105 frames. Final validation passed: `output/validation.json`.
- Production note: `production-note.md`. Previous final with generated v2 audio is preserved as `output/vulnhunter-instagram-v2.mp4`; current final uses the actual supplied soundtrack.
