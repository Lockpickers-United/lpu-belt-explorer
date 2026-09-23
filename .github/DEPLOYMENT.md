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
| `DEPLOY_ROOT` | Absolute release root, such as `/home/account/apps/explore-lpubelts`. |
| `REMOTE_NODE_BIN` | Absolute directory containing `node`, `corepack`, and `pm2`. |
| `PM2_APP_NAME` | `explore-lpubelts-server-prod` for the current PM2 configuration. |
| `HEALTHCHECK_URL` | HTTPS readiness URL, such as `https://explore.lpubelts.com/services/ready`. |

The workflow has read-only repository permissions. Environment secrets are available only to the deployment job, after any configured environment approval.

## Required server layout

Prepare this layout once without placing secrets in the repository:

```text
DEPLOY_ROOT/
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

Before enabling the workflow, manually verify that:

1. The deployment key can use both SFTP and a restricted SSH shell.
2. The deployment account owns `incoming`, `releases`, and the `current` symlink.
3. `REMOTE_NODE_BIN` supplies the production Node version, Corepack, and PM2.
4. `pm2 describe PM2_APP_NAME` succeeds for that account.
5. The readiness URL reaches the production process.

## Deployment and rollback

Run **Actions → Deploy production → Run workflow** from `main`. The workflow requires the explicit `deploy-production` selection and serializes deployments so two releases cannot activate concurrently.

The remote activation verifies the uploaded archive checksum, installs dependencies with `yarn install --immutable`, checks server syntax, switches `current`, reloads PM2, and calls the readiness endpoint. If PM2 reload or the readiness check fails, `current` is restored to its previous target and PM2 is reloaded again.

Old releases are intentionally retained for manual rollback and are not deleted by the workflow. Periodically remove reviewed, obsolete release directories after confirming they are not the current or desired rollback target.
