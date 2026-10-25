# Production Releases

## Approval boundary

Production deploys, PM2 starts or restarts, and live-data jobs require explicit user approval under the root `AGENTS.md`. Preparing or reviewing workflow files, release configuration, commands, and documentation does not deploy them.

Keep `CLASSIFICATION_WRITE_STAGE=read` in the protected production environment
until the separate Classification authorization and rollout gates are complete.
Later stage changes require the same approved release process and coordinated
frontend `VITE_CLASSIFICATION_WRITE_STAGE` builds.

## Deployment workflow

The monorepo candidate path is root `.github/workflows/api-deploy-production.yml`. Its deploy job has an unconditional `if: ${{ false }}` migration hold. The frozen original API repository remains the only production release authority through Phase 4. Remove that hold only in an explicitly approved Phase 5 change after disabling old dispatch authority and checking in-flight runs. The candidate workflow is manually dispatched, accepts only the `main` branch, and uses the GitHub `production` environment for approval; effective reviewers and allowed branches still require owner verification.

The workflow:

1. Checks out the exact requested commit.
2. uses the Node patch pinned in `.nvmrc` and the pinned Yarn version.
3. installs dependencies with the immutable lockfile.
4. runs the shared `yarn validate` command (lint and the complete test suite).
5. installs production dependencies on the Linux x64 deployment runner, then archives `COMMIT:apps/api` with that package’s `node_modules` tree and a checksum using `scripts/releaseArtifact.js`. The archive root is the API package; `apps/api` is not a host directory.
6. uploads them over SFTP to `incoming`.
7. connects over SSH and verifies the checksum.
8. expands a new immutable release.
9. links the shared production environment file and writes the release identity.
10. confirms the production host is Linux x64, loads the packaged native Sharp dependency, and checks `src/lpubeltsApiServer.js` syntax without installing packages on the host.
11. atomically switches `current` to the new release.
12. reloads the named PM2 application, requires the HTTPS readiness response to identify the exact activated release, and smoke-tests the public collection-statistics endpoint.
13. switches `current` back to the previous target and reloads PM2 if the readiness check fails.

## GitHub configuration

The `production` GitHub environment needs these variables:

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

Retain three production releases: the active release and two rollback candidates. The current workflow does not prune old releases, so cleanup remains a separate maintenance action after verifying the active target. Never remove the target of `current` or either rollback candidate.

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

Root `api-ci.yml` installs immutable Yarn dependencies under `apps/api`, runs validation, focuses production dependencies on Ubuntu 22.04 x64, loads Sharp, and invokes `node scripts/releaseArtifact.js create "$GITHUB_SHA" "$RUNNER_TEMP/api.tar.gz"`. The builder pairs committed dependency inputs with installed inputs. It validates member paths and links before extraction, package identity, PM2 entry points and required source/job files. `inspect` repeats archive validation. CI extracts to a temporary directory and checks server/job syntax and Sharp loading from the extracted package. No SSH, secrets, PM2 process or exporter runs in that job.

The creation command requires an exact committed monorepo revision. Uncommitted implementation changes must be committed by the owner before CI can certify the final artifact. macOS structural/unit checks do not certify Linux native modules. Keep the artifact and checksum together; readiness later identifies the same monorepo SHA via `.release.json`.

## Monorepo switch and rollback

Production PM2, `current/scripts/...` cron commands, environment symlink, shared snapshots/data/logs and rollback targets keep their existing host paths because the archive contains API package contents directly. Do not add `/apps/api` beneath host `current`. During the approved switch, verify the pinned host Node, PM2 cwd/script, existing cron command fields and shared paths; retain one schedule per job. Do not manually execute cron as a preflight. If activation fails, the existing workflow restores the previous `current` target and reloads PM2. A later rollback uses the retained pre-monorepo release and the same readiness/API checks.

For the initial Phase 1 check, API CI also accepts pushes to the exact `monorepo/phase1-api` branch with the same API path scope. This allows CI on a reviewed branch without a default-branch merge, PR creation or manual dispatch of an unavailable workflow. Pushing that branch still requires explicit authorization. Production deployment remains unconditionally disabled.
