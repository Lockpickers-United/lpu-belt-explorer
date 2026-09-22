# Major Dependency Upgrade Implementation Report

Status: Phases 0–9 and post-upgrade audit remediation complete; Node 24 Functions production rollout pending approval  
Last updated: 2026-09-15

This report tracks implementation of `internal-docs/major-dependency-upgrade-plan.md`. It should be extended after each major-upgrade phase with the versions changed, migration decisions, failures encountered, verification performed, and any deferred work.

## Progress

| Phase | Status | Completed |
| --- | --- | --- |
| Phase 0: Create a controlled upgrade baseline | Complete | 2026-09-14 |
| Phase 1: Align all environments on Node 24 LTS | Complete; production rollout pending approval | 2026-09-14 |
| Phase 2: Migrate ESLint 8 to 9 to 10 | Complete | 2026-09-14 |
| Phase 3: Upgrade Vitest 4 to 5 | Complete | 2026-09-14 |
| Phase 4A: Prepare MUI under v5 | Complete | 2026-09-14 |
| Phase 4B: Upgrade MUI 5 to 6 | Complete | 2026-09-14 |
| Phase 5: Upgrade React 18 to 19 | Complete | 2026-09-14 |
| Phase 6: Upgrade React Router 6 to 7 | Complete | 2026-09-15 |
| Phase 7: Advance MUI/MUI X to 9 | Complete | 2026-09-15 |
| Phase 8: Upgrade Firebase 11 to 12 | Complete | 2026-09-15 |
| Phase 9: Upgrade Vite 6 to 7 to 8 | Complete | 2026-09-15 |

## Phase 0: Create a controlled upgrade baseline

### Summary

Phase 0 established a compatibility-focused baseline before any requested major version was changed. The frontend suite now has explicit contracts around React provider lifecycles, profile privacy, Firestore listener cleanup and transactions, router redirects and lazy routes, OAuth callback denial paths, representative MUI interactions, Firebase configuration, and search/history synchronization.

The baseline is isolated from live services. Vitest uses mocked contexts and Firebase adapters; OAuth callback tests prove denied callbacks do not call `fetch`; Playwright blocks non-loopback API/module requests, substitutes local responses for external fonts and images, disables tracking and Firestore subscriptions in its test-only build, and fails on browser console warnings/errors, page errors, or failed application modules.

No major dependency was upgraded, no production deployment was performed, and no live-data script was run.

### Recorded environment and dependency baseline

The implementation was performed on branch `main` at initial commit `fe7220ce30` (`update github scripts to node 24 compatible`). The branch was clean before Phase 0 changes began.

| Item | Recorded value |
| --- | --- |
| Local Node | 24.15.0 |
| Local npm | 11.12.1 |
| Declared project Node engine | 22 |
| React / React DOM | 18.3.1 |
| Firebase web SDK | 11.10.0 |
| Material UI | 5.18.0 |
| MUI X Date Pickers | 6.20.2 |
| React Router DOM | 6.30.6 |
| Vite | 6.4.3 |
| Vitest / UI / coverage | 4.1.11 |
| ESLint | 8.57.1 |

The first `npm ls --depth=0` found 315 extraneous top-level entries left in `node_modules`, primarily tooling brought in during earlier Firebase CLI execution. `npm prune` removed 605 extraneous packages. A subsequent `npm ls --depth=0` completed with only declared dependencies.

`npm audit` reports five moderate vulnerabilities:

- `csv-parse` before 7.0.2; the proposed direct fix is a breaking major update
- `react-router`/`react-router-dom` through 7.17.0; the proposed fix is React Router 7.18.3 and is intentionally part of the planned major migration
- a transitive `uuid` before 11.1.1 through `gaxios`; a non-forced transitive fix is available

No automatic audit fix was applied. Security remediation should be handled deliberately in the relevant dependency phase rather than folded into this baseline.

### Test infrastructure changes

#### Configurable render harness

`src/test/render.jsx` now provides production-order context wrappers with explicit per-test overrides for Auth, DB, API, App, and Scoring state. Anonymous-safe defaults remain available, and router helpers accept route/history and provider options. Test routers opt into the React Router 7 transition and relative-splat compatibility flags so current tests exercise those upcoming semantics.

Vitest now explicitly sets `clearMocks: true`. Running the complete suite with this setting did not expose unresolved test-order dependencies. The jsdom bootstrap provides a stable `window.scrollTo` implementation so delayed navigation and expansion callbacks do not leak false console errors into later tests.

#### Provider and Firebase contracts

New provider tests cover:

- Auth observer registration and cleanup, anonymous and signed-in transitions, true custom-claim filtering and refresh, popup success/failure, and logout
- Profile self-subscription reuse, anonymous and ordinary-user public summaries, both administrator claims, request failure, stale request cancellation, and removal of private fields after authorization is lost
- DBContext listener behavior under Strict Mode, final cleanup, a representative Firestore transaction, and recoverable permission errors
- Firebase config defaults, development database selection, and emulator endpoint parsing through pure initialization helpers

Extracting Firebase option derivation into `src/auth/firebaseConfig.js` made initialization branches directly testable while leaving the runtime initialization module thin.

#### Router and callback contracts

The real route declaration is exercised with a data-memory router for root, legacy, and unknown redirects; a representative lazy content route; search-parameter preservation; the configured route error boundary; and anonymous/admin route access. The test replaces only the lock-list destination with a local element to avoid loading unrelated data-fetching behavior during redirect assertions.

Discord and Reddit denied-callback paths are rendered independently. Both assert their user-visible status and that no external request occurs.

#### MUI interaction contracts

Representative behavior tests now cover:

- Dialog focus containment, keyboard tab order, confirm, explicit close, and Escape dismissal
- keyboard operation and resulting state for Select
- Autocomplete typing, keyboard selection, clearing, and no-match actions
- accepted and oversized Dropzone files
- displayed and submitted Evidence Form dates
- Tabs selection and Accordion expansion through the lock-list suite

Assertions use accessible names, roles, values, and resulting state rather than generated classes, snapshots, or exact MUI DOM structure.

#### Search and asynchronous assertions

The existing delayed/slow typing regression remains covered. Additional tests cover back/forward navigation and debounce cleanup on unmount. The history test exposed a real race: a second URL-driven query change could be rejected because debounce state still represented the first URL. SearchBox now tracks genuine local edits separately from URL synchronization, preserving newer typing while allowing consecutive external/history updates.

The suite was audited for asynchronous Testing Library queries and promise matchers. All discovered `findBy*`, `waitFor`, `.resolves`, and `.rejects` assertions are awaited. One legacy lock-detail assertion that previously tested a Promise object was corrected to await the expanded content.

### Product issues found while establishing the baseline

The compatibility tests found and corrected four current-version defects:

1. `SelectBox` labels were not programmatically associated with their Select controls. It now supplies matching `InputLabel.id` and `Select.labelId` values and always uses a controlled empty value.
2. Dropzone could clear a rejection message because `onDrop` runs with an empty accepted-file array after `onDropRejected`. Rejection errors are now cleared only after at least one accepted file.
3. The dialog close icon had no accessible name and could propagate its click to ancestors. It now has `aria-label="Close dialog"` and stops click propagation.
4. SearchBox could ignore immediate browser history changes while its debounce value lagged. Local user edits and externally synchronized values are now tracked separately.

### Browser isolation and clean-console enforcement

The Playwright fixture now collects console warnings/errors, uncaught page errors, and failed same-origin script requests and fails each journey after its assertions if any are present. The first run exposed previously hidden errors from analytics images, a missing LockBazaar JSON fixture, external lock images/fonts, and the anonymous system-message Firestore listener.

Remediation was test-specific:

- tracking renders nothing in Vite `test` mode
- the Playwright build sets `VITE_DISABLE_FIRESTORE_SUBSCRIPTIONS=true`; DBContext honors it only in `test` mode and leaves production behavior unchanged
- a deterministic empty LockBazaar fixture is served from `public/test-data`
- Google Fonts CSS and external image requests are fulfilled locally by Playwright without contacting those hosts
- every other non-loopback request is aborted; resulting console errors fail the test

An Auth emulator port was added to `firebase.json` to match `.env.test` and make future Auth emulator work explicit. The current anonymous browser journeys do not need a running Firebase emulator because all Firestore subscriptions are disabled in their test-only build.

### Verification results

| Command/check | Result |
| --- | --- |
| `npm run ci-pr` | Passed: lint, 18 Vitest files / 76 tests, isolated test build |
| `npm run test:coverage` | Passed with no unhandled errors |
| `npm run e2e` | Passed: 9 Chromium journeys with clean browser consoles |
| `npm run test:functions:integration` | Passed create/update/delete for lockcollections, awards, and evidence |
| `npm run build` | Passed: 4,452 modules transformed |
| `npm --prefix functions run lint` | Passed |
| Async assertion source audit | All matching assertions awaited |
| `npm ls --depth=0` after prune | Passed; no extraneous top-level dependencies |

Coverage after the compatibility additions:

| Metric | Phase 0 baseline |
| --- | ---: |
| Statements | 18.41% (2,143 / 11,640) |
| Branches | 14.75% (1,306 / 8,852) |
| Functions | 16.83% (543 / 3,225) |
| Lines | 18.55% (2,005 / 10,805) |

Coverage remains informational; the existing testing strategy intentionally defers a global threshold until a sustainable ratchet is selected.

### Production build baseline

The production build occupies approximately 20,904 KiB on disk, including copied public data and assets. `dist/assets` occupies approximately 10,404 KiB.

The build emits the existing Vite warning for chunks larger than 500 kB. The three largest minified JavaScript chunks are:

| Chunk purpose | Minified | Gzip |
| --- | ---: | ---: |
| Main index | 3,532.52 kB | 655.11 kB |
| Dropzone | 1,417.87 kB | 359.90 kB |
| Award route | 1,153.01 kB | 510.56 kB |

These values are comparison points, not assertions tied to hashed filenames. Bundle optimization is outside Phase 0.

### Findings and deferred work

