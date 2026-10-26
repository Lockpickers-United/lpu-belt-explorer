# Production Bootstrap Release

This runbook creates the one initial production release required before the
normal GitHub Actions deployment workflow can run. The workflow deliberately
requires both an existing `current` symlink and an existing PM2 application so
that every automated deployment has a known rollback target.

This is a production-changing procedure. Obtain the required production
approval before uploading the archive, modifying the production layout,
starting PM2, or making readiness requests that exercise the live service.

After bootstrap, deploy subsequent releases through **Actions -> Deploy
production**. Do not repeat this manual process for routine releases.

## Preconditions

Before starting:

- Merge the production-ready pull request into `main`.
- Confirm the GitHub `production` environment is configured as described in
  `.github/DEPLOYMENT.md`.
- Confirm the production host has the protected Node directory configured as
  `REMOTE_NODE_BIN`; its Node version must match `.nvmrc`.
- Prepare `/home/lpubelts_api/apps/api-server-prod/shared/.env.production`.
- Keep `APP_RELEASE_ID` and `APP_GIT_SHA` out of `.env.production`; the release
  obtains those values from `.release.json`.
- Seed `collectionStatsByIdFull.json` and `lockVideos.json` in
  `/home/lpubelts_api/apps/api-server-prod/shared/generated-data/api-data/`.
- Ensure every path named in `.env.production`, including credentials and
  writable upload/output directories, exists with suitable permissions.
- Configure DreamHost to proxy `api.lpubelts.com` to the production API port.

The deployment account must be able to write the production `incoming`,
`releases`, and `current` paths and manage the configured PM2 application.

## 1. Package the merged `main` commit locally

Update the local `main` branch and confirm that the checkout is clean:

```sh
git switch main
git pull --ff-only origin main
git status --short
```

`git status --short` must print nothing. Create a release archive directly from
the merged commit so untracked files, local configuration, and credentials
cannot enter the release:

```sh
BOOTSTRAP_GIT_SHA="$(git rev-parse HEAD)"
BOOTSTRAP_RELEASE_ID="${BOOTSTRAP_GIT_SHA}-bootstrap"
BOOTSTRAP_ARCHIVE="/tmp/${BOOTSTRAP_RELEASE_ID}.tar.gz"

test "$BOOTSTRAP_GIT_SHA" = "$(git rev-parse origin/main)"

git archive \
  --format=tar.gz \
  --output="$BOOTSTRAP_ARCHIVE" \
  "$BOOTSTRAP_GIT_SHA"

shasum -a 256 "$BOOTSTRAP_ARCHIVE" |
  awk '{print $1}' > "${BOOTSTRAP_ARCHIVE}.sha256"

printf 'Release: %s\nArchive: %s\n' \
  "$BOOTSTRAP_RELEASE_ID" "$BOOTSTRAP_ARCHIVE"
```

Record the printed release ID and full Git SHA. The release ID becomes both the
server directory name and the identity returned by `/ready`.

## 2. Upload the archive and checksum

Use the verified production SSH hostname and an authorized deployment key.
Upload these two files:

```text
/tmp/<release-id>.tar.gz
/tmp/<release-id>.tar.gz.sha256
```

to:

```text
/home/lpubelts_api/apps/api-server-prod/incoming/
```

Do not extract the archive into `current`. The bootstrap release belongs under
`releases/<release-id>`, and `current` must remain a symlink.

## 3. Verify and assemble the release on the production host

Connect to the production host over verified SSH. Set the values below using
the exact Git SHA from step 1 and the same protected Node path stored in the
GitHub environment as `REMOTE_NODE_BIN`:

```sh
bootstrap_deploy_root='/home/lpubelts_api/apps/api-server-prod'
bootstrap_git_sha='<40-character SHA from step 1>'
bootstrap_release_id="${bootstrap_git_sha}-bootstrap"
bootstrap_node_bin='<absolute REMOTE_NODE_BIN path>'

bootstrap_archive="$bootstrap_deploy_root/incoming/$bootstrap_release_id.tar.gz"
bootstrap_checksum="$bootstrap_archive.sha256"
bootstrap_staging="$bootstrap_deploy_root/releases/.$bootstrap_release_id.staging"
bootstrap_release_dir="$bootstrap_deploy_root/releases/$bootstrap_release_id"
bootstrap_shared_env="$bootstrap_deploy_root/shared/.env.production"
```

Create only the persistent container directories required for bootstrap:

```sh
mkdir -p \
  "$bootstrap_deploy_root/incoming" \
  "$bootstrap_deploy_root/releases" \
  "$bootstrap_deploy_root/shared/logs"
```

Verify the inputs and confirm that the intended release paths are unused:

```sh
test -f "$bootstrap_archive"
test -f "$bootstrap_checksum"
test -f "$bootstrap_shared_env"
test -f "$bootstrap_deploy_root/shared/generated-data/api-data/collectionStatsByIdFull.json"
test -f "$bootstrap_deploy_root/shared/generated-data/api-data/lockVideos.json"
test ! -e "$bootstrap_staging"
test ! -L "$bootstrap_staging"
test ! -e "$bootstrap_release_dir"
test ! -L "$bootstrap_release_dir"

expected_checksum="$(tr -d '[:space:]' < "$bootstrap_checksum")"
actual_checksum="$(sha256sum "$bootstrap_archive" | awk '{print $1}')"
test "$actual_checksum" = "$expected_checksum"
```

