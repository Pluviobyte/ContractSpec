# Error Contract: Create Task

## Error Envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": {
      "title": "Title is required"
    }
  }
}
```

## Codes

| Code | Status | Meaning |
| --- | --- | --- |
| VALIDATION_ERROR | 400 | Request fields failed validation |
| UNAUTHORIZED | 401 | User is not authenticated |
| INTERNAL_ERROR | 500 | Unexpected server error |

## Field Errors

- `title`: required or too long.
- `description`: too long.
- `dueDate`: invalid date format.

## Recovery

- Validation errors should be shown inline.
- Unauthorized errors should redirect to login.
- Internal errors should preserve form input and allow retry.
