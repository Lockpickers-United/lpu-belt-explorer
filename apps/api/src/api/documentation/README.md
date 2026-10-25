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

### Reddit OAuth for member belt import

`POST /reddit/oauth/start` and `POST /reddit/oauth/exchange` require a Firebase ID token and return `Cache-Control: private, no-store`. Start accepts `purpose: "import"` or explicit `"debugImport"`, a 32-character lowercase hexadecimal browser nonce, and the exact root callback URI in `REDDIT_REDIRECT_URI`. The browser stores the nonce and pending purpose in session storage. Exchange accepts Reddit's one-use `code` and `state` plus that nonce. The server binds state to the verified Firebase UID and nonce, expires it after 10 minutes, and consumes it before contacting Reddit. `beltRequest` is not accepted by these endpoints.

Use one Reddit **web app** per hosted environment: development registers `https://dev.lpubelts.com/` and production registers `https://lpubelts.com/`, including the trailing slash. Set that environment's `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_REDIRECT_URI`, and a descriptive `REDDIT_USER_AGENT` only on its API server. The matching frontend requests its own root URI. After Reddit adds `code` and `state` query parameters there, the frontend routes to its hash-based `/auth/reddit` callback. A local `http://localhost:3000/` flow needs its own Reddit app if each app permits one callback URI. Keep this OAuth configuration separate from the Reddit belt-refresh job's credentials. [Reddit's OAuth guide](https://github.com/reddit-archive/reddit/wiki/OAuth2) requires the authorization redirect to match the registered URI.

This is the traditional OAuth flow for an external website. [Reddit's Devvit FAQ](https://developers.reddit.com/docs/guides/faq) says Devvit handles authentication for apps built on Reddit and treats external websites separately; [Reddit's Help Center](https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=19623931614484) still points traditional OAuth clients to `reddit.com/prefs/apps`. Before live testing, confirm that the use case is covered by explicit Reddit Data API approval under its [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy). Its [request form](https://support.reddithelp.com/hc/en-us/requests/new?tf_42139884615700=api_request_type_developer_clone&ticket_form_id=14868593862164) is for use cases unsupported by Devvit; describe both environments as one project if a request is needed.

Exchange requests temporary `identity flair privatemessages` access, reads `/api/v1/me`, `/r/lockpicking/api/flairselector`, and `/message/inbox`, then attempts to revoke the token. Its response contains the verified username, raw flair text, only r/lockpicking moderator private messages (`id`, `subject`, `body`, `createdUtc`), and the old and proposed next bookmark. The old bookmark is read from the authenticated user's profile in the configured Firestore database only when its linked username matches Reddit's verified identity (case-insensitively). The server does not write the profile or awards. The frontend may persist `nextBookmark` only after it handles a complete successful response; `debugImport` must remain an explicit download with no writes. [Synthetic start response](../requirements/samples/reddit-oauth-start.json) and [exchange response](../requirements/samples/reddit-oauth-exchange.json) illustrate the contract.

The server reads at most five inbox pages of 100 items and returns at most 256 KiB of relevant message JSON. It allows eight seconds for each Reddit call and 30 seconds for the import attempt before revocation. A scan that reaches either cap fails with `reddit_import_too_large` (HTTP 413), without partial messages or a bookmark update. Rate limits use `reddit_rate_limited` (429); timeouts use `reddit_timeout` (504); other exchange, identity, flair, or inbox failures use stable `reddit_*` codes (502). The callback should display these errors and let the member retry. An oversized first import currently cannot resume; add a continuation flow before release if real development imports hit the cap. Token and message contents must not enter server logs. Configure Firestore TTL for `redditOAuthStates.expiresAt`; the API enforces expiry independently of TTL cleanup.

### Discord OAuth for award import and belt requests

`POST /discord/oauth/start` and `POST /discord/oauth/exchange` require a Firebase ID token and return `Cache-Control: private, no-store`. Start accepts `purpose: "import"` or `"beltRequest"`, a 32-character hexadecimal browser nonce, and a callback URI exactly listed in `DISCORD_REDIRECT_URIS`. Belt requests also require `returnTo: "/beltRequests"`. The client stores the nonce in session storage and follows the returned Discord authorization URL. After Discord redirects back, exchange accepts its `code` and `state` plus the nonce. State is bound to the authenticated Firebase UID and browser nonce, expires after 10 minutes, and is consumed once.

Exchange returns Discord's verified ID, username, avatar URL, and verification time. For `beltRequest`, it also returns a one-use `postingGrant` expiring after 15 minutes, which the posting API consumes. For `import`, it returns no grant. Existing profile Discord fields support award import and display only; they cannot authorize posting. No Discord access token is sent to or stored by the browser. [Synthetic start response](../requirements/samples/discord-oauth-start.json) and [exchange response](../requirements/samples/discord-oauth-exchange.json) illustrate the contract.

Configure `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and comma-separated `DISCORD_REDIRECT_URIS` on the API server. Allowlist each exact callback URI for production and development in both the server setting and Discord Developer Portal. The frontend requests `<site origin>/` (for example, `https://lpubelts.com/` or `http://localhost:3000/`); after Discord returns with query parameters, the app recognizes its pending OAuth session and routes to `/#/auth/discord`. Register the root URI, not the hash route, and verify it with the live Discord application before release. Keep the client secret only in server secret storage. Configure Firestore TTL on `expiresAt` for `discordOAuthStates` and `discordPostingGrants`; expiry is enforced by the API even before cleanup. Deploy the server configuration before a frontend build that uses these endpoints, then rotate the previously browser-exposed Discord client secret during the approved release.

### Discord belt request posting

`POST /belt-requests/discord` requires a Firebase ID token, the one-use `postingGrant`, and structured `request` data. The request has `requestBelt`, `entries`, and `quests`, plus optional Dan evidence, project/mentoring details, notes, and `redditUsername`. The server validates HTTP(S) evidence links and Discord embed limits, derives `userId` and `userName` only from the verified grant, and sends a `New Belt Request` embed with `allowed_mentions.parse: []`. It attempts delivery once with Discord's `wait=true` response. A successful response returns the webhook message, channel, guild IDs, and message URL; it confirms delivery, not LockyJr acceptance. [Synthetic response](../requirements/samples/discord-belt-request-post.json) illustrates the shape. An expired or used grant requires a new OAuth flow. On a timeout or unreadable response, the client should check the channel before retrying because the grant has been consumed.

Posting is disabled unless `BELT_REQUEST_WEBHOOK_TARGET` is explicitly set to `test` or `production`. Test mode uses the server-only `TEST_WEBHOOK_URL` and requires webhook ID `1562162476009660489`; its confirmed target is guild `140129091796992000`, channel `1360395141822812311` (#announcement-reactions). Production mode requires only `BELT_REQUEST_WEBHOOK_URL`. The URL must be a Discord HTTPS webhook URL. Before posting in production, the server retrieves the webhook's guild and channel from Discord using that URL to construct the message link and verify the delivery response. Keep URLs in protected server environment storage; never put them in browser configuration or logs. A test-mode success link opens the webhook message in #announcement-reactions, while LockyJr's separate announcement appears in #belt-requests. Do not enable either target until the bot contract and release gates in the frontend implementation plan are complete.

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
`publish` also permits publication and approval updates. A closed stage returns `503
writes_disabled`. Claims and record ownership checks still apply at every stage.
Promote the server stage before the frontend's matching
`VITE_CLASSIFICATION_WRITE_STAGE` build setting, and verify each stage in development.

| Route | Access | Data |
| --- | --- | --- |
| `GET /classification/entries/{entryId}/votes` | Eligible reader | One lock's paged modern votes, current/previous flags, entry revision and next cursor. |
| `GET /classification/entries/{entryId}/action` | Admin | Current editable action or `null`, including internal `adminNote`. |
| `GET /classification/actions/staged` | Eligible reader | Included staged actions, without `adminNote`. |
| `GET /classification/publications` | Eligible reader | Paged immutable publication headers. |
| `GET /classification/publications/{publicationId}` | Eligible reader | One publication and its ordered action snapshots, each with manual `approved` verification. |
| `POST /classification/votes`; `PATCH/DELETE /classification/votes/{voteId}` | Voting claim; owner or admin for edit/delete | Canonical vote changes and resulting entry revision. |
| `POST /classification/votes/{voteId}/move` | Admin | Move a vote to another lock and update both lock summaries atomically. |
| `POST /classification/actions`; `PATCH/DELETE /classification/actions/{actionId}` | Admin | Editable decision changes and resulting entry revision. |
| `POST /classification/publications` | Admin | Batch publication of 1–50 included Staged actions. |
| `POST /classification/publications/single` | Admin | Save and publish one form decision, leaving other staged actions alone. |
| `PATCH /classification/publications/{publicationId}/actions/{actionId}/approval` | Admin | Set or clear the manual `approved` boolean on one published action snapshot. |

Publication action intent and catalog details remain fixed after publishing. The `approved`
boolean starts false and is the only editable field on a published snapshot. Older snapshots
without the field are treated as unapproved by the frontend. Approval records the catalog
manager's production-site verification; it does not change the calculated catalog
reconciliation status or the underlying `classificationActions` record.

`Add New Sameline` adds a named lock to an existing catalog entry. Its
`newSamelineName` must contain non-whitespace text (at most 256 characters); it has
no belt change or sameline target ID. The name is stored on the editable action
and its publication action snapshot. Publishing records the decision; the
catalog still needs the normal Sheet import, and this change requires manual
review during reconciliation because the compact catalog contains only a
combined display name.

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
response status classes, while the [frontend recommendation](../../../../../internal-docs/classification-public-data-recommendation.md)
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
