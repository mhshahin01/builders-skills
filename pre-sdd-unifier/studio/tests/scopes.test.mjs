import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, digest } from './helpers.mjs';

const E = loadEngine();
const examplesDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'examples');
const NOW = '2026-10-23T11:01:02Z';
const person = { type: 'person', name: 'Mahmoud', label: '' };
const CONFLICT_IDS = ['CONFLICT-region', 'CONFLICT-zone', 'CONFLICT-site', 'CONFLICT-active-dr', 'CONFLICT-provider', 'CONFLICT-zeroRTO-topology', 'CONFLICT-zeroRTO-strategy', 'CONFLICT-cyber-zero', 'CONFLICT-rpo0'];
const TOPOLOGIES = ['undetermined', 'single', 'multiAZ', 'multiAZActive', 'regional', 'active'];
const AZ_REGION = { scopes: ['az', 'region'], rto: [['az', 5], ['region', 600]], rpo: [['az', 0], ['region', 60]] };
const REGION_PLAIN = [{ op: 'set', entry: 'REL-05.1', value: 'region' }, { op: 'set', entry: 'REL-03.1', value: 600 }, { op: 'set', entry: 'REL-04.1', value: 0 }];
const REGION_DECISIONS = { topology_override: 'multiAZ', dr_overrides: { region: 'active' } };
const REMOTE = ['site', 'region', 'provider'];
const V22_GRID = {
  digest: '42fab19f715bba259e593e5b4b0d312cb924044929717d65c2434e30750660e8',
  counts: { 'CONFLICT-region': 1080, 'CONFLICT-zone': 180, 'CONFLICT-site': 180, 'CONFLICT-active-dr': 1224, 'CONFLICT-provider': 180, 'CONFLICT-zeroRTO-topology': 765, 'CONFLICT-zeroRTO-strategy': 1134, 'CONFLICT-cyber-zero': 540, 'CONFLICT-rpo0': 540 },
};
const V22_SAME = {
  'changeType=unknown': V22_GRID.digest,
  'target=unknown': '60bc3b7f0cc52eb89421dd358cd537760a42d0cab1173c53a7bef406f03794c8',
  'tenantModel=shared': V22_GRID.digest,
  'tenantModel=unknown': V22_GRID.digest,
};
const REGION_CONFLICT = { id: 'CONFLICT-region', msg: 'Selected single-region placement cannot independently survive an entire region/provider outage.', owner: 'Lead architect / responsible owner' };
const THRESHOLDS = (() => {
  const v = (rtoSec, rpoSec, failureScope = 'region', budget = 'balanced') => ({ rtoSec, rpoSec, failureScope, budget });
  return [
    [v(30, 0), 'active'], [v(31, 0), 'warm'], [v(900, 900), 'warm'], [v(901, 900), 'warm'],
    [v(901, 901), 'pilot'], [v(3600, 900), 'warm'], [v(3601, 900), 'pilot'],
    [v(14400, 3600, 'region', 'tight'), 'pilot'], [v(14401, 3600, 'region', 'tight'), 'backup'],
    [v(14401, 3599, 'region', 'tight'), 'pilot'], [v(14401, 3600, 'region', 'balanced'), 'pilot'],
    [v(60, 0, 'provider'), 'active'], [v(61, 0, 'provider'), 'warm'],
    [v(5, 5, 'az'), 'localHA'], [v(5, 5, 'host'), 'localHA'],
    [v(0, 60, 'cyber'), 'cyberReview'], [v(60, 60, 'cyber'), 'backup'],
    [v(null, 60), 'unresolved'], [v(60, 60, 'unknown'), 'unresolved'],
  ];
})();

const fresh = () => E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW });
const BLANK = E.toCalcInputs(fresh()).v;
const ids = (list) => list.map((x) => x.id);

