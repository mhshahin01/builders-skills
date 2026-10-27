import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine, goldenCase, readText } from './helpers.mjs';

const E = loadEngine();
const NOW = '2026-10-23T11:01:02Z';
const OPTS = { now: NOW, name: 'Refunds platform', slug: 'refunds-platform' };
const person = { type: 'person', name: 'Mahmoud', label: '' };
const fixture = { type: 'fixture', name: 'Fixture Owner', label: '' };
const OWNER = 'Lead architect / responsible owner';
const DR_FAMILY = ['DR-03', 'DR-06', 'DR-ZERO-01', 'DR-ZERO-02', 'DATA-07', 'DATA-08', 'SLO-15'];
const DROPPED = ['EVID-01', 'EVID-02'];
const HARD = ['BUS-07.1', 'BUS-08.1', 'DAT-03.1', 'DAT-04.1', 'DAT-06.1', 'SEC-01.1', 'SEC-04.1'];
const OPEN_MSG = (id) => `${id} is a hard constraint and is Open; give its value, or mark it N/A with a reason, or have a named person grant a time-bound exception.`;
const CLEAR = [
  { op: 'set', entry: 'BUS-01.1', value: 'Cut refund handling time to one day' },
  { op: 'set', entry: 'HDR-02.1', value: 'Jane Doe' },
  { op: 'set', entry: 'BUS-07.1', value: 'No card data leaves the EU' },
  { op: 'set', entry: 'BUS-08.1', value: 'Refund within 5 days or pay the penalty' },
  { op: 'set', entry: 'DAT-03.1', value: 'sensitive' },
  { op: 'set', entry: 'DAT-04.1', value: 'yes' },
  { op: 'set', entry: 'DAT-06.1', value: 'Keep refunds for 7 years' },
  { op: 'set', entry: 'SEC-01.1', value: 'PCI DSS 4.0' },
  { op: 'set', entry: 'SEC-04.1', value: 'TLS 1.3 in transit, KMS keys at rest' },
  { op: 'set-factor', entry: 'DAT-04.1', factor: 'primaryLocation', value: 'Frankfurt' },
  { op: 'set', entry: 'REL-05.1', value: 'az' }, { op: 'set', entry: 'REL-03.1', value: 600 }, { op: 'set', entry: 'REL-04.1', value: 60 },
];
const CARRIED_BLOCKERS = ['OVERRIDE-reason', 'OPEN-migration-source', 'RESIDENCY-region'];
const RECOMPUTE_INPUTS = [
  { op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'CAP-04.1', value: 5 },
  { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3 }, { op: 'set-factor', entry: 'CAP-02.1', factor: 'requestFactor', value: 1.1 },
  { op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 },
];
const SIDEWAYS = { name: 'Error', message: 'The project state cannot be read:\n- decisions.topology_override is "sideways", which is not a topology override; give one of auto, single, multiAZ, multiAZActive, regional or active (auto means no override).' };
const DERIVED_ADVICE = 'the engine never changes a Confirmed value. Review it: set the value you want, or reopen the entry so that the engine derives it again; once a person sets it, the engine no longer derives it.';
const DEFAULT_ADVICE = 'the engine never changes a Confirmed value. Review it: set the value you want, or reopen the entry so that the engine applies its default again; once a person sets it, the engine no longer applies its default.';
const TWO = {
  scopes: ['az', 'region'], rto: [['az', 0], ['region', 3000]], rpo: [['az', 0], ['region', 5]],
  extra: [{ op: 'set', entry: 'REL-01.1', value: 99.9 }, { op: 'set', entry: 'CAP-01.1', value: 864000 }],
};
const TRIGGERS = [
  ['ARCH-01', {}],
  ['HA-02', { failureScope: 'az' }],
  ['DR-03', { failureScope: 'region' }],
  ['LOAD-04', { dailyTxn: 864000 }],
  ['PERF-05', { p99Ms: 200 }],
  ['DR-06', { rtoSec: 30 }],
  ['DR-ZERO-01', { rtoSec: 0 }],
  ['DR-ZERO-02', { rtoSec: 0, rpoSec: 0 }],
  ['DATA-07', { rpoSec: 0 }],
  ['DATA-08', { rpoSec: 5 }],
  ['DB-09', { dataConsistency: 'unknown' }],
  ['DB-10', { dataKind: 'relational' }],
  ['DB-READ-17', { readPercent: 70 }],
  ['SEC-11', { sensitiveData: 'sensitive' }],
  ['NET-12', { connectivity: 'hybrid' }],
  ['MIG-13', { changeType: 'brownfield' }],
  ['MIG-14', { migration: 'yes', sourcePlatform: 'onprem', migrationGB: 2000, linkMbps: 150, cutoverHours: 4 }],
  ['SLO-15', { availability: 99.9, rtoSec: 14400 }],
  ['ADR-16', { topologyOverride: 'regional', overrideReason: 'Cost envelope agreed' }],
];
const PROFILES = [
  {},
  { solutionName: 'Refunds platform', transactionNeed: 'yes', queryShape: 'analytics', overrideReason: 'Cost envelope agreed', migration: 'yes', sourcePlatform: 'onprem', changeType: 'brownfield', availability: 99.99, recoveryLabel: 'Dublin' },
  { solutionName: 'Refunds platform', changeType: 'brownfield', dataKind: 'mixed', availability: 99.9, dailyTxn: 864000, p99Ms: 200, readPercent: 70, sensitiveData: 'sensitive', connectivity: 'hybrid' },
  { changeType: 'brownfield', target: 'hybrid', migration: 'yes', sourcePlatform: 'onprem', migrationGB: 2000, linkMbps: 150, cutoverHours: 4, availability: 99.95 },
];
const CLAUSE_PROFILES = [
  { transactionNeed: 'yes', queryShape: 'timeseries' },
  { transactionNeed: 'no', queryShape: 'analytics' },
  { transactionNeed: 'yes', dataKind: 'relational', queryShape: 'analytics' },
  { migration: 'yes', sourcePlatform: 'onprem', migrationGB: 2000 },
  { migration: 'yes', sourcePlatform: 'onprem', migrationGB: 2000, linkMbps: 150 },
  { migration: 'yes', sourcePlatform: 'onprem', linkMbps: 150, cutoverHours: 4 },
  { dataKind: 'mixed', extras: true },
  { changeType: 'greenfield', migration: 'no' },
  { availability: 99.989 },
  { topologyOverride: 'regional' },
  { topologyOverride: 'regional', overrideReason: 'Cost envelope agreed' },
  { migration: 'yes' },
  { residency: 'yes' },
  { residency: 'yes', regionLabel: 'Frankfurt' },
];

const fresh = () => E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW });
const BLANK = E.toCalcInputs(fresh()).v;
const ids = (list) => list.map((x) => x.id);
const imported = (inputs) => E.importV22({ inputs: { ...BLANK, ...inputs } }, OPTS);
const validation = (state, now = NOW) => E.compute(state, { now }).validation;
const blockerIds = (state, now = NOW) => ids(validation(state, now).blockers);
const exception = (entry, expires = '2026-12-31', review = '2026-11-30') => ({ op: 'add-exception', entry, reason: 'Review booked with the owner', expires, review });

