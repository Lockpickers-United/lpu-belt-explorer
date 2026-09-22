# Major Dependency Upgrade Plan

Status: active; Phases 0–4 completed  
Created: 2026-09-14

Implementation results are recorded in `internal-docs/major-dependency-upgrade-implementation-report.md`.

## Executive recommendation

Build a focused compatibility safety net before starting these upgrades, then add or adjust tests during each migration. Do not postpone all upgrades until broad coverage is complete, and do not attempt to raise whole-project coverage first.

Tests written around user-visible behavior should survive the upgrades and are worth adding now. Tests tied to Material UI DOM structure, CSS classes, snapshots, exact effect invocation counts, generated bundle filenames, or library implementation details are likely to churn and should be avoided.

The best sequence is:

1. Add targeted tests for the boundaries most exposed to these upgrades.
2. Establish the required Node baseline.
3. Migrate ESLint through flat config and then to ESLint 10.
4. Upgrade Vitest 4 to 5 while still using Vite 6.
5. Remove MUI legacy/deprecated APIs under the current version, then move MUI 5 to 6.
6. Upgrade React 18.3 to React 19.
7. Upgrade React Router 6 to 7.
8. Advance Material UI 6 to 7 to 9 and MUI X Date Pickers 7 to 8 to 9.
9. Upgrade the Firebase web SDK 11 to 12.
10. Move Vite 6 to 7 to 8, treating the Rolldown/Oxc transition as its own migration.

Each numbered migration should be independently reviewable and should end with a green checkpoint. Avoid one combined lockfile commit containing all seven major changes.

## Current baseline

Current resolved versions at the time of planning:

| Package family | Current | Target |
| --- | ---: | ---: |
| React / React DOM | 18.3.1 | 19.x |
| Firebase web SDK | 11.10.0 | 12.x |
| Material UI / Icons | 5.18.0 | 9.x |
| MUI X Date Pickers | 6.20.2 | 9.x |
| Vite | 6.4.3 | 8.x |
| `@vitejs/plugin-react` | 4.7.0 | compatible with Vite 8, eventually 6.x |
| Vitest / UI / coverage | 4.1.11 | 5.x, kept on identical versions |
| ESLint | 8.57.1 | 10.x |
| React Router DOM | 6.30.6 | 7.x |

The current automated baseline is useful but narrow:

- 76 Vitest tests
- 9 Playwright journeys
- 18.41% statement coverage
- an emulator-backed integration suite for the three Firestore change trackers
- passing lint, test-mode build, and production build

The repository already uses React's `createRoot`, the modern JSX transform through Vite, Firebase's modular web API, and React Router's data router with `createHashRouter`. Those choices reduce migration work.

The main project-specific risk areas are:

- approximately 255 source files import Material UI packages
- 12 files use MUI `componentsProps`, which is removed in favor of slots in later MUI versions
- one file still uses legacy `@mui/styles/makeStyles`
- MUI forms rely heavily on dialogs, menus, Autocomplete, inputs, and Date Pickers
- approximately 103 source/test files import React Router
- Firestore subscriptions, transactions, and authenticated writes are concentrated in several large context providers with little direct test coverage
- root and Functions linting use legacy `.eslintrc` configurations
- Vite's production-only visualizer plugin and the existing `rolldown` override need explicit compatibility review

## What to test before upgrading

### Add these tests first

These tests assert application contracts and should remain useful after the upgrades.

#### Provider and React lifecycle coverage

- Add a configurable provider/render harness as described in the testing strategy.
- Test `AuthContext` transitions: anonymous, signed in, sign-out, claims refresh, popup failure, and cleanup.
- Test `ProfileContext` privacy paths: self, anonymous visitor, ordinary user viewing another user, and administrator viewing another user.
- Test representative `DBContext` reads, writes, transactions, listener establishment, listener cleanup, and permission failures.
- Verify that Strict Mode does not produce duplicate persistent subscriptions or duplicate writes.
- Assert observable outcomes and unsubscribe behavior, not an exact number of render/effect invocations.

#### Router coverage

- Render the real route tree with a memory/data router test harness.
- Cover root and legacy redirects, representative lazy routes, nested routes, route errors, and unknown routes.
- Cover hash URLs, route parameters, search-parameter preservation, and back/forward navigation.
- Cover anonymous, authenticated, and admin route access.
- Cover Discord and Reddit callback routes without contacting external services.
- Preserve the existing slow-typing search regression test because Router changes can affect URL synchronization.

