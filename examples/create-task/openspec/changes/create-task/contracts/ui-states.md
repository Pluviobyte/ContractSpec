# UI States Contract: Create Task

## Loading

Initial route or auth state is being resolved.

## Empty

Task list has no tasks and shows a create action.

## Success

Task creation returns `201` and navigates to `/tasks/:id`.

## Error

Server failure displays a general error and keeps user input.

## Unauthorized

Unauthenticated user is redirected to login.

## Forbidden

Not expected for creation. If returned, show permission error.

## Submitting

Submit button is disabled and form cannot be submitted twice.

## Validation Error

Field errors are shown inline using `error.fields`.
