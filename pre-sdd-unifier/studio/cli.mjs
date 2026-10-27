import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { buildStudio } from './build.mjs';

const studioDir = dirname(fileURLToPath(import.meta.url));
const E = createRequire(import.meta.url)('./src/engine.js');
const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
const DIFF_PARTS = ['calculations', 'decisions', 'validation', 'dr_scenarios', 'architecture', 'conflicts', 'options', 'governance'];
const STATUS_KEYS = { Open: 'open', Estimated: 'estimated', Confirmed: 'confirmed', 'N/A': 'na' };
const USAGE = {
  new: 'node cli.mjs new <project-dir> --name "<name>" [--slug <slug>] --brd <KEY>=<path>@<version>[:<status>] ... [--mode full|quick] [--input web|prompt] [--light] [--import <v22.json|v22.zip>]',
  derive: 'node cli.mjs derive <state.json> [--apply <patch.json>] [--actor <actor.json>]',
  compute: 'node cli.mjs compute <state.json> --out <dir>',
  validate: 'node cli.mjs validate <file.json>\n       node cli.mjs validate --pick <folder> --slug <slug> --since <ISO>',
  unwrap: 'node cli.mjs unwrap <save.json> <studio-dir>',
  diff: 'node cli.mjs diff <blueprint-a.json> <blueprint-b.json>',
  embed: 'node cli.mjs embed <state.json> --out <file.html>',
  version: 'node cli.mjs --version',
};

class Exit extends Error {
  constructor(code, message, out = '') {
    super(message);
    this.code = code;
    this.out = out;
  }
}

const isObject = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const usage = (command, message) => new Exit(3, `${message}\nUsage: ${USAGE[command] ?? Object.values(USAGE).join('\n       ')}\nEvery command also takes --now <UTC ISO 8601>, for tests only.`);
const invalid = (message) => new Exit(2, message);
const jsonText = (value) => `${JSON.stringify(value, null, 2)}\n`;
const show = (x) => {
  if (x === undefined) return '(missing)';
  const t = JSON.stringify(x);
  return t.length > 120 ? `${t.slice(0, 117)}...` : t;
};

