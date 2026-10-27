import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, readText } from './helpers.mjs';
import { NOW, LATER, person, agent, apply, approvedState, newProject } from './states.mjs';

const E = loadEngine();
const chunksDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'chunks');
const DASH = /[\u2013\u2014]/;
const REGISTER = ['03a-register-business.md', '03b-register-capacity.md', '03c-register-reliability.md', '03d-register-data.md', '03e-register-security.md', '03f-register-integration.md', '03g-register-operations.md', '03h-register-economics.md'];
const NAMES = ['01-header.md', '02-classification.md', ...REGISTER, '04-calculations.md', '05-target-shape.md', '07-options.md', '08-overlay.md', '09-rule-trace.md', '10-validation.md', '11-gate.md', '12-locked-items.md'];
const ENTRY_HEAD = ['Entry', 'Label', 'Value', 'Unit', 'Window', 'Priority', 'Kind', 'Status', 'Source', 'Owner', 'Due'];
const BRD = (text) => ({ type: 'brd', text });

function frag(state, now = NOW) {
  return E.fragments(state, E.compute(state, { now }), { now });
}

function cells(line) {
  const parts = [];
  let cur = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '\\' && i + 1 < line.length) {
      cur += ch + line[i + 1];
      i++;
    } else if (ch === '|') {
      parts.push(cur);
      cur = '';
    } else cur += ch;
  }
  parts.push(cur);
  return parts.slice(1, -1).map((s) => s.trim());
}

function rowOf(text, id) {
  const line = text.split('\n').find((l) => l.startsWith(`| ${id} |`));
  assert.ok(line, `no table row for ${id}`);
  return cells(line);
}

function headOf(text, first) {
  const line = text.split('\n').find((l) => l.startsWith(`| ${first} |`));
  assert.ok(line, `no table header starting with ${first}`);
  return cells(line);
}

function migrating(state) {
  return apply(state, [{ op: 'set-overlay', applies: true, source: 'onprem' }, { op: 'add-workload', name: 'Billing' }]);
}

function reliability() {
  let state = newProject();
  state = apply(state, [{ op: 'set', entry: 'REL-03.1', value: 600 }, { op: 'confirm', entry: 'REL-03.1' }, { op: 'add', row: 'REL-03', label: 'Refund payout', scope: 'region' }]);
  state = apply(state, [{ op: 'set', entry: 'REL-03.2', value: 1800, source: BRD('BRD: REFUNDS/NFR-04') }], agent);
  state = apply(state, [{ op: 'set', entry: 'REL-03.2', owner_name: 'Dana Reyes', due: '2026-12-01', window: 'per incident' }]);
  return E.applyDefaults(state, { now: NOW }).state;
}

