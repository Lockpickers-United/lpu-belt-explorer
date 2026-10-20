# LPU Belts API Documentation

## Should this API use OpenAPI?

Yes. Use the OpenAPI Specification for this API.

Reasons:

- The API is versioned under `/api/v1`, so the contract should be explicit.
- The API has mixed data sources: Firebase and generated JSON summaries.
- Some endpoints are public, while others require Firebase authentication.
- OpenAPI gives future clients a stable reference for paths, response shapes, auth requirements, and error behavior.
- The spec can later be used to generate docs, client SDKs, validation tests, or mock servers.

Use this Markdown file as the readable overview and `openapi.yaml` as the machine-readable contract.

Additional docs:

- [Rate limiting](rate-limiting.md)

## Base URLs

Local development:

```txt
http://localhost:8081/api/v1
```

Production:

```txt
https://api.lpubelts.com/api/v1
```

DreamHost proxies the public API hostname to the Node process. Internally, Node
may receive paths like `//api/v1/...`; the server normalizes these before routing.

## Response Pattern

All successful versioned API responses should use:

```json
{
  "metadata": {},
  "data": {}
}
```

`metadata.source` indicates where the data came from:

- `firebase`
- `generated-summary`

Firebase-backed responses include `metadata.fetchedDateTime`.

Generated-summary responses include the summary file's `metadata.updatedDateTime` when available.

## Error Pattern

Errors are handled by the server's centralized error handler and generally return:

```json
{
  "error": {
    "message": "Error message",
    "code": "machine_readable_code",
    "requestId": "request id",
    "path": "/api/v1/...",
    "method": "GET"
  }
}
```

Development responses may include stack traces and additional details.

## Authentication

Public endpoints require no authentication.

Authenticated endpoints require:

```txt
Authorization: Bearer <firebase-id-token>
```

Currently, `GET /users/{id}/profile` allows:

- the authenticated Firebase user whose UID equals `{id}`
- a Firebase token with `admin: true`

## Endpoints

### Classification API prototype

`/classification` is an authenticated Firebase-backed API. Eligible readers have a verified
`admin`, `classificationAdmin`, `lpuMod`, `classificationTeam`, or `blackBelt` claim.
Any of these claims permits vote creation and editing/deletion of the caller's own vote;
only `admin` or `classificationAdmin` may edit/delete another member's vote.
Admin action and publication writes also require `admin` or `classificationAdmin`. Every
Classification response uses `Cache-Control: private, no-store`.

The server's protected `CLASSIFICATION_WRITE_STAGE` setting is an additional rollout gate:
`read` (the default, including missing or invalid values) rejects every mutation;
`vote` permits vote writes; `action` also permits admin draft/stage/settle writes; and
`publish` also permits both publication routes. A closed stage returns `503
writes_disabled`. Claims and record ownership checks still apply at every stage.
Promote the server stage before the frontend's matching
`VITE_CLASSIFICATION_WRITE_STAGE` build setting, and verify each stage in development.

| Route | Access | Data |
| --- | --- | --- |
| `GET /classification/entries/{entryId}/votes` | Eligible reader | One lock's paged modern votes, current/previous flags, entry revision and next cursor. |
| `GET /classification/entries/{entryId}/action` | Admin | Current editable action or `null`, including internal `adminNote`. |
| `GET /classification/actions/staged` | Eligible reader | Included staged actions, without `adminNote`. |
| `GET /classification/publications` | Eligible reader | Paged immutable publication headers. |
| `GET /classification/publications/{publicationId}` | Eligible reader | One immutable publication and its ordered action snapshots. |
| `POST /classification/votes`; `PATCH/DELETE /classification/votes/{voteId}` | Voting claim; owner or admin for edit/delete | Canonical vote changes and resulting entry revision. |
| `POST /classification/votes/{voteId}/move` | Admin | Move a vote to another lock and update both lock summaries atomically. |
| `POST /classification/actions`; `PATCH/DELETE /classification/actions/{actionId}` | Admin | Editable decision changes and resulting entry revision. |
| `POST /classification/publications` | Admin | Batch publication of 1–50 included Staged actions. |
| `POST /classification/publications/single` | Admin | Save and publish one form decision, leaving other staged actions alone. |

