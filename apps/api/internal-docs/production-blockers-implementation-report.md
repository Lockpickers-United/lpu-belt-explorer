# Production-blocker implementation report

Implementation date: 2026-09-23

Source review: `internal-docs/pre-production-code-review-2026-09-23.md`

## Scope

This change is limited to the four production blockers identified by the review:

1. Use one generated collection-statistics path for the analyzer and API.
2. Make external collection-pipeline refreshes optional and bound remote downloads.
3. Make readiness dependency-aware and identify the active release.
4. Validate server runtime configuration before opening a listener.

The review's separate high-priority reliability and repository-hygiene items remain deferred.

## Progress

- [x] Shared generated collection-statistics contract and integration coverage
- [x] Optional external refreshes, bounded downloads, and pipeline preflight
- [x] Release-aware readiness and deployment assertion
- [x] Central server runtime validation
- [x] Focused and full validation

## Implementation notes

### Shared collection data

The collection statistics and lock-video APIs resolve
`COLLECTION_API_DIR/collectionStatsByIdFull.json` and
`COLLECTION_API_DIR/lockVideos.json`, the same files published by the collection
processors. The directory must be absolute. Production fails closed when the
setting is absent; only non-production service/test use may fall back to checked-in
fixtures. The analyzer integration test keeps one Express app alive while the
generated statistics file changes and verifies that the endpoint serves the update.

Production bootstrap must seed both files beneath the environment's shared
generated-data API directory and make them readable by the PM2 account.

### Deterministic collection pipeline

The combined runner performs preflight before starting a child job. It validates
the export configuration, every configured catalog input, `unclaimedEvidence.json`,
and the Reddit and Discord count snapshots when their refreshes are disabled.
It also holds an atomic lock beneath `COLLECTION_EXPORT_DIR` while child jobs run,
rejects overlaps, and removes the lock after success or failure.
Reddit runs only with `REDDIT_BELTS_ENABLED=true`; Discord runs only with
`DISCORD_BELT_COUNTS_REFRESH_ENABLED=true`. An enabled Reddit refresh must publish
to `COLLECTION_PUBLIC_DATA_DIR`.

Catalog consumers now require an explicit source. Development should use
`LPU_CATALOG_SOURCE=filesystem` and an absolute `LPU_CATALOG_DIR` containing the
reviewed JSON snapshots. Explicit remote mode requires HTTPS and applies abort
timeouts, response-size limits, HTTP-status checks, and array/object validation.
An optional first runner job now downloads and validates all catalog files before
atomically publishing them to `LPU_CATALOG_DIR`. It is enabled only with
`LPU_CATALOG_REFRESH_ENABLED=true`; later jobs continue reading filesystem
snapshots, including development's shared `snapshots` directory.
The Discord downloader now uses HTTPS with the same bounded-download checks and
validates finite, non-negative counts.

The runner supports `--check-config` to display the selected paths, catalog mode,
optional integration status, and job list without reading inputs or starting jobs.

### Runtime and readiness

The server validates `NODE_ENV`, matching `LPU_JOB_ENV`, `API_PORT`, `HOST`, exact
CORS origins, `TRUST_PROXY`, and an absolute `COLLECTION_API_DIR` before creating
runtimes or opening its listener. Production requires a non-empty CORS allowlist.
Firebase Admin initialization also runs before the process reports ready, which
validates the local credential and database selection without adding a Firestore
request to every probe.

Readiness begins false, becomes true after the listener starts, becomes false on
shutdown or listener error, and returns the environment, Git SHA, and release ID.
It returns 503 when the configured collection-statistics file is unreadable. The
deployment workflow writes `.release.json` into each release and accepts the
health check only when it returns that exact release ID; otherwise it rolls back.
After readiness succeeds, the workflow performs a bounded smoke request to the
public collection-statistics endpoint and also rolls back if that request fails.

### Configuration additions

`.env.example` now documents API listen/CORS/proxy values, optional local release
identity, Discord refresh controls, and catalog source/timeout/size settings.
Operational and API documentation now describe the shared generated-data path,
readiness identity, bootstrap file, and optional refresh behavior.

### Validation

- Focused tests: 10 files passed, 55 tests passed.
- Catalog refresh focused tests: 3 files passed, 16 tests passed.
- Full tests under Node 24.13.0: 65 files passed, 292 tests passed.
- Full ESLint: passed with the two pre-existing warnings in
  `src/projects/logAnalysis/lpubeltsLogAnalyzer.js`.
- Node 24 syntax checks for all changed and new JavaScript files: passed.
- Deployment workflow YAML parse and release-response assertion smoke check: passed.
- Scoped `git diff --check` for the implementation files: passed.

No server, Firebase connection, external refresh, collection job, deployment, or
production process was started. Tests used temporary files and mocked HTTP data.

## Deferred review items

As requested, this implementation does not address the review's separate
high-priority reliability or repository-hygiene items: fatal process-error exit,
the production PM2 declaration/document reconciliation, lock photo-coverage
statistics, analyzer historical-publication behavior, or unrelated branch cleanup.
