# Product Contract: Create Task

## User

Authenticated task app user.

## Goal

Create a task with a required title and optional description or due date.

## Primary Workflow

1. User opens the task list.
2. User selects create task.
3. User enters a title.
4. User submits the form.
5. System creates the task and navigates to the task detail page.

## Success Behavior

- Task is created.
- User is redirected to `/tasks/:id`.
- Success feedback is shown or implied by the detail page.

## Failure Behavior

- Empty title shows a field-level validation error.
- Unauthenticated user is redirected to login.
- Server failure shows a recoverable error message and keeps form input.

## Non-Goals

- Task editing
- Task deletion
- Team assignment

## Acceptance Criteria

- Title is required.
- Submit button is disabled while submitting.
- Successful creation navigates to the created task.
- Validation errors map to fields.
