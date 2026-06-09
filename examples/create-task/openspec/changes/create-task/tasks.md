# Tasks

## 1. Contract Setup

- [x] 1.1 Confirm product, domain, data, API, error, UI, and test contracts are complete
- [x] 1.2 Define the shared task shape from contracts/data-model.md
- [x] 1.3 Map contract files to planned executable bindings in contracts/bindings.md

## 2. Failing Test Gate

- [ ] 2.1 Create failing API tests from contracts/test-contract.md
- [ ] 2.2 Create failing component tests from contracts/test-contract.md
- [ ] 2.3 Create failing E2E smoke test from contracts/test-contract.md

## 3. Vertical Slice: Happy Path

- [ ] 3.1 Implement backend `POST /api/tasks` success path
- [ ] 3.2 Implement frontend create task form success path
- [ ] 3.3 Make happy-path tests pass without weakening expectations

## 4. Vertical Slice: Errors and Edge Cases

- [ ] 4.1 Implement validation and auth error responses
- [ ] 4.2 Implement frontend validation, unauthorized, submitting, and server error states
- [ ] 4.3 Make validation and auth tests pass without changing the contract

## 5. Verification

- [ ] 5.1 Run backend tests, frontend tests, type checks, and build
- [ ] 5.2 Update verification.md with commands, evidence, warnings, and results
