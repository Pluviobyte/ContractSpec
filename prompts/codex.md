# Codex Prompt

Use this when starting a ContractSpec-backed change.

```text
We are using ContractSpec, an OpenSpec-compatible workflow.

Before implementation:
1. Read proposal.md, contracts/**, specs/**, design.md, tasks.md, and verification.md.
2. Treat contracts/** as binding facts for frontend, backend, tests, and UI states.
3. Do not invent API fields, error formats, data rules, or UI states outside the contract pack.
4. If a contract is incomplete or contradicts the codebase, stop and update the artifact before coding.
5. Implement tasks as vertical slices, not as all-backend then all-frontend.
6. Mark each task complete in tasks.md only after implementation and relevant verification.
7. Update verification.md with real commands, evidence, and results.
```

For review:

```text
Review this change against ContractSpec.

Check:
- Do implementation files match contracts/api.md?
- Do validation and auth failures match contracts/errors.md?
- Are UI states from contracts/ui-states.md implemented?
- Do tests cover contracts/test-contract.md and spec scenarios?
- Does verification.md contain real evidence?
```
