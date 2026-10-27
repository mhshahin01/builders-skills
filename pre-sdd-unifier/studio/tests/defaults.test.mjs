import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, readText } from './helpers.mjs';
import { validateWithSchema } from './pyschema.mjs';

const E = loadEngine();
const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const appendixPath = join(studioDir, '..', 'reference', 'policy-appendix.md');
const schemaPath = join(studioDir, 'schema', 'project-state.schema.json');
const NOW = '2026-10-23T11:01:02Z';
const LATER = '2026-10-24T08:30:00Z';
const APPROVED = { version: '1', approved_by: 'Mahmoud (owner)', approved_at: '2026-10-23', values: { utilization: 0.65, networkOverhead: 1.2, indexFactor: 1.4, copies: 2, meanLatencyMs: 120, callsPerTxn: 3, requestFactor: 1.1 } };
const person = { type: 'person', name: 'Mahmoud', label: '' };
const agent = { type: 'agent', name: 'E2E Architect', label: '' };
const policy = { type: 'policy', name: 'test-run policy', label: 'test-run policy' };
const ENGINE = { type: 'agent', name: 'pre-sdd-engine', label: 'pre-sdd-engine' };
const APPENDIX_SOURCE = { type: 'default', text: 'Default: policy appendix v1' };
const CAP02_SOURCE = { type: 'derived', text: 'Derived: CALC-03 from CAP-01, CAP-04, CAP-02' };
const DAT02_SOURCE = { type: 'derived', text: 'Derived: CALC-10 from CAP-01, DAT-02' };
const NO_SOURCE = { type: 'none', text: '' };
const PROJECT_DEFAULT = 'Decision 11: project default';
const LEFT_OPEN = { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23 (left open)' };
const OLD_APPENDIX = { type: 'default', text: 'Default: policy appendix v0' };
const FACTOR_HEADER = ['Factor', 'Key', 'Default', 'Unit'];
const RULE_HEADER = ['Row', 'Default', 'When'];
const allRows = [...E.HEADER_FIELDS, ...E.ITEMS, ...E.OVERLAY_FIELDS];
const rowById = (id) => allRows.find((row) => row.id === id);
const factorEntry = (name) => `${E.FACTORS[name].row}.1`;
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} is not within 1e-9 of ${expected}`);

const fresh = () => E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW });

function apply(state, ops, actor, now = NOW) {
  const result = E.applyPatch(state, ops, actor, { now });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

function entry(state, id) {
  const { rowId, n } = E.parseEntryId(id);
  return E.rowEntries(state, rowId).find((e) => e.n === n);
}

function calc(state, id) {
  return E.compute(state, { now: NOW }).c.rows.find((row) => row.id === id);
}

function defaulted(state = fresh()) {
  return E.applyDefaults(state, { now: NOW }).state;
}

function sized(extra = []) {
  return apply(defaulted(), [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'CAP-04.1', value: 5 }, ...extra], person);
}

function tables(text) {
  const blocks = [];
  let block = null;
  for (const line of text.split('\n')) {
    if (line.trimStart().startsWith('|')) {
      if (!block) blocks.push((block = []));
      block.push(line.trim());
    } else block = null;
  }
  return blocks;
}

const cells = (line) => line.replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());

function tableRows(text, header) {
  const found = tables(text).filter((block) => JSON.stringify(cells(block[0])) === JSON.stringify(header));
  assert.equal(found.length, 1, `one table with the header ${header.join(', ')}`);
  const [, separator, ...rows] = found[0];
  assert.deepEqual(cells(separator).map((cell) => /^:?-{3,}:?$/.test(cell)), header.map(() => true));
  return rows.map(cells);
}

test('APPENDIX_values_matchPolicyAppendixFile', () => {
  assert.deepEqual(E.APPENDIX, APPROVED);
  const text = readText(appendixPath);
  assert.equal(tables(text).length, 2, 'policy-appendix.md holds the factor table and the project-rule table');
  const rows = tableRows(text, FACTOR_HEADER);
  assert.equal(rows.length, 7, 'the table holds the seven factors');
  const parsed = rows.map(([factor, key, value, unit]) => ({ factor, key: key.replace(/^`(.*)`$/, '$1'), value, unit }));
  assert.deepEqual(parsed.map((row) => row.key), Object.keys(E.APPENDIX.values));
  for (const row of parsed) {
    assert.match(row.value, /^\d+(\.\d+)?$/, row.key);
    assert.equal(Number(row.value), E.APPENDIX.values[row.key], row.key);
    assert.equal(row.unit, E.units[row.key], row.key);
    assert.ok(row.factor.length > 0, row.key);
  }
  assert.match(text, new RegExp(`^Version: ${E.APPENDIX.version}$`, 'm'));
  assert.ok(text.includes(`Approved by ${E.APPENDIX.approved_by} on ${E.APPENDIX.approved_at} (UTC)`), 'approval line');
  assert.ok(text.includes('separately approved policy appendix'), 'purpose cites the Standard');
  assert.ok(text.includes(`Default: policy appendix v${E.APPENDIX.version}`), 'pre-fill source');
  assert.doesNotMatch(text, /[\u2013\u2014]/);
  assert.doesNotMatch(text, /<!--/);
});

test('APPENDIX_keys_drivePolicyRuleOnFactRows', () => {
  const keys = Object.keys(E.APPENDIX.values);
  const onFactRows = Object.keys(E.FACTORS).filter((name) => rowById(E.FACTORS[name].row).factOnly);
  assert.ok(onFactRows.some((name) => keys.includes(name)) && onFactRows.some((name) => !keys.includes(name)));
  const withPolicy = apply(fresh(), [{ op: 'set-policy', policy: { label: 'test-run policy', stand_ins: [] } }], person);
  for (const name of onFactRows) {
    const value = keys.includes(name) ? E.APPENDIX.values[name] : E.numeric.has(name) ? 2 : 'simple';
    const result = E.applyPatch(withPolicy, [{ op: 'set-factor', entry: factorEntry(name), factor: name, value }], policy, { now: NOW });
    const expected = keys.includes(name) ? [] : [`${name} on ${E.FACTORS[name].row} is a fact only a person gives; on a fact row an answer policy takes only the policy appendix factors (${keys.join(', ')}).`];
    assert.deepEqual(result.errors.map((e) => e.message), expected, name);
  }
});

test('policyAppendix_projectRuleTable_matchesEngineDefaults', () => {
  const text = readText(appendixPath);
  const rows = tableRows(text, RULE_HEADER);
  assert.equal(rows.length, 3, 'the project-rule table holds three rows');
  const code = (cell) => [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  const ops04For = (scope) => entry(E.applyDefaults(apply(fresh(), [{ op: 'set', entry: 'REL-05.1', value: scope }], person), { now: NOW }).state, 'OPS-04.1').value;
  const drScopes = rowById('REL-05').enumValues.filter((scope) => ops04For(scope).endsWith(', dr'));
  const plain = E.applyDefaults(fresh(), { now: NOW }).state;
  assert.deepEqual(drScopes, ['site', 'region', 'provider']);
  assert.deepEqual(rows.map(([row, value]) => [row, code(value)]), [
    ['OPS-04', [entry(plain, 'OPS-04.1').value]],
    ['OPS-04', [ops04For('region')]],
    ['CAP-08', [entry(plain, 'CAP-08.1').value]],
  ]);
  assert.deepEqual([code(rows[0][2]), code(rows[1][2]), rows[2][2]], [drScopes, drScopes, 'Always']);
  assert.match(rows[0][2], /^No REL-05 entry holds /);
  assert.match(rows[1][2], /^A REL-05 entry holds /);
  assert.ok(text.includes('Approved with the build plan by Mahmoud (owner) on 2026-10-23 (UTC)'), 'approval line');
  for (const id of ['OPS-04.1', 'CAP-08.1']) assert.ok(text.includes(entry(plain, id).source.text), id);
});

test('applyDefaults_newState_fillsSevenFactorsEstimated', () => {
  const state = fresh();
  const before = JSON.stringify(state);
  const { state: after, changes } = E.applyDefaults(state, { now: NOW });
  assert.equal(JSON.stringify(state), before);
  const names = Object.keys(E.APPENDIX.values);
  assert.equal(names.length, 7);
  for (const name of names) assert.deepEqual(entry(after, factorEntry(name)).factors[name], { value: E.APPENDIX.values[name], status: 'Estimated', source: APPENDIX_SOURCE, confirmed_by: null, confirmed_at: null }, name);
  const factorChanges = changes.filter((c) => c.op === 'set-factor');
  assert.deepEqual(factorChanges.map((c) => c.target), names.map((name) => `${factorEntry(name)}.${name}`));
  for (const c of factorChanges) assert.deepEqual([c.at, c.actor, c.reason, c.to.status], [NOW, ENGINE, null, 'Estimated'], c.target);
  for (const name of Object.keys(E.FACTORS).filter((other) => !names.includes(other))) assert.equal(entry(after, factorEntry(name)).factors[name].status, 'Open', name);
  assert.deepEqual(after.history, changes);
  assert.deepEqual(E.applyDefaults(after, { now: LATER }).changes, []);
});

test('applyDefaults_confirmedFactor_untouched', () => {
  const answered = apply(fresh(), [{ op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 0.7 }], person);
  const state = apply(answered, [{ op: 'confirm', entry: 'CAP-04.1', factor: 'utilization' }], person);
  const held = entry(state, 'CAP-04.1').factors.utilization;
  assert.deepEqual([held.value, held.status, held.confirmed_by], [0.7, 'Confirmed', 'Mahmoud']);
  const { state: after, changes } = E.applyDefaults(state, { now: LATER });
  assert.deepEqual(entry(after, 'CAP-04.1').factors.utilization, held);
  const targets = changes.filter((c) => c.op === 'set-factor').map((c) => c.target);
  assert.equal(targets.length, 6);
  assert.ok(!targets.includes('CAP-04.1.utilization'));
});

test('applyDefaults_projectDefaults_onlyOps04AndCap08', () => {
  const { state, changes } = E.applyDefaults(fresh(), { now: NOW });
  const rowChanges = changes.filter((c) => c.op === 'set');
  assert.deepEqual(rowChanges.map((c) => [c.target, c.actor, c.reason, c.from.kind, c.to.kind]), [
    ['OPS-04.1', ENGINE, PROJECT_DEFAULT, 'target', 'assumption'],
    ['CAP-08.1', ENGINE, PROJECT_DEFAULT, 'target', 'assumption'],
  ]);
  const view = (id) => { const e = entry(state, id); return [e.value, e.status, e.kind, e.source, e.confirmed_by]; };
  assert.deepEqual(view('OPS-04.1'), ['dev, test, stage, prod', 'Estimated', 'assumption', { type: 'default', text: 'Default: project rule OPS-04' }, null]);
  assert.deepEqual(view('CAP-08.1'), ['Ingress edge; successful and failed requests measured separately', 'Estimated', 'assumption', { type: 'default', text: 'Default: project rule CAP-08' }, null]);
  const filled = allRows.flatMap((row) => E.rowEntries(state, row.id).filter((e) => e.value !== null || e.status !== 'Open').map((e) => E.entryId(row.id, e.n)));
  assert.deepEqual(filled, ['CAP-08.1', 'OPS-04.1']);
  assert.deepEqual([rowById('OPS-04').defaultKind, rowById('CAP-08').defaultKind], ['target', 'target']);
  const replaced = entry(apply(state, [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, prod' }], person, LATER), 'OPS-04.1');
  assert.deepEqual([replaced.value, replaced.kind, replaced.source.type], ['dev, test, prod', 'target', 'answer']);
});

test('applyDefaults_rel05SiteRegionOrProvider_addsDrToOps04', () => {
  for (const scope of rowById('REL-05').enumValues) {
    const state = apply(fresh(), [{ op: 'set', entry: 'REL-05.1', value: 'host' }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: scope }], person);
    const expected = ['site', 'region', 'provider'].includes(scope) ? 'dev, test, stage, prod, dr' : 'dev, test, stage, prod';
    assert.equal(entry(E.applyDefaults(state, { now: NOW }).state, 'OPS-04.1').value, expected, scope);
  }
});

test('applyDefaults_defaultedOps04_gainsDrAfterRegionEntry', () => {
  const early = defaulted();
  assert.equal(entry(early, 'OPS-04.1').value, 'dev, test, stage, prod');
  const region = apply(early, [{ op: 'set', entry: 'REL-05.1', value: 'host' }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }], person, LATER);
  const { state, changes } = E.applyDefaults(region, { now: LATER });
  const ops04 = entry(state, 'OPS-04.1');
  assert.deepEqual([ops04.value, ops04.status, ops04.kind, ops04.source], ['dev, test, stage, prod, dr', 'Estimated', 'assumption', { type: 'default', text: 'Default: project rule OPS-04' }]);
  assert.deepEqual(changes.map((c) => [c.target, c.actor, c.from, c.to, c.reason]), [['OPS-04.1', ENGINE, { value: 'dev, test, stage, prod' }, { value: 'dev, test, stage, prod, dr' }, PROJECT_DEFAULT]]);
  const removed = E.applyDefaults(apply(state, [{ op: 'remove', entry: 'REL-05.2' }], person, LATER), { now: LATER });
  assert.deepEqual([entry(removed.state, 'OPS-04.1').value, entry(removed.state, 'OPS-04.1').kind, removed.changes.map((c) => c.target)], ['dev, test, stage, prod', 'assumption', ['OPS-04.1']]);
  assert.deepEqual(E.applyDefaults(removed.state, { now: LATER }).changes, []);
});

test('applyDefaults_answeredOps04_untouched', () => {
  const region = [{ op: 'set', entry: 'REL-05.1', value: 'region' }];
  const answered = apply(defaulted(), [{ op: 'set', entry: 'OPS-04.1', value: 'dev, prod' }, ...region], person);
  const confirmed = apply(apply(defaulted(), [{ op: 'confirm', entry: 'OPS-04.1' }], person), region, person);
  assert.deepEqual([entry(answered, 'OPS-04.1').source.type, entry(confirmed, 'OPS-04.1').status], ['answer', 'Confirmed']);
  for (const state of [answered, confirmed]) {
    const { state: after, changes } = E.applyDefaults(state, { now: LATER });
    assert.deepEqual([entry(after, 'OPS-04.1'), changes], [entry(state, 'OPS-04.1'), []]);
  }
});

test('applyDefaults_newAppendixVersion_refreshesUnconfirmedOwnFactors', () => {
  const state = apply(defaulted(), [{ op: 'confirm', entry: 'DAT-02.1', factor: 'indexFactor' }], person);
  const saved = JSON.parse(JSON.stringify(E.APPENDIX));
  let result;
  try {
    Object.assign(E.APPENDIX, { version: '2', values: { ...saved.values, copies: 3 } });
    result = E.applyDefaults(state, { now: LATER });
  } finally {
    Object.assign(E.APPENDIX, saved);
  }
  assert.deepEqual(E.APPENDIX, APPROVED);
  const v2 = { type: 'default', text: 'Default: policy appendix v2' };
  const unconfirmed = Object.keys(APPROVED.values).filter((name) => name !== 'indexFactor');
  assert.deepEqual(result.changes.map((c) => c.target), unconfirmed.map((name) => `${factorEntry(name)}.${name}`));
  for (const c of result.changes) assert.deepEqual([c.actor, c.from.source, c.to.source], [ENGINE, APPENDIX_SOURCE, v2], c.target);
  assert.deepEqual(result.changes.find((c) => c.target === 'DAT-02.1.copies').to, { value: 3, source: v2 });
  assert.deepEqual(result.changes.find((c) => c.target === 'CAP-04.1.utilization').to, { source: v2 });
  assert.deepEqual(entry(result.state, 'DAT-02.1').factors.indexFactor, entry(state, 'DAT-02.1').factors.indexFactor);
});

test('applyDefaults_naEntry_skipsItsFactors', () => {
  const written = apply(fresh(), [
    { op: 'set-factor', entry: 'CAP-07.1', factor: 'meanLatencyMs', value: 100, source: APPENDIX_SOURCE },
    { op: 'set-factor', entry: 'CAP-06.1', factor: 'networkOverhead', value: 1.3, source: APPENDIX_SOURCE },
  ], agent);
  const state = apply(written, [{ op: 'na', entry: 'CAP-07.1', reason: 'Batch only: no latency target' }, { op: 'na', entry: 'CAP-02.1', reason: 'No API in scope' }], person);
  const { state: after, changes } = E.applyDefaults(state, { now: NOW });
  assert.deepEqual(changes.filter((c) => c.op === 'set-factor').map((c) => c.target), ['CAP-04.1.utilization', 'CAP-06.1.networkOverhead', 'DAT-02.1.indexFactor', 'DAT-02.1.copies']);
  assert.deepEqual(changes.find((c) => c.target === 'CAP-06.1.networkOverhead').from, { value: 1.3 });
  assert.deepEqual(entry(after, 'CAP-07.1').factors.meanLatencyMs, entry(state, 'CAP-07.1').factors.meanLatencyMs);
  for (const name of ['callsPerTxn', 'requestFactor']) assert.equal(entry(after, 'CAP-02.1').factors[name].status, 'Open', name);
});

test('applyDefaults_personClearsOps04_leavesItOpen', () => {
  const cleared = apply(defaulted(), [{ op: 'set', entry: 'OPS-04.1', value: '' }], person);
  const ops04 = entry(cleared, 'OPS-04.1');
  assert.deepEqual([ops04.value, ops04.status, ops04.source, ops04.kind], [null, 'Open', LEFT_OPEN, 'target']);
  const { state, changes } = E.applyDefaults(apply(cleared, [{ op: 'set', entry: 'REL-05.1', value: 'region' }], person), { now: LATER });
  assert.deepEqual([entry(state, 'OPS-04.1'), changes], [ops04, []]);
  const restored = entry(apply(state, [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, stage, prod, dr' }], person, LATER), 'OPS-04.1');
  assert.deepEqual([restored.value, restored.status, restored.source.type], ['dev, test, stage, prod, dr', 'Estimated', 'answer']);
});

test('applyDefaults_personClearsAppendixFactor_leavesItBlank', () => {
  const cleared = apply(sized(), [{ op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: '' }], person);
  const held = entry(cleared, 'CAP-04.1').factors.utilization;
  assert.deepEqual(held, { value: null, status: 'Open', source: LEFT_OPEN, confirmed_by: null, confirmed_at: null });
  const { state, changes } = E.applyDefaults(cleared, { now: LATER });
  assert.deepEqual([entry(state, 'CAP-04.1').factors.utilization, changes], [held, []]);
  assert.deepEqual([calc(state, 'CALC-03').result !== null, calc(state, 'CALC-04').result], [true, null]);
});

test('applyDefaults_personKindOnOpenOps04_leavesItOpenWithThatKind', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'OPS-04.1', kind: 'hard', reason: 'Audit fixes the environment list' }], person);
  assert.deepEqual([entry(state, 'OPS-04.1').status, entry(state, 'OPS-04.1').kind], ['Open', 'hard']);
  const { state: after, changes } = E.applyDefaults(state, { now: LATER });
  assert.deepEqual([entry(after, 'OPS-04.1').status, entry(after, 'OPS-04.1').value, entry(after, 'OPS-04.1').kind], ['Open', null, 'hard']);
  assert.ok(!changes.some((c) => c.target === 'OPS-04.1'));
  assert.deepEqual([entry(after, 'CAP-08.1').status, entry(after, 'CAP-08.1').kind], ['Estimated', 'assumption']);
  const assumption = apply(fresh(), [{ op: 'set', entry: 'OPS-04.1', kind: 'assumption', reason: 'A working assumption until the platform team answers' }], person);
  const filled = E.applyDefaults(assumption, { now: LATER });
  assert.deepEqual([entry(filled.state, 'OPS-04.1').value, entry(filled.state, 'OPS-04.1').kind], ['dev, test, stage, prod', 'assumption']);
  assert.ok(!('kind' in filled.changes.find((c) => c.target === 'OPS-04.1').to));
});

test('applyDefaultsAndDerive_foreignCitations_untouched', () => {
  const brdTable = { type: 'derived', text: 'Derived: BRD volume table REFUNDS/CAP' };
  const olderEngine = { type: 'derived', text: 'Derived: CALC-03 from CAP-01' };
  for (const source of [brdTable, olderEngine]) {
    const state = apply(sized(), [{ op: 'set', entry: 'CAP-02.1', value: 120, source }], agent);
    const refreshed = E.derive(state, { now: LATER });
    const cleared = E.derive(apply(state, [{ op: 'set', entry: 'CAP-01.1', value: '' }], person, LATER), { now: LATER });
    for (const run of [refreshed, cleared]) assert.deepEqual([entry(run.state, 'CAP-02.1').value, entry(run.state, 'CAP-02.1').source, run.changes], [120, source, []], source.text);
  }
  const houseRule = { type: 'default', text: 'Default: house rule ENV-01' };
  const newerAppendix = { type: 'default', text: 'Default: policy appendix v2' };
  const state = apply(defaulted(), [
    { op: 'set', entry: 'OPS-04.1', value: 'dev, prod', source: houseRule },
    { op: 'set-factor', entry: 'DAT-02.1', factor: 'copies', value: 3, source: houseRule },
    { op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 0.7, source: newerAppendix },
    { op: 'set-factor', entry: 'CAP-06.1', factor: 'networkOverhead', value: 1.3, source: OLD_APPENDIX },
  ], agent);
  const { state: after, changes } = E.applyDefaults(apply(state, [{ op: 'set', entry: 'REL-05.1', value: 'region' }], person), { now: LATER });
  assert.deepEqual(changes, []);
  assert.deepEqual(
    [entry(after, 'OPS-04.1').value, entry(after, 'OPS-04.1').source, entry(after, 'DAT-02.1').factors.copies.value, entry(after, 'CAP-04.1').factors.utilization.value, entry(after, 'CAP-06.1').factors.networkOverhead.value],
    ['dev, prod', houseRule, 3, 0.7, 1.3],
  );
});

test('applyDefaultsAndDerive_personReopensAfterClear_refills', () => {
  const cleared = apply(E.derive(sized(), { now: NOW }).state, [{ op: 'set', entry: 'CAP-02.1', value: '' }, { op: 'set', entry: 'OPS-04.1', value: '' }], person);
  assert.deepEqual([entry(cleared, 'CAP-02.1').source, entry(cleared, 'CAP-02.1').kind, entry(cleared, 'OPS-04.1').source, entry(cleared, 'OPS-04.1').kind], [LEFT_OPEN, 'target', LEFT_OPEN, 'target']);
  const run = (state) => E.derive(E.applyDefaults(state, { now: LATER }).state, { now: LATER }).state;
  const kept = run(cleared);
  assert.deepEqual([entry(kept, 'CAP-02.1').status, entry(kept, 'OPS-04.1').status], ['Open', 'Open']);
  const refilled = run(apply(cleared, [{ op: 'open', entry: 'CAP-02.1' }, { op: 'open', entry: 'OPS-04.1' }], person, LATER));
  near(entry(refilled, 'CAP-02.1').value, 165);
  assert.deepEqual(
    [entry(refilled, 'CAP-02.1').kind, entry(refilled, 'CAP-02.1').source, entry(refilled, 'OPS-04.1').value, entry(refilled, 'OPS-04.1').kind],
    ['forecast', CAP02_SOURCE, 'dev, test, stage, prod', 'assumption'],
  );
});

test('applyDefaultsAndDerive_personClearOrAnswerWithReason_openRefills', () => {
  const derived = E.derive(sized(), { now: NOW }).state;
  const run = (state) => E.derive(E.applyDefaults(state, { now: LATER }).state, { now: LATER }).state;
  for (const op of [
    { op: 'set', entry: 'CAP-02.1', value: '', reason: 'Not known until the partner call' },
    { op: 'set', entry: 'CAP-02.1', value: 170, reason: 'The sales plan says 170' },
  ]) {
    const result = E.applyPatch(derived, [op], person, { now: NOW });
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.changes.map((c) => [c.actor.type, 'kind' in c.to, c.reason]), [['person', false, op.reason], ['person', true, null]], op.reason);
    assert.equal(entry(result.state, 'CAP-02.1').kind, 'target', op.reason);
    const refilled = run(apply(result.state, [{ op: 'open', entry: 'CAP-02.1' }], person, LATER));
    near(entry(refilled, 'CAP-02.1').value, 165);
    assert.deepEqual([entry(refilled, 'CAP-02.1').kind, entry(refilled, 'CAP-02.1').source], ['forecast', CAP02_SOURCE], op.reason);
  }
  const cleared = apply(defaulted(), [{ op: 'set', entry: 'OPS-04.1', value: '', reason: 'Platform team to confirm' }], person);
  assert.deepEqual([entry(cleared, 'OPS-04.1').status, entry(cleared, 'OPS-04.1').kind], ['Open', 'target']);
  const back = E.applyDefaults(apply(cleared, [{ op: 'open', entry: 'OPS-04.1' }], person, LATER), { now: LATER }).state;
  assert.deepEqual([entry(back, 'OPS-04.1').value, entry(back, 'OPS-04.1').kind, entry(back, 'OPS-04.1').source.type], ['dev, test, stage, prod', 'assumption', 'default']);
});

test('applyDefaultsAndDerive_reorderedSourceKeys_notStale', () => {
  const plain = E.derive(sized(), { now: NOW }).state;
  const owned = apply(plain, [
    { op: 'set', entry: 'CAP-02.1', kind: 'hard', reason: 'The partner contract caps the API rate' },
    { op: 'set', entry: 'OPS-04.1', kind: 'hard', reason: 'Audit fixes the environment list' },
  ], person);
  for (const state of [owned, plain]) {
    const reordered = JSON.parse(JSON.stringify(state));
    for (const id of ['CAP-02.1', 'OPS-04.1']) {
      const e = entry(reordered, id);
      e.source = { text: e.source.text, type: e.source.type };
    }
    const derived = E.derive(reordered, { now: LATER });
    const defaults = E.applyDefaults(reordered, { now: LATER });
    assert.deepEqual([derived.changes, defaults.changes], [[], []]);
    assert.deepEqual([entry(derived.state, 'CAP-02.1').value, entry(defaults.state, 'OPS-04.1').value], [entry(state, 'CAP-02.1').value, entry(state, 'OPS-04.1').value]);
  }
});

test('applyDefaultsAndDerive_personAffirmsCatalogueKind_leavesItOpen', () => {
  const result = E.applyPatch(sized(), [{ op: 'set', entry: 'CAP-02.1', kind: 'target', reason: 'Our goal, not a forecast' }], person, { now: LATER });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.changes.map((c) => [c.target, c.from, c.to, c.reason]), [['CAP-02.1', { kind: 'target' }, { kind: 'target' }, 'Our goal, not a forecast']]);
  const { state, changes } = E.derive(result.state, { now: LATER });
  assert.deepEqual([entry(state, 'CAP-02.1').status, entry(state, 'CAP-02.1').value, entry(state, 'CAP-02.1').kind, changes], ['Open', null, 'target', []]);
  near(calc(state, 'CALC-03').result, 165);
  const affirmed = apply(fresh(), [{ op: 'set', entry: 'OPS-04.1', kind: 'target', reason: 'The audit fixes the list' }], person);
  const kept = E.applyDefaults(affirmed, { now: LATER }).state;
  assert.deepEqual([entry(kept, 'OPS-04.1').status, entry(kept, 'OPS-04.1').kind], ['Open', 'target']);
  const silent = E.applyPatch(fresh(), [{ op: 'set', entry: 'OPS-04.1', kind: 'target' }], person, { now: LATER });
  assert.deepEqual(silent.changes, []);
  assert.equal(entry(E.applyDefaults(silent.state, { now: LATER }).state, 'OPS-04.1').kind, 'assumption');
});

test('applyDefaults_heldOrProtectedTargets_skippedWithoutErrors', () => {
  let state = apply(fresh(), [{ op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 4 }, { op: 'set', entry: 'CAP-08.1', value: 'Client end-to-end' }], person);
  state = apply(state, [{ op: 'set-factor', entry: 'CAP-06.1', factor: 'networkOverhead', value: 1.3, source: { type: 'brd', text: 'BRD: REFUNDS/NFR-09' } }], agent);
  state = apply(state, [{ op: 'na', entry: 'OPS-04.1', reason: 'One shared environment by contract' }, { op: 'set-factor', entry: 'DAT-02.1', factor: 'copies', value: '' }], person);
  assert.deepEqual(entry(state, 'DAT-02.1').factors.copies.source, LEFT_OPEN);
  const before = ['CAP-02.1', 'CAP-06.1', 'CAP-08.1', 'DAT-02.1', 'OPS-04.1'].map((id) => JSON.parse(JSON.stringify(entry(state, id))));
  const { state: after, changes } = E.applyDefaults(state, { now: LATER });
  assert.deepEqual(changes.map((c) => c.target), ['CAP-04.1.utilization', 'DAT-02.1.indexFactor', 'CAP-07.1.meanLatencyMs', 'CAP-02.1.requestFactor']);
  assert.deepEqual(entry(after, 'CAP-02.1').factors.callsPerTxn, before[0].factors.callsPerTxn);
  assert.deepEqual(entry(after, 'CAP-06.1'), before[1]);
  assert.deepEqual(entry(after, 'CAP-08.1'), before[2]);
  assert.deepEqual(entry(after, 'DAT-02.1').factors.copies, before[3].factors.copies);
  assert.deepEqual(entry(after, 'OPS-04.1'), before[4]);
});

test('applyDefaultsAndDerive_stateOutsideSchema_throwWithOpErrors', () => {
  const broken = JSON.parse(JSON.stringify(fresh()));
  entry(broken, 'CAP-08.1').n = 0;
  assert.throws(() => E.applyDefaults(broken, { now: NOW }), { message: /^The defaults could not be applied: CAP-08 has no entry 0\.$/ });
  const derivable = JSON.parse(JSON.stringify(sized()));
  entry(derivable, 'CAP-02.1').n = 0;
  assert.throws(() => E.derive(derivable, { now: NOW }), { name: 'Error', message: "The project state cannot be read:\n- CAP-02 holds an entry whose n is 0; each entry's n is a whole number from 1, so renumber it." }, 'derive reads the state through compute, so the gate rejects it before any op runs');
});

test('derive_cap01AndDefaults_setsCap02To165', () => {
  const state = sized();
  const { state: after, changes } = E.derive(state, { now: LATER });
  const cap02 = entry(after, 'CAP-02.1');
  near(cap02.value, 165);
  assert.deepEqual([cap02.status, cap02.kind, cap02.source, cap02.confirmed_by, cap02.unit], ['Estimated', 'forecast', CAP02_SOURCE, null, 'req/s']);
  assert.equal(cap02.value, calc(after, 'CALC-03').result);
  assert.deepEqual(changes.map((c) => [c.op, c.target, c.at, c.actor, c.reason, c.from.kind, c.to.kind]), [['set', 'CAP-02.1', LATER, ENGINE, 'Derived: CALC-03', 'target', 'forecast']]);
  assert.deepEqual([entry(state, 'CAP-02.1').value, entry(state, 'CAP-02.1').status], [null, 'Open']);
  assert.deepEqual(E.derive(after, { now: LATER }).changes, []);
});

test('derive_dat02_fromCap01AndStoredKb', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }], person);
  const { state: after, changes } = E.derive(state, { now: NOW });
  const dat02 = entry(after, 'DAT-02.1');
  near(dat02.value, 1.728);
  assert.deepEqual([dat02.status, dat02.kind, dat02.source, dat02.unit], ['Estimated', 'forecast', DAT02_SOURCE, 'GB/day']);
  assert.equal(dat02.value, calc(after, 'CALC-10').result);
  assert.deepEqual(changes.map((c) => [c.target, c.reason, 'kind' in c.to]), [['DAT-02.1', null, false]]);
  assert.equal(entry(after, 'CAP-02.1').status, 'Open');
});

test('derive_answeredCap02_notOverwritten', () => {
  const state = sized([{ op: 'set', entry: 'CAP-02.1', value: 200 }]);
  const held = entry(state, 'CAP-02.1');
  assert.deepEqual([held.value, held.status, held.source.type], [200, 'Estimated', 'answer']);
  const { state: after, changes } = E.derive(state, { now: LATER });
  assert.deepEqual(entry(after, 'CAP-02.1'), held);
  assert.deepEqual(changes, []);
  const confirmed = apply(state, [{ op: 'confirm', entry: 'CAP-02.1' }], person);
  assert.deepEqual(E.derive(confirmed, { now: LATER }).changes, []);
});

test('derive_missingCap01_leavesCap02OpenAndTbd', () => {
  const state = apply(defaulted(), [{ op: 'set', entry: 'CAP-04.1', value: 5 }, { op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }], person);
  const { state: after, changes } = E.derive(state, { now: NOW });
  assert.deepEqual(changes, []);
  for (const id of ['CAP-02.1', 'DAT-02.1']) assert.deepEqual([entry(after, id).value, entry(after, id).status, entry(after, id).source], [null, 'Open', NO_SOURCE], id);
  for (const id of ['CALC-03', 'CALC-10']) {
    const row = calc(after, id);
    assert.equal(row.result, null, id);
    assert.match(row.substitution, /^TBD /, id);
  }
});

test('derive_cap01Changed_refreshesDerivedCap02', () => {
  const first = E.derive(sized([{ op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }]), { now: NOW }).state;
  const was = [entry(first, 'CAP-02.1').value, entry(first, 'DAT-02.1').value];
  const changed = apply(first, [{ op: 'set', entry: 'CAP-01.1', value: 1728000 }], person, LATER);
  const { state: after, changes } = E.derive(changed, { now: LATER });
  const [cap02, dat02] = [entry(after, 'CAP-02.1'), entry(after, 'DAT-02.1')];
  near(cap02.value, 330);
  near(dat02.value, 3.456);
  assert.deepEqual([cap02.status, cap02.kind, cap02.source, dat02.source], ['Estimated', 'forecast', CAP02_SOURCE, DAT02_SOURCE]);
  assert.deepEqual(changes.map((c) => [c.target, c.actor, c.from, c.to, c.reason]), [
    ['CAP-02.1', ENGINE, { value: was[0] }, { value: cap02.value }, 'Derived: CALC-03'],
    ['DAT-02.1', ENGINE, { value: was[1] }, { value: dat02.value }, null],
  ]);
  assert.deepEqual(E.derive(after, { now: LATER }).changes, []);
});

test('derive_personKindOnDerivedValue_inputChangeClearsKeepingKind', () => {
  const first = E.derive(sized([{ op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }]), { now: NOW }).state;
  const owned = apply(first, [
    { op: 'set', entry: 'CAP-02.1', kind: 'hard', reason: 'The partner contract caps the API rate' },
    { op: 'set', entry: 'DAT-02.1', kind: 'target', reason: 'The storage budget caps daily growth' },
  ], person);
  assert.deepEqual(E.derive(owned, { now: LATER }).changes, []);
  const doubled = E.derive(apply(owned, [{ op: 'set', entry: 'CAP-01.1', value: 1728000 }], person, LATER), { now: LATER });
  for (const [id, kind] of [['CAP-02.1', 'hard'], ['DAT-02.1', 'target']]) {
    const e = entry(doubled.state, id);
    assert.deepEqual([e.value, e.status, e.source, e.kind], [null, 'Open', NO_SOURCE, kind], id);
  }
  assert.deepEqual(doubled.changes.map((c) => [c.target, c.actor, 'kind' in c.to]), [['CAP-02.1', ENGINE, false], ['DAT-02.1', ENGINE, false]]);
  near(calc(doubled.state, 'CALC-03').result, 330);
  assert.deepEqual(E.derive(doubled.state, { now: LATER }).changes, []);
  const forecast = E.derive(sized([{ op: 'set', entry: 'CAP-02.1', kind: 'forecast', reason: 'A demand forecast, as the derivation gives' }]), { now: NOW }).state;
  assert.deepEqual([entry(forecast, 'CAP-02.1').kind, forecast.history.filter((c) => c.target === 'CAP-02.1' && c.to && 'kind' in c.to).map((c) => c.actor.type)], ['forecast', ['person']]);
  const kept = E.derive(apply(forecast, [{ op: 'set', entry: 'CAP-01.1', value: 1728000 }], person, LATER), { now: LATER });
  near(entry(kept.state, 'CAP-02.1').value, 330);
  assert.deepEqual([entry(kept.state, 'CAP-02.1').kind, entry(kept.state, 'CAP-02.1').source], ['forecast', CAP02_SOURCE]);
});

test('applyDefaults_personKindOnDefaultedOps04_regionClearsKeepingKind', () => {
  const owned = apply(defaulted(), [
    { op: 'set', entry: 'OPS-04.1', kind: 'hard', reason: 'Audit fixes the environment list' },
    { op: 'set', entry: 'CAP-08.1', kind: 'hard', reason: 'The SLA contract fixes the measurement point' },
  ], person);
  assert.deepEqual([entry(owned, 'OPS-04.1').value, entry(owned, 'OPS-04.1').kind], ['dev, test, stage, prod', 'hard']);
  assert.deepEqual(E.applyDefaults(owned, { now: LATER }).changes, []);
  const region = apply(owned, [{ op: 'set', entry: 'REL-05.1', value: 'region' }], person, LATER);
  const { state, changes } = E.applyDefaults(region, { now: LATER });
  const ops04 = entry(state, 'OPS-04.1');
  assert.deepEqual([ops04.value, ops04.status, ops04.source, ops04.kind], [null, 'Open', NO_SOURCE, 'hard']);
  assert.deepEqual(changes.map((c) => [c.target, c.actor, 'kind' in c.to]), [['OPS-04.1', ENGINE, false]]);
  assert.deepEqual([entry(state, 'CAP-08.1').value, entry(state, 'CAP-08.1').kind], [entry(owned, 'CAP-08.1').value, 'hard']);
  assert.deepEqual(E.applyDefaults(state, { now: LATER }).changes, []);
});

test('derive_cap01Cleared_returnsDerivedCap02ToOpen', () => {
  const first = E.derive(sized([{ op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }]), { now: NOW }).state;
  const cleared = apply(first, [{ op: 'set', entry: 'CAP-01.1', value: '' }], person, LATER);
  const { state: after, changes } = E.derive(cleared, { now: LATER });
  for (const id of ['CAP-02.1', 'DAT-02.1']) {
    const e = entry(after, id);
    assert.deepEqual([e.value, e.status, e.source, e.confirmed_by, e.kind], [null, 'Open', NO_SOURCE, null, rowById(id.slice(0, 6)).defaultKind], id);
  }
  assert.deepEqual(changes.map((c) => [c.target, c.to.value, c.to.status, c.reason]), [['CAP-02.1', null, 'Open', 'CALC-03 is TBD: an input is missing'], ['DAT-02.1', null, 'Open', null]]);
  assert.equal(calc(after, 'CALC-03').result, null);
  const back = E.derive(apply(after, [{ op: 'set', entry: 'CAP-01.1', value: 864000 }], person, LATER), { now: LATER }).state;
  near(entry(back, 'CAP-02.1').value, 165);
  assert.deepEqual(entry(back, 'CAP-02.1').source, CAP02_SOURCE);
});

test('derive_inputMissing_restoresRowDefaultKind', () => {
  const first = E.derive(sized([{ op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }]), { now: NOW }).state;
  assert.deepEqual([entry(first, 'CAP-02.1').kind, entry(first, 'DAT-02.1').kind], ['forecast', 'forecast']);
  assert.deepEqual([rowById('CAP-02').defaultKind, rowById('DAT-02').defaultKind], ['target', 'forecast']);
  const clearCap01 = (state) => apply(state, [{ op: 'set', entry: 'CAP-01.1', value: '' }], person, LATER);
  const { state, changes } = E.derive(clearCap01(first), { now: LATER });
  assert.deepEqual([entry(state, 'CAP-02.1').kind, entry(state, 'DAT-02.1').kind], ['target', 'forecast']);
  assert.deepEqual(changes.map((c) => [c.target, c.from.kind, c.to.kind, c.reason]), [['CAP-02.1', 'forecast', 'target', 'CALC-03 is TBD: an input is missing'], ['DAT-02.1', undefined, undefined, null]]);
  const hard = apply(first, [{ op: 'set', entry: 'CAP-02.1', kind: 'hard', reason: 'The partner contract caps the API rate' }], person);
  assert.deepEqual([entry(hard, 'CAP-02.1').kind, entry(hard, 'CAP-02.1').source], ['hard', CAP02_SOURCE]);
  assert.equal(entry(E.derive(clearCap01(hard), { now: LATER }).state, 'CAP-02.1').kind, 'hard');
  const refilled = E.derive(apply(state, [{ op: 'set', entry: 'CAP-01.1', value: 864000 }], person, LATER), { now: LATER });
  assert.deepEqual(refilled.changes.map((c) => [c.target, c.from.kind, c.to.kind, c.reason]), [['CAP-02.1', 'target', 'forecast', 'Derived: CALC-03'], ['DAT-02.1', undefined, undefined, null]]);
});

test('derive_personKindOnOpenCap02_leavesItOpenWithThatKind', () => {
  const state = sized([{ op: 'set', entry: 'CAP-02.1', kind: 'hard', reason: 'The partner contract caps the API rate' }]);
  assert.deepEqual([entry(state, 'CAP-02.1').status, entry(state, 'CAP-02.1').kind], ['Open', 'hard']);
  const { state: after, changes } = E.derive(state, { now: LATER });
  assert.deepEqual([entry(after, 'CAP-02.1').status, entry(after, 'CAP-02.1').value, entry(after, 'CAP-02.1').kind, changes], ['Open', null, 'hard', []]);
  near(calc(after, 'CALC-03').result, 165);
  const forecast = sized([{ op: 'set', entry: 'CAP-02.1', kind: 'forecast', reason: 'A demand forecast, as the derivation gives' }]);
  const filled = E.derive(forecast, { now: LATER });
  near(entry(filled.state, 'CAP-02.1').value, 165);
  assert.deepEqual([entry(filled.state, 'CAP-02.1').kind, filled.changes.map((c) => [c.target, 'kind' in c.to])], ['forecast', [['CAP-02.1', false]]]);
});

test('derive_personKindOnDerivedCap02_clearKeepsKindWithoutRefill', () => {
  const hard = apply(E.derive(sized(), { now: NOW }).state, [{ op: 'set', entry: 'CAP-02.1', kind: 'hard', reason: 'The partner contract caps the API rate' }], person);
  assert.deepEqual([entry(hard, 'CAP-02.1').kind, entry(hard, 'CAP-02.1').source], ['hard', CAP02_SOURCE]);
  const cleared = E.derive(apply(hard, [{ op: 'set', entry: 'CAP-01.1', value: '' }], person, LATER), { now: LATER });
  const cap02 = entry(cleared.state, 'CAP-02.1');
  assert.deepEqual([cap02.value, cap02.status, cap02.source, cap02.kind], [null, 'Open', NO_SOURCE, 'hard']);
  assert.deepEqual(cleared.changes.map((c) => [c.target, 'kind' in c.to, c.reason]), [['CAP-02.1', false, null]]);
  const back = E.derive(apply(cleared.state, [{ op: 'set', entry: 'CAP-01.1', value: 864000 }], person, LATER), { now: LATER });
  assert.deepEqual([entry(back.state, 'CAP-02.1').status, entry(back.state, 'CAP-02.1').value, entry(back.state, 'CAP-02.1').kind, back.changes], ['Open', null, 'hard', []]);
});

test('derive_personClearsDerivedCap02_leavesItOpen', () => {
  const derived = E.derive(sized(), { now: NOW }).state;
  assert.equal(entry(derived, 'CAP-02.1').source.type, 'derived');
  const cleared = apply(derived, [{ op: 'set', entry: 'CAP-02.1', value: '' }], person);
  const cap02 = entry(cleared, 'CAP-02.1');
  assert.deepEqual([cap02.value, cap02.status, cap02.source, cap02.kind], [null, 'Open', LEFT_OPEN, 'target']);
  const { state, changes } = E.derive(cleared, { now: LATER });
  assert.deepEqual([entry(state, 'CAP-02.1'), changes], [cap02, []]);
  near(calc(state, 'CALC-03').result, 165);
});

test('derive_nonDerivedSourcesConfirmedOrNa_untouched', () => {
  const base = sized([{ op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }]);
  for (const type of ['brd', 'default', 'import']) {
    const source = { type, text: `${type} text` };
    const state = apply(base, [{ op: 'set', entry: 'CAP-02.1', value: 100, source }, { op: 'set', entry: 'DAT-02.1', value: 9, source }], agent);
    const { state: after, changes } = E.derive(state, { now: LATER });
    assert.deepEqual(changes, [], type);
    assert.deepEqual([entry(after, 'CAP-02.1').value, entry(after, 'DAT-02.1').value, entry(after, 'CAP-02.1').source], [100, 9, source], type);
  }
  const confirmed = apply(E.derive(base, { now: NOW }).state, [{ op: 'confirm', entry: 'CAP-02.1' }], person);
  const moved = apply(confirmed, [{ op: 'set', entry: 'CAP-01.1', value: 1728000 }], person, LATER);
  const result = E.derive(moved, { now: LATER });
  assert.deepEqual(entry(result.state, 'CAP-02.1'), entry(confirmed, 'CAP-02.1'));
  assert.deepEqual(result.changes.map((c) => c.target), ['DAT-02.1']);
  const na = apply(base, [{ op: 'na', entry: 'CAP-02.1', reason: 'No API in scope' }], person);
  const closed = E.derive(na, { now: LATER });
  assert.deepEqual([entry(closed.state, 'CAP-02.1').status, closed.changes.map((c) => c.target)], ['N/A', ['DAT-02.1']]);
});

test('applyDefaultsAndDerive_nowInput_dateOrIsoWithZoneOnly', () => {
  for (const fn of [E.applyDefaults, E.derive]) {
    for (const now of [undefined, '2026-10-23', '2026-10-23T11:01:02', Date.parse(NOW), 'tomorrow']) {
      assert.throws(() => fn(fresh(), { now }), { message: /now must be a Date, or an ISO 8601 timestamp with Z or an offset/ }, String(now));
    }
    assert.throws(() => fn(fresh()), { message: /now must be a Date/ });
  }
  const state = apply(fresh(), [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'CAP-04.1', value: 5 }], person);
  const byZ = E.derive(E.applyDefaults(state, { now: NOW }).state, { now: NOW });
  const byOffset = E.derive(E.applyDefaults(state, { now: '2026-10-23T13:01:02+02:00' }).state, { now: new Date(NOW) });
  assert.deepEqual(byOffset, byZ);
  assert.ok(byZ.state.history.length > 0 && byZ.state.history.every((c) => c.at === NOW));
});

test('projectStateSchema_afterDefaultsAndDerive_validates', (t) => {
  const derived = E.derive(sized([{ op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }, { op: 'set', entry: 'REL-05.1', value: 'region' }]), { now: NOW }).state;
  const refreshed = E.applyDefaults(derived, { now: NOW }).state;
  const state = apply(refreshed, [{ op: 'set', entry: 'CAP-08.1', value: '' }, { op: 'set-factor', entry: 'CAP-06.1', factor: 'networkOverhead', value: '' }], person);
  assert.deepEqual([entry(state, 'CAP-02.1').status, entry(state, 'DAT-02.1').status, entry(state, 'OPS-04.1').value, entry(state, 'CAP-08.1').source, entry(state, 'CAP-06.1').factors.networkOverhead.source], ['Estimated', 'Estimated', 'dev, test, stage, prod, dr', LEFT_OPEN, LEFT_OPEN]);
  const result = validateWithSchema(schemaPath, state);
  if (result.skipped) {
    t.skip(result.skipped);
    return;
  }
  assert.deepEqual(result.errors, []);
});

test('engineExports_nameKindsSourceTexts_matchWhatTheEngineWrites', () => {
  assert.equal(E.ENGINE_NAME, 'pre-sdd-engine');
  assert.deepEqual(E.ENGINE_KIND, { derived: 'forecast', default: 'assumption' });
  assert.deepEqual(E.ENGINE_SOURCE_TEXTS, ['Default: policy appendix v1', 'Default: project rule OPS-04', 'Default: project rule CAP-08', 'Derived: CALC-03 from CAP-01, CAP-04, CAP-02', 'Derived: CALC-10 from CAP-01, DAT-02']);
  assert.ok(Object.isFrozen(E.ENGINE_KIND) && Object.isFrozen(E.ENGINE_SOURCE_TEXTS));
  const person = { type: 'person', name: 'Mahmoud' };
  let s = E.applyPatch(E.newState({ name: 'X', slug: 'x', now: NOW }), [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'CAP-04.1', value: 5 }, { op: 'set', entry: 'REL-05.1', value: 'region' }, { op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 }, { op: 'set-factor', entry: 'DAT-02.1', factor: 'retentionDays', value: 365 }, { op: 'set-factor', entry: 'DAT-02.1', factor: 'initialGB', value: 100 }], person, { now: NOW }).state;
  const defaults = E.applyDefaults(s, { now: NOW });
  const derived = E.derive(defaults.state, { now: NOW });
  const changes = [...defaults.changes, ...derived.changes];
  const written = new Set(changes.map((c) => c.to && c.to.source && c.to.source.text).filter(Boolean));
  assert.deepEqual([...written].sort(), [...E.ENGINE_SOURCE_TEXTS].sort());
  assert.ok(changes.every((c) => c.actor.name === E.ENGINE_NAME));
  for (const c of changes.filter((x) => x.to && x.to.kind)) assert.equal(c.to.kind, E.ENGINE_KIND[c.to.source.type]);
  const bp = E.handoffBlueprint(derived.state, E.compute(derived.state, { now: NOW }), { now: NOW });
  assert.equal(bp.sources.engine.name, E.ENGINE_NAME);
});
