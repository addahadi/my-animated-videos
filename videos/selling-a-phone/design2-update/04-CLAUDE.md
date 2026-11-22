# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

@AGENTS.md

## Claude Code skills

- **Design 2** is the approved light blue explanatory animation option, updated 2026-11-01 after approval of selling-a-phone v4. Follow [`projects/qr-code-explainer/style-guide.md`](projects/qr-code-explainer/style-guide.md) (also linked by `style.md`). Inspect [`projects/selling-a-phone/exports/v4/final-storyboard.jpg`](projects/selling-a-phone/exports/v4/final-storyboard.jpg), the opening preview and `src-v4/`. Preserve the light-gray/white/blue vector identity, quiet branding and readable UI. Bottom narration captions are off by default; short functional headings and labels remain. Show narration-specific actions and consequences; use a stable camera and purposeful motion. Do not add unrelated hardware interiors or routine zooms. Adapt the scenario and objects to each new topic. Earlier QR captions/zoom studies are historical. See root `AGENTS.md` for selection rules; Design 1 remains the separate standing default.
- When no animation style is specified for a future **2D animated explainer**, follow Design 1's standing dark-mode preference in `AGENTS.md` and [`projects/n8n-reference-animation/dark-mode-style.md`](projects/n8n-reference-animation/dark-mode-style.md). The user approved the n8n animation and requested this design in dark mode for future videos. It takes precedence over the workshop identity for animated explainers, including RunTime tech. Keep channel language preferences; an explicit Design 2 request or another brief can override it.
- For **RunTime tech** still visuals or explicitly requested workshop-style videos, including Runtime Tech, Runtime teck and Reuntime teck, apply [`runtime-paper-workshop-style`](integrations/runtime-paper-workshop-style/SKILL.md) alongside `frontend-design` before planning or rendering. Read its bundled [Gemini reference](integrations/runtime-paper-workshop-style/references/contact-sheet.jpg) and, for coding reels, the [Claude reference](integrations/runtime-paper-workshop-style/references/claude-vibe-contact-sheet.jpg). When using this identity, preserve the blue paper mascot, taped cream headings, wood/green/slate workshop surfaces and red Darija captions. Follow the default-style sections in `AGENTS.md`; an explicit user brief can override them.
- Keep the canonical skill in `integrations/runtime-paper-workshop-style/`. Claude's project link `.claude/skills/runtime-paper-workshop-style` and global link `/home/missoum/.claude/skills/runtime-paper-workshop-style`, plus Codex's `.agents/skills/runtime-paper-workshop-style` and `/home/missoum/.codex/skills/runtime-paper-workshop-style`, all refer to that shared bundle. Do not ask for style selection again. Explicit invocation is `/runtime-paper-workshop-style` in Claude Code. Preserve local rendering and manual publishing. When a named tool is the topic, show its identity in the prop and narration while retaining the blue RunTime mascot unless explicitly changed.
- The `frontend-design` skill is shared with Codex: `.claude/skills/frontend-design` links to `.agents/skills/frontend-design`. Always use it for design work as required by `AGENTS.md`.
- The `video-perception` skill is installed at `.claude/skills/video-perception/SKILL.md`. Use it when the user asks to watch, analyze, or review a video, or references a video file/YouTube URL. Follow its documented workflow and tool guidance. The installer found the skill under the name `video-perception` (not `claude-video-vision`).
- The `higgsfield` cinematic prompting skill is shared with Codex through [`.claude/skills/higgsfield/SKILL.md`](.claude/skills/higgsfield/SKILL.md). Use it for cinematic prompt planning/refinement, camera direction, motion and shot continuity, including Google Flow reels; invoke it explicitly with `/higgsfield`. Follow the cinematic prompting section in `AGENTS.md` and the setup notes in `integrations/higgsfield-skill-setup/README.md`. Resolve the skill directory before following its relative references.

## Browser tools

- Project `.mcp.json` registers the same Playwright MCP command and Chrome CDP endpoint as Codex (`http://127.0.0.1:9222`). It applies to Claude Code in this folder, including `claude-omniroute`. Use the existing Chrome session; if Chrome is not running with remote debugging, use `python3 tools/flow_reel.py launch-chrome` as documented in the Flow workflow below.

## Instagram skills (Codex and Claude through OmniRoute)

