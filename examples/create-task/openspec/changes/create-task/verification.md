# Verification: Create Task

## Contract Coverage

| Contract | Evidence | Result |
| --- | --- | --- |
| product | Happy path and failure checks planned | pending |
| domain | API tests planned for owner and status | pending |
| data-model | Type/schema checks planned | pending |
| api | API tests planned | pending |
| errors | Validation/auth tests planned | pending |
| ui-flow | E2E happy path planned | pending |
| ui-states | Component/E2E state checks planned | pending |
| bindings | Binding map created in contracts/bindings.md | pending |
| test-contract | Test list mapped below | pending |

## Scenario Coverage

| Spec Scenario | Test or Manual Check | Result |
| --- | --- | --- |
| Successful task creation | API test + E2E create flow | pending |
| Missing title | API test + form validation check | pending |
| Unauthenticated request | API test + login redirect check | pending |

## Commands

```bash
node bin/contractspec.js validate examples/create-task
node bin/contractspec.js check-bindings examples/create-task
npm test
npm run typecheck
npm run build
```

## Evidence

Pending implementation.

## Results

Pending implementation.
