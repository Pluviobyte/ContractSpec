# Design: Create Task

## Context

The application has authenticated users and a task list. This change adds the first vertical slice for task creation.

## Goals

- Implement task creation end to end.
- Keep API, errors, and UI states aligned with the contract pack.
- Make validation testable from both backend and frontend.

## Non-Goals

- Task editing
- Task deletion
- Multi-user sharing

## Contract Mapping

- `contracts/data-model.md` maps to task persistence and shared task type.
- `contracts/api.md` maps to `POST /api/tasks`.
- `contracts/errors.md` maps to validation, auth, and server error handling.
- `contracts/ui-flow.md` and `contracts/ui-states.md` map to the create form.
- `contracts/test-contract.md` maps to API, component, and E2E checks.

## Decisions

### Decision: Shared validation schema

- Choice: Use one validation schema for backend request validation and frontend form validation when the stack allows it.
- Rationale: Reduces drift between client and server.
- Alternatives considered: Separate frontend and backend validators, which is more flexible but easier to drift.

### Decision: Field-level validation envelope

- Choice: Return `error.fields` for validation errors.
- Rationale: Frontend can map errors directly to inputs.
- Alternatives considered: Single string error, which is simpler but less useful for forms.

## Data Flow

```text
create form -> POST /api/tasks -> validate -> persist task -> 201 response -> navigate to detail
```

## Risks / Trade-Offs

- Duplicate submission -> Disable submit while pending.
- Validation drift -> Prefer shared schema or contract tests.
- Auth ambiguity -> Treat missing auth as `401 UNAUTHORIZED`.

## Migration / Rollback

- If the task table is new, migration can be rolled back before production data exists.
- UI can hide the create entry point if the backend is not ready.

## Open Questions

- None.
