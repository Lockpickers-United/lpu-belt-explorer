# Development and Production Deployment Recommendation

## Recommended starting point

Use a deliberately lightweight development process and retain the protected release process for production:

- WebStorm uploads changed application files to a mutable development directory on DreamHost.
- Development runs against the `lpubelts-dev` Firestore database on port `10081` at `api-dev.lpubelts.com`.
- Restart the development PM2 process manually after an upload. PM2 file watching can be considered later, but it is not recommended initially.
- Production runs on port `10080` at `api.lpubelts.com` and is updated only through the GitHub Actions release workflow.
- Production uses immutable release directories, an atomic `current` symlink, readiness checks, automatic rollback, and retention of three releases.

This gives development a short edit-test cycle without allowing WebStorm uploads to alter production. It also avoids the extra work of building a development deployment workflow before it is useful.

Build the new production deployment completely alongside the backend that currently serves the frontend. The existing backend remains untouched while `api.lpubelts.com` is configured, exercised, and observed directly. After validation, update the frontend to use `api.lpubelts.com`; that frontend configuration change is the cutover. Setup duration is therefore not a constraint, and no time-limited backend migration window is needed.

The development and production applications share the same DreamHost Managed VPS and Unix account, `lpubelts_api`. Separate directories and tooling conventions provide operational separation, but they are not a filesystem security boundary: any SSH key authenticated as `lpubelts_api` can technically modify both deployments. Production therefore depends on keeping WebStorm mapped only to development and using GitHub Actions as the sole normal production writer.

## Confirmed target configuration

| Setting | Development | Production |
| --- | --- | --- |
| Hostname | `api-dev.lpubelts.com` | `api.lpubelts.com` |
| Port | `10081` | `10080` |
| DreamHost plan | Managed VPS | Managed VPS |
| Unix account | `lpubelts_api` | `lpubelts_api` |
| PM2 name | `lpubelts-api-server-dev` | `lpubelts-api-server-prod-next` during parallel setup |
| `NODE_ENV` | `development` | `production` |
| Firestore project | Existing shared project | Existing shared project |
| Firestore database | `lpubelts-dev` | Production database |
| Update method | WebStorm SFTP and manual PM2 restart | GitHub Actions release workflow |
| Release retention | Mutable checkout; no releases required | Current plus two rollback releases |
| Restart behavior | Brief interruption accepted | Brief interruption accepted |

DreamHost should proxy each HTTPS hostname to its corresponding port. The current server default of `HOST=0.0.0.0` is compatible with DreamHost's proxy requirements. Verify the following independently after setup:

```text
https://api-dev.lpubelts.com/ready
https://api.lpubelts.com/ready
```

If the proxy preserves the existing `/services` prefix, use `/services/ready` instead. Store the actual working production URL in the GitHub `HEALTHCHECK_URL` environment variable.

## Server layout

Keep development and production under distinct roots:

```text
/home/lpubelts_api/apps/
  api-server-dev/
    current-dev/                # Mutable WebStorm upload target
      src/
      package.json
      yarn.lock
      node_modules/
      .env.development -> ../shared/.env.development
    shared/
      .env.development
      credentials/
      uploads/
      generated-data/
      logs/

  api-server-prod/
    current -> releases/<release-id>       # Still to be created
    incoming/                              # Still to be created
    releases/                              # Still to be created
      <git-sha>-<run-id>-<attempt>/
    shared/
      .env.production
      credentials/
      uploads/
      generated-data/
      logs/
```

The development `current-dev` and `shared` directories and the production `shared` directory are already present. Complete the production structure by adding `incoming`, `releases`, an initial release, and the `current` symlink before enabling the workflow.

Credentials, logs, uploads, and generated data must use absolute paths under the applicable `shared` directory. WebStorm must never upload them. Production releases link `shared/.env.production`; development's mutable checkout links `shared/.env.development`.

