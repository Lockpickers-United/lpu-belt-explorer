# Incremental collection exporters

The active exporters are:

- `collectionsExport.js` for `lockcollections`
- `awardsEvidenceExport.js` for `awards`, `evidence`, and their derived output files

Both modules are safe to import. Firebase credentials and clients are loaded only when their command-line entry point runs after configuration validation.

`awardsEvidenceProcess.js` is a local processor that runs after the incremental exports.
It reads `COLLECTION_EXPORT_DIR/evidence.json`, `COLLECTION_BACKUP_DIR/backup.json`,
and the checked-in `src/data/allUnclaimedEvidence.json`, then writes
`allProjects.json` and `pickStats.json` to `COLLECTION_PUBLIC_DATA_DIR` and
`lockVideos.json` to `COLLECTION_API_DIR`. It does not read Firestore and no longer
writes the archived `allScorecardEvidence.json` or `allUnclaimedEvidence.json`
outputs.

## Required configuration

The collection command-line jobs load `.env.<NODE_ENV>` from the repository root. `NODE_ENV` supports `local`, `development`, and `production`, and defaults to `local`. The root environment file is shared with the API server and other command-line jobs; collection settings remain namespaced with `COLLECTION_`. Both incremental jobs require these environment variables:

| Variable | Purpose |
| --- | --- |
| `LPU_JOB_ENV` | `development` or `production`; controls output-mode safeguards, not database selection |
| `FIREBASE_PROJECT_ID` | Expected Firebase project ID; checked against the service account |
| `FIRESTORE_DATABASE_ID` | Explicit database ID, such as `lpubelts-dev` or `(default)` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Absolute path to the service-account JSON file |
| `COLLECTION_EXPORT_DIR` | Absolute directory for raw collection exports and state files |
| `COLLECTION_BACKUP_DIR` | Absolute directory containing collection backups |
| `COLLECTIONS_EXPORT_LOOKBACK_MS` | Optional non-negative lookback; defaults to `300000` |

`collectionAnalyzer.js` additionally requires:

| Variable | Purpose |
| --- | --- |
| `COLLECTION_DAILY_DIR` | Absolute directory for dated collection-statistics files |
| `COLLECTION_API_DIR` | Absolute shared generated-data API directory receiving `collectionStatsByIdFull.json` and `lockVideos.json`; the API reads both files |
| `COLLECTION_PUBLIC_DATA_DIR` | Absolute directory receiving `collectionStatsCurrent.json` |

`collectionStatsProcess.js` requires `COLLECTION_DAILY_DIR` for its dated inputs and
`COLLECTION_PUBLIC_DATA_DIR` for `collectionStatsDaily.json`.

`leaderboardStatsProcess.js` reads `COLLECTION_BACKUP_DIR/backup.json` and writes
`leaderboardData.json` to `COLLECTION_PUBLIC_DATA_DIR`.

`raflCollectionUtils.js` reads `COLLECTION_BACKUP_DIR/backup.json` and writes
`raflCollectionDetails.json` to `COLLECTION_PUBLIC_DATA_DIR`.

`exportAllProcessor.js` reads `lockcollections.json` and `awards.json` from
`COLLECTION_EXPORT_DIR`, then writes `scorecardStats.json` to
`COLLECTION_PUBLIC_DATA_DIR` using the platform belt-count files already in that directory.

`discordBeltCountsDownload.js` optionally downloads the configured HTTPS belt-count
URL and atomically writes `discordBeltCounts.json` to `COLLECTION_PUBLIC_DATA_DIR`.
Set `DISCORD_BELT_COUNTS_REFRESH_ENABLED=true` to enable that refresh. The download
has configurable timeout and response-size limits.

(**deprecated**) `../_deprecated/lockStatistics` loads the configured catalog and writes
`lockStats.json` to `COLLECTION_PUBLIC_DATA_DIR`.

Catalog consumers require `LPU_CATALOG_SOURCE=filesystem` or `remote`. Filesystem
mode uses reviewed snapshots from the absolute `LPU_CATALOG_DIR` and is the normal
development setting. Remote mode uses the HTTPS `LPU_CATALOG_BASE_URL` and applies
`LPU_CATALOG_TIMEOUT_MS` and `LPU_CATALOG_MAX_BYTES` limits.

`catalogSnapshotDownload.js` fetches every catalog over bounded HTTPS, validates
all responses before publishing any of them, and atomically replaces the files in
`LPU_CATALOG_DIR`. Set `LPU_CATALOG_REFRESH_ENABLED=true` to add it as the first
combined-runner job. Refresh is independent of `LPU_CATALOG_SOURCE`: filesystem
consumers read the newly written snapshots, while remote consumers continue reading
the configured HTTPS source. The development directory is
`/home/lpubelts_api/apps/api-server-dev/shared/snapshots`.

