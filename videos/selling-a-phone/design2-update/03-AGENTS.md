# Design preference

- Always use the repository's `frontend-design` skill for design work, including creating or redesigning websites, apps, UI components, layouts, typography, colors, and visual styling. Read [`.agents/skills/frontend-design/SKILL.md`](.agents/skills/frontend-design/SKILL.md) before starting and follow its design planning, review, and critique workflow. Apply its relevant visual principles to other design tasks alongside any task-specific skills. Respect explicit user briefs and existing design systems.

# Default animated video design — Design 1 (user preference, 2026-10-24)

- For future 2D animated explainers, use the approved `projects/n8n-reference-animation/` design **in dark mode**. The user approved this design and requested it as the standing preference, rather than a one-project override. Apply it automatically without asking for the style again.
- Follow [`projects/n8n-reference-animation/dark-mode-style.md`](projects/n8n-reference-animation/dark-mode-style.md): dark canvas and app windows, readable light text and outlines, coral accents, the original coral node-bot, centered phrase captions, compact app demonstrations, and purposeful workflow motion. Inspect the approved light reference contact sheet and reuse the existing Remotion composition as the structural reference. The dark palette is an adaptation; no dark render has been approved yet.
- This preference takes precedence over the paper-workshop default for animated videos, including RunTime tech explainers. Retain each channel's audience and language preferences. Keep the paper-workshop identity for other RunTime tech formats unless explicitly overridden.
- Use `frontend-design` for planning and critique. A new explicit brief can override this default. Do not automatically recolor completed exports or change unrelated projects.

# Second animated video design — Design 2 (approved update, 2026-11-01)

- **Design 2: light blue explanatory animation** is a reusable option for future Instagram videos on different topics. The user approved the caption-free [`projects/selling-a-phone/exports/v4/selling-a-phone-v4.mp4`](projects/selling-a-phone/exports/v4/selling-a-phone-v4.mp4) and asked to update Design 2 to reflect it. This supersedes the earlier QR-reference candidate's captions, routine camera zooms and hardware-focused staging as default guidance.
- When the user requests **Design 2**, **the QR-code video style**, **the light blue technical style**, or **the approved selling-a-phone design**, follow [`projects/qr-code-explainer/style-guide.md`](projects/qr-code-explainer/style-guide.md). `style.md` in that folder is a shortcut. Inspect the selling-a-phone v4 hook/storyboard and use its `src-v4/` as the current visual/behavioral reference. Older QR exports remain historical references.
- Preserve the cool light-gray canvas, white surfaces, near-black vector outlines, electric-blue emphasis, occasional yellow warnings, locally bundled Tajawal Bold, quiet original branding and generous portrait spacing. Use simple outlined people, relevant props and readable UI when they explain the idea. **Bottom narration captions are off by default**; retain short functional headings, step names, role labels and UI text. Use the freed space for the demonstration or breathing room.
- Understand the script and actual voice before designing. Show the narrated action, context and consequence with a clear starting state and result. Keep a stable camera by default; use zooms only to explain a relevant detail. No unrelated circuitry, RAM/CPU, technical rings or decorative motion. Warnings and visual outcomes must match what is actually said.
- Adapt every new topic's hook, objects, interactions, scene count and timing. A phone, seller/buyer handover, seven-step checklist and 113-second duration are content from the reference video, not fixed style elements. Preserve supplied recordings and order. Use `frontend-design` for planning/critique and follow the Graphify code workflow below.
- Keep Design 2 **light** unless explicitly asked otherwise. Design 1 remains the standing dark-mode default when no style is specified. An explicit new brief overrides either style. Preserve completed exports, follow channel language preferences and keep publishing manual.

# RunTime tech default visual style (Codex and Claude)

