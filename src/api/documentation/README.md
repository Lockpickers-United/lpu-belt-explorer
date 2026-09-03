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

## Base URLs

Local development:

```txt
http://localhost:8081/api/v1
```

Production:

```txt
https://explore.lpubelts.com/api/v1
```

If Apache or a proxy rewrites paths differently in production, update the production base URL before publishing the API externally.

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

### GET `/stats/collections/locks`

Returns aggregate lock collection stats.

Access:

- public
- read-only

Source:

- generated JSON summary
- `src/data/collectionStatsByIdFull.json`

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
- derived from `src/data/collectionStatsByIdFull.json`

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
- derived from `src/data/collectionStatsByIdFull.json`

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