`awardsEvidenceExport.js` additionally requires:

| Variable | Purpose |
| --- | --- |
| `COLLECTION_PUBLIC_DATA_DIR` | Absolute directory receiving derived outputs |

The awards/evidence exporter reads unclaimed evidence from the checked-in
`src/data/allUnclaimedEvidence.json`. That source includes both lock and project
evidence and identifies records with `docId`; the exporter selects project records
for `allProjectsEvidence.json` and emits the established `id` field in that output.

`awardsEvidenceProcess.js` uses `COLLECTION_EXPORT_DIR` and `COLLECTION_BACKUP_DIR`
for its local inputs, `COLLECTION_PUBLIC_DATA_DIR` for its public outputs, and
`COLLECTION_API_DIR` for `lockVideos.json`. Its unclaimed-evidence input is the same
checked-in `src/data/allUnclaimedEvidence.json` file.

`ALLOW_PRODUCTION_JOB=true` is required when `LPU_JOB_ENV=production` or when `FIRESTORE_DATABASE_ID=(default)`. This technical guard does not replace the required human approval before any live-data or production run.

The exporters do not infer configuration from `USER`, `LOGNAME`, or the current working directory. Shell variables take precedence over values loaded from the selected file.

## Validate configuration safely

The exporters, analyzer, and statistics processors support `--check-config`:

```bash
NODE_ENV=local node src/projects/collections/collectionsExport.js --check-config
NODE_ENV=local node src/projects/collections/awardsEvidenceExport.js --check-config
NODE_ENV=local node src/projects/collections/awardsEvidenceProcess.js --check-config
NODE_ENV=local node src/projects/collections/collectionAnalyzer.js --check-config
NODE_ENV=local node src/projects/collections/collectionStatsProcess.js --check-config
NODE_ENV=local node src/projects/collections/leaderboardStatsProcess.js --check-config
NODE_ENV=local node src/projects/collections/raflCollectionUtils.js --check-config
NODE_ENV=local node src/projects/collections/catalogSnapshotDownload.js --check-config
NODE_ENV=local node src/projects/collections/discordBeltCountsDownload.js --check-config
NODE_ENV=local node src/projects/collections/exportAllProcessor.js --check-config
NODE_ENV=local node src/projects/lockStatistics/lockStats.js --check-config
```

This validates and prints the selected project, database, and paths. It does not read the service-account file, initialize Firebase, contact Firestore, create directories, or write outputs.

Use placeholder/development paths and the named development database for local validation:

```bash
LPU_JOB_ENV=development \
FIREBASE_PROJECT_ID=lpu-belt-explorer \
FIRESTORE_DATABASE_ID=lpubelts-dev \
FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/service-account.json \
COLLECTION_EXPORT_DIR=/absolute/path/to/collection-exports \
COLLECTION_BACKUP_DIR=/absolute/path/to/collection-backups \
COLLECTION_PUBLIC_DATA_DIR=/absolute/path/to/public-data \
node src/projects/collections/awardsEvidenceExport.js --check-config
```

## Cron compatibility

The existing positional `cron` argument remains supported:

```bash
NODE_ENV=production node src/projects/collections/collectionsExport.js cron
NODE_ENV=production node src/projects/collections/awardsEvidenceExport.js cron
```

Before the next scheduled run, each cron entry must be updated to provide the required explicit environment variables. Do not run these commands manually or update production cron configuration without approval.

## Collection analysis and daily statistics

The analyzer reads dated `backup_YYYY-MM-DD.json` files from the `archive` directory under `COLLECTION_BACKUP_DIR`. It processes missing dates in ascending order and always reprocesses today's backup, ensuring the newest processed date supplies the current API and public-data outputs.

The all-evidence processor reads the incremental evidence export and checked-in
unclaimed-evidence snapshot to regenerate `allProjects.json`, `pickStats.json`, and
`lockVideos.json` without any additional database reads. `lockVideos.json` contains
YouTube evidence grouped by lock ID and includes picker display and black-belt data.
The public `GET /api/v1/locks/:lockId/videos` endpoint reads this file.

The stats processor reads the analyzer's dated files from `COLLECTION_DAILY_DIR`, calculates the chronological daily changes, and writes `collectionStatsDaily.json` to `COLLECTION_PUBLIC_DATA_DIR`.

The leaderboard processor reads the current collection backup and writes `leaderboardData.json` to `COLLECTION_PUBLIC_DATA_DIR`.

The RAFL collection processor aggregates user watchlists from the current collection backup and writes `raflCollectionDetails.json` to `COLLECTION_PUBLIC_DATA_DIR`.