- At the Phase 0 checkpoint, the local shell used Node 24.15.0 while `package.json` declared Node 22 and the Functions emulator requested Node 22. The Functions emulator therefore warned and used host Node 24. Phase 1 resolved this configuration mismatch by adopting Node 24 throughout the project.
- The Functions integration suite warns that no Firestore rules file is configured and therefore runs with open emulator rules. Trigger wiring is validated, but authorization is not. Rules source control and authorization matrices remain in testing Phase 2.
- The current Playwright suite is intentionally anonymous and narrow. Authenticated/admin browser journeys still require explicit emulator fixtures in later testing phases.
- Root and Functions ESLint still use legacy configuration. That remains Phase 2 of the major-upgrade plan.
- MUI deprecated API removal and React/Router warning migration are intentionally deferred to their dedicated phases.
- The production build's large chunks should be monitored through each phase, especially the Vite and MUI upgrades.

### Phase 0 exit criteria

- [x] New compatibility tests pass against current dependency versions.
- [x] Automated tests do not contact live Firebase or external APIs.
- [x] Playwright fails on browser console warnings/errors and failed application modules.
- [x] Tests assert user-visible behavior instead of generated MUI structure or bundle names.
- [x] Baseline versions, audit findings, coverage, bundle sizes, and warnings are recorded.
- [x] Production deployments and live-data scripts remain approval-gated and were not executed.

## Phase 1: Align all environments on Node 24 LTS

### Summary

Phase 1 replaced the mixed Node 22/24 configuration with one Node 24 LTS baseline. Local development and GitHub Actions now resolve the exact release in `.nvmrc`; frontend package metadata permits supported Node 24 LTS patches; and the Functions package selects Firebase's `nodejs24` runtime for its next deployment.

Node 24 is appropriate for this repository because the three Firestore triggers use `firebase-functions/v2/firestore`. Google Cloud supports Node 24 for second-generation Cloud Run functions through April 2028, and Firebase CLI added Node 24 host and deployment support in versions 14.25 and 14.26 respectively. The emulator suite is pinned to Firebase CLI 15.30.0.

No application dependencies were upgraded in this phase. No production deployment or live-data script was run. The source configuration is ready for a later approval-gated Functions deployment.

### Runtime configuration changes

| Surface | Previous | Phase 1 configuration |
| --- | --- | --- |
| Local nvm version | Node 22 major (`v22`) | Exact tested release (`v24.15.0`) |
| Root package engine | Node 22 | `>=24.11.0 <25` |
| Firebase Functions engine | Node 22 | Node 24 / `nodejs24` |
| Build workflow | Independently specified Node 22 | Reads `.nvmrc` |
| Pull-request workflow | Independently specified Node 22 | Reads `.nvmrc` |
| Import workflow | Independently specified Node 22 | Reads `.nvmrc` |
| Contributor/agent guidance | Required Node 22 | Requires the Node 24 release pinned in `.nvmrc` |

The root engine begins at Node 24.11.0 because that is the first Node 24 LTS release. It is bounded below Node 25 so unsupported odd or future majors do not silently satisfy the project requirement. Firebase's Functions runtime selector accepts a major version, so `functions/package.json` intentionally uses `"24"` rather than the frontend range.

All workflows use `node-version-file: '.nvmrc'`, eliminating three duplicated version declarations. The build workflow's path filter now includes `.nvmrc`, ensuring that a future runtime-only change triggers the normal build workflow.

`README.md` and `AGENTS.md` were updated with the same requirement. npm itself was not separately pinned: pinning the complete Node distribution in CI supplies a consistent bundled npm, while the recorded local npm version remains 11.12.1.

### Installation and dependency findings

The implementation and verification shell reported:

| Tool | Version |
| --- | ---: |
| Node | 24.15.0 |
| npm | 11.12.1 |
| Firebase CLI used by integration test | 15.30.0 |

Fresh `npm ci` installations succeeded for both the root application and the Functions package without engine mismatch warnings. Root and Functions `npm ls --depth=0` checks also passed.

The clean installs retained existing dependency deprecation notices, including ESLint 8 and older transitive `glob`, `rimraf`, and `uuid` packages. These are dependency migration findings, not Node 24 regressions.

The root audit remains at five moderate vulnerabilities: the previously recorded `csv-parse`, React Router, and transitive `uuid` paths. The separate Functions dependency tree reports ten moderate vulnerable package paths, rooted in `firebase-admin`, `firebase-functions-test`, and their transitive Google Cloud, merge, request, and UUID dependencies. No automatic or forced audit fix was applied; those changes belong in the relevant dependency phases.

### Verification results

All checks below ran under Node 24.15.0:

| Command/check | Result |
| --- | --- |
| `npm ci` | Passed; 998 packages installed, no engine mismatch |
| `npm --prefix functions ci` | Passed; 578 packages installed, no engine mismatch |
| `npm ls --depth=0` | Passed |
| `npm --prefix functions ls --depth=0` | Passed |
| `npm run ci-pr` | Passed: frontend lint, 18 Vitest files / 76 tests, test-mode build |
| `npm run test:coverage` | Passed; Phase 0 coverage unchanged |
| `npm run e2e` | Passed: 9 Chromium journeys |
| `npm run build` | Passed: 4,452 modules transformed |
| `npm --prefix functions run lint` | Passed |
| `npm run test:functions:integration` | Passed create/update/delete for lockcollections, awards, and evidence |

The Functions emulator explicitly reported `Using node@24 from host`; the Phase 0 Node-version mismatch warning is gone. Test and production builds still emit the known warning for chunks larger than 500 kB. Coverage remains 18.41% statements, 14.75% branches, 16.83% functions, and 18.55% lines.

### Remaining risks and manual actions

- Production Functions continue using their currently deployed runtime until an explicitly approved deployment applies `nodejs24`. That deployment was intentionally not performed.
- The ignored local WebStorm workspace still records a Node 22.15 interpreter/npm path. Because `.idea/workspace.xml` is machine-specific and not source controlled, it was not edited automatically. Select Node 24.15.0—or configure WebStorm to follow `.nvmrc`—before running ESLint or scripts through the IDE.
- Firebase's general Functions management guide still lists Node 20 and 22, despite Firebase CLI release notes explicitly adding `nodejs24` deployment support and Google Cloud listing Node 24 as GA for second-generation functions. Reconfirm those sources before the eventual production deployment.
- The Firestore emulator still warns that no rules file is configured and therefore uses open rules. This is unchanged from Phase 0 and does not affect the trigger event contract tested here.
- The Functions `package-lock.json` is tracked and supports reproducible `npm ci` installs, even though the repository's current ignore patterns would ignore a newly created lockfile. This phase did not change that policy.

### Phase 1 exit criteria

- [x] Source-controlled local, package, CI, and Functions runtime declarations agree on Node 24.
- [x] Root and Functions dependency installations complete without Node engine warnings.
- [x] Frontend lint, tests, coverage, browser tests, and both builds pass under Node 24.15.0.
- [x] Functions lint and emulator integration pass under Node 24.15.0.
- [x] Documentation records the runtime rationale, verification evidence, and production rollout boundary.
- [x] No production deployment or live-data script was run.

## Phase 2: Migrate ESLint 8 to 9 to 10

### Summary

Phase 2 migrated both lint targets from legacy eslintrc configuration to native ESLint 10 flat configuration. The migration passed through an ESLint 9.39.5 checkpoint first, where the root and Functions configurations were converted and linted successfully before advancing to ESLint 10.10.0.

The frontend now uses `eslint.config.js`; Functions uses its independent `functions/eslint.config.js`. The three legacy config files were removed. Both npm lint commands retain their existing scope: the root checks `src/` and `scripts/`, while the Functions package checks its complete JavaScript package.

No compatibility flag, forced install, legacy peer-dependency mode, deployment, or live-data operation was used.

### Dependency changes

| Package | Previous | Phase 2 |
| --- | ---: | ---: |
| Root `eslint` | 8.57.1 resolved | 10.10.0 |
| Functions `eslint` | 8.57.1 resolved | 10.10.0 |
| `@eslint/js` | — | 10.0.1 in both packages |
| `globals` | — | 17.12.0 in both packages |
| `eslint-plugin-import` | 2.32.0 resolved | Removed |
| `eslint-plugin-import-x` | — | 4.17.1 |
| `eslint-import-resolver-node` | Transitive/implicit | 0.4.0 direct dev dependency |
| `eslint-plugin-react` | 7.37.5 resolved | Removed |
| `eslint-plugin-react-hooks` | 7.1.1 resolved | 7.1.1 retained |
| Functions `eslint-config-google` | 0.14.0 | Removed |

The root lockfile and the separately tracked Functions lockfile were regenerated by npm. Clean `npm ci` installs succeeded for both packages. The existing audits remain at five moderate findings in the root tree and ten moderate findings in Functions; no audit fix was folded into this phase.

### Flat-config migration

The root flat configuration preserves:

- the explicit `src/` and `scripts/` lint scope
- browser, Node, and ES globals
- latest ECMAScript module parsing with JSX
- current warning levels for quotes, semicolons, strict equality, import extensions, unused values, and Hook dependencies
- underscore-prefixed unused argument, variable, caught-error, and destructuring conventions
- the scripts-only requirement for extensions on relative JavaScript imports
- current ignored non-code/generated file extensions
- the prior behavior of not reporting stale `eslint-disable` comments

`eslint-plugin-import-x` is a maintained ESLint-10-compatible replacement for `eslint-plugin-import`. Its Node resolver is declared directly so module analysis does not depend on an optional transitive install. Package subpaths such as `firebase-admin/firestore` and `csv-parse/sync` are explicitly ignored by the extension rule, matching the prior plugin's effective behavior.

The Functions flat configuration combines `@eslint/js` recommended correctness rules with explicit project conventions for CommonJS, Node globals, two-space Google-style continuation indentation, double quotes, semicolons, line length, spacing, arrow callbacks, unused parameters, and restricted global names. This removes the seven-year-old legacy-only `eslint-config-google` dependency and its obsolete JSDoc rules. The trigger source was auto-formatted to add the semicolons required by both the old Google configuration and the repository's documented Functions convention; no executable behavior changed.

### ESLint 9 checkpoint and ESLint 10 migration

ESLint 9.39.5 was installed temporarily in both packages. The completed flat configurations produced clean root and Functions lint runs before the ESLint 10 dependency change.

The official `@eslint/v9-to-v10` codemod was then run in dry-run mode with filesystem access limited to the repository. It scanned 5,101 files, would modify zero files, and confirmed that the project has no custom rule, RuleTester, Linter API, removed CLI-flag, or legacy environment-directive migration requiring an automatic rewrite. A repository search also found no source `eslint-env` directives.

