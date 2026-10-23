import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStudio } from '../build.mjs';
import { readText } from './helpers.mjs';

const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(studioDir, 'src');
const stateAttrs = ' type="application/json" id="embedded-state"';

function scripts(html) {
  return [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].map(([, attrs, body]) => ({ attrs, body }));
}

test('buildStudio_blank_embedsEngineByteForByte', () => {
  const [engine] = scripts(buildStudio({ srcDir }));
  assert.equal(engine.attrs, '');
  assert.equal(engine.body, readText(join(srcDir, 'engine.js')));
});

test('buildStudio_blank_embedsUiStyleAndNullState', () => {
  const html = buildStudio({ srcDir });
  const [, state, ui] = scripts(html);
  assert.equal(html.match(/<style>([\s\S]*?)<\/style>/)[1], readText(join(srcDir, 'style.css')));
  assert.equal(state.attrs, stateAttrs);
  assert.equal(state.body, 'null');
  assert.equal(ui.attrs, '');
  assert.equal(ui.body, readText(join(srcDir, 'ui.js')));
});

test('buildStudio_sourceWithDollarPatterns_keepsLiteral', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'pre-sdd-build-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const sources = {
    'shell.html': `<style>/* STYLES */</style><script>/* ENGINE */</script><script${stateAttrs}>/* PROJECT_STATE */</script><script>/* UI */</script>\r\n`,
    'style.css': 'b{}\r\n',
    'engine.js': "const a='$&';\r\nconst b=\"$'\";\r\n",
    'ui.js': 'run();\r\n',
  };
  for (const [name, text] of Object.entries(sources)) writeFileSync(join(dir, name), text);
  assert.equal(
    buildStudio({ srcDir: dir }),
    `<style>b{}\n</style><script>const a='$&';\nconst b="$'";\n</script><script${stateAttrs}>null</script><script>run();\n</script>\n`,
  );
});

test('buildStudio_hostileStateText_roundTrips', () => {
  const state = { name: "</script><!-- $& $' \u2028 x" };
  const html = buildStudio({ srcDir, state });
  assert.equal(html.match(/<script/gi).length, 3);
  assert.equal(html.match(/<\/script/gi).length, 3);
  const [, embedded] = scripts(html);
  assert.equal(embedded.attrs, stateAttrs);
  assert.doesNotMatch(embedded.body, /[<\u2028\u2029]/);
  assert.deepEqual(JSON.parse(embedded.body), state);
  assert.equal(html.replace(embedded.body, () => 'null'), buildStudio({ srcDir }));
});

test('buildStudio_committedHtml_isUpToDate', () => {
  assert.equal(buildStudio({ srcDir }), readText(join(studioDir, 'pre-sdd-studio.html')), 'pre-sdd-studio.html is out of date: run node build.mjs');
});
