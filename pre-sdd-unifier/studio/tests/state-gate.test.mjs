import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, goldenCase, readText } from './helpers.mjs';
import { validateAllWithSchema } from './pyschema.mjs';

const E = loadEngine();
const schemaPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'schema', 'project-state.schema.json');
const NOW = '2026-10-23T11:01:02Z';
const LATER = '2026-10-24T08:30:00Z';
const OPTS = { now: NOW, name: 'Refunds platform', slug: 'refunds-platform' };
const person = { type: 'person', name: 'Mahmoud', label: '' };
const agent = { type: 'agent', name: 'E2E Architect', label: '' };
const policy = { type: 'policy', name: 'test-run policy', label: 'test-run policy' };
const fixture = { type: 'fixture', name: 'Dana Reyes', label: '' };
const ENGINE = { type: 'agent', name: 'pre-sdd-engine', label: 'pre-sdd-engine' };
const POLICY_LABEL = 'Policy: test-run policy (set by Mahmoud, 2026-10-23)';
const STAND_IN = 'Stand-in: Approver (test-run policy, set by Mahmoud, 2026-10-23)';
const FIXTURE_LABEL = 'Fixture: Dana Reyes (test-run policy)';
const RESPONSIBLE = 'Lead architect / responsible owner';
const SET_POLICY = { op: 'set-policy', policy: { label: 'test-run policy', stand_ins: ['Approver'] } };
const CRITERIA = 'nfr_fit, one_time_cost, recurring_tco, delivery_time, operability, security_compliance, reversibility or uncertainty';
const TOPOLOGIES = 'auto, single, multiAZ, multiAZActive, regional or active';
const STRATEGIES = 'backup, pilot, warm or active';
const SCOPES = 'host, az, site, region, provider or cyber';
const NO_OVERRIDE = 'Blank, auto or undetermined means no override';
const TAIL = 'G3 needs it Confirmed with who and when, N/A with a reason, or Open under a valid exception.';
const NO_STATUS = (id) => `${id} has no status; add status: 'open', or status: 'closed' with its resolution, closed_by and closed_at.`;

const fresh = () => E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW });
const ids = (list) => list.map((x) => x.id);
const unreadable = (...lines) => ['The project state cannot be read:', ...lines.map((line) => `- ${line}`)].join('\n');
const incomplete = (parts) => `The project state is incomplete: it needs ${parts}. Check it against schema/project-state.schema.json.`;
const primaryOn = (id) => `${id} is marked primary, but only the entry with n 1 is primary; set primary to false, or set n to 1 if it is the row's first entry.`;
const badNumber = (row, shown) => `${row} holds an entry whose n is ${shown}; each entry's n is a whole number from 1, so renumber it.`;
const notPrimary = (id) => `${id} has n 1 but is not marked primary; the entry with n 1 is the primary entry, so set primary to true.`;
const policyMark = (place, marks, what) => `${place} is marked by an answer policy (${marks}), but ${what} is a fact only a person gives or confirms; have a person set or confirm it.`;
const words = (list, word) => (list.length > 1 ? `${list.slice(0, -1).join(', ')} ${word} ${list.at(-1)}` : list.join(''));

function apply(state, ops, actor = person, now = NOW) {
  const result = E.applyPatch(state, ops, actor, { now });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

function edited(state, edit) {
  const copy = structuredClone(state);
  edit(copy);
  return copy;
}

function deepFreeze(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x);
    for (const value of Object.values(x)) deepFreeze(value);
  }
  return x;
}

function rejectedByGate(state, ...lines) {
  const want = { name: 'Error', message: unreadable(...lines) };
  const before = JSON.stringify(state);
  assert.throws(() => E.normalizeState(state, { now: NOW }), want);
  assert.throws(() => E.compute(state, { now: NOW }), want);
  assert.equal(JSON.stringify(state), before, 'the gate never changes its input');
}

function passesGate(state, label) {
  const { state: normal, advisories } = E.normalizeState(state, { now: NOW });
  assert.deepEqual([normal, advisories], [state, []], label);
}

function refused(state, op, actor, message) {
  const before = JSON.stringify(state);
  const result = E.applyPatch(state, [op], actor, { now: LATER });
  assert.deepEqual(result.errors.map((e) => [e.index, e.message]), [[0, message]]);
  assert.deepEqual(result.changes, []);
  assert.equal(JSON.stringify(result.state), before);
}

function schemaPaths(t, cases) {
  const result = validateAllWithSchema(schemaPath, Object.values(cases).map(([doc]) => doc));
  if (result.skipped) {
    t.skip(result.skipped);
    return;
  }
  const got = Object.fromEntries(Object.keys(cases).map((name, i) => [name, result.errors[i].map((e) => e.path)]));
  assert.deepEqual(got, Object.fromEntries(Object.entries(cases).map(([name, [, paths]]) => [name, paths])));
}

test('normalizeState_missingOptionsParts_throwsIncompleteMessage', () => {
  const base = apply(fresh(), [{ op: 'set-option', name: 'One region, multi-AZ' }, { op: 'set-option', name: 'Two regions, warm standby' }], agent);
  passesGate(base, 'two options as the ops write them');
  const cases = [
    ['options', (s) => { delete s.options; }],
    ['options', (s) => { s.options = []; }],
    ['options.list', (s) => { delete s.options.list; }],
    ['options.list', (s) => { s.options.list = { 'OPT-01': s.options.list[0] }; }],
    ['OPT-02.scores', (s) => { delete s.options.list[1].scores; }],
    ['OPT-01.scores', (s) => { s.options.list[0].scores = null; }],
    ['OPT-01.scores and OPT-02.scores', (s) => { for (const o of s.options.list) o.scores = []; }],
    ['OPT-01.shape', (s) => { delete s.options.list[0].shape; }],
    ['OPT-02.shape', (s) => { s.options.list[1].shape = []; }],
    ['options.list[1]', (s) => { s.options.list[1] = null; }],
    ['options.list[0].scores', (s) => { delete s.options.list[0].id; delete s.options.list[0].scores; }],
  ];
  for (const [parts, edit] of cases) rejectedByGate(edited(base, edit), incomplete(parts));
});

test('normalizeState_missingGateParts_throwsIncompleteMessage', () => {
  const base = apply(fresh(), [{ op: 'check', id: 'G3-01', status: 'Done' }, { op: 'sign', role: 'business_sponsor', decision: 'Approved' }, { op: 'add-condition', text: 'Load test before go-live', owner: 'SRE lead', due: '2026-12-01' }]);
  passesGate(base, 'a ticked line, a sign-off and a condition');
  const cases = [
    ['gate', (s) => { delete s.gate; }],
    ['gate', (s) => { s.gate = 'signed'; }],
    ['gate.checklist', (s) => { delete s.gate.checklist; }],
    ['gate.checklist', (s) => { s.gate.checklist = [s.gate.checklist['G3-01']]; }],
    ['gate.signoffs', (s) => { delete s.gate.signoffs; }],
    ['gate.signoffs', (s) => { s.gate.signoffs = { business_sponsor: s.gate.signoffs[0] }; }],
    ['gate.conditions', (s) => { delete s.gate.conditions; }],
    ['gate.exceptions', (s) => { s.gate.exceptions = null; }],
    ['gate.checklist, gate.signoffs, gate.conditions and gate.exceptions', (s) => { s.gate = { reopened: null }; }],
  ];
  for (const [parts, edit] of cases) rejectedByGate(edited(base, edit), incomplete(parts));
});

