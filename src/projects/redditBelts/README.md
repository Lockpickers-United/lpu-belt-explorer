# Reddit belt refresh runtime

The `/fetch-reddit-flairs` endpoint runs the configured Python/PRAW integration and publishes `redditUserFlairs.json` and `redditBeltCounts.json`. Server startup creates the component runtime and injects its handler into the route.

Both `GET` and `POST` require a valid Firebase bearer token whose custom claims contain the exact boolean value `lpuAdmin: true`. Missing or invalid tokens receive `401`; authenticated users without that claim receive `403` with the code `lpu_admin_required`. `GET` retains the existing diagnostic response, while `POST` performs the refresh.

## Configuration

The endpoint is disabled unless explicitly enabled:

```dotenv
REDDIT_BELTS_ENABLED=true
REDDIT_BELTS_SCRIPT_PATH=/absolute/path/to/fetch_reddit_flairs.py
REDDIT_CREDENTIALS_PATH=/absolute/path/to/reddit-keys.json
REDDIT_BELTS_OUTPUT_DIR=/absolute/path/to/public/data
REDDIT_BELTS_PYTHON_EXECUTABLE=python3
REDDIT_BELTS_TIMEOUT_MS=120000
REDDIT_BELTS_MAX_OUTPUT_BYTES=10485760
```

An enabled endpoint also requires the shared runtime settings:

```dotenv
LPU_JOB_ENV=local|development|production
ALLOW_PRODUCTION_JOB=true
```

`ALLOW_PRODUCTION_JOB=true` is required only when `LPU_JOB_ENV=production`. The Python executable, timeout, and output limit are optional. The timeout must be between 1,000 and 300,000 milliseconds; the output limit must be between 1 KiB and 50 MiB.

When this refresh runs in the combined collection pipeline, set `REDDIT_BELTS_OUTPUT_DIR` to the same directory as `COLLECTION_PUBLIC_DATA_DIR`. The downstream export-all processor reads `redditBeltCounts.json` from that shared public-data directory.

If `REDDIT_BELTS_ENABLED` is absent or `false`, the server still starts and authorized `POST /fetch-reddit-flairs` requests return `503` with the code `reddit_belts_disabled`. Invalid or incomplete enabled configuration fails server startup.

## Safety properties

- Importing the handler, configuration, runtime, or CLI does not load credentials, execute Python, contact Reddit, create directories, or write output files.
- Script, credential, and output paths come only from explicit configuration; `USER` and `LOGNAME` have no effect.
- Python execution has configurable time and output limits, and stderr is not returned to clients.
- Upstream output is validated before publication.
- Both output files are fully staged before either existing file is replaced.
- Overlapping HTTP requests share one in-flight refresh instead of racing to publish files.
- Production error responses omit stack details.
- Firebase authentication and the `lpuAdmin: true` custom claim are enforced before refresh work begins.

The browser client already sends the current Firebase user's ID token through the shared `postData` helper.

## Command-line use

The standalone runner loads `.env.<NODE_ENV>` from the repository root before validating the same explicit configuration used by the server. The path is resolved from the runner module, so it does not depend on cron's working directory. Imports remain side-effect free; environment loading occurs only during direct execution.

```bash
NODE_ENV=production node /absolute/path/to/explore-lpubelts-com-node/src/projects/redditBelts/runGetRedditBelts.js --check-config
NODE_ENV=production node /absolute/path/to/explore-lpubelts-com-node/src/projects/redditBelts/runGetRedditBelts.js
```

A cron entry should use absolute executable, script, and log paths. For example:

```cron
15 * * * * NODE_ENV=production /absolute/path/to/node /absolute/path/to/explore-lpubelts-com-node/src/projects/redditBelts/runGetRedditBelts.js >> /absolute/path/to/logs/reddit-belts-cron.log 2>&1
```

Replace the example paths with the production paths. `NODE_ENV=production` selects `.env.production`; that file must contain the enabled Reddit configuration shown above, including `LPU_JOB_ENV=production` and `ALLOW_PRODUCTION_JOB=true`.

`--check-config` does not load credentials, run Python, contact Reddit, or write files. Running the refresh accesses Reddit and may publish production data, so it remains approval-gated.