function apply(state, ops, actor = person) {
  const result = E.applyPatch(state, ops, actor, { now: NOW });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

function build({ scopes = [], rto = [], rpo = [], extra = [] } = {}) {
  const ops = [];
  scopes.forEach((scope, i) => {
    if (i) ops.push({ op: 'add', row: 'REL-05' });
    if (scope) ops.push({ op: 'set', entry: `REL-05.${i + 1}`, value: scope });
  });
  for (const [row, list] of [['REL-03', rto], ['REL-04', rpo]]) {
    list.forEach(([scope, value], i) => {
      if (i) ops.push({ op: 'add', row });
      ops.push({ op: 'set', entry: `${row}.${i + 1}`, value, ...(scope ? { scope } : {}) });
    });
  }
  return apply(fresh(), [...ops, ...extra]);
}

function v22Model(v, ctx) {
  const c = E.calculations(v);
  const a = E.selectArchitecture(v, c);
  const checked = E.validate(v, c, a, ctx);
  return { rules: E.decisionRules(v, c, a), warnings: checked.warnings.filter((w) => !DROPPED.includes(w.id)), blockers: checked.blockers };
}

function sourceIds(fn, call) {
  const src = fn.toString();
  const found = [...src.matchAll(new RegExp(`\\b${call}\\((?:'([^']+)'|RULE_RENAMES\\['([^']+)'\\])`, 'g'))];
  return { ids: found.map((m) => m[1] ?? E.RULE_RENAMES[m[2]]), renamed: found.filter((m) => m[2]).map((m) => m[2]), sites: [...src.matchAll(new RegExp(`\\b${call}\\(`, 'g'))].length };
}

function* v22Grid() {
  for (const profile of PROFILES)
    for (const failureScope of ['unknown', 'host', 'az', 'site', 'region', 'provider', 'cyber'])
      for (const rtoSec of [null, 0, 30, 3600, 20000])
        for (const rpoSec of [null, 0, 5, 7200])
          for (const topologyOverride of ['auto', 'single', 'active'])
            for (const drOverride of ['auto', 'backup'])
              yield { inputs: { ...BLANK, ...profile, failureScope, rtoSec, rpoSec, topologyOverride, drOverride } };
  for (const { extras, ...profile } of CLAUSE_PROFILES)
    for (const failureScope of ['unknown', 'region'])
      for (const rtoSec of [null, 0, 600])
        yield { inputs: { ...BLANK, failureScope, rtoSec, ...profile }, extraWorkloads: extras ? [{ name: 'Reporting', kind: 'analytics', consistency: 'eventual' }] : [] };
}

function* smallGrid(skip) {
  for (const failureScope of ['unknown', 'az', 'region'])
    for (const rtoSec of [null, 0, 600])
      for (const rpoSec of [null, 0])
        for (const migration of ['no', 'yes'])
          for (const changeType of skip === 'changeType' ? [null] : ['unknown', 'greenfield', 'brownfield'])
            for (const target of skip === 'target' ? [null] : ['unknown', 'cloud', 'hybrid'])
              yield {
                ...BLANK, availability: 99.9, connectivity: 'partner', failureScope, rtoSec, rpoSec, migration,
                ...(migration === 'yes' ? { sourcePlatform: 'onprem' } : {}), ...(changeType ? { changeType } : {}), ...(target ? { target } : {}),
              };
}

function sameAsV22(field, row, value3, value22, label) {
  const seen = new Set();
  let compared = 0;
  for (const inputs of smallGrid(field)) {
    const state = apply(E.importV22({ inputs }, OPTS), [{ op: 'set', entry: `${row}.1`, value: value3 }]);
    const { v, ctx } = E.toCalcInputs(state);
    assert.equal(v[field], value3, `${field} reaches the calculator inputs`);
    const want = v22Model({ ...v, [field]: value22 }, ctx);
    const shown = label ? want.rules.map((r) => ({ ...r, trigger: r.trigger.replace(`${label}=${value22}`, `${label}=${value3}`) })) : want.rules;
    const model = E.compute(state, { now: NOW });
    assert.deepEqual(model.rules, shown, JSON.stringify(inputs));
    assert.deepEqual(model.validation.advisories, want.warnings, JSON.stringify(inputs));
    for (const x of [...model.rules, ...model.validation.advisories]) seen.add(x.id);
    compared += model.rules.length + model.validation.advisories.length;
  }
  assert.ok(compared > 500, `${field} ${value3}: the grid compares rules and advisories (${compared})`);
  for (const id of ['ARCH-01', 'NET-12', 'DR-03', 'DR-ZERO-01', 'DR-zeroRTO-unverified', 'DR-location', 'MIG-transfer']) assert.ok(seen.has(id), `${field} ${value3}: ${id} fires in the grid`);
  return seen;
}

test('validateState_hardOpenWithoutException_blocker', () => {
  const open = validation(fresh()).blockers.filter((b) => b.id.startsWith('OPEN-'));
  assert.deepEqual(ids(open), HARD.map((id) => `OPEN-${id}`));
  assert.deepEqual(open.find((b) => b.id === 'OPEN-DAT-04.1'), { id: 'OPEN-DAT-04.1', msg: OPEN_MSG('DAT-04.1'), owner: 'D+Legal', entry: 'DAT-04.1' });
  assert.ok(!blockerIds(apply(fresh(), [{ op: 'set', entry: 'DAT-04.1', value: 'yes' }])).includes('OPEN-DAT-04.1'));
  assert.ok(!blockerIds(apply(fresh(), [{ op: 'na', entry: 'DAT-04.1', reason: 'No residency rule applies' }])).includes('OPEN-DAT-04.1'));
});

test('validateState_hardOpenWithValidException_noBlocker', () => {
  const state = apply(fresh(), [exception('DAT-04.1')]);
  const got = blockerIds(state);
  assert.ok(!got.includes('OPEN-DAT-04.1'));
  assert.deepEqual(got.filter((id) => id.startsWith('OPEN-')), HARD.filter((id) => id !== 'DAT-04.1').map((id) => `OPEN-${id}`));
  const edge = apply(fresh(), [exception('DAT-04.1', '2026-10-23', '2026-10-23')]);
  assert.ok(!blockerIds(edge).includes('OPEN-DAT-04.1'), 'it expires today and is reviewed on its expiry date');
});

test('validateState_expiredException_blocker', () => {
  const state = apply(fresh(), [exception('DAT-04.1', '2026-10-22', '2026-10-01')]);
  const open = (now) => validation(state, now).blockers.find((b) => b.id === 'OPEN-DAT-04.1');
  assert.equal(open(NOW).msg, `${OPEN_MSG('DAT-04.1')} EXC-01 does not lift it: an exception counts only when a named person granted it, it expires on or after 2026-10-23, and its review date is on or before its expiry.`);
  assert.equal(open('2026-10-22T23:59:59Z'), undefined, 'valid on its expiry date');
  assert.equal(open('2026-10-23T01:30:00+02:00'), undefined, 'the UTC date of now is 2026-10-22');
  assert.ok(open('2026-10-22T23:30:00-01:00'), 'the UTC date of now is 2026-10-23');
  const twice = apply(state, [exception('DAT-04.1', '2026-10-01', '2026-09-01')]);
  assert.ok(validation(twice).blockers.find((b) => b.id === 'OPEN-DAT-04.1').msg.includes(' EXC-01, EXC-02 do not lift it: '));
});

test('validateState_exceptionByStandInPolicyOrFixture_notValid', () => {
  const labels = ['Stand-in: Approver (test-run policy, set by Mahmoud, 2026-10-23)', 'Policy: test-run policy (set by Mahmoud, 2026-10-23)', 'Fixture: Fixture Owner (test-run policy)', 'stand-in: approver', '  '];
  for (const by of labels) {
    const state = apply(fresh(), [exception('DAT-04.1')]);
    state.gate.exceptions[0].granted_by = by;
    const open = validation(state).blockers.find((b) => b.id === 'OPEN-DAT-04.1');
    assert.ok(open && open.msg.includes('EXC-01 does not lift it'), JSON.stringify(by));
  }
  const named = apply(fresh(), [exception('DAT-04.1')]);
  assert.equal(named.gate.exceptions[0].granted_by, 'Mahmoud');
  assert.ok(!blockerIds(named).includes('OPEN-DAT-04.1'));
  assert.equal(E.applyPatch(fresh(), [exception('DAT-04.1')], fixture, { now: NOW }).errors.length, 1, 'applyPatch refuses a fixture grant');
});

test('validateState_reviewAfterExpiry_exceptionNotValid', () => {
  assert.ok(blockerIds(apply(fresh(), [exception('DAT-04.1', '2026-11-30', '2026-12-01')])).includes('OPEN-DAT-04.1'));
  for (const [key, value] of [['expires', 'soon'], ['review', '2026-02-30'], ['expires', null]]) {
    const state = apply(fresh(), [exception('DAT-04.1')]);
    state.gate.exceptions[0][key] = value;
    assert.ok(blockerIds(state).includes('OPEN-DAT-04.1'), `${key} = ${value}`);
  }
});

test('validateState_exception_liftsOnlyItsEntryAndItsDtBlock', () => {
  const base = apply(fresh(), [
    { op: 'set', entry: 'CAP-07.1', priority: 'Must', kind: 'hard', reason: 'Checkout latency is contractual' },
    { op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 1.5 },
    { op: 'set', entry: 'REL-05.1', value: 'region' }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' },
  ]);
  const before = blockerIds(base);
  for (const id of ['OPEN-CAP-07.1', 'DT-02-BLOCK@CAP-07.1', 'INVALID-CAP-04.1.utilization', 'DT-03-BLOCK@region', 'DUPLICATE-SCOPE@region', 'DT-01-STOP', 'DT-15-BLOCK']) assert.ok(before.includes(id), id);
  const lifted = apply(base, ['CAP-07.1', 'CAP-04.1', 'REL-05.1', 'REL-05.2', 'BUS-01.1'].map((entry) => exception(entry)));
  const after = validation(lifted).blockers;
  const got = ids(after);
  for (const id of ['OPEN-CAP-07.1', 'DT-02-BLOCK@CAP-07.1', 'DT-03-BLOCK@region']) assert.ok(!got.includes(id), `${id} is lifted`);
  for (const id of ['INVALID-CAP-04.1.utilization', 'DUPLICATE-SCOPE@region', 'DT-01-STOP', 'DT-15-BLOCK', ...HARD.map((x) => `OPEN-${x}`)]) assert.ok(got.includes(id), `${id} stays`);
  assert.equal(after.find((b) => b.id === 'DT-01-STOP').entry, 'HDR-02.1', 'DT-01 still rests on the Open HDR-02.1');
  const both = apply(lifted, [exception('HDR-02.1')]);
  assert.ok(!blockerIds(both).includes('DT-01-STOP'));
});

test('validateState_targetOpen_notBlocker', () => {
  const blank = blockerIds(fresh());
  assert.deepEqual([E.primaryEntry(fresh(), 'REL-01').kind, E.primaryEntry(fresh(), 'CAP-01').kind], ['target', 'forecast']);
  assert.ok(!blank.includes('OPEN-REL-01.1') && !blank.includes('OPEN-CAP-01.1'));
  const ops = [{ op: 'set', entry: 'DAT-04.1', kind: 'target', reason: 'Residency is negotiable here' }, { op: 'set', entry: 'REL-01.1', kind: 'hard', reason: 'The SLA is contractual' }];
  const got = blockerIds(apply(fresh(), ops));
  assert.ok(!got.includes('OPEN-DAT-04.1'), 'a hard row whose entry is now a target');
  assert.ok(got.includes('OPEN-REL-01.1'), 'a target row whose entry is now hard');
});

test('validateState_hardLeftOpenByPerson_blockerNamesPerson', () => {
  const left = apply(fresh(), [{ op: 'set', entry: 'DAT-04.1', value: '' }]);
  assert.deepEqual([E.primaryEntry(left, 'DAT-04').status, E.primaryEntry(left, 'DAT-04').source], ['Open', { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23 (left open)' }]);
  const open = validation(left).blockers.find((b) => b.id === 'OPEN-DAT-04.1');
  assert.equal(open.msg, 'DAT-04.1 is a hard constraint that Mahmoud left open on 2026-10-23; give its value, or mark it N/A with a reason, or have a named person grant a time-bound exception.');
  const byFixture = apply(fresh(), [{ op: 'set', entry: 'DAT-04.1', value: '' }], fixture);
  const fixtureOpen = validation(byFixture).blockers.find((b) => b.id === 'OPEN-DAT-04.1');
  assert.ok(fixtureOpen.msg.startsWith('DAT-04.1 is a hard constraint that Fixture: Fixture Owner (test-run policy) left open;'), fixtureOpen.msg);
});

test('validateState_bus01Open_dt01Stop', () => {
  const stop = (state) => validation(state).blockers.filter((b) => b.id === 'DT-01-STOP');
  const [both] = stop(fresh());
  assert.deepEqual([both.entry, both.owner], ['BUS-01.1', 'B']);
  assert.ok(both.msg.startsWith('DT-01 STOP: BUS-01.1 and HDR-02.1 are Open'), both.msg);
  const sponsor = apply(fresh(), [CLEAR[1]]);
  assert.deepEqual(stop(sponsor).map((b) => [b.entry, b.msg.slice(0, 31)]), [['BUS-01.1', 'DT-01 STOP: BUS-01.1 is Open, s']]);
  const outcome = apply(fresh(), [CLEAR[0]]);
  assert.deepEqual(stop(outcome).map((b) => [b.entry, b.owner]), [['HDR-02.1', OWNER]]);
  assert.deepEqual(stop(apply(sponsor, [CLEAR[0]])), []);
  assert.deepEqual(stop(apply(sponsor, [{ op: 'na', entry: 'BUS-01.1', reason: 'An internal tooling change' }])), []);
});

test('validateState_mustP99Open_dt02Block', () => {
  const dt02 = (state) => validation(state).blockers.filter((b) => b.id.startsWith('DT-02'));
  const state = apply(fresh(), [{ op: 'set', entry: 'CAP-07.1', priority: 'Must' }, { op: 'add', row: 'CAP-07', label: 'Refund status' }, { op: 'set', entry: 'CAP-07.2', priority: 'Should' }]);
  const [block] = dt02(state);
  assert.deepEqual([block.id, block.entry, block.owner], ['DT-02-BLOCK@CAP-07.1', 'CAP-07.1', 'B+E']);
  assert.ok(block.msg.startsWith('DT-02: CAP-07.1 has priority Must but no p99 latency target'), block.msg);
  assert.equal(dt02(state).length, 1, 'a Should journey without a p99 does not block');
  const valued = apply(state, [{ op: 'set', entry: 'CAP-07.1', value: 300 }]);
  assert.deepEqual(dt02(valued), []);
  const second = apply(valued, [{ op: 'set', entry: 'CAP-07.2', priority: 'Must' }]);
  assert.deepEqual(ids(dt02(second)), ['DT-02-BLOCK@CAP-07.2']);
  assert.deepEqual(ids(dt02(apply(second, [{ op: 'na', entry: 'CAP-07.2', reason: 'A batch journey' }]))), ['DT-02-BLOCK@CAP-07.2'], 'N/A leaves a Must journey without a value');
});

test('validateState_mustP99Na_dt02BlockMessage', () => {
  const dt02 = (state) => validation(state).blockers.filter((b) => b.id.startsWith('DT-02'));
  const must = apply(fresh(), [{ op: 'set', entry: 'CAP-07.1', priority: 'Must' }]);
  const na = apply(must, [{ op: 'na', entry: 'CAP-07.1', reason: 'No latency target agreed' }]);
  assert.deepEqual(dt02(na), [{ id: 'DT-02-BLOCK@CAP-07.1', msg: "DT-02: CAP-07.1 has priority Must, but its p99 is marked N/A; give the journey's p99 and where it is measured, or change its priority if the journey is not latency-critical.", owner: 'B+E', entry: 'CAP-07.1' }]);
  assert.ok(dt02(must)[0].msg.startsWith('DT-02: CAP-07.1 has priority Must but no p99 latency target;'), 'an Open entry keeps its message');
  assert.deepEqual(dt02(apply(na, [{ op: 'set', entry: 'CAP-07.1', priority: 'Should' }])), [], 'changing the priority, as the message offers, clears it');
});

test('validateState_scopeWithoutRpo_dt03Block', () => {
  const dt03 = (state) => validation(state).blockers.filter((b) => b.id.startsWith('DT-03'));
  const region = build({ scopes: ['region'], rto: [[null, 600]] });
  const [block] = dt03(region);
  assert.deepEqual([block.id, block.entry, block.owner], ['DT-03-BLOCK@region', 'REL-05.1', 'B+Ops']);
  assert.equal(block.msg, 'DT-03: failure scope region (REL-05.1) has no RPO; DR commitments for this scope wait for a business-impact analysis that sets its RTO and RPO.');
  assert.deepEqual(dt03(apply(region, [{ op: 'set', entry: 'REL-04.1', value: 60 }])), []);
  const two = build({ scopes: ['region', 'az'], rto: [['region', 600]], rpo: [['region', 60]] });
  assert.deepEqual(dt03(two).map((b) => [b.id, b.entry, b.msg.includes('has no RTO and no RPO;')]), [['DT-03-BLOCK@az', 'REL-05.2', true]]);
  assert.deepEqual(ids(dt03(fresh())), ['DT-03-BLOCK@unknown'], 'only the Open primary REL-05 entry blocks without a named scope');
});

test('validateState_overlayWithout7R_dt11Block', () => {
  const dt11 = (state) => validation(state).blockers.filter((b) => b.id.startsWith('DT-11'));
  const state = imported({ changeType: 'brownfield', migration: 'yes', sourcePlatform: 'onprem' });
  assert.equal(state.register.overlay.applies, true);
  assert.deepEqual(dt11(state).map((b) => [b.id, b.entry, b.owner]), [['DT-11-BLOCK@WL-01', 'OVL-04.1', OWNER]]);
  assert.ok(dt11(state)[0].msg.includes('has no 7R strategy (OVL-04.1 is Open)'), dt11(state)[0].msg);
  const decided = apply(state, [{ op: 'set', entry: 'OVL-04.1', value: 'Replatform to managed PostgreSQL' }]);
  assert.deepEqual(dt11(decided), []);
  assert.deepEqual(dt11(apply(state, [exception('OVL-04.1')])), [], 'an exception on OVL-04.1 lifts the block resting on it');
  const second = structuredClone(decided);
  second.register.overlay.workloads.push({ id: 'WL-02', name: 'Billing' });
  const [missing] = dt11(second);
  assert.deepEqual([missing.id, 'entry' in missing], ['DT-11-BLOCK@WL-02', false]);
  assert.ok(missing.msg.includes('workload WL-02 (Billing) has no 7R strategy (it has no OVL-04 entry)'), missing.msg);
  const off = structuredClone(state);
  off.register.overlay.applies = false;
  assert.deepEqual(dt11(off), []);
});

test('validateState_invalidUtilization_invalidBlocker', () => {
  const invalid = (state) => validation(state).blockers.filter((b) => b.id.startsWith('INVALID-'));
  const state = apply(fresh(), [{ op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 1.5 }]);
  assert.deepEqual(invalid(state), [{ id: 'INVALID-CAP-04.1.utilization', msg: 'CAP-04.1.utilization is 1.5, which is above 1, so the calculations treat it as TBD; correct the value.', owner: 'B+E', entry: 'CAP-04.1' }]);
  const more = apply(state, [
    { op: 'set', entry: 'REL-01.1', value: 120 }, { op: 'add', row: 'REL-03' }, { op: 'set', entry: 'REL-03.2', value: -5 },
    { op: 'set', entry: 'CAP-02.1', value: -1 }, { op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value: 20.5 },
  ]);
  assert.deepEqual(invalid(more).map((b) => [b.id, b.entry, b.msg.split(', which is ')[1].split(', so')[0]]), [
    ['INVALID-CAP-02.1.value', 'CAP-02.1', 'below 0'], ['INVALID-CAP-04.1.utilization', 'CAP-04.1', 'above 1'],
    ['INVALID-REL-01.1.value', 'REL-01.1', 'above 100'], ['INVALID-REL-03.2.value', 'REL-03.2', 'below 0'],
    ['INVALID-INT-08.1.cidrPrefix', 'INT-08.1', 'not a whole number'],
  ]);
  const fixed = apply(more, [
    { op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 0.65 }, { op: 'set', entry: 'REL-01.1', value: 100 }, { op: 'set', entry: 'REL-03.2', value: 0 },
    { op: 'set', entry: 'CAP-02.1', value: 0 }, { op: 'set-factor', entry: 'INT-08.1', factor: 'cidrPrefix', value: 22 },
  ]);
  assert.deepEqual(invalid(fixed), []);
});

test('validateState_scopedEntryWithoutFailureScope_scopeUnusedAdvisory', () => {
  const unused = (state) => validation(state).advisories.filter((x) => x.id.startsWith('SCOPE-UNUSED-'));
  const state = build({ scopes: ['az'], rto: [['region', 600]], rpo: [['az', 0], ['site', null]] });
  assert.deepEqual(unused(state), [
    { id: 'SCOPE-UNUSED-REL-03.1', msg: 'REL-03.1 names scope region, but no failure-scope entry has it; add that scope, or change or remove the entry.', owner: 'B', entry: 'REL-03.1' },
    { id: 'SCOPE-UNUSED-REL-04.2', msg: 'REL-04.2 names scope site, but no failure-scope entry has it; add that scope, or change or remove the entry.', owner: 'B+D', entry: 'REL-04.2' },
  ]);
  const added = apply(state, [{ op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }]);
  assert.deepEqual(ids(unused(added)), ['SCOPE-UNUSED-REL-04.2']);
  assert.deepEqual(unused(build({ scopes: ['az'], rto: [[null, 600]], rpo: [['az', 0]] })), []);
});

test('validateState_confirmedValueRecomputesDifferently_recomputeAdvisory', () => {
  const recompute = (state) => validation(state).advisories.filter((x) => x.id.startsWith('RECOMPUTE-'));
  const filled = E.derive(E.applyDefaults(apply(fresh(), RECOMPUTE_INPUTS), { now: NOW }).state, { now: NOW }).state;
  const rows = ['CAP-02', 'DAT-02', 'OPS-04', 'CAP-08'];
  assert.deepEqual(rows.map((row) => [E.primaryEntry(filled, row).status, E.primaryEntry(filled, row).source.type]), [['Estimated', 'derived'], ['Estimated', 'derived'], ['Estimated', 'default'], ['Estimated', 'default']]);
  const confirmed = apply(filled, rows.map((row) => ({ op: 'confirm', entry: `${row}.1` })));
  assert.deepEqual(recompute(confirmed), []);
  const changed = apply(confirmed, [
    { op: 'set', entry: 'CAP-01.1', value: 1728000 }, { op: 'set', entry: 'REL-05.1', value: 'region' },
    { op: 'set', entry: 'CAP-08.1', value: 'Client end-to-end' }, { op: 'confirm', entry: 'CAP-08.1' },
  ]);
  const calc = (id) => E.compute(changed, { now: NOW }).c.rows.find((r) => r.id === id).result;
  const got = recompute(changed);
  assert.deepEqual(got.map((x) => [x.id, x.entry, x.owner]), [['RECOMPUTE-CAP-02.1', 'CAP-02.1', 'B+E'], ['RECOMPUTE-DAT-02.1', 'DAT-02.1', 'D+B'], ['RECOMPUTE-OPS-04.1', 'OPS-04.1', 'Ops']], 'CAP-08.1 now holds a person\'s answer, which is never flagged');
  const stored = (row) => E.primaryEntry(changed, row).value;
  assert.equal(got[0].msg, `CAP-02.1 is Confirmed as ${stored('CAP-02')} req/s, but CALC-03 (from CAP-01, CAP-04, CAP-02) now gives ${calc('CALC-03')} req/s; ${DERIVED_ADVICE}`);
  assert.equal(got[1].msg, `DAT-02.1 is Confirmed as ${stored('DAT-02')} GB/day, but CALC-10 (from CAP-01, DAT-02) now gives ${calc('CALC-10')} GB/day; ${DERIVED_ADVICE}`);
  assert.equal(got[2].msg, `OPS-04.1 is Confirmed as "dev, test, stage, prod", but the project rule for OPS-04 now gives "dev, test, stage, prod, dr"; ${DEFAULT_ADVICE}`);
  const rerun = E.derive(E.applyDefaults(changed, { now: NOW }).state, { now: NOW }).state;
  assert.deepEqual(rows.map((row) => [E.primaryEntry(rerun, row).value, E.primaryEntry(rerun, row).status]), rows.map((row) => [stored(row), 'Confirmed']), 'never an automatic change');
  const estimated = apply(changed, [{ op: 'set', entry: 'CAP-02.1', value: 50 }]);
  assert.ok(!ids(recompute(estimated)).includes('RECOMPUTE-CAP-02.1'), 'an Estimated value is not flagged');
  const tbd = apply(changed, [{ op: 'set', entry: 'CAP-01.1', value: '' }]);
  assert.deepEqual(ids(recompute(tbd)), ['RECOMPUTE-OPS-04.1'], 'no recomputed value while an input is missing');
});

test('validateState_confirmedAnswerDiffers_noRecompute', () => {
  const recompute = (state) => validation(state).advisories.filter((x) => x.id.startsWith('RECOMPUTE-'));
  const rows = ['CAP-02', 'DAT-02', 'OPS-04', 'CAP-08'];
  const defaulted = E.applyDefaults(apply(fresh(), RECOMPUTE_INPUTS), { now: NOW }).state;
  const answers = [
    { op: 'set', entry: 'CAP-02.1', value: 120 }, { op: 'set', entry: 'DAT-02.1', value: 9 },
    { op: 'set', entry: 'OPS-04.1', value: 'dev, test, perf, stage, prod' }, { op: 'set', entry: 'CAP-08.1', value: 'Client end-to-end' },
    ...rows.map((row) => ({ op: 'confirm', entry: `${row}.1` })),
  ];
  for (const [name, actor, type] of [['person', person, 'answer'], ['fixture', fixture, 'fixture']]) {
    const state = apply(defaulted, answers, actor);
    assert.deepEqual(rows.map((row) => [E.primaryEntry(state, row).status, E.primaryEntry(state, row).source.type]), rows.map(() => ['Confirmed', type]), name);
    const calc = (id) => E.compute(state, { now: NOW }).c.rows.find((r) => r.id === id).result;
    assert.ok(calc('CALC-03') !== 120 && calc('CALC-10') !== 9 && E.known(calc('CALC-03')) && E.known(calc('CALC-10')), `${name}: the recomputed values differ from the answers`);
    assert.deepEqual(recompute(state), [], `${name}: an answer is never flagged`);
  }
});

test('validateState_recomputeAdviceFollowed_advisoryClears', () => {
  const recompute = (state) => validation(state).advisories.filter((x) => x.id.startsWith('RECOMPUTE-'));
  const confirmed = apply(E.derive(apply(fresh(), RECOMPUTE_INPUTS), { now: NOW }).state, [{ op: 'confirm', entry: 'CAP-02.1' }]);
  assert.deepEqual([E.primaryEntry(confirmed, 'CAP-02').status, E.primaryEntry(confirmed, 'CAP-02').source.type], ['Confirmed', 'derived']);
  const stale = apply(confirmed, [{ op: 'set', entry: 'CAP-01.1', value: 1728000 }]);
  const recomputed = E.compute(stale, { now: NOW }).c.rows.find((r) => r.id === 'CALC-03').result;
  const [advice] = recompute(stale);
  assert.deepEqual([advice.id, advice.msg.endsWith(DERIVED_ADVICE)], ['RECOMPUTE-CAP-02.1', true]);
  assert.match(E.applyPatch(stale, [{ op: 'confirm', entry: 'CAP-02.1' }], person, { now: NOW }).errors[0].message, /Only an Estimated value can be confirmed/, 'the advice of round one is refused');
  assert.deepEqual(recompute(apply(stale, [{ op: 'set', entry: 'CAP-02.1', value: recomputed }])), [], 'a person sets the recomputed value');
  assert.deepEqual(recompute(apply(stale, [{ op: 'set', entry: 'CAP-02.1', value: 165 }, { op: 'confirm', entry: 'CAP-02.1' }])), [], 'a person keeps the old value as an answer');
  const reopened = apply(stale, [{ op: 'open', entry: 'CAP-02.1' }]);
  assert.deepEqual(recompute(reopened), [], 'reopened');
  const rederived = E.primaryEntry(E.derive(reopened, { now: NOW }).state, 'CAP-02');
  assert.deepEqual([rederived.value, rederived.status, rederived.source.type], [recomputed, 'Estimated', 'derived'], 'the engine derives it again');
  const ops = apply(E.applyDefaults(fresh(), { now: NOW }).state, [{ op: 'confirm', entry: 'OPS-04.1' }, { op: 'set', entry: 'REL-05.1', value: 'region' }]);
  const [defaultAdvice] = recompute(ops);
  assert.deepEqual([defaultAdvice.id, defaultAdvice.msg.endsWith(DEFAULT_ADVICE)], ['RECOMPUTE-OPS-04.1', true]);
  assert.deepEqual(recompute(apply(ops, [{ op: 'set', entry: 'OPS-04.1', value: 'dev, test, stage, prod, dr' }])), [], 'a person sets the value');
  const refilled = E.primaryEntry(E.applyDefaults(apply(ops, [{ op: 'open', entry: 'OPS-04.1' }]), { now: NOW }).state, 'OPS-04');
  assert.deepEqual([refilled.value, refilled.status, refilled.source.type], ['dev, test, stage, prod, dr', 'Estimated', 'default'], 'the engine applies its default again');
});

test('validateState_recomputeKindHeldByPerson_adviceOmitsReopen', () => {
  const recompute = (state) => validation(state).advisories.filter((x) => x.id.startsWith('RECOMPUTE-'));
  const held = "the engine never changes a Confirmed value. Review it: set the value you want. A person set this entry's kind, so the engine no longer";
  const derived = E.derive(apply(fresh(), RECOMPUTE_INPUTS), { now: NOW }).state;
  const kept = apply(derived, [{ op: 'set', entry: 'CAP-02.1', kind: 'hard', reason: 'The request rate is contractual' }, { op: 'confirm', entry: 'CAP-02.1' }]);
  const entry = E.primaryEntry(kept, 'CAP-02');
  assert.deepEqual([entry.kind, entry.status, entry.source.type], ['hard', 'Confirmed', 'derived']);
  const stale = apply(kept, [{ op: 'set', entry: 'CAP-01.1', value: 1728000 }]);
  const [advice] = recompute(stale);
  assert.deepEqual([advice.id, advice.msg.endsWith(`${held} derives it.`), advice.msg.includes('reopen')], ['RECOMPUTE-CAP-02.1', true, false], advice.msg);
  assert.ok(advice.msg.startsWith('CAP-02.1 is Confirmed as 165 req/s, but CALC-03 (from CAP-01, CAP-04, CAP-02) now gives 330 req/s; '), advice.msg);
  assert.deepEqual(recompute(apply(stale, [{ op: 'set', entry: 'CAP-02.1', value: 330 }])), [], 'a person sets the value');
  const reopened = E.primaryEntry(E.derive(apply(stale, [{ op: 'open', entry: 'CAP-02.1' }]), { now: NOW }).state, 'CAP-02');
  assert.deepEqual([reopened.status, reopened.value], ['Open', null], 'derive leaves it Open, which is why reopening is not offered');
  const ops = apply(E.applyDefaults(fresh(), { now: NOW }).state, [{ op: 'set', entry: 'OPS-04.1', kind: 'target', reason: 'The environment list is negotiable' }, { op: 'confirm', entry: 'OPS-04.1' }, { op: 'set', entry: 'REL-05.1', value: 'region' }]);
  const [defaultAdvice] = recompute(ops);
  assert.deepEqual([defaultAdvice.id, defaultAdvice.msg.endsWith(`${held} applies its default.`)], ['RECOMPUTE-OPS-04.1', true], defaultAdvice.msg);
  assert.equal(E.primaryEntry(E.applyDefaults(apply(ops, [{ op: 'open', entry: 'OPS-04.1' }]), { now: NOW }).state, 'OPS-04').status, 'Open', 'applyDefaults leaves it Open too');
  const affirmed = apply(derived, [{ op: 'set', entry: 'CAP-02.1', kind: 'forecast', reason: 'A forecast, as the engine has it' }, { op: 'confirm', entry: 'CAP-02.1' }, { op: 'set', entry: 'CAP-01.1', value: 1728000 }]);
  assert.ok(recompute(affirmed)[0].msg.endsWith(DERIVED_ADVICE), 'a person who keeps the engine kind does not hold it');
  const refilled = E.primaryEntry(E.derive(apply(affirmed, [{ op: 'open', entry: 'CAP-02.1' }]), { now: NOW }).state, 'CAP-02');
  assert.deepEqual([refilled.status, refilled.value, refilled.source.type], ['Estimated', 330, 'derived'], 'so reopening still refills');
  const assumed = apply(E.applyDefaults(fresh(), { now: NOW }).state, [{ op: 'set', entry: 'OPS-04.1', kind: 'assumption', reason: 'An assumption, as the engine has it' }, { op: 'confirm', entry: 'OPS-04.1' }, { op: 'set', entry: 'REL-05.1', value: 'region' }]);
  assert.ok(recompute(assumed)[0].msg.endsWith(DEFAULT_ADVICE), 'the same for a project default');
  const restored = E.primaryEntry(E.applyDefaults(apply(assumed, [{ op: 'open', entry: 'OPS-04.1' }]), { now: NOW }).state, 'OPS-04');
  assert.deepEqual([restored.status, restored.value], ['Estimated', 'dev, test, stage, prod, dr']);
});

test('validateState_blockersWithoutG3_11_dt15Block', () => {
  const line = E.G3_CHECKLIST.find((x) => x.id === 'G3-11');
  const blank = validation(fresh()).blockers;
  const last = blank.at(-1);
  assert.equal(last.id, 'DT-15-BLOCK');
  assert.equal(last.msg, `DT-15: ${blank.length - 1} blockers and 0 conflicts remain, and G3 checklist line G3-11 is not done: ${line.text} Close each one, or have an empowered owner accept it formally, then tick G3-11.`);
  assert.deepEqual([last.owner, 'entry' in last], [OWNER, false]);
  const others = E.G3_CHECKLIST.filter((x) => x.id !== 'G3-11').map((x) => ({ op: 'check', id: x.id, status: 'Done' }));
  assert.equal(blockerIds(apply(fresh(), others)).at(-1), 'DT-15-BLOCK', 'every other line done');
  assert.equal(blockerIds(apply(fresh(), [{ op: 'check', id: 'G3-11', status: 'N/A', reason: 'No hard constraints' }])).at(-1), 'DT-15-BLOCK', 'N/A is not done');
  const done = apply(fresh(), [{ op: 'check', id: 'G3-11', status: 'Done' }]);
  assert.deepEqual(blockerIds(done), ids(blank).slice(0, -1));
  assert.deepEqual(validation(apply(fresh(), CLEAR)).blockers, []);
  const one = apply(fresh(), CLEAR.slice(1));
  assert.deepEqual(blockerIds(one), ['DT-01-STOP', 'DT-15-BLOCK']);
  assert.ok(validation(one).blockers[1].msg.startsWith('DT-15: 1 blocker and 0 conflicts remain, and'));
  const order = [...E.G3_CHECKLIST];
  try {
    E.G3_CHECKLIST.reverse();
    assert.notEqual(E.G3_CHECKLIST[10].id, 'G3-11');
    assert.equal(validation(fresh()).blockers.at(-1).msg, last.msg, 'the line is found by its ID');
    assert.deepEqual(blockerIds(done), ids(blank).slice(0, -1));
  } finally {
    E.G3_CHECKLIST.splice(0, E.G3_CHECKLIST.length, ...order);
  }
});

test('validateState_duplicateScope_blocker', () => {
  const state = build({ scopes: ['region', 'region'], rto: [[null, 600]], rpo: [[null, 60]] });
  const model = E.compute(state, { now: NOW });
  const dup = model.validation.blockers.filter((b) => b.id.startsWith('DUPLICATE-SCOPE'));
  assert.deepEqual(ids(dup), ['DUPLICATE-SCOPE@region']);
  assert.deepEqual(dup, model.scopes.flatMap((s) => s.blockers));
  assert.equal(ids(model.validation.blockers).at(-1), 'DT-15-BLOCK');
  assert.equal(new Set(ids(model.rules)).size, model.rules.length, 'one distinct scope runs the DR family once');
  assert.ok(!ids(model.rules).some((id) => id.includes('@')));
  const bare = build({ scopes: ['region', 'region'] });
  assert.deepEqual(validation(bare).blockers.filter((b) => b.id.startsWith('DT-03')).map((b) => [b.id, b.entry]), [['DT-03-BLOCK@region', 'REL-05.1']]);
});

test('validateState_confirmedWithoutWho_statusAdvisory', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'REL-01.1', value: 99.9 }, { op: 'confirm', entry: 'REL-01.1' }]);
  Object.assign(E.primaryEntry(state, 'REL-01'), { confirmed_by: null });
  const want = E.normalizeState(state, { now: NOW }).advisories;
  assert.deepEqual(want.map((x) => [x.id, x.entry]), [['STATUS-REL-01.1', 'REL-01.1']]);
  assert.deepEqual(validation(state).advisories.slice(-1), want);
  const normalized = E.normalizeState(state, { now: NOW }).state;
  assert.ok(!validation(normalized).advisories.some((x) => x.id.startsWith('STATUS-')));
});

