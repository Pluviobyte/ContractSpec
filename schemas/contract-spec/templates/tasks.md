# Tasks

## 1. Contract Setup

- [ ] 1.1 Confirm product, domain, data, API, error, UI, and test contracts are complete
- [ ] 1.2 Add or update shared types/schema from the data and API contracts
- [ ] 1.3 Map contracts to executable bindings in contracts/bindings.md

## 2. Failing Test Gate

- [ ] 2.1 Create failing backend/API tests from contracts/test-contract.md
- [ ] 2.2 Create failing frontend/component tests from contracts/test-contract.md
- [ ] 2.3 Create failing integration or E2E smoke tests where required

## 3. Vertical Slice: Happy Path

- [ ] 3.1 Implement backend behavior for the happy path
- [ ] 3.2 Implement frontend workflow and success UI state
- [ ] 3.3 Make happy-path tests pass without weakening expectations

## 4. Vertical Slice: Errors and Edge Cases

- [ ] 4.1 Implement contract-defined validation and error responses
- [ ] 4.2 Implement frontend error, empty, unauthorized, and submitting states
- [ ] 4.3 Make failure-path tests pass without changing the contract

## 5. Verification

- [ ] 5.1 Run ContractSpec validation, tests, type checks, and build
- [ ] 5.2 Update verification.md with commands, evidence, warnings, and results
