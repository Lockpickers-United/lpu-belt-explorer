# Monorepo Phase 4 rehearsal and Phase 5 cutover runbook

Status: Phase 4 complete; question 12 review accepted. The sequence and seven-day post-cutover observation are approved; execution remains separately gated. Prior development service is restored.
Prepared: 2026-10-25
Owner: Neal Bayless
Candidate: `2725290cb7ddfa284113f7bb570992e9986fe6b0`

## Evidence and review boundary

Use the developer report for actual results; this document describes prospective operations. Phase 4 is incomplete until development health/journey and rollback evidence, plus human review, are recorded. Do not remove workflow holds or treat successful unit/browser tests as development deployment evidence.

Source chain: frozen API `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` → reviewed sanitized ancestry/import merge `fd2daca185393fe72737ad4083cc398f989c6e84` → Phase 1 `22ec5c9fef8871aefa678eefe9bbedb0d695285a` → web relocation `f64e7fc73672e014cff9227b9ecf841b02f05cba` → npm conversion/candidate `2725290cb7ddfa284113f7bb570992e9986fe6b0`. The original-to-rewritten map is in `monorepo-api-history-verification.json`. Recheck the original API SHA and clean status before activation; stop on drift.

Linux evidence: API CI run `40230235649` passed on Ubuntu 22.04, Node 24.21.0/npm 11.19.0. Artifact `api.tar.gz` SHA-256: `8af03b10d7ed883ec08391e0b191c4f589229186874eeb41cc9c85c79c0a3206`. Embedded root-lock SHA-256: `e77fbfa67cbef1c1f0fbb1b3b2c6b9ca59449abdd6b0ea8d8a446975b388bfeb`. Match `.release-inputs.json.monorepoCommit` to the complete candidate SHA. A later release-control commit requires fresh exact-commit validation and its own artifact identity; do not relabel this archive.

## Local rehearsal option

Loopback mock/emulator checks may establish API routing, catalog replacement, change-index consumption, readiness controller and cron orchestration contracts. They do not establish DreamHost process configuration, reverse proxy behavior, hosted credentials, effective schedules or actual PM2 rollback. The real server initializes Firebase and other runtime integrations before readiness: do not point it at live configuration or invent a credential bypass to call a local run isolated. A proposed synthetic process harness must be reviewed as an equivalent rehearsal, with its gaps explicit, before it can satisfy the plan's development gate. The Linux archive cannot load its Linux Sharp binary on macOS.

## Development target — existing directory and port selected

Existing target: `api-dev.lpubelts.com`, loopback port `10081`, PM2 `lpubelts-api-server-dev`, root `/home/lpubelts_api/apps/api-server-dev`, protected shared environment `shared/.env.development`. The owner selected this existing directory/port. Read-only preflight confirms Linux x64, Node v24.21.0, directory layout and readable environment/declaration. Port 10081 is listening and the named PM2 process is online; question 11 confirms interruption/replacement scope. No production hostname, process, environment, data path or schedule is in this scope.

Development currently uses a mutable WebStorm upload directory `current-dev`, whereas production uses `current -> releases/<id>`. Do not run the production activation block unchanged against development: it hardcodes `.env.production`, `current`, Linux commands and production identity checks. Do not replace the existing mutable directory with a symlink without a separate layout decision and rollback backup.

Preferred development procedure for review:

1. Reuse the owner-selected existing `current-dev`, port 10081 and PM2 name. The existing SSH inspection alias works and `/home/lpubelts_api/.nvm/versions/node/v24.21.0/bin/node` reports v24.21.0. Confirm interruption/replacement of the online process in question 11; preserve the complete existing directory and pause IDE auto-upload before activation.
2. Inspect only named settings and non-secret paths; never dump PM2 environments or credential files. Confirm exact Node 24.21.0, Linux x64, PM2 cwd/script, development database `lpubelts-dev`, `LPU_JOB_ENV=development`, `ALLOW_PRODUCTION_JOB=false`, and disabled optional side-effect integrations. Starting the service can initialize live services; identify and approve that access explicitly before starting.
3. Keep candidate and previous source/dependencies together as complete releases outside `shared`. Shared environment, credentials, logs, generated API files, snapshots and export state remain outside release directories. Record prior target and artifact checksum before any switch. Do not copy current production data or run an exporter to populate the rehearsal.
4. Transfer the reviewed Linux archive/checksum only after explicit development approval. Verify checksum and inspect archive before extraction; validate embedded commit/root lock, Node, entry syntax and native Sharp. Keep API contents at archive root, without an added `../../apps/api` segment. Link the protected development environment, then write a distinct development `.release.json` containing the exact SHA and rehearsal release ID.
5. Use the existing process name/port and JSON ecosystem cwd/script/log paths. Activate only that approved process or the approved existing development replacement. Require `/ready` over loopback and the approved development HTTPS route to return `ready: true`, `environment: development` and the exact release ID. Check the public `/api/v1/stats/collections/locks` response and a known lock's videos against approved development fixtures. Use an approved development account for a representative web/API request, including owner/admin denial behavior; do not save tokens or private payloads to evidence.
6. Demonstrate rollback on the isolated candidate by making its readiness file unavailable or selecting an intentionally invalid candidate identity, without modifying shared live data. Confirm the activation gate rejects it, restores the prior complete source/dependency target and reloads only the approved development process. Verify prior release readiness and representative API behavior again. Record before/after targets, status, release IDs and outcomes; restoring a symlink alone is insufficient.
7. Inspect approved cron entries by job name/command/path, record one owner per workload, and verify absolute pinned Node plus stable job paths. Syntax checks and mocked `--check-config` tests are safe preflight. Actual `--check-config` can load protected host configuration; approve it separately if needed. Do not execute runners with `cron`, enable schedules or run live exporters for this rehearsal. Observe scheduled work only if that live read is approved.
8. Restore the prior development arrangement unless retaining the candidate is explicitly agreed. Confirm shared state survived both switches, no duplicate schedule was installed, and IDE mapping ownership is unambiguous. Save PM2 state only after explicit review of the intended persistent process list.

This is a reviewable procedure, not an executable host script. Target/port/layout choices in step 1 materially affect concrete commands; finalize them before asking for activation approval. No host connection is needed for the independent local checks.


## Existing development target — concrete replacement sequence

Read-only evidence: `ss -ltn 'sport = :10081'` shows a listener; filtered PM2 metadata shows `lpubelts-api-server-dev` online at the expected cwd/script. No API request, environment dump, data read, upload or restart was performed. Directory/port selection is resolved; question 11 concerns replacement of this running service.

After replacement authorization, use the verified Linux archive and checksum, preserve a complete rollback copy and retain the mutable `current-dev` layout. Proposed remote paths:

```sh
DEV_ROOT=/home/lpubelts_api/apps/api-server-dev
NODE_BIN=/home/lpubelts_api/.nvm/versions/node/v24.21.0/bin
REHEARSAL_ID=2725290cb7ddfa284113f7bb570992e9986fe6b0-phase4
CANDIDATE_DIR="$DEV_ROOT/rehearsal/$REHEARSAL_ID/candidate"
PREVIOUS_DIR="$DEV_ROOT/rehearsal/$REHEARSAL_ID/previous"
FAILED_DIR="$DEV_ROOT/rehearsal/$REHEARSAL_ID/failed"
```

1. Abort if any rehearsal destination already exists; never overwrite a previous rehearsal. With IDE uploads paused, inspect only non-secret development safety settings and integration enabled/disabled flags. Verify no production access and confirm generated data/catalog paths remain under development shared storage. Confirm the existing environment link can be recreated at the stable `current-dev` path without modifying its protected target.
2. Upload the reviewed Linux archive/checksum to this rehearsal staging area. Require explicit checksum equality failure handling (`if ...; then ...; else exit 1; fi`), validate embedded commit and root lock, Node, Linux architecture, extracted entry syntax and Sharp. Do not install or resolve dependencies on the host. Create the development environment link and distinct `.release.json` in the staged candidate. Keep the original development JSON ecosystem declaration's stable cwd/script/log paths.
3. Once staging and development safety checks pass, the service-changing command sequence is:

```sh
export PATH="$NODE_BIN:$PATH"
pm2 stop lpubelts-api-server-dev
mv "$DEV_ROOT/current-dev" "$PREVIOUS_DIR"
mv "$CANDIDATE_DIR" "$DEV_ROOT/current-dev"
pm2 restart lpubelts-api-server-dev --update-env
```

These are prospective commands requiring question 11 authorization, not a standalone script: the operator must handle every rename/start failure and restore the previous directory before proceeding. Use a sanitized development process environment; inspect only required non-secret flags, never dump the PM2 environment.

4. Verify loopback `http://127.0.0.1:10081/ready` and `https://api-dev.lpubelts.com/ready` identify development and the candidate release, then verify the agreed public API fixtures. Do not record private responses or tokens. Confirm the real listener address before choosing loopback as a reachable health path; preflight saw a listener bound to the host IPv4 address, not a loopback listener. Keep that fact separate from the desired deployment topology and do not change binding settings silently.
5. Rehearse a deliberately rejected candidate identity using staging/health validation, never by damaging shared data. To demonstrate actual recovery after candidate activation, stop only the development process, move candidate `current-dev` to the previously absent `FAILED_DIR`, move `PREVIOUS_DIR` back to `current-dev`, and restart the same development process with its prior configuration. Verify the restored service identity/readiness and public API again. If it cannot restart, leave the preserved directories intact and report recovery failure; do not touch production.
6. Leave the previous development arrangement active after rehearsal unless the owner chooses to retain the candidate. Do not save PM2 state or alter schedules. Keep the candidate/previous evidence directories for review; do not prune them automatically.

