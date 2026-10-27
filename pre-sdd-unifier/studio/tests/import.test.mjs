import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, goldenCase, readText } from './helpers.mjs';
import { validateWithSchema } from './pyschema.mjs';

const E = loadEngine();
const schemaPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'schema', 'project-state.schema.json');
const NOW = '2026-10-23T11:01:02Z';
const OPTS = { now: NOW, name: 'Refunds platform', slug: 'refunds-platform' };
const GOLDENS = ['regional-zero', 'local-zero', 'demo'];
const IMPORTED = { type: 'import', text: 'Import: Studio v2.2' };
const IMPORT_AGENT = 'Studio v2.2 import';
const GOLDEN_VALUES = [
  'HDR-01.1', 'HDR-07.1', 'HDR-08.1', 'BUS-01.1', 'CAP-01.1', 'CAP-04.1', 'CAP-05.1', 'CAP-07.1',
  'REL-01.1', 'REL-03.1', 'REL-04.1', 'REL-05.1', 'DAT-03.1', 'DAT-05.1', 'INT-08.1',
  'CAP-02.1.callsPerTxn', 'CAP-02.1.requestFactor', 'CAP-04.1.utilization', 'CAP-06.1.requestKB', 'CAP-06.1.responseKB',
  'CAP-06.1.networkOverhead', 'CAP-07.1.meanLatencyMs', 'DAT-01.1.storeKind', 'DAT-02.1.storedKB', 'DAT-02.1.retentionDays',
  'DAT-02.1.initialGB', 'DAT-02.1.indexFactor', 'DAT-02.1.copies', 'ECO-01.1.budgetPressure',
];
const ADVICE = /re-export the ZIP from the Studio, or extract it and import project-state\.json/;
const DROPPED = 'Imported value dropped';

function holders(state) {
  const out = [];
  for (const rows of [state.register.header, state.register.items, state.register.overlay.rows]) {
    for (const [rowId, entries] of Object.entries(rows)) {
      for (const entry of entries) {
        const id = E.entryId(rowId, entry.n);
        out.push([id, entry]);
        for (const [name, factor] of Object.entries(entry.factors)) out.push([`${id}.${name}`, factor]);
      }
    }
  }
  return out;
}

function valued(state) {
  return holders(state).filter(([, held]) => held.status !== 'Open');
}

function entryOf(state, id) {
  const { rowId, n } = E.parseEntryId(id);
  return E.rowEntries(state, rowId).find((e) => e.n === n);
}

function factorOf(state, id, name) {
  return entryOf(state, id).factors[name];
}

function withInputs(name, changes) {
  const { projectState } = goldenCase(name);
  return { ...projectState, inputs: { ...projectState.inputs, ...changes } };
}

function goldenFiles(g) {
  return Object.fromEntries(g.manifest.files.map((path) => [path, readText(g.file(path))]));
}

async function zipBytes(files, ctx) {
  return new Uint8Array(await E.zipStored(files, ctx).arrayBuffer());
}

function withMethod(bytes, method) {
  const out = bytes.slice();
  const view = new DataView(out.buffer);
  view.setUint16(8, method, true);
  view.setUint16(view.getUint32(out.length - 6, true) + 10, method, true);
  return out;
}

function unknown(id, entry, question, impact) {
  return { id, entry, question, impact, owner: null, due: null, status: 'open' };
}

function dropped(state) {
  return state.unknowns.filter((u) => u.impact === DROPPED);
}

function droppedUnknown(id, entry, field, value, target, reason) {
  return unknown(id, entry, `The v2.2 file gives ${field} = ${value}, which ${target} does not accept (${reason}). What is the right value?`, DROPPED);
}

function v22Model(v, ctx) {
  const c = E.calculations(v), a = E.selectArchitecture(v, c);
  return { v, a, rules: E.decisionRules(v, c, a), graph: E.buildDiagrams(v, c, a, 'logical', ctx) };
}

