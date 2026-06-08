# Data Model Contract: Task

## Fields

| Field | Type | Required | Nullable | Default |
| --- | --- | --- | --- | --- |
| id | string | yes | no | generated |
| title | string | yes | no | none |
| description | string | no | yes | null |
| status | `todo` or `doing` or `done` | yes | no | `todo` |
| dueDate | string | no | yes | null |
| ownerId | string | yes | no | current user id |
| createdAt | string | yes | no | now |
| updatedAt | string | yes | no | now |

## Constraints

- `title` length: 1-100 after trimming.
- `description` length: max 1000.
- `dueDate` format: `YYYY-MM-DD`.

## Relationships

- Task belongs to user through `ownerId`.

## Migration Notes

- Add task table if missing.
- Existing task table must preserve current data.
