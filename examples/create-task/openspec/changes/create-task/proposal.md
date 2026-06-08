# Proposal: Create Task

## Why

Users need a fast way to create tasks so they can capture work without leaving the task list.

## What Changes

- Add task creation for authenticated users.
- Add server-side validation for task titles.
- Add UI states for submitting, validation errors, server errors, and success.

## Capabilities

### New Capabilities

- task

### Modified Capabilities

- None

## Scope

### In Scope

- Create task API
- Create task form
- Validation and auth errors
- Happy path and failure tests

### Out of Scope

- Editing tasks
- Deleting tasks
- Bulk task creation
- Custom task statuses

## Impact

- Backend task route and service
- Frontend task creation form
- Shared task type or schema
- API and UI tests

## Open Questions

- None for the first slice.
