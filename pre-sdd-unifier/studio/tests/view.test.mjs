import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { loadEngine, readText } from './helpers.mjs';
import { NOW, person, agent, apply, newProject } from './states.mjs';

const E = loadEngine();

const STAGE1 = ['HDR-07', 'HDR-08', 'BUS-05', 'CAP-01', 'CAP-03', 'CAP-04', 'CAP-07', 'REL-01', 'REL-03', 'REL-04', 'REL-05', 'DAT-02', 'ECO-01'];
const DECISION_8 = ['BUS', 'SEC', 'DAT', 'INT', 'CAP', 'REL', 'OPS', 'ECO'];

test('registerView_stage1_onlyStage1Rows', () => {
  const state = newProject();
  const rows = E.registerView(state, { stage: 1 });
  assert.deepEqual(rows.map((row) => row.rowId), STAGE1);
  assert.ok(rows.every((row) => row.stage1 === true));
  assert.ok(rows.every((row) => row.entries.length === 1 && row.entries[0].id === `${row.rowId}.1`));
  const cap01 = rows.find((row) => row.rowId === 'CAP-01');
  assert.deepEqual(cap01.owners, ['B', 'E']);
  assert.equal(cap01.kind, 'forecast');
  assert.equal(typeof cap01.title, 'string');
  assert.ok(cap01.title.length > 0);
  assert.equal(rows.find((row) => row.rowId === 'HDR-07').title, 'Change type');
  assert.deepEqual(E.registerView(state, { stage: 1, group: 'SEC' }).map((row) => row.rowId), STAGE1);
});

test('registerView_stage2Group_needsAnswerFirst', () => {
  let state = newProject();
  state = apply(state, [
    { op: 'set', entry: 'REL-02.1', value: 'Refund API answers within the SLA' },
    { op: 'set', entry: 'REL-06.1', value: 'Graceful degradation to queued refunds' },
    { op: 'confirm', entry: 'REL-06.1' },
    { op: 'na', entry: 'REL-07.1', reason: 'No batch window in scope' },
    { op: 'set', entry: 'REL-03.1', value: 600 },
    { op: 'add', row: 'REL-03', label: 'Payout journey', scope: 'region' },
  ]);
  state = apply(state, [{ op: 'propose', entry: 'REL-01.1', value: 99.9, reason: 'BRD REFUNDS/NFR-03 allows 43 minutes of disruption a month' }], agent);
  const rows = E.registerView(state, { stage: 2, group: 'REL' });
  assert.deepEqual(rows.map((row) => row.rowId), ['REL-03', 'REL-04', 'REL-05', 'REL-08', 'REL-09', 'REL-10', 'REL-01', 'REL-02', 'REL-06', 'REL-07']);
  const byId = Object.fromEntries(rows.map((row) => [row.rowId, row]));
  assert.deepEqual(byId['REL-03'].entries.map((e) => [e.id, e.status, e.needsAnswer]), [['REL-03.1', 'Estimated', false], ['REL-03.2', 'Open', true]]);
  assert.equal(byId['REL-03'].entries[1].scope, 'region');
  const rel01 = byId['REL-01'].entries[0];
  assert.equal(rel01.needsAnswer, true);
  assert.equal(rel01.proposal.value, 99.9);
  assert.equal(rel01.proposal.reason, 'BRD REFUNDS/NFR-03 allows 43 minutes of disruption a month');
  assert.equal(byId['REL-02'].entries[0].sourceText, `Answer: ${person.name}, ${NOW.slice(0, 10)}`);
  assert.equal(byId['REL-06'].entries[0].status, 'Confirmed');
  assert.equal(byId['REL-06'].entries[0].needsAnswer, false);
  assert.equal(byId['REL-07'].entries[0].status, 'N/A');
  assert.equal(byId['REL-07'].entries[0].na_reason, 'No batch window in scope');
  assert.equal(byId['REL-04'].entries[0].proposal, null);
});

