import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine } from './helpers.mjs';

const E = loadEngine();
const NOW = '2026-10-23T11:01:02Z';
const LATER = '2026-10-24T08:30:00Z';
const person = { type: 'person', name: 'Mahmoud', label: '' };
const agent = { type: 'agent', name: 'E2E Architect', label: '' };
const policy = { type: 'policy', name: 'test-run policy', label: 'test-run policy' };
const fixture = { type: 'fixture', name: 'Dana Reyes', label: '' };
const STAND_IN = 'Stand-in: Approver (test-run policy, set by Mahmoud, 2026-10-23)';
const POLICY_LABEL = 'Policy: test-run policy (set by Mahmoud, 2026-10-23)';
const FIXTURE_LABEL = 'Fixture: Dana Reyes (test-run policy)';
const SET_POLICY = { op: 'set-policy', policy: { label: 'test-run policy', stand_ins: ['Approver'] } };
const ROLES = E.SIGNOFF_ROLES.filter((role) => !role.overlayOnly).map((role) => role.key);
const CRITICAL = ['HDR-07.1', 'HDR-08.1', 'CAP-01.1', 'CAP-04.1', 'CAP-07.1', 'REL-01.1', 'REL-03.1', 'REL-04.1', 'REL-05.1', 'DAT-01.1', 'DAT-05.1', 'DAT-03.1', 'INT-08.1'];
const CRITICAL_VALUES = ['greenfield', 'cloud', 864000, 5, 300, 99.9, 600, 60, 'az', 'Refund ledger, the system of record', 'strong', 'sensitive', 'public'];
const CONTENT = [
  { op: 'set', entry: 'HDR-01.1', value: 'Refunds platform' },
  { op: 'set', entry: 'HDR-02.1', value: 'Jane Doe' },
  { op: 'set', entry: 'HDR-04.1', value: 'Omar Haddad' },
  { op: 'set', entry: 'BUS-01.1', value: 'Cut refund handling time to one day' },
  { op: 'set', entry: 'BUS-03.1', value: 'Refund intake and payout; chargebacks in a later phase' },
  { op: 'set', entry: 'BUS-07.1', value: 'No card data leaves the EU' },
  { op: 'set', entry: 'BUS-08.1', value: 'Refund within 5 days or pay the penalty' },
  { op: 'set', entry: 'DAT-04.1', value: 'yes' },
  { op: 'set-factor', entry: 'DAT-04.1', factor: 'primaryLocation', value: 'Frankfurt' },
  { op: 'set', entry: 'DAT-06.1', value: 'Keep refunds for 7 years' },
  { op: 'set', entry: 'SEC-01.1', value: 'PCI DSS 4.0' },
  { op: 'set', entry: 'SEC-04.1', value: 'TLS 1.3 in transit, KMS keys at rest' },
  ...CRITICAL.map((entry, i) => ({ op: 'set', entry, value: CRITICAL_VALUES[i] })),
  { op: 'set-factor', entry: 'DAT-01.1', factor: 'storeKind', value: 'relational' },
];
const OPTION = { op: 'set-option', name: 'One region, multi-AZ', shape: { hosting: 'cloud', topology: 'multiAZ' } };
const CONDITION = { op: 'add-condition', text: 'Load test at twice the peak before go-live', owner: 'SRE lead', due: '2026-12-01' };
const TAIL = 'G3 needs it Confirmed with who and when, N/A with a reason, or Open under a valid exception.';
const HELD = 'Finance / procurement has not signed: a stand-in sign-off counts only when nothing else in G3 fails.';
const APPROVED = {
  g0: { met: true, missing: [] },
  g1: { met: true, missing: [] },
  g2: { result: 'shortlist', missing: [] },
  g3: { status: 'Approved', missingRoles: [], problems: [] },
  label: 'G3 Approved',
  authorized: true,
};
const WITH_CONDITIONS = { ...APPROVED, g3: { status: 'Approved with conditions', missingRoles: [], problems: [] }, label: 'G3 Approved with conditions' };

const label = (key) => E.SIGNOFF_ROLES.find((role) => role.key === key).label;
const staleText = (keys) => `Sign-off records given on other content (the content hash has changed since): ${keys.join(', ')}; sign again after the review.`;
const reopenText = (at, reason, keys) => `Sign-off records given before G3 was reopened on ${at} (${reason}): ${keys.join(', ')}; sign again after the review.`;
const assign = (rows) => rows.map((row) => ({ op: 'set', entry: `${row.id}.1`, owner_name: 'Dana Reyes', due: '2026-12-01' }));
const signOps = (roles, decision = 'Approved') => roles.map((role) => ({ op: 'sign', role, decision }));
const exception = (entry, expires = '2026-12-31', review = '2026-12-15') => ({ op: 'add-exception', entry, reason: 'Review booked with the owner', expires, review });
const gate = (state, now = NOW) => E.gateStatus(state, E.compute(state, { now }), { now });

function apply(state, ops, actor = person, now = NOW) {
  const result = E.applyPatch(state, ops, actor, { now });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

function refused(state, op, actor, message) {
  const before = JSON.stringify(state);
  const result = E.applyPatch(state, [op], actor, { now: LATER });
  assert.deepEqual(result.errors.map((e) => [e.index, e.message]), [[0, message]]);
  assert.deepEqual(result.changes, []);
  assert.equal(JSON.stringify(result.state), before);
  assert.equal(JSON.stringify(state), before);
}

function deepFreeze(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x);
    for (const value of Object.values(x)) deepFreeze(value);
  }
  return x;
}

function approvedState({ mode = 'full', roles = ROLES } = {}) {
  let state = E.newState({ name: 'Refunds platform', slug: 'refunds-platform', mode, now: NOW });
  state = apply(state, CONTENT);
  state = apply(state, [...CRITICAL.map((entry) => ({ op: 'confirm', entry })), { op: 'confirm', entry: 'DAT-01.1', factor: 'storeKind' }]);
  state = apply(state, assign([...E.HEADER_FIELDS, ...E.ITEMS]));
  state = apply(state, [OPTION], agent);
  state = apply(state, E.G3_CHECKLIST.map((line) => ({ op: 'check', id: line.id, status: 'Done' })));
  return apply(state, signOps(roles));
}

const resign = (state, roles = ROLES, now = LATER) => apply(state, signOps(roles), person, now);

function withStandIn(decision = 'Approved') {
  const state = apply(approvedState({ roles: ROLES.filter((key) => key !== 'finance_procurement') }), [SET_POLICY]);
  return apply(state, [{ op: 'sign', role: 'finance_procurement', decision }], policy);
}

function migrating(ops) {
  const state = approvedState();
  Object.assign(state.register.overlay, { applies: true, source: 'onprem' });
  return resign(apply(state, [...ops, ...assign(E.OVERLAY_FIELDS)]));
}

test('gateStatus_allRolesApproved_approvedAndAuthorized', () => {
  const state = approvedState();
  const model = E.compute(state, { now: NOW });
  assert.deepEqual([model.validation.blockers, model.validation.conflicts], [[], []]);
  assert.deepEqual(model.options.list.map((o) => [o.id, o.hardPass]), [['OPT-01', true]]);
  assert.deepEqual(model.scopes.map((s) => [s.entry, s.strategy]), [['REL-05.1', 'localHA']]);
  assert.equal(state.register.overlay.applies, false);
  assert.deepEqual(state.gate.signoffs.map((x) => [x.role, x.name, x.decision, x.stand_in]), ROLES.map((role) => [role, 'Mahmoud', 'Approved', false]));
  const got = E.gateStatus(state, model, { now: NOW });
  assert.deepEqual(got, APPROVED);
  assert.deepEqual(Object.keys(got), ['g0', 'g1', 'g2', 'g3', 'label', 'authorized']);
  assert.deepEqual(Object.keys(model), ['v', 'c', 'a', 'rules', 'graph', 'scopes', 'shape', 'options', 'validation', 'gate']);
  assert.deepEqual(model.gate, got, 'compute returns the gate');
  const { gate: computed, ...rest } = model;
  assert.deepEqual(E.gateStatus(state, rest, { now: NOW }), computed, 'gateStatus reads the model compute builds');
  for (const now of [undefined, '2026-10-23 11:01:02', '2026-10-23T11:01:02']) assert.throws(() => E.gateStatus(state, model, { now }), { message: /now must be a Date, or an ISO 8601 timestamp with Z or an offset/ }, String(now));
  assert.deepEqual(E.gateStatus(state, model, { now: new Date(NOW) }), got);
});