test('validateState_twoScopes_drAdvisoriesSuffixed', () => {
  const state = build(TWO);
  const { advisories } = validation(state);
  assert.deepEqual(ids(advisories), ['OPEN-01', 'DR-zeroRTO-unverified@az', 'DR-location@region']);
  const { v, ctx } = E.toCalcInputs(state);
  const v22 = v22Model(v, ctx).warnings;
  assert.deepEqual(ids(v22), ['OPEN-01', 'DR-zeroRTO-unverified', 'DATA-commit-protocol'], 'v2.2 sees only the primary az scope, under its own multiAZActive topology');
  assert.deepEqual({ ...advisories[1], id: 'DR-zeroRTO-unverified' }, v22[1]);
  const single = build({ scopes: ['region'], rto: [['region', 3000]], rpo: [['region', 5]] });
  assert.deepEqual(ids(validation(single).advisories), ['OPEN-01', 'DR-location']);
});

test('validateState_overrideWithoutReason_blocker', () => {
  const reason = (state) => validation(state).blockers.filter((b) => b.id === 'OVERRIDE-reason');
  const state = build(TWO);
  assert.deepEqual(reason(state), []);
  Object.assign(state.decisions, { topology_override: 'multiAZ', dr_overrides: { region: 'warm', site: 'active' } });
  assert.deepEqual(reason(state), [{ id: 'OVERRIDE-reason', msg: 'Architect override requires a written rationale. No reason is recorded for: topology override multiAZ; DR override warm for region; DR override active for site.', owner: OWNER }]);
  assert.ok(!E.compute(state, { now: NOW }).scopes.some((s) => s.scope === 'site'), 'the site override counts though no scope takes it');
  const given = structuredClone(state);
  given.decisions.override_reason = 'One region by contract';
  assert.deepEqual(reason(given), [], 'a reason given');
  const spaces = structuredClone(state);
  spaces.decisions.override_reason = '   ';
  assert.equal(reason(spaces).length, 1, 'a blank reason is no reason');
  const odd = build(TWO);
  odd.decisions.topology_override = 'undetermined';
  assert.deepEqual(reason(odd), [], 'undetermined counts as none, as in the shape');
  odd.decisions.topology_override = 'sideways';
  assert.throws(() => reason(odd), SIDEWAYS, 'a value outside the enum is a gate rejection, not an override that needs a reason');
  const stray = build(TWO);
  stray.decisions.dr_overrides = { cyber: 'backup' };
  assert.deepEqual(ids(reason(stray)), ['OVERRIDE-reason']);
  assert.equal(E.compute(stray, { now: NOW }).rules.find((r) => r.id === 'ADR-16'), undefined, 'ADR-16 reads only the overrides a scope takes');
});

