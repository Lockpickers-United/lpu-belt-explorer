# Incremental collection exporters

The active exporters are:

- `collectionsExport.js` for `lockcollections`
- `awardsEvidenceExport.js` for `awards`, `evidence`, and their derived output files

Both modules are safe to import. Firebase credentials and clients are loaded only when their command-line entry point runs after configuration validation.

## Required configuration

Both jobs require these environment variables:

| Variable | Purpose |
| --- | --- |
| `LPU_JOB_ENV` | `development` or `production`; controls output-mode safeguards, not database selection |
| `FIREBASE_PROJECT_ID` | Expected Firebase project ID; checked against the service account |
| `FIRESTORE_DATABASE_ID` | Explicit database ID, such as `lpubelts-dev` or `(default)` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Absolute path to the service-account JSON file |
| `COLLECTION_EXPORT_DIR` | Absolute directory for raw collection exports and state files |
| `COLLECTION_BACKUP_DIR` | Absolute directory containing collection backups |
| `COLLECTIONS_EXPORT_LOOKBACK_MS` | Optional non-negative lookback; defaults to `300000` |

`awardsEvidenceExport.js` additionally requires:

| Variable | Purpose |
| --- | --- |
| `COLLECTION_PUBLIC_DATA_DIR` | Absolute directory containing `unclaimedEvidence.json` and receiving derived outputs |

`ALLOW_PRODUCTION_JOB=true` is required when `LPU_JOB_ENV=production` or when `FIRESTORE_DATABASE_ID=(default)`. This technical guard does not replace the required human approval before any live-data or production run.

The exporters do not infer configuration from `USER`, `LOGNAME`, or the current working directory. They do not automatically load a dotenv file; use Node's explicit `--env-file` option or provide the variables through the invoking shell, process manager, or cron entry.

## Validate configuration safely

Either exporter supports `--check-config`:

```bash
node --env-file=.env.local src/projects/collections/collectionsExport.js --check-config
node --env-file=.env.local src/projects/collections/awardsEvidenceExport.js --check-config
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
node --env-file=.env.production src/projects/collections/collectionsExport.js cron
node --env-file=.env.production src/projects/collections/awardsEvidenceExport.js cron
```

Before the next scheduled run, each cron entry must be updated to provide the required explicit environment variables. Do not run these commands manually or update production cron configuration without approval.

## Create a full incremental baseline

Pass `--full` to ignore any existing raw lockcollections export and rebuild it from the complete Firestore collection:

```bash
node --env-file=src/projects/collections/.env.development src/projects/collections/collectionsExport.js --full
```

The full run records a baseline watermark when it starts, reconciles change-index entries from the configured lookback window, and atomically writes each raw export, backup, and incremental state file in the normal order. Later runs can omit `--full` and update that baseline incrementally. This reads the complete live collection and writes configured output files, so it requires the normal approval for live-data jobs.

## Combined export and analysis runner

The repository-level runner loads the collections configuration that matches the required `NODE_ENV`, then runs the collection exports and dependent analysis jobs in order. It stops at the first failed job.

```bash
NODE_ENV=development node /home/lpubelts_api/apps/api-server-dev/current/scripts/collectionExportAnalysis.js
```

Supported environments are `local`, `development`, and `production`, corresponding to `.env.local`, `.env.development`, and `.env.production` in this directory. The runner performs live-data and output-writing work, so inspect the selected configuration and obtain the required approval before executing it.

## Development API

Tests and other modules can call the exporters with injected dependencies:

- `runCollectionsExport(options)`
- `runAwardsEvidenceExport(options)`

Provide a Firestore-compatible `db`, explicit directories, a lookback value, and an `activityLogger`. The awards/evidence exporter also accepts item-detail loaders and both exporters accept a deterministic `now` function for testing.