## Web/catalog verification and ordering

Use `npm run ci-pr`, the restricted Playwright preview and the local `validateClassificationCatalog.js` command. Record all seven catalog hashes and the distinct `safelocks.json` upload source. Test-mode builds establish path equivalence; they do not certify production environment values, generated CSV/HTML/Markdown files or actual Pages contents.

For a later approved release, validate the intended production build settings and full output manifest before publication. Inspect every generator first; never use `ci-build` or Import as a test shortcut. Stage compatible catalogs before exposing features that require them. The existing web workflow publishes Pages before activating snapshots, so explicitly review that compatibility window and the existing server write-stage/catalog contract. Preserve effective approved Classification stages; do not silently reset or promote them.

## Named hosted settings and trigger review

The owner has reviewed the intended unchanged policy, confirmed destination API setting-name availability and accepted the sequence. Phase 5 must verify effective settings on the actual release repository before execution; do not infer them from the fork:

- API `production` environment: required reviewers/allowed branches; variables `SFTP_HOST`, `SFTP_PORT`, `SFTP_USER`, `DEPLOY_ROOT`, `REMOTE_NODE_BIN`, `PM2_APP_NAME`, `HEALTHCHECK_URL`; secrets `SFTP_PRIVATE_KEY`, `SFTP_KNOWN_HOSTS` (names only).
- Web `github-pages` environment: all referenced `VITE_*` variables, production/development snapshot roots and SSH/SFTP secret names from the candidate workflows; Pages source/output/custom domain, Actions write permissions and required status checks. Review values privately without copying them into reports.
- Triggers: Build-N-Deploy push/main, manual dispatch, and successful Import `workflow_run`; manual-only Import dispatch/auto-commit/completion effects (no schedule in the reviewed workflow); manual development catalog publication; main-only manual API deployment and exact-commit approval. Shared lock/config path filters must route both validations.
- All four candidate live-job holds stay unconditional during Phase 4. Check old and new in-flight runs before any future hold change. Disable old API dispatch authority before enabling the new one. Keep one source of scheduled work. Current deployed main workflows are unaffected by local candidate holds.

## Phase 5 sequence — separately gated

1. Obtain human acceptance of Phase 4 evidence and this runbook, actual protected settings and reviewers, exact source/artifact identities, live-data effects and rollback retention. Record the real prior deployed API release, Pages commit and catalog hashes; local source SHAs are not deployed identities.
2. Prepare a separate reviewed release-control change and validate its exact commit/artifact. Approve any main merge/push, API activation, automatic Pages publish, both catalog uploads and any live-data operation explicitly. Do not reuse Phase 3 branch-push approval.
3. Establish sole release authority while preventing any old/new in-flight deployment overlap. Keep the prior backend available. Activate the compatible API first; require pinned Node/native Sharp, exact readiness identity, HTTPS/public/authenticated checks and persistent-data paths before the frontend switch. Use the existing production workflow's fail-closed readiness and public smoke gates.
4. Publish the approved web output/catalog set only after API readiness. Verify Pages commit, browser journey, API base URL, both environment catalog identities and approved Classification stage. If the web workflow's catalog ordering is incompatible, revise the reviewed procedure before approval.
5. On API activation failure, atomically restore the previous `current` target, reload the same approved PM2 process, and verify readiness plus representative API calls. Inspect rollback results: the existing workflow tolerates a failed rollback reload, so workflow exit alone cannot establish recovery. On later web/catalog failure, restore the previous Pages artifact and the compatible prior snapshots with explicit approval; API rollback alone does not revert either external artifact. Confirm schema/write compatibility before rolling back persistent-data consumers; never roll back shared data by copying a release.
6. Retain active plus two rollback API releases and the old backend through at least one normal operating cycle, preferably a week, per deployment-topology guidance. The owner approved seven days of observation after cutover; elapsed time alone does not authorize retirement. Observe normal schedules without extra manual exports. Retire old release workflows, mappings and schedules only after separate approval and recorded health/traffic/job evidence.

## Evidence to complete before Phase 4 sign-off

Record target decision and authorization, actual development release/health and web/API journey, deliberate failure and successful recovery, shared-data persistence, effective schedule inventory, hosted settings/reviewer/trigger review and production-output limitations. Until then Phase 4 remains in progress and production cutover is unapproved.

