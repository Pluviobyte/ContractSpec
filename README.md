# ContractSpec

OpenSpec-compatible, contract-first, test-driven, AI-safe workflow for full-stack development.

ContractSpec is not an OpenSpec fork and not a full-stack framework. It is an OpenSpec schema bundle plus a validator that adds cross-layer contracts, executable bindings, TDD gates, and verification evidence to AI coding workflows.

## What It Solves

AI coding agents drift when product intent, APIs, errors, UI states, and tests live only in chat:

- Frontend invents fields the backend does not return.
- Backend implements states the UI never exposes.
- Error formats differ across layers.
- Tests cover only the happy path.
- AI writes implementation first, then generates tests that merely mirror the implementation.

ContractSpec keeps frontend, backend, tests, and AI agents aligned on one change-local contract pack.

## Relationship With OpenSpec

OpenSpec owns the lifecycle.

ContractSpec owns full-stack contract consistency.

```text
OpenSpec:
  explore -> propose/new -> continue/ff -> apply -> verify/sync -> archive

ContractSpec:
  product -> domain -> data -> api -> errors -> ui -> bindings -> tests -> verification
```

OpenSpec keeps `openspec/specs/` as the source of truth for current behavior. ContractSpec contracts live inside an active change and constrain that change. After archive, long-term truth should live in `openspec/specs/` plus executable schema, code, and tests.

## Core Flow

```text
Spec First
  -> Contract First
  -> Binding First
  -> Test First
  -> Implementation
  -> Verification
  -> Archive
```

## Artifact Flow

```text
proposal
  -> product
  -> domain
  -> data
  -> api
  -> errors
  -> ui-flow
  -> ui-states
  -> bindings
  -> specs
  -> design
  -> test-contract
  -> verification
  -> tasks
  -> apply
  -> archive
```

Each OpenSpec change should contain:

```text
openspec/changes/<change-name>/
  proposal.md
  contracts/
    product.md
    domain.md
    data-model.md
    api.md
    errors.md
    ui-flow.md
    ui-states.md
    bindings.md
    test-contract.md
  specs/
    <capability>/spec.md
  design.md
  tasks.md
  verification.md
```

## Executable Bindings

`contracts/bindings.md` is the key v0.2 addition. It maps Markdown contracts to real engineering artifacts:

```text
API Contract       -> OpenAPI, routes, request schemas, generated clients
Data Contract      -> Zod, Prisma, SQL, shared TypeScript types
Error Contract     -> shared error types, backend error mappers
UI State Contract  -> state machines, components, client mutations
Test Contract      -> API tests, component tests, E2E tests
Verification       -> commands, CI, evidence logs
```

Without bindings, contracts are good documentation. With bindings, contracts become engineering constraints.

## Gates

### Contract Gate

All contract files exist and define product, domain, data, API, errors, UI states, bindings, and tests.

### Binding Gate

Every contract maps to executable schema, code, tests, mocks, generated clients, or planned files.

### Failing Test Gate

Tests are written from `contracts/test-contract.md` before implementation. They should fail before the feature exists.

### Implementation Gate

AI implements vertical slices. It must not silently change contracts, fields, API paths, errors, or UI states.

### Verification Gate

`verification.md` records real commands, evidence, warnings, gaps, and results.

## Rules For AI Agents

- Do not invent API fields.
- Do not invent UI states.
- Do not silently change error formats.
- Do not implement first and then write tests that merely mirror the implementation.
- If implementation reveals a contract gap, update contracts, specs, design, and test-contract first.
- Mark tasks complete only after implementation and relevant verification.

Tests are executable contracts.

## Quick Start

Install and initialize OpenSpec first:

```bash
npm install -g @fission-ai/openspec@latest
cd your-project
openspec init
openspec config profile
openspec update
```

Install the ContractSpec schema into your project:

```bash
git clone https://github.com/Pluviobyte/ContractSpec.git
cd ContractSpec
node bin/contractspec.js init /path/to/your-project
```

Set `openspec/config.yaml` to use:

```yaml
schema: contract-spec
context: |
  This project uses ContractSpec for contract-first AI full-stack development.
  openspec/specs is the source of truth for current behavior.
  contracts/ inside a change define cross-layer constraints for that change.
  contracts/bindings.md maps contracts to executable schema, code, tests, mocks, and evidence.
  Tests are executable contracts.
```

## Usage

For complex full-stack work, prefer the expanded OpenSpec workflow:

```text
/opsx:explore create task
/opsx:new create-task --schema contract-spec
/opsx:continue create-task
/opsx:continue create-task
/opsx:apply create-task
/opsx:verify create-task
/opsx:sync create-task
/opsx:archive create-task
```

For clearer smaller work:

```text
/opsx:new create-task --schema contract-spec
/opsx:ff create-task
/opsx:apply create-task
```

## CLI

```bash
node bin/contractspec.js validate .
node bin/contractspec.js validate . --change create-task
node bin/contractspec.js validate . --strict
node bin/contractspec.js check-bindings .
node bin/contractspec.js doctor .
node bin/contractspec.js init /path/to/project
```

The validator checks:

- Schema bundle and templates exist.
- Required contract files exist, including `contracts/bindings.md`.
- API contract includes endpoint, auth, request, response, errors, and compatibility.
- Error contract includes code, message, validation, and auth concepts.
- UI state contract covers loading, empty, success, and error.
- Specs contain requirements and `#### Scenario:` blocks.
- Tasks use checkbox format and should be vertical slices.
- Bindings map contracts to executable files, generated files, tests, mocks, or evidence.
- Verification records commands, evidence, and results.

## When To Use ContractSpec

Use full ContractSpec for:

- Full-stack features.
- API changes.
- Forms with validation and error states.
- Auth, billing, permissions, orders, workflows, or state machines.
- Cross-repo or cross-layer changes.
- Any feature where AI is likely to infer missing details.

For tiny copy or visual-only changes, OpenSpec's default workflow is usually enough.

## Roadmap

```text
v0.2  Bindings layer, schema v2, validator support
v0.3  Strict validator, requirement-to-test mapping, stronger binding checks
v0.4  TDD workflow, failing-test gate, test stub generation
v0.5  OpenAPI/Zod/MSW adapters and GitHub Action
v1.0  Stable npm package, CI enforcement, real stack examples
```

## Status

Alpha. This repository is ready for experimentation and internal workflow use. Production adoption should pair ContractSpec with executable schemas, shared types, contract tests, E2E tests, and CI.

## License

MIT