test('gateStatus_noSignoffs_notSigned', () => {
  const got = gate(approvedState({ roles: [] }));
  assert.deepEqual(got, { ...APPROVED, g3: { status: 'Not signed', missingRoles: ROLES, problems: ROLES.map((key) => `${label(key)} has not signed.`) }, label: 'G2', authorized: false });
});

test('gateStatus_conditionWithOwnerDue_approvedWithConditions', () => {
  const state = resign(apply(approvedState(), [CONDITION]));
  assert.deepEqual(state.gate.conditions, [{ id: 'COND-01', text: CONDITION.text, owner: 'SRE lead', due: '2026-12-01' }]);
  assert.deepEqual(gate(state, LATER), WITH_CONDITIONS);
  const decided = apply(state, [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }], person, LATER);
  assert.deepEqual(gate(decided, LATER), WITH_CONDITIONS, 'a decision with conditions, with a condition recorded');
  const late = apply(approvedState(), [CONDITION], person, LATER);
  assert.deepEqual(gate(late, LATER).g3, { status: 'Review', missingRoles: [], problems: [staleText(ROLES)] }, 'a condition is content: added after the signing, it sends G3 back to review');
});

test('gateStatus_conditionalApprovalWithoutConditions_notAuthorized', () => {
  const problem = (label) => `${label} signed Approved with conditions, but no condition is recorded; record each condition with its owner and due date (YYYY-MM-DD) before G3 can read Approved with conditions.`;
  const decided = apply(approvedState(), [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }]);
  assert.deepEqual(decided.gate.conditions, []);
  assert.deepEqual(gate(decided), { ...APPROVED, g3: { status: 'Blocked', missingRoles: [], problems: [problem(label('data_owner'))] }, label: 'Blocked', authorized: false });
  const two = apply(decided, [{ op: 'sign', role: 'network_owner', decision: 'Approved with conditions' }]);
  assert.deepEqual(gate(two).g3.problems, [problem(label('network_owner')), problem(label('data_owner'))], 'one problem per role, in sign-off register order');
  const recorded = resign(apply(decided, [CONDITION], person, LATER));
  const fixed = apply(recorded, [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }], person, LATER);
  assert.deepEqual(gate(fixed, LATER), WITH_CONDITIONS, 'one recorded condition with owner and due lifts it');
  const noDue = resign(apply(decided, [{ ...CONDITION, due: '' }], person, LATER));
  const stillBlocked = gate(apply(noDue, [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }], person, LATER), LATER);
  assert.deepEqual([stillBlocked.g3.status, stillBlocked.authorized], ['Blocked', false]);
  assert.deepEqual(stillBlocked.g3.problems, ['COND-01 has no due date; a condition needs an owner and a due date (YYYY-MM-DD).'], 'the owner and due date rule of the existing conditions check applies');
});

test('gateStatus_conditionWithoutDue_blocked', () => {
  const tail = 'a condition needs an owner and a due date (YYYY-MM-DD).';
  const signed = (condition) => gate(resign(apply(approvedState(), [{ ...CONDITION, ...condition }])), LATER);
  const noDue = signed({ due: '' });
  assert.deepEqual(noDue, { ...APPROVED, g3: { status: 'Blocked', missingRoles: [], problems: [`COND-01 has no due date; ${tail}`] }, label: 'Blocked', authorized: false });
  assert.deepEqual(signed({ owner: '  ' }).g3.problems, [`COND-01 has no owner; ${tail}`]);
  assert.deepEqual(signed({ owner: null, due: null }).g3.problems, [`COND-01 has no owner and no due date; ${tail}`]);
  const two = resign(apply(approvedState(), [CONDITION, { ...CONDITION, due: '' }]));
  assert.deepEqual(gate(two, LATER).g3, { status: 'Blocked', missingRoles: [], problems: [`COND-02 has no due date; ${tail}`] }, 'only the condition without a due date blocks');
  const impossible = apply(approvedState(), [CONDITION]);
  impossible.gate.conditions[0].due = '2026-02-30';
  assert.deepEqual(gate(resign(impossible), LATER).g3.problems, [`COND-01 has no due date; ${tail}`], 'a due date that is no date');
  const spaces = apply(approvedState(), [CONDITION]);
  spaces.gate.conditions[0].owner = '  ';
  assert.deepEqual(gate(resign(spaces), LATER).g3.problems, [`COND-01 has no owner; ${tail}`], 'an owner of spaces only');
});

test('gateStatus_missingApplicableRole_notSigned', () => {
  const got = gate(approvedState({ roles: ROLES.filter((key) => key !== 'network_owner') }));
  assert.deepEqual(got, { ...APPROVED, g3: { status: 'Not signed', missingRoles: ['network_owner'], problems: ['Network owner has not signed.'] }, label: 'G2', authorized: false });
  const why = 'Network owner has not signed: its record needs a decision, a name and a UTC time.';
  for (const patch of [{ name: '  ' }, { name: null }, { at: '2026-10-23' }, { at: '2026-02-30T10:00:00Z' }]) {
    const odd = approvedState();
    Object.assign(odd.gate.signoffs.find((x) => x.role === 'network_owner'), patch);
    assert.deepEqual(gate(odd).g3, { status: 'Not signed', missingRoles: ['network_owner'], problems: [why] }, JSON.stringify(patch));
  }
  for (const [patch, given] of [[{ decision: 'Fine' }, 'the decision "Fine"'], [{ decision: null }, 'no decision']]) {
    const odd = approvedState();
    Object.assign(odd.gate.signoffs.find((x) => x.role === 'network_owner'), patch);
    assert.throws(() => gate(odd), { name: 'Error', message: `The project state cannot be read:\n- Sign-off network_owner is marked applicable (applicable: true) but gives ${given}; give Approved, Approved with conditions or Rejected, or mark the role not applicable (applicable: false, with the reason in na_reason and decision null).` }, `${JSON.stringify(patch)}: a record whose fields disagree is a gate rejection`);
    assert.deepEqual(E.gateStatus(odd, E.compute(approvedState(), { now: NOW }), { now: NOW }).g3, { status: 'Not signed', missingRoles: ['network_owner'], problems: [why] }, `${JSON.stringify(patch)}: gateStatus on its own still reads the record as unsigned`);
  }
  const flagged = approvedState();
  flagged.gate.signoffs.find((x) => x.role === 'network_owner').applicable = 'yes';
  assert.throws(() => gate(flagged), { name: 'Error', message: 'The project state cannot be read:\n- Sign-off network_owner has applicable "yes"; set applicable to true for a sign-off with a decision, or to false for a role marked not applicable with a reason.' }, 'an applicable that is not a boolean is a gate rejection');
  assert.deepEqual(E.gateStatus(flagged, E.compute(approvedState(), { now: NOW }), { now: NOW }).g3, { status: 'Not signed', missingRoles: ['network_owner'], problems: [why] }, 'gateStatus on its own still reads the record as unsigned');
  const unflagged = approvedState();
  delete unflagged.gate.signoffs.find((x) => x.role === 'network_owner').stand_in;
  assert.deepEqual(gate(unflagged), APPROVED, 'a record without the stand-in flag is a person sign-off, as the sign guard reads it');
});