function canonical(x) {
  if (x === undefined) return 'undefined';
  if (Array.isArray(x)) return `[${x.map(canonical).join(',')}]`;
  if (isObject(x)) return `{${Object.keys(x).filter((k) => x[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canonical(x[k])}`).join(',')}}`;
  return JSON.stringify(x);
}

function args(command, argv, options, count) {
  let parsed;
  try {
    parsed = parseArgs({ args: argv, options: { ...options, now: { type: 'string' } }, allowPositionals: true, strict: true });
  } catch (error) {
    throw usage(command, error.message);
  }
  const { values, positionals } = parsed;
  if (!count.includes(positionals.length)) throw usage(command, `${command === 'version' ? '--version' : command} got ${positionals.length} path${positionals.length === 1 ? '' : 's'}; see the usage below.`);
  return { values, positionals, now: nowOf(command, values.now) };
}

function utcTime(command, flag, x) {
  if (!UTC.test(x) || Number.isNaN(Date.parse(x)) || new Date(x).toISOString().slice(0, 19) !== x.slice(0, 19)) throw usage(command, `${flag} takes a UTC time in ISO 8601, for example 2026-10-23T11:01:02Z; got ${JSON.stringify(x)}.`);
  return x;
}

function nowOf(command, x) {
  return x === undefined ? new Date().toISOString() : utcTime(command, '--now', x);
}

function readJson(path, what = 'The file') {
  if (!existsSync(path) || !statSync(path).isFile()) throw invalid(`${what} ${path} does not exist.`);
  const text = readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
  try {
    return JSON.parse(text);
  } catch (error) {
    throw invalid(`${path} is not JSON (${error.message}); give the file unchanged as the Studio or the engine wrote it.`);
  }
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

function gateLines(error) {
  const lines = String(error.message).split('\n');
  return lines[0] === 'The project state cannot be read:' ? lines.slice(1).map((line) => line.replace(/^- /, '')) : lines;
}

function normalized(state, now) {
  try {
    return E.normalizeState(state, { now });
  } catch (error) {
    return { lines: gateLines(error) };
  }
}

function loadState(path, now) {
  const result = normalized(readJson(path, 'The project state'), now);
  if (result.lines) throw invalid(`${path} cannot be read:\n${result.lines.map((line) => `- ${line}`).join('\n')}`);
  return result;
}

function counts(state) {
  const out = { open: 0, estimated: 0, confirmed: 0, na: 0 };
  const sections = [[state.register.header, E.HEADER_FIELDS], [state.register.items, E.ITEMS], ...(state.register.overlay.applies === true ? [[state.register.overlay.rows, E.OVERLAY_FIELDS]] : [])];
  for (const [rows, fields] of sections) for (const row of fields) for (const entry of rows[row.id] ?? []) if (STATUS_KEYS[entry.status]) out[STATUS_KEYS[entry.status]] += 1;
  return out;
}

function engineRun(state, now) {
  try {
    const defaults = E.applyDefaults(state, { now });
    const derived = E.derive(defaults.state, { now });
    return { state: derived.state, changes: [...defaults.changes, ...derived.changes] };
  } catch (error) {
    throw invalid(error.message);
  }
}

function parseBrd(raw) {
  const fail = (why) => usage('new', `--brd ${JSON.stringify(raw)}: ${why}; write it as <KEY>=<path>@<version>[:<status>], for example REFUNDS=../brd-refunds/refunds-brd-master.md@1.5:Approved.`);
  const eq = raw.indexOf('=');
  if (eq < 1) throw fail('give the key before =');
  const rest = raw.slice(eq + 1);
  const at = rest.lastIndexOf('@');
  if (at < 1) throw fail('give the path, then @ and the version');
  const tail = rest.slice(at + 1);
  const colon = tail.indexOf(':');
  const version = colon < 0 ? tail : tail.slice(0, colon);
  if (!version.trim() || /[\s/\\]/.test(version)) throw fail('give the version after the last @');
  const status = colon < 0 ? null : tail.slice(colon + 1).trim() || null;
  return { key: raw.slice(0, eq), path: rest.slice(0, at), version, status };
}

function cmdNew(argv) {
  const { values, positionals, now } = args('new', argv, { name: { type: 'string' }, slug: { type: 'string' }, brd: { type: 'string', multiple: true }, mode: { type: 'string' }, input: { type: 'string' }, light: { type: 'boolean' }, import: { type: 'string' } }, [1]);
  if (values.name === undefined) throw usage('new', 'new needs --name.');
  if (!values.brd || !values.brd.length) throw usage('new', 'new needs at least one --brd.');
  const stateFile = join(resolve(positionals[0]), 'studio', 'project-state.json');
  if (existsSync(stateFile)) throw invalid(`${stateFile} already exists: this folder is a resume, so run derive on it instead of new.`);
  const options = { name: values.name, slug: values.slug, brds: values.brd.map(parseBrd), mode: values.mode ?? 'full', input: values.input ?? 'prompt', light: values.light === true, now };
  let state;
  try {
    state = E.newState(options);
    if (values.import !== undefined) {
      const file = resolve(values.import);
      if (!existsSync(file)) throw invalid(`The v2.2 file ${file} does not exist.`);
      const source = /\.zip$/i.test(file) ? new Uint8Array(readFileSync(file)) : readJson(file, 'The v2.2 file');
      const imported = E.importV22(source, { now, name: state.project.name, slug: state.project.slug });
      imported.project.brds = state.project.brds;
      Object.assign(imported.run, { mode: state.run.mode, input: state.run.input, light: state.run.light });
      state = imported;
    }
  } catch (error) {
    if (error instanceof Exit) throw error;
    throw invalid(error.message);
  }
  const done = engineRun(state, now);
  writeText(stateFile, jsonText(done.state));
  return { out: jsonText({ state: stateFile, counts: counts(done.state), gate: E.compute(done.state, { now }).gate }) };
}

function patchOf(values) {
  if (values.apply === undefined) return { ops: [] };
  const patch = readJson(resolve(values.apply), 'The patch file');
  if (!isObject(patch)) throw invalid('A patch file is a JSON object: { "actor": { ... }, "ops": [ ... ] }.');
  const extra = Object.keys(patch).filter((k) => k !== 'actor' && k !== 'ops');
  if (extra.length) throw invalid(`The patch file holds ${extra.join(', ')}; a patch holds only actor and ops.`);
  if (!Array.isArray(patch.ops)) throw invalid('The patch file needs ops, a list of operations.');
  if (values.actor !== undefined && patch.actor !== undefined) throw invalid('Give the actor once: in the patch file or with --actor, not both.');
  const actor = values.actor !== undefined ? readJson(resolve(values.actor), 'The actor file') : patch.actor;
  if (actor === undefined) throw invalid('The patch names no actor; add "actor": { "type": ..., "name": ... } to it, or pass --actor.');
  return { actor, ops: patch.ops };
}

function guardErrors(actor, ops) {
  const errors = [];
  if (isObject(actor) && typeof actor.name === 'string' && actor.name.trim().toLowerCase() === E.ENGINE_NAME) errors.push({ index: null, op: null, target: null, message: `The name ${E.ENGINE_NAME} belongs to the engine, which writes its own defaults and derivations; act under your own name.` });
  ops.forEach((op, index) => {
    if (!isObject(op)) return;
    for (const key of ['source', 'cite']) {
      const t = isObject(op[key]) && typeof op[key].text === 'string' ? op[key].text.trim() : '';
      if (E.ENGINE_SOURCE_TEXTS.includes(t)) errors.push({ index, op: typeof op.op === 'string' ? op.op : null, target: [op.entry, op.row, op.option, op.id].find((x) => typeof x === 'string') ?? null, message: `${JSON.stringify(t)} is the engine's own ${t.startsWith('Derived') ? 'derivation' : 'default'} text, which only derive writes; cite the BRD or the source you used, or leave the entry to the engine.` });
    }
  });
  return errors;
}

