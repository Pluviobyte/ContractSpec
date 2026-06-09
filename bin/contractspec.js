#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");

const requiredTemplates = [
  "proposal.md",
  "product.md",
  "domain.md",
  "data-model.md",
  "api.md",
  "errors.md",
  "ui-flow.md",
  "ui-states.md",
  "bindings.md",
  "spec.md",
  "design.md",
  "test-contract.md",
  "tasks.md",
  "verification.md",
];

const requiredContracts = [
  "product.md",
  "domain.md",
  "data-model.md",
  "api.md",
  "errors.md",
  "ui-flow.md",
  "ui-states.md",
  "bindings.md",
  "test-contract.md",
];

function usage() {
  console.log(`ContractSpec

Usage:
  contractspec validate [path] [--change <name>] [--strict]
  contractspec check-bindings [path] [--change <name>] [--strict]
  contractspec doctor [path]
  contractspec init [project-path]

Examples:
  node bin/contractspec.js validate .
  node bin/contractspec.js validate . --change create-task
  node bin/contractspec.js validate . --strict
  node bin/contractspec.js check-bindings examples/create-task
  node bin/contractspec.js validate examples/create-task
  node bin/contractspec.js init /path/to/project
`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {
    command,
    target: ".",
    change: null,
    strict: false,
  };

  let targetSet = false;
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === "--strict") {
      options.strict = true;
    } else if (arg === "--change") {
      options.change = rest[index + 1];
      index += 1;
    } else if (arg.startsWith("--change=")) {
      options.change = arg.slice("--change=".length);
    } else if (!arg.startsWith("-") && !targetSet) {
      options.target = arg;
      targetSet = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function exists(target) {
  return fs.existsSync(target);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function isDir(target) {
  return exists(target) && fs.statSync(target).isDirectory();
}

function listDirs(target) {
  if (!isDir(target)) return [];
  return fs
    .readdirSync(target, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(target, entry.name));
}

function listMarkdownFiles(target) {
  if (!isDir(target)) return [];
  const output = [];
  const stack = [target];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        output.push(full);
      }
    }
  }
  return output;
}

function pushIfMissing(errors, condition, message) {
  if (!condition) errors.push(message);
}

function validateSchemaBundle(root) {
  const errors = [];
  const schemaDir = path.join(root, "schemas", "contract-spec");
  const templateDir = path.join(schemaDir, "templates");
  const schemaFile = path.join(schemaDir, "schema.yaml");

  pushIfMissing(errors, exists(schemaFile), "Missing schemas/contract-spec/schema.yaml");
  for (const template of requiredTemplates) {
    pushIfMissing(
      errors,
      exists(path.join(templateDir, template)),
      `Missing schema template: schemas/contract-spec/templates/${template}`,
    );
  }

  if (exists(schemaFile)) {
    const schema = read(schemaFile);
    for (const id of ["proposal", "product", "domain", "data", "api", "errors", "ui-flow", "ui-states", "bindings", "specs", "design", "test-contract", "verification", "tasks"]) {
      pushIfMissing(errors, schema.includes(`id: ${id}`), `Schema missing artifact id: ${id}`);
    }
    pushIfMissing(errors, /version:\s*2/.test(schema), "Schema version must be 2 for bindings support");
    pushIfMissing(errors, schema.includes("apply:"), "Schema missing apply configuration");
    pushIfMissing(errors, schema.includes("tracks: tasks.md"), "Schema apply config must track tasks.md");
  }

  return errors;
}

function isChangeDir(target) {
  return exists(path.join(target, "proposal.md")) && isDir(path.join(target, "contracts"));
}

