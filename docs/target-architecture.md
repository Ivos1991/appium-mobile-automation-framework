# Target Architecture

This repository follows a thin layered automation structure:

- `src/screens`: screen objects with selectors and UI interactions only
- `src/flows`: business orchestration across screens
- `src/core`: small reusable primitives shared by screens
- `src/framework`: configuration, waits, and reporting helpers
- `features`: business-readable Gherkin scenarios
- `step-definitions`: thin BDD glue that calls flows and asserts outcomes
- `hooks`: scenario lifecycle and reporting behavior

Current implemented slices:

1. Login success
2. Login failure
3. Authenticated home/account overview validation after login
4. Authenticated account-summary/home content validation after login
5. Session interruption requires login again
6. Local smoke execution for successful login confirmation

The framework stays Android-first, uses shallow inheritance, and avoids speculative abstraction. Runtime support is intentionally local-first and scoped to a single real smoke path.
