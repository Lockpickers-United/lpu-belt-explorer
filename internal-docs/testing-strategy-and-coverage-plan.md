# Testing Strategy and Coverage Plan

Status: active; Phase 0 completed  
Last updated: 2026-09-15

Implementation findings and progress are recorded in `internal-docs/testing-implementation-report.md`.

## Purpose

Build a test suite that gives maintainers confidence to change the application without depending on production data, manual regression testing, or a small number of brittle smoke tests.

The desired result is not merely a high coverage percentage. The suite should reliably detect regressions in privacy boundaries, authentication and authorization, Firestore subscriptions and writes, scoring and filtering behavior, request workflows, and the critical user journeys that connect those pieces.

## Current-state snapshot

The repository already has useful testing building blocks:

- Vitest, jsdom, React Testing Library, and `@testing-library/user-event`
- MSW for HTTP interception
- Playwright for browser tests
- A shared Vitest setup and route-rendering helper
- A Vitest configuration that scopes collection to project tests and excludes nested dependencies, Functions, server code, and end-to-end tests
- Coverage thresholds declared in `vitest.config.js`

As of major-upgrade Phase 9 on 2026-09-15, `npm run test:ci` passes under Vitest 5.0.0, Vite 8.3.0, React 19.3.0, Material UI 9.4.0, and Firebase 12.19.0:

- 19 Vitest files
- 87 tests
- 13 isolated Chromium Playwright journeys
- approximately 6.2 seconds locally without coverage
- 18.51% statements, 14.84% branches, 16.83% functions, and 18.67% lines

The Vitest 4 Phase 0 baseline was 18.41% statements and 18.55% lines. Phase 9 moved Vite's transforms from esbuild/Rollup to Oxc/Rolldown without changing the coverage configuration or intended `src/**/*.{js,jsx}` scope. The small counter shift reflects the changed transform output rather than a coverage-policy change.

Those tests cover a useful but still narrow slice of the application. In addition to content, lock, safelock, leaderboard, glossary, statistics, SearchBox, RafflePreviewBar, and formatting coverage, there are now focused compatibility contracts for AuthContext, ProfileContext, DBContext, Firebase configuration and initialization, the route tree, OAuth denial callbacks, representative MUI controls, and pure lock-sort comparators. A dedicated Firebase web SDK emulator contract verifies synthetic anonymous Auth, a Firestore subscription, transaction, create/update/delete operations, and permission denial without production access. The Playwright suite also verifies that every JavaScript asset emitted by the fresh Vite test build is served by the preview server, including representative lazy route and Markdown chunks.

The application is much larger than that baseline:

- approximately 487 frontend JavaScript/JSX source files
- approximately 86 declared route paths
- Firebase Authentication and Firestore reads, writes, transactions, and subscriptions
- Cloud Functions that maintain incremental change indexes
- HTTP API integrations
- role-dependent profile and administration behavior
- many data import, export, migration, and generation scripts

Important present gaps:

- Production Firestore rules are not represented by a source file and emulator configuration in this repository. The Firebase web SDK contract has narrow test-only rules for compatibility verification, but the application's authorization matrix still cannot be tested here.
- The configurable render helper now models core providers, but global context mocks remain broad and domain factories are not yet established.
- Tests can depend on large generated/static datasets rather than small purpose-built fixtures.
- Cloud Function create/update/delete trigger wiring has emulator coverage, but handler-level failure/idempotency tests and Firestore rules tests remain outstanding.
- Playwright now uses a fresh isolated build, blocks external APIs, and requires a clean browser console, but its journeys remain anonymous and are not yet a required CI job.
- Coverage can be collected but no global or changed-code ratchet is active yet.

## Goals

1. Make all routine tests deterministic, repeatable, and independent of production services.
2. Cover security and data-integrity boundaries before lower-risk presentation code.
3. Make the fast suite useful enough that developers run it during normal work.
4. Add a small set of trustworthy browser journeys instead of duplicating every component test in Playwright.
5. Run appropriate tests automatically before merge and deployment.
6. Improve coverage gradually without freezing development or rewarding low-value tests.
7. Make failures easy to understand, reproduce locally, and assign to an owner.

