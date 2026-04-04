# Reporting And CI

Current reporting scope is intentionally small:

- Allure is enabled for WDIO+Cucumber execution
- failed scenarios attach a screenshot
- lightweight scenario context is attached where it improves debugging
- every WDIO run writes raw results to `artifacts/allure-results`
- generated reports are written to `artifacts/allure-report`

Current CI position:

- `PR Validation` runs on every pull request, on `main`, and on manual dispatch
- `Nightly Smoke` runs on a nightly schedule and on manual dispatch
- the shared Android suite workflow performs:
  - dependency installation
  - typecheck
  - latest demo APK download
  - Android emulator startup
  - smoke execution
  - Allure report generation
  - artifact upload
- hosted Allure previews are published to `gh-pages` when the workflow has permission to write

Branch protection recommendation:

- require the `PR Validation` workflow before merge

Local runtime remains important:

- `npm run check:runtime` validates a developer machine
- `npm run test:smoke` exercises the same narrow smoke path used in CI
