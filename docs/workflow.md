# Workflow

## 1. Explore

Use exploration when intent is still fuzzy or the existing system is unknown.

Questions to answer:

- What already exists?
- Which capabilities are affected?
- Which APIs, models, routes, and tests are nearby?
- What ambiguity could make AI drift?

## 2. Propose

Create an OpenSpec change:

```text
/opsx:propose create-task
```

The proposal captures why the change exists, what changes, scope, non-goals, capabilities, and impact.

## 3. Contract

Create the `contracts/` pack.

Implementation should not start until these contracts are specific enough to answer:

- What data exists?
- What API is called?
- What does success return?
- What does failure return?
- What should every relevant UI state display?
- What must be tested?

## 4. Spec

Write OpenSpec delta specs under `specs/`.

Use requirements and scenarios:

```markdown
### Requirement: User can create a task

The system SHALL create a task for an authenticated user.

#### Scenario: Successful task creation

- **GIVEN** an authenticated user
- **WHEN** the user submits a valid title
- **THEN** the system creates the task
- **AND** returns the created task
```

## 5. Design

Write the implementation approach in `design.md`.

The design may choose frameworks, code structure, state management, transaction boundaries, or migration strategy. It must not contradict the contracts.

## 6. Tasks

Split work into vertical slices:

```text
Happy path -> validation errors -> auth errors -> edge states -> verification
```

Avoid this:

```text
all backend -> all frontend -> last-minute integration
```

## 7. Apply

AI implements `tasks.md`.

Rules:

- Do not invent API fields.
- Do not invent UI states.
- Do not silently change error formats.
- If implementation reveals a contract gap, update the artifact first.

## 8. Verify

Update `verification.md` with:

- Commands run
- API responses or test output
- Browser/manual checks
- Known warnings or gaps

## 9. Archive

When complete, archive with OpenSpec so delta specs become part of the current system facts.
