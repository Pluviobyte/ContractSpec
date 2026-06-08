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
  "test-contract.md",
];

function usage() {
  console.log(`ContractSpec

Usage:
  contractspec validate [path]
  contractspec init [project-path]

Examples:
  node bin/contractspec.js validate .
  node bin/contractspec.js validate examples/create-task
  node bin/contractspec.js init /path/to/project
`);
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
    for (const id of ["proposal", "product", "domain", "data", "api", "errors", "ui-flow", "ui-states", "specs", "design", "tests", "verification", "tasks"]) {
      pushIfMissing(errors, schema.includes(`id: ${id}`), `Schema missing artifact id: ${id}`);
    }
    pushIfMissing(errors, schema.includes("apply:"), "Schema missing apply configuration");
    pushIfMissing(errors, schema.includes("tracks: tasks.md"), "Schema apply config must track tasks.md");
  }

  return errors;
}

function isChangeDir(target) {
  return exists(path.join(target, "proposal.md")) && isDir(path.join(target, "contracts"));
}

function discoverChangeDirs(target) {
  const changes = [];
  const resolved = path.resolve(target);

  if (isChangeDir(resolved)) {
    changes.push(resolved);
    return changes;
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

  return [...new Set(changes)];
}

function validateChange(changeDir) {
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

  const tasksFile = path.join(changeDir, "tasks.md");
  if (exists(tasksFile)) {
    const tasks = read(tasksFile);
    pushIfMissing(errors, /- \[[ xX]\] \d+\.\d+/.test(tasks), `${rel}: tasks.md must use - [ ] X.Y checkbox tasks`);
    if (/backend/i.test(tasks) && /frontend/i.test(tasks) && !/vertical|slice|end-to-end/i.test(tasks)) {
      warnings.push(`${rel}: tasks mention frontend/backend but not vertical slices`);
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
      warnings.push(`${path.relative(process.cwd(), file)}: placeholder text remains`);
    }
  }

  const proposalFile = path.join(changeDir, "proposal.md");
  if (exists(proposalFile) && specFiles.length > 0) {
    const proposal = read(proposalFile);
    const capabilityMatches = [...proposal.matchAll(/^- ([a-z][a-z0-9-]*)$/gm)].map((match) => match[1]);
    for (const capability of capabilityMatches.filter((item) => item !== "None")) {
      const expected = path.join(changeDir, "specs", capability, "spec.md");
      if (!exists(expected)) {
        warnings.push(`${rel}: proposal capability "${capability}" has no specs/${capability}/spec.md`);
      }
    }
  }

  return { errors, warnings };
}

function validate(target) {
  const errors = [];
  const warnings = [];

  errors.push(...validateSchemaBundle(packageRoot));

  const changeDirs = discoverChangeDirs(target);
  if (changeDirs.length === 0) {
    warnings.push(`${path.resolve(target)}: no ContractSpec change folders found`);
  }

  for (const changeDir of changeDirs) {
    const result = validateChange(changeDir);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  console.log("ContractSpec validation");
  console.log(`Schema: ${errors.length === 0 ? "ok" : "checked with errors"}`);
  console.log(`Changes: ${changeDirs.length}`);

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
  ContractSpec workflow: align product, domain, data, API, errors, UI states, tests, and verification before implementation.
`,
    );
    console.log(`Created config: ${configFile}`);
  } else {
    console.log(`Config exists: ${configFile}`);
    console.log("Set schema: contract-spec if it is not already configured.");
  }
}

const [command, target] = process.argv.slice(2);

if (!command || command === "help" || command === "--help" || command === "-h") {
  usage();
} else if (command === "validate") {
  validate(target || ".");
} else if (command === "init") {
  initProject(target || ".");
} else {
  console.error(`Unknown command: ${command}`);
  usage();
  process.exitCode = 1;
}
