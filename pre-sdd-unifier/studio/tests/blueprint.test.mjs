import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, goldenCase, readText } from './helpers.mjs';
import { auditBlueprints, runValidator, validateWithSchema } from './pyschema.mjs';
import { NOW, LATER, person, agent, BRDS, ROLES, CONDITION, apply, approvedState, resign, newProject, deepFreeze } from './states.mjs';

const E = loadEngine();
const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const VALIDATOR = join(studioDir, 'validate_handoff.py');
const SCHEMA = join(studioDir, 'schema', 'architecture-blueprint.schema.json');
const DASH = /[\u2013\u2014]/;
const OPTS = { now: NOW, name: 'Golden parity', slug: 'golden-parity' };
const KEYS = ['schema_version', 'project', 'sources', 'requirements', 'calculations', 'architecture', 'dr_scenarios', 'options', 'decisions', 'diagrams', 'conflicts', 'governance', 'validation'];
const PREVIEW = ['Pre-SDD-preview.md', 'architecture-blueprint.json', 'architecture-blueprint.yaml', 'project-state.json'];
const FULL = {
  solutionName: 'Refunds platform', brdRef: '', changeType: 'brownfield', target: 'hybrid',
  dailyTxn: 864000, peakFactor: 5, p99Ms: 300, annualGrowth: 20, availability: 99.95, failureScope: 'site', rtoSec: 900, rpoSec: 60,
  budget: 'tight', dataKind: 'document', dataConsistency: 'eventual', connectivity: 'partner', sensitiveData: 'sensitive',
  callsPerTxn: 3, requestFactor: 1.1, meanLatencyMs: 120, utilization: 0.65, requestKB: 4, responseKB: 16, networkOverhead: 1.2,
  storedKB: 2, retentionDays: 365, initialGB: 100, indexFactor: 1.4, copies: 2, cidrPrefix: 22,
  transactionNeed: 'yes', queryShape: 'document', readPercent: 70, tenantModel: 'shared', regionLabel: 'Frankfurt', recoveryLabel: 'Dublin', residency: 'yes',
  migration: 'yes', sourcePlatform: 'onprem', migrationGB: 2000, linkMbps: 150, cutoverHours: 4,
  businessProblem: 'Cut refund handling time to one day', evidenceRef: '', owner: '',
  topologyOverride: 'regional', drOverride: 'warm', overrideReason: 'Cost envelope agreed', approver: '',
  approveReqs: false, approveSecurity: false, approveArchitecture: false, approveRisks: false,
};
const FULL_RECORD = { version: 2, inputs: FULL, statuses: {}, extraWorkloads: [{ name: 'Reporting', kind: 'analytics', consistency: 'eventual' }], history: [], provider: 'azure', showOptional: false };
const built = [];

function blueprintOf(state, now = NOW) {
  const model = E.compute(state, { now });
  const bp = E.handoffBlueprint(state, model, { now });
  built.push(JSON.parse(JSON.stringify(bp)));
  return bp;
}

function withTemp(run) {
  const dir = mkdtempSync(join(tmpdir(), 'pre-sdd-bp-'));
  try {
    return run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function writeSet(dir, files) {
  for (const [name, body] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), body);
  }
}

function validatorRun(t, bp, flags = []) {
  return withTemp((dir) => {
    const file = join(dir, 'architecture-blueprint.json');
    writeFileSync(file, `${JSON.stringify(bp, null, 2)}\n`);
    return runValidator(VALIDATOR, file, flags);
  });
}

function optioned() {
  let state = approvedState();
  state = apply(state, [{ op: 'set-option', name: 'Two regions, warm standby', shape: { hosting: 'cloud', topology: 'regional', dr: 'warm' } }], agent);
  state = apply(state, [
    { op: 'set-cost', option: 'OPT-01', cost: 'one_time', value: 120000 },
    { op: 'set-cost', option: 'OPT-01', cost: 'monthly', value: 9000 },
    { op: 'set-cost', option: 'OPT-02', cost: 'one_time', value: 200000 },
    { op: 'set-horizon', value: 36 },
    { op: 'set-weights', values: { nfr_fit: 3, recurring_tco: 2 } },
    { op: 'set-score', option: 'OPT-01', criterion: 'nfr_fit', value: 4, reason: 'Meets the az scope' },
    { op: 'set-score', option: 'OPT-01', criterion: 'recurring_tco', value: 3, reason: 'One region keeps the run cost down' },
  ]);
  return state;
}

function conflicted() {
  return apply(approvedState(), [{ op: 'decide', topology: 'single', reason: 'One zone is enough for the pilot' }], person, LATER);
}

function migrating() {
  let state = approvedState();
  state = apply(state, [{ op: 'set-overlay', applies: true, source: 'onprem' }, { op: 'add-workload', name: 'Billing' }]);
  return state;
}

