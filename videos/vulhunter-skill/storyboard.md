# Implemented storyboard

Approved recording order: **audio1 → audio2 → audio4 → audio3 → audio5 → audio6**. All supplied narration is retained. Format: 1080 × 1920, 30 fps, 2,105 frames; approximately 70.17 seconds.

Visual look follows the locally supplied `inputs/post2.mp4`. Animation sections follow the previously approved plan. All app UI, findings, code, and verdicts are illustrative examples, not results from scanning a real application.

| Time | Section | Visual and cue |
| --- | --- | --- |
| 0.00–6.50 | Pre-launch hook | Developer and app preview, cursor approaches Publish; heading switches to the security question and highlights the database card. |
| 6.50–17.34 | Tool introduction | Code window with scanning line; VulnHunter name and Capital One credit appear around 13.00 seconds, as named in the recording. |
| 17.34–28.05 | Open source and requirements | Repository unfolds into the three skill folders; Claude Code and Claude Opus cards appear as the narration reaches requirements. |
| 28.05–38.07 | Hunt | `/vulnhunt` command, entry → code → data scan, report reveals a missing ownership check and a proposed remedy. |
| 38.07–48.90 | Fix | `/vulnhunter-fix` command; illustrative route-handler excerpt gains an ownership check; failing security test becomes passing as tests are mentioned. |
| 48.90–58.54 | Verify | `/vulnhunt-fix-verify`; a second agent reviews patch and evidence, then issues a finding-specific verdict. No terminal tests or edits attributed to this read-only verifier. |
| 58.54–66.20 | Exploitability | Diagram traces an entry point through a missing authorization check toward protected data; a lock blocks the route after the patch. |
| 66.20–70.17 | Follow prompt | Three-step recap and the supplied narration's follow-for-more-AI-tools call to action. |

Footer progress advances through all eight sections. Pixel mascot and sparse particles animate continuously. Step colors progress from terracotta to mint and blue. Short stepped wipes separate sections without changing or interrupting the voice.

Current soundtrack: the user requested the actual audio from `inputs/post2.mp4`. It is extracted without reencoding, repeated at its original tempo to cover the narration, and mixed with light voice ducking and the existing scene effects. This replaces the generated music; animation timings remain unchanged.