ESLint 10.10.0 and `@eslint/js` 10.0.1 then loaded both flat configs natively. JSX identifiers are tracked by ESLint 10 itself, so JSX component references continue to participate in `no-undef` and `no-unused-vars` without the old React plugin workaround rules.

### Deliberate compatibility decisions

#### React lint plugin

The published `eslint-plugin-react` 7.37.5 peer range stops at ESLint 9 and its current rule implementation uses APIs removed in ESLint 10. An isolated npm install probe failed peer resolution, and loading it through an override would not be reliable. It was removed rather than forced.

This creates a known temporary reduction in React-specific static checks. ESLint 10's native JSX analysis replaces `react/jsx-uses-vars` and `react/jsx-no-undef`; the automatic JSX runtime makes `react/react-in-jsx-scope` unnecessary; and `react/prop-types` was already disabled. However, additional diagnostics such as `jsx-key`, unknown JSX properties, deprecated React APIs, unsafe state mutation, string refs, and malformed component return behavior are not currently enforced by lint. The existing React behavior tests remain the safety net for this phase.

Unused legacy default `React` imports continue to be accepted through the existing unused-variable exception. Removing those imports across hundreds of files is source cleanup and should be handled separately, preferably during the React 19 phase. Reintroduce a supported React ruleset when `eslint-plugin-react` publishes ESLint 10 support or a JavaScript-only alternative can be adopted without adding a TypeScript toolchain solely for linting.

#### Newly recommended core rules

ESLint 9 and 10 promoted additional correctness rules that identify pre-existing source patterns. To preserve the Phase 0 behavioral baseline and keep this change reviewable, the flat config explicitly disables them for now:

| Deferred rule | Existing findings observed during migration |
| --- | --- |
| `no-constant-binary-expression` | Constant-truthy `||` expressions in `DataTableSort.jsx` and `RaffleReportsPotTable.jsx` |
| `no-useless-assignment` | Overwritten assignments in `scripts/importDan.js`, `AuthDiscordRoute.jsx`, and `AuthRedditRoute.jsx` |
| `preserve-caught-error` | A replacement error without `cause` in `src/util/datetime.js` |

These should be reviewed, corrected where appropriate, and enabled in a focused lint-hardening change. They were not auto-fixed or hidden through inline suppressions.

### Verification results

| Command/check | Result |
| --- | --- |
| Root ESLint 9 flat-config checkpoint | Passed with no findings |
| Functions ESLint 9 flat-config checkpoint | Passed after convention-only semicolon formatting |
| `npx codemod run @eslint/v9-to-v10 --dry-run ...` | Passed; 5,101 unchanged files, zero proposed changes |
| `npm ci` | Passed; 977 packages installed |
| `npm --prefix functions ci` | Passed; 565 packages installed |
| `npm run lint` | Passed under ESLint 10.10.0 |
| `npm --prefix functions run lint` | Passed under ESLint 10.10.0 |
| `npm run ci-pr` | Passed: lint, 18 Vitest files / 76 tests, and isolated test-mode build |

The test-mode build still reports the known warning for chunks larger than 500 kB. npm continues to warn that the repository's `min-release-age` npm setting will no longer be recognized by the next npm major; that warning is unrelated to ESLint.

### Phase 2 exit criteria

- [x] Root and Functions use independently scoped flat configurations.
- [x] Both lint commands run natively on ESLint 10 without compatibility flags or peer overrides.
- [x] Existing custom lint severity, globals, file scope, ignore behavior, and import-extension behavior are preserved.
- [x] ESLint 10 compatibility changes and reduced React-specific coverage are explicit.
- [x] New recommended-rule findings are recorded for focused follow-up rather than mixed into the migration.
- [x] Clean installs, frontend lint/tests/build, and Functions lint pass.
- [x] No production deployment or live-data script was run.

## Phase 3: Upgrade Vitest 4 to 5 on Vite 6

### Summary

Phase 3 upgraded the test runner, UI, and V8 coverage provider together from 4.1.11 to 5.0.0 while retaining Vite 6.4.3. The existing suite required no source or configuration compatibility edits: all 18 test files and 76 tests pass under Vitest 5, explicit mock clearing remains enabled, and the current test/coverage file scopes remain unchanged.

The upgrade was dependency-only outside documentation. No application source, test source, Vitest configuration, production deployment, or live-data operation changed.

### Dependency changes

| Package | Previous | Phase 3 |
| --- | ---: | ---: |
| `vitest` | 4.1.11 | 5.0.0 |
| `@vitest/ui` | 4.1.11 | 5.0.0 |
| `@vitest/coverage-v8` | 4.1.11 | 5.0.0 |
| `vite` | 6.4.3 resolved | 6.4.3 resolved, unchanged |

All three Vitest packages remain exact-pinned at one version, satisfying their exact peer relationships. Vitest 5 requires Vite 6.4 or newer and Node 22.12 or newer; the project's Vite 6.4.3 and Node 24 LTS baseline satisfy those requirements without an override. The root audit remains at five moderate findings, unchanged by this phase.

The first install used the WebStorm-hosted Node 24.13.0/npm 11.6.2 process, which is within the declared Node 24 LTS range. Final validation explicitly used `.nvmrc`'s Node 24.15.0 and its bundled npm 12.0.2. npm 12's stricter lockfile validation initially rejected the npm-11-generated lock because optional `@emnapi/core` and `@emnapi/runtime` entries were missing. Regenerating the lock with the pinned npm added the required metadata, after which `npm ci` passed. Direct dependency versions remained unchanged.

npm 12 also reports that install scripts for seven dependencies are blocked by its new allow-list behavior: two `@firebase/util` versions, `esbuild`, `fsevents`, `msw`, `protobufjs`, and `unrs-resolver`. Tests, coverage, lint, and the Vite build all pass with those scripts blocked, so no package was granted new install-script execution permission during this phase. Review and approve individual scripts only if a future platform or workflow demonstrates that one is required.

### Compatibility audit

Before installation, the suite and configuration were checked for each relevant Vitest 5 migration boundary:

- Every discovered `.resolves`, `.rejects`, `findBy*`, and `waitFor` assertion is awaited.
- No `test.sequential`, `describe.sequential`, or `sequential` test option is present.
- No removed `vitest/coverage`, `vitest/reporters`, `vitest/environments`, or `vitest/snapshot` entrypoint is imported.
- No file snapshots or assertions against generated test titles are present.
- No test reads `VITEST_POOL_ID` or `VITEST_WORKER_ID`.
- The single fake-timer suite restores real timers after each test and does not depend on changed wall-clock or `Temporal` behavior.
- The project does not use Vitest projects/workspaces, browser mode, custom environments, custom reporters, benchmark APIs, or glob-specific coverage thresholds affected by other Vitest 5 changes.

`clearMocks: true` remains explicit in `vitest.config.js`, even though it is now the Vitest 5 default. This keeps the suite's test-isolation contract visible and avoids changing behavior if defaults change again.

### Coverage comparison

The same `src/**/*.{js,jsx}` include and existing exclusions were used before and after the upgrade. Test count, covered feature behavior, branch counters, and function counters are unchanged, but the new V8-to-Istanbul implementation produces a small statement/line accounting shift:

| Metric | Vitest 4.1.11 | Vitest 5.0.0 | Delta |
| --- | ---: | ---: | ---: |
| Statements | 18.41% (2,143 / 11,640) | 18.39% (2,140 / 11,631) | -3 covered / -9 total statements |
| Branches | 14.75% (1,306 / 8,852) | 14.75% (1,306 / 8,852) | No change |
| Functions | 16.83% (543 / 3,225) | 16.83% (543 / 3,225) | No change |
| Lines | 18.55% (2,005 / 10,805) | 18.54% (2,002 / 10,796) | -3 covered / -9 total lines |

No production or test file changed between those coverage runs, and the coverage configuration was not edited. The nine-counter denominator change and three-counter covered change are therefore treated as Vitest 5 instrumentation/accounting differences, not lost test execution or a narrower intended coverage scope. The new values are the comparison baseline for later phases.

### Randomization and repeatability

The complete suite passed with file and test shuffling enabled using seed `20260914` and one repeat per test. This exercises the now-explicit `clearMocks` behavior and provides additional evidence that the suite does not depend on declaration or file execution order. No retries were used.

### Verification results

| Command/check | Result |
| --- | --- |
| Vitest 5 source/config migration audit | Passed; no incompatible APIs or unawaited assertions found |
| `npm ls vitest @vitest/ui @vitest/coverage-v8 vite --depth=0` | Passed; Vitest packages 5.0.0 and Vite 6.4.3 |
| `npm run test:ci` | Passed: 18 files / 76 tests, no asynchronous assertion warnings |
| `npm run test:coverage` | Passed; intended source scope retained and updated counters recorded |
| `npx vitest run --sequence.shuffle --sequence.seed=20260914 --repeats=1` | Passed: 18 files / 76 tests with no retries |
| `npm run ci-pr` | Passed: ESLint, Vitest 5 suite, and isolated Vite 6 test build |
| `npm ci` | Passed under the project-pinned Node 24 release |
| `git diff --check` | Passed |

The test-mode build retains the known warning for chunks larger than 500 kB. npm also retains the unrelated warning that its `min-release-age` environment configuration will stop being recognized by the next npm major.

### Phase 3 exit criteria

- [x] Vitest, UI, and coverage packages are exact-pinned at the same 5.0.0 version.
- [x] Vite remains at 6.4.3.
- [x] All asynchronous assertions are awaited and no removed Vitest 5 API is used.
- [x] The original 18 files and 76 tests pass normally and under shuffled/repeated execution.
- [x] Coverage scope is unchanged, and the instrumentation-level counter shift is documented.
- [x] Clean installation, lint, tests, coverage, and test-mode build pass.
- [x] No production deployment or live-data script was run.

## Phase 4A: Prepare MUI under v5

### Summary

Phase 4A removed the application's final dependency on legacy JSS styling while keeping Material UI at 5.18.0. The one `@mui/styles/makeStyles` component now uses the Emotion-backed `styled` API already supplied by `@mui/material`, and `@mui/styles` plus its JSS-only dependency chain have been removed.

