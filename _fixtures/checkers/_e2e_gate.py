"""Read owner-classified E3 markers; semantics still require source review."""
import re

def norm(text):
    return re.sub(r'\s+',' ',text).strip().lower()

def filled(text):
    text=text.strip()
    return bool(text and text.lower() not in ('none','-','tbd','unknown') and not re.fullmatch(r'\[[^\]]+\]',text))

def evaluate_inventory(files,master):
    live=[];optional=[]
    for name,text in files.items():
        text=re.sub(r'<!--.*?-->','',text,flags=re.S)
        live += [(name,norm(m)) for m in re.findall(r'\[NEEDS CLARIFICATION:\s*([^\]]+)\]',text)]
        optional += [(name,norm(m)) for m in re.findall(r'\[TBD - EXTERNAL:\s*([^\]]+)\]',text)]
    section=re.search(r'^### E3 marker inventory\s*\n(.*?)(?=^#{1,3} |\Z)',master,re.M|re.S)
    if not section:
        return {'mode':'legacy','blockers':{},'problems':[],'unclassified':len(live)}
    rows=[];problems=[];blockers={}
    for line in section[1].splitlines():
        if not line.startswith('|'):continue
        cells=[c.strip() for c in line.strip().strip('|').split('|')]
        if cells[0].startswith('Marker source') or re.fullmatch(r':?-+:?',cells[0]):continue
        if len(cells)!=5:
            problems.append('E3 inventory row must have five columns');continue
        source,owner,claim,decision,action=cells
        filename=re.search(r'\b(\d\d[a-z]?-[\w-]+\.md)\b',source)
        asked=norm(re.sub(r'^\s*(?:\[[^\]]*\]\([^)]*\)[\s,;]*)+:?','',source).split(']')[0])
        matched=[i for i,(name,question) in enumerate(live) if filename and filename[1]==name and question==asked]
        external=[i for i,(name,question) in enumerate(optional) if filename and filename[1]==name and question==asked]
        if not matched and not external:problems.append('E3 obsolete or unmatched source/question: '+source)
        state=re.match(r'^(Yes|No)\b(?:\s*:\s*(.*))?$',decision,re.I)
        nonblocking=bool(state) and state[1].lower()=='no'
        if not filled(owner) or not (filled(action) or (nonblocking and action.lower()=='none')):problems.append('E3 row needs a named owner and next action: '+source)
        if not state:problems.append('E3 row needs Yes/No with a reason: '+source)
        elif state[1].lower()=='yes' and not filled(claim):problems.append('E3 blocking row needs a dependent claim/path: '+source)
        elif state[1].lower()=='no' and not (state[2] and filled(state[2])):problems.append('E3 nonblocking row needs a reason: '+source)
        rows.append((matched,state))
        if external and not matched and state and state[1].lower()=='yes':
            name=optional[external[0]][0];blockers[name]=blockers.get(name,0)+1
    unclassified=0
    for i,(name,question) in enumerate(live):
        matches=[state for indices,state in rows if i in indices]
        if not matches:
            unclassified+=1;problems.append('E3 unclassified marker: '+name+': '+question)
        elif len(matches)>1:problems.append('E3 duplicate classification: '+name+': '+question)
        elif matches[0] and matches[0][1].lower()=='yes':blockers[name]=blockers.get(name,0)+1
    return {'mode':'inventory','blockers':blockers,'problems':problems,'unclassified':unclassified}