test('importV22_goldenProjectState_everyValueEstimated', () => {
  for (const name of GOLDENS) {
    const state = E.importV22(goldenCase(name).projectState, OPTS);
    const set = valued(state);
    assert.deepEqual(set.map(([id]) => id).sort(), [...GOLDEN_VALUES].sort(), name);
    for (const [id, held] of set) {
      assert.equal(held.status, 'Estimated', `${name}: ${id}`);
      assert.deepEqual(held.source, IMPORTED, `${name}: ${id}`);
      assert.notEqual(held.value, null, `${name}: ${id}`);
      assert.equal(held.confirmed_by, null, `${name}: ${id}`);
      assert.equal(held.confirmed_at, null, `${name}: ${id}`);
    }
    for (const [id, held] of holders(state)) {
      if (held.status === 'Open') assert.deepEqual([held.value, held.source.type], [null, 'none'], `${name}: ${id}`);
    }
    assert.equal(state.history.length, GOLDEN_VALUES.length, name);
    assert.ok(state.history.every((r) => r.actor.type === 'agent' && r.actor.name === IMPORT_AGENT), name);
    assert.deepEqual([state.project.name, state.project.slug, state.project.brds], ['Refunds platform', 'refunds-platform', []], name);
  }
});

test('importV22_confirmedStatus_becomesEstimated', () => {
  const g = goldenCase('demo');
  const statuses = Object.fromEntries(Object.keys(g.projectState.statuses).map((k) => [k, 'confirmed']));
  assert.equal(Object.keys(statuses).length, 13);
  const state = E.importV22({ ...g.projectState, statuses }, OPTS);
  const cap01 = E.primaryEntry(state, 'CAP-01');
  assert.deepEqual([cap01.value, cap01.status, cap01.confirmed_by, cap01.confirmed_at], [1000000, 'Estimated', null, null]);
  assert.equal(valued(state).length, GOLDEN_VALUES.length);
  assert.deepEqual(valued(state).filter(([, held]) => held.status !== 'Estimated'), []);
});

test('importV22_saveWrapper_readsProjectState', () => {
  for (const name of GOLDENS) {
    const g = goldenCase(name);
    const save = { project_state: g.projectState, blueprint: JSON.parse(readText(g.file('architecture-blueprint.json'))) };
    const state = E.importV22(save, OPTS);
    assert.equal(E.primaryEntry(state, 'REL-03').value, g.projectState.inputs.rtoSec, name);
    assert.deepEqual(state, E.importV22(g.projectState, OPTS), name);
  }
});

test('importV22_blueprintJson_throwsActionableError', () => {
  const blueprint = JSON.parse(readText(goldenCase('demo').file('architecture-blueprint.json')));
  assert.throws(() => E.importV22(blueprint, OPTS), (error) => {
    assert.match(error.message, /architecture-blueprint\.json/);
    assert.match(error.message, /project-state\.json/);
    assert.match(error.message, /save file/);
    return true;
  });
});

test('readStoredZip_zipStoredOfGoldenFiles_returnsSameTexts', async () => {
  for (const name of GOLDENS) {
    const g = goldenCase(name);
    const files = goldenFiles(g);
    assert.equal(Object.keys(files).length, 13, name);
    assert.deepEqual(E.readStoredZip(await zipBytes(files, g.ctx)), files, name);
  }
});

test('readStoredZip_deflatedEntry_throwsActionableError', async () => {
  const g = goldenCase('demo');
  const stored = await zipBytes({ 'project-state.json': readText(g.file('project-state.json')) }, g.ctx);
  assert.deepEqual(Object.keys(E.readStoredZip(stored)), ['project-state.json']);
  const deflated = withMethod(stored, 8);
  assert.throws(() => E.readStoredZip(deflated), { message: ADVICE });
  assert.throws(() => E.importV22(deflated, OPTS), { message: ADVICE });
});