All 25 `componentsProps` uses were Dialog backdrop customizations. They now use `slotProps.backdrop`, an equivalent API supported by the installed Material UI 5.18.0 Modal implementation. The backdrop colors and opacity values are unchanged.

The source and installed component definitions were also audited for the other deprecations named in the upgrade plan. APIs whose replacement slots do not exist in v5.18 were deliberately retained for Phase 4B rather than applying code that would be silently ignored by the current runtime.

No Material UI, MUI X, Emotion, React, or Vite version changed in this subphase. No production deployment or live-data operation was performed.

### Source and dependency changes

`LeaderboardName.jsx` now declares its link with `styled('a')` from `@mui/material/styles`. It preserves the white default color, gray hover color, current-user green inline override, link targets, truncation behavior, and anonymous display behavior without `makeStyles` or generated JSS classes.

The Dialog migration covered 12 files across ranking requests, lock photo submission, Reddit tooling, lock-bazaar links, and RAFL flows. A repository search now finds no source `componentsProps` use. The remaining `components` matches belong to ReactMarkdown, not Material UI.

The compatibility audit also corrected three categories of pre-existing slot API usage that the current v5 components do not support:

- `FormElement` moved Checkbox root dimensions, spacing, and color from an unavailable `slotProps.root` to `sx`, which works under both MUI 5 and later versions.
- The user and administrator RAFL notes fields moved `maxLength` from unavailable TextField `slotProps.htmlInput` to v5's functional `inputProps`. This keeps the 1,200-character browser limit active until TextField slots can be adopted after the MUI upgrade.
- `ScopedDialog` retained its supported `slotProps.backdrop` configuration but removed an unavailable `slotProps.paper` override. The inactive override conflicted with the component's explicit `.MuiDialog-paper` styles and would otherwise have become active unexpectedly during Phase 4B.

Dependency results:

| Package | Before | Phase 4A |
| --- | ---: | ---: |
| `@mui/material` | 5.18.0 | 5.18.0 |
| `@mui/icons-material` | 5.18.0 | 5.18.0 |
| `@mui/x-date-pickers` | 6.20.2 | 6.20.2 |
| `@emotion/react` | 11.14.0 | 11.14.0 |
| `@emotion/styled` | 11.14.1 | 11.14.1 |
| `@mui/styles` | 5.18.0 | Removed |

Removing `@mui/styles` also removed its JSS packages, `css-vendor`, `hyphenate-style-name`, `is-in-browser`, and `tiny-warning`. npm initially orphaned an optional Rollup WASM peer while rewriting the lock; preserving the existing optional `@emnapi/core` and `@emnapi/runtime` lock entries restored a clean cross-platform lock. A subsequent `npm ci` installed 959 packages and `npm ls --depth=0` reported no extraneous dependencies.

The root audit remains at five moderate findings. No automatic or forced audit fix was applied.

### Deprecation and codemod audit

Material UI's official `@mui/codemod` 9.4.0 `deprecations/all` transform was run against a temporary copy of all source JavaScript and JSX. The first broad trial demonstrated that the codemod also attempts to parse imported JSON when pointed at the complete `src` tree; it was stopped and rerun against JavaScript and JSX only. That run processed 495 files with zero transformation errors.

The generated diff was reviewed but not applied wholesale. The current codemod targets deprecations through later Material UI releases and proposed several slot APIs that do not exist in Material UI 5.18.0. It also produced unrelated semicolon changes around some regular-expression expressions. Only changes validated against the installed v5 component definitions were implemented manually.

Audit disposition:

| API/pattern | Finding and disposition |
| --- | --- |
| `componentsProps` / `components` | All 25 MUI matches were Dialog backdrop props and were migrated. Remaining `components` props belong to ReactMarkdown. |
| TextField `InputProps`, `inputProps`, and `SelectProps` | Supported and not marked deprecated in installed v5.18; replacement TextField slots are unavailable until v6. Retained for Phase 4B. |
| Autocomplete `renderInput` | All 11 matches are valid Autocomplete render callbacks. DatePicker has no `renderInput` use. |
| Menu `MenuListProps` and nested Select `MenuProps.PaperProps` | Current v5 Menu does not expose the later list/paper slot contract. Retained for Phase 4B. |
| ListItemText typography props | Five components use `primaryTypographyProps` or `secondaryTypographyProps`; v5.18 has no ListItemText `slotProps`. Retained for Phase 4B. |
| Dialog `TransitionComponent` | Three full-screen dialogs use it; v5.18 has no Dialog transition slot. Retained for Phase 4B. |
| CardHeader typography props | No source usage found. |
| Dialog backdrop, paper, transition, and click props | No legacy `BackdropProps`, `BackdropComponent`, `onBackdropClick`, or `TransitionProps` use found. The supported backdrop slot is now used consistently. |
| Composed button `component` usage | No Button, IconButton, or Fab composition matches found. Existing `component` props are valid polymorphic Table, Typography, and Box usage. |

These retained APIs are not unresolved Phase 4A defects: replacing them under v5 would produce nonfunctional props. They form the explicit source inventory for the MUI 6 checkpoint and later deprecated-API cleanup before MUI 7/9.

### Test changes

Two behavior-level `LeaderboardName` tests were added to the existing leaderboard suite. They verify the current user's profile link and green highlight and verify that a privacy-enabled identity remains anonymous. The tests do not assert Emotion class names or Material UI DOM internals.

The test suite therefore advances from 76 to 78 tests while remaining at 18 files. Existing MUI compatibility coverage still exercises Dialog focus and keyboard dismissal, Select keyboard interaction, Autocomplete typing/selection/clearing, image upload validation, and Date Picker display/submission behavior.

### Verification results

| Command/check | Result |
| --- | --- |
| `npm ci` | Passed; 959 packages installed under the Node 24 environment |
| `npm ls --depth=0` | Passed; no missing, invalid, or extraneous packages |
| MUI source audit | Passed; no `@mui/styles` import and no `componentsProps` use remains |
| Focused ESLint on changed source | Passed |
| Focused Vitest (`LeaderboardRoute` and `MUICompatibility`) | Passed: 2 files / 11 tests |
| `npm run lint` | Passed under ESLint 10.10.0 |
| `npm run test:ci` | Passed: 18 files / 78 tests |
| `npm run build:test` | Passed: 4,415 modules transformed |
| `npm run e2e` | Passed: 9 Chromium journeys with the existing clean-console enforcement |
| `npm run build` | Passed: 4,415 modules transformed |
| `git diff --check` | Passed after source and documentation updates |

Both builds retain the known warning for chunks larger than 500 kB. The largest production chunks remain effectively at baseline: the main index is 3,532.49 kB minified / 655.09 kB gzip, Dropzone is 1,417.87 kB / 359.90 kB, and AwardRoute is 1,153.01 kB / 510.56 kB. npm continues to report the unrelated `min-release-age` configuration warning and the five pre-existing moderate audit findings.

### Remaining Phase 4 work and manual review

- Phase 4B must upgrade Material UI and Icons to v6 and then migrate the retained TextField, ListItemText, Menu, Select, and Dialog transition props only after their replacement slots are available.
- MUI X Date Pickers remains at 6.20.2; its separate 6-to-7 migration and date parsing/disabled-date checks remain Phase 4B.
- The automated MUI Dialog contract and Playwright clean-console suite passed, but the changed ranking-request, photo-submission, Reddit-tool, and RAFL Dialog backdrop opacity variants are not all traversed by browser automation. Visually sample those flows before release if Phase 4A is deployed independently.
- The current-user leaderboard link should be sampled once in a signed-in view to confirm the green highlight and existing hover behavior in the production theme.

### Phase 4A exit criteria

- [x] The final `@mui/styles` use and package dependency are removed.
- [x] Every MUI `componentsProps` use supported by v5 has moved to `slotProps`.
- [x] Other planned deprecation categories were audited and unsupported v5 migrations were explicitly deferred.
- [x] The official codemod was run safely against a temporary JavaScript/JSX copy and every relevant proposal was reviewed.
- [x] Focused MUI/leaderboard tests, full lint, all Vitest tests, Playwright, and both Vite builds pass.
- [x] No new runtime console warning appears in the tested browser routes.
- [x] No production deployment or live-data script was run.

## Phase 4B: Upgrade MUI 5 to 6

### Summary

Phase 4B upgraded Material UI and Icons from 5.18.0 to the final v6 release, 6.5.0, and upgraded MUI X Date Pickers separately from 6.20.2 to the final v7 release, 7.29.4. Emotion was already on the current compatible 11.14 releases and did not need to change. React remains at 18.3.1 so this checkpoint isolates the MUI migration from the planned React 19 migration.

The v5 compatibility inventory from Phase 4A has been migrated to the slot APIs exposed by Material UI 6. TextField input, HTML input, and select props; ListItemText typography props; Menu list/paper props; Dialog transitions; and a Checkbox input prop now use their supported slot equivalents. Simple legacy system props on Box and Stack were also moved into `sx`.

No production deployment or live-data operation was performed.

### Dependency changes and React compatibility

| Package | Before | Phase 4B |
| --- | ---: | ---: |
| `@mui/material` | 5.18.0 | 6.5.0 |
| `@mui/icons-material` | 5.18.0 | 6.5.0 |
| `@mui/x-date-pickers` | 6.20.2 | 7.29.4 |
| `@emotion/react` | 11.14.0 | 11.14.0 |
| `@emotion/styled` | 11.14.1 | 11.14.1 |
| `react-is` | 19.3.0 transitively | 18.3.1 direct dependency and override |

Material UI 6 depends on the latest `react-is`, but its migration guide requires applications that remain on React 18 to install a matching `react-is` version and override transitive resolutions. Without this, development-time prop validation can misidentify React elements. The root dependency and npm override now keep all installed `react-is` instances at 18.3.1. This override should advance with React during Phase 5 rather than being removed accidentally.

The final `npm ci` installed 941 packages, `npm ls --depth=0` found no missing or extraneous dependencies, and `npm ls react-is --all` confirmed that every relevant path resolves to 18.3.1. npm continues to report five moderate audit findings; no automatic or forced audit fix was applied.

### Source migration

The following compatibility changes were made after the v6 packages were installed:

- TextField `InputProps`, `inputProps`, and `SelectProps` were migrated to `slotProps.input`, `slotProps.htmlInput`, and `slotProps.select` across search, autocomplete, profile, entry-note, and RAFL forms. Autocomplete's valid `renderInput` callback and parameter spread remain unchanged.
- ListItemText `primaryTypographyProps` and `secondaryTypographyProps` were migrated to `slotProps.primary` and `slotProps.secondary` in leaderboard, lock, ranking-request, scorecard, and recent-media rows.
- Menu `MenuListProps` became `slotProps.list`; the Select `MenuProps` container remains valid, while its nested `PaperProps` became `slotProps.paper`.
- Dialog `TransitionComponent` became `slots.transition` in the hotkey, slideshow, and image-viewer full-screen dialogs.
- The RequestLock Checkbox now sends its native input properties through `slotProps.input`.
- Simple Box and Stack system props such as `margin`, `alignContent`, and `alignItems` moved to `sx` in filter buttons, status/recording rows, empty-state panels, and RAFL/safelock entries.

A final source audit finds no remaining direct MUI TextField `InputProps`, `inputProps`, or `SelectProps`; ListItemText typography props; Menu `MenuListProps`; nested Select `PaperProps`; Dialog `TransitionComponent`; or MUI `componentsProps`. The remaining `MenuProps` is the valid Select-level container, and remaining `components` matches belong to ReactMarkdown.

### Accordion semantic migration

Material UI 6 changes AccordionSummary to use a button and wraps it in a heading by default. Default Typography inside each summary was changed to render as `span`, preventing invalid heading nesting while retaining existing visual typography.

Six application summaries contain additional interactive controls such as buttons, switches, or links. Rendering those summaries as buttons would create invalid nested controls and unreliable keyboard behavior. These accordions explicitly set `Accordion`'s heading slot and `AccordionSummary` itself to `div`, preserving their Material UI 5 interaction model:

- scorecard and scorecard-row summaries
- entry details
- system-message administration and rows
- leaderboard comparison

All other accordions use the new Material UI 6 heading/button semantics. A behavior-level test verifies the heading, button, Enter-to-expand, and Space-to-collapse contract without asserting generated classes.

### Codemod and migration-guide findings

Material UI 6 does not publish a single v6 `preset-safe` transform. Its individual v6 transforms were run first against a temporary JavaScript/JSX-only copy and reviewed:

- `theme-v6`, `styled`, and Grid v2 props found no semantic changes.
- `system-props` identified the simple Box/Stack props migrated above.
- `sx-prop` primarily proposed optional Pigment CSS syntax and formatter churn, so those unrelated changes were not applied to this Emotion application.

The MUI X v7 picker `preset-safe` codemod also ran cleanly against the JavaScript/JSX-only copy and found no semantic source changes. The application's DatePicker usage already follows the v7 slots contract. The targeted TextField, ListItemText, and Dialog deprecation codemods were then applied and reviewed; Menu changes were completed manually from the migration guide.

One full-source codemod invocation inherited JSON extensions and reported 140 JSON parse errors after completing its JavaScript/JSX transforms. No JSON file was changed. The prior JavaScript/JSX-only run had zero transformation errors, and every applied source change was subsequently reviewed, linted, and tested.

### Date Picker and interaction coverage

The existing EvidenceForm compatibility test continues to verify the displayed date, user editing, and submitted `Date` value after the MUI X v7 migration. Existing behavior-level tests also cover Dialog focus and Escape dismissal, Select keyboard interaction, Autocomplete typing/selection/clearing, tab selection, image input validation, and the principal form submission contracts.

Two additional Vitest contracts now cover Material UI 6 Accordion keyboard semantics and Tooltip hover/dismiss behavior. A new mobile Playwright journey uses a 390-by-844 viewport to verify that the Locks list remains usable and that the filter drawer opens and closes. The suite advances from 78 to 80 Vitest tests and from 9 to 10 Playwright journeys.

### Verification results

| Command/check | Result |
| --- | --- |
| `npm ci` | Passed; 941 packages installed in the Node 24 environment |
| `npm ls --depth=0` | Passed; no missing, invalid, or extraneous packages |
| `npm ls react-is --all` | Passed; all relevant paths resolve to 18.3.1 |
| Focused Vitest (`MUICompatibility`) | Passed: 1 file / 7 tests |
| `npm run lint` | Passed under ESLint 10.10.0 |
| `npm run ci-pr` | Passed: lint, 18 Vitest files / 80 tests, and isolated test build |
| `npm run e2e` | Passed: 10 Chromium journeys with clean-console enforcement |
| `npm run build` | Passed: 4,104 modules transformed |
| MUI deprecated-prop and Accordion source audits | Passed |
| `git diff --check` | Passed before final documentation reconciliation |

Both builds retain the known warning for chunks larger than 500 kB. The production main chunk is 3,547.81 kB minified / 659.13 kB gzip, an increase of 15.32 kB / 4.04 kB from Phase 4A. Dropzone remains 1,417.87 kB / 359.90 kB. AwardRoute remains effectively unchanged at 1,152.97 kB / 510.55 kB. EvidenceForm is 150.51 kB / 44.47 kB, an increase of 27.88 kB / 6.79 kB attributable to the MUI X Date Pickers v7 checkpoint.

npm retains its unrelated `min-release-age` configuration warning, four deprecated transitive-package notices during clean installation, and the five pre-existing moderate audit findings.

### Manual review and next phase

Automated interaction and clean-console checks passed, but the following visual checks are worthwhile before release:

- authenticated/admin scorecard, system-message, entry, and leaderboard-comparison accordions, especially nested buttons, switches, and links
- full-screen hotkey, slideshow, and image-viewer transition/focus behavior
- RAFL forms and long TextField input limits
- Date Picker calendar navigation and visibly disabled future dates; automated coverage verifies display, editing, and submission but does not click a disabled calendar date
- tabs, tooltips, menus, and filter controls at representative desktop and mobile sizes

Phase 5 can now upgrade React and React DOM together. It must update the explicit `react-is` dependency and override to the matching React 19 release and re-run the MUI interaction suite.

### Phase 4B exit criteria

- [x] Material UI and Icons are stable on 6.5.0; MUI X Date Pickers is stable on 7.29.4.
- [x] The retained v5 props have moved to their supported v6 slot APIs.
- [x] Accordion heading and nested-control semantics are explicit and behavior-tested.
- [x] Representative Dialog, Select, Autocomplete, Date Picker, Accordion, Tooltip, tabs, and responsive interactions pass.
- [x] Full lint, Vitest, Playwright, test build, production build, and clean-install checks pass.
- [x] Tested browser routes produce no console warnings or errors.
- [x] No production deployment or live-data script was run.

## Phase 5: Upgrade React 18.3 to React 19

### Summary

Phase 5 upgraded React, React DOM, the explicit `react-is` compatibility dependency, and React editor types together from 18.3.1 to 19.3.0. The application already used `createRoot` and the modern JSX transform. Source audits and behavior tests found no removed React API, callback-ref cleanup, rendering, lifecycle, portal, Suspense, error-boundary, or form compatibility change that required an application-source edit.

Two React-facing packages advanced to releases whose published peer metadata covers React 19: `react-dropzone` moved from 14.4.1 to 20.1.2, and `usehooks-ts` moved from 2.16.0 to 3.1.1. Existing dropzone and hook call sites remained API-compatible. No React 19 feature was adopted in this phase.

No production deployment or live-data operation was performed.

### Dependency changes and compatibility audit

| Package | Before | Phase 5 |
| --- | ---: | ---: |
| `react` | 18.3.1 | 19.3.0 |
| `react-dom` | 18.3.1 | 19.3.0 |
| `react-is` | 18.3.1 | 19.3.0 |
| `@types/react` | 18.3.31 | 19.3.0 |
| `react-dropzone` | 14.4.1 | 20.1.2 |
| `usehooks-ts` | 2.16.0 | 3.1.1 |

The existing npm override remains `"react-is": "$react-is"`, so Material UI and all other relevant dependency paths now resolve the same 19.3.0 release as React. `npm ls` reports one valid React 19 tree without duplicate React or React DOM runtimes.

Published peer ranges were reviewed for Material UI and MUI X Date Pickers, Nivo, Emotion/Motion, Notistack, React Markdown, React Router, React Dropzone, React Full Screen, React Hotkeys Hook, React Swipeable, React Window and its auto-sizer, React Transition Group, React CountUp, React Simple Star Rating, Testing Library, and `usehooks-ts`. Their installed versions accept React 19 after the two companion upgrades above.

The source audit found no `ReactDOM.render`, `hydrate`, `findDOMNode`, `unmountComponentAtNode`, `react-dom/test-utils`, legacy string ref, function-component `defaultProps`, or callback ref returning an unintended cleanup value. The existing `forwardRef` transition adapter remains supported and was retained to keep this phase focused on compatibility rather than React 19 feature adoption.

### Behavior verification

Before changing dependencies, 27 focused tests passed under React 18.3.1 for Strict Mode subscriptions and cleanup, authentication lifecycle, lazy routes and route errors, Material UI portals/forms, dropzone behavior, and debounced URL search. The same 27 tests passed after the React 19 installation. A second focused group passed 15 tests covering content/lazy routes, chart-bearing routes, lock browsing, and raffle preview behavior.

The Strict Mode DBContext contract retained one active subscription per source and cleaned up every listener on unmount. MUI Dialog, Select, Accordion, Tooltip, Autocomplete, Date Picker, and Dropzone contracts passed without React ref, act, key, hydration, or state-update warnings. The Playwright journeys exercised primary lazy routes, responsive controls, and browser navigation with the existing clean-console enforcement.

### Verification results

| Command/check | Result |
| --- | --- |
| React 18 focused Vitest checkpoint | Passed: 5 files / 27 tests |
| React 19 focused lifecycle/router/MUI/search Vitest | Passed: 5 files / 27 tests |
| React 19 focused route/chart/data Vitest | Passed: 4 files / 15 tests |
| `npm ls react react-dom react-is @types/react react-dropzone usehooks-ts --all` | Passed; one valid React 19.3.0 tree |
| `npm run ci-pr` | Passed once: lint, 18 Vitest files / 80 tests, and isolated test build |
| `npm run test:coverage` | Passed: 18 files / 80 tests; 18.39% statements, 14.79% branches, 16.80% functions, 18.54% lines |
| `npm run e2e` | Passed: 10 Chromium journeys with clean-console enforcement |
| `npm run build` | Passed: 4,102 modules transformed |
| Removed-API and callback-ref source audits | Passed |

