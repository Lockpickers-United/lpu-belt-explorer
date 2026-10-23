# Firebase repository layout

The Firebase CLI project lives in `../../firebase`. Its main config, project aliases, active Firestore rules and indexes, scoped rules configs, and Cloud Functions package are kept together:

| File | Purpose |
| --- | --- |
| `../../firebase/firebase.json` | Main config: rules for both `(default)` and `lpubelts-dev`, indexes only for `lpubelts-dev`, Functions, and local emulators. |
| `../../firebase/.firebaserc` | CLI aliases (`default` is `lputest`; `prod` is `lpu-belt-explorer`). |
| `../../firebase/firestore.rules` | Current tracked rules source for both databases. A local file does not prove what is deployed. |
| `../../firebase/firestore.indexes.json` | Tracked indexes and TTL override. |
| `../../firebase/firebase.rules-dev.json` | Rules-only config for `lpubelts-dev`. |
| `../../firebase/firebase.rules-prod.json` | Rules-only config for `(default)`. |
| `../../firebase/classificationRules.firebase.json` | Isolated Auth/Firestore emulator config for the Classification rules test. |
| `../../firebase/functions` | Separate CommonJS Cloud Functions package. |

From the repository root, pass a config path to the Firebase CLI, for example `firebase emulators:start --config firebase/firebase.json --project demo-lpubelts`. The CLI resolves rules, indexes, and Functions source paths relative to the selected config directory. Run Functions lint with `npm --prefix firebase/functions run lint`; the root `../../package.json` scripts already pass the appropriate config for emulator tests. The Web SDK emulator fixture remains under `tests/firebase/` because it is test-only.

The Functions integration tests use the main two-database config to verify trigger wiring. With Firebase CLI 15.34.0, the Firestore emulator reports that it cannot apply rules from that multi-database config and allows emulator reads and writes. Use the dedicated Classification rules emulator test when verifying rules enforcement; the Functions integration tests are not rules tests.

The duplicate `firebase.classification.test.json` fixture, the completed 2026-10-16 production transition config and rules, and the generated `firestore-debug.log` were removed during this reorganization. The transition release and its exact ruleset hash remain documented in [the Classification release report](../classification/classification-public-data-report.md) and Git history. The deployed baseline captured on 2026-10-13 remains in [the historical rules snapshot](firestore-rules-deployed-baseline-2026-10-13.rules); it is not an active CLI rules source.

Production deployments and live-data scripts still require separate approval. Consult [Firebase data safety](../../.agents/references/firebase-data-safety.md) before running either.
