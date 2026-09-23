# Exporter Runtime Safety Remediation

## Purpose

This document describes how to remediate two related operational risks in `explore-lpubelts-com-node`:

1. Older jobs infer production from the operating-system username.
2. Some exporters read credentials, initialize Firebase, and execute work merely by being imported.

The desired outcome is explicit, fail-closed environment selection and import-safe jobs without breaking existing incremental export guarantees or cron behavior.

## Implementation status

The first phase has been applied to the two active incremental exporters. They now use `exportJobConfig.js`, `exportFirebase.js`, and `isDirectRun.js`; expose dependency-injected run functions; support `--check-config`; and have import-safety and incremental-behavior tests. `allEvidenceExport.js` has also been migrated to that pattern. The routed `requestLock.js` component now uses validated startup configuration, a named target-aware Firebase client, dependency-injected handlers, request-local upload state, and import-safety tests. The routed `uploadContent.js` component now uses validated startup configuration, dependency-injected email and archive handling, isolated per-request workspaces, and import-safety tests. The routed `emailFormContents.js` component now has an explicit enable flag, dependency-injected email handling, bounded request-local fields, escaped email output, and import-safety tests. The routed `importRaflData.js` component now has explicit sheet/output configuration, no import-time execution, bounded upstream requests, coordinated atomic file replacement, dependency-injected import handling, and Firebase `raflAdmin: true` authorization. The routed `getRedditBelts.js` component now has explicit script/credential/output configuration, bounded Python execution, staged output replacement, dependency-injected refresh handling, import-safety tests, and Firebase `lpuAdmin: true` authorization. The routed `getFlickrInfo.js` component now has explicit credential/runtime configuration, request-scoped timeouts, bounded photo concurrency and photoset size, dependency-injected handling, validated upstream responses, and import-safety tests. The routed `logFirebaseActivity.js` component now has explicit opt-in configuration, server-derived environment classification, bounded and whitelisted payload normalization, dependency-injected logging, and import-safety tests. Diagnostic `/echo` and `/boom` routes are now omitted from production while `/health` and `/ready` remain available without logging environment paths. Production cron and server environments still need to be supplied with the documented explicit environment variables before their next run. Other older jobs listed later in this document have not yet been migrated.

## Original findings

These findings describe the state before the first implementation phase:

- At least 26 files use `process.env.USER !== localUser`, meaning any unrecognized username is treated as production.
- `src/projects/collections/collectionsExport.js` selects production implicitly, reads a service-account file at module scope, initializes Firebase at module scope, and unconditionally executes `getIncrementalData()` at the bottom of the module.
- `src/projects/collections/awardsEvidenceExport.js` has the same behavior and unconditionally executes `getAllData()`.
- The exporters' existing `isDirectRun` variables affect activity logging only; they do not prevent export execution after import.
- `src/projects/collections/allEvidenceExport.js` and `src/projects/collections/exportCollectionHandler.js` read credentials and initialize Firebase during import even though their primary work is function-based.
- `src/projects/requestLock/requestLock.js` initializes Firebase and creates its upload directory during import.
- `src/api/services/firebaseAdmin.js` already demonstrates the preferred lazy-initialization direction: importing it does not read credentials until a Firebase client is requested.

## Recommended remediation

### 1. Introduce explicit job configuration

Create a shared module such as `src/config/jobRuntime.js` that validates explicit settings. A possible interface is:

```text
LPU_JOB_ENV=development|production
FIRESTORE_DATABASE_ID=lpubelts-dev|(default)
FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/service-account.json
COLLECTION_EXPORT_DIR=/absolute/path
COLLECTION_BACKUP_DIR=/absolute/path
COLLECTION_PUBLIC_DATA_DIR=/absolute/path
ALLOW_PRODUCTION_JOB=true
```

The configuration loader should have these properties:

- Missing and invalid values fail immediately with clear messages.
- Unknown usernames never imply production.
- `NODE_ENV` controls runtime/logging behavior, not the data target.
- Firestore database selection is independent from output locations. This preserves the ability to read production data into local output directories when that is explicitly intended and approved.
- Production requires both an explicit target and an explicit production opt-in.
- Returned configuration is immutable and contains normalized absolute paths.

`ALLOW_PRODUCTION_JOB=true` is a technical safety catch that confirms operator intent. It is not a substitute for the separately required human approval before a production or live-data run.

For jobs that access Firebase, failing when `LPU_JOB_ENV` is missing is safer than defaulting. If a default is ever introduced, it must be development rather than production.

### 2. Remove username-based selection from active exporters

Replace logic such as:

```js
const production = process.env.USER !== localUser
```

with validated configuration passed into the job. Remove path selection based on `localUser`, `prodUser`, `USER`, or `LOGNAME`.

Do not silently fall back to production paths, credentials, or the default production Firestore database. Database selection and each output directory should be explicit and independently validated.

### 3. Make Firebase initialization lazy and target-aware

Create or extend a shared service with an interface similar to:

```js
export function createFirestoreClient({
    serviceAccountPath,
    databaseId,
    appName
}) {
    // Load credentials and initialize Firebase only when called.
}
```

The implementation should:

- Read credentials only inside the factory or getter.
- Prefer an explicitly supplied credential path.
- Use a named Firebase app for each target instead of accepting whichever app happens to be `getApps()[0]`.
- Select the default or development Firestore database explicitly.
- Cache clients by an unambiguous target key.
- Avoid logging credential contents or sensitive paths unnecessarily.

Where the hosting environment supports it, Application Default Credentials are preferable to manually parsing service-account JSON. If a service-account file remains necessary, its location should come from configuration rather than username-derived paths.

