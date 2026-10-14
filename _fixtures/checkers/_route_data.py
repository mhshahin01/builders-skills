import ast
import json
import re


def objects_and_commas(text):
    objects, commas, stack = [], [], []
    quote = None
    comment = None
    escaped = False
    i = 0
    while i < len(text):
        ch = text[i]
        pair = text[i:i+2]
        if comment:
            if comment == 'line' and ch == '\n':
                comment = None
            elif comment == 'block' and pair == '*/':
                comment = None
                i += 1
        elif quote:
            if escaped:
                escaped = False
            elif ch == '\\':
                escaped = True
            elif ch == quote:
                quote = None
        elif pair in ('//', '/*'):
            comment = 'line' if pair == '//' else 'block'
            i += 1
        elif ch in ('"', "'", '`'):
            quote = ch
        elif ch in '{[(':
            stack.append((ch, i))
        elif ch in '}])':
            if not stack or stack[-1][0] != {'}': '{', ']': '[', ')': '('}[ch]:
                return [], []
            kind, start = stack.pop()
            if kind == '{':
                objects.append(text[start:i+1])
        elif ch == ',' and not stack:
            commas.append(i)
        i += 1
    return ([], []) if stack or quote or comment == 'block' else (objects, commas)


def properties(obj):
    inside = obj[1:-1]
    _, commas = objects_and_commas(inside)
    parts, start = [], 0
    for end in commas + [len(inside)]:
        parts.append(inside[start:end])
        start = end + 1
    out = {}
    for part in parts:
        m = re.match(r'^\s*([A-Za-z_$][\w$]*|"[^"\n]+"|\'[^\'\n]+\')\s*:\s*(.*?)\s*$', part, re.S)
        if not m:
            if part.strip():
                return {}
            continue
        key = m[1].strip('"\'')
        if key in out:
            return {}
        out[key] = m[2]
    return out


def literal(text):
    try:
        return ast.literal_eval(text)
    except (ValueError, SyntaxError):
        return None


def lexical_route(obj):
    props = properties(obj)
    path = literal(props.get('path', ''))
    if not isinstance(path, str):
        return None
    result = {'path': path, 'data_present': 'data' in props, 'data': None}
    data = props.get('data', '')
    if data.startswith('{') and data.endswith('}'):
        fields = properties(data)
        screen = literal(fields.get('screen', ''))
        ucs = literal(fields['useCases']) if 'useCases' in fields else []
        if isinstance(screen, str) and isinstance(ucs, list) and all(isinstance(u, str) for u in ucs):
            result['data'] = {'screen': screen, 'useCases': ucs}
    return result


def unique_object(pairs):
    out = {}
    for key, value in pairs:
        if key in out:
            raise ValueError('duplicate object property')
        out[key] = value
    return out


def json_routes(value):
    if isinstance(value, list):
        for child in value:
            yield from json_routes(child)
    elif isinstance(value, dict):
        if isinstance(value.get('path'), str):
            data = value.get('data')
            ucs = data.get('useCases', []) if isinstance(data, dict) else None
            valid = isinstance(data, dict) and isinstance(data.get('screen'), str) and isinstance(ucs, list) and all(isinstance(u, str) for u in ucs)
            yield {'path': value['path'], 'data_present': 'data' in value, 'data': {'screen': data['screen'], 'useCases': ucs} if valid else None}
        for child in value.values():
            if isinstance(child, (list, dict)):
                yield from json_routes(child)


def route_records(markdown):
    records = {}
    for fence in re.finditer(r'^```([^\n]*)\n(.*?)^```\s*$', markdown, re.M | re.S):
        language, body = fence[1].strip().lower(), fence[2]
        if language == 'json':
            try:
                routes = list(json_routes(json.loads(body, object_pairs_hook=unique_object)))
            except (ValueError, TypeError):
                routes = []
        elif language in ('ts', 'typescript', 'js', 'javascript'):
            objects, _ = objects_and_commas(body)
            routes = [route for obj in objects if (route := lexical_route(obj)) is not None]
        else:
            continue
        for route in routes:
            records.setdefault('/' + route['path'].lstrip('/'), []).append(route)
    return records