Mutations require an `Idempotency-Key` of 8–128 characters. Operation results are stored
with a seven-day expiration timestamp; the planned Firestore TTL policy removes expired
records asynchronously. Vote creates use a deterministic `(entryId, userId)` ID, and edits
require `expectedRevision`. A duplicate vote or stale revision returns `409` with a safe
`error.recovery.current` record. Other stable errors include `invalid_request`,
`invalid_cursor`, `forbidden`, `action_not_publishable`, and `idempotency_conflict`.
Vote moves require the target `entryId` and `expectedRevision`; the moved vote gets the
target lock's deterministic ID. A move rejects an existing vote by that member on the
target lock or a target closed to new votes.

Vote comments are limited to 2,000 characters, media URLs to 2,048 HTTP(S) URL
characters, and changelog/admin notes to 4,000 characters. Paged reads default to 25
and accept at most 100 records. Publication batches accept at most 50 actions. The Node
runtime reads the compact v1 catalog from the absolute `CLASSIFICATION_CATALOG_PATH`
file to validate IDs and snapshot names and belts. The production frontend workflow
publishes the verified file atomically; the API reloads a replaced file on its next
lookup without a restart. Configure the path and release the API loader before enabling
these endpoints. `openapi.yaml` records request schemas and
response status classes, while the [frontend recommendation](../../../../lpu-belt-explorer/internal-docs/classification-public-data-recommendation.md)
records the full logical response shape.

### GET `/locks/{lockId}/videos`

Returns the public YouTube evidence videos indexed for a lock. A lock ID with no
video entry returns `404 lock_videos_not_found`.

Access:

- public
- read-only

Source:

- Firebase evidence, read from the generated index
- `COLLECTION_API_DIR/lockVideos.json`
- production path: `shared/generated-data/api-data/lockVideos.json`

Cache:

- `Cache-Control: public, max-age=300`

Response shape:

```json
{
  "metadata": {
    "source": "generated-summary",
    "fetchedDateTime": "2026-09-28T22:15:46.730Z"
  },
  "data": {
    "lockId": "19573781",
    "videos": [
      {
        "userId": "NdkmYGydSHfPTcj5xuqjwSyJJI42",
        "pickerName": "Greenish",
        "pickerIsBlackBelt": true,
        "url": "https://youtu.be/ENKxPd9X5qQ",
        "date": "2024-05-15"
      }
    ]
  }
}
```

Sample:

- `src/api/requirements/samples/locks-lockId-videos.json`

### GET `/stats/collections/locks`

Returns aggregate lock collection stats.

Access:

- public
- read-only

Source:

- generated JSON summary
- `COLLECTION_API_DIR/collectionStatsByIdFull.json` (the checked-in copy is a non-production fixture)

Cache:

- `Cache-Control: public, max-age=300`

Response shape:

```json
{
  "metadata": {
    "updatedDateTime": "2026-09-03T04:47:18.377Z",
    "source": "generated-summary"
  },
  "data": {
    "locks": [
      {
        "id": "2455f0ae",
        "name": "Master Lock 140 Series, 9140 EURD",
        "totalSaves": 4023,
        "ownCount": 1850,
        "scorecardCount": 246
      }
    ]
  }
}
```

Sample:

- `src/api/requirements/samples/stats-collections-locks.json`

### GET `/stats/collections/locks/own`

Returns aggregate lock ownership counts.

Access:

- public
- read-only

Source:

- generated JSON summary
- derived from `COLLECTION_API_DIR/collectionStatsByIdFull.json`

Cache:

- `Cache-Control: public, max-age=300`

Response shape:

```json
{
  "metadata": {
    "updatedDateTime": "2026-09-03T04:47:18.377Z",
    "source": "generated-summary"
  },
  "data": {
    "locks": [
      {
        "id": "2455f0ae",
        "name": "Master Lock 140 Series, 9140 EURD",
        "ownCount": 1850
      }
    ]
  }
}
```

Sample:

- `src/api/requirements/samples/stats-collections-locks-own.json`

### GET `/stats/collections/locks/scorecard`

Returns aggregate lock scorecard counts.

Access:

- public
- read-only