function apply(state, ops) {
  const result = E.applyPatch(state, ops, person, { now: NOW });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

function forced(state, id, value) {
  const out = structuredClone(state), [rowId, n] = id.split('.');
  Object.assign(E.rowEntries(out, rowId).find((e) => e.n === Number(n)), { value, status: 'Estimated' });
  return out;
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

function scopesOf(state) {
  const { v } = E.toCalcInputs(state);
  return E.assessScopes(state, v, E.calculations(v));
}

const shapeOf = (state) => E.targetShape(state, scopesOf(state));
const scopeView = (v, s, topologyOverride, drOverride) => ({ ...v, failureScope: s.scope ?? 'unknown', rtoSec: s.rto, rpoSec: s.rpo, topologyOverride, drOverride });

const conflictsOf = (v) => E.conflictsFor(v, E.selectArchitecture(v, null));

function* grid() {
  for (const failureScope of ['unknown', 'host', 'az', 'site', 'region', 'provider', 'cyber'])
    for (const topologyOverride of ['auto', ...TOPOLOGIES.slice(1)])
      for (const drOverride of ['auto', 'backup', 'pilot', 'warm', 'active'])
        for (const rtoSec of [null, 0, 600, 20000])
          for (const rpoSec of [null, 0, 60])
            for (const target of ['unknown', 'cloud', 'onprem'])
              yield { ...BLANK, availability: 99.9, failureScope, topologyOverride, drOverride, rtoSec, rpoSec, target };
}

function sameAsV22(field, value3, value22) {
  const got = [...grid()].map((base) => conflictsOf({ ...base, [field]: value3 }));
  const fired = got.reduce((n, list) => n + list.length, 0);
  assert.equal(digest(got), V22_SAME[`${field}=${value22}`], `${field} ${value3}: the conflicts equal those the v2.2 validate raised for ${value22} (recorded before Task 3.4 removed it)`);
  assert.ok(fired > 1000, `${field} ${value3}: the grid raises conflicts (${fired})`);
}

function throughState(ops, decisions, field, value3, expected) {
  const state = apply(fresh(), ops);
  Object.assign(state.decisions, decisions);
  const { v } = E.toCalcInputs(state);
  assert.equal(v[field], value3, `${field} reaches the calculator inputs`);
  assert.deepEqual(ids(E.compute(state, { now: NOW }).shape.conflicts), expected.map((id) => `${id}@${v.failureScope}`));
  return v;
}

test('assessScopes_azAndRegion_localHaAndWarm', () => {
  const state = build(AZ_REGION);
  const { v } = E.toCalcInputs(state);
  const c = E.calculations(v);
  const scopes = E.assessScopes(state, v, c);
  assert.deepEqual(scopes.map(({ arch, ...rest }) => rest), [
    { entry: 'REL-05.1', scope: 'az', rto: 5, rpo: 0, rtoEntry: 'REL-03.1', rpoEntry: 'REL-04.1', strategy: 'localHA', topoCandidate: 'multiAZ', blockers: [] },
    { entry: 'REL-05.2', scope: 'region', rto: 600, rpo: 60, rtoEntry: 'REL-03.2', rpoEntry: 'REL-04.2', strategy: 'warm', topoCandidate: 'regional', blockers: [] },
  ]);
  for (const s of scopes) {
    const view = scopeView(v, s, 'auto', 'auto');
    assert.deepEqual(s.arch, E.selectArchitecture(view, c), s.entry);
    assert.equal(s.strategy, E.defaultDR(view), s.entry);
  }
  const model = E.compute(state, { now: NOW });
  assert.deepEqual(Object.keys(model), ['v', 'c', 'a', 'rules', 'graph', 'scopes', 'shape', 'options', 'validation', 'gate']);
  assert.deepEqual(model.scopes, scopes);
});

test('assessScopes_twoRegionRtos_usesSmallest', () => {
  const pick = (rto) => scopesOf(build({ scopes: ['region'], rto, rpo: [['region', 60]] })).map((s) => [s.rto, s.rtoEntry, s.rpo, s.rpoEntry, s.strategy]);
  assert.deepEqual(pick([['region', 600], ['region', 300]]), [[300, 'REL-03.2', 60, 'REL-04.1', 'warm']]);
  assert.deepEqual(pick([['region', 300], ['region', 600]]), [[300, 'REL-03.1', 60, 'REL-04.1', 'warm']]);
  assert.deepEqual(pick([['region', 300], ['region', 300]]), [[300, 'REL-03.1', 60, 'REL-04.1', 'warm']]);
  assert.deepEqual(pick([['region', 3700], ['region', 1000], ['region', 2000]]), [[1000, 'REL-03.2', 60, 'REL-04.1', 'warm']]);
  const rpo = scopesOf(build({ scopes: ['region'], rto: [['region', 600]], rpo: [['region', 0], ['region', 60]] }));
  assert.deepEqual([rpo[0].rpo, rpo[0].rpoEntry], [0, 'REL-04.1']);
});

test('assessScopes_unscopedEntry_appliesToEveryScope', () => {
  const state = build({ scopes: ['az', 'region'], rto: [[null, 600], ['az', 5], ['region', 900]], rpo: [[null, 60]] });
  assert.deepEqual(scopesOf(state).map((s) => [s.scope, s.rto, s.rtoEntry, s.rpo, s.rpoEntry, s.strategy]), [
    ['az', 5, 'REL-03.2', 60, 'REL-04.1', 'localHA'],
    ['region', 600, 'REL-03.1', 60, 'REL-04.1', 'warm'],
  ]);
  const other = build({ scopes: ['region'], rto: [['az', 5]], rpo: [['az', 0]] });
  assert.deepEqual(scopesOf(other).map((s) => [s.rto, s.rtoEntry, s.rpo, s.rpoEntry, s.strategy]), [[null, null, null, null, 'unresolved']]);
  const open = build({ scopes: [null, 'az'], rto: [['az', 5], [null, 600]], rpo: [['az', 0]] });
  assert.deepEqual(scopesOf(open).map((s) => [s.scope, s.rto, s.rtoEntry, s.rpo, s.rpoEntry, s.strategy]), [
    [null, 600, 'REL-03.2', null, null, 'unresolved'],
    ['az', 5, 'REL-03.1', 0, 'REL-04.1', 'localHA'],
  ]);
});

test('assessScopes_scopeWithoutRto_unresolved', () => {
  const [az, region] = scopesOf(build({ scopes: ['az', 'region'], rto: [['az', 5]], rpo: [['az', 0], ['region', 60]] }));
  assert.deepEqual([az.rto, az.strategy], [5, 'localHA']);
  assert.deepEqual([region.rto, region.rtoEntry, region.rpo, region.rpoEntry, region.strategy], [null, null, 60, 'REL-04.2', 'unresolved']);
  const left = scopesOf(forced(build({ scopes: ['region'], rto: [['region', null], ['region', 0]], rpo: [['region', 60]] }), 'REL-03.2', -5));
  assert.deepEqual([left[0].rto, left[0].rtoEntry, left[0].strategy], [null, null, 'unresolved']);
  const na = apply(build({ scopes: ['region'], rto: [['region', 600]], rpo: [['region', 60]] }), [{ op: 'na', entry: 'REL-03.1', reason: 'No recovery time is agreed yet' }]);
  assert.deepEqual(scopesOf(na).map((s) => [s.rto, s.strategy]), [[null, 'unresolved']]);
  const noRpo = scopesOf(build({ scopes: ['region'], rto: [['region', 600]] }));
  assert.deepEqual(noRpo.map((s) => [s.rto, s.rpo, s.rpoEntry, s.strategy]), [[600, null, null, 'unresolved']]);
});

test('assessScopes_duplicateScope_blocker', () => {
  const scopes = scopesOf(build({ scopes: ['region', 'az', 'region', 'region'], rto: [[null, 600]], rpo: [[null, 60]] }));
  assert.deepEqual(scopes.map((s) => [s.entry, s.scope, s.strategy]), [['REL-05.1', 'region', 'warm'], ['REL-05.2', 'az', 'localHA'], ['REL-05.3', 'region', 'warm'], ['REL-05.4', 'region', 'warm']]);
  assert.deepEqual(scopes.map((s) => s.blockers), [[], [], [{
    id: 'DUPLICATE-SCOPE@region',
    msg: 'Failure scope region has 3 REL-05 entries (REL-05.1, REL-05.3, REL-05.4); keep one entry per failure scope and remove the others or give each its own scope.',
    owner: 'B+Ops',
    entry: 'REL-05.3',
  }], []]);
  const { entry, blockers, ...first } = scopes[0];
  for (const s of [scopes[2], scopes[3]]) {
    const { entry: id, blockers: b, ...rest } = s;
    assert.deepEqual(rest, first, id);
  }
  const pair = scopesOf(build({ scopes: ['cyber', 'cyber'], rto: [[null, 600]], rpo: [[null, 60]] }));
  assert.deepEqual(pair.map((s) => ids(s.blockers)), [[], ['DUPLICATE-SCOPE@cyber']]);
  assert.equal(pair[1].blockers[0].msg, 'Failure scope cyber has 2 REL-05 entries (REL-05.1, REL-05.2); keep one entry per failure scope and remove the others or give each its own scope.');
  const open = scopesOf(build({ scopes: ['az', null, null], rto: [[null, 600]], rpo: [[null, 60]] }));
  assert.deepEqual(open.map((s) => [s.scope, s.blockers]), [['az', []]]);
  const shape = shapeOf(build({ scopes: ['region', 'region'], rto: [[null, 600]], rpo: [[null, 0]] }));
  assert.deepEqual({ ...shape, conflicts: ids(shape.conflicts) }, {
    topology: 'regional',
    topologySource: 'REL-05.1',
    strategies: { region: 'warm' },
    replication: { region: 'synchronous' },
    conflicts: ['CONFLICT-rpo0@region'],
  });
});

test('assessScopes_emptyExtraEntry_notAScope', () => {
  const region = build({ scopes: ['region'], rto: [[null, 600]], rpo: [[null, 60]] });
  assert.deepEqual(scopesOf(region).map((s) => s.entry), ['REL-05.1']);
  const open = apply(region, [{ op: 'add', row: 'REL-05' }]);
  const na = apply(open, [{ op: 'na', entry: 'REL-05.2', reason: 'No second scope' }]);
  for (const [name, state] of [['Open', open], ['N/A', na]]) {
    assert.equal(E.rowEntries(state, 'REL-05').length, 2, name);
    assert.deepEqual(scopesOf(state), scopesOf(region), name);
    assert.deepEqual(shapeOf(state), shapeOf(region), name);
  }
  const named = apply(open, [{ op: 'set', entry: 'REL-05.2', value: 'az' }]);
  assert.deepEqual(scopesOf(named).map((s) => [s.entry, s.scope]), [['REL-05.1', 'region'], ['REL-05.2', 'az']], 'an extra entry that names a scope is one');
  const primaryOpen = build({ scopes: [null, 'region'], rto: [[null, 600]], rpo: [[null, 60]] });
  assert.deepEqual(scopesOf(primaryOpen).map((s) => [s.entry, s.scope]), [['REL-05.1', null], ['REL-05.2', 'region']], 'REL-05.1 while Open stays the unknown scope');
});

test('assessScopes_primaryNa_noScopes', () => {
  const dr = ['DR-03', 'DR-06', 'DR-ZERO-01', 'DR-ZERO-02', 'DATA-07', 'DATA-08', 'SLO-15'];
  const open = build({ scopes: [null], rto: [[null, 0]], rpo: [[null, 0]] });
  assert.ok(E.compute(open, { now: NOW }).rules.some((r) => dr.includes(r.id)), 'an Open REL-05.1 runs the DR family on the unknown scope');
  const na = apply(open, [{ op: 'na', entry: 'REL-05.1', reason: 'No failure scope applies' }]);
  assert.deepEqual(scopesOf(na), []);
  assert.deepEqual(shapeOf(na), { topology: 'undetermined', topologySource: null, strategies: {}, replication: {}, conflicts: [] });
  const model = E.compute(na, { now: NOW });
  assert.deepEqual([model.scopes, model.shape.conflicts], [[], []]);
  assert.ok(!model.rules.some((r) => dr.includes(r.id.split('@')[0])), 'no DR family without a scope');
  assert.ok(!model.validation.blockers.some((b) => b.id.startsWith('DT-03')));
  assert.ok(!model.validation.advisories.some((x) => /^(DR-|DATA-commit)/.test(x.id)), 'no scope advisories');
  const second = apply(na, [{ op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }]);
  assert.deepEqual(scopesOf(second).map((s) => [s.entry, s.scope]), [['REL-05.2', 'region']]);
});

test('assessScopes_drOverride_replacesThatScopeOnly', () => {
  const state = build(AZ_REGION);
  const view = (overrides) => {
    state.decisions.dr_overrides = overrides;
    return scopesOf(state).map((s) => [s.scope, s.strategy, s.arch.dr, s.topoCandidate]);
  };
  assert.deepEqual(view({}), [['az', 'localHA', 'localHA', 'multiAZ'], ['region', 'warm', 'warm', 'regional']]);
  assert.deepEqual(view({ region: 'pilot', site: 'active' }), [['az', 'localHA', 'localHA', 'multiAZ'], ['region', 'pilot', 'pilot', 'regional']]);
  assert.deepEqual(view({ region: 'active' }), [['az', 'localHA', 'localHA', 'multiAZ'], ['region', 'active', 'active', 'active']]);
  assert.deepEqual(view({ az: 'backup' }), [['az', 'backup', 'backup', 'multiAZ'], ['region', 'warm', 'warm', 'regional']]);
  state.decisions.dr_overrides = { region: 'pilot' };
  assert.deepEqual(E.compute(state, { now: NOW }).shape.strategies, { az: 'localHA', region: 'pilot' });
});

test('assessScopes_boundaries_followThresholds', () => {
  assert.equal(THRESHOLDS.length, 19);
  for (const [input, want] of THRESHOLDS) {
    assert.equal(E.defaultDR(input), want, `defaultDR ${JSON.stringify(input)}`);
    const scope = input.failureScope === 'unknown' ? null : input.failureScope;
    for (const tag of scope ? [null, scope] : [null]) {
      const state = build({
        scopes: [scope],
        rto: input.rtoSec === null ? [] : [[tag, input.rtoSec]],
        rpo: [[tag, input.rpoSec]],
        extra: [{ op: 'set-factor', entry: 'ECO-01.1', factor: 'budgetPressure', value: input.budget }],
      });
      const scopes = scopesOf(state);
      assert.deepEqual(scopes.map((s) => [s.entry, s.scope, s.rto, s.rpo, s.strategy]), [['REL-05.1', scope, input.rtoSec, input.rpoSec, want]], `${JSON.stringify(input)} with entry scope ${tag}`);
    }
  }
});

test('targetShape_azAndRegion_topologyRegional', () => {
  const state = build(AZ_REGION);
  const scopes = scopesOf(state);
  const shape = E.targetShape(state, scopes);
  assert.deepEqual({ ...shape, conflicts: ids(shape.conflicts) }, {
    topology: 'regional',
    topologySource: 'REL-05.2',
    strategies: { az: 'localHA', region: 'warm' },
    replication: { az: 'synchronous', region: 'asynchronous' },
    conflicts: [],
  });
  const { v } = E.toCalcInputs(state);
  const azView = scopeView(v, scopes[0], 'regional', 'localHA');
  assert.deepEqual(E.conflictsFor(azView, E.selectArchitecture(azView, null)), []);
  assert.deepEqual(E.compute(state, { now: NOW }).shape, shape);
  const flipped = shapeOf(build({ scopes: ['region', 'az'], rto: [['region', 600], ['az', 5]], rpo: [['region', 60], ['az', 0]] }));
  assert.deepEqual([flipped.topology, flipped.topologySource, flipped.strategies], ['regional', 'REL-05.1', { region: 'warm', az: 'localHA' }]);
  const tie = shapeOf(build({ scopes: ['region', 'site'], rto: [[null, 600]], rpo: [[null, 60]] }));
  assert.deepEqual([tie.topology, tie.topologySource], ['regional', 'REL-05.1']);
});

test('targetShape_everyCandidatePair_strongestInOrder', () => {
  const state = fresh();
  const scope = (n, name, topoCandidate) => ({ entry: `REL-05.${n}`, scope: name, rto: null, rpo: null, rtoEntry: null, rpoEntry: null, strategy: 'unresolved', topoCandidate, arch: null, blockers: [] });
  let pairs = 0;
  for (const [i, weak] of TOPOLOGIES.entries()) {
    for (const strong of TOPOLOGIES.slice(i + 1)) {
      for (const list of [[scope(1, 'az', weak), scope(2, 'region', strong)], [scope(1, 'az', strong), scope(2, 'region', weak)]]) {
        const shape = E.targetShape(state, list);
        assert.deepEqual([shape.topology, shape.topologySource], [strong, list.find((s) => s.topoCandidate === strong).entry], `${weak} < ${strong}`);
        pairs++;
      }
    }
  }
  assert.equal(pairs, 30);
  assert.deepEqual(E.targetShape(state, []), { topology: 'undetermined', topologySource: null, strategies: {}, replication: {}, conflicts: [] });
  for (const override of TOPOLOGIES.slice(1)) {
    state.decisions.topology_override = override;
    const shape = E.targetShape(state, [scope(1, 'region', 'active')]);
    assert.deepEqual([shape.topology, shape.topologySource], [override, 'override'], override);
  }
  state.decisions.topology_override = 'undetermined';
  const ignored = E.targetShape(state, [scope(1, 'region', 'active')]);
  assert.deepEqual([ignored.topology, ignored.topologySource], ['active', 'REL-05.1']);
});

test('targetShape_blankState_undeterminedWithoutSource', () => {
  const blank = fresh();
  const shape = shapeOf(blank);
  assert.deepEqual(shape, { topology: 'undetermined', topologySource: null, strategies: { unknown: 'unresolved' }, replication: { unknown: 'TBD' }, conflicts: [] });
  assert.deepEqual(E.compute(blank, { now: NOW }).shape, shape);
  const twoOpen = shapeOf(build({ scopes: [null, null] }));
  assert.deepEqual([twoOpen.topology, twoOpen.topologySource], ['undetermined', null]);
  blank.decisions.topology_override = 'undetermined';
  assert.deepEqual(shapeOf(blank), shape);
  const available = shapeOf(apply(fresh(), [{ op: 'set', entry: 'REL-01.1', value: 99.9 }]));
  assert.deepEqual([available.topology, available.topologySource], ['multiAZ', 'REL-05.1']);
});

test('targetShape_overrideMultiAzWithRegion_conflictAtRegion', () => {
  const state = build(AZ_REGION);
  state.decisions.topology_override = 'multiAZ';
  const scopes = scopesOf(state);
  const shape = E.targetShape(state, scopes);
  assert.deepEqual({ ...shape, conflicts: ids(shape.conflicts) }, {
    topology: 'multiAZ',
    topologySource: 'override',
    strategies: { az: 'localHA', region: 'warm' },
    replication: { az: 'synchronous', region: 'asynchronous' },
    conflicts: ['CONFLICT-region@region'],
  });
  const { v } = E.toCalcInputs(state);
  assert.deepEqual(shape.conflicts, [{ ...REGION_CONFLICT, id: 'CONFLICT-region@region' }]);
  assert.deepEqual(conflictsOf(scopeView(v, scopes[1], 'multiAZ', 'warm')), [REGION_CONFLICT]);
  assert.deepEqual(scopes.map((s) => s.topoCandidate), ['multiAZ', 'regional']);
  assert.deepEqual(E.compute(state, { now: NOW }).shape, shape);
});

test('targetShape_rpoZeroRegion_synchronousAndConflict', () => {
  const state = build({ scopes: ['region', 'az'], rto: [['region', 600], ['az', 5]], rpo: [['region', 0]] });
  const shape = shapeOf(state);
  assert.deepEqual({ ...shape, conflicts: ids(shape.conflicts) }, {
    topology: 'regional',
    topologySource: 'REL-05.1',
    strategies: { region: 'warm', az: 'unresolved' },
    replication: { region: 'synchronous', az: 'TBD' },
    conflicts: ['CONFLICT-rpo0@region'],
  });
  const one = shapeOf(build({ scopes: ['region'], rto: [['region', 600]], rpo: [['region', 1]] }));
  assert.deepEqual([one.replication, one.conflicts], [{ region: 'asynchronous' }, []]);
});

test('targetShape_openFailureScope_keyedUnknownNoConflict', () => {
  const state = build({ scopes: [null], rto: [[null, 600]], rpo: [[null, 0]] });
  state.decisions.topology_override = 'regional';
  const scopes = scopesOf(state);
  assert.deepEqual(scopes.map((s) => [s.entry, s.scope, s.rto, s.rpo, s.strategy, s.topoCandidate]), [['REL-05.1', null, 600, 0, 'unresolved', 'undetermined']]);
  const shape = E.targetShape(state, scopes);
  assert.deepEqual(shape, {
    topology: 'regional',
    topologySource: 'override',
    strategies: { unknown: 'unresolved' },
    replication: { unknown: 'synchronous' },
    conflicts: [],
  });
  const { v } = E.toCalcInputs(state);
  assert.equal(v.failureScope, 'unknown');
  const twoOpen = apply(state, [{ op: 'add', row: 'REL-05' }]);
  assert.deepEqual(E.targetShape(twoOpen, scopesOf(twoOpen)), shape);
  const na = apply(state, [{ op: 'na', entry: 'REL-05.1', reason: 'The failure scope moves to a later phase' }]);
  assert.equal(E.primaryEntry(na, 'REL-05').status, 'N/A');
  assert.deepEqual(scopesOf(na), []);
  assert.deepEqual(E.targetShape(na, scopesOf(na)), { topology: 'regional', topologySource: 'override', strategies: {}, replication: {}, conflicts: [] });
});

test('conflictsFor_everyCombination_matchesV22ButRpo0RemoteOnly', () => {
  const got = [];
  const counts = {};
  const rpo0 = new Set();
  for (const v of grid()) {
    const list = conflictsOf(v);
    got.push(list);
    for (const x of list) counts[x.id] = (counts[x.id] || 0) + 1;
    if (list.some((x) => x.id === 'CONFLICT-rpo0')) rpo0.add(v.failureScope);
  }
  assert.equal(got.length, 7560);
  assert.deepEqual(counts, V22_GRID.counts);
  assert.equal(digest(got), V22_GRID.digest, 'the conflicts equal those the v2.2 validate raised, with CONFLICT-rpo0 kept for remote scopes only (recorded before Task 3.4 removed it)');
  assert.deepEqual(Object.keys(counts).sort(), [...CONFLICT_IDS].sort());
  assert.deepEqual([...rpo0].sort(), [...REMOTE].sort());
  const most = Math.max(...got.map((list) => list.length));
  assert.ok(most >= 3, `some case raises ${most} conflicts at once`);
});

test('targetShape_localScopeRpoZero_noRpo0Conflict', () => {
  const state = build({ scopes: ['region', 'az', 'host', 'site', 'provider', 'cyber'], rto: [[null, 600]], rpo: [[null, 0]] });
  const scopes = scopesOf(state);
  const shape = E.targetShape(state, scopes);
  assert.deepEqual([shape.topology, shape.replication], ['regional', { region: 'synchronous', az: 'synchronous', host: 'synchronous', site: 'synchronous', provider: 'synchronous', cyber: 'synchronous' }]);
  assert.deepEqual(ids(shape.conflicts), ['CONFLICT-rpo0@region', 'CONFLICT-rpo0@site', 'CONFLICT-rpo0@provider', 'CONFLICT-cyber-zero@cyber']);
  const { v } = E.toCalcInputs(state);
  for (const s of scopes) {
    const view = scopeView(v, s, 'regional', s.strategy);
    assert.equal(ids(E.conflictsFor(view, E.selectArchitecture(view, null))).includes('CONFLICT-rpo0'), REMOTE.includes(s.scope), s.scope);
  }
  for (const [scope, override] of [['az', 'active'], ['host', 'active'], ['az', 'regional']]) {
    const local = build({ scopes: ['region', scope], rto: [['region', 600], [scope, 5]], rpo: [['region', 60], [scope, 0]] });
    local.decisions.topology_override = override;
    assert.deepEqual(ids(shapeOf(local).conflicts).filter((id) => id.startsWith('CONFLICT-rpo0')), [], `${scope} under ${override}`);
  }
  const region = shapeOf(build({ scopes: ['az', 'region'], rto: [['az', 5], ['region', 600]], rpo: [['az', 0], ['region', 0]] }));
  assert.deepEqual(ids(region.conflicts), ['CONFLICT-rpo0@region']);
});

test('conflictsFor_hdr07Mixed_sameAsV22Unknown', () => {
  sameAsV22('changeType', 'mixed', 'unknown');
  throughState([{ op: 'set', entry: 'HDR-07.1', value: 'mixed' }, ...REGION_PLAIN], REGION_DECISIONS, 'changeType', 'mixed', ['CONFLICT-region', 'CONFLICT-active-dr']);
});

test('conflictsFor_hdr08Undecided_sameAsV22Unknown', () => {
  sameAsV22('target', 'undecided', 'unknown');
  const ops = [{ op: 'set', entry: 'HDR-08.1', value: 'undecided' }, { op: 'set', entry: 'REL-05.1', value: 'provider' }, { op: 'set', entry: 'REL-03.1', value: 600 }, { op: 'set', entry: 'REL-04.1', value: 0 }];
  const v = throughState(ops, { topology_override: 'regional' }, 'target', 'undecided', ['CONFLICT-rpo0']);
  assert.deepEqual(ids(conflictsOf({ ...v, target: 'cloud' })), ['CONFLICT-provider', 'CONFLICT-rpo0']);
});

test('conflictsFor_dat07SharedLogical_sameAsV22Shared', () => {
  sameAsV22('tenantModel', 'shared-logical', 'shared');
  throughState([{ op: 'set', entry: 'DAT-07.1', value: 'shared-logical' }, ...REGION_PLAIN], REGION_DECISIONS, 'tenantModel', 'shared-logical', ['CONFLICT-region', 'CONFLICT-active-dr']);
});

test('conflictsFor_dat07SchemaIsolated_sameAsV22Unknown', () => {
  sameAsV22('tenantModel', 'schema-isolated', 'unknown');
  throughState([{ op: 'set', entry: 'DAT-07.1', value: 'schema-isolated' }, ...REGION_PLAIN], REGION_DECISIONS, 'tenantModel', 'schema-isolated', ['CONFLICT-region', 'CONFLICT-active-dr']);
});

test('recoveryTier_examples', () => {
  const one = (scope, rto, rpo) => E.recoveryTier(scopesOf(build({ scopes: [scope], rto: rto === null ? [] : [[null, rto]], rpo: rpo === null ? [] : [[null, rpo]] })));
  assert.equal(one('region', 43200, 43200), 'Simple');
  assert.equal(one('az', 8, 3), 'Complex');
  assert.equal(one('region', 600, 600), null);
  assert.equal(one('region', 21601, 21601), 'Simple');
  assert.equal(one('region', 21600, 43200), null);
  assert.equal(one('region', 43200, 21600), null);
  assert.equal(one('az', 9, 9), 'Complex');
  assert.equal(one('az', 10, 3), null);
  assert.equal(one('az', 3, 10), null);
  assert.equal(one('region', null, 43200), null);
  assert.equal(one('az', 3, null), null);
  assert.equal(one(null, 0, 0), null);
  assert.equal(one(null, 43200, 43200), 'Simple');
  const two = (spec) => E.recoveryTier(scopesOf(build(spec)));
  assert.equal(two({ scopes: ['az', 'region'], rto: [['az', 8], ['region', 600]], rpo: [['az', 3], ['region', 60]] }), 'Complex');
  assert.equal(two({ scopes: ['site', 'region'], rto: [['site', 43200], ['region', 600]], rpo: [['site', 43200], ['region', 60]] }), null);
  assert.equal(two({ scopes: ['site', 'region'], rto: [['site', 43200], ['region', 86400]], rpo: [['site', 43200], ['region', 30000]] }), 'Simple');
  assert.equal(two({ scopes: ['site', 'region'], rto: [['site', 43200]], rpo: [['site', 43200], ['region', 30000]] }), null);
  assert.equal(E.recoveryTier([]), null);
});

test('closestExample_gfClComplex_returnsFile', () => {
  assert.equal(E.closestExample('GF_CL', 'Complex'), 'PreSDD_GF_CL_Complex.md');
  assert.equal(E.closestExample('GF-CL', 'Complex'), 'PreSDD_GF_CL_Complex.md');
  for (const path of ['GF_CL', 'GF_OP', 'BF_CL', 'BF_OP']) {
    for (const tier of ['Simple', 'Complex']) {
      const name = E.closestExample(path, tier);
      assert.equal(name, `PreSDD_${path}_${tier}.md`);
      assert.equal(E.closestExample(path.replace('_', '-'), tier), name, `${path} with a hyphen`);
      assert.ok(existsSync(join(examplesDir, name)), name);
    }
  }
  assert.equal(E.closestExample(E.classify({ changeType: 'greenfield', target: 'cloud' }), 'Complex'), 'PreSDD_GF_CL_Complex.md');
  assert.equal(E.closestExample(E.classify({ changeType: 'brownfield', target: 'onprem' }), 'Simple'), 'PreSDD_BF_OP_Simple.md');
  const combined = E.classify({ changeType: 'greenfield', target: 'hybrid' });
  assert.equal(combined, 'GF-OP + GF-CL');
  assert.equal(E.closestExample(combined, 'Complex'), null);
  for (const [path, tier] of [['GF_CL', null], ['GF-CL', null], ['GF_CL', 'simple'], ['GF_OP + GF_CL', 'Simple'], ['gf-cl', 'Simple'], ['GF--CL', 'Simple'], ['GF', 'Simple'], ['HYBRID', 'Complex'], ['Unclassified', 'Simple'], [E.classify({ changeType: 'unknown', target: 'cloud' }), 'Simple'], [null, 'Simple'], [undefined, undefined]]) {
    assert.equal(E.closestExample(path, tier), null, `${path} ${tier}`);
  }
});
