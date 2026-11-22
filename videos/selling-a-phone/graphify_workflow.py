from pathlib import Path
import json,re,sys,runpy,os
sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'.graphify-deps'))
os.environ['PYTHONPATH']=str(ROOT/'.graphify-deps')+(os.pathsep+os.environ['PYTHONPATH'] if os.environ.get('PYTHONPATH') else '')
OUT=ROOT/'analysis/graphify'
OUT.mkdir(exist_ok=True)
if len(sys.argv)>1 and sys.argv[1]=='vocab':
    graph_path=Path(sys.argv[2]) if len(sys.argv)>2 else Path('C:/Users/hecin/ai-video-editor/graphify-out/graph.json')
    data=json.loads(graph_path.read_text(encoding='utf-8'))
    vocab=set()
    for node in data['nodes']:
        for token in re.findall(r'[^\W\d_]+',node.get('label','') or '',re.UNICODE):
            for part in re.findall(r'[A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+',token) or [token]:
                if 3<=len(part)<=30:vocab.add(part.lower())
    (OUT/'.vocab.txt').write_text('\n'.join(sorted(vocab)),encoding='utf-8')
    candidates=['selling','phone','intro','handover','caption','narration','remotion','video','animation','timeline','render','device','data','rows','ready']
    selected=[word for word in candidates if word in vocab]
    print(json.dumps({'graph_nodes':len(data['nodes']),'graph_edges':len(data.get('links',data.get('edges',[]))),'vocabulary_tokens':len(vocab),'matched_vocabulary':selected,'selling_project_nodes':sum('selling-a-phone' in str(n.get('source_file','')) for n in data['nodes'])},indent=2))
    if len(data['nodes'])<100:print('Scoped node labels:',[(n.get('label'),n.get('source_location')) for n in data['nodes']])
elif len(sys.argv)>1 and sys.argv[1]=='runtime':
    import importlib.metadata
    distribution=importlib.metadata.distribution('graphifyy')
    print('Version:',distribution.version)
    print('Entry points:',[(e.name,e.value) for e in distribution.entry_points])
elif len(sys.argv)>1 and sys.argv[1] in ('cli','cli-root','cli-v4'):
    if sys.argv[1]=='cli-root':os.chdir('C:/Users/hecin/ai-video-editor')
    if sys.argv[1]=='cli-v4':os.chdir('C:/Users/hecin/ai-video-editor/projects/selling-a-phone/src-v4')
    sys.argv=['graphify',*sys.argv[2:]]
    import importlib.metadata
    entry=next(e for e in importlib.metadata.distribution('graphifyy').entry_points if e.name=='graphify')
    entry.load()()
else:
    raise SystemExit('Use vocab or cli followed by Graphify arguments.')
