"""Read owner-classified E3 markers; semantics still require source review."""
import hashlib,os,re

def norm(text):
    return re.sub(r'\s+',' ',text).strip().lower()

def marker_question(text):
    return norm(re.sub(r'(?:(?:^|(?<=[.?!])|\s*;)\s*Owner(?:s|\(s\))?\s*:\s.*|\s*\(\s*Owner(?:s|\(s\))?\s*:\s(?:[^()]|\([^()]*\))*\)[.?!]?)\s*$','',text.strip(),flags=re.S))

CLOSED_STATUS=re.compile(r'(?:Accepted - applied|Adjusted - applied|Rejected)(?:$|(?: \(| - |: |; )(?!\s*(?i:open|deferred|decided|pending|reopen\w*|withdrawn|superseded|in part|partly)\b))')

def unclosed_items(text):
    out=[]
    text=re.sub(r'<!--.*?-->','',text,flags=re.S)
    for m in re.finditer(r'^### (OI-\d+)\b(.*?)(?=^#{1,3} |\Z)',text,re.S|re.M):
        status=re.findall(r'^\s*-\s*\*\*Status:\*\*\s*(.*?)\s*$',m[2],re.M)
        if not status:out.append((m[1],'no Status line'))
        elif len(status)>1:out.append((m[1],f'{len(status)} Status lines'))
        elif not CLOSED_STATUS.match(status[0]):out.append((m[1],status[0]))
    return out

def filled(text):
    text=text.strip()
    return bool(text and text.lower() not in ('none','-','tbd','unknown') and not re.fullmatch(r'\[[^\]]+\]',text))

def bracketed(text,tag):
    out=[]
    for m in re.finditer(re.escape(tag)+r'\s*',text):
        depth,i=1,m.end()
        while i<len(text) and depth:
            depth+={'[':1,']':-1}.get(text[i],0);i+=1
        end=i-1 if not depth else text.find(']',m.end())
        if end>m.end():out.append(text[m.end():end])
    return out

def before_close(text):
    depth=0
    for i,ch in enumerate(text):
        if ch=='[':depth+=1
        elif ch==']':
            if not depth:return text[:i]
            depth-=1
    return text

def reconciled_block(master):
    block=re.search(r'\*\*Reconciled:\*\*([^\n]*(?:\n(?![ \t]*(?:[-*>|#\n]|$))[^\n]*)*)',master)
    return block[1] if block else None

ENTRY=re.compile(r'(?:^|(?<=\. ))[ \t]*\((\d+)\)\s*(\d{4}-\d\d-\d\d)',re.M)

def newest_entry(block):
    entries=list(ENTRY.finditer(block))
    if not entries:return block
    i=max(range(len(entries)),key=lambda k:int(entries[k][1]))
    return block[entries[i].start():entries[i+1].start() if i+1<len(entries) else len(block)]

def reconciled_date(master):
    block=reconciled_block(master)
    if block is None:return None
    numbered=[(int(n),d) for n,d in re.findall(r'\((\d+)\)\s*(\d{4}-\d\d-\d\d)',block)]
    if numbered:return max(numbered)[1]
    first=re.match(r'\s*(\d{4}-\d\d-\d\d)',block)
    return first[1] if first else None

def reconciled_entry(master):
    block=reconciled_block(master)
    return None if block is None else newest_entry(block)

def reconciled_hash(master):
    entry=reconciled_entry(master)
    if entry is None:return None
    found=(re.search(r'checked revision\s*`?\s*sha256:([0-9a-fA-F]{16,64})\s*\(chunks',entry)
           or re.search(r'sha256:([0-9a-fA-F]{16,64})\s*\(',entry) or re.search(r'sha256:([0-9a-fA-F]{16,64})\b',entry))
    return found[1].lower() if found else None

def cut_sections(text,heading):
    out=[];level=None
    for line in text.split('\n'):
        h=re.match(r'^(#{1,6}) ',line)
        if level is not None and h and len(h[1])<=level:level=None
        if level is None and h and re.match(heading,line):
            level=len(h[1]);continue
        if level is None:out.append(line)
    return '\n'.join(out)

def content_hash(sdd):
    names=sorted(n for n in os.listdir(sdd) if re.match(r'^(0\d|1[0-7])[a-z]?-.*\.md$',n))
    if not names:return None
    parts=[]
    for name in names:
        with open(os.path.join(sdd,name),encoding='utf-8',newline='') as f:
            text=f.read().replace('\r\n','\n')
        if name.startswith('00-'):
            text=cut_sections(text,r'^#+ (?:Changes Log|Child LLDs)\b')
            text='\n'.join(l for l in text.split('\n') if not re.match(r'^\*\*(?:Status|Reviewers|Approvers|Date):\*\*',l))
        parts.append(text)
    return hashlib.sha256(''.join(parts).encode('utf-8')).hexdigest()

def evaluate_inventory(files,master):
    live=[];optional=[]
    for name,text in files.items():
        text=re.sub(r'<!--.*?-->','',text,flags=re.S)
        live += [(name,marker_question(m)) for m in bracketed(text,'[NEEDS CLARIFICATION:')]
        optional += [(name,marker_question(m)) for m in bracketed(text,'[TBD - EXTERNAL:')]
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
        asked=marker_question(before_close(re.sub(r'^\s*(?:\[[^\]]*\]\([^)]*\)[\s,;]*)+:?','',source)))
        matched=[i for i,(name,question) in enumerate(live) if filename and filename[1]==name and question.rstrip('.')==asked.rstrip('.')]
        external=[i for i,(name,question) in enumerate(optional) if filename and filename[1]==name and question.rstrip('.')==asked.rstrip('.')]
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
    if unclassified:blockers['unclassified markers']=unclassified
    return {'mode':'inventory','blockers':blockers,'problems':problems,'unclassified':unclassified}