test('validateState_migrationSourceUnknown_blocker', () => {
  const source = (state) => validation(state).blockers.filter((b) => b.id.startsWith('OPEN-migration-source'));
  const unknown = imported({ changeType: 'brownfield', migration: 'yes' });
  assert.deepEqual([unknown.register.overlay.applies, unknown.register.overlay.source], [true, 'unknown']);
  assert.deepEqual(source(unknown), [{ id: 'OPEN-migration-source', msg: 'Migration source environment unknown.', owner: OWNER }]);
  assert.deepEqual(source(imported({ changeType: 'brownfield', migration: 'yes', sourcePlatform: 'onprem' })), [], 'a known source');
  const open = structuredClone(unknown);
  open.register.overlay.source = null;
  assert.deepEqual(ids(source(open)), ['OPEN-migration-source'], 'no source given');
  const off = structuredClone(unknown);
  off.register.overlay.applies = false;
  assert.deepEqual(source(off), [], 'the overlay does not apply');
  const two = structuredClone(unknown);
  two.register.overlay.workloads.push({ id: 'WL-02', name: 'Billing' });
  assert.deepEqual(ids(source(two)), ['OPEN-migration-source'], 'the overlay holds one source for every workload');
  const all = imported({ changeType: 'brownfield', migration: 'yes', residency: 'yes', failureScope: 'region', rtoSec: 600, rpoSec: 60, topologyOverride: 'regional' });
  const dup = apply(all, [{ op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }]);
  const order = blockerIds(dup).filter((id) => /^(DT-11|OVERRIDE|OPEN-migration|RESIDENCY|DUPLICATE|DT-15)/.test(id));
  assert.deepEqual(order, ['DT-11-BLOCK@WL-01', 'OVERRIDE-reason', 'OPEN-migration-source', 'RESIDENCY-region', 'DUPLICATE-SCOPE@region', 'DT-15-BLOCK']);
});

