import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine } from './helpers.mjs';
import { validateAllWithSchema, validateWithSchema } from './pyschema.mjs';

const E = loadEngine();
const schemaPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'schema', 'project-state.schema.json');
const NOW = '2026-10-23T11:01:02Z';
const LATER = '2026-10-24T08:30:00Z';
const person = { type: 'person', name: 'Mahmoud', label: '' };
const agent = { type: 'agent', name: 'E2E Architect', label: '' };
const policy = { type: 'policy', name: 'test-run policy', label: 'test-run policy' };
const fixture = { type: 'fixture', name: 'Dana Reyes', label: '' };
const HORIZON = 'TCO horizon in months (ECO-03)';
const RESPONSIBLE = 'Lead architect / responsible owner';
const ROW_KEYS = ['id', 'label', 'formula', 'substitution', 'result', 'unit', 'note', 'requirement_ids', 'option'];
const ITEM_KEYS = ['id', 'name', 'hardPass', 'oneTime', 'monthly', 'tco', 'weighted', 'unknowns', 'failures'];
const TCO_NOTE = 'Undiscounted: no discount rate, inflation or price change over the horizon; one-time and monthly costs come from a person.';
const SCORE_NOTE = 'Counts every criterion with an approved weight above 0, and each needs a score; an option is ranked only when every hard check passes.';
const HOSTS = 'onprem, cloud, hybrid';
const localDr = (scope) => `Local HA recovers only inside the failed ${scope}; recovering from the loss of a ${scope} needs backup, pilot, warm or active DR.`;
const TOPOLOGIES = 'single, multiAZ, multiAZActive, regional, active';
const STRATEGIES = 'localHA, backup, pilot, warm, active';

const fresh = () => E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW });
const withPolicy = () => apply(fresh(), [{ op: 'set-policy', policy: { label: 'test-run policy', stand_ins: [] } }], person);
const option = (name, shape = {}) => ({ op: 'set-option', name, shape });
const cost = (id, which, value) => ({ op: 'set-cost', option: id, cost: which, value });
const score = (id, criterion, value) => ({ op: 'set-score', option: id, criterion, value, reason: `Scored ${value} on ${criterion}` });
const hard = (entry, value) => ({ op: 'set', entry, ...(value === undefined ? {} : { value }), kind: 'hard', reason: 'The sponsor mandates it' });
const scoped = (scope, rto, rpo) => [{ op: 'set', entry: 'REL-05.1', value: scope }, { op: 'set', entry: 'REL-03.1', value: rto }, { op: 'set', entry: 'REL-04.1', value: rpo }];

function apply(state, ops, actor, now = NOW) {
  const result = E.applyPatch(state, ops, actor, { now });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

function rejected(state, op, actor, pattern) {
  const before = JSON.stringify(state);
  const result = E.applyPatch(state, [op], actor, { now: NOW });
  assert.equal(result.errors.length, 1, JSON.stringify(result.errors));
  assert.match(result.errors[0].message, pattern);
  assert.deepEqual(result.changes, []);
  assert.equal(JSON.stringify(result.state), before);
  assert.equal(JSON.stringify(state), before);
  return result.errors[0].message;
}

function checkSchema(t, value) {
  const result = validateWithSchema(schemaPath, value);
  if (result.skipped) {
    t.skip(result.skipped);
    return null;
  }
  return result.errors;
}

function deepFreeze(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x);
    for (const value of Object.values(x)) deepFreeze(value);
  }
  return x;
}

const model = (state) => E.compute(state, { now: NOW });
const optionsOf = (state) => E.computeOptions(state, model(state));
const item = (state, id = 'OPT-01') => optionsOf(state).list.find((o) => o.id === id);
const row = (state, id) => model(state).c.rows.find((r) => r.id === id);

test('computeOptions_costsAndHorizon_tco280000', () => {
  let state = apply(fresh(), [option('One region, multi-AZ', { hosting: 'cloud', topology: 'multiAZ' })], agent);
  state = apply(state, [cost('OPT-01', 'one_time', 100000), cost('OPT-01', 'monthly', 5000), { op: 'set-horizon', value: 36 }], person);
  const got = optionsOf(state);
  assert.deepEqual(got, {
    list: [{ id: 'OPT-01', name: 'One region, multi-AZ', hardPass: true, oneTime: 100000, monthly: 5000, tco: 280000, weighted: null, unknowns: [], failures: [] }],
    horizonMonths: 36,
    weighted: false,
    flags: ['UNWEIGHTED'],
  });
  assert.deepEqual(Object.keys(got), ['list', 'horizonMonths', 'weighted', 'flags']);
  assert.deepEqual(Object.keys(got.list[0]), ITEM_KEYS);
  assert.deepEqual(model(state).options, got);
  const confirmed = apply(state, [{ op: 'confirm', option: 'OPT-01', cost: 'one_time' }, { op: 'confirm', option: 'OPT-01', cost: 'monthly' }], person, LATER);
  assert.deepEqual([item(confirmed).oneTime, item(confirmed).monthly, item(confirmed).tco], [100000, 5000, 280000]);
});

test('computeOptions_missingMonthly_tbdAndUnknown', () => {
  let state = apply(fresh(), [option('One region, multi-AZ')], agent);
  state = apply(state, [cost('OPT-01', 'one_time', 100000), { op: 'set-horizon', value: 36 }], person);
  const got = item(state);
  assert.deepEqual([got.oneTime, got.monthly, got.tco, got.unknowns], [100000, null, null, ['Monthly cost (OPT-01.monthly)']]);
  assert.deepEqual([row(state, 'CALC-21@OPT-01').substitution, row(state, 'CALC-21@OPT-01').result], ['100,000 + 36 × TBD', null]);
  const oneTimeMissing = apply(apply(fresh(), [option('Two regions, warm standby')], agent), [cost('OPT-01', 'monthly', 5000), { op: 'set-horizon', value: 36 }], person);
  assert.deepEqual([item(oneTimeMissing).tco, item(oneTimeMissing).unknowns], [null, ['One-time cost (OPT-01.one_time)']]);
  assert.equal(row(oneTimeMissing, 'CALC-21@OPT-01').substitution, 'TBD + 36 × 5,000');
  const cleared = apply(state, [cost('OPT-01', 'one_time', '')], person);
  assert.deepEqual([item(cleared).oneTime, item(cleared).unknowns], [null, ['One-time cost (OPT-01.one_time)', 'Monthly cost (OPT-01.monthly)']]);
  assert.equal(row(cleared, 'CALC-21@OPT-01').substitution, 'TBD + 36 × TBD');
});

test('computeOptions_noApprovedWeights_unweightedFlag', () => {
  const state = apply(fresh(), [option('One region, multi-AZ'), option('Two regions, warm standby'), score('OPT-01', 'nfr_fit', 4), score('OPT-02', 'nfr_fit', 3)], agent);
  const none = optionsOf(state);
  assert.deepEqual([none.weighted, none.flags, none.list.map((o) => o.weighted)], [false, ['UNWEIGHTED'], [null, null]]);
  assert.deepEqual([row(state, 'CALC-22@OPT-01').substitution, row(state, 'CALC-22@OPT-01').result], ['TBD / TBD', null]);
  const approved = apply(state, [{ op: 'set-weights', values: { nfr_fit: 2 } }], person);
  const counted = optionsOf(approved);
  assert.deepEqual([counted.weighted, counted.flags, counted.list.map((o) => o.weighted)], [true, ['ESTIMATED-SCORES'], [4, 3]]);
  const edits = {
    'no weights': (o) => { o.weights = null; },
    'values null': (o) => { o.weights.values = null; },
    'no weight above 0': (o) => { o.weights.values = { nfr_fit: 0, reversibility: 0 }; },
    'empty values': (o) => { o.weights.values = {}; },
    'text weight only': (o) => { o.weights.values = { nfr_fit: '2' }; },
    'boolean weight only': (o) => { o.weights.values = { nfr_fit: true }; },
    'blank approver': (o) => { o.weights.approved_by = ''; },
    'whitespace approver': (o) => { o.weights.approved_by = '   '; },
    'no approver': (o) => { o.weights.approved_by = null; },
    'date only': (o) => { o.weights.approved_at = '2026-10-23'; },
    'offset time': (o) => { o.weights.approved_at = '2026-10-23T13:01:02+02:00'; },
    'no time': (o) => { o.weights.approved_at = null; },
  };
  for (const [name, edit] of Object.entries(edits)) {
    const edited = structuredClone(approved);
    edit(edited.options);
    const got = optionsOf(edited);
    assert.deepEqual([got.weighted, got.flags, got.list.map((o) => o.weighted)], [false, ['UNWEIGHTED'], [null, null]], name);
    assert.equal(row(edited, 'CALC-22@OPT-01').substitution, 'TBD / TBD', name);
  }
});

