# Production Releases

## Approval boundary

Production deploys, PM2 starts or restarts, and live-data jobs require explicit user approval under the root `AGENTS.md`. Preparing or reviewing workflow files, release configuration, commands, and documentation does not deploy them.

## Deployment workflow

`.github/workflows/deploy-production.yml` is the production path. It is manually dispatched, accepts only the `main` branch, and uses the GitHub `production` environment so one reviewer can approve deployment.

The workflow:

1. Checks out the exact requested commit.
2. uses Node 24 and the pinned Yarn version.
3. installs dependencies with the immutable lockfile.
4. runs tests and lint.
5. creates a Git archive and checksum.
6. uploads them over SFTP to `incoming`.
7. connects over SSH and verifies the checksum.
8. expands a new immutable release.
9. links the shared production environment file and writes the release identity.
10. installs the locked dependencies and checks `src/lpubeltsApiServer.js` syntax.
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

## Bootstrap requirements

Before the first workflow run, the production server must have:

- `incoming`, `releases`, and `shared` directories
- a protected `shared/.env.production`
- one complete initial release under `releases/<release-id>`
- `current` as a symlink to that specific initial release
- a production PM2 declaration using `src/lpubeltsApiServer.js`
- an existing PM2 application whose name matches `PM2_APP_NAME`
- DreamHost proxying `api.lpubelts.com` to the application's internal port
- `shared/generated-data/collectionStatsByIdFull.json`, readable by the PM2 account
- `COLLECTION_API_DIR` pointing to that shared generated-data directory

The workflow deliberately checks that `current` is already a symlink and that the PM2 process exists. Bootstrap is a separate, reviewable operation. Use a JSON PM2 ecosystem declaration for the new production process, following the proven development pattern.

While the old backend remains live, give the new process a distinct name such as `lpubelts-api-server-prod-next`. The final name can be retained after cutover; consistency between the PM2 declaration and `PM2_APP_NAME` matters more than renaming it.

## Retention and rollback

Retain three production releases: the active release and two rollback candidates. The current workflow does not prune old releases, so cleanup remains a separate maintenance action after verifying the active target. Never remove the target of `current` or either rollback candidate.

The automated rollback covers failures during deployment activation and the readiness check. Readiness remains unavailable during startup and shutdown, verifies that the configured collection-statistics file is readable, and reports the release ID written by the workflow. For a later manual rollback:

1. identify a known-good release,
2. switch `current` atomically to that exact release,
3. reload the configured PM2 process,
4. verify the readiness endpoint and a representative API request.

A brief restart interruption is acceptable; PM2 cluster mode is not currently required.

## Parallel rollout and frontend cutover

Setup time is not a constraint. Fully configure and test the new production service before changing the frontend. The frontend API base URL change is the public cutover point. Keep the previous backend available until the new path has completed normal traffic and operational cycles, and verify there are no duplicate scheduled jobs while both are running.