`COLLECTION_API_DIR` must point to the applicable environment's
`shared/generated-data` directory. The collection analyzer publishes
`collectionStatsByIdFull.json` there, and `/api/v1/stats/collections/*` reads that
same file on each request. Production must not fall back to the copy in a release,
so bootstrap the shared file before starting the API and preserve it across
deployments and rollbacks.

The tracked root `public/` directory is intentional. DreamHost serves those HTML,
icon, manifest, and robots assets separately from Express; the API application
does not mount them as static middleware. Keep the selected DreamHost document
root aligned with the deployed `public/` directory and verify the static site and
API proxy independently after a release.

The tracked PM2 definitions are `ecosystem.dev.json` and `ecosystem.prod.json`.
They use the development `current-dev` or production `current` directory and `src/lpubeltsApiServer.js`.
JSON is intentional: PM2 treated the former `ecosystem.config.dev.cjs` filename
as an application script instead of an ecosystem definition, while a
`.config.js` CommonJS definition conflicts with this repository's ES-module
package type.

The development process is `lpubelts-api-server-dev`. The parallel production
process is `lpubelts-api-server-prod-next`; keep that name after cutover so the
tracked definition, GitHub `PM2_APP_NAME`, rollback commands, monitoring, and
retirement procedure stay aligned. The production workflow rejects a different
name. `ecosystem.prod.json` is the reviewed bootstrap definition for the new
process and does not describe or alter the existing backend.

## Development workflow

### WebStorm SFTP configuration

Create one WebStorm deployment server named clearly, such as `LPU API - DEVELOPMENT`. Map the local repository root to:

```text
/home/lpubelts_api/apps/api-server-dev/current-dev
```

Recommended WebStorm settings:

- Use SFTP on port 22 with the `lpubelts_api` SSH key.
- Keep this development connection as the only writable deployment mapping.
- Do not create a WebStorm production mapping. Use a separate terminal or a read-only inspection profile if production diagnosis is necessary.
- Prefer **upload on explicit save** or **manual upload of changed files**. Upload-on-every-save can transfer an incomplete multi-file edit.
- Exclude `.env*`, `shared/credentials/`, credentials, logs, generated data, `.git/`, `.idea/`, `node_modules/`, and local temporary files.
- Do not enable an option that deletes remote files merely because they are absent locally. Remove obsolete development files deliberately after reviewing the target path.
- Compare local and deployed content before the first upload to prevent an accidental broad overwrite.

WebStorm's automatic upload feature is reasonable for this development target. JetBrains advises against using it for production because partially edited files can be transferred, which is why production remains workflow-only.

### Restart procedure

Use a manual restart as the default:

```bash
pm2 restart lpubelts-api-server-dev
```

Then confirm:

```bash
curl --fail --silent --show-error https://api-dev.lpubelts.com/ready
pm2 logs lpubelts-api-server-dev --lines 100
```

Before the first PM2 start, create the configured log directory because the ecosystem file redirects stdout and stderr there:

```bash
mkdir -p /home/lpubelts_api/apps/api-server-dev/shared/logs
```

Start the JSON process definition from the development `current-dev` directory:

```bash
pm2 start ./ecosystem.dev.json --only lpubelts-api-server-dev
```

A manual restart is safer than PM2 watch with SFTP. WebStorm uploads files individually, and PM2 could restart after the first file while related files are still transferring. Manual restart creates a clear boundary after the complete change set is present.

When `package.json` or `yarn.lock` changes, upload both files, connect over SSH, and run this from the development `current-dev` directory before restarting:

```bash
corepack yarn install --immutable
node --check src/lpubeltsApiServer.js
pm2 restart lpubelts-api-server-dev
```

Do not upload a local `node_modules` directory. Native packages such as `sharp` need to be installed for the DreamHost server platform.

If PM2 watch is enabled later, add a delay and ignore `node_modules`, `.env*`, credentials, logs, uploads, and generated data. It will still be less predictable for multi-file uploads than an explicit restart.

### Development source discipline

The mutable development directory can accumulate stale or uncommitted files, so use this sequence for changes intended for production:

