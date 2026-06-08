# Test Contract: Create Task

## Backend / API Tests

- `POST /api/tasks` with valid input returns `201` and created task.
- Empty title returns `400 VALIDATION_ERROR`.
- Missing auth returns `401 UNAUTHORIZED`.
- Invalid due date returns `400 VALIDATION_ERROR`.

## Frontend Tests

- Empty title blocks submit and shows field error.
- Submit disables button while pending.
- Successful create navigates to task detail.
- Server validation maps field errors to inputs.

## Integration / E2E Tests

- Authenticated user creates a task from `/tasks/new`.

## Manual Acceptance Checks

- Create task with title only.
- Create task with title, description, and due date.
- Retry after simulated server failure.

## Contract Coverage Matrix

| Contract | Required Evidence |
| --- | --- |
| api | API tests or request/response proof |
| errors | Validation/auth failure tests |
| ui-states | Component or E2E checks |
| product | Manual or E2E happy path |
