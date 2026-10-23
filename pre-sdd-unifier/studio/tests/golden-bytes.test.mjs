import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine, goldenCase, readText, normalizeTimestamps } from './helpers.mjs';
const E = loadEngine();
for (const name of ['regional-zero', 'local-zero', 'demo']) {
  test(`exportFiles_golden_${name}_matchesV22Bytes`, () => {
    const g = goldenCase(name);
    const files = E.exportFiles(E.modelV22(g.projectState.inputs, g.ctx), g.ctx);
    assert.deepEqual(Object.keys(files), g.manifest.files);
    for (const [path, text] of Object.entries(files)) {
      assert.equal(normalizeTimestamps(text), normalizeTimestamps(readText(g.file(path))), path);
    }
  });
}
