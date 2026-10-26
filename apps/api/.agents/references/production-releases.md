# Production Releases

## Approval boundary

Production deploys, PM2 starts or restarts, and live-data jobs require explicit user approval under the root `AGENTS.md`. Preparing or reviewing workflow files, release configuration, commands, and documentation does not deploy them.

Keep `CLASSIFICATION_WRITE_STAGE=read` in the protected production environment
until the separate Classification authorization and rollout gates are complete.
Later stage changes require the same approved release process and coordinated
frontend `VITE_CLASSIFICATION_WRITE_STAGE` builds.

## Deployment workflow

The production workflow is root `.github/workflows/api-deploy-production.yml`. Phase 5 PR #333 transferred manual API dispatch authority to the monorepo after old workflow 357527280 was disabled and drained; its API hold is removed. PR #334 subsequently restored web publication; Import/development-catalog holds remain. The frozen original source and prior releases remain available for recovery. Production deployment still requires explicit approval of the exact commit; enabling dispatch does not approve a deployment. The candidate workflow is manually dispatched, accepts only the `main` branch, and binds to the GitHub `api-production` environment; main-only deployment is enforced by workflow code. Phase 5 hosted inspection verified destination `api-production` with all seven variable names/two secret names and no required reviewers or branch policy, matching the old API environment. Owner question 13 is resolved; private value/target checks remain required before transfer. An environment name alone does not establish reviewer approval.

The workflow:

1. Checks out the exact requested commit.
2. uses the Node patch pinned in `.nvmrc` and the pinned npm 11.19.0 version.
3. installs dependencies using root `npm ci --ignore-scripts`.
4. runs `npm run validate:api` from the monorepo root (lint and the complete test suite).
5. installs production dependencies on the Linux x64 deployment runner, then stages `COMMIT:apps/api` with derived standalone npm inputs, that package’s production `node_modules` tree and a checksum using `scripts/releaseArtifact.js`. The archive root is the API package; `apps/api` is not a host directory.
6. uploads them over SFTP to `incoming`.
7. connects over SSH and verifies the checksum.
8. expands a new immutable release.
9. links the shared production environment file and writes the release identity.
10. confirms the production host is Linux x64, loads the packaged native Sharp dependency, and checks `src/lpubeltsApiServer.js` syntax without installing packages on the host.
11. atomically switches `current` to the new release.
12. reloads the named PM2 application, requires the HTTPS readiness response to identify the exact activated release, and smoke-tests the public collection-statistics endpoint.
13. switches `current` back to the previous target and reloads PM2 if the readiness check fails.

## GitHub configuration

The destination `api-production` GitHub environment needs these variables:

- `SFTP_HOST`
- `SFTP_PORT`
- `SFTP_USER`
- `DEPLOY_ROOT`
- `REMOTE_NODE_BIN`
- `PM2_APP_NAME`
- `HEALTHCHECK_URL`

It needs these secrets:

- `SFTP_PRIVATE_KEY`
- `SFTP_KNOWN_HOSTS`

Expected values include `DEPLOY_ROOT=/home/lpubelts_api/apps/api-server-prod` and `HEALTHCHECK_URL=https://api.lpubelts.com/ready`. Do not put secret values in repository files or agent references.

Before the first dependency-upgrade deployment and whenever `.nvmrc` changes, verify on the production host that `REMOTE_NODE_BIN` provides the exact `.nvmrc` version. The deployment workflow repeats this check before activating the packaged release and exits before changing the `current` release if the versions differ.

## Production cron commands

Cron must invoke each runner through the absolute pinned Node binary. Runner files
are intentionally tracked without an executable bit, and cron does not initialize
NVM or inherit an interactive shell's `PATH`. Production command fields are:

```sh
NODE_ENV=production /home/lpubelts_api/.nvm/versions/node/v24.21.0/bin/node /home/lpubelts_api/apps/api-server-prod/current/scripts/runFetchAnalyzeLogs.js cron 2>&1
NODE_ENV=production /home/lpubelts_api/.nvm/versions/node/v24.21.0/bin/node /home/lpubelts_api/apps/api-server-prod/current/scripts/runCollectionExportAnalysis.js cron 2>&1
```

Enter each command as one line. Keep the Node path synchronized with `.nvmrc`,
retain the `cron` argument, and keep output under the stable `shared` tree. Do not
invoke a runner `.js` path directly or make release copies executable as a cron
workaround.

## Bootstrap requirements

Before the first workflow run, the production server must have:

- `incoming`, `releases`, and `shared` directories
- a protected `shared/.env.production`
- one complete initial release under `releases/<release-id>`
- `current` as a symlink to that specific initial release
- the tracked `ecosystem.prod.json` declaration using `src/lpubeltsApiServer.js`
- an existing `lpubelts-api-server-prod-next` PM2 application, matching `PM2_APP_NAME`
- DreamHost proxying `api.lpubelts.com` to the application's internal port
- `collectionStatsByIdFull.json` and `lockVideos.json` in the shared directory
  selected by `COLLECTION_API_DIR`, readable by the PM2 account