test('handoffBlueprint_newState_schemaValid', (t) => {
  const state = newProject();
  const bp = blueprintOf(state);
  assert.deepEqual(Object.keys(bp), KEYS);
  assert.equal(bp.schema_version, '2.0.0');
  assert.deepEqual(bp.project, { id: 'REFUNDS-PLATFORM', name: 'Refunds platform', slug: 'refunds-platform', path_code: 'Unclassified', change_type: 'undecided', target_hosting: 'undecided', source_to_target: 'Not applicable', project_status: 'Blocked' });
  assert.deepEqual([bp.governance.pre_sdd_gate, bp.governance.gate_status, bp.governance.authorized_to_start_sdd, bp.governance.approved_at], ['G0', 'blocked', false, null]);
  assert.equal(bp.sources.pre_sdd.approval_status, 'blocked');
  assert.deepEqual([bp.validation.export_status, bp.validation.sdd_source_intake, bp.validation.checked_at], ['blocked', 'blocked', NOW]);
  assert.equal(bp.calculations.length, 20);
  const run = validatorRun(t, bp);
  if (run.skipped) return t.skip(run.skipped);
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /^Schema \+ referential\/governance validator: PASS$/m);
  const schema = validateWithSchema(SCHEMA, bp);
  assert.deepEqual(schema.errors, []);
});

test('handoffBlueprint_signedState_approvedAndAuthorized', (t) => {
  const state = approvedState();
  const model = E.compute(state, { now: NOW });
  assert.equal(model.gate.authorized, true, 'the fixture is authorized');
  const bp = blueprintOf(state);
  const g = bp.governance;
  assert.deepEqual([g.pre_sdd_gate, g.gate_status, g.authorized_to_start_sdd, g.approved_at], ['G3', 'approved', true, NOW]);
  assert.deepEqual(g.signoffs.map((x) => [x.role, x.name, x.decision, x.at, x.stand_in, x.counted, x.applicable, x.na_reason]), ROLES.map((role) => [role, 'Mahmoud', 'Approved', NOW, false, true, true, null]));
  assert.deepEqual(Object.keys(g), ['pre_sdd_gate', 'gate_status', 'signoffs', 'conditions', 'exceptions', 'approved_at', 'authorized_to_start_sdd']);
  assert.ok(!('approved_by' in g));
  assert.deepEqual([bp.validation.export_status, bp.validation.sdd_source_intake], ['approved_technical_handoff', 'ready_for_reconciliation']);
  assert.equal(bp.project.project_status, 'G3 Approved');
  assert.equal(bp.sources.pre_sdd.approval_status, 'approved');
  const later = blueprintOf(resign(state, ROLES.slice(0, 3)));
  assert.equal(later.governance.approved_at, LATER, 'approved_at is the latest counted signature');
  const run = validatorRun(t, bp, ['--require-approved', '--require-sdd-intake']);
  if (run.skipped) return t.skip(run.skipped);
  assert.equal(run.status, 0, run.stdout);
  assert.doesNotMatch(run.stdout, /^FAIL/m);
});

test('handoffBlueprint_unsignedState_provisionalNotAuthorized', (t) => {
  const bp = blueprintOf(approvedState({ roles: [] }));
  const g = bp.governance;
  assert.deepEqual([g.pre_sdd_gate, g.gate_status, g.authorized_to_start_sdd, g.approved_at, g.signoffs], ['G2', 'provisional', false, null, []]);
  assert.deepEqual([bp.validation.export_status, bp.validation.sdd_source_intake, bp.validation.blockers], ['provisional', 'ready_for_reconciliation', []]);
  const partial = blueprintOf(approvedState({ roles: ROLES.slice(0, 2) }));
  assert.deepEqual(partial.governance.signoffs.map((x) => [x.role, x.counted]), ROLES.slice(0, 2).map((role) => [role, true]));
  assert.equal(partial.governance.approved_at, null);
  const quick = blueprintOf(apply(newProject(), [{ op: 'set-run', mode: 'quick' }]));
  assert.equal(quick.governance.authorized_to_start_sdd, false);
  const draft = blueprintOf(apply(approvedState({ roles: [] }), [{ op: 'open', entry: 'HDR-04.1' }]));
  assert.deepEqual([draft.governance.pre_sdd_gate, draft.governance.gate_status, draft.project.project_status, draft.sources.pre_sdd.approval_status, draft.validation.blockers], ['G0', 'draft', 'Draft', 'draft', []]);
  const g1 = blueprintOf(apply(approvedState({ roles: [] }), [{ op: 'remove-option', option: 'OPT-01' }]));
  assert.deepEqual([g1.governance.pre_sdd_gate, g1.governance.gate_status, g1.project.project_status], ['G1', 'provisional', 'G1']);
  const run = validatorRun(t, bp, ['--require-approved']);
  if (run.skipped) return t.skip(run.skipped);
  assert.equal(run.status, 2, run.stdout);
  assert.match(run.stdout, /^FAIL: Called with --require-approved/m);
});