test('computeOptions_approvedWeights_weighted3point2', () => {
  let state = apply(fresh(), [option('One region, multi-AZ'), score('OPT-01', 'one_time_cost', 4), score('OPT-01', 'reversibility', 2)], agent);
  state = apply(state, [{ op: 'set-weights', values: { one_time_cost: 3, reversibility: 2 } }, { op: 'confirm', option: 'OPT-01', criterion: 'one_time_cost' }, { op: 'confirm', option: 'OPT-01', criterion: 'reversibility' }], person);
  const got = optionsOf(state);
  assert.deepEqual([got.weighted, got.flags, got.list[0].hardPass, got.list[0].weighted], [true, [], true, 3.2]);
  assert.deepEqual([row(state, 'CALC-22@OPT-01').substitution, row(state, 'CALC-22@OPT-01').result], ['(3 × 4 + 2 × 2) / (3 + 2)', 3.2]);
  const unweightedScore = apply(state, [score('OPT-01', 'nfr_fit', 1)], agent);
  assert.deepEqual([item(unweightedScore).weighted, optionsOf(unweightedScore).flags], [3.2, []]);
  const unscoredWeight = apply(state, [{ op: 'set-weights', values: { one_time_cost: 3, reversibility: 2, operability: 5 } }], person);
  assert.deepEqual([item(unscoredWeight).weighted, item(unscoredWeight).unknowns.filter((u) => u.startsWith('Score')), row(unscoredWeight, 'CALC-22@OPT-01').substitution], [null, ['Score for operability (OPT-01.operability, weight 5)'], '(3 × 4 + 5 × TBD + 2 × 2) / (3 + 5 + 2)']);
  const fractional = apply(state, [{ op: 'set-weights', values: { one_time_cost: 1.5, reversibility: 0.125 } }], person);
  assert.deepEqual([item(fractional).weighted, row(fractional, 'CALC-22@OPT-01').substitution], [6.25 / 1.625, '(1.5 × 4 + 0.125 × 2) / (1.5 + 0.125)']);
});

test('computeOptions_hardFail_notRanked', () => {
  let state = apply(fresh(), [hard('HDR-08.1', 'cloud'), { op: 'set-weights', values: { one_time_cost: 3, reversibility: 2 } }], person);
  state = apply(state, [
    option('On-prem pair', { hosting: 'onprem' }), option('One region, multi-AZ', { hosting: 'cloud' }), option('Hosting open'),
    score('OPT-01', 'one_time_cost', 5), score('OPT-01', 'reversibility', 5),
    score('OPT-02', 'one_time_cost', 4), score('OPT-02', 'reversibility', 2),
    score('OPT-03', 'one_time_cost', 5), score('OPT-03', 'reversibility', 5),
  ], agent);
  const got = optionsOf(state);
  assert.deepEqual(got.list.map((o) => [o.id, o.hardPass, o.weighted, o.unknowns.filter((u) => !u.includes('cost') && u !== HORIZON)]), [
    ['OPT-01', false, null, []],
    ['OPT-02', true, 3.2, []],
    ['OPT-03', null, null, ['Hosting check (hard HDR-08: cloud): shape.hosting is blank']],
  ]);
  assert.deepEqual([row(state, 'CALC-22@OPT-01').substitution, row(state, 'CALC-22@OPT-01').result], ['(3 × 5 + 2 × 5) / (3 + 2)', null]);
  assert.deepEqual([row(state, 'CALC-22@OPT-03').substitution, row(state, 'CALC-22@OPT-03').result], ['(3 × 5 + 2 × 5) / (3 + 2)', null]);
  assert.deepEqual(got.flags, ['ESTIMATED-SCORES']);
  assert.deepEqual(got.list.map((o) => o.failures), [[{ check: 'hosting', ref: 'HDR-08.1', message: 'OPT-01 hosting onprem does not meet HDR-08.1 (hard): cloud.' }], [], []]);
  const confirmed = apply(state, [{ op: 'confirm', option: 'OPT-02', criterion: 'one_time_cost' }, { op: 'confirm', option: 'OPT-02', criterion: 'reversibility' }], person);
  assert.deepEqual([optionsOf(confirmed).flags, optionsOf(confirmed).list.map((o) => o.weighted)], [[], [null, 3.2, null]]);
});

test('computeOptions_failedOption_failuresNameCheckRefAndMessage', () => {
  const ops = [
    hard('HDR-08.1', 'cloud'), hard('INT-08.1', 'private'),
    { op: 'set', entry: 'REL-05.1', value: 'az' }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' },
    { op: 'set', entry: 'REL-03.1', value: 5, scope: 'az' }, { op: 'add', row: 'REL-03', scope: 'region' }, { op: 'set', entry: 'REL-03.2', value: 600 }, { op: 'set', entry: 'REL-04.1', value: 60 },
  ];
  const state = apply(apply(fresh(), ops, person), [
    option('One zone, on-prem, public', { hosting: 'onprem', network: 'public', topology: 'single', dr: 'active' }),
    option('Two cloud regions, private, warm standby', { hosting: 'cloud', network: 'private', topology: 'regional', dr: 'warm' }),
    option('Cloud, private, shape open', { hosting: 'cloud', network: 'private' }),
  ], agent);
  const [failed, passed, open] = optionsOf(state).list;
  assert.deepEqual(failed.failures, [
    { check: 'hosting', ref: 'HDR-08.1', message: 'OPT-01 hosting onprem does not meet HDR-08.1 (hard): cloud.' },
    { check: 'network', ref: 'INT-08.1', message: 'OPT-01 network public does not meet INT-08.1 (hard): private.' },
    { check: 'topology-dr', ref: 'CONFLICT-zone@az', message: 'Single fault-zone topology cannot tolerate loss of that zone without separate recovery.' },
    { check: 'topology-dr', ref: 'CONFLICT-region@region', message: 'Selected single-region placement cannot independently survive an entire region/provider outage.' },
    { check: 'topology-dr', ref: 'CONFLICT-active-dr@region', message: 'Multi-site Active-Active was selected for DR, but the proposed topology is not active-active across independent sites. Align the designs or revise the strategy.' },
  ]);
  for (const f of failed.failures) assert.deepEqual(Object.keys(f), ['check', 'ref', 'message']);
  assert.deepEqual([failed.hardPass, failed.unknowns.filter((u) => u.includes(' check '))], [false, []]);
  assert.deepEqual([passed.hardPass, passed.failures], [true, []]);
  assert.deepEqual([open.hardPass, open.failures, open.unknowns.filter((u) => u.includes(' check '))], [null, [], ['Topology and DR check (REL-05 names az, region): shape.topology is blank; shape.dr is blank']]);
  for (const o of optionsOf(state).list) assert.equal(o.hardPass === false, o.failures.length > 0, o.id);
  const renumbered = structuredClone(state);
  renumbered.register.header['HDR-08'][0].n = 2;
  assert.throws(() => item(renumbered), { name: 'Error', message: "The project state cannot be read:\n- HDR-08.2 is marked primary, but only the entry with n 1 is primary; set primary to false, or set n to 1 if it is the row's first entry." }, 'a primary entry renumbered by hand is a gate rejection');
});