test('fragments_register_rowsAndValues', () => {
  const state = reliability();
  const f = frag(state);
  assert.deepEqual(Object.keys(f), NAMES.filter((name) => name !== '08-overlay.md'));
  const rel = f['03c-register-reliability.md'];
  assert.deepEqual(headOf(rel, 'Entry'), ENTRY_HEAD);
  assert.deepEqual(rowOf(rel, 'REL-03.1'), ['REL-03.1', 'TBD', '600', 's', 'TBD', 'TBD', 'target', 'Confirmed (Mahmoud, 2026-10-23T11:01:02Z)', 'Answer: Mahmoud, 2026-10-23', 'B', 'TBD']);
  assert.deepEqual(rowOf(rel, 'REL-03.2'), ['REL-03.2', 'Refund payout; scope region', '1800', 's', 'per incident', 'TBD', 'target', 'Estimated', 'BRD: REFUNDS/NFR-04', 'B (Dana Reyes)', '2026-12-01']);
  assert.deepEqual(rowOf(rel, 'REL-04.1').slice(2, 4).concat(rowOf(rel, 'REL-04.1')[7]), ['TBD', 's', 'Open']);
  const lines = rel.split('\n');
  assert.ok(lines.findIndex((l) => l.startsWith('| REL-03.1 |')) < lines.findIndex((l) => l.startsWith('| REL-03.2 |')), 'entries in number order');
  const cap = f['03b-register-capacity.md'];
  assert.deepEqual(headOf(cap, 'Entry').length, ENTRY_HEAD.length);
  const factors = cap.split('### CAP-02')[1].split('### CAP-03')[0];
  assert.deepEqual(headOf(factors, 'Entry').slice(0, 2), ['Entry', 'Label']);
  const factorLines = factors.split('\n').filter((l) => l.startsWith('| CAP-02.1 |')).map(cells);
  assert.deepEqual(factorLines.slice(1).map((c) => c.slice(1)), [['callsPerTxn', '3', 'calls/txn', 'Estimated', 'Default: policy appendix v1'], ['requestFactor', '1.1', '×', 'Estimated', 'Default: policy appendix v1']]);
  const na = frag(apply(state, [{ op: 'na', entry: 'REL-06.1', reason: 'No manual fallback in scope' }]))['03c-register-reliability.md'];
  assert.equal(rowOf(na, 'REL-06.1')[2], 'N/A: No manual fallback in scope');
  const proposed = frag(apply(state, [{ op: 'propose', entry: 'REL-01.1', value: 99.9, reason: 'BRD REFUNDS/NFR-01 asks for three nines' }], agent))['03c-register-reliability.md'];
  assert.equal(rowOf(proposed, 'REL-01.1')[2], 'TBD (proposed: 99.9; BRD REFUNDS/NFR-01 asks for three nines)');
});