function clearNote(change, state) {
  const entry = (() => {
    const id = E.parseEntryId(change.target);
    return id ? E.rowEntries(state, id.rowId).find((e) => e.n === id.n) : null;
  })();
  const source = change.from.source && change.from.source.type;
  const why = change.reason ? change.reason
    : entry && E.ENGINE_KIND[source] && entry.kind !== E.ENGINE_KIND[source] ? `a person set its kind to ${entry.kind}, so the engine no longer fills it; give the value, or set the kind back to ${E.ENGINE_KIND[source]} with a reason`
      : 'an input is missing, so its calculation is TBD';
  return `${change.target} is Open again: the engine cleared its own value ${show(change.from.value)} (${change.from.source ? change.from.source.text : 'no source'}) because ${why}.`;
}

function cmdDerive(argv) {
  const { values, positionals, now } = args('derive', argv, { apply: { type: 'string' }, actor: { type: 'string' } }, [1]);
  if (values.actor !== undefined && values.apply === undefined) throw usage('derive', '--actor names the actor of a patch, so it needs --apply.');
  const stateFile = resolve(positionals[0]);
  const summary = (changes, errors, state, notes) => jsonText({ changes, errors, counts: state ? counts(state) : null, gate: state ? E.compute(state, { now }).gate : null, notes });
  const refuse = (errors) => new Exit(2, '', summary([], errors, null, []));
  const asErrors = (lines) => lines.map((message) => ({ index: null, op: null, target: null, message }));
  let loaded;
  let patch;
  try {
    loaded = normalized(readJson(stateFile, 'The project state'), now);
    patch = patchOf(values);
  } catch (error) {
    if (error instanceof Exit && error.code === 2) throw refuse(asErrors([error.message]));
    throw error;
  }
  if (loaded.lines) throw refuse(asErrors(loaded.lines.map((line) => `${stateFile} cannot be read: ${line}`)));
  const applied = values.apply !== undefined ? E.applyPatch(loaded.state, patch.ops, patch.actor, { now }) : { state: loaded.state, changes: [], errors: [] };
  const errors = [...guardErrors(patch.actor, patch.ops), ...applied.errors].sort((a, b) => (a.index ?? -1) - (b.index ?? -1));
  if (errors.length) throw refuse(errors);
  const done = engineRun(applied.state, now);
  const notes = loaded.advisories.map((a) => a.msg);
  const hash = E.contentHash(done.state);
  const roles = [...new Set(patch.ops.filter((op) => isObject(op) && op.op === 'sign').map((op) => op.role))];
  for (const role of roles) {
    const signoff = done.state.gate.signoffs.find((x) => isObject(x) && x.role === role);
    if (signoff && signoff.content_hash !== hash) notes.push(`Sign again: the sign-off for ${role} in this patch no longer matches the content, because later ops in the patch or the defaults and derivations changed it, so G3 does not count it; send the sign-off in a patch of its own, after the content changes.`);
  }
  for (const change of done.changes) if (change.actor.name === E.ENGINE_NAME && change.op === 'set' && change.to && change.to.value === null && change.from && change.from.value !== null && change.from.value !== undefined) notes.push(clearNote(change, done.state));
  writeText(stateFile, jsonText(done.state));
  return { out: summary([...applied.changes, ...done.changes], [], done.state, notes) };
}

