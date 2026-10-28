import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine } from './helpers.mjs';
import { NOW, agent, ROLES, apply, newProject, approvedState } from './states.mjs';

const E = loadEngine();

const OPTIONS = [
  { op: 'set', entry: 'REL-05.1', value: 'az' },
  { op: 'set-option', name: 'One zone pair', shape: { hosting: 'cloud', topology: 'multiAZ' } },
  { op: 'set-option', name: 'One host', shape: { hosting: 'cloud', topology: 'single' } },
  { op: 'set-option', name: 'Not shaped yet' },
];

function fragmentStatus(state, model) {
  const fragment = E.fragments(state, model, { now: NOW })['07-options.md'];
  const lines = fragment.slice(0, fragment.indexOf('**Weights**')).split('\n').filter((line) => /^\| OPT-\d+ \|/.test(line));
  return Object.fromEntries(lines.map((line) => { const cells = line.split(' | '); return [cells[0].slice(2), cells.at(-1).replace(/ \|$/, '')]; }));
}

function fragmentCounted(state, model) {
  const fragment = E.fragments(state, model, { now: NOW })['11-gate.md'];
  const table = fragment.slice(fragment.indexOf('**Sign-off register**'));
  return table.split('\n').filter((line) => line.startsWith('| ') && !line.startsWith('| Role ')).map((line) => line.split(' | ').at(-1).replace(/ \|$/, ''));
}

test('optionStatus_everyCase_matchesOptionsFragment', () => {
  const shaped = apply(apply(newProject(), OPTIONS.slice(0, 1)), OPTIONS.slice(1), agent);
  const approved = approvedState();
  const states = [
    shaped,
    approved,
    apply(approved, [{ op: 'decide', option: 'OPT-01' }]),
    apply(approved, [{ op: 'exclude-option', option: 'OPT-01', entry: 'BUS-07.1', reason: 'Breaks the EU data rule' }]),
  ];
  const seen = new Set();
  for (const state of states) {
    const model = E.compute(state, { now: NOW });
    const shown = fragmentStatus(state, model);
    assert.equal(Object.keys(shown).length, model.options.list.length);
    for (const item of model.options.list) {
      const status = E.optionStatus(state, item);
      assert.equal(status, shown[item.id], `${state.project.name}: ${item.id}`);
      seen.add(status);
    }
  }
  assert.deepEqual([...seen].sort(), ['chosen', 'excluded', 'pending', 'removed', 'shortlisted']);
});

test('signoffRecords_counted_matchesGateFragment', () => {
  const approved = approvedState();
  const partial = approvedState({ roles: ROLES.slice(1) });
  const notApplicable = apply(partial, [{ op: 'sign', role: ROLES[0], applicable: false, reason: 'No security scope in this phase' }]);
  const seen = new Set();
  for (const state of [newProject(), approved, partial, notApplicable]) {
    const model = E.compute(state, { now: NOW });
    const records = E.signoffRecords(state, model.gate);
    assert.equal(records.length, state.gate.signoffs.length, state.project.name);
    for (const r of records) {
      assert.equal(r.counted, r.applicable === true && !model.gate.g3.missingRoles.includes(r.role), r.role);
      seen.add(r.counted);
    }
    const roles = E.SIGNOFF_ROLES.filter((role) => !role.overlayOnly || state.register.overlay.applies === true);
    const expected = roles.flatMap((role) => {
      const own = records.filter((r) => r.role === role.key);
      return own.length ? own.map((r) => [r.counted ? 'Counted' : 'Not counted', ...(r.stand_in ? ['stand-in'] : [])].join(', ')) : ['Not counted'];
    });
    assert.deepEqual(fragmentCounted(state, model), expected, state.project.name);
  }
  assert.deepEqual([...seen].sort(), [false, true]);
});
