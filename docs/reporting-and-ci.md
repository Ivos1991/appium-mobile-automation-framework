# Reporting And CI

Current reporting scope is intentionally small:

- Allure is enabled for WDIO+Cucumber execution
- failed scenarios attach a screenshot
- lightweight scenario context is attached where it improves debugging
- every WDIO run writes raw results to `artifacts/allure-results`
- generated reports are written to `artifacts/allure-report`

Current CI position:

- `PR Validation` runs on every pull request, on `main`, and on manual dispatch
- `PR Validation` performs dependency installation and typecheck only
- `Nightly Smoke` runs on a nightly schedule and on manual dispatch
- `Nightly Smoke` runs the hosted Android smoke experiment on `ubuntu-latest`
- `Nightly Smoke` performs:
  - dependency installation
  - latest demo APK download
  - smoke execution
  - Allure report generation
  - hosted Allure report publishing to `gh-pages`
  - artifact upload for raw run evidence

Hosted report behavior:

- successful scheduled runs publish to `reports/nightly`
- successful manual runs publish to `reports/run-<github_run_id>`
- the workflow summary contains a direct "View your report here" link
- GitHub Pages must be configured to serve from the `gh-pages` branch

Branching note:

- `main` is the stable publish branch
- `hosted-runner-nightly` is the branch used to iterate on GitHub-hosted Android nightly execution
- the split exists because Android emulator behavior on hosted Linux runners required targeted workflow tuning that should not destabilize the main branch during iteration

Branch protection recommendation:

- require the `PR Validation` workflow before merge

Local runtime remains important:

- `npm run check:runtime` validates a developer machine
- `npm run test:smoke` exercises the same narrow smoke path used in CI
