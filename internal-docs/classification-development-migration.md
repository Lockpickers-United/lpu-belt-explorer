# Classification development migration

The migration command is `scripts/migrateClassificationDev.js`. Its `plan` mode reads local JSON only. `inspect` reads the live `lpubelts-dev` Firestore database, and `apply` writes it; each live run needs separate approval under `AGENTS.md`. Do not run either live mode to validate a code edit.

The command requires a vote export, its matching compact and full catalogs, and a private manifest path. Check the catalog pair with the frontend's `scripts/validateClassificationCatalog.js` before planning. The plan validates vote IDs and pairs, identity fields, belts, dates, media URLs, catalog IDs, and both catalog hashes. It creates deterministic vote IDs, preserves source IDs and export-time dates, and uses the API's own projection builder. It imports votes, summaries, and minimal states; the application action/publication files are empty, and test fixtures are excluded. Every ranked entry with a valid `currentBeltDate` seeds a milestone, including those without a modern vote. The seed does not invent a Published action or status.

Run the plan from this repository with the chosen files:

```sh
node scripts/migrateClassificationDev.js plan \
  --source /absolute/path/classification-samples.json \
  --catalog /absolute/path/classification-catalog.json \
  --full-catalog /absolute/path/data.json \
  --manifest /private/path/classification-migration-manifest.json
```

Store the manifest privately. It records source-to-deterministic-ID mapping, synthetic-user mapping, source and catalog fingerprints, intended document IDs, counts, and the exact plan fingerprint. It omits vote comments and media. A later export requires a new plan and identity reconciliation; never match regenerated source IDs or synthetic user IDs blindly. `plan` creates the manifest exclusively and will not overwrite an existing one.

Before a live run, confirm the active development API catalog version matches the manifest, stop Classification writers, and record a completed target-database export plus its location, ruleset, index configuration, and API release. The backup record JSON must contain `projectId`, `databaseId`, `catalogVersion` for the selected manifest, `location` (`gs://...`), `exportedAt` (ISO timestamp after plan creation), `ruleset`, `indexConfiguration`, and `apiRelease`. If the catalog changes after the export, preserve the version originally recorded with the export as `catalogVersionAtExport` in a new backup record and record the separately confirmed active version as `catalogVersion`; the Firestore backup itself does not change. Store records privately and verify the export independently. A backup record is an operator attestation; the migration command cannot prove that a restore point exists.

After separate authorization for the live inspection, run:

```sh
NODE_ENV=development node scripts/migrateClassificationDev.js inspect \
  --source /absolute/path/classification-samples.json \
  --catalog /absolute/path/classification-catalog.json \
  --full-catalog /absolute/path/data.json \
  --manifest /private/path/classification-migration-manifest.json \
  --allow-live lpubelts-dev
```

The command loads the protected development environment without printing it, requires the named `lpubelts-dev` database in project `lpu-belt-explorer`, verifies the configured local API catalog version, and compares every document in all six Classification collections. Extra or changed target documents are conflicts. Only a target with no conflicts may proceed. An empty target has 823 absent documents for the 345-vote candidate source and 19 seeded ranked milestones.

If the local development catalog or service-account path is unavailable, add `--auth gcloud --active-catalog-version <separately verified API catalog version>` to an approved `inspect` or `apply` invocation. The version must match the manifest. This is an operator attestation of the deployed API catalog, not a remote check. The alternate transport captures a Google Cloud CLI access token internally and uses only Firestore's document-list and create-precondition commit endpoints for the same guarded target. It does not print the token or document contents. A Google Cloud CLI session is distinct from Firebase CLI authentication. Do not use this option as a substitute for independently confirming the deployed catalog version.

After separate authorization for the write, run the same arguments in `apply` mode with `--backup-record /private/path/backup-record.json` and `--confirm-write <planSha256>`, plus the alternate authentication flags if needed. The command first re-inspects the target, creates each entry's missing vote and projection documents in one Firestore batch with create preconditions, skips exact matches on retry, and reads all six collections again to verify the final projections and counts. If a write stops partway through, leave writers stopped, inspect the target, and retry only when the source and manifest still match and there are no conflicts. The manifest lists the exact created IDs for targeted rollback. Never remove whole collections to recover a partial import.

The frontend implementation report records the candidate source/catalog versions, the documented backup and rollback procedure, and the remaining release gates. The reader cutover is a later phase; development rules and indexes must be reconciled before browser subscriptions start.

On 2026-10-15 UTC, the owner confirmed active development API catalog version `sha256:094da826dc82f23d0cbf0e8f9219549b1589a14a468843fe46b20223dfe08288` and separately approved the write. The selected current-catalog manifest had plan SHA-256 `c34f22a1a05d25539da01c9fe708b1e4da00ef442ee33fe2210b7f23f21157a7`. An approved full `lpubelts-dev` backup exists at `gs://lpubelts-bucket01/firestore-backups/lpubelts-dev/phase3-preimport-20261015T043342Z`. The guarded `apply` run found 823 absent documents and no conflicts, created all 823, then verified 823 exact matches and no absent or conflicting documents. It imported 345 votes, 239 summaries, and 239 minimal states; the action, publication, and operation collections stayed empty. The private manifest and backup record are in the ignored `.local/classification-phase3/` directory of the frontend workspace. The checked-in vote file is only the development seed; the later production export needs a new plan and approval.

The completed development migration and its frozen manifest contain votes, summaries, and minimal entry states. The later `classificationFeatureEntries/{entryId}` lock-filter design has been removed from current source. No compact feature seed or backfill is required for production migration. Historical development records from the earlier API writer may remain until separately approved cleanup; do not rerun or alter the completed development manifest to address them.
