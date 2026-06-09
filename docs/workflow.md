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

## 4. Bind

Create `contracts/bindings.md`.

Map contracts to executable engineering artifacts:

- API schema, routes, generated clients, and mocks
- Shared data types, validators, database schemas, or migrations
- Error types and error mappers
- UI state files, components, and client mutations
- API, component, integration, and E2E tests
- Verification commands and CI evidence

## 5. Spec

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

## 6. Design

Write the implementation approach in `design.md`.

The design may choose frameworks, code structure, state management, transaction boundaries, or migration strategy. It must not contradict the contracts.

## 7. Test First

Use `contracts/test-contract.md` and `contracts/bindings.md` to create failing tests before implementation.

Rules:

- Tests should fail for the expected reason before implementation.
- Do not write tests after implementation just to mirror the code.
- If a test conflicts with the contract, update the contract first.

## 8. Tasks

Split work into vertical slices:

```text
failing tests -> happy path -> validation errors -> auth errors -> edge states -> verification
```

Avoid this:

```text
all backend -> all frontend -> last-minute integration
```

## 9. Apply

AI implements `tasks.md`.

Rules:

- Do not invent API fields.
- Do not invent UI states.
- Do not silently change error formats.
- Do not implement first and then write tests that mirror the implementation.
- If implementation reveals a contract gap, update the artifact first.

## 10. Verify

Update `verification.md` with:

- Commands run
- API responses or test output
- Browser/manual checks
- Known warnings or gaps

## 11. Archive

When complete, archive with OpenSpec so delta specs become part of the current system facts.