### 4. Turn exporters into import-safe functions

Refactor each active exporter around injected dependencies:

```js
export async function runCollectionsExport({
    db,
    exportDir,
    backupDir,
    lookbackMs,
    activityLogger,
    trigger,
    now
}) {
    // Existing incremental export behavior.
}
```

Module scope should contain only imports, constants without environmental side effects, and function declarations. Importing an exporter must not:

- Read credentials.
- Initialize Firebase.
- Read or write export files.
- Contact Firestore or another external service.
- Post activity records.
- Create directories.
- Start the export.

Dependency injection makes the incremental logic testable with fake Firestore clients, temporary directories, deterministic clocks, and stubbed activity logging.

### 5. Guard command-line execution correctly

Preserve compatibility with existing cron commands, but make execution conditional:

```js
async function main() {
    const config = loadJobRuntime()
    const db = createFirestoreClient(config)

    await runCollectionsExport({
        db,
        ...config,
        trigger: process.argv.includes('cron') ? 'cronjob' : 'manual'
    })
}

if (isDirectRun(import.meta.url)) {
    await main()
}
```

The existing invocation can remain:

```bash
node src/projects/collections/collectionsExport.js cron
```

It will additionally require explicit runtime configuration.

A separate thin `*.cli.js` entry point would provide even stronger separation between library and process startup. Keeping a real direct-run guard in the current filenames, however, minimizes cron migration risk.

Use one shared, tested `isDirectRun()` helper. It should compare normalized absolute paths so it behaves consistently regardless of the current working directory.

### 6. Add a configuration-only mode

Add a safe command such as:

```bash
node src/projects/collections/collectionsExport.js --check-config
```

It should report only:

- Selected job environment.
- Firebase project and Firestore database identifiers.
- Output, backup, and public-data paths.
- Whether the production safety gate is enabled.

It must not read credentials, initialize Firebase, contact services, create directories, or write output. It must never display secret values.

### 7. Add regression tests

The highest-value tests are:

- Importing either active exporter does not require credentials.
- Importing either exporter does not access Firestore, create directories, or write files.
- Missing environment selection fails closed when job execution is requested.
- Unknown `USER` or `LOGNAME` values have no effect.
- Production configuration fails without the explicit production opt-in.
- Development and production database IDs resolve correctly.
- Export logic works with mocked Firestore and temporary output directories.
- Export-state files are not advanced when any dependent output fails.
- Incremental deletion and lookback-window behavior remain intact.
- Activity counts continue to distinguish change-index reads from source-document reads.

An import-safety test can launch a child Node process with credential variables removed, import the module, and verify that it exits successfully without creating files. Job configuration should be tested separately from execution so importing remains safe even when runtime variables are absent.

### 8. Migrate remaining jobs in risk order

After the active incremental exporters, migrate modules in this order:

1. `src/projects/collections/allEvidenceExport.js`
2. `src/projects/collections/exportCollectionHandler.js`
3. Routed modules with import-time initialization (`src/projects/requestLock/requestLock.js` is complete; migrate any remaining modules)
4. Active collection statistics, RAFL, Reddit, and log processors
5. Historical and WIP scripts only when they remain operationally relevant

For each module, remove username-derived paths, delay credential/client creation until execution, inject external dependencies, and add an import-safety test where practical.

### 9. Add a permanent enforcement check

Prevent the dangerous pattern from returning. Options include:

- An ESLint restriction against using `process.env.USER` or `process.env.LOGNAME` for environment selection.
- A focused Vitest source scan that rejects those patterns in operational code.
- Import-safety tests for every executable module that is also imported by application code.
- A code-review checklist item requiring explicit database and output targets for new jobs.

The enforcement should target environment selection rather than legitimate diagnostic display of a username, if such use is ever needed.

### 10. Roll out cron changes carefully

For each migrated job:

1. Record the existing cron command, working directory, environment, credential source, database target, and output locations.
2. Back up current raw exports and export-state files.
3. Run the new `--check-config` mode.
4. Test against the development database and temporary output directories.
5. Verify that an import performs no work.
6. With explicit approval, perform one production run manually.
7. Verify document counts, deletion behavior, derived outputs, watermarks, backups, and activity logs.
8. Update the cron environment while retaining the command path when possible.
9. Observe at least one scheduled run before removing compatibility code.

Changes to the production crontab, PM2 configuration, service credentials, or live output directories require explicit approval.

## Incremental export invariants to preserve

The runtime-safety refactor must not weaken the current incremental-export design:

- Bootstrap with a full collection read only when the raw local export is unavailable.
- Query each change index from the saved high-water mark with a lookback window.
- Fetch only changed source documents during normal incremental runs.
- Apply source-document deletions.
- Write raw, backup, and derived JSON atomically.
- Advance state only after all corresponding output files succeed.
- Preserve processed change keys needed for lookback deduplication.
- Continue logging source and change-index reads separately.

The change-index schema is shared with `../lpu-belt-explorer/functions/index.js`. Any schema, collection-name, timestamp, or deletion-semantics change must be implemented and validated in both repositories.

## Suggested first implementation slice

The first change should be intentionally narrow:

1. Add the validated job-runtime configuration module.
2. Add the lazy, target-aware Firebase factory.
3. Refactor `collectionsExport.js` and `awardsEvidenceExport.js` so imports are inert and execution dependencies are injected.
4. Add configuration, import-safety, and incremental failure-state tests.
5. Preserve existing cron command paths.

Do not update or execute production cron jobs as part of that code change without separate explicit approval.
