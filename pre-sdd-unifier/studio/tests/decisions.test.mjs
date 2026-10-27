import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine } from './helpers.mjs';
import { validateAllWithSchema } from './pyschema.mjs';

const E = loadEngine();
const schemaPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'schema', 'project-state.schema.json');
const NOW = '2026-10-26T10:00:00Z';
const LATER = '2026-10-27T09:00:00Z';
const BRD = { key: 'REFUNDS', path: '../brd-refunds-portal/refunds-portal-brd-master.md', version: '1.5', status: 'Draft' };
const person = { type: 'person', name: 'Mahmoud', label: '' };
const agent = { type: 'agent', name: 'E2E Architect', label: '' };
const policy = { type: 'policy', name: 'test-run policy', label: 'test-run policy' };
const fixture = { type: 'fixture', name: 'Dana Reyes', label: '' };
const PERSON = { type: 'person', name: 'Mahmoud', label: 'Mahmoud' };
const AGENT = { type: 'agent', name: 'E2E Architect', label: 'E2E Architect' };
const FIXTURE_LABEL = 'Fixture: Dana Reyes (test-run policy)';
const SET_POLICY = { op: 'set-policy', policy: { label: 'test-run policy', stand_ins: ['Approver'] } };
const OPTION = { op: 'set-option', name: 'One region, multi-AZ', shape: { hosting: 'cloud', topology: 'multiAZ' } };
const ON_PREM = { op: 'set', entry: 'HDR-08.1', value: 'onprem', kind: 'hard', reason: 'The sponsor mandates on-prem hosting' };
const DECIDED = { op: 'decide', topology: 'regional', dr: { region: 'warm', az: 'pilot' }, reason: 'The owner wants a warm standby' };
const CITE = { type: 'brd', text: 'BRD: REFUNDS/MIG-01' };
const SIGN_NEEDS = 'Sign-off needs a person, or an answer policy whose stand_ins include Approver; an agent or a fixture never signs.';

const MSG = {
  checkPolicy: "A G3 checklist line is a person's attestation; an answer policy never ticks it. Ask the person who owns the line.",
  decideAgent: 'An agent never decides; the person decides in stage 4. Record the question as an unknown.',
  decidePolicyOverride: "An answer policy never sets an override, because an override is a person's deviation from the engine's shape; ask the person who decides in stage 4.",
  decidePolicyOption: 'An answer policy never chooses an option, because the engine computes no recommended option for it to take; ask the person who decides in stage 4.',
  decideEmpty: 'decide takes at least one of topology, dr, reason and option.',
  reasonAlone: 'There is no override to give a reason for; give the reason together with a topology or DR override.',
  needsReason: (held) => `An override needs its reason: say why the decision departs from the engine's shape (${held}).`,
  runEmpty: 'set-run takes at least one of mode, input, light, stage and group.',
  runOwner: (who) => `The run mode, input and light are the owner's choices; ${who} never changes them. Ask the person who owns the run.`,
  quickAbove: (stage) => `Quick mode is full mode stopped after stage 1, so the run cannot move to stage ${stage}; switch to full first with set-run mode full.`,
  fullToQuick: (stage) => `The run is at stage ${stage}, past stage 1, so it cannot switch to quick mode, which stops after stage 1; keep full mode.`,
  overlayPolicy: 'An answer policy never switches the migration overlay; ask the person who owns the migration.',
  overlayEmpty: 'set-overlay takes applies, source or both.',
  citeNeeded: "An agent cites its source: cite { type: brd, derived, default, import, text }, for example { type: 'brd', text: 'BRD: REFUNDS/MIG-01' }.",
  citeNotAgent: 'Only an agent cites a source; a person or a fixture owner is the source of their own answer.',
  workloadName: 'A workload needs a name, for example Billing.',
  workloadUnknown: (id) => `No workload has the ID ${JSON.stringify(id)}; workload IDs read like WL-01.`,
  workloadLast: (id) => `${id} is the only workload, and the overlay keeps at least one; rename it instead, or switch the overlay off with set-overlay.`,
  workloadPrimary: (id) => `${id} holds the primary entries of the overlay rows, which every row keeps, so it stays; rename it instead.`,
  workloadHeld: (id, ids) => `${id} has entries that hold answers (${ids}); keep the workload and mark them N/A instead.`,
  brdAgent: 'Record a new BRD version after the owner approves the update.',
  brdPolicy: 'An answer policy never records a BRD; record a new BRD version after the owner approves the update.',
  brdLast: (key) => `${key} is the only BRD, and the Pre-SDD derives from at least one; add the BRD that replaces it first, then remove ${key}.`,
  versionPolicy: 'An answer policy never sets the Pre-SDD version; the skill or a person bumps it once per update.',
  versionFormat: (got) => `The Pre-SDD version reads major.minor, for example 1.1; got ${got}.`,
  versionLow: (v, cur, next) => `The Pre-SDD version only goes up: ${v} is not above the current ${cur}; give a higher version, for example ${next}.`,
  naPolicy: (id) => `An answer policy never marks an item N/A; ask the person who owns ${id} to mark it N/A with the reason.`,
  closePolicy: (id, owner) => `An answer policy never closes an unknown; ask the person who owns ${id}${owner} to answer it.`,
  ownerFields: (id, who) => `The owner name and due date of ${id} are a person's assignment in stage 2; ${who} never writes them. Ask the person who assigns the owners.`,
  addCondition: (who) => `${who} never adds a condition; a condition comes from a signer or the owner, so ask the person to add it.`,
  setCondition: (who) => `${who} never changes a condition; a condition comes from a signer or the owner, so ask the person to change it.`,
  removeCondition: (who) => `${who} never removes a condition; a condition comes from a signer or the owner, so ask the person to remove it.`,
  conditionUnknown: (id) => `No condition has the ID ${JSON.stringify(id)}; condition IDs read like COND-01.`,
  standInNa: (role) => `A stand-in never marks a role not applicable, because it signs only when its conditions hold; ask the person who holds ${role} to mark it not applicable.`,
  scorePolicy: (doing) => `Scores are the architect's assessment, which a person confirms (decision 6); an answer policy never ${doing} a score. Ask the person who confirms the scores.`,
  exclude: (who) => `${who} never excludes an option; the person checks the hard constraints at G2, so ask them to exclude it.`,
  include: (who) => `${who} never includes an excluded option again; the person checks the hard constraints at G2, so ask them to include it.`,
  removeOption: (who) => `${who} never removes an option; ask the person who owns the option list to remove it.`,
  optionUnknown: (id) => `Unknown option ${JSON.stringify(id)}; option IDs read like OPT-01.`,
  chosen: (id, doing) => `${id} is the chosen option; clear the choice first with decide (option: null), then ${doing} it.`,
  notExcluded: (id) => `${id} is not excluded, so there is nothing to include; exclude-option marks an option that breaks a hard entry.`,
  excludeReason: 'Excluding an option needs its reason: say how the option breaks the entry.',
  revokeWho: 'Only a named person revokes an exception, never an agent, an answer policy, a stand-in or a fixture.',
  revokeReason: 'Revoking an exception needs its reason.',
  exceptionUnknown: (id) => `No exception has the ID ${JSON.stringify(id)}; exception IDs read like EXC-01.`,
};

const fresh = (extra = {}) => E.newState({ name: 'Refunds platform', slug: 'refunds-platform', brds: [BRD], now: NOW, ...extra });
const withPolicy = () => apply(fresh(), [SET_POLICY]);
const entry = (state, id) => {
  const { rowId, n } = E.parseEntryId(id);
  return E.rowEntries(state, rowId).find((e) => e.n === n);
};
const options = (state) => E.computeOptions(state, E.compute(state, { now: NOW })).list;
const blockerIds = (state) => E.compute(state, { now: NOW }).validation.blockers.map((b) => b.id);

