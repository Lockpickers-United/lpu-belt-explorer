# Classification production candidate and release runbook

Prepared 2026-10-16 UTC for Phase 6 item 4. This is a frozen local candidate and an operator procedure, not authorization to contact production. Each live inspection, backup/export, migration write, rules or Functions deployment, API or site deployment, Sheet update, Import run, and announcement needs its own explicit approval under the repository safety policy. Keep the production API and frontend write stages at `read` through the first reader release.

## Frozen candidate

| Artifact | Frozen value |
| --- | --- |
| Final vote source | `src/data/classification-vote-import-final.json`, SHA-256 `31586e4a8460573dc3cc277694f54aef4af7a0f46551bb800f821b24bc8f5ecb` |
| Full catalog | `src/data/data.json`, SHA-256 `094da826dc82f23d0cbf0e8f9219549b1589a14a468843fe46b20223dfe08288` |
| Compact catalog | `src/data/classification-catalog.json`, SHA-256 `350f3ae6ec3c4c9439c4022ae29fd0b9f901b54a2f03e084d3a793e4cf4166b0`; embedded version `sha256:094da826dc82f23d0cbf0e8f9219549b1589a14a468843fe46b20223dfe08288` |
| Private production manifest | `.local/classification-phase6/production-migration-manifest.json`, SHA-256 `8ce56de8f207250a1800c04f000fe56a6f6cabb2f2c74ccbfd3823f789a5cf3b`; migration time `2026-10-16T20:47:02.832Z`; plan SHA-256 `8e5528adc2eef71d247ba6aa58bbc9f7ecd8b2ed9602094c31539c8ca428631d` |
| Private source reconciliation | `.local/classification-phase6/source-reconciliation.json`, SHA-256 `2916bb83eabecbbd25e4c1b32b0c664078bac01f5e2bb9bf330d832d7be7826a` |

The local planner validated all 347 final votes against the exact catalog pair and API vote schema. They represent 223 voted-on entries and 34 synthetic users. The plan creates 347 `classificationVotes`, 240 `classificationEntries`, and 240 `classificationEntryStates` documents, including 19 catalog-date milestones. It creates no actions, publications, or operation records. Against the 345-vote development seed, 345 votes match by content and known owner identity, two known-user votes were added (`8982fac6`, Green; `63a9a2b1`, Black 2), and none were removed. All 34 synthetic identities map one-to-one; 21 generated IDs changed. All 345 matching votes have new export-time dates. The private reconciliation records each source-ID and synthetic-user mapping without vote comments. Do not use the development manifest or its synthetic IDs as production identity keys.

The private files have directory mode `0700` and file mode `0600`; they are ignored by Git. Preserve them with the release record. Any source or catalog byte change invalidates the manifest and requires a fresh reconciliation, plan, hashes, and review. The final source export is an input artifact; it is never loaded as a runtime vote fixture.

## Preflight and release order

