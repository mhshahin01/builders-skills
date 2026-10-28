import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, readText } from './helpers.mjs';
import { validateAllWithSchema } from './pyschema.mjs';
import { buildStudio } from '../build.mjs';
import { SCHEMA_KEYWORDS, checkSchema, pickSavedState } from '../cli.mjs';

const E = loadEngine();
const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(studioDir, 'cli.mjs');
const NOW = '2026-10-23T11:01:02Z';
const LATER = '2026-10-24T08:30:00Z';
const AT = ['--now', NOW];
const BRD_PATH = 'C:/Work Files/brd@refunds/refunds-brd-master.md';
const REL_PATH = '../brd-reseller@2/reseller-brd-master.md';
const person = { type: 'person', name: 'Mahmoud' };
const agent = { type: 'agent', name: 'pre-sdd-unifier' };
const HOSTILE = "</script><!-- $& $' \u2028 \u2029 /* UI */ /* ENGINE */ /* STYLES */ /* PROJECT_STATE */ x";
const STATE_SCHEMA = join(studioDir, 'schema', 'project-state.schema.json');
const BLUEPRINT_SCHEMA = join(studioDir, 'schema', 'architecture-blueprint.schema.json');

function temp(t) {
  const dir = mkdtempSync(join(tmpdir(), 'pre sdd cli '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function cli(args) {
  const run = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8', windowsHide: true });
  return { code: run.status, out: run.stdout, err: run.stderr };
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  return path;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function project(t, extra = [], name = 'Refunds platform') {
  const dir = join(temp(t), 'pre-sdd-refunds platform');
  const run = cli(['new', dir, '--name', name, '--slug', 'refunds-platform', '--brd', `REFUNDS=${BRD_PATH}@1.5:Approved`, '--brd', `RESELLER-PORTAL=${REL_PATH}@2.0`, ...AT, ...extra]);
  assert.equal(run.code, 0, run.err);
  return { dir, root: dirname(dir), stateFile: join(dir, 'studio', 'project-state.json'), run };
}

function derive(stateFile, patch, extra = []) {
  const args = ['derive', stateFile, ...AT, ...extra];
  if (patch) args.push('--apply', writeJson(join(dirname(stateFile), 'patches', `p${Math.random().toString(36).slice(2)}.json`), patch));
  const run = cli(args);
  return { ...run, summary: JSON.parse(run.out) };
}

function scripts(html) {
  return [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].map(([, attrs, body]) => ({ attrs, body }));
}

function computed(stateFile, now = NOW) {
  const state = readJson(stateFile);
  const model = E.compute(state, { now });
  return { state, model, blueprint: E.handoffBlueprint(state, model, { now }) };
}

test('cli_new_pathWithSpaces_writesState', (t) => {
  const { stateFile, run } = project(t);
  assert.ok(existsSync(stateFile));
  const bytes = readFileSync(stateFile, 'utf8');
  assert.equal(bytes.includes('\r'), false);
  assert.ok(bytes.endsWith('}\n'));
  const state = JSON.parse(bytes);
  assert.equal(state.kind, 'pre-sdd-project-state');
  assert.equal(state.project.slug, 'refunds-platform');
  assert.deepEqual(state.project.brds, [
    { key: 'REFUNDS', path: BRD_PATH, version: '1.5', status: 'Approved' },
    { key: 'RESELLER-PORTAL', path: REL_PATH, version: '2.0', status: null },
  ]);
  assert.deepEqual([state.run.mode, state.run.input, state.run.light], ['full', 'prompt', false]);
  assert.equal(E.primaryEntry(state, 'CAP-08').source.text, 'Default: project rule CAP-08');
  assert.equal(E.primaryEntry(state, E.FACTORS.utilization.row).factors.utilization.source.text, 'Default: policy appendix v1');
  assert.doesNotThrow(() => E.normalizeState(state, { now: NOW }));
  const summary = JSON.parse(run.out);
  assert.equal(summary.state, stateFile);
  assert.deepEqual(summary.gate, E.compute(state, { now: NOW }).gate);
  assert.equal(summary.counts.open + summary.counts.estimated + summary.counts.confirmed + summary.counts.na, Object.values(state.register.items).flat().length + Object.values(state.register.header).flat().length);
});

test('cli_new_optionsAndImport_followFlags', async (t) => {
  const golden = join(studioDir, 'tests', 'golden', 'regional-zero', 'project-state.json');
  const fromJson = project(t, ['--mode', 'quick', '--input', 'web', '--light', '--import', golden]);
  const state = readJson(fromJson.stateFile);
  assert.deepEqual([state.run.mode, state.run.input, state.run.light], ['quick', 'web', true]);
  assert.equal(state.project.brds.length, 2);
  assert.equal(E.primaryEntry(state, 'CAP-01').source.text, 'Import: Studio v2.2');
  const zipDir = temp(t);
  const zip = join(zipDir, 'v22 export.zip');
  writeFileSync(zip, new Uint8Array(await E.zipStored({ 'project-state.json': readText(golden) }, { now: NOW }).arrayBuffer()));
  const fromZip = project(t, ['--import', zip]);
  assert.deepEqual(E.primaryEntry(readJson(fromZip.stateFile), 'CAP-01').value, E.primaryEntry(state, 'CAP-01').value);
});

test('cli_new_existingState_exit2', (t) => {
  const { dir, stateFile } = project(t);
  const before = readFileSync(stateFile);
  const again = cli(['new', dir, '--name', 'Other', '--slug', 'other', '--brd', 'A=a.md@1.0', ...AT]);
  assert.equal(again.code, 2);
  assert.match(again.err, /already exists/);
  assert.deepEqual(readFileSync(stateFile), before);
});

test('cli_derive_applyPatch_printsSummary', (t) => {
  const { stateFile } = project(t);
  const run = derive(stateFile, { actor: person, ops: [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'CAP-04.1', value: 5 }] });
  assert.equal(run.code, 0, run.err);
  assert.deepEqual(Object.keys(run.summary), ['changes', 'errors', 'counts', 'gate', 'notes']);
  assert.deepEqual(run.summary.errors, []);
  assert.deepEqual(run.summary.changes.map((c) => [c.target, c.actor.name]), [['CAP-01.1', 'Mahmoud'], ['CAP-04.1', 'Mahmoud'], ['CAP-02.1', 'pre-sdd-engine']]);
  const state = readJson(stateFile);
  assert.equal(E.primaryEntry(state, 'CAP-02').value, 165);
  assert.equal(E.primaryEntry(state, 'CAP-02').source.text, 'Derived: CALC-03 from CAP-01, CAP-04, CAP-02');
  assert.deepEqual(run.summary.gate, E.compute(state, { now: NOW }).gate);
  assert.equal(run.summary.counts.estimated, Object.values(state.register.header).concat(Object.values(state.register.items)).flat().filter((e) => e.status === 'Estimated').length);
  const quiet = derive(stateFile);
  assert.equal(quiet.code, 0);
  assert.deepEqual(quiet.summary.changes, []);
});

test('cli_derive_policyOnFactRow_exit2ListsError', (t) => {
  const { stateFile } = project(t);
  assert.equal(derive(stateFile, { actor: person, ops: [{ op: 'set-policy', policy: { label: 'House answers', stand_ins: [] } }] }).code, 0);
  const before = readFileSync(stateFile);
  const run = derive(stateFile, { actor: { type: 'policy' }, ops: [{ op: 'set', entry: 'BUS-01.1', value: 'Faster refunds' }, { op: 'set', entry: 'CAP-01.1', value: 864000 }] });
  assert.equal(run.code, 2);
  assert.equal(run.summary.errors.length, 1);
  assert.equal(run.summary.errors[0].index, 1);
  assert.equal(run.summary.errors[0].target, 'CAP-01.1');
  assert.match(run.summary.errors[0].message, /fact/i);
  assert.deepEqual(run.summary.changes, []);
  assert.deepEqual(readFileSync(stateFile), before);
});

test('cli_derive_signWithContentChange_saysSignAgain', (t) => {
  const { stateFile } = project(t);
  const role = E.SIGNOFF_ROLES[0].key;
  const run = derive(stateFile, { actor: person, ops: [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'CAP-04.1', value: 5 }, { op: 'sign', role, decision: 'Approved' }] });
  assert.equal(run.code, 0, run.err);
  assert.equal(run.summary.notes.filter((n) => /sign again/i.test(n) && n.includes(role)).length, 1);
  const alone = derive(stateFile, { actor: person, ops: [{ op: 'sign', role, decision: 'Approved' }] });
  assert.equal(alone.code, 0);
  assert.equal(alone.summary.notes.some((n) => /sign again/i.test(n)), false);
});

test('cli_derive_removePrimaryWorkload_reportsError', (t) => {
  const { stateFile } = project(t);
  const run = derive(stateFile, { actor: person, ops: [{ op: 'remove-workload', id: 'WL-01' }] });
  assert.equal(run.code, 2);
  assert.equal(run.summary.errors.length, 1);
  assert.equal(run.summary.errors[0].op, 'remove-workload');
  assert.match(run.summary.errors[0].message, /WL-01/);
});

test('cli_derive_engineTextsAndName_refused', (t) => {
  const { stateFile } = project(t);
  const before = readFileSync(stateFile);
  const own = derive(stateFile, { actor: agent, ops: [{ op: 'set', entry: 'BUS-01.1', value: 'Faster refunds', source: { type: 'brd', text: 'BRD: REFUNDS/BUS-01' } }, { op: 'set', entry: 'CAP-02.1', value: 120, source: { type: 'derived', text: 'Derived: CALC-03 from CAP-01, CAP-04, CAP-02' } }, { op: 'set-factor', entry: `${E.FACTORS.utilization.row}.1`, factor: 'utilization', value: 0.7, source: { type: 'default', text: ' Default: policy appendix v1 ' } }, { op: 'set', entry: 'OPS-04.1', value: 'dev, prod', source: { type: 'default', text: 'Default: project rule OPS-04' } }, { op: 'confirm', entry: 'BUS-01.1' }] });
  assert.equal(own.code, 2);
  assert.deepEqual(own.summary.errors.map((e) => e.index), [1, 2, 3, 4]);
  assert.ok(own.summary.errors.slice(0, 3).every((e) => /engine/.test(e.message)));
  assert.equal(own.summary.errors[3].op, 'confirm');
  const named = derive(stateFile, { actor: { type: 'agent', name: 'Pre-SDD-Engine' }, ops: [{ op: 'set', entry: 'BUS-01.1', value: 'Faster refunds', source: { type: 'brd', text: 'BRD: REFUNDS/BUS-01' } }] });
  assert.equal(named.code, 2);
  assert.match(named.summary.errors[0].message, /pre-sdd-engine/);
  assert.deepEqual(readFileSync(stateFile), before);
  const every = derive(stateFile, { actor: agent, ops: E.ENGINE_SOURCE_TEXTS.map((text) => ({ op: 'set', entry: 'BUS-01.1', value: 'Faster refunds', source: { type: text.startsWith('Derived') ? 'derived' : 'default', text } })) });
  assert.equal(every.code, 2);
  assert.deepEqual(every.summary.errors.map((e) => e.index), E.ENGINE_SOURCE_TEXTS.map((_, i) => i));
  assert.equal(derive(stateFile, { actor: agent, ops: [{ op: 'set', entry: 'CAP-02.1', value: 120, source: { type: 'derived', text: 'Derived: BRD peak of 120 req/s' } }, { op: 'set', entry: 'BUS-01.1', value: 'Faster refunds', source: { type: 'derived', text: 'Derived: CALC-99 from CAP-01' } }] }).code, 0);
});

test('cli_derive_engineClearUnderPersonKind_notesReason', (t) => {
  const { stateFile } = project(t);
  assert.equal(derive(stateFile, { actor: person, ops: [{ op: 'set', entry: 'CAP-01.1', value: 864000 }, { op: 'set', entry: 'CAP-04.1', value: 5 }] }).code, 0);
  assert.equal(derive(stateFile, { actor: person, ops: [{ op: 'set', entry: 'CAP-02.1', kind: 'target', reason: 'Our own target' }] }).code, 0);
  const run = derive(stateFile, { actor: person, ops: [{ op: 'set', entry: 'CAP-01.1', value: 900000 }] });
  assert.equal(run.code, 0);
  const notes = run.summary.notes.filter((n) => n.startsWith('CAP-02.1'));
  assert.equal(notes.length, 1);
  assert.match(notes[0], /kind/);
  assert.match(notes[0], /target/);
  const missing = derive(stateFile, { actor: person, ops: [{ op: 'set', entry: 'CAP-02.1', kind: 'forecast', reason: 'Back to the engine' }] });
  assert.equal(missing.code, 0);
  assert.ok(E.primaryEntry(readJson(stateFile), 'CAP-02').value > 165);
  const cleared = derive(stateFile, { actor: person, ops: [{ op: 'set', entry: 'CAP-01.1', value: '' }] });
  assert.match(cleared.summary.notes.find((n) => n.startsWith('CAP-02.1')), /an input is missing/);
});

test('cli_derive_invalidState_exit2PlainWords', (t) => {
  const { stateFile } = project(t);
  const state = readJson(stateFile);
  delete state.register.items['CAP-01'];
  writeJson(stateFile, state);
  const before = readFileSync(stateFile);
  const run = derive(stateFile, { actor: person, ops: [{ op: 'sign', role: E.SIGNOFF_ROLES[0].key, decision: 'Approved' }] });
  assert.equal(run.code, 2);
  assert.deepEqual(run.summary.changes, []);
  assert.ok(run.summary.errors.some((e) => /register\.items\.CAP-01/.test(e.message)));
  assert.equal(run.summary.errors.some((e) => /TypeError|undefined/.test(e.message)), false);
  assert.deepEqual(readFileSync(stateFile), before);
});

test('cli_derive_normalizesFirst_notesAdvisory', (t) => {
  const { stateFile } = project(t);
  const state = readJson(stateFile);
  Object.assign(E.primaryEntry(state, 'BUS-01'), { value: 'Faster refunds', status: 'Confirmed', source: { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' } });
  writeJson(stateFile, state);
  const run = derive(stateFile);
  assert.equal(run.code, 0, run.err);
  assert.ok(run.summary.notes.some((n) => n.includes('BUS-01.1') && /Estimated/.test(n)));
  assert.equal(E.primaryEntry(readJson(stateFile), 'BUS-01').status, 'Estimated');
});

test('cli_compute_writesModelBlueprintFragmentsDiagrams', (t) => {
  const { stateFile, root } = project(t);
  const out = join(root, 'compute out');
  mkdirSync(join(out, 'fragments'), { recursive: true });
  writeFileSync(join(out, 'fragments', '08-overlay.md'), 'stale\n');
  const run = cli(['compute', stateFile, '--out', out, ...AT]);
  assert.equal(run.code, 0, run.err);
  const { state, model, blueprint } = computed(stateFile);
  assert.deepEqual(readJson(join(out, 'blueprint.json')), JSON.parse(JSON.stringify(blueprint)));
  assert.equal(readJson(join(out, 'blueprint.json')).validation.checked_at, NOW);
  assert.equal(readText(join(out, 'blueprint.yaml')), `${E.yaml(blueprint)}\n`);
  assert.deepEqual(readJson(join(out, 'model.json')), JSON.parse(JSON.stringify(model)));
  const fragments = E.fragments(state, model, { now: NOW });
  assert.deepEqual(readdirSync(join(out, 'fragments')).sort(), Object.keys(fragments).sort());
  for (const [name, body] of Object.entries(fragments)) assert.equal(readText(join(out, 'fragments', name)), body);
  const graph = E.filteredGraph(model.graph, model.v, E.toCalcInputs(state).ctx);
  const ids = Object.keys(graph.diagrams);
  assert.deepEqual(readdirSync(join(out, 'diagrams')).sort(), [...ids.map((id) => `${id}.mmd`), 'architecture.drawio'].sort());
  for (const id of ids) assert.equal(readText(join(out, 'diagrams', `${id}.mmd`)), E.mermaid(graph.diagrams[id]));
  assert.equal(readText(join(out, 'diagrams', 'architecture.drawio')), `${E.drawio(graph.diagrams, { now: NOW })}\n`);
  for (const name of ['model.json', 'blueprint.json', 'blueprint.yaml']) assert.equal(readFileSync(join(out, name), 'utf8').includes('\r'), false);
  assert.deepEqual(blueprint.diagrams.map((d) => d.mermaid_file), ids.map((id) => `diagrams/${id}.mmd`));
  const summary = JSON.parse(run.out);
  assert.equal(summary.gate, model.gate.label);
});

test('cli_validate_detectsFourKinds', (t) => {
  const { stateFile, root } = project(t);
  const { state, model, blueprint } = computed(stateFile);
  const files = {
    'a Pre-SDD 3.0 project state': stateFile,
    'a Studio save file': writeJson(join(root, 'saves', 'pre-sdd-refunds-platform-state-20261023T110102Z.json'), E.saveWrapper(state, model, { now: NOW })),
    'a Studio v2.2 project file': join(studioDir, 'tests', 'golden', 'regional-zero', 'project-state.json'),
    'an architecture blueprint': writeJson(join(root, 'bp', 'blueprint.json'), blueprint),
  };
  for (const [kind, file] of Object.entries(files)) {
    const run = cli(['validate', file, ...AT]);
    assert.equal(run.code, 0, `${kind}: ${run.out}${run.err}`);
    const lines = run.out.trimEnd().split('\n');
    assert.equal(lines[0], `PASS kind: ${kind}`);
    assert.ok(lines.every((line) => line.startsWith('PASS ')), run.out);
  }
  const other = cli(['validate', writeJson(join(root, 'other.json'), { hello: 'world' }), ...AT]);
  assert.equal(other.code, 2);
  assert.match(other.out, /^FAIL kind: /);
});

test('cli_validate_invalidState_exit2', (t) => {
  const { stateFile } = project(t);
  const state = readJson(stateFile);
  delete state.register.items['CAP-01'];
  state.register.items['REL-03'][0].primary = false;
  writeJson(stateFile, state);
  const run = cli(['validate', stateFile, ...AT]);
  assert.equal(run.code, 2);
  const fails = run.out.split('\n').filter((line) => line.startsWith('FAIL state gate: '));
  assert.ok(fails.some((line) => line.includes('register.items.CAP-01')));
  assert.ok(fails.some((line) => line.includes('REL-03.1')));
  assert.equal(/TypeError|undefined/.test(run.out), false);
  const broken = join(dirname(stateFile), 'broken.json');
  writeFileSync(broken, '{ not json');
  const notJson = cli(['validate', broken, ...AT]);
  assert.equal(notJson.code, 2);
  assert.match(notJson.out, /^FAIL /);
});

test('cli_validate_schemaChecks_agreeWithJsonschema', (t) => {
  const { stateFile, root } = project(t);
  const { state, blueprint } = computed(stateFile);
  const states = [state, { ...state, extra: 1 }, { ...state, project: { ...state.project, slug: 'Bad Slug' } }];
  const blueprints = [blueprint, { ...blueprint, governance: { ...blueprint.governance, gate_status: 'nope' } }, { ...blueprint, options: { ...blueprint.options, horizon_months: -3 } }];
  const verdicts = (docs, name) => docs.map((doc, i) => {
    const run = cli(['validate', writeJson(join(root, name, `${i}.json`), doc), ...AT]);
    return run.out.split('\n').some((line) => /^FAIL [a-z ]*schema: /.test(line));
  });
  assert.deepEqual(verdicts(states, 'states'), [false, true, true]);
  assert.deepEqual(verdicts(blueprints, 'blueprints'), [false, true, true]);
  for (const [schema, docs, cliVerdicts] of [[STATE_SCHEMA, states, verdicts(states, 'states2')], [BLUEPRINT_SCHEMA, blueprints, verdicts(blueprints, 'blueprints2')]]) {
    const python = validateAllWithSchema(schema, docs);
    if (python.skipped) {
      t.diagnostic(python.skipped);
      continue;
    }
    assert.deepEqual(python.errors.map((errors) => errors.length > 0), cliVerdicts);
  }
});

test('cli_validate_usage_positionalOrPick_exactlyOne', (t) => {
  const { stateFile, root } = project(t);
  assert.equal(cli(['validate', stateFile, '--pick', root, '--slug', 'refunds-platform', '--since', NOW]).code, 3);
  assert.equal(cli(['validate']).code, 3);
  assert.equal(cli(['validate', '--pick', root, '--since', NOW]).code, 3);
  assert.equal(cli(['validate', '--pick', root, '--slug', 'refunds-platform']).code, 3);
  assert.equal(cli(['validate', stateFile, '--slug', 'refunds-platform']).code, 3);
});

test('cli_validate_pick_printsPickedFileFirst', (t) => {
  const { stateFile, root } = project(t);
  const { state, model } = computed(stateFile);
  const downloads = join(root, 'My Downloads');
  const save = E.saveWrapper(state, model, { now: NOW });
  const at = (name, iso) => {
    const file = writeJson(join(downloads, name), save);
    utimesSync(file, new Date(iso), new Date(iso));
    return file;
  };
  at('pre-sdd-refunds-platform-state-20261023T100000Z.json', '2026-10-23T10:00:00Z');
  const newest = at('pre-sdd-refunds-platform-state-20261023T100000Z (1).json', '2026-10-23T10:05:00Z');
  at('pre-sdd-other-state-20261023T110000Z.json', '2026-10-23T11:00:00Z');
  const run = cli(['validate', '--pick', downloads, '--slug', 'refunds-platform', '--since', '2026-10-23T09:30:00Z', ...AT]);
  assert.equal(run.code, 0, run.out + run.err);
  const lines = run.out.trimEnd().split('\n');
  assert.equal(lines[0], `PICKED ${newest}`);
  assert.equal(lines[1], 'PASS kind: a Studio save file');
  const none = cli(['validate', '--pick', downloads, '--slug', 'refunds-platform', '--since', '2026-10-23T10:30:00Z', ...AT]);
  assert.equal(none.code, 2);
  assert.match(none.out, /^FAIL pick: /);
});

test('cli_unwrap_saveWrapper_writesStateAndBlueprint', (t) => {
  const { stateFile, root } = project(t);
  const { state, model } = computed(stateFile);
  Object.assign(E.primaryEntry(state, 'BUS-01'), { value: 'Faster refunds', status: 'Confirmed', source: { type: 'answer', text: 'Answer: Mahmoud, 2026-10-23' } });
  const save = E.saveWrapper(state, model, { now: NOW });
  const file = writeJson(join(root, 'My Downloads', 'pre-sdd-refunds-platform-state-20261023T110102Z.json'), save);
  const studio = join(root, 'unwrapped studio');
  const run = cli(['unwrap', file, studio, ...AT]);
  assert.equal(run.code, 0, run.err);
  assert.deepEqual(readJson(join(studio, 'project-state.json')), E.normalizeState(state, { now: NOW }).state);
  assert.equal(E.primaryEntry(readJson(join(studio, 'project-state.json')), 'BUS-01').status, 'Estimated');
  assert.deepEqual(readJson(join(studio, 'studio-blueprint.json')), save.blueprint);
  assert.equal(readFileSync(join(studio, 'project-state.json'), 'utf8').includes('\r'), false);
  const summary = JSON.parse(run.out);
  assert.equal(summary.state, join(studio, 'project-state.json'));
  assert.equal(summary.blueprint, join(studio, 'studio-blueprint.json'));
  const bare = cli(['unwrap', stateFile, join(root, 'nowhere'), ...AT]);
  assert.equal(bare.code, 2);
  assert.match(bare.err, /not a save file/);
  assert.equal(existsSync(join(root, 'nowhere')), false);
  const noBlueprint = cli(['unwrap', writeJson(join(root, 'nb.json'), { ...save, blueprint: null }), join(root, 'nowhere'), ...AT]);
  assert.equal(noBlueprint.code, 2);
  assert.equal(existsSync(join(root, 'nowhere')), false);
});

test('cli_diff_identical_exit0', (t) => {
  const { stateFile, root } = project(t);
  const a = join(root, 'out a');
  const b = join(root, 'out b');
  assert.equal(cli(['compute', stateFile, '--out', a, ...AT]).code, 0);
  assert.equal(cli(['compute', stateFile, '--out', b, '--now', LATER]).code, 0);
  const run = cli(['diff', join(a, 'blueprint.json'), join(b, 'blueprint.json')]);
  assert.equal(run.code, 0, run.out + run.err);
  assert.match(run.out, /^No differences/);
});

test('cli_diff_changedCalc_exit1NamesField', (t) => {
  const { stateFile, root } = project(t);
  const { blueprint } = computed(stateFile);
  const changed = JSON.parse(JSON.stringify(blueprint));
  const calc = changed.calculations.find((c) => c.id === 'CALC-03');
  calc.result = 999;
  changed.governance.gate_status = 'approved';
  changed.requirements = [];
  const run = cli(['diff', writeJson(join(root, 'a.json'), blueprint), writeJson(join(root, 'b.json'), changed)]);
  assert.equal(run.code, 1);
  const lines = run.out.trimEnd().split('\n');
  assert.ok(lines.some((line) => line.startsWith('calculations[CALC-03].result: ')), run.out);
  assert.ok(lines.some((line) => line.startsWith('governance.gate_status: ')), run.out);
  assert.equal(lines.some((line) => line.startsWith('requirements')), false);
  const notBlueprint = cli(['diff', stateFile, join(root, 'b.json')]);
  assert.equal(notBlueprint.code, 2);
});

test('cli_embed_hostileText_roundTrips', (t) => {
  const { stateFile, root } = project(t, [], HOSTILE);
  const state = readJson(stateFile);
  assert.equal(state.project.name, HOSTILE.trim());
  const out = join(root, 'studio page', 'pre-sdd-studio.html');
  const run = cli(['embed', stateFile, '--out', out, ...AT]);
  assert.equal(run.code, 0, run.err);
  const html = readFileSync(out, 'utf8');
  assert.equal(html.match(/<script/gi).length, 3);
  assert.equal(html.match(/<\/script/gi).length, 3);
  const [, embedded] = scripts(html);
  assert.doesNotMatch(embedded.body, /[<\u2028\u2029]/);
  assert.deepEqual(JSON.parse(embedded.body), state);
  assert.equal(html.replace(embedded.body, () => 'null'), buildStudio({ srcDir: join(studioDir, 'src') }));
});

test('pickSavedState_duplicatesOlderAndOtherSlug_picksNewestMatch', () => {
  const entries = [
    { name: 'pre-sdd-a-state-20261023T100000Z.json', mtime: '2026-10-23T10:00:00Z' },
    { name: 'pre-sdd-a-state-20261023T100000Z (1).json', mtime: '2026-10-23T10:05:00Z' },
    { name: 'pre-sdd-a-state-20261023T090000Z.json', mtime: '2026-10-23T09:00:00Z' },
    { name: 'pre-sdd-b-state-20261023T110000Z.json', mtime: '2026-10-23T11:00:00Z' },
  ];
  assert.equal(pickSavedState(entries, 'a', '2026-10-23T09:30:00Z'), 'pre-sdd-a-state-20261023T100000Z (1).json');
  assert.equal(pickSavedState(entries, 'a', '2026-10-23T10:05:00Z'), null);
  assert.equal(pickSavedState([...entries, { name: 'pre-sdd-a-b-state-20261023T120000Z.json', mtime: '2026-10-23T12:00:00Z' }, { name: 'pre-sdd-a-state-20261023T120000Z.json.bak', mtime: '2026-10-23T12:00:00Z' }], 'a', '2026-10-23T09:30:00Z'), 'pre-sdd-a-state-20261023T100000Z (1).json');
});

test('cli_unknownCommand_exit3', (t) => {
  const { stateFile } = project(t);
  assert.equal(cli(['frobnicate']).code, 3);
  assert.equal(cli([]).code, 3);
  assert.equal(cli(['compute', stateFile]).code, 3);
  assert.equal(cli(['compute', stateFile, '--out', dirname(stateFile), '--bogus']).code, 3);
  assert.equal(cli(['derive', stateFile, '--actor', stateFile]).code, 3);
  assert.equal(cli(['new', join(dirname(stateFile), 'x'), '--brd', 'A=a.md@1.0']).code, 3);
  assert.equal(cli(['new', join(dirname(stateFile), 'x'), '--name', 'X']).code, 3);
  assert.equal(cli(['new', join(dirname(stateFile), 'x'), '--name', 'X', '--brd', 'A=C:/no/version.md']).code, 3);
  assert.equal(cli(['derive', stateFile, '--now', 'yesterday']).code, 3);
  const run = cli(['frobnicate']);
  assert.match(run.err, /Usage/);
});

test('cli_version_printsBoth', () => {
  const run = cli(['--version']);
  assert.equal(run.code, 0);
  assert.equal(run.out, 'engine 3.0.0, skill 1.0.0\n');
});

test('cli_version_insideEsmProject_loadsEngine', (t) => {
  const root = join(temp(t), 'esm project');
  const copy = join(root, '.claude', 'skills', 'pre-sdd-unifier', 'studio');
  writeJson(join(root, 'package.json'), { type: 'module' });
  for (const name of ['cli.mjs', 'build.mjs', 'src', 'schema']) cpSync(join(studioDir, name), join(copy, name), { recursive: true });
  const run = spawnSync(process.execPath, [join(copy, 'cli.mjs'), '--version'], { cwd: root, encoding: 'utf8', windowsHide: true });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stdout, 'engine 3.0.0, skill 1.0.0\n');
});

function schemaKeywords(node, out = new Set()) {
  if (typeof node === 'boolean') return out;
  for (const [key, value] of Object.entries(node)) {
    out.add(key);
    if (key === 'properties' || key === '$defs') for (const sub of Object.values(value)) schemaKeywords(sub, out);
    else if (key === 'anyOf') for (const sub of value) schemaKeywords(sub, out);
    else if (['items', 'additionalProperties', 'not', 'if', 'then', 'else'].includes(key)) schemaKeywords(value, out);
  }
  return out;
}

test('cliSchemaChecker_committedSchemas_everyKeywordSupported', () => {
  for (const file of [STATE_SCHEMA, BLUEPRINT_SCHEMA]) {
    const schema = readJson(file);
    for (const keyword of schemaKeywords(schema)) assert.ok(SCHEMA_KEYWORDS.has(keyword), `${file}: ${keyword}`);
    assert.doesNotThrow(() => checkSchema(schema));
  }
  assert.throws(() => checkSchema({ type: 'object', properties: { mail: { type: 'string', format: 'email' } } }), (error) => /"format"/.test(error.message) && error.message.includes('#/properties/mail'));
  assert.throws(() => checkSchema({ $defs: { a: { anyOf: [{ type: 'string' }, { prefixItems: [] }] } } }), (error) => /"prefixItems"/.test(error.message) && error.message.includes('#/$defs/a/anyOf/1'));
});

test('cli_validate_correctedState_notesRawSchemaFailures', (t) => {
  const { stateFile, root } = project(t);
  const state = readJson(stateFile);
  state.decisions.topology_override = 'undetermined';
  const file = writeJson(join(root, 'corrected', 'project-state.json'), state);
  const run = cli(['validate', file, ...AT]);
  assert.equal(run.code, 0, run.out + run.err);
  const lines = run.out.trimEnd().split('\n');
  assert.ok(lines.some((line) => line.startsWith('PASS state gate: it reads cleanly, after 1 correction')), run.out);
  assert.ok(lines.includes("PASS state schema: the state after the gate's corrections matches schema/project-state.schema.json; the file as saved does not, as the NOTE lines say"), run.out);
  const notes = lines.filter((line) => line.startsWith('NOTE state schema, file as saved: '));
  assert.ok(notes.length >= 1 && notes.every((line) => line.includes('/decisions/topology_override')), run.out);
  assert.ok(lines.every((line) => /^(PASS|NOTE) /.test(line)), run.out);
  const python = validateAllWithSchema(STATE_SCHEMA, [state]);
  if (python.skipped) t.diagnostic(python.skipped);
  else assert.ok(python.errors[0].some((e) => e.path === 'decisions/topology_override'));
  const model = E.compute(state, { now: NOW });
  const save = writeJson(join(root, 'corrected', 'save.json'), { ...E.saveWrapper(E.normalizeState(state, { now: NOW }).state, model, { now: NOW }), project_state: state });
  const saved = cli(['validate', save, ...AT]);
  assert.equal(saved.code, 0, saved.out + saved.err);
  assert.ok(saved.out.split('\n').some((line) => line.startsWith('NOTE project state schema, file as saved: /decisions/topology_override')), saved.out);
  const clean = cli(['validate', stateFile, ...AT]);
  assert.ok(clean.out.includes('PASS state schema: matches schema/project-state.schema.json\n'));
  assert.equal(clean.out.includes('NOTE'), false);
});

test('cli_derive_signThenSet_notesSignAgain', (t) => {
  const { stateFile } = project(t);
  const [first, second] = E.SIGNOFF_ROLES.map((role) => role.key);
  const run = derive(stateFile, { actor: person, ops: [{ op: 'sign', role: first, decision: 'Approved' }, { op: 'set', entry: 'BUS-01.1', value: 'Faster refunds' }, { op: 'sign', role: second, decision: 'Approved' }] });
  assert.equal(run.code, 0, run.err);
  const notes = run.summary.notes.filter((n) => /sign again/i.test(n));
  assert.equal(notes.length, 1);
  assert.ok(notes[0].includes(first));
  const state = readJson(stateFile);
  assert.equal(state.gate.signoffs.find((x) => x.role === second).content_hash, E.contentHash(state));
  const after = derive(stateFile, { actor: person, ops: [{ op: 'set', entry: 'BUS-03.1', value: 'Refund intake' }, { op: 'sign', role: first, decision: 'Approved' }] });
  assert.equal(after.summary.notes.some((n) => /sign again/i.test(n)), false);
});