function apply(state, ops, actor = person, now = NOW) {
  const result = E.applyPatch(state, ops, actor, { now });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

function changesOf(state, ops, actor = person, now = NOW) {
  const result = E.applyPatch(state, ops, actor, { now });
  assert.deepEqual(result.errors, [], 'ops must apply');
  assert.deepEqual(result.state.history.slice(state.history.length), result.changes, 'history records the changes');
  return result;
}

function refused(state, op, actor, message) {
  const before = JSON.stringify(state);
  const result = E.applyPatch(state, [op], actor, { now: NOW });
  assert.deepEqual(result.errors.map((e) => [e.index, e.message]), [[0, message]]);
  assert.deepEqual(result.changes, []);
  assert.equal(JSON.stringify(result.state), before);
  assert.equal(JSON.stringify(state), before);
}

const CRITICAL = ['HDR-07.1', 'HDR-08.1', 'CAP-01.1', 'CAP-04.1', 'CAP-07.1', 'REL-01.1', 'REL-03.1', 'REL-04.1', 'REL-05.1', 'DAT-01.1', 'DAT-05.1', 'DAT-03.1', 'INT-08.1'];
const CRITICAL_VALUES = ['greenfield', 'cloud', 864000, 5, 300, 99.9, 600, 60, 'az', 'Refund ledger, the system of record', 'strong', 'sensitive', 'public'];
const ROLES = E.SIGNOFF_ROLES.filter((role) => !role.overlayOnly).map((role) => role.key);

function approvedState() {
  let state = E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW });
  state = apply(state, [
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
    ...CRITICAL.map((id, i) => ({ op: 'set', entry: id, value: CRITICAL_VALUES[i] })),
    { op: 'set-factor', entry: 'DAT-01.1', factor: 'storeKind', value: 'relational' },
  ]);
  state = apply(state, [...CRITICAL.map((id) => ({ op: 'confirm', entry: id })), { op: 'confirm', entry: 'DAT-01.1', factor: 'storeKind' }]);
  state = apply(state, [...E.HEADER_FIELDS, ...E.ITEMS].map((row) => ({ op: 'set', entry: `${row.id}.1`, owner_name: 'Dana Reyes', due: '2026-12-01' })));
  state = apply(state, [OPTION], agent);
  state = apply(state, E.G3_CHECKLIST.map((line) => ({ op: 'check', id: line.id, status: 'Done' })));
  return apply(state, ROLES.map((role) => ({ op: 'sign', role, decision: 'Approved' })));
}

test('applyPatch_checkByPolicy_refused', () => {
  const state = apply(withPolicy(), [{ op: 'check', id: 'G3-05', status: 'Done' }]);
  for (const line of E.G3_CHECKLIST) {
    for (const op of [{ status: 'Done' }, { status: 'N/A', reason: 'Covered by the platform review' }, { status: 'Open' }]) refused(state, { op: 'check', id: line.id, ...op }, policy, MSG.checkPolicy);
  }
  refused(state, { op: 'check', id: 'G3-99', status: 'Done' }, policy, MSG.checkPolicy);
  const ticked = apply(state, [{ op: 'check', id: 'G3-11', status: 'Done' }], fixture);
  assert.deepEqual(ticked.gate.checklist['G3-11'], { status: 'Done', na_reason: null, by: FIXTURE_LABEL, at: NOW });
  assert.equal(apply(state, [{ op: 'check', id: 'G3-05', status: 'Open' }]).gate.checklist['G3-05'], undefined);
});

test('applyPatch_decideByPerson_writesOverridesAndReason', () => {
  const { state, changes } = changesOf(fresh(), [{ ...DECIDED, reason: '  The owner wants a warm standby  ' }]);
  assert.deepEqual(state.decisions, { topology_override: 'regional', dr_overrides: { region: 'warm', az: 'pilot' }, override_reason: 'The owner wants a warm standby', chosen_option: null });
  assert.deepEqual(changes, [{ at: NOW, actor: PERSON, op: 'decide', target: 'decisions', from: { topology_override: 'auto', dr_overrides: {}, override_reason: '' }, to: { topology_override: 'regional', dr_overrides: { region: 'warm', az: 'pilot' }, override_reason: 'The owner wants a warm standby' }, reason: 'The owner wants a warm standby' }]);
  const byFixture = apply(fresh(), [{ op: 'decide', topology: ' single ', reason: 'One host is enough for the pilot' }], fixture);
  assert.deepEqual(byFixture.decisions, { topology_override: 'single', dr_overrides: {}, override_reason: 'One host is enough for the pilot', chosen_option: null });
  assert.equal(byFixture.history.at(-1).actor.label, FIXTURE_LABEL);
  const kept = changesOf(state, [{ op: 'decide', topology: 'undetermined' }]);
  assert.deepEqual(kept.state.decisions, { topology_override: 'auto', dr_overrides: { region: 'warm', az: 'pilot' }, override_reason: 'The owner wants a warm standby', chosen_option: null });
  assert.deepEqual([kept.changes[0].from, kept.changes[0].to, kept.changes[0].reason], [{ topology_override: 'regional' }, { topology_override: 'auto' }, null]);
  const reworded = apply(state, [{ op: 'decide', reason: 'The board asked for a warm standby' }]);
  assert.equal(reworded.decisions.override_reason, 'The board asked for a warm standby');
  assert.deepEqual(changesOf(state, [{ op: 'decide', topology: 'regional', dr: { region: 'warm' } }]).changes, [], 'the same overrides change nothing');
  assert.equal(E.contentHash(state) === E.contentHash(fresh()), false, 'decisions are inside the content hash');
  refused(fresh(), { op: 'decide' }, person, MSG.decideEmpty);
  refused(fresh(), { op: 'decide', topology: 'twoRegions', reason: 'x' }, person, 'topology is one of auto, single, multiAZ, multiAZActive, regional, active (blank, auto or undetermined means no override); got "twoRegions".');
  refused(fresh(), { op: 'decide', topology: 3, reason: 'x' }, person, 'topology is one of auto, single, multiAZ, multiAZActive, regional, active (blank, auto or undetermined means no override); got 3.');
  for (const dr of ['warm', ['warm'], null]) refused(fresh(), { op: 'decide', dr, reason: 'x' }, person, `dr maps failure scopes to DR strategies, for example { region: 'warm' }; got ${JSON.stringify(dr)}.`);
  refused(fresh(), { op: 'decide', dr: { planet: 'warm' }, reason: 'x' }, person, 'dr is keyed by failure scope, one of host, az, site, region, provider, cyber; got "planet".');
  refused(fresh(), { op: 'decide', dr: { region: 'localHA' }, reason: 'x' }, person, 'The DR override for region is one of backup, pilot, warm, active (blank, auto or undetermined removes it); got "localHA".');
});

test('applyPatch_decideOverrideWithoutReason_refused', () => {
  refused(fresh(), { op: 'decide', topology: 'regional' }, person, MSG.needsReason('topology override regional'));
  refused(fresh(), { op: 'decide', dr: { region: 'warm' }, reason: '  ' }, person, MSG.needsReason('DR override warm for region'));
  refused(fresh(), { op: 'decide', dr: { region: 'warm' }, reason: 7 }, person, MSG.needsReason('DR override warm for region'));
  const decided = apply(fresh(), [DECIDED]);
  refused(decided, { op: 'decide', dr: { site: 'backup' } }, person, MSG.needsReason('topology override regional; DR override warm for region; DR override pilot for az; DR override backup for site'));
  refused(decided, { op: 'decide', dr: { region: 'active' } }, person, MSG.needsReason('topology override regional; DR override active for region; DR override pilot for az'));
  refused(decided, { op: 'decide', topology: 'active' }, person, MSG.needsReason('topology override active; DR override warm for region; DR override pilot for az'));
  refused(decided, { op: 'decide', reason: '' }, person, MSG.needsReason('topology override regional; DR override warm for region; DR override pilot for az'));
  const held = structuredClone(fresh());
  held.decisions.dr_overrides.az = 'auto';
  refused(held, { op: 'decide', topology: 'regional' }, person, MSG.needsReason('topology override regional'));
  const reasonless = structuredClone(decided);
  reasonless.decisions.override_reason = '';
  refused(reasonless, { op: 'decide', option: null }, person, MSG.needsReason('topology override regional; DR override warm for region; DR override pilot for az'));
});

test('applyPatch_decideByAgent_refused', () => {
  const state = apply(fresh(), [OPTION], agent);
  for (const op of [DECIDED, { op: 'decide', option: 'OPT-01' }, { op: 'decide', option: null }, { op: 'decide' }]) refused(state, op, agent, MSG.decideAgent);
});

