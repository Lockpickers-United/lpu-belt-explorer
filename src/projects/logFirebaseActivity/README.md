# Firebase-activity logging runtime

The public `POST /log-activity` endpoint accepts aggregate Firebase read, write, and refresh activity and emits structured `firebase accessed` records through the shared Pino logger. Despite its historical name, this component does not initialize Firebase or write to Firestore; PM2 captures its production log output.

This batch does not change `processFirebaseActivityLog.js` or other read-only local-log processing.

## Configuration

The POST endpoint is disabled unless explicitly enabled:

```dotenv
FIREBASE_ACTIVITY_LOGGING_ENABLED=true
FIREBASE_ACTIVITY_MAX_BATCH_SIZE=100
FIREBASE_ACTIVITY_MAX_STRING_LENGTH=500
```

An enabled endpoint also requires the shared runtime settings:

```dotenv
LPU_JOB_ENV=local|development|production
ALLOW_PRODUCTION_JOB=true
```

`ALLOW_PRODUCTION_JOB=true` is required only when `LPU_JOB_ENV=production`. Batch size and string length are optional; their accepted ranges are 1–1,000 entries and 10–2,000 characters.

If `FIREBASE_ACTIVITY_LOGGING_ENABLED` is absent or `false`, the server still starts and `POST /log-activity` returns `503` with the code `firebase_activity_disabled`. Invalid enabled configuration fails server startup. The existing diagnostic `GET /log-activity` remains available independently of ingestion.

## Input contract

`activityData` may be one object or an array. Each entry accepts:

- `type`: `READ`, `WRITE`, or `REFRESH` (`activity` remains a legacy alias).
- `count`: a non-negative integer (`activityCount` remains a legacy alias).
- `source`: required non-empty string.
- `id`, `displayName`, and `trigger`: optional strings.

Blank optional values are removed. Unknown fields are ignored. Zero-count reads and writes are discarded, while zero-count refreshes are retained for compatibility.

The server derives `prod` from `LPU_JOB_ENV`; caller-supplied `prod` values are ignored. This prevents clients from misclassifying activity while preserving the field in emitted log records.

## Safety properties

- Importing the handler, configuration, or runtime does not require runtime configuration or process activity.
- `USER` and `LOGNAME` do not select logging behavior.
- Arbitrary payload fields cannot be copied into application logs.
- Batch size, string size, activity type, and count are validated before any entry is logged.
- Logging failures propagate to centralized error handling instead of being reported as successful.
- The endpoint remains unauthenticated to preserve existing browser and server-job callers. Its payload is bounded and whitelisted, but authentication or rate limiting can be added as a separate API-contract change.
