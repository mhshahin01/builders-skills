import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const goldenCases = {
  'regional-zero': { dir: join(here, 'golden', 'regional-zero'), scenario: 'blank' },
  'local-zero': { dir: join(here, 'golden', 'local-zero'), scenario: 'blank' },
  demo: { dir: join(here, '..', '..', 'examples', 'studio-v2.2-export'), scenario: 'cloudSaaS' },
};

export function loadEngine() {
  return require('../src/engine.js');
}

export function readText(path) {
  return readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
}

export function normalizeTimestamps(text) {
  return text.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/g, '<UTC>');
}

export function goldenCase(name) {
  const known = goldenCases[name];
  if (!known) throw new Error(`Unknown golden case: ${name}`);
  const { dir, scenario } = known;
  const file = (rel) => join(dir, rel);
  const manifest = JSON.parse(readText(file('manifest.json')));
  const projectState = JSON.parse(readText(file('project-state.json')));
  const blueprint = JSON.parse(readText(file('architecture-blueprint.json')));
  const ctx = {
    fieldStatus: projectState.statuses,
    extras: projectState.extraWorkloads,
    decisionHistory: projectState.history,
    scenario,
    provider: projectState.provider,
    showOptional: projectState.showOptional,
    now: blueprint.validation.checked_at,
  };
  return { dir, file, manifest, projectState, ctx };
}
