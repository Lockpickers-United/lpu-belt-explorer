# Pre-production code review

Review date: 2026-09-23

Branch reviewed: `move-api-server` at `3d66353`

Comparison base: `main` at `571c11f`

## Recommendation

Proceed with controlled development testing, but do not deploy this branch to production yet.

The branch has a strong safety foundation: runtime environments are explicit, the active Firestore exporters are import-safe, production data access is gated, incremental state advances after dependent writes, the Firebase change-index contract matches the frontend Functions implementation, and the full Node 24 test suite passes. The remaining issues are mainly integration boundaries that unit tests do not currently exercise.

Four items should be treated as production blockers:

1. The collection analyzer writes refreshed API data to `COLLECTION_API_DIR`, while the API always reads the copy inside the deployed release.
2. The combined collection runner cannot complete with the documented safe default `REDDIT_BELTS_ENABLED=false`, and several of its jobs make unbounded live HTTP requests.
3. Readiness can report success for a process that has not validated its essential data path or Firebase access, and it does not identify the release that answered the request.
4. Server runtime configuration can fail open or accept contradictory environment classifications.

The detailed findings and recommended changes follow.

## Findings

### Blocker 1: generated collection data and API reads use different storage contracts

[`collectionAnalyzer.js`](../src/projects/collections/collectionAnalyzer.js#L231) writes `collectionStatsByIdFull.json` beneath the configurable `COLLECTION_API_DIR`. [`collectionStatsService.js`](../src/api/services/collectionStatsService.js#L5) ignores that configuration and always reads `src/data/collectionStatsByIdFull.json` from the active release.

This conflicts with the immutable-release design. If `COLLECTION_API_DIR` points under `shared/generated-data`, the analyzer succeeds but the API continues serving the checked-in snapshot. If it points into `current/src/data`, the cron job mutates an otherwise immutable release, and a deployment or rollback silently replaces the generated result with the copy from that release.

Recommended change:

- Make the API service read a validated absolute generated-data path, preferably the same `COLLECTION_API_DIR` used by the analyzer.
- Keep that directory under each environment's `shared/generated-data` root.
- Preserve a checked-in fixture only for tests or a clearly documented bootstrap fallback; do not use it silently in production.
- Add an integration test that runs the analyzer into a temporary directory, changes the file, and verifies that the API endpoint returns the new metadata and counts without a process restart.
- Add the required initial file and its ownership/permissions to the deployment bootstrap checklist.

This should be resolved before development results are used as evidence that the production API will serve refreshed collection statistics.

### Blocker 2: the combined runner requires disabled/live integrations and can hang

[`runCollectionExportAnalysis.js`](../scripts/runCollectionExportAnalysis.js#L13) always runs the Reddit refresh, Discord download, lock statistics, and processors that call `itemDetails()`. With the documented default `REDDIT_BELTS_ENABLED=false`, [`runGetRedditBelts.js`](../src/projects/redditBelts/runGetRedditBelts.js#L29) throws and the combined pipeline stops before the Discord and final scorecard jobs.

The same combined run contacts production-facing public endpoints even in development:

- [`getItemDetails.js`](../src/util/getItemDetails.js#L6) fetches five `lpubelts.com` JSON resources without timeouts, HTTP-status checks, response-size bounds, or schema validation.
- [`lockStats.js`](../src/projects/lockStatistics/lockStats.js#L21) performs another unbounded fetch.
- [`discordBeltCountsDownload.js`](../src/projects/collections/discordBeltCountsDownload.js#L8) uses plain HTTP and has no timeout.

This means a normal development pipeline either fails because the risky integration is disabled or requires live external access to finish. An upstream connection that never completes can also hold a cron run indefinitely.

Recommended change:

- Split the runner into deterministic export/analysis jobs and explicitly enabled external refresh jobs, or mark optional jobs and skip them when disabled.
- Let development use reviewed fixture/snapshot inputs for Reddit, Discord, and catalog data unless live access is intentionally approved.
- Use HTTPS for the Discord count URL.
- Add `AbortSignal` timeouts, HTTP-status checks, maximum response sizes where practical, and minimum schema validation to all catalog/count downloads.
- Validate required seed inputs such as `unclaimedEvidence.json`, `redditBeltCounts.json`, and `discordBeltCounts.json` in a preflight phase before any exporter writes output.
- Prevent overlapping runs with a process lock or scheduler-level `flock` once the production cron command is finalized.

### Blocker 3: readiness is too weak for automated activation and rollback

[`ready.js`](../src/testing/ready.js#L1) always returns `{ready: true}`. It does not verify that the generated API data is readable, that the selected service-account file can initialize Firebase, or that this is the newly activated release. The deployment workflow therefore proves that *an* HTTP process answered the public URL, but not that the intended release is serving or that important routes can work.

This is especially material during the proposed parallel bring-up: a proxy mistake can leave `api.lpubelts.com` pointed at another healthy process and still allow the workflow to declare success.

Recommended change:

- Give each release an identifier, such as `GITHUB_SHA`, and return it from readiness or a separate deployment-verification endpoint.
- Have the workflow assert that the returned release identifier equals the SHA it just activated.
- Make readiness fail when required local dependencies, especially the configured collection-statistics file, are absent or unreadable.
- Keep live Firestore checks out of every probe if their cost or availability would make readiness unstable. Instead, add a bounded deployment smoke test for one public API route and, where credentials are available, one authenticated low-impact route.
- Add startup and shutdown state so readiness becomes false while the process is initializing or draining.

### Blocker 4: server runtime configuration is incomplete and can be contradictory

[`lpubeltsApiServer.js`](../src/lpubeltsApiServer.js#L63) reflects any browser origin when `CORS_ORIGIN` is absent, even in production. It reads `API_PORT` without validating that it is present and in range. [`runtimeEnvironment.js`](../src/util/runtimeEnvironment.js#L18) validates `NODE_ENV`, while the route and data modules separately trust `LPU_JOB_ENV`; the two values are never required to agree.

A mistaken configuration such as `NODE_ENV=development`, `LPU_JOB_ENV=production`, and an allowed production database can expose diagnostic routes and development error stacks while using production data. The PM2 declaration currently prevents that exact combination during the intended start path, but the application should reject it itself.

Recommended change:

- Add one server configuration loader that validates `API_PORT`, `HOST`, `CORS_ORIGIN`, `TRUST_PROXY`, `NODE_ENV`, and the data-target settings before creating runtimes or opening the listener.
- Require an explicit production CORS allowlist. A missing or empty production value should fail startup.
- Require `NODE_ENV` and `LPU_JOB_ENV` to match for the API process, or model the permitted combinations explicitly and test each one.
- Add the server variables, including `API_PORT`, `CORS_ORIGIN`, and `TRUST_PROXY`, to [`.env.example`](../.env.example) and the bootstrap checklist.
- Add negative startup tests for missing port, invalid port, missing production CORS, and mismatched environment classifications.

## High-priority reliability changes

### Exit cleanly after fatal process errors

[`lpubeltsApiServer.js`](../src/lpubeltsApiServer.js#L119) catches `uncaughtException` and `unhandledRejection` only to log them. Continuing after an uncaught exception can leave the process in an undefined state while PM2 still considers it available.

Log the fatal error, mark readiness false, stop accepting new requests, allow a short drain period, and exit nonzero so PM2 can restart the process. Treat listener errors as fatal as well. Add a focused child-process test for the exit behavior.

### Make the production PM2 definition and documentation auditable

The current working tree contains an ignored `ecosystem.prod.json` using the name `lpubelts-api-server-prod`, while the deployment recommendation requires a distinct parallel name such as `lpubelts-api-server-prod-next`. Because the file is ignored, neither CI nor review can verify the production process definition. [`.github/DEPLOYMENT.md`](../.github/DEPLOYMENT.md#L18) also still shows the old deploy root, process name, and health-check hostname.

Recommended change:

- Track a secret-free production-next PM2 JSON definition, or add an exact reviewed bootstrap template and a command that validates the server-side definition.
- Use one process name consistently in the PM2 file, GitHub `PM2_APP_NAME`, rollback instructions, and observation/retirement plan.
- Replace stale examples in `.github/DEPLOYMENT.md` with the confirmed `/home/lpubelts_api/apps/api-server-prod`, `api.lpubelts.com`, and parallel process naming.
- Verify that the process was initially started with only intentional inherited environment variables, because the environment file loader does not override variables already held by PM2.

### Correct lock photo-coverage statistics

[`lockStats.js`](../src/projects/lockStatistics/lockStats.js#L117) treats an empty `media` array as photo coverage and counts every viewed lock in the top-250 media total, whether or not it has media. The new test currently expects that behavior. Contributor totals can also include one `undefined` contributor while the photographer list excludes it.

Count media only when the array contains at least one valid image, select the top locks by views before counting media coverage, and derive contributor totals from the same filtered contributor set. Update the test to exercise a viewed lock without media and an image without attribution.

### Publish current analyzer output from the newest available backup

[`collectionAnalyzer.js`](../src/projects/collections/collectionAnalyzer.js#L255) processes only missing dates plus today, then publishes the output from the last date in that subset. In the combined happy path today's backup exists, but a standalone recovery run can process an older missing date and overwrite current API/public data even when a newer already-processed daily file exists.

Separate historical backfill from current publication. After filling missing daily files, explicitly publish from the newest available backup date. Add a regression test with an older missing day and a newer existing day.

## Repository and review hygiene

- `git diff --check` fails because [`public/robots.txt`](../public/robots.txt#L2) has trailing spaces and an extra blank line at EOF. Fix these before merge.
- The added `public/` HTML, icons, and robots file are not served by the Express application. Confirm that they belong in this API repository; otherwise remove them from this branch.
- The modified `.yarn/install-state.gz` is an install artifact. Avoid including it in the release change unless this repository intentionally versions Yarn install state.
- The lint command excludes repository-level `scripts/`, so the new runner and its test receive syntax/test coverage but no ESLint coverage. Extend the lint target or add a focused script lint command.
- Consider replacing duplicated atomic JSON helpers with one tested utility once the deployment blockers are addressed. This is cleanup rather than a release gate.

## What is already in good shape

- The active incremental exporters are import-safe and validate explicit environment, database, credential, and output selections before accessing Firebase.
- The production/default-database safety gate fails closed unless `ALLOW_PRODUCTION_JOB=true`.
- Full baselines use a start-time watermark plus lookback reconciliation.
- Source deletions are applied, and read accounting separates change-index reads from source-document reads.
- Awards/evidence state files advance only after raw and derived outputs are written successfully.
- Writes use temporary files and atomic rename within each target directory.
- The sibling frontend Functions define production and `lpubelts-dev` trackers with the expected `docId`, `changedAt`, `deleted`, and `sourceCollection` fields.
- The production workflow pins third-party Actions by commit, verifies the uploaded checksum, activates through an atomic symlink switch, and attempts rollback after reload or health-check failure.

## Suggested implementation order

1. Make `COLLECTION_API_DIR` the shared contract between the analyzer and API service, with an end-to-end local test.
2. Add centralized server configuration validation and production-safe CORS/environment rules.
3. Strengthen readiness with a release identifier and required local dependency checks; update the workflow assertion.
4. Change fatal error handling so PM2 can restart unhealthy processes.
5. Split or conditionally execute external refresh jobs; add HTTPS, timeouts, and response validation.
6. Track and reconcile the production-next PM2 definition and all deployment documentation.
7. Fix the lock photo statistics and analyzer backfill edge case.
8. Remove or confirm unrelated static assets and clear `git diff --check`.

After steps 1 through 5, repeat the full automated checks and begin the rigorous development matrix below. Finish step 6 before the first production bootstrap or workflow run.

## Development test matrix

Use only the `lpubelts-dev` database and development output roots unless a separate live-data run is explicitly approved.

1. Run all tests and lint with Node 24 and the pinned Yarn version.
2. Run every command-line job's `--check-config` mode and verify the selected database and every output path.
3. Verify startup fails for production/default-database access without the production opt-in and for each invalid server configuration listed above.
4. Start the development process, verify the release/environment identity, then exercise `/ready`, public collection stats, public user summary, authenticated owner profile, denied cross-user profile, upload limits, and disabled integration routes.
5. Run the deterministic export/analysis pipeline against development data and isolated output directories. Compare document counts, deletion handling, watermark movement, and generated JSON schemas with the prior known-good outputs.
6. Inject a dependent-write failure and confirm state does not advance; then rerun successfully and confirm recovery.
7. Run two no-change incremental cycles and confirm no source collection scan occurs and output remains stable apart from expected timestamps.
8. Test a create, update, and delete in each development source collection and confirm the corresponding change-index and next export.
9. Verify WebStorm exclusions, manual upload boundaries, dependency-install procedure, PM2 restart, logs, and reboot resurrection.
10. Exercise a release-style deployment to a disposable development release root, including a failed readiness check and symlink rollback.

Before production, record the exact tested commit SHA and generated-data configuration. Confirm the GitHub workflow deploys that commit, the health response reports that SHA, cron runs exist for only one backend, and a manual rollback has been rehearsed without touching production data.

## Decisions confirmed after review

1. `/api/v1/stats/collections/*` should always serve the latest cron-generated data from `shared/generated-data`; a release-pinned snapshot is not the intended production contract.
2. Reddit, Discord, and public catalog refreshes remain part of the combined collection runner. Their existing enable flags control whether the combined run refreshes each external input or consumes its reviewed local snapshot; they are not independently scheduled jobs at this time.
3. The root `public/` assets belong in this repository and will be served separately by DreamHost. Express is not expected to serve them.

## Verification performed for this review

- `PATH=<Node 24.13.0>/bin:$PATH corepack yarn test --run`: 59 test files passed, 255 tests passed.
- `PATH=<Node 24.13.0>/bin:$PATH corepack yarn lint`: passed with two existing warnings in `src/projects/logAnalysis/lpubeltsLogAnalyzer.js`.
- Node 24 `node --check` on all changed JavaScript files: passed.
- JSON parsing on all changed JSON files: passed.
- `git diff --check main...HEAD` and the working-tree diff: failed on whitespace in `public/robots.txt` as described above.
- Read-only inspection of `../lpu-belt-explorer/functions/index.js`: the production and development change-index trigger contract matches the exporters.

No server, exporter, cron job, external integration, Firebase connection, deployment, or production process was started during this review.