test('computeOptions_calcRows_cite21And22', () => {
  let state = apply(fresh(), [option('One region, multi-AZ'), option('Two regions, warm standby'), score('OPT-01', 'nfr_fit', 4)], agent);
  state = apply(state, [cost('OPT-01', 'one_time', 100000), cost('OPT-01', 'monthly', 5000), { op: 'set-horizon', value: 36 }, { op: 'set-weights', values: { nfr_fit: 2 } }], person);
  const { v, c } = model(state);
  const v22 = E.calculations(v).rows;
  assert.equal(v22.length, 20);
  assert.deepEqual(c.rows.slice(0, 20), v22);
  assert.deepEqual(c.rows.slice(20).map((r) => r.id), ['CALC-21@OPT-01', 'CALC-22@OPT-01', 'CALC-21@OPT-02', 'CALC-22@OPT-02']);
  for (const r of c.rows.slice(20)) assert.deepEqual(Object.keys(r), ROW_KEYS, r.id);
  assert.deepEqual(c.rows[20], { id: 'CALC-21@OPT-01', label: 'Option total cost of ownership', formula: 'one_time_cost + horizon_months × monthly_cost', substitution: '100,000 + 36 × 5,000', result: 280000, unit: 'currency units', note: TCO_NOTE, requirement_ids: [], option: 'OPT-01' });
  assert.deepEqual(c.rows[21], { id: 'CALC-22@OPT-01', label: 'Option weighted score', formula: 'sum(weight × score) / sum(weight)', substitution: '(2 × 4) / (2)', result: 4, unit: 'score (1 to 5)', note: SCORE_NOTE, requirement_ids: [], option: 'OPT-01' });
  assert.deepEqual(c.rows.slice(22).map((r) => [r.substitution, r.result, r.option]), [['TBD + 36 × TBD', null, 'OPT-02'], ['(2 × TBD) / (2)', null, 'OPT-02']]);
  assert.equal(model(fresh()).c.rows.length, 20);
  assert.equal(E.calculations(v).rows.length, 20);
});

test('setHorizon_agentAndPolicy_refused', () => {
  const state = withPolicy();
  const op = { op: 'set-horizon', value: 36 };
  const plain = (who) => new RegExp(`^The TCO horizon is a business figure from the owners of ECO-03 \\(business and finance\\) and, like option costs \\(decision 6\\), comes from a person; ${who} never sets it\\.$`);
  rejected(state, op, agent, plain('an agent'));
  rejected(state, op, policy, plain('an answer policy'));
  for (const actor of [person, fixture]) {
    const result = E.applyPatch(state, [op], actor, { now: NOW });
    assert.deepEqual(result.errors, [], actor.type);
    assert.equal(result.state.options.horizon_months, 36, actor.type);
  }
  const set = apply(state, [op], person);
  rejected(set, { op: 'set-horizon', value: '' }, agent, plain('an agent'));
  rejected(set, { op: 'set-horizon', value: 24 }, policy, plain('an answer policy'));
});

test('setHorizon_blank_clearsToNull', () => {
  const set = E.applyPatch(fresh(), [{ op: 'set-horizon', value: 36 }], person, { now: NOW });
  assert.deepEqual(set.errors, []);
  assert.equal(set.state.options.horizon_months, 36);
  assert.deepEqual(set.changes, [{ at: NOW, actor: { type: 'person', name: 'Mahmoud', label: 'Mahmoud' }, op: 'set-horizon', target: 'options.horizon_months', from: null, to: 36, reason: null }]);
  assert.deepEqual(set.state.history, set.changes);
  for (const value of ['', '   ', null]) {
    const cleared = E.applyPatch(set.state, [{ op: 'set-horizon', value }], fixture, { now: LATER });
    assert.deepEqual(cleared.errors, [], JSON.stringify(value));
    assert.equal(cleared.state.options.horizon_months, null);
    assert.deepEqual(cleared.changes.map((x) => [x.at, x.op, x.target, x.from, x.to]), [[LATER, 'set-horizon', 'options.horizon_months', 36, null]]);
  }
  const again = E.applyPatch(set.state, [{ op: 'set-horizon', value: '36' }], person, { now: LATER });
  assert.deepEqual([again.errors, again.changes, again.state.history.length], [[], [], 1]);
  const changed = E.applyPatch(set.state, [{ op: 'set-horizon', value: ' 60 ' }], person, { now: LATER });
  assert.deepEqual([changed.state.options.horizon_months, changed.changes.map((x) => [x.from, x.to])], [60, [[36, 60]]]);
  const nothing = E.applyPatch(fresh(), [{ op: 'set-horizon', value: '' }], person, { now: NOW });
  assert.deepEqual([nothing.errors, nothing.changes], [[], []]);
  for (const value of [0, -12, 1.5, '36 months', 'thirty-six', true, '0x24', {}]) rejected(fresh(), { op: 'set-horizon', value }, person, /^The TCO horizon is a whole number of months, 1 or more; got /);
  assert.match(rejected(fresh(), { op: 'set-horizon', value: 0 }, person, /got 0\.$/), /1 or more/);
  rejected(fresh(), { op: 'set-horizon' }, person, /^set-horizon needs a value; a blank value clears the horizon\.$/);
  rejected(fresh(), { op: 'set-horizon', value: 36, months: 36 }, person, /^set-horizon does not take months; it takes value\.$/);
});

test('computeOptions_hostingBreaksHardHdr08_hardPassFalse', () => {
  const shaped = (state, hosting) => apply(state, [option('Candidate', { hosting })], agent);
  const cloud = apply(fresh(), [hard('HDR-08.1', 'cloud')], person);
  assert.deepEqual(['onprem', 'hybrid', 'cloud'].map((h) => [item(shaped(cloud, h)).hardPass, item(shaped(cloud, h)).unknowns.filter((u) => u.startsWith('Hosting'))]), [[false, []], [false, []], [true, []]]);
  assert.deepEqual(item(shaped(cloud, 'hybrid')).failures, [{ check: 'hosting', ref: 'HDR-08.1', message: 'OPT-01 hosting hybrid does not meet HDR-08.1 (hard): cloud.' }]);
  const confirmed = apply(cloud, [{ op: 'confirm', entry: 'HDR-08.1' }], person);
  assert.equal(item(shaped(confirmed, 'onprem')).hardPass, false);
  const onprem = apply(fresh(), [hard('HDR-08.1', 'onprem')], person);
  assert.deepEqual([item(shaped(onprem, 'onprem')).hardPass, item(shaped(onprem, 'cloud')).hardPass], [true, false]);
  const hybrid = apply(fresh(), [hard('HDR-08.1', 'hybrid')], person);
  assert.deepEqual([item(shaped(hybrid, 'hybrid')).hardPass, item(shaped(hybrid, 'cloud')).hardPass], [true, false]);
  const target = apply(fresh(), [{ op: 'set', entry: 'HDR-08.1', value: 'cloud' }], person);
  const assumption = apply(fresh(), [{ op: 'set', entry: 'HDR-08.1', value: 'cloud', kind: 'assumption', reason: 'A working assumption, not a mandate' }], person);
  const undecided = apply(fresh(), [hard('HDR-08.1', 'undecided')], person);
  const open = apply(fresh(), [hard('HDR-08.1')], person);
  const noPrimary = structuredClone(cloud);
  noPrimary.register.header['HDR-08'][0].primary = false;
  assert.throws(() => item(shaped(noPrimary, 'onprem')), { name: 'Error', message: 'The project state cannot be read:\n- HDR-08.1 has n 1 but is not marked primary; the entry with n 1 is the primary entry, so set primary to true.' }, 'an entry 1 that is not primary is a gate rejection');
  for (const [name, state] of Object.entries({ target, assumption, undecided, open })) assert.deepEqual([item(shaped(state, 'onprem')).hardPass, item(shaped(state, '')).hardPass], [true, true], name);
  const blank = shaped(cloud, '');
  assert.deepEqual([item(blank).hardPass, item(blank).unknowns.filter((u) => !u.includes('cost') && u !== HORIZON)], [null, ['Hosting check (hard HDR-08: cloud): shape.hosting is blank']]);
  const odd = shaped(cloud, 'Cloud');
  assert.deepEqual([item(odd).hardPass, item(odd).failures, item(odd).unknowns.filter((u) => u.startsWith('Hosting'))], [null, [], [`Hosting check (hard HDR-08: cloud): shape.hosting "Cloud" is not one of ${HOSTS}`]]);
});