function cmdCompute(argv) {
  const { values, positionals, now } = args('compute', argv, { out: { type: 'string' } }, [1]);
  if (values.out === undefined) throw usage('compute', 'compute needs --out <dir>.');
  const { state } = loadState(resolve(positionals[0]), now);
  const out = resolve(values.out);
  const model = E.compute(state, { now });
  const blueprint = E.handoffBlueprint(state, model, { now });
  const graph = E.filteredGraph(model.graph, model.v, E.toCalcInputs(state).ctx);
  const files = { 'model.json': jsonText(model), 'blueprint.json': jsonText(blueprint), 'blueprint.yaml': `${E.yaml(blueprint)}\n` };
  for (const [name, body] of Object.entries(E.fragments(state, model, { now }))) files[`fragments/${name}`] = body;
  for (const diagram of Object.values(graph.diagrams)) files[`diagrams/${diagram.id}.mmd`] = E.mermaid(diagram);
  files['diagrams/architecture.drawio'] = `${E.drawio(graph.diagrams, { now })}\n`;
  for (const [folder, ext] of [['fragments', '.md'], ['diagrams', '.mmd']]) {
    const dir = join(out, folder);
    if (existsSync(dir)) for (const name of readdirSync(dir)) if (name.endsWith(ext) && !Object.hasOwn(files, `${folder}/${name}`) && statSync(join(dir, name)).isFile()) rmSync(join(dir, name));
  }
  for (const [name, body] of Object.entries(files)) writeText(join(out, name), body);
  return { out: jsonText({ out, files: Object.keys(files), gate: model.gate.label }) };
}

const TYPES = {
  null: (x) => x === null,
  boolean: (x) => typeof x === 'boolean',
  string: (x) => typeof x === 'string',
  number: (x) => typeof x === 'number' && Number.isFinite(x),
  integer: (x) => Number.isInteger(x),
  array: Array.isArray,
  object: isObject,
};
const SUBSCHEMAS = ['items', 'additionalProperties', 'not', 'if', 'then', 'else'];
export const SCHEMA_KEYWORDS = new Set(['$schema', 'title', 'description', '$defs', '$ref', 'type', 'const', 'enum', 'pattern', 'minLength', 'minimum', 'maximum', 'minItems', 'maxItems', 'uniqueItems', 'required', 'properties', 'minProperties', 'anyOf', ...SUBSCHEMAS]);
const schemas = {};
const patterns = {};

export function checkSchema(node, path = '#') {
  if (typeof node === 'boolean') return;
  if (!isObject(node)) throw new Error(`The schema at ${path} is not an object or a boolean.`);
  for (const [key, value] of Object.entries(node)) {
    if (!SCHEMA_KEYWORDS.has(key)) throw new Error(`The schema keyword "${key}" at ${path} is not one cli.mjs's schema checker implements; add it to the checker before a schema uses it.`);
    if (key === 'properties' || key === '$defs') for (const [name, sub] of Object.entries(value)) checkSchema(sub, `${path}/${key}/${name}`);
    else if (key === 'anyOf') value.forEach((sub, i) => checkSchema(sub, `${path}/anyOf/${i}`));
    else if (SUBSCHEMAS.includes(key)) checkSchema(value, `${path}/${key}`);
  }
}