test('validateState_residencyWithoutLocation_blocker', () => {
  const region = (state) => validation(state).blockers.filter((b) => b.id === 'RESIDENCY-region');
  const yes = apply(fresh(), [{ op: 'set', entry: 'DAT-04.1', value: 'yes' }]);
  const want = [{ id: 'RESIDENCY-region', msg: 'Geographic restriction asserted but approved primary location not identified.', owner: 'D+Legal', entry: 'DAT-04.1' }];
  assert.deepEqual(region(yes), want);
  assert.deepEqual(region(apply(yes, [{ op: 'set-factor', entry: 'DAT-04.1', factor: 'primaryLocation', value: 'Frankfurt' }])), [], 'a location given');
  assert.deepEqual(region(apply(yes, [{ op: 'set-factor', entry: 'DAT-04.1', factor: 'recoveryLocation', value: 'Dublin' }])), want, 'a recovery location is not the primary one');
  assert.deepEqual(region(apply(fresh(), [{ op: 'set', entry: 'DAT-04.1', value: 'no' }])), []);
  assert.deepEqual(region(fresh()), [], 'residency still Open');
  assert.deepEqual(region(apply(yes, [exception('DAT-04.1')])), want, 'an exception does not lift it');
});

test('validateState_secondJourneyStricter_primaryOnlyAdvisory', () => {
  const only = (state) => validation(state).advisories.filter((x) => x.id.startsWith('PRIMARY-ONLY-'));
  const tail = 'make the primary entry the one to size for, or carry the others to the SDD.';
  const state = apply(fresh(), [{ op: 'set', entry: 'CAP-07.1', value: 300 }, { op: 'add', row: 'CAP-07', label: 'Refund status' }, { op: 'set', entry: 'CAP-07.2', value: 150 }]);
  assert.deepEqual(only(state), [{ id: 'PRIMARY-ONLY-CAP-07', msg: `CAP-07.1 holds 300 ms. Not read: CAP-07.2 holds 150 ms. The calculations and rules read only CAP-07.1; ${tail}`, owner: 'B+E', entry: 'CAP-07.1' }]);
  assert.equal(E.compute(state, { now: NOW }).v.p99Ms, 300, 'the calculations read CAP-07.1');
  assert.deepEqual(only(apply(state, [{ op: 'set', entry: 'CAP-07.2', value: 300 }])), [], 'equal to the primary');
  assert.deepEqual(only(apply(state, [{ op: 'set', entry: 'CAP-07.2', value: '' }])), [], 'Open');
  assert.deepEqual(only(apply(state, [{ op: 'na', entry: 'CAP-07.2', reason: 'A batch journey' }])), [], 'N/A');
  const factor = apply(state, [{ op: 'set', entry: 'CAP-07.2', value: 300 }, { op: 'set-factor', entry: 'CAP-07.1', factor: 'meanLatencyMs', value: 120 }, { op: 'set-factor', entry: 'CAP-07.2', factor: 'meanLatencyMs', value: 90 }]);
  assert.equal(only(factor)[0].msg, `CAP-07.1 holds 300 ms and meanLatencyMs 120 ms. Not read: CAP-07.2 holds 300 ms and meanLatencyMs 90 ms. The calculations and rules read only CAP-07.1; ${tail}`);
  const naWithFactor = apply(factor, [{ op: 'na', entry: 'CAP-07.2', reason: 'A batch journey' }]);
  assert.equal(E.rowEntries(naWithFactor, 'CAP-07')[1].factors.meanLatencyMs.value, 90, 'N/A keeps the factor');
  assert.equal(only(naWithFactor)[0].msg, `CAP-07.1 holds 300 ms and meanLatencyMs 120 ms. Not read: CAP-07.2 holds meanLatencyMs 90 ms. The calculations and rules read only CAP-07.1; ${tail}`, 'the entry status does not matter, its held factor does');
  const rows = apply(fresh(), [
    { op: 'add', row: 'CAP-01' }, { op: 'set', entry: 'CAP-01.2', value: 500000 },
    { op: 'set', entry: 'REL-01.1', value: 99.9 }, { op: 'add', row: 'REL-01' }, { op: 'set', entry: 'REL-01.2', value: 99.99 }, { op: 'add', row: 'REL-01' }, { op: 'set', entry: 'REL-01.3', value: 99.95 },
  ]);
  assert.deepEqual(only(rows).map((x) => x.msg.split('. The calculations')[0]), ['CAP-01.1: value not given. Not read: CAP-01.2 holds 500000 transactions/day', 'REL-01.1 holds 99.9 %. Not read: REL-01.2 holds 99.99 %; REL-01.3 holds 99.95 %']);
  const partial = apply(fresh(), [{ op: 'set', entry: 'CAP-07.1', value: 300 }, { op: 'add', row: 'CAP-07' }, { op: 'set-factor', entry: 'CAP-07.2', factor: 'meanLatencyMs', value: 90 }]);
  assert.equal(only(partial)[0].msg, `CAP-07.1 holds 300 ms; meanLatencyMs not given. Not read: CAP-07.2 holds meanLatencyMs 90 ms. The calculations and rules read only CAP-07.1; ${tail}`, 'an item the primary lacks is named');
  const migration = imported({ changeType: 'brownfield', migration: 'yes', sourcePlatform: 'onprem', migrationGB: 2000 });
  migration.register.overlay.workloads.push({ id: 'WL-02', name: 'Billing' });
  const wl2 = apply(migration, [{ op: 'add', row: 'OVL-07', workload: 'WL-02' }, { op: 'set-factor', entry: 'OVL-07.2', factor: 'migrationGB', value: 500 }, { op: 'set', entry: 'OVL-07.2', value: 'Bulk copy, then CDC' }]);
  assert.deepEqual(only(wl2).map((x) => [x.id, x.entry, x.msg]), [['PRIMARY-ONLY-OVL-07', 'OVL-07.1', `OVL-07.1 holds migrationGB 2000 GB. Not read: OVL-07.2 holds migrationGB 500 GB. The calculations and rules read only OVL-07.1; ${tail}`]]);
  const off = structuredClone(wl2);
  off.register.overlay.applies = false;
  assert.deepEqual(only(off), [], 'overlay rows count only while the overlay applies');
  const excluded = {
    'REL-03': [{ op: 'set', entry: 'REL-03.1', value: 600 }, { op: 'add', row: 'REL-03' }, { op: 'set', entry: 'REL-03.2', value: 60 }],
    'REL-04': [{ op: 'set', entry: 'REL-04.1', value: 600 }, { op: 'add', row: 'REL-04' }, { op: 'set', entry: 'REL-04.2', value: 60 }],
    'REL-05': [{ op: 'set', entry: 'REL-05.1', value: 'az' }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }],
  };
  for (const [row, ops] of Object.entries(excluded)) assert.deepEqual(only(apply(fresh(), ops)), [], `${row} reads its other entries itself`);
  const mixed = E.applyDefaults(apply(state, [{ op: 'set', entry: 'REL-03.1', value: 600, scope: 'site' }]), { now: NOW }).state;
  const placed = apply(mixed, [{ op: 'confirm', entry: 'OPS-04.1' }, { op: 'set', entry: 'REL-05.1', value: 'region' }]);
  assert.deepEqual(ids(validation(placed).advisories).filter((id) => /^(SCOPE-UNUSED|PRIMARY-ONLY|RECOMPUTE)/.test(id)), ['SCOPE-UNUSED-REL-03.1', 'PRIMARY-ONLY-CAP-07', 'RECOMPUTE-OPS-04.1']);
});

