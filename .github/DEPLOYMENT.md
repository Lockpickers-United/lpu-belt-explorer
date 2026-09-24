# Production deployment

The `Deploy production` workflow validates the selected `main` commit, uploads a tracked-files-only archive over SFTP, and activates an immutable release over SSH. It is manual-only and uses the GitHub `production` environment.

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
| `REMOTE_NODE_BIN` | Absolute directory containing `node`, `corepack`, and `pm2`; `node --version` must match `.nvmrc`. |
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

Set `COLLECTION_API_DIR` to an absolute shared generated-data directory and seed
`collectionStatsByIdFull.json` there before the first start. The PM2 account must
be able to read it. The API validates its Firebase service-account configuration
at startup and does not report ready until startup finishes.

Before enabling the workflow, manually verify that:

1. The deployment key can use both SFTP and a restricted SSH shell.
2. The deployment account owns `incoming`, `releases`, and the `current` symlink.
3. `REMOTE_NODE_BIN` supplies the exact Node version in `.nvmrc`, Corepack, and PM2. Verify it without restarting the process: `export PATH="$REMOTE_NODE_BIN:$PATH"; test "$(node --version)" = "v$(tr -d '[:space:]' < .nvmrc)"`. Then run `corepack yarn --version` and confirm it reports 4.18.0.
4. `pm2 describe lpubelts-api-server-prod-next` succeeds for that account and its environment contains only intentional inherited values.
5. The readiness URL reaches the production process and returns the release ID created by the workflow.

## Deployment and rollback

Run **Actions → Deploy production → Run workflow** from `main`. The workflow requires the explicit `deploy-production` selection and serializes deployments so two releases cannot activate concurrently.

The remote activation verifies the uploaded archive checksum and the Node version from `.nvmrc`, installs dependencies with `yarn install --immutable`, writes `.release.json`, checks server syntax, switches `current`, reloads PM2, and calls the readiness endpoint. The response must be ready and identify the exact release just activated. It then performs a bounded request to the public collection-statistics endpoint. If PM2 reload or either check fails, `current` is restored to its previous target and PM2 is reloaded again.

For a later manual rollback, atomically repoint `current` to a reviewed retained
release, run `pm2 reload lpubelts-api-server-prod-next`, and verify
`https://api.lpubelts.com/ready` reports that release before exercising a
representative low-impact API request.

Old releases are intentionally retained for manual rollback and are not deleted by the workflow. Periodically remove reviewed, obsolete release directories after confirming they are not the current or desired rollback target.