1. Make the change on a short-lived Git branch in WebStorm.
2. Upload the complete changed file set to development.
3. Restart development and test the affected behavior.
4. Commit exactly the files that were tested and push the branch to GitHub.
5. Merge only after tests and lint pass.
6. Deploy that `main` commit through the production workflow.

Periodically compare or refresh the development directory from a clean local checkout of `main`. This prevents old files on the server from making a development test pass differently from the production commit.

The combined collection command remains the only scheduled collection pipeline.
Catalog, Reddit, and Discord refreshes run inside that command when their explicit
enable flags are true; when a refresh is disabled, preflight validates the
corresponding local snapshot before any export starts. Do not create independent
schedules for those refreshes at this time.

## Development Firebase configuration

The development environment file should select the shared Firebase project and the `lpubelts-dev` database explicitly:

```dotenv
NODE_ENV=development
API_PORT=10081
LPU_JOB_ENV=development
FIRESTORE_DATABASE_ID=lpubelts-dev
ALLOW_PRODUCTION_JOB=false
```

Also set `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_PATH`, `CORS_ORIGIN`, and the required feature-specific paths and flags. Their real values belong only in `shared/.env.development`.

Use a development-specific service account whose permissions are limited to the `lpubelts-dev` database where Firebase supports that boundary. Never copy the production environment file into development. Keep email, production uploads, live imports, moderation actions, and scheduled live-data jobs disabled unless they are explicitly configured for safe development targets.

Because development enables `/echo` and `/boom`, restrict access to `api-dev.lpubelts.com` if it should not be public. DreamHost notes that `.htaccess` behavior may not apply through its proxy, so access control must be placed in a layer that is confirmed to handle the proxied request or in the application itself.

## Optional local server

A local server is useful but is not required for this initial process. The repository is already close to supporting it: when `NODE_ENV` is unset, the server uses the `local` environment and loads `.env.local`.

To use it later:

1. Copy the variable schema from `.env.example` into the ignored `.env.local` file.
2. Assign an unused local `API_PORT`, such as `8081`.
3. Set `LPU_JOB_ENV=development`, `FIRESTORE_DATABASE_ID=lpubelts-dev`, and `ALLOW_PRODUCTION_JOB=false`.
4. Point `FIREBASE_SERVICE_ACCOUNT_PATH` and writable output paths to local files and directories.
5. Add the local frontend origin to `CORS_ORIGIN`.
6. Run `yarn install`, then `node src/lpubeltsApiServer.js`.

This would still access the remote development Firestore database. A Firebase emulator can be introduced later if fully isolated, offline local development becomes valuable. Do not point a local runtime at the production database for routine development.

## Production workflow

Production should continue toward the existing `.github/workflows/deploy-production.yml` design. It already validates `main`, runs tests and lint, transfers a tracked-files-only archive over SFTP, verifies its checksum, installs dependencies, switches a `current` symlink, reloads PM2, calls a readiness URL, and restores the previous symlink on failure.

The workflow initially manages only the new production deployment at `api.lpubelts.com`. It does not replace, restart, or reconfigure the backend currently used by the frontend.

Complete and use that design as follows:

1. Create a GitHub environment named `production`, restricted to `main`.
2. Store the production host, user, deploy root, Node binary path, PM2 name, readiness URL, private key, and verified host key in that environment.
3. Keep the manual `deploy-production` confirmation input.
4. Configure yourself as the required reviewer if the repository plan supports environment reviewers. Because you are currently the only reviewer, allow initiator self-review; otherwise no production deployment could proceed.
5. Set `DEPLOY_ROOT` to `/home/lpubelts_api/apps/api-server-prod`.
6. Bootstrap `lpubelts-api-server-prod-next` from the tracked `ecosystem.prod.json`; it runs `current/src/lpubeltsApiServer.js` with `cwd` set to `current`.
7. Keep fork mode with one instance. The accepted brief restart interruption means cluster mode is unnecessary.
8. Retain three successful releases: the current release and two rollback candidates.