test('gateStatus_migrationOwnerNoOverlay_notRequired', () => {
  assert.deepEqual(gate(approvedState()), APPROVED, 'no migration owner sign-off while the overlay does not apply');
  const ignored = approvedState();
  ignored.gate.signoffs.push({ role: 'migration_owner', applicable: true, na_reason: null, name: 'Mahmoud', decision: 'Rejected', at: '2026-10-22T09:00:00Z', content_hash: `sha256:${'0'.repeat(64)}`, stand_in: false });
  ignored.gate.reopened = { at: '2026-10-23T00:00:00Z', by: 'E2E Architect', reason: 'Chunk 08 changed' };
  assert.deepEqual(gate(ignored), APPROVED, 'its records are ignored entirely: a rejection, another content hash, a time before the reopening');
  const overlay = migrating([{ op: 'set', entry: 'OVL-04.1', value: 'Rehost' }]);
  const got = gate(overlay, LATER);
  assert.deepEqual(got, { ...APPROVED, g3: { status: 'Not signed', missingRoles: ['migration_owner'], problems: ['Migration owner (if relevant) has not signed.'] }, label: 'G2', authorized: false });
  assert.deepEqual(gate(apply(overlay, signOps(['migration_owner']), person, LATER), LATER), APPROVED);
  const notApplicable = apply(overlay, [{ op: 'sign', role: 'migration_owner', applicable: false, reason: 'The overlay covers a later wave only' }], person, LATER);
  assert.deepEqual(gate(notApplicable, LATER), APPROVED);
  const rejected = apply(overlay, signOps(['migration_owner'], 'Rejected'), person, LATER);
  assert.equal(gate(rejected, LATER).g3.status, 'Blocked', 'once the overlay applies, its records count');
});

test('gateStatus_roleNotApplicableWithReason_notRequired', () => {
  const state = apply(approvedState(), [{ op: 'sign', role: 'network_owner', applicable: false, reason: 'No network change: the platform team runs the shared network' }]);
  assert.deepEqual(state.gate.signoffs.find((x) => x.role === 'network_owner').applicable, false);
  assert.deepEqual(gate(state), APPROVED);
  const blankReason = structuredClone(state);
  blankReason.gate.signoffs.find((x) => x.role === 'network_owner').na_reason = '  ';
  assert.throws(() => gate(blankReason), { name: 'Error', message: 'The project state cannot be read:\n- Sign-off network_owner is marked not applicable (applicable: false) but gives no reason; give the reason in na_reason, or set applicable to true with a decision.' }, 'a mark without a reason is a gate rejection');
  assert.deepEqual(E.gateStatus(blankReason, E.compute(state, { now: NOW }), { now: NOW }).g3, { status: 'Not signed', missingRoles: ['network_owner'], problems: ['Network owner is marked not applicable without a reason.'] }, 'gateStatus on its own still reads the mark as not counted');
  const edited = apply(state, [{ op: 'set', entry: 'BUS-03.1', value: 'Refund intake, payout and chargebacks' }], person, LATER);
  assert.deepEqual(gate(edited, LATER).g3, { status: 'Review', missingRoles: [], problems: [staleText(ROLES)] }, 'a not-applicable mark is a record, so it goes back to review with the sign-offs');
});

test('gateStatus_standInWithoutPolicy_notSigned', () => {
  const standIn = withStandIn();
  assert.deepEqual(gate(standIn), APPROVED);
  const why = "Finance / procurement has not signed: a stand-in sign-off counts only while the run's policy names an Approver stand-in.";
  const unstamped = structuredClone(standIn);
  unstamped.run.policy.set_at = 'today';
  const cases = [
    ['cleared', apply(standIn, [{ op: 'set-policy', policy: null }])],
    ['no Approver', apply(standIn, [{ op: 'set-policy', policy: { label: 'test-run policy', stand_ins: [] } }])],
    ['no valid set_at', unstamped],
  ];
  for (const [name, state] of cases) assert.deepEqual(gate(state), { ...APPROVED, g3: { status: 'Not signed', missingRoles: ['finance_procurement'], problems: [why] }, label: 'G2', authorized: false }, name);
  const nameless = structuredClone(cases[0][1]);
  Object.assign(nameless.gate.signoffs.find((x) => x.role === 'finance_procurement'), { applicable: false, na_reason: 'No purchase', decision: null, name: null });
  assert.deepEqual(gate(nameless).g3, { status: 'Not signed', missingRoles: ['finance_procurement'], problems: [why] }, 'a nameless stand-in mark never matches a missing stand-in label');
});

test('gateStatus_standInWithPolicy_approved', () => {
  const state = withStandIn();
  assert.deepEqual(state.gate.signoffs.at(-1), { role: 'finance_procurement', applicable: true, na_reason: null, name: STAND_IN, decision: 'Approved', at: NOW, content_hash: E.contentHash(state), stand_in: true });
  assert.deepEqual(gate(state), APPROVED);
  const all = apply(apply(approvedState({ roles: [] }), [SET_POLICY]), signOps(ROLES), policy);
  assert.ok(all.gate.signoffs.every((x) => x.stand_in && x.name === STAND_IN));
  assert.deepEqual(gate(all), APPROVED, 'the stand-in signs every role');
  const others = ROLES.filter((key) => key !== 'finance_procurement');
  const conditioned = apply(resign(apply(approvedState({ roles: others }), [CONDITION]), others), [SET_POLICY], person, LATER);
  assert.deepEqual(gate(apply(conditioned, [{ op: 'sign', role: 'finance_procurement', decision: 'Approved with conditions' }], policy, LATER), LATER), WITH_CONDITIONS, "the stand-in's decision counts");
  const base = apply(approvedState({ roles: ROLES.filter((key) => key !== 'finance_procurement') }), [SET_POLICY]);
  refused(base, { op: 'sign', role: 'finance_procurement', applicable: false, reason: 'No purchase: the existing contract covers it' }, policy, 'A stand-in never marks a role not applicable, because it signs only when its conditions hold; ask the person who holds finance_procurement to mark it not applicable.');
  const marked = apply(base, [{ op: 'sign', role: 'finance_procurement', applicable: false, reason: 'No purchase: the existing contract covers it' }], fixture);
  assert.deepEqual(gate(marked), APPROVED, "a fixture owner's not-applicable mark counts");
  assert.deepEqual(gate(apply(state, [{ op: 'set-policy', policy: null }, SET_POLICY])), APPROVED, 'the same policy set again on the same day gives the same stand-in label');
});

test('gateStatus_staleStandInPolicy_notCounted', () => {
  const standIn = withStandIn();
  const why = 'Finance / procurement has not signed: its stand-in sign-off was given under another policy, so the stand-in signs again under the current one.';
  const notSigned = { ...APPROVED, g3: { status: 'Not signed', missingRoles: ['finance_procurement'], problems: [why] }, label: 'G2', authorized: false };
  const relabelled = apply(standIn, [{ op: 'set-policy', policy: { label: 'second policy', stand_ins: ['Approver'] } }], person, LATER);
  assert.deepEqual(gate(relabelled, LATER), notSigned);
  const nextDay = apply(apply(standIn, [{ op: 'set-policy', policy: null }]), [SET_POLICY], person, LATER);
  assert.equal(nextDay.run.policy.set_at, LATER);
  assert.deepEqual(gate(nextDay, LATER), notSigned, 'the same label set on another day is another policy');
  const again = apply(relabelled, [{ op: 'sign', role: 'finance_procurement', decision: 'Approved' }], policy, LATER);
  assert.equal(again.gate.signoffs.at(-1).name, 'Stand-in: Approver (second policy, set by Mahmoud, 2026-10-24)');
  assert.deepEqual(gate(again, LATER), APPROVED, 'signed again under the current policy, it counts');
});