## Non-goals

- Testing every static content page independently when shared rendering behavior is already covered
- Reproducing Firebase, React, Material UI, or browser-library internals
- Replacing code review or targeted manual review of visual and production-only behavior
- Running CI tests against production Firebase, production APIs, or live user data
- Achieving a coverage number by snapshotting implementation details or exercising lines without meaningful assertions

## Safety requirements

No automated test command may read or mutate production data.

Apply these controls before expanding Firebase or browser coverage:

- Use a dedicated emulator project ID, preferably a Firebase `demo-*` project ID that cannot resolve to a deployable project. If project conventions require `lpubelts-dev`, require emulator host variables and reject execution when they are absent.
- Add a test bootstrap guard that fails before Firebase initialization if a production project ID, production API base URL, or missing emulator host is detected.
- Keep production deployments and live-data scripts approval-gated, as required by the repository policy.
- Never place real credentials or production service-account files in test fixtures or CI secrets.
- Use synthetic users and records only. Fixtures must not be copied from production unless they have been deliberately anonymized and reduced.
- Keep live import/export validation out of `test:ci`. Test their pure transformations with fixtures and temporary directories instead.

## Recommended test architecture

Use four complementary layers.

### 1. Pure unit tests

Use Vitest's Node environment for functions that do not need a browser:

- scoring calculations and normalization
- filters, sorting, search parsing, and URL serialization
- data transformation and summary generation
- validation and schema rules
- import/export parsing
- change-index calculations
- date, format, and display-name utilities

These tests should be the largest and fastest part of the suite. Extract pure functions from large contexts and components when doing so improves the production design; do not extract code solely to satisfy a coverage tool.

### 2. Component and integration tests

Use Vitest, jsdom, React Testing Library, and MSW to exercise user-visible behavior across a few collaborating modules:

- context providers and hooks
- route guards and redirects
- forms, validation, loading, error, empty, and success states
- subscription lifecycle and refresh behavior
- URL-driven filtering and navigation
- API request headers, cancellation, error mapping, and retries where applicable

Prefer queries based on accessible roles, labels, and visible text. Avoid testing component internals, large snapshots, arbitrary delays, or calling event handlers directly.

### 3. Firebase emulator and rules tests

Use the Firestore emulator for behavior that must be validated by Firebase itself:

- Firestore rule authorization matrices
- transactions and writes whose correctness depends on Firestore semantics
- Cloud Function trigger integration when unit-level handler tests are insufficient
- representative subscription and change-index behavior

Rules tests should use `@firebase/rules-unit-testing`. Cloud Function logic should primarily be tested as injected handlers, with a smaller emulator-backed suite proving trigger wiring.

Run `npm run test:firebase:web-sdk` for the isolated Firebase web SDK compatibility contract. It uses a non-deployable demo project, loopback Auth and Firestore emulators, synthetic records, and dedicated test-only rules.

### 4. Browser journeys

Use Playwright for a compact set of critical journeys that prove routing, rendering, browser behavior, and integration boundaries together. Prefer approximately 8–15 high-value journeys rather than one test per route.

Browser tests should run against a freshly built application with fully mocked APIs or explicitly started emulators. They must not silently fall back to live services.

## Test support structure

Adopt a clear structure while migrating existing tests incrementally:

```text
tests/
  unit/             Pure business logic and utility tests
  integration/      React providers, routes, forms, and API behavior
  firebase/         Firestore rules and emulator integration
  e2e/              Playwright journeys
src/test/
  factories/        Small domain-object builders
  handlers/         MSW handlers grouped by domain
  fixtures/         Minimal static fixture payloads
  render.jsx        Configurable production-like render helpers
  setupTests.js     Global cleanup and invariant checks only
functions/test/
  unit/             Injected Function handler tests
  integration/      Emulator-backed trigger tests
```

Existing tests do not need to be moved all at once. New tests should use the target layout, and old tests should move when they are materially changed.

