# Request-lock runtime configuration

The request-lock HTTP handlers are import-safe and receive Firebase, filesystem,
email, and activity-logging dependencies from `requestLockRuntime.js`.

The primary server validates this configuration and creates the upload directory
before it starts listening:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Controls runtime logging and error detail only |
| `LPU_JOB_ENV` | Explicitly identifies `local`, `development`, or `production` operation |
| `FIREBASE_PROJECT_ID` | Expected Firebase project ID |
| `FIRESTORE_DATABASE_ID` | Explicit database ID, such as `lpubelts-dev` or `(default)` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Absolute path to the service-account JSON file |
| `REQUESTED_LOCKS_UPLOAD_DIR` | Absolute directory for uploaded request images |
| `REQUESTED_LOCKS_PUBLIC_URL` | Public HTTP(S) URL corresponding to the upload directory |
| `ALLOW_PRODUCTION_JOB` | Must be `true` for production mode or the default Firestore database |

Example development values:

```bash
NODE_ENV=development
LPU_JOB_ENV=development
FIREBASE_PROJECT_ID=lpu-belt-explorer
FIRESTORE_DATABASE_ID=lpubelts-dev
FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/service-account.json
REQUESTED_LOCKS_UPLOAD_DIR=/absolute/path/to/requestedLocks
REQUESTED_LOCKS_PUBLIC_URL=https://example.test/img/requestedLocks
```

`USER`, `LOGNAME`, request bodies, and `NODE_ENV` never select the database.
Production mode and `(default)` database access fail unless
`ALLOW_PRODUCTION_JOB=true` is explicitly configured.
