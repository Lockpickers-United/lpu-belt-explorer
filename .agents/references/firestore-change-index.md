# Firestore Change-Index Contract

Read this reference for Firestore change trackers, their emulator tests, or incremental exporters in either repository.

`functions/index.js` maintains these mappings:

| Source collection | Change-index collection | Exported Function |
| --- | --- | --- |
| `lockcollections` | `lockcollectionsChangeIndex` | `trackLockcollectionChange` |
| `awards` | `awardsChangeIndex` | `trackAwardChange` |
| `evidence` | `evidenceChangeIndex` | `trackEvidenceChange` |

Each index document is keyed by the changed source document ID and records `docId`, `changedAt`, `deleted`, and `sourceCollection`.

The sibling exporters consume this schema. Coordinate changes to fields, collection names, timestamps, deletion semantics, or identifiers with:

- `../explore-lpubelts-com-node/src/projects/collections/collectionsExport.js`
- `../explore-lpubelts-com-node/src/projects/collections/awardsEvidenceExport.js`

`tests/firebase/changeTrackers.integration.js` verifies create, update, and delete behavior for every mapping. It fails closed unless the Firestore host is loopback and the project ID is exactly `demo-lpubelts`. Run it with `npm run test:functions:integration` after tracker or schema changes.

Do not run the real exporters as a routine test. They read Firestore and update export artifacts; live-data execution requires explicit approval. Prefer lint, syntax checks, unit tests, and the isolated emulator suite.

For real-time Firestore UI subscriptions that post usage activity, the initial snapshot is `READ` and later snapshots caused by subscription changes are `REFRESH`. Emit one activity record per snapshot unless the feature explicitly defines another contract.
