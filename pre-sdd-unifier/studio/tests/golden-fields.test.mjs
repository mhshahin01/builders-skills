import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine, goldenCase, readText } from './helpers.mjs';

const E = loadEngine();
const NOW = '2026-10-23T11:01:02Z';
const OPTS = { now: NOW, name: 'Golden parity', slug: 'golden-parity' };
const AGENT = { type: 'agent', name: 'E2E Architect', label: '' };
const COUNTS = {
  'regional-zero': { calculations: 16, rules: 8, components: 37, connections: 36 },
  'local-zero': { calculations: 16, rules: 8, components: 32, connections: 30 },
  demo: { calculations: 16, rules: 5, components: 32, connections: 29 },
};
const CONFLICTS = { 'regional-zero': ['CONFLICT-rpo0'], 'local-zero': [], demo: [] };
const FULL = {
  solutionName: 'Refunds platform', brdRef: '', changeType: 'brownfield', target: 'hybrid',
  dailyTxn: 864000, peakFactor: 5, p99Ms: 300, annualGrowth: 20, availability: 99.95, failureScope: 'site', rtoSec: 900, rpoSec: 60,
  budget: 'tight', dataKind: 'document', dataConsistency: 'eventual', connectivity: 'partner', sensitiveData: 'sensitive',
  callsPerTxn: 3, requestFactor: 1.1, meanLatencyMs: 120, utilization: 0.65, requestKB: 4, responseKB: 16, networkOverhead: 1.2,
  storedKB: 2, retentionDays: 365, initialGB: 100, indexFactor: 1.4, copies: 2, cidrPrefix: 22,
  transactionNeed: 'yes', queryShape: 'document', readPercent: 70, tenantModel: 'shared', regionLabel: 'Frankfurt', recoveryLabel: 'Dublin', residency: 'yes',
  migration: 'yes', sourcePlatform: 'onprem', migrationGB: 2000, linkMbps: 150, cutoverHours: 4,
  businessProblem: 'Cut refund handling time to one day', evidenceRef: '', owner: '',
  topologyOverride: 'regional', drOverride: 'warm', overrideReason: 'Cost envelope agreed', approver: '',
  approveReqs: false, approveSecurity: false, approveArchitecture: false, approveRisks: false,
};
const FULL_EXTRAS = [
  { name: 'Reporting', kind: 'analytics', consistency: 'eventual' },
  { name: 'Archive', kind: 'document', consistency: 'strong' },
  { name: '', kind: 'unknown', consistency: 'unknown' },
];
const FULL_RECORD = { version: 2, inputs: FULL, statuses: {}, extraWorkloads: FULL_EXTRAS, history: [], provider: 'azure', showOptional: false };

function blueprintFields(bp) {
  const pattern = (id) => bp.architecture.patterns.find((p) => p.id === id)?.name ?? null;
  return {
    calculations: bp.calculations.map((c) => [c.id, c.output.value]),
    topology: pattern('PAT-TOPO-001'),
    dr: pattern('PAT-DR-001'),
    rules: bp.decisions.flatMap((d) => d.rule_ids),
    components: bp.architecture.components.map((n) => n.id),
    connections: bp.architecture.connections.map((e) => e.id),
  };
}

function computedFields(state) {
  const model = E.compute(state, { now: NOW });
  const graph = E.filteredGraph(model.graph, model.v, E.toCalcInputs(state).ctx);
  assert.deepEqual(model.c.rows.slice(20).map((r) => r.id), state.options.list.flatMap((o) => [`CALC-21@${o.id}`, `CALC-22@${o.id}`]), 'the option rows follow the 20 v2.2 rows');
  return {
    calculations: model.c.rows.slice(0, 20).filter((r) => E.known(r.result)).map((r) => [r.id, r.result]),
    topology: E.topoNames[model.a.topo],
    dr: E.drNames[model.a.dr],
    rules: model.rules.map((r) => r.id),
    components: graph.components.map((n) => `NODE-${n.id}`),
    connections: graph.connections.map((e) => `EDGE-${e.id}`),
  };
}

function sizes(fields) {
  return { calculations: fields.calculations.length, rules: fields.rules.length, components: fields.components.length, connections: fields.connections.length };
}

function tenantModel(value) {
  const map = E.V22_FIELD_MAP.fields.tenantModel.values;
  return Object.hasOwn(map, value) ? map[value] : value;
}

function renamed(id) {
  return Object.hasOwn(E.RULE_RENAMES, id) ? E.RULE_RENAMES[id] : id;
}