### Rendering helpers

Use and extend the configurable `renderWithProviders`/`renderWithRouter` harness, which follows the core production provider order and accepts per-test overrides for:

- authentication state and claims
- application feature flags, including `adminEnabled` and `qaUserEnabled`
- DBContext reads, writes, subscriptions, and errors
- API responses
- profile state
- scoring and filter state
- initial route and history

Tests should explicitly request the state they need. A test for an anonymous visitor should not inherit an implicit administrator or authenticated user from global setup. Add Profile, Filter, and feature-specific providers as configurable options when their next test suite requires them rather than expanding global defaults preemptively.

### Factories and fixtures

Add small factories for at least:

- authenticated user and claims
- public and full profiles
- lock collection and lock entries
- scorecard activity
- awards and evidence
- belt and ranking requests
- RAFL entries

Factories should provide valid defaults and concise overrides. Tests should not load the complete generated application datasets when three records can establish the behavior.

### HTTP isolation

Keep MSW configured with unhandled requests treated as errors. Split handlers by domain and provide explicit helpers for success, delay, timeout, malformed payload, authorization failure, server error, and empty-result cases.

### Firebase seams

Avoid initializing Firebase as a side effect of importing business logic. Wrap Firebase operations behind narrowly scoped modules or inject operations into providers and Function handlers. This allows most tests to use lightweight fakes while preserving emulator tests for real Firebase behavior.

## Coverage priorities

Coverage work should follow risk, not file order.

| Priority | Area | Required behavior |
| --- | --- | --- |
| P0 | Authentication and role handling | anonymous, authenticated, admin-role, admin-enabled, QA-role, expired/error states, guards and redirects |
| P0 | Profile privacy | self receives full subscription; authorized admin can request another full profile; anonymous and ordinary users receive only the public representation; transitions unsubscribe and do not leak stale full data |
| P0 | DBContext | subscription establishment/cleanup, initial `READ` versus subsequent `REFRESH`, writes and transactions, errors, cache invalidation, and user changes |
| P0 | Firestore rules | anonymous/self/admin/non-admin get/list/write matrix for protected collections, including lock collections and profile-related data |
| P0 | Incremental change indexes | create/update/delete behavior for lockcollections, awards, and evidence; timestamp and document-ID contract; retry/idempotency expectations |
| P0 | Mutating forms | validation, authorization, duplicate submission, success/failure, and retry for belt requests, ranking requests, profile/content changes, and RAFL actions |
| P0 | API client behavior | auth headers, abort/cancellation, timeout, non-JSON/error responses, and user-facing error state |
| P1 | Search and filtering | debouncing, stale updates, slow typing, clear/back/forward behavior, query-string round trips, advanced filters, sort stability, empty results |
| P1 | Scoring and data providers | representative calculations, edge cases, missing data, memoized/derived state, and refresh behavior |
| P1 | Route composition | provider requirements, route parameters, guards, not-found behavior, and representative route families |
| P1 | Awards/evidence/request flows | list/detail/edit boundaries, loading/error/empty states, and cross-record relationships |
| P1 | Import/export transforms | fixture-driven input/output contracts, deletion handling, restart safety, and malformed input |
| P2 | Static content and presentation | representative shared layouts, accessibility smoke checks, and a small number of responsive/visual checks |

## Required scenario suites

### ProfileContext and authorization

At minimum, test:

- anonymous public-profile request
- logged-in user requesting their own profile
- ordinary logged-in user requesting another user's profile
- administrator requesting another user's full profile
- administrator role present but local admin mode disabled, where applicable
- missing, denied, and failed profile requests
- changing `userId` while a request is pending
- logout and role changes while subscribed
- unsubscribe on unmount or source change
- no stale full-profile fields after moving from an authorized to an unauthorized state

### DBContext and subscriptions

At minimum, test:

- one listener is established for one logical subscription
- listener reuse or deduplication follows the intended public contract
- each consumer cleanup does not prematurely remove a listener still in use
- final cleanup unsubscribes
- the first snapshot records `READ`
- later snapshots record `REFRESH`
- callback errors and permission errors reach a visible/recoverable state
- authentication changes recreate or remove listeners correctly

### Search and FilterContext

At minimum, test with fake timers and real user events:

- rapid typing
- deliberately slow typing across debounce boundaries
- a delayed older update cannot overwrite newer input
- clearing during a pending update
- external URL/filter changes while the input is focused
- browser back/forward navigation
- unmount cleanup
- no state update after unmount

### Cloud Function change indexes

Extract the trigger body into a pure/injected handler and test:

- create, update, and delete events
- the expected index document path and payload
- server timestamp injection
- missing event data or document ID behavior
- repeated delivery/idempotency expectations
- Firestore write failure propagation
- all three source/index pairs: lockcollections, awards, and evidence

One emulator integration test per trigger should then confirm that deployed trigger definitions call the shared behavior correctly.

### Firestore rules

Once rules are source-controlled, create table-driven tests for each protected collection:

- unauthenticated get/list/create/update/delete
- owner get/list/create/update/delete as applicable
- authenticated non-owner/non-admin
- admin custom claim
- supported legacy/admin-document mechanism, if it remains intentional
- malformed or spoofed fields
- queries whose shape cannot satisfy the rule

Every rule change should require an accompanying allow-and-deny test.

## End-to-end journey set

Start with these browser journeys:

1. Anonymous visitor loads the app, searches slowly and rapidly, filters locks, opens a lock detail, and uses browser back/forward.
2. Anonymous visitor opens a public profile and never sees full-profile-only fields.
3. Authenticated user opens their own collection/profile and observes a saved change.
4. Ordinary authenticated user cannot access another user's full profile or admin routes.
5. Administrator opens another user's full profile and an administrative route when admin mode is enabled.
6. A belt or ranking request validates input, submits successfully, and displays server failure without duplicate submission.
7. Award/evidence data loads and updates through the intended public interface.
8. One representative RAFL user flow and one admin boundary.

Add a content-upload journey only after file upload and storage are fully isolated from production. Do not use Playwright to exhaustively verify static pages already covered by shared route tests.

Before enabling these journeys in CI:

- Correct URLs to use the application's hash-routing format, such as `/#/locks`.
- Remove unreachable debugging code from `makeAutocomplete.spec.js`.
- Build before `vite preview`, or use a Playwright web server command that performs an explicit test build.
- Set deterministic environment values in the web server process.
- Configure retries only in CI, retain trace on first retry, and collect screenshots/videos on failure.
- Begin with Chromium. Add Firefox and WebKit only after the suite is stable and there is a supported-browser requirement.

## Coverage policy

Install `@vitest/coverage-v8` at the version compatible with the installed Vitest release. Then collect a real baseline before making coverage blocking.

Use this ratchet:

1. Publish coverage for one or two iterations without failing builds.
2. Exclude generated datasets, static resources, route declarations, entry bootstrap files, and test support only when they contain no meaningful behavior. Document every exclusion.
3. Require new or materially changed testable code to meet approximately 80% lines/functions/statements and 70% branches.
4. Set the first global floor just below the measured baseline so coverage cannot regress.
5. Raise the floor in milestones toward at least 75% lines/functions/statements and 65% branches, adjusting by risk and value rather than calendar date.
6. Hold security, authorization, scoring, and data-mutation modules to scenario-completeness even if their line percentage is already high.

Do not activate the existing 70% global thresholds before measuring the baseline. Doing so would encourage rushed, low-value tests or make the test command unusable during migration.

## Commands and configuration

Add explicit scripts with narrow responsibilities:

```json
{
  "test": "vitest",
  "test:unit": "vitest run --project unit",
  "test:integration": "vitest run --project integration",
  "test:coverage": "vitest run --coverage",
  "test:functions": "npm --prefix functions test",
  "test:rules": "firebase emulators:exec --only firestore 'vitest run --project firebase'",
  "test:e2e": "playwright test",
  "test:ci": "npm run test:unit && npm run test:integration && npm run test:functions && npm run test:rules"
}
```