test('readStoredZip_damagedEntry_throwsCrcError', async () => {
  const g = goldenCase('demo');
  const name = 'project-state.json';
  const text = readText(g.file(name));
  const bytes = await zipBytes({ [name]: text }, g.ctx);
  assert.equal(E.readStoredZip(bytes)[name], text);
  const damaged = bytes.slice();
  damaged[30 + name.length] ^= 1;
  assert.throws(() => E.readStoredZip(damaged), { message: /CRC/ });
});

test('importV22_zipBytes_readsProjectState', async () => {
  for (const name of GOLDENS) {
    const g = goldenCase(name);
    const bytes = await zipBytes(goldenFiles(g), g.ctx);
    const direct = E.importV22(g.projectState, OPTS);
    assert.equal(E.primaryEntry(direct, 'CAP-01').value, g.projectState.inputs.dailyTxn, name);
    assert.deepEqual(E.importV22(bytes, OPTS), direct, name);
    assert.deepEqual(E.importV22(bytes.buffer, OPTS), direct, name);
  }
  const g = goldenCase('demo');
  const noState = await zipBytes({ 'Pre-SDD.md': readText(g.file('Pre-SDD.md')) }, g.ctx);
  assert.throws(() => E.importV22(noState, OPTS), { message: /no project-state\.json/ });
});

test('importV22_invalidNumber_staysOpen', () => {
  const state = E.importV22(withInputs('demo', { utilization: 1.5, availability: 0, cidrPrefix: 15, dailyTxn: '1000000', rpoSec: 0 }), OPTS);
  for (const held of [factorOf(state, 'CAP-04.1', 'utilization'), factorOf(state, 'INT-08.1', 'cidrPrefix'), E.primaryEntry(state, 'REL-01'), E.primaryEntry(state, 'CAP-01')]) {
    assert.deepEqual([held.value, held.status], [null, 'Open']);
  }
  const rpo = E.primaryEntry(state, 'REL-04');
  assert.deepEqual([rpo.value, rpo.status], [0, 'Estimated']);
  assert.equal(valued(state).length, GOLDEN_VALUES.length - 3);
  assert.deepEqual(state.unknowns, [
    droppedUnknown('QD-01', 'CAP-01.1', 'dailyTxn', '"1000000"', 'CAP-01', 'not a number'),
    droppedUnknown('QD-02', 'REL-01.1', 'availability', '0', 'REL-01', 'not above 0'),
    droppedUnknown('QD-03', 'CAP-04.1', 'utilization', '1.5', 'CAP-04', 'above 1'),
    droppedUnknown('QD-04', 'INT-08.1', 'cidrPrefix', '15', 'INT-08', 'outside 16 to 28'),
  ]);
});

test('importV22_invalidNumber_raisesOneDroppedValueUnknown', () => {
  const state = E.importV22(withInputs('demo', { utilization: 1.5 }), OPTS);
  assert.deepEqual(state.unknowns, [droppedUnknown('QD-01', 'CAP-04.1', 'utilization', '1.5', 'CAP-04', 'above 1')]);
  assert.equal(factorOf(state, 'CAP-04.1', 'utilization').status, 'Open');
  assert.equal(valued(state).length, GOLDEN_VALUES.length - 1);
});

test('importV22_outOfEnumSelect_raisesOneDroppedValueUnknown', () => {
  const state = E.importV22(withInputs('demo', { failureScope: 'regional' }), OPTS);
  assert.deepEqual(state.unknowns, [
    droppedUnknown('QD-01', 'REL-05.1', 'failureScope', '"regional"', 'REL-05', 'not one of host, az, site, region, provider, cyber'),
  ]);
  assert.equal(E.primaryEntry(state, 'REL-05').status, 'Open');
  const tenant = E.importV22(withInputs('demo', { tenantModel: 'pooled' }), OPTS);
  assert.deepEqual(tenant.unknowns, [droppedUnknown('QD-01', 'DAT-07.1', 'tenantModel', '"pooled"', 'DAT-07', 'not one of shared, isolated, single')]);
});