test('applyPatch_decideOverrideByPolicy_refused', () => {
  const state = withPolicy();
  for (const op of [DECIDED, { op: 'decide', topology: 'regional', reason: 'x' }, { op: 'decide', dr: { region: 'warm' }, reason: 'x' }, { op: 'decide', reason: 'x' }, { op: 'decide', topology: 'single', option: null, reason: 'x' }]) refused(state, op, policy, MSG.decidePolicyOverride);
  refused(state, { op: 'decide' }, policy, MSG.decideEmpty);
});

test('applyPatch_decideBlankDrKey_removesKey', () => {
  const decided = apply(fresh(), [DECIDED]);
  for (const blank of ['', '  ', null, 'auto', 'undetermined', ' auto ']) {
    const { state, changes } = changesOf(decided, [{ op: 'decide', dr: { az: blank } }]);
    assert.deepEqual(state.decisions, { topology_override: 'regional', dr_overrides: { region: 'warm' }, override_reason: 'The owner wants a warm standby', chosen_option: null }, JSON.stringify(blank));
    assert.deepEqual(changes.map((c) => [c.target, c.from, c.to, c.reason]), [['decisions', { dr_overrides: { region: 'warm', az: 'pilot' } }, { dr_overrides: { region: 'warm' } }, null]]);
  }
  assert.deepEqual(apply(decided, [{ op: 'decide', dr: { cyber: '' } }]).decisions, decided.decisions, 'a blank key that is not held changes nothing');
  assert.deepEqual(apply(decided, [{ op: 'decide', dr: { site: ' backup ' }, reason: 'Site loss needs backups' }]).decisions.dr_overrides, { region: 'warm', az: 'pilot', site: 'backup' });
});

test('applyPatch_decideAllCleared_clearsReason', () => {
  const decided = apply(apply(fresh(), [OPTION], agent), [DECIDED, { op: 'decide', option: 'OPT-01' }]);
  const { state, changes } = changesOf(decided, [{ op: 'decide', topology: '', dr: { region: null, az: 'auto' } }]);
  assert.deepEqual(state.decisions, { topology_override: 'auto', dr_overrides: {}, override_reason: '', chosen_option: 'OPT-01' });
  assert.deepEqual([changes[0].from, changes[0].to], [{ topology_override: 'regional', dr_overrides: { region: 'warm', az: 'pilot' }, override_reason: 'The owner wants a warm standby' }, { topology_override: 'auto', dr_overrides: {}, override_reason: '' }]);
  const why = apply(decided, [{ op: 'decide', topology: 'auto', dr: { region: '', az: '' }, reason: 'The engine shape is fine now' }]);
  assert.deepEqual([why.decisions.override_reason, why.history.at(-1).reason], ['', 'The engine shape is fine now']);
  const topologyOnly = apply(fresh(), [{ op: 'decide', topology: 'regional', reason: 'Regional by contract' }]);
  const back = changesOf(topologyOnly, [{ op: 'decide', topology: '', reason: 'Back to the engine shape' }]);
  assert.deepEqual([back.state.decisions.override_reason, back.changes[0].reason], ['', 'Back to the engine shape']);
  const drOnly = apply(fresh(), [{ op: 'decide', dr: { region: 'warm' }, reason: 'Warm by contract' }]);
  assert.equal(apply(drOnly, [{ op: 'decide', dr: { region: '' }, reason: 'Back to the engine shape' }]).decisions.override_reason, '');
  refused(fresh(), { op: 'decide', reason: 'Because' }, person, MSG.reasonAlone);
  refused(state, { op: 'decide', reason: 'Because', option: null }, person, MSG.reasonAlone);
  assert.deepEqual(changesOf(fresh(), [{ op: 'decide', reason: '  ' }]).changes, []);
});

