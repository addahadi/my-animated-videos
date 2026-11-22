"""Stage and install the user's approved Design 2 documentation update only."""
from pathlib import Path
import hashlib
import json
import sys

HERE = Path(__file__).resolve().parent
ROOT = Path('C:/Users/hecin/ai-video-editor')
STYLE = ROOT / 'projects/qr-code-explainer'
MANIFEST = HERE / 'manifest.json'

def digest(data):
    return hashlib.sha256(data).hexdigest() if data is not None else None

def section(text, start, end, replacement):
    left = text.index(start)
    right = text.index(end, left)
    return text[:left] + replacement.rstrip() + '\n\n' + text[right:]

def prepare():
    changes = {}
    def stage(path, content):
        original = path.read_bytes() if path.exists() else None
        data = content.encode('utf-8')
        if data == original:
            return
        name = f'{len(changes):02d}-{path.name}'
        (HERE / name).write_bytes(data)
        changes[str(path)] = {'staged': name, 'before_sha256': digest(original), 'after_sha256': digest(data)}

    guide = (STYLE / 'style-guide.md').read_text(encoding='utf-8')
    archive = STYLE / 'style-guide-qr-reference-2026-10-28.md'
    if not archive.exists():
        stage(archive, guide)
    stage(STYLE / 'style-guide.md', (HERE / 'style-guide.md').read_text(encoding='utf-8'))
    stage(STYLE / 'style.md', '''# Design 2

Follow [style-guide.md](style-guide.md), the canonical reusable Design 2 guide updated after approval of selling-a-phone v4 on 2026-11-01.

Light canvas, blue emphasis, clear vector artwork, narration-led actions, purposeful motion and no bottom narration captions by default. Adapt the scenes and props to each new topic. The guide links the approved video and review frames.
''')
    agents = (ROOT / 'AGENTS.md').read_text(encoding='utf-8')
    agents = section(agents, '# Second animated video design', '# RunTime tech default visual style', '''# Second animated video design — Design 2 (approved update, 2026-11-01)

- **Design 2: light blue explanatory animation** is a reusable option for future Instagram videos on different topics. The user approved the caption-free [`projects/selling-a-phone/exports/v4/selling-a-phone-v4.mp4`](projects/selling-a-phone/exports/v4/selling-a-phone-v4.mp4) and asked to update Design 2 to reflect it. This supersedes the earlier QR-reference candidate's captions, routine camera zooms and hardware-focused staging as default guidance.
- When the user requests **Design 2**, **the QR-code video style**, **the light blue technical style**, or **the approved selling-a-phone design**, follow [`projects/qr-code-explainer/style-guide.md`](projects/qr-code-explainer/style-guide.md). `style.md` in that folder is a shortcut. Inspect the selling-a-phone v4 hook/storyboard and use its `src-v4/` as the current visual/behavioral reference. Older QR exports remain historical references.
- Preserve the cool light-gray canvas, white surfaces, near-black vector outlines, electric-blue emphasis, occasional yellow warnings, locally bundled Tajawal Bold, quiet original branding and generous portrait spacing. Use simple outlined people, relevant props and readable UI when they explain the idea. **Bottom narration captions are off by default**; retain short functional headings, step names, role labels and UI text. Use the freed space for the demonstration or breathing room.
- Understand the script and actual voice before designing. Show the narrated action, context and consequence with a clear starting state and result. Keep a stable camera by default; use zooms only to explain a relevant detail. No unrelated circuitry, RAM/CPU, technical rings or decorative motion. Warnings and visual outcomes must match what is actually said.
- Adapt every new topic's hook, objects, interactions, scene count and timing. A phone, seller/buyer handover, seven-step checklist and 113-second duration are content from the reference video, not fixed style elements. Preserve supplied recordings and order. Use `frontend-design` for planning/critique and follow the Graphify code workflow below.
- Keep Design 2 **light** unless explicitly asked otherwise. Design 1 remains the standing dark-mode default when no style is specified. An explicit new brief overrides either style. Preserve completed exports, follow channel language preferences and keep publishing manual.
''')
    stage(ROOT / 'AGENTS.md', agents)
    claude = (ROOT / 'CLAUDE.md').read_text(encoding='utf-8')
    start = claude.index('- **Design 2**')
    end = claude.index('\n- When no animation style', start)
    claude = claude[:start] + '''- **Design 2** is the approved light blue explanatory animation option, updated 2026-11-01 after approval of selling-a-phone v4. Follow [`projects/qr-code-explainer/style-guide.md`](projects/qr-code-explainer/style-guide.md) (also linked by `style.md`). Inspect [`projects/selling-a-phone/exports/v4/final-storyboard.jpg`](projects/selling-a-phone/exports/v4/final-storyboard.jpg), the opening preview and `src-v4/`. Preserve the light-gray/white/blue vector identity, quiet branding and readable UI. Bottom narration captions are off by default; short functional headings and labels remain. Show narration-specific actions and consequences; use a stable camera and purposeful motion. Do not add unrelated hardware interiors or routine zooms. Adapt the scenario and objects to each new topic. Earlier QR captions/zoom studies are historical. See root `AGENTS.md` for selection rules; Design 1 remains the separate standing default.''' + claude[end:]
    stage(ROOT / 'CLAUDE.md', claude)
    qr_readme = (STYLE / 'README.md').read_text(encoding='utf-8')
    line_end = qr_readme.index('\n')
    qr_readme = qr_readme[:line_end+1] + '''
> Reusable Design 2 was updated on 2026-11-01 to the user-approved, caption-free selling-a-phone v4 design. Follow [style-guide.md](style-guide.md), also linked by [style.md](style.md), for new videos. This QR project's captions, hardware illustrations and camera studies below describe its historical implementation; they are not current Design 2 defaults.
''' + qr_readme[line_end+1:]
    stage(STYLE / 'README.md', qr_readme)
    MANIFEST.write_text(json.dumps(changes, indent=2), encoding='utf-8')
    print(json.dumps({'prepared': len(changes), 'targets': list(changes)}, indent=2))

def apply():
    changes = json.loads(MANIFEST.read_text(encoding='utf-8'))
    allowed = {ROOT / 'AGENTS.md', ROOT / 'CLAUDE.md', STYLE / 'style-guide.md', STYLE / 'style.md', STYLE / 'style-guide-qr-reference-2026-10-28.md', STYLE / 'README.md'}
    # Validate every target and preimage before any writes; preserve concurrent edits.
    for name, item in changes.items():
        path = Path(name)
        assert path in allowed, path
        current = path.read_bytes() if path.exists() else None
        assert digest(current) == item['before_sha256'], f'Changed since staging: {path}'
        assert digest((HERE / item['staged']).read_bytes()) == item['after_sha256']
    for name, item in changes.items():
        path = Path(name)
        path.write_bytes((HERE / item['staged']).read_bytes())
        assert digest(path.read_bytes()) == item['after_sha256']
        print(f'Updated {path}')

if __name__ == '__main__':
    if sys.argv[1:] == ['--prepare']:
        prepare()
    elif sys.argv[1:] == ['--apply']:
        apply()
    else:
        raise SystemExit('Use --prepare or --apply')