The Discord belt-count downloader refreshes `discordBeltCounts.json` only when
`DISCORD_BELT_COUNTS_REFRESH_ENABLED=true`. Otherwise the combined runner validates
and uses the reviewed file already in `COLLECTION_PUBLIC_DATA_DIR`.

The export-all processor combines the current collection and awards exports with item details and platform belt counts, then writes `scorecardStats.json` to `COLLECTION_PUBLIC_DATA_DIR`.
When the combined runner refreshes Reddit belt data, `REDDIT_BELTS_OUTPUT_DIR` must resolve to the same directory as `COLLECTION_PUBLIC_DATA_DIR` so this processor reads the newly published counts.

The lock statistics processor loads the configured catalog snapshots or bounded
remote data, calculates lock, mechanism, photo-coverage, and contributor statistics,
and writes `lockStats.json` to `COLLECTION_PUBLIC_DATA_DIR`.

```bash
NODE_ENV=development node src/projects/collections/collectionAnalyzer.js cron
NODE_ENV=development node src/projects/collections/awardsEvidenceProcess.js cron
NODE_ENV=development node src/projects/collections/collectionStatsProcess.js cron
NODE_ENV=development node src/projects/collections/leaderboardStatsProcess.js cron
NODE_ENV=development node src/projects/collections/raflCollectionUtils.js cron
NODE_ENV=development node src/projects/collections/catalogSnapshotDownload.js cron
NODE_ENV=development node src/projects/collections/discordBeltCountsDownload.js cron
NODE_ENV=development node src/projects/collections/exportAllProcessor.js cron
NODE_ENV=development node src/projects/lockStatistics/lockStats.js cron
```

## Create full incremental baselines

Pass `--full` to ignore existing raw exports and rebuild them from complete Firestore collections:

```bash
NODE_ENV=development node src/projects/collections/collectionsExport.js --full
NODE_ENV=development node src/projects/collections/awardsEvidenceExport.js --full
```

Each full run records a baseline watermark when it starts, reconciles change-index entries from the configured lookback window, and writes its raw exports plus applicable backups or derived outputs before advancing incremental state. Each file is written atomically. Later runs can omit `--full` and update those baselines incrementally. Full runs read the applicable live collections and write configured output files, so they require the normal approval for live-data jobs.

## Combined export and analysis runner

The repository-level runner loads the collections configuration that matches the required `NODE_ENV`, validates catalog and seed inputs before any child job writes output, then runs the collection exports and dependent analysis jobs in order. When catalog refresh is enabled, the downloader runs first and performs the catalog validation; otherwise preflight validates the existing snapshots. It holds `.collection-export-analysis.lock` beneath `COLLECTION_EXPORT_DIR` for the child-job phase and rejects an overlapping run. The lock is removed after success or failure. If the process is killed before cleanup, inspect the recorded `owner.json` before manually removing the stale lock. The runner stops at the first failed job. Catalog, Reddit, and Discord refreshes are included only when their respective enable flags are `true`; disabled platform refreshes use the validated belt-count snapshots in `COLLECTION_PUBLIC_DATA_DIR`.

```bash
NODE_ENV=development node /home/lpubelts_api/apps/api-server-dev/current-dev/scripts/runCollectionExportAnalysis.js cron
```

Use `--check-config` to print the selected paths, catalog source, integration flags,
and child jobs, then run every component script in its own configuration-check mode.
This does not read pipeline inputs or perform the jobs' normal work.

The `cron` argument is passed to every child job and suppresses routine progress and completion output. Omit it during a manual console run to retain that output. Supported environments are `local`, `development`, and `production`, corresponding to `.env.local`, `.env.development`, and `.env.production` in the repository root. The runner performs live-data and output-writing work, so inspect the selected configuration and obtain the required approval before executing it.

## Development API

Tests and other modules can call the jobs with injected dependencies:

- `runCollectionsExport(options)`
- `runAwardsEvidenceExport(options)`
- `runAllEvidenceExport(options)`
- `runCollectionAnalysis(options)`
- `runCollectionStatsProcess(options)`
- `runLeaderboardStatsProcess(options)`
- `runRaflCollectionUtils(options)`
- `runCatalogSnapshotDownload(options)`
- `runDiscordBeltCountsDownload(options)`
- `runExportAllProcessor(options)`
- `runLockStats(options)`

Provide the incremental exporters with a Firestore-compatible `db`, explicit directories, a lookback value, and an `activityLogger`. The awards/evidence exporter also accepts item-detail loaders. The all-evidence processor accepts its export, backup, and public-data directories and item-detail loaders; it does not accept or create a database client. The analyzer and other processors accept their configured directories directly; the analyzer, leaderboard, export-all, and lock-statistics processors accept item-detail loaders. Lock statistics also accepts a lock-data loader. Jobs that publish timestamps accept a deterministic `now` function for testing.