test('importV22_goldens_noDroppedValueUnknowns', () => {
  for (const name of GOLDENS) {
    const state = E.importV22(goldenCase(name).projectState, OPTS);
    assert.deepEqual(dropped(state), [], name);
    assert.deepEqual(state.unknowns, [], name);
  }
});

test('importV22_numericFields_unknownExactlyWhenClFails', () => {
  const samples = [null, '', '  ', -150, -100, -1, -0.5, 0, 0.5, 1, 2, 15, 16, 20.5, 28, 29, 100, 101, '12', true, NaN, Infinity];
  const isBlank = (x) => x === null || (typeof x === 'string' && !x.trim());
  let drops = 0;
  for (const k of E.numIds) {
    const target = E.V22_FIELD_MAP.fields[k];
    const id = E.entryId(target.row, 1);
    for (const x of samples) {
      const state = E.importV22({ inputs: { [k]: x } }, OPTS);
      const held = target.factor ? factorOf(state, id, target.factor) : entryOf(state, id);
      const fails = !isBlank(x) && E.cl({ [k]: x }, k) === null;
      assert.equal(dropped(state).length, fails ? 1 : 0, `${k} = ${JSON.stringify(x)}`);
      assert.equal(held.status, isBlank(x) || fails ? 'Open' : 'Estimated', `${k} = ${JSON.stringify(x)}`);
      if (fails) {
        drops++;
        assert.equal(dropped(state)[0].entry, id);
        assert.ok(dropped(state)[0].question.startsWith(`The v2.2 file gives ${k} = ${typeof x === 'number' ? x : JSON.stringify(x)}, which ${target.row} does not accept (`), `${k} = ${JSON.stringify(x)}`);
      }
    }
  }
  assert.ok(drops > 100, `${drops} drops`);
  const reasons = [
    ['peakFactor', 0.5, 'below 1'], ['callsPerTxn', 0, 'not above 0'], ['utilization', 2, 'above 1'], ['availability', 101, 'above 100'],
    ['annualGrowth', -100, 'not above -100'], ['cidrPrefix', 20.5, 'not a whole number'], ['cidrPrefix', 29, 'outside 16 to 28'],
    ['readPercent', 101, 'above 100'], ['readPercent', -1, 'below 0'], ['dailyTxn', -1, 'below 0'], ['rtoSec', true, 'not a number'],
  ];
  for (const [k, x, reason] of reasons) assert.ok(dropped(E.importV22({ inputs: { [k]: x } }, OPTS))[0].question.includes(`(${reason})`), `${k} = ${x}`);
});

test('importV22_drOverrideWithScope_keyedByScope', () => {
  const record = withInputs('regional-zero', { topologyOverride: 'regional', drOverride: 'warm', overrideReason: '  Cost envelope agreed  ' });
  const state = E.importV22(record, OPTS);
  assert.equal(E.primaryEntry(state, 'REL-05').value, 'region');
  assert.deepEqual(state.decisions, { topology_override: 'regional', dr_overrides: { region: 'warm' }, override_reason: 'Cost envelope agreed', chosen_option: null });
  assert.deepEqual(state.unknowns, []);
  const { v } = E.toCalcInputs(state);
  assert.deepEqual([v.topologyOverride, v.drOverride, v.overrideReason], ['regional', 'warm', 'Cost envelope agreed']);
  const model = E.compute(state, { now: NOW });
  const v22 = v22Model(record.inputs, goldenCase('regional-zero').ctx);
  assert.deepEqual([model.a.topo, model.a.dr], ['regional', 'warm']);
  assert.deepEqual([model.a.topo, model.a.dr], [v22.a.topo, v22.a.dr]);
  assert.deepEqual(model.rules.map((r) => r.id), v22.rules.map((r) => r.id));
  const invalid = E.importV22(withInputs('regional-zero', { topologyOverride: 'undetermined', drOverride: 'localHA', overrideReason: 7 }), OPTS);
  assert.deepEqual(invalid.decisions, { topology_override: 'auto', dr_overrides: {}, override_reason: '', chosen_option: null });
  assert.deepEqual(invalid.unknowns, [
    droppedUnknown('QD-01', null, 'topologyOverride', '"undetermined"', 'decisions.topology_override', 'not one of auto, single, multiAZ, multiAZActive, regional, active'),
    droppedUnknown('QD-02', null, 'drOverride', '"localHA"', 'decisions.dr_overrides', 'not one of backup, pilot, warm, active'),
    droppedUnknown('QD-03', null, 'overrideReason', '7', 'decisions.override_reason', 'not text'),
  ]);
});