test('computeOptions_undecidedHostingHardHdr08_hardPassNull', () => {
  const undecided = (state) => item(apply(state, [option('Hosting not chosen yet', { hosting: 'undecided' })], agent));
  const cloud = apply(fresh(), [hard('HDR-08.1', 'cloud')], person);
  const got = undecided(cloud);
  assert.deepEqual([got.hardPass, got.failures, got.unknowns.filter((u) => u.startsWith('Hosting'))], [null, [], [`Hosting check (hard HDR-08: cloud): shape.hosting "undecided" is not one of ${HOSTS}`]]);
  for (const value of ['onprem', 'hybrid']) assert.deepEqual([undecided(apply(fresh(), [hard('HDR-08.1', value)], person)).hardPass, undecided(apply(fresh(), [hard('HDR-08.1', value)], person)).failures], [null, []], value);
  const network = item(apply(apply(cloud, [hard('INT-08.1', 'private')], person), [option('Hosting not chosen, public network', { hosting: 'undecided', network: 'public' })], agent));
  assert.deepEqual([network.hardPass, network.failures.map((f) => f.check), network.unknowns.filter((u) => u.startsWith('Hosting')).length], [false, ['network'], 1]);
});

test('computeOptions_networkBreaksHardInt08_hardPassFalse', () => {
  const shaped = (state, network) => apply(state, [option('Candidate', { network })], agent);
  const privateOnly = apply(fresh(), [hard('INT-08.1', 'private')], person);
  assert.deepEqual(['public', 'hybrid', 'partner', 'private'].map((n) => item(shaped(privateOnly, n)).hardPass), [false, false, false, true]);
  const partner = apply(fresh(), [hard('INT-08.1', 'partner')], person);
  assert.deepEqual([item(shaped(partner, 'partner')).hardPass, item(shaped(partner, 'private')).hardPass], [true, false]);
  const blank = shaped(privateOnly, '');
  assert.deepEqual([item(blank).hardPass, item(blank).unknowns.filter((u) => u.startsWith('Network'))], [null, ['Network check (hard INT-08: private): shape.network is blank']]);
  assert.deepEqual(item(shaped(privateOnly, 'VPN')).unknowns.filter((u) => u.startsWith('Network')), ['Network check (hard INT-08: private): shape.network "VPN" is not one of public, private, hybrid, partner']);
  const soft = apply(fresh(), [{ op: 'set', entry: 'INT-08.1', value: 'private' }], person);
  const open = apply(fresh(), [hard('INT-08.1')], person);
  const na = apply(fresh(), [{ op: 'na', entry: 'INT-08.1', reason: 'No network constraint applies' }, hard('INT-08.1')], person);
  for (const [name, state] of Object.entries({ soft, open, na })) assert.deepEqual([item(shaped(state, 'public')).hardPass, item(shaped(state, '')).unknowns], [true, ['One-time cost (OPT-01.one_time)', 'Monthly cost (OPT-01.monthly)', HORIZON]], name);
  const both = apply(fresh(), [hard('INT-08.1', 'private'), hard('HDR-08.1', 'cloud')], person);
  assert.deepEqual(item(shaped(both, '')).unknowns.slice(0, 2), ['Hosting check (hard HDR-08: cloud): shape.hosting is blank', 'Network check (hard INT-08: private): shape.network is blank']);
});

test('computeOptions_topologyConflictsWithRegionScope_hardPassFalse', () => {
  const state = apply(apply(fresh(), scoped('region', 600, 60), person), [
    option('One region, multi-AZ', { topology: 'multiAZ', dr: 'warm' }),
    option('Two regions, warm standby', { topology: 'regional', dr: 'warm' }),
    option('Two regions, active DR without active serving', { topology: 'regional', dr: 'active' }),
    option('Two regions, active-active', { topology: 'active', dr: 'active' }),
  ], agent);
  const passes = (s) => optionsOf(s).list.map((o) => o.hardPass);
  assert.deepEqual(optionsOf(state).list.map((o) => [o.id, o.hardPass, o.unknowns.filter((u) => u.startsWith('Topology'))]), [['OPT-01', false, []], ['OPT-02', true, []], ['OPT-03', false, []], ['OPT-04', true, []]]);
  for (const [topology, dr] of [['single', 'backup'], ['active', 'active'], ['multiAZ', 'warm']]) {
    const decided = structuredClone(state);
    Object.assign(decided.decisions, { topology_override: topology, dr_overrides: { region: dr }, override_reason: 'The owner prefers it' });
    assert.deepEqual(passes(decided), [false, true, false, true], `${topology} ${dr}`);
  }
  const asOption = structuredClone(state);
  Object.assign(asOption.decisions, { topology_override: 'multiAZ', dr_overrides: { region: 'warm' }, override_reason: 'Same as OPT-01' });
  assert.deepEqual(model(asOption).shape.conflicts.map((x) => x.id), ['CONFLICT-region@region']);
});

test('computeOptions_optionDr_appliesToRemoteScopesOnly', () => {
  const az = apply(apply(fresh(), scoped('az', 5, 60), person), [option('Multi-AZ, active DR', { topology: 'multiAZ', dr: 'active' }), option('Multi-AZ, no DR', { topology: 'multiAZ' }), option('One zone', { topology: 'single', dr: 'warm' })], agent);
  assert.deepEqual(optionsOf(az).list.map((o) => [o.hardPass, o.unknowns.filter((u) => u.startsWith('Topology'))]), [[true, []], [true, []], [false, []]]);
  const azDecided = structuredClone(az);
  Object.assign(azDecided.decisions, { topology_override: 'single', dr_overrides: { az: 'active' }, override_reason: 'The owner prefers it' });
  assert.deepEqual(optionsOf(azDecided).list.map((o) => o.hardPass), [true, true, false]);
  for (const scope of ['site', 'region', 'provider']) {
    const state = apply(apply(fresh(), scoped(scope, 600, 60), person), [option('Two sites, active DR', { hosting: 'onprem', topology: 'regional', dr: 'active' }), option('Two sites, warm standby', { hosting: 'onprem', topology: 'regional', dr: 'warm' }), option('Two sites, no DR', { hosting: 'onprem', topology: 'regional' })], agent);
    assert.deepEqual(optionsOf(state).list.map((o) => o.hardPass), [false, true, null], scope);
    assert.deepEqual(item(state, 'OPT-03').unknowns.filter((u) => u.startsWith('Topology')), [`Topology and DR check (REL-05 names ${scope}): shape.dr is blank`], scope);
  }
  const mixed = apply(apply(fresh(), [...scoped('az', 5, 60), { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }, { op: 'add', row: 'REL-03', scope: 'region' }, { op: 'set', entry: 'REL-03.2', value: 600 }], person), [option('Two regions, active DR', { topology: 'regional', dr: 'active' }), option('Two regions, warm standby', { topology: 'regional', dr: 'warm' }), option('Two regions, no DR', { topology: 'regional' })], agent);
  assert.deepEqual(optionsOf(mixed).list.map((o) => o.hardPass), [false, true, null]);
  assert.deepEqual(item(mixed, 'OPT-03').unknowns.filter((u) => u.startsWith('Topology')), ['Topology and DR check (REL-05 names az, region): shape.dr is blank']);
});

