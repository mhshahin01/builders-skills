import re

TOKEN = r'[a-z][a-z-]*(?:\.[a-z][a-z-]*)+'


def literal(value):
    value = value.strip()
    if value.startswith('`') and value.endswith('`') and value.count('`') == 2:
        return value[1:-1]
    return value


def registry_tokens(text):
    out = set()
    for line in text.splitlines():
        if not line.lstrip().startswith('|'):
            continue
        first = literal(line.strip().strip('|').split('|')[0])
        if re.fullmatch(TOKEN, first):
            out.add(first)
    return out


def permission_values(cell):
    value = literal(cell)
    if re.fullmatch(TOKEN, value):
        return [value]
    return []


def consumers(cell):
    value = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", cell).replace('`', '').replace('**', '')
    out, depth, part = [], 0, ''
    for ch in value:
        depth += (ch == '(') - (ch == ')')
        if ch == ',' and depth == 0:
            out.append(part.strip())
            part = ''
        else:
            part += ch
    out.append(part.strip())
    return [c for c in out if c]