test('registerView_groupOrder_followsDecisionHierarchy', () => {
  assert.deepEqual(E.GROUP_ORDER, DECISION_8);
  const state = newProject();
  const all = E.registerView(state, { stage: 2 });
  const sequence = all.map((row) => row.group).filter((group, i, list) => i === 0 || list[i - 1] !== group);
  assert.deepEqual(sequence, DECISION_8);
  assert.equal(all.length, E.ITEMS.length);
  assert.deepEqual([...all.map((row) => row.rowId)].sort(), E.ITEMS.map((row) => row.id).sort());
  for (const group of DECISION_8) {
    const rows = E.registerView(state, { stage: 2, group });
    assert.ok(rows.length > 0, group);
    assert.ok(rows.every((row) => row.group === group), group);
    assert.deepEqual(rows.map((row) => row.rowId), all.filter((row) => row.group === group).map((row) => row.rowId), group);
  }
  assert.deepEqual(E.registerView(state, { stage: 2, group: 'HDR' }).map((row) => row.rowId), E.HEADER_FIELDS.map((row) => row.id));
  assert.throws(() => E.registerView(state, { stage: 2, group: 'XYZ' }), /group is one of/);
  assert.throws(() => E.registerView(state, { stage: 3 }), /stage 1 or 2/);
});

test('fieldError_blankInput_noErrorAndOpen', () => {
  const state = newProject();
  for (const raw of ['', '   ', null, undefined]) {
    assert.equal(E.fieldError('REL-04', 'value', raw), null);
    assert.equal(E.fieldError('REL-01', 'value', raw), null);
    assert.equal(E.fieldError('CAP-04', 'utilization', raw), null);
    assert.equal(E.fieldError('REL-03', 'due', raw), null);
  }
  assert.equal(E.fieldError('REL-04', 'value', '0'), null);
  const entry = E.registerView(state, { stage: 1 }).find((row) => row.rowId === 'REL-04').entries[0];
  assert.equal(entry.status, 'Open');
  assert.equal(entry.value, null);
  assert.equal(entry.needsAnswer, true);
  const model = E.compute(state, { now: NOW });
  assert.equal(model.c.rows.find((row) => row.id === 'CALC-15').result, null);
});

test('fieldError_availability150_explainsFix', () => {
  const fix = 'Availability is a percentage above 0 and at most 100, for example 99.9.';
  assert.equal(E.fieldError('REL-01', 'value', '150'), fix);
  assert.equal(E.fieldError('REL-01', 'value', 150), fix);
  assert.equal(E.fieldError('REL-01', 'value', '0'), fix);
  assert.equal(E.fieldError('REL-01', 'value', '99.9'), null);
  assert.equal(E.fieldError('REL-01', 'value', '100'), null);
  assert.equal(E.fieldError('REL-01', 'value', 'high'), `Enter a number without commas or units. ${fix}`);
});

test('fieldError_utilizationZero_explainsFix', () => {
  const fix = 'Utilization is a ratio above 0 and at most 1, for example 0.65.';
  assert.equal(E.fieldError('CAP-04', 'utilization', '0'), fix);
  assert.equal(E.fieldError('CAP-04', 'utilization', '1.5'), fix);
  assert.equal(E.fieldError('CAP-04', 'utilization', '0.65'), null);
  assert.equal(E.fieldError('CAP-04', 'utilization', '1'), null);
});

test('fieldError_numberRules_matchCalculatorLimits', () => {
  const samples = ['-150', '-100', '-99', '-1', '0', '0.5', '1', '15', '16', '20.5', '28', '29', '100', '101', '1e3'];
  let checked = 0;
  for (const [key, target] of Object.entries(E.V22_FIELD_MAP.fields)) {
    if (!E.numeric.has(key) || !target.row) continue;
    const field = target.factor ?? 'value';
    for (const raw of samples) {
      const accepted = E.cl({ [key]: Number(raw) }, key) !== null;
      const error = E.fieldError(target.row, field, raw);
      assert.equal(error === null, accepted, `${key} (${target.row} ${field}) with ${raw}: ${error}`);
      if (error !== null) assert.match(error, /for example/);
      checked += 1;
    }
  }
  assert.ok(checked >= 20 * samples.length);
});

