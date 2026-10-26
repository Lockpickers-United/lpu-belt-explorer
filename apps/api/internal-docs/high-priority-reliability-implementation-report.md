# High-priority reliability implementation report

Implementation date: 2026-09-23

Source review: `internal-docs/pre-production-code-review-2026-09-23.md`

## Scope

This change is limited to the review's four high-priority reliability changes:

1. Exit cleanly after fatal process errors.
2. Make the production PM2 definition and deployment documentation auditable.
3. Correct lock photo-coverage statistics.
4. Publish current analyzer output from the newest available backup.

The review's repository-hygiene items remain deferred as requested.

## Progress

- [x] Fatal process-error shutdown and child-process coverage
- [x] Tracked production-next PM2 definition and reconciled deployment guidance
- [x] Lock photo-coverage and contributor calculation corrections
- [x] Analyzer backfill/current-publication separation and regression coverage
- [x] Focused and full validation

## Implementation notes

### Fatal process shutdown

The server now installs one lifecycle controller for uncaught exceptions,
unhandled rejections, listener errors, `SIGTERM`, and `SIGINT`. Fatal paths log at
fatal level, mark readiness false, stop accepting connections, allow existing
requests up to 10 seconds to drain, and exit with status 1. Graceful signals use
the same bounded drain and exit with status 0. A child-process test exercises both
fatal process events and a listener error, including a simulated in-flight request
that forces the drain timeout.

### Auditable PM2 contract

`ecosystem.prod.json` is no longer ignored. It defines the parallel process as
`lpubelts-api-server-prod-next`, uses the immutable production `current` paths,
and gives the server's 10-second drain a 12-second PM2 termination window. A test
checks the committed process name, paths, mode, timing, and environment. The
deployment workflow rejects a different `PM2_APP_NAME`.

Deployment documentation now uses `/home/lpubelts_api/apps/api-server-prod`,
`api.lpubelts.com`, and `lpubelts-api-server-prod-next` consistently. Bootstrap
guidance starts PM2 with a minimal inherited environment and requires inspecting
the resulting PM2 environment because dotenv does not replace inherited values.

### Lock photo statistics

Coverage now requires at least one media entry with a non-empty image URL. The
top-250 segment selects viewed locks in descending view order, limits that set,
then counts valid image coverage using the selected set as the denominator.
Contributor totals come from the same attributed contributor set as the
photographer ranking, while unattributed images remain part of the unique-image
total.

### Analyzer publication

Historical processing writes only the date-specific daily artifact. After those
backfills finish, current API and public outputs are generated from the newest
available backup, even when that date already had a daily artifact. The regression
test covers an older missing day alongside a newer previously processed day and
verifies the newer day remains the publication source.

## Validation

- Focused Node 24.13.0 tests: 4 files passed, 11 tests passed.
- Full Node 24.13.0 test suite: 67 files passed, 298 tests passed.
- Full ESLint: passed with the two pre-existing warnings in
  `src/projects/logAnalysis/lpubeltsLogAnalyzer.js`.
- Node 24 syntax checks for changed and new JavaScript files: passed.
- Production PM2 JSON and deployment-workflow YAML parsing: passed.
- Scoped working-tree `git diff --check`: passed.

No server, collection job, external integration, deployment, or production
process was started. Tests used temporary files, child processes, mocked data,
and local Supertest listeners.