test('normalizeState_missingStateParts_throwsIncompleteMessage', () => {
  const base = fresh();
  const cases = [
    ['register.header, register.items, register.overlay.rows and history', (s) => { delete s.register.header; delete s.register.items; delete s.register.overlay.rows; delete s.history; }],
    ['run', (s) => { delete s.run; }],
    ['register', (s) => { delete s.register; }],
    ['register.items', (s) => { s.register.items = []; }],
    ['register.overlay', (s) => { delete s.register.overlay; }],
    ['register.overlay.workloads', (s) => { delete s.register.overlay.workloads; }],
    ['decisions', (s) => { delete s.decisions; }],
    ['decisions.dr_overrides', (s) => { s.decisions.dr_overrides = null; }],
    ['unknowns', (s) => { s.unknowns = {}; }],
    ['history', (s) => { delete s.history; }],
    ['project', (s) => { delete s.project; }],
    ['project.brds', (s) => { delete s.project.brds; }],
    ['ui', (s) => { delete s.ui; }],
    ['project.brds, run, register.header, register.overlay.workloads, register.overlay.rows, decisions, history and ui', (s) => {
      Object.assign(s, { run: [], decisions: [], history: {}, ui: ['logical'] });
      s.project.brds = 'REFUNDS';
      Object.assign(s.register, { header: 'HDR' });
      Object.assign(s.register.overlay, { workloads: { 'WL-01': '' }, rows: [] });
    }],
    ['project', (s) => { s.project = 'Refunds platform'; }],
    ['project, run, register, options, decisions, gate, unknowns, history and ui', (s) => { for (const key of ['project', 'run', 'register', 'options', 'decisions', 'gate', 'unknowns', 'history', 'ui']) delete s[key]; }],
  ];
  for (const [parts, edit] of cases) rejectedByGate(edited(base, edit), incomplete(parts));
  assert.throws(() => E.normalizeState({ version: 2, inputs: {} }, { now: NOW }), { message: 'This is not a Pre-SDD 3.0 project state (kind pre-sdd-project-state). Bring a Studio v2.2 project file or ZIP in through the import, and load a save file through its project_state.' });
  assert.throws(() => E.normalizeState({ kind: 'pre-sdd-project-state', schema_version: '4.0.0' }, { now: NOW }), { message: 'Project state schema "4.0.0" is not supported; this engine reads 3.x.' }, 'the kind and version checks throw first and alone');
});

test('normalizeState_primaryOnSecondEntry_throwsNamingEntry', () => {
  const open = apply(fresh(), [{ op: 'add', row: 'REL-05' }]);
  passesGate(open, 'an added entry is not primary');
  rejectedByGate(edited(open, (s) => { s.register.items['REL-05'][1].primary = true; }), primaryOn('REL-05.2'));
  const region = apply(open, [{ op: 'set', entry: 'REL-05.2', value: 'region' }]);
  rejectedByGate(edited(region, (s) => { s.register.items['REL-05'][1].primary = true; }), primaryOn('REL-05.2'));
  const waves = apply(edited(fresh(), (s) => { s.register.overlay.workloads.push({ id: 'WL-02', name: 'Billing' }); }), [{ op: 'add', row: 'OVL-04', workload: 'WL-02' }]);
  passesGate(waves, 'an entry for a second workload');
  rejectedByGate(edited(waves, (s) => { s.register.overlay.rows['OVL-04'][1].primary = true; }), primaryOn('OVL-04.2'));
  rejectedByGate(edited(fresh(), (s) => { s.register.header['HDR-08'][0].n = 2; }), primaryOn('HDR-08.2'));
  rejectedByGate(edited(fresh(), (s) => { s.register.header['HDR-08'][0].n = '1'; }), badNumber('HDR-08', '"1"'));
  const both = edited(region, (s) => {
    s.register.items['REL-05'][1].primary = true;
    s.register.items['REL-05'].reverse();
    s.register.items['REL-03'][0].n = 3;
  });
  rejectedByGate(both, primaryOn('REL-03.3'), primaryOn('REL-05.2'));
});

test('normalizeState_firstEntryNotPrimary_throwsNamingEntry', () => {
  rejectedByGate(edited(fresh(), (s) => { s.register.header['HDR-08'][0].primary = false; }), notPrimary('HDR-08.1'));
  rejectedByGate(edited(fresh(), (s) => { delete s.register.items['CAP-01'][0].primary; }), notPrimary('CAP-01.1'));
  rejectedByGate(edited(fresh(), (s) => { s.register.overlay.rows['OVL-04'][0].primary = 'yes'; }), notPrimary('OVL-04.1'));
  const swapped = edited(apply(fresh(), [{ op: 'add', row: 'BUS-02', label: 'Refund status page' }]), (s) => {
    s.register.items['BUS-02'][0].primary = false;
    s.register.items['BUS-02'][1].primary = true;
    s.register.items['BUS-02'].reverse();
  });
  rejectedByGate(swapped, notPrimary('BUS-02.1'), primaryOn('BUS-02.2'));
});

test('normalizeState_registerRowMissingOrEmpty_throwsNamingRow', () => {
  rejectedByGate(edited(fresh(), (s) => { delete s.register.items['CAP-01']; }), incomplete('register.items.CAP-01'));
  rejectedByGate(edited(fresh(), (s) => { delete s.register.header['HDR-02']; delete s.register.overlay.rows['OVL-12']; delete s.register.items['ECO-06']; }), incomplete('register.header.HDR-02, register.items.ECO-06 and register.overlay.rows.OVL-12'));
  rejectedByGate(edited(fresh(), (s) => { s.register.items['REL-05'] = []; }), "REL-05 holds no entries; every row holds its primary entry, so restore REL-05.1.");
  rejectedByGate(edited(fresh(), (s) => { s.register.header['HDR-02'][0] = null; }), 'HDR-02 holds an item that is not an entry (position 1); remove it, or restore the entry with its n and fields.');
  rejectedByGate(edited(apply(fresh(), [{ op: 'add', row: 'BUS-02' }, { op: 'add', row: 'BUS-02' }]), (s) => { s.register.items['BUS-02'].splice(1, 0, 'x'); s.register.items['BUS-02'].push(7); }), 'BUS-02 holds items that are not entries (positions 2 and 5); remove them, or restore the entries with their n and fields.');
  for (const row of [{ 'REL-05.1': null }, 'REL-05.1', null]) rejectedByGate(edited(fresh(), (s) => { s.register.items['REL-05'] = row; }), 'REL-05 is not a list of entries; make it a list that holds at least its primary entry, REL-05.1.');
  rejectedByGate(edited(fresh(), (s) => { Object.assign(s.register.items['CAP-01'][0], { n: 2, primary: false }); }), 'CAP-01 has no entry 1; every row holds its primary entry, CAP-01.1, so number its first entry 1.');
  const approved = apply(fresh(), [{ op: 'sign', role: 'business_sponsor', decision: 'Approved' }]);
  for (const row of ['CAP-01', 'REL-05']) rejectedByGate(edited(approved, (s) => { delete s.register.items[row]; }), incomplete(`register.items.${row}`));
});