test('fieldError_recordFieldsAndChoices_explainFix', () => {
  assert.match(E.fieldError('REL-03', 'due', '1 December'), /YYYY-MM-DD/);
  assert.equal(E.fieldError('REL-03', 'due', '2026-12-01'), null);
  assert.match(E.fieldError('REL-03', 'owner', 'Boss'), /B\+E/);
  assert.equal(E.fieldError('REL-03', 'owner', 'Sec+Ops'), null);
  assert.match(E.fieldError('REL-03', 'priority', 'High'), /Must, Should or Could/);
  assert.match(E.fieldError('REL-03', 'scope', 'moon'), /region/);
  assert.match(E.fieldError('REL-05', 'value', 'moon'), /region/);
  assert.equal(E.fieldError('REL-05', 'value', 'az'), null);
  assert.match(E.fieldError('DAT-01', 'storeKind', 'graph'), /relational/);
  assert.equal(E.fieldError('DAT-01', 'storeKind', 'document'), null);
  assert.equal(E.fieldError('BUS-01', 'value', 'Any text'), null);
  assert.match(E.fieldError('BUS-01', 'storeKind', 'x'), /no field/);
  assert.match(E.fieldError('ZZZ-01', 'value', '1'), /Unknown row/);
});

test('registerView_factors_foldedUnderTheirRow', () => {
  let state = newProject();
  state = E.applyDefaults(state, { now: NOW }).state;
  const cap04 = E.registerView(state, { stage: 1 }).find((row) => row.rowId === 'CAP-04');
  const [utilization] = cap04.entries[0].factors;
  assert.equal(utilization.name, 'utilization');
  assert.equal(utilization.label, 'Utilization');
  assert.equal(utilization.value, 0.65);
  assert.equal(utilization.status, 'Estimated');
  assert.equal(utilization.sourceText, 'Default: policy appendix v1');
  assert.equal(utilization.valueType, 'number');
  const dat01 = E.registerView(state, { stage: 2, group: 'DAT' }).find((row) => row.rowId === 'DAT-01');
  const storeKind = dat01.entries[0].factors.find((f) => f.name === 'storeKind');
  assert.equal(storeKind.valueType, 'choice');
  assert.ok(storeKind.choices.includes('relational'));
  assert.equal(storeKind.needsAnswer, true);
});

test('registerView_doesNotChangeTheState', () => {
  const state = apply(newProject(), [{ op: 'set', entry: 'CAP-01.1', value: 864000 }]);
  const before = JSON.stringify(state);
  E.registerView(state, { stage: 1 });
  E.registerView(state, { stage: 2 });
  assert.equal(JSON.stringify(state), before);
});

test('shell_noOwnStyleBlock_stylesLiveInStyleCss', () => {
  const shell = readText(join(import.meta.dirname, '..', 'src', 'shell.html'));
  assert.deepEqual(shell.match(/<style>[\s\S]*?<\/style>/g), ['<style>/* STYLES */</style>']);
  assert.doesNotMatch(shell, /style="/);
});

test('stageBlock_quickMode_matchesSetRunRefusal', () => {
  const quick = E.newState({ name: 'Quick check', slug: 'quick-check', mode: 'quick', now: NOW });
  for (const stage of [2, 3, 4]) {
    const refused = E.applyPatch(quick, [{ op: 'set-run', stage }], person, { now: NOW });
    assert.equal(refused.errors.length, 1);
    assert.equal(E.stageBlock(quick, stage), refused.errors[0].message);
    assert.match(E.stageBlock(quick, stage), /switch to full first/);
  }
  assert.equal(E.stageBlock(quick, 1), null);
  const full = newProject();
  for (const stage of [1, 2, 3, 4]) {
    assert.equal(E.stageBlock(full, stage), null);
    assert.deepEqual(E.applyPatch(full, [{ op: 'set-run', stage }], person, { now: NOW }).errors, []);
  }
  assert.match(E.stageBlock(full, 5), /1 to 4/);
});

test('setRun_navigation_leavesContentHashAndGate', () => {
  const state = newProject();
  const moved = apply(state, [{ op: 'set-run', stage: 2, group: 'CAP' }]);
  assert.equal(moved.run.stage, 2);
  assert.equal(moved.run.group, 'CAP');
  assert.equal(E.contentHash(moved), E.contentHash(state));
  assert.deepEqual(E.compute(moved, { now: NOW }).gate, E.compute(state, { now: NOW }).gate);
  assert.equal(moved.history.at(-1).actor.type, 'person');
});
