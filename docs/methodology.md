# Contract-Spec Driven Development

ContractSpec is a working style for AI-assisted full-stack development.

The core rule:

> A feature is not ready for implementation until its contracts are explicit enough for frontend, backend, tests, and AI agents to agree on the same behavior.

## The Problem

Typical vibe coding starts from intent:

```text
Build task creation.
```

Then the backend and frontend grow in different directions:

- Backend returns `title`; frontend expects `taskName`.
- Backend returns validation as a string; frontend expects field errors.
- Frontend has loading and empty states; backend only supports success.
- AI invents missing contract details from local context.

This is not mainly a coding problem. It is a missing shared-facts problem.

## The Contract Pack

ContractSpec makes these facts explicit before implementation:

| Contract | Purpose |
| --- | --- |
| Product | User goal, workflow, success and failure behavior |
| Domain | Entities, rules, permissions, states, invariants |
| Data model | Fields, types, nullability, constraints, migration notes |
| API | Endpoints, auth, request, response, status codes |
| Errors | Error envelope, codes, field errors, recovery behavior |
| UI flow | Routes, user actions, navigation, validation |
| UI states | Loading, empty, success, error, unauthorized, submitting |
| Bindings | Maps contracts to executable schema, code, mocks, tests, and evidence |
| Test contract | Required tests and manual acceptance checks |

## Human and AI Roles

Humans decide:

- Whether the feature is worth doing.
- What the correct contracts are.
- Which trade-offs are acceptable.
- Whether the final experience is good enough.

AI agents execute:

- Draft contracts from user intent and existing code.
- Identify contract gaps.
- Implement vertical slices.
- Add tests.
- Verify code against contracts.

## Design Principle

Specs describe observable behavior.

Contracts describe full-stack interface facts.

Design describes implementation choices.

Tasks describe execution.

Bindings connect contracts to executable engineering artifacts.

Tests turn contracts into executable constraints.

Verification proves the implementation matches the contracts.

Keeping those layers separate is the move. A little boring, a lot useful.

## Source Of Truth

ContractSpec should not create a second permanent source of truth.

- `openspec/specs/` describes current system behavior.
- `contracts/` constrains an active change.
- `contracts/bindings.md` maps contracts to executable schema, code, tests, mocks, and evidence.
- Code, schema, and tests enforce the contract.
- Archive keeps historical evidence and merges behavior specs.

## Tests As Executable Contracts

ContractSpec treats tests as executable contracts.

A contract is not complete until:

1. Requirements are written in OpenSpec specs.
2. Cross-layer contracts are written in `contracts/`.
3. Executable bindings are mapped in `contracts/bindings.md`.
4. Test expectations are mapped in `contracts/test-contract.md`.
5. Failing tests are created before implementation.
6. Implementation passes those tests.
7. `verification.md` records the evidence.
