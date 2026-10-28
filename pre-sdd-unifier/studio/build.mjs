import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const studioDir = dirname(fileURLToPath(import.meta.url));
const markers = /\/\* (?:STYLES|ENGINE|PROJECT_STATE|UI) \*\//g;
const jsonEscapes = { '<': '\\u003c', '\u2028': '\\u2028', '\u2029': '\\u2029' };

function readSource(srcDir, name) {
  return readFileSync(join(srcDir, name), 'utf8').replace(/\r\n/g, '\n');
}

function embeddedState(state) {
  return JSON.stringify(state).replace(/[<\u2028\u2029]/g, (c) => jsonEscapes[c]);
}

export function buildStudio({ srcDir, state = null }) {
  const parts = {
    '/* STYLES */': readSource(srcDir, 'style.css'),
    '/* ENGINE */': readSource(srcDir, 'engine.js'),
    '/* PROJECT_STATE */': embeddedState(state),
    '/* UI */': readSource(srcDir, 'ui.js'),
  };
  return readSource(srcDir, 'shell.html').replace(markers, (marker) => parts[marker]);
}

function invokedDirectly() {
  if (!process.argv[1]) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
  } catch {
    return false;
  }
}

if (invokedDirectly()) {
  const { values } = parseArgs({ options: { state: { type: 'string' }, out: { type: 'string' } } });
  const state = values.state === undefined ? null : JSON.parse(readFileSync(values.state, 'utf8'));
  const out = resolve(values.out ?? join(studioDir, 'pre-sdd-studio.html'));
  writeFileSync(out, buildStudio({ srcDir: join(studioDir, 'src'), state }));
  console.log(`Wrote ${out}`);
}
