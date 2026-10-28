import { realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const E = createRequire(import.meta.url)('../src/engine.js');

const STAMP = '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z$';
const DATE = '^\\d{4}-\\d{2}-\\d{2}$';
const GROUPS = ['HDR', ...Object.keys(E.GROUPS), 'OVL'];
const ROW = `^(${GROUPS.join('|')})-\\d{2}$`;
const ENTRY = `^(${GROUPS.join('|')})-\\d{2}\\.[1-9]\\d*$`;
const LIFECYCLE = ['proposed', 'validated', 'approved', 'blocked'];
const DECISIONS = ['Approved', 'Approved with conditions', 'Rejected'];

const ref = (name) => ({ $ref: `#/$defs/${name}` });
const closed = (properties, required = Object.keys(properties)) => ({ type: 'object', additionalProperties: false, required, properties });
const list = (items) => ({ type: 'array', items });

export function blueprintSchema() {
  const scopes = E.ITEMS.find((row) => row.id === 'REL-05').enumValues;
  const conflictFields = { id: ref('text'), left_source: { type: 'string', pattern: `^REL-05(\\.[1-9]\\d*)?$` }, right_source: { const: 'Target shape' }, description: ref('text'), owner: ref('text'), status: { enum: ['open', 'excepted'] }, resolution: ref('text') };
  const $defs = {
    text: { type: 'string', minLength: 1 },
    textOrNull: { type: ['string', 'null'], minLength: 1 },
    string: { type: 'string' },
    stamp: { type: 'string', pattern: STAMP },
    stampOrNull: { type: ['string', 'null'], pattern: STAMP },
    dateOrNull: { type: ['string', 'null'], pattern: DATE },
    rowIds: { type: 'array', uniqueItems: true, items: { type: 'string', pattern: ROW } },
    entryId: { type: 'string', pattern: ENTRY },
    entryIdOrNull: { type: ['string', 'null'], pattern: ENTRY },
    numberOrNull: { type: ['number', 'null'] },
    lifecycle: { enum: LIFECYCLE },
    source: closed({ type: { enum: ['none', 'brd', 'derived', 'answer', 'default', 'policy', 'fixture', 'import'] }, text: { type: 'string' } }),
    proposal: { anyOf: [{ type: 'null' }, closed({ value: { type: ['number', 'string'], minLength: 1 }, reason: ref('text'), by: ref('text'), at: ref('stamp') })] },
    factor: closed({ value: { type: ['number', 'string', 'null'], minLength: 1 }, status: { enum: ['open', 'estimated', 'confirmed', 'not_applicable'] }, source: ref('source'), confirmed_by: ref('textOrNull'), confirmed_at: ref('stampOrNull') }),
    requirement: closed({
      id: ref('entryId'),
      item: { type: 'string', pattern: ROW },
      group: { enum: GROUPS },
      n: { type: 'integer', minimum: 1 },
      primary: { type: 'boolean' },
      label: ref('textOrNull'),
      scope: { enum: [...scopes, null] },
      workload: { type: ['string', 'null'], pattern: '^WL-\\d{2,}$' },
      value: { type: ['number', 'string', 'null'], minLength: 1 },
      unit: ref('textOrNull'),
      window: ref('textOrNull'),
      measured_at: ref('textOrNull'),
      priority: { enum: ['Must', 'Should', 'Could', null] },
      kind: { enum: ['hard', 'target', 'forecast', 'assumption'] },
      verification: ref('textOrNull'),
      status: { enum: ['open', 'estimated', 'confirmed', 'not_applicable'] },
      na_reason: ref('textOrNull'),
      source: ref('source'),
      owner: { type: ['string', 'null'], pattern: '^(B|E|D|Sec|Ops|Fin|Legal)(\\+(B|E|D|Sec|Ops|Fin|Legal))*$' },
      owner_name: ref('textOrNull'),
      due: ref('dateOrNull'),
      evidence: ref('textOrNull'),
      confirmed_by: ref('textOrNull'),
      confirmed_at: ref('stampOrNull'),
      proposal: ref('proposal'),
      factors: { type: 'object', additionalProperties: false, properties: Object.fromEntries(Object.keys(E.FACTORS).map((name) => [name, ref('factor')])) },
    }),
    calculation: closed({
      id: { type: 'string', pattern: '^CALC-\\d{2}(@OPT-\\d{2,})?$' },
      rule_id: { type: 'string', pattern: '^CALC-\\d{2}$' },
      rule_version: { const: E.ENGINE_VERSION },
      label: ref('text'),
      formula: ref('text'),
      substitution: ref('string'),
      row_ids: ref('rowIds'),
      output: closed({ value: ref('numberOrNull'), unit: ref('string') }),
      status: { enum: ['estimated', 'open'] },
      limitations: ref('string'),
    }),
    pattern: closed({ id: { type: 'string', pattern: '^PAT-(TOPO|DR|DATA)-\\d{3}$' }, name: ref('text'), status: ref('lifecycle'), row_ids: ref('rowIds'), rationale: ref('string') }),
    node: closed({ id: { type: 'string', pattern: '^NODE-[A-Za-z0-9_-]+$' }, name: ref('text'), kind: { enum: ['actor_boundary', 'external_dependency', 'edge', 'load_balancer', 'compute', 'database', 'cache', 'messaging', 'storage', 'network', 'identity', 'security', 'observability', 'site', 'zone', 'other'] }, placement: ref('string'), status: ref('lifecycle'), row_ids: ref('rowIds') }),
    edge: closed({ id: { type: 'string', pattern: '^EDGE-[A-Za-z0-9_-]+$' }, from: { type: 'string', pattern: '^NODE-[A-Za-z0-9_-]+$' }, to: { type: 'string', pattern: '^NODE-[A-Za-z0-9_-]+$' }, relationship: { enum: ['request', 'response', 'event', 'replication', 'network', 'auth', 'failover', 'dependency', 'other'] }, direction: { enum: ['unidirectional', 'bidirectional'] }, notes: ref('string'), status: ref('lifecycle'), row_ids: ref('rowIds') }),
    dr: closed({
      id: { type: 'string', pattern: '^DR-SCOPE-[A-Z]+$' },
      entry: ref('entryId'),
      scope: { enum: [...scopes, 'unknown'] },
      status: ref('lifecycle'),
      rto_seconds: { type: ['number', 'null'], minimum: 0 },
      rpo_seconds: { type: ['number', 'null'], minimum: 0 },
      rto_entry: ref('entryIdOrNull'),
      rpo_entry: ref('entryIdOrNull'),
      strategy: { enum: Object.keys(E.drNames) },
      strategy_candidate: ref('text'),
      replication: { enum: ['synchronous', 'asynchronous', 'TBD'] },
      component_ids: list({ type: 'string', pattern: '^NODE-[A-Za-z0-9_-]+$' }),
      validation_tasks: list(ref('text')),
      notes: ref('text'),
    }),
    failure: closed({ check: { enum: ['hosting', 'network', 'topology-dr', 'excluded'] }, ref: ref('text'), message: ref('text') }),
    option: closed({
      id: { type: 'string', pattern: '^OPT-\\d{2,}$' },
      name: ref('text'),
      hardPass: { type: ['boolean', 'null'] },
      oneTime: { type: ['number', 'null'], minimum: 0 },
      monthly: { type: ['number', 'null'], minimum: 0 },
      tco: { type: ['number', 'null'], minimum: 0 },
      weighted: { type: ['number', 'null'], minimum: 1, maximum: 5 },
      unknowns: list(ref('text')),
      failures: list(ref('failure')),
      calculations: { type: 'array', minItems: 2, maxItems: 2, items: ref('calculation') },
    }),
    decision: closed({
      id: { type: 'string', pattern: '^ADR-(CAND-[A-Za-z0-9_-]+(@[a-z]+)?|[A-Z]+-\\d{3})$' },
      topic: ref('text'),
      candidate: ref('text'),
      status: ref('lifecycle'),
      level: ref('text'),
      rationale: ref('text'),
      rule_ids: list(ref('text')),
      row_ids: ref('rowIds'),
      alternatives: list(closed({ name: ref('text'), tradeoff: ref('text') })),
      owner: ref('text'),
      open_validation: list(ref('text')),
    }),
    diagram: closed({ id: ref('text'), type: { enum: ['infrastructure', 'network', 'dr', 'deployment', 'data_flow', 'context', 'security', 'sequence'] }, status: ref('lifecycle'), component_ids: list({ type: 'string', pattern: '^NODE-[A-Za-z0-9_-]+$' }), summary: ref('text'), mermaid_file: { type: 'string', pattern: '^diagrams/[a-z]+\\.mmd$' }, drawio_file: { const: 'diagrams/architecture.drawio' } }),
    conflictFields: { type: 'object', additionalProperties: false, properties: conflictFields },
    conflict: { $ref: '#/$defs/conflictFields', required: ['id', 'left_source', 'right_source', 'description', 'owner', 'status'], if: { $ref: '#/$defs/conflictFields', properties: { status: { const: 'excepted' } } }, then: { $ref: '#/$defs/conflictFields', required: ['resolution'] }, else: { $ref: '#/$defs/conflictFields', not: { required: ['resolution'] } } },
    finding: closed({ id: ref('text'), message: ref('text'), owner: ref('text'), entry: ref('entryIdOrNull') }),
    signoff: closed({ role: { enum: E.SIGNOFF_ROLES.map((role) => role.key) }, applicable: { type: 'boolean' }, na_reason: ref('textOrNull'), name: ref('textOrNull'), decision: { enum: [...DECISIONS, null] }, at: ref('stampOrNull'), stand_in: { type: 'boolean' }, counted: { type: 'boolean' } }),
    condition: closed({ id: { type: 'string', pattern: '^COND-\\d{2,}$' }, text: ref('text'), owner: ref('textOrNull'), due: ref('dateOrNull') }),
    exception: closed({ id: { type: 'string', pattern: '^EXC-\\d{2,}$' }, entry: ref('entryId'), reason: ref('text'), granted_by: ref('text'), granted_at: ref('stamp'), expires: { type: 'string', pattern: DATE }, review: { type: 'string', pattern: DATE }, valid: { type: 'boolean' } }),
  };
  const properties = {
    schema_version: { const: E.BLUEPRINT_SCHEMA_VERSION },
    project: closed({
      id: { type: 'string', pattern: '^[A-Z0-9]+(-[A-Z0-9]+)*$' },
      name: ref('text'),
      slug: { type: 'string', pattern: '^[a-z0-9]+(-[a-z0-9]+)*$' },
      path_code: { type: 'string', pattern: '^((GF|BF)-(OP|CL)( \\+ (GF|BF)-(OP|CL))?|Unclassified)$' },
      change_type: { enum: ['GF', 'BF', 'mixed', 'undecided'] },
      target_hosting: { enum: ['CL', 'OP', 'hybrid', 'undecided'] },
      source_to_target: ref('text'),
      project_status: { enum: ['Discovery', 'Draft', 'G0', 'G1', 'G2', 'Blocked', 'G3 Approved', 'G3 Approved with conditions'] },
    }),
    sources: closed({
      pre_sdd: closed({ path: { type: 'string', pattern: '^[a-z0-9]+(-[a-z0-9]+)*-pre-sdd-master\\.md$' }, version: { type: 'string', pattern: '^\\d+\\.\\d+$' }, approval_status: { enum: ['draft', 'discovery', 'under_review', 'approved', 'approved_with_conditions', 'blocked'] } }),
      brds: list(closed({ key: { type: 'string', pattern: '^[A-Z0-9]+(-[A-Z0-9]+)*$' }, path: ref('text'), version: ref('text'), status: ref('textOrNull') })),
      engine: closed({ name: { const: 'pre-sdd-engine' }, version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' } }),
      skill: closed({ name: { const: 'pre-sdd-unifier' }, version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' } }),
    }),
    requirements: list(ref('requirement')),
    calculations: { type: 'array', minItems: 20, maxItems: 20, items: { $ref: '#/$defs/calculation', properties: { id: { pattern: '^CALC-\\d{2}$' } } } },
    architecture: closed({ patterns: list(ref('pattern')), components: list(ref('node')), connections: list(ref('edge')) }),
    dr_scenarios: list(ref('dr')),
    options: closed({ horizon_months: { type: ['integer', 'null'], minimum: 1 }, weighted: { type: 'boolean' }, flags: { type: 'array', uniqueItems: true, items: { enum: ['UNWEIGHTED', 'ESTIMATED-SCORES'] } }, chosen_option: { type: ['string', 'null'], pattern: '^OPT-\\d{2,}$' }, list: list(ref('option')) }),
    decisions: list(ref('decision')),
    diagrams: list(ref('diagram')),
    conflicts: list(ref('conflict')),
    governance: closed({
      pre_sdd_gate: { enum: ['G0', 'G1', 'G2', 'G3'] },
      gate_status: { enum: ['draft', 'provisional', 'approved', 'conditionally_approved', 'blocked'] },
      signoffs: list(ref('signoff')),
      conditions: list(ref('condition')),
      exceptions: list(ref('exception')),
      approved_at: ref('stampOrNull'),
      authorized_to_start_sdd: { type: 'boolean' },
    }),
    validation: closed({
      export_status: { enum: ['provisional', 'approved_technical_handoff', 'blocked'] },
      sdd_source_intake: { enum: ['awaiting_brds', 'ready_for_reconciliation', 'blocked'] },
      blockers: list(ref('finding')),
      conflicts: list(ref('finding')),
      advisories: list(ref('finding')),
      checked_at: ref('stamp'),
    }),
  };
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Pre-SDD to SDD handoff blueprint',
    description: 'The handoff model pre-sdd-unifier and the Pre-SDD Architecture Studio 3.0 write for sdd-unifier: the register entries as requirements, the calculations, the proposed shape and diagrams, the options, the decisions, the conflicts, the G3 governance and the validation. Schema 2.0.0; every timestamp is UTC. The BRD owns the product use cases and roles.',
    ...closed(properties),
    $defs,
  };
}

export function blueprintSchemaText() {
  return `${JSON.stringify(blueprintSchema(), null, 2)}\n`;
}

function invokedDirectly() {
  if (!process.argv[1]) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
  } catch {
    return false;
  }
}

if (invokedDirectly()) {
  const out = join(studioDir, 'schema', 'architecture-blueprint.schema.json');
  writeFileSync(out, blueprintSchemaText());
  console.log(`Wrote ${out}`);
}