#### MUI interaction coverage

- Test one representative Dialog workflow, including focus, close/cancel, confirmation, and backdrop/escape behavior.
- Test one Menu or Select workflow with keyboard input.
- Test Autocomplete typing, selection, clearing, and no-match behavior.
- Test the evidence Date Picker's displayed and submitted value.
- Test Tabs/Accordion keyboard behavior and selected/expanded state.
- Test one upload/dropzone validation flow.
- Prefer accessible roles, names, and resulting state. Do not snapshot MUI markup or assert generated class names.

#### Firebase behavior coverage

- Unit-test the Firebase initialization branch for normal, development-database, and emulator configurations.
- Test auth observer and popup success/error behavior behind mocks or injected adapters.
- Add emulator-backed tests for representative Firestore subscription, transaction, and write paths using synthetic documents.
- Keep the existing change-tracker suite as a Functions contract check; the Firebase web SDK upgrade does not replace it.
- Continue to fail closed when emulator hosts are missing or non-loopback.

#### Build and test-tool coverage

- Add a small test that proves each asynchronous assertion is awaited; audit the suite for `.resolves`, `.rejects`, and polling calls before Vitest 5.
- Explicitly enable `clearMocks: true` under Vitest 4 and fix any test-order dependency before upgrading.
- Keep both test-mode and production builds as required checks because the visualizer is production-only.
- Record representative production bundle totals and verify that all lazy route chunks can be requested. Do not assert hashed filenames.
- Treat browser console errors and failed module requests as Playwright failures.

### Tests that can wait until or change during migration

- Exact MUI DOM hierarchy or heading-level assertions where the new version intentionally improves semantics
- Visual baselines for every component; add only a few representative responsive screenshots after MUI 9
- ESLint message wording or line/column snapshots
- Vitest-formatted snapshot output and generated test titles
- Vite chunk names, chunk ordering, or exact byte-for-byte bundles
- Tests of deprecated APIs that will be removed as part of the migration

When an accessibility-oriented MUI change breaks a role or focus assertion, review whether the product behavior improved or regressed. Do not mechanically rewrite the test to accept any new output.

## Upgrade phases

### Phase 0: Create a controlled upgrade baseline — complete

1. Start from a clean branch after the current dependency/emulator work is committed.
2. Record `node --version`, `npm --version`, `npm ls --depth=0`, and `npm audit` output.
3. Run and record:

   ```bash
   npm run ci-pr
   npm run test:coverage
   npm run e2e
   npm run test:functions:integration
   npm run build
   npm --prefix functions run lint
   ```

4. Capture the production build's total output size and existing large-chunk warnings for comparison.
5. Implement the targeted pre-upgrade tests above, prioritizing providers/router behavior and representative MUI controls.
6. Require a clean browser console during Playwright runs.

Exit criteria:

- The new tests pass against current versions.
- Tests do not contact live Firebase or external APIs.
- Test behavior does not depend on implementation-level MUI markup or generated bundle names.

### Phase 1: Align all environments on Node 24 LTS — complete

Node 24 is the common baseline for local development, CI, frontend tooling, and the next Firebase Functions deployment. It avoids establishing a short-lived Node 22 baseline immediately before the remaining major upgrades. Node 24.11.0 is the first Node 24 LTS release, and Node 24 remains supported through April 2028.

1. Pin the tested local release, Node 24.15.0, in `.nvmrc`.
2. Require `>=24.11.0 <25` in the root `package.json`, allowing supported Node 24 LTS patches while rejecting older and future major versions.
3. Select Firebase's `nodejs24` runtime through `"engines": {"node": "24"}` in `functions/package.json`.
4. Make every GitHub workflow read `.nvmrc` through `actions/setup-node` instead of independently naming a Node major.
5. Update contributor and agent documentation to require the project-pinned Node release.
6. Reinstall and verify the frontend and Functions dependencies under Node 24, then run the complete Phase 0 suite.

The current Firestore triggers use the second-generation Functions API, which supports Node 24. Firebase CLI 14.25 added support for running the CLI on Node 24, and 14.26 added support for deploying the `nodejs24` Functions runtime. The project integration suite uses Firebase CLI 15.30.0. Firebase's general Functions guide still lists Node 20 and 22, but the Firebase CLI release notes and Google Cloud runtime schedule explicitly include Node 24 for second-generation functions.