test('computeOptions_providerScopeHybridOption_noProviderConflict', () => {
  const ops = [{ op: 'set', entry: 'HDR-08.1', value: 'cloud' }, { op: 'set', entry: 'REL-05.1', value: 'region' }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'provider' }, { op: 'set', entry: 'REL-03.1', value: 600 }, { op: 'set', entry: 'REL-04.1', value: 60 }];
  const state = apply(apply(fresh(), ops, person), [
    option('Two cloud regions, warm standby', { hosting: 'cloud', topology: 'regional', dr: 'warm' }),
    option('Cloud and on-prem, warm standby', { hosting: 'hybrid', topology: 'regional', dr: 'warm' }),
    option('Two own sites, warm standby', { hosting: 'onprem', topology: 'regional', dr: 'warm' }),
  ], agent);
  assert.deepEqual([E.toCalcInputs(state).v.target, E.primaryEntry(state, 'HDR-08').kind], ['cloud', 'target']);
  const provider = 'Two regions in one provider cannot by themselves satisfy whole-provider outage tolerance. An independent provider/hosting strategy needs assessment.';
  const want = [
    ['OPT-01', false, [{ check: 'topology-dr', ref: 'CONFLICT-provider@provider', message: provider }], []],
    ['OPT-02', true, [], []],
    ['OPT-03', true, [], []],
  ];
  const results = (s) => optionsOf(s).list.map((o) => [o.id, o.hardPass, o.failures, o.unknowns.filter((u) => u.startsWith('Topology'))]);
  assert.deepEqual(results(state), want);
  assert.deepEqual(results(apply(state, [{ op: 'set', entry: 'HDR-08.1', value: 'onprem' }], person)), want);
  assert.deepEqual(results(apply(state, [{ op: 'set', entry: 'HDR-08.1', value: '' }], person)), want);
});

test('computeOptions_providerScopeBlankHosting_hardPassNullAndUnknown', () => {
  const provider = apply(fresh(), scoped('provider', 600, 60), person);
  const check = (shape) => {
    const got = item(apply(provider, [option('Candidate', shape)], agent));
    return [got.hardPass, got.failures, got.unknowns.filter((u) => u.startsWith('Topology'))];
  };
  const head = 'Topology and DR check (REL-05 names provider): ';
  assert.deepEqual(check({ topology: 'regional', dr: 'warm' }), [null, [], [`${head}shape.hosting is blank`]]);
  for (const hosting of ['undecided', 'AWS']) assert.deepEqual(check({ hosting, topology: 'regional', dr: 'warm' }), [null, [], [`${head}shape.hosting "${hosting}" is not one of ${HOSTS}`]], hosting);
  assert.deepEqual(check({}), [null, [], [`${head}shape.topology is blank; shape.dr is blank; shape.hosting is blank`]]);
  for (const hosting of ['onprem', 'hybrid']) assert.deepEqual(check({ hosting, topology: 'regional', dr: 'warm' }), [true, [], []], hosting);
  assert.deepEqual(check({ hosting: 'cloud', topology: 'regional', dr: 'warm' }).slice(0, 2), [false, [{ check: 'topology-dr', ref: 'CONFLICT-provider@provider', message: 'Two regions in one provider cannot by themselves satisfy whole-provider outage tolerance. An independent provider/hosting strategy needs assessment.' }]]);
  for (const scope of ['region', 'site']) {
    const got = item(apply(apply(fresh(), scoped(scope, 600, 60), person), [option('Candidate', { topology: 'regional', dr: 'warm' })], agent));
    assert.deepEqual([got.hardPass, got.unknowns.filter((u) => u.startsWith('Topology'))], [true, []], scope);
  }
});

test('computeOptions_blankTopologyWithNamedScope_hardPassNullAndUnknown', () => {
  const region = apply(fresh(), scoped('region', 600, 60), person);
  const check = (shape) => {
    const got = item(apply(region, [option('Candidate', shape)], agent));
    return [got.hardPass, got.unknowns.filter((u) => !u.includes('cost') && u !== HORIZON)];
  };
  const head = 'Topology and DR check (REL-05 names region): ';
  assert.deepEqual(check({ dr: 'warm' }), [null, [`${head}shape.topology is blank`]]);
  assert.deepEqual(check({ topology: 'undetermined', dr: 'warm' }), [null, [`${head}shape.topology "undetermined" is not one of ${TOPOLOGIES}`]]);
  assert.deepEqual(check({ topology: 'regional' }), [null, [`${head}shape.dr is blank`]]);
  for (const dr of ['unresolved', 'cyberReview', 'Warm']) assert.deepEqual(check({ topology: 'regional', dr }), [null, [`${head}shape.dr "${dr}" is not one of ${STRATEGIES}`]], dr);
  assert.deepEqual(check({}), [null, [`${head}shape.topology is blank; shape.dr is blank`]]);
  assert.deepEqual(check({ topology: 'regional', dr: 'warm' }), [true, []]);
  assert.deepEqual(check({ topology: 'regional', dr: 'localHA' }), [false, []]);
  const failing = apply(apply(region, [hard('HDR-08.1', 'cloud')], person), [option('On-prem, shape open', { hosting: 'onprem' })], agent);
  assert.deepEqual([item(failing).hardPass, item(failing).unknowns.filter((u) => u.startsWith('Topology'))], [false, [`${head}shape.topology is blank; shape.dr is blank`]]);
  const unnamed = apply(fresh(), [option('Candidate')], agent);
  assert.deepEqual([item(unnamed).hardPass, item(unnamed).unknowns.filter((u) => u.startsWith('Topology'))], [true, []]);
  const secondNamed = apply(apply(fresh(), [{ op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }], person), [option('Candidate', { dr: 'warm' })], agent);
  assert.equal(E.primaryEntry(secondNamed, 'REL-05').status, 'Open');
  assert.deepEqual([item(secondNamed).hardPass, item(secondNamed).unknowns.filter((u) => u.startsWith('Topology'))], [null, [`${head}shape.topology is blank`]]);
});

test('computeOptions_localHaWithRegionScope_hardPassFalse', () => {
  const region = apply(apply(fresh(), scoped('region', 600, 60), person), [option('Two regions, local HA only', { topology: 'regional', dr: 'localHA' })], agent);
  assert.deepEqual([item(region).hardPass, item(region).failures, item(region).unknowns.filter((u) => u.startsWith('Topology'))], [false, [{ check: 'topology-dr', ref: 'CONFLICT-local-dr@region', message: localDr('region') }], []]);
  const remote = [
    { op: 'set', entry: 'REL-05.1', value: 'site' }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.3', value: 'provider' },
    { op: 'set', entry: 'REL-03.1', value: 600 }, { op: 'set', entry: 'REL-04.1', value: 60 },
  ];
  const three = apply(apply(fresh(), remote, person), [option('Own sites, local HA only', { hosting: 'onprem', topology: 'regional', dr: 'localHA' })], agent);
  assert.deepEqual(item(three).failures.map((f) => [f.check, f.ref, f.message]), ['site', 'region', 'provider'].map((scope) => ['topology-dr', `CONFLICT-local-dr@${scope}`, localDr(scope)]));
  const provider = apply(apply(fresh(), scoped('provider', 600, 60), person), [option('Two cloud regions, local HA only', { hosting: 'cloud', topology: 'regional', dr: 'localHA' })], agent);
  assert.deepEqual(item(provider).failures.map((f) => f.ref), ['CONFLICT-provider@provider', 'CONFLICT-local-dr@provider']);
  const az = apply(apply(fresh(), scoped('az', 5, 60), person), [option('Multi-AZ, local HA', { topology: 'multiAZ', dr: 'localHA' })], agent);
  assert.deepEqual([item(az).hardPass, item(az).failures, item(az).unknowns.filter((u) => u.startsWith('Topology'))], [true, [], []]);
  const azRegion = apply(apply(fresh(), [...scoped('az', 5, 60), { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }], person), [option('Two regions, local HA only', { topology: 'regional', dr: 'localHA' })], agent);
  assert.deepEqual(item(azRegion).failures.map((f) => f.ref), ['CONFLICT-local-dr@region']);
  const handEdited = structuredClone(region);
  Object.assign(handEdited.decisions, { dr_overrides: { region: 'localHA' }, override_reason: 'Hand-edited state' });
  assert.throws(() => model(handEdited), { name: 'Error', message: 'The project state cannot be read:\n- decisions.dr_overrides.region is "localHA", which is not a DR strategy; give one of backup, pilot, warm or active, or remove the key for no override.' }, 'a stored localHA override is outside the schema enum, so the gate rejects it');
});