- Use [`runtime-paper-workshop-style`](integrations/runtime-paper-workshop-style/SKILL.md) automatically for RunTime tech still visuals and explicitly requested workshop-style videos. Future animated explainers follow the dark animation default above. Treat Runtime Tech, Runtime teck and Reuntime teck as the same account. When using the workshop identity, read the skill alongside `frontend-design` before planning or rendering; do not ask the user to select the style again. An explicit user brief can override it. Keep other brands' design preferences separate.
- Preserve the established identity: torn cream paper, masking tape, wood/green/slate workshop surfaces, the blue folded-paper mascot, and red Algerian Darija caption strips. Improve Arabic readability, spacing, material lighting and purposeful motion while retaining these anchors.
- Before design work, inspect the bundled [Gemini visual reference](integrations/runtime-paper-workshop-style/references/contact-sheet.jpg). For coding reels, also inspect the [Claude vibe-coding reference](integrations/runtime-paper-workshop-style/references/claude-vibe-contact-sheet.jpg). These references establish the visual design, not product capability claims.
- When the topic names Claude or another tool, make that product clearly visible in a relevant prop and narration. Keep the blue RunTime mascot as the permanent character unless the user requests a different character. Claude is a topic-specific prop, not a requirement for every Runtime Tech video.
- The canonical shared skill lives in `integrations/runtime-paper-workshop-style/`; update that bundle rather than creating separate copies. Project discovery links are `.agents/skills/runtime-paper-workshop-style` for Codex and `.claude/skills/runtime-paper-workshop-style` for Claude Code, including `claude-omniroute`. Global links at `/home/missoum/.codex/skills/runtime-paper-workshop-style` and `/home/missoum/.claude/skills/runtime-paper-workshop-style` point to the same bundle, with automatic invocation enabled. Explicit invocation remains `$runtime-paper-workshop-style` in Codex or `/runtime-paper-workshop-style` in Claude Code.
- Apply the identity in the existing local renderer. Follow the Google Flow workflow when generated video is requested. Save deliverables in `projects/<name>/`; Instagram publishing remains manual.

# Shared workspace instructions

- Before working in this repository, read root [`CLAUDE.md`](CLAUDE.md) for the workspace map, component-specific commands, and production safeguards. Those instructions apply to Codex as well as Claude Code; this workspace has no root build or test command.
- Keep Claude Code support intact: do not remove or replace `CLAUDE.md`, `.claude/`, or skill installation metadata when configuring another assistant.
- Codex discovers the shared `video-perception` skill through `.agents/skills/video-perception`, linked to the existing `.claude/skills/video-perception` installation. Use it for video review and analysis as directed in `CLAUDE.md`.
- Before following that skill's tool workflow, verify that its `claude-video-vision` MCP tools are available in the current client. If unavailable, report the missing dependency; do not assume access or invent analysis results. The separate Concat MCP adapter does not provide those tools.

# Daily tool update checks

- User requires no additional cost for update checks. Use free official release pages and registries; do not create paid monitors, subscriptions, or metered automations. The two TinyFish monitors created on 2026-10-16 were canceled at the user's request.
- User preference: check daily for new versions of Concat, Graphify (`graphifyy`), and other tools actively used in this workspace. Use official release pages or package registries, compare with the installed version or pinned commit, and report relevant changes with source links.
- During an active session, check if today's check (Africa/Algiers date) has already been recorded before repeating it. Record the date, installed/latest versions, sources, and any failed checks in `workspace-data/tool-update-checks/latest.md`.
- Checking versions does not authorize installing upgrades, changing pinned dependencies, or advancing the Concat submodule.
- With no free background schedule configured, check once per day during an active workspace session. Do not promise checks on days when no session runs.

# Channel audience and language preferences

- **enjoy.with.ai**: English, global audience. Visual AI experiments, creative builds, and demos with broad appeal.
- **RunTime tech**: North African audience, especially Algeria. Local references, relevant tech topics, and Algerian Darija where appropriate. Use the dark animation default for future animated explainers and `runtime-paper-workshop-style` for other visual content unless explicitly overridden.
- Apply the intended channel's audience and language preferences when planning content, writing scripts, and producing channel assets.

# Instagram skills (Codex and Claude through OmniRoute)