test('validateState_openOverlayEntryWithFactor_primaryOnlyAdvisory', () => {
  const only = (state) => validation(state).advisories.filter((x) => x.id.startsWith('PRIMARY-ONLY-'));
  const migration = imported({ changeType: 'brownfield', migration: 'yes', sourcePlatform: 'onprem', migrationGB: 2000 });
  migration.register.overlay.workloads.push({ id: 'WL-02', name: 'Billing' });
  const added = apply(migration, [{ op: 'add', row: 'OVL-07', workload: 'WL-02' }]);
  assert.deepEqual(only(added), [], 'an entry that holds nothing is ignored');
  const open = apply(added, [{ op: 'set-factor', entry: 'OVL-07.2', factor: 'migrationGB', value: 500 }]);
  const second = E.rowEntries(open, 'OVL-07')[1];
  assert.deepEqual([second.status, second.factors.migrationGB.status], ['Open', 'Estimated']);
  assert.deepEqual(only(open), [{ id: 'PRIMARY-ONLY-OVL-07', msg: 'OVL-07.1 holds migrationGB 2000 GB. Not read: OVL-07.2 holds migrationGB 500 GB. The calculations and rules read only OVL-07.1; make the primary entry the one to size for, or carry the others to the SDD.', owner: OWNER, entry: 'OVL-07.1' }]);
  assert.equal(E.compute(open, { now: NOW }).v.migrationGB, 2000, 'the calculations read OVL-07.1');
  assert.deepEqual(only(apply(added, [{ op: 'set-factor', entry: 'OVL-07.2', factor: 'migrationGB', value: 2000 }])), [], 'equal to the primary');
  assert.deepEqual(ids(only(apply(open, [{ op: 'na', entry: 'OVL-07.2', reason: 'Billing moves in a later wave' }]))), ['PRIMARY-ONLY-OVL-07'], 'N/A, with the factor still held');
});

test('validateState_extraWorkloadUnreadFactor_primaryOnlyAdvisory', () => {
  const only = (state) => validation(state).advisories.filter((x) => x.id.startsWith('PRIMARY-ONLY-'));
  const base = apply(fresh(), [
    { op: 'set', entry: 'DAT-05.1', value: 'strong' }, { op: 'set-factor', entry: 'DAT-05.1', factor: 'transactionNeed', value: 'yes' },
    { op: 'add', row: 'DAT-05', label: 'Reporting' }, { op: 'set', entry: 'DAT-05.2', value: 'eventual' },
  ]);
  const state = apply(base, [{ op: 'set-factor', entry: 'DAT-05.2', factor: 'transactionNeed', value: 'no' }]);
  const { v, ctx } = E.toCalcInputs(state);
  assert.deepEqual([v.dataConsistency, v.transactionNeed, ctx.extras.map((x) => x.consistency)], ['strong', 'yes', ['eventual']], 'DAT-05.2 is read as an extra workload, but not its transactionNeed');
  assert.deepEqual(only(state), [{ id: 'PRIMARY-ONLY-DAT-05', msg: 'DAT-05.1 holds transactionNeed yes. Not read: DAT-05.2 holds transactionNeed no. The calculations and rules read only DAT-05.1; make the primary entry the one to size for, or carry the others to the SDD.', owner: 'B+D', entry: 'DAT-05.1' }]);
  assert.deepEqual(only(apply(base, [{ op: 'set-factor', entry: 'DAT-05.2', factor: 'transactionNeed', value: 'yes' }])), [], 'equal to the primary');
  const unset = apply(fresh(), [{ op: 'add', row: 'DAT-05' }, { op: 'set-factor', entry: 'DAT-05.2', factor: 'transactionNeed', value: 'no' }]);
  assert.equal(only(unset)[0].msg.split('. The calculations')[0], 'DAT-05.1: transactionNeed not given. Not read: DAT-05.2 holds transactionNeed no');
});

test('validateState_extraWorkloadReadValue_noPrimaryOnly', () => {
  const only = (state) => validation(state).advisories.filter((x) => x.id.startsWith('PRIMARY-ONLY-'));
  const state = apply(fresh(), [
    { op: 'set', entry: 'DAT-05.1', value: 'strong' }, { op: 'add', row: 'DAT-05', label: 'Reporting' }, { op: 'set', entry: 'DAT-05.2', value: 'eventual' },
    { op: 'set-factor', entry: 'DAT-01.1', factor: 'storeKind', value: 'relational' }, { op: 'add', row: 'DAT-01', label: 'Reporting' }, { op: 'set-factor', entry: 'DAT-01.2', factor: 'storeKind', value: 'analytics' },
  ]);
  const { v, ctx } = E.toCalcInputs(state);
  assert.deepEqual([v.dataConsistency, v.dataKind], ['strong', 'relational']);
  assert.deepEqual(ctx.extras, [{ name: 'Reporting', kind: 'analytics', consistency: 'eventual' }], 'both values are read as an extra workload');
  assert.deepEqual(only(state), []);
  const extras = [{ name: 'Reporting', kind: 'analytics', consistency: 'eventual' }, { name: 'Archive', kind: 'document', consistency: 'strong' }];
  assert.deepEqual(only(E.importV22({ inputs: { ...BLANK, dataKind: 'relational', dataConsistency: 'strong' }, extraWorkloads: extras }, OPTS)), [], 'imported extra workloads');
});

test('rules_twoScopes_ha02TriggerListsScopes', () => {
  const ha = (state) => E.compute(state, { now: NOW }).rules.find((r) => r.id === 'HA-02');
  const availability = [{ op: 'set', entry: 'REL-01.1', value: 99.9 }];
  assert.equal(ha(build({ scopes: ['az', 'host'], rto: [[null, 600]], rpo: [[null, 60]], extra: availability })).trigger, 'fault=az, host, availability=99.9%');
  const multi = build(TWO);
  multi.decisions.topology_override = 'multiAZ';
  assert.equal(ha(multi).trigger, 'fault=az, region, availability=99.9%');
  assert.equal(ha(build({ scopes: [null, 'az'], extra: availability })).trigger, 'fault=unknown, az, availability=99.9%');
  const single = build({ scopes: ['az'], rto: [[null, 600]], rpo: [[null, 60]], extra: availability });
  const { v, ctx } = E.toCalcInputs(single);
  assert.equal(ha(single).trigger, 'fault=az, availability=99.9%');
  assert.equal(ha(single).trigger, v22Model(v, ctx).rules.find((r) => r.id === 'HA-02').trigger, 'one scope keeps the v2.2 text');
  assert.equal(ha(build({ scopes: ['az', 'az'], extra: availability })).trigger, 'fault=az, availability=99.9%', 'one distinct scope');
});

test('validateState_conflictWithoutG3_11_dt15Block', () => {
  const line = E.G3_CHECKLIST.find((x) => x.id === 'G3-11');
  const state = apply(fresh(), [...CLEAR, { op: 'set', entry: 'REL-05.1', value: 'region' }]);
  Object.assign(state.decisions, { topology_override: 'multiAZ', override_reason: 'One region by contract' });
  const got = validation(state);
  assert.deepEqual(ids(got.conflicts), ['CONFLICT-region@region']);
  assert.deepEqual(got.blockers, [{ id: 'DT-15-BLOCK', msg: `DT-15: 0 blockers and 1 conflict remain, and G3 checklist line G3-11 is not done: ${line.text} Close each one, or have an empowered owner accept it formally, then tick G3-11.`, owner: OWNER }]);
  const ticked = apply(state, [{ op: 'check', id: 'G3-11', status: 'Done' }]);
  assert.deepEqual(validation(ticked).blockers, []);
  assert.deepEqual(ids(validation(ticked).conflicts), ['CONFLICT-region@region'], 'the conflict itself stays');
  assert.deepEqual(validation(apply(fresh(), CLEAR)).blockers, [], 'no blocker and no conflict');
});

test('validateState_primaryScopeOpen_dt03Unknown', () => {
  const dt03 = (state) => validation(state).blockers.filter((b) => b.id.startsWith('DT-03'));
  assert.deepEqual(dt03(fresh()), [{ id: 'DT-03-BLOCK@unknown', msg: 'DT-03: REL-05.1 names no failure scope, so no RTO or RPO can be committed for it; name the failure scope and give its RTO and RPO.', owner: 'B+Ops', entry: 'REL-05.1' }]);
  assert.deepEqual(ids(dt03(build({ rto: [[null, 600]], rpo: [[null, 60]] }))), ['DT-03-BLOCK@unknown'], 'an RTO and RPO without a scope still block');
  assert.deepEqual(ids(dt03(apply(fresh(), [{ op: 'set', entry: 'REL-05.1', value: '' }]))), ['DT-03-BLOCK@unknown'], 'left open by a person');
  assert.deepEqual(dt03(apply(fresh(), [exception('REL-05.1')])), [], 'an exception on REL-05.1 lifts it');
  assert.deepEqual(dt03(build({ scopes: ['region', null], rto: [[null, 600]], rpo: [[null, 60]] })), [], 'an Open second entry stays optional');
  assert.deepEqual(ids(dt03(build({ scopes: [null, 'region'], rto: [['region', 600]] }))), ['DT-03-BLOCK@unknown', 'DT-03-BLOCK@region']);
});

test('validateState_primaryScopeNa_noDt03', () => {
  const na = apply(fresh(), [{ op: 'na', entry: 'REL-05.1', reason: 'No DR commitment in this phase' }]);
  assert.equal(E.primaryEntry(na, 'REL-05').status, 'N/A');
  assert.deepEqual(validation(na).blockers.filter((b) => b.id.startsWith('DT-03')), []);
});

test('validateState_overlayNotApplying_hardOverlayRowNoBlocker', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'OVL-10.1', kind: 'hard', reason: 'Rollback is contractual' }]);
  assert.deepEqual([state.register.overlay.applies, E.rowEntries(state, 'OVL-10')[0].kind], [false, 'hard']);
  assert.ok(!blockerIds(state).includes('OPEN-OVL-10.1'));
  assert.ok(blockerIds(state).includes('OPEN-DAT-04.1'), 'register items still block');
  const applies = structuredClone(state);
  applies.register.overlay.applies = true;
  assert.ok(blockerIds(applies).includes('OPEN-OVL-10.1'));
});

