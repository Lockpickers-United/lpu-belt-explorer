# Testing Implementation Report

This document tracks implementation of `internal-docs/testing-strategy-and-coverage-plan.md`. Update the applicable phase with its summary, findings, changes, verification, and remaining work whenever a phase is completed.

Last updated: 2026-09-14

The major-dependency compatibility baseline and its latest verification numbers are recorded in `internal-docs/major-dependency-upgrade-implementation-report.md`.

## Overall status

| Phase | Status | Completed |
| --- | --- | --- |
| Phase 0: Make the baseline trustworthy | Complete | 2026-09-14 |
| Phase 1: Build reusable test seams | In progress | — |
| Phase 2: Cover P0 security and data integrity | Not started | — |
| Phase 3: Cover P1 application behavior | Not started | — |
| Phase 4: Establish browser confidence | Not started | — |
| Phase 5: Make quality sustainable | Not started | — |

## Phase 0: Make the baseline trustworthy

### Summary

Phase 0 established a deterministic frontend test baseline that does not load local production credentials or contact production Firebase/data/API services. Vitest coverage can now be collected, pull-request and deployment workflows run the frontend test suite, and Playwright starts from a fresh isolated build using correct hash routes.

The fast frontend suite now contains 10 files and 32 passing tests. The repaired Playwright suite contains 9 passing Chromium journeys. Coverage is reported but deliberately does not fail builds yet; the measured baseline is far below the thresholds that had previously been declared without a working provider.

### Findings

#### Unit tests were silently using live services

The original Vitest configuration loaded `.env.keysNew`, placing real local credentials in the test process even though the suite did not need them.

After production URLs were replaced with test-only URLs, six existing route tests failed. This demonstrated that the tests had been passing by downloading current JSON from `explore.lpubelts.com`. Their assertions included current production usernames, so they were neither offline nor stable.

The shared render helper also mounted the real `DBProvider`. `DBProvider` creates a system-message Firestore listener even for an anonymous user, so ordinary component tests initialized Firebase and attempted a real Firestore connection. Redirecting Firebase to loopback exposed this through connection failures.

#### HTTP isolation existed but was incomplete

MSW already rejected unhandled requests, which is the correct default. It had only one handler, however, and the production data URLs bypassed the intended local test contract. The lock list also fetches LockBazaar metadata independently.

#### Coverage was configured but unavailable

`vitest.config.js` declared global 70% line/function/statement and 60% branch thresholds, but neither supported Vitest coverage provider was installed. Therefore no baseline could be generated and the thresholds had never acted as a usable gate.

With broad `src/**/*.{js,jsx}` collection and only test support/entry bootstrap excluded, the first working baseline is:

| Metric | Baseline |
| --- | ---: |
| Statements | 13.68% (1,591 / 11,626) |
| Branches | 10.77% (953 / 8,842) |
| Functions | 12.51% (402 / 3,212) |
| Lines | 13.81% (1,491 / 10,793) |

A later phase should decide and document further exclusions only where files contain generated or declarative data rather than behavior.

#### Existing browser tests did not consistently exercise their intended routes

The application uses `HashRouter`, but three Playwright navigations used `/locks` rather than `/#/locks`. Those requests could render the root fallback instead of the stated scenario. `makeAutocomplete.spec.js` also contained a large unreachable debugging block after an early return.

The Playwright web server ran `vite preview` without first building, so a run could use stale `dist` output or fail on a clean checkout. There was no browser-level restriction preventing external requests.

#### CI did not execute tests

The pull-request workflow ran lint and build only. The main deployment workflow also built and deployed without first running the frontend suite.

#### Environment/tool findings