function schemaOf(name) {
  if (!schemas[name]) {
    const schema = JSON.parse(readFileSync(join(studioDir, 'schema', name), 'utf8'));
    checkSchema(schema);
    schemas[name] = schema;
  }
  return schemas[name];
}

function pointer(root, ref) {
  if (!ref.startsWith('#')) throw new Error(`The schema reference ${ref} is not local.`);
  return ref.slice(1).split('/').filter(Boolean).map((p) => p.replace(/~1/g, '/').replace(/~0/g, '~')).reduce((node, key) => node[key], root);
}

function matches(root, schema, x) {
  const out = [];
  check(root, schema, x, '', out);
  return !out.length;
}

function check(root, schema, x, path, out) {
  if (schema === true) return;
  const fail = (message) => out.push(`${path || '(top level)'}: ${message}`);
  if (schema === false) return fail('is not allowed here');
  if (schema.$ref !== undefined) check(root, pointer(root, schema.$ref), x, path, out);
  if (schema.type !== undefined) {
    const types = [].concat(schema.type);
    if (!types.some((type) => TYPES[type](x))) return fail(`${show(x)} is not of type ${types.join(' or ')}`);
  }
  if ('const' in schema && canonical(x) !== canonical(schema.const)) fail(`${show(x)} is not ${show(schema.const)}`);
  if (schema.enum !== undefined && !schema.enum.some((e) => canonical(e) === canonical(x))) fail(`${show(x)} is not one of ${schema.enum.map(show).join(', ')}`);
  if (typeof x === 'string') {
    if (schema.minLength !== undefined && [...x].length < schema.minLength) fail(`${show(x)} is shorter than ${schema.minLength} characters`);
    if (schema.pattern !== undefined) {
      patterns[schema.pattern] ??= new RegExp(schema.pattern, 'u');
      if (!patterns[schema.pattern].test(x)) fail(`${show(x)} does not match ${schema.pattern}`);
    }
  }
  if (typeof x === 'number') {
    if (schema.minimum !== undefined && x < schema.minimum) fail(`${x} is less than the minimum of ${schema.minimum}`);
    if (schema.maximum !== undefined && x > schema.maximum) fail(`${x} is more than the maximum of ${schema.maximum}`);
  }
  if (Array.isArray(x)) {
    if (schema.minItems !== undefined && x.length < schema.minItems) fail(`holds ${x.length} items, fewer than ${schema.minItems}`);
    if (schema.maxItems !== undefined && x.length > schema.maxItems) fail(`holds ${x.length} items, more than ${schema.maxItems}`);
    if (schema.uniqueItems === true && new Set(x.map(canonical)).size < x.length) fail('holds the same item twice');
    if (schema.items !== undefined) x.forEach((y, i) => check(root, schema.items, y, `${path}/${i}`, out));
  }
  if (isObject(x)) {
    for (const key of schema.required ?? []) if (!Object.hasOwn(x, key)) fail(`is missing ${key}`);
    if (schema.minProperties !== undefined && Object.keys(x).length < schema.minProperties) fail(`holds fewer than ${schema.minProperties} keys`);
    const properties = schema.properties ?? {};
    for (const [key, y] of Object.entries(x)) {
      if (Object.hasOwn(properties, key)) check(root, properties[key], y, `${path}/${key}`, out);
      else if (schema.additionalProperties === false) fail(`holds ${key}, which is not allowed here`);
      else if (schema.additionalProperties !== undefined) check(root, schema.additionalProperties, y, `${path}/${key}`, out);
    }
  }
  if (schema.anyOf !== undefined && !schema.anyOf.some((s) => matches(root, s, x))) fail(`${show(x)} matches none of the allowed forms`);
  if (schema.not !== undefined && matches(root, schema.not, x)) fail(`${show(x)} takes a form that is not allowed`);
  if (schema.if !== undefined) {
    const branch = matches(root, schema.if, x) ? schema.then : schema.else;
    if (branch !== undefined) check(root, branch, x, path, out);
  }
}