test('validateState_overlayNotApplying_invalidFactorNoBlocker', () => {
  const state = apply(fresh(), [...CLEAR, { op: 'set-factor', entry: 'OVL-08.1', factor: 'linkMbps', value: 0 }]);
  assert.deepEqual([state.register.overlay.applies, E.rowEntries(state, 'OVL-08')[0].factors.linkMbps.value], [false, 0]);
  assert.deepEqual(validation(state).blockers, [], 'no INVALID, and nothing for DT-15 to count');
  const applies = structuredClone(state);
  applies.register.overlay.applies = true;
  const got = validation(applies).blockers;
  assert.ok(ids(got).includes('INVALID-OVL-08.1.linkMbps'), 'it blocks once the overlay applies');
  assert.equal(got.find((b) => b.id === 'INVALID-OVL-08.1.linkMbps').msg, 'OVL-08.1.linkMbps is 0, which is not above 0, so the calculations treat it as TBD; correct the value.');
});

test('decisionRules_readPercentKnown_emitsDbRead17', () => {
  const rulesOf = (v) => ids(v22Model(v, E.toCalcInputs(fresh()).ctx).rules);
  assert.ok(rulesOf({ ...BLANK, readPercent: 70 }).includes('DB-READ-17'));
  assert.ok(!rulesOf({ ...BLANK, readPercent: 70 }).includes('DB-READ-11'));
  assert.ok(!rulesOf(BLANK).includes('DB-READ-17'));
  const rule = E.compute(imported({ readPercent: 70 }), { now: NOW }).rules.find((r) => r.id === 'DB-READ-17');
  assert.deepEqual([rule.title, rule.trigger], ['Read/write operation mix', 'read operations=70%; write operations=30%']);
  assert.deepEqual(E.RULE_RENAMES, { 'DB-READ-11': 'DB-READ-17', 'CAP-04': 'LOAD-04' });
});

test('decisionRules_capacityRule_emitsLoad04', () => {
  const v = { ...BLANK, dailyTxn: 864000 };
  const c = E.calculations(v);
  const rules = E.decisionRules(v, c, E.selectArchitecture(v, c));
  const load = rules.find((r) => r.id === 'LOAD-04');
  assert.deepEqual([load.title, load.trigger], ['Workload-based capacity planning', `peak=${E.fmt(c.peakTPS, 2)} TPS; ${E.fmt(c.rps, 2)} API RPS`]);
  assert.ok(!ids(rules).includes('CAP-04'));
  assert.ok(ids(E.compute(imported({ dailyTxn: 864000 }), { now: NOW }).rules).includes('LOAD-04'));
  const g = goldenCase('demo');
  const files = E.exportFiles(E.modelV22(g.projectState.inputs, g.ctx), g.ctx);
  assert.ok(files['Decision_Record.md'].includes('## LOAD-04: Workload-based capacity planning'));
  assert.ok(!files['Decision_Record.md'].includes('## CAP-04:'), 'the v2.2 page shows the new ID');
});

test('rules_twoScopes_drFamilySuffixed', () => {
  const state = build(TWO);
  const model = E.compute(state, { now: NOW });
  assert.equal(model.shape.topology, 'regional');
  assert.deepEqual(ids(model.rules), ['ARCH-01', 'DR-03@region', 'LOAD-04', 'DR-06@az', 'DR-ZERO-01@az', 'DR-ZERO-02@az', 'DATA-07@az', 'DATA-08@region', 'DB-09', 'SLO-15@region']);
  for (const r of model.rules) assert.equal(r.id.includes('@'), DR_FAMILY.includes(r.id.split('@')[0]), r.id);
  const byId = Object.fromEntries(model.rules.map((r) => [r.id, r]));
  assert.deepEqual([byId['DR-06@az'].trigger, byId['DR-03@region'].trigger, byId['SLO-15@region'].trigger], ['RTO=0 s for az', 'failure scope=region', 'RTO=50 min; 30-day budget=43.2 min']);
  const { v, ctx } = E.toCalcInputs(state);
  assert.deepEqual(ids(v22Model(v, ctx).rules), ['ARCH-01', 'HA-02', 'LOAD-04', 'DR-06', 'DR-ZERO-01', 'DR-ZERO-02', 'DATA-07', 'DB-09'], 'v2.2 sees only the primary az scope');
  const order = sourceIds(E.decisionRules, 'add').ids;
  const checked = (list, many = true) => {
    const at = list.map((id) => order.indexOf(id.split('@')[0]));
    assert.ok(at.every((n, i) => n >= 0 && (i === 0 || n >= at[i - 1])), `in decisionRules order: ${list.join(', ')}`);
    for (const id of list) assert.equal(id.includes('@'), many && DR_FAMILY.includes(id.split('@')[0]), id);
    return list;
  };
  checked(ids(model.rules));
  const multi = build(TWO);
  multi.decisions.topology_override = 'multiAZ';
  assert.deepEqual(checked(ids(E.compute(multi, { now: NOW }).rules)), ['ARCH-01', 'HA-02', 'DR-03@region', 'LOAD-04', 'DR-06@az', 'DR-ZERO-01@az', 'DR-ZERO-02@az', 'DATA-07@az', 'DATA-08@region', 'DB-09', 'SLO-15@region', 'ADR-16']);
  const single = build({ scopes: ['region'], rto: [[null, 3000]], rpo: [[null, 5]], extra: TWO.extra });
  assert.deepEqual(checked(ids(E.compute(single, { now: NOW }).rules), false), ['ARCH-01', 'DR-03', 'LOAD-04', 'DATA-08', 'DB-09', 'SLO-15']);
  let shared = 0;
  for (const scope of E.ITEMS.find((row) => row.id === 'REL-05').enumValues) {
    const other = scope === 'host' ? 'az' : 'host';
    const pair = build({ scopes: [scope, other], rto: [[null, 0]], rpo: [[null, 0]] });
    const got = checked(ids(E.compute(pair, { now: NOW }).rules));
    for (const id of ['DR-06', 'DR-ZERO-01', 'DR-ZERO-02', 'DATA-07']) for (const key of [scope, other]) assert.ok(got.includes(`${id}@${key}`), `${id}@${key}`);
    if (got.includes('HA-02')) shared++;
  }
  assert.equal(shared, 3, 'the host, az and cyber pairs share one multi-zone shape, so HA-02 runs once for it');
  const open = build({ scopes: [null, 'region'], rto: [[null, 0]], rpo: [[null, 0]] });
  const got = checked(ids(E.compute(open, { now: NOW }).rules));
  assert.ok(got.includes('DR-ZERO-01@unknown') && got.includes('DR-ZERO-01@region') && got.includes('DR-03@region'), got.join(', '));
});

test('rules_drOverrideOnSecondScope_adr16Fires', () => {
  const adr = (state) => E.compute(state, { now: NOW }).rules.find((r) => r.id === 'ADR-16');
  const state = build(TWO);
  Object.assign(state.decisions, { dr_overrides: { region: 'active' }, override_reason: 'Payments need it' });
  assert.equal(adr(state).trigger, 'topology=auto; DR=active@region');
  assert.ok(ids(validation(state).advisories).includes('OVERRIDE-review'));
  const { v, ctx } = E.toCalcInputs(state);
  assert.equal(v.drOverride, 'auto');
  assert.ok(!ids(v22Model(v, ctx).rules).includes('ADR-16'), 'v2.2 reads the override of the primary az scope only');
  Object.assign(state.decisions, { topology_override: 'active', dr_overrides: { az: 'warm', region: 'active' } });
  assert.equal(adr(state).trigger, 'topology=active; DR=warm@az, active@region');
  Object.assign(state.decisions, { topology_override: 'auto', dr_overrides: { site: 'warm' } });
  assert.equal(adr(state), undefined, 'an override for a scope with no REL-05 entry applies to nothing');
  assert.ok(!ids(validation(state).advisories).includes('OVERRIDE-review'));
  const single = build({ scopes: ['region'], rto: [[null, 600]], rpo: [[null, 60]] });
  single.decisions.dr_overrides = { region: 'warm' };
  assert.equal(adr(single).trigger, 'topology=auto; DR=warm');
  const odd = build(TWO);
  odd.decisions.topology_override = 'undetermined';
  assert.equal(adr(odd), undefined, 'the shape reads an undetermined override as none');
  const view = E.toCalcInputs(odd);
  assert.equal(view.v.topologyOverride, 'auto');
  assert.ok(!ids(v22Model(view.v, view.ctx).rules).includes('ADR-16'), 'v2.2 reads it as none too');
  odd.decisions.topology_override = 'sideways';
  assert.throws(() => adr(odd), SIDEWAYS, 'the gate rejects a topology outside the enum before the rules read it');
});

test('compute_storedAutoDrOverride_notSetAnywhere', () => {
  const base = build(TWO);
  base.decisions.override_reason = 'A reason with nothing to explain';
  const want = E.compute(base, { now: NOW });
  assert.ok(!ids(want.rules).includes('ADR-16') && !ids(want.validation.advisories).includes('OVERRIDE-review'));
  for (const stored of [{ az: 'auto', region: 'auto' }, { az: '', region: '  ' }, { region: 'undetermined' }]) {
    const state = structuredClone(base);
    state.decisions.dr_overrides = stored;
    const label = JSON.stringify(stored);
    const got = E.compute(state, { now: NOW });
    const { advisories, ...rest } = got.validation;
    assert.deepEqual(got.rules, want.rules, `${label}: no ADR-16`);
    assert.deepEqual(ids(advisories.filter((a) => a.id.startsWith('STATUS-'))), Object.keys(stored).map((key) => `STATUS-decisions.dr_overrides.${key}`), `${label}: the gate removes each key with a STATUS advisory`);
    assert.deepEqual({ ...rest, advisories: advisories.filter((a) => !a.id.startsWith('STATUS-')) }, want.validation, `${label}: no OVERRIDE-reason and no OVERRIDE-review`);
    assert.deepEqual(E.normalizeState(state, { now: NOW }).state.decisions, base.decisions, `${label}: the normalized state holds no DR override`);
    assert.deepEqual([got.scopes, got.shape, got.gate], [want.scopes, want.shape, want.gate], `${label}: the strategies are the defaults`);
    assert.equal(E.toCalcInputs(state).v.drOverride, 'auto', `${label}: v2.2 sees no override`);
    const unexplained = structuredClone(state);
    unexplained.decisions.override_reason = '';
    assert.ok(!ids(validation(unexplained).blockers).includes('OVERRIDE-reason'), `${label}: nothing needs a reason`);
  }
});

test('compute_storedUndeterminedTopologyOverride_notSetAnywhere', () => {
  const base = build(TWO);
  assert.deepEqual([base.decisions.topology_override, base.decisions.override_reason], ['auto', '']);
  const want = E.compute(base, { now: NOW });
  for (const stored of ['undetermined', '', '  ']) {
    const state = structuredClone(base);
    state.decisions.topology_override = stored;
    const label = JSON.stringify(stored);
    const got = E.compute(state, { now: NOW });
    assert.deepEqual([got.v, got.a], [want.v, want.a], `${label}: v2.2 sees auto`);
    const { advisories, ...rest } = got.validation;
    assert.deepEqual(ids(advisories.filter((a) => a.id.startsWith('STATUS-'))), ['STATUS-decisions.topology_override'], `${label}: the gate stores auto with a STATUS advisory`);
    assert.deepEqual({ ...got, validation: { ...rest, advisories: advisories.filter((a) => !a.id.startsWith('STATUS-')) } }, want, `${label}: every other compute result equals the state with auto`);
    assert.ok(!ids(got.validation.blockers).includes('OVERRIDE-reason'), `${label}: nothing needs a reason`);
  }
  for (const value of ['auto', 'single', 'multiAZ', 'multiAZActive', 'regional', 'active']) {
    const { v } = E.toCalcInputs(imported({ failureScope: 'region', topologyOverride: value }));
    assert.equal(v.topologyOverride, value, `an imported ${value} reaches v2.2 unchanged`);
  }
});

