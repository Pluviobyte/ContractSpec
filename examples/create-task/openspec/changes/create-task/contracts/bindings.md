# Contract Bindings: Create Task

Contract bindings connect the create-task contracts to executable schema, code, tests, mocks, and evidence.

## API Binding

Contract:

- contracts/api.md

Executable sources:

- planned: openapi/tasks.create.yaml
- planned: src/server/routes/tasks.ts
- planned: src/server/schemas/create-task.schema.ts

Generated clients / SDKs:

- planned: packages/api-client/src/tasks.ts

Mocks:

- planned: apps/web/src/mocks/tasks.ts

## Data Binding

Contract:

- contracts/data-model.md

Executable sources:

- planned: packages/contracts/src/task.ts
- planned: packages/contracts/src/create-task.ts
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

- planned: apps/web/src/features/tasks/CreateTaskForm.tsx
- planned: apps/web/src/features/tasks/create-task-state.ts
- planned: apps/web/src/features/tasks/use-create-task.ts

## Test Binding

Contract:

- contracts/test-contract.md

Executable tests:

- planned: tests/api/create-task.test.ts
- planned: apps/web/src/features/tasks/CreateTaskForm.test.tsx
- planned: e2e/create-task.spec.ts

## Verification Binding

Evidence log:

- verification.md

CI / commands:

- planned: npm run typecheck
- planned: npm test
- planned: npm run test:e2e
