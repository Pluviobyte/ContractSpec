# OpenSpec Compatibility

ContractSpec is designed as an OpenSpec-compatible schema bundle, not a fork of OpenSpec.

## What ContractSpec Uses

- `openspec/specs/` as the source of truth for current behavior.
- `openspec/changes/<name>/` as the active change folder.
- `proposal.md`, `specs/`, `design.md`, and `tasks.md` as standard OpenSpec artifacts.
- Delta specs with `ADDED`, `MODIFIED`, `REMOVED`, and `RENAMED Requirements`.
- `tasks.md` checkbox tracking.
- OpenSpec custom schemas under `openspec/schemas/`.

## What ContractSpec Adds

- `contracts/` as a full-stack binding layer.
- `contracts/bindings.md` as the bridge from Markdown contracts to executable schema, code, tests, mocks, and evidence.
- `verification.md` as an evidence log.
- A schema that asks agents to generate contracts before specs/design/tasks.
- A small validator for contract completeness.

## Why Not Fork OpenSpec

OpenSpec is a lifecycle and artifact system.

ContractSpec is an opinionated full-stack workflow.

Keeping ContractSpec as a schema and methodology makes it easier to:

- Stay compatible with upstream OpenSpec.
- Evolve independently.
- Install into existing projects.
- Submit improvements upstream later if useful.

## Compatibility Constraints

OpenSpec expects specs to use precise headings. ContractSpec templates keep:

- `## ADDED Requirements`
- `## MODIFIED Requirements`
- `## REMOVED Requirements`
- `### Requirement: ...`
- `#### Scenario: ...`

Tasks must use checkbox format so agents can track completion:

```markdown
- [ ] 1.1 Implement happy path
- [x] 1.2 Add tests
```

## ContractSpec Source-Of-Truth Rule

`contracts/` is change-local. It should not become a second permanent spec library.

Long-term facts live in:

- `openspec/specs/` for current behavior
- executable schema/code/tests for enforceable behavior
- archived changes for historical evidence
