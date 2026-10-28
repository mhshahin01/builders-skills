import assert from 'node:assert/strict';
import { loadEngine } from './helpers.mjs';

const E = loadEngine();

export const NOW = '2026-10-23T11:01:02Z';
export const LATER = '2026-10-24T08:30:00Z';
export const person = { type: 'person', name: 'Mahmoud', label: '' };
export const agent = { type: 'agent', name: 'E2E Architect', label: '' };
export const BRDS = [
  { key: 'REFUNDS', path: 'brd-refunds/refunds-brd-master.md', version: '1.5', status: 'Approved' },
  { key: 'RESELLER-PORTAL', path: 'brd-reseller-portal/reseller-portal-brd-master.md', version: '2.0' },
];
export const ROLES = E.SIGNOFF_ROLES.filter((role) => !role.overlayOnly).map((role) => role.key);
const CRITICAL = ['HDR-07.1', 'HDR-08.1', 'CAP-01.1', 'CAP-04.1', 'CAP-07.1', 'REL-01.1', 'REL-03.1', 'REL-04.1', 'REL-05.1', 'DAT-01.1', 'DAT-05.1', 'DAT-03.1', 'INT-08.1'];
const CRITICAL_VALUES = ['greenfield', 'cloud', 864000, 5, 300, 99.9, 600, 60, 'az', 'Refund ledger, the system of record', 'strong', 'sensitive', 'public'];
const CONTENT = [
  { op: 'set', entry: 'HDR-01.1', value: 'Refunds platform' },
  { op: 'set', entry: 'HDR-02.1', value: 'Jane Doe' },
  { op: 'set', entry: 'HDR-04.1', value: 'Omar Haddad' },
  { op: 'set', entry: 'BUS-01.1', value: 'Cut refund handling time to one day' },
  { op: 'set', entry: 'BUS-03.1', value: 'Refund intake and payout; chargebacks in a later phase' },
  { op: 'set', entry: 'BUS-07.1', value: 'No card data leaves the EU' },
  { op: 'set', entry: 'BUS-08.1', value: 'Refund within 5 days or pay the penalty' },
  { op: 'set', entry: 'DAT-04.1', value: 'yes' },
  { op: 'set-factor', entry: 'DAT-04.1', factor: 'primaryLocation', value: 'Frankfurt' },
  { op: 'set', entry: 'DAT-06.1', value: 'Keep refunds for 7 years' },
  { op: 'set', entry: 'DAT-07.1', value: 'schema-isolated' },
  { op: 'set', entry: 'SEC-01.1', value: 'PCI DSS 4.0' },
  { op: 'set', entry: 'SEC-04.1', value: 'TLS 1.3 in transit, KMS keys at rest' },
  ...CRITICAL.map((entry, i) => ({ op: 'set', entry, value: CRITICAL_VALUES[i] })),
  { op: 'set-factor', entry: 'DAT-01.1', factor: 'storeKind', value: 'relational' },
];
export const OPTION = { op: 'set-option', name: 'One region, multi-AZ', shape: { hosting: 'cloud', topology: 'multiAZ' } };
export const CONDITION = { op: 'add-condition', text: 'Load test at twice the peak before go-live', owner: 'SRE lead', due: '2026-12-01' };

export function apply(state, ops, actor = person, now = NOW) {
  const result = E.applyPatch(state, ops, actor, { now });
  assert.deepEqual(result.errors, [], 'setup ops must apply');
  return result.state;
}

export const assign = (rows) => rows.map((row) => ({ op: 'set', entry: `${row.id}.1`, owner_name: 'Dana Reyes', due: '2026-12-01' }));
export const signOps = (roles, decision = 'Approved') => roles.map((role) => ({ op: 'sign', role, decision }));

export function newProject(extra = {}) {
  return E.newState({ name: 'Refunds platform', slug: 'refunds-platform', now: NOW, ...extra });
}

export function approvedState({ roles = ROLES, brds = BRDS } = {}) {
  let state = newProject({ brds });
  state = apply(state, CONTENT);
  state = apply(state, [...CRITICAL.map((entry) => ({ op: 'confirm', entry })), { op: 'confirm', entry: 'DAT-01.1', factor: 'storeKind' }]);
  state = apply(state, assign([...E.HEADER_FIELDS, ...E.ITEMS]));
  state = apply(state, [OPTION], agent);
  state = apply(state, E.G3_CHECKLIST.map((line) => ({ op: 'check', id: line.id, status: 'Done' })));
  return apply(state, signOps(roles));
}

export function resign(state, roles = ROLES, now = LATER) {
  return apply(state, signOps(roles), person, now);
}

export function deepFreeze(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x);
    for (const value of Object.values(x)) deepFreeze(value);
  }
  return x;
}
