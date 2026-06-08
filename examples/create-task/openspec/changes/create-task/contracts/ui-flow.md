# UI Flow Contract: Create Task

## Entry Points

- Task list primary create button.
- Empty task list create action.

## Screens / Routes

- `/tasks` shows the task list.
- `/tasks/new` shows the create form.
- `/tasks/:id` shows the created task.

## User Actions

1. Click create task.
2. Enter title, optional description, optional due date.
3. Submit form.
4. On success, navigate to task detail.

## Client-Side Validation

- Title cannot be empty after trimming.
- Description cannot exceed 1000 characters.
- Due date must be `YYYY-MM-DD` when provided.

## Accessibility

- Field errors are associated with inputs.
- Submit button exposes disabled state while submitting.
