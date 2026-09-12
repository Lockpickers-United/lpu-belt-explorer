# AGENTS.md

This file applies to the entire `lpu-belt-explorer` repository. It is guidance for automated coding agents and should be updated when the architecture or development workflow changes.

## Project overview

`lpu-belt-explorer` is the React web application behind [lpubelts.com](https://lpubelts.com). It combines mostly static belt-ranking data with authenticated Firebase features such as profiles, collections, scorecards, evidence, awards, and ranking requests.

The main runtime pieces are:

- `src/`: React 18 application built with Vite.
- `src/app/`: top-level providers, routing, authentication, API access, and Firestore access.
- Feature directories under `src/`: route components and supporting UI grouped by domain.
- `src/data/`: application data, schemas, mappings, and generated/imported JSON.
- `scripts/`: data imports, exports, migrations, and administrative utilities. Some scripts use external services or production data.
- `functions/`: separately packaged Firebase Cloud Functions project.
- `tests/vitest/`: component and route tests using Vitest, Testing Library, and MSW.
- `tests/e2e/`: browser tests using Playwright.
- `public/`: static assets and generated public data.

The sibling repository `../explore-lpubelts-com-node` owns server-side exports and API services. Agents are authorized to edit that sibling repository automatically when an in-scope change spans both repositories; no separate permission is needed for those code edits. Before editing it, inspect its working tree and applicable `AGENTS.md` files, preserve unrelated changes, and validate each repository according to its own conventions.

## Toolchain and commands

- Use Node 22 (`.nvmrc` and both `package.json` files require it).
- Use npm. CI installs with `npm ci`, and `package-lock.json` is the dependency lockfile.
- Start the app with `npm run dev`; Vite normally serves on port 3000.
- Run the full frontend lint with `npm run lint`.
- Lint only touched frontend files during iteration with `npx eslint path/to/file.jsx ...`.
- Run all unit tests once with `npm run test:run`.
- Run a focused unit test with `npx vitest run tests/vitest/SomeRoute.test.jsx`.
- Run the production build with `npm run build`.
- Run PR-equivalent checks with `npm run ci-pr` (lint, then build).
- Run all end-to-end tests with `npm run e2e`, or a focused test with `npx playwright test tests/e2e/example.spec.js`.
- Lint Functions with `npm --prefix functions run lint`.

Prefer focused checks while developing, followed by the smallest broader check justified by the change. Do not run `npm run ci-build` merely as a validation shortcut: it invokes generators and exporters in addition to building.

## Code conventions

### Frontend and scripts

Follow `.eslintrc.cjs` and the style of the file being edited:

- Use JavaScript only. Do not introduce TypeScript or a type-checking toolchain unless the user explicitly requests that migration.
- ES modules and functional React components.
- Four-space indentation in established frontend files.
- Single quotes.
- No semicolons.
- PascalCase for components and route files; camelCase for functions, hooks, and values.
- Keep imports relative and follow the existing extension convention enforced by ESLint.
- Use MUI components and theme values where the surrounding UI already does so.
- Keep changes local to the relevant feature; avoid opportunistic formatting or broad refactors.
- Treat hook dependency warnings as correctness signals. Suppress one only when the existing lifecycle behavior is deliberate and documented.

There is no repository-wide autoformatter. Preserve nearby formatting when a file differs slightly from the dominant style.

### Firebase Functions

`functions/` is a separate CommonJS package with its own Google ESLint configuration. Its conventions differ from the frontend:

- Use `require()` and `exports`.
- Use double quotes and semicolons as required by `functions/.eslintrc.js`.
- Use two-space indentation and the existing Firebase Functions v2 APIs.
- Run the Functions lint from its package after every change.

Do not mechanically apply frontend formatting rules to `functions/`.

## Implementation approach

- For change requests, implement and verify the requested behavior rather than stopping at a description or sample patch.
- Inspect the relevant existing code and nearby tests before editing. Search for established patterns, utilities, hooks, and components before adding a helper or abstraction.
- Prefer fixing the underlying cause over adding a workaround that leaves conflicting state or duplicated behavior in place.
- Preserve backward compatibility unless the task explicitly changes an existing contract or behavior.
- Do not add or replace a dependency unless it provides a meaningful benefit that cannot reasonably be achieved with the current stack. Explain that tradeoff in the handoff.
- Ask a question only when a missing decision would materially change the implementation, security model, external effects, or user-visible behavior. Otherwise state a reasonable assumption and proceed.

## Application architecture

`src/app/App.jsx` establishes the global provider order. The important dependency order is:

1. `AuthProvider`
2. `DBProvider`
3. `APIProvider`
4. `AppProvider`
5. `SystemMessageProvider`
6. `ScoringProvider`

`ProfileProvider` is route-scoped where profile data is needed. Preserve provider ordering when adding a context dependency, and update test render helpers/mocks when a context contract changes.

Routes use `createHashRouter` and are declared from `src/app/routes`. Keep route-specific providers in parent route components when multiple child routes share the same state.

Before adding a new fetch, subscription, or context, search for an existing owner. Shared state should have one clear source rather than parallel subscriptions in multiple route components.

## Authentication, roles, and profile data

Treat authorization and UI modes as distinct concepts:

- `AuthContext.userClaims` is the source for authenticated roles such as `admin`, `lpuAdmin`, and `qaUser`.
- `DBContext.adminRole` and `DBContext.qaUserRole` derive role status from authentication and claims.
- `AppContext.adminEnabled` and `AppContext.qaUserEnabled` are user-controlled UI/development mode flags. They are not authorization checks and must never grant data access or permit writes.

Profile reads are centralized in `ProfileContext`:

- The signed-in user's full profile comes from the existing `DBContext` `lockCollection` subscription.
- An admin requesting another user may receive the full profile through the authorized Firestore path.
- Anonymous and non-admin requests for another user use the public API summary.
- Consumers should use `data`, `loading`, `error`, and `isFullProfile` from `ProfileContext` instead of reading `lockcollections` directly.
- Do not add a direct arbitrary-user `getDoc()` or collection query against `lockcollections` in a component. Extend `ProfileContext`, `DBContext`, or the API contract as appropriate.
- Render private fields only when `isFullProfile` and the relevant role/ownership condition allow it.

When adding or renaming a context value, search every `useContext(...)` consumer and update `src/test/setupTests.js` plus any feature-specific provider mocks.

## Firestore and external-service safety

Client Firebase initialization lives in `src/auth/firebase.js`. `VITE_DEV_FIRESTORE=true` selects the `lpubelts-dev` Firestore database; do not assume that `import.meta.env.DEV` alone changes the database.

The Firebase CLI aliases are `default` for `lputest` and `prod` for `lpu-belt-explorer`. Production deployments and live-data scripts are always approval-gated. Editing deployment, migration, export, or administrative code does not authorize executing it. Obtain explicit user approval before each production deployment or live-data script run, including read-only export jobs that access live data. Never switch/deploy to the production alias or alter production data without that approval.

No Firestore rules file is currently declared in `firebase.json`. Do not imply that client-side checks enforce security; deployed Firestore rules and trusted server code must enforce access.

Several files under `scripts/` initialize `firebase-admin`, call external APIs, read credentials, or rewrite substantial datasets. Before running a script:

1. Read the script and identify its data sources and outputs.
2. Determine whether it performs external writes or uses live credentials.
3. Get explicit user approval before every live-data script run or production deployment, including read-only exports. Also obtain approval for migrations, imports, production writes, and other difficult-to-reverse actions.
4. Report generated or modified files after it runs.

Never print, commit, or modify secrets from `.env*`, `keys/`, service-account files, OAuth credentials, or CI variables. It is fine to name a required environment variable without exposing its value.

## Firestore change-index contract

`functions/index.js` tracks changes for incremental exports. Current mappings are:

| Source collection | Change-index collection | Exported Function |
| --- | --- | --- |
| `lockcollections` | `lockcollectionsChangeIndex` | `trackLockcollectionChange` |
| `awards` | `awardsChangeIndex` | `trackAwardChange` |
| `evidence` | `evidenceChangeIndex` | `trackEvidenceChange` |

Each index document is keyed by the changed source document ID and records `docId`, `changedAt`, `deleted`, and `sourceCollection`. The sibling `explore-lpubelts-com-node` exporters consume this schema. Coordinate any field, collection, timestamp, deletion, or naming change with:

- `src/projects/collections/collectionsExport.js`
- `src/projects/collections/awardsEvidenceExport.js`

Do not execute those exporters as a routine test; they read Firestore and update export artifacts. Static syntax/lint checks and targeted tests are safer unless execution is explicitly requested.

For real-time Firestore UI subscriptions that post usage activity, preserve the established meaning: the initial snapshot is a `READ`, and later snapshots caused by subscription changes are `REFRESH`. Emit one activity record per snapshot unless the surrounding feature specifies otherwise.

## Data and generated artifacts

Many `src/data/*.json` files are maintained by import/generation scripts, and build workflows copy data into `public/` or `dist/`. Before manually editing a data artifact, find its owning script and determine whether the source or generated output should change.

Common generated or ignored outputs include `dist/`, `public/data/`, version/sitemap files, Playwright output, Allure output, and local caches. Do not commit them unless the task explicitly requires it. Avoid broad cleanup commands in these directories when unrelated user work may be present.

The import/export/migration npm scripts are not interchangeable with validation commands. In particular, `npm run import`, migration scripts, claim-setting scripts, and Firebase-admin utilities may make broad or external changes.

## Testing expectations

- Add or update Vitest tests for meaningful component behavior, routing, filtering, context contracts, and pure business logic.
- Prefer accessible Testing Library queries such as roles and names.
- Use the existing MSW server for HTTP behavior. Unhandled requests fail tests by design.
- Keep Firebase/auth behavior mocked in unit tests unless the test specifically targets an integration boundary.
- Add or update Playwright coverage for important user journeys that require browser routing or interaction.
- Do not weaken assertions, disable failing tests, or turn unhandled requests into warnings to make a change pass.

Minimum handoff checks by change type:

- Small frontend edit: targeted ESLint and the closest focused Vitest test.
- Shared context, routing, or data-flow edit: targeted tests plus `npm run test:run`; run `npm run build` when module/build behavior could be affected.
- Functions edit: `npm --prefix functions run lint` and any relevant Functions tests.
- Broad or release-facing edit: `npm run ci-pr`, plus relevant Playwright tests.

If a check cannot be run because it requires credentials, network access, a live service, or production mutation, say so explicitly in the handoff.

Never claim that a lint, test, build, or runtime check passed unless it was actually executed. Distinguish checks that passed from checks that were not run, and do not hide pre-existing failures.

## Working-tree discipline

- Inspect `git status` before editing.
- Existing modifications belong to the user. Preserve them and do not revert, overwrite, or reformat unrelated lines.
- Stage newly created files with `git add` as part of the task unless there is a specific reason they should remain untracked, such as generated output, temporary files, ignored local configuration, or secret-bearing material. State the reason in the handoff when a created file is intentionally not staged.
- Keep diffs scoped to the request and review them before handing off.
- Do not use destructive Git or filesystem commands without a clear, explicit request.
- Do not commit, push, deploy, or open a pull request unless asked.

## Definition of done

A change is ready to hand off when:

- The requested behavior is implemented at the correct architectural layer.
- Security decisions use authenticated roles/rules, not UI-mode flags.
- Context consumers and test mocks remain consistent.
- Relevant focused checks pass, with broader checks run in proportion to risk.
- Generated files, external writes, and skipped checks are clearly reported.
- The final diff contains no unrelated user changes introduced by the agent.

The final handoff should concisely state what changed, any important implementation decisions, the exact checks run and their results, and anything the user should review manually.
