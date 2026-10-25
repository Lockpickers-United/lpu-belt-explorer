# Deployment Topology

## Monorepo boundary

Source now lives at `<monorepo>/apps/api`. Release archives and development SFTP mappings place that package’s contents directly at the existing application roots. Host `current`, `current-dev`, PM2 entry points and shared state paths stay stable. The original API repository remains the release authority until the approved Phase 5 transfer.

## Confirmed environment map

Development and production run on the same DreamHost Managed VPS under the `lpubelts_api` shell account. They remain separate through hostnames, ports, PM2 process names, environment files, Firebase database IDs, and deployment directories.

| Environment | Public hostname | Internal port | Application root |
| --- | --- | ---: | --- |
| Development | `api-dev.lpubelts.com` | `10081` | `/home/lpubelts_api/apps/api-server-dev` |
| Production | `api.lpubelts.com` | `10080` | `/home/lpubelts_api/apps/api-server-prod` |

The application entry point is `src/lpubeltsApiServer.js`.

DreamHost should proxy each HTTPS hostname to its assigned loopback port. The frontend uses the hostname, so the internal production port may temporarily differ during a parallel migration if port `10080` is still occupied by the old backend.

## Directory layout

Development is a mutable working tree populated by WebStorm:

```text
/home/lpubelts_api/apps/api-server-dev/
├── current-dev/             # uploaded development application
│   └── .env.development -> ../shared/.env.development
└── shared/
    ├── .env.development     # server-only environment values
    └── logs/                # persistent PM2 logs
```

Production uses immutable releases:

```text
/home/lpubelts_api/apps/api-server-prod/
├── current -> releases/<release-id>
├── incoming/                # uploaded archives before activation
├── releases/
│   └── <release-id>/        # one complete application release
└── shared/
    ├── .env.production      # server-only environment values
    ├── generated-data/      # persistent collection API output
    ├── snapshots/           # persistent downloaded catalog inputs
    └── logs/                # persistent process logs, if configured
```

`current` must point to one specific release, such as:

```text
current -> /home/lpubelts_api/apps/api-server-prod/releases/20260922T184500Z
```

It must never point to the `releases` directory itself. The specific target makes activation atomic and makes rollback a symlink change.

## Release and shared boundaries

Each production release contains the tracked source, `package.json`, `yarn.lock`, Yarn configuration, runtime configuration, and its own production dependencies installed on the Linux x64 GitHub runner. Keeping `node_modules` with its matching source and lockfile makes a rollback internally consistent. The deployment checks the production host's platform and loads Sharp before activation.

The `shared` directory is for state that must survive release changes and must not be committed:

- environment files
- credentials and service-account files
- logs
- uploads
- generated data and export state that are intentionally persistent

`COLLECTION_API_DIR` must point to the environment's shared generated-data API
directory. The collection processors and API share
`collectionStatsByIdFull.json` and `lockVideos.json` at that path; production
never silently uses the checked-in fixtures. Readiness requires both files to be
readable.

The Classification API reads the frontend's compact v1
`classification-catalog.json` from the absolute `CLASSIFICATION_CATALOG_PATH`.
The production path is
`/home/lpubelts_api/apps/api-server-prod/shared/snapshots/classification-catalog.json`.
The frontend build workflow verifies this artifact against `data.json`, uploads
it to a temporary path in that directory, checks its SHA-256 remotely, and
atomically replaces the active file after Pages deployment. The API opens the
catalog on each lookup and reloads when its file identity changes; no restart is
needed for later catalog updates. Configure the production path once in the
protected environment file and deploy the updated API loader separately.
Development needs its own verified local compact snapshot and absolute path.
Invalid, missing, or unset catalog files fail Classification requests with 503;
never fall back to test fixtures or a live URL fetch.

Each environment has one protected `.env.<environment>` file linked at the repository root. It contains server and command-line job settings, including `COLLECTION_*`; do not create component-specific environment files inside `src/projects`.

Do not reorganize the repository into a shared application directory. Sharing source files, manifests, or dependencies between releases defeats immutable deployment and can make the previous release unusable after an update.

## Cutover

Build and test the new production deployment alongside the existing backend. Use
the tracked `lpubelts-api-server-prod-next` PM2 process name while both processes
exist and retain it after cutover. Once the new hostname is healthy and verified,
change the frontend API base URL to `https://api.lpubelts.com`.

Keep the old backend available through at least one normal operating cycle, preferably a week, before retirement. Confirm that running both versions does not duplicate cron jobs, exports, emails, or other scheduled side effects.
