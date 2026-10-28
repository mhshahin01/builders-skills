import { spawnSync } from 'node:child_process';

const checker = [
  'import json, sys',
  'import jsonschema',
  "schema = json.load(open(sys.argv[1], encoding='utf-8'))",
  'jsonschema.Draft202012Validator.check_schema(schema)',
  'validator = jsonschema.Draft202012Validator(schema)',
  "docs = json.loads(sys.stdin.buffer.read().decode('utf-8'))",
  "rows = lambda doc: [{'path': '/'.join(str(p) for p in e.absolute_path), 'message': e.message} for e in validator.iter_errors(doc)]",
  "print(json.dumps([sorted(rows(doc), key=lambda r: (r['path'], r['message'])) for doc in docs]))",
].join('\n');

export function pythonCommand(platform = process.platform) {
  return platform === 'win32' ? ['py', '-3', '-I'] : ['python3', '-I'];
}

export function runPython(args, input) {
  const [command, ...flags] = pythonCommand();
  const run = spawnSync(command, [...flags, ...args], { input, encoding: 'utf8', windowsHide: true });
  if (run.error?.code === 'ENOENT') return { skipped: `Python 3 not found (${[command, ...flags].join(' ')}), so this schema check did not run` };
  if (run.error) throw run.error;
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

export function validateAllWithSchema(schemaPath, values) {
  const run = runPython(['-c', checker, schemaPath], JSON.stringify(values));
  if (run.skipped) return run;
  if (run.status !== 0) throw new Error(`jsonschema check exited ${run.status}: ${run.stderr.trim()}`);
  return { errors: JSON.parse(run.stdout) };
}

export function validateWithSchema(schemaPath, value) {
  const result = validateAllWithSchema(schemaPath, [value]);
  return result.skipped ? result : { errors: result.errors[0] };
}

const auditor = [
  'import importlib.util, json, sys',
  'from pathlib import Path',
  "spec = importlib.util.spec_from_file_location('validate_handoff', sys.argv[1])",
  'module = importlib.util.module_from_spec(spec)',
  'spec.loader.exec_module(module)',
  'schema = module.load_schema()',
  "docs = json.loads(sys.stdin.buffer.read().decode('utf-8'))",
  "flags = json.loads(sys.argv[3])",
  "out = [dict(zip(('failures', 'warnings'), module.audit(doc, schema, Path(sys.argv[2]), flags.get('require_approved', False), flags.get('require_sdd_intake', False)))) for doc in docs]",
  'print(json.dumps(out))',
].join('\n');

export function runValidator(validatorPath, jsonPath, flags = []) {
  return runPython([validatorPath, jsonPath, ...flags]);
}

export function auditBlueprints(validatorPath, docs, root, flags = {}) {
  const run = runPython(['-c', auditor, validatorPath, root, JSON.stringify(flags)], JSON.stringify(docs));
  if (run.skipped) return run;
  if (run.status !== 0) throw new Error(`validate_handoff audit exited ${run.status}: ${run.stderr.trim()}`);
  return { results: JSON.parse(run.stdout) };
}