Production files must not be uploaded from WebStorm or edited in place. Fixes go through GitHub, tests, and the production workflow even when the corresponding development test used WebStorm upload.

### Production rollback

There are two rollback levels after frontend cutover:

1. If the new API deployment is healthy but has an application regression, redeploy a known-good `main` SHA or switch its `current` symlink to one of the two retained rollback releases.
2. If the new API path has a broader routing, configuration, or compatibility problem, restore the frontend's former API base URL and redeploy the frontend. Keep the old backend unchanged and available specifically for this fallback period.

For an urgent release rollback on the new production deployment:

1. Resolve the current symlink and identify one of the two retained rollback releases.
2. Atomically point `current` to that release.
3. Restart only `lpubelts-api-server-prod-next`, which is also the GitHub environment's `PM2_APP_NAME`.
4. Verify the production readiness URL and a low-impact user flow.

Do not automatically roll back `.env.production`, credentials, Firebase data, uploads, or export-state files. Those need separate, situation-specific procedures.

## Parallel production bring-up and frontend cutover

No deadline-limited maintenance window is needed. The new production directory, PM2 process, proxy, GitHub environment, and release workflow can be completed and tested while the frontend continues using the current backend. Brief restarts of the new process during setup are invisible to existing users.

Before starting the new process, inspect the current PM2 list and listening ports. If the current backend already owns port `10080`, run the new deployment on another unused proxy-compatible port, such as `10082`, during parallel validation and point `api.lpubelts.com` to that port. The public URL does not expose the internal port. After the old backend is retired, the new process may remain on the alternate port or be moved to the intended final port `10080` during a separate controlled restart. Do not stop or move the existing process merely to make `10080` available during setup.

Use this sequence:

1. Build the new production root, shared environment, PM2 definition, and first immutable release without touching the current backend.
2. Configure the `api.lpubelts.com` proxy and certificate for port `10080` if it is free, or for a temporary unused port if the current backend already owns `10080`.
3. Verify Node 24, Corepack, Yarn 4.18.0, PM2, dependencies, ownership, reboot recovery, readiness, logs, and release rollback.
4. Exercise read-only and low-impact API behavior directly against `api.lpubelts.com`.
5. Point a local or non-production frontend build at `api.lpubelts.com` and complete end-to-end testing. Add only the exact test frontend origin to `CORS_ORIGIN` if needed, then remove it when testing is complete.
6. Confirm that scheduled jobs, imports, email, uploads, and other side effects will not run twice while both backends exist. Keep each production cron job assigned to only one deployment.
7. Deploy the frontend change that selects `https://api.lpubelts.com` as its production API base URL.
8. Monitor readiness, fatal-error exits, PM2 restarts for `lpubelts-api-server-prod-next`, and representative user flows after the frontend cutover.
9. Keep the old backend runnable for at least one normal operating cycle, preferably one week. Extend this period if infrequent scheduled jobs have not yet run through the new path.
10. After the observation period, disable the old process but retain its files and configuration for a further short recovery period. Remove it only through a separately reviewed cleanup.

Direct testing against production data, starting or restarting either production process, enabling cron jobs, deploying the frontend cutover, and retiring the old backend still require explicit approval under this repository's operating rules.

## PM2 and reboot management

After creating or changing either process:

1. Confirm `pm2 describe <app-name>` shows the expected script, working directory, Node version, and environment.
2. Run `pm2 save` so the process list can be restored.
3. On this Managed VPS, where `sudo` may not be available, configure a reviewed DreamHost `@reboot` cron entry that sets the correct Node/PM2 `PATH` and runs `pm2 resurrect` for `lpubelts_api`.
4. Test process restoration during a planned server restart. `pm2 save` by itself does not start PM2 after reboot.