test('importV22_drOverrideWithoutScope_raisesUnknown', () => {
  const state = E.importV22(withInputs('regional-zero', { failureScope: 'unknown', drOverride: 'pilot' }), OPTS);
  assert.equal(E.primaryEntry(state, 'REL-05').status, 'Open');
  assert.deepEqual(state.decisions.dr_overrides, {});
  assert.deepEqual(state.unknowns, [
    unknown('QD-01', 'REL-05.1', 'The v2.2 file sets the DR strategy override to pilot but gives no failure scope. Which REL-05 scope does it apply to?', 'DR strategy for that scope'),
  ]);
  assert.equal(E.toCalcInputs(state).v.drOverride, 'auto');
});

test('importV22_brdRef_raisesUnknownWithoutBrdRecord', () => {
  const state = E.importV22(withInputs('demo', { brdRef: '  brd-refunds-portal/refunds-portal-brd-master.md v1.5  ', failureScope: 'unknown', drOverride: 'warm' }), OPTS);
  assert.deepEqual(state.project.brds, []);
  assert.deepEqual(state.unknowns, [
    unknown('QD-01', null, 'The v2.2 file gives the BRD reference brd-refunds-portal/refunds-portal-brd-master.md v1.5. Which BRD key, master file path and version does it name?', 'Source BRD traceability'),
    unknown('QD-02', 'REL-05.1', 'The v2.2 file sets the DR strategy override to warm but gives no failure scope. Which REL-05 scope does it apply to?', 'DR strategy for that scope'),
  ]);
  assert.equal(E.toCalcInputs(state).v.brdRef, '');
  assert.deepEqual(E.importV22(goldenCase('demo').projectState, OPTS).unknowns, []);
});

test('importV22_extraWorkloads_landOnDat01AndDat05', () => {
  const extras = [
    { name: 'Reporting', kind: 'analytics', consistency: 'eventual' },
    { name: 'Archive', kind: 'document', consistency: 'strong' },
    { name: '', kind: 'unknown', consistency: 'unknown' },
  ];
  const state = E.importV22({ ...goldenCase('demo').projectState, extraWorkloads: extras }, OPTS);
  assert.deepEqual(E.rowEntries(state, 'DAT-01').map((e) => [e.n, e.label]), [[1, null], [2, 'Reporting'], [3, 'Archive'], [4, null]]);
  assert.deepEqual(E.rowEntries(state, 'DAT-05').map((e) => [e.n, e.label, e.value, e.status]), [
    [1, null, 'strong', 'Estimated'], [2, 'Reporting', 'eventual', 'Estimated'], [3, 'Archive', 'strong', 'Estimated'], [4, null, null, 'Open'],
  ]);
  assert.deepEqual(['DAT-01.2', 'DAT-01.3', 'DAT-01.4'].map((id) => [factorOf(state, id, 'storeKind').value, factorOf(state, id, 'storeKind').status]), [
    ['analytics', 'Estimated'], ['document', 'Estimated'], [null, 'Open'],
  ]);
  assert.deepEqual(factorOf(state, 'DAT-01.2', 'storeKind').source, IMPORTED);
  assert.deepEqual(entryOf(state, 'DAT-05.3').source, IMPORTED);
  assert.deepEqual(E.toCalcInputs(state).ctx.extras, extras);
  assert.deepEqual(state.unknowns, []);
  const bad = E.importV22({ ...goldenCase('demo').projectState, extraWorkloads: [{ name: 'Reporting', kind: 7, consistency: 'strongish' }, { name: 3, kind: 'analytics', consistency: 'strong' }] }, OPTS);
  assert.deepEqual(bad.unknowns, [
    droppedUnknown('QD-01', 'DAT-01.2', 'extraWorkloads[0].kind', '7', 'DAT-01', 'not text'),
    droppedUnknown('QD-02', 'DAT-05.2', 'extraWorkloads[0].consistency', '"strongish"', 'DAT-05', 'not one of strong, mixed, eventual'),
    droppedUnknown('QD-03', 'DAT-01.3', 'extraWorkloads[1].name', '3', 'DAT-01', 'not text'),
  ]);
  assert.deepEqual([entryOf(bad, 'DAT-05.2').status, factorOf(bad, 'DAT-01.2', 'storeKind').status, entryOf(bad, 'DAT-01.3').label], ['Open', 'Open', null]);
});

