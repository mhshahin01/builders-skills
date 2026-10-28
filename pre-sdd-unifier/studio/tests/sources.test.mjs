import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readText } from './helpers.mjs';

const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(studioDir, 'src');
const allowedUrl = /http:\/\/www\.w3\.org\/2000\/svg(?![\w.~:\/?#[\]@!$&()*+,;=%-])/g;
const forbidden = [
  'fetch(', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'sendBeacon',
  'localStorage', 'sessionStorage', 'indexedDB',
  'import(', 'eval(', 'new Function',
  '<script src', '<link', '@import', 'url(http',
  'http://', 'https://',
];

function srcFiles() {
  return readdirSync(srcDir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => join(srcDir, entry.name));
}

test('sources_noNetworkOrStorageApis_absent', () => {
  const files = srcFiles();
  assert.ok(files.length > 0, 'no source files found');
  const names = files.map((file) => basename(file));
  for (const name of ['engine.js', 'ui.js', 'shell.html', 'style.css']) assert.ok(names.includes(name), `${name} was not scanned`);
  const hits = [];
  for (const file of files) {
    const text = readText(file).replace(allowedUrl, '').toLowerCase();
    for (const pattern of forbidden) if (text.includes(pattern.toLowerCase())) hits.push(`${relative(studioDir, file)}: ${pattern}`);
  }
  assert.deepEqual(hits, []);
});

test('sources_noClosingScriptTag_inScripts', () => {
  for (const name of ['engine.js', 'ui.js']) assert.doesNotMatch(readText(join(srcDir, name)), /<\/script/i, name);
});

test('sources_noEmOrEnDashCharacters', () => {
  const files = [...srcFiles(), join(studioDir, 'build.mjs'), join(studioDir, 'pre-sdd-studio.html')];
  const offenders = files.filter((file) => /[\u2013\u2014]/.test(readText(file))).map((file) => relative(studioDir, file));
  assert.deepEqual(offenders, []);
});