Coverage is unchanged from Phase 4B. Both builds retain the known warning for chunks larger than 500 kB. The production main chunk is 3,628.98 kB minified / 682.62 kB gzip, an increase of 81.17 kB / 23.49 kB from Phase 4B. The Dropzone chunk is 1,374.73 kB / 349.97 kB, a decrease of 43.14 kB / 9.93 kB. AwardRoute remains 1,152.97 kB / 510.55 kB. EvidenceForm is 151.38 kB / 44.87 kB.

npm continues to report the five pre-existing moderate audit findings. No automatic or forced audit fix was applied.

### Manual review and next phase

Automated behavior and clean-console checks passed. Manual release review should sample an authenticated profile/scorecard flow, a full-screen image or slideshow dialog, and an upload form because those states are only partly represented by synthetic test data.

Phase 6 can upgrade React Router independently on the stable React 19 checkpoint.

### Phase 5 exit criteria

- [x] React, React DOM, `react-is`, and React types resolve together at 19.3.0.
- [x] Important React-facing dependencies declare compatible peer ranges.
- [x] No removed React API or callback-ref cleanup issue remains in application source.
- [x] Strict Mode subscriptions remain singular and clean up correctly.
- [x] Focused lifecycle, lazy-route, error-boundary, portal, form, upload, chart, and search contracts pass.
- [x] Full lint, Vitest, coverage, Playwright, test build, and production build pass without application console warnings.
- [x] No production deployment or live-data script was run.

## Phase 6: Upgrade React Router 6 to 7

### Summary

Phase 6 upgraded `react-router-dom` and its `react-router` dependency from the final v6 release, 6.30.6, to the latest secure v7 release, 7.18.4. Existing imports remain on `react-router-dom`, which v7 preserves as re-exports. No mechanical import migration or React Router v8 preparation was included.

The app already used the data-router API through `createHashRouter` and had enabled `v7_startTransition`. The remaining applicable v7 flags were enabled one at a time under v6 and passed the focused router/search suite after each change. React Router v7 makes those behaviors the defaults, so the obsolete future flags were removed from the production router and test harnesses after the dependency upgrade.

No production deployment or live-data operation was performed.

### Dependency and compatibility changes

| Package | Before | Phase 6 |
| --- | ---: | ---: |
| `react-router-dom` | 6.30.6 | 7.18.4 |
| `react-router` | 6.30.6 | 7.18.4 |
| `@remix-run/router` | 1.23.4 | Removed; merged into React Router 7 |

The repository uses Node 24.15.0 and React/React DOM 19.3.0, exceeding React Router 7's Node 20 and React 18 minimums. `npm ls react-router react-router-dom --all` reports one valid 7.18.4 tree.

The source audit found no React Router data forms, fetchers, actions, form-method comparisons, explicit hydration data, or multi-segment splat routes with relative navigation. Existing nested absolute paths, redirects, lazy routes, route errors, navigation state, URL parameters, search parameters, unknown-route handling, and admin access behavior remain compatible. Representative nested route matching is now asserted for leaderboard, parameterized profile/scorecard, and RAFL administrator paths.

### Lazy-route hydration fallback

The first v7 production-preview run exposed the phase's only application compatibility failure: direct navigation to a lazy route rendered successfully but logged `No HydrateFallback element provided to render during initial hydration`. React Router 7 applies the former `v7_partialHydration` behavior by default, including for object-based lazy routes in this client-only data router.

Every top-level route now receives the existing `LoadingDisplay` as its `hydrateFallbackElement` alongside the shared error boundary. The app has peer top-level lazy routes rather than one common root layout, so attaching the fallback in the existing route normalization covers every direct hash entry without changing provider nesting, route matching, or access boundaries. The follow-up browser run passed with no console warnings or errors.

### Router and browser coverage

The real route tree tests continue to cover root, legacy, and unknown redirects; a representative lazy route with preserved search parameters; route errors; and anonymous/admin access. They now also assert idle navigation state and nested absolute route matching with a URL parameter. SearchBox tests cover delayed URL synchronization, external navigation, clearing, browser back/forward, and debounce cleanup. Denied Discord and Reddit callback tests continue to prove that callback status renders without an external request.

The Info production-preview journey now exercises a direct hash deep link with a search parameter, navigation to a second lazy route, browser back, refresh on the restored deep link, and browser forward. The Playwright fixture continues to fail on any browser warning/error, page error, or failed application module.

### Verification results

| Command/check | Result |
| --- | --- |
| React Router 6 baseline focused Vitest | Passed: router/search 2 files / 12 tests; callback 1 file / 2 tests |
| React Router 6 future-flag checkpoints | Passed after each of `v7_relativeSplatPath`, `v7_fetcherPersist`, `v7_normalizeFormMethod`, `v7_partialHydration`, and `v7_skipActionErrorRevalidation`: 2 files / 12 tests per checkpoint |
| React Router 7 focused ESLint | Passed for changed application routing and render-harness source |
| React Router 7 focused Vitest | Passed: 5 files / 28 tests covering routes, nested matches, callbacks, SearchBox, and representative content |
| Focused Playwright before fallback fix | Failed: 4 routes emitted the React Router 7 missing-`HydrateFallback` warning |
| Focused Playwright after fallback fix | Passed: 4 journeys, including hash history/refresh, with clean-console enforcement |
| `npm ci` | Passed; 941 packages installed and the lockfile reproduced React Router 7.18.4 |
| `npm ls react-router react-router-dom --all` | Passed; both packages resolve to 7.18.4 |
| `npx playwright test` | Passed: 10 Chromium journeys with clean-console enforcement |
| `npm run build` | Passed: 4,110 modules transformed |
| `npm run ci-pr` | Passed once: lint, 18 Vitest files / 83 tests, and isolated test build |

The production build retains the known warning for chunks larger than 500 kB. The main index chunk is 3,666.86 kB minified / 694.56 kB gzip, an increase of 37.88 kB / 11.94 kB from Phase 5. Dropzone, AwardRoute, and EvidenceForm remain unchanged at 1,374.73 kB / 349.97 kB, 1,152.97 kB / 510.55 kB, and 151.38 kB / 44.87 kB respectively.

`npm audit` now reports three moderate vulnerable paths: the existing direct `csv-parse` finding and the existing transitive `uuid`/`gaxios` path. The two React Router vulnerable paths recorded in earlier phases are resolved. No automatic or forced audit fix was applied.

### Manual review and next phase

The direct hash, refresh, history, nested route, search synchronization, lazy route, route-error, denied OAuth callback, and mocked admin-boundary checks are automated. Before release, manually verify:

- a successful Discord and Reddit OAuth callback round trip in a safe deployed environment, because automated tests intentionally block external services and cover denied callbacks only
- authenticated profile and scorecard deep links after refresh, plus one administrator route as an administrator and a non-administrator, because unit tests use synthetic auth and role state
- the loading indicator on a cold-cache lazy deep link with network throttling, confirming the new route fallback appears cleanly before the page loads

Phase 7 can advance Material UI and MUI X independently on the React Router 7 checkpoint.

### Phase 6 exit criteria

- [x] `react-router-dom` and `react-router` resolve to 7.18.4 and the prior Router advisories are cleared.
- [x] All applicable v7 future behaviors passed focused checkpoints under React Router 6 and obsolete flags are removed under v7.
- [x] Nested absolute paths, parameters, redirects, lazy routes, route errors, search/history synchronization, OAuth denial paths, and admin access remain behavior-tested.
- [x] Every direct lazy route has an initial fallback and tested browser routes produce no Router warning.
- [x] Focused Vitest, full Playwright, test build, and production build pass.
- [x] The single final `npm run ci-pr` checkpoint passes.
- [x] No production deployment or live-data script was run.

## Phase 7: Complete Material UI 7 and 9 migrations

### Summary

Phase 7 upgraded Material UI Core and Icons through the v7 checkpoint to v9, and upgraded MUI X Date Pickers separately through v8 to v9. The final dependency tree contains one compatible MUI 9 family with no old Core or X duplicate. Emotion and React remained unchanged.

The source migration moved Autocomplete input wiring to the v9 `slotProps` callback shape, replaced navigation-only `MenuItem` uses with `ListItemButton`, declared the intended non-native element for interactive Accordion summaries, renamed removed legacy icon imports to their identical `Outlined` exports, and replaced three invalid declaration-file imports with public runtime entry points. Date Picker coverage now exercises the accessible section-based field that became the default in v8 and the only supported structure in v9.

No production deployment or live-data operation was performed.

### Dependency checkpoints

| Package | Before | v7/v8 checkpoint | Phase 7 |
| --- | ---: | ---: | ---: |
| `@mui/material` | 6.5.0 | 7.3.11 | 9.4.0 |
| `@mui/icons-material` | 6.5.0 | 7.3.11 | 9.4.0 |
| `@mui/x-date-pickers` | 7.29.4 | 8.29.3 | 9.13.0 |
| `@emotion/react` | 11.14.0 | 11.14.0 | 11.14.0 |
| `@emotion/styled` | 11.14.1 | 11.14.1 | 11.14.1 |

The Material UI 7 checkpoint passed focused lint and 14 MUI/lock-list interaction tests before Date Pickers changed. The Date Pickers 8 checkpoint then passed the evidence-form date display/edit/submission contract before the coordinated v9 upgrade. `npm ls` confirms that MUI Core, System, Utils, Icons, Date Pickers, and X Internals each resolve to a single v9 release. npm continues to report the three unrelated moderate audit findings recorded in Phase 6; no automatic or forced audit fix was applied.

### Source compatibility changes

Material UI v9 changes the `Autocomplete` `renderInput` parameters from legacy `InputProps`/`inputProps` fields to `params.slotProps`. Ten application Autocomplete wrappers now preserve the complete callback-provided slot object and add the search adornment through `params.slotProps.input`. This retains the input ref, HTML input attributes, combobox role, popup wiring, clearing, and keyboard selection.

