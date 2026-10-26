# Production deployment

Phase 1 candidate only: root `.github/workflows/api-deploy-production.yml` is manual and its deploy job is unconditionally disabled. The original API repository remains production release authority. Do not dispatch the candidate as a deployment or remove the hold before the approved Phase 5 transfer. Root `api-ci.yml` builds and inspects an offline Linux artifact without host access. Package contents are rooted at the API boundary, so host PM2, cron and shared paths below remain unchanged. See [production references](../.agents/references/production-releases.md).

The candidate `API deploy production (migration hold)` workflow validates the selected `main` commit, uploads a tracked-files-only archive over SFTP, and activates an immutable release over SSH. It is manual-only and uses the GitHub `production` environment.

The verification job installs the immutable lockfile and runs `yarn validate`, the
same lint and complete-test command used by the tracked pre-commit hook and the
automatic pull request workflow. The deployment job installs production-only
dependencies on a Linux x64 GitHub runner and packages them with the tracked
source. The production host does not run Yarn during activation. See
`CONTRIBUTING.md` for local hook setup and pull request validation details.

## GitHub production environment

Create an environment named `production`. Restrict it to the `main` branch and add a required reviewer when the repository plan supports deployment protection rules.

Add these environment secrets:

| Secret | Purpose |
| --- | --- |
| `SFTP_PRIVATE_KEY` | Dedicated SSH private key authorized by the deployment account. |
| `SFTP_KNOWN_HOSTS` | Verified SSH host-key line for the production host. Do not populate this from an unverified `ssh-keyscan` result. |

Add these environment variables:

| Variable | Example or purpose |
| --- | --- |
| `SFTP_HOST` | Production SSH/SFTP hostname. |
| `SFTP_PORT` | Usually `22`. |
| `SFTP_USER` | Least-privileged deployment account. |
| `DEPLOY_ROOT` | `/home/lpubelts_api/apps/api-server-prod`. |
| `REMOTE_NODE_BIN` | Absolute directory containing `node` and `pm2`; `node --version` must match `.nvmrc`. |
| `PM2_APP_NAME` | `lpubelts-api-server-prod-next`. The workflow rejects another name. |
| `HEALTHCHECK_URL` | `https://api.lpubelts.com/ready`. |

The workflow has read-only repository permissions. Environment secrets are available only to the deployment job, after any configured environment approval.

## Required server layout

Prepare this layout once without placing secrets in the repository:

```text
/home/lpubelts_api/apps/api-server-prod/
  current -> an existing working release
  incoming/
  releases/
  shared/
    .env.production
```

`current` must be a symbolic link. The PM2 process must use these paths so a reload follows the newly activated release:

```text
cwd:    DEPLOY_ROOT/current
script: DEPLOY_ROOT/current/src/lpubeltsApiServer.js
```

Production cron entries should likewise run scripts beneath `DEPLOY_ROOT/current`. Keep `.env.production`, credentials, logs, generated data, and writable upload/output directories under stable shared or external paths. The workflow links `shared/.env.production` into each release and never uploads an environment file.

Invoke cron jobs with the absolute path to the pinned Node binary. The runner
scripts are tracked as non-executable files, and cron does not load the NVM shell
initialization that normally adds Node to `PATH`. Use these as the command fields
(each command is one line):

```sh
NODE_ENV=production /home/lpubelts_api/.nvm/versions/node/v24.21.0/bin/node /home/lpubelts_api/apps/api-server-prod/current/scripts/runFetchAnalyzeLogs.js cron 2>&1
NODE_ENV=production /home/lpubelts_api/.nvm/versions/node/v24.21.0/bin/node /home/lpubelts_api/apps/api-server-prod/current/scripts/runCollectionExportAnalysis.js cron 2>&1
```

Keep the Node path synchronized with `.nvmrc` when the pinned version changes.
The `cron` argument suppresses interactive progress output and is forwarded to
the component jobs. Do not invoke either `.js` path directly or depend on its
shebang; a direct invocation fails with `Permission denied` at the tracked file
mode, and making it executable would still depend on cron finding the correct
Node version through `/usr/bin/env`.

The tracked, secret-free `ecosystem.prod.json` is the bootstrap definition for
the parallel process. Start it from the initial release with a deliberately small
inherited environment, because values already present in PM2 take precedence over
the protected `.env.production` file:

```sh
cd /home/lpubelts_api/apps/api-server-prod/current
env -i HOME="$HOME" PATH="$PATH" \
  pm2 start ./ecosystem.prod.json --only lpubelts-api-server-prod-next
pm2 describe lpubelts-api-server-prod-next
pm2 env <pm_id>
```

Use the numeric `pm_id` shown by `pm2 describe` in the final command. Confirm the
script, working directory, Node version, `NODE_ENV=production`, and that no stale
API or job configuration was inherited. The application then loads all other
runtime values from `shared/.env.production`. The PM2 definition allows 12 seconds
for the application's 10-second request drain before PM2 forces termination.

Set `COLLECTION_API_DIR` to the absolute shared generated-data API directory and
seed `collectionStatsByIdFull.json` and `lockVideos.json` there before the first
start. The PM2 account must be able to read both files. The API validates its
Firebase service-account configuration at startup and does not report ready until
startup finishes or while either generated API file is unavailable.

Before enabling the workflow, manually verify that:

1. The deployment key can use both SFTP and a restricted SSH shell.
2. The deployment account owns `incoming`, `releases`, and the `current` symlink.
3. `REMOTE_NODE_BIN` supplies the exact Node version in `.nvmrc` and PM2. Verify it without restarting the process: `export PATH="$REMOTE_NODE_BIN:$PATH"; test "$(node --version)" = "v$(tr -d '[:space:]' < .nvmrc)"`.
4. `pm2 describe lpubelts-api-server-prod-next` succeeds for that account and its environment contains only intentional inherited values.
5. The readiness URL reaches the production process and returns the release ID created by the workflow.

## Deployment and rollback

After the approved Phase 5 authority transfer and removal of the hold, run **Actions → API deploy production → Run workflow** from `main`. The workflow requires the explicit `deploy-production` selection and serializes deployments so two releases cannot activate concurrently.

The remote activation verifies the uploaded archive checksum and the Node version from `.nvmrc`, writes `.release.json`, checks that the host is Linux x64 and can load the packaged Sharp dependency, checks server syntax, switches `current`, reloads PM2, and calls the readiness endpoint. The response must be ready and identify the exact release just activated. It then performs a bounded request to the public collection-statistics endpoint. If PM2 reload or either check fails, `current` is restored to its previous target and PM2 is reloaded again.

For a later manual rollback, atomically repoint `current` to a reviewed retained
release, run `pm2 reload lpubelts-api-server-prod-next`, and verify
`https://api.lpubelts.com/ready` reports that release before exercising a
representative low-impact API request.

Old releases are intentionally retained for manual rollback and are not deleted by the workflow. Periodically remove reviewed, obsolete release directories after confirming they are not the current or desired rollback target.
