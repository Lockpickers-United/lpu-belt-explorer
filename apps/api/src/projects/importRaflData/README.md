# RAFL preview runtime

The `/refresh-preview` endpoint fetches three tabs from the configured Google Sheet and publishes the generated RAFL preview JSON files. Server startup creates the component runtime and injects its handler into the route.

Every request requires a valid Firebase bearer token whose custom claims contain the exact boolean value `raflAdmin: true`. Missing or invalid tokens receive `401`; authenticated users without that claim receive `403` with the code `rafl_admin_required`.

## Configuration

The endpoint is disabled unless explicitly enabled:

```dotenv
RAFL_PREVIEW_ENABLED=true
RAFL_SHEET_ID=your-google-sheet-id
RAFL_PREVIEW_OUTPUT_DIR=/absolute/path/to/public/data
RAFL_PREVIEW_TIMEOUT_MS=15000
```

An enabled endpoint also requires the shared runtime settings:

```dotenv
LPU_JOB_ENV=local|development|production
ALLOW_PRODUCTION_JOB=true
```

`ALLOW_PRODUCTION_JOB=true` is required only when `LPU_JOB_ENV=production`. `RAFL_PREVIEW_TIMEOUT_MS` is optional and must be between 1,000 and 60,000 milliseconds.

If `RAFL_PREVIEW_ENABLED` is absent or `false`, the server still starts and `GET /refresh-preview` returns `503` with the code `rafl_preview_disabled`. Invalid or incomplete enabled configuration fails server startup.

## Safety properties

- Importing the handler, configuration, or runtime does not load keys, contact Google, create directories, write files, or start an import.
- The Google Sheet ID and output directory come only from explicit configuration; `USER` and `LOGNAME` have no effect.
- The three sheets are fetched concurrently with a timeout and a 5 MiB response limit per sheet.
- Validation and media-reference checks complete before any preview file is replaced.
- All JSON files are fully staged before replacement. The version file is replaced last and acts as the publication marker.
- Overlapping refresh requests share one in-flight import instead of racing to publish files.
- Operational failures return a non-2xx response and do not terminate the server process.
- Firebase authentication and the `raflAdmin: true` custom claim are enforced before import work begins.

The endpoint remains a `GET` for compatibility with the current frontend. Changing it to a mutation method should be handled as a separate API contract migration.

The frontend sends the current Firebase user's token automatically. The `npm run refreshRaflPreview` command in `lpu-belt-explorer` requires a current authorized token in `RAFL_ADMIN_ID_TOKEN`; do not place that token in a tracked file or command-line argument.
