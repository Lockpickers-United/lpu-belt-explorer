# Classification public data implementation report

Status: Phase 1 contract drafted from local source; external target confirmations pending, 2026-10-12. This report tracks the [data recommendation](./classification-public-data-recommendation.md). No production or development Firebase database, deployed ruleset, API host, Sheet, exporter, or protected environment file was accessed.

## Phase 1 — Confirm target and contract

The recommendation now records a concrete logical schema, read and command response shapes, reader/write projections, deterministic vote ID, revision and idempotency behavior, and decision milestone behavior. This is a design contract for Phase 2, not an implemented route or Firestore schema. Existing preview forms and JSON continue to be read-only/static.

| Target or owner | Local finding | Confirmation needed before Phase 2 physical work |
| --- | --- | --- |
| Firebase project/databases | `src/auth/firebaseConfig.js` selects named `lpubelts-dev` with `VITE_DEV_FIRESTORE=true`, otherwise default Firestore. The sibling server's runtime contract uses `lpubelts-dev` in development and a configured production database ID, with `(default)` treated as production access. Both are intended in the `lpu-belt-explorer` Firebase project, while this repository's Firebase CLI `default` alias is `lputest` and `prod` is `lpu-belt-explorer`. | Confirm provisioned development and production database IDs **and editions**, and the deployed server's configured production ID. Never infer a target from the CLI's default alias. |
| Firestore rules | `firebase.json` has no Firestore rules source; `tests/firebase/firebaseWebSdk.rules` is only a test fixture. Existing deployed rules and their owner are absent from the local inventory. | Identify who owns current rules for each target database and obtain a reviewed merge/deployment path before any browser Classification read is enabled. Preserve existing collection permissions. |
| API URL/mount | `src/lpubeltsApiServer.js` passes an empty prefix; `src/routes.js` and `src/api/index.js` therefore mount `/api/v1` in that deployment. Sibling topology documents `api-dev.lpubelts.com` and `api.lpubelts.com`; the frontend's `VITE_API_SERVER_URL` fallback remains `https://explore.lpubelts.com/services`. | Confirm live proxy routes, frontend build variable, and CORS configuration in development. The docs describe the intended separate API hosts; local code cannot prove the deployed cutover. |
| Black Belt award authority | `awards/{base64(uid + da7759a9)}` is used for Black Belt award activity, and `DBContext.updateUserStatistics` copies its date to `lockcollections.blackBeltAwardedAt`. `DBContext` also has browser paths that write `awards`, so neither collection can be elevated to an Auth claim without trusted provenance checks. | Select the verified award source, granting/removal workflow, and maximum acceptable claim-removal delay. A profile field alone must not grant the claim. |

The physical database edition, deployed rules, proxy/CORS behavior, and award provenance are open because they cannot be established from tracked source alone. These are Phase 2 gates, rather than reasons to contact production during Phase 1. The user has been asked for the target, award, and API-host decisions; record any answer here before implementation.

### Contract decisions captured

- One vote document per `(entryId, userId)`, with a deterministic server-derived `v_` SHA-256 document ID and the original imported ID in `sourceId`. Synthetic `u_...` identities remain distinct and admin-managed.
- `classificationEntries` is a rebuildable, role-gated summary with only compact vote chips and current-vote aggregates. It carries `decisionMilestoneAt`, a durable `reopened` flag, and the IDs of all voters for the owner summary query. Comments, media URLs, and admin notes stay out of that listener.
- `reopened=true` makes all modern votes current until the next Publish or Settle, including intermediate Pending/Staged work. A new decision milestone is set only on transition to Published/Settled. A later Sheet import cannot move it. Editing an older vote moves that one canonical vote into the current set.
- Full vote detail is a bounded eligible-reader API response. Staged changelog notes are visible to eligible readers; `adminNote` is returned only through the admin action detail and is excluded from publication snapshots. Published actions and publication events are immutable.
- The versioned API uses the existing `{metadata, data}` envelope and `private, no-store` for protected responses. The recommendation now names the vote/action/publication read and command paths, their key fields, access policy, expected revisions, and idempotency behavior. The endpoint contracts still need OpenAPI, exact validation limits/cursor/error-code details, and synthetic service tests in Phase 2.
- `blackBelt` remains a read-only entitlement. Vote writes require verified `admin`, `classificationAdmin`, `lpuMod`, or `classificationTeam` claims, matching the current UI voting policy; admin action and publication writes require `admin` or `classificationAdmin`. UI preview modes and profile timestamps grant no backend permission.

### Blockers and questions for following phases

1. **Target and rules ownership:** obtain the exact database IDs/editions and existing deployed rules source for both targets. A tracked rules file and named-database deployment plan must be reviewed before enabling the proposed client listeners. Rule/query compatibility and indexes need emulator tests, then a development-environment check.
2. **Award trust chain:** determine which approval event makes an award authoritative, who can revoke it, how existing `awards` and `lockcollections` fields reconcile, and how quickly removed claims must stop working. Claim synchronization/backfill is intentionally scheduled for the late release phase, but its source must be selected now.
3. **API cutover:** confirm the actual development proxy mount and CORS origins, then pin the frontend base URL before adding endpoints. The local default targets the older `/services` path.
4. **Migration input and sizing:** the checked-in 183 modern votes are incomplete. The complete Sheet-derived source is needed to check pair uniqueness, IDs, dates, and orphan locks before any import. Measure maximum votes per lock, summary document size, listener reads, and batch-publish transaction size with synthetic prototypes and the confirmed edition.
5. **Publication validation detail:** choose bounded field lengths, page sizes/cursors, operation retention, action transition validation, and stable machine-readable API errors in OpenAPI and tests. The frozen logical contract should be preserved while those limits are set.
6. **Catalog provenance:** `src/data/data.json` has no top-level build/version field. Phase 4 reconciliation needs a build identifier or fingerprint to label the exact bundled catalog it compares; the API should not claim a publication-time catalog version it cannot verify.

### Verification

Only tracked code and documentation were inspected. `git diff --check` passed after the recommendation edit. No unit tests were run because Phase 1 changes documentation only; focused tests will accompany implementation in later phases, with the full suite reserved for the final gate as requested. No generated files or external effects resulted from this phase.