test('toCalcInputs_importedGolden_roundTripsV22Inputs', () => {
  const mapped = Object.keys(E.V22_FIELD_MAP.fields);
  assert.equal(mapped.length, 46);
  for (const name of Object.keys(COUNTS)) {
    const g = goldenCase(name);
    const inputs = g.projectState.inputs;
    const { v, ctx } = E.toCalcInputs(E.importV22(g.projectState, OPTS));
    const expected = { ...inputs, tenantModel: tenantModel(inputs.tenantModel) };
    for (const k of mapped) assert.deepEqual(v[k], expected[k], `${name}: ${k}`);
    assert.deepEqual(v, expected, name);
    assert.deepEqual([ctx.extras, ctx.provider, ctx.showOptional, ctx.scenario], [[], 'aws', false, 'blank'], name);
    assert.equal(Object.keys(g.projectState.statuses).length, 13, name);
    for (const [k, status] of Object.entries(g.projectState.statuses)) assert.equal(ctx.fieldStatus[k], status, `${name}: status of ${k}`);
    assert.deepEqual([ctx.fieldStatus.residency, ctx.fieldStatus.tenantModel, ctx.fieldStatus.cidrPrefix], ['open', 'open', 'open'], name);
  }
});

test('toCalcInputs_naConfirmedAndBrdKeys_mappedForV22', () => {
  const person = { type: 'person', name: 'Mahmoud', label: '' };
  const ops = [
    { op: 'confirm', entry: 'CAP-01.1' },
    { op: 'na', entry: 'DAT-04.1', reason: 'No residency rule applies' },
    { op: 'na', entry: 'REL-05.1', reason: 'The failure scope moves to a later phase' },
  ];
  const result = E.applyPatch(E.importV22(FULL_RECORD, OPTS), ops, person, { now: NOW });
  assert.deepEqual(result.errors, []);
  const { v, ctx } = E.toCalcInputs(result.state);
  assert.deepEqual([v.dailyTxn, ctx.fieldStatus.dailyTxn], [864000, 'confirmed']);
  assert.deepEqual([v.residency, ctx.fieldStatus.residency, v.regionLabel], ['unknown', 'open', 'Frankfurt']);
  assert.deepEqual([v.failureScope, ctx.fieldStatus.failureScope, v.drOverride], ['unknown', 'open', 'auto']);
  assert.deepEqual(result.state.decisions.dr_overrides, { site: 'warm' });
  const stale = structuredClone(result.state);
  Object.assign(E.primaryEntry(stale, 'CAP-04'), { status: 'Open' });
  assert.equal(E.primaryEntry(stale, 'CAP-04').value, 5);
  assert.deepEqual([E.toCalcInputs(stale).v.peakFactor, E.toCalcInputs(stale).ctx.fieldStatus.peakFactor], [null, 'open']);
  const brds =[{ key: 'REFUNDS', path: 'brd-refunds/master.md', version: '1.5' }, { key: 'RESELLER-PORTAL', path: 'brd-reseller/master.md', version: '2.0' }];
  assert.equal(E.toCalcInputs(E.newState({ ...OPTS, brds })).v.brdRef, 'REFUNDS, RESELLER-PORTAL');
  assert.equal(E.toCalcInputs(E.newState(OPTS)).v.brdRef, '');
});

test('toCalcInputs_importedFullRecord_roundTripsEveryMappedField', () => {
  const blanks = [null, '', 'unknown', 'auto', 'no'];
  for (const k of Object.keys(E.V22_FIELD_MAP.fields)) if (k !== 'brdRef') assert.ok(!blanks.includes(FULL[k]), `${k} is filled in the record`);
  const state = E.importV22(FULL_RECORD, OPTS);
  const { v, ctx } = E.toCalcInputs(state);
  assert.equal(E.primaryEntry(state, 'DAT-07').value, 'shared-logical');
  assert.deepEqual(v, { ...FULL, tenantModel: tenantModel(FULL.tenantModel) });
  assert.deepEqual(ctx.extras, FULL_EXTRAS);
  assert.deepEqual([ctx.provider, ctx.showOptional, ctx.scenario, ctx.decisionHistory], ['azure', false, 'blank', []]);
  const valueFields = Object.entries(E.V22_FIELD_MAP.fields).filter(([, t]) => t.row).map(([k]) => k);
  assert.deepEqual(Object.keys(ctx.fieldStatus).sort(), valueFields.sort());
  assert.ok(Object.values(ctx.fieldStatus).every((s) => s === 'estimated'));
  const dropped = Object.fromEntries(E.V22_FIELD_MAP.dropped.map((k) => [k, E.checkIDs.has(k) ? true : 'Given in v2.2']));
  assert.deepEqual(E.importV22({ ...FULL_RECORD, inputs: { ...FULL, ...dropped } }, OPTS), state);
});

