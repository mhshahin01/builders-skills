import { realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const E = createRequire(import.meta.url)('../src/engine.js');

const STAMP = '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z$';
const DATE = '^\\d{4}-\\d{2}-\\d{2}$';
const ENTRY_KEYS = ['n', 'primary', 'label', 'scope', 'workload', 'value', 'unit', 'window', 'measured_at', 'priority', 'kind', 'verification', 'status', 'na_reason', 'source', 'owner', 'owner_name', 'due', 'evidence', 'confirmed_by', 'confirmed_at', 'proposal', 'factors'];
const OPS = ['set', 'add', 'remove', 'set-factor', 'confirm', 'confirm-group', 'propose', 'accept-proposal', 'na', 'open', 'set-option', 'set-cost', 'set-score', 'set-weights', 'set-horizon', 'check', 'sign', 'add-condition', 'add-exception', 'reopen', 'set-policy', 'add-unknown', 'close-unknown', 'decide', 'set-run', 'set-overlay', 'add-workload', 'rename-workload', 'remove-workload', 'set-brd', 'remove-brd', 'set-version', 'exclude-option', 'include-option', 'set-condition', 'remove-condition', 'revoke-exception', 'remove-option'];
const SHAPE_KEYS = ['hosting', 'topology', 'dr', 'data', 'network'];
const PROGRESS = ['Estimated', 'Confirmed'];
const DECISIONS = ['Approved', 'Approved with conditions', 'Rejected'];
const CLOSING = ['resolution', 'closed_by', 'closed_at'];
const NON_BLANK = { type: 'string', pattern: '\\S' };
const VERSION = { type: 'string', pattern: '^\\d+\\.\\d+$' };
const OVERLAY_SOURCES = ['unknown', 'onprem', 'samecloud', 'othercloud', 'mixed'];

const ref = (name) => ({ $ref: `#/$defs/${name}` });
const closed = (properties, required = Object.keys(properties)) => ({ type: 'object', additionalProperties: false, required, properties });
const nullable = (name) => ({ anyOf: [{ type: 'null' }, ref(name)] });
const partial = (properties) => ({ type: 'object', additionalProperties: false, properties });
const entries = (value) => ({ type: 'array', minItems: 1, items: { $ref: '#/$defs/entry', properties: { value } } });
const entriesFor = (row) => (row.valueType === 'number' ? ref('numberEntries') : row.valueType === 'text' ? ref('textEntries') : entries({ enum: [...row.enumValues, null] }));
const rowsOf = (rows) => closed(Object.fromEntries(rows.map((row) => [row.id, entriesFor(row)])));
const factor = (value) => closed({ value, status: ref('status'), source: ref('source'), confirmed_by: ref('textOrNull'), confirmed_at: ref('stampOrNull') });
const progress = (name, fields) => {
  const own = ref(`${name}Fields`);
  const properties = { ...fields, status: { enum: PROGRESS }, by: ref('textOrNull'), at: ref('stampOrNull') };
  return {
    [`${name}Fields`]: { type: 'object', additionalProperties: false, properties },
    [name]: { ...own, required: Object.keys(properties), if: { ...own, properties: { status: { const: 'Confirmed' } } }, then: { ...own, properties: { by: NON_BLANK, at: ref('stamp') } } },
  };
};
const conditional = (fields, test, then, otherwise) => {
  const own = { ...ref(fields), required: Object.keys(test) };
  return { if: { ...own, properties: test }, then: { ...ref(fields), ...then }, else: { if: own, then: { ...ref(fields), ...otherwise } } };
};

export function projectStateSchema() {
  const scopes = E.ITEMS.find((row) => row.id === 'REL-05').enumValues;
  const signoffFields = { role: { enum: E.SIGNOFF_ROLES.map((role) => role.key) }, applicable: { type: 'boolean' }, na_reason: ref('textOrNull'), name: ref('text'), decision: { enum: [...DECISIONS, null] }, at: ref('stamp'), content_hash: { type: 'string', pattern: '^sha256:[0-9a-f]{64}$' }, stand_in: { type: 'boolean' } };
  const runFields = { mode: { enum: ['full', 'quick'] }, input: { enum: ['web', 'prompt'] }, light: { type: 'boolean' }, stage: { type: 'integer', minimum: 1, maximum: 4 }, group: { enum: [...E.GROUP_ORDER, 'HDR', 'OVL', null] } };
  const overlaySwitch = { applies: { type: 'boolean' }, source: { enum: OVERLAY_SOURCES } };
  const decisionFields = {
    topology_override: { enum: E.OVERRIDE_VALUES.topology },
    dr_overrides: { type: 'object', additionalProperties: false, properties: Object.fromEntries(scopes.map((scope) => [scope, { enum: E.OVERRIDE_VALUES.dr }])) },
    override_reason: { type: 'string' },
    chosen_option: { type: ['string', 'null'], pattern: '^OPT-\\d{2,}$' },
  };
  const unknownFields = { id: { type: 'string', pattern: '^QD-\\d{2,}$' }, entry: nullable('entryId'), question: ref('text'), impact: ref('textOrNull'), owner: ref('textOrNull'), due: ref('dateOrNull'), status: { enum: ['open', 'closed'] }, resolution: ref('textOrNull'), closed_by: ref('textOrNull'), closed_at: ref('stampOrNull') };
  const $defs = {
    text: { type: 'string', minLength: 1 },
    textOrNull: { type: ['string', 'null'], minLength: 1 },
    stamp: { type: 'string', pattern: STAMP },
    stampOrNull: { type: ['string', 'null'], pattern: STAMP },
    date: { type: 'string', pattern: DATE },
    dateOrNull: { type: ['string', 'null'], pattern: DATE },
    entryId: { type: 'string', pattern: '^(HDR|BUS|CAP|REL|DAT|SEC|INT|OPS|ECO|OVL)-\\d{2}\\.[1-9]\\d*$' },
    status: { enum: ['Confirmed', 'Estimated', 'Open', 'N/A'] },
    source: closed({ type: { enum: ['none', 'brd', 'derived', 'answer', 'default', 'policy', 'fixture', 'import'] }, text: { type: 'string' } }),
    proposal: closed({ value: { type: ['number', 'string'], minLength: 1 }, reason: ref('text'), by: ref('text'), at: ref('stamp') }),
    numberFactor: factor({ type: ['number', 'null'] }),
    textFactor: factor({ type: ['string', 'null'], minLength: 1 }),
    factors: { type: 'object', additionalProperties: false, properties: Object.fromEntries(Object.keys(E.FACTORS).map((name) => [name, ref(E.numeric.has(name) ? 'numberFactor' : 'textFactor')])) },
    entryFields: {
      type: 'object',
      additionalProperties: false,
      properties: {
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
        status: ref('status'),
        na_reason: ref('textOrNull'),
        source: ref('source'),
        owner: { type: ['string', 'null'], pattern: '^(B|E|D|Sec|Ops|Fin|Legal)(\\+(B|E|D|Sec|Ops|Fin|Legal))*$' },
        owner_name: ref('textOrNull'),
        due: ref('dateOrNull'),
        evidence: ref('textOrNull'),
        confirmed_by: ref('textOrNull'),
        confirmed_at: ref('stampOrNull'),
        proposal: nullable('proposal'),
        factors: ref('factors'),
      },
    },
    entry: { $ref: '#/$defs/entryFields', required: ENTRY_KEYS, ...conditional('entryFields', { n: { const: 1 } }, { properties: { primary: { const: true } } }, { properties: { primary: { const: false } } }) },
    numberEntries: entries({ type: ['number', 'null'] }),
    textEntries: entries({ type: ['string', 'null'], minLength: 1 }),
    brd: closed({ key: { type: 'string', pattern: '^[A-Z0-9]+(-[A-Z0-9]+)*$' }, path: ref('text'), version: ref('text'), status: ref('textOrNull') }),
    policy: closed({ label: ref('text'), set_by: ref('text'), set_at: ref('stamp'), stand_ins: { type: 'array', uniqueItems: true, items: ref('text') } }),
    workload: closed({ id: { type: 'string', pattern: '^WL-\\d{2,}$' }, name: { type: 'string' } }),
    shape: closed(Object.fromEntries(SHAPE_KEYS.map((key) => [key, ref('textOrNull')]))),
    ...progress('cost', { value: { type: 'number', minimum: 0 } }),
    ...progress('score', { value: { type: 'integer', minimum: 1, maximum: 5 }, reason: ref('text') }),
    scores: { type: 'object', additionalProperties: false, properties: Object.fromEntries(E.CRITERIA.map((criterion) => [criterion, ref('score')])) },
    exclusion: closed({ entry: ref('entryId'), reason: ref('text') }),
    optionFields: { type: 'object', additionalProperties: false, properties: { id: { type: 'string', pattern: '^OPT-\\d{2,}$' }, name: ref('text'), shape: ref('shape'), one_time: nullable('cost'), monthly: nullable('cost'), scores: ref('scores'), excluded: nullable('exclusion') } },
    option: { $ref: '#/$defs/optionFields', required: ['id', 'name', 'shape', 'one_time', 'monthly', 'scores'] },
    weights: closed({ values: { type: 'object', additionalProperties: false, minProperties: 1, properties: Object.fromEntries(E.CRITERIA.map((criterion) => [criterion, { type: 'number', minimum: 0 }])) }, approved_by: ref('text'), approved_at: ref('stamp') }),
    horizon: { type: 'integer', minimum: 1 },
    checkLine: closed({ status: { enum: ['Done', 'N/A'] }, na_reason: ref('textOrNull'), by: ref('text'), at: ref('stamp') }),
    signoffFields: { type: 'object', additionalProperties: false, properties: signoffFields },
    signoff: { ...ref('signoffFields'), required: Object.keys(signoffFields), ...conditional('signoffFields', { applicable: { const: false } }, { properties: { na_reason: NON_BLANK, decision: { type: 'null' } } }, { properties: { decision: { enum: DECISIONS } } }) },
    condition: closed({ id: { type: 'string', pattern: '^COND-\\d{2,}$' }, text: ref('text'), owner: ref('textOrNull'), due: ref('dateOrNull') }),
    exception: closed({ id: { type: 'string', pattern: '^EXC-\\d{2,}$' }, entry: ref('entryId'), reason: ref('text'), granted_by: ref('text'), granted_at: ref('stamp'), expires: ref('date'), review: ref('date') }),
    reopened: closed({ at: ref('stamp'), by: ref('text'), reason: ref('text') }),
    unknownFields: { type: 'object', additionalProperties: false, properties: unknownFields },
    unknown: { ...ref('unknownFields'), required: Object.keys(unknownFields).filter((key) => !CLOSING.includes(key)), ...conditional('unknownFields', { status: { const: 'closed' } }, { required: CLOSING, properties: { resolution: NON_BLANK, closed_by: NON_BLANK, closed_at: ref('stamp') } }, { properties: Object.fromEntries(CLOSING.map((key) => [key, { type: 'null' }])) }) },
    runFields: partial(runFields),
    overlayFields: partial(overlaySwitch),
    decisionFields: partial(decisionFields),
    version: VERSION,
    actor: closed({ type: { enum: ['person', 'policy', 'fixture', 'agent'] }, name: ref('text'), label: ref('text') }),
    noOverride: { anyOf: [{ type: 'string', pattern: '^\\s*$' }, { enum: ['auto', 'undetermined'] }] },
    snapshot: { anyOf: [{ type: 'null' }, ...['entryFields', 'optionFields', 'costFields', 'scoreFields', 'weights', 'horizon', 'checkLine', 'signoff', 'condition', 'exception', 'reopened', 'policy', 'unknown', 'noOverride', 'decisionFields', 'runFields', 'overlayFields', 'workload', 'brd', 'version'].map(ref)] },
    change: closed({ at: ref('stamp'), actor: ref('actor'), op: { enum: [...OPS, 'normalize'] }, target: ref('textOrNull'), from: ref('snapshot'), to: ref('snapshot'), reason: ref('textOrNull') }),
  };
  const properties = {
    kind: { const: 'pre-sdd-project-state' },
    schema_version: { const: E.STATE_SCHEMA_VERSION },
    engine_version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
    project: closed({ name: { type: 'string' }, slug: { type: 'string', pattern: '^[a-z0-9]+(-[a-z0-9]+)*$' }, pre_sdd_version: VERSION, brds: { type: 'array', items: ref('brd') } }),
    run: closed({ ...runFields, policy: nullable('policy') }),
    register: closed({
      header: rowsOf(E.HEADER_FIELDS),
      items: rowsOf(E.ITEMS),
      overlay: closed({ ...overlaySwitch, workloads: { type: 'array', minItems: 1, items: ref('workload') }, rows: rowsOf(E.OVERLAY_FIELDS) }),
    }),
    options: closed({ list: { type: 'array', items: ref('option') }, weights: nullable('weights'), horizon_months: nullable('horizon') }),
    decisions: closed(decisionFields),
    gate: closed({
      checklist: { type: 'object', additionalProperties: false, properties: Object.fromEntries(E.G3_CHECKLIST.map((line) => [line.id, ref('checkLine')])) },
      signoffs: { type: 'array', items: ref('signoff') },
      conditions: { type: 'array', items: ref('condition') },
      exceptions: { type: 'array', items: ref('exception') },
      reopened: nullable('reopened'),
    }),
    unknowns: { type: 'array', items: ref('unknown') },
    history: { type: 'array', items: ref('change') },
    ui: closed({ person: { type: 'string' }, provider: { enum: ['logical', 'aws', 'azure', 'gcp', 'onprem'] }, diagram: { enum: ['infrastructure', 'network', 'dr', 'data', 'security', 'integration', 'deployment'] }, show_optional: { type: 'boolean' } }),
  };
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Pre-SDD project state',
    description: 'The project file of pre-sdd-unifier and the Pre-SDD Architecture Studio 3.0: the register (header rows, the 70 checklist items and the migration overlay rows, each with its entries), the options, decisions, gate, unknowns and history. Schema 3.0.0; every timestamp is UTC.',
    ...closed(properties),
    $defs,
  };
}

export function projectStateSchemaText() {
  return `${JSON.stringify(projectStateSchema(), null, 2)}\n`;
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
  const out = join(studioDir, 'schema', 'project-state.schema.json');
  writeFileSync(out, projectStateSchemaText());
  console.log(`Wrote ${out}`);
}