function schemaProblems(name, doc) {
  const root = schemaOf(name);
  const out = [];
  check(root, root, doc, '', out);
  return out.length > 40 ? [...out.slice(0, 40), `and ${out.length - 40} more problems`] : out;
}

function schemaLines(name, doc, label) {
  const out = schemaProblems(name, doc);
  return out.length ? out.map((line) => `FAIL ${label}: ${line}`) : [`PASS ${label}: matches schema/${name}`];
}

function blueprintLines(doc, label) {
  if (doc.schema_version !== E.BLUEPRINT_SCHEMA_VERSION) return [`FAIL ${label}: the blueprint has schema_version ${show(doc.schema_version)}, and this engine reads schema ${E.BLUEPRINT_SCHEMA_VERSION}; compute the blueprint again from the project state (a Studio v2.2 blueprint is not a 3.0 blueprint).`];
  return schemaLines('architecture-blueprint.schema.json', doc, label);
}

function stateLines(state, now, label = 'state') {
  const result = normalized(state, now);
  if (result.lines) return [...result.lines.map((line) => `FAIL ${label} gate: ${line}`), ...schemaLines('project-state.schema.json', state, `${label} schema`).filter((line) => line.startsWith('FAIL'))];
  const notes = result.advisories.length ? `, after ${result.advisories.length} correction${result.advisories.length > 1 ? 's' : ''}: ${result.advisories.map((a) => a.msg).join(' ')}` : '';
  const raw = schemaProblems('project-state.schema.json', state);
  const fixed = schemaProblems('project-state.schema.json', result.state);
  const lines = [`PASS ${label} gate: it reads cleanly${notes}`];
  if (fixed.length) lines.push(...fixed.map((line) => `FAIL ${label} schema: ${line}`));
  else if (raw.length) lines.push(`PASS ${label} schema: the state after the gate's corrections matches schema/project-state.schema.json; the file as saved does not, as the NOTE lines say`, ...raw.map((line) => `NOTE ${label} schema, file as saved: ${line}`));
  else lines.push(`PASS ${label} schema: matches schema/project-state.schema.json`);
  try {
    const gate = E.compute(result.state, { now }).gate;
    lines.push(`PASS ${label} compute: gate ${gate.label}, ${gate.authorized ? 'authorized' : 'not authorized'} to start the SDD`);
  } catch (error) {
    lines.push(`FAIL ${label} compute: ${error.message}`);
  }
  return lines;
}

function kindOf(doc) {
  if (!isObject(doc)) return null;
  if (doc.kind === 'pre-sdd-project-state') return 'state';
  if (doc.kind === 'pre-sdd-save') return 'save';
  if (doc.schema_version !== undefined && (doc.architecture || doc.requirements)) return 'blueprint';
  if (isObject(doc.inputs) || (isObject(doc.project_state) && isObject(doc.project_state.inputs))) return 'v22';
  return null;
}

function saveLines(doc, now) {
  let save;
  try {
    save = E.readSave(doc);
  } catch (error) {
    return [`FAIL save: ${error.message}`];
  }
  const lines = stateLines(save.state, now, 'project state');
  if (!isObject(save.blueprint)) lines.push('FAIL blueprint: the save file holds no blueprint; save again from the Studio.');
  else lines.push(...blueprintLines(save.blueprint, 'blueprint schema'));
  return lines;
}

function v22Lines(doc, now) {
  try {
    const state = E.importV22(doc, { now, name: 'Studio v2.2 import check', slug: 'v22-import-check' });
    const ids = state.unknowns.map((u) => u.id);
    return [`PASS import: it reads as a Pre-SDD 3.0 project state${ids.length ? ` with ${ids.length} unknown${ids.length > 1 ? 's' : ''} to answer (${ids.join(', ')})` : ''}; the v2.2 decision history and approvals do not come in`];
  } catch (error) {
    return [`FAIL import: ${error.message}`];
  }
}

