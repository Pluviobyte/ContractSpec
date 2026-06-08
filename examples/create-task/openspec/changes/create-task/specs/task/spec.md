# Delta for Task

## ADDED Requirements

### Requirement: Authenticated user can create a task

The system SHALL allow an authenticated user to create a task with a required title.

#### Scenario: Successful task creation

- **GIVEN** an authenticated user
- **WHEN** the user submits a valid task title
- **THEN** the system creates a task owned by that user
- **AND** returns the created task with status `todo`

#### Scenario: Missing title

- **GIVEN** an authenticated user
- **WHEN** the user submits an empty task title
- **THEN** the system returns `VALIDATION_ERROR`
- **AND** the UI shows a title field error

#### Scenario: Unauthenticated request

- **GIVEN** no authenticated user
- **WHEN** task creation is requested
- **THEN** the system returns `UNAUTHORIZED`
- **AND** the UI redirects to login