Exit criteria:

- [x] `.nvmrc`, package metadata, contributor documentation, and all CI workflows agree on Node 24.
- [x] Frontend and Functions dependency installation succeeds under the pinned release.
- [x] Lint, Vitest, coverage, Playwright, both Vite builds, and Functions emulator integration pass under Node 24.
- [x] No production deployment or live-data operation is performed as part of the runtime configuration change.

The source configuration for the Functions runtime is complete. Applying Node 24 to the deployed Functions remains a separate production deployment and is approval-gated.

References: [Node 22 to 24 migration](https://nodejs.org/en/blog/migrations/v22-to-v24), [Firebase CLI release notes](https://firebase.google.com/support/release-notes/cli), [Cloud Run functions runtime schedule](https://docs.cloud.google.com/functions/docs/runtime-support), [Vite 8 announcement](https://vite.dev/blog/announcing-vite8), [Vitest 5 migration guide](https://vitest.dev/guide/migration/), and [ESLint 10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0).

### Phase 2: Migrate ESLint 8 to 9 to 10 — complete

Do this before large source migrations so lint remains a trustworthy feedback loop.

1. Inventory the compatibility of `eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-config-google` with ESLint 10.
2. Upgrade root ESLint to the latest 9.x and migrate `.eslintrc.cjs` to `eslint.config.js` flat config.
3. Preserve current source globs, ignored generated files, warning/error levels, JSX handling, and import-extension conventions.
4. Run the old and new configurations against the same commit and reconcile differences deliberately.
5. Migrate the separate Functions configuration independently. If `eslint-config-google` is not compatible, encode the small required Functions style rules directly or adopt a maintained equivalent rather than forcing peer dependencies.
6. Upgrade to ESLint 10 and run the official v9-to-v10 codemod as a review aid, not as an unreviewed bulk rewrite.
7. Check for newly reported JSX references, obsolete `eslint-env` comments, changed recommended rules, and editor configuration.

Verification:

```bash
npm run lint
npm --prefix functions run lint
npm run ci-pr
```

Exit criteria:

- [x] Root and Functions lint run natively on ESLint 10 without compatibility flags.
- [x] No `--force` or peer-dependency override is required.
- [x] The official v9-to-v10 codemod dry run reports no required source changes.
- [x] Rule behavior changes and deferred findings are documented separately from the Functions formatting correction.

The root migration replaces `eslint-plugin-import` with the ESLint-10-compatible `eslint-plugin-import-x`. The published `eslint-plugin-react` release does not support ESLint 10 and was removed rather than installed through a peer override. ESLint 10 provides native JSX reference tracking, and `eslint-plugin-react-hooks` remains active, but the React plugin's additional component/JSX diagnostics are temporarily unavailable. Restore those diagnostics when a JavaScript-only ESLint 10-compatible release is available, or evaluate an alternative during the React 19 phase without introducing a TypeScript toolchain solely for linting.

ESLint 9 and 10 added recommended rules that report existing source patterns. They are explicitly disabled for this compatibility phase so the migration does not combine toolchain work with unrelated source changes. Review and enable `no-constant-binary-expression`, `no-useless-assignment`, and `preserve-caught-error` in a focused follow-up.

References: [flat-config migration](https://eslint.org/docs/latest/use/configure/migration-guide) and [ESLint 10 migration](https://eslint.org/docs/latest/use/migrate-to-10.0.0).

### Phase 3: Upgrade Vitest 4 to 5 on Vite 6 — complete

Vitest 5 supports the current Vite 6.4 baseline, so upgrade the test runner before changing the bundler.

1. Update `vitest`, `@vitest/ui`, and `@vitest/coverage-v8` to the exact same 5.x version.
2. Keep Vite at 6.4.x for this phase.
3. Retain explicit `clearMocks: true` even though Vitest 5 makes it the default, so project behavior remains obvious.
4. Fix all unawaited asynchronous assertions; Vitest 5 turns them into failures.
5. Search for removed sequential APIs and deprecated Vitest entry points.
6. Review snapshot/test-title changes only if the project begins using those features.
7. Re-record coverage and compare it with the baseline; a runner update should not silently reduce collected files.

Verification:

```bash
npm run test:ci
npm run test:coverage
npm run ci-pr
```

Exit criteria:

- [x] Test count remains 18 files and 76 tests, and the intended coverage scope is unchanged.
- [x] Tests pass normally and in randomized/repeated order.
- [x] No unawaited assertion warnings remain.

Vitest, `@vitest/ui`, and `@vitest/coverage-v8` are pinned together at 5.0.0. Vite remains at the resolved 6.4.3 baseline, and explicit `clearMocks: true` remains in configuration. Vitest 5's updated V8 coverage conversion changes the aggregate counters slightly despite an unchanged source glob: statements move from 18.41% to 18.39% and lines from 18.55% to 18.54%; branch and function percentages are unchanged. This is recorded as a tooling-accounting change rather than a test-scope regression.

Reference: [Vitest 5 migration guide](https://vitest.dev/guide/migration/).

### Phase 4: Prepare MUI under v5, then upgrade to v6

Material UI is the broadest source migration and should be staged rather than jumped directly from 5 to 9.

#### Phase 4A: Remove legacy APIs while still on MUI 5 — complete

1. Replace the single `@mui/styles/makeStyles` use in `LeaderboardName.jsx` with `sx`, `styled`, or ordinary styles, then remove `@mui/styles`.
2. Migrate MUI uses of `componentsProps`/`components` to `slotProps`/`slots` where the current component version supports both.
3. Audit deprecated `InputProps`, `inputProps`, `MenuProps`, CardHeader typography props, Dialog props, and composed button `component` usage.
4. Distinguish Autocomplete's valid `renderInput` usage from deprecated Date Picker APIs; do not bulk-replace all `renderInput` occurrences.
5. Run the relevant official codemods on a temporary branch or one directory at a time, then review every resulting diff.

Phase 4A removed `@mui/styles`, migrated every supported Dialog backdrop customization from `componentsProps` to `slotProps`, and corrected three pre-existing uses of slot APIs that are not available in MUI 5.18. The remaining TextField, ListItemText, Menu, and Dialog transition props were reviewed but intentionally retained because their replacement slots are not exposed by the installed v5 components. They will be migrated after the v6 checkpoint exposes both sides of those APIs.

#### Phase 4B: Upgrade MUI 5 to 6 — complete

1. Upgrade `@mui/material`, `@mui/icons-material`, Emotion packages, and related peers to compatible v6 releases.
2. Apply and review the MUI v6 codemods and migration guide.
3. Upgrade MUI X Date Pickers 6 to 7 separately and retest date parsing, formatting, disabled dates, and submission values.
4. Verify accordion heading changes, Dialog focus/close behavior, Autocomplete equality/clearing, menus, tabs, tooltips, and responsive layout.

Verification after each subphase:

```bash
npm run lint
npm run test:ci
npm run e2e
npm run build:test
npm run build
```

Exit criteria:

- `@mui/styles` is removed.
- No runtime deprecation warnings appear in tested routes.
- Representative keyboard/focus workflows and forms still work.
- MUI 6 is stable before React changes begin.

References: [MUI v6 migration](https://mui.com/material-ui/migration/upgrade-to-v6/) and [MUI X Date Pickers v6-to-v7 migration](https://mui.com/x/migration/migration-pickers-v6/).

Phase 4B upgraded Material UI and Icons to 6.5.0 and MUI X Date Pickers to 7.29.4. The retained v5 props were migrated to their v6 slot equivalents, React 18's `react-is` version was pinned as required by MUI 6, and behavior-level coverage was added for Accordion keyboard semantics, Tooltip interaction, and the mobile filter drawer. Six accordions whose summaries contain nested interactive controls explicitly preserve `div` semantics; ordinary summaries use MUI 6's heading/button structure.

### Phase 5: Upgrade React 18.3 to React 19

React 18.3 was specifically intended to emit warnings for APIs that need attention before React 19. The application already uses `createRoot` and no obvious removed React APIs were found in source.

1. Run all tests and primary routes under React 18.3 development mode and eliminate React-owned deprecation warnings first.
2. Verify every important third-party package declares React 19 compatibility, especially MUI, Nivo, dropzone, markdown, windowing, full-screen, swipe, and transition-related packages.
3. Upgrade `react` and `react-dom` together. Keep `@types/react` aligned even though the project is JavaScript because editor and dependency tooling consume the types.
4. Do not adopt React 19 features in the same change; keep this a compatibility migration.
5. Exercise Strict Mode subscriptions, callback refs, lazy/Suspense routes, error boundaries, portals/dialogs, and form submission behavior.
6. Treat new console warnings as failures to resolve, not expected upgrade noise.

Verification:

```bash
npm run ci-pr
npm run test:coverage
npm run e2e
npm run build
```

Exit criteria:

- No React deprecation, ref, act, key, hydration, or state-update warnings occur in tests or manual smoke checks.
- Subscription/write behavior remains single and correctly cleaned up.

Reference: [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).

### Phase 6: Upgrade React Router 6 to 7

The application uses data-router mode (`createHashRouter`) while most route modules import from `react-router-dom`.

1. Update to the latest 6.x first.
2. Enable each applicable v7 future flag while still on v6, one at a time, and run router/search tests after each flag.
3. Pay particular attention to nested absolute paths, redirects, relative navigation, splat behavior, search-parameter updates, lazy route errors, and navigation state.
4. Upgrade to the latest secure React Router 7 release.
5. Keep `react-router-dom` imports initially because v7 preserves them as re-exports; moving imports to `react-router` can be a separate mechanical change.
6. Retest hash deep links, refresh behavior, back/forward navigation, OAuth callback routes, protected/admin routes, and SearchBox URL synchronization.

Verification:

```bash
npm run test:ci
npm run e2e
npm run build:test
npm run build
```

Exit criteria:

- All declared routes resolve to the same intended UI and access boundary.
- Direct hash links and browser history work in a production preview.
- No router future/deprecation warnings remain.

Reference: [React Router upgrade guidance](https://reactrouter.com/upgrading/v6).

### Phase 7: Complete Material UI 7 and 9 migrations

Material UI moved from v7 directly to v9; there is no Material UI Core v8. MUI X packages, including Date Pickers, do have an v8 step.

1. Upgrade Material UI Core/Icons 6 to 7 and apply the v7 migration guide.
2. Upgrade Date Pickers 7 to 8 and validate the evidence form before proceeding.
3. Remove every API deprecated by MUI 7 that MUI 9 removes, especially legacy slots/props and custom button element assumptions.
4. Upgrade Material UI Core/Icons 7 to 9 and Date Pickers 8 to 9 in a coordinated checkpoint.
5. Verify the new supported-browser baseline is acceptable for the site's users.
6. Run focused accessibility checks for menu, tabs, stepper/accordion, dialog, autocomplete, and button keyboard behavior because MUI 9 intentionally changes some semantics and event propagation.
7. Add a small visual regression set for representative desktop/mobile pages after the DOM migration stabilizes.

Verification:

```bash
npm run ci-pr
npm run test:coverage
npm run e2e
npm run build
```

Exit criteria:

- All MUI packages use compatible majors and there are no old Core/X duplicates.
- There are no MUI deprecation or invalid-prop warnings.
- Forms, dialogs, keyboard navigation, and responsive layouts pass automated and manual checks.

References: [MUI v7 migration](https://mui.com/material-ui/migration/upgrade-to-v7/) and [MUI v9 migration](https://mui.com/material-ui/migration/upgrade-to-v9/).

### Phase 8: Upgrade Firebase web SDK 11 to 12

This should be a comparatively small source migration because the frontend already uses modular imports. Firebase 12 requires Node 20+ for Node use and targets ES2020; the planned Node/Vite baseline satisfies both.

1. Upgrade only the `firebase` web package first. Do not combine this with a Firebase Admin or Functions SDK major update.
2. Verify all imported symbols from `firebase/app`, `firebase/auth`, and `firebase/firestore` remain public and correctly tree-shaken.
3. Run provider tests for app initialization, named development database selection, auth emulator connection, Firestore emulator connection, and production guard behavior.
4. Run emulator-backed subscription, transaction, create/update/delete, and permission-error scenarios.
5. Manually test sign-in/out, token/claim refresh, own profile, admin profile access, ranking requests, evidence/award writes, and listener refresh behavior against development/emulators.
6. Compare production bundle size because Firebase package/export changes can affect tree shaking.

Verification:

```bash
npm run ci-pr
npm run e2e
npm run test:functions:integration
npm run build
```

Exit criteria:

- No frontend Firebase path contacts live services during tests.
- Auth and Firestore behavior passes mocks plus representative emulator integration.
- Bundle output does not unexpectedly include compat SDKs.

Reference: [Firebase JavaScript SDK release notes](https://firebase.google.com/support/release-notes/js) and [modular web SDK guidance](https://firebase.google.com/docs/web/modular-upgrade).

### Phase 9: Upgrade Vite 6 to 7 to 8

Vite 8 replaces the esbuild/Rollup pipeline with Rolldown/Oxc. Keep this last so failures can be attributed to the bundler rather than simultaneous React/MUI/Router changes.

1. Upgrade Vite 6 to 7 with the existing React plugin and resolve all v7 migration items.
2. Upgrade `@vitejs/plugin-react` to v5, which is compatible with Vite 8, before changing the bundler.
3. Reassess and preferably remove the current `rolldown: 1.0.1` override; Vite 8 should control the compatible Rolldown version unless a documented project-specific issue requires otherwise.
4. Verify `rollup-plugin-visualizer` compatibility or upgrade/replace it before the Vite 8 switch. Remember that test-mode builds omit this plugin, so the production build is mandatory.
5. Optionally use the official `rolldown-vite` Vite 7 bridge as a diagnostic checkpoint if direct Vite 8 failures are difficult to isolate.
6. Upgrade to Vite 8, then upgrade `@vitejs/plugin-react` to v6 as a separate final step.
7. Compare dev startup, HMR, test transforms, CSS/assets, Markdown assets, environment loading, lazy chunks, source maps, and production bundle output.
8. Review the newer default browser target and confirm it matches the supported-browser policy.

Verification:

```bash
npm run dev
npm run ci-pr
npm run test:coverage
npm run e2e
npm run build
```

Exit criteria:

- Development startup and HMR work without transform errors.
- Test and production modes preserve their different environment-loading behavior.
- Every lazy route chunk loads in preview.
- Bundle-size changes and large chunks are understood and documented.

References: [Vite 8 migration guide](https://vite.dev/guide/migration) and [Vite 8 announcement](https://vite.dev/blog/announcing-vite8).

## Verification required at every checkpoint

At minimum:

```bash
npm ls --depth=0
npm run lint
npm run test:ci
npm run build:test
```

Add these according to the affected boundary:

- `npm run test:coverage` for React, Vitest, and substantial test-harness changes
- `npm run e2e` for React, Router, MUI, Firebase, and Vite
- `npm run build` for every package or bundler migration
- `npm run test:functions:integration` for Firebase or Functions-adjacent changes
- `npm --prefix functions run lint` for the Functions ESLint migration
- `npm audit` and `npm outdated` after each lockfile change

Do not use `--force` or `--legacy-peer-deps` to make an incompatible dependency tree install. Resolve or defer the incompatible package.

## Manual release checks

Before any production deployment, perform these checks against a development or emulator environment:

1. Anonymous browsing, search, filters, sorting, hash deep links, refresh, and back/forward.
2. Sign-in/out and Discord/Reddit callback handling.
3. Own profile and another user's public profile.
4. Admin viewing another user's full profile and admin-only routes.
5. Lock collection edits and subscription refreshes.
6. Ranking request list, vote, create/edit/delete, and activity reporting.
7. Evidence and award create/edit/delete with Date Picker behavior.
8. Dialog, menu, Autocomplete, tabs, accordion, keyboard focus, and mobile layouts.
9. Photo/upload validation and error handling.
10. Production preview with no browser-console errors, failed chunks, or unexpected network destinations.

Production deployment remains approval-gated and should occur only after the final integrated branch passes this matrix.

## Delivery strategy

Prefer one pull request per migration checkpoint:

1. Targeted compatibility tests
2. Node baseline
3. ESLint flat config and ESLint 10
4. Vitest 5
5. MUI legacy cleanup and MUI 6
6. React 19
7. React Router 7
8. MUI 7/9 and MUI X 8/9
9. Firebase 12
10. Vite 7/8 and React plugin updates

Merge only green checkpoints. If these must remain on one long-lived branch, make one reviewed commit per checkpoint so each migration can be reverted or bisected independently.

## Definition of done

- All target package families are on compatible requested majors without forced peer resolution.
- Root and Functions lint run on supported ESLint configurations.
- Unit, coverage, emulator, browser, test-mode build, and production build checks pass.
- No new runtime, React, MUI, Router, Firebase, or build warnings remain unexplained.
- No automated test contacts production services.
- Browser support and bundle-size changes are documented and accepted.
- Manual auth, profile, Firestore, form, navigation, responsive, and accessibility checks pass.
- Production deployment occurs only with explicit approval.