Stop if any check fails. Do not overwrite or reuse an existing release
directory.

Extract into a staging directory, link the protected environment, and write the
release identity required by production startup:

```sh
mkdir "$bootstrap_staging"
tar -xzf "$bootstrap_archive" -C "$bootstrap_staging"

ln -s "$bootstrap_shared_env" \
  "$bootstrap_staging/.env.production"

printf '{"releaseId":"%s","gitSha":"%s"}\n' \
  "$bootstrap_release_id" \
  "$bootstrap_git_sha" \
  > "$bootstrap_staging/.release.json"
```

Select the protected runtime, confirm it matches the tracked pin, install the
locked dependencies inside the release, and perform the same syntax check used
by the deployment workflow:

```sh
export PATH="$bootstrap_node_bin:$PATH"

command -v node
command -v corepack
command -v pm2

cd "$bootstrap_staging"

required_node_version="$(tr -d '[:space:]' < .nvmrc)"
test "$(node --version)" = "v$required_node_version"

corepack yarn --version
corepack yarn install --immutable
node --check src/lpubeltsApiServer.js
```

The Yarn version must match the `packageManager` value in `package.json`. Once
all checks succeed, publish the complete release directory:

```sh
cd "$bootstrap_deploy_root"
mv "$bootstrap_staging" "$bootstrap_release_dir"
```

The release now contains its own source, manifests, runtime configuration, and
`node_modules`. Shared environment, credentials, generated data, logs, uploads,
and other mutable state remain outside it.

## 4. Create the initial `current` symlink

This step assumes `current` does not yet exist. Verify that condition rather
than replacing an existing path:

```sh
test ! -e "$bootstrap_deploy_root/current"
test ! -L "$bootstrap_deploy_root/current"

ln -s "$bootstrap_release_dir" "$bootstrap_deploy_root/current"
test "$(readlink "$bootstrap_deploy_root/current")" = "$bootstrap_release_dir"
```

The relevant layout is now:

```text
/home/lpubelts_api/apps/api-server-prod/
  current -> releases/<git-sha>-bootstrap
  incoming/
  releases/
    <git-sha>-bootstrap/
      .env.production -> /home/lpubelts_api/apps/api-server-prod/shared/.env.production
      .release.json
      node_modules/
      package.json
      src/
  shared/
    .env.production
    generated-data/
      api-data/
        collectionStatsByIdFull.json
        lockVideos.json
    logs/
```

## 5. Bootstrap and inspect PM2

Start the tracked production declaration with a deliberately small inherited
environment:

```sh
cd "$bootstrap_deploy_root/current"

env -i HOME="$HOME" PATH="$PATH" \
  pm2 start ./ecosystem.prod.json \
  --only lpubelts-api-server-prod-next

pm2 describe lpubelts-api-server-prod-next
```

Use the numeric PM2 ID reported by `pm2 describe` to inspect the process:

```sh
pm2 env <pm_id>
```

Confirm all of the following before saving the PM2 process list:

- the name is `lpubelts-api-server-prod-next`;
- the working directory is the production `current` symlink;
- the script is `current/src/lpubeltsApiServer.js`;
- `NODE_ENV=production`;
- the runtime is the Node version pinned by `.nvmrc`;
- no stale API, job, or credential values were inherited by PM2.

Inspect the configured PM2 logs if the process does not remain online:

```sh
pm2 logs lpubelts-api-server-prod-next --lines 100
```

## 6. Verify readiness and save the process list

First verify the process over the production loopback port:

```sh
curl --fail --silent --show-error \
  http://127.0.0.1:10080/ready
```

The JSON response must contain `"ready":true` and the exact bootstrap release
ID. Then verify the public proxy and the representative API endpoint used by
the deployment workflow:

```sh
curl --fail --silent --show-error \
  https://api.lpubelts.com/ready

curl --fail --silent --show-error \
  https://api.lpubelts.com/api/v1/stats/collections/locks \
  > /dev/null
```

Only after the process environment and both readiness paths are correct, save
the PM2 process list:

```sh
pm2 save
```

The host now satisfies the workflow bootstrap requirements: `current` is a
symlink to a complete working release, and the expected PM2 application exists.

## 7. Use the normal workflow for subsequent releases

Configure the GitHub `production` environment values from
`.github/DEPLOYMENT.md`, then run **Actions -> Deploy production -> Run
workflow** from `main` with the `deploy-production` confirmation.

The workflow will package the selected `main` commit, upload and verify its
archive, create a new immutable release, link the shared environment, write its
release metadata, install dependencies, switch `current`, reload PM2, verify the
exact release through readiness, run the public API smoke test, and restore the
bootstrap release automatically if activation fails.

Retain the bootstrap release as a rollback candidate until at least two later
production releases have been successfully deployed and reviewed.