function discoverChangeDirs(target, changeName = null) {
  const changes = [];
  const resolved = path.resolve(target);

  if (isChangeDir(resolved)) {
    changes.push(resolved);
    return filterChangeDirs(changes, changeName);
  }

  const openspecChanges = path.join(resolved, "openspec", "changes");
  for (const change of listDirs(openspecChanges)) {
    if (!change.includes(`${path.sep}archive${path.sep}`) && isChangeDir(change)) {
      changes.push(change);
    }
  }

  const examples = path.join(resolved, "examples");
  if (isDir(examples)) {
    const stack = [examples];
    while (stack.length > 0) {
      const dir = stack.pop();
      if (isChangeDir(dir)) {
        changes.push(dir);
        continue;
      }
      for (const child of listDirs(dir)) {
        const base = path.basename(child);
        if (base !== ".git" && base !== "node_modules" && base !== "archive") {
          stack.push(child);
        }
      }
    }
  }

  return filterChangeDirs([...new Set(changes)], changeName);
}

function filterChangeDirs(changeDirs, changeName) {
  if (!changeName) return changeDirs;
  return changeDirs.filter((changeDir) => path.basename(changeDir) === changeName);
}

function asIssueTarget(strict, errors, warnings) {
  return strict ? errors : warnings;
}

function extractBindingRefs(text) {
  const refs = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*-\s*(planned|existing):\s+(.+?)\s*$/i);
    if (!match) continue;
    const status = match[1].toLowerCase();
    const value = match[2].trim();
    refs.push({ status, value });
  }
  return refs;
}

function looksLikeFileRef(value) {
  if (/\s/.test(value)) return false;
  if (/^(npm|pnpm|yarn|bun|go|cargo|pytest|python|node)\b/.test(value)) return false;
  return value.includes("/") || /\.[a-z0-9]+$/i.test(value);
}

function validateBindings(changeDir, options = {}) {
  const { strict = false } = options;
  const errors = [];
  const warnings = [];
  const rel = path.relative(process.cwd(), changeDir) || ".";
  const bindingsFile = path.join(changeDir, "contracts", "bindings.md");

  if (!exists(bindingsFile)) {
    errors.push(`${rel}: missing contracts/bindings.md`);
    return { errors, warnings };
  }

  const text = read(bindingsFile);
  for (const heading of ["API Binding", "Data Binding", "Error Binding", "UI Flow / State Binding", "Test Binding", "Verification Binding"]) {
    pushIfMissing(errors, text.includes(`## ${heading}`), `${rel}: contracts/bindings.md missing ${heading}`);
  }

  const lower = text.toLowerCase();
  for (const contract of ["contracts/api.md", "contracts/data-model.md", "contracts/errors.md", "contracts/ui-flow.md", "contracts/ui-states.md", "contracts/test-contract.md"]) {
    pushIfMissing(errors, lower.includes(contract), `${rel}: contracts/bindings.md missing ${contract}`);
  }

  const refs = extractBindingRefs(text).filter((ref) => looksLikeFileRef(ref.value));
  if (refs.length === 0) {
    errors.push(`${rel}: contracts/bindings.md has no executable file bindings`);
  }

  for (const ref of refs) {
    if (ref.value.includes("<") || ref.value.includes(">")) {
      asIssueTarget(strict, errors, warnings).push(`${rel}: unresolved binding placeholder ${ref.value}`);
      continue;
    }
    if (ref.status === "existing") {
      const target = path.resolve(changeDir, "..", "..", "..", ref.value);
      if (!exists(target)) {
        asIssueTarget(strict, errors, warnings).push(`${rel}: existing binding target not found: ${ref.value}`);
      }
    }
  }

  return { errors, warnings };
}