test('compute_importedGolden_matchesV22ComputedFields', () => {
  assert.deepEqual(Object.keys(CONFLICTS), Object.keys(COUNTS));
  for (const [name, counts] of Object.entries(COUNTS)) {
    const g = goldenCase(name);
    const bp = JSON.parse(readText(g.file('architecture-blueprint.json')));
    const stored = blueprintFields(bp);
    assert.ok(stored.rules.includes('CAP-04'), `${name}: the golden holds the v2.2 rule ID CAP-04`);
    const want = { ...stored, rules: stored.rules.map(renamed) };
    assert.ok(want.rules.includes('LOAD-04') && !want.rules.some((id) => Object.hasOwn(E.RULE_RENAMES, id)), `${name}: renamed rule IDs`);
    assert.deepEqual(sizes(want), counts, `${name}: golden blueprint parse`);
    assert.equal(typeof want.topology, 'string', name);
    assert.equal(typeof want.dr, 'string', name);
    const state = E.importV22(g.projectState, OPTS);
    assert.deepEqual(computedFields(state), want, name);
    const optioned = E.applyPatch(state, [{ op: 'set-option', name: 'One region, multi-AZ' }, { op: 'set-option', name: 'Two regions, warm standby' }], AGENT, { now: NOW });
    assert.deepEqual(optioned.errors, [], name);
    assert.deepEqual(computedFields(optioned.state), want, `${name}: with options, the v2.2 rows come first and unchanged`);
    const golden = bp.conflicts.map((x) => x.id);
    assert.deepEqual(golden, CONFLICTS[name], `${name}: golden conflicts`);
    const suffix = `@${g.projectState.inputs.failureScope}`;
    const computed = E.compute(state, { now: NOW }).shape.conflicts.map((x) => x.id);
    assert.ok(computed.every((id) => id.endsWith(suffix)), `${name}: ${computed.join(', ')} end with ${suffix}`);
    assert.deepEqual(computed.map((id) => id.slice(0, -suffix.length)), golden, `${name}: conflicts`);
  }
});

test('compute_importedFullRecord_matchesV22Blueprint', () => {
  const ctx22 = { fieldStatus: {}, extras: FULL_EXTRAS, decisionHistory: [], scenario: 'blank', provider: 'logical', showOptional: false, now: NOW };
  const m = E.modelV22(FULL, ctx22);
  const want = blueprintFields(E.blueprint(m.v, m.c, m.a, m.rules, m.val, E.filteredGraph(m.graph, m.v, ctx22), ctx22));
  assert.deepEqual(sizes(want), { calculations: 20, rules: 9, components: 52, connections: 47 });
  assert.deepEqual([want.topology, want.dr], ['Primary + independent recovery location', 'Warm Standby']);
  assert.deepEqual(computedFields(E.importV22(FULL_RECORD, OPTS)), want);
});

test('compute_nowWithoutOffset_rejected', () => {
  const state = E.importV22(goldenCase('demo').projectState, OPTS);
  for (const now of ['2026-10-23T11:01:02', '2026-02-30T10:00:00Z', 'now', undefined]) {
    assert.throws(() => E.compute(state, { now }), { message: /now must be a Date, or an ISO 8601 timestamp with Z or an offset/ }, String(now));
  }
  assert.deepEqual(E.compute(state, { now: '2026-10-23T13:01:02+02:00' }), E.compute(state, { now: new Date(NOW) }));
});

test('compute_openFailureScope_unresolvedAndUndeterminedLikeV22', () => {
  const agent = { type: 'agent', name: 'E2E Architect', label: '' };
  const source = { type: 'brd', text: 'BRD: REFUNDS/NFR-04' };
  const result = E.applyPatch(E.newState(OPTS), [{ op: 'set', entry: 'REL-03.1', value: 600, source }, { op: 'set', entry: 'REL-04.1', value: 60, source }], agent, { now: NOW });
  assert.deepEqual(result.errors, []);
  assert.equal(E.primaryEntry(result.state, 'REL-05').status, 'Open');
  const model = E.compute(result.state, { now: NOW });
  assert.deepEqual([model.v.failureScope, model.v.rtoSec, model.v.rpoSec, model.v.availability], ['unknown', 600, 60, null]);
  const v22 = { ...E.defaults, rtoSec: 600, rpoSec: 60 };
  const a22 = E.selectArchitecture(v22, E.calculations(v22));
  assert.deepEqual([a22.dr, a22.topo], ['unresolved', 'undetermined']);
  assert.deepEqual([model.a.dr, model.a.topo], [a22.dr, a22.topo]);
});