test('fragments_register_rowHeadings', () => {
  const state = migrating(newProject());
  const f = frag(state);
  assert.deepEqual(Object.keys(f), NAMES);
  const expect = (text, rows) => {
    const headings = text.split('\n').filter((l) => l.startsWith('#'));
    assert.deepEqual(headings, rows.map((row) => `### ${row.id}`));
    for (const row of rows) assert.ok(text.includes(`### ${row.id}\n\n**${row.label ?? row.ask}**\n\n| Entry |`), row.id);
  };
  expect(f['01-header.md'], E.HEADER_FIELDS);
  expect(f['08-overlay.md'], E.OVERLAY_FIELDS);
  for (const [group, { chunk }] of Object.entries(E.GROUPS)) expect(f[REGISTER.find((name) => name.startsWith(`03${chunk}-`))], E.ITEMS.filter((row) => row.group === group));
  assert.deepEqual(rowOf(f['08-overlay.md'], 'OVL-04.2').slice(0, 2), ['OVL-04.2', 'WL-02 Billing']);
  assert.deepEqual(rowOf(f['08-overlay.md'], 'OVL-04.1').slice(0, 2), ['OVL-04.1', 'WL-01']);
  for (const [name, text] of Object.entries(f)) if (!['01-header.md', '08-overlay.md', ...REGISTER].includes(name)) assert.ok(!text.split('\n').some((l) => /^#{1,6} /.test(l)), `${name} has no heading`);
});

test('fragments_calculations_tbdNeverZero', () => {
  const model = E.compute(newProject(), { now: NOW });
  const calc = E.fragments(newProject(), model, { now: NOW })['04-calculations.md'];
  assert.deepEqual(headOf(calc, 'ID'), ['ID', 'Calculation', 'Formula', 'Inputs', 'Result', 'Status']);
  const rows = calc.split('\n').filter((l) => l.startsWith('| CALC-')).map(cells);
  assert.equal(rows.length, 20);
  assert.ok(!calc.includes('@'), 'the option rows are in 07-options.md');
  for (const r of rows) {
    const held = model.c.rows.find((x) => x.id === r[0]);
    if (!E.known(held.result)) assert.deepEqual([r[4], r[5]], ['TBD', 'Open'], r[0]);
    assert.notEqual(r[4], '0', r[0]);
    assert.doesNotMatch(r[4], /^0(\s|$)/, r[0]);
  }
  assert.ok(rows.filter((r) => r[4] === 'TBD').length >= 10);
  const approved = approvedState();
  const full = frag(approved)['04-calculations.md'];
  assert.deepEqual(rowOf(full, 'CALC-01').slice(3), ['CAP-01.1', '10 txn/s', 'Estimated']);
  const options = frag(approved)['07-options.md'];
  const row = rowOf(options, 'OPT-01');
  assert.deepEqual([row[3], row[4]], ['TBD', 'UNWEIGHTED']);
  assert.deepEqual(rowOf(options, 'CALC-21@OPT-01').slice(-1), ['TBD']);
  assert.ok(!options.split('\n').some((l) => cells(l).includes('0')), 'no zero stands in for a missing cost');
});

test('fragments_lockedItems_usesLandings', () => {
  const state = approvedState();
  const text = frag(state)['12-locked-items.md'];
  assert.deepEqual(headOf(text, 'ID'), ['ID', 'Value', 'Status', 'Lands in the SDD']);
  const ids = [...E.HEADER_FIELDS, ...E.ITEMS].filter((row) => E.LANDINGS.rows[row.id]).flatMap((row) => E.rowEntries(state, row.id).map((e) => E.entryId(row.id, e.n)));
  const listed = text.split('\n').filter((l) => /^\| [A-Z]{3}-\d{2}\.\d+ \|/.test(l)).map((l) => cells(l)[0]);
  assert.deepEqual(listed, ids);
  assert.deepEqual(rowOf(text, 'CAP-01.1'), ['CAP-01.1', '864000 transactions/day', 'Confirmed', '§18, Q3']);
  assert.deepEqual(rowOf(text, 'HDR-07.1'), ['HDR-07.1', 'greenfield', 'Confirmed', 'Project Type']);
  assert.deepEqual(rowOf(text, 'DAT-07.1'), ['DAT-07.1', 'schema-isolated', 'Estimated', 'Q7, §11']);
  assert.deepEqual(rowOf(text, 'CAP-02.1'), ['CAP-02.1', 'TBD', 'Open', '§18, Q3']);
  assert.deepEqual(rowOf(text, 'REL-03.1'), ['REL-03.1', '600 s', 'Confirmed', '§8.6, §11, §18.5, §19, §20']);
  assert.deepEqual(rowOf(text, 'INT-06.1'), ['INT-06.1', 'TBD', 'Open', '§8.7']);
  assert.deepEqual(rowOf(text, '§8.6'), ['§8.6', 'HDR-08, REL-01, REL-03, REL-04, REL-05, DAT-04, DAT-09, INT-07']);
  assert.deepEqual(rowOf(text, '§8.7'), ['§8.7', 'DAT-04, SEC-03, SEC-04, SEC-07, INT-06, INT-07, INT-08']);
  const decisions = text.split('\n').filter((l) => /^\| (Hosting|Topology|DR strategy, scope \S+|Chosen option) \|/.test(l)).map(cells);
  assert.deepEqual(decisions, [['Hosting', 'cloud'], ['Topology', 'Multi-zone · single region (multiAZ)'], ['DR strategy, scope az', 'Local HA only · broader DR not scoped (localHA), replication asynchronous']]);
  const chosen = frag(apply(state, [{ op: 'decide', option: 'OPT-01' }]))['12-locked-items.md'];
  assert.deepEqual(rowOf(chosen, 'Chosen option'), ['Chosen option', 'OPT-01 (One region, multi-AZ)']);
  const landing = headOf(text, 'Lands in the SDD');
  assert.deepEqual(landing, ['Lands in the SDD', 'Rows']);
  for (const target of E.LANDINGS.targets) {
    const rows = [...E.HEADER_FIELDS, ...E.ITEMS].filter((row) => (E.LANDINGS.rows[row.id] || []).includes(target)).map((row) => row.id);
    assert.deepEqual(rowOf(text, target), [target, rows.join(', ')], target);
  }
});

test('fragments_everyChunkFragment_noEmOrEnDash', () => {
  const states = [newProject(), reliability(), approvedState(), migrating(approvedState()), apply(approvedState(), [{ op: 'decide', topology: 'single', reason: 'One zone for the pilot' }, { op: 'add-unknown', question: 'Which region hosts the DR copy?', entry: 'DAT-04.1', owner: 'Dana Reyes', due: '2026-11-30' }], person, LATER)];
  for (const state of states) {
    for (const [name, text] of Object.entries(frag(state, LATER))) {
      assert.doesNotMatch(text, DASH, name);
      assert.ok(!text.includes('\r'), `${name}: LF only`);
      assert.ok(text.endsWith('\n') && !text.endsWith('\n\n'), `${name}: one trailing newline`);
      assert.ok(!text.split('\n').some((l) => /^#{1,2} /.test(l)), `${name}: no level-1 or level-2 heading`);
      for (const line of text.split('\n').filter((l) => l.startsWith('|'))) assert.ok(line.endsWith('|'), `${name}: ${line}`);
    }
  }
});

test('fragments_hostileCellText_escaped', () => {
  const hostile = 'Refund | payout\nline two\r\nline three <!-- hidden --> \\| end';
  let state = approvedState();
  state = apply(state, [
    { op: 'set', entry: 'BUS-01.1', value: hostile },
    { op: 'add-unknown', question: hostile, entry: 'BUS-01.1', owner: 'Dana | Reyes', due: '2026-11-30' },
    { op: 'add-condition', text: hostile, owner: 'SRE <lead>', due: '2026-12-01' },
  ]);
  state = migrating(apply(state, [{ op: 'rename-workload', id: 'WL-01', name: 'Core <!-- x --> | y' }]));
  const f = frag(state);
  for (const [name, text] of Object.entries(f)) {
    assert.ok(!text.includes('<!--'), `${name}: no raw comment marker`);
    const lines = text.split('\n');
    let width = null;
    for (const line of lines) {
      if (!line.startsWith('|')) {
        width = null;
        continue;
      }
      const n = cells(line).length;
      if (width === null) width = n;
      assert.equal(n, width, `${name}: ${line}`);
    }
  }
  const row = rowOf(f['03a-register-business.md'], 'BUS-01.1');
  assert.equal(row[2], 'Refund \\| payout line two line three &lt;!-- hidden --> \\\\\\| end');
  assert.ok(f['10-validation.md'].includes('&lt;!-- hidden -->'));
  assert.ok(f['11-gate.md'].includes('SRE &lt;lead>'));
  assert.deepEqual(rowOf(f['08-overlay.md'], 'OVL-01.1')[1], 'WL-01 Core &lt;!-- x --> \\| y');
  const preview = E.previewFiles(state, E.compute(state, { now: NOW }), { now: NOW });
  for (const [name, text] of Object.entries(preview)) if (name.endsWith('.md')) assert.ok(!text.includes('<!--'), `${name}: no raw comment marker`);
});

test('fragments_names_matchChunkMarkers', () => {
  const markers = readdirSync(chunksDir).filter((name) => /^\d{2}[a-h]?-.*\.md$/.test(name)).flatMap((name) => [...readText(join(chunksDir, name)).matchAll(/<!-- ENGINE-FRAGMENT: (\S+) -->/g)].map((m) => m[1]));
  assert.deepEqual([...markers].sort(), [...NAMES].sort());
  assert.deepEqual(Object.keys(frag(migrating(newProject()))), NAMES);
});

test('fragments_classification_tierAndExample', () => {
  const head = (state) => frag(state)['02-classification.md'];
  const text = head(approvedState());
  assert.deepEqual(headOf(text, 'Item'), ['Item', 'Value', 'Source']);
  assert.deepEqual(rowOf(text, 'Change type (HDR-07)'), ['Change type (HDR-07)', 'greenfield', 'Answer: Mahmoud, 2026-10-23']);
  assert.deepEqual(rowOf(text, 'Path code'), ['Path code', 'GF-CL', 'Engine']);
  assert.deepEqual(rowOf(text, 'Recovery tier'), ['Recovery tier', 'none', 'Engine']);
  assert.deepEqual(rowOf(text, 'Closest worked example'), ['Closest worked example', 'none', 'Engine']);
  assert.match(rowOf(text, 'Migration overlay')[1], /^does not apply, source unknown$/);
  const fast = apply(approvedState(), [{ op: 'set', entry: 'REL-03.1', value: 5 }, { op: 'set', entry: 'REL-04.1', value: 5 }]);
  const complex = head(fast);
  assert.deepEqual(rowOf(complex, 'Recovery tier')[1], 'Complex');
  assert.deepEqual(rowOf(complex, 'Closest worked example')[1], 'PreSDD_GF_CL_Complex.md');
  assert.equal(rowOf(head(apply(fast, [{ op: 'set-run', light: true }])), 'Closest worked example')[1], 'Not given in a light run');
  assert.match(rowOf(head(migrating(approvedState())), 'Migration overlay')[1], /^applies, source onprem, direction TBD, workloads WL-01, WL-02$/);
  assert.equal(rowOf(head(newProject()), 'Path code')[1], 'Unclassified');
});

test('fragments_gateAndValidation_registersAndUnknowns', () => {
  const state = apply(approvedState(), [
    { op: 'add-unknown', question: 'Which region hosts the DR copy?', entry: 'DAT-04.1', impact: 'DR location', owner: 'Dana Reyes', due: '2026-11-30' },
    { op: 'add-unknown', question: 'Is the archive in scope?', owner: 'Omar Haddad' },
    { op: 'close-unknown', id: 'QD-02', resolution: 'Out of scope for phase 1' },
  ]);
  const f = frag(state);
  const val = f['10-validation.md'];
  for (const title of ['Blockers', 'Conflicts', 'Advisories', 'Unknowns']) assert.ok(val.includes(`**${title}**\n\n`), title);
  assert.ok(val.includes('\n| ID | Question | Entry | Impact | Owner | Due | Status | Resolution |\n'));
  assert.deepEqual(rowOf(val, 'QD-01'), ['QD-01', 'Which region hosts the DR copy?', 'DAT-04.1', 'DR location', 'Dana Reyes', '2026-11-30', 'open', 'TBD']);
  assert.deepEqual(rowOf(val, 'QD-02'), ['QD-02', 'Is the archive in scope?', 'none', 'TBD', 'Omar Haddad', 'TBD', 'closed', 'Out of scope for phase 1 (closed by Mahmoud, 2026-10-23T11:01:02Z)']);
  const gate = frag(approvedState())['11-gate.md'];
  assert.deepEqual(rowOf(gate, 'G3 Approve'), ['G3 Approve', 'Approved', 'None']);
  assert.ok(gate.includes('**Gate label:** G3 Approved'));
  const roles = E.SIGNOFF_ROLES.filter((role) => !role.overlayOnly);
  for (const role of roles) assert.deepEqual(rowOf(gate, role.label), [role.label, 'Mahmoud', 'Approved', NOW, 'Counted'], role.key);
  assert.ok(!gate.includes(E.SIGNOFF_ROLES.find((role) => role.overlayOnly).label));
  assert.deepEqual(rowOf(gate, 'G3-11').slice(2), ['Done', 'TBD', 'Mahmoud', NOW]);
  const unsigned = frag(approvedState({ roles: [] }))['11-gate.md'];
  assert.deepEqual(rowOf(unsigned, roles[0].label), [roles[0].label, 'TBD', 'Not signed', 'TBD', 'Not counted']);
});