function validateChange(changeDir, options = {}) {
  const { strict = false } = options;
  const errors = [];
  const warnings = [];
  const rel = path.relative(process.cwd(), changeDir) || ".";

  for (const file of ["proposal.md", "design.md", "tasks.md", "verification.md"]) {
    pushIfMissing(errors, exists(path.join(changeDir, file)), `${rel}: missing ${file}`);
  }

  for (const contract of requiredContracts) {
    pushIfMissing(errors, exists(path.join(changeDir, "contracts", contract)), `${rel}: missing contracts/${contract}`);
  }

  const specsDir = path.join(changeDir, "specs");
  const specFiles = listMarkdownFiles(specsDir);
  pushIfMissing(errors, specFiles.length > 0, `${rel}: missing specs/**/*.md`);

  for (const specFile of specFiles) {
    const spec = read(specFile);
    const specRel = path.relative(process.cwd(), specFile);
    pushIfMissing(
      errors,
      /## (ADDED|MODIFIED|REMOVED|RENAMED) Requirements/.test(spec),
      `${specRel}: missing delta requirements section`,
    );
    pushIfMissing(errors, /### Requirement:/.test(spec), `${specRel}: missing ### Requirement`);
    pushIfMissing(errors, /#### Scenario:/.test(spec), `${specRel}: scenarios must use #### Scenario`);
  }

  const apiFile = path.join(changeDir, "contracts", "api.md");
  if (exists(apiFile)) {
    const api = read(apiFile).toLowerCase();
    for (const word of ["endpoint", "auth", "request", "response", "errors", "compatibility"]) {
      pushIfMissing(errors, api.includes(word), `${rel}: contracts/api.md missing ${word}`);
    }
  }

  const uiStatesFile = path.join(changeDir, "contracts", "ui-states.md");
  if (exists(uiStatesFile)) {
    const ui = read(uiStatesFile).toLowerCase();
    for (const state of ["loading", "empty", "success", "error"]) {
      pushIfMissing(errors, ui.includes(state), `${rel}: contracts/ui-states.md missing ${state} state`);
    }
  }

  const errorsFile = path.join(changeDir, "contracts", "errors.md");
  if (exists(errorsFile)) {
    const text = read(errorsFile).toLowerCase();
    for (const word of ["code", "message", "validation_error", "unauthorized"]) {
      pushIfMissing(errors, text.includes(word), `${rel}: contracts/errors.md missing ${word}`);
    }
  }

  const bindingsResult = validateBindings(changeDir, { strict });
  errors.push(...bindingsResult.errors);
  warnings.push(...bindingsResult.warnings);

  const tasksFile = path.join(changeDir, "tasks.md");
  if (exists(tasksFile)) {
    const tasks = read(tasksFile);
    pushIfMissing(errors, /- \[[ xX]\] \d+\.\d+/.test(tasks), `${rel}: tasks.md must use - [ ] X.Y checkbox tasks`);
    if (/backend/i.test(tasks) && /frontend/i.test(tasks) && !/vertical|slice|end-to-end/i.test(tasks)) {
      asIssueTarget(strict, errors, warnings).push(`${rel}: tasks mention frontend/backend but not vertical slices`);
    }
    if (strict && !/test|verification|evidence/i.test(tasks)) {
      errors.push(`${rel}: strict mode requires tasks to include test or verification work`);
    }
  }

  const verificationFile = path.join(changeDir, "verification.md");
  if (exists(verificationFile)) {
    const verification = read(verificationFile).toLowerCase();
    for (const word of ["commands", "evidence", "results"]) {
      pushIfMissing(errors, verification.includes(word), `${rel}: verification.md missing ${word}`);
    }
  }

  const filesToScan = [
    path.join(changeDir, "proposal.md"),
    path.join(changeDir, "design.md"),
    path.join(changeDir, "tasks.md"),
    path.join(changeDir, "verification.md"),
    ...listMarkdownFiles(path.join(changeDir, "contracts")),
    ...specFiles,
  ];
  for (const file of filesToScan.filter(exists)) {
    const text = read(file);
    if (/(<todo>|TBD|TODO:|unexplained N\/A)/i.test(text)) {
      asIssueTarget(strict, errors, warnings).push(`${path.relative(process.cwd(), file)}: placeholder text remains`);
    }
  }

  const proposalFile = path.join(changeDir, "proposal.md");
  if (exists(proposalFile) && specFiles.length > 0) {
    const proposal = read(proposalFile);
    const capabilityMatches = [...proposal.matchAll(/^- ([a-z][a-z0-9-]*)$/gm)].map((match) => match[1]);
    for (const capability of capabilityMatches.filter((item) => item !== "None")) {
      const expected = path.join(changeDir, "specs", capability, "spec.md");
      if (!exists(expected)) {
        asIssueTarget(strict, errors, warnings).push(`${rel}: proposal capability "${capability}" has no specs/${capability}/spec.md`);
      }
    }
  }

  return { errors, warnings };
}

function validate(options) {
  const errors = [];
  const warnings = [];

  errors.push(...validateSchemaBundle(packageRoot));

  const changeDirs = discoverChangeDirs(options.target, options.change);
  if (changeDirs.length === 0) {
    const message = options.change
      ? `${path.resolve(options.target)}: ContractSpec change not found: ${options.change}`
      : `${path.resolve(options.target)}: no ContractSpec change folders found`;
    (options.change ? errors : warnings).push(message);
  }

  for (const changeDir of changeDirs) {
    const result = validateChange(changeDir, { strict: options.strict });
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  console.log("ContractSpec validation");
  console.log(`Schema: ${errors.length === 0 ? "ok" : "checked with errors"}`);
  console.log(`Changes: ${changeDirs.length}`);
  console.log(`Mode: ${options.strict ? "strict" : "default"}`);

  for (const warning of warnings) {
    console.log(`WARN ${warning}`);
  }
  for (const error of errors) {
    console.error(`ERROR ${error}`);
  }

  if (errors.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log("OK");
}

function checkBindings(options) {
  const errors = [];
  const warnings = [];
  const changeDirs = discoverChangeDirs(options.target, options.change);

  if (changeDirs.length === 0) {
    errors.push(`${path.resolve(options.target)}: no ContractSpec change folders found`);
  }

  for (const changeDir of changeDirs) {
    const result = validateBindings(changeDir, { strict: options.strict });
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  console.log("ContractSpec binding check");
  console.log(`Changes: ${changeDirs.length}`);
  console.log(`Mode: ${options.strict ? "strict" : "default"}`);

  for (const warning of warnings) {
    console.log(`WARN ${warning}`);
  }
  for (const error of errors) {
    console.error(`ERROR ${error}`);
  }

  if (errors.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log("OK");
}

function doctor(options) {
  validate({ ...options, strict: false });
  console.log("");
  checkBindings({ ...options, strict: false });
}

function initProject(target) {
  const project = path.resolve(target || ".");
  fs.mkdirSync(path.join(project, "openspec", "schemas"), { recursive: true });

  const source = path.join(packageRoot, "schemas", "contract-spec");
  const destination = path.join(project, "openspec", "schemas", "contract-spec");

  if (exists(destination)) {
    console.log(`Schema already exists: ${destination}`);
  } else {
    fs.cpSync(source, destination, { recursive: true });
    console.log(`Installed schema: ${destination}`);
  }

  const configFile = path.join(project, "openspec", "config.yaml");
  if (!exists(configFile)) {
    fs.writeFileSync(
      configFile,
      `schema: contract-spec
context: |
  ContractSpec workflow: align product, domain, data, API, errors, UI states, executable bindings, tests, and verification before implementation.
  openspec/specs is the source of truth for current behavior.
  contracts/ inside a change define cross-layer constraints for that change.
  contracts/bindings.md maps Markdown contracts to executable schema, code, tests, mocks, and evidence.
  Tests are executable contracts.
`,
    );
    console.log(`Created config: ${configFile}`);
  } else {
    console.log(`Config exists: ${configFile}`);
    console.log("Set schema: contract-spec if it is not already configured.");
  }
}

let parsed;
try {
  parsed = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  usage();
  process.exitCode = 1;
}

if (!parsed) {
  // parse error already reported
} else if (!parsed.command || parsed.command === "help" || parsed.command === "--help" || parsed.command === "-h") {
  usage();
} else if (parsed.command === "validate") {
  validate(parsed);
} else if (parsed.command === "check-bindings") {
  checkBindings(parsed);
} else if (parsed.command === "doctor") {
  doctor(parsed);
} else if (parsed.command === "init") {
  initProject(parsed.target || ".");
} else {
  console.error(`Unknown command: ${parsed.command}`);
  usage();
  process.exitCode = 1;
}