function fileLines(path, now) {
  let doc;
  try {
    doc = readJson(path);
  } catch (error) {
    return [`FAIL file: ${error.message}`];
  }
  const kind = kindOf(doc);
  if (kind === 'state') return ['PASS kind: a Pre-SDD 3.0 project state', ...stateLines(doc, now)];
  if (kind === 'save') return ['PASS kind: a Studio save file', ...saveLines(doc, now)];
  if (kind === 'v22') return ['PASS kind: a Studio v2.2 project file', ...v22Lines(doc, now)];
  if (kind === 'blueprint') return ['PASS kind: an architecture blueprint', ...blueprintLines(doc, 'blueprint schema')];
  return ['FAIL kind: this JSON is none of the four kinds: a Pre-SDD 3.0 project state (kind pre-sdd-project-state), a Studio save file (kind pre-sdd-save), a Studio v2.2 project file (with inputs), or an architecture blueprint (with schema_version and architecture).'];
}

export function pickSavedState(entries, slug, sinceIso) {
  const since = Date.parse(sinceIso);
  const pattern = new RegExp(`^pre-sdd-${String(slug).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-state-(\\d{8}T\\d{6}Z)(?: \\((\\d+)\\))?\\.json$`);
  const time = (x) => (x instanceof Date ? x.getTime() : typeof x === 'number' ? x : Date.parse(x));
  let best = null;
  for (const entry of entries) {
    const m = pattern.exec(entry.name);
    const t = time(entry.mtime);
    if (!m || !(t > since)) continue;
    const key = [t, m[1], Number(m[2] ?? 0)];
    if (!best || key[0] > best.key[0] || (key[0] === best.key[0] && (key[1] > best.key[1] || (key[1] === best.key[1] && key[2] > best.key[2])))) best = { name: entry.name, key };
  }
  return best ? best.name : null;
}

function cmdValidate(argv) {
  const { values, positionals, now } = args('validate', argv, { pick: { type: 'string' }, slug: { type: 'string' }, since: { type: 'string' } }, [0, 1]);
  const picking = values.pick !== undefined;
  if (picking === (positionals.length === 1)) throw usage('validate', 'validate takes a file, or --pick with --slug and --since; give exactly one of the two.');
  if (picking && (values.slug === undefined || values.since === undefined)) throw usage('validate', '--pick needs --slug and --since.');
  if (!picking && (values.slug !== undefined || values.since !== undefined)) throw usage('validate', '--slug and --since go with --pick.');
  const lines = [];
  let file = positionals[0] && resolve(positionals[0]);
  if (picking) {
    const folder = resolve(values.pick);
    const since = utcTime('validate', '--since', values.since);
    const entries = existsSync(folder) && statSync(folder).isDirectory() ? readdirSync(folder, { withFileTypes: true }).filter((d) => d.isFile()).map((d) => ({ name: d.name, mtime: statSync(join(folder, d.name)).mtime })) : [];
    const name = pickSavedState(entries, values.slug, since);
    if (!name) throw new Exit(2, '', `FAIL pick: no file named pre-sdd-${values.slug}-state-<YYYYMMDDTHHMMSSZ>.json (or with " (N)" added) in ${folder} was saved after ${since}; save again from the Studio, then run this again.\n`);
    file = join(folder, name);
    lines.push(`PICKED ${file}`);
  }
  lines.push(...fileLines(file, now));
  const text = `${lines.join('\n')}\n`;
  if (lines.some((line) => line.startsWith('FAIL'))) throw new Exit(2, '', text);
  return { out: text };
}