For the first production start, use the exact sanitized-environment command in
`.github/DEPLOYMENT.md`, then inspect `pm2 env <pm_id>`. The environment loader
does not override variables already inherited by PM2, so the initial process
must not retain stale API or job configuration. The tracked production definition
allows PM2 12 seconds to stop the process; the application marks readiness false,
stops accepting connections, and allows a 10-second drain. Fatal process and
listener errors use the same drain and then exit nonzero so PM2 can restart the
process.

The collection analyzer writes historical daily files independently from current
publication. After a backfill, it publishes API and public current data from the
newest available backup. Lock photo coverage counts only media entries with an
image URL, and the top-250 segment first selects locks by views before counting
their image coverage.

Keep both applications on the same Node 24 patch release, Yarn 4.18.0, and reviewed PM2 version. Test runtime upgrades in development first. Configure log rotation and monitor disk use, especially because each retained production release has its own `node_modules` tree.

## Routine operation

| Event | Development | Production |
| --- | --- | --- |
| Application edit | WebStorm uploads changed files | No direct upload |
| Activation | Manual PM2 restart | GitHub Actions activation and PM2 restart |
| Dependency change | SSH `yarn install --immutable`, syntax check, restart | Workflow installs into the new release |
| Verification | `/ready`, logs, affected feature | `/ready`, logs, low-impact smoke test |
| Rollback | Re-upload/revert the development files | Switch to one of two retained releases |
| Configuration change | Edit server-side shared file, then restart dev | Separately reviewed edit, then restart prod |

Weekly, review PM2 status, logs, restart counts, disk use, and failed workflows. Monthly, delete obsolete production releases while preserving exactly three successful versions, check deploy-key access, and confirm development still uses `lpubelts-dev`. Test a production rollback procedure periodically without changing live data.

## Implementation order

1. Verify ownership and permissions on `/home/lpubelts_api/apps/api-server-dev` and `/home/lpubelts_api/apps/api-server-prod`.
2. Complete the production root with `incoming`, `releases`, an initial release, and a `current` symlink; add the stable subdirectories required beneath both `shared` directories.
3. Validate the workflow and tracked PM2 definitions use `src/lpubeltsApiServer.js`, the new deployment roots, and `lpubelts-api-server-prod-next`.
4. Configure `.env.development` for port `10081` and `lpubelts-dev`; verify all live-effect features are disabled or use development targets.
5. Configure DreamHost proxies and SSL for both hostnames and ports.
6. Point the development PM2 process at the mutable development `current-dev` directory.
7. Configure WebStorm's development-only SFTP mapping, exclusions, and explicit-save/manual upload behavior.
8. Exercise upload, dependency update, manual restart, readiness, and log inspection in development.
9. Complete the GitHub production environment and immutable production release root.
10. With explicit approval, start and test the new production deployment at `api.lpubelts.com` while the frontend continues using the old backend.
11. Validate release rollback, reboot recovery, production CORS, and end-to-end frontend behavior against the new API.
12. With explicit approval, deploy the frontend API-base-URL cutover and monitor it.
13. Keep the old backend available for at least one normal operating cycle, then retire and later remove it through separately reviewed steps.

## References

- [Current repository production deployment notes](../.github/DEPLOYMENT.md)
- [DreamHost persistent processes](https://help.dreamhost.com/hc/en-us/articles/214869648-Persistent-processes)
- [DreamHost Node.js overview](https://help.dreamhost.com/hc/en-us/articles/217185397-Node-js-overview)
- [DreamHost proxy server](https://help.dreamhost.com/hc/en-us/articles/217955787-Proxy-Server)
- [DreamHost shell access](https://help.dreamhost.com/hc/en-us/articles/216385837-Creating-a-user-with-Shell-SSH-access)
- [DreamHost custom cron jobs](https://help.dreamhost.com/hc/en-us/articles/215767047-Creating-a-custom-Cron-Job)
- [GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [PM2 ecosystem files](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- [PM2 startup and resurrection](https://pm2.keymetrics.io/docs/usage/startup/)
- [WebStorm deployment tutorial](https://www.jetbrains.com/help/webstorm/tutorial-deployment-in-product.html)