test('applyPatch_decideOptionFailingHardConstraints_refused', () => {
  let state = apply(fresh(), [OPTION, { op: 'set-option', name: 'On-prem pair', shape: { hosting: 'onprem', topology: 'multiAZ' } }, { op: 'set-option', name: 'Not shaped yet' }], agent);
  state = apply(state, [ON_PREM]);
  assert.deepEqual(options(state).map((o) => [o.id, o.hardPass]), [['OPT-01', false], ['OPT-02', true], ['OPT-03', null]]);
  refused(state, { op: 'decide', option: 'OPT-01' }, person, 'OPT-01 cannot be chosen, because it fails a hard check (OPT-01 hosting cloud does not meet HDR-08.1 (hard): onprem); choose an option that passes every hard check, or change this one.');
  refused(state, { op: 'decide', option: 'OPT-03' }, person, 'OPT-03 cannot be chosen yet, because some hard checks cannot run (Hosting check (hard HDR-08: onprem): shape.hosting is blank); complete what they need, then choose it.');
  refused(state, { op: 'decide', option: 'OPT-09' }, person, MSG.optionUnknown('OPT-09'));
  const excluded = apply(state, [{ op: 'exclude-option', option: 'OPT-02', entry: 'DAT-04.1', reason: 'Hosts outside the EU.' }, { op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', reason: 'Hosts outside the EU' }]);
  refused(excluded, { op: 'decide', option: 'OPT-02' }, person, 'OPT-02 cannot be chosen, because it fails a hard check (Hosts outside the EU); choose an option that passes every hard check, or change this one.');
  refused(excluded, { op: 'decide', option: 'OPT-01' }, person, 'OPT-01 cannot be chosen, because it fails hard checks (OPT-01 hosting cloud does not meet HDR-08.1 (hard): onprem; Hosts outside the EU); choose an option that passes every hard check, or change this one.');
  const broken = structuredClone(state);
  broken.unknowns.push({ id: 'QD-01' });
  refused(broken, { op: 'decide', option: 'OPT-02' }, person, 'OPT-02 cannot be checked against the hard constraints: The project state cannot be read:\n- QD-01 has no status; add status: \'open\', or status: \'closed\' with its resolution, closed_by and closed_at.');
  const { state: chosen, changes } = changesOf(state, [{ op: 'decide', option: 'OPT-02' }]);
  assert.equal(chosen.decisions.chosen_option, 'OPT-02');
  assert.deepEqual([changes[0].from, changes[0].to], [{ chosen_option: null }, { chosen_option: 'OPT-02' }]);
  assert.equal(apply(chosen, [{ op: 'decide', option: null }]).decisions.chosen_option, null);
});

test('applyPatch_decideAfterSign_gateReview', () => {
  const signed = approvedState();
  assert.equal(E.gateStatus(signed, E.compute(signed, { now: NOW }), { now: NOW }).g3.status, 'Approved');
  const decided = apply(signed, [{ op: 'decide', option: 'OPT-01' }], person, LATER);
  const g3 = E.gateStatus(decided, E.compute(decided, { now: LATER }), { now: LATER }).g3;
  assert.deepEqual(g3, { status: 'Review', missingRoles: [], problems: [`Sign-off records given on other content (the content hash has changed since): ${ROLES.join(', ')}; sign again after the review.`] });
});

test('applyPatch_setRunStageByAgent_recorded', () => {
  const state = fresh();
  const { state: moved, changes } = changesOf(state, [{ op: 'set-run', stage: 2, group: 'SEC' }], agent);
  assert.deepEqual([moved.run.stage, moved.run.group], [2, 'SEC']);
  assert.deepEqual(changes, [{ at: NOW, actor: AGENT, op: 'set-run', target: 'run', from: { stage: 1, group: 'BUS' }, to: { stage: 2, group: 'SEC' }, reason: null }]);
  assert.equal(E.contentHash(moved), E.contentHash(state), 'run is outside the content hash');
  const byPolicy = apply(withPolicy(), [{ op: 'set-run', group: 'HDR' }, { op: 'set-run', stage: 4 }], policy);
  assert.deepEqual([byPolicy.run.group, byPolicy.run.stage], ['HDR', 4]);
  for (const group of ['OVL', null, 'ECO']) assert.equal(apply(state, [{ op: 'set-run', group }], agent).run.group, group);
  refused(state, { op: 'set-run' }, agent, MSG.runEmpty);
  for (const stage of [0, 5, 1.5, '2', null]) refused(state, { op: 'set-run', stage }, agent, `stage is a whole number from 1 to 4; got ${JSON.stringify(stage)}.`);
  for (const group of ['XYZ', 'bus', 3]) refused(state, { op: 'set-run', group }, agent, `group is one of BUS, SEC, DAT, INT, CAP, REL, OPS, ECO, HDR, OVL, or null; got ${JSON.stringify(group)}.`);
});

test('applyPatch_setRunModeByAgent_refused', () => {
  const state = withPolicy();
  for (const op of [{ mode: 'full' }, { input: 'web' }, { light: true }, { stage: 2, light: false }]) {
    refused(state, { op: 'set-run', ...op }, agent, MSG.runOwner('an agent'));
    refused(state, { op: 'set-run', ...op }, policy, MSG.runOwner('an answer policy'));
  }
  const { state: chosen, changes } = changesOf(state, [{ op: 'set-run', mode: 'quick', input: 'web', light: true }]);
  assert.deepEqual([chosen.run.mode, chosen.run.input, chosen.run.light], ['quick', 'web', true]);
  assert.deepEqual([changes[0].from, changes[0].to], [{ mode: 'full', input: 'prompt', light: false }, { mode: 'quick', input: 'web', light: true }]);
  assert.equal(apply(chosen, [{ op: 'set-run', mode: 'full' }], fixture).run.mode, 'full');
  refused(state, { op: 'set-run', mode: 'fast' }, person, 'mode is full or quick; got "fast".');
  refused(state, { op: 'set-run', input: 'chat' }, person, 'input is web or prompt; got "chat".');
  refused(state, { op: 'set-run', light: 'yes' }, person, 'light is true or false; got "yes".');
});

test('applyPatch_setRunQuickAboveStage1_refused', () => {
  const quick = fresh({ mode: 'quick' });
  refused(quick, { op: 'set-run', stage: 2 }, person, MSG.quickAbove(2));
  refused(quick, { op: 'set-run', stage: 3 }, agent, MSG.quickAbove(3));
  refused(fresh(), { op: 'set-run', mode: 'quick', stage: 2 }, person, MSG.quickAbove(2));
  assert.equal(apply(quick, [{ op: 'set-run', stage: 1, group: 'REL' }], agent).run.group, 'REL');
  const full = apply(quick, [{ op: 'set-run', mode: 'full', stage: 3 }]);
  assert.deepEqual([full.run.mode, full.run.stage], ['full', 3]);
});

test('applyPatch_setRunFullToQuickAfterStage1_refused', () => {
  const second = apply(fresh(), [{ op: 'set-run', stage: 2 }], agent);
  refused(second, { op: 'set-run', mode: 'quick' }, person, MSG.fullToQuick(2));
  refused(second, { op: 'set-run', mode: 'quick', stage: 1 }, person, MSG.fullToQuick(2));
  refused(apply(fresh(), [{ op: 'set-run', stage: 4 }], agent), { op: 'set-run', mode: 'quick' }, fixture, MSG.fullToQuick(4));
  assert.equal(apply(fresh(), [{ op: 'set-run', mode: 'quick' }]).run.mode, 'quick');
  assert.equal(apply(second, [{ op: 'set-run', mode: 'full' }]).run.mode, 'full');
});

test('applyPatch_setOverlayByPerson_appliesAndSource', () => {
  const state = fresh();
  const { state: on, changes } = changesOf(state, [{ op: 'set-overlay', applies: true, source: 'onprem' }]);
  assert.deepEqual([on.register.overlay.applies, on.register.overlay.source], [true, 'onprem']);
  assert.deepEqual(changes, [{ at: NOW, actor: PERSON, op: 'set-overlay', target: 'register.overlay', from: { applies: false, source: 'unknown' }, to: { applies: true, source: 'onprem' }, reason: null }]);
  const answered = apply(on, [{ op: 'set', entry: 'OVL-04.1', value: 'Rehost' }]);
  const off = apply(answered, [{ op: 'set-overlay', applies: false }], fixture);
  assert.deepEqual([off.register.overlay.applies, off.register.overlay.source], [false, 'onprem']);
  assert.deepEqual(off.register.overlay.rows, answered.register.overlay.rows, 'turning the overlay off keeps its entries');
  assert.equal(apply(state, [{ op: 'set-overlay', source: 'mixed' }]).register.overlay.source, 'mixed');
  refused(state, { op: 'set-overlay' }, person, MSG.overlayEmpty);
  refused(state, { op: 'set-overlay', cite: CITE }, agent, MSG.overlayEmpty);
  refused(state, { op: 'set-overlay', applies: 'yes' }, person, 'applies is true or false; got "yes".');
  refused(state, { op: 'set-overlay', source: 'aws' }, person, 'source is one of unknown, onprem, samecloud, othercloud, mixed; got "aws".');
  refused(state, { op: 'set-overlay', applies: true, cite: CITE }, person, MSG.citeNotAgent);
  refused(withPolicy(), { op: 'set-overlay', applies: true }, policy, MSG.overlayPolicy);
});

test('applyPatch_setOverlayByAgentWithCite_recorded', () => {
  const { state, changes } = changesOf(fresh(), [{ op: 'set-overlay', applies: true, source: 'samecloud', cite: { type: 'brd', text: '  BRD: REFUNDS/MIG-01 ' } }], agent);
  assert.deepEqual([state.register.overlay.applies, state.register.overlay.source], [true, 'samecloud']);
  assert.deepEqual(changes, [{ at: NOW, actor: AGENT, op: 'set-overlay', target: 'register.overlay', from: { applies: false, source: 'unknown' }, to: { applies: true, source: 'samecloud' }, reason: 'Cited (brd): BRD: REFUNDS/MIG-01' }]);
  for (const cite of [undefined, null, 'BRD: REFUNDS/MIG-01', { type: 'answer', text: 'Mahmoud' }, { type: 'brd', text: '  ' }, { type: 'brd' }]) refused(fresh(), { op: 'set-overlay', applies: true, ...(cite === undefined ? {} : { cite }) }, agent, MSG.citeNeeded);
});

test('applyPatch_addWorkload_nextIdAndOvlEntries', () => {
  const { state, changes } = changesOf(fresh(), [{ op: 'add-workload', name: ' Billing ' }], agent);
  assert.deepEqual(state.register.overlay.workloads, [{ id: 'WL-01', name: '' }, { id: 'WL-02', name: 'Billing' }]);
  for (const row of E.OVERLAY_FIELDS) {
    const list = state.register.overlay.rows[row.id];
    assert.deepEqual(list.map((e) => [e.n, e.primary, e.workload, e.status, e.value]), [[1, true, 'WL-01', 'Open', null], [2, false, 'WL-02', 'Open', null]], row.id);
    assert.deepEqual(Object.keys(list[1].factors), row.factors, row.id);
  }
  assert.deepEqual(changes.map((c) => [c.target, c.from === null, c.actor.type]), [['WL-02', true, 'agent'], ...E.OVERLAY_FIELDS.map((row) => [`${row.id}.2`, true, 'agent'])]);
  assert.deepEqual(changes[0].to, { id: 'WL-02', name: 'Billing' });
  assert.deepEqual(changes[1].to, entry(state, 'OVL-01.2'));
  const removed = apply(state, [{ op: 'remove-workload', id: 'WL-02' }], agent);
  assert.deepEqual(removed.register.overlay.workloads, [{ id: 'WL-01', name: '' }]);
  assert.deepEqual(removed.register.overlay.rows, fresh().register.overlay.rows);
  const again = apply(removed, [{ op: 'add-workload', name: 'Ledger' }], fixture);
  assert.deepEqual(again.register.overlay.workloads.at(-1), { id: 'WL-03', name: 'Ledger' }, 'a workload ID is never reused');
  assert.deepEqual(again.register.overlay.rows['OVL-04'].map((e) => [e.n, e.workload]), [[1, 'WL-01'], [3, 'WL-03']], 'entry numbers are never reused');
  const many = structuredClone(fresh());
  many.register.overlay.workloads = [{ id: 'WL-01', name: '' }, { id: 'WL-09', name: 'Old' }];
  assert.equal(apply(many, [{ op: 'add-workload', name: 'New' }]).register.overlay.workloads.at(-1).id, 'WL-10');
  for (const name of ['', '   ', null, 7]) refused(fresh(), { op: 'add-workload', name }, agent, MSG.workloadName);
  const { state: renamed, changes: renames } = changesOf(again, [{ op: 'rename-workload', id: 'WL-03', name: ' General ledger ' }], agent);
  assert.deepEqual(renamed.register.overlay.workloads.at(-1), { id: 'WL-03', name: 'General ledger' });
  assert.deepEqual(renames.map((c) => [c.target, c.from, c.to]), [['WL-03', { id: 'WL-03', name: 'Ledger' }, { id: 'WL-03', name: 'General ledger' }]]);
  assert.deepEqual(changesOf(renamed, [{ op: 'rename-workload', id: 'WL-03', name: 'General ledger' }]).changes, []);
  assert.equal(apply(fresh(), [{ op: 'rename-workload', id: 'WL-01', name: 'Payments' }], agent).register.overlay.workloads[0].name, 'Payments');
  refused(again, { op: 'rename-workload', id: 'WL-02', name: 'Billing' }, agent, MSG.workloadUnknown('WL-02'));
  refused(again, { op: 'rename-workload', id: 'WL-03', name: ' ' }, agent, MSG.workloadName);
  refused(again, { op: 'remove-workload', id: 'WL-04' }, agent, MSG.workloadUnknown('WL-04'));
  const holed = structuredClone(again);
  holed.register.overlay.workloads.unshift(null);
  refused(holed, { op: 'rename-workload', id: 'WL-09', name: 'Billing' }, agent, MSG.workloadUnknown('WL-09'));
});

test('applyPatch_removeWorkloadWithAnswers_refused', () => {
  const two = apply(fresh(), [{ op: 'add-workload', name: 'Billing' }]);
  refused(apply(two, [{ op: 'set', entry: 'OVL-04.2', value: 'Rehost' }]), { op: 'remove-workload', id: 'WL-02' }, agent, MSG.workloadHeld('WL-02', 'OVL-04.2'));
  refused(apply(two, [{ op: 'na', entry: 'OVL-05.2', reason: 'No data path for billing' }]), { op: 'remove-workload', id: 'WL-02' }, person, MSG.workloadHeld('WL-02', 'OVL-05.2'));
  refused(apply(two, [{ op: 'set-factor', entry: 'OVL-07.2', factor: 'migrationGB', value: 40 }]), { op: 'remove-workload', id: 'WL-02' }, person, MSG.workloadHeld('WL-02', 'OVL-07.2'));
  const confirmed = structuredClone(two);
  entry(confirmed, 'OVL-01.2').status = 'Confirmed';
  entry(confirmed, 'OVL-12.2').value = 0;
  refused(confirmed, { op: 'remove-workload', id: 'WL-02' }, person, MSG.workloadHeld('WL-02', 'OVL-01.2, OVL-12.2'));
  refused(two, { op: 'remove-workload', id: 'WL-01' }, person, MSG.workloadPrimary('WL-01'));
  const opened = apply(apply(two, [{ op: 'set', entry: 'OVL-04.2', value: 'Rehost' }]), [{ op: 'set', entry: 'OVL-04.2', value: '' }]);
  const { state, changes } = changesOf(opened, [{ op: 'remove-workload', id: 'WL-02' }], agent);
  assert.deepEqual(state.register.overlay.workloads.map((w) => w.id), ['WL-01']);
  assert.deepEqual(changes.map((c) => [c.target, c.to]), [...E.OVERLAY_FIELDS.map((row) => [`${row.id}.2`, null]), ['WL-02', null]]);
  assert.deepEqual(changes.at(-1).from, { id: 'WL-02', name: 'Billing' });
});

test('applyPatch_removeLastWorkloadWhileOverlayApplies_refused', () => {
  const on = apply(fresh(), [{ op: 'set-overlay', applies: true, source: 'onprem' }]);
  refused(on, { op: 'remove-workload', id: 'WL-01' }, person, MSG.workloadLast('WL-01'));
  refused(on, { op: 'remove-workload', id: 'WL-01' }, agent, MSG.workloadLast('WL-01'));
});

test('applyPatch_removeLastWorkloadOverlayOff_refused', () => {
  refused(fresh(), { op: 'remove-workload', id: 'WL-01' }, person, MSG.workloadLast('WL-01'));
  refused(fresh(), { op: 'remove-workload', id: 'WL-01' }, agent, MSG.workloadLast('WL-01'));
});

test('applyPatch_setBrdNewKey_added', () => {
  const state = fresh();
  const added = { key: 'RESELLER-PORTAL', path: '../brd-reseller-portal/reseller-portal-brd-master.md', version: '2.0', status: 'Approved' };
  const { state: two, changes } = changesOf(state, [{ op: 'set-brd', key: ' RESELLER-PORTAL ', path: ` ${added.path} `, version: ' 2.0 ', status: ' Approved ' }]);
  assert.deepEqual(two.project.brds, [BRD, added]);
  assert.deepEqual(changes, [{ at: NOW, actor: PERSON, op: 'set-brd', target: 'project.brds.RESELLER-PORTAL', from: null, to: added, reason: null }]);
  assert.notEqual(E.contentHash(two), E.contentHash(state), 'project.brds is inside the content hash');
  const { state: bumped, changes: bumps } = changesOf(two, [{ op: 'set-brd', key: 'REFUNDS', version: '1.6', status: '' }], fixture);
  assert.deepEqual(bumped.project.brds[0], { ...BRD, version: '1.6', status: null });
  assert.deepEqual([bumps[0].from, bumps[0].to], [BRD, { ...BRD, version: '1.6', status: null }]);
  assert.deepEqual(changesOf(two, [{ op: 'set-brd', key: 'REFUNDS', path: BRD.path }]).changes, []);
  assert.equal(apply(state, [{ op: 'set-brd', key: 'NEW', path: 'new.md', version: '1.0' }]).project.brds[1].status, null);
  for (const key of ['refunds', 'REFUNDS--X', '', 7]) refused(state, { op: 'set-brd', key, path: 'x.md', version: '1.0' }, person, `A BRD key is upper-case letters and digits in hyphen-separated parts, for example REFUNDS or RESELLER-PORTAL; got ${JSON.stringify(key)}.`);
  refused(state, { op: 'set-brd', key: 'NEW', version: '1.0' }, person, 'BRD NEW: give the path of its master file.');
  refused(state, { op: 'set-brd', key: 'REFUNDS', path: ' ' }, person, 'BRD REFUNDS: give the path of its master file.');
  refused(state, { op: 'set-brd', key: 'NEW', path: 'new.md' }, person, 'BRD NEW: give its version, for example 1.5.');
  refused(state, { op: 'set-brd', key: 'REFUNDS', version: 1.6 }, person, 'BRD REFUNDS: give its version, for example 1.5.');
  refused(state, { op: 'set-brd', key: 'REFUNDS', status: 5 }, person, 'BRD REFUNDS: status takes text, or blank for none; got 5.');
});

test('applyPatch_setBrdByAgent_refused', () => {
  const state = withPolicy();
  refused(state, { op: 'set-brd', key: 'REFUNDS', version: '1.6' }, agent, MSG.brdAgent);
  refused(state, { op: 'remove-brd', key: 'REFUNDS' }, agent, MSG.brdAgent);
  refused(state, { op: 'set-brd', key: 'REFUNDS', version: '1.6' }, policy, MSG.brdPolicy);
  refused(state, { op: 'remove-brd', key: 'REFUNDS' }, policy, MSG.brdPolicy);
  assert.deepEqual(E.applyPatch(state, [{ op: 'remove-brd', key: 'REFUNDS' }], agent, { now: NOW }).errors, [{ index: 0, op: 'remove-brd', target: 'REFUNDS', message: MSG.brdAgent }]);
});

test('applyPatch_removeLastBrd_refused', () => {
  refused(fresh(), { op: 'remove-brd', key: 'REFUNDS' }, person, MSG.brdLast('REFUNDS'));
  refused(fresh(), { op: 'remove-brd', key: 'OTHER' }, person, 'No BRD has the key "OTHER"; the project lists REFUNDS.');
  refused(E.newState({ name: 'Refunds platform', now: NOW }), { op: 'remove-brd', key: 'REFUNDS' }, person, 'No BRD has the key "REFUNDS"; the project lists none.');
  const two = apply(fresh(), [{ op: 'set-brd', key: 'PAYOUTS', path: 'payouts.md', version: '1.0' }]);
  refused(two, { op: 'remove-brd', key: 'OTHER' }, person, 'No BRD has the key "OTHER"; the project lists REFUNDS and PAYOUTS.');
  const { state, changes } = changesOf(two, [{ op: 'remove-brd', key: 'REFUNDS' }], fixture);
  assert.deepEqual(state.project.brds.map((b) => b.key), ['PAYOUTS']);
  assert.deepEqual([changes[0].target, changes[0].from, changes[0].to], ['project.brds.REFUNDS', BRD, null]);
});

test('applyPatch_setVersionNotGreater_refused', () => {
  const state = fresh();
  refused(state, { op: 'set-version', version: '1.0' }, person, MSG.versionLow('1.0', '1.0', '1.1'));
  refused(state, { op: 'set-version', version: '0.9' }, agent, MSG.versionLow('0.9', '1.0', '1.1'));
  const { state: bumped, changes } = changesOf(state, [{ op: 'set-version', version: ' 1.1 ' }], agent);
  assert.equal(bumped.project.pre_sdd_version, '1.1');
  assert.deepEqual(changes, [{ at: NOW, actor: AGENT, op: 'set-version', target: 'project.pre_sdd_version', from: '1.0', to: '1.1', reason: null }]);
  assert.equal(E.contentHash(bumped), E.contentHash(state), 'pre_sdd_version is outside the content hash');
  const nine = apply(bumped, [{ op: 'set-version', version: '1.9' }]);
  const ten = apply(nine, [{ op: 'set-version', version: '1.10' }], fixture);
  assert.equal(ten.project.pre_sdd_version, '1.10', 'the minor number compares as a number');
  refused(ten, { op: 'set-version', version: '1.2' }, person, MSG.versionLow('1.2', '1.10', '1.11'));
  refused(ten, { op: 'set-version', version: '0.99' }, person, MSG.versionLow('0.99', '1.10', '1.11'));
  assert.equal(apply(ten, [{ op: 'set-version', version: '2.0' }]).project.pre_sdd_version, '2.0');
  const odd = structuredClone(state);
  odd.project.pre_sdd_version = 'draft';
  assert.equal(apply(odd, [{ op: 'set-version', version: '0.1' }]).project.pre_sdd_version, '0.1');
  for (const version of ['1', 'v1.2', 1.2, '1.2.3', '', null]) refused(state, { op: 'set-version', version }, person, MSG.versionFormat(JSON.stringify(version)));
  refused(withPolicy(), { op: 'set-version', version: '1.1' }, policy, MSG.versionPolicy);
});

test('applyPatch_decideOptionByPolicy_refused', () => {
  const state = apply(withPolicy(), [OPTION], agent);
  refused(state, { op: 'decide', option: 'OPT-01' }, policy, MSG.decidePolicyOption);
  refused(state, { op: 'decide', option: null }, policy, MSG.decidePolicyOption);
});

test('applyPatch_naByPolicy_refused', () => {
  const state = withPolicy();
  for (const id of ['ECO-05.1', 'CAP-12.1', 'OVL-04.1']) refused(state, { op: 'na', entry: id, reason: 'Out of scope' }, policy, MSG.naPolicy(id));
  const byFixture = entry(apply(state, [{ op: 'na', entry: 'ECO-05.1', reason: 'No footprint goal applies' }], fixture), 'ECO-05.1');
  assert.deepEqual([byFixture.status, byFixture.na_reason, byFixture.source], ['N/A', 'No footprint goal applies', { type: 'fixture', text: FIXTURE_LABEL }]);
});

test('applyPatch_closeUnknownByPolicy_refused', () => {
  const state = apply(withPolicy(), [{ op: 'add-unknown', question: 'Which scope does the standby cover?', owner: 'Lead architect' }, { op: 'add-unknown', question: 'Who owns the ledger?' }]);
  refused(state, { op: 'close-unknown', id: 'QD-01', resolution: 'Region' }, policy, MSG.closePolicy('QD-01', ' (Lead architect)'));
  refused(state, { op: 'close-unknown', id: 'QD-02', resolution: 'Finance' }, policy, MSG.closePolicy('QD-02', ''));
  const closed = apply(state, [{ op: 'close-unknown', id: 'QD-02', resolution: 'Finance' }], fixture);
  assert.deepEqual([closed.unknowns[1].status, closed.unknowns[1].closed_by], ['closed', FIXTURE_LABEL]);
});

test('applyPatch_ownerNameByAgent_refused', () => {
  const state = withPolicy();
  for (const op of [{ owner_name: 'Dana' }, { due: '2026-12-01' }, { owner_name: '' }, { value: 99.9, owner_name: 'Dana' }]) {
    refused(state, { op: 'set', entry: 'REL-01.1', ...op }, agent, MSG.ownerFields('REL-01.1', 'an agent'));
    refused(state, { op: 'set', entry: 'REL-01.1', ...op }, policy, MSG.ownerFields('REL-01.1', 'an answer policy'));
  }
  assert.equal(entry(apply(state, [{ op: 'set', entry: 'REL-01.1', owner: 'B+Ops' }], agent), 'REL-01.1').owner, 'B+Ops');
  for (const actor of [person, fixture]) {
    const after = entry(apply(state, [{ op: 'set', entry: 'REL-01.1', owner_name: 'Dana', due: '2026-12-01' }], actor), 'REL-01.1');
    assert.deepEqual([after.owner_name, after.due], ['Dana', '2026-12-01'], actor.type);
  }
});

test('applyPatch_addConditionByAgent_refused', () => {
  const state = withPolicy();
  const op = { op: 'add-condition', text: 'Load test before go-live', owner: 'SRE lead', due: '2026-12-01' };
  refused(state, op, agent, MSG.addCondition('An agent'));
  refused(state, op, policy, MSG.addCondition('An answer policy'));
  assert.deepEqual(apply(state, [op], fixture).gate.conditions, [{ id: 'COND-01', text: 'Load test before go-live', owner: 'SRE lead', due: '2026-12-01' }]);
});

test('applyPatch_signNotApplicableByStandIn_refused', () => {
  const state = withPolicy();
  refused(state, { op: 'sign', role: 'network_owner', applicable: false, reason: 'No network change' }, policy, MSG.standInNa('network_owner'));
  const stood = apply(state, [{ op: 'sign', role: 'network_owner', decision: 'Approved' }], policy);
  assert.equal(stood.gate.signoffs[0].stand_in, true);
  const { state: marked, changes } = changesOf(state, [{ op: 'sign', role: 'network_owner', applicable: false, reason: ' No network change ' }], fixture);
  assert.deepEqual(marked.gate.signoffs, [{ role: 'network_owner', applicable: false, na_reason: 'No network change', name: FIXTURE_LABEL, decision: null, at: NOW, content_hash: E.contentHash(state), stand_in: false }]);
  assert.equal(changes[0].actor.type, 'fixture');
  for (const op of [{ decision: 'Approved' }, { applicable: true, decision: 'Approved' }, { applicable: 'no', reason: 'x' }]) refused(state, { op: 'sign', role: 'network_owner', ...op }, fixture, SIGN_NEEDS);
  refused(state, { op: 'sign', role: 'network_owner', applicable: false, reason: 'x' }, agent, SIGN_NEEDS);
});

test('applyPatch_setScoreByPolicy_refused', () => {
  const state = apply(apply(withPolicy(), [OPTION, { op: 'set-score', option: 'OPT-01', criterion: 'nfr_fit', value: 4, reason: 'Meets p99' }], agent), []);
  refused(state, { op: 'set-score', option: 'OPT-01', criterion: 'operability', value: 3, reason: 'Managed services' }, policy, MSG.scorePolicy('sets'));
  refused(state, { op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }, policy, MSG.scorePolicy('confirms'));
  assert.equal(apply(state, [{ op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }], fixture).options.list[0].scores.nfr_fit.status, 'Confirmed');
  assert.equal(apply(state, [{ op: 'set-score', option: 'OPT-01', criterion: 'operability', value: 3, reason: 'Managed services' }], fixture).options.list[0].scores.operability.by, FIXTURE_LABEL);
});

test('applyPatch_excludeOption_hardPassFalseWithFailure', () => {
  const state = apply(fresh(), [OPTION], agent);
  assert.equal(options(state)[0].hardPass, true);
  const reason = 'Hosts outside the EU, which the residency entry forbids';
  const { state: excluded, changes } = changesOf(state, [{ op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', reason: ` ${reason} ` }], fixture);
  assert.deepEqual(excluded.options.list[0].excluded, { entry: 'DAT-04.1', reason });
  assert.deepEqual(options(excluded)[0].hardPass, false);
  assert.deepEqual(options(excluded)[0].failures, [{ check: 'excluded', ref: 'DAT-04.1', message: reason }]);
  assert.deepEqual(changes.map((c) => [c.target, c.from, c.to, c.reason]), [['OPT-01', { excluded: null }, { excluded: { entry: 'DAT-04.1', reason } }, reason]]);
  const signed = approvedState();
  assert.equal(E.compute(signed, { now: NOW }).gate.g2.result, 'shortlist');
  assert.deepEqual(E.compute(apply(signed, [{ op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', reason }]), { now: NOW }).gate.g2, { result: 'incomplete', missing: ['No option passes every hard check: OPT-01 fails one.'] });
  const moved = changesOf(excluded, [{ op: 'exclude-option', option: 'OPT-01', entry: 'BUS-07.1', reason: 'Breaks the card data rule' }]);
  assert.deepEqual([moved.changes[0].from, moved.changes[0].to], [{ excluded: { entry: 'DAT-04.1', reason } }, { excluded: { entry: 'BUS-07.1', reason: 'Breaks the card data rule' } }]);
  assert.deepEqual(changesOf(excluded, [{ op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', reason }]).changes, []);
  const { state: included, changes: back } = changesOf(excluded, [{ op: 'include-option', option: 'OPT-01' }]);
  assert.equal(Object.hasOwn(included.options.list[0], 'excluded'), false);
  assert.equal(options(included)[0].hardPass, true);
  assert.deepEqual(back.map((c) => [c.target, c.from, c.to]), [['OPT-01', { excluded: { entry: 'DAT-04.1', reason } }, { excluded: null }]]);
  const nulled = structuredClone(state);
  nulled.options.list[0].excluded = null;
  assert.equal(options(nulled)[0].hardPass, true, 'a null exclusion is no exclusion');
  refused(state, { op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', reason }, agent, MSG.exclude('An agent'));
  refused(apply(state, [SET_POLICY]), { op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', reason }, policy, MSG.exclude('An answer policy'));
  refused(state, { op: 'exclude-option', option: 'OPT-07', entry: 'DAT-04.1', reason }, person, MSG.optionUnknown('OPT-07'));
  refused(state, { op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.7', reason }, person, 'DAT-04 has no entry 7.');
  for (const why of ['', '  ', undefined]) refused(state, { op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', ...(why === undefined ? {} : { reason: why }) }, person, MSG.excludeReason);
  const chosen = apply(state, [{ op: 'decide', option: 'OPT-01' }]);
  refused(chosen, { op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', reason }, person, MSG.chosen('OPT-01', 'exclude'));
});

test('applyPatch_includeOptionNotExcluded_refused', () => {
  const state = apply(withPolicy(), [OPTION], agent);
  refused(state, { op: 'include-option', option: 'OPT-01' }, person, MSG.notExcluded('OPT-01'));
  const excluded = apply(state, [{ op: 'exclude-option', option: 'OPT-01', entry: 'DAT-04.1', reason: 'Hosts outside the EU' }]);
  refused(excluded, { op: 'include-option', option: 'OPT-01' }, agent, MSG.include('An agent'));
  refused(excluded, { op: 'include-option', option: 'OPT-01' }, policy, MSG.include('An answer policy'));
  refused(excluded, { op: 'include-option', option: 'OPT-02' }, person, MSG.optionUnknown('OPT-02'));
  assert.equal(Object.hasOwn(apply(excluded, [{ op: 'include-option', option: 'OPT-01' }], fixture).options.list[0], 'excluded'), false);
});

test('applyPatch_setCondition_changesOwnerAndDue', () => {
  const state = apply(withPolicy(), [{ op: 'add-condition', text: 'Load test before go-live' }]);
  const { state: owned, changes } = changesOf(state, [{ op: 'set-condition', id: 'COND-01', owner: ' SRE lead ', due: '2026-12-01' }], fixture);
  assert.deepEqual(owned.gate.conditions, [{ id: 'COND-01', text: 'Load test before go-live', owner: 'SRE lead', due: '2026-12-01' }]);
  assert.deepEqual(changes.map((c) => [c.target, c.from, c.to]), [['COND-01', { id: 'COND-01', text: 'Load test before go-live', owner: null, due: null }, { id: 'COND-01', text: 'Load test before go-live', owner: 'SRE lead', due: '2026-12-01' }]]);
  assert.deepEqual(apply(owned, [{ op: 'set-condition', id: 'COND-01', text: ' Load test at twice the peak ', owner: '', due: null }]).gate.conditions[0], { id: 'COND-01', text: 'Load test at twice the peak', owner: null, due: null });
  assert.deepEqual(changesOf(owned, [{ op: 'set-condition', id: 'COND-01', owner: 'SRE lead' }]).changes, []);
  refused(state, { op: 'set-condition', id: 'COND-09', owner: 'SRE lead' }, person, MSG.conditionUnknown('COND-09'));
  refused(state, { op: 'set-condition', id: 'COND-01' }, person, 'set-condition takes at least one of text, owner and due.');
  refused(state, { op: 'set-condition', id: 'COND-01', text: '  ' }, person, 'A condition needs its text.');
  refused(state, { op: 'set-condition', id: 'COND-01', owner: 7 }, person, 'owner takes text; got 7.');
  refused(state, { op: 'set-condition', id: 'COND-01', due: '2026-13-01' }, person, 'due is a date, YYYY-MM-DD; got "2026-13-01".');
  refused(state, { op: 'set-condition', id: 'COND-01', due: 5 }, person, 'due is a date, YYYY-MM-DD; got 5.');
  refused(state, { op: 'set-condition', id: 'COND-01', owner: 'SRE lead' }, agent, MSG.setCondition('An agent'));
  refused(state, { op: 'set-condition', id: 'COND-01', owner: 'SRE lead' }, policy, MSG.setCondition('An answer policy'));
});

test('applyPatch_removeCondition_removed', () => {
  const state = apply(withPolicy(), [{ op: 'add-condition', text: 'Load test before go-live' }, { op: 'add-condition', text: 'Pen test before go-live', owner: 'CISO', due: '2026-12-15' }]);
  const { state: removed, changes } = changesOf(state, [{ op: 'remove-condition', id: 'COND-01' }], fixture);
  assert.deepEqual(removed.gate.conditions.map((c) => c.id), ['COND-02']);
  assert.deepEqual(changes.map((c) => [c.target, c.from, c.to]), [['COND-01', { id: 'COND-01', text: 'Load test before go-live', owner: null, due: null }, null]]);
  const last = apply(removed, [{ op: 'remove-condition', id: 'COND-02' }]);
  assert.deepEqual(apply(last, [{ op: 'add-condition', text: 'Soak test' }]).gate.conditions.map((c) => c.id), ['COND-03'], 'a condition ID is never reused');
  refused(state, { op: 'remove-condition', id: 'COND-09' }, person, MSG.conditionUnknown('COND-09'));
  refused(state, { op: 'remove-condition', id: 'COND-01' }, agent, MSG.removeCondition('An agent'));
  refused(state, { op: 'remove-condition', id: 'COND-01' }, policy, MSG.removeCondition('An answer policy'));
});

test('applyPatch_revokeExceptionByFixture_refused', () => {
  const state = apply(withPolicy(), [{ op: 'add-exception', entry: 'DAT-04.1', reason: 'Residency review is booked', expires: '2026-12-31', review: '2026-12-15' }]);
  for (const actor of [fixture, agent, policy]) refused(state, { op: 'revoke-exception', id: 'EXC-01', reason: 'The review moved' }, actor, MSG.revokeWho);
});

test('applyPatch_revokeException_entryBlocksAgain', () => {
  const state = fresh();
  assert.ok(blockerIds(state).includes('OPEN-DAT-04.1'));
  const granted = apply(state, [{ op: 'add-exception', entry: 'DAT-04.1', reason: 'Residency review is booked', expires: '2026-12-31', review: '2026-12-15' }]);
  assert.ok(!blockerIds(granted).includes('OPEN-DAT-04.1'));
  const { state: revoked, changes } = changesOf(granted, [{ op: 'revoke-exception', id: 'EXC-01', reason: ' The residency review moved to next year ' }], person, LATER);
  assert.deepEqual(revoked.gate.exceptions, []);
  assert.ok(blockerIds(revoked).includes('OPEN-DAT-04.1'));
  assert.deepEqual(changes, [{ at: LATER, actor: PERSON, op: 'revoke-exception', target: 'EXC-01', from: granted.gate.exceptions[0], to: null, reason: 'The residency review moved to next year' }]);
  const again = apply(revoked, [{ op: 'add-exception', entry: 'DAT-04.1', reason: 'Booked again', expires: '2027-03-31', review: '2027-03-15' }]);
  assert.equal(again.gate.exceptions[0].id, 'EXC-02', 'an exception ID is never reused');
  refused(granted, { op: 'revoke-exception', id: 'EXC-09', reason: 'Moved' }, person, MSG.exceptionUnknown('EXC-09'));
  for (const reason of ['', '  ', undefined]) refused(granted, { op: 'revoke-exception', id: 'EXC-01', ...(reason === undefined ? {} : { reason }) }, person, MSG.revokeReason);
});

test('applyPatch_removeChosenOption_refused', () => {
  const state = apply(apply(withPolicy(), [OPTION, { op: 'set-option', name: 'Two regions, warm standby' }], agent), [{ op: 'decide', option: 'OPT-01' }]);
  refused(state, { op: 'remove-option', option: 'OPT-01' }, person, MSG.chosen('OPT-01', 'remove'));
  const cleared = apply(state, [{ op: 'decide', option: null }]);
  const { state: removed, changes } = changesOf(cleared, [{ op: 'remove-option', option: 'OPT-01' }], fixture);
  assert.deepEqual(removed.options.list.map((o) => o.id), ['OPT-02']);
  assert.deepEqual(changes.map((c) => [c.target, c.from, c.to]), [['OPT-01', cleared.options.list[0], null]]);
  const last = apply(removed, [{ op: 'remove-option', option: 'OPT-02' }]);
  assert.equal(apply(last, [{ op: 'set-option', name: 'One region again' }], agent).options.list[0].id, 'OPT-03', 'an option ID is never reused');
  refused(state, { op: 'remove-option', option: 'OPT-02' }, agent, MSG.removeOption('An agent'));
  refused(state, { op: 'remove-option', option: 'OPT-02' }, policy, MSG.removeOption('An answer policy'));
  refused(state, { op: 'remove-option', option: 'OPT-05' }, person, MSG.optionUnknown('OPT-05'));
});

test('applyPatch_newOps_outputPassesGate', (t) => {
  const steps = [
    [person, [SET_POLICY]],
    [agent, [OPTION, { op: 'set-option', name: 'Two regions, warm standby' }, { op: 'set-score', option: 'OPT-01', criterion: 'nfr_fit', value: 4, reason: 'Meets p99' }]],
    [person, [DECIDED]],
    [person, [{ op: 'decide', option: 'OPT-01' }]],
    [person, [{ op: 'decide', dr: { az: '' } }]],
    [agent, [{ op: 'set-run', stage: 2, group: 'HDR' }]],
    [policy, [{ op: 'set-run', group: null }]],
    [person, [{ op: 'set-run', input: 'web', light: true }]],
    [person, [{ op: 'set-overlay', applies: true, source: 'onprem' }]],
    [agent, [{ op: 'set-overlay', source: 'mixed', cite: CITE }]],
    [agent, [{ op: 'add-workload', name: 'Billing' }]],
    [agent, [{ op: 'add-workload', name: 'Ledger' }]],
    [agent, [{ op: 'rename-workload', id: 'WL-02', name: 'Billing and invoicing' }]],
    [agent, [{ op: 'remove-workload', id: 'WL-03' }]],
    [person, [{ op: 'set-brd', key: 'PAYOUTS', path: 'payouts.md', version: '1.0', status: 'Draft' }]],
    [fixture, [{ op: 'set-brd', key: 'REFUNDS', version: '1.6' }]],
    [person, [{ op: 'remove-brd', key: 'PAYOUTS' }]],
    [agent, [{ op: 'set-version', version: '1.1' }]],
    [person, [{ op: 'exclude-option', option: 'OPT-02', entry: 'DAT-04.1', reason: 'Hosts outside the EU' }]],
    [fixture, [{ op: 'include-option', option: 'OPT-02' }]],
    [person, [{ op: 'exclude-option', option: 'OPT-02', entry: 'BUS-07.1', reason: 'Breaks the card data rule' }]],
    [fixture, [{ op: 'add-condition', text: 'Load test before go-live' }, { op: 'add-condition', text: 'Pen test' }]],
    [person, [{ op: 'set-condition', id: 'COND-01', owner: 'SRE lead', due: '2026-12-01' }]],
    [person, [{ op: 'remove-condition', id: 'COND-02' }]],
    [person, [{ op: 'add-exception', entry: 'DAT-04.1', reason: 'Residency review is booked', expires: '2026-12-31', review: '2026-12-15' }, { op: 'add-exception', entry: 'BUS-07.1', reason: 'Legal review booked', expires: '2026-12-31', review: '2026-12-15' }]],
    [person, [{ op: 'revoke-exception', id: 'EXC-01', reason: 'The review moved' }]],
    [person, [{ op: 'check', id: 'G3-01', status: 'Done' }]],
    [fixture, [{ op: 'na', entry: 'ECO-05.1', reason: 'No footprint goal applies' }]],
    [person, [{ op: 'add-unknown', question: 'Who owns the ledger?' }]],
    [fixture, [{ op: 'close-unknown', id: 'QD-01', resolution: 'Finance' }]],
    [person, [{ op: 'set', entry: 'REL-01.1', owner_name: 'Dana', due: '2026-12-01' }]],
    [fixture, [{ op: 'sign', role: 'network_owner', applicable: false, reason: 'No network change' }]],
    [fixture, [{ op: 'set-score', option: 'OPT-01', criterion: 'operability', value: 3, reason: 'Managed services' }]],
    [person, [{ op: 'confirm', option: 'OPT-01', criterion: 'nfr_fit' }]],
    [person, [{ op: 'decide', option: null }]],
    [person, [{ op: 'remove-option', option: 'OPT-01' }]],
    [person, [{ op: 'set-overlay', applies: false }]],
  ];
  let state = fresh();
  const states = [];
  for (const [actor, ops] of steps) {
    const result = E.applyPatch(state, ops, actor, { now: NOW });
    assert.deepEqual(result.errors, [], JSON.stringify(ops));
    state = result.state;
    const { state: normalized, advisories } = E.normalizeState(state, { now: NOW });
    assert.deepEqual(normalized.history.length, state.history.length, `the gate changes nothing after ${ops.map((o) => o.op).join(', ')}`);
    assert.deepEqual(advisories, []);
    states.push(state);
  }
  const used = new Set(state.history.map((c) => c.op));
  for (const op of ['decide', 'set-run', 'set-overlay', 'add-workload', 'rename-workload', 'remove-workload', 'set-brd', 'remove-brd', 'set-version', 'exclude-option', 'include-option', 'set-condition', 'remove-condition', 'revoke-exception', 'remove-option']) assert.ok(used.has(op), op);
  const result = validateAllWithSchema(schemaPath, states);
  if (result.skipped) {
    t.skip(result.skipped);
    return;
  }
  assert.deepEqual(result.errors, states.map(() => []));
});