The exact Vitest project syntax should be implemented against Vitest 4's supported configuration. If separate config files are clearer than projects, preserve the command boundaries while using those files.

Keep `ci-build` separate from test setup because it performs generation, import, and export work. Add a safe validation command that performs only lint, tests, and a deterministic frontend build.

## CI plan

### Pull requests

Required checks should run in parallel where practical:

- ESLint
- unit and component/integration tests
- Functions unit tests
- Firestore rules tests against the emulator
- production-mode frontend build using non-production test configuration
- Chromium Playwright smoke journeys once deterministic

Target less than five minutes for the required pull-request path. Split jobs and cache npm/Playwright assets if needed, but never weaken isolation to gain speed.

Upload on failure:

- Vitest/Functions test output
- coverage report
- Playwright HTML report, trace, screenshot, and video where configured

### Main branch and deployment

Require the same checks as pull requests before deployment. Deployment itself remains approval-gated. A failed or skipped required test must prevent deployment.

### Scheduled checks

Use a nightly or scheduled workflow for slower coverage such as:

- full Playwright suite
- additional supported browsers or mobile viewport
- broader emulator integration
- optional dependency/security checks

Scheduled failures must create a visible issue or notification; otherwise the suite will decay unnoticed.

## Phased implementation

### Phase 0: Make the baseline trustworthy

- Install the Vitest coverage provider and record the baseline.
- Add safe, explicit test commands.
- Add Firebase/API production guards to test bootstrap.
- Fix Playwright hash URLs, dead code, and fresh-build behavior.
- Ensure every HTTP request is intercepted or fails the test.
- Add tests to pull-request CI without enabling unsafe browser/Firebase tests prematurely.
- Document how to run each layer locally.

Exit criteria:

- A clean checkout can run the fast suite with one documented command.
- The command needs no production credentials or network access.
- Repeated runs produce the same result.
- No tests are collected from dependencies, build output, Functions, or unrelated sibling repositories.

### Phase 1: Build reusable test seams

Progress: the configurable core provider/router harness was completed during the major-dependency Phase 0 baseline. The remaining work is domain factories, narrower global mocks, broader MSW domains, and Firebase adapters.

- Maintain and extend the configurable production-like render helpers.
- Replace broad global context mocks with per-test provider values.
- Add domain factories and minimal fixtures.
- Expand MSW handlers and error/delay controls.
- Introduce narrow Firebase adapters or dependency injection.
- Separate pure behavior from large contexts/components as those areas are tested.

Exit criteria:

- A new route/provider test can be written without copying provider boilerplate.
- Tests can model anonymous, ordinary, admin, loading, and failure states explicitly.
- Unit and component tests do not initialize real Firebase.

### Phase 2: Cover P0 security and data integrity

- Complete AuthContext, ProfileContext, and route-guard suites.
- Complete DBContext subscription/write tests.
- Source-control Firestore rules and emulator configuration.
- Add authorization matrix tests.
- Add Cloud Function handler and trigger tests.
- Cover API clients and mutating request forms.
- Add contract fixtures shared conceptually with `explore-lpubelts-com-node` for incremental export indexes.

Exit criteria:

- Every documented role has allow and deny coverage.
- Full-profile data has tests proving it is not exposed after unauthorized transitions.
- Create/update/delete index behavior is covered for lockcollections, awards, and evidence.
- No P0 path requires production Firebase for verification.

### Phase 3: Cover P1 application behavior

- Expand search/filter/URL synchronization tests.
- Cover scoring calculations and providers.
- Cover representative route families and provider composition.
- Cover awards, evidence, ranking, belt, profile-edit, and RAFL flows.
- Refactor import/export scripts into pure transformations plus thin CLI wrappers and test transformations with temporary fixtures.

Exit criteria:

- Each major interactive domain has success, empty, loading, failure, and authorization coverage where relevant.
- Generated-data changes can be validated from small fixtures.
- Changed-code and global coverage ratchets are active.