test('gateStatus_standInWithOtherProblem_notCounted', () => {
  const missing = withStandIn();
  missing.gate.signoffs = missing.gate.signoffs.filter((x) => x.role !== 'network_owner');
  assert.deepEqual(gate(missing).g3, { status: 'Not signed', missingRoles: ['network_owner', 'finance_procurement'], problems: ['Network owner has not signed.', HELD] }, 'another role is missing');
  const line = `G3-14 is Open: ${E.G3_CHECKLIST.find((x) => x.id === 'G3-14').text}`;
  const others = ROLES.filter((key) => key !== 'finance_procurement');
  const unticked = resign(apply(approvedState({ roles: others }), [{ op: 'check', id: 'G3-14', status: 'Open' }]), others);
  const standIn = apply(apply(unticked, [SET_POLICY]), [{ op: 'sign', role: 'finance_procurement', decision: 'Approved' }], policy, LATER);
  assert.deepEqual(gate(standIn, LATER).g3, { status: 'Not signed', missingRoles: ['finance_procurement'], problems: [HELD, line] }, 'a checklist line is Open');
  const byPerson = apply(unticked, signOps(['finance_procurement']), person, LATER);
  assert.deepEqual(gate(byPerson, LATER).g3, { status: 'Not signed', missingRoles: [], problems: [line] }, "a person's sign-off counts whatever else fails");
  const reopened = apply(withStandIn(), [{ op: 'reopen', reason: 'Chunk 07 changed' }], agent, LATER);
  assert.deepEqual(gate(reopened, LATER).g3, { status: 'Review', missingRoles: ['finance_procurement'], problems: [reopenText(LATER, 'Chunk 07 changed', ROLES), HELD] }, 'the records are back in review');
});

test('gateStatus_namedException_hardOpenPasses', () => {
  const opened = apply(approvedState(), [{ op: 'open', entry: 'BUS-07.1' }]);
  const blocked = gate(resign(opened), LATER);
  assert.deepEqual([blocked.g2, blocked.g3.status, blocked.label, blocked.authorized], [{ result: 'blocker', missing: ['OPEN-BUS-07.1'] }, 'Blocked', 'Blocked', false]);
  const excepted = resign(apply(opened, [exception('BUS-07.1')]));
  assert.deepEqual(E.compute(excepted, { now: LATER }).validation.blockers, []);
  assert.deepEqual(gate(excepted, LATER), APPROVED);
  assert.deepEqual(gate(excepted, '2027-01-01T00:00:00Z').g2.missing, ['OPEN-BUS-07.1'], 'the exception has expired');
  const labelled = structuredClone(excepted);
  labelled.gate.exceptions[0].granted_by = STAND_IN;
  assert.deepEqual(gate(resign(labelled), LATER).g2.missing, ['OPEN-BUS-07.1'], 'a stand-in label never grants an exception');
});

test('gateStatus_editAfterSign_backToReview', () => {
  const state = apply(approvedState(), [{ op: 'set', entry: 'BUS-03.1', value: 'Refund intake, payout and chargebacks' }], person, LATER);
  assert.notEqual(E.contentHash(state), state.gate.signoffs[0].content_hash);
  assert.deepEqual(gate(state, LATER), { ...APPROVED, g3: { status: 'Review', missingRoles: [], problems: [staleText(ROLES)] }, label: 'G2', authorized: false });
  assert.deepEqual(gate(resign(state), LATER), APPROVED);
  const one = apply(state, signOps(ROLES.filter((key) => key !== 'data_owner')), person, LATER);
  assert.deepEqual(gate(one, LATER).g3, { status: 'Review', missingRoles: [], problems: [staleText(['data_owner'])] });
  const notContent = approvedState();
  Object.assign(notContent.ui, { provider: 'aws', person: 'Dana Reyes' });
  Object.assign(notContent.run, { stage: 4, light: true });
  notContent.project.pre_sdd_version = '1.1';
  notContent.history.push({ ...notContent.history.at(-1), at: LATER });
  assert.deepEqual(gate(notContent), APPROVED, 'the UI, the run, the version and the history are not content');
});

test('gateStatus_reopened_backToReview', () => {
  const reason = 'Chunk 05 changed after review';
  const state = apply(approvedState(), [{ op: 'reopen', reason }], agent, LATER);
  assert.equal(E.contentHash(state), state.gate.signoffs[0].content_hash);
  assert.deepEqual(gate(state, LATER), { ...APPROVED, g3: { status: 'Review', missingRoles: [], problems: [reopenText(LATER, reason, ROLES)] }, label: 'G2', authorized: false });
  assert.deepEqual(gate(resign(state, ROLES, LATER), LATER), APPROVED, 'a sign-off at the reopening instant is not before it');
  const half = '2026-10-23T11:01:02.500Z';
  const subSecond = apply(approvedState(), [{ op: 'reopen', reason }], agent, half);
  assert.equal(subSecond.gate.reopened.at, half);
  assert.ok(subSecond.gate.signoffs[0].at > half, 'as text, the sign-offs read later');
  assert.deepEqual(gate(subSecond).g3.problems, [reopenText(half, reason, ROLES)], 'as instants, they came 500 ms before the reopening');
  const offset = approvedState();
  offset.gate.reopened = { at: '2026-10-23T12:00:00+02:00', by: 'Mahmoud', reason };
  assert.ok(offset.gate.signoffs[0].at < offset.gate.reopened.at, 'as text, the sign-offs read earlier');
  assert.deepEqual(gate(offset), APPROVED, 'as instants, the reopening came an hour before them');
  const mark = apply(approvedState(), [{ op: 'sign', role: 'network_owner', applicable: false, reason: 'No network change' }]);
  assert.deepEqual(gate(apply(mark, [{ op: 'reopen', reason }], agent, LATER), LATER).g3.problems, [reopenText(LATER, reason, ROLES)], 'a not-applicable mark too');
});

test('gateStatus_g1OpenWithoutDue_notMet', () => {
  const state = resign(apply(approvedState(), [{ op: 'set', entry: 'OPS-01.1', due: '' }]));
  assert.equal(E.primaryEntry(state, 'OPS-01').status, 'Open');
  assert.deepEqual(gate(state, LATER), {
    g0: { met: true, missing: [] },
    g1: { met: false, missing: ['OPS-01.1 is Open without a due date (YYYY-MM-DD).'] },
    g2: { result: 'incomplete', missing: ['G1 is not met.'] },
    g3: { status: 'Not signed', missingRoles: [], problems: ['G1 is not met.'] },
    label: 'G0',
    authorized: false,
  });
  const g1 = (ops, edit = () => {}) => {
    const s = apply(approvedState(), ops);
    edit(s);
    return gate(resign(s), LATER).g1;
  };
  assert.deepEqual(g1([{ op: 'set', entry: 'OPS-01.1', owner_name: '  ' }]).missing, ['OPS-01.1 is Open without an owner name.']);
  assert.deepEqual(g1([{ op: 'set', entry: 'OPS-01.1', owner_name: '', due: '' }]).missing, ['OPS-01.1 is Open without an owner name and a due date (YYYY-MM-DD).']);
  assert.deepEqual(g1([], (s) => { E.primaryEntry(s, 'OPS-02').due = '2026-02-30'; }).missing, ['OPS-02.1 is Open without a due date (YYYY-MM-DD).']);
  assert.deepEqual(g1([], (s) => { E.primaryEntry(s, 'OPS-02').owner_name = '  '; }).missing, ['OPS-02.1 is Open without an owner name.'], 'an owner name of spaces only');
  assert.deepEqual(g1([], (s) => { E.primaryEntry(s, 'OPS-02').status = 'Pending'; }), { met: false, missing: ['OPS-02.1 has status "Pending"; a status is Open, Estimated, Confirmed or N/A.'] });
  assert.deepEqual(g1([{ op: 'set', entry: 'OPS-03.1', value: 'Weekly releases', owner_name: '', due: '' }, { op: 'na', entry: 'OPS-05.1', reason: 'No telemetry change' }, { op: 'set', entry: 'OPS-05.1', owner_name: '', due: '' }]), { met: true, missing: [] }, 'an entry that is not Open needs neither');
  assert.deepEqual(g1([{ op: 'add', row: 'BUS-02', label: 'Refund status page' }]).missing, ['BUS-02.2 is Open without an owner name and a due date (YYYY-MM-DD).'], 'an added entry counts like the primary');
  assert.equal(E.rowEntries(state, 'OVL-01')[0].due, null, 'overlay entries hold no owner or due date while the overlay does not apply');
  const overlay = approvedState();
  Object.assign(overlay.register.overlay, { applies: true, source: 'onprem' });
  const applies = resign(apply(overlay, [{ op: 'set', entry: 'OVL-04.1', value: 'Rehost' }]));
  assert.deepEqual(gate(applies, LATER).g1.missing, E.OVERLAY_FIELDS.filter((row) => row.id !== 'OVL-04').map((row) => `${row.id}.1 is Open without an owner name and a due date (YYYY-MM-DD).`), 'overlay entries count once the overlay applies');
});