MUI v9 also requires `MenuItem` to be rendered inside `Menu` or `MenuList`. The main navigation drawer now uses `ListItemButton` for its header and route rows. The reusable sign-in control uses `ListItemButton` in standalone cards, drawers, and pages, while the user menu explicitly requests the real `MenuItem` variant. This preserves menu focus management and removes the v9 `MenuListContext is missing` runtime error.

Nine Accordion summaries contain nested links, switches, or buttons and intentionally render their ButtonBase root as `div`. They now set `nativeButton={false}`, which makes their expected keyboard attributes explicit and avoids the new v9 custom-button warning. Ordinary summaries keep MUI's native heading/button semantics.

Six removed legacy Material Icon import paths now use their identical `Outlined` exports: Add Circle, Delete, Error, and Help. Three imports that incorrectly targeted `index.d.ts` declaration files now use the public Material UI Button, CardHeader, and AdapterDayjs entry points; v9 package export maps correctly reject declaration files as runtime modules.

The final source audit finds no removed MUI legacy prop categories, v9-removed icon paths, invalid MUI declaration-file imports, or undeclared `AccordionSummary component='div'` uses. The application does not use GridLegacy, Stepper, Step, or StepButton, so their v9 migrations are not applicable.

### Accessibility and visual coverage

The focused MUI compatibility suite now includes explicit v9 behavior for roving menu-item focus, roving tab focus and keyboard selection, Button activation with Enter and Space, Accordion heading and keyboard expansion, Dialog focus/Escape handling, Select keyboard selection, Autocomplete typing/selection/clearing, and accessible Date Picker section editing. Existing lock-list tests continue to exercise the product tabs, sort menu, filter controls, and nested-control accordions.

Two Chromium visual baselines were added after the DOM migration stabilized: the desktop White Belt lock list at 1280 by 900 and the open mobile filter drawer at 390 by 844. Both run with external requests blocked and browser animations disabled. The checked-in baselines were generated on macOS and are named with Playwright's `darwin` snapshot suffix; a Linux runner would need separately reviewed Linux baselines before these screenshot tests are enabled there.

### Supported-browser and display changes

Material UI 9 raises its default bundle targets to Chrome 117, Edge 121, Firefox 121, and Safari/iOS Safari 17. The repository does not contain audience browser analytics, so this phase adopts that modern-browser baseline technically; release owners should confirm that Safari 16 or other older-browser traffic is not material before deployment.

The migration can produce the following visible or interaction changes:

- Date Picker fields use separately editable Month, Day, and Year sections. The outline and label remain familiar, while keyboard and screen-reader interaction is more granular.
- `ListItemIcon` has a 36px default minimum width instead of 56px, so icons and labels can sit closer together in menus and navigation lists.
- Main-drawer rows now use the semantically appropriate ListItemButton. Their layout remains covered by the desktop/mobile screenshots, though hover, focus, and ripple details can differ slightly.
- Menu items and tabs keep one `tabindex="0"` item as keyboard focus moves; this changes focus behavior without changing the selected appearance.
- A select-mode TextField now renders its internal InputLabel as a `div` instead of a native `label`. Existing accessible Select labeling tests continue to pass.
- The renamed Material Icons are exact glyph replacements and should not change appearance.

### Verification results

| Command/check | Result |
| --- | --- |
| Material UI 7 focused ESLint | Passed for the compatibility source set |
| Material UI 7 focused Vitest | Passed: 2 files / 14 tests |
| Date Pickers 8 evidence-form Vitest | Passed: 1 selected test |
| Material UI 9 focused Vitest | Passed: `MUICompatibility`, 1 file / 10 tests |
| Focused Material UI Playwright | Passed: 7 Chromium journeys, including 2 visual comparisons |
| `npm ls @mui/material @mui/icons-material @mui/x-date-pickers @mui/system @mui/utils @mui/x-internals --all` | Passed; one compatible v9 dependency tree |
| `npm run ci-pr` | Passed once: lint, 18 Vitest files / 86 tests, and isolated test build |
| `npm run test:coverage` | Passed: 18 files / 86 tests; 18.40% statements, 14.79% branches, 16.83% functions, 18.54% lines |
| `npm run e2e` | Passed: 12 Chromium journeys with clean-console enforcement and visual comparisons |
| `npm run build` | Passed: 4,145 modules transformed |
| Removed-API, icon-path, custom-button, and declaration-import source audits | Passed |

Both Vite builds retain the known warning for chunks larger than 500 kB. The production main chunk is 3,683.67 kB minified / 701.13 kB gzip, an increase of 16.81 kB / 6.57 kB from Phase 6. Dropzone and AwardRoute remain unchanged at 1,374.73 kB / 349.97 kB and 1,152.97 kB / 510.55 kB. EvidenceForm is 158.86 kB / 48.18 kB, an increase of 7.48 kB / 3.31 kB from the MUI X 7 checkpoint.

### Manual review and next phase

Before release, manually verify:

- the authenticated scorecard Evidence Form Date Picker, including calendar selection, keyboard section editing, and rejection of future dates
- nested controls in authenticated/admin scorecard, system-message, RAFL-entry, and leaderboard-comparison accordions, confirming that each child action does not unexpectedly expand or collapse its row
- the main drawer and user menu with keyboard-only navigation, including the sign-in row while signed out
- less frequently tested Autocomplete forms such as ranking requests, scorecard entry selection, and RAFL pot/entry forms
- the two visual baselines on the release machine, and separately approved Linux baselines if Playwright screenshots will run on Linux
- audience browser analytics against the new Safari 17 / Chrome 117 / Edge 121 / Firefox 121 minimums

Phase 8 can upgrade the Firebase web SDK independently on the stable Material UI 9 checkpoint.

### Phase 7 exit criteria

- [x] Material UI Core/Icons and MUI X Date Pickers passed their intermediate major checkpoints and resolve together on compatible v9 releases.
- [x] Removed MUI props, icon paths, declaration-file imports, MenuItem contexts, and custom ButtonBase semantics are migrated.
- [x] Dialog, Select, Autocomplete, Date Picker, Accordion, menu, tabs, buttons, and responsive layouts pass focused automated checks.
- [x] Desktop and mobile visual baselines are recorded and pass on the development platform.
- [x] The supported-browser baseline and user-visible changes are documented for release review.
- [x] Full lint, Vitest, coverage, Playwright, test build, and production build pass without application console warnings.
- [x] The single final `npm run ci-pr` checkpoint passes.
- [x] No production deployment or live-data script was run.

## Phase 8: Upgrade Firebase web SDK 11 to 12

### Summary

Phase 8 upgraded only the frontend Firebase package from 11.10.0 to 12.19.0. The application already uses modular imports from `firebase/app`, `firebase/auth`, and `firebase/firestore`, and all imported symbols remain public in Firebase 12. No application source compatibility change was required. The root `firebase-admin` dependency remains at 14.4.0, and the separate Functions package and lockfile were unchanged.

Firebase 12 requires Node 20 or newer and emits ES2020. The repository's pinned Node 24.15.0 runtime satisfies the Node requirement, and both Vite 6 builds accept the ES2020 packages. The removed `firebase/vertexai` alias is not used by the repository.

No production deployment or live-data operation was performed.

### Compatibility and test changes

`tests/vitest/firebaseInitialization.test.js` now verifies the actual initialization module wiring. It covers the default Firestore database without emulator connections and the named `lpubelts-dev` database with loopback Auth and Firestore emulator connections. The existing safety tests continue to reject deployable Firebase project IDs, non-loopback emulator hosts, and live service URLs.

A new `npm run test:firebase:web-sdk` contract starts isolated Auth and Firestore emulators with project ID `demo-lpubelts`. It signs in a synthetic anonymous user through the Firebase 12 web Auth SDK and exercises a live Firestore subscription, document create/update/delete, a transaction, and a permission-denied read. Its dedicated test rules grant only the synthetic authenticated test collection and deny the permission-error collection. These rules are test fixtures and do not represent or alter deployed application rules.

The Firebase 11 focused checkpoint passed 4 provider/config files and 19 tests before installation. After the upgrade, the expanded focused checkpoint passed 6 files and 25 tests. Direct module inspection confirmed every symbol imported by application source from Firebase App, Auth, and Firestore remains exported.

The initial package installation ran under an ambient Node 23 shell and reported the expected project engine warnings. A subsequent clean `npm ci` under the pinned Node 24.15.0 runtime passed and reproduced Firebase 12.19.0 from the lockfile.

### Bundle review

The production build transformed 4,146 modules. The main chunk is 3,892.91 kB minified / 758.33 kB gzip, an increase of 209.24 kB / 57.20 kB from Phase 7. The bundle graph contains only modular Firebase App, Auth, Firestore, Component, Logger, Util, and WebChannel modules. It contains no `@firebase/*-compat` module files. The version-registration strings naming compat packages are supplied by Firebase App and do not indicate that compat implementations were bundled.

The Dropzone, AwardRoute, and EvidenceForm chunks remain unchanged at 1,374.73 kB / 349.97 kB, 1,152.97 kB / 510.55 kB, and 158.86 kB / 48.18 kB respectively. Both builds retain the known warning for chunks larger than 500 kB.

### Verification results

| Command/check | Result |
| --- | --- |
| Firebase 11 focused Vitest checkpoint | Passed: 4 files / 19 tests |
| Firebase 12 focused Vitest checkpoint | Passed: 6 files / 25 tests |
| `npm run test:firebase:web-sdk` | Passed: anonymous Auth, subscription, transaction, create/update/delete, and permission denial against loopback emulators |
| `npm run test:functions:integration` | Passed: create/update/delete for lockcollections, awards, and evidence |
| `npm ls firebase @firebase/app @firebase/auth @firebase/firestore --all` | Passed; Firebase resolves to 12.19.0 with one modular App/Auth/Firestore version set |
| `npm ci` under Node 24.15.0 | Passed; 936 packages installed from the lockfile |
| `npm run e2e` | Passed: 12 Chromium journeys with clean-console enforcement and visual comparisons |
| `npm run build` | Passed: 4,146 modules transformed |
| Firebase public-export and production bundle audits | Passed; all imported symbols remain public and no compat implementation module is bundled |
| `npm run ci-pr` | Passed once: lint, 19 Vitest files / 88 tests, and isolated test build |

npm continues to report the three unrelated moderate audit findings recorded in Phase 7. No automatic or forced audit fix was applied.

### Manual review and next phase

