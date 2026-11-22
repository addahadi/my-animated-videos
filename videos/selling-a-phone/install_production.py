"""Copy this project's prepared files into the explicitly requested production workspace."""
from pathlib import Path
import shutil, subprocess, json, sys
SOURCE=Path(__file__).resolve().parent
TARGET=Path('C:/Users/hecin/ai-video-editor/projects/selling-a-phone').resolve()
assert TARGET.parent==Path('C:/Users/hecin/ai-video-editor/projects').resolve()
assert TARGET.name=='selling-a-phone'
if '--v4' in sys.argv:
    shutil.copytree(SOURCE/'production-v4',TARGET,dirs_exist_ok=True,ignore=shutil.ignore_patterns('__pycache__','*.pyc','*-source.tsx.txt'))
    shutil.copy2(SOURCE/'brief.md',TARGET/'brief.md')
    print('Installed v4 handover opening; approved body and earlier versions preserved.')
    raise SystemExit(0)
if '--v3' in sys.argv:
    shutil.copytree(SOURCE/'production-v3',TARGET,dirs_exist_ok=True,ignore=shutil.ignore_patterns('__pycache__','*.pyc','*-source.tsx.txt'))
    shutil.copy2(SOURCE/'brief.md',TARGET/'brief.md')
    print('Installed v3 opening and caption-free source; earlier versions preserved.')
    raise SystemExit(0)
if '--v2' in sys.argv:
    shutil.copytree(SOURCE/'production-v2',TARGET,dirs_exist_ok=True,ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
    subprocess.run(['python',str(TARGET/'make_timeline_v2.py')],check=True)
    print('Installed approved v2 sources; v1 source and exports preserved.')
    raise SystemExit(0)
if '--finalize' in sys.argv:
    validation=json.loads((TARGET/'exports/validation.json').read_text(encoding='utf-8'))
    assert validation['passed']
    note='''# Selling a phone — completed 2026-10-28

Production: `C:/Users/hecin/ai-video-editor/projects/selling-a-phone/`.

- Final: `exports/selling-a-phone-design2.mp4`, 113 seconds, 1080×1920, 30 fps, 3,390 frames, H.264/yuv420p and AAC.
- Design 2: light canvas, layered phone, electric blue, same-object close-ups, short progressive Arabic phrases. Original RunTime.tech branding.
- All nine supplied recordings are preserved in numerical order. Narration is 112.170667 seconds, with about 0.829 seconds of final picture hold. Constant 0.9 gain; no speech trimming or replacement.
- The voice recordings are shorter than portions of the written script; no missing narration was synthesized.
- TypeScript check passed. Full final decode passed with zero errors. Complete narration correlation is 0.999991 at its original timing; all nine clip checks pass. AAC timing and video color range were corrected during final packaging.
- Reviewed representative final frames and the camera-move filmstrip. `exports/contact-sheet.jpg`, `exports/motion-review.jpg`, `exports/preview.mp4` and `exports/validation.json` retain the review evidence.
- Editable source is in `src/`; rebuild commands and review limitations are in `README.md`. Existing projects were preserved.
'''
    (TARGET/'production-note.md').write_text(note,encoding='utf-8')
    (SOURCE/'production-note.md').write_text(note,encoding='utf-8')
    print('Completion note saved; final validation passed.')
    raise SystemExit(0)
TARGET.mkdir(parents=True,exist_ok=True)
shutil.copytree(SOURCE/'production',TARGET,dirs_exist_ok=True)
shutil.copytree(SOURCE/'inputs',TARGET/'inputs',dirs_exist_ok=True)
shutil.copytree(SOURCE/'analysis',TARGET/'analysis',dirs_exist_ok=True)
shutil.copy2(SOURCE/'script.md',TARGET/'script.md')
shutil.copy2(SOURCE/'prepare_analysis.py',TARGET/'prepare_analysis.py')
(TARGET/'media').mkdir(exist_ok=True)
shutil.copy2(SOURCE/'analysis/narration.wav',TARGET/'media/narration.wav')
STYLE=Path('C:/Users/hecin/ai-video-editor/projects/qr-code-explainer')
shutil.copy2(STYLE/'media/tajawal-bold.ttf',TARGET/'media/tajawal-bold.ttf')
shutil.copy2(STYLE/'font-OFL.txt',TARGET/'font-OFL.txt')
subprocess.run(['python',str(TARGET/'make_timeline.py')],check=True)
print('Installed isolated project:',TARGET)
