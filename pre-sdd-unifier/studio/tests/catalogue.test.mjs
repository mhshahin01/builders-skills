import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngine, readText } from './helpers.mjs';

const E = loadEngine();
const standard = readText(join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'reference', 'Pre-SDD_Architecture_Standard_v1.md')).split('\n');
const groupCodes = ['BUS', 'CAP', 'REL', 'DAT', 'SEC', 'INT', 'OPS', 'ECO'];
const allRows = () => [...E.HEADER_FIELDS, ...E.ITEMS, ...E.OVERLAY_FIELDS];
const rowIds = (rows) => rows.map((row) => row.id);
const rowById = (id) => allRows().find((row) => row.id === id);
const numbered = (prefix, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}-${String(from + i).padStart(2, '0')}`);
const plain = (text) => text.replace(/\*\*/g, '').replace(/\*/g, '');
const cellsOf = (line) => line.split('|').slice(1, -1).map((cell) => cell.trim());

function sectionLines(start, end) {
  const from = standard.findIndex((line) => line.startsWith(start));
  const to = standard.findIndex((line, i) => i > from && line.startsWith(end));
  assert.ok(from >= 0 && to > from, `Standard section "${start}" not found`);
  return standard.slice(from + 1, to);
}

function tableRows(lines, header) {
  return lines.filter((line) => line.startsWith('|')).map(cellsOf).filter((cells) => cells[0] !== header && !/^-+$/.test(cells[0]));
}

const standardItems = sectionLines('## 4. ', '## 5. ').filter((line) => /^\| [A-Z]{3}-\d{2} /.test(line)).map((line) => {
  const [head, ask, infrastructure, network, software] = cellsOf(line).map(plain);
  const match = head.match(/^([A-Z]{3}-\d{2}) (\S+)$/);
  assert.ok(match, `unexpected ID cell: ${head}`);
  return { id: match[1], owners: match[2].split('+'), ask, impacts: { infrastructure, network, software } };
});

const factorRows = {
  callsPerTxn: 'CAP-02', requestFactor: 'CAP-02', utilization: 'CAP-04', meanLatencyMs: 'CAP-07',
  requestKB: 'CAP-06', responseKB: 'CAP-06', networkOverhead: 'CAP-06',
  storedKB: 'DAT-02', initialGB: 'DAT-02', retentionDays: 'DAT-02', indexFactor: 'DAT-02', copies: 'DAT-02',
  cidrPrefix: 'INT-08', transactionNeed: 'DAT-05', queryShape: 'CAP-10', storeKind: 'DAT-01', budgetPressure: 'ECO-01',
  primaryLocation: 'DAT-04', recoveryLocation: 'DAT-04', migrationGB: 'OVL-07', linkMbps: 'OVL-08', cutoverHours: 'OVL-09',
};

const landingTargets = ['Project Type', 'Q3', 'Q7', 'Q8', '§6 Notes', '§8.3', '§8.6', '§8.7', '§11', '§18', '§18.5', '§19', '§20'];

test('versions_matchGlobalConstraints', () => {
  assert.deepEqual([E.ENGINE_VERSION, E.SKILL_VERSION, E.STATE_SCHEMA_VERSION, E.BLUEPRINT_SCHEMA_VERSION], ['3.0.0', '1.0.0', '3.0.0', '2.0.0']);
});

test('GROUPS_namesAndChunkLetters_matchPlan', () => {
  assert.deepEqual(E.GROUPS, {
    BUS: { name: 'Business', chunk: 'a' }, CAP: { name: 'Capacity', chunk: 'b' }, REL: { name: 'Reliability', chunk: 'c' }, DAT: { name: 'Data', chunk: 'd' },
    SEC: { name: 'Security', chunk: 'e' }, INT: { name: 'Integration', chunk: 'f' }, OPS: { name: 'Operations', chunk: 'g' }, ECO: { name: 'Economics', chunk: 'h' },
  });
  assert.deepEqual(Object.keys(E.GROUPS), groupCodes);
  assert.deepEqual([...new Set(standardItems.map((row) => row.id.slice(0, 3)))], groupCodes);
});

test('GROUP_ORDER_isDecisionHierarchy', () => {
  assert.deepEqual(E.GROUP_ORDER, ['BUS', 'SEC', 'DAT', 'INT', 'CAP', 'REL', 'OPS', 'ECO']);
  assert.deepEqual([...E.GROUP_ORDER].sort(), Object.keys(E.GROUPS).sort());
});

test('ITEMS_count_is70', () => {
  assert.equal(E.ITEMS.length, 70);
  assert.equal(new Set(rowIds(E.ITEMS)).size, 70);
  assert.equal(standardItems.length, 70);
});

test('ITEMS_groupCounts_matchStandard', () => {
  const counts = (rows) => groupCodes.map((code) => rows.filter((row) => row.id.startsWith(`${code}-`)).length);
  assert.deepEqual(counts(E.ITEMS), [8, 12, 10, 9, 8, 9, 8, 6]);
  assert.deepEqual(counts(standardItems), [8, 12, 10, 9, 8, 9, 8, 6]);
  for (const row of E.ITEMS) assert.equal(row.group, row.id.slice(0, 3), row.id);
});

test('ITEMS_askAndImpacts_matchStandardRows', () => {
  assert.deepEqual(rowIds(E.ITEMS), rowIds(standardItems));
  E.ITEMS.forEach(({ id, owners, ask, impacts }, i) => assert.deepEqual({ id, owners, ask, impacts }, standardItems[i], id));
});

test('rows_shape_matchesPlan', () => {
  const shape = ['id', 'group', 'owners', 'ask', 'impacts', 'repeat', 'defaultKind', 'stage1', 'valueType', 'unit', 'enumValues', 'factors', 'factOnly', 'proposable', 'landing'];
  for (const row of E.ITEMS) assert.deepEqual(Object.keys(row), shape, row.id);
  for (const row of [...E.HEADER_FIELDS, ...E.OVERLAY_FIELDS]) assert.deepEqual(Object.keys(row).sort(), [...shape, 'label'].sort(), row.id);
  for (const row of allRows()) {
    assert.ok([row.owners, row.factors, row.landing].every(Array.isArray), row.id);
    assert.ok(['text', 'number', 'enum'].includes(row.valueType), row.id);
    assert.equal(Array.isArray(row.enumValues), row.valueType === 'enum', row.id);
    assert.equal(typeof row.unit === 'string', row.valueType === 'number', row.id);
  }
});

test('ITEMS_repeatKinds_matchPlan', () => {
  const repeats = {
    'BUS-02': 'journey', 'CAP-01': 'transaction type', 'CAP-07': 'journey', 'REL-01': 'journey',
    'REL-03': 'scope and journey', 'REL-04': 'scope and dataset', 'REL-05': 'failure scope',
    'DAT-01': 'data workload', 'DAT-05': 'data workload', 'INT-01': 'external system', 'INT-03': 'external system',
  };
  for (const row of E.ITEMS) assert.equal(row.repeat, repeats[row.id] ?? null, row.id);
  for (const row of E.HEADER_FIELDS) assert.equal(row.repeat, null, row.id);
  for (const row of E.OVERLAY_FIELDS) assert.equal(row.repeat, 'workload', row.id);
});

test('ITEMS_stage1_matchDiscoveryMinimum', () => {
  assert.deepEqual(rowIds(allRows().filter((row) => row.stage1 === true)), ['HDR-07', 'HDR-08', 'BUS-05', 'CAP-01', 'CAP-03', 'CAP-04', 'CAP-07', 'REL-01', 'REL-03', 'REL-04', 'REL-05', 'DAT-02', 'ECO-01']);
  for (const row of allRows()) assert.equal(typeof row.stage1, 'boolean', row.id);
});

test('ITEMS_defaultKinds_matchPlan', () => {
  const hard = ['BUS-07', 'BUS-08', 'SEC-01', 'SEC-04', 'DAT-03', 'DAT-04', 'DAT-06'];
  const forecast = ['CAP-01', 'CAP-03', 'CAP-04', 'CAP-05', 'CAP-06', 'CAP-10', 'CAP-12', 'DAT-02'];
  for (const row of allRows()) assert.equal(row.defaultKind, hard.includes(row.id) ? 'hard' : forecast.includes(row.id) ? 'forecast' : 'target', row.id);
});

test('ITEMS_factOnlyAndProposable_matchPlan', () => {
  assert.deepEqual(rowIds(allRows().filter((row) => row.factOnly === true)), [...numbered('HDR', 1, 6), 'BUS-04', 'CAP-01', 'CAP-03', 'CAP-04', 'CAP-05', 'CAP-06', 'CAP-10', 'CAP-12', 'DAT-02', 'INT-03', 'ECO-01']);
  assert.deepEqual(rowIds(allRows().filter((row) => row.proposable === true)), ['CAP-07', 'REL-01', 'REL-03', 'REL-04']);
  for (const row of allRows()) assert.deepEqual([typeof row.factOnly, typeof row.proposable], ['boolean', 'boolean'], row.id);
});

test('ITEMS_calculatorValues_matchPlan', () => {
  const typed = {
    'CAP-01': ['number', 'transactions/day', null], 'CAP-02': ['number', 'req/s', null], 'CAP-04': ['number', '×', null],
    'CAP-05': ['number', '%/yr', null], 'CAP-07': ['number', 'ms', null], 'CAP-10': ['number', '%', null],
    'REL-01': ['number', '%', null], 'REL-03': ['number', 's', null], 'REL-04': ['number', 's', null],
    'REL-05': ['enum', null, ['host', 'az', 'site', 'region', 'provider', 'cyber']],
    'DAT-02': ['number', 'GB/day', null],
    'DAT-03': ['enum', null, ['public', 'internal', 'sensitive']], 'DAT-04': ['enum', null, ['yes', 'no']],
    'DAT-05': ['enum', null, ['strong', 'mixed', 'eventual']],
    'DAT-07': ['enum', null, ['single', 'shared-logical', 'schema-isolated', 'database-isolated', 'deployment-isolated']],
    'INT-08': ['enum', null, ['public', 'private', 'hybrid', 'partner']],
  };
  for (const row of E.ITEMS) assert.deepEqual([row.valueType, row.unit, row.enumValues], typed[row.id] ?? ['text', null, null], row.id);
  for (const [field, target] of Object.entries(E.V22_FIELD_MAP.fields)) {
    if (target.row && !target.factor && E.numeric.has(field)) assert.equal(rowById(target.row).unit, E.units[field], field);
  }
  const calcUnit = (id) => E.calculations(E.defaults).rows.find((row) => row.id === id).unit;
  assert.deepEqual([rowById('CAP-02').unit, rowById('DAT-02').unit], [calcUnit('CALC-03'), calcUnit('CALC-10')]);
});

test('HEADER_FIELDS_matchPlan', () => {
  const header = [
    ['Solution name', null], ['Business sponsor', null], ['Product owner', null], ['Lead architect', null],
    ['Architecture review authority', null], ['Business budget owner', null],
    ['Change type', ['greenfield', 'brownfield', 'mixed']], ['Intended target', ['onprem', 'cloud', 'hybrid', 'undecided']],
    ['Source platforms', null], ['Migration direction', ['none', 'onprem-to-cloud', 'cloud-to-cloud', 'cloud-to-onprem', 'same-platform', 'mixed']],
  ];
  const ids = numbered('HDR', 1, 10);
  assert.deepEqual(E.HEADER_FIELDS.map((row) => [row.id, row.label, row.valueType, row.enumValues]), header.map(([label, values], i) => [ids[i], label, values ? 'enum' : 'text', values]));
  const yamlKeys = sectionLines('### 1.2 ', '## 2. ').map((line) => line.split(':')[0]);
  for (const row of E.HEADER_FIELDS) {
    const key = row.label.toLowerCase().replace(/ /g, '_');
    assert.ok(yamlKeys.some((yamlKey) => yamlKey === key || yamlKey.startsWith(`${key}_`)), `${row.id} has no field in Standard section 1.2`);
    assert.deepEqual([row.group, row.owners, row.ask, row.impacts], ['HDR', [], null, null], row.id);
  }
});

test('OVERLAY_FIELDS_matchStandardTable', () => {
  const table = tableRows(sectionLines('## 8. ', '### 8.1 '), 'Field').map(([label, ask]) => [plain(label), plain(ask)]);
  assert.equal(table.length, 12);
  const ids = numbered('OVL', 1, 12);
  assert.deepEqual(E.OVERLAY_FIELDS.map((row) => [row.id, row.label, row.ask]), table.map((cells, i) => [ids[i], ...cells]));
  for (const row of E.OVERLAY_FIELDS) assert.deepEqual([row.group, row.owners, row.impacts], ['OVL', [], null], row.id);
});

test('FACTORS_attachToExistingRows', () => {
  assert.deepEqual(Object.keys(E.FACTORS), Object.keys(factorRows));
  const known = new Set(rowIds(allRows()));
  for (const [name, factor] of Object.entries(E.FACTORS)) {
    assert.equal(factor.row, factorRows[name], name);
    assert.ok(known.has(factor.row), `${name} attaches to missing row ${factor.row}`);
  }
  for (const row of allRows()) assert.deepEqual(row.factors, Object.keys(factorRows).filter((name) => factorRows[name] === row.id), row.id);
});

test('V22_FIELD_MAP_coversEveryV22Field', () => {
  const { fields, dropped, extraWorkloads } = E.V22_FIELD_MAP;
  assert.deepEqual(dropped, ['approver', 'approveReqs', 'approveSecurity', 'approveArchitecture', 'approveRisks', 'evidenceRef', 'owner']);
  for (const id of E.fieldIds) assert.ok(Object.hasOwn(fields, id) !== dropped.includes(id), `${id} must be mapped or dropped, not both`);
  assert.deepEqual([...Object.keys(fields), ...dropped].sort(), [...E.fieldIds].sort());
  const factor = (name) => ({ row: factorRows[name], factor: name });
  const sameName = ['callsPerTxn', 'requestFactor', 'meanLatencyMs', 'utilization', 'requestKB', 'responseKB', 'networkOverhead', 'storedKB', 'retentionDays', 'initialGB', 'indexFactor', 'copies', 'cidrPrefix', 'transactionNeed', 'queryShape', 'migrationGB', 'linkMbps', 'cutoverHours'];
  assert.deepEqual(fields, {
    solutionName: { row: 'HDR-01' }, brdRef: { path: 'project.brds', field: 'key' }, changeType: { row: 'HDR-07' }, target: { row: 'HDR-08' },
    dailyTxn: { row: 'CAP-01' }, peakFactor: { row: 'CAP-04' }, p99Ms: { row: 'CAP-07' }, annualGrowth: { row: 'CAP-05' },
    availability: { row: 'REL-01' }, failureScope: { row: 'REL-05' }, rtoSec: { row: 'REL-03' }, rpoSec: { row: 'REL-04' },
    budget: factor('budgetPressure'), dataKind: factor('storeKind'), dataConsistency: { row: 'DAT-05' },
    connectivity: { row: 'INT-08' }, sensitiveData: { row: 'DAT-03' },
    ...Object.fromEntries(sameName.map((name) => [name, factor(name)])),
    readPercent: { row: 'CAP-10' },
    tenantModel: { row: 'DAT-07', values: { shared: 'shared-logical', isolated: 'database-isolated', single: 'single' } },
    regionLabel: factor('primaryLocation'), recoveryLabel: factor('recoveryLocation'), residency: { row: 'DAT-04' },
    migration: { path: 'register.overlay.applies', values: { yes: true, no: false } }, sourcePlatform: { path: 'register.overlay.source' },
    businessProblem: { row: 'BUS-01' },
    topologyOverride: { path: 'decisions.topology_override' }, drOverride: { path: 'decisions.dr_overrides' }, overrideReason: { path: 'decisions.override_reason' },
  });
  assert.deepEqual(extraWorkloads, {
    fromEntry: 2,
    fields: { name: [{ row: 'DAT-01', field: 'label' }, { row: 'DAT-05', field: 'label' }], kind: [{ row: 'DAT-01', factor: 'storeKind' }], consistency: [{ row: 'DAT-05' }] },
  });
  for (const target of [...Object.values(fields), ...Object.values(extraWorkloads.fields).flat()]) {
    if (target.row) assert.ok(rowById(target.row), `missing row ${target.row}`);
    if (target.factor) assert.equal(E.FACTORS[target.factor]?.row, target.row, `${target.factor} is not attached to ${target.row}`);
  }
  for (const value of Object.values(fields.tenantModel.values)) assert.ok(rowById('DAT-07').enumValues.includes(value), value);
});

test('REQ_TO_ITEM_matchesPlan', () => {
  assert.deepEqual(E.REQ_TO_ITEM, {
    'REQ-PLAT-001': 'HDR-07', 'REQ-PLAT-002': 'HDR-08', 'REQ-CAP-001': 'CAP-01', 'REQ-CAP-002': 'CAP-04', 'REQ-CAP-003': 'CAP-05',
    'REQ-PERF-001': 'CAP-07', 'REQ-REL-001': 'REL-01', 'REQ-DR-001': 'REL-03', 'REQ-DR-002': 'REL-04', 'REQ-DR-003': 'REL-05',
    'REQ-ECO-001': 'ECO-01', 'REQ-DAT-001': 'DAT-01', 'REQ-DAT-002': 'DAT-05', 'REQ-SEC-001': 'DAT-03', 'REQ-SEC-002': 'DAT-04',
    'REQ-NET-001': 'INT-08', 'REQ-MIG-001': 'OVL-04',
  });
  assert.deepEqual(Object.keys(E.REQ_TO_ITEM).sort(), [...new Set(Object.values(E.reqIDs))].sort());
  for (const [field, req] of Object.entries(E.reqIDs)) {
    assert.ok(rowById(E.REQ_TO_ITEM[req]), req);
    const target = E.V22_FIELD_MAP.fields[field];
    if (target.row) assert.equal(E.REQ_TO_ITEM[req], target.row, `${field} ${req}`);
  }
});

test('LANDINGS_useAllowedTargetsOnly', () => {
  assert.deepEqual(E.LANDINGS.targets, landingTargets);
  const known = new Set(rowIds(allRows()));
  for (const [id, targets] of Object.entries(E.LANDINGS.rows)) {
    assert.ok(known.has(id), `landing for missing row ${id}`);
    assert.ok(targets.length > 0 && targets.every((target) => landingTargets.includes(target)), `${id}: ${targets}`);
  }
  for (const row of allRows()) assert.deepEqual(row.landing, E.LANDINGS.rows[row.id] ?? [], row.id);
});

test('LANDINGS_rows_matchPlan', () => {
  const land = (ids, targets) => ids.map((id) => [id, targets]);
  assert.deepEqual(E.LANDINGS.rows, Object.fromEntries([
    ...land(['HDR-07'], ['Project Type']),
    ...land(['HDR-08'], ['Q8', '§8.3', '§8.6']),
    ...land([...numbered('CAP', 1, 7), 'CAP-09', 'CAP-10', 'DAT-02', 'DAT-08'], ['§18', 'Q3']),
    ...land(['REL-01'], ['§8.6', '§18.5', 'Q3']),
    ...land(['REL-02'], ['§18.5', 'Q3']),
    ...land(numbered('REL', 3, 5), ['§8.6', '§11', '§18.5', '§19', '§20']),
    ...land(['REL-06', 'REL-07', 'OPS-06'], ['§20']),
    ...land(['DAT-09'], ['§8.6', '§20']),
    ...land(['DAT-03', 'DAT-06', 'SEC-01', 'SEC-02', 'SEC-05', 'SEC-06', 'SEC-08'], ['§11', '§6 Notes']),
    ...land(['DAT-04'], ['§8.6', '§8.7', '§11', '§6 Notes']),
    ...land(['SEC-03', 'SEC-04', 'SEC-07'], ['§8.7', '§11', '§6 Notes']),
    ...land(['DAT-05', 'INT-02', 'INT-04', 'INT-05'], ['§6 Notes', '§8.3']),
    ...land(['DAT-07'], ['Q7', '§11']),
    ...land(['INT-06'], ['§8.7']),
    ...land(['INT-07'], ['§8.6', '§8.7']),
    ...land(['INT-08'], ['§8.3', '§8.7', '§11']),
    ...land(['OPS-04'], ['§19']),
    ...land(['ECO-01', 'ECO-03'], ['§6 Notes']),
    ...land(['DAT-01'], ['§6 Notes', '§8.3']),
    ...land(['INT-03'], ['§8.3', '§18']),
    ...land(['CAP-08'], ['§18', '§18.5']),
    ...land(['REL-10'], ['§8.6', '§11', '§18.5']),
    ...land(['BUS-07', 'BUS-08'], ['§11']),
  ]));
});

test('LANDINGS_hardRows_allLandInTheSdd', () => {
  const hard = rowIds(allRows().filter((row) => row.defaultKind === 'hard'));
  assert.deepEqual(hard, ['BUS-07', 'BUS-08', 'DAT-03', 'DAT-04', 'DAT-06', 'SEC-01', 'SEC-04']);
  for (const id of hard) assert.ok((E.LANDINGS.rows[id] || []).includes('§11'), id);
  assert.deepEqual(E.LANDINGS.factors, { 'DAT-01': ['storeKind'] });
});

test('LANDINGS_preSddAnswers_landInTheSdd', () => {
  assert.deepEqual(['DAT-01', 'INT-03', 'CAP-08', 'REL-10', 'CAP-03'].map((id) => [id, rowById(id).landing]), [
    ['DAT-01', ['§6 Notes', '§8.3']],
    ['INT-03', ['§8.3', '§18']],
    ['CAP-08', ['§18', '§18.5']],
    ['REL-10', ['§8.6', '§11', '§18.5']],
    ['CAP-03', ['§18', 'Q3']],
  ]);
});

test('SIGNOFF_ROLES_matchStandardRegister', () => {
  const roles = tableRows(sectionLines('### 11.2 ', '## 12. '), 'Role').map(([role]) => role);
  assert.equal(roles.length, 11);
  const snake = (role) => role.replace(/\(.*?\)/g, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
  assert.deepEqual(E.SIGNOFF_ROLES.map((role) => [role.key, role.label]), roles.map((role) => [snake(role), role]));
  assert.deepEqual(E.SIGNOFF_ROLES.filter((role) => role.overlayOnly === true).map((role) => role.key), ['migration_owner']);
  for (const role of E.SIGNOFF_ROLES) assert.equal(typeof role.overlayOnly, 'boolean', role.key);
});

test('G3_CHECKLIST_matchStandardLines', () => {
  const lines = sectionLines('### 11.1 ', '### 11.2 ').filter((line) => line.startsWith('- [ ] ')).map((line) => line.slice(6));
  assert.equal(lines.length, 14);
  const ids = numbered('G3', 1, 14);
  assert.deepEqual(E.G3_CHECKLIST, lines.map((text, i) => ({ id: ids[i], text })));
});