test('computeOptions_nullHorizon_tcoNullForEveryOption', () => {
  let state = apply(fresh(), [option('One region, multi-AZ'), option('Two regions, warm standby')], agent);
  state = apply(state, [cost('OPT-01', 'one_time', 100000), cost('OPT-01', 'monthly', 5000), cost('OPT-02', 'one_time', 0), cost('OPT-02', 'monthly', 0)], person);
  const got = optionsOf(state);
  assert.equal(got.horizonMonths, null);
  assert.deepEqual(got.list.map((o) => [o.oneTime, o.monthly, o.tco, o.unknowns]), [[100000, 5000, null, [HORIZON]], [0, 0, null, [HORIZON]]]);
  assert.deepEqual(model(state).c.rows.filter((r) => r.id.startsWith('CALC-21@')).map((r) => [r.substitution, r.result]), [['100,000 + TBD × 5,000', null], ['0 + TBD × 0', null]]);
  const one = apply(state, [{ op: 'set-horizon', value: 1 }], person);
  assert.deepEqual([optionsOf(one).horizonMonths, optionsOf(one).list.map((o) => [o.tco, o.unknowns])], [1, [[105000, []], [0, []]]]);
  const cleared = apply(one, [{ op: 'set-horizon', value: '' }], person);
  assert.deepEqual(optionsOf(cleared).list.map((o) => o.tco), [null, null]);
});

test('computeOptions_missingWeightedScore_weightedNullAndUnknown', () => {
  let state = apply(fresh(), [hard('HDR-08.1', 'cloud'), { op: 'set-weights', values: { one_time_cost: 3, reversibility: 2, operability: 1 } }], person);
  state = apply(state, [
    option('Fully scored', { hosting: 'cloud' }), option('Reversibility missing', { hosting: 'cloud' }), option('Nothing scored', { hosting: 'cloud' }), option('On-prem, reversibility missing', { hosting: 'onprem' }),
    score('OPT-01', 'one_time_cost', 4), score('OPT-01', 'operability', 2), score('OPT-01', 'reversibility', 2),
    score('OPT-02', 'one_time_cost', 4), score('OPT-02', 'operability', 2),
    score('OPT-04', 'one_time_cost', 4), score('OPT-04', 'operability', 2),
  ], agent);
  const missing = (o) => o.unknowns.filter((u) => u.startsWith('Score'));
  const got = optionsOf(state);
  assert.deepEqual(got.list.map((o) => [o.id, o.hardPass, o.weighted, missing(o)]), [
    ['OPT-01', true, 3, []],
    ['OPT-02', true, null, ['Score for reversibility (OPT-02.reversibility, weight 2)']],
    ['OPT-03', true, null, ['Score for one_time_cost (OPT-03.one_time_cost, weight 3)', 'Score for operability (OPT-03.operability, weight 1)', 'Score for reversibility (OPT-03.reversibility, weight 2)']],
    ['OPT-04', false, null, ['Score for reversibility (OPT-04.reversibility, weight 2)']],
  ]);
  assert.deepEqual(model(state).c.rows.filter((r) => r.id.startsWith('CALC-22@')).map((r) => [r.substitution, r.result]), [
    ['(3 × 4 + 1 × 2 + 2 × 2) / (3 + 1 + 2)', 3],
    ['(3 × 4 + 1 × 2 + 2 × TBD) / (3 + 1 + 2)', null],
    ['(3 × TBD + 1 × TBD + 2 × TBD) / (3 + 1 + 2)', null],
    ['(3 × 4 + 1 × 2 + 2 × TBD) / (3 + 1 + 2)', null],
  ]);
  assert.deepEqual(got.flags, ['ESTIMATED-SCORES']);
  assert.deepEqual(item(state, 'OPT-02').unknowns, ['One-time cost (OPT-02.one_time)', 'Monthly cost (OPT-02.monthly)', HORIZON, 'Score for reversibility (OPT-02.reversibility, weight 2)']);
  const filled = apply(state, [score('OPT-02', 'reversibility', 5)], agent);
  assert.deepEqual([item(filled, 'OPT-02').weighted, missing(item(filled, 'OPT-02'))], [4, []]);
  const unapproved = structuredClone(state);
  unapproved.options.weights.approved_by = '';
  assert.deepEqual(optionsOf(unapproved).list.map(missing), [[], [], [], []]);
  const small = apply(state, [{ op: 'set-weights', values: { one_time_cost: 3, reversibility: 0.125 } }], person);
  assert.deepEqual(missing(item(small, 'OPT-02')), ['Score for reversibility (OPT-02.reversibility, weight 0.125)']);
  const large = apply(state, [{ op: 'set-weights', values: { one_time_cost: 3, reversibility: 1234.5 } }], person);
  assert.deepEqual([missing(item(large, 'OPT-02')), row(large, 'CALC-22@OPT-02').substitution], [['Score for reversibility (OPT-02.reversibility, weight 1,234.5)'], '(3 × 4 + 1,234.5 × TBD) / (3 + 1,234.5)']);
});

test('computeOptions_zeroWeightCriterion_ignored', () => {
  let state = apply(fresh(), [{ op: 'set-weights', values: { one_time_cost: 3, reversibility: 0 } }], person);
  state = apply(state, [option('Zero-weight criterion scored'), option('Zero-weight criterion not scored'), score('OPT-01', 'one_time_cost', 4), score('OPT-01', 'reversibility', 1), score('OPT-02', 'one_time_cost', 2)], agent);
  state = apply(state, [{ op: 'confirm', option: 'OPT-01', criterion: 'one_time_cost' }, { op: 'confirm', option: 'OPT-02', criterion: 'one_time_cost' }], person);
  const got = optionsOf(state);
  assert.equal(state.options.list[0].scores.reversibility.status, 'Estimated');
  assert.deepEqual([got.weighted, got.flags, got.list.map((o) => [o.hardPass, o.weighted, o.unknowns.filter((u) => u.startsWith('Score'))])], [true, [], [[true, 4, []], [true, 2, []]]]);
  assert.deepEqual(model(state).c.rows.filter((r) => r.id.startsWith('CALC-22@')).map((r) => [r.substitution, r.result]), [['(3 × 4) / (3)', 4], ['(3 × 2) / (3)', 2]]);
  const unscored = apply(state, [option('Only the zero-weight criterion scored'), score('OPT-03', 'reversibility', 5)], agent);
  assert.deepEqual([item(unscored, 'OPT-03').weighted, item(unscored, 'OPT-03').unknowns.filter((u) => u.startsWith('Score'))], [null, ['Score for one_time_cost (OPT-03.one_time_cost, weight 3)']]);
});