test('importV22_showOptionalTrue_graphMatchesV22FilteredGraph', () => {
  const all = ['infrastructure', 'network', 'dr', 'data', 'security', 'integration', 'deployment'];
  for (const name of GOLDENS) {
    const g = goldenCase(name);
    assert.equal(E.importV22(g.projectState, OPTS).ui.show_optional, false, name);
    const state = E.importV22({ ...g.projectState, showOptional: true }, OPTS);
    assert.equal(state.ui.show_optional, true, name);
    const model = E.compute(state, { now: NOW });
    const got = E.filteredGraph(model.graph, model.v, E.toCalcInputs(state).ctx);
    const ctx22 = { ...g.ctx, showOptional: true };
    const v22 = v22Model(g.projectState.inputs, ctx22);
    const want = E.filteredGraph(v22.graph, v22.v, ctx22);
    const shown = JSON.parse(readText(g.file('architecture-blueprint.json'))).architecture.components.length;
    assert.deepEqual(Object.keys(want.diagrams), all, name);
    assert.ok(want.components.length > shown, `${name}: showOptional adds components`);
    assert.deepEqual(Object.keys(got.diagrams), all, name);
    assert.deepEqual(got.components.map((n) => n.id), want.components.map((n) => n.id), name);
    assert.deepEqual(got.connections.map((e) => e.id), want.connections.map((e) => e.id), name);
    assert.deepEqual(got, want, name);
  }
});

test('importV22_nowWithoutOffset_rejected', () => {
  const g = goldenCase('demo');
  const nowRule = /now must be a Date, or an ISO 8601 timestamp with Z or an offset/;
  for (const now of ['2026-10-23T11:01:02', '2026-10-23', 'yesterday', undefined]) {
    assert.throws(() => E.importV22(g.projectState, { ...OPTS, now }), { message: nowRule }, String(now));
  }
  assert.throws(() => E.importV22(undefined, { ...OPTS, now: '2026-10-23T11:01:02' }), { message: nowRule });
  const offset = E.importV22(g.projectState, { ...OPTS, now: '2026-10-23T13:01:02+02:00' });
  assert.ok(offset.history.every((r) => r.at === '2026-10-23T11:01:02Z'));
  assert.deepEqual(E.importV22(g.projectState, { ...OPTS, now: new Date(NOW) }), E.importV22(g.projectState, OPTS));
});

test('importV22_provider_keptOnlyWhenSchemaAllows', () => {
  const allowed = JSON.parse(readText(schemaPath)).properties.ui.properties.provider.enum;
  assert.equal(allowed.length, 5);
  const g = goldenCase('demo');
  assert.equal(E.importV22(g.projectState, OPTS).ui.provider, 'aws');
  for (const provider of allowed) assert.equal(E.importV22({ ...g.projectState, provider }, OPTS).ui.provider, provider);
  for (const provider of ['comparison', 'AWS', 'toString', '', null, 7]) {
    assert.equal(E.importV22({ ...g.projectState, provider }, OPTS).ui.provider, 'logical', String(provider));
  }
  const { provider, ...withoutProvider } = g.projectState;
  assert.equal(provider, 'aws');
  assert.equal(E.importV22(withoutProvider, OPTS).ui.provider, 'logical');
});