- Use the installed `ig-*` skills for Instagram captions, carousel plans, hook analysis, hashtags, humanizing/audits, content calendars, repurposing, profile optimization, and audience insights. Codex discovers them in `.agents/skills/`; Claude Code, including `claude-omniroute`, discovers the same nine skills in `.claude/skills/`.
- The shared bundle is `integrations/instagram-skills/`. Read its root `SKILL.md` alongside the relevant skill. Discovery entries are symlinks: resolve the skill directory before following relative references such as `../../references/`. Run bundle Python imports from the bundle root so `lib` resolves correctly.
- Follow the workspace configuration in `integrations/instagram-skills-setup/README.md`. Publishing stays manual: deliver captions and local media for the user to upload. Approval of a draft does not enable Publora, a custom poster, or automatic scheduling. Do not use Pixfaro; render slides locally with `tools/slide_render.py` and use Google Flow when video generation is needed.
- Apply the channel preferences above. The upstream voice profile is blank; do not claim to have learned the user's voice or blend the two channels. Use pasted posts/statistics for analysis unless an available data source is explicitly authorized; never invent live Instagram metrics.
- Upstream algorithm and format guidance is a starting point. Verify current platform rules and claims when the task depends on them. Optional Apify/Publora/Pixfaro configuration is not required for these skills to draft content.

# Marketing skills (Codex and Claude through OmniRoute)