## Executed rehearsal findings

The corrected real Linux development cycle passed 25 gates; see the developer report/verification metadata for exact identities and observed failures. Linux Bash 5.1.16 closes the checksum-rejection gap. Existing `current-dev` stayed a real directory; the complete previous directory and dependencies were restored after deliberate wrong-identity rejection. Public API smoke and anonymous private-profile denial passed; a representative browser UI/API journey remains pending.

Preserve original effective `APP_RELEASE_ID` and `APP_GIT_SHA` when restoring PM2 settings. Values may come from the protected file rather than the inherited PM2 environment. Empty process overrides mask dotenv defaults and caused the first restoration check to fail despite a healthy service. The corrected cycle restores fallback values and requires the original readiness identity. Do not weaken that assertion.

Do complete archive inspection in CI/local validation and verify the identical checksum before host extraction. Redundant full host inspection terminated abnormally on this VPS; retain the successful CI/local inspection plus actual host checksum/identity/syntax/Sharp evidence rather than repeating a resource-heavy inspector without diagnosis. No runtime dependency installation is needed on the host.

There is one production cron entry per existing runner, with absolute pinned Node/stable `current/scripts` paths, and no development duplicates. No job was executed, added or changed. Protected shared-file hashes survived the corrected cycle; ordinary shared service logs gained rehearsal entries. Keep the staged/rejected directories and evidence until owner review; cleanup is a separate operation.

## Review responsibilities and migration delta

Question 12 lists concrete controls, setting names and required evidence. The agent runs the integrated browser check and safe output validation; the owner is not required to run automated tests. Use a designated development public-profile fixture to avoid requiring credentials; interactive sign-in is needed only if an authenticated journey is chosen.

Production procedures/settings/URLs/ports were not changed in Phase 4. Preserve existing GitHub protections and the established manual API/automatic web release intent. Planned migration changes are app-relative build/workflow inputs, destination-repository API environment availability, old-to-new API dispatch authority and eventual removal of migration holds. Existing Pages publication followed by seven snapshots to both APIs is an external effect to retain/review, not a new monorepo feature. Complete production output remains agent validation work before release.

## Completed public-profile browser journey and generator verification

The owner-designated mgsecure profile (`GGplAdctTfVDLVvYsfIADJmfp8f2`) passed the actual web build → real candidate public-summary API → rendered public profile journey, including Locks/Safes navigation and reload, clean console/modules and anonymous private-profile denial. Candidate identity was checked before/after. The encompassing 28-gate host cycle restored original service/source/settings and preserved selected protected shared-file hashes. Ancillary Firestore activity reads were isolated to an empty demo emulator; a restricted loopback bridge forwarded the public summary unchanged and supplied local browser CORS. This verifies that integration contract, not live activity, authenticated access or production CORS. No manual user test is required for the completed journey.

The seven inspected local-only generator/copy scripts produced identical 2,275 dist and three version/sitemap files from pre-relocation and candidate source snapshots under a fixed clock. CSV/HTML/Markdown generator/path equivalence is closed. Production-mode compilation with intended effective release settings and human hosted-control/authority-transfer review still precede cutover.

## Local ignored files and owner policy confirmations

Owner confirms preservation of existing ops/environment protections, unchanged Web/Import settings and presence of API deployment setting names in the destination `production` environment. Actual hosted reviewer/branch metadata is not independently queried; preserve it and retain existing deployment preflight. Remaining human review is the authority-transfer/API-first/web-plus-catalog/recovery sequence and observation interval (proposed seven days), not further settings redesign or test execution.

Ignored files do not follow Git imports or worktrees. If using the migrated checkout for local development, the owner can copy web `.env.keysNew` to monorepo root and API `.env.local` to `../../apps/api/.env.local`, preserving originals and privately checking path references. Do not overwrite tracked root web env files or copy production credentials just for tests. Server `shared/.env.development` and `shared/.env.production` stay protected on the host and are linked at activation. GitHub deployment settings do not populate those application env files. No secret provisioning is needed to reproduce completed synthetic tests.

## Final Phase 4 acceptance

Owner question 12 accepts the sequence and seven-day observation interval. This closes Phase 4 human review; Phase 5 is not started. Use **seven days after the actual cutover** as the observation interval, retaining the previous backend and active plus two API rollback releases. Require recorded health/job evidence and separate retirement authorization after observation.

Keep production-mode compilation with intended release settings, exact final artifact/commit/target checks and effective hosted protection verification on the Phase 5 pre-execution checklist. Owner confirmation of existing policy/settings names is not an independent metadata/value audit. Runbook acceptance authorizes no production action, publication, merge, migration-hold removal or retirement. Source/runtime/shared-state boundaries remain unchanged.
