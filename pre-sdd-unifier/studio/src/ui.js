(() => { 'use strict'; const { newState, normalizeState, applyPatch, applyDefaults, derive, compute, registerView, fieldError, stageBlock, rowEntries, primaryEntry, parseEntryId, toCalcInputs, importForPage, readStoredZip, readSave, saveWrapper, saveFileName, previewFiles, optionStatus, signoffRecords, GROUPS, GROUP_ORDER, ITEMS, HEADER_FIELDS, OVERLAY_FIELDS, CRITERIA, OVERRIDE_VALUES, SIGNOFF_ROLES, G3_CHECKLIST, ENGINE_NAME, recoveryTier, closestExample, presets, known, fmt, compact, time, drNames, topoNames, providerCatalog, mermaid, diagramSVG, escapeHtml, catalogFor, buildDiagrams, drawio, optionalDiagramIDs, filteredGraph, zipStored } = globalThis.PreSddEngine;

const $ = (id) => document.getElementById(id);
const h = (x) => escapeHtml(x);
const EM = String.fromCharCode(8212), EN = String.fromCharCode(8211), EM_RUN = new RegExp(`\\s*${EM}\\s*`, 'g'), EN_ALL = new RegExp(EN, 'g');
const plain = (x) => String(x ?? '').replace(EM_RUN, ', ').replace(EN_ALL, ' to ');
const esc = (x) => escapeHtml(plain(x));
const num = (x) => (known(x) ? compact(x) : 'TBD');
const nowIso = () => new Date().toISOString();

const STAGES = [[1, 'Discovery'], [2, 'Register'], [3, 'Assess'], [4, 'Confirm and decide']];
const GROUP_TABS = ['HDR', ...GROUP_ORDER];
const SCOPES = ITEMS.find((row) => row.id === 'REL-05').enumValues;
const SCOPED_ROWS = ['REL-03', 'REL-04'];
const KINDS = ['hard', 'target', 'forecast', 'assumption'];
const PRIORITIES = ['Must', 'Should', 'Could'];
const NAME_FIRST = 'Enter your name in Your name first.';
const STATUS_CHIP = { Open: 'chip amber', Estimated: 'chip', Confirmed: 'chip green', 'N/A': 'chip' };
const KIND_TEXT = { hard: 'Hard guardrail', target: 'Negotiable target', forecast: 'Forecast', assumption: 'Assumption' };
const OWNER_TEXT = { B: 'Business', E: 'Engineering', D: 'Data', Sec: 'Security', Ops: 'Operations', Fin: 'Finance', Legal: 'Legal' };
const UNIT_WORDS = { '%': 'percent', '%/yr': 'percent per year', s: 'seconds', ms: 'milliseconds', '×': 'times', 'req/s': 'requests per second', 'transactions/day': 'transactions per day', 'GB/day': 'GB per day', ratio: 'a ratio from 0 to 1', 'calls/txn': 'calls per transaction', 'KB/request': 'KB per request', 'KB/response': 'KB per response', 'KB/txn': 'KB per transaction', days: 'days', GB: 'GB', prefix: 'prefix length', Mbps: 'Mbps', hours: 'hours' };
const VALUE_LABELS = { 'CAP-01': 'Transactions per day', 'CAP-02': 'Peak API requests per second', 'CAP-04': 'Peak multiplier (the peak divided by the average)', 'CAP-05': 'Yearly growth in percent', 'CAP-07': 'P99 latency in milliseconds', 'CAP-10': 'Read share in percent', 'REL-01': 'Availability in percent', 'REL-03': 'RTO in seconds', 'REL-04': 'RPO in seconds (0 is valid)', 'REL-05': 'Failure scope', 'DAT-02': 'New data per day in GB', 'DAT-03': 'Data sensitivity', 'DAT-04': 'Residency restriction applies', 'DAT-05': 'Consistency', 'DAT-07': 'Tenant isolation level', 'INT-08': 'Connectivity', 'HDR-07': 'Change type', 'HDR-08': 'Intended target', 'HDR-10': 'Migration direction' };
const CHOICE_TEXT = { host: 'Host or process', az: 'Zone or rack', site: 'Data center or site', region: 'Entire region', provider: 'Entire cloud provider', cyber: 'Cyber attack or corruption', greenfield: 'Greenfield', brownfield: 'Brownfield', mixed: 'Mixed', onprem: 'On-premises', cloud: 'Cloud', hybrid: 'Hybrid', undecided: 'Undecided', public: 'Public', internal: 'Internal', sensitive: 'Sensitive or regulated', yes: 'Yes', no: 'No', strong: 'Strong (ACID)', eventual: 'Eventual is acceptable', single: 'Single tenant', 'shared-logical': 'Shared, logically isolated', 'schema-isolated': 'Schema per tenant', 'database-isolated': 'Database per tenant', 'deployment-isolated': 'Deployment per tenant', private: 'Private or internal only', partner: 'External partner', none: 'None', 'onprem-to-cloud': 'On-premises to cloud', 'cloud-to-cloud': 'Cloud to cloud', 'cloud-to-onprem': 'Cloud to on-premises', 'same-platform': 'Same platform', relational: 'Relational OLTP', document: 'Document', keyvalue: 'Key-value', analytics: 'Analytical or warehouse', timeseries: 'Time-series', complex: 'Joins or complex SQL', simple: 'Key-based lookups', tight: 'Tight, cost sensitive', balanced: 'Balanced', resilience: 'Resilience first' };
const FIELD_TEXT = { label: 'Entry label', scope: 'Failure scope', window: 'Window', measured_at: 'Where it is measured', priority: 'Priority', verification: 'Verification method', owner: 'Owner codes', owner_name: 'Owner name', due: 'Due date (YYYY-MM-DD)', evidence: 'Evidence reference' };
const FIELD_SHORT = { value: 'value', label: 'label', scope: 'scope', window: 'window', measured_at: 'measurement point', priority: 'priority', verification: 'verification method', owner: 'owner codes', owner_name: 'owner name', due: 'due date', evidence: 'evidence reference' };
const FIELD_HINTS = { label: 'For example: Refund payout journey', window: 'For example: busiest hour, monthly', measured_at: 'For example: at the API gateway', verification: 'For example: load test at twice the peak', owner: 'For example: B+E', owner_name: 'For example: Dana Reyes', due: 'YYYY-MM-DD', evidence: 'For example: a ticket or document reference' };
const ROW_CALCS = { 'CAP-01': ['CALC-01', 'CALC-02'], 'CAP-02': ['CALC-03', 'CALC-04'], 'CAP-04': ['CALC-02'], 'CAP-05': ['CALC-16'], 'CAP-06': ['CALC-06', 'CALC-07', 'CALC-08'], 'CAP-07': ['CALC-05'], 'CAP-10': ['CALC-19', 'CALC-20'], 'REL-01': ['CALC-13', 'CALC-14'], 'REL-04': ['CALC-15'], 'DAT-02': ['CALC-10', 'CALC-11', 'CALC-12'], 'INT-08': ['CALC-18'] };
const EXAMPLES = { cloudSaaS: 'General SaaS', regionalPayments: 'Regional payment resilience', onprem: 'On-premises business portal', migration: 'On-premises to cloud', cloud2cloud: 'Cloud to cloud' };
const CRITERION_TEXT = { nfr_fit: 'Fit to the NFRs', one_time_cost: 'One-time cost', recurring_tco: 'Recurring cost (TCO)', delivery_time: 'Delivery time', operability: 'Operability', security_compliance: 'Security and compliance', reversibility: 'Reversibility', uncertainty: 'Uncertainty' };
const COST_TEXT = { one_time: 'One-time cost', monthly: 'Monthly cost' };
const SHAPE_TEXT = { hosting: 'Hosting', topology: 'Topology', dr: 'DR strategy', data: 'Data', network: 'Network' };
const SHAPE_VALUES = { hosting: HEADER_FIELDS.find((row) => row.id === 'HDR-08').enumValues.filter((x) => x !== 'undecided'), topology: Object.keys(topoNames).filter((k) => k !== 'undetermined'), dr: Object.keys(drNames).filter((k) => !['unresolved', 'cyberReview'].includes(k)), network: ITEMS.find((row) => row.id === 'INT-08').enumValues };
const PROVIDERS = ['logical', 'aws', 'azure', 'gcp', 'onprem'];
const DIAGRAM_TEXT = { infrastructure: 'Infrastructure', network: 'Network', dr: 'DR and failover', data: 'Data flow', security: 'Security', integration: 'Integration', deployment: 'Deployment' };
const METRICS = [['mAverage', 'Average business TPS', 'avg', 'Daily transactions divided by 86,400'], ['mPeak', 'Peak business TPS', 'peakTPS', 'Average times the peak multiplier'], ['mRps', 'Peak API requests per second', 'rps', 'With calls per transaction and request amplification'], ['mCapacity', 'Throughput budget in requests per second', 'throughput', 'Not a server count'], ['mMbps', 'Peak ingress and egress in Mbps', 'mbps', 'Modelled boundary traffic'], ['mStorage', 'Retained footprint in GB', 'footprint', 'Modelled; excludes backups']];
const G2_TEXT = { shortlist: 'Shortlist ready', incomplete: 'Incomplete', blocker: 'Ends in a blocker' };
const OPTION_STATUS = { chosen: ['Chosen', 'chip green'], excluded: ['Excluded', 'chip red'], shortlisted: ['Shortlisted', 'chip green'], removed: ['Fails a hard check', 'chip red'], pending: ['Hard checks cannot run yet', 'chip amber'] };
const STATE_KIND = 'pre-sdd-project-state', SAVE_KIND = 'pre-sdd-save';
const IMPORT_TEXT = { save: ' (a save file)', state: ' (a project state)', zip: ' (the project state in a preview ZIP)', v22: '. Studio 2.2 values come in as Estimated, never confirmed' };

const view = { stage: 1, group: 'HDR', person: '', personOk: false, notes: {}, drafts: {}, order: {}, open: new Set(), removing: null, clearing: null, pending: null, scenario: 'blank', provider: 'logical', diagram: 'infrastructure', showOptional: false };
const pointer = { down: false, pending: null };
let project = null, model = null, shown = null, lastValue = new Map();

const groupName = (g) => (g === 'HDR' ? 'Project' : g === 'OVL' ? 'Migration overlay' : GROUPS[g].name);
const keyId = (key) => key.replace(/[^A-Za-z0-9-]/g, '_');
const fid = (key) => `f-${keyId(key)}`;
const mid = (key) => `m-${keyId(key)}`;
const unitWord = (unit) => UNIT_WORDS[unit] || unit || '';
const choiceText = (v) => CHOICE_TEXT[v] || String(v);
const utcText = (iso) => (typeof iso === 'string' && iso.length >= 19 ? `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC` : '');
const draft = (key, v) => (Object.hasOwn(view.drafts, key) ? view.drafts[key] : v === null || v === undefined ? '' : String(v));
const invalid = (key) => (view.notes[key] && view.notes[key].kind === 'error' ? ' aria-invalid="true"' : '');
const disabledAttr = () => (view.personOk ? '' : ` disabled title="${NAME_FIRST}"`);
const personActor = () => ({ type: 'person', name: view.person.trim() });
const storedOption = (id) => project.options.list.find((o) => o && o.id === id) || null;

function toast(text) { const box = $('toast'); box.textContent = text; box.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => box.classList.remove('show'), 4500); }
function alertPage(lines) {
  const box = $('pageAlert');
  if (!lines || !lines.length) { box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  box.innerHTML = lines.length === 1 ? h(lines[0]) : `<strong>${h(lines[0])}</strong><ul>${lines.slice(1).map((line) => `<li>${h(line)}</li>`).join('')}</ul>`;
}
function errorLines(err) { return String(err && err.message ? err.message : err).split('\n').map((line) => line.replace(/^- /, '').trim()).filter(Boolean); }
function valueText(row, v) {
  if (v === null || v === undefined || v === '') return 'TBD';
  if (row.valueType === 'enum') return choiceText(v);
  if (row.valueType === 'number') return `${fmt(v, 4)} ${unitWord(row.unit)}`.trim();
  return String(v);
}
function factorText(f) { if (f.value === null || f.value === undefined || f.value === '') return 'TBD'; return f.valueType === 'choice' ? choiceText(f.value) : f.valueType === 'number' ? `${fmt(f.value, 4)} ${unitWord(f.unit)}`.trim() : String(f.value); }
function calcText(r) { return !known(r.result) ? 'TBD' : r.unit === 's' ? time(r.result) : `${fmt(r.result, 2)} ${r.unit}`; }
function money(x) { return known(x) ? `${fmt(x, 2)} currency units` : 'TBD'; }

function engineRun(state, now) { return derive(applyDefaults(state, { now }).state, { now }).state; }
function blankProject(now) { return engineRun(newState({ name: 'Untitled project', slug: 'untitled-project', input: 'web', now }), now); }
function hasPersonAnswers() { return project.history.some((r) => r && r.actor && r.actor.type === 'person' && r.op !== 'set-run'); }
function personProblem(name) {
  if (!name) return 'Enter your name, for example Dana Reyes. Every answer and confirmation records it with the UTC date.';
  const r = applyPatch(project, [], { type: 'person', name }, { now: nowIso() });
  return r.errors.length ? `${r.errors[0].message} Enter your own name, for example Dana Reyes.` : null;
}
function savedEntry(id) { const p = parseEntryId(id); return p ? rowEntries(project, p.rowId).find((e) => e.n === p.n) || null : null; }
function savedValue(id, field, factor) { const e = savedEntry(id); if (!e) return null; if (factor) return e.factors && e.factors[factor] ? e.factors[factor].value : null; return e[field] ?? null; }

function msgInner(key) {
  const n = view.notes[key];
  return n ? `${h(n.text)}${n.clear ? ` <button type="button" class="button xs" data-action="clear-field" data-target="${h(key)}" data-key="${h(key)}|clear"${disabledAttr()}>Clear</button>` : ''}` : '';
}
function msgHtml(key) { const n = view.notes[key]; return `<div class="field-msg${n ? ` ${n.kind}` : ''}" id="${mid(key)}" aria-live="polite">${msgInner(key)}</div>`; }
function paintNote(key) {
  const box = $(mid(key)), field = $(fid(key)), n = view.notes[key];
  if (box) { box.className = `field-msg${n ? ` ${n.kind}` : ''}`; box.innerHTML = msgInner(key); }
  if (field) { if (n && n.kind === 'error') field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid'); }
}
function note(key, kind, text, clear = false) { view.notes[key] = { kind, text, clear }; paintNote(key); }
function clearNote(key) { delete view.notes[key]; paintNote(key); }

function byKey(key) { return key ? [...document.querySelectorAll('[data-key]')].find((el) => el.dataset.key === key) || null : null; }
function restoreFocus(keys) {
  for (const key of keys) {
    if (!key) continue;
    const el = key.startsWith('#') ? $(key.slice(1)) : byKey(key);
    if (el && !el.disabled && el.getClientRects().length) { el.focus(); return; }
  }
}
function activeKey() { const el = document.activeElement; return el && el.dataset ? el.dataset.key || null : null; }
function refresh(focus = []) {
  const was = activeKey();
  try { model = compute(project, { now: nowIso() }); } catch (err) { model = null; alertPage(['The engine could not compute this project.', ...errorLines(err)]); }
  render();
  restoreFocus([...focus, was]);
}
function refreshSoon(focus) { if (pointer.down) { pointer.pending = focus; return; } refresh(focus); }

function act(ops, { key = null, focus = [], done = '', defer = false } = {}) {
  if (!view.personOk) { showPerson(personProblem(view.person.trim()) || NAME_FIRST); $('personName').focus(); return false; }
  const now = nowIso(), result = applyPatch(project, ops, personActor(), { now });
  if (result.errors.length) {
    const text = `Not saved: ${result.errors.map((e) => e.message).join(' ')}`;
    if (key && $(mid(key))) note(key, 'error', text); else alertPage([text]);
    return false;
  }
  let next = result.state, warning = null;
  try { next = engineRun(next, now); } catch (err) { warning = `Your change is saved, but the engine could not refresh the derived values: ${err.message}`; }
  project = next;
  if (key) { delete view.notes[key]; delete view.drafts[key]; }
  alertPage(warning ? [warning] : null);
  if (defer) setTimeout(() => refreshSoon(focus), 0); else refreshSoon(focus);
  if (done) toast(done);
  return true;
}

function statusCounts() {
  const out = { Open: 0, Estimated: 0, Confirmed: 0, 'N/A': 0 }, r = project.register;
  for (const rows of [r.header, r.items, ...(r.overlay.applies === true ? [r.overlay.rows] : [])]) for (const list of Object.values(rows)) for (const e of list) if (Object.hasOwn(out, e.status)) out[e.status] += 1;
  return out;
}
const openIn = (rows) => rows.reduce((n, row) => n + row.entries.filter((e) => e.needsAnswer).length, 0);

function render() {
  lastValue = new Map();
  for (const r of project.history) if (r && typeof r.target === 'string' && r.to && typeof r.to === 'object' && Object.hasOwn(r.to, 'value')) lastValue.set(r.target, r);
  renderTop();
  renderStepper();
  for (const [n] of STAGES) $(`stage${n}`).hidden = view.stage !== n;
  for (const id of ['nameNeeded1', 'nameNeeded2', 'nameNeeded3', 'nameNeeded4']) $(id).hidden = view.personOk;
  renderStage1();
  renderStage2();
  renderStage3();
  renderStage4();
}
function renderTop() {
  const hdr = primaryEntry(project, 'HDR-01');
  $('solutionName').value = hdr && hdr.value ? String(hdr.value) : project.project.name;
  const c = statusCounts();
  $('topStatus').textContent = `${model ? `Gate: ${model.gate.label}. ` : ''}Open ${c.Open}, Estimated ${c.Estimated}, Confirmed ${c.Confirmed}, N/A ${c['N/A']}`;
}
function renderStepper() {
  const s1 = registerView(project, { stage: 1 }), all = registerView(project, { stage: 2 });
  const counts = { 1: `${openIn(s1)} open`, 2: `${openIn(all)} open`, 3: model ? `G2: ${G2_TEXT[model.gate.g2.result] || model.gate.g2.result}` : 'Not computed', 4: model ? `${estimatedTotal()} Estimated` : 'Not computed' };
  $('stepper').innerHTML = STAGES.map(([n, name]) => {
    const block = stageBlock(project, n);
    return `<li><button type="button" data-stage="${n}" data-key="stage|${n}"${view.stage === n ? ' aria-current="step"' : ''}${block ? ` aria-disabled="true" aria-describedby="stepWhy${n}" title="${h(block)}"` : ''}><span class="step-n">Stage ${n}</span> ${h(name)} <span class="step-count">${h(counts[n])}</span></button>${block ? `<span class="sr-only" id="stepWhy${n}">${h(block)}</span>` : ''}</li>`;
  }).join('');
  const quick = stageBlock(project, 2), stepNote = $('stepNote');
  if (!quick) delete stepNote.dataset.stage;
  stepNote.hidden = !quick;
  stepNote.textContent = quick ? stageBlock(project, Number(stepNote.dataset.stage || 2)) : '';
  const run = project.run;
  $('runNote').textContent = `Recorded position: stage ${run.stage}${run.group ? `, ${groupName(run.group)} group` : ''}.${view.personOk ? '' : ' Moves are recorded once you enter your name.'}`;
}
function recordRun(run) {
  if (!view.personOk) return;
  const result = applyPatch(project, [{ op: 'set-run', ...run }], personActor(), { now: nowIso() });
  if (result.errors.length) { alertPage([`Not recorded: ${result.errors.map((e) => e.message).join(' ')}`]); return; }
  project = result.state;
}
function renderStage1() {
  const box = $('stage1Rows');
  if (view.stage !== 1) { box.innerHTML = ''; return; }
  const rows = registerView(project, { stage: 1 });
  $('stage1Count').textContent = `${rows.filter((r) => r.entries.some((e) => e.needsAnswer)).length} of ${rows.length} items need an answer`;
  box.innerHTML = rows.map(rowCard).join('');
}
function ordered(group, rows) {
  const key = `2:${group}`, seen = view.order[key];
  if (!seen) { view.order[key] = rows.map((r) => r.rowId); return rows; }
  const byId = new Map(rows.map((r) => [r.rowId, r]));
  return [...seen.filter((id) => byId.has(id)).map((id) => byId.get(id)), ...rows.filter((r) => !seen.includes(r.rowId))];
}
function renderStage2() {
  const box = $('stage2Rows');
  if (view.stage !== 2) { box.innerHTML = ''; $('groupTabs').innerHTML = ''; $('groupBar').innerHTML = ''; return; }
  if (!GROUP_TABS.includes(view.group)) view.group = GROUP_TABS[0];
  const views = Object.fromEntries(GROUP_TABS.map((g) => [g, registerView(project, { stage: 2, group: g })]));
  $('groupTabs').innerHTML = GROUP_TABS.map((g) => {
    const on = g === view.group;
    return `<button type="button" role="tab" id="tab-${g}" data-group="${g}" data-key="tab|${g}" aria-selected="${on}" aria-controls="stage2Rows" tabindex="${on ? 0 : -1}"${on ? ' class="selected"' : ''}>${h(groupName(g))} (${openIn(views[g])} open)</button>`;
  }).join('');
  const rows = ordered(view.group, views[view.group]);
  const prefilled = rows.reduce((n, r) => n + r.entries.reduce((m, e) => m + (e.status === 'Estimated' ? 1 : 0) + e.factors.filter((f) => f.status === 'Estimated').length, 0), 0);
  $('stage2Count').textContent = `${openIn(GROUP_ORDER.flatMap((g) => views[g]))} entries open across the 70 items`;
  const reason = !view.personOk ? NAME_FIRST : prefilled === 0 ? 'No pre-filled value in this group is waiting for confirmation.' : '';
  $('groupBar').innerHTML = `<p class="small-note">${h(groupName(view.group))}: ${openIn(rows)} open, ${prefilled} pre-filled ${prefilled === 1 ? 'value' : 'values'} waiting for confirmation.</p><button type="button" class="button primary" data-action="confirm-group" data-group="${view.group}" data-key="group|${view.group}|confirm"${reason ? ` disabled title="${h(reason)}"` : ''}>Confirm all pre-filled values in this group (${prefilled})</button>`;
  box.setAttribute('aria-labelledby', `tab-${view.group}`);
  box.innerHTML = rows.map(rowCard).join('');
}

function rowCard(row) {
  const owners = row.owners.length ? row.owners.map((o) => `${o} (${OWNER_TEXT[o] || o})`).join(', ') : 'set per project';
  const meta = [`Owners: ${owners}`, `default kind: ${KIND_TEXT[row.kind]}`, row.repeat ? `one entry per ${row.repeat}` : '', row.factOnly ? 'a fact only a person gives, never proposed' : '', row.proposable ? 'the architect may propose a target' : ''].filter(Boolean).join('; ');
  return `<article class="row-card" id="row-${row.rowId}" aria-labelledby="h-${row.rowId}"><div class="row-head"><div><h3 id="h-${row.rowId}"><span class="mono">${h(row.rowId)}</span> ${h(row.title)}</h3><div class="row-meta">${h(meta)}.</div></div><span class="chip">${h(row.groupName)}</span></div>${derivedLine(row.rowId)}${row.entries.map((e) => entryHtml(row, e)).join('')}${row.repeat ? addHtml(row) : ''}</article>`;
}
function derivedLine(rowId) {
  const ids = ROW_CALCS[rowId];
  if (!ids || !model) return '';
  const cells = ids.map((id) => model.c.rows.find((r) => r.id === id)).filter(Boolean).map((r) => `<span>${h(r.label)} (${h(r.id)}): <strong>${h(calcText(r))}</strong></span>`);
  return cells.length ? `<div class="derived" role="group" aria-label="Derived values for ${rowId}">${cells.join('')}</div>` : '';
}
function entryHtml(row, e) {
  const dis = disabledAttr();
  const heading = `${e.id}${e.label ? `: ${e.label}` : ''}${e.scope ? `, scope ${choiceText(e.scope)}` : ''}`;
  const main = [valueField(row, e, dis), row.repeat ? textField(row, e, 'label', dis) : '', SCOPED_ROWS.includes(row.rowId) ? choiceField(row, e, 'scope', SCOPES, dis) : ''].join('');
  const assign = e.status === 'Open' ? `<div class="entry-grid">${textField(row, e, 'owner_name', dis)}${textField(row, e, 'due', dis)}</div>` : '';
  return `<div class="entry" data-entry="${h(e.id)}" role="group" aria-labelledby="e-${keyId(e.id)}"><div class="entry-head"><strong id="e-${keyId(e.id)}" tabindex="-1" data-key="${h(e.id)}|head">${h(heading)}</strong><span class="${STATUS_CHIP[e.status] || 'chip'}">${h(e.status)}</span>${e.needsAnswer ? '<span class="kv">Needs an answer</span>' : ''}<span class="kv">Kind: ${h(KIND_TEXT[e.kind] || e.kind)}${e.priority ? `, priority ${h(e.priority)}` : ''}</span></div><div class="entry-grid">${main}</div>${clearedNote(e.id)}${sourceLine(e)}${e.proposal ? proposalHtml(row, e, dis) : ''}${confirmTick(e.id, null, e, dis)}${assign}${actionsHtml(row, e, dis)}${recordHtml(row, e, dis)}${e.factors.length ? factorsHtml(row, e, dis) : ''}</div>`;
}
function fieldAttrs(key, row, e, field, dis, extra = '') { return `id="${fid(key)}" data-key="${h(key)}" data-entry="${h(e.id)}" data-row="${h(row.rowId)}" data-field="${field}"${extra} aria-describedby="${mid(key)}"${invalid(key)}${dis}`; }
function options(values, current, blankText, label = choiceText) {
  const list = current === null || current === undefined || values.includes(current) ? values : [current, ...values];
  return `${current === null || current === undefined ? `<option value="" selected>${h(blankText)}</option>` : ''}${list.map((v) => `<option value="${h(v)}"${v === current ? ' selected' : ''}>${h(label(v))}</option>`).join('')}`;
}
function valueField(row, e, dis) {
  const key = `${e.id}|value`, label = VALUE_LABELS[row.rowId] || (row.valueType === 'number' ? `Value in ${unitWord(row.unit)}` : 'Answer'), attrs = fieldAttrs(key, row, e, 'value', dis);
  if (row.valueType === 'enum') return `<div class="field"><label for="${fid(key)}">${h(label)}</label><select ${attrs}>${options(row.enumValues, e.value, 'Not answered yet (TBD)')}</select>${msgHtml(key)}</div>`;
  if (row.valueType === 'number') return `<div class="field"><label for="${fid(key)}">${h(label)}</label><input ${attrs} type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${h(draft(key, e.value))}" placeholder="TBD (unknown)">${msgHtml(key)}</div>`;
  return `<div class="field wide"><label for="${fid(key)}">${h(label)}</label><textarea ${attrs} rows="2" placeholder="TBD (not answered)">${h(draft(key, e.value))}</textarea>${msgHtml(key)}</div>`;
}
function textField(row, e, field, dis) {
  const key = `${e.id}|${field}`;
  return `<div class="field"><label for="${fid(key)}">${h(FIELD_TEXT[field])}</label><input ${fieldAttrs(key, row, e, field, dis)} type="text" autocomplete="off" value="${h(draft(key, e[field]))}" placeholder="${h(FIELD_HINTS[field] || '')}">${msgHtml(key)}</div>`;
}
function choiceField(row, e, field, values, dis) {
  const key = `${e.id}|${field}`;
  return `<div class="field"><label for="${fid(key)}">${h(FIELD_TEXT[field])}</label><select ${fieldAttrs(key, row, e, field, dis)}>${options(values, e[field], 'Not set', field === 'priority' ? String : choiceText)}</select>${msgHtml(key)}</div>`;
}
function sourceLine(e) {
  const parts = [e.sourceText ? `Source: ${e.sourceText}` : 'Source: none yet'];
  if (e.value === null && e.status !== 'N/A') parts.push('Value: TBD');
  if (e.status === 'Confirmed') parts.push(`Confirmed by ${e.confirmed_by || 'unknown'} on ${utcText(e.confirmed_at)}`);
  if (e.status === 'N/A') parts.push(`Not applicable: ${e.na_reason || 'no reason recorded'}`);
  if (e.status === 'Open' && (e.owner_name || e.due)) parts.push(`Owner ${e.owner_name || 'not named'}, due ${e.due || 'not set'}`);
  return `<div class="source">${h(parts.join('. '))}.</div>`;
}
function clearedNote(id) {
  const r = lastValue.get(id);
  if (!r || !r.actor || r.actor.type !== 'agent' || r.actor.name !== ENGINE_NAME || !['set', 'set-factor'].includes(r.op) || r.to.value !== null || !r.from || r.from.value === null || r.from.value === undefined) return '';
  return `<div class="warn-message" role="note">The engine (${h(ENGINE_NAME)}, op ${h(r.op)}) cleared the value ${h(String(r.from.value))} on ${h(utcText(r.at))}${r.reason ? ` (${h(r.reason)})` : ''}. It had derived or defaulted this value, and an input it depends on changed or is missing. It stays TBD until the input returns, or until you enter the value yourself.</div>`;
}
function proposalHtml(row, e, dis) {
  const p = e.proposal;
  return `<div class="proposal" role="group" aria-label="Proposal for ${h(e.id)}"><strong>Proposed value: ${h(valueText(row, p.value))}</strong>, by ${h(p.by || 'the architect')} on ${h(utcText(p.at))}. Reason: ${h(p.reason)}<div class="entry-actions"><button type="button" class="button xs" data-action="accept" data-entry="${h(e.id)}" data-key="${h(e.id)}|accept"${dis}>Accept proposal</button><span class="kv">Accepting confirms the value under your name. To answer differently, type your own value instead.</span></div></div>`;
}
function confirmTick(entryId, factor, holder, dis) {
  if (holder.status !== 'Estimated') return '';
  const key = `${entryId}|${factor ? `confirm:${factor}` : 'confirm'}`;
  return `<label class="check-inline"><input type="checkbox" data-action="confirm" data-entry="${h(entryId)}"${factor ? ` data-factor="${h(factor)}"` : ''} data-key="${h(key)}"${dis}> Confirm ${factor ? 'this factor' : 'this value'} (records your name and the UTC time)</label>`;
}
function clearStep(target, what, by, dis) {
  return `<div class="warn-message" role="group" aria-label="Clear ${h(what)}">Clear the confirmed value of ${h(what)}? This removes the value and the confirmation by ${h(by || 'its confirmer')}; the item goes back to Open and shows TBD. The history keeps the record.<div class="entry-actions"><button type="button" class="button xs" data-action="clear-confirm" data-target="${h(target)}" data-key="${h(target)}|clearConfirm"${dis}>Clear ${h(what)}</button><button type="button" class="button xs primary" data-action="clear-cancel" data-target="${h(target)}" data-key="${h(target)}|clearCancel">Keep ${h(what)}</button></div></div>`;
}
function actionsHtml(row, e, dis) {
  if (view.removing === e.id) return `<div class="warn-message" role="group" aria-label="Remove ${h(e.id)}">Remove ${h(e.id)}? This deletes the entry and everything recorded on it.<div class="entry-actions"><button type="button" class="button xs" data-action="remove-confirm" data-entry="${h(e.id)}" data-key="${h(e.id)}|removeConfirm"${dis}>Remove ${h(e.id)}</button><button type="button" class="button xs primary" data-action="remove-cancel" data-entry="${h(e.id)}" data-key="${h(e.id)}|removeCancel">Keep ${h(e.id)}</button></div></div>`;
  if (view.clearing === `${e.id}|value`) return clearStep(`${e.id}|value`, e.id, e.confirmed_by, dis);
  const out = [];
  if (e.value !== null && e.status !== 'N/A') out.push(`<button type="button" class="button xs" data-action="clear" data-entry="${h(e.id)}" data-confirmed="${e.status === 'Confirmed'}" data-key="${h(e.id)}|clear"${dis}>Clear value (leave it open)</button>`);
  if (e.status === 'N/A') out.push(`<button type="button" class="button xs" data-action="reopen" data-entry="${h(e.id)}" data-key="${h(e.id)}|reopen"${dis}>Reopen (no longer N/A)</button>`);
  if (row.repeat && !e.primary) out.push(`<button type="button" class="button xs" data-action="remove" data-entry="${h(e.id)}" data-key="${h(e.id)}|remove"${dis}>Remove entry</button>`);
  return out.length ? `<div class="entry-actions">${out.join('')}</div>` : '';
}
function reasonForm(e, field, title, label, hint, action, button, dis, extra = '') {
  const key = `${e.id}|${field}`, titleId = fid(`${e.id}|${field}Title`);
  return `<div class="sub-form" role="group" aria-labelledby="${titleId}"><p class="kv" id="${titleId}">${h(title)}</p><div class="entry-grid">${extra}<div class="field"><label for="${fid(key)}">${h(label)}</label><input id="${fid(key)}" type="text" data-key="${h(key)}" aria-describedby="${mid(key)}" placeholder="${h(hint)}" autocomplete="off"${invalid(key)}${dis}>${msgHtml(key)}</div></div><div class="entry-actions"><button type="button" class="button xs" data-action="${action}" data-entry="${h(e.id)}" data-key="${h(e.id)}|${action}"${dis}>${h(button)}</button></div></div>`;
}
function recordHtml(row, e, dis) {
  const key = `${e.id}|record`, open = view.open.has(key) ? ' open' : '';
  const fields = [textField(row, e, 'window', dis), textField(row, e, 'measured_at', dis), choiceField(row, e, 'priority', PRIORITIES, dis), textField(row, e, 'verification', dis), textField(row, e, 'owner', dis), e.status === 'Open' ? '' : textField(row, e, 'owner_name', dis) + textField(row, e, 'due', dis), textField(row, e, 'evidence', dis)].join('');
  const kindKey = `${e.id}|kindChoice`;
  const kindSelect = `<div class="field"><label for="${fid(kindKey)}">Kind to record</label><select id="${fid(kindKey)}" data-key="${h(kindKey)}"${dis}>${KINDS.map((k) => `<option value="${k}"${k === e.kind ? ' selected' : ''}>${h(KIND_TEXT[k])}</option>`).join('')}</select></div>`;
  const kind = reasonForm(e, 'kindReason', `Kind: ${KIND_TEXT[e.kind] || e.kind}. Setting or affirming a kind needs a reason.`, 'Reason for the kind', 'For example: the contract sets a penalty', 'kind', 'Set kind', dis, kindSelect);
  const na = e.status === 'N/A' ? '' : reasonForm(e, 'naReason', 'Mark this entry N/A when the item does not apply to this project.', 'Why it does not apply', 'For example: no batch processing is in scope', 'na', 'Mark N/A', dis);
  return `<details class="fold" data-fold="${h(key)}"${open}><summary data-key="${h(key)}">Record fields: window, priority, kind, verification, owner, evidence, N/A</summary><div>${row.unit ? `<p class="kv">Unit: ${h(unitWord(row.unit))}, fixed for this item.</p>` : ''}<div class="entry-grid">${fields}</div>${kind}${na}</div></details>`;
}
function factorsHtml(row, e, dis) {
  const key = `${e.id}|factors`, open = view.open.has(key) ? ' open' : '', openCount = e.factors.filter((f) => f.needsAnswer).length;
  return `<details class="fold" data-fold="${h(key)}"${open}><summary data-key="${h(key)}">Sizing factors (${e.factors.length}): ${h(e.factors.map((f) => f.label).join(', '))}${openCount ? `; ${openCount} open` : ''}</summary><div>${e.factors.map((f) => factorHtml(row, e, f, dis)).join('')}</div></details>`;
}
function factorHtml(row, e, f, dis) {
  const key = `${e.id}|factor:${f.name}`, label = `${f.label}${f.unit ? ` in ${unitWord(f.unit)}` : ''}`, attrs = fieldAttrs(key, row, e, 'factor', dis, ` data-factor="${h(f.name)}"`), nameId = `fn-${keyId(key)}`;
  const input = f.valueType === 'choice' ? `<select ${attrs}>${options(f.choices, f.value, 'Not answered yet (TBD)')}</select>` : `<input ${attrs} type="text"${f.valueType === 'number' ? ' inputmode="decimal" spellcheck="false"' : ''} autocomplete="off" value="${h(draft(key, f.value))}" placeholder="TBD (unknown)">`;
  const src = [f.sourceText ? `Source: ${f.sourceText}` : 'Source: none yet', f.status === 'Confirmed' ? `Confirmed by ${f.confirmed_by || 'unknown'} on ${utcText(f.confirmed_at)}` : '', f.appendix ? 'A policy appendix factor' : ''].filter(Boolean).join('. ');
  const what = `the ${f.name} factor of ${e.id}`;
  const clear = view.clearing === key ? clearStep(key, what, f.confirmed_by, dis) : f.value !== null ? `<div class="entry-actions"><button type="button" class="button xs" data-action="clear-factor" data-entry="${h(e.id)}" data-factor="${h(f.name)}" data-confirmed="${f.status === 'Confirmed'}" data-key="${h(key)}|clear"${dis}>Clear factor (leave it open)</button></div>` : '';
  return `<div class="factor" role="group" aria-labelledby="e-${keyId(e.id)} ${nameId}"><div class="entry-head"><span class="${STATUS_CHIP[f.status] || 'chip'}">${h(f.status)}</span><span class="kv" id="${nameId}">${h(f.label)} (${h(f.name)})</span></div><div class="entry-grid"><div class="field"><label for="${fid(key)}">${h(label)}</label>${input}${msgHtml(key)}</div></div><div class="source">${h(src)}.</div>${confirmTick(e.id, f.name, f, dis)}${clear}</div>`;
}
function addHtml(row) {
  const dis = disabledAttr(), lk = `${row.rowId}|addLabel`, sk = `${row.rowId}|addScope`, titleId = fid(`${row.rowId}|addTitle`);
  const scope = SCOPED_ROWS.includes(row.rowId) ? `<div class="field"><label for="${fid(sk)}">Failure scope of the new entry</label><select id="${fid(sk)}" data-key="${h(sk)}"${dis}><option value="">Not set</option>${SCOPES.map((s) => `<option value="${s}">${h(choiceText(s))}</option>`).join('')}</select></div>` : '';
  return `<div class="sub-form" role="group" aria-labelledby="${titleId}"><p class="kv" id="${titleId}">Add another entry to ${h(row.rowId)}: one entry per ${h(row.repeat)}. The label and the scope can wait.</p><div class="entry-grid"><div class="field"><label for="${fid(lk)}">Label of the new entry</label><input id="${fid(lk)}" type="text" data-key="${h(lk)}" placeholder="For example: Refund payout journey" autocomplete="off"${dis}></div>${scope}</div><div class="entry-actions"><button type="button" class="button xs" data-action="add" data-row="${h(row.rowId)}" data-key="${h(row.rowId)}|add"${dis}>Add entry</button></div></div>`;
}

function table(caption, head, rows, empty) {
  if (!rows.length) return `<p class="small-note">${h(empty)}</p>`;
  return `<div class="tablewrap"><table><caption>${h(caption)}</caption><thead><tr>${head.map((x) => `<th scope="col">${h(x)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.join('')}</tr>`).join('')}</tbody></table></div>`;
}
const td = (x) => `<td>${x}</td>`;
const tdText = (x) => td(esc(x));
function foldList(key, items, label) {
  if (!items.length) return '<span class="kv">Nothing missing.</span>';
  const list = `<ul class="tight-list">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (items.length <= 3) return list;
  return `<details class="fold" data-fold="${h(key)}"${view.open.has(key) ? ' open' : ''}><summary data-key="${h(key)}">${h(label)} (${items.length})</summary><div>${list}</div></details>`;
}
function section(id, eyebrow, title, intro, body, chip = '') {
  return `<section class="section" aria-labelledby="${id}"><div class="section-top"><div><div class="eyebrow dark">${h(eyebrow)}</div><h3 class="section-title" id="${id}">${h(title)}</h3>${intro ? `<p class="subtext">${h(intro)}</p>` : ''}</div>${chip}</div>${body}</section>`;
}

function renderStage3() {
  const box = $('stage3Body');
  if (view.stage !== 3) { box.innerHTML = ''; shown = null; return; }
  if (!model) { $('stage3Count').textContent = 'Not computed'; box.innerHTML = '<div class="error-message">The engine could not compute this project, so the assessment cannot be shown. Read the alert above, correct the value it names, and the assessment comes back.</div>'; return; }
  $('stage3Count').textContent = `${model.options.list.length} ${model.options.list.length === 1 ? 'option' : 'options'}, ${model.validation.conflicts.length} ${model.validation.conflicts.length === 1 ? 'conflict' : 'conflicts'}`;
  const dis = disabledAttr();
  box.innerHTML = [metricsHtml(), calcHtml(), scopesHtml(), shapeHtml(), diagramsHtml(), optionsHtml(dis), weightsHtml(dis), overlayHtml()].join('');
}
function metricsHtml() {
  const a = model.a, tier = recoveryTier(model.scopes), example = project.run.light ? 'not given in a light run' : closestExample(a.path, tier) || 'none yet';
  const applies = project.register.overlay.applies === true;
  const cards = METRICS.map(([id, label, key, sub]) => `<div class="metric"><div class="lbl">${h(label)}</div><div class="num" id="${id}">${h(num(model.c[key]))}</div><div class="sm">${h(sub)}</div></div>`).join('');
  const facts = [`Path code: ${a.path}`, `Recovery tier: ${tier || 'none yet'}`, `Closest worked example: ${example}`, `Migration overlay: ${applies ? 'applies' : 'does not apply'}`];
  return section('s3Metrics', 'WORKLOAD', 'Metrics and classification', '', `<p class="subtext" id="classSummary">${esc(facts.join('. '))}.</p><div class="metricgrid">${cards}</div>`);
}
function calcHtml() {
  const rows = model.c.rows.filter((r) => !r.option).map((r) => [td(`<strong>${esc(r.label)}</strong><br><span class="mono kv">${h(r.id)}</span>`), td(`<code>${esc(r.formula)}</code>`), td(`<code>${esc(r.substitution)}</code>`), td(`<strong>${esc(calcText(r))}</strong>`), td(known(r.result) ? '<span class="chip">Estimated</span>' : '<span class="chip amber">Open (TBD)</span>'), tdText(r.note)]);
  const body = table('Every calculation with the current inputs', ['Calculation', 'Formula', 'Inputs used', 'Result', 'Status', 'How to read it'], rows, 'No calculation is defined.').replace('<tbody>', '<tbody id="formulaRows">');
  return section('s3Calcs', 'CALCULATIONS', 'Calculation table', 'Each result comes from the formula and the register values shown. An unknown input gives TBD, never zero.', body);
}
function scopesHtml() {
  const strategy = (k) => `${drNames[k] || k} (${k})`;
  const rows = model.scopes.map((s) => [tdText(s.entry), tdText(s.scope ? choiceText(s.scope) : 'Not named yet (TBD)'), tdText(known(s.rto) ? `${time(s.rto)} (${s.rtoEntry})` : 'TBD'), tdText(known(s.rpo) ? `${time(s.rpo)} (${s.rpoEntry})` : 'TBD'), tdText(strategy(s.strategy)), tdText(topoNames[s.topoCandidate] || s.topoCandidate), tdText(model.shape.replication[s.scope ?? 'unknown'] || 'TBD')]);
  const dup = model.scopes.flatMap((s) => s.blockers);
  const body = `${table('DR strategy per failure scope', ['Failure scope entry', 'Scope', 'RTO', 'RPO', 'DR strategy', 'Topology candidate', 'Replication'], rows, 'No failure scope is recorded yet. Name it in REL-05 in stage 1.')}${dup.length ? `<ul class="stack plain-list">${dup.map((x) => findingHtml(x, 'danger')).join('')}</ul>` : ''}`;
  return section('s3Scopes', 'FAILURE SCOPES', 'Scopes, strategies and replication', 'The engine picks one DR strategy per failure scope from its RTO and RPO. Replication is synchronous only when RPO is 0.', body);
}
function shapeHtml() {
  const sh = model.shape, v = model.v, source = sh.topologySource === 'override' ? 'a person\'s override in stage 4' : sh.topologySource ? `the failure scope ${sh.topologySource}` : 'no failure scope yet';
  const items = [['Hosting', v.target && v.target !== 'unknown' ? choiceText(v.target) : 'TBD'], ['Topology', `${topoNames[sh.topology] || sh.topology}, from ${source}`], ...Object.entries(sh.strategies).map(([k, x]) => [`DR strategy, scope ${k === 'unknown' ? 'not named' : choiceText(k)}`, `${drNames[x] || x}; replication ${sh.replication[k] || 'TBD'}`]), ['Data', `${model.a.db}. Consistency ${v.dataConsistency && v.dataConsistency !== 'unknown' ? choiceText(v.dataConsistency) : 'TBD'}`], ['Network', v.connectivity && v.connectivity !== 'unknown' ? choiceText(v.connectivity) : 'TBD']];
  const dl = `<dl class="kv-grid">${items.map(([k, x]) => `<div><dt>${esc(k)}</dt><dd>${esc(x)}</dd></div>`).join('')}</dl>`;
  const conflicts = sh.conflicts.length ? `<h4 class="sub-title">Conflicts (${sh.conflicts.length})</h4><ul class="stack plain-list">${sh.conflicts.map((x) => findingHtml(x, 'warn')).join('')}</ul>` : '<p class="small-note">No conflict: the target shape satisfies every failure scope it knows.</p>';
  const rules = model.rules.length ? `<details class="fold" data-fold="s3|rules"${view.open.has('s3|rules') ? ' open' : ''}><summary data-key="s3|rules">Rule trace (${model.rules.length} rules)</summary><div><ul class="stack plain-list">${model.rules.map((r) => `<li class="rule-card${r.level === 'caution' ? ' warn' : ''}"><div class="rule-head"><strong>${esc(r.title)}</strong><span class="rule-id">${h(r.id)}</span></div><div class="why">Trigger: ${esc(r.trigger)}</div><div class="decision">${esc(r.assessment)}</div><div class="why">Evidence required: ${esc(r.verify)}</div></li>`).join('')}</ul></div></details>` : '';
  return section('s3Shape', 'TARGET SHAPE', 'Target shape and conflicts', 'Hosting, topology, DR, data and network at shape level. Products are left to the SDD.', `${dl}${conflicts}${rules}`);
}
function diagramsHtml() {
  const ctx = { ...toCalcInputs(project).ctx, provider: view.provider, showOptional: view.showOptional };
  const enabled = optionalDiagramIDs(model.v, ctx);
  if (!enabled.includes(view.diagram)) view.diagram = enabled[0] || 'infrastructure';
  const graph = buildDiagrams(model.v, model.c, model.a, view.provider, ctx), d = graph.diagrams[view.diagram];
  shown = { graph, ctx, diagram: d };
  const providerName = (p) => (p === 'logical' ? 'Logical' : `${providerCatalog[p] ? providerCatalog[p].label : p} (illustration only)`);
  const providers = `<div class="tabs" role="group" aria-label="Provider view">${PROVIDERS.map((p) => `<button type="button" data-action="provider" data-provider="${p}" data-key="provider|${p}" aria-pressed="${view.provider === p}"${view.provider === p ? ' class="selected"' : ''}>${h(providerName(p))}</button>`).join('')}</div>`;
  const diagrams = `<div class="tabs" role="group" aria-label="Diagram">${enabled.map((x) => `<button type="button" data-action="diagram" data-diagram="${x}" data-key="diagram|${x}" aria-pressed="${view.diagram === x}"${view.diagram === x ? ' class="selected"' : ''}>${h(DIAGRAM_TEXT[x] || x)}</button>`).join('')}</div>`;
  const alert = view.provider === 'logical' ? '<p class="small-note">The logical view is the shape of record. The provider views are illustration only: they show example services to check, never a validated or priced choice.</p>' : `<div class="provider-alert">Illustration only: ${h(providerName(view.provider).replace(' (illustration only)', ''))} services are examples to check against the official documentation, regions, prices and quotas. The shape of record stays the logical view.</div>`;
  const services = view.provider === 'logical' ? '' : `<div class="service-list">${catalogFor(view.provider, model.v, model.a, ctx).rows.map((r) => `<div class="service"><div class="cat">${esc(r.category)} · ${esc(r.id)}</div><h4>${esc(r.candidate)}</h4><div class="alt"><strong>Alternative:</strong> ${esc(r.alternative)}</div><div class="trade"><strong>Trade-off:</strong> ${esc(r.trade)}</div></div>`).join('')}</div>`;
  const controls = `<div class="diagram-controls"><p class="subtext" id="diagramHint">${esc(`${d.title}: ${d.nodes.length} components and ${d.edges.length} connections, all proposed`)}</p><label class="check-inline"><input type="checkbox" data-action="show-optional" data-key="diagram|optional"${view.showOptional ? ' checked' : ''}> Show conditional diagrams</label></div>`;
  const downloads = `<div class="button-row"><button type="button" class="button xs" data-action="dl-mermaid" data-key="dl|mermaid">Download Mermaid</button><button type="button" class="button xs" data-action="dl-drawio" data-key="dl|drawio">Download draw.io</button><button type="button" class="button xs" data-action="dl-svg" data-key="dl|svg">Download SVG</button></div>`;
  const body = `${providers}${alert}${diagrams}${controls}<div id="diagramCanvas" class="diagram-canvas" role="img" aria-label="${h(`${d.title} diagram`)}">${plain(diagramSVG(d))}</div><div class="diagram-details"><div class="detail"><strong>Diagram purpose</strong><br>${esc(d.summary)}</div><div class="detail"><strong>Instructions carried into the Pre-SDD and the SDD</strong><ol>${d.instructions.map((i) => `<li>${esc(i)}</li>`).join('')}</ol></div></div><details class="code-details fold" data-fold="s3|mermaid"${view.open.has('s3|mermaid') ? ' open' : ''}><summary data-key="s3|mermaid">View the Mermaid source</summary><pre>${esc(mermaid(d))}</pre></details>${services}`;
  return section('s3Diagrams', 'DIAGRAMS', 'Diagrams', 'The provider view opens on Logical. Provider names are illustration only.', body, downloads);
}
function optionChip(item) { return OPTION_STATUS[optionStatus(project, item)]; }
function hardEntries() { return [...registerView(project, { stage: 2, group: 'HDR' }), ...registerView(project, { stage: 2 })].flatMap((row) => row.entries.filter((e) => e.kind === 'hard').map((e) => ({ id: e.id, title: row.title }))); }
function optionsHtml(dis) {
  const o = model.options, flags = o.flags.map((f) => (f === 'UNWEIGHTED' ? 'UNWEIGHTED: no weights are approved, so the comparison is unweighted' : f === 'ESTIMATED-SCORES' ? 'ESTIMATED-SCORES: a weighted score uses scores a person has not confirmed yet' : f));
  const hk = 'opt|horizon', eco = primaryEntry(project, 'ECO-03');
  const horizon = `<div class="entry-grid narrow-grid"><div class="field"><label for="${fid(hk)}">TCO horizon in months</label><input id="${fid(hk)}" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" data-key="${h(hk)}" data-field="horizon" aria-describedby="${mid(hk)} ${fid(hk)}-meta" value="${h(draft(hk, project.options.horizon_months))}" placeholder="TBD (unknown)"${invalid(hk)}${dis}><div class="kv" id="${fid(hk)}-meta">${esc(`From ECO-03, which reads: ${eco && eco.value !== null && eco.value !== undefined ? eco.value : 'TBD'}. A whole number of months, for example 36.`)}</div>${msgHtml(hk)}</div></div>`;
  const cards = o.list.length ? o.list.map((item) => optionCard(item, dis)).join('') : '<p class="small-note">No option is recorded yet. The architect proposes shape-level options in chat, or add one below. G2 needs at least one option that passes every hard check.</p>';
  const flagLine = `<p class="${o.flags.includes('UNWEIGHTED') ? 'warn-message' : 'small-note'}">Flags: ${esc(flags.join('; ') || 'none')}.</p>`;
  return section('s3Options', 'OPTIONS AND ECONOMICS', 'Options, costs and TCO', 'Options are shape level only and never name products. Costs come from a person; the TCO is the one-time cost plus the horizon times the monthly cost, undiscounted.', `${flagLine}${horizon}<div class="stack">${cards}</div>${addOptionHtml(dis)}`);
}
function optionCard(item, dis) {
  const o = storedOption(item.id) || { scores: {}, shape: {} }, [statusText, statusClass] = optionChip(item), titleId = `opt-${keyId(item.id)}`;
  const shape = Object.keys(SHAPE_TEXT).map((k) => `${SHAPE_TEXT[k]} ${o.shape && o.shape[k] ? (k === 'topology' ? topoNames[o.shape[k]] || o.shape[k] : k === 'dr' ? drNames[o.shape[k]] || o.shape[k] : choiceText(o.shape[k])) : 'TBD'}`).join('; ');
  const checks = item.hardPass === true ? 'Every hard check passes.' : item.hardPass === false ? `Fails: ${item.failures.map((f) => f.message).join('; ')}` : `Cannot run yet: ${item.unknowns.filter((u) => /check/.test(u)).join('; ') || 'a hard check needs more input'}`;
  const tco = model.c.rows.find((r) => r.id === `CALC-21@${item.id}`), score = model.c.rows.find((r) => r.id === `CALC-22@${item.id}`);
  const kv = `<dl class="kv-grid"><div><dt>Shape</dt><dd>${esc(shape)}</dd></div><div><dt>Hard constraints</dt><dd>${esc(checks)}</dd></div><div><dt>TCO (CALC-21)</dt><dd><strong>${esc(money(item.tco))}</strong>${tco ? `<br><span class="kv">${esc(tco.substitution)}</span>` : ''}</dd></div><div><dt>Weighted score (CALC-22)</dt><dd><strong>${esc(!model.options.weighted ? 'Unweighted' : known(item.weighted) ? `${fmt(item.weighted, 3)} of 5` : 'TBD')}</strong>${score && model.options.weighted ? `<br><span class="kv">${esc(score.substitution)}</span>` : ''}</dd></div></dl>`;
  const unknowns = item.unknowns.length ? `<p class="kv">Still unknown: ${esc(item.unknowns.join('; '))}.</p>` : '';
  const costs = `<div class="entry-grid">${costField(o, item, 'one_time', dis)}${costField(o, item, 'monthly', dis)}</div>`;
  return `<article class="opt-card" aria-labelledby="${titleId}"><div class="opt-head"><h4 id="${titleId}"><span class="mono">${h(item.id)}</span> ${esc(item.name)}</h4><span class="${statusClass}">${h(statusText)}</span></div>${kv}${unknowns}${costs}${scoresHtml(o, item, dis)}${excludeHtml(o, item, dis)}</article>`;
}
function costField(o, item, cost, dis) {
  const key = `opt|${item.id}|${cost}`, held = o[cost] || null;
  const meta = held ? (held.status === 'Confirmed' ? `confirmed by ${held.by || 'unknown'} on ${utcText(held.at)}` : `entered by ${held.by || 'unknown'} on ${utcText(held.at)}`) : 'TBD until a person enters it';
  const tick = held && held.status === 'Estimated' ? `<label class="check-inline"><input type="checkbox" data-action="confirm" data-option="${h(item.id)}" data-cost="${cost}" data-key="${h(key)}|confirm"${dis}> Confirm this cost<span class="sr-only"> (${h(COST_TEXT[cost])} of ${h(item.id)})</span></label>` : '';
  return `<div class="field"><label for="${fid(key)}">${h(COST_TEXT[cost])} of ${h(item.id)}, in currency units</label><input id="${fid(key)}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-key="${h(key)}" data-field="cost" data-option="${h(item.id)}" data-cost="${cost}" aria-describedby="${mid(key)} ${fid(key)}-meta" value="${h(draft(key, held ? held.value : null))}" placeholder="TBD (unknown)"${invalid(key)}${dis}><div class="kv" id="${fid(key)}-meta"><span class="${held ? STATUS_CHIP[held.status] : 'chip amber'}">${h(held ? held.status : 'Open')}</span> ${h(meta)}.</div>${msgHtml(key)}${tick}</div>`;
}
function scoresHtml(o, item, dis) {
  const key = `opt|${item.id}|scores`, scores = o.scores || {}, waiting = CRITERIA.filter((c) => scores[c] && scores[c].status === 'Estimated').length;
  const rows = CRITERIA.map((c) => {
    const s = scores[c];
    const tick = s && s.status === 'Estimated' ? `<label class="check-inline"><input type="checkbox" data-action="confirm" data-option="${h(item.id)}" data-criterion="${c}" data-key="${h(`opt|${item.id}|score|${c}`)}|confirm"${dis}> Confirm<span class="sr-only"> the ${h(CRITERION_TEXT[c])} score of ${h(item.id)}</span></label>` : '';
    return [`<th scope="row">${h(CRITERION_TEXT[c])}</th>`, tdText(s ? `${s.value} of 5` : 'TBD'), td(s ? `<span class="${STATUS_CHIP[s.status] || 'chip'}">${h(s.status)}</span>` : '<span class="chip amber">Open</span>'), td(s ? `${esc(s.reason || '')}<br><span class="kv">${esc(`${s.status === 'Confirmed' ? 'Confirmed by' : 'By'} ${s.by || 'unknown'} on ${utcText(s.at)}`)}</span>` : '<span class="kv">No score yet</span>'), td(tick)];
  });
  const ck = `sc|${item.id}|criterion`, vk = `sc|${item.id}|value`, rk = `sc|${item.id}|reason`, titleId = fid(`sc|${item.id}|title`);
  const form = `<div class="sub-form" role="group" aria-labelledby="${titleId}"><p class="kv" id="${titleId}">Set a score for ${h(item.id)}: a whole number from 1 to 5 with a one-line reason. A score you set is Estimated until someone confirms it.</p><div class="entry-grid"><div class="field"><label for="${fid(ck)}">Criterion</label><select id="${fid(ck)}" data-key="${h(ck)}" data-draft="1"${dis}>${CRITERIA.map((c) => `<option value="${c}"${draft(ck, CRITERIA[0]) === c ? ' selected' : ''}>${h(CRITERION_TEXT[c])}</option>`).join('')}</select></div><div class="field"><label for="${fid(vk)}">Score from 1 to 5</label><select id="${fid(vk)}" data-key="${h(vk)}" data-draft="1"${dis}>${[1, 2, 3, 4, 5].map((n) => `<option value="${n}"${draft(vk, '3') === String(n) ? ' selected' : ''}>${n}</option>`).join('')}</select></div><div class="field"><label for="${fid(rk)}">Reason for the score</label><input id="${fid(rk)}" type="text" autocomplete="off" data-key="${h(rk)}" data-draft="1" aria-describedby="${mid(rk)}" value="${h(draft(rk, ''))}" placeholder="For example: fits the zone failure scope"${invalid(rk)}${dis}>${msgHtml(rk)}</div></div><div class="entry-actions"><button type="button" class="button xs" data-action="set-score" data-option="${h(item.id)}" data-key="${h(`sc|${item.id}|save`)}"${dis}>Record the score</button></div></div>`;
  return `<details class="fold" data-fold="${h(key)}"${view.open.has(key) ? ' open' : ''}><summary data-key="${h(key)}">Scores for ${h(item.id)} (${CRITERIA.filter((c) => scores[c]).length} of ${CRITERIA.length} scored, ${waiting} waiting for confirmation)</summary><div>${table(`Scores for ${item.id}`, ['Criterion', 'Score', 'Status', 'Reason', 'Confirm'], rows, '')}${form}</div></details>`;
}
function excludeHtml(o, item, dis) {
  if (o.excluded) return `<div class="warn-message" role="group" aria-label="${h(`${item.id} is excluded`)}">${esc(`${item.id} is excluded because it breaks ${o.excluded.entry}: ${o.excluded.reason}`)}<div class="entry-actions"><button type="button" class="button xs" data-action="include-option" data-option="${h(item.id)}" data-key="${h(`x|${item.id}|include`)}"${dis}>Include ${h(item.id)} again</button></div></div>`;
  const ek = `x|${item.id}|entry`, rk = `x|${item.id}|reason`, titleId = fid(`x|${item.id}|title`), hard = hardEntries();
  return `<details class="fold" data-fold="${h(`x|${item.id}`)}"${view.open.has(`x|${item.id}`) ? ' open' : ''}><summary data-key="${h(`x|${item.id}`)}">Exclude ${h(item.id)} because it breaks a hard entry</summary><div class="sub-form" role="group" aria-labelledby="${titleId}"><p class="kv" id="${titleId}">An excluded option fails its hard checks, so G2 does not shortlist it. Include it again at any time.</p><div class="entry-grid"><div class="field"><label for="${fid(ek)}">The hard entry it breaks</label><select id="${fid(ek)}" data-key="${h(ek)}" data-draft="1"${dis}>${hard.map((x) => `<option value="${h(x.id)}"${draft(ek, hard.length ? hard[0].id : '') === x.id ? ' selected' : ''}>${h(`${x.id} ${x.title}`)}</option>`).join('')}</select></div><div class="field"><label for="${fid(rk)}">How the option breaks it</label><input id="${fid(rk)}" type="text" autocomplete="off" data-key="${h(rk)}" data-draft="1" aria-describedby="${mid(rk)}" value="${h(draft(rk, ''))}" placeholder="For example: the second region is outside the EU"${invalid(rk)}${dis}>${msgHtml(rk)}</div></div><div class="entry-actions"><button type="button" class="button xs" data-action="exclude-option" data-option="${h(item.id)}" data-key="${h(`x|${item.id}|exclude`)}"${dis}>Exclude ${h(item.id)}</button></div></div></details>`;
}
function addOptionHtml(dis) {
  const key = 'newopt', titleId = fid('newopt|title'), nk = 'newopt|name';
  const select = (k) => { const fk = `newopt|${k}`; return `<div class="field"><label for="${fid(fk)}">${h(SHAPE_TEXT[k])}</label><select id="${fid(fk)}" data-key="${h(fk)}" data-draft="1"${dis}><option value="">Not set (TBD)</option>${SHAPE_VALUES[k].map((x) => `<option value="${h(x)}"${draft(fk, '') === x ? ' selected' : ''}>${h(k === 'topology' ? topoNames[x] : k === 'dr' ? drNames[x] : choiceText(x))}</option>`).join('')}</select></div>`; };
  const dk = 'newopt|data';
  return `<details class="fold" data-fold="${key}"${view.open.has(key) ? ' open' : ''}><summary data-key="${key}">Add an option</summary><div class="sub-form" role="group" aria-labelledby="${titleId}"><p class="kv" id="${titleId}">Describe the option at shape level, for example one region, multi-AZ. The engine numbers it and runs its hard checks.</p><div class="entry-grid"><div class="field"><label for="${fid(nk)}">Option name</label><input id="${fid(nk)}" type="text" autocomplete="off" data-key="${h(nk)}" data-draft="1" aria-describedby="${mid(nk)}" value="${h(draft(nk, ''))}" placeholder="For example: Two regions, warm standby"${invalid(nk)}${dis}>${msgHtml(nk)}</div>${select('hosting')}${select('topology')}${select('dr')}<div class="field"><label for="${fid(dk)}">Data</label><input id="${fid(dk)}" type="text" autocomplete="off" data-key="${h(dk)}" data-draft="1" value="${h(draft(dk, ''))}" placeholder="For example: relational, asynchronous replica"${dis}></div>${select('network')}</div><div class="entry-actions"><button type="button" class="button xs" data-action="add-option" data-key="newopt|add"${dis}>Add the option</button></div></div></details>`;
}
function weightsHtml(dis) {
  const w = project.options.weights, approved = !!(w && w.values && w.approved_by);
  const current = approved ? `${table('Approved weights', ['Criterion', 'Weight'], CRITERIA.filter((c) => Object.hasOwn(w.values, c)).map((c) => [tdText(CRITERION_TEXT[c]), tdText(String(w.values[c]))]), '')}<p class="small-note">${esc(`Approved by ${w.approved_by} on ${utcText(w.approved_at)}.`)}</p>` : '<p class="warn-message">No weights are approved, so the comparison is unweighted (flag UNWEIGHTED). The Standard forbids invented weights: only a person approves them.</p>';
  const titleId = fid('w|title');
  const fields = CRITERIA.map((c) => { const key = `w|${c}`; return `<div class="field"><label for="${fid(key)}">Weight for ${h(CRITERION_TEXT[c].toLowerCase())}</label><input id="${fid(key)}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-key="${h(key)}" data-check="weight" data-criterion="${c}" data-draft="1" aria-describedby="${mid(key)}" value="${h(draft(key, approved && Object.hasOwn(w.values, c) ? w.values[c] : null))}" placeholder="Blank leaves it out"${invalid(key)}${dis}>${msgHtml(key)}</div>`; }).join('');
  const form = `<div class="sub-form" role="group" aria-labelledby="${titleId}"><p class="kv" id="${titleId}">Weights to approve: a number, 0 or more, per criterion. Leave a criterion blank to leave it out. At least one weight is above 0. Approving records your name as the approver.</p><div class="entry-grid">${fields}</div>${msgHtml('w|approve')}<div class="entry-actions"><button type="button" class="button xs primary" data-action="approve-weights" data-key="w|approve"${dis}>Approve these weights</button></div></div>`;
  return section('s3Weights', 'WEIGHTS', 'Weights and who approved them', 'The weighted score counts only criteria with an approved weight above 0, and only options that pass every hard check.', `${current}${form}`);
}
function overlayHtml() {
  if (project.register.overlay.applies !== true) return '';
  const o = project.register.overlay, mig = model.c.rows.find((r) => r.id === 'CALC-17');
  const tables = o.workloads.map((w) => table(`${w.id} ${w.name || '(no name yet)'}`, ['Item', 'Value', 'Status', 'Source'], OVERLAY_FIELDS.map((row) => { const e = rowEntries(project, row.id).find((x) => x.workload === w.id); return [td(`<span class="mono">${h(row.id)}</span> ${esc(row.label)}`), tdText(e && e.value !== null && e.value !== undefined ? e.value : 'TBD'), td(e ? `<span class="${STATUS_CHIP[e.status] || 'chip'}">${h(e.status)}</span>` : '<span class="chip amber">No entry</span>'), tdText(e && e.source && e.source.text ? e.source.text : 'none yet')]; }), '')).join('');
  return section('s3Overlay', 'MIGRATION OVERLAY', 'Migration overlay per workload', `Source ${o.source}. ${mig ? `Transfer time (CALC-17): ${calcText(mig)}.` : ''}`, tables);
}

function findingHtml(x, cls) {
  const p = x.entry ? parseEntryId(x.entry) : null, g = p ? p.rowId.slice(0, 3) : null, go = p && GROUP_TABS.includes(g) ? `<button type="button" class="button xs" data-action="go-entry" data-entry="${h(x.entry)}" data-key="${h(`go|${x.id}`)}">Go to ${h(x.entry)} in the register</button>` : x.entry ? `<span class="rule-id">Entry ${h(x.entry)}</span>` : '';
  return `<li class="rule-card ${cls}"><div class="rule-head"><strong class="mono">${h(x.id)}</strong><span class="rule-id">Owner: ${esc(x.owner || 'not named')}</span></div><div class="why">${esc(x.msg)}</div>${go ? `<div class="entry-actions">${go}</div>` : ''}</li>`;
}
function estimatedGroups() {
  const groups = ['HDR', ...GROUP_ORDER, ...(project.register.overlay.applies === true ? ['OVL'] : [])];
  return groups.map((g) => {
    const items = [];
    for (const row of registerView(project, { stage: 2, group: g })) for (const e of row.entries) {
      if (e.status === 'Estimated') items.push({ id: e.id, what: row.title, value: valueText(row, e.value), source: e.sourceText });
      for (const f of e.factors) if (f.status === 'Estimated') items.push({ id: `${e.id}.${f.name}`, what: f.label, value: factorText(f), source: f.sourceText });
    }
    return { g, name: groupName(g), items };
  });
}
function optionEstimates() {
  const out = [];
  for (const o of project.options.list) {
    if (!o) continue;
    for (const cost of ['one_time', 'monthly']) if (o[cost] && o[cost].status === 'Estimated') out.push({ id: `${o.id}.${cost}`, what: `${COST_TEXT[cost]} of ${o.name}`, value: money(o[cost].value), source: `Entered by ${o[cost].by || 'unknown'}`, op: { op: 'confirm', option: o.id, cost } });
    for (const c of CRITERIA) { const s = o.scores && o.scores[c]; if (s && s.status === 'Estimated') out.push({ id: `${o.id}.${c}`, what: `${CRITERION_TEXT[c]} score of ${o.name}`, value: `${s.value} of 5`, source: `${s.by || 'unknown'}: ${s.reason || 'no reason'}`, op: { op: 'confirm', option: o.id, criterion: c } }); }
  }
  return out;
}
function estimatedTotal() { return estimatedGroups().reduce((n, x) => n + x.items.length, 0) + optionEstimates().length; }
function renderStage4() {
  const box = $('stage4Body');
  if (view.stage !== 4) { box.innerHTML = ''; return; }
  if (!model) { $('stage4Count').textContent = 'Not computed'; box.innerHTML = '<div class="error-message">The engine could not compute this project, so the decisions and the gates cannot be shown. Read the alert above, correct the value it names, and this stage comes back.</div>'; return; }
  $('stage4Count').textContent = `Gate: ${model.gate.label}`;
  const dis = disabledAttr();
  box.innerHTML = [confirmHtml(dis), decisionsHtml(dis), validationHtml(), gateHtml()].join('');
}
function confirmBlock(key, name, items, action, group, dis) {
  const titleId = fid(`${key}|title`), n = items.length;
  const list = table(`Estimated values in ${name}`, ['ID', 'Item', 'Value', 'Source'], items.map((x) => [td(`<span class="mono">${h(x.id)}</span>`), tdText(x.what), tdText(x.value), tdText(x.source || 'none')]), '');
  return `<div class="confirm-group" role="group" aria-labelledby="${titleId}"><div class="opt-head"><h4 id="${titleId}">${h(name)}: ${n} Estimated ${n === 1 ? 'value' : 'values'}</h4><button type="button" class="button xs primary" data-action="${action}" data-group="${h(group)}" data-key="${h(key)}|confirm"${dis}>Confirm all ${n} in ${h(name)}</button></div><details class="fold" data-fold="${h(key)}"${view.open.has(key) ? ' open' : ''}><summary data-key="${h(key)}">Show the ${n} ${n === 1 ? 'value' : 'values'}</summary><div>${list}</div></details></div>`;
}
function confirmHtml(dis) {
  const groups = estimatedGroups().filter((x) => x.items.length), opts = optionEstimates();
  const blocks = [...groups.map((x) => confirmBlock(`c4|${x.g}`, x.name, x.items, 'confirm-estimated', x.g, dis)), ...(opts.length ? [confirmBlock('c4|OPTIONS', 'Option costs and scores', opts, 'confirm-estimated', 'OPTIONS', dis)] : [])];
  const total = groups.reduce((n, x) => n + x.items.length, 0) + opts.length;
  const body = blocks.length ? `<div class="stack">${blocks.join('')}</div>` : '<p class="small-note">No Estimated value is waiting: every value is Confirmed, Open or N/A.</p>';
  return section('s4Confirm', 'CONFIRM', 'Estimated values still standing', 'Each value was pre-filled from the BRD, derived, defaulted or entered without a confirmation. One Confirm per group records your name and the UTC time on every value in it.', body, `<span class="chip">${total} Estimated</span>`);
}
function lastDecision() { for (let i = project.history.length - 1; i >= 0; i--) { const r = project.history[i]; if (r && r.op === 'decide' && r.actor) return `${r.actor.label || r.actor.name} on ${utcText(r.at)}`; } return null; }
function decideScopes() { return [...new Set([...model.scopes.map((s) => s.scope).filter(Boolean), ...Object.keys(project.decisions.dr_overrides)])]; }
function decideOp() {
  const d = project.decisions, dr = {};
  for (const scope of decideScopes()) dr[scope] = draft(`decide|dr|${scope}`, d.dr_overrides[scope] || 'auto');
  return { op: 'decide', topology: draft('decide|topology', d.topology_override || 'auto'), dr, reason: draft('decide|reason', d.override_reason || '') };
}
function decisionsHtml(dis) {
  const d = project.decisions, sh = model.shape, tk = 'decide|topology', rk = 'decide|reason', ok = 'decide|option', titleId = fid('decide|title'), optTitle = fid('decide|optionTitle');
  const topo = draft(tk, d.topology_override || 'auto');
  const topoSelect = `<div class="field"><label for="${fid(tk)}">Topology</label><select id="${fid(tk)}" data-key="${tk}" data-draft="1" aria-describedby="${fid(tk)}-meta"${dis}>${OVERRIDE_VALUES.topology.map((x) => `<option value="${x}"${topo === x ? ' selected' : ''}>${h(x === 'auto' ? 'No override: the engine\'s topology' : `Override: ${topoNames[x] || x}`)}</option>`).join('')}</select><div class="kv" id="${fid(tk)}-meta">${esc(`Target shape now: ${topoNames[sh.topology] || sh.topology}${sh.topologySource === 'override' ? ', from the override' : ''}.`)}</div></div>`;
  const scopes = decideScopes();
  const drSelects = scopes.map((scope) => { const k = `decide|dr|${scope}`, cur = draft(k, d.dr_overrides[scope] || 'auto'), s = model.scopes.find((x) => x.scope === scope); return `<div class="field"><label for="${fid(k)}">${h(`DR strategy for scope ${choiceText(scope)}`)}</label><select id="${fid(k)}" data-key="${h(k)}" data-draft="1" aria-describedby="${fid(k)}-meta"${dis}><option value="auto"${cur === 'auto' ? ' selected' : ''}>No override: the engine's strategy</option>${OVERRIDE_VALUES.dr.map((x) => `<option value="${x}"${cur === x ? ' selected' : ''}>${h(`Override: ${drNames[x] || x}`)}</option>`).join('')}</select><div class="kv" id="${fid(k)}-meta">${esc(s ? `Now: ${drNames[s.strategy] || s.strategy} (${s.entry}).` : 'No REL-05 entry names this scope any more; choose No override to remove it.')}</div></div>`; }).join('');
  const reason = `<div class="field wide"><label for="${fid(rk)}">Reason for the overrides (needed whenever an override is chosen)</label><textarea id="${fid(rk)}" rows="2" data-key="${rk}" data-draft="1" data-check="decide" aria-describedby="${mid(rk)}" placeholder="For example: the owner accepts zone-level recovery for this release"${invalid(rk)}${dis}>${h(draft(rk, d.override_reason || ''))}</textarea>${msgHtml(rk)}</div>`;
  const overrides = `<div class="sub-form" role="group" aria-labelledby="${titleId}"><p class="kv" id="${titleId}">Overrides depart from the engine's shape. ${scopes.length ? '' : 'Name a failure scope in REL-05 to override its DR strategy. '}Each override needs a reason.</p><div class="entry-grid">${topoSelect}${drSelects}${reason}</div>${msgHtml('decide|save')}<div class="entry-actions"><button type="button" class="button xs primary" data-action="decide-overrides" data-key="decide|save"${dis}>Record the overrides</button></div></div>`;
  const chosen = draft(ok, d.chosen_option || '');
  const optionLabel = (x) => `${x.id} ${x.name}${x.hardPass === true ? '' : x.hardPass === false ? ' (cannot be chosen: fails a hard check)' : ' (cannot be chosen yet: hard checks cannot run)'}`;
  const optionSelect = model.options.list.length ? `<div class="field"><label for="${fid(ok)}">Chosen option</label><select id="${fid(ok)}" data-key="${ok}" data-draft="1"${dis}><option value=""${chosen === '' ? ' selected' : ''}>No option chosen</option>${model.options.list.map((x) => `<option value="${h(x.id)}"${chosen === x.id ? ' selected' : ''}${x.hardPass === true || x.id === d.chosen_option ? '' : ' disabled'}>${esc(optionLabel(x))}</option>`).join('')}</select></div>` : '<p class="small-note">No option is recorded yet. Add or review the options in stage 3.</p>';
  const choice = `<div class="sub-form" role="group" aria-labelledby="${optTitle}"><p class="kv" id="${optTitle}">Choose one option that passes every hard check. The engine recommends none: the choice is yours.</p><div class="entry-grid">${optionSelect}</div>${msgHtml('decide|chosen')}${model.options.list.length ? `<div class="entry-actions"><button type="button" class="button xs primary" data-action="decide-option" data-key="decide|chosen"${dis}>Record the chosen option</button></div>` : ''}</div>`;
  const by = lastDecision(), held = [d.topology_override && d.topology_override !== 'auto' ? `topology ${topoNames[d.topology_override] || d.topology_override}` : '', ...Object.entries(d.dr_overrides).map(([k, x]) => `DR ${drNames[x] || x} for scope ${choiceText(k)}`)].filter(Boolean);
  const summary = `<p class="small-note">${esc(`Recorded now: ${held.length ? `overrides ${held.join('; ')}` : 'no override'}; chosen option ${d.chosen_option || 'none'}${by ? `; last decided by ${by}` : ''}.`)}</p>`;
  return section('s4Decide', 'DECISIONS', 'Decisions', 'Overrides of the topology or of a scope\'s DR strategy need a reason. A decision recorded after G3 sends the gate back to review.', `${summary}${overrides}${choice}`);
}
function validationHtml() {
  const v = model.validation, list = (items, cls, empty) => (items.length ? `<ul class="stack plain-list">${items.map((x) => findingHtml(x, cls)).join('')}</ul>` : `<p class="small-note">${h(empty)}</p>`);
  const body = `<h4 class="sub-title">Blockers (${v.blockers.length})</h4>${list(v.blockers, 'danger', 'No blocker.')}<h4 class="sub-title">Conflicts (${v.conflicts.length})</h4>${list(v.conflicts, 'warn', 'No conflict.')}<h4 class="sub-title">Advisories (${v.advisories.length})</h4>${list(v.advisories, '', 'No advisory.')}`;
  return section('s4Validation', 'VALIDATION', 'Validation', 'Blockers stop G2 and G3. Conflicts are shapes that cannot meet a failure scope. Advisories are worth reading but block nothing.', body, `<span class="chip${v.blockers.length ? ' red' : ' green'}">${v.blockers.length} ${v.blockers.length === 1 ? 'blocker' : 'blockers'}</span>`);
}
function gateHtml() {
  const g = model.gate, overlay = project.register.overlay.applies === true;
  const gates = table('Gates G0 to G3', ['Gate', 'Result', 'What is missing'], [['G0 Initiate', g.g0.met ? 'Met' : 'Not met', g.g0.missing, 'g0'], ['G1 Discover', g.g1.met ? 'Met' : 'Not met', g.g1.missing, 'g1'], ['G2 Assess', G2_TEXT[g.g2.result] || g.g2.result, g.g2.missing, 'g2'], ['G3 Approve', g.g3.status, g.g3.problems, 'g3']].map(([name, result, missing, k]) => [`<th scope="row">${h(name)}</th>`, tdText(result), td(foldList(`gate|${k}`, missing, 'Show what is missing'))]), '');
  const lines = table('G3 checklist (read-only)', ['Line', 'Text', 'Status', 'Ticked by'], G3_CHECKLIST.map((line) => { const t = Object.hasOwn(project.gate.checklist, line.id) ? project.gate.checklist[line.id] : null; return [td(`<span class="mono">${h(line.id)}</span>`), tdText(line.text.replace(/`/g, '')), tdText(t ? `${t.status}${t.na_reason ? `: ${t.na_reason}` : ''}` : 'Open'), tdText(t ? `${t.by || 'unknown'} on ${utcText(t.at)}` : 'not ticked')]; }), '');
  const roles = SIGNOFF_ROLES.filter((role) => !role.overlayOnly || overlay);
  const records = signoffRecords(project, g);
  const signRows = roles.flatMap((role) => { const own = records.filter((x) => x.role === role.key); return own.length ? own.map((x) => [`<th scope="row">${esc(role.label)}</th>`, tdText(x.name || 'not named'), tdText(x.applicable === false ? `Not applicable: ${x.na_reason || 'no reason'}` : x.decision || 'none'), tdText(utcText(x.at) || 'TBD'), tdText([x.counted ? 'Counted' : 'Not counted', ...(x.stand_in ? ['stand-in'] : [])].join(', '))]) : [[`<th scope="row">${esc(role.label)}</th>`, tdText('not signed'), tdText('Not signed'), tdText('TBD'), tdText('Not counted')]]; });
  const register = table('Sign-off register (read-only)', ['Role', 'Name', 'Decision', 'Signed at', 'Counted'], signRows, '');
  const conditions = table('Conditions', ['ID', 'Condition', 'Owner', 'Due'], project.gate.conditions.filter(Boolean).map((c) => [td(`<span class="mono">${h(c.id)}</span>`), tdText(c.text), tdText(c.owner || 'not named'), tdText(c.due || 'not set')]), 'No condition is recorded.');
  const exceptions = table('Exceptions', ['ID', 'Entry', 'Reason', 'Granted by', 'Expires', 'Review'], project.gate.exceptions.filter(Boolean).map((x) => [td(`<span class="mono">${h(x.id)}</span>`), tdText(x.entry), tdText(x.reason), tdText(x.granted_by), tdText(x.expires), tdText(x.review)]), 'No exception is recorded.');
  const g3Note = '<p class="warn-message" role="note">G3 is signed in chat, after the write-up and the review. The Studio shows the sign-off register read-only: nobody signs here, and the checklist is ticked at the G3 stop.</p>';
  const head = `<p class="small-note">${esc(`Gate label: ${g.label}. Authorized to start the SDD: ${g.authorized ? 'yes' : 'no'}.`)}</p>`;
  return section('s4Gate', 'GATES', 'Gates and sign-off', 'G1 and G2 are review stops; G3 is the sign-off stop.', `${head}${gates}${g3Note}${register}${lines}${conditions}${exceptions}`, `<span class="chip">${h(g.label)}</span>`);
}

function focusAfter(related) { return related && related.dataset && related.dataset.key ? [related.dataset.key] : []; }
function commitField(el, related, defer) {
  const key = el.dataset.key, entry = el.dataset.entry, rowId = el.dataset.row, field = el.dataset.field, factor = el.dataset.factor || null, raw = el.value;
  const problem = fieldError(rowId, factor || field, raw);
  if (problem) { view.drafts[key] = raw; note(key, 'error', problem); return; }
  const current = savedValue(entry, field, factor);
  if (!raw.trim()) {
    if (current === null || current === undefined || current === '') { delete view.drafts[key]; clearNote(key); return; }
    view.drafts[key] = raw;
    const held = factor ? (savedEntry(entry) || {}).factors?.[factor] : savedEntry(entry);
    note(key, 'note', held && held.status === 'Confirmed' && (field === 'value' || factor) ? 'The confirmed value is kept. Choose Clear to remove the value and its confirmation, or type a new value.' : 'The saved value is kept. Choose Clear to remove it, or type a new value.', true);
    return;
  }
  if (typeof current === 'number' ? Number(raw.trim()) === current : raw.trim() === String(current ?? '')) { delete view.drafts[key]; clearNote(key); return; }
  act([factor ? { op: 'set-factor', entry, factor, value: raw } : { op: 'set', entry, [field]: raw }], { key, focus: focusAfter(related), defer, done: `Saved the ${factor ? `${factor} factor` : FIELD_SHORT[field] || field} of ${entry}.` });
}
function commitOptionField(el, related, defer) {
  const key = el.dataset.key, raw = el.value, horizon = el.dataset.field === 'horizon', option = el.dataset.option, cost = el.dataset.cost;
  const held = horizon ? project.options.horizon_months : ((storedOption(option) || {})[cost] || {}).value;
  const current = held === undefined ? null : held;
  if (!raw.trim()) {
    if (current === null) { delete view.drafts[key]; clearNote(key); return; }
    view.drafts[key] = raw;
    const confirmed = !horizon && ((storedOption(option) || {})[cost] || {}).status === 'Confirmed';
    note(key, 'note', confirmed ? 'The confirmed cost is kept. Choose Clear to remove the cost and its confirmation, or type a new value.' : 'The saved value is kept. Choose Clear to remove it, or type a new value.', true);
    return;
  }
  if (typeof current === 'number' && Number(raw.trim()) === current) { delete view.drafts[key]; clearNote(key); return; }
  view.drafts[key] = raw;
  act([horizon ? { op: 'set-horizon', value: raw } : { op: 'set-cost', option, cost, value: raw }], { key, focus: focusAfter(related), defer, done: horizon ? 'Saved the TCO horizon.' : `Saved the ${COST_TEXT[cost].toLowerCase()} of ${option}.` });
}
function probe(ops) { return view.personOk ? applyPatch(project, ops, personActor(), { now: nowIso() }).errors : []; }
function checkWeight(el) {
  const key = el.dataset.key, raw = el.value, c = el.dataset.criterion;
  view.drafts[key] = raw;
  if (!raw.trim()) { clearNote(key); return; }
  const other = CRITERIA.find((x) => x !== c), errors = probe([{ op: 'set-weights', values: { [c]: raw, [other]: 1 } }]);
  if (errors.length) note(key, 'error', `${errors[0].message} Enter a number, 0 or more, for example 3.`); else clearNote(key);
}
function checkDecide(el) {
  view.drafts[el.dataset.key] = el.value;
  const errors = probe([decideOp()]);
  if (errors.length) note('decide|reason', 'error', errors[0].message); else clearNote('decide|reason');
}
function commitAny(el, related, defer) {
  if (el.dataset.check === 'weight') checkWeight(el);
  else if (el.dataset.check === 'decide') checkDecide(el);
  else if (el.dataset.field === 'cost' || el.dataset.field === 'horizon') commitOptionField(el, related, defer);
  else if (el.dataset.field && el.dataset.entry) commitField(el, related, defer);
}
function reasoned(entry, field, fix, ops, done) {
  const key = `${entry}|${field}`, el = $(fid(key)), reason = el ? el.value.trim() : '';
  if (!reason) { note(key, 'error', fix); if (el) el.focus(); return; }
  act(ops(reason), { key, focus: [`${entry}|head`], done });
}
function addEntry(rowId) {
  const label = ($(fid(`${rowId}|addLabel`)) || {}).value || '', scopeEl = $(fid(`${rowId}|addScope`)), before = rowEntries(project, rowId).map((e) => e.n);
  const op = { op: 'add', row: rowId, ...(label.trim() ? { label: label.trim() } : {}), ...(scopeEl && scopeEl.value ? { scope: scopeEl.value } : {}) };
  if (!act([op], { focus: [`${rowId}|add`] })) return;
  const added = rowEntries(project, rowId).find((e) => !before.includes(e.n));
  if (added) { restoreFocus([`${rowId}.${added.n}|value`]); toast(`Added ${rowId}.${added.n}. It is Open until someone answers it.`); }
}
function clearOps(target) {
  if (target === 'opt|horizon') return [{ op: 'set-horizon', value: '' }];
  if (target.startsWith('opt|')) { const [, option, cost] = target.split('|'); return [{ op: 'set-cost', option, cost, value: '' }]; }
  const cut = target.indexOf('|'), id = target.slice(0, cut), field = target.slice(cut + 1), factor = field.startsWith('factor:') ? field.slice(7) : null;
  return [factor ? { op: 'set-factor', entry: id, factor, value: '' } : { op: 'set', entry: id, [field]: '' }];
}
function clearDone(target) {
  if (target === 'opt|horizon') return 'Cleared the TCO horizon. It shows TBD.';
  if (target.startsWith('opt|')) { const [, option, cost] = target.split('|'); return `Cleared the ${COST_TEXT[cost].toLowerCase()} of ${option}. It shows TBD.`; }
  const cut = target.indexOf('|'), id = target.slice(0, cut), field = target.slice(cut + 1);
  return field === 'value' ? `Cleared ${id}. It is Open again and shows TBD.` : field.startsWith('factor:') ? `Cleared the ${field.slice(7)} factor of ${id}. It shows TBD.` : `Cleared the ${FIELD_SHORT[field] || field} of ${id}.`;
}
function clearKey(target) { return target.endsWith('|value') ? `${target.slice(0, -6)}|clear` : `${target}|clear`; }
function startClear(target, confirmed) {
  if (confirmed) { view.clearing = target; render(); restoreFocus([`${target}|clearCancel`]); return; }
  act(clearOps(target), { focus: [target], done: clearDone(target) });
}
function formValue(key) { const el = $(fid(key)); return el ? el.value : draft(key, ''); }
function dropDrafts(prefix) { for (const k of Object.keys(view.drafts)) if (k.startsWith(prefix)) delete view.drafts[k]; }
function goToEntry(id) {
  const p = parseEntryId(id), g = p ? p.rowId.slice(0, 3) : null;
  if (!p || !GROUP_TABS.includes(g)) return;
  view.group = g;
  goStage(2, `${id}|head`);
}
function onAssessClick(b, a) {
  const option = b.dataset.option;
  if (a === 'provider') { view.provider = b.dataset.provider; render(); restoreFocus([`provider|${view.provider}`]); }
  else if (a === 'diagram') { view.diagram = b.dataset.diagram; render(); restoreFocus([`diagram|${view.diagram}`]); }
  else if (a === 'dl-mermaid' && shown) download(`${shown.diagram.id}.mmd`, mermaid(shown.diagram), 'text/plain');
  else if (a === 'dl-drawio' && shown) download('Pre-SDD_Architecture.drawio', drawio(filteredGraph(shown.graph, model.v, shown.ctx).diagrams, shown.ctx), 'application/xml');
  else if (a === 'dl-svg' && shown) download(`${view.diagram}.svg`, diagramSVG(shown.diagram), 'image/svg+xml');
  else if (a === 'set-score') {
    const rk = `sc|${option}|reason`, reason = formValue(rk).trim(), criterion = formValue(`sc|${option}|criterion`), value = Number(formValue(`sc|${option}|value`));
    if (!reason) { note(rk, 'error', 'Give a one-line reason for the score, for example: fits the zone failure scope.'); $(fid(rk)).focus(); return; }
    if (act([{ op: 'set-score', option, criterion, value, reason }], { key: rk, focus: [`sc|${option}|save`], done: `Recorded the ${CRITERION_TEXT[criterion].toLowerCase()} score of ${option}. It is Estimated until someone confirms it.` })) dropDrafts(`sc|${option}|`);
  } else if (a === 'exclude-option') {
    const rk = `x|${option}|reason`, reason = formValue(rk).trim(), entry = formValue(`x|${option}|entry`);
    if (!reason) { note(rk, 'error', 'Say how the option breaks the entry, for example: the second region is outside the EU.'); $(fid(rk)).focus(); return; }
    if (act([{ op: 'exclude-option', option, entry, reason }], { key: rk, focus: [`x|${option}|include`], done: `Excluded ${option}. G2 does not shortlist it.` })) dropDrafts(`x|${option}|`);
  } else if (a === 'include-option') act([{ op: 'include-option', option }], { focus: [`x|${option}`], done: `Included ${option} again. Its hard checks run as usual.` });
  else if (a === 'add-option') {
    const name = formValue('newopt|name').trim(), shape = {};
    for (const k of Object.keys(SHAPE_TEXT)) { const x = formValue(`newopt|${k}`).trim(); if (x) shape[k] = x; }
    if (!name) { note('newopt|name', 'error', 'Give the option a shape-level name, for example: one region, multi-AZ.'); $(fid('newopt|name')).focus(); return; }
    const before = project.options.list.map((o) => o.id);
    if (act([{ op: 'set-option', name, ...(Object.keys(shape).length ? { shape } : {}) }], { key: 'newopt|name', focus: ['newopt'], done: `Added the option ${name}.` })) { dropDrafts('newopt|'); const added = project.options.list.find((o) => !before.includes(o.id)); if (added) toast(`Added ${added.id}: ${name}. Enter its costs; its hard checks run now.`); }
  } else if (a === 'approve-weights') {
    const values = {};
    for (const c of CRITERIA) { const x = formValue(`w|${c}`).trim(); if (x) values[c] = x; }
    if (!Object.keys(values).length) { note('w|approve', 'error', 'Enter a weight for at least one criterion, for example 3 for fit to the NFRs.'); return; }
    if (act([{ op: 'set-weights', values }], { key: 'w|approve', focus: ['w|approve'], done: 'Approved the weights under your name. The comparison is weighted now.' })) dropDrafts('w|');
  } else if (a === 'confirm-estimated') {
    const g = b.dataset.group, ops = g === 'OPTIONS' ? optionEstimates().map((x) => x.op) : [{ op: 'confirm-group', group: g }];
    act(ops, { focus: [`c4|${g}|confirm`, '#stage4Title'], done: `Confirmed every Estimated value in ${g === 'OPTIONS' ? 'the option costs and scores' : groupName(g)} under your name.` });
  } else if (a === 'decide-overrides') {
    const op = decideOp();
    if (act([op], { key: 'decide|save', focus: ['decide|save'], done: 'Recorded the overrides.' })) { dropDrafts('decide|topology'); dropDrafts('decide|dr|'); dropDrafts('decide|reason'); delete view.notes['decide|reason']; }
  } else if (a === 'decide-option') {
    const value = formValue('decide|option');
    if (act([{ op: 'decide', option: value || null }], { key: 'decide|chosen', focus: ['decide|chosen'], done: value ? `Recorded ${value} as the chosen option.` : 'Cleared the chosen option.' })) dropDrafts('decide|option');
  } else if (a === 'go-entry') goToEntry(b.dataset.entry);
}
function onRegisterClick(e) {
  const b = e.target.closest('button[data-action]');
  if (!b || b.disabled) return;
  const entry = b.dataset.entry, a = b.dataset.action;
  if (a === 'clear') startClear(`${entry}|value`, b.dataset.confirmed === 'true');
  else if (a === 'clear-factor') startClear(`${entry}|factor:${b.dataset.factor}`, b.dataset.confirmed === 'true');
  else if (a === 'clear-confirm') { const target = b.dataset.target; view.clearing = null; act(clearOps(target), { focus: [target], done: clearDone(target) }); }
  else if (a === 'clear-cancel') { const target = b.dataset.target; view.clearing = null; render(); restoreFocus([clearKey(target), target]); }
  else if (a === 'clear-field') { const target = b.dataset.target; act(clearOps(target), { key: target, focus: [target], done: clearDone(target) }); }
  else if (a === 'accept') act([{ op: 'accept-proposal', entry }], { focus: [`${entry}|value`, `${entry}|head`], done: `Accepted the proposal for ${entry}. It is Confirmed under your name.` });
  else if (a === 'add') addEntry(b.dataset.row);
  else if (a === 'remove') { view.removing = entry; render(); restoreFocus([`${entry}|removeCancel`]); }
  else if (a === 'remove-cancel') { view.removing = null; render(); restoreFocus([`${entry}|remove`]); }
  else if (a === 'remove-confirm') { view.removing = null; act([{ op: 'remove', entry }], { focus: [`${entry.split('.')[0]}|add`], done: `Removed ${entry}.` }); }
  else if (a === 'na') reasoned(entry, 'naReason', 'Say why the item does not apply, for example: no batch processing is in scope.', (reason) => [{ op: 'na', entry, reason }], `Marked ${entry} N/A.`);
  else if (a === 'reopen') act([{ op: 'open', entry }], { focus: [`${entry}|value`], done: `Reopened ${entry}. It is Open again.` });
  else if (a === 'kind') { const kind = $(fid(`${entry}|kindChoice`)).value; reasoned(entry, 'kindReason', 'Give the reason for the kind, for example: the contract sets a penalty.', (reason) => [{ op: 'set', entry, kind, reason }], `Recorded the kind of ${entry} as ${KIND_TEXT[kind]}.`); }
  else if (a === 'confirm-group') { const g = b.dataset.group; act([{ op: 'confirm-group', group: g }], { focus: [`group|${g}|confirm`, `#tab-${g}`], done: `Confirmed every pre-filled value in ${groupName(g)} under your name.` }); }
  else onAssessClick(b, a);
}
function onRegisterChange(e) {
  const el = e.target;
  if (el.dataset && el.dataset.draft) { view.drafts[el.dataset.key] = el.value; return; }
  if (el.dataset && el.dataset.action === 'show-optional') { view.showOptional = el.checked; render(); restoreFocus(['diagram|optional']); return; }
  if (el.type !== 'checkbox' || el.dataset.action !== 'confirm') return;
  const entry = el.dataset.entry, factor = el.dataset.factor || null, option = el.dataset.option || null;
  if (option) {
    const cost = el.dataset.cost || null, criterion = el.dataset.criterion || null;
    const ok = act([cost ? { op: 'confirm', option, cost } : { op: 'confirm', option, criterion }], { focus: [cost ? `opt|${option}|${cost}` : `opt|${option}|scores`], done: `Confirmed the ${cost ? COST_TEXT[cost].toLowerCase() : `${CRITERION_TEXT[criterion].toLowerCase()} score`} of ${option} under your name.` });
    if (!ok) el.checked = false;
    return;
  }
  const ok = act([{ op: 'confirm', entry, ...(factor ? { factor } : {}) }], { focus: [factor ? `${entry}|factor:${factor}` : `${entry}|value`, `${entry}|head`], done: `Confirmed ${factor ? `the ${factor} factor of ${entry}` : entry} under your name.` });
  if (!ok) el.checked = false;
}
function attachRegister(box) {
  box.addEventListener('focusout', (e) => { const el = e.target; if (!el.dataset || el.type === 'checkbox' || !el.isConnected || !(el.dataset.field || el.dataset.check)) return; commitAny(el, e.relatedTarget, true); });
  box.addEventListener('keydown', (e) => { const el = e.target; if (e.key === 'Enter' && el.tagName === 'INPUT' && el.type === 'text' && (el.dataset.field || el.dataset.check)) { e.preventDefault(); commitAny(el, el, false); } });
  box.addEventListener('input', (e) => { const el = e.target; if (el.dataset && el.dataset.draft && el.tagName !== 'SELECT') view.drafts[el.dataset.key] = el.value; });
  box.addEventListener('change', onRegisterChange);
  box.addEventListener('click', onRegisterClick);
  box.addEventListener('toggle', (e) => { const d = e.target; if (d.dataset && d.dataset.fold) { if (d.open) view.open.add(d.dataset.fold); else view.open.delete(d.dataset.fold); } }, true);
}

function showPerson(problem) {
  const msg = $('personMsg'), input = $('personName');
  msg.className = `field-msg${problem ? ' error' : ''}`;
  msg.textContent = problem || '';
  if (problem) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
}
function checkPerson() {
  const name = $('personName').value.trim(), was = view.personOk, problem = personProblem(name);
  view.person = name;
  view.personOk = !problem;
  showPerson(problem);
  if (was !== view.personOk) setTimeout(() => {
    const key = activeKey(), run = project.run;
    if (view.personOk && (run.stage !== view.stage || run.group !== view.group)) recordRun({ stage: view.stage, group: view.group });
    render(); restoreFocus([key]);
  }, 0);
}
function goStage(n, focusKey) {
  const block = stageBlock(project, n);
  if (block) { const stepNote = $('stepNote'); stepNote.dataset.stage = String(n); stepNote.hidden = false; stepNote.textContent = block; return; }
  view.stage = n; view.order = {}; view.removing = null; view.clearing = null;
  recordRun({ stage: n, group: view.group });
  render();
  const target = focusKey ? byKey(focusKey) : null;
  (target && !target.disabled ? target : $(`stage${n}Title`)).focus();
}
function selectGroup(g) { view.group = g; view.order = {}; view.removing = null; view.clearing = null; recordRun({ stage: 2, group: g }); render(); $(`tab-${g}`).focus(); }

function replaceProject(next, done) {
  project = next;
  Object.assign(view, { notes: {}, drafts: {}, order: {}, removing: null, clearing: null, open: new Set(), provider: 'logical', diagram: 'infrastructure', showOptional: next.ui.show_optional === true, group: GROUP_TABS.includes(next.run.group) ? next.run.group : 'HDR' });
  view.stage = stageBlock(next, next.run.stage) ? 1 : next.run.stage;
  alertPage(null);
  refresh();
  if (done) toast(done);
}
function requestReplace(next, { what, done, keep = null, after = null }) {
  const finish = () => { replaceProject(next, done); if (after) after(); };
  if (!hasPersonAnswers()) { finish(); return; }
  view.pending = { finish, keep };
  $('replaceText').textContent = `${what} replaces every answer in this project, including the ones you confirmed. Choose Save project first if you want to keep them. Replace your answers?`;
  $('replacePrompt').hidden = false;
  $('replaceText').focus();
}
function resetExample() { view.scenario = ''; $('scenario').value = ''; }
function zipState(bytes) {
  const files = readStoredZip(bytes);
  if (!Object.hasOwn(files, 'project-state.json')) return null;
  try { const x = JSON.parse(files['project-state.json']); return x && x.kind === STATE_KIND ? x : null; } catch { return null; }
}
function fromV22(input, now) { return importForPage(input, { now, name: 'Imported project', slug: 'imported-project' }); }
function readProject(name, content, now) {
  let input = content, kind = 'state';
  if (content instanceof Uint8Array) {
    input = zipState(content);
    if (!input) return { next: fromV22(content, now), kind: 'v22', notes: [] };
    kind = 'zip';
  } else {
    try { input = JSON.parse(content); } catch { throw new Error(`${name} is not valid JSON. Choose a save file, a project state, a preview ZIP, or a Studio 2.2 project file or ZIP.`); }
  }
  const obj = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  if (obj.kind === SAVE_KIND) { const r = normalizeState(readSave(obj).state, { now }); return { next: r.state, kind: 'save', notes: r.advisories }; }
  if (obj.kind === STATE_KIND) { const r = normalizeState(obj, { now }); return { next: r.state, kind, notes: r.advisories }; }
  if (obj.schema_version !== undefined && (obj.architecture || obj.requirements)) readSave(obj);
  return { next: fromV22(input, now), kind: 'v22', notes: [] };
}
function notedText(notes) { return notes.length ? ` The engine noted ${notes.length} ${notes.length === 1 ? 'thing' : 'things'}, first: ${notes[0].msg}` : ''; }
function loadProjectFile(name, content) {
  let read;
  try { read = readProject(name, content, nowIso()); } catch (err) { alertPage([`${name} could not be imported. Nothing changed.`, ...errorLines(err)]); return; }
  requestReplace(read.next, { what: `Importing ${name}`, done: `Imported ${name}${IMPORT_TEXT[read.kind]}.${notedText(read.notes)}`, after: resetExample });
}
function loadExample(select) {
  const name = select.value, before = view.scenario, now = nowIso();
  let next;
  try {
    next = name === 'blank' ? blankProject(now) : importForPage({ inputs: { ...presets[name] } }, { now, name: `${EXAMPLES[name]} (example)`, slug: `example-${name.toLowerCase()}` });
  } catch (err) { alertPage(['The example could not be loaded.', ...errorLines(err)]); select.value = before; return; }
  requestReplace(next, {
    what: name === 'blank' ? 'Starting a blank project' : `Loading the example ${EXAMPLES[name]}`,
    done: name === 'blank' ? 'Started a blank project. No value is assumed.' : `Loaded the example ${EXAMPLES[name]}. Its values are illustrative and Estimated, never confirmed.`,
    keep: () => { select.value = before; },
    after: () => { view.scenario = name; },
  });
}

function download(filename, contents, mime = 'text/plain;charset=utf-8') {
  const blob = contents instanceof Blob ? contents : new Blob([contents], { type: mime }), url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function saveProject() {
  const now = nowIso();
  try {
    const name = saveFileName(project.project.slug, now);
    download(name, `${JSON.stringify(saveWrapper(project, compute(project, { now }), { now }), null, 2)}\n`, 'application/json');
    toast(`Saved ${name}. It holds the project state and its blueprint. Import opens it again here, and the skill reads it after it confirms the path with you.`);
  } catch (err) { alertPage(['The project could not be saved.', ...errorLines(err)]); }
}
function previewName(slug, now) { return saveFileName(slug, now).replace(/-state-(\d{8}T\d{6}Z)\.json$/, '-preview-$1.zip'); }
function downloadPreview() {
  const now = nowIso();
  try {
    const files = previewFiles(project, compute(project, { now }), { now }), name = previewName(project.project.slug, now);
    download(name, zipStored(files, { now }), 'application/zip');
    toast(`Downloaded ${name} with ${Object.keys(files).length} files. Preview, not the Pre-SDD of record.`);
  } catch (err) { alertPage(['The preview ZIP could not be built.', ...errorLines(err)]); }
}

function attach() {
  for (const id of ['stage1Rows', 'stage2Rows', 'stage3Body', 'stage4Body']) attachRegister($(id));
  $('groupBar').addEventListener('click', onRegisterClick);
  document.addEventListener('pointerdown', () => { pointer.down = true; }, true);
  const release = () => { pointer.down = false; if (pointer.pending) { const focus = pointer.pending; pointer.pending = null; setTimeout(() => refresh(focus), 0); } };
  document.addEventListener('pointerup', release, true);
  document.addEventListener('pointercancel', release, true);
  const person = $('personName');
  person.addEventListener('input', () => { view.person = person.value; });
  person.addEventListener('blur', checkPerson);
  person.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkPerson(); });
  $('stepper').addEventListener('click', (e) => { const b = e.target.closest('[data-stage]'); if (b && !b.disabled) goStage(Number(b.dataset.stage)); });
  $('groupTabs').addEventListener('click', (e) => { const t = e.target.closest('[role=tab]'); if (t) selectGroup(t.dataset.group); });
  $('groupTabs').addEventListener('keydown', (e) => {
    const moves = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' };
    if (!Object.hasOwn(moves, e.key)) return;
    e.preventDefault();
    const i = GROUP_TABS.indexOf(view.group), m = moves[e.key], n = GROUP_TABS.length;
    selectGroup(GROUP_TABS[m === 'first' ? 0 : m === 'last' ? n - 1 : (i + m + n) % n]);
  });
  $('replaceYes').addEventListener('click', () => { const p = view.pending; view.pending = null; $('replacePrompt').hidden = true; if (p) p.finish(); });
  $('replaceNo').addEventListener('click', () => { const p = view.pending; view.pending = null; $('replacePrompt').hidden = true; if (p && p.keep) p.keep(); toast('Kept your answers.'); });
  $('scenario').addEventListener('change', (e) => loadExample(e.target));
  $('importBtn').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const zip = /\.zip$/i.test(file.name), reader = new FileReader();
    reader.onerror = () => alertPage([`${file.name} could not be read. Choose the file again.`]);
    reader.onload = () => loadProjectFile(file.name, zip ? new Uint8Array(reader.result) : String(reader.result));
    if (zip) reader.readAsArrayBuffer(file); else reader.readAsText(file);
    e.target.value = '';
  });
  for (const id of ['saveBtn', 'saveBottom']) $(id).addEventListener('click', saveProject);
  for (const id of ['previewBtn', 'previewBottom']) $(id).addEventListener('click', downloadPreview);
}

function embeddedProject(now) {
  const el = $('embedded-state'), raw = el ? el.textContent.trim() : '';
  if (!raw || raw === 'null') return null;
  let input;
  try { input = JSON.parse(raw); } catch { throw new Error('The project state embedded in this page is not valid JSON. Build the page again with node cli.mjs embed, or import the project file.'); }
  return input === null ? null : normalizeState(input, { now });
}
function start() {
  const now = nowIso();
  let embedded = null, problem = null;
  try { embedded = embeddedProject(now); } catch (err) { problem = err; }
  try { project = embedded ? embedded.state : blankProject(now); } catch (err) { alertPage(['The Studio could not start a project.', ...errorLines(err)]); return; }
  view.group = GROUP_TABS.includes(project.run.group) ? project.run.group : 'HDR';
  view.stage = stageBlock(project, project.run.stage) ? 1 : project.run.stage;
  view.showOptional = project.ui.show_optional === true;
  attach();
  if (embedded) resetExample();
  refresh();
  if (problem) alertPage(['The project state embedded in this page could not be opened, so the Studio started a blank project.', ...errorLines(problem)]);
  else if (embedded) toast(`Opened ${project.project.name} from the project state embedded in this page.${notedText(embedded.advisories)}`);
}
start();
})();