Source:

- generated JSON summary
- derived from `COLLECTION_API_DIR/collectionStatsByIdFull.json`

Cache:

- `Cache-Control: public, max-age=300`

Response shape:

```json
{
  "metadata": {
    "updatedDateTime": "2026-09-03T04:47:18.377Z",
    "source": "generated-summary"
  },
  "data": {
    "locks": [
      {
        "id": "2455f0ae",
        "name": "Master Lock 140 Series, 9140 EURD",
        "scorecardCount": 246
      }
    ]
  }
}
```

Sample:

- `src/api/requirements/samples/stats-collections-locks-scorecard.json`

### GET `/users/{id}/summary`

Returns a public summary of a user's saved collections.

Access:

- public
- read-only

Source:

- Firebase Firestore
- collection: `lockcollections`
- document ID: `{id}`

Cache:

- `Cache-Control: public, max-age=60`

Response shape:

```json
{
  "metadata": {
    "source": "firebase",
    "fetchedDateTime": "2026-09-03T00:00:00.000Z"
  },
  "data": {
    "userId": "GGplAdctTfVDLVvYsfIADJmfp8f2",
    "collections": {
      "safelocksOwn": [],
      "scorecard": [],
      "own": [],
      "wishlist": []
    }
  }
}
```

Sample:

- `src/api/requirements/samples/users-userId-summary.json`

### GET `/users/{id}`

Alias for `GET /users/{id}/summary`.

Access, source, cache behavior, and response shape are the same as `/users/{id}/summary`.

### GET `/users/{id}/wishlist`

Returns a public user's wishlist.

Access:

- public
- read-only

Source:

- Firebase Firestore
- collection: `lockcollections`
- document ID: `{id}`

Cache:

- `Cache-Control: public, max-age=60`

Response shape:

```json
{
  "metadata": {
    "source": "firebase",
    "fetchedDateTime": "2026-09-03T00:00:00.000Z"
  },
  "data": {
    "userId": "GGplAdctTfVDLVvYsfIADJmfp8f2",
    "wishlist": []
  }
}
```

Sample:

- `src/api/requirements/samples/users-userId-wishlist.json`

### GET `/users/{id}/profile`

Returns an authenticated user's profile.

Access:

- authenticated
- read-only

Source:

- Firebase Firestore
- collection: `lockcollections`
- document ID: `{id}`

Cache:

- `Cache-Control: private, no-store`

Authorization:

- caller UID must match `{id}`, or
- caller token must include `admin: true`

Response shape:

```json
{
  "metadata": {
    "source": "firebase",
    "fetchedDateTime": "2026-09-03T00:00:00.000Z"
  },
  "data": {
    "userId": "GGplAdctTfVDLVvYsfIADJmfp8f2",
    "profile": {}
  }
}
```

Sample:

- `src/api/requirements/samples/users-userId-profile.json`

## Current Local Test URLs

```txt
http://localhost:8081/api/v1/stats/collections/locks
http://localhost:8081/api/v1/stats/collections/locks/own
http://localhost:8081/api/v1/stats/collections/locks/scorecard
http://localhost:8081/api/v1/locks/19573781/videos

http://localhost:8081/api/v1/users/GGplAdctTfVDLVvYsfIADJmfp8f2/summary
http://localhost:8081/api/v1/users/GGplAdctTfVDLVvYsfIADJmfp8f2/wishlist
http://localhost:8081/api/v1/users/GGplAdctTfVDLVvYsfIADJmfp8f2/profile
```

Authenticated profile example:

```bash
curl \
  -H "Authorization: Bearer <firebase-id-token>" \
  http://localhost:8081/api/v1/users/GGplAdctTfVDLVvYsfIADJmfp8f2/profile
```

## Future Development Rules

- Keep all externally consumed endpoints under `/api/v1`.
- Keep the `{ metadata, data }` response envelope.
- Use explicit public/authenticated/admin access decisions per endpoint.
- Use allowlisted response fields for public endpoints.
- Prefer generated summaries for expensive aggregate data.
- Use live Firebase reads only when freshness matters.
- Add an OpenAPI path and schema entry when adding an endpoint.
- Add or update a sample response when changing an endpoint shape.