test('computeOptions_estimatedScoreCounted_flagged', () => {
  let state = apply(fresh(), [hard('HDR-08.1', 'cloud'), { op: 'set-weights', values: { nfr_fit: 2 } }], person);
  state = apply(state, [option('One region, multi-AZ', { hosting: 'cloud' }), score('OPT-01', 'nfr_fit', 4)], agent);
  assert.deepEqual([optionsOf(state).flags, item(state).weighted], [['ESTIMATED-SCORES'], 4]);
  const confirmed = apply(state, [{ op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }], person);
  assert.deepEqual([optionsOf(confirmed).flags, item(confirmed).weighted], [[], 4]);
  const outside = apply(confirmed, [score('OPT-01', 'operability', 3)], agent);
  assert.deepEqual(optionsOf(outside).flags, []);
  const unranked = apply(confirmed, [option('On-prem pair', { hosting: 'onprem' }), score('OPT-02', 'nfr_fit', 5)], agent);
  assert.deepEqual([optionsOf(unranked).flags, item(unranked, 'OPT-02').hardPass, item(unranked, 'OPT-02').weighted], [[], false, null]);
  const zero = apply(apply(confirmed, [{ op: 'set-weights', values: { nfr_fit: 2, operability: 0 } }], person), [score('OPT-01', 'operability', 3)], agent);
  assert.deepEqual([optionsOf(zero).flags, item(zero).weighted], [[], 4]);
  const mixed = apply(apply(confirmed, [{ op: 'set-weights', values: { nfr_fit: 2, operability: 1 } }], person), [score('OPT-01', 'operability', 1)], agent);
  assert.deepEqual([E.primaryEntry(mixed, 'HDR-08').kind, mixed.options.list[0].scores.nfr_fit.status, mixed.options.list[0].scores.operability.status], ['hard', 'Confirmed', 'Estimated']);
  assert.deepEqual([optionsOf(mixed).flags, item(mixed).weighted], [['ESTIMATED-SCORES'], 3]);
  rejected(apply(state, [{ op: 'set-policy', policy: { label: 'test-run policy', stand_ins: [] } }], person), { op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }, policy, /an answer policy never confirms a score/);
  const byFixture = apply(state, [{ op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }], fixture);
  assert.deepEqual(optionsOf(byFixture).flags, []);
});

test('setScore_agentOverConfirmed_refused', () => {
  let state = apply(withPolicy(), [option('One region, multi-AZ'), score('OPT-01', 'nfr_fit', 4)], agent);
  state = apply(state, [{ op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }], person);
  const op = score('OPT-01', 'nfr_fit', 2);
  const byMahmoud = /^OPT-01\.nfr_fit was confirmed by Mahmoud; only a person may change a confirmed score, so ask them, or record the question as an unknown\.$/;
  rejected(state, op, agent, byMahmoud);
  rejected(state, op, policy, /an answer policy never sets a score/);
  rejected(state, { ...op, value: 4, reason: 'Scored 4 on nfr_fit' }, agent, byMahmoud);
  const changed = apply(state, [op], person, LATER);
  assert.deepEqual(changed.options.list[0].scores.nfr_fit, { value: 2, reason: 'Scored 2 on nfr_fit', status: 'Estimated', by: 'Mahmoud', at: LATER });
  assert.equal(apply(state, [op], fixture).options.list[0].scores.nfr_fit.by, 'Fixture: Dana Reyes (test-run policy)');
  assert.equal(apply(changed, [score('OPT-01', 'nfr_fit', 3)], agent).options.list[0].scores.nfr_fit.value, 3);
  rejected(changed, score('OPT-01', 'nfr_fit', 3), policy, /an answer policy never sets a score/);
  const fixtureConfirmed = apply(apply(withPolicy(), [option('One region, multi-AZ'), score('OPT-01', 'nfr_fit', 4)], agent), [{ op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }], fixture);
  rejected(fixtureConfirmed, op, agent, /^OPT-01\.nfr_fit was confirmed by Fixture: Dana Reyes \(test-run policy\); only a person may change/);
  const nameless = structuredClone(state);
  nameless.options.list[0].scores.nfr_fit.by = null;
  rejected(nameless, op, agent, /^OPT-01\.nfr_fit is Confirmed; only a person may change a confirmed score, so ask whoever confirmed it, or record the question as an unknown\.$/);
  rejected(state, { ...op, value: 9 }, agent, /whole number from 1 to 5/);
});

test('schema_confirmedScoreWithoutBy_invalid', (t) => {
  let state = apply(fresh(), [option('One region, multi-AZ'), score('OPT-01', 'nfr_fit', 4)], agent);
  state = apply(state, [cost('OPT-01', 'monthly', 5000), { op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }, { op: 'confirm', option: 'OPT-01', cost: 'monthly' }, { op: 'set-horizon', value: 36 }], person);
  const reset = apply(state, [{ op: 'set-option', option: 'OPT-01', name: 'One region, multi-AZ, private link' }], agent, LATER);
  assert.deepEqual([reset.options.list[0].monthly, reset.options.list[0].scores.nfr_fit.by, reset.options.list[0].scores.nfr_fit.at], [{ value: 5000, status: 'Estimated', by: null, at: null }, null, null]);
  assert.equal(item(reset).monthly, 5000);
  assert.deepEqual(E.normalizeState(reset, { now: LATER }).advisories, []);
  const edited = (edit) => {
    const copy = structuredClone(state);
    edit(copy.options.list[0]);
    return copy;
  };
  const scorePath = 'options/list/0/scores/nfr_fit';
  const cases = {
    'Confirmed by and at': [state, []],
    'score by null': [edited((o) => { o.scores.nfr_fit.by = null; }), [`${scorePath}/by`]],
    'score by empty': [edited((o) => { o.scores.nfr_fit.by = ''; }), [`${scorePath}/by`]],
    'score by spaces': [edited((o) => { o.scores.nfr_fit.by = '   '; }), [`${scorePath}/by`]],
    'score at null': [edited((o) => { o.scores.nfr_fit.at = null; }), [`${scorePath}/at`]],
    'score at a date': [edited((o) => { o.scores.nfr_fit.at = '2026-10-23'; }), [`${scorePath}/at`]],
    'cost at null': [edited((o) => { o.monthly.at = null; }), ['options/list/0/monthly']],
    'cost by null': [edited((o) => { o.monthly.by = null; }), ['options/list/0/monthly']],
    'Estimated without by and at': [edited((o) => { Object.assign(o.scores.nfr_fit, { status: 'Estimated', by: null, at: null }); Object.assign(o.monthly, { status: 'Estimated', by: null, at: null }); }), []],
    'reset by set-option': [reset, []],
  };
  const result = validateAllWithSchema(schemaPath, Object.values(cases).map(([doc]) => doc));
  if (result.skipped) {
    t.skip(result.skipped);
    return;
  }
  const got = Object.fromEntries(Object.keys(cases).map((name, i) => [name, result.errors[i].map((e) => e.path)]));
  assert.deepEqual(got, Object.fromEntries(Object.entries(cases).map(([name, [, paths]]) => [name, paths])));
});

