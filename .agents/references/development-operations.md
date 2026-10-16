# Development Operations

## Update model

WebStorm uploads changed files over SFTP into:

```text
/home/lpubelts_api/apps/api-server-dev/current-dev
```

Exclude `.env*`, credentials, `node_modules`, logs, uploads, and generated runtime data from automatic uploads. Install dependencies on the server when `package.json` or `yarn.lock` changes.

The server and command-line jobs validate `NODE_ENV` as `local`, `development`, or `production` and load the matching file from the repository root. This single file contains the API, integration, `COLLECTION_*`, and `LOG_ANALYSIS_*` job settings. Link that path to the protected shared file once during setup:

```sh
ln -s ../shared/.env.development /home/lpubelts_api/apps/api-server-dev/current-dev/.env.development
```

Confirm that the destination does not already exist before creating the link. WebStorm must exclude the link path as well as `.env*` so an upload cannot replace it.

Do not create additional environment files under `src/projects`. Standalone jobs and the combined collection runner use the same protected root file, while their config modules validate only the variables each job needs.

The combined web-log job is `scripts/runFetchAnalyzeLogs.js`. It uses the pinned
Node executable through `process.execPath`, then runs the FTP fetch, daily
analyzer, and aggregate processor in order. Set
`LOG_ANALYSIS_FTP_ENABLED=true` only where the job is authorized to contact the
configured FTP host. `--check-config` validates and prints the effective paths
and non-secret FTP settings without contacting FTP or catalog services.

Development catalog snapshots live at
`/home/lpubelts_api/apps/api-server-dev/shared/snapshots`. Configure that absolute
path as `LPU_CATALOG_DIR`; the optional catalog refresh job writes the older
array-format catalogs there before the combined runner's export jobs begin.
For the Classification API, set `CLASSIFICATION_CATALOG_PATH` to the absolute
`shared/snapshots/classification-catalog.json` file. The frontend repository's
manual `Publish Classification catalog to development` workflow validates the
reviewed `main` compact file against `data.json`, uploads it with the
configured SSH credentials, verifies its checksum, and atomically replaces the
file at that path. The API loader detects subsequent replacements without a
restart. An initial `.env.development` or API-code update still requires the
normal development PM2 restart below.

`CLASSIFICATION_WRITE_STAGE` defaults to `read`. After the API version with this
gate is uploaded and restarted, promote the protected development setting through
`vote`, `action`, and `publish` only after the preceding stage's checks pass; restart
the development PM2 process after each setting change. Promote the frontend's
`VITE_CLASSIFICATION_WRITE_STAGE` build setting only after its matching server
stage is verified. The frontend build workflow reads that value from the
`github-pages` environment variable; an unset or invalid value stays read-only.

Use a manual PM2 restart after an upload:

```sh
pm2 restart lpubelts-api-server-dev
```

PM2 file watching remains disabled. A multi-file SFTP upload is not atomic, so watching can restart the server while only part of a change is present.

## PM2 declaration

The tracked development declaration is `ecosystem.dev.json`. Its application name is `lpubelts-api-server-dev`, its working directory is the development `current-dev` directory, and it starts `src/lpubeltsApiServer.js` with `NODE_ENV=development`.

Do not restore the former `ecosystem.config.dev.cjs` filename. PM2 did not recognize that file as an ecosystem declaration and instead started the configuration file as the application. The failure signature was:

- process name `ecosystem.config.dev`
- default logs under `/home/lpubelts_api/.pm2/logs/`
- inherited `NODE_ENV=production`
- no API listener or application log output

PM2's JavaScript ecosystem filename convention requires a `.config.js` suffix. JSON avoids the CommonJS/ES-module filename conflict in this ES-module repository and is read correctly by PM2.

## First start and verification

Run these commands from the DreamHost shell after the files, environment, and environment-file symlink are in place:

```sh
cd /home/lpubelts_api/apps/api-server-dev/current-dev
mkdir -p /home/lpubelts_api/apps/api-server-dev/shared/logs
pm2 delete ecosystem.config.dev
pm2 start ./ecosystem.dev.json --only lpubelts-api-server-dev
pm2 describe lpubelts-api-server-dev
pm2 logs lpubelts-api-server-dev --lines 100
curl --fail http://127.0.0.1:10081/ready
pm2 save
```

The delete command only removes the stale, incorrectly named process and may report that it does not exist. Save the PM2 process list only after the readiness check passes.

Configured PM2 logs are:

```text
/home/lpubelts_api/apps/api-server-dev/shared/logs/lpubeltsApiServer-out.log
/home/lpubelts_api/apps/api-server-dev/shared/logs/lpubeltsApiServer-error.log
```

## Dependency changes

Before Phase 1 begins and whenever `.nvmrc` changes, verify that the development server's protected Node binary directory provides the exact pinned version:

```sh
cd /home/lpubelts_api/apps/api-server-dev/current-dev
export PATH="/absolute/path/from/the/server/REMOTE_NODE_BIN:$PATH"
test "$(node --version)" = "v$(tr -d '[:space:]' < .nvmrc)"
corepack yarn --version
```

Use the development host's actual protected binary directory in place of the placeholder. Do not infer it from a developer workstation or a legacy script path.

When a development upload changes dependency declarations, run the repository's pinned Node and Yarn versions on the server before restarting:

```sh
cd /home/lpubelts_api/apps/api-server-dev/current-dev
corepack yarn install --immutable
pm2 restart lpubelts-api-server-dev
curl --fail http://127.0.0.1:10081/ready
```

## Direct execution and logging

The direct diagnostic command is:

```sh
NODE_ENV=development node /home/lpubelts_api/apps/api-server-dev/current-dev/src/lpubeltsApiServer.js
```

The logger intentionally behaves differently under PM2. `src/logger/logger.js` detects `pm_id` and writes production-style JSON output to stdout and stderr; PM2 captures those streams in the configured files. A direct development run uses pretty console output and the development file log.

If direct execution works but PM2 does not:

1. Confirm the process is named `lpubelts-api-server-dev`.
2. Confirm `pm2 describe lpubelts-api-server-dev` shows `NODE_ENV=development` and the expected script and working directory.
3. Inspect the configured shared log files and `pm2 logs`.
4. Confirm port `10081` is listening and request `/ready` over loopback. Verify the returned environment and release identity and confirm `ready` is true.
5. Delete any stale `ecosystem.config.dev` process before starting the JSON declaration.

## Optional local development

The server can also run locally. The default environment is `local`, which reads `.env.local`. A local process should still target the development Firebase database with production-job permission disabled unless it is explicitly configured for Firebase emulators.
