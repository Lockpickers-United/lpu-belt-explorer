# Development Operations

## Update model

WebStorm uploads changed files over SFTP into:

```text
/home/lpubelts_api/apps/api-server-dev/current
```

Exclude `.env*`, credentials, `node_modules`, logs, uploads, and generated runtime data from automatic uploads. Install dependencies on the server when `package.json` or `yarn.lock` changes.

The server and command-line jobs validate `NODE_ENV` as `local`, `development`, or `production` and load the matching file from the repository root. This single file contains the API, integration, and `COLLECTION_*` job settings. Link that path to the protected shared file once during setup:

```sh
ln -s ../shared/.env.development /home/lpubelts_api/apps/api-server-dev/current/.env.development
```

Confirm that the destination does not already exist before creating the link. WebStorm must exclude the link path as well as `.env*` so an upload cannot replace it.

Do not create additional environment files under `src/projects`. Standalone jobs and the combined collection runner use the same protected root file, while their config modules validate only the variables each job needs.

Use a manual PM2 restart after an upload:

```sh
pm2 restart lpubelts-api-server-dev
```

PM2 file watching remains disabled. A multi-file SFTP upload is not atomic, so watching can restart the server while only part of a change is present.

## PM2 declaration

The tracked development declaration is `ecosystem.dev.json`. Its application name is `lpubelts-api-server-dev`, its working directory is the development `current` directory, and it starts `src/lpubeltsApiServer.js` with `NODE_ENV=development`.

Do not restore the former `ecosystem.config.dev.cjs` filename. PM2 did not recognize that file as an ecosystem declaration and instead started the configuration file as the application. The failure signature was:

- process name `ecosystem.config.dev`
- default logs under `/home/lpubelts_api/.pm2/logs/`
- inherited `NODE_ENV=production`
- no API listener or application log output

PM2's JavaScript ecosystem filename convention requires a `.config.js` suffix. JSON avoids the CommonJS/ES-module filename conflict in this ES-module repository and is read correctly by PM2.

## First start and verification

Run these commands from the DreamHost shell after the files, environment, and environment-file symlink are in place:

```sh
cd /home/lpubelts_api/apps/api-server-dev/current
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

When a development upload changes dependency declarations, run the repository's pinned Yarn version on the server before restarting:

```sh
cd /home/lpubelts_api/apps/api-server-dev/current
yarn install --immutable
pm2 restart lpubelts-api-server-dev
curl --fail http://127.0.0.1:10081/ready
```

## Direct execution and logging

The direct diagnostic command is:

```sh
NODE_ENV=development node /home/lpubelts_api/apps/api-server-dev/current/src/lpubeltsApiServer.js
```

The logger intentionally behaves differently under PM2. `src/logger/logger.js` detects `pm_id` and writes production-style JSON output to stdout and stderr; PM2 captures those streams in the configured files. A direct development run uses pretty console output and the development file log.

If direct execution works but PM2 does not:

1. Confirm the process is named `lpubelts-api-server-dev`.
2. Confirm `pm2 describe lpubelts-api-server-dev` shows `NODE_ENV=development` and the expected script and working directory.
3. Inspect the configured shared log files and `pm2 logs`.
4. Confirm port `10081` is listening and request `/ready` over loopback.
5. Delete any stale `ecosystem.config.dev` process before starting the JSON declaration.

## Optional local development

The server can also run locally. The default environment is `local`, which reads `.env.local`. A local process should still target the development Firebase database with production-job permission disabled unless it is explicitly configured for Firebase emulators.