test('handoffBlueprint_brdKeys_passPattern', () => {
  const bp = blueprintOf(newProject({ brds: BRDS }));
  assert.deepEqual(bp.sources.brds, [
    { key: 'REFUNDS', path: BRDS[0].path, version: '1.5', status: 'Approved' },
    { key: 'RESELLER-PORTAL', path: BRDS[1].path, version: '2.0', status: null },
  ]);
  for (const b of bp.sources.brds) assert.match(b.key, /^[A-Z0-9]+(-[A-Z0-9]+)*$/);
  assert.equal(blueprintOf(newProject()).sources.brds.length, 0);
});

test('handoffBlueprint_sources_engineAndSkillVersions_noSha', () => {
  const bp = blueprintOf(approvedState());
  assert.deepEqual(Object.keys(bp.sources), ['pre_sdd', 'brds', 'engine', 'skill']);
  assert.deepEqual(bp.sources.engine, { name: 'pre-sdd-engine', version: E.ENGINE_VERSION });
  assert.deepEqual(bp.sources.skill, { name: 'pre-sdd-unifier', version: E.SKILL_VERSION });
  assert.deepEqual(bp.sources.pre_sdd, { path: 'refunds-platform-pre-sdd-master.md', version: '1.0', approval_status: 'approved' });
  const text = JSON.stringify(bp);
  assert.doesNotMatch(text, /sha256|sdd_skill/);
});

test('handoffBlueprint_dat07_inRequirements', () => {
  const state = approvedState();
  const bp = blueprintOf(state);
  const dat07 = bp.requirements.find((r) => r.id === 'DAT-07.1');
  assert.deepEqual([dat07.item, dat07.group, dat07.value, dat07.status, dat07.kind], ['DAT-07', 'DAT', 'schema-isolated', 'estimated', 'target']);
  const entry = E.primaryEntry(state, 'DAT-07');
  const { status, ...fields } = entry;
  assert.deepEqual(Object.keys(dat07), ['id', 'item', 'group', ...Object.keys(entry)]);
  for (const [k, v] of Object.entries(fields)) assert.deepEqual(dat07[k], v, k);
  const all = [...E.HEADER_FIELDS, ...E.ITEMS].flatMap((row) => E.rowEntries(state, row.id).map((e) => E.entryId(row.id, e.n)));
  assert.deepEqual(bp.requirements.map((r) => r.id), all, 'one requirement per register entry, in register order, no overlay rows');
  const statuses = new Set(bp.requirements.map((r) => r.status));
  assert.ok([...statuses].every((s) => ['open', 'estimated', 'confirmed', 'not_applicable'].includes(s)), [...statuses].join());
  const na = blueprintOf(apply(state, [{ op: 'na', entry: 'DAT-09.1', reason: 'No tenant-level restore' }])).requirements.find((r) => r.id === 'DAT-09.1');
  assert.deepEqual([na.status, na.value, na.na_reason], ['not_applicable', null, 'No tenant-level restore']);
  const confirmed = bp.requirements.find((r) => r.id === 'CAP-01.1');
  assert.deepEqual([confirmed.status, confirmed.value, confirmed.confirmed_by], ['confirmed', 864000, 'Mahmoud']);
  const blank = bp.requirements.find((r) => r.id === 'CAP-03.1');
  assert.deepEqual([blank.value, blank.status, blank.window, blank.proposal], [null, 'open', null, null]);
});

test('handoffBlueprint_overlay_requirementsAndRolesOnlyWhileApplies', () => {
  const off = blueprintOf(approvedState());
  assert.ok(!off.requirements.some((r) => r.group === 'OVL'));
  assert.ok(!off.governance.signoffs.some((x) => x.role === 'migration_owner'));
  const state = apply(migrating(), [{ op: 'sign', role: 'migration_owner', decision: 'Approved' }]);
  const bp = blueprintOf(state);
  const overlay = bp.requirements.filter((r) => r.group === 'OVL');
  assert.equal(overlay.length, 24);
  assert.deepEqual(overlay.slice(0, 2).map((r) => [r.id, r.workload]), [['OVL-01.1', 'WL-01'], ['OVL-01.2', 'WL-02']]);
  assert.deepEqual(bp.governance.signoffs.map((x) => x.role).slice(-2), ['migration_owner', 'architecture_review_authority']);
  assert.match(bp.project.source_to_target, /^onprem to cloud$/);
  const items = new Set(bp.requirements.map((r) => r.item));
  const cited = [...bp.calculations.flatMap((c) => c.row_ids), ...bp.architecture.components.flatMap((n) => n.row_ids), ...bp.decisions.flatMap((d) => d.row_ids)];
  assert.ok(cited.every((id) => items.has(id)));
  const off2 = blueprintOf(apply(state, [{ op: 'set-overlay', applies: false }]));
  assert.ok(!off2.requirements.some((r) => r.group === 'OVL'));
  assert.ok(!off2.governance.signoffs.some((x) => x.role === 'migration_owner'), 'the migration owner record is left out while the overlay is off');
});