- `COLLECTION_API_DIR` pointing to the shared generated-data API directory

The workflow deliberately checks that `current` is already a symlink and that the PM2 process exists. Bootstrap is a separate, reviewable operation. Use a JSON PM2 ecosystem declaration for the new production process, following the proven development pattern.

The new process uses the distinct name `lpubelts-api-server-prod-next`. Retain
that name after cutover so the PM2 declaration, `PM2_APP_NAME`, rollback, and
monitoring commands remain consistent. Bootstrap it with the sanitized-environment
command documented in `.github/DEPLOYMENT.md` and inspect `pm2 env <pm_id>` for
unintended inherited values before saving the process list.

## Retention and rollback

Retain three production releases: the active release and two rollback candidates. The monorepo cutover runbook has an owner-approved seven-day post-cutover observation interval; keep recovery candidates and the previous backend available throughout. Expiry does not automatically authorize retirement. The current workflow does not prune old releases, so cleanup remains a separate maintenance action after verifying the active target. Never remove the target of `current` or either rollback candidate.

The automated rollback covers failures during deployment activation and the readiness check. Readiness remains unavailable during startup and shutdown, verifies that the configured collection-statistics and lock-video files are readable, and reports the release ID written by the workflow. For a later manual rollback:

1. identify a known-good release,
2. switch `current` atomically to that exact release,
3. reload the configured PM2 process,
4. verify the readiness endpoint and a representative API request.

A brief restart interruption is acceptable; PM2 cluster mode is not currently
required. The application drains for up to 10 seconds on shutdown or a fatal
process error, and the PM2 definition allows 12 seconds before forced termination.

## Parallel rollout and frontend cutover

Setup time is not a constraint. Fully configure and test the new production service before changing the frontend. The frontend API base URL change is the public cutover point. Keep the previous backend available until the new path has completed normal traffic and operational cycles, and verify there are no duplicate scheduled jobs while both are running.

## Offline artifact gate

Root `api-ci.yml` runs root `npm ci --ignore-scripts` using Node 24.21.0/npm 11.19.0, runs validation, runs root `npm ci --workspace=apps/api --omit=dev --include-workspace-root=false --ignore-scripts` for production dependencies on Ubuntu 22.04 x64, loads Sharp, and invokes `node scripts/releaseArtifact.js create "$GITHUB_SHA" "$RUNNER_TEMP/api.tar.gz"`. The builder pairs committed dependency inputs with installed inputs. It validates member paths and links before extraction, package identity, PM2 entry points and required source/job files. `inspect` repeats archive validation. CI extracts to a temporary directory and checks server/job syntax and Sharp loading from the extracted package. No SSH, secrets, PM2 process or exporter runs in that job.

The creation command requires an exact committed monorepo revision. Uncommitted implementation changes must be committed by the owner before CI can certify the final artifact. macOS structural/unit checks do not certify Linux native modules. Keep the artifact and checksum together; readiness later identifies the same monorepo SHA via `.release.json`.

## Monorepo switch and rollback

Production PM2, `current/scripts/...` cron commands, environment symlink, shared snapshots/data/logs and rollback targets keep their existing host paths because the archive contains API package contents directly. Do not add `/apps/api` beneath host `current`. During the approved switch, verify the pinned host Node, PM2 cwd/script, existing cron command fields and shared paths; retain one schedule per job. Do not manually execute cron as a preflight. If activation fails, the existing workflow restores the previous `current` target and reloads PM2. A later rollback uses the retained pre-monorepo release and the same readiness/API checks.

For the initial Phase 1 check, API CI also accepts pushes to the exact `monorepo/phase1-api` branch with the same API path scope. This allows CI on a reviewed branch without a default-branch merge, PR creation or manual dispatch of an unavailable workflow. Pushing that branch still requires explicit authorization. Production deployment remains unconditionally disabled.

## npm workspace release inputs

The root lockfile is authoritative. The release builder verifies committed root/API manifests, lockfile, npm configuration and Node pins. It derives an API-root `package.json` with effective root overrides and a package-local `package-lock.json`, copies only the API production dependency tree, and records the exact commit, root-lock SHA-256 and tool versions in `.release-inputs.json`. The standalone lock is generated in temporary staging, never maintained alongside the workspace source. Inspection rejects missing dependencies, development packages and versions absent from that lock. The remote activation check also verifies the recorded commit before changing `current`.

Node 24.21.0 availability was confirmed by the owner for question 8. This does not replace the activation check that `REMOTE_NODE_BIN` supplies that exact patch. Candidate production deployment remains unconditionally held until Phase 5.


## Phase 5 effective controls and retirement