test('gateStatus_quickMode_labelDiscovery', () => {
  const quick = approvedState({ mode: 'quick' });
  assert.equal(quick.run.mode, 'quick');
  assert.deepEqual(gate(quick), { ...APPROVED, label: 'Discovery', authorized: false }, 'the gates are computed for display; no gate is claimed');
  const blank = gate(E.newState({ name: 'Refunds platform', slug: 'refunds-platform', mode: 'quick', now: NOW }));
  assert.deepEqual([blank.g0.met, blank.g3.status, blank.label, blank.authorized], [false, 'Blocked', 'Discovery', false]);
  const bare = gate(apply(quick, [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }]));
  assert.deepEqual([bare.g3.status, bare.label, bare.authorized], ['Blocked', 'Discovery', false]);
  const conditional = gate(apply(resign(apply(quick, [CONDITION])), [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }], person, LATER), LATER);
  assert.deepEqual([conditional.g3.status, conditional.label, conditional.authorized], ['Approved with conditions', 'Discovery', false]);
  const full = structuredClone(quick);
  full.run.mode = 'full';
  assert.deepEqual(gate(full), APPROVED, 'the run mode is not content: switched to full, the signatures stand');
});

test('gateStatus_rejectedRole_blocked', () => {
  const state = apply(approvedState(), [{ op: 'sign', role: 'security_and_privacy_compliance', decision: 'Rejected' }], { type: 'person', name: 'Lena Brandt', label: '' });
  assert.deepEqual(gate(state), { ...APPROVED, g3: { status: 'Blocked', missingRoles: [], problems: ['Security and privacy/compliance is Rejected, signed by Lena Brandt.'] }, label: 'Blocked', authorized: false });
  const standIn = withStandIn('Rejected');
  assert.deepEqual(gate(standIn).g3, { status: 'Blocked', missingRoles: ['finance_procurement'], problems: [`Finance / procurement is Rejected, signed by ${STAND_IN}.`, HELD] }, "a stand-in's rejection blocks too");
  const later = apply(standIn, [{ op: 'set-policy', policy: { label: 'second policy', stand_ins: ['Approver'] } }]);
  assert.equal(gate(later).g3.status, 'Blocked', 'a rejection blocks under a later policy as well');
  const both = apply(state, [{ op: 'sign', role: 'data_owner', decision: 'Rejected' }]);
  const records = both.gate.signoffs;
  records.push(records.splice(records.findIndex((x) => x.role === 'security_and_privacy_compliance'), 1)[0]);
  assert.ok(records.findIndex((x) => x.role === 'data_owner') < records.findIndex((x) => x.role === 'security_and_privacy_compliance'), 'the data owner record now comes first');
  assert.deepEqual(gate(both).g3.problems, ['Security and privacy/compliance is Rejected, signed by Lena Brandt.', 'Data owner is Rejected, signed by Mahmoud.'], 'in sign-off register order');
  const marked = approvedState();
  Object.assign(marked.gate.signoffs.find((x) => x.role === 'network_owner'), { applicable: false, na_reason: 'No network change', decision: 'Rejected' });
  assert.throws(() => gate(marked), { name: 'Error', message: 'The project state cannot be read:\n- Sign-off network_owner is marked not applicable (applicable: false) but gives the decision "Rejected"; set decision to null, or set applicable to true to keep the decision.' }, 'a not-applicable mark that also says Rejected is a gate rejection, so the rejection is never dropped silently');
});

test('gateStatus_checklistLineNotDone_notSigned', () => {
  const text = (id) => E.G3_CHECKLIST.find((x) => x.id === id).text;
  const state = resign(apply(approvedState(), [{ op: 'check', id: 'G3-09', status: 'N/A', reason: 'Greenfield: no existing estate' }, { op: 'check', id: 'G3-10', status: 'Open' }]));
  assert.deepEqual(gate(state, LATER), { ...APPROVED, g3: { status: 'Not signed', missingRoles: [], problems: [`G3-10 is Open: ${text('G3-10')}`] }, label: 'G2', authorized: false }, 'N/A with a reason passes; a line taken back is Open');
  const handMade = structuredClone(state);
  handMade.gate.checklist['G3-09'].na_reason = '  ';
  handMade.gate.checklist['G3-10'] = { status: 'Pending', na_reason: null, by: 'Mahmoud', at: NOW };
  assert.deepEqual(gate(resign(handMade), LATER).g3.problems, [`G3-09 is N/A without a reason: ${text('G3-09')}`, `G3-10 is Open: ${text('G3-10')}`]);
  const none = approvedState();
  none.gate.checklist = {};
  assert.deepEqual(gate(resign(none), LATER).g3.problems, E.G3_CHECKLIST.map((line) => `${line.id} is Open: ${line.text}`), 'a line missing from the checklist is Open, in checklist order');
});