1. Record the approved release IDs, operator, time window, and completed initial Auth-claim verification. The owner reports that the initial production claims are verified; this preparation did not inspect Auth users or tokens. Confirm a claim-only Black Belt reader and own-vote writer, denied admin action and cross-user vote access, and an explicit `blackBelt: false` case with credentialed checks during release. The two Firestore databases share Auth but need separate rules and data. Do not run an automatic award-to-claim grant from owner-writable `awards` or profile records.
2. Recheck the candidate SHA-256 values and run `node scripts/validateClassificationCatalog.js src/data/data.json src/data/classification-catalog.json`. Review the exact production `(default)` rules release, indexes, and TTL configuration against the tracked Classification rules and index definitions. `firebase.json` attaches indexes only to `lpubelts-dev`; the scoped [transition](../firebase.prod-transition.json) config attaches the reviewed file to `(default)`, while the [final](../firebase.prod-final.json) config changes only the `(default)` rules. Record pre-release ruleset/index IDs for rollback and recheck for intervening changes immediately before deployment.
3. Verify the protected production API uses `FIREBASE_PROJECT_ID=lpu-belt-explorer`, `FIRESTORE_DATABASE_ID=(default)`, `NODE_ENV=production`, `LPU_JOB_ENV=production`, `ALLOW_PRODUCTION_JOB=true`, `CLASSIFICATION_WRITE_STAGE=read`, and absolute `CLASSIFICATION_CATALOG_PATH=/home/lpubelts_api/apps/api-server-prod/shared/snapshots/classification-catalog.json`. Check the active catalog's bytes/version against the frozen pair. Verify the production frontend build selects `(default)` (`VITE_DEV_FIRESTORE` unset or false), calls `https://api.lpubelts.com` for Classification (`VITE_API_SERVER_URL`), and has `VITE_CLASSIFICATION_WRITE_STAGE=read`. Check the built asset and API `/ready` release IDs, not only local environment settings.
4. Coordinate the cache rule cutover with the frontend. The current tracked rules deny browser writes to legacy `query-cache`, while the inspected production `FilterContext-DJig1AEC.js` still contains that path. The reviewed [transition rules](../firestore.rules-prod-transition) add Classification access and public `activity-cache` reads while preserving the exact deployed `query-cache` public-write allowance. Deploy the default-database evidence/award cache Functions first, then the scoped transition rules/indexes under separate approvals. After the new no-write client is live and its public assets are verified, release the scoped final rules; record each ruleset ID for rollback. Unchanged users need a separately approved trusted backfill or the direct-query fallback. Verify other-member scorecards and activity refresh after the final cache rules release.
5. After the approved rules/indexes and API-at-`read` release, perform the separately approved full `(default)` Firestore export. Record the completed operation, exact `gs://` prefix, database ID, completion time after the manifest's migration time, ruleset, indexes, API release, and active catalog version in a private backup record. Verify the export metadata/object prefix independently. Keep Classification writers stopped. A backup record is an operator attestation and does not prove that an export exists.
6. Obtain separate approval for read-only target inspection. Use the sibling API repository's `scripts/migrateClassificationProduction.js inspect` with the frozen source/catalog/manifest paths, `--allow-live '(default)'`, and either the protected server credentials or `--auth gcloud --active-catalog-version <independently verified version>`. The CLI checks the exact project/database/environment, manifest, and catalog before opening Firestore. It reads only the six Classification collections and reports absent, matching, or conflicting document IDs. Require zero conflicts; investigate every extra or changed document. The expected empty target has 827 absent documents.
7. Obtain separate approval for `apply`. Use the same inputs plus `--backup-record <private JSON>` and `--confirm-write 8e5528adc2eef71d247ba6aa58bbc9f7ecd8b2ed9602094c31539c8ca428631d`. Reinspect immediately before the write, keep writers stopped, and require zero conflicts. The command creates missing documents only with Firestore create preconditions, then verifies all planned documents. Record actual created/matching counts; do not assume an empty production target. A partial run is retried only against the same frozen source and manifest after a clean inspection.
8. Release the read-only production frontend after the migrated data, rules, and API checks pass. A push touching `src/**` on `main` starts `Build-N-Deploy`, which deploys the site and then atomically replaces several production and development API snapshots, including both compact catalogs; `Import` also commits generated files and triggers that workflow. Review the exact files and external effects of that run before approval. Schedule that push and verify its exact commit/build, deployed catalog hashes, named database, Classification reads, public scorecards, and denied writes. Do not let a site deploy get ahead of its API/rules/data dependencies.
9. Keep `read` until the separate Phase 6 vote/action/publish stage approvals. Promote the API stage before its matching frontend build. Record each claim/owner/admin, concurrent-edit, projection, and recovery check. If a write stage fails, return both stages to `read` and preserve the current data for diagnosis.

## Protected API preflight for the owner

The 2026-10-16 agent SSH attempt as `lpubelts_api@api.lpubelts.com` was rejected before any protected file was read. The public site catalog is already the frozen compact file (SHA-256 `350f3ae6ec3c4c9439c4022ae29fd0b9f901b54a2f03e084d3a793e4cf4166b0`), but that does not prove the API's active shared snapshot or protected environment. With production server access, run this read-only check from the current API release and share only its JSON output. It parses the linked environment file and PM2 metadata in memory; it prints no environment values, tokens, or catalog content.

```sh
cd /home/lpubelts_api/apps/api-server-prod/current
node --input-type=module <<'NODE'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {isAbsolute} from 'node:path'
import {parse} from 'dotenv'

const expectedCatalogPath = '/home/lpubelts_api/apps/api-server-prod/shared/snapshots/classification-catalog.json'
const expectedCatalogHash = '350f3ae6ec3c4c9439c4022ae29fd0b9f901b54a2f03e084d3a793e4cf4166b0'
const fileEnv = parse(readFileSync('.env.production'))
let processInfo
try {
    const matches = JSON.parse(execFileSync('pm2', ['jlist'], {encoding: 'utf8'}))
        .filter(item => item.name === 'lpubelts-api-server-prod-next')
    if (matches.length === 1) processInfo = matches[0]
} catch { /* report PM2 as unverified */ }
const effective = key => processInfo?.pm2_env?.[key] ?? fileEnv[key]
const catalogPath = effective('CLASSIFICATION_CATALOG_PATH')
let catalogHash
try {
    if (catalogPath && isAbsolute(catalogPath)) {
        catalogHash = createHash('sha256').update(readFileSync(catalogPath)).digest('hex')
    }
} catch { /* report catalog as unverified */ }
const pinnedNode = readFileSync('.nvmrc', 'utf8').trim()
console.log(JSON.stringify({
    pm2Online: processInfo?.pm2_env?.status === 'online',
    nodeMatchesPinned: process.version === `v${pinnedNode}`,
    projectMatches: effective('FIREBASE_PROJECT_ID') === 'lpu-belt-explorer',
    databaseMatches: effective('FIRESTORE_DATABASE_ID') === '(default)',
    nodeEnvMatches: effective('NODE_ENV') === 'production',
    jobEnvMatches: effective('LPU_JOB_ENV') === 'production',
    productionJobAllowed: effective('ALLOW_PRODUCTION_JOB') === 'true',
    writeStageRead: effective('CLASSIFICATION_WRITE_STAGE') === 'read',
    fileWriteStageRead: fileEnv.CLASSIFICATION_WRITE_STAGE === 'read',
    pm2WriteStageOverridePresent: Object.hasOwn(processInfo?.pm2_env ?? {}, 'CLASSIFICATION_WRITE_STAGE'),
    pm2WriteStageOverrideRead: processInfo?.pm2_env?.CLASSIFICATION_WRITE_STAGE === 'read',
    catalogPathMatches: catalogPath === expectedCatalogPath,
    catalogHashMatches: catalogHash === expectedCatalogHash,
}, null, 2))
NODE
```

