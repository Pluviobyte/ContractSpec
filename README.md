# ContractSpec

OpenSpec-compatible contract-driven workflow for AI full-stack development.

ContractSpec adds a full-stack contract pack on top of OpenSpec so AI coding agents align on product intent, domain rules, data models, APIs, errors, UI states, tests, and verification before writing code.

## Why

AI coding often drifts when requirements live only in chat:

- Frontend invents fields the backend does not return.
- Backend implements states the UI never exposes.
- Error formats differ across layers.
- Tests only cover the happy path.

OpenSpec gives us the lifecycle: proposal, specs, design, tasks, archive.

ContractSpec adds the missing full-stack contracts that make frontend, backend, and AI agents obey one shared source of truth.

## Artifact Flow

```text
proposal
  -> contracts
  -> specs
  -> design
  -> tasks
  -> verification
  -> implementation
  -> archive
```

The schema lives at:

```text
schemas/contract-spec/
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
    test-contract.md
  specs/
    <capability>/spec.md
  design.md
  tasks.md
  verification.md
```

## Quick Start

Install OpenSpec first:

```bash
npm install -g @fission-ai/openspec@latest
```

Clone this repository and install the ContractSpec schema into a project:

```bash
git clone https://github.com/Pluviobyte/ContractSpec.git
cd ContractSpec
node bin/contractspec.js init /path/to/your-project
```

Then run OpenSpec in your project:

```bash
cd /path/to/your-project
openspec init
openspec config profile
openspec update
```

Set `openspec/config.yaml` to use:

```yaml
schema: contract-spec
```

Now start changes with your AI coding assistant:

```text
/opsx:propose create-task
/opsx:apply create-task
/opsx:verify create-task
/opsx:archive create-task
```

## CLI

ContractSpec includes a small validation helper:

```bash
node bin/contractspec.js validate .
node bin/contractspec.js validate examples/create-task
node bin/contractspec.js init /path/to/project
```

The validator checks:

- Schema bundle and templates exist.
- Required contract files exist.
- API contract includes endpoint, request, response, and errors.
- UI state contract covers loading, empty, success, and error.
- Specs contain requirements and `#### Scenario:` blocks.
- Tasks use checkbox format.
- Verification records commands, evidence, and results.

## Status

This is an alpha methodology and schema bundle. The intent is to stay OpenSpec-compatible first, then add richer validators and examples once the workflow proves useful in real projects.

## License

MIT
