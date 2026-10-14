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