test('normalizeState_duplicateEntryNumber_throwsNamingEntry', () => {
  const copied = edited(fresh(), (s) => { s.register.items['REL-05'].push(structuredClone(s.register.items['REL-05'][0])); });
  rejectedByGate(copied, 'REL-05 holds 2 entries numbered 1 (REL-05.1); give each entry its own n, or remove the copy.');
  rejectedByGate(edited(copied, (s) => { s.register.items['REL-05'].push(structuredClone(s.register.items['REL-05'][0])); }), 'REL-05 holds 3 entries numbered 1 (REL-05.1); give each entry its own n, or remove the copy.');
  const added = apply(fresh(), [{ op: 'add', row: 'REL-03' }, { op: 'add', row: 'REL-03' }]);
  passesGate(added, 'entries the add op numbers');
  rejectedByGate(edited(added, (s) => { s.register.items['REL-03'][2].n = 2; }), 'REL-03 holds 2 entries numbered 2 (REL-03.2); give each entry its own n, or remove the copy.');
  for (const [n, shown] of [[0, '0'], [1.5, '1.5'], ['2', '"2"'], [-1, '-1']]) rejectedByGate(edited(added, (s) => { s.register.items['REL-03'][1].n = n; }), badNumber('REL-03', shown));
  rejectedByGate(edited(added, (s) => { delete s.register.items['REL-03'][1].n; }), badNumber('REL-03', 'missing'));
  rejectedByGate(edited(fresh(), (s) => { const e = s.register.items['CAP-01'][0]; delete e.n; e.primary = false; }), badNumber('CAP-01', 'missing'));
});

test('normalizeState_noOverrideSpellings_normalizedWithAdvisory', (t) => {
  const base = apply(fresh(), [{ op: 'set', entry: 'REL-05.1', value: 'region' }]);
  passesGate(base, 'topology auto and no DR override');
  const topology = (shown) => `decisions.topology_override held ${shown}, which means no topology override, so it now reads auto.`;
  const dr = (key, shown) => `decisions.dr_overrides.${key} held ${shown}, which means no DR override for ${key}, so the key is removed.`;
  const normalized = [];
  const check = (state, label, decisions, target, from, to, msg) => {
    const { state: once, advisories } = E.normalizeState(deepFreeze(structuredClone(state)), { now: LATER });
    assert.deepEqual(once.decisions, decisions, label);
    assert.deepEqual(advisories, [{ id: `STATUS-${target}`, msg, owner: RESPONSIBLE }], label);
    assert.deepEqual(once.history.slice(state.history.length), [{ at: LATER, actor: ENGINE, op: 'normalize', target, from, to, reason: NO_OVERRIDE }], label);
    assert.deepEqual(E.normalizeState(once, { now: LATER }), { state: once, advisories: [] }, `${label}: normalizing twice equals normalizing once`);
    const { validation } = E.compute(state, { now: LATER });
    assert.deepEqual(validation.advisories.filter((a) => a.id.startsWith('STATUS-')), advisories, `${label}: compute shows the advisory once`);
    normalized.push(once);
  };
  const auto = { ...base.decisions, topology_override: 'auto' };
  for (const [raw, shown] of [['', 'no value'], ['   ', 'no value'], [null, 'no value'], ['undetermined', '"undetermined"']]) {
    check(edited(base, (s) => { s.decisions.topology_override = raw; }), `topology ${JSON.stringify(raw)}`, auto, 'decisions.topology_override', raw, 'auto', topology(shown));
  }
  check(edited(base, (s) => { delete s.decisions.topology_override; }), 'topology missing', auto, 'decisions.topology_override', null, 'auto', topology('no value'));
  const kept = { ...base.decisions, dr_overrides: { az: 'warm' }, override_reason: 'The owner wants it' };
  for (const [raw, shown] of [['', 'no value'], ['  ', 'no value'], [null, 'no value'], ['auto', '"auto"'], ['undetermined', '"undetermined"']]) {
    const state = edited(base, (s) => { Object.assign(s.decisions, { dr_overrides: { region: raw, az: 'warm' }, override_reason: 'The owner wants it' }); });
    check(state, `DR ${JSON.stringify(raw)}`, kept, 'decisions.dr_overrides.region', raw, null, dr('region', shown));
  }
  const errors = validateAllWithSchema(schemaPath, normalized);
  if (errors.skipped) {
    t.skip(errors.skipped);
    return;
  }
  assert.deepEqual(errors.errors, normalized.map(() => []), 'the normalize records fit the schema');
});

test('normalizeState_overrideOutsideEnum_throwsNamingAllowedValues', () => {
  const base = apply(fresh(), [{ op: 'set', entry: 'REL-05.1', value: 'region' }]);
  const topology = (shown) => `decisions.topology_override is ${shown}, which is not a topology override; give one of ${TOPOLOGIES} (auto means no override).`;
  for (const [raw, shown] of [['sideways', '"sideways"'], ['Regional', '"Regional"'], [' auto ', '" auto "'], [5, '5'], [false, 'false']]) {
    rejectedByGate(edited(base, (s) => { s.decisions.topology_override = raw; }), topology(shown));
  }
  const strategy = `decisions.dr_overrides.region is "localHA", which is not a DR strategy; give one of ${STRATEGIES}, or remove the key for no override.`;
  rejectedByGate(edited(base, (s) => { s.decisions.dr_overrides = { region: 'localHA' }; }), strategy);
  const scope = `decisions.dr_overrides has the key global, which is not a failure scope; key each DR override by one of ${SCOPES}.`;
  rejectedByGate(edited(base, (s) => { s.decisions.dr_overrides = { global: 'warm', az: 'auto', region: 'localHA' }; }), scope, strategy);
  rejectedByGate(edited(base, (s) => { s.decisions.dr_overrides = { global: 'localHA' }; }), scope);
  rejectedByGate(edited(base, (s) => { Object.assign(s.decisions, { topology_override: 'sideways', dr_overrides: { region: 'localHA' } }); }), topology('"sideways"'), strategy);
  const schema = JSON.parse(readText(schemaPath)).properties.decisions.properties;
  assert.deepEqual([schema.topology_override.enum, schema.dr_overrides.properties.region.enum], [E.OVERRIDE_VALUES.topology, E.OVERRIDE_VALUES.dr], 'the schema takes its enums from the engine');
  assert.deepEqual([words(schema.topology_override.enum, 'or'), words(schema.dr_overrides.properties.region.enum, 'or'), words(Object.keys(schema.dr_overrides.properties), 'or')], [TOPOLOGIES, STRATEGIES, SCOPES], 'the messages name the schema values');
});

