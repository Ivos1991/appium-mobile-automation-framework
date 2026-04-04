# BDD Strategy

This project uses Cucumber only for business-readable slices that map directly to supported framework behavior.

Principles:

- One feature should describe one business capability.
- Scenarios should stay small and deterministic.
- Banking language is allowed at the feature level even when the underlying sample app uses generic names.
- Step definitions should not contain selectors or orchestration logic.
- Reusable behavior belongs in flows, not in Gherkin glue.

Current feature coverage:

- successful login with valid credentials
- failed login with invalid credentials
- session interruption requires login again after successful login
- runtime smoke for successful login confirmation dialog
