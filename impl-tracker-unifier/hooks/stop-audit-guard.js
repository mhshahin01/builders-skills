#!/usr/bin/env node
// Claude Code Stop hook for impl-tracker-unifier.
// Blocks ending a turn while a task is `In review`, or `Done`, without a passing audit report as its latest
// tracking/<KEY>/audits/T-NNN-audit-<n>.md (line 1 holds the recomputed verdict). Read-only.
const fs = require('fs');
const path = require('path');

let input = {};
try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { /* no input */ }
if (input.stop_hook_active) process.exit(0); // already blocked once this turn: don't loop

// The session may start above or below the code repo: look for tracking/ in the working directory,
// up to two folders below it, and in each parent folder up to the filesystem root.
function findRoots(base) {
  const found = new Set();
  const has = dir => fs.existsSync(path.join(dir, 'tracking', 'index.md'));
  const walk = (dir, depth) => {
    if (has(dir)) { found.add(dir); return; }
    if (depth === 0) return;
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'target') {
        walk(path.join(dir, e.name), depth - 1);
      }
    }
  };
  walk(base, 2);
  for (let dir = path.dirname(base); dir !== path.dirname(dir); dir = path.dirname(dir)) {
    if (has(dir)) { found.add(dir); break; }
  }
  return [...found];
}

const splitRow = line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(c => c.trim());

function latestVerdict(root, key, id) {
  const dir = path.join(root, 'tracking', key, 'audits');
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter(f => new RegExp('^' + id + '-audit-\\d+\\.md$').test(f))
    .sort((a, b) => parseInt(a.match(/audit-(\d+)/)[1]) - parseInt(b.match(/audit-(\d+)/)[1]));
  if (!files.length) return null;
  const head = fs.readFileSync(path.join(dir, files[files.length - 1]), 'utf8').split('\n')[0];
  const m = head.match(/\b(PASS-minor|PASS|FAIL)(?![\w-])/);
  return m ? m[1] : null;
}

const problems = [];
for (const root of findRoots(input.cwd || process.cwd())) {
  const lines = fs.readFileSync(path.join(root, 'tracking', 'index.md'), 'utf8').split('\n');
  const headerLine = lines.find(l => l.trim().startsWith('|'));
  if (!headerLine) continue;
  const header = splitRow(headerLine);
  const col = name => header.findIndex(h => h.toLowerCase() === name);
  const idCol = col('id') >= 0 ? col('id') : 0;
  const statusCol = col('status') >= 0 ? col('status') : 4;
  for (const line of lines) {
    if (!line.trim().startsWith('|')) continue;
    const cells = splitRow(line);
    // The ID cell may be a markdown link: [KEY/T-NNN](path)
    const idMatch = (cells[idCol] || '').match(/([A-Z0-9_-]+)\/(T-\d+)/);
    if (!idMatch) continue;
    const key = idMatch[1], id = idMatch[2];
    const status = cells[statusCol] || '';
    const v = latestVerdict(root, key, id);
    const passed = v === 'PASS' || v === 'PASS-minor';
    if (status.startsWith('In review') && !passed) {
      problems.push(`${key}/${id} is In review with no passing audit (latest: ${v || 'none'})`);
    } else if ((status.startsWith('Done') || status.startsWith('Verified')) && !status.startsWith('Done-stale') && !passed) {
      problems.push(`${key}/${id} is ${status} without a passing latest audit (latest: ${v || 'none'})`);
    }
  }
}

if (problems.length) {
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: 'impl-tracker audit guard:\n- ' + problems.join('\n- ') +
      '\nRun `impl-tracker-unifier done <id>` (pre-flight, then the audit), fix FAIL findings, or ask the user to skip the audit in chat.'
  }));
}
process.exit(0);