test('gateStatus_g2NoPassingOption_incompleteAndG3NotSigned', () => {
  const none = approvedState();
  none.options.list = [];
  const got = gate(resign(none), LATER);
  assert.deepEqual(got, { ...APPROVED, g2: { result: 'incomplete', missing: ['No option is recorded; G2 needs at least one option that passes every hard check.'] }, g3: { status: 'Not signed', missingRoles: [], problems: ['G2 is not met: no feasible option shortlist yet.'] }, label: 'G1', authorized: false });
  const failing = resign(apply(none, [{ op: 'set-option', name: 'One zone', shape: { hosting: 'cloud', topology: 'single' } }, { op: 'set-option', name: 'Shape to be agreed', shape: { hosting: 'cloud' } }], agent));
  assert.deepEqual(E.compute(failing, { now: LATER }).options.list.map((o) => o.hardPass), [false, null]);
  assert.deepEqual(gate(failing, LATER).g2, { result: 'incomplete', missing: ['No option passes every hard check: OPT-02 fails one, OPT-03 has checks that cannot run yet.'] });
  assert.deepEqual(gate(resign(apply(failing, [OPTION], agent)), LATER), APPROVED, 'one passing option is enough');
  const unscoped = resign(apply(approvedState(), [{ op: 'open', entry: 'REL-05.1' }, exception('REL-05.1')]));
  assert.deepEqual(gate(unscoped, LATER).g2, { result: 'incomplete', missing: ['The DR strategy is unresolved for REL-05.1 (no failure scope named); name each failure scope and give it an RTO and an RPO.'] }, 'the exception lifts DT-03, not the scope');
  const region = resign(apply(approvedState(), [
    { op: 'set', entry: 'REL-05.1', value: 'region' }, { op: 'confirm', entry: 'REL-05.1' }, { op: 'open', entry: 'REL-03.1' },
    exception('REL-05.1'), exception('REL-03.1'), { op: 'set-option', option: 'OPT-01', shape: { topology: 'regional', dr: 'warm' } },
  ]));
  assert.deepEqual(gate(region, LATER).g2, { result: 'incomplete', missing: ['The DR strategy is unresolved for REL-05.1 (region); name each failure scope and give it an RTO and an RPO.'] });
  const scopes = resign(apply(approvedState(), [
    { op: 'open', entry: 'REL-05.1' }, exception('REL-05.1'),
    { op: 'add', row: 'REL-05' }, { op: 'set', entry: 'REL-05.2', value: 'region' }, { op: 'confirm', entry: 'REL-05.2' }, exception('REL-05.2'),
    { op: 'set', entry: 'REL-03.1', scope: 'az' }, { op: 'confirm', entry: 'REL-03.1' },
    { op: 'set-option', option: 'OPT-01', shape: { topology: 'regional', dr: 'warm' } },
  ]));
  assert.deepEqual(gate(scopes, LATER).g2, { result: 'incomplete', missing: ['The DR strategy is unresolved for REL-05.1 (no failure scope named), REL-05.2 (region); name each failure scope and give it an RTO and an RPO.'] }, 'every unresolved scope, in one line');
  const na = migrating([{ op: 'na', entry: 'OVL-04.1', reason: 'Decided per wave later' }]);
  assert.deepEqual(gate(na, LATER).g2, { result: 'incomplete', missing: ['No 7R strategy (OVL-04) is held for WL-01; every migration workload needs one.'] });
  const two = approvedState();
  Object.assign(two.register.overlay, { applies: true, source: 'onprem' });
  two.register.overlay.workloads.push({ id: 'WL-02', name: 'Billing' });
  const second = resign(apply(two, [
    { op: 'set', entry: 'OVL-04.1', value: 'Rehost' }, { op: 'add', row: 'OVL-04', workload: 'WL-02' }, exception('OVL-04.2'),
    ...assign(E.OVERLAY_FIELDS), { op: 'set', entry: 'OVL-04.2', owner_name: 'Dana Reyes', due: '2026-12-01' },
  ]));
  assert.deepEqual(E.compute(second, { now: LATER }).validation.blockers, [], 'the exception on OVL-04.2 lifts DT-11 for WL-02');
  assert.deepEqual(gate(second, LATER).g2, { result: 'incomplete', missing: ['No 7R strategy (OVL-04) is held for WL-02; every migration workload needs one.'] }, 'but not the G2 condition');
  const all = resign(apply(none, [{ op: 'open', entry: 'REL-05.1' }, exception('REL-05.1')]));
  assert.deepEqual(gate(all, LATER).g2.missing, ['The DR strategy is unresolved for REL-05.1 (no failure scope named); name each failure scope and give it an RTO and an RPO.', 'No option is recorded; G2 needs at least one option that passes every hard check.'], 'each failing condition is named');
});

test('gateStatus_g2Blocker_labelBlocked', () => {
  const state = resign(apply(approvedState(), [{ op: 'open', entry: 'SEC-04.1' }]));
  assert.deepEqual(gate(state, LATER), { ...APPROVED, g2: { result: 'blocker', missing: ['OPEN-SEC-04.1'] }, g3: { status: 'Blocked', missingRoles: [], problems: ['Validation blockers remain: OPEN-SEC-04.1.', 'G2 is not met: it ends in a blocker.'] }, label: 'Blocked', authorized: false });
  const unticked = resign(apply(state, [{ op: 'check', id: 'G3-11', status: 'Open' }]));
  assert.deepEqual(gate(unticked, LATER).g2.missing, ['OPEN-SEC-04.1', 'DT-15-BLOCK'], 'DT-15 is a blocker like the others');
  const conflict = approvedState();
  Object.assign(conflict.decisions, { topology_override: 'single', override_reason: 'One zone by contract' });
  const accepted = resign(conflict);
  assert.deepEqual(E.compute(accepted, { now: LATER }).validation.conflicts.map((x) => x.id), ['CONFLICT-zone@az']);
  assert.deepEqual(gate(accepted, LATER), APPROVED, 'a conflict accepted at G3-11 is no blocker');
  const open = resign(apply(accepted, [{ op: 'check', id: 'G3-11', status: 'Open' }]));
  assert.deepEqual(gate(open, LATER).g2, { result: 'blocker', missing: ['DT-15-BLOCK'] });
  const blank = E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW });
  const model = E.compute(blank, { now: NOW });
  const got = E.gateStatus(blank, model, { now: NOW });
  assert.deepEqual(got.g2, { result: 'blocker', missing: model.validation.blockers.map((b) => b.id) });
  assert.deepEqual([got.g0.met, got.g1.met, got.label, got.authorized], [false, false, 'Blocked', false], 'Blocked comes before Draft');
});

test('gateStatus_criticalEntryEstimated_notSigned', () => {
  const state = resign(apply(approvedState(), [{ op: 'set', entry: 'REL-01.1', value: 99.95 }]));
  assert.equal(E.primaryEntry(state, 'REL-01').status, 'Estimated');
  assert.deepEqual(gate(state, LATER), { ...APPROVED, g3: { status: 'Not signed', missingRoles: [], problems: [`Critical entry REL-01.1 is Estimated; ${TAIL}`] }, label: 'G2', authorized: false });
  const critical = (s) => gate(s, LATER).g3.problems.filter((p) => p.startsWith('Critical entry '));
  assert.deepEqual(critical(E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW })), CRITICAL.map((id) => `Critical entry ${id} is Open without a valid exception; ${TAIL}`), 'the rows the v2.2 critical list maps to');
  const edited = (edit) => {
    const s = approvedState();
    edit(s);
    return critical(resign(s));
  };
  assert.deepEqual(edited((s) => { E.primaryEntry(s, 'CAP-01').confirmed_by = '  '; }), [`Critical entry CAP-01.1 is Confirmed without who and when; ${TAIL}`]);
  assert.deepEqual(edited((s) => { E.primaryEntry(s, 'CAP-01').confirmed_at = '2026-10-23'; }), [`Critical entry CAP-01.1 is Confirmed without who and when; ${TAIL}`]);
  assert.deepEqual(edited((s) => { Object.assign(E.primaryEntry(s, 'DAT-01'), { status: 'N/A', na_reason: null }); }), [`Critical entry DAT-01.1 is N/A without a reason; ${TAIL}`]);
  assert.deepEqual(edited((s) => { E.primaryEntry(s, 'INT-08').status = 'Pending'; }), [`Critical entry INT-08.1 is "Pending"; ${TAIL}`]);
  assert.deepEqual(critical(resign(apply(approvedState(), [{ op: 'na', entry: 'CAP-07.1', reason: 'No interactive journey in this phase' }]))), [], 'N/A with a reason passes');
  const added = resign(apply(approvedState(), [{ op: 'add', row: 'REL-01', label: 'Refund status page' }, { op: 'set', entry: 'REL-01.2', value: 99.5, owner_name: 'Dana Reyes', due: '2026-12-01' }]));
  assert.deepEqual(critical(added), [`Critical entry REL-01.2 is Estimated; ${TAIL}`], 'every entry of a critical row');
  const policyConfirmed = resign(apply(apply(approvedState(), [{ op: 'set-policy', policy: { label: 'test-run policy', stand_ins: [] } }, { op: 'set', entry: 'REL-01.1', value: 99.95 }]), [{ op: 'confirm', entry: 'REL-01.1' }], policy));
  assert.equal(E.primaryEntry(policyConfirmed, 'REL-01').confirmed_by, POLICY_LABEL);
  assert.deepEqual(critical(policyConfirmed), [], 'a confirmation with who and when, from an answer policy too');
});