Read [the cutover ledger](../../../../internal-docs/monorepo-phase5-runbook.md) before proposing an external action. As verified on 2026-10-25, Pages is owned by `Lockpickers-United/lpu-belt-explorer`, which has web `github-pages` and the provisioned API `api-production` environment. The frozen old API repository retains its unchanged `production` environment; its workflow 357527280 is now disabled after the approved transfer. Do not use the CI fork as evidence of production settings. No required reviewer or environment branch restriction was present on old API `production`; preserve the existing policy without inventing or silently changing it.

Adopt the held monorepo on the confirmed destination before transferring release authority. Disable/quiesce old API dispatch before enabling the monorepo API job, retain the web/Import/development-catalog holds during API verification, and separately authorize the site-control merge because it triggers Pages plus catalog uploads. API authority transfer and API/web activation are complete; see the current record below. Keep the old repository/backend and active plus two complete recovery releases through seven days after actual cutover; retirement requires separate authorization and operating evidence. Cron continues through stable host `current/scripts` paths and needs no duplicate schedule. Existing automated rollback suppresses PM2 reload errors; verify the restored service identity explicitly.

The owner selected `api-production` as the destination GitHub environment name for clarity. Populate it with the same settings and protections as the old repository’s `production`; leave the source environment unchanged. This name is a GitHub deployment binding only: runtime `NODE_ENV=production`, protected `.env.production`, host paths, PM2 names and release procedures stay unchanged. Web continues to use `github-pages`.

Provisioning confirmed on 2026-10-25: destination `api-production` now has all seven required variable names/two secret names, no required reviewers and no deployment branch policy, matching the previously inspected source environment. Question 13 is resolved. Earlier missing-environment findings are historical; normal private value/target checks remain required before activation. No release authority or live-job hold has changed.


## Monorepo production preflight findings (2026-10-25)

The read-only Phase 5 preflight verified the seven source/destination target-variable values, effective environment protections, Node 24.21.0, current/PM2/shared boundaries and existing single-owner cron entries. `REMOTE_NODE_BIN` is the **bin directory**, not the `node` executable; normalize an allowed trailing slash and append `/node` for direct checks.

Node Fetch rejects internal production port `10080` as a bad port. Use curl or Node's `http` client against the actual production listener for internal readiness; public HTTPS `/ready` works normally. The current listener is on a specific host address, so do not assume loopback reachability or change binding settings to satisfy a probe.

Use the exact recovery IDs/manifests in the root Phase 5 runbook. Fifteen release directories were inspected; old `3656c924298d05ee21ffa34098f38ec821e5cf89-39672912437-1` lacks Sharp/required dependency manifests and must not be selected as a rollback merely because its directory exists. Active plus two selected complete releases remain available; structural/provenance checks do not mean they were reactivated in this preflight. No cleanup or authority transfer occurred. Pages/catalog recovery copies and manifests are in private durable local storage outside Git; preserve them through the later approved observation period.


## API-only activation record (2026-10-25 local date)

Main `44026a8c1c71ee361caf3ab43913361502f97bf7` is deployed as `44026a8c1c71ee361caf3ab43913361502f97bf7-40258859190-1` through the separately approved API-only workflow run. Exact runtime/source/lock/Node/Sharp/readiness/public/anonymous checks pass; existing cron, shared data, catalogs and Pages remain unchanged. Previous current and both selected rollback releases remain intact. Owner confirmed authenticated owner/admin read verification for question 19; this is owner-reported evidence. No web/catalog release or full-cutover observation start is implied.

The workflow checks upload integrity and normally removes the successful incoming archive/checksum without retaining its value. CI and rebuilt runtime gzip hashes need not match and must not be conflated. Post-deploy comparison confirmed all 13,175 comparable deployed source/dependency records match the certified CI artifact; runtime/protected files were excluded and release identity checked separately. Consult the root Phase 5 runbook/JSON for exact hashes, private recovery/evidence locations and current verification state. No new deployment/authorization procedure was introduced by this documentation.


## Verified web cutover and observation (2026-10-26 UTC)

Owner question 20 authorized the two-file web-control release. PR #334 merged main `684ea9d9e31884742268fd5ed7c5f6605dea9514`; automatic Build-N-Deploy 40263182081 succeeded. Pages `8c30aacf36a6d0d656dd18105541c3ca57647282` and all 14 catalog snapshots verified, compiled API URLs point to production, database selection is production and Classification stage is `publish`. Public browser checks pass. The API remains on independently approved release `44026a8c1c71ee361caf3ab43913361502f97bf7-40258859190-1`; web and API release SHAs can differ. No API redeployment was required for catalog replacement.

Observation started `2026-10-26T03:18:52Z`; earliest retirement review `2026-11-02T03:18:52Z`. Preserve previous backend/frozen source and all selected recovery releases/artifacts. Normal job/health evidence is still pending; no extra cron/export/import was executed. Import and development-catalog dispatch holds remain and require separate restoration approval. Retirement is separately authorized after the interval and evidence review; expiry alone grants no authority. Root runbook/JSON records exact artifact hashes and private recovery locations.
