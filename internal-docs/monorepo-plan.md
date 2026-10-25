# LPU monorepo overview and migration plan

Status: Phases 0–2 complete locally (2026-10-25); Phase 3 not started. Phase 1 is published on its approved migration branch; Phase 2 is staged in an isolated worktree and is not committed or merged. This document defines the target and tooling migration; it does not authorize a deployment, live-data job, or service cutover.

Execution tracking: [implementation plan](monorepo-implementation-plan.md) and [developer report](monorepo-developer-report.md).

## Goal and scope

Use `lpu-belt-explorer` as the long-term repository for the web client and the active Node API. Make room for a Reddit Devvit app and, after a separate readiness review, the LockyJr Discord bot. The API's present source repository is named `explore-lpubelts-com-node`, but that name refers to the deprecated server and **must not become an app, package, deployment, or new repository name**. Use `apps/api` for the current service, whose entry point is `src/lpubeltsApiServer.js` and whose production host is `api.lpubelts.com`.

The objective is one source and review location, not one runtime. The site, API, Firebase Functions, Devvit app, and bot retain distinct credentials, data access, release approvals, and rollback paths.

## Current candidate

The reviewed candidate now contains `apps/api` and `apps/web`. Root npm now coordinates both web and API with Node 24.21.0/npm 11.19.0 and nested app-local dependencies; Functions npm remains separate. Phase 3 local checks pass; Linux artifact CI awaits explicit candidate publication approval. Firebase configs and environment/credential ownership stay at root. Candidate publish/import/catalog-upload/deployment jobs have unconditional holds, while deployed workflows and the original API release authority remain unchanged. Phase 2 checks passed: web lint/280 tests/build, API lint/464 tests, ten browser checks, Functions lint and isolated Web SDK emulators. See the execution documents for exact evidence and the staged worktree location.

## Phase 0 starting point

| Component | Phase 0 boundary | Migration consequence |
| --- | --- | --- |
| Web client | This repository's root React/Vite package uses npm, `package-lock.json`, Node `v24.15.0`, GitHub Pages, and root-relative scripts and workflows. | Moving it changes Vite, test, import, generated-data, Pages, and workflow paths. The `Build-N-Deploy` workflow also uploads catalog snapshots to both API environments. |
| Active API and exporters | Sibling Node repository uses Yarn 4.18.0, Node 24.21.0, Express, and a production workflow that archives the whole repository plus Linux `node_modules` into an immutable DreamHost/PM2 release. Development uses WebStorm SFTP uploads. | Import its history and app files; rework CI, release packaging, PM2 working directory, SFTP mappings, cron paths, and root-relative configuration. Preserve the existing `current`/`releases`/`shared` runtime boundary. |
| Firebase Functions and rules | `firebase/` in the web repository; `firebase/functions/` is a separate CommonJS/npm package. Firebase CLI paths resolve relative to `firebase/firebase.json`. | Keep this layout initially and keep its lockfile and deploy target independent. Update only callers affected by the web move. |
| Reddit Devvit | Planned in the [implementation plan](devvit-belt-request-implementation-plan.md); the [review](devvit-belt-request-plan-review.md) recommends a dedicated app inside a monorepo. | Reserve `apps/devvit/` with its own `devvit.json`, local CLI, build, tests, and publish gate. Reddit-native work can proceed before any approved LPU account-link or data-transfer integration. |
| LockyJr Discord bot | Separate `lpu-discord-utils-bot` repository with a Yarn lockfile, Discord/Reddit credentials under local `keys/`, tracked `data/*.json`, and runtime-written request/log data. | Import later, after checking tracked data for private content and defining external state paths, runtime version, test coverage, and deployment ownership. Do not treat its data directory as ordinary shared source. |

There are also cross-component contracts: the web app calls `/api/v1` through its configured API URL; the web build publishes catalog files used by the API; and API collection exporters consume Firestore change indexes written by Firebase Functions. A common Git repository does not remove the need to test and coordinate those contracts.

## Recommended target

Keep the existing `lpu-belt-explorer` Git repository and its remote identity. Use this eventual layout:

```text
apps/
  web/             React/Vite client
  api/             active Node API and export jobs
  devvit/          future Reddit-hosted app, including devvit.json
  discord-bot/     future LockyJr app, after its readiness review
firebase/
  functions/       existing independently packaged Firebase Functions
  firestore.rules  existing Firebase configuration and rules
packages/
  award-domain/    optional, only if a pure shared contract is needed
internal-docs/
.github/workflows/   workflows for each independently released component
package.json         private workspace coordinator, eventually
package-lock.json    eventual web/API workspace lockfile
.nvmrc               eventual common Node 24 patch
```

Use **npm workspaces for the web and API after their repository moves are stable**. The web and Functions already use npm, and the Devvit review recommends npm for the eventual unified workspace. Keep `firebase/functions` outside the workspace at first so its Firebase deploy package stays self-contained. Decide whether Devvit and LockyJr join the workspace only after their runtime and packaging constraints are verified; their own app directories and release gates do not depend on that decision. A workspace is for dependency installation and local package links, not for combining deployments.

Prefer `apps/api` and `apps/web` as app boundaries over putting API files directly under the web root. Preserve the API's reviewed Git ancestry in the merge (a non-squashed subtree import under `apps/api` is planned); verify that reviewed API ancestry remains reachable and future file history is inspectable. The Phase 0 audit found potential historical FTP credentials, so an unchanged import is on hold. The owner selected a disposable sanitized copy and directed removal of the four password-bearing historical FTP versions. The reviewed `.env.example` and JSON paths may be retained as placeholder/non-sensitive data. Import requires verification of the scrubbed candidate history. Preserve rewritten ancestry and an original-to-rewritten commit map; do not make the flagged original history reachable in the destination. See the [developer report](monorepo-developer-report.md) for evidence and the resolved disposition. Import only tracked, reviewed content. Do not copy the sibling `.git`, `.env*`, `node_modules`, logs, `.venv`, or local credentials. The sibling repository can remain available as a read-only archive after the new API release path has been proven.

Delay any shared `packages/` extraction. First move the existing API and web contracts unchanged; then extract small, runtime-neutral award schemas or mapping logic only where duplication causes a real maintenance problem. Keep Firebase Admin, Devvit APIs, Discord SDKs, and secrets inside their respective apps.

## Implementation approach