test('gateStatus_criticalOpenWithValidException_passes', () => {
  const opened = apply(approvedState(), [{ op: 'open', entry: 'CAP-07.1' }]);
  assert.deepEqual(gate(resign(opened), LATER).g3, { status: 'Not signed', missingRoles: [], problems: [`Critical entry CAP-07.1 is Open without a valid exception; ${TAIL}`] });
  const excepted = resign(apply(opened, [exception('CAP-07.1')]));
  assert.deepEqual(gate(excepted, LATER), APPROVED);
  assert.deepEqual(gate(excepted, '2027-01-01T00:30:00+01:00'), APPROVED, 'the UTC date of now is 2026-12-31, the expiry date');
  assert.equal(E.compute(excepted, { now: '2027-01-01T00:00:00Z' }).gate.g3.status, 'Not signed', 'compute gives the gate its own now');
  assert.deepEqual(gate(excepted, '2027-01-01T00:00:00Z').g3, { status: 'Not signed', missingRoles: [], problems: [`Critical entry CAP-07.1 is Open without a valid exception; ${TAIL} EXC-01 does not lift it: an exception counts only when a named person granted it, it expires on or after 2027-01-01, and its review date is on or before its expiry.`] });
  const estimated = resign(apply(approvedState(), [{ op: 'set', entry: 'CAP-07.1', value: 250 }, exception('CAP-07.1')]));
  assert.deepEqual(gate(estimated, LATER).g3.problems, [`Critical entry CAP-07.1 is Estimated; ${TAIL}`], 'an exception lifts only an Open entry');
});

test('gateStatus_criticalFactorEstimated_notSigned', () => {
  const factorText = (id, status) => `Critical factor ${id} is ${status}; G3 needs it Confirmed with who and when, or its entry N/A with a reason or Open under a valid exception.`;
  const storeKind = (value) => ({ op: 'set-factor', entry: 'DAT-01.1', factor: 'storeKind', value });
  const state = resign(apply(approvedState(), [storeKind('document')]));
  const entry = E.primaryEntry(state, 'DAT-01');
  assert.deepEqual([entry.status, entry.confirmed_by, entry.confirmed_at, entry.factors.storeKind.status], ['Confirmed', 'Mahmoud', NOW, 'Estimated']);
  assert.deepEqual(gate(state, LATER), { ...APPROVED, g3: { status: 'Not signed', missingRoles: [], problems: [factorText('DAT-01.1.storeKind', 'Estimated')] }, label: 'G2', authorized: false });
  const critical = (s, now = LATER) => gate(s, now).g3.problems.filter((p) => p.startsWith('Critical '));
  const both = resign(apply(approvedState(), [{ op: 'set', entry: 'DAT-01.1', value: 'Refund ledger and its audit trail' }, storeKind('document')]));
  assert.deepEqual(critical(both), [`Critical entry DAT-01.1 is Estimated; ${TAIL}`, factorText('DAT-01.1.storeKind', 'Estimated')], 'the entry and its factor each get a line');
  const blank = E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW });
  assert.deepEqual(critical(blank, NOW), CRITICAL.flatMap((id) => [`Critical entry ${id} is Open without a valid exception; ${TAIL}`, ...(id === 'DAT-01.1' ? [factorText('DAT-01.1.storeKind', 'Open')] : [])]));
  const na = resign(apply(approvedState(), [storeKind('document'), { op: 'na', entry: 'DAT-01.1', reason: 'No data store in this phase' }]));
  assert.deepEqual(critical(na), [], 'an entry N/A with a reason passes with its factor');
  const excepted = resign(apply(approvedState(), [storeKind('document'), { op: 'open', entry: 'DAT-01.1' }, exception('DAT-01.1')]));
  assert.deepEqual(critical(excepted), [], 'an entry Open under a valid exception passes with its factor');
  const open = resign(apply(approvedState(), [storeKind('document'), { op: 'open', entry: 'DAT-01.1' }]));
  assert.deepEqual(critical(open), [`Critical entry DAT-01.1 is Open without a valid exception; ${TAIL}`, factorText('DAT-01.1.storeKind', 'Estimated')]);
  const edited = (edit) => {
    const s = approvedState();
    edit(E.primaryEntry(s, 'DAT-01').factors);
    return critical(resign(s));
  };
  assert.deepEqual(edited((f) => { f.storeKind.confirmed_by = '  '; }), [factorText('DAT-01.1.storeKind', 'Confirmed without who and when')]);
  assert.deepEqual(edited((f) => { f.storeKind.confirmed_at = '2026-10-23'; }), [factorText('DAT-01.1.storeKind', 'Confirmed without who and when')]);
  assert.deepEqual(edited((f) => { f.storeKind.status = 'Pending'; }), [factorText('DAT-01.1.storeKind', '"Pending"')]);
  assert.deepEqual(edited((f) => { delete f.storeKind; }), [factorText('DAT-01.1.storeKind', 'missing')]);
  const added = resign(apply(approvedState(), [{ op: 'add', row: 'DAT-01', label: 'Reporting store' }, { op: 'set', entry: 'DAT-01.2', value: 'Refund reports' }, { op: 'confirm', entry: 'DAT-01.2' }]));
  assert.deepEqual(critical(added), [factorText('DAT-01.2.storeKind', 'Open')], 'every entry of the row');
  const read = E.V22_FIELD_MAP.fields.dataConsistency;
  try {
    read.factor = 'transactionNeed';
    assert.deepEqual(critical(approvedState(), NOW), [factorText('DAT-05.1.transactionNeed', 'Open')], 'the pairs come from the critical list through V22_FIELD_MAP');
  } finally {
    delete read.factor;
  }
  assert.deepEqual(gate(approvedState()), APPROVED);
});

test('gateStatus_noGateMet_labelDraft', () => {
  const state = resign(apply(approvedState(), [{ op: 'open', entry: 'HDR-04.1' }]));
  assert.deepEqual(gate(state, LATER), {
    g0: { met: false, missing: ['HDR-04.1 is Open.'] },
    g1: { met: false, missing: ['G0 is not met.'] },
    g2: { result: 'incomplete', missing: ['G0 is not met.'] },
    g3: { status: 'Not signed', missingRoles: [], problems: ['G0 is not met.'] },
    label: 'Draft',
    authorized: false,
  });
  const rows = ['HDR-02.1', 'HDR-04.1', 'BUS-01.1', 'BUS-03.1'];
  const all = resign(apply(approvedState(), [...rows.map((entry) => ({ op: 'open', entry })), exception('HDR-02.1'), exception('BUS-01.1')]));
  assert.deepEqual(E.compute(all, { now: LATER }).validation.blockers, [], 'the exceptions lift DT-01');
  assert.deepEqual([gate(all, LATER).g0.missing, gate(all, LATER).label], [rows.map((id) => `${id} is Open.`), 'Draft']);
  const na = resign(apply(approvedState(), [{ op: 'na', entry: 'BUS-03.1', reason: 'The BRD fixes the scope' }]));
  assert.deepEqual(gate(na, LATER), APPROVED, 'N/A is not Open');
  const extra = approvedState();
  extra.register.items['BUS-03'].push({ ...structuredClone(E.primaryEntry(extra, 'BUS-03')), n: 2, primary: false, value: null, status: 'Open', source: { type: 'none', text: '' }, confirmed_by: null, confirmed_at: null });
  assert.deepEqual(gate(resign(extra), LATER).g0, { met: false, missing: ['BUS-03.2 is Open.'] }, 'every entry of a G0 row');
  const both = resign(apply(state, [{ op: 'set', entry: 'OPS-01.1', due: '' }]));
  assert.deepEqual(gate(both, LATER).g1, { met: false, missing: ['G0 is not met.', 'OPS-01.1 is Open without a due date (YYYY-MM-DD).'] });
});