function cmdUnwrap(argv) {
  const { positionals, now } = args('unwrap', argv, {}, [2]);
  const file = resolve(positionals[0]);
  const dir = resolve(positionals[1]);
  let save;
  try {
    save = E.readSave(readJson(file, 'The save file'));
  } catch (error) {
    throw error instanceof Exit ? error : invalid(`${file}: ${error.message}`);
  }
  const result = normalized(save.state, now);
  if (result.lines) throw invalid(`${file}: its project state cannot be read:\n${result.lines.map((line) => `- ${line}`).join('\n')}`);
  if (!isObject(save.blueprint)) throw invalid(`${file} holds no blueprint; save again from the Studio.`);
  const problems = blueprintLines(save.blueprint, 'blueprint schema').filter((line) => line.startsWith('FAIL'));
  if (problems.length) throw invalid(`${file}: its blueprint does not match the schema:\n${problems.join('\n')}`);
  const stateFile = join(dir, 'project-state.json');
  const blueprintFile = join(dir, 'studio-blueprint.json');
  writeText(stateFile, jsonText(result.state));
  writeText(blueprintFile, jsonText(save.blueprint));
  return { out: jsonText({ state: stateFile, blueprint: blueprintFile, notes: result.advisories.map((a) => a.msg) }) };
}

function diffValues(a, b, path, out) {
  if (canonical(a) === canonical(b)) return;
  const keyed = (xs) => xs.every((x) => isObject(x) && typeof x.id === 'string') && new Set(xs.map((x) => x.id)).size === xs.length;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (keyed(a) && keyed(b)) for (const id of new Set([...a.map((x) => x.id), ...b.map((x) => x.id)])) diffValues(a.find((x) => x.id === id), b.find((x) => x.id === id), `${path}[${id}]`, out);
    else for (let i = 0; i < Math.max(a.length, b.length); i++) diffValues(a[i], b[i], `${path}[${i}]`, out);
    return;
  }
  if (isObject(a) && isObject(b)) {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) diffValues(a[key], b[key], `${path}.${key}`, out);
    return;
  }
  out.push(`${path}: ${show(a)} in a, ${show(b)} in b`);
}

function cmdDiff(argv) {
  const { positionals } = args('diff', argv, {}, [2]);
  const [a, b] = positionals.map((p) => {
    const path = resolve(p);
    const doc = readJson(path, 'The blueprint');
    if (kindOf(doc) !== 'blueprint') throw invalid(`${path} is not an architecture blueprint${kindOf(doc) === 'save' ? '; run unwrap on the save file first and diff its studio-blueprint.json' : ''}.`);
    return doc;
  });
  const out = [];
  for (const part of DIFF_PARTS) {
    const strip = (doc) => (part === 'validation' && isObject(doc.validation) ? { ...doc.validation, checked_at: undefined } : doc[part]);
    diffValues(strip(a), strip(b), part, out);
  }
  if (out.length) throw new Exit(1, '', `${out.join('\n')}\n`);
  return { out: `No differences in the calculations, rules, validation, scopes, shape, options and gate.\n` };
}

function cmdEmbed(argv) {
  const { values, positionals, now } = args('embed', argv, { out: { type: 'string' } }, [1]);
  if (values.out === undefined) throw usage('embed', 'embed needs --out <file.html>.');
  const { state } = loadState(resolve(positionals[0]), now);
  const out = resolve(values.out);
  writeText(out, buildStudio({ srcDir: join(studioDir, 'src'), state }));
  return { out: jsonText({ out }) };
}

function cmdVersion(argv) {
  args('version', argv, {}, [0]);
  return { out: `engine ${E.ENGINE_VERSION}, skill ${E.SKILL_VERSION}\n` };
}

const COMMANDS = { new: cmdNew, derive: cmdDerive, compute: cmdCompute, validate: cmdValidate, unwrap: cmdUnwrap, diff: cmdDiff, embed: cmdEmbed, '--version': cmdVersion };

export function main(argv, io = { out: (t) => process.stdout.write(t), err: (t) => process.stderr.write(t) }) {
  const [command, ...rest] = argv;
  try {
    if (!Object.hasOwn(COMMANDS, command ?? '')) throw usage(null, command === undefined ? 'Give a command.' : `Unknown command ${JSON.stringify(command)}.`);
    const { out } = COMMANDS[command](rest);
    io.out(out);
    return 0;
  } catch (error) {
    if (!(error instanceof Exit)) {
      io.err(`${error.message}\n`);
      return 2;
    }
    if (error.out) io.out(error.out);
    if (error.message) io.err(`${error.message}\n`);
    return error.code;
  }
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