test('importV22_pathValues_matchSchemaEnums', () => {
  const schema = JSON.parse(readText(schemaPath)).properties;
  const sources = schema.register.properties.overlay.properties.source.enum;
  const topologies = schema.decisions.properties.topology_override.enum;
  const strategies = schema.decisions.properties.dr_overrides.properties.az.enum;
  assert.deepEqual([sources.length, topologies.length, strategies.length], [5, 6, 4]);
  for (const source of [...sources, 'cloud']) {
    const state = E.importV22(withInputs('demo', { migration: 'yes', sourcePlatform: source }), OPTS);
    assert.equal(state.register.overlay.source, sources.includes(source) ? source : 'unknown', source);
    assert.equal(dropped(state).length, sources.includes(source) ? 0 : 1, source);
  }
  for (const topology of [...topologies, 'undetermined']) {
    const state = E.importV22(withInputs('demo', { topologyOverride: topology }), OPTS);
    assert.equal(state.decisions.topology_override, topologies.includes(topology) ? topology : 'auto', topology);
    assert.equal(dropped(state).length, topologies.includes(topology) ? 0 : 1, topology);
  }
  for (const strategy of [...strategies, 'localHA']) {
    const state = E.importV22(withInputs('demo', { drOverride: strategy }), OPTS);
    assert.deepEqual(state.decisions.dr_overrides, strategies.includes(strategy) ? { az: strategy } : {}, strategy);
    assert.equal(dropped(state).length, strategies.includes(strategy) ? 0 : 1, strategy);
  }
  const migration = E.importV22(withInputs('demo', { migration: 'maybe' }), OPTS);
  assert.deepEqual([migration.register.overlay.applies, migration.unknowns], [false, [droppedUnknown('QD-01', null, 'migration', '"maybe"', 'register.overlay.applies', 'not one of yes, no')]]);
});

test('importV22_importedState_validatesAgainstSchema', (t) => {
  const g = goldenCase('demo');
  const record = {
    ...g.projectState,
    provider: 'azure',
    showOptional: true,
    extraWorkloads: [{ name: 'Reporting', kind: 'analytics', consistency: 'strongish' }],
    inputs: {
      ...g.projectState.inputs, brdRef: 'REFUNDS', failureScope: 'unknown', topologyOverride: 'regional', drOverride: 'warm', utilization: 2,
      overrideReason: 'Cost envelope agreed', migration: 'yes', sourcePlatform: 'cloud', migrationGB: 2000, linkMbps: 150, cutoverHours: 4,
      tenantModel: 'isolated', residency: 'yes', regionLabel: 'Frankfurt', recoveryLabel: 'Dublin', cidrPrefix: 22, readPercent: 70,
    },
  };
  const state = E.importV22(record, OPTS);
  assert.deepEqual(state.unknowns.map((u) => [u.id, u.entry, u.impact]), [
    ['QD-01', null, 'Source BRD traceability'], ['QD-02', 'CAP-04.1', DROPPED], ['QD-03', null, DROPPED],
    ['QD-04', 'REL-05.1', 'DR strategy for that scope'], ['QD-05', 'DAT-05.2', DROPPED],
  ]);
  assert.deepEqual([state.register.overlay.applies, state.register.overlay.source, state.ui.provider, state.ui.show_optional], [true, 'unknown', 'azure', true]);
  assert.equal(E.primaryEntry(state, 'DAT-07').value, 'database-isolated');
  const result = validateWithSchema(schemaPath, state);
  if (result.skipped) {
    t.skip(result.skipped);
    return;
  }
  assert.deepEqual(result.errors, []);
});
