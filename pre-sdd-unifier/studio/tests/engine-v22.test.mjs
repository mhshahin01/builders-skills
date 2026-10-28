import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine } from './helpers.mjs';
const E = loadEngine();

test('defaultDR_thresholds_matchV22', () => {
  const v = (rtoSec, rpoSec, failureScope = 'region', budget = 'balanced') => ({ rtoSec, rpoSec, failureScope, budget });
  const cases = [
    [v(30, 0), 'active'], [v(31, 0), 'warm'], [v(900, 900), 'warm'], [v(901, 900), 'warm'],
    [v(901, 901), 'pilot'], [v(3600, 900), 'warm'], [v(3601, 900), 'pilot'],
    [v(14400, 3600, 'region', 'tight'), 'pilot'], [v(14401, 3600, 'region', 'tight'), 'backup'],
    [v(14401, 3599, 'region', 'tight'), 'pilot'], [v(14401, 3600, 'region', 'balanced'), 'pilot'],
    [v(60, 0, 'provider'), 'active'], [v(61, 0, 'provider'), 'warm'],
    [v(5, 5, 'az'), 'localHA'], [v(5, 5, 'host'), 'localHA'],
    [v(0, 60, 'cyber'), 'cyberReview'], [v(60, 60, 'cyber'), 'backup'],
    [v(null, 60), 'unresolved'], [v(60, 60, 'unknown'), 'unresolved'],
  ];
  for (const [input, want] of cases) assert.equal(E.defaultDR(input), want, JSON.stringify(input));
});

test('cl_outOfRangeInputs_returnNull', () => {
  const rejected = [
    ['utilization', 0], ['utilization', 1.01], ['availability', 0], ['availability', 100.1],
    ['cidrPrefix', 15], ['cidrPrefix', 29], ['cidrPrefix', 20.5], ['annualGrowth', -100], ['peakFactor', 0.9],
  ];
  for (const [key, value] of rejected) assert.equal(E.cl({ [key]: value }, key), null, `${key}=${value}`);
  const accepted = [['availability', 100], ['cidrPrefix', 16], ['cidrPrefix', 28], ['annualGrowth', -99]];
  for (const [key, value] of accepted) assert.equal(E.cl({ [key]: value }, key), value, `${key}=${value}`);
});

test('calculations_blankDailyTxn_chainIsNull', () => {
  const c = E.calculations({ ...E.defaults, ...E.presets.cloudSaaS, dailyTxn: null });
  for (const id of ['CALC-01', 'CALC-02', 'CALC-03', 'CALC-04']) {
    const row = c.rows.find((r) => r.id === id);
    assert.equal(row.result, null, id);
    assert.ok(row.substitution.startsWith('TBD'), `${id}: ${row.substitution}`);
  }
});

test('calculations_zeroRpo_exposureIsZero', () => {
  const c = E.calculations({ ...E.defaults, ...E.presets.cloudSaaS, rpoSec: 0 });
  assert.equal(c.exposure, 0);
  assert.equal(c.rows.find((r) => r.id === 'CALC-15').result, 0);
});

test('classify_hybridTarget_returnsTwoSubAssessments', () => {
  assert.equal(E.classify({ changeType: 'greenfield', target: 'hybrid' }), 'GF-OP + GF-CL');
});

test('exports_numericAndCheckIDs_matchV22Sets', () => {
  assert.ok(E.numeric instanceof Set);
  assert.deepEqual([...E.numeric].sort(), [...E.numIds].sort());
  assert.ok(E.checkIDs instanceof Set);
  assert.deepEqual([...E.checkIDs], ['approveReqs', 'approveSecurity', 'approveArchitecture', 'approveRisks']);
});