test('gateStatus_reviewBeatsNotSigned_precedence', () => {
  const critical = `Critical entry REL-01.1 is Estimated; ${TAIL}`;
  const state = apply(approvedState(), [{ op: 'set', entry: 'REL-01.1', value: 99.95 }], person, LATER);
  assert.deepEqual(gate(state, LATER).g3, { status: 'Review', missingRoles: [], problems: [staleText(ROLES), critical] });
  const missing = structuredClone(state);
  missing.gate.signoffs = missing.gate.signoffs.filter((x) => x.role !== 'network_owner');
  const others = ROLES.filter((key) => key !== 'network_owner');
  assert.deepEqual(gate(missing, LATER).g3, { status: 'Review', missingRoles: ['network_owner'], problems: [staleText(others), 'Network owner has not signed.', critical] });
  const rejected = apply(missing, [{ op: 'sign', role: 'data_owner', decision: 'Rejected' }], person, LATER);
  assert.deepEqual(gate(rejected, LATER).g3, { status: 'Blocked', missingRoles: ['network_owner'], problems: ['Data owner is Rejected, signed by Mahmoud.', staleText(others.filter((key) => key !== 'data_owner')), 'Network owner has not signed.', critical] }, 'Blocked comes before both');
  const g1 = apply(state, [{ op: 'set', entry: 'OPS-01.1', due: '' }], person, LATER);
  assert.deepEqual(gate(g1, LATER).g3, { status: 'Review', missingRoles: [], problems: [staleText(ROLES), 'G1 is not met.', critical] }, 'Review comes before an earlier gate not met');
});

test('gateStatus_doesNotMutate', () => {
  const busy = withStandIn();
  busy.gate.signoffs = busy.gate.signoffs.filter((x) => x.role !== 'network_owner');
  busy.gate.reopened = { at: LATER, by: 'E2E Architect', reason: 'Chunk 05 changed' };
  delete busy.gate.checklist['G3-14'];
  busy.gate.conditions.push({ id: 'COND-01', text: 'Load test before go-live', owner: null, due: null });
  E.primaryEntry(busy, 'REL-01').status = 'Estimated';
  for (const state of [busy, approvedState()]) {
    const model = E.compute(state, { now: LATER });
    const want = E.gateStatus(state, model, { now: LATER });
    const frozenState = deepFreeze(structuredClone(state));
    const frozenModel = deepFreeze(structuredClone(model));
    const before = JSON.stringify([frozenState, frozenModel]);
    assert.deepEqual(E.gateStatus(frozenState, frozenModel, { now: LATER }), want);
    assert.equal(JSON.stringify([frozenState, frozenModel]), before);
    assert.deepEqual(E.gateStatus(state, model, { now: LATER }), want, 'the same result again');
  }
  assert.equal(E.gateStatus(busy, E.compute(busy, { now: LATER }), { now: LATER }).g3.status, 'Blocked');
});

test('sign_policyOverPersonSignoff_refused', () => {
  const state = apply(approvedState(), [SET_POLICY]);
  const tail = "an answer policy's stand-in never replaces a person's sign-off, so ask Mahmoud.";
  refused(state, { op: 'sign', role: 'business_sponsor', decision: 'Approved with conditions' }, policy, `business_sponsor was signed by Mahmoud; ${tail}`);
  refused(state, { op: 'sign', role: 'business_sponsor', applicable: false, reason: 'The sponsor delegated it' }, policy, 'A stand-in never marks a role not applicable, because it signs only when its conditions hold; ask the person who holds business_sponsor to mark it not applicable.');
  const marked = apply(state, [{ op: 'sign', role: 'network_owner', applicable: false, reason: 'No network change' }]);
  refused(marked, { op: 'sign', role: 'network_owner', decision: 'Approved' }, policy, `network_owner was marked not applicable by Mahmoud; ${tail}`);
  const unflagged = structuredClone(state);
  delete unflagged.gate.signoffs[0].stand_in;
  refused(unflagged, { op: 'sign', role: 'business_sponsor', decision: 'Approved' }, policy, `business_sponsor was signed by Mahmoud; ${tail}`);
  const standIn = withStandIn();
  const again = apply(standIn, [{ op: 'sign', role: 'finance_procurement', decision: 'Approved with conditions' }], policy, LATER);
  assert.deepEqual(again.gate.signoffs.at(-1), { role: 'finance_procurement', applicable: true, na_reason: null, name: STAND_IN, decision: 'Approved with conditions', at: LATER, content_hash: E.contentHash(again), stand_in: true }, "the stand-in replaces a stand-in's record");
  const byPerson = apply(standIn, signOps(['finance_procurement']), person, LATER);
  assert.deepEqual([byPerson.gate.signoffs.at(-1).name, byPerson.gate.signoffs.at(-1).stand_in], ['Mahmoud', false], "a person replaces a stand-in's record");
  const other = apply(state, signOps(['business_sponsor'], 'Rejected'), { type: 'person', name: 'Jane Doe', label: '' }, LATER);
  assert.deepEqual([other.gate.signoffs[0].name, other.gate.signoffs[0].decision], ['Jane Doe', 'Rejected'], "a person replaces another person's record");
});

test('sign_personOverStandIn_replacesRecord', () => {
  const standIn = withStandIn();
  const own = (state) => state.gate.signoffs.filter((x) => x.role === 'finance_procurement');
  assert.deepEqual(own(standIn).map((x) => [x.name, x.stand_in]), [[STAND_IN, true]]);
  const signed = apply(standIn, signOps(['finance_procurement']), person, LATER);
  assert.deepEqual(own(signed), [{ role: 'finance_procurement', applicable: true, na_reason: null, name: 'Mahmoud', decision: 'Approved', at: LATER, content_hash: E.contentHash(signed), stand_in: false }], "the role holds one record, the person's");
  assert.deepEqual([signed.gate.signoffs.length, signed.gate.signoffs.map((x) => x.role)], [standIn.gate.signoffs.length, standIn.gate.signoffs.map((x) => x.role)], 'the record is replaced in place');
  assert.deepEqual([signed.history.at(-1).from, signed.history.at(-1).to], [own(standIn)[0], own(signed)[0]]);
  assert.deepEqual(gate(signed, LATER), APPROVED);
  refused(signed, { op: 'sign', role: 'finance_procurement', decision: 'Approved with conditions' }, policy, "finance_procurement was signed by Mahmoud; an answer policy's stand-in never replaces a person's sign-off, so ask Mahmoud.");
});

test('check_policyOverPersonTick_refused', () => {
  const state = apply(approvedState(), [SET_POLICY]);
  const message = "A G3 checklist line is a person's attestation; an answer policy never ticks it. Ask the person who owns the line.";
  for (const op of [{ status: 'Done' }, { status: 'N/A', reason: 'Covered by the platform review' }, { status: 'Open' }]) refused(state, { op: 'check', id: 'G3-05', ...op }, policy, message);
  const byFixture = apply(state, [{ op: 'check', id: 'G3-09', status: 'N/A', reason: 'Greenfield: no existing estate' }], fixture);
  assert.equal(byFixture.gate.checklist['G3-09'].by, FIXTURE_LABEL);
  refused(byFixture, { op: 'check', id: 'G3-09', status: 'Done' }, policy, message);
  const cleared = apply(state, [{ op: 'check', id: 'G3-12', status: 'Open' }]);
  refused(cleared, { op: 'check', id: 'G3-12', status: 'Done' }, policy, message);
  const byPolicy = structuredClone(state);
  byPolicy.gate.checklist['G3-12'].by = POLICY_LABEL;
  refused(byPolicy, { op: 'check', id: 'G3-12', status: 'N/A', reason: 'No ADR in this phase' }, policy, message);
  assert.equal(Object.hasOwn(apply(byPolicy, [{ op: 'check', id: 'G3-12', status: 'Open' }], person).gate.checklist, 'G3-12'), false, "a person changes a policy's tick");
});