Before release, use development or local emulator configuration to verify:

- Google sign-in and sign-out, including popup cancellation/error handling and a token/claim refresh after an administrator or QA claim changes
- the signed-in user's profile subscription and an administrator viewing another user's full profile; confirm an ordinary user receives only the public profile representation
- one ranking request and representative evidence and award writes, confirming success/error messages and listener-driven refresh after each write
- the `VITE_DEV_FIRESTORE=true` path against the intended named development database, because the current Firestore emulator cannot validate multiple databases
- sign-in popup behavior on a recent iOS/iPadOS Safari device if those browsers are release-critical

Phase 9 can upgrade Vite independently on the Firebase 12 checkpoint. Recheck the 57.20 kB gzip main-chunk increase when evaluating Vite 8 tree shaking.

### Phase 8 exit criteria

- [x] Firebase web SDK resolves to 12.19.0 without changing Firebase Admin or Functions package versions.
- [x] Application Firebase App, Auth, and Firestore imports remain public modular exports.
- [x] Default/named database selection, emulator wiring, and production test guards pass unit coverage.
- [x] Auth, subscription, transaction, create/update/delete, and permission-error behavior passes against isolated emulators.
- [x] Production bundle analysis contains no compat implementation modules and records the size delta.
- [x] Focused Vitest, clean installation, full Playwright, Functions emulator integration, test build, and production build pass.
- [x] The single final `npm run ci-pr` checkpoint passes.
- [x] No production deployment or live-data script was run.

## Phase 9: Upgrade Vite 6 to 7 to 8

### Summary

Phase 9 upgraded Vite from 6.4.3 through a 7.3.6 checkpoint to 8.3.0. The React integration moved from `@vitejs/plugin-react` 4.7.0 to 5.2.0 before the Vite 8 switch, then to 6.1.1 as a separate final step. `rollup-plugin-visualizer` moved from 5.14.0 to 7.1.1 before Vite 8 so production bundle reporting supports Rolldown.

The obsolete `rolldown: 1.0.1` override was removed. Vite now selects Rolldown 1.2.8, and the old esbuild install-script allowance was removed with Vite 8's esbuild dependency. The official `rolldown-vite` bridge was unnecessary. Application source and Vite/Vitest configuration needed no compatibility edits.

No production deployment or live-data operation was performed.

### Compatibility and test changes

`tests/e2e/viteBundle.spec.js` now inspects the fresh test build, confirms representative award and Markdown lazy-route chunks are emitted, and requests every emitted JavaScript asset from the preview server. The final build contains 401 JavaScript assets, all of which returned successfully in the focused and full Playwright runs.

The final Vite 8 development server started in 115 ms. Direct requests verified the React entry transform, CSS transform, PNG asset, and raw Markdown asset. Development transforms retain inline source maps; production and test builds retain the existing default of no emitted `.map` files. Test mode continues to omit `.env.keysNew` loading and the visualizer, while development/production modes retain their previous loading behavior.

The Vite 7 `ci-pr` checkpoint was run once and passed in the ambient Node 23 agent shell before that shell mismatch was detected. All subsequent bridge checks and every final Vite 8 verification ran under the repository's pinned Node 24.15.0 runtime. The intermediate Vite 7 state is not shipped.

Vite 8's default browser target is Chrome 111, Edge 111, Firefox 114, and Safari 16.4. That does not narrow the Phase 7 release baseline, because Material UI 9 already requires newer Chrome 117, Edge 121, Firefox 121, and Safari 17 browsers.

### Bundle review

Rolldown transformed 3,628 modules, down from 4,146 under Vite 7, and the final production build completed in 1.06 seconds compared with 4.82 seconds at the Vite 7 bridge checkpoint. The production visualizer report is still generated.

Rolldown changed chunk boundaries enough that the former monolithic main-chunk comparison is no longer meaningful. The Vite 7 main chunk was 3,747.85 kB minified / 749.94 kB gzip. Vite 8 splits that work across a 2,397.32 kB / 312.38 kB database-context chunk, a 549.04 kB / 161.84 kB authentication chunk, and a 293.75 kB / 87.55 kB entry chunk, plus smaller shared chunks. The largest feature chunks remain comparable: AwardRoute is 1,136.20 kB / 506.94 kB, Dropzone is 1,373.64 kB / 353.48 kB, and EvidenceForm is 156.25 kB / 47.12 kB. The known large-chunk warning remains and now references Rolldown code splitting.

### Verification results

| Command/check | Result |
| --- | --- |
| Vite 6 focused baseline | Passed: 3 Vitest files / 16 tests and test build |
| Vite 7 focused checkpoint | Passed: dependency resolution, 3 Vitest files / 16 tests, development asset requests, and production build |
| Vite 7 `npm run ci-pr` | Passed once: lint, 19 Vitest files / 87 tests, and test build |
| plugin-react v5 / visualizer v7 bridge | Passed: dependency resolution, 3 Vitest files / 16 tests, visualizer output, and production build |
| Vite 8 + plugin-react v6 focused checkpoint | Passed: 3 Vitest files / 16 tests, test build, production build, and focused chunk-serving Playwright test |
| `npm ls --depth=0` | Passed; Vite 8.3.0, plugin-react 6.1.1, visualizer 7.1.1, and Rolldown 1.2.8 resolve without Rollup/esbuild duplicates |
| `npm run dev` plus asset requests | Passed; server ready in 115 ms and entry/CSS/PNG/Markdown requests returned successfully |
| `npm run test:coverage` | Passed: 19 files / 87 tests; 18.51% statements, 14.84% branches, 16.83% functions, and 18.67% lines |
| `npm run e2e` | Passed: 13 Chromium journeys, including all 401 emitted JavaScript assets, with clean-console and visual enforcement |
| `npm run build` | Passed: 3,628 modules transformed in 1.06 seconds; visualizer output generated |
| Final Vite 8 `npm run ci-pr` | Passed once under Node 24.15.0: lint, 19 Vitest files / 87 tests, and test build |

`npm audit` continues to report the same three unrelated moderate findings from `csv-parse` and the transitive `gaxios`/`uuid` path. `npm outdated` reports no pending Vite, React plugin, or visualizer update. No automatic or forced audit fix was applied.

### Manual review

Before release, use a development or local-emulator configuration to verify:

- edit a rendered component and a CSS rule while `npm run dev` is open; confirm both hot updates apply without a full reload or console error
- navigate through representative lazy routes, including Awards, Belts Markdown, scorecards, lock browsing, and admin routes available to the test account
- confirm responsive styling, fonts, images, raw Markdown content, and upload/dropzone interaction in a recent Chromium browser and Safari 17+
- inspect browser network and console output during sign-in and Firestore-backed navigation; confirm no failed chunks or unexpected destinations
- confirm any values using Vite's `VITE_` prefix are intentionally public client configuration; Vite exposes all such values to browser code

### Phase 9 exit criteria

- [x] Vite passed through a working 7.3.6 checkpoint and resolves to 8.3.0 in the final state.
- [x] plugin-react resolves to 6.1.1, visualizer resolves to 7.1.1, and Vite controls Rolldown 1.2.8 without an override.
- [x] Test and production environment-loading behavior remains distinct.
- [x] Development entry/CSS/assets/Markdown transforms and both builds pass.
- [x] Every emitted JavaScript chunk loads from preview.
- [x] Bundle boundary and large-chunk changes are documented.
- [x] Coverage, full Playwright, production build, and the single final Vite 8 `ci-pr` checkpoint pass under Node 24.15.0.
- [ ] Perform the manual HMR and release-browser checks above.
- [x] No production deployment or live-data script was run.

## Post-upgrade npm audit remediation

### Summary

After the major-version phases, the root package's three moderate audit paths and the Functions package's ten moderate audit paths were resolved deliberately. Both package trees now report zero vulnerabilities. No production deployment or live-data operation was performed.

### Dependency changes

The root package upgraded `csv-parse` from 5.6.0 to 7.0.2. The two import scripts retain the supported `csv-parse/sync` API and passed a direct parse smoke test. Firebase Admin's optional Cloud Storage graph still selects `gaxios` 6.7.1, whose declared UUID range resolves to the vulnerable UUID 9 line, so a scoped override supplies CommonJS-compatible `uuid` 11.1.1 only beneath `gaxios`. Its `v4()` API matches the sole UUID call in `gaxios` 6.

The Functions package upgraded `firebase-admin` from 13.10.0 to 14.4.0. This replaced the vulnerable Firestore, Storage, Google GAX, retry-request, and teeny-request paths while preserving the modular `firebase-admin/app` and `firebase-admin/firestore` APIs used by the triggers. The same scoped `gaxios` UUID override resolves the remaining nested UUID advisory.

`firebase-functions-test` was removed from the Functions development dependencies. A repository-wide source search confirmed that it was never imported; the change-tracker integration suite uses Firebase Admin directly against the isolated emulators. Removing the unused package also removes its vulnerable `ts-deepmerge` dependency and avoids its outdated Firebase Admin peer range.

### Verification results

| Command/check | Result |
| --- | --- |
| Root `npm audit` | Passed: 0 vulnerabilities |
| Root `npm run ci-pr` | Passed: lint, 19 Vitest files / 87 tests, and test build |
| Root CSV and nested UUID smoke tests | Passed |
| Functions `npm ci --ignore-scripts` under Node 24.15.0 | Passed: clean lockfile installation and 0 vulnerabilities |
| Functions `npm audit` | Passed: 0 vulnerabilities |
| `npm --prefix functions run lint` | Passed |
| Firebase Admin 14 import and nested UUID smoke tests | Passed |
| `npm run test:functions:integration` | Passed: create/update/delete for lockcollections, awards, and evidence |

The clean Functions install still emits deprecation notices for `glob` 10.5.0 and `node-domexception` 1.0.0. These are not active `npm audit` findings. They come from the latest Firebase Admin 14.4 graph: Firestore 9.1.0 includes Firestore API 0.2.0, whose Google GAX 5 dependency selects Rimraf 5 and Glob 10; Google GAX 6 selects the latest Node Fetch 3 release, which still uses Fetch Blob 3 and `node-domexception`. Removing those notices would require unsupported transitive-major overrides, so they remain deferred to upstream package updates.

No Functions deployment was performed. The source and lockfile changes will take effect only during the separately approval-gated production rollout.
