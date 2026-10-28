import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, readText } from './helpers.mjs';

const E = loadEngine();
const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(studioDir, 'cli.mjs');
const NOW = '2026-10-23T11:01:02Z';
const OPTS = { now: NOW, name: 'Imported project', slug: 'imported-project' };
const APPENDIX_SOURCE = 'Default: policy appendix v1';
const IMPORT_SOURCE = 'Import: Studio v2.2';
const MINIMAL = { version: 2, inputs: { solutionName: 'Minimal v2.2 file', changeType: 'greenfield', target: 'cloud', dailyTxn: 864000, peakFactor: 5, availability: 99.9, failureScope: 'region', rtoSec: 600, rpoSec: 60 } };

function temp(t) {
  const dir = mkdtempSync(join(tmpdir(), 'pre sdd page import '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function listFiles(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? listFiles(join(dir, d.name), `${prefix}${d.name}/`) : [`${prefix}${d.name}`]));
}

function cliImport(t, file) {
  const dir = temp(t);
  const run = spawnSync(process.execPath, [CLI, 'new', dir, '--name', OPTS.name, '--slug', OPTS.slug, '--brd', 'REFUNDS=../brd/refunds.md@1.0', '--import', file, '--now', NOW], { encoding: 'utf8', windowsHide: true });
  assert.equal(run.status, 0, run.stderr);
  return JSON.parse(readFileSync(join(dir, 'studio', 'project-state.json'), 'utf8'));
}

function appendixFactors(state) {
  return Object.values(state.register.items).flat().flatMap((e) => Object.entries(e.factors || {})).filter(([name]) => Object.hasOwn(E.APPENDIX.values, name));
}

test('importForPage_v22FileAndZip_registerMatchesCliNewImport', async (t) => {
  const dir = temp(t);
  const localDir = join(studioDir, 'tests', 'golden', 'local-zero');
  const zip = join(dir, 'local zero.zip');
  writeFileSync(zip, new Uint8Array(await E.zipStored(Object.fromEntries(listFiles(localDir).map((n) => [n, readText(join(localDir, n))])), { now: NOW }).arrayBuffer()));
  const minimal = join(dir, 'minimal v22.json');
  writeFileSync(minimal, JSON.stringify(MINIMAL));
  const files = [join(studioDir, '..', 'examples', 'studio-v2.2-export', 'project-state.json'), join(studioDir, 'tests', 'golden', 'regional-zero', 'project-state.json'), zip, minimal];
  const sources = new Set();
  for (const file of files) {
    const source = /\.zip$/i.test(file) ? new Uint8Array(readFileSync(file)) : JSON.parse(readText(file));
    const page = E.importForPage(source, OPTS);
    const fromCli = cliImport(t, file);
    assert.deepEqual(page.register, fromCli.register, file);
    const appendix = appendixFactors(page);
    assert.ok(appendix.length > 0, `${file}: the appendix factors are present`);
    const given = file === minimal ? null : (/\.zip$/i.test(file) ? JSON.parse(readText(join(localDir, 'project-state.json'))) : source).inputs;
    for (const [name, f] of appendix) {
      assert.deepEqual([f.status, f.source && f.source.text], ['Estimated', given && given[name] !== undefined ? IMPORT_SOURCE : APPENDIX_SOURCE], `${file}: ${name}`);
      if (!given) assert.equal(f.value, E.APPENDIX.values[name], `${file}: ${name} takes the appendix value`);
      sources.add(f.source.text);
    }
    const derived = Object.values(page.register.items).flat().filter((e) => e.source && e.source.type === 'derived' && e.value !== null);
    assert.ok(derived.length > 0, `${file}: derived values are filled`);
    assert.ok(derived.every((e) => e.status === 'Estimated'), `${file}: derived values are Estimated`);
  }
  assert.deepEqual([...sources].sort(), [APPENDIX_SOURCE, IMPORT_SOURCE]);
});

test('importForPage_steps_normalizeThenDefaultsThenDerive', () => {
  const record = JSON.parse(readText(join(studioDir, 'tests', 'golden', 'regional-zero', 'project-state.json')));
  const imported = E.normalizeState(E.importV22(record, OPTS), { now: NOW }).state;
  const expected = E.derive(E.applyDefaults(imported, { now: NOW }).state, { now: NOW }).state;
  assert.deepEqual(E.importForPage(record, OPTS), expected);
  assert.notDeepEqual(E.importForPage(record, OPTS).register, imported.register, 'the engine run fills values the import leaves open');
});

test('importForPage_threeZeroState_refusedWithEngineText', () => {
  const state = E.newState(OPTS);
  assert.throws(() => E.importForPage(state, OPTS), /A Pre-SDD 3\.0 project state or save file opens as it is/);
  assert.throws(() => E.importForPage(state, { name: 'x', slug: 'x' }), /now/);
});
