import argparse
import json
from pathlib import Path
import sys

try:
    import jsonschema
except ImportError:
    print('Dependency missing: python -m pip install jsonschema', file=sys.stderr)
    raise SystemExit(3)

SCHEMA_PATH = Path(__file__).parent / 'schema' / 'architecture-blueprint.schema.json'
MERMAID_STARTS = ('flowchart', 'graph', 'sequenceDiagram', 'stateDiagram', 'erDiagram', 'classDiagram', 'C4Context', 'C4Container')


def load_schema() -> dict:
    return json.loads(SCHEMA_PATH.read_text(encoding='utf-8'))


def audit(doc: dict, schema: dict, root: Path, require_approved: bool, require_sdd_intake: bool) -> tuple[list[str], list[str]]:
    failures: list[str] = []
    warnings: list[str] = []
    try:
        jsonschema.Draft202012Validator(schema).validate(doc)
    except jsonschema.ValidationError as exc:
        failures.append(f'SCHEMA: {exc.message} at {list(exc.absolute_path)}')
        return failures, warnings

    reqids = [r['id'] for r in doc['requirements']]
    items = {r['item'] for r in doc['requirements']}
    nodeids = [n['id'] for n in doc['architecture']['components']]
    keys = [b['key'] for b in doc['sources']['brds']]
    if len(set(reqids)) != len(reqids): failures.append('Duplicate requirement IDs')
    if len(set(nodeids)) != len(nodeids): failures.append('Duplicate graph node IDs')
    if len(set(keys)) != len(keys): failures.append('Duplicate BRD keys')
    for e in doc['architecture']['connections']:
        for side in ('from', 'to'):
            if e[side] not in nodeids: failures.append(f"Dangling edge {e['id']} endpoint {side}: {e[side]}")

    def check_rows(label: str, ids):
        for i in ids:
            if i not in items: failures.append(f'{label} references missing row {i}')
    for n in doc['architecture']['components']: check_rows(n['id'], n['row_ids'])
    for e in doc['architecture']['connections']: check_rows(e['id'], e['row_ids'])
    for a in doc['architecture']['patterns']: check_rows(a['id'], a['row_ids'])
    for d in doc['decisions']: check_rows(d['id'], d['row_ids'])
    for c in doc['calculations']: check_rows(c['id'], c['row_ids'])
    for o in doc['options']['list']:
        for c in o['calculations']: check_rows(c['id'], c['row_ids'])
    for dr in doc['dr_scenarios']:
        if dr['entry'] not in reqids: failures.append(f"DR scenario {dr['id']} references missing entry {dr['entry']}")
        for node_id in dr['component_ids']:
            if node_id not in nodeids: failures.append(f"DR scenario {dr['id']} references missing node {node_id}")
        if dr['status'] == 'approved' and (dr['rto_seconds'] is None or dr['rpo_seconds'] is None): failures.append(f"Approved DR scenario {dr['id']} lacks required objectives")
    for diagram in doc['diagrams']:
        for node_id in diagram['component_ids']:
            if node_id not in nodeids: failures.append(f"Diagram {diagram['id']} references missing node {node_id}")
        source = root / diagram['mermaid_file']
        if not source.is_file(): warnings.append(f"Mermaid file missing: {diagram['mermaid_file']}")
        else:
            txt = source.read_text(encoding='utf-8')
            if not txt.strip().startswith(MERMAID_STARTS):
                failures.append(f"Unexpected Mermaid diagram start: {diagram['mermaid_file']}")
            for nid in diagram['component_ids']:
                if nid not in txt: warnings.append(f"Mermaid file {diagram['mermaid_file']} does not show canonical node ID {nid}")
    if not doc['sources']['brds']: warnings.append('No BRD references in the handoff: full SDD source intake is not ready; an approved technical handoff may still be valid')
    gate = doc['governance']; val = doc['validation']
    if gate['gate_status'] == 'conditionally_approved':
        for c in gate['conditions']:
            if not c['owner'] or not c['due']: failures.append(f"Condition {c['id']} needs an owner and a due date")
    if val['export_status'] == 'approved_technical_handoff':
        if gate['pre_sdd_gate'] != 'G3' or gate['gate_status'] not in ('approved', 'conditionally_approved'): failures.append('Approved technical handoff requires Pre-SDD G3 Approved or authorized Conditional approval')
        if not gate['authorized_to_start_sdd']: failures.append('Approved technical handoff requires explicit authority to start SDD')
        if gate['gate_status'] == 'conditionally_approved' and not gate['conditions']: failures.append('Conditional G3 approval must document the conditions')
        if not any(s['counted'] for s in gate['signoffs']): failures.append('Approved technical handoff requires at least one counted sign-off')
        if val['blockers']: failures.append('Approved technical handoff cannot contain blocking Pre-SDD findings')
        if any(c['status'] == 'open' for c in doc['conflicts']): failures.append('Approved technical handoff cannot contain unresolved known source conflicts')
    else:
        warnings.append(f"Package status is {val['export_status']}, not an approved Pre-SDD technical handoff")
        if require_approved: failures.append('Called with --require-approved, but the Pre-SDD technical package is provisional or blocked')
    if val['sdd_source_intake'] == 'ready_for_reconciliation' and not doc['sources']['brds']:
        failures.append('SDD source intake cannot be ready for reconciliation without at least one BRD reference')
    if require_sdd_intake and not doc['sources']['brds']:
        failures.append('Called with --require-sdd-intake, but source BRD(s) are missing')
    if require_sdd_intake and val['sdd_source_intake'] != 'ready_for_reconciliation':
        failures.append('Called with --require-sdd-intake, but intake has not reached ready_for_reconciliation')
    if val['blockers']: warnings.append(f"Reported project blockers: {len(val['blockers'])}")
    return failures, warnings


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('json_path', type=Path)
    ap.add_argument('--require-approved', action='store_true')
    ap.add_argument('--require-sdd-intake', action='store_true', help='Require separate BRD source references for SDD intake')
    args = ap.parse_args()
    try:
        doc = json.loads(args.json_path.read_text(encoding='utf-8'))
        schema = load_schema()
    except (OSError, json.JSONDecodeError) as exc:
        print('Cannot read JSON/schema:', exc, file=sys.stderr); return 3
    failures, warnings = audit(doc, schema, args.json_path.parent, args.require_approved, args.require_sdd_intake)
    print('Schema + referential/governance validator:', 'PASS' if not failures else 'FAIL')
    for issue in failures: print('FAIL:', issue)
    for issue in warnings: print('WARN:', issue)
    print('Limitations: semantic DR feasibility, cloud service behavior, Mermaid render parsing, and native skill execution are not verified by this script.')
    return 0 if not failures else 2

if __name__=='__main__':
    raise SystemExit(main())