1. **Freeze and inventory the boundaries.** The owner confirmed an API source freeze at `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` until cutover and named Neal Bayless as coordinating owner for GitHub/DreamHost settings and releases. Verify the frozen SHA and clean working tree before sanitation, import and cutover; stop on drift rather than silently sync. Record clean baselines for both repositories, their Git remotes and release SHAs, package/Node versions, runtime entry points, ignored and generated files, workflow triggers, and current CI results. Map every path consumed by Vite, Vitest, Playwright, Firebase CLI, API jobs, PM2, cron, WebStorm SFTP, and GitHub Actions. Identify the production API's persistent `shared` inputs and the web workflow's catalog outputs. Review tracked content before the history import so no credential or private generated file is carried forward.
2. **Import the active API under `apps/api` with its history.** Initially keep its Yarn lockfile, `.yarnrc.yml`, package scripts, and app-specific checks. The web package can stay at the repository root during this stage. Move API workflows into root `.github/workflows/`, where GitHub Actions will run them, and scope API CI to `apps/api/**` plus relevant shared paths. Package the API app as a complete release rooted at the API package, with matching Linux dependencies, while keeping the existing server-side `current`/`releases`/`shared` layout and rollback behavior. Update development SFTP mapping and the root/API `AGENTS.md` and operating references in the same change. Validate an isolated development deployment before authorizing any production cutover.
3. **Move the web package to `apps/web` and establish a root coordinator.** Relocate the web source, public assets, tests, scripts, Vite/Playwright/ESLint configuration, and lockfile ownership deliberately. The root npm workspace can initially contain only the web package; leave the API's Yarn installation independent until step 4. Update Pages output, Firebase test commands, import-generated-file paths, root workflow triggers, and catalog upload/verification paths. Keep the Firebase directory and its independent Functions package at the repository root. Confirm that the site and API still communicate through the same public API contract and that generated catalog files have the same validated contents.
4. **Unify tooling only after both apps pass from their new locations.** Pin one Node 24 patch supported by the API host and CI, and pin the npm version used for installs. Convert the API Yarn dependency graph into the root npm lockfile; translate its Yarn `resolutions` to root npm `overrides`, then compare dependency versions and behavior. Use one reproducible root `npm ci` for workspace packages and app-targeted commands for CI. Retire the API Yarn lockfile after reproducible clean npm installs; require tests and native-dependency packaging (including Sharp) before completing Phase 3, then rehearse the development release in Phase 4. Keep Functions' lockfile independent unless a later, separately validated change makes it a workspace.
5. **Add future apps as separate projects.** Create `apps/devvit` when its bounded modmail feasibility work begins, following the [Devvit review's](devvit-belt-request-plan-review.md) Reddit policy and archive-coverage gates. Give it a local CLI, explicit build artifact, test target, and Reddit-specific publish credentials. Import LockyJr only after auditing tracked bot data and local key/config paths, establishing a private persistent data directory, and verifying its CommonJS/ES-module and Node/package-manager behavior. Neither app should trigger a web or API release just because it shares a repository.
6. **Cut over and retire old release sources.** Verify web, API, and Functions checks plus cross-component smoke tests from the monorepo. Move production release automation only through its existing approval gate, confirm the exact deployed commit and rollback candidate, and observe normal operation before retiring the old API repository's deployment authority. Remove duplicate scheduled jobs and old workflow triggers so one source owns each deployment and export. Update `AGENTS.md`, operational references, onboarding, Dependabot, branch protection, and path ownership to describe the new layout.

Each stage should be a reviewable change with a documented rollback. The file move, package-manager conversion, and production release-path change should not be one untestable cutover.

## Main risks and downsides

| Risk or cost | Control to build into the migration |
| --- | --- |
| A shared commit can trigger unrelated releases or import jobs. The existing web workflow publishes on root-path changes, while `Import` commits generated changes. | Give workflows app-specific path filters and working directories; keep manual production/Devvit/bot gates; audit `workflow_run` and generated-file triggers. |
| API release packaging currently assumes repository-root `git archive`, `node_modules`, `.nvmrc`, and relative `src/` paths. A path error can break startup, cron, or rollback. | Make a standalone API release artifact from `apps/api`, check its contents on a Linux runner, and prove PM2 readiness and rollback against the development deployment first. Keep shared runtime data outside releases. |
| npm and Yarn may resolve transitive or native dependencies differently. Current Node patches also differ. | Convert dependencies after the move, pin tooling, review the lockfile and overrides, run each app's full validation, and test the production artifact on the target platform. |
| Moving the web root can change generated data, Firebase config resolution, Pages paths, and catalog snapshot uploads. | Inventory path assumptions and compare build output and catalog hashes; keep the API catalog contract and Firebase deploy configuration explicit. |
| A history import or future bot import could include private data or awkward legacy files. Bot `data/*.json` is tracked today. | Review tracked files and Git history before import; keep secrets and mutable bot data outside Git; use a targeted history-cleaning decision if sensitive history is found. |
| One lockfile and shared dependency updates increase coordination and CI cost. | Keep per-app checks and ownership; scope tests by affected paths, but require integration checks when API/web/Functions contracts change. Introduce shared packages sparingly. |
| Devvit integration depends on Reddit permissions and historical modmail coverage, regardless of repository layout. | Treat the Reddit-native proof of concept as independent. Require the policy and coverage go/no-go decisions in the Devvit review before LPU account linking or data transfer. |

## Immediate next steps

1. Retain the existing destination and staged target layout, confirmed API source freeze, and Neal Bayless as coordinating owner. Follow the resolved [owner question 4 disposition](monorepo-owner-questions.md#4-what-is-the-disposition-of-the-flagged-credentials-and-tracked-data): scrub the four password-bearing FTP versions from disposable migration history, retain the reviewed template/JSON files, and verify the sanitized result before API import. Keep the original API source unchanged.
2. Review the completed path/release inventory and final authorized baseline evidence in the developer report: web CI (280 tests), API confirmation (444 tests) and 10 focused browser checks passed. Preserve the observed intermittent API multipart cleanup failure in the migration baseline; it has not been diagnosed or fixed.
3. Prepare the history-preserving `apps/api` import and root API CI workflow in a reviewable branch; inspect the resulting diff and release artifact.
4. Validate the moved API in development, then plan the web move and npm conversion as separate changes.
5. Schedule Devvit feasibility and LockyJr readiness work independently of the web/API migration.

Production deployments, live-data scripts (including read-only exports), Reddit publish actions, and the eventual production cutover each retain their existing explicit authorization requirements.