test('normalizeState_confirmedCostOrScoreWithoutWho_demotedWithAdvisory', (t) => {
  let state = apply(fresh(), [option('One region, multi-AZ'), score('OPT-01', 'nfr_fit', 4), score('OPT-01', 'operability', 3)], agent);
  state = apply(state, [cost('OPT-01', 'one_time', 100000), cost('OPT-01', 'monthly', 5000), { op: 'confirm', option: 'OPT-01', cost: 'monthly' }, { op: 'confirm', option: 'OPT-01', criterion: 'operability' }], person);
  const raw = structuredClone(state);
  Object.assign(raw.options.list[0].one_time, { status: 'Confirmed', by: null, at: null });
  Object.assign(raw.options.list[0].scores.nfr_fit, { status: 'Confirmed', by: 'Mahmoud', at: 'yesterday' });
  Object.assign(E.primaryEntry(raw, 'CAP-01'), { value: 864000, status: 'Confirmed', confirmed_by: '  ', confirmed_at: NOW });
  Object.assign(E.primaryEntry(raw, 'HDR-08'), { value: 'cloud', status: 'Confirmed', confirmed_by: null, confirmed_at: null });
  const before = JSON.stringify(raw);
  const { state: normal, advisories } = E.normalizeState(raw, { now: LATER });
  assert.equal(JSON.stringify(raw), before);
  const msg = (target) => `${target} read Confirmed without who confirmed it and when (a name and a UTC timestamp), so it now reads Estimated; confirm it again to record both.`;
  assert.deepEqual(advisories, [
    { id: 'STATUS-HDR-08.1', msg: msg('HDR-08.1'), owner: RESPONSIBLE, entry: 'HDR-08.1' },
    { id: 'STATUS-CAP-01.1', msg: msg('CAP-01.1'), owner: 'B+E', entry: 'CAP-01.1' },
    { id: 'STATUS-OPT-01.one_time', msg: msg('OPT-01.one_time'), owner: RESPONSIBLE, option: 'OPT-01' },
    { id: 'STATUS-OPT-01.nfr_fit', msg: msg('OPT-01.nfr_fit'), owner: RESPONSIBLE, option: 'OPT-01' },
  ]);
  const [o] = normal.options.list;
  assert.deepEqual([o.one_time, o.scores.nfr_fit], [{ value: 100000, status: 'Estimated', by: null, at: null }, { value: 4, reason: 'Scored 4 on nfr_fit', status: 'Estimated', by: null, at: null }]);
  assert.deepEqual([o.monthly, o.scores.operability], [state.options.list[0].monthly, state.options.list[0].scores.operability]);
  assert.deepEqual(normal.history.slice(-4).map((c) => [c.at, c.actor.type, c.op, c.target, c.from, c.to, c.reason]), [
    [LATER, 'agent', 'normalize', 'HDR-08.1', { status: 'Confirmed', confirmed_by: null, confirmed_at: null }, { status: 'Estimated', confirmed_by: null, confirmed_at: null }, 'Confirmed without who and when'],
    [LATER, 'agent', 'normalize', 'CAP-01.1', { status: 'Confirmed', confirmed_by: null, confirmed_at: NOW }, { status: 'Estimated', confirmed_by: null, confirmed_at: null }, 'Confirmed without who and when'],
    [LATER, 'agent', 'normalize', 'OPT-01.one_time', { status: 'Confirmed', by: null, at: null }, { status: 'Estimated', by: null, at: null }, 'Confirmed without who and when'],
    [LATER, 'agent', 'normalize', 'OPT-01.nfr_fit', { status: 'Confirmed', by: 'Mahmoud', at: null }, { status: 'Estimated', by: null, at: null }, 'Confirmed without who and when'],
  ]);
  assert.deepEqual(E.normalizeState(normal, { now: LATER }).advisories, []);
  assert.deepEqual(E.normalizeState(state, { now: LATER }), { state, advisories: [] });
  const validation = E.compute(raw, { now: LATER }).validation.advisories.map((a) => a.id);
  assert.ok(['STATUS-OPT-01.one_time', 'STATUS-OPT-01.nfr_fit'].every((id) => validation.includes(id)), validation.join(', '));
  const errors = checkSchema(t, normal);
  if (errors) assert.deepEqual(errors, []);
});

test('computeOptions_storedValuesOutsideOpRules_readAsMissing', () => {
  let state = apply(fresh(), [{ op: 'set-weights', values: { one_time_cost: 3, reversibility: 2 } }], person);
  state = apply(state, [option('One region, multi-AZ'), score('OPT-01', 'one_time_cost', 4), score('OPT-01', 'reversibility', 2)], agent);
  state = apply(state, [cost('OPT-01', 'one_time', 100000), cost('OPT-01', 'monthly', 5000), { op: 'set-horizon', value: 36 }], person);
  const edited = (edit) => {
    const copy = structuredClone(state);
    edit(copy.options, copy.options.list[0]);
    return item(copy);
  };
  assert.deepEqual([item(state).tco, item(state).weighted, item(state).unknowns], [280000, 3.2, []]);
  for (const value of [-1, '100000', null]) assert.deepEqual(edited((o, x) => { x.one_time.value = value; }).unknowns, ['One-time cost (OPT-01.one_time)'], JSON.stringify(value));
  assert.deepEqual(edited((o, x) => { x.monthly.status = 'Open'; }).unknowns, ['Monthly cost (OPT-01.monthly)']);
  for (const value of [0, -36, 2.5, '36']) {
    assert.deepEqual(edited((o) => { o.horizon_months = value; }).unknowns, [HORIZON], JSON.stringify(value));
    const copy = structuredClone(state);
    copy.options.horizon_months = value;
    assert.deepEqual([optionsOf(copy).horizonMonths, row(copy, 'CALC-21@OPT-01').substitution], [null, '100,000 + TBD × 5,000'], JSON.stringify(value));
  }
  for (const value of [-2, '2', null]) assert.equal(edited((o) => { o.weights.values.reversibility = value; }).weighted, 4, JSON.stringify(value));
  const reversibilityMissing = ['Score for reversibility (OPT-01.reversibility, weight 2)'];
  for (const value of [0, 6, 2.5, '2', null]) assert.deepEqual(edited((o, x) => { x.scores.reversibility.value = value; }), { ...item(state), weighted: null, unknowns: reversibilityMissing }, JSON.stringify(value));
  assert.deepEqual(edited((o, x) => { x.scores.reversibility.status = 'Open'; }).unknowns, reversibilityMissing);
  assert.equal(edited((o) => { o.horizon_months = 36.0; }).tco, 280000);
});

test('computeOptions_doesNotMutate', () => {
  let state = apply(fresh(), [...scoped('region', 600, 60), hard('HDR-08.1', 'cloud'), { op: 'set-weights', values: { nfr_fit: 2, reversibility: 1 } }], person);
  state = apply(state, [option('Two regions, warm standby', { hosting: 'cloud', topology: 'regional', dr: 'warm' }), option('One region', { hosting: 'onprem', topology: 'multiAZ' }), score('OPT-01', 'nfr_fit', 4), score('OPT-01', 'reversibility', 1), score('OPT-02', 'reversibility', 5)], agent);
  state = apply(state, [cost('OPT-01', 'one_time', 100000), cost('OPT-01', 'monthly', 5000), { op: 'set-horizon', value: 36 }, { op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }, { op: 'confirm', option: 'OPT-01', criterion: 'reversibility' }], person);
  const m = model(state);
  const before = [JSON.stringify(state), JSON.stringify(m)];
  const got = E.computeOptions(state, m);
  assert.deepEqual([JSON.stringify(state), JSON.stringify(m)], before);
  assert.deepEqual(E.computeOptions(deepFreeze(structuredClone(state)), deepFreeze(structuredClone(m))), got);
  assert.deepEqual(got.list.map((o) => [o.hardPass, o.tco, o.weighted, o.failures.map((f) => f.ref)]), [[true, 280000, 3, []], [false, null, null, ['HDR-08.1']]]);
  got.list[0].unknowns.push('changed by the caller');
  got.list[1].failures.push({ check: 'hosting', ref: 'changed by the caller', message: '' });
  got.flags.push('CHANGED');
  assert.deepEqual(E.computeOptions(state, m), E.computeOptions(state, model(state)));
  assert.deepEqual(E.computeOptions(state, m).flags, []);
  assert.deepEqual(model(state).options, E.computeOptions(state, m));
  assert.deepEqual(JSON.stringify(state), before[0]);
});
