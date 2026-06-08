# API Contract: Create Task

## Endpoint

`POST /api/tasks`

## Auth

Requires authenticated user session or bearer token.

## Request

```json
{
  "title": "string",
  "description": "string | null",
  "dueDate": "string | null"
}
```

## Response

Status: `201 Created`

```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "status": "todo",
  "dueDate": "string | null",
  "createdAt": "string",
  "updatedAt": "string"
}
```

## Errors

- `400 VALIDATION_ERROR`
- `401 UNAUTHORIZED`
- `500 INTERNAL_ERROR`

## Compatibility

- Field names use camelCase.
- Dates use ISO 8601 strings.
- Unknown request fields are ignored.
