import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine } from './helpers.mjs';
import { NOW, person, agent, apply, newProject } from './states.mjs';

const E = loadEngine();

const fixture = { type: 'fixture', name: 'Fixture owner', label: '' };
const policy = { type: 'policy', name: 'test-run policy', label: '' };
const CITE = { type: 'brd', text: 'BRD: REFUNDS/NFR-03' };
const NUMBERS = ['-150', '-1', '0', '0.5', '1', '16', '20.5', '28', '29', '99.9', '100', '100.5', '150', '1000'];
const CHOICES = { transactionNeed: ['yes', 'no'], queryShape: ['complex', 'simple', 'document', 'analytics', 'timeseries'], storeKind: ['relational', 'document', 'keyvalue', 'analytics', 'timeseries', 'mixed'], budgetPressure: ['tight', 'balanced', 'resilience'] };

function base() {
  return apply(newProject(), [{ op: 'set-policy', policy: { label: 'test-run policy', stand_ins: [] } }]);
}

function attempt(state, op, actor) {
  const withSource = actor.type === 'agent' ? { ...op, source: CITE } : op;
  return E.applyPatch(state, [withSource], actor, { now: NOW });
}

function cases() {
  const out = [];
  for (const row of E.ITEMS) {
    if (row.valueType !== 'number') continue;
    for (const raw of NUMBERS) out.push({ row, field: 'value', raw, op: { op: 'set', entry: `${row.id}.1`, value: raw } });
  }
  for (const [name, { row: rowId }] of Object.entries(E.FACTORS)) {
    const row = [...E.ITEMS, ...E.OVERLAY_FIELDS].find((r) => r.id === rowId);
    const samples = CHOICES[name] ? [...CHOICES[name], 'graph', 'unknown'] : E.numeric.has(name) ? NUMBERS : [];
    for (const raw of samples) out.push({ row, field: name, raw, op: { op: 'set-factor', entry: `${rowId}.1`, factor: name, value: raw } });
  }
  return out;
}

test('applyPatch_valueFieldErrorRefuses_refusedForEveryActor', () => {
  const state = base();
  let refusedCount = 0;
  for (const c of cases()) {
    const expected = E.fieldError(c.row.id, c.field, c.raw);
    for (const actor of [person, fixture, agent, policy]) {
      const r = attempt(state, c.op, actor);
      const label = `${actor.type} ${c.op.op} ${c.row.id} ${c.field} ${c.raw}`;
      if (expected) {
        assert.equal(r.errors.length, 1, `${label} must be refused`);
        const policyStoppedEarlier = actor.type === 'policy' && (c.field === 'value' ? c.row.factOnly : c.row.factOnly && !Object.hasOwn(E.APPENDIX.values, c.field));
        if (!policyStoppedEarlier) assert.equal(r.errors[0].message, expected, label);
        assert.deepEqual(r.state, state, `${label} changes nothing`);
      } else if (actor.type !== 'policy') {
        assert.deepEqual(r.errors, [], `${label} must be accepted, as fieldError accepts it`);
      }
    }
    if (expected) refusedCount += 1;
  }
  assert.ok(refusedCount > 40, `the sample covers refusals (${refusedCount})`);
});

test('applyPatch_percentageOutOfRange_refusedWithFieldErrorText', () => {
  const state = base();
  const rel = E.applyPatch(state, [{ op: 'set', entry: 'REL-01.1', value: 150 }], person, { now: NOW });
  assert.equal(rel.errors[0].message, 'Availability is a percentage above 0 and at most 100, for example 99.9.');
  assert.equal(rel.errors[0].message, E.fieldError('REL-01', 'value', '150'));
  assert.equal(E.primaryEntry(rel.state, 'REL-01').value, null);
  const read = E.applyPatch(state, [{ op: 'set', entry: 'CAP-10.1', value: '150' }], person, { now: NOW });
  assert.equal(read.errors[0].message, E.fieldError('CAP-10', 'value', '150'));
  const proposed = E.applyPatch(state, [{ op: 'propose', entry: 'REL-01.1', value: 150, reason: 'BRD REFUNDS/NFR-03' }], agent, { now: NOW });
  assert.equal(proposed.errors[0].message, E.fieldError('REL-01', 'value', '150'));
  const ok = E.applyPatch(state, [{ op: 'set', entry: 'REL-01.1', value: 100 }], person, { now: NOW });
  assert.deepEqual(ok.errors, []);
});

test('applyPatch_rangeFactorOutOfRange_refusedWithFieldErrorText', () => {
  const state = base();
  for (const value of [100, '100', 20.5, 15, 29]) {
    const r = E.applyPatch(state, [{ op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value }], person, { now: NOW });
    assert.equal(r.errors[0].message, 'The address prefix is a whole number from 16 to 28, for example 20.', String(value));
  }
  const util = E.applyPatch(state, [{ op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 16 }], fixture, { now: NOW });
  assert.equal(util.errors[0].message, E.fieldError('CAP-04', 'utilization', '16'));
  const ok = E.applyPatch(state, [{ op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value: 20 }], person, { now: NOW });
  assert.deepEqual(ok.errors, []);
});

test('applyPatch_enumRowUnknownChoice_refusedWithFieldErrorText', () => {
  const state = base();
  const rows = [...E.HEADER_FIELDS, ...E.ITEMS].filter((row) => row.valueType === 'enum');
  assert.ok(rows.length >= 9, `the sample covers the enum rows (${rows.length})`);
  let refused = 0;
  for (const row of rows) {
    for (const raw of [...row.enumValues, ` ${row.enumValues[0]} `, 'graph', 'Unknown choice']) {
      const expected = E.fieldError(row.id, 'value', raw);
      for (const actor of [person, fixture, agent, policy]) {
        const r = attempt(state, { op: 'set', entry: `${row.id}.1`, value: raw }, actor);
        const label = `${actor.type} ${row.id} ${raw}`;
        if (expected) {
          assert.equal(r.errors.length, 1, `${label} must be refused`);
          if (!(actor.type === 'policy' && row.factOnly)) assert.equal(r.errors[0].message, expected, label);
          assert.deepEqual(r.state, state, `${label} changes nothing`);
        } else if (actor.type !== 'policy') {
          assert.deepEqual(r.errors, [], `${label} must be accepted, as fieldError accepts it`);
        }
      }
      if (expected) refused += 1;
    }
  }
  assert.equal(refused, rows.length * 2);
  const scope = E.applyPatch(state, [{ op: 'set', entry: 'REL-05.1', value: 'graph' }], person, { now: NOW });
  assert.equal(scope.errors[0].message, 'Choose one of host, az, site, region, provider or cyber.');
});

test('applyPatch_enumFactorUnknownChoice_refusedWithFieldErrorText', () => {
  const state = base();
  for (const actor of [person, fixture, agent, policy]) {
    const r = attempt(state, { op: 'set-factor', entry: 'DAT-01.1', factor: 'storeKind', value: 'graph' }, actor);
    assert.equal(r.errors[0].message, E.fieldError('DAT-01', 'storeKind', 'graph'), actor.type);
    assert.match(r.errors[0].message, /^Choose one of relational, document, keyvalue, analytics, timeseries or mixed for store kind\.$/);
  }
  const ok = E.applyPatch(state, [{ op: 'set-factor', entry: 'DAT-01.1', factor: 'storeKind', value: ' relational ' }], person, { now: NOW });
  assert.deepEqual(ok.errors, []);
  assert.equal(E.primaryEntry(ok.state, 'DAT-01').factors.storeKind.value, 'relational');
});