### Phase 4: Establish browser confidence

- Implement the critical Playwright journeys.
- Run them against mocked services or emulators.
- Add CI retries, traces, and artifacts.
- Add basic accessibility checks to critical forms and navigation, using `@axe-core/playwright` or an equivalent only after the base suite is stable.

Exit criteria:

- Critical journeys pass from a fresh build without production access.
- Failures include enough artifacts to diagnose locally.
- The suite has no arbitrary sleeps and no known flaky tests.

### Phase 5: Make quality sustainable

- Raise coverage floors in small increments.
- Assign ownership by feature area.
- Add a test expectation to the pull-request template.
- Review flaky, skipped, and slow tests regularly.
- Remove obsolete tests instead of preserving misleading coverage.
- Revisit supported browsers and accessibility depth based on actual product requirements.

## Maintenance policy

- Every bug fix should add a regression test at the lowest layer that can reproduce the bug.
- Every authorization or Firestore rule change must include both permitted and denied cases.
- Every new mutation must test success, validation failure, service failure, and duplicate/retry behavior where applicable.
- Avoid `test.skip` without a linked issue, owner, and short resolution target.
- Quarantine a flaky test only when it is blocking unrelated work; do not silently remove it from required checks.
- Prefer deterministic clocks, IDs, and fixtures. Restore fake timers and mocks after every test.
- Keep individual unit/component tests independent and parallel-safe.
- Treat tests that require ordering or shared mutable state as defects to fix.
- Review the slowest tests and ignored coverage paths quarterly.

## Definition of done for feature work

A feature or fix is complete when:

- behavior is tested at the lowest effective layer
- user-visible loading, empty, error, and authorization states are covered when applicable
- a regression test accompanies a bug fix
- no production service or credential is required to run the test
- relevant lint, test, and build commands pass locally or in CI
- any intentional coverage decrease is explained and approved
- manual review needs are called out explicitly

## Initial implementation backlog

The recommended first pull requests are:

1. Testing infrastructure: coverage provider, safe scripts, test environment guard, CI unit-test job, and contributor documentation.
2. Test harness: configurable provider rendering, factories, and MSW domain handlers.
3. Profile security: AuthContext/ProfileContext role and data-exposure matrix.
4. Firestore safety: source-controlled rules, emulator setup, and rule tests.
5. Data subscriptions: DBContext listener lifecycle and `READ`/`REFRESH` tests.
6. Incremental indexes: Cloud Function unit/emulator tests and exporter contract fixtures in the sibling Node repository.
7. Search regression suite: slow typing, stale debounce, URL synchronization, and navigation.
8. Playwright repair: hash routes, fresh builds, deterministic services, then the first anonymous and authenticated journeys.

Keep these pull requests focused. Infrastructure changes should not be combined with broad application refactors unless the refactor is the seam required for the tests.

## Decisions to confirm during implementation

The plan can begin with the recommendations below; these are not blockers for writing the first tests:

- Use a non-deployable Firebase demo project ID for automated emulator tests. If `lpubelts-dev` must be used, enforce emulator-only startup with a hard guard.
- Start Playwright CI with Chromium only; add Firefox/WebKit when browser-support requirements justify the runtime.
- Target a sub-five-minute required pull-request suite and move slower breadth to scheduled CI.
- Retain Allure only if its reports are actively consumed; otherwise prefer built-in Vitest and Playwright reports to reduce maintenance.
- Keep broad global coverage as a ratchet, while treating security and data-integrity scenarios as mandatory regardless of percentages.

## Success measures

The testing initiative is succeeding when:

- developers routinely run the fast suite because it is quick and dependable
- regressions are usually caught before manual review or production
- authentication, profile privacy, Firestore rules, and mutations have explicit allow/deny and success/failure coverage
- the suite never accesses production services
- flaky-test count remains zero or has visible, time-bounded remediation
- coverage rises without a corresponding growth in snapshots, sleeps, or implementation-detail assertions
- deploy workflows cannot proceed when required tests fail