Before an API deployment, also confirm the workflow's protected `REMOTE_NODE_BIN` points to the pinned Node version and Corepack Yarn version specified in the sibling deployment guide. The GitHub production workflow rejects branches other than `main`; the local `classification-prod` branch requires a reviewed path to `main` or a separately authorized manual release.

The Classification-only API release candidate was commit `12a5bc6b6f7046176316db1974dbf6425364cd8c` on `classification-api-release`, opened as [API PR #72](https://github.com/Lockpickers-United/explore-lpubelts-com-node/pull/72). It excluded the unrelated safelock and log-analysis changes on the owner's local `classification-prod` branch. The final local `corepack yarn validate` and commit hook both passed lint and 83 Vitest files/398 tests; the PR's `Validate pull request` check also passed. After owner authorization, PR #72 was squash-merged into `main` as `ac6e2ca8fe87928130538a8de7946f188cfa5190`, confirmed by a remote-head read. The GitHub `production` environment's `PM2_APP_NAME`, `DEPLOY_ROOT`, and `HEALTHCHECK_URL` match the reviewed values; `REMOTE_NODE_BIN` matches the pinned Node 24.21.0 NVM `bin` path after ignoring a harmless trailing slash. No protected value was changed or printed. After separate owner approval, [workflow run #7](https://github.com/Lockpickers-United/explore-lpubelts-com-node/actions/runs/38970117193) deployed the API and passed both jobs. Public `/ready` reports `ac6e2ca8fe87928130538a8de7946f188cfa5190-38970117193-1`, and an unauthenticated Classification route returns 401. No migration or frontend deployment has run; proceed to the separately approved full `(default)` Firestore backup.

The owner's first result reported the PM2, Node, project, database, job-environment, and production-access checks as true. `writeStageRead`, `catalogPathMatches`, and `catalogHashMatches` were false; the old production API code was still live then. On the second check, the catalog path and file hash matched, leaving only `writeStageRead` false. After correcting the protected `.env.production`, the owner reran the ten-field check and all reported booleans passed, including effective `CLASSIFICATION_WRITE_STAGE=read`. The newer stage-specific booleans above remain available if a future PM2 override must be diagnosed. Recheck these gates if the protected file or PM2 configuration changes during later stages.

## Full production backup before migration

After separate approval, export the entire `(default)` database to a unique prefix in the previously used project bucket. Omit `--collection-ids` and `--namespace-ids` so the restore point covers the full database. Capture the exact prefix and operation name; the command must finish successfully before target inspection or migration.

```sh
backup_prefix="gs://lpubelts-bucket01/firestore-backups/default/phase6-preimport-$(date -u +%Y%m%dT%H%M%SZ)"
gcloud firestore export "$backup_prefix" --project=lpu-belt-explorer --database='(default)'
```

Independently describe the resulting operation with `gcloud firestore operations describe OPERATION_NAME --project=lpu-belt-explorer --database='(default)'` and list the exact prefix with `gcloud storage ls --recursive "$backup_prefix"`. Require a completed successful operation, an export metadata file, and `all_namespaces/` objects. Record its completion time, output URI, counters, active API release, catalog version, transition ruleset `889dc634-17a3-47a7-8b00-6b548554bff2`, and ready index/active TTL inventory in a private mode-`0600` backup record. Recheck the active rules/index inventory before recording it if time has passed since deployment. The migration CLI validates the record's fields, but only the independent operation and object checks establish the restore point.

The owner-approved full export completed successfully at `2026-10-16T21:39:09.707729Z`: operation `projects/lpu-belt-explorer/databases/(default)/operations/ASAyYWY3MzJkOWMyZjgtN2Y4OC1mZTE0LTZjMzUtNDc0NTlhMzQkGnNlbmlsZXBpcAkKMxI`, prefix `gs://lpubelts-bucket01/firestore-backups/default/phase6-preimport-20261016T213759Z`. An independent listing found both metadata files and 275 data shards. The private record is `.local/classification-phase6/production-backup-record-20261016.json` (mode `0600`, SHA-256 `3860821826c21cc0cffc27db838de3446cb116b24175fc044854388f98f28968`); it matches the frozen manifest's project, database, catalog version, and chronology. All three production composite indexes were freshly `READY` and the Classification TTL `ACTIVE`. The available gcloud credential received HTTP 403 from a fresh Rules API read, so the record identifies the last independently verified transition ruleset and states that verification limit. The backup is complete; separately approve the read-only target inspection before running the migration CLI.

The separately approved `inspect` completed from the isolated Classification-only API worktree using the gcloud transport and explicit nonsecret production target values. It rebuilt and matched the frozen manifest before reading all six Classification collections; the result was 827 absent, zero matching, and zero conflicts. No Firestore write was made. Reinspect immediately before an approved `apply`; if any conflict appears, stop without writing and investigate its private ID list.

The separately approved `apply` then re-inspected the target, again found 827 absent and zero conflicts, created all 827 planned documents with create preconditions, and post-verified all 827 exact matches. The created set was 347 votes, 240 entry summaries, and 240 minimal entry states; the action, publication, and operation collections remained empty. The private backup record and plan fingerprint were validated before any write. The frontend remains unreleased and both write stages must remain at `read` during its first deployment.

The frontend reader is now the next production deployment, after the verified migration and before the final cache-write-denial rules release. An isolated Classification-scoped candidate at `/private/tmp/lpu-classification-frontend-release` starts from upstream frontend `main` `46a6c6d845cd50de8bc7b2eadfea1da1844e6d3a`; it excludes unrelated changes from the local `classification-live-data` branch. Its full and compact catalogs match the frozen hashes. The sanitized local production configuration selects `(default)`, the production API, and `read`; the GitHub `github-pages` environment has no stage variable, so the candidate workflow explicitly defaults that build variable to `read`. The local production build compiled to the read-only stage. Focused Classification tests, both local emulators, final `npm run ci-pr` (46 files/230 tests), and focused browser bundle/anonymous-route checks passed. At this preparation checkpoint no branch commit, push, merge, or site deployment had occurred. Review the candidate diff and credentialed reader boundary before deployment. A `main` merge touching `src/**` immediately triggers `Build-N-Deploy`, which publishes site assets and uploads the seven snapshot files to both production and development API paths; the other snapshot sources are unchanged but those uploads are still external effects to authorize. Verify the exact built chunk and catalog hashes once the workflow completes, then release the separately approved final `(default)` rules-only cache cutover.

## Recovery

Before reader cutover, leave writers stopped. For a partial import, inspect the six collections, compare them with the private manifest, and retry create-only writes only if no conflicts exist. To abandon the import, use an approved targeted deletion of manifest-listed created IDs or an approved restore of only affected Classification collections from the verified backup; verify counts and projections afterward. Never delete entire collections by name.

After reader cutover, first return both write stages to `read`, stop publication activity, and preserve a fresh approved export of the current Classification collections. Restore a previously verified frontend/API/rules/index combination together, including cache-write compatibility with that frontend, or leave the current reader in its explicit error state while data is repaired. Reconcile owner votes, summaries, minimal states, action/publication snapshots, and catalog version before reopening reads or writes. Do not replay a Publish request or delete an immutable publication to undo it.

## First real publication cycle

After separately approved `publish` promotion, choose reviewed staged actions and record the requested idempotency key. Publish creates an immutable snapshot; export it and prepare the announcement from that exact snapshot. The operator approves the announcement and Sheet edits, updates the Sheet, then separately approves and runs GitHub `Import`. Verify its generated `data.json`/compact pair, site build, both API catalog uploads, and Classification reconciliation from **Awaiting import** to **Matches catalog**. If Import is delayed, preserve the publication and show **Awaiting import**; do not publish the same action again. If a catalog update fails, stop further publication, leave the snapshot intact, correct the catalog deployment, and rerun reconciliation after the matching version is active. The development rehearsal used an isolated overlay and did not change the shared Sheet.

Record the actual release observations and any changed decisions in [the implementation report](./classification-public-data-report.md). The approved cache Functions, transition rules/indexes, read-only API release, full `(default)` export, target inspection, and migration are complete. Frontend deployment, authenticated browser checks, final rules, and publication remain later gates.