test('rules_emptyExtraScopeEntry_idsUnchanged', () => {
  const base = E.importV22(goldenCase('demo').projectState, OPTS);
  const want = E.compute(base, { now: NOW });
  const open = apply(base, [{ op: 'add', row: 'REL-05' }]);
  const na = apply(open, [{ op: 'na', entry: 'REL-05.2', reason: 'No second scope' }]);
  for (const [name, state] of [['Open', open], ['N/A', na]]) {
    const got = E.compute(state, { now: NOW });
    assert.equal(E.rowEntries(state, 'REL-05').length, 2, name);
    assert.deepEqual(got.rules, want.rules, `${name}: rules`);
    assert.deepEqual(got.validation.conflicts, want.validation.conflicts, `${name}: conflicts`);
    assert.deepEqual(got.validation.advisories, want.validation.advisories, `${name}: advisories`);
    assert.deepEqual(got.validation.blockers, want.validation.blockers, `${name}: blockers`);
    assert.deepEqual([got.scopes, got.shape], [want.scopes, want.shape], `${name}: scopes and shape`);
  }
  const region = build({ scopes: ['region'], rto: [[null, 0]], rpo: [[null, 0]] });
  const extra = E.compute(apply(region, [{ op: 'add', row: 'REL-05' }]), { now: NOW });
  assert.deepEqual(ids(extra.rules), ids(E.compute(region, { now: NOW }).rules));
  assert.ok(!ids(extra.rules).some((id) => id.includes('@')) && !ids(extra.validation.advisories).includes('DR-zero-scope@unknown'), 'no unknown scope from an empty extra entry');
});

test('ruleIds_neverEqualItemIds', () => {
  const items = new Set([...E.ITEMS, ...E.HEADER_FIELDS, ...E.OVERLAY_FIELDS].map((row) => row.id));
  assert.equal(items.size, 92);
  const { ids: fromCode, renamed } = sourceIds(E.decisionRules, 'add');
  assert.deepEqual(renamed.sort(), Object.keys(E.RULE_RENAMES).sort(), 'decisionRules takes both renamed IDs from RULE_RENAMES');
  const emitted = new Set();
  for (const [, inputs] of TRIGGERS) for (const r of E.compute(imported(inputs), { now: NOW }).rules) emitted.add(r.id);
  for (const state of [build(TWO), build({ scopes: [null, 'region'], rto: [[null, 0]], rpo: [[null, 0]] })]) for (const r of E.compute(state, { now: NOW }).rules) emitted.add(r.id);
  assert.ok([...emitted].some((id) => id.includes('@')), 'suffixed IDs are checked too');
  const all = new Set([...fromCode, ...emitted, ...[...emitted].map((id) => id.split('@')[0])]);
  for (const id of all) assert.ok(!items.has(id), `${id} is also a register item ID`);
  const before = fromCode.map((id) => Object.keys(E.RULE_RENAMES).find((old) => E.RULE_RENAMES[old] === id) ?? id);
  assert.deepEqual(before.filter((id) => items.has(id)), ['CAP-04'], 'without the renames the check fails');
});

test('rules_everyRuleId_hasTriggerCase', () => {
  const { ids: fromCode, sites } = sourceIds(E.decisionRules, 'add');
  assert.equal(fromCode.length, sites, 'every rule in decisionRules has a literal or renamed ID');
  assert.equal(new Set(fromCode).size, fromCode.length);
  assert.deepEqual(TRIGGERS.map(([id]) => id), fromCode, 'one case per rule ID, in code order');
  const { ctx } = E.toCalcInputs(fresh());
  for (const [id, inputs] of TRIGGERS) {
    const once = (list) => list.filter((r) => r.id === id).length;
    assert.equal(once(v22Model({ ...BLANK, ...inputs }, ctx).rules), 1, `decisionRules: ${id}`);
    const rules = E.compute(imported(inputs), { now: NOW }).rules;
    assert.equal(once(rules), 1, `3.0 rules: ${id}`);
    for (const r of rules) assert.ok(fromCode.includes(r.id.split('@')[0]), `${r.id} comes from decisionRules`);
  }
});

test('compute_importedV22Grid_rulesAndAdvisoriesMatchV22', () => {
  const rulesSeen = new Set();
  const advisoriesSeen = new Set();
  const carried = new Map(CARRIED_BLOCKERS.map((id) => [id, new Set()]));
  const pick = (list) => ids(list).filter((id) => CARRIED_BLOCKERS.includes(id));
  let cases = 0;
  for (const record of v22Grid()) {
    const state = E.importV22(record, OPTS);
    const model = E.compute(state, { now: NOW });
    const { v, ctx } = E.toCalcInputs(state);
    const want = v22Model(v, ctx);
    assert.deepEqual(model.rules, want.rules, JSON.stringify(record));
    assert.deepEqual(model.validation.advisories, want.warnings, JSON.stringify(record));
    assert.deepEqual(pick(model.validation.blockers), pick(want.blockers), JSON.stringify(record));
    for (const id of CARRIED_BLOCKERS) carried.get(id).add(pick(want.blockers).includes(id));
    for (const r of model.rules) rulesSeen.add(r.id);
    for (const x of model.validation.advisories) advisoriesSeen.add(x.id);
    cases++;
  }
  assert.equal(cases, 3444);
  for (const [id, outcomes] of carried) assert.equal(outcomes.size, 2, `${id} both fires and stays quiet in the grid`);
  assert.deepEqual([...rulesSeen].sort(), [...sourceIds(E.decisionRules, 'add').ids].sort(), 'every rule fires in the grid');
  const { ids: warnings, sites } = sourceIds(E.validate, 'W');
  assert.equal(warnings.length, sites);
  assert.deepEqual([...advisoriesSeen].sort(), warnings.filter((id) => !DROPPED.includes(id)).sort(), 'every carried v2.2 warning fires in the grid');
});

test('compute_hdr07Mixed_sameAsV22Unknown', () => {
  sameAsV22('changeType', 'HDR-07', 'mixed', 'unknown', 'change');
  const state = apply(imported({ migration: 'no' }), [{ op: 'set', entry: 'HDR-07.1', value: 'mixed' }]);
  const { v, ctx } = E.toCalcInputs(state);
  const brownfield = v22Model({ ...v, changeType: 'brownfield' }, ctx);
  assert.ok(ids(brownfield.rules).includes('MIG-13') && ids(brownfield.warnings).includes('BF-inventory'), 'a real v2.2 value would differ');
  assert.ok(!ids(E.compute(state, { now: NOW }).rules).includes('MIG-13'));
});

test('compute_hdr08Undecided_sameAsV22Unknown', () => {
  const seen = sameAsV22('target', 'HDR-08', 'undecided', 'unknown', 'target');
  assert.ok(seen.has('MIG-13') && seen.has('BF-inventory'));
  const state = apply(imported({ changeType: 'greenfield' }), [{ op: 'set', entry: 'HDR-08.1', value: 'undecided' }]);
  const { v, ctx } = E.toCalcInputs(state);
  assert.equal(E.compute(state, { now: NOW }).rules[0].assessment, 'Keep eligible hosting candidates open. No forced provider.');
  assert.equal(v22Model({ ...v, target: 'cloud' }, ctx).rules[0].assessment, 'Route to GF-CL; migration is a separate overlay.', 'a real v2.2 value would differ');
});

test('rulesAndWarnings_neverReadTenantModel', () => {
  const source = readText(new URL('../src/engine.js', import.meta.url));
  const start = source.indexOf('const CARRIED_WARNINGS=[');
  const end = source.indexOf(']];', start);
  assert.ok(start > 0 && end > start, 'the carried clauses are found');
  const carried = source.slice(start, end);
  assert.ok(carried.includes("['OPEN-01'") && carried.includes("['REL-test'"), 'every carried clause is scanned');
  const scanned = [['decisionRules', E.decisionRules], ['selectArchitecture', E.selectArchitecture], ['classify', E.classify], ['inferredKind', E.inferredKind]].map(([name, fn]) => [name, fn.toString()]);
  for (const [name, text] of [...scanned, ['the carried clauses', carried]]) assert.ok(!text.includes('tenantModel'), `${name} reads tenantModel`);
  assert.ok(source.includes('tenantModel') && E.fieldIds.includes('tenantModel'), 'the scan finds the name where the engine holds it');
  const { v } = E.toCalcInputs(apply(fresh(), [{ op: 'set', entry: 'DAT-07.1', value: 'schema-isolated' }]));
  assert.equal(v.tenantModel, 'schema-isolated', 'a 3.0-only value reaches the inputs, so only this scan shows that nothing reads it');
});

test('compute_state_returnsRulesAndValidation', () => {
  const state = E.importV22(goldenCase('regional-zero').projectState, OPTS);
  const model = E.compute(state, { now: NOW });
  assert.deepEqual(Object.keys(model), ['v', 'c', 'a', 'rules', 'graph', 'scopes', 'shape', 'options', 'validation', 'gate']);
  const { validation: got, gate, ...rest } = model;
  assert.deepEqual(E.gateStatus(E.normalizeState(state, { now: NOW }).state, { ...rest, validation: got }, { now: NOW }), gate, 'compute hands gateStatus the normalized state');
  assert.deepEqual(E.validateState(state, rest, { now: NOW }), got);
  assert.deepEqual(Object.keys(got), ['blockers', 'conflicts', 'advisories']);
  assert.deepEqual(ids(got.conflicts), ['CONFLICT-rpo0@region']);
  assert.deepEqual(got.conflicts, model.shape.conflicts);
  assert.notEqual(got.conflicts[0], model.shape.conflicts[0]);
  const texts = [];
  for (const s of [state, build(TWO), apply(fresh(), [exception('DAT-04.1', '2026-10-01', '2026-09-01')])]) {
    const v = validation(s);
    for (const x of [...v.blockers, ...v.conflicts, ...v.advisories]) {
      assert.deepEqual([typeof x.id, typeof x.msg, typeof x.owner], ['string', 'string', 'string'], x.id);
      texts.push(x.id, x.msg, x.owner);
    }
  }
  assert.ok(texts.length > 60);
  assert.ok(texts.every((t) => !/[\u2013\u2014]/.test(t)), 'no em or en dash in validation text');
});

test('validateState_nowWithoutOffset_rejected', () => {
  const state = fresh();
  const { validation: got, ...model } = E.compute(state, { now: NOW });
  for (const now of ['2026-10-23T11:01:02', '2026-02-30T10:00:00Z', 'now', undefined]) {
    assert.throws(() => E.validateState(state, model, { now }), { message: /now must be a Date, or an ISO 8601 timestamp with Z or an offset/ }, String(now));
  }
  assert.deepEqual(E.validateState(state, model, { now: '2026-10-23T13:01:02+02:00' }), got);
});