test('handoffBlueprint_conflictWithG311Done_exceptedAndApproved', () => {
  const state = conflicted();
  const model = E.compute(state, { now: LATER });
  assert.deepEqual(model.validation.conflicts.map((x) => x.id), ['CONFLICT-zone@az']);
  const reviewed = blueprintOf(state, LATER);
  assert.equal(reviewed.governance.gate_status, 'provisional', 'the decision is content, so G3 goes back to review');
  assert.equal(reviewed.sources.pre_sdd.approval_status, 'under_review');
  const signed = resign(state);
  const bp = blueprintOf(signed, LATER);
  const tick = signed.gate.checklist['G3-11'];
  assert.deepEqual(bp.conflicts, [{ id: 'CONFLICT-zone@az', left_source: 'REL-05.1', right_source: 'Target shape', description: model.validation.conflicts[0].msg, owner: model.validation.conflicts[0].owner, status: 'excepted', resolution: `Formally accepted under G3-11 by ${tick.by} on ${tick.at}.` }]);
  assert.deepEqual(bp.validation.conflicts, [{ id: 'CONFLICT-zone@az', message: model.validation.conflicts[0].msg, owner: model.validation.conflicts[0].owner, entry: null }]);
  assert.deepEqual([bp.governance.gate_status, bp.validation.export_status, bp.governance.approved_at], ['approved', 'approved_technical_handoff', LATER]);
  const open = apply(signed, [{ op: 'check', id: 'G3-11', status: 'Open' }], person, LATER);
  const ob = blueprintOf(open, LATER);
  assert.deepEqual(ob.conflicts.map((x) => [x.status, 'resolution' in x]), [['open', false]]);
  assert.deepEqual([ob.validation.export_status, ob.governance.gate_status], ['blocked', 'blocked']);
  assert.ok(ob.validation.blockers.some((x) => x.id === 'DT-15-BLOCK' && x.entry === null));
});

test('handoffBlueprint_conditionsAndExceptions_recorded', () => {
  const state = resign(apply(approvedState(), [CONDITION, { op: 'add-exception', entry: 'SEC-06.1', reason: 'Pen test booked', expires: '2026-12-31', review: '2026-12-15' }, { op: 'add-exception', entry: 'SEC-07.1', reason: 'Expired', expires: '2026-01-31', review: '2026-01-15' }]));
  const bp = blueprintOf(state, LATER);
  assert.deepEqual([bp.governance.gate_status, bp.governance.pre_sdd_gate, bp.validation.export_status], ['conditionally_approved', 'G3', 'approved_technical_handoff']);
  assert.deepEqual(bp.governance.conditions, [{ id: 'COND-01', text: CONDITION.text, owner: 'SRE lead', due: '2026-12-01' }]);
  assert.deepEqual(bp.governance.exceptions.map((x) => [x.id, x.entry, x.granted_by, x.valid]), [['EXC-01', 'SEC-06.1', 'Mahmoud', true], ['EXC-02', 'SEC-07.1', 'Mahmoud', false]]);
  assert.deepEqual(Object.keys(bp.governance.exceptions[0]), ['id', 'entry', 'reason', 'granted_by', 'granted_at', 'expires', 'review', 'valid']);
  const blocked = blueprintOf(resign(apply(approvedState(), [{ ...CONDITION, due: '' }])), LATER);
  assert.deepEqual([blocked.governance.gate_status, blocked.validation.export_status], ['blocked', 'provisional']);
});

test('handoffBlueprint_conditionalApproval_needsARecordedCondition', (t) => {
  const decided = apply(approvedState(), [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }]);
  const bare = blueprintOf(decided);
  assert.deepEqual([bare.governance.gate_status, bare.governance.authorized_to_start_sdd, bare.validation.export_status, bare.governance.conditions], ['blocked', false, 'provisional', []]);
  const recorded = apply(resign(apply(decided, [CONDITION], person, LATER)), [{ op: 'sign', role: 'data_owner', decision: 'Approved with conditions' }], person, LATER);
  const bp = blueprintOf(recorded, LATER);
  assert.deepEqual([bp.governance.gate_status, bp.governance.authorized_to_start_sdd, bp.validation.export_status, bp.governance.conditions.length], ['conditionally_approved', true, 'approved_technical_handoff', 1]);
  const audit = auditBlueprints(VALIDATOR, [bare, bp], studioDir, { require_approved: false });
  if (audit.skipped) return t.skip(audit.skipped);
  assert.deepEqual(audit.results.map((r) => r.failures), [[], []]);
  const run = validatorRun(t, bp, ['--require-approved']);
  assert.equal(run.status, 0, run.stdout);
});