test('normalizeState_weightKeyOutsideCriteria_throwsNamingCriteria', () => {
  const base = apply(fresh(), [{ op: 'set-weights', values: { nfr_fit: 3, reversibility: 2 } }]);
  passesGate(base, 'weights as set-weights writes them');
  rejectedByGate(edited(base, (s) => { s.options.weights.values.speed = 2; }), `options.weights.values holds speed, which is not a criterion; key each weight by one of the criteria ${CRITERIA}, or remove it.`);
  rejectedByGate(edited(base, (s) => { Object.assign(s.options.weights.values, { speed: 0, cost: 1 }); }), `options.weights.values holds speed and cost, which are not criteria; key each weight by one of the criteria ${CRITERIA}, or remove them.`);
  const schema = JSON.parse(readText(schemaPath)).$defs.weights.properties.values.properties;
  assert.equal(words(Object.keys(schema), 'or'), CRITERIA, 'the criteria named are the schema keys');
});

test('normalizeState_scoreWithUndefinedKey_throwsNamingKey', () => {
  let base = apply(fresh(), [{ op: 'set-option', name: 'One region, multi-AZ' }, { op: 'set-score', option: 'OPT-01', criterion: 'nfr_fit', value: 4, reason: 'Meets p99 at the stated peak' }], agent);
  base = apply(base, [{ op: 'set-cost', option: 'OPT-01', cost: 'one_time', value: 100000 }, { op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }]);
  passesGate(base, 'a cost and a confirmed score as the ops write them');
  rejectedByGate(edited(base, (s) => { s.options.list[0].scores.nfr_fit.source = { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' }; }), 'OPT-01.nfr_fit holds source, which a score does not take; a score holds value, reason, status, by and at, so remove it.');
  rejectedByGate(edited(base, (s) => { Object.assign(s.options.list[0].one_time, { source: { type: 'brd', text: 'BRD: REFUNDS 09' }, note: 'From the quote' }); }), 'OPT-01.one_time holds source and note, which a cost does not take; a cost holds value, status, by and at, so remove them.');
  rejectedByGate(edited(base, (s) => { s.options.list[0].scores.speed = { value: 3, reason: 'Quick', status: 'Estimated', by: 'E2E Architect', at: NOW }; }), `OPT-01.scores holds speed, which is not a criterion; key each score by one of the criteria ${CRITERIA}, or remove it.`);
  const { $defs } = JSON.parse(readText(schemaPath));
  assert.deepEqual([Object.keys($defs.costFields.properties), Object.keys($defs.scoreFields.properties)], [['value', 'status', 'by', 'at'], ['value', 'reason', 'status', 'by', 'at']], 'the keys the messages name are the schema keys');
});

test('normalizeState_unknownWithoutStatus_throws', () => {
  const question = { id: 'QD-01', entry: null, question: 'Who owns the refund ledger?', impact: null, owner: null, due: null };
  const withUnknowns = (...list) => edited(fresh(), (s) => { s.unknowns.push(...list); });
  rejectedByGate(withUnknowns(question), NO_STATUS('QD-01'));
  rejectedByGate(withUnknowns({ ...question, status: null }), NO_STATUS('QD-01'));
  rejectedByGate(withUnknowns({ ...question, status: 'pending' }), 'QD-01 has status "pending"; the status of an unknown is open or closed.');
  rejectedByGate(withUnknowns({ ...question, status: false }), 'QD-01 has status false; the status of an unknown is open or closed.');
  const closing = "a closed unknown records its resolution, who closed it (closed_by) and when (closed_at, a UTC timestamp), so add them, or set status: 'open'.";
  rejectedByGate(withUnknowns({ ...question, status: 'closed' }), `QD-01 is closed without a resolution, closed_by and closed_at; ${closing}`);
  rejectedByGate(withUnknowns({ ...question, status: 'closed', resolution: '  ', closed_by: 'Mahmoud', closed_at: '2026-10-23T13:01:02+02:00' }), `QD-01 is closed without a resolution and closed_at; ${closing}`);
  rejectedByGate(withUnknowns({ ...question, status: 'open', resolution: 'The finance team', closed_by: null }), "QD-01 is open but holds resolution; an open unknown holds no resolution, closed_by or closed_at, so remove it, or set status: 'closed'.");
  rejectedByGate(withUnknowns({ ...question, status: 'open' }, null, { ...question, id: ' QD-03 ' }), 'unknowns[1] is not an unknown; an unknown is an object with id, entry, question, impact, owner, due and status.', NO_STATUS('QD-03'));
  passesGate(withUnknowns({ ...question, status: 'open' }, { ...question, id: 'QD-02', status: 'open', resolution: null, closed_by: null, closed_at: null }, { ...question, id: 'QD-03', status: 'closed', resolution: 'The finance team', closed_by: 'Mahmoud', closed_at: NOW }), 'open and closed unknowns that keep the rule');
});

test('normalizeState_signoffFieldsDisagree_throwsNamingRole', () => {
  const base = apply(fresh(), [{ op: 'sign', role: 'business_sponsor', decision: 'Approved' }, { op: 'sign', role: 'network_owner', applicable: false, reason: 'No network change' }]);
  passesGate(base, 'a sign-off and a not-applicable mark as the sign op writes them');
  const signoff = (s, role) => s.gate.signoffs.find((x) => x.role === role);
  rejectedByGate(edited(base, (s) => { signoff(s, 'network_owner').decision = 'Rejected'; }), 'Sign-off network_owner is marked not applicable (applicable: false) but gives the decision "Rejected"; set decision to null, or set applicable to true to keep the decision.');
  rejectedByGate(edited(base, (s) => { signoff(s, 'network_owner').na_reason = '  '; }), 'Sign-off network_owner is marked not applicable (applicable: false) but gives no reason; give the reason in na_reason, or set applicable to true with a decision.');
  rejectedByGate(edited(base, (s) => { Object.assign(signoff(s, 'network_owner'), { na_reason: null, decision: 'Approved' }); }), 'Sign-off network_owner is marked not applicable (applicable: false) but gives no reason and the decision "Approved"; give the reason in na_reason and set decision to null, or set applicable to true to keep the decision.');
  const applicable = (given) => `Sign-off business_sponsor is marked applicable (applicable: true) but gives ${given}; give Approved, Approved with conditions or Rejected, or mark the role not applicable (applicable: false, with the reason in na_reason and decision null).`;
  rejectedByGate(edited(base, (s) => { signoff(s, 'business_sponsor').decision = null; }), applicable('no decision'));
  rejectedByGate(edited(base, (s) => { delete signoff(s, 'business_sponsor').decision; }), applicable('no decision'));
  rejectedByGate(edited(base, (s) => { signoff(s, 'business_sponsor').decision = 'Fine'; }), applicable('the decision "Fine"'));
  rejectedByGate(edited(base, (s) => {
    signoff(s, 'business_sponsor').decision = 'Fine';
    signoff(s, 'network_owner').decision = 'Rejected';
    s.gate.signoffs.reverse();
  }), 'Sign-off network_owner is marked not applicable (applicable: false) but gives the decision "Rejected"; set decision to null, or set applicable to true to keep the decision.', applicable('the decision "Fine"'));
  rejectedByGate(edited(base, (s) => {
    signoff(s, 'business_sponsor').decision = 'Fine';
    Object.assign(signoff(s, 'network_owner'), { na_reason: '' });
    delete s.gate.signoffs[1].role;
  }), applicable('the decision "Fine"'), 'Sign-off (no role) is marked not applicable (applicable: false) but gives no reason; give the reason in na_reason, or set applicable to true with a decision.');
  const flag = (given) => `Sign-off business_sponsor ${given}; set applicable to true for a sign-off with a decision, or to false for a role marked not applicable with a reason.`;
  rejectedByGate(edited(base, (s) => { Object.assign(signoff(s, 'business_sponsor'), { applicable: 'yes', decision: null }); }), flag('has applicable "yes"'));
  rejectedByGate(edited(base, (s) => { signoff(s, 'business_sponsor').applicable = 'true'; }), flag('has applicable "true"'));
  rejectedByGate(edited(base, (s) => { signoff(s, 'business_sponsor').applicable = null; }), flag('has applicable null'));
  rejectedByGate(edited(base, (s) => { delete signoff(s, 'business_sponsor').applicable; }), flag('has no applicable'));
  const stood = apply(apply(apply(base, [SET_POLICY]), [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }], policy), [{ op: 'sign', role: 'finance_procurement', applicable: false, reason: 'No purchase' }], fixture);
  assert.deepEqual(stood.gate.signoffs.slice(2).map((x) => [x.role, x.name, x.stand_in]), [['data_owner', STAND_IN, true], ['finance_procurement', FIXTURE_LABEL, false]]);
  passesGate(stood, "a stand-in's sign-off and a fixture owner's not-applicable mark");
});

test('normalizeState_policyLabelOnFact_throwsNamingPlace', () => {
  const base = apply(fresh(), [
    SET_POLICY,
    { op: 'set', entry: 'CAP-01.1', value: 864000 },
    { op: 'set-factor', entry: 'DAT-02.1', factor: 'storedKB', value: 2 },
    { op: 'set-factor', entry: 'DAT-02.1', factor: 'copies', value: 2 },
    { op: 'set', entry: 'REL-01.1', value: 99.9 },
  ]);
  const option = apply(apply(base, [{ op: 'set-option', name: 'One region, multi-AZ' }], agent), [{ op: 'set-cost', option: 'OPT-01', cost: 'monthly', value: 5000 }]);
  const allowed = apply(option, [{ op: 'confirm', entry: 'REL-01.1' }, { op: 'confirm', entry: 'DAT-02.1', factor: 'copies' }, { op: 'set-factor', entry: 'CAP-04.1', factor: 'utilization', value: 0.65 }], policy);
  assert.deepEqual([E.primaryEntry(allowed, 'REL-01').confirmed_by, E.primaryEntry(allowed, 'DAT-02').factors.copies.confirmed_by, E.primaryEntry(allowed, 'CAP-04').factors.utilization.source.type], [POLICY_LABEL, POLICY_LABEL, 'policy']);
  passesGate(allowed, 'a policy on a row that is not a fact, and on appendix factors of fact rows');
  passesGate(apply(option, [{ op: 'confirm', entry: 'CAP-01.1' }, { op: 'confirm', option: 'OPT-01', cost: 'monthly' }], fixture), "a fixture's confirmation of a fact");
  const cap = 'CAP-01.1';
  const confirmedBy = (label) => (s) => Object.assign(E.primaryEntry(s, 'CAP-01'), { status: 'Confirmed', confirmed_by: label, confirmed_at: NOW });
  rejectedByGate(edited(option, (s) => { E.primaryEntry(s, 'CAP-01').source = { type: 'policy', text: POLICY_LABEL }; }), policyMark(cap, 'source.type policy', 'CAP-01'));
  rejectedByGate(edited(option, confirmedBy(POLICY_LABEL)), policyMark(cap, `confirmed_by "${POLICY_LABEL}"`, 'CAP-01'));
  rejectedByGate(edited(option, confirmedBy(STAND_IN)), policyMark(cap, `confirmed_by "${STAND_IN}"`, 'CAP-01'));
  rejectedByGate(edited(option, (s) => { confirmedBy(POLICY_LABEL)(s); E.primaryEntry(s, 'CAP-01').source = { type: 'policy', text: POLICY_LABEL }; }), policyMark(cap, `source.type policy; confirmed_by "${POLICY_LABEL}"`, 'CAP-01'));
  rejectedByGate(edited(option, (s) => { Object.assign(E.primaryEntry(s, 'CAP-01'), { status: 'Confirmed', confirmed_by: POLICY_LABEL, confirmed_at: null }); }), policyMark(cap, `confirmed_by "${POLICY_LABEL}"`, 'CAP-01'));
  rejectedByGate(edited(option, (s) => { Object.assign(E.primaryEntry(s, 'DAT-02').factors.storedKB, { status: 'Confirmed', confirmed_by: POLICY_LABEL, confirmed_at: NOW }); }), policyMark('DAT-02.1.storedKB', `confirmed_by "${POLICY_LABEL}"`, 'storedKB on DAT-02'));
  rejectedByGate(edited(option, (s) => { E.primaryEntry(s, 'ECO-01').factors.budgetPressure = { value: 'tight', status: 'Estimated', source: { type: 'policy', text: POLICY_LABEL }, confirmed_by: null, confirmed_at: null }; }), policyMark('ECO-01.1.budgetPressure', 'source.type policy', 'budgetPressure on ECO-01'));
  rejectedByGate(edited(option, (s) => { Object.assign(s.options.list[0].monthly, { status: 'Confirmed', by: POLICY_LABEL, at: NOW }); }), policyMark('OPT-01.monthly', `by "${POLICY_LABEL}"`, 'an option cost'));
  rejectedByGate(edited(option, (s) => { s.options.list[0].monthly.by = POLICY_LABEL; }), policyMark('OPT-01.monthly', `by "${POLICY_LABEL}"`, 'an option cost'));
});

test('normalizeState_severalProblems_oneErrorListsEach', () => {
  let state = apply(fresh(), [SET_POLICY, { op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }, { op: 'set-weights', values: { nfr_fit: 3 } }, { op: 'sign', role: 'network_owner', applicable: false, reason: 'No network change' }]);
  state = apply(apply(state, [{ op: 'set-option', name: 'One region, multi-AZ' }], agent), [{ op: 'set-cost', option: 'OPT-01', cost: 'one_time', value: 100000 }]);
  passesGate(state, 'the state before the hand edits');
  const broken = edited(state, (s) => {
    delete s.run;
    delete s.gate.conditions;
    s.unknowns.push({ id: 'QD-01', entry: null, question: 'Who owns the refund ledger?', impact: null, owner: null, due: null });
    s.gate.signoffs[0].decision = 'Rejected';
    s.decisions.dr_overrides = { region: 'localHA' };
    s.decisions.topology_override = 'sideways';
    s.options.weights.values.speed = 1;
    s.options.list[0].one_time.source = { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' };
    s.register.items['REL-05'][1].primary = true;
    Object.assign(s.register.items['CAP-01'][0], { status: 'Confirmed', confirmed_by: POLICY_LABEL, confirmed_at: NOW });
    s.register.header['HDR-08'][0].primary = false;
  });
  const want = [
    'The project state cannot be read:',
    '- The project state is incomplete: it needs run and gate.conditions. Check it against schema/project-state.schema.json.',
    '- HDR-08.1 has n 1 but is not marked primary; the entry with n 1 is the primary entry, so set primary to true.',
    `- CAP-01.1 is marked by an answer policy (confirmed_by "${POLICY_LABEL}"), but CAP-01 is a fact only a person gives or confirms; have a person set or confirm it.`,
    "- REL-05.2 is marked primary, but only the entry with n 1 is primary; set primary to false, or set n to 1 if it is the row's first entry.",
    '- OPT-01.one_time holds source, which a cost does not take; a cost holds value, status, by and at, so remove it.',
    `- options.weights.values holds speed, which is not a criterion; key each weight by one of the criteria ${CRITERIA}, or remove it.`,
    `- decisions.topology_override is "sideways", which is not a topology override; give one of ${TOPOLOGIES} (auto means no override).`,
    `- decisions.dr_overrides.region is "localHA", which is not a DR strategy; give one of ${STRATEGIES}, or remove the key for no override.`,
    '- Sign-off network_owner is marked not applicable (applicable: false) but gives the decision "Rejected"; set decision to null, or set applicable to true to keep the decision.',
    `- ${NO_STATUS('QD-01')}`,
  ].join('\n');
  assert.throws(() => E.normalizeState(broken, { now: NOW }), { name: 'Error', message: want });
  assert.throws(() => E.compute(broken, { now: NOW }), { name: 'Error', message: want });
});

test('compute_demotedEntry_statusAdvisoryOnce', () => {
  const state = apply(fresh(), [{ op: 'set', entry: 'REL-01.1', value: 99.9 }, { op: 'confirm', entry: 'REL-01.1' }]);
  const raw = edited(state, (s) => { E.primaryEntry(s, 'REL-01').confirmed_by = null; });
  const model = E.compute(raw, { now: NOW });
  const status = model.validation.advisories.filter((a) => a.id.startsWith('STATUS-'));
  assert.deepEqual(ids(status), ['STATUS-REL-01.1'], 'exactly one STATUS advisory for the entry');
  assert.deepEqual(status, E.normalizeState(raw, { now: NOW }).advisories);
  const { validation, gate, ...rest } = model;
  assert.deepEqual(E.validateState(raw, rest, { now: NOW }), validation, 'validateState on its own still normalizes');
  assert.deepEqual(E.compute(E.normalizeState(raw, { now: NOW }).state, { now: NOW }).validation.advisories.filter((a) => a.id.startsWith('STATUS-')), [], 'a normalized state gives none');
});

test('compute_confirmedScoreWithoutByAt_estimatedScoresFlag', () => {
  let state = apply(fresh(), [{ op: 'set-weights', values: { nfr_fit: 2 } }]);
  state = apply(state, [{ op: 'set-option', name: 'One region, multi-AZ' }, { op: 'set-score', option: 'OPT-01', criterion: 'nfr_fit', value: 4, reason: 'Meets p99 at the stated peak' }], agent);
  state = apply(state, [{ op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }]);
  assert.deepEqual([E.compute(state, { now: NOW }).options.flags, E.compute(state, { now: NOW }).options.list[0].weighted], [[], 4]);
  for (const patch of [{ by: null }, { at: null }, { by: '  ', at: 'yesterday' }]) {
    const raw = edited(state, (s) => { Object.assign(s.options.list[0].scores.nfr_fit, patch); });
    const model = E.compute(raw, { now: NOW });
    assert.deepEqual([model.options.flags, model.options.list[0].weighted], [['ESTIMATED-SCORES'], 4], JSON.stringify(patch));
    assert.deepEqual(ids(model.validation.advisories.filter((a) => a.id.startsWith('STATUS-'))), ['STATUS-OPT-01.nfr_fit'], JSON.stringify(patch));
    const { options, validation, gate, ...rest } = model;
    assert.deepEqual(E.computeOptions(E.normalizeState(raw, { now: NOW }).state, rest), options, 'the options read the normalized state');
  }
});

test('compute_confirmedEntryWithoutWho_everyReaderSeesEstimated', () => {
  let state = apply(fresh(), [
    { op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'CAP-04.1', value: 5 },
    { op: 'set-factor', entry: 'CAP-02.1', factor: 'callsPerTxn', value: 3 }, { op: 'set-factor', entry: 'CAP-02.1', factor: 'requestFactor', value: 1.1 },
  ]);
  state = E.derive(state, { now: NOW }).state;
  state = apply(state, [{ op: 'confirm', entry: 'CAP-01.1' }, { op: 'confirm', entry: 'CAP-02.1' }, { op: 'set', entry: 'CAP-04.1', value: 6 }]);
  const confirmed = E.compute(state, { now: NOW });
  const calc03 = confirmed.c.rows.find((r) => r.id === 'CALC-03').result;
  assert.ok(E.primaryEntry(state, 'CAP-02').value === 165 && Math.abs(calc03 - 198) < 1e-9, 'CALC-03 moved from 165 to 198');
  assert.ok(ids(confirmed.validation.advisories).includes('RECOMPUTE-CAP-02.1'), 'with who and when, CAP-02.1 reads Confirmed against its calculation row');
  const raw = apply(edited(state, (s) => {
    for (const row of ['CAP-01', 'CAP-02']) Object.assign(E.primaryEntry(s, row), { confirmed_by: null, confirmed_at: null });
  }), [{ op: 'sign', role: 'business_sponsor', decision: 'Approved' }]);
  const normal = E.normalizeState(raw, { now: NOW }).state;
  assert.deepEqual([E.primaryEntry(normal, 'CAP-01').status, E.primaryEntry(normal, 'CAP-02').status], ['Estimated', 'Estimated']);
  const model = E.compute(raw, { now: NOW });
  assert.equal(model.c.rows.find((r) => r.id === 'CALC-03').result, calc03, 'the calculations read the values');
  const advisories = ids(model.validation.advisories);
  assert.deepEqual(advisories.filter((id) => /^(STATUS|RECOMPUTE)-/.test(id)), ['STATUS-CAP-01.1', 'STATUS-CAP-02.1'], 'the calculation row reads CAP-02.1 as Estimated, so it asks for no recompute review');
  const { gate, ...rest } = model;
  assert.deepEqual(gate, E.gateStatus(normal, rest, { now: NOW }), 'the gate reads the normalized state');
  assert.notDeepEqual(gate, E.gateStatus(raw, rest, { now: NOW }));
  assert.deepEqual(gate.g1, E.gateStatus(normal, rest, { now: NOW }).g1);
  assert.ok(!gate.g1.missing.some((x) => /CAP-0[12]\.1/.test(x)), 'G1 reads CAP-01.1 and CAP-02.1 as Estimated, so neither is an Open entry it lists');
  assert.ok(gate.g3.problems.includes(`Critical entry CAP-01.1 is Estimated; ${TAIL}`), 'the critical-entry check reads Estimated');
  assert.ok(!gate.g3.problems.some((x) => x.includes('Confirmed without who and when')));
  assert.ok(gate.g3.problems.includes('Sign-off records given on other content (the content hash has changed since): business_sponsor; sign again after the review.'), 'a sign-off given on the raw state reads Review, since normalizing changed the content it hashed');
  assert.equal(raw.gate.signoffs[0].content_hash, E.contentHash(raw));
});

test('compute_rejectedState_throwsGateError', () => {
  const bad = edited(fresh(), (s) => { delete s.options; s.decisions.topology_override = 'sideways'; });
  const want = { name: 'Error', message: unreadable(incomplete('options'), `decisions.topology_override is "sideways", which is not a topology override; give one of ${TOPOLOGIES} (auto means no override).`) };
  assert.throws(() => E.normalizeState(bad, { now: NOW }), want);
  assert.throws(() => E.compute(bad, { now: NOW }), want);
  const { validation, gate, ...model } = E.compute(fresh(), { now: NOW });
  assert.throws(() => E.validateState(bad, model, { now: NOW }), want);
  assert.throws(() => E.derive(bad, { now: NOW }), want);
  assert.throws(() => E.compute({ ...bad, kind: 'pre-sdd-save' }, { now: NOW }), { message: /^This is not a Pre-SDD 3\.0 project state/ });
  assert.throws(() => E.compute({ ...bad, schema_version: '2.2' }, { now: NOW }), { message: 'Project state schema "2.2" is not supported; this engine reads 3.x.' });
  assert.throws(() => E.compute(bad, { now: '2026-10-23T11:01:02' }), { message: /^now must be a Date, or an ISO 8601 timestamp with Z or an offset/ });
});

test('applyPatch_addUnknown_agentAllowedNextQdId', () => {
  const op = { op: 'add-unknown', entry: 'REL-05.1', question: '  Which failure scope does the warm standby cover?  ', impact: ' DR strategy for the region scope ', owner: 'Lead architect', due: '2026-11-01' };
  const first = E.applyPatch(fresh(), [op], agent, { now: NOW });
  assert.deepEqual(first.errors, []);
  const asked = { id: 'QD-01', entry: 'REL-05.1', question: 'Which failure scope does the warm standby cover?', impact: 'DR strategy for the region scope', owner: 'Lead architect', due: '2026-11-01', status: 'open' };
  assert.deepEqual(first.state.unknowns, [asked]);
  assert.deepEqual(first.changes, [{ at: NOW, actor: { type: 'agent', name: 'E2E Architect', label: 'E2E Architect' }, op: 'add-unknown', target: 'QD-01', from: null, to: asked, reason: null }]);
  assert.deepEqual(first.state.history, first.changes);
  passesGate(first.state, 'an unknown the op adds');
  const bare = { op: 'add-unknown', question: 'Who owns the refund ledger?' };
  const second = apply(apply(first.state, [SET_POLICY]), [bare], policy);
  assert.deepEqual(second.unknowns[1], { id: 'QD-02', entry: null, question: 'Who owns the refund ledger?', impact: null, owner: null, due: null, status: 'open' });
  for (const actor of [person, fixture]) assert.equal(apply(second, [{ ...bare, impact: '', owner: '  ', due: '', entry: '' }], actor).unknowns[2].id, 'QD-03', actor.type);
  const numbered = edited(second, (s) => {
    s.unknowns[0] = { ...s.unknowns[0], id: 'QD-07', status: 'closed', resolution: 'Region', closed_by: 'Mahmoud', closed_at: NOW };
    s.unknowns[1].id = 'QD-03';
  });
  assert.equal(apply(numbered, [bare], agent).unknowns[2].id, 'QD-08', 'one above the highest number, a closed unknown included');
  assert.equal(apply(edited(second, (s) => { s.unknowns[1].id = 'QD-123'; }), [bare], agent).unknowns[2].id, 'QD-124');
  const wrong = [
    [{ ...bare, question: '   ' }, 'An unknown needs its question.'],
    [{ op: 'add-unknown', owner: 'Lead architect' }, 'An unknown needs its question.'],
    [{ ...bare, question: 7 }, 'An unknown needs its question.'],
    [{ ...bare, entry: 'REL-05.9' }, 'REL-05 has no entry 9.'],
    [{ ...bare, entry: 'ledger' }, '"ledger" is not an entry ID; entry IDs read like REL-03.2 (row, dot, entry number).'],
    [{ ...bare, due: '2026-02-30' }, 'due is a date, YYYY-MM-DD; got "2026-02-30".'],
    [{ ...bare, due: '31/12/2026' }, 'due is a date, YYYY-MM-DD; got "31/12/2026".'],
    [{ ...bare, impact: 7 }, 'impact takes text; got 7.'],
    [{ ...bare, owner: { name: 'Lena' } }, 'owner takes text; got {"name":"Lena"}.'],
    [{ ...bare, status: 'closed' }, 'add-unknown does not take status; it takes entry, question, impact, owner, due.'],
  ];
  for (const [bad, message] of wrong) refused(second, bad, agent, message);
});

test('applyPatch_closeUnknown_agentRefused', () => {
  const asked = apply(fresh(), [{ op: 'add-unknown', question: 'Which failure scope does the warm standby cover?', owner: 'Lead architect' }, { op: 'add-unknown', question: 'Who owns the refund ledger?' }], agent);
  refused(asked, { op: 'close-unknown', id: 'QD-01', resolution: 'Region: the standby covers eu-west-1' }, agent, 'An agent never closes an unknown; ask the person who owns QD-01 (Lead architect) to answer it.');
  refused(asked, { op: 'close-unknown', id: 'QD-02', resolution: 'The finance team' }, agent, 'An agent never closes an unknown; ask the person who owns QD-02 to answer it.');
  refused(asked, { op: 'close-unknown', id: 'QD-09', resolution: 'Region' }, agent, 'No unknown has the ID "QD-09"; unknown IDs read like QD-01.');
});

test('applyPatch_closeUnknown_personRecordsResolution', () => {
  const asked = apply(apply(fresh(), [SET_POLICY]), [{ op: 'add-unknown', entry: 'REL-05.1', question: 'Which failure scope does the warm standby cover?', owner: 'Lead architect', due: '2026-11-01' }], agent);
  const open = asked.unknowns[0];
  const result = E.applyPatch(asked, [{ op: 'close-unknown', id: 'QD-01', resolution: '  Region: the standby covers the loss of eu-west-1  ' }], person, { now: LATER });
  assert.deepEqual(result.errors, []);
  const closed = { ...open, status: 'closed', resolution: 'Region: the standby covers the loss of eu-west-1', closed_by: 'Mahmoud', closed_at: LATER };
  assert.deepEqual(result.state.unknowns, [closed]);
  assert.deepEqual(result.changes, [{ at: LATER, actor: { type: 'person', name: 'Mahmoud', label: 'Mahmoud' }, op: 'close-unknown', target: 'QD-01', from: open, to: closed, reason: null }]);
  passesGate(result.state, 'an unknown the op closes');
  assert.equal(apply(result.state, [{ op: 'add-unknown', question: 'Who owns the refund ledger?' }], agent).unknowns[1].id, 'QD-02');
  const byFixture = apply(asked, [{ op: 'close-unknown', id: 'QD-01', resolution: 'Region' }], fixture).unknowns[0];
  assert.deepEqual([byFixture.status, byFixture.resolution, byFixture.closed_by, byFixture.closed_at], ['closed', 'Region', FIXTURE_LABEL, NOW]);
  refused(asked, { op: 'close-unknown', id: 'QD-01', resolution: 'Region' }, policy, 'An answer policy never closes an unknown; ask the person who owns QD-01 (Lead architect) to answer it.');
  for (const resolution of ['', '   ', null, 7]) refused(asked, { op: 'close-unknown', id: 'QD-01', resolution }, person, 'Closing QD-01 needs its resolution: say how the question was answered.');
  refused(asked, { op: 'close-unknown', id: 'QD-01' }, person, 'Closing QD-01 needs its resolution: say how the question was answered.');
  refused(asked, { op: 'close-unknown', id: ' QD-01', resolution: 'Region' }, person, 'No unknown has the ID " QD-01"; unknown IDs read like QD-01.');
});

test('applyPatch_closeUnknownTwice_refused', () => {
  const asked = apply(apply(fresh(), [SET_POLICY]), [{ op: 'add-unknown', question: 'Which failure scope does the warm standby cover?' }], agent);
  const closed = apply(asked, [{ op: 'close-unknown', id: 'QD-01', resolution: 'Region' }]);
  for (const actor of [person, fixture]) refused(closed, { op: 'close-unknown', id: 'QD-01', resolution: 'Region again' }, actor, 'QD-01 is already closed by Mahmoud; if the question comes back, add a new unknown.');
  refused(closed, { op: 'close-unknown', id: 'QD-01', resolution: 'Region again' }, policy, 'An answer policy never closes an unknown; ask the person who owns QD-01 to answer it.');
  refused(closed, { op: 'close-unknown', id: 'QD-01', resolution: 'Region again' }, agent, 'An agent never closes an unknown; ask the person who owns QD-01 to answer it.');
});

test('importV22_output_passesGate', () => {
  for (const name of ['regional-zero', 'local-zero', 'demo']) {
    const state = E.importV22(goldenCase(name).projectState, OPTS);
    passesGate(state, name);
    assert.doesNotThrow(() => E.compute(state, { now: NOW }), name);
  }
  const g = goldenCase('demo');
  const record = { ...g.projectState, extraWorkloads: [{ name: 'Reporting', kind: 'analytics', consistency: 'strongish' }], inputs: { ...g.projectState.inputs, brdRef: 'REFUNDS', failureScope: 'unknown', drOverride: 'warm', utilization: 2, topologyOverride: 'undetermined' } };
  const state = E.importV22(record, OPTS);
  assert.deepEqual(state.unknowns.map((u) => [u.id, u.status, Object.keys(u)]), ['QD-01', 'QD-02', 'QD-03', 'QD-04', 'QD-05'].map((id) => [id, 'open', ['id', 'entry', 'question', 'impact', 'owner', 'due', 'status']]));
  passesGate(state, 'an import that raises unknowns');
  assert.doesNotThrow(() => E.compute(state, { now: NOW }));
});

test('schema_primaryFlagDisagrees_invalid', (t) => {
  const two = apply(fresh(), [{ op: 'add', row: 'REL-05' }]);
  schemaPaths(t, {
    'flags agree': [two, []],
    'second entry primary': [edited(two, (s) => { s.register.items['REL-05'][1].primary = true; }), ['register/items/REL-05/1/primary']],
    'first entry not primary': [edited(two, (s) => { s.register.items['REL-05'][0].primary = false; }), ['register/items/REL-05/0/primary']],
    'header entry renumbered': [edited(fresh(), (s) => { s.register.header['HDR-08'][0].n = 2; }), ['register/header/HDR-08/0/primary']],
    'overlay entry not primary': [edited(fresh(), (s) => { s.register.overlay.rows['OVL-04'][0].primary = false; }), ['register/overlay/rows/OVL-04/0/primary']],
    'entry otherwise invalid': [edited(fresh(), (s) => { s.register.items['BUS-01'][0].status = 'Approved'; }), ['register/items/BUS-01/0/status']],
  });
});

test('schema_closedUnknownWithoutResolution_invalid', (t) => {
  const asked = apply(fresh(), [{ op: 'add-unknown', entry: 'REL-05.1', question: 'Which failure scope does the warm standby cover?', owner: 'Lead architect', due: '2026-11-01' }, { op: 'add-unknown', question: 'Who owns the refund ledger?' }], agent);
  const closed = apply(asked, [{ op: 'close-unknown', id: 'QD-02', resolution: 'The finance team' }]);
  const change = (edit) => edited(closed, (s) => edit(s.unknowns[1]));
  schemaPaths(t, {
    'open and closed by the ops': [closed, []],
    'open with null closing fields': [edited(closed, (s) => { Object.assign(s.unknowns[0], { resolution: null, closed_by: null, closed_at: null }); }), []],
    'closed without resolution': [change((u) => { delete u.resolution; }), ['unknowns/1']],
    'closed with a blank resolution': [change((u) => { u.resolution = '  '; }), ['unknowns/1/resolution']],
    'closed without who and when': [change((u) => { delete u.closed_by; delete u.closed_at; }), ['unknowns/1', 'unknowns/1']],
    'closed with a null time': [change((u) => { u.closed_at = null; }), ['unknowns/1/closed_at']],
    'open with a resolution': [change((u) => { u.status = 'open'; }), ['unknowns/1/closed_at', 'unknowns/1/closed_by', 'unknowns/1/resolution']],
    'without status': [edited(closed, (s) => { delete s.unknowns[0].status; }), ['unknowns/0']],
    'another status': [edited(closed, (s) => { s.unknowns[0].status = 'pending'; }), ['unknowns/0/status']],
  });
});

test('schema_notApplicableSignoffWithDecision_invalid', (t) => {
  let signed = apply(fresh(), [SET_POLICY, { op: 'sign', role: 'business_sponsor', decision: 'Approved' }, { op: 'sign', role: 'network_owner', applicable: false, reason: 'No network change' }]);
  signed = apply(signed, [{ op: 'sign', role: 'data_owner', decision: 'Rejected' }], policy);
  signed = apply(signed, [{ op: 'sign', role: 'finance_procurement', applicable: false, reason: 'No purchase' }], fixture);
  const change = (role, patch) => edited(signed, (s) => Object.assign(s.gate.signoffs.find((x) => x.role === role), patch));
  const at = (i, key) => `gate/signoffs/${i}/${key}`;
  schemaPaths(t, {
    'every record the sign op writes': [signed, []],
    'not applicable with a decision': [change('network_owner', { decision: 'Rejected' }), [at(1, 'decision')]],
    'not applicable without a reason': [change('network_owner', { na_reason: null }), [at(1, 'na_reason')]],
    'not applicable with a blank reason': [change('finance_procurement', { na_reason: '  ' }), [at(3, 'na_reason')]],
    'applicable without a decision': [change('business_sponsor', { decision: null }), [at(0, 'decision')]],
    'applicable with another decision': [change('data_owner', { decision: 'Fine' }), [at(2, 'decision')]],
    'applicable neither true nor false': [change('business_sponsor', { applicable: 'yes' }), [at(0, 'applicable')]],
  });
});