- Phase 0 was initially implemented locally under Node 24.15.0 while the repository and CI still required Node 22. Major-upgrade Phase 1 subsequently aligned local development, CI, and the configured second-generation Functions runtime on Node 24 LTS. See `internal-docs/major-dependency-upgrade-implementation-report.md` for the runtime decision and verification.
- The installed Playwright package required a newer pinned Chromium binary than was present locally. `npx playwright install chromium` resolved the local runner; CI will need the equivalent install step when Playwright becomes a required CI check in Phase 4.
- npm reported 26 dependency vulnerabilities (2 low, 19 moderate, 5 high) during dependency installation. No broad `npm audit fix` was run because it is outside this phase and could introduce unrelated or breaking dependency changes.
- The production build continues to emit pre-existing large-chunk warnings. This is a performance concern, not a test-baseline failure.

### Changes

#### Safe test environment

- Added a committed `.env.test` containing synthetic Firebase identifiers, loopback emulator addresses, relative data/API paths, and no real secrets.
- Added `assertSafeTestEnvironment`, which rejects:
  - execution outside Vite test mode
  - a Firebase API key other than the test sentinel
  - a deployable Firebase project ID
  - disabled Firebase emulators
  - non-loopback emulator hosts
  - non-relative/non-loopback data and API URLs
- Called the guard from the Vitest bootstrap and Firebase initialization in test-mode builds.
- Made the Firebase project/config fields environment-selectable while preserving existing production defaults.
- Connected Auth and Firestore to the configured loopback emulators whenever `VITE_USE_FIREBASE_EMULATORS=true`.
- Made data, LockBazaar, Node service, and API base URLs environment-selectable. Local data now uses same-origin `/data` rather than a hard-coded development port.
- Prevented Vitest and test-mode Vite builds from loading `.env.keysNew`. Non-test Vite builds retain the existing local behavior for compatibility.

#### Deterministic Vitest suite

- Added a fixed anonymous `DBContext` test provider so ordinary frontend tests do not initialize Firestore. Phase 1 will replace broad fixed context mocks with configurable per-test providers.
- Added an MSW handler for the test LockBazaar metadata endpoint.
- Replaced live leaderboard data in route tests with a small deterministic fixture.
- Reworked stats route smoke tests to assert route composition with controlled child components rather than rendering charts from live datasets.
- Added four tests for the safe-environment guard.
- Increased one existing lock-sort test timeout from 15 to 30 seconds because V8 instrumentation pushed that data-heavy legacy test beyond its original limit. Reducing its fixture size remains Phase 1 work.
- Removed the remaining deprecated `react-dom/test-utils` `act` import. The affected tab interaction now uses `userEvent`, which applies React's supported `act` integration around the user action.

#### Coverage

- Added exact-version `@vitest/coverage-v8` 4.1.8 to match Vitest 4.1.8.
- Added `npm run test:coverage`.
- Configured V8 text, HTML, and LCOV reports under ignored `coverage/`.
- Removed unenforceable global thresholds pending a measured ratchet. No coverage gate is active yet.
- Included untested frontend JavaScript/JSX in the baseline so the number reflects the application rather than only modules imported by the current tests.

#### Safe commands and CI

- Added `npm run build:test`, which builds with `.env.test` and does not load `.env.keysNew`.
- Added `npm run test:ci` as the non-watch CI frontend command.
- Changed `npm run ci-pr` to run lint, frontend tests, and the isolated test-mode build.
- Added `npm run test:ci` before the main deployment workflow's build/deploy step.
- Renamed the pull-request workflow step to accurately report lint, test, and build behavior.
- Kept Playwright and Firebase emulator suites out of required CI for now. Playwright becomes a required isolated check in Phase 4; Firebase rules/Functions coverage belongs to Phase 2.

#### Playwright repairs

- Removed terminal-clearing behavior from `npm run e2e` so logs remain visible in local and CI output.
- Changed all lock navigations to hash-router URLs.
- Removed unreachable debugging code from the autocomplete journey.
- Added a shared Playwright fixture that aborts every non-loopback HTTP(S) request.
- Changed the server command to create a fresh test-mode build before starting an isolated preview server.
- Disabled preview-server reuse to prevent testing stale or development configuration.
- Added CI-only retry/worker behavior, `forbidOnly`, failure screenshots/video, first-retry traces, and blocked service workers.

