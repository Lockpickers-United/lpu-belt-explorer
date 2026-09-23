# Firebase Runtime Targets

Firebase Admin initialization is centralized in `src/api/services/firebaseAdmin.js`. API code must use its exported helpers instead of creating additional Firebase Admin applications.

## Environment contract

Development and production use the same Firebase project with separate Firestore databases.

| Setting | Development | Production |
| --- | --- | --- |
| `NODE_ENV` | `development` | `production` |
| `API_PORT` | `10081` | `10080`, unless a temporary parallel port is required |
| `LPU_JOB_ENV` | `development` | `production` |
| `FIRESTORE_DATABASE_ID` | `lpubelts-dev` | the configured production database ID |
| `ALLOW_PRODUCTION_JOB` | `false` | `true` only where production access is intended and approved |

Each environment also requires:

- `FIREBASE_PROJECT_ID`
- an absolute `FIREBASE_SERVICE_ACCOUNT_PATH`, or `GOOGLE_APPLICATION_CREDENTIALS` as a fallback
- `FIRESTORE_DATABASE_ID`
- `LPU_JOB_ENV`

The service-account JSON stays outside releases and should be referenced from the environment using an absolute path. Its `project_id` must match `FIREBASE_PROJECT_ID`.

## Safety guards

`src/api/services/firebaseAdmin.js` treats either of these conditions as production access:

- `LPU_JOB_ENV=production`
- `FIRESTORE_DATABASE_ID=(default)`

Production access requires `ALLOW_PRODUCTION_JOB=true`. Development must use `FIRESTORE_DATABASE_ID=lpubelts-dev` and keep `ALLOW_PRODUCTION_JOB=false`. Do not use the default or production database as a substitute for missing development configuration.

Never print or commit service-account contents, bearer tokens, private profile data, or environment secrets. Tests must mock Firebase rather than contact a real project.

## Initialization behavior

The Firebase service module is import-safe and initializes lazily. It validates the environment and service-account project before creating an app. The app/cache identity includes the Firebase project, database ID, and credential path, allowing tests or controlled processes to address distinct configurations without silently reusing the wrong app.

The module exports:

- `getFirebaseAdminApp()` for the validated, named Admin app
- `getFirestoreDb()` for the selected Firestore database
- `verifyFirebaseIdToken()` for authentication token verification

Use `getFirestoreDb()` for database access so the configured named database is honored. Changes to this module require isolated tests and must not initialize credentials or contact Firebase merely by being imported.
