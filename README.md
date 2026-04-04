# Mobile Banking Automation Framework

Lean mobile test automation framework built with TypeScript, WebdriverIO, Appium, Cucumber, and Allure.

The project uses the WebdriverIO Android demo app as the real runtime target while keeping banking-oriented naming at the framework level. The goal is a small, portfolio-safe example of layered mobile automation rather than a broad product suite.

## Implemented Scope

- successful login
- invalid login
- authenticated home-state validation
- authenticated account-summary content validation
- session interruption requires login again
- local Android smoke path for real Appium execution

Out of scope for this repository:

- transfers
- settings
- biometrics
- CI/CD pipelines
- broad framework scaffolding beyond the implemented slices

## Architecture

- `src/screens`: selectors and UI interactions only
- `src/flows`: orchestration across screens
- `src/core`: small reusable primitives
- `src/framework`: configuration and reporting helpers
- `features`: business-readable Gherkin scenarios
- `step-definitions`: thin BDD glue
- `hooks`: lifecycle and reporting hooks

## Quick Start

1. Install dependencies
2. Copy `.env.example` to `.env`
3. Provide the Android demo APK
4. Start an Android emulator or connect a device
5. Run the readiness check
6. Run the smoke scenario

```bash
npm install
npm run check:runtime
npm run test:smoke
```

## Local Runtime Setup

Required tools:

- Node.js 20+
- Java
- Android SDK / platform-tools
- Appium 3
- UiAutomator2 driver
- Android emulator or physical Android device

Install the Appium driver once:

```bash
appium driver install uiautomator2
```

### APK

By default the repo expects the sample APK at:

```text
apps/android/wdio-demo-app.apk
```

If you want a different local path, set `ANDROID_APP_PATH` in `.env`.

### Device Target

Set the target device name in `.env`:

```text
ANDROID_DEVICE_NAME=Android Emulator
```

If more than one device is connected, set `ANDROID_UDID` to the exact serial from `adb devices`.

### Runtime Check

Run:

```bash
npm run check:runtime
```

Successful output should show:

- `PASS: APK path exists`
- `PASS: Appium command available`
- `PASS: adb available`
- `PASS: adb device list callable`
- `PASS: Android emulator/device detected`

## Smoke Path

The runtime smoke path is intentionally narrow:

- open the login screen
- enter valid credentials
- assert the native successful login confirmation dialog

Run it with:

```bash
npm run test:smoke
```

Additional local run targets:

```bash
npm run test:login
npm run typecheck
```

## Reporting

Allure is enabled with concise reporting:

- failed scenarios attach a screenshot
- flows attach only small context payloads where useful
- webdriver step noise is disabled
- every WDIO run writes raw Allure results to `artifacts/allure-results`

Generate and open the report:

```bash
npm run allure:generate
npm run allure:open
```

## GitHub Actions

The repository includes two GitHub Actions entrypoints:

- `PR Validation`
  runs on every pull request, on `main`, and on manual dispatch
- `Nightly Smoke`
  runs on a nightly schedule and on manual dispatch

`PR Validation` is intentionally lightweight and reliable on GitHub-hosted runners:

- install dependencies
- typecheck the project

`Nightly Smoke` is the hosted Android smoke experiment on `ubuntu-latest`:

- install dependencies
- download the latest WebdriverIO demo APK
- run the Android smoke scenario
- generate and publish a hosted Allure report

Use branch protection to require `PR Validation` for every pull request. Use `Nightly Smoke` for hosted nightly smoke execution and hosted Allure publishing.

### CI Notes

- `main` keeps the stable GitHub-hosted PR check through `PR Validation`
- the hosted Android nightly experiment lives on the `hosted-runner-nightly` branch
- that branch exists because Android emulator behavior on GitHub-hosted runners needed iterative tuning separate from the stable publish branch
- hosted Allure reports from the nightly workflow are published to `gh-pages`
- scheduled runs publish to `reports/nightly`
- manual runs publish to `reports/run-<github_run_id>`

## Notes For Publishing

- local runtime assets such as APKs, SDKs, emulator data, logs, and temporary reference repos are ignored
- `.env` is local-only; publish `.env.example`
- the repo is Android-first and intentionally small