test('handoffBlueprint_factorNa_validates', (t) => {
  const state = structuredClone(approvedState());
  Object.assign(E.primaryEntry(state, 'CAP-06').factors.requestKB, { value: null, status: 'N/A' });
  const bp = blueprintOf(state);
  const factor = bp.requirements.find((r) => r.id === 'CAP-06.1').factors.requestKB;
  assert.deepEqual([factor.status, factor.value], ['not_applicable', null]);
  const schema = validateWithSchema(SCHEMA, bp);
  if (schema.skipped) return t.skip(schema.skipped);
  assert.deepEqual(schema.errors, []);
  const run = validatorRun(t, bp);
  assert.equal(run.status, 0, run.stdout);
  assert.match(run.stdout, /^Schema \+ referential\/governance validator: PASS$/m);
});

test('handoffBlueprint_options_carryTheirRows', () => {
  const state = apply(optioned(), [{ op: 'decide', option: 'OPT-01' }]);
  const model = E.compute(state, { now: NOW });
  const bp = blueprintOf(state);
  assert.deepEqual(bp.calculations.map((c) => c.id), model.c.rows.filter((r) => !r.id.includes('@')).map((r) => r.id));
  assert.equal(bp.calculations.length, 20);
  assert.deepEqual(Object.keys(bp.options), ['horizon_months', 'weighted', 'flags', 'chosen_option', 'list']);
  assert.deepEqual([bp.options.horizon_months, bp.options.weighted, bp.options.chosen_option], [36, true, 'OPT-01']);
  const [one, two] = bp.options.list;
  assert.deepEqual(one.calculations.map((c) => [c.id, c.output.value]), [['CALC-21@OPT-01', 120000 + 36 * 9000], ['CALC-22@OPT-01', (3 * 4 + 2 * 3) / 5]]);
  assert.deepEqual(two.calculations.map((c) => [c.id, c.output.value, c.status]), [['CALC-21@OPT-02', null, 'open'], ['CALC-22@OPT-02', null, 'open']]);
  const { calculations, ...item } = one;
  assert.deepEqual(item, model.options.list[0]);
  const excluded = blueprintOf(apply(state, [{ op: 'decide', option: null }, { op: 'exclude-option', option: 'OPT-02', entry: 'BUS-07.1', reason: 'Breaks the EU data rule' }]));
  assert.deepEqual(excluded.options.list[1].failures.at(-1), { check: 'excluded', ref: 'BUS-07.1', message: 'Breaks the EU data rule' });
  assert.equal(excluded.options.chosen_option, null);
});

test('writers_importedFullRecord_listTwentyBaseCalculations', () => {
  let state = E.importV22(FULL_RECORD, OPTS);
  state = apply(state, [{ op: 'set-option', name: 'One region, multi-AZ' }, { op: 'set-option', name: 'Two regions, warm standby' }], agent);
  state = apply(state, ['OPT-01', 'OPT-02'].flatMap((option) => [{ op: 'set-cost', option, cost: 'one_time', value: 1000 }, { op: 'set-cost', option, cost: 'monthly', value: 10 }]).concat({ op: 'set-horizon', value: 12 }));
  const m = E.compute(state, { now: NOW });
  assert.equal(m.c.rows.length, 24);
  assert.ok(m.c.rows.filter((r) => r.id.startsWith('CALC-21@')).every((r) => E.known(r.result)), 'the option TCO rows hold results');
  const bp = E.handoffBlueprint(state, m, { now: NOW });
  const twenty = Array.from({ length: 20 }, (_, i) => `CALC-${String(i + 1).padStart(2, '0')}`);
  assert.deepEqual(bp.calculations.map((c) => c.id), twenty);
  assert.deepEqual(bp.options.list.flatMap((o) => o.calculations.map((c) => c.id)), ['CALC-21@OPT-01', 'CALC-22@OPT-01', 'CALC-21@OPT-02', 'CALC-22@OPT-02']);
  const table = E.fragments(state, m, { now: NOW })['04-calculations.md'];
  assert.deepEqual(table.split('\n').filter((line) => line.startsWith('| CALC-')).map((line) => line.split(' ')[1]), twenty);
  assert.equal(m.c.rows.length, 24, 'the writers leave the model as it was');
});