- Use the installed `ig-*` skills for Instagram captions, carousel plans, hook analysis, hashtags, humanizing/audits, content calendars, repurposing, profile optimization, and audience insights. Codex discovers them in `.agents/skills/`; Claude Code, including `claude-omniroute`, discovers the same nine skills in `.claude/skills/`.
- The shared bundle is `integrations/instagram-skills/`. Read its root `SKILL.md` alongside the relevant skill. Discovery entries are symlinks: resolve the skill directory before following relative references such as `../../references/`. Run bundle Python imports from the bundle root so `lib` resolves correctly.
- Follow the workspace configuration in `integrations/instagram-skills-setup/README.md`. Publishing stays manual: deliver captions and local media for the user to upload. Approval of a draft does not enable Publora, a custom poster, or automatic scheduling. Do not use Pixfaro; render slides locally with `tools/slide_render.py` and use Google Flow when video generation is needed.
- Apply the channel preferences in `AGENTS.md`: **enjoy.with.ai** uses English for a global audience; **RunTime tech** serves North Africa, especially Algeria, with Darija where appropriate. The upstream voice profile is blank; do not claim to have learned the user's voice or blend the two channels. Use pasted posts/statistics for analysis unless an available data source is explicitly authorized; never invent live Instagram metrics.
- Upstream algorithm and format guidance is a starting point. Verify current platform rules and claims when the task depends on them. Optional Apify/Publora/Pixfaro configuration is not required for these skills to draft content.

## Marketing skills (Codex and Claude through OmniRoute)

- Use the relevant [Marketing Skills](integrations/marketingskills/README.md) for marketing strategy, positioning, copywriting/editing, SEO, conversion optimization, launches, email, paid ads, analytics, customer research and growth planning. Read the matching `SKILL.md` and only the references needed for the task. All 50 skills share one pinned bundle in `integrations/marketingskills/`; Claude Code, including `claude-omniroute`, discovers them through `.claude/skills/`, and Codex through `.agents/skills/`.
- Explicit examples: `/copywriting`, `/seo-audit`, `/cro`, `/launch`, `/product-marketing` in Claude Code; `$copywriting`, `$seo-audit`, `$cro`, `$launch`, `$product-marketing` in Codex. Natural-language requests can also select a matching skill. Resolve the discovery symlink before following relative references; bundled `tools/` paths are relative to `integrations/marketingskills/`.
- Follow the marketing section in `AGENTS.md` and [`integrations/marketingskills-setup/README.md`](integrations/marketingskills-setup/README.md). Keep product/channel context separate, prefer the specialized `ig-*` skills for Instagram, pair design with `frontend-design`, use Google Flow for video generation, and keep Instagram publishing manual. Optional tool guides do not establish account access or authorize external actions. Apply the existing daily free update-check policy; do not automatically replace the pinned bundle.

## Workspace map

This directory is a collection of related video-production projects and tools, not one application with a root build or test command.

- `tools/` contains Python and JavaScript utilities for local slide rendering, reel planning/generation, media processing, and asset creation. Detailed workflows and options are in [`tools/README.md`](tools/README.md).
- `motion/` is a React/TypeScript Remotion composition project. Its `package.json` currently has no build or lint scripts; `npm test` is only a placeholder that exits with an error.
- `Concat/` is a separate Rust video editor project, tracked as a Git submodule pinned to a specific commit (`git submodule update --init --recursive`). Its Cargo workspace is `Concat/src/`; the crate architecture and build prerequisites are documented in [`Concat/src/README.md`](Concat/src/README.md), with contributor checks in [`Concat/CONTRIBUTING.md`](Concat/CONTRIBUTING.md).
- `concat-mcp/` is an MCP adapter for Concat's JSON-RPC CLI API, featuring convenience editing tools, mutation queue serialization, and a Node.js unit test suite. See [`concat-mcp/README.md`](concat-mcp/README.md) for setup, tool definitions, and testing.
- `assets/` holds reusable media and branding, with presenter previews in `assets/presenters/`. Each `projects/<name>/` holds scripts, plans and captions, its `media/` inputs, and its local `exports/` renders. Shared speech models live in `models/`. `workspace-data/` is for temporary tool reports, caches and diagnostics; `integrations/` contains assistant launchers and setup files. See [`projects/README.md`](projects/README.md).
- The former `reel/` and `reel-media/` were consolidated into `projects/`; update old commands to the new paths. Keep downloaded models and project exports out of Git. Historical verification reports may quote paths from before the move.

The root has no unified package manager, build, lint, or test command. Run commands from the relevant project directory and use its README as the detailed source of truth. `AGENTS.md` contains the video-generation preferences that apply when creating clips.

## Common workflows

### Local AI on the NVIDIA GPU

