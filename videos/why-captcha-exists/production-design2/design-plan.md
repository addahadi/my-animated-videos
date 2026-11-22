# CAPTCHA — Design 2 rebuild

The user rejected the first implementation's explanatory quality and requested Design 2, smaller top titles, more space below the titles, and the exact channel name Runtime.tech. Rebuild the scenes; preserve the original export and all eight supplied recordings.

## Visual system
- Canvas #F0EFF4; white UI and physical surfaces #FFFFFF; near-black outlines/text #111214; inactive shapes #D2D4D9; action #0087FA; specific warnings #FFC400.
- Tajawal Bold, bundled from the approved selling-a-phone project with its OFL license. Titles 70 px instead of 82 px, generally two lines. Quiet Runtime.tech branding. Functional scene/UI labels only; no bottom narration caption track.
- Title block y=335–495; main demonstration begins around y=650. This leaves approximately 150 px between the title and the main action, compared with the first version's tight gap. Most artwork stays inside x=90–900, y=650–1460.
- Draw actual people, a service counter, a website signup form, a challenge grid, copied account records, credential attempts and documents. Physical silhouettes use thick black outlines; interface details use thinner outlines.

```
Runtime.tech                              CAPTCHA
             smaller Arabic title

               breathing room

    actor → narrated action → visible result
           large portrait demonstration

           no narration caption band
```

## Scene plan against recorded audio
| Scene | Recorded span | Starting state → action → consequence |
|---|---|---|
| 1 | 0–9.963 s | A visitor types a name and presses create-account. A traffic-light challenge interrupts the same form. The button remains waiting while the visitor hesitates. |
| 2 | 9.963–22.272 s | A normal person waits at a counter. The same gray person changes headwear, returns and takes another ticket. The counter becomes a website: one bot sends repeated account requests and leaves the ordinary visitor waiting. |
| 3 | 22.272–36.885 s | Explain bot as automation, then show actual account creation, repeated stolen-password attempts, and documents copied from a website into a collection. Preserve originals during copying. Add a verification stage when the narration says the site needs a way to reduce abuse. |
| 4 | 36.885–50.048 s | A human and an old-program example face one test. Distorted K7M2 appears at its spoken cue. The person reads it, types the same characters, and the matching result permits that example request to continue. Label this a historical example, not an infallible test. |
| 5 | 50.048–61.333 s | An illustrative program can now resolve the old text example; the site changes its challenge module. A human then selects a wrong image and gets a retry, demonstrating that an error is not proof of being a bot. |
| 6 | 61.333–74.176 s | The visitor continues using the form with no puzzle. Interaction context flows to reCAPTCHA v3, which produces a qualitative risk estimate. A separate site decision chooses proceed or additional verification. No invented scores or secret telemetry rules. |
| 7 | 74.176–86.059 s | Compare the same site without and with an added check. Repeated automated operations become harder; an occasional automated request can still get through. Keep source identity visible. Hold the clean explanatory comparison at the caveat. |
| 8 | 86.059–95.680 s | Return to the original visitor and browser. The check now has a visible purpose; the visitor completes the example challenge and the form proceeds. Echo the opening composition and title. |

## Critique before build
The rejected version often replaced an action with an icon and a phrase. A recolor would leave that problem intact. In this revision, the account list actually grows, the attempted credential receives a result, the source document remains when copied, the user waits behind automated requests, and the site response visibly follows the risk estimate. Keep the camera stable and let these interactions carry the explanation.

Avoid generic security dashboards, decorative circuitry, unnecessary zooms, transcript bands, and unsupported accuracy claims. Preserve the recording and script rather than adding spoken explanations. Render representative action frames and hook/background-check previews before exporting the complete revision.

## Review and corrections
Reviewed the 20-frame portrait contact sheet and full-resolution frames for background assessment, document copying, and the before/after comparison. Rendered the opening and background-check previews before full export. Moved the copy label clear of the source/collection documents; separated queued requests from the gate; moved the waiting label clear of its arrow; and routed the ordinary visitor through an opened check rather than around it. The old program/human comparison now shows the typed input directly under the distorted original. Reduced the analysis module's Latin header and removed its redundant lock to improve spacing. These corrections were checked again in representative frames.

The historical test also builds its relationship progressively: caller paths appear at the comparison cue, the historical label appears when the original idea is introduced, the person reaches toward the test, then the letters appear at their spoken cue. This removes the long unchanged question-mark state. Run graph indexing separately from rendering: the first concurrent attempt exhausted memory. Final rendering uses one browser worker.