test('writers_everyOutput_noEmOrEnDash', () => {
  const states = [newProject(), approvedState(), optioned(), conflicted(), migrating(), E.importV22(FULL_RECORD, OPTS), ...['regional-zero', 'local-zero', 'demo'].map((name) => E.importV22(goldenCase(name).projectState, OPTS))];
  for (const state of states) {
    const model = E.compute(state, { now: LATER });
    const texts = [
      JSON.stringify(E.handoffBlueprint(state, model, { now: LATER })),
      JSON.stringify(E.saveWrapper(state, model, { now: LATER })),
      ...Object.values(E.previewFiles(state, model, { now: LATER })),
      ...Object.values(E.fragments(state, model, { now: LATER })),
      ...Object.values(model.graph.diagrams).flatMap((d) => [E.mermaid(d), E.diagramSVG(d)]),
      E.drawio(model.graph.diagrams, { now: LATER }),
    ];
    built.push(JSON.parse(texts[0]));
    texts.forEach((text, i) => assert.doesNotMatch(text, DASH, `${state.project.name}: output ${i}`));
  }
  for (const provider of ['aws', 'azure', 'gcp', 'onprem']) {
    const v = { ...E.defaults, ...E.presets.regionalPayments };
    const c = E.calculations(v);
    const a = E.selectArchitecture(v, c);
    const graph = E.buildDiagrams(v, c, a, provider, { extras: [] });
    for (const d of Object.values(graph.diagrams)) {
      assert.doesNotMatch(E.mermaid(d) + E.diagramSVG(d), DASH, `${provider}: ${d.id}`);
      assert.match(d.summary, /Provider names are illustration only/, `${provider}: ${d.id}`);
    }
    assert.doesNotMatch(E.drawio(graph.diagrams, { now: NOW }), DASH, provider);
  }
});