- Use the relevant skills from [Corey Haines's Marketing Skills](https://github.com/coreyhaines31/marketingskills) when a task needs marketing strategy, positioning, copywriting/editing, SEO, conversion optimization, launches, email, paid ads, analytics, customer research, or growth planning. Read the matching `SKILL.md` before applying it; load additional references only as needed.
- The pinned shared bundle is [`integrations/marketingskills/`](integrations/marketingskills/README.md). All 50 skills are linked individually in `.agents/skills/` for Codex and `.claude/skills/` for Claude Code, including `claude-omniroute`. Resolve discovery symlinks before following relative references; paths to the bundle's `tools/` refer to `integrations/marketingskills/tools/`. See [`integrations/marketingskills-setup/README.md`](integrations/marketingskills-setup/README.md) for the version, full skill list, usage and maintenance.
- Use `product-marketing` for shared product/audience/positioning context; check the relevant project's existing context before drafting. This workspace contains multiple projects and channels: keep their context and evidence separate rather than inventing one product or brand voice for the whole repository. Follow the channel language and audience preferences above.
- For Instagram tasks, use the specialized `ig-*` skills and their existing workspace configuration; use these general marketing skills for supporting strategy when useful. Pair visual work with `frontend-design`, use Google Flow for video generation, and keep deliverables in `projects/<name>/`. The general `image` and `video` skills do not replace these production preferences.
- Installing this bundle provides guidance and optional tool source; it does not configure accounts, credentials, MCP servers, publishing, outreach, ads, paid services or recurring jobs. Follow existing task authorization for external actions, and keep Instagram publishing manual. Check updates under the daily free-check policy above; updating the pinned bundle requires user authorization.

# Cinematic prompting skill (Codex and Claude Code)

- Use the installed `higgsfield` skill for cinematic AI image/video prompt planning and refinement, camera direction, motion, and shot continuity, including Google Flow reels. Read its root `SKILL.md` and the relevant sub-skills before applying their guidance.
- Codex loads the bundle from `/home/missoum/.codex/skills/higgsfield/`; Claude Code, including `claude-omniroute`, discovers the same bundle through `.claude/skills/higgsfield`. Resolve the symlink before following relative references. Explicit invocation: `$higgsfield` in Codex or `/higgsfield` in Claude Code.
- Use the skill's cinematic prompting principles with the selected generation tool. Higgsfield-specific model parameters, named presets and account workflows apply only when verified on that platform; Google Flow remains the video-generation tool for this workspace.
- Keep deliverables in `projects/<name>/`, follow the channel preferences above, and keep Instagram publishing manual. See `integrations/higgsfield-skill-setup/README.md` for the pinned version and installation details.

# Local AI GPU preference

- Prefer the NVIDIA GTX 1650 (4 GB VRAM) for local TTS, LLM, and compatible AI inference. Use `python3 tools/ai_gpu.py check` first; `tts`, `llm`, and `python` subcommands use the CUDA-enabled `.venv-darija-voice` environment. Details and reinstall commands are in `tools/README.md`.
- Codex's sandbox hides NVIDIA device files. If CUDA detection fails there, request approved execution outside the sandbox before diagnosing a driver failure or falling back to CPU.
- Use FP16/FP32, small models and short chunks; do not assume BF16 or FlashAttention support. Custom scripts must place models and inputs on CUDA explicitly. Verify actual GPU inference and report any CPU fallback.
- The local Algerian Habibi/F5 checkpoint requires FP32 on this GTX 1650: FP16 synthesis produced invalid audio. The `tts` launcher applies FP32 checkpoint loading; preserve this setting in custom speech scripts.

# Video generation preferences

- Use Google Flow for video generation whenever you need it.
- Always write detailed, high-quality video prompts. Specify subject design, counts, setting, lighting, camera, a feasible action sequence, physical motion, and continuity constraints to reduce hallucinations.
- For sequential clips, use the final frame of the preceding video as the first frame of the next video whenever supported. Inspect the frames and verify continuity before assembling the result.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

### Codex query and maintenance defaults

- Read `.agents/skills/graphify/SKILL.md` for `/graphify` workflows. The installed bundle and its references also live at `.codex/skills/graphify/`.
- Start with a focused `graphify query "<question>" --budget 2000`. Use `--seed "<symbol or file>"` and `--context call` or `--context import` when broad keyword matches produce unrelated results. Increase the budget only when the task needs more context; the budget is a soft limit.
- Use `graphify affected "<symbol>"` to inspect callers and dependents before changing shared code. Treat inferred edges as leads and verify claims against the referenced source lines.
- If a query is ambiguous or has no matches, refine the symbol or file name. If the graph still cannot locate the relevant source, use a narrow `rg` search to locate it; never invent graph results or let missing coverage prevent necessary work.
- After a batch of code changes, run `graphify update .`, then `graphify export wiki` to refresh the navigation wiki. Routine maintenance uses local extraction; use semantic extraction or LLM labeling only when the task calls for it.
- `.graphifyignore` excludes generated media, output, dependency trees and Graphify's own skill bundle. Keep application source, tests, production scripts and project documentation indexed.
- The packaged `graphify hook-check` Codex hook is intentionally a no-op; these AGENTS.md rules provide the query-first behavior. Do not describe that hook as enforcing queries or refreshing the graph.


## Video tool selection: Remotion, Concat and Natron

- Select tools by the requested result. Remotion and Concat are the main production tools; Natron is an optional specialist. A video does not need to pass through all three. Prefer completing work in the selected tool and combine tools only when another adds a clear benefit.
- **Remotion:** use the existing `motion/` setup for code-driven animation, animated captions, branded explainers, motion graphics and reusable templates, especially RunTime tech reels. It can render a complete video when no separate timeline edit is needed.
- **Concat:** use for footage-led timeline editing, arranging and trimming clips, audio synchronization, and final assembly. Use the installed workspace version and existing CLI/MCP workflow; verify that needed features work in that version.
- **Natron:** automatically select it for a shot requiring more involved compositing, such as detailed keying, rotoscoping, tracking, complex masks or an OpenFX node graph, when it offers a clear advantage over the selected editor. Basic masking, simple layering or color adjustments alone should stay in Remotion or Concat when they can handle them. The user need not name Natron or choose the tool again; read the shared `natron` skill when selecting it.
- **Google Flow:** remains the tool for AI-generated footage. Apply the intended channel's visual identity across tools and keep Instagram publishing manual.
- Natron 2.5.0 is installed user-locally. Use the shared [`natron`](integrations/natron/SKILL.md) skill for Natron projects, OpenFX compositing and Python render automation. Both assistants have project and global discovery links; Claude Code through `claude-omniroute` uses the same skill.
- Commands: `natron` for the GUI, `natron-render` / `NatronRenderer` for batch work, and `natron-agent check` / `natron-agent smoke-test` for diagnostics. Setup and verified examples: [`integrations/natron/README.md`](integrations/natron/README.md).
- Run scripts inside Natron's bundled Python through NatronRenderer, not system Python. Use the skill's tested batch cleanup to avoid the 2.5.0 Python shutdown crash. Keep editable projects in `projects/<name>/` and rendered files in `exports/`.
- Natron handles compositing; retain Google Flow for AI footage and Remotion for programmatic animation. Apply the intended channel's existing design rules. Publishing stays manual.