Prefer the GTX 1650 (4 GB VRAM) for compatible local TTS and LLM inference.
`python3 tools/ai_gpu.py check` verifies real CUDA computation using the
CUDA-enabled `.venv-darija-voice` environment; its `tts`, `llm`, and `python`
subcommands reuse that runtime. See `tools/README.md` for usage and pinned
installation commands. Use FP16/FP32 and small models or short chunks.
Habibi/F5 speech scripts must use FP32 weights on this GPU; FP16 synthesis
produced invalid audio, and the `tts` launcher applies the working FP32 setting.
Custom scripts must move models and inputs to CUDA explicitly. In Codex, the sandbox
hides NVIDIA device files: request approved execution outside the sandbox
before treating failed CUDA detection as a driver problem. Verify GPU use and
report any CPU fallback.

### Render Instagram slides locally

Do not use Pixfaro. Render slide images offline with `tools/slide_render.py`. For a slide plan, create a JSON spec and render a contact sheet for review before publishing; publishing is manual, so provide the PNGs for the user to upload.

```bash
python3 tools/slide_render.py --spec tools/slides.example.json \
  --out workspace-data/slides --contact-sheet
```

The renderer supports single-card mode and video/image backgrounds; see `tools/README.md` for spec shape and options. It requires Pillow, and ffmpeg for video-frame backgrounds.

### Generate and assemble a Flow reel

The documented pipeline is in `tools/README.md`. It uses the user's logged-in Chrome session; do not handle credentials or bypass sign-in/security challenges. Generation displays estimated credit usage and asks for confirmation unless explicitly skipped with `-y`.

```bash
python3 tools/flow_reel.py launch-chrome
python3 tools/flow_reel.py check-chrome
python3 tools/flow_reel.py plan --topic "AI system prompts" \
  --duration 40 --out projects/prompts/storyboard.json
python3 tools/flow_reel.py run --spec projects/prompts/storyboard.json \
  --media-dir projects/prompts/media
python3 tools/flow_reel.py assemble --spec projects/prompts/storyboard.json \
  --media-dir projects/prompts/media --out projects/prompts/exports/final.mp4
```

Requirements include Google Chrome, Node 24, ffmpeg, and ffprobe. Generation uses real credits. Follow `AGENTS.md` for prompt detail and clip-continuity preferences; consult `tools/README.md` for model selection, costs, resumability, and storyboard details.

### Build and test Concat

Run Rust commands from `Concat/src/`, not the workspace root. Native builds require Rust, FFmpeg 7+ development libraries, CMake, and a C++ toolchain; Linux UI dependencies may also be needed. See `Concat/src/README.md` for platform setup and alternate profiles.

```bash
cd Concat/src
cargo run -p concat                         # launch editor
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
```

The CLI is also in this workspace: `cargo run -p concat-cli -- probe <video>`, `cargo run -p concat-cli -- render <input> <output> --frames 120`, or `cargo run -p concat-cli -- api '<JSON request>'`. The detailed API and service commands are documented in `Concat/src/README.md`.

For changes to Concat UI strings, run `python3 scripts/locales.py` from `Concat/`. For model-manifest changes, run `python3 scripts/models.py --check` from `Concat/`; see `Concat/CONTRIBUTING.md`.

### Test and run Concat MCP adapter

The adapter wraps `concat-cli api` as MCP tools and includes a unit test suite covering engine lifecycle, RPC timeouts, schema mappings, editing convenience tools, and MCP server handlers.

```bash
cd concat-mcp
npm test                                    # run unit test suite
./launch.sh                                 # start stdio MCP server
```

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

### Claude Code through OmniRoute

- Use `.claude/skills/graphify/SKILL.md` for `/graphify` workflows. This project skill and `.claude/settings.json` hooks apply when Claude Code runs in this workspace, including through `claude-omniroute` or `omniroute launch --profile coding` with project settings enabled.
- Start codebase questions with a focused `graphify query "<question>" --budget 2000`. Use `--seed "<symbol or file>"` and context filters for noisy matches. Treat the graph as navigation and verify behavioral claims against source lines.
- Refine ambiguous or empty queries; if relevant source is still missing from the graph, use a narrow `rg` search. Missing coverage must not prevent necessary work.
- The installed PreToolUse hooks provide nonblocking reminders before raw searches and reads. They do not change models, authentication, permissions or OmniRoute routing. Keep them nonblocking so incomplete graph coverage does not halt work.
- After a batch of source changes, run `graphify update .` and `graphify export wiki`. Use local extraction for routine maintenance; do not start a full semantic rebuild merely because a session began.
- Share the existing graph, exclusions and Git update hooks with Codex. Avoid concurrent graph rebuilds from separate assistant sessions; let one finish before starting another.


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
