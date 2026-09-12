# AGENTS.md

This file applies to the entire `explore-lpubelts-com-node` repository. It is guidance for automated coding agents and should be updated when the architecture, deployment model, or data pipelines change. If older local guidance conflicts with this file, verify the current behavior in `package.json`, tests, and source code and follow this file.

## Project overview

`explore-lpubelts-com-node` is the Node.js service and processing repository that supports [lpubelts.com](https://lpubelts.com). It provides Express API endpoints, legacy service routes, Firebase-backed profile access, logging and rate limiting, and cron/one-off jobs that create data consumed by the frontend.

The main areas are:

- `src/exploreLPUbeltsServer.js`: primary server entry point named by `package.json` and used by the production PM2 configuration.
- `src/routes.js`: legacy/service route registration and lazy-loaded route bundles.
- `src/api/`: versioned `/api/v1` routes, middleware, services, tests, documentation, and response examples.
- `src/logger/`: shared Pino application and HTTP logging.
- `src/util/`: reusable server and data-processing utilities.
- `src/projects/`: cron jobs, exports, integrations, administrative tools, and older/WIP utilities.
- `src/projects/collections/`: Firestore exports and collection-statistics processors.
- `src/testing/`, `src/api/testing/`, and `src/logger/*.test.js`: Vitest and Supertest coverage.
- `src/data/`: checked-in data used by API services and tests.

The sibling repository `../lpu-belt-explorer` owns the React frontend and Firebase Cloud Functions. Agents are authorized to edit that sibling automatically when an in-scope change spans both repositories; no separate permission is needed for those code edits. Inspect its working tree and applicable `AGENTS.md` first, preserve unrelated changes, and validate each repository according to its own conventions.

## Runtime and package management

- Use JavaScript only. Do not introduce TypeScript or a type-checking toolchain unless the user explicitly requests that migration.
- The root package is ES-module based (`"type": "module"`). Use `import`/`export` and explicit local file extensions. Configuration files that are intentionally `.cjs`, such as the PM2 configuration, remain CommonJS.
- Use Node 20 or newer; modern ESM, top-level `await`, and global web APIs are assumed. The repository does not currently pin an exact Node version.
- Use Yarn. `package.json` declares Yarn 4.18.0, `.yarnrc.yml` uses the `node-modules` linker, and `yarn.lock` is authoritative.
- This is not declared as a Yarn workspace. Directories with their own `package.json`/lockfile are separate package boundaries; follow the nearest package configuration when working in one.

Common root commands:

- Install dependencies: `yarn install`
- Run all tests interactively: `yarn test`
- Run all tests once: `yarn test --run`
- Run one test file: `yarn vitest run src/api/testing/apiRoutes.test.js`
- Run the full lint: `yarn lint`
- Lint touched files: `yarn eslint path/to/file.js ...`
- Check syntax without executing a script: `node --check path/to/file.js`
- Run the dependency audit/report generator: `yarn security:scan`

There is no root build or type-check script. Do not invent one in completion reports. The security scan accesses the package registry and writes reports under `logs/`; run it when dependency/security work calls for it, not as routine validation for unrelated changes.

Starting the server binds ports and can load environment-specific integrations. Do not start it merely to prove that a code edit parses when focused tests or `node --check` are sufficient.

## Code conventions

Follow `eslint.config.js` and the style of the file being edited:

- ES modules for application code.
- Four-space indentation in established source files; preserve local style in older files and tests that differ.
- Single quotes.
- No semicolons.
- Strict equality.
- Include `.js`, `.json`, or `.jsx` on relative imports as required by the ESLint configuration.
- Use camelCase for values/functions and PascalCase only where the existing abstraction calls for it.
- Keep changes focused and avoid opportunistic formatting or unrelated refactors.
- Treat warnings about unused values, import extensions, or equality as issues to resolve in touched code.

There is no repository-wide autoformatter. Do not reformat entire legacy files to make a small change. `src/projects/beltInvestigationsWIP/` is intentionally excluded from lint, but that is not permission to lower code quality there.

Prefer shared helpers from `src/util/`, API services, and established route wrappers before adding another abstraction. Do not add or replace a dependency unless it provides a meaningful benefit that cannot reasonably be achieved with the current stack; explain the tradeoff in the handoff.

## Implementation approach

- For change requests, implement and verify the requested behavior rather than stopping at a description or sample patch.
- Inspect relevant source, tests, routes, configuration, and data contracts before editing.
- Search for an existing pattern before adding helpers, middleware, services, or logging behavior.
- Prefer fixing the underlying cause over adding a workaround that leaves duplicated or conflicting behavior.
- Preserve backward compatibility unless the task explicitly changes an endpoint, response, export, or operational contract.
- Ask a question only when a missing decision materially changes implementation, security, external effects, or user-visible behavior. Otherwise state a reasonable assumption and proceed.

## Server and API architecture

The primary request flow is:

1. `src/exploreLPUbeltsServer.js` configures security, body parsing, proxy trust, request logging, request IDs, CORS, and centralized errors.
2. `registerRoutes()` in `src/routes.js` mounts health/testing routes, lazy-loaded service bundles, and the versioned API.
3. `src/api/index.js` mounts `/api/v1` resource routers.
4. API route modules validate HTTP input and delegate data work to `src/api/services/`.

Preserve middleware ordering. Routes must be registered before the 404 handler, and centralized error handling must remain last. Pass asynchronous failures to Express error handling using the established route pattern or `src/util/asyncHandler.js`.

Legacy project routes are loaded through `src/util/lazyMount.js` and small `*.bundle.js` Express routers. When changing one, inspect both the mounted bundle and its implementation. Do not assume bundle files are generated; many are checked-in route adapters.

The service deliberately handles reverse-proxy paths with duplicate leading slashes and supports mount prefixes such as `/services` and `/servicesDev`. Preserve URL normalization and dual-mount behavior, and add regression tests when changing routing or middleware.

Prefer adding data access to `src/api/services/` rather than calling Firestore or reading files directly in a route handler. Keep validation and HTTP concerns in route modules.

When an API contract changes, update all applicable artifacts:

- `src/api/documentation/openapi.yaml`
- `src/api/documentation/README.md`
- `src/api/requirements/samples/`
- API/service tests
- The consuming code in `../lpu-belt-explorer`

Preserve documented cache behavior unless the task changes it. Public summaries currently use public cache headers, while authenticated full-profile responses use `private, no-store`.

## Authentication and profile privacy

Firebase Admin initialization is centralized in `src/api/services/firebaseAdmin.js`. Reuse it rather than creating another app instance in API code.

Profile endpoint boundaries are intentional:

- Public user summary and wishlist endpoints expose reduced response shapes.
- `GET /api/v1/users/:id/profile` requires a valid Firebase bearer token.
- A full profile is available only when the caller owns that user ID or the verified token has `admin: true`.
- Routes should not return a raw `lockcollections` document through a public endpoint.
- New endpoint access must be explicitly classified as public, authenticated-owner, or admin-only and tested for denied access.

Client-supplied fields, headers, query parameters, or UI flags are never proof of authorization. Use verified Firebase token claims. Avoid logging bearer tokens, credentials, complete private profiles, or sensitive request bodies.

## Logging and errors

Use the shared logger from `src/logger/logger.js` instead of introducing standalone `console.log` calls in application paths. Console fallback is acceptable only where the existing logger may itself fail during process-level error handling.

- Prefer a child logger with a stable `module` binding.
- Use structured context first and a short message second, for example `log.info({requestId, userId}, 'user summary served')`.
- Include `req.id`/`requestId` when logging request work.
- Pass `Error` objects under an `err` property so Pino serializes them correctly.
- Never add secrets or full authorization headers to logs. Existing redaction is a safety net, not a reason to log sensitive values.
- Preserve the production HTTP logging policy, slow-request behavior, and request-path filtering unless the task explicitly changes observability requirements.

Return stable status/code payloads from API errors and cover them in tests. Do not expose stack traces or internal details in production responses.

## Production and live-data safety

Production deployments and all live-data scripts are always approval-gated. Editing server, deployment, export, migration, or administrative code does not authorize executing it. Obtain explicit user approval before each of the following:

- Starting, restarting, or deploying the production service or PM2 process.
- Running a script that reads from or writes to live Firestore, Reddit, Flickr, FTP, email, Google services, or production files.
- Running cron/export jobs manually, including read-only exports.
- Performing migrations, imports, moderation actions, uploads, claim changes, or destructive file operations.

Many older project scripts infer `production` from `process.env.USER` and a value in ignored key files; some treat every unrecognized local username as production. Never assume a local shell makes a script safe, never spoof `USER` to bypass this behavior, and always inspect path/database selection before execution.

Do not print, commit, or modify secrets from `keys/`, `.env*`, service-account JSON, OAuth credentials, TLS keys, SMTP configuration, or process-manager environments. It is fine to document the name of a required variable without exposing its value.

Read-only inspection, syntax checking, linting, and tests that mock external services do not require production approval. If a test unexpectedly requires credentials or network access, stop and report it rather than pointing it at production.

## Incremental Firestore export contract

The active incremental exporters are:

- `src/projects/collections/collectionsExport.js`
- `src/projects/collections/awardsEvidenceExport.js`

They depend on change-index documents written by Firebase Functions in `../lpu-belt-explorer/functions/index.js`:

| Source collection | Change-index collection | Firebase Function |
| --- | --- | --- |
| `lockcollections` | `lockcollectionsChangeIndex` | `trackLockcollectionChange` |
| `awards` | `awardsChangeIndex` | `trackAwardChange` |
| `evidence` | `evidenceChangeIndex` | `trackEvidenceChange` |

Each change-index document is keyed by the source document ID and contains `docId`, `changedAt`, `deleted`, and `sourceCollection`. Agents may update both repositories automatically when this contract changes, but must validate both sides.

Preserve these reliability properties unless a task intentionally redesigns the export:

- Bootstrap from a full collection read only when the local raw export is unavailable.
- Query the change index from the saved high-water mark with a lookback window to tolerate timing boundaries.
- Fetch only changed source documents during normal incremental runs.
- Remove source documents marked as deleted.
- Write JSON atomically and keep the existing backup behavior.
- Generate all dependent output successfully before advancing the export-state file.
- Keep activity read counts separated between change-index reads and source-document reads.

State/raw files include `lockcollections.exportState.json`, `awards.exportState.json`, `evidence.exportState.json`, and their corresponding raw JSON exports. Derived outputs include `recentAwardsEvidence.json` and `allProjectsEvidence.json`. These jobs select credentials and output directories at module startup, so importing them can have environment-sensitive effects. Use `node --check` and lint for routine validation; do not execute or import them without live-data approval.

## Data, generated files, and legacy code

Data processors may write outside the repository to production/public data directories and archive locations. Before running one, identify every input, output, backup, and external call.

Files under `src/data/`, `src/api/requirements/current-json-files/`, and `src/api/requirements/samples/` may be checked-in data, documentation snapshots, or generated artifacts. Find the owning service or processor before editing them manually, and keep samples intentionally small and free of private user data.

Directories and filenames containing `OLD`, `TEMP`, `WIP`, or similar labels are not assumed to be active. Do not update them automatically alongside active code unless routing, imports, deployment configuration, or the user specifically places them in scope.

Generated outputs, logs, backups, local virtual environments, `node_modules/`, and key material should not be committed. Do not run broad cleanup commands where unrelated user files may exist.

## Testing expectations

The repository has active Vitest coverage despite older guidance that may say no tests are configured. Supertest tests exercise Express routes without binding a network port, and Firebase service tests mock Firebase access.

- Add or update tests for API validation, auth denial, response shape, cache headers, rate limiting, routing normalization, errors, and service behavior.
- Keep unit/API tests isolated from real credentials, live Firebase, and external APIs.
- Prefer testing the registered Express app/router with Supertest rather than starting a listening server.
- Use fake timers deliberately and restore them after tests.
- Do not weaken assertions, skip failures, or replace mocked access with production access to make a test pass.

Minimum handoff checks by change type:

- Small utility/project edit: targeted ESLint, `node --check` when useful, and the closest focused test.
- API, middleware, auth, or service edit: focused tests plus `yarn test --run` when practical.
- Logging edit: relevant logger/HTTP logger tests plus lint.
- Export/cron edit: lint and syntax checks; execute only with explicit live-data approval.
- Dependency edit: full tests and lint; run `yarn security:scan` when its network access/report output is appropriate.

Never claim a lint, test, syntax check, security scan, server run, or live job succeeded unless it was actually executed. If a relevant check cannot be run safely, state why in the handoff.

## Working-tree discipline

- Inspect `git status` before editing this repository and any sibling repository.
- Existing modifications belong to the user. Preserve them and do not revert, overwrite, or reformat unrelated lines.
- Keep diffs scoped to the request and review them before handing off.
- Do not use destructive Git or filesystem commands without a clear, explicit request.
- Do not commit, push, deploy, restart services, or open a pull request unless asked.

## Definition of done

A change is ready to hand off when:

- The requested behavior is implemented at the correct route, service, processor, or integration layer.
- Authentication and private-data boundaries remain explicit and tested.
- Cross-repository API/export contracts and documentation are consistent.
- Relevant focused checks pass, with broader checks run in proportion to risk.
- No production deployment or live-data job was run without explicit approval.
- Generated files, external effects, and skipped checks are clearly reported.
- The final diff contains no unrelated user changes introduced by the agent.

The completion message should state what changed, important implementation decisions, the exact checks run and their results, and anything the user should review manually.
