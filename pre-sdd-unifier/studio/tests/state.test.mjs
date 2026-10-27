import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, readText } from './helpers.mjs';
import { validateWithSchema } from './pyschema.mjs';

const E = loadEngine();
const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const schemaPath = join(studioDir, 'schema', 'project-state.schema.json');
const NOW = '2026-10-23T11:01:02Z';
const LATER = '2026-10-24T08:30:00Z';
const BRD = { key: 'REFUNDS', path: '../brd-refunds-portal/refunds-portal-brd-master.md', version: '1.5', status: 'Draft' };
const POLICY = { label: 'test-run policy', set_by: 'Mahmoud', set_at: '2026-10-23T09:00:00Z', stand_ins: ['Approver'] };
const POLICY_LABEL = 'Policy: test-run policy (set by Mahmoud, 2026-10-23)';
const STAND_IN = 'Stand-in: Approver (test-run policy, set by Mahmoud, 2026-10-23)';
const FIXTURE_LABEL = 'Fixture: Dana Reyes (test-run policy)';
const LEFT_OPEN = { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23 (left open)' };
const person = { type: 'person', name: 'Mahmoud', label: '' };
const agent = { type: 'agent', name: 'E2E Architect', label: '' };
const policy = { type: 'policy', name: 'test-run policy', label: 'test-run policy' };
const fixture = { type: 'fixture', name: 'Dana Reyes', label: '' };
const fromBrd = (text) => ({ type: 'brd', text });
const appendix = { type: 'default', text: 'Default: policy appendix v1' };
const ENTRY_KEYS = ['n', 'primary', 'label', 'scope', 'workload', 'value', 'unit', 'window', 'measured_at', 'priority', 'kind', 'verification', 'status', 'na_reason', 'source', 'owner', 'owner_name', 'due', 'evidence', 'confirmed_by', 'confirmed_at', 'proposal', 'factors'];
const allRows = [...E.HEADER_FIELDS, ...E.ITEMS, ...E.OVERLAY_FIELDS];
const rowById = (id) => allRows.find((row) => row.id === id);
const APPENDIX_FACTORS = ['utilization', 'networkOverhead', 'indexFactor', 'copies', 'meanLatencyMs', 'callsPerTxn', 'requestFactor'];
const factorEntry = (name) => `${E.FACTORS[name].row}.1`;

const fresh = (extra = {}) => E.newState({ name: 'Refunds platform', slug: 'refunds-platform', brds: [BRD], now: NOW, ...extra });

function withPolicy(standIns = POLICY.stand_ins) {
  return apply(fresh(), [{ op: 'set-policy', policy: { label: POLICY.label, stand_ins: standIns } }], person);
}

function apply(state, ops, actor, now = NOW) {
  const result = E.applyPatch(state, ops, actor, { now });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

function entry(state, id) {
  const { rowId, n } = E.parseEntryId(id);
  return E.rowEntries(state, rowId).find((e) => e.n === n);
}

function rejected(state, op, actor, pattern) {
  const before = JSON.stringify(state);
  const result = E.applyPatch(state, [op], actor, { now: NOW });
  assert.equal(result.errors.length, 1, JSON.stringify(result.errors));
  assert.equal(result.errors[0].index, 0);
  assert.match(result.errors[0].message, pattern);
  assert.deepEqual(result.changes, []);
  assert.equal(JSON.stringify(result.state), before);
  assert.equal(JSON.stringify(state), before);
  return result.errors[0];
}

function checkSchema(t, value) {
  const result = validateWithSchema(schemaPath, value);
  if (result.skipped) {
    t.skip(result.skipped);
    return null;
  }
  return result.errors;
}

function engineOps() {
  const message = E.applyPatch(fresh(), [{ op: 'launch' }], person, { now: NOW }).errors[0].message;
  return /ops are (.+)\.$/.exec(message)[1].split(', ');
}

function everyOpState() {
  let state = withPolicy();
  state.register.overlay.workloads.push({ id: 'WL-02', name: 'Reporting' });
  const steps = [
    [agent, [
      { op: 'set', entry: 'BUS-01.1', value: 'Cut refund handling time to one day', source: fromBrd('BRD: REFUNDS/OBJ-01') },
      { op: 'set', entry: 'CAP-01.1', value: 864000, source: fromBrd('BRD: REFUNDS/NFR-02') },
      { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3, source: appendix },
      { op: 'set-factor', entry: 'DAT-01.1', factor: 'storeKind', value: 'relational', source: fromBrd('BRD: REFUNDS 03') },
      { op: 'set', entry: 'OPS-04.1', value: 'dev, test, stage, prod', kind: 'assumption', reason: 'Project default (decision 11)', source: { type: 'default', text: 'Default: project rule OPS-04' } },
      { op: 'add', row: 'REL-03', label: 'Refund request', scope: 'region' },
      { op: 'add', row: 'OVL-04', workload: 'WL-02' },
      { op: 'propose', entry: 'REL-01.1', value: 99.9, reason: 'The BRD allows 43 minutes of disruption a month' },
      { op: 'set-option', name: 'One region, multi-AZ', shape: { hosting: 'cloud', topology: 'multiAZ', dr: 'warm' } },
      { op: 'set-option', option: 'OPT-01', shape: { data: 'relational, strongly consistent' } },
      { op: 'set-score', option: 'OPT-01', criterion: 'nfr_fit', value: 4, reason: 'Meets p99 at the stated peak' },
      { op: 'reopen', reason: 'Chunk 05 changed after review' },
      { op: 'add-unknown', entry: 'REL-05.1', question: 'Which failure scope does the warm standby cover?', impact: 'DR strategy for the region scope', owner: 'Lead architect', due: '2026-11-01' },
      { op: 'add-unknown', question: 'Who owns the refund ledger?' },
    ]],
    [person, [
      { op: 'add-condition', text: 'Load test before go-live', owner: 'SRE lead', due: '2026-12-01' },
      { op: 'set', entry: 'REL-04.1', value: 60, window: 'per incident', measured_at: 'ledger database', priority: 'Must', verification: 'Restore drill', owner: 'B+D', owner_name: 'Dana', due: '2026-11-15', evidence: 'BIA workshop notes', label: 'Refund ledger' },
      { op: 'set', entry: 'REL-03.2', value: 900 },
      { op: 'confirm', entry: 'CAP-01.1' },
      { op: 'set', entry: 'BUS-07.1', kind: 'target', reason: 'The sponsor treats the prohibition as negotiable' },
      { op: 'accept-proposal', entry: 'REL-01.1' },
      { op: 'na', entry: 'CAP-12.1', reason: 'No AI or media jobs in scope' },
      { op: 'open', entry: 'BUS-01.1' },
      { op: 'add', row: 'CAP-07', label: 'Refund status page' },
      { op: 'remove', entry: 'CAP-07.2' },
      { op: 'set-cost', option: 'OPT-01', cost: 'one_time', value: 100000 },
      { op: 'set-cost', option: 'OPT-01', cost: 'monthly', value: 5000 },
      { op: 'confirm', option: 'OPT-01', cost: 'one_time' },
      { op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' },
      { op: 'set-weights', values: { nfr_fit: 3, reversibility: 2 } },
      { op: 'set-horizon', value: 36 },
      { op: 'check', id: 'G3-09', status: 'N/A', reason: 'Greenfield: no existing estate' },
      { op: 'check', id: 'G3-01', status: 'Done' },
      { op: 'check', id: 'G3-02', status: 'Done' },
      { op: 'check', id: 'G3-02', status: 'Open' },
      { op: 'add-exception', entry: 'DAT-04.1', reason: 'Residency review is booked', expires: '2026-12-31', review: '2026-12-15' },
      { op: 'sign', role: 'business_sponsor', decision: 'Approved with conditions' },
      { op: 'sign', role: 'migration_owner', applicable: false, reason: 'No migration overlay' },
      { op: 'close-unknown', id: 'QD-02', resolution: 'The finance team owns it' },
    ]],
    [policy, [{ op: 'confirm-group', group: 'CAP' }, { op: 'set', entry: 'DAT-05.1', value: 'strong' }, { op: 'confirm', entry: 'DAT-05.1' }, { op: 'sign', role: 'data_owner', decision: 'Approved' }]],
    [fixture, [{ op: 'set', entry: 'DAT-02.1', value: 1.728 }, { op: 'confirm', entry: 'DAT-02.1' }, { op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: '2' }]],
    [agent, [
      { op: 'set-run', stage: 2, group: 'HDR' },
      { op: 'set-overlay', source: 'onprem', cite: { type: 'brd', text: 'BRD: REFUNDS/MIG-01' } },
      { op: 'add-workload', name: 'Archive' },
      { op: 'rename-workload', id: 'WL-03', name: 'Cold archive' },
      { op: 'remove-workload', id: 'WL-03' },
      { op: 'set-version', version: '1.1' },
      { op: 'set-option', name: 'Two regions, warm standby' },
    ]],
    [person, [
      { op: 'decide', topology: 'multiAZ', dr: { region: 'warm' }, reason: 'Owner prefers warm standby' },
      { op: 'decide', option: 'OPT-01' },
      { op: 'set-run', input: 'web' },
      { op: 'set-brd', key: 'PAYOUTS', path: '../brd-payouts/payouts-brd-master.md', version: '1.0' },
      { op: 'remove-brd', key: 'PAYOUTS' },
      { op: 'add-condition', text: 'Pen test before go-live' },
      { op: 'set-condition', id: 'COND-02', owner: 'CISO', due: '2026-12-15' },
      { op: 'remove-condition', id: 'COND-02' },
      { op: 'add-exception', entry: 'BUS-08.1', reason: 'The penalty clause is under review', expires: '2026-12-31', review: '2026-12-15' },
      { op: 'revoke-exception', id: 'EXC-02', reason: 'The penalty clause was dropped' },
      { op: 'exclude-option', option: 'OPT-02', entry: 'DAT-04.1', reason: 'Data leaves the EU' },
      { op: 'include-option', option: 'OPT-02' },
      { op: 'remove-option', option: 'OPT-02' },
    ]],
  ];
  for (const [actor, ops] of steps) state = apply(state, ops, actor);
  Object.assign(entry(state, 'SEC-01.1'), { value: 'PCI DSS', status: 'Confirmed', source: fromBrd('BRD: REFUNDS 02'), confirmed_by: null, confirmed_at: null });
  return E.normalizeState(state, { now: LATER }).state;
}

test('newState_minimal_hasEveryRowOpenWithOnePrimary', () => {
  const state = fresh();
  const { register, ...rest } = state;
  assert.deepEqual(rest, {
    kind: 'pre-sdd-project-state', schema_version: '3.0.0', engine_version: '3.0.0',
    project: { name: 'Refunds platform', slug: 'refunds-platform', pre_sdd_version: '1.0', brds: [BRD] },
    run: { mode: 'full', input: 'prompt', light: false, stage: 1, group: 'BUS', policy: null },
    options: { list: [], weights: null, horizon_months: null },
    decisions: { topology_override: 'auto', dr_overrides: {}, override_reason: '', chosen_option: null },
    gate: { checklist: {}, signoffs: [], conditions: [], exceptions: [], reopened: null },
    unknowns: [], history: [],
    ui: { person: '', provider: 'logical', diagram: 'infrastructure', show_optional: false },
  });
  assert.deepEqual(Object.keys(register), ['header', 'items', 'overlay']);
  assert.equal(Object.keys(register.items).length, 70);
  assert.deepEqual(Object.keys(register.items), E.ITEMS.map((row) => row.id));
  assert.equal(Object.keys(register.header).length, 10);
  assert.deepEqual(Object.keys(register.header), E.HEADER_FIELDS.map((row) => row.id));
  const { rows, ...overlay } = register.overlay;
  assert.deepEqual(overlay, { applies: false, source: 'unknown', workloads: [{ id: 'WL-01', name: '' }] });
  assert.deepEqual(Object.keys(rows), E.OVERLAY_FIELDS.map((row) => row.id));
  for (const row of allRows) {
    const entries = E.rowEntries(state, row.id);
    assert.equal(entries.length, 1, row.id);
    assert.equal(E.primaryEntry(state, row.id), entries[0], row.id);
    assert.deepEqual(Object.keys(entries[0]), ENTRY_KEYS, row.id);
    assert.deepEqual(entries[0], {
      n: 1, primary: true, label: null, scope: null, workload: row.group === 'OVL' ? 'WL-01' : null,
      value: null, unit: row.unit, window: null, measured_at: null, priority: null, kind: row.defaultKind,
      verification: null, status: 'Open', na_reason: null, source: { type: 'none', text: '' },
      owner: ['HDR', 'OVL'].includes(row.group) ? null : row.owners.join('+'),
      owner_name: null, due: null, evidence: null, confirmed_by: null, confirmed_at: null, proposal: null,
      factors: Object.fromEntries(row.factors.map((name) => [name, { value: null, status: 'Open', source: { type: 'none', text: '' }, confirmed_by: null, confirmed_at: null }])),
    }, row.id);
  }
  assert.deepEqual(['BUS-01', 'CAP-02', 'DAT-04', 'SEC-04', 'ECO-01'].map((id) => E.primaryEntry(state, id).owner), ['B', 'B+E', 'D+Legal', 'Sec+D', 'B+Fin']);
  assert.deepEqual(['HDR-01', 'HDR-10', 'OVL-01', 'OVL-12'].map((id) => E.primaryEntry(state, id).owner), [null, null, null, null]);
  assert.deepEqual(Object.keys(E.primaryEntry(state, 'DAT-02').factors), ['storedKB', 'initialGB', 'retentionDays', 'indexFactor', 'copies']);
  assert.deepEqual([E.primaryEntry(state, 'REL-03').unit, E.primaryEntry(state, 'BUS-07').kind, E.primaryEntry(state, 'CAP-01').kind], ['s', 'hard', 'forecast']);
});

test('newState_options_validatedAndSlugDerived', () => {
  const state = E.newState({ name: 'Reseller Portal 2', brds: [{ key: 'RESELLER-PORTAL', path: 'brd/master.md', version: 2 }], mode: 'quick', input: 'web', light: true, now: NOW });
  assert.deepEqual(state.project, { name: 'Reseller Portal 2', slug: 'reseller-portal-2', pre_sdd_version: '1.0', brds: [{ key: 'RESELLER-PORTAL', path: 'brd/master.md', version: '2', status: null }] });
  assert.deepEqual([state.run.mode, state.run.input, state.run.light], ['quick', 'web', true]);
  assert.throws(() => E.newState({ name: 'X', brds: [{ key: 'refunds', path: 'a.md', version: '1.0' }], now: NOW }), /key/);
  assert.throws(() => E.newState({ name: 'X', brds: [BRD, BRD], now: NOW }), /once/);
  assert.throws(() => E.newState({ name: 'X', slug: 'Refunds_Platform', now: NOW }), /slug/);
  assert.throws(() => E.newState({ name: '', now: NOW }), /slug/);
  assert.throws(() => E.newState({ name: 'X', mode: 'fast', now: NOW }), /mode/);
  assert.throws(() => E.newState({ name: 'X', input: 'email', now: NOW }), /input/);
});

test('entryIds_formatAndParse_roundTrip', () => {
  assert.equal(E.entryId('REL-03', 2), 'REL-03.2');
  assert.deepEqual(E.parseEntryId('REL-03.2'), { rowId: 'REL-03', n: 2 });
  for (const row of allRows) assert.deepEqual(E.parseEntryId(E.entryId(row.id, 7)), { rowId: row.id, n: 7 }, row.id);
  for (const bad of ['REL-03', 'REL-03.0', 'REL-03.02', 'XYZ-01.1', 'REL-99.1', 'rel-03.1', 'REL-03.1.utilization', ' REL-03.1', 3, null]) assert.equal(E.parseEntryId(bad), null, String(bad));
  const state = fresh();
  assert.deepEqual(E.rowEntries(state, 'XYZ-01'), []);
  assert.equal(E.primaryEntry(state, 'XYZ-01'), null);
  assert.equal(E.primaryEntry(state, 'OVL-04').workload, 'WL-01');
  assert.equal(E.primaryEntry(state, 'HDR-07'), state.register.header['HDR-07'][0]);
});

test('applyPatch_setBlankNumber_keepsNullAndOpen', () => {
  const set60 = apply(fresh(), [{ op: 'set', entry: 'REL-04.1', value: 60 }], person);
  assert.deepEqual([entry(set60, 'REL-04.1').value, entry(set60, 'REL-04.1').status], [60, 'Estimated']);
  for (const blank of ['', '   ', null]) {
    const result = E.applyPatch(set60, [{ op: 'set', entry: 'REL-04.1', value: blank }], person, { now: NOW });
    assert.deepEqual(result.errors, []);
    const after = entry(result.state, 'REL-04.1');
    assert.equal(after.value, null, JSON.stringify(blank));
    assert.notEqual(after.value, 0);
    assert.equal(after.status, 'Open');
    assert.deepEqual(after.source, LEFT_OPEN);
    assert.deepEqual(result.changes.map((c) => [c.target, c.from, c.to]), [['REL-04.1',
      { value: 60, status: 'Estimated', source: { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' } },
      { value: null, status: 'Open', source: LEFT_OPEN }]]);
  }
  const factor = apply(fresh(), [{ op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3 }], person);
  const cleared = apply(factor, [{ op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: '' }], person);
  assert.deepEqual(entry(cleared, 'CAP-02.1').factors.callsPerTxn, { value: null, status: 'Open', source: LEFT_OPEN, confirmed_by: null, confirmed_at: null });
});

test('applyPatch_blankByActor_leftOpenOnlyForPersonAndFixture', () => {
  const base = apply(withPolicy(), [
    { op: 'set', entry: 'REL-04.1', value: 60, source: fromBrd('BRD: REFUNDS/NFR-07') },
    { op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value: 20, source: fromBrd('BRD: REFUNDS 08') },
  ], agent);
  const none = { type: 'none', text: '' };
  for (const [actor, source] of [[person, LEFT_OPEN], [fixture, { type: 'answer', text: FIXTURE_LABEL }], [agent, none], [policy, none]]) {
    const cleared = apply(base, [{ op: 'set', entry: 'REL-04.1', value: '' }, { op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value: '' }], actor);
    const [row, held] = [entry(cleared, 'REL-04.1'), entry(cleared, 'INT-08.1').factors.cidrPrefix];
    assert.deepEqual([row.value, row.status, row.source, held.value, held.status, held.source], [null, 'Open', source, null, 'Open', source], actor.type);
  }
  const leftOpen = apply(base, [{ op: 'set', entry: 'REL-04.1', value: '' }], person);
  rejected(leftOpen, { op: 'set', entry: 'REL-04.1', value: 3600, source: fromBrd('BRD: REFUNDS/NFR-07') }, agent, /REL-04\.1 is protected/);
  rejected(leftOpen, { op: 'set', entry: 'REL-04.1', value: 3600 }, policy, /REL-04\.1 is protected/);
  assert.equal(entry(apply(leftOpen, [{ op: 'set', entry: 'REL-04.1', value: 3600 }], person), 'REL-04.1').value, 3600);
  assert.deepEqual(entry(apply(leftOpen, [{ op: 'open', entry: 'REL-04.1' }], person), 'REL-04.1').source, none);
});

test('applyPatch_setZeroRpo_keepsZero', () => {
  for (const zero of [0, '0', ' 0 ']) {
    const after = entry(apply(fresh(), [{ op: 'set', entry: 'REL-04.1', value: zero }], person), 'REL-04.1');
    assert.equal(after.value, 0, JSON.stringify(zero));
    assert.equal(after.status, 'Estimated');
    assert.deepEqual(after.source, { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' });
  }
});

test('applyPatch_failedOp_rejectsWholeBatch', () => {
  const state = fresh();
  const before = JSON.stringify(state);
  const ops = [
    { op: 'set', entry: 'REL-03.1', value: 600 },
    { op: 'set', entry: 'REL-05.1', value: 'zone', label: 'Zone loss' },
    { op: 'set', entry: 'REL-04.1', value: 60 },
    { op: 'launch' },
    { op: 'set', entry: 'REL-04.1', value: 30, status: 'Confirmed' },
    { op: 'set', entry: 'REL-04.9', value: 30 },
    { op: 'set', entry: 'CAP-07.1', value: 'fast' },
  ];
  const result = E.applyPatch(state, ops, person, { now: NOW });
  assert.equal(JSON.stringify(state), before);
  assert.equal(JSON.stringify(result.state), before);
  assert.deepEqual(result.changes, []);
  assert.deepEqual(result.errors.map((e) => [e.index, e.op, e.target]), [[1, 'set', 'REL-05.1'], [3, 'launch', null], [4, 'set', 'REL-04.1'], [5, 'set', 'REL-04.9'], [6, 'set', 'CAP-07.1']]);
  const [scope, unknown, status, missing, text] = result.errors.map((e) => e.message);
  assert.match(scope, /REL-05 takes one of host, az, site, region, provider, cyber/);
  assert.match(unknown, /Unknown op "launch"/);
  assert.match(status, /set does not take status/);
  assert.match(missing, /REL-04 has no entry 9/);
  assert.match(text, /CAP-07 takes a number in ms/);
  const clean = E.applyPatch(state, [ops[0], ops[2]], person, { now: NOW });
  assert.deepEqual([clean.errors, clean.changes.map((c) => c.target)], [[], ['REL-03.1', 'REL-04.1']]);
  assert.deepEqual(clean.state.history, clean.changes);
});

test('applyPatch_batchWithError_atomic', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'REL-04.1', value: 3600, source: fromBrd('BRD: REFUNDS/NFR-07') }], agent);
  const result = E.applyPatch(state, [{ op: 'set', entry: 'REL-04.1', value: 'sixty' }, { op: 'confirm', entry: 'REL-04.1' }], person, { now: LATER });
  assert.deepEqual(result.errors.map((e) => [e.index, e.op, e.target]), [[0, 'set', 'REL-04.1']]);
  assert.match(result.errors[0].message, /REL-04 takes a number in s/);
  assert.deepEqual(result.changes, []);
  assert.deepEqual(result.state, state);
  const after = entry(result.state, 'REL-04.1');
  assert.deepEqual([after.value, after.status, after.confirmed_by, after.source], [3600, 'Estimated', null, fromBrd('BRD: REFUNDS/NFR-07')]);
});

test('applyPatch_numberInputs_plainDecimalOnly', () => {
  const blank = apply(apply(fresh(), [{ op: 'set', entry: 'REL-04.1', value: 60 }], person), [{ op: 'set', entry: 'REL-04.1', value: '' }], person);
  assert.deepEqual([entry(blank, 'REL-04.1').value, entry(blank, 'REL-04.1').status], [null, 'Open']);
  for (const [raw, want] of [['1e3', 1000], [' -2.5 ', -2.5], ['+.5', 0.5], ['5.', 5], ['0', 0]]) assert.equal(entry(apply(fresh(), [{ op: 'set', entry: 'REL-04.1', value: raw }], person), 'REL-04.1').value, want, raw);
  for (const raw of ['0x3C', '1_000', 'Infinity', '1e999', '60s', '6 0', '0b11']) rejected(fresh(), { op: 'set', entry: 'REL-04.1', value: raw }, person, /REL-04 takes a number in s/);
  rejected(fresh(), { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: '0x3C' }, person, /callsPerTxn on CAP-02 takes a number/);
  const option = apply(fresh(), [{ op: 'set-option', name: 'One region, multi-AZ' }], agent);
  rejected(option, { op: 'set-cost', option: 'OPT-01', cost: 'monthly', value: '0x3C' }, person, /A cost is a number of currency units/);
  rejected(option, { op: 'set-score', option: 'OPT-01', criterion: 'nfr_fit', value: '0x3', reason: 'Fits' }, agent, /whole number from 1 to 5/);
  for (const weight of ['', '   ', null]) rejected(option, { op: 'set-weights', values: { nfr_fit: 3, reversibility: weight } }, person, /weight of reversibility is blank/);
  for (const weight of ['0x3C', 'high', true]) rejected(option, { op: 'set-weights', values: { nfr_fit: weight } }, person, /weight of nfr_fit is a number, 0 or more/);
});

test('timeInputs_withoutOffset_rejected', () => {
  const ops = [{ op: 'set', entry: 'REL-04.1', value: 60 }];
  for (const now of ['2026-10-23T11:01:02', '2026-10-23', 'Oct 23 2026 11:01:02', '2026-02-30T11:01:02Z', '2026-10-23T24:00:00Z', '2026-10-23T11:01:02+0200', 1761217262000, undefined]) {
    assert.throws(() => E.applyPatch(fresh(), ops, person, { now }), /a Date, or an ISO 8601 timestamp with Z or an offset/, String(now));
    assert.throws(() => E.normalizeState(fresh(), { now }), /with Z or an offset/, String(now));
    assert.throws(() => E.saveFileName('refunds-platform', now), /with Z or an offset/, String(now));
    assert.throws(() => E.newState({ name: 'Refunds platform', now }), /with Z or an offset/, String(now));
  }
});

test('timeInputs_offsetOrDate_giveUtc', () => {
  const ops = [{ op: 'set', entry: 'REL-04.1', value: 60 }];
  const offset = E.applyPatch(fresh(), ops, person, { now: '2026-10-23T11:01:02+02:00' });
  assert.deepEqual([offset.changes[0].at, entry(offset.state, 'REL-04.1').source.text], ['2026-10-23T09:01:02Z', 'Answer: Mahmoud, 2026-10-23']);
  assert.equal(E.saveFileName('refunds-platform', '2026-10-23T11:01:02+02:00'), 'pre-sdd-refunds-platform-state-20261023T090102Z.json');
  const east = E.applyPatch(fresh(), ops, person, { now: '2026-10-24T01:30:00+05:30' });
  assert.deepEqual([east.changes[0].at, entry(east.state, 'REL-04.1').source.text], ['2026-10-23T20:00:00Z', 'Answer: Mahmoud, 2026-10-23']);
  assert.equal(E.applyPatch(fresh(), ops, person, { now: new Date('2026-10-23T11:01:02.250Z') }).changes[0].at, '2026-10-23T11:01:02.250Z');
  assert.equal(E.applyPatch(fresh(), ops, person, { now: new Date(NOW) }).changes[0].at, NOW);
  assert.equal(E.newState({ name: 'Refunds platform', now: new Date(NOW) }).project.slug, 'refunds-platform');
});

test('applyPatch_personRelabelsConfirmed_becomesEstimated', () => {
  const dana = { type: 'person', name: 'Dana', label: '' };
  const state = apply(fresh(), [
    { op: 'add', row: 'REL-03', label: 'Refund request', scope: 'az' },
    { op: 'set', entry: 'REL-03.2', value: 900 },
    { op: 'confirm', entry: 'REL-03.2' },
  ], person);
  const result = E.applyPatch(state, [{ op: 'set', entry: 'REL-03.2', label: 'Status page' }], dana, { now: LATER });
  assert.deepEqual(result.errors, []);
  const after = entry(result.state, 'REL-03.2');
  assert.deepEqual([after.label, after.value, after.status, after.confirmed_by, after.confirmed_at, after.source], ['Status page', 900, 'Estimated', null, null, { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' }]);
  assert.deepEqual([result.changes[0].from, result.changes[0].to], [
    { label: 'Refund request', status: 'Confirmed', confirmed_by: 'Mahmoud', confirmed_at: NOW },
    { label: 'Status page', status: 'Estimated', confirmed_by: null, confirmed_at: null },
  ]);
  for (const change of [{ scope: 'region' }, { window: 'per year' }, { measured_at: 'client' }, { priority: 'Could' }, { verification: 'Restore drill' }, { evidence: 'BIA notes' }, { kind: 'hard', reason: 'Contract term' }]) {
    const changed = entry(apply(state, [{ op: 'set', entry: 'REL-03.2', ...change }], person), 'REL-03.2');
    assert.deepEqual([changed.status, changed.confirmed_by, changed.confirmed_at], ['Estimated', null, null], JSON.stringify(change));
  }
  const open = apply(fresh(), [{ op: 'set', entry: 'REL-01.1', label: 'Checkout', window: 'monthly' }], person);
  assert.deepEqual([entry(open, 'REL-01.1').status, entry(open, 'REL-01.1').label], ['Open', 'Checkout']);
  const na = apply(apply(fresh(), [{ op: 'na', entry: 'ECO-05.1', reason: 'No footprint goal applies' }], person), [{ op: 'set', entry: 'ECO-05.1', evidence: 'Sponsor email' }], person);
  assert.deepEqual([entry(na, 'ECO-05.1').status, entry(na, 'ECO-05.1').evidence], ['N/A', 'Sponsor email']);
});

test('applyPatch_assignmentChange_keepsConfirmed', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'REL-01.1', value: 99.9 }, { op: 'confirm', entry: 'REL-01.1' }], person);
  rejected(state, { op: 'set', entry: 'REL-01.1', owner: 'B+Ops', owner_name: 'Dana', due: '2026-12-01' }, agent, /^The owner name and due date of REL-01\.1 are a person's assignment in stage 2; an agent never writes them/);
  for (const actor of [person, fixture]) {
    const result = E.applyPatch(state, [{ op: 'set', entry: 'REL-01.1', owner: 'B+Ops', owner_name: 'Dana', due: '2026-12-01' }], actor, { now: LATER });
    assert.deepEqual(result.errors, [], actor.type);
    const after = entry(result.state, 'REL-01.1');
    assert.deepEqual([after.owner, after.owner_name, after.due, after.status, after.confirmed_by, after.confirmed_at], ['B+Ops', 'Dana', '2026-12-01', 'Confirmed', 'Mahmoud', NOW], actor.type);
  }
});

test('applyPatch_agentReshapesOption_costsAndScoresEstimated', () => {
  let state = apply(fresh(), [
    { op: 'set-option', name: 'One region, multi-AZ', shape: { hosting: 'cloud', topology: 'multiAZ', dr: 'backup' } },
    { op: 'set-score', option: 'OPT-01', criterion: 'one_time_cost', value: 4, reason: 'Cheap: backup DR only' },
    { op: 'set-score', option: 'OPT-01', criterion: 'reversibility', value: 3, reason: 'Managed database' },
  ], agent);
  state = apply(state, [
    { op: 'set-cost', option: 'OPT-01', cost: 'one_time', value: 100000 },
    { op: 'set-cost', option: 'OPT-01', cost: 'monthly', value: 5000 },
    { op: 'confirm', option: 'OPT-01', cost: 'one_time' },
    { op: 'confirm', option: 'OPT-01', criterion: 'one_time_cost' },
  ], person);
  const [before] = state.options.list;
  const result = E.applyPatch(state, [{ op: 'set-option', option: 'OPT-01', name: 'Two regions, active-active', shape: { topology: 'active', dr: 'active' } }], agent, { now: LATER });
  assert.deepEqual(result.errors, []);
  const [option] = result.state.options.list;
  assert.deepEqual(option.one_time, { value: 100000, status: 'Estimated', by: null, at: null });
  assert.deepEqual(option.scores.one_time_cost, { value: 4, reason: 'Cheap: backup DR only', status: 'Estimated', by: null, at: null });
  assert.deepEqual([option.monthly, option.scores.reversibility], [before.monthly, before.scores.reversibility]);
  assert.deepEqual(Object.keys(result.changes[0].to).sort(), ['name', 'one_time', 'scores', 'shape']);
  const unchanged = E.applyPatch(state, [{ op: 'set-option', option: 'OPT-01', name: 'One region, multi-AZ' }], agent, { now: LATER });
  assert.deepEqual([unchanged.errors, unchanged.changes], [[], []]);
  const byPerson = apply(state, [{ op: 'set-option', option: 'OPT-01', shape: { network: 'private' } }], person);
  assert.deepEqual([byPerson.options.list[0].one_time.status, byPerson.options.list[0].scores.one_time_cost.status], ['Estimated', 'Estimated']);
  const again = apply(result.state, [{ op: 'confirm', option: 'OPT-01', cost: 'one_time' }], person, LATER);
  assert.deepEqual(again.options.list[0].one_time, { value: 100000, status: 'Confirmed', by: 'Mahmoud', at: LATER });
});

test('applyPatch_renameOption_costsAndScoresEstimated', () => {
  let state = apply(fresh(), [
    { op: 'set-option', name: 'One region, multi-AZ', shape: { hosting: 'cloud', topology: 'multiAZ' } },
    { op: 'set-score', option: 'OPT-01', criterion: 'nfr_fit', value: 4, reason: 'Meets p99 at the stated peak' },
  ], agent);
  state = apply(state, [
    { op: 'set-cost', option: 'OPT-01', cost: 'monthly', value: 5000 },
    { op: 'confirm', option: 'OPT-01', cost: 'monthly' },
    { op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' },
  ], person);
  const [before] = state.options.list;
  const result = E.applyPatch(state, [{ op: 'set-option', option: 'OPT-01', name: 'One region, multi-AZ, private link' }], agent, { now: LATER });
  assert.deepEqual(result.errors, []);
  const [option] = result.state.options.list;
  assert.deepEqual([option.name, option.shape], ['One region, multi-AZ, private link', before.shape]);
  assert.deepEqual(option.monthly, { value: 5000, status: 'Estimated', by: null, at: null });
  assert.deepEqual(option.scores.nfr_fit, { value: 4, reason: 'Meets p99 at the stated peak', status: 'Estimated', by: null, at: null });
  assert.deepEqual(Object.keys(result.changes[0].to).sort(), ['monthly', 'name', 'scores']);
});

test('applyPatch_agentEditsConfirmedEntry_rejected', () => {
  const state = apply(fresh(), [
    { op: 'add', row: 'REL-03', label: 'Refund request', scope: 'az' },
    { op: 'set', entry: 'REL-03.2', value: 900 },
    { op: 'confirm', entry: 'REL-03.2' },
  ], person);
  const guard = /^REL-03\.2 is protected \(Confirmed, or answered by a person\), so only a person may change it; ask the owner, or record the question as an unknown\.$/;
  assert.doesNotMatch(rejected(state, { op: 'set', entry: 'REL-03.2', scope: 'region', label: 'Status page' }, agent, guard).message, /propose/);
  rejected(state, { op: 'set', entry: 'REL-03.2', kind: 'hard', reason: 'The agent says so' }, agent, guard);
  rejected(state, { op: 'set', entry: 'REL-03.2', value: 600, source: fromBrd('BRD: REFUNDS/NFR-06') }, agent, guard);
  rejected(state, { op: 'set', entry: 'REL-03.2', value: 900 }, agent, guard);
  rejected(state, { op: 'open', entry: 'REL-03.2' }, agent, guard);
  rejected(state, { op: 'remove', entry: 'REL-03.2' }, agent, guard);
  const sameLabel = E.applyPatch(state, [{ op: 'set', entry: 'REL-03.2', label: 'Refund request' }], agent, { now: LATER });
  assert.deepEqual([sameLabel.errors, sameLabel.changes], [[], []]);
});

test('applyPatch_agentOverwritesPersonAnswer_rejected', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 4 }], person);
  assert.deepEqual([entry(state, 'CAP-01.1').status, entry(state, 'CAP-01.1').source.type], ['Estimated', 'answer']);
  rejected(state, { op: 'set', entry: 'CAP-01.1', value: 900000, source: fromBrd('BRD: REFUNDS/NFR-02') }, agent, /CAP-01\.1 is protected/);
  rejected(state, { op: 'set', entry: 'CAP-01.1', value: 864000, source: fromBrd('BRD: REFUNDS/NFR-02') }, agent, /CAP-01\.1 is protected/);
  rejected(state, { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3, source: appendix }, agent, /CAP-02\.1\.callsPerTxn is protected/);
  const dana = apply(state, [{ op: 'set', entry: 'CAP-01.1', value: 900000 }], { type: 'person', name: 'Dana', label: '' });
  assert.deepEqual([entry(dana, 'CAP-01.1').value, entry(dana, 'CAP-01.1').source.text], [900000, 'Answer: Dana, 2026-10-23']);
});