test('writers_sharedText_threeZeroHouseText', () => {
  const d = { id: 'infrastructure', title: 'Infra', width: 10, height: 10, groups: [], nodes: [{ id: 'APP-A', title: 'App', subtitle: 'Tier `x`', x: 0, y: 0, w: 1, h: 1, kind: 'compute' }], edges: [] };
  assert.equal(E.mermaid(d).split('\n')[1], '  %% Infra - PROPOSED / NOT AN APPROVED DESIGN');
  assert.doesNotMatch(E.mermaid(d), /`/);
  const x = E.drawio({ infrastructure: d }, { now: NOW });
  assert.match(x, /agent="Pre-SDD Architecture Studio 3\.0\.0"/);
  assert.match(x, /value="App - Tier `x` \(PROPOSED\)"/);
  assert.match(x, /modified="2026-10-23T11:01:02\.000Z"/);
  const logical = E.buildDiagrams({ ...E.defaults }, E.calculations(E.defaults), E.selectArchitecture(E.defaults, E.calculations(E.defaults)), 'logical', { extras: [] });
  assert.ok(Object.values(logical.diagrams).every((g) => !/illustration only/.test(g.summary)), 'the logical view names no provider');
});

test('handoffBlueprint_frozenInputs_notMutated', () => {
  for (const state of [optioned(), migrating(), conflicted()]) {
    const model = E.compute(state, { now: LATER });
    const before = JSON.stringify([state, model]);
    deepFreeze(state);
    deepFreeze(model);
    const once = E.handoffBlueprint(state, model, { now: LATER });
    E.saveWrapper(state, model, { now: LATER });
    E.previewFiles(state, model, { now: LATER });
    E.fragments(state, model, { now: LATER });
    assert.equal(JSON.stringify([state, model]), before);
    assert.deepEqual(E.handoffBlueprint(state, model, { now: LATER }), once, 'the same inputs give the same blueprint');
  }
});

test('previewFiles_manifest_previewAndLockedFlags', () => {
  const state = approvedState();
  const model = E.compute(state, { now: NOW });
  const files = E.previewFiles(state, model, { now: NOW });
  const names = Object.keys(files);
  const diagrams = Object.keys(E.filteredGraph(model.graph, model.v, E.toCalcInputs(state).ctx).diagrams);
  assert.deepEqual(names, [...PREVIEW, ...diagrams.map((id) => `diagrams/${id}.mmd`), 'diagrams/architecture.drawio', 'Validation_Report.md', 'Decision_Record.md', 'manifest.json']);
  const manifest = JSON.parse(files['manifest.json']);
  assert.deepEqual([manifest.preview_only, manifest.pre_sdd_of_record, manifest.pre_sdd_locked_for_sdd, manifest.sdd_raises_open_items_on_conflict], [true, false, true, true]);
  assert.deepEqual(manifest.files, names);
  assert.equal(manifest.generated_at, NOW);
  assert.equal(manifest.version, E.ENGINE_VERSION);
  assert.deepEqual(manifest.exported_diagram_ids, diagrams);
  const preview = files['Pre-SDD-preview.md'];
  const first = preview.split('\n')[0];
  assert.match(first, /preview/i);
  assert.match(first, /not the Pre-SDD of record/);
  assert.match(preview, /locked for the SDD/);
  assert.match(preview, /open item owned by the E2E Architect/);
  assert.match(preview, /illustration only/);
  for (const [name, body] of Object.entries(files)) {
    assert.ok(body.endsWith('\n'), `${name} ends with a newline`);
    assert.ok(!body.includes('\r'), `${name} has LF line endings`);
  }
  const bp = JSON.parse(files['architecture-blueprint.json']);
  built.push(bp);
  assert.deepEqual(bp, E.handoffBlueprint(state, model, { now: NOW }));
  assert.equal(files['architecture-blueprint.yaml'], `${E.yaml(bp)}\n`);
  assert.deepEqual(JSON.parse(files['project-state.json']), state);
});

test('previewFiles_noRunBrief', (t) => {
  const state = migrating();
  const model = E.compute(state, { now: NOW });
  const files = E.previewFiles(state, model, { now: NOW });
  assert.ok(!Object.keys(files).some((name) => /brief/i.test(name)), Object.keys(files).join(', '));
  assert.ok(!Object.values(files).some((body) => /Run Brief|Run_Brief/i.test(body)));
  built.push(JSON.parse(files['architecture-blueprint.json']));
  const run = withTemp((dir) => {
    writeSet(dir, files);
    return runValidator(VALIDATOR, join(dir, 'architecture-blueprint.json'));
  });
  if (run.skipped) return t.skip(run.skipped);
  assert.equal(run.status, 0, run.stdout);
  assert.doesNotMatch(run.stdout, /^(WARN|FAIL): .*Mermaid/m, 'every diagram file is in the set and shows its canonical node IDs');
});

test('zipStored_dosTime_fromUtc', async () => {
  const prior = process.env.TZ;
  process.env.TZ = 'Pacific/Auckland';
  try {
    const now = '2026-10-23T23:30:00Z';
    assert.notEqual(new Date(now).getDate(), new Date(now).getUTCDate(), 'the local and UTC dates differ here');
    const bytes = new Uint8Array(await E.zipStored({ 'a.txt': 'hi' }, { now }).arrayBuffer());
    const u16 = (n) => [n & 255, (n >>> 8) & 255];
    const u32 = (n) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
    const time = (23 << 11) | (30 << 5);
    const date = ((2026 - 1980) << 9) | (10 << 5) | 23;
    const name = [...'a.txt'].map((ch) => ch.charCodeAt(0));
    const crc = 0xd8932aac;
    const local = [...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(time), ...u16(date), ...u32(crc), ...u32(2), ...u32(2), ...u16(5), ...u16(0), ...name, 104, 105];
    const central = [...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(time), ...u16(date), ...u32(crc), ...u32(2), ...u32(2), ...u16(5), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(0), ...name];
    const end = [...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(1), ...u16(1), ...u32(central.length), ...u32(local.length), ...u16(0)];
    assert.deepEqual([...bytes], [...local, ...central, ...end]);
  } finally {
    if (prior === undefined) delete process.env.TZ;
    else process.env.TZ = prior;
  }
});

test('saveWrapper_readSave_roundTrips', () => {
  const state = optioned();
  const model = E.compute(state, { now: NOW });
  const save = E.saveWrapper(state, model, { now: NOW });
  assert.deepEqual(Object.keys(save), ['kind', 'saved_at', 'project_state', 'blueprint']);
  assert.deepEqual([save.kind, save.saved_at], ['pre-sdd-save', NOW]);
  assert.deepEqual(save.project_state, state);
  assert.deepEqual(save.blueprint, E.handoffBlueprint(state, model, { now: NOW }));
  built.push(save.blueprint);
  const text = `${JSON.stringify(save, null, 2)}\n`;
  assert.deepEqual(E.readSave(text), { state, blueprint: save.blueprint });
  assert.deepEqual(E.readSave(JSON.parse(text)), { state, blueprint: save.blueprint });
  assert.deepEqual(E.normalizeState(E.readSave(text).state, { now: NOW }).state.register, E.normalizeState(state, { now: NOW }).state.register);
  const stamped = E.saveWrapper(state, model, { now: '2026-10-23T13:01:02+02:00' });
  assert.equal(stamped.saved_at, NOW, 'saved_at is UTC');
});

test('readSave_bareState_throwsActionableError', () => {
  const state = newProject();
  const model = E.compute(state, { now: NOW });
  const save = E.saveWrapper(state, model, { now: NOW });
  assert.throws(() => E.readSave(state), (error) => /not a save file/.test(error.message) && /project state/.test(error.message) && /save file/.test(error.message));
  assert.throws(() => E.readSave(JSON.stringify(state)), /not a save file/);
  assert.throws(() => E.readSave(save.blueprint), (error) => /architecture-blueprint\.json/.test(error.message) && /save file/.test(error.message));
  assert.throws(() => E.readSave(goldenCase('demo').projectState), (error) => /Studio v2\.2/.test(error.message) && /import/.test(error.message));
  const { project_state, ...noState } = save;
  assert.throws(() => E.readSave(noState), (error) => /project_state/.test(error.message) && /save/.test(error.message));
  assert.throws(() => E.readSave({ kind: 'something-else' }), /not a save file/);
  assert.throws(() => E.readSave([1, 2]), /not a save file/);
  assert.throws(() => E.readSave(null), /not a save file/);
});

test('readSave_notJson_throwsActionableError', () => {
  for (const text of ['{not json', '', 'pre-sdd-save']) assert.throws(() => E.readSave(text), (error) => /not JSON/.test(error.message) && /save file/.test(error.message), JSON.stringify(text));
});

test('validateHandoff_tamperedBlueprints_fail', (t) => {
  const good = E.handoffBlueprint(approvedState(), E.compute(approvedState(), { now: NOW }), { now: NOW });
  const tamper = (fn) => {
    const bp = structuredClone(good);
    fn(bp);
    return bp;
  };
  const docs = [
    good,
    tamper((bp) => { bp.calculations[0].row_ids.push('OVL-04'); }),
    tamper((bp) => { bp.governance.gate_status = 'provisional'; }),
    tamper((bp) => { bp.governance.signoffs = []; }),
    tamper((bp) => { bp.governance.gate_status = 'conditionally_approved'; }),
    tamper((bp) => { bp.governance.gate_status = 'conditionally_approved'; bp.governance.conditions = [{ id: 'COND-01', text: 'Load test', owner: null, due: '2026-12-01' }]; }),
    tamper((bp) => { bp.conflicts = [{ id: 'CONFLICT-zone@az', left_source: 'REL-05.1', right_source: 'Target shape', description: 'x', owner: 'y', status: 'open' }]; }),
    tamper((bp) => { bp.governance.authorized_to_start_sdd = false; }),
    tamper((bp) => { bp.requirements[0].stray = true; }),
    tamper((bp) => { bp.sources.brds[0].key = 'refunds'; }),
    tamper((bp) => { bp.conflicts = [{ id: 'C', left_source: 'REL-05', right_source: 'Target shape', description: 'x', owner: 'y', status: 'resolved' }]; }),
    tamper((bp) => { bp.options.list.push({ ...bp.options.list[0], calculations: [{ ...bp.options.list[0].calculations[0], row_ids: ['XYZ-01'] }] }); }),
  ];
  const audit = auditBlueprints(VALIDATOR, docs, studioDir);
  if (audit.skipped) return t.skip(audit.skipped);
  const failures = audit.results.map((r) => r.failures);
  assert.deepEqual(failures[0], []);
  const expected = [/references missing row OVL-04/, /requires Pre-SDD G3 Approved/, /at least one counted sign-off/, /must document the conditions/, /owner and a due date/, /unresolved known source conflicts/, /explicit authority to start SDD/, /^SCHEMA: /, /^SCHEMA: /, /^SCHEMA: /, /^SCHEMA: /];
  expected.forEach((pattern, i) => assert.ok(failures[i + 1].some((f) => pattern.test(f)), `${i + 1}: ${failures[i + 1].join(' | ')}`));
  const unreadable = withTemp((dir) => {
    writeFileSync(join(dir, 'bad.json'), '{not json');
    return runValidator(VALIDATOR, join(dir, 'bad.json'));
  });
  if (unreadable.skipped) return t.skip(unreadable.skipped);
  assert.equal(unreadable.status, 3, unreadable.stdout + unreadable.stderr);
});

test('blueprintSchema_generator_upToDate', async () => {
  const { blueprintSchemaText } = await import('../tools/blueprint-schema.mjs');
  assert.equal(blueprintSchemaText(), readText(SCHEMA), 'architecture-blueprint.schema.json is out of date: run node tools/blueprint-schema.mjs');
  const schema = JSON.parse(readText(SCHEMA));
  const open = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${path}/${i}`));
    if (!node || typeof node !== 'object') return;
    if (node.type === 'object' && node.additionalProperties !== false && !node.$ref) open.push(path);
    for (const [k, v] of Object.entries(node)) walk(v, `${path}/${k}`);
  };
  walk(schema, '');
  assert.deepEqual(open, [], 'every object the schema defines is closed');
});

test('handoffBlueprint_everyTestBlueprint_validates', (t) => {
  assert.ok(built.length >= 30, `built ${built.length} blueprints`);
  const audit = auditBlueprints(VALIDATOR, built, studioDir);
  if (audit.skipped) return t.skip(audit.skipped);
  audit.results.forEach((r, i) => assert.deepEqual(r.failures, [], `blueprint ${i} (${built[i].project.name}, ${built[i].governance.gate_status})`));
  const schema = validateWithSchema(SCHEMA, built[0]);
  assert.deepEqual(schema.errors, []);
});
