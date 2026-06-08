# Domain Contract: Task

## Entities

Task:

- id
- title
- description
- status
- dueDate
- ownerId
- createdAt
- updatedAt

## Business Rules

- Only authenticated users can create tasks.
- A task belongs to exactly one owner.
- New tasks start with status `todo`.
- Title must be 1 to 100 characters.
- Description may be empty but cannot exceed 1000 characters.

## State Machine

```text
todo -> doing -> done
```

Task creation only creates the `todo` state.

## Permissions

- Creator becomes owner.
- Only owner can read the created task.

## Invariants

- `ownerId` is never null.
- `status` is one of `todo`, `doing`, `done`.
- `createdAt` and `updatedAt` are ISO timestamps.

## Edge Cases

- Whitespace-only title is invalid.
- Invalid due date is rejected.