test('applyPatch_policyOpensConfirmedEntry_rejected', () => {
  const state = apply(withPolicy(), [
    { op: 'set', entry: 'REL-01.1', value: 99.9 },
    { op: 'confirm', entry: 'REL-01.1' },
    { op: 'set', entry: 'ECO-05.1', value: 'No footprint target yet' },
  ], person);
  rejected(state, { op: 'open', entry: 'REL-01.1' }, policy, /REL-01\.1 is protected/);
  rejected(state, { op: 'set', entry: 'REL-01.1', label: 'Checkout' }, policy, /REL-01\.1 is protected/);
  rejected(state, { op: 'set', entry: 'REL-01.1', value: 99.95 }, policy, /REL-01\.1 is protected/);
  rejected(state, { op: 'na', entry: 'ECO-05.1', reason: 'No goal applies' }, policy, /^An answer policy never marks an item N\/A; ask the person who owns ECO-05\.1/);
  const second = apply(state, [{ op: 'open', entry: 'REL-01.1' }], { type: 'person', name: 'Dana', label: '' });
  assert.deepEqual([entry(second, 'REL-01.1').status, entry(second, 'REL-01.1').value], ['Open', null]);
});

test('applyPatch_acceptProposalOnConfirmed_rejected', () => {
  const state = apply(withPolicy(), [{ op: 'propose', entry: 'REL-01.1', value: 99.9, reason: 'Forty-three minutes a month' }], agent);
  const confirmed = JSON.parse(JSON.stringify(state));
  Object.assign(entry(confirmed, 'REL-01.1'), { value: 99.95, status: 'Confirmed', source: { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' }, confirmed_by: 'Mahmoud', confirmed_at: NOW });
  for (const actor of [policy, person]) rejected(confirmed, { op: 'accept-proposal', entry: 'REL-01.1' }, actor, /REL-01\.1 is Confirmed; a proposal is accepted only while the entry is Open/);
  const closed = apply(state, [{ op: 'na', entry: 'REL-01.1', reason: 'Internal tool' }], person);
  rejected(closed, { op: 'accept-proposal', entry: 'REL-01.1' }, person, /REL-01\.1 is N\/A; a proposal is accepted only while the entry is Open/);
});

test('applyPatch_valueSet_clearsProposal', () => {
  const state = apply(fresh(), [{ op: 'propose', entry: 'REL-01.1', value: 99.9, reason: 'Forty-three minutes a month' }], agent);
  const result = E.applyPatch(state, [{ op: 'set', entry: 'REL-01.1', value: 99.95 }], person, { now: LATER });
  assert.deepEqual(result.errors, []);
  assert.equal(entry(result.state, 'REL-01.1').proposal, null);
  assert.deepEqual(result.changes[0].from.proposal, { value: 99.9, reason: 'Forty-three minutes a month', by: 'E2E Architect', at: NOW });
  const byAgent = apply(state, [{ op: 'set', entry: 'REL-01.1', value: 99.5, source: fromBrd('BRD: REFUNDS/NFR-01') }], agent);
  assert.equal(entry(byAgent, 'REL-01.1').proposal, null);
  rejected(result.state, { op: 'accept-proposal', entry: 'REL-01.1' }, person, /REL-01\.1 has no proposal/);
  const blanked = apply(state, [{ op: 'set', entry: 'REL-01.1', value: '' }], person);
  assert.deepEqual(entry(blanked, 'REL-01.1').proposal, entry(state, 'REL-01.1').proposal);
});

test('applyPatch_kindReasonAfterDefaultRevert_bothDirections', () => {
  const defaulted = apply(fresh(), [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, stage, prod', kind: 'assumption', reason: 'Project default (decision 11)', source: { type: 'default', text: 'Default: project rule OPS-04' } }], agent);
  const named = E.applyPatch(defaulted, [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, prod', kind: 'target' }], person, { now: NOW });
  assert.deepEqual(named.errors, []);
  assert.equal(entry(named.state, 'OPS-04.1').kind, 'target');
  rejected(defaulted, { op: 'set', entry: 'OPS-04.1', value: 'dev, test, prod', kind: 'assumption' }, person, /Replacing the default value of OPS-04\.1 returns its kind to target; kind assumption needs a reason/);
  assert.equal(entry(apply(defaulted, [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, prod', kind: 'assumption', reason: 'Still a working assumption' }], person), 'OPS-04.1').kind, 'assumption');
  assert.equal(entry(apply(defaulted, [{ op: 'set', entry: 'OPS-04.1', kind: 'assumption', evidence: 'Platform guide' }], person), 'OPS-04.1').kind, 'assumption');
  rejected(defaulted, { op: 'set', entry: 'OPS-04.1', kind: 'target' }, person, /Changing the kind of OPS-04\.1 from assumption to target needs a reason/);
});

test('applyPatch_agentWrites_estimatedWithSourceOnly', () => {
  for (const type of ['brd', 'derived', 'default', 'import']) {
    const after = entry(apply(fresh(), [{ op: 'set', entry: 'CAP-01.1', value: 864000, source: { type, text: `${type} text` } }], agent), 'CAP-01.1');
    assert.deepEqual([after.value, after.status, after.source, after.confirmed_by], [864000, 'Estimated', { type, text: `${type} text` }, null], type);
  }
  rejected(fresh(), { op: 'set', entry: 'CAP-01.1', value: 864000 }, agent, /agent cites its source/);
  rejected(fresh(), { op: 'set', entry: 'CAP-01.1', value: 864000, source: { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' } }, agent, /agent cites its source/);
  rejected(fresh(), { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3 }, agent, /agent cites its source/);
  rejected(fresh(), { op: 'set', entry: 'CAP-01.1', value: 864000, source: fromBrd('BRD: REFUNDS/NFR-02') }, person, /Only an agent cites a source/);
  rejected(fresh(), { op: 'check', id: 'G3-01', status: 'Done' }, agent, /agent never ticks the G3 checklist/);
});

test('applyPatch_agentConfirm_rejected', () => {
  const state = apply(fresh(), [
    { op: 'set', entry: 'REL-01.1', value: 99.9, source: fromBrd('BRD: REFUNDS/NFR-01') },
    { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3, source: appendix },
  ], agent);
  assert.equal(entry(state, 'REL-01.1').status, 'Estimated');
  rejected(state, { op: 'confirm', entry: 'REL-01.1' }, agent, /agent never confirms/);
  rejected(state, { op: 'confirm', entry: 'CAP-02.1', factor: 'callsPerTxn' }, agent, /agent never confirms/);
  rejected(state, { op: 'confirm-group', group: 'REL' }, agent, /agent never confirms/);
  rejected(state, { op: 'set', entry: 'REL-01.1', value: 99.9, status: 'Confirmed', source: fromBrd('BRD: REFUNDS/NFR-01') }, agent, /set does not take status/);
});

test('applyPatch_personConfirm_setsWhoAndWhen', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'REL-01.1', value: 99.9, source: fromBrd('BRD: REFUNDS/NFR-01') }], agent);
  const result = E.applyPatch(state, [{ op: 'confirm', entry: 'REL-01.1' }], person, { now: LATER });
  assert.deepEqual(result.errors, []);
  const after = entry(result.state, 'REL-01.1');
  assert.deepEqual([after.status, after.confirmed_by, after.confirmed_at, after.value, after.source], ['Confirmed', 'Mahmoud', LATER, 99.9, fromBrd('BRD: REFUNDS/NFR-01')]);
  assert.deepEqual(result.changes, [{
    at: LATER, actor: { type: 'person', name: 'Mahmoud', label: 'Mahmoud' }, op: 'confirm', target: 'REL-01.1',
    from: { status: 'Estimated', confirmed_by: null, confirmed_at: null }, to: { status: 'Confirmed', confirmed_by: 'Mahmoud', confirmed_at: LATER }, reason: null,
  }]);
  assert.deepEqual(result.state.history.at(-1), result.changes[0]);
  assert.equal(entry(state, 'REL-01.1').status, 'Estimated');
  rejected(fresh(), { op: 'confirm', entry: 'REL-01.1' }, person, /Only an Estimated value can be confirmed/);
});

test('applyPatch_policyActor_needsRunPolicy', () => {
  const result = E.applyPatch(fresh(), [{ op: 'set', entry: 'REL-01.1', value: 99.9 }], policy, { now: NOW });
  assert.deepEqual(result.errors.map((e) => e.index), [null]);
  assert.match(result.errors[0].message, /run\.policy/);
  assert.deepEqual(result.changes, []);
  for (const bad of [null, { type: 'robot', name: 'R2' }, { type: 'person', name: '  ' }, { type: 'person', name: 'Policy: house rules' }]) {
    const refused = E.applyPatch(fresh(), [{ op: 'set', entry: 'REL-01.1', value: 99.9 }], bad, { now: NOW });
    assert.deepEqual(refused.errors.map((e) => e.index), [null], JSON.stringify(bad));
    assert.equal(entry(refused.state, 'REL-01.1').value, null);
  }
});

test('applyPatch_setPolicyByPerson_stored', () => {
  const result = E.applyPatch(fresh(), [{ op: 'set-policy', policy: { label: ' test-run policy ', stand_ins: ['Approver'] } }], person, { now: LATER });
  assert.deepEqual(result.errors, []);
  const stored = { label: 'test-run policy', set_by: 'Mahmoud', set_at: LATER, stand_ins: ['Approver'] };
  assert.deepEqual(result.state.run.policy, stored);
  assert.deepEqual(result.changes, [{ at: LATER, actor: { type: 'person', name: 'Mahmoud', label: 'Mahmoud' }, op: 'set-policy', target: 'run.policy', from: null, to: stored, reason: null }]);
  assert.deepEqual(result.state.history, result.changes);
  const acted = entry(apply(result.state, [{ op: 'set', entry: 'REL-01.1', value: 99.9 }], policy, LATER), 'REL-01.1');
  assert.deepEqual(acted.source, { type: 'policy', text: 'Policy: test-run policy (set by Mahmoud, 2026-10-24)' });
  const byFixture = apply(fresh(), [{ op: 'set-policy', policy: { label: 'test-run policy', stand_ins: [] } }], fixture);
  assert.deepEqual(byFixture.run.policy, { label: 'test-run policy', set_by: 'Dana Reyes', set_at: NOW, stand_ins: [] });
  const invalid = [
    [{ op: 'set-policy', policy: { label: '  ', stand_ins: [] } }, /needs a label/],
    [{ op: 'set-policy', policy: { label: 'house rules', stand_ins: 'Approver' } }, /stand_ins is a list/],
    [{ op: 'set-policy', policy: { label: 'house rules', stand_ins: ['Approver', ''] } }, /stand_ins is a list/],
    [{ op: 'set-policy', policy: { label: 'house rules' } }, /stand_ins is a list/],
    [{ op: 'set-policy', policy: { label: 'house rules', stand_ins: ['Approver', 'Approver'] } }, /appears once/],
    [{ op: 'set-policy', policy: { label: 'house rules', stand_ins: [], set_by: 'Sam' } }, /not set_by/],
    [{ op: 'set-policy', policy: 'house rules' }, /policy is \{ label, stand_ins \}/],
    [{ op: 'set-policy' }, /set-policy takes policy/],
  ];
  for (const [op, pattern] of invalid) rejected(fresh(), op, person, pattern);
});

test('applyPatch_setPolicyByAgent_rejected', () => {
  const op = { op: 'set-policy', policy: { label: 'house rules', stand_ins: ['Approver'] } };
  rejected(fresh(), op, agent, /Only a person or a fixture owner sets the answer policy/);
  rejected(withPolicy(), op, policy, /Only a person or a fixture owner sets the answer policy/);
});

test('applyPatch_setPolicyNull_clears', () => {
  const state = withPolicy();
  const before = state.run.policy;
  assert.deepEqual(before, { label: 'test-run policy', set_by: 'Mahmoud', set_at: NOW, stand_ins: ['Approver'] });
  const result = E.applyPatch(state, [{ op: 'set-policy', policy: null }], person, { now: LATER });
  assert.deepEqual(result.errors, []);
  assert.equal(result.state.run.policy, null);
  assert.deepEqual(result.changes.map((c) => [c.op, c.target, c.from, c.to]), [['set-policy', 'run.policy', before, null]]);
  const refused = E.applyPatch(result.state, [{ op: 'set', entry: 'REL-01.1', value: 99.9 }], policy, { now: LATER });
  assert.deepEqual(refused.errors.map((e) => e.index), [null]);
  assert.match(refused.errors[0].message, /run\.policy/);
  const again = E.applyPatch(result.state, [{ op: 'set-policy', policy: null }], person, { now: LATER });
  assert.deepEqual([again.errors, again.changes], [[], []]);
});

test('applyPatch_policySetFactOnlyRow_rejected', () => {
  const state = withPolicy();
  rejected(state, { op: 'set', entry: 'CAP-01.1', value: 864000 }, policy, /CAP-01 is a fact only a person gives/);
  rejected(state, { op: 'set', entry: 'HDR-02.1', value: 'Sam Lee' }, policy, /HDR-02 is a fact only a person gives/);
  const after = entry(apply(state, [{ op: 'set', entry: 'REL-01.1', value: 99.9 }], policy), 'REL-01.1');
  assert.deepEqual([after.value, after.status, after.source], [99.9, 'Estimated', { type: 'policy', text: POLICY_LABEL }]);
});

test('applyPatch_policyConfirmFactOnlyRow_rejected', () => {
  const state = apply(withPolicy(), [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'REL-01.1', value: 99.9 }], person);
  rejected(state, { op: 'confirm', entry: 'CAP-01.1' }, policy, /CAP-01 is a fact only a person gives/);
  const after = entry(apply(state, [{ op: 'confirm', entry: 'REL-01.1' }], policy), 'REL-01.1');
  assert.deepEqual([after.status, after.confirmed_by, after.confirmed_at], ['Confirmed', POLICY_LABEL, NOW]);
});

test('applyPatch_confirmGroupByPolicy_skipsFactValues', () => {
  const state = apply(withPolicy(), [
    { op: 'set', entry: 'CAP-01.1', value: 864000, source: fromBrd('BRD: REFUNDS/NFR-02') },
    { op: 'set', entry: 'CAP-07.1', value: 800, source: fromBrd('BRD: REFUNDS/NFR-04') },
    { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3, source: appendix },
    { op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 0.65, source: appendix },
    { op: 'set-factor', entry: 'CAP-06.1', factor: 'requestKB', value: 2, source: fromBrd('BRD: REFUNDS 12') },
  ], agent);
  const byPolicy = E.applyPatch(state, [{ op: 'confirm-group', group: 'CAP' }], policy, { now: NOW });
  assert.deepEqual(byPolicy.errors, []);
  assert.deepEqual(byPolicy.changes.map((c) => [c.op, c.target, c.to.confirmed_by]), [['confirm-group', 'CAP-02.1.callsPerTxn', POLICY_LABEL], ['confirm-group', 'CAP-04.1.utilization', POLICY_LABEL], ['confirm-group', 'CAP-07.1', POLICY_LABEL]]);
  assert.deepEqual([entry(byPolicy.state, 'CAP-01.1').status, entry(byPolicy.state, 'CAP-06.1').factors.requestKB.status], ['Estimated', 'Estimated']);
  const byPerson = E.applyPatch(state, [{ op: 'confirm-group', group: 'CAP' }], person, { now: NOW });
  assert.deepEqual(byPerson.changes.map((c) => c.target), ['CAP-01.1', 'CAP-02.1.callsPerTxn', 'CAP-04.1.utilization', 'CAP-06.1.requestKB', 'CAP-07.1']);
  rejected(state, { op: 'confirm-group', group: 'XYZ' }, person, /group is one of/);
});

test('applyPatch_policyConfirmAppendixFactorOnFactRow_allowed', () => {
  assert.equal(rowById('CAP-04').factOnly, true);
  const state = apply(withPolicy(), [{ op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 0.65, source: appendix }], agent);
  const confirmed = apply(state, [{ op: 'confirm', entry: 'CAP-04.1', factor: 'utilization' }], policy);
  assert.deepEqual(entry(confirmed, 'CAP-04.1').factors.utilization, { value: 0.65, status: 'Confirmed', source: appendix, confirmed_by: POLICY_LABEL, confirmed_at: NOW });
  rejected(confirmed, { op: 'set', entry: 'CAP-04.1', value: 5 }, policy, /CAP-04 is a fact only a person gives/);
  const values = { utilization: 0.65, networkOverhead: 1.2, indexFactor: 1.4, copies: 2, meanLatencyMs: 120, callsPerTxn: 3, requestFactor: 1.1 };
  const byPolicy = apply(withPolicy(), APPENDIX_FACTORS.flatMap((name) => [{ op: 'set-factor', entry: factorEntry(name), factor: name, value: values[name] }, { op: 'confirm', entry: factorEntry(name), factor: name }]), policy);
  for (const name of APPENDIX_FACTORS) assert.deepEqual(entry(byPolicy, factorEntry(name)).factors[name], { value: values[name], status: 'Confirmed', source: { type: 'policy', text: POLICY_LABEL }, confirmed_by: POLICY_LABEL, confirmed_at: NOW }, name);
  assert.deepEqual(APPENDIX_FACTORS.filter((name) => rowById(E.FACTORS[name].row).factOnly), ['utilization', 'networkOverhead', 'indexFactor', 'copies']);
});

test('applyPatch_policySetNonAppendixFactorOnFactRow_rejected', () => {
  rejected(withPolicy(), { op: 'set-factor', entry: 'CAP-06.1', factor: 'requestKB', value: 2 }, policy, /requestKB on CAP-06 is a fact only a person gives/);
  const factRowFactors = Object.keys(E.FACTORS).filter((name) => !APPENDIX_FACTORS.includes(name) && rowById(E.FACTORS[name].row).factOnly);
  assert.deepEqual(factRowFactors, ['requestKB', 'responseKB', 'storedKB', 'initialGB', 'retentionDays', 'queryShape', 'budgetPressure']);
  const setOp = (name) => ({ op: 'set-factor', entry: factorEntry(name), factor: name, value: E.numeric.has(name) ? 2 : { queryShape: 'simple', budgetPressure: 'tight' }[name] });
  const confirmOp = (name) => ({ op: 'confirm', entry: factorEntry(name), factor: name });
  for (const name of factRowFactors) rejected(withPolicy(), setOp(name), policy, new RegExp(`${name} on ${E.FACTORS[name].row} is a fact only a person gives`));
  const byPerson = apply(withPolicy(), factRowFactors.map(setOp), person);
  for (const name of factRowFactors) rejected(byPerson, confirmOp(name), policy, new RegExp(`${name} on ${E.FACTORS[name].row} is a fact only a person gives`));
  const byFixture = apply(byPerson, factRowFactors.map(confirmOp), fixture);
  for (const name of factRowFactors) assert.deepEqual([entry(byFixture, factorEntry(name)).factors[name].status, entry(byFixture, factorEntry(name)).factors[name].confirmed_by], ['Confirmed', FIXTURE_LABEL], name);
  const otherRow = entry(apply(withPolicy(), [{ op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value: 20 }], policy), 'INT-08.1');
  assert.deepEqual([rowById('INT-08').factOnly, otherRow.factors.cidrPrefix.value, otherRow.factors.cidrPrefix.source], [false, 20, { type: 'policy', text: POLICY_LABEL }]);
});

test('applyPatch_fixtureConfirmFact_labelled', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'CAP-01.1', value: 864000 }], fixture);
  assert.deepEqual([entry(state, 'CAP-01.1').status, entry(state, 'CAP-01.1').source], ['Estimated', { type: 'fixture', text: FIXTURE_LABEL }]);
  const confirmed = apply(state, [{ op: 'confirm', entry: 'CAP-01.1' }], fixture, LATER);
  const after = entry(confirmed, 'CAP-01.1');
  assert.deepEqual([after.status, after.confirmed_by, after.confirmed_at], ['Confirmed', FIXTURE_LABEL, LATER]);
  assert.deepEqual(confirmed.history.at(-1).actor, { type: 'fixture', name: 'Dana Reyes', label: FIXTURE_LABEL });
});

test('applyPatch_acceptProposalByPerson_confirmedWithAnswerSource', () => {
  const reason = 'The BRD allows 43 minutes of disruption a month';
  const state = apply(fresh(), [{ op: 'propose', entry: 'REL-01.1', value: 99.9, reason }], agent);
  const proposed = entry(state, 'REL-01.1');
  assert.deepEqual([proposed.status, proposed.value, proposed.proposal], ['Open', null, { value: 99.9, reason, by: 'E2E Architect', at: NOW }]);
  rejected(state, { op: 'accept-proposal', entry: 'REL-01.1' }, agent, /agent never accepts/);
  const after = entry(apply(state, [{ op: 'accept-proposal', entry: 'REL-01.1' }], person, LATER), 'REL-01.1');
  assert.deepEqual(
    [after.value, after.status, after.source, after.confirmed_by, after.confirmed_at, after.proposal],
    [99.9, 'Confirmed', { type: 'answer', text: 'Answer: Mahmoud, 2026-10-24 (proposal accepted)' }, 'Mahmoud', LATER, null],
  );
  rejected(fresh(), { op: 'accept-proposal', entry: 'REL-01.1' }, person, /no proposal/);
});

test('applyPatch_acceptProposalByPolicy_confirmedWithPolicyLabel', () => {
  const state = apply(withPolicy(), [{ op: 'propose', entry: 'REL-03.1', value: 900, reason: 'A 15 minute outage stays inside the BRD penalty window' }], agent);
  const after = entry(apply(state, [{ op: 'accept-proposal', entry: 'REL-03.1' }], policy), 'REL-03.1');
  assert.deepEqual(
    [after.value, after.status, after.source, after.confirmed_by, after.confirmed_at, after.proposal],
    [900, 'Confirmed', { type: 'policy', text: POLICY_LABEL }, POLICY_LABEL, NOW, null],
  );
});

function leftOpenWithProposal() {
  const proposed = apply(withPolicy(), [{ op: 'propose', entry: 'REL-01.1', value: 99.9, reason: 'Forty-three minutes a month' }], agent);
  const leftOpen = apply(proposed, [{ op: 'set', entry: 'REL-01.1', value: '' }], person);
  const held = entry(leftOpen, 'REL-01.1');
  assert.deepEqual([held.status, held.value, held.source, held.proposal.value], ['Open', null, LEFT_OPEN, 99.9]);
  return { proposed, leftOpen };
}

test('applyPatch_policyAcceptProposalOnLeftOpenEntry_rejected', () => {
  const { proposed, leftOpen } = leftOpenWithProposal();
  rejected(leftOpen, { op: 'accept-proposal', entry: 'REL-01.1' }, policy, /^REL-01\.1 is protected \(Confirmed, or answered by a person\), so only a person may change it; ask the owner, or record the question as an unknown\.$/);
  const notLeftOpen = entry(apply(proposed, [{ op: 'accept-proposal', entry: 'REL-01.1' }], policy), 'REL-01.1');
  assert.deepEqual([notLeftOpen.status, notLeftOpen.value, notLeftOpen.confirmed_by], ['Confirmed', 99.9, POLICY_LABEL]);
});

test('applyPatch_personAcceptProposalOnLeftOpenEntry_allowed', () => {
  const { leftOpen } = leftOpenWithProposal();
  for (const [actor, name] of [[person, 'Mahmoud'], [{ type: 'person', name: 'Dana', label: '' }, 'Dana']]) {
    const result = E.applyPatch(leftOpen, [{ op: 'accept-proposal', entry: 'REL-01.1' }], actor, { now: LATER });
    assert.deepEqual(result.errors, [], name);
    const after = entry(result.state, 'REL-01.1');
    assert.deepEqual(
      [after.value, after.status, after.source, after.confirmed_by, after.confirmed_at, after.proposal],
      [99.9, 'Confirmed', { type: 'answer', text: `Answer: ${name}, 2026-10-24 (proposal accepted)` }, name, LATER, null],
      name,
    );
  }
});

test('applyPatch_proposeOnFactRow_rejected', () => {
  rejected(fresh(), { op: 'propose', entry: 'CAP-01.1', value: 864000, reason: 'Typical for a regional refund desk' }, agent, /CAP-01 takes no proposal/);
  rejected(fresh(), { op: 'propose', entry: 'REL-01.1', value: 99.9, reason: 'A month of 43 minutes' }, person, /Only the agent .* proposes/);
  rejected(fresh(), { op: 'propose', entry: 'REL-01.1', value: 99.9 }, agent, /needs its reason/);
  const valued = apply(fresh(), [{ op: 'set', entry: 'REL-01.1', value: 99.95 }], person);
  rejected(valued, { op: 'propose', entry: 'REL-01.1', value: 99.9, reason: 'A month of 43 minutes' }, agent, /Open entry/);
});

test('applyPatch_naWithoutReason_rejected', () => {
  for (const op of [{ op: 'na', entry: 'CAP-12.1' }, { op: 'na', entry: 'CAP-12.1', reason: '  ' }]) rejected(fresh(), op, person, /N\/A needs a reason/);
  const after = entry(apply(fresh(), [{ op: 'na', entry: 'CAP-12.1', reason: 'No AI or media jobs in scope' }], person), 'CAP-12.1');
  assert.deepEqual([after.status, after.na_reason, after.value, after.source], ['N/A', 'No AI or media jobs in scope', null, { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' }]);
});

test('applyPatch_naByAgent_rejected', () => {
  assert.deepEqual([rowById('CAP-12').factOnly, rowById('ECO-05').factOnly], [true, false]);
  for (const id of ['CAP-12.1', 'ECO-05.1']) rejected(withPolicy(), { op: 'na', entry: id, reason: 'The BRD scope leaves it out' }, agent, /agent never closes an item as N\/A/);
});

test('applyPatch_naByPolicyOnFactRow_rejected', () => {
  const op = { op: 'na', entry: 'CAP-12.1', reason: 'No AI or media jobs in scope' };
  rejected(withPolicy(), op, policy, /^An answer policy never marks an item N\/A; ask the person who owns CAP-12\.1 to mark it N\/A with the reason\.$/);
  const byPerson = entry(apply(withPolicy(), [op], person), 'CAP-12.1');
  assert.deepEqual([byPerson.status, byPerson.source], ['N/A', { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' }]);
  const byFixture = entry(apply(withPolicy(), [op], fixture), 'CAP-12.1');
  assert.deepEqual([byFixture.status, byFixture.na_reason, byFixture.source], ['N/A', 'No AI or media jobs in scope', { type: 'fixture', text: FIXTURE_LABEL }]);
});

test('applyPatch_naByPolicyOnTargetRow_rejected', () => {
  assert.deepEqual([rowById('ECO-05').factOnly, rowById('ECO-05').defaultKind], [false, 'target']);
  const reason = 'No environmental footprint goal applies';
  rejected(withPolicy(), { op: 'na', entry: 'ECO-05.1', reason }, policy, /^An answer policy never marks an item N\/A; ask the person who owns ECO-05\.1 to mark it N\/A with the reason\.$/);
  const result = E.applyPatch(withPolicy(), [{ op: 'na', entry: 'ECO-05.1', reason }], fixture, { now: NOW });
  assert.deepEqual(result.errors, []);
  const after = entry(result.state, 'ECO-05.1');
  assert.deepEqual([after.status, after.na_reason, after.value, after.source, after.confirmed_by], ['N/A', reason, null, { type: 'fixture', text: FIXTURE_LABEL }, null]);
  assert.deepEqual(result.changes.map((c) => [c.op, c.target, c.actor.label, c.reason]), [['na', 'ECO-05.1', FIXTURE_LABEL, reason]]);
});

test('applyPatch_addOnSingleRow_rejected', () => {
  rejected(fresh(), { op: 'add', row: 'CAP-02' }, person, /CAP-02 holds one entry/);
  rejected(fresh(), { op: 'add', row: 'OVL-04', workload: 'WL-01' }, person, /already has an entry for WL-01/);
  rejected(fresh(), { op: 'add', row: 'OVL-04', workload: 'WL-07' }, person, /register\.overlay\.workloads/);
  const state = apply(fresh(), [{ op: 'add', row: 'REL-03', label: 'Refund request', scope: 'region' }], agent);
  assert.deepEqual(E.rowEntries(state, 'REL-03').map((e) => [E.entryId('REL-03', e.n), e.primary, e.label, e.scope, e.status]), [['REL-03.1', true, null, null, 'Open'], ['REL-03.2', false, 'Refund request', 'region', 'Open']]);
  assert.deepEqual(state.history.at(-1).to, entry(state, 'REL-03.2'));
});

test('applyPatch_removePrimary_rejected', () => {
  const state = apply(fresh(), [{ op: 'add', row: 'REL-03', label: 'Refund request' }], agent);
  rejected(state, { op: 'remove', entry: 'REL-03.1' }, person, /REL-03\.1 is the primary entry/);
  rejected(state, { op: 'remove', entry: 'CAP-02.1' }, person, /CAP-02 holds one entry/);
  const removed = apply(state, [{ op: 'remove', entry: 'REL-03.2' }], person);
  assert.deepEqual(E.rowEntries(removed, 'REL-03').map((e) => e.n), [1]);
  assert.equal(removed.history.at(-1).from.label, 'Refund request');
  assert.deepEqual(E.rowEntries(apply(removed, [{ op: 'add', row: 'REL-03' }], person), 'REL-03').map((e) => e.n), [1, 3]);
});

test('applyPatch_kindChangeWithoutReason_rejected', () => {
  rejected(fresh(), { op: 'set', entry: 'BUS-01.1', kind: 'hard' }, person, /kind of BUS-01\.1 from target to hard needs a reason/);
  rejected(fresh(), { op: 'set', entry: 'BUS-01.1', kind: 'wish', reason: 'x' }, person, /kind is hard, target, forecast or assumption/);
  const same = E.applyPatch(fresh(), [{ op: 'set', entry: 'BUS-01.1', kind: 'target' }], person, { now: NOW });
  assert.deepEqual([same.errors, same.changes], [[], []]);
});

test('applyPatch_kindChangeWithReason_recordedInHistory', () => {
  const reason = 'The sponsor made the KPI a contract term';
  const result = E.applyPatch(fresh(), [{ op: 'set', entry: 'BUS-01.1', kind: 'hard', reason }], person, { now: NOW });
  assert.deepEqual(result.errors, []);
  assert.equal(entry(result.state, 'BUS-01.1').kind, 'hard');
  assert.deepEqual(result.state.history, [{ at: NOW, actor: { type: 'person', name: 'Mahmoud', label: 'Mahmoud' }, op: 'set', target: 'BUS-01.1', from: { kind: 'target' }, to: { kind: 'hard' }, reason }]);
  const kept = apply(result.state, [{ op: 'set', entry: 'BUS-01.1', value: 'Refunds in one day' }], person);
  assert.equal(entry(kept, 'BUS-01.1').kind, 'hard');
});

test('applyPatch_fixtureSameExplicitKindWithReason_recorded', () => {
  const reason = 'The audit fixture affirms the kind';
  const actor = { type: 'fixture', name: 'Dana Reyes', label: FIXTURE_LABEL };
  const result = E.applyPatch(fresh(), [{ op: 'set', entry: 'BUS-01.1', kind: 'target', reason }], fixture, { now: NOW });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.changes, [{ at: NOW, actor, op: 'set', target: 'BUS-01.1', from: { kind: 'target' }, to: { kind: 'target' }, reason }]);
  assert.deepEqual(result.state.history, result.changes);
  rejected(result.state, { op: 'set', entry: 'BUS-01.1', kind: 'hard', reason: 'The BRD makes the KPI a contract term' }, agent, /^The kind of BUS-01\.1 is protected \(set by a person\)/);
  const hard = apply(withPolicy(), [{ op: 'set', entry: 'BUS-01.1', kind: 'hard', reason: 'The BRD makes the KPI a contract term' }], agent);
  assert.equal(entry(apply(hard, [{ op: 'set', entry: 'BUS-01.1', kind: 'target', reason: 'The sponsor reads it as a goal' }], agent), 'BUS-01.1').kind, 'target', 'an agent kind is no person kind');
  const affirmed = E.applyPatch(hard, [{ op: 'set', entry: 'BUS-01.1', kind: 'hard', reason }], fixture, { now: LATER });
  assert.deepEqual([affirmed.errors, affirmed.changes], [[], [{ at: LATER, actor, op: 'set', target: 'BUS-01.1', from: { kind: 'hard' }, to: { kind: 'hard' }, reason }]]);
  rejected(affirmed.state, { op: 'set', entry: 'BUS-01.1', kind: 'target', reason: 'The sponsor reads it as a goal' }, agent, /^The kind of BUS-01\.1 is protected \(set by a person\)/);
  const withValue = E.applyPatch(hard, [{ op: 'set', entry: 'BUS-01.1', value: 'Refunds in one day', kind: 'hard', reason }], fixture, { now: LATER });
  assert.deepEqual(withValue.changes.map((c) => [c.from.kind, c.to.kind, c.to.value, c.reason]), [['hard', 'hard', 'Refunds in one day', reason]], 'one record holds the value and the kind');
  for (const [who, op] of [[fixture, { op: 'set', entry: 'BUS-01.1', kind: 'hard' }], [policy, { op: 'set', entry: 'BUS-01.1', kind: 'hard', reason }], [agent, { op: 'set', entry: 'BUS-01.1', kind: 'hard', reason }]]) {
    const quiet = E.applyPatch(hard, [op], who, { now: LATER });
    assert.deepEqual([quiet.errors, quiet.changes], [[], []], `${who.type}${'reason' in op ? ' with a reason' : ' without a reason'}`);
  }
});

test('applyPatch_replaceDefaultWithoutKind_returnsToDefaultKind', () => {
  const defaulted = apply(fresh(), [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, stage, prod', kind: 'assumption', reason: 'Project default (decision 11)', source: { type: 'default', text: 'Default: project rule OPS-04' } }], agent);
  assert.deepEqual([entry(defaulted, 'OPS-04.1').kind, entry(defaulted, 'OPS-04.1').source.type], ['assumption', 'default']);
  const answered = E.applyPatch(defaulted, [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, prod' }], person, { now: NOW });
  assert.deepEqual(answered.errors, []);
  assert.deepEqual([entry(answered.state, 'OPS-04.1').kind, answered.changes.map((c) => [c.from.kind, c.to.kind, c.reason])], ['target', [[undefined, undefined, null], ['assumption', 'target', null]]]);
  const cleared = apply(defaulted, [{ op: 'set', entry: 'OPS-04.1', value: '' }], person);
  assert.deepEqual([entry(cleared, 'OPS-04.1').kind, entry(cleared, 'OPS-04.1').status], ['target', 'Open']);
  const chosen = apply(defaulted, [{ op: 'set', entry: 'OPS-04.1', value: 'dev, prod', kind: 'hard', reason: 'Audit requires exactly two environments' }], person);
  assert.equal(entry(chosen, 'OPS-04.1').kind, 'hard');
  const derived = apply(fresh(), [{ op: 'set', entry: 'CAP-02.1', value: 165, kind: 'forecast', reason: 'Derived from forecasts', source: { type: 'derived', text: 'Derived: CALC-03 from CAP-01, CAP-04, CAP-02' } }], agent);
  assert.equal(entry(apply(derived, [{ op: 'set', entry: 'CAP-02.1', value: 170 }], person), 'CAP-02.1').kind, 'target');
});

const DERIVED_CAP02 = { type: 'derived', text: 'Derived: CALC-03 from CAP-01, CAP-04, CAP-02' };

function derivedCap02() {
  const state = apply(fresh(), [{ op: 'set', entry: 'CAP-02.1', value: 165, kind: 'forecast', reason: 'Derived: CALC-03', source: DERIVED_CAP02 }], agent);
  assert.deepEqual([entry(state, 'CAP-02.1').kind, entry(state, 'CAP-02.1').source, rowById('CAP-02').defaultKind], ['forecast', DERIVED_CAP02, 'target']);
  return state;
}

test('applyPatch_personClearsDerivedValue_kindReturnsToDefault', () => {
  const result = E.applyPatch(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', value: '' }], person, { now: NOW });
  assert.deepEqual(result.errors, []);
  const after = entry(result.state, 'CAP-02.1');
  assert.deepEqual([after.value, after.status, after.source, after.kind], [null, 'Open', LEFT_OPEN, 'target']);
  assert.deepEqual(result.changes.map((c) => [c.from.kind, c.to.kind, c.reason]), [[undefined, undefined, null], ['forecast', 'target', null]]);
});

test('applyPatch_personReplacesDerivedValueWithoutKind_kindReturnsToDefault', () => {
  const result = E.applyPatch(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', value: 170 }], person, { now: NOW });
  assert.deepEqual(result.errors, []);
  const after = entry(result.state, 'CAP-02.1');
  assert.deepEqual([after.value, after.status, after.source, after.kind], [170, 'Estimated', { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' }, 'target']);
  assert.deepEqual(result.changes.map((c) => [c.from.kind, c.to.kind]), [[undefined, undefined], ['forecast', 'target']]);
  const byBrd = entry(apply(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', value: 180, source: fromBrd('BRD: REFUNDS/NFR-05') }], agent), 'CAP-02.1');
  assert.deepEqual([byBrd.value, byBrd.kind], [180, 'target']);
  const labelOnly = entry(apply(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', label: 'Refund API' }], person), 'CAP-02.1');
  assert.deepEqual([labelOnly.value, labelOnly.kind, labelOnly.source], [165, 'forecast', DERIVED_CAP02]);
});

test('applyPatch_personKeepsDerivedKind_needsReason', () => {
  rejected(derivedCap02(), { op: 'set', entry: 'CAP-02.1', value: 170, kind: 'forecast' }, person, /^Replacing the derived value of CAP-02\.1 returns its kind to target; kind forecast needs a reason\.$/);
  const kept = apply(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', value: 170, kind: 'forecast', reason: 'Still a forecast from the sales plan' }], person);
  assert.deepEqual([entry(kept, 'CAP-02.1').value, entry(kept, 'CAP-02.1').kind, kept.history.at(-1).reason], [170, 'forecast', 'Still a forecast from the sales plan']);
  assert.equal(entry(apply(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', value: 170, kind: 'target' }], person), 'CAP-02.1').kind, 'target');
});

test('applyPatch_valueOverPersonSetKind_keepsKind', () => {
  const hard = apply(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', kind: 'hard', reason: 'The partner contract caps the API rate' }], person);
  const byBrd = E.applyPatch(hard, [{ op: 'set', entry: 'CAP-02.1', value: 180, source: fromBrd('BRD: REFUNDS/NFR-05') }], agent, { now: LATER });
  assert.deepEqual(byBrd.errors, []);
  assert.deepEqual([entry(byBrd.state, 'CAP-02.1').value, entry(byBrd.state, 'CAP-02.1').kind, 'kind' in byBrd.changes[0].to], [180, 'hard', false]);
  const cleared = entry(apply(hard, [{ op: 'set', entry: 'CAP-02.1', value: '' }], person), 'CAP-02.1');
  assert.deepEqual([cleared.status, cleared.kind], ['Open', 'hard']);
  const defaulted = apply(fresh(), [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, stage, prod', kind: 'assumption', reason: 'Decision 11: project default', source: { type: 'default', text: 'Default: project rule OPS-04' } }], agent);
  const audited = apply(defaulted, [{ op: 'set', entry: 'OPS-04.1', kind: 'hard', reason: 'Audit fixes the environment list' }], fixture);
  assert.equal(entry(apply(audited, [{ op: 'set', entry: 'OPS-04.1', value: 'dev, prod', source: fromBrd('BRD: REFUNDS/NFR-12') }], agent), 'OPS-04.1').kind, 'hard');
});

test('applyPatch_agentResendsSameDerivedValue_keepsKind', () => {
  const derived = derivedCap02();
  const resent = E.applyPatch(derived, [{ op: 'set', entry: 'CAP-02.1', value: 165, source: DERIVED_CAP02 }], agent, { now: LATER });
  assert.deepEqual([resent.errors, resent.changes, entry(resent.state, 'CAP-02.1').kind], [[], [], 'forecast']);
  const defaultSource = { type: 'default', text: 'Default: project rule OPS-04' };
  const defaulted = apply(fresh(), [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, stage, prod', kind: 'assumption', reason: 'Decision 11: project default', source: defaultSource }], agent);
  const again = E.applyPatch(defaulted, [{ op: 'set', entry: 'OPS-04.1', value: ' dev, test, stage, prod ', source: defaultSource }], agent, { now: LATER });
  assert.deepEqual([again.errors, again.changes, entry(again.state, 'OPS-04.1').kind], [[], [], 'assumption']);
  assert.equal(entry(apply(derived, [{ op: 'set', entry: 'CAP-02.1', value: 166, source: DERIVED_CAP02 }], agent), 'CAP-02.1').kind, 'target');
});

test('applyPatch_personTypesSameDerivedValue_takesOverWithDefaultKind', () => {
  const result = E.applyPatch(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', value: '165' }], person, { now: LATER });
  assert.deepEqual(result.errors, []);
  const answer = { type: 'answer', text: 'Answer: Mahmoud, 2026-10-24' };
  const after = entry(result.state, 'CAP-02.1');
  assert.deepEqual([after.value, after.status, after.source, after.kind], [165, 'Estimated', answer, 'target']);
  assert.deepEqual(result.changes.map((c) => [c.from, c.to, c.reason]), [[{ source: DERIVED_CAP02 }, { source: answer }, null], [{ kind: 'forecast' }, { kind: 'target' }, null]]);
  const byBrd = entry(apply(derivedCap02(), [{ op: 'set', entry: 'CAP-02.1', value: 165, source: fromBrd('BRD: REFUNDS/NFR-05') }], agent), 'CAP-02.1');
  assert.deepEqual([byBrd.value, byBrd.source.type, byBrd.kind], [165, 'brd', 'target']);
});

test('applyPatch_agentKindChangeOverPersonSetKind_rejected', () => {
  const state = apply(withPolicy(), [{ op: 'set', entry: 'BUS-01.1', kind: 'hard', reason: 'The sponsor made the KPI a contract term' }], person);
  const message = /^The kind of BUS-01\.1 is protected \(set by a person\), so only a person may change it; ask the owner, or record the question as an unknown\.$/;
  rejected(state, { op: 'set', entry: 'BUS-01.1', kind: 'target', reason: 'The BRD calls it a goal' }, agent, message);
  rejected(state, { op: 'set', entry: 'BUS-01.1', value: 'Refunds in one day', kind: 'target', reason: 'The BRD calls it a goal', source: fromBrd('BRD: REFUNDS/OBJ-01') }, agent, message);
  rejected(state, { op: 'set', entry: 'BUS-01.1', kind: 'target', reason: 'The policy reads it as a goal' }, policy, message);
  const sameKind = apply(state, [{ op: 'set', entry: 'BUS-01.1', value: 'Refunds in one day', kind: 'hard', reason: 'Still the contract term', source: fromBrd('BRD: REFUNDS/OBJ-01') }], agent);
  assert.deepEqual([entry(sameKind, 'BUS-01.1').value, entry(sameKind, 'BUS-01.1').kind], ['Refunds in one day', 'hard']);
  for (const actor of [person, fixture]) assert.equal(entry(apply(state, [{ op: 'set', entry: 'BUS-01.1', kind: 'target', reason: 'Renegotiated as a goal' }], actor), 'BUS-01.1').kind, 'target', actor.type);
});

test('applyPatch_agentKindChangeWithReasonOverCatalogueKind_allowed', () => {
  const byAgent = E.applyPatch(fresh(), [{ op: 'set', entry: 'BUS-01.1', kind: 'hard', reason: 'The BRD makes the KPI a contract term' }], agent, { now: NOW });
  assert.deepEqual(byAgent.errors, []);
  assert.deepEqual([entry(byAgent.state, 'BUS-01.1').kind, byAgent.changes[0].reason], ['hard', 'The BRD makes the KPI a contract term']);
  rejected(fresh(), { op: 'set', entry: 'BUS-01.1', kind: 'hard' }, agent, /^Changing the kind of BUS-01\.1 from target to hard needs a reason\.$/);
  const back = apply(byAgent.state, [{ op: 'set', entry: 'BUS-01.1', kind: 'target', reason: 'The sponsor reads it as a goal' }], agent);
  assert.equal(entry(back, 'BUS-01.1').kind, 'target');
  const byPolicy = apply(withPolicy(), [{ op: 'set', entry: 'BUS-01.1', kind: 'hard', reason: 'The policy treats contract KPIs as hard' }], policy);
  assert.equal(entry(byPolicy, 'BUS-01.1').kind, 'hard');
});

test('applyPatch_removeEntryWithPersonSetKind_onlyByPerson', () => {
  const added = apply(withPolicy(), [{ op: 'add', row: 'REL-05' }], person);
  const state = apply(added, [{ op: 'set', entry: 'REL-05.2', kind: 'hard', reason: 'The regulator requires a region scope' }], person);
  const message = /^The kind of REL-05\.2 is protected \(set by a person\), so only a person may change it; ask the owner, or record the question as an unknown\.$/;
  for (const actor of [agent, policy]) rejected(state, { op: 'remove', entry: 'REL-05.2' }, actor, message);
  assert.deepEqual(E.rowEntries(apply(state, [{ op: 'remove', entry: 'REL-05.2' }], person), 'REL-05').map((e) => e.n), [1]);
  assert.deepEqual(E.rowEntries(apply(added, [{ op: 'remove', entry: 'REL-05.2' }], agent), 'REL-05').map((e) => e.n), [1]);
});

test('applyPatch_policyNaOverPersonSetKind_rejected', () => {
  const withRun = apply(derivedCap02(), [{ op: 'set-policy', policy: { label: 'test-run policy', stand_ins: [] } }], person);
  const owned = apply(withRun, [{ op: 'set', entry: 'CAP-02.1', kind: 'hard', reason: 'The partner contract caps the API rate' }], person);
  const refusal = /^An answer policy never marks an item N\/A; ask the person who owns CAP-02\.1 to mark it N\/A with the reason\.$/;
  rejected(owned, { op: 'na', entry: 'CAP-02.1', reason: 'No API in scope' }, policy, refusal);
  const byPerson = entry(apply(owned, [{ op: 'na', entry: 'CAP-02.1', reason: 'No API in scope' }], person), 'CAP-02.1');
  assert.deepEqual([byPerson.status, byPerson.kind, byPerson.source.type], ['N/A', 'hard', 'answer']);
  rejected(withRun, { op: 'na', entry: 'CAP-02.1', reason: 'No API in scope' }, policy, refusal);
});

test('applyPatch_agentOverwritesFixtureValue_rejected', () => {
  const state = apply(withPolicy(), [{ op: 'set', entry: 'REL-04.1', value: 60 }, { op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value: 20 }], fixture);
  const fixtureSource = { type: 'fixture', text: FIXTURE_LABEL };
  assert.deepEqual([entry(state, 'REL-04.1').source, entry(state, 'INT-08.1').factors.cidrPrefix.source], [fixtureSource, fixtureSource]);
  rejected(state, { op: 'set', entry: 'REL-04.1', value: 3600, source: fromBrd('BRD: REFUNDS/NFR-07') }, agent, /^REL-04\.1 is protected \(Confirmed, or answered by a person\)/);
  rejected(state, { op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value: 24, source: fromBrd('BRD: REFUNDS 08') }, agent, /^INT-08\.1\.cidrPrefix is protected/);
  rejected(state, { op: 'open', entry: 'REL-04.1' }, agent, /^REL-04\.1 is protected/);
  rejected(state, { op: 'set', entry: 'REL-04.1', value: 3600 }, policy, /^REL-04\.1 is protected/);
  assert.equal(entry(apply(state, [{ op: 'set', entry: 'REL-04.1', value: 3600 }], person), 'REL-04.1').value, 3600);
  assert.equal(entry(apply(state, [{ op: 'set', entry: 'REL-04.1', value: 900 }], fixture), 'REL-04.1').value, 900);
});

test('applyPatch_signByAgent_rejected', () => {
  for (const actor of [agent, fixture]) rejected(fresh(), { op: 'sign', role: 'business_sponsor', decision: 'Approved' }, actor, /Sign-off needs a person, or an answer policy whose stand_ins include Approver/);
  rejected(withPolicy([]), { op: 'sign', role: 'business_sponsor', decision: 'Approved' }, policy, /stand_ins include Approver/);
});

test('applyPatch_signOff_storesContentHashAndStandIn', () => {
  const state = apply(withPolicy(), [{ op: 'set', entry: 'REL-04.1', value: 60 }], person);
  const hash = E.contentHash(state);
  const signed = apply(state, [{ op: 'sign', role: 'business_sponsor', decision: 'Approved' }, { op: 'sign', role: 'migration_owner', applicable: false, reason: 'No migration overlay' }], person);
  assert.deepEqual(signed.gate.signoffs, [
    { role: 'business_sponsor', applicable: true, na_reason: null, name: 'Mahmoud', decision: 'Approved', at: NOW, content_hash: hash, stand_in: false },
    { role: 'migration_owner', applicable: false, na_reason: 'No migration overlay', name: 'Mahmoud', decision: null, at: NOW, content_hash: hash, stand_in: false },
  ]);
  const stood = apply(signed, [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }], policy, LATER);
  assert.deepEqual(stood.gate.signoffs.map((s) => s.role), ['business_sponsor', 'migration_owner', 'data_owner']);
  assert.deepEqual(stood.gate.signoffs[2], { role: 'data_owner', applicable: true, na_reason: null, name: STAND_IN, decision: 'Approved with conditions', at: LATER, content_hash: hash, stand_in: true });
  const resigned = apply(stood, [{ op: 'sign', role: 'business_sponsor', decision: 'Approved with conditions' }], person, LATER);
  assert.deepEqual(resigned.gate.signoffs.map((s) => [s.role, s.decision, s.at]), [['business_sponsor', 'Approved with conditions', LATER], ['migration_owner', null, NOW], ['data_owner', 'Approved with conditions', LATER]], 'a sign-off replaces its role record in place');
  const everyRole = apply(state, E.SIGNOFF_ROLES.map((role) => ({ op: 'sign', role: role.key, decision: 'Approved' })), person);
  assert.deepEqual(everyRole.gate.signoffs.map((s) => s.role), E.SIGNOFF_ROLES.map((role) => role.key));
  rejected(state, { op: 'sign', role: 'sponsor', decision: 'Approved' }, person, /Unknown role "sponsor"/);
  rejected(state, { op: 'sign', role: 'data_owner', decision: 'Fine' }, person, /decision is Approved, Approved with conditions or Rejected/);
  rejected(state, { op: 'sign', role: 'data_owner', applicable: false }, person, /needs a reason/);
});

test('applyPatch_exceptionByStandIn_rejected', () => {
  const op = { op: 'add-exception', entry: 'DAT-04.1', reason: 'Residency review is booked', expires: '2026-12-31', review: '2026-12-15' };
  const standIn = E.applyPatch(withPolicy(), [op], { type: 'person', name: STAND_IN, label: '' }, { now: NOW });
  assert.deepEqual(standIn.errors.map((e) => e.index), [null]);
  assert.match(standIn.errors[0].message, /own name/);
  assert.deepEqual(standIn.state.gate.exceptions, []);
  for (const actor of [policy, agent, fixture]) rejected(withPolicy(), op, actor, /Only a named person grants an exception/);
  rejected(fresh(), { ...op, expires: '31/12/2026' }, person, /expires is a date/);
  rejected(fresh(), { ...op, entry: 'DAT-04.2' }, person, /DAT-04 has no entry 2/);
  const granted = apply(fresh(), [op, { ...op, entry: 'SEC-01.1' }], person);
  assert.deepEqual(granted.gate.exceptions, [
    { id: 'EXC-01', entry: 'DAT-04.1', reason: 'Residency review is booked', granted_by: 'Mahmoud', granted_at: NOW, expires: '2026-12-31', review: '2026-12-15' },
    { id: 'EXC-02', entry: 'SEC-01.1', reason: 'Residency review is booked', granted_by: 'Mahmoud', granted_at: NOW, expires: '2026-12-31', review: '2026-12-15' },
  ]);
});

test('applyPatch_optionCostsAndWeights_comeFromPerson', () => {
  const state = apply(withPolicy(), [{ op: 'set-option', name: 'One region, multi-AZ', shape: { hosting: 'cloud', topology: 'multiAZ' } }], agent);
  assert.deepEqual(state.options.list, [{ id: 'OPT-01', name: 'One region, multi-AZ', shape: { hosting: 'cloud', topology: 'multiAZ', dr: null, data: null, network: null }, one_time: null, monthly: null, scores: {} }]);
  const cost = { op: 'set-cost', option: 'OPT-01', cost: 'monthly', value: 5000 };
  const weights = { op: 'set-weights', values: { one_time_cost: 3, reversibility: 2 } };
  rejected(state, cost, agent, /Option costs come from a person/);
  rejected(state, cost, policy, /answer policy never sets a cost/);
  rejected(state, weights, agent, /agent never approves weights/);
  rejected(state, weights, policy, /Weights come from a person/);
  rejected(state, { op: 'set-score', option: 'OPT-01', criterion: 'speed', value: 3, reason: 'Quick' }, agent, /criterion is one of nfr_fit/);
  rejected(state, { op: 'set-score', option: 'OPT-01', criterion: 'reversibility', value: 6, reason: 'Quick' }, agent, /whole number from 1 to 5/);
  rejected(state, { op: 'set-cost', option: 'OPT-09', cost: 'monthly', value: 1 }, person, /Unknown option "OPT-09"/);
  const scored = apply(state, [{ op: 'set-score', option: 'OPT-01', criterion: 'reversibility', value: 2, reason: 'Managed services tie the data tier to one provider' }], agent);
  assert.deepEqual(scored.options.list[0].scores, { reversibility: { value: 2, reason: 'Managed services tie the data tier to one provider', status: 'Estimated', by: 'E2E Architect', at: NOW } });
  rejected(scored, { op: 'confirm', option: 'OPT-01', criterion: 'reversibility' }, agent, /agent never confirms/);
  const done = apply(scored, [cost, weights, { op: 'confirm', option: 'OPT-01', cost: 'monthly' }, { op: 'confirm', option: 'OPT-01', criterion: 'reversibility' }], person, LATER);
  const [option] = done.options.list;
  assert.deepEqual(option.monthly, { value: 5000, status: 'Confirmed', by: 'Mahmoud', at: LATER });
  assert.deepEqual(option.scores.reversibility, { value: 2, reason: 'Managed services tie the data tier to one provider', status: 'Confirmed', by: 'Mahmoud', at: LATER });
  assert.deepEqual(done.options.weights, { values: { one_time_cost: 3, reversibility: 2 }, approved_by: 'Mahmoud', approved_at: LATER });
  rejected(done, { op: 'confirm', option: 'OPT-01', cost: 'monthly' }, policy, /answer policy never confirms a cost/);
});

test('applyPatch_everyOp_appliesAndRecordsHistory', () => {
  const state = everyOpState();
  assert.deepEqual([entry(state, 'REL-04.1').value, entry(state, 'REL-04.1').owner_name, entry(state, 'REL-04.1').due, entry(state, 'REL-04.1').priority], [60, 'Dana', '2026-11-15', 'Must']);
  assert.deepEqual(E.rowEntries(state, 'OVL-04').map((e) => [e.n, e.workload]), [[1, 'WL-01'], [2, 'WL-02']]);
  assert.deepEqual(E.rowEntries(state, 'CAP-07').map((e) => e.n), [1]);
  assert.deepEqual([entry(state, 'BUS-01.1').status, entry(state, 'BUS-01.1').value], ['Open', null]);
  assert.equal(entry(state, 'DAT-02.1').factors.storedKB.value, 2);
  assert.deepEqual(state.gate.checklist, {
    'G3-09': { status: 'N/A', na_reason: 'Greenfield: no existing estate', by: 'Mahmoud', at: NOW },
    'G3-01': { status: 'Done', na_reason: null, by: 'Mahmoud', at: NOW },
  });
  assert.deepEqual(state.gate.conditions, [{ id: 'COND-01', text: 'Load test before go-live', owner: 'SRE lead', due: '2026-12-01' }]);
  assert.deepEqual(state.gate.reopened, { at: NOW, by: 'E2E Architect', reason: 'Chunk 05 changed after review' });
  assert.deepEqual(state.gate.signoffs.map((s) => [s.role, s.name, s.stand_in]), [['business_sponsor', 'Mahmoud', false], ['migration_owner', 'Mahmoud', false], ['data_owner', STAND_IN, true]]);
  assert.equal(state.options.list[0].shape.data, 'relational, strongly consistent');
  assert.deepEqual([entry(state, 'SEC-01.1').status, state.history.at(-1).op, state.history.at(-1).target], ['Estimated', 'normalize', 'SEC-01.1']);
  assert.deepEqual(state.unknowns, [
    { id: 'QD-01', entry: 'REL-05.1', question: 'Which failure scope does the warm standby cover?', impact: 'DR strategy for the region scope', owner: 'Lead architect', due: '2026-11-01', status: 'open' },
    { id: 'QD-02', entry: null, question: 'Who owns the refund ledger?', impact: null, owner: null, due: null, status: 'closed', resolution: 'The finance team owns it', closed_by: 'Mahmoud', closed_at: NOW },
  ]);
  const ops = new Set(state.history.map((c) => c.op));
  assert.equal(engineOps().length, 38);
  assert.equal(state.options.horizon_months, 36);
  for (const op of [...engineOps(), 'normalize']) assert.ok(ops.has(op), op);
});

test('normalizeState_confirmedWithoutWho_downgradedWithAdvisory', () => {
  const state = apply(fresh(), [
    { op: 'set', entry: 'CAP-01.1', value: 864000 },
    { op: 'set', entry: 'REL-01.1', value: 99.9 },
    { op: 'confirm', entry: 'REL-01.1' },
    { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3 },
  ], person);
  const raw = JSON.parse(JSON.stringify(state));
  Object.assign(entry(raw, 'CAP-01.1'), { status: 'Confirmed', confirmed_by: null, confirmed_at: null });
  Object.assign(entry(raw, 'CAP-02.1').factors.callsPerTxn, { status: 'Confirmed', confirmed_by: 'Mahmoud', confirmed_at: 'yesterday' });
  const before = JSON.stringify(raw);
  const { state: normal, advisories } = E.normalizeState(raw, { now: LATER });
  assert.equal(JSON.stringify(raw), before);
  assert.deepEqual(advisories.map((a) => [a.id, a.entry, a.owner]), [['STATUS-CAP-01.1', 'CAP-01.1', 'B+E'], ['STATUS-CAP-02.1.callsPerTxn', 'CAP-02.1', 'B+E']]);
  for (const advisory of advisories) assert.match(advisory.msg, /Confirmed without who confirmed it and when/);
  assert.deepEqual([entry(normal, 'CAP-01.1').status, entry(normal, 'CAP-01.1').confirmed_by, entry(normal, 'CAP-01.1').confirmed_at], ['Estimated', null, null]);
  assert.deepEqual(entry(normal, 'CAP-02.1').factors.callsPerTxn, { value: 3, status: 'Estimated', source: { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' }, confirmed_by: null, confirmed_at: null });
  assert.deepEqual(entry(normal, 'REL-01.1'), entry(state, 'REL-01.1'));
  assert.deepEqual(normal.history.slice(-2).map((c) => [c.at, c.op, c.target, c.from, c.to]), [
    [LATER, 'normalize', 'CAP-01.1', { status: 'Confirmed', confirmed_by: null, confirmed_at: null }, { status: 'Estimated', confirmed_by: null, confirmed_at: null }],
    [LATER, 'normalize', 'CAP-02.1.callsPerTxn', { status: 'Confirmed', confirmed_by: 'Mahmoud', confirmed_at: null }, { status: 'Estimated', confirmed_by: null, confirmed_at: null }],
  ]);
  assert.deepEqual(E.normalizeState(normal, { now: LATER }).advisories, []);
  assert.deepEqual(E.normalizeState(state, { now: LATER }), { state, advisories: [] });
  assert.throws(() => E.normalizeState({ version: 2, inputs: {} }, { now: NOW }), /not a Pre-SDD 3\.0 project state/);
  assert.throws(() => E.normalizeState({ ...state, schema_version: '4.0.0' }, { now: NOW }), /4\.0\.0/);
});

test('sha256Hex_vectors_matchFips', () => {
  assert.equal(E.sha256Hex(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  assert.equal(E.sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(E.sha256Hex('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'), '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
});

test('sha256Hex_utf8AndBlockEdges_matchNodeCrypto', () => {
  const inputs = ['a', ...[55, 56, 57, 63, 64, 65, 119, 120, 127, 128, 1000].map((n) => 'x'.repeat(n)), 'Refunds × 5 → § 18.5', '\u{1F600} مرحبا', JSON.stringify(fresh())];
  for (const text of inputs) assert.equal(E.sha256Hex(text), createHash('sha256').update(text, 'utf8').digest('hex'), `${text.length} characters`);
  assert.doesNotMatch(readText(join(studioDir, 'src', 'engine.js')), /require\(|crypto\.|createHash|\.subtle/);
});

test('contentHash_uiOrSignoffChange_unchanged', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'REL-04.1', value: 60 }], person);
  const hash = E.contentHash(state);
  assert.match(hash, /^sha256:[0-9a-f]{64}$/);
  const signed = apply(state, [{ op: 'sign', role: 'business_sponsor', decision: 'Approved' }, { op: 'reopen', reason: 'Chunk 05 changed' }], person, LATER);
  signed.ui = { person: 'Dana', provider: 'aws', diagram: 'network', show_optional: true };
  Object.assign(signed.run, { mode: 'quick', input: 'web', light: true, stage: 3, group: 'CAP', policy: POLICY });
  signed.project.pre_sdd_version = '1.1';
  signed.engine_version = '3.0.1';
  assert.equal(E.contentHash(signed), hash);
  assert.equal(signed.gate.signoffs[0].content_hash, hash);
});

test('contentHash_entryChange_changes', () => {
  const state = fresh();
  const base = E.contentHash(state);
  const edited = (edit) => {
    const copy = JSON.parse(JSON.stringify(state));
    edit(copy);
    return copy;
  };
  const variants = [
    apply(state, [{ op: 'set', entry: 'REL-04.1', value: 60 }], person),
    apply(state, [{ op: 'set', entry: 'REL-04.1', window: 'per incident' }], person),
    apply(state, [{ op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3 }], person),
    apply(state, [{ op: 'add', row: 'REL-03' }], person),
    apply(state, [{ op: 'set-option', name: 'One region, multi-AZ' }], agent),
    apply(state, [{ op: 'check', id: 'G3-01', status: 'Done' }], person),
    apply(state, [{ op: 'add-condition', text: 'Load test before go-live' }], person),
    apply(state, [{ op: 'add-exception', entry: 'DAT-04.1', reason: 'Review booked', expires: '2026-12-31', review: '2026-12-15' }], person),
    edited((s) => { s.decisions.topology_override = 'multiAZ'; }),
    edited((s) => { s.unknowns.push({ id: 'QD-01', entry: null, question: 'Who owns the ledger?', impact: null, owner: null, due: null }); }),
    edited((s) => { s.project.name = 'Refunds'; }),
    edited((s) => { s.project.brds[0].version = '1.6'; }),
    edited((s) => { s.register.overlay.applies = true; }),
  ];
  const hashes = variants.map((variant) => E.contentHash(variant));
  for (const hash of hashes) assert.notEqual(hash, base);
  assert.equal(new Set(hashes).size, hashes.length);
});

test('contentHash_canonicalJson_sortedKeysNoSpaces', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'REL-04.1', value: 60, label: 'Ledger × 2' }], person);
  const canonical = (x) => (Array.isArray(x) ? `[${x.map(canonical).join(',')}]` : x && typeof x === 'object' ? `{${Object.keys(x).sort().map((k) => `${JSON.stringify(k)}:${canonical(x[k])}`).join(',')}}` : JSON.stringify(x));
  const { pre_sdd_version: dropped, ...project } = state.project;
  assert.equal(dropped, '1.0');
  const covered = { project, register: state.register, options: state.options, decisions: state.decisions, gate: { checklist: state.gate.checklist, conditions: state.gate.conditions, exceptions: state.gate.exceptions }, unknowns: state.unknowns };
  assert.equal(E.contentHash(state), `sha256:${createHash('sha256').update(canonical(covered), 'utf8').digest('hex')}`);
  const reversed = (x) => (Array.isArray(x) ? x.map(reversed) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).reverse().map((k) => [k, reversed(x[k])])) : x);
  assert.equal(E.contentHash(reversed(state)), E.contentHash(state));
});

test('saveFileName_slugAndNow_usesUtcStamp', () => {
  assert.equal(E.saveFileName('refunds-platform', '2026-10-23T11:01:02Z'), 'pre-sdd-refunds-platform-state-20261023T110102Z.json');
  assert.equal(E.saveFileName('refunds-platform', '2026-10-23T13:01:02.456+02:00'), 'pre-sdd-refunds-platform-state-20261023T110102Z.json');
  assert.equal(E.saveFileName('refunds-platform', '2026-10-24T00:30:00+03:00'), 'pre-sdd-refunds-platform-state-20261023T213000Z.json');
  assert.throws(() => E.saveFileName('refunds-platform', 'yesterday'), /ISO 8601/);
});

test('projectStateSchema_rowsAndKeys_matchCatalogue', () => {
  const schema = JSON.parse(readText(schemaPath));
  const { properties, $defs } = schema;
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.deepEqual([properties.kind.const, properties.schema_version.const], ['pre-sdd-project-state', E.STATE_SCHEMA_VERSION]);
  const register = properties.register.properties;
  const sections = [[register.header, E.HEADER_FIELDS], [register.items, E.ITEMS], [register.overlay.properties.rows, E.OVERLAY_FIELDS]];
  for (const [section, rows] of sections) {
    assert.deepEqual(Object.keys(section.properties), rows.map((row) => row.id));
    assert.deepEqual(section.required, rows.map((row) => row.id));
    for (const row of rows) {
      const want = row.valueType === 'number' ? { $ref: '#/$defs/numberEntries' } : row.valueType === 'text' ? { $ref: '#/$defs/textEntries' } : { type: 'array', minItems: 1, items: { $ref: '#/$defs/entry', properties: { value: { enum: [...row.enumValues, null] } } } };
      assert.deepEqual(section.properties[row.id], want, row.id);
    }
  }
  assert.deepEqual(Object.keys($defs.factors.properties), Object.keys(E.FACTORS));
  for (const [name, factor] of Object.entries($defs.factors.properties)) assert.deepEqual(factor, { $ref: E.numeric.has(name) ? '#/$defs/numberFactor' : '#/$defs/textFactor' }, name);
  assert.deepEqual($defs.signoffFields.properties.role.enum, E.SIGNOFF_ROLES.map((role) => role.key));
  assert.deepEqual(Object.keys(properties.gate.properties.checklist.properties), E.G3_CHECKLIST.map((line) => line.id));
  assert.deepEqual(Object.keys($defs.entryFields.properties), ENTRY_KEYS);
  assert.deepEqual($defs.entry.required, ENTRY_KEYS);
  const objects = [];
  const open = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach((child, i) => walk(child, `${path}/${i}`));
    if (!node || typeof node !== 'object') return;
    if (node.type === 'object') objects.push(path);
    if ((node.type === 'object' || node.properties) && node.additionalProperties !== false && !node.$ref) open.push(path);
    for (const [key, child] of Object.entries(node)) walk(child, `${path}/${key}`);
  };
  walk(schema, '#');
  assert.ok(objects.length > 30, `${objects.length} object schemas`);
  assert.deepEqual(open, []);
});

test('projectStateSchema_committedFile_isUpToDate', async () => {
  const { projectStateSchemaText } = await import('../tools/project-state-schema.mjs');
  assert.equal(projectStateSchemaText(), readText(schemaPath), 'project-state.schema.json is out of date: run node tools/project-state-schema.mjs');
});

test('projectStateSchema_opsAndCriteria_matchEngine', () => {
  const schema = JSON.parse(readText(schemaPath));
  assert.deepEqual(schema.$defs.change.properties.op.enum, [...engineOps(), 'normalize']);
  const option = apply(fresh(), [{ op: 'set-option', name: 'One region, multi-AZ' }], agent);
  const refused = E.applyPatch(option, [{ op: 'set-score', option: 'OPT-01', criterion: 'speed', value: 3, reason: 'Quick' }], agent, { now: NOW }).errors[0].message;
  const criteria = /criterion is one of (.+); got/.exec(refused)[1].split(', ');
  assert.equal(criteria.length, 8);
  assert.deepEqual(Object.keys(schema.$defs.scores.properties), criteria);
  assert.deepEqual(Object.keys(schema.$defs.weights.properties.values.properties), criteria);
  assert.deepEqual(schema.$defs.entryFields.properties.scope.enum, [...rowById('REL-05').enumValues, null]);
  assert.deepEqual(schema.properties.run.properties.group.enum, [...E.GROUP_ORDER, 'HDR', 'OVL', null]);
});

test('projectStateSchema_newState_validates', (t) => {
  const errors = checkSchema(t, fresh());
  if (errors) assert.deepEqual(errors, []);
});

test('projectStateSchema_everyOpState_validates', (t) => {
  const errors = checkSchema(t, everyOpState());
  if (errors) assert.deepEqual(errors, []);
});

test('projectStateSchema_invalidState_rejected', (t) => {
  const state = fresh();
  state.register.items['BUS-01'][0].status = 'Approved';
  state.register.items['REL-04'][0].value = 'sixty';
  state.register.items['CAP-01'][0].factors.turbo = { value: 2, status: 'Open', source: { type: 'none', text: '' }, confirmed_by: null, confirmed_at: null };
  state.run.policy = { label: 'test-run policy', set_by: 'Mahmoud', set_at: '2026-10-23 09:00', stand_ins: [] };
  state.extra = true;
  delete state.register.items['ECO-06'];
  const errors = checkSchema(t, state);
  if (!errors) return;
  const paths = errors.map((e) => e.path);
  for (const path of ['', 'register/items', 'register/items/BUS-01/0/status', 'register/items/REL-04/0/value', 'register/items/CAP-01/0/factors', 'run/policy']) assert.ok(paths.some((p) => p === path || p.startsWith(`${path}/`)), `${path} in ${JSON.stringify(paths)}`);
});
