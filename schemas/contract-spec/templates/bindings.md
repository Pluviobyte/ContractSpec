# Contract Bindings

Contract bindings connect Markdown contracts to executable schema, code, tests, mocks, and evidence.

Use `planned:` for files that should be created by this change. Use `existing:` for files already present in the codebase.

## API Binding

Contract:

- contracts/api.md

Executable sources:

- planned: openapi/<feature>.yaml
- planned: src/server/routes/<feature>.ts

Generated clients / SDKs:

- planned: packages/api-client/src/<feature>.ts

Mocks:

- planned: apps/web/src/mocks/<feature>.ts

## Data Binding

Contract:

- contracts/data-model.md

Executable sources:

- planned: packages/contracts/src/<feature>.ts
- planned: prisma/schema.prisma

## Error Binding

Contract:

- contracts/errors.md

Executable sources:

- planned: packages/contracts/src/errors.ts
- planned: src/server/errors/http-error.ts

## UI Flow / State Binding

Contracts:

- contracts/ui-flow.md
- contracts/ui-states.md

Executable sources:

- planned: apps/web/src/features/<feature>/<Feature>Form.tsx
- planned: apps/web/src/features/<feature>/<feature>-state.ts

## Test Binding

Contract:

- contracts/test-contract.md

Executable tests:

- planned: tests/api/<feature>.test.ts
- planned: apps/web/src/features/<feature>/<Feature>Form.test.tsx
- planned: e2e/<feature>.spec.ts

## Verification Binding

Evidence log:

- verification.md

CI / commands:

- planned: npm run typecheck
- planned: npm test
- planned: npm run test:e2e