#### Contributor guidance

- Updated `AGENTS.md` with coverage, isolated-build, PR-equivalent, browser-install, and test-safety instructions.
- Added this implementation report and linked it from the strategy document.

### Verification

The following commands were run during Phase 0:

| Command | Result |
| --- | --- |
| `npm run test:run` / `npm run test:ci` | Passed: 10 files, 32 tests; warning cleanup rerun produced no warnings |
| `npm run test:coverage` | Passed after adjusting the legacy lock-sort timeout; baseline recorded above |
| `npm run build:test` | Passed; pre-existing chunk-size warnings remain |
| `npm run e2e` | Passed after installing pinned Chromium: 9 tests |
| `npm run lint` | Passed with no output |
| Targeted ESLint for changed configs/tests | Passed with no output |
| `npm run ci-pr` | Passed: lint, 32 frontend tests, and isolated test build |
| `npm run build` | Passed; verifies existing production defaults remain build-compatible |

The first isolated Vitest run and first coverage run failed during migration and provided the findings documented above. They were rerun successfully after remediation.

### Phase 0 exit criteria

- [x] A clean install has one documented fast command: `npm run test:ci`.
- [x] PR-equivalent validation is documented and available as `npm run ci-pr`.
- [x] Frontend tests do not require production credentials or external network access.
- [x] Test imports no longer load `.env.keysNew`.
- [x] Firebase and API configuration fail closed in test mode.
- [x] Tests are scoped away from dependencies, build output, Functions, and sibling repositories.
- [x] Coverage can be collected and an honest baseline is recorded.
- [x] Playwright uses a fresh isolated build, correct routes, and blocks non-loopback traffic.
- [x] Pull-request and deployment workflows gate on the fast frontend suite.

### Intentionally deferred

- Configurable provider harnesses, small domain factories, and comprehensive MSW domains: Phase 1
- Firestore rule source/configuration, rules tests, Functions tests, and emulator orchestration: Phase 2
- Initial global and changed-code coverage thresholds: Phases 3 and 5 after coverage growth
- Required Playwright CI job, report artifacts, and accessibility checks: Phase 4
- Dependency vulnerability remediation and production bundle optimization: separate maintenance work

## Phase 1: Build reusable test seams

Status: In progress

### Summary

The configurable core provider/router render harness was implemented as part of the major-dependency Phase 0 baseline. Tests can now override Auth, DB, API, App, and Scoring values without copying provider boilerplate.

### Findings

The provider work was sufficient for compatibility tests, but global context mocks in `src/test/setupTests.js` remain broad. Domain factories, feature-specific providers, and expanded MSW handlers are still needed before this testing phase is complete.

### Changes

- Added anonymous-safe default values for core contexts.
- Added per-test Auth, DB, API, App, and Scoring overrides.
- Preserved production-like provider ordering.
- Added MemoryRouter and HashRouter options with React Router 7 compatibility flags.

## Phase 2: Cover P0 security and data integrity

Status: Not started

### Summary

To be completed when the phase is implemented.

### Findings

To be completed when the phase is implemented.

### Changes

To be completed when the phase is implemented.

## Phase 3: Cover P1 application behavior

Status: Not started

### Summary

To be completed when the phase is implemented.

### Findings

To be completed when the phase is implemented.

### Changes

To be completed when the phase is implemented.

## Phase 4: Establish browser confidence

Status: Not started

### Summary

To be completed when the phase is implemented.

### Findings

To be completed when the phase is implemented.

### Changes

To be completed when the phase is implemented.

## Phase 5: Make quality sustainable

Status: Not started

### Summary

To be completed when the phase is implemented.

### Findings

To be completed when the phase is implemented.

### Changes

To be completed when the phase is implemented.
